import type { Challenge } from "@/types/content";

type LegacyHintCarrier = {
  hints?: unknown;
  hint?: unknown;
  help?: unknown;
};

function normalizeHintList(input: unknown): string[] {
  if (typeof input === "string") {
    const trimmed = input.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  }

  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((hint): hint is string => typeof hint === "string")
    .map((hint) => hint.trim())
    .filter((hint) => hint.length > 0);
}

export function getLessonHints(challenge: Challenge | LegacyHintCarrier | null | undefined): string[] {
  if (!challenge) {
    return [];
  }

  const primary = normalizeHintList(challenge.hints);
  if (primary.length > 0) {
    return primary;
  }

  const legacyHint = "hint" in challenge ? challenge.hint : undefined;
  const fallback = normalizeHintList(legacyHint);
  if (fallback.length > 0) {
    return fallback;
  }

  const legacyHelp = "help" in challenge ? challenge.help : undefined;
  return normalizeHintList(legacyHelp);
}
