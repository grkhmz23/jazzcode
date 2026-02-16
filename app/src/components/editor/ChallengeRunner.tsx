"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, RotateCcw, Lightbulb, Eye, CheckCircle2, ChevronRight, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
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
import { CodeEditor, CodeEditorHandle } from "./CodeEditor";
import { TestResultsPanel } from "./TestResultsPanel";
import { ConsoleOutput } from "./ConsoleOutput";
import { runChallengeTests, type TestResult } from "@/lib/challenge-runner";
import { cn } from "@/lib/utils";

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
}

export function ChallengeRunner({
  starterCode,
  language,
  testCases,
  hints,
  solution,
  onComplete,
}: ChallengeRunnerProps) {
  const editorRef = useRef<CodeEditorHandle>(null);
  const [code, setCode] = useState(starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [allPassed, setAllPassed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // UI state
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);
  const [hasViewedSolution, setHasViewedSolution] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Collect all logs from test results
  useEffect(() => {
    const allLogs = results.flatMap((r) => r.logs);
    setLogs(allLogs);
  }, [results]);

  // Trigger confetti when all tests pass
  useEffect(() => {
    if (allPassed && !isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [allPassed, isCompleted]);

  const handleRunTests = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setResults([]);

    const currentCode = editorRef.current?.getValue() ?? code;
    const result = await runChallengeTests(currentCode, testCases);

    setResults(result.testResults);
    setTotalTime(result.totalTime);
    setError(result.error);
    setAllPassed(result.allPassed);
    setIsRunning(false);
  }, [code, testCases]);

  const handleResetCode = useCallback(() => {
    editorRef.current?.setValue(starterCode);
    setCode(starterCode);
    setResetDialogOpen(false);
    setResults([]);
    setAllPassed(false);
    setError(null);
    setLogs([]);
  }, [starterCode]);

  const handleShowNextHint = useCallback(() => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  }, [currentHintIndex, hints.length]);

  const handleShowSolution = useCallback(() => {
    setSolutionDialogOpen(false);
    setHasViewedSolution(true);
    if (editorRef.current) {
      editorRef.current.setValue(solution);
    }
  }, [solution]);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    onComplete();
  }, [onComplete]);

  // Get visible hints (up to current index)
  const visibleHints = hints.slice(0, currentHintIndex + 1);

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
              Run Tests
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
          Reset Code
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowHints(!showHints)}
          disabled={isRunning}
          className={cn("gap-2", showHints && "bg-blue-50")}
        >
          <Lightbulb className="h-4 w-4" />
          {showHints ? "Hide Hints" : "Show Hints"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setSolutionDialogOpen(true)}
          disabled={isRunning || isCompleted}
          className="gap-2 border-yellow-500/50 text-yellow-700 hover:bg-yellow-50"
        >
          <Eye className="h-4 w-4" />
          Show Solution
        </Button>
      </div>

      {/* Hints Panel */}
      {showHints && (
        <div className="space-y-2 animate-in slide-in-from-top-2">
          {visibleHints.map((hint, index) => (
            <Alert key={index} className="bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <span className="font-medium">Hint {index + 1} of {hints.length}: </span>
                {hint}
              </AlertDescription>
            </Alert>
          ))}
          {currentHintIndex < hints.length - 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowNextHint}
              className="gap-1 text-blue-600"
            >
              Next Hint
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Solution Warning */}
      {hasViewedSolution && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Eye className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You&apos;ve viewed the solution. You won&apos;t receive the &quot;Perfect Score&quot; achievement for this challenge.
          </AlertDescription>
        </Alert>
      )}

      {/* Success Banner */}
      {allPassed && !isCompleted && (
        <div className="animate-in zoom-in-95 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <Trophy className="h-6 w-6" />
            <span className="text-lg font-bold">All tests passed! 🎉</span>
          </div>
          <p className="mt-1 text-sm text-green-600">
            Great job! You can now complete this challenge and claim your XP.
          </p>
          <Button
            onClick={handleComplete}
            className="mt-3 gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete & Claim XP
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-lg font-bold">Challenge Completed!</span>
          </div>
          <p className="mt-1 text-sm text-green-600">
            You&apos;ve earned XP for this challenge. Keep up the great work!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      {(results.length > 0 || isRunning) && (
        <TestResultsPanel
          results={results}
          isRunning={isRunning}
          totalTime={totalTime}
        />
      )}

      {/* Console Output */}
      <ConsoleOutput logs={logs} onClear={handleClearLogs} />

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Code?</DialogTitle>
            <DialogDescription>
              This will restore the starter code and clear your current progress.
              Your test results will also be reset.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetCode} variant="destructive">
              Reset Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Solution Confirmation Dialog */}
      <Dialog open={solutionDialogOpen} onOpenChange={setSolutionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Solution?</DialogTitle>
            <DialogDescription>
              Are you sure? Viewing the solution means you won&apos;t get the
              &quot;Perfect Score&quot; achievement for this challenge.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSolutionDialogOpen(false)}>
              Keep Trying
            </Button>
            <Button onClick={handleShowSolution} variant="default">
              Show Solution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
