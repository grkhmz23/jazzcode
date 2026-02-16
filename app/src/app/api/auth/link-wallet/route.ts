import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { verifyWalletSignature } from "@/lib/auth/wallet-verify";
import { logger } from "@/lib/logging/logger";

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

    // Verify the message format matches expected pattern
    const expectedMessage = `Link wallet to Superteam Academy: ${session.user.id}`;
    if (message !== expectedMessage) {
      return NextResponse.json(
        { error: "Invalid message format" },
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

    // Check if wallet is already linked to a DIFFERENT user
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "This wallet is already linked to another account" },
        { status: 409 }
      );
    }

    // Update the user's wallet address
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress },
    });

    logger.info("Wallet linked to user", {
      userId: session.user.id,
      walletAddress,
    });

    return NextResponse.json({
      success: true,
      walletAddress: updatedUser.walletAddress,
    });
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

    // Remove the wallet address from the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress: null },
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
