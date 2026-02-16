import { createInitialTerminalState, runTerminalCommand, TerminalSimState } from "@/lib/terminal-sim";
import { executeCommandWithLimits } from "@/lib/runner/executor";
import { createIsolatedWorkdir, cleanupWorkdir } from "@/lib/runner/workdir";
import { RunnerJobRequest, RunnerResult } from "@/lib/runner/types";

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
