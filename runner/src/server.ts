import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawn } from "node:child_process";
import * as tar from "tar";
import {
  DEVNET_RPC_URL,
  RunnerJobPayload,
  RunnerJobType,
  RunnerPolicy,
  assertExecutableExists,
  defaultPolicy,
  redactSecrets,
  sanitizeArchivePath,
  validateRunnerJobPayload,
} from "./policy";

type JobStatus = "queued" | "running" | "completed" | "failed";

type JobLogEvent = {
  stream: "stdout" | "stderr" | "system";
  line: string;
  at: number;
};

type JobResult = {
  exitCode: number;
  stdoutTail: string;
  stderrTail: string;
  outputFilesTarGzBase64?: string;
  artifactsMeta: {
    outputFiles: string[];
    durationMs: number;
  };
};

type JobRecord = {
  id: string;
  payload: RunnerJobPayload;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  logs: JobLogEvent[];
  stdout: string;
  stderr: string;
  result?: JobResult;
  subscribers: Set<ServerResponse<IncomingMessage>>;
};

const PORT = Number(process.env.RUNNER_PORT ?? 8787);
const SHARED_SECRET = process.env.RUNNER_SHARED_SECRET ?? "";
const policy: RunnerPolicy = defaultPolicy;
const jobs = new Map<string, JobRecord>();
const workspaceRateState = new Map<string, { count: number; resetAt: number }>();
const workspaceRunningCount = new Map<string, number>();

function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

async function readBody(req: IncomingMessage, maxBytes = 25 * 1024 * 1024): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > maxBytes) {
      throw new Error("Request body too large");
    }
    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
}

function verifySignature(req: IncomingMessage, rawBody: Buffer): void {
  if (!SHARED_SECRET) {
    return;
  }

  const timestamp = req.headers["x-runner-timestamp"];
  const signature = req.headers["x-runner-signature"];

  if (typeof timestamp !== "string" || typeof signature !== "string") {
    throw new Error("Missing runner signature headers");
  }

  const ageMs = Math.abs(Date.now() - Number(timestamp));
  if (!Number.isFinite(ageMs) || ageMs > 5 * 60 * 1000) {
    throw new Error("Runner signature timestamp expired");
  }

  const computed = createHmac("sha256", SHARED_SECRET)
    .update(`${timestamp}.${rawBody.toString("utf8")}`)
    .digest("hex");

  const provided = Buffer.from(signature, "hex");
  const expected = Buffer.from(computed, "hex");

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    throw new Error("Invalid runner signature");
  }
}

function appendLog(job: JobRecord, stream: JobLogEvent["stream"], line: string): void {
  const redacted = redactSecrets(line);
  const entry: JobLogEvent = {
    stream,
    line: redacted,
    at: Date.now(),
  };
  job.logs.push(entry);

  const payload = `event: log\ndata: ${JSON.stringify(entry)}\n\n`;
  for (const subscriber of job.subscribers) {
    subscriber.write(payload);
  }
}

function finalizeSubscribers(job: JobRecord): void {
  const doneEvent = `event: done\ndata: ${JSON.stringify({ status: job.status, jobId: job.id })}\n\n`;
  for (const subscriber of job.subscribers) {
    subscriber.write(doneEvent);
    subscriber.end();
  }
  job.subscribers.clear();
}

function enforceWorkspaceJobQuota(workspaceId: string): void {
  const now = Date.now();
  const current = workspaceRateState.get(workspaceId);
  if (!current || current.resetAt <= now) {
    workspaceRateState.set(workspaceId, {
      count: 1,
      resetAt: now + 60_000,
    });
    return;
  }

  if (current.count >= policy.maxJobsPerMinutePerWorkspace) {
    throw new Error("Workspace job rate limit exceeded");
  }

  workspaceRateState.set(workspaceId, {
    ...current,
    count: current.count + 1,
  });
}

function acquireWorkspaceConcurrency(workspaceId: string): void {
  const current = workspaceRunningCount.get(workspaceId) ?? 0;
  if (current >= policy.maxConcurrentJobsPerWorkspace) {
    throw new Error("Workspace concurrent job limit exceeded");
  }
  workspaceRunningCount.set(workspaceId, current + 1);
}

function releaseWorkspaceConcurrency(workspaceId: string): void {
  const current = workspaceRunningCount.get(workspaceId) ?? 0;
  if (current <= 1) {
    workspaceRunningCount.delete(workspaceId);
    return;
  }
  workspaceRunningCount.set(workspaceId, current - 1);
}

function commandForJob(job: RunnerJobPayload): { command: string; args: string[] } {
  const args = job.args ?? {};

  switch (job.jobType) {
    case "anchor_build":
      return { command: "anchor", args: ["build"] };
    case "anchor_test":
      return { command: "anchor", args: ["test"] };
    case "anchor_deploy":
      return { command: "anchor", args: ["deploy", "--provider.cluster", DEVNET_RPC_URL] };
    case "anchor_idl_build":
      return { command: "anchor", args: ["idl", "build"] };
    case "anchor_idl_fetch": {
      const programId = args.programId;
      if (!programId || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(programId)) {
        throw new Error("anchor_idl_fetch requires valid args.programId");
      }
      return {
        command: "anchor",
        args: ["idl", "fetch", programId, "--provider.cluster", DEVNET_RPC_URL],
      };
    }
    case "solana_balance":
      return { command: "solana", args: ["balance"] };
    case "solana_airdrop": {
      const amount = args.amount ?? "1";
      return { command: "solana", args: ["airdrop", amount] };
    }
    case "solana_transfer": {
      const recipient = args.recipient;
      const amount = args.amount;
      if (!recipient || !amount) {
        throw new Error("solana_transfer requires args.recipient and args.amount");
      }
      return { command: "solana", args: ["transfer", recipient, amount] };
    }
    case "solana_config_get":
      return { command: "solana", args: ["config", "get"] };
    case "solana_config_set":
      return { command: "solana", args: ["config", "set", "--url", "devnet"] };
    case "cargo_build":
      return { command: "cargo", args: ["build"] };
    case "cargo_test":
      return { command: "cargo", args: ["test"] };
    default:
      throw new Error(`Unsupported job type: ${job.jobType satisfies never}`);
  }
}

async function ensureWorkspaceLimits(workspaceDir: string): Promise<void> {
  let count = 0;
  let bytes = 0;

  async function walk(relative = ""): Promise<void> {
    const absolute = join(workspaceDir, relative);
    const entries = await readdir(absolute, { withFileTypes: true });

    for (const entry of entries) {
      const child = relative ? `${relative}/${entry.name}` : entry.name;
      const clean = sanitizeArchivePath(child);
      const absoluteChild = join(workspaceDir, clean);

      if (entry.isDirectory()) {
        await walk(clean);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const fileStat = await stat(absoluteChild);
      count += 1;
      bytes += fileStat.size;

      if (count > policy.maxFiles) {
        throw new Error(`Workspace exceeds max files (${policy.maxFiles})`);
      }
      if (bytes > policy.maxUncompressedBytes) {
        throw new Error(`Workspace exceeds max uncompressed size (${policy.maxUncompressedBytes} bytes)`);
      }
    }
  }

  await walk();
}

async function extractWorkspaceArchive(base64: string, toDir: string): Promise<void> {
  const compressed = Buffer.from(base64, "base64");
  if (compressed.length > policy.maxCompressedBytes) {
    throw new Error(`Workspace archive too large (${compressed.length} bytes)`);
  }

  const archivePath = join(toDir, "workspace.tar.gz");
  await writeFile(archivePath, compressed);
  await mkdir(join(toDir, "workspace"), { recursive: true });

  await tar.x({
    file: archivePath,
    cwd: join(toDir, "workspace"),
    strict: true,
    filter: (entryPath) => {
      sanitizeArchivePath(entryPath);
      return true;
    },
  });

  await ensureWorkspaceLimits(join(toDir, "workspace"));
}

async function collectOutputFiles(workspaceDir: string): Promise<string[]> {
  const includeRoots = ["target/idl", "target/deploy", "logs"];
  const output: string[] = [];

  for (const root of includeRoots) {
    const abs = join(workspaceDir, root);
    try {
      const rootStat = await stat(abs);
      if (!rootStat.isDirectory()) continue;
    } catch {
      continue;
    }

    const stack = [root];
    while (stack.length > 0) {
      const next = stack.pop();
      if (!next) continue;
      const entries = await readdir(join(workspaceDir, next), { withFileTypes: true });

      for (const entry of entries) {
        const rel = sanitizeArchivePath(`${next}/${entry.name}`);
        if (entry.isDirectory()) {
          stack.push(rel);
        } else if (entry.isFile()) {
          output.push(rel);
        }
      }
    }
  }

  return output.sort();
}

async function createOutputArchiveBase64(workspaceDir: string, files: string[]): Promise<string | undefined> {
  if (files.length === 0) {
    return undefined;
  }

  const archivePath = join(workspaceDir, ".runner-output.tar.gz");
  await tar.c({
    gzip: true,
    cwd: workspaceDir,
    file: archivePath,
    portable: true,
  }, files);

  const buffer = await readFile(archivePath);
  return buffer.toString("base64");
}

function timeoutForJob(jobType: RunnerJobType): number {
  return policy.timeoutByJobType[jobType] ?? policy.defaultTimeoutMs;
}

async function runJob(job: JobRecord): Promise<void> {
  const startedAt = Date.now();
  job.startedAt = startedAt;
  job.status = "running";

  const tempRoot = await mkdtemp(join(tmpdir(), "jazz-runner-"));
  const workspaceRoot = join(tempRoot, "workspace");

  try {
    appendLog(job, "system", `Job ${job.id} started (${job.payload.jobType})`);

    await extractWorkspaceArchive(job.payload.workspaceTarGzBase64, tempRoot);
    const { command, args } = commandForJob(job.payload);

    appendLog(job, "system", `Executing: ${command} ${args.join(" ")}`);

    const timeoutMs = timeoutForJob(job.payload.jobType);
    const env = {
      ...process.env,
      SOLANA_URL: DEVNET_RPC_URL,
      ANCHOR_PROVIDER_URL: DEVNET_RPC_URL,
      RUST_BACKTRACE: "1",
      HOME: process.env.RUNNER_HOME ?? "/home/runner",
      ...(job.payload.env ?? {}),
    };

    await assertExecutableExists(command);

    const child = spawn(command, args, {
      cwd: workspaceRoot,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
    });

    const maxOutputBytes = policy.maxOutputBytes;
    let stdout = "";
    let stderr = "";
    let stdoutBuffer = "";
    let stderrBuffer = "";

    const flushLines = (stream: "stdout" | "stderr", chunk: string): void => {
      if (stream === "stdout") {
        stdoutBuffer += chunk;
        const parts = stdoutBuffer.split(/\r?\n/);
        stdoutBuffer = parts.pop() ?? "";
        parts.forEach((line) => appendLog(job, "stdout", line));
      } else {
        stderrBuffer += chunk;
        const parts = stderrBuffer.split(/\r?\n/);
        stderrBuffer = parts.pop() ?? "";
        parts.forEach((line) => appendLog(job, "stderr", line));
      }
    };

    child.stdout.on("data", (chunk: Buffer) => {
      const value = chunk.toString("utf8");
      if (Buffer.byteLength(stdout, "utf8") + Buffer.byteLength(stderr, "utf8") < maxOutputBytes) {
        stdout += value;
      }
      flushLines("stdout", value);
    });

    child.stderr.on("data", (chunk: Buffer) => {
      const value = chunk.toString("utf8");
      if (Buffer.byteLength(stdout, "utf8") + Buffer.byteLength(stderr, "utf8") < maxOutputBytes) {
        stderr += value;
      }
      flushLines("stderr", value);
    });

    const exitCode = await new Promise<number>((resolve, reject) => {
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error(`Job timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      child.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      child.on("close", (code) => {
        clearTimeout(timeout);
        resolve(code ?? 1);
      });
    });

    if (stdoutBuffer.length > 0) {
      appendLog(job, "stdout", stdoutBuffer);
    }
    if (stderrBuffer.length > 0) {
      appendLog(job, "stderr", stderrBuffer);
    }

    const outputFiles = await collectOutputFiles(workspaceRoot);
    const outputFilesTarGzBase64 = await createOutputArchiveBase64(workspaceRoot, outputFiles);

    job.stdout = redactSecrets(stdout);
    job.stderr = redactSecrets(stderr);
    job.status = exitCode === 0 ? "completed" : "failed";
    job.completedAt = Date.now();
    job.result = {
      exitCode,
      stdoutTail: job.stdout.slice(-8000),
      stderrTail: job.stderr.slice(-8000),
      outputFilesTarGzBase64,
      artifactsMeta: {
        outputFiles,
        durationMs: job.completedAt - startedAt,
      },
    };

    appendLog(job, "system", `Job ${job.id} finished with exit code ${exitCode}`);
  } catch (error) {
    job.status = "failed";
    job.completedAt = Date.now();
    const message = error instanceof Error ? error.message : "Unknown runner error";
    appendLog(job, "stderr", message);
    job.stderr = redactSecrets(`${job.stderr}\n${message}`.trim());
    job.result = {
      exitCode: 1,
      stdoutTail: job.stdout.slice(-8000),
      stderrTail: job.stderr.slice(-8000),
      artifactsMeta: {
        outputFiles: [],
        durationMs: (job.completedAt ?? Date.now()) - startedAt,
      },
    };
  } finally {
    releaseWorkspaceConcurrency(job.payload.workspaceId);
    finalizeSubscribers(job);
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function setupSse(res: ServerResponse): void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write("event: ping\ndata: connected\n\n");
}

function parsePath(pathname: string): { kind: "submit" | "stream" | "result" | "health" | "unknown"; jobId?: string } {
  if (pathname === "/v1/jobs") return { kind: "submit" };
  if (pathname === "/health") return { kind: "health" };

  const streamMatch = pathname.match(/^\/v1\/jobs\/([A-Za-z0-9_-]+)\/stream$/);
  if (streamMatch) {
    return { kind: "stream", jobId: streamMatch[1] };
  }

  const resultMatch = pathname.match(/^\/v1\/jobs\/([A-Za-z0-9_-]+)\/result$/);
  if (resultMatch) {
    return { kind: "result", jobId: resultMatch[1] };
  }

  return { kind: "unknown" };
}

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", "http://localhost");
  const route = parsePath(url.pathname);

  try {
    if (route.kind === "health" && method === "GET") {
      const checks = await Promise.allSettled([
        assertExecutableExists("anchor"),
        assertExecutableExists("solana"),
        assertExecutableExists("cargo"),
      ]);

      const ready = checks.every((entry) => entry.status === "fulfilled");
      json(res, ready ? 200 : 503, {
        ok: ready,
        devnetRpc: DEVNET_RPC_URL,
        toolchain: {
          anchor: checks[0].status === "fulfilled",
          solana: checks[1].status === "fulfilled",
          cargo: checks[2].status === "fulfilled",
        },
      });
      return;
    }

    if (route.kind === "submit" && method === "POST") {
      const rawBody = await readBody(req);
      verifySignature(req, rawBody);
      const parsed = JSON.parse(rawBody.toString("utf8")) as unknown;
      const payload = validateRunnerJobPayload(parsed);
      enforceWorkspaceJobQuota(payload.workspaceId);
      acquireWorkspaceConcurrency(payload.workspaceId);

      const jobId = randomUUID();
      const job: JobRecord = {
        id: jobId,
        payload,
        status: "queued",
        createdAt: Date.now(),
        logs: [],
        stdout: "",
        stderr: "",
        subscribers: new Set(),
      };
      jobs.set(jobId, job);

      void runJob(job);
      json(res, 202, { jobId });
      return;
    }

    if (route.kind === "stream" && method === "GET") {
      const job = route.jobId ? jobs.get(route.jobId) : undefined;
      if (!job) {
        json(res, 404, { error: "Job not found" });
        return;
      }

      setupSse(res);
      job.subscribers.add(res);
      job.logs.forEach((entry) => {
        res.write(`event: log\ndata: ${JSON.stringify(entry)}\n\n`);
      });

      if (job.status === "completed" || job.status === "failed") {
        res.write(`event: done\ndata: ${JSON.stringify({ status: job.status, jobId: job.id })}\n\n`);
        res.end();
        job.subscribers.delete(res);
        return;
      }

      req.on("close", () => {
        job.subscribers.delete(res);
      });
      return;
    }

    if (route.kind === "result" && method === "GET") {
      const job = route.jobId ? jobs.get(route.jobId) : undefined;
      if (!job) {
        json(res, 404, { error: "Job not found" });
        return;
      }

      if (!job.result) {
        json(res, 202, { status: job.status });
        return;
      }

      json(res, 200, {
        status: job.status,
        jobId: job.id,
        result: job.result,
      });
      return;
    }

    json(res, 404, { error: "Not found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal runner error";
    const status = /rate limit|concurrent job limit/i.test(message)
      ? 429
      : /signature|forbidden|invalid|unsupported|only devnet|requires/i.test(message)
      ? 400
      : 500;
    json(res, status, {
      error: redactSecrets(message),
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Runner listening on :${PORT}`);
});
