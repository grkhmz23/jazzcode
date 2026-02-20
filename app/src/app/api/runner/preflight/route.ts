import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/api/middleware";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createPreflightReport,
  PREFLIGHT_MIN_DEPLOY_BALANCE_SOL,
  type PreflightCheck,
  type PreflightMode,
} from "@/lib/playground/preflight/types";
import { getRunnerToolchainCapabilities } from "@/lib/runner/capabilities";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 4000;
const DEVNET_RPC_URL = "https://api.devnet.solana.com";

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkRemoteRunnerHealth(runnerUrl: string): Promise<PreflightCheck> {
  const startedAt = Date.now();
  try {
    const response = await fetchWithTimeout(`${runnerUrl.replace(/\/$/, "")}/health`, { method: "GET" }, FETCH_TIMEOUT_MS);
    await response.text();
    const latencyMs = String(Date.now() - startedAt);
    if (!response.ok) {
      return {
        code: "RUNNER_REMOTE_HEALTH",
        title: "Remote runner health",
        severity: "fail",
        message: `Remote runner health endpoint returned ${response.status}.`,
        action: "Check RUNNER_URL and remote runner service health before deploy/IDL commands.",
        details: {
          url: runnerUrl,
          status: String(response.status),
          latencyMs,
        },
      };
    }

    return {
      code: "RUNNER_REMOTE_HEALTH",
      title: "Remote runner health",
      severity: "pass",
      message: "Remote runner service is healthy.",
      details: {
        url: runnerUrl,
        status: String(response.status),
        latencyMs,
      },
    };
  } catch (error) {
    return {
      code: "RUNNER_REMOTE_HEALTH",
      title: "Remote runner health",
      severity: "fail",
      message: "Failed to reach remote runner health endpoint.",
      action: "Verify RUNNER_URL, networking, and remote runner availability.",
      details: {
        url: runnerUrl,
        error: error instanceof Error ? error.message : "unknown",
      },
    };
  }
}

async function checkDevnetRpcReachability(): Promise<PreflightCheck> {
  const startedAt = Date.now();
  try {
    const response = await fetchWithTimeout(
      DEVNET_RPC_URL,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "preflight-rpc",
          method: "getVersion",
          params: [],
        }),
      },
      FETCH_TIMEOUT_MS
    );

    const body = (await response.json()) as { result?: unknown; error?: { message?: string } };
    const latencyMs = String(Date.now() - startedAt);
    if (!response.ok || body.error || !body.result) {
      return {
        code: "RPC_DEVNET_REACHABLE",
        title: "Devnet RPC reachability",
        severity: "fail",
        message: "Devnet RPC probe failed.",
        action: "Check outbound network access to api.devnet.solana.com and retry.",
        details: {
          rpcUrl: DEVNET_RPC_URL,
          status: String(response.status),
          latencyMs,
          ...(body.error?.message ? { rpcError: body.error.message } : {}),
        },
      };
    }

    return {
      code: "RPC_DEVNET_REACHABLE",
      title: "Devnet RPC reachability",
      severity: "pass",
      message: "Devnet RPC is reachable.",
      details: {
        rpcUrl: DEVNET_RPC_URL,
        status: String(response.status),
        latencyMs,
      },
    };
  } catch (error) {
    return {
      code: "RPC_DEVNET_REACHABLE",
      title: "Devnet RPC reachability",
      severity: "fail",
      message: "Devnet RPC probe timed out or failed.",
      action: "Check connectivity to api.devnet.solana.com and runner network egress policy.",
      details: {
        rpcUrl: DEVNET_RPC_URL,
        error: error instanceof Error ? error.message : "unknown",
      },
    };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request);
  const rate = await checkRateLimit(`runner-preflight:${ip}`, {
    limit: 30,
    windowSeconds: 60,
  });
  if (!rate.success) {
    const retryAfter = Math.max(1, rate.reset - Math.floor(Date.now() / 1000));
    return NextResponse.json(
      { error: "Too many preflight requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(rate.reset),
        },
      }
    );
  }

  const runnerUrl = process.env.RUNNER_URL;
  const mode: PreflightMode = runnerUrl ? "remote" : "local";

  const checks: PreflightCheck[] = [
    {
      code: "RUNNER_MODE",
      title: "Runner mode",
      severity: "pass",
      message: mode === "remote" ? "Remote runner mode is configured." : "Local runner mode is active.",
      details: {
        mode,
      },
    },
  ];

  if (runnerUrl) {
    checks.push(await checkRemoteRunnerHealth(runnerUrl));
  } else {
    checks.push({
      code: "RUNNER_REMOTE_HEALTH",
      title: "Remote runner health",
      severity: "pass",
      message: "Remote runner is not configured; local runner mode will be used.",
      details: {
        configured: "false",
      },
    });
  }

  const toolchain = await getRunnerToolchainCapabilities({ mode, ...(runnerUrl ? { runnerUrl } : {}) });
  checks.push({
    code: "TOOLCHAIN_ANCHOR",
    title: "Anchor CLI",
    severity: toolchain.anchor.available ? "pass" : "fail",
    message: toolchain.anchor.available
      ? `Anchor CLI is available${toolchain.anchor.version ? ` (${toolchain.anchor.version})` : ""}.`
      : "Anchor CLI is not available in the runner environment.",
    action: toolchain.anchor.available
      ? undefined
      : mode === "remote"
      ? "Install Anchor CLI in the remote runner image and expose capabilities endpoint."
      : "Install Anchor CLI in the local runner environment.",
    details: {
      source: toolchain.anchor.source,
      ...(toolchain.anchor.version ? { version: toolchain.anchor.version } : {}),
      ...(toolchain.anchor.error ? { error: toolchain.anchor.error } : {}),
    },
  });
  checks.push({
    code: "TOOLCHAIN_CARGO",
    title: "Cargo",
    severity: toolchain.cargo.available ? "pass" : "fail",
    message: toolchain.cargo.available
      ? `Cargo is available${toolchain.cargo.version ? ` (${toolchain.cargo.version})` : ""}.`
      : "Cargo is not available in the runner environment.",
    action: toolchain.cargo.available
      ? undefined
      : mode === "remote"
      ? "Install Rust toolchain in the remote runner image and expose capabilities endpoint."
      : "Install Rust/Cargo in the local runner environment.",
    details: {
      source: toolchain.cargo.source,
      ...(toolchain.cargo.version ? { version: toolchain.cargo.version } : {}),
      ...(toolchain.cargo.error ? { error: toolchain.cargo.error } : {}),
    },
  });
  checks.push({
    code: "TOOLCHAIN_SOLANA",
    title: "Solana CLI",
    severity: toolchain.solana.available ? "pass" : "fail",
    message: toolchain.solana.available
      ? `Solana CLI is available${toolchain.solana.version ? ` (${toolchain.solana.version})` : ""}.`
      : "Solana CLI is not available in the runner environment.",
    action: toolchain.solana.available
      ? undefined
      : mode === "remote"
      ? "Install Solana CLI in the remote runner image and expose capabilities endpoint."
      : "Install Solana CLI in the local runner environment.",
    details: {
      source: toolchain.solana.source,
      ...(toolchain.solana.version ? { version: toolchain.solana.version } : {}),
      ...(toolchain.solana.error ? { error: toolchain.solana.error } : {}),
    },
  });

  checks.push(await checkDevnetRpcReachability());

  const report = createPreflightReport({
    mode,
    checks,
    minimumDeployBalanceSol: PREFLIGHT_MIN_DEPLOY_BALANCE_SOL,
  });

  return NextResponse.json(report, {
    status: report.ready ? 200 : 503,
    headers: {
      "X-RateLimit-Limit": String(rate.limit),
      "X-RateLimit-Remaining": String(rate.remaining),
      "X-RateLimit-Reset": String(rate.reset),
      "Cache-Control": "no-store",
    },
  });
}
