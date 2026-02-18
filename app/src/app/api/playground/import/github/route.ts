import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { importPublicGithubRepository } from "@/lib/runner/github-import";
import { checkRateLimit } from "@/lib/rate-limit";
import { resolveRequestActorId } from "@/lib/security/request-identity";
import { redactRunnerLogs } from "@/lib/runner/redaction";

const importSchema = z.object({
  repoUrl: z.string().min(1),
  branch: z.string().optional(),
});

/**
 * Normalize owner/repo shorthand to a full GitHub URL on the server side.
 */
function normalizeRepoUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(trimmed)) {
    return `https://github.com/${trimmed}`;
  }
  return trimmed;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const actorId = await resolveRequestActorId(request);
    const limit = await checkRateLimit(`playground-github-import:${actorId}`, {
      limit: 12,
      windowSeconds: 60,
    });
    if (!limit.success) {
      const retryAfter = Math.max(1, limit.reset - Math.floor(Date.now() / 1000));
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Try again shortly." },
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

    const body = await request.json();
    const parsed = importSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request: provide a GitHub URL or owner/repo shorthand" },
        { status: 400 }
      );
    }

    const repoUrl = normalizeRepoUrl(parsed.data.repoUrl);
    const branch = parsed.data.branch;

    // Validate it's an HTTPS github.com URL without embedded credentials.
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(repoUrl);
    } catch {
      return NextResponse.json(
        { error: "Only github.com URLs or owner/repo shorthand are supported" },
        { status: 400 }
      );
    }
    if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "github.com" || parsedUrl.username || parsedUrl.password) {
      return NextResponse.json(
        { error: "Only github.com URLs or owner/repo shorthand are supported" },
        { status: 400 }
      );
    }

    const files = await importPublicGithubRepository(
      branch ? `${repoUrl}/tree/${branch}` : repoUrl
    );

    // Convert Record<string, string> to array format for easier client consumption
    const fileArray = Object.entries(files).map(([path, content]) => ({
      path,
      content,
    }));

    return NextResponse.json(
      {
        success: true,
        files: fileArray,
        fileCount: fileArray.length,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.reset),
        },
      }
    );
  } catch (error) {
    const message = redactRunnerLogs(error instanceof Error ? error.message : "Import failed");
    
    // Determine appropriate status code
    let status = 500;
    if (/rate limit/i.test(message)) {
      status = 429;
    } else if (/only github\.com|invalid repository|not found|failed to fetch/i.test(message)) {
      status = 400;
    } else if (/exceeded size limits/i.test(message)) {
      status = 413;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
