import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/client";
import { logger } from "@/lib/logging/logger";
import { generateRequestId } from "@/lib/logging/logger";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

/**
 * Database health check endpoint
 * Returns 200 if database is healthy, 503 otherwise
 * 
 * This endpoint is used by:
 * - Load balancers (e.g., AWS ALB, Railway)
 * - Monitoring services (e.g., UptimeRobot, Pingdom)
 * - Kubernetes liveness/readiness probes
 */
export async function GET() {
  const requestId = generateRequestId();
  
  logger.debug("Health check requested", { requestId });
  
  const health = await checkDatabaseHealth();
  
  const response = {
    status: health.healthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    requestId,
    checks: {
      database: {
        status: health.healthy ? "up" : "down",
        latencyMs: health.latencyMs,
        ...(health.error && { error: health.error }),
      },
    },
  };
  
  const statusCode = health.healthy ? 200 : 503;
  
  if (!health.healthy) {
    logger.error("Health check failed", { requestId, error: health.error });
  }
  
  return NextResponse.json(response, { 
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Request-Id": requestId,
    },
  });
}
