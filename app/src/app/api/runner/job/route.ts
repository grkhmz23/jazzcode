import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/api/middleware";
import { enforceRunnerRateLimit, runRunnerJob } from "@/lib/runner";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    await enforceRunnerRateLimit(`runner-job:${ip}`);

    const body = (await request.json()) as unknown;
    const result = await runRunnerJob(body);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Runner job failed";
    const status = /rate limit/i.test(message)
      ? 429
      : /validation|policy|invalid/i.test(message)
      ? 400
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
