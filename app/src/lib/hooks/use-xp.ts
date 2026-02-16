"use client";

import { useState, useEffect, useCallback } from "react";

interface LevelInfo {
  current: number;
  required: number;
  percent: number;
}

interface UseXPReturn {
  xp: number;
  level: number;
  levelProgress: LevelInfo;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Calculate level from XP
 * Formula: Math.floor(Math.sqrt(totalXP / 100))
 */
function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100));
}

/**
 * Calculate XP needed for a specific level
 * Formula: level^2 * 100
 */
function xpForLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

/**
 * Calculate progress within the current level
 */
function calculateLevelProgress(xp: number): LevelInfo {
  const level = calculateLevel(xp);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = xp - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  const percent = required > 0 ? (current / required) * 100 : 0;

  return {
    current,
    required,
    percent: Math.round(percent * 10) / 10, // Round to 1 decimal place
  };
}

/**
 * Hook for fetching user XP and level information
 */
export function useXP(): UseXPReturn {
  const [xp, setXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchXP() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/progress/xp");

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated - return 0 XP
            if (!cancelled) {
              setXP(0);
            }
            return;
          }
          throw new Error(`Failed to fetch XP: ${response.statusText}`);
        }

        const data = (await response.json()) as { xp: number };

        if (!cancelled) {
          setXP(data.xp ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setXP(0);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchXP();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const level = calculateLevel(xp);
  const levelProgress = calculateLevelProgress(xp);

  return { xp, level, levelProgress, isLoading, error, refresh };
}
