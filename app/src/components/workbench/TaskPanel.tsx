"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type {
  TaskQuest,
  TaskResult,
  TaskDefinition,
  SimulationState,
} from "@/lib/workbench/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2Icon,
  CircleIcon,
  LockIcon,
  LightbulbIcon,
  RotateCcwIcon,
  ChevronRightIcon,
} from "lucide-react";

interface TaskPanelProps {
  quest: TaskQuest;
  results: TaskResult[];
  revealedHintsByTask: Record<string, number>;
  onRevealHint: (taskId: string) => void;
  onReset: () => void;
  simulation: SimulationState;
  className?: string;
}

interface TaskItemProps {
  task: TaskDefinition;
  result: TaskResult | undefined;
  revealedHintCount: number;
  onRevealHint: () => void;
  t: ReturnType<typeof useTranslations>;
}

function TaskItem({ task, result, revealedHintCount, onRevealHint, t }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isComplete = result?.complete ?? false;
  const isLocked = result?.locked ?? true;

  const availableHints = task.hints.slice(0, revealedHintCount);
  const hasMoreHints = revealedHintCount < task.hints.length;

  return (
    <div
      className={cn(
        "rounded-lg border transition-colors",
        isComplete
          ? "border-green-500/30 bg-green-500/5"
          : isLocked
            ? "border-border/50 bg-muted/30"
            : "border-border bg-card"
      )}
    >
      {/* Header */}
      <button
        onClick={() => !isLocked && setIsExpanded(!isExpanded)}
        disabled={isLocked}
        className="flex w-full items-start gap-3 p-3 text-left"
      >
        {/* Status icon */}
        <div className="mt-0.5 shrink-0">
          {isComplete ? (
            <CheckCircle2Icon className="h-5 w-5 text-green-500" />
          ) : isLocked ? (
            <LockIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <CircleIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium",
                isComplete && "text-green-600",
                isLocked && "text-muted-foreground"
              )}
            >
              {task.title}
            </span>
            {!isLocked && (
              <ChevronRightIcon
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            )}
          </div>
          <p
            className={cn(
              "mt-1 text-sm",
              isLocked ? "text-muted-foreground/70" : "text-muted-foreground"
            )}
          >
            {task.description}
          </p>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && !isLocked && (
        <div className="border-t border-border px-3 pb-3">
          {/* Assertions */}
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("objectives")}
            </p>
            <ul className="space-y-1">
              {task.assertions.map((assertion, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  {assertion.type === "command_executed" && (
                    <span>Execute: <code className="rounded bg-muted px-1">{assertion.command}</code></span>
                  )}
                  {assertion.type === "file_contains" && (
                    <span>{t("assertFileContains", { path: assertion.path })}</span>
                  )}
                  {assertion.type === "balance_at_least" && (
                    <span>{t("assertBalanceAtLeast", { address: `${assertion.address.slice(0, 8)}...`, minSol: assertion.minSol })}</span>
                  )}
                  {assertion.type === "keypair_exists" && (
                    <span>{t("assertKeypairExists", { path: assertion.path })}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Hints */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("hintsTitle")}
            </p>
            {availableHints.length > 0 && (
              <ul className="space-y-2">
                {availableHints.map((hint, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 rounded bg-muted/50 p-2 text-sm text-muted-foreground"
                  >
                    <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            )}
            {hasMoreHints && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRevealHint}
                className="h-auto py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <LightbulbIcon className="mr-1 h-3 w-3" />
                {t("revealHintRemaining", { remaining: task.hints.length - revealedHintCount })}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TaskPanel({
  quest,
  results,
  revealedHintsByTask,
  onRevealHint,
  onReset,
  simulation,
  className,
}: TaskPanelProps) {
  const t = useTranslations("playground");
  const progress = React.useMemo(() => {
    const completed = results.filter((r) => r.complete).length;
    const total = quest.tasks.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [results, quest.tasks.length]);

  return (
    <div className={cn("flex h-full flex-col bg-[#252526]", className)}>
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{quest.title}</h3>
            <p className="text-sm text-muted-foreground">{quest.description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            title={t("resetWorkspaceTitle")}
          >
            <RotateCcwIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {progress.completed}/{progress.total} ({progress.percentage}%)
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
          {quest.tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              result={results[index]}
              revealedHintCount={revealedHintsByTask[task.id] ?? 0}
              onRevealHint={() => onRevealHint(task.id)}
              t={t}
            />
          ))}
      </div>

      {/* Footer - Simulation info */}
      <div className="border-t border-border px-4 py-3">
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="font-mono text-foreground">{simulation.solanaUrl}</span>
          </div>
          <div className="flex justify-between">
            <span>Keypairs:</span>
            <span className="font-mono text-foreground">
              {Object.keys(simulation.keypairs).length}
            </span>
          </div>
          {Object.keys(simulation.balances).length > 0 && (
            <div className="flex justify-between">
              <span>{t("walletsWithBalance")}</span>
              <span className="font-mono text-foreground">
                {Object.keys(simulation.balances).length}
              </span>
            </div>
          )}
          {Object.keys(simulation.tokenMints).length > 0 && (
            <div className="flex justify-between">
              <span>{t("tokenMints")}</span>
              <span className="font-mono text-foreground">
                {Object.keys(simulation.tokenMints).length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
