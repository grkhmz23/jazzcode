import { describe, expect, it } from "vitest";
import {
  lesson4TestCases,
  lesson4SolutionCode,
  lesson4Hints,
  lesson4StarterCode,
} from "@/lib/courses/defi-swap-aggregator/challenges/lesson-4-swap-plan";
import {
  lesson5TestCases,
  lesson5SolutionCode,
  lesson5Hints,
  lesson5StarterCode,
} from "@/lib/courses/defi-swap-aggregator/challenges/lesson-5-swap-state-machine";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/defi-swap-aggregator/challenges/lesson-8-swap-report";
import {
  createDefaultDefiSwapAggregatorLocalState,
  loadDefiSwapAggregatorLocalState,
} from "@/lib/courses/defi-swap-aggregator/local-state";

describe("defi swap aggregator project helpers", () => {
  describe("swap plan challenge (lesson 4)", () => {
    it("has valid test cases for swap plan building", () => {
      expect(lesson4TestCases).toHaveLength(3);
      const testNames = lesson4TestCases.map((t) => t.name);
      expect(testNames).toContain("builds swap plan from SOL-USDC quote");
      expect(testNames).toContain("builds multi-hop swap plan");
      expect(testNames).toContain("handles zero slippage");
    });

    it("has solution code with swap plan logic", () => {
      expect(lesson4SolutionCode).toContain("buildSwapPlan");
      expect(lesson4SolutionCode).toContain("applySlippage");
      expect(lesson4SolutionCode).toContain("BigInt");
      expect(lesson4SolutionCode).toContain("routeLegs");
    });

    it("has starter code with swap plan placeholder", () => {
      expect(lesson4StarterCode).toContain("buildSwapPlan");
      expect(lesson4StarterCode).toContain("minOutAmount");
      expect(lesson4StarterCode).toContain("routeLegs: []");
    });

    it("has hints for swap plan construction", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.toLowerCase().includes("bigint"))).toBe(true);
    });
  });

  describe("state machine challenge (lesson 5)", () => {
    it("has valid test cases for state machine", () => {
      expect(lesson5TestCases).toHaveLength(3);
      const testNames = lesson5TestCases.map((t) => t.name);
      expect(testNames).toContain("happy path swap flow");
      expect(testNames).toContain("quote error with retry");
      expect(testNames).toContain("invalid transition produces error");
    });

    it("has solution code with state machine logic", () => {
      expect(lesson5SolutionCode).toContain("processSwapStateMachine");
      expect(lesson5SolutionCode).toContain("TRANSITIONS");
      expect(lesson5SolutionCode).toContain("quoting");
      expect(lesson5SolutionCode).toContain("confirming");
    });

    it("has starter code with state machine placeholder", () => {
      expect(lesson5StarterCode).toContain("processSwapStateMachine");
      expect(lesson5StarterCode).toContain("idle");
    });

    it("has hints for state machine design", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.toLowerCase().includes("transition"))).toBe(true);
    });
  });

  describe("swap report checkpoint (lesson 8)", () => {
    it("has valid test cases for swap report", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      for (const testCase of lesson8TestCases) {
        expect(testCase.name).toBeDefined();
        expect(testCase.input).toBeDefined();
        expect(testCase.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with report generation", () => {
      expect(lesson8SolutionCode).toContain("generateSwapRunReport");
    });

    it("has starter code with report placeholder", () => {
      expect(lesson8StarterCode).toContain("generateSwapRunReport");
    });

    it("has hints for report generation", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultDefiSwapAggregatorLocalState();
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastSwapPlanJson).toBeNull();
      expect(state.lastSwapReportJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadDefiSwapAggregatorLocalState("test-scope");
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastSwapPlanJson).toBeNull();
    });
  });
});
