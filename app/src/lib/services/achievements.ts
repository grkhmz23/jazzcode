import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logging/logger";
import { achievements } from "@/lib/data/achievements";
import type {
  AchievementDefinition,
  AchievementCondition,
  AchievementCheckContext,
  AchievementWithStatus,
} from "@/types/achievements";

/**
 * Achievement Engine - checks and awards achievements
 */
export class AchievementEngine {
  /**
   * Check all achievements against current user state.
   * Returns array of newly unlocked achievement IDs.
   * This is called after every completeLesson() call.
   */
  async checkAchievements(context: AchievementCheckContext): Promise<string[]> {
    // Filter out already unlocked achievements
    const eligibleAchievements = achievements.filter(
      (a) => !context.alreadyUnlocked.includes(a.id)
    );

    // Check each achievement
    const newlyUnlocked: string[] = [];

    for (const achievement of eligibleAchievements) {
      if (this.evaluateCondition(achievement.condition, context)) {
        newlyUnlocked.push(achievement.id);
      }
    }

    // Award new achievements
    if (newlyUnlocked.length > 0) {
      await this.awardAchievements(context.userId, newlyUnlocked);
    }

    return newlyUnlocked;
  }

  /**
   * Evaluate a single achievement condition against context
   */
  private evaluateCondition(
    condition: AchievementCondition,
    context: AchievementCheckContext
  ): boolean {
    switch (condition.type) {
      case "first_lesson":
        return context.totalLessonsCompleted >= 1;

      case "lessons_completed":
        return context.totalLessonsCompleted >= condition.count;

      case "courses_completed":
        return context.totalCoursesCompleted >= condition.count;

      case "course_completed":
        return context.completedCourses.includes(condition.courseSlug);

      case "xp_reached":
        return context.totalXP >= condition.amount;

      case "level_reached":
        return context.level >= condition.level;

      case "streak_reached":
        return context.longestStreak >= condition.days;

      case "all_courses_completed":
        // Check against total number of available courses (4 currently)
        return context.totalCoursesCompleted >= 4;

      case "first_challenge":
        // For now, track via challenges completed count
        return context.totalChallengesCompleted >= 1;

      case "perfect_challenge":
        // This would require tracking hint usage - placeholder
        // For now, just check if course is completed
        return context.completedCourses.includes(condition.courseSlug);

      default:
        return false;
    }
  }

  /**
   * Award achievements to a user
   */
  private async awardAchievements(userId: string, achievementIds: string[]): Promise<void> {
    try {
      // Create UserAchievement records
      const createData = achievementIds.map((id) => ({
        userId,
        achievementId: id,
        unlockedAt: new Date(),
      }));

      await prisma.userAchievementNew.createMany({
        data: createData,
        skipDuplicates: true,
      });

      logger.info("Achievements awarded", { userId, achievementIds });
    } catch (error) {
      logger.error("Failed to award achievements", { userId, achievementIds, error });
      throw error;
    }
  }

  /**
   * Get all achievements with their unlock status for a user
   */
  async getAchievementsWithStatus(userId: string): Promise<AchievementWithStatus[]> {
    try {
      // Query all unlocked achievements for this user in a single query
      const unlockedRecords = await prisma.userAchievementNew.findMany({
        where: { userId },
        select: { achievementId: true, unlockedAt: true },
      });

      const unlockedMap = new Map(
        unlockedRecords.map((r) => [r.achievementId, r.unlockedAt])
      );

      // Map all achievements with their status
      return achievements.map((def) => ({
        ...def,
        unlocked: unlockedMap.has(def.id),
        unlockedAt: unlockedMap.get(def.id) ?? null,
      }));
    } catch (error) {
      logger.error("Failed to get achievements with status", { userId, error });
      throw error;
    }
  }

  /**
   * Get recently unlocked achievements for a user
   */
  async getRecentAchievements(userId: string, limit = 5): Promise<AchievementWithStatus[]> {
    try {
      const records = await prisma.userAchievementNew.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
        take: limit,
        select: { achievementId: true, unlockedAt: true },
      });

      return records
        .map((r) => {
          const def = achievements.find((a) => a.id === r.achievementId);
          if (!def) return null;
          return {
            ...def,
            unlocked: true,
            unlockedAt: r.unlockedAt,
          } as AchievementWithStatus;
        })
        .filter((a): a is AchievementWithStatus => a !== null);
    } catch (error) {
      logger.error("Failed to get recent achievements", { userId, error });
      throw error;
    }
  }

  /**
   * Get achievement stats for a user
   */
  async getAchievementStats(userId: string): Promise<{
    total: number;
    unlocked: number;
    byRarity: Record<AchievementDefinition["rarity"], number>;
  }> {
    try {
      const allAchievements = await this.getAchievementsWithStatus(userId);
      const unlockedAchievements = allAchievements.filter((a) => a.unlocked);

      const byRarity: Record<AchievementDefinition["rarity"], number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      };

      for (const a of unlockedAchievements) {
        byRarity[a.rarity]++;
      }

      return {
        total: allAchievements.length,
        unlocked: unlockedAchievements.length,
        byRarity,
      };
    } catch (error) {
      logger.error("Failed to get achievement stats", { userId, error });
      throw error;
    }
  }
}

// Singleton instance
let achievementEngineInstance: AchievementEngine | null = null;

/**
 * Get the AchievementEngine singleton instance
 */
export function getAchievementEngine(): AchievementEngine {
  if (!achievementEngineInstance) {
    achievementEngineInstance = new AchievementEngine();
  }
  return achievementEngineInstance;
}

/**
 * Reset the AchievementEngine singleton (useful for testing)
 */
export function resetAchievementEngine(): void {
  achievementEngineInstance = null;
}
