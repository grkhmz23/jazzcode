export interface CounterInstructionMeta {
  name: "initializeCounter" | "incrementCounter";
  discriminator: readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

export interface CounterAccountLayout {
  discriminator: readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  authorityOffset: number;
  countOffset: number;
  bumpOffset: number;
  totalSpan: number;
}

// Anchor uses 8-byte discriminators from SHA256("global:<name>") / SHA256("account:<name>").
// These values are precomputed for deterministic client/unit-test usage.
export const COUNTER_IDL = {
  programName: "anchor_counter_v2",
  instructions: {
    initializeCounter: {
      name: "initializeCounter",
      discriminator: [133, 175, 240, 117, 169, 188, 241, 192] as const,
    } satisfies CounterInstructionMeta,
    incrementCounter: {
      name: "incrementCounter",
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33] as const,
    } satisfies CounterInstructionMeta,
  },
  accounts: {
    counter: {
      discriminator: [255, 176, 4, 245, 188, 253, 124, 25] as const,
      authorityOffset: 8,
      countOffset: 40,
      bumpOffset: 48,
      totalSpan: 49,
    } satisfies CounterAccountLayout,
  },
} as const;

export type CounterIdl = typeof COUNTER_IDL;
