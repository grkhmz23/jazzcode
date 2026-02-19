"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, Lock, Timer, Trophy, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskQuest, TaskResult } from "@/lib/playground/tasks/types";
import { Achievement } from "@/lib/playground/progress/achievements";

interface TaskPanelProps {
  quest: TaskQuest;
  results: TaskResult[];
  revealedHintsByTask: Record<string, number>;
  onRevealHint: (taskId: string) => void;
  speedrunEnabled: boolean;
  speedrunLabel: string;
  onToggleSpeedrun: (enabled: boolean) => void;
  achievements: Achievement[];
  walletMode: "burner" | "external";
  onSetWalletMode: (mode: "burner" | "external") => void;
  burnerAddress: string | null;
  externalAddress: string | null;
  balanceLabel: string;
  onRefreshBalance: () => void;
  onCreateBurner: () => void;
  onResetBurner: () => void;
  onExportBurner: () => void;
  onConnectExternal: () => void;
  onDisconnectExternal: () => void;
  externalConnected: boolean;
  terminalHints: string[];
}

export function TaskPanel({
  quest,
  results,
  revealedHintsByTask,
  onRevealHint,
  speedrunEnabled,
  speedrunLabel,
  onToggleSpeedrun,
  achievements,
  walletMode,
  onSetWalletMode,
  burnerAddress,
  externalAddress,
  balanceLabel,
  onRefreshBalance,
  onCreateBurner,
  onResetBurner,
  onExportBurner,
  onConnectExternal,
  onDisconnectExternal,
  externalConnected,
  terminalHints,
}: TaskPanelProps) {
  const t = useTranslations("playground");
  const completeCount = results.filter((item) => item.complete).length;
  const percent = Math.floor((completeCount / quest.tasks.length) * 100);

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[#2f2f2f] bg-[#1f1f1f] text-[#d4d4d4]" aria-label={t("taskPanelAriaLabel")}>
      <div className="space-y-2 border-b border-[#313131] p-3">
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
          Quest
        </Badge>
        <h2 className="text-sm font-semibold">{quest.title}</h2>
        <p className="text-xs text-[#9d9d9d]">{quest.description}</p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
        <div className="rounded border border-[#313131] bg-[#252526] p-3">
          <div className="mb-2 h-1.5 overflow-hidden rounded bg-[#3c3c3c]">
            <div className="h-full bg-[#007acc]" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-xs text-[#9d9d9d]">
            {t("tasksComplete", { complete: completeCount, total: quest.tasks.length })}
          </p>
        </div>

        <div className="rounded border border-[#313131] bg-[#252526] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase text-[#9d9d9d]">Speedrun</h3>
            <Button
              type="button"
              variant={speedrunEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleSpeedrun(!speedrunEnabled)}
            >
              <Timer className="mr-1 h-3.5 w-3.5" />
              {speedrunEnabled ? "On" : "Off"}
            </Button>
          </div>
          <p className="text-xs text-[#d4d4d4]">{speedrunLabel}</p>
        </div>

        <div className="rounded border border-[#313131] bg-[#252526] p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase text-[#9d9d9d]">Wallet</h3>
          <div className="mb-2 flex gap-2">
            <Button size="sm" variant={walletMode === "burner" ? "default" : "outline"} onClick={() => onSetWalletMode("burner")}>Burner</Button>
            <Button size="sm" variant={walletMode === "external" ? "default" : "outline"} onClick={() => onSetWalletMode("external")}>External</Button>
          </div>
          {walletMode === "burner" ? (
            <div className="space-y-2">
              <p className="text-xs text-[#9d9d9d]">{burnerAddress ? `Address: ${burnerAddress}` : "No burner wallet yet."}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={onCreateBurner}>Create</Button>
                <Button size="sm" variant="outline" onClick={onExportBurner} disabled={!burnerAddress}>Export</Button>
                <Button size="sm" variant="outline" onClick={onResetBurner} disabled={!burnerAddress}>Reset</Button>
              </div>
              <p className="text-[11px] text-amber-300">{t("burnerSecretNotice")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-[#9d9d9d]">{externalAddress ? `Address: ${externalAddress}` : "External wallet not connected."}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={onConnectExternal} disabled={externalConnected}>Connect</Button>
                <Button size="sm" variant="outline" onClick={onDisconnectExternal} disabled={!externalConnected}>Disconnect</Button>
              </div>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-[#d4d4d4]">{balanceLabel}</p>
            <Button size="sm" variant="outline" onClick={onRefreshBalance}>
              <Wallet className="mr-1 h-3.5 w-3.5" />Refresh
            </Button>
          </div>
        </div>

        <div className="rounded border border-[#313131] bg-[#252526] p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase text-[#9d9d9d]">Tasks</h3>
          <ul className="space-y-2">
            {quest.tasks.map((task) => {
              const result = results.find((item) => item.taskId === task.id);
              const complete = Boolean(result?.complete);
              const locked = Boolean(result?.locked);
              const revealed = revealedHintsByTask[task.id] ?? 0;
              return (
                <li key={task.id} className="rounded border border-[#323232] p-2 text-xs">
                  <div className="flex items-start gap-2">
                    {locked ? (
                      <Lock className="mt-0.5 h-3.5 w-3.5 text-[#9d9d9d]" />
                    ) : complete ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#4ec9b0]" />
                    ) : (
                      <Circle className="mt-0.5 h-3.5 w-3.5 text-[#9d9d9d]" />
                    )}
                    <div className="flex-1">
                      <p className={complete ? "text-[#4ec9b0]" : "text-[#d4d4d4]"}>{task.title}</p>
                      <p className="text-[#9d9d9d]">{task.description}</p>
                    </div>
                  </div>
                  {!locked ? (
                    <div className="mt-2 space-y-1">
                      <Button size="sm" variant="outline" onClick={() => onRevealHint(task.id)}>
                        {t("revealHintCount", { revealed, total: task.hints.length })}
                      </Button>
                      {task.hints.slice(0, revealed).map((hint) => (
                        <p key={hint} className="rounded bg-[#1e1e1e] px-2 py-1 text-[#cccccc]">
                          {hint}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded border border-[#313131] bg-[#252526] p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase text-[#9d9d9d]">Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-xs text-[#9d9d9d]">{t("noBadgesYet")}</p>
          ) : (
            <ul className="space-y-1">
              {achievements.map((badge) => (
                <li key={badge.id} className="flex items-center gap-2 text-xs">
                  <Trophy className="h-3.5 w-3.5 text-yellow-300" />
                  <span>{badge.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded border border-[#313131] bg-[#252526] p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase text-[#9d9d9d]">{t("cliErrorHints")}</h3>
          {terminalHints.length === 0 ? (
            <p className="text-xs text-[#9d9d9d]">{t("noActiveErrors")}</p>
          ) : (
            <ul className="space-y-1 text-xs text-[#cccccc]">
              {terminalHints.map((hint) => (
                <li key={hint} className="rounded bg-[#1e1e1e] px-2 py-1">
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
