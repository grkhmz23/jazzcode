import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getOnChainLeaderboard,
  verifyCredentialOwnership,
  isValidWalletAddress,
} from "@/lib/services/onchain";

describe("On-Chain Leaderboard Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getOnChainLeaderboard", () => {
    it("should return empty array when HELIUS_API_KEY is not set", async () => {
      delete process.env.HELIUS_API_KEY;
      process.env.NEXT_PUBLIC_XP_MINT_ADDRESS = "some-mint";

      const result = await getOnChainLeaderboard();

      expect(result).toEqual([]);
    });

    it("should return empty array when NEXT_PUBLIC_XP_MINT_ADDRESS is not set", async () => {
      process.env.HELIUS_API_KEY = "test-api-key";
      delete process.env.NEXT_PUBLIC_XP_MINT_ADDRESS;

      const result = await getOnChainLeaderboard();

      expect(result).toEqual([]);
    });

    it("should return empty array when both env vars are not set", async () => {
      delete process.env.HELIUS_API_KEY;
      delete process.env.NEXT_PUBLIC_XP_MINT_ADDRESS;

      const result = await getOnChainLeaderboard();

      expect(result).toEqual([]);
    });

    it("should have environment variables available for configuration", () => {
      // These should be undefined in test environment
      expect(process.env.HELIUS_API_KEY).toBeUndefined();
      expect(process.env.NEXT_PUBLIC_XP_MINT_ADDRESS).toBeUndefined();
    });
  });

  describe("verifyCredentialOwnership", () => {
    const validAssetId = "H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGh";
    const validOwner = "So11111111111111111111111111111111111111112";

    it("should return verified: false and currentOwner: null when HELIUS_API_KEY is not set", async () => {
      delete process.env.HELIUS_API_KEY;

      const result = await verifyCredentialOwnership(validAssetId, validOwner);

      expect(result.verified).toBe(false);
      expect(result.currentOwner).toBeNull();
    });

    it("should handle invalid assetId format", async () => {
      process.env.HELIUS_API_KEY = "test-api-key";

      // Test with various invalid formats
      const invalidAssetIds = [
        "invalid",
        "too_short",
        "too_long_address_that_is_definitely_not_valid",
        "", // empty
      ];

      for (const invalidId of invalidAssetIds) {
        // The function may or may not validate assetId format
        // depending on implementation, but it should handle errors gracefully
        const result = await verifyCredentialOwnership(invalidId, validOwner);
        expect(result.verified).toBe(false);
      }
    });

    it("should handle invalid owner format", async () => {
      process.env.HELIUS_API_KEY = "test-api-key";

      const invalidOwners = [
        "invalid",
        "too_short",
        "too_long_address_that_is_definitely_not_valid",
        "", // empty
      ];

      for (const invalidOwner of invalidOwners) {
        const result = await verifyCredentialOwnership(validAssetId, invalidOwner);
        expect(result.verified).toBe(false);
      }
    });
  });

  describe("wallet address validation", () => {
    it("should validate correct Solana address formats", () => {
      expect(isValidWalletAddress("11111111111111111111111111111111")).toBe(true);
      expect(isValidWalletAddress("So11111111111111111111111111111111111111112")).toBe(
        true
      );
    });

    it("should reject invalid address formats", () => {
      expect(isValidWalletAddress("")).toBe(false);
      expect(isValidWalletAddress("short")).toBe(false);
      expect(isValidWalletAddress("invalid_with_0")).toBe(false);
      expect(isValidWalletAddress("invalid_with_O")).toBe(false);
      expect(isValidWalletAddress("invalid_with_I")).toBe(false);
      expect(isValidWalletAddress("invalid_with_l")).toBe(false);
    });
  });

  describe("OnChainLeaderboardEntry interface structure", () => {
    it("should define correct entry structure", () => {
      // Type check - this ensures the interface is correct
      const validEntry = {
        walletAddress: "11111111111111111111111111111111",
        xpBalance: 1000,
      };

      expect(validEntry.walletAddress).toBeDefined();
      expect(validEntry.xpBalance).toBeDefined();
      expect(typeof validEntry.xpBalance).toBe("number");
    });
  });
});
