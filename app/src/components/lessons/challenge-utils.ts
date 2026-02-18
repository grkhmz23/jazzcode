import type { Challenge } from "@/types/content";

export function getLessonHints(challenge: Challenge | null | undefined): string[] {
  if (!challenge || !Array.isArray(challenge.hints)) {
    return [];
  }

  return challenge.hints
    .filter((hint): hint is string => typeof hint === "string")
    .map((hint) => hint.trim())
    .filter((hint) => hint.length > 0);
}
