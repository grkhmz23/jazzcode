import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { Schemas, validate } from "@/lib/api/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/middleware";
import { logger } from "@/lib/logging/logger";

export const runtime = "nodejs";

const BodySchema = z.object({
  address: Schemas.walletAddress,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`auth-nonce:${ip}`, {
      limit: 10,
      windowSeconds: 60,
    });
    if (!rate.success) {
      const retryAfter = Math.max(1, rate.reset - Math.floor(Date.now() / 1000));
      return NextResponse.json(
        { error: "Too many nonce requests. Please try again shortly." },
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

    const body = await request.json();
    const { address } = validate(BodySchema, body);

    const nonce = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.walletNonce.create({
      data: {
        address,
        nonce,
        expiresAt,
      },
    });

    prisma.walletNonce
      .deleteMany({ where: { expiresAt: { lt: new Date() } } })
      .catch((error: Error) => {
        logger.warn("Failed to cleanup expired wallet nonces", {
          error: error.message,
        });
      });

    return NextResponse.json(
      { nonce },
      {
        headers: {
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
          "X-RateLimit-Reset": String(rate.reset),
        },
      }
    );
  } catch (error) {
    logger.error("Failed to generate wallet nonce", { error });
    return NextResponse.json(
      { error: "Unable to generate wallet nonce" },
      { status: 400 }
    );
  }
}
