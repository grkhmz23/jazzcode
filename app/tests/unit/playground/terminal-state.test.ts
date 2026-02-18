import { describe, expect, it } from "vitest";
import {
  generateSessionSeed,
  createTerminalSession,
  seededRandom,
  generateDeterministicSignature,
  generateDeterministicPublicKey,
  generateDeterministicBlockhash,
  calculateSimulatedBalance,
} from "@/lib/playground/terminal/state";

describe("terminal/state", () => {
  describe("generateSessionSeed", () => {
    it("generates unique seeds", () => {
      const seed1 = generateSessionSeed();
      const seed2 = generateSessionSeed();
      expect(seed1).not.toBe(seed2);
      expect(seed1).toContain("-");
      expect(seed1.length).toBeGreaterThan(10);
    });
  });

  describe("createTerminalSession", () => {
    it("creates session with generated seed", () => {
      const session = createTerminalSession();
      expect(session.seed).toBeDefined();
      expect(session.startedAt).toBeLessThanOrEqual(Date.now());
      expect(session.commandHistory).toEqual([]);
      expect(session.recentOutputs).toEqual([]);
    });

    it("uses provided seed when given", () => {
      const session = createTerminalSession("my-custom-seed");
      expect(session.seed).toBe("my-custom-seed");
    });
  });

  describe("seededRandom", () => {
    it("produces deterministic sequence from same seed", () => {
      const rand1 = seededRandom("test-seed");
      const rand2 = seededRandom("test-seed");

      const values1 = [rand1(), rand1(), rand1()];
      const values2 = [rand2(), rand2(), rand2()];

      expect(values1).toEqual(values2);
    });

    it("produces different sequences from different seeds", () => {
      const rand1 = seededRandom("seed-a");
      const rand2 = seededRandom("seed-b");

      const values1 = [rand1(), rand1(), rand1()];
      const values2 = [rand2(), rand2(), rand2()];

      expect(values1).not.toEqual(values2);
    });

    it("produces values in range [0, 1)", () => {
      const rand = seededRandom("test");
      for (let i = 0; i < 100; i++) {
        const value = rand();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe("generateDeterministicSignature", () => {
    it("produces same signature for same inputs", () => {
      const sig1 = generateDeterministicSignature("seed", ["input1", "input2"], 0);
      const sig2 = generateDeterministicSignature("seed", ["input1", "input2"], 0);
      expect(sig1).toBe(sig2);
    });

    it("produces different signatures for different seeds", () => {
      const sig1 = generateDeterministicSignature("seed1", ["input"], 0);
      const sig2 = generateDeterministicSignature("seed2", ["input"], 0);
      expect(sig1).not.toBe(sig2);
    });

    it("produces different signatures for different counters", () => {
      const sig1 = generateDeterministicSignature("seed", ["input"], 0);
      const sig2 = generateDeterministicSignature("seed", ["input"], 1);
      expect(sig1).not.toBe(sig2);
    });

    it("produces 88-character signatures", () => {
      const sig = generateDeterministicSignature("seed", ["input"], 0);
      expect(sig.length).toBe(88);
    });

    it("uses only valid base58 characters", () => {
      const sig = generateDeterministicSignature("seed", ["input"], 0);
      const validChars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      for (const char of sig) {
        expect(validChars).toContain(char);
      }
    });
  });

  describe("generateDeterministicPublicKey", () => {
    it("produces same key for same seed and index", () => {
      const key1 = generateDeterministicPublicKey("seed", 0);
      const key2 = generateDeterministicPublicKey("seed", 0);
      expect(key1).toBe(key2);
    });

    it("produces different keys for different indices", () => {
      const key1 = generateDeterministicPublicKey("seed", 0);
      const key2 = generateDeterministicPublicKey("seed", 1);
      expect(key1).not.toBe(key2);
    });

    it("produces 44-character keys", () => {
      const key = generateDeterministicPublicKey("seed", 0);
      expect(key.length).toBe(44);
    });
  });

  describe("generateDeterministicBlockhash", () => {
    it("produces same hash for same seed and slot", () => {
      const hash1 = generateDeterministicBlockhash("seed", 100);
      const hash2 = generateDeterministicBlockhash("seed", 100);
      expect(hash1).toBe(hash2);
    });

    it("produces different hashes for different slots", () => {
      const hash1 = generateDeterministicBlockhash("seed", 100);
      const hash2 = generateDeterministicBlockhash("seed", 101);
      expect(hash1).not.toBe(hash2);
    });

    it("produces 87-character hashes", () => {
      const hash = generateDeterministicBlockhash("seed", 0);
      expect(hash.length).toBe(87);
    });
  });

  describe("calculateSimulatedBalance", () => {
    it("returns base balance with small fluctuation", () => {
      const balance = calculateSimulatedBalance("seed", "addr", 100, 0);
      expect(balance).toBeGreaterThan(99.9);
      expect(balance).toBeLessThan(100.1);
    });

    it("produces deterministic fluctuation for same inputs", () => {
      const b1 = calculateSimulatedBalance("seed", "addr", 100, 0);
      const b2 = calculateSimulatedBalance("seed", "addr", 100, 0);
      expect(b1).toBe(b2);
    });

    it("produces different fluctuations for different tx counts", () => {
      const b1 = calculateSimulatedBalance("seed", "addr", 100, 0);
      const b2 = calculateSimulatedBalance("seed", "addr", 100, 1);
      expect(b1).not.toBe(b2);
    });

    it("never returns negative balance", () => {
      const balance = calculateSimulatedBalance("seed", "addr", 0.001, 999);
      expect(balance).toBeGreaterThanOrEqual(0);
    });
  });
});
