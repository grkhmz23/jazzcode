import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson3Hints,
  lesson3SolutionCode,
  lesson3StarterCode,
  lesson3TestCases,
} from "@/lib/courses/solana-performance/challenges/lesson-3-cost-model";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-performance/challenges/lesson-5-optimized-layout";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-performance/challenges/lesson-8-perf-checkpoint";

const lesson1: Lesson = {
  id: "performance-v2-compute-model",
  slug: "performance-v2-compute-model",
  title: "Compute model: budgets, costs, and limits",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Compute model: budgets, costs, and limits

Solana's compute model enforces deterministic execution limits through compute budgets. Understanding this model is essential for building efficient programs that stay within limits while maximizing utility.

Compute units (CUs) measure execution cost. Every operation consumes CUs: instruction execution, syscall usage, memory access, and logging. The default transaction limit is 200,000 CUs (1.4 million with prioritization), and each account has a 10MB max size limit.

Compute budget instructions allow transactions to request specific limits and set priority fees. The ComputeBudgetProgram provides: setComputeUnitLimit (override default), setComputeUnitPrice (set priority fee per CU in micro-lamports). Priority fees increase transaction inclusion probability during congestion.

Cost categories include: fixed costs (signature verification, account loading), variable costs (instruction execution, CPI calls), and memory costs (account data access size). Understanding these categories helps optimize the right areas.

Metering happens during execution. If a transaction exceeds its compute budget, execution halts and the transaction fails with an error. Failed transactions still pay fees for consumed CUs, making optimization economically important.

## Checklist
- Understand compute unit consumption categories
- Use ComputeBudgetProgram for specific limits
- Set priority fees during congestion
- Monitor CU usage during development
- Handle compute limit failures gracefully

## Red flags
- Ignoring compute limits in program design
- Using default limits unnecessarily high
- Not testing with realistic data sizes
- Missing priority fee strategies for important transactions
`,
  blocks: [
    {
      type: "quiz",
      id: "performance-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "performance-v2-l1-q1",
          prompt: "What is the default compute unit limit per transaction?",
          options: ["200,000 CUs", "1,400,000 CUs", "Unlimited"],
          answerIndex: 0,
          explanation: "The default limit is 200,000 CUs, extendable to 1.4M with ComputeBudgetProgram.",
        },
        {
          id: "performance-v2-l1-q2",
          prompt: "What happens when a transaction exceeds its compute budget?",
          options: [
            "Execution halts and the transaction fails",
            "It continues with reduced priority",
            "The network automatically extends the limit",
          ],
          answerIndex: 0,
          explanation: "Exceeding the compute budget causes immediate transaction failure.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "performance-v2-account-layout",
  slug: "performance-v2-account-layout",
  title: "Account layout design and serialization cost",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Account layout design and serialization cost

Account data layout significantly impacts compute costs. Well-designed layouts minimize serialization overhead and reduce account access costs.

Serialization formats affect cost. Borsh is the standard for Solana, offering compact binary encoding. Manual serialization can be more efficient for simple structures but increases bug risk. Avoid JSON or other text formats on-chain due to size and parsing cost.

Account size impacts costs linearly. Loading a 10KB account costs more than loading 1KB. Rent exemption requires more lamports for larger accounts. Design layouts to minimize size: use fixed-size arrays instead of Vecs where possible, pack booleans into bitflags, and use appropriate integer sizes (u8/u16/u32/u64).

Data structure alignment affects both size and access patterns. Group related fields together for cache efficiency. Place frequently accessed fields at the beginning of the struct. Consider zero-copy deserialization for read-heavy operations.

Versioning enables layout upgrades. Include a version byte at the start of account data. Migration logic can then handle different versions during deserialization. Plan for growth by reserving padding bytes in initial layouts.

## Checklist
- Use Borsh for standard serialization
- Minimize account data size
- Use appropriate integer sizes
- Plan for versioning and upgrades
- Consider zero-copy for read-heavy paths

## Red flags
- Using JSON for on-chain data
- Oversized Vec collections
- No versioning for upgrade paths
- Unnecessary large integer types
`,
  blocks: [
    {
      type: "explorer",
      id: "performance-v2-l2-layout",
      title: "Account Layout",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Optimized Account",
            address: "Optimized1111111111111111111111111111111",
            lamports: 10000000,
            owner: "Program111111111111111111111111111111111111",
            executable: false,
            dataLen: 256,
          },
        ],
      },
    },
  ],
};

const lesson3: Challenge = {
  id: "performance-v2-cost-model",
  slug: "performance-v2-cost-model",
  title: "Challenge: Implement estimateCost(op) model",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Implement estimateCost(op) model

Build a compute cost estimation system:

- Model costs for different operation types
- Account for instruction complexity
- Include memory access costs
- Return baseline measurements
- Handle edge cases (empty operations, large data)

Your estimator will be validated against known operation costs.`,
  starterCode: lesson3StarterCode,
  testCases: lesson3TestCases,
  hints: lesson3Hints,
  solution: lesson3SolutionCode,
};

const lesson4: Lesson = {
  id: "performance-v2-instruction-data",
  slug: "performance-v2-instruction-data",
  title: "Instruction data size and encoding optimization",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Instruction data size and encoding optimization

Instruction data size directly impacts transaction cost and throughput. Optimizing encoding reduces fees and increases the operations possible within compute limits.

Compact encoding uses minimal bytes to represent data. Use discriminants (u8) to identify instruction types. Use variable-length encoding (ULEB128) for sizes. Pack multiple boolean flags into a single u8 using bit manipulation. Avoid unnecessary padding.

Account deduplication reduces transaction size. If an account appears in multiple instructions, include it once in the account list and reference by index. This is especially important for CPI-heavy transactions.

Batching combines multiple operations into one transaction. Instead of N transactions with 1 instruction each, use 1 transaction with N instructions. Batching amortizes signature verification and account loading costs across operations.

Right-sizing vectors prevents overallocation. Use Vec::with_capacity when the size is known. Avoid unnecessary clones that increase heap usage. Consider stack-allocated arrays for small, fixed-size data.

## Checklist
- Use compact discriminants for instruction types
- Pack boolean flags into bitfields
- Deduplicate accounts across instructions
- Batch operations when possible
- Right-size collections to avoid waste

## Red flags
- Using full u32 for small discriminants
- Separate booleans instead of bitflags
- Duplicate accounts in transaction lists
- Unnecessary data cloning
`,
  blocks: [
    {
      type: "terminal",
      id: "performance-v2-l4-encoding",
      title: "Encoding Example",
      steps: [
        {
          cmd: "Before optimization",
          output: "200 bytes, 5 accounts",
          note: "Separate bools, duplicate accounts",
        },
        {
          cmd: "After optimization",
          output: "120 bytes, 3 accounts",
          note: "Bitflags, deduplicated accounts",
        },
        {
          cmd: "Savings",
          output: "40% size reduction",
          note: "Lower fees, higher throughput",
        },
      ],
    },
  ],
};

const lesson5: Challenge = {
  id: "performance-v2-optimized-layout",
  slug: "performance-v2-optimized-layout",
  title: "Challenge: Implement optimized layout/codec",
  type: "challenge",
  xpReward: 65,
  duration: "55 min",
  language: "typescript",
  content: `# Challenge: Implement optimized layout/codec

Optimize an account data layout while preserving semantics:

- Reduce data size through compact encoding
- Maintain all original functionality
- Preserve backward compatibility where possible
- Pass regression tests
- Measure and report size reduction

Your optimized layout should be smaller but functionally equivalent.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "performance-v2-compute-budget",
  slug: "performance-v2-compute-budget",
  title: "Compute budget instruction basics",
  type: "content",
  xpReward: 40,
  duration: "40 min",
  content: `# Compute budget instruction basics

Compute budget instructions give developers control over resource allocation and transaction prioritization. Understanding these tools enables precise optimization.

setComputeUnitLimit requests a specific CU budget. The default is 200,000, but you can request up to 1,400,000. Requesting more than needed wastes fees since you pay for the limit, not actual usage. Requesting too little causes failures.

setComputeUnitPrice sets a priority fee in micro-lamports per CU. During congestion, transactions with higher priority fees are more likely to be included. Priority fees are additional to base fees and go to validators.

Requesting compute units involves tradeoffs. Higher limits enable more complex operations but cost more. Priority fees increase inclusion probability but raise costs. Profile your transactions to set appropriate limits.

Heap size can also be configured. The default heap is 32KB, extendable to 256KB with compute budget instructions. Large heap enables complex data structures but increases CU consumption.

## Checklist
- Profile transactions to determine actual CU usage
- Set appropriate compute unit limits
- Use priority fees during congestion
- Consider heap size for data-heavy operations
- Monitor cost vs inclusion probability tradeoffs

## Red flags
- Always using maximum compute unit limits
- Not setting priority fees during congestion
- Ignoring heap size constraints
- Not profiling before optimization
`,
  blocks: [
    {
      type: "quiz",
      id: "performance-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "performance-v2-l6-q1",
          prompt: "What is the purpose of setComputeUnitPrice?",
          options: [
            "Set priority fee for transaction inclusion",
            "Set the maximum transaction size",
            "Enable additional program features",
          ],
          answerIndex: 0,
          explanation: "Priority fees increase the likelihood of transaction inclusion during network congestion.",
        },
        {
          id: "performance-v2-l6-q2",
          prompt: "Why request specific compute unit limits?",
          options: [
            "Pay only for what you need and prevent waste",
            "Increase transaction speed",
            "Enable more account access",
          ],
          answerIndex: 0,
          explanation: "Specific limits optimize costs - you pay for the limit requested, not actual usage.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "performance-v2-micro-optimizations",
  slug: "performance-v2-micro-optimizations",
  title: "Micro-optimizations and tradeoffs",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Micro-optimizations and tradeoffs

Performance optimization involves balancing competing concerns. Understanding tradeoffs helps make informed decisions about when and what to optimize.

Readability vs performance is a constant tension. Highly optimized code often sacrifices clarity. Optimize hot paths (frequently executed code) aggressively. Keep cold paths (rarely executed) readable and maintainable.

Space vs time tradeoffs appear frequently. Pre-computing values trades memory for speed. Compressing data trades CPU for storage. Choose based on which resource is more constrained for your use case.

Maintainability vs optimization matters for long-term projects. Aggressive optimizations can introduce bugs and make updates difficult. Document why optimizations exist and measure their impact.

Premature optimization is a common trap. Profile before optimizing to identify actual bottlenecks. Theoretical optimizations may not match real-world behavior. Focus on algorithmic improvements before micro-optimizations.

Security must never be sacrificed for performance. Bounds checking, ownership validation, and arithmetic safety are non-negotiable. Optimize around security, not through it.

## Checklist
- Profile before optimizing
- Focus on hot paths
- Document optimization decisions
- Balance readability and performance
- Never sacrifice security for speed

## Red flags
- Optimizing without profiling
- Sacrificing security for performance
- Unreadable code without documentation
- Optimizing cold paths unnecessarily
`,
  blocks: [
    {
      type: "quiz",
      id: "performance-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "performance-v2-l7-q1",
          prompt: "What is premature optimization?",
          options: [
            "Optimizing without profiling or evidence of need",
            "Optimizing before deployment",
            "Small performance improvements",
          ],
          answerIndex: 0,
          explanation: "Premature optimization wastes effort on theoretical rather than measured bottlenecks.",
        },
        {
          id: "performance-v2-l7-q2",
          prompt: "What should never be sacrificed for performance?",
          options: ["Security", "Code comments", "Variable names"],
          answerIndex: 0,
          explanation: "Security validations must remain regardless of performance optimizations.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "performance-v2-perf-checkpoint",
  slug: "performance-v2-perf-checkpoint",
  title: "Checkpoint: Compare before/after + output perf report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Compare before/after + output perf report

Complete the optimization lab checkpoint:

- Measure baseline performance metrics
- Apply optimization techniques
- Verify correctness is preserved
- Generate performance comparison report
- Output stable JSON with sorted keys

This validates your ability to optimize while maintaining correctness.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "performance-v2-foundations",
  title: "Performance Foundations",
  description: "Compute model, account layouts, and cost estimation.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "performance-v2-optimization",
  title: "Optimization & Analysis",
  description: "Layout optimization, compute budgets, and performance measurement.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaPerformanceCourse: Course = {
  id: "course-solana-performance",
  slug: "solana-performance",
  title: "Solana Performance & Compute Optimization",
  description:
    "Master Solana performance optimization: compute budgets, account layouts, encoding, and deterministic cost modeling.",
  difficulty: "advanced",
  duration: "11 hours",
  totalXP: 405,
  tags: ["performance", "optimization", "compute", "serialization", "solana"],
  imageUrl: "/images/courses/solana-performance.jpg",
  modules: [module1, module2],
};
