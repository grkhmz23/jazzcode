import { NextResponse } from 'next/server';
import { getContentService } from '@/lib/services/content-factory';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/routing';
import { Errors, handleApiError } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    slug: string;
    id: string;
  };
}

/**
 * GET /api/courses/[slug]/lessons/[id]
 * Returns a specific lesson with context (prev/next lesson IDs)
 */
export async function GET(
  request: Request,
  { params }: RouteParams
): Promise<Response> {
  try {
    const localeParam = new URL(request.url).searchParams.get("locale");
    const locale: Locale =
      localeParam && locales.includes(localeParam as Locale)
        ? (localeParam as Locale)
        : defaultLocale;

    const service = getContentService();
    const course = await service.getCourse(params.slug, locale);

    if (!course) {
      throw Errors.notFound("Course not found");
    }

    const lesson = await service.getLesson(params.slug, params.id, locale);

    if (!lesson) {
      throw Errors.notFound("Lesson not found");
    }

    const resolvedLessonId = lesson.id;

    // Find the module containing this lesson
    const containingModule = course.modules.find((m) =>
      m.lessons.some((l) => l.id === resolvedLessonId)
    );

    // Flatten all lessons to find prev/next
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === resolvedLessonId);
    const prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1].id : null;
    const nextLessonId = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : null;

    return NextResponse.json({
      lesson,
      courseSlug: course.slug,
      courseTitle: course.title,
      moduleName: containingModule?.title ?? '',
      prevLessonId,
      nextLessonId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
