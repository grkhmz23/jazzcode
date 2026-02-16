"use client";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  FileText,
  Code2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Module, Lesson } from "@/types/content";

interface LessonSidebarProps {
  courseSlug: string;
  modules: Module[];
  currentLessonId: string;
  completedLessons: string[];
  courseTitle?: string;
}

interface LessonItemProps {
  lesson: Lesson;
  courseSlug: string;
  isCurrent: boolean;
  isCompleted: boolean;
}

function LessonItem({ lesson, courseSlug, isCurrent, isCompleted }: LessonItemProps) {
  const isChallenge = lesson.type === "challenge";

  return (
    <Link
      href={`/courses/${courseSlug}/lessons/${lesson.id}`}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        isCurrent
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
      ) : isChallenge ? (
        <Code2 className="h-4 w-4 shrink-0 text-blue-500" />
      ) : (
        <FileText className="h-4 w-4 shrink-0" />
      )}
      <span className="truncate">{lesson.title}</span>
    </Link>
  );
}

interface ModuleSectionProps {
  module: Module;
  courseSlug: string;
  currentLessonId: string;
  completedLessons: string[];
  defaultExpanded?: boolean;
}

function ModuleSection({
  module,
  courseSlug,
  currentLessonId,
  completedLessons,
  defaultExpanded = false,
}: ModuleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Check if current lesson is in this module
  const hasCurrentLesson = module.lessons.some(
    (l) => l.id === currentLessonId
  );

  // Calculate progress for this module
  const completedInModule = module.lessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const moduleProgress =
    module.lessons.length > 0
      ? Math.round((completedInModule / module.lessons.length) * 100)
      : 0;

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              hasCurrentLesson ? "text-primary" : "text-foreground"
            )}
          >
            {module.title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {completedInModule}/{module.lessons.length}
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-1 px-4 pb-3">
          <Progress value={moduleProgress} className="mb-2 h-1" />
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              courseSlug={courseSlug}
              isCurrent={lesson.id === currentLessonId}
              isCompleted={completedLessons.includes(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LessonSidebar({
  courseSlug,
  modules,
  currentLessonId,
  completedLessons,
  courseTitle,
}: LessonSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Calculate overall progress
  const totalLessons = modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const completedCount = completedLessons.length;
  const progressPercent =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  // Find which module contains the current lesson
  const currentModuleIndex = modules.findIndex((m) =>
    m.lessons.some((l) => l.id === currentLessonId)
  );

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="border-b p-4">
        {courseTitle && (
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
            {courseTitle}
          </h2>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Course Progress</span>
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalLessons}
          </span>
        </div>
        <Progress value={progressPercent} className="mt-2 h-2" />
      </div>

      {/* Modules */}
      <div className="overflow-y-auto">
        {modules.map((module, index) => (
          <ModuleSection
            key={module.id}
            module={module}
            courseSlug={courseSlug}
            currentLessonId={currentLessonId}
            completedLessons={completedLessons}
            defaultExpanded={
              index === currentModuleIndex || index === currentModuleIndex + 1
            }
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between border-b p-4 lg:hidden">
        <span className="text-sm font-medium">Course Content</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-x-0 top-[8rem] z-50 border-b bg-background lg:hidden">
          {sidebarContent}
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden h-full flex-col border-r lg:flex lg:w-80">
        {sidebarContent}
      </div>
    </>
  );
}
