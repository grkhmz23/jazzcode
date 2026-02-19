"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { getQuestByTrack } from "@/lib/data/devlab-quests";
import { useDevLabStore } from "@/lib/devlab/store";

export function MenuBar() {
  const t = useTranslations("devlab");
  const currentTrack = useDevLabStore((state) => state.currentTrack);
  const missionIndex = useDevLabStore((state) => state.currentMissionIndex);
  const totalXP = useDevLabStore((state) => state.totalXP);
  const sessionStartTime = useDevLabStore((state) => state.sessionStartTime);

  const quest = getQuestByTrack(currentTrack);
  const mission = quest.missions[missionIndex];
  const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  const menus = useMemo(() => ["File", "Edit", "View", "Terminal", "Help"], []);

  return (
    <div className="flex h-9 items-center border-b border-[#3c3c3c] bg-[#252526] px-3 text-xs text-[#cccccc]">
      <div className="flex items-center gap-4">
        {menus.map((menu) => (
          <button key={menu} className="rounded px-1.5 py-0.5 hover:bg-[#37373d]">
            {menu}
          </button>
        ))}
      </div>
      <div className="flex-1 text-center font-medium text-[#d4d4d4]">{t("title")}</div>
      <div className="flex items-center gap-4 text-[11px]">
        <span className="max-w-[220px] truncate text-[#9cdcfe]">{mission?.title ?? t("title")}</span>
        <span className="text-[#b5cea8]">{totalXP} XP</span>
        <span className="text-[#d7ba7d]">
          {minutes}:{seconds}
        </span>
      </div>
    </div>
  );
}
