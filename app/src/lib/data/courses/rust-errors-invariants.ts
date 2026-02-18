import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/rust-errors-invariants/challenges/lesson-4-invariant-error";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/rust-errors-invariants/challenges/lesson-5-evidence-chain";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/rust-errors-invariants/challenges/lesson-6-invariant-tests";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/rust-errors-invariants/challenges/lesson-7-format-report";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/rust-errors-invariants/challenges/lesson-8-invariant-audit-checkpoint";

const appendix = `
Production reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, and explicit severity mapping so runtime incidents are diagnosable without guessing. For invariants, each failed check should identify what contract was violated, where in the flow it happened, and whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent and alert tuning becomes fragile. A typed error library with deterministic reports solves this by making failure semantics machine-readable and human-readable at the same time.

Evidence chains are equally important. A report that says "failed" without chronological context has limited value. A deterministic chain with injected timestamps and step IDs gives auditors and engineers a replayable explanation of what passed, what failed, and in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old and new evidence outputs and verify expected changes before deployment. Over time, these deterministic artifacts become part of release discipline and reduce regressions caused by informal error handling.

When error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries and confirm that alerts, dashboards, and user-facing copy still map correctly. If mappings drift, update guides and fallback behavior should ship together with code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users and support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.

Sustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, and a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors and reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it with quarterly reviews where engineers evaluate false-positive rates, update context fields, and verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, and communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.
`;

const lesson1: Lesson = {
  id: "rei-v2-error-taxonomy",
  slug: "rei-v2-error-taxonomy",
  title: "Error taxonomy: recoverable vs fatal",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Error taxonomy: recoverable vs fatal

Rust encourages explicit error modeling, but teams still produce weak error contracts when they rely on ad hoc strings or inconsistent wrappers. In Solana and Anchor-adjacent systems, this becomes painful quickly because on-chain failures, off-chain pipelines, and frontend UX all need coherent semantics.

A practical taxonomy starts with recoverable versus fatal classes. Recoverable errors represent expected contract violations: stale data, missing signer, value out of range, or transient dependency mismatch. Fatal errors represent corrupted assumptions: impossible state, incompatible schema version, or invariant breach that requires operator intervention.

Typed enums are the center of this design. A code such as NEGATIVE_VALUE or MISSING_AUTHORITY is unambiguous and searchable. Attaching structured context fields gives downstream systems enough detail for logging and user-facing copy without string parsing.

Avoid stringly error contracts where every caller invents custom messages. Those systems accumulate inconsistent wording and ambiguous categories. Instead, keep messages deterministic and derive user copy from code + context in one mapping layer.

Invariants should be designed for testability. If an invariant cannot be expressed as a deterministic function over known inputs, it is hard to validate and easy to regress. Start with small ensure helpers that return typed results, then compose them into higher-level guards.

In production, error taxonomies should be reviewed like API changes. Renaming codes or changing severity mapping can break alert rules and client handling. Version these changes and validate with fixture suites.${appendix}`,
  blocks: [
    {
      type: "quiz",
      id: "rei-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "rei-v2-l1-q1",
          prompt: "Why are typed error codes preferred over free-form strings?",
          options: ["They provide stable machine-readable semantics", "They remove need for logs", "They reduce compile time"],
          answerIndex: 0,
          explanation: "Typed codes make handling and monitoring deterministic.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "rei-v2-result-context-patterns",
  slug: "rei-v2-result-context-patterns",
  title: "Result<T, E> patterns, ? operator, and context",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Result<T, E> patterns, ? operator, and context

Result-based control flow is one of Rust's strongest tools for building robust services and on-chain-adjacent clients. The key is not merely using Result, but designing error types and propagation boundaries that preserve enough context for debugging and UX decisions.

The ? operator keeps code concise, but it can hide context unless error conversion layers are explicit. Invariant-centric systems should wrap lower-level failures with domain meaning before returning to upper layers. For example, a parse failure in account metadata should map to a deterministic invariant code and include the field path.

Context should be structured rather than baked into message text. A map of key/value fields like {label, value, limit} is easier to aggregate and filter than sentence fragments. It also supports localization and role-specific message rendering.

Another pattern is separating validation from side effects. If ensure helpers only evaluate conditions and construct typed errors, they are deterministic and unit-testable. Side effects such as logging or telemetry emission can happen at call boundaries.

When building libraries, avoid exposing too many internal codes. Public codes should represent stable contracts, while internal details can remain nested context. This helps keep compatibility manageable.

Test strategy should include positive cases, negative cases, and report formatting checks. Deterministic report output is valuable for code review because changes are visible as stable diffs, not only behavioral assertions.${appendix}`,
  blocks: [
    {
      type: "terminal",
      id: "rei-v2-l2-terminal",
      title: "Ensure Pattern Examples",
      steps: [
        {
          cmd: "ensure(amount >= 0, NEGATIVE_VALUE, {amount})",
          output: "ok=false when amount<0",
          note: "Typed and deterministic",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "rei-v2-invariant-decision-tree",
  slug: "rei-v2-invariant-decision-tree",
  title: "Explorer: invariant decision tree",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: invariant decision tree

An invariant decision tree helps teams reason about guard ordering and failure priority. Not every invariant should be checked in arbitrary order. Early checks should prevent expensive work and produce the clearest failure semantics.

A common flow: structural preconditions first, authority checks second, value bounds third, relational checks fourth. This ordering minimizes noisy failures and improves auditability. If authority is missing, there is little value in evaluating downstream value checks.

Decision trees also help map errors to UX behavior. A recoverable user input violation may show inline correction hints, while a fatal integrity breach should hard-stop with escalation messaging.

In deterministic systems, tree traversal should be explicit and testable. Given the same input, the same failing node should be reported every time. This allows stable evidence chains and reliable automation.

Explorer tooling can visualize this by showing the path taken, checks skipped, and final outcome. Teams can then tune guard order intentionally and document rationale.${appendix}`,
  blocks: [
    {
      type: "explorer",
      id: "rei-v2-l3-explorer",
      title: "Invariant Tree Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Pass path",
            address: "inv11111111111111111111111111111111111111",
            lamports: 1,
            owner: "InvariantGuard11111111111111111111111111111",
            executable: false,
            dataLen: 64,
          },
          {
            label: "Fail path",
            address: "inv22222222222222222222222222222222222222",
            lamports: 2,
            owner: "InvariantGuard11111111111111111111111111111",
            executable: false,
            dataLen: 64,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "rei-v2-invariant-error-helpers",
  slug: "rei-v2-invariant-error-helpers",
  title: "Challenge: implement InvariantError + ensure helpers",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Implement typed invariant errors and deterministic ensure helpers.",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "rei-v2-evidence-chain-builder",
  slug: "rei-v2-evidence-chain-builder",
  title: "Challenge: implement deterministic EvidenceChain",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Build a deterministic evidence chain with injected timestamps.",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "rei-v2-property-ish-invariant-tests",
  slug: "rei-v2-property-ish-invariant-tests",
  title: "Challenge: deterministic invariant case runner",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Run deterministic invariant case sets and return failed IDs.",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "rei-v2-format-report",
  slug: "rei-v2-format-report",
  title: "Challenge: implement formatReport() stable markdown",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Format a deterministic markdown evidence report.",
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "rei-v2-invariant-audit-checkpoint",
  slug: "rei-v2-invariant-audit-checkpoint",
  title: "Checkpoint: invariant audit report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: "Export deterministic invariant audit checkpoint artifacts.",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "rei-v2-foundations",
  title: "Rust Error and Invariant Foundations",
  description: "Typed errors, Result patterns, and deterministic invariant design.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "rei-v2-project-journey",
  title: "Invariant Guard Library Project Journey",
  description: "Implement guard helpers, evidence chain, and stable audit reporting.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const rustErrorsInvariantsCourse: Course = {
  id: "course-rust-errors-invariants",
  slug: "rust-errors-invariants",
  title: "Rust Error Design & Invariants",
  description: "Build typed invariant guard libraries with deterministic evidence and reporting.",
  difficulty: "advanced",
  duration: "10 hours",
  totalXP: 445,
  tags: ["rust", "errors", "invariants", "reliability"],
  imageUrl: "/images/courses/rust-errors-invariants.jpg",
  modules: [module1, module2],
};
