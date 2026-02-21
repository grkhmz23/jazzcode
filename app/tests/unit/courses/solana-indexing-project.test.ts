import { describe, expect, it } from "vitest";
import {
  lesson3TestCases,
  lesson3SolutionCode,
  lesson3Hints,
  lesson3StarterCode,
} from "@/lib/courses/solana-indexing/challenges/lesson-3-decode-token-account";
import {
  lesson5TestCases,
  lesson5SolutionCode,
  lesson5Hints,
  lesson5StarterCode,
} from "@/lib/courses/solana-indexing/challenges/lesson-5-index-transactions";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/solana-indexing/challenges/lesson-8-analytics-checkpoint";
import {
  createDefaultSolanaIndexingLocalState,
  loadSolanaIndexingLocalState,
} from "@/lib/courses/solana-indexing/local-state";

describe("solana indexing project helpers", () => {
  describe("token decoding challenge (lesson 3)", () => {
    it("has valid test cases for token account decoding", () => {
      expect(lesson3TestCases).toHaveLength(2);
      
      const [test1, test2] = lesson3TestCases;
      
      // Test case 1: decodes token account with balance
      expect(test1.name).toBe("decodes token account");
      expect(test1.input).toContain("hex");
      expect(test1.expectedOutput).toContain("mint");
      expect(test1.expectedOutput).toContain("owner");
      expect(test1.expectedOutput).toContain("amount");
      
      // Test case 2: decodes zero balance account
      expect(test2.name).toBe("decodes zero balance account");
      expect(test2.expectedOutput).toContain('"amount":"0"');
    });

    it("has solution code with token decoding logic", () => {
      expect(lesson3SolutionCode).toContain("decodeTokenAccount");
      expect(lesson3SolutionCode).toContain("hexToBytes");
      expect(lesson3SolutionCode).toContain("bytesToBase58");
      expect(lesson3SolutionCode).toContain("readU64LE");
      expect(lesson3SolutionCode).toContain("165"); // SPL Token account size
    });

    it("has starter code with function signatures", () => {
      expect(lesson3StarterCode).toContain("decodeTokenAccount");
      expect(lesson3StarterCode).toContain("return { mint: \"\", owner: \"\", amount: \"0\" }");
    });

    it("has hints for SPL token layout", () => {
      expect(lesson3Hints.length).toBeGreaterThan(0);
      expect(lesson3Hints.some((h) => h.includes("SPL Token"))).toBe(true);
      expect(lesson3Hints.some((h) => h.includes("32B") || h.includes("8B"))).toBe(true);
    });
  });

  describe("transaction indexing challenge (lesson 5)", () => {
    it("has valid test cases for log parsing", () => {
      expect(lesson5TestCases).toHaveLength(2);
      
      const [test1, test2] = lesson5TestCases;
      
      // Test case 1: indexes transfer events
      expect(test1.name).toBe("indexes transfer events");
      expect(test1.input).toContain("Transfer");
      expect(test1.expectedOutput).toContain("transfer");
      
      // Test case 2: indexes multiple events
      expect(test2.name).toBe("indexes multiple events");
      expect(test2.input).toContain("Mint");
      expect(test2.expectedOutput).toContain("mint");
    });

    it("has solution code with log parsing logic", () => {
      expect(lesson5SolutionCode).toContain("indexTransactions");
      expect(lesson5SolutionCode).toContain("logs");
      expect(lesson5SolutionCode).toContain("Transfer");
      expect(lesson5SolutionCode).toContain("Mint");
    });

    it("has starter code with event array", () => {
      expect(lesson5StarterCode).toContain("indexTransactions");
      expect(lesson5StarterCode).toContain("events: []");
    });

    it("has hints for log parsing", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.includes("log"))).toBe(true);
    });
  });

  describe("analytics checkpoint challenge (lesson 8)", () => {
    it("has valid test cases for analytics aggregation", () => {
      expect(lesson8TestCases.length).toBeGreaterThanOrEqual(1);
      
      const [test1] = lesson8TestCases;
      
      expect(test1.name).toBe("generates analytics summary");
      expect(test1.input).toContain("events");
      expect(test1.input).toContain("timestamp");
      expect(test1.expectedOutput).toContain("wallets");
      expect(test1.expectedOutput).toContain("totalEvents");
      expect(test1.expectedOutput).toContain("uniqueWallets");

      const emptyStreamCase = lesson8TestCases.find((testCase) =>
        testCase.name.toLowerCase().includes("empty")
      );
      expect(emptyStreamCase).toBeDefined();
      expect(emptyStreamCase?.expectedOutput).toContain('"totalEvents":0');
      expect(emptyStreamCase?.expectedOutput).toContain('"uniqueWallets":0');
    });

    it("has solution code with analytics aggregation", () => {
      expect(lesson8SolutionCode).toContain("generateAnalyticsSummary");
      expect(lesson8SolutionCode).toContain("wallets");
      expect(lesson8SolutionCode).toContain("volume");
      expect(lesson8SolutionCode).toContain("localeCompare"); // sorting
    });

    it("has starter code with empty aggregation", () => {
      expect(lesson8StarterCode).toContain("generateAnalyticsSummary");
      expect(lesson8StarterCode).toContain("wallets: {}");
      expect(lesson8StarterCode).toContain("totalEvents: 0");
    });

    it("has hints for aggregation", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
      expect(lesson8Hints.some((h) => h.toLowerCase().includes("aggregate"))).toBe(true);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultSolanaIndexingLocalState();
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.indexedEvents).toEqual([]);
      expect(state.lastCheckpoint).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadSolanaIndexingLocalState("test-scope");
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.indexedEvents).toEqual([]);
    });
  });
});
