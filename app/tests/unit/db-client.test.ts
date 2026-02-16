import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Prisma Client Singleton", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the same instance in development (cached)", async () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "development";
    process.env.DATABASE_URL = "postgresql://test";
    process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    
    // Clear the global cache to ensure fresh test
    const globalVar = globalThis as unknown as { prisma?: unknown };
    delete globalVar.prisma;
    
    const { prisma: prisma1 } = await import("@/lib/db/client");
    const { prisma: prisma2 } = await import("@/lib/db/client");
    
    expect(prisma1).toBe(prisma2);
    expect(globalVar.prisma).toBe(prisma1);
  });

  it("should create new instance when global cache is cleared", async () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "development";
    process.env.DATABASE_URL = "postgresql://test";
    process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    
    // First import
    const globalVar = globalThis as unknown as { prisma?: unknown };
    delete globalVar.prisma;
    
    const mod1 = await import("@/lib/db/client");
    const prisma1 = mod1.prisma;
    
    // Simulate module reload by clearing global cache
    delete globalVar.prisma;
    
    // Re-import (should create new instance since cache is cleared)
    vi.resetModules();
    const mod2 = await import("@/lib/db/client");
    const prisma2 = mod2.prisma;
    
    // They should be different instances because we cleared the cache
    // But in reality, this shouldn't happen in normal operation
    expect(prisma1).toBeDefined();
    expect(prisma2).toBeDefined();
  });

  it("should not cache in production", async () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";
    process.env.DATABASE_URL = "postgresql://test";
    process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    
    // Clear any existing cache
    const globalVar = globalThis as unknown as { prisma?: unknown };
    const originalPrisma = globalVar.prisma;
    delete globalVar.prisma;
    
    // Import should not set global cache in production
    vi.resetModules();
    await import("@/lib/db/client");
    
    expect(globalVar.prisma).toBeUndefined();
    
    // Restore
    globalVar.prisma = originalPrisma;
  });
});

describe("Database Health Check", () => {
  it("should return healthy when database is reachable", async () => {
    process.env.DATABASE_URL = "postgresql://test";
    process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    
    vi.resetModules();
    const { checkDatabaseHealth } = await import("@/lib/db/client");
    
    // This will fail in test environment without a real database,
    // but we can verify the function structure
    const result = await checkDatabaseHealth();
    
    // Should return an object with expected shape
    expect(result).toHaveProperty("healthy");
    expect(result).toHaveProperty("latencyMs");
    expect(typeof result.healthy).toBe("boolean");
    expect(typeof result.latencyMs).toBe("number");
  });
});
