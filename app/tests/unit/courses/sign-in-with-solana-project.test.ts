import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4StarterCode, lesson4Hints } from "@/lib/courses/sign-in-with-solana/challenges/lesson-4-sign-in-input";
import { lesson5TestCases, lesson5SolutionCode, lesson5StarterCode, lesson5Hints } from "@/lib/courses/sign-in-with-solana/challenges/lesson-5-verify-sign-in";
import { lesson8TestCases, lesson8SolutionCode, lesson8StarterCode, lesson8Hints } from "@/lib/courses/sign-in-with-solana/challenges/lesson-8-auth-report";
import { createDefaultSignInWithSolanaLocalState, loadSignInWithSolanaLocalState } from "@/lib/courses/sign-in-with-solana/local-state";

describe("sign in with solana project helpers", () => {
  describe("sign-in input (lesson 4)", () => {
    it("has test cases", () => { expect(lesson4TestCases).toHaveLength(3); expect(lesson4TestCases.map(t=>t.name)).toContain("valid SIWS input"); });
    it("has solution", () => { expect(lesson4SolutionCode).toContain("createSignInInput"); });
    it("has starter", () => { expect(lesson4StarterCode).toContain("createSignInInput"); });
    it("has hints", () => { expect(lesson4Hints.length).toBeGreaterThan(0); });
  });
  describe("verify sign-in (lesson 5)", () => {
    it("has test cases", () => { expect(lesson5TestCases).toHaveLength(3); });
    it("has solution", () => { expect(lesson5SolutionCode).toContain("verifySignIn"); });
    it("has starter", () => { expect(lesson5StarterCode).toContain("verifySignIn"); });
    it("has hints", () => { expect(lesson5Hints.length).toBeGreaterThan(0); });
  });
  describe("auth report (lesson 8)", () => {
    it("has test cases", () => { expect(lesson8TestCases.length).toBeGreaterThan(0); });
    it("has solution", () => { expect(lesson8SolutionCode).toContain("generateAuthReport"); });
    it("has starter", () => { expect(lesson8StarterCode).toContain("generateAuthReport"); });
    it("has hints", () => { expect(lesson8Hints.length).toBeGreaterThan(0); });
  });
  describe("local state", () => {
    it("creates default", () => { const s = createDefaultSignInWithSolanaLocalState(); expect(s.version).toBe(1); expect(s.lastNonceRegistryJson).toBeNull(); });
    it("loads default", () => { const s = loadSignInWithSolanaLocalState("test"); expect(s.version).toBe(1); });
  });
});
