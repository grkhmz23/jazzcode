import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/middleware";
import { Errors, handleApiError } from "@/lib/api/errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`profile-export:${ip}`, {
      limit: 10,
      windowSeconds: 60,
    });
    if (!rate.success) {
      const retryAfter = Math.max(1, rate.reset - Math.floor(Date.now() / 1000));
      return NextResponse.json(
        { error: "Too many export requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(rate.limit),
            "X-RateLimit-Remaining": String(rate.remaining),
            "X-RateLimit-Reset": String(rate.reset),
          },
        }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw Errors.unauthorized("Unauthorized");
    }

    const userId = session.user.id;

    const [user, wallets, accounts, enrollments, completions, userXP, streak, achievements] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            bio: true,
            avatarUrl: true,
            isPublic: true,
            preferredLocale: true,
            theme: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.userWallet.findMany({
          where: { userId },
          select: { address: true, isPrimary: true, linkedAt: true },
          orderBy: { linkedAt: "asc" },
        }),
        prisma.account.findMany({
          where: { userId },
          select: { provider: true },
        }),
        prisma.enrollment.findMany({
          where: { userId },
          select: { courseSlug: true, enrolledAt: true, completedAt: true },
          orderBy: { enrolledAt: "asc" },
        }),
        prisma.lessonCompletion.findMany({
          where: { userId },
          select: {
            courseSlug: true,
            lessonId: true,
            xpAwarded: true,
            completedAt: true,
          },
          orderBy: { completedAt: "asc" },
        }),
        prisma.userXP.findUnique({
          where: { userId },
          select: {
            totalXP: true,
            weeklyXP: true,
            monthlyXP: true,
            lastWeeklyReset: true,
            lastMonthlyReset: true,
          },
        }),
        prisma.userStreak.findUnique({
          where: { userId },
          select: {
            currentStreak: true,
            longestStreak: true,
            lastActivityDate: true,
            streakHistory: true,
          },
        }),
        prisma.userAchievementNew.findMany({
          where: { userId },
          select: { achievementId: true, unlockedAt: true },
          orderBy: { unlockedAt: "asc" },
        }),
      ]);

    if (!user) {
      throw Errors.notFound("User not found");
    }

    return NextResponse.json(
      {
        exportedAt: new Date().toISOString(),
        user,
        wallets,
        providers: accounts,
        progress: {
          enrollments,
          lessonCompletions: completions,
        },
        xp: userXP,
        streak,
        achievements,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(rate.reset),
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
