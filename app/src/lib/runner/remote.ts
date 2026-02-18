import { createHmac } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import * as tar from "tar";

export type RemoteRunnerSubmitPayload = {
  jobType: string;
  workspaceId: string;
  workspaceTarGzBase64: string;
  args: Record<string, string>;
  env?: Record<string, string>;
  clientMeta?: Record<string, string>;
};

export type RemoteRunnerResultPayload = {
  status: "queued" | "running" | "completed" | "failed";
  jobId: string;
  result?: {
    exitCode: number;
    stdoutTail: string;
    stderrTail: string;
    outputFilesTarGzBase64?: string;
    artifactsMeta: {
      outputFiles: string[];
      durationMs: number;
    };
  };
};

function sanitizePath(path: string): string {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized) {
    throw new Error("Invalid file path");
  }
  const segments = normalized.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`Invalid file path: ${path}`);
  }
  return normalized;
}

export async function createWorkspaceArchiveBase64(files: Record<string, string>): Promise<string> {
  const tempRoot = await mkdtemp(join(tmpdir(), "runner-pack-"));
  const workspaceRoot = join(tempRoot, "workspace");
  const archivePath = join(tempRoot, "workspace.tar.gz");

  try {
    await mkdir(workspaceRoot, { recursive: true });

    const paths = Object.keys(files);
    for (const path of paths) {
      const safePath = sanitizePath(path);
      const absolute = join(workspaceRoot, safePath);
      await mkdir(dirname(absolute), { recursive: true });
      await writeFile(absolute, files[path] ?? "", "utf8");
    }

    await tar.c(
      {
        gzip: true,
        cwd: workspaceRoot,
        file: archivePath,
        portable: true,
      },
      paths.map((path) => sanitizePath(path))
    );

    const archiveBuffer = await readFile(archivePath);
    return archiveBuffer.toString("base64");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

export async function extractOutputArchiveBase64(base64: string): Promise<Record<string, string>> {
  const tempRoot = await mkdtemp(join(tmpdir(), "runner-unpack-"));
  const archivePath = join(tempRoot, "output.tar.gz");
  const extractRoot = join(tempRoot, "extract");

  try {
    await mkdir(extractRoot, { recursive: true });
    await writeFile(archivePath, Buffer.from(base64, "base64"));

    await tar.x({
      file: archivePath,
      cwd: extractRoot,
      strict: true,
      filter: (entryPath) => {
        sanitizePath(entryPath);
        return true;
      },
    });

    const result: Record<string, string> = {};

    async function walk(relative = ""): Promise<void> {
      const absolute = join(extractRoot, relative);
      const entries = await readdir(absolute, { withFileTypes: true });
      for (const entry of entries) {
        const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
        const safe = sanitizePath(childRelative);
        const childAbsolute = join(extractRoot, safe);
        if (entry.isDirectory()) {
          await walk(safe);
        } else if (entry.isFile()) {
          result[safe] = await readFile(childAbsolute, "utf8");
        }
      }
    }

    await walk();
    return result;
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

function signedHeaders(body: string, sharedSecret: string): Record<string, string> {
  if (!sharedSecret) {
    return {};
  }

  const timestamp = String(Date.now());
  const signature = createHmac("sha256", sharedSecret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  return {
    "x-runner-timestamp": timestamp,
    "x-runner-signature": signature,
  };
}

export async function submitRemoteJob(
  runnerUrl: string,
  sharedSecret: string,
  payload: RemoteRunnerSubmitPayload
): Promise<{ jobId: string }> {
  const body = JSON.stringify(payload);
  const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/v1/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...signedHeaders(body, sharedSecret),
    },
    body,
  });

  const json = (await response.json()) as { jobId?: string; error?: string };
  if (!response.ok || !json.jobId) {
    throw new Error(json.error ?? `Runner submit failed (${response.status})`);
  }

  return { jobId: json.jobId };
}

export async function getRemoteJobResult(
  runnerUrl: string,
  jobId: string
): Promise<RemoteRunnerResultPayload> {
  const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/v1/jobs/${jobId}/result`, {
    method: "GET",
    cache: "no-store",
  });

  const json = (await response.json()) as RemoteRunnerResultPayload & { error?: string };
  if (!response.ok) {
    throw new Error(json.error ?? `Runner result failed (${response.status})`);
  }

  return json;
}

export async function waitForRemoteJobResult(
  runnerUrl: string,
  jobId: string,
  timeoutMs = 8 * 60 * 1000
): Promise<RemoteRunnerResultPayload> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const status = await getRemoteJobResult(runnerUrl, jobId);
    if (status.status === "completed" || status.status === "failed") {
      return status;
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  throw new Error("Timed out waiting for remote runner result");
}
