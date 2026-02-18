import { RunnerJobRequest, RunnerPolicy } from "@/lib/runner/types";

export const defaultRunnerPolicy: RunnerPolicy = {
  maxCpuSeconds: 8,
  maxMemoryMb: 256,
  maxDurationMs: 25_000,
  maxFiles: 300,
  maxFileBytes: 512_000,
  allowedRpcHosts: ["api.devnet.solana.com"],
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

  const suspiciousValue = /(\/proc\/|\/etc\/|printenv|env\b|--provider\.cluster|mainnet|testnet|localhost|127\.0\.0\.1)/i;
  for (const [key, value] of Object.entries(request.args)) {
    if (suspiciousValue.test(key) || suspiciousValue.test(value)) {
      throw new Error(`Runner policy violation: forbidden argument '${key}'`);
    }
  }

  // Playground deploy/IDL flows are restricted to devnet only.
  const devnetOnlyJobs = new Set(["anchor_deploy", "anchor_idl_build", "anchor_idl_fetch"]);
  if (devnetOnlyJobs.has(request.jobType)) {
    const cluster = request.args.cluster ?? "devnet";
    if (cluster !== "devnet") {
      throw new Error("Runner policy violation: deploy/IDL jobs are restricted to devnet");
    }

    if (rpcUrl) {
      const host = new URL(rpcUrl).host;
      if (host !== "api.devnet.solana.com") {
        throw new Error("Runner policy violation: deploy/IDL jobs require api.devnet.solana.com");
      }
    }
  }
}
