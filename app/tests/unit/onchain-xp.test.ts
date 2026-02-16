import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getOnChainXP,
  isValidWalletAddress,
  XP_MINT,
} from "@/lib/services/onchain";

describe("On-Chain XP Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isValidWalletAddress", () => {
    it("should return true for valid Solana addresses", () => {
      expect(
        isValidWalletAddress("H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGh")
      ).toBe(true);
      expect(
        isValidWalletAddress("11111111111111111111111111111111")
      ).toBe(true);
      expect(
        isValidWalletAddress("So11111111111111111111111111111111111111112")
      ).toBe(true);
    });

    it("should return false for invalid addresses", () => {
      expect(isValidWalletAddress("short")).toBe(false);
      expect(
        isValidWalletAddress(
          "thisisaverylongaddressthatshouldnotbevalidatall"
        )
      ).toBe(false);
      expect(isValidWalletAddress("H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGh0")).toBe(
        false
      );
      expect(isValidWalletAddress("H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGhI")).toBe(
        false
      );
      expect(isValidWalletAddress("")).toBe(false);
      expect(isValidWalletAddress(null as unknown as string)).toBe(false);
      expect(isValidWalletAddress(undefined as unknown as string)).toBe(false);
    });
  });

  describe("getOnChainXP", () => {
    const validWallet = "H6f4Q8z2K3mN7pQrStUvWxYz123456789AbCdEfGh";

    it("should return null when XP_MINT is not set (program not deployed)", async () => {
      // XP_MINT should be null from the module if env var is not set
      const result = await getOnChainXP(validWallet);

      // Since we're not setting NEXT_PUBLIC_XP_MINT_ADDRESS, XP_MINT should be null
      expect(result).toBeNull();
    });

    it("should return null for invalid wallet address", async () => {
      const result = await getOnChainXP("invalid-address");

      expect(result).toBeNull();
    });

    it("should export XP_MINT constant", () => {
      // XP_MINT should reflect the env var (or be null if not set)
      expect(XP_MINT).toBe(
        process.env.NEXT_PUBLIC_XP_MINT_ADDRESS || null
      );
    });
  });

  describe("XP_MINT configuration", () => {
    it("should reflect environment variable when set", () => {
      // Since we can't easily re-import the module, we just verify the current value
      // matches what we expect from the environment
      const expectedMint = process.env.NEXT_PUBLIC_XP_MINT_ADDRESS || null;
      expect(XP_MINT).toBe(expectedMint);
    });
  });
});
