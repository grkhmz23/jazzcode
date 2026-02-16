import { NextRequest, NextResponse } from "next/server";
import { onChainReadService } from "@/lib/services/implementations/onchain-read";
import { deriveLevel } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet || wallet.length < 32 || wallet.length > 44) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const xp = await onChainReadService.getXPBalance(wallet);
    const level = deriveLevel(xp);

    return NextResponse.json({ wallet, xp, level });
  } catch (error) {
    console.error("XP read error:", error);
    return NextResponse.json({ wallet: null, xp: 0, level: 0, error: "Failed to read XP balance" });
  }
}
