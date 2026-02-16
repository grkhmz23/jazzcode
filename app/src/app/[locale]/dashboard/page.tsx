"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { XPDisplay } from "@/components/gamification/xp-display";
import { StreakCalendar } from "@/components/gamification/streak-calendar";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import {
  BookOpen,
  Flame,
  Trophy,
  Zap,
  ArrowRight,

  Loader2,
} from "lucide-react";
import type { Achievement, XPEvent } from "@/types";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const { xp, streak, achievements, courseProgress, recentXP, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const userName = session?.user?.name;

  const unlockedAchievements = achievements.filter((a: Achievement) => a.unlockedAt !== null);

  return (
    <div className="container py-8 md:py-12">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {userName ? t("welcome", { name: userName }) : t("welcomeDefault")}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* XP Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <XPDisplay xp={xp} size="sm" showProgress={false} />
            <div>
              <p className="text-sm text-muted-foreground">{t("xpBalance")}</p>
              <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("currentStreak")}</p>
              <p className="text-2xl font-bold">
                {streak.currentStreak} {tc("days")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("longestStreak", { days: streak.longestStreak })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Courses Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("currentCourses")}</p>
              <p className="text-2xl font-bold">{courseProgress.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("achievements")}</p>
              <p className="text-2xl font-bold">
                {unlockedAchievements.length}/{achievements.length}
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
                <Button variant="ghost" size="sm" className="gap-1">
                  {tc("viewAll")} <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            {courseProgress.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">{t("noCourses")}</p>
                  <Link href="/courses" className="mt-4">
                    <Button variant="solana" size="sm">
                      {t("startLearning")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {courseProgress.map((cp: { courseId: string; percentComplete: number }) => (
                  <Link key={cp.courseId} href={`/courses/${cp.courseId}`}>
                    <Card className="cursor-pointer transition-all hover:border-primary/50">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{cp.courseId}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Progress
                              value={cp.percentComplete}
                              className="h-1.5 flex-1"
                            />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {cp.percentComplete}%
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent XP Activity */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">{t("recentActivity")}</h2>
            {recentXP.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {t("noActivity")}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="divide-y p-0">
                  {recentXP.slice(0, 8).map((event: XPEvent) => (
                    <div key={event.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solana-green/10">
                        <Zap className="h-4 w-4 text-solana-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{event.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        +{event.amount} {tc("xp")}
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("xpBalance")}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <XPDisplay xp={xp} size="lg" />
            </CardContent>
          </Card>

          {/* Streak Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("streakCalendar")}</CardTitle>
            </CardHeader>
            <CardContent>
              <StreakCalendar streakData={streak} />
              <div className="mt-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-solana-green" />
                <span className="text-xs text-muted-foreground">{t("todayActive")}</span>
                <div className="h-3 w-3 rounded-sm bg-muted" />
                <span className="text-xs text-muted-foreground">—</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("achievements")}</CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {achievements.slice(0, 12).map((ach: Achievement) => (
                    <div
                      key={ach.id}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl transition-all ${
                        ach.unlockedAt
                          ? "bg-amber-500/10 shadow-sm"
                          : "bg-muted opacity-30 grayscale"
                      }`}
                      title={`${ach.name}: ${ach.description}${
                        ach.unlockedAt ? "" : " (Locked)"
                      }`}
                    >
                      {ach.icon}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
