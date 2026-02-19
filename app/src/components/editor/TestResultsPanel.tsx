"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TestResult } from "@/lib/challenge-runner";

interface TestResultsPanelProps {
  results: TestResult[];
  isRunning: boolean;
  totalTime: number;
}

interface TestResultItemProps {
  result: TestResult;
  index: number;
  challengeT: ReturnType<typeof useTranslations>;
}

function TestResultItem({ result, index, challengeT }: TestResultItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasError = result.error !== null;
  const hasMismatch = !result.passed && !hasError && result.actualOutput !== result.expectedOutput;

  return (
    <div
      className={cn(
        "animate-in slide-in-from-bottom-2 fade-in fill-mode-forwards rounded-lg border p-3 transition-all",
        result.passed
          ? "border-green-500/30 bg-green-500/5"
          : "border-red-500/30 bg-red-500/5",
        "duration-300"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {result.passed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>

        {/* Test Name */}
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium", result.passed ? "text-green-700" : "text-red-700")}>
            {result.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {result.executionTime}ms
          </p>
        </div>

        {/* Expand Button for failed tests */}
        {!result.passed && (hasError || hasMismatch) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && !result.passed && (
        <div className="mt-3 space-y-2 border-t border-red-500/20 pt-3 animate-in slide-in-from-top-1">
          {/* Error Message */}
          {hasError && (
            <div className="rounded bg-red-500/10 p-2">
              <p className="text-xs font-medium text-red-600">Error:</p>
              <p className="font-mono text-xs text-red-600">{result.error}</p>
            </div>
          )}

          {/* Output Mismatch */}
          {hasMismatch && (
            <div className="space-y-2">
              <div className="rounded bg-red-500/10 p-2">
                <p className="text-xs font-medium text-red-600">Expected:</p>
                <p className="font-mono text-xs text-red-600 whitespace-pre-wrap">
                  {result.expectedOutput}
                </p>
              </div>
              <div className="rounded bg-amber-500/10 p-2">
                <p className="text-xs font-medium text-amber-600">Got:</p>
                <p className="font-mono text-xs text-amber-600 whitespace-pre-wrap">
                  {result.actualOutput}
                </p>
              </div>
            </div>
          )}

          {/* Console Logs */}
          {result.logs.length > 0 && (
            <div className="rounded bg-muted p-2">
              <p className="text-xs font-medium text-muted-foreground">{challengeT("consoleOutput")}:</p>
              <pre className="mt-1 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                {result.logs.join("\n")}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TestResultsPanel({ results, isRunning, totalTime }: TestResultsPanelProps) {
  const t = useTranslations("challenge");
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount && totalCount > 0;

  if (results.length === 0 && !isRunning) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <>
              <Clock className="h-4 w-4 animate-pulse text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("runningTests")}</span>
            </>
          ) : (
            <>
              <span
                className={cn(
                  "text-sm font-medium",
                  allPassed ? "text-green-600" : "text-red-600"
                )}
              >
                {passedCount}/{totalCount} {t("testsPassed")}
              </span>
              <span className="text-xs text-muted-foreground">
                ({totalTime}{t("msSuffix")})
              </span>
            </>
          )}
        </div>
      </div>

      {/* Test Results List */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, index) => (
            <TestResultItem key={result.name} result={result} index={index} challengeT={t} />
          ))}
        </div>
      )}
    </div>
  );
}
