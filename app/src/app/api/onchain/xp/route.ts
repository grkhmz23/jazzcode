import { z } from "zod";
import { createApiHandler, createApiResponse } from "@/lib/api/middleware";
import { validateQuery, Schemas } from "@/lib/api/validation";
import { onChainService } from "@/lib/services/registry";
import { deriveLevel } from "@/types";
import { logger } from "@/lib/logging/logger";
import { OnChainReadError } from "@/types";


export const runtime = "nodejs";

const QuerySchema = z.object({
  wallet: Schemas.walletAddress,
});

export const GET = createApiHandler(
  async (request) => {
    const { wallet } = validateQuery(QuerySchema, new URL(request.url).searchParams);

    logger.info("Fetching XP balance", { wallet });

    try {
      const xp = await onChainService.getXPBalance(wallet);
      const level = deriveLevel(xp);

      return createApiResponse({ wallet, xp, level });
    } catch (error) {
      // Handle expected on-chain read errors gracefully
      if (error instanceof OnChainReadError) {
        logger.warn("On-chain read not implemented", { wallet, message: error.message });
        // Return 0 XP as fallback (service not yet implemented)
        return createApiResponse({ wallet, xp: 0, level: 0 });
      }
      throw error;
    }
  },
  { rateLimit: true }
);
