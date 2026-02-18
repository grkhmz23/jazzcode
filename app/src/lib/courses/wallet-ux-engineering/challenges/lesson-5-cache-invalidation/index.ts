import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = handleCacheInvalidation(input);
  return JSON.stringify(result);
}

function handleCacheInvalidation(input) {
  // TODO: Handle cache invalidation on account/network changes
  // Track cached data entries with tags (account, network, global)
  // Invalidate appropriate entries on events
  return { cacheEntries: [], invalidatedCount: 0, retainedCount: 0, events: [] };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = handleCacheInvalidation(input);
  return JSON.stringify(result);
}

function handleCacheInvalidation(input) {
  var entries = (input.initialCache || []).map(function(e) { return { key: e.key, tags: e.tags, valid: true }; });
  var events = input.events || [];
  var eventLog = [];
  var invalidatedTotal = 0;

  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var count = 0;
    for (var j = 0; j < entries.length; j++) {
      if (!entries[j].valid) continue;
      var shouldInvalidate = false;
      if (ev.type === "ACCOUNT_CHANGE" && entries[j].tags.indexOf("account") !== -1) shouldInvalidate = true;
      if (ev.type === "NETWORK_CHANGE" && (entries[j].tags.indexOf("network") !== -1 || entries[j].tags.indexOf("account") !== -1)) shouldInvalidate = true;
      if (ev.type === "DISCONNECT" && entries[j].tags.indexOf("global") === -1) shouldInvalidate = true;
      if (shouldInvalidate) { entries[j].valid = false; count++; }
    }
    invalidatedTotal += count;
    eventLog.push({ event: ev.type, invalidated: count });
  }

  var retained = entries.filter(function(e) { return e.valid; });
  var cacheEntries = entries.map(function(e) { return { key: e.key, valid: e.valid }; });

  return { cacheEntries: cacheEntries, invalidatedCount: invalidatedTotal, retainedCount: retained.length, events: eventLog };
}
`;

export const lesson5Hints: string[] = [
  "ACCOUNT_CHANGE invalidates entries tagged 'account'.",
  "NETWORK_CHANGE invalidates both 'network' and 'account' tagged entries.",
  "DISCONNECT invalidates all non-'global' entries.",
  "Track invalidation counts per event in the event log.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "account change invalidates account-tagged entries",
    input: JSON.stringify({
      initialCache: [
        { key: "balance", tags: ["account"] },
        { key: "tokenList", tags: ["account", "network"] },
        { key: "theme", tags: ["global"] },
      ],
      events: [{ type: "ACCOUNT_CHANGE" }],
    }),
    expectedOutput: '{"cacheEntries":[{"key":"balance","valid":false},{"key":"tokenList","valid":false},{"key":"theme","valid":true}],"invalidatedCount":2,"retainedCount":1,"events":[{"event":"ACCOUNT_CHANGE","invalidated":2}]}',
  },
  {
    name: "disconnect keeps only global entries",
    input: JSON.stringify({
      initialCache: [
        { key: "balance", tags: ["account"] },
        { key: "rpcEndpoint", tags: ["network"] },
        { key: "preferences", tags: ["global"] },
      ],
      events: [{ type: "DISCONNECT" }],
    }),
    expectedOutput: '{"cacheEntries":[{"key":"balance","valid":false},{"key":"rpcEndpoint","valid":false},{"key":"preferences","valid":true}],"invalidatedCount":2,"retainedCount":1,"events":[{"event":"DISCONNECT","invalidated":2}]}',
  },
];
