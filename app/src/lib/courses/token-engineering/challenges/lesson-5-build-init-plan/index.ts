import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const plan = buildInitPlan(input.config, input.mint);
  return JSON.stringify(plan);
}

function buildInitPlan(config, mint) {
  return [
    { label: "create-mint-account", programId: "Token2022", keys: [], dataBase64: "" },
  ];
}
`;

export const lesson5SolutionCode = `function run(input) {
  const plan = buildInitPlan(input.config, input.mint);
  return JSON.stringify(plan);
}

function buildInitPlan(config, mint) {
  const plan = [];

  plan.push(step("create-mint-account", {
    mint,
    authority: config.mintAuthority,
  }));

  plan.push(step("init-mint-decimals-" + config.decimals, {
    decimals: config.decimals,
    mintAuthority: config.mintAuthority,
    freezeAuthority: config.freezeAuthority || "",
  }));

  if (config.extensions && config.extensions.metadataPointer) {
    plan.push(step("extension-metadata-pointer", {
      authority: config.extensions.metadataPointer.authority,
      metadataAddress: config.extensions.metadataPointer.metadataAddress,
    }));
  }

  if (config.extensions && config.extensions.transferFee) {
    plan.push(step("extension-transfer-fee", {
      authority: config.extensions.transferFee.authority,
      feeBps: config.extensions.transferFee.feeBps,
      maxFee: config.extensions.transferFee.maxFee,
    }));
  }

  if (config.extensions && config.extensions.defaultAccountState) {
    plan.push(step("extension-default-account-state", {
      state: config.extensions.defaultAccountState.state,
    }));
  }

  if (config.extensions && config.extensions.permanentDelegate) {
    plan.push(step("extension-permanent-delegate", {
      delegate: config.extensions.permanentDelegate.delegate,
    }));
  }

  return plan;
}

function step(label, params) {
  const sorted = {};
  Object.keys(params)
    .sort()
    .forEach((key) => {
      sorted[key] = params[key];
    });

  return {
    label,
    programId: "Token2022OfflineProgram",
    keys: [{ pubkey: "mint", isSigner: false, isWritable: true }],
    dataBase64: toBase64(JSON.stringify({ version: "token-launch-pack-v2", label, params: sorted })),
  };
}

function toBase64(value) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64");
  }
  return btoa(value);
}
`;

export const lesson5Hints: string[] = [
  "Add base steps first: create mint account, then initialize mint with decimals.",
  "Append extension steps in deterministic order so plan labels are stable.",
  "Encode each step payload with version + sorted params before base64 conversion.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "builds deterministic init plan with selected extensions",
    input: JSON.stringify({
      mint: "MintPseudo111",
      config: {
        decimals: 6,
        mintAuthority: "AUTH_A",
        freezeAuthority: null,
        extensions: {
          transferFee: { authority: "AUTH_A", feeBps: 250, maxFee: "5000" },
          permanentDelegate: { delegate: "DELEGATE_A" },
        },
      },
    }),
    expectedOutput:
      '[{"label":"create-mint-account","programId":"Token2022OfflineProgram","keys":[{"pubkey":"mint","isSigner":false,"isWritable":true}],"dataBase64":"eyJ2ZXJzaW9uIjoidG9rZW4tbGF1bmNoLXBhY2stdjIiLCJsYWJlbCI6ImNyZWF0ZS1taW50LWFjY291bnQiLCJwYXJhbXMiOnsiYXV0aG9yaXR5IjoiQVVUSF9BIiwibWludCI6Ik1pbnRQc2V1ZG8xMTEifX0="},{"label":"init-mint-decimals-6","programId":"Token2022OfflineProgram","keys":[{"pubkey":"mint","isSigner":false,"isWritable":true}],"dataBase64":"eyJ2ZXJzaW9uIjoidG9rZW4tbGF1bmNoLXBhY2stdjIiLCJsYWJlbCI6ImluaXQtbWludC1kZWNpbWFscy02IiwicGFyYW1zIjp7ImRlY2ltYWxzIjo2LCJmcmVlemVBdXRob3JpdHkiOiIiLCJtaW50QXV0aG9yaXR5IjoiQVVUSF9BIn19"},{"label":"extension-transfer-fee","programId":"Token2022OfflineProgram","keys":[{"pubkey":"mint","isSigner":false,"isWritable":true}],"dataBase64":"eyJ2ZXJzaW9uIjoidG9rZW4tbGF1bmNoLXBhY2stdjIiLCJsYWJlbCI6ImV4dGVuc2lvbi10cmFuc2Zlci1mZWUiLCJwYXJhbXMiOnsiYXV0aG9yaXR5IjoiQVVUSF9BIiwiZmVlQnBzIjoyNTAsIm1heEZlZSI6IjUwMDAifX0="},{"label":"extension-permanent-delegate","programId":"Token2022OfflineProgram","keys":[{"pubkey":"mint","isSigner":false,"isWritable":true}],"dataBase64":"eyJ2ZXJzaW9uIjoidG9rZW4tbGF1bmNoLXBhY2stdjIiLCJsYWJlbCI6ImV4dGVuc2lvbi1wZXJtYW5lbnQtZGVsZWdhdGUiLCJwYXJhbXMiOnsiZGVsZWdhdGUiOiJERUxFR0FURV9BIn19"}]',
  },
  {
    name: "builds base-only plan when no extensions are enabled",
    input: JSON.stringify({
      mint: "MintLite222",
      config: {
        decimals: 9,
        mintAuthority: "AUTH_B",
        freezeAuthority: "FREEZE_B",
        extensions: {},
      },
    }),
    expectedOutput:
      '[{"label":"create-mint-account","programId":"Token2022OfflineProgram","keys":[{"pubkey":"mint","isSigner":false,"isWritable":true}],"dataBase64":"eyJ2ZXJzaW9uIjoidG9rZW4tbGF1bmNoLXBhY2stdjIiLCJsYWJlbCI6ImNyZWF0ZS1taW50LWFjY291bnQiLCJwYXJhbXMiOnsiYXV0aG9yaXR5IjoiQVVUSF9CIiwibWludCI6Ik1pbnRMaXRlMjIyIn19"},{"label":"init-mint-decimals-9","programId":"Token2022OfflineProgram","keys":[{"pubkey":"mint","isSigner":false,"isWritable":true}],"dataBase64":"eyJ2ZXJzaW9uIjoidG9rZW4tbGF1bmNoLXBhY2stdjIiLCJsYWJlbCI6ImluaXQtbWludC1kZWNpbWFscy05IiwicGFyYW1zIjp7ImRlY2ltYWxzIjo5LCJmcmVlemVBdXRob3JpdHkiOiJGUkVFWkVfQiIsIm1pbnRBdXRob3JpdHkiOiJBVVRIX0IifX0="}]',
  },
];
