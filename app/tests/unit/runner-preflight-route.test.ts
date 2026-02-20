import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

process.env.SKIP_ENV_VALIDATION = "1";

const getClientIpMock = vi.fn();
const checkRateLimitMock = vi.fn();
const getRunnerToolchainCapabilitiesMock = vi.fn();

vi.mock("@/lib/api/middleware", () => ({
  getClientIp: getClientIpMock,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: checkRateLimitMock,
}));

vi.mock("@/lib/runner/capabilities", () => ({
  getRunnerToolchainCapabilities: getRunnerToolchainCapabilitiesMock,
}));

describe("GET /api/runner/preflight", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    getClientIpMock.mockReturnValue("127.0.0.1");
    checkRateLimitMock.mockResolvedValue({
      success: true,
      limit: 30,
      remaining: 29,
      reset: Math.floor(Date.now() / 1000) + 60,
    });
    getRunnerToolchainCapabilitiesMock.mockResolvedValue({
      anchor: { available: true, source: "local", version: "anchor-cli 0.30.1" },
      cargo: { available: true, source: "local", version: "cargo 1.82.0" },
      solana: { available: true, source: "local", version: "solana-cli 1.18.18" },
    });
  });

  it("returns local mode when RUNNER_URL is not configured and RPC is reachable", async () => {
    delete process.env.RUNNER_URL;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ jsonrpc: "2.0", id: "preflight-rpc", result: { "solana-core": "1.18.0" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const { GET } = await import("@/app/api/runner/preflight/route");
    const response = await GET(new NextRequest("http://localhost/api/runner/preflight"));
    const body = (await response.json()) as {
      ready: boolean;
      mode: string;
      checks: Array<{ code: string; severity: string }>;
    };

    expect(response.status).toBe(200);
    expect(body.mode).toBe("local");
    expect(body.ready).toBe(true);
    expect(body.checks.find((check) => check.code === "RUNNER_REMOTE_HEALTH")?.severity).toBe("pass");
    expect(body.checks.find((check) => check.code === "TOOLCHAIN_ANCHOR")?.severity).toBe("pass");
    expect(body.checks.find((check) => check.code === "RPC_DEVNET_REACHABLE")?.severity).toBe("pass");
  });

  it("returns remote mode and pass checks when remote health and RPC succeed", async () => {
    process.env.RUNNER_URL = "http://runner.internal";
    getRunnerToolchainCapabilitiesMock.mockResolvedValue({
      anchor: { available: true, source: "remote", version: "anchor-cli 0.30.1" },
      cargo: { available: true, source: "remote", version: "cargo 1.82.0" },
      solana: { available: true, source: "remote", version: "solana-cli 1.18.18" },
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("runner.internal/health")) {
        return new Response("ok", { status: 200 });
      }
      return new Response(
        JSON.stringify({ jsonrpc: "2.0", id: "preflight-rpc", result: { "solana-core": "1.18.0" } }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    });

    const { GET } = await import("@/app/api/runner/preflight/route");
    const response = await GET(new NextRequest("http://localhost/api/runner/preflight"));
    const body = (await response.json()) as {
      ready: boolean;
      mode: string;
      checks: Array<{ code: string; severity: string }>;
    };

    expect(response.status).toBe(200);
    expect(body.mode).toBe("remote");
    expect(body.ready).toBe(true);
    expect(body.checks.find((check) => check.code === "RUNNER_REMOTE_HEALTH")?.severity).toBe("pass");
    expect(body.checks.find((check) => check.code === "TOOLCHAIN_ANCHOR")?.severity).toBe("pass");
    expect(body.checks.find((check) => check.code === "RPC_DEVNET_REACHABLE")?.severity).toBe("pass");
  });

  it("returns not-ready when remote health and RPC checks fail", async () => {
    process.env.RUNNER_URL = "http://runner.internal";
    getRunnerToolchainCapabilitiesMock.mockResolvedValue({
      anchor: { available: false, source: "remote", error: "missing" },
      cargo: { available: false, source: "remote", error: "missing" },
      solana: { available: false, source: "remote", error: "missing" },
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("runner.internal/health")) {
        throw new Error("connect ECONNREFUSED");
      }
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: "preflight-rpc", error: { message: "unavailable" } }), {
        status: 503,
        headers: { "content-type": "application/json" },
      });
    });

    const { GET } = await import("@/app/api/runner/preflight/route");
    const response = await GET(new NextRequest("http://localhost/api/runner/preflight"));
    const body = (await response.json()) as {
      ready: boolean;
      blockingCodes: string[];
      checks: Array<{ code: string; severity: string }>;
    };

    expect(response.status).toBe(503);
    expect(body.ready).toBe(false);
    expect(body.blockingCodes).toContain("RUNNER_REMOTE_HEALTH");
    expect(body.blockingCodes).toContain("TOOLCHAIN_ANCHOR");
    expect(body.blockingCodes).toContain("RPC_DEVNET_REACHABLE");
    expect(body.checks.find((check) => check.code === "RUNNER_REMOTE_HEALTH")?.severity).toBe("fail");
    expect(body.checks.find((check) => check.code === "TOOLCHAIN_ANCHOR")?.severity).toBe("fail");
    expect(body.checks.find((check) => check.code === "RPC_DEVNET_REACHABLE")?.severity).toBe("fail");
  });
});
