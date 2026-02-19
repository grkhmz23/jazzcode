"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Play, RotateCcw, Lightbulb, Eye, CheckCircle2, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CodeEditor, CodeEditorHandle } from "./CodeEditor";
import { TestResultsPanel } from "./TestResultsPanel";
import { ConsoleOutput } from "./ConsoleOutput";
import { runChallengeTests, type TestResult } from "@/lib/challenge-runner";
import { cn } from "@/lib/utils";
import { HintsPanel } from "@/components/lessons/HintsPanel";
import {
  createFinishedChallengeRunState,
  createInitialChallengeRunState,
  createRunningChallengeRunState,
} from "@/components/editor/challenge-run-state";

interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

interface ChallengeRunnerProps {
  starterCode: string;
  language: "typescript" | "rust";
  testCases: TestCase[];
  hints: string[];
  solution: string;
  onComplete: () => void;
  onRunComplete?: (result: { allPassed: boolean; results: TestResult[] }) => void;
}

type RunStatus = "idle" | "running" | "passed" | "failed";

function statusBadgeClass(status: RunStatus): string {
  switch (status) {
    case "running":
      return "border-blue-300 text-blue-700";
    case "passed":
      return "border-green-300 text-green-700";
    case "failed":
      return "border-red-300 text-red-700";
    default:
      return "text-muted-foreground";
  }
}

function buildSolutionOutline(solution: string): string[] {
  const lines = solution
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const signatures = lines.filter(
    (line) =>
      line.startsWith("function ") ||
      line.startsWith("const ") ||
      line.startsWith("type ") ||
      line.startsWith("interface ")
  );
  const outline = signatures.slice(0, 6).map((line) => line.replace(/\s+/g, " ").slice(0, 100));

  if (outline.length === 0) {
    return [
      "1. Parse and validate command/input arguments before computing outputs.",
      "2. Compute deterministic lamports and transaction summary fields.",
      "3. Return stable, ordered output for test assertions.",
    ];
  }

  return outline.map((line, index) => `${index + 1}. ${line}`);
}

export function ChallengeRunner({
  starterCode,
  language,
  testCases,
  hints,
  solution,
  onComplete,
  onRunComplete,
}: ChallengeRunnerProps) {
  const t = useTranslations("challenge");
  const tc = useTranslations("common");
  const editorRef = useRef<CodeEditorHandle>(null);
  const [code, setCode] = useState(starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [runState, setRunState] = useState(() => createInitialChallengeRunState());
  const [isCompleted, setIsCompleted] = useState(false);

  // UI state
  const [showHints, setShowHints] = useState(false);
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);
  const [hasViewedSolution, setHasViewedSolution] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const solutionOutline = buildSolutionOutline(solution);

  // Collect all logs from test results
  useEffect(() => {
    const allLogs = runState.results.flatMap((r) => r.logs);
    setLogs(allLogs);
  }, [runState.results]);

  // Trigger confetti when all tests pass
  useEffect(() => {
    if (runState.allPassed && !isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [runState.allPassed, isCompleted]);

  const handleRunTests = useCallback(async () => {
    setIsRunning(true);
    setRunState((previous) => createRunningChallengeRunState(previous));

    // Track challenge run attempt
    trackEvent("run_challenge", "editor");

    const currentCode = editorRef.current?.getValue() ?? code;
    const result = await runChallengeTests(currentCode, testCases);
    const finishedState = createFinishedChallengeRunState(result);
    setRunState(finishedState);
    setIsRunning(false);
    onRunComplete?.({ allPassed: result.allPassed, results: result.testResults });

    // Track if all tests passed
    if (result.allPassed) {
      trackEvent("challenge_passed", "editor");
    }
  }, [code, onRunComplete, testCases]);

  const handleResetCode = useCallback(() => {
    editorRef.current?.setValue(starterCode);
    setCode(starterCode);
    setResetDialogOpen(false);
    setRunState(createInitialChallengeRunState());
    setLogs([]);
  }, [starterCode]);

  const handleShowSolutionOutline = useCallback(() => {
    setSolutionDialogOpen(false);
    setHasViewedSolution(true);
  }, []);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    onComplete();
  }, [onComplete]);

  const failedResults = runState.results.filter((result) => !result.passed);
  const firstFailure = failedResults[0] ?? null;
  const statusLabel = {
    idle: t("statusIdle"),
    running: t("statusRunning"),
    passed: t("statusPassed"),
    failed: t("statusFailed"),
  } as const;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Editor */}
      <div className="flex-1 min-h-[300px]">
        <CodeEditor
          ref={editorRef}
          language={language === "rust" ? "rust" : "typescript"}
          defaultValue={starterCode}
          value={code}
          onChange={setCode}
          height="100%"
        />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2 border-t pt-4">
        <Button
          onClick={handleRunTests}
          disabled={isRunning || isCompleted}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          {isRunning ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {runState.status === "passed" ? t("rerunTestsPassed") : t("runTests")}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setResetDialogOpen(true)}
          disabled={isRunning}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("resetToStarter")}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowHints(!showHints)}
          disabled={isRunning}
          className={cn("gap-2", showHints && "bg-blue-50")}
        >
          <Lightbulb className="h-4 w-4" />
          {showHints ? t("hideHints") : t("showHints")}
        </Button>

        <Button
          variant="outline"
          onClick={() => setSolutionDialogOpen(true)}
          disabled={isRunning || isCompleted}
          className="gap-2 border-yellow-500/50 text-yellow-700 hover:bg-yellow-50"
        >
          <Eye className="h-4 w-4" />
          {t("showSolutionOutline")}
        </Button>

        <Badge variant="outline" className={cn("ml-2", statusBadgeClass(runState.status))}>
          {statusLabel[runState.status]}
        </Badge>
      </div>

      {/* Hints Panel */}
      {showHints && <HintsPanel hints={hints} defaultOpen />}

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("runSummary")}</span>
            <Badge variant="outline" className={statusBadgeClass(runState.status)}>
              {statusLabel[runState.status]}
            </Badge>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            {runState.status === "idle" && t("noTestRunYet")}
            {runState.status === "running" && t("executingDeterministicTests")}
            {runState.status === "passed" && t("testsPassedIn", { ms: runState.totalTime })}
            {runState.status === "failed" && t("runFailedIn", { ms: runState.totalTime })}
          </p>
          {runState.status === "failed" && firstFailure && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">
              <p className="font-medium text-red-700">{firstFailure.name}</p>
              {firstFailure.error ? (
                <p className="mt-1 text-red-700">{firstFailure.error}</p>
              ) : (
                <p className="mt-1 text-red-700">
                  {t("expectedButGot", {
                    expected: firstFailure.expectedOutput,
                    actual: firstFailure.actualOutput,
                  })}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solution Warning */}
      {hasViewedSolution && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Eye className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {t("solutionViewedWarning")}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Banner */}
      {runState.allPassed && !isCompleted && (
        <div className="animate-in zoom-in-95 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <Trophy className="h-6 w-6" />
            <span className="text-lg font-bold">{t("allTestsPassedCelebration")}</span>
          </div>
          <p className="mt-1 text-sm text-green-600">
            {t("greatJobClaimXp")}
          </p>
          <Button
            onClick={handleComplete}
            className="mt-3 gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t("completeAndClaimXp")}
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-lg font-bold">{t("challengeCompletedTitle")}</span>
          </div>
          <p className="mt-1 text-sm text-green-600">
            {t("challengeCompletedBody")}
          </p>
        </div>
      )}

      {/* Error Message */}
      {runState.error && (
        <Alert variant="destructive">
          <AlertDescription>{runState.error}</AlertDescription>
        </Alert>
      )}

      {runState.status === "failed" && failedResults.length > 0 && (
        <Alert>
          <AlertDescription>
            <p className="mb-2 font-medium">{t("failingTests")}</p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {failedResults.map((result) => (
                <li key={result.name}>
                  {result.name}
                  {result.error ? (
                    <span className="text-muted-foreground"> - {result.error}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      {" "}{t("expectedGotInline", {
                        expected: result.expectedOutput,
                        actual: result.actualOutput,
                      })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <details className="mt-3 rounded border p-2">
              <summary className="cursor-pointer text-sm font-medium">{t("fullOutput")}</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">
                {failedResults
                  .map((result) =>
                    [
                      `[${result.name}]`,
                      `expected: ${result.expectedOutput}`,
                      `actual: ${result.actualOutput}`,
                      result.error ? `error: ${result.error}` : "",
                    ]
                      .filter(Boolean)
                      .join("\n")
                  )
                  .join("\n\n")}
              </pre>
            </details>
          </AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      {(runState.results.length > 0 || isRunning) && (
        <TestResultsPanel
          results={runState.results}
          isRunning={isRunning}
          totalTime={runState.totalTime}
        />
      )}

      {/* Console Output */}
      <ConsoleOutput logs={logs} onClear={handleClearLogs} />

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("resetCodeTitle")}</DialogTitle>
            <DialogDescription>
              {t("resetCodeDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleResetCode} variant="destructive">
              {t("resetToStarter")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Solution Confirmation Dialog */}
      <Dialog open={solutionDialogOpen} onOpenChange={setSolutionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("solutionOutlineTitle")}</DialogTitle>
            <DialogDescription>
              {t("solutionOutlineDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/40 p-3">
            <ul className="space-y-1 text-sm">
              {solutionOutline.map((item) => (
                <li key={item} className="font-mono">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSolutionDialogOpen(false)}>
              {t("keepCoding")}
            </Button>
            <Button onClick={handleShowSolutionOutline} variant="default">
              {t("iUnderstand")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
