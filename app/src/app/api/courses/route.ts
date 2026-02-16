import { NextResponse } from 'next/server';
import { getContentService } from '@/lib/services/content-factory';

/**
 * GET /api/courses
 * Returns all courses
 */
export async function GET(): Promise<Response> {
  try {
    const service = getContentService();
    const courses = await service.getCourses();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
