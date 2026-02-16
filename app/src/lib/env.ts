import { z } from "zod";

/**
 * Environment variable validation schema
 * - Server-side env vars are validated at runtime
 * - Client-side env vars must be explicitly prefixed with NEXT_PUBLIC_
 * - No placeholders: all env vars have safe defaults or throw in production
 */

// Server-side environment schema
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  
  // OAuth Providers (optional in dev, required in prod if enabled)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // Rate Limiting (disabled by default, safe in dev)
  RATE_LIMIT_ENABLED: z.enum(["true", "false"]).optional().default("false"),
  RATE_LIMIT_UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  RATE_LIMIT_UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).optional().default("info"),
  
  // Analytics (optional)
  ANALYTICS_ENABLED: z.enum(["true", "false"]).optional().default("false"),
  
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

// Client-side environment schema (must be explicitly public)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_ANALYTICS_ENABLED: z.enum(["true", "false"]).optional().default("false"),
});

// Type inference
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validate server-side environment variables
 * Throws in production if required vars are missing
 */
function validateServerEnv(): ServerEnv {
  // Allow skipping validation in CI builds (accepts "true" or "1")
  if (process.env.SKIP_ENV_VALIDATION === "true" || process.env.SKIP_ENV_VALIDATION === "1") {
    return serverEnvSchema.parse({});
  }
  
  const parsed = serverEnvSchema.safeParse(process.env);
  
  if (!parsed.success) {
    const errors = parsed.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("\n");
    
    // In production, hard fail on missing required env
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Environment validation failed:\n${errors}`);
    }
    
    // In dev, warn but continue with safe defaults where possible
    // eslint-disable-next-line no-console
    console.warn("⚠️  Environment validation warnings:\n" + errors);
  }
  
  return parsed.success ? parsed.data : serverEnvSchema.parse({});
}

/**
 * Validate client-side environment variables
 * These are baked into the client bundle at build time
 */
function validateClientEnv(): ClientEnv {
  // Client env is validated at build time, but we do runtime check for safety
  const clientEnv: Record<string, string | undefined> = {};
  
  // Only include NEXT_PUBLIC_ vars
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      clientEnv[key] = value;
    }
  }
  
  const parsed = clientEnvSchema.safeParse(clientEnv);
  
  if (!parsed.success) {
    // Client env issues are build-time concerns, log for debugging
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("Client env validation:", parsed.error.errors);
    }
  }
  
  return parsed.success ? parsed.data : clientEnvSchema.parse({});
}

// Lazy-loaded singletons
let _serverEnv: ServerEnv | undefined;
let _clientEnv: ClientEnv | undefined;

/**
 * Get server-side environment variables
 * Safe to call from server components, API routes, server-side code
 * Throws if called from client-side code (no secrets leak)
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() cannot be called from client-side code");
  }
  
  if (!_serverEnv) {
    _serverEnv = validateServerEnv();
  }
  return _serverEnv;
}

/**
 * Get client-side environment variables
 * Safe to call from anywhere (only public vars are included)
 */
export function getClientEnv(): ClientEnv {
  if (typeof window !== "undefined") {
    // Client-side: use the env baked into the bundle
    if (!_clientEnv) {
      _clientEnv = validateClientEnv();
    }
    return _clientEnv;
  }
  
  // Server-side: still return client env (for SSR)
  if (!_clientEnv) {
    _clientEnv = validateClientEnv();
  }
  return _clientEnv;
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if rate limiting is enabled
 */
export function isRateLimitEnabled(): boolean {
  return process.env.RATE_LIMIT_ENABLED === "true";
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window !== "undefined") {
    return getClientEnv().NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
  }
  return getServerEnv().ANALYTICS_ENABLED === "true";
}
