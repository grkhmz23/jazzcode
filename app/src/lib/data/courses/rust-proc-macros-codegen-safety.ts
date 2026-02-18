import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/rust-proc-macros-codegen-safety/challenges/lesson-4-parse-attributes";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/rust-proc-macros-codegen-safety/challenges/lesson-5-generate-checks";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/rust-proc-macros-codegen-safety/challenges/lesson-6-golden-tests";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/rust-proc-macros-codegen-safety/challenges/lesson-7-run-generated-checks";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/rust-proc-macros-codegen-safety/challenges/lesson-8-generated-safety-report-checkpoint";

const appendix = `
Macro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor and Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate and catch classes of validation bugs early. For teaching in a browser environment, a deterministic parser and generator provides the same conceptual value without requiring compiler plugins.

The important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes and debugging becomes harder. Stable generated strings, golden file tests, and deterministic run reports solve this. Teams can diff generated code as plain text and confirm that constraint changes are intentional.

Another key rule is clear DSL design. Attribute syntax should be strict enough to reject ambiguous input and explicit enough to encode signer, owner, relation, and mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind and target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.

As DSLs grow, teams should version grammar rules and keep migration guides for older attribute forms. Unversioned grammar drift can silently break generated checks and create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired with golden output snapshots and runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, and testable, which is exactly the behavior needed for safety-critical constraint systems.

High-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, and runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined and avoids turning safety tooling into a maintenance burden. Teams can further strengthen this with compatibility suites that replay historical DSL inputs against new parsers and compare outputs byte-for-byte. When differences appear, release notes should explain why behavior changed and how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.

A short policy checklist attached to pull requests keeps these reviews consistent and lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, and runtime validation signoff in every checklist.
`;

const lesson1: Lesson = {
  id: "rpmcs-v2-macro-mental-model",
  slug: "rpmcs-v2-macro-mental-model",
  title: "Macro mental model: declarative vs procedural",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Macro mental model: declarative vs procedural

Rust macros come in two broad forms: declarative macros for pattern-based expansion and procedural macros for syntax-aware transformation. Anchor relies heavily on macro-driven ergonomics to generate account validation and instruction plumbing.

For safety engineering, the value is consistency. Instead of hand-writing signer and owner checks in every handler, macro-style codegen can enforce these rules from concise attributes. This reduces copy-paste drift and makes review focus on policy intent.

In this course, we simulate proc-macro behavior with deterministic TypeScript parser/generator helpers. The goal is conceptual transfer: attribute input -> AST -> generated checks -> runtime evaluation report.

A macro mental model helps avoid two mistakes: trusting generated behavior blindly and over-generalizing DSL syntax. Good macro design keeps syntax explicit, expansion predictable, and errors readable.

Treat generated checks as code artifacts, not opaque internals. Store them in tests, compare them in diffs, and validate behavior on controlled fixtures.${appendix}`,
  blocks: [
    {
      type: "quiz",
      id: "rpmcs-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "rpmcs-v2-l1-q1",
          prompt: "Why is generated code review important for safety?",
          options: ["It verifies expansion matches policy intent", "It increases compile speed", "It removes need for tests"],
          answerIndex: 0,
          explanation: "Generated checks must remain inspectable and auditable.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "rpmcs-v2-codegen-safety-patterns",
  slug: "rpmcs-v2-codegen-safety-patterns",
  title: "Safety through codegen: constraint checks",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Safety through codegen: constraint checks

Constraint codegen converts compact declarations into explicit runtime guards. Typical constraints include signer presence, account ownership, has-one relations, and mutability requirements.

A strong codegen pipeline validates input syntax strictly, produces deterministic output ordering, and emits meaningful errors for unsupported forms. Weak codegen pipelines accept ambiguous syntax and produce inconsistent expansion, which undermines trust.

Ownership checks are high-value constraints because account substitution bugs are common in Solana systems. Generated owner guards reduce omission risk. Signer checks ensure privileged paths are gated by explicit authority.

Has-one relation checks encode structural links between accounts and authorities. Generated relation checks reduce manual mistakes and keep behavior aligned across handlers.

Finally, testing generated output via golden strings catches accidental expansion drift. This is especially useful during parser refactors.${appendix}`,
  blocks: [
    {
      type: "terminal",
      id: "rpmcs-v2-l2-terminal",
      title: "Constraint Expansion Samples",
      steps: [
        { cmd: "signer(authority)", output: "require_signer(authority);", note: "auth guard" },
        { cmd: "owner(vault=VaultProgram)", output: "require_owner(vault, VaultProgram);", note: "owner guard" },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "rpmcs-v2-constraint-builder-explorer",
  slug: "rpmcs-v2-constraint-builder-explorer",
  title: "Explorer: constraint builder to generated checks",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: constraint builder to generated checks

A constraint builder explorer helps engineers see how DSL choices affect generated code and runtime safety outcomes. Input one attribute line, observe parsed AST, generated pseudo-code, and pass/fail execution against sample inputs.

This tight loop is useful for both education and production review. Teams can prototype new constraint forms, verify deterministic output, and add golden tests before adoption.

The explorer should surface parse failures clearly. If syntax is invalid, report line and expected format. If constraint kind is unsupported, fail with deterministic error text.

Generated checks should preserve input order unless policy requires canonical sorting. Either way, behavior must be deterministic and documented.

Runtime evaluation output should include failure list with kind, target, and reason. This allows developers to fix configuration quickly and keeps safety reporting actionable.${appendix}`,
  blocks: [
    {
      type: "explorer",
      id: "rpmcs-v2-l3-explorer",
      title: "Constraint Builder Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Valid constraints",
            address: "macro111111111111111111111111111111111111",
            lamports: 1,
            owner: "ConstraintGen1111111111111111111111111111111",
            executable: false,
            dataLen: 88,
          },
          {
            label: "Owner mismatch case",
            address: "macro222222222222222222222222222222222222",
            lamports: 2,
            owner: "ConstraintGen1111111111111111111111111111111",
            executable: false,
            dataLen: 88,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "rpmcs-v2-parse-attributes",
  slug: "rpmcs-v2-parse-attributes",
  title: "Challenge: implement parseAttributes()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Parse mini-DSL constraints into deterministic AST nodes.",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "rpmcs-v2-generate-checks",
  slug: "rpmcs-v2-generate-checks",
  title: "Challenge: implement generateChecks()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Generate stable pseudo-code from parsed constraint AST.",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "rpmcs-v2-golden-tests",
  slug: "rpmcs-v2-golden-tests",
  title: "Challenge: deterministic golden-file checks",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Compare generated check output against deterministic golden strings.",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "rpmcs-v2-run-generated-checks",
  slug: "rpmcs-v2-run-generated-checks",
  title: "Challenge: runGeneratedChecks()",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Execute generated constraints on deterministic sample input.",
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "rpmcs-v2-generated-safety-report",
  slug: "rpmcs-v2-generated-safety-report",
  title: "Checkpoint: generated safety report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: "Export deterministic markdown safety report from generated checks.",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "rpmcs-v2-foundations",
  title: "Macro and Codegen Foundations",
  description: "Macro mental models and safety-driven code generation concepts.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "rpmcs-v2-project-journey",
  title: "Account Constraint Codegen (Sim)",
  description: "Parse, generate, evaluate, and report deterministic safety checks.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const rustProcMacrosCodegenSafetyCourse: Course = {
  id: "course-rust-proc-macros-codegen-safety",
  slug: "rust-proc-macros-codegen-safety",
  title: "Procedural Macros & Codegen for Safety",
  description: "Rust macro concepts taught through deterministic parser/codegen safety tooling.",
  difficulty: "advanced",
  duration: "10 hours",
  totalXP: 445,
  tags: ["rust", "macros", "codegen", "safety"],
  imageUrl: "/images/courses/rust-proc-macros-codegen-safety.jpg",
  modules: [module1, module2],
};
