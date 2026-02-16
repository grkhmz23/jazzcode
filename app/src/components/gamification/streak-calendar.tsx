"use client";

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
        <Flame className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentStreak} days</div>
        <p className="text-xs text-muted-foreground">Longest: {longestStreak} days</p>
      </CardContent>
    </Card>
  );
}
