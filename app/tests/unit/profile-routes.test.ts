import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

process.env.SKIP_ENV_VALIDATION = "1";

const getServerSessionMock = vi.fn();

const prismaMock = {
  user: {
    update: vi.fn(),
    findUnique: vi.fn(),
  },
  userWallet: {
    findMany: vi.fn(),
  },
  account: {
    findMany: vi.fn(),
  },
  enrollment: {
    findMany: vi.fn(),
  },
  lessonCompletion: {
    findMany: vi.fn(),
  },
  userXP: {
    findUnique: vi.fn(),
  },
  userStreak: {
    findUnique: vi.fn(),
  },
  userAchievementNew: {
    findMany: vi.fn(),
  },
};

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/auth/config", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db/client", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/services/achievements", () => ({
  AchievementEngine: class {
    getAchievementsWithStatus() {
      return [];
    }
  },
}));

vi.mock("@/lib/services/onchain", () => ({
  getCredentials: async () => [],
}));

describe("/api/profile PATCH", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    getServerSessionMock.mockResolvedValue(null);
    const { PATCH } = await import("@/app/api/profile/route");
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "abc" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid username format", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "u1" } });
    const { PATCH } = await import("@/app/api/profile/route");
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "bad username" }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});

describe("/api/profile/export GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    getServerSessionMock.mockResolvedValue(null);
    const { GET } = await import("@/app/api/profile/export/route");
    const req = new NextRequest("http://localhost/api/profile/export");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 for authenticated user", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "u1" } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      username: "user1",
      displayName: "User 1",
      email: "u@example.com",
      bio: null,
      avatarUrl: null,
      isPublic: true,
      preferredLocale: "en",
      theme: "dark",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    });
    prismaMock.userWallet.findMany.mockResolvedValue([]);
    prismaMock.account.findMany.mockResolvedValue([]);
    prismaMock.enrollment.findMany.mockResolvedValue([]);
    prismaMock.lessonCompletion.findMany.mockResolvedValue([]);
    prismaMock.userXP.findUnique.mockResolvedValue(null);
    prismaMock.userStreak.findUnique.mockResolvedValue(null);
    prismaMock.userAchievementNew.findMany.mockResolvedValue([]);

    const { GET } = await import("@/app/api/profile/export/route");
    const req = new NextRequest("http://localhost/api/profile/export");
    const res = await GET(req);
    const body = (await res.json()) as { user?: { id: string } };

    expect(res.status).toBe(200);
    expect(body.user?.id).toBe("u1");
  });
});
