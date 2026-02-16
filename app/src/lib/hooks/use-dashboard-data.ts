import { useState, useEffect } from "react";
import type { Achievement, XPEvent } from "@/types";

export interface DashboardData {
  xp: number;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string;
    streakCalendar: Record<string, boolean>;
  };
  achievements: Achievement[];
  courseProgress: Array<{
    courseId: string;
    percentComplete: number;
  }>;
  recentXP: XPEvent[];
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    xp: 0,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString(),
      streakCalendar: {},
    },
    achievements: [],
    courseProgress: [],
    recentXP: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Placeholder - would fetch from API
    setData({
      xp: 0,
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString(),
        streakCalendar: {},
      },
      achievements: [],
      courseProgress: [],
      recentXP: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return data;
}
