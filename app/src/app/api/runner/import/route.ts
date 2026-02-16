import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp } from "@/lib/api/middleware";
import { enforceRunnerRateLimit, importPublicGithubRepository } from "@/lib/runner";

const importSchema = z.object({
  repoUrl: z.string().url(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    await enforceRunnerRateLimit(`runner-import:${ip}`);

    const body = importSchema.parse((await request.json()) as unknown);
    const files = await importPublicGithubRepository(body.repoUrl);

    return NextResponse.json({
      files,
      fileCount: Object.keys(files).length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    const status = /rate limit/i.test(message)
      ? 429
      : /invalid|only github\.com|failed to fetch/i.test(message.toLowerCase())
      ? 400
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
