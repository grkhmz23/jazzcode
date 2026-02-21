import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

process.env.SKIP_ENV_VALIDATION = "1";

const getClientIpMock = vi.fn();
const enforceRunnerRateLimitMock = vi.fn();
const createEphemeralBurnerWalletMock = vi.fn();
const resolveRequestActorIdMock = vi.fn();
const checkDatabaseHealthMock = vi.fn();
const generateRequestIdMock = vi.fn();

vi.mock("@/lib/api/middleware", () => ({
  getClientIp: getClientIpMock,
}));

vi.mock("@/lib/runner", () => ({
  enforceRunnerRateLimit: enforceRunnerRateLimitMock,
  createEphemeralBurnerWallet: createEphemeralBurnerWalletMock,
}));

vi.mock("@/lib/security/request-identity", () => ({
  resolveRequestActorId: resolveRequestActorIdMock,
}));

vi.mock("@/lib/runner/redaction", () => ({
  redactRunnerLogs: (message: string) => message,
}));

vi.mock("@/lib/db/client", () => ({
  checkDatabaseHealth: checkDatabaseHealthMock,
}));

vi.mock("@/lib/logging/logger", () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
  generateRequestId: generateRequestIdMock,
}));

describe("redacted API responses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("does not expose internal wallet file paths", async () => {
    getClientIpMock.mockReturnValue("127.0.0.1");
    resolveRequestActorIdMock.mockResolvedValue("actor-1");
    enforceRunnerRateLimitMock.mockResolvedValue({
      limit: 30,
      remaining: 29,
      resetAt: Date.now() + 60_000,
    });
    createEphemeralBurnerWalletMock.mockReturnValue({
      publicKey: "11111111111111111111111111111111",
      keypairPath: "~/.config/solana/id.json",
      secretKey: [1, 2, 3],
    });

    const { POST } = await import("@/app/api/runner/wallet/route");
    const response = await POST(new NextRequest("http://localhost/api/runner/wallet", { method: "POST" }));
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(body.publicKey).toBe("11111111111111111111111111111111");
    expect("keypairPath" in body).toBe(false);
  });

  it("does not return database error internals to clients", async () => {
    generateRequestIdMock.mockReturnValue("req-123");
    checkDatabaseHealthMock.mockResolvedValue({
      healthy: false,
      latencyMs: 12,
      error: "password authentication failed for user postgres",
    });

    const { GET } = await import("@/app/api/health/db/route");
    const response = await GET();
    const body = (await response.json()) as {
      checks: { database: Record<string, unknown> };
    };

    expect(response.status).toBe(503);
    expect(body.checks.database.status).toBe("down");
    expect("error" in body.checks.database).toBe(false);
  });

  it("does not proxy raw upstream runner health payload", async () => {
    process.env.RUNNER_URL = "http://runner.internal";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ stack: "trace", token: "secret-token" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const { GET } = await import("@/app/api/runner/health/route");
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;

    expect(fetchMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.upstreamStatus).toBe(200);
    expect("runner" in body).toBe(false);
  });

  it("reports local runner mode when remote URL is not configured", async () => {
    delete process.env.RUNNER_URL;
    const { GET } = await import("@/app/api/runner/health/route");
    const response = await GET();
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.configured).toBe(false);
    expect(body.mode).toBe("local");
  });
});
