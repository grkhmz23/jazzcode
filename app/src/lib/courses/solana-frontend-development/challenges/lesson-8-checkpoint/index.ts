import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const tokenAccounts = parseTokenAccounts(input.tokenAccountsPayload);
  const selected = tokenAccounts[0];

  const solTransferPlan = buildSolTransferPlan({
    from: input.owner,
    to: input.solTransferTo,
    amountSol: input.solAmount,
    recentBlockhash: input.recentBlockhash,
  });

  const splTransferPlan = buildSplTransferPlan({
    sourceAta: selected.ata,
    destinationAta: input.splDestinationAta,
    owner: input.owner,
    mint: selected.mint,
    amountRaw: input.splAmountRaw,
    decimals: selected.decimals,
    expectedDecimals: selected.decimals,
    recentBlockhash: input.recentBlockhash,
  });

  return JSON.stringify({
    owner: input.owner,
    tokenAccounts,
    solTransferPlan,
    splTransferPlan,
  });
}

function parseTokenAccounts(payload) {
  return [];
}

function buildSolTransferPlan(input) {
  return { feePayer: input.from, recentBlockhash: input.recentBlockhash, instructions: [] };
}

function buildSplTransferPlan(input) {
  return { feePayer: input.owner, recentBlockhash: input.recentBlockhash, instructions: [] };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const tokenAccounts = parseTokenAccounts(input.tokenAccountsPayload);
  const selected = tokenAccounts[0];

  const solTransferPlan = buildSolTransferPlan({
    from: input.owner,
    to: input.solTransferTo,
    amountSol: input.solAmount,
    recentBlockhash: input.recentBlockhash,
  });

  const splTransferPlan = buildSplTransferPlan({
    sourceAta: selected.ata,
    destinationAta: input.splDestinationAta,
    owner: input.owner,
    mint: selected.mint,
    amountRaw: input.splAmountRaw,
    decimals: selected.decimals,
    expectedDecimals: selected.decimals,
    recentBlockhash: input.recentBlockhash,
  });

  return JSON.stringify({
    owner: input.owner,
    tokenAccounts,
    solTransferPlan,
    splTransferPlan,
  });
}

function parseTokenAccounts(payload) {
  if (!payload || !payload.result || !Array.isArray(payload.result.value)) {
    throw new Error("Token account payload missing result.value array");
  }

  const parsed = payload.result.value.map((entry) => {
    const info = entry.account.data.parsed.info;
    const amountRaw = String(info.tokenAmount.amount);
    const decimals = info.tokenAmount.decimals;
    return {
      mint: info.mint,
      ata: entry.pubkey,
      amountRaw,
      decimals,
      amountUi: formatUi(amountRaw, decimals),
      programId: entry.account.owner,
    };
  });

  parsed.sort((a, b) => (a.mint === b.mint ? a.ata.localeCompare(b.ata) : a.mint.localeCompare(b.mint)));
  return parsed;
}

function formatUi(raw, decimals) {
  const amount = BigInt(raw);
  const base = BigInt(10) ** BigInt(decimals);
  const whole = amount / base;
  const frac = amount % base;
  return whole.toString() + "." + frac.toString().padStart(decimals, "0");
}

function buildSolTransferPlan(input) {
  const lamports = BigInt(Math.round(input.amountSol * 1000000000));
  const data = [2, 0, 0, 0].concat(encodeU64(lamports));

  return {
    feePayer: input.from,
    recentBlockhash: input.recentBlockhash,
    instructions: [
      {
        programId: "11111111111111111111111111111111",
        keys: [
          { pubkey: input.from, isSigner: true, isWritable: true },
          { pubkey: input.to, isSigner: false, isWritable: true },
        ],
        dataBase64: toBase64(data),
      },
    ],
  };
}

function buildSplTransferPlan(input) {
  if (input.expectedDecimals !== input.decimals) {
    throw new Error("Decimals mismatch: expected " + input.expectedDecimals + ", got " + input.decimals);
  }

  const data = [12].concat(encodeU64(BigInt(input.amountRaw))).concat([input.decimals]);
  return {
    feePayer: input.owner,
    recentBlockhash: input.recentBlockhash,
    instructions: [
      {
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        keys: [
          { pubkey: input.sourceAta, isSigner: false, isWritable: true },
          { pubkey: input.mint, isSigner: false, isWritable: false },
          { pubkey: input.destinationAta, isSigner: false, isWritable: true },
          { pubkey: input.owner, isSigner: true, isWritable: false },
        ],
        dataBase64: toBase64(data),
      },
    ],
  };
}

function encodeU64(value) {
  const bytes = [];
  let n = value;
  for (let i = 0; i < 8; i += 1) {
    bytes.push(Number(n & 255n));
    n = n >> 8n;
  }
  return bytes;
}

function toBase64(bytes) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;

  while (i < bytes.length) {
    const b1 = bytes[i++] || 0;
    const b2 = bytes[i++] || 0;
    const b3 = bytes[i++] || 0;

    const enc1 = b1 >> 2;
    const enc2 = ((b1 & 3) << 4) | (b2 >> 4);
    const enc3 = ((b2 & 15) << 2) | (b3 >> 6);
    const enc4 = b3 & 63;

    if (i - 1 > bytes.length) {
      output += chars.charAt(enc1) + chars.charAt(enc2) + "==";
    } else if (i > bytes.length) {
      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + "=";
    } else {
      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }
  }

  return output;
}
`;

export const lesson8Hints: string[] = [
  "Checkpoint output must include parser output and both transaction plans in fixed key order.",
  "Select one token account deterministically from sorted parser output before building SPL transfer.",
  "Use the same deterministic instruction data encodings from lessons 5 and 6.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "composes dashboard and tx plans",
    input: JSON.stringify({
      owner: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      recentBlockhash: "BHASH999",
      solTransferTo: "11111111111111111111111111111111",
      solAmount: 0.25,
      splDestinationAta: "31HksMdb7GnK2fJj1pJhR2F45Ne2rk87oiK56f2tzA9q",
      splAmountRaw: "1500",
      tokenAccountsPayload: {
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
                      tokenAmount: { amount: "1250000000", decimals: 9 }
                    }
                  }
                }
              }
            },
            {
              pubkey: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
              account: {
                owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                data: {
                  parsed: {
                    info: {
                      mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
                      tokenAmount: { amount: "5025000", decimals: 6 }
                    }
                  }
                }
              }
            }
          ]
        }
      }
    }),
    expectedOutput:
      '{"owner":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","tokenAccounts":[{"mint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","ata":"FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1","amountRaw":"5025000","decimals":6,"amountUi":"5.025000","programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"mint":"So11111111111111111111111111111111111111112","ata":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","amountRaw":"1250000000","decimals":9,"amountUi":"1.250000000","programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"solTransferPlan":{"feePayer":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","recentBlockhash":"BHASH999","instructions":[{"programId":"11111111111111111111111111111111","keys":[{"pubkey":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","isSigner":true,"isWritable":true},{"pubkey":"11111111111111111111111111111111","isSigner":false,"isWritable":true}],"dataBase64":"AgAAAICy5g4AAAAA"}]},"splTransferPlan":{"feePayer":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","recentBlockhash":"BHASH999","instructions":[{"programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","keys":[{"pubkey":"FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1","isSigner":false,"isWritable":true},{"pubkey":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","isSigner":false,"isWritable":false},{"pubkey":"31HksMdb7GnK2fJj1pJhR2F45Ne2rk87oiK56f2tzA9q","isSigner":false,"isWritable":true},{"pubkey":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","isSigner":true,"isWritable":false}],"dataBase64":"DNwFAAAAAAAABg=="}]}}',
  },
];
