/**
 * Progress for a specific course
 */
export interface Progress {
  courseSlug: string;
  completedLessons: string[]; // array of lessonIds
  totalLessons: number;
  completionPercent: number;
  enrolledAt: Date;
  completedAt: Date | null;
}

/**
 * Result of completing a lesson
 */
export interface CompletionResult {
  xpAwarded: number;
  totalXP: number;
  newLevel: number;
  previousLevel: number;
  leveledUp: boolean;
  isFirstOfDay: boolean;
  streakUpdated: boolean;
  newAchievements: string[]; // achievementIds unlocked by this action
  isNewCompletion?: boolean;
  isCourseComplete?: boolean;
}

/**
 * User streak data
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  streakHistory: string[]; // ISO date strings of active days
}

/**
 * Entry in the leaderboard
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  totalXP: number;
  level: number;
  currentStreak: number;
}
