import { describe, expect, it } from "vitest";
import {
  lesson4TestCases,
  lesson4SolutionCode,
  lesson4Hints,
  lesson4StarterCode,
} from "@/lib/courses/defi-clmm-liquidity/challenges/lesson-4-tick-math";
import {
  lesson5TestCases,
  lesson5SolutionCode,
  lesson5Hints,
  lesson5StarterCode,
} from "@/lib/courses/defi-clmm-liquidity/challenges/lesson-5-position-fees";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/defi-clmm-liquidity/challenges/lesson-8-position-report";
import {
  createDefaultDefiClmmLiquidityLocalState,
  loadDefiClmmLiquidityLocalState,
} from "@/lib/courses/defi-clmm-liquidity/local-state";

describe("defi clmm liquidity project helpers", () => {
  describe("tick math challenge (lesson 4)", () => {
    it("has valid test cases for tick math", () => {
      expect(lesson4TestCases).toHaveLength(3);
      const testNames = lesson4TestCases.map((t) => t.name);
      expect(testNames).toContain("computes tick math for tick 0");
      expect(testNames).toContain("computes tick math for positive tick");
      expect(testNames).toContain("computes tick math for negative tick");
    });

    it("has solution code with tick math logic", () => {
      expect(lesson4SolutionCode).toContain("computeTickMath");
      expect(lesson4SolutionCode).toContain("tickToPrice");
      expect(lesson4SolutionCode).toContain("sqrtPriceX64");
      expect(lesson4SolutionCode).toContain("alignToTickSpacing");
    });

    it("has starter code with tick math placeholder", () => {
      expect(lesson4StarterCode).toContain("computeTickMath");
      expect(lesson4StarterCode).toContain("tickIndex: 0");
    });

    it("has hints for tick math", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.includes("1.0001"))).toBe(true);
    });
  });

  describe("position fees challenge (lesson 5)", () => {
    it("has valid test cases for fee simulation", () => {
      expect(lesson5TestCases).toHaveLength(3);
      const testNames = lesson5TestCases.map((t) => t.name);
      expect(testNames).toContain("fully in-range position accrues fees");
      expect(testNames).toContain("partially out-of-range position");
      expect(testNames).toContain("fully out-of-range position earns no fees");
    });

    it("has solution code with fee simulation logic", () => {
      expect(lesson5SolutionCode).toContain("simulatePositionFees");
      expect(lesson5SolutionCode).toContain("in-range");
      expect(lesson5SolutionCode).toContain("feeAPR");
    });

    it("has starter code with fee placeholder", () => {
      expect(lesson5StarterCode).toContain("simulatePositionFees");
      expect(lesson5StarterCode).toContain("totalFeesToken0");
    });

    it("has hints for fee simulation", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.toLowerCase().includes("range"))).toBe(true);
    });
  });

  describe("position report checkpoint (lesson 8)", () => {
    it("has valid test cases for position report", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      for (const testCase of lesson8TestCases) {
        expect(testCase.name).toBeDefined();
        expect(testCase.input).toBeDefined();
        expect(testCase.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with report generation", () => {
      expect(lesson8SolutionCode).toContain("generatePositionReport");
    });

    it("has starter code with report placeholder", () => {
      expect(lesson8StarterCode).toContain("generatePositionReport");
    });

    it("has hints for report generation", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultDefiClmmLiquidityLocalState();
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastPositionReportJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadDefiClmmLiquidityLocalState("test-scope");
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastPositionReportJson).toBeNull();
    });
  });
});
