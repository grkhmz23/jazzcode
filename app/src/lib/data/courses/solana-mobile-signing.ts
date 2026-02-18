import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/solana-mobile-signing/challenges/lesson-4-sign-request";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-mobile-signing/challenges/lesson-5-session-persist";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-mobile-signing/challenges/lesson-8-session-report";

const lesson1: Lesson = {
  id: "mobilesign-v2-reality-check",
  slug: "mobilesign-v2-reality-check",
  title: "Mobile signing reality check: Android vs iOS constraints",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Mobile signing reality check: Android vs iOS constraints

Mobile wallet signing on Solana is fundamentally different from browser-based wallet interactions. The constraints imposed by Android and iOS operating systems shape every design decision, from session management to error handling. Understanding these platform differences is essential before writing any signing code.

## Android and Mobile Wallet Adapter (MWA)

On Android, the Solana Mobile Wallet Adapter (MWA) protocol provides a persistent communication channel between dApps and wallet applications. MWA leverages Android's ability to run foreground services, which means the wallet application can maintain an active session while the user interacts with the dApp. The protocol uses a WebSocket-like association mechanism: the dApp sends an association intent, the wallet responds with a session token, and subsequent sign requests flow over this persistent channel.

The key advantage of MWA on Android is session continuity. Once a user authorizes a dApp, the wallet maintains an active session that can handle multiple sign requests without requiring the user to switch applications. The foreground service keeps the communication channel alive even when the wallet is not in the foreground. This enables flows like batch signing, sequential transaction approval, and real-time status updates.

Android MWA sessions have a lifecycle tied to the association. The dApp initiates an association via an Android intent, receives a session object, and can then issue authorize, sign_transactions, sign_messages, and sign_and_send_transactions requests. Sessions persist until explicitly deauthorized, the wallet terminates them, or the session TTL expires. Typical TTL values range from 5 minutes to 24 hours depending on the wallet implementation.

However, Android is not without constraints. The user must have a compatible MWA wallet installed (Phantom, Solflare, or other MWA-compatible wallets). The association intent may fail if no compatible wallet is found, requiring graceful fallback. Additionally, Android battery optimization and Doze mode can interrupt foreground services on some manufacturer-modified Android builds (Samsung, Xiaomi), requiring careful handling of session interruption.

## iOS limitations and deep link patterns

iOS presents a fundamentally different challenge. Apple does not allow arbitrary background processes or persistent inter-app communication channels. There is no equivalent to Android's foreground service pattern. When a user switches from a dApp (typically a web view or native app) to a wallet app, the dApp's execution context is suspended. There is no way to maintain a WebSocket or persistent channel between the two applications.

On iOS, wallet interactions rely on deep links and universal links. The dApp constructs a signing request, encodes it into a URL, and opens the wallet via a deep link. The wallet processes the request, and returns the result via a callback deep link back to the dApp. Each sign request requires a full app switch: dApp to wallet, user approval, wallet back to dApp.

This round-trip app switching has significant UX implications. Each signature requires 2-4 seconds of visual context switching. Users see the iOS app transition animation, must locate the approve button in the wallet, and then return to the dApp. Batch signing is particularly painful because each transaction in the batch requires a separate app switch (unless the wallet supports batch approval in a single deep link payload).

Session persistence on iOS is effectively impossible in the traditional sense. The dApp cannot know if the wallet is still running, whether the user closed it, or if iOS terminated it for memory pressure. Every request must be treated as potentially the first request in a new session. This means encoding all necessary context (app identity, cluster, authorization state) into every deep link request.

## What actually works in production

Production mobile dApps adopt a hybrid strategy. On Android, they detect MWA support and use the persistent session model. On iOS, they fall back to deep link patterns with aggressive local caching to minimize the data that must be re-transmitted on each request. Cross-platform frameworks like the Solana Mobile SDK abstract some of these differences, but developers must still handle platform-specific edge cases.

Fallback patterns include: QR code-based WalletConnect sessions (works on both platforms but adds latency), embedded browser wallets (avoid app switching but sacrifice security), and progressive web app approaches with browser extension wallets. Each fallback has trade-offs in security, UX, and feature completeness.

The most robust approach is capability detection at runtime: check for MWA support, fall back to deep links, and ultimately offer QR-based connection as a universal fallback. Each path should provide appropriate UX feedback so users understand why the experience differs across devices.

## Checklist
- Detect MWA availability on Android before attempting association
- Implement deep link fallback for iOS and non-MWA Android
- Handle session interruption from OS-level process management
- Cache session state locally for faster reconnection
- Provide clear UX for each connection method

## Red flags
- Assuming MWA works identically on iOS and Android
- Not handling foreground service termination on Android
- Ignoring deep link callback failures on iOS
- Hardcoding a single wallet without fallback detection
`,
  blocks: [
    {
      type: "quiz",
      id: "mobilesign-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "mobilesign-v2-l1-q1",
          prompt: "What enables persistent dApp-to-wallet communication on Android?",
          options: [
            "Foreground services maintaining a session channel",
            "Deep links passed between applications",
            "Shared local storage between apps",
          ],
          answerIndex: 0,
          explanation: "Android MWA uses foreground services to maintain a persistent communication channel between the dApp and wallet, enabling multi-request sessions without app switching.",
        },
        {
          id: "mobilesign-v2-l1-q2",
          prompt: "Why can't iOS maintain persistent wallet sessions like Android?",
          options: [
            "iOS suspends app execution on background transitions, preventing persistent channels",
            "iOS wallets do not support Solana",
            "iOS uses a different blockchain protocol",
          ],
          answerIndex: 0,
          explanation: "iOS does not allow arbitrary background processes or persistent inter-app communication. When the user switches apps, the dApp's execution context is suspended.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "mobilesign-v2-connection-ux",
  slug: "mobilesign-v2-connection-ux",
  title: "Wallet connection UX patterns: connect, reconnect, and recovery",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Wallet connection UX patterns: connect, reconnect, and recovery

Wallet connection on mobile is the first interaction users have with your dApp. A smooth connection flow builds trust; a broken one drives users away. This lesson covers the connection lifecycle, automatic reconnection strategies, network mismatch handling, and user-friendly error states.

## Initial connection flow

The connection flow begins with capability detection. Before presenting any wallet UI, your dApp should determine what connection methods are available. On Android, check for installed MWA-compatible wallets by attempting to resolve the MWA association intent. On iOS, check for registered deep link handlers. If neither is available, offer a QR code or WalletConnect fallback.

Once a connection method is selected, the authorization flow begins. For MWA on Android, this involves sending an authorize request with your app identity (name, URI, icon). The wallet displays a consent screen showing your dApp's identity and requested permissions. Upon approval, the wallet returns an auth token and the user's public key. Store both: the public key for display and transaction building, the auth token for session resumption.

For deep link connections on iOS, the flow is: construct an authorize deep link with your app identity and callback URI, open the wallet, wait for the callback deep link with the auth result, and parse the response. The response includes the public key and optionally a session token for subsequent requests.

Connection state should be persisted locally. Store the wallet address, connection method, auth token, and timestamp. This enables automatic reconnection on app restart without requiring the user to re-authorize. Use secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) for auth tokens.

## Automatic reconnection

When the dApp restarts or returns from background, attempt silent reconnection before showing any wallet UI. The reconnection flow checks: is there a stored auth token? Is it still valid (not expired)? Can we re-establish the communication channel?

On Android with MWA, reconnection involves re-associating with the wallet using the stored auth token. If the wallet accepts the token, the session resumes transparently. If the token is expired or revoked, fall back to a fresh authorization flow. The key is making this check fast (under 500ms) so the user does not see a loading state.

On iOS, reconnection is simpler but less reliable. Check if the stored wallet address is still valid by verifying the account exists on-chain. The auth token from the previous deep link session may or may not be accepted by the wallet on the next interaction. Optimistically display the stored wallet address and handle re-authorization lazily when the first sign request fails.

## Network mismatch handling

Network mismatches occur when the dApp expects one cluster (e.g., mainnet-beta) but the wallet is configured for another (e.g., devnet). This is a common source of confusing errors: transactions build correctly but fail on submission because they reference accounts that do not exist on the wallet's configured cluster.

Detection strategies include: requesting the wallet's current cluster during authorization, comparing the cluster in sign responses against expectations, and catching specific RPC errors that indicate cluster mismatch (e.g., account not found for well-known program addresses).

When a mismatch is detected, present a clear error message: "Your wallet is connected to devnet, but this dApp requires mainnet-beta. Please switch your wallet's network and reconnect." Avoid technical jargon. Some wallets support programmatic cluster switching via the MWA protocol; use this when available.

## User-friendly error states

Error states must be actionable. Users should always know what happened and what to do next. Common error states and their UX patterns:

Wallet not found: "No compatible wallet detected. Install Phantom or Solflare to continue." Include direct links to app stores.

Authorization denied: "Wallet connection was declined. Tap Connect to try again." Do not repeatedly prompt; wait for user action.

Session expired: "Your wallet session has expired. Tap to reconnect." Attempt silent reconnection first; only show this if silent reconnection fails.

Network error: "Unable to reach the Solana network. Check your internet connection and try again." Distinguish between local network issues and RPC endpoint failures.

Wallet disconnected: "Your wallet was disconnected. This can happen if the wallet app was closed. Tap to reconnect." On Android, this may indicate the foreground service was killed.

## Recovery patterns

Recovery should be automatic when possible and manual when necessary. Implement a connection state machine with states: disconnected, connecting, connected, reconnecting, and error. Transitions between states should be deterministic and logged for debugging.

The reconnecting state is critical. When a connected session fails (e.g., the wallet app crashes), transition to reconnecting and attempt up to 3 silent reconnection attempts with exponential backoff (1s, 2s, 4s). If all attempts fail, transition to error and present the manual reconnection UI.

## Checklist
- Detect available connection methods before showing wallet UI
- Store auth tokens securely for automatic reconnection
- Handle network mismatch with clear user messaging
- Implement connection state machine with deterministic transitions
- Provide actionable error states with recovery options

## Red flags
- Showing raw error codes to users
- Repeatedly prompting for authorization after denial
- Not persisting connection state across app restarts
- Ignoring network mismatch silently
`,
  blocks: [
    {
      type: "quiz",
      id: "mobilesign-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "mobilesign-v2-l2-q1",
          prompt: "What should you do before showing any wallet connection UI?",
          options: [
            "Detect available connection methods (MWA, deep links, QR)",
            "Immediately open the default wallet",
            "Display a loading spinner for 3 seconds",
          ],
          answerIndex: 0,
          explanation: "Capability detection ensures you only present connection methods that are actually available on the user's device.",
        },
        {
          id: "mobilesign-v2-l2-q2",
          prompt: "How should a dApp handle a network mismatch between itself and the wallet?",
          options: [
            "Display a clear message asking the user to switch their wallet's network",
            "Silently retry the transaction on a different cluster",
            "Ignore the mismatch and hope it resolves",
          ],
          answerIndex: 0,
          explanation: "Network mismatches should be communicated clearly to the user with instructions on how to resolve them, avoiding confusing silent failures.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "mobilesign-v2-timeline-explorer",
  slug: "mobilesign-v2-timeline-explorer",
  title: "Signing session timeline: request, wallet, and response flow",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Signing session timeline: request, wallet, and response flow

Understanding the complete lifecycle of a mobile signing request is essential for building reliable dApps. Every sign request passes through multiple stages, each with its own failure modes and timing constraints. This lesson traces a request from construction to final response.

## Request construction phase

The signing flow begins in the dApp when user action triggers a transaction. The dApp constructs the transaction: fetching a recent blockhash, building instructions, setting the fee payer, and serializing the transaction into a byte array. On mobile, this construction phase must be fast because the user is waiting for the wallet to appear.

Key timing constraint: the recent blockhash has a limited validity window (typically 60-90 seconds on mainnet, determined by the slots-per-epoch configuration). If transaction construction takes too long (e.g., due to slow RPC responses), the blockhash may expire before the wallet even sees the transaction. Production dApps pre-fetch blockhashes and refresh them periodically.

The constructed transaction is encoded (typically base64 for MWA, or URL-safe base64 for deep links) and wrapped in a sign request object. The sign request includes metadata: the app identity, requested cluster, and a unique request ID for tracking. On MWA, this is sent over the session channel. On iOS deep links, it is encoded into the URL.

## Wallet-side processing

Once the wallet receives the sign request, it enters its own processing pipeline. The wallet decodes the transaction, simulates it (if the wallet supports simulation), extracts human-readable information for the approval screen, and presents the transaction details to the user.

Simulation is a critical step. Wallets like Phantom simulate transactions before showing them to users, detecting potential failures, extracting token transfer amounts, and identifying program interactions. Simulation adds 1-3 seconds to the wallet-side processing time but significantly improves the user experience by showing accurate fee estimates and transfer amounts.

The approval screen shows: the requesting dApp's identity (name, icon, URI), the transaction type (transfer, swap, mint, etc.), amounts being transferred, estimated fees, and any warnings (e.g., interaction with unverified programs). The user can approve or reject. The time spent on this screen is unpredictable and depends entirely on the user.

## Response handling

After the user approves (or rejects), the wallet constructs and returns a response. For approved transactions, the response contains the signed transaction bytes (the original transaction with the wallet's signature appended). For rejected transactions, the response contains an error code and message.

On MWA, the response arrives over the same session channel. The dApp receives a callback with the signed transaction or error. On iOS deep links, the wallet opens the dApp's callback URL with the response encoded in the URL parameters or fragment.

Response parsing must be defensive. Check that the response contains a valid signature, that the transaction bytes match the original request (to detect tampering), and that the response corresponds to the correct request ID. Wallets may return responses out of order if multiple requests were queued.

## Timeout scenarios

Timeouts are the most challenging failure mode in mobile signing. A timeout can occur at multiple points: during request delivery (the wallet never received the request), during user decision (the user walked away), during response delivery (the wallet signed but the response was lost), or during submission (the signed transaction was sent but confirmation timed out).

Each timeout requires a different recovery strategy. Request delivery timeout: retry the request. User decision timeout: show a "waiting for wallet" UI with a cancel option. Response delivery timeout: check on-chain for the transaction signature before retrying (to avoid double-signing). Submission timeout: poll for transaction status before resubmitting.

A reasonable timeout configuration for mobile: 30 seconds for the complete round-trip (request to response), with a 60-second grace period for user decision on the wallet side. If the MWA session itself times out, re-associate before retrying. If the deep link callback never arrives, present a manual "I've approved in my wallet" button that triggers a status check.

## The complete timeline

A typical successful signing flow takes 3-8 seconds on Android MWA and 6-15 seconds on iOS deep links. The breakdown: transaction construction (0.5-2s), request delivery (0.1-0.5s on MWA, 1-3s on deep link), wallet simulation (1-3s), user approval (variable), response delivery (0.1-0.5s on MWA, 1-3s on deep link), and transaction submission (0.5-2s).

## Checklist
- Pre-fetch blockhashes to minimize construction time
- Include unique request IDs for response correlation
- Handle all timeout scenarios with appropriate recovery
- Parse responses defensively with signature validation
- Provide real-time status feedback during the signing flow

## Red flags
- Using stale blockhashes that expire during signing
- Not correlating responses with request IDs
- Treating all timeouts identically
- Missing the case where a transaction was signed but the response was lost
`,
  blocks: [
    {
      type: "terminal",
      id: "mobilesign-v2-l3-timeline",
      title: "Signing Session Timeline",
      steps: [
        {
          cmd: "T+0.0s  dApp: build transaction",
          output: "Fetch blockhash, construct instructions, serialize to base64",
          note: "Transaction construction phase",
        },
        {
          cmd: "T+0.5s  dApp -> wallet: sign_transactions request",
          output: '{"type":"transaction","payload":"AQAAA...","requestId":"req_001"}',
          note: "Request sent via MWA session or deep link",
        },
        {
          cmd: "T+1.0s  wallet: simulate transaction",
          output: '{"fee":"0.000005 SOL","transfers":[{"to":"7Y4f...","amount":"1.5 SOL"}]}',
          note: "Wallet simulates and extracts display info",
        },
        {
          cmd: "T+1.5s  wallet: show approval screen",
          output: "User sees: Send 1.5 SOL to 7Y4f... | Fee: 0.000005 SOL | [Approve] [Reject]",
          note: "User decision - timing is unpredictable",
        },
        {
          cmd: "T+3.0s  wallet -> dApp: signed response",
          output: '{"signedPayloads":["AQAAA...signed..."],"requestId":"req_001"}',
          note: "Signed transaction returned to dApp",
        },
        {
          cmd: "T+3.5s  dApp: submit to RPC",
          output: '{"signature":"5UzM...","confirmationStatus":"confirmed"}',
          note: "Transaction submitted and confirmed on-chain",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "mobilesign-v2-sign-request",
  slug: "mobilesign-v2-sign-request",
  title: "Challenge: Build a typed sign request",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Build a typed sign request

Implement a sign request builder for Mobile Wallet Adapter:

- Validate the payload type (transaction or message)
- Validate payload data (base64 for transactions, non-empty string for messages)
- Set session metadata (app identity with name, URI, and icon)
- Validate the cluster (mainnet-beta, devnet, or testnet)
- Generate a request ID if not provided
- Return a structured SignRequest with validation results

Your implementation will be tested against valid requests, message signing requests, and invalid inputs with multiple errors.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "mobilesign-v2-session-persist",
  slug: "mobilesign-v2-session-persist",
  title: "Challenge: Session persistence and restoration",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Session persistence and restoration

Implement a session persistence manager for mobile wallet sessions:

- Process a sequence of actions: save, restore, clear, and expire_check
- Track wallet address and last sign request ID across actions
- Handle session expiry based on TTL and timestamps
- Return the final session state with a complete action log

Each action modifies the session state. Save establishes a session, restore checks if it is still valid, clear removes it, and expire_check verifies TTL bounds.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "mobilesign-v2-review-screens",
  slug: "mobilesign-v2-review-screens",
  title: "Mobile transaction review: what users need to see",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Mobile transaction review: what users need to see

Transaction review screens are the last line of defense between a user and a potentially harmful transaction. On mobile, screen real estate is limited and user attention is fragmented. Designing effective review screens requires understanding what information matters, how to present it, and what simulation results to surface.

## Human-readable transaction summaries

Raw transaction data is meaningless to most users. A transaction containing a SystemProgram.transfer instruction should display "Send 1.5 SOL to 7Y4f...T6aY" rather than showing serialized instruction bytes. The translation from on-chain instructions to human-readable summaries is one of the most important UX challenges in mobile wallet development.

Summary generation involves: identifying the program being called (System Program, Token Program, a known DeFi protocol), decoding the instruction data according to the program's IDL or known layout, extracting the relevant parameters (amounts, addresses, token mints), and formatting them for display. Unknown programs should show a warning: "Interaction with unverified program: Prog1111...".

Address formatting on mobile requires truncation. Full Solana addresses (32-44 characters) do not fit on mobile screens. The standard pattern is showing the first 4 and last 4 characters with an ellipsis: "7Y4f...T6aY". Always provide a way to view the full address (tap to expand or copy). For known addresses (well-known programs, token mints), show the human-readable name instead: "USDC Token Program" rather than "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".

Token amounts must include decimals and symbols. A raw amount of 1500000 for a USDC transfer should display as "1.50 USDC", not "1500000 lamports". This requires knowing the token's decimal places and symbol, which can be fetched from the token mint's metadata or a local registry of known tokens.

## Fee display and estimation

Transaction fees on Solana are low but not zero. Users should see the estimated fee before approving. The base fee (currently 5000 lamports or 0.000005 SOL) plus any priority fee should be displayed clearly. If the transaction includes compute budget instructions that set a custom fee, extract and display the total.

Fee estimation can use simulation results. The Solana RPC simulateTransaction method returns the compute units consumed, which combined with the priority fee rate gives an accurate fee estimate. Display fees in both SOL and the user's preferred fiat currency if possible.

For transactions that interact with DeFi protocols, additional costs may apply: swap fees, protocol fees, slippage impact. These should be itemized separately from the network transaction fee. A swap review screen might show: "Swap 10 USDC for ~0.05 SOL | Network fee: 0.000005 SOL | Protocol fee: 0.01 USDC | Price impact: 0.1%".

## Simulation results

Transaction simulation is the most powerful tool for transaction review. Before showing the approval screen, simulate the transaction and extract: balance changes (SOL and token accounts), new accounts that will be created, accounts that will be closed, and any errors or warnings.

Balance change summaries are the most intuitive way to present transaction effects. Show a list of changes: "-1.5 SOL from your wallet", "+150 USDC to your wallet", "-0.000005 SOL (network fee)". Color-code decreases (red) and increases (green) for quick visual scanning.

Simulation can detect potential issues: insufficient balance, account ownership conflicts, program errors, and excessive compute usage. Surface these as warnings before the user approves. A warning like "This transaction will fail: insufficient SOL balance" saves the user from paying a fee for a failed transaction.

## Approval UX patterns

The approve and reject buttons must be unambiguous. Use distinct colors (green for approve, red/grey for reject), sufficient spacing to prevent accidental taps, and clear labels ("Approve" and "Reject", not "OK" and "Cancel"). Consider requiring a deliberate gesture (swipe to approve) for high-value transactions.

Biometric confirmation adds security for high-value transactions. After the user taps approve, prompt for fingerprint or face recognition before signing. This prevents unauthorized transactions if the device is unlocked but unattended. Make biometric confirmation optional and configurable.

Loading states during signing should show progress: "Signing transaction...", "Submitting to network...", "Waiting for confirmation...". Never show a blank screen or spinner without context. If the process takes longer than expected, show a message: "This is taking longer than usual. Your transaction is still processing."

## Checklist
- Translate instructions to human-readable summaries
- Truncate addresses with first 4 and last 4 characters
- Show token amounts with correct decimals and symbols
- Display simulation-based fee estimates
- Surface balance changes with color coding
- Require deliberate approval gestures for high-value transactions

## Red flags
- Showing raw instruction bytes to users
- Displaying token amounts without decimal conversion
- Missing fee information on approval screens
- No simulation before transaction approval
- Approve and reject buttons too close together
`,
  blocks: [
    {
      type: "quiz",
      id: "mobilesign-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "mobilesign-v2-l6-q1",
          prompt: "How should token amounts be displayed on a mobile transaction review screen?",
          options: [
            "With correct decimal places and token symbol (e.g., 1.50 USDC)",
            "As raw lamports or smallest unit values",
            "In scientific notation for precision",
          ],
          answerIndex: 0,
          explanation: "Token amounts must be converted to human-readable format using the token's decimal configuration and include the symbol for clarity.",
        },
        {
          id: "mobilesign-v2-l6-q2",
          prompt: "What is the most intuitive way to present transaction simulation results?",
          options: [
            "Balance change summaries with color-coded increases and decreases",
            "Raw simulation logs from the RPC response",
            "A list of all accounts the transaction touches",
          ],
          answerIndex: 0,
          explanation: "Balance change summaries (e.g., -1.5 SOL, +150 USDC) are the most user-friendly way to communicate what a transaction will do.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "mobilesign-v2-retry-patterns",
  slug: "mobilesign-v2-retry-patterns",
  title: "One-tap retry: handling offline, rejected, and timeout states",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# One-tap retry: handling offline, rejected, and timeout states

Mobile environments are inherently unreliable. Users move between WiFi and cellular, enter tunnels, close apps mid-transaction, and wallets crash. A robust retry system is not optional; it is a core requirement for production mobile dApps. This lesson covers retry state machines, offline detection, user-initiated retry, and mobile-appropriate backoff strategies.

## Retry state machine

Every sign request in a mobile dApp should be managed by a state machine with well-defined states and transitions. The core states are: idle, pending, signing, submitted, confirmed, failed, and retrying. Each state has specific allowed transitions and associated UI.

Idle: no active request. Transition to pending when the user initiates an action.

Pending: the request is being constructed (fetching blockhash, building transaction). Transition to signing when the request is sent to the wallet, or to failed if construction fails (e.g., RPC unreachable).

Signing: waiting for wallet response. Transition to submitted if the wallet returns a signed transaction, to failed if the wallet rejects, or to retrying if the signing times out.

Submitted: the signed transaction has been sent to the network. Transition to confirmed when the transaction is finalized, or to failed if submission fails or confirmation times out.

Confirmed: terminal success state. Display success UI and clean up.

Failed: non-terminal failure state. Analyze the failure reason and determine if retry is appropriate. Transition to retrying if the failure is retryable, or remain in failed if it is terminal (e.g., user explicitly rejected).

Retrying: preparing to retry. Refresh stale data (new blockhash, updated balances), wait for backoff period, then transition back to pending.

## Offline detection

Mobile offline detection is more nuanced than checking navigator.onLine. That property only indicates whether the device has a network interface active, not whether the Solana RPC endpoint is reachable. Implement a multi-layer detection strategy.

Layer 1: Network interface status. Use the device's network state API to detect complete disconnection (airplane mode, no signal). This is instant and covers the most obvious case.

Layer 2: RPC health check. Periodically ping the Solana RPC endpoint with a lightweight request (getHealth or getSlot). If this fails but the network interface is up, the issue is likely RPC-specific. Try a fallback RPC endpoint before declaring offline status.

Layer 3: Transaction-level detection. If a transaction submission returns a network error, mark the request as failed-offline rather than failed-permanent. This distinction drives the retry logic: offline failures should be retried when connectivity returns, while permanent failures (insufficient funds, invalid transaction) should not.

When offline is detected, queue pending sign requests locally. Display an offline banner: "You are offline. Your transaction will be submitted when connectivity returns." When connectivity is restored, process the queue in order, refreshing blockhashes for any queued transactions (they will have expired).

## User-initiated retry

Not all retries should be automatic. When a transaction fails, present the user with context and a clear retry option. The retry button should be prominent (primary action), and the error context should be concise.

For wallet rejection: "Transaction was declined in your wallet. [Try Again]". The retry re-opens the wallet with the same request. Do not automatically retry rejected transactions; respect the user's decision and only retry on explicit user action.

For timeout: "Wallet did not respond in time. This may happen if the wallet app was closed. [Retry] [Cancel]". Before retrying, check if the transaction was already signed and submitted (to avoid double-signing).

For network errors: "Could not reach the Solana network. [Retry When Online]". This button should be disabled while offline and automatically trigger when connectivity returns.

For submission failures: "Transaction could not be confirmed. [Retry with New Blockhash]". This re-constructs the transaction with a fresh blockhash and re-submits. Show the previous failure reason to build user confidence.

## Exponential backoff on mobile

Mobile backoff must be more aggressive than server-side backoff because users are waiting and watching. Start with a 1-second delay, double on each retry, and cap at 8 seconds. After 3 failed retries, stop automatic retrying and present a manual retry option.

The backoff sequence for automatic retries: 1s, 2s, 4s, then stop. For user-initiated retries, do not apply backoff (the user explicitly chose to retry, so execute immediately). For offline queue processing, use a 2-second delay between queued items to avoid overwhelming the RPC endpoint when connectivity returns.

Jitter is important even on mobile. Add a random 0-500ms offset to each retry delay to prevent thundering herd problems when many users come back online simultaneously (e.g., after a widespread network outage).

Display retry progress to the user: "Retrying in 3... 2... 1..." or "Attempt 2 of 3". Never retry silently; users should always know the dApp is working on their behalf.

## Checklist
- Implement a state machine for every sign request lifecycle
- Detect offline state at network, RPC, and transaction levels
- Queue transactions locally when offline
- Refresh blockhashes before retrying queued transactions
- Use mobile-appropriate backoff: 1s, 2s, 4s, then manual
- Show retry progress and attempt counts to users

## Red flags
- Automatically retrying user-rejected transactions
- Using server-side backoff timing (30s+) on mobile
- Retrying with stale blockhashes
- Silently retrying without user visibility
- Not checking for already-submitted transactions before retry
`,
  blocks: [
    {
      type: "terminal",
      id: "mobilesign-v2-l7-retry-flow",
      title: "Retry State Machine Flow",
      steps: [
        {
          cmd: "State: idle -> pending",
          output: "User taps 'Send 1.5 SOL'. Fetching blockhash...",
          note: "User action triggers request construction",
        },
        {
          cmd: "State: pending -> signing",
          output: "Opening wallet for approval... requestId=req_001",
          note: "Request sent to wallet via MWA or deep link",
        },
        {
          cmd: "State: signing -> failed (timeout after 30s)",
          output: "Wallet did not respond. Failure: SIGNING_TIMEOUT",
          note: "Wallet app may have been closed or crashed",
        },
        {
          cmd: "State: failed -> retrying (attempt 1/3, delay 1s)",
          output: "Refreshing blockhash... Retrying in 1s...",
          note: "Automatic retry with fresh blockhash",
        },
        {
          cmd: "State: retrying -> signing",
          output: "Re-opening wallet for approval... requestId=req_001_r1",
          note: "New request sent with updated blockhash",
        },
        {
          cmd: "State: signing -> submitted",
          output: "Wallet approved. Submitting tx: 5UzM...",
          note: "Signed transaction submitted to network",
        },
        {
          cmd: "State: submitted -> confirmed",
          output: "Transaction confirmed in slot 234567890. Success!",
          note: "Terminal success state",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "mobilesign-v2-session-report",
  slug: "mobilesign-v2-session-report",
  title: "Checkpoint: Generate a session report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a session report

Implement a session report generator that summarizes a complete mobile signing session:

- Count total requests, successful signs, and failed signs
- Sum retry attempts across all requests
- Calculate session duration from start and end timestamps
- Break down requests by type (transaction vs message)
- Produce deterministic JSON output for consistent reporting

This checkpoint validates your understanding of session lifecycle, request tracking, and deterministic output generation.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "mobilesign-v2-fundamentals",
  title: "Mobile Signing Fundamentals",
  description: "Platform constraints, connection UX, signing timeline, and typed request construction.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "mobilesign-v2-production",
  title: "Production Patterns",
  description: "Session persistence, transaction review, retry state machines, and session reporting.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaMobileSigningCourse: Course = {
  id: "course-solana-mobile-signing",
  slug: "solana-mobile-signing",
  title: "Solana Mobile Signing",
  description:
    "Master mobile wallet signing: Android MWA sessions, iOS constraints, sign request construction, session persistence, retry state machines, and deterministic session reporting.",
  difficulty: "intermediate",
  duration: "12 hours",
  totalXP: 400,
  tags: ["mobile", "signing", "wallet", "mwa", "solana"],
  imageUrl: "/images/courses/solana-mobile-signing.jpg",
  modules: [module1, module2],
};
