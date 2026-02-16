import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api/middleware";
import { validateQuery } from "@/lib/api/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { leaderboardService } from "@/lib/services/registry";
import { getOnChainLeaderboard } from "@/lib/services/onchain";
import { prisma } from "@/lib/db/client";
import { logger, generateRequestId } from "@/lib/logging/logger";

// Use inline type to avoid conflicts
interface LocalLeaderboardEntry {
  rank: number;
  wallet: string;
  username: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
  streak: number;
}

interface EnrichedEntry extends LocalLeaderboardEntry {
  onChainXP?: number;
}

export const runtime = "nodejs";

// Revalidate cache every 5 minutes
export const revalidate = 300;

const QuerySchema = z.object({
  timeframe: z.enum(["weekly", "monthly", "alltime"]).optional().default("alltime"),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
});

interface LeaderboardResponse {
  entries: EnrichedEntry[];
  userRank: number | null;
  onChainAvailable: boolean;
}

export const GET = withApiMiddleware(
  async (request: NextRequest) => {
    const { timeframe, limit } = validateQuery(
      QuerySchema,
      new URL(request.url).searchParams
    );
    const requestId = generateRequestId();

    logger.info("Fetching leaderboard", { timeframe, limit, requestId });

    // Fetch local leaderboard (always available)
    const localEntries = (await leaderboardService.getLeaderboard(
      timeframe,
      limit
    )) as LocalLeaderboardEntry[];

    // Enrich with usernames from DB where possible
    const walletAddresses = localEntries.map((e) => e.wallet);
    const walletsWithUsers = await prisma.userWallet.findMany({
      where: { address: { in: walletAddresses } },
      include: {
        user: { select: { username: true, displayName: true, avatarUrl: true } },
      },
    });

    interface UserInfo {
      username: string | null;
      avatarUrl: string | null;
    }

    const walletUserMap = new Map<string, UserInfo>(
      walletsWithUsers.map((w) => [
        w.address,
        {
          username: w.user.displayName ?? w.user.username,
          avatarUrl: w.user.avatarUrl,
        },
      ])
    );

    // Fetch on-chain leaderboard (bonus layer)
    const onChainEntries = await getOnChainLeaderboard();
    const onChainAvailable = onChainEntries.length > 0;

    // Create a wallet to on-chain XP map
    const walletToOnChainXP = new Map<string, number>();
    onChainEntries.forEach((entry) => {
      walletToOnChainXP.set(entry.walletAddress, entry.xpBalance);
    });

    // Merge local and on-chain data
    // Start with local entries and add on-chain XP where available
    const enriched: EnrichedEntry[] = localEntries.map((entry) => {
      const userInfo = walletUserMap.get(entry.wallet);
      const onChainXP = walletToOnChainXP.get(entry.wallet);

      return {
        ...entry,
        username: userInfo?.username ?? entry.username,
        avatarUrl: userInfo?.avatarUrl ?? entry.avatarUrl,
        onChainXP: onChainXP,
      };
    });

    // Sort by local XP (primary - this is what we control)
    enriched.sort((a, b) => b.xp - a.xp);

    // Update ranks after sorting
    enriched.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // User rank
    let userRank: number | null = null;
    const session = await getServerSession(authOptions);
    if (session?.user && "id" in session.user) {
      const userId = (session.user as { id: string }).id;
      const userWallets = await prisma.userWallet.findMany({
        where: { userId },
        select: { address: true },
      });

      const userWalletSet = new Set(userWallets.map((w) => w.address));

      for (let i = 0; i < enriched.length; i++) {
        if (userWalletSet.has(enriched[i].wallet)) {
          userRank = i + 1;
          break;
        }
      }
    }

    const response: LeaderboardResponse = {
      entries: enriched,
      userRank,
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
  },
  { rateLimit: true }
);
