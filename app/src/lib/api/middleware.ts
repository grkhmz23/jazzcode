import { NextRequest, NextResponse } from "next/server";
import { generateRequestId, runWithContext, RequestContext } from "@/lib/logging/logger";
import { rateLimitByIp, isRateLimitAvailable } from "@/lib/rate-limit";
import { errorResponse, Errors, type ApiErrorResponse } from "./errors";

/**
 * Extract client IP from request
 */
export function getClientIp(request: NextRequest): string {
  // Try X-Forwarded-For first (when behind proxy/CDN)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Take the first IP in the chain
    return forwarded.split(",")[0].trim();
  }
  
  // Fall back to X-Real-Ip
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Last resort - use a placeholder
  // In production, you should always have a proxy that sets X-Forwarded-For
  return "unknown";
}

/**
 * Create request context from NextRequest
 */
export function createRequestContext(request: NextRequest): RequestContext {
  // Get or generate request ID
  const requestId = request.headers.get("x-request-id") ?? generateRequestId();
  
  return {
    requestId,
    path: request.nextUrl.pathname,
    method: request.method,
  };
}

/**
 * API route handler wrapper with:
 * - Request ID generation/tracking
 * - Rate limiting
 * - Error handling
 * - Response header injection
 */
export type ApiHandler<T = unknown> = (
  request: NextRequest,
  context: RequestContext
) => Promise<NextResponse<T>>;

export function withApiMiddleware<T>(
  handler: ApiHandler<T>,
  options: {
    rateLimit?: boolean;
    requireAuth?: boolean;
  } = {}
): (request: NextRequest) => Promise<NextResponse<T | ApiErrorResponse>> {
  return async (request: NextRequest) => {
    const requestContext = createRequestContext(request);
    
    return runWithContext(requestContext, async () => {
      try {
        // Rate limiting check
        if (options.rateLimit !== false && isRateLimitAvailable()) {
          const ip = getClientIp(request);
          const rateLimitResult = await rateLimitByIp(ip, request.nextUrl.pathname);
          
          if (!rateLimitResult.success) {
            return errorResponse(Errors.rateLimited(), 429);
          }
          
          // Add rate limit headers
          const response = await handler(request, requestContext);
          response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
          response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
          response.headers.set("X-RateLimit-Reset", String(rateLimitResult.reset));
          return response;
        }
        
        return await handler(request, requestContext);
      } catch (error) {
        // Convert to API error response
        if (error instanceof Error && "statusCode" in error) {
          return errorResponse(error as Error);
        }
        return errorResponse(Errors.internal());
      }
    });
  };
}

/**
 * Higher-order function for API route handlers
 * This wraps the handler with all middleware
 */
export function createApiHandler<T>(
  handler: ApiHandler<T>,
  options?: {
    rateLimit?: boolean;
    requireAuth?: boolean;
  }
): (request: NextRequest) => Promise<NextResponse<T | ApiErrorResponse>> {
  return withApiMiddleware(handler, options);
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // These are baseline headers - more comprehensive CSP is in next.config.mjs
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  return response;
}

/**
 * Create a standard API response with security headers
 */
export function createApiResponse<T>(
  data: T,
  statusCode = 200
): NextResponse<unknown> {
  const requestContext = getCurrentContext();
  const requestId = requestContext?.requestId ?? "unknown";
  
  const response = NextResponse.json(
    { data, requestId },
    { status: statusCode }
  );
  
  return addSecurityHeaders(response);
}

// Import for context access
import { getCurrentContext } from "@/lib/logging/logger";
