"use client";

import { Progress } from "@/components/ui/progress";
import { deriveLevel, xpProgressInLevel } from "@/types";

interface XPDisplayProps {
  xp: number;
  size?: "sm" | "lg";
  showProgress?: boolean;
}

export function XPDisplay({ xp, size = "lg", showProgress = true }: XPDisplayProps) {
  const level = deriveLevel(xp);
  const progress = xpProgressInLevel(xp);

  const sizeClasses = size === "sm" 
    ? "h-10 w-10 text-lg" 
    : "h-16 w-16 text-2xl";

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses.split(' ')[0]} ${sizeClasses.split(' ')[1]} rounded-full bg-gradient-to-br from-solana-purple/20 to-solana-green/20`}>
      <span className={`font-bold ${sizeClasses.split(' ')[2]}`}>L{level}</span>
      {showProgress && size === "lg" && (
        <div className="mt-2 w-32">
          <Progress value={progress.percent} />
        </div>
      )}
    </div>
  );
}
