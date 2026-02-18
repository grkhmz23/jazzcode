import { describe, expect, it } from "vitest";
import { lesson4TestCases, lesson4SolutionCode, lesson4StarterCode, lesson4Hints } from "@/lib/courses/solana-pay-commerce/challenges/lesson-4-encode-transfer";
import { lesson5TestCases, lesson5SolutionCode, lesson5StarterCode, lesson5Hints } from "@/lib/courses/solana-pay-commerce/challenges/lesson-5-reference-tracker";
import { lesson8TestCases, lesson8SolutionCode, lesson8StarterCode, lesson8Hints } from "@/lib/courses/solana-pay-commerce/challenges/lesson-8-pos-receipt";
import { createDefaultSolanaPayCommerceLocalState, loadSolanaPayCommerceLocalState } from "@/lib/courses/solana-pay-commerce/local-state";

describe("solana pay commerce project helpers", () => {
  describe("encode transfer challenge (lesson 4)", () => {
    it("has valid test cases", () => { expect(lesson4TestCases).toHaveLength(3); expect(lesson4TestCases.map(t => t.name)).toContain("encodes SOL transfer request"); });
    it("has solution with encoding logic", () => { expect(lesson4SolutionCode).toContain("encodeTransferRequest"); expect(lesson4SolutionCode).toContain("solana:"); });
    it("has starter with placeholder", () => { expect(lesson4StarterCode).toContain("encodeTransferRequest"); });
    it("has hints", () => { expect(lesson4Hints.length).toBeGreaterThan(0); });
  });
  describe("reference tracker (lesson 5)", () => {
    it("has valid test cases", () => { expect(lesson5TestCases).toHaveLength(2); });
    it("has solution with tracking logic", () => { expect(lesson5SolutionCode).toContain("trackReference"); expect(lesson5SolutionCode).toContain("finalized"); });
    it("has starter", () => { expect(lesson5StarterCode).toContain("trackReference"); });
    it("has hints", () => { expect(lesson5Hints.length).toBeGreaterThan(0); });
  });
  describe("POS receipt checkpoint (lesson 8)", () => {
    it("has valid test cases", () => { expect(lesson8TestCases.length).toBeGreaterThan(0); for (const tc of lesson8TestCases) { expect(tc.expectedOutput).toBeDefined(); } });
    it("has solution", () => { expect(lesson8SolutionCode).toContain("generatePOSReceipt"); });
    it("has starter", () => { expect(lesson8StarterCode).toContain("generatePOSReceipt"); });
    it("has hints", () => { expect(lesson8Hints.length).toBeGreaterThan(0); });
  });
  describe("local state", () => {
    it("creates default", () => { const s = createDefaultSolanaPayCommerceLocalState(); expect(s.version).toBe(1); expect(s.lastEncodedUrl).toBeNull(); expect(s.lastReceiptJson).toBeNull(); });
    it("loads default when empty", () => { const s = loadSolanaPayCommerceLocalState("test"); expect(s.version).toBe(1); });
  });
});
