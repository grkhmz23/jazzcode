"use client";

import { useEffect } from "react";
import { DevLabLayout } from "@/components/devlab/DevLabLayout";
import { useDevLabStore } from "@/lib/devlab/store";

export default function DevLabPage() {
  const loadProgress = useDevLabStore((state) => state.loadProgress);

  useEffect(() => {
    loadProgress();
    document.documentElement.classList.add("dark");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap";
    document.head.appendChild(link);
    return () => {
      document.documentElement.classList.remove("dark");
      document.head.removeChild(link);
    };
  }, [loadProgress]);

  return (
    <main
      className="academy-pop-in min-h-[75vh] overflow-hidden rounded-3xl border border-white/10 bg-[#11131d]"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      <DevLabLayout />
    </main>
  );
}
