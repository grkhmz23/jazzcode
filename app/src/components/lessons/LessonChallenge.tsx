"use client";

import { useState, useEffect, useCallback } from "react";
import { ChallengeRunner } from "@/components/editor/ChallengeRunner";
import { RustChallenge } from "@/components/editor/RustChallenge";
import type { Challenge } from "@/types/content";
import type { CompletionResult } from "@/types/progress";

interface LessonChallengeProps {
  challenge: Challenge;
  courseSlug: string;
  lessonId: string;
  isCompleted: boolean;
  onComplete: (result: CompletionResult) => void;
}

/**
 * Get the localStorage key for saved code
 */
function getStorageKey(courseSlug: string, lessonId: string): string {
  return `jazzcode:code:${courseSlug}:${lessonId}`;
}

/**
 * LessonChallenge - Wrapper component that renders the appropriate challenge type
 * Handles auto-save to localStorage and language-specific challenge components
 */
export function LessonChallenge({
  challenge,
  courseSlug,
  lessonId,
  isCompleted,
  onComplete,
}: LessonChallengeProps) {
  const [savedCode, setSavedCode] = useState<string | null>(null);

  // Load saved code from localStorage on mount
  useEffect(() => {
    const storageKey = getStorageKey(courseSlug, lessonId);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSavedCode(saved);
      }
    } catch {
      // localStorage not available (e.g., private browsing)
      setSavedCode(null);
    }
  }, [courseSlug, lessonId]);

  // Determine the starter code (use saved code if available, otherwise use challenge starter)
  const starterCode = savedCode ?? challenge.starterCode;

  // Handle challenge completion
  const handleComplete = useCallback(async () => {
    // Call the API to complete the lesson
    try {
      const response = await fetch("/api/progress/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonId,
        }),
      });

      if (response.ok) {
        const result = (await response.json()) as CompletionResult;
        onComplete(result);
      }
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    }
  }, [courseSlug, lessonId, onComplete]);



  return (
    <div className="relative h-full">
      {/* Already completed banner */}
      {isCompleted && (
        <div className="absolute left-4 right-4 top-4 z-10 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center">
          <span className="text-sm font-medium text-green-700">
            You&apos;ve already completed this challenge ✅
          </span>
          <p className="text-xs text-green-600">
            You can still edit and run the code for practice
          </p>
        </div>
      )}

      {/* Render appropriate challenge component based on language */}
      {challenge.language === "rust" ? (
        <RustChallenge
          starterCode={starterCode}
          testCases={challenge.testCases}
          hints={challenge.hints}
          solution={challenge.solution}
          onComplete={handleComplete}
        />
      ) : (
        <ChallengeRunner
          starterCode={starterCode}
          language={challenge.language}
          testCases={challenge.testCases}
          hints={challenge.hints}
          solution={challenge.solution}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

/**
 * Clear saved code for a specific lesson
 */
export function clearSavedCode(courseSlug: string, lessonId: string): void {
  const storageKey = getStorageKey(courseSlug, lessonId);
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Ignore localStorage errors
  }
}
