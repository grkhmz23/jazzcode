import type { Course, Module, Lesson, Challenge } from '@/types/content';

const lesson1: Lesson = {
  id: 'testing-approaches',
  slug: 'testing-approaches',
  title: 'Testing Approaches',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# Testing Approaches

Testing Solana programs requires multiple layers because failures can occur in logic, account validation, transaction composition, or network behavior. A production testing strategy usually combines unit tests, integration tests, and end-to-end validation across local validators and devnet.

**Unit tests** validate isolated business logic with minimal runtime overhead. In Rust, pure helper functions (math, state transitions, invariant checks) should be unit-tested aggressively because they are easy to execute and fast in CI.

**Integration tests** execute against realistic program invocation paths. For Anchor projects, this often means \
\`anchor test\` with local validator setup, account initialization flows, and instruction-level assertions. Integration tests should cover both positive and adversarial inputs, including invalid accounts, unauthorized signers, and boundary values.

**End-to-end tests** include frontend/client composition plus wallet and RPC interactions. They catch issues that lower layers miss: incorrect account ordering, wrong PDA derivations in client code, and serialization mismatches.

Common tools:

- \
\`solana-program-test\` for Rust-side testing with in-process banks simulation.
- \
\`solana-bankrun\` for deterministic TypeScript integration testing.
- Anchor TypeScript client for instruction building and assertions.
- Playwright/Cypress for app-level transaction flow tests.

Test coverage priorities:

1. Authorization and signer checks.
2. Account ownership and PDA seed constraints.
3. Arithmetic boundaries and fee logic.
4. CPI behavior and failure rollback.
5. Upgrade compatibility and migration paths.

A frequent anti-pattern is only testing happy paths with one wallet and static inputs. This misses most exploit classes. Robust suites include malicious account substitution, stale or duplicated accounts, and partial failure simulation.

In CI, separate fast deterministic suites from slower network-dependent suites. Run deterministic tests on every push, and run heavier devnet suites on merge or release.

Effective Solana testing is about confidence under adversarial conditions, not just green checkmarks. If your tests model attacker behavior and account-level edge cases, you will prevent the majority of production incidents before deployment.`
};

const lesson2: Lesson = {
  id: 'bankrun-testing',
  slug: 'bankrun-testing',
  title: 'Bankrun Testing',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# Bankrun Testing

Solana Bankrun provides deterministic, high-speed test execution for Solana programs from TypeScript environments. It emulates a local bank-like runtime where transactions can be processed predictably, accounts can be inspected directly, and temporal state can be manipulated for testing scenarios like vesting unlocks or oracle staleness.

Compared with relying on external devnet, Bankrun gives repeatability. This is crucial for CI pipelines where flaky network behavior can mask regressions.

Typical Bankrun workflow:

1. Start test context with target program loaded.
2. Create keypairs and funded test accounts.
3. Build and process transactions via BanksClient-like API.
4. Assert post-transaction account state.
5. Advance slots/time for time-dependent logic tests.

Conceptual setup:

\`\`\`typescript
// pseudocode
const context = await startBankrun({ programs: [...] });
const client = context.banksClient;

// process tx and inspect accounts deterministically
\`\`\`

Why Bankrun is powerful:

- Fast iteration for protocol teams.
- Deterministic block/slot control.
- Rich account inspection without explorer dependency.
- Easy simulation of multi-step protocol flows.

High-value Bankrun test scenarios:

- Liquidation eligibility after oracle/time movement.
- Vesting and cliff unlock schedule transitions.
- Fee accumulator updates across many operations.
- CPI behavior with mocked downstream account states.

Common mistakes:

- Asserting only transaction success without state validation.
- Ignoring rent and account lamport changes.
- Not testing replay/idempotency behaviors.

Use helper factories for test accounts and PDA derivations so tests remain concise. Keep transaction builders in reusable utilities to avoid drift between test and production clients.

Bankrun is not a replacement for all environments, but it is one of the best layers for deterministic integration confidence on Solana. Teams that invest in comprehensive Bankrun suites tend to catch state-machine bugs significantly earlier than teams relying only on devnet smoke tests.`
};

const lesson3: Challenge = {
  id: 'write-bankrun-test',
  slug: 'write-bankrun-test',
  title: 'Write a Counter Program Bankrun Test',
  type: 'challenge',
  xpReward: 200,
  duration: '50 min',
  language: 'typescript',
  content: `# Write a Counter Program Bankrun Test

Implement a helper that returns the expected counter value after a sequence of increment operations. This mirrors a deterministic assertion you would use in a Bankrun test.

Return the final numeric value as a string.`,
  starterCode: `interface CounterTestInput {
  initial: number;
  increments: number[];
}

export function expectedCounterValue(input: CounterTestInput): string {
  // TODO: Sum initial + all increments and return string value
  return '';
}

expectedCounterValue({ initial: 0, increments: [1, 1, 1] });`,
  testCases: [
    {
      name: 'Simple increments',
      input: '{"initial":0,"increments":[1,1,1]}',
      expectedOutput: '3'
    },
    {
      name: 'Mixed increments',
      input: '{"initial":10,"increments":[5,-2,7]}',
      expectedOutput: '20'
    },
    {
      name: 'No increments',
      input: '{"initial":42,"increments":[]}',
      expectedOutput: '42'
    }
  ],
  hints: [
    'Use Array.reduce to sum increments.',
    'Start reduce with the initial value.',
    'Convert final number to string before returning.'
  ],
  solution: `interface CounterTestInput {
  initial: number;
  increments: number[];
}

export function expectedCounterValue(input: CounterTestInput): string {
  const finalValue = input.increments.reduce((acc, value) => acc + value, input.initial);
  return String(finalValue);
}

expectedCounterValue({ initial: 0, increments: [1, 1, 1] });`
};

const lesson4: Lesson = {
  id: 'fuzzing-trident',
  slug: 'fuzzing-trident',
  title: 'Fuzzing with Trident',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# Fuzzing with Trident

Fuzzing explores large input spaces automatically to find bugs that handcrafted tests miss. For Solana and Anchor programs, Trident-style fuzzing workflows generate randomized instruction sequences and parameter values, then check invariants such as “total supply never decreases incorrectly” or “vault liabilities never exceed assets.”

Unlike unit tests that validate expected examples, fuzzing asks: what if inputs are weird, extreme, or adversarial in combinations we did not think about?

Core fuzzing components:

- **Generators** for instruction inputs and account states.
- **Harness** that executes generated transactions.
- **Invariants** that must always hold.
- **Shrinking** to minimize failing inputs for debugging.

Useful invariants in DeFi protocols:

- Conservation of value across transfers and burns.
- Non-negative balances and debt states.
- Authority invariants (only valid signer modifies privileged state).
- Price and collateral constraints under liquidation logic.

Fuzzing strategy tips:

- Start with a small instruction set and one invariant.
- Add stateful multi-step scenarios (deposit->borrow->repay->withdraw).
- Include random account ordering and malicious account substitution cases.
- Track coverage to avoid blind spots.

Coverage analysis matters: if fuzzing never reaches critical branches (error paths, CPI failure handlers, liquidation branches), it gives false confidence. Integrate branch coverage tools where possible.

Trident and similar fuzzers are especially good at discovering arithmetic edge cases, stale state assumptions, and unexpected state transitions from unusual call sequences.

CI integration approach:

- Run short fuzz campaigns on every PR.
- Run longer campaigns nightly.
- Persist failing seeds as regression tests.

Fuzzing should complement, not replace, deterministic tests. Deterministic suites provide explicit behavior guarantees; fuzzing provides adversarial exploration at scale.

For serious Solana protocols handling user funds, fuzzing is no longer optional. It is one of the highest-leverage investments for preventing unknown-unknown bugs before mainnet exposure.`
};

const lesson5: Lesson = {
  id: 'devnet-testing',
  slug: 'devnet-testing',
  title: 'Devnet Testing',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# Devnet Testing

Devnet testing bridges the gap between deterministic local tests and real-world network conditions. While local validators and Bankrun are ideal for speed and reproducibility, devnet reveals behavior under real RPC latency, block production timing, fee markets, and account history constraints.

A robust devnet test strategy includes:

- Automated program deployment to a dedicated devnet keypair.
- Deterministic fixture creation (airdrop, mint setup, PDAs).
- Smoke tests for critical instruction paths.
- Monitoring of transaction confirmation and log outputs.

Important devnet caveats:

- State is shared and can be noisy.
- Airdrop limits can throttle tests.
- RPC providers may differ in reliability and rate limits.

To reduce flakiness:

- Use dedicated namespaces/seeds per CI run.
- Add retries for transient network failures.
- Bound test runtime and fail with actionable logs.

Program upgrade testing is particularly important on devnet. Validate that new binaries preserve account compatibility and migrations execute as expected. Incompatible changes can brick existing accounts if not tested.

Checklist for release-candidate validation:

1. Deploy upgraded program binary.
2. Run migration instructions.
3. Execute backward-compatibility read paths.
4. Execute all critical write instructions.
5. Verify event/log schema expected by indexers.

For financial protocols, include oracle integration tests and liquidation path checks against live-like feeds if possible.

Devnet should not be your only quality gate, but it is the best pre-mainnet signal for environment-related issues. Teams that ship without meaningful devnet validation often discover RPC edge cases and timing bugs in production.

Treat devnet as a staging environment with disciplined test orchestration, clear observability, and explicit rollback plans.`
};

const lesson6: Lesson = {
  id: 'ci-cd-pipeline',
  slug: 'ci-cd-pipeline',
  title: 'CI/CD Pipeline for Solana',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# CI/CD Pipeline for Solana

A mature Solana CI/CD pipeline enforces quality gates across code, tests, security checks, and deployment workflows. For program teams, CI is not just linting Rust and TypeScript; it is about protecting on-chain invariants before irreversible releases.

Recommended pipeline stages:

1. **Static checks**: formatting, lint, type checks.
2. **Unit/integration tests**: deterministic local execution.
3. **Security checks**: dependency scan, optional static analyzers.
4. **Build artifacts**: reproducible program binaries.
5. **Staging deploy**: optional devnet deployment and smoke tests.
6. **Manual approval** for production deploy.

GitHub Actions is a common choice. A typical workflow matrix runs Rust and Node tasks in parallel to reduce cycle time. Cache Cargo and pnpm dependencies aggressively.

Example conceptual workflow snippets:

\`\`\`yaml
- run: cargo test --workspace
- run: pnpm lint && pnpm typecheck && pnpm test
- run: anchor build
- run: anchor test --skip-local-validator
\`\`\`

For deployments:

- Store deploy keypairs in secure secrets management.
- Restrict deploy jobs to protected branches/tags.
- Emit program IDs and transaction signatures as artifacts.

Program verification is critical. Where possible, verify deployed binary matches source-controlled build output. This strengthens trust and simplifies audits.

Operational safety practices:

- Use feature flags for high-risk logic activation.
- Keep rollback strategy documented.
- Monitor post-deploy metrics (error rates, failed tx ratio, latency).

Include regression tests for previously discovered bugs. Every production incident should produce a permanent automated test.

A strong CI/CD pipeline is an engineering control, not a convenience. It reduces release risk, accelerates safe iteration, and provides confidence that code changes preserve security and protocol correctness under production conditions.`
};

const module1: Module = {
  id: 'module-testing-foundations',
  title: 'Testing Foundations',
  description: 'Core testing strategy and deterministic integration workflows.',
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: 'module-advanced-testing',
  title: 'Advanced Testing',
  description: 'Fuzzing, devnet validation, and release pipelines.',
  lessons: [lesson4, lesson5, lesson6],
};

export const solanaTestingCourse: Course = {
  id: 'course-solana-testing',
  slug: 'solana-testing',
  title: 'Testing Solana Programs',
  description:
    'Build robust test strategy across local, simulated, and network environments for secure Solana program releases.',
  difficulty: 'intermediate',
  duration: '6 hours',
  totalXP: 1200,
  tags: ['testing', 'bankrun', 'anchor', 'devnet'],
  imageUrl: '/images/courses/solana-testing.jpg',
  modules: [module1, module2],
};
