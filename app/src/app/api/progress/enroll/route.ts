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
 * Schema for enrollment request
 */
const enrollSchema = z.object({
  courseSlug: Schemas.slug,
});

/**
 * POST /api/progress/enroll
 * Enroll the current user in a course
 */
export async function POST(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw Errors.unauthorized("You must be signed in to enroll in a course");
    }

    // Parse and validate request body
    const body = (await request.json()) as unknown;
    const { courseSlug } = validate(enrollSchema, body);

    // Enroll user
    const progressService = getProgressService();
    await progressService.enrollInCourse(session.user.id, courseSlug);

    logger.info("User enrolled in course", {
      requestId,
      userId: session.user.id,
      courseSlug,
    });

    return NextResponse.json(
      { success: true, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to enroll in course", { requestId, error });
    return handleApiError(error);
  }
}
