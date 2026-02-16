"use client";

import { cn } from "@/lib/utils";
import type { AchievementWithStatus } from "@/types/achievements";

interface AchievementBadgeProps {
  achievement: AchievementWithStatus;
  size?: "sm" | "md" | "lg";
}

/**
 * Get border color class based on rarity
 */
function getRarityBorderColor(rarity: AchievementWithStatus["rarity"]): string {
  switch (rarity) {
    case "legendary":
      return "border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]";
    case "epic":
      return "border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.3)]";
    case "rare":
      return "border-blue-400";
    case "uncommon":
      return "border-emerald-400";
    case "common":
    default:
      return "border-slate-400";
  }
}

/**
 * Get background color class based on rarity
 */
function getRarityBgColor(rarity: AchievementWithStatus["rarity"]): string {
  switch (rarity) {
    case "legendary":
      return "bg-amber-400/10";
    case "epic":
      return "bg-purple-400/10";
    case "rare":
      return "bg-blue-400/10";
    case "uncommon":
      return "bg-emerald-400/10";
    case "common":
    default:
      return "bg-slate-400/10";
  }
}

/**
 * Achievement Badge Component
 * Shows an achievement icon with rarity-based styling
 */
export function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  return (
    <div
      className="group relative"
      title={`${achievement.name}${achievement.unlocked ? "" : " (Locked)"}`}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border-2 transition-all",
          sizeClasses[size],
          achievement.unlocked
            ? cn(getRarityBorderColor(achievement.rarity), getRarityBgColor(achievement.rarity))
            : "border-slate-600 bg-slate-800/50 grayscale opacity-60"
        )}
      >
        <span className={achievement.unlocked ? "" : "opacity-50"}>
          {achievement.icon}
        </span>
        {!achievement.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-400 text-lg font-bold">?</span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden w-48 -translate-x-1/2 rounded-lg border bg-popover p-3 text-sm shadow-lg group-hover:block">
        <p className="font-semibold">{achievement.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {achievement.unlocked ? achievement.description : "???"}
        </p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="mt-2 text-xs text-solana-green">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
        <p
          className={cn(
            "mt-1 text-xs font-medium capitalize",
            achievement.rarity === "legendary" && "text-amber-400",
            achievement.rarity === "epic" && "text-purple-400",
            achievement.rarity === "rare" && "text-blue-400",
            achievement.rarity === "uncommon" && "text-emerald-400",
            achievement.rarity === "common" && "text-slate-400"
          )}
        >
          {achievement.rarity}
        </p>
      </div>
    </div>
  );
}
