import type { Challenge, Course, Lesson, Module } from '@/types/content';

const lesson1: Lesson = {
  id: 'solana-mental-model',
  slug: 'solana-mental-model',
  title: 'Solana mental model',
  type: 'content',
  xpReward: 30,
  duration: '35 min',
  content: `# Solana mental model

Solana development gets much easier once you stop thinking in terms of "contracts that own state" and start thinking in terms of "programs that operate on accounts." On Solana, the durable state of your app does not live inside executable code. It lives in accounts, and every instruction explicitly says which accounts it wants to read or write. Programs are stateless logic: they validate inputs, apply rules, and update account data when authorized.

A transaction is a signed message containing one or more ordered instructions. Each instruction names a target program, the accounts it needs, and serialized data. The runtime processes those instructions in order, and the transaction is atomic: either all instructions succeed, or none are committed. This matters for correctness. If your second instruction depends on the first instruction's output, transaction atomicity guarantees you never end up in a half-applied state.

For execution validity, several fields matter together: a fee payer, a recent blockhash, instruction payloads, and all required signatures. The fee payer funds transaction fees. The recent blockhash gives the message a freshness window, preventing replay of old signed messages. Required signatures prove authorization from signers declared by instruction account metadata. Missing or invalid signatures cause rejection before instruction logic runs.

Solana's parallelism comes from account access metadata. Because each instruction lists read and write accounts up front, the runtime can schedule non-conflicting transactions simultaneously. If two transactions only read the same account, they can run in parallel. If they both write the same account, one must wait. This read/write locking model is a core reason Solana can scale while preserving deterministic outcomes.

When reading chain state, you'll also see commitment levels: processed, confirmed, and finalized. Conceptually, processed means observed quickly, confirmed means voted by the cluster, and finalized means rooted deeply enough that rollback risk is minimal. Treat commitment as a consistency/latency trade-off knob, not a fixed-time guarantee.
`,
  blocks: [
    {
      type: 'quiz',
      id: 'l1-concept-check',
      title: 'Concept Check',
      questions: [
        {
          id: 'l1-q1',
          prompt: 'What makes Solana state live “in accounts” rather than “inside contracts”?',
          options: [
            'Programs are stateless logic and account data is passed explicitly to instructions',
            'Programs persist mutable storage internally and only expose events',
            'Validators assign storage to whichever program has the most stake',
          ],
          answerIndex: 0,
          explanation: 'On Solana, mutable app state is account data. Programs validate and mutate those accounts but do not hold mutable state internally.',
        },
        {
          id: 'l1-q2',
          prompt: 'Which fields make a transaction valid to execute?',
          options: [
            'Only program IDs and instruction data',
            'Fee payer, recent blockhash, signatures, and instructions',
            'A wallet address and a memo string',
          ],
          answerIndex: 1,
          explanation: 'The runtime checks the message envelope and authorization: fee payer, freshness via blockhash, required signatures, and instruction payloads.',
        },
        {
          id: 'l1-q3',
          prompt: 'Why does Solana care about read/write account sets?',
          options: [
            'To calculate NFT metadata size',
            'To schedule non-conflicting transactions in parallel safely',
            'To compress signatures on mobile wallets',
          ],
          answerIndex: 1,
          explanation: 'Read/write sets let the runtime detect conflicts and parallelize independent work deterministically.',
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: 'accounts-model-deep-dive',
  slug: 'accounts-model-deep-dive',
  title: 'Accounts model deep dive',
  type: 'content',
  xpReward: 35,
  duration: '40 min',
  content: `# Accounts model deep dive

Every on-chain object on Solana is an account with a standard envelope. You can reason about any account using a small set of fields: address, lamports, owner, executable flag, and data bytes length/content. Address (a public key) identifies the account. Lamports represent native SOL balance in the smallest unit (1 SOL = 1,000,000,000 lamports). Owner is the program allowed to modify account data and debit lamports according to runtime rules. Executable indicates whether the account stores runnable program code. Data length tells you how many bytes are allocated for state.

System wallet accounts are usually owned by the System Program and often have ` + "`dataLen = 0`" + `. Program accounts are executable and typically owned by loader/runtime programs, not by your application directly. Token balances do not live directly in wallet accounts. SPL tokens use dedicated token accounts, each tied to a specific mint and owner, because token state has its own program-defined layout and rules.

Rent-exemption is the practical baseline for persistent storage. The more bytes an account allocates, the higher the minimum lamports needed to keep it alive without rent collection risk. Even if you never inspect binary data manually, account size still affects user costs and protocol economics. Good schema design means allocating only what you need and planning upgrades carefully.

Owner semantics are security-critical. If an account claims to be token state but is not owned by the token program, your app should reject it. If an account is executable, treat it as code, not mutable application data. If you understand owner + executable + data length, you can classify most account types quickly and avoid many integration mistakes.

The fastest way to build confidence is to inspect concrete account examples and explain what each field implies operationally.
`,
  blocks: [
    {
      type: 'explorer',
      id: 'l2-account-explorer',
      title: 'Account Explorer',
      explorer: 'AccountExplorer',
      props: {
        samples: [
          {
            label: 'System Wallet Account',
            address: '6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1',
            lamports: 2500000000,
            owner: '11111111111111111111111111111111',
            executable: false,
            dataLen: 0,
          },
          {
            label: 'Program Account',
            address: 'BPFLoaderUpgradeab1e11111111111111111111111',
            lamports: 1000000000,
            owner: 'BPFLoaderUpgradeab1e11111111111111111111111',
            executable: true,
            dataLen: 210432,
          },
        ],
      },
    },
    {
      type: 'quiz',
      id: 'l2-concept-check',
      title: 'Concept Check',
      questions: [
        {
          id: 'l2-q1',
          prompt: 'What does the `owner` field mean on an account?',
          options: [
            'It is the user who paid the creation fee forever',
            'It is the program authorized to modify account data',
            'It is always the same as fee payer in the last transaction',
          ],
          answerIndex: 1,
          explanation: 'Owner identifies the controlling program for state mutation and many lamport operations.',
        },
        {
          id: 'l2-q2',
          prompt: 'What does `executable: true` indicate?',
          options: [
            'The account can be used as transaction fee payer',
            'The account stores runnable program bytecode',
            'The account can hold any SPL token mint directly',
          ],
          answerIndex: 1,
          explanation: 'Executable accounts are code containers; they are not ordinary mutable data accounts.',
        },
        {
          id: 'l2-q3',
          prompt: 'Why are token accounts separate from wallet accounts?',
          options: [
            'Wallet accounts are too small to hold decimals',
            'Token balances are program-specific state managed by the token program',
            'Only validators can read wallet balances',
          ],
          answerIndex: 1,
          explanation: 'SPL token state uses dedicated account layouts and authorization rules enforced by the token program.',
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: 'transactions-and-instructions',
  slug: 'transactions-and-instructions',
  title: 'Transactions & instructions',
  type: 'content',
  xpReward: 35,
  duration: '35 min',
  content: `# Transactions & instructions

An instruction is the smallest executable unit on Solana: ` + "`programId + account metas + opaque data bytes`" + `. A transaction wraps one or more instructions plus signatures and message metadata. This design gives you composability and atomicity in one envelope.

Think of instruction accounts as an explicit dependency graph. Each account meta marks whether the account is writable and whether a signature is required. During transaction execution, the runtime uses those flags for access checks and lock scheduling. If your instruction tries to mutate an account not marked writable, it fails. If a required signer did not sign, it fails before your program logic runs.

The transaction message also carries fee payer and recent blockhash. Fee payer is straightforward: who funds execution. Recent blockhash is subtler: it anchors freshness. Signed messages are replay-resistant because old blockhashes expire. This is why transaction builders usually fetch a fresh blockhash close to send time.

Instruction ordering is deterministic and significant. If instruction B depends on account changes from instruction A, place A first. If any instruction fails, the whole transaction is rolled back. You should design multi-step flows with this all-or-nothing behavior in mind.

For CLI workflow, a healthy baseline is: inspect config, target the right cluster, verify active wallet, and check balance before sending anything. That sequence reduces avoidable errors and improves team reproducibility. In local scripts, log your derived addresses and transaction summaries so teammates can reason about intent and outcomes.

You do not need RPC calls to understand this model, but you do need rigor in message construction: explicit accounts, explicit ordering, explicit signatures, and explicit freshness.

## Why this matters in real apps

When production incidents happen, teams usually debug transaction construction first: wrong signer, wrong writable flag, stale blockhash, or wrong instruction ordering. Engineers who model transactions as explicit data structures can diagnose these failures quickly. Engineers who treat transactions like opaque wallet blobs usually need trial-and-error.

## What you should be able to do after this lesson

- Explain the difference between instruction-level validation and transaction-level validation.
- Predict when two transactions can execute in parallel and when they will conflict.
- Build a deterministic pre-send checklist for local scripts and frontend clients.
`,
  blocks: [
    {
      type: 'terminal',
      id: 'l3-terminal-walkthrough',
      title: 'CLI walkthrough',
      steps: [
        {
          cmd: 'solana config get',
          output: 'Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com\nKeypair Path: ~/.config/solana/id.json',
          note: 'Validate RPC URL and keypair path before sending transactions.',
        },
        {
          cmd: 'solana config set --url devnet',
          output: 'Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com',
          note: 'Use devnet while learning to avoid accidental mainnet transactions.',
        },
        {
          cmd: 'solana address',
          output: '6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1',
          note: 'This is your active signer public key.',
        },
        {
          cmd: 'solana balance',
          output: '1.250000000 SOL',
          note: 'Pattern only; actual value depends on wallet funding.',
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: 'build-sol-transfer-transaction',
  slug: 'build-sol-transfer-transaction',
  title: 'Build a SOL transfer transaction',
  type: 'challenge',
  xpReward: 45,
  duration: '35 min',
  content: `# Build a SOL transfer transaction

Implement a deterministic ` + "`buildTransferTx(params)`" + ` helper in the project file:

- ` + "`src/lib/courses/solana-fundamentals/project/walletManager.ts`" + `
- Use ` + "`@solana/web3.js`" + `
- Return a transaction with exactly one ` + "`SystemProgram.transfer`" + ` instruction
- Set ` + "`feePayer`" + ` and ` + "`recentBlockhash`" + ` from params
- No network calls

This in-page challenge validates your object-shape reasoning. The authoritative checks for Lesson 4 run in repository unit tests, so keep your project implementation aligned with those tests.
`,
  language: 'typescript',
  starterCode: `type BuildTransferTxParams = {
  fromPubkey: string;
  toPubkey: string;
  amountSol: number;
  feePayer: string;
  recentBlockhash: string;
};

const LAMPORTS_PER_SOL = 1_000_000_000;

function buildTransferTx(params: BuildTransferTxParams) {
  return {
    feePayer: params.feePayer,
    recentBlockhash: params.recentBlockhash,
    instructions: [
      {
        programId: '11111111111111111111111111111111',
        fromPubkey: params.fromPubkey,
        toPubkey: params.toPubkey,
        lamports: Math.round(params.amountSol * LAMPORTS_PER_SOL),
      },
    ],
  };
}

function run(input: BuildTransferTxParams): string {
  const tx = buildTransferTx(input);
  return String(tx.instructions.length === 1 && tx.instructions[0].lamports > 0);
}`,
  testCases: [
    {
      name: 'contains one instruction',
      input: '{"fromPubkey":"From1111111111111111111111111111111111","toPubkey":"To111111111111111111111111111111111111","amountSol":0.25,"feePayer":"From1111111111111111111111111111111111","recentBlockhash":"ABCD1234"}',
      expectedOutput: 'true',
    },
    {
      name: 'uses lamports conversion',
      input: '{"fromPubkey":"From1111111111111111111111111111111111","toPubkey":"To111111111111111111111111111111111111","amountSol":1.5,"feePayer":"From1111111111111111111111111111111111","recentBlockhash":"EFGH5678"}',
      expectedOutput: 'true',
    },
  ],
  hints: [
    'Keep transaction construction deterministic: no RPC or random values.',
    'Convert SOL to lamports using 1_000_000_000 multiplier.',
    'Mirror this logic in the real project helper in src/lib/courses/solana-fundamentals/project/walletManager.ts.',
  ],
  solution: `type BuildTransferTxParams = {
  fromPubkey: string;
  toPubkey: string;
  amountSol: number;
  feePayer: string;
  recentBlockhash: string;
};

const LAMPORTS_PER_SOL = 1_000_000_000;

function buildTransferTx(params: BuildTransferTxParams) {
  return {
    feePayer: params.feePayer,
    recentBlockhash: params.recentBlockhash,
    instructions: [
      {
        programId: '11111111111111111111111111111111',
        fromPubkey: params.fromPubkey,
        toPubkey: params.toPubkey,
        lamports: Math.round(params.amountSol * LAMPORTS_PER_SOL),
      },
    ],
  };
}

function run(input: BuildTransferTxParams): string {
  const tx = buildTransferTx(input);
  return String(tx.instructions.length === 1 && tx.instructions[0].lamports > 0);
}`,
};

const lesson5: Lesson = {
  id: 'programs-what-they-are',
  slug: 'programs-what-they-are',
  title: 'Programs: what they are (and aren’t)',
  type: 'content',
  xpReward: 30,
  duration: '35 min',
  content: `# Programs: what they are (and aren’t)

A Solana program is executable account code, not an object that secretly owns mutable storage. Your program receives accounts from the transaction, verifies constraints, and writes only to accounts it is authorized to modify. This explicitness is a feature: it keeps data dependencies visible and helps the runtime parallelize safely.

Program accounts are marked executable and deployed through loader programs. Upgrades are governed by upgrade authority (when configured), which is why production governance around authority custody matters. If your protocol says it is immutable, users should be able to verify upgrade authority was revoked.

What programs are not: they are not ambient state scanners. A program cannot discover arbitrary chain data by itself at runtime. If an account is required, it must be passed in the instruction account list. This is a foundational security and performance constraint. It prevents hidden state dependencies and makes execution deterministic from the message alone.

Cross-Program Invocation (CPI) is how one program composes with another. During CPI, your program calls into another program, passing account metas and instruction data. This enables rich composition: token transfers from your app logic, metadata updates, or protocol-to-protocol operations. But CPI also increases failure surface. You must validate assumptions before and after CPI, and you must track which signer and writable privileges are being forwarded.

At a high level, a robust Solana program follows a pattern: validate signer/owner/seed constraints, deserialize account data, enforce business invariants, perform state transitions, and optionally perform CPI calls. Keeping this pipeline explicit makes audits easier and upgrades safer.

The practical takeaway: programs are deterministic policy engines over accounts. If you keep account boundaries clear, many security and correctness questions become mechanical rather than mystical.
`,
  blocks: [
    {
      type: 'quiz',
      id: 'l5-concept-check',
      title: 'Concept Check',
      questions: [
        {
          id: 'l5-q1',
          prompt: 'What makes a program account executable?',
          options: [
            'It has a wallet signature on every slot',
            'Its account metadata marks it executable and stores program bytecode',
            'It owns at least one token account',
          ],
          answerIndex: 1,
          explanation: 'Executable accounts are code containers with runtime-recognized executable metadata.',
        },
        {
          id: 'l5-q2',
          prompt: 'Why can’t a program discover arbitrary accounts without them being passed in?',
          options: [
            'Because account dependencies must be explicit for deterministic execution and lock scheduling',
            'Because RPC nodes hide account indexes from programs',
            'Because only fee payers can list accounts',
          ],
          answerIndex: 0,
          explanation: 'Account lists are part of the instruction contract; hidden discovery would break determinism and scheduling assumptions.',
        },
        {
          id: 'l5-q3',
          prompt: 'What is CPI?',
          options: [
            'A client-only simulation mode',
            'Calling one on-chain program from another on-chain program',
            'A validator-level rent optimization flag',
          ],
          answerIndex: 1,
          explanation: 'Cross-Program Invocation is core to Solana composability.',
        },
      ],
    },
  ],
};

const lesson6: Lesson = {
  id: 'program-derived-addresses-pdas',
  slug: 'program-derived-addresses-pdas',
  title: 'Program Derived Addresses (PDAs)',
  type: 'content',
  xpReward: 40,
  duration: '40 min',
  content: `# Program Derived Addresses (PDAs)

A Program Derived Address (PDA) is a deterministic account address derived from seeds plus a program ID, with one key property: it is intentionally off-curve, so no private key exists for it. This lets your program control addresses deterministically without requiring a human-held signer.

Derivation starts with seed bytes. Seeds can encode user IDs, mint addresses, version tags, and other namespace components. The runtime appends a bump seed when needed and searches for an off-curve output. The bump is an integer that makes derivation succeed while preserving deterministic reproducibility.

Why PDAs matter: they make address calculation stable across clients and on-chain logic. If both sides derive the same PDA from the same seed recipe, they can verify identity without extra lookup tables. This powers patterns like per-user state accounts, escrow vaults, and protocol configuration accounts.

Verification is straightforward and critical. Off-chain clients derive PDA and include it in instructions. On-chain programs derive the expected PDA again and compare against the supplied account key. If mismatch, reject. This closes an entire class of account-substitution attacks.

Who signs for a PDA? Not a wallet. The program can authorize as PDA during CPI by using invoke_signed with the exact seed set and bump. Conceptually, runtime verifies the derivation proof and grants signer semantics to that PDA for the invoked instruction.

Changing any seed value changes the derived PDA. This is both feature and footgun: excellent for namespacing, dangerous if you accidentally alter seed encoding rules between versions. Keep seed schemas explicit, versioned, and documented.

In short: PDAs are deterministic, non-keypair addresses that let programs model authority and state structure cleanly.
`,
  blocks: [
    {
      type: 'explorer',
      id: 'l6-pda-explorer',
      title: 'PDA Derivation Explorer',
      explorer: 'PDADerivationExplorer',
      props: {
        programId: 'BPFLoaderUpgradeab1e11111111111111111111111',
        seeds: ['wallet-manager', 'user:42', 'vault'],
      },
    },
    {
      type: 'quiz',
      id: 'l6-concept-check',
      title: 'Concept Check',
      questions: [
        {
          id: 'l6-q1',
          prompt: 'Why are PDAs useful?',
          options: [
            'They let programs derive deterministic addresses without private keys',
            'They avoid all account rent costs',
            'They replace transaction signatures entirely',
          ],
          answerIndex: 0,
          explanation: 'PDAs provide deterministic program-controlled addresses with no corresponding private key.',
        },
        {
          id: 'l6-q2',
          prompt: 'Who signs for a PDA in CPI flows?',
          options: [
            'Any wallet holding SOL',
            'The runtime on behalf of the program when invoke_signed seeds match',
            'Only the fee payer of the outer transaction',
          ],
          answerIndex: 1,
          explanation: 'invoke_signed proves seed derivation to runtime, which grants PDA signer semantics for that invocation.',
        },
        {
          id: 'l6-q3',
          prompt: 'What happens if you change a seed?',
          options: [
            'The PDA stays the same but bump changes',
            'Derivation fails permanently',
            'You derive a different PDA address',
          ],
          answerIndex: 2,
          explanation: 'Seed bytes are part of the hash input, so any change yields a different derived address.',
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: 'spl-token-basics',
  slug: 'spl-token-basics',
  title: 'SPL Tokens basics',
  type: 'content',
  xpReward: 40,
  duration: '40 min',
  content: `# SPL Tokens basics

SPL Token is Solana’s standard token program family for fungible assets. A token mint account defines token-level configuration: decimals, total supply accounting, and authorities such as mint authority or freeze authority. A mint does not store each user’s balance directly. Balances live in token accounts.

Associated Token Accounts (ATAs) are the default token-account convention: one canonical token account per (owner, mint) pair. This convention simplifies UX and interoperability because wallets and protocols can derive the expected account location without extra indexing.

A common beginner mistake is treating wallet addresses as token balance containers. Native SOL lives on system accounts, but SPL token balances live on token accounts owned by the token program. That means transfers move balances between token accounts, not directly from wallet pubkey to wallet pubkey.

Authority design matters. Mint authority controls token issuance. Freeze authority can halt movement in specific designs. Removing or governance-wrapping authorities is a major trust signal in production deployments. If authority policies are unclear, integration risk rises quickly.

The token model also supports extension pathways. Token-2022 introduces optional features such as transfer fees and additional metadata/behavior controls. You do not need Token-2022 to understand fundamentals, but you should know it exists so you can avoid assuming every token mint behaves exactly like legacy SPL Token defaults.

Operationally, safe token logic means: verify mint, verify owner program, verify ATA derivation where expected, and reason about authorities before trusting balances or transfer permissions.

Once you internalize mint vs token-account separation and authority boundaries, most SPL token flows become predictable and debuggable.
`,
  blocks: [
    {
      type: 'quiz',
      id: 'l7-concept-check',
      title: 'Concept Check',
      questions: [
        {
          id: 'l7-q1',
          prompt: 'What is an ATA?',
          options: [
            'A deterministic token account for a specific owner + mint pair',
            'A validator vote account with token metadata',
            'A compressed NFT ledger entry',
          ],
          answerIndex: 0,
          explanation: 'Associated Token Accounts standardize where fungible token balances are stored for each owner/mint.',
        },
        {
          id: 'l7-q2',
          prompt: 'Why is wallet address != token account?',
          options: [
            'Wallets can only hold SOL while token balances are separate program-owned accounts',
            'Token accounts are deprecated and optional',
            'Wallet addresses are private keys, token accounts are public keys',
          ],
          answerIndex: 0,
          explanation: 'SPL balances are state in token accounts, not direct fields on wallet system accounts.',
        },
        {
          id: 'l7-q3',
          prompt: 'What authority controls minting?',
          options: [
            'Recent blockhash authority',
            'Mint authority configured on the mint account',
            'Any account with enough lamports',
          ],
          answerIndex: 1,
          explanation: 'Mint authority is the explicit permission holder for issuing additional supply.',
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: 'wallet-manager-cli-sim',
  slug: 'wallet-manager-cli-sim',
  title: 'Wallet Manager CLI-sim',
  type: 'challenge',
  xpReward: 50,
  duration: '35 min',
  content: `# Wallet Manager CLI-sim

Implement a deterministic CLI parser + command executor in:

- ` + "`src/lib/courses/solana-fundamentals/project/walletManager.ts`" + `

Required behavior:

- ` + "`address`" + ` prints the active pubkey
- ` + "`build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>`" + ` prints stable JSON:
  ` + "`{ from, to, lamports, feePayer, recentBlockhash, instructionProgramId }`" + `

No network calls. Keep key order stable in output JSON. Repository tests validate this lesson's deterministic behavior.
`,
  language: 'typescript',
  starterCode: `const LAMPORTS_PER_SOL = 1_000_000_000;

function parseArgs(argv: string[]): { command: string; flags: Record<string, string> } {
  const [command, ...rest] = argv;
  const flags: Record<string, string> = {};

  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index];
    const value = rest[index + 1];
    if (key?.startsWith('--') && value) {
      flags[key.slice(2)] = value;
    }
  }

  return { command: command ?? '', flags };
}

function run(input: { argv: string[]; from: string }): string {
  const parsed = parseArgs(input.argv);

  if (parsed.command === 'address') {
    return input.from;
  }

  if (parsed.command === 'build-transfer') {
    const lamports = Math.round(Number(parsed.flags.sol) * LAMPORTS_PER_SOL);
    return JSON.stringify({
      from: input.from,
      to: parsed.flags.to,
      lamports,
      feePayer: input.from,
      recentBlockhash: parsed.flags.blockhash,
      instructionProgramId: '11111111111111111111111111111111',
    });
  }

  return 'unknown command';
}`,
  testCases: [
    {
      name: 'address command',
      input: '{"argv":["address"],"from":"From1111111111111111111111111111111111"}',
      expectedOutput: 'From1111111111111111111111111111111111',
    },
    {
      name: 'build-transfer command',
      input: '{"argv":["build-transfer","--to","To111111111111111111111111111111111111","--sol","0.25","--blockhash","ABCD"],"from":"From1111111111111111111111111111111111"}',
      expectedOutput: '{"from":"From1111111111111111111111111111111111","to":"To111111111111111111111111111111111111","lamports":250000000,"feePayer":"From1111111111111111111111111111111111","recentBlockhash":"ABCD","instructionProgramId":"11111111111111111111111111111111"}',
    },
  ],
  hints: [
    'Parse flags in pairs: --key value.',
    'Use deterministic SOL-to-lamports conversion with 1_000_000_000 multiplier.',
    'Construct JSON object in fixed key order before JSON.stringify.',
  ],
  solution: `const LAMPORTS_PER_SOL = 1_000_000_000;

function parseArgs(argv: string[]): { command: string; flags: Record<string, string> } {
  const [command, ...rest] = argv;
  const flags: Record<string, string> = {};

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    const next = rest[i + 1];
    if (token?.startsWith('--') && next && !next.startsWith('--')) {
      flags[token.slice(2)] = next;
      i += 1;
    }
  }

  return { command: command ?? '', flags };
}

function run(input: { argv: string[]; from: string }): string {
  const parsed = parseArgs(input.argv);

  if (parsed.command === 'address') {
    return input.from;
  }

  if (parsed.command === 'build-transfer') {
    const lamports = Math.round(Number(parsed.flags.sol) * LAMPORTS_PER_SOL);
    const summary = {
      from: input.from,
      to: parsed.flags.to,
      lamports,
      feePayer: input.from,
      recentBlockhash: parsed.flags.blockhash,
      instructionProgramId: '11111111111111111111111111111111',
    };
    return JSON.stringify(summary);
  }

  return 'unknown command';
}`,
};

const module1: Module = {
  id: 'module-getting-started',
  title: 'Getting Started',
  description:
    'Core execution model, account semantics, and transaction construction patterns you need before writing programs or complex clients.',
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: 'module-programs-and-pdas',
  title: 'Programs & PDAs',
  description:
    'Program behavior, deterministic PDA design, and SPL token mental models with practical safety checks.',
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaFundamentalsCourse: Course = {
  id: 'course-solana-fundamentals',
  slug: 'solana-fundamentals',
  title: 'Solana Fundamentals',
  description:
    'Production-grade introduction for beginners who want clear Solana mental models, stronger transaction debugging skills, and deterministic wallet-manager workflows.',
  difficulty: 'beginner',
  duration: '8 hours',
  totalXP: 305,
  imageUrl: '/images/courses/solana-fundamentals.svg',
  tags: ['solana', 'fundamentals', 'accounts', 'transactions', 'pdas', 'spl-token'],
  modules: [module1, module2],
};
