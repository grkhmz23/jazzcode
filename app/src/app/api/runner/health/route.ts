import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const runnerUrl = process.env.RUNNER_URL;
  if (!runnerUrl) {
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  try {
    const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/health`, {
      method: "GET",
      cache: "no-store",
    });

    const body = (await response.json()) as unknown;
    return NextResponse.json(
      {
        ok: response.ok,
        configured: true,
        runner: body,
      },
      { status: response.ok ? 200 : 503 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Runner health check failed";
    return NextResponse.json({ ok: false, configured: true, error: message }, { status: 503 });
  }
}
