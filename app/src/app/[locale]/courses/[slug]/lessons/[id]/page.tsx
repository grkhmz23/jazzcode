"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/editor/code-editor";
import { runChallenge, type RunnerResult } from "@/lib/challenge-runner/worker-runner";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  Trophy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Lesson } from "@/types";

interface LessonApiResponse {
  lesson: Lesson;
  courseSlug: string;
  courseTitle: string;
  moduleName: string;
  prevLessonId: string | null;
  nextLessonId: string | null;
}

export default function LessonPage() {
  const t = useTranslations("lesson");
  const tc = useTranslations("common");
  const params = useParams<{ slug: string; id: string }>();

  const [lessonData, setLessonData] = useState<LessonApiResponse | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunnerResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tests");

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/courses/${params.slug}/lessons/${params.id}`);
        if (res.ok) {
          const data = (await res.json()) as LessonApiResponse;
          setLessonData(data);
          if (data.lesson.challenge) {
            setCode(data.lesson.challenge.starterCode);
          }
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setIsLoadingLesson(false);
      }
    }
    void fetchLesson();
  }, [params.slug, params.id]);

  const handleRun = useCallback(async () => {
    if (!lessonData?.lesson.challenge) return;
    setIsRunning(true);
    setResult(null);
    setActiveTab("tests");

    try {
      const challenge = lessonData.lesson.challenge;
      const visibleTests = challenge.testCases.filter((tc) => !tc.hidden);
      const runResult = await runChallenge(code, visibleTests, challenge.timeoutMs);
      setResult(runResult);

      if (runResult.success && !isCompleted) {
        setIsCompleted(true);
        // Trigger progress update via API
        try {
          await fetch("/api/lessons/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId: lessonData.courseSlug,
              lessonId: lessonData.lesson.id,
              xpEarned: lessonData.lesson.xpReward,
            }),
          });
        } catch {
          // Progress update is best-effort; don't block the UI
        }
      }
    } catch {
      setResult({
        success: false,
        testResults: [],
        output: "",
        error: "Failed to execute code",
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, isCompleted, lessonData]);

  const handleReset = useCallback(() => {
    if (!lessonData?.lesson.challenge) return;
    setCode(lessonData.lesson.challenge.starterCode);
    setResult(null);
    setIsCompleted(false);
  }, [lessonData]);

  if (isLoadingLesson || !lessonData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { lesson, courseSlug, prevLessonId, nextLessonId } = lessonData;
  const challenge = lesson.challenge;
  const isChallenge = lesson.type === "challenge" && challenge;

  const visibleTests = challenge?.testCases.filter((tc) => !tc.hidden) ?? [];
  const passedCount = result?.testResults.filter((r) => r.passed).length ?? 0;
  const totalTests = visibleTests.length;

  // Content-only lesson layout
  if (!isChallenge) {
    return (
      <div className="container max-w-3xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/courses/${courseSlug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToCourse")}
          </Link>
          <div className="flex items-center gap-2">
            {prevLessonId && (
              <Link href={`/courses/${courseSlug}/lessons/${prevLessonId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  {t("previousLesson")}
                </Button>
              </Link>
            )}
            {nextLessonId && (
              <Link href={`/courses/${courseSlug}/lessons/${nextLessonId}`}>
                <Button variant="ghost" size="sm">
                  {t("nextLesson")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Badge variant="outline" className="mb-4 text-xs">
          <Zap className="mr-1 h-3 w-3 text-solana-green" />
          +{lesson.xpReward} {tc("xp")}
        </Badge>
        <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-solana-green prose-pre:bg-muted">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
        </div>
        <div className="mt-8 flex justify-end">
          {nextLessonId && (
            <Link href={`/courses/${courseSlug}/lessons/${nextLessonId}`}>
              <Button variant="solana" className="gap-2">
                {t("nextLesson")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Challenge layout: split content/editor
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${courseSlug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToCourse")}
          </Link>
          <span className="text-sm font-medium">{lesson.title}</span>
          <Badge variant="outline" className="text-xs">
            <Zap className="mr-1 h-3 w-3 text-solana-green" />
            +{lesson.xpReward} {tc("xp")}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {prevLessonId && (
            <Link href={`/courses/${courseSlug}/lessons/${prevLessonId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" />
                {t("previousLesson")}
              </Button>
            </Link>
          )}
          {nextLessonId && (
            <Link href={`/courses/${courseSlug}/lessons/${nextLessonId}`}>
              <Button variant="ghost" size="sm">
                {t("nextLesson")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Content */}
        <div className="w-1/2 overflow-y-auto border-r p-6">
          <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-solana-green prose-pre:bg-muted">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
          </div>

          {/* Hints */}
          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {showHints ? t("hideHints") : t("showHints")}
            </Button>
            {showHints && challenge.hints.length > 0 && (
              <div className="space-y-2">
                {challenge.hints.slice(0, currentHint + 1).map((hint, i) => (
                  <div key={i} className="rounded-md border bg-muted/50 p-3 text-sm">
                    <span className="font-medium text-amber-500">{t("hint", { number: i + 1 })}: </span>
                    {hint}
                  </div>
                ))}
                {currentHint < challenge.hints.length - 1 && (
                  <Button variant="ghost" size="sm" onClick={() => setCurrentHint((p) => p + 1)}>
                    {t("showHints")} ({currentHint + 2}/{challenge.hints.length})
                  </Button>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
              className="gap-2"
            >
              {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSolution ? t("hideSolution") : t("showSolution")}
            </Button>
            {showSolution && (
              <div className="rounded-md border bg-muted p-4">
                <pre className="overflow-x-auto text-sm">
                  <code>{challenge.solutionCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Editor + Tests */}
        <div className="flex w-1/2 flex-col">
          <div className="min-h-0 flex-1">
            <CodeEditor value={code} onChange={setCode} language={challenge.language} />
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between border-y px-4 py-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-1 h-4 w-4" />
                {t("reset")}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              {result && (
                <span className="text-sm text-muted-foreground">
                  {t("testsPassed", { passed: passedCount, total: totalTests })}
                </span>
              )}
              <Button
                onClick={handleRun}
                disabled={isRunning}
                variant={isCompleted ? "outline" : "solana"}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("running")}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {t("runCode")}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Test Results / Output */}
          <div className="h-64 overflow-y-auto border-t">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="m-2">
                <TabsTrigger value="tests">{t("tests")}</TabsTrigger>
                <TabsTrigger value="output">{t("output")}</TabsTrigger>
              </TabsList>
              <TabsContent value="tests" className="px-4 pb-4">
                {isCompleted && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-solana-green/30 bg-solana-green/10 p-3">
                    <Trophy className="h-5 w-5 text-solana-green" />
                    <div>
                      <p className="font-medium text-solana-green">{t("congratulations")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("xpEarned", { xp: lesson.xpReward })}
                      </p>
                    </div>
                  </div>
                )}
                {result ? (
                  <div className="space-y-2">
                    {result.testResults.map((tr) => (
                      <div
                        key={tr.testId}
                        className={`flex items-start gap-2 rounded-md border p-3 ${
                          tr.passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                        }`}
                      >
                        {tr.passed ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        )}
                        <div className="flex-1 text-sm">
                          <span className="font-medium">{tr.testName}</span>
                          {!tr.passed && (
                            <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                              <div>
                                Expected: <code className="text-foreground">{tr.expected}</code>
                              </div>
                              <div>
                                Actual: <code className="text-red-400">{tr.actual || "(empty)"}</code>
                              </div>
                              {tr.error && <div className="text-red-400">{tr.error}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-sm text-muted-foreground">
                    <Play className="mb-2 h-8 w-8 opacity-30" />
                    <p>{t("runToSeeResults")}</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="output" className="px-4 pb-4">
                <pre className="rounded-md bg-muted p-3 font-mono text-sm">
                  {result?.output || result?.error || t("noOutput")}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
