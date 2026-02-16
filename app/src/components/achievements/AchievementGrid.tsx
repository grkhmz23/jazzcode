"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AchievementBadge } from "./AchievementBadge";
import type { AchievementWithStatus } from "@/types/achievements";

interface AchievementGridProps {
  userId?: string;
}

/**
 * Group achievements by category
 */
function groupByCategory(achievements: AchievementWithStatus[]) {
  const groups: Record<string, AchievementWithStatus[]> = {
    progress: [],
    streaks: [],
    skills: [],
    community: [],
    special: [],
  };

  for (const achievement of achievements) {
    if (!groups[achievement.category]) {
      groups[achievement.category] = [];
    }
    groups[achievement.category].push(achievement);
  }

  return groups;
}

/**
 * Category display names
 */
const categoryNames: Record<string, string> = {
  progress: "Progress",
  streaks: "Streaks",
  skills: "Skills",
  community: "Community",
  special: "Special",
};

/**
 * Achievement Grid Component
 * Shows all achievements grouped by category
 */
export function AchievementGrid({ userId }: AchievementGridProps) {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const response = await fetch("/api/achievements");
        if (!response.ok) {
          throw new Error("Failed to fetch achievements");
        }
        const data = (await response.json()) as { achievements: AchievementWithStatus[] };
        setAchievements(data.achievements ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load achievements");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchAchievements();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {error}
        </CardContent>
      </Card>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const grouped = groupByCategory(achievements);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{unlockedCount}</span> / {totalCount} Unlocked
        </p>
      </div>

      {/* Category Groups */}
      {Object.entries(grouped).map(([category, items]) => {
        if (items.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base">{categoryNames[category]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {items.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
