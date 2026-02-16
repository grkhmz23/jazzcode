import { NextResponse } from "next/server";
import { z } from "zod";
import { getProgressService } from "@/lib/services/progress-factory";
import { validateQuery, Schemas } from "@/lib/api/validation";
import { handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";
import { getOnChainLeaderboard } from "@/lib/services/onchain";
import { prisma } from "@/lib/db/client";
import type { LeaderboardEntry } from "@/types/progress";

/**
 * Schema for leaderboard query params
 */
const leaderboardQuerySchema = z.object({
  timeframe: Schemas.timeframe,
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

interface EnrichedEntry extends LeaderboardEntry {
  onChainXP?: number;
}

interface LeaderboardResponse {
  entries: EnrichedEntry[];
  onChainAvailable: boolean;
}

/**
 * GET /api/leaderboard?timeframe=alltime&limit=50
 * Get leaderboard entries with optional on-chain data
 */
export async function GET(request: Request): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const { timeframe, limit } = validateQuery(leaderboardQuerySchema, searchParams);

    // Get local leaderboard (always available)
    const progressService = getProgressService();
    const localEntries = await progressService.getLeaderboard(timeframe, limit);

    // Fetch on-chain leaderboard (bonus layer)
    const onChainEntries = await getOnChainLeaderboard();
    const onChainAvailable = onChainEntries.length > 0;

    // Create a wallet to on-chain XP map
    const walletToOnChainXP = new Map<string, number>();
    onChainEntries.forEach((entry) => {
      walletToOnChainXP.set(entry.walletAddress, entry.xpBalance);
    });

    // Fetch wallet addresses for local entries to match with on-chain data
    const userIds = localEntries.map((entry) => entry.userId);
    const userWallets = await prisma.userWallet.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, address: true },
    });

    const userIdToWalletMap = new Map<string, string>();
    userWallets.forEach((w) => {
      userIdToWalletMap.set(w.userId, w.address);
    });

    // Merge local and on-chain data
    const enriched: EnrichedEntry[] = localEntries.map((entry) => {
      const walletAddress = userIdToWalletMap.get(entry.userId);
      const onChainXP = walletAddress ? walletToOnChainXP.get(walletAddress) : undefined;

      return {
        ...entry,
        onChainXP: onChainXP,
      };
    });

    const response: LeaderboardResponse = {
      entries: enriched,
      onChainAvailable,
    };

    return NextResponse.json(
      { data: response, requestId },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    logger.error("Failed to get leaderboard", { requestId, error });
    return handleApiError(error);
  }
}
