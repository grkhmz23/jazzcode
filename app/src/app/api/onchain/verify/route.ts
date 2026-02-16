import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withApiMiddleware } from "@/lib/api/middleware";
import { verifyCredentialOwnership, isValidWalletAddress } from "@/lib/services/onchain";
import { logger, generateRequestId } from "@/lib/logging/logger";

export const runtime = "nodejs";

interface VerifyResponse {
  verified: boolean;
  currentOwner: string | null;
  heliusAvailable: boolean;
}

export const GET = withApiMiddleware(
  async (request: NextRequest) => {
    const url = new URL(request.url);
    const assetId = url.searchParams.get("assetId");
    const owner = url.searchParams.get("owner");
    const requestId = generateRequestId();

    const heliusAvailable = !!process.env.HELIUS_API_KEY;

    // Validate required parameters
    if (!assetId) {
      logger.warn("Missing assetId parameter", { requestId });
      return NextResponse.json(
        {
          data: {
            verified: false,
            currentOwner: null,
            heliusAvailable,
            error: "Missing assetId parameter",
            code: "INVALID_PARAMS",
          },
          requestId,
        },
        { status: 400 }
      );
    }

    if (!owner) {
      logger.warn("Missing owner parameter", { requestId });
      return NextResponse.json(
        {
          data: {
            verified: false,
            currentOwner: null,
            heliusAvailable,
            error: "Missing owner parameter",
            code: "INVALID_PARAMS",
          },
          requestId,
        },
        { status: 400 }
      );
    }

    if (!isValidWalletAddress(owner)) {
      logger.warn("Invalid owner address format", { owner, requestId });
      return NextResponse.json(
        {
          data: {
            verified: false,
            currentOwner: null,
            heliusAvailable,
            error: "Invalid owner address format",
            code: "INVALID_WALLET",
          },
          requestId,
        },
        { status: 400 }
      );
    }

    if (!isValidWalletAddress(assetId)) {
      logger.warn("Invalid assetId format", { assetId, requestId });
      return NextResponse.json(
        {
          data: {
            verified: false,
            currentOwner: null,
            heliusAvailable,
            error: "Invalid assetId format",
            code: "INVALID_ASSET",
          },
          requestId,
        },
        { status: 400 }
      );
    }

    logger.info("Verifying credential ownership", { assetId, owner, requestId });

    try {
      const result = await verifyCredentialOwnership(assetId, owner);

      const response: VerifyResponse = {
        verified: result.verified,
        currentOwner: result.currentOwner,
        heliusAvailable,
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
      logger.error("Failed to verify credential", {
        assetId,
        owner,
        requestId,
        error: error instanceof Error ? error.message : String(error),
      });

      return NextResponse.json(
        {
          data: {
            verified: false,
            currentOwner: null,
            heliusAvailable,
            error: "Failed to verify credential",
            code: "VERIFICATION_ERROR",
          },
          requestId,
        },
        { status: 503 }
      );
    }
  },
  { rateLimit: true }
);
