import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params): Promise<Response> {
  const runnerUrl = process.env.RUNNER_URL;
  if (!runnerUrl) {
    return NextResponse.json({ error: "Remote runner is not configured" }, { status: 503 });
  }

  const { id } = await params;
  const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/v1/jobs/${id}/stream`, {
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
    },
  });
}
