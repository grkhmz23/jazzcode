import type {
  Achievement,
  ChallengeRunResult,
  Course,
  CourseFilter,
  Credential,
  LeaderboardEntry,
  LeaderboardTimeframe,
  Lesson,
  Progress,
  StreakData,
  XPEvent,
} from "@/types";

export interface LearningProgressService {
  getProgress(userId: string, courseId: string): Promise<Progress | null>;
  getAllProgress(userId: string): Promise<Progress[]>;
  completeLesson(userId: string, courseId: string, lessonId: string): Promise<void>;
  getXP(userId: string): Promise<number>;
  getXPHistory(userId: string): Promise<XPEvent[]>;
  getStreak(userId: string): Promise<StreakData>;
  getAchievements(userId: string): Promise<Achievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<void>;
}

export interface LeaderboardService {
  getLeaderboard(timeframe: LeaderboardTimeframe): Promise<LeaderboardEntry[]>;
  getUserRank(userId: string, timeframe: LeaderboardTimeframe): Promise<number | null>;
}

export interface CredentialsService {
  getCredentials(userId: string): Promise<Credential[]>;
  getCredentialByMint(mintAddress: string): Promise<Credential | null>;
  verifyCredential(mintAddress: string): Promise<boolean>;
}

export interface CourseContentService {
  getCourses(filter?: CourseFilter): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  getLessonById(courseSlug: string, lessonId: string): Promise<Lesson | null>;
  searchCourses(query: string): Promise<Course[]>;
}

export interface ChallengeRunnerService {
  run(
    code: string,
    testCases: Array<{
      id: string;
      name: string;
      input: string;
      expectedOutput: string;
      hidden: boolean;
    }>,
    timeoutMs: number,
    language: "typescript" | "rust" | "json"
  ): Promise<ChallengeRunResult>;
}

export interface OnChainReadService {
  getXPBalance(wallet: string): Promise<number>;
  getLeaderboardFromDAS(timeframe: LeaderboardTimeframe): Promise<LeaderboardEntry[]>;
  getCredentialsFromDAS(wallet: string): Promise<Credential[]>;
  verifyCredentialOnChain(mintAddress: string): Promise<boolean>;
}
