import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp } from "@/lib/api/middleware";
import { enforceRunnerRateLimit, importPublicGithubRepository } from "@/lib/runner";
import { resolveRequestActorId } from "@/lib/security/request-identity";
import { redactRunnerLogs } from "@/lib/runner/redaction";

const importSchema = z.object({
  repoUrl: z.string().url(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const actorId = await resolveRequestActorId(request);
    const rate = await enforceRunnerRateLimit(`runner-import:${actorId}:${ip}`);

    const body = importSchema.parse((await request.json()) as unknown);
    const files = await importPublicGithubRepository(body.repoUrl);

    return NextResponse.json(
      {
        files,
        fileCount: Object.keys(files).length,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
        },
      }
    );
  } catch (error) {
    const message = redactRunnerLogs(error instanceof Error ? error.message : "Import failed");
    const status = /rate limit/i.test(message)
      ? 429
      : /invalid|only github\.com|failed to fetch/i.test(message.toLowerCase())
      ? 400
      : 500;
    const retryAfterMatch = /retry after (\d+)s/i.exec(message);
    const headers = retryAfterMatch ? { "Retry-After": retryAfterMatch[1] } : undefined;
    return NextResponse.json({ error: message }, { status, headers });
  }
}
