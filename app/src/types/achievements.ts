/**
 * Achievement system types
 */

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name from lucide-react
  category: "progress" | "streaks" | "skills" | "community" | "special";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  // Checker function receives context and returns true if achievement is earned
  condition: AchievementCondition;
}

export type AchievementCondition =
  | { type: "lessons_completed"; count: number }
  | { type: "courses_completed"; count: number }
  | { type: "course_completed"; courseSlug: string }
  | { type: "xp_reached"; amount: number }
  | { type: "level_reached"; level: number }
  | { type: "streak_reached"; days: number }
  | { type: "first_lesson" }
  | { type: "first_challenge" }
  | { type: "all_courses_completed" }
  | { type: "perfect_challenge"; courseSlug: string }; // completed challenge without hints

export interface AchievementWithStatus extends AchievementDefinition {
  unlocked: boolean;
  unlockedAt: Date | null;
}

export interface AchievementCheckContext {
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalCoursesCompleted: number;
  completedCourses: string[]; // slugs
  totalChallengesCompleted: number;
  alreadyUnlocked: string[]; // achievement IDs already earned
}
