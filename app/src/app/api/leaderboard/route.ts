import { NextResponse } from "next/server";
import { z } from "zod";
import { getProgressService } from "@/lib/services/progress-factory";
import { validateQuery, Schemas } from "@/lib/api/validation";
import { handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

/**
 * Schema for leaderboard query params
 */
const leaderboardQuerySchema = z.object({
  timeframe: Schemas.timeframe,
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

/**
 * GET /api/leaderboard?timeframe=alltime&limit=50
 * Get leaderboard entries (public endpoint, no auth required)
 */
export async function GET(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const { timeframe, limit } = validateQuery(leaderboardQuerySchema, searchParams);

    // Get leaderboard
    const progressService = getProgressService();
    const entries = await progressService.getLeaderboard(timeframe, limit);

    return NextResponse.json(
      { entries, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get leaderboard", { requestId, error });
    return handleApiError(error);
  }
}
