import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api/middleware";
import { validateQuery } from "@/lib/api/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getProgressService } from "@/lib/services/progress-factory";
import { getOnChainLeaderboard } from "@/lib/services/onchain";
import { prisma } from "@/lib/db/client";
import { logger, generateRequestId } from "@/lib/logging/logger";

// Use inline type to avoid conflicts
interface LocalLeaderboardEntry {
  rank: number;
  userId: string;
  wallet: string | null;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  streak: number;
}

interface EnrichedEntry extends LocalLeaderboardEntry {
  onChainXP?: number;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const progressService = getProgressService();
    const localBaseEntries = await progressService.getLeaderboard(timeframe, limit);

    const userIds = localBaseEntries.map((entry) => entry.userId);
    const wallets = await prisma.userWallet.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, address: true, isPrimary: true },
    });

    // Prefer primary wallet when users have multiple addresses.
    const userWalletMap = new Map<string, string>();
    wallets
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      .forEach((w) => {
        if (!userWalletMap.has(w.userId)) {
          userWalletMap.set(w.userId, w.address);
        }
      });

    const localEntries: LocalLeaderboardEntry[] = localBaseEntries.map((entry) => ({
      ...entry,
      wallet: userWalletMap.get(entry.userId) ?? null,
      username: entry.username,
      xp: entry.totalXP,
      streak: entry.currentStreak,
    }));

    // Enrich with usernames from DB where possible
    const walletAddresses = localEntries
      .map((e) => e.wallet)
      .filter((wallet): wallet is string => Boolean(wallet));
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
      const userInfo = entry.wallet ? walletUserMap.get(entry.wallet) : undefined;
      const onChainXP = entry.wallet ? walletToOnChainXP.get(entry.wallet) : undefined;

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
    if (session?.user?.id) {
      userRank = await progressService.getUserRank(session.user.id, timeframe);
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
          "Cache-Control": "private, no-store",
        },
      }
    );
  },
  { rateLimit: true }
);
