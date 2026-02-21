import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const runnerUrl = process.env.RUNNER_URL;
  if (!runnerUrl) {
    return NextResponse.json({ ok: true, configured: false, mode: "local" }, { status: 200 });
  }

  try {
    const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/health`, {
      method: "GET",
      cache: "no-store",
    });

    await response.text();
    return NextResponse.json(
      {
        ok: response.ok,
        configured: true,
        mode: "remote",
        upstreamStatus: response.status,
      },
      { status: response.ok ? 200 : 503 }
    );
  } catch {
    return NextResponse.json({ ok: false, configured: true, error: "Runner health check failed" }, { status: 503 });
  }
}
