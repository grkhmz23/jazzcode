import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateWalletUXReport(input);
  return JSON.stringify(report);
}

function generateWalletUXReport(input) {
  // TODO: Generate a wallet UX quality report
  return { connectionAttempts: 0, successRate: "0", avgConnectTimeMs: 0, accountSwitches: 0, networkSwitches: 0, cacheHitRate: "0", rpcHealthScore: "0", timestamp: 0 };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateWalletUXReport(input);
  return JSON.stringify(report);
}

function generateWalletUXReport(input) {
  var events = input.events || [];
  var cacheStats = input.cacheStats || { hits: 0, misses: 0 };
  var rpcChecks = input.rpcChecks || [];

  var connectionAttempts = 0;
  var successfulConnections = 0;
  var totalConnectTime = 0;
  var accountSwitches = 0;
  var networkSwitches = 0;

  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    if (ev.type === "CONNECT") connectionAttempts++;
    if (ev.type === "CONNECTED") { successfulConnections++; totalConnectTime += (ev.durationMs || 0); }
    if (ev.type === "ACCOUNT_CHANGE") accountSwitches++;
    if (ev.type === "NETWORK_CHANGE") networkSwitches++;
  }

  var successRate = connectionAttempts > 0 ? (successfulConnections / connectionAttempts * 100).toFixed(2) : "0.00";
  var avgConnect = successfulConnections > 0 ? Math.round(totalConnectTime / successfulConnections) : 0;

  var totalCacheOps = cacheStats.hits + cacheStats.misses;
  var cacheHitRate = totalCacheOps > 0 ? (cacheStats.hits / totalCacheOps * 100).toFixed(2) : "0.00";

  var healthyChecks = 0;
  for (var j = 0; j < rpcChecks.length; j++) { if (rpcChecks[j].healthy) healthyChecks++; }
  var rpcHealthScore = rpcChecks.length > 0 ? (healthyChecks / rpcChecks.length * 100).toFixed(2) : "0.00";

  return { connectionAttempts: connectionAttempts, successRate: successRate, avgConnectTimeMs: avgConnect, accountSwitches: accountSwitches, networkSwitches: networkSwitches, cacheHitRate: cacheHitRate, rpcHealthScore: rpcHealthScore, timestamp: input.timestamp };
}
`;

export const lesson8Hints: string[] = [
  "Count CONNECT events for attempts, CONNECTED for successes.",
  "Average connect time = total durationMs from CONNECTED events / count.",
  "Cache hit rate = hits / (hits + misses) * 100.",
  "RPC health = healthy checks / total checks * 100.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates wallet UX report",
    input: JSON.stringify({
      events: [
        { type: "CONNECT" }, { type: "CONNECTED", durationMs: 800 },
        { type: "ACCOUNT_CHANGE" },
        { type: "CONNECT" }, { type: "CONNECTED", durationMs: 600 },
        { type: "NETWORK_CHANGE" },
      ],
      cacheStats: { hits: 45, misses: 5 },
      rpcChecks: [{ healthy: true }, { healthy: true }, { healthy: false }, { healthy: true }],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"connectionAttempts":2,"successRate":"100.00","avgConnectTimeMs":700,"accountSwitches":1,"networkSwitches":1,"cacheHitRate":"90.00","rpcHealthScore":"75.00","timestamp":1700000000}',
  },
  {
    name: "handles failed connections",
    input: JSON.stringify({
      events: [{ type: "CONNECT" }, { type: "CONNECT" }, { type: "CONNECTED", durationMs: 1200 }],
      cacheStats: { hits: 0, misses: 10 },
      rpcChecks: [{ healthy: false }, { healthy: false }],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"connectionAttempts":2,"successRate":"50.00","avgConnectTimeMs":1200,"accountSwitches":0,"networkSwitches":0,"cacheHitRate":"0.00","rpcHealthScore":"0.00","timestamp":1700001000}',
  },
];
