import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { getAchievementEngine } from "@/lib/services/achievements";
import { Errors, handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/achievements
 * Get all achievements with unlock status for the authenticated user
 */
export async function GET(): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw Errors.unauthorized("You must be signed in to view achievements");
    }

    // Get achievements with status
    const achievementEngine = getAchievementEngine();
    const achievements = await achievementEngine.getAchievementsWithStatus(session.user.id);

    // Sort by category then rarity
    const rarityOrder: Record<string, number> = {
      common: 0,
      uncommon: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
    };

    const sortedAchievements = achievements.sort((a, b) => {
      // First sort by category
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      // Then by rarity
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    return NextResponse.json(
      { achievements: sortedAchievements, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get achievements", { requestId, error });
    return handleApiError(error);
  }
}
