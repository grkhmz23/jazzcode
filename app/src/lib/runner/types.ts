import { z } from "zod";
import { TerminalSimState } from "@/lib/terminal-sim";

export const RUNNER_JOB_ALLOWLIST = [
  "anchor_build",
  "anchor_test",
  "solana_config_set",
  "solana_config_get",
  "solana_airdrop",
  "solana_balance",
  "solana_transfer",
  "spl_token_create_token",
  "spl_token_flow",
] as const;

export type RunnerJobType = (typeof RUNNER_JOB_ALLOWLIST)[number];

export type RunnerPolicy = {
  maxCpuSeconds: number;
  maxMemoryMb: number;
  maxDurationMs: number;
  maxFiles: number;
  maxFileBytes: number;
  allowedRpcHosts: string[];
};

export type RunnerArtifact = {
  buildSucceeded?: boolean;
  testsPassed?: boolean;
  txSignature?: string;
  programId?: string;
  balanceLamports?: string;
  tokenMint?: string;
};

export type RunnerResult = {
  jobType: RunnerJobType;
  exitCode: number;
  stdout: string;
  stderr: string;
  artifacts: RunnerArtifact;
  terminalState?: TerminalSimState;
  durationMs: number;
};

export const runnerJobSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
  jobType: z.enum(RUNNER_JOB_ALLOWLIST),
  files: z.record(z.string()).default({}),
  args: z.record(z.string()).default({}),
  terminalState: z.custom<TerminalSimState>().optional(),
});

export type RunnerJobRequest = z.infer<typeof runnerJobSchema>;
