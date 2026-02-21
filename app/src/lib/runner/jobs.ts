import { createInitialTerminalState, runTerminalCommand, TerminalSimState } from "@/lib/terminal-sim";
import { executeCommandWithLimits } from "@/lib/runner/executor";
import { createIsolatedWorkdir, cleanupWorkdir } from "@/lib/runner/workdir";
import { RunnerJobRequest, RunnerResult } from "@/lib/runner/types";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const MAX_OUTPUT_BYTES = 512_000;

function makeResult(
  request: RunnerJobRequest,
  startedAt: number,
  input: {
    exitCode: number;
    stdout: string;
    stderr: string;
    artifacts: RunnerResult["artifacts"];
    terminalState?: TerminalSimState;
  }
): RunnerResult {
  return {
    jobType: request.jobType,
    exitCode: input.exitCode,
    stdout: input.stdout,
    stderr: input.stderr,
    artifacts: input.artifacts,
    terminalState: input.terminalState,
    durationMs: Date.now() - startedAt,
  };
}

async function runAnchorJob(
  request: RunnerJobRequest,
  subcommand: "build" | "test",
  startedAt: number
): Promise<RunnerResult> {
  const workdir = await createIsolatedWorkdir(request.files);
  try {
    const result = await executeCommandWithLimits({
      cwd: workdir,
      command: "anchor",
      args: [subcommand],
      timeoutMs: 20_000,
      maxOutputBytes: MAX_OUTPUT_BYTES,
    });

    return makeResult(request, startedAt, {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.timedOut ? `${result.stderr}\nTimed out` : result.stderr,
      artifacts: {
        buildSucceeded: subcommand === "build" ? result.exitCode === 0 : undefined,
        testsPassed: subcommand === "test" ? result.exitCode === 0 : undefined,
      },
    });
  } finally {
    await cleanupWorkdir(workdir);
  }
}

async function runCargoJob(
  request: RunnerJobRequest,
  subcommand: "build" | "test",
  startedAt: number
): Promise<RunnerResult> {
  const workdir = await createIsolatedWorkdir(request.files);
  try {
    const result = await executeCommandWithLimits({
      cwd: workdir,
      command: "cargo",
      args: [subcommand],
      timeoutMs: subcommand === "build" ? 20_000 : 25_000,
      maxOutputBytes: MAX_OUTPUT_BYTES,
    });

    return makeResult(request, startedAt, {
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.timedOut ? `${result.stderr}\nTimed out` : result.stderr,
      artifacts: {},
    });
  } finally {
    await cleanupWorkdir(workdir);
  }
}

async function readOutputFile(workdir: string, relativePath: string): Promise<string | null> {
  try {
    return await readFile(`${workdir}/${relativePath}`, "utf8");
  } catch {
    return null;
  }
}

async function collectJsonOutputFiles(
  workdir: string,
  relativeDir: string,
  outputFiles: Record<string, string>
): Promise<void> {
  try {
    const absoluteDir = join(workdir, relativeDir);
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) {
        continue;
      }
      const relativePath = `${relativeDir}/${entry.name}`;
      const content = await readOutputFile(workdir, relativePath);
      if (content !== null) {
        outputFiles[relativePath] = content;
      }
    }
  } catch {
    // Directory may not exist for some jobs; ignore.
  }
}

function parseProgramIdFromOutput(stdout: string): string | undefined {
  const match =
    stdout.match(/Program Id:\s*([1-9A-HJ-NP-Za-km-z]+)/i) ??
    stdout.match(/Program Id\s*:\s*([1-9A-HJ-NP-Za-km-z]+)/i) ??
    stdout.match(/Deploy success[\s\S]*?([1-9A-HJ-NP-Za-km-z]{32,44})/i);
  return match?.[1];
}

async function runAnchorDeployJob(
  request: RunnerJobRequest,
  startedAt: number
): Promise<RunnerResult> {
  const workdir = await createIsolatedWorkdir(request.files);
  try {
    const rpcUrl = request.args.rpcUrl || "https://api.devnet.solana.com";
    const result = await executeCommandWithLimits({
      cwd: workdir,
      command: "anchor",
      args: ["deploy", "--provider.cluster", rpcUrl],
      timeoutMs: 25_000,
      maxOutputBytes: MAX_OUTPUT_BYTES,
      env: {
        ANCHOR_PROVIDER_URL: rpcUrl,
      },
    });

    const outputFiles: Record<string, string> = {};
    await collectJsonOutputFiles(workdir, "target/deploy", outputFiles);
    await collectJsonOutputFiles(workdir, "target/idl", outputFiles);

    const programId = parseProgramIdFromOutput(result.stdout);

    return {
      ...makeResult(request, startedAt, {
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.timedOut ? `${result.stderr}\nTimed out` : result.stderr,
        artifacts: {
          deploySucceeded: result.exitCode === 0,
          programId,
        },
      }),
      outputFiles: Object.keys(outputFiles).length > 0 ? outputFiles : undefined,
    };
  } finally {
    await cleanupWorkdir(workdir);
  }
}

async function runAnchorIdlBuildJob(
  request: RunnerJobRequest,
  startedAt: number
): Promise<RunnerResult> {
  const workdir = await createIsolatedWorkdir(request.files);
  try {
    const result = await executeCommandWithLimits({
      cwd: workdir,
      command: "anchor",
      args: ["idl", "build"],
      timeoutMs: 25_000,
      maxOutputBytes: MAX_OUTPUT_BYTES,
      env: {
        ANCHOR_PROVIDER_URL: request.args.rpcUrl || "https://api.devnet.solana.com",
      },
    });

    const outputFiles: Record<string, string> = {};
    await collectJsonOutputFiles(workdir, "target/idl", outputFiles);

    return {
      ...makeResult(request, startedAt, {
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.timedOut ? `${result.stderr}\nTimed out` : result.stderr,
        artifacts: {
          idlBuilt: result.exitCode === 0,
        },
      }),
      outputFiles: Object.keys(outputFiles).length > 0 ? outputFiles : undefined,
    };
  } finally {
    await cleanupWorkdir(workdir);
  }
}

async function runAnchorIdlFetchJob(
  request: RunnerJobRequest,
  startedAt: number
): Promise<RunnerResult> {
  const programId = request.args.programId;
  if (!programId) {
    return makeResult(request, startedAt, {
      exitCode: 1,
      stdout: "",
      stderr: "anchor idl fetch requires args.programId",
      artifacts: {},
    });
  }

  const workdir = await createIsolatedWorkdir(request.files);
  try {
    const rpcUrl = request.args.rpcUrl || "https://api.devnet.solana.com";
    const result = await executeCommandWithLimits({
      cwd: workdir,
      command: "anchor",
      args: ["idl", "fetch", programId, "--provider.cluster", rpcUrl],
      timeoutMs: 25_000,
      maxOutputBytes: MAX_OUTPUT_BYTES,
      env: {
        ANCHOR_PROVIDER_URL: rpcUrl,
      },
    });

    const outputFiles: Record<string, string> = {};
    if (result.exitCode === 0 && result.stdout.trim().startsWith("{")) {
      outputFiles[`target/idl/${programId}.json`] = result.stdout;
    }

    return {
      ...makeResult(request, startedAt, {
        exitCode: result.exitCode,
        stdout: result.stdout,
        stderr: result.timedOut ? `${result.stderr}\nTimed out` : result.stderr,
        artifacts: {
          idlFetched: result.exitCode === 0,
          idlAddress: programId,
        },
      }),
      outputFiles: Object.keys(outputFiles).length > 0 ? outputFiles : undefined,
    };
  } finally {
    await cleanupWorkdir(workdir);
  }
}

function runTerminalJob(
  request: RunnerJobRequest,
  command: string,
  startedAt: number
): RunnerResult {
  const terminalState = request.terminalState ?? createInitialTerminalState();
  const output = runTerminalCommand(terminalState, command);

  const artifacts: RunnerResult["artifacts"] = {};
  if (command.startsWith("solana airdrop") || command.startsWith("solana transfer")) {
    const signature = output.stdout.match(/Signature:\s*([1-9A-HJ-NP-Za-km-z]+)/)?.[1];
    if (signature) artifacts.txSignature = signature;
  }

  if (command.startsWith("solana balance")) {
    const nextAddress = output.stdout.match(/^(\d+(?:\.\d+)?)\s+SOL$/m)?.[1];
    if (nextAddress) artifacts.balanceLamports = nextAddress;
  }

  if (command.startsWith("spl-token create-token")) {
    const mint = output.stdout.match(/Address:\s*([1-9A-HJ-NP-Za-km-z]+)/)?.[1];
    if (mint) artifacts.tokenMint = mint;
  }

  return makeResult(request, startedAt, {
    exitCode: output.exitCode,
    stdout: output.stdout,
    stderr: output.stderr,
    artifacts,
    terminalState: output.state,
  });
}

export async function executeRunnerJob(request: RunnerJobRequest): Promise<RunnerResult> {
  const startedAt = Date.now();

  if (request.jobType === "anchor_build") {
    return runAnchorJob(request, "build", startedAt);
  }

  if (request.jobType === "anchor_test") {
    return runAnchorJob(request, "test", startedAt);
  }

  if (request.jobType === "anchor_deploy") {
    return runAnchorDeployJob(request, startedAt);
  }

  if (request.jobType === "anchor_idl_build") {
    return runAnchorIdlBuildJob(request, startedAt);
  }

  if (request.jobType === "anchor_idl_fetch") {
    return runAnchorIdlFetchJob(request, startedAt);
  }

  if (request.jobType === "cargo_build") {
    return runCargoJob(request, "build", startedAt);
  }

  if (request.jobType === "cargo_test") {
    return runCargoJob(request, "test", startedAt);
  }

  if (request.jobType === "solana_config_set") {
    return runTerminalJob(
      request,
      `solana config set --url ${request.args.url ?? "devnet"}`,
      startedAt
    );
  }

  if (request.jobType === "solana_config_get") {
    return runTerminalJob(request, "solana config get", startedAt);
  }

  if (request.jobType === "solana_airdrop") {
    return runTerminalJob(
      request,
      `solana airdrop ${request.args.amount ?? "1"}`,
      startedAt
    );
  }

  if (request.jobType === "solana_balance") {
    return runTerminalJob(request, "solana balance", startedAt);
  }

  if (request.jobType === "solana_transfer") {
    return runTerminalJob(
      request,
      `solana transfer ${request.args.recipient ?? ""} ${request.args.amount ?? "0"}`.trim(),
      startedAt
    );
  }

  if (request.jobType === "spl_token_create_token") {
    const decimals = request.args.decimals ? ` --decimals ${request.args.decimals}` : "";
    return runTerminalJob(request, `spl-token create-token${decimals}`, startedAt);
  }

  if (request.jobType === "spl_token_flow") {
    const mint = request.args.mint ?? "";
    const amount = request.args.amount ?? "1";
    return runTerminalJob(request, `spl-token mint ${mint} ${amount}`.trim(), startedAt);
  }

  return makeResult(request, startedAt, {
    exitCode: 1,
    stdout: "",
    stderr: `Unsupported job type: ${request.jobType}`,
    artifacts: {},
  });
}
