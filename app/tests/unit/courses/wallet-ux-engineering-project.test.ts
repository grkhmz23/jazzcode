import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4StarterCode, lesson4Hints } from "@/lib/courses/wallet-ux-engineering/challenges/lesson-4-connection-state";
import { lesson5TestCases, lesson5SolutionCode, lesson5StarterCode, lesson5Hints } from "@/lib/courses/wallet-ux-engineering/challenges/lesson-5-cache-invalidation";
import { lesson8TestCases, lesson8SolutionCode, lesson8StarterCode, lesson8Hints } from "@/lib/courses/wallet-ux-engineering/challenges/lesson-8-wallet-ux-report";
import { createDefaultWalletUxEngineeringLocalState, loadWalletUxEngineeringLocalState } from "@/lib/courses/wallet-ux-engineering/local-state";

describe("wallet ux engineering project helpers", () => {
  describe("connection state (lesson 4)", () => {
    it("has test cases", () => {
      expect(lesson4TestCases).toHaveLength(3);
      expect(lesson4TestCases.map(t => t.name)).toContain("happy path connection flow");
    });
    it("has solution", () => {
      expect(lesson4SolutionCode).toContain("processConnectionEvents");
      expect(lesson4SolutionCode).toContain("TRANSITIONS");
    });
    it("has starter", () => {
      expect(lesson4StarterCode).toContain("processConnectionEvents");
    });
    it("has hints", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
    });
  });

  describe("cache invalidation (lesson 5)", () => {
    it("has test cases", () => {
      expect(lesson5TestCases).toHaveLength(2);
    });
    it("has solution", () => {
      expect(lesson5SolutionCode).toContain("handleCacheInvalidation");
    });
    it("has starter", () => {
      expect(lesson5StarterCode).toContain("handleCacheInvalidation");
    });
    it("has hints", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
    });
  });

  describe("UX report (lesson 8)", () => {
    it("has test cases", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
    });
    it("has solution", () => {
      expect(lesson8SolutionCode).toContain("generateWalletUXReport");
    });
    it("has starter", () => {
      expect(lesson8StarterCode).toContain("generateWalletUXReport");
    });
    it("has hints", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
    });
  });

  describe("local state", () => {
    it("creates default", () => {
      const s = createDefaultWalletUxEngineeringLocalState();
      expect(s.version).toBe(1);
      expect(s.lastConnectionStateJson).toBeNull();
      expect(s.lastSelectedNetwork).toBeNull();
    });
    it("loads default", () => {
      const s = loadWalletUxEngineeringLocalState("test");
      expect(s.version).toBe(1);
    });
  });
});
