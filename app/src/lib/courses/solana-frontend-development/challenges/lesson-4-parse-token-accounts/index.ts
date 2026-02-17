import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const parsed = parseTokenAccounts(input);
  return JSON.stringify(parsed);
}

function parseTokenAccounts(payload) {
  return payload && payload.result && Array.isArray(payload.result.value)
    ? payload.result.value.map((entry) => ({ ata: entry.pubkey }))
    : [];
}
`;

export const lesson4SolutionCode = `function run(input) {
  const parsed = parseTokenAccounts(input);
  return JSON.stringify(parsed);
}

function parseTokenAccounts(payload) {
  if (!payload || !payload.result || !Array.isArray(payload.result.value)) {
    throw new Error("Token account payload missing result.value array");
  }

  const parsed = payload.result.value.map((entry) => {
    const ata = assertPubkey(entry.pubkey, "token account pubkey");
    const programId = assertPubkey(entry.account.owner, "token account owner programId");
    const info = entry.account.data && entry.account.data.parsed && entry.account.data.parsed.info;
    if (!info || !info.tokenAmount) {
      throw new Error("Missing parsed token info for " + ata);
    }

    const mint = assertPubkey(info.mint, "mint pubkey");
    const amountRaw = String(info.tokenAmount.amount || "");
    if (!/^\\d+$/.test(amountRaw)) {
      throw new Error("Invalid token amount for " + ata + ": " + amountRaw);
    }

    const decimals = info.tokenAmount.decimals;
    if (!Number.isInteger(decimals)) {
      throw new Error("Missing decimals for " + ata);
    }

    return {
      mint,
      ata,
      amountRaw,
      decimals,
      amountUi: formatUiAmount(amountRaw, decimals),
      programId,
    };
  });

  parsed.sort((a, b) => (a.mint === b.mint ? a.ata.localeCompare(b.ata) : a.mint.localeCompare(b.mint)));
  return parsed;
}

function assertPubkey(value, field) {
  if (typeof value !== "string" || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) {
    throw new Error("Invalid " + field + ": " + value);
  }
  return value;
}

function formatUiAmount(amountRaw, decimals) {
  const amount = BigInt(amountRaw);
  const base = BigInt(10) ** BigInt(decimals);
  const whole = amount / base;
  const frac = amount % base;

  if (decimals === 0) {
    return whole.toString();
  }

  return whole.toString() + "." + frac.toString().padStart(decimals, "0");
}
`;

export const lesson4Hints: string[] = [
  "Validate mint, ATA, and program ID as base58-like pubkeys before returning output.",
  "Require tokenAmount.decimals. Missing decimals should throw a deterministic error.",
  "Sort output by mint then ATA so JSON output remains stable across runs.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "parses and sorts token accounts",
    input: JSON.stringify({
      result: {
        value: [
          {
            pubkey: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
            account: {
              owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              data: {
                parsed: {
                  info: {
                    mint: "So11111111111111111111111111111111111111112",
                    tokenAmount: { amount: "1250000000", decimals: 9 },
                  },
                },
              },
            },
          },
          {
            pubkey: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
            account: {
              owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              data: {
                parsed: {
                  info: {
                    mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
                    tokenAmount: { amount: "5025000", decimals: 6 },
                  },
                },
              },
            },
          },
        ],
      },
    }),
    expectedOutput:
      '[{"mint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","ata":"FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1","amountRaw":"5025000","decimals":6,"amountUi":"5.025000","programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"mint":"So11111111111111111111111111111111111111112","ata":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","amountRaw":"1250000000","decimals":9,"amountUi":"1.250000000","programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}]',
  },
  {
    name: "errors when decimals are missing",
    input: JSON.stringify({
      result: {
        value: [
          {
            pubkey: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
            account: {
              owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              data: {
                parsed: {
                  info: {
                    mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
                    tokenAmount: { amount: "5025000" },
                  },
                },
              },
            },
          },
        ],
      },
    }),
    expectedOutput:
      "Error: Missing decimals for FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
  },
  {
    name: "errors on invalid mint pubkey",
    input: JSON.stringify({
      result: {
        value: [
          {
            pubkey: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
            account: {
              owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              data: {
                parsed: {
                  info: {
                    mint: "not-a-valid-pubkey",
                    tokenAmount: { amount: "1", decimals: 0 },
                  },
                },
              },
            },
          },
        ],
      },
    }),
    expectedOutput: "Error: Invalid mint pubkey: not-a-valid-pubkey",
  },
];
