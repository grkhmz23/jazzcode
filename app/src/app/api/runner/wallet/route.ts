import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/api/middleware";
import { createEphemeralBurnerWallet, enforceRunnerRateLimit } from "@/lib/runner";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    await enforceRunnerRateLimit(`runner-wallet:${ip}`);

    const wallet = createEphemeralBurnerWallet();
    return NextResponse.json({
      publicKey: wallet.publicKey,
      keypairPath: wallet.keypairPath,
      // secrets never returned by design
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Wallet generation failed";
    const status = /rate limit/i.test(message) ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
