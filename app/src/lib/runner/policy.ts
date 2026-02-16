import { RunnerJobRequest, RunnerPolicy } from "@/lib/runner/types";

export const defaultRunnerPolicy: RunnerPolicy = {
  maxCpuSeconds: 8,
  maxMemoryMb: 256,
  maxDurationMs: 25_000,
  maxFiles: 300,
  maxFileBytes: 512_000,
  allowedRpcHosts: [
    "api.devnet.solana.com",
    "api.testnet.solana.com",
    "api.mainnet-beta.solana.com",
  ],
};

export function validateRunnerRequestPolicy(
  request: RunnerJobRequest,
  policy: RunnerPolicy = defaultRunnerPolicy
): void {
  const entries = Object.entries(request.files);
  if (entries.length > policy.maxFiles) {
    throw new Error(`Runner policy violation: too many files (${entries.length})`);
  }

  for (const [path, content] of entries) {
    if (path.startsWith("/") || path.includes("..")) {
      throw new Error(`Runner policy violation: invalid path '${path}'`);
    }
    if (Buffer.byteLength(content, "utf8") > policy.maxFileBytes) {
      throw new Error(`Runner policy violation: file too large '${path}'`);
    }
  }

  const rpcUrl = request.args.rpcUrl;
  if (rpcUrl) {
    const host = new URL(rpcUrl).host;
    if (!policy.allowedRpcHosts.includes(host)) {
      throw new Error(`Runner policy violation: RPC host '${host}' not allowlisted`);
    }
  }
}
