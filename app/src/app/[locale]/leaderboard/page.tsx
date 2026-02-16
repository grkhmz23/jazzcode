"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Trophy, Medal, Crown, Zap, Loader2 } from "lucide-react";

import type { LeaderboardEntry, LeaderboardTimeframe } from "@/types";

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const tc = useTranslations("common");
  useSession();

  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>("alltime");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  const fetchLeaderboard = useCallback(async (tf: LeaderboardTimeframe) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/onchain/leaderboard?timeframe=${tf}&limit=50`);
      if (response.ok) {
        const data = (await response.json()) as { entries: LeaderboardEntry[]; userRank: number | null };
        setEntries(data.entries);
        setUserRank(data.userRank);
      }
    } catch {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaderboard(timeframe);
  }, [timeframe, fetchLeaderboard]);

  const rankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-amber-400" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="w-5 text-center text-sm font-medium text-muted-foreground">{rank}</span>;
    }
  };

  const rankBg = (rank: number) => {
    switch (rank) {
      case 1: return "border-amber-400/30 bg-amber-400/5";
      case 2: return "border-gray-400/30 bg-gray-400/5";
      case 3: return "border-amber-600/30 bg-amber-600/5";
      default: return "";
    }
  };

  const timeframes: Array<{ value: LeaderboardTimeframe; label: string }> = [
    { value: "alltime", label: t("allTime") },
    { value: "monthly", label: t("monthly") },
    { value: "weekly", label: t("weekly") },
  ];

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.value}
              variant={timeframe === tf.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf.value)}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* User Rank */}
      {userRank !== null && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t("yourRank")}</p>
              <p className="text-2xl font-bold">#{userRank}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">{t("notRanked")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="divide-y p-0">
            {entries.map((entry) => (
              <div
                key={`${entry.wallet}-${entry.rank}`}
                className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/50 ${rankBg(entry.rank)}`}
              >
                <div className="flex w-8 items-center justify-center">
                  {rankIcon(entry.rank)}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">
                    {(entry.username ?? entry.wallet.slice(0, 2)).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.username ?? `${entry.wallet.slice(0, 4)}...${entry.wallet.slice(-4)}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tc("level")} {entry.level}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-solana-green" />
                  <span className="font-medium">{entry.xp.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{tc("xp")}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
