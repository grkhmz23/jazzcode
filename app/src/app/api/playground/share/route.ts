/**
 * POST /api/playground/share
 * Create a new playground share
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { validateBundle } from "@/lib/component-hub/schema";
import { storeBundle } from "@/lib/playground/share-store";

const requestSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  files: z.array(
    z.object({
      path: z.string().min(1),
      content: z.string(),
      language: z.enum(["typescript", "javascript", "css", "json"]),
    })
  ),
  dependencies: z
    .array(
      z.object({
        name: z.string(),
        version: z.string(),
        isDev: z.boolean().optional(),
      })
    )
    .default([]),
  props: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
        defaultValue: z.unknown().optional(),
        description: z.string(),
      })
    )
    .default([]),
  permissions: z
    .array(
      z.object({
        type: z.enum(["wallet", "rpc", "devnet"]),
        required: z.boolean(),
        description: z.string(),
      })
    )
    .default([]),
  defaultProps: z.record(z.unknown()).default({}),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request shape
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parseResult.error.errors.map(
            (e) => `${e.path.join(".")}: ${e.message}`
          ),
        },
        { status: 400 }
      );
    }

    // Validate bundle (includes path sanitization and size checks)
    const bundleResult = validateBundle(parseResult.data);
    if (!bundleResult.success) {
      return NextResponse.json(
        {
          error: "Invalid bundle",
          details: bundleResult.errors,
        },
        { status: 400 }
      );
    }

    // Store the bundle
    const { id, expiresAt } = await storeBundle(bundleResult.data);

    return NextResponse.json({
      shareId: id,
      expiresAt: expiresAt.toISOString(),
      url: `/playground?share=${id}`,
    });
  } catch (error) {
    console.error("Failed to create share:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Prevent caching
export const dynamic = "force-dynamic";
