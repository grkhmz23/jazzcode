"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowColor = "none" | "purple" | "amber" | "emerald" | "blue" | "indigo" | "slate";

const glowClass: Record<Exclude<GlowColor, "none">, string> = {
  purple: "bg-purple-500/10",
  amber: "bg-amber-500/10",
  emerald: "bg-emerald-500/10",
  blue: "bg-blue-500/10",
  indigo: "bg-indigo-500/10",
  slate: "bg-slate-500/10",
};

export function GlassCard({
  children,
  className,
  glowColor = "none",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1322]/75 shadow-2xl backdrop-blur-md",
        className
      )}
    >
      {glowColor !== "none" && (
        <div
          className={cn(
            "pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-[64px]",
            glowClass[glowColor]
          )}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function LuxuryBadge({
  children,
  color = "purple",
  className,
}: {
  children: ReactNode;
  color?: "purple" | "amber" | "emerald" | "slate";
  className?: string;
}) {
  const colors = {
    purple: "border-purple-500/20 bg-purple-500/10 text-purple-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    slate: "border-slate-500/20 bg-slate-500/10 text-slate-300",
  };

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
