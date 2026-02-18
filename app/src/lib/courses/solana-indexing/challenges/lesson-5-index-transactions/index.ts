import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(indexTransactions(input));
}

function indexTransactions(data) {
  // Parse logs and extract transfer events
  // Return array of normalized Event objects
  return { events: [] };
}
`;

export const lesson5SolutionCode = `function run(input) {
  return JSON.stringify(indexTransactions(input));
}

function indexTransactions(data) {
  const events = [];
  const { logs, signature, timestamp } = data;
  
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    
    // Parse Transfer events
    if (log.includes("Transfer")) {
      const match = log.match(/Transfer\\s+(\\d+)\\s+from\\s+([A-Za-z0-9]+)\\s+to\\s+([A-Za-z0-9]+)/);
      if (match) {
        events.push({
          type: "transfer",
          signature,
          timestamp,
          amount: match[1],
          from: match[2],
          to: match[3],
          index: events.length,
        });
      }
    }
    
    // Parse Mint events
    if (log.includes("Mint")) {
      const match = log.match(/Mint\\s+(\\d+)\\s+to\\s+([A-Za-z0-9]+)/);
      if (match) {
        events.push({
          type: "mint",
          signature,
          timestamp,
          amount: match[1],
          to: match[2],
          index: events.length,
        });
      }
    }
  }
  
  // Sort events by index for deterministic output
  events.sort((a, b) => a.index - b.index);
  
  return { events, count: events.length, signature };
}
`;

export const lesson5Hints: string[] = [
  "Parse log entries to identify event types",
  "Extract fields using regex patterns",
  "Include transaction signature for traceability",
  "Sort events by index for deterministic output",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "indexes transfer events",
    input: JSON.stringify({
      signature: "5YU9gQ2e0c7f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f",
      timestamp: 1699900000,
      logs: [
        "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke",
        "Program log: Transfer 1000000 from Sender1111111111111111111111111111111111 to Receiver1111111111111111111111111111111",
        "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      ],
    }),
    expectedOutput: '{"events":[{"type":"transfer","signature":"5YU9gQ2e0c7f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f","timestamp":1699900000,"amount":"1000000","from":"Sender1111111111111111111111111111111111","to":"Receiver1111111111111111111111111111111","index":0}],"count":1,"signature":"5YU9gQ2e0c7f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f"}',
  },
  {
    name: "indexes multiple events",
    input: JSON.stringify({
      signature: "ABC123",
      timestamp: 1699900001,
      logs: [
        "Program log: Mint 5000000 to User111111111111111111111111111111111111",
        "Program log: Transfer 2500000 from User111111111111111111111111111111111111 to User222222222222222222222222222222222222",
      ],
    }),
    expectedOutput: '{"events":[{"type":"mint","signature":"ABC123","timestamp":1699900001,"amount":"5000000","to":"User111111111111111111111111111111111111","index":0},{"type":"transfer","signature":"ABC123","timestamp":1699900001,"amount":"2500000","from":"User111111111111111111111111111111111111","to":"User222222222222222222222222222222222222","index":1}],"count":2,"signature":"ABC123"}',
  },
];
