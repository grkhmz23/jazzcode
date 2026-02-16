import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { leaderboardService } from "@/lib/services/registry";
import { prisma } from "@/lib/db/client";
import type { LeaderboardTimeframe } from "@/types";

const VALID_TIMEFRAMES = new Set<LeaderboardTimeframe>(["weekly", "monthly", "alltime"]);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframeParam = searchParams.get("timeframe") ?? "alltime";
    const limitParam = searchParams.get("limit") ?? "50";

    const timeframe: LeaderboardTimeframe = VALID_TIMEFRAMES.has(timeframeParam as LeaderboardTimeframe)
      ? (timeframeParam as LeaderboardTimeframe)
      : "alltime";
    const limit = Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 200);

    const entries = await leaderboardService.getLeaderboard(timeframe, limit);

    // Enrich with usernames from DB where possible
    const walletAddresses = entries.map((e) => e.wallet);
    const walletsWithUsers = await prisma.userWallet.findMany({
      where: { address: { in: walletAddresses } },
      include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
    });

    const walletUserMap = new Map(
      walletsWithUsers.map((w) => [
        w.address,
        {
          username: w.user.displayName ?? w.user.username,
          avatarUrl: w.user.avatarUrl,
        },
      ])
    );

    const enriched = entries.map((entry) => {
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
        const rank = enriched.findIndex((e) => e.wallet === w.address);
        if (rank !== -1) {
          userRank = rank + 1;
          break;
        }
      }
    }

    return NextResponse.json({ entries: enriched, userRank });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json({ entries: [], userRank: null });
  }
}
