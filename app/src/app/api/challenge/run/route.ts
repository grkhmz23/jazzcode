import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/middleware";
import { runChallengeInSandbox } from "@/lib/challenge-runner/sandbox";

const requestSchema = z.object({
  code: z.string().min(1).max(100_000),
  timeoutMs: z.number().int().min(50).max(5_000).default(2_000),
  testCases: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        input: z.string().max(20_000),
        expectedOutput: z.string().max(20_000),
      })
    )
    .min(1)
    .max(50),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const limit = await checkRateLimit(`challenge-run:${ip}`, { limit: 30, windowSeconds: 60 });
    if (!limit.success) {
      const retryAfter = Math.max(1, limit.reset - Math.floor(Date.now() / 1000));
      return NextResponse.json(
        { error: "Too many challenge run requests. Try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit.limit),
            "X-RateLimit-Remaining": String(limit.remaining),
            "X-RateLimit-Reset": String(limit.reset),
          },
        }
      );
    }

    const payload = requestSchema.parse((await request.json()) as unknown);
    const result = await runChallengeInSandbox(payload.code, payload.testCases, payload.timeoutMs);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit.limit),
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-RateLimit-Reset": String(limit.reset),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Challenge run failed";
    const isValidationError = /invalid|expected|required|too small|too big/i.test(message);
    return NextResponse.json({ error: message }, { status: isValidationError ? 400 : 500 });
  }
}
