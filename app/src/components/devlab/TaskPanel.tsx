"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Lightbulb, Pencil, TerminalSquare } from "lucide-react";
import { getQuestByTrack } from "@/lib/data/devlab-quests";
import { evaluateMission } from "@/lib/devlab/quest-engine";
import { useDevLabStore } from "@/lib/devlab/store";

function difficultyColor(value: "easy" | "medium" | "hard") {
  if (value === "easy") return "bg-[#4caf50]";
  if (value === "medium") return "bg-[#d7ba7d]";
  return "bg-[#f14c4c]";
}

export function TaskPanel() {
  const currentTrack = useDevLabStore((state) => state.currentTrack);
  const missionIndex = useDevLabStore((state) => state.currentMissionIndex);
  const objectiveStatus = useDevLabStore((state) => state.objectiveStatus);
  const missionStats = useDevLabStore((state) => state.missionStats);
  const revealHint = useDevLabStore((state) => state.useHint);
  const nextMission = useDevLabStore((state) => state.nextMission);
  const completedMissions = useDevLabStore((state) => state.completedMissions);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);

  const quest = getQuestByTrack(currentTrack);
  const mission = quest.missions[missionIndex];
  const completion = evaluateMission(mission, objectiveStatus, missionStats);

  const revealed = useMemo(() => new Set(revealedHints), [revealedHints]);

  const completeCount = mission.objectives.filter((objective) => objectiveStatus[objective.id]).length;
  const progress = Math.floor((completeCount / mission.objectives.length) * 100);

  return (
    <div className="flex h-full flex-col bg-[#1f1f1f] text-[#d4d4d4]">
      <div className="border-b border-[#3c3c3c] p-3">
        <p className="text-xs uppercase text-[#9d9d9d]">{quest.title}</p>
        <p className="mt-1 text-sm font-semibold">
          Mission {missionIndex + 1} of {quest.missions.length}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-3">
        <div className="rounded border border-[#3c3c3c] bg-[#252526] p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold">{mission.title}</h3>
            <span className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase text-black ${difficultyColor(mission.difficulty)}`}>
              {mission.difficulty}
            </span>
          </div>
          <p className="text-xs text-[#bdbdbd]">{mission.description}</p>

          <div className="mt-3 space-y-2">
            {mission.objectives.map((objective) => {
              const done = objectiveStatus[objective.id];
              return (
                <div key={objective.id} className="flex items-start gap-2 text-xs">
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#4ec9b0]" />
                  ) : (
                    <Circle className="mt-0.5 h-3.5 w-3.5 text-[#9d9d9d]" />
                  )}
                  {objective.type === "command" ? (
                    <TerminalSquare className="mt-0.5 h-3 w-3 text-[#9cdcfe]" />
                  ) : (
                    <Pencil className="mt-0.5 h-3 w-3 text-[#ce9178]" />
                  )}
                  <span className={done ? "text-[#4ec9b0] line-through" : "text-[#d4d4d4]"}>{objective.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded border border-[#3c3c3c] bg-[#252526] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase">Hints</h4>
            <span className="text-[11px] text-[#9d9d9d]">
              Hint {revealedHints.length}/{mission.hints.length}
            </span>
          </div>
          <button
            type="button"
            className="mb-2 flex items-center gap-1 rounded border border-[#3c3c3c] px-2 py-1 text-xs hover:bg-[#2f2f2f]"
            onClick={() => {
              const hint = revealHint();
              if (hint) setRevealedHints((prev) => [...prev, hint]);
            }}
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#d7ba7d]" />
            Show Hint
          </button>

          <div className="space-y-1">
            {mission.hints.map((hint, idx) =>
              revealed.has(hint) ? (
                <div key={hint} className="rounded bg-[#1e1e1e] px-2 py-1 text-xs text-[#cccccc]">
                  {idx + 1}. {hint}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#3c3c3c] bg-[#252526] p-3">
        <div className="mb-2 h-1.5 overflow-hidden rounded bg-[#3c3c3c]">
          <div className="h-full bg-[#007acc]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] text-[#9d9d9d]">
          <span>Time: {Math.floor((Date.now() - missionStats.startedAt) / 1000)}s</span>
          <span>Commands: {missionStats.commandsUsed}</span>
          <span>Hints: {missionStats.hintsUsed}</span>
          <span>Errors: {missionStats.errorsEncountered}</span>
        </div>
        <div className="mb-2 text-xs text-[#b5cea8]">Reward: {mission.xpReward} XP</div>
        <button
          type="button"
          disabled={!completion.complete}
          className="w-full rounded bg-[#007acc] px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => nextMission()}
        >
          {completion.complete ? "Next Mission" : "Complete objectives to continue"}
        </button>
        {completedMissions[mission.id] ? (
          <p className="mt-2 text-xs text-[#4ec9b0]">{mission.successMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
