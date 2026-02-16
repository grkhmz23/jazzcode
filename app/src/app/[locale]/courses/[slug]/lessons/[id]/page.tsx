"use client";

import { useState, useCallback, useEffect } from "react";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AchievementToastContainer } from "@/components/achievements";
import { LessonChallenge, LessonNavigation, LessonSidebar } from "@/components/lessons";
import { useProgress } from "@/lib/hooks/use-progress";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import type { CompletionResult } from "@/types/progress";
import type { Challenge, Module } from "@/types/content";
import {
  CheckCircle2,
  Loader2,
  Star,
  Trophy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LessonApiResponse {
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: "content" | "challenge";
    content: string;
    xpReward: number;
    challenge?: Challenge;
  };
  courseSlug: string;
  courseTitle: string;
  modules: Module[];
  prevLessonId: string | null;
  nextLessonId: string | null;
}

// XP Notification Component
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
            <p className="font-medium text-solana-green">
              {labels.xpEarned}
            </p>
            {result.isFirstOfDay && (
              <p className="text-sm text-solana-green/80">
                {labels.firstCompletionBonus}
              </p>
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

// Course Complete Banner
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
      <h2 className="mb-2 text-2xl font-bold text-green-700">
        {labels.title}
      </h2>
      <p className="mb-4 text-green-600">
        {labels.description}
      </p>
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

export default function LessonPage() {
  const params = useParams<{ slug: string; id: string }>();
  const t = useTranslations("lesson");
  const tc = useTranslations("common");
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const [lessonData, setLessonData] = useState<LessonApiResponse | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  // Fetch progress for this course
  const { progress, refresh: refreshProgress } = useProgress(params.slug);

  // Check if lesson is already completed
  const isLessonCompleted = progress?.completedLessons.includes(params.id) ?? false;

  // Fetch lesson data
  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(
          `/api/courses/${params.slug}/lessons/${params.id}`
        );
        if (res.ok) {
          const data = (await res.json()) as LessonApiResponse;
          setLessonData(data);
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setIsLoadingLesson(false);
      }
    }
    void fetchLesson();
  }, [params.slug, params.id]);

  // Auto-enroll on first visit
  useEffect(() => {
    if (isAuthenticated && !progress && !isEnrolling && !isLoadingLesson) {
      setIsEnrolling(true);
      fetch("/api/progress/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: params.slug }),
      })
        .then(() => {
          refreshProgress();
        })
        .catch(console.error)
        .finally(() => setIsEnrolling(false));
    }
  }, [
    isAuthenticated,
    progress,
    isEnrolling,
    isLoadingLesson,
    params.slug,
    refreshProgress,
  ]);

  // Handle lesson completion (for content lessons)
  const completeLesson = useCallback(async () => {
    if (!lessonData) return;

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

        // Track lesson completion with XP awarded
        trackEvent("complete_lesson", "lessons", lessonData.lesson.id, data.xpAwarded);

        if (data.xpAwarded > 0) {
          setShowToast(true);
        }

        // Check if course is complete
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
  }, [lessonData, refreshProgress]);

  // Handle challenge completion
  const handleChallengeComplete = useCallback(
    (result: CompletionResult) => {
      setCompletionResult(result);

      // Track challenge completion with XP awarded
      trackEvent("complete_lesson", "lessons", lessonData?.lesson.id, result.xpAwarded);

      if (result.xpAwarded > 0) {
        setShowToast(true);
      }

      // Check if course is complete
      if (result.isCourseComplete) {
        setShowCourseComplete(true);
      }

      refreshProgress();
    },
    [lessonData?.lesson.id, refreshProgress]
  );

  const dismissToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const dismissAchievementToast = useCallback((id: string) => {
    setCompletionResult((prev) => {
      if (!prev?.newAchievements) return prev;
      return {
        ...prev,
        newAchievements: prev.newAchievements.filter((a) => a !== id),
      };
    });
  }, []);

  if (isLoadingLesson || !lessonData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { lesson, courseSlug, courseTitle, modules } = lessonData;
  const isChallenge = lesson.type === "challenge" && lesson.challenge;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* XP Toast */}
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

      {/* Achievement Toasts */}
      {completionResult?.newAchievements &&
        completionResult.newAchievements.length > 0 && (
          <AchievementToastContainer
            achievementIds={completionResult.newAchievements}
            onDismiss={dismissAchievementToast}
          />
        )}

      {/* Top Navigation */}
      <LessonNavigation
        courseSlug={courseSlug}
        currentLessonId={lesson.id}
        modules={modules}
        completedLessons={progress?.completedLessons ?? []}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <LessonSidebar
          courseSlug={courseSlug}
          modules={modules}
          currentLessonId={lesson.id}
          completedLessons={progress?.completedLessons ?? []}
          courseTitle={courseTitle}
        />

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Course Complete Banner */}
          {showCourseComplete && (
            <div className="border-b p-4">
              <CourseCompleteBanner
                totalXP={completionResult?.totalXP ?? 0}
                onBackToCourse={() =>
                  (window.location.href = `/courses/${courseSlug}`)
                }
                labels={{
                  title: t("courseCompleteTitle"),
                  description: t("courseCompleteDescription"),
                  totalXpLabel: t("courseCompleteTotalXp"),
                  backToCourse: t("backToCourse"),
                }}
              />
            </div>
          )}

          {/* Lesson Content */}
          <div className="flex flex-1 overflow-hidden">
            {isChallenge ? (
              // Challenge Layout: Split pane
              <div className="flex w-full flex-col md:flex-row">
                {/* Left: Content */}
                <div className="h-1/2 overflow-y-auto border-b p-6 md:h-full md:w-2/5 md:border-b-0 md:border-r">
                  <Badge variant="outline" className="mb-4">
                    {lesson.xpReward} {tc("xp")}
                  </Badge>
                  <h1 className="mb-4 text-2xl font-bold">{lesson.title}</h1>
                  <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-solana-green prose-pre:bg-muted">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {lesson.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Right: Challenge Runner */}
                <div className="h-1/2 overflow-hidden md:h-full md:w-3/5">
                  <LessonChallenge
                    challenge={lesson.challenge!}
                    courseSlug={courseSlug}
                    lessonId={lesson.id}
                    isCompleted={isLessonCompleted}
                    onComplete={handleChallengeComplete}
                  />
                </div>
              </div>
            ) : (
              // Content Layout: Full width
              <div className="flex w-full flex-col">
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="mx-auto max-w-3xl">
                    <Badge variant="outline" className="mb-4">
                      {lesson.xpReward} {tc("xp")}
                    </Badge>
                    <h1 className="mb-6 text-3xl font-bold">{lesson.title}</h1>
                    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-code:text-solana-green prose-pre:bg-muted">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lesson.content}
                      </ReactMarkdown>
                    </div>

                    {/* Mark Complete Section */}
                    <div className="mt-12 flex items-center justify-between border-t pt-8">
                      {isAuthenticated ? (
                        isLessonCompleted ? (
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
                                {t("markComplete")}
                              </>
                            )}
                          </Button>
                        )
                      ) : (
                        <Link href="/auth/signin">
                          <Button variant="outline" className="gap-2">
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
      </div>
    </div>
  );
}
