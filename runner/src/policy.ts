import { constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import { URL } from "node:url";

export const DEVNET_RPC_URL = "https://api.devnet.solana.com";

export type RunnerJobType =
  | "anchor_build"
  | "anchor_test"
  | "anchor_deploy"
  | "anchor_idl_build"
  | "anchor_idl_fetch"
  | "solana_balance"
  | "solana_airdrop"
  | "solana_transfer"
  | "solana_config_get"
  | "solana_config_set"
  | "cargo_build"
  | "cargo_test";

export type RunnerJobPayload = {
  jobType: RunnerJobType;
  workspaceId: string;
  workspaceTarGzBase64: string;
  args?: Record<string, string>;
  env?: Record<string, string>;
  clientMeta?: Record<string, string>;
};

export type RunnerPolicy = {
  maxCompressedBytes: number;
  maxUncompressedBytes: number;
  maxFiles: number;
  maxOutputBytes: number;
  maxConcurrentJobsPerWorkspace: number;
  maxJobsPerMinutePerWorkspace: number;
  defaultTimeoutMs: number;
  timeoutByJobType: Record<RunnerJobType, number>;
};

export const defaultPolicy: RunnerPolicy = {
  maxCompressedBytes: 15 * 1024 * 1024,
  maxUncompressedBytes: 120 * 1024 * 1024,
  maxFiles: 10_000,
  maxOutputBytes: 2_000_000,
  maxConcurrentJobsPerWorkspace: 2,
  maxJobsPerMinutePerWorkspace: 10,
  defaultTimeoutMs: 180_000,
  timeoutByJobType: {
    anchor_build: 180_000,
    anchor_test: 300_000,
    anchor_deploy: 300_000,
    anchor_idl_build: 180_000,
    anchor_idl_fetch: 120_000,
    solana_balance: 45_000,
    solana_airdrop: 60_000,
    solana_transfer: 120_000,
    solana_config_get: 30_000,
    solana_config_set: 30_000,
    cargo_build: 240_000,
    cargo_test: 300_000,
  },
};

const ALLOWED_SOLANA_RPC_HOST = "api.devnet.solana.com";

function parseRpcHost(value: string): string {
  const url = new URL(value);
  return url.host;
}

export function validateRunnerJobPayload(input: unknown): RunnerJobPayload {
  if (typeof input !== "object" || input === null) {
    throw new Error("Invalid request payload");
  }

  const payload = input as Partial<RunnerJobPayload>;

  if (!payload.jobType || typeof payload.jobType !== "string") {
    throw new Error("Missing jobType");
  }

  const allowed: RunnerJobType[] = [
    "anchor_build",
    "anchor_test",
    "anchor_deploy",
    "anchor_idl_build",
    "anchor_idl_fetch",
    "solana_balance",
    "solana_airdrop",
    "solana_transfer",
    "solana_config_get",
    "solana_config_set",
    "cargo_build",
    "cargo_test",
  ];

  if (!allowed.includes(payload.jobType as RunnerJobType)) {
    throw new Error(`Unsupported job type: ${String(payload.jobType)}`);
  }

  if (!payload.workspaceId || typeof payload.workspaceId !== "string") {
    throw new Error("Missing workspaceId");
  }

  if (!payload.workspaceTarGzBase64 || typeof payload.workspaceTarGzBase64 !== "string") {
    throw new Error("Missing workspaceTarGzBase64");
  }

  const args = payload.args && typeof payload.args === "object" ? payload.args : {};
  const env = payload.env && typeof payload.env === "object" ? payload.env : {};
  const clientMeta = payload.clientMeta && typeof payload.clientMeta === "object" ? payload.clientMeta : {};

  const toStringRecord = (value: object, label: string): Record<string, string> => {
    const entries = Object.entries(value);
    const output: Record<string, string> = {};
    for (const [key, entryValue] of entries) {
      if (typeof entryValue !== "string") {
        throw new Error(`Invalid ${label} value for ${key}: expected string`);
      }
      output[key] = entryValue;
    }
    return output;
  };

  const typedPayload: RunnerJobPayload = {
    jobType: payload.jobType as RunnerJobType,
    workspaceId: payload.workspaceId,
    workspaceTarGzBase64: payload.workspaceTarGzBase64,
    args: toStringRecord(args, "args"),
    env: toStringRecord(env, "env"),
    clientMeta: toStringRecord(clientMeta, "clientMeta"),
  };

  validateDevnetOnly(typedPayload);
  return typedPayload;
}

export function validateDevnetOnly(payload: RunnerJobPayload): void {
  const args = payload.args ?? {};
  const clusterValue = args.cluster ?? "devnet";
  if (clusterValue !== "devnet") {
    throw new Error("Only devnet cluster is allowed");
  }

  const rpcCandidate = args.rpcUrl ?? DEVNET_RPC_URL;
  let host: string;
  try {
    host = parseRpcHost(rpcCandidate);
  } catch {
    throw new Error("Invalid RPC URL");
  }

  if (host !== ALLOWED_SOLANA_RPC_HOST) {
    throw new Error("Only https://api.devnet.solana.com is allowed");
  }

  const forbiddenArgKeys = ["mainnet", "testnet", "localhost", "cluster", "provider.cluster", "url"];
  const forbiddenValues = ["mainnet", "mainnet-beta", "testnet", "localhost", "127.0.0.1"];
  for (const [key, value] of Object.entries(args)) {
    const lowerKey = key.toLowerCase();
    const lowerValue = String(value).toLowerCase();

    if (forbiddenArgKeys.some((item) => lowerKey.includes(item)) && lowerValue !== "devnet" && lowerValue !== DEVNET_RPC_URL) {
      throw new Error(`Forbidden argument for devnet-only policy: ${key}`);
    }

    if (forbiddenValues.some((item) => lowerValue.includes(item))) {
      throw new Error(`Forbidden cluster or RPC value: ${value}`);
    }

    if (/(^|\/)(proc|etc)(\/|$)/i.test(lowerValue) || /\bprintenv\b|\benv\b/i.test(lowerValue)) {
      throw new Error(`Forbidden argument content: ${key}`);
    }

    if (/https?:\/\/[^/\s:@]+:[^@\s/]+@/i.test(String(value))) {
      throw new Error(`Credential-bearing URL is forbidden: ${key}`);
    }
  }
}

export function sanitizeArchivePath(inputPath: string): string {
  if (inputPath.startsWith("/") || /^[A-Za-z]:[\\/]/.test(inputPath)) {
    throw new Error(`Absolute paths are not allowed: ${inputPath}`);
  }

  const normalized = inputPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("\0")) {
    throw new Error("Invalid archive path");
  }

  const segments = normalized.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`Path traversal detected: ${inputPath}`);
  }

  if (normalized.startsWith("~") || normalized.includes("://")) {
    throw new Error(`Unsupported path: ${inputPath}`);
  }

  return normalized;
}

export async function assertExecutableExists(command: string): Promise<void> {
  const path = process.env.PATH ?? "";
  const entries = path.split(":").filter(Boolean);
  for (const dir of entries) {
    const target = `${dir}/${command}`;
    try {
      await access(target, fsConstants.X_OK);
      return;
    } catch {
      continue;
    }
  }

  throw new Error(`Required executable not found: ${command}`);
}

export function redactSecrets(input: string): string {
  if (!input) return "";

  const patterns: RegExp[] = [
    /("?mnemonic"?\s*[:=]\s*")[^"]+(")/gi,
    /(seed phrase\s*[:=]\s*)[^\n]+/gi,
    /(private key\s*[:=]\s*)[^\n]+/gi,
    /(secret key\s*[:=]\s*)[^\n]+/gi,
    /(\[[\d\s,]{80,}\])/g,
    /(\/home\/[^/\s]+\/\.config\/solana\/id\.json)/gi,
    /(~\/\.config\/solana\/id\.json)/gi,
    /(-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----)/g,
    /([A-Za-z0-9+/]{64,}={0,2})/g,
  ];

  let output = input;
  for (const pattern of patterns) {
    output = output.replace(pattern, (_match, p1?: string, p2?: string) => {
      if (typeof p1 === "string" && typeof p2 === "string") {
        return `${p1}[REDACTED]${p2}`;
      }
      if (typeof p1 === "string") {
        return `${p1}[REDACTED]`;
      }
      return "[REDACTED]";
    });
  }

  return output;
}
