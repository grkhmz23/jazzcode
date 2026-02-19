"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  Eye,
  ExternalLink,
  Info,
} from "lucide-react";
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
import { ConsoleOutput } from "./ConsoleOutput";
import { HintsPanel } from "@/components/lessons/HintsPanel";
import {
  runStructuralChecks,
  validateRustCode,
  type StructuralCheckResult,
} from "@/lib/structural-checker";
import { cn } from "@/lib/utils";

interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

interface RustChallengeProps {
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  solution: string;
  onComplete: () => void;
}

interface StructuralCheckItemProps {
  result: StructuralCheckResult;
  index: number;
}

function StructuralCheckItem({ result, index }: StructuralCheckItemProps) {
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
        <div className="flex-shrink-0">
          {result.passed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-500">
              ✕
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("font-medium", result.passed ? "text-green-700" : "text-red-700")}>
            {result.name}
          </p>
          {!result.passed && (
            <p className="text-xs text-red-600">{result.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function RustChallenge({
  starterCode,
  hints,
  solution,
  onComplete,
}: RustChallengeProps) {
  const t = useTranslations("challenge");
  const tc = useTranslations("common");
  const editorRef = useRef<CodeEditorHandle>(null);
  const [code, setCode] = useState(starterCode);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<StructuralCheckResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [allPassed, setAllPassed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // UI state
  const [showHints, setShowHints] = useState(false);
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [hasViewedSolution, setHasViewedSolution] = useState(false);

  const handleCheckCode = useCallback(() => {
    const currentCode = editorRef.current?.getValue() ?? code;

    // Validate code first
    const validation = validateRustCode(currentCode);
    if (!validation.valid) {
      setError(validation.error || t("invalidCode"));
      setResults([]);
      setAllPassed(false);
      return;
    }

    setIsChecking(true);
    setError(null);

    // Run structural checks
    const checkResults = runStructuralChecks(currentCode, solution);
    setResults(checkResults);
    setAllPassed(checkResults.every((r) => r.passed));
    setIsChecking(false);
  }, [code, solution, t]);

  const handleResetCode = useCallback(() => {
    editorRef.current?.setValue(starterCode);
    setCode(starterCode);
    setResetDialogOpen(false);
    setResults([]);
    setAllPassed(false);
    setError(null);
  }, [starterCode]);

  const handleShowSolution = useCallback(() => {
    setSolutionDialogOpen(false);
    setHasViewedSolution(true);
    setCode(solution);
    if (editorRef.current) {
      editorRef.current.setValue(solution);
    }
  }, [solution]);

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    onComplete();
  }, [onComplete]);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Info Banner */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          {t("rustValidationNotice")}{" "}
          <a
            href="https://beta.solpg.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-blue-900"
          >
            {t("solanaPlayground")}
          </a>
          .
        </AlertDescription>
      </Alert>

      {/* Editor */}
      <div className="flex-1 min-h-[300px]">
        <CodeEditor
          ref={editorRef}
          language="rust"
          defaultValue={starterCode}
          value={code}
          onChange={setCode}
          height="100%"
        />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2 border-t pt-4">
        <Button
          onClick={handleCheckCode}
          disabled={isChecking || isCompleted}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          {isChecking ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("checking")}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              {t("checkCode")}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setResetDialogOpen(true)}
          disabled={isChecking}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("resetCode")}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowHints(!showHints)}
          disabled={isChecking}
          className={cn("gap-2", showHints && "bg-blue-50")}
        >
          <Lightbulb className="h-4 w-4" />
          {showHints ? t("hideHints") : t("showHints")}
        </Button>

        <Button
          variant="outline"
          onClick={() => setSolutionDialogOpen(true)}
          disabled={isChecking || isCompleted}
          className="gap-2 border-yellow-500/50 text-yellow-700 hover:bg-yellow-50"
        >
          <Eye className="h-4 w-4" />
          {t("showSolution")}
        </Button>

        <Button
          variant="secondary"
          onClick={() => window.open("https://beta.solpg.io/", "_blank")}
          className="gap-2 ml-auto"
        >
          <ExternalLink className="h-4 w-4" />
          {t("openInSolanaPlayground")}
        </Button>
      </div>

      {/* Hints Panel */}
      {showHints && <HintsPanel hints={hints} defaultOpen />}

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
      {allPassed && !isCompleted && (
        <div className="animate-in zoom-in-95 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-lg font-bold">{t("allStructuralChecksPassed")}</span>
          </div>
          <p className="mt-1 text-sm text-green-600">
            {t("recommendTestInSolanaPlayground")}
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
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Structural Check Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t("structuralChecks")}</h3>
            <span
              className={cn(
                "text-sm font-medium",
                allPassed ? "text-green-600" : "text-red-600"
              )}
            >
              {t("checksPassedCount", {
                passed: results.filter((r) => r.passed).length,
                total: results.length,
              })}
            </span>
          </div>
          <div className="space-y-2">
            {results.map((result, index) => (
              <StructuralCheckItem
                key={result.name}
                result={result}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Console Output placeholder - kept for consistency */}
      <ConsoleOutput logs={[]} onClear={() => {}} />

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("resetCodeTitle")}</DialogTitle>
            <DialogDescription>
              {t("resetCodeChecksDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleResetCode} variant="destructive">
              {t("resetCode")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Solution Confirmation Dialog */}
      <Dialog open={solutionDialogOpen} onOpenChange={setSolutionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("viewSolutionTitle")}</DialogTitle>
            <DialogDescription>
              {t("viewSolutionWarning")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSolutionDialogOpen(false)}>
              {t("keepTrying")}
            </Button>
            <Button onClick={handleShowSolution} variant="default">
              {t("showSolution")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
