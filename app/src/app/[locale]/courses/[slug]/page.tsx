"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useProgress } from "@/lib/hooks/use-progress";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";
import {
  BookOpen,
  Clock,
  Zap,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Code2,
  ArrowLeft,
  Loader2,
  LogIn,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Course } from "@/types/content";

export default function CourseDetailPage() {
  const t = useTranslations("courses");
  const tc = useTranslations("common");
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch progress for this course
  const { progress, refresh: refreshProgress } = useProgress(params.slug);
  const isEnrolled = !!progress;
  const completionPercent = progress?.completionPercent ?? 0;

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${params.slug}`);
        if (res.ok) {
          const data = (await res.json()) as { course: Course };
          setCourse(data.course);
          // Auto-expand the first module
          if (data.course.modules.length > 0) {
            setExpandedModules(new Set([data.course.modules[0].id]));
          }
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchCourse();
  }, [params.slug]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const handleEnroll = useCallback(async () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch("/api/progress/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: params.slug }),
      });

      if (response.ok) {
        // Track enrollment event
        trackEvent("enroll_course", "courses", params.slug);
        refreshProgress();
        // Navigate to first lesson
        if (course?.modules[0]?.lessons[0]) {
          router.push(`/courses/${params.slug}/lessons/${course.modules[0].lessons[0].id}`);
        }
      }
    } catch (err) {
      console.error("Failed to enroll:", err);
    } finally {
      setIsEnrolling(false);
    }
  }, [isAuthenticated, params.slug, course, router, refreshProgress]);

  const handleContinue = useCallback(() => {
    if (!course) return;

    // Find first uncompleted lesson
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (!progress?.completedLessons.includes(lesson.id)) {
          router.push(`/courses/${params.slug}/lessons/${lesson.id}`);
          return;
        }
      }
    }

    // All lessons completed - go to first lesson
    if (course.modules[0]?.lessons[0]) {
      router.push(`/courses/${params.slug}/lessons/${course.modules[0].lessons[0].id}`);
    }
  }, [course, progress, params.slug, router]);

  if (isLoading || !course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const whatYouLearn = course.modules
    .flatMap((moduleItem) => moduleItem.lessons)
    .slice(0, 6)
    .map((lessonItem) => lessonItem.title);

  return (
    <div className="container py-8 md:py-12">
      <Link href="/courses" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {tc("back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline">{tc(course.difficulty)}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{course.description}</p>

            {/* Progress bar for enrolled users */}
            {isEnrolled && (
              <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{t("progress", { percent: completionPercent })}</span>
                  <span className="text-xs text-muted-foreground">
                    {progress?.completedLessons.length ?? 0} / {totalLessons} {tc("lessons")}
                  </span>
                </div>
                <Progress value={completionPercent} className="h-2" />
              </div>
            )}
          </div>

          {whatYouLearn.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("whatYouLearn")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-solana-green" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold">{t("curriculum")}</h2>
            <div className="space-y-3">
              {course.modules.map((mod) => {
                const isExpanded = expandedModules.has(mod.id);
                return (
                  <Card key={mod.id} className="overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/50"
                      onClick={() => toggleModule(mod.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-medium">{mod.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {mod.lessons.length} {tc("lessons")}
                          </p>
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t px-4 pb-4">
                        {mod.lessons.map((lessonItem) => {
                          const isCompleted = progress?.completedLessons.includes(lessonItem.id) ?? false;
                          return (
                            <Link
                              key={lessonItem.id}
                              href={`/courses/${course.slug}/lessons/${lessonItem.id}`}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/50"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-solana-green" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div className="flex-1">
                                <span className={`text-sm ${isCompleted ? "text-muted-foreground line-through" : ""}`}>
                                  {lessonItem.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {lessonItem.type === "challenge" ? (
                                  <Code2 className="h-3.5 w-3.5 text-solana-purple" />
                                ) : (
                                  <PlayCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {lessonItem.duration}
                                </span>
                                <Badge variant="outline" className="text-[10px]">
                                  +{lessonItem.xpReward} {tc("xp")}
                                </Badge>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="space-y-4 p-6">
              <div className="flex h-40 items-center justify-center rounded-lg bg-muted">
                <BookOpen className="h-16 w-16 text-muted-foreground/30" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tc("xp")}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Zap className="h-4 w-4 text-solana-green" />
                    {course.totalXP}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{tc("lessons")}</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("instructor")}</span>
                  <span className="font-medium">Superteam Academy</span>
                </div>
              </div>

              <Separator />

              {/* Enrollment CTA */}
              {!isAuthenticated ? (
                <Link href="/auth/signin">
                  <Button className="w-full gap-2" size="lg" variant="outline">
                    <LogIn className="h-4 w-4" />
                    {t("signInToTrack")}
                  </Button>
                </Link>
              ) : isEnrolled ? (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    variant="solana"
                    onClick={handleContinue}
                  >
                    {completionPercent > 0 ? t("continue") : t("startCourse")}
                  </Button>
                  <Link href={`/courses/${params.slug}/learn`}>
                    <Button className="w-full" size="lg" variant="outline">
                      Learn Runtime (V2)
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  variant="solana"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("enrolled")}
                    </>
                  ) : (
                    t("enrollCTA")
                  )}
                </Button>
              )}

              <p className="text-center text-xs text-muted-foreground">{tc("free")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
