"use client";

import { useState, useEffect, useCallback } from "react";
import type { StreakData } from "@/types/progress";

interface UseStreakReturn {
  streak: StreakData;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  streakHistory: [],
};

/**
 * Hook for fetching user streak data
 */
export function useStreak(): UseStreakReturn {
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchStreak() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/progress/streak");

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated - return default streak
            if (!cancelled) {
              setStreak(defaultStreak);
            }
            return;
          }
          throw new Error(`Failed to fetch streak: ${response.statusText}`);
        }

        const data = (await response.json()) as { streak: StreakData };

        if (!cancelled) {
          setStreak(data.streak ?? defaultStreak);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setStreak(defaultStreak);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchStreak();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { streak, isLoading, error, refresh };
}
