import { NextResponse } from 'next/server';
import { getContentService } from '@/lib/services/content-factory';

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/courses/[slug]
 * Returns a specific course by slug
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

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
