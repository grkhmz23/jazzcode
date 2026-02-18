import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const receipt = generatePOSReceipt(input);
  return JSON.stringify(receipt);
}

function generatePOSReceipt(input) {
  // TODO: Generate a POS receipt from payment data
  return { receiptId: "", merchant: "", amount: "0", currency: "SOL", recipient: "", reference: "", status: "", solanaPayUrl: "", timestamp: 0 };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const receipt = generatePOSReceipt(input);
  return JSON.stringify(receipt);
}

function generatePOSReceipt(input) {
  var payment = input.payment;
  var tracking = input.tracking;

  var url = "solana:" + payment.recipient + "?amount=" + payment.amount;
  if (payment.splToken) url += "&spl-token=" + payment.splToken;
  if (payment.reference) url += "&reference=" + payment.reference;
  if (payment.label) url += "&label=" + encodeURIComponent(payment.label);

  var receiptId = "rcpt_" + (payment.reference || "").slice(-8) + "_" + input.timestamp;

  return {
    receiptId: receiptId,
    merchant: payment.label || "",
    amount: payment.amount,
    currency: payment.splToken ? "SPL" : "SOL",
    recipient: payment.recipient,
    reference: payment.reference || "",
    status: tracking.status,
    solanaPayUrl: url,
    timestamp: input.timestamp,
  };
}
`;

export const lesson8Hints: string[] = [
  "Generate receiptId from the last 8 chars of reference + timestamp.",
  "Reconstruct the Solana Pay URL from payment data.",
  "Currency is 'SPL' if splToken is present, otherwise 'SOL'.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates SOL receipt",
    input: JSON.stringify({
      payment: { recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY", amount: "1.5", reference: "Ref1111111111111111111111111111111111111111", label: "Coffee Shop" },
      tracking: { status: "finalized" },
      timestamp: 1700000000,
    }),
    expectedOutput: '{"receiptId":"rcpt_11111111_1700000000","merchant":"Coffee Shop","amount":"1.5","currency":"SOL","recipient":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","reference":"Ref1111111111111111111111111111111111111111","status":"finalized","solanaPayUrl":"solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5&reference=Ref1111111111111111111111111111111111111111&label=Coffee%20Shop","timestamp":1700000000}',
  },
  {
    name: "generates SPL token receipt",
    input: JSON.stringify({
      payment: { recipient: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo", amount: "100", splToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", reference: "Ref3333333333333333333333333333333333333333", label: "Merch Store" },
      tracking: { status: "confirmed" },
      timestamp: 1700001000,
    }),
    expectedOutput: '{"receiptId":"rcpt_33333333_1700001000","merchant":"Merch Store","amount":"100","currency":"SPL","recipient":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","reference":"Ref3333333333333333333333333333333333333333","status":"confirmed","solanaPayUrl":"solana:8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo?amount=100&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref3333333333333333333333333333333333333333&label=Merch%20Store","timestamp":1700001000}',
  },
];
