import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { importPublicGithubRepository } from "@/lib/runner/github-import";

const importSchema = z.object({
  repoUrl: z.string().url(),
  branch: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = importSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request: repoUrl must be a valid URL" },
        { status: 400 }
      );
    }

    const { repoUrl, branch } = parsed.data;

    // Validate it's a GitHub URL
    if (!repoUrl.includes("github.com")) {
      return NextResponse.json(
        { error: "Only github.com URLs are supported" },
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

    return NextResponse.json({
      success: true,
      files: fileArray,
      fileCount: fileArray.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    
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
