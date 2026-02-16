import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { wallet?: string };
    const { wallet } = body;

    if (!wallet || typeof wallet !== "string" || wallet.length < 32 || wallet.length > 44) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const nonce = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await prisma.walletNonce.create({
      data: { address: wallet, nonce, expiresAt },
    });

    // Clean up expired nonces
    await prisma.walletNonce.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return NextResponse.json({
      nonce,
      message: `Sign this message to verify your wallet ownership.\n\nNonce: ${nonce}\nApp: Superteam Academy`,
    });
  } catch (error) {
    console.error("Nonce generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
