import { NextRequest, NextResponse } from "next/server";
import { credentialsService } from "@/lib/services/registry";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet || wallet.length < 32 || wallet.length > 44) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const credentials = await credentialsService.getCredentials(wallet);
    return NextResponse.json({ wallet, credentials });
  } catch (error) {
    console.error("Credentials read error:", error);
    return NextResponse.json({ wallet: null, credentials: [], error: "Failed to read credentials" });
  }
}
