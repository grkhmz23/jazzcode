"use client";

import { useMemo } from "react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { Module } from "@/types/content";

interface LessonNavigationProps {
  courseSlug: string;
  currentLessonId: string;
  modules: Module[];
  completedLessons: string[];
}

interface LessonInfo {
  id: string;
  title: string;
  slug: string;
  moduleId: string;
  moduleTitle: string;
  moduleIndex: number;
  lessonIndex: number;
  isCompleted: boolean;
}

/**
 * Flatten all lessons from all modules into a single ordered list
 */
function flattenLessons(modules: Module[], completedLessons: string[]): LessonInfo[] {
  const lessons: LessonInfo[] = [];

  modules.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      lessons.push({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        moduleId: module.id,
        moduleTitle: module.title,
        moduleIndex,
        lessonIndex,
        isCompleted: completedLessons.includes(lesson.id),
      });
    });
  });

  return lessons;
}

export function LessonNavigation({
  courseSlug,
  currentLessonId,
  modules,
  completedLessons,
}: LessonNavigationProps) {
  const lessons = useMemo(
    () => flattenLessons(modules, completedLessons),
    [modules, completedLessons]
  );

  const currentIndex = useMemo(
    () => lessons.findIndex((l) => l.id === currentLessonId),
    [lessons, currentLessonId]
  );

  const currentLesson = lessons[currentIndex];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (!currentLesson) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      {/* Left: Previous Lesson */}
      <div className="flex w-1/3 justify-start">
        {prevLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
          >
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous Lesson</span>
              <span className="sm:hidden">Previous</span>
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" size="sm" disabled className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous Lesson</span>
          </Button>
        )}
      </div>

      {/* Center: Lesson Info */}
      <div className="flex w-1/3 flex-col items-center text-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLesson.moduleTitle}</span>
        </div>
        <div className="text-sm font-medium">
          Lesson {currentLesson.lessonIndex + 1} of{" "}
          {
            lessons.filter((l) => l.moduleId === currentLesson.moduleId)
              .length
          }
        </div>
        {nextLesson && nextLesson.moduleId !== currentLesson.moduleId && (
          <div className="text-xs text-muted-foreground">
            Next: {nextLesson.moduleTitle}
          </div>
        )}
      </div>

      {/* Right: Next Lesson */}
      <div className="flex w-1/3 justify-end">
        {nextLesson ? (
          <Link
            href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
          >
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="hidden sm:inline">Next Lesson</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/courses/${courseSlug}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              Back to Course
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Get the next incomplete lesson for a course
 */
export function getNextLesson(
  modules: Module[],
  completedLessons: string[]
): LessonInfo | null {
  const lessons = flattenLessons(modules, completedLessons);
  return lessons.find((l) => !l.isCompleted) ?? null;
}

/**
 * Check if all lessons are complete
 */
export function isCourseComplete(
  modules: Module[],
  completedLessons: string[]
): boolean {
  const lessons = flattenLessons(modules, completedLessons);
  return lessons.length > 0 && lessons.every((l) => l.isCompleted);
}

/**
 * Get course progress stats
 */
export function getCourseProgress(
  modules: Module[],
  completedLessons: string[]
): { completed: number; total: number; percent: number } {
  const lessons = flattenLessons(modules, completedLessons);
  const completed = lessons.filter((l) => l.isCompleted).length;
  const total = lessons.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percent };
}
