import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4Hints, lesson4StarterCode } from "@/lib/courses/defi-lending-risk/challenges/lesson-4-interest-rates";
import { lesson5TestCases, lesson5SolutionCode, lesson5Hints, lesson5StarterCode } from "@/lib/courses/defi-lending-risk/challenges/lesson-5-health-factor";
import { lesson8TestCases, lesson8SolutionCode, lesson8Hints, lesson8StarterCode } from "@/lib/courses/defi-lending-risk/challenges/lesson-8-risk-report";
import { createDefaultDefiLendingRiskLocalState, loadDefiLendingRiskLocalState } from "@/lib/courses/defi-lending-risk/local-state";

describe("defi lending risk project helpers", () => {
  describe("interest rates challenge (lesson 4)", () => {
    it("has valid test cases", () => {
      expect(lesson4TestCases).toHaveLength(3);
      const names = lesson4TestCases.map((t) => t.name);
      expect(names).toContain("calculates rates below kink");
      expect(names).toContain("calculates rates above kink");
      expect(names).toContain("handles zero supply");
    });

    it("has solution code with interest rate logic", () => {
      expect(lesson4SolutionCode).toContain("computeInterestRates");
      expect(lesson4SolutionCode).toContain("utilizationRate");
      expect(lesson4SolutionCode).toContain("borrowRate");
      expect(lesson4SolutionCode).toContain("kink");
    });

    it("has starter code with placeholder", () => {
      expect(lesson4StarterCode).toContain("computeInterestRates");
      expect(lesson4StarterCode).toContain("utilizationRate");
    });

    it("has hints", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.toLowerCase().includes("utilization"))).toBe(true);
    });
  });

  describe("health factor challenge (lesson 5)", () => {
    it("has valid test cases", () => {
      expect(lesson5TestCases).toHaveLength(3);
      const names = lesson5TestCases.map((t) => t.name);
      expect(names).toContain("healthy position with buffer");
      expect(names).toContain("position at liquidation threshold");
      expect(names).toContain("no borrow returns max health factor");
    });

    it("has solution code with health factor logic", () => {
      expect(lesson5SolutionCode).toContain("computeHealthFactor");
      expect(lesson5SolutionCode).toContain("healthFactor");
      expect(lesson5SolutionCode).toContain("isLiquidatable");
    });

    it("has starter code with placeholder", () => {
      expect(lesson5StarterCode).toContain("computeHealthFactor");
      expect(lesson5StarterCode).toContain("healthFactor");
    });

    it("has hints", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.toLowerCase().includes("collateral"))).toBe(true);
    });
  });

  describe("risk report checkpoint (lesson 8)", () => {
    it("has valid test cases", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      for (const tc of lesson8TestCases) {
        expect(tc.name).toBeDefined();
        expect(tc.input).toBeDefined();
        expect(tc.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with report generation", () => {
      expect(lesson8SolutionCode).toContain("generateRiskReport");
    });

    it("has starter code with report placeholder", () => {
      expect(lesson8StarterCode).toContain("generateRiskReport");
    });

    it("has hints", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultDefiLendingRiskLocalState();
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastRiskReportJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadDefiLendingRiskLocalState("test-scope");
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastRiskReportJson).toBeNull();
    });
  });
});
