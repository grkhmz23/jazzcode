import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { AuthOptions } from "next-auth";

describe("Auth Configuration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Production Validation", () => {
    it("should throw if NEXTAUTH_SECRET is missing in production", async () => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "production";
      delete process.env.NEXTAUTH_SECRET;
      
      // Should throw during module load
      await expect(import("@/lib/auth/config")).rejects.toThrow("NEXTAUTH_SECRET is required");
    });

    it("should throw if NEXTAUTH_SECRET is too short in production", async () => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "production";
      process.env.NEXTAUTH_SECRET = "short";
      
      await expect(import("@/lib/auth/config")).rejects.toThrow("at least 32 characters");
    });

    it("should not throw in development without NEXTAUTH_SECRET", async () => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      delete process.env.NEXTAUTH_SECRET;
      
      // In dev, NextAuth will generate a fallback secret
      const { authOptions } = await import("@/lib/auth/config");
      expect(authOptions).toBeDefined();
    });
  });

  describe("Provider Configuration", () => {
    beforeEach(() => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    });

    it("should include Google provider when configured", async () => {
      process.env.GOOGLE_CLIENT_ID = "test-google-id";
      process.env.GOOGLE_CLIENT_SECRET = "test-google-secret";
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      
      const { authOptions } = await import("@/lib/auth/config");
      
      const providers = authOptions.providers || [];
      const googleProvider = providers.find((p: { id?: string }) => p.id === "google");
      
      expect(googleProvider).toBeDefined();
    });

    it("should include GitHub provider when configured", async () => {
      process.env.GITHUB_CLIENT_ID = "test-github-id";
      process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;
      
      const { authOptions } = await import("@/lib/auth/config");
      
      const providers = authOptions.providers || [];
      const githubProvider = providers.find((p: { id?: string }) => p.id === "github");
      
      expect(githubProvider).toBeDefined();
    });

    it("should not include providers when not configured", async () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      
      const { authOptions } = await import("@/lib/auth/config");
      
      // Should still work but with no providers
      expect(authOptions.providers).toBeDefined();
    });
  });

  describe("Session Configuration", () => {
    beforeEach(() => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    });

    it("should use database session strategy", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      expect(authOptions.session?.strategy).toBe("database");
    });

    it("should have reasonable session maxAge", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      // 30 days in seconds
      expect(authOptions.session?.maxAge).toBe(30 * 24 * 60 * 60);
    });
  });

  describe("Cookie Configuration", () => {
    beforeEach(() => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    });

    it("should have httpOnly cookies", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      const sessionCookie = authOptions.cookies?.sessionToken;
      expect(sessionCookie?.options.httpOnly).toBe(true);
    });

    it("should have sameSite lax cookies", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      const sessionCookie = authOptions.cookies?.sessionToken;
      expect(sessionCookie?.options.sameSite).toBe("lax");
    });

    it("should use secure cookies in production", async () => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "production";
      
      const { authOptions } = await import("@/lib/auth/config");
      
      const sessionCookie = authOptions.cookies?.sessionToken;
      expect(sessionCookie?.options.secure).toBe(true);
    });

    it("should not use secure cookies in development", async () => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      
      const { authOptions } = await import("@/lib/auth/config");
      
      const sessionCookie = authOptions.cookies?.sessionToken;
      expect(sessionCookie?.options.secure).toBe(false);
    });
  });

  describe("Pages Configuration", () => {
    beforeEach(() => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    });

    it("should have custom signIn page", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      expect(authOptions.pages?.signIn).toBe("/auth/signin");
    });

    it("should have custom error page", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      expect(authOptions.pages?.error).toBe("/auth/error");
    });
  });
});
