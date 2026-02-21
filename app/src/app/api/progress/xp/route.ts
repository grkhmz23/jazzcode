import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { getProgressService } from "@/lib/services/progress-factory";
import { Errors, handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/progress/xp
 * Get XP for the authenticated user
 */
export async function GET(): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw Errors.unauthorized("You must be signed in to view XP");
    }

    // Get XP
    const progressService = getProgressService();
    const xp = await progressService.getXP(session.user.id);

    return NextResponse.json(
      { xp, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get XP", { requestId, error });
    return handleApiError(error);
  }
}
