import { isRateLimitEnabled } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  // Maximum number of requests allowed in the window
  limit: number;
  // Window size in seconds
  windowSeconds: number;
}

/**
 * Default rate limits by route pattern
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints - stricter limits
  "/api/auth/nonce": { limit: 10, windowSeconds: 60 },
  "/api/auth/": { limit: 20, windowSeconds: 60 },
  
  // Onchain read endpoints - moderate limits
  "/api/onchain/": { limit: 100, windowSeconds: 60 },
  
  // Default for all API routes
  default: { limit: 200, windowSeconds: 60 },
};

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when the window resets
}

/**
 * Rate limit storage interface
 */
interface RateLimitStore {
  get(key: string): Promise<{ count: number; reset: number } | null>;
  set(key: string, value: { count: number; reset: number }, ttlSeconds: number): Promise<void>;
}

/**
 * In-memory rate limit store (for development/testing)
 * Uses a simple Map with TTL
 */
class InMemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; reset: number; expiresAt: number }>();

  async get(key: string): Promise<{ count: number; reset: number } | null> {
    this.cleanup();
    const entry = this.store.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      return null;
    }
    return { count: entry.count, reset: entry.reset };
  }

  async set(key: string, value: { count: number; reset: number }, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      ...value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt < now) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Upstash Redis rate limit store (for production)
 * Only used if UPSTASH_REDIS_REST_URL is configured
 */
class UpstashRateLimitStore implements RateLimitStore {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  async get(key: string): Promise<{ count: number; reset: number } | null> {
    try {
      const response = await fetch(`${this.url}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      
      if (!response.ok) return null;
      
      const data = await response.json() as { result: string | null };
      if (!data.result) return null;
      
      return JSON.parse(data.result) as { count: number; reset: number };
    } catch (error) {
      logger.error("Rate limit store get error", { error: String(error), key });
      return null;
    }
  }

  async set(key: string, value: { count: number; reset: number }, ttlSeconds: number): Promise<void> {
    try {
      await fetch(`${this.url}/set/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify(value),
          ex: ttlSeconds,
        }),
      });
    } catch (error) {
      logger.error("Rate limit store set error", { error: String(error), key });
    }
  }
}

// Singleton store instance
let _store: RateLimitStore | undefined;

/**
 * Get or create the rate limit store
 */
function getStore(): RateLimitStore | null {
  if (_store) return _store;

  // Check for Upstash configuration
  const upstashUrl = process.env.RATE_LIMIT_UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.RATE_LIMIT_UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    logger.info("Using Upstash Redis for rate limiting");
    _store = new UpstashRateLimitStore(upstashUrl, upstashToken);
  } else {
    // Fall back to in-memory store (only for single-instance deployments)
    logger.debug("Using in-memory store for rate limiting");
    _store = new InMemoryRateLimitStore();
  }

  return _store;
}

/**
 * Check if rate limiting is available
 */
export function isRateLimitAvailable(): boolean {
  return isRateLimitEnabled() && getStore() !== null;
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (e.g., IP + route, or user ID)
 * @param config - Rate limit configuration
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const store = getStore();
  
  // If rate limiting is disabled or store unavailable, allow all
  if (!isRateLimitEnabled() || !store) {
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: Math.floor(Date.now() / 1000) + config.windowSeconds,
    };
  }

  const key = `ratelimit:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  
  const entry = await store.get(key);
  
  if (!entry || entry.reset < now) {
    // New window
    const reset = now + config.windowSeconds;
    await store.set(key, { count: 1, reset }, config.windowSeconds);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset,
    };
  }

  // Existing window
  const count = entry.count + 1;
  const remaining = Math.max(0, config.limit - count);
  
  await store.set(key, { count, reset: entry.reset }, entry.reset - now);

  return {
    success: count <= config.limit,
    limit: config.limit,
    remaining,
    reset: entry.reset,
  };
}

/**
 * Get rate limit config for a path
 */
export function getRateLimitConfig(path: string): RateLimitConfig {
  // Check for exact match first
  if (DEFAULT_RATE_LIMITS[path]) {
    return DEFAULT_RATE_LIMITS[path];
  }
  
  // Check for prefix match
  for (const [pattern, config] of Object.entries(DEFAULT_RATE_LIMITS)) {
    if (pattern !== "default" && path.startsWith(pattern)) {
      return config;
    }
  }
  
  return DEFAULT_RATE_LIMITS.default;
}

/**
 * Rate limit by IP address
 */
export async function rateLimitByIp(
  ip: string,
  path: string
): Promise<RateLimitResult> {
  const config = getRateLimitConfig(path);
  const identifier = `ip:${ip}:${path}`;
  return checkRateLimit(identifier, config);
}

/**
 * Rate limit by user ID (for authenticated routes)
 */
export async function rateLimitByUser(
  userId: string,
  path: string
): Promise<RateLimitResult> {
  const config = getRateLimitConfig(path);
  // User rate limits are more lenient
  const userConfig = { ...config, limit: config.limit * 2 };
  const identifier = `user:${userId}:${path}`;
  return checkRateLimit(identifier, userConfig);
}
