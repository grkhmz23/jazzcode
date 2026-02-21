import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/sign-in-with-solana/challenges/lesson-4-sign-in-input";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/sign-in-with-solana/challenges/lesson-5-verify-sign-in";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/sign-in-with-solana/challenges/lesson-8-auth-report";

const lesson1: Lesson = {
  id: "siws-v2-why-exists",
  slug: "siws-v2-why-exists",
  title: "Why SIWS exists: replacing connect-and-signMessage",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Why SIWS exists: replacing connect-and-signMessage

Before Sign-In With Solana (SIWS) became a standard, dApps authenticated wallet holders using a two-step pattern: connect the wallet, then call \`signMessage\` with an arbitrary string. The user would see a raw byte blob in their wallet's approval screen, sign it, and the server would verify the signature against the expected public key. This worked, but it was fragile, inconsistent, and dangerous.

## The problems with raw signMessage

The fundamental issue with raw \`signMessage\` authentication is that wallets cannot distinguish between a benign sign-in request and a malicious payload. When a wallet displays "Sign this message: 0x48656c6c6f" or even a human-readable string like "Please sign in to example.com at 2024-01-15T10:30:00Z," the wallet has no structured way to parse, validate, or warn about the content. The user must trust that the dApp is honest about what it is asking them to sign.

This creates several attack vectors. A malicious dApp could present a sign-in prompt that actually contains a serialized transaction. If the wallet treats \`signMessage\` payloads as opaque bytes (which most do), the user signs what they believe is a login but is actually an authorization for a token transfer. Even without outright fraud, the lack of structure means different dApps format their sign-in messages differently. Users see inconsistent approval screens across applications, eroding trust and making it harder to identify legitimate requests.

Replay attacks are another critical weakness. If a dApp asks the user to sign "Log in to example.com" without a nonce or timestamp, the resulting signature is valid forever. An attacker who intercepts this signature (via a compromised server log, a man-in-the-middle proxy, or a leaked database) can replay it indefinitely to impersonate the user. Adding a nonce or timestamp to the message helps, but without a standard format, each dApp implements its own scheme — some correctly, many not.

## What SIWS standardizes

Sign-In With Solana defines a structured message format that wallets can parse, validate, and display in a human-readable, predictable way. The SIWS standard specifies exactly which fields a sign-in request must contain and how wallets should render them. This moves authentication from an opaque byte-signing operation to a semantically meaningful, wallet-aware protocol.

The core fields of a SIWS sign-in input are: **domain** (the requesting site's origin, displayed prominently by the wallet), **address** (the expected signer's public key), **nonce** (a unique, server-generated value that prevents replay attacks), **issuedAt** (ISO 8601 timestamp marking when the request was created), **expirationTime** (optional deadline after which the sign-in is invalid), **statement** (human-readable description of what the user is approving), **chainId** (the Solana cluster, e.g., mainnet-beta), and **resources** (optional URIs that the sign-in grants access to).

When a wallet receives a SIWS request, it knows the structure. It can display the domain prominently so the user can verify they are signing in to the correct site. It can show the expiration time so the user knows the request is time-limited. It can warn if the domain in the request does not match the domain the wallet was connected from. This structured rendering is a massive UX improvement over displaying raw bytes.

## UX improvements for end users

With SIWS, wallet approval screens become consistent and informative. Instead of seeing an arbitrary string, users see a formatted display: the requesting domain, the statement explaining the action, the nonce (often hidden from the user but validated by the wallet), and time bounds. This consistency across dApps builds user confidence — they learn to recognize what a legitimate sign-in request looks like.

Wallets can also implement automatic safety checks. If the domain in the SIWS input does not match the origin of the connecting dApp, the wallet can show a warning or block the request entirely. If the issuedAt timestamp is far in the past or the expirationTime has already passed, the wallet can reject the request before the user even sees it. These checks are impossible with raw \`signMessage\` because the wallet has no way to parse the content.

## Server-side benefits

For backend developers, SIWS provides a predictable verification flow. The server generates a nonce, sends the SIWS input to the client, receives the signed output, and verifies: (1) the signature is valid for the claimed address, (2) the domain matches the server's domain, (3) the nonce matches the one the server issued, (4) the timestamps are within acceptable bounds, and (5) the address matches the expected signer. Each check is explicit and auditable, unlike ad-hoc string parsing.

The nonce mechanism is particularly important. The server stores issued nonces (in memory, Redis, or a database) and marks them as consumed after successful verification. Any attempt to reuse a nonce is rejected as a replay attack. This provides cryptographic proof of freshness that raw signMessage authentication lacks unless the developer explicitly implements it — and history shows most developers do not.

## The path forward

SIWS aligns Solana's authentication story with Ethereum's Sign-In With Ethereum (SIWE / EIP-4361) and other chain-specific standards. Cross-chain dApps can implement a unified authentication flow with chain-specific signing backends. The wallet-side rendering, nonce management, and verification logic are consistent patterns regardless of the underlying blockchain.

## Operator mindset

Treat SIWS as a protocol contract, not a UI prompt. If nonce lifecycle, domain checks, and time bounds are not enforced as strict invariants, authentication becomes signature theater.

## Checklist
- Understand why raw signMessage is insufficient for authentication
- Know the core SIWS fields: domain, address, nonce, issuedAt, expirationTime, statement
- Recognize that SIWS enables wallet-side validation and consistent UX
- Understand the server-side nonce flow: generate, issue, verify, consume

## Red flags
- Using raw signMessage for authentication without structured format
- Omitting nonce from sign-in messages (enables replay attacks)
- Not validating domain match between SIWS input and connecting origin
- Allowing sign-in messages without expiration times
`,
  blocks: [
    {
      type: "quiz",
      id: "siws-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "siws-v2-l1-q1",
          prompt: "What is the primary security problem with using raw signMessage for authentication?",
          options: [
            "Wallets cannot distinguish sign-in requests from malicious payloads",
            "signMessage is too slow for production use",
            "signMessage does not produce valid Ed25519 signatures",
          ],
          answerIndex: 0,
          explanation: "Without structured format, wallets treat signMessage payloads as opaque bytes and cannot validate or warn about the content, making it easy for malicious dApps to disguise harmful payloads as sign-in requests.",
        },
        {
          id: "siws-v2-l1-q2",
          prompt: "How does SIWS prevent replay attacks?",
          options: [
            "By requiring a unique, server-generated nonce that is consumed after verification",
            "By encrypting the signed message with AES-256",
            "By requiring the user to sign twice with different keys",
          ],
          answerIndex: 0,
          explanation: "The server generates a unique nonce for each sign-in attempt. After successful verification, the nonce is marked as consumed. Any reuse of the same nonce is rejected as a replay attack.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "siws-v2-input-fields",
  slug: "siws-v2-input-fields",
  title: "SIWS input fields and security rules",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# SIWS input fields and security rules

The Sign-In With Solana input is a structured object that defines every parameter of an authentication request. Each field has specific validation rules, security implications, and rendering expectations. Understanding every field deeply is essential for building a correct and secure SIWS implementation.

## domain

The \`domain\` field identifies the requesting application. It must be a valid domain name without protocol prefix — "example.com", not "https://example.com". The domain serves as the primary trust anchor: when the wallet displays the sign-in request, the domain is shown prominently so the user can verify they are interacting with the intended site.

Security rule: the server must verify that the domain in the signed output matches its own domain exactly. If a user signs a SIWS message for "evil.com" and submits it to "example.com", the server must reject it. The domain check prevents cross-site authentication relay attacks where an attacker presents their own domain to the user but submits the signed result to a different server. Domain validation should be case-insensitive (domains are case-insensitive per RFC 4343) and must reject domains containing protocol prefixes, paths, ports, or query strings.

## address

The \`address\` field contains the Solana public key (base58-encoded) of the wallet that will sign the request. On Solana, public keys are 32 bytes encoded in base58, resulting in strings of 32-44 characters. The address must match the actual signer of the SIWS output — if the address in the input says "Wallet111" but "Wallet222" actually signs the message, verification must fail.

Security rule: always validate address format before sending the request to the wallet. A malformed address will cause downstream verification failures. Check that the address is 32-44 characters long and consists only of valid base58 characters (no 0, O, I, or l — these are excluded from base58 to avoid visual ambiguity). On the server side, verify that the address in the signed output matches the address you expected (typically the address of the connected wallet).

## nonce

The \`nonce\` is the single most important security field in SIWS. It is a server-generated, unique, unpredictable string that ties the sign-in request to a specific authentication attempt. The nonce must be at least 8 characters long and should be alphanumeric. In production, nonces are typically 16-32 character random strings generated using a cryptographically secure random number generator.

Security rule: nonces must be generated server-side, never client-side. If the client generates its own nonce, an attacker can reuse a previously valid nonce-signature pair. The server must store the nonce (with a TTL matching the sign-in expiration window) and check it during verification. After successful verification, the nonce must be permanently invalidated (deleted or marked as consumed). The nonce storage must be atomic — a race condition where two requests verify the same nonce simultaneously would defeat the replay protection entirely.

Nonce storage options include: in-memory maps (suitable for single-server deployments), Redis with TTL (suitable for distributed systems), and database tables with unique constraints. Whatever storage is used, the invalidation must be atomic: check-and-delete in a single operation, not check-then-delete in two steps.

## issuedAt

The \`issuedAt\` field is an ISO 8601 timestamp indicating when the sign-in request was created. It provides temporal context for the authentication attempt. The server sets this value when generating the sign-in input.

Security rule: during verification, the server must check that \`issuedAt\` is not in the future (allowing a small clock skew tolerance of 1-2 minutes). A sign-in request with a future issuedAt timestamp is suspicious — it may indicate clock manipulation or request fabrication. The server should also reject sign-in requests where issuedAt is too far in the past, even if the expirationTime has not passed. A reasonable maximum age for issuedAt is 10-15 minutes.

## expirationTime

The \`expirationTime\` field is an optional ISO 8601 timestamp indicating when the sign-in request becomes invalid. If present, it must be strictly after \`issuedAt\`. If absent, the sign-in request has no explicit expiration (though the server should still enforce a maximum age based on issuedAt).

Security rule: if expirationTime is present, the server must verify that the current time is before the expiration. Expired sign-in requests must be rejected regardless of signature validity. Setting short expiration windows (5-15 minutes) reduces the window for replay attacks and limits the useful lifetime of intercepted sign-in requests. Production systems should always set expirationTime rather than relying solely on nonce expiration.

## statement

The \`statement\` field is a human-readable string that the wallet displays to the user, describing what they are approving. If not provided by the dApp, a sensible default is "Sign in to <domain>". The statement should be concise, clear, and accurately describe the action.

Security rule: the statement is informational and should not contain sensitive data. It is included in the signed message, so it is visible to anyone who can see the signature. Do not include session tokens, API keys, or other secrets in the statement. The wallet renders the statement as-is, so avoid HTML, markdown, or other formatting that might be misinterpreted.

## chainId and resources

The \`chainId\` field identifies the Solana cluster (e.g., "mainnet-beta", "devnet", "testnet"). This prevents cross-cluster authentication where a signature obtained on devnet is replayed on mainnet. The \`resources\` field is an optional array of URIs that the sign-in grants access to. These are informational and displayed by the wallet.

Security rule: if your dApp operates on a specific cluster, verify that the chainId in the signed output matches your expected cluster. Resources should be validated as well-formed URIs but their enforcement is application-specific.

## Checklist
- Domain must not include protocol, path, or port
- Nonce must be >= 8 alphanumeric characters, generated server-side
- issuedAt must not be in the future; reject stale requests
- expirationTime (if present) must be after issuedAt and not yet passed
- Address must be 32-44 characters of valid base58
- Statement should default to "Sign in to <domain>" if not provided

## Red flags
- Accepting client-generated nonces
- Not validating domain format (allowing protocol prefixes)
- Missing atomic nonce invalidation (check-then-delete race condition)
- No maximum age check on issuedAt
- Storing secrets in the statement field
`,
  blocks: [
    {
      type: "quiz",
      id: "siws-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "siws-v2-l2-q1",
          prompt: "Why must nonces be generated server-side rather than client-side?",
          options: [
            "Client-generated nonces allow attackers to reuse previously valid nonce-signature pairs",
            "Client-side random number generators are too slow",
            "Wallets cannot sign messages containing client-generated nonces",
          ],
          answerIndex: 0,
          explanation: "If the client generates nonces, an attacker can replay a previously captured nonce-signature pair. Server-generated nonces ensure each authentication attempt is unique and controlled by the server.",
        },
        {
          id: "siws-v2-l2-q2",
          prompt: "What format must the domain field use?",
          options: [
            "Plain domain name without protocol prefix (e.g., example.com)",
            "Full URL with protocol (e.g., https://example.com)",
            "IP address with port number",
          ],
          answerIndex: 0,
          explanation: "The domain field must be a plain domain name. Protocol prefixes, paths, ports, and query strings must be rejected to ensure consistent domain matching.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "siws-v2-message-preview",
  slug: "siws-v2-message-preview",
  title: "Message preview: how wallets render SIWS requests",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Message preview: how wallets render SIWS requests

When a dApp sends a SIWS sign-in request to a wallet, the wallet transforms the structured input into a human-readable message that the user sees on the approval screen. Understanding exactly how this rendering works is critical for dApp developers — it determines what users see, what they trust, and what they sign.

## The SIWS message format

The SIWS standard defines a specific text format for the message that gets signed. The wallet constructs this message from the structured input fields. The format follows a predictable template that wallets can both generate and parse. The message begins with the domain and address, followed by a statement, then a structured block of metadata fields.

A complete SIWS message looks like this:

\`\`\`
example.com wants you to sign in with your Solana account:
7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY

Sign in to example.com

Nonce: abc12345def67890
Issued At: 2024-01-15T10:30:00Z
Expiration Time: 2024-01-15T11:30:00Z
Chain ID: mainnet-beta
\`\`\`

The first line always follows the pattern: "\`<domain>\` wants you to sign in with your Solana account:". This phrasing is standardized so users learn to recognize it across all SIWS-compatible dApps. The second line is the full public key address. A blank line separates the header from the statement. Another blank line separates the statement from the metadata fields.

## Wallet rendering expectations

Modern Solana wallets (Phantom, Solflare, Backpack) recognize SIWS-formatted messages and render them with enhanced UI. Instead of displaying raw text, they parse the structured fields and present them in a formatted approval screen with clear sections.

The domain is typically displayed prominently at the top of the approval screen, often with the dApp's favicon if available. This is the primary trust signal — users should check this domain matches the site they are interacting with. Some wallets cross-reference the domain against the connecting origin and display a warning if they do not match.

The statement is shown in a distinct section, often with larger or bolder text. This is the human-readable explanation of what the user is approving. For sign-in requests, it typically says something like "Sign in to example.com" or a custom message the dApp provides.

The metadata fields (nonce, issuedAt, expirationTime, chainId, resources) are shown in a structured format, often collapsible or in a "details" section. Most users do not read these fields, but their presence signals that the request is well-formed and follows the standard. Security-conscious users can verify the nonce matches their expectation and the timestamps are reasonable.

## What users actually see versus what gets signed

It is important to understand that what the wallet displays and what actually gets signed can differ. The wallet renders a formatted UI from the parsed fields, but the actual bytes that are signed are the serialized message text in the standard format. The wallet constructs the canonical message text, displays a parsed version to the user, and signs the canonical text.

This creates a trust model: the user trusts the wallet to accurately represent the message content. If a wallet has a rendering bug (e.g., it shows the wrong domain), the user might approve a message they would otherwise reject. This is why using well-audited, mainstream wallets is important for SIWS security.

The signed bytes include the full message text prefixed with a Solana-specific preamble. The Ed25519 signature covers the entire message, including all fields. Changing any field (even adding a space) produces a completely different signature. This ensures that the server can verify not just that the user signed something, but that they signed the exact message with the exact fields the server expected.

## Building preview UIs in dApps

Before sending a SIWS request to the wallet, many dApps show a preview of the message in their own UI. This preview serves two purposes: it prepares the user for what they will see in the wallet (reducing confusion and approval time), and it provides a last checkpoint before triggering the wallet interaction.

The dApp preview should mirror the wallet's rendering as closely as possible. Show the domain, statement, and key metadata fields. Indicate that the user will be asked to approve this message in their wallet. If the dApp is using a custom statement, display it exactly as it will appear.

Do not include fields in the preview that might confuse users. The nonce, for example, is a random string that has no meaning to the user. Showing it adds visual noise without value. The preview can omit the nonce while the actual signed message includes it. Similarly, the chainId is important for verification but rarely interesting to users unless the dApp operates across multiple clusters.

## Edge cases in rendering

Several edge cases affect how SIWS messages are rendered and signed. Long domains may be truncated in wallet UIs — ensure your domain is concise. Internationalized domain names (IDN) should be tested with your target wallets, as some wallets may not render Unicode characters correctly. The statement field has no maximum length in the standard, but extremely long statements will be truncated or require scrolling in the wallet, reducing the chance that users read them fully.

Empty optional fields are omitted from the message text. If no expirationTime is set, the "Expiration Time:" line does not appear. If no resources are specified, no resources section appears. The message format adjusts dynamically based on which fields are present.

## Checklist
- Know the canonical SIWS message format and field ordering
- Understand that wallets parse and render structured UI from the message
- Build dApp-side previews that mirror wallet rendering
- Test your SIWS messages with target wallets to verify display
- Keep statements concise and domains short

## Red flags
- Assuming all wallets render SIWS messages identically
- Including sensitive data in the statement (it is visible in the signed message)
- Using extremely long statements that wallets truncate
- Not testing with real wallet approval screens during development
`,
  blocks: [
    {
      type: "terminal",
      id: "siws-v2-l3-preview",
      title: "SIWS Message Format",
      steps: [
        {
          cmd: "Construct SIWS message from input fields",
          output: "example.com wants you to sign in with your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z",
          note: "Canonical text format that gets signed by the wallet",
        },
        {
          cmd: "Wallet parses and displays structured approval screen",
          output: "Domain: example.com [verified]\nStatement: Sign in to example.com\nExpires: in 59 minutes\n[Approve] [Reject]",
          note: "Wallet renders structured UI from parsed fields",
        },
        {
          cmd: "User approves -> wallet signs canonical message bytes",
          output: "Signature: 3AuYNW... (Ed25519 over message bytes)\nPublic Key: 7Y4f3T...",
          note: "Signed output returned to the dApp for server verification",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "siws-v2-sign-in-input",
  slug: "siws-v2-sign-in-input",
  title: "Challenge: Build a validated SIWS sign-in input",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Build a validated SIWS sign-in input

Implement a function that creates a validated Sign-In With Solana input:

- Validate domain (non-empty, must not include protocol prefix)
- Validate nonce (at least 8 characters, alphanumeric only)
- Validate address format (32-44 characters for Solana base58)
- Set issuedAt (required) and optional expirationTime with ordering check
- Default statement to "Sign in to <domain>" if not provided
- Return structured result with valid flag and collected errors

Your implementation must be fully deterministic — same input always produces same output.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "siws-v2-verify-sign-in",
  slug: "siws-v2-verify-sign-in",
  title: "Challenge: Verify a SIWS sign-in response",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Verify a SIWS sign-in response

Implement server-side verification of a SIWS sign-in output:

- Check domain matches expected domain
- Check nonce matches expected nonce
- Check issuedAt is not in the future relative to currentTime
- Check expirationTime (if present) has not passed
- Check address matches expected signer
- Return verification result with individual check statuses and error list

All five checks must pass for the sign-in to be considered verified.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "siws-v2-sessions",
  slug: "siws-v2-sessions",
  title: "Sessions and logout: what to store and what not to store",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Sessions and logout: what to store and what not to store

After a successful SIWS sign-in verification, the server must establish a session so the user does not need to re-authenticate on every request. Session management for wallet-based authentication has unique characteristics compared to traditional username-password systems. Understanding what to store, where to store it, and how to handle logout is essential for building secure dApps.

## What a SIWS session contains

A SIWS session represents a verified claim: "Public key X proved ownership by signing a SIWS message for domain Y at time Z." The session should store exactly enough information to enforce authorization decisions without requiring re-verification. The minimum session payload includes: the wallet address (public key), the domain the sign-in was verified for, the session creation time, and the session expiration time.

Do NOT store the SIWS signature, the signed message, or the nonce in the session. These are verification artifacts, not session data. The signature has no purpose after verification — it proved the user controlled the key at the time of signing, and that proof is now captured by the session itself. Storing signatures in sessions creates unnecessary data that, if leaked, provides no additional attack surface but adds complexity and storage cost.

Session identifiers should be opaque, random tokens — not derived from the wallet address. Using the wallet address as a session ID is a common mistake because wallet addresses are public. Anyone who knows a user's address could forge requests. The session ID must be a cryptographically random string (e.g., 256-bit random value, base64-encoded) that maps to the session data on the server side.

## Server-side vs client-side session storage

Server-side sessions store session data in a backend store (Redis, database, in-memory map) and issue a session token (cookie or bearer token) to the client. The client presents the token on each request, and the server looks up the associated session data. This is the most secure pattern because the server controls all session state.

Client-side sessions (JWTs) encode the session data directly in the token. The server signs the JWT and the client includes it in requests. The server verifies the JWT signature and reads the session data without a backend lookup. This is simpler to deploy but has significant drawbacks: JWTs cannot be individually revoked (you must wait for expiration or maintain a revocation list), the session data is visible to the client (encrypted JWTs mitigate this), and JWT size grows with payload data.

For SIWS authentication, server-side sessions are recommended because they support immediate revocation (critical for security incidents) and keep session data private. If using JWTs, keep the payload minimal (wallet address and expiration only), use short expiration times (15-60 minutes), and implement a refresh token flow for session extension.

## Session expiration and refresh

Session lifetimes for wallet-authenticated dApps should be shorter than traditional web sessions. Users can sign a new SIWS message quickly (a few seconds), so the cost of re-authentication is low. Recommended session lifetime is 1-4 hours for active sessions, with a sliding window that extends the expiration on each authenticated request.

Refresh tokens can extend session lifetime without requiring re-authentication. The flow is: issue a short-lived access token (15-60 minutes) and a longer-lived refresh token (24-72 hours). When the access token expires, the client presents the refresh token to obtain a new access token. The refresh token is single-use (rotated on each refresh) and stored securely.

Absolute session lifetime should be enforced regardless of refresh activity. Even if a user keeps refreshing, the session should eventually require re-authentication. A reasonable absolute lifetime is 7-30 days. This limits the damage from a stolen refresh token.

## Logout implementation

Logout for wallet-based authentication is simpler than login but has important nuances. The server must invalidate the session on the backend (delete the session from the store or add the JWT to a revocation list). The client must clear all local session artifacts (cookies, localStorage tokens, in-memory state).

Wallet disconnection is not the same as logout. When a user disconnects their wallet from the dApp (using the wallet's disconnect feature), the dApp should treat this as a logout signal and invalidate the server session. However, some dApps maintain the session even after wallet disconnection, which can confuse users who expect disconnection to log them out.

Implementing "logout everywhere" (invalidating all sessions for a wallet address) requires server-side session storage with an index by wallet address. When triggered, query all sessions for the address and invalidate them. This is useful for security incidents or when the user suspects their session was compromised.

## What NOT to store in sessions

Never store the user's private key (obviously). Never store the SIWS nonce (it has been consumed and should be deleted from the nonce store). Never store the raw SIWS signature (it is a verification artifact). Never store personally identifiable information (PII) unless your dApp explicitly collects it — wallet addresses are pseudonymous by default.

Avoid storing wallet balances, token holdings, or other on-chain data in the session. This data changes constantly and becomes stale immediately. Fetch it fresh from the RPC when needed. Sessions should be lightweight: address, permissions, timestamps, and nothing more.

## Checklist
- Store wallet address, domain, creation time, and expiration in sessions
- Use cryptographically random session IDs, not wallet addresses
- Prefer server-side sessions for immediate revocation capability
- Enforce absolute session lifetime even with refresh tokens
- Invalidate sessions on both logout and wallet disconnect
- Never store signatures, nonces, or PII in sessions

## Red flags
- Using wallet address as session ID
- Storing SIWS signature or nonce in the session
- No session expiration or unlimited lifetime
- JWT sessions without revocation mechanism
- Ignoring wallet disconnect events
`,
  blocks: [
    {
      type: "quiz",
      id: "siws-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "siws-v2-l6-q1",
          prompt: "Why should session IDs be random tokens rather than wallet addresses?",
          options: [
            "Wallet addresses are public, so anyone could forge requests using a known address",
            "Random tokens are shorter and save bandwidth",
            "Wallet addresses change frequently and break sessions",
          ],
          answerIndex: 0,
          explanation: "Wallet addresses are publicly known. Using them as session IDs would allow anyone who knows a user's address to impersonate their session. Random tokens ensure only the authenticated client can present a valid session.",
        },
        {
          id: "siws-v2-l6-q2",
          prompt: "What should happen when a user disconnects their wallet from a dApp?",
          options: [
            "The dApp should invalidate the server-side session (treat it as logout)",
            "Nothing — the session should persist for convenience",
            "The dApp should reconnect the wallet automatically",
          ],
          answerIndex: 0,
          explanation: "Wallet disconnection signals the user's intent to end the interaction. The dApp should respect this by invalidating the session, preventing confusion about authentication state.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "siws-v2-replay-protection",
  slug: "siws-v2-replay-protection",
  title: "Replay protection and nonce registry design",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Replay protection and nonce registry design

Replay attacks are the most critical threat to any signature-based authentication system. In a replay attack, an adversary captures a valid signed message and submits it again to the server, impersonating the original signer. SIWS addresses this with nonce-based replay protection, but the implementation details of the nonce registry determine whether the protection actually works.

## How replay attacks work against SIWS

Consider a SIWS sign-in flow without proper nonce management. The user signs a message: "example.com wants you to sign in with your Solana account: Wallet111... Nonce: abc123 Issued At: 2024-01-01T00:00:00Z". The server verifies the signature and creates a session. The signed message and signature are transmitted over HTTPS and should be safe in transit.

However, the signed message could be captured through: a compromised server log that records request bodies, a malicious browser extension that intercepts WebSocket traffic, a man-in-the-middle proxy in a development or corporate environment, or a compromised CDN that logs request payloads. If the attacker obtains the signed SIWS output, they can submit it to the server as if they were the original signer.

Without nonce protection, the server would verify the signature (it is valid — the user really did sign it), check the domain (it matches), check the timestamps (they may still be within bounds), and accept the authentication. The attacker now has a valid session for the victim's wallet address.

## Nonce lifecycle

The nonce lifecycle has four phases: generation, issuance, verification, and consumption. Each phase has specific requirements.

Generation: the server creates a cryptographically random nonce using a secure random number generator. The nonce must be unpredictable — an attacker should not be able to guess the next nonce by observing previous ones. Use at least 128 bits of entropy (16 bytes, 22 base64 characters or 32 hex characters). Store the nonce in the registry with a TTL and the expected wallet address.

Issuance: the server includes the nonce in the SIWS input sent to the client. The nonce travels from server to client to wallet and back. During this transit, the nonce is not secret (it is included in the signed message), but it is unique. The important property is not secrecy but freshness — this specific nonce has never been used before.

Verification: when the server receives the signed SIWS output, it extracts the nonce and checks the registry. The nonce must exist in the registry (rejecting fabricated nonces), must not be marked as consumed (rejecting replays), and must not have expired (rejecting stale requests). These checks must happen before signature verification to fail fast on obvious replays.

Consumption: after successful verification, the nonce is atomically marked as consumed or deleted from the registry. This is the critical step — if consumption is not atomic, two concurrent requests with the same nonce could both pass the "not consumed" check before either marks it as consumed. This race condition completely defeats replay protection.

## Nonce registry design patterns

The nonce registry is the data structure that stores issued nonces and tracks their state. Several patterns are used in production.

In-memory map with TTL: a simple hash map where keys are nonce strings and values are metadata (creation time, expected address, consumed flag). A background timer periodically cleans expired entries. This works for single-server deployments but does not scale to multiple servers (each server has its own map and cannot validate nonces issued by other servers).

Redis with atomic operations: Redis provides the ideal primitives for nonce management. Use SET with NX (set-if-not-exists) for atomic consumption: attempt to set a "consumed" key; if it already exists, the nonce was already used. Use TTL on nonce keys for automatic expiration. Redis is distributed, so all servers share the same nonce registry.

The Redis pattern for atomic nonce consumption:

1. On issuance: \`SET nonce:<value> "issued" EX 600\` (10-minute TTL)
2. On verification: \`SET nonce:<value>:consumed "1" NX EX 600\`
   - If SET NX succeeds (returns OK): nonce is valid and now consumed
   - If SET NX fails (returns nil): nonce was already consumed (replay attempt)

Database with unique constraints: store nonces in a table with a unique constraint on the nonce value and a "consumed_at" column. Consumption is an UPDATE that sets consumed_at where consumed_at IS NULL. If the update affects 0 rows, the nonce was already consumed. Database transactions ensure atomicity but add latency compared to Redis.

## Handling edge cases

Clock skew between servers affects nonce TTL enforcement. If server A issues a nonce with a 10-minute TTL but server B's clock is 3 minutes ahead, server B may consider the nonce expired after only 7 minutes from the user's perspective. Use NTP synchronization across servers and add a grace period (30-60 seconds) to TTL checks.

Nonce reuse across different wallet addresses should be rejected. Even if wallet A's nonce was consumed, do not allow wallet B to use the same nonce value. This is automatically handled if the nonce registry indexes by nonce value regardless of address. However, some implementations associate nonces with specific addresses and might accidentally allow cross-address reuse.

High-traffic systems may generate thousands of nonces per second. The registry must handle this volume without becoming a bottleneck. Redis handles this easily. In-memory maps work if garbage collection of expired nonces is efficient. Database-backed registries need proper indexing and periodic cleanup of consumed nonces.

## Monitoring and alerting

Production nonce registries should emit metrics: nonces generated per minute, nonces consumed per minute, replay attempts blocked per minute, nonces expired unused per minute. A sudden spike in replay attempts indicates an active attack. A high ratio of expired-to-consumed nonces may indicate UX issues (users starting but not completing sign-in).

Log every replay attempt with the nonce value, the submitting IP address, and the associated wallet address. This data feeds into security incident investigation. Alert on replay attempt rates exceeding a threshold (e.g., more than 10 per minute from the same IP).

## Checklist
- Use cryptographically random nonces with >= 128 bits of entropy
- Implement atomic nonce consumption (check-and-invalidate in one operation)
- Set nonce TTL matching the sign-in expiration window (5-15 minutes)
- Use Redis or equivalent distributed store for multi-server deployments
- Monitor and alert on replay attempt rates
- Clean up expired nonces periodically

## Red flags
- Non-atomic nonce consumption (check-then-delete race condition)
- In-memory nonce storage in a multi-server deployment
- No nonce TTL (nonces accumulate forever)
- Allowing nonce reuse across different wallet addresses
- No monitoring of replay attempt rates
`,
  blocks: [
    {
      type: "terminal",
      id: "siws-v2-l7-nonce-flow",
      title: "Nonce Lifecycle",
      steps: [
        {
          cmd: "Server: generate nonce",
          output: "nonce = 'k9Xm2pQr7vNw4cBh' (128-bit random, base62)",
          note: "Cryptographically random, stored in Redis with 10-min TTL",
        },
        {
          cmd: "Server: issue SIWS input to client",
          output: '{"domain":"example.com","nonce":"k9Xm2pQr7vNw4cBh","issuedAt":"..."}',
          note: "Nonce travels: server -> client -> wallet -> signed output",
        },
        {
          cmd: "Server: verify and consume nonce (atomic)",
          output: "SET nonce:k9Xm2pQr7vNw4cBh:consumed 1 NX -> OK (first use, valid)",
          note: "Atomic SET NX ensures only one request can consume the nonce",
        },
        {
          cmd: "Attacker: replay same signed output",
          output: "SET nonce:k9Xm2pQr7vNw4cBh:consumed 1 NX -> nil (already consumed!)",
          note: "Replay blocked: nonce was already consumed",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "siws-v2-auth-report",
  slug: "siws-v2-auth-report",
  title: "Checkpoint: Generate an auth audit report",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate an auth audit report

Build the final auth audit report that combines all course concepts:

- Process an array of authentication attempts with address, nonce, and verified status
- Track used nonces to detect and block replay attempts (duplicate nonce = replay)
- Count successful sign-ins, failed sign-ins, and replay attempts blocked
- Count unique wallet addresses across all attempts
- Build a nonce registry with status for each attempt: "consumed", "rejected", or "replay-blocked"
- Include the report timestamp

This checkpoint validates your complete understanding of SIWS authentication and nonce-based replay protection.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "siws-v2-fundamentals",
  title: "SIWS Fundamentals",
  description:
    "SIWS rationale, strict input-field semantics, wallet rendering behavior, and deterministic sign-in input construction.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "siws-v2-verification",
  title: "Verification & Security",
  description:
    "Server-side verification invariants, nonce replay defenses, session management, and deterministic auth audit reporting.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const signInWithSolanaCourse: Course = {
  id: "course-sign-in-with-solana",
  slug: "sign-in-with-solana",
  title: "Sign-In With Solana",
  description:
    "Master production SIWS authentication on Solana: standardized inputs, strict verification invariants, replay-resistant nonce lifecycle, and audit-ready reporting.",
  difficulty: "intermediate",
  duration: "12 hours",
  totalXP: 400,
  tags: ["siws", "authentication", "wallet", "session", "solana"],
  imageUrl: "/images/courses/sign-in-with-solana.svg",
  modules: [module1, module2],
};
