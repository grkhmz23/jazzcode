import type { Course, Module, Lesson, Challenge } from '@/types/content';

const lesson1: Lesson = {
  id: 'mobile-wallet-overview',
  slug: 'mobile-wallet-overview',
  title: 'Mobile Wallet Overview',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# Mobile Wallet Overview

Solana Mobile development is built around the Solana Mobile Stack (SMS), a set of standards and tooling designed for secure, high-quality crypto-native mobile experiences. SMS is more than a hardware initiative; it defines interoperable wallet communications, trusted execution patterns, and distribution infrastructure tailored to Web3 apps.

A core piece is the Mobile Wallet Adapter (MWA) protocol. Instead of embedding private keys in dApps, MWA connects mobile dApps to external wallet apps for authorization, signing, and transaction submission. This separation mirrors browser wallet security on desktop and prevents dApps from directly handling secret keys.

Saga introduced the first flagship reference device for Solana Mobile concepts, including Seed Vault-oriented workflows. Even when users are not on Saga, SMS standards remain useful because protocol-level interoperability is the target: any wallet implementing MWA can serve compatible apps.

The Solana dApp Store is another foundational element. It provides a distribution channel for crypto applications with policy considerations better aligned to on-chain apps than traditional app stores. Teams can ship wallet-native functionality, tokenized features, and on-chain social mechanics without the same constraints often imposed by conventional app marketplaces.

Key architectural principles for mobile Solana apps:

- Keep signing in wallet context, not app context.
- Treat session authorization as revocable and short-lived.
- Build graceful fallback if wallet app is missing.
- Optimize for intermittent connectivity and mobile latency.

Typical mobile flow:

1. dApp requests authorization via MWA.
2. Wallet prompts user to approve account access.
3. dApp builds transactions and requests signatures.
4. Wallet returns signed payload or submits transaction.
5. dApp observes confirmation and updates UI.

Mobile UX needs explicit state transitions (authorizing, awaiting wallet, signing, submitted, confirmed). Ambiguity causes user drop-off quickly on small screens.

For Solana teams, mobile is not a “mini web app”; it requires deliberate protocol and UX design choices. SMS and MWA provide a secure baseline so developers can ship on-chain experiences with production-grade signing and session models on handheld devices.

## Practical architecture split

Treat your mobile stack as three independent systems:
1. UI app state and navigation.
2. Wallet transport/session state (MWA lifecycle).
3. On-chain transaction intent and confirmation state.

If you couple these layers tightly, wallet switch interruptions and app backgrounding can corrupt flow state. If they stay separated, recovery is predictable.

## What users should feel

Good mobile crypto UX is not "fewer steps at all costs." It is clear intent, explicit signing context, and safe recoverability when app switching or network instability happens.
`
};

const lesson2: Lesson = {
  id: 'mwa-integration',
  slug: 'mwa-integration',
  title: 'MWA Integration',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# MWA Integration

Integrating Mobile Wallet Adapter typically starts with \
\`@solana-mobile/mobile-wallet-adapter\` APIs and an interaction pattern built around \
\`transact()\`. Within a transaction session, the app can authorize, request capabilities, sign transactions, and handle wallet responses in a structured way.

A simplified integration flow:

\`\`\`typescript
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

await transact(async (wallet) => {
  const auth = await wallet.authorize({
    cluster: 'devnet',
    identity: { name: 'JazzCode Mobile', uri: 'https://jazzcode.vercel.app' },
  });

  const account = auth.accounts[0];
  // build tx, request signing/submission
});
\`\`\`

Authorization yields one or more accounts plus auth tokens for session continuation. Persist these tokens carefully and invalidate them on sign-out. Do not assume tokens remain valid forever; wallet apps can revoke sessions.

For signing, you can request:

- \
\`signTransactions\` (sign only)
- \
\`signAndSendTransactions\` (wallet signs and submits)
- \
\`signMessages\` (SIWS-like auth flows)

Deep links are used under the hood to switch between your dApp and wallet. That means state restoration matters: your app should survive process backgrounding and resume pending operation state on return.

Practical engineering tips:

- Implement idempotent transaction request handling.
- Show a visible “Waiting for wallet approval” state.
- Handle user cancellation explicitly, not as generic failure.
- Retry network submission separately from signing when possible.

Security considerations:

- Bind sessions to app identity metadata.
- Use short-lived backend nonces for message-sign auth.
- Never log full signed payloads with sensitive context.

MWA is effectively your mobile signing transport layer. If its state machine is robust, your app feels professional and trustworthy. If state handling is weak, users experience “stuck” flows and may distrust the dApp even if on-chain logic is correct.`
};

const lesson3: Challenge = {
  id: 'mobile-transaction',
  slug: 'mobile-transaction',
  title: 'Build a Mobile Transaction Function',
  type: 'challenge',
  xpReward: 200,
  duration: '50 min',
  language: 'typescript',
  content: `# Build a Mobile Transaction Function

Implement a helper that formats a deterministic MWA transaction request summary string.

Expected output format:

\`<cluster>|<payer>|<instructionCount>\`

Use this exact order and delimiter.`,
  starterCode: `interface MobileTxRequest {
  cluster: 'devnet' | 'mainnet-beta';
  payer: string;
  instructionCount: number;
}

export function formatMobileTxRequest(request: MobileTxRequest): string {
  // TODO: Validate payer is non-empty and instructionCount >= 1
  // Return "cluster|payer|instructionCount"
  return '';
}

formatMobileTxRequest({ cluster: 'devnet', payer: 'Wallet1', instructionCount: 2 });`,
  testCases: [
    {
      name: 'Formats devnet request',
      input: '{"cluster":"devnet","payer":"Wallet1","instructionCount":2}',
      expectedOutput: 'devnet|Wallet1|2'
    },
    {
      name: 'Formats mainnet request',
      input: '{"cluster":"mainnet-beta","payer":"WalletXYZ","instructionCount":1}',
      expectedOutput: 'mainnet-beta|WalletXYZ|1'
    },
    {
      name: 'Rejects missing payer',
      input: '{"cluster":"devnet","payer":"","instructionCount":1}',
      expectedOutput: 'Error: payer is required'
    }
  ],
  hints: [
    'Add validation before returning the formatted string.',
    'instructionCount should be treated as a number but returned as text.',
    'Throw exact error message for missing payer.'
  ],
  solution: `interface MobileTxRequest {
  cluster: 'devnet' | 'mainnet-beta';
  payer: string;
  instructionCount: number;
}

export function formatMobileTxRequest(request: MobileTxRequest): string {
  if (!request.payer) {
    throw new Error('payer is required');
  }

  if (request.instructionCount < 1) {
    throw new Error('instructionCount must be at least 1');
  }

  return request.cluster + '|' + request.payer + '|' + String(request.instructionCount);
}

formatMobileTxRequest({ cluster: 'devnet', payer: 'Wallet1', instructionCount: 2 });`
};

const lesson4: Lesson = {
  id: 'dapp-store-submission',
  slug: 'dapp-store-submission',
  title: 'dApp Store Submission',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# dApp Store Submission

Publishing to the Solana dApp Store requires more than packaging binaries. Teams should treat submission as a product, compliance, and security review process. A strong submission demonstrates safe wallet interactions, clear user communication, and operational readiness.

Submission readiness checklist:

- Stable release builds for target Android devices.
- Clear app identity and support channels.
- Wallet interaction flows tested for cancellation and failure recovery.
- Privacy policy and terms aligned to on-chain behaviors.
- Transparent handling of tokenized features and in-app value flows.

One distinguishing concept in Solana mobile distribution is token-aware product design. Apps may use NFT-gated access, on-chain subscriptions, or tokenized entitlements. These flows must be understandable to users and not hide financial consequences. Review teams typically evaluate whether permissions and wallet prompts are proportional to app behavior.

NFT-based licensing models can be implemented by checking ownership of specific collection assets at runtime. If licensing depends on assets, build robust indexing and refresh behavior so users are not locked out due to temporary RPC/indexer mismatch.

Operational best practices for review success:

- Provide reproducible test accounts and walkthroughs.
- Include a “safe mode” or demo path if wallet connection fails.
- Avoid unexplained signature prompts.
- Log non-sensitive diagnostics for support.

Post-submission lifecycle matters too. Plan how you will handle urgent fixes, wallet SDK updates, and chain-level incidents. Mobile releases can take time to propagate, so feature flags and backend kill-switches for risky pathways are valuable.

Distribution strategy should also include analytics around onboarding funnels, wallet connect success rates, and transaction completion rates. These metrics identify mobile-specific friction that desktop-oriented teams often miss.

A successful dApp Store submission reflects secure protocol integration and mature product operations. If your wallet interactions are explicit, fail-safe, and user-centered, your app is far more likely to pass review and retain users in production.`
};

const lesson5: Lesson = {
  id: 'mobile-best-practices',
  slug: 'mobile-best-practices',
  title: 'Mobile Best Practices',
  type: 'content',
  xpReward: 100,
  duration: '35 min',
  content: `# Mobile Best Practices

Mobile crypto UX requires balancing speed, safety, and trust. Users make high-stakes decisions on small screens, often on unstable networks. Solana mobile apps should therefore optimize for explicitness and recoverability, not just visual polish.

**Biometric gating** is useful for sensitive local actions (revealing seed-dependent views, exporting account data, approving high-risk actions), but wallet-level signing decisions should remain in wallet app context. Avoid building fake in-app “confirm” screens that look like signing prompts.

**Session keys and scoped auth** improve UX by reducing repetitive approvals. However, scope must be tightly constrained (allowed methods, time window, limits). Session credentials should be revocable and auditable.

**Offline and poor-network behavior** must be handled intentionally:

- Queue non-critical reads.
- Retry idempotent submissions with backoff.
- Distinguish “signed but not submitted” from “submitted but unconfirmed.”

**Push notifications** are valuable for transaction outcomes, liquidation alerts, and governance events. Notifications should include enough context for user safety but never leak sensitive data.

UX patterns that consistently improve conversion:

- Show transaction simulation summaries before wallet handoff.
- Display clear statuses: building, awaiting signature, submitted, confirmed.
- Provide explorer links and retry actions.
- Use plain-language error messages with suggested fixes.

Security hygiene:

- Pin trusted RPC endpoints or use reputable providers with fallback.
- Validate account ownership and expected program IDs on all client-side decoded data.
- Protect analytics pipelines from sensitive payload leakage.

Accessibility and internationalization matter for global adoption. Ensure touch targets, contrast, and localization of risk messages are adequate. For crypto workflows, misunderstanding can cause irreversible loss.

Finally, measure reality: connect success rate, signature approval rate, drop-off after wallet switch, and average time-to-confirmation. Mobile teams that instrument these metrics can iteratively remove friction and increase trust.

Great Solana mobile apps feel predictable under stress. If users always understand what they are signing, what state they are in, and how to recover, your product is operating at production quality.`
};

const module1: Module = {
  id: 'module-mobile-wallet-adapter',
  title: 'Mobile Wallet Adapter',
  description: 'Core MWA protocol, session lifecycle control, and resilient wallet handoff patterns for production mobile apps.',
  lessons: [lesson1, lesson2, lesson3],
};

const module2: Module = {
  id: 'module-dapp-store-and-distribution',
  title: 'dApp Store & Distribution',
  description: 'Publishing, operational readiness, and trust-centered mobile UX practices for Solana app distribution.',
  lessons: [lesson4, lesson5],
};

export const solanaMobileCourse: Course = {
  id: 'course-solana-mobile',
  slug: 'solana-mobile',
  title: 'Solana Mobile Development',
  description:
    'Build production-ready mobile Solana dApps with MWA, robust wallet session architecture, explicit signing UX, and disciplined distribution operations.',
  difficulty: 'intermediate',
  duration: '6 hours',
  totalXP: 1200,
  tags: ['mobile', 'saga', 'dapp-store', 'react-native'],
  imageUrl: '/images/courses/solana-mobile.jpg',
  modules: [module1, module2],
};
