import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4Hints, lesson4StarterCode } from "@/lib/courses/solana-mobile-signing/challenges/lesson-4-sign-request";
import { lesson5TestCases, lesson5SolutionCode, lesson5Hints, lesson5StarterCode } from "@/lib/courses/solana-mobile-signing/challenges/lesson-5-session-persist";
import { lesson8TestCases, lesson8SolutionCode, lesson8Hints, lesson8StarterCode } from "@/lib/courses/solana-mobile-signing/challenges/lesson-8-session-report";
import { createDefaultSolanaMobileSigningLocalState, loadSolanaMobileSigningLocalState } from "@/lib/courses/solana-mobile-signing/local-state";

describe("solana mobile signing project helpers", () => {
  describe("sign request challenge (lesson 4)", () => {
    it("has valid test cases", () => {
      expect(lesson4TestCases).toHaveLength(3);
      const names = lesson4TestCases.map((t) => t.name);
      expect(names).toContain("valid transaction sign request");
      expect(names).toContain("valid message sign request");
      expect(names).toContain("invalid request with multiple errors");
    });
    it("has solution code with sign request logic", () => {
      expect(lesson4SolutionCode).toContain("buildSignRequest");
      expect(lesson4SolutionCode).toContain("isValidBase64");
      expect(lesson4SolutionCode).toContain("appIdentity");
    });
    it("has starter code with placeholder", () => {
      expect(lesson4StarterCode).toContain("buildSignRequest");
      expect(lesson4StarterCode).toContain("valid: false");
    });
    it("has hints", () => {
      expect(lesson4Hints.length).toBeGreaterThan(0);
      expect(lesson4Hints.some((h) => h.toLowerCase().includes("base64"))).toBe(true);
    });
  });

  describe("session persistence challenge (lesson 5)", () => {
    it("has valid test cases", () => {
      expect(lesson5TestCases).toHaveLength(3);
      const names = lesson5TestCases.map((t) => t.name);
      expect(names).toContain("save and restore session");
      expect(names).toContain("expired session fails restore");
      expect(names).toContain("clear session explicitly");
    });
    it("has solution code with persistence logic", () => {
      expect(lesson5SolutionCode).toContain("manageSessionPersistence");
      expect(lesson5SolutionCode).toContain("sessionActive");
      expect(lesson5SolutionCode).toContain("expiresAt");
    });
    it("has starter code with placeholder", () => {
      expect(lesson5StarterCode).toContain("manageSessionPersistence");
      expect(lesson5StarterCode).toContain("sessionActive: false");
    });
    it("has hints", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
    });
  });

  describe("session report checkpoint (lesson 8)", () => {
    it("has valid test cases", () => {
      expect(lesson8TestCases.length).toBeGreaterThan(0);
      for (const tc of lesson8TestCases) {
        expect(tc.name).toBeDefined();
        expect(tc.input).toBeDefined();
        expect(tc.expectedOutput).toBeDefined();
      }
    });
    it("has solution code with report generation", () => {
      expect(lesson8SolutionCode).toContain("generateSessionReport");
    });
    it("has starter code with report placeholder", () => {
      expect(lesson8StarterCode).toContain("generateSessionReport");
    });
    it("has hints", () => { expect(lesson8Hints.length).toBeGreaterThan(0); });
  });

  describe("local state management", () => {
    it("creates default state", () => {
      const state = createDefaultSolanaMobileSigningLocalState();
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.lastSessionJson).toBeNull();
      expect(state.lastRequestJson).toBeNull();
      expect(state.updatedAt).toBeDefined();
    });
    it("returns default when localStorage empty", () => {
      const state = loadSolanaMobileSigningLocalState("test-scope");
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
    });
  });
});
