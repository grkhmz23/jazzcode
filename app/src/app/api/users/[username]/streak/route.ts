import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { getProgressService } from "@/lib/services/progress-factory";
import { Errors, handleApiError } from "@/lib/api/errors";

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
      throw Errors.notFound("User not found");
    }

    // Only show streak for public profiles
    if (!user.isPublic) {
      throw Errors.forbidden("User profile is private");
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
    return handleApiError(error);
  }
}
