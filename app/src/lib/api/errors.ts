import { NextResponse } from "next/server";
import { logger } from "@/lib/logging/logger";
import { getCurrentContext } from "@/lib/logging/logger";

/**
 * API Error codes
 */
export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "VALIDATION_ERROR";

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId: string;
    details?: Record<string, string[]>;
  };
}

/**
 * API Error class with structured error info
 */
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, string[]>;

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }

  toJSON(requestId: string): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        requestId,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

/**
 * Predefined error factories
 */
export const Errors = {
  badRequest: (message: string, details?: Record<string, string[]>) =>
    new ApiError("BAD_REQUEST", message, 400, details),
  
  unauthorized: (message = "Unauthorized") =>
    new ApiError("UNAUTHORIZED", message, 401),
  
  forbidden: (message = "Forbidden") =>
    new ApiError("FORBIDDEN", message, 403),
  
  notFound: (message = "Not found") =>
    new ApiError("NOT_FOUND", message, 404),
  
  methodNotAllowed: (message = "Method not allowed") =>
    new ApiError("METHOD_NOT_ALLOWED", message, 405),
  
  conflict: (message: string) =>
    new ApiError("CONFLICT", message, 409),
  
  rateLimited: (message = "Rate limit exceeded") =>
    new ApiError("RATE_LIMITED", message, 429),
  
  internal: (message = "Internal server error") =>
    new ApiError("INTERNAL_ERROR", message, 500),
  
  serviceUnavailable: (message = "Service unavailable") =>
    new ApiError("SERVICE_UNAVAILABLE", message, 503),
  
  validation: (message: string, details: Record<string, string[]>) =>
    new ApiError("VALIDATION_ERROR", message, 400, details),
};

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  statusCode = 200,
  headers?: Record<string, string>
): NextResponse<{ data: T; requestId: string }> {
  const context = getCurrentContext();
  const requestId = context?.requestId ?? "unknown";
  
  return NextResponse.json(
    { data, requestId },
    { status: statusCode, headers }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: ApiError | Error,
  statusCode?: number
): NextResponse<ApiErrorResponse> {
  const context = getCurrentContext();
  const requestId = context?.requestId ?? "unknown";
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      error.toJSON(requestId),
      { status: error.statusCode }
    );
  }
  
  // Generic error handling
  const apiError = new ApiError(
    "INTERNAL_ERROR",
    process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : error.message,
    statusCode ?? 500
  );
  
  return NextResponse.json(
    apiError.toJSON(requestId),
    { status: apiError.statusCode }
  );
}

/**
 * Global error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  const context = getCurrentContext();
  const requestId = context?.requestId ?? "unknown";
  
  if (error instanceof ApiError) {
    // Log structured error
    logger.warn(`API error: ${error.code}`, {
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
      requestId,
      ...(error.details && { details: error.details }),
    });
    
    return errorResponse(error);
  }
  
  // Unexpected error - log full details
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  logger.error("Unexpected API error", {
    message: errorMessage,
    stack: errorStack,
    requestId,
  });
  
  return errorResponse(Errors.internal());
}

/**
 * Wrap an async API handler with error handling
 */
export function withErrorHandling<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ApiErrorResponse>> {
  return handler().catch(handleApiError) as Promise<NextResponse<T | ApiErrorResponse>>;
}
