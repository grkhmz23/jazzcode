import { PrismaClient } from "@prisma/client";
import { isDevelopment } from "@/lib/env";
import { logger } from "@/lib/logging/logger";

/**
 * Prisma client singleton for Next.js
 * 
 * In development, we attach the Prisma client to the global object
 * to prevent multiple instances during hot reloading.
 * 
 * In production, each serverless function gets its own instance,
 * but connection pooling should be handled by the database provider
 * (e.g., PgBouncer, Supabase Pooler, etc.)
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Create Prisma client with appropriate logging
 */
function createPrismaClient(): PrismaClient {
  const isDev = isDevelopment();
  
  return new PrismaClient({
    log: isDev
      ? ["query", "info", "warn", "error"]
      : ["error", "warn"],
    // Connection handling - use connection pooling in production
    // DATABASE_URL should point to a pooler (PgBouncer, Supabase, etc.)
  });
}

// Export singleton
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache in development to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Database health check
 * Returns true if database is reachable, false otherwise
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  
  try {
    // Simple query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    
    return {
      healthy: true,
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Database health check failed", { error: message });
    
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      error: message,
    };
  }
}

/**
 * Gracefully disconnect from database
 * Call this in cleanup scenarios (SIGTERM, etc.)
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info("Database disconnected gracefully");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Database disconnect error", { error: message });
    throw error;
  }
}

// Handle graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, disconnecting database...");
    await disconnectDatabase();
  });
  
  process.on("SIGINT", async () => {
    logger.info("SIGINT received, disconnecting database...");
    await disconnectDatabase();
  });
}
