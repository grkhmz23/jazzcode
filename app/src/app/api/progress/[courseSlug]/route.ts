import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { getProgressService } from "@/lib/services/progress-factory";
import { handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

/**
 * GET /api/progress/[courseSlug]
 * Get progress for the current user in a specific course
 */
export async function GET(
  request: Request,
  { params }: { params: { courseSlug: string } }
): Promise<Response> {
  const requestId = generateRequestId();
  const { courseSlug } = params;
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get progress
    const progressService = getProgressService();
    const progress = await progressService.getProgress(session.user.id, courseSlug);

    if (!progress) {
      return NextResponse.json(
        { enrolled: false, requestId },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { enrolled: true, progress, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get progress", { requestId, courseSlug, error });
    return handleApiError(error);
  }
}
