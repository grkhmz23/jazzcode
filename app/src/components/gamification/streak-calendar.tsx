"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakCalendarProps {
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string;
    streakCalendar: Record<string, boolean>;
  };
}

export function StreakCalendar({
  streakData: { currentStreak, longestStreak },
}: StreakCalendarProps) {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t("learningStreak")}</CardTitle>
        <Flame className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentStreak} {tc("days")}</div>
        <p className="text-xs text-muted-foreground">{t("longestStreak")}: {longestStreak} {tc("days")}</p>
      </CardContent>
    </Card>
  );
}
