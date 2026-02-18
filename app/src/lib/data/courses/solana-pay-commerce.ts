import type { Challenge, Course, Lesson, Module } from "@/types/content";
import {
  lesson4Hints,
  lesson4SolutionCode,
  lesson4StarterCode,
  lesson4TestCases,
} from "@/lib/courses/solana-pay-commerce/challenges/lesson-4-encode-transfer";
import {
  lesson5Hints,
  lesson5SolutionCode,
  lesson5StarterCode,
  lesson5TestCases,
} from "@/lib/courses/solana-pay-commerce/challenges/lesson-5-reference-tracker";
import {
  lesson8Hints,
  lesson8SolutionCode,
  lesson8StarterCode,
  lesson8TestCases,
} from "@/lib/courses/solana-pay-commerce/challenges/lesson-8-pos-receipt";

const lesson1: Lesson = {
  id: "solanapay-v2-mental-model",
  slug: "solanapay-v2-mental-model",
  title: "Solana Pay mental model and URL encoding rules",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Solana Pay mental model and URL encoding rules

Solana Pay is an open specification for encoding payment requests into URLs that wallets can parse and execute. Unlike traditional payment processors that rely on centralized intermediaries, Solana Pay enables direct peer-to-peer value transfer by embedding all the information a wallet needs into a single URI string. Understanding this specification deeply is the foundation for building any commerce integration on Solana.

The Solana Pay specification defines two distinct request types: transfer requests and transaction requests. Transfer requests are the simpler of the two — they encode a recipient address, an amount, and optional metadata directly in the URL. The wallet parses the URL, constructs a standard SOL or SPL token transfer transaction, and submits it to the network. Transaction requests are more powerful — the URL points to an API endpoint that returns a serialized transaction for the wallet to sign. This allows the merchant server to build arbitrarily complex transactions (multi-instruction, program interactions, etc.) while the wallet simply signs what it receives.

The URL format follows a strict schema. A transfer request URL takes the form: \`solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>&memo=<memo>\`. The scheme is always \`solana:\` (not \`solana://\`). The recipient is a base58-encoded Solana public key placed immediately after the colon with no slashes. Query parameters encode the payment details.

Each parameter has specific encoding rules. The \`amount\` is a decimal string representing the number of tokens (not lamports or raw units). For native SOL, \`amount=1.5\` means 1.5 SOL. For SPL tokens, the amount is in the token's human-readable units respecting its decimals. The \`spl-token\` parameter is optional — when absent, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token. The \`reference\` parameter is one or more base58 public keys that are added as non-signer keys in the transfer instruction, enabling transaction discovery via \`getSignaturesForAddress\`. The \`label\` identifies the merchant or payment recipient in a human-readable format. The \`message\` provides a description of the payment purpose. Both \`label\` and \`message\` must be URL-encoded using percent-encoding (spaces become \`%20\`, special characters like \`#\` become \`%23\`).

When should you use transfer requests versus transaction requests? Transfer requests are ideal for simple point-of-sale payments where the merchant only needs to receive a fixed amount of a single token. They work entirely client-side — no server needed. Transaction requests are necessary when the payment involves multiple instructions (e.g., creating an associated token account, interacting with a program, splitting payments among multiple recipients, or including on-chain metadata). Transaction requests require a server endpoint that the wallet calls to fetch the transaction.

URL encoding correctness is critical. A malformed URL will be rejected by compliant wallets. Common mistakes include: using \`solana://\` instead of \`solana:\`, encoding the recipient address incorrectly, omitting percent-encoding for special characters in labels, and providing amounts in raw token units instead of human-readable decimals. The specification requires that all base58 values are valid Solana public keys (32 bytes when decoded), and that amounts are non-negative finite decimal numbers.

The reference key mechanism is what makes Solana Pay practical for commerce. By generating a unique keypair per transaction and including its public key as a reference, the merchant can poll \`getSignaturesForAddress(reference)\` to detect when the payment arrives. This eliminates the need for webhooks or push notifications — the merchant simply polls until the reference appears in a confirmed transaction, then verifies the transfer details match the expected payment.

## Checklist
- Use \`solana:\` scheme (no double slashes)
- Place the recipient base58 address directly after the colon
- Encode label and message with encodeURIComponent
- Use human-readable decimal amounts, not raw lamport values
- Generate a unique reference keypair per payment for tracking

## Red flags
- Using \`solana://\` instead of \`solana:\`
- Sending raw lamport amounts in the amount field
- Forgetting to URL-encode label and message parameters
- Reusing reference keys across multiple payments
`,
  blocks: [
    {
      type: "quiz",
      id: "solanapay-v2-l1-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "solanapay-v2-l1-q1",
          prompt: "What is the correct URL scheme for Solana Pay transfer requests?",
          options: [
            "solana:<recipient> (single colon, no slashes)",
            "solana://<recipient> (double slashes like HTTP)",
            "pay:<recipient> (custom pay scheme)",
          ],
          answerIndex: 0,
          explanation: "The Solana Pay specification uses the 'solana:' scheme followed immediately by the recipient address with no slashes.",
        },
        {
          id: "solanapay-v2-l1-q2",
          prompt: "When should you use a transaction request instead of a transfer request?",
          options: [
            "When the payment requires multiple instructions or program interactions beyond a simple transfer",
            "When the amount exceeds 100 SOL",
            "When paying with native SOL instead of SPL tokens",
          ],
          answerIndex: 0,
          explanation: "Transaction requests allow the server to build arbitrarily complex transactions. Transfer requests only support simple single-token transfers.",
        },
      ],
    },
  ],
};

const lesson2: Lesson = {
  id: "solanapay-v2-transfer-anatomy",
  slug: "solanapay-v2-transfer-anatomy",
  title: "Transfer request anatomy: recipient, amount, reference, and labels",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Transfer request anatomy: recipient, amount, reference, and labels

A Solana Pay transfer request URL contains everything a wallet needs to construct and submit a payment transaction. Each component of the URL serves a specific purpose in the payment flow. Understanding the anatomy of these requests — and how each field maps to on-chain behavior — is essential for building reliable commerce integrations.

The recipient address is the most critical field. It appears immediately after the \`solana:\` scheme and must be a valid base58-encoded Solana public key. For native SOL transfers, this is the wallet address that will receive the SOL. For SPL token transfers, this is the wallet address whose associated token account (ATA) will receive the tokens. The wallet application is responsible for deriving the correct ATA from the recipient address and the SPL token mint. If the recipient's ATA does not exist, the wallet must create it as part of the transaction (using \`createAssociatedTokenAccountIdempotent\`). A malformed or invalid recipient address will cause the wallet to reject the payment request entirely.

The amount parameter specifies how much to transfer in human-readable decimal form. For native SOL, \`amount=2.5\` means 2.5 SOL (2,500,000,000 lamports internally). For USDC (6 decimals), \`amount=10.50\` means 10.50 USDC (10,500,000 raw units). The wallet handles the conversion from decimal to raw units based on the token's decimal configuration. This design keeps the URL readable by humans and consistent across tokens with different decimal places. The amount must be a positive finite number — zero, negative, or infinite values are invalid.

The spl-token parameter distinguishes SOL transfers from SPL token transfers. When omitted, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token to transfer. Common examples include USDC (\`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\`), USDT (\`Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx\`), and any other SPL token. The wallet validates that the mint exists and that the sender has a sufficient balance before constructing the transaction.

The reference parameter is what makes Solana Pay viable for real-time commerce. A reference is a base58-encoded public key that gets added as a non-signer account in the transfer instruction. After the transaction confirms, anyone can call \`getSignaturesForAddress(reference)\` to find the transaction containing this reference. The merchant generates a unique reference keypair for each payment request, encodes the public key in the URL, and then polls the Solana RPC to detect when a matching transaction appears. Multiple references can be included by repeating the parameter: \`reference=<key1>&reference=<key2>\`. This is useful when multiple parties need to independently track the same payment.

The label parameter identifies the merchant or payment recipient. It appears in the wallet's confirmation dialog so the user knows who they are paying. For example, \`label=Sunrise%20Coffee\` tells the user they are paying "Sunrise Coffee." The label must be URL-encoded — spaces become \`%20\`, ampersands become \`%26\`, and other special characters use standard percent-encoding. Keeping labels concise (under 50 characters) ensures they display properly across different wallet implementations.

The message parameter provides additional context about the payment. It might include an order number, item description, or other merchant-specific information. Like the label, it must be URL-encoded. Example: \`message=Order%20%23157%20-%202x%20Espresso\`. Some wallets display the message in a secondary line below the label, while others may truncate long messages. The memo parameter (not to be confused with message) adds an on-chain memo instruction to the transaction, creating a permanent on-chain record. Use message for display purposes and memo for data that must be recorded on-chain.

The complete flow works as follows: (1) the merchant generates a unique reference keypair, (2) constructs the Solana Pay URL with all parameters, (3) encodes the URL into a QR code or deep link, (4) the customer scans/clicks and their wallet parses the URL, (5) the wallet constructs the transfer transaction including the reference as a non-signer account, (6) the customer approves and the wallet submits the transaction, (7) the merchant polls \`getSignaturesForAddress(reference)\` until it finds the confirmed transaction, (8) the merchant verifies the transaction details match the expected payment.

## Checklist
- Validate recipient is a proper base58 public key (32-44 characters)
- Use human-readable decimal amounts matching the token's precision
- Generate a fresh reference keypair for every payment request
- URL-encode label and message with encodeURIComponent
- Include spl-token only when transferring SPL tokens, not native SOL

## Red flags
- Reusing the same reference across multiple payment requests
- Providing amounts in raw lamports or smallest token units
- Forgetting URL encoding on label or message (breaks parsing)
- Not validating the recipient address format before URL construction
`,
  blocks: [
    {
      type: "quiz",
      id: "solanapay-v2-l2-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "solanapay-v2-l2-q1",
          prompt: "How does the reference parameter enable payment tracking?",
          options: [
            "It is added as a non-signer account, allowing getSignaturesForAddress to find the transaction",
            "It creates a webhook that notifies the merchant",
            "It stores the payment ID in the transaction memo",
          ],
          answerIndex: 0,
          explanation: "The reference public key is included as a non-signer account in the transfer instruction. The merchant polls getSignaturesForAddress(reference) to detect when the payment transaction confirms.",
        },
        {
          id: "solanapay-v2-l2-q2",
          prompt: "What amount value represents 2.5 USDC in a Solana Pay URL?",
          options: [
            "amount=2.5 (human-readable decimal)",
            "amount=2500000 (raw units with 6 decimals)",
            "amount=2500000000 (raw units with 9 decimals)",
          ],
          answerIndex: 0,
          explanation: "Solana Pay URLs use human-readable decimal amounts. The wallet handles the conversion to raw units based on the token's decimal configuration.",
        },
      ],
    },
  ],
};

const lesson3: Lesson = {
  id: "solanapay-v2-url-explorer",
  slug: "solanapay-v2-url-explorer",
  title: "URL builder: live preview of Solana Pay URLs",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# URL builder: live preview of Solana Pay URLs

Building Solana Pay URLs correctly requires understanding how each parameter contributes to the final encoded string. In this lesson, we walk through the construction process step by step, examining how different combinations of parameters produce different URLs and how encoding rules affect the output.

The base URL always starts with the \`solana:\` scheme followed by the recipient address. There are no slashes, no host, no path segments — just the scheme colon and the base58 address. For example: \`solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\`. This alone is a valid Solana Pay URL, though it lacks an amount and would prompt the wallet to request the amount from the user.

Adding query parameters transforms the base URL into a complete payment request. The first parameter is separated from the recipient by \`?\`, and subsequent parameters are separated by \`&\`. Parameter order does not affect validity, but convention places amount first for readability. A SOL transfer for 1.5 SOL: \`solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5\`.

Adding an SPL token changes the transfer type. Including \`spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\` tells the wallet this is a USDC transfer, not a SOL transfer. The amount is still in human-readable form — \`amount=10\` means 10 USDC, not 10 raw units. The wallet reads the mint's decimal configuration from the chain and converts accordingly.

The reference parameter enables payment detection. Each payment should include a unique reference public key. In practice, you generate a Keypair, extract its public key as a base58 string, and include it: \`reference=Ref1111111111111111111111111111111111111111\`. After the customer pays, you poll \`getSignaturesForAddress\` with this reference to find the transaction. Multiple references can be included for multi-party tracking.

URL encoding for labels and messages follows standard percent-encoding rules. The JavaScript function \`encodeURIComponent\` handles this correctly. Spaces become \`%20\`, the hash symbol becomes \`%23\`, ampersands become \`%26\`, and so on. For example, a label "Joe's Coffee & Tea" encodes to \`label=Joe's%20Coffee%20%26%20Tea\`. Failing to encode these characters breaks the URL parser — an unencoded \`&\` in a label would be interpreted as a parameter separator, splitting the label and creating an invalid parameter.

Let us trace through a complete example. A coffee shop wants to charge 4.25 USDC for order number 157. The shop's wallet address is \`7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\`. They generate a reference key \`Ref1111111111111111111111111111111111111111\`. The resulting URL: \`solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=4.25&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111&label=Sunrise%20Coffee&message=Order%20%23157\`.

Validation before encoding catches errors early. Before building the URL, verify: the recipient is a valid base58 string of 32-44 characters, the amount is a positive finite number, the spl-token (if provided) is a valid base58 string, and the reference (if provided) is a valid base58 string. Emitting clear error messages for each validation failure helps developers debug integration issues quickly.

Edge cases to handle: (1) amounts with many decimal places — truncate to the token's decimal precision, (2) empty or whitespace-only labels — omit the parameter entirely rather than including an empty value, (3) extremely long messages — some wallets truncate at 256 characters, (4) Unicode characters in labels — encodeURIComponent handles UTF-8 encoding correctly, but test with your target wallets.

## Checklist
- Start with \`solana:\` followed immediately by the recipient address
- Use \`?\` before the first parameter and \`&\` between subsequent ones
- Apply encodeURIComponent to label and message values
- Validate all base58 fields before building the URL
- Test generated URLs with multiple wallet implementations

## Red flags
- Including raw unencoded special characters in labels or messages
- Building URLs with invalid or unvalidated recipient addresses
- Using fixed reference keys instead of generating unique ones per payment
- Omitting the spl-token parameter for SPL token transfers
`,
  blocks: [
    {
      type: "terminal",
      id: "solanapay-v2-l3-builder",
      title: "URL Builder Examples",
      steps: [
        {
          cmd: "SOL transfer: 1.5 SOL to merchant",
          output: "solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5&label=Coffee%20Shop",
          note: "Native SOL transfer — no spl-token parameter",
        },
        {
          cmd: "USDC transfer: 10 USDC with reference",
          output: "solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=10&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref111...111&label=Coffee%20Shop",
          note: "SPL token transfer with tracking reference",
        },
        {
          cmd: "Full payment URL with message",
          output: "solana:7Y4f...T6aY?amount=4.25&spl-token=EPjF...Dt1v&reference=Ref1...1111&label=Sunrise%20Coffee&message=Order%20%23157",
          note: "Complete POS payment request with all fields",
        },
      ],
    },
  ],
};

const lesson4: Challenge = {
  id: "solanapay-v2-encode-transfer",
  slug: "solanapay-v2-encode-transfer",
  title: "Challenge: Encode a Solana Pay transfer request URL",
  type: "challenge",
  xpReward: 60,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Encode a Solana Pay transfer request URL

Build a function that encodes a Solana Pay transfer request URL from input parameters:

- Validate the recipient address (must be 32-44 characters of valid base58)
- Validate the amount (must be a positive finite number)
- Construct the URL with the \`solana:\` scheme and query parameters
- Apply encodeURIComponent to label and message fields
- Include spl-token and reference only when provided
- Return validation errors when inputs are invalid

Your encoder must be fully deterministic — same input always produces the same URL.`,
  starterCode: lesson4StarterCode,
  testCases: lesson4TestCases,
  hints: lesson4Hints,
  solution: lesson4SolutionCode,
};

const lesson5: Challenge = {
  id: "solanapay-v2-reference-tracker",
  slug: "solanapay-v2-reference-tracker",
  title: "Challenge: Track payment references through confirmation states",
  type: "challenge",
  xpReward: 55,
  duration: "50 min",
  language: "typescript",
  content: `# Challenge: Track payment references through confirmation states

Build a reference tracking state machine that processes payment events:

- States flow: pending -> found -> confirmed -> finalized (or pending -> expired)
- The "found" event transitions from pending and records the transaction signature
- The "confirmation" event increments the confirmation counter and transitions from found to confirmed
- The "finalized" event transitions from confirmed to finalized
- The "timeout_check" event expires the reference if still pending after expiryTimeout seconds
- Record every state transition in a history array with from, to, and timestamp

Your tracker must be fully deterministic — same event sequence always produces the same result.`,
  starterCode: lesson5StarterCode,
  testCases: lesson5TestCases,
  hints: lesson5Hints,
  solution: lesson5SolutionCode,
};

const lesson6: Lesson = {
  id: "solanapay-v2-confirmation-ux",
  slug: "solanapay-v2-confirmation-ux",
  title: "Confirmation UX: pending, confirmed, and expired states",
  type: "content",
  xpReward: 40,
  duration: "45 min",
  content: `# Confirmation UX: pending, confirmed, and expired states

The user experience during payment confirmation is the most critical moment in any Solana Pay integration. Between the customer scanning the QR code and the merchant acknowledging receipt, there is a window of uncertainty that must be managed with clear visual feedback, appropriate timeouts, and graceful error handling. Getting this right determines whether customers trust your payment system.

The confirmation lifecycle follows a well-defined state machine. After the QR code is displayed, the system enters the **pending** state — waiting for the customer to scan and submit the transaction. The merchant's system continuously polls \`getSignaturesForAddress(reference)\` looking for a matching transaction. When a signature appears, the system transitions to the **found** state. The transaction has been submitted but may not yet be confirmed. The system then calls \`getTransaction(signature)\` to verify the payment details (recipient, amount, token) match the expected values. Once the transaction reaches sufficient confirmations, the state moves to **confirmed**. After the transaction is finalized (maximum commitment level, irreversible), the state reaches **finalized** and the merchant can safely release goods or services.

Each state requires distinct visual treatment. In the **pending** state, display the QR code prominently with a scanning animation or subtle pulse effect. Show a countdown timer indicating how long the payment request remains valid (typically 2-5 minutes). Include the amount, token, and merchant name so the customer can verify before scanning. A "Waiting for payment..." message with a spinner keeps the customer informed.

The **found** state is brief but important. When the transaction is detected, immediately replace the QR code with a checkmark or success animation. Display "Payment detected — confirming..." to signal progress. This instant visual feedback is critical — customers need to know their payment was received even before it confirms. Show the transaction signature (abbreviated, e.g., "sig: abc1...xyz9") for reference. If you have a Solana Explorer link, provide it.

The **confirmed** state means the transaction has at least one confirmation. For low-value transactions (coffee, small merchandise), this is sufficient to complete the sale. Display a prominent green checkmark, the confirmed amount, and the transaction reference. Print or display a receipt. For high-value transactions, you may want to wait for finalized status before releasing goods.

The **finalized** state is the strongest guarantee — the transaction is part of a rooted slot and cannot be reverted. This takes roughly 6-12 seconds after initial confirmation. For most point-of-sale applications, waiting for finalized is unnecessary and adds friction. However, for digital goods delivery, API key provisioning, or any irreversible fulfillment, finalized is the safe threshold.

The **expired** state handles the timeout case. If no matching transaction appears within the expiry window (e.g., 120 seconds), the payment request expires. Display "Payment request expired" with an option to generate a new QR code. Never silently expire — the customer may have just scanned and needs to know the request is no longer valid. The expiry timeout should be generous enough for the customer to open their wallet, review the transaction, and approve it (60-120 seconds minimum).

Error states require careful messaging. "Transaction not found after timeout" suggests the customer did not complete the payment. "Transaction found but details mismatch" indicates a potential issue — the amount or recipient does not match expectations. "Network error during polling" should trigger automatic retries before displaying an error to the user. Always provide actionable next steps: "Try again," "Generate new QR," or "Contact support."

Polling strategy affects both UX responsiveness and RPC load. Start polling immediately after displaying the QR code. Use a 1-second interval for the first 30 seconds (fast detection), then slow to 2-3 seconds for the remainder of the window. After detecting the transaction, switch to polling \`getTransaction\` with increasing commitment levels: processed -> confirmed -> finalized. Use exponential backoff if the RPC returns errors.

Accessibility considerations for payment confirmation: (1) Do not rely solely on color to indicate state — use icons, text labels, and animations. (2) Provide audio feedback (a subtle chime on confirmation) for environments where the screen may not be visible. (3) Ensure the QR code has sufficient contrast and size for scanning from a reasonable distance (at least 300x300 pixels). (4) Support both light and dark themes for the confirmation UI.

## Checklist
- Show distinct visual states: pending, found, confirmed, finalized, expired
- Display a countdown timer during the pending state
- Provide instant visual feedback when the transaction is detected
- Implement appropriate expiry timeouts (60-120 seconds)
- Offer actionable next steps on expiry or error

## Red flags
- No visual feedback between QR display and confirmation
- Silent expiry without notifying the customer
- Waiting for finalized on low-value point-of-sale transactions
- Polling too aggressively (every 100ms) and overloading the RPC
`,
  blocks: [
    {
      type: "quiz",
      id: "solanapay-v2-l6-quiz",
      title: "Concept Check",
      questions: [
        {
          id: "solanapay-v2-l6-q1",
          prompt: "When is 'confirmed' commitment sufficient versus waiting for 'finalized'?",
          options: [
            "Confirmed is sufficient for low-value POS transactions; finalized is needed for irreversible digital fulfillment",
            "Always wait for finalized regardless of transaction value",
            "Confirmed is never sufficient — always use finalized",
          ],
          answerIndex: 0,
          explanation: "For coffee-shop-scale payments, confirmed commitment provides a strong enough guarantee. Finalized adds 6-12 seconds of latency and is only necessary when fulfillment is irreversible.",
        },
        {
          id: "solanapay-v2-l6-q2",
          prompt: "What should happen when the payment request expires?",
          options: [
            "Display a clear expiry message with an option to generate a new QR code",
            "Silently restart the polling loop",
            "Redirect the customer to a different payment method",
          ],
          answerIndex: 0,
          explanation: "Expired requests should be clearly communicated. The customer may have been in the middle of approving — they need to know the request expired and can try again.",
        },
      ],
    },
  ],
};

const lesson7: Lesson = {
  id: "solanapay-v2-error-handling",
  slug: "solanapay-v2-error-handling",
  title: "Error handling and edge cases in payment flows",
  type: "content",
  xpReward: 45,
  duration: "50 min",
  content: `# Error handling and edge cases in payment flows

Production payment systems encounter a wide range of failure modes that must be handled gracefully. Solana Pay integrations face challenges unique to blockchain payments: network congestion, RPC failures, partial transaction visibility, and edge cases around token accounts. Building robust error handling separates demo-quality code from production-grade commerce systems.

RPC connectivity failures are the most common operational issue. The merchant's polling loop depends on a reliable connection to a Solana RPC endpoint. When the RPC is unreachable (network outage, rate limiting, endpoint downtime), the polling loop must not crash or silently stop. Implement retry logic with exponential backoff: first retry after 500ms, second after 1 second, third after 2 seconds, capping at 5 seconds between retries. After 5 consecutive failures, display a degraded-mode warning to the operator ("Network connectivity issue — payment detection may be delayed") while continuing to retry in the background. Never abandon polling due to transient RPC errors.

Rate limiting from RPC providers is a specific failure mode. Free-tier RPC endpoints (including the public Solana RPC) enforce request limits. A polling loop that fires every second generates 60+ requests per minute per active payment session. If you have 10 concurrent payment sessions, that is 600+ requests per minute. Solutions: use a dedicated RPC provider with higher limits, batch reference checks where possible, implement client-side request deduplication, and cache negative results (reference not found) for a short window before re-checking.

Transaction mismatch errors occur when a transaction is found via the reference but its details do not match expectations. This can happen if: (1) someone accidentally or maliciously sent a transaction that includes the reference key but with wrong amounts, (2) the customer used a different wallet that interpreted the URL differently, or (3) there is a bug in the URL encoding that produced incorrect parameters. When a mismatch is detected, log the full transaction details for debugging, display a clear error to the merchant ("Payment detected but amount does not match — expected 10 USDC, received 5 USDC"), and do not mark the payment as complete.

Insufficient balance errors are caught by the customer's wallet before submission, but the merchant has no visibility into this. From the merchant's perspective, it looks like the customer scanned the QR but never submitted the transaction. The timeout/expiry mechanism handles this case — after the expiry window passes, offer to regenerate the QR code. Consider displaying a message like "If you are having trouble, please ensure you have sufficient balance."

Associated token account (ATA) creation failures can occur when the customer's wallet does not automatically create the recipient's ATA for the SPL token being transferred. This is primarily a concern for less common SPL tokens where the recipient may not have an existing ATA. Modern wallets handle this by including a \`createAssociatedTokenAccountIdempotent\` instruction, but older wallet versions may not. The merchant can mitigate this by pre-creating ATAs for all tokens they accept.

Double-payment detection is essential. If the polling loop detects two transactions with the same reference, this indicates either a wallet bug or a user submitting the payment twice. The system should only process the first valid transaction and flag any subsequent ones for manual review. Track processed references in a database to prevent duplicate fulfillment.

Network congestion causes delayed transaction confirmation. During high-traffic periods, transactions may take 10-30 seconds to confirm instead of the usual 400ms-2 seconds. The payment UI should handle this gracefully: extend the visual "confirming" state, show a message like "Network is busy — confirmation may take longer than usual," and never time out a transaction that has been detected but not yet confirmed. The timeout should only apply to the initial pending state (waiting for any transaction to appear), not to the confirmation stage.

Partial visibility is a subtle edge case. Due to RPC node propagation delays, one RPC node may see a transaction while another does not. If your system uses multiple RPC endpoints (for redundancy), you may detect a transaction on one endpoint and fail to fetch its details from another. Solution: when a signature is found, retry \`getTransaction\` against the same endpoint that returned the signature, with retries and backoff, before falling back to alternative endpoints.

Memo and metadata validation should verify that any on-chain memo matches the expected payment metadata. If the merchant includes a \`memo\` parameter in the Solana Pay URL, the confirmed transaction should contain a corresponding memo instruction. Mismatches may indicate URL tampering.

## Checklist
- Implement exponential backoff for RPC failures (500ms, 1s, 2s, 5s cap)
- Verify transaction details match expected payment parameters
- Handle double-payment detection with reference deduplication
- Distinguish between pending timeout and confirmation timeout
- Pre-create ATAs for all accepted SPL tokens

## Red flags
- Crashing the polling loop on a single RPC error
- Marking payments complete without verifying amount and recipient
- Not handling network congestion gracefully (premature timeout)
- Ignoring double-payment scenarios
`,
  blocks: [
    {
      type: "terminal",
      id: "solanapay-v2-l7-errors",
      title: "Error Handling Scenarios",
      steps: [
        {
          cmd: "RPC failure during polling",
          output: "Retry 1 (500ms): timeout | Retry 2 (1s): timeout | Retry 3 (2s): success — reference found",
          note: "Exponential backoff recovers from transient failures",
        },
        {
          cmd: "Transaction mismatch detected",
          output: "WARN: Expected 10 USDC, found 5 USDC in sig abc1...xyz9\nStatus: MISMATCH — manual review required",
          note: "Never auto-complete mismatched payments",
        },
        {
          cmd: "Double payment on same reference",
          output: "TX1: sig aaa...111 (processed) | TX2: sig bbb...222 (DUPLICATE — flagged)\nOnly first valid transaction fulfills the order",
          note: "Track processed references to prevent double fulfillment",
        },
      ],
    },
  ],
};

const lesson8: Challenge = {
  id: "solanapay-v2-pos-receipt",
  slug: "solanapay-v2-pos-receipt",
  title: "Checkpoint: Generate a POS receipt",
  type: "challenge",
  xpReward: 70,
  duration: "55 min",
  language: "typescript",
  content: `# Checkpoint: Generate a POS receipt

Build the final POS receipt generator that combines all course concepts:

- Reconstruct the Solana Pay URL from payment data (recipient, amount, spl-token, reference, label)
- Generate a deterministic receipt ID from the reference suffix and timestamp
- Determine currency type: "SPL" if splToken is present, otherwise "SOL"
- Include merchant name from the payment label
- Include the tracking status from the reference tracker
- Output must be stable JSON with deterministic key ordering

This checkpoint validates your complete understanding of Solana Pay commerce integration.`,
  starterCode: lesson8StarterCode,
  testCases: lesson8TestCases,
  hints: lesson8Hints,
  solution: lesson8SolutionCode,
};

const module1: Module = {
  id: "solanapay-v2-foundations",
  title: "Solana Pay Foundations",
  description: "Solana Pay specification, URL encoding rules, transfer request anatomy, URL building, and transfer request encoding.",
  lessons: [lesson1, lesson2, lesson3, lesson4],
};

const module2: Module = {
  id: "solanapay-v2-implementation",
  title: "Tracking & Commerce",
  description: "Reference tracking, confirmation UX, error handling, and deterministic POS receipt generation.",
  lessons: [lesson5, lesson6, lesson7, lesson8],
};

export const solanaPayCommerceCourse: Course = {
  id: "course-solana-pay-commerce",
  slug: "solana-pay-commerce",
  title: "Solana Pay Commerce",
  description:
    "Master Solana Pay: transfer request URL encoding, QR generation, reference tracking, confirmation UX, and deterministic POS receipt generation.",
  difficulty: "intermediate",
  duration: "12 hours",
  totalXP: 400,
  tags: ["solana-pay", "commerce", "payments", "qr", "solana"],
  imageUrl: "/images/courses/solana-pay-commerce.jpg",
  modules: [module1, module2],
};
