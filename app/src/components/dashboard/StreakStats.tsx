"use client";

import { useMemo } from "react";
import { Flame, Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StreakStatsProps {
  currentStreak: number;
  longestStreak: number;
}

interface StreakMilestone {
  days: number;
  name: string;
  icon: string;
}

const MILESTONES: StreakMilestone[] = [
  { days: 7, name: "Week Warrior", icon: "🔥" },
  { days: 30, name: "Monthly Master", icon: "💪" },
  { days: 100, name: "Consistency King", icon: "👑" },
];

/**
 * Streak Stats Component
 * Shows current streak, longest streak, and progress to next milestone
 */
export function StreakStats({ currentStreak, longestStreak }: StreakStatsProps) {
  // Calculate next milestone and progress
  const { nextMilestone, progress, isMilestoneReached } = useMemo(() => {
    // Find the next milestone that hasn't been reached
    const next = MILESTONES.find((m) => currentStreak < m.days);

    if (!next) {
      // All milestones reached
      const lastMilestone = MILESTONES[MILESTONES.length - 1];
      return {
        nextMilestone: lastMilestone,
        progress: 100,
        isMilestoneReached: true,
      };
    }

    // Find the previous milestone (or 0 if at the first one)
    const prevMilestoneIndex = MILESTONES.indexOf(next) - 1;
    const prevDays = prevMilestoneIndex >= 0 ? MILESTONES[prevMilestoneIndex].days : 0;

    // Calculate progress within the current milestone range
    const range = next.days - prevDays;
    const progressInRange = currentStreak - prevDays;
    const progressPercent = Math.min(100, Math.round((progressInRange / range) * 100));

    return {
      nextMilestone: next,
      progress: progressPercent,
      isMilestoneReached: false,
    };
  }, [currentStreak]);

  // If streak is 0, show motivational message
  if (currentStreak === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Start a streak today!</p>
            <p className="text-sm text-muted-foreground">
              Complete a lesson to begin your learning streak. Build consistency
              and earn achievements!
            </p>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">
                Next milestone: <span className="font-medium">{MILESTONES[0].name}</span> ({MILESTONES[0].days} days)
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Progress value={0} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground">0/{MILESTONES[0].days}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main streak display */}
      <div className="flex items-center gap-4">
        {/* Current streak - large and prominent */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10">
            <Flame className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-border" />

        {/* Longest streak */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{longestStreak}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground">Best</p>
          </div>
        </div>
      </div>

      {/* Milestone progress */}
      <div className="rounded-lg border bg-card/50 p-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {isMilestoneReached ? "All milestones completed!" : "Next Milestone"}
          </span>
        </div>

        {isMilestoneReached ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-lg">{MILESTONES[MILESTONES.length - 1].icon}</span>
            <span>
              You&apos;ve achieved the highest streak milestone! Keep up the amazing work!
            </span>
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {currentStreak}/{nextMilestone.days} days to{" "}
                <span className="font-medium">{nextMilestone.name}</span>
              </span>
              <span className="text-lg">{nextMilestone.icon}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
