import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

process.env.SKIP_ENV_VALIDATION = "1";

const getServerSessionMock = vi.fn();

const prismaMock = {
  account: {
    count: vi.fn(),
  },
  user: {
    update: vi.fn(),
  },
  userWallet: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  walletNonce: {
    findFirst: vi.fn(),
    updateMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("next-auth/next", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/auth/config", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db/client", () => ({
  prisma: prismaMock,
}));

const verifyWalletSignatureMock = vi.fn();

vi.mock("@/lib/auth/wallet-verify", () => ({
  verifyWalletSignature: verifyWalletSignatureMock,
}));

describe("DELETE /api/auth/link-wallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (fn: (tx: typeof prismaMock) => Promise<void>) =>
      fn(prismaMock)
    );
  });

  it("returns 401 when user is not authenticated", async () => {
    getServerSessionMock.mockResolvedValue(null);

    const { DELETE } = await import("@/app/api/auth/link-wallet/route");
    const response = await DELETE();

    expect(response.status).toBe(401);
  });

  it("blocks unlink when wallet is the only sign-in method", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "u1" } });
    prismaMock.account.count.mockResolvedValue(0);

    const { DELETE } = await import("@/app/api/auth/link-wallet/route");
    const response = await DELETE();
    const body = (await response.json()) as { error?: string };

    expect(response.status).toBe(400);
    expect(body.error).toContain("Cannot unlink wallet");
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("unlinks wallet when another auth provider exists", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "u1" } });
    prismaMock.account.count.mockResolvedValue(1);
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.userWallet.deleteMany.mockResolvedValue({ count: 1 });

    const { DELETE } = await import("@/app/api/auth/link-wallet/route");
    const response = await DELETE();
    const body = (await response.json()) as { success?: boolean };

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { walletAddress: null },
    });
    expect(prismaMock.userWallet.deleteMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
    });
  });
});

describe("POST /api/auth/link-wallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires nonce inside signed message format", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "u1" } });

    const { POST } = await import("@/app/api/auth/link-wallet/route");
    const req = new NextRequest("http://localhost/api/auth/link-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletAddress: "11111111111111111111111111111111",
        signature: "sig",
        message: "Link wallet to Superteam Academy: u1",
      }),
    });

    const response = await POST(req);
    const body = (await response.json()) as { error?: string };

    expect(response.status).toBe(400);
    expect(body.error).toContain("Invalid message format");
    expect(prismaMock.walletNonce.findFirst).not.toHaveBeenCalled();
    expect(verifyWalletSignatureMock).not.toHaveBeenCalled();
  });
});
