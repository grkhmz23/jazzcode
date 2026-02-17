"use client";

import { useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Keypair } from "@solana/web3.js";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AchievementToastContainer } from "@/components/achievements";
import { LessonChallenge, LessonNavigation, LessonSidebar } from "@/components/lessons";
import { QuizBlock } from "@/components/courses/QuizBlock";
import { TerminalBlock } from "@/components/courses/TerminalBlock";
import { AccountExplorer } from "@/components/courses/explorers/AccountExplorer";
import { PDADerivationExplorer } from "@/components/courses/explorers/PDADerivationExplorer";
import { useProgress } from "@/lib/hooks/use-progress";
import {
  clearSolanaFundamentalsState,
  createDefaultSolanaFundamentalsState,
  loadSolanaFundamentalsState,
  saveSolanaFundamentalsState,
  type SolanaFundamentalsLocalState,
  type SolanaTransferSummary,
} from "@/lib/courses/solana-fundamentals/local-state";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import type { CompletionResult } from "@/types/progress";
import type { Challenge, LessonBlock, Module } from "@/types/content";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Star, Trophy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface LessonApiResponse {
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: "content" | "challenge";
    content: string;
    blocks?: LessonBlock[];
    xpReward: number;
    challenge?: Challenge;
  };
  courseSlug: string;
  courseTitle: string;
  modules: Module[];
  prevLessonId: string | null;
  nextLessonId: string | null;
}

function XPTOast({
  result,
  onDismiss,
  labels,
}: {
  result: CompletionResult;
  onDismiss: () => void;
  labels: {
    xpEarned: string;
    firstCompletionBonus: string;
    levelUp: (level: number) => string;
  };
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="rounded-lg border border-solana-green/30 bg-solana-green/10 p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-solana-green/20">
            <Star className="h-5 w-5 text-solana-green" />
          </div>
          <div>
            <p className="font-medium text-solana-green">{labels.xpEarned}</p>
            {result.isFirstOfDay && (
              <p className="text-sm text-solana-green/80">{labels.firstCompletionBonus}</p>
            )}
            {result.leveledUp && (
              <div className="mt-2 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-500">
                  {labels.levelUp(result.newLevel ?? 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCompleteBanner({
  totalXP,
  onBackToCourse,
  labels,
}: {
  totalXP: number;
  onBackToCourse: () => void;
  labels: {
    title: string;
    description: string;
    totalXpLabel: string;
    backToCourse: string;
  };
}) {
  return (
    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Trophy className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-green-700">{labels.title}</h2>
      <p className="mb-4 text-green-600">{labels.description}</p>
      <div className="mb-4 flex justify-center gap-4">
        <div className="rounded-lg bg-green-500/10 px-4 py-2">
          <p className="text-sm text-green-600">{labels.totalXpLabel}</p>
          <p className="text-xl font-bold text-green-700">{totalXP}</p>
        </div>
      </div>
      <Button onClick={onBackToCourse} variant="solana">
        {labels.backToCourse}
      </Button>
    </div>
  );
}

function renderLessonBlocks(blocks: LessonBlock[] | undefined): ReactNode {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {blocks.map((block, index) => {
        const label =
          block.type === "quiz"
            ? "Quiz"
            : block.type === "terminal"
              ? "Terminal"
              : "Explorer";

        return (
          <details key={block.id} className="rounded-lg border bg-card p-4" open={index === 0}>
            <summary className="cursor-pointer list-none text-sm font-semibold">
              <span className="mr-2 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {label}
              </span>
              {block.title}
            </summary>
            <div className="mt-4">
              {block.type === "quiz" && <QuizBlock block={block} />}
              {block.type === "terminal" && <TerminalBlock block={block} />}
              {block.type === "explorer" && block.explorer === "AccountExplorer" && (
                <AccountExplorer title={block.title} samples={block.props.samples} />
              )}
              {block.type === "explorer" && block.explorer === "PDADerivationExplorer" && (
                <PDADerivationExplorer
                  title={block.title}
                  programId={block.props.programId}
                  seeds={block.props.seeds}
                />
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}

interface LessonPageClientProps {
  slug: string;
  initialData: LessonApiResponse;
}

export function LessonPageClient({ slug, initialData }: LessonPageClientProps) {
  const t = useTranslations("lesson");
  const tc = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userScope = session?.user?.email ?? session?.user?.name ?? "guest";

  const [lessonData] = useState<LessonApiResponse>(initialData);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showCourseComplete, setShowCourseComplete] = useState(false);
  const [localState, setLocalState] = useState<SolanaFundamentalsLocalState>(
    createDefaultSolanaFundamentalsState
  );

  const { progress, refresh: refreshProgress } = useProgress(slug);
  const { lesson, courseSlug, courseTitle, modules } = lessonData;
  const isSolanaFundamentals = courseSlug === "solana-fundamentals";

  const allLessons = useMemo(
    () =>
      modules.flatMap((module, moduleIndex) =>
        module.lessons.map((moduleLesson, lessonIndex) => ({
          module,
          moduleIndex,
          lesson: moduleLesson,
          lessonIndex,
        }))
      ),
    [modules]
  );
  const currentLessonIndex = allLessons.findIndex((item) => item.lesson.id === lesson.id);
  const currentLessonMeta = currentLessonIndex >= 0 ? allLessons[currentLessonIndex] : null;
  const prevLessonMeta = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLessonMeta =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const completedLessons = useMemo(() => {
    const merged = new Set<string>(progress?.completedLessons ?? []);
    if (isSolanaFundamentals) {
      for (const lessonId of localState.completedLessonIds) {
        merged.add(lessonId);
      }
    }
    return Array.from(merged);
  }, [isSolanaFundamentals, localState.completedLessonIds, progress?.completedLessons]);

  const completedCount = completedLessons.length;
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isLessonCompleted = completedLessons.includes(lesson.id);
  const isChallenge = lesson.type === "challenge" && lesson.challenge;

  const persistLocalState = useCallback(
    (next: SolanaFundamentalsLocalState) => {
      setLocalState(next);
      try {
        saveSolanaFundamentalsState(userScope, next);
      } catch {
        // best-effort local persistence
      }
    },
    [userScope]
  );

  const markLessonCompletedLocally = useCallback(
    (lessonId: string) => {
      if (!isSolanaFundamentals) {
        return;
      }
      const nextCompleted = new Set(localState.completedLessonIds);
      nextCompleted.add(lessonId);
      persistLocalState({
        ...localState,
        completedLessonIds: Array.from(nextCompleted),
      });
    },
    [isSolanaFundamentals, localState, persistLocalState]
  );

  const handleProjectStateUpdate = useCallback(
    (nextProject: { walletAddress?: string; transferSummary?: SolanaTransferSummary }) => {
      if (!isSolanaFundamentals) {
        return;
      }
      const nextWallet =
        nextProject.walletAddress && !localState.walletKeypair
          ? {
              publicKey: nextProject.walletAddress,
              secretKey: [],
            }
          : localState.walletKeypair;

      persistLocalState({
        ...localState,
        walletKeypair: nextWallet,
        lastTransferSummary: nextProject.transferSummary ?? localState.lastTransferSummary,
      });
    },
    [isSolanaFundamentals, localState, persistLocalState]
  );

  useEffect(() => {
    if (isAuthenticated && !progress && !isEnrolling) {
      setIsEnrolling(true);
      fetch("/api/progress/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: slug }),
      })
        .then(() => {
          refreshProgress();
        })
        .catch(console.error)
        .finally(() => setIsEnrolling(false));
    }
  }, [isAuthenticated, progress, isEnrolling, slug, refreshProgress]);

  useEffect(() => {
    if (!isSolanaFundamentals) {
      return;
    }
    try {
      setLocalState(loadSolanaFundamentalsState(userScope));
    } catch {
      setLocalState(createDefaultSolanaFundamentalsState());
    }
  }, [isSolanaFundamentals, userScope]);

  useEffect(() => {
    if (!isSolanaFundamentals || localState.walletKeypair) {
      return;
    }
    const generated = Keypair.generate();
    persistLocalState({
      ...localState,
      walletKeypair: {
        publicKey: generated.publicKey.toBase58(),
        secretKey: Array.from(generated.secretKey),
      },
    });
  }, [isSolanaFundamentals, localState, persistLocalState]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      const tag = target.tagName.toLowerCase();
      if (target.isContentEditable || tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }
      if (event.key === "n" && nextLessonMeta) {
        event.preventDefault();
        router.push(`/courses/${courseSlug}/lessons/${nextLessonMeta.lesson.id}`);
      } else if (event.key === "p" && prevLessonMeta) {
        event.preventDefault();
        router.push(`/courses/${courseSlug}/lessons/${prevLessonMeta.lesson.id}`);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [courseSlug, nextLessonMeta, prevLessonMeta, router]);

  const completeLesson = useCallback(async () => {
    if (!isAuthenticated) {
      markLessonCompletedLocally(lesson.id);
      return;
    }

    setIsCompleting(true);
    try {
      const response = await fetch("/api/progress/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: lessonData.courseSlug,
          lessonId: lessonData.lesson.id,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as CompletionResult;
        setCompletionResult(data);
        trackEvent("complete_lesson", "lessons", lessonData.lesson.id, data.xpAwarded);
        markLessonCompletedLocally(lesson.id);

        if (data.xpAwarded > 0) {
          setShowToast(true);
        }

        if (data.isCourseComplete) {
          setShowCourseComplete(true);
        }

        refreshProgress();
      }
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    } finally {
      setIsCompleting(false);
    }
  }, [isAuthenticated, lesson.id, lessonData, markLessonCompletedLocally, refreshProgress]);

  const handleChallengeComplete = useCallback(
    (result: CompletionResult | null) => {
      markLessonCompletedLocally(lesson.id);
      if (!result) {
        return;
      }
      setCompletionResult(result);
      trackEvent("complete_lesson", "lessons", lessonData.lesson.id, result.xpAwarded);

      if (result.xpAwarded > 0) {
        setShowToast(true);
      }

      if (result.isCourseComplete) {
        setShowCourseComplete(true);
      }

      refreshProgress();
    },
    [lesson.id, lessonData.lesson.id, markLessonCompletedLocally, refreshProgress]
  );

  const dismissToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const dismissAchievementToast = useCallback((achievementId: string) => {
    setCompletionResult((prev) => {
      if (!prev?.newAchievements) return prev;
      return {
        ...prev,
        newAchievements: prev.newAchievements.filter((a) => a !== achievementId),
      };
    });
  }, []);

  const clearLocalProjectState = useCallback(() => {
    if (!isSolanaFundamentals) {
      return;
    }
    clearSolanaFundamentalsState(userScope);
    setLocalState(createDefaultSolanaFundamentalsState());
  }, [isSolanaFundamentals, userScope]);

  if (!lessonData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {showToast && completionResult && (
        <XPTOast
          result={completionResult}
          onDismiss={dismissToast}
          labels={{
            xpEarned: t("xpEarned", { xp: completionResult.xpAwarded }),
            firstCompletionBonus: t("firstCompletionBonus"),
            levelUp: (level) => t("levelUp", { level }),
          }}
        />
      )}

      {completionResult?.newAchievements && completionResult.newAchievements.length > 0 && (
        <AchievementToastContainer
          achievementIds={completionResult.newAchievements}
          onDismiss={dismissAchievementToast}
        />
      )}

      <LessonNavigation
        courseSlug={courseSlug}
        currentLessonId={lesson.id}
        modules={modules}
        completedLessons={completedLessons}
      />

      <div className="flex flex-1 overflow-hidden">
        <LessonSidebar
          courseSlug={courseSlug}
          modules={modules}
          currentLessonId={lesson.id}
          completedLessons={completedLessons}
          courseTitle={courseTitle}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {showCourseComplete && (
            <div className="border-b p-4">
              <CourseCompleteBanner
                totalXP={completionResult?.totalXP ?? 0}
                onBackToCourse={() => (window.location.href = `/courses/${courseSlug}`)}
                labels={{
                  title: t("courseCompleteTitle"),
                  description: t("courseCompleteDescription"),
                  totalXpLabel: t("courseCompleteTotalXp"),
                  backToCourse: t("backToCourse"),
                }}
              />
            </div>
          )}

          <div className="grid flex-1 overflow-hidden xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex min-h-0 flex-col overflow-hidden">
              <div className="border-b px-6 py-4 md:px-8">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{courseTitle}</p>
                <h1 className="mt-1 text-2xl font-bold md:text-3xl">{lesson.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge variant="outline">
                    {lesson.xpReward} {tc("xp")}
                  </Badge>
                  {currentLessonMeta && (
                    <span className="text-sm text-muted-foreground">
                      {currentLessonMeta.module.title} • Lesson {currentLessonIndex + 1} of {totalLessons}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={progressPercent} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {completedCount}/{totalLessons}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {isChallenge ? (
                  <div className="flex h-full w-full flex-col md:flex-row">
                    <div className="h-1/2 overflow-y-auto border-b p-6 md:h-full md:w-2/5 md:border-b-0 md:border-r">
                      <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-solana-green prose-pre:bg-muted prose-blockquote:border-l-solana-green prose-blockquote:text-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
                      </div>
                      {renderLessonBlocks(lesson.blocks)}
                    </div>
                    <div className="h-1/2 overflow-hidden md:h-full md:w-3/5">
                      <LessonChallenge
                        challenge={lesson.challenge!}
                        courseSlug={courseSlug}
                        lessonId={lesson.id}
                        isAuthenticated={isAuthenticated}
                        isCompleted={isLessonCompleted}
                        onComplete={handleChallengeComplete}
                        onProjectStateUpdate={handleProjectStateUpdate}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                      <div className="mx-auto max-w-3xl">
                        <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-solana-green prose-pre:bg-muted prose-blockquote:border-l-solana-green prose-blockquote:text-foreground">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
                        </div>
                        {renderLessonBlocks(lesson.blocks)}
                        <div className="mt-12 flex items-center justify-between border-t pt-8">
                          {isLessonCompleted ? (
                            <div className="flex items-center gap-2 text-solana-green">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="font-medium">{tc("completed")}</span>
                            </div>
                          ) : (
                            <Button
                              onClick={completeLesson}
                              disabled={isCompleting}
                              variant="solana"
                              className="gap-2"
                            >
                              {isCompleting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  {t("markingComplete")}
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  {isAuthenticated ? t("markComplete") : "Mark Complete (Local)"}
                                </>
                              )}
                            </Button>
                          )}
                          {!isAuthenticated && (
                            <Link href="/auth/signin">
                              <Button variant="outline" size="sm">
                                {t("signInToTrack")}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isSolanaFundamentals && (
              <aside className="hidden border-l p-4 xl:block">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-base">Project Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Wallet Address</p>
                      <p className="mt-1 break-all font-mono text-xs">
                        {localState.walletKeypair?.publicKey ?? "Not initialized"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Last Transfer Summary</p>
                      {localState.lastTransferSummary ? (
                        <dl className="mt-1 space-y-1 text-xs">
                          <div className="grid grid-cols-[90px_1fr] gap-1">
                            <dt className="text-muted-foreground">From</dt>
                            <dd className="break-all font-mono">{localState.lastTransferSummary.from}</dd>
                          </div>
                          <div className="grid grid-cols-[90px_1fr] gap-1">
                            <dt className="text-muted-foreground">To</dt>
                            <dd className="break-all font-mono">{localState.lastTransferSummary.to}</dd>
                          </div>
                          <div className="grid grid-cols-[90px_1fr] gap-1">
                            <dt className="text-muted-foreground">Lamports</dt>
                            <dd className="font-mono">{localState.lastTransferSummary.lamports}</dd>
                          </div>
                          <div className="grid grid-cols-[90px_1fr] gap-1">
                            <dt className="text-muted-foreground">Blockhash</dt>
                            <dd className="break-all font-mono">
                              {localState.lastTransferSummary.recentBlockhash}
                            </dd>
                          </div>
                        </dl>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">Run lesson 4 or 8 challenge tests to capture a transfer summary.</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={clearLocalProjectState} className="w-full">
                      Clear Local Progress
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            )}
          </div>

          <div className="sticky bottom-0 z-10 flex items-center justify-between border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="text-xs text-muted-foreground">Shortcuts: n = next, p = previous</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevLessonMeta}
                onClick={() => {
                  if (prevLessonMeta) {
                    router.push(`/courses/${courseSlug}/lessons/${prevLessonMeta.lesson.id}`);
                  }
                }}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!nextLessonMeta}
                onClick={() => {
                  if (nextLessonMeta) {
                    router.push(`/courses/${courseSlug}/lessons/${nextLessonMeta.lesson.id}`);
                  }
                }}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPageClient;
