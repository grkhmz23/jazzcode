"use client";

import { useState, useEffect, useCallback } from "react";
import type { Progress } from "@/types/progress";

interface UseProgressReturn {
  progress: Progress | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook for fetching course progress for the current user
 * @param courseSlug - The slug of the course
 */
export function useProgress(courseSlug: string): UseProgressReturn {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProgress() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/progress/${courseSlug}`);

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated - return null (no progress)
            if (!cancelled) {
              setProgress(null);
            }
            return;
          }
          throw new Error(`Failed to fetch progress: ${response.statusText}`);
        }

        const data = (await response.json()) as { enrolled: boolean; progress?: Progress };

        if (!cancelled) {
          setProgress(data.enrolled && data.progress ? data.progress : null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setProgress(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchProgress();

    return () => {
      cancelled = true;
    };
  }, [courseSlug, refreshKey]);

  return { progress, isLoading, error, refresh };
}

interface UseAllProgressReturn {
  progressList: Progress[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook for fetching all progress for the current user
 */
export function useAllProgress(): UseAllProgressReturn {
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchAllProgress() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/progress");

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated - return empty array
            if (!cancelled) {
              setProgressList([]);
            }
            return;
          }
          throw new Error(`Failed to fetch progress: ${response.statusText}`);
        }

        const data = (await response.json()) as { progress: Progress[] };

        if (!cancelled) {
          setProgressList(data.progress ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setProgressList([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchAllProgress();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { progressList, isLoading, error, refresh };
}
