import { NextRequest, NextResponse } from "next/server";
import { extractOutputArchiveBase64, getRemoteJobResult } from "@/lib/runner/remote";
import { resolveRequestActorId } from "@/lib/security/request-identity";
import { verifyRunnerJobAccessToken } from "@/lib/runner/job-token";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/middleware";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const runnerUrl = process.env.RUNNER_URL;
    if (!runnerUrl) {
      return NextResponse.json({ error: "Remote runner is not configured" }, { status: 503 });
    }

    const ip = getClientIp(request);
    const actorId = await resolveRequestActorId(request);
    const rate = await checkRateLimit(`runner-result:${actorId}:${ip}`, {
      limit: 120,
      windowSeconds: 60,
    });
    if (!rate.success) {
      const retryAfter = Math.max(1, rate.reset - Math.floor(Date.now() / 1000));
      return NextResponse.json(
        { error: "Too many runner result requests. Please try again shortly." },
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

    const { id } = await params;
    const verification = verifyRunnerJobAccessToken(id, actorId);
    if (!verification.valid || !verification.jobId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await getRemoteJobResult(runnerUrl, verification.jobId);

    if (!payload.result) {
      return NextResponse.json(
        { status: payload.status, jobId: id },
        {
          status: 202,
          headers: {
            "X-RateLimit-Limit": String(rate.limit),
            "X-RateLimit-Remaining": String(rate.remaining),
            "X-RateLimit-Reset": String(rate.reset),
          },
        }
      );
    }

    const outputFiles = payload.result.outputFilesTarGzBase64
      ? await extractOutputArchiveBase64(payload.result.outputFilesTarGzBase64)
      : undefined;

    return NextResponse.json(
      {
        status: payload.status,
        jobId: id,
        result: {
          ...payload.result,
          outputFiles,
        },
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
    const message = error instanceof Error ? error.message : "Failed to fetch runner result";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
