import { NextRequest, NextResponse } from "next/server";
import { resolveRequestActorId } from "@/lib/security/request-identity";
import { verifyRunnerJobAccessToken } from "@/lib/runner/job-token";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/middleware";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const runnerUrl = process.env.RUNNER_URL;
  if (!runnerUrl) {
    return NextResponse.json({ error: "Remote runner is not configured" }, { status: 503 });
  }

  const ip = getClientIp(request);
  const actorId = await resolveRequestActorId(request);
  const rate = await checkRateLimit(`runner-stream:${actorId}:${ip}`, {
    limit: 60,
    windowSeconds: 60,
  });
  if (!rate.success) {
    const retryAfter = Math.max(1, rate.reset - Math.floor(Date.now() / 1000));
    return NextResponse.json(
      { error: "Too many stream connections. Please try again shortly." },
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

  const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/v1/jobs/${verification.jobId}/stream`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok || !response.body) {
    const text = await response.text();
    return NextResponse.json({ error: text || "Failed to connect to runner stream" }, { status: response.status || 502 });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "X-RateLimit-Limit": String(rate.limit),
      "X-RateLimit-Remaining": String(rate.remaining),
      "X-RateLimit-Reset": String(rate.reset),
    },
  });
}
