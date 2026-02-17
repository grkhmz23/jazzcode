import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/anchor-development/challenges/lesson-4-counter-init";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/anchor-development/challenges/lesson-5-increment";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/anchor-development/challenges/lesson-8-checkpoint";

const lesson1: Lesson = {
  id: "anchor-mental-model",
  slug: "anchor-mental-model",
  title: "Anchor mental model",
  type: "content",
  xpReward: 30,
  duration: "40 min",
  content: `# Anchor mental model

Anchor is best understood as a contract between three layers that must agree on shape: your Rust handlers, generated interface metadata (IDL), and client-side instruction builders. In raw Solana programs you manually decode bytes, manually validate accounts, and manually return compact error numbers. Anchor keeps the same runtime model but moves repetitive work into declarations. You still define security-critical behavior, yet you do it through explicit account structs, constraints, and typed instruction arguments.

The ` + "`#[program]`" + ` module is where instruction handlers live. Each function gets a typed ` + "`Context<T>`" + ` plus explicit arguments. The corresponding ` + "`#[derive(Accounts)]`" + ` struct tells Anchor exactly what accounts must be provided and what checks happen before handler logic executes. This includes signer requirements, mutability, PDA seed verification, ownership checks, and relational checks like ` + "`has_one`" + `. If validation fails, the transaction aborts before touching your business logic.

IDL is the bridge that makes the developer experience consistent across Rust and TypeScript. It describes instruction names, args, accounts, events, and custom errors. Clients can generate typed methods from that shape, reducing drift between frontend code and on-chain interfaces. When teams ship fast, drift is a common failure mode: wrong account ordering, stale discriminators, or stale arg names. IDL-driven clients make those mistakes less likely.

Provider and wallet concepts complete the flow. The provider wraps an RPC connection plus signer abstraction and commitment preferences. It does not replace wallet security, but it centralizes transaction send/confirm behavior and test setup. In practice, production reliability comes from understanding this boundary: Anchor helps with ergonomics and consistency, but you still own protocol invariants, account design, and threat modeling.

For this course, treat Anchor as a typed instruction framework on top of Solana’s explicit account runtime. That framing lets you reason clearly about what is generated, what remains your responsibility, and how to test deterministic pieces without needing devnet in CI.
`,
  blocks: [
    {
      type: "quiz",
      id: "anchor-l1-concept-check",
      title: "Concept Check",
      questions: [
        {
          id: "anchor-l1-q1",
          prompt: "What does Anchor generate automatically from your program definitions?",
          options: [
            "IDL metadata, account validation glue, and client-facing interface structure",
            "Validator hardware configuration and consensus votes",
            "Automatic PDA funding from devnet faucets",
          ],
          answerIndex: 0,
          explanation:
            "Anchor generates serialization/validation scaffolding and IDL contracts, not validator-level behavior.",
        },
        {
          id: "anchor-l1-q2",
          prompt: "What is an IDL and who uses it?",
          options: [
            "A JSON interface used by clients/tests/tooling to call your program correctly",
            "A private key format used only by on-chain programs",
            "A token mint extension required for CPI",
          ],
          answerIndex: 0,
          explanation:
            "IDL is interface metadata consumed by clients and tools to reduce instruction/account drift.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "anchor-accounts-constraints-and-safety",
  slug: "anchor-accounts-constraints-and-safety",
  title: "Accounts, constraints, and safety",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Accounts, constraints, and safety

Most serious Solana vulnerabilities come from account validation mistakes, not from arithmetic. Anchor’s constraint system exists to turn those checks into declarative, auditable rules. You declare intent in the account context, and the framework enforces it before instruction logic runs. This means your handlers can focus on state transitions while constraints guard the perimeter.

Start with core markers: ` + "`Signer<'info>`" + ` proves signature authority, and ` + "`#[account(mut)]`" + ` declares state can change. Forgetting ` + "`mut`" + ` produces runtime failures because Solana locks account writability up front. This is not cosmetic metadata; it is part of execution scheduling and safety. Then ownership checks ensure an account belongs to the expected program. If a malicious user passes an account that has the same bytes but wrong owner, strong ownership constraints stop account substitution attacks.

PDA constraints with ` + "`seeds`" + ` and ` + "`bump`" + ` verify deterministic account identity. Instead of trusting a user-provided address, you define the derivation recipe and compare runtime inputs against it. This pattern prevents attackers from redirecting logic to arbitrary writable accounts. ` + "`has_one`" + ` links account relationships, such as enforcing ` + "`counter.authority == authority.key()`" + `. That relation check is simple but high leverage: it prevents privileged actions from being executed by unrelated signers.

Anchor also supports custom ` + "`constraint = ...`" + ` expressions for protocol invariants, like minimum collateral or authority domain rules. Use these sparingly but deliberately: put invariant checks near account definitions when they are structural, and keep business flow checks in handlers when they depend on instruction arguments or prior state.

A practical review checklist: verify every mutable account has an explicit reason to be mutable; verify every signer is necessary; verify every PDA seed recipe is stable and versioned; verify ownership checks are present where parsing assumes specific layout; verify relational constraints (` + "`has_one`" + `) for privileged paths. Security here is explicitness. Constraints do not remove responsibility, but they make responsibility visible and testable.
`,
  blocks: [
    {
      type: "quiz",
      id: "anchor-l2-concept-check",
      title: "Concept Check",
      questions: [
        {
          id: "anchor-l2-q1",
          prompt: "What does `#[account(mut)]` signal to the runtime and framework?",
          options: [
            "The account may be written during execution and must be requested writable",
            "The account is owned by the system program",
            "The account is always a signer",
          ],
          answerIndex: 0,
          explanation:
            "Mutability is part of account metadata and lock planning, not a cosmetic annotation.",
        },
        {
          id: "anchor-l2-q2",
          prompt: "What is a seeds constraint verifying?",
          options: [
            "That the provided account key matches deterministic PDA derivation rules",
            "That the account has maximum rent",
            "That a token mint has 9 decimals",
          ],
          answerIndex: 0,
          explanation:
            "Seeds + bump ensure deterministic account identity and block account-substitution vectors.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "anchor-pdas-in-practice",
  slug: "anchor-pdas-in-practice",
  title: "PDAs in Anchor",
  type: "content",
  xpReward: 35,
  duration: "40 min",
  content: `# PDAs in Anchor

Program Derived Addresses are the backbone of predictable account topology in Anchor applications. A PDA is derived from seed bytes plus program ID and intentionally lives off the ed25519 curve, so no private key exists for it. This lets your program control authority for deterministic addresses through ` + "`invoke_signed`" + ` semantics while keeping user keypairs out of the trust path.

In Anchor, PDA derivation logic appears in account constraints. Typical patterns look like ` + "`seeds = [b\"counter\", authority.key().as_ref()], bump`" + `. This expresses three things at once: namespace (` + "`counter`" + `), ownership relation (authority), and uniqueness under your program ID. The ` + "`bump`" + ` value is the extra byte required to land off-curve. You can compute it on demand with Anchor, or store it in account state for future CPI convenience.

Should you store bump or always re-derive? Re-deriving keeps state smaller and avoids stale bump fields if derivation recipes ever evolve. Storing bump can simplify downstream instruction construction and reduce repeated derivation cost. In practice, many production programs store bump when they expect frequent PDA signing calls and keep the seed recipe immutable. Whichever path you choose, document it and test it.

Seed schema discipline matters. If you silently change seed ordering, text encoding, or domain tags, you derive different addresses and break account continuity. Teams usually treat seeds as protocol versioned API: include explicit namespace tags, stable byte encoding rules, and migration plans when evolution is unavoidable.

For this project journey, we will derive a counter PDA from authority + static domain seed and use that address in both init and increment instruction builders. The goal is to make account identity deterministic, inspectable, and testable without network dependencies. You can then layer real transaction sending later, confident that account and data layouts are already correct.
`,
  blocks: [
    {
      type: "explorer",
      id: "anchor-l3-pda-explorer",
      title: "Counter PDA Explorer",
      explorer: "PDADerivationExplorer",
      props: {
        programId: "BPFLoaderUpgradeab1e11111111111111111111111",
        seeds: ["counter", "authority:demo-user", "v1"],
      },
    },
    {
      type: "quiz",
      id: "anchor-l3-concept-check",
      title: "Concept Check",
      questions: [
        {
          id: "anchor-l3-q1",
          prompt: "Why is a PDA considered off-curve?",
          options: [
            "It is derived to avoid having a corresponding private key",
            "It always uses base64 instead of base58",
            "It is signed directly by validators",
          ],
          answerIndex: 0,
          explanation:
            "Off-curve means no user-held private key exists; programs authorize via seed proofs.",
        },
        {
          id: "anchor-l3-q2",
          prompt: "What breaks if you change one PDA seed value?",
          options: [
            "You derive a different address and can orphan existing state",
            "Only the bump changes while address stays fixed",
            "Nothing changes unless RPC endpoint changes",
          ],
          answerIndex: 0,
          explanation:
            "PDA derivation is seed-sensitive. Any seed change creates a different address namespace.",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "anchor-counter-init-deterministic",
  slug: "anchor-counter-init-deterministic",
  title: "Initialize Counter PDA (deterministic)",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Initialize Counter PDA (deterministic)

Implement deterministic helper functions for a Counter project:

- ` + "`deriveCounterPda(programId, authorityPubkey)`" + `
- ` + "`buildInitCounterIx(params)`" + `

This lesson validates client-side reasoning without RPC calls. Your output must include stable PDA + bump shape, key signer/writable metadata, and deterministic init instruction bytes.

Notes:
- Keep account key ordering stable.
- Use the fixed init discriminator bytes from the lesson hints.
- Return deterministic JSON in ` + "`run(input)`" + ` so tests can compare exact output.
`,
  language: "typescript",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "anchor-increment-builder-and-emulator",
  slug: "anchor-increment-builder-and-emulator",
  title: "Increment instruction builder + state layout",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Increment instruction builder + state layout

Implement deterministic increment behavior in pure TypeScript:

- Build a reusable state representation for counter data.
- Implement ` + "`applyIncrement`" + ` as a pure transition function.
- Enforce explicit overflow behavior (` + "`Counter overflow`" + ` error).

This challenge focuses on deterministic correctness of state transitions, not network execution.
`,
  language: "typescript",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "anchor-testing-without-flakiness",
  slug: "anchor-testing-without-flakiness",
  title: "Testing strategy without flakiness",
  type: "content",
  xpReward: 30,
  duration: "35 min",
  content: `# Testing strategy without flakiness

A reliable Solana curriculum should teach deterministic engineering first, then optional network integration. Flaky tests are usually caused by external dependencies: RPC latency, faucet limits, cluster state drift, blockhash expiry, and wallet setup mismatch. These are real operational concerns, but they should not block learning core protocol logic.

For Anchor projects, split testing into layers. Unit tests validate data layout, discriminator bytes, PDA derivation, account key ordering, and instruction payload encoding. These tests are fast and deterministic. They can run in CI without validator or internet. If they fail, the error usually points to a real bug in serialization or account metadata.

Integration tests add runtime behavior: transaction simulation, account creation, CPI paths, and event assertions. These are valuable but more fragile. Keep them focused and avoid making every PR depend on remote cluster health. Use local validator or controlled environment when possible, and treat external devnet tests as optional confidence checks rather than gatekeeping checks.

When writing deterministic tests, prefer explicit expected values and fixed key ordering. For example, assert exact JSON output with stable key order for summaries, assert exact byte arrays for instruction discriminators, and assert exact signer/writable flags in account metas. These checks catch regressions that broad snapshot tests can miss.

Also test failure paths intentionally: overflow behavior, invalid pubkeys, wrong argument shapes, and stale account discriminators. Production incidents often happen on edge paths that had no tests.

A practical rule: unit tests should prove your client and serialization logic are correct independent of chain conditions. Integration tests should prove network workflows behave when environment is healthy. Keeping this boundary clear gives you both speed and confidence.
`,
  blocks: [
    {
      type: "quiz",
      id: "anchor-l6-concept-check",
      title: "Concept Check",
      questions: [
        {
          id: "anchor-l6-q1",
          prompt: "What belongs in deterministic unit tests for Anchor clients?",
          options: [
            "PDA derivation, instruction bytes, and account key metadata",
            "Devnet faucet reliability and slot timings",
            "Validator gossip propagation speed",
          ],
          answerIndex: 0,
          explanation:
            "Deterministic unit tests should validate pure logic and serialization boundaries.",
        },
        {
          id: "anchor-l6-q2",
          prompt: "What is the main role of optional integration tests?",
          options: [
            "Validate network execution paths after deterministic logic is proven",
            "Replace all unit tests",
            "Avoid asserting exact outputs",
          ],
          answerIndex: 0,
          explanation:
            "Integration tests add runtime confidence but should not replace deterministic core checks.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "anchor-client-composition-and-ux",
  slug: "anchor-client-composition-and-ux",
  title: "Client composition & UX",
  type: "content",
  xpReward: 35,
  duration: "40 min",
  content: `# Client composition & UX

Once instruction layouts and PDA logic are deterministic, client integration becomes a composition exercise: wallet adapter for signing, provider/connection for transport, transaction builder for instruction packing, and UI state for pending/success/error handling. Anchor helps by keeping account schemas and instruction names aligned via IDL, but robust UX still depends on clear boundaries.

A typical flow is: derive addresses, build instruction, create transaction, set fee payer and recent blockhash, request wallet signature, send raw transaction, then confirm with chosen commitment. Each stage can fail for different reasons. If your UI collapses all failures into one generic message, users cannot recover and developers cannot debug quickly.

Simulation failures usually mean account metadata mismatch, invalid instruction data, missing signer, wrong owner program, or constraint violations. Signature errors indicate wallet/user path issues. Blockhash errors are freshness issues. Insufficient funds often involve fee payer SOL balance, not just business account balances. Mapping these classes to actionable errors improves trust and reduces support load.

Fee payer deserves explicit UX. The user may authorize a transaction but still fail because payer lacks lamports for fees or rent. Surfacing fee payer and estimated cost before signing avoids confusion. For multi-party flows, make fee policy explicit.

For this course project, we keep deterministic logic in pure helpers and treat network send/confirm as optional outer layer. That architecture gives you stable local tests while still enabling production integration later. If a network call fails, you can quickly isolate whether the bug is in deterministic instruction construction or in runtime environment state.

In short: robust Anchor UX is not one API call. It is a staged pipeline with clear error taxonomy, explicit payer semantics, and deterministic inner logic that can be tested without chain access.
`,
  blocks: [
    {
      type: "quiz",
      id: "anchor-l7-concept-check",
      title: "Concept Check",
      questions: [
        {
          id: "anchor-l7-q1",
          prompt: "Why do simulation failures happen even before final send succeeds?",
          options: [
            "Because account constraints, owners, and instruction bytes can be invalid",
            "Because the wallet signature always expires immediately",
            "Because fee payer is irrelevant",
          ],
          answerIndex: 0,
          explanation:
            "Simulation catches account and instruction-level issues before final network commitment.",
        },
        {
          id: "anchor-l7-q2",
          prompt: "What does fee payer mean in client transaction UX?",
          options: [
            "The account funding transaction fees/rent-sensitive operations",
            "The account that stores all token balances directly",
            "The account that sets RPC endpoint",
          ],
          answerIndex: 0,
          explanation:
            "Fee payer funds execution costs and must have sufficient SOL.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "anchor-counter-project-checkpoint",
  slug: "anchor-counter-project-checkpoint",
  title: "Counter project checkpoint",
  type: "challenge",
  xpReward: 55,
  duration: "45 min",
  content: `# Counter project checkpoint

Compose the full deterministic flow:

1. Derive counter PDA from authority + program ID.
2. Build init instruction metadata.
3. Build increment instruction metadata.
4. Emulate state transitions: ` + "`init -> increment -> increment`" + `.
5. Return stable JSON summary in exact key order:

` +
    "`{ authority, pda, initIxProgramId, initKeys, incrementKeys, finalCount }`" +
    `

No network calls. All checks are strict string matches.
`,
  language: "typescript",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "anchor-v2-module-basics",
  title: "Anchor Basics",
  description: "Mental model, constraints, and PDA foundations for project-oriented Anchor development.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "anchor-v2-module-pdas-accounts-testing",
  title: "PDAs, Accounts, and Testing",
  description: "Deterministic instruction builders, state emulation, testing strategy, and final checkpoint.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const anchorDevelopmentCourse: Course = {
  id: "course-anchor-development",
  slug: "anchor-development",
  title: "Anchor Development",
  description:
    "Project-journey course: build a deterministic Counter dApp workflow with Anchor-style account modeling, instruction builders, and reliable tests.",
  difficulty: "intermediate",
  duration: "10 hours",
  totalXP: 310,
  imageUrl: "/images/courses/anchor-development.jpg",
  tags: ["anchor", "solana", "pda", "accounts", "testing", "counter"],
  modules: [module1, module2],
};
