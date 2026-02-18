import { describe, expect, it } from "vitest";
import {
  lesson3TestCases,
  lesson3SolutionCode,
  lesson3Hints,
  lesson3StarterCode,
} from "@/lib/courses/solana-payments/challenges/lesson-3-payment-intent";
import {
  lesson5TestCases,
  lesson5SolutionCode,
  lesson5Hints,
  lesson5StarterCode,
} from "@/lib/courses/solana-payments/challenges/lesson-5-transfer-tx";
import {
  lesson8TestCases,
  lesson8SolutionCode,
  lesson8Hints,
  lesson8StarterCode,
} from "@/lib/courses/solana-payments/challenges/lesson-8-webhook-receipt";
import {
  createDefaultSolanaPaymentsLocalState,
  loadSolanaPaymentsLocalState,
  normalizePaymentIntent,
} from "@/lib/courses/solana-payments/local-state";

describe("solana payments project helpers", () => {
  describe("payment intent validation challenge (lesson 3)", () => {
    it("has valid test cases for payment intent validation", () => {
      expect(lesson3TestCases).toHaveLength(4);
      
      const testNames = lesson3TestCases.map((t) => t.name);
      
      expect(testNames).toContain("valid SOL payment intent");
      expect(testNames).toContain("invalid amount");
      expect(testNames).toContain("invalid base58 address");
      expect(testNames).toContain("uses provided idempotency key");
    });

    it("has solution code with validation logic", () => {
      expect(lesson3SolutionCode).toContain("validatePaymentIntent");
      expect(lesson3SolutionCode).toContain("isValidBase58");
      expect(lesson3SolutionCode).toContain("base58ToBytes");
      expect(lesson3SolutionCode).toContain("32"); // address length check
      expect(lesson3SolutionCode).toContain("idempotency");
    });

    it("has starter code with validation placeholder", () => {
      expect(lesson3StarterCode).toContain("validatePaymentIntent");
      expect(lesson3StarterCode).toContain("valid: false");
      expect(lesson3StarterCode).toContain("errors: []");
    });

    it("has hints for validation", () => {
      expect(lesson3Hints.length).toBeGreaterThan(0);
      expect(lesson3Hints.some((h) => h.includes("base58"))).toBe(true);
    });
  });

  describe("transfer transaction challenge (lesson 5)", () => {
    it("has valid test cases for transaction building", () => {
      expect(lesson5TestCases.length).toBeGreaterThan(0);
      
      for (const testCase of lesson5TestCases) {
        expect(testCase.name).toBeDefined();
        expect(testCase.input).toBeDefined();
        expect(testCase.expectedOutput).toBeDefined();
      }
    });

    it("has solution code with transaction building logic", () => {
      expect(lesson5SolutionCode).toContain("buildTransferTransaction");
      expect(lesson5SolutionCode).toContain("SystemProgram");
    });

    it("has starter code with transaction placeholder", () => {
      expect(lesson5StarterCode).toContain("buildTransferTransaction");
    });

    it("has hints for transaction building", () => {
      expect(lesson5Hints.length).toBeGreaterThan(0);
    });
  });

  describe("webhook verification challenge (lesson 8)", () => {
    it("has valid test cases for webhook verification", () => {
      expect(lesson8TestCases).toHaveLength(3);
      
      const testNames = lesson8TestCases.map((t) => t.name);
      
      expect(testNames).toContain("valid webhook signature generates receipt");
      expect(testNames).toContain("invalid signature fails verification");
      expect(testNames).toContain("expired timestamp fails verification");
    });

    it("has solution code with HMAC verification", () => {
      expect(lesson8SolutionCode).toContain("verifyWebhookAndGenerateReceipt");
      expect(lesson8SolutionCode).toContain("hmacSha256");
      expect(lesson8SolutionCode).toContain("constantTimeCompare");
      expect(lesson8SolutionCode).toContain("timestamp");
    });

    it("has starter code with verification placeholder", () => {
      expect(lesson8StarterCode).toContain("verifyWebhookAndGenerateReceipt");
      expect(lesson8StarterCode).toContain("verified: false");
      expect(lesson8StarterCode).toContain("receiptId");
    });

    it("has hints for HMAC verification", () => {
      expect(lesson8Hints.length).toBeGreaterThan(0);
      expect(lesson8Hints.some((h) => h.includes("HMAC") || h.includes("SHA256"))).toBe(true);
    });
  });

  describe("local state management", () => {
    it("creates default state with correct structure", () => {
      const state = createDefaultSolanaPaymentsLocalState();
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.paymentIntents).toEqual([]);
      expect(state.pendingTransactions).toEqual([]);
      expect(state.webhookReceipts).toEqual([]);
      expect(state.updatedAt).toBeDefined();
    });

    it("returns default state when localStorage is empty", () => {
      const state = loadSolanaPaymentsLocalState("test-scope");
      
      expect(state.version).toBe(1);
      expect(state.completedLessonIds).toEqual([]);
      expect(state.paymentIntents).toEqual([]);
    });

    it("normalizes valid payment intent", () => {
      const intent = normalizePaymentIntent({
        id: "pi_123",
        recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
        amount: "1.5",
        currency: "SOL",
        idempotencyKey: "key_123",
        status: "pending",
        createdAt: "2024-01-01T00:00:00Z",
      });
      
      expect(intent).not.toBeNull();
      expect(intent?.id).toBe("pi_123");
      expect(intent?.amount).toBe("1.5");
      expect(intent?.status).toBe("pending");
    });
  });
});
