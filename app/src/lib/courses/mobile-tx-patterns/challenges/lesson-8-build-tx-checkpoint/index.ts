import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(buildTxCheckpoint(JSON.parse(input)));
}

function buildTxCheckpoint(data) {
  // Generate a transaction checkpoint/runbook report
  // data: { transactions: [{ id, type, status, lamports, sender, recipient, timestamp, retryCount }] }
  // Return: { totalTransactions, successRate, totalLamports, avgRetries, failedTxIds, topRecipients }
  return { totalTransactions: 0, successRate: 0, totalLamports: 0, avgRetries: 0, failedTxIds: [], topRecipients: [] };
}
`;

export const lesson8SolutionCode = `function run(input) {
  return JSON.stringify(buildTxCheckpoint(JSON.parse(input)));
}

function buildTxCheckpoint(data) {
  const { transactions } = data;
  const total = transactions.length;

  if (total === 0) {
    return {
      totalTransactions: 0,
      successRate: 0,
      totalLamports: 0,
      avgRetries: 0,
      failedTxIds: [],
      topRecipients: [],
    };
  }

  let successCount = 0;
  let totalLamports = 0;
  let totalRetries = 0;
  const failedTxIds = [];
  const recipientMap = {};

  for (const tx of transactions) {
    totalLamports += tx.lamports;
    totalRetries += tx.retryCount;

    if (tx.status === "success") {
      successCount++;
    } else {
      failedTxIds.push(tx.id);
    }

    // Aggregate recipients
    const r = tx.recipient;
    if (!recipientMap[r]) {
      recipientMap[r] = { address: r, count: 0, totalLamports: 0 };
    }
    recipientMap[r].count++;
    recipientMap[r].totalLamports += tx.lamports;
  }

  // Sort failed IDs alphabetically for deterministic output
  failedTxIds.sort((a, b) => a.localeCompare(b));

  // Sort recipients by count desc, then totalLamports desc
  const topRecipients = Object.values(recipientMap).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.totalLamports - a.totalLamports;
  });

  // Round successRate to 2 decimal places
  const successRate = Math.round((successCount / total) * 10000) / 10000;

  // Round avgRetries to 2 decimal places
  const avgRetries = Math.round((totalRetries / total) * 100) / 100;

  return {
    totalTransactions: total,
    successRate,
    totalLamports,
    avgRetries,
    failedTxIds,
    topRecipients,
  };
}
`;

export const lesson8Hints: string[] = [
  "Aggregate transaction data by iterating through the array once",
  "Sort failedTxIds alphabetically for deterministic output",
  "Sort topRecipients by count descending, then totalLamports descending",
  "Use Math.round for consistent decimal precision on rates",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates checkpoint for mixed transactions",
    input: JSON.stringify({
      transactions: [
        { id: "tx-001", type: "transfer", status: "success", lamports: 1000000, sender: "Alice111", recipient: "Bob222", timestamp: 1700000000, retryCount: 0 },
        { id: "tx-002", type: "transfer", status: "success", lamports: 2000000, sender: "Alice111", recipient: "Carol333", timestamp: 1700000010, retryCount: 1 },
        { id: "tx-003", type: "transfer", status: "failed", lamports: 500000, sender: "Bob222", recipient: "Bob222", timestamp: 1700000020, retryCount: 3 },
        { id: "tx-004", type: "transfer", status: "success", lamports: 750000, sender: "Carol333", recipient: "Bob222", timestamp: 1700000030, retryCount: 0 },
        { id: "tx-005", type: "transfer", status: "failed", lamports: 300000, sender: "Alice111", recipient: "Carol333", timestamp: 1700000040, retryCount: 2 },
      ],
    }),
    expectedOutput: JSON.stringify({
      totalTransactions: 5,
      successRate: 0.6,
      totalLamports: 4550000,
      avgRetries: 1.2,
      failedTxIds: ["tx-003", "tx-005"],
      topRecipients: [
        { address: "Carol333", count: 2, totalLamports: 2300000 },
        { address: "Bob222", count: 2, totalLamports: 1500000 },
      ],
    }),
  },
  {
    name: "generates checkpoint for all-success transactions",
    input: JSON.stringify({
      transactions: [
        { id: "tx-101", type: "transfer", status: "success", lamports: 5000000, sender: "Dave444", recipient: "Eve555", timestamp: 1700001000, retryCount: 0 },
        { id: "tx-102", type: "transfer", status: "success", lamports: 3000000, sender: "Dave444", recipient: "Eve555", timestamp: 1700001010, retryCount: 1 },
      ],
    }),
    expectedOutput: JSON.stringify({
      totalTransactions: 2,
      successRate: 1,
      totalLamports: 8000000,
      avgRetries: 0.5,
      failedTxIds: [],
      topRecipients: [
        { address: "Eve555", count: 2, totalLamports: 8000000 },
      ],
    }),
  },
];
