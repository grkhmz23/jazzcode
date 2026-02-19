"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Trophy } from "lucide-react";
import type { AchievementDefinition } from "@/types/achievements";

interface AchievementToastProps {
  achievement: AchievementDefinition;
  onDismiss: () => void;
}

/**
 * Get color class based on rarity
 */
function getRarityColor(rarity: AchievementDefinition["rarity"]): string {
  switch (rarity) {
    case "legendary":
      return "border-amber-400 bg-amber-400/10 text-amber-400";
    case "epic":
      return "border-purple-400 bg-purple-400/10 text-purple-400";
    case "rare":
      return "border-blue-400 bg-blue-400/10 text-blue-400";
    case "uncommon":
      return "border-emerald-400 bg-emerald-400/10 text-emerald-400";
    case "common":
    default:
      return "border-slate-400 bg-slate-400/10 text-slate-400";
  }
}

/**
 * Achievement Toast Component
 * Shows when an achievement is unlocked
 */
export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const t = useTranslations("common");
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div
        className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg ${getRarityColor(
          achievement.rarity
        )}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{t("achievementUnlocked")}</p>
          <p className="text-lg font-bold">{achievement.name}</p>
          <p className="text-sm opacity-80">{achievement.description}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl">{achievement.icon}</span>
            <span className="text-xs font-medium uppercase opacity-70">
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AchievementToastContainerProps {
  achievementIds: string[];
  onDismiss: (id: string) => void;
}

import { useState, useEffect as useEffect2 } from "react";
import { getAchievementById } from "@/lib/data/achievements";

/**
 * Achievement Toast Container
 * Manages multiple achievement toasts
 */
export function AchievementToastContainer({
  achievementIds,
  onDismiss,
}: AchievementToastContainerProps) {
  const [achievements, setAchievements] = useState<
    { id: string; def: AchievementDefinition }[]
  >([]);

  useEffect2(() => {
    const newAchievements = achievementIds
      .map((id) => ({ id, def: getAchievementById(id) }))
      .filter((item): item is { id: string; def: AchievementDefinition } =>
        item.def !== undefined
      );
    setAchievements(newAchievements);
  }, [achievementIds]);

  return (
    <>
      {achievements.map(({ id, def }) => (
        <AchievementToast
          key={id}
          achievement={def}
          onDismiss={() => onDismiss(id)}
        />
      ))}
    </>
  );
}
