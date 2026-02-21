"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { XPDisplay } from "@/components/gamification/xp-display";
import { StreakCalendar, StreakStats } from "@/components/dashboard";
import { useXP } from "@/lib/hooks/use-xp";
import { useStreak } from "@/lib/hooks/use-streak";
import { useAllProgress } from "@/lib/hooks/use-progress";
import { useLeaderboard } from "@/lib/hooks/use-leaderboard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AchievementBadge } from "@/components/achievements";
import { GlassCard, LuxuryBadge } from "@/components/luxury/primitives";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Flame,
  Trophy,
  Zap,
  ArrowRight,
  Loader2,
  Star,
  Wallet,
} from "lucide-react";
import type { AchievementWithStatus } from "@/types/achievements";

// Activity item type
interface ActivityItem {
  id: string;
  courseSlug: string;
  lessonId: string;
  xpAwarded: number;
  completedAt: string;
}

// On-chain XP data interface
interface OnChainXPData {
  onChainAvailable: boolean;
  balance?: number;
  mintAddress?: string;
  tokenAccount?: string | null;
  message?: string;
}

function DashboardContent() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { data: session } = useSession();

  // Fetch real data from hooks
  const { xp, level, levelProgress, isLoading: isLoadingXP } = useXP();
  const { streak, isLoading: isLoadingStreak } = useStreak();
  const { progressList, isLoading: isLoadingProgress } = useAllProgress();
  const { userRank, isLoading: isLoadingRank } = useLeaderboard(50);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);

  // On-chain XP state
  const [onChainXP, setOnChainXP] = useState<OnChainXPData | null>(null);
  const [isLoadingOnChain, setIsLoadingOnChain] = useState(true);

  // Get wallet address from session
  const walletAddress = session?.user?.walletAddress ?? null;

  // Fetch on-chain XP
  useEffect(() => {
    async function fetchOnChainXP() {
      if (!walletAddress) {
        setIsLoadingOnChain(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/onchain/xp?wallet=${encodeURIComponent(walletAddress)}`
        );
        if (response.ok) {
          const data = (await response.json()) as { data: OnChainXPData };
          setOnChainXP(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch on-chain XP:", err);
      } finally {
        setIsLoadingOnChain(false);
      }
    }
    void fetchOnChainXP();
  }, [walletAddress]);

  // Fetch recent activity
  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch("/api/progress/activity?limit=10");
        if (response.ok) {
          const data = (await response.json()) as { activity: ActivityItem[] };
          setActivity(data.activity ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setIsLoadingActivity(false);
      }
    }
    void fetchActivity();
  }, []);

  // Fetch achievements
  useEffect(() => {
    async function fetchAchievements() {
      try {
        const response = await fetch("/api/achievements");
        if (response.ok) {
          const data = (await response.json()) as {
            achievements: AchievementWithStatus[];
          };
          setAchievements(data.achievements ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      } finally {
        setIsLoadingAchievements(false);
      }
    }
    void fetchAchievements();
  }, []);

  const isLoading =
    isLoadingXP ||
    isLoadingStreak ||
    isLoadingProgress ||
    isLoadingActivity ||
    isLoadingAchievements;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const userName = session?.user?.name;

  return (
    <div className="academy-fade-up container py-8 md:py-10">
      <GlassCard className="mb-8 p-6 md:p-8" glowColor="purple">
        <LuxuryBadge color="purple">{t("xpBalance")}</LuxuryBadge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          {userName ? t("welcome", { name: userName }) : t("welcomeDefault")}
        </h1>
      </GlassCard>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* XP Card */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <XPDisplay xp={xp} size="sm" showProgress={false} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500">{t("xpBalance")}</p>
              <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
              {/* On-chain XP display */}
              {!isLoadingOnChain && (
                <div className="mt-1">
                  {walletAddress ? (
                    onChainXP?.onChainAvailable ? (
                      <p className="text-xs text-solana-green">
                        {t("onChainXP")}: {(onChainXP.balance ?? 0).toLocaleString()} {tc("xp")}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        {t("onChainPending")}
                      </p>
                    )
                  ) : (
                    <Link
                      href="/settings"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-purple-300"
                    >
                      <Wallet className="h-3 w-3" />
                      {t("linkWalletForXP")}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-solana-purple/10">
              <Star className="h-6 w-6 text-solana-purple" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500">{tc("level")}</p>
              <p className="text-2xl font-bold">{level}</p>
              <div className="mt-1">
                <Progress value={levelProgress.percent} className="h-1 bg-white/10" />
                <p className="mt-1 text-xs text-slate-500">
                  {t("xpToNext")}:{" "}
                  {Math.max(levelProgress.required - Math.round(levelProgress.current), 0)} ({tc("level")} {level + 1})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {t("currentStreak")}
              </p>
              <p className="text-2xl font-bold">
                {streak.currentStreak} {tc("days")}
              </p>
              <p className="text-xs text-slate-500">
                {t("longestStreak", { days: streak.longestStreak })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rank Card */}
        <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("yourRank")}</p>
              <p className="text-2xl font-bold">
                {isLoadingRank ? "—" : userRank ? `#${userRank}` : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Courses */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t("currentCourses")}</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="gap-1 text-purple-300 hover:bg-white/5">
                  {tc("viewAll")} <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            {progressList.length === 0 ? (
              <Card className="border-white/10 bg-[#0F1322]/70 text-slate-300">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="mb-4 h-12 w-12 text-slate-700" />
                  <p className="text-slate-400">{t("noCourses")}</p>
                  <Link href="/courses" className="mt-4">
                    <Button variant="ghost" size="sm" className="border border-purple-500/30 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30">
                      {t("startLearning")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {progressList.map((cp) => (
                  <Link key={cp.courseSlug} href={`/courses/${cp.courseSlug}`}>
                    <Card className="cursor-pointer border-white/10 bg-[#0F1322]/70 text-slate-200 transition-all hover:border-purple-500/40">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20">
                          <BookOpen className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{cp.courseSlug}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Progress
                              value={cp.completionPercent}
                              className="h-1.5 flex-1 bg-white/10"
                            />
                            <span className="whitespace-nowrap text-xs text-slate-500">
                              {cp.completionPercent}%
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">{t("recentActivity")}</h2>
            {activity.length === 0 ? (
              <Card className="border-white/10 bg-[#0F1322]/70">
                <CardContent className="py-8 text-center text-slate-400">
                  {t("noActivity")}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/10 bg-[#0F1322]/70">
                <CardContent className="divide-y divide-white/10 p-0">
                  {activity.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solana-green/10">
                        <Zap className="h-4 w-4 text-solana-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          {t("activityCompletedIn", { course: item.courseSlug })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        +{item.xpAwarded} {tc("xp")}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* XP Level Display */}
          <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{t("xpBalance")}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <XPDisplay xp={xp} size="lg" />
            </CardContent>
          </Card>

          {/* Streak Calendar */}
          <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{t("streakCalendar")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StreakStats
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
              />
              <div className="border-t border-white/10 pt-4">
                <StreakCalendar
                  streakHistory={streak.streakHistory}
                  currentStreak={streak.currentStreak}
                  longestStreak={streak.longestStreak}
                />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-white/10 bg-[#0F1322]/70 text-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{t("achievements")}</CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.filter((a) => a.unlocked).length === 0 ? (
                <p className="text-sm text-slate-500">
                  {t("noAchievements")}
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {achievements
                    .filter((a) => a.unlocked)
                    .slice(0, 12)
                    .map((ach) => (
                      <AchievementBadge
                        key={ach.id}
                        achievement={ach}
                        size="sm"
                      />
                    ))}
                </div>
              )}
              <div className="mt-3 text-center text-xs text-slate-500">
                {achievements.filter((a) => a.unlocked).length} /{" "}
                {achievements.length} {tc("unlocked").toLowerCase()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
