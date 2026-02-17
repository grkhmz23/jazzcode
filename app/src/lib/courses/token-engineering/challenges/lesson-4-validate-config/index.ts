import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const validated = validateConfig(input.config);
  const mint = derivePseudoAddress("mint:" + validated.symbol + ":" + validated.mintAuthority);
  const atas = (validated.recipients || []).map((recipient) => ({
    owner: recipient.owner,
    ata: derivePseudoAddress("ata:" + mint + ":" + recipient.owner),
  }));

  return JSON.stringify({ validated, mint, atas });
}

function validateConfig(config) {
  return config;
}

function derivePseudoAddress(seed) {
  return "addr_" + seed.length;
}
`;

export const lesson4SolutionCode = `function run(input) {
  const validated = validateConfig(input.config);
  const mint = derivePseudoAddress("mint:" + validated.symbol + ":" + validated.mintAuthority);
  const atas = (validated.recipients || []).map((recipient) => ({
    owner: recipient.owner,
    ata: derivePseudoAddress("ata:" + mint + ":" + recipient.owner),
  }));

  return JSON.stringify({
    validated,
    mint,
    atas,
  });
}

function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Token config must be an object");
  }
  if (!Number.isInteger(config.decimals) || config.decimals < 0 || config.decimals > 9) {
    throw new Error("decimals out of range: " + config.decimals);
  }
  if (!/^\\d+$/.test(String(config.initialSupply))) {
    throw new Error("Invalid initialSupply: " + config.initialSupply);
  }

  const recipients = Array.isArray(config.recipients) ? config.recipients : [];
  let total = 0n;
  for (let i = 0; i < recipients.length; i += 1) {
    const amount = recipients[i].amount;
    if (!/^\\d+$/.test(String(amount))) {
      throw new Error("Invalid recipient " + i + " amount: " + amount);
    }
    total += BigInt(amount);
  }

  const supply = BigInt(config.initialSupply);
  if (total > supply) {
    throw new Error("recipients total exceeds initialSupply");
  }

  if (config.extensions && config.extensions.transferFee) {
    const fee = config.extensions.transferFee;
    if (!Number.isInteger(fee.feeBps) || fee.feeBps < 0 || fee.feeBps > 10000) {
      throw new Error("transferFee.feeBps out of range: " + fee.feeBps);
    }
    if (!/^\\d+$/.test(String(fee.maxFee))) {
      throw new Error("Invalid transferFee.maxFee: " + fee.maxFee);
    }
  }

  if (config.extensions && config.extensions.defaultAccountState) {
    const state = config.extensions.defaultAccountState.state;
    if (state !== "initialized" && state !== "frozen") {
      throw new Error("Invalid defaultAccountState.state: " + state);
    }
  }

  return {
    name: config.name,
    symbol: config.symbol,
    decimals: config.decimals,
    mintAuthority: config.mintAuthority,
    initialSupply: String(config.initialSupply),
    recipients,
    extensions: config.extensions || {},
  };
}

function derivePseudoAddress(seed) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  let value = BigInt(hash);
  let out = "";
  while (out.length < 32) {
    const idx = Number(value % 58n);
    out = alphabet[idx] + out;
    value = value / 58n + 17n;
  }
  return out.slice(0, 32);
}
`;

export const lesson4Hints: string[] = [
  "Validate decimal bounds, u64-like numeric strings, and recipient totals before derivation.",
  "Use one deterministic seed format for mint and one for ATA derivation.",
  "Keep output key order stable so checkpoint tests are reproducible.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "validates config and derives deterministic mint+atas",
    input: JSON.stringify({
      config: {
        name: "Jazz USD",
        symbol: "JUSD",
        decimals: 6,
        mintAuthority: "AUTH_A",
        initialSupply: "1000000",
        extensions: {
          transferFee: {
            authority: "AUTH_A",
            feeBps: 100,
            maxFee: "2500",
          },
        },
        recipients: [
          { owner: "OWNER_1", amount: "250000" },
          { owner: "OWNER_2", amount: "100000" },
        ],
      },
    }),
    expectedOutput:
      '{"validated":{"name":"Jazz USD","symbol":"JUSD","decimals":6,"mintAuthority":"AUTH_A","initialSupply":"1000000","recipients":[{"owner":"OWNER_1","amount":"250000"},{"owner":"OWNER_2","amount":"100000"}],"extensions":{"transferFee":{"authority":"AUTH_A","feeBps":100,"maxFee":"2500"}}},"mint":"1111111111111111111111111163m8mc","atas":[{"owner":"OWNER_1","ata":"11111111111111111111111111A8d2w4"},{"owner":"OWNER_2","ata":"11111111111111111111111111A8d2w5"}]}',
  },
  {
    name: "rejects decimals out of range",
    input: JSON.stringify({
      config: {
        name: "Bad",
        symbol: "BAD",
        decimals: 12,
        mintAuthority: "AUTH_A",
        initialSupply: "1",
        extensions: {},
      },
    }),
    expectedOutput: "Error: decimals out of range: 12",
  },
];
