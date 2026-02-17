/**
 * GET /api/playground/share/[id]
 * Retrieve a playground share by ID
 */

import { NextResponse } from "next/server";
import { retrieveBundle } from "@/lib/playground/share-store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || id.length > 100) {
      return NextResponse.json(
        { error: "Invalid share ID" },
        { status: 400 }
      );
    }

    // Sanitize ID
    const sanitizedId = id.replace(/[^a-zA-Z0-9_\-]/g, "");
    if (sanitizedId !== id) {
      return NextResponse.json(
        { error: "Invalid share ID format" },
        { status: 400 }
      );
    }

    const result = await retrieveBundle(sanitizedId);

    if (!result) {
      return NextResponse.json(
        { error: "Share not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bundle: result.bundle,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to retrieve share:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Prevent caching
export const dynamic = "force-dynamic";
