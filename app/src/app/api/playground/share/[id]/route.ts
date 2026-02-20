/**
 * GET /api/playground/share/[id]
 * Retrieve a playground share by ID
 */

import { NextResponse } from "next/server";
import { retrieveBundle } from "@/lib/playground/share-store";
import { Errors, handleApiError } from "@/lib/api/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || id.length > 100) {
      throw Errors.badRequest("Invalid share ID");
    }

    // Sanitize ID
    const sanitizedId = id.replace(/[^a-zA-Z0-9_\-]/g, "");
    if (sanitizedId !== id) {
      throw Errors.badRequest("Invalid share ID format");
    }

    const result = await retrieveBundle(sanitizedId);

    if (!result) {
      throw Errors.notFound("Share not found or expired");
    }

    return NextResponse.json({
      bundle: result.bundle,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Prevent caching
export const dynamic = "force-dynamic";
