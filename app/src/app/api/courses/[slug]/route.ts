import { NextResponse } from 'next/server';
import { getContentService } from '@/lib/services/content-factory';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/routing';
import { Errors, handleApiError } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({ course });
  } catch (error) {
    return handleApiError(error);
  }
}
