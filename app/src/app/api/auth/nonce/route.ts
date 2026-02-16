import { z } from "zod";
import crypto from "crypto";
import { createApiHandler, createApiResponse } from "@/lib/api/middleware";
import { validate } from "@/lib/api/validation";
import { Schemas } from "@/lib/api/validation";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logging/logger";


export const runtime = "nodejs";

const BodySchema = z.object({
  wallet: Schemas.walletAddress,
});

export const POST = createApiHandler(
  async (request) => {
    const body = await request.json();
    const { wallet } = validate(BodySchema, body);

    logger.info("Generating nonce", { wallet });

    const nonce = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await prisma.walletNonce.create({
      data: { address: wallet, nonce, expiresAt },
    });

    // Clean up expired nonces (fire and forget)
    prisma.walletNonce.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    }).catch((err: Error) => {
      logger.warn("Failed to clean up expired nonces", { error: err.message });
    });

    return createApiResponse({
      nonce,
      message: `Sign this message to verify your wallet ownership.

Nonce: ${nonce}
App: Superteam Academy`,
    });
  },
  { rateLimit: true }
);
