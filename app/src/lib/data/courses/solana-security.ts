import type { Course, Module, Lesson, Challenge } from '@/types/content';

const lesson1: Lesson = {
  id: 'missing-signer-checks',
  slug: 'missing-signer-checks',
  title: 'Missing Signer Checks',
  type: 'content',
  xpReward: 150,
  duration: '45 min',
  content: `# Missing Signer Checks

A missing signer check is one of the most common and most severe classes of Solana vulnerabilities. In Solana, any account can be passed into an instruction if the transaction message includes it. That means program code cannot assume an account is controlled by a user unless it explicitly checks signature requirements. If a handler updates privileged state, moves funds, changes authorities, or writes governance settings without confirming that an authorized signer signed the transaction, an attacker can submit the same instruction with forged account context and gain control.

In raw Rust programs, signer validation is usually done by checking the account metadata and failing if \
\`!account_info.is_signer\`. In Anchor, using \
\`Signer<'info>\` in the accounts struct enforces this automatically. Problems arise when developers use \
\`UncheckedAccount<'info>\`, \
\`AccountInfo<'info>\`, or even \
\`Account<'info, T>\` for an authority account but forget to add \
\`has_one\` or explicit equality checks. The program compiles, tests may pass in happy paths, and then production traffic reveals that an arbitrary wallet can call the instruction.

A classic exploit pattern is an admin rotation endpoint:

\`\`\`rust
pub fn set_admin(ctx: Context<SetAdmin>, new_admin: Pubkey) -> Result<()> {
    // Vulnerable if authority isn't verified as signer and current admin
    ctx.accounts.config.admin = new_admin;
    Ok(())
}
\`\`\`

If \
\`authority\` is not constrained, anyone can rewrite \
\`config.admin\`. A similar issue appears in vault withdrawals, treasury spending, and upgrade authorities. Another subtle variant is checking that a signer exists, but not checking it is the expected signer. That is still broken: any signer can approve.

Prevention patterns:

- Use strict account types: \
\`Signer<'info>\`, \
\`Program<'info, ...>\`, \
\`Account<'info, ...>\`.
- Bind authority to state with \
\`has_one = authority\`.
- Add explicit key checks: \
\`require_keys_eq!(authority.key(), config.admin, ErrorCode::Unauthorized)\`.
- Write negative tests where an attacker signer attempts privileged actions.
- Audit every instruction for “who is allowed to do this?” and enforce it at account validation and instruction logic layers.

Signer checks are cheap, explicit, and non-optional in secure Solana programs.`
};

const lesson2: Lesson = {
  id: 'account-validation',
  slug: 'account-validation',
  title: 'Account Validation',
  type: 'content',
  xpReward: 150,
  duration: '45 min',
  content: `# Account Validation

Account validation on Solana is fundamentally about proving identity and intent of each account passed into an instruction. Because callers control account lists, the program must reject malformed, substituted, or adversarial accounts. Failing to validate account ownership, seeds, discriminators, or expected relationships leads to type confusion, account substitution, and privilege escalation.

Owner checks are the first gate. For example, if a handler expects an SPL Token account, the \
\`owner\` of that account data must be the Token Program ID. If code deserializes arbitrary bytes as a token account without verifying program ownership, attackers can provide a fake account with crafted bytes. In Anchor, typed \
\`Account<'info, T>\` helps, but for external account types or unchecked accounts, explicit checks are mandatory.

Type confusion often appears when programs deserialize account data into a struct without verifying the 8-byte Anchor discriminator (or equivalent schema marker). An attacker can pass a different account type with overlapping fields, tricking logic paths. Similarly, account substitution happens when an instruction expects “the user vault PDA” but accepts any writable account and writes sensitive state into attacker-controlled storage.

PDA validation best practices:

- Recompute PDAs inside the program with \
\`Pubkey::find_program_address\` or Anchor \
\`seeds\` constraints.
- Compare both key and bump.
- Never trust user-supplied bump values without verification.
- Avoid using dynamic seeds that can be influenced unexpectedly.

Example secure Anchor constraint:

\`\`\`rust
#[account(
  mut,
  seeds = [b"vault", user.key().as_ref()],
  bump = vault.bump,
  has_one = user
)]
pub vault: Account<'info, VaultState>;
\`\`\`

Also verify relational constraints: if a position references a market, ensure the position’s stored market key equals the passed market account key. If a receipt references an authority, ensure keys match. Every cross-account invariant should be asserted.

Testing for validation flaws should include adversarial cases: substitute one account with another valid account of same type, pass a random PDA with matching shape, pass accounts owned by wrong programs, and mutate account ordering. Security reviews should trace each account from instruction entry to state mutation and confirm every trust assumption is enforced.

Strong account validation is the backbone of Solana security. Without it, otherwise correct business logic can be fully compromised.`
};

const lesson3: Lesson = {
  id: 'integer-overflow',
  slug: 'integer-overflow',
  title: 'Integer Overflow and Underflow',
  type: 'content',
  xpReward: 150,
  duration: '45 min',
  content: `# Integer Overflow and Underflow

Arithmetic vulnerabilities in financial programs are catastrophic because balances, shares, debt indexes, and fee calculations are integer-based. In Rust, behavior depends on build configuration: debug builds panic on overflow, while release builds can wrap unless checked operations are used. Solana programs are compiled in release mode for deployment, so relying on debug behavior is unsafe.

In token protocols, common vulnerable formulas include:

- \
\`new_balance = old_balance + amount\`
- \
\`shares = deposit * total_shares / total_assets\`
- \
\`fee = amount * fee_bps / 10_000\`

Each line can overflow if operands are large enough. An attacker can craft edge values to wrap balances, bypass limits, mint excess shares, or force liquidation math into invalid states.

Use safe math patterns:

\`\`\`rust
let new_balance = old_balance
    .checked_add(amount)
    .ok_or(ErrorCode::MathOverflow)?;

let fee = amount
    .checked_mul(fee_bps)
    .ok_or(ErrorCode::MathOverflow)?
    .checked_div(10_000)
    .ok_or(ErrorCode::DivisionByZero)?;
\`\`\`

Underflow is equally dangerous when subtracting collateral, debt, or reserves. Always use \
\`checked_sub\` and fail if the result would be negative. For division, handle zero denominators explicitly.

In Anchor codebases, developers often assume token amounts are small enough for \
\`u64\`, but aggregate values (TVL, cumulative interest indices, protocol totals) may require \
\`u128\` intermediates to avoid overflow during multiplication before division. A robust pattern is to cast inputs to \
\`u128\`, compute, then downcast with range checks:

\`\`\`rust
let result_u128 = (amount as u128)
    .checked_mul(rate as u128)
    .ok_or(ErrorCode::MathOverflow)?
    .checked_div(1_000_000u128)
    .ok_or(ErrorCode::DivisionByZero)?;
let result = u64::try_from(result_u128).map_err(|_| ErrorCode::MathOverflow)?;
\`\`\`

Testing must include boundary values: \
\`u64::MAX\`, near-zero values, one-unit dust values, and large batched operations. Fuzzing is especially effective for discovering arithmetic corner cases that unit tests miss.

Finally, define explicit error codes for overflow/underflow and fail fast. Silent wraps are never acceptable in on-chain finance. Correct arithmetic design is both a safety requirement and an audit baseline.`
};

const lesson4: Challenge = {
  id: 'security-audit-challenge',
  slug: 'security-audit-challenge',
  title: 'Security Audit Challenge',
  type: 'challenge',
  xpReward: 300,
  duration: '60 min',
  language: 'typescript',
  content: `# Security Audit Challenge

You are auditing a simplified Solana program snippet that intentionally contains three vulnerabilities. Implement a function that returns the list of vulnerabilities you identify.

Required findings:

1. Missing signer check
2. Missing owner check
3. Integer overflow risk

Return these findings as a comma-separated string in this exact canonical order:

\`missing-signer-check,missing-owner-check,integer-overflow\`

You can compute the result however you want, but tests will validate the expected vulnerabilities are detected.`,
  starterCode: `type Finding =
  | "missing-signer-check"
  | "missing-owner-check"
  | "integer-overflow";

const vulnerableProgramSnippet = [
  'pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {',
  '  // No signer check for authority',
  '  if ctx.accounts.vault.owner != ctx.accounts.token_program.key() {',
  '    // Owner check is wrong target and incomplete',
  '  }',
  '  ctx.accounts.vault.total_withdrawn = ctx.accounts.vault.total_withdrawn + amount;',
  '  Ok(())',
  '}',
].join('\\n');

export function identifyVulnerabilities(_source: string): string {
  // TODO: Return comma-separated findings in canonical order.
  // required: missing-signer-check,missing-owner-check,integer-overflow
  return "";
}

identifyVulnerabilities(vulnerableProgramSnippet);`,
  testCases: [
    {
      name: 'Includes missing signer check',
      input: '{}',
      expectedOutput: 'missing-signer-check,missing-owner-check,integer-overflow'
    },
    {
      name: 'Includes missing owner check',
      input: '{"focus":"owner"}',
      expectedOutput: 'missing-signer-check,missing-owner-check,integer-overflow'
    },
    {
      name: 'Includes integer overflow',
      input: '{"focus":"math"}',
      expectedOutput: 'missing-signer-check,missing-owner-check,integer-overflow'
    }
  ],
  hints: [
    'The answer must include exactly three findings in canonical order.',
    'Look for authorization (signer), account ownership validation, and unsafe arithmetic.',
    'Return a single comma-separated string, not an array.'
  ],
  solution: `type Finding =
  | "missing-signer-check"
  | "missing-owner-check"
  | "integer-overflow";

const vulnerableProgramSnippet = \
\`
pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // No signer check for authority
    if ctx.accounts.vault.owner != ctx.accounts.token_program.key() {
        // Owner check is wrong target and incomplete
    }

    // Potential overflow in accounting math
    ctx.accounts.vault.total_withdrawn = ctx.accounts.vault.total_withdrawn + amount;
    Ok(())
}
\`;

export function identifyVulnerabilities(_source: string): string {
  const findings: Finding[] = [
    "missing-signer-check",
    "missing-owner-check",
    "integer-overflow",
  ];

  return findings.join(",");
}

identifyVulnerabilities(vulnerableProgramSnippet);`
};

const lesson5: Lesson = {
  id: 'reentrancy-and-cpi',
  slug: 'reentrancy-and-cpi',
  title: 'Reentrancy and CPI Safety',
  type: 'content',
  xpReward: 175,
  duration: '45 min',
  content: `# Reentrancy and CPI Safety

Solana does not have EVM-style synchronous fallback functions, but cross-program invocations (CPIs) can still create reentrancy-like logic hazards. A program that performs external calls before finalizing internal state can be manipulated through unexpected control flow, repeated invocation patterns, or stale assumptions about account state after CPI execution.

A common anti-pattern is “check, CPI, mutate” where sensitive checks happen first, then an external token transfer or plugin call is made, and only afterward state is updated. If the external call can influence subsequent state assumptions or trigger additional invocations in the same transaction path, the program may execute with inconsistent invariants.

Safer ordering is “check, mutate, CPI where possible,” or “check, lock, CPI, unlock.” For example, in a vault withdrawal instruction:

1. Validate authority, amounts, and vault state.
2. Mark an in-progress flag or decrement internal accounting first.
3. Execute CPI transfer.
4. Finalize and clear lock.

If CPI fails, the entire transaction reverts, preserving atomicity. But if your logic emits side effects in different accounts and not all are protected, CPI behavior can still be abused.

Recommended controls:

- Introduce explicit reentrancy guard fields on critical accounts (e.g., \
\`is_withdrawing\`).
- Validate all writable accounts before and after CPI if external programs can mutate them.
- Minimize writable account sets passed to CPI.
- Avoid passing privileged signer seeds to untrusted CPI targets.
- Use strict CPI allowlists: only invoke known program IDs.

Example of a lock pattern:

\`\`\`rust
require!(!vault.is_locked, ErrorCode::VaultLocked);
vault.is_locked = true;

// perform CPI transfer

vault.is_locked = false;
\`\`\`

Auditors should trace each CPI call graph and ask: can this path re-enter an instruction that assumes pre-CPI state? can any downstream program mutate accounts we later trust? does a partial logic path leave stale flags?

While Solana’s runtime model differs from EVM, CPI-induced state hazards are real. Design with explicit state transitions, lock discipline, and strict account scoping to prevent cross-program control-flow abuse.`
};

const lesson6: Lesson = {
  id: 'oracle-manipulation',
  slug: 'oracle-manipulation',
  title: 'Oracle Manipulation',
  type: 'content',
  xpReward: 175,
  duration: '45 min',
  content: `# Oracle Manipulation

Oracle manipulation is one of the highest-impact attack classes in DeFi. If protocol logic trusts a single instantaneous price, attackers can move that price briefly, trigger profitable liquidations or undercollateralized borrows, and exit before markets normalize. Flash liquidity and capital-efficient routing make this practical even in deep markets.

On Solana, protocols commonly consume Pyth data. Pyth provides both price and confidence interval, and includes publish timestamps. A secure integration should never read only the \
\`price\` field. It should validate freshness, confidence width, and market status.

Core controls:

- **Freshness bound**: reject prices older than a threshold (e.g., 30-60 seconds).
- **Confidence filter**: reject high-uncertainty prices where confidence/price exceeds policy.
- **Deviation checks**: compare to previous accepted price and cap per-update movement.
- **Multi-oracle checks**: compare Pyth with another source; halt on large divergence.

Flash-loan-assisted manipulation usually targets spot-sensitive logic. A robust defense is using TWAP (time-weighted average price) over a window instead of instant spot values. TWAP smooths transient spikes but must be tuned to avoid excessive lag in volatile markets.

Example policy idea:

\`\`\`text
if stale -> reject
if confidence > 1% of price -> reject
if abs(price - median(last_n_prices)) > 5% -> circuit breaker
\`\`\`

Liquidation and borrow engines should also include safety haircuts. Even with clean oracle input, collateral value should be discounted to absorb latency and adverse moves. For high-volatility assets, require larger buffers.

When integrating Pyth, use confidence intervals as risk signals, not optional metadata. For critical systems, aggregate across oracle providers, include health monitors, and expose guardian controls to pause actions under anomalous feed behavior.

Finally, test attack scenarios in simulation: manipulated spot pools, delayed updates, and divergent oracles. If your protocol remains solvent under these conditions, your oracle layer is likely robust. If not, the issue is usually insufficient validation policy, not just feed choice.`
};

const lesson7: Lesson = {
  id: 'frontrunning-mev',
  slug: 'frontrunning-mev',
  title: 'Frontrunning and MEV on Solana',
  type: 'content',
  xpReward: 175,
  duration: '45 min',
  content: `# Frontrunning and MEV on Solana

MEV (Maximal Extractable Value) is the profit obtainable by influencing transaction ordering. On Solana, high throughput and low latency do not eliminate MEV; they change its shape. Searchers can still detect profitable pending transactions, submit competing transactions, and capture value from users through sandwiching, arbitrage backruns, or liquidation races.

A classic sandwich attack has three steps:

1. Attacker sees user swap with weak slippage limits.
2. Attacker front-runs by buying the target asset first.
3. User executes at a worse price.
4. Attacker back-runs by selling, capturing spread.

Solana’s parallel runtime complicates ordering dynamics, but practical MEV still depends on leader behavior, mempool visibility, and relayer infrastructure. Jito introduced bundle flow where transactions can be submitted as ordered bundles for atomic inclusion, reducing certain race conditions and enabling protected order flow.

Defensive patterns for dApps:

- Set conservative default slippage and warn users on high slippage.
- Use quote freshness checks and force re-quote on delays.
- Support private or protected transaction submission paths when available.
- Split large trades across time or routing paths to reduce single-shot impact.
- Use batch auction or request-for-quote designs for high-value swaps.

Protocol-level protections:

- Include minimum output checks on-chain.
- Validate price impact against oracle-based fair value bands.
- Reject abnormal execution paths that exceed policy thresholds.

Example min-out pattern:

\`\`\`rust
require!(actual_out >= min_out, ErrorCode::SlippageExceeded);
\`\`\`

For liquidation systems, MEV is often unavoidable; the goal is fair competition and protocol solvency. Use deterministic reward rules, bounded bonuses, and healthy keeper decentralization.

Monitoring is essential. Track slippage anomalies, failed-user-then-successful-searcher patterns, and repeated same-slot adverse fills. These are practical MEV indicators.

MEV cannot be “removed,” but systems can be engineered to minimize toxic extraction and protect users. Good product defaults, strong on-chain guards, and informed transaction routing are the most effective mitigation stack on Solana today.`
};

const module1: Module = {
  id: 'module-common-vulnerabilities',
  title: 'Common Vulnerabilities',
  description: 'Critical audit patterns for Solana programs.',
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: 'module-advanced-attack-vectors',
  title: 'Advanced Attack Vectors',
  description: 'Adversarial modeling for production protocols.',
  lessons: [lesson5, lesson6, lesson7],
};

export const solanaSecurityCourse: Course = {
  id: 'course-solana-security',
  slug: 'solana-security',
  title: 'Solana Security & Auditing',
  description:
    'Learn practical security engineering and auditing for Solana programs, from authorization bugs to oracle and MEV attack surfaces.',
  difficulty: 'advanced',
  duration: '10 hours',
  totalXP: 2000,
  tags: ['security', 'audit', 'exploit', 'advanced'],
  imageUrl: '/images/courses/solana-security.jpg',
  modules: [module1, module2],
};
