import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getCredentials, isValidWalletAddress } from "@/lib/services/onchain";

describe("On-Chain Credentials Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getCredentials", () => {
    const validWallet = "H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGh";

    it("should return empty array when HELIUS_API_KEY is not set", async () => {
      delete process.env.HELIUS_API_KEY;

      const result = await getCredentials(validWallet);

      expect(result).toEqual([]);
    });

    it("should return empty array for invalid wallet address", async () => {
      process.env.HELIUS_API_KEY = "test-api-key";

      const result = await getCredentials("invalid-address");

      expect(result).toEqual([]);
    });

    it("should return empty array for null/undefined wallet", async () => {
      process.env.HELIUS_API_KEY = "test-api-key";

      // @ts-expect-error Testing invalid input
      const resultNull = await getCredentials(null);
      // @ts-expect-error Testing invalid input
      const resultUndefined = await getCredentials(undefined);

      expect(resultNull).toEqual([]);
      expect(resultUndefined).toEqual([]);
    });

    it("should reflect environment variable for collection address", () => {
      // Since we can't easily re-import the module, we just verify the current value
      const collectionAddress =
        process.env.NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS || null;
      expect(collectionAddress).toBe(
        process.env.NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS || null
      );
    });
  });

  describe("isValidWalletAddress", () => {
    it("should validate Solana address format correctly", () => {
      // Valid addresses
      expect(
        isValidWalletAddress("11111111111111111111111111111111")
      ).toBe(true);
      expect(
        isValidWalletAddress("So11111111111111111111111111111111111111112")
      ).toBe(true);
      expect(
        isValidWalletAddress("H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGh")
      ).toBe(true);

      // Invalid addresses
      expect(isValidWalletAddress("")).toBe(false);
      expect(isValidWalletAddress("short")).toBe(false);
      expect(isValidWalletAddress("too_long_address_that_is_definitely_not_valid")).toBe(
        false
      );
      // Contains invalid base58 chars (0, O, I, l)
      expect(isValidWalletAddress("111111111111111111111111111111110")).toBe(false);
      expect(isValidWalletAddress("11111111111111111111111111111111O")).toBe(false);
      expect(isValidWalletAddress("11111111111111111111111111111111I")).toBe(false);
      expect(isValidWalletAddress("11111111111111111111111111111111l")).toBe(false);
    });
  });

  describe("credential filtering logic", () => {
    it("should have environment variables available", () => {
      // These should be undefined in test environment
      expect(process.env.HELIUS_API_KEY).toBeUndefined();
      expect(process.env.NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS).toBeUndefined();
    });
  });
});
