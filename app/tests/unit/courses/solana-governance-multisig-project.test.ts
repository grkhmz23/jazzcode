import { describe, expect, it } from "vitest";
import {
  lesson4TestCases,
  lesson4SolutionCode,
  lesson4Hints,
  lesson4StarterCode,
} from "@/lib/courses/solana-governance-multisig/challenges/lesson-4-quorum-voting";
import {
  lesson6TestCases,
  lesson6SolutionCode,
  lesson6Hints,
  lesson6StarterCode,
} from "@/lib/courses/solana-governance-multisig/challenges/lesson-6-multisig-builder";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/solana-governance-multisig/challenges/lesson-8-treasury-execution";
import {
  createDefaultSolanaGovernanceMultisigLocalState,
  loadSolanaGovernanceMultisigLocalState,
} from "@/lib/courses/solana-governance-multisig/local-state";

describe("solana governance multisig project helpers", () => {
  describe("quorum voting challenge (lesson 4)", () => {
    it("has valid test cases for quorum voting", () => {
      expect(lesson4TestCases).toHaveLength(5);
      
      const testNames = lesson4TestCases.map((t) => t.name);
      
      expect(testNames).toContain("proposal passes with quorum and support met");
      expect(testNames).toContain("proposal fails when quorum not met");
      expect(testNames).toContain("proposal fails when support threshold not met");
      expect(testNames).toContain("proposal fails with only abstain votes");
      expect(testNames).toContain("empty votes result in quorum not met");
    });

    it("has solution code with voting logic", () => {
      expect(lesson4SolutionCode).toContain("calculateVoteResult");
      expect(lesson4SolutionCode).toContain("quorumMet");
      expect(lesson4SolutionCode).toContain("passed");
      expect(lesson4SolutionCode).toContain("forWeight");
      expect(lesson4SolutionCode).toContain("againstWeight");
      expect(lesson4SolutionCode).toContain("abstainWeight");
    });

    it("has starter code with voting placeholder", () => {
      expect(lesson4StarterCode).toContain("calculateVoteResult");
      expect(lesson4StarterCode).toContain("totalVotesCast: 0");
      expect(lesson4StarterCode).toContain("quorumMet: false");
      expect(lesson4StarterCode).toContain("passed: false");
    });

    it("has hints for voting calculation", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.includes("quorum"))).toBe(true);
      expect(lesson4Hints.some((h) => h.includes("weight"))).toBe(true);
    });
  });

  describe("multisig builder challenge (lesson 6)", () => {
    it("has valid test cases for multisig operations", () => {
      expect(lesson6TestCases).toHaveLength(5);
      
      const testNames = lesson6TestCases.map((t) => t.name);
      
      expect(testNames).toContain("proposal approved when threshold met");
      expect(testNames).toContain("proposal remains pending below threshold");
      expect(testNames).toContain("approval can be revoked");
      expect(testNames).toContain("proposal rejected when all signers acted but threshold not met");
      expect(testNames).toContain("double approval only counts once");
    });

    it("has solution code with multisig logic", () => {
      expect(lesson6SolutionCode).toContain("processMultisigAction");
      expect(lesson6SolutionCode).toContain("threshold");
      expect(lesson6SolutionCode).toContain("approved");
      expect(lesson6SolutionCode).toContain("revoke");
      expect(lesson6SolutionCode).toContain("canExecute");
    });

    it("has starter code with multisig placeholder", () => {
      expect(lesson6StarterCode).toContain("processMultisigAction");
      expect(lesson6StarterCode).toContain("threshold");
      expect(lesson6StarterCode).toContain("approvedCount: 0");
      expect(lesson6StarterCode).toContain("canExecute: false");
    });

    it("has hints for multisig operations", () => {
      expect(lesson6Hints.length).toBeGreaterThan(0);
      expect(lesson6Hints.some((h) => h.includes("threshold"))).toBe(true);
      expect(lesson6Hints.some((h) => h.includes("approve"))).toBe(true);
    });
  });

  describe("treasury execution challenge (lesson 8)", () => {
    it("has valid test cases for treasury execution", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      
      for (const testCase of lesson8TestCases) {
        expect(testCase.name).toBeDefined();
        expect(testCase.input).toBeDefined();
        expect(testCase.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with execution logic", () => {
      expect(lesson8SolutionCode).toContain("validateAndExecuteTreasuryProposal");
    });

    it("has starter code with execution placeholder", () => {
      expect(lesson8StarterCode).toContain("validateAndExecuteTreasuryProposal");
    });

    it("has hints for execution", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultSolanaGovernanceMultisigLocalState();
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastProposalStateJson).toBeNull();
      expect(state.lastExecutionTraceJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadSolanaGovernanceMultisigLocalState("test-scope");
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastProposalStateJson).toBeNull();
      expect(state.lastExecutionTraceJson).toBeNull();
    });
  });
});
