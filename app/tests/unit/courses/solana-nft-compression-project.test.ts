import { describe, expect, it } from "vitest";
import {
  lesson3TestCases,
  lesson3SolutionCode,
  lesson3Hints,
  lesson3StarterCode,
} from "@/lib/courses/solana-nft-compression/challenges/lesson-3-merkle-insert";
import {
  lesson5TestCases,
  lesson5SolutionCode,
  lesson5Hints,
  lesson5StarterCode,
} from "@/lib/courses/solana-nft-compression/challenges/lesson-5-proof-verification";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/solana-nft-compression/challenges/lesson-8-compression-checkpoint";
import {
  createDefaultSolanaNftCompressionLocalState,
  loadSolanaNftCompressionLocalState,
} from "@/lib/courses/solana-nft-compression/local-state";

describe("solana nft compression project helpers", () => {
  describe("merkle tree insert challenge (lesson 3)", () => {
    it("has valid test cases for merkle tree insertion", () => {
      expect(lesson3TestCases).toHaveLength(3);
      
      const testNames = lesson3TestCases.map((t) => t.name);
      
      expect(testNames).toContain("inserts leaf at index 0 and updates root");
      expect(testNames).toContain("inserts leaf at index 1 with sibling");
      expect(testNames).toContain("rejects out of bounds index");
    });

    it("has solution code with merkle tree logic", () => {
      expect(lesson3SolutionCode).toContain("insertLeafIntoMerkleTree");
      expect(lesson3SolutionCode).toContain("keccak256Hash");
      expect(lesson3SolutionCode).toContain("levels");
      expect(lesson3SolutionCode).toContain("newRoot");
      expect(lesson3SolutionCode).toContain("updatedNodes");
    });

    it("has starter code with tree placeholder", () => {
      expect(lesson3StarterCode).toContain("insertLeafIntoMerkleTree");
      expect(lesson3StarterCode).toContain("newRoot: tree.root");
    });

    it("has hints for merkle tree construction", () => {
      expect(lesson3Hints.length).toBeGreaterThan(0);
      expect(lesson3Hints.some((h) => h.includes("sibling"))).toBe(true);
      expect(lesson3Hints.some((h) => h.includes("parent"))).toBe(true);
    });
  });

  describe("proof verification challenge (lesson 5)", () => {
    it("has valid test cases for proof generation and verification", () => {
      expect(lesson5TestCases).toHaveLength(3);
      
      const testNames = lesson5TestCases.map((t) => t.name);
      
      expect(testNames).toContain("generates and verifies proof for leaf at index 0");
      expect(testNames).toContain("generates and verifies proof for leaf at index 2");
      expect(testNames).toContain("rejects out of bounds index");
    });

    it("has solution code with proof verification", () => {
      expect(lesson5SolutionCode).toContain("generateAndVerifyProof");
      expect(lesson5SolutionCode).toContain("proof");
      expect(lesson5SolutionCode).toContain("valid");
      expect(lesson5SolutionCode).toContain("recomputedRoot");
    });

    it("has starter code with proof placeholder", () => {
      expect(lesson5StarterCode).toContain("generateAndVerifyProof");
      expect(lesson5StarterCode).toContain("proof: []");
      expect(lesson5StarterCode).toContain("valid: false");
    });

    it("has hints for proof generation", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.includes("sibling"))).toBe(true);
      expect(lesson5Hints.some((h) => h.includes("verify"))).toBe(true);
    });
  });

  describe("compression checkpoint challenge (lesson 8)", () => {
    it("has valid test cases for compression checkpoint", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      
      for (const testCase of lesson8TestCases) {
        expect(testCase.name).toBeDefined();
        expect(testCase.input).toBeDefined();
        expect(testCase.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with compression logic", () => {
      expect(lesson8SolutionCode).toContain("simulateMintAndGenerateAudit");
    });

    it("has starter code with checkpoint placeholder", () => {
      expect(lesson8StarterCode).toContain("simulateMintAndGenerateAudit");
    });

    it("has hints for compression", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultSolanaNftCompressionLocalState();
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastAuditReportJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadSolanaNftCompressionLocalState("test-scope");
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastAuditReportJson).toBeNull();
    });
  });
});
