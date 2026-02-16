import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { getProgressService } from "@/lib/services/progress-factory";
import { handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

/**
 * GET /api/progress
 * Get all progress for the authenticated user
 */
export async function GET(): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get all progress
    const progressService = getProgressService();
    const progressList = await progressService.getAllProgress(session.user.id);

    return NextResponse.json(
      { progress: progressList, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get all progress", { requestId, error });
    return handleApiError(error);
  }
}
