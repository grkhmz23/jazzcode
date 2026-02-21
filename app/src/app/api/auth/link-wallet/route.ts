import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { verifyWalletSignature } from "@/lib/auth/wallet-verify";
import { logger } from "@/lib/logging/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/middleware";

interface LinkWalletRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

/**
 * POST /api/auth/link-wallet
 * Link a wallet address to the authenticated user's account
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`auth-link-wallet:${ip}`, {
      limit: 20,
      windowSeconds: 60,
    });
    if (!rate.success) {
      const retryAfter = Math.max(1, rate.reset - Math.floor(Date.now() / 1000));
      return NextResponse.json(
        { error: "Too many wallet link attempts. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(rate.limit),
            "X-RateLimit-Remaining": String(rate.remaining),
            "X-RateLimit-Reset": String(rate.reset),
          },
        }
      );
    }

    // Verify the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as LinkWalletRequest;
    const { walletAddress, signature, message } = body;

    // Validate request body
    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required fields: walletAddress, signature, message" },
        { status: 400 }
      );
    }

    // Verify the message format and extract one-time nonce
    const messagePrefix = `Link wallet to Superteam Academy: ${session.user.id}:`;
    if (!message.startsWith(messagePrefix)) {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }
    const nonce = message.slice(messagePrefix.length).trim();
    if (!nonce) {
      return NextResponse.json(
        { error: "Missing nonce in signed message" },
        { status: 400 }
      );
    }

    const nonceRecord = await prisma.walletNonce.findFirst({
      where: {
        address: walletAddress,
        nonce,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: "desc" },
    });

    if (!nonceRecord) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 400 }
      );
    }

    // Verify the signature cryptographically
    const isValidSignature = verifyWalletSignature(
      walletAddress,
      signature,
      message
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid signature - Unable to verify wallet ownership" },
        { status: 400 }
      );
    }

    // Check if wallet is already linked to a different user
    const [existingUserByWalletField, existingWalletLink] = await Promise.all([
      prisma.user.findUnique({
        where: { walletAddress },
        select: { id: true },
      }),
      prisma.userWallet.findUnique({
        where: { address: walletAddress },
        select: { userId: true },
      }),
    ]);

    const walletOwnerId =
      existingUserByWalletField?.id ?? existingWalletLink?.userId ?? null;

    if (walletOwnerId && walletOwnerId !== session.user.id) {
      return NextResponse.json(
        { error: "This wallet is already linked to another account" },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const markUsed = await tx.walletNonce.updateMany({
        where: {
          id: nonceRecord.id,
          used: false,
          expiresAt: { gt: new Date() },
        },
        data: { used: true },
      });

      if (markUsed.count !== 1) {
        throw new Error("Nonce is no longer valid");
      }

      await tx.user.update({
        where: { id: session.user.id },
        data: { walletAddress },
      });

      await tx.userWallet.updateMany({
        where: { userId: session.user.id },
        data: { isPrimary: false },
      });

      await tx.userWallet.upsert({
        where: { address: walletAddress },
        create: {
          address: walletAddress,
          userId: session.user.id,
          isPrimary: true,
        },
        update: {
          userId: session.user.id,
          isPrimary: true,
        },
      });
    });

    logger.info("Wallet linked to user", {
      userId: session.user.id,
      walletAddress,
    });

    return NextResponse.json(
      {
        success: true,
        walletAddress,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(rate.reset),
        },
      }
    );
  } catch (error) {
    logger.error("Error linking wallet", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/link-wallet
 * Unlink the wallet from the authenticated user's account
 */
export async function DELETE(): Promise<Response> {
  try {
    // Verify the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      );
    }

    const linkedOAuthCount = await prisma.account.count({
      where: { userId: session.user.id },
    });

    if (linkedOAuthCount === 0) {
      return NextResponse.json(
        {
          error:
            "Cannot unlink wallet: link GitHub first so you still have a sign-in method.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { walletAddress: null },
      });

      await tx.userWallet.deleteMany({
        where: { userId: session.user.id },
      });
    });

    logger.info("Wallet unlinked from user", {
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    logger.error("Error unlinking wallet", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
