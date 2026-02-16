"use client";

import { useState, useEffect, useCallback } from "react";
import type { LeaderboardEntry } from "@/types/progress";

type LeaderboardTimeframe = "weekly" | "monthly" | "alltime";

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  userRank: number | null;
  isLoading: boolean;
  error: Error | null;
  timeframe: LeaderboardTimeframe;
  setTimeframe: (tf: LeaderboardTimeframe) => void;
  limit: number;
  setLimit: (limit: number) => void;
  refresh: () => void;
}

/**
 * Hook for fetching leaderboard data
 */
export function useLeaderboard(initialLimit = 50): UseLeaderboardReturn {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>("alltime");
  const [limit, setLimit] = useState(initialLimit);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          timeframe,
          limit: limit.toString(),
        });

        const response = await fetch(`/api/leaderboard?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          entries: LeaderboardEntry[];
          userRank?: number;
        };

        if (!cancelled) {
          setEntries(data.entries ?? []);
          setUserRank(data.userRank ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setEntries([]);
          setUserRank(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [timeframe, limit, refreshKey]);

  return {
    entries,
    userRank,
    isLoading,
    error,
    timeframe,
    setTimeframe,
    limit,
    setLimit,
    refresh,
  };
}
