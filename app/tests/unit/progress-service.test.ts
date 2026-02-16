import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CourseContentService } from "@/lib/services/content";
import type { Course, Module, Lesson } from "@/types/content";

// Mock must be defined before imports
vi.mock("@/lib/db/client", () => ({
  prisma: {
    $transaction: vi.fn((fn) => fn(mockPrisma)),
    enrollment: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    lessonCompletion: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    userXP: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    userStreak: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    userAchievementNew: {
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
    },
  },
}));

// Mock the content service factory
const mockContentService: CourseContentService = {
  getCourses: vi.fn(),
  getCourse: vi.fn(),
  getLesson: vi.fn(),
  getModules: vi.fn(),
  searchCourses: vi.fn(),
};

vi.mock("@/lib/services/content-factory", () => ({
  getContentService: () => mockContentService,
}));

vi.mock("@/lib/logging/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
  generateRequestId: () => "test-request-id",
}));

// Import after mocks
import { PrismaLearningProgressService } from "@/lib/services/progress-local";
import { prisma } from "@/lib/db/client";

// Cast prisma to the mock type for test manipulation
const mockPrisma = prisma as unknown as {
  $transaction: ReturnType<typeof vi.fn>;
  enrollment: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };
  lessonCompletion: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  userXP: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  userStreak: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
  };
  userAchievementNew: {
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    createMany: ReturnType<typeof vi.fn>;
  };
};

// Helper to create mock course
function createMockCourse(xpReward = 50): Course {
  const mockLesson: Lesson = {
    id: "lesson-1",
    title: "Lesson 1",
    slug: "lesson-1",
    type: "content",
    order: 1,
    xpReward,
    content: "Test content",
    moduleId: "mod-1",
  };

  const mockModule: Module = {
    id: "mod-1",
    title: "Module 1",
    order: 1,
    lessons: [mockLesson],
  };

  return {
    id: "course-1",
    slug: "test-course",
    title: "Test Course",
    description: "Test",
    difficulty: "beginner",
    duration: "8 hours",
    totalXP: 1000,
    thumbnailUrl: "test.jpg",
    instructor: {
      name: "Test",
      avatarUrl: "test.jpg",
      bio: "Test bio",
    },
    modules: [mockModule],
    tags: [],
    language: "en",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };
}

describe("PrismaLearningProgressService", () => {
  let service: PrismaLearningProgressService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PrismaLearningProgressService();
  });

  describe("getLevel", () => {
    it("returns level 0 for 0 XP", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue({ totalXP: 0 });
      const level = await service.getLevel("user-1");
      expect(level).toBe(0);
    });

    it("returns level 1 for 100 XP", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue({ totalXP: 100 });
      const level = await service.getLevel("user-1");
      expect(level).toBe(1);
    });

    it("returns level 2 for 400 XP", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue({ totalXP: 400 });
      const level = await service.getLevel("user-1");
      expect(level).toBe(2);
    });

    it("returns level 10 for 10000 XP", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue({ totalXP: 10000 });
      const level = await service.getLevel("user-1");
      expect(level).toBe(10);
    });
  });

  describe("getXP", () => {
    it("returns totalXP from database", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue({ totalXP: 500 });
      const xp = await service.getXP("user-1");
      expect(xp).toBe(500);
    });

    it("returns 0 if no userXP record", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue(null);
      const xp = await service.getXP("user-1");
      expect(xp).toBe(0);
    });
  });

  describe("weekly/monthly XP reset", () => {
    it("resets weekly XP after 7 days", async () => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

      mockPrisma.lessonCompletion.findUnique.mockResolvedValue(null);
      mockPrisma.lessonCompletion.findFirst.mockResolvedValue(null);
      mockPrisma.lessonCompletion.findMany.mockResolvedValue([{ lessonId: "lesson-1" }]);
      mockPrisma.enrollment.findMany.mockResolvedValue([]);
      mockPrisma.userAchievementNew.findMany.mockResolvedValue([]);
      mockPrisma.userXP.findUnique.mockResolvedValue({
        totalXP: 100,
        weeklyXP: 50,
        monthlyXP: 50,
        lastWeeklyReset: eightDaysAgo,
        lastMonthlyReset: new Date(),
      });
      mockPrisma.userStreak.findUnique.mockResolvedValue(null);

      // Mock content service
      vi.mocked(mockContentService.getCourse).mockResolvedValue(createMockCourse());

      const result = await service.completeLesson("user-1", "test-course", "lesson-1");

      // Should have reset weeklyXP to 0 then added new XP
      expect(result.xpAwarded).toBeGreaterThan(0);
    });
  });

  describe("streak calculation", () => {
    it("increments streak on consecutive days", async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      mockPrisma.lessonCompletion.findUnique.mockResolvedValue(null);
      mockPrisma.lessonCompletion.findFirst.mockResolvedValue({
        completedAt: yesterday,
      });
      mockPrisma.lessonCompletion.findMany.mockResolvedValue([{ lessonId: "lesson-1" }]);
      mockPrisma.enrollment.findMany.mockResolvedValue([]);
      mockPrisma.userAchievementNew.findMany.mockResolvedValue([]);
      mockPrisma.userXP.findUnique.mockResolvedValue({
        totalXP: 100,
        weeklyXP: 50,
        monthlyXP: 50,
        lastWeeklyReset: new Date(),
        lastMonthlyReset: new Date(),
      });
      mockPrisma.userStreak.findUnique.mockResolvedValue({
        currentStreak: 2,
        longestStreak: 3,
        lastActivityDate: yesterday,
        streakHistory: ["2024-01-01", "2024-01-02"],
      });

      // Mock content service
      vi.mocked(mockContentService.getCourse).mockResolvedValue(createMockCourse());

      const result = await service.completeLesson("user-1", "test-course", "lesson-1");

      expect(result.streakUpdated).toBe(true);
    });

    it("resets streak to 1 after gap", async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      mockPrisma.lessonCompletion.findUnique.mockResolvedValue(null);
      mockPrisma.lessonCompletion.findFirst.mockResolvedValue({
        completedAt: threeDaysAgo,
      });
      mockPrisma.lessonCompletion.findMany.mockResolvedValue([{ lessonId: "lesson-1" }]);
      mockPrisma.enrollment.findMany.mockResolvedValue([]);
      mockPrisma.userAchievementNew.findMany.mockResolvedValue([]);
      mockPrisma.userXP.findUnique.mockResolvedValue({
        totalXP: 100,
        weeklyXP: 50,
        monthlyXP: 50,
        lastWeeklyReset: new Date(),
        lastMonthlyReset: new Date(),
      });
      mockPrisma.userStreak.findUnique.mockResolvedValue({
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: threeDaysAgo,
        streakHistory: [],
      });

      // Mock content service
      vi.mocked(mockContentService.getCourse).mockResolvedValue(createMockCourse());

      const result = await service.completeLesson("user-1", "test-course", "lesson-1");

      expect(result.streakUpdated).toBe(true);
    });
  });

  describe("completeLesson idempotency", () => {
    it("returns same result on second call without double XP", async () => {
      const now = new Date();

      // First call - lesson already completed (second call simulation)
      mockPrisma.lessonCompletion.findUnique.mockResolvedValue({
        userId: "user-1",
        courseSlug: "test-course",
        lessonId: "lesson-1",
        xpAwarded: 50,
        completedAt: now,
      });

      // After first completion, subsequent calls should return 0 XP
      mockPrisma.userXP.findUnique.mockResolvedValue({
        totalXP: 150,
        weeklyXP: 50,
        monthlyXP: 50,
        lastWeeklyReset: new Date(),
        lastMonthlyReset: new Date(),
      });

      const result = await service.completeLesson("user-1", "test-course", "lesson-1");

      expect(result.xpAwarded).toBe(0);
      expect(result.totalXP).toBe(150);
      expect(result.previousLevel).toBe(result.newLevel);
      expect(result.leveledUp).toBe(false);
    });
  });

  describe("getLeaderboard", () => {
    it("returns entries sorted by XP descending", async () => {
      mockPrisma.userXP.findMany.mockResolvedValue([
        {
          userId: "user-1",
          user: { id: "user-1", username: "alice", displayName: "Alice", avatarUrl: null },
          totalXP: 1000,
          weeklyXP: 100,
          monthlyXP: 500,
        },
        {
          userId: "user-2",
          user: { id: "user-2", username: "bob", displayName: "Bob", avatarUrl: null },
          totalXP: 800,
          weeklyXP: 200,
          monthlyXP: 400,
        },
        {
          userId: "user-3",
          user: { id: "user-3", username: "charlie", displayName: null, avatarUrl: null },
          totalXP: 500,
          weeklyXP: 50,
          monthlyXP: 200,
        },
      ]);
      mockPrisma.userStreak.findMany.mockResolvedValue([
        { userId: "user-1", currentStreak: 5 },
        { userId: "user-2", currentStreak: 3 },
      ]);

      const entries = await service.getLeaderboard("alltime", 10);

      expect(entries).toHaveLength(3);
      expect(entries[0].rank).toBe(1);
      expect(entries[0].userId).toBe("user-1");
      expect(entries[0].totalXP).toBe(1000);
      expect(entries[1].rank).toBe(2);
      expect(entries[1].totalXP).toBe(800);
      expect(entries[2].rank).toBe(3);
      expect(entries[2].totalXP).toBe(500);
    });

    it("returns empty array when no users", async () => {
      mockPrisma.userXP.findMany.mockResolvedValue([]);
      mockPrisma.userStreak.findMany.mockResolvedValue([]);

      const entries = await service.getLeaderboard("alltime", 10);

      expect(entries).toHaveLength(0);
    });
  });

  describe("getUserRank", () => {
    it("returns correct rank based on XP", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue({ totalXP: 500, weeklyXP: 100, monthlyXP: 300 });
      mockPrisma.userXP.count.mockResolvedValue(5);

      const rank = await service.getUserRank("user-1", "alltime");

      expect(rank).toBe(6); // 5 users have more XP + 1
    });

    it("returns 0 if user has no XP record", async () => {
      mockPrisma.userXP.findUnique.mockResolvedValue(null);

      const rank = await service.getUserRank("user-1", "alltime");

      expect(rank).toBe(0);
    });
  });
});
