import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

    it("should include GitHub provider when configured", async () => {
      process.env.GITHUB_CLIENT_ID = "test-github-id";
      process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
      
      const { authOptions } = await import("@/lib/auth/config");
      
      const providers = authOptions.providers || [];
      const githubProvider = providers.find((p: { id?: string }) => p.id === "github");
      const walletProvider = providers.find(
        (p: { id?: string; type?: string; name?: string }) =>
          p.id === "solana-wallet" ||
          p.id === "credentials" ||
          p.type === "credentials" ||
          p.name === "Solana Wallet"
      );
      
      expect(githubProvider).toBeDefined();
      expect(walletProvider).toBeDefined();
    });

    it("should include wallet provider even when GitHub is not configured", async () => {
      delete process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_SECRET;
      
      const { authOptions } = await import("@/lib/auth/config");

      const providers = authOptions.providers || [];
      const githubProvider = providers.find((p: { id?: string }) => p.id === "github");
      const walletProvider = providers.find(
        (p: { id?: string; type?: string; name?: string }) =>
          p.id === "solana-wallet" ||
          p.id === "credentials" ||
          p.type === "credentials" ||
          p.name === "Solana Wallet"
      );

      expect(githubProvider).toBeUndefined();
      expect(walletProvider).toBeDefined();
    });
  });

  describe("Session Configuration", () => {
    beforeEach(() => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    });

    it("should use jwt session strategy", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      expect(authOptions.session?.strategy).toBe("jwt");
    });

    it("should have reasonable session maxAge", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      
      // 30 days in seconds
      expect(authOptions.session?.maxAge).toBe(30 * 24 * 60 * 60);
    });
  });

  describe("Callback Configuration", () => {
    beforeEach(() => {
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";
      process.env.NEXTAUTH_SECRET = "test-secret-that-is-32-chars-long";
    });

    it("should include jwt callback", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      expect(authOptions.callbacks?.jwt).toBeDefined();
    });

    it("should include session callback", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      expect(authOptions.callbacks?.session).toBeDefined();
    });

    it("should allow all sign-ins", async () => {
      const { authOptions } = await import("@/lib/auth/config");
      const result = await authOptions.callbacks?.signIn?.({
        user: { id: "test-user" },
        account: null,
        profile: undefined,
        email: undefined,
        credentials: undefined,
      });
      expect(result).toBe(true);
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
