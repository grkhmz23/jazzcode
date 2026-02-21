import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/solana-governance-multisig/challenges/lesson-4-quorum-voting";
import {
  lesson6Hints,
  lesson6SolutionCode,
  lesson6StarterCode,
  lesson6TestCases,
} from "@/lib/courses/solana-governance-multisig/challenges/lesson-6-multisig-builder";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-governance-multisig/challenges/lesson-8-treasury-execution";

const lesson1: Lesson = {
  id: "governance-v2-dao-model",
  slug: "governance-v2-dao-model",
  title: "DAO model: proposals, voting, and execution",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# DAO model: proposals, voting, and execution

Decentralized governance on Solana follows a proposal-based model where token holders vote on changes and the DAO treasury executes approved decisions. Understanding this flow is essential for building and participating in on-chain organizations.

The governance lifecycle has four stages: proposal creation (anyone with sufficient stake can propose), voting period (token holders vote for/against/abstain), queueing (successful proposals enter a timelock), and execution (the proposal's instructions are executed). Each stage has specific requirements and time constraints.

Proposal creation requires a minimum token deposit to prevent spam. The proposer submits: title, description link, and executable instructions (typically base64 serialized). Deposits are returned if the proposal passes, forfeited if it fails (depending on DAO configuration).

Voting power is typically determined by token balance at a specific snapshot block. Some DAOs use vote escrow (veToken) models where locking tokens for longer periods multiplies voting power. Quorum requirements ensure sufficient participation - a proposal needs both majority approval and minimum participation to pass.

Execution safety involves timelocks between approval and execution. This delay (often 1-7 days) allows users to exit if they disagree with the outcome. Emergency powers may exist for critical fixes but should require higher thresholds.

## Governance reliability rule

A proposal system is only credible if outcomes are reproducible from public inputs. That means deterministic vote math, explicit snapshot rules, clear timelock transitions, and auditable execution traces for treasury effects.

## Checklist
- Understand the four-stage governance lifecycle
- Know proposal deposit and spam prevention mechanisms
- Calculate voting power and quorum requirements
- Implement timelock safety delays
- Plan for emergency execution paths

## Red flags
- Allowing proposal creation without deposits
- Missing quorum requirements for participation
- Zero timelock on sensitive operations
- Unclear vote counting methodologies
`,
  blocks: [
    {
      type: "quiz",
      id: "governance-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "governance-v2-l1-q1",
          prompt: "What is the purpose of a timelock in governance?",
          options: [
            "Allow users time to exit if they disagree with outcomes",
            "Speed up transaction processing",
            "Reduce gas costs",
          ],
          answerIndex: 0,
          explanation: "Timelocks provide a safety window for users to react before changes take effect.",
        },
        {
          id: "governance-v2-l1-q2",
          prompt: "What determines voting power in most DAOs?",
          options: [
            "Token balance at snapshot block",
            "Number of transactions submitted",
            "Account age",
          ],
          answerIndex: 0,
          explanation: "Voting power is typically proportional to token holdings at a specific snapshot time.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "governance-v2-quorum-math",
  slug: "governance-v2-quorum-math",
  title: "Quorum math and vote weight calculation",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Quorum math and vote weight calculation

Accurate vote counting is critical for legitimate governance outcomes. Understanding quorum requirements, vote weight calculation, and edge cases ensures fair decision-making.

Quorum defines minimum participation for a valid vote. Common formulas include: absolute token amount (e.g., 4% of total supply must vote), relative to circulating supply, or dynamic based on recent participation. Quorum prevents small groups from making unilateral decisions.

Vote weight calculation considers: token balance at snapshot block, lockup duration multipliers (veToken model), delegation relationships, and abstention handling. Abstentions typically count toward quorum but not toward approval ratio.

Approval thresholds vary by proposal type. Simple majority (>50%) is standard for routine matters. Supermajority (e.g., 2/3) may be required for constitutional changes. Some DAOs use quadratic voting to reduce whale influence, though this has sybil resistance challenges.

Edge cases include: ties (usually fail), late vote changes (often blocked after deadline), vote delegation revocation timing, and quorum manipulation (e.g., flash loan attacks prevented by snapshot blocks).

## Checklist
- Define clear quorum formulas and minimums
- Calculate vote weights with snapshot blocks
- Handle abstentions appropriately
- Set appropriate approval thresholds by proposal type
- Protect against manipulation attacks

## Red flags
- No quorum requirements
- Vote weight based on current balance (flash loan risk)
- Unclear tie-breaking rules
- Changing rules mid-proposal
`,
  blocks: [
    {
      type: "explorer",
      id: "governance-v2-l2-vote-calc",
      title: "Vote Calculation",
      explorer: "AccountExplorer",
      props: {
        samples: [
          {
            label: "Voter Account",
            address: "Voter1111111111111111111111111111111111111",
            lamports: 1000000000,
            owner: "TokenProgram11111111111111111111111111111111",
            executable: false,
            dataLen: 165,
          },
        ],
      },
    },
  ],
};

const lesson3: Lesson = {
  id: "governance-v2-timelocks",
  slug: "governance-v2-timelocks",
  title: "Timelock states and execution scheduling",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Timelock states and execution scheduling

Timelocks provide a critical safety layer between governance approval and execution. Understanding timelock states and transitions ensures reliable proposal execution.

Timelock states include: pending (proposal passed, waiting for delay), ready (delay elapsed, can be executed), executed (instructions processed), cancelled (withdrawn by proposer or guardian), and expired (execution window passed). Each state has valid transitions and authorized actors.

Delay configuration balances security with responsiveness. Too short (hours) allows insufficient reaction time. Too long (weeks) delays urgent fixes. Common ranges are 1-7 days, with shorter delays for routine matters and longer for significant changes.

Execution windows prevent indefinite pending states. After the timelock delay, proposals typically have a limited window (e.g., 7-14 days) to be executed. Expired proposals must be re-proposed and re-voted.

Cancellations add flexibility. Proposers may withdraw proposals before voting ends. Guardians (if configured) may cancel malicious proposals. Cancellation typically returns deposits unless abuse is detected.

## Checklist
- Define clear timelock state machine
- Set appropriate delays by proposal type
- Implement execution window limits
- Authorize cancellation actors
- Handle state transitions atomically

## Red flags
- No execution window limits
- Missing cancellation mechanisms
- State transitions without authorization checks
- Indefinite pending states
`,
  blocks: [
    {
      type: "terminal",
      id: "governance-v2-l3-states",
      title: "Timelock State Machine",
      steps: [
        {
          cmd: "State: pending",
          output: "Delay countdown active",
          note: "Proposal passed, waiting",
        },
        {
          cmd: "State: ready",
          output: "Delay elapsed, executable",
          note: "Anyone can trigger execution",
        },
        {
          cmd: "State: executed",
          output: "Instructions processed",
          note: "Terminal state",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "governance-v2-quorum-voting",
  slug: "governance-v2-quorum-voting",
  title: "Challenge: Implement quorum/voting state machine",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Implement quorum/voting state machine

Build a deterministic voting system:

- Calculate vote weights from token balances
- Check quorum requirements
- Determine pass/fail based on thresholds
- Handle abstentions correctly
- Return stable state transitions

Your implementation will be tested against various vote distributions.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Lesson = {
  id: "governance-v2-multisig",
  slug: "governance-v2-multisig",
  title: "Multisig transaction building and approvals",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Multisig transaction building and approvals

Multisig wallets provide collective control over treasury funds. Understanding multisig construction, approval flows, and security patterns is essential for treasury operations.

Multisig structure defines: signers (public keys that can approve), threshold (minimum signatures required), and instructions (operations to execute). Common configurations include 2-of-3 (two approvals from three signers), 3-of-5, and custom arrangements.

Transaction lifecycle: propose (one signer creates transaction with instructions), approve (other signers review and approve), and execute (once threshold is met, anyone can execute). Each stage is recorded on-chain for transparency.

Approval tracking maintains state per signer per transaction. Signers can approve, reject, or cancel their approval. Double-signing is prevented by tracking which signers have already approved. Rejections may block transactions or simply be recorded.

Security considerations: signer key management (hardware wallets recommended), threshold selection (balance security vs availability), timelocks for large transfers, and emergency recovery paths. Lost signer keys should not freeze treasury funds permanently.

## Checklist
- Define signer set and threshold
- Track per-signer approval state
- Enforce threshold before execution
- Implement approval/revocation mechanics
- Plan for lost key scenarios

## Red flags
- Single signer controlling treasury
- No approval tracking on-chain
- Threshold equal to signer count (no redundancy)
- Missing rejection/cancellation mechanisms
`,
  blocks: [
    {
      type: "quiz",
      id: "governance-v2-l5-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "governance-v2-l5-q1",
          prompt: "What does 2-of-3 multisig mean?",
          options: [
            "2 signatures required from 3 possible signers",
            "2 signers total with 3 keys each",
            "2 minute timeout with 3 retries",
          ],
          answerIndex: 0,
          explanation: "2-of-3 means any 2 of the 3 authorized signers must approve a transaction.",
        },
        {
          id: "governance-v2-l5-q2",
          prompt: "Why track approvals on-chain?",
          options: [
            "Transparency and enforceability",
            "Faster execution",
            "Lower fees",
          ],
          answerIndex: 0,
          explanation: "On-chain tracking provides transparency and ensures threshold enforcement by the protocol.",
        },
      ],
    },
  ],
};

const lesson6: Challenge = {
  id: "governance-v2-multisig-builder",
  slug: "governance-v2-multisig-builder",
  title: "Challenge: Implement multisig tx builder + approval rules",
  type: "challenge",
  xpReward: 60,
  duration: "55 min",
  language: "typescript",
  content: `# Challenge: Implement multisig tx builder + approval rules

Build a multisig transaction system:

- Create transactions with instructions
- Record signer approvals
- Enforce threshold requirements
- Handle approval revocation
- Generate deterministic transaction state

Tests will verify threshold enforcement and approval tracking.`,
  starterCode: lesson6StarterCode,
  testCases: lesson6TestCases,
  hints: lesson6Hints,
  solution: lesson6SolutionCode,
};

const lesson7: Lesson = {
  id: "governance-v2-safe-defaults",
  slug: "governance-v2-safe-defaults",
  title: "Safe defaults: owner checks and replay guards",
  type: "content",
  xpReward: 45,
  duration: "45 min",
  content: `# Safe defaults: owner checks and replay guards

Governance and multisig systems require robust security defaults. Understanding common vulnerabilities and their mitigations protects treasury funds.

Owner checks validate that transactions only affect authorized accounts. For treasury operations, verify: the treasury account is owned by the expected program, the signer set matches the multisig configuration, and instructions target allowed programs. Missing owner checks enable account substitution attacks.

Replay guards prevent the same approved transaction from being executed multiple times. Without replay protection, an observer could resubmit an executed transaction to drain funds. Guards include: unique transaction nonces, executed flags in transaction state, and signature uniqueness checks.

Upgrade safety considers how governance changes affect existing proposals. If the multisig configuration changes, pending proposals should use the old configuration while new proposals use the new one. Atomic configuration changes prevent partial updates.

Emergency stops provide circuit breakers. Guardian roles can pause operations during suspected attacks. Time delays on critical changes allow review periods. These safety valves should be tested regularly.

## Checklist
- Validate account ownership before operations
- Implement replay protection (nonces or flags)
- Handle configuration changes safely
- Add emergency pause mechanisms
- Test security controls regularly

## Red flags
- No owner verification on treasury accounts
- Missing replay protection
- Immediate execution of critical changes
- No emergency stop capability
`,
  blocks: [
    {
      type: "quiz",
      id: "governance-v2-l7-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "governance-v2-l7-q1",
          prompt: "What is a replay attack in multisig systems?",
          options: [
            "Re-executing an already-executed transaction",
            "Sending duplicate approval requests",
            "Copying transaction bytecode",
          ],
          answerIndex: 0,
          explanation: "Replay attacks re-submit previously executed transactions to drain funds.",
        },
        {
          id: "governance-v2-l7-q2",
          prompt: "Why verify account ownership?",
          options: [
            "Prevent account substitution attacks",
            "Reduce transaction size",
            "Improve UI rendering",
          ],
          answerIndex: 0,
          explanation: "Ownership checks ensure operations target legitimate accounts, not attacker substitutes.",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "governance-v2-treasury-execution",
  slug: "governance-v2-treasury-execution",
  title: "Challenge: Execute proposal and produce treasury diff",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Challenge: Execute proposal and produce treasury diff

Complete the governance simulator checkpoint:

- Execute approved proposals with timelock validation
- Apply treasury state changes atomically
- Generate execution trace with before/after diffs
- Handle edge cases (expired, cancelled, insufficient funds)
- Output stable, deterministic audit log

This validates your complete governance/multisig implementation.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "governance-v2-governance",
  title: "DAO Governance",
  description:
    "Proposal lifecycle, deterministic voting mechanics, quorum policy, and timelock safety for credible DAO governance.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "governance-v2-multisig",
  title: "Multisig Treasury",
  description:
    "Multisig transaction construction, approval controls, replay defenses, and secure treasury execution patterns.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaGovernanceMultisigCourse: Course = {
  id: "course-solana-governance-multisig",
  slug: "solana-governance-multisig",
  title: "Governance & Multisig Treasury Ops",
  description:
    "Build production-ready DAO governance and multisig treasury systems with deterministic vote accounting, timelock safety, and secure execution controls.",
  difficulty: "intermediate",
  duration: "11 hours",
  totalXP: 400,
  tags: ["governance", "multisig", "dao", "treasury", "solana"],
  imageUrl: "/images/courses/solana-governance-multisig.svg",
  modules: [module1, module2],
};
