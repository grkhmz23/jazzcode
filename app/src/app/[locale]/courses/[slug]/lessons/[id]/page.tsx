import { notFound } from "next/navigation";
import type { Challenge, Lesson, Module } from "@/types/content";
import { getContentService } from "@/lib/services/content-factory";
import LessonPageClient, {
  type LessonApiResponse,
} from "@/components/lessons/LessonPageClient";

interface LessonPageProps {
  params: {
    slug: string;
    id: string;
  };
}

function toChallenge(lesson: Lesson): Challenge | undefined {
  if (lesson.type !== "challenge") {
    return undefined;
  }

  const challengeLesson = lesson as Partial<Challenge>;

  if (
    typeof challengeLesson.starterCode !== "string" ||
    (challengeLesson.language !== "typescript" &&
      challengeLesson.language !== "rust") ||
    !Array.isArray(challengeLesson.testCases) ||
    !Array.isArray(challengeLesson.hints) ||
    typeof challengeLesson.solution !== "string"
  ) {
    return undefined;
  }

  return {
    ...lesson,
    starterCode: challengeLesson.starterCode,
    language: challengeLesson.language,
    testCases: challengeLesson.testCases,
    hints: challengeLesson.hints,
    solution: challengeLesson.solution,
  };
}

function toClientLessonType(type: Lesson["type"]): "content" | "challenge" {
  return type === "challenge" ? "challenge" : "content";
}

function buildLessonPayload(
  slug: string,
  courseTitle: string,
  modules: Module[],
  lesson: Lesson
): LessonApiResponse {
  const allLessons = modules.flatMap((moduleItem) => moduleItem.lessons);
  const currentIndex = allLessons.findIndex((item) => item.id === lesson.id);

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      type: toClientLessonType(lesson.type),
      content: lesson.content,
      xpReward: lesson.xpReward,
      challenge: toChallenge(lesson),
    },
    courseSlug: slug,
    courseTitle,
    modules,
    prevLessonId: currentIndex > 0 ? allLessons[currentIndex - 1].id : null,
    nextLessonId:
      currentIndex >= 0 && currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1].id
        : null,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const service = getContentService();
  const course = await service.getCourse(params.slug);

  if (!course) {
    notFound();
  }

  const lesson = await service.getLesson(params.slug, params.id);
  if (!lesson) {
    notFound();
  }

  const initialData = buildLessonPayload(
    course.slug,
    course.title,
    course.modules,
    lesson
  );

  return <LessonPageClient slug={params.slug} initialData={initialData} />;
}
