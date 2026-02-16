"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaderboard } from "@/lib/hooks/use-leaderboard";
import {
  Trophy,
  Medal,
  Crown,
  Zap,
  Flame,
  Database,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import type { LeaderboardTimeframe } from "@/types";

export default function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const {
    entries,
    userRank,
    isLoading,
    error,
    timeframe,
    setTimeframe,
    onChainAvailable,
    showOnChain,
    setShowOnChain,
  } = useLeaderboard(50);

  const rankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 text-center text-sm font-medium text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const rankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "border-primary/30 bg-primary/10";
    switch (rank) {
      case 1:
        return "border-amber-400/30 bg-amber-400/5";
      case 2:
        return "border-gray-400/30 bg-gray-400/5";
      case 3:
        return "border-amber-600/30 bg-amber-600/5";
      default:
        return "";
    }
  };

  const timeframes: Array<{ value: LeaderboardTimeframe; label: string }> = [
    { value: "alltime", label: t("allTime") },
    { value: "monthly", label: t("monthly") },
    { value: "weekly", label: t("weekly") },
  ];

  // Skeleton loader for entries
  const SkeletonEntries = () => (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </>
  );

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
      {userRank !== null && userRank > 0 && (
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

      {/* On-Chain Toggle */}
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-solana-green" />
            <div>
              <p className="font-medium">{t("showOnChain")}</p>
              <p className="text-xs text-muted-foreground">
                {t("showOnChainDesc")}
              </p>
            </div>
          </div>
          <Button
            variant={showOnChain ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnChain(!showOnChain)}
            disabled={!onChainAvailable}
            className="gap-2"
          >
            {showOnChain ? (
              <>
                <Eye className="h-4 w-4" />
                {t("on")}
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                {t("off")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info message when on-chain toggle is on but not available */}
      {showOnChain && !onChainAvailable && (
        <Card className="mb-6 border-dashed border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Info className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t("onChainUnavailable")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("title")}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {entries.length > 0 && t("learnerCount", { count: entries.length })}
            </span>
          </div>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {isLoading ? (
            <SkeletonEntries />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">{t("loadError")}</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Trophy className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">{t("noData")}</p>
            </div>
          ) : (
            entries.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/50 ${rankBg(
                    entry.rank,
                    isCurrentUser
                  )}`}
                >
                  <div className="flex w-8 items-center justify-center">
                    {rankIcon(entry.rank)}
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={entry.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {entry.username?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {entry.username}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          {t("you")}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tc("level")} {entry.level}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.currentStreak > 0 && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame className="h-4 w-4" />
                        <span className="text-xs">{entry.currentStreak}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-solana-green" />
                      <span className="font-medium">
                        {entry.totalXP.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {tc("xp")}
                      </span>
                    </div>
                    {/* On-Chain XP Column */}
                    {showOnChain && onChainAvailable && (
                      <div className="flex items-center gap-1 border-l pl-3">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {entry.onChainXP?.toLocaleString() ?? "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">{t("onChainLabel")}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
