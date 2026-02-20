import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify({
    mint: input.mint || "",
    token: { name: "", symbol: "", decimals: 0 },
    authorities: {},
    extensions: {},
    supply: {},
    plan: {},
    invariants: [],
    determinism: {},
  });
}
`;

export const lesson8SolutionCode = `function run(input) {
  const recipients = Array.isArray(input.config.recipients) ? input.config.recipients : [];
  const recipientsTotal = recipients.reduce((sum, item) => sum + BigInt(item.amount), 0n);
  const initialSupply = BigInt(input.config.initialSupply);
  const remaining = (initialSupply - recipientsTotal).toString();

  const labels = [
    "create-mint-account",
    "init-mint-decimals-" + input.config.decimals,
  ];

  if (input.config.extensions.transferFee) labels.push("extension-transfer-fee");
  if (input.config.extensions.defaultAccountState) labels.push("extension-default-account-state");
  if (input.config.extensions.permanentDelegate) labels.push("extension-permanent-delegate");

  const distributionLabels = recipients.map((recipient) => "mint-to:" + recipient.owner);

  const summary = {
    mint: input.mint,
    token: {
      name: input.config.name,
      symbol: input.config.symbol,
      decimals: input.config.decimals,
    },
    authorities: {
      mintAuthority: input.config.mintAuthority,
      freezeAuthority: input.config.freezeAuthority || null,
      updateAuthority: input.config.updateAuthority || null,
    },
    extensions: {
      metadataPointer: input.config.extensions.metadataPointer || null,
      transferFee: input.config.extensions.transferFee || null,
      defaultAccountState: input.config.extensions.defaultAccountState || null,
      permanentDelegate: input.config.extensions.permanentDelegate || null,
    },
    supply: {
      initialSupply: input.config.initialSupply,
      recipientsTotal: recipientsTotal.toString(),
      remaining,
    },
    ...(input.config.extensions.transferFee
      ? {
          feeModel: {
            feeBps: input.config.extensions.transferFee.feeBps,
            maxFee: input.config.extensions.transferFee.maxFee,
            examples: [
              { amount: "1000000", fee: calcFee("1000000", input.config.extensions.transferFee.feeBps, input.config.extensions.transferFee.maxFee) },
              { amount: "250000000", fee: calcFee("250000000", input.config.extensions.transferFee.feeBps, input.config.extensions.transferFee.maxFee) },
            ],
          },
        }
      : {}),
    plan: {
      initSteps: labels.length,
      distributionSteps: distributionLabels.length,
      labels: labels.concat(distributionLabels),
    },
    invariants: [
      "initialSupply >= recipientsTotal",
      "distribution has no negative balances",
      "plan labels are deterministic",
      "encoding version is pinned",
    ],
    determinism: {
      fixturesHash: simpleHash(JSON.stringify(input.fixture)),
      encodingVersion: "token-launch-pack-v2",
    },
  };

  return JSON.stringify(summary);
}

function calcFee(amount, feeBps, maxFee) {
  const fee = (BigInt(amount) * BigInt(feeBps)) / 10000n;
  const cap = BigInt(maxFee);
  return (fee > cap ? cap : fee).toString();
}

function simpleHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
`;

export const lesson8Hints: string[] = [
  "Keep checkpoint JSON key ordering fixed so output is stable.",
  "Compute recipientsTotal and remaining with exact integer math.",
  "Include determinism metadata (fixtures hash + encoding version) in the final object.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "emits stable launch pack summary",
    input: JSON.stringify({
      mint: "MintPseudo111",
      fixture: { id: "fixture-a", version: 1 },
      config: {
        name: "Jazz Fee Token",
        symbol: "JFEE",
        decimals: 6,
        mintAuthority: "AUTH_A",
        freezeAuthority: null,
        updateAuthority: "AUTH_A",
        initialSupply: "50000000000",
        extensions: {
          transferFee: { authority: "AUTH_A", feeBps: 250, maxFee: "5000000" },
          defaultAccountState: { state: "initialized" },
        },
        recipients: [
          { owner: "OWNER_1", amount: "12000000000" },
          { owner: "OWNER_2", amount: "8000000000" },
        ],
      },
    }),
    expectedOutput:
      '{"mint":"MintPseudo111","token":{"name":"Jazz Fee Token","symbol":"JFEE","decimals":6},"authorities":{"mintAuthority":"AUTH_A","freezeAuthority":null,"updateAuthority":"AUTH_A"},"extensions":{"metadataPointer":null,"transferFee":{"authority":"AUTH_A","feeBps":250,"maxFee":"5000000"},"defaultAccountState":{"state":"initialized"},"permanentDelegate":null},"supply":{"initialSupply":"50000000000","recipientsTotal":"20000000000","remaining":"30000000000"},"feeModel":{"feeBps":250,"maxFee":"5000000","examples":[{"amount":"1000000","fee":"25000"},{"amount":"250000000","fee":"5000000"}]},"plan":{"initSteps":4,"distributionSteps":2,"labels":["create-mint-account","init-mint-decimals-6","extension-transfer-fee","extension-default-account-state","mint-to:OWNER_1","mint-to:OWNER_2"]},"invariants":["initialSupply >= recipientsTotal","distribution has no negative balances","plan labels are deterministic","encoding version is pinned"],"determinism":{"fixturesHash":"17163182","encodingVersion":"token-launch-pack-v2"}}',
  },
  {
    name: "emits stable summary without transfer fee model",
    input: JSON.stringify({
      mint: "MintPseudo222",
      fixture: { id: "fixture-b", version: 2 },
      config: {
        name: "Jazz Basic Token",
        symbol: "JBSC",
        decimals: 9,
        mintAuthority: "AUTH_B",
        freezeAuthority: "AUTH_B",
        updateAuthority: null,
        initialSupply: "1000000",
        extensions: {
          metadataPointer: null,
          transferFee: null,
          defaultAccountState: null,
          permanentDelegate: { delegate: "DELEGATE_B" },
        },
        recipients: [],
      },
    }),
    expectedOutput:
      '{"mint":"MintPseudo222","token":{"name":"Jazz Basic Token","symbol":"JBSC","decimals":9},"authorities":{"mintAuthority":"AUTH_B","freezeAuthority":"AUTH_B","updateAuthority":null},"extensions":{"metadataPointer":null,"transferFee":null,"defaultAccountState":null,"permanentDelegate":{"delegate":"DELEGATE_B"}},"supply":{"initialSupply":"1000000","recipientsTotal":"0","remaining":"1000000"},"plan":{"initSteps":3,"distributionSteps":0,"labels":["create-mint-account","init-mint-decimals-9","extension-permanent-delegate"]},"invariants":["initialSupply >= recipientsTotal","distribution has no negative balances","plan labels are deterministic","encoding version is pinned"],"determinism":{"fixturesHash":"ba5d9f64","encodingVersion":"token-launch-pack-v2"}}',
  },
];
