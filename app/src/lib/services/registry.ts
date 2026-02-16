import { LocalCourseContentService } from "./implementations/local-content";
import { OnChainReadServiceImpl } from "./implementations/onchain-read";
import type { CourseContentService, OnChainReadService } from "./interfaces";

// Service registry for dependency injection
export const courseContentService: CourseContentService = new LocalCourseContentService();
export const onChainService: OnChainReadService = new OnChainReadServiceImpl();

// Placeholder services that would be implemented with actual backends
export const progressService = {
  getProgress: async () => null,
  getAllProgress: async () => [],
  completeLesson: async () => {},
  getXP: async () => 0,
  getXPHistory: async () => [],
  getStreak: async () => ({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date().toISOString(),
    streakCalendar: {},
  }),
  getAchievements: async () => [],
  unlockAchievement: async () => {},
};

export const leaderboardService = {
  getLeaderboard: async (_timeframe: string, _limit: number) => {
    void _timeframe;
    void _limit;
    return [];
  },
  getUserRank: async () => null,
};

export const credentialsService = {
  getCredentials: async (wallet: string) => {
    void wallet;
    return [];
  },
  getCredentialByMint: async () => null,
  verifyCredential: async () => false,
};
