import { describe, expect, it } from "vitest";
import {
  lesson3TestCases,
  lesson3SolutionCode,
  lesson3Hints,
  lesson3StarterCode,
} from "@/lib/courses/solana-performance/challenges/lesson-3-cost-model";
import {
  lesson5TestCases,
  lesson5SolutionCode,
  lesson5Hints,
  lesson5StarterCode,
} from "@/lib/courses/solana-performance/challenges/lesson-5-optimized-layout";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/solana-performance/challenges/lesson-8-perf-checkpoint";
import {
  createDefaultSolanaPerformanceLocalState,
  loadSolanaPerformanceLocalState,
  addBenchmarkResult,
} from "@/lib/courses/solana-performance/local-state";

describe("solana performance project helpers", () => {
  describe("cost estimation challenge (lesson 3)", () => {
    it("has valid test cases for compute unit estimation", () => {
      expect(lesson3TestCases).toHaveLength(3);
      
      const testNames = lesson3TestCases.map((t) => t.name);
      
      expect(testNames).toContain("estimates compute units for simple transfer");
      expect(testNames).toContain("estimates compute units for complex instruction");
      expect(testNames).toContain("estimates compute units for minimal transaction");
    });

    it("has solution code with cost estimation logic", () => {
      expect(lesson3SolutionCode).toContain("estimateComputeUnits");
      expect(lesson3SolutionCode).toContain("BASE_CU");
      expect(lesson3SolutionCode).toContain("PER_ACCOUNT_CU");
      expect(lesson3SolutionCode).toContain("PER_BYTE_CU");
      expect(lesson3SolutionCode).toContain("total");
    });

    it("has starter code with cost placeholder", () => {
      expect(lesson3StarterCode).toContain("estimateComputeUnits");
      expect(lesson3StarterCode).toContain("baseCost: 0");
      expect(lesson3StarterCode).toContain("accountsCost: 0");
      expect(lesson3StarterCode).toContain("dataCost: 0");
      expect(lesson3StarterCode).toContain("total: 0");
    });

    it("has hints for cost estimation", () => {
      expect(lesson3Hints.length).toBeGreaterThan(0);
      expect(lesson3Hints.some((h) => h.includes("5000") || h.includes("compute"))).toBe(true);
    });
  });

  describe("optimized layout challenge (lesson 5)", () => {
    it("has valid test cases for layout optimization", () => {
      expect(lesson5TestCases).toHaveLength(2);
      
      const testNames = lesson5TestCases.map((t) => t.name);
      
      expect(testNames).toContain("optimizes user account layout");
      expect(testNames).toContain("optimizes token account with packing suggestions");
    });

    it("has solution code with layout optimization", () => {
      expect(lesson5SolutionCode).toContain("optimizeAccountLayout");
      expect(lesson5SolutionCode).toContain("optimizedSize");
      expect(lesson5SolutionCode).toContain("bytesSaved");
      expect(lesson5SolutionCode).toContain("fieldOrder");
      expect(lesson5SolutionCode).toContain("recommendations");
    });

    it("has starter code with layout placeholder", () => {
      expect(lesson5StarterCode).toContain("optimizeAccountLayout");
      expect(lesson5StarterCode).toContain("originalSize");
      expect(lesson5StarterCode).toContain("optimizedSize");
      expect(lesson5StarterCode).toContain("bytesSaved: 0");
    });

    it("has hints for layout optimization", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
      expect(lesson5Hints.some((h) => h.includes("sort") || h.includes("pack"))).toBe(true);
    });
  });

  describe("performance checkpoint challenge (lesson 8)", () => {
    it("has valid test cases for performance checkpoint", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      
      for (const testCase of lesson8TestCases) {
        expect(testCase.name).toBeDefined();
        expect(testCase.input).toBeDefined();
        expect(testCase.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with performance logic", () => {
      expect(lesson8SolutionCode).toContain("generatePerformanceReport");
    });

    it("has starter code with performance placeholder", () => {
      expect(lesson8StarterCode).toContain("generatePerformanceReport");
    });

    it("has hints for performance", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultSolanaPerformanceLocalState();
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastPerfReportJson).toBeNull();
      expect(state.benchmarkResults).toEqual([]);
      expect(state.optimizationHistory).toEqual([]);
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadSolanaPerformanceLocalState("test-scope");
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.benchmarkResults).toEqual([]);
    });
  });
});
