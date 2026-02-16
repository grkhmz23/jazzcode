import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getProgressService } from "@/lib/services/progress-factory";
import { logger } from "@/lib/logging/logger";

interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakHistory: string[];
}

/**
 * GET /api/users/[username]/streak
 * Public endpoint to get streak data for any user by username
 * Does not require authentication
 */
export async function GET(
  _request: Request,
  { params }: { params: { username: string } }
): Promise<Response> {
  try {
    const { username } = params;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, isPublic: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only show streak for public profiles
    if (!user.isPublic) {
      return NextResponse.json(
        { error: "User profile is private" },
        { status: 403 }
      );
    }

    // Get streak data using progress service
    const progressService = getProgressService();
    const streak = await progressService.getStreak(user.id);

    const response: StreakResponse = {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate?.toISOString() ?? null,
      streakHistory: streak.streakHistory,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error("Failed to get user streak", { username: params.username, error });
    return NextResponse.json(
      { error: "Failed to fetch streak data" },
      { status: 500 }
    );
  }
}
