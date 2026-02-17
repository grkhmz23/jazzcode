import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  const simulation = simulateDistribution(input);
  return JSON.stringify(simulation);
}

function simulateDistribution(input) {
  return {
    totalDistributed: "0",
    totalFees: "0",
    remaining: input.initialSupply,
    rows: [],
  };
}
`;

export const lesson6SolutionCode = `function run(input) {
  const simulation = simulateDistribution(input);
  return JSON.stringify(simulation);
}

function calculateFee(amount, feeBps, maxFee) {
  const raw = BigInt(amount);
  const fee = (raw * BigInt(feeBps)) / 10000n;
  const cap = BigInt(maxFee);
  return (fee > cap ? cap : fee).toString();
}

function simulateDistribution(input) {
  if (!/^\\d+$/.test(String(input.initialSupply))) {
    throw new Error("Invalid initialSupply: " + input.initialSupply);
  }

  let distributed = 0n;
  let totalFees = 0n;
  const rows = [];
  const recipients = Array.isArray(input.recipients) ? input.recipients : [];

  for (let i = 0; i < recipients.length; i += 1) {
    const amountText = recipients[i].amount;
    if (!/^\\d+$/.test(String(amountText))) {
      throw new Error("Invalid recipient " + i + " amount: " + amountText);
    }

    const fee = input.transferFee
      ? calculateFee(amountText, input.transferFee.feeBps, input.transferFee.maxFee)
      : "0";

    distributed += BigInt(amountText);
    totalFees += BigInt(fee);

    rows.push({
      owner: recipients[i].owner,
      amount: String(amountText),
      fee,
      netAmount: (BigInt(amountText) - BigInt(fee)).toString(),
    });
  }

  const supply = BigInt(input.initialSupply);
  if (distributed > supply) {
    throw new Error("Distribution exceeds initial supply");
  }

  return {
    rows,
    totalDistributed: distributed.toString(),
    totalFees: totalFees.toString(),
    remaining: (supply - distributed).toString(),
  };
}
`;

export const lesson6Hints: string[] = [
  "Transfer fee formula: fee = min(maxFee, floor(amount * feeBps / 10000)).",
  "Aggregate distributed and fee totals using BigInt to keep math exact.",
  "Fail when distributed amount exceeds initial supply.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "simulates capped transfer fees and remaining supply",
    input: JSON.stringify({
      initialSupply: "1000000",
      transferFee: { feeBps: 250, maxFee: "4000" },
      recipients: [
        { owner: "OWNER_1", amount: "300000" },
        { owner: "OWNER_2", amount: "500000" },
      ],
    }),
    expectedOutput:
      '{"rows":[{"owner":"OWNER_1","amount":"300000","fee":"4000","netAmount":"296000"},{"owner":"OWNER_2","amount":"500000","fee":"4000","netAmount":"496000"}],"totalDistributed":"800000","totalFees":"8000","remaining":"200000"}',
  },
  {
    name: "rejects oversubscribed distribution",
    input: JSON.stringify({
      initialSupply: "100",
      recipients: [{ owner: "OWNER_1", amount: "101" }],
    }),
    expectedOutput: "Error: Distribution exceeds initial supply",
  },
];
