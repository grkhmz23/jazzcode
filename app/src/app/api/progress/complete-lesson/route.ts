import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth/config";
import { getProgressService } from "@/lib/services/progress-factory";
import { validate, Schemas } from "@/lib/api/validation";
import { Errors, handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";

/**
 * Schema for lesson completion request
 */
const completeLessonSchema = z.object({
  courseSlug: Schemas.slug,
  lessonId: z.string().min(1, "Lesson ID is required"),
});

/**
 * POST /api/progress/complete-lesson
 * Mark a lesson as completed and award XP
 */
export async function POST(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw Errors.unauthorized("You must be signed in to complete lessons");
    }

    // Parse and validate request body
    const body = (await request.json()) as unknown;
    const { courseSlug, lessonId } = validate(completeLessonSchema, body);

    // Complete lesson
    const progressService = getProgressService();
    const result = await progressService.completeLesson(
      session.user.id,
      courseSlug,
      lessonId
    );

    logger.info("Lesson completed", {
      requestId,
      userId: session.user.id,
      courseSlug,
      lessonId,
      xpAwarded: result.xpAwarded,
      leveledUp: result.leveledUp,
    });

    return NextResponse.json(
      { ...result, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to complete lesson", { requestId, error });
    return handleApiError(error);
  }
}
