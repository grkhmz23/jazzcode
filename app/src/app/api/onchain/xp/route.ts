import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withApiMiddleware } from "@/lib/api/middleware";
import { getOnChainXP, isValidWalletAddress } from "@/lib/services/onchain";
import { logger, generateRequestId } from "@/lib/logging/logger";

export const runtime = "nodejs";

// Revalidate cache every 60 seconds
export const revalidate = 60;

// Response type that encompasses all possible responses
interface XPResponse {
  onChainAvailable?: boolean;
  balance?: number;
  mintAddress?: string;
  tokenAccount?: string | null;
  message?: string;
  error?: string;
  code?: string;
}

export const GET = withApiMiddleware(
  async (request: NextRequest) => {
    const url = new URL(request.url);
    const wallet = url.searchParams.get("wallet");
    const requestId = generateRequestId();

    // Validate wallet address format
    if (!wallet) {
      logger.warn("Missing wallet parameter", { requestId });
      const response: XPResponse = {
        error: "Missing wallet parameter",
        code: "INVALID_WALLET",
      };
      return NextResponse.json({ data: response, requestId }, { status: 400 });
    }

    if (!isValidWalletAddress(wallet)) {
      logger.warn("Invalid wallet address format", { wallet, requestId });
      const response: XPResponse = {
        error: "Invalid wallet address format",
        code: "INVALID_WALLET",
      };
      return NextResponse.json({ data: response, requestId }, { status: 400 });
    }

    logger.info("Fetching on-chain XP balance", { wallet, requestId });

    try {
      const result = await getOnChainXP(wallet);

      if (result === null) {
        // XP_MINT not set - program not deployed yet
        const response: XPResponse = {
          onChainAvailable: false,
          message: "On-chain XP program not deployed yet. Showing local XP.",
        };
        return NextResponse.json(
          { data: response, requestId },
          {
            status: 200,
            headers: {
              "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
            },
          }
        );
      }

      const response: XPResponse = {
        onChainAvailable: true,
        balance: result.balance,
        mintAddress: result.mintAddress,
        tokenAccount: result.tokenAccount,
      };

      return NextResponse.json(
        { data: response, requestId },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        }
      );
    } catch (error) {
      logger.error("Failed to fetch on-chain XP", {
        wallet,
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });

      const response: XPResponse = {
        error: "Failed to fetch on-chain XP",
        code: "RPC_ERROR",
      };

      return NextResponse.json(
        { data: response, requestId },
        { status: 503 }
      );
    }
  },
  { rateLimit: true }
);
