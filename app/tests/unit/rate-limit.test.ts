import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  checkRateLimit,
  rateLimitByIp,
  getRateLimitConfig,
  DEFAULT_RATE_LIMITS,
  isRateLimitAvailable,
} from "@/lib/rate-limit";

describe("Rate Limiting", () => {
  const originalEnv = process.env.RATE_LIMIT_ENABLED;

  beforeEach(() => {
    // Reset modules to clear singleton state
    vi.resetModules();
    process.env.RATE_LIMIT_ENABLED = "true";
  });

  afterEach(() => {
    process.env.RATE_LIMIT_ENABLED = originalEnv;
    vi.clearAllMocks();
  });

  describe("Configuration", () => {
    it("should return correct config for exact path match", () => {
      const config = getRateLimitConfig("/api/auth/nonce");
      expect(config).toEqual(DEFAULT_RATE_LIMITS["/api/auth/nonce"]);
    });

    it("should return prefix match config", () => {
      const config = getRateLimitConfig("/api/onchain/credentials");
      expect(config).toEqual(DEFAULT_RATE_LIMITS["/api/onchain/"]);
    });

    it("should return default config for unknown paths", () => {
      const config = getRateLimitConfig("/api/unknown");
      expect(config).toEqual(DEFAULT_RATE_LIMITS.default);
    });
  });

  describe("Disabled Rate Limiting", () => {
    it("should always allow when rate limiting is disabled", async () => {
      process.env.RATE_LIMIT_ENABLED = "false";
      
      const result = await checkRateLimit("test-id", { limit: 5, windowSeconds: 60 });
      
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(5);
    });

    it("should report rate limiting as not available when disabled", () => {
      process.env.RATE_LIMIT_ENABLED = "false";
      expect(isRateLimitAvailable()).toBe(false);
    });
  });

  describe("Token Bucket Algorithm", () => {
    it("should allow requests within limit", async () => {
      const result = await checkRateLimit("test-1", { limit: 5, windowSeconds: 60 });
      expect(result.success).toBe(true);
      expect(result.limit).toBe(5);
      expect(result.remaining).toBe(4);
    });

    it("should block requests over limit", async () => {
      const id = "test-2";
      const config = { limit: 2, windowSeconds: 60 };
      
      // First two requests should succeed
      const r1 = await checkRateLimit(id, config);
      expect(r1.success).toBe(true);
      
      const r2 = await checkRateLimit(id, config);
      expect(r2.success).toBe(true);
      
      // Third request should be blocked
      const r3 = await checkRateLimit(id, config);
      expect(r3.success).toBe(false);
      expect(r3.remaining).toBe(0);
    });

    it("should include reset timestamp", async () => {
      const before = Math.floor(Date.now() / 1000);
      const result = await checkRateLimit("test-3", { limit: 5, windowSeconds: 60 });
      const after = Math.floor(Date.now() / 1000);
      
      expect(result.reset).toBeGreaterThanOrEqual(before + 60);
      expect(result.reset).toBeLessThanOrEqual(after + 60);
    });
  });

  describe("IP-based Rate Limiting", () => {
    it("should track different IPs separately", async () => {
      const ip1 = "192.168.1.1";
      const ip2 = "192.168.1.2";
      const path = "/api/test";
      
      // Use strict limit
      const originalConfig = DEFAULT_RATE_LIMITS.default;
      DEFAULT_RATE_LIMITS[path] = { limit: 1, windowSeconds: 60 };
      
      const r1 = await rateLimitByIp(ip1, path);
      expect(r1.success).toBe(true);
      
      // Same IP should be blocked
      const r2 = await rateLimitByIp(ip1, path);
      expect(r2.success).toBe(false);
      
      // Different IP should be allowed
      const r3 = await rateLimitByIp(ip2, path);
      expect(r3.success).toBe(true);
      
      // Cleanup
      delete DEFAULT_RATE_LIMITS[path];
    });
  });

  describe("Time Window Reset", () => {
    it("should reset counter after window expires", async () => {
      // This test uses a very short window to simulate time passing
      const id = "test-reset";
      const config = { limit: 1, windowSeconds: 1 };
      
      // First request
      const r1 = await checkRateLimit(id, config);
      expect(r1.success).toBe(true);
      
      // Second request should be blocked
      const r2 = await checkRateLimit(id, config);
      expect(r2.success).toBe(false);
      
      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Third request should succeed (new window)
      const r3 = await checkRateLimit(id, config);
      expect(r3.success).toBe(true);
    });
  });
});
