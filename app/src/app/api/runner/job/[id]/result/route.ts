import { NextRequest, NextResponse } from "next/server";
import { extractOutputArchiveBase64, getRemoteJobResult } from "@/lib/runner/remote";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const runnerUrl = process.env.RUNNER_URL;
    if (!runnerUrl) {
      return NextResponse.json({ error: "Remote runner is not configured" }, { status: 503 });
    }

    const { id } = await params;
    const payload = await getRemoteJobResult(runnerUrl, id);

    if (!payload.result) {
      return NextResponse.json({ status: payload.status, jobId: id }, { status: 202 });
    }

    const outputFiles = payload.result.outputFilesTarGzBase64
      ? await extractOutputArchiveBase64(payload.result.outputFilesTarGzBase64)
      : undefined;

    return NextResponse.json({
      status: payload.status,
      jobId: id,
      result: {
        ...payload.result,
        outputFiles,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch runner result";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
