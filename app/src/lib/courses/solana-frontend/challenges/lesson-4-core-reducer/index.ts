import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const ordered = [...input.events].sort((a, b) => (a.ts - b.ts) || a.id.localeCompare(b.id));
  const state = {
    owners: {},
    mints: {},
    eventsApplied: {},
    eventsCorrected: {},
    history: []
  };

  // Implement idempotent reducer + correction handling.
  for (const event of ordered) {
    if (state.eventsApplied[event.id]) continue;
    state.eventsApplied[event.id] = true;
  }

  return JSON.stringify(state);
}
`;

export const lesson4SolutionCode = `function run(input) {
  const ordered = [...input.events].sort((a, b) => (a.ts - b.ts) || a.id.localeCompare(b.id));
  const applied = {};
  const corrected = {};

  for (const event of ordered) {
    if (applied[event.id]) continue;
    applied[event.id] = true;
    if (event.type === "Correction") {
      corrected[event.replacesEventId] = true;
    }
  }

  const state = {
    owners: {},
    mints: {},
    eventsApplied: {},
    eventsCorrected: corrected,
    history: []
  };

  for (const event of ordered) {
    if (state.eventsApplied[event.id]) continue;
    state.eventsApplied[event.id] = true;

    if (event.type === "Correction") {
      state.history.push({ id: event.id, ts: event.ts, type: event.type, summary: "Correction for " + event.replacesEventId });
      continue;
    }

    if (corrected[event.id]) {
      state.history.push({ id: event.id, ts: event.ts, type: event.type, summary: "Corrected event skipped: " + event.id });
      continue;
    }

    if (event.type === "CreateMint") {
      state.mints[event.mint] = { symbol: event.symbol, decimals: event.decimals };
      state.history.push({ id: event.id, ts: event.ts, type: event.type, summary: "Created mint " + event.symbol });
      continue;
    }

    if (event.type === "CreateAta") {
      const owner = state.owners[event.owner] || { lamports: "0", balances: {}, atas: {} };
      owner.atas[event.mint] = event.ata;
      owner.balances[event.mint] = owner.balances[event.mint] || "0";
      state.owners[event.owner] = owner;
      state.history.push({ id: event.id, ts: event.ts, type: event.type, summary: "Created ATA " + event.ata });
      continue;
    }

    if (event.type === "MintTo") {
      for (const [owner, data] of Object.entries(state.owners)) {
        for (const [mint, ata] of Object.entries(data.atas)) {
          if (ata === event.toAta) {
            data.balances[mint] = (BigInt(data.balances[mint] || "0") + BigInt(event.amount)).toString();
            state.history.push({ id: event.id, ts: event.ts, type: event.type, summary: "Minted " + event.amount + " to " + owner });
          }
        }
      }
    }
  }

  return JSON.stringify(state);
}
`;

export const lesson4Hints: string[] = [
  "Sort by (ts, id) before applying events.",
  "If event id already exists in eventsApplied, skip it for idempotency.",
  "Corrections should mark replaced event ids and remove their effects from state transitions.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "handles idempotency and correction markers",
    input: JSON.stringify({
      events: [
        { type: "CreateMint", id: "m1", ts: 1, mint: "MINT_A", decimals: 6, symbol: "TOK" },
        { type: "CreateAta", id: "a1", ts: 2, owner: "OWNER", mint: "MINT_A", ata: "ATA_A" },
        { type: "MintTo", id: "x1", ts: 3, mint: "MINT_A", toAta: "ATA_A", amount: "100" },
        { type: "MintTo", id: "x1", ts: 3, mint: "MINT_A", toAta: "ATA_A", amount: "100" },
        { type: "Correction", id: "c1", ts: 4, replacesEventId: "x1" }
      ]
    }),
    expectedOutput:
      '{"owners":{"OWNER":{"lamports":"0","balances":{"MINT_A":"0"},"atas":{"MINT_A":"ATA_A"}}},"mints":{"MINT_A":{"symbol":"TOK","decimals":6}},"eventsApplied":{"m1":true,"a1":true,"x1":true,"c1":true},"eventsCorrected":{"x1":true},"history":[{"id":"m1","ts":1,"type":"CreateMint","summary":"Created mint TOK"},{"id":"a1","ts":2,"type":"CreateAta","summary":"Created ATA ATA_A"},{"id":"x1","ts":3,"type":"MintTo","summary":"Corrected event skipped: x1"},{"id":"c1","ts":4,"type":"Correction","summary":"Correction for x1"}]}'
  },
  {
    name: "unknown events are no-ops but remain idempotently tracked",
    input: JSON.stringify({
      events: [
        { type: "Unknown", id: "u1", ts: 10 }
      ]
    }),
    expectedOutput:
      '{"owners":{},"mints":{},"eventsApplied":{"u1":true},"eventsCorrected":{},"history":[]}'
  }
];
