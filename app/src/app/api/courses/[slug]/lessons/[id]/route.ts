import { NextResponse } from 'next/server';
import { getContentService } from '@/lib/services/content-factory';

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
  _request: Request,
  { params }: RouteParams
): Promise<Response> {
  try {
    const service = getContentService();
    const course = await service.getCourse(params.slug);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const lesson = await service.getLesson(params.slug, params.id);

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Find the module containing this lesson
    const containingModule = course.modules.find(m =>
      m.lessons.some(l => l.id === params.id)
    );

    // Flatten all lessons to find prev/next
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === params.id);
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
    console.error('Failed to fetch lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
