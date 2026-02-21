import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/api/middleware";
import { createEphemeralBurnerWallet, enforceRunnerRateLimit } from "@/lib/runner";
import { resolveRequestActorId } from "@/lib/security/request-identity";
import { redactRunnerLogs } from "@/lib/runner/redaction";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const actorId = await resolveRequestActorId(request);
    const rate = await enforceRunnerRateLimit(`runner-wallet:${actorId}:${ip}`);

    const wallet = createEphemeralBurnerWallet();
    return NextResponse.json(
      {
        publicKey: wallet.publicKey,
        // secrets never returned by design
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
    const message = redactRunnerLogs(error instanceof Error ? error.message : "Wallet generation failed");
    const status = /rate limit/i.test(message) ? 429 : 500;
    const retryAfterMatch = /retry after (\d+)s/i.exec(message);
    const headers = retryAfterMatch ? { "Retry-After": retryAfterMatch[1] } : undefined;
    return NextResponse.json({ error: message }, { status, headers });
  }
}
