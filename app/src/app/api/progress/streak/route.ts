import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { getProgressService } from "@/lib/services/progress-factory";
import { handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

/**
 * GET /api/progress/streak
 * Get streak data for the authenticated user
 */
export async function GET(): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get streak
    const progressService = getProgressService();
    const streak = await progressService.getStreak(session.user.id);

    return NextResponse.json(
      { streak, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get streak", { requestId, error });
    return handleApiError(error);
  }
}
