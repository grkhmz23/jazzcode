import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/wallet-ux-engineering/challenges/lesson-4-connection-state";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/wallet-ux-engineering/challenges/lesson-5-cache-invalidation";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/wallet-ux-engineering/challenges/lesson-8-wallet-ux-report";

const lesson1: Lesson = {
  id: "walletux-v2-connection-design",
  slug: "walletux-v2-connection-design",
  title: "Connection UX that doesn't suck: a design checklist",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Connection UX that doesn't suck: a design checklist

Wallet connection is the first interaction a user has with any Solana dApp. If this experience is slow, confusing, or error-prone, most users will leave before they ever reach your core product. Connection UX deserves the same engineering rigor as any critical user flow, yet most teams treat it as an afterthought. This lesson establishes the design patterns, failure modes, and recovery strategies that separate professional wallet integration from broken prototypes.

## The connection lifecycle

A wallet connection progresses through a predictable sequence: idle (no wallet detected), detecting (scanning for installed adapters), ready (adapter found, user has not yet approved), connecting (approval dialog shown, waiting for user action), connected (public key received, session active), and disconnected (user or app terminated the session). Each state must have a distinct visual representation so users always know what is happening and what they need to do next.

Auto-connect is the single most impactful UX optimization. When a user has previously connected a specific wallet, the dApp should attempt to reconnect silently on page load without showing a wallet selection modal. The Solana wallet adapter standard supports this via the \`autoConnect\` flag. However, auto-connect must be gated: only attempt it if the user previously granted permission (stored in localStorage), and set a timeout of 3-5 seconds. If auto-connect fails silently, fall back to showing the connect button without an error message. Users should never see an error for a background reconnection attempt they did not initiate.

## Loading states and skeleton UI

During the connecting phase, display a skeleton version of the wallet-dependent UI rather than a blank screen or spinner. If your app shows a token balance after connection, render a shimmer placeholder in that exact layout position. This technique, called "optimistic layout reservation," prevents jarring content shifts when the connection resolves. The connect button itself should transition to a loading state (disabled, with a subtle animation) to prevent double-click issues.

Connection timeouts need explicit handling. If the wallet adapter does not respond within 10 seconds, assume the user closed the approval dialog or the wallet extension is unresponsive. Transition to an error state with a clear message: "Connection timed out. Please try again or check your wallet extension." Never leave the UI in an indefinite loading state. Implement a deterministic timeout using setTimeout and clear it if the connection resolves.

## Error recovery patterns

Connection errors fall into three categories: user-rejected (the user clicked "Cancel" in the wallet dialog), adapter errors (the wallet extension crashed or is not installed), and network errors (the RPC endpoint is unreachable after connection). Each category requires a different recovery path.

User-rejected connections should return to the idle state quietly. Do not show an error toast or modal for a deliberate user action. Simply reset the connect button to its default state. If you want to provide a nudge, a subtle inline message like "Connect your wallet to continue" is sufficient.

Adapter errors require actionable guidance. If no wallet is detected, show a "Get a Wallet" link that opens the Phantom or Solflare installation page. If the adapter throws an unexpected error, display the error message with a "Try Again" button. Log the error details to your analytics system for debugging, but keep the user-facing message simple.

Network errors after connection are particularly tricky because the wallet is technically connected (you have the public key) but the app cannot fetch on-chain data. Display a degraded state: show the connected wallet address with a warning badge, disable transaction buttons, and provide a "Check Connection" button that re-tests the RPC endpoint. Do not disconnect the wallet just because the RPC is temporarily unreachable.

## Multi-wallet support

Modern Solana dApps must support multiple wallet adapters. The wallet selection modal should display installed wallets prominently (with a green "Detected" badge) and list popular uninstalled wallets below with "Install" links. Sort installed wallets by most recently used. Remember the user's last wallet choice and pre-select it on subsequent visits.

When the user switches wallets (disconnects one, connects another), all cached data tied to the previous wallet address must be invalidated. Token balances, transaction history, and program-derived account states are all wallet-specific. Failing to clear this cache causes data leakage between accounts, which is both a UX bug and a potential security issue.

## The checklist

- Implement auto-connect with a 3-5 second timeout for returning users
- Show skeleton UI during the connecting phase to prevent layout shift
- Set a 10-second hard timeout on connection attempts
- Handle user-rejected connections silently (no error state)
- Provide "Get a Wallet" links when no adapter is detected
- Display degraded UI (not disconnect) when RPC fails post-connection
- Invalidate all wallet-specific caches on account switch
- Remember the user's preferred wallet adapter between sessions
- Disable transaction buttons during connecting and error states
- Log connection errors to analytics for monitoring adapter reliability

## Reliability principle

Wallet UX is reliability UX. Users judge trust by whether connect, reconnect, and recovery behave predictably under stress, not by visual polish alone.
`,
  blocks: [
    {
      type: "quiz",
      id: "walletux-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "walletux-v2-l1-q1",
          prompt: "What should happen when auto-connect fails silently on page load?",
          options: [
            "Show the connect button without an error message",
            "Display an error toast telling the user to reconnect",
            "Redirect the user to a wallet installation page",
          ],
          answerIndex: 0,
          explanation: "Auto-connect is a background optimization. If it fails, the user never initiated the action, so showing an error would be confusing. Simply display the default connect button.",
        },
        {
          id: "walletux-v2-l1-q2",
          prompt: "Why should you show skeleton UI during the connecting phase?",
          options: [
            "It prevents layout shift and sets expectations for where content will appear",
            "It makes the page load faster",
            "It is required by the Solana wallet adapter standard",
          ],
          answerIndex: 0,
          explanation: "Skeleton UI reserves the layout space for wallet-dependent content, preventing jarring shifts when the connection resolves and data loads.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "walletux-v2-network-gating",
  slug: "walletux-v2-network-gating",
  title: "Network gating and wrong-network recovery",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Network gating and wrong-network recovery

Solana has multiple clusters: mainnet-beta, devnet, testnet, and localnet. Unlike EVM chains where the wallet controls the network and emits chain-change events, Solana's network selection is typically controlled by the dApp, not the wallet. This architectural difference creates a unique set of UX challenges around network mismatch, gating, and recovery.

## The network mismatch problem

When a dApp targets mainnet-beta but a user's wallet or the app's RPC endpoint points to devnet, transactions will fail silently or produce confusing results. Account addresses are the same across clusters, but account state differs entirely. A token account that holds 1000 USDC on mainnet might not exist on devnet. If your app fetches the balance from devnet while the user expects mainnet, they see zero balance and assume the app is broken or their funds are gone.

Network mismatch is not always obvious. The wallet might report a successful signature, but the transaction was submitted to a different cluster than the one your app is reading from. This creates phantom transactions: the user sees "Transaction confirmed" but no state change in the UI. Debugging this requires checking which cluster the transaction was submitted to versus which cluster the app is polling.

## Detecting the current network

The primary detection method is to check your RPC endpoint's genesis hash. Each Solana cluster has a unique genesis hash. Call \`getGenesisHash()\` on your connection and compare it to known values: mainnet-beta's genesis hash is \`5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d\`, devnet is \`EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG\`, and testnet is \`4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY\`. If the genesis hash does not match your expected cluster, the RPC endpoint is misconfigured.

For wallet-side detection, some wallet adapters expose network information, but this is not standardized. The most reliable approach is to perform a lightweight RPC call (getGenesisHash or getEpochInfo) immediately after connection and compare the response against your expected cluster configuration.

## Network gating patterns

Network gating prevents users from performing actions on the wrong network. There are two levels of gating: soft gating and hard gating.

Soft gating shows a warning banner but allows the user to continue. This is appropriate for development tools, block explorers, and apps that intentionally support multiple clusters. The banner should clearly state the current network, use color coding (green for mainnet, yellow for devnet, red for testnet/localnet), and be persistent (not dismissible) so the user always sees it.

Hard gating blocks all interactions until the network matches the expected cluster. This is appropriate for production DeFi applications where operating on the wrong network could cause real financial loss. Hard gating should display a full-screen overlay or modal with a clear message: "This app requires Mainnet Beta. Your connection is currently pointing to Devnet." Include a button to switch the RPC endpoint if your app supports runtime endpoint switching.

## Recovery strategies

When a network mismatch is detected, the recovery flow depends on who controls the network selection. In most Solana dApps, the app controls the RPC endpoint, so recovery means updating the app's connection object to point to the correct cluster. This can be done automatically (if the correct endpoint is known) or manually (presenting the user with a network selector).

If recovery requires the user to change their wallet's network setting (less common on Solana but possible with some wallets), provide step-by-step instructions specific to the detected wallet adapter. For Phantom: "Open Phantom > Settings > Developer Settings > Change Network." Include screenshots or a link to the wallet's documentation.

After network switching, all cached data must be invalidated. Account states, token balances, transaction history, and program-derived addresses may differ across clusters. Implement a \`networkChanged\` event handler that: clears all cached RPC responses, resets the connection state machine, re-fetches critical account data, and updates the UI to reflect the new network.

## Multi-network development workflow

For developers building on Solana, supporting seamless network switching during development is essential. Store the selected network in localStorage so it persists across page reloads. Provide a developer-only network switcher (hidden behind a feature flag or only visible in non-production builds) that allows quick toggling between mainnet, devnet, and localnet.

When switching networks programmatically, create a new Connection object rather than mutating the existing one. This prevents race conditions where in-flight requests on the old network collide with new requests on the new network. The connection switch should be atomic: update the connection reference, clear all caches, and trigger a full data refresh in a single synchronous operation.

## Checklist
- Check genesis hash immediately after RPC connection to verify the cluster
- Use color-coded persistent banners to indicate the current network
- Hard-gate production DeFi apps to the expected cluster
- Invalidate all caches when the network changes
- Create new Connection objects instead of mutating existing ones
- Store network preference in localStorage for persistence
- Provide wallet-specific instructions for network switching

## Red flags
- Allowing transactions on the wrong network without any warning
- Caching data across network switches (stale cross-network data)
- Mutating the Connection object during network switch (race conditions)
- Assuming wallet and dApp are always on the same cluster
`,
  blocks: [
    {
      type: "quiz",
      id: "walletux-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "walletux-v2-l2-q1",
          prompt: "How do you reliably detect which Solana cluster an RPC endpoint is connected to?",
          options: [
            "Call getGenesisHash() and compare against known cluster genesis hashes",
            "Check the URL string for 'mainnet' or 'devnet'",
            "Ask the wallet adapter which network it is using",
          ],
          answerIndex: 0,
          explanation: "Each Solana cluster has a unique genesis hash. Comparing the RPC's genesis hash against known values is the only reliable detection method, since URL strings can be misleading and wallets don't always expose network info.",
        },
        {
          id: "walletux-v2-l2-q2",
          prompt: "What must happen to cached data when the network changes?",
          options: [
            "All cached data must be invalidated because account states differ across clusters",
            "Only token balances need to be refreshed",
            "Cached data can be retained since addresses are the same across clusters",
          ],
          answerIndex: 0,
          explanation: "While account addresses are identical across clusters, the account states (balances, data, existence) are completely different. All cached RPC data must be cleared on network switch.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "walletux-v2-state-explorer",
  slug: "walletux-v2-state-explorer",
  title: "Connection state machine: states, events, and transitions",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Connection state machine: states, events, and transitions

Wallet connection logic in most dApps is implemented as a tangle of boolean flags, useEffect hooks, and conditional renders. This approach leads to impossible states (loading AND error simultaneously), missed transitions (forgetting to clear the error when retrying), and race conditions (two connection attempts running in parallel). A finite state machine (FSM) eliminates these problems by making every possible state and transition explicit.

## Why state machines for wallet connections

A state machine defines a finite set of states, a finite set of events, and a deterministic transition function that maps (currentState, event) to nextState. At any point in time, the system is in exactly one state. This guarantees that impossible combinations (connected AND disconnected) cannot occur. Every event is either handled by the current state or explicitly rejected, eliminating silent failures.

For wallet connections, the core states are: \`disconnected\` (no active session), \`connecting\` (waiting for wallet approval or RPC confirmation), \`connected\` (session active, public key available), and \`error\` (something went wrong). Each state maps to a specific UI presentation, specific allowed user actions, and specific side effects.

## Defining the transition table

The transition table is the heart of the state machine. It specifies which events are valid in which states and what the resulting state should be:

\`\`\`
disconnected + CONNECT       → connecting
connecting   + CONNECTED     → connected
connecting   + CONNECTION_ERROR → error
connecting   + TIMEOUT       → error
connected    + DISCONNECT    → disconnected
connected    + NETWORK_CHANGE → connected (with updated network)
connected    + ACCOUNT_CHANGE → connected (with updated address)
connected    + CONNECTION_LOST → error
error        + RETRY         → connecting
error        + DISCONNECT    → disconnected
\`\`\`

Any event not listed for a given state is invalid. Invalid events should transition to the error state with a descriptive message rather than being silently ignored. This makes debugging straightforward: every unexpected event is captured and logged.

## Side effects and context

State transitions carry context (also called "extended state" or "context"). The connection state machine tracks: \`walletAddress\` (set on CONNECTED and ACCOUNT_CHANGE events), \`network\` (set on CONNECTED and NETWORK_CHANGE events), \`errorMessage\` (set when entering the error state), and \`transitions\` (a log of all state transitions for debugging).

Side effects are actions triggered by transitions, not by states. For example, the transition from \`connecting\` to \`connected\` should trigger: fetching the initial account balance, subscribing to account change notifications, and logging the connection event to analytics. The transition from \`connected\` to \`disconnected\` should trigger: clearing all cached data, unsubscribing from notifications, and resetting the UI to the idle layout.

## Implementation patterns

In React applications, the state machine can be implemented using \`useReducer\` with the transition table as the reducer logic. The reducer receives the current state and an event (action), looks up the transition in the table, and returns the new state with updated context. This approach is testable (pure function), predictable (no side effects in the reducer), and composable (multiple components can read the state without duplicating logic).

For more complex scenarios, libraries like XState provide first-class support for statecharts (hierarchical state machines with guards, actions, and services). XState's visualizer can render the state machine as a diagram, making it easy to verify that all states and transitions are covered. However, for wallet connection logic, a simple transition table in a useReducer is usually sufficient.

The transition history array is invaluable for debugging. When a user reports a connection issue, the transition log shows exactly what happened: which events fired, in what order, and what states resulted. This is far more useful than a single boolean flag or an error message captured at an arbitrary point.

## Testing state machines

State machines are inherently testable because they are pure functions. Given a starting state and a sequence of events, the output is completely deterministic. Test cases should cover: the happy path (disconnected → connecting → connected), error recovery (connecting → error → retry → connecting → connected), account switching (connected → ACCOUNT_CHANGE → connected with new address), and invalid events (connected + CONNECT should transition to error, not silently ignored).

Edge cases to test: rapid event sequences (CONNECT followed immediately by DISCONNECT before the connection resolves), duplicate events (two CONNECTED events in a row), and state persistence (does the machine correctly restore state from localStorage on page reload?).

## Checklist
- Define all states explicitly: disconnected, connecting, connected, error
- Map every valid (state, event) pair to a next state
- Handle invalid events by transitioning to error with a descriptive message
- Track transition history for debugging
- Implement the state machine as a pure reducer function
- Clear context data (wallet address, network) on disconnect
- Clear error message on retry
`,
  blocks: [
    {
      type: "terminal",
      id: "walletux-v2-l3-states",
      title: "State Machine Walkthrough",
      steps: [
        {
          cmd: "Event: CONNECT",
          output: "disconnected → connecting",
          note: "User clicks Connect, show loading state",
        },
        {
          cmd: "Event: CONNECTED { walletAddress: '7xKX...', network: 'mainnet-beta' }",
          output: "connecting → connected | address=7xKX... | network=mainnet-beta",
          note: "Wallet approved, session active",
        },
        {
          cmd: "Event: ACCOUNT_CHANGE { walletAddress: '9pQR...' }",
          output: "connected → connected | address=9pQR... | network=mainnet-beta",
          note: "User switched accounts, address updated, network retained",
        },
        {
          cmd: "Event: CONNECTION_LOST { message: 'WebSocket closed' }",
          output: "connected → error | errorMessage='WebSocket closed'",
          note: "Connection dropped, show error with retry option",
        },
        {
          cmd: "Event: RETRY",
          output: "error → connecting | errorMessage=null",
          note: "User clicks retry, clear error and reconnect",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "walletux-v2-connection-state",
  slug: "walletux-v2-connection-state",
  title: "Challenge: Implement wallet connection state machine",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Implement wallet connection state machine

Build a deterministic state machine for wallet connection management:

- States: disconnected, connecting, connected, error
- Process a sequence of events and track all state transitions
- CONNECTED and ACCOUNT_CHANGE events carry a walletAddress; CONNECTED and NETWORK_CHANGE carry a network
- Error state stores the error message; disconnected clears all session data
- Invalid events force transition to error state with a descriptive message
- Track transition history as an array of {from, event, to} objects

The state machine must be fully deterministic — same event sequence always produces same result.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "walletux-v2-cache-invalidation",
  slug: "walletux-v2-cache-invalidation",
  title: "Challenge: Cache invalidation on wallet events",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Cache invalidation on wallet events

Build a cache invalidation engine that processes wallet events and invalidates the correct cache entries:

- Cache entries have tags: "account" (wallet-specific data), "network" (cluster-specific data), "global" (persists across everything)
- ACCOUNT_CHANGE invalidates all entries tagged "account"
- NETWORK_CHANGE invalidates entries tagged "network" AND "account" (network change means all account data is stale)
- DISCONNECT invalidates all non-"global" entries
- Track per-event invalidation counts in an event log
- Return the final cache state, total invalidated count, and retained count

The invalidation logic must be deterministic — same input always produces same output.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "walletux-v2-rpc-caching",
  slug: "walletux-v2-rpc-caching",
  title: "RPC reads and caching strategy for wallet apps",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# RPC reads and caching strategy for wallet apps

Every interaction in a Solana wallet application ultimately depends on RPC calls: fetching balances, loading token accounts, reading program state, and confirming transactions. Without a caching strategy, your app hammers the RPC endpoint with redundant requests, drains rate limits, and delivers a sluggish user experience. A well-designed cache layer transforms wallet apps from painfully slow to instantly responsive while keeping data fresh enough for financial accuracy.

## The RPC cost problem

Solana RPC calls are not free. Public endpoints like those provided by Solana Foundation have aggressive rate limits (typically 40 requests per 10 seconds for free tiers). Premium providers (Helius, QuickNode, Triton) charge per request or by compute units consumed. A naive wallet app that re-fetches every piece of data on every render can easily exceed 100 requests per minute for a single user. Multiply by thousands of concurrent users and costs become significant.

Beyond cost, latency kills UX. A \`getTokenAccountsByOwner\` call takes 200-800ms depending on the endpoint and account complexity. If the user switches tabs and returns, re-fetching everything from scratch creates a noticeable loading delay. Caching eliminates this delay for data that has not changed.

## Cache taxonomy

Not all RPC data has the same freshness requirements. Categorize cache entries by their volatility:

**Immutable data** (cache indefinitely): mint metadata (name, symbol, decimals, logo URI), program account structures, and historical transaction details. Once fetched, this data never changes. Store it in an in-memory Map with no expiration.

**Semi-stable data** (cache for 30-60 seconds): token balances, staking positions, governance votes, and NFT ownership. This data changes infrequently for most users. A 30-second TTL (time to live) provides a good balance between freshness and efficiency. Use a cache key that includes the wallet address and network to prevent cross-account contamination.

**Volatile data** (cache for 5-10 seconds or not at all): recent transaction confirmations, real-time price feeds, and active swap quotes. This data changes constantly and becomes stale quickly. Short TTLs or no caching at all is appropriate. For transaction confirmations, use WebSocket subscriptions instead of polling.

## Cache key design

Cache keys must uniquely identify the request parameters AND the context. A good cache key for a balance query includes: the RPC method name, the account address, the commitment level, and the network cluster. For example: \`getBalance:7xKXp...abc:confirmed:mainnet-beta\`. Including the network in the key prevents a critical bug: returning devnet data when the user has switched to mainnet.

For \`getTokenAccountsByOwner\`, the key should include the owner address and the program filter (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID). Different token programs return different account sets, and caching them under the same key returns incorrect results.

## Invalidation triggers

Cache invalidation is triggered by three wallet events: account change, network change, and disconnect. These events were covered in the previous challenge, but the caching layer adds nuance.

Account change invalidates all entries keyed by the wallet address. Token balances, transaction history, and program-derived account states are all wallet-specific. Global data (mint metadata, program IDL) survives an account change.

Network change invalidates everything except truly global, network-independent data (UI preferences, theme settings). Even mint metadata should be invalidated because a mint address might exist on mainnet but not on devnet, or have different state.

User-initiated refresh is the escape hatch. Provide a "Refresh" button that clears the entire cache and re-fetches all visible data. Users expect this when they know an external action (a transfer from another device) has changed their state but the cache has not expired yet.

## Stale-while-revalidate pattern

The most effective caching strategy for wallet apps is stale-while-revalidate (SWR). When a cache entry is requested: if fresh (within TTL), return it immediately. If stale (past TTL but within a grace period, e.g., 2x TTL), return the stale value immediately AND trigger a background re-fetch. When the re-fetch completes, update the cache and notify the UI. If expired (past grace period), block and re-fetch before returning.

This pattern ensures the UI always responds instantly with the best available data while keeping it fresh in the background. Libraries like SWR (for React) and TanStack Query implement this pattern out of the box with configurable TTL, grace periods, and background refetch intervals.

## Checklist
- Categorize RPC data by volatility: immutable, semi-stable, volatile
- Include wallet address and network in all cache keys
- Invalidate account-tagged caches on wallet switch
- Invalidate all non-global caches on network switch
- Implement stale-while-revalidate for semi-stable data
- Provide a manual refresh button as an escape hatch
- Monitor cache hit rates to validate your TTL configuration

## Red flags
- Caching without network in the key (cross-network data leakage)
- Not invalidating on account switch (showing previous wallet's data)
- Setting TTLs too long for financial data (stale balance display)
- Re-fetching everything on every render (defeats the purpose of caching)
`,
  blocks: [
    {
      type: "quiz",
      id: "walletux-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "walletux-v2-l6-q1",
          prompt: "Why must cache keys include the network cluster?",
          options: [
            "Account states differ across clusters, so cached devnet data would be wrong for mainnet",
            "Cache keys must be globally unique for performance",
            "The Solana RPC protocol requires cluster identification",
          ],
          answerIndex: 0,
          explanation: "The same account address can have completely different state on mainnet vs devnet. Without the network in the key, switching clusters would return stale data from the previous cluster.",
        },
        {
          id: "walletux-v2-l6-q2",
          prompt: "What does the stale-while-revalidate pattern do when a cache entry is past its TTL?",
          options: [
            "Returns the stale value immediately and triggers a background re-fetch",
            "Blocks until fresh data is fetched from the RPC",
            "Deletes the stale entry and returns null",
          ],
          answerIndex: 0,
          explanation: "SWR prioritizes responsiveness by serving stale data instantly while refreshing in the background. This eliminates loading states for data that has only slightly exceeded its TTL.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "walletux-v2-rpc-health",
  slug: "walletux-v2-rpc-health",
  title: "RPC health monitoring and graceful degradation",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# RPC health monitoring and graceful degradation

RPC endpoints are the lifeline of every Solana wallet application. When they go down, become slow, or return stale data, your app becomes unusable. Production wallet apps must continuously monitor RPC health and degrade gracefully when issues are detected, rather than showing cryptic errors or silently displaying stale data. This lesson covers the engineering patterns for building resilient RPC connectivity.

## Why RPC endpoints fail

Solana RPC endpoints experience several failure modes. Rate limiting is the most common: free-tier endpoints enforce strict per-IP and per-second limits, and exceeding them results in HTTP 429 responses. Latency spikes occur during high network activity (NFT mints, token launches) when validators are under heavy load and RPC nodes queue requests. Stale data happens when an RPC node falls behind the cluster's tip slot, returning account states that are several slots (or seconds) old. Complete outages, while rare for premium providers, do happen and can last minutes to hours.

Each failure mode requires a different response. Rate limiting needs request throttling and backoff. Latency spikes need timeout management and user communication. Stale data needs detection and provider rotation. Complete outages need failover to a backup endpoint.

## Health check implementation

Implement a periodic health check that runs every 15-30 seconds while the app is active. The health check should measure three metrics: latency (round-trip time for a \`getSlot\` call), freshness (compare the returned slot against the expected tip slot from a secondary source or the previous check), and error rate (percentage of failed requests in the last N calls).

A healthy endpoint has latency under 500ms, slot freshness within 5 slots of the expected tip, and an error rate below 5%. An unhealthy endpoint has latency over 2000ms, slot freshness more than 50 slots behind, or an error rate above 20%. The intermediate range (degraded) triggers warnings without failover.

Store health check results in a rolling window (last 10-20 checks). A single slow response should not trigger failover, but 3 consecutive slow responses should. This smoothing prevents flapping between endpoints due to transient network issues.

## Failover strategies

Primary-secondary failover is the simplest pattern. Configure a primary RPC endpoint (your preferred provider) and one or more secondaries (different providers for diversity). When the primary becomes unhealthy, route all requests to the secondary. Periodically re-check the primary (every 60 seconds) and switch back when it recovers. This prevents all your traffic from permanently migrating to the secondary.

Round-robin with health weighting distributes requests across multiple endpoints based on their current health scores. A healthy endpoint gets a weight of 1.0, a degraded endpoint gets 0.3, and an unhealthy endpoint gets 0.0. This approach provides better throughput than single-endpoint strategies and automatically adapts to changing conditions.

For critical transactions (swaps, transfers), always use the endpoint with the lowest latency AND highest freshness. Transaction submission is latency-sensitive: a stale blockhash from a behind-the-tip node will cause the transaction to be rejected. For read operations (balance queries), slightly stale data is acceptable if it means faster responses.

## Graceful degradation in the UI

When RPC health degrades, the UI should communicate the situation clearly without panic. Display a small status indicator (green dot, yellow dot, red dot) near the network name or in the status bar. Clicking it should show detailed health information: current latency, last successful request time, and the number of failed requests.

During degraded mode, disable or add warnings to transaction buttons. A yellow warning like "Network may be slow — transactions might take longer than usual" is better than letting users submit transactions that will likely time out. During a full outage, disable all transaction features and show a clear message: "Unable to reach the Solana network. Your funds are safe. We'll reconnect automatically."

Never hide the degradation. Users who submit transactions during an outage and see "Transaction failed" without explanation will assume their funds are at risk. Proactive communication ("The network is experiencing delays") builds trust even when the experience is suboptimal.

## Request retry and throttling

When an RPC request fails, classify the error before deciding whether to retry. HTTP 429 (rate limited): back off exponentially starting at 1 second, retry up to 3 times. HTTP 5xx (server error): retry once after 2 seconds, then failover to secondary endpoint. Network timeout: retry once with a shorter timeout (the request may have succeeded but the response was lost), then failover. HTTP 4xx (client error): do not retry, the request is malformed.

Implement a request queue with concurrency limits. Most RPC providers allow 10-40 concurrent requests. If your app tries to fire 50 requests simultaneously (common during initial data loading), queue the excess and process them as earlier requests complete. This prevents self-inflicted rate limiting.

Debounce user-triggered requests. If the user rapidly clicks "Refresh" or types in a search field that triggers RPC lookups, debounce the requests to at most one per 500ms. This is simple to implement and dramatically reduces unnecessary RPC traffic.

## Monitoring and alerting

Log all RPC metrics to your observability system: request count, error count, latency percentiles (p50, p95, p99), and cache hit rate. Set alerts for: error rate exceeding 10% over 5 minutes, p95 latency exceeding 3 seconds, and cache hit rate dropping below 50% (indicates a cache invalidation bug or a change in access patterns).

Track per-endpoint metrics separately. If your primary endpoint's error rate spikes while the secondary is healthy, the failover logic should handle it automatically. But if both endpoints degrade simultaneously, it likely indicates a Solana network-wide issue rather than a provider problem, and the alerting should reflect that distinction.

## Checklist
- Run health checks every 15-30 seconds measuring latency, freshness, and error rate
- Implement primary-secondary failover with automatic recovery
- Display RPC health status in the UI (green/yellow/red indicator)
- Disable transaction features during outages with clear messaging
- Classify errors before retrying (429 vs 5xx vs 4xx)
- Implement request queue with concurrency limits
- Debounce user-triggered RPC requests
- Monitor and alert on error rate, latency, and cache hit rate

## Red flags
- No failover endpoints (single point of failure)
- Retrying 4xx errors (wastes requests on malformed input)
- Hiding RPC failures from the user (builds distrust)
- No concurrency limits (self-inflicted rate limiting)
`,
  blocks: [
    {
      type: "terminal",
      id: "walletux-v2-l7-health",
      title: "Health Check Flow",
      steps: [
        {
          cmd: "Health check: primary endpoint",
          output: "Latency: 180ms | Slot: 250,000,100 | Status: HEALTHY",
          note: "Primary endpoint responding normally",
        },
        {
          cmd: "Health check: primary endpoint (3 min later)",
          output: "Latency: 4200ms | Slot: 250,000,050 | Status: DEGRADED",
          note: "Latency spike detected, slot behind tip",
        },
        {
          cmd: "Failover triggered: switching to secondary",
          output: "Secondary: Latency: 220ms | Slot: 250,000,155 | Status: HEALTHY",
          note: "Automatic failover to healthy secondary",
        },
        {
          cmd: "Recovery check: primary endpoint (60s later)",
          output: "Latency: 150ms | Slot: 250,000,210 | Status: HEALTHY — switching back",
          note: "Primary recovered, restoring as default",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "walletux-v2-ux-report",
  slug: "walletux-v2-ux-report",
  title: "Checkpoint: Generate a Wallet UX Report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a Wallet UX Report

Build the final wallet UX quality report that combines all course concepts:

- Count connection attempts (CONNECT events) and successful connections (CONNECTED events)
- Calculate success rate as a percentage with 2 decimal places
- Compute average connection time from CONNECTED events' durationMs
- Count ACCOUNT_CHANGE and NETWORK_CHANGE events
- Calculate cache hit rate from cacheStats (hits / total * 100, 2 decimal places)
- Calculate RPC health score from rpcChecks (healthy / total * 100, 2 decimal places)
- Include the timestamp from input

This checkpoint validates your complete understanding of wallet UX engineering.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "walletux-v2-fundamentals",
  title: "Connection Fundamentals",
  description:
    "Wallet connection design, network gating, and deterministic state-machine architecture for predictable onboarding and reconnect paths.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "walletux-v2-production",
  title: "Production Patterns",
  description:
    "Cache invalidation, RPC resilience and health monitoring, and measurable wallet UX quality reporting for production operations.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const walletUxEngineeringCourse: Course = {
  id: "course-wallet-ux-engineering",
  slug: "wallet-ux-engineering",
  title: "Wallet UX Engineering",
  description:
    "Master production wallet UX engineering on Solana: deterministic connection state, network safety, RPC resilience, and measurable reliability patterns.",
  difficulty: "intermediate",
  duration: "12 hours",
  totalXP: 400,
  tags: ["wallet", "ux", "connection", "rpc", "solana"],
  imageUrl: "/images/courses/wallet-ux-engineering.svg",
  modules: [module1, module2],
};
