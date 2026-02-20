import { execFile } from "node:child_process";
import { promisify } from "node:util";

export type RunnerToolchain = "anchor" | "cargo" | "solana";

export interface RunnerToolchainCapability {
  available: boolean;
  source: "local" | "remote";
  version?: string;
  error?: string;
}

export interface RunnerToolchainCapabilities {
  anchor: RunnerToolchainCapability;
  cargo: RunnerToolchainCapability;
  solana: RunnerToolchainCapability;
}

function failure(source: "local" | "remote", error: string): RunnerToolchainCapabilities {
  return {
    anchor: { available: false, source, error },
    cargo: { available: false, source, error },
    solana: { available: false, source, error },
  };
}

function parseVersion(output: string): string | undefined {
  const line = output
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value.length > 0);
  return line;
}

const execFileAsync = promisify(execFile);

async function probeLocalVersion(command: RunnerToolchain, timeoutMs = 3000): Promise<RunnerToolchainCapability> {
  try {
    const { stdout, stderr } = await execFileAsync(command, ["--version"], {
      timeout: timeoutMs,
      maxBuffer: 8192,
      env: {
        ...process.env,
        PATH: process.env.PATH ?? "",
      },
    });

    const version = parseVersion(`${stdout}\n${stderr}`);
    return {
      available: true,
      source: "local",
      ...(version ? { version } : {}),
    };
  } catch (error) {
    const candidate = error as {
      stdout?: string;
      stderr?: string;
      code?: string | number;
      message?: string;
      killed?: boolean;
    };
    const version = parseVersion(`${candidate.stdout ?? ""}\n${candidate.stderr ?? ""}`);
    return {
      available: false,
      source: "local",
      ...(version ? { version } : {}),
      error:
        candidate.killed === true
          ? `${command} --version timed out`
          : typeof candidate.message === "string"
          ? candidate.message
          : `${command} --version failed${candidate.code !== undefined ? ` (${candidate.code})` : ""}`,
    };
  }
}

export async function getLocalRunnerToolchainCapabilities(): Promise<RunnerToolchainCapabilities> {
  const [anchor, cargo, solana] = await Promise.all([
    probeLocalVersion("anchor"),
    probeLocalVersion("cargo"),
    probeLocalVersion("solana"),
  ]);

  return { anchor, cargo, solana };
}

function toRemoteCapability(
  value: unknown
): { available: boolean; version?: string } | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { available?: unknown; version?: unknown };
  if (typeof candidate.available !== "boolean") return null;
  return {
    available: candidate.available,
    ...(typeof candidate.version === "string" ? { version: candidate.version } : {}),
  };
}

export async function getRemoteRunnerToolchainCapabilities(
  runnerUrl: string,
  timeoutMs = 4000
): Promise<RunnerToolchainCapabilities> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/v1/capabilities`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return failure("remote", `Remote capabilities endpoint returned ${response.status}`);
    }

    const payload = (await response.json()) as {
      toolchain?: Record<string, unknown>;
      anchor?: unknown;
      cargo?: unknown;
      solana?: unknown;
    };

    const fromToolchain = payload.toolchain ?? {};
    const anchor = toRemoteCapability(fromToolchain.anchor ?? payload.anchor);
    const cargo = toRemoteCapability(fromToolchain.cargo ?? payload.cargo);
    const solana = toRemoteCapability(fromToolchain.solana ?? payload.solana);

    if (!anchor || !cargo || !solana) {
      return failure("remote", "Remote runner does not expose complete toolchain capabilities");
    }

    return {
      anchor: { source: "remote", ...anchor },
      cargo: { source: "remote", ...cargo },
      solana: { source: "remote", ...solana },
    };
  } catch (error) {
    return failure("remote", error instanceof Error ? error.message : "Remote capabilities probe failed");
  } finally {
    clearTimeout(timeout);
  }
}

export async function getRunnerToolchainCapabilities(input: {
  mode: "local" | "remote";
  runnerUrl?: string;
}): Promise<RunnerToolchainCapabilities> {
  if (input.mode === "remote") {
    if (!input.runnerUrl) {
      return failure("remote", "RUNNER_URL is not configured");
    }
    return getRemoteRunnerToolchainCapabilities(input.runnerUrl);
  }
  return getLocalRunnerToolchainCapabilities();
}
