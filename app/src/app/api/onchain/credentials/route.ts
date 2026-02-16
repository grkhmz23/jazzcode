import { z } from "zod";
import { createApiHandler, createApiResponse } from "@/lib/api/middleware";
import { validateQuery, Schemas } from "@/lib/api/validation";
import { credentialsService } from "@/lib/services/registry";
import { logger } from "@/lib/logging/logger";


export const runtime = "nodejs";

const QuerySchema = z.object({
  wallet: Schemas.walletAddress,
});

export const GET = createApiHandler(
  async (request) => {
    const { wallet } = validateQuery(QuerySchema, new URL(request.url).searchParams);

    logger.info("Fetching credentials", { wallet });

    const credentials = await credentialsService.getCredentials(wallet);
    
    return createApiResponse({ wallet, credentials });
  },
  { rateLimit: true }
);
