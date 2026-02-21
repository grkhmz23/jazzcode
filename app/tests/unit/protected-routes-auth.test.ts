import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

process.env.SKIP_ENV_VALIDATION = "1";

const getServerSessionMock = vi.fn();

vi.mock("next-auth/next", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/auth/config", () => ({
  authOptions: {},
}));

vi.mock("@/lib/services/progress-factory", () => ({
  getProgressService: () => ({
    getAllProgress: vi.fn(),
    getXP: vi.fn(),
    getStreak: vi.fn(),
    getProgress: vi.fn(),
    completeLesson: vi.fn(),
  }),
}));

vi.mock("@/lib/services/achievements", () => ({
  getAchievementEngine: () => ({
    getAchievementsWithStatus: vi.fn(),
  }),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lessonCompletion: {
      findMany: vi.fn(),
    },
  },
}));

describe("protected API routes return 401 when unauthenticated", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSessionMock.mockResolvedValue(null);
  });

  it("returns 401 across progress endpoints", async () => {
    const { GET: getAllProgress } = await import("@/app/api/progress/route");
    const { GET: getXp } = await import("@/app/api/progress/xp/route");
    const { GET: getStreak } = await import("@/app/api/progress/streak/route");
    const { GET: getCourseProgress } = await import("@/app/api/progress/[courseSlug]/route");
    const { GET: getActivity } = await import("@/app/api/progress/activity/route");
    const { POST: completeLesson } = await import("@/app/api/progress/complete-lesson/route");

    expect((await getAllProgress()).status).toBe(401);
    expect((await getXp()).status).toBe(401);
    expect((await getStreak()).status).toBe(401);
    expect((await getCourseProgress(new Request("http://localhost/api/progress/solana"), {
      params: { courseSlug: "solana" },
    })).status).toBe(401);
    expect((await getActivity(new Request("http://localhost/api/progress/activity?limit=5"))).status).toBe(401);
    expect((await completeLesson(new NextRequest("http://localhost/api/progress/complete-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: "solana", lessonId: "l1" }),
    }))).status).toBe(401);
  });

  it("returns 401 on achievements endpoint", async () => {
    const { GET } = await import("@/app/api/achievements/route");
    expect((await GET()).status).toBe(401);
  });
});
