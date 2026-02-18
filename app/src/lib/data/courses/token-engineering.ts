import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/token-engineering/challenges/lesson-4-validate-config";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/token-engineering/challenges/lesson-5-build-init-plan";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/token-engineering/challenges/lesson-6-simulate-fees";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/token-engineering/challenges/lesson-8-checkpoint";

const lesson1: Lesson = {
  id: "token-v2-spl-vs-token-2022",
  slug: "token-v2-spl-vs-token-2022",
  title: "SPL tokens vs Token-2022: what extensions change",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# SPL tokens vs Token-2022: what extensions change

Token engineering starts with a clean boundary between base token semantics and configurable policy. Legacy SPL Token gives you a stable fungible primitive: mint metadata, token accounts, mint authority, freeze authority, and transfer/mint/burn instructions. Token-2022 preserves that core interface but adds extension slots that let teams activate richer behavior without rewriting token logic from scratch. That compatibility is useful, but it also creates a new class of governance and safety decisions that frontend and protocol engineers need to model explicitly.

The key mental model: Token-2022 is not a separate economic system; it is an extended account layout and instruction surface. Extensions are opt-in, and each extension adds bytes, authorities, and state transitions that must be considered during mint initialization and lifecycle management. If you treat extensions as cosmetic add-ons, you can ship a token that is technically valid but operationally fragile.

For production teams, the first decision is policy minimalism. Every enabled extension increases complexity in wallets, indexers, and downstream integrations. Transfer fees may fit treasury goals but can break assumptions in partner protocols. Default account state can enforce safety posture but may confuse users if account thaw flow is unclear. Permanent delegate can simplify managed flows but dramatically expands power if authority boundaries are weak. The right approach is to map each extension to a concrete requirement and document the explicit threat model it introduces.

Token-2022 also changes launch sequencing. You must pre-size mint accounts for chosen extensions, initialize extension data in deterministic order, and verify authority alignment before live distribution. This is where deterministic offline planning is valuable: you can generate a launch pack, inspect instruction-like payloads, and validate invariants before touching network systems. That practice catches configuration drift early and gives reviewers a reproducible artifact.

Finally, extension-aware design is an integration problem, not just a contract problem. Product and support teams need clear messaging for fee behavior, frozen account states, and delegated capabilities. If users cannot predict token behavior from wallet prompts and docs, operational risk rises even when code is formally correct.

## Decision framework for extension selection

For each extension, force three answers before enabling it:
1. What concrete product requirement does this solve now?
2. Which authority can abuse this if compromised?
3. How will users and integrators observe this behavior in UX and docs?

If any answer is vague, extension scope is probably too broad.

## Pitfall: Extension creep without threat modeling

Adding multiple extensions "for flexibility" often creates overlapping authority powers and unpredictable UX. Enable only the extensions your product can govern, monitor, and explain end-to-end.

## Sanity Checklist

1. Define one explicit business reason per extension.
2. Document extension authorities and revocation strategy.
3. Verify partner compatibility assumptions before launch.
4. Produce deterministic initialization artifacts for review.
`,
  blocks: [
    {
      type: "quiz",
      id: "token-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "token-v2-l1-q1",
          prompt: "What is the safest default posture for Token-2022 extension selection?",
          options: [
            "Enable only extensions with clear product and risk justification",
            "Enable all extensions for future flexibility",
            "Disable authorities entirely",
          ],
          answerIndex: 0,
          explanation:
            "Every extension adds governance and integration complexity, so scope should stay intentional.",
        },
        {
          id: "token-v2-l1-q2",
          prompt: "Why generate an offline deterministic launch pack before devnet/mainnet actions?",
          options: [
            "To review instruction intent and invariants before execution",
            "To avoid configuring decimals",
            "To bypass authority checks",
          ],
          answerIndex: 0,
          explanation:
            "Deterministic planning provides reproducible review artifacts and catches config drift early.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "token-v2-mint-anatomy",
  slug: "token-v2-mint-anatomy",
  title: "Mint anatomy: authorities, decimals, supply, freeze, mint",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Mint anatomy: authorities, decimals, supply, freeze, mint

A production token launch succeeds or fails on parameter discipline. The mint account is a compact policy object: it defines decimal precision, minting authority, optional freeze authority, and extension configuration. Token accounts then represent balances for owners, usually through ATAs. If these pieces are configured inconsistently, downstream systems see contradictory behavior and user trust erodes quickly.

Decimals are one of the most underestimated parameters. They influence UI formatting, fee interpretation, and business logic in integrations. While high precision can feel "future-proof," excessive decimals often create rounding edge cases in analytics and partner systems. Constraining decimals to a documented operational range and validating it at config time is a practical defensive rule.

Authority layout should be explicit and minimal. Mint authority controls supply growth. Freeze authority controls account-level transfer ability. Update authority (for metadata-linked policy) can affect user-facing trust and protocol assumptions. Teams often reuse one operational key for convenience, then struggle to separate powers later. A better pattern is to predefine authority roles and revocation milestones as part of launch governance.

Supply planning should distinguish issuance from distribution. Initial supply tells you what is minted; recipient allocations tell you what is distributed at launch. Those values should be validated with exact integer math, not float formatting. Invariant checks such as \`recipientsTotal <= initialSupply\` are simple but prevent serious release mistakes.

Token-2022 extensions deepen this anatomy. Transfer fee config introduces fee basis points and caps; default account state changes account activation posture; permanent delegate creates a privileged transfer actor. Each extension implies additional authority and monitoring requirements. Your launch plan must encode these requirements as explicit steps and include human-readable labels so reviewers can confirm intent.

Finally, deterministic address derivation in course tooling is a useful engineering discipline. Even when pseudo-addresses are used for offline planning, stable derivation functions improve reproducibility and reduce reviewer ambiguity. The same mindset carries to real deployments where deterministic account derivation is foundational.

Strong teams also pair mint-anatomy reviews with explicit incident playbooks: what to do if an authority key is lost, rotated, or compromised, and how to communicate those events to integrators without causing panic.

## Pitfall: One-key authority convenience

Using a single key for minting, freezing, and metadata updates simplifies setup but concentrates risk. Authority compromise then becomes a full-token compromise rather than a contained incident.

## Sanity Checklist

1. Validate decimals and supply fields before plan generation.
2. Record mint/freeze/update authority roles and custody model.
3. Confirm recipient allocation totals with integer math.
4. Review extension authorities independently from mint authority.
`,
  blocks: [
    {
      type: "quiz",
      id: "token-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "token-v2-l2-q1",
          prompt: "Why should supply checks use integer math instead of floating-point UI values?",
          options: [
            "To avoid rounding drift in launch invariants",
            "Because decimals are always zero",
            "Because token accounts store floats",
          ],
          answerIndex: 0,
          explanation:
            "Supply and distribution correctness depends on exact arithmetic over integer base units.",
        },
        {
          id: "token-v2-l2-q2",
          prompt: "What is the primary role of freeze authority?",
          options: [
            "Controlling whether specific token accounts can transfer",
            "Changing token symbol",
            "Computing transfer fees",
          ],
          answerIndex: 0,
          explanation:
            "Freeze authority governs transfer state at account level, not branding or fee math.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "token-v2-extension-safety-pitfalls",
  slug: "token-v2-extension-safety-pitfalls",
  title: "Extension safety pitfalls: fee configs, delegate abuse, default account state",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Extension safety pitfalls: fee configs, delegate abuse, default account state

Token-2022 extensions let teams express policy in a standard token framework, but policy power is exactly where operational failures happen. Security issues in token launches are rarely exotic cryptography failures. They are usually configuration mistakes: fee caps set too high, delegates granted too broadly, or frozen default states introduced without recovery controls. Production engineering must treat extension configuration as safety-critical logic.

Transfer fee configuration is a good example. A basis-point fee looks simple, yet behavior depends on cap interaction and token decimals. If maxFee is undersized, large transfers saturate quickly and effective fee curve becomes nonlinear. If maxFee is oversized, treasury extraction can exceed expected user tolerance. Deterministic simulations across example transfer sizes are essential before launch, and those simulations should be reviewed by both protocol and product teams.

Permanent delegate is another high-risk feature. It can enable managed flows, but it also creates a privileged actor that may transfer tokens without normal owner signatures depending on policy scope. If delegate authority is not governed by clear controls and revocation procedures, compromise risk rises sharply. In many incidents, teams enabled delegate-like authority for convenience, then discovered too late that governance and monitoring were insufficient.

Default account state introduces user-experience and compliance implications. A frozen default state can enforce controlled activation, but it also creates onboarding failure if thaw paths are unclear or unavailable in partner wallets. Teams should verify thaw strategy, authority custody, and fallback procedures before enabling frozen defaults in production.

The safest engineering workflow is deterministic and reviewable: validate config, normalize extension fields, generate initialization plan labels, simulate transfer outcomes, and produce invariant lists. That sequence creates a shared artifact for engineering, security, legal, and support stakeholders. When questions arise, teams can inspect exact intended policy rather than infer from fragmented scripts.

Finally, treat extension combinations as compounded risk. Each extension may be individually reasonable, yet combined authority interactions can create hidden escalation paths. Cross-extension threat modeling is therefore mandatory for serious launches.

## Pitfall: Fee and delegate settings shipped without scenario simulation

Teams often validate only "happy path" transfer examples. Without boundary simulations and authority abuse scenarios, dangerous configurations can pass review and surface only after users are affected.

## Sanity Checklist

1. Simulate fee behavior at low/medium/high transfer sizes.
2. Document delegate authority scope and emergency revocation path.
3. Verify frozen default accounts have explicit thaw operations.
4. Review combined extension authority interactions for escalation risk.
`,
  blocks: [
    {
      type: "quiz",
      id: "token-v2-l3-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "token-v2-l3-q1",
          prompt: "Why does transfer-fee max cap need scenario testing?",
          options: [
            "It can materially change effective fee behavior across transfer sizes",
            "It only affects metadata",
            "It is ignored once mint is initialized",
          ],
          answerIndex: 0,
          explanation:
            "Fee cap interacts with basis points and can distort economic behavior if misconfigured.",
        },
        {
          id: "token-v2-l3-q2",
          prompt: "What is a core risk of permanent delegate configuration?",
          options: [
            "Privilege concentration if authority governance is weak",
            "Loss of decimal precision",
            "Automatic wallet incompatibility",
          ],
          answerIndex: 0,
          explanation:
            "Delegate privileges must be constrained and governed like high-sensitivity access.",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "token-v2-validate-config-derive",
  slug: "token-v2-validate-config-derive",
  title: "Validate token config + derive deterministic addresses offline",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Validate token config + derive deterministic addresses offline

Implement strict config validation and deterministic pseudo-derivation:
- validate decimals, u64 strings, recipient totals, extension fields
- derive stable pseudo mint and ATA addresses from hash seeds
- return normalized validated config + derivations
`,
  language: "typescript",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "token-v2-build-init-plan",
  slug: "token-v2-build-init-plan",
  title: "Build Token-2022 initialization instruction plan",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Build Token-2022 initialization instruction plan

Create a deterministic offline initialization plan:
- create mint account step
- init mint step with decimals
- append selected extension steps in stable order
- base64 encode step payloads with explicit encoding version
`,
  language: "typescript",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "token-v2-simulate-fees-supply",
  slug: "token-v2-simulate-fees-supply",
  title: "Build mint-to + transfer-fee math + simulation",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Build mint-to + transfer-fee math + simulation

Implement pure simulation for transfer fees and launch distribution:
- fee = min(maxFee, floor(amount * feeBps / 10000))
- aggregate distribution totals deterministically
- ensure no negative supply and no oversubscription
`,
  language: "typescript",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Lesson = {
  id: "token-v2-launch-checklist",
  slug: "token-v2-launch-checklist",
  title: "Launch checklist: params, upgrade/authority strategy, airdrop/testing plan",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Launch checklist: params, upgrade/authority strategy, airdrop/testing plan

A successful token launch is an operations exercise as much as a programming task. By the time users see your token in wallets, dozens of choices have already constrained safety, governance, and UX. Production token engineering therefore needs a launch checklist that turns abstract design intent into verifiable execution steps.

Start with parameter closure. Name, symbol, decimals, initial supply, authority addresses, extension configuration, and recipient allocations must be finalized and reviewed as one immutable package before execution. Many launch incidents come from late parameter changes made in disconnected scripts. Deterministic launch pack generation prevents this by forcing a single source of truth.

Authority strategy is the second pillar. Decide which authorities remain active after launch, which are revoked, and which move to multisig custody. A common best practice is staged authority reduction: keep temporary controls through rollout validation, then revoke or transfer to governance once monitoring baselines are stable. This must be planned explicitly, not improvised during launch day.

Testing strategy should include deterministic offline tests and limited online rehearsal. Offline checks validate config schemas, instruction payload encoding, fee simulations, and supply invariants. Optional devnet rehearsal validates operational playbooks (funding, sequence execution, monitoring) but should not be your only validation layer. If offline checks fail, devnet success is not meaningful.

Airdrop and distribution planning should include recipient reconciliation and rollback strategy. Teams often focus on minting and forget operational constraints around recipient list correctness, timing windows, and support escalation paths. Deterministic distribution plans with stable labels make reconciliation simpler and reduce accidental double execution.

Monitoring and communication are equally important. Define launch metrics in advance: minted supply observed, distribution completion count, fee behavior sanity, and extension-specific health checks. Publish user-facing notices for any non-obvious behavior such as transfer fees or frozen default account state. Clear communication lowers support load and improves trust.

Finally, write down hard stop conditions. If invariants fail, if authority keys mismatch, or if distribution deltas diverge from expected totals, launch should pause immediately. Engineering discipline means refusing to proceed when safety checks are red.

## Pitfall: Treating launch as a one-shot script run

Without an explicit checklist and rollback criteria, teams can execute technically valid instructions that violate business or governance intent. Successful launches are controlled workflows, not single commands.

## Sanity Checklist

1. Freeze a canonical config payload before execution.
2. Approve authority lifecycle and revocation milestones.
3. Run deterministic offline simulation and invariant checks.
4. Reconcile recipient totals and distribution labels.
5. Define go/no-go criteria and escalation owners.
`,
  blocks: [
    {
      type: "quiz",
      id: "token-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "token-v2-l7-q1",
          prompt: "Why is parameter closure required before execution?",
          options: [
            "To prevent script/config drift between review and launch",
            "To maximize decimals",
            "To disable transfer fees",
          ],
          answerIndex: 0,
          explanation:
            "Single-source configuration prevents mismatched launch behavior.",
        },
        {
          id: "token-v2-l7-q2",
          prompt: "What is the purpose of hard stop launch criteria?",
          options: [
            "To halt execution when invariants or authority assumptions fail",
            "To increase transfer throughput",
            "To avoid writing tests",
          ],
          answerIndex: 0,
          explanation:
            "Hard stop rules prevent progressing through unsafe operational states.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "token-v2-launch-pack-checkpoint",
  slug: "token-v2-launch-pack-checkpoint",
  title: "Emit stable LaunchPackSummary",
  type: "challenge",
  xpReward: 60,
  duration: "45 min",
  content: `# Emit stable LaunchPackSummary

Compose full project output as stable JSON:
- normalized authorities and extensions
- supply totals and optional fee model examples
- deterministic plan metadata and invariants
- fixtures hash + encoding version metadata
`,
  language: "typescript",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "token-v2-module-fundamentals",
  title: "Token Fundamentals -> Token-2022",
  description:
    "Understand token primitives, mint policy anatomy, and Token-2022 extension controls with explicit governance and threat-model framing.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "token-v2-module-launch-pack",
  title: "Token Launch Pack Project",
  description:
    "Build deterministic validation, planning, and simulation workflows that produce reviewable launch artifacts and clear go/no-go criteria.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const tokenEngineeringCourse: Course = {
  id: "course-token-engineering",
  slug: "token-engineering",
  title: "Token Engineering on Solana",
  description:
    "Project-journey course for teams launching real Solana tokens: deterministic Token-2022 planning, authority design, supply simulation, and operational launch discipline.",
  difficulty: "intermediate",
  duration: "10 hours",
  totalXP: 335,
  tags: ["tokens", "token-2022", "launch", "authorities", "simulation"],
  imageUrl: "/images/courses/token-engineering.jpg",
  modules: [module1, module2],
};
