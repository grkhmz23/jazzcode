import pino from "pino";
import type { Logger as PinoLogger } from "pino";
import { isDevelopment } from "@/lib/env";

/**
 * Request context for correlation
 */
export interface RequestContext {
  requestId: string;
  path?: string;
  method?: string;
  userId?: string;
}

// AsyncLocalStorage for request context (Node.js 14.8+)
// This allows us to access request context from anywhere in the call stack
let asyncStorage: import("async_hooks").AsyncLocalStorage<RequestContext> | undefined;

// Lazy initialization to avoid issues with Edge runtime
function getAsyncStorage() {
  if (typeof window !== "undefined") return undefined;
  if (!asyncStorage) {
    // Only import in Node.js environment
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AsyncLocalStorage } = require("async_hooks");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asyncStorage = new (AsyncLocalStorage as any)();
  }
  return asyncStorage;
}

/**
 * Redact sensitive fields from logs
 */
const sensitiveFields = [
  "password",
  "secret",
  "token",
  "authorization",
  "cookie",
  "session",
  "apiKey",
  "api_key",
  "privateKey",
  "private_key",
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
];

/**
 * Create a Pino logger instance
 */
function createLogger(): PinoLogger {
  const isDev = isDevelopment();
  
  // In development, use pretty printing
  // In production, use JSON format for structured logging
  const transport = isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined;

  return pino({
    level: process.env.LOG_LEVEL || "info",
    transport,
    redact: {
      paths: sensitiveFields,
      remove: true,
    },
    base: {
      // Don't include pid/hostname in logs (added by default)
      ...(isDev ? {} : { service: "superteam-academy" }),
    },
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

// Singleton logger instance
let _logger: PinoLogger | undefined;

/**
 * Get the global logger instance
 */
export function getLogger(): PinoLogger {
  if (!_logger) {
    _logger = createLogger();
  }
  return _logger;
}

/**
 * Get a child logger with request context
 */
export function getRequestLogger(context: RequestContext): PinoLogger {
  const logger = getLogger();
  return logger.child({
    requestId: context.requestId,
    ...(context.path && { path: context.path }),
    ...(context.method && { method: context.method }),
    ...(context.userId && { userId: context.userId }),
  });
}

/**
 * Get the current request context from AsyncLocalStorage
 */
export function getCurrentContext(): RequestContext | undefined {
  const storage = getAsyncStorage();
  return storage?.getStore();
}

/**
 * Get a logger bound to the current request context (if any)
 */
export function getContextualLogger(): PinoLogger {
  const context = getCurrentContext();
  if (context) {
    return getRequestLogger(context);
  }
  return getLogger();
}

/**
 * Run a function within a request context
 * This allows the context to be accessed from anywhere in the call stack
 */
export async function runWithContext<T>(
  context: RequestContext,
  fn: () => Promise<T>
): Promise<T> {
  const storage = getAsyncStorage();
  if (!storage) {
    // Edge runtime or browser - just run the function
    return fn();
  }
  return storage.run(context, fn);
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  // Use crypto.randomUUID if available (Node.js 14.17+, modern browsers)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Log levels convenience exports
 */
export const logger = {
  trace: (msg: string, obj?: Record<string, unknown>) => getContextualLogger().trace(obj, msg),
  debug: (msg: string, obj?: Record<string, unknown>) => getContextualLogger().debug(obj, msg),
  info: (msg: string, obj?: Record<string, unknown>) => getContextualLogger().info(obj, msg),
  warn: (msg: string, obj?: Record<string, unknown>) => getContextualLogger().warn(obj, msg),
  error: (msg: string, obj?: Record<string, unknown>) => getContextualLogger().error(obj, msg),
  fatal: (msg: string, obj?: Record<string, unknown>) => getContextualLogger().fatal(obj, msg),
};
