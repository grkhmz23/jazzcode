import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson3Hints,
  lesson3SolutionCode,
  lesson3StarterCode,
  lesson3TestCases,
} from "@/lib/courses/solana-indexing/challenges/lesson-3-decode-token-account";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-indexing/challenges/lesson-5-index-transactions";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-indexing/challenges/lesson-8-analytics-checkpoint";

const lesson1: Lesson = {
  id: "indexing-v2-events-model",
  slug: "indexing-v2-events-model",
  title: "Events model: transactions, logs, and program instructions",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Events model: transactions, logs, and program instructions

Indexing Solana starts with understanding where data lives and how to extract structured events from raw chain data. Unlike EVM chains where events are explicit log topics, Solana encodes program state changes in account updates and program logs. Your indexer must parse these sources and transform them into a queryable event stream.

A transaction on Solana contains one or more instructions. Each instruction targets a program, includes account metas, and carries opaque instruction data. When executed, programs emit log entries via solana_program::msg or similar macros. These logs, combined with pre/post account states, form the raw material for event indexing.

The indexer pipeline typically follows: fetch → parse → normalize → store. Fetch retrieves transaction metadata via RPC or geyser plugins. Parse extracts program logs and account diffs. Normalize converts raw data into domain-specific events with stable schemas. Store persists events with appropriate indexing for queries.

Key concepts for normalization: instruction program IDs identify which decoder to apply, account ownership determines data layout, and log prefixes often indicate event types (e.g., "Transfer", "Mint", "Burn"). Your indexer must handle multiple program versions gracefully, maintaining backward compatibility as instruction layouts evolve.

Idempotency is critical. Block reorganizations are rare on Solana but possible during forks. Your indexing pipeline should handle replayed transactions without duplicating events. This typically means using transaction signatures as unique keys and implementing upsert semantics in the storage layer.

## Checklist
- Understand transaction → instructions → logs hierarchy
- Identify program IDs and account ownership for data layout selection
- Normalize raw logs into domain events with stable schemas
- Implement idempotent ingestion using transaction signatures
- Plan for program version evolution in decoders

## Red flags
- Parsing logs without validating program IDs
- Assuming fixed account ordering across program versions
- Missing idempotency leading to duplicate events
- Storing raw data without normalized event extraction
`,
  blocks: [
    {
      type: "quiz",
      id: "indexing-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "indexing-v2-l1-q1",
          prompt: "What is the primary source of event data on Solana?",
          options: [
            "Program logs and account state changes",
            "Explicit event topics like EVM",
            "Validator consensus messages",
          ],
          answerIndex: 0,
          explanation: "Solana programs emit events via logs and state changes, not explicit event topics.",
        },
        {
          id: "indexing-v2-l1-q2",
          prompt: "Why is idempotency important in indexing?",
          options: [
            "To prevent duplicate events during replays or forks",
            "To improve RPC response times",
            "To reduce storage costs",
          ],
          answerIndex: 0,
          explanation: "Idempotent ingestion ensures the same transaction processed twice creates only one event.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "indexing-v2-token-decoding",
  slug: "indexing-v2-token-decoding",
  title: "Token account decoding and SPL layout",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Token account decoding and SPL layout

SPL Token accounts follow a standardized binary layout that indexers must parse to track balances and mint operations. Understanding this layout enables you to extract meaningful data from raw account bytes without relying on external APIs.

A token account contains: mint address (32 bytes), owner address (32 bytes), amount (8 bytes u64), delegate (32 bytes, optional), state (1 byte), is_native (1 byte + 8 bytes if native), delegated_amount (8 bytes), and close_authority (36 bytes optional). The total size is typically 165 bytes for standard accounts.

Account discriminators help identify account types. SPL Token accounts are owned by the Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) or Token-2022. Your indexer should verify ownership before attempting to parse, as malicious accounts could mimic data layouts.

Decoding involves: read the 32-byte mint, verify it matches expected token, read the 64-bit amount (little-endian), convert to decimal representation using mint decimals, and track owner for balance aggregation. Always handle malformed data gracefully - truncated accounts or unexpected sizes should not crash the indexer.

For balance diffs, compare pre-transaction and post-transaction states. A transfer emits no explicit event but changes two account amounts. Your indexer must detect these changes by comparing states before and after instruction execution.

## Checklist
- Verify token program ownership before parsing
- Decode mint, owner, and amount fields correctly
- Handle little-endian u64 conversion properly
- Support both Token and Token-2022 programs
- Implement graceful handling for malformed accounts

## Red flags
- Parsing without ownership verification
- Ignoring mint decimals in amount conversion
- Assuming fixed account sizes without bounds checking
- Missing balance diff detection for transfers
`,
  blocks: [
    {
      type: "explorer",
      id: "indexing-v2-l2-token-explorer",
      title: "Token Account Layout",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "SPL Token Account",
            address: "TokenAccount1111111111111111111111111111111",
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
      id: "indexing-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "indexing-v2-l2-q1",
          prompt: "What is the standard size of an SPL Token account?",
          options: ["165 bytes", "64 bytes", "256 bytes"],
          answerIndex: 0,
          explanation: "Standard SPL Token accounts are 165 bytes, containing mint, owner, amount, and optional fields.",
        },
        {
          id: "indexing-v2-l2-q2",
          prompt: "How should amount be interpreted from token account data?",
          options: [
            "As little-endian u64, then divided by 10^decimals",
            "As big-endian u32 directly",
            "As ASCII string",
          ],
          answerIndex: 0,
          explanation: "Amounts are stored as little-endian u64 and must be converted using the mint's decimal places.",
        },
      ],
    },
  ],
};

const lesson3: Challenge = {
  id: "indexing-v2-decode-token-account",
  slug: "indexing-v2-decode-token-account",
  title: "Challenge: Decode token account + diff token balances",
  type: "challenge",
  xpReward: 55,
  duration: "45 min",
  language: "typescript",
  content: `# Challenge: Decode token account + diff token balances

Implement deterministic token account decoding and balance diffing:

- Parse a 165-byte SPL Token account layout
- Extract mint, owner, and amount fields
- Compute balance differences between pre/post states
- Return normalized event objects with stable ordering

Your solution will be validated against multiple test cases with various token account states.`,
  starterCode: lesson3StarterCode,
  testCases: lesson3TestCases,
  hints: lesson3Hints,
  solution: lesson3SolutionCode,
};

const lesson4: Lesson = {
  id: "indexing-v2-transaction-meta",
  slug: "indexing-v2-transaction-meta",
  title: "Transaction meta parsing: logs, errors, and inner instructions",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Transaction meta parsing: logs, errors, and inner instructions

Transaction metadata provides the context needed to index complex operations. Understanding how to parse logs, handle errors, and traverse inner instructions enables comprehensive event extraction.

Program logs follow a hierarchical structure. The outermost logs show instruction execution order, while inner logs reveal CPI calls. Each log line typically includes a prefix indicating severity or type: "Program", "Invoke", "Success", "Fail", or custom program messages. Your parser should handle nested invocation levels correctly.

Error handling distinguishes between transaction-level failures and instruction-level failures. A transaction may succeed overall while individual instructions fail (and are rolled back). Conversely, a single failing instruction can cause the entire transaction to fail. Indexers should record these distinctions for accurate analytics.

Inner instructions reveal the complete execution trace. When a program makes CPI calls, these appear as inner instructions in transaction metadata. Indexers must traverse both top-level and inner instructions to capture all state changes. This is especially important for protocols like Jupiter that route through multiple DEXs.

Log filtering improves efficiency. Rather than parsing all logs, indexers can filter by program ID prefixes or known event signatures. However, be cautious - aggressive filtering might miss important events during protocol upgrades or edge cases.

## Checklist
- Parse program logs with proper nesting level tracking
- Distinguish transaction-level from instruction-level errors
- Traverse inner instructions for complete CPI traces
- Implement efficient log filtering by program ID
- Handle both success and failure scenarios

## Red flags
- Ignoring inner instructions and missing CPI events
- Treating all log failures as transaction failures
- Parsing without log level/depth context
- Missing error context in indexed events
`,
  blocks: [
    {
      type: "terminal",
      id: "indexing-v2-l4-logs",
      title: "Log Structure Example",
      steps: [
        {
          cmd: "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
          output: "Program log: Instruction: Transfer",
          note: "Top-level instruction at depth 1",
        },
        {
          cmd: "Program 11111111111111111111111111111111 invoke [2]",
          output: "Program log: Create account",
          note: "Inner CPI call at depth 2",
        },
        {
          cmd: "Program 11111111111111111111111111111111 success",
          output: "Program Tokenkeg... success",
          note: "Success bubbles up from inner to outer",
        },
      ],
    },
  ],
};

const lesson5: Challenge = {
  id: "indexing-v2-index-transactions",
  slug: "indexing-v2-index-transactions",
  title: "Challenge: Index transactions to normalized events",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Index transactions to normalized events

Implement a transaction indexer that produces normalized Event objects:

- Parse instruction logs and identify event types
- Extract transfer events with from/to/amount/mint
- Handle multiple events per transaction
- Return stable, canonical JSON with sorted keys
- Support idempotency via transaction signature deduplication`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "indexing-v2-pagination-caching",
  slug: "indexing-v2-pagination-caching",
  title: "Pagination, checkpointing, and caching semantics",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Pagination, checkpointing, and caching semantics

Production indexers must handle large datasets efficiently while maintaining consistency. Pagination, checkpointing, and caching form the backbone of scalable indexing infrastructure.

Pagination strategies depend on query patterns. Cursor-based pagination using transaction signatures provides stable ordering even during concurrent writes. Offset-based pagination can miss or duplicate entries during high-write periods. For time-series data, consider partitioning by slot or block time.

Checkpointing enables recovery from failures. Indexers should periodically save their processing position (last processed slot/signature) to durable storage. On restart, resume from the checkpoint rather than re-indexing from genesis. This pattern is essential for long-running indexers handling months of chain history.

Caching reduces redundant RPC calls. Account metadata, program IDs, and decoded instruction layouts can be cached with appropriate TTLs. However, cache invalidation is critical - stale cache entries can lead to incorrect decoding or missed events. Consider using slot-based versioning for cache entries.

Idempotent writes prevent data corruption. Even with checkpointing, duplicate processing can occur during retries. Use transaction signatures as unique identifiers and implement upsert semantics. Database constraints or unique indexes should enforce this at the storage layer.

## Checklist
- Implement cursor-based pagination for stable ordering
- Save periodic checkpoints for failure recovery
- Cache account metadata with slot-based invalidation
- Enforce idempotent writes via unique constraints
- Handle backfills without duplicating events

## Red flags
- Using offset pagination for high-write datasets
- Missing checkpointing requiring full re-index on restart
- Caching without proper invalidation strategies
- Allowing duplicate events from retry logic
`,
  blocks: [
    {
      type: "quiz",
      id: "indexing-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "indexing-v2-l6-q1",
          prompt: "Why is cursor-based pagination preferred for indexing?",
          options: [
            "It provides stable ordering during concurrent writes",
            "It requires less storage",
            "It is faster to implement",
          ],
          answerIndex: 0,
          explanation: "Cursor-based pagination handles concurrent writes without missing or duplicating entries.",
        },
        {
          id: "indexing-v2-l6-q2",
          prompt: "What enables indexer recovery after crashes?",
          options: [
            "Periodic checkpointing of last processed position",
            "Re-indexing from genesis on every start",
            "Caching all data in memory",
          ],
          answerIndex: 0,
          explanation: "Checkpoints allow indexers to resume from the last known good position.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "indexing-v2-analytics",
  slug: "indexing-v2-analytics",
  title: "Analytics aggregation: per wallet, per token metrics",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Analytics aggregation: per wallet, per token metrics

Raw event data becomes valuable through aggregation. Building analytics pipelines enables insights into user behavior, token flows, and protocol usage patterns.

Per-wallet analytics track individual user activity. Key metrics include: transaction count, unique tokens held, total volume transferred, first/last activity timestamps, and interaction patterns with specific programs. These metrics power user segmentation and engagement analysis.

Per-token analytics track asset-level metrics. Important aggregations include: total transfer volume, unique holders, holder distribution (whales vs retail), velocity (average time between transfers), and cross-program usage. These inform tokenomics analysis and market research.

Time-windowed aggregations support trend analysis. Daily, weekly, and monthly rollups enable comparison across time periods. Consider using tumbling windows for fixed periods or sliding windows for moving averages. Materialized views can pre-compute common aggregations for query performance.

Normalization ensures consistent comparisons. Convert all amounts to human-readable decimals, normalize timestamps to UTC, and use consistent address formatting (base58). Deduplicate events from failed transactions that may still appear in logs.

## Checklist
- Aggregate per-wallet metrics (volume, token count, activity)
- Aggregate per-token metrics (holders, velocity, distribution)
- Implement time-windowed rollups for trend analysis
- Normalize amounts, timestamps, and addresses
- Exclude failed transactions from aggregates

## Red flags
- Mixing raw and decimal-adjusted amounts
- Including failed transactions in volume metrics
- Missing time normalization across timezones
- Storing unbounded raw data without aggregation
`,
  blocks: [
    {
      type: "explorer",
      id: "indexing-v2-l7-analytics",
      title: "Analytics Dashboard",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Wallet Summary",
            address: "Wallet111111111111111111111111111111111111",
            lamports: 5000000000,
            owner: "SystemProgram11111111111111111111111111111111",
            executable: false,
            dataLen: 0,
          },
        ],
      },
    },
  ],
};

const lesson8: Challenge = {
  id: "indexing-v2-analytics-checkpoint",
  slug: "indexing-v2-analytics-checkpoint",
  title: "Checkpoint: Produce stable JSON analytics summary",
  type: "challenge",
  xpReward: 70,
  duration: "50 min",
  language: "typescript",
  content: `# Checkpoint: Produce stable JSON analytics summary

Implement the final analytics checkpoint that produces a deterministic summary:

- Aggregate events into per-wallet and per-token metrics
- Generate sorted, stable JSON output
- Include timestamp and summary statistics
- Handle edge cases (empty datasets, single events)

This checkpoint validates your complete indexing pipeline from raw data to analytics.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "indexing-v2-foundations",
  title: "Indexing Foundations",
  description: "Events model, token decoding, and transaction parsing fundamentals.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "indexing-v2-pipeline",
  title: "Indexing Pipeline & Analytics",
  description: "Building the indexer pipeline with checkpointing and analytics aggregation.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaIndexingCourse: Course = {
  id: "course-solana-indexing",
  slug: "solana-indexing",
  title: "Solana Indexing & Analytics",
  description:
    "Build a production-grade event indexer: token decoding, transaction parsing, checkpointing, and analytics aggregation with deterministic outputs.",
  difficulty: "intermediate",
  duration: "10 hours",
  totalXP: 400,
  tags: ["indexing", "analytics", "events", "tokens", "solana"],
  imageUrl: "/images/courses/solana-indexing.jpg",
  modules: [module1, module2],
};
