import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4Hints, lesson4StarterCode } from "@/lib/courses/defi-tx-optimizer/challenges/lesson-4-tx-plan";
import { lesson5TestCases, lesson5SolutionCode, lesson5Hints, lesson5StarterCode } from "@/lib/courses/defi-tx-optimizer/challenges/lesson-5-lut-planner";
import { lesson8TestCases, lesson8SolutionCode, lesson8Hints, lesson8StarterCode } from "@/lib/courses/defi-tx-optimizer/challenges/lesson-8-send-strategy";
import { createDefaultDefiTxOptimizerLocalState, loadDefiTxOptimizerLocalState } from "@/lib/courses/defi-tx-optimizer/local-state";

describe("defi tx optimizer project helpers", () => {
  describe("tx plan challenge (lesson 4)", () => {
    it("has valid test cases", () => {
      expect(lesson4TestCases).toHaveLength(3);
      const names = lesson4TestCases.map((t) => t.name);
      expect(names).toContain("simple transfer plan");
      expect(names).toContain("complex DeFi swap plan");
      expect(names).toContain("large tx requiring versioned format");
    });

    it("has solution code with tx plan logic", () => {
      expect(lesson4SolutionCode).toContain("buildTxPlan");
      expect(lesson4SolutionCode).toContain("computeUnitLimit");
      expect(lesson4SolutionCode).toContain("estimatedFeeLamports");
    });

    it("has starter code with placeholder", () => {
      expect(lesson4StarterCode).toContain("buildTxPlan");
      expect(lesson4StarterCode).toContain("computeUnitLimit: 0");
    });

    it("has hints", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.toLowerCase().includes("compute"))).toBe(true);
    });
  });

  describe("lut planner challenge (lesson 5)", () => {
    it("has valid test cases", () => {
      expect(lesson5TestCases).toHaveLength(3);
      const names = lesson5TestCases.map((t) => t.name);
      expect(names).toContain("small tx uses legacy");
      expect(names).toContain("large tx benefits from existing LUT");
      expect(names).toContain("very large tx needs new LUT");
    });

    it("has solution code with LUT logic", () => {
      expect(lesson5SolutionCode).toContain("planLutUsage");
      expect(lesson5SolutionCode).toContain("keysInLut");
      expect(lesson5SolutionCode).toContain("recommendation");
    });

    it("has starter code with placeholder", () => {
      expect(lesson5StarterCode).toContain("planLutUsage");
      expect(lesson5StarterCode).toContain("totalUniqueKeys: 0");
    });

    it("has hints", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.includes("32") || h.includes("bytes"))).toBe(true);
    });
  });

  describe("send strategy checkpoint (lesson 8)", () => {
    it("has valid test cases", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      for (const tc of lesson8TestCases) {
        expect(tc.name).toBeDefined();
        expect(tc.input).toBeDefined();
        expect(tc.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with report generation", () => {
      expect(lesson8SolutionCode).toContain("generateSendStrategyReport");
    });

    it("has starter code with report placeholder", () => {
      expect(lesson8StarterCode).toContain("generateSendStrategyReport");
    });

    it("has hints", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultDefiTxOptimizerLocalState();
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastSendStrategyJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadDefiTxOptimizerLocalState("test-scope");
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastSendStrategyJson).toBeNull();
    });
  });
});
