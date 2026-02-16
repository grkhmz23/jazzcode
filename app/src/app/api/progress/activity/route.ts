import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { validateQuery } from "@/lib/api/validation";
import { handleApiError } from "@/lib/api/errors";
import { logger, generateRequestId } from "@/lib/logging/logger";

/**
 * Schema for activity query params
 */
const activityQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

interface ActivityItem {
  id: string;
  courseSlug: string;
  lessonId: string;
  xpAwarded: number;
  completedAt: string;
  lessonTitle?: string;
}

/**
 * GET /api/progress/activity
 * Get recent lesson completion activity for the authenticated user
 */
export async function GET(request: Request): Promise<Response> {
  const requestId = generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const { limit } = validateQuery(activityQuerySchema, searchParams);

    // Fetch recent completions
    const completions = await prisma.lessonCompletion.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: limit,
      select: {
        id: true,
        courseSlug: true,
        lessonId: true,
        xpAwarded: true,
        completedAt: true,
      },
    });

    // Format response
    const activity: ActivityItem[] = completions.map((c) => ({
      id: c.id,
      courseSlug: c.courseSlug,
      lessonId: c.lessonId,
      xpAwarded: c.xpAwarded,
      completedAt: c.completedAt.toISOString(),
    }));

    return NextResponse.json(
      { activity, requestId },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Failed to get activity", { requestId, error });
    return handleApiError(error);
  }
}
