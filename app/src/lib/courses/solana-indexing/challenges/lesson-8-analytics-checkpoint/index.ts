import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(generateAnalyticsSummary(input));
}

function generateAnalyticsSummary(data) {
  // Aggregate events into analytics summary
  return { wallets: {}, tokens: {}, totalEvents: 0 };
}
`;

export const lesson8SolutionCode = `function run(input) {
  return JSON.stringify(generateAnalyticsSummary(input));
}

function generateAnalyticsSummary(data) {
  const { events, timestamp } = data;
  const wallets = {};
  const tokens = {};
  
  for (const event of events) {
    // Wallet aggregation
    if (event.from) {
      if (!wallets[event.from]) {
        wallets[event.from] = { address: event.from, txCount: 0, volume: "0" };
      }
      wallets[event.from].txCount++;
      wallets[event.from].volume = addStrings(wallets[event.from].volume, event.amount);
    }
    if (event.to) {
      if (!wallets[event.to]) {
        wallets[event.to] = { address: event.to, txCount: 0, volume: "0" };
      }
      wallets[event.to].txCount++;
      wallets[event.to].volume = addStrings(wallets[event.to].volume, event.amount);
    }
  }
  
  // Convert to sorted arrays for deterministic output
  const walletList = Object.values(wallets).sort((a, b) => a.address.localeCompare(b.address));
  
  return {
    timestamp,
    totalEvents: events.length,
    uniqueWallets: walletList.length,
    wallets: walletList,
    generatedAt: timestamp,
  };
}

function addStrings(a, b) {
  return (BigInt(a) + BigInt(b)).toString();
}
`;

export const lesson8Hints: string[] = [
  "Aggregate events by wallet address",
  "Sum transaction counts and volumes",
  "Sort output arrays by address for determinism",
  "Include metadata like timestamps",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates analytics summary",
    input: JSON.stringify({
      timestamp: 1699900000,
      events: [
        { type: "transfer", from: "WalletA1111111111111111111111111111111111", to: "WalletB1111111111111111111111111111111111", amount: "1000000" },
        { type: "transfer", from: "WalletA1111111111111111111111111111111111", to: "WalletC1111111111111111111111111111111111", amount: "500000" },
        { type: "transfer", from: "WalletB1111111111111111111111111111111111", to: "WalletC1111111111111111111111111111111111", amount: "250000" },
      ],
    }),
    expectedOutput: '{"timestamp":1699900000,"totalEvents":3,"uniqueWallets":3,"wallets":[{"address":"WalletA1111111111111111111111111111111111","txCount":2,"volume":"1500000"},{"address":"WalletB1111111111111111111111111111111111","txCount":2,"volume":"1250000"},{"address":"WalletC1111111111111111111111111111111111","txCount":2,"volume":"750000"}],"generatedAt":1699900000}',
  },
  {
    name: "handles empty event stream deterministically",
    input: JSON.stringify({
      timestamp: 1699900100,
      events: [],
    }),
    expectedOutput: '{"timestamp":1699900100,"totalEvents":0,"uniqueWallets":0,"wallets":[],"generatedAt":1699900100}',
  },
];
