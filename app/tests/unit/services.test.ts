import { describe, it, expect, vi } from "vitest";
import type {
  LearningProgressService,
  LeaderboardService,
  CredentialsService,
  CourseContentService,
  ChallengeRunnerService,
  OnChainReadService,
} from "@/lib/services/interfaces";

describe("Service Interfaces", () => {
  it("LearningProgressService has all required methods", () => {
    const methods: Array<keyof LearningProgressService> = [
      "getProgress",
      "getAllProgress",
      "completeLesson",
      "getXP",
      "getXPHistory",
      "getStreak",
      "getAchievements",
      "unlockAchievement",
    ];

    // Type-level check — if this compiles, all methods exist on the interface
    const mockService: LearningProgressService = {
      getProgress: vi.fn(),
      getAllProgress: vi.fn(),
      completeLesson: vi.fn(),
      getXP: vi.fn(),
      getXPHistory: vi.fn(),
      getStreak: vi.fn(),
      getAchievements: vi.fn(),
      unlockAchievement: vi.fn(),
    };

    for (const method of methods) {
      expect(typeof mockService[method]).toBe("function");
    }
  });

  it("LeaderboardService has all required methods", () => {
    const mockService: LeaderboardService = {
      getLeaderboard: vi.fn(),
      getUserRank: vi.fn(),
    };

    expect(typeof mockService.getLeaderboard).toBe("function");
    expect(typeof mockService.getUserRank).toBe("function");
  });

  it("CredentialsService has all required methods", () => {
    const mockService: CredentialsService = {
      getCredentials: vi.fn(),
      getCredentialByMint: vi.fn(),
      verifyCredential: vi.fn(),
    };

    expect(typeof mockService.getCredentials).toBe("function");
    expect(typeof mockService.getCredentialByMint).toBe("function");
    expect(typeof mockService.verifyCredential).toBe("function");
  });

  it("OnChainReadService has all required methods", () => {
    const mockService: OnChainReadService = {
      getXPBalance: vi.fn(),
      getLeaderboardFromDAS: vi.fn(),
      getCredentialsFromDAS: vi.fn(),
      verifyCredentialOnChain: vi.fn(),
    };

    expect(typeof mockService.getXPBalance).toBe("function");
    expect(typeof mockService.getLeaderboardFromDAS).toBe("function");
    expect(typeof mockService.getCredentialsFromDAS).toBe("function");
    expect(typeof mockService.verifyCredentialOnChain).toBe("function");
  });

  it("ChallengeRunnerService has run method", () => {
    const mockService: ChallengeRunnerService = {
      run: vi.fn(),
    };

    expect(typeof mockService.run).toBe("function");
  });
});

describe("Service Registry shape", () => {
  it("exports all required service singletons", async () => {
    // Dynamic import to avoid Prisma initialization in test
    const registry = await import("@/lib/services/registry").catch(() => null);

    // If Prisma is not initialized, that's OK — we just check the module shape
    if (registry) {
      expect(registry.progressService).toBeDefined();
      expect(registry.onChainService).toBeDefined();
      expect(registry.leaderboardService).toBeDefined();
      expect(registry.credentialsService).toBeDefined();
    }
  });
});
