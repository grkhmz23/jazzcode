import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4Hints, lesson4StarterCode } from "@/lib/courses/defi-perps-risk-console/challenges/lesson-4-pnl-calc";
import { lesson5TestCases, lesson5SolutionCode, lesson5Hints, lesson5StarterCode } from "@/lib/courses/defi-perps-risk-console/challenges/lesson-5-funding-accrual";
import { lesson8TestCases, lesson8SolutionCode, lesson8Hints, lesson8StarterCode } from "@/lib/courses/defi-perps-risk-console/challenges/lesson-8-risk-console-report";
import { createDefaultDefiPerpsRiskConsoleLocalState, loadDefiPerpsRiskConsoleLocalState } from "@/lib/courses/defi-perps-risk-console/local-state";

describe("defi perps risk console project helpers", () => {
  describe("pnl calculation challenge (lesson 4)", () => {
    it("has valid test cases", () => {
      expect(lesson4TestCases).toHaveLength(3);
      const names = lesson4TestCases.map((t) => t.name);
      expect(names).toContain("long position with profit");
      expect(names).toContain("short position with profit");
      expect(names).toContain("long position with loss");
    });

    it("has solution code with PnL logic", () => {
      expect(lesson4SolutionCode).toContain("calculatePnL");
      expect(lesson4SolutionCode).toContain("unrealizedPnl");
      expect(lesson4SolutionCode).toContain("roePct");
    });

    it("has starter code with placeholder", () => {
      expect(lesson4StarterCode).toContain("calculatePnL");
      expect(lesson4StarterCode).toContain("unrealizedPnl");
    });

    it("has hints", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.toLowerCase().includes("pnl"))).toBe(true);
    });
  });

  describe("funding accrual challenge (lesson 5)", () => {
    it("has valid test cases", () => {
      expect(lesson5TestCases).toHaveLength(3);
      const names = lesson5TestCases.map((t) => t.name);
      expect(names).toContain("long pays positive funding");
      expect(names).toContain("short receives positive funding");
      expect(names).toContain("negative funding rate benefits longs");
    });

    it("has solution code with funding logic", () => {
      expect(lesson5SolutionCode).toContain("simulateFundingAccrual");
      expect(lesson5SolutionCode).toContain("totalFunding");
      expect(lesson5SolutionCode).toContain("fundingRates");
    });

    it("has starter code with placeholder", () => {
      expect(lesson5StarterCode).toContain("simulateFundingAccrual");
      expect(lesson5StarterCode).toContain("totalFundingPayment");
    });

    it("has hints", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.toLowerCase().includes("funding"))).toBe(true);
    });
  });

  describe("risk console report checkpoint (lesson 8)", () => {
    it("has valid test cases", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      for (const tc of lesson8TestCases) {
        expect(tc.name).toBeDefined();
        expect(tc.input).toBeDefined();
        expect(tc.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with report generation", () => {
      expect(lesson8SolutionCode).toContain("generateRiskConsoleReport");
    });

    it("has starter code with report placeholder", () => {
      expect(lesson8StarterCode).toContain("generateRiskConsoleReport");
    });

    it("has hints", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultDefiPerpsRiskConsoleLocalState();
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastRiskConsoleReportJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadDefiPerpsRiskConsoleLocalState("test-scope");
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastRiskConsoleReportJson).toBeNull();
    });
  });
});
