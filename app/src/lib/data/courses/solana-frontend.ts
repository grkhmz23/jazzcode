import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/solana-frontend/challenges/lesson-4-core-reducer";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-frontend/challenges/lesson-5-stream-replay";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/solana-frontend/challenges/lesson-6-query-layer";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-frontend/challenges/lesson-8-checkpoint";

const lesson1: Lesson = {
  id: "frontend-v2-wallet-state-accounts-model",
  slug: "frontend-v2-wallet-state-accounts-model",
  title: "Wallet state + accounts mental model for UI devs",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Wallet state + accounts mental model for UI devs

Most Solana frontend bugs are not visual bugs. They are model bugs. A dashboard can look polished while silently computing balances from the wrong account class, mixing lamports with token units, or treating temporary pending state as confirmed truth. The first production-grade skill is to build a strict mental model and enforce it in code. Wallet address, system account balance, token account balance, and position value are related but not interchangeable.

A connected wallet gives your app identity and signature capability. It does not directly provide full portfolio state. Native SOL lives on the wallet system account in lamports, while SPL balances live in token accounts, often associated token accounts (ATAs). If your state shape does not represent this distinction explicitly, downstream logic becomes fragile. For example, transfer previews might show a wallet address as a token destination, but execution requires token account addresses. Good frontends represent these as separate types and derive display labels from those types.

Precision is equally important. Lamports and token amounts should remain integer strings in your model layer. UI formatting can convert those values for display, but business logic should avoid float math to prevent drift and non-deterministic tests. This course uses deterministic fixtures and fixed-scale arithmetic because reproducibility is essential for debugging. If one engineer sees \\"5.000001\\" and another sees \\"5.000000\\" for the same payload, your incident response becomes noise.

State ownership is another common failure point. Portfolio views often merge data from event streams, cached fetches, and optimistic transaction journals. Without clear precedence rules, you can double-count transfers or overwrite fresh data with stale cache entries. A robust model treats each input as an event and computes derived state through deterministic reducers. That approach gives you replayability: when a bug appears, you can replay the exact event sequence and inspect every transition.

A production dashboard also needs explicit error classes for parsing and modeling. Invalid mint metadata, malformed amount strings, or missing ATA links should produce typed failures, not silent fallback behavior. Silent fallbacks feel user-friendly in the short term, but they hide corruption that later appears as impossible balances or broken transfers.

Finally, wallet state should include confidence metadata. Is this balance from confirmed events? From optimistic local prediction? From replay snapshot N? Confidence-aware UX prevents overclaiming and helps users understand why values may shift.

## Practical mental model map

Keep four layers explicit:
1. Identity layer (wallet, signer, session metadata).
2. State layer (system accounts, token accounts, mint metadata).
3. Event layer (journal entries, corrections, dedupe keys, confidence).
4. View layer (formatted balances, sorted rows, UX status labels).

When these layers blur together, bugs look random. When they stay separate, you can isolate failures quickly.

## Pitfall: treating wallet pubkey as the universal balance location

Wallet pubkey identifies a user, but SPL balances live in token accounts. If you collapse the two, transfer builders, explorers, and reconciliation logic diverge.

## Production Checklist

1. Keep lamports and token amounts as integer strings in core model.
2. Represent wallet address, ATA address, and mint address as separate fields.
3. Derive UI values from deterministic reducers, not ad-hoc component state.
4. Attach confidence metadata to displayed balances.
5. Emit typed parser/model errors instead of silent defaults.
`,
  blocks: [
    {
      type: "quiz",
      id: "frontend-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "frontend-v2-l1-q1",
          prompt: "Where do SPL token balances actually live?",
          options: [
            "In token accounts (typically ATAs), not directly in the wallet system account",
            "In the wallet system account lamports field",
            "Inside the transaction signature",
          ],
          answerIndex: 0,
          explanation:
            "Wallet identity and token balance storage are different model layers in Solana.",
        },
        {
          id: "frontend-v2-l1-q2",
          prompt: "Why keep raw amounts as integer strings in model code?",
          options: [
            "To avoid non-deterministic floating-point drift in reducers and tests",
            "Because wallets only accept strings",
            "Because decimals are always 9",
          ],
          answerIndex: 0,
          explanation:
            "Deterministic arithmetic and replay debugging depend on precise integer state.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "frontend-v2-transaction-lifecycle-ui",
  slug: "frontend-v2-transaction-lifecycle-ui",
  title: "Transaction lifecycle for UI: pending/confirmed/finalized, optimistic UI",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Transaction lifecycle for UI: pending/confirmed/finalized, optimistic UI

Frontend transaction UX is a state machine problem. Users press one button, but your app traverses multiple phases: intent creation, transaction construction, signature request, submission, and confirmation at one or more commitment levels. If these phases are collapsed into one boolean \\"loading\\" flag, you lose correctness and your recovery paths become guesswork.

The lifecycle starts with deterministic planning. Before any wallet popup, construct a serializable transaction intent: accounts, amounts, expected side effects, and idempotency key. This intent should be inspectable and testable without network access. In production, this split pays off because many failures happen before send: invalid account metas, stale assumptions about ATAs, wrong decimals, or malformed instruction payloads. A deterministic planner catches these early and produces actionable errors.

After signing, submission moves the transaction into a pending state. Pending means the network may or may not accept execution. Your UI can use optimistic overlays, but optimistic updates should be scoped and reversible. For example, show \\"pending transfer\\" in activity feed immediately, but avoid mutating durable balance totals until at least confirmed commitment. If you mutate balances too early, user trust drops when signature rejection or simulation failure occurs.

Commitment levels should be modeled explicitly. \\"processed\\" provides quick feedback, \\"confirmed\\" provides stronger confidence, and \\"finalized\\" is strongest. You do not need to promise exact timing. You do need to communicate confidence boundaries clearly. A common production bug is labeling processed as final and then rendering inconsistent data during cluster stress.

Optimistic rollback is often neglected. Every optimistic action needs a rollback rule keyed by idempotency token. If confirmation fails, rollback should remove optimistic journal entries and restore derived state by replaying deterministic events. This is why event-driven state models are practical for frontend apps: they make rollback a replay operation instead of imperative patchwork.

Telemetry should also be phase-specific. Log whether failures happen in build, sign, send, or confirm. Group by wallet type, program ID, and error class. This lets teams distinguish infrastructure incidents from modeling bugs.

## Pitfall: over-writing confirmed state with stale optimistic assumptions

Optimistic state should be additive and reversible. If optimistic patches directly replace canonical state, delayed confirmations or failures create confusing balance jumps.

## Production Checklist

1. Model transaction lifecycle as explicit states, not one loading flag.
2. Keep deterministic planner output separate from wallet/RPC adapter layer.
3. Track optimistic entries with idempotency keys and rollback rules.
4. Label commitment confidence in UI copy.
5. Emit phase-specific telemetry for build/sign/send/confirm.
`,
  blocks: [
    {
      type: "explorer",
      id: "frontend-v2-l2-account-explorer",
      title: "Lifecycle Accounts Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Fee Payer System Account",
            address: "Owner111111111111111111111111111111111111111",
            lamports: 250000000,
            owner: "11111111111111111111111111111111",
            executable: false,
            dataLen: 0,
          },
          {
            label: "USDC ATA During Pending State",
            address: "AtaOwnerUSDC11111111111111111111111111111111",
            lamports: 2039280,
            owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            executable: false,
            dataLen: 165,
          },
        ],
      },
    },
    {
      type: "quiz",
      id: "frontend-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "frontend-v2-l2-q1",
          prompt: "What is the safest use of optimistic UI for token transfers?",
          options: [
            "Show pending overlays first, mutate durable balances only after stronger confirmation",
            "Immediately mutate all balances and ignore rollback",
            "Disable activity feed until finalized",
          ],
          answerIndex: 0,
          explanation:
            "Optimistic overlays are useful, but confirmed state must remain authoritative.",
        },
        {
          id: "frontend-v2-l2-q2",
          prompt: "Why track transaction phases separately in telemetry?",
          options: [
            "To isolate modeling failures from wallet and network failures",
            "Only to reduce logs",
            "Because commitment levels require it by protocol",
          ],
          answerIndex: 0,
          explanation:
            "Phase-specific metrics enable actionable incident diagnosis.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "frontend-v2-data-correctness-idempotency",
  slug: "frontend-v2-data-correctness-idempotency",
  title: "Data correctness: dedupe, ordering, idempotency, correction events",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Data correctness: dedupe, ordering, idempotency, correction events

Frontend teams frequently assume event streams are perfectly ordered and unique. Production systems rarely behave that way. You can receive duplicate events, out-of-order events, delayed price updates, and correction signals that invalidate earlier records. If your reducer assumes ideal sequencing, dashboard totals drift and support incidents become hard to reproduce.

Deterministic ordering is the first control. In this course we replay events by (ts, id). Timestamp alone is insufficient because equal timestamps are common in batched systems. A deterministic tie-breaker gives every engineer and CI runner the same final state.

Idempotency is the second control. Each event id should be applied at most once. If the same id appears twice, state must not change after the first apply. This rule protects against retries, websocket reconnect bursts, and duplicate queue deliveries.

Correction handling is the third control. A correction event references an earlier event id and signals that its effect should be removed. You can implement this by replaying from journal with corrected ids excluded, or by inverse operations when your model supports exact inverses. Replay is slower but simpler and safer for educational deterministic engines.

History modeling deserves attention too. Users need recent activity, but history should not become an unstructured debug dump. Each history row should include event id, timestamp, type, and concise summary. If corrected events remain visible, label them explicitly so users and support staff understand why balances changed.

Another correctness risk is cross-domain ordering. Token events and price events may arrive at different rates. Value calculations should depend on the latest known price per mint and should never use transient float conversions. Fixed-scale integer math avoids rounding divergence across environments.

When reducers are deterministic and replayable, regression testing improves dramatically. You can compare snapshots after every N events, compute checksums, and verify that refactors preserve behavior. This style catches subtle bugs earlier than end-to-end tests.

Finally, correctness is not only code. It is product communication. If corrections can alter history, UI should surface that possibility in copy and state labels. Hiding it creates the appearance of randomness.

## Pitfall: applying out-of-order events directly to live state without replay

Applying arrivals as-is can produce transiently wrong balances and non-reproducible bugs. Deterministic replay gives consistent outcomes and auditable transitions.

## Production Checklist

1. Sort replay by deterministic keys (ts, id).
2. Deduplicate by event id before applying transitions.
3. Support correction events that remove prior effects.
4. Keep history rows explicit and correction-aware.
5. Use fixed-scale arithmetic for value calculations.
`,
  blocks: [
    {
      type: "quiz",
      id: "frontend-v2-l3-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "frontend-v2-l3-q1",
          prompt: "Why is ordering by (ts, id) preferred over timestamp-only replay?",
          options: [
            "It provides deterministic tie-breaking for equal timestamps",
            "It removes the need for deduplication",
            "It makes corrections unnecessary",
          ],
          answerIndex: 0,
          explanation:
            "Stable ordering prevents environment-dependent state divergence.",
        },
        {
          id: "frontend-v2-l3-q2",
          prompt: "What should happen when the same event id arrives twice?",
          options: [
            "Second apply should be a no-op",
            "Apply both and average balances",
            "Reset full state",
          ],
          answerIndex: 0,
          explanation:
            "Idempotency guarantees deterministic behavior under retries.",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "frontend-v2-core-reducer",
  slug: "frontend-v2-core-reducer",
  title: "Build core state model + reducer from events",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Build core state model + reducer from events

Implement a deterministic reducer for dashboard state:
- apply event stream transitions for balances and mint metadata
- enforce idempotency by event id
- support correction markers for replaced events
- emit stable history summaries
`,
  language: "typescript",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "frontend-v2-stream-replay-snapshots",
  slug: "frontend-v2-stream-replay-snapshots",
  title: "Implement event stream simulator + replay timeline + snapshots",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Implement event stream simulator + replay timeline + snapshots

Build deterministic replay tooling:
- replay sorted events by (ts, id)
- snapshot every N applied events
- compute stable checksum for replay output
- return { finalState, snapshots, checksum }
`,
  language: "typescript",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "frontend-v2-query-layer-metrics",
  slug: "frontend-v2-query-layer-metrics",
  title: "Implement query layer + computed metrics",
  type: "challenge",
  xpReward: 45,
  duration: "35 min",
  content: `# Implement query layer + computed metrics

Implement dashboard query/view logic:
- search/filter/sort rows deterministically
- compute total and row valueUsd with fixed-scale integer math
- expose stable view model for UI rendering
`,
  language: "typescript",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Lesson = {
  id: "frontend-v2-production-ux-hardening",
  slug: "frontend-v2-production-ux-hardening",
  title: "Production UX: caching, pagination, error banners, skeletons, rate limits",
  type: "content",
  xpReward: 35,
  duration: "45 min",
  content: `# Production UX: caching, pagination, error banners, skeletons, rate limits

After model correctness, frontend quality is mostly about user trust under imperfect conditions. Users do not evaluate your dashboard by clean demo paths. They evaluate it when data is delayed, partial, duplicated, or rejected. Production UX hardening means making those states understandable and recoverable.

Caching strategy should be explicit. Event snapshots, derived views, and summary cards should have clear freshness rules. A stale-but-marked cache is often better than blank loading screens, but stale data must never masquerade as confirmed current data. Include freshness timestamps and, when possible, source confidence labels (cached, replayed, confirmed).

Pagination and virtualized lists need deterministic sorting to avoid row jumps between pages. If sort keys are unstable, users see items move unexpectedly as new events arrive. Use primary and secondary stable keys, and preserve cursor semantics during live updates.

Error banners should be scoped by subsystem. Parser errors are not network errors. Replay checksum mismatches are not wallet signature errors. Distinct error classes reduce panic and help users choose next actions. A generic red toast that says \\"something went wrong\\" is operationally expensive.

Skeleton states must communicate structure rather than fake certainty. Show placeholder rows and chart bounds, but avoid hardcoding values that look real. If users screen-record issues, misleading skeletons complicate incident investigation.

Rate limits are common in real dashboards, even with private APIs. Your UI should surface backoff state and avoid firehose re-requests from multiple components. Centralize data fetching and de-duplicate in-flight requests by key. This prevents self-inflicted throttling.

Live mode and replay mode should share the same reducer and query pipeline. Live mode streams events progressively; replay mode applies fixture timelines deterministically. If these modes use different code paths, bugs hide in mode-specific branches and become hard to reproduce.

A practical approach is to store event journal and snapshots, then render all UI from derived selectors. This architecture supports recoverability: you can reset to snapshot N, replay events, and inspect differences. It also supports support tooling: attach snapshot checksum and model version to error reports.

### Devnet Bonus (optional)

You can add an RPC adapter behind a feature flag and map live account updates into the same event format. Keep this optional and never required for core correctness.

## Pitfall: shipping polished visuals with unscoped failure states

If users cannot tell whether an issue is stale cache, parse failure, or upstream throttle, confidence erodes even when core model logic is correct.

## Production Checklist

1. Expose freshness metadata for cached and live data.
2. Keep list sorting deterministic across pagination.
3. Classify errors by subsystem with actionable copy.
4. De-duplicate in-flight fetches and respect rate limits.
5. Render live and replay modes through shared reducer/selectors.
`,
  blocks: [
    {
      type: "quiz",
      id: "frontend-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "frontend-v2-l7-q1",
          prompt: "Why should live mode and replay mode share the same reducer pipeline?",
          options: [
            "To keep behavior reproducible and avoid mode-specific correctness drift",
            "To reduce CSS size only",
            "Because rate limits require it",
          ],
          answerIndex: 0,
          explanation:
            "Shared deterministic logic makes incident replay and testing reliable.",
        },
        {
          id: "frontend-v2-l7-q2",
          prompt: "What is the main risk of generic one-size-fits-all error banners?",
          options: [
            "Users cannot distinguish recovery actions across failure classes",
            "They always break hydration",
            "They disable optimistic UI",
          ],
          answerIndex: 0,
          explanation:
            "Phase- and subsystem-specific failures require different user guidance.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "frontend-v2-dashboard-summary-checkpoint",
  slug: "frontend-v2-dashboard-summary-checkpoint",
  title: "Emit stable DashboardSummary from fixtures",
  type: "challenge",
  xpReward: 60,
  duration: "45 min",
  content: `# Emit stable DashboardSummary from fixtures

Compose deterministic checkpoint output:
- owner, token count, totalValueUsd
- top tokens sorted deterministically
- recent activity rows
- invariants and determinism metadata (fixture hash + model version)
`,
  language: "typescript",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "frontend-v2-module-fundamentals",
  title: "Frontend Fundamentals for Solana",
  description:
    "Model wallet/account state correctly, design transaction lifecycle UX, and enforce deterministic correctness rules for replayable debugging.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "frontend-v2-module-token-dashboard",
  title: "Token Dashboard Project",
  description:
    "Build reducer, replay snapshots, query metrics, and deterministic dashboard outputs that remain stable under partial or delayed data.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaFrontendCourse: Course = {
  id: "course-solana-frontend",
  slug: "solana-frontend",
  title: "Solana Frontend Development",
  description:
    "Project-journey course for frontend engineers who want production-ready Solana dashboards: deterministic reducers, replayable event pipelines, and trustworthy transaction UX.",
  difficulty: "intermediate",
  duration: "10 hours",
  totalXP: 335,
  imageUrl: "/images/courses/solana-frontend.jpg",
  tags: ["frontend", "dashboard", "state-model", "event-replay", "determinism"],
  modules: [module1, module2],
};
