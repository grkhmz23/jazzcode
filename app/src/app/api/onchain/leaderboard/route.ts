import { z } from "zod";
import { createApiHandler, createApiResponse } from "@/lib/api/middleware";
import { validateQuery } from "@/lib/api/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { leaderboardService } from "@/lib/services/registry";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logging/logger";
import type { LeaderboardEntry } from "@/types";

export const runtime = "nodejs";

const QuerySchema = z.object({
  timeframe: z.enum(["weekly", "monthly", "alltime"]).optional().default("alltime"),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
});

export const GET = createApiHandler(
  async (request) => {
    const { timeframe, limit } = validateQuery(QuerySchema, new URL(request.url).searchParams);

    logger.info("Fetching leaderboard", { timeframe, limit });

    const entries = await leaderboardService.getLeaderboard(timeframe, limit);

    // Enrich with usernames from DB where possible
    const walletAddresses = entries.map((e: LeaderboardEntry) => e.wallet);
    const walletsWithUsers = await prisma.userWallet.findMany({
      where: { address: { in: walletAddresses } },
      include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
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

    const enriched = entries.map((entry: LeaderboardEntry) => {
      const userInfo = walletUserMap.get(entry.wallet);
      return {
        ...entry,
        username: userInfo?.username ?? entry.username,
        avatarUrl: userInfo?.avatarUrl ?? entry.avatarUrl,
      };
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

      for (const w of userWallets) {
        const rank = enriched.findIndex((e: LeaderboardEntry) => e.wallet === w.address);
        if (rank !== -1) {
          userRank = rank + 1;
          break;
        }
      }
    }

    return createApiResponse({ entries: enriched, userRank });
  },
  { rateLimit: true }
);
