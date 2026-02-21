import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/rust-data-layout-borsh/challenges/lesson-4-compute-layout";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/rust-data-layout-borsh/challenges/lesson-5-borsh-encode-decode";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/rust-data-layout-borsh/challenges/lesson-6-zero-copy-tradeoffs";
import {
  lesson7Hints,
  lesson7SolutionCode,
  lesson7StarterCode,
  lesson7TestCases,
} from "@/lib/courses/rust-data-layout-borsh/challenges/lesson-7-safe-parse-account-data";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/rust-data-layout-borsh/challenges/lesson-8-layout-report-checkpoint";

const appendix = `
Production teams should treat layout and serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, and require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, and parser error behavior for malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on account size, rent budget, and compatibility. Deterministic helpers make this practical: you can produce a stable JSON report in CI and diff it like source code. In Solana and Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after deployment.

Another operational rule is to keep parser failures structured. A generic "decode failed" message is not enough for incident response. Good error payloads include field name, offset, and failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important for indexers and analytics pipelines that need to decide whether to quarantine an event or retry with a newer schema version. Teams that encode rich deterministic error reports reduce triage time and avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, and test every boundary condition before shipping.

Teams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, and compatibility with archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, and which fixtures are mandatory before release. This level of process may feel heavy for small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the practical mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, and difficult to misinterpret.
`;

const lesson1: Lesson = {
  id: "rdb-v2-layout-alignment-padding",
  slug: "rdb-v2-layout-alignment-padding",
  title: "Memory layout: alignment, padding, and why Solana accounts care",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Memory layout: alignment, padding, and why Solana accounts care

Rust layout behavior is deterministic inside one compiled binary but can vary when assumptions are implicit. For Solana accounts, this matters because raw bytes are persisted on-chain and parsed by multiple clients across versions. If you design account structures without explicit layout strategy, subtle padding and alignment changes can break compatibility or produce incorrect parsing in downstream tools.

Rust default layout optimizes for compiler freedom. Field order in memory for plain structs is not a stable ABI contract unless you opt into representations such as repr(C). In low-level account work, repr(C) gives more predictable ordering and alignment behavior, but it does not remove all complexity. Padding still appears between fields when alignment requires it. For example, a u8 followed by u64 introduces 7 bytes of padding before the u64 offset. If your parser ignores this, every field after that point is shifted and corrupted.

On Solana, account rent is proportional to byte size, so padding is not only a correctness issue; it is a cost issue. Poor field ordering can inflate account sizes across millions of accounts. A common optimization is grouping larger aligned fields first, then smaller fields. But this must be balanced against readability and migration safety. If you reorder fields in a live protocol, old data may no longer parse under new assumptions. Migration tooling should be explicit and versioned.

Borsh serialization avoids some ABI ambiguity by defining field order in schema rather than raw struct memory. However, zero-copy patterns and manual slicing still depend on precise offsets. Teams should understand both worlds: in-memory layout rules for zero-copy and schema-based encoding rules for Borsh.

In production engineering, layout decisions should be documented with deterministic outputs: field offsets, per-field padding, struct alignment, and total size. These outputs can be compared in CI to catch accidental drift from refactors. The goal is not theoretical elegance; the goal is stable data contracts over time.

## Operator mindset

Schema bytes are production API surface. Treat offset changes, enum ordering, and parser semantics as compatibility events requiring explicit review.
${appendix}`,
  blocks: [
    {
      type: "quiz",
      id: "rdb-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "rdb-v2-l1-q1",
          prompt: "Why does a u8 before u64 often increase account size?",
          options: ["Alignment inserts padding bytes", "Borsh compresses zeros", "RPC forces 8-byte packets"],
          answerIndex: 0,
          explanation: "u64 alignment usually forces padding after smaller fields.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "rdb-v2-borsh-enums-vectors-strings",
  slug: "rdb-v2-borsh-enums-vectors-strings",
  title: "Struct and enum layout pitfalls plus Borsh rules",
  type: "content",
  xpReward: 50,
  duration: "55 min",
  content: `# Struct and enum layout pitfalls plus Borsh rules

Borsh is widely used because it gives deterministic serialization across languages, but teams still get tripped up by how enums, vectors, and strings map to bytes. Understanding these rules is essential for robust account parsing and client interoperability.

For structs, Borsh encodes fields in declaration order. There is no implicit alignment padding in the serialized stream. That is different from in-memory layout and one reason Borsh is popular for stable wire formats. For enums, Borsh writes a one-byte variant index first, then the variant payload. Changing variant order in code changes the index mapping and is therefore a breaking format change. This is a common source of accidental incompatibility.

Vectors and strings are length-prefixed with little-endian u32 before data bytes. If parsing code trusts the length blindly without bounds checks, malformed or truncated data can cause out-of-bounds reads or allocation abuse. Safe parsers validate available bytes before allocating or slicing.

Another pitfall is conflating pubkey strings with pubkey bytes. Borsh encodes bytes, not base58 text. If a client serializes public keys as strings while another expects 32-byte arrays, decoding fails despite both sides using "Borsh" terminology. Teams should define schema types precisely.

Error design is part of serialization safety. Distinguish malformed length prefix, unknown enum variant, unsupported dynamic type, and primitive decode out-of-bounds. Structured errors let callers decide whether to retry, drop, or quarantine payloads.

Finally, encoding and decoding tests should run symmetrically with fixed fixtures. A deterministic fixture suite catches regressions early and gives confidence that Rust, TypeScript, and analytics parsers agree on the same bytes.${appendix}`,
  blocks: [
    {
      type: "terminal",
      id: "rdb-v2-l2-terminal",
      title: "Borsh Encoding Notes",
      steps: [
        {
          cmd: "encode name='sol' level=7",
          output: "[3,0,0,0,115,111,108,7]",
          note: "u32 length + UTF-8 bytes + u8 field",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "rdb-v2-layout-visualizer",
  slug: "rdb-v2-layout-visualizer",
  title: "Explorer: layout visualizer for field offsets",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Explorer: layout visualizer for field offsets

A layout visualizer turns abstract alignment rules into concrete numbers engineers can review. Instead of debating whether a struct is "probably fine," teams can inspect exact offsets, padding, and total size.

The visualizer workflow is straightforward: provide ordered fields and types, compute alignments, insert required padding, and emit final layout metadata. This output should be deterministic and serializable so CI can compare snapshots.

When using this in Solana development, combine visualizer output with account rent planning and migration docs. If a proposed field addition increases total size, quantify the impact and decide whether to append, split account state, or introduce versioned accounts. Do not rely on intuition for byte-level decisions.

Visualizers are also useful for onboarding. New contributors can quickly see why u8/u64 ordering changes offsets and why safe parsers need explicit bounds checks. This reduces recurring parsing bugs and review churn.

A high-quality visualizer report includes field name, offset, size, alignment, padding-before, trailing padding, and struct alignment. Keep key ordering stable so report diffs remain readable.

Engineers should pair visualizer output with parse tests. If layout says a bool lives at offset 0 and u8 at offset 1, parser tests should assert exactly that. Deterministic systems connect design artifacts and runtime checks.${appendix}`,
  blocks: [
    {
      type: "explorer",
      id: "rdb-v2-l3-explorer",
      title: "Layout Explorer Snapshot",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Small struct",
            address: "layout111111111111111111111111111111111111",
            lamports: 16,
            owner: "BorshLayout1111111111111111111111111111111",
            executable: false,
            dataLen: 16,
          },
          {
            label: "Expanded struct",
            address: "layout222222222222222222222222222222222222",
            lamports: 40,
            owner: "BorshLayout1111111111111111111111111111111",
            executable: false,
            dataLen: 40,
          },
        ],
      },
    },
  ],
};

const lesson4: Challenge = {
  id: "rdb-v2-compute-layout",
  slug: "rdb-v2-compute-layout",
  title: "Challenge: implement computeLayout()",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Compute deterministic field offsets, alignment padding, and total struct size.",
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "rdb-v2-borsh-encode-decode",
  slug: "rdb-v2-borsh-encode-decode",
  title: "Challenge: implement borshEncode/borshDecode helpers",
  type: "challenge",
  xpReward: 60,
  duration: "40 min",
  language: "typescript",
  content: "Implement deterministic Borsh encode/decode with structured error handling.",
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Challenge = {
  id: "rdb-v2-zero-copy-tradeoffs",
  slug: "rdb-v2-zero-copy-tradeoffs",
  title: "Challenge: zero-copy vs Borsh tradeoff model",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Model deterministic tradeoff scoring between zero-copy and Borsh approaches.",
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Challenge = {
  id: "rdb-v2-safe-parse-account-data",
  slug: "rdb-v2-safe-parse-account-data",
  title: "Challenge: implement safeParseAccountData()",
  type: "challenge",
  xpReward: 55,
  duration: "35 min",
  language: "typescript",
  content: "Parse account bytes with deterministic bounds checks and structured errors.",
  starterCode: lesson7StarterCode,
  testCases: lesson7TestCases,
  hints: lesson7Hints,
  solution: lesson7SolutionCode,
};

const lesson8: Challenge = {
  id: "rdb-v2-layout-report-checkpoint",
  slug: "rdb-v2-layout-report-checkpoint",
  title: "Checkpoint: stable layout report",
  type: "challenge",
  xpReward: 70,
  duration: "45 min",
  language: "typescript",
  content: "Produce stable JSON and markdown layout artifacts for the final project.",
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "rdb-v2-foundations",
  title: "Data Layout Foundations",
  description:
    "Alignment behavior, Borsh encoding rules, and practical parsing safety for stable byte-level contracts.",
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: "rdb-v2-project-journey",
  title: "Account Layout Inspector Project Journey",
  description:
    "Implement deterministic layout analysis, encoding/decoding, safe parsing, and compatibility-focused reporting helpers.",
  lessons: [lesson4, lesson5, lesson6, lesson7, lesson8],
};

export const rustDataLayoutBorshCourse: Course = {
  id: "course-rust-data-layout-borsh",
  slug: "rust-data-layout-borsh",
  title: "Rust Data Layout & Borsh Mastery",
  description:
    "Rust-first Solana data layout engineering with deterministic byte-level tooling and compatibility-safe schema practices.",
  difficulty: "advanced",
  duration: "10 hours",
  totalXP: 445,
  tags: ["rust", "borsh", "data-layout", "solana"],
  imageUrl: "/images/courses/rust-data-layout-borsh.svg",
  modules: [module1, module2],
};
