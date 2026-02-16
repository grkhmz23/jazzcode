import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withApiMiddleware } from "@/lib/api/middleware";
import { getCredentials, isValidWalletAddress } from "@/lib/services/onchain";
import { logger, generateRequestId } from "@/lib/logging/logger";

export const runtime = "nodejs";

// Revalidate cache every 5 minutes
export const revalidate = 300;

interface CredentialsResponse {
  credentials: unknown[];
  heliusAvailable: boolean;
}

export const GET = withApiMiddleware(
  async (request: NextRequest) => {
    const url = new URL(request.url);
    const wallet = url.searchParams.get("wallet");
    const requestId = generateRequestId();

    // Validate wallet address
    if (!wallet) {
      logger.warn("Missing wallet parameter", { requestId });
      return NextResponse.json(
        {
          data: {
            credentials: [],
            heliusAvailable: !!process.env.HELIUS_API_KEY,
            error: "Missing wallet parameter",
            code: "INVALID_WALLET",
          },
          requestId,
        },
        { status: 400 }
      );
    }

    if (!isValidWalletAddress(wallet)) {
      logger.warn("Invalid wallet address format", { wallet, requestId });
      return NextResponse.json(
        {
          data: {
            credentials: [],
            heliusAvailable: !!process.env.HELIUS_API_KEY,
            error: "Invalid wallet address format",
            code: "INVALID_WALLET",
          },
          requestId,
        },
        { status: 400 }
      );
    }

    logger.info("Fetching on-chain credentials", { wallet, requestId });

    const heliusAvailable = !!process.env.HELIUS_API_KEY;

    try {
      const credentials = await getCredentials(wallet);

      const response: CredentialsResponse = {
        credentials,
        heliusAvailable,
      };

      return NextResponse.json(
        { data: response, requestId },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          },
        }
      );
    } catch (error) {
      logger.error("Failed to fetch credentials", {
        wallet,
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });

      return NextResponse.json(
        {
          data: {
            credentials: [],
            heliusAvailable,
            error: "Failed to fetch credentials",
            code: "RPC_ERROR",
          },
          requestId,
        },
        { status: 503 }
      );
    }
  },
  { rateLimit: true }
);
