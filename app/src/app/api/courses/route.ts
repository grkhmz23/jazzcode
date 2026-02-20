import { NextResponse } from 'next/server';
import { getContentService } from '@/lib/services/content-factory';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/routing';
import { handleApiError } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

/**
 * GET /api/courses
 * Returns all courses
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const localeParam = new URL(request.url).searchParams.get("locale");
    const locale: Locale =
      localeParam && locales.includes(localeParam as Locale)
        ? (localeParam as Locale)
        : defaultLocale;

    const service = getContentService();
    const courses = await service.getCourses(locale);
    return NextResponse.json({ courses });
  } catch (error) {
    return handleApiError(error);
  }
}
