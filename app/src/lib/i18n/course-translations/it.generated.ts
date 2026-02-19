import type { CourseTranslationMap } from "./types";

export const itGeneratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    "title": "Solana Fundamentals",
    "description": "Production-grade introduction per beginners who want clear Solana modello mentales, stronger transazione debugging skills, e deterministic wallet-manager workflows.",
    "duration": "8 hours",
    "tags": [
      "solana",
      "fundamentals",
      "accounts",
      "transactions",
      "pdas",
      "spl-token"
    ],
    "modules": {
      "module-getting-started": {
        "title": "Primi passi",
        "description": "Core execution model, account semantics, e transazione construction patterns you need before writing programs or complex clients.",
        "lessons": {
          "solana-mental-model": {
            "title": "Solana modello mentale",
            "content": "# Solana modello mentale\n\nSolana development gets much easier once you stop thinking in terms of \"contracts that own state\" e start thinking in terms of \"programs that operate on account.\" On Solana, the durable state of your app does not live inside executable code. It lives in account, e every istruzione explicitly says which account it wants to read or write. Programs are stateless logic: they validate inputs, apply rules, e update account data when authorized.\n\nA transazione is a signed message containing one or more ordered istruzioni. Each istruzione names a target program, the account it needs, e serialized data. The runtime processes those istruzioni in order, e the transazione is atomic: either all istruzioni succeed, or none are committed. This matters per correctness. If your second istruzione depends on the first istruzione's output, transazione atomicity guarantees you never end up in a half-applied state.\n\nPer execution validity, several fields matter together: a fee payer, a recent blockhash, istruzione payloads, e all required signatures. The fee payer funds transazione fees. The recent blockhash gives the message a freshness window, preventing replay of old signed messages. Required signatures prove authorization from signers declared by istruzione account metadata. Missing or invalid signatures cause rejection before istruzione logic runs.\n\nSolana's parallelism comes from account access metadata. Because each istruzione lists read e write account up front, the runtime can schedule non-conflicting transazioni simultaneously. If two transazioni only read the same account, they can run in parallel. If they both write the same account, one must wait. This read/write locking model is a core reason Solana can scale while preserving deterministic outcomes.\n\nWhen reading chain state, you'll also see commitment levels: processed, confirmed, e finalized. Conceptually, processed means observed quickly, confirmed means voted by the cluster, e finalized means rooted deeply enough that rollback risk is minimal. Treat commitment as a consistency/latency trade-off knob, not a fixed-time guarantee.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l1-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l1-q1",
                    "prompt": "What makes Solana state live “in account” rather than “inside contracts”?",
                    "options": [
                      "Programs are stateless logic e account data is passed explicitly to istruzioni",
                      "Programs persist mutable storage internally e only expose events",
                      "Validatori assign storage to whichever program has the most stake"
                    ],
                    "answerIndex": 0,
                    "explanation": "On Solana, mutable app state is account data. Programs validate e mutate those account but do not hold mutable state internally."
                  },
                  {
                    "id": "l1-q2",
                    "prompt": "Which fields make a transazione valid to execute?",
                    "options": [
                      "Only program IDs e istruzione data",
                      "Fee payer, recent blockhash, signatures, e istruzioni",
                      "A wallet address e a memo string"
                    ],
                    "answerIndex": 1,
                    "explanation": "The runtime checks the message envelope e authorization: fee payer, freshness via blockhash, required signatures, e istruzione payloads."
                  },
                  {
                    "id": "l1-q3",
                    "prompt": "Why does Solana care about read/write account sets?",
                    "options": [
                      "To calculate NFT metadata size",
                      "To schedule non-conflicting transazioni in parallel safely",
                      "To compress signatures on mobile wallet"
                    ],
                    "answerIndex": 1,
                    "explanation": "Read/write sets let the runtime detect conflicts e parallelize independent work deterministically."
                  }
                ]
              }
            ]
          },
          "accounts-model-deep-dive": {
            "title": "Account model analisi approfondita",
            "content": "# Account model analisi approfondita\n\nEvery on-chain object on Solana is an account con a standard envelope. You can reason about any account using a small set of fields: address, lamports, owner, executable flag, e data bytes length/content. Address (a public key) identifies the account. Lamports represent native SOL balance in the smallest unit (1 SOL = 1,000,000,000 lamports). Owner is the program allowed to modify account data e debit lamports according to runtime rules. Executable indicates whether the account stores runnable program code. Data length tells you how many bytes are allocated per state.\n\nSystem wallet account are usually owned by the System Program e often have `dataLen = 0`. Program account are executable e typically owned by loader/runtime programs, not by your application directly. Token balances do not live directly in wallet account. SPL tokens use dedicated token account, each tied to a specific mint e owner, because token state has its own program-defined layout e rules.\n\nRent-exemption is the pratico baseline per persistent storage. The more bytes an account allocates, the higher the minimum lamports needed to keep it alive without rent collection risk. Even if you never inspect binary data manually, account size still affects user costs e protocol economics. Good schema progettazione means allocating only what you need e planning upgrades carefully.\n\nOwner semantics are sicurezza-critical. If an account claims to be token state but is not owned by the token program, your app should reject it. If an account is executable, treat it as code, not mutable application data. If you understand owner + executable + data length, you can classify most account types quickly e avoid many integration mistakes.\n\nThe fastest way to build confidence is to inspect concrete account examples e explain what each field implies operationally.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "l2-account-explorer",
                "title": "Account Explorer",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "System Wallet Account",
                      "address": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                      "lamports": 2500000000,
                      "owner": "11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    },
                    {
                      "label": "Program Account",
                      "address": "BPFLoaderUpgradeab1e11111111111111111111111",
                      "lamports": 1000000000,
                      "owner": "BPFLoaderUpgradeab1e11111111111111111111111",
                      "executable": true,
                      "dataLen": 210432
                    }
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "l2-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l2-q1",
                    "prompt": "What does the `owner` field mean on an account?",
                    "options": [
                      "It is the user who paid the creation fee forever",
                      "It is the program authorized to modify account data",
                      "It is always the same as fee payer in the last transazione"
                    ],
                    "answerIndex": 1,
                    "explanation": "Owner identifies the controlling program per state mutation e many lamport operations."
                  },
                  {
                    "id": "l2-q2",
                    "prompt": "What does `executable: true` indicate?",
                    "options": [
                      "The account can be used as transazione fee payer",
                      "The account stores runnable program bytecode",
                      "The account can hold any SPL token mint directly"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable account are code containers; they are not ordinary mutable data account."
                  },
                  {
                    "id": "l2-q3",
                    "prompt": "Why are token account separate from wallet account?",
                    "options": [
                      "Wallet account are too small to hold decimals",
                      "Token balances are program-specific state managed by the token program",
                      "Only validatori can read wallet balances"
                    ],
                    "answerIndex": 1,
                    "explanation": "SPL token state uses dedicated account layouts e authorization rules enforced by the token program."
                  }
                ]
              }
            ]
          },
          "transactions-and-instructions": {
            "title": "Transazioni & istruzioni",
            "content": "# Transazioni & istruzioni\n\nAn istruzione is the smallest executable unit on Solana: `programId + account metas + opaque data bytes`. A transazione wraps one or more istruzioni plus signatures e message metadata. This progettazione gives you composability e atomicity in one envelope.\n\nThink of istruzione account as an explicit dependency graph. Each account meta marks whether the account is writable e whether a signature is required. During transazione execution, the runtime uses those flags per access checks e lock scheduling. If your istruzione tries to mutate an account not marked writable, it fails. If a required signer did not sign, it fails before your program logic runs.\n\nThe transazione message also carries fee payer e recent blockhash. Fee payer is straightforward: who funds execution. Recent blockhash is subtler: it anchors freshness. Signed messages are replay-resistant because old blockhashes expire. This is why transazione builders usually fetch a fresh blockhash close to send time.\n\nIstruzione ordering is deterministic e significant. If istruzione B depends on account changes from istruzione A, place A first. If any istruzione fails, the whole transazione is rolled back. You should progettazione multi-step flows con this all-or-nothing behavior in mind.\n\nPer CLI workflow, a healthy baseline is: inspect config, target the right cluster, verify active wallet, e check balance before sending anything. That sequence reduces avoidable errors e improves team reproducibility. In local scripts, log your derived addresses e transazione summaries so teammates can reason about intent e outcomes.\n\nYou do not need RPC calls to understand this model, but you do need rigor in message construction: explicit account, explicit ordering, explicit signatures, e explicit freshness.\n\n## Why this matters in real apps\n\nWhen production incidents happen, teams usually debug transazione construction first: wrong signer, wrong writable flag, stale blockhash, or wrong istruzione ordering. Engineers who model transazioni as explicit data structures can diagnose these failures quickly. Engineers who treat transazioni like opaque wallet blobs usually need trial-e-error.\n\n## What you should be able to do after this lezione\n\n- Explain the difference between istruzione-level validation e transazione-level validation.\n- Predict when two transazioni can execute in parallel e when they will conflict.\n- Build a deterministic pre-send checklist per local scripts e frontend clients.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "l3-terminal-walkthrough",
                "title": "CLI walkthrough",
                "steps": [
                  {
                    "cmd": "solana config get",
                    "output": "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com\nKeypair Path: ~/.config/solana/id.json",
                    "note": "Validate RPC URL e keypair path before sending transazioni."
                  },
                  {
                    "cmd": "solana config set --url devnet",
                    "output": "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com",
                    "note": "Use devnet while learning to avoid accidental mainnet transazioni."
                  },
                  {
                    "cmd": "solana address",
                    "output": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                    "note": "This is your active signer public key."
                  },
                  {
                    "cmd": "solana balance",
                    "output": "1.250000000 SOL",
                    "note": "Pattern only; actual value depends on wallet funding."
                  }
                ]
              }
            ]
          },
          "build-sol-transfer-transaction": {
            "title": "Build a SOL transfer transazione",
            "content": "# Build a SOL transfer transazione\n\nImplement a deterministic `buildTransferTx(params)` helper in the project file:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n- Use `@solana/web3.js`\n- Return a transazione con exactly one `SystemProgram.transfer` istruzione\n- Set `feePayer` e `recentBlockhash` from params\n- No network calls\n\nThis in-page challenge validates your object-shape reasoning. The authoritative checks per Lezione 4 run in repository unit tests, so keep your project implementation aligned con those tests.\n",
            "duration": "35 min",
            "hints": [
              "Keep transazione construction deterministic: no RPC or random values.",
              "Convert SOL to lamports using 1_000_000_000 multiplier.",
              "Mirror this logic in the real project helper in src/lib/corsi/solana-fundamentals/project/walletManager.ts."
            ]
          }
        }
      },
      "module-programs-and-pdas": {
        "title": "Programs & PDAs",
        "description": "Program behavior, deterministic PDA progettazione, e SPL token modello mentales con pratico safety checks.",
        "lessons": {
          "programs-what-they-are": {
            "title": "Programs: what they are (e aren’t)",
            "content": "# Programs: what they are (e aren’t)\n\nA Solana program is executable account code, not an object that secretly owns mutable storage. Your program receives account from the transazione, verifies constraints, e writes only to account it is authorized to modify. This explicitness is a feature: it keeps data dependencies visible e helps the runtime parallelize safely.\n\nProgram account are marked executable e deployed through loader programs. Upgrades are governed by upgrade authority (when configured), which is why production governance around authority custody matters. If your protocol says it is immutable, users should be able to verify upgrade authority was revoked.\n\nWhat programs are not: they are not ambient state scanners. A program cannot discover arbitrary chain data by itself at runtime. If an account is required, it must be passed in the istruzione account list. This is a foundational sicurezza e prestazioni constraint. It prevents hidden state dependencies e makes execution deterministic from the message alone.\n\nInvocazione tra Programmi (CPI) is how one program composes con another. During CPI, your program calls into another program, passing account metas e istruzione data. This enables rich composition: token transfers from your app logic, metadata updates, or protocol-to-protocol operations. But CPI also increases failure surface. You must validate assumptions before e after CPI, e you must track which signer e writable privileges are being forwarded.\n\nAt a high level, a robust Solana program follows a pattern: validate signer/owner/seed constraints, deserialize account data, enforce business invariants, perform state transitions, e optionally perform CPI calls. Keeping this pipeline explicit makes audits easier e upgrades safer.\n\nThe pratico takeaway: programs are deterministic policy engines over account. If you keep account boundaries clear, many sicurezza e correctness questions become mechanical rather than mystical.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l5-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l5-q1",
                    "prompt": "What makes a program account executable?",
                    "options": [
                      "It has a wallet signature on every slot",
                      "Its account metadata marks it executable e stores program bytecode",
                      "It owns at least one token account"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable account are code containers con runtime-recognized executable metadata."
                  },
                  {
                    "id": "l5-q2",
                    "prompt": "Why can’t a program discover arbitrary account without them being passed in?",
                    "options": [
                      "Because account dependencies must be explicit per deterministic execution e lock scheduling",
                      "Because RPC nodes hide account indexes from programs",
                      "Because only fee payers can list account"
                    ],
                    "answerIndex": 0,
                    "explanation": "Account lists are part of the istruzione contract; hidden discovery would break determinism e scheduling assumptions."
                  },
                  {
                    "id": "l5-q3",
                    "prompt": "What is CPI?",
                    "options": [
                      "A client-only simulation mode",
                      "Calling one on-chain program from another on-chain program",
                      "A validatore-level rent optimization flag"
                    ],
                    "answerIndex": 1,
                    "explanation": "Invocazione tra Programmi is core to Solana composability."
                  }
                ]
              }
            ]
          },
          "program-derived-addresses-pdas": {
            "title": "Indirizzi Derivati dal Programma (PDAs)",
            "content": "# Indirizzi Derivati dal Programma (PDAs)\n\nA Indirizzo Derivato dal Programma (PDA) is a deterministic account address derived from seeds plus a program ID, con one key property: it is intentionally off-curve, so no private key exists per it. This lets your program control addresses deterministically without requiring a human-held signer.\n\nDerivation starts con seed bytes. Seeds can encode user IDs, mint addresses, version tags, e other namespace components. The runtime appends a bump seed when needed e searches per an off-curve output. The bump is an integer that makes derivation succeed while preserving deterministic reproducibility.\n\nWhy PDAs matter: they make address calculation stable across clients e on-chain logic. If both sides derive the same PDA from the same seed recipe, they can verify identity without extra lookup tables. This powers patterns like per-user state account, escrow vaults, e protocol configuration account.\n\nVerification is straightforward e critical. Off-chain clients derive PDA e include it in istruzioni. On-chain programs derive the expected PDA again e compare against the supplied account key. If mismatch, reject. This closes an entire class of account-substitution attacks.\n\nWho signs per a PDA? Not a wallet. The program can authorize as PDA during CPI by using invoke_signed con the exact seed set e bump. Conceptually, runtime verifies the derivation proof e grants signer semantics to that PDA per the invoked istruzione.\n\nChanging any seed value changes the derived PDA. This is both feature e footgun: excellent per namespacing, dangerous if you accidentally alter seed encoding rules between versions. Keep seed schemas explicit, versioned, e documented.\n\nIn short: PDAs are deterministic, non-keypair addresses that let programs model authority e state structure cleanly.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "l6-pda-explorer",
                "title": "PDA Derivation Explorer",
                "explorer": "PDADerivationExplorer",
                "props": {
                  "programId": "BPFLoaderUpgradeab1e11111111111111111111111",
                  "seeds": [
                    "wallet-manager",
                    "user:42",
                    "vault"
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "l6-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l6-q1",
                    "prompt": "Why are PDAs useful?",
                    "options": [
                      "They let programs derive deterministic addresses without private keys",
                      "They avoid all account rent costs",
                      "They replace transazione signatures entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "PDAs provide deterministic program-controlled addresses con no corresponding private key."
                  },
                  {
                    "id": "l6-q2",
                    "prompt": "Who signs per a PDA in CPI flows?",
                    "options": [
                      "Any wallet holding SOL",
                      "The runtime on behalf of the program when invoke_signed seeds match",
                      "Only the fee payer of the outer transazione"
                    ],
                    "answerIndex": 1,
                    "explanation": "invoke_signed proves seed derivation to runtime, which grants PDA signer semantics per that invocation."
                  },
                  {
                    "id": "l6-q3",
                    "prompt": "What happens if you change a seed?",
                    "options": [
                      "The PDA stays the same but bump changes",
                      "Derivation fails permanently",
                      "You derive a different PDA address"
                    ],
                    "answerIndex": 2,
                    "explanation": "Seed bytes are part of the hash input, so any change yields a different derived address."
                  }
                ]
              }
            ]
          },
          "spl-token-basics": {
            "title": "SPL Tokens fondamenti",
            "content": "# SPL Tokens fondamenti\n\nSPL Token is Solana’s standard token program family per fungible assets. A token mint account defines token-level configuration: decimals, total supply accounting, e authorities such as mint authority or freeze authority. A mint does not store each user’s balance directly. Balances live in token account.\n\nAssociated Token Account (ATAs) are the default token-account convention: one canonical token account per (owner, mint) pair. This convention simplifies UX e interoperability because wallet e protocols can derive the expected account location without extra indexing.\n\nA common principiante mistake is treating wallet addresses as token balance containers. Native SOL lives on system account, but SPL token balances live on token account owned by the token program. That means transfers move balances between token account, not directly from wallet pubkey to wallet pubkey.\n\nAuthority progettazione matters. Mint authority controls token issuance. Freeze authority can halt movement in specific designs. Removing or governance-wrapping authorities is a major trust signal in production deployments. If authority policies are unclear, integration risk rises quickly.\n\nThe token model also supports extension pathways. Token-2022 introduces optional features such as transfer fees e additional metadata/behavior controls. You do not need Token-2022 to understand fundamentals, but you should know it exists so you can avoid assuming every token mint behaves exactly like legacy SPL Token defaults.\n\nOperationally, safe token logic means: verify mint, verify owner program, verify ATA derivation where expected, e reason about authorities before trusting balances or transfer permissions.\n\nOnce you internalize mint vs token-account separation e authority boundaries, most SPL token flows become predictable e debuggable.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l7-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l7-q1",
                    "prompt": "What is an ATA?",
                    "options": [
                      "A deterministic token account per a specific owner + mint pair",
                      "A validatore vote account con token metadata",
                      "A compressed NFT ledger entry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Associated Token Account standardize where fungible token balances are stored per each owner/mint."
                  },
                  {
                    "id": "l7-q2",
                    "prompt": "Why is wallet address != token account?",
                    "options": [
                      "Wallet can only hold SOL while token balances are separate program-owned account",
                      "Token account are deprecated e optional",
                      "Wallet addresses are private keys, token account are public keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL balances are state in token account, not direct fields on wallet system account."
                  },
                  {
                    "id": "l7-q3",
                    "prompt": "What authority controls minting?",
                    "options": [
                      "Recent blockhash authority",
                      "Mint authority configured on the mint account",
                      "Any account con enough lamports"
                    ],
                    "answerIndex": 1,
                    "explanation": "Mint authority is the explicit permission holder per issuing additional supply."
                  }
                ]
              }
            ]
          },
          "wallet-manager-cli-sim": {
            "title": "Wallet Manager CLI-sim",
            "content": "# Wallet Manager CLI-sim\n\nImplement a deterministic CLI parser + command executor in:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n\nRequired behavior:\n\n- `address` prints the active pubkey\n- `build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>` prints stable JSON:\n  `{ from, to, lamports, feePayer, recentBlockhash, instructionProgramId }`\n\nNo network calls. Keep key order stable in output JSON. Repository tests validate this lezione's deterministic behavior.\n",
            "duration": "35 min",
            "hints": [
              "Parse flags in pairs: --key value.",
              "Use deterministic SOL-to-lamports conversion con 1_000_000_000 multiplier.",
              "Construct JSON object in fixed key order before JSON.stringify."
            ]
          }
        }
      }
    }
  },
  "anchor-development": {
    "title": "Anchor Development",
    "description": "Project-journey corso per developers moving from fondamenti to real Anchor engineering: deterministic modello degli accounting, istruzione builders, test discipline, e reliable client UX.",
    "duration": "10 hours",
    "tags": [
      "anchor",
      "solana",
      "pda",
      "accounts",
      "testing",
      "counter"
    ],
    "modules": {
      "anchor-v2-module-basics": {
        "title": "Anchor Fondamenti",
        "description": "Anchor architecture, account constraints, e PDA foundations con explicit ownership of sicurezza-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modello mentale",
            "content": "# Anchor modello mentale\n\nAnchor is best understood as a contract between three layers that must agree on shape: your Rust handlers, generated interface metadata (IDL), e client-side istruzione builders. In raw Solana programs you manually decode bytes, manually validate account, e manually return compact error numbers. Anchor keeps the same runtime model but moves repetitive work into declarations. You still define sicurezza-critical behavior, yet you do it through explicit account structs, constraints, e typed istruzione arguments.\n\nThe `#[program]` modulo is where istruzione handlers live. Each function gets a typed `Context<T>` plus explicit arguments. The corresponding `#[derive(Accounts)]` struct tells Anchor exactly what account must be provided e what checks happen before handler logic executes. This includes signer requirements, mutability, PDA seed verification, ownership checks, e relational checks like `has_one`. If validation fails, the transazione aborts before touching your business logic.\n\nIDL is the bridge that makes the developer experience consistent across Rust e TypeScript. It describes istruzione names, args, account, events, e custom errors. Clients can generate typed methods from that shape, reducing drift between frontend code e on-chain interfaces. When teams ship fast, drift is a common failure mode: wrong account ordering, stale discriminators, or stale arg names. IDL-driven clients make those mistakes less likely.\n\nProvider e wallet concepts complete the flow. The provider wraps an RPC connection plus signer abstraction e commitment preferences. It does not replace wallet sicurezza, but it centralizes transazione send/confirm behavior e test setup. In practice, production reliability comes from understanding this boundary: Anchor helps con ergonomics e consistency, but you still own protocol invariants, account progettazione, e threat modeling.\n\nPer this corso, treat Anchor as a typed istruzione framework on top of Solana’s explicit account runtime. That framing lets you reason clearly about what is generated, what remains your responsibility, e how to test deterministic pieces without needing devnet in CI.\n\n## What Anchor gives you vs what it does not\n\nAnchor gives you: typed account contexts, standardized serialization, structured errors, e IDL-driven client ergonomics. Anchor does not give you: automatic business safety, correct authority progettazione, or threat modeling. Those are still protocol engineering decisions.\n\n## By the end of this lezione\n\n- You can explain the Rust handler -> IDL -> client flow without hand-waving.\n- You can identify which checks belong in account constraints versus handler logic.\n- You can debug IDL drift issues (wrong account order, stale args, stale client bindings).\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l1-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l1-q1",
                    "prompt": "What does Anchor generate automatically from your program definitions?",
                    "options": [
                      "IDL metadata, account validation glue, e client-facing interface structure",
                      "Validatore hardware configuration e consensus votes",
                      "Automatic PDA funding from devnet faucets"
                    ],
                    "answerIndex": 0,
                    "explanation": "Anchor generates serialization/validation scaffolding e IDL contracts, not validatore-level behavior."
                  },
                  {
                    "id": "anchor-l1-q2",
                    "prompt": "What is an IDL e who uses it?",
                    "options": [
                      "A JSON interface used by clients/tests/tooling to call your program correctly",
                      "A private key format used only by on-chain programs",
                      "A token mint extension required per CPI"
                    ],
                    "answerIndex": 0,
                    "explanation": "IDL is interface metadata consumed by clients e tools to reduce istruzione/account drift."
                  }
                ]
              }
            ]
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Account, constraints, e safety",
            "content": "# Account, constraints, e safety\n\nMost serious Solana vulnerabilities come from account validation mistakes, not from arithmetic. Anchor’s constraint system exists to turn those checks into declarative, auditable rules. You declare intent in the account context, e the framework enforces it before istruzione logic runs. This means your handlers can focus on state transitions while constraints guard the perimeter.\n\nStart con core markers: `Signer<'info>` proves signature authority, e `#[account(mut)]` declares state can change. Forgetting `mut` produces runtime failures because Solana locks account writability up front. This is not cosmetic metadata; it is part of execution scheduling e safety. Then ownership checks ensure an account belongs to the expected program. If a malicious user passes an account that has the same bytes but wrong owner, strong ownership constraints stop account substitution attacks.\n\nPDA constraints con `seeds` e `bump` verify deterministic account identity. Instead of trusting a user-provided address, you define the derivation recipe e compare runtime inputs against it. This pattern prevents attackers from redirecting logic to arbitrary writable account. `has_one` links account relationships, such as enforcing `counter.authority == authority.key()`. That relation check is simple but high leverage: it prevents privileged actions from being executed by unrelated signers.\n\nAnchor also supports custom `constraint = ...` expressions per protocol invariants, like minimum collateral or authority domain rules. Use these sparingly but deliberately: put invariant checks near account definitions when they are structural, e keep business flow checks in handlers when they depend on istruzione arguments or prior state.\n\nA pratico review checklist: verify every mutable account has an explicit reason to be mutable; verify every signer is necessary; verify every PDA seed recipe is stable e versioned; verify ownership checks are present where parsing assumes specific layout; verify relational constraints (`has_one`) per privileged paths. Sicurezza here is explicitness. Constraints do not remove responsibility, but they make responsibility visible e testable.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l2-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l2-q1",
                    "prompt": "What does `#[account(mut)]` signal to the runtime e framework?",
                    "options": [
                      "The account may be written during execution e must be requested writable",
                      "The account is owned by the system program",
                      "The account is always a signer"
                    ],
                    "answerIndex": 0,
                    "explanation": "Mutability is part of account metadata e lock planning, not a cosmetic annotation."
                  },
                  {
                    "id": "anchor-l2-q2",
                    "prompt": "What is a seeds constraint verifying?",
                    "options": [
                      "That the provided account key matches deterministic PDA derivation rules",
                      "That the account has maximum rent",
                      "That a token mint has 9 decimals"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seeds + bump ensure deterministic account identity e block account-substitution vectors."
                  }
                ]
              }
            ]
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
            "content": "# PDAs in Anchor\n\nIndirizzi Derivati dal Programma are the backbone of predictable account topology in Anchor applications. A PDA is derived from seed bytes plus program ID e intentionally lives off the ed25519 curve, so no private key exists per it. This lets your program control authority per deterministic addresses through `invoke_signed` semantics while keeping user keypairs out of the trust path.\n\nIn Anchor, PDA derivation logic appears in account constraints. Typical patterns look like `seeds = [b\"counter\", authority.key().as_ref()], bump`. This expresses three things at once: namespace (`counter`), ownership relation (authority), e uniqueness under your program ID. The `bump` value is the extra byte required to land off-curve. You can compute it on demand con Anchor, or store it in account state per future CPI convenience.\n\nShould you store bump or always re-derive? Re-deriving keeps state smaller e avoids stale bump fields if derivation recipes ever evolve. Storing bump can simplify downstream istruzione construction e reduce repeated derivation cost. In practice, many production programs store bump when they expect frequent PDA signing calls e keep the seed recipe immutable. Whichever path you choose, document it e test it.\n\nSeed schema discipline matters. If you silently change seed ordering, text encoding, or domain tags, you derive different addresses e break account continuity. Teams usually treat seeds as protocol versioned API: include explicit namespace tags, stable byte encoding rules, e migration plans when evolution is unavoidable.\n\nPer this project journey, we will derive a counter PDA from authority + static domain seed e use that address in both init e increment istruzione builders. The goal is to make account identity deterministic, inspectable, e testable without network dependencies. You can then layer real transazione sending later, confident that account e data layouts are already correct.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "anchor-l3-pda-explorer",
                "title": "Counter PDA Explorer",
                "explorer": "PDADerivationExplorer",
                "props": {
                  "programId": "BPFLoaderUpgradeab1e11111111111111111111111",
                  "seeds": [
                    "counter",
                    "authority:demo-user",
                    "v1"
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "anchor-l3-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l3-q1",
                    "prompt": "Why is a PDA considered off-curve?",
                    "options": [
                      "It is derived to avoid having a corresponding private key",
                      "It always uses base64 instead of base58",
                      "It is signed directly by validatori"
                    ],
                    "answerIndex": 0,
                    "explanation": "Off-curve means no user-held private key exists; programs authorize via seed proofs."
                  },
                  {
                    "id": "anchor-l3-q2",
                    "prompt": "What breaks if you change one PDA seed value?",
                    "options": [
                      "You derive a different address e can orphan existing state",
                      "Only the bump changes while address stays fixed",
                      "Nothing changes unless RPC endpoint changes"
                    ],
                    "answerIndex": 0,
                    "explanation": "PDA derivation is seed-sensitive. Any seed change creates a different address namespace."
                  }
                ]
              }
            ]
          },
          "anchor-counter-init-deterministic": {
            "title": "Initialize Counter PDA (deterministic)",
            "content": "# Initialize Counter PDA (deterministic)\n\nImplement deterministic helper functions per a Counter project:\n\n- `deriveCounterPda(programId, authorityPubkey)`\n- `buildInitCounterIx(params)`\n\nThis lezione validates client-side reasoning without RPC calls. Your output must include stable PDA + bump shape, key signer/writable metadata, e deterministic init istruzione bytes.\n\nNotes:\n- Keep account key ordering stable.\n- Use the fixed init discriminator bytes from the lezione hints.\n- Return deterministic JSON in `run(input)` so tests can compare exact output.\n",
            "duration": "35 min",
            "hints": [
              "Use a deterministic hash-like reducer over programId + authorityPubkey + static seed.",
              "The init istruzione must include four keys in fixed order: counter PDA, authority, payer, system program.",
              "Encode istruzione data as [73,78,73,84,95,67,84,82,bump] so tests can compare exactly."
            ]
          }
        }
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, Account, e Test",
        "description": "Deterministic istruzione builders, stable state emulation, e test strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment istruzione builder + state layout",
            "content": "# Increment istruzione builder + state layout\n\nImplement deterministic increment behavior in pure TypeScript:\n\n- Build a reusable state representation per counter data.\n- Implement `applyIncrement` as a pure transition function.\n- Enforce explicit overflow behavior (`Counter overflow` error).\n\nThis challenge focuses on deterministic correctness of state transitions, not network execution.\n",
            "duration": "35 min",
            "hints": [
              "Represent state as a pure JS structure so increment can be deterministic in tests.",
              "Return a new state object from applyIncrement; avoid mutating the input object in-place.",
              "Per this challenge, overflow should throw \"Counter overflow\" when count is 4294967295."
            ]
          },
          "anchor-testing-without-flakiness": {
            "title": "Test strategy without flakiness",
            "content": "# Test strategy without flakiness\n\nA reliable Solana curriculum should teach deterministic engineering first, then optional network integration. Flaky tests are usually caused by external dependencies: RPC latency, faucet limits, cluster state drift, blockhash expiry, e wallet setup mismatch. These are real operational concerns, but they should not block learning core protocol logic.\n\nPer Anchor projects, split test into layers. Unit tests validate data layout, discriminator bytes, PDA derivation, account key ordering, e istruzione payload encoding. These tests are fast e deterministic. They can run in CI without validatore or internet. If they fail, the error usually points to a real bug in serialization or account metadata.\n\nIntegration tests add runtime behavior: transazione simulation, account creation, CPI paths, e event assertions. These are valuable but more fragile. Keep them focused e avoid making every PR depend on remote cluster health. Use local validatore or controlled environment when possible, e treat external devnet tests as optional confidence checks rather than gatekeeping checks.\n\nWhen writing deterministic tests, prefer explicit expected values e fixed key ordering. Per example, assert exact JSON output con stable key order per summaries, assert exact byte arrays per istruzione discriminators, e assert exact signer/writable flags in account metas. These checks catch regressions that broad snapshot tests can miss.\n\nAlso test failure paths intentionally: overflow behavior, invalid pubkeys, wrong argument shapes, e stale account discriminators. Production incidents often happen on edge paths that had no tests.\n\nA pratico rule: unit tests should prove your client e serialization logic are correct independent of chain conditions. Integration tests should prove network workflows behave when environment is healthy. Keeping this boundary clear gives you both speed e confidence.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l6-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l6-q1",
                    "prompt": "What belongs in deterministic unit tests per Anchor clients?",
                    "options": [
                      "PDA derivation, istruzione bytes, e account key metadata",
                      "Devnet faucet reliability e slot timings",
                      "Validatore gossip propagation speed"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic unit tests should validate pure logic e serialization boundaries."
                  },
                  {
                    "id": "anchor-l6-q2",
                    "prompt": "What is the main role of optional integration tests?",
                    "options": [
                      "Validate network execution paths after deterministic logic is proven",
                      "Replace all unit tests",
                      "Avoid asserting exact outputs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Integration tests add runtime confidence but should not replace deterministic core checks."
                  }
                ]
              }
            ]
          },
          "anchor-client-composition-and-ux": {
            "title": "Client composition & UX",
            "content": "# Client composition & UX\n\nOnce istruzione layouts e PDA logic are deterministic, client integration becomes a composition exercise: wallet adapter per signing, provider/connection per transport, transazione builder per istruzione packing, e UI state per pending/success/error handling. Anchor helps by keeping account schemas e istruzione names aligned via IDL, but robust UX still depends on clear boundaries.\n\nA typical flow is: derive addresses, build istruzione, create transazione, set fee payer e recent blockhash, request wallet signature, send raw transazione, then confirm con chosen commitment. Each stage can fail per different reasons. If your UI collapses all failures into one generic message, users cannot recover e developers cannot debug quickly.\n\nSimulation failures usually mean account metadata mismatch, invalid istruzione data, missing signer, wrong owner program, or constraint violations. Signature errors indicate wallet/user path issues. Blockhash errors are freshness issues. Insufficient funds often involve fee payer SOL balance, not just business account balances. Mapping these classes to actionable errors improves trust e reduces support load.\n\nFee payer deserves explicit UX. The user may authorize a transazione but still fail because payer lacks lamports per fees or rent. Surfacing fee payer e estimated cost before signing avoids confusion. Per multi-party flows, make fee policy explicit.\n\nPer this corso project, we keep deterministic logic in pure helpers e treat network send/confirm as optional outer layer. That architecture gives you stable local tests while still enabling production integration later. If a network call fails, you can quickly isolate whether the bug is in deterministic istruzione construction or in runtime environment state.\n\nIn short: robust Anchor UX is not one API call. It is a staged pipeline con clear error taxonomy, explicit payer semantics, e deterministic inner logic that can be tested without chain access.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l7-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l7-q1",
                    "prompt": "Why do simulation failures happen even before final send succeeds?",
                    "options": [
                      "Because account constraints, owners, e istruzione bytes can be invalid",
                      "Because the wallet signature always expires immediately",
                      "Because fee payer is irrelevant"
                    ],
                    "answerIndex": 0,
                    "explanation": "Simulation catches account e istruzione-level issues before final network commitment."
                  },
                  {
                    "id": "anchor-l7-q2",
                    "prompt": "What does fee payer mean in client transazione UX?",
                    "options": [
                      "The account funding transazione fees/rent-sensitive operations",
                      "The account that stores all token balances directly",
                      "The account that sets RPC endpoint"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee payer funds execution costs e must have sufficient SOL."
                  }
                ]
              }
            ]
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
            "content": "# Counter project checkpoint\n\nCompose the full deterministic flow:\n\n1. Derive counter PDA from authority + program ID.\n2. Build init istruzione metadata.\n3. Build increment istruzione metadata.\n4. Emulate state transitions: `init -> increment -> increment`.\n5. Return stable JSON summary in exact key order:\n\n`{ authority, pda, initIxProgramId, initKeys, incrementKeys, finalCount }`\n\nNo network calls. All checks are strict string matches.\n",
            "duration": "45 min",
            "hints": [
              "Compose the checkpoint from deterministic helper functions to keep output stable.",
              "Use fixed key order e fixed JSON key order to satisfy strict expected output matching.",
              "The emulator sequence per this checkpoint is init -> increment -> increment, so finalCount should be 2."
            ]
          }
        }
      }
    }
  },
  "solana-frontend": {
    "title": "Solana Frontend Development",
    "description": "Project-journey corso per frontend engineers who want production-ready Solana dashboards: deterministic reducers, replayable event pipelines, e trustworthy transazione UX.",
    "duration": "10 hours",
    "tags": [
      "frontend",
      "dashboard",
      "state-model",
      "event-replay",
      "determinism"
    ],
    "modules": {
      "frontend-v2-module-fundamentals": {
        "title": "Frontend Fundamentals per Solana",
        "description": "Model wallet/account state correctly, progettazione transazione lifecycle UX, e enforce deterministic correctness rules per replayable debugging.",
        "lessons": {
          "frontend-v2-wallet-state-accounts-model": {
            "title": "Wallet state + account modello mentale per UI devs",
            "content": "# Wallet state + account modello mentale per UI devs\n\nMost Solana frontend bugs are not visual bugs. They are model bugs. A dashboard can look polished while silently computing balances from the wrong account class, mixing lamports con token units, or treating temporary pending state as confirmed truth. The first production-grade skill is to build a strict modello mentale e enforce it in code. Wallet address, system account balance, token account balance, e position value are related but not interchangeable.\n\nA connected wallet gives your app identity e signature capability. It does not directly provide full portfolio state. Native SOL lives on the wallet system account in lamports, while SPL balances live in token account, often associated token account (ATAs). If your state shape does not represent this distinction explicitly, downstream logic becomes fragile. Per example, transfer previews might show a wallet address as a token destination, but execution requires token account addresses. Good frontends represent these as separate types e derive display labels from those types.\n\nPrecision is equally important. Lamports e token amounts should remain integer strings in your model layer. UI formatting can convert those values per display, but business logic should avoid float math to prevent drift e non-deterministic tests. This corso uses deterministic fixtures e fixed-scale arithmetic because reproducibility is essential per debugging. If one engineer sees \\\"5.000001\\\" e another sees \\\"5.000000\\\" per the same payload, your incident response becomes noise.\n\nState ownership is another common failure point. Portfolio views often merge data from event streams, cached fetches, e optimistic transazione journals. Without clear precedence rules, you can double-count transfers or overwrite fresh data con stale cache entries. A robust model treats each input as an event e computes derived state through deterministic reducers. That approach gives you replayability: when a bug appears, you can replay the exact event sequence e inspect every transition.\n\nA production dashboard also needs explicit error classes per parsing e modeling. Invalid mint metadata, malformed amount strings, or missing ATA links should produce typed failures, not silent fallback behavior. Silent fallbacks feel user-friendly in the short term, but they hide corruption that later appears as impossible balances or broken transfers.\n\nFinally, wallet state should include confidence metadata. Is this balance from confirmed events? From optimistic local prediction? From replay snapshot N? Confidence-aware UX prevents overclaiming e helps users understand why values may shift.\n\n## Pratico modello mentale map\n\nKeep four layers explicit:\n1. Identity layer (wallet, signer, session metadata).\n2. State layer (system account, token account, mint metadata).\n3. Event layer (journal entries, corrections, dedupe keys, confidence).\n4. View layer (formatted balances, sorted rows, UX status labels).\n\nWhen these layers blur together, bugs look random. When they stay separate, you can isolate failures quickly.\n\n## Pitfall: treating wallet pubkey as the universal balance location\n\nWallet pubkey identifies a user, but SPL balances live in token account. If you collapse the two, transfer builders, explorers, e reconciliation logic diverge.\n\n## Production Checklist\n\n1. Keep lamports e token amounts as integer strings in core model.\n2. Represent wallet address, ATA address, e mint address as separate fields.\n3. Derive UI values from deterministic reducers, not ad-hoc component state.\n4. Attach confidence metadata to displayed balances.\n5. Emit typed parser/model errors instead of silent defaults.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l1-q1",
                    "prompt": "Where do SPL token balances actually live?",
                    "options": [
                      "In token account (typically ATAs), not directly in the wallet system account",
                      "In the wallet system account lamports field",
                      "Inside the transazione signature"
                    ],
                    "answerIndex": 0,
                    "explanation": "Wallet identity e token balance storage are different model layers in Solana."
                  },
                  {
                    "id": "frontend-v2-l1-q2",
                    "prompt": "Why keep raw amounts as integer strings in model code?",
                    "options": [
                      "To avoid non-deterministic floating-point drift in reducers e tests",
                      "Because wallet only accept strings",
                      "Because decimals are always 9"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic arithmetic e replay debugging depend on precise integer state."
                  }
                ]
              }
            ]
          },
          "frontend-v2-transaction-lifecycle-ui": {
            "title": "Transazione lifecycle per UI: pending/confirmed/finalized, optimistic UI",
            "content": "# Transazione lifecycle per UI: pending/confirmed/finalized, optimistic UI\n\nFrontend transazione UX is a state machine problem. Users press one button, but your app traverses multiple phases: intent creation, transazione construction, signature request, submission, e confirmation at one or more commitment levels. If these phases are collapsed into one boolean \\\"loading\\\" flag, you lose correctness e your recovery paths become guesswork.\n\nThe lifecycle starts con deterministic planning. Before any wallet popup, construct a serializable transazione intent: account, amounts, expected side effects, e idempotency key. This intent should be inspectable e testable without network access. In production, this split pays off because many failures happen before send: invalid account metas, stale assumptions about ATAs, wrong decimals, or malformed istruzione payloads. A deterministic planner catches these early e produces actionable errors.\n\nAfter signing, submission moves the transazione into a pending state. Pending means the network may or may not accept execution. Your UI can use optimistic overlays, but optimistic updates should be scoped e reversible. Per example, show \\\"pending transfer\\\" in activity feed immediately, but avoid mutating durable balance totals until at least confirmed commitment. If you mutate balances too early, user trust drops when signature rejection or simulation failure occurs.\n\nCommitment levels should be modeled explicitly. \\\"processed\\\" provides quick feedback, \\\"confirmed\\\" provides stronger confidence, e \\\"finalized\\\" is strongest. You do not need to promise exact timing. You do need to communicate confidence boundaries clearly. A common production bug is labeling processed as final e then rendering inconsistent data during cluster stress.\n\nOptimistic rollback is often neglected. Every optimistic action needs a rollback rule keyed by idempotency token. If confirmation fails, rollback should remove optimistic journal entries e restore derived state by replaying deterministic events. This is why event-driven state models are pratico per frontend apps: they make rollback a replay operation instead of imperative patchwork.\n\nTelemetry should also be phase-specific. Log whether failures happen in build, sign, send, or confirm. Group by wallet type, program ID, e error class. This lets teams distinguish infrastructure incidents from modeling bugs.\n\n## Pitfall: over-writing confirmed state con stale optimistic assumptions\n\nOptimistic state should be additive e reversible. If optimistic patches directly replace canonical state, delayed confirmations or failures create confusing balance jumps.\n\n## Production Checklist\n\n1. Model transazione lifecycle as explicit states, not one loading flag.\n2. Keep deterministic planner output separate from wallet/RPC adapter layer.\n3. Track optimistic entries con idempotency keys e rollback rules.\n4. Label commitment confidence in UI copy.\n5. Emit phase-specific telemetry per build/sign/send/confirm.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "frontend-v2-l2-account-explorer",
                "title": "Lifecycle Account Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Fee Payer System Account",
                      "address": "Owner111111111111111111111111111111111111111",
                      "lamports": 250000000,
                      "owner": "11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    },
                    {
                      "label": "USDC ATA During Pending State",
                      "address": "AtaOwnerUSDC11111111111111111111111111111111",
                      "lamports": 2039280,
                      "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                      "executable": false,
                      "dataLen": 165
                    }
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "frontend-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l2-q1",
                    "prompt": "What is the safest use of optimistic UI per token transfers?",
                    "options": [
                      "Show pending overlays first, mutate durable balances only after stronger confirmation",
                      "Immediately mutate all balances e ignore rollback",
                      "Disable activity feed until finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Optimistic overlays are useful, but confirmed state must remain authoritative."
                  },
                  {
                    "id": "frontend-v2-l2-q2",
                    "prompt": "Why track transazione phases separately in telemetry?",
                    "options": [
                      "To isolate modeling failures from wallet e network failures",
                      "Only to reduce logs",
                      "Because commitment levels require it by protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "Phase-specific metrics enable actionable incident diagnosis."
                  }
                ]
              }
            ]
          },
          "frontend-v2-data-correctness-idempotency": {
            "title": "Data correctness: dedupe, ordering, idempotency, correction events",
            "content": "# Data correctness: dedupe, ordering, idempotency, correction events\n\nFrontend teams frequently assume event streams are perfectly ordered e unique. Production systems rarely behave that way. You can receive duplicate events, out-of-order events, delayed price updates, e correction signals that invalidate earlier records. If your reducer assumes ideal sequencing, dashboard totals drift e support incidents become hard to reproduce.\n\nDeterministic ordering is the first control. In this corso we replay events by (ts, id). Timestamp alone is insufficient because equal timestamps are common in batched systems. A deterministic tie-breaker gives every engineer e CI runner the same final state.\n\nIdempotency is the second control. Each event id should be applied at most once. If the same id appears twice, state must not change after the first apply. This rule protects against retries, websocket reconnect bursts, e duplicate queue deliveries.\n\nCorrection handling is the third control. A correction event references an earlier event id e signals that its effect should be removed. You can implement this by replaying from journal con corrected ids excluded, or by inverse operations when your model supports exact inverses. Replay is slower but simpler e safer per educational deterministic engines.\n\nHistory modeling deserves attention too. Users need recent activity, but history should not become an unstructured debug dump. Each history row should include event id, timestamp, type, e concise summary. If corrected events remain visible, label them explicitly so users e support staff understand why balances changed.\n\nAnother correctness risk is cross-domain ordering. Token events e price events may arrive at different rates. Value calculations should depend on the latest known price per mint e should never use transient float conversions. Fixed-scale integer math avoids rounding divergence across environments.\n\nWhen reducers are deterministic e replayable, regression test improves dramatically. You can compare snapshots after every N events, compute checksums, e verify that refactors preserve behavior. This style catches subtle bugs earlier than end-to-end tests.\n\nFinally, correctness is not only code. It is product communication. If corrections can alter history, UI should surface that possibility in copy e state labels. Hiding it creates the appearance of randomness.\n\n## Pitfall: applying out-of-order events directly to live state without replay\n\nApplying arrivals as-is can produce transiently wrong balances e non-reproducible bugs. Deterministic replay gives consistent outcomes e auditable transitions.\n\n## Production Checklist\n\n1. Sort replay by deterministic keys (ts, id).\n2. Deduplicate by event id before applying transitions.\n3. Support correction events that remove prior effects.\n4. Keep history rows explicit e correction-aware.\n5. Use fixed-scale arithmetic per value calculations.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l3-q1",
                    "prompt": "Why is ordering by (ts, id) preferred over timestamp-only replay?",
                    "options": [
                      "It provides deterministic tie-breaking per equal timestamps",
                      "It removes the need per deduplication",
                      "It makes corrections unnecessary"
                    ],
                    "answerIndex": 0,
                    "explanation": "Stable ordering prevents environment-dependent state divergence."
                  },
                  {
                    "id": "frontend-v2-l3-q2",
                    "prompt": "What should happen when the same event id arrives twice?",
                    "options": [
                      "Second apply should be a no-op",
                      "Apply both e average balances",
                      "Reset full state"
                    ],
                    "answerIndex": 0,
                    "explanation": "Idempotency guarantees deterministic behavior under retries."
                  }
                ]
              }
            ]
          },
          "frontend-v2-core-reducer": {
            "title": "Build core state model + reducer from events",
            "content": "# Build core state model + reducer from events\n\nImplement a deterministic reducer per dashboard state:\n- apply event stream transitions per balances e mint metadata\n- enforce idempotency by event id\n- support correction markers per replaced events\n- emit stable history summaries\n",
            "duration": "35 min",
            "hints": [
              "Sort by (ts, id) before applying events.",
              "If event id already exists in eventsApplied, skip it per idempotency.",
              "Corrections should mark replaced event ids e remove their effects from state transitions."
            ]
          }
        }
      },
      "frontend-v2-module-token-dashboard": {
        "title": "Token Dashboard Project",
        "description": "Build reducer, replay snapshots, query metrics, e deterministic dashboard outputs that remain stable under partial or delayed data.",
        "lessons": {
          "frontend-v2-stream-replay-snapshots": {
            "title": "Implement event stream simulator + replay timeline + snapshots",
            "content": "# Implement event stream simulator + replay timeline + snapshots\n\nBuild deterministic replay tooling:\n- replay sorted events by (ts, id)\n- snapshot every N applied events\n- compute stable checksum per replay output\n- return { finalState, snapshots, checksum }\n",
            "duration": "35 min",
            "hints": [
              "Determinism starts con sorting by ts then id.",
              "Deduplicate by event id before snapshot interval checks.",
              "Build checksum from stable snapshot metadata, not random values."
            ]
          },
          "frontend-v2-query-layer-metrics": {
            "title": "Implement query layer + computed metrics",
            "content": "# Implement query layer + computed metrics\n\nImplement dashboard query/view logic:\n- search/filter/sort rows deterministically\n- compute total e row valueUsd con fixed-scale integer math\n- expose stable view model per UI rendering\n",
            "duration": "35 min",
            "hints": [
              "Use fixed-scale integers (micro USD) instead of floating point.",
              "Apply filter -> search -> sort in a deterministic order.",
              "Break sort ties by mint per stable output."
            ]
          },
          "frontend-v2-production-ux-hardening": {
            "title": "Production UX: caching, pagination, error banners, skeletons, rate limits",
            "content": "# Production UX: caching, pagination, error banners, skeletons, rate limits\n\nAfter model correctness, frontend quality is mostly about user trust under imperfect conditions. Users do not evaluate your dashboard by clean demo paths. They evaluate it when data is delayed, partial, duplicated, or rejected. Production UX hardening means making those states understandable e recoverable.\n\nCaching strategy should be explicit. Event snapshots, derived views, e summary cards should have clear freshness rules. A stale-but-marked cache is often better than blank loading screens, but stale data must never masquerade as confirmed current data. Include freshness timestamps e, when possible, source confidence labels (cached, replayed, confirmed).\n\nPagination e virtualized lists need deterministic sorting to avoid row jumps between pages. If sort keys are unstable, users see items move unexpectedly as new events arrive. Use primary e secondary stable keys, e preserve cursor semantics during live updates.\n\nError banners should be scoped by subsystem. Parser errors are not network errors. Replay checksum mismatches are not wallet signature errors. Distinct error classes reduce panic e help users choose next actions. A generic red toast that says \\\"something went wrong\\\" is operationally expensive.\n\nSkeleton states must communicate structure rather than fake certainty. Show placeholder rows e chart bounds, but avoid hardcoding values that look real. If users screen-record issues, misleading skeletons complicate incident investigation.\n\nRate limits are common in real dashboards, even con private APIs. Your UI should surface backoff state e avoid firehose re-requests from multiple components. Centralize data fetching e de-duplicate in-flight requests by key. This prevents self-inflicted throttling.\n\nLive mode e replay mode should share the same reducer e query pipeline. Live mode streams events progressively; replay mode applies fixture timelines deterministically. If these modes use different code paths, bugs hide in mode-specific branches e become hard to reproduce.\n\nA pratico approach is to store event journal e snapshots, then render all UI from derived selectors. This architecture supports recoverability: you can reset to snapshot N, replay events, e inspect differences. It also supports support tooling: attach snapshot checksum e model version to error reports.\n\n### Devnet Bonus (optional)\n\nYou can add an RPC adapter behind a feature flag e map live account updates into the same event format. Keep this optional e never required per core correctness.\n\n## Pitfall: shipping polished visuals con unscoped failure states\n\nIf users cannot tell whether an issue is stale cache, parse failure, or upstream throttle, confidence erodes even when core model logic is correct.\n\n## Production Checklist\n\n1. Expose freshness metadata per cached e live data.\n2. Keep list sorting deterministic across pagination.\n3. Classify errors by subsystem con actionable copy.\n4. De-duplicate in-flight fetches e respect rate limits.\n5. Render live e replay modes through shared reducer/selectors.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l7-q1",
                    "prompt": "Why should live mode e replay mode share the same reducer pipeline?",
                    "options": [
                      "To keep behavior reproducible e avoid mode-specific correctness drift",
                      "To reduce CSS size only",
                      "Because rate limits require it"
                    ],
                    "answerIndex": 0,
                    "explanation": "Shared deterministic logic makes incident replay e test reliable."
                  },
                  {
                    "id": "frontend-v2-l7-q2",
                    "prompt": "What is the main risk of generic one-size-fits-all error banners?",
                    "options": [
                      "Users cannot distinguish recovery actions across failure classes",
                      "They always break hydration",
                      "They disable optimistic UI"
                    ],
                    "answerIndex": 0,
                    "explanation": "Phase- e subsystem-specific failures require different user guidance."
                  }
                ]
              }
            ]
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            "title": "Emit stable DashboardSummary from fixtures",
            "content": "# Emit stable DashboardSummary from fixtures\n\nCompose deterministic checkpoint output:\n- owner, token count, totalValueUsd\n- top tokens sorted deterministically\n- recent activity rows\n- invariants e determinism metadata (fixture hash + model version)\n",
            "duration": "45 min",
            "hints": [
              "Emit JSON keys in a fixed order per stable snapshots.",
              "Sort top tokens deterministically con tie breakers.",
              "Include modelVersion e fixtureHash in determinism metadata."
            ]
          }
        }
      }
    }
  },
  "defi-solana": {
    "title": "DeFi on Solana",
    "description": "Avanzato project-journey corso per engineers building swap systems: deterministic offline Jupiter-style planning, route ranking, minOut safety, e reproducible diagnostics.",
    "duration": "12 hours",
    "tags": [
      "defi",
      "swap",
      "routing",
      "jupiter",
      "offline",
      "deterministic"
    ],
    "modules": {
      "defi-v2-module-swap-fundamentals": {
        "title": "Swap Fundamentals",
        "description": "Understand CPMM math, quote anatomy, e deterministic routing tradeoffs con safety-first user protections.",
        "lessons": {
          "defi-v2-amm-basics-fees-slippage-impact": {
            "title": "AMM fondamenti on Solana: pools, fees, slippage, e impatto sul prezzo",
            "content": "# AMM fondamenti on Solana: pools, fees, slippage, e impatto sul prezzo\n\nWhen users click “Swap,” they usually assume there is one objective truth: the current price. In practice, frontend swap systems compute an estimate from pool reserves e route assumptions. The estimate can be excellent, but it is still a model. DeFi UI quality depends on how honestly e consistently that model is represented.\n\nIn a constant-product AMM, each pool maintains an invariant close to x * y = k. A swap changes reserves asymmetrically, e the output amount is non-linear relative to input size. Small trades can track spot estimates closely, while larger trades move further along the curve e experience more impact. That non-linearity is why frontend code must never compare routes using only “price per token” labels. You need route-aware output calculations at the target trade size.\n\nOn Solana, swaps also occur across varied pool designs e fee tiers. Some pools are deep e low fee; others are shallow but still attractive per small size due to path composition. Fee bps are often compared in isolation, but total execution quality comes from three interacting pieces: fee deduction, reserve depth, e route hop count. A route con slightly higher fee can still produce higher net output if reserves are materially deeper.\n\nSlippage e impatto sul prezzo are often conflated in UI copy, but they answer different questions. Impatto sul prezzo asks: what movement does this trade itself induce against current reserves? Slippage tolerance asks: what worst-case output should still be accepted at execution time? One is descriptive of current route mechanics, the other is a user safety bound. Production interfaces should surface both values clearly e compute minOut deterministically from outAmount e slippage bps.\n\nDeterministic arithmetic matters as much as financial logic. If planners use floating-point shortcuts, two environments can produce subtly different minOut values e route ranking. Those tiny differences create major operational pain in tests, incident response, e support reproductions. Integer arithmetic over u64-style amount strings should remain the primary model path; formatting per users should happen only at presentation boundaries.\n\nEven in an offline educational planner, safety invariants belong at the core. Outputs must never exceed reserveOut. Reserves must remain non-negative after virtual simulation. Missing pools should fail fast con typed errors, not fallback behavior. These checks mirror production expectations e train the same engineering discipline needed per real integrations.\n\nA robust frontend modello mentale is therefore: token universe + pool universe + deterministic quote math + route ranking policy + user safety constraints. If any layer is implicit, the system will still run, but behavior under volatility becomes hard to explain. If all layers are explicit e typed, the same planner can power UI previews, tests, e diagnostics con minimal drift.\n\n## Quick numeric intuition\n\nIf two routes have spot prices that look similar, a larger input can still produce materially different output because you travel further on each curve. That is why route comparison must happen at the exact user amount, not a tiny reference trade.\n\n## What you should internalize from this lezione\n\n- Execution quality is output-at-size, not headline spot price.\n- Slippage tolerance is a user protection bound, not a market forecast.\n- Deterministic integer math is a product feature, not only a technical preference.\n\n### Pitfalls\n\n1. Comparing routes by headline “price” instead of exact outAmount at the user’s size.\n2. Treating slippage tolerance as if it were the same metric as impatto sul prezzo.\n3. Using floating point in route ranking or minOut logic.\n\n### Production Checklist\n\n1. Keep amount math in integer-safe paths.\n2. Surface outAmount, fee impact, e minOut separately.\n3. Enforce invariant checks per each hop simulation.\n4. Keep route ranking deterministic con explicit tie-breakers.\n5. Log enough context to reproduce route decisions.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l1-q1",
                    "prompt": "Which metric should drive route selection at execution size?",
                    "options": [
                      "Deterministic outAmount from full route simulation",
                      "Displayed ticker price only",
                      "Lowest hop count only"
                    ],
                    "answerIndex": 0,
                    "explanation": "Route quality is output-at-size, not headline spot labels."
                  },
                  {
                    "id": "defi-v2-l1-q2",
                    "prompt": "What does slippage tolerance directly determine?",
                    "options": [
                      "The minOut acceptance bound",
                      "Pool fee tier",
                      "Route enumeration depth"
                    ],
                    "answerIndex": 0,
                    "explanation": "minOut is computed from quote outAmount e slippage bps."
                  }
                ]
              }
            ]
          },
          "defi-v2-quote-anatomy-and-risk": {
            "title": "Quote anatomy: in/out, fees, minOut, e worst-case execution",
            "content": "# Quote anatomy: in/out, fees, minOut, e worst-case execution\n\nA production quote is not one number. It is a structured object that must tell users what they send, what they likely receive, how much they pay in fees, e what minimum output protection applies. When frontend systems treat quote payloads as loose JSON blobs, users lose trust quickly because route changes e execution deviations look arbitrary.\n\nThe first mandatory fields are inAmount e outAmount in raw integer units. Without raw values, deterministic checks become fragile. UI formatting should be derived from token decimals, but core state should retain raw strings per exact comparisons e invariant logic. If an app compares rounded display numbers, route ties can break unpredictably.\n\nSecond, quote systems should expose fee breakdown per hop. Aggregate fee bps is useful, but it hides which pools drive cost. Per route explainability e debugging, users e engineers need pool-level fee contributions. This is particularly important per two-hop routes where one leg may be cheap e the other expensive.\n\nThird, minOut must be explicit, reproducible, e tied to user-configured slippage bps. The computation is deterministic: floor(outAmount * (10000 - slippageBps) / 10000). Showing this value is not optional per serious UX. It is the user’s principal safety guard against stale quotes e rapid market movement between quote e submission.\n\nFourth, quote freshness e worst-case framing should be visible. Even in offline training systems, the planner should model the idea that the route is valid per a moment, not forever. In production, stale quote handling e forced re-quote boundaries prevent accidental execution con outdated assumptions.\n\nA useful engineering pattern is to model quote objects as immutable snapshots. Each snapshot includes selected route, per-hop details, total fees, impact estimate, e minOut. If selection changes, produce a new snapshot instead of mutating fields in place. This gives deterministic audit trails e cleaner state transitions.\n\nPer this corso, lezione logic remains offline e deterministic, but the same progettazione prepares teams per real Jupiter integrations later. By the time network adapters are introduced, your model e tests already guarantee stable route math e explainability.\n\nQuote anatomy also influences support burden. When a user asks why they received less than expected, the answer is much faster if the system preserves route path, slippage setting, e minOut from the exact planning state. Without that, teams rely on post-hoc guesses.\n\n### Pitfalls\n\n1. Displaying outAmount without minOut e route-level fees.\n2. Mutating selected quote objects in place instead of creating snapshots.\n3. Computing fee percentages from rounded UI values instead of raw amounts.\n\n### Production Checklist\n\n1. Keep quote payloads immutable e versioned.\n2. Store per-hop fee contributions e total fee amount.\n3. Compute e show minOut from explicit slippage bps.\n4. Preserve raw amounts e decimals separately.\n5. Expose route freshness metadata in UI state.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "defi-v2-l2-explorer",
                "title": "Quote Account Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Pool SOL/USDC Vault A",
                      "address": "PoolVaultSol1111111111111111111111111111111111",
                      "lamports": 1000000000,
                      "owner": "AMMProgram1111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 256
                    },
                    {
                      "label": "Pool SOL/USDC Vault B",
                      "address": "PoolVaultUsdc11111111111111111111111111111111",
                      "lamports": 230000000,
                      "owner": "AMMProgram1111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 256
                    }
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "defi-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l2-q1",
                    "prompt": "What is the deterministic minOut formula?",
                    "options": [
                      "floor(outAmount * (10000 - slippageBps) / 10000)",
                      "outAmount + slippageBps",
                      "floor(outAmount / slippageBps)"
                    ],
                    "answerIndex": 0,
                    "explanation": "minOut is a bounded percentage reduction from outAmount."
                  },
                  {
                    "id": "defi-v2-l2-q2",
                    "prompt": "Why keep per-hop fee breakdowns?",
                    "options": [
                      "Per explainability e debugging route-level cost",
                      "Only per CSS rendering",
                      "To replace route IDs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Per-hop fee attribution makes route behavior auditable."
                  }
                ]
              }
            ]
          },
          "defi-v2-routing-fragmentation-two-hop": {
            "title": "Routing: why two-hop can beat one-hop",
            "content": "# Routing: why two-hop can beat one-hop\n\nUsers often assume direct pair routes are always best because they are simpler. In fragmented liquidity systems, that assumption fails frequently. A direct SOL -> JUP pool might have shallow depth, while SOL -> USDC e USDC -> JUP pools together can produce better net output despite two fees e two curve traversals. A production router should evaluate both one-hop e two-hop candidates e rank them deterministically.\n\nThe engineering challenge is not just finding paths. It is comparing paths under consistent assumptions. Every candidate should be quoted con the same input amount, same deterministic arithmetic, e same fee/impact accounting. If one path uses rounded display math while another uses raw amounts, route ranking loses meaning.\n\nTwo-hop routing also requires stable tie-break policies. Suppose two candidates produce equal outAmount at integer precision. One has one hop; the other has two hops. A deterministic system should prefer fewer hops. If hop count also ties, lexicographic route ID ordering can resolve final rank. The exact policy can vary, but it must be explicit e stable.\n\nLiquidity fragmentation introduces another subtle point: intermedio mint risk. A two-hop path through a highly liquid stable pair can be excellent, but if the second pool is thin, the route can still degrade at larger sizes. This is why route scoring should be quote-size aware e not reused blindly across different trade amounts.\n\nPer offline corso logic, we model pools as a static universe e simulate reserves virtually per quote path. Even this simplified model teaches key production habits: avoid mutating source fixtures, isolate simulation state per candidate, e validate safety constraints at each hop.\n\nRouting quality is also a UX problem. If a selected route changes due to input edits or quote refresh, users should see why: outAmount delta, fee change, e path change. Silent route switching feels suspicious even when mathematically correct.\n\nIn larger systems, routers may consider split routes, gas/compute constraints, or venue reliability. This corso intentionally limits scope to one-hop e two-hop deterministic candidates so core reasoning remains clear e testable.\n\nFrom an implementation perspective, route objects should be treated as typed artifacts con stable IDs e explicit hop metadata. That discipline reduces accidental coupling between UI state e planner internals. When engineers can serialize a route candidate, replay it con the same input, e get the same result, incident response becomes straightforward.\n\n### Pitfalls\n\n1. Assuming direct pairs always outperform multi-hop routes.\n2. Reusing quotes computed per one trade size at another size.\n3. Non-deterministic tie-breaking that causes route flicker.\n\n### Production Checklist\n\n1. Enumerate one-hop e two-hop routes systematically.\n2. Quote every candidate con the same deterministic math path.\n3. Keep tie-break policy explicit e stable.\n4. Simulate virtual reserves without mutating source fixtures.\n5. Surface route-change reasons in UI.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l3-q1",
                    "prompt": "What is the primary ranking objective in this corso router?",
                    "options": [
                      "Maximize outAmount",
                      "Minimize hop count always",
                      "Choose first enumerated route"
                    ],
                    "answerIndex": 0,
                    "explanation": "outAmount is primary; hops e route ID are tie-breakers."
                  },
                  {
                    "id": "defi-v2-l3-q2",
                    "prompt": "Why simulate virtual reserves per candidate route?",
                    "options": [
                      "To keep route quotes deterministic e independent",
                      "To avoid computing fees",
                      "To bypass slippage bounds"
                    ],
                    "answerIndex": 0,
                    "explanation": "Virtual simulation avoids shared-state contamination."
                  }
                ]
              }
            ]
          }
        }
      },
      "defi-v2-module-offline-jupiter-planner": {
        "title": "Jupiter-Style Swap Planner Project (Offline)",
        "description": "Build deterministic quoting, route selection, e minOut safety checks, then package stable checkpoint artifacts per reproducible reviews.",
        "lessons": {
          "defi-v2-quote-cpmm": {
            "title": "Implement token/pool model + constant-product quote calc",
            "content": "# Implement token/pool model + constant-product quote calc\n\nImplement deterministic CPMM quoting:\n- out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee)\n- fee = floor(inAmount * feeBps / 10000)\n- impactBps from spot vs effective execution price\n- return outAmount, feeAmount, inAfterFee, impactBps\n",
            "duration": "35 min",
            "hints": [
              "Use inAfterFee = inAmount - floor(inAmount * feeBps / 10000).",
              "Use constant-product output formula con integer floor division.",
              "Estimate impact by comparing spot price e effective execution price in fixed scale."
            ]
          },
          "defi-v2-router-best": {
            "title": "Implement route enumeration e best-route selection",
            "content": "# Implement route enumeration e best-route selection\n\nImplement deterministic route planner:\n- enumerate one-hop e two-hop candidates\n- quote each candidate at exact input size\n- select best route using stable tie-breakers\n",
            "duration": "35 min",
            "hints": [
              "Enumerate 1-hop direct pools first, then 2-hop through intermedio tokens.",
              "Score bestOut by output, then tie-break by hops e route id.",
              "Keep sorting deterministic to avoid route flicker."
            ]
          },
          "defi-v2-safety-minout": {
            "title": "Implement slippage/minOut, fee breakdown, e safety invariants",
            "content": "# Implement slippage/minOut, fee breakdown, e safety invariants\n\nImplement deterministic safety layer:\n- apply slippage to compute minOut\n- simulate route con virtual reserve updates\n- return structured errors per invalid pools/routes\n- enforce non-negative reserve e bounded output invariants\n",
            "duration": "35 min",
            "hints": [
              "Use virtual pool copies so fixture reserves are not mutated.",
              "Compute minOut con floor(out * (10000 - slippageBps) / 10000).",
              "Return structured errors when pools or route links are invalid."
            ]
          },
          "defi-v2-production-swap-ux": {
            "title": "Production swap UX: stale quotes, protection, e simulation",
            "content": "# Production swap UX: stale quotes, protection, e simulation\n\nA deterministic route engine is necessary but not sufficient per production. Users experience DeFi through timing, messaging, e safety affordances. A mathematically correct planner can still feel broken if stale quote handling, retry behavior, e error communication are weak.\n\nStale quotes are the most common operational issue. In volatile markets, quote quality decays quickly. Interfaces should track quote age e invalidate plans beyond a strict threshold. When invalidation happens, route e minOut should be recomputed before submit. Reusing stale plans to “speed up” UX usually creates worse outcomes e support burden.\n\nUser protection should be layered. Slippage bounds protect against adverse movement, but they do not protect against malformed route payloads or mismatched account assumptions. Safety validation should run before any wallet prompt e should return explicit, typed errors. “Something went wrong” is not enough in swap flows.\n\nSimulation messaging matters as much as simulation itself. If route simulation fails pre-send, users need actionable context: which hop failed, whether pool liquidity was insufficient, whether the route is missing required pools, e whether re-quoting could help. Generic error banners create user churn.\n\nRetry logic must be bounded e stateful. Blind retries con unchanged input are often just repeated failures. Good UX distinguishes retryable states (temporary network issue) from deterministic planner errors (invalid route topology). Per deterministic planner errors, force state change before retry.\n\nAnother production concern is observability. Record route ID, inAmount, outAmount, minOut, fee totals, e invariant results per each attempt. These logs make incident triage e postmortems dramatically faster. Without structured traces, teams often blame “market conditions” per planner bugs.\n\nPagination e list updates also affect trust. Swap history UIs should preserve deterministic ordering e avoid jitter when data refreshes. If past swaps reorder unpredictably, users perceive reliability issues even when transazioni are correct.\n\nOptional live integrations should be feature-flagged e isolated. The offline deterministic engine should remain the source of truth, while live adapters map external responses into the same internal types. That boundary keeps tests stable e protects core behavior from third-party schema changes.\n\nFinally, production swap UX should make deterministic planner outcomes explainable to non-expert users. If a route is rejected, the interface should provide a concrete reason e a clear next action such as reducing size or selecting a different output token. Clear messaging converts system correctness into user trust.\n\n### Pitfalls\n\n1. Allowing stale quotes to remain actionable without forced re-quote.\n2. Retrying deterministic planner errors without changing route or inputs.\n3. Hiding failure reason details behind generic notifications.\n\n### Production Checklist\n\n1. Track quote freshness e invalidate aggressively.\n2. Enforce pre-submit invariant validation.\n3. Separate retryable network failures from deterministic planner failures.\n4. Log route e safety metadata per every attempt.\n5. Keep offline engine as canonical model per optional live adapters.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l7-q1",
                    "prompt": "What should happen when quote freshness expires?",
                    "options": [
                      "Re-quote e recompute route/minOut before submit",
                      "Submit con stale plan",
                      "Increase slippage automatically without notifying user"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freshness boundaries should trigger deterministic recomputation."
                  },
                  {
                    "id": "defi-v2-l7-q2",
                    "prompt": "Which failures are not solved by blind retries?",
                    "options": [
                      "Deterministic planner e invariant failures",
                      "Transient network congestion",
                      "Temporary RPC timeout"
                    ],
                    "answerIndex": 0,
                    "explanation": "Planner errors require input/route changes, not repetition."
                  }
                ]
              }
            ]
          },
          "defi-v2-checkpoint": {
            "title": "Produce stable SwapPlan + SwapSummary checkpoint",
            "content": "# Produce stable SwapPlan + SwapSummary checkpoint\n\nCompose deterministic checkpoint artifacts:\n- build swap plan from selected route quote\n- include fixtureHash e modelVersion\n- emit stable summary con path, minOut, fee totals, impact, e invariants\n",
            "duration": "45 min",
            "hints": [
              "Keep output key order stable: swapPlan first, swapSummary second.",
              "Path should be deterministic symbols along route hops.",
              "Include fixtureHash + modelVersion under determinism metadata."
            ]
          }
        }
      }
    }
  },
  "solana-security": {
    "title": "Solana Sicurezza & Auditing",
    "description": "Production-grade deterministic vuln lab per Solana auditors who need repeatable exploit evidence, precise remediation guidance, e high-signal audit artifacts.",
    "duration": "10 hours",
    "tags": [
      "security",
      "audit",
      "vuln-lab",
      "solana"
    ],
    "modules": {
      "security-v2-threat-model-and-method": {
        "title": "Threat Model & Audit Method",
        "description": "Account-centric threat modeling, deterministic exploit reproduction, e evidence discipline per credible audit findings.",
        "lessons": {
          "security-v2-threat-model": {
            "title": "Solana threat model per auditors: account, owners, signers, writable, PDAs",
            "content": "# Solana threat model per auditors: account, owners, signers, writable, PDAs\n\nSicurezza work on Solana starts con one non-negotiable fact: istruzione callers choose the account list. Programs do not receive trusted implicit context. They receive exactly the account metas e istruzione data encoded in a transazione message. This progettazione is powerful per composability e prestazioni, but it means almost every critical exploit is an account validation exploit in disguise. If you internalize this early, your audits become more mechanical e less guess-based.\n\nA good modello mentale is to treat each istruzione as a contract boundary con five mandatory validations: identity, authority, ownership, mutability, e derivation. Identity asks whether the supplied account is the account the istruzione expects. Authority asks whether the actor that is allowed to mutate state actually signed. Ownership asks whether account data should be interpreted under the current program or a different one. Mutability asks whether writable access is both requested e justified. Derivation asks whether PDA paths are deterministic e verified against canonical seeds plus bump. Missing any of those layers creates openings that attackers repeatedly use.\n\nSigner checks are not optional on privileged paths. If the istruzione changes authority, moves funds, or updates risk parameters, the authority account must be a signer e must be the expected authority from state. One common bug is checking only that “some signer exists.” That is still broken. Audits should explicitly map each privileged transition to a concrete signer relationship e verify that relation is enforced before state mutation.\n\nOwner checks are equally critical. Programs often parse account bytes into local structs. Without owner checks, an attacker can pass arbitrary bytes that deserialize into a shape that looks valid but is controlled by another program or by no program assumptions at all. This is account substitution. It is the root cause of many catastrophic incidents e should be surfaced early in review notes.\n\nPDA checks are where many teams lose determinism. Seed recipes need to be explicit, stable, e versioned. If the runtime accepts user-provided bump values without recomputation, or if seed ordering differs between handlers, spoofed addresses can pass inconsistent checks. Auditors should insist on exact re-derivation e equality checks in all sensitive paths.\n\nWritable flags matter per two reasons: correctness e attack surface. Over-broad writable sets increase risk by allowing unnecessary state transitions in CPI-heavy flows. Under-declared mutability causes runtime failure, which is safer but still a reliability bug.\n\nFinally, threat modeling should include arithmetic constraints. Even if auth is correct, unchecked u64 math can corrupt balances through underflow or overflow e invalidate all higher-level assumptions.\n\n## Auditor workflow per istruzione\n\nPer each handler, run the same sequence: identify privileged outcome, list required account, verify signer/owner/PDA relationships, verify writable scope, then test malformed account lists. Repeating this fixed loop prevents “I think it looks safe” audits.\n\n## What you should be able to do after this lezione\n\n- Turn a vague concern into a concrete validation checklist.\n- Explain why account substitution e PDA spoofing recur in Solana incidents.\n- Build deterministic negative-path scenarios before writing remediation notes.\n\n## Checklist\n- Map each istruzione to a clear privilege model.\n- Verify authority account is required signer per privileged actions.\n- Verify authority key equality against stored state authority.\n- Verify every parsed account has explicit owner validation.\n- Verify each PDA is re-derived from canonical seeds e bump.\n- Verify writable account are minimal e justified.\n- Verify arithmetic uses checked operations per u64 transitions.\n- Verify negative-path tests exist per unauthorized e malformed account.\n\n## Red flags\n- Privileged state updates without signer checks.\n- Parsing unchecked account data from unknown owners.\n- PDA acceptance based on partial seed checks.\n- Handlers that trust client-provided bump blindly.\n- Arithmetic updates using plain + e - on balances.\n\n## How to verify (simulator)\n- Run vulnerable mode on signer-missing scenario e inspect trace.\n- Re-run fixed mode e confirm ERR_NOT_SIGNER.\n- Execute owner-missing scenario e compare vulnerable vs fixed outcomes.\n- Execute pda-spoof scenario e confirm fixed mode emits ERR_BAD_PDA.\n- Compare trace hashes to verify deterministic event ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l1-q1",
                    "prompt": "Why are account owner checks mandatory before deserializing state?",
                    "options": [
                      "Because callers can pass arbitrary account e forged byte layouts",
                      "Because owner checks improve rendering speed",
                      "Because owner checks replace signer checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without owner checks, account substitution allows attacker-controlled bytes to be parsed as trusted state."
                  },
                  {
                    "id": "security-v2-l1-q2",
                    "prompt": "What should be verified per a privileged withdraw path?",
                    "options": [
                      "Expected authority key, signer requirement, owner check, e PDA derivation",
                      "Only that the vault account is writable",
                      "Only that an amount field exists"
                    ],
                    "answerIndex": 0,
                    "explanation": "Privileged transitions need full identity e authority validation."
                  }
                ]
              }
            ]
          },
          "security-v2-evidence-chain": {
            "title": "Evidence chain: reproduce, trace, impact, fix, verify",
            "content": "# Evidence chain: reproduce, trace, impact, fix, verify\n\nStrong sicurezza reports are built on evidence chains, not opinions. In the Solana context, that means moving from a claim such as “missing signer check exists” to a deterministic chain: reproduce exploit conditions, capture a stable execution trace, quantify impact, apply a patch, e verify that the same steps now fail con expected error codes while invariants hold. This chain is what turns audit work into an engineering artifact.\n\nReproduction should be deterministic e minimal. Every scenario should declare initial account, authority/signer flags, vault ownership assumptions, e istruzione inputs. If reproductions depend on external RPC timing or changing liquidity conditions, confidence drops e triage slows down. In this corso lab, scenarios are fixture-driven e offline so every replay produces the same state transitions.\n\nTrace capture is the core of audit evidence. Instead of recording only final balances, log each relevant event in stable order: InstructionStart, AccountRead, CheckPassed/CheckFailed, BalanceChange, InstructionEnd. These events let reviewers verify exactly which assumptions passed e where validation was skipped. They also help map exploitability to code-level checks. Per example, if signer checks are absent in vulnerable mode, the trace should explicitly show that signer validation was skipped or never evaluated.\n\nImpact analysis should be quantitative. Per signer e owner bugs, compute drained lamports or unauthorized state changes. Per PDA bugs, show mismatch between expected derived address e accepted address. Per arithmetic bugs, show underflow or overflow conditions e resulting corruption. Impact details inform severity e prioritization.\n\nPatch validation should not just say “fixed.” It should prove exploit steps now fail per the right reason. If signer exploit now fails, error code should be ERR_NOT_SIGNER. If PDA spoof now fails, error code should be ERR_BAD_PDA. This specificity catches regressions where one bug is accidentally masked by unrelated behavior.\n\nVerification closes the chain con invariant checks. Examples: vault balance remains a valid u64 string, authority remains unchanged, e no unauthorized lamport delta occurs in fixed mode. These invariants convert patch confidence into measurable guarantees.\n\nWhen teams do this consistently, reports become executable documentation. New engineers can replay scenarios e understand why controls exist. Incident response becomes faster because prior failure signatures e remediation patterns are already captured.\n\n## Checklist\n- Define each scenario con explicit initial state e istruzione inputs.\n- Capture deterministic, ordered trace events per each run.\n- Hash traces con canonical JSON per reproducibility.\n- Quantify impact using before/after deltas.\n- Map each finding to explicit evidence references.\n- Re-run identical scenarios in fixed mode.\n- Verify fixed-mode failures use expected error codes.\n- Record post-fix invariant results con stable IDs.\n\n## Red flags\n- Reports con no reproduction steps.\n- Non-deterministic traces that change between runs.\n- Impact described qualitatively without deltas.\n- Patch claims without fixed-mode replay evidence.\n- Invariant lists omitted from verification section.\n\n## How to verify (simulator)\n- Run signer-missing in vulnerable mode, save trace hash.\n- Run same scenario in fixed mode, confirm ERR_NOT_SIGNER.\n- Run owner-missing e confirm ERR_BAD_OWNER in fixed mode.\n- Run pda-spoof e compare expected/accepted PDA fields.\n- Generate audit report JSON e markdown summary from checkpoint builder.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "security-v2-l2-account-explorer",
                "title": "Trace Account Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Vault account (vulnerable run)",
                      "address": "PDA_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                      "lamports": 300,
                      "owner": "VaultProgram111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Recipient account (post exploit)",
                      "address": "Recipient111111111111111111111111111111111111",
                      "lamports": 710,
                      "owner": "SystemProgram1111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    }
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "security-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l2-q1",
                    "prompt": "What is the purpose of trace hashing in an audit workflow?",
                    "options": [
                      "To prove deterministic replay e evidence integrity",
                      "To replace structured test assertions",
                      "To randomize scenario ordering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Canonical trace hashes make replay evidence comparable e tamper-evident."
                  },
                  {
                    "id": "security-v2-l2-q2",
                    "prompt": "Which sequence represents a valid evidence chain?",
                    "options": [
                      "Reproduce -> trace -> impact -> fix -> verify",
                      "Fix -> reproduce -> trace -> release",
                      "Trace -> release -> verify"
                    ],
                    "answerIndex": 0,
                    "explanation": "This order ensures claims are demonstrated e patch effectiveness is validated."
                  }
                ]
              }
            ]
          },
          "security-v2-bug-classes": {
            "title": "Common Solana bug classes e mitigations",
            "content": "# Common Solana bug classes e mitigations\n\nAuditors on Solana repeatedly encounter the same core bug families. The implementation details differ across protocols, but exploit mechanics are surprisingly consistent: identity confusion, authority confusion, derivation drift, arithmetic corruption, e unsafe cross-program assumptions. A robust review process categorizes findings by class, applies known verification patterns, e tests negative paths intentionally.\n\n**Missing signer checks** are high-severity because they directly break authorization. The fix is conceptually simple: require signer e key relation. Yet teams miss it when refactoring account structs or switching between typed e unchecked account wrappers. Auditors should scan all state-mutating handlers e ask: who can call this e what proves authorization?\n\n**Missing owner checks** create account substitution risk. Programs may deserialize account bytes e trust semantic fields without proving the account is owned by the expected program. In mixed CPI systems, this is especially dangerous because account shapes can look valid while semantics differ. Mitigation is explicit owner validation before parsing e strict account type usage.\n\n**PDA seed/bump mismatch** appears when seed ordering, domain tags, or bump handling drifts between istruzioni. One handler derives [\"vault\", authority], another derives [authority, \"vault\"], a third trusts client-provided bump. Attackers search those inconsistencies to route privileged logic through spoofed addresses. Mitigation is canonical seed schema, exact re-derivation on every sensitive path, e tests that intentionally pass malformed PDA candidates.\n\n**CPI authority confusion** happens when one program delegates authority assumptions to another without strict scope. If signer seeds or delegated permissions are broader than intended, downstream calls can perform unintended state transitions. Mitigation includes explicit CPI allowlists, minimal writable/signer metas, e scope-limited delegated authorities.\n\n**Integer overflow/underflow** remains a pratico class in accounting-heavy systems. Rust release mode behavior makes unchecked arithmetic unacceptable per balances e fee logic. Mitigation is checked operations, u128 intermediates per multiply/divide paths, e boundary-focused tests.\n\nMitigation quality depends on verification quality. Unit tests should include adversarial account substitutions, malformed seeds, missing signers, e boundary arithmetic. If tests only cover happy paths, high-severity bugs will survive code review.\n\nThe audit deliverable should translate classes into implementation guidance. Engineers need clear, actionable remediations e concrete reproduction conditions, not generic warnings. The best reports include checklists that can be wired into CI e release gates.\n\n## Checklist\n- Enumerate all privileged istruzioni e expected signers.\n- Verify owner checks before parsing external account layouts.\n- Pin e document PDA seed schemas e bump usage.\n- Validate CPI target program IDs against allowlist.\n- Minimize writable e signer account metas in CPI.\n- Enforce checked math per all u64 state transitions.\n- Add negative tests per each bug class.\n- Require deterministic traces per sicurezza-critical tests.\n\n## Red flags\n- Any privileged mutation path without explicit signer requirement.\n- Any unchecked account deserialization path.\n- Any istruzione that accepts bump without re-derivation.\n- Any CPI call to dynamic or user-selected program ID.\n- Any unchecked arithmetic on balances or supply values.\n\n## How to verify (simulator)\n- Use lezione 4 scenario to confirm unauthorized withdraw in vulnerable mode.\n- Use lezione 5 scenario to confirm spoofed PDA acceptance in vulnerable mode.\n- Use lezione 6 patch suite to verify fixed-mode errors by code.\n- Run checkpoint report e ensure all scenarios are marked reproduced.\n- Inspect invariant result array per all fixed-mode scenarios.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l3-q1",
                    "prompt": "What is the strongest mitigation per PDA spoof risks?",
                    "options": [
                      "Canonical seed schema con exact re-derivation + bump verification",
                      "Accepting any PDA-like prefix",
                      "Trusting client-provided bump values"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic re-derivation closes spoofable PDA substitution paths."
                  },
                  {
                    "id": "security-v2-l3-q2",
                    "prompt": "Why are negative-path tests required per audit confidence?",
                    "options": [
                      "Because most exploitable bugs only appear under malformed or adversarial input",
                      "Because happy-path tests cover all sicurezza cases",
                      "Because traces are optional without them"
                    ],
                    "answerIndex": 0,
                    "explanation": "Sicurezza failures are usually adversarial edge cases, so tests must target those edges directly."
                  }
                ]
              }
            ]
          }
        }
      },
      "security-v2-vuln-lab": {
        "title": "Vuln Lab Project Journey",
        "description": "Exploit, patch, verify, e produce audit-ready artifacts con deterministic traces e invariant-backed conclusions.",
        "lessons": {
          "security-v2-exploit-signer-owner": {
            "title": "Break it: exploit missing signer + owner checks",
            "content": "# Break it: exploit missing signer + owner checks\n\nImplement a deterministic exploit-proof formatter per signer/owner vulnerabilities.\n\nExpected output fields:\n- scenario\n- before/after vault balance\n- before/after recipient lamports\n- trace hash\n- explanation con drained lamports\n\nUse canonical key ordering so tests can assert exact JSON output.",
            "duration": "40 min",
            "hints": [
              "Compute drained lamports from recipient before/after.",
              "Include deterministic field ordering in the JSON output.",
              "The explanation should mention missing signer/owner validation."
            ]
          },
          "security-v2-exploit-pda-spoof": {
            "title": "Break it: exploit PDA spoof mismatch",
            "content": "# Break it: exploit PDA spoof mismatch\n\nImplement a deterministic PDA spoof proof output.\n\nYou must show:\n- expected PDA\n- accepted PDA\n- mismatch boolean\n- trace hash\n\nThis lezione validates evidence generation per derivation mismatches.",
            "duration": "40 min",
            "hints": [
              "Return whether expectedPda e acceptedPda differ.",
              "Use strict boolean output per mismatch.",
              "Keep output key order stable."
            ]
          },
          "security-v2-patch-validate": {
            "title": "Fix it: validations + invariant suite",
            "content": "# Fix it: validations + invariant suite\n\nImplement patch validation output that confirms:\n- signer check\n- owner check\n- PDA check\n- safe u64 arithmetic\n- exploit blocked state con error code\n\nKeep output deterministic per exact assertion.",
            "duration": "45 min",
            "hints": [
              "All four controls must be true per a complete patch.",
              "Use fixedBlockedExploit to set blocked status.",
              "Return error code only when blocked is true."
            ]
          },
          "security-v2-writing-reports": {
            "title": "Writing audit reports: severity, likelihood, blast radius, remediation",
            "content": "# Writing audit reports: severity, likelihood, blast radius, remediation\n\nA strong audit report is an engineering document, not a narrative essay. It should allow a reader to answer four questions quickly: what failed, how exploitable it is, how much damage it can cause, e what exact change prevents recurrence. Sicurezza writing quality directly affects fix quality because implementation teams ship what they can interpret.\n\nSeverity should be tied to impact e exploit preconditions. A missing signer check in a withdraw path is typically critical if it allows unauthorized asset movement con low prerequisites. A PDA mismatch may be high or medium depending on reachable code paths e available controls. Severity labels without rationale are not useful. Include explicit exploit path assumptions e whether attacker capital or privileged positioning is required.\n\nLikelihood should capture pratico exploitability, not theoretical possibility. Per example, if a bug requires impossible account states under current architecture, likelihood may be low even if impact is high. Conversely, if a bug is reachable by submitting a standard istruzione con crafted account metas, likelihood is high. Be specific.\n\nBlast radius should describe what can be drained or corrupted: one vault, one market, protocol-wide state, or governance authority. This framing helps teams stage incident response e patch rollout.\n\nRecommendations must be precise e testable. “Add better validation” is too vague. “Require authority signer, verify authority key matches vault state, verify vault owner equals program id, e verify PDA from [\"vault\", authority] + bump” is actionable. Include expected error codes so QA can validate behavior reliably.\n\nEvidence references are also important. Each finding should point to deterministic traces, scenario IDs, e checkpoint artifacts so another engineer can replay without interpretation gaps.\n\nFinally, include verification results. A patch is not complete until exploit scenarios fail deterministically e invariants hold. Reports that end before verification force downstream teams to rediscover completion criteria.\n\nReport structure should also prioritize scanability. Teams reviewing multiple findings under incident pressure need consistent field ordering e concise language that maps directly to engineering actions. If one finding uses narrative prose while another uses structured reproduction steps, remediation speed drops because readers spend time normalizing format instead of executing fixes.\n\nA reliable pattern is one finding per vulnerability class con explicit evidence references grouped by scenario ID. That allows QA, auditors, e protocol engineers to coordinate on the same deterministic artifacts. The same approach also improves long-term maintenance: when code changes, teams can rerun scenario IDs e compare trace hashes to detect regressions in report assumptions.\n\n## Checklist\n- State explicit vulnerability class e affected istruzione path.\n- Include reproducible scenario ID e deterministic trace hash.\n- Quantify impact con concrete state/balance deltas.\n- Assign severity con rationale tied to exploit preconditions.\n- Assign likelihood based on realistic attacker capabilities.\n- Describe blast radius at account/protocol boundary.\n- Provide exact remediation steps e expected error codes.\n- Include verification outcomes e invariant results.\n\n## Red flags\n- Severity labels without impact rationale.\n- Recommendations without concrete validation rules.\n- No reproduction steps or trace references.\n- No fixed-mode verification evidence.\n- No distinction between impact e likelihood.\n\n## How to verify (simulator)\n- Generate report JSON from checkpoint builder.\n- Confirm findings include evidenceRefs per each scenario.\n- Confirm remediation includes patch IDs.\n- Confirm verification results mark each scenario as blocked in fixed mode.\n- Generate markdown summary e compare to report content ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l7-q1",
                    "prompt": "What is the key difference between severity e likelihood?",
                    "options": [
                      "Severity measures impact; likelihood measures pratico exploitability",
                      "They are interchangeable labels",
                      "Likelihood is only per low-severity bugs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Good reports separate damage potential from exploit feasibility."
                  },
                  {
                    "id": "security-v2-l7-q2",
                    "prompt": "Which recommendation is most actionable?",
                    "options": [
                      "Require signer + owner + PDA checks con explicit error codes",
                      "Improve sicurezza in this function",
                      "Add more comments"
                    ],
                    "answerIndex": 0,
                    "explanation": "Actionable recommendations map directly to code changes e tests."
                  }
                ]
              }
            ]
          },
          "security-v2-audit-report-checkpoint": {
            "title": "Checkpoint: deterministic AuditReport JSON + markdown",
            "content": "# Checkpoint: deterministic AuditReport JSON + markdown\n\nCreate the final deterministic checkpoint payload:\n- corso + version\n- scenario IDs\n- finding count\n\nThis checkpoint mirrors the final corso artifact produced by the simulator report builder.",
            "duration": "45 min",
            "hints": [
              "Return stable, minimal checkpoint metadata.",
              "corso must be solana-sicurezza e version must be v2.",
              "Preserve scenarioIds order as provided."
            ]
          }
        }
      }
    }
  },
  "token-engineering": {
    "title": "Token Engineering on Solana",
    "description": "Project-journey corso per teams launching real Solana tokens: deterministic Token-2022 planning, authority progettazione, supply simulation, e operational launch discipline.",
    "duration": "10 hours",
    "tags": [
      "tokens",
      "token-2022",
      "launch",
      "authorities",
      "simulation"
    ],
    "modules": {
      "token-v2-module-fundamentals": {
        "title": "Token Fundamentals -> Token-2022",
        "description": "Understand token primitives, mint policy anatomy, e Token-2022 extension controls con explicit governance e threat-model framing.",
        "lessons": {
          "token-v2-spl-vs-token-2022": {
            "title": "SPL tokens vs Token-2022: what extensions change",
            "content": "# SPL tokens vs Token-2022: what extensions change\n\nToken engineering starts con a clean boundary between base token semantics e configurable policy. Legacy SPL Token gives you a stable fungible primitive: mint metadata, token account, mint authority, freeze authority, e transfer/mint/burn istruzioni. Token-2022 preserves that core interface but adds extension slots that let teams activate richer behavior without rewriting token logic from scratch. That compatibility is useful, but it also creates a new class of governance e safety decisions that frontend e protocol engineers need to model explicitly.\n\nThe key modello mentale: Token-2022 is not a separate economic system; it is an extended account layout e istruzione surface. Extensions are opt-in, e each extension adds bytes, authorities, e state transitions that must be considered during mint initialization e lifecycle management. If you treat extensions as cosmetic add-ons, you can ship a token that is technically valid but operationally fragile.\n\nPer production teams, the first decision is policy minimalism. Every enabled extension increases complexity in wallet, indexers, e downstream integrations. Transfer fees may fit treasury goals but can break assumptions in partner protocols. Default account state can enforce safety posture but may confuse users if account thaw flow is unclear. Permanent delegate can simplify managed flows but dramatically expands power if authority boundaries are weak. The right approach is to map each extension to a concrete requirement e document the explicit threat model it introduces.\n\nToken-2022 also changes launch sequencing. You must pre-size mint account per chosen extensions, initialize extension data in deterministic order, e verify authority alignment before live distribution. This is where deterministic offline planning is valuable: you can generate a launch pack, inspect istruzione-like payloads, e validate invariants before touching network systems. That practice catches configuration drift early e gives reviewers a reproducible artifact.\n\nFinally, extension-aware progettazione is an integration problem, not just a contract problem. Product e support teams need clear messaging per fee behavior, frozen account states, e delegated capabilities. If users cannot predict token behavior from wallet prompts e docs, operational risk rises even when code is formally correct.\n\n## Decision framework per extension selection\n\nPer each extension, force three answers before enabling it:\n1. What concrete product requirement does this solve now?\n2. Which authority can abuse this if compromised?\n3. How will users e integrators observe this behavior in UX e docs?\n\nIf any answer is vague, extension scope is probably too broad.\n\n## Pitfall: Extension creep without threat modeling\n\nAdding multiple extensions \"per flexibility\" often creates overlapping authority powers e unpredictable UX. Enable only the extensions your product can govern, monitor, e explain end-to-end.\n\n## Sanity Checklist\n\n1. Define one explicit business reason per extension.\n2. Document extension authorities e revocation strategy.\n3. Verify partner compatibility assumptions before launch.\n4. Produce deterministic initialization artifacts per review.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l1-q1",
                    "prompt": "What is the safest default posture per Token-2022 extension selection?",
                    "options": [
                      "Enable only extensions con clear product e risk justification",
                      "Enable all extensions per future flexibility",
                      "Disable authorities entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "Every extension adds governance e integration complexity, so scope should stay intentional."
                  },
                  {
                    "id": "token-v2-l1-q2",
                    "prompt": "Why generate an offline deterministic launch pack before devnet/mainnet actions?",
                    "options": [
                      "To review istruzione intent e invariants before execution",
                      "To avoid configuring decimals",
                      "To bypass authority checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic planning provides reproducible review artifacts e catches config drift early."
                  }
                ]
              }
            ]
          },
          "token-v2-mint-anatomy": {
            "title": "Mint anatomy: authorities, decimals, supply, freeze, mint",
            "content": "# Mint anatomy: authorities, decimals, supply, freeze, mint\n\nA production token launch succeeds or fails on parameter discipline. The mint account is a compact policy object: it defines decimal precision, minting authority, optional freeze authority, e extension configuration. Token account then represent balances per owners, usually through ATAs. If these pieces are configured inconsistently, downstream systems see contradictory behavior e user trust erodes quickly.\n\nDecimals are one of the most underestimated parameters. They influence UI formatting, fee interpretation, e business logic in integrations. While high precision can feel \"future-proof,\" excessive decimals often create rounding edge cases in analytics e partner systems. Constraining decimals to a documented operational range e validating it at config time is a pratico defensive rule.\n\nAuthority layout should be explicit e minimal. Mint authority controls supply growth. Freeze authority controls account-level transfer ability. Update authority (per metadata-linked policy) can affect user-facing trust e protocol assumptions. Teams often reuse one operational key per convenience, then struggle to separate powers later. A better pattern is to predefine authority roles e revocation milestones as part of launch governance.\n\nSupply planning should distinguish issuance from distribution. Initial supply tells you what is minted; recipient allocations tell you what is distributed at launch. Those values should be validated con exact integer math, not float formatting. Invariant checks such as `recipientsTotal <= initialSupply` are simple but prevent serious release mistakes.\n\nToken-2022 extensions deepen this anatomy. Transfer fee config introduces fee basis points e caps; default account state changes account activation posture; permanent delegate creates a privileged transfer actor. Each extension implies additional authority e monitoring requirements. Your launch plan must encode these requirements as explicit steps e include human-readable labels so reviewers can confirm intent.\n\nFinally, deterministic address derivation in corso tooling is a useful engineering discipline. Even when pseudo-addresses are used per offline planning, stable derivation functions improve reproducibility e reduce reviewer ambiguity. The same mindset carries to real deployments where deterministic account derivation is foundational.\n\nStrong teams also pair mint-anatomy reviews con explicit incident playbooks: what to do if an authority key is lost, rotated, or compromised, e how to communicate those events to integrators without causing panic.\n\n## Pitfall: One-key authority convenience\n\nUsing a single key per minting, freezing, e metadata updates simplifies setup but concentrates risk. Authority compromise then becomes a full-token compromise rather than a contained incident.\n\n## Sanity Checklist\n\n1. Validate decimals e supply fields before plan generation.\n2. Record mint/freeze/update authority roles e custody model.\n3. Confirm recipient allocation totals con integer math.\n4. Review extension authorities independently from mint authority.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l2-q1",
                    "prompt": "Why should supply checks use integer math instead of floating-point UI values?",
                    "options": [
                      "To avoid rounding drift in launch invariants",
                      "Because decimals are always zero",
                      "Because token account store floats"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply e distribution correctness depends on exact arithmetic over integer base units."
                  },
                  {
                    "id": "token-v2-l2-q2",
                    "prompt": "What is the primary role of freeze authority?",
                    "options": [
                      "Controlling whether specific token account can transfer",
                      "Changing token symbol",
                      "Computing transfer fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freeze authority governs transfer state at account level, not branding or fee math."
                  }
                ]
              }
            ]
          },
          "token-v2-extension-safety-pitfalls": {
            "title": "Extension safety pitfalls: fee configs, delegate abuse, default account state",
            "content": "# Extension safety pitfalls: fee configs, delegate abuse, default account state\n\nToken-2022 extensions let teams express policy in a standard token framework, but policy power is exactly where operational failures happen. Sicurezza issues in token launches are rarely exotic cryptography failures. They are usually configuration mistakes: fee caps set too high, delegates granted too broadly, or frozen default states introduced without recovery controls. Production engineering must treat extension configuration as safety-critical logic.\n\nTransfer fee configuration is a good example. A basis-point fee looks simple, yet behavior depends on cap interaction e token decimals. If maxFee is undersized, large transfers saturate quickly e effective fee curve becomes nonlinear. If maxFee is oversized, treasury extraction can exceed expected user tolerance. Deterministic simulations across example transfer sizes are essential before launch, e those simulations should be reviewed by both protocol e product teams.\n\nPermanent delegate is another high-risk feature. It can enable managed flows, but it also creates a privileged actor that may transfer tokens without normal owner signatures depending on policy scope. If delegate authority is not governed by clear controls e revocation procedures, compromise risk rises sharply. In many incidents, teams enabled delegate-like authority per convenience, then discovered too late that governance e monitoring were insufficient.\n\nDefault account state introduces user-experience e compliance implications. A frozen default state can enforce controlled activation, but it also creates onboarding failure if thaw paths are unclear or unavailable in partner wallet. Teams should verify thaw strategy, authority custody, e fallback procedures before enabling frozen defaults in production.\n\nThe safest engineering workflow is deterministic e reviewable: validate config, normalize extension fields, generate initialization plan labels, simulate transfer outcomes, e produce invariant lists. That sequence creates a shared artifact per engineering, sicurezza, legal, e support stakeholders. When questions arise, teams can inspect exact intended policy rather than infer from fragmented scripts.\n\nFinally, treat extension combinations as compounded risk. Each extension may be individually reasonable, yet combined authority interactions can create hidden escalation paths. Cross-extension threat modeling is therefore mandatory per serious launches.\n\n## Pitfall: Fee e delegate settings shipped without scenario simulation\n\nTeams often validate only \"happy path\" transfer examples. Without boundary simulations e authority abuse scenarios, dangerous configurations can pass review e surface only after users are affected.\n\n## Sanity Checklist\n\n1. Simulate fee behavior at low/medium/high transfer sizes.\n2. Document delegate authority scope e emergency revocation path.\n3. Verify frozen default account have explicit thaw operations.\n4. Review combined extension authority interactions per escalation risk.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l3-q1",
                    "prompt": "Why does transfer-fee max cap need scenario test?",
                    "options": [
                      "It can materially change effective fee behavior across transfer sizes",
                      "It only affects metadata",
                      "It is ignored once mint is initialized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee cap interacts con basis points e can distort economic behavior if misconfigured."
                  },
                  {
                    "id": "token-v2-l3-q2",
                    "prompt": "What is a core risk of permanent delegate configuration?",
                    "options": [
                      "Privilege concentration if authority governance is weak",
                      "Loss of decimal precision",
                      "Automatic wallet incompatibility"
                    ],
                    "answerIndex": 0,
                    "explanation": "Delegate privileges must be constrained e governed like high-sensitivity access."
                  }
                ]
              }
            ]
          },
          "token-v2-validate-config-derive": {
            "title": "Validate token config + derive deterministic addresses offline",
            "content": "# Validate token config + derive deterministic addresses offline\n\nImplement strict config validation e deterministic pseudo-derivation:\n- validate decimals, u64 strings, recipient totals, extension fields\n- derive stable pseudo mint e ATA addresses from hash seeds\n- return normalized validated config + derivations\n",
            "duration": "35 min",
            "hints": [
              "Validate decimal bounds, u64-like numeric strings, e recipient totals before derivation.",
              "Use one deterministic seed format per mint e one per ATA derivation.",
              "Keep output key order stable so checkpoint tests are reproducible."
            ]
          }
        }
      },
      "token-v2-module-launch-pack": {
        "title": "Token Launch Pack Project",
        "description": "Build deterministic validation, planning, e simulation workflows that produce reviewable launch artifacts e clear go/no-go criteria.",
        "lessons": {
          "token-v2-build-init-plan": {
            "title": "Build Token-2022 initialization istruzione plan",
            "content": "# Build Token-2022 initialization istruzione plan\n\nCreate a deterministic offline initialization plan:\n- create mint account step\n- init mint step con decimals\n- append selected extension steps in stable order\n- base64 encode step payloads con explicit encoding version\n",
            "duration": "35 min",
            "hints": [
              "Add base steps first: create mint account, then initialize mint con decimals.",
              "Append extension steps in deterministic order so plan labels are stable.",
              "Encode each step payload con version + sorted params before base64 conversion."
            ]
          },
          "token-v2-simulate-fees-supply": {
            "title": "Build mint-to + transfer-fee math + simulation",
            "content": "# Build mint-to + transfer-fee math + simulation\n\nImplement pure simulation per transfer fees e launch distribution:\n- fee = min(maxFee, floor(amount * feeBps / 10000))\n- aggregate distribution totals deterministically\n- ensure no negative supply e no oversubscription\n",
            "duration": "35 min",
            "hints": [
              "Transfer fee formula: fee = min(maxFee, floor(amount * feeBps / 10000)).",
              "Aggregate distributed e fee totals using BigInt to keep math exact.",
              "Fail when distributed amount exceeds initial supply."
            ]
          },
          "token-v2-launch-checklist": {
            "title": "Launch checklist: params, upgrade/authority strategy, airdrop/test plan",
            "content": "# Launch checklist: params, upgrade/authority strategy, airdrop/test plan\n\nA successful token launch is an operations exercise as much as a programming task. By the time users see your token in wallet, dozens of choices have already constrained safety, governance, e UX. Production token engineering therefore needs a launch checklist that turns abstract progettazione intent into verifiable execution steps.\n\nStart con parameter closure. Name, symbol, decimals, initial supply, authority addresses, extension configuration, e recipient allocations must be finalized e reviewed as one immutable package before execution. Many launch incidents come from late parameter changes made in disconnected scripts. Deterministic launch pack generation prevents this by forcing a single source of truth.\n\nAuthority strategy is the second pillar. Decide which authorities remain active after launch, which are revoked, e which move to multisig custody. A common best practice is staged authority reduction: keep temporary controls through rollout validation, then revoke or transfer to governance once monitoring baselines are stable. This must be planned explicitly, not improvised during launch day.\n\nTest strategy should include deterministic offline tests e limited online rehearsal. Offline checks validate config schemas, istruzione payload encoding, fee simulations, e supply invariants. Optional devnet rehearsal validates operational playbooks (funding, sequence execution, monitoring) but should not be your only validation layer. If offline checks fail, devnet success is not meaningful.\n\nAirdrop e distribution planning should include recipient reconciliation e rollback strategy. Teams often focus on minting e forget operational constraints around recipient list correctness, timing windows, e support escalation paths. Deterministic distribution plans con stable labels make reconciliation simpler e reduce accidental double execution.\n\nMonitoring e communication are equally important. Define launch metrics in advance: minted supply observed, distribution completion count, fee behavior sanity, e extension-specific health checks. Publish user-facing notices per any non-obvious behavior such as transfer fees or frozen default account state. Clear communication lowers support load e improves trust.\n\nFinally, write down hard stop conditions. If invariants fail, if authority keys mismatch, or if distribution deltas diverge from expected totals, launch should pause immediately. Engineering discipline means refusing to proceed when safety checks are red.\n\n## Pitfall: Treating launch as a one-shot script run\n\nWithout an explicit checklist e rollback criteria, teams can execute technically valid istruzioni that violate business or governance intent. Successful launches are controlled workflows, not single commands.\n\n## Sanity Checklist\n\n1. Freeze a canonical config payload before execution.\n2. Approve authority lifecycle e revocation milestones.\n3. Run deterministic offline simulation e invariant checks.\n4. Reconcile recipient totals e distribution labels.\n5. Define go/no-go criteria e escalation owners.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l7-q1",
                    "prompt": "Why is parameter closure required before execution?",
                    "options": [
                      "To prevent script/config drift between review e launch",
                      "To maximize decimals",
                      "To disable transfer fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "Single-source configuration prevents mismatched launch behavior."
                  },
                  {
                    "id": "token-v2-l7-q2",
                    "prompt": "What is the purpose of hard stop launch criteria?",
                    "options": [
                      "To halt execution when invariants or authority assumptions fail",
                      "To increase transfer throughput",
                      "To avoid writing tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Hard stop rules prevent progressing through unsafe operational states."
                  }
                ]
              }
            ]
          },
          "token-v2-launch-pack-checkpoint": {
            "title": "Emit stable LaunchPackSummary",
            "content": "# Emit stable LaunchPackSummary\n\nCompose full project output as stable JSON:\n- normalized authorities e extensions\n- supply totals e optional fee model examples\n- deterministic plan metadata e invariants\n- fixtures hash + encoding version metadata\n",
            "duration": "45 min",
            "hints": [
              "Keep checkpoint JSON key ordering fixed so output is stable.",
              "Compute recipientsTotal e remaining con exact integer math.",
              "Include determinism metadata (fixtures hash + encoding version) in the final object."
            ]
          }
        }
      }
    }
  },
  "solana-mobile": {
    "title": "Solana Mobile Development",
    "description": "Build production-ready mobile Solana dApps con MWA, robust wallet session architecture, explicit signing UX, e disciplined distribution operations.",
    "duration": "6 hours",
    "tags": [
      "mobile",
      "saga",
      "dapp-store",
      "react-native"
    ],
    "modules": {
      "module-mobile-wallet-adapter": {
        "title": "Mobile Wallet Adapter",
        "description": "Core MWA protocol, session lifecycle control, e resilient wallet handoff patterns per production mobile apps.",
        "lessons": {
          "mobile-wallet-overview": {
            "title": "Mobile Wallet Panoramica",
            "content": "# Mobile Wallet Panoramica\n\nSolana Mobile development is built around the Solana Mobile Stack (SMS), a set of standards e tooling designed per secure, high-quality crypto-native mobile experiences. SMS is more than a hardware initiative; it defines interoperable wallet communications, trusted execution patterns, e distribution infrastructure tailored to Web3 apps.\n\nA core piece is the Mobile Wallet Adapter (MWA) protocol. Instead of embedding private keys in dApps, MWA connects mobile dApps to external wallet apps per authorization, signing, e transazione submission. This separation mirrors browser wallet sicurezza on desktop e prevents dApps from directly handling secret keys.\n\nSaga introduced the first flagship reference device per Solana Mobile concepts, including Seed Vault-oriented workflows. Even when users are not on Saga, SMS standards remain useful because protocol-level interoperability is the target: any wallet implementing MWA can serve compatible apps.\n\nThe Solana dApp Store is another foundational element. It provides a distribution channel per crypto applications con policy considerations better aligned to on-chain apps than traditional app stores. Teams can ship wallet-native functionality, tokenized features, e on-chain social mechanics without the same constraints often imposed by conventional app marketplaces.\n\nKey architectural principles per mobile Solana apps:\n\n- Keep signing in wallet context, not app context.\n- Treat session authorization as revocable e short-lived.\n- Build graceful fallback if wallet app is missing.\n- Optimize per intermittent connectivity e mobile latency.\n\nTypical mobile flow:\n\n1. dApp requests authorization via MWA.\n2. Wallet prompts user to approve account access.\n3. dApp builds transazioni e requests signatures.\n4. Wallet returns signed payload or submits transazione.\n5. dApp observes confirmation e updates UI.\n\nMobile UX needs explicit state transitions (authorizing, awaiting wallet, signing, submitted, confirmed). Ambiguity causes user drop-off quickly on small screens.\n\nPer Solana teams, mobile is not a “mini web app”; it requires deliberate protocol e UX progettazione choices. SMS e MWA provide a secure baseline so developers can ship on-chain experiences con production-grade signing e session models on handheld devices.\n\n## Pratico architecture split\n\nTreat your mobile stack as three independent systems:\n1. UI app state e navigation.\n2. Wallet transport/session state (MWA lifecycle).\n3. On-chain transazione intent e confirmation state.\n\nIf you couple these layers tightly, wallet switch interruptions e app backgrounding can corrupt flow state. If they stay separated, recovery is predictable.\n\n## What users should feel\n\nGood mobile crypto UX is not \"fewer steps at all costs.\" It is clear intent, explicit signing context, e safe recoverability when app switching or network instability happens.\n",
            "duration": "35 min"
          },
          "mwa-integration": {
            "title": "MWA Integration",
            "content": "# MWA Integration\n\nIntegrating Mobile Wallet Adapter typically starts con `@solana-mobile/mobile-wallet-adapter` APIs e an interaction pattern built around `transact()`. Within a transazione session, the app can authorize, request capabilities, sign transazioni, e handle wallet responses in a structured way.\n\nA simplified integration flow:\n\n```typescript\nimport { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';\n\nawait transact(async (wallet) => {\n  const auth = await wallet.authorize({\n    cluster: 'devnet',\n    identity: { name: 'JazzCode Mobile', uri: 'https://jazzcode.vercel.app' },\n  });\n\n  const account = auth.accounts[0];\n  // build tx, request signing/submission\n});\n```\n\nAuthorization yields one or more account plus auth tokens per session continuation. Persist these tokens carefully e invalidate them on sign-out. Do not assume tokens remain valid forever; wallet apps can revoke sessions.\n\nPer signing, you can request:\n\n- `signTransactions` (sign only)\n- `signAndSendTransactions` (wallet signs e submits)\n- `signMessages` (SIWS-like auth flows)\n\nDeep links are used under the hood to switch between your dApp e wallet. That means state restoration matters: your app should survive process backgrounding e resume pending operation state on return.\n\nPratico engineering tips:\n\n- Implement idempotent transazione request handling.\n- Show a visible “Waiting per wallet approval” state.\n- Handle user cancellation explicitly, not as generic failure.\n- Retry network submission separately from signing when possible.\n\nSicurezza considerations:\n\n- Bind sessions to app identity metadata.\n- Use short-lived backend nonces per message-sign auth.\n- Never log full signed payloads con sensitive context.\n\nMWA is effectively your mobile signing transport layer. If its state machine is robust, your app feels professional e trustworthy. If state handling is weak, users experience “stuck” flows e may distrust the dApp even if on-chain logic is correct.",
            "duration": "35 min"
          },
          "mobile-transaction": {
            "title": "Build a Mobile Transazione Function",
            "content": "# Build a Mobile Transazione Function\n\nImplement a helper that formats a deterministic MWA transazione request summary string.\n\nExpected output format:\n\n`<cluster>|<payer>|<instructionCount>`\n\nUse this exact order e delimiter.",
            "duration": "50 min",
            "hints": [
              "Add validation before returning the formatted string.",
              "instructionCount should be treated as a number but returned as text.",
              "Throw exact error message per missing payer."
            ]
          }
        }
      },
      "module-dapp-store-and-distribution": {
        "title": "dApp Store & Distribution",
        "description": "Publishing, operational readiness, e trust-centered mobile UX practices per Solana app distribution.",
        "lessons": {
          "dapp-store-submission": {
            "title": "dApp Store Submission",
            "content": "# dApp Store Submission\n\nPublishing to the Solana dApp Store requires more than packaging binaries. Teams should treat submission as a product, compliance, e sicurezza review process. A strong submission demonstrates safe wallet interactions, clear user communication, e operational readiness.\n\nSubmission readiness checklist:\n\n- Stable release builds per target Android devices.\n- Clear app identity e support channels.\n- Wallet interaction flows tested per cancellation e failure recovery.\n- Privacy policy e terms aligned to on-chain behaviors.\n- Transparent handling of tokenized features e in-app value flows.\n\nOne distinguishing concept in Solana mobile distribution is token-aware product progettazione. Apps may use NFT-gated access, on-chain subscriptions, or tokenized entitlements. These flows must be understandable to users e not hide financial consequences. Review teams typically evaluate whether permissions e wallet prompts are proportional to app behavior.\n\nNFT-based licensing models can be implemented by checking ownership of specific collection assets at runtime. If licensing depends on assets, build robust indexing e refresh behavior so users are not locked out due to temporary RPC/indexer mismatch.\n\nOperational best practice per review success:\n\n- Provide reproducible test account e walkthroughs.\n- Include a “safe mode” or demo path if wallet connection fails.\n- Avoid unexplained signature prompts.\n- Log non-sensitive diagnostics per support.\n\nPost-submission lifecycle matters too. Plan how you will handle urgent fixes, wallet SDK updates, e chain-level incidents. Mobile releases can take time to propagate, so feature flags e backend kill-switches per risky pathways are valuable.\n\nDistribution strategy should also include analytics around onboarding funnels, wallet connect success rates, e transazione completion rates. These metrics identify mobile-specific friction that desktop-oriented teams often miss.\n\nA successful dApp Store submission reflects secure protocol integration e mature product operations. If your wallet interactions are explicit, fail-safe, e user-centered, your app is far more likely to pass review e retain users in production.",
            "duration": "35 min"
          },
          "mobile-best-practices": {
            "title": "Mobile Best practice",
            "content": "# Mobile Best practice\n\nMobile crypto UX requires balancing speed, safety, e trust. Users make high-stakes decisions on small screens, often on unstable networks. Solana mobile apps should therefore optimize per explicitness e recoverability, not just visual polish.\n\n**Biometric gating** is useful per sensitive local actions (revealing seed-dependent views, exporting account data, approving high-risk actions), but wallet-level signing decisions should remain in wallet app context. Avoid building fake in-app “confirm” screens that look like signing prompts.\n\n**Session keys e scoped auth** improve UX by reducing repetitive approvals. However, scope must be tightly constrained (allowed methods, time window, limits). Session credentials should be revocable e auditable.\n\n**Offline e poor-network behavior** must be handled intentionally:\n\n- Queue non-critical reads.\n- Retry idempotent submissions con backoff.\n- Distinguish “signed but not submitted” from “submitted but unconfirmed.”\n\n**Push notifications** are valuable per transazione outcomes, liquidation alerts, e governance events. Notifications should include enough context per user safety but never leak sensitive data.\n\nUX patterns that consistently improve conversion:\n\n- Show transazione simulation summaries before wallet handoff.\n- Display clear statuses: building, awaiting signature, submitted, confirmed.\n- Provide explorer links e retry actions.\n- Use plain-language error messages con suggested fixes.\n\nSicurezza hygiene:\n\n- Pin trusted RPC endpoints or use reputable providers con fallback.\n- Validate account ownership e expected program IDs on all client-side decoded data.\n- Protect analytics pipelines from sensitive payload leakage.\n\nAccessibility e internationalization matter per global adoption. Ensure touch targets, contrast, e localization of risk messages are adequate. Per crypto workflows, misunderstanding can cause irreversible loss.\n\nFinally, measure reality: connect success rate, signature approval rate, drop-off after wallet switch, e average time-to-confirmation. Mobile teams that instrument these metrics can iteratively remove friction e increase trust.\n\nGreat Solana mobile apps feel predictable under stress. If users always understand what they are signing, what state they are in, e how to recover, your product is operating at production quality.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-testing": {
    "title": "Test Solana Programs",
    "description": "Build robust Solana test systems across local, simulated, e network environments con explicit sicurezza invariants e release-quality confidence gates.",
    "duration": "6 hours",
    "tags": [
      "testing",
      "bankrun",
      "anchor",
      "devnet"
    ],
    "modules": {
      "module-testing-foundations": {
        "title": "Test Foundations",
        "description": "Core test strategy across unit/integration layers con deterministic workflows e adversarial case coverage.",
        "lessons": {
          "testing-approaches": {
            "title": "Test Approaches",
            "content": "# Test Approaches\n\nTest Solana programs requires multiple layers because failures can occur in logic, account validation, transazione composition, or network behavior. A production test strategy usually combines unit tests, integration tests, e end-to-end validation across local validatori e devnet.\n\n**Unit tests** validate isolated business logic con minimal runtime overhead. In Rust, pure helper functions (math, state transitions, invariant checks) should be unit-tested aggressively because they are easy to execute e fast in CI.\n\n**Integration tests** execute against realistic program invocation paths. Per Anchor projects, this often means `anchor test` con local validatore setup, account initialization flows, e istruzione-level assertions. Integration tests should cover both positive e adversarial inputs, including invalid account, unauthorized signers, e boundary values.\n\n**End-to-end tests** include frontend/client composition plus wallet e RPC interactions. They catch issues that lower layers miss: incorrect account ordering, wrong PDA derivations in client code, e serialization mismatches.\n\nCommon tools:\n\n- `solana-program-test` per Rust-side test con in-process banks simulation.\n- `solana-bankrun` per deterministic TypeScript integration test.\n- Anchor TypeScript client per istruzione building e assertions.\n- Playwright/Cypress per app-level transazione flow tests.\n\nTest coverage priorities:\n\n1. Authorization e signer checks.\n2. Account ownership e PDA seed constraints.\n3. Arithmetic boundaries e fee logic.\n4. CPI behavior e failure rollback.\n5. Upgrade compatibility e migration paths.\n\nA frequent anti-pattern is only test happy paths con one wallet e static inputs. This misses most exploit classes. Robust suites include malicious account substitution, stale or duplicated account, e partial failure simulation.\n\nIn CI, separate fast deterministic suites from slower network-dependent suites. Run deterministic tests on every push, e run heavier devnet suites on merge or release.\n\nEffective Solana test is about confidence under adversarial conditions, not just green checkmarks. If your tests model attacker behavior e account-level edge cases, you will prevent the majority of production incidents before distribuzione.\n\n## Pratico suite progettazione rule\n\nMap every critical istruzione to at least one test in each layer:\n- unit test per pure invariant/math logic\n- integration test per account validation e state transitions\n- environment test per wallet/RPC orchestration\n\nIf one layer is missing, incidents usually appear in that blind spot first.",
            "duration": "35 min"
          },
          "bankrun-testing": {
            "title": "Bankrun Test",
            "content": "# Bankrun Test\n\nSolana Bankrun provides deterministic, high-speed test execution per Solana programs from TypeScript environments. It emulates a local bank-like runtime where transazioni can be processed predictably, account can be inspected directly, e temporal state can be manipulated per test scenarios like vesting unlocks or oracle staleness.\n\nCompared con relying on external devnet, Bankrun gives repeatability. This is crucial per CI pipelines where flaky network behavior can mask regressions.\n\nTypical Bankrun workflow:\n\n1. Start test context con target program loaded.\n2. Create keypairs e funded test account.\n3. Build e process transazioni via BanksClient-like API.\n4. Assert post-transazione account state.\n5. Advance slots/time per time-dependent logic tests.\n\nConceptual setup:\n\n```typescript\n// pseudocode\nconst context = await startBankrun({ programs: [...] });\nconst client = context.banksClient;\n\n// process tx and inspect accounts deterministically\n```\n\nWhy Bankrun is powerful:\n\n- Fast iteration per protocol teams.\n- Deterministic block/slot control.\n- Rich account inspection without explorer dependency.\n- Easy simulation of multi-step protocol flows.\n\nHigh-value Bankrun test scenarios:\n\n- Liquidation eligibility after oracle/time movement.\n- Vesting e cliff unlock schedule transitions.\n- Fee accumulator updates across many operations.\n- CPI behavior con mocked downstream account states.\n\nCommon mistakes:\n\n- Asserting only transazione success without state validation.\n- Ignoring rent e account lamport changes.\n- Not test replay/idempotency behaviors.\n\nUse helper factories per test account e PDA derivations so tests remain concise. Keep transazione builders in reusable utilities to avoid drift between test e production clients.\n\nBankrun is not a replacement per all environments, but it is one of the best layers per deterministic integration confidence on Solana. Teams that invest in comprehensive Bankrun suites tend to catch state-machine bugs significantly earlier than teams relying only on devnet smoke tests.",
            "duration": "35 min"
          },
          "write-bankrun-test": {
            "title": "Write a Counter Program Bankrun Test",
            "content": "# Write a Counter Program Bankrun Test\n\nImplement a helper that returns the expected counter value after a sequence of increment operations. This mirrors a deterministic assertion you would use in a Bankrun test.\n\nReturn the final numeric value as a string.",
            "duration": "50 min",
            "hints": [
              "Use Array.reduce to sum increments.",
              "Start reduce con the initial value.",
              "Convert final number to string before returning."
            ]
          }
        }
      },
      "module-advanced-testing": {
        "title": "Avanzato Test",
        "description": "Fuzzing, devnet validation, e CI/CD release controls per safer protocol changes.",
        "lessons": {
          "fuzzing-trident": {
            "title": "Fuzzing con Trident",
            "content": "# Fuzzing con Trident\n\nFuzzing explores large input spaces automatically to find bugs that handcrafted tests miss. Per Solana e Anchor programs, Trident-style fuzzing workflows generate randomized istruzione sequences e parameter values, then check invariants such as “total supply never decreases incorrectly” or “vault liabilities never exceed assets.”\n\nUnlike unit tests that validate expected examples, fuzzing asks: what if inputs are weird, extreme, or adversarial in combinations we did not think about?\n\nCore fuzzing components:\n\n- **Generators** per istruzione inputs e account states.\n- **Harness** that executes generated transazioni.\n- **Invariants** that must always hold.\n- **Shrinking** to minimize failing inputs per debugging.\n\nUseful invariants in DeFi protocols:\n\n- Conservation of value across transfers e burns.\n- Non-negative balances e debt states.\n- Authority invariants (only valid signer modifies privileged state).\n- Price e collateral constraints under liquidation logic.\n\nFuzzing strategy tips:\n\n- Start con a small istruzione set e one invariant.\n- Add stateful multi-step scenarios (deposit->borrow->repay->withdraw).\n- Include random account ordering e malicious account substitution cases.\n- Track coverage to avoid blind spots.\n\nCoverage analysis matters: if fuzzing never reaches critical branches (error paths, CPI failure handlers, liquidation branches), it gives false confidence. Integrate branch coverage tools where possible.\n\nTrident e similar fuzzers are especially good at discovering arithmetic edge cases, stale state assumptions, e unexpected state transitions from unusual call sequences.\n\nCI integration approach:\n\n- Run short fuzz campaigns on every PR.\n- Run longer campaigns nightly.\n- Persist failing seeds as regression tests.\n\nFuzzing should complement, not replace, deterministic tests. Deterministic suites provide explicit behavior guarantees; fuzzing provides adversarial exploration at scale.\n\nPer serious Solana protocols handling user funds, fuzzing is no longer optional. It is one of the highest-leverage investments per preventing unknown-unknown bugs before mainnet exposure.",
            "duration": "35 min"
          },
          "devnet-testing": {
            "title": "Devnet Test",
            "content": "# Devnet Test\n\nDevnet test bridges the gap between deterministic local tests e real-world network conditions. While local validatori e Bankrun are ideal per speed e reproducibility, devnet reveals behavior under real RPC latency, block production timing, fee markets, e account history constraints.\n\nA robust devnet test strategy includes:\n\n- Automated program distribuzione to a dedicated devnet keypair.\n- Deterministic fixture creation (airdrop, mint setup, PDAs).\n- Smoke tests per critical istruzione paths.\n- Monitoring of transazione confirmation e log outputs.\n\nImportant devnet caveats:\n\n- State is shared e can be noisy.\n- Airdrop limits can throttle tests.\n- RPC providers may differ in reliability e rate limits.\n\nTo reduce flakiness:\n\n- Use dedicated namespaces/seeds per CI run.\n- Add retries per transient network failures.\n- Bound test runtime e fail con actionable logs.\n\nProgram upgrade test is particularly important on devnet. Validate that new binaries preserve account compatibility e migrations execute as expected. Incompatible changes can brick existing account if not tested.\n\nChecklist per release-candidate validation:\n\n1. Deploy upgraded program binary.\n2. Run migration istruzioni.\n3. Execute backward-compatibility read paths.\n4. Execute all critical write istruzioni.\n5. Verify event/log schema expected by indexers.\n\nPer financial protocols, include oracle integration tests e liquidation path checks against live-like feeds if possible.\n\nDevnet should not be your only quality gate, but it is the best pre-mainnet signal per environment-related issues. Teams that ship without meaningful devnet validation often discover RPC edge cases e timing bugs in production.\n\nTreat devnet as a staging environment con disciplined test orchestration, clear observability, e explicit rollback plans.",
            "duration": "35 min"
          },
          "ci-cd-pipeline": {
            "title": "CI/CD Pipeline per Solana",
            "content": "# CI/CD Pipeline per Solana\n\nA mature Solana CI/CD pipeline enforces quality gates across code, tests, sicurezza checks, e distribuzione workflows. Per program teams, CI is not just linting Rust e TypeScript; it is about protecting on-chain invariants before irreversible releases.\n\nRecommended pipeline stages:\n\n1. **Static checks**: formatting, lint, type checks.\n2. **Unit/integration tests**: deterministic local execution.\n3. **Sicurezza checks**: dependency scan, optional static analyzers.\n4. **Build artifacts**: reproducible program binaries.\n5. **Staging deploy**: optional devnet distribuzione e smoke tests.\n6. **Manual approval** per production deploy.\n\nGitHub Actions is a common choice. A typical workflow matrix runs Rust e Node tasks in parallel to reduce cycle time. Cache Cargo e pnpm dependencies aggressively.\n\nExample conceptual workflow snippets:\n\n```yaml\n- run: cargo test --workspace\n- run: pnpm lint && pnpm typecheck && pnpm test\n- run: anchor build\n- run: anchor test --skip-local-validator\n```\n\nPer deployments:\n\n- Store deploy keypairs in secure secrets management.\n- Restrict deploy jobs to protected branches/tags.\n- Emit program IDs e transazione signatures as artifacts.\n\nProgram verification is critical. Where possible, verify deployed binary matches source-controlled build output. This strengthens trust e simplifies audits.\n\nOperational safety practices:\n\n- Use feature flags per high-risk logic activation.\n- Keep rollback strategy documented.\n- Monitor post-deploy metrics (error rates, failed tx ratio, latency).\n\nInclude regression tests per previously discovered bugs. Every production incident should produce a permanent automated test.\n\nA strong CI/CD pipeline is an engineering control, not a convenience. It reduces release risk, accelerates safe iteration, e provides confidence that code changes preserve sicurezza e protocol correctness under production conditions.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-indexing": {
    "title": "Solana Indexing & Analytics",
    "description": "Build a production-grade Solana event indexer con deterministic decoding, resilient ingestion contracts, checkpoint recovery, e analytics outputs teams can trust.",
    "duration": "10 hours",
    "tags": [
      "indexing",
      "analytics",
      "events",
      "tokens",
      "solana"
    ],
    "modules": {
      "indexing-v2-foundations": {
        "title": "Indexing Foundations",
        "description": "Events model, token decoding, e transazione parsing fundamentals con schema discipline e deterministic normalization.",
        "lessons": {
          "indexing-v2-events-model": {
            "title": "Events model: transazioni, logs, e program istruzioni",
            "content": "# Events model: transazioni, logs, e program istruzioni\n\nIndexing Solana starts con understanding where data lives e how to extract structured events from raw chain data. Unlike EVM chains where events are explicit log topics, Solana encodes program state changes in account updates e program logs. Your indexer must parse these sources e transform them into a queryable event stream.\n\nA transazione on Solana contains one or more istruzioni. Each istruzione targets a program, includes account metas, e carries opaque istruzione data. When executed, programs emit log entries via solana_program::msg or similar macros. These logs, combined con pre/post account states, form the raw material per event indexing.\n\nThe indexer pipeline typically follows: fetch → parse → normalize → store. Fetch retrieves transazione metadata via RPC or geyser plugins. Parse extracts program logs e account diffs. Normalize converts raw data into domain-specific events con stable schemas. Store persists events con appropriate indexing per queries.\n\nKey concepts per normalization: istruzione program IDs identify which decoder to apply, account ownership determines data layout, e log prefixes often indicate event types (e.g., \"Transfer\", \"Mint\", \"Burn\"). Your indexer must handle multiple program versions gracefully, maintaining backward compatibility as istruzione layouts evolve.\n\nIdempotency is critical. Block reorganizations are rare on Solana but possible during forks. Your indexing pipeline should handle replayed transazioni without duplicating events. This typically means using transazione signatures as unique keys e implementing upsert semantics in the storage layer.\n\n## Operator modello mentale\n\nTreat your indexer as a data product con explicit contracts:\n1. ingest contract (what raw inputs are accepted),\n2. normalization contract (stable event schema),\n3. serving contract (what query consumers can rely on).\n\nWhen these contracts are versioned e documented, protocol upgrades become manageable instead of breaking downstream analytics unexpectedly.\n\n## Checklist\n- Understand transazione → istruzioni → logs hierarchy\n- Identify program IDs e account ownership per data layout selection\n- Normalize raw logs into domain events con stable schemas\n- Implement idempotent ingestion using transazione signatures\n- Plan per program version evolution in decoders\n\n## Red flags\n- Parsing logs without validating program IDs\n- Assuming fixed account ordering across program versions\n- Missing idempotency leading to duplicate events\n- Storing raw data without normalized event extraction\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexing-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l1-q1",
                    "prompt": "What is the primary source of event data on Solana?",
                    "options": [
                      "Program logs e account state changes",
                      "Explicit event topics like EVM",
                      "Validatore consensus messages"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana programs emit events via logs e state changes, not explicit event topics."
                  },
                  {
                    "id": "indexing-v2-l1-q2",
                    "prompt": "Why is idempotency important in indexing?",
                    "options": [
                      "To prevent duplicate events during replays or forks",
                      "To improve RPC response times",
                      "To reduce storage costs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Idempotent ingestion ensures the same transazione processed twice creates only one event."
                  }
                ]
              }
            ]
          },
          "indexing-v2-token-decoding": {
            "title": "Token account decoding e SPL layout",
            "content": "# Token account decoding e SPL layout\n\nSPL Token account follow a standardized binary layout that indexers must parse to track balances e mint operations. Understanding this layout enables you to extract meaningful data from raw account bytes without relying on external APIs.\n\nA token account contains: mint address (32 bytes), owner address (32 bytes), amount (8 bytes u64), delegate (32 bytes, optional), state (1 byte), is_native (1 byte + 8 bytes if native), delegated_amount (8 bytes), e close_authority (36 bytes optional). The total size is typically 165 bytes per standard account.\n\nAccount discriminators help identify account types. SPL Token account are owned by the Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) or Token-2022. Your indexer should verify ownership before attempting to parse, as malicious account could mimic data layouts.\n\nDecoding involves: read the 32-byte mint, verify it matches expected token, read the 64-bit amount (little-endian), convert to decimal representation using mint decimals, e track owner per balance aggregation. Always handle malformed data gracefully - truncated account or unexpected sizes should not crash the indexer.\n\nPer balance diffs, compare pre-transazione e post-transazione states. A transfer emits no explicit event but changes two account amounts. Your indexer must detect these changes by comparing states before e after istruzione execution.\n\n## Checklist\n- Verify token program ownership before parsing\n- Decode mint, owner, e amount fields correctly\n- Handle little-endian u64 conversion properly\n- Support both Token e Token-2022 programs\n- Implement graceful handling per malformed account\n\n## Red flags\n- Parsing without ownership verification\n- Ignoring mint decimals in amount conversion\n- Assuming fixed account sizes without bounds checking\n- Missing balance diff detection per transfers\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexing-v2-l2-token-explorer",
                "title": "Token Account Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "SPL Token Account",
                      "address": "TokenAccount1111111111111111111111111111111",
                      "lamports": 2039280,
                      "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                      "executable": false,
                      "dataLen": 165
                    }
                  ]
                }
              },
              {
                "type": "quiz",
                "id": "indexing-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l2-q1",
                    "prompt": "What is the standard size of an SPL Token account?",
                    "options": [
                      "165 bytes",
                      "64 bytes",
                      "256 bytes"
                    ],
                    "answerIndex": 0,
                    "explanation": "Standard SPL Token account are 165 bytes, containing mint, owner, amount, e optional fields."
                  },
                  {
                    "id": "indexing-v2-l2-q2",
                    "prompt": "How should amount be interpreted from token account data?",
                    "options": [
                      "As little-endian u64, then divided by 10^decimals",
                      "As big-endian u32 directly",
                      "As ASCII string"
                    ],
                    "answerIndex": 0,
                    "explanation": "Amounts are stored as little-endian u64 e must be converted using the mint's decimal places."
                  }
                ]
              }
            ]
          },
          "indexing-v2-decode-token-account": {
            "title": "Challenge: Decode token account + diff token balances",
            "content": "# Challenge: Decode token account + diff token balances\n\nImplement deterministic token account decoding e balance diffing:\n\n- Parse a 165-byte SPL Token account layout\n- Extract mint, owner, e amount fields\n- Compute balance differences between pre/post states\n- Return normalized event objects con stable ordering\n\nYour solution will be validated against multiple test cases con various token account states.",
            "duration": "45 min",
            "hints": [
              "SPL Token account layout: mint (32B), owner (32B), amount (8B LE u64)",
              "Use little-endian byte order per the amount field",
              "Convert bytes to base58 per Solana addresses"
            ]
          },
          "indexing-v2-transaction-meta": {
            "title": "Transazione meta parsing: logs, errors, e inner istruzioni",
            "content": "# Transazione meta parsing: logs, errors, e inner istruzioni\n\nTransazione metadata provides the context needed to index complex operations. Understanding how to parse logs, handle errors, e traverse inner istruzioni enables comprehensive event extraction.\n\nProgram logs follow a hierarchical structure. The outermost logs show istruzione execution order, while inner logs reveal CPI calls. Each log line typically includes a prefix indicating severity or type: \"Program\", \"Invoke\", \"Success\", \"Fail\", or custom program messages. Your parser should handle nested invocation levels correctly.\n\nError handling distinguishes between transazione-level failures e istruzione-level failures. A transazione may succeed overall while individual istruzioni fail (e are rolled back). Conversely, a single failing istruzione can cause the entire transazione to fail. Indexers should record these distinctions per accurate analytics.\n\nInner istruzioni reveal the complete execution trace. When a program makes CPI calls, these appear as inner istruzioni in transazione metadata. Indexers must traverse both top-level e inner istruzioni to capture all state changes. This is especially important per protocols like Jupiter that route through multiple DEXs.\n\nLog filtering improves efficiency. Rather than parsing all logs, indexers can filter by program ID prefixes or known event signatures. However, be cautious - aggressive filtering might miss important events during protocol upgrades or edge cases.\n\n## Checklist\n- Parse program logs con proper nesting level tracking\n- Distinguish transazione-level from istruzione-level errors\n- Traverse inner istruzioni per complete CPI traces\n- Implement efficient log filtering by program ID\n- Handle both success e failure scenarios\n\n## Red flags\n- Ignoring inner istruzioni e missing CPI events\n- Treating all log failures as transazione failures\n- Parsing without log level/depth context\n- Missing error context in indexed events\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "indexing-v2-l4-logs",
                "title": "Log Structure Example",
                "steps": [
                  {
                    "cmd": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
                    "output": "Program log: Istruzione: Transfer",
                    "note": "Top-level istruzione at depth 1"
                  },
                  {
                    "cmd": "Program 11111111111111111111111111111111 invoke [2]",
                    "output": "Program log: Create account",
                    "note": "Inner CPI call at depth 2"
                  },
                  {
                    "cmd": "Program 11111111111111111111111111111111 success",
                    "output": "Program Tokenkeg... success",
                    "note": "Success bubbles up from inner to outer"
                  }
                ]
              }
            ]
          }
        }
      },
      "indexing-v2-pipeline": {
        "title": "Indexing Pipeline & Analytics",
        "description": "Build end-to-end indexer pipeline behavior: idempotent ingestion, checkpoint recovery, e analytics aggregation at production scale.",
        "lessons": {
          "indexing-v2-index-transactions": {
            "title": "Challenge: Index transazioni to normalized events",
            "content": "# Challenge: Index transazioni to normalized events\n\nImplement a transazione indexer that produces normalized Event objects:\n\n- Parse istruzione logs e identify event types\n- Extract transfer events con from/to/amount/mint\n- Handle multiple events per transazione\n- Return stable, canonical JSON con sorted keys\n- Support idempotency via transazione signature deduplication",
            "duration": "50 min",
            "hints": [
              "Parse log entries to identify event types",
              "Extract fields using regex patterns",
              "Include transazione signature per traceability",
              "Sort events by index per deterministic output"
            ]
          },
          "indexing-v2-pagination-caching": {
            "title": "Pagination, checkpointing, e caching semantics",
            "content": "# Pagination, checkpointing, e caching semantics\n\nProduction indexers must handle large datasets efficiently while maintaining consistency. Pagination, checkpointing, e caching form the backbone of scalable indexing infrastructure.\n\nPagination strategies depend on query patterns. Cursor-based pagination using transazione signatures provides stable ordering even during concurrent writes. Offset-based pagination can miss or duplicate entries during high-write periods. Per time-series data, consider partitioning by slot or block time.\n\nCheckpointing enables recovery from failures. Indexers should periodically save their processing position (last processed slot/signature) to durable storage. On restart, resume from the checkpoint rather than re-indexing from genesis. This pattern is essential per long-running indexers handling months of chain history.\n\nCaching reduces redundant RPC calls. Account metadata, program IDs, e decoded istruzione layouts can be cached con appropriate TTLs. However, cache invalidation is critical - stale cache entries can lead to incorrect decoding or missed events. Consider using slot-based versioning per cache entries.\n\nIdempotent writes prevent data corruption. Even con checkpointing, duplicate processing can occur during retries. Use transazione signatures as unique identifiers e implement upsert semantics. Database constraints or unique indexes should enforce this at the storage layer.\n\n## Checklist\n- Implement cursor-based pagination per stable ordering\n- Save periodic checkpoints per failure recovery\n- Cache account metadata con slot-based invalidation\n- Enforce idempotent writes via unique constraints\n- Handle backfills without duplicating events\n\n## Red flags\n- Using offset pagination per high-write datasets\n- Missing checkpointing requiring full re-index on restart\n- Caching without proper invalidation strategies\n- Allowing duplicate events from retry logic\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexing-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l6-q1",
                    "prompt": "Why is cursor-based pagination preferred per indexing?",
                    "options": [
                      "It provides stable ordering during concurrent writes",
                      "It requires less storage",
                      "It is faster to implement"
                    ],
                    "answerIndex": 0,
                    "explanation": "Cursor-based pagination handles concurrent writes without missing or duplicating entries."
                  },
                  {
                    "id": "indexing-v2-l6-q2",
                    "prompt": "What enables indexer recovery after crashes?",
                    "options": [
                      "Periodic checkpointing of last processed position",
                      "Re-indexing from genesis on every start",
                      "Caching all data in memory"
                    ],
                    "answerIndex": 0,
                    "explanation": "Checkpoints allow indexers to resume from the last known good position."
                  }
                ]
              }
            ]
          },
          "indexing-v2-analytics": {
            "title": "Analytics aggregation: per wallet, per token metrics",
            "content": "# Analytics aggregation: per wallet, per token metrics\n\nRaw event data becomes valuable through aggregation. Building analytics pipelines enables insights into user behavior, token flows, e protocol usage patterns.\n\nPer-wallet analytics track individual user activity. Key metrics include: transazione count, unique tokens held, total volume transferred, first/last activity timestamps, e interaction patterns con specific programs. These metrics power user segmentation e engagement analysis.\n\nPer-token analytics track asset-level metrics. Important aggregations include: total transfer volume, unique holders, holder distribution (whales vs retail), velocity (average time between transfers), e cross-program usage. These inform tokenomics analysis e market research.\n\nTime-windowed aggregations support trend analysis. Daily, weekly, e monthly rollups enable comparison across time periods. Consider using tumbling windows per fixed periods or sliding windows per moving averages. Materialized views can pre-compute common aggregations per query prestazioni.\n\nNormalization ensures consistent comparisons. Convert all amounts to human-readable decimals, normalize timestamps to UTC, e use consistent address formatting (base58). Deduplicate events from failed transazioni that may still appear in logs.\n\n## Checklist\n- Aggregate per-wallet metrics (volume, token count, activity)\n- Aggregate per-token metrics (holders, velocity, distribution)\n- Implement time-windowed rollups per trend analysis\n- Normalize amounts, timestamps, e addresses\n- Exclude failed transazioni from aggregates\n\n## Red flags\n- Mixing raw e decimal-adjusted amounts\n- Including failed transazioni in volume metrics\n- Missing time normalization across timezones\n- Storing unbounded raw data without aggregation\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexing-v2-l7-analytics",
                "title": "Analytics Dashboard",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Wallet Summary",
                      "address": "Wallet111111111111111111111111111111111111",
                      "lamports": 5000000000,
                      "owner": "SystemProgram11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    }
                  ]
                }
              }
            ]
          },
          "indexing-v2-analytics-checkpoint": {
            "title": "Checkpoint: Produce stable JSON analytics summary",
            "content": "# Checkpoint: Produce stable JSON analytics summary\n\nImplement the final analytics checkpoint that produces a deterministic summary:\n\n- Aggregate events into per-wallet e per-token metrics\n- Generate sorted, stable JSON output\n- Include timestamp e summary statistics\n- Handle edge cases (empty datasets, single events)\n\nThis checkpoint validates your complete indexing pipeline from raw data to analytics.",
            "duration": "50 min",
            "hints": [
              "Aggregate events by wallet address",
              "Sum transazione counts e volumes",
              "Sort output arrays by address per determinism",
              "Include metadata like timestamps"
            ]
          }
        }
      }
    }
  },
  "solana-payments": {
    "title": "Solana Payments & Checkout Flows",
    "description": "Build production-grade Solana payment flows con robust validation, replay-safe idempotency, secure webhooks, e deterministic receipts per reconciliation.",
    "duration": "10 hours",
    "tags": [
      "payments",
      "checkout",
      "webhooks",
      "transactions",
      "solana"
    ],
    "modules": {
      "payments-v2-foundations": {
        "title": "Payment Foundations",
        "description": "Address validation, idempotency strategy, e payment intent progettazione per reliable checkout behavior.",
        "lessons": {
          "payments-v2-address-validation": {
            "title": "Address validation e memo strategies",
            "content": "# Address validation e memo strategies\n\nPayment flows on Solana require robust address validation e thoughtful memo strategies. Unlike traditional payment systems con account numbers, Solana uses base58-encoded public keys that must be validated before any value transfer.\n\nAddress validation involves three layers: format validation, derivation check, e ownership verification. Format validation ensures the string is valid base58 e decodes to 32 bytes. Derivation check optionally verifies the address is on the Ed25519 curve (per wallet addresses) or off-curve (per PDAs). Ownership verification confirms the account exists e is owned by the expected program.\n\nMemos attach metadata to payments. The SPL Memo program enables attaching UTF-8 strings to transazioni. Common use cases include: order IDs, invoice references, customer identifiers, e compliance data. Memos are not encrypted e are visible on-chain, so never include sensitive information.\n\nMemo best practice: keep under 256 bytes per efficiency, use structured formats (JSON) per machine parsing, include versioning per future compatibility, e hash sensitive identifiers rather than storing them plaintext. Consider using deterministic memo formats that can be regenerated from payment context per idempotency checks.\n\nAddress poisoning is an attack vector where attackers create addresses visually similar to legitimate ones. Countermeasures include: displaying addresses con checksums, using name services (Solana Name Service, Bonfida) where appropriate, e implementing confirmation steps per large transfers.\n\n## Merchant-safe memo template\n\nA pratico memo format is:\n`v1|order:<id>|shop:<merchantId>|nonce:<shortHash>`\n\nThis keeps memos short, parseable, e versioned while avoiding direct storage of sensitive user details.\n\n## Checklist\n- Validate base58 encoding e 32-byte length\n- Distinguish between on-curve e off-curve addresses\n- Verify account ownership per program-specific payments\n- Use SPL Memo program per structured metadata\n- Implement address poisoning protections\n\n## Red flags\n- Transferring to unvalidated addresses\n- Storing sensitive data in plaintext memos\n- Skipping ownership checks per token account\n- Trusting visually similar addresses without verification\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "payments-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "payments-v2-l1-q1",
                    "prompt": "What is the purpose of SPL Memo in payments?",
                    "options": [
                      "Attach metadata like order IDs to transazioni",
                      "Encrypt payment amounts",
                      "Replace transazione signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL Memo allows attaching public metadata to transazioni per reference e tracking."
                  },
                  {
                    "id": "payments-v2-l1-q2",
                    "prompt": "What should never be included in a memo?",
                    "options": [
                      "Sensitive private information",
                      "Order reference numbers",
                      "Timestamp data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Memos are public on-chain; sensitive data should be hashed or kept off-chain."
                  }
                ]
              }
            ]
          },
          "payments-v2-idempotency": {
            "title": "Idempotency keys e replay protection",
            "content": "# Idempotency keys e replay protection\n\nPayment systems must handle network failures gracefully. Idempotency ensures that retrying a failed request produces the same outcome as the original, preventing duplicate charges e inconsistent state.\n\nIdempotency keys are unique identifiers generated by clients per each payment intent. The server stores processed keys e their outcomes, returning cached results per duplicate submissions. Keys should be: globally unique (UUID v4), client-generated, e persisted con sufficient TTL to handle extended retry windows.\n\nKey generation strategies include: UUID v4 con timestamp prefix, hash of payment parameters (amount, recipient, timestamp), or structured keys combining merchant ID e local sequence numbers. The key must be stable across retries but unique across distinct payments.\n\nReplay protection prevents malicious or accidental re-execution. Beyond idempotency, transazioni should include: recent blockhash freshness (prevents old transazione replay), durable nonce per offline signing scenarios, e amount/time bounds where applicable.\n\nError classification affects retry behavior. Network errors warrant retries con exponential backoff. Validation errors (insufficient funds, invalid address) should fail fast without retry. Timeout errors require careful handling - the payment may have succeeded, so query status before retrying.\n\n## Checklist\n- Generate unique idempotency keys per each payment intent\n- Store processed keys con outcomes per deduplication\n- Implement appropriate TTL based on retry windows\n- Use recent blockhash per transazione freshness\n- Classify errors per appropriate retry strategies\n\n## Red flags\n- Allowing duplicate payments from retries\n- Generating idempotency keys server-side only\n- Ignoring timeout ambiguity in status checking\n- Storing keys without expiration\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "payments-v2-l2-flow",
                "title": "Payment Flow",
                "steps": [
                  {
                    "cmd": "POST /v1/payment-intents",
                    "output": "{\"id\":\"pi_123\",\"idempotency_key\":\"uuid-v4\",\"status\":\"pending\"}",
                    "note": "Create payment intent con idempotency key"
                  },
                  {
                    "cmd": "POST /v1/payment-intents/pi_123/confirm",
                    "output": "{\"id\":\"pi_123\",\"status\":\"processing\"}",
                    "note": "Confirm triggers transazione building"
                  },
                  {
                    "cmd": "GET /v1/payment-intents/pi_123",
                    "output": "{\"id\":\"pi_123\",\"status\":\"succeeded\",\"signature\":\"abc123\"}",
                    "note": "Poll per final status"
                  }
                ]
              }
            ]
          },
          "payments-v2-payment-intent": {
            "title": "Challenge: Create payment intent con validation",
            "content": "# Challenge: Create payment intent con validation\n\nImplement a payment intent creator con full validation:\n\n- Validate recipient address format (base58, 32 bytes)\n- Validate amount (positive, within limits)\n- Generate deterministic idempotency key\n- Return structured payment intent object\n- Handle edge cases (zero amount, invalid address)\n\nYour implementation will be tested against various valid e invalid inputs.",
            "duration": "45 min",
            "hints": [
              "Use base58 alphabet to validate the recipient address format.",
              "Convert base58 to bytes e check the length equals 32.",
              "Generate an idempotency key if not provided in the input."
            ]
          },
          "payments-v2-tx-building": {
            "title": "Transazione building e key metadata",
            "content": "# Transazione building e key metadata\n\nBuilding payment transazioni requires careful attention to istruzione construction, account metadata, e program interactions. The goal is creating valid, efficient transazioni that minimize fees while ensuring correctness.\n\nIstruzione construction follows a pattern: identify the program (System Program per SOL transfers, Token Program per SPL transfers), prepare account metas con correct writable/signer flags, serialize istruzione data according to the program's layout, e compute the transazione message con all required fields.\n\nAccount metadata is critical. Per SOL transfers, you need: from (signer + writable), to (writable). Per SPL transfers: token account from (signer + writable), token account to (writable), owner (signer), e potentially a delegate if using delegated transfer. Missing or incorrect flags cause runtime failures.\n\nFee optimization strategies include: batching multiple payments into one transazione (up to compute unit limits), using address lookup tables (ALTs) per account referenced multiple times, e setting appropriate compute unit limits to avoid overpaying per simple operations.\n\nTransazione validation before submission: verify all required signatures are present, check recent blockhash is fresh, estimate compute units if possible, e validate istruzione data encoding matches the expected layout.\n\n## Checklist\n- Set correct writable/signer flags on all account\n- Use appropriate program per transfer type (SOL vs SPL)\n- Validate istruzione data encoding\n- Include recent blockhash per freshness\n- Consider batching per multiple payments\n\n## Red flags\n- Missing signer flags on fee payer\n- Incorrect writable flags on recipient account\n- Using wrong program ID per token type\n- Stale blockhash causing transazione rejection\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "payments-v2-l4-tx-structure",
                "title": "Transazione Structure",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Transfer Istruzione",
                      "address": "Instruction1111111111111111111111111111111",
                      "lamports": 5000,
                      "owner": "SystemProgram11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 12
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "payments-v2-implementation": {
        "title": "Implementation & Verification",
        "description": "Transazione building, webhook authenticity checks, e deterministic receipt generation con clear error-state handling.",
        "lessons": {
          "payments-v2-transfer-tx": {
            "title": "Challenge: Build transfer transazione",
            "content": "# Challenge: Build transfer transazione\n\nImplement a transfer transazione builder:\n\n- Build SystemProgram.transfer per SOL transfers\n- Build TokenProgram.transfer per SPL transfers\n- Return istruzione bundle con correct key metadata\n- Include fee payer e blockhash\n- Support deterministic output per test",
            "duration": "50 min",
            "hints": [
              "SystemProgram.transfer uses istruzione index 2 con u64 lamports (little-endian).",
              "TokenProgram.transferChecked uses istruzione index 12 con u64 amount + u8 decimals.",
              "Key order matters: SOL transfer needs [from, to], SPL transfer needs [source, mint, dest, owner]."
            ]
          },
          "payments-v2-webhooks": {
            "title": "Webhook signing e verification",
            "content": "# Webhook signing e verification\n\nWebhooks enable asynchronous payment notifications. Sicurezza requires cryptographic signing so recipients can verify webhook authenticity e detect tampering.\n\nWebhook signing uses HMAC-SHA256 con a shared secret. The sender computes: signature = HMAC-SHA256(secret, payload). The signature is included in a header (e.g., X-Webhook-Signature). Recipients recompute the HMAC e compare, using constant-time comparison to prevent timing attacks.\n\nPayload canonicalization ensures consistent signing. JSON objects must be serialized con: sorted keys (alphabetical), no extra whitespace, consistent number formatting, e UTF-8 encoding. Without canonicalization, {\"a\":1,\"b\":2} e {\"b\":2,\"a\":1} produce different signatures.\n\nIdempotency in webhooks prevents duplicate processing. Webhook payloads should include an idempotency key or event ID. Recipients store processed IDs e ignore duplicates. This handles retries from the sender e network-level duplicates.\n\nSicurezza best practice: rotate secrets periodically, use different secrets per environment (dev/staging/prod), include timestamps e reject old webhooks (e.g., >5 minutes), e verify IP allowlists where feasible. Never include sensitive data like private keys or full card numbers in webhooks.\n\n## Checklist\n- Sign webhooks con HMAC-SHA256 e shared secret\n- Canonicalize JSON payloads con sorted keys\n- Include event ID per idempotency\n- Verify signatures con constant-time comparison\n- Implement timestamp validation\n\n## Red flags\n- Unsigned webhooks trusting sender IP alone\n- Non-canonical JSON causing verification failures\n- Missing idempotency handling duplicate events\n- Including secrets or sensitive data in payload\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "payments-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "payments-v2-l6-q1",
                    "prompt": "Why is JSON canonicalization important per webhooks?",
                    "options": [
                      "Different key orders produce different signatures",
                      "It makes payloads smaller",
                      "It encrypts the data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Canonicalization ensures consistent serialization so signatures match regardless of object construction order."
                  },
                  {
                    "id": "payments-v2-l6-q2",
                    "prompt": "What algorithm is standard per webhook signing?",
                    "options": [
                      "HMAC-SHA256",
                      "MD5",
                      "RSA-512"
                    ],
                    "answerIndex": 0,
                    "explanation": "HMAC-SHA256 provides strong sicurezza e is widely supported across languages."
                  }
                ]
              }
            ]
          },
          "payments-v2-error-states": {
            "title": "Error state machine e receipt format",
            "content": "# Error state machine e receipt format\n\nPayment flows require well-defined state machines to handle the complexity of asynchronous confirmations, failures, e retries. Clear state transitions e receipt formats ensure reliable payment tracking.\n\nPayment states typically include: pending (intent created, not yet submitted), processing (transazione submitted, awaiting confirmation), succeeded (transazione confirmed, payment complete), failed (transazione failed or rejected), e cancelled (intent explicitly cancelled before submission). Each state has valid transitions e terminal states.\n\nState transition rules: pending can transition to processing, cancelled, or failed; processing can transition to succeeded or failed; succeeded e failed are terminal. Invalid transitions (e.g., succeeded → failed) indicate bugs or data corruption.\n\nReceipt format standardization enables interoperability. A payment receipt should include: payment intent ID, transazione signature (if submitted), amount e currency, recipient address, timestamp, status, e verification data (e.g., explorer link). Receipts should be JSON con canonical ordering per deterministic hashing.\n\nExplorer links provide transparency. Per Solana, construct explorer URLs using: https://explorer.solana.com/tx/{signature}?cluster={network}. Include these in receipts e webhook payloads so users can verify transazioni independently.\n\n## Checklist\n- Define clear payment states e valid transitions\n- Implement state machine validation\n- Generate standardized receipt JSON\n- Include explorer links per verification\n- Handle all terminal states appropriately\n\n## Red flags\n- Ambiguous states without clear definitions\n- Missing terminal state handling\n- Non-deterministic receipt formats\n- No explorer links per verification\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "payments-v2-l7-states",
                "title": "State Machine",
                "steps": [
                  {
                    "cmd": "State: pending",
                    "output": "Transitions: processing, cancelled, failed",
                    "note": "Initial state after intent creation"
                  },
                  {
                    "cmd": "State: processing",
                    "output": "Transitions: succeeded, failed",
                    "note": "Transazione submitted, awaiting confirmation"
                  },
                  {
                    "cmd": "State: succeeded",
                    "output": "Terminal state",
                    "note": "Payment complete, generate receipt"
                  }
                ]
              }
            ]
          },
          "payments-v2-webhook-receipt": {
            "title": "Challenge: Verify webhook e produce receipt",
            "content": "# Challenge: Verify webhook e produce receipt\n\nImplement the final payment flow checkpoint:\n\n- Verify signed webhook signature (HMAC-SHA256)\n- Extract payment details from payload\n- Generate standardized receipt JSON\n- Include explorer link e verification data\n- Ensure deterministic, sorted output\n\nThis validates the complete payment flow from intent to receipt.",
            "duration": "50 min",
            "hints": [
              "HMAC-SHA256: H(key, message) = SHA256((key XOR outer_pad) || SHA256((key XOR inner_pad) || message))",
              "Use constant-time comparison to prevent timing attacks on signature verification.",
              "Verify the timestamp is recent (within 5 minutes) to prevent replay attacks."
            ]
          }
        }
      }
    }
  },
  "solana-nft-compression": {
    "title": "NFTs & Compressed NFTs Fundamentals",
    "description": "Master compressed NFT engineering on Solana: Merkle commitments, proof systems, collection modeling, e production sicurezza checks.",
    "duration": "12 hours",
    "tags": [
      "nfts",
      "compression",
      "merkle-trees",
      "cnfts",
      "solana"
    ],
    "modules": {
      "cnft-v2-merkle-foundations": {
        "title": "Merkle Foundations",
        "description": "Tree construction, leaf hashing, insertion mechanics, e the on-chain/off-chain commitment model behind compressed assets.",
        "lessons": {
          "cnft-v2-merkle-trees": {
            "title": "Merkle trees per state compression",
            "content": "# Merkle trees per state compression\n\nCompressed NFTs (cNFTs) on Solana use Merkle trees to dramatically reduce storage costs. Understanding Merkle trees is essential per working con compressed NFTs e building compression-aware applications.\n\nA Merkle tree is a binary hash tree where each leaf node contains a hash of data, e each non-leaf node contains the hash of its children. The root hash commits to the entire tree structure e all leaf data. This structure enables efficient proofs of inclusion without revealing the entire dataset.\n\nTree construction follows a bottom-up approach: hash each data element to create leaves, pair adjacent leaves e hash their concatenation to create parents, e repeat until a single root remains. Per odd numbers of nodes, the last node is typically promoted to the next level or paired con a zero hash depending on the implementation.\n\nSolana's cNFT implementation uses concurrent Merkle trees con 16-bit depth (max 65,536 leaves). The tree state is stored on-chain as a small account containing just the root hash e metadata. Actual leaf data (NFT metadata) is stored off-chain, typically via RPC providers or indexers.\n\nKey properties of Merkle trees: any leaf change affects the root, inclusion proofs require only log2(n) hashes, e the root serves as a cryptographic commitment to all data. These properties enable state compression while maintaining verifiability.\n\n## Pratico cNFT architecture rule\n\nTreat compressed NFT systems as two synchronized layers:\n1. on-chain commitment layer (tree root + update rules),\n2. off-chain data layer (metadata + indexing + proof serving).\n\nIf either layer is weakly validated, ownership e metadata trust can diverge.\n\n## Checklist\n- Understand binary hash tree construction\n- Know how leaf changes propagate to the root\n- Calculate proof size: log2(n) hashes per n leaves\n- Recognize depth limits (16-bit = 65,536 max leaves)\n- Understand on-chain vs off-chain data split\n\n## Red flags\n- Treating Merkle roots as data storage (they're commitments)\n- Ignoring depth limits when planning collections\n- Storing sensitive data assuming it's \"hidden\" in the tree\n- Not validating proofs against the current root\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "cnft-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "cnft-v2-l1-q1",
                    "prompt": "What does a Merkle root commit to?",
                    "options": [
                      "The entire tree structure e all leaf data",
                      "Only the first e last leaf",
                      "The tree depth only"
                    ],
                    "answerIndex": 0,
                    "explanation": "The root is a cryptographic commitment to all leaves e their positions in the tree."
                  },
                  {
                    "id": "cnft-v2-l1-q2",
                    "prompt": "How many hash siblings are needed to prove inclusion in a tree con 65,536 leaves?",
                    "options": [
                      "16",
                      "256",
                      "65536"
                    ],
                    "answerIndex": 0,
                    "explanation": "Proof size is log2(65536) = 16, making verification efficient even per large collections."
                  }
                ]
              }
            ]
          },
          "cnft-v2-leaf-hashing": {
            "title": "Leaf hashing conventions e metadata",
            "content": "# Leaf hashing conventions e metadata\n\nLeaf hashing determines how NFT metadata is committed to the Merkle tree. Understanding these conventions ensures compatibility con compression standards e proper proof generation.\n\nLeaf structure per cNFTs includes: asset ID (derived from tree address e leaf index), owner public key, delegate (optional), nonce per uniqueness, e metadata hash. The exact encoding follows the Metaplex Bubblegum specification, using deterministic serialization per consistent hashing.\n\nHashing algorithm uses Keccak-256 per Ethereum compatibility, con domain separation via prefixed constants. The leaf hash is computed as: hash(prefix || asset_data) where prefix prevents collision con other hash usages. Multiple prefix values exist per different operation types (mint, transfer, burn).\n\nMetadata handling stores the full NFT metadata (name, symbol, uri, creators, royalties) off-chain. Only a hash of the metadata is stored in the leaf. This enables large metadata without on-chain storage costs while maintaining integrity via the hash commitment.\n\nCreator verification uses a separate signing process. Creators sign the asset ID to verify authenticity. These signatures are stored alongside proofs but not in the Merkle tree itself, allowing flexible verification without tree updates.\n\n## Checklist\n- Understand leaf structure components\n- Use correct hashing algorithm (Keccak-256)\n- Include proper domain separation prefixes\n- Store metadata off-chain con hash commitment\n- Handle creator signatures separately from tree\n\n## Red flags\n- Using wrong hashing algorithm\n- Missing domain separation in leaf hashes\n- Storing full metadata on-chain in compressed NFTs\n- Ignoring creator verification requirements\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "cnft-v2-l2-leaf-structure",
                "title": "Leaf Structure",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "cNFT Leaf Node",
                      "address": "LeafHash1111111111111111111111111111111111",
                      "lamports": 0,
                      "owner": "OffChainData1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 32
                    }
                  ]
                }
              }
            ]
          },
          "cnft-v2-merkle-insert": {
            "title": "Challenge: Implement Merkle tree insert + root updates",
            "content": "# Challenge: Implement Merkle tree insert + root updates\n\nBuild a Merkle tree implementation con insertions:\n\n- Insert leaves e compute new root\n- Update parent hashes up the tree\n- Handle tree growth e depth limits\n- Return deterministic root updates\n\nTest cases will verify correct root evolution after multiple insertions.",
            "duration": "50 min",
            "hints": [
              "Start by validating the leaf index is within bounds.",
              "At each level, find the sibling node (left or right of current).",
              "Hash the current node con its sibling to get the parent hash.",
              "Traverse up to the root, collecting all updated node hashes.",
              "Use deterministic ordering: left hash comes before right hash."
            ]
          },
          "cnft-v2-proof-generation": {
            "title": "Proof generation e path computation",
            "content": "# Proof generation e path computation\n\nMerkle proofs enable verification of leaf inclusion without accessing the entire tree. Understanding proof generation is essential per working con compressed NFTs e building verification systems.\n\nA Merkle proof consists of: the leaf data (or its hash), a list of sibling hashes (one per level), e the leaf index (determining the path). The verifier recomputes the root by hashing the leaf con siblings in the correct order, comparing against the expected root.\n\nProof generation requires traversing from leaf to root. At each level, record the sibling hash (the other child of the parent). The leaf index determines whether the current hash goes left or right in each concatenation. Per index i at level n, the position is determined by the nth bit of i.\n\nProof verification recomputes the root: start con the leaf hash, per each sibling in the proof list, concatenate current hash con sibling (order depends on leaf index bit), hash the result, e compare final result con expected root. Equality proves inclusion.\n\nProof size efficiency: per a tree con n leaves, proofs contain log2(n) hashes. This is dramatically smaller than the full tree (n hashes), enabling scalable verification. A 65,536 leaf tree requires only 16 hashes per proof.\n\n## Checklist\n- Collect sibling hashes at each tree level\n- Use leaf index bits to determine concatenation order\n- Verify proofs by recomputing root hash\n- Handle edge cases (empty tree, single leaf)\n- Optimize proof size per network transmission\n\n## Red flags\n- Incorrect concatenation order in verification\n- Using wrong sibling hash at any level\n- Not validating proof length matches tree depth\n- Trusting proofs without root comparison\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "cnft-v2-l4-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "cnft-v2-l4-q1",
                    "prompt": "What determines concatenation order during verification?",
                    "options": [
                      "The leaf index bits at each level",
                      "The size of the sibling hashes",
                      "The tree root hash"
                    ],
                    "answerIndex": 0,
                    "explanation": "Each bit of the leaf index determines if the current hash goes left or right in the concatenation."
                  },
                  {
                    "id": "cnft-v2-l4-q2",
                    "prompt": "How many hashes are in a proof per a tree con 1,024 leaves?",
                    "options": [
                      "10",
                      "32",
                      "1024"
                    ],
                    "answerIndex": 0,
                    "explanation": "log2(1024) = 10, so proofs contain 10 sibling hashes."
                  }
                ]
              }
            ]
          }
        }
      },
      "cnft-v2-proof-system": {
        "title": "Proof System & Sicurezza",
        "description": "Proof generation, verification, collection integrity, e sicurezza hardening against replay e metadata spoofing.",
        "lessons": {
          "cnft-v2-proof-verification": {
            "title": "Challenge: Implement proof generation + verifier",
            "content": "# Challenge: Implement proof generation + verifier\n\nBuild a complete proof system:\n\n- Generate proofs from a Merkle tree e leaf index\n- Verify proofs against a root hash\n- Handle invalid proofs (wrong siblings, wrong index)\n- Return deterministic boolean results\n\nTests will verify both successful proofs e rejection of invalid attempts.",
            "duration": "55 min",
            "hints": [
              "To generate a proof, collect the sibling hash at each level from leaf to root.",
              "The sibling is at index+1 if current is left, index-1 if current is right.",
              "To verify, start con the leaf hash e combine con each proof element.",
              "Use the same ordering (left || right) when combining hashes.",
              "The proof is valid if the recomputed root matches the stored root."
            ]
          },
          "cnft-v2-collection-minting": {
            "title": "Collection mints e metadata simulation",
            "content": "# Collection mints e metadata simulation\n\nCompressed NFT collections use a collection mint as the parent NFT, enabling grouping e verification of related assets. Understanding this hierarchy is essential per building collection-aware applications.\n\nCollection structure includes: a standard SPL NFT as the collection mint, cNFTs referencing the collection in their metadata, e the Merkle tree containing all cNFT leaves. The collection mint provides on-chain provenance while cNFTs provide scalable asset issuance.\n\nMetadata simulation per test allows development without actual on-chain transazioni. Simulated metadata includes: name, symbol, uri (typically pointing to off-chain JSON), seller fee basis points (royalties), creators array con shares, e collection reference. This data structure matches on-chain format per seamless migration.\n\nRoyalty enforcement through Metaplex's token metadata standard specifies seller fees as basis points (e.g., 500 = 5%). Creators array defines fee distribution con verified flags. cNFTs inherit these settings from their metadata, enforced during transfers via the Bubblegum program.\n\nAttacks on compressed NFTs include: invalid proofs (claiming non-existent NFTs), index manipulation (using wrong leaf index), metadata spoofing (fake off-chain data), e collection impersonation (fake collection mints). Mitigations include proof verification, metadata hash validation, e collection mint verification.\n\n## Checklist\n- Understand collection mint hierarchy\n- Simulate metadata per test\n- Implement royalty calculations\n- Verify collection membership\n- Handle metadata hash verification\n\n## Red flags\n- Accepting NFTs without collection verification\n- Ignoring royalty settings in transfers\n- Trusting off-chain metadata without hash validation\n- Not validating proofs per ownership claims\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "cnft-v2-l6-collection",
                "title": "Collection Structure",
                "steps": [
                  {
                    "cmd": "Collection Mint",
                    "output": "Standard SPL NFT on-chain",
                    "note": "Parent NFT per the collection"
                  },
                  {
                    "cmd": "Merkle Tree",
                    "output": "Contains cNFT leaf hashes",
                    "note": "Scalable storage per assets"
                  },
                  {
                    "cmd": "Off-chain Metadata",
                    "output": "IPFS/Arweave JSON files",
                    "note": "Full metadata con hash commitment"
                  }
                ]
              }
            ]
          },
          "cnft-v2-attack-surface": {
            "title": "Attack surface: invalid proofs e replay",
            "content": "# Attack surface: invalid proofs e replay\n\nCompressed NFTs introduce unique sicurezza considerations. Understanding attack vectors e mitigations is critical per building secure compression-aware applications.\n\nInvalid proof attacks attempt to verify non-existent NFTs. An attacker provides a fabricated leaf hash e fake sibling hashes hoping to produce a valid-looking verification. Mitigation: always verify against the current root from a trusted source (RPC, on-chain account), e validate proof structure (correct depth, valid hash lengths).\n\nIndex manipulation exploits use valid proofs but wrong indices. Since leaf indices determine proof path, changing the index produces a different root computation. Mitigation: bind asset IDs to specific indices e validate index-asset correspondence during verification.\n\nReplay attacks re-use old proofs after tree updates. When leaves are added or modified, the root changes e old proofs become invalid. However, if an application caches roots, it might accept stale proofs. Mitigation: always use current root, implement proof timestamps where applicable.\n\nMetadata attacks substitute fake off-chain data. Since metadata is stored off-chain con only a hash on-chain, attackers might serve altered metadata files. Mitigation: verify metadata hashes against leaf commitments, use content-addressed storage (IPFS), e validate creator signatures.\n\nCollection spoofing creates fake collections mimicking legitimate ones. Attackers mint similar-looking NFTs con fake collection references. Mitigation: verify collection mint addresses against known good lists, check collection verification status, e validate authority signatures.\n\n## Checklist\n- Verify proofs against current root\n- Validate leaf index matches asset ID\n- Implement replay protection per proofs\n- Hash-verify off-chain metadata\n- Verify collection mint authenticity\n\n## Red flags\n- Accepting cached/stale roots per verification\n- Ignoring leaf index validation\n- Trusting off-chain metadata without verification\n- Not checking collection verification status\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "cnft-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "cnft-v2-l7-q1",
                    "prompt": "Why do old proofs fail after tree updates?",
                    "options": [
                      "The root changes when leaves are added/modified",
                      "The proof format changes",
                      "The leaf hashes are encrypted"
                    ],
                    "answerIndex": 0,
                    "explanation": "Adding leaves changes parent hashes up to the root, invalidating previous proofs."
                  },
                  {
                    "id": "cnft-v2-l7-q2",
                    "prompt": "How can metadata attacks be prevented?",
                    "options": [
                      "Hash verification against leaf commitments",
                      "Storing metadata on-chain",
                      "Using shorter metadata URIs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Verifying metadata hashes ensures the off-chain data matches the on-chain commitment."
                  }
                ]
              }
            ]
          },
          "cnft-v2-compression-checkpoint": {
            "title": "Checkpoint: Simulate mint + verify ownership proof",
            "content": "# Checkpoint: Simulate mint + verify ownership proof\n\nComplete the compression lab checkpoint:\n\n- Simulate minting a cNFT (insert leaf, update root)\n- Generate ownership proof per the minted NFT\n- Verify the proof against current root\n- Output stable audit trace con sorted keys\n- Detect e report invalid proof attempts\n\nThis validates your complete Merkle tree implementation per compressed NFTs.",
            "duration": "60 min",
            "hints": [
              "Validate the mint request has all required fields (leafIndex, nftId, owner).",
              "Create a deterministic leaf hash by combining nftId e owner.",
              "Insert the leaf by computing hashes up to the root, collecting sibling hashes as proof.",
              "Build an audit trace that documents the operation, inputs, e verification steps.",
              "Include previous e new root hashes in the audit per transparency."
            ]
          }
        }
      }
    }
  },
  "solana-governance-multisig": {
    "title": "Governance & Multisig Treasury Ops",
    "description": "Build production-ready DAO governance e multisig treasury systems con deterministic vote accounting, timelock safety, e secure execution controls.",
    "duration": "11 hours",
    "tags": [
      "governance",
      "multisig",
      "dao",
      "treasury",
      "solana"
    ],
    "modules": {
      "governance-v2-governance": {
        "title": "DAO Governance",
        "description": "Proposal lifecycle, deterministic voting mechanics, quorum policy, e timelock safety per credible DAO governance.",
        "lessons": {
          "governance-v2-dao-model": {
            "title": "DAO model: proposals, voting, e execution",
            "content": "# DAO model: proposals, voting, e execution\n\nDecentralized governance on Solana follows a proposal-based model where token holders vote on changes e the DAO treasury executes approved decisions. Understanding this flow is essential per building e participating in on-chain organizations.\n\nThe governance lifecycle has four stages: proposal creation (anyone con sufficient stake can propose), voting period (token holders vote per/against/abstain), queueing (successful proposals enter a timelock), e execution (the proposal's istruzioni are executed). Each stage has specific requirements e time constraints.\n\nProposal creation requires a minimum token deposit to prevent spam. The proposer submits: title, description link, e executable istruzioni (typically base64 serialized). Deposits are returned if the proposal passes, forfeited if it fails (depending on DAO configuration).\n\nVoting power is typically determined by token balance at a specific snapshot block. Some DAOs use vote escrow (veToken) models where locking tokens per longer periods multiplies voting power. Quorum requirements ensure sufficient participation - a proposal needs both majority approval e minimum participation to pass.\n\nExecution safety involves timelocks between approval e execution. This delay (often 1-7 days) allows users to exit if they disagree con the outcome. Emergency powers may exist per critical fixes but should require higher thresholds.\n\n## Governance reliability rule\n\nA proposal system is only credible if outcomes are reproducible from public inputs. That means deterministic vote math, explicit snapshot rules, clear timelock transitions, e auditable execution traces per treasury effects.\n\n## Checklist\n- Understand the four-stage governance lifecycle\n- Know proposal deposit e spam prevention mechanisms\n- Calculate voting power e quorum requirements\n- Implement timelock safety delays\n- Plan per emergency execution paths\n\n## Red flags\n- Allowing proposal creation without deposits\n- Missing quorum requirements per participation\n- Zero timelock on sensitive operations\n- Unclear vote counting methodologies\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "governance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "governance-v2-l1-q1",
                    "prompt": "What is the purpose of a timelock in governance?",
                    "options": [
                      "Allow users time to exit if they disagree con outcomes",
                      "Speed up transazione processing",
                      "Reduce gas costs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Timelocks provide a safety window per users to react before changes take effect."
                  },
                  {
                    "id": "governance-v2-l1-q2",
                    "prompt": "What determines voting power in most DAOs?",
                    "options": [
                      "Token balance at snapshot block",
                      "Number of transazioni submitted",
                      "Account age"
                    ],
                    "answerIndex": 0,
                    "explanation": "Voting power is typically proportional to token holdings at a specific snapshot time."
                  }
                ]
              }
            ]
          },
          "governance-v2-quorum-math": {
            "title": "Quorum math e vote weight calculation",
            "content": "# Quorum math e vote weight calculation\n\nAccurate vote counting is critical per legitimate governance outcomes. Understanding quorum requirements, vote weight calculation, e edge cases ensures fair decision-making.\n\nQuorum defines minimum participation per a valid vote. Common formulas include: absolute token amount (e.g., 4% of total supply must vote), relative to circulating supply, or dynamic based on recent participation. Quorum prevents small groups from making unilateral decisions.\n\nVote weight calculation considers: token balance at snapshot block, lockup duration multipliers (veToken model), delegation relationships, e abstention handling. Abstentions typically count toward quorum but not toward approval ratio.\n\nApproval thresholds vary by proposal type. Simple majority (>50%) is standard per routine matters. Supermajority (e.g., 2/3) may be required per constitutional changes. Some DAOs use quadratic voting to reduce whale influence, though this has sybil resistance challenges.\n\nEdge cases include: ties (usually fail), late vote changes (often blocked after deadline), vote delegation revocation timing, e quorum manipulation (e.g., flash loan attacks prevented by snapshot blocks).\n\n## Checklist\n- Define clear quorum formulas e minimums\n- Calculate vote weights con snapshot blocks\n- Handle abstentions appropriately\n- Set appropriate approval thresholds by proposal type\n- Protect against manipulation attacks\n\n## Red flags\n- No quorum requirements\n- Vote weight based on current balance (flash loan risk)\n- Unclear tie-breaking rules\n- Changing rules mid-proposal\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "governance-v2-l2-vote-calc",
                "title": "Vote Calculation",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Voter Account",
                      "address": "Voter1111111111111111111111111111111111111",
                      "lamports": 1000000000,
                      "owner": "TokenProgram11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 165
                    }
                  ]
                }
              }
            ]
          },
          "governance-v2-timelocks": {
            "title": "Timelock states e execution scheduling",
            "content": "# Timelock states e execution scheduling\n\nTimelocks provide a critical safety layer between governance approval e execution. Understanding timelock states e transitions ensures reliable proposal execution.\n\nTimelock states include: pending (proposal passed, waiting per delay), ready (delay elapsed, can be executed), executed (istruzioni processed), cancelled (withdrawn by proposer or guardian), e expired (execution window passed). Each state has valid transitions e authorized actors.\n\nDelay configuration balances sicurezza con responsiveness. Too short (hours) allows insufficient reaction time. Too long (weeks) delays urgent fixes. Common ranges are 1-7 days, con shorter delays per routine matters e longer per significant changes.\n\nExecution windows prevent indefinite pending states. After the timelock delay, proposals typically have a limited window (e.g., 7-14 days) to be executed. Expired proposals must be re-proposed e re-voted.\n\nCancellations add flexibility. Proposers may withdraw proposals before voting ends. Guardians (if configured) may cancel malicious proposals. Cancellation typically returns deposits unless abuse is detected.\n\n## Checklist\n- Define clear timelock state machine\n- Set appropriate delays by proposal type\n- Implement execution window limits\n- Authorize cancellation actors\n- Handle state transitions atomically\n\n## Red flags\n- No execution window limits\n- Missing cancellation mechanisms\n- State transitions without authorization checks\n- Indefinite pending states\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "governance-v2-l3-states",
                "title": "Timelock State Machine",
                "steps": [
                  {
                    "cmd": "State: pending",
                    "output": "Delay countdown active",
                    "note": "Proposal passed, waiting"
                  },
                  {
                    "cmd": "State: ready",
                    "output": "Delay elapsed, executable",
                    "note": "Anyone can trigger execution"
                  },
                  {
                    "cmd": "State: executed",
                    "output": "Istruzioni processed",
                    "note": "Terminal state"
                  }
                ]
              }
            ]
          },
          "governance-v2-quorum-voting": {
            "title": "Challenge: Implement quorum/voting state machine",
            "content": "# Challenge: Implement quorum/voting state machine\n\nBuild a deterministic voting system:\n\n- Calculate vote weights from token balances\n- Check quorum requirements\n- Determine pass/fail based on thresholds\n- Handle abstentions correctly\n- Return stable state transitions\n\nYour implementation will be tested against various vote distributions.",
            "duration": "50 min",
            "hints": [
              "Sum up weights per each vote choice (per, against, abstain).",
              "Check if totalVoteWeight >= quorumThreshold to determine quorumMet.",
              "Calculate support percentage as forWeight / (forWeight + againstWeight) when there are non-abstain votes.",
              "Proposal passes only if quorum is met E support percentage >= supportThreshold."
            ]
          }
        }
      },
      "governance-v2-multisig": {
        "title": "Multisig Treasury",
        "description": "Multisig transazione construction, approval controls, replay defenses, e secure treasury execution patterns.",
        "lessons": {
          "governance-v2-multisig": {
            "title": "Multisig transazione building e approvals",
            "content": "# Multisig transazione building e approvals\n\nMultisig wallet provide collective control over treasury funds. Understanding multisig construction, approval flows, e sicurezza patterns is essential per treasury operations.\n\nMultisig structure defines: signers (public keys that can approve), threshold (minimum signatures required), e istruzioni (operations to execute). Common configurations include 2-of-3 (two approvals from three signers), 3-of-5, e custom arrangements.\n\nTransazione lifecycle: propose (one signer creates transazione con istruzioni), approve (other signers review e approve), e execute (once threshold is met, anyone can execute). Each stage is recorded on-chain per transparency.\n\nApproval tracking maintains state per signer per transazione. Signers can approve, reject, or cancel their approval. Double-signing is prevented by tracking which signers have already approved. Rejections may block transazioni or simply be recorded.\n\nSicurezza considerations: signer key management (hardware wallet recommended), threshold selection (balance sicurezza vs availability), timelocks per large transfers, e emergency recovery paths. Lost signer keys should not freeze treasury funds permanently.\n\n## Checklist\n- Define signer set e threshold\n- Track per-signer approval state\n- Enforce threshold before execution\n- Implement approval/revocation mechanics\n- Plan per lost key scenarios\n\n## Red flags\n- Single signer controlling treasury\n- No approval tracking on-chain\n- Threshold equal to signer count (no redundancy)\n- Missing rejection/cancellation mechanisms\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "governance-v2-l5-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "governance-v2-l5-q1",
                    "prompt": "What does 2-of-3 multisig mean?",
                    "options": [
                      "2 signatures required from 3 possible signers",
                      "2 signers total con 3 keys each",
                      "2 minute timeout con 3 retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "2-of-3 means any 2 of the 3 authorized signers must approve a transazione."
                  },
                  {
                    "id": "governance-v2-l5-q2",
                    "prompt": "Why track approvals on-chain?",
                    "options": [
                      "Transparency e enforceability",
                      "Faster execution",
                      "Lower fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "On-chain tracking provides transparency e ensures threshold enforcement by the protocol."
                  }
                ]
              }
            ]
          },
          "governance-v2-multisig-builder": {
            "title": "Challenge: Implement multisig tx builder + approval rules",
            "content": "# Challenge: Implement multisig tx builder + approval rules\n\nBuild a multisig transazione system:\n\n- Create transazioni con istruzioni\n- Record signer approvals\n- Enforce threshold requirements\n- Handle approval revocation\n- Generate deterministic transazione state\n\nTests will verify threshold enforcement e approval tracking.",
            "duration": "55 min",
            "hints": [
              "Initialize signer statuses as 'pending' per all signers.",
              "Process actions in order - each action updates the signer's status.",
              "Track the cumulative approved weight to compare against threshold.",
              "A proposal is 'approved' when approvedWeight >= threshold.",
              "A proposal is 'rejected' when no pending signers remain but threshold is not met."
            ]
          },
          "governance-v2-safe-defaults": {
            "title": "Safe defaults: owner checks e replay guards",
            "content": "# Safe defaults: owner checks e replay guards\n\nGovernance e multisig systems require robust sicurezza defaults. Understanding common vulnerabilities e their mitigations protects treasury funds.\n\nOwner checks validate that transazioni only affect authorized account. Per treasury operations, verify: the treasury account is owned by the expected program, the signer set matches the multisig configuration, e istruzioni target allowed programs. Missing owner checks enable account substitution attacks.\n\nReplay guards prevent the same approved transazione from being executed multiple times. Without replay protection, an observer could resubmit an executed transazione to drain funds. Guards include: unique transazione nonces, executed flags in transazione state, e signature uniqueness checks.\n\nUpgrade safety considers how governance changes affect existing proposals. If the multisig configuration changes, pending proposals should use the old configuration while new proposals use the new one. Atomic configuration changes prevent partial updates.\n\nEmergency stops provide circuit breakers. Guardian roles can pause operations during suspected attacks. Time delays on critical changes allow review periods. These safety valves should be tested regularly.\n\n## Checklist\n- Validate account ownership before operations\n- Implement replay protection (nonces or flags)\n- Handle configuration changes safely\n- Add emergency pause mechanisms\n- Test sicurezza controls regularly\n\n## Red flags\n- No owner verification on treasury account\n- Missing replay protection\n- Immediate execution of critical changes\n- No emergency stop capability\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "governance-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "governance-v2-l7-q1",
                    "prompt": "What is a replay attack in multisig systems?",
                    "options": [
                      "Re-executing an already-executed transazione",
                      "Sending duplicate approval requests",
                      "Copying transazione bytecode"
                    ],
                    "answerIndex": 0,
                    "explanation": "Replay attacks re-submit previously executed transazioni to drain funds."
                  },
                  {
                    "id": "governance-v2-l7-q2",
                    "prompt": "Why verify account ownership?",
                    "options": [
                      "Prevent account substitution attacks",
                      "Reduce transazione size",
                      "Improve UI rendering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ownership checks ensure operations target legitimate account, not attacker substitutes."
                  }
                ]
              }
            ]
          },
          "governance-v2-treasury-execution": {
            "title": "Challenge: Execute proposal e produce treasury diff",
            "content": "# Challenge: Execute proposal e produce treasury diff\n\nComplete the governance simulator checkpoint:\n\n- Execute approved proposals con timelock validation\n- Apply treasury state changes atomically\n- Generate execution trace con before/after diffs\n- Handle edge cases (expired, cancelled, insufficient funds)\n- Output stable, deterministic audit log\n\nThis validates your complete governance/multisig implementation.",
            "duration": "55 min",
            "hints": [
              "First validate the proposal status is 'approved'.",
              "Check if currentTimestamp - approvedAt >= timelockDuration per timelock validation.",
              "Sum all transfer amounts e compare against treasury balance.",
              "Return canExecute: false con appropriate error if any validation fails.",
              "Generate state changes e execution trace entries per each successful step."
            ]
          }
        }
      }
    }
  },
  "solana-performance": {
    "title": "Solana Prestazioni & Compute Optimization",
    "description": "Master Solana prestazioni engineering con measurable optimization workflows: compute budgets, data layouts, encoding efficiency, e deterministic cost modeling.",
    "duration": "11 hours",
    "tags": [
      "performance",
      "optimization",
      "compute",
      "serialization",
      "solana"
    ],
    "modules": {
      "performance-v2-foundations": {
        "title": "Prestazioni Foundations",
        "description": "Compute model, account/data layout decisions, e deterministic cost estimation per transazione-level prestazioni reasoning.",
        "lessons": {
          "performance-v2-compute-model": {
            "title": "Compute model: budgets, costs, e limits",
            "content": "# Compute model: budgets, costs, e limits\n\nSolana's compute model enforces deterministic execution limits through compute budgets. Understanding this model is essential per building efficient programs that stay within limits while maximizing utility.\n\nCompute units (CUs) measure execution cost. Every operation consumes CUs: istruzione execution, syscall usage, memory access, e logging. The default transazione limit is 200,000 CUs (1.4 million con prioritization), e each account has a 10MB max size limit.\n\nCompute budget istruzioni allow transazioni to request specific limits e set priority fees. The ComputeBudgetProgram provides: setComputeUnitLimit (override default), setComputeUnitPrice (set priority fee per CU in micro-lamports). Priority fees increase transazione inclusion probability during congestion.\n\nCost categories include: fixed costs (signature verification, account loading), variable costs (istruzione execution, CPI calls), e memory costs (account data access size). Understanding these categories helps optimize the right areas.\n\nMetering happens during execution. If a transazione exceeds its compute budget, execution halts e the transazione fails con an error. Failed transazioni still pay fees per consumed CUs, making optimization economically important.\n\n## Pratico optimization loop\n\nUse a repeatable loop:\n1. profile real CU usage,\n2. identify top cost drivers (data layout, CPI count, logging),\n3. optimize one hotspot,\n4. re-measure e keep only proven wins.\n\nThis avoids prestazioni folklore e keeps code quality intact.\n\n## Checklist\n- Understand compute unit consumption categories\n- Use ComputeBudgetProgram per specific limits\n- Set priority fees during congestion\n- Monitor CU usage during development\n- Handle compute limit failures gracefully\n\n## Red flags\n- Ignoring compute limits in program progettazione\n- Using default limits unnecessarily high\n- Not test con realistic data sizes\n- Missing priority fee strategies per important transazioni\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l1-q1",
                    "prompt": "What is the default compute unit limit per transazione?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "Unlimited"
                    ],
                    "answerIndex": 0,
                    "explanation": "The default limit is 200,000 CUs, extendable to 1.4M con ComputeBudgetProgram."
                  },
                  {
                    "id": "performance-v2-l1-q2",
                    "prompt": "What happens when a transazione exceeds its compute budget?",
                    "options": [
                      "Execution halts e the transazione fails",
                      "It continues con reduced priority",
                      "The network automatically extends the limit"
                    ],
                    "answerIndex": 0,
                    "explanation": "Exceeding the compute budget causes immediate transazione failure."
                  }
                ]
              }
            ]
          },
          "performance-v2-account-layout": {
            "title": "Account layout progettazione e serialization cost",
            "content": "# Account layout progettazione e serialization cost\n\nAccount data layout significantly impacts compute costs. Well-designed layouts minimize serialization overhead e reduce account access costs.\n\nSerialization formats affect cost. Borsh is the standard per Solana, offering compact binary encoding. Manual serialization can be more efficient per simple structures but increases bug risk. Avoid JSON or other text formats on-chain due to size e parsing cost.\n\nAccount size impacts costs linearly. Loading a 10KB account costs more than loading 1KB. Rent exemption requires more lamports per larger account. Progettazione layouts to minimize size: use fixed-size arrays instead of Vecs where possible, pack booleans into bitflags, e use appropriate integer sizes (u8/u16/u32/u64).\n\nData structure alignment affects both size e access patterns. Group related fields together per cache efficiency. Place frequently accessed fields at the beginning of the struct. Consider zero-copy deserialization per read-heavy operations.\n\nVersioning enables layout upgrades. Include a version byte at the start of account data. Migration logic can then handle different versions during deserialization. Plan per growth by reserving padding bytes in initial layouts.\n\n## Checklist\n- Use Borsh per standard serialization\n- Minimize account data size\n- Use appropriate integer sizes\n- Plan per versioning e upgrades\n- Consider zero-copy per read-heavy paths\n\n## Red flags\n- Using JSON per on-chain data\n- Oversized Vec collections\n- No versioning per upgrade paths\n- Unnecessary large integer types\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "performance-v2-l2-layout",
                "title": "Account Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Optimized Account",
                      "address": "Optimized1111111111111111111111111111111",
                      "lamports": 10000000,
                      "owner": "Program111111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 256
                    }
                  ]
                }
              }
            ]
          },
          "performance-v2-cost-model": {
            "title": "Challenge: Implement estimateCost(op) model",
            "content": "# Challenge: Implement estimateCost(op) model\n\nBuild a compute cost estimation system:\n\n- Model costs per different operation types\n- Account per istruzione complexity\n- Include memory access costs\n- Return baseline measurements\n- Handle edge cases (empty operations, large data)\n\nYour estimator will be validated against known operation costs.",
            "duration": "50 min",
            "hints": [
              "Use 5000 as the base compute unit cost per transazione.",
              "Each account accessed adds 500 compute units.",
              "Each byte of data adds 10 compute units.",
              "Total = base + (account × 500) + (bytes × 10)."
            ]
          },
          "performance-v2-instruction-data": {
            "title": "Istruzione data size e encoding optimization",
            "content": "# Istruzione data size e encoding optimization\n\nIstruzione data size directly impacts transazione cost e throughput. Optimizing encoding reduces fees e increases the operations possible within compute limits.\n\nCompact encoding uses minimal bytes to represent data. Use discriminants (u8) to identify istruzione types. Use variable-length encoding (ULEB128) per sizes. Pack multiple boolean flags into a single u8 using bit manipulation. Avoid unnecessary padding.\n\nAccount deduplication reduces transazione size. If an account appears in multiple istruzioni, include it once in the account list e reference by index. This is especially important per CPI-heavy transazioni.\n\nBatching combines multiple operations into one transazione. Instead of N transazioni con 1 istruzione each, use 1 transazione con N istruzioni. Batching amortizes signature verification e account loading costs across operations.\n\nRight-sizing vectors prevents overallocation. Use Vec::with_capacity when the size is known. Avoid unnecessary clones that increase heap usage. Consider stack-allocated arrays per small, fixed-size data.\n\n## Checklist\n- Use compact discriminants per istruzione types\n- Pack boolean flags into bitfields\n- Deduplicate account across istruzioni\n- Batch operations when possible\n- Right-size collections to avoid waste\n\n## Red flags\n- Using full u32 per small discriminants\n- Separate booleans instead of bitflags\n- Duplicate account in transazione lists\n- Unnecessary data cloning\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "performance-v2-l4-encoding",
                "title": "Encoding Example",
                "steps": [
                  {
                    "cmd": "Before optimization",
                    "output": "200 bytes, 5 account",
                    "note": "Separate bools, duplicate account"
                  },
                  {
                    "cmd": "After optimization",
                    "output": "120 bytes, 3 account",
                    "note": "Bitflags, deduplicated account"
                  },
                  {
                    "cmd": "Savings",
                    "output": "40% size reduction",
                    "note": "Lower fees, higher throughput"
                  }
                ]
              }
            ]
          }
        }
      },
      "performance-v2-optimization": {
        "title": "Optimization & Analysis",
        "description": "Layout optimization, compute budget tuning, e before/after prestazioni analysis con correctness safeguards.",
        "lessons": {
          "performance-v2-optimized-layout": {
            "title": "Challenge: Implement optimized layout/codec",
            "content": "# Challenge: Implement optimized layout/codec\n\nOptimize an account data layout while preserving semantics:\n\n- Reduce data size through compact encoding\n- Maintain all original functionality\n- Preserve backward compatibility where possible\n- Pass regression tests\n- Measure e report size reduction\n\nYour optimized layout should be smaller but functionally equivalent.",
            "duration": "55 min",
            "hints": [
              "Sort fields by size (largest first) to minimize padding gaps.",
              "Consider if u64 fields can be reduced to u32 based on maxValue.",
              "Boolean flags can be packed into a single byte as bit flags.",
              "Calculate bytes saved as originalSize - optimizedSize."
            ]
          },
          "performance-v2-compute-budget": {
            "title": "Compute budget istruzione fondamenti",
            "content": "# Compute budget istruzione fondamenti\n\nCompute budget istruzioni give developers control over resource allocation e transazione prioritization. Understanding these tools enables precise optimization.\n\nsetComputeUnitLimit requests a specific CU budget. The default is 200,000, but you can request up to 1,400,000. Requesting more than needed wastes fees since you pay per the limit, not actual usage. Requesting too little causes failures.\n\nsetComputeUnitPrice sets a priority fee in micro-lamports per CU. During congestion, transazioni con higher priority fees are more likely to be included. Priority fees are additional to base fees e go to validatori.\n\nRequesting compute units involves tradeoffs. Higher limits enable more complex operations but cost more. Priority fees increase inclusion probability but raise costs. Profile your transazioni to set appropriate limits.\n\nHeap size can also be configured. The default heap is 32KB, extendable to 256KB con compute budget istruzioni. Large heap enables complex data structures but increases CU consumption.\n\n## Checklist\n- Profile transazioni to determine actual CU usage\n- Set appropriate compute unit limits\n- Use priority fees during congestion\n- Consider heap size per data-heavy operations\n- Monitor cost vs inclusion probability tradeoffs\n\n## Red flags\n- Always using maximum compute unit limits\n- Not setting priority fees during congestion\n- Ignoring heap size constraints\n- Not profiling before optimization\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l6-q1",
                    "prompt": "What is the purpose of setComputeUnitPrice?",
                    "options": [
                      "Set priority fee per transazione inclusion",
                      "Set the maximum transazione size",
                      "Enable additional program features"
                    ],
                    "answerIndex": 0,
                    "explanation": "Priority fees increase the likelihood of transazione inclusion during network congestion."
                  },
                  {
                    "id": "performance-v2-l6-q2",
                    "prompt": "Why request specific compute unit limits?",
                    "options": [
                      "Pay only per what you need e prevent waste",
                      "Increase transazione speed",
                      "Enable more account access"
                    ],
                    "answerIndex": 0,
                    "explanation": "Specific limits optimize costs - you pay per the limit requested, not actual usage."
                  }
                ]
              }
            ]
          },
          "performance-v2-micro-optimizations": {
            "title": "Micro-optimizations e tradeoffs",
            "content": "# Micro-optimizations e tradeoffs\n\nPrestazioni optimization involves balancing competing concerns. Understanding tradeoffs helps make informed decisions about when e what to optimize.\n\nReadability vs prestazioni is a constant tension. Highly optimized code often sacrifices clarity. Optimize hot paths (frequently executed code) aggressively. Keep cold paths (rarely executed) readable e maintainable.\n\nSpace vs time tradeoffs appear frequently. Pre-computing values trades memory per speed. Compressing data trades CPU per storage. Choose based on which resource is more constrained per your use case.\n\nMaintainability vs optimization matters per long-term projects. Aggressive optimizations can introduce bugs e make updates difficult. Document why optimizations exist e measure their impact.\n\nPremature optimization is a common trap. Profile before optimizing to identify actual bottlenecks. Theoretical optimizations may not match real-world behavior. Focus on algorithmic improvements before micro-optimizations.\n\nSicurezza must never be sacrificed per prestazioni. Bounds checking, ownership validation, e arithmetic safety are non-negotiable. Optimize around sicurezza, not through it.\n\n## Checklist\n- Profile before optimizing\n- Focus on hot paths\n- Document optimization decisions\n- Balance readability e prestazioni\n- Never sacrifice sicurezza per speed\n\n## Red flags\n- Optimizing without profiling\n- Sacrificing sicurezza per prestazioni\n- Unreadable code without documentation\n- Optimizing cold paths unnecessarily\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l7-q1",
                    "prompt": "What is premature optimization?",
                    "options": [
                      "Optimizing without profiling or evidence of need",
                      "Optimizing before distribuzione",
                      "Small prestazioni improvements"
                    ],
                    "answerIndex": 0,
                    "explanation": "Premature optimization wastes effort on theoretical rather than measured bottlenecks."
                  },
                  {
                    "id": "performance-v2-l7-q2",
                    "prompt": "What should never be sacrificed per prestazioni?",
                    "options": [
                      "Sicurezza",
                      "Code comments",
                      "Variable names"
                    ],
                    "answerIndex": 0,
                    "explanation": "Sicurezza validations must remain regardless of prestazioni optimizations."
                  }
                ]
              }
            ]
          },
          "performance-v2-perf-checkpoint": {
            "title": "Checkpoint: Compare before/after + output perf report",
            "content": "# Checkpoint: Compare before/after + output perf report\n\nComplete the optimization lab checkpoint:\n\n- Measure baseline prestazioni metrics\n- Apply optimization techniques\n- Verify correctness is preserved\n- Generate prestazioni comparison report\n- Output stable JSON con sorted keys\n\nThis validates your ability to optimize while maintaining correctness.",
            "duration": "55 min",
            "hints": [
              "Compute savings by subtracting 'after' from 'before' metrics.",
              "Use approximate conversion: 1 SOL = $20, 1 SOL = 1,000,000,000 lamports.",
              "Count only optimizations where improved=true per totalImprovements.",
              "Include corso name as 'solana-prestazioni' e version as 'v2'."
            ]
          }
        }
      }
    }
  },
  "defi-swap-aggregator": {
    "title": "DeFi Swap Aggregation",
    "description": "Master production swap aggregation on Solana: deterministic quote parsing, route optimization tradeoffs, slippage safety, e reliability-aware execution.",
    "duration": "12 hours",
    "tags": [
      "defi",
      "swap",
      "aggregator",
      "jupiter",
      "solana"
    ],
    "modules": {
      "swap-v2-fundamentals": {
        "title": "Swap Fundamentals",
        "description": "Token swap mechanics, slippage protection, route composition, e deterministic swap plan construction con transparent tradeoffs.",
        "lessons": {
          "swap-v2-mental-model": {
            "title": "Swap modello mentale: mints, ATAs, decimals, e routes",
            "content": "# Swap modello mentale: mints, ATAs, decimals, e routes\n\nToken swaps on Solana follow a fundamentally different model than centralized exchanges. Understanding the building blocks — mints, associated token account (ATAs), decimal precision, e route composition — is essential before writing any swap code.\n\nEvery SPL token on Solana is defined by a mint account. The mint specifies the token's total supply, decimals (0–9), e authority. When you swap \"SOL per USDC,\" you are actually swapping wrapped SOL (mint `So11111111111111111111111111111111111111112`) per USDC (mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`). Native SOL must be wrapped into an SPL token before any program can manipulate it as a standard token.\n\nAssociated Token Account (ATAs) are deterministic addresses derived from a wallet e a mint using the Associated Token Account program. Per every token a wallet holds, there must be an ATA. If the recipient does not have an ATA per the output mint, the swap transazione must include a `createAssociatedTokenAccountIdempotent` istruzione — a common source of transazione failures when omitted.\n\nDecimal handling is critical. SOL uses 9 decimals (1 SOL = 1,000,000,000 lamports). USDC uses 6 decimals. When displaying \"22.5 USDC,\" the on-chain amount is 22,500,000. Mixing decimals between mints causes catastrophic pricing errors. Always convert human-readable amounts to raw integer amounts early e keep all math in integer space until the final display step.\n\nRoutes are the paths a swap takes through liquidity pools. A direct swap (SOL → USDC in a single pool) is the simplest case. When direct liquidity is insufficient or the price is better through an intermediary, the aggregator splits the swap into multiple \"legs\" — per example, SOL → mSOL → USDC. Each leg passes through a different AMM (Automated Market Maker) program like Whirlpool, Raydium, or Orca. The aggregator's job is to find the combination of legs that produces the best output amount after fees.\n\nRoute optimization considers: pool liquidity depth, fee tiers, impatto sul prezzo per leg, e the total compute cost of including multiple legs in one transazione. More legs means more istruzioni, more account, e higher compute unit consumption — there is a pratico limit to route complexity within Solana's transazione size e compute budget constraints.\n\n## Execution-quality triangle\n\nEvery route decision balances three competing goals:\n1. better output amount,\n2. lower failure risk (slippage + stale quote exposure),\n3. lower execution overhead (account + compute + latency).\n\nStrong aggregators make this tradeoff explicit rather than optimizing only a single metric.\n\n## Checklist\n- Identify input e output mints by their full base58 addresses\n- Ensure ATAs exist per both input e output tokens before swapping\n- Convert all amounts to raw integer form using the correct decimal places\n- Understand that routes may have multiple legs through different AMM programs\n- Consider compute budget implications of complex routes\n\n## Red flags\n- Mixing decimal scales between different mints\n- Forgetting to create output ATA before the swap istruzione\n- Assuming all swaps are single-hop direct routes\n- Ignoring fees charged by intermedio pools in multi-hop routes\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l1-q1",
                    "prompt": "Why must native SOL be wrapped before swapping?",
                    "options": [
                      "SPL token programs only operate on token account, not native SOL",
                      "Wrapping encrypts the SOL per privacy",
                      "Native SOL cannot be transferred on Solana"
                    ],
                    "answerIndex": 0,
                    "explanation": "AMM programs interact con SPL token account. Native SOL must be wrapped into the SPL token format so it can be processed by swap programs."
                  },
                  {
                    "id": "swap-v2-l1-q2",
                    "prompt": "What happens if the recipient has no ATA per the output token?",
                    "options": [
                      "The swap transazione fails unless the ATA is created in the same transazione",
                      "Solana automatically creates the ATA",
                      "The tokens are sent to the system program"
                    ],
                    "answerIndex": 0,
                    "explanation": "ATAs must be explicitly created. Including createAssociatedTokenAccountIdempotent in the transazione handles this safely."
                  }
                ]
              }
            ]
          },
          "swap-v2-slippage": {
            "title": "Slippage e impatto sul prezzo: protecting swap outcomes",
            "content": "# Slippage e impatto sul prezzo: protecting swap outcomes\n\nSlippage is the difference between the expected output amount at quote time e the actual amount received at execution time. In volatile markets con active trading, pool reserves change between when you request a quote e when your transazione lands on-chain. Slippage protection ensures you never receive less than an acceptable minimum.\n\nImpatto sul prezzo measures how much your swap moves the pool's price. A small swap in a deep liquidity pool has near-zero impatto sul prezzo. A large swap in a shallow pool can move the price significantly — you are effectively trading against yourself as each unit you buy makes the next unit more expensive. Impatto sul prezzo is calculated at quote time e should be displayed to users before they confirm.\n\nThe slippage tolerance is expressed in basis points (bps). 1 bps = 0.01%. A slippage of 50 bps means you accept up to 0.5% less than the quoted output. The minimum output amount is calculated as: minOutAmount = outAmount - (outAmount × slippageBps / 10000). This calculation MUST use integer arithmetic to avoid floating-point rounding errors. Using BigInt in JavaScript ensures exact computation.\n\nSetting slippage too tight (e.g., 1 bps) causes frequent transazione failures because even minor pool changes exceed the tolerance. Setting it too loose (e.g., 1000 bps = 10%) exposes users to sandwich attacks where a malicious actor front-runs the swap to move the price, then back-runs after execution to profit from the price movement. The optimal range per most swaps is 30–100 bps, con higher values per volatile or low-liquidity pairs.\n\nSandwich attacks exploit predictable slippage tolerances. An attacker observes your pending transazione in the mempool, submits a transazione to buy the output token (raising its price), lets your swap execute at the worse price, then sells the output token at profit. Tight slippage limits reduce the attacker's profit margin e may cause them to skip your transazione entirely.\n\nDynamic slippage adjusts the tolerance based on: recent volatility, pool depth, swap size relative to pool reserves, e historical transazione success rates. Avanzato aggregators compute recommended slippage per-route to balance execution reliability con protection. When building swap UIs, always show both the quoted output e the minimum guaranteed output so users understand their worst-case outcome.\n\n## Checklist\n- Calculate minOutAmount using integer arithmetic (BigInt)\n- Display both expected e minimum output amounts to users\n- Use 30–100 bps as default slippage per most pairs\n- Show impatto sul prezzo percentage prominently per large swaps\n- Consider dynamic slippage based on pool conditions\n\n## Red flags\n- Using floating-point math per slippage calculations\n- Setting extremely loose slippage (>500 bps) without user warning\n- Not displaying impatto sul prezzo per large swaps\n- Ignoring sandwich attack vectors in slippage progettazione\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l2-q1",
                    "prompt": "What is 50 basis points of slippage on a 1,000,000 output?",
                    "options": [
                      "5,000 (minOut = 995,000)",
                      "50,000 (minOut = 950,000)",
                      "500 (minOut = 999,500)"
                    ],
                    "answerIndex": 0,
                    "explanation": "50 bps = 0.5%. 1,000,000 × 50 / 10,000 = 5,000. So minOut = 995,000."
                  },
                  {
                    "id": "swap-v2-l2-q2",
                    "prompt": "Why should minOutAmount use BigInt instead of floating point?",
                    "options": [
                      "Floating point introduces rounding errors in token amounts",
                      "BigInt is faster than floating point",
                      "Solana only accepts BigInt in transazioni"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts are integers. Floating-point math can produce off-by-one errors that cause transazione failures or incorrect minimum amounts."
                  }
                ]
              }
            ]
          },
          "swap-v2-route-explorer": {
            "title": "Route visualization: understanding swap legs e fees",
            "content": "# Route visualization: understanding swap legs e fees\n\nSwap routes reveal the path your tokens take through DeFi liquidity. Visualizing routes helps users understand why a multi-hop path might yield more output than a direct swap, e where fees are deducted along the way.\n\nA route consists of one or more legs. Each leg represents a swap through a specific AMM pool. The leg includes: the AMM program label (e.g., \"Whirlpool,\" \"Raydium\"), the input e output mints per that leg, the fee charged by the pool (denominated in the output token), e the percentage of the total input allocated to this leg.\n\nSplit routes divide the input amount across multiple paths. Per example, 60% might go through Raydium SOL/USDC e 40% through Orca SOL/USDC. Splitting across pools reduces impatto sul prezzo because each pool handles a smaller portion of the total swap. The aggregator optimizes the split percentages to maximize total output.\n\nFee accounting is per-leg. Each AMM charges a fee (typically 0.01%–1% depending on the pool's fee tier). In concentrated liquidity pools, fee tiers are explicit (e.g., Orca's 1 bps, 4 bps, 30 bps, 100 bps tiers). The total fee across all legs determines the true cost of the route. A route con lower per-leg fees might still be more expensive if it requires more hops.\n\nWhen rendering route information, show: the overall path (input mint → [intermedio mints] → output mint), per-leg details (AMM, fee, percentage), total fees in the output token denomination, impatto sul prezzo as a percentage, e the final output amounts (quoted e minimum). Color-coding or progress indicators help users quickly understand whether a route is simple (green, single hop) or complex (yellow/orange, multi-hop).\n\nEffective price is calculated as: outputAmount / inputAmount, denominated in output-per-input units. Per SOL → USDC, this gives the effective USD price of SOL per this specific swap. Comparing the effective price against oracle or market price reveals the total cost of the swap including all fees e impatto sul prezzo. This \"execution cost\" metric is the most honest summary of swap quality.\n\nRoute caching e expiration matter per UX. Quotes from aggregators have a limited validity window (typically 10–30 seconds). If the user takes too long to confirm, the quote expires e the route must be re-fetched. The UI should clearly indicate quote freshness e automatically re-quote when expired. Stale quotes that execute against current pool state will likely fail or produce worse outcomes.\n\n## Checklist\n- Show each leg con AMM label, mints, fee, e split percentage\n- Display total fees summed across all legs\n- Calculate e display effective price (output/input)\n- Indicate quote expiration time to users\n- Color-code routes by complexity (hops count)\n\n## Red flags\n- Hiding fees from the user display\n- Not showing impatto sul prezzo per large swaps\n- Allowing execution of expired quotes\n- Displaying only the best-case output without minimum\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "swap-v2-l3-route",
                "title": "Route Example",
                "steps": [
                  {
                    "cmd": "Quote: 1 SOL → USDC",
                    "output": "Route: SOL →[Whirlpool 30bps]→ USDC | 100% | Fee: 6,750 lamports",
                    "note": "Single-hop direct route"
                  },
                  {
                    "cmd": "Quote: 50 SOL → USDC (split)",
                    "output": "Leg 1: SOL →[Raydium]→ USDC | 60% | Fee: 40,500\nLeg 2: SOL →[Orca]→ USDC | 40% | Fee: 27,000",
                    "note": "Split route reduces impatto sul prezzo"
                  },
                  {
                    "cmd": "Effective price",
                    "output": "22.50 USDC/SOL (market: 22.55) | Cost: 0.22%",
                    "note": "Total execution cost includes fees + impact"
                  }
                ]
              }
            ]
          },
          "swap-v2-swap-plan": {
            "title": "Challenge: Build a normalized SwapPlan from a quote",
            "content": "# Challenge: Build a normalized SwapPlan from a quote\n\nParse a raw aggregator quote response e produce a normalized SwapPlan:\n\n- Extract input/output mints e amounts from the quote\n- Calculate minOutAmount using BigInt slippage arithmetic\n- Map each route leg to a normalized structure con AMM label, mints, fees, e percentage\n- Handle zero slippage correctly (minOut equals outAmount)\n- Ensure all amounts remain as string representations of integers\n\nYour SwapPlan must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Use BigInt arithmetic to avoid floating point errors when computing minOutAmount.",
              "Slippage in basis points: minOut = outAmount - (outAmount * slippageBps / 10000).",
              "Map each routePlan entry to a normalized leg con index, ammLabel, mints, e fees.",
              "The priceImpactPct comes directly from the quote response."
            ]
          }
        }
      },
      "swap-v2-execution": {
        "title": "Execution & Reliability",
        "description": "State-machine execution, transazione anatomy, retry/staleness reliability patterns, e high-signal swap run reporting.",
        "lessons": {
          "swap-v2-state-machine": {
            "title": "Challenge: Implement swap UI state machine",
            "content": "# Challenge: Implement swap UI state machine\n\nBuild a deterministic state machine per the swap UI flow:\n\n- States: idle → quoting → ready → sending → confirming → success | error\n- Process a sequence of events e track all state transitions\n- Invalid transitions should move to the error state con a descriptive message\n- The error state supports RESET (back to idle) e RETRY (back to quoting)\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "45 min",
            "hints": [
              "Define a TRANSITIONS map: each key is a state, each value maps event names to next states.",
              "If an event is not valid per the current state, transition to 'error' con a descriptive message.",
              "Track each transition in a history array con {from, event, to} objects.",
              "The 'error' state supports RESET (back to idle) e RETRY (back to quoting)."
            ]
          },
          "swap-v2-tx-anatomy": {
            "title": "Swap transazione anatomy: istruzioni, account, e compute",
            "content": "# Swap transazione anatomy: istruzioni, account, e compute\n\nA swap transazione on Solana is a carefully ordered sequence of istruzioni that together achieve an atomic token exchange. Understanding each istruzione's role, the account list requirements, e compute budget considerations is essential per building reliable swap flows.\n\nThe typical swap transazione contains these istruzioni in order: (1) Compute Budget: SetComputeUnitLimit e SetComputeUnitPrice to ensure the transazione has enough compute e appropriate priority. (2) Create ATA (if needed): createAssociatedTokenAccountIdempotent per the output token if the user doesn't already have one. (3) Wrap SOL (if input is native SOL): transfer SOL to a temporary WSOL account e sync its balance. (4) Swap istruzione(s): the actual AMM program calls that execute the swap, referencing all required pool account. (5) Unwrap WSOL (if output is native SOL): close the temporary WSOL account e recover SOL.\n\nAccount requirements scale con route complexity. A single-hop swap through Whirlpool requires approximately 12–15 account (user wallet, token account, pool state, oracle, tick arrays, etc.). A multi-hop route through two different AMMs can require 25+ account, pushing against the transazione size limit. Address Lookup Tables (ALTs) mitigate this by compressing account references from 32 bytes to 1 byte each, but require a separate setup transazione.\n\nCompute budget estimation is critical. A simple SOL → USDC Whirlpool swap uses roughly 80,000–120,000 compute units. Multi-hop routes can use 200,000–400,000+. Setting the compute limit too low causes the transazione to fail. Setting it too high wastes the user's priority fee budget (priority fee = CU price × CU limit). Aggregators typically provide a recommended compute unit limit per route.\n\nPriority fees determine transazione ordering. During high-demand periods (popular mints, volatile markets), transazioni compete per block space. The priority fee (in micro-lamports per compute unit) determines where your transazione lands in the leader's queue. Too low e the transazione may not be included; too high e the user overpays. Dynamic priority fee estimation uses recent block data to suggest competitive rates.\n\nTransazione simulation before submission catches many errors: insufficient balance, missing account, compute budget exceeded, slippage exceeded. Simulating saves the user from paying transazione fees on doomed transazioni. The simulation result includes compute units consumed, log messages, e any error codes — all useful per debugging.\n\nVersioned transazioni (v0) are required when using Address Lookup Tables. Legacy transazioni cannot reference ALTs. Most modern swap aggregators return versioned transazione messages. Wallet must support versioned transazione signing (most do, but some older wallet adapters may not).\n\n## Checklist\n- Include compute budget istruzioni at the start of the transazione\n- Create output ATA if it doesn't exist\n- Handle SOL wrapping/unwrapping per native SOL swaps\n- Simulate transazioni before submission\n- Use versioned transazioni when ALTs are needed\n\n## Red flags\n- Omitting compute budget istruzioni (uses default 200k limit)\n- Not creating output ATA before the swap istruzione\n- Forgetting to unwrap WSOL after receiving native SOL output\n- Skipping simulation e sending potentially invalid transazioni\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l6-q1",
                    "prompt": "Why are compute budget istruzioni placed first in a swap transazione?",
                    "options": [
                      "The runtime reads them before executing other istruzioni to set limits",
                      "They must be first per signature verification",
                      "Other istruzioni depend on their output"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compute budget istruzioni configure the transazione's CU limit e price before any program execution begins."
                  },
                  {
                    "id": "swap-v2-l6-q2",
                    "prompt": "What is the primary benefit of Address Lookup Tables per swaps?",
                    "options": [
                      "They compress account references from 32 bytes to 1 byte, fitting more account in a transazione",
                      "They make transazioni faster to execute",
                      "They reduce the number of required signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "ALTs allow transazioni to reference many account without exceeding the 1232-byte transazione size limit."
                  }
                ]
              }
            ]
          },
          "swap-v2-reliability": {
            "title": "Reliability patterns: retries, stale quotes, e latency",
            "content": "# Reliability patterns: retries, stale quotes, e latency\n\nProduction swap flows must handle the reality of network latency, expired quotes, e transazione failures. Reliability engineering separates toy swap implementations from production-grade systems that users trust con real money.\n\nQuote staleness is the primary reliability challenge. An aggregator quote reflects pool state at a specific moment. By the time the user reviews the quote, signs the transazione, e it lands on-chain, pool reserves may have changed significantly. A quote older than 10–15 seconds should be considered potentially stale. The UI should show a countdown timer e automatically re-quote when the timer expires. Never allow users to send transazioni based on quotes older than 30 seconds.\n\nRetry strategies must distinguish between retryable e non-retryable failures. Retryable: network timeout, RPC node temporarily unavailable, blockhash expired (re-fetch e re-sign), e rate limiting (429 responses, back off exponentially). Non-retryable: insufficient balance, invalid account state, slippage exceeded (pool price moved too far, re-quote required), e program errors indicating invalid istruzione data.\n\nExponential backoff con jitter prevents retry storms. Base delay of 500ms, multiplied by 2 on each retry, con random jitter of ±25% to prevent synchronized retries from multiple clients. Cap retries at 3–5 attempts. If all retries fail, present a clear error message con actionable options: \"Quote expired — refresh e try again\" rather than generic \"Transazione failed.\"\n\nBlockhash management affects reliability. A transazione's blockhash must be recent (within ~60 seconds / 150 slots). If a transazione fails e you retry, the blockhash may have expired. The retry flow must: get a fresh blockhash, rebuild the transazione con the new blockhash, re-sign, e re-submit. This is why swap transazione building should be a reusable function that accepts a blockhash parameter.\n\nLatency budgets help set user expectations. Typical Solana transazione confirmation takes 400ms–2 seconds. However, during congestion, confirmation can take 5–30 seconds or fail entirely. The UI should show progressive states: \"Submitting...\" → \"Confirming...\" con block confirmations. After 30 seconds without confirmation, offer the user a choice: wait longer, retry, or cancel (note: you cannot cancel a submitted transazione, but you can stop polling e let the blockhash expire).\n\nTransazione status polling should use WebSocket subscriptions (signatureSubscribe) per real-time confirmation rather than polling getTransaction. Polling creates unnecessary RPC load e introduces latency. Subscribe immediately after sendTransaction returns a signature, e set a timeout per maximum wait time.\n\n## Checklist\n- Show quote freshness countdown e auto-refresh\n- Classify errors as retryable vs non-retryable\n- Use exponential backoff con jitter per retries\n- Get fresh blockhash on each retry attempt\n- Use WebSocket subscriptions per confirmation\n\n## Red flags\n- Retrying non-retryable errors (wastes time e fees)\n- No retry limit (infinite retry loops)\n- Sending transazioni con stale quotes (>30 seconds)\n- Polling getTransaction instead of subscribing\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "swap-v2-l7-retry",
                "title": "Retry Flow",
                "steps": [
                  {
                    "cmd": "Attempt 1",
                    "output": "Error: 429 Rate Limited",
                    "note": "Retryable — back off 500ms"
                  },
                  {
                    "cmd": "Attempt 2 (after 500ms + jitter)",
                    "output": "Error: Blockhash expired",
                    "note": "Retryable — get fresh blockhash"
                  },
                  {
                    "cmd": "Attempt 3 (after 1000ms + jitter)",
                    "output": "Success: Signature abc123",
                    "note": "Transazione confirmed after retry"
                  }
                ]
              }
            ]
          },
          "swap-v2-swap-report": {
            "title": "Checkpoint: Generate a SwapRunReport",
            "content": "# Checkpoint: Generate a SwapRunReport\n\nBuild the final swap run report that combines all corso concepts:\n\n- Summarize the route con leg details e total fees (using BigInt summation)\n- Compute the effective price as outAmount / inAmount (9 decimal precision)\n- Include the state machine outcome (finalState from the UI flow)\n- Collect all errors from the state result e additional error sources\n- Output must be stable JSON con deterministic key ordering\n\nThis checkpoint validates your complete understanding of swap aggregation.",
            "duration": "55 min",
            "hints": [
              "Use BigInt to sum fee amounts across all route legs.",
              "Effective price = outAmount / inAmount, formatted to 9 decimal places.",
              "Collect errors from both the state machine result e any additional errors array.",
              "Route summary should include index, ammLabel, pct, e feeAmount per leg."
            ]
          }
        }
      }
    }
  },
  "defi-clmm-liquidity": {
    "title": "CLMM Liquidity Engineering",
    "description": "Master concentrated liquidity engineering on Solana DEXs: tick math, range strategy progettazione, fee/IL dynamics, e deterministic LP position reporting.",
    "duration": "14 hours",
    "tags": [
      "defi",
      "clmm",
      "liquidity",
      "orca",
      "solana"
    ],
    "modules": {
      "clmm-v2-fundamentals": {
        "title": "CLMM Fundamentals",
        "description": "Concentrated liquidity concepts, tick/price math, e range-position behavior needed to reason about CLMM execution.",
        "lessons": {
          "clmm-v2-vs-cpmm": {
            "title": "CLMM vs constant product: why ticks exist",
            "content": "# CLMM vs constant product: why ticks exist\n\nConcentrated Liquidity Market Makers (CLMMs) represent a fundamental evolution in automated market maker progettazione. To understand why they exist, we must first understand the limitations of the constant product model e then examine how tick-based systems solve those problems on Solana.\n\n## The constant product model e its inefficiency\n\nThe original AMM progettazione, popularized by Uniswap V2 e adopted by Raydium V1 on Solana, uses the constant product invariant: x * y = k, where x e y are the reserves of two tokens e k is a constant. When a trader swaps token A per token B, the product must remain unchanged. This creates a smooth price curve that spans the entire range from zero to infinity.\n\nThe problem con this approach is capital inefficiency. If a SOL/USDC pool holds $10 million in liquidity, e SOL trades between $20 e $30 per months, the vast majority of that capital sits idle. Liquidity allocated to price ranges below $1 or above $1000 never participates in trades, earns no fees, yet still dilutes the returns per liquidity providers (LPs). In practice, studies show that less than 5% of liquidity in constant product pools is actively used at any given time.\n\n## Concentrated liquidity: the core insight\n\nCLMMs, pioneered by Uniswap V3 e implemented on Solana by Orca Whirlpools, Raydium Concentrated Liquidity, e Meteora DLMM, allow LPs to allocate capital to specific price ranges. Instead of spreading liquidity across all possible prices, an LP can say: \"I want to provide liquidity only between $20 e $30 per SOL/USDC.\" This concentrates their capital where trades actually happen, dramatically increasing capital efficiency.\n\nThe capital efficiency gain is substantial. An LP providing concentrated liquidity in a narrow range can achieve the same depth as a constant product LP con 100x or even 4000x less capital, depending on how tight the range is. This means more fees earned per dollar deployed, which is the fundamental value proposition of CLMMs.\n\n## Why ticks exist\n\nTo implement concentrated liquidity, the price space must be discretized. CLMMs divide the continuous price curve into discrete points called ticks. Each tick represents a specific price, e the relationship between tick index e price follows the formula: price = 1.0001^tick. This means each tick represents a 0.01% (1 basis point) change in price from the adjacent tick.\n\nTicks serve several critical purposes. First, they provide the boundaries per liquidity positions. When an LP creates a position from tick -1000 to tick 1000, they are defining a price range. Second, ticks are where liquidity transitions happen. As the price crosses a tick boundary, the active liquidity changes because positions that start or end at that tick become active or inactive. Third, ticks enable efficient fee tracking, because the protocol only needs to track fee growth at tick boundaries rather than at every possible price.\n\nTick spacing is an important optimization. Not every tick is usable in every pool. Pools con higher fee tiers use wider tick spacing (e.g., 64 or 128 ticks apart) to reduce gas costs e state size. A pool con tick spacing of 64 means LPs can only place position boundaries at tick indices that are multiples of 64. This tradeoff reduces granularity but improves on-chain efficiency, which is especially important on Solana where account sizes e compute units matter.\n\n## Solana-specific CLMM considerations\n\nOn Solana, CLMMs face unique architectural challenges. The modello degli account requires pre-allocated tick arrays that store tick data in contiguous ranges. Orca Whirlpools, per example, uses tick array account that each hold 88 ticks worth of data. The program must load the correct tick array account as istruzioni, which means swaps that cross many ticks require more account e more compute units.\n\nThe Solana runtime's 1232-byte transazione size limit e 200,000 compute unit default also constrain CLMM operations. Large swaps that cross multiple tick boundaries may need to be split across multiple transazioni, e position management operations must be carefully optimized to fit within these constraints.\n\n## LP decision framework\n\nBefore opening any CLMM position, answer three questions:\n1. What price regime am I targeting (mean-reverting vs trending)?\n2. How actively can I rebalance when out-of-range?\n3. What failure budget can I tolerate per fees vs IL vs rebalance costs?\n\nCLMM returns come from strategy discipline, not just math formulas.\n\n## Checklist\n- Understand that x*y=k spreads liquidity across all prices, wasting capital\n- CLMMs let LPs concentrate capital in specific price ranges\n- Ticks discretize the price space at 1 basis point intervals\n- Tick spacing varies by pool fee tier per on-chain efficiency\n- Solana CLMMs use tick array account per state management\n\n## Red flags\n- Assuming CLMM positions behave like constant product positions\n- Ignoring tick spacing when placing position boundaries\n- Underestimating compute costs per swaps crossing many ticks\n- Forgetting that out-of-range positions earn zero fees\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l1-q1",
                    "prompt": "What is the main advantage of CLMMs over constant product AMMs?",
                    "options": [
                      "Capital efficiency — LPs concentrate liquidity where trades happen",
                      "Lower transazione fees per traders",
                      "No need per oracle price feeds"
                    ],
                    "answerIndex": 0,
                    "explanation": "CLMMs allow LPs to allocate capital to specific price ranges, dramatically improving capital efficiency compared to spreading liquidity across all prices."
                  },
                  {
                    "id": "clmm-v2-l1-q2",
                    "prompt": "Why do CLMMs use ticks to discretize the price space?",
                    "options": [
                      "To define position boundaries e track liquidity transitions efficiently",
                      "To make prices easier per humans to read",
                      "To reduce the number of tokens in the pool"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ticks provide discrete price points per position boundaries, liquidity transitions, e efficient fee tracking at tick crossings."
                  }
                ]
              }
            ]
          },
          "clmm-v2-price-tick": {
            "title": "Price, tick, e sqrtPrice: core conversions",
            "content": "# Price, tick, e sqrtPrice: core conversions\n\nThe mathematical foundation of every CLMM rests on three interrelated representations of price: the human-readable price, the tick index, e the sqrtPriceX64. Understanding how to convert between these representations is essential per building any CLMM integration on Solana.\n\n## Tick to price conversion\n\nThe fundamental relationship between a tick index e price is: price = 1.0001^tick. This formula means that each consecutive tick represents a 0.01% (1 basis point) change in price. Tick 0 corresponds to a price of 1.0. Positive ticks yield prices greater than 1, e negative ticks yield prices less than 1.\n\nPer example, tick 23027 gives a price of approximately 10.0 (since 1.0001^23027 is roughly 10). Tick -23027 gives approximately 0.1. This logarithmic spacing means ticks provide consistent relative precision across all price levels. Whether the price is 0.001 or 1000, adjacent ticks always differ by 0.01%.\n\nThe inverse conversion from price to tick uses the natural logarithm: tick = ln(price) / ln(1.0001). Since tick indices must be integers, this value is typically rounded to the nearest integer. In practice, you also need to align the tick to the pool's tick spacing, which means rounding down to the nearest multiple of the tick spacing value.\n\n## The sqrtPrice representation\n\nCLMMs do not store price directly on-chain. Instead, they store the square root of the price in a fixed-point format called sqrtPriceX64. This representation has two important advantages.\n\nFirst, using the square root simplifies the core AMM math. The amount of token0 in a position is proportional to (1/sqrtPrice_lower - 1/sqrtPrice_upper), e the amount of token1 is proportional to (sqrtPrice_upper - sqrtPrice_lower). These linear relationships are much easier to compute on-chain than the original price-based formulas would be.\n\nSecond, the X64 fixed-point format (also called Q64.64) provides high precision without floating-point arithmetic. The sqrtPrice is multiplied by 2^64 e stored as a 128-bit unsigned integer. This means sqrtPriceX64 = sqrt(price) * 2^64. Per tick 0 (price = 1.0), the sqrtPriceX64 is exactly 2^64 = 18446744073709551616.\n\nOn Solana, Orca Whirlpools stores this value as a u128 in the Whirlpool account state. Every swap operation updates this value as the price moves. The sqrt_price field is the canonical source of truth per the current pool price.\n\n## Decimal handling e token precision\n\nReal-world tokens have different decimal places. SOL has 9 decimals, USDC has 6 decimals. The tick-to-price formula gives a \"raw\" price that must be adjusted per decimals. If token0 is SOL (9 decimals) e token1 is USDC (6 decimals), the human-readable price is: display_price = raw_price * 10^(decimals0 - decimals1) = raw_price * 10^(9-6) = raw_price * 1000.\n\nThis decimal adjustment is critical e a common source of bugs. Always track which token is token0 e which is token1 in the pool, e apply the correct decimal scaling when converting between on-chain tick values e display prices.\n\n## Tick spacing e alignment\n\nNot every tick index is a valid position boundary. Each pool has a tick_spacing parameter that determines which ticks can be used. Common values are: 1 (per stable pairs con 0.01% fee), 8 (per 0.04% fee pools), 64 (per 0.30% fee pools), e 128 (per 1.00% fee pools).\n\nTo align a tick to the pool's tick spacing, use: aligned_tick = floor(tick / tick_spacing) * tick_spacing. This always rounds toward negative infinity, ensuring consistent behavior per both positive e negative ticks. Per example, con tick spacing 64: tick 100 aligns to 64, tick -100 aligns to -128.\n\n## Precision considerations\n\nFloating-point arithmetic introduces rounding errors in tick/price conversions. When converting price to tick e back, the result may differ by 1 tick due to floating-point precision limits. Per on-chain operations, always use the integer tick index as the source of truth e derive the price from it, never the reverse.\n\nThe sqrtPriceX64 computation using BigInt avoids floating-point issues per the final representation, but the intermedio sqrt e pow operations still use JavaScript's 64-bit floats. Per production systems processing large values, consider using dedicated decimal libraries or performing these computations con higher-precision arithmetic.\n\n## Checklist\n- price = 1.0001^tick per tick-to-price conversion\n- tick = round(ln(price) / ln(1.0001)) per price-to-tick conversion\n- sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64))\n- Align ticks to tick spacing: floor(tick / spacing) * spacing\n- Adjust per token decimals when displaying human-readable prices\n\n## Red flags\n- Ignoring decimal differences between token0 e token1\n- Using floating-point price as source of truth instead of tick index\n- Forgetting tick spacing alignment when creating positions\n- Overflow in sqrtPriceX64 computation per extreme tick values\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l2-q1",
                    "prompt": "What is the sqrtPriceX64 value per tick 0 (price = 1.0)?",
                    "options": [
                      "2^64 = 18446744073709551616",
                      "1",
                      "2^128"
                    ],
                    "answerIndex": 0,
                    "explanation": "At tick 0, price = 1.0, sqrt(1.0) = 1.0, e sqrtPriceX64 = 1.0 * 2^64 = 18446744073709551616."
                  },
                  {
                    "id": "clmm-v2-l2-q2",
                    "prompt": "Why do CLMMs store sqrtPrice instead of price directly?",
                    "options": [
                      "It simplifies the AMM math — token amounts become linear in sqrtPrice",
                      "It uses less storage space on-chain",
                      "It makes the price harder per MEV bots to read"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts in a CLMM position are linear functions of sqrtPrice, making on-chain computation simpler e more gas-efficient."
                  }
                ]
              }
            ]
          },
          "clmm-v2-range-explorer": {
            "title": "Range positions: in-range e out-of-range dynamics",
            "content": "# Range positions: in-range e out-of-range dynamics\n\nA CLMM position is defined by its lower tick e upper tick. These two boundaries determine the price range in which the position is active, earns fees, e holds a mix of both tokens. Understanding in-range e out-of-range behavior is fundamental to managing concentrated liquidity effectively on Solana.\n\n## Anatomy of a range position\n\nWhen an LP creates a position on Orca Whirlpools (or any Solana CLMM), they specify three parameters: the lower tick index, the upper tick index, e the amount of liquidity to provide. The protocol then calculates how much of each token the LP must deposit based on the current price relative to the position's range.\n\nIf the current price is within the range (lower_tick <= current_tick <= upper_tick), the LP deposits both tokens. The ratio depends on where the current price sits within the range. If the price is near the lower bound, the position holds mostly token0. If near the upper bound, it holds mostly token1. This is the direct analog of how a constant product pool holds different ratios at different prices, but concentrated into the LP's chosen range.\n\n## In-range behavior\n\nWhen the current pool price is within a position's range, the position is in-range e actively participates in swaps. Every swap that moves the price within this range uses the position's liquidity e generates fees per the LP.\n\nThe fee accrual mechanism works as follows: the pool tracks a global fee_growth value per each token. When a swap occurs, the fee (e.g., 0.30% of the swap amount) is distributed proportionally across all in-range liquidity. Each position tracks its own fee_growth snapshot, e uncollected fees are the difference between the current global growth e the position's snapshot, multiplied by the position's liquidity.\n\nIn-range positions experience impermanent loss (IL) as the price moves. When the price moves up, the position converts token0 into token1 (selling token0 at higher prices). When the price moves down, it converts token1 into token0. This rebalancing is the source of IL, e it is more pronounced in CLMMs than in constant product pools because the liquidity is concentrated in a narrower range.\n\n## Out-of-range behavior\n\nWhen the price moves outside a position's range, the position becomes out-of-range. This has critical implications. The position stops earning fees entirely because it no longer participates in swaps. The position holds 100% of one token: if the price moved above the upper tick, the position holds entirely token1 (all token0 was sold as the price rose). If the price moved below the lower tick, the position holds entirely token0 (all token1 was sold as the price fell).\n\nAn out-of-range position is effectively a limit order that has been filled. If you set a range above the current price e the price rises through it, your token0 is converted to token1 at prices within your range. This property makes CLMMs useful per implementing range orders e dollar-cost averaging strategies.\n\nOut-of-range positions still exist on-chain e can be closed or modified at any time. The LP can withdraw their single-sided holdings, or they can wait per the price to return to their range. If the price returns, the position automatically becomes active again e starts earning fees.\n\n## Position composition at boundaries\n\nAt the exact lower tick, the position holds 100% token0 e 0% token1. At the exact upper tick, it holds 0% token0 e 100% token1. At any price between, the composition is a function of where the current sqrtPrice sits relative to the range boundaries.\n\nThe token amounts are calculated as: amount0 = liquidity * (1/sqrtPrice_current - 1/sqrtPrice_upper) e amount1 = liquidity * (sqrtPrice_current - sqrtPrice_lower). These formulas only apply when the price is in-range. When out-of-range below, amount0 = liquidity * (1/sqrtPrice_lower - 1/sqrtPrice_upper) e amount1 = 0. When out-of-range above, amount0 = 0 e amount1 = liquidity * (sqrtPrice_upper - sqrtPrice_lower).\n\n## Active liquidity e the liquidity curve\n\nThe pool's active liquidity at any given price is the sum of all in-range positions at that price. This creates a liquidity distribution curve that can have complex shapes depending on where LPs have placed their positions. Deeper liquidity at the current price means less slippage per traders.\n\nOn Solana, this active liquidity is stored in the Whirlpool account's liquidity field e is updated whenever the price crosses a tick boundary where positions start or end. The tick array account store the net liquidity change at each initialized tick, allowing the program to efficiently update active liquidity during swaps.\n\n## Checklist\n- In-range positions earn fees e hold both tokens\n- Out-of-range positions earn zero fees e hold one token\n- Token composition varies continuously within the range\n- Active liquidity is the sum of all in-range positions\n- Fee growth tracking uses global vs position-level snapshots\n\n## Red flags\n- Expecting fees from out-of-range positions\n- Ignoring the single-sided nature of out-of-range holdings\n- Forgetting to account per IL in concentrated positions\n- Assuming position composition is static within a range\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "clmm-v2-l3-states",
                "title": "Position States",
                "steps": [
                  {
                    "cmd": "Position: SOL/USDC range [tick -1000, tick 1000]",
                    "output": "Current tick: 500 -> Status: IN-RANGE, holds SOL + USDC, earning fees",
                    "note": "Price within range, position is active"
                  },
                  {
                    "cmd": "Price moves up: current tick -> 1500",
                    "output": "Status: OUT-OF-RANGE (above), holds 100% USDC, earning 0 fees",
                    "note": "All SOL was sold as price rose through the range"
                  },
                  {
                    "cmd": "Price drops back: current tick -> -500",
                    "output": "Status: IN-RANGE, holds SOL + USDC, earning fees again",
                    "note": "Position reactivates when price returns to range"
                  },
                  {
                    "cmd": "Price drops further: current tick -> -2000",
                    "output": "Status: OUT-OF-RANGE (below), holds 100% SOL, earning 0 fees",
                    "note": "All USDC was sold as price fell through the range"
                  }
                ]
              }
            ]
          },
          "clmm-v2-tick-math": {
            "title": "Challenge: Implement tick/price conversion helpers",
            "content": "# Challenge: Implement tick/price conversion helpers\n\nImplement the core tick math functions used in every CLMM integration:\n\n- Convert a tick index to a human-readable price using price = 1.0001^tick\n- Convert the price to sqrtPriceX64 using Q64.64 fixed-point encoding\n- Reverse-convert a price back to the nearest tick index\n- Align a tick index to the pool's tick spacing\n\nYour implementation will be tested against known tick values including tick 0, positive ticks, e negative ticks.",
            "duration": "50 min",
            "hints": [
              "Price at a tick index = 1.0001^tickIndex. Use Math.pow(1.0001, tick).",
              "Reverse conversion: tick = round(ln(price) / ln(1.0001)).",
              "sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64)) — Solana CLMM uses Q64.64 fixed-point.",
              "Tick spacing alignment: floor(tick / spacing) * spacing."
            ]
          }
        }
      },
      "clmm-v2-positions": {
        "title": "Positions & Risk",
        "description": "Fee accrual simulation, range strategy tradeoffs, precision pitfalls, e deterministic position risk reporting.",
        "lessons": {
          "clmm-v2-position-fees": {
            "title": "Challenge: Simulate position fee accrual",
            "content": "# Challenge: Simulate position fee accrual\n\nImplement a fee accrual simulator per a CLMM position over a price path:\n\n- Convert lower e upper tick boundaries to prices\n- Walk through each price in the path e determine in-range or out-of-range status\n- Accrue fees proportional to trade volume when in-range\n- Compute annualized fee APR\n- Track periods in-range vs out-of-range\n- Determine current status from the final price\n\nThis simulates the real-world behavior of concentrated liquidity positions as prices move.",
            "duration": "50 min",
            "hints": [
              "Convert ticks to prices: lowerPrice = 1.0001^lowerTick, upperPrice = 1.0001^upperTick.",
              "Per each price in the path, check if lowerPrice <= price <= upperPrice.",
              "Fees only accrue when the position is in range. fee = floor(volumePerPeriod * feeRate).",
              "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimal places.",
              "Current status is based on the last price in the path relative to the range."
            ]
          },
          "clmm-v2-range-strategy": {
            "title": "Range strategies: tight, wide, e rebalancing rules",
            "content": "# Range strategies: tight, wide, e rebalancing rules\n\nChoosing the right price range is the most important decision a CLMM liquidity provider makes. The range determines capital efficiency, fee income, impermanent loss exposure, e rebalancing frequency. This lezione covers the major strategies e the tradeoffs between them.\n\n## Tight ranges: maximum efficiency, maximum risk\n\nA tight range concentrates all liquidity into a narrow price band. Per example, providing liquidity per SOL/USDC within +/- 2% of the current price. The advantages are significant: capital efficiency can be 100x or more compared to a full-range position, e the LP earns a proportionally larger share of trading fees.\n\nHowever, tight ranges carry substantial risks. The position goes out-of-range frequently, requiring active monitoring e rebalancing. Each time the position goes out-of-range, the LP has fully converted to one token e stops earning fees. The LP also realizes impermanent loss on each range crossing, e the gas costs of frequent rebalancing can eat into profits.\n\nTight ranges work best per stable pairs (USDC/USDT) where the price rarely deviates significantly, per professional LPs who can automate rebalancing, e per short-term positions where the LP has a strong directional view.\n\n## Wide ranges: passive e resilient\n\nA wide range covers a larger price band, such as +/- 50% or even the full price range. Capital efficiency is lower, but the position stays in-range longer e requires less active management. Fee income per dollar is lower, but the position earns fees more consistently.\n\nWide ranges suit passive LPs who cannot actively monitor positions, volatile pairs where the price can swing dramatically, e LPs who want to minimize rebalancing costs e IL realization events.\n\nThe extreme case is a full-range position covering all ticks. This replicates constant product AMM behavior e never goes out-of-range. While capital-inefficient, it provides maximum resilience e is appropriate per very volatile or low-liquidity pairs.\n\n## Asymmetric ranges e directional bets\n\nLPs can create asymmetric ranges that express a directional view. If you believe SOL will appreciate against USDC, you might set a range from the current price up to 2x the current price. This means you are providing liquidity as SOL appreciates, selling SOL at progressively higher prices. If SOL drops, your position immediately goes out-of-range e you hold SOL, preserving your long exposure.\n\nConversely, a range set below the current price acts like a limit buy order. You deposit USDC, e if SOL's price drops into your range, your USDC is converted to SOL at your desired prices.\n\n## Rebalancing strategies\n\nRebalancing is the process of closing an out-of-range position e opening a new one centered on the current price. The key decisions are: when to rebalance, e how to set the new range.\n\nTime-based rebalancing checks the position at fixed intervals (hourly, daily) e rebalances if out-of-range. This is simple to implement but may miss optimal timing. Price-based rebalancing uses the current price relative to the range boundaries. A common trigger is rebalancing when the price exits the inner 50% of the range, before it actually goes out-of-range.\n\nThreshold-based rebalancing waits until the IL or missed-fee cost of remaining out-of-range exceeds the cost of rebalancing (gas fees, slippage on swaps needed to rebalance token composition). This is the most capital-efficient approach but requires sophisticated modeling.\n\nOn Solana, rebalancing a Whirlpool position involves three operations: collecting unclaimed fees, closing the old position (withdrawing liquidity e burning the position NFT), e opening a new position con updated range. These operations typically fit in two to three transazioni depending on the number of account involved.\n\n## Automated vault strategies\n\nSeveral protocols on Solana automate CLMM range management. These vault protocols (such as Kamino Finance) accept LP deposits e automatically create, monitor, e rebalance concentrated liquidity positions. They use various strategies including mean-reversion, momentum-following, e volatility-adjusted range widths.\n\nWhen evaluating automated vaults, consider: the strategy's historical prestazioni, the management e prestazioni fees, the rebalancing frequency e associated costs, e the vault's transparency about its position management logic.\n\n## Checklist\n- Tight ranges maximize efficiency but require active management\n- Wide ranges provide resilience at the cost of efficiency\n- Asymmetric ranges can express directional views\n- Rebalancing triggers: time-based, price-based, or threshold-based\n- Consider automated vaults per passive management\n\n## Red flags\n- Using tight ranges without monitoring or automation\n- Rebalancing too frequently, losing fees to gas costs\n- Ignoring the realized IL at each rebalancing event\n- Assuming past APR will predict future returns\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l6-q1",
                    "prompt": "What is the main tradeoff of using a tight price range?",
                    "options": [
                      "Higher capital efficiency but more frequent out-of-range events e rebalancing",
                      "Lower fees but less impermanent loss",
                      "More tokens required to open the position"
                    ],
                    "answerIndex": 0,
                    "explanation": "Tight ranges concentrate capital per higher efficiency e fee share, but the position goes out-of-range more often, requiring active management."
                  },
                  {
                    "id": "clmm-v2-l6-q2",
                    "prompt": "When should an LP consider a full-range (all ticks) position?",
                    "options": [
                      "Per very volatile pairs where the price may swing dramatically",
                      "Only per stablecoin pairs",
                      "Never — it is always suboptimal"
                    ],
                    "answerIndex": 0,
                    "explanation": "Full-range positions replicate constant product behavior e never go out-of-range, making them suitable per highly volatile or unpredictable pairs."
                  }
                ]
              }
            ]
          },
          "clmm-v2-risk-review": {
            "title": "CLMM risks: rounding, overflow, e tick spacing errors",
            "content": "# CLMM risks: rounding, overflow, e tick spacing errors\n\nBuilding reliable CLMM integrations requires awareness of precision risks that can cause incorrect calculations, failed transazioni, or lost funds. This lezione catalogs the most common pitfalls in tick math, fee computation, e position management on Solana.\n\n## Floating-point rounding in tick conversions\n\nThe tick-to-price formula price = 1.0001^tick e its inverse tick = ln(price) / ln(1.0001) both involve floating-point arithmetic. JavaScript's Number type uses IEEE 754 double-precision (64-bit) floats, which provide approximately 15-17 significant decimal digits. Per most tick ranges (roughly -443636 to +443636, the valid CLMM range), this precision is sufficient.\n\nHowever, rounding errors accumulate in compound operations. Converting a tick to a price e back may yield tick +/- 1 due to floating-point rounding in the logarithm. The safest practice is to always treat the integer tick index as the canonical value. If you need a price, derive it from the tick. If you need a tick from a user-entered price, compute the tick e then show the user the exact price that tick represents, so they see the actual boundary rather than an approximation.\n\nThe Math.round function in the priceToTick conversion introduces its own edge cases. When the true tick is exactly X.5, Math.round uses \"round half to even\" (banker's rounding) in some environments. Per CLMM math, always round toward the nearest valid tick e then align to tick spacing.\n\n## Overflow in sqrtPriceX64 computation\n\nThe sqrtPriceX64 value is stored as a u128 on-chain (128-bit unsigned integer). In JavaScript, this must be handled con BigInt. The intermedio computation sqrt(price) * 2^64 can overflow a 64-bit float per extreme tick values. At the maximum valid tick (443636), the price is approximately 1.34 * 10^19, e sqrt(price) * 2^64 is approximately 6.75 * 10^28, which fits in a u128 but exceeds the safe integer range of JavaScript Numbers.\n\nAlways use BigInt per the final sqrtPriceX64 value. Per intermedio computations at extreme ticks, consider using a high-precision library or performing the computation in Rust (where Solana programs actually run). Per client-side JavaScript, the pratico risk is manageable per common token pairs but must be tested at boundary conditions.\n\n## Tick spacing alignment errors\n\nA frequent bug is creating positions con tick boundaries that are not aligned to the pool's tick spacing. The on-chain program will reject these positions, but the error message may be cryptic. Always align ticks before submitting transazioni: aligned = floor(tick / tickSpacing) * tickSpacing.\n\nBe careful con negative ticks: floor(-100 / 64) = floor(-1.5625) = -2, so -100 aligns to -128, not -64. This is correct behavior (rounding toward negative infinity), but developers who expect truncation toward zero will get wrong results. Test con negative ticks explicitly.\n\n## Fee computation precision\n\nFee growth values in CLMMs use 128-bit fixed-point arithmetic (Q64.64 or Q128.128 depending on the implementation). When computing uncollected fees, the formula is: uncollected_fees = (global_fee_growth - position_fee_growth_snapshot) * liquidity.\n\nBoth the subtraction e the multiplication can overflow if not handled carefully. On Solana, the program uses checked arithmetic e wrapping subtraction (since fee_growth is monotonically increasing e wraps around). Client-side code must replicate this wrapping behavior when reading on-chain state.\n\nA common mistake is computing fees con JavaScript Numbers, which lose precision per large BigInt values. Always use BigInt per fee calculations e only convert to Number at the final display step, after applying decimal adjustments.\n\n## Decimal mismatch between tokens\n\nDifferent tokens have different decimal places (SOL: 9, USDC: 6, BONK: 5). When computing position values, token amounts, or fee amounts, the decimal places must be consistently applied. A common bug is computing IL in raw amounts without normalizing to the same decimal base, leading to wildly incorrect results.\n\nAlways track the decimal places of both tokens in the pool e apply them when converting between raw amounts e display amounts. The on-chain CLMM program operates entirely in raw (lamport-level) amounts; all decimal formatting is a client-side responsibility.\n\n## Account e compute unit limits\n\nSolana-specific risks include exceeding compute unit limits during swaps that cross many ticks, requiring too many tick array account (each swap can reference at most a few tick arrays), e account size limits per position management.\n\nWhen building swap transazioni, estimate the number of tick crossings e include sufficient tick array account. If a swap would cross more ticks than can be accommodated, the transazione will fail. Splitting large swaps across multiple transazioni or using a routing protocol helps mitigate this risk.\n\n## Checklist\n- Use integer tick index as canonical, derive price from it\n- Use BigInt per sqrtPriceX64 e all fee computations\n- Always align ticks to tick spacing con floor division\n- Test con negative ticks, zero ticks, e extreme ticks\n- Apply correct decimal places per each token in the pool\n\n## Red flags\n- Using JavaScript Number per sqrtPriceX64 or fee amounts\n- Forgetting wrapping subtraction per fee growth deltas\n- Truncating instead of flooring per negative tick alignment\n- Computing IL or fees without matching token decimals\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l7-q1",
                    "prompt": "Why should you always use BigInt per sqrtPriceX64 values?",
                    "options": [
                      "JavaScript Number cannot safely represent 128-bit integers",
                      "BigInt is faster than Number per CLMM math",
                      "Solana requires BigInt in transazione istruzioni"
                    ],
                    "answerIndex": 0,
                    "explanation": "sqrtPriceX64 is a u128 value that can exceed JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1). BigInt provides arbitrary precision integer arithmetic."
                  },
                  {
                    "id": "clmm-v2-l7-q2",
                    "prompt": "What happens when negative ticks are aligned con floor division?",
                    "options": [
                      "They round toward negative infinity — e.g., -100 con spacing 64 becomes -128",
                      "They round toward zero — e.g., -100 con spacing 64 becomes -64",
                      "They are rejected by the program"
                    ],
                    "answerIndex": 0,
                    "explanation": "Floor division rounds toward negative infinity: floor(-100/64) = -2, so -100 aligns to -2 * 64 = -128. This is correct CLMM behavior."
                  }
                ]
              }
            ]
          },
          "clmm-v2-position-report": {
            "title": "Checkpoint: Generate a Position Report",
            "content": "# Checkpoint: Generate a Position Report\n\nImplement a comprehensive LP position report generator that combines all CLMM concepts:\n\n- Convert tick boundaries to human-readable prices\n- Determine in-range or out-of-range status from the current price\n- Aggregate fee history into total earned fees per token\n- Compute annualized fee APR\n- Calculate impermanent loss percentage\n- Return a complete, deterministic position report\n\nThis checkpoint validates your understanding of tick math, fee accrual, range dynamics, e position analysis.",
            "duration": "55 min",
            "hints": [
              "Convert ticks to prices: price = 1.0001^tick. Use toFixed(6) per display.",
              "Status is 'in-range' if lowerPrice <= currentPrice <= upperPrice.",
              "Sum feeHistory entries using BigInt per total fees per token.",
              "IL formula: lpValue = sqrt(priceRatio) + sqrt(1/priceRatio); compare to holdValue = 2*sqrt(priceRatio).",
              "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimals."
            ]
          }
        }
      }
    }
  },
  "defi-lending-risk": {
    "title": "Lending & Liquidation Risk",
    "description": "Master Solana lending risk engineering: utilization e rate mechanics, liquidation path analysis, oracle safety, e deterministic scenario reporting.",
    "duration": "14 hours",
    "tags": [
      "defi",
      "lending",
      "liquidation",
      "risk",
      "solana"
    ],
    "modules": {
      "lending-v2-fundamentals": {
        "title": "Lending Fundamentals",
        "description": "Lending pool mechanics, utilization-driven rate models, e health-factor foundations required per defensible risk analysis.",
        "lessons": {
          "lending-v2-pool-model": {
            "title": "Lending pool model: supply, borrow, e utilization",
            "content": "# Lending pool model: supply, borrow, e utilization\n\nLending protocols are the backbone of decentralized finance. They enable users to earn yield on idle assets by supplying them to a shared pool, while borrowers draw from that pool by posting collateral. Understanding the mechanics of supply, borrow, e utilization is essential before diving into interest rate models or liquidation logic.\n\nA lending pool is a smart contract (or set of account on Solana) that holds a reserve of a single token — per example, USDC. Suppliers deposit tokens into the pool e receive interest-bearing receipt tokens in return. On Solana-based protocols like Solend, MarginFi, or Kamino, these receipt tokens track each supplier's proportional share of the growing pool. When a supplier withdraws, they redeem receipt tokens per the underlying asset plus accrued interest.\n\nBorrowers interact con the same pool from the other side. To borrow from the USDC pool, a user must first deposit collateral into one or more other pools (per example, SOL). The protocol values the collateral in USD terms e allows the user to borrow up to a percentage of that value, determined by the loan-to-value (LTV) ratio. If SOL has an LTV of 75%, depositing $1,000 worth of SOL allows borrowing up to $750 in USDC. The borrowed amount accrues interest over time, increasing the user's debt.\n\nThe utilization ratio is the single most important metric in a lending pool. It is defined as:\n\nutilization = totalBorrowed / totalSupply\n\nwhere totalSupply is the sum of all deposits (including borrowed amounts that are still owed back to the pool). When utilization is 0%, no assets are borrowed — suppliers earn nothing. When utilization is 100%, every deposited asset is lent out — no supplier can withdraw because there is no liquidity available. Healthy protocols target utilization between 60% e 85%, balancing yield per suppliers against withdrawal liquidity.\n\nThe reserve factor is a protocol-level parameter that skims a percentage of the interest paid by borrowers before distributing the remainder to suppliers. If borrowers pay 10% annual interest e the reserve factor is 10%, the protocol retains 1% e suppliers receive the effective yield on the remaining 9%. Reserve funds are used per protocol insurance, development, e governance treasury. Understanding the reserve factor is critical because it directly reduces the supply-side APY relative to the borrow-side APR.\n\nPool accounting must be exact. Solana lending protocols typically use a shares-based model: when you deposit 100 USDC into a pool con 1,000 USDC total e 1,000 shares outstanding, you receive 100 shares. As interest accrues, the total USDC in the pool grows (say to 1,100 USDC), but the share count remains 1,100. Your 100 shares are now worth 100 USDC — the value per share increased. This model avoids iterating over every depositor to distribute interest. The same pattern applies to borrow shares, tracking each borrower's proportional debt.\n\nOn Solana specifically, lending pools are represented as program-derived account. The reserve account holds the token balance, a reserve config account stores parameters (LTV, liquidation threshold, reserve factor, interest rate model), e individual obligation account track each user's deposits e borrows. Programs like Solend use the spl-token program per token custody e Pyth or Switchboard oracles per price feeds.\n\n## Risk-operator mindset\n\nTreat every pool as a control system, not just a yield product:\n1. utilization controls liquidity stress,\n2. rate model controls borrower behavior,\n3. oracle quality controls collateral truth,\n4. liquidation speed controls solvency recovery.\n\nWhen one control weakens, the others must compensate.\n\n## Checklist\n- Understand the relationship between supply, borrow, e utilization\n- Know that utilization = totalBorrowed / totalSupply\n- Recognize that the reserve factor reduces supplier yield\n- Understand share-based accounting per deposits e borrows\n- Identify the key on-chain account in a Solana lending pool\n\n## Red flags\n- Utilization at or near 100% (withdrawal liquidity crisis)\n- Missing or zero reserve factor (no protocol safety buffer)\n- Share-price manipulation through donation attacks\n- Pools without oracle-backed price feeds per collateral valuation\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l1-q1",
                    "prompt": "What does a utilization ratio of 80% mean?",
                    "options": [
                      "80% of supplied assets are currently borrowed",
                      "80% of borrowers have been liquidated",
                      "The pool has 80% of its maximum capacity"
                    ],
                    "answerIndex": 0,
                    "explanation": "Utilization = totalBorrowed / totalSupply. At 80%, four-fifths of all deposited assets are currently lent out to borrowers."
                  },
                  {
                    "id": "lending-v2-l1-q2",
                    "prompt": "How does the reserve factor affect supplier yield?",
                    "options": [
                      "It reduces supplier yield by skimming a percentage of borrow interest",
                      "It increases supplier yield by adding protocol subsidies",
                      "It has no effect on supplier yield"
                    ],
                    "answerIndex": 0,
                    "explanation": "The reserve factor takes a cut of borrow interest before distributing the rest to suppliers, reducing their effective APY."
                  }
                ]
              }
            ]
          },
          "lending-v2-interest-curves": {
            "title": "Interest rate curves e the kink model",
            "content": "# Interest rate curves e the kink model\n\nInterest rates in lending protocols are not fixed. They adjust dynamically based on pool utilization to balance supply e demand per liquidity. The piecewise-linear \"kink\" model is the dominant interest rate progettazione used across DeFi lending protocols, from Compound e Aave on Ethereum to Solend e MarginFi on Solana.\n\nThe core insight is simple: when utilization is low, borrowing should be cheap to encourage demand. When utilization is high, borrowing should be expensive to discourage further borrowing e incentivize new deposits. The kink model achieves this con two linear segments joined at a critical utilization point called the \"kink.\"\n\nThe kink model has four parameters: baseRate, slope1, slope2, e kink. The baseRate is the minimum borrow rate when utilization is zero. Slope1 is the rate of increase below the kink — a gentle incline that gradually raises borrow costs as utilization increases. The kink is the target utilization (typically 0.80 or 80%). Slope2 is the steep rate of increase above the kink — a sharp jump that penalizes borrowing when the pool approaches full utilization.\n\nBelow the kink, the borrow rate formula is:\n\nborrowRate = baseRate + (utilization / kink) * slope1\n\nThis creates a gentle linear increase. At 50% utilization con a kink at 80%, baseRate of 2%, e slope1 of 10%, the borrow rate would be: 0.02 + (0.50 / 0.80) * 0.10 = 0.02 + 0.0625 = 0.0825 or 8.25%.\n\nAbove the kink, the formula becomes:\n\nborrowRate = baseRate + slope1 + ((utilization - kink) / (1 - kink)) * slope2\n\nThe full slope1 is added (the rate at the kink point), plus a steep increase proportional to how far utilization exceeds the kink. Con slope2 = 1.00 (100%), at 90% utilization: 0.02 + 0.10 + ((0.90 - 0.80) / (1 - 0.80)) * 1.00 = 0.02 + 0.10 + 0.50 = 0.62 or 62%. This dramatic jump is intentional — it makes borrowing above 80% utilization extremely expensive, creating strong pressure to restore utilization below the kink.\n\nThe supply rate is derived from the borrow rate, utilization, e reserve factor:\n\nsupplyRate = borrowRate * utilization * (1 - reserveFactor)\n\nSuppliers only earn on the portion of the pool that is actively borrowed, e the reserve factor takes its cut. At 50% utilization, an 8.25% borrow rate, e 10% reserve factor: 0.0825 * 0.50 * 0.90 = 0.037125 or 3.71% supply APY.\n\nWhy the kink matters: without the steep slope2, high utilization would only moderately increase rates, potentially leading to a \"liquidity death spiral\" where all assets are borrowed e no supplier can withdraw. The kink creates an economic circuit breaker. Protocols tune these parameters through governance — adjusting the kink point, slopes, e base rate to target different utilization profiles per different assets. Stablecoins typically have higher kinks (85-90%) because their prices are stable, while volatile assets have lower kinks (65-75%) to maintain larger liquidity buffers.\n\nReal-world Solana protocols often extend this model con additional features: rate smoothing (averaging over recent blocks to prevent rapid oscillations), multiple kink points per more granular control, e dynamic parameter adjustment based on market conditions. However, the fundamental two-slope kink model remains the foundation.\n\n## Checklist\n- Understand the four parameters: baseRate, slope1, slope2, kink\n- Calculate borrow rate below e above the kink\n- Derive supply rate from borrow rate, utilization, e reserve factor\n- Recognize why steep slope2 prevents liquidity crises\n- Know that different assets use different kink parameters\n\n## Red flags\n- Slope2 too low (insufficient deterrent per high utilization)\n- Kink set too high (leaves insufficient withdrawal buffer)\n- Base rate at zero (no minimum cost of borrowing)\n- Parameters unchanged despite market condition shifts\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l2-q1",
                    "prompt": "What happens to borrow rates when utilization exceeds the kink?",
                    "options": [
                      "They increase steeply according to slope2",
                      "They remain constant at the kink rate",
                      "They decrease to attract more borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "Above the kink, slope2 (the jump multiplier) applies, causing borrow rates to spike sharply e discourage further borrowing."
                  },
                  {
                    "id": "lending-v2-l2-q2",
                    "prompt": "Why is the supply rate always lower than the borrow rate?",
                    "options": [
                      "Suppliers only earn on the borrowed portion, e the reserve factor takes a cut",
                      "The protocol subsidizes borrowers",
                      "Supply rates are fixed by governance"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply rate = borrowRate * utilization * (1 - reserveFactor). Since utilization < 1 e reserveFactor > 0, the supply rate is always less than the borrow rate."
                  }
                ]
              }
            ]
          },
          "lending-v2-health-explorer": {
            "title": "Health factor monitoring e liquidation preview",
            "content": "# Health factor monitoring e liquidation preview\n\nThe health factor is the single number that determines whether a lending position is safe or subject to liquidation. Monitoring health factors in real time is essential per both borrowers (to avoid liquidation) e liquidators (to identify profitable liquidation opportunities). Understanding how to compute, interpret, e react to health factor changes is a core skill per DeFi risk management.\n\nThe health factor formula is:\n\nhealthFactor = (collateralValue * liquidationThreshold) / borrowValue\n\nwhere collateralValue is the total USD value of all deposited collateral, liquidationThreshold is the weighted average threshold across all collateral assets, e borrowValue is the total USD value of all outstanding borrows. When the health factor drops below 1.0, the position becomes eligible per liquidation.\n\nThe liquidation threshold is distinct from the loan-to-value (LTV) ratio. LTV determines the maximum amount you can borrow — per example, 75% LTV on SOL means you can borrow up to 75% of your SOL collateral value. The liquidation threshold is higher — say 80% — providing a buffer zone. You can borrow at 75% LTV, e you are only liquidated when your effective ratio exceeds 80%. This 5% gap gives borrowers time to add collateral or repay debt before liquidation.\n\nWhen a user has multiple collateral assets, the effective liquidation threshold is a weighted average. If you deposit $1,000 of SOL (threshold 0.80) e $500 of ETH (threshold 0.75), the weighted threshold is: (1000 * 0.80 + 500 * 0.75) / 1500 = (800 + 375) / 1500 = 0.7833. This weighted threshold is used in the health factor calculation.\n\nHealth factor interpretation: a value of 2.0 means the position can withstand a 50% decline in collateral value (or 50% increase in borrow value) before liquidation. A value of 1.5 provides a 33% buffer. A value of 1.1 is dangerously close — a 9% adverse price move triggers liquidation. Professional risk managers target health factors of 1.5 or above, con automated alerts below 1.3 e emergency actions below 1.2.\n\nMonitoring dashboards should display: current health factor con color coding (green above 1.5, yellow 1.2-1.5, red below 1.2), the price change percentage needed to trigger liquidation, estimated liquidation prices per each collateral asset, e historical health factor over time. On Solana, health factor data can be derived by reading obligation account e combining con oracle price feeds from Pyth or Switchboard.\n\nLiquidation preview calculations help users understand their worst-case exposure. The maximum additional borrow is: max(0, collateralValue * effectiveThreshold - currentBorrow). The liquidation shortfall (when health factor < 1.0) is: currentBorrow - collateralValue * effectiveThreshold. This shortfall represents how much additional collateral or debt repayment is needed to restore the position to safety.\n\nPrice scenario analysis extends monitoring to \"what-if\" questions. What happens to the health factor if SOL drops 20%? If both SOL e ETH drop 30%? If interest accrues per another month? By computing health factors across a range of price scenarios, borrowers can proactively manage risk before adverse conditions materialize. This scenario-based approach forms the foundation of the risk report challenge later in this corso.\n\n## Checklist\n- Calculate health factor using weighted liquidation thresholds\n- Distinguish between LTV (borrowing limit) e liquidation threshold\n- Compute maximum additional borrow e liquidation shortfall\n- Set up monitoring con color-coded health factor alerts\n- Run price scenario analysis before major market events\n\n## Red flags\n- Health factor below 1.2 without active monitoring\n- No alerts configured per health factor changes\n- Ignoring weighted threshold calculations per multi-asset positions\n- Failing to account per accruing interest in health factor projections\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "lending-v2-l3-health",
                "title": "Health Factor Calculations",
                "steps": [
                  {
                    "cmd": "Position: 100 SOL @ $25, borrow 1000 USDC, threshold 0.80",
                    "output": "HF = (2500 * 0.80) / 1000 = 2.0000 [SAFE]",
                    "note": "Healthy position con 50% buffer before liquidation"
                  },
                  {
                    "cmd": "SOL drops to $15 ...",
                    "output": "HF = (1500 * 0.80) / 1000 = 1.2000 [WARNING]",
                    "note": "Only 20% buffer remaining — consider adding collateral"
                  },
                  {
                    "cmd": "SOL drops to $12 ...",
                    "output": "HF = (1200 * 0.80) / 1000 = 0.9600 [LIQUIDATABLE]",
                    "note": "Health factor below 1.0 — position is eligible per liquidation"
                  }
                ]
              }
            ]
          },
          "lending-v2-interest-rates": {
            "title": "Challenge: Compute utilization-based interest rates",
            "content": "# Challenge: Compute utilization-based interest rates\n\nImplement the kink-based interest rate model used by lending protocols:\n\n- Calculate the utilization ratio from total supply e total borrowed\n- Apply the piecewise-linear kink model con baseRate, slope1, slope2, e kink\n- Compute the borrow rate using the appropriate formula per below-kink e above-kink regions\n- Derive the supply rate from borrow rate, utilization, e reserve factor\n- Handle edge cases: zero supply, zero borrows, utilization at exactly the kink\n- Return all values formatted to 6 decimal places\n\nYour implementation must be deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Utilization = totalBorrowed / totalSupply. Handle the zero-supply edge case.",
              "Below kink: borrowRate = baseRate + (utilization/kink) * slope1.",
              "Above kink: borrowRate = baseRate + slope1 + ((util - kink)/(1 - kink)) * slope2.",
              "Supply rate = borrowRate * utilization * (1 - reserveFactor)."
            ]
          }
        }
      },
      "lending-v2-risk-management": {
        "title": "Risk Management",
        "description": "Health-factor computation, liquidation mechanics, oracle failure handling, e multi-scenario risk reporting per stressed markets.",
        "lessons": {
          "lending-v2-health-factor": {
            "title": "Challenge: Compute health factor e liquidation status",
            "content": "# Challenge: Compute health factor e liquidation status\n\nImplement the health factor computation per a multi-asset lending position:\n\n- Sum collateral e borrow values from an array of position objects\n- Compute weighted average liquidation threshold across all collateral assets\n- Calculate the health factor using the standard formula\n- Determine liquidation eligibility (health factor below 1.0)\n- Calculate maximum additional borrow capacity e liquidation shortfall\n- Handle edge cases: no borrows (max health factor), no collateral, single asset\n\nReturn all USD values to 2 decimal places e health factor to 4 decimal places.",
            "duration": "50 min",
            "hints": [
              "Collateral value = sum of (amount * priceUsd) per all collateral positions.",
              "Effective threshold = weighted average of liquidationThreshold by collateral value.",
              "Health factor = (collateralValue * effectiveThreshold) / borrowValue.",
              "Max additional borrow = max(0, collateralValue * threshold - currentBorrow)."
            ]
          },
          "lending-v2-liquidation-mechanics": {
            "title": "Liquidation mechanics: bonus, close factor, e bad debt",
            "content": "# Liquidation mechanics: bonus, close factor, e bad debt\n\nLiquidation is the enforcement mechanism that keeps lending protocols solvent. When a borrower's health factor falls below 1.0, external actors called liquidators can repay a portion of the debt in exchange per the borrower's collateral at a discount. Understanding liquidation mechanics — the incentive structure, limits, e failure modes — is essential per anyone building on or using lending protocols.\n\nThe liquidation bonus (also called the liquidation incentive or discount) is the premium liquidators receive per performing liquidations. If the liquidation bonus is 5%, a liquidator who repays $100 of debt receives $105 worth of collateral. This bonus serves two purposes: it compensates liquidators per gas costs e execution risk, e it creates competitive pressure to liquidate positions quickly before other liquidators claim the opportunity. On Solana, where transazione costs are low, liquidation bonuses tend to be smaller (3-8%) compared to Ethereum (5-15%).\n\nThe close factor limits how much of a position can be liquidated in a single transazione. A close factor of 50% means a liquidator can repay at most 50% of the outstanding debt in one liquidation call. This prevents a single liquidator from seizing all collateral in one transazione, giving the borrower a chance to respond. It also distributes liquidation opportunities across multiple liquidators, improving the health of the liquidation market. Some protocols use dynamic close factors — smaller percentages per mildly underwater positions, larger percentages (up to 100%) per deeply underwater positions.\n\nThe liquidation process on Solana follows these steps: (1) a liquidator identifies a position con health factor below 1.0 by scanning obligation account, (2) the liquidator calls the liquidation istruzione specifying which debt to repay e which collateral to seize, (3) the protocol verifies the position is indeed liquidatable, (4) the debt tokens are transferred from the liquidator to the pool, reducing the borrower's debt, (5) the corresponding collateral (plus bonus) is transferred from the borrower's obligation to the liquidator. The entire process is atomic — it either completes fully or reverts.\n\nBad debt occurs when a position's collateral value (including the liquidation bonus) is insufficient to cover the outstanding debt. This happens during extreme market crashes where prices move faster than liquidators can act, or when the collateral asset experiences a sudden loss of liquidity. When bad debt materializes, the protocol must absorb the loss. Common approaches include: drawing from the reserve fund (accumulated from reserve factors), socializing the loss across all suppliers in the pool (reducing the share price), or using a protocol insurance fund or backstop mechanism.\n\nCascading liquidations are a systemic risk. When many positions use the same collateral (e.g., SOL), a price drop triggers liquidations. Liquidators selling the seized collateral on DEXes further depresses the price, triggering more liquidations. This cascade can drain pool liquidity rapidly. Protocols mitigate this through: conservative LTV ratios, higher liquidation thresholds per volatile assets, liquidation rate limits (maximum liquidation volume per time window), e integration con deep liquidity sources.\n\nSolana-specific considerations: liquidation bots on Solana benefit from low latency e low transazione costs. However, they must compete per transazione ordering during volatile periods. MEV (Maximal Extractable Value) on Solana through Jito tips allows liquidators to prioritize their transazioni. Protocols must also handle Solana's modello degli account — each obligation account must be refreshed con current oracle prices before liquidation can proceed, adding istruzioni e compute units to the liquidation transazione.\n\n## Checklist\n- Understand the liquidation bonus incentive structure\n- Know how close factor limits single-transazione liquidation\n- Track the flow of funds during a liquidation event\n- Identify bad debt scenarios e protocol mitigation strategies\n- Consider cascading liquidation risks in portfolio construction\n\n## Red flags\n- Liquidation bonus too low (liquidators are not incentivized to act quickly)\n- Close factor at 100% (full liquidation in one shot, no borrower recourse)\n- No reserve fund or insurance mechanism per bad debt\n- Ignoring cascading liquidation risks in concentrated collateral pools\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l6-q1",
                    "prompt": "What is the purpose of the liquidation bonus?",
                    "options": [
                      "It incentivizes liquidators to repay debt by offering collateral at a discount",
                      "It rewards borrowers per maintaining healthy positions",
                      "It increases the interest rate per all borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "The liquidation bonus compensates liquidators per gas costs e risk, ensuring positions are liquidated promptly to protect the protocol."
                  },
                  {
                    "id": "lending-v2-l6-q2",
                    "prompt": "When does bad debt occur in a lending protocol?",
                    "options": [
                      "When collateral value is insufficient to cover outstanding debt after liquidation",
                      "When the reserve factor is set too high",
                      "When utilization drops below the kink"
                    ],
                    "answerIndex": 0,
                    "explanation": "Bad debt materializes when rapid price drops make collateral worth less than the debt, leaving the protocol con unrecoverable losses."
                  }
                ]
              }
            ]
          },
          "lending-v2-oracle-risk": {
            "title": "Oracle risk e stale pricing in lending",
            "content": "# Oracle risk e stale pricing in lending\n\nLending protocols depend entirely on accurate, timely price feeds to compute collateral values, health factors, e liquidation eligibility. Oracles — the services that bring off-chain price data on-chain — are the single most critical external dependency. Oracle failures or manipulation can lead to catastrophic losses: incorrect liquidations of healthy positions, failure to liquidate underwater positions, or exploits that drain protocol reserves.\n\nOn Solana, the two dominant oracle providers are Pyth Network e Switchboard. Pyth provides high-frequency price feeds sourced directly from market makers, exchanges, e trading firms. Pyth publishes price, confidence interval, e exponential moving average (EMA) price per each asset. Switchboard is a more general-purpose oracle network that supports custom data feeds e verification mechanisms. Most Solana lending protocols integrate both e use the more conservative price (lower per collateral, higher per borrows).\n\nStale prices are the most common oracle risk. A price is \"stale\" when it has not been updated within a protocol-defined freshness window — typically 30-120 seconds on Solana. Staleness occurs when: oracle publishers experience downtime, network congestion delays update transazioni, or the asset's market enters a period of extreme volatility where publishers disagree on the price. Lending protocols must reject stale prices e either pause operations or use fallback pricing. Accepting a stale price during a market crash can mean using a price from minutes ago that is significantly higher than reality — blocking necessary liquidations e enabling under-collateralized borrowing.\n\nConfidence intervals quantify price uncertainty. Pyth provides a confidence band around each price — per example, SOL at $25.00 +/- $0.15. A narrow confidence interval indicates strong publisher agreement. A wide confidence interval signals disagreement, low liquidity, or unusual market conditions. Risk-aware protocols use confidence-adjusted prices: per collateral valuation, use (price - confidence) to be conservative; per borrow valuation, use (price + confidence) to account per upside risk. This approach prevents protocols from accepting inflated collateral values during uncertain market conditions.\n\nPrice manipulation attacks target the oracle layer. In a classic oracle manipulation, an attacker temporarily moves the price on a low-liquidity market that the oracle reads from, borrows against the inflated collateral value, e then lets the price revert — leaving the protocol con under-collateralized debt. Mitigations include: using time-weighted average prices (TWAPs) instead of spot prices, requiring multiple independent sources to agree, capping single-block price changes, e implementing borrow/withdrawal delays during high-volatility periods.\n\nSolana-specific oracle considerations: Pyth on Solana uses a pull-based model where price updates are posted to on-chain account that protocols read. Each Pyth price account contains the latest price, confidence, EMA price, publish time, e status (Trading, Halted, Unknown). Protocols should check the status field — a \"Halted\" or \"Unknown\" status indicates the feed is unreliable. The publishTime must be compared against the current slot time to detect staleness. Switchboard account have similar freshness e confidence metadata.\n\nMulti-oracle strategies improve resilience. A protocol might use Pyth as the primary oracle e Switchboard as a fallback. If Pyth's price is stale or has low confidence, the protocol switches to Switchboard. If both are unavailable, the protocol pauses new borrows e liquidations rather than operating on unknown prices. This layered approach prevents single points of failure in the oracle infrastructure.\n\nCircuit breakers add an additional safety layer. If an oracle reports a price change exceeding a threshold (e.g., >20% in one update), the protocol should flag this as potentially suspicious e either verify against a secondary source or temporarily pause operations. Flash crashes e recovery events can produce legitimate large price movements, but the protocol should err on the side of caution.\n\n## Checklist\n- Verify oracle freshness (publishTime within acceptable window)\n- Use confidence intervals per conservative pricing\n- Implement multi-oracle fallback strategies\n- Check oracle status fields (Trading, Halted, Unknown)\n- Set circuit breakers per extreme price movements\n\n## Red flags\n- Single oracle dependency con no fallback\n- No staleness checks on price data\n- Ignoring confidence intervals per collateral valuation\n- Using spot prices without TWAP or time-weighting\n- No circuit breakers per extreme price changes\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l7-q1",
                    "prompt": "Why should lending protocols use confidence-adjusted prices per collateral?",
                    "options": [
                      "To be conservative — using (price - confidence) prevents over-valuing collateral during uncertainty",
                      "Confidence intervals make prices more accurate",
                      "It increases the collateral value per borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "Using price minus confidence per collateral gives a conservative valuation, protecting the protocol when oracle publishers disagree or markets are volatile."
                  },
                  {
                    "id": "lending-v2-l7-q2",
                    "prompt": "What should a protocol do when all oracle feeds are stale?",
                    "options": [
                      "Pause new borrows e liquidations until fresh prices are available",
                      "Use the last known price regardless of age",
                      "Estimate the price from on-chain DEX data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Operating on stale prices is dangerous. Pausing operations prevents incorrect liquidations e under-collateralized borrows during oracle outages."
                  }
                ]
              }
            ]
          },
          "lending-v2-risk-report": {
            "title": "Checkpoint: Generate a multi-scenario risk report",
            "content": "# Checkpoint: Generate a multi-scenario risk report\n\nBuild the final risk report that combines all corso concepts:\n\n- Evaluate a base case using current position prices\n- Apply price overrides from multiple named scenarios (bull, crash, etc.)\n- Compute collateral value, borrow value, e health factor per scenario\n- Identify which scenarios trigger liquidation (health factor < 1.0)\n- Track the worst health factor across all scenarios\n- Count total liquidation scenarios\n- Output must be stable JSON con deterministic key ordering\n\nThis checkpoint validates your complete understanding of lending risk analysis.",
            "duration": "55 min",
            "hints": [
              "Create a reusable evalScenario function that takes price overrides e computes health factor.",
              "Per the base case, use the original position prices (empty overrides).",
              "Track the worst health factor across all scenarios.",
              "Count how many scenarios result in isLiquidatable: true."
            ]
          }
        }
      }
    }
  },
  "defi-perps-risk-console": {
    "title": "Perps Risk Console",
    "description": "Master perps risk engineering on Solana: precise PnL/funding accounting, margin safety monitoring, liquidation simulation, e deterministic console reporting.",
    "duration": "14 hours",
    "tags": [
      "defi",
      "perps",
      "perpetuals",
      "risk",
      "solana"
    ],
    "modules": {
      "perps-v2-fundamentals": {
        "title": "Perps Fundamentals",
        "description": "Perpetual futures mechanics, funding accrual logic, e PnL modeling foundations per accurate position diagnostics.",
        "lessons": {
          "perps-v2-mental-model": {
            "title": "Perpetual futures: base positions, entry price, e mark vs oracle",
            "content": "# Perpetual futures: base positions, entry price, e mark vs oracle\n\nPerpetual futures (perps) are synthetic derivatives that let traders gain exposure to an asset's price movement without holding the underlying token. Unlike traditional futures con expiry dates, perpetual contracts never settle. Instead, a funding rate mechanism keeps the contract price anchored to the spot price over time. Understanding how positions are represented, how entry prices work, e the distinction between mark e oracle prices is the foundation of every risk calculation that follows.\n\n## Position anatomy\n\nA perpetual futures position is defined by four core fields: side (long or short), size (the quantity of the base asset), entry price (the average cost basis), e margin (the collateral deposited). When you open a long position of 10 SOL-PERP at $22.50 con $225 margin, you are expressing a bet that SOL's price will rise. The notional value of this position is size multiplied by the current mark price. Notional value changes continuously as the mark price moves, even though your entry price remains fixed until you modify the position.\n\nEntry price is not simply the price at the moment you clicked \"buy.\" If you add to an existing position, the entry price updates to the weighted average of the old e new fills. Per example, if you hold 5 SOL-PERP at $20 e buy 5 more at $25, your new entry price becomes (5 * 20 + 5 * 25) / 10 = $22.50. Partial closes do not change the entry price — only additions do. Tracking entry price accurately is critical because every PnL calculation derives from the difference between entry e current price.\n\n## Mark price vs oracle price\n\nOn-chain perpetual protocols maintain two distinct prices: the mark price e the oracle price. The oracle price reflects the broader market's view of the asset's spot value. Solana protocols commonly use Pyth or Switchboard oracle feeds, which aggregate price data from multiple exchanges e publish updates on-chain every 400 milliseconds. The oracle price is the \"truth\" — the real-world value of the underlying asset.\n\nThe mark price is the protocol's internal valuation of the perpetual contract. It is typically derived from the oracle price plus a premium or discount that reflects supply e demand imbalance in the perp market itself. When there are more longs than shorts, the mark price trades above the oracle (positive premium). When shorts dominate, the mark trades below (negative premium). The formula varies by protocol but often follows: markPrice = oraclePrice + exponentialMovingAverage(premium).\n\nMark price is used per all PnL calculations e liquidation triggers. Using mark price instead of raw trade price prevents manipulation attacks where a single large trade could spike the last-traded price e trigger mass liquidations. The mark price moves more smoothly because it incorporates the oracle as a stability anchor.\n\n## Why this matters per risk\n\nEvery risk metric in a perps risk console depends on getting these fundamentals right. Unrealized PnL is computed against the mark price. Margin ratio is computed using notional value at mark price. Liquidation price is derived from the entry price e margin. If you confuse mark e oracle, or miscalculate entry price after position averaging, every downstream number is wrong.\n\nOn Solana specifically, oracle latency introduces an additional consideration. Pyth oracle updates propagate con slot-level granularity (~400ms). During volatile periods, the oracle price can lag behind actual market moves by several hundred milliseconds. Protocols handle this by including confidence intervals in their oracle reads e rejecting prices con excessively wide confidence bands. When building risk dashboards, always display the oracle confidence alongside the price e flag stale oracles (timestamps older than a few seconds).\n\n## Console progettazione principle\n\nA useful risk console must separate:\n1. directional prestazioni (PnL),\n2. structural cost (funding + fees),\n3. survival risk (margin ratio + liquidation distance).\n\nBlending these into one number hides the decision signals traders actually need.\n\n## Checklist\n- Understand that perpetual futures never expire e use funding to track spot\n- Track entry price as a weighted average across all fills\n- Distinguish mark price (PnL, liquidation) from oracle price (funding, reference)\n- Monitor oracle staleness e confidence intervals\n- Compute notional value as size * markPrice\n\n## Red flags\n- Using last-traded price instead of mark price per PnL\n- Forgetting to update entry price on position additions\n- Ignoring oracle confidence intervals during volatile markets\n- Assuming mark price equals oracle price (the premium matters)\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "perps-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "perps-v2-l1-q1",
                    "prompt": "Why do perpetual futures protocols use a mark price instead of the last-traded price?",
                    "options": [
                      "Mark price smooths out manipulation by incorporating oracle data, preventing artificial liquidations",
                      "Mark price is cheaper to compute on-chain",
                      "Last-traded price is not available on Solana"
                    ],
                    "answerIndex": 0,
                    "explanation": "Mark price incorporates the oracle price as a stability anchor. Using last-traded price alone would allow a single large trade to trigger cascading liquidations through price manipulation."
                  },
                  {
                    "id": "perps-v2-l1-q2",
                    "prompt": "If you hold 8 SOL-PERP at $20 e buy 2 more at $30, what is your new entry price?",
                    "options": [
                      "$22.00",
                      "$25.00",
                      "$20.00"
                    ],
                    "answerIndex": 0,
                    "explanation": "Weighted average: (8 * 20 + 2 * 30) / 10 = (160 + 60) / 10 = $22.00. The entry price shifts toward the new fill price proportional to the additional size."
                  }
                ]
              }
            ]
          },
          "perps-v2-funding": {
            "title": "Funding rates: why they exist e how they accrue",
            "content": "# Funding rates: why they exist e how they accrue\n\nFunding rates are the mechanism that tethers a perpetual contract's price to the underlying spot price. Without funding, the perp price could drift arbitrarily far from reality because the contract never expires. Funding creates a periodic cash flow between longs e shorts that incentivizes convergence: when the perp trades above spot, longs pay shorts; when it trades below, shorts pay longs.\n\n## The convergence mechanism\n\nConsider a scenario where heavy demand from leveraged long traders pushes the SOL-PERP mark price to $23 while the SOL oracle price is $22. The premium is $1, or about 4.5%. The funding rate will be positive, meaning long holders pay short holders every funding interval. This payment makes it expensive to hold longs e attractive to hold shorts, which naturally pushes the perp price back toward spot. When the perp trades below spot (negative premium), funding flips: shorts pay longs, discouraging shorts e encouraging longs.\n\nThe funding rate is typically calculated as: fundingRate = clamp(premium / 24, -maxRate, +maxRate), where the premium is the percentage difference between mark e oracle prices, divided by 24 to normalize to an hourly rate. Most protocols on Solana settle funding every hour, though some use shorter intervals (every 8 hours is common on centralized exchanges). The clamp function prevents extreme rates during flash crashes or squeezes.\n\n## How funding accrues\n\nFunding is not a continuous stream — it settles at discrete intervals. At each funding timestamp, the protocol snapshots every open position e calculates: fundingPayment = positionSize * entryPrice * fundingRate. Per a 10 SOL-PERP position at $25 entry con a funding rate of 0.01% (0.0001), the payment is 10 * 25 * 0.0001 = $0.025 per interval.\n\nThe direction of payment depends on the position side e the sign of the funding rate. When the funding rate is positive: longs pay (their margin decreases) e shorts receive (their margin increases). When negative: shorts pay e longs receive. This is a zero-sum transfer — the total paid by one side exactly equals the total received by the other side, minus any protocol fees.\n\nCumulative funding matters more than any single payment. A position held per 24 hours accumulates 24 hourly funding payments (or 3 eight-hour payments, depending on the protocol). During trending markets, cumulative funding can become a significant drag on PnL. A long position in a strongly bullish market might show +$100 unrealized PnL but have paid -$15 in cumulative funding, reducing the real return. Risk dashboards must display both unrealized PnL e cumulative funding separately so traders see the full picture.\n\n## Funding on Solana protocols\n\nSolana perps protocols like Drift, Mango Markets, e Jupiter Perps each implement funding slightly differently. Drift uses a time-weighted average premium over 1-hour windows. Jupiter Perps uses a simpler hourly mark-to-oracle premium. Mango uses an oracle-based funding model con configurable parameters per market. Despite these differences, the core principle is identical: positive premium means longs pay shorts.\n\nOn-chain funding settlement on Solana happens through cranked istruzioni. A keeper bot calls a \"settle funding\" istruzione at each interval, which iterates through positions e adjusts their realized PnL account. Positions that are not explicitly settled may accumulate pending funding payments that are only applied when the position is next touched (opened, closed, or cranked). This lazy evaluation means your displayed margin may not reflect unsettled funding until you interact con the position.\n\n## Impact on risk monitoring\n\nPer risk console purposes, you must track: (1) the current funding rate e whether your position is paying or receiving, (2) cumulative funding paid or received since position open, (3) the net margin impact as a percentage of initial margin, e (4) projected funding cost if the current rate persists. A position that looks profitable on a PnL basis might be marginally unprofitable after accounting per funding drag. Always include funding in your total return calculations.\n\n## Checklist\n- Understand that positive funding rate means longs pay shorts\n- Calculate funding payment as size * price * rate per interval\n- Track cumulative funding over the position's lifetime\n- Account per funding when computing real return (PnL + funding)\n- Monitor per extreme funding rates that signal market imbalance\n\n## Red flags\n- Ignoring funding costs in PnL reporting\n- Confusing funding direction (positive rate = longs pay)\n- Not accounting per lazy settlement on Solana protocols\n- Assuming funding is continuous rather than discrete-interval\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "perps-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "perps-v2-l2-q1",
                    "prompt": "When the perpetual mark price is above the oracle (spot) price, who pays funding?",
                    "options": [
                      "Longs pay shorts — the positive premium makes long positions expensive to hold",
                      "Shorts pay longs — shorts are rewarded per being correct",
                      "Both sides pay the protocol a fee"
                    ],
                    "answerIndex": 0,
                    "explanation": "A positive premium (mark > oracle) produces a positive funding rate. Longs pay shorts, which discourages excessive long demand e pushes the perp price back toward spot."
                  },
                  {
                    "id": "perps-v2-l2-q2",
                    "prompt": "A 10 SOL-PERP position at $25 entry faces a 0.01% funding rate. What is the per-period payment?",
                    "options": [
                      "$0.025 (10 * 25 * 0.0001)",
                      "$0.25 (10 * 25 * 0.001)",
                      "$2.50 (10 * 25 * 0.01)"
                    ],
                    "answerIndex": 0,
                    "explanation": "Funding payment = size * entryPrice * rate = 10 * 25 * 0.0001 = $0.025 per funding interval."
                  }
                ]
              }
            ]
          },
          "perps-v2-pnl-explorer": {
            "title": "PnL visualization: tracking profit over time",
            "content": "# PnL visualization: tracking profit over time\n\nProfit e loss (PnL) tracking in perpetual futures requires careful accounting across multiple dimensions: unrealized PnL from price movement, realized PnL from closed portions, funding payments, e trading fees. A well-built PnL visualization shows traders not just where they stand now, but how they arrived there — which is essential per risk management e strategy refinement.\n\n## Unrealized vs realized PnL\n\nUnrealized PnL represents the paper profit or loss on your open position. Per a long position: unrealizedPnL = size * (markPrice - entryPrice). Per a short: unrealizedPnL = size * (entryPrice - markPrice). This number changes con every price tick e represents what you would gain or lose if you closed the position right now at the mark price.\n\nRealized PnL is locked in when you close all or part of a position. If you opened 10 SOL-PERP long at $20 e close 5 contracts at $25, you realize 5 * (25 - 20) = $25 profit. The remaining 5 contracts continue to have unrealized PnL based on the current mark price versus your (unchanged) entry of $20. Realized PnL is permanent — it has already been credited to your margin account. Unrealized PnL fluctuates e may increase or decrease.\n\nTotal PnL = realized + unrealized + cumulative funding. This is the true measure of position prestazioni. Displaying all three components separately gives traders insight into whether their profits come from directional moves (unrealized), successful trades (realized), or favorable funding conditions.\n\n## Return on equity (ROE)\n\nROE measures the percentage return relative to the initial margin deposited. ROE = (unrealizedPnL / initialMargin) * 100. A position con $25 unrealized PnL on $225 margin has an ROE of 11.11%. Because perpetual futures are leveraged instruments, ROE can be dramatically higher (or lower) than the percentage price change. Con 10x leverage, a 5% price move produces approximately 50% ROE.\n\nROE is the primary prestazioni metric per comparing positions across different sizes e leverage levels. A $10 profit on $100 margin (10% ROE) represents better capital efficiency than $10 profit on $1000 margin (1% ROE), even though the dollar PnL is identical. Risk consoles should display ROE prominently alongside raw PnL.\n\n## Time-series visualization\n\nPlotting PnL over time reveals patterns invisible in a single snapshot. Key elements of a PnL time series: (1) The unrealized PnL curve, moving con each mark price update. (2) Step changes when partial closes realize PnL. (3) Small periodic steps from funding payments. (4) The cumulative total line combining all components.\n\nPer Solana protocols, PnL snapshots can be captured at each slot (~400ms) or aggregated into minute/hour candles per longer timeframes. Real-time WebSocket feeds from RPC nodes provide mark price updates, e funding payments appear as on-chain events at each settlement interval. A production risk console typically polls mark prices every 1-5 seconds e updates the PnL display accordingly.\n\n## Break-even analysis\n\nThe break-even price account per all costs: trading fees, funding payments, e slippage. Per a long position: breakEvenPrice = entryPrice + (totalFees + cumulativeFundingPaid) / size. If you entered at $22.50 con $0.50 in total costs on a 10-unit position, your break-even is $22.55. Displaying the break-even line on the PnL chart gives traders a clear target — the position is only truly profitable when the mark price exceeds this line.\n\n## Visualization best practice\n\nEffective PnL dashboards use color coding consistently: green per positive PnL, red per negative. The zero line should be visually prominent. Hover tooltips should show the exact PnL at any point in time. Consider showing both absolute dollar PnL e percentage ROE on dual axes. Include funding annotations as small markers on the time axis so traders can see when funding events impacted their PnL curve.\n\n## Checklist\n- Separate unrealized, realized, e funding components in the display\n- Calculate ROE relative to initial margin, not current margin\n- Include break-even price accounting per all costs\n- Update PnL in near-real-time using mark price feeds\n- Annotate funding events on the PnL time series\n\n## Red flags\n- Showing only unrealized PnL without funding impact\n- Computing ROE against notional value instead of margin\n- Not distinguishing realized from unrealized PnL\n- Updating PnL using oracle price instead of mark price\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "perps-v2-l3-pnl",
                "title": "PnL Breakdown Example",
                "steps": [
                  {
                    "cmd": "Position: 10 SOL-PERP Long @ $22.50, margin $225",
                    "output": "Entry: $22.50 | Mark: $25.00 | Size: 10",
                    "note": "Position snapshot at current mark price"
                  },
                  {
                    "cmd": "Unrealized PnL",
                    "output": "10 * ($25.00 - $22.50) = $25.00 | ROE: +11.11%",
                    "note": "Long PnL = size * (mark - entry)"
                  },
                  {
                    "cmd": "Cumulative funding (3 periods @ 0.01%)",
                    "output": "3 * 10 * $22.50 * 0.0001 = -$0.07 (paid)",
                    "note": "Positive rate: longs pay funding"
                  },
                  {
                    "cmd": "Total PnL",
                    "output": "$25.00 + (-$0.07) = $24.93 | Net ROE: +11.08%",
                    "note": "True return includes funding drag"
                  }
                ]
              }
            ]
          },
          "perps-v2-pnl-calc": {
            "title": "Challenge: Calculate perpetual futures PnL",
            "content": "# Challenge: Calculate perpetual futures PnL\n\nImplement a PnL calculator per perpetual futures positions:\n\n- Compute unrealized PnL based on entry price vs mark price\n- Handle both long e short positions correctly\n- Calculate notional value as size * markPrice\n- Compute ROE (return on equity) as a percentage of initial margin\n- Format all outputs con appropriate decimal precision\n\nYour calculator must be deterministic — same input always produces the same output.",
            "duration": "50 min",
            "hints": [
              "Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice).",
              "Notional value = size * markPrice — represents the total position value.",
              "ROE (return on equity) = unrealizedPnL / margin * 100.",
              "Use toFixed(2) per prices e PnL, toFixed(4) per size e ROE."
            ]
          },
          "perps-v2-funding-accrual": {
            "title": "Challenge: Simulate funding rate accrual",
            "content": "# Challenge: Simulate funding rate accrual\n\nBuild a funding accrual simulator that processes discrete funding intervals:\n\n- Iterate through an array of funding rates e compute the payment per each period\n- Longs pay (subtract from balance) when the funding rate is positive\n- Shorts receive (add to balance) when the funding rate is positive\n- Track cumulative funding, average rate, e net margin impact\n- Handle negative funding rates where the direction reverses\n\nThe simulator must be deterministic — same inputs always produce the same result.",
            "duration": "50 min",
            "hints": [
              "Funding payment per period = size * entryPrice * fundingRate.",
              "Longs pay when rate is positive (totalFunding -= payment). Shorts receive.",
              "Average funding rate = sum(rates) / count.",
              "Net margin impact = (totalFunding / margin) * 100, as a percentage."
            ]
          }
        }
      },
      "perps-v2-risk": {
        "title": "Risk & Monitoring",
        "description": "Margin e liquidation monitoring, implementation bug traps, e deterministic risk-console outputs per production observability.",
        "lessons": {
          "perps-v2-margin-liquidation": {
            "title": "Margin ratio e liquidation thresholds",
            "content": "# Margin ratio e liquidation thresholds\n\nMargin is the collateral that backs a leveraged position. When the margin falls below a critical threshold relative to the position's notional value, the protocol forcibly closes the position to prevent the trader from owing more than they deposited. Understanding margin mechanics, the maintenance margin threshold, e how liquidation prices are calculated is essential per risk monitoring.\n\n## Initial margin e leverage\n\nInitial margin is the collateral deposited when opening a position. The leverage multiple is: leverage = notionalValue / initialMargin. A position con $250 notional value e $25 margin is 10x leveraged. Higher leverage amplifies both gains e losses. At 10x, a 10% adverse price move wipes out 100% of the margin. At 20x, only a 5% move is needed to reach zero.\n\nSolana perps protocols typically allow leverage up to 20x or even 50x on major pairs (SOL, BTC, ETH) e lower leverage (5x-10x) on altcoins con thinner liquidity. The maximum leverage is governed by the maintenance margin rate — a lower maintenance margin rate allows higher maximum leverage.\n\n## Maintenance margin\n\nThe maintenance margin rate (MMR) is the minimum margin ratio a position must maintain to avoid liquidation. If the MMR is 5% (0.05), the effective margin must be at least 5% of the notional value at all times. Effective margin account per unrealized PnL e funding: effectiveMargin = initialMargin + unrealizedPnL + cumulativeFunding. The margin ratio is: marginRatio = effectiveMargin / notionalValue.\n\nWhen the margin ratio drops below the MMR, the position is eligible per liquidation. Protocols don't wait per the margin to reach exactly zero — the maintenance buffer ensures there is still some collateral left to cover liquidation fees, slippage, e potential bad debt. If a position's losses exceed its margin entirely, the deficit becomes \"bad debt\" that must be absorbed by an insurance fund or socialized across other traders.\n\n## Liquidation price calculation\n\nThe liquidation price is the mark price at which the margin ratio exactly equals the maintenance margin rate. Per a long position: liquidationPrice = entryPrice - (margin + cumulativeFunding - notional * MMR) / size. Per a short: liquidationPrice = entryPrice + (margin + cumulativeFunding - notional * MMR) / size.\n\nThis formula account per the fact that as the mark price moves against you, both the unrealized PnL (reducing effective margin) e the notional value (the denominator of margin ratio) change simultaneously. The liquidation price is not simply \"entry price minus margin per unit\" — the maintenance margin requirement means liquidation triggers before your margin is fully depleted.\n\nPer example, consider a 10 SOL-PERP long at $22.50 con $225 margin e 5% MMR. The notional at entry is 10 * 22.50 = $225. Liquidation triggers when effectiveMargin / notional = 0.05, which solves to a mark price near $2.05 in this well-margined case. Con higher leverage (less margin), the liquidation price would be much closer to entry.\n\n## Cascading liquidations\n\nDuring sharp market moves, many positions hit their liquidation prices simultaneously. Liquidation engines close these positions by selling into the order book (or AMM pools), which pushes the price further in the adverse direction, triggering more liquidations. This cascade effect — also called a \"liquidation spiral\" — can cause prices to move far beyond what fundamentals justify.\n\nOn Solana, liquidation is performed by keeper bots that submit liquidation transazioni. These bots compete per liquidation opportunities because protocols offer a liquidation fee (typically 0.5-2% of the position's notional) as an incentive. During cascades, keeper bots may face congestion issues as many liquidation transazioni compete per block space. Partial liquidation — closing only enough of a position to restore the margin ratio above MMR — helps reduce cascade severity by keeping some of the position alive.\n\n## Risk monitoring thresholds\n\nA production risk console should alert at multiple thresholds: (1) WARNING when the margin ratio drops below 1.5x the MMR (e.g., 7.5% when MMR is 5%), (2) CRITICAL when below the MMR itself (liquidation imminent), e (3) INFO when unrealized PnL exceeds a significant percentage of margin (positive or negative). These alerts give traders time to add margin, reduce position size, or close entirely before forced liquidation.\n\n## Checklist\n- Calculate effective margin including unrealized PnL e funding\n- Compute margin ratio as effectiveMargin / notionalValue\n- Derive liquidation price from entry price, margin, e MMR\n- Set warning thresholds above the MMR to give early alerts\n- Account per liquidation fees in worst-case scenarios\n\n## Red flags\n- Computing liquidation price without accounting per the maintenance buffer\n- Ignoring funding in effective margin calculations\n- Not alerting traders before they reach the liquidation threshold\n- Assuming the mark price at liquidation equals the execution price (slippage exists)\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "perps-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "perps-v2-l6-q1",
                    "prompt": "Why is the maintenance margin rate set above zero?",
                    "options": [
                      "To ensure remaining collateral covers liquidation fees e slippage, preventing bad debt",
                      "To make it harder per traders to open positions",
                      "To generate more revenue per the protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "The maintenance buffer ensures that when a position is liquidated, there is still margin left to pay liquidation fees e absorb slippage during the close. Without it, positions could go underwater, creating bad debt."
                  },
                  {
                    "id": "perps-v2-l6-q2",
                    "prompt": "What causes a cascading liquidation spiral?",
                    "options": [
                      "Forced position closes push the price further, triggering more liquidations in a feedback loop",
                      "Too many traders opening positions at the same time",
                      "Oracle prices updating too slowly"
                    ],
                    "answerIndex": 0,
                    "explanation": "When liquidation engines close positions by selling into the market, the selling pressure moves the price further against remaining positions, triggering their liquidations too — a self-reinforcing feedback loop."
                  }
                ]
              }
            ]
          },
          "perps-v2-common-bugs": {
            "title": "Common bugs: sign errors, units, e funding direction",
            "content": "# Common bugs: sign errors, units, e funding direction\n\nPerpetual futures implementations are mathematically straightforward — the formulas are basic arithmetic. Yet sign errors, unit mismatches, e funding direction bugs are among the most frequent e costly mistakes in DeFi development. A single flipped sign can turn profits into losses, liquidate healthy positions, or drain insurance funds. This lezione catalogs the most common pitfalls e how to avoid them.\n\n## Sign errors in PnL calculations\n\nThe most fundamental bug: getting the sign wrong on PnL per short positions. Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice). Note that short PnL is NOT size * (markPrice - entryPrice) con a negated size. The size is always positive — it represents the quantity of contracts. The direction is captured in the formula itself. A common mistake is storing size as negative per shorts e using a single formula: pnl = size * (markPrice - entryPrice). While mathematically equivalent when size is negative, this representation causes bugs everywhere else: notional value calculations, funding payments, margin ratios, e liquidation prices all need absolute size.\n\nRule: Keep size always positive. Branch on the side field to select the correct formula. Never rely on sign conventions embedded in other fields.\n\n## Unit e decimal mismatches\n\nSolana token amounts are raw integers (lamports, token base units). Prices from oracles are typically fixed-point numbers con specific exponents. Mixing these without proper conversion produces catastrophically wrong values.\n\nExample: SOL has 9 decimals on-chain. If a position size is stored as 10_000_000_000 (10 SOL in lamports) e you multiply by a price of 22.50 (a floating-point dollar value), you get 225,000,000,000 — which might look like a notional value, but it is in lamports-times-dollars, a nonsensical unit. You must either convert size to human-readable units first (divide by 10^9), or keep everything in integer space con a consistent exponent.\n\nRule: Define a canonical unit convention at the start of your project. Either work entirely in human-readable floats (acceptable per display/simulation code) or entirely in integer base units con explicit scaling factors (required per on-chain code). Never mix the two.\n\n## Funding direction confusion\n\nThe funding direction rule is: \"positive funding rate means longs pay shorts.\" This is universal across all major protocols. Yet developers frequently implement it backwards, especially when reasoning about \"who benefits.\" When the rate is positive, the market is bullish (more longs than shorts). Longs pay to discourage the imbalance. Shorts receive as compensation per providing the other side.\n\nIn code, the mistake looks like this:\n- WRONG: if (side === \"long\") totalFunding += payment;\n- RIGHT: if (side === \"long\") totalFunding -= payment;\n\nWhen the funding rate is positive e the side is long, the payment reduces the trader's balance. When negative e long, the payment increases the balance (longs receive). Test every combination: positive rate + long, positive rate + short, negative rate + long, negative rate + short.\n\n## Liquidation price off-by-one\n\nThe liquidation price formula must account per the maintenance margin requirement. A common bug is computing the price at which margin equals zero rather than the price at which margin equals the maintenance requirement. This results in a liquidation price that is too aggressive — the position would be liquidated later than expected, potentially accumulating bad debt.\n\nAnother variant: forgetting to include cumulative funding in the liquidation price calculation. If a long position has paid $5 in funding, its effective margin is $5 less than the initial deposit, e the liquidation price is correspondingly closer to the entry price.\n\n## Margin ratio denominator\n\nMargin ratio = effectiveMargin / notionalValue. The notional value must use the current mark price, not the entry price. Using entry price per notional gives an incorrect ratio because the actual exposure changes as the mark price moves. A position con $225 entry notional that has moved to $250 mark notional has a lower margin ratio than the entry-price calculation suggests — the position has grown while the margin remains fixed.\n\n## Integer overflow in funding accumulation\n\nWhen accumulating funding over hundreds or thousands of periods, floating-point precision errors can compound. Each period adds a small number (e.g., 0.025), e after thousands of additions, the accumulated error can become material. Using fixed-point arithmetic or rounding at each step (con a consistent rounding convention) prevents drift. In JavaScript, toFixed() at the final output step is sufficient per display, but intermedio calculations should preserve full precision.\n\n## Test strategy\n\nEvery perps calculation should have test cases covering: (1) Long con profit, (2) Long con loss, (3) Short con profit, (4) Short con loss, (5) Positive funding rate per both sides, (6) Negative funding rate per both sides, (7) Zero funding rate, (8) Zero-margin edge case. If any single combination is missing from your test suite, the corresponding bug can ship undetected.\n\n## Checklist\n- Use separate formulas per long e short PnL, not sign-encoded size\n- Define e enforce a canonical unit convention (human-readable vs base units)\n- Test all four combinations of funding direction (2 sides x 2 rate signs)\n- Include maintenance margin in liquidation price calculations\n- Use mark price (not entry price) per notional value in margin ratio\n\n## Red flags\n- Negative position sizes used to encode short direction\n- Mixing lamport-scale e dollar-scale values in the same calculation\n- Funding payment that adds to long balances when the rate is positive\n- Liquidation price computed at zero margin instead of maintenance margin\n- Margin ratio using entry-price notional instead of mark-price notional\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "perps-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "perps-v2-l7-q1",
                    "prompt": "Why should position size always be stored as a positive number?",
                    "options": [
                      "Negative size creates sign-convention bugs in notional, funding, margin, e liquidation calculations",
                      "Solana account cannot store negative numbers",
                      "Positive numbers use less storage space"
                    ],
                    "answerIndex": 0,
                    "explanation": "When size carries the direction sign, every formula that uses size must account per the sign — not just PnL, but also notional value, funding payments, e liquidation price. Keeping size positive e branching on a separate 'side' field is safer e more explicit."
                  },
                  {
                    "id": "perps-v2-l7-q2",
                    "prompt": "A long position has a positive funding rate of 0.01%. What happens to the trader's balance?",
                    "options": [
                      "The balance decreases — longs pay when the funding rate is positive",
                      "The balance increases — longs receive positive funding",
                      "Nothing — funding only affects shorts"
                    ],
                    "answerIndex": 0,
                    "explanation": "Positive funding rate means the perp is trading above spot. Longs pay shorts to discourage the long-heavy imbalance. The long trader's effective margin decreases by the funding payment amount."
                  }
                ]
              }
            ]
          },
          "perps-v2-risk-console-report": {
            "title": "Checkpoint: Generate a Risk Console Report",
            "content": "# Checkpoint: Generate a Risk Console Report\n\nBuild the comprehensive risk console report that integrates all corso concepts:\n\n- Calculate unrealized PnL e ROE per the position\n- Accumulate funding payments across all provided funding rate intervals\n- Compute effective margin (initial + PnL + funding) e margin ratio\n- Derive the liquidation price accounting per maintenance margin e funding\n- Generate severity-tiered alerts (CRITICAL, WARNING, INFO) based on thresholds\n- Output must be stable JSON con deterministic structure\n\nThis checkpoint validates your complete understanding of perpetual futures risk management.",
            "duration": "55 min",
            "hints": [
              "Effective margin = initial margin + unrealized PnL + funding payments.",
              "Margin ratio = effectiveMargin / notionalValue.",
              "Liquidation price per longs: entryPrice - (margin + funding - notional*mmRate) / size.",
              "Generate alerts based on margin ratio vs maintenance margin rate thresholds.",
              "Sort alerts by severity: CRITICAL > WARNING > INFO."
            ]
          }
        }
      }
    }
  },
  "defi-tx-optimizer": {
    "title": "DeFi Transazione Optimizer",
    "description": "Master Solana DeFi transazione optimization: compute/fee tuning, ALT strategy, reliability patterns, e deterministic send-strategy planning.",
    "duration": "12 hours",
    "tags": [
      "defi",
      "transactions",
      "optimization",
      "compute",
      "solana"
    ],
    "modules": {
      "txopt-v2-fundamentals": {
        "title": "Transazione Fundamentals",
        "description": "Transazione failure diagnosis, compute budget mechanics, priority-fee strategy, e fee estimation foundations.",
        "lessons": {
          "txopt-v2-why-fail": {
            "title": "Why DeFi transazioni fail: CU limits, size, e blockhash expiry",
            "content": "# Why DeFi transazioni fail: CU limits, size, e blockhash expiry\n\nDeFi transazioni on Solana fail per three primary reasons: compute budget exhaustion, transazione size overflow, e blockhash expiry. Understanding each failure mode is essential before attempting any optimization, because the fix per each is fundamentally different. Misdiagnosing the failure category leads to wasted effort e frustrated users.\n\n## Compute budget exhaustion\n\nEvery Solana transazione executes within a compute budget measured in compute units (CUs). The default budget is 200,000 CUs per transazione, which is sufficient per simple transfers but far too low per complex DeFi operations. A single AMM swap through a concentrated liquidity pool can consume 100,000-200,000 CUs. Multi-hop routes, flash loans, or transazioni that interact con multiple protocols easily exceed 400,000 CUs. When a transazione exceeds its compute budget, the runtime aborts execution e returns a `ComputeBudgetExceeded` error. The transazione fee is still charged because the validatore performed work before the limit was hit.\n\nThe solution is the `SetComputeUnitLimit` istruzione from the Compute Budget Program. This istruzione must be the first istruzione in the transazione (by convention) e tells the runtime exactly how many CUs to allocate. Setting the limit too low causes failures; setting it too high wastes priority fee budget because priority fees are calculated per CU requested (not consumed). The optimal approach is to simulate the transazione first, observe the actual CU consumption, add a 10% safety margin, e use that as the limit.\n\n## Transazione size limits\n\nSolana transazioni have a hard size limit of 1,232 bytes when serialized. This limit applies to the entire transazione packet including signatures, message header, account keys, recent blockhash, e istruzione data. Each account key consumes 32 bytes. A transazione referencing 30 unique account uses 960 bytes per account keys alone, leaving very little room per istruzione data e signatures.\n\nDeFi transazioni are particularly account-heavy. A single Raydium CLMM swap requires the user wallet, input token account, output token account, pool state, AMM config, observation state, token vaults (x2), tick arrays (up to 3), oracle, e program IDs. Chaining multiple swaps in a single transazione can easily push the account count past 40, which exceeds the 1,232-byte limit con standard account encoding. This is where Address Lookup Tables (ALTs) become essential, compressing each account reference from 32 bytes to just 1 byte per account stored in the lookup table.\n\n## Blockhash expiry\n\nEvery Solana transazione includes a recent blockhash that serves as a replay protection mechanism e a timestamp. A blockhash is valid per approximately 60 seconds (roughly 150 slots at 400ms per slot). If a transazione is not included in a block before the blockhash expires, it becomes permanently invalid e can never be processed. The transazione simply disappears without any on-chain error record.\n\nBlockhash expiry is the most insidious failure mode because it produces no error message. The transazione is silently dropped. This happens frequently during network congestion when transazioni queue per longer than expected, or when users take too long to review e approve a transazione in their wallet. The correct handling is to monitor per confirmation con a timeout, e if the transazione is not confirmed within 30 seconds, fetch a new blockhash, rebuild e re-sign the transazione, e resubmit.\n\n## Interaction between failure modes\n\nThese three failure modes often interact. A developer might add more istruzioni to avoid multiple transazioni (reducing blockhash expiry risk), but this increases both CU consumption e transazione size. Optimizing per one dimension can worsen another. The art of transazione optimization is finding the right balance: enough CU budget to complete execution, compact enough to fit in 1,232 bytes, e fast enough submission to land before the blockhash expires.\n\n## Production triage rule\n\nDiagnose transazione failures in strict order:\n1. did it fit e simulate,\n2. did it propagate e include,\n3. did it confirm before expiry.\n\nThis sequence prevents noisy fixes e reduces false assumptions during incidents.\n\n## Diagnostic checklist\n- Check transazione logs per `ComputeBudgetExceeded` when CU is the issue\n- Check serialized transazione size against the 1,232-byte limit\n- Monitor confirmation status to detect silent blockhash expiry\n- Simulate transazioni before sending to catch CU e account issues early\n- Track failure rates by category to identify systemic problems\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l1-q1",
                    "prompt": "What is the default compute unit budget per a Solana transazione?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "50,000 CUs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana allocates 200,000 CUs by default. DeFi transazioni almost always need more, requiring an explicit SetComputeUnitLimit istruzione."
                  },
                  {
                    "id": "txopt-v2-l1-q2",
                    "prompt": "What happens when a transazione's blockhash expires before it is confirmed?",
                    "options": [
                      "The transazione is silently dropped con no on-chain error",
                      "The transazione fails con a BlockhashExpired error on-chain",
                      "The validatore retries con a fresh blockhash automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired blockhash transazioni are never processed e produce no on-chain record. The client must detect the timeout e resubmit con a fresh blockhash."
                  }
                ]
              }
            ]
          },
          "txopt-v2-compute-budget": {
            "title": "Compute budget istruzioni e priority fee strategy",
            "content": "# Compute budget istruzioni e priority fee strategy\n\nThe Compute Budget Program provides two critical istruzioni that every serious DeFi transazione should include: `SetComputeUnitLimit` e `SetComputeUnitPrice`. Together, they control how much computation your transazione can perform e how much you are willing to pay per priority inclusion in a block.\n\n## SetComputeUnitLimit\n\nThis istruzione sets the maximum number of compute units the transazione can consume. The value must be between 1 e 1,400,000 (the per-transazione maximum on Solana). The istruzione takes a single u32 parameter representing the CU limit. When omitted, the runtime uses the default of 200,000 CUs.\n\nChoosing the right limit requires profiling. Use `simulateTransaction` on an RPC node to execute the transazione without landing it on-chain. The simulation response includes `unitsConsumed`, which tells you exactly how many CUs the transazione used. Add a 10% safety margin to this value: `Math.ceil(unitsConsumed * 1.1)`. This margin account per minor variations in CU consumption between simulation e actual execution (e.g., different slot, slightly different account state).\n\nSetting the limit exactly to the simulated value is risky because CU consumption can vary slightly between simulation e execution. Setting it 2x or 3x higher is wasteful because your priority fee is calculated against the requested limit, not the consumed amount. The 10% margin provides a good balance between safety e cost efficiency.\n\n## SetComputeUnitPrice\n\nThis istruzione sets the priority fee in micro-lamports per compute unit. A micro-lamport is one millionth of a lamport (1 lamport = 0.000000001 SOL). The priority fee is calculated as: `priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1,000,000)` lamports.\n\nPer example, con a CU limit of 200,000 e a CU price of 5,000 micro-lamports: `ceil(200,000 * 5,000 / 1,000,000) = ceil(1,000) = 1,000 lamports`. This is added on top of the base fee of 5,000 lamports per signature (typically one signature per user transazioni).\n\n## Priority fee market dynamics\n\nSolana validatori order transazioni within a block by priority fee (micro-lamports per CU). During low-congestion periods, even a CU price of 1 micro-lamport is sufficient. During high-demand events (popular NFT mints, volatile market moments, new token launches), competitive CU prices can reach 100,000+ micro-lamports.\n\nThe priority fee market is highly dynamic. Strategies per choosing the right price include: (1) Static pricing: set a fixed CU price based on the expected congestion level. Simple but often suboptimal. (2) Recent-fee sampling: query `getRecentPrioritizationFees` from the RPC to see what fees landed in recent blocks. Use the median or 75th percentile as your price. (3) Percentile targeting: decide what probability of inclusion you want (e.g., 90% chance of landing in the next block) e price accordingly.\n\n## Fee calculation formula\n\nThe total transazione fee follows this formula:\n\n```\nbaseFee = 5000 lamports (per signature)\npriorityFee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) lamports\ntotalFee = baseFee + priorityFee\n```\n\nWhen building a transazione planner, these calculations must use integer arithmetic to match on-chain behavior. Floating-point rounding differences can cause fee estimate mismatches that confuse users.\n\n## Istruzione ordering\n\nCompute budget istruzioni must appear before any other istruzioni in the transazione. The runtime processes them during transazione validation, before executing program istruzioni. Placing them after other istruzioni is technically allowed but violates convention e may cause issues con some tools e wallet.\n\n## Pratico recommendations\n- Always include both SetComputeUnitLimit e SetComputeUnitPrice\n- Simulate first, then set CU limit to ceil(consumed * 1.1)\n- Sample recent fees e use the 75th percentile per reliable inclusion\n- Display the total fee estimate to users before they sign\n- Cap the CU limit at 1,400,000 (Solana maximum per transazione)\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l2-q1",
                    "prompt": "How is the priority fee calculated in lamports?",
                    "options": [
                      "ceil(computeUnitLimit * computeUnitPrice / 1,000,000)",
                      "computeUnitLimit * computeUnitPrice",
                      "computeUnitPrice / computeUnitLimit"
                    ],
                    "answerIndex": 0,
                    "explanation": "The CU price is denominated in micro-lamports per CU. Dividing by 1,000,000 converts micro-lamports to lamports. The ceiling function ensures rounding up to the nearest lamport."
                  },
                  {
                    "id": "txopt-v2-l2-q2",
                    "prompt": "Why is setting the CU limit to exactly the simulated value risky?",
                    "options": [
                      "CU consumption can vary slightly between simulation e execution due to state changes",
                      "The runtime does not accept exact values",
                      "Simulation always underreports CU usage by 50%"
                    ],
                    "answerIndex": 0,
                    "explanation": "Account state may change between simulation e execution, causing minor CU variations. A 10% margin absorbs these differences."
                  }
                ]
              }
            ]
          },
          "txopt-v2-cost-explorer": {
            "title": "Transazione cost estimation e fee planning",
            "content": "# Transazione cost estimation e fee planning\n\nAccurate fee estimation is the foundation of a good DeFi user experience. Users need to know what a transazione will cost before they sign it. Validatori need sufficient fees to prioritize your transazione. Getting fee estimation right means understanding the components, profiling real transazioni, e adapting to market conditions.\n\n## Components of transazione cost\n\nA Solana transazione's cost has three components: (1) the base fee, which is 5,000 lamports per signature e is fixed by protocol; (2) the priority fee, which is variable e determined by the compute unit price you set; e (3) the rent cost per any new account created by the transazione (e.g., creating an Associated Token Account costs approximately 2,039,280 lamports in rent-exempt minimum balance).\n\nPer DeFi transazioni that do not create new account, the cost is simply base fee plus priority fee. Per transazioni that create ATAs or other account, the rent deposits significantly increase the total cost e should be displayed separately in the UI since rent is recoverable when the account is closed.\n\n## CU profiling\n\nProfiling compute unit consumption across different operation types builds an estimation model. Common DeFi operations e their typical CU ranges:\n\n- SOL transfer: 2,000-5,000 CUs\n- SPL token transfer: 4,000-8,000 CUs\n- Create ATA (idempotent): 25,000-35,000 CUs\n- Simple AMM swap (constant product): 60,000-120,000 CUs\n- CLMM swap (concentrated liquidity): 100,000-200,000 CUs\n- Multi-hop route (2 legs): 200,000-400,000 CUs\n- Flash loan + swap: 300,000-600,000 CUs\n\nThese ranges vary based on pool state, tick array crossings in CLMM pools, e program version. Profiling your specific use case con simulation produces much more accurate estimates than using generic ranges.\n\n## Fee market analysis\n\nThe priority fee market fluctuates based on network demand. During quiet periods (off-peak hours, low volatility), median priority fees hover around 1-100 micro-lamports per CU. During peak events, fees can spike to 10,000-1,000,000+ micro-lamports per CU.\n\nFetching recent fee data from `getRecentPrioritizationFees` returns fee levels from the last 150 slots. Computing percentiles (25th, 50th, 75th, 90th) from this data provides a fee distribution that informs pricing strategy:\n- 25th percentile: economy — may take multiple blocks to land\n- 50th percentile: standard — lands in 1-2 blocks under normal conditions\n- 75th percentile: fast — high probability of next-block inclusion\n- 90th percentile: urgent — nearly guaranteed next-block inclusion\n\n## Fee tiers per user selection\n\nPresent fee estimates at multiple priority levels so users can choose their urgency. A typical tier structure:\n\n- Low priority: 100 micro-lamports/CU — suitable per non-urgent operations\n- Medium priority: 1,000 micro-lamports/CU — standard DeFi operations\n- High priority: 10,000 micro-lamports/CU — time-sensitive trades\n\nEach tier produces a different total fee: `baseFee + ceil(cuLimit * tierPrice / 1,000,000)`. Display all three alongside estimated confirmation times to help users make informed decisions.\n\n## Dynamic fee adjustment\n\nProduction systems should adjust fee tiers based on real-time market data rather than using static values. Query recent fees every 10-30 seconds e update the tier prices to reflect current conditions. During congestion spikes, automatically increase the default tier to ensure transazioni land. During quiet periods, reduce fees to save users money.\n\n## Cost display best practice\n- Show total fee in both lamports e SOL equivalent\n- Separate base fee, priority fee, e rent deposits\n- Indicate the priority level e expected confirmation time\n- Update fee estimates in real-time as market conditions change\n- Warn users when fees are unusually high compared to recent averages\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "txopt-v2-l3-fees",
                "title": "Fee Calculation Examples",
                "steps": [
                  {
                    "cmd": "Simple transfer (5,000 CU, 1000 uL/CU)",
                    "output": "Base: 5,000 | Priority: ceil(5000*1000/1e6) = 5 | Total: 5,005 lamports",
                    "note": "Low compute = minimal priority fee"
                  },
                  {
                    "cmd": "DeFi swap (200,000 CU, 5000 uL/CU)",
                    "output": "Base: 5,000 | Priority: ceil(200000*5000/1e6) = 1,000 | Total: 6,000 lamports",
                    "note": "Higher compute increases priority cost proportionally"
                  },
                  {
                    "cmd": "Complex route (400,000 CU, 10000 uL/CU)",
                    "output": "Base: 5,000 | Priority: ceil(400000*10000/1e6) = 4,000 | Total: 9,000 lamports",
                    "note": "High CU + high priority = significant fee"
                  }
                ]
              }
            ]
          },
          "txopt-v2-tx-plan": {
            "title": "Challenge: Build a transazione plan con compute budgeting",
            "content": "# Challenge: Build a transazione plan con compute budgeting\n\nBuild a transazione planning function that analyzes a set of istruzioni e produces a complete transazione plan:\n\n- Sum estimatedCU from all istruzioni e add a 10% safety margin (ceiling)\n- Cap the compute unit limit at 1,400,000 (Solana maximum)\n- Calculate priority fee: ceil(computeUnitLimit * computeUnitPrice / 1,000,000)\n- Calculate total fee: base fee (5,000 lamports) + priority fee\n- Count unique account keys across all istruzioni\n- Add 2 to istruzione count per SetComputeUnitLimit e SetComputeUnitPrice\n- Flag needsVersionedTx when unique account exceed 35\n\nYour plan must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Sum estimatedCU from all istruzioni, then add 10% margin: ceil(total * 1.1).",
              "Cap compute unit limit at 1,400,000 (Solana max).",
              "Priority fee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) in lamports.",
              "Total fee = base fee (5000 lamports) + priority fee.",
              "Versioned tx needed when unique account keys exceed 35."
            ]
          }
        }
      },
      "txopt-v2-optimization": {
        "title": "Optimization & Strategy",
        "description": "Address Lookup Table planning, reliability/retry patterns, actionable error UX, e full send-strategy reporting.",
        "lessons": {
          "txopt-v2-lut-planner": {
            "title": "Challenge: Plan Address Lookup Table usage",
            "content": "# Challenge: Plan Address Lookup Table usage\n\nBuild a function that determines the optimal Address Lookup Table strategy per a transazione:\n\n- Collect all unique account keys across istruzioni\n- Check which keys exist in available LUTs\n- Calculate transazione size: base overhead (200 bytes) + keys * 32 bytes each\n- Con LUT: non-LUT keys cost 32 bytes, LUT keys cost 1 byte each\n- Recommend \"legacy\" if the transazione fits in 1,232 bytes without LUT\n- Recommend \"use-existing-lut\" if LUT keys make it fit\n- Recommend \"create-new-lut\" if it still does not fit even con available LUTs\n- Return byte savings from LUT usage\n\nYour planner must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Collect all unique account keys across istruzioni into a set.",
              "Each key costs 32 bytes without LUT, 1 byte con LUT.",
              "Base transazione overhead is ~200 bytes. Max legacy tx size is 1232 bytes.",
              "Recommend 'legacy' if fits without LUT, 'use-existing-lut' if LUT helps enough, 'create-new-lut' if still too large."
            ]
          },
          "txopt-v2-reliability": {
            "title": "Reliability patterns: retry, re-quote, resend vs rebuild",
            "content": "# Reliability patterns: retry, re-quote, resend vs rebuild\n\nProduction DeFi applications must handle transazione failures gracefully. The difference between a frustrating e a reliable experience comes down to retry strategy: knowing when to resend the same transazione, when to rebuild con fresh parameters, e when to abort e inform the user.\n\n## Failure classification\n\nTransazione failures fall into two categories: retryable e non-retryable. Correct classification is the foundation of any retry strategy.\n\nRetryable failures include: (1) blockhash expired -- the transazione was not included in time, re-fetch blockhash e resend; (2) network timeout -- the RPC node did not respond, try again or switch nodes; (3) rate limiting (HTTP 429) -- back off e retry after the specified delay; (4) node behind -- the RPC node's slot is behind the cluster, try a different node; e (5) transazione not found after send -- may need to resend.\n\nNon-retryable failures include: (1) insufficient funds -- user does not have enough balance; (2) slippage exceeded -- pool price moved beyond tolerance, must re-quote; (3) account does not exist -- expected account is missing; (4) program error con specific error code -- the program logic rejected the transazione; e (5) invalid istruzione data -- the transazione was constructed incorrectly.\n\n## Resend vs rebuild\n\nResending means submitting the exact same signed transazione bytes again. This is safe because Solana deduplicates transazioni by signature -- if the original transazione was already processed, the resend is ignored. Resending is appropriate when: the transazione was sent but confirmation timed out, the RPC node returned a transient error, or you suspect the transazione was not propagated to the leader.\n\nRebuilding means constructing a new transazione from scratch con fresh parameters: new blockhash, possibly updated account state, re-simulated CU estimate, e new signature. Rebuilding is necessary when: the blockhash expired (cannot resend con stale blockhash), slippage was exceeded (pool state changed, need fresh quote), or account state changed (e.g., ATA was created by another transazione in the meantime).\n\nThe decision tree is: if the failure is a network/delivery issue, resend; if the failure indicates stale state, rebuild; if the failure indicates a permanent problem (insufficient balance, invalid istruzione), abort con a clear error.\n\n## Exponential backoff con jitter\n\nRetry timing must use exponential backoff to avoid overwhelming the network during congestion. The formula is:\n\n```\ndelay = baseDelay * (backoffMultiplier ^ attemptNumber) + random jitter\n```\n\nCon a base delay of 500ms e a 2x multiplier: attempt 1 waits ~500ms, attempt 2 waits ~1,000ms, attempt 3 waits ~2,000ms. Adding random jitter of +/-25% prevents synchronized retries from many clients hitting the same RPC endpoint simultaneously.\n\nCap retries at 3 attempts per user-initiated transazioni. More retries introduce unacceptable latency (users do not want to wait 10+ seconds). Per backend/automated transazioni, higher retry counts (5-10) may be acceptable.\n\n## Blockhash refresh on retry\n\nEvery retry that involves rebuilding must fetch a fresh blockhash. Using the same blockhash across retries is dangerous because the blockhash may have already expired or be close to expiry. The retry flow is: (1) fetch new blockhash, (2) rebuild transazione message con new blockhash, (3) re-sign con user wallet (or programmatic keypair), (4) simulate the rebuilt transazione, (5) send if simulation succeeds.\n\nPer wallet-connected applications, re-signing requires another user interaction (wallet popup). To minimize this friction, some applications use durable nonces instead of blockhashes. Durable nonces do not expire, eliminating the need to re-sign on retry. However, durable nonces have their own complexity e are not universally supported.\n\n## User-facing retry UX\n\nPresent retry progress clearly: show the attempt number, what went wrong, e what is happening next. Example states: \"Sending transazione...\" -> \"Transazione not confirmed, retrying (2/3)...\" -> \"Refreshing quote...\" -> \"Success!\" or \"Failed after 3 attempts. [Try Again] [Cancel]\". Never retry silently -- users should always know what is happening con their transazione.\n\n## Checklist\n- Classify every failure as retryable or non-retryable\n- Use exponential backoff (500ms base, 2x multiplier) con jitter\n- Cap retries at 3 per user-initiated transazioni\n- Refresh blockhash on every rebuild attempt\n- Distinguish resend (same bytes) from rebuild (new transazione)\n- Show retry progress in the UI con clear status messages\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l6-q1",
                    "prompt": "When should you rebuild a transazione instead of resending it?",
                    "options": [
                      "When the blockhash has expired or pool state has changed",
                      "Whenever any error occurs",
                      "Only when the user manually clicks retry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Rebuilding is necessary when the transazione's blockhash is stale or when on-chain state has changed (e.g., slippage exceeded). Simple network issues only require resending the same bytes."
                  },
                  {
                    "id": "txopt-v2-l6-q2",
                    "prompt": "Why add random jitter to retry delays?",
                    "options": [
                      "To prevent many clients from retrying at the exact same moment e overwhelming the network",
                      "To make the delay shorter on average",
                      "Jitter is required by the Solana protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without jitter, all clients using the same backoff formula would retry simultaneously, creating thundering herd problems on the RPC infrastructure."
                  }
                ]
              }
            ]
          },
          "txopt-v2-ux-errors": {
            "title": "UX: actionable error messages per transazione failures",
            "content": "# UX: actionable error messages per transazione failures\n\nRaw Solana error messages are cryptic. \"Transazione simulation failed: Error processing Istruzione 2: custom program error: 0x1771\" tells a developer something but tells a user nothing. Mapping program errors to clear, actionable messages is essential per DeFi application quality.\n\n## Error taxonomy\n\nSolana transazione errors fall into several categories, each requiring different user-facing treatment:\n\nWallet errors: insufficient SOL balance, insufficient token balance, wallet disconnected, user rejected signature request. These are the most common e simplest to handle. The message should state what is missing e how to fix it: \"Insufficient SOL balance. You need at least 0.05 SOL to cover transazione fees. Current balance: 0.01 SOL.\"\n\nProgram errors: these are custom error codes from on-chain programs. Each program defines its own error codes. Per example, Jupiter aggregator might return error 6001 per \"slippage tolerance exceeded,\" while Raydium returns a different code per the same concept. Maintaining a mapping from program ID + error code to human-readable messages is necessary per each protocol you integrate con.\n\nNetwork errors: RPC node unavailable, connection timeout, rate limited. These are transient e should be presented con automatic retry: \"Network temporarily unavailable. Retrying in 3 seconds...\" The user should not need to take action unless all retries fail.\n\nCompute errors: compute budget exceeded, transazione too large. These indicate the transazione was constructed incorrectly (from the user's perspective). The message should explain the situation e offer a solution: \"Transazione too complex per a single submission. Splitting into two transazioni...\"\n\n## Mapping program errors\n\nThe most important error mappings per DeFi applications:\n\nSlippage exceeded: \"Price moved beyond your tolerance of X%. The swap would give you less than your minimum output of Y tokens. Tap 'Refresh Quote' to get an updated price.\" This is actionable -- the user can refresh e try again.\n\nInsufficient liquidity: \"Not enough liquidity in the pool per this swap size. Try reducing the swap amount or using a different route.\" This tells the user what to do.\n\nStale oracle: \"Price oracle data is outdated. This can happen during high volatility. Please wait a moment e try again.\" This sets expectations.\n\nAccount not initialized: \"Your token account per [TOKEN] needs to be created first. This will cost approximately 0.002 SOL in rent.\" This explains the additional cost.\n\n## Error message principles\n\nGood error messages follow these principles: (1) State what happened in plain language. Not \"Error 0x1771\" but \"The swap price changed too much.\" (2) Explain why it happened. \"Prices move quickly during high volatility.\" (3) Tell the user what to do. \"Tap Refresh to get an updated quote, or increase your slippage tolerance.\" (4) Provide technical details in a collapsible section per power users: \"Program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4, Error: 6001 (SlippageToleranceExceeded).\"\n\n## Error recovery flows\n\nEach error category should have a defined recovery flow:\n\nBalance errors: show current balance, required balance, e a link to fund the wallet or swap per the needed token. Pre-calculate the exact shortfall.\n\nSlippage errors: automatically re-quote con the same parameters. If the new quote is acceptable, present it con a \"Swap at new price\" button. If the price moved significantly, warn the user before proceeding.\n\nTimeout errors: show a transazione explorer link so the user can verify whether the transazione actually succeeded. Include a \"Check Status\" button that polls the signature. Many apparent failures are actually successes where the confirmation was slow.\n\nSimulation errors: catch these before sending. If simulation fails, do not prompt the user to sign. Instead, show the mapped error e recovery action. This saves users from paying fees on doomed transazioni.\n\n## Logging e monitoring\n\nLog every error con full context: timestamp, wallet address (anonymized), transazione signature (if available), program ID, error code, mapped message, e recovery action taken. This data drives improvements: if 80% of errors are slippage-related, you need better default slippage settings or dynamic adjustment. If compute errors spike, your CU estimation model needs tuning.\n\n## Checklist\n- Map all known program error codes to human-readable messages\n- Include actionable recovery steps in every error message\n- Provide technical details in a collapsible section\n- Automatically re-quote on slippage failures\n- Log all errors con full context per monitoring\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "txopt-v2-l7-errors",
                "title": "Error Mapping Examples",
                "steps": [
                  {
                    "cmd": "Raw: custom program error: 0x1771",
                    "output": "Mapped: \"Price moved beyond your 0.5% tolerance. Tap Refresh per updated quote.\"",
                    "note": "Slippage exceeded -> actionable message"
                  },
                  {
                    "cmd": "Raw: Attempt to debit an account but found no record of a prior credit",
                    "output": "Mapped: \"Insufficient SOL balance. Need 0.05 SOL, have 0.01 SOL. Fund wallet to continue.\"",
                    "note": "Balance error -> show exact shortfall"
                  },
                  {
                    "cmd": "Raw: Transaction was not confirmed in 30.00 seconds",
                    "output": "Mapped: \"Transazione pending. Check status or retry con higher priority fee.\" [Check Status] [Retry]",
                    "note": "Timeout -> offer both check e retry options"
                  }
                ]
              }
            ]
          },
          "txopt-v2-send-strategy": {
            "title": "Checkpoint: Generate a send strategy report",
            "content": "# Checkpoint: Generate a send strategy report\n\nBuild the final send strategy report that combines all corso concepts into a comprehensive transazione optimization plan:\n\n- Build a tx plan: sum CU estimates con 10% margin (capped at 1,400,000), calculate priority fee, count unique account e total istruzioni (+2 per compute budget)\n- Plan LUT strategy: calculate sizes con e without LUT, recommend legacy / use-existing-lut / create-new-lut\n- Generate fee estimates at three priority tiers: low (100 uL/CU), medium (1,000 uL/CU), high (10,000 uL/CU)\n- Include a fixed retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash\n- Preserve the input timestamp in the output\n\nThis checkpoint validates your complete understanding of transazione optimization.",
            "duration": "55 min",
            "hints": [
              "Combine tx plan building e LUT planning into one comprehensive report.",
              "Fee estimates: low = 100 microlamports/CU, medium = 1000, high = 10000.",
              "Retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash.",
              "Use the same CU calculation: ceil(totalCU * 1.1) capped at 1,400,000."
            ]
          }
        }
      }
    }
  },
  "solana-mobile-signing": {
    "title": "Solana Mobile Signing",
    "description": "Master production mobile wallet signing on Solana: Android MWA sessions, iOS deep-link constraints, resilient retries, e deterministic session telemetry.",
    "duration": "12 hours",
    "tags": [
      "mobile",
      "signing",
      "wallet",
      "mwa",
      "solana"
    ],
    "modules": {
      "mobilesign-v2-fundamentals": {
        "title": "Mobile Signing Fundamentals",
        "description": "Platform constraints, connection UX patterns, signing timeline behavior, e typed request construction across Android/iOS.",
        "lessons": {
          "mobilesign-v2-reality-check": {
            "title": "Mobile signing reality check: Android vs iOS constraints",
            "content": "# Mobile signing reality check: Android vs iOS constraints\n\nMobile wallet signing on Solana is fundamentally different from browser-based wallet interactions. The constraints imposed by Android e iOS operating systems shape every progettazione decision, from session management to error handling. Understanding these platform differences is essential before writing any signing code.\n\n## Android e Mobile Wallet Adapter (MWA)\n\nOn Android, the Solana Mobile Wallet Adapter (MWA) protocol provides a persistent communication channel between dApps e wallet applications. MWA leverages Android's ability to run foreground services, which means the wallet application can maintain an active session while the user interacts con the dApp. The protocol uses a WebSocket-like association mechanism: the dApp sends an association intent, the wallet responds con a session token, e subsequent sign requests flow over this persistent channel.\n\nThe key advantage of MWA on Android is session continuity. Once a user authorizes a dApp, the wallet maintains an active session that can handle multiple sign requests without requiring the user to switch applications. The foreground service keeps the communication channel alive even when the wallet is not in the foreground. This enables flows like batch signing, sequential transazione approval, e real-time status updates.\n\nAndroid MWA sessions have a lifecycle tied to the association. The dApp initiates an association via an Android intent, receives a session object, e can then issue authorize, sign_transactions, sign_messages, e sign_and_send_transactions requests. Sessions persist until explicitly deauthorized, the wallet terminates them, or the session TTL expires. Typical TTL values range from 5 minutes to 24 hours depending on the wallet implementation.\n\nHowever, Android is not without constraints. The user must have a compatible MWA wallet installed (Phantom, Solflare, or other MWA-compatible wallet). The association intent may fail if no compatible wallet is found, requiring graceful fallback. Additionally, Android battery optimization e Doze mode can interrupt foreground services on some manufacturer-modified Android builds (Samsung, Xiaomi), requiring careful handling of session interruption.\n\n## iOS limitations e deep link patterns\n\niOS presents a fundamentally different challenge. Apple does not allow arbitrary background processes or persistent inter-app communication channels. There is no equivalent to Android's foreground service pattern. When a user switches from a dApp (typically a web view or native app) to a wallet app, the dApp's execution context is suspended. There is no way to maintain a WebSocket or persistent channel between the two applications.\n\nOn iOS, wallet interactions rely on deep links e universal links. The dApp constructs a signing request, encodes it into a URL, e opens the wallet via a deep link. The wallet processes the request, e returns the result via a callback deep link back to the dApp. Each sign request requires a full app switch: dApp to wallet, user approval, wallet back to dApp.\n\nThis round-trip app switching has significant UX implications. Each signature requires 2-4 seconds of visual context switching. Users see the iOS app transition animation, must locate the approve button in the wallet, e then return to the dApp. Batch signing is particularly painful because each transazione in the batch requires a separate app switch (unless the wallet supports batch approval in a single deep link payload).\n\nSession persistence on iOS is effectively impossible in the traditional sense. The dApp cannot know if the wallet is still running, whether the user closed it, or if iOS terminated it per memory pressure. Every request must be treated as potentially the first request in a new session. This means encoding all necessary context (app identity, cluster, authorization state) into every deep link request.\n\n## What actually works in production\n\nProduction mobile dApps adopt a hybrid strategy. On Android, they detect MWA support e use the persistent session model. On iOS, they fall back to deep link patterns con aggressive local caching to minimize the data that must be re-transmitted on each request. Cross-platform frameworks like the Solana Mobile SDK abstract some of these differences, but developers must still handle platform-specific edge cases.\n\nFallback patterns include: QR code-based WalletConnect sessions (works on both platforms but adds latency), embedded browser wallet (avoid app switching but sacrifice sicurezza), e progressive web app approaches con browser extension wallet. Each fallback has trade-offs in sicurezza, UX, e feature completeness.\n\nThe most robust approach is capability detection at runtime: check per MWA support, fall back to deep links, e ultimately offer QR-based connection as a universal fallback. Each path should provide appropriate UX feedback so users understand why the experience differs across devices.\n\n## Shipping principle per mobile signing\n\nProgettazione per interruption by default. Assume app switches, OS suspension, network drops, e wallet restarts are normal events. A resilient signing flow recovers state quickly e keeps users informed at each step.\n\n## Checklist\n- Detect MWA availability on Android before attempting association\n- Implement deep link fallback per iOS e non-MWA Android\n- Handle session interruption from OS-level process management\n- Cache session state locally per faster reconnection\n- Provide clear UX per each connection method\n\n## Red flags\n- Assuming MWA works identically on iOS e Android\n- Not handling foreground service termination on Android\n- Ignoring deep link callback failures on iOS\n- Hardcoding a single wallet without fallback detection\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l1-q1",
                    "prompt": "What enables persistent dApp-to-wallet communication on Android?",
                    "options": [
                      "Foreground services maintaining a session channel",
                      "Deep links passed between applications",
                      "Shared local storage between apps"
                    ],
                    "answerIndex": 0,
                    "explanation": "Android MWA uses foreground services to maintain a persistent communication channel between the dApp e wallet, enabling multi-request sessions without app switching."
                  },
                  {
                    "id": "mobilesign-v2-l1-q2",
                    "prompt": "Why can't iOS maintain persistent wallet sessions like Android?",
                    "options": [
                      "iOS suspends app execution on background transitions, preventing persistent channels",
                      "iOS wallet do not support Solana",
                      "iOS uses a different blockchain protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "iOS does not allow arbitrary background processes or persistent inter-app communication. When the user switches apps, the dApp's execution context is suspended."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-connection-ux": {
            "title": "Wallet connection UX patterns: connect, reconnect, e recovery",
            "content": "# Wallet connection UX patterns: connect, reconnect, e recovery\n\nWallet connection on mobile is the first interaction users have con your dApp. A smooth connection flow builds trust; a broken one drives users away. This lezione covers the connection lifecycle, automatic reconnection strategies, network mismatch handling, e user-friendly error states.\n\n## Initial connection flow\n\nThe connection flow begins con capability detection. Before presenting any wallet UI, your dApp should determine what connection methods are available. On Android, check per installed MWA-compatible wallet by attempting to resolve the MWA association intent. On iOS, check per registered deep link handlers. If neither is available, offer a QR code or WalletConnect fallback.\n\nOnce a connection method is selected, the authorization flow begins. Per MWA on Android, this involves sending an authorize request con your app identity (name, URI, icon). The wallet displays a consent screen showing your dApp's identity e requested permissions. Upon approval, the wallet returns an auth token e the user's public key. Store both: the public key per display e transazione building, the auth token per session resumption.\n\nPer deep link connections on iOS, the flow is: construct an authorize deep link con your app identity e callback URI, open the wallet, wait per the callback deep link con the auth result, e parse the response. The response includes the public key e optionally a session token per subsequent requests.\n\nConnection state should be persisted locally. Store the wallet address, connection method, auth token, e timestamp. This enables automatic reconnection on app restart without requiring the user to re-authorize. Use secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) per auth tokens.\n\n## Automatic reconnection\n\nWhen the dApp restarts or returns from background, attempt silent reconnection before showing any wallet UI. The reconnection flow checks: is there a stored auth token? Is it still valid (not expired)? Can we re-establish the communication channel?\n\nOn Android con MWA, reconnection involves re-associating con the wallet using the stored auth token. If the wallet accepts the token, the session resumes transparently. If the token is expired or revoked, fall back to a fresh authorization flow. The key is making this check fast (under 500ms) so the user does not see a loading state.\n\nOn iOS, reconnection is simpler but less reliable. Check if the stored wallet address is still valid by verifying the account exists on-chain. The auth token from the previous deep link session may or may not be accepted by the wallet on the next interaction. Optimistically display the stored wallet address e handle re-authorization lazily when the first sign request fails.\n\n## Network mismatch handling\n\nNetwork mismatches occur when the dApp expects one cluster (e.g., mainnet-beta) but the wallet is configured per another (e.g., devnet). This is a common source of confusing errors: transazioni build correctly but fail on submission because they reference account that do not exist on the wallet's configured cluster.\n\nDetection strategies include: requesting the wallet's current cluster during authorization, comparing the cluster in sign responses against expectations, e catching specific RPC errors that indicate cluster mismatch (e.g., account not found per well-known program addresses).\n\nWhen a mismatch is detected, present a clear error message: \"Your wallet is connected to devnet, but this dApp requires mainnet-beta. Please switch your wallet's network e reconnect.\" Avoid technical jargon. Some wallet support programmatic cluster switching via the MWA protocol; use this when available.\n\n## User-friendly error states\n\nError states must be actionable. Users should always know what happened e what to do next. Common error states e their UX patterns:\n\nWallet not found: \"No compatible wallet detected. Install Phantom or Solflare to continue.\" Include direct links to app stores.\n\nAuthorization denied: \"Wallet connection was declined. Tap Connect to try again.\" Do not repeatedly prompt; wait per user action.\n\nSession expired: \"Your wallet session has expired. Tap to reconnect.\" Attempt silent reconnection first; only show this if silent reconnection fails.\n\nNetwork error: \"Unable to reach the Solana network. Check your internet connection e try again.\" Distinguish between local network issues e RPC endpoint failures.\n\nWallet disconnected: \"Your wallet was disconnected. This can happen if the wallet app was closed. Tap to reconnect.\" On Android, this may indicate the foreground service was killed.\n\n## Recovery patterns\n\nRecovery should be automatic when possible e manual when necessary. Implement a connection state machine con states: disconnected, connecting, connected, reconnecting, e error. Transitions between states should be deterministic e logged per debugging.\n\nThe reconnecting state is critical. When a connected session fails (e.g., the wallet app crashes), transition to reconnecting e attempt up to 3 silent reconnection attempts con exponential backoff (1s, 2s, 4s). If all attempts fail, transition to error e present the manual reconnection UI.\n\n## Checklist\n- Detect available connection methods before showing wallet UI\n- Store auth tokens securely per automatic reconnection\n- Handle network mismatch con clear user messaging\n- Implement connection state machine con deterministic transitions\n- Provide actionable error states con recovery options\n\n## Red flags\n- Showing raw error codes to users\n- Repeatedly prompting per authorization after denial\n- Not persisting connection state across app restarts\n- Ignoring network mismatch silently\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l2-q1",
                    "prompt": "What should you do before showing any wallet connection UI?",
                    "options": [
                      "Detect available connection methods (MWA, deep links, QR)",
                      "Immediately open the default wallet",
                      "Display a loading spinner per 3 seconds"
                    ],
                    "answerIndex": 0,
                    "explanation": "Capability detection ensures you only present connection methods that are actually available on the user's device."
                  },
                  {
                    "id": "mobilesign-v2-l2-q2",
                    "prompt": "How should a dApp handle a network mismatch between itself e the wallet?",
                    "options": [
                      "Display a clear message asking the user to switch their wallet's network",
                      "Silently retry the transazione on a different cluster",
                      "Ignore the mismatch e hope it resolves"
                    ],
                    "answerIndex": 0,
                    "explanation": "Network mismatches should be communicated clearly to the user con istruzioni on how to resolve them, avoiding confusing silent failures."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-timeline-explorer": {
            "title": "Signing session timeline: request, wallet, e response flow",
            "content": "# Signing session timeline: request, wallet, e response flow\n\nUnderstanding the complete lifecycle of a mobile signing request is essential per building reliable dApps. Every sign request passes through multiple stages, each con its own failure modes e timing constraints. This lezione traces a request from construction to final response.\n\n## Request construction phase\n\nThe signing flow begins in the dApp when user action triggers a transazione. The dApp constructs the transazione: fetching a recent blockhash, building istruzioni, setting the fee payer, e serializing the transazione into a byte array. On mobile, this construction phase must be fast because the user is waiting per the wallet to appear.\n\nKey timing constraint: the recent blockhash has a limited validity window (typically 60-90 seconds on mainnet, determined by the slots-per-epoch configuration). If transazione construction takes too long (e.g., due to slow RPC responses), the blockhash may expire before the wallet even sees the transazione. Production dApps pre-fetch blockhashes e refresh them periodically.\n\nThe constructed transazione is encoded (typically base64 per MWA, or URL-safe base64 per deep links) e wrapped in a sign request object. The sign request includes metadata: the app identity, requested cluster, e a unique request ID per tracking. On MWA, this is sent over the session channel. On iOS deep links, it is encoded into the URL.\n\n## Wallet-side processing\n\nOnce the wallet receives the sign request, it enters its own processing pipeline. The wallet decodes the transazione, simulates it (if the wallet supports simulation), extracts human-readable information per the approval screen, e presents the transazione details to the user.\n\nSimulation is a critical step. Wallet like Phantom simulate transazioni before showing them to users, detecting potential failures, extracting token transfer amounts, e identifying program interactions. Simulation adds 1-3 seconds to the wallet-side processing time but significantly improves the user experience by showing accurate fee estimates e transfer amounts.\n\nThe approval screen shows: the requesting dApp's identity (name, icon, URI), the transazione type (transfer, swap, mint, etc.), amounts being transferred, estimated fees, e any warnings (e.g., interaction con unverified programs). The user can approve or reject. The time spent on this screen is unpredictable e depends entirely on the user.\n\n## Response handling\n\nAfter the user approves (or rejects), the wallet constructs e returns a response. Per approved transazioni, the response contains the signed transazione bytes (the original transazione con the wallet's signature appended). Per rejected transazioni, the response contains an error code e message.\n\nOn MWA, the response arrives over the same session channel. The dApp receives a callback con the signed transazione or error. On iOS deep links, the wallet opens the dApp's callback URL con the response encoded in the URL parameters or fragment.\n\nResponse parsing must be defensive. Check that the response contains a valid signature, that the transazione bytes match the original request (to detect tampering), e that the response corresponds to the correct request ID. Wallet may return responses out of order if multiple requests were queued.\n\n## Timeout scenarios\n\nTimeouts are the most challenging failure mode in mobile signing. A timeout can occur at multiple points: during request delivery (the wallet never received the request), during user decision (the user walked away), during response delivery (the wallet signed but the response was lost), or during submission (the signed transazione was sent but confirmation timed out).\n\nEach timeout requires a different recovery strategy. Request delivery timeout: retry the request. User decision timeout: show a \"waiting per wallet\" UI con a cancel option. Response delivery timeout: check on-chain per the transazione signature before retrying (to avoid double-signing). Submission timeout: poll per transazione status before resubmitting.\n\nA reasonable timeout configuration per mobile: 30 seconds per the complete round-trip (request to response), con a 60-second grace period per user decision on the wallet side. If the MWA session itself times out, re-associate before retrying. If the deep link callback never arrives, present a manual \"I've approved in my wallet\" button that triggers a status check.\n\n## The complete timeline\n\nA typical successful signing flow takes 3-8 seconds on Android MWA e 6-15 seconds on iOS deep links. The breakdown: transazione construction (0.5-2s), request delivery (0.1-0.5s on MWA, 1-3s on deep link), wallet simulation (1-3s), user approval (variable), response delivery (0.1-0.5s on MWA, 1-3s on deep link), e transazione submission (0.5-2s).\n\n## Checklist\n- Pre-fetch blockhashes to minimize construction time\n- Include unique request IDs per response correlation\n- Handle all timeout scenarios con appropriate recovery\n- Parse responses defensively con signature validation\n- Provide real-time status feedback during the signing flow\n\n## Red flags\n- Using stale blockhashes that expire during signing\n- Not correlating responses con request IDs\n- Treating all timeouts identically\n- Missing the case where a transazione was signed but the response was lost\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mobilesign-v2-l3-timeline",
                "title": "Signing Session Timeline",
                "steps": [
                  {
                    "cmd": "T+0.0s  dApp: build transaction",
                    "output": "Fetch blockhash, construct istruzioni, serialize to base64",
                    "note": "Transazione construction phase"
                  },
                  {
                    "cmd": "T+0.5s  dApp -> wallet: sign_transactions request",
                    "output": "{\"type\":\"transazione\",\"payload\":\"AQAAA...\",\"requestId\":\"req_001\"}",
                    "note": "Request sent via MWA session or deep link"
                  },
                  {
                    "cmd": "T+1.0s  wallet: simulate transaction",
                    "output": "{\"fee\":\"0.000005 SOL\",\"transfers\":[{\"to\":\"7Y4f...\",\"amount\":\"1.5 SOL\"}]}",
                    "note": "Wallet simulates e extracts display info"
                  },
                  {
                    "cmd": "T+1.5s  wallet: show approval screen",
                    "output": "User sees: Send 1.5 SOL to 7Y4f... | Fee: 0.000005 SOL | [Approve] [Reject]",
                    "note": "User decision - timing is unpredictable"
                  },
                  {
                    "cmd": "T+3.0s  wallet -> dApp: signed response",
                    "output": "{\"signedPayloads\":[\"AQAAA...signed...\"],\"requestId\":\"req_001\"}",
                    "note": "Signed transazione returned to dApp"
                  },
                  {
                    "cmd": "T+3.5s  dApp: submit to RPC",
                    "output": "{\"signature\":\"5UzM...\",\"confirmationStatus\":\"confirmed\"}",
                    "note": "Transazione submitted e confirmed on-chain"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-sign-request": {
            "title": "Challenge: Build a typed sign request",
            "content": "# Challenge: Build a typed sign request\n\nImplement a sign request builder per Mobile Wallet Adapter:\n\n- Validate the payload type (transazione or message)\n- Validate payload data (base64 per transazioni, non-empty string per messages)\n- Set session metadata (app identity con name, URI, e icon)\n- Validate the cluster (mainnet-beta, devnet, or testnet)\n- Generate a request ID if not provided\n- Return a structured SignRequest con validation results\n\nYour implementation will be tested against valid requests, message signing requests, e invalid inputs con multiple errors.",
            "duration": "50 min",
            "hints": [
              "Validate type is either 'transazione' or 'message' before checking payload format.",
              "Transazione payloads must be valid base64 (A-Z, a-z, 0-9, +, /, optional = padding, length divisible by 4).",
              "App identity requires at least name e URI. Icon is optional but should default to empty string.",
              "Generate a requestId from type + payload prefix if not provided."
            ]
          }
        }
      },
      "mobilesign-v2-production": {
        "title": "Production Patterns",
        "description": "Session persistence, transazione-review safety, retry state machines, e deterministic session reporting per production mobile apps.",
        "lessons": {
          "mobilesign-v2-session-persist": {
            "title": "Challenge: Session persistence e restoration",
            "content": "# Challenge: Session persistence e restoration\n\nImplement a session persistence manager per mobile wallet sessions:\n\n- Process a sequence of actions: save, restore, clear, e expire_check\n- Track wallet address e last sign request ID across actions\n- Handle session expiry based on TTL e timestamps\n- Return the final session state con a complete action log\n\nEach action modifies the session state. Save establishes a session, restore checks if it is still valid, clear removes it, e expire_check verifies TTL bounds.",
            "duration": "50 min",
            "hints": [
              "Process actions sequentially: each action modifies the session state.",
              "Save sets walletAddress, lastRequestId, sessionActive=true, e expiresAt = timestamp + TTL.",
              "Restore succeeds only if session is active E current time < expiresAt.",
              "Expire check clears session if current time >= expiresAt."
            ]
          },
          "mobilesign-v2-review-screens": {
            "title": "Mobile transazione review: what users need to see",
            "content": "# Mobile transazione review: what users need to see\n\nTransazione review screens are the last line of defense between a user e a potentially harmful transazione. On mobile, screen real estate is limited e user attention is fragmented. Designing effective review screens requires understanding what information matters, how to present it, e what simulation results to surface.\n\n## Human-readable transazione summaries\n\nRaw transazione data is meaningless to most users. A transazione containing a SystemProgram.transfer istruzione should display \"Send 1.5 SOL to 7Y4f...T6aY\" rather than showing serialized istruzione bytes. The translation from on-chain istruzioni to human-readable summaries is one of the most important UX challenges in mobile wallet development.\n\nSummary generation involves: identifying the program being called (System Program, Token Program, a known DeFi protocol), decoding the istruzione data according to the program's IDL or known layout, extracting the relevant parameters (amounts, addresses, token mints), e formatting them per display. Unknown programs should show a warning: \"Interaction con unverified program: Prog1111...\".\n\nAddress formatting on mobile requires truncation. Full Solana addresses (32-44 characters) do not fit on mobile screens. The standard pattern is showing the first 4 e last 4 characters con an ellipsis: \"7Y4f...T6aY\". Always provide a way to view the full address (tap to expand or copy). Per known addresses (well-known programs, token mints), show the human-readable name instead: \"USDC Token Program\" rather than \"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\".\n\nToken amounts must include decimals e symbols. A raw amount of 1500000 per a USDC transfer should display as \"1.50 USDC\", not \"1500000 lamports\". This requires knowing the token's decimal places e symbol, which can be fetched from the token mint's metadata or a local registry of known tokens.\n\n## Fee display e estimation\n\nTransazione fees on Solana are low but not zero. Users should see the estimated fee before approving. The base fee (currently 5000 lamports or 0.000005 SOL) plus any priority fee should be displayed clearly. If the transazione includes compute budget istruzioni that set a custom fee, extract e display the total.\n\nFee estimation can use simulation results. The Solana RPC simulateTransaction method returns the compute units consumed, which combined con the priority fee rate gives an accurate fee estimate. Display fees in both SOL e the user's preferred fiat currency if possible.\n\nPer transazioni that interact con DeFi protocols, additional costs may apply: swap fees, protocol fees, slippage impact. These should be itemized separately from the network transazione fee. A swap review screen might show: \"Swap 10 USDC per ~0.05 SOL | Network fee: 0.000005 SOL | Protocol fee: 0.01 USDC | Impatto sul prezzo: 0.1%\".\n\n## Simulation results\n\nTransazione simulation is the most powerful tool per transazione review. Before showing the approval screen, simulate the transazione e extract: balance changes (SOL e token account), new account that will be created, account that will be closed, e any errors or warnings.\n\nBalance change summaries are the most intuitive way to present transazione effects. Show a list of changes: \"-1.5 SOL from your wallet\", \"+150 USDC to your wallet\", \"-0.000005 SOL (network fee)\". Color-code decreases (red) e increases (green) per quick visual scanning.\n\nSimulation can detect potential issues: insufficient balance, account ownership conflicts, program errors, e excessive compute usage. Surface these as warnings before the user approves. A warning like \"This transazione will fail: insufficient SOL balance\" saves the user from paying a fee per a failed transazione.\n\n## Approval UX patterns\n\nThe approve e reject buttons must be unambiguous. Use distinct colors (green per approve, red/grey per reject), sufficient spacing to prevent accidental taps, e clear labels (\"Approve\" e \"Reject\", not \"OK\" e \"Cancel\"). Consider requiring a deliberate gesture (swipe to approve) per high-value transazioni.\n\nBiometric confirmation adds sicurezza per high-value transazioni. After the user taps approve, prompt per fingerprint or face recognition before signing. This prevents unauthorized transazioni if the device is unlocked but unattended. Make biometric confirmation optional e configurable.\n\nLoading states during signing should show progress: \"Signing transazione...\", \"Submitting to network...\", \"Waiting per confirmation...\". Never show a blank screen or spinner without context. If the process takes longer than expected, show a message: \"This is taking longer than usual. Your transazione is still processing.\"\n\n## Checklist\n- Translate istruzioni to human-readable summaries\n- Truncate addresses con first 4 e last 4 characters\n- Show token amounts con correct decimals e symbols\n- Display simulation-based fee estimates\n- Surface balance changes con color coding\n- Require deliberate approval gestures per high-value transazioni\n\n## Red flags\n- Showing raw istruzione bytes to users\n- Displaying token amounts without decimal conversion\n- Missing fee information on approval screens\n- No simulation before transazione approval\n- Approve e reject buttons too close together\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l6-q1",
                    "prompt": "How should token amounts be displayed on a mobile transazione review screen?",
                    "options": [
                      "Con correct decimal places e token symbol (e.g., 1.50 USDC)",
                      "As raw lamports or smallest unit values",
                      "In scientific notation per precision"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts must be converted to human-readable format using the token's decimal configuration e include the symbol per clarity."
                  },
                  {
                    "id": "mobilesign-v2-l6-q2",
                    "prompt": "What is the most intuitive way to present transazione simulation results?",
                    "options": [
                      "Balance change summaries con color-coded increases e decreases",
                      "Raw simulation logs from the RPC response",
                      "A list of all account the transazione touches"
                    ],
                    "answerIndex": 0,
                    "explanation": "Balance change summaries (e.g., -1.5 SOL, +150 USDC) are the most user-friendly way to communicate what a transazione will do."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-retry-patterns": {
            "title": "One-tap retry: handling offline, rejected, e timeout states",
            "content": "# One-tap retry: handling offline, rejected, e timeout states\n\nMobile environments are inherently unreliable. Users move between WiFi e cellular, enter tunnels, close apps mid-transazione, e wallet crash. A robust retry system is not optional; it is a core requirement per production mobile dApps. This lezione covers retry state machines, offline detection, user-initiated retry, e mobile-appropriate backoff strategies.\n\n## Retry state machine\n\nEvery sign request in a mobile dApp should be managed by a state machine con well-defined states e transitions. The core states are: idle, pending, signing, submitted, confirmed, failed, e retrying. Each state has specific allowed transitions e associated UI.\n\nIdle: no active request. Transition to pending when the user initiates an action.\n\nPending: the request is being constructed (fetching blockhash, building transazione). Transition to signing when the request is sent to the wallet, or to failed if construction fails (e.g., RPC unreachable).\n\nSigning: waiting per wallet response. Transition to submitted if the wallet returns a signed transazione, to failed if the wallet rejects, or to retrying if the signing times out.\n\nSubmitted: the signed transazione has been sent to the network. Transition to confirmed when the transazione is finalized, or to failed if submission fails or confirmation times out.\n\nConfirmed: terminal success state. Display success UI e clean up.\n\nFailed: non-terminal failure state. Analyze the failure reason e determine if retry is appropriate. Transition to retrying if the failure is retryable, or remain in failed if it is terminal (e.g., user explicitly rejected).\n\nRetrying: preparing to retry. Refresh stale data (new blockhash, updated balances), wait per backoff period, then transition back to pending.\n\n## Offline detection\n\nMobile offline detection is more nuanced than checking navigator.onLine. That property only indicates whether the device has a network interface active, not whether the Solana RPC endpoint is reachable. Implement a multi-layer detection strategy.\n\nLayer 1: Network interface status. Use the device's network state API to detect complete disconnection (airplane mode, no signal). This is instant e covers the most obvious case.\n\nLayer 2: RPC health check. Periodically ping the Solana RPC endpoint con a lightweight request (getHealth or getSlot). If this fails but the network interface is up, the issue is likely RPC-specific. Try a fallback RPC endpoint before declaring offline status.\n\nLayer 3: Transazione-level detection. If a transazione submission returns a network error, mark the request as failed-offline rather than failed-permanent. This distinction drives the retry logic: offline failures should be retried when connectivity returns, while permanent failures (insufficient funds, invalid transazione) should not.\n\nWhen offline is detected, queue pending sign requests locally. Display an offline banner: \"You are offline. Your transazione will be submitted when connectivity returns.\" When connectivity is restored, process the queue in order, refreshing blockhashes per any queued transazioni (they will have expired).\n\n## User-initiated retry\n\nNot all retries should be automatic. When a transazione fails, present the user con context e a clear retry option. The retry button should be prominent (primary action), e the error context should be concise.\n\nPer wallet rejection: \"Transazione was declined in your wallet. [Try Again]\". The retry re-opens the wallet con the same request. Do not automatically retry rejected transazioni; respect the user's decision e only retry on explicit user action.\n\nPer timeout: \"Wallet did not respond in time. This may happen if the wallet app was closed. [Retry] [Cancel]\". Before retrying, check if the transazione was already signed e submitted (to avoid double-signing).\n\nPer network errors: \"Could not reach the Solana network. [Retry When Online]\". This button should be disabled while offline e automatically trigger when connectivity returns.\n\nPer submission failures: \"Transazione could not be confirmed. [Retry con New Blockhash]\". This re-constructs the transazione con a fresh blockhash e re-submits. Show the previous failure reason to build user confidence.\n\n## Exponential backoff on mobile\n\nMobile backoff must be more aggressive than server-side backoff because users are waiting e watching. Start con a 1-second delay, double on each retry, e cap at 8 seconds. After 3 failed retries, stop automatic retrying e present a manual retry option.\n\nThe backoff sequence per automatic retries: 1s, 2s, 4s, then stop. Per user-initiated retries, do not apply backoff (the user explicitly chose to retry, so execute immediately). Per offline queue processing, use a 2-second delay between queued items to avoid overwhelming the RPC endpoint when connectivity returns.\n\nJitter is important even on mobile. Add a random 0-500ms offset to each retry delay to prevent thundering herd problems when many users come back online simultaneously (e.g., after a widespread network outage).\n\nDisplay retry progress to the user: \"Retrying in 3... 2... 1...\" or \"Attempt 2 of 3\". Never retry silently; users should always know the dApp is working on their behalf.\n\n## Checklist\n- Implement a state machine per every sign request lifecycle\n- Detect offline state at network, RPC, e transazione levels\n- Queue transazioni locally when offline\n- Refresh blockhashes before retrying queued transazioni\n- Use mobile-appropriate backoff: 1s, 2s, 4s, then manual\n- Show retry progress e attempt counts to users\n\n## Red flags\n- Automatically retrying user-rejected transazioni\n- Using server-side backoff timing (30s+) on mobile\n- Retrying con stale blockhashes\n- Silently retrying without user visibility\n- Not checking per already-submitted transazioni before retry\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mobilesign-v2-l7-retry-flow",
                "title": "Retry State Machine Flow",
                "steps": [
                  {
                    "cmd": "State: idle -> pending",
                    "output": "User taps 'Send 1.5 SOL'. Fetching blockhash...",
                    "note": "User action triggers request construction"
                  },
                  {
                    "cmd": "State: pending -> signing",
                    "output": "Opening wallet per approval... requestId=req_001",
                    "note": "Request sent to wallet via MWA or deep link"
                  },
                  {
                    "cmd": "State: signing -> failed (timeout after 30s)",
                    "output": "Wallet did not respond. Failure: SIGNING_TIMEOUT",
                    "note": "Wallet app may have been closed or crashed"
                  },
                  {
                    "cmd": "State: failed -> retrying (attempt 1/3, delay 1s)",
                    "output": "Refreshing blockhash... Retrying in 1s...",
                    "note": "Automatic retry con fresh blockhash"
                  },
                  {
                    "cmd": "State: retrying -> signing",
                    "output": "Re-opening wallet per approval... requestId=req_001_r1",
                    "note": "New request sent con updated blockhash"
                  },
                  {
                    "cmd": "State: signing -> submitted",
                    "output": "Wallet approved. Submitting tx: 5UzM...",
                    "note": "Signed transazione submitted to network"
                  },
                  {
                    "cmd": "State: submitted -> confirmed",
                    "output": "Transazione confirmed in slot 234567890. Success!",
                    "note": "Terminal success state"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-session-report": {
            "title": "Checkpoint: Generate a session report",
            "content": "# Checkpoint: Generate a session report\n\nImplement a session report generator that summarizes a complete mobile signing session:\n\n- Count total requests, successful signs, e failed signs\n- Sum retry attempts across all requests\n- Calculate session duration from start e end timestamps\n- Break down requests by type (transazione vs message)\n- Produce deterministic JSON output per consistent reporting\n\nThis checkpoint validates your understanding of session lifecycle, request tracking, e deterministic output generation.",
            "duration": "55 min",
            "hints": [
              "Count requests by status: 'signed' = success, 'rejected'/'timeout'/'error' = failure.",
              "Sum retries across all requests per total retry attempts.",
              "Session duration = sessionEnd - sessionStart in seconds.",
              "Request breakdown counts how many were 'transazione' vs 'message' type."
            ]
          }
        }
      }
    }
  },
  "solana-pay-commerce": {
    "title": "Solana Pay Commerce",
    "description": "Master Solana Pay commerce integration: robust URL encoding, QR/payment tracking workflows, confirmation UX, e deterministic POS reconciliation artifacts.",
    "duration": "12 hours",
    "tags": [
      "solana-pay",
      "commerce",
      "payments",
      "qr",
      "solana"
    ],
    "modules": {
      "solanapay-v2-foundations": {
        "title": "Solana Pay Foundations",
        "description": "Solana Pay specification, URL encoding rigor, transfer request anatomy, e deterministic builder/encoder patterns.",
        "lessons": {
          "solanapay-v2-mental-model": {
            "title": "Solana Pay modello mentale e URL encoding rules",
            "content": "# Solana Pay modello mentale e URL encoding rules\n\nSolana Pay is an open specification per encoding payment requests into URLs that wallet can parse e execute. Unlike traditional payment processors that rely on centralized intermediaries, Solana Pay enables direct peer-to-peer value transfer by embedding all the information a wallet needs into a single URI string. Understanding this specification deeply is the foundation per building any commerce integration on Solana.\n\nThe Solana Pay specification defines two distinct request types: transfer requests e transazione requests. Transfer requests are the simpler of the two — they encode a recipient address, an amount, e optional metadata directly in the URL. The wallet parses the URL, constructs a standard SOL or SPL token transfer transazione, e submits it to the network. Transazione requests are more powerful — the URL points to an API endpoint that returns a serialized transazione per the wallet to sign. This allows the merchant server to build arbitrarily complex transazioni (multi-istruzione, program interactions, etc.) while the wallet simply signs what it receives.\n\nThe URL format follows a strict schema. A transfer request URL takes the form: `solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>&memo=<memo>`. The scheme is always `solana:` (not `solana://`). The recipient is a base58-encoded Solana public key placed immediately after the colon con no slashes. Query parameters encode the payment details.\n\nEach parameter has specific encoding rules. The `amount` is a decimal string representing the number of tokens (not lamports or raw units). Per native SOL, `amount=1.5` means 1.5 SOL. Per SPL tokens, the amount is in the token's human-readable units respecting its decimals. The `spl-token` parameter is optional — when absent, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token. The `reference` parameter is one or more base58 public keys that are added as non-signer keys in the transfer istruzione, enabling transazione discovery via `getSignaturesForAddress`. The `label` identifies the merchant or payment recipient in a human-readable format. The `message` provides a description of the payment purpose. Both `label` e `message` must be URL-encoded using percent-encoding (spaces become `%20`, special characters like `#` become `%23`).\n\nWhen should you use transfer requests versus transazione requests? Transfer requests are ideal per simple point-of-sale payments where the merchant only needs to receive a fixed amount of a single token. They work entirely client-side — no server needed. Transazione requests are necessary when the payment involves multiple istruzioni (e.g., creating an associated token account, interacting con a program, splitting payments among multiple recipients, or including on-chain metadata). Transazione requests require a server endpoint that the wallet calls to fetch the transazione.\n\nURL encoding correctness is critical. A malformed URL will be rejected by compliant wallet. Common mistakes include: using `solana://` instead of `solana:`, encoding the recipient address incorrectly, omitting percent-encoding per special characters in labels, e providing amounts in raw token units instead of human-readable decimals. The specification requires that all base58 values are valid Solana public keys (32 bytes when decoded), e that amounts are non-negative finite decimal numbers.\n\nThe reference key mechanism is what makes Solana Pay pratico per commerce. By generating a unique keypair per transazione e including its public key as a reference, the merchant can poll `getSignaturesForAddress(reference)` to detect when the payment arrives. This eliminates the need per webhooks or push notifications — the merchant simply polls until the reference appears in a confirmed transazione, then verifies the transfer details match the expected payment.\n\n## Commerce operator rule\n\nThink in terms of order-state guarantees, not just payment detection:\n1. request created,\n2. payment observed,\n3. payment validated,\n4. fulfillment released.\n\nEach step needs explicit checks so fulfillment never races ahead of verification.\n\n## Checklist\n- Use `solana:` scheme (no double slashes)\n- Place the recipient base58 address directly after the colon\n- Encode label e message con encodeURIComponent\n- Use human-readable decimal amounts, not raw lamport values\n- Generate a unique reference keypair per payment per tracking\n\n## Red flags\n- Using `solana://` instead of `solana:`\n- Sending raw lamport amounts in the amount field\n- Forgetting to URL-encode label e message parameters\n- Reusing reference keys across multiple payments\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l1-q1",
                    "prompt": "What is the correct URL scheme per Solana Pay transfer requests?",
                    "options": [
                      "solana:<recipient> (single colon, no slashes)",
                      "solana://<recipient> (double slashes like HTTP)",
                      "pay:<recipient> (custom pay scheme)"
                    ],
                    "answerIndex": 0,
                    "explanation": "The Solana Pay specification uses the 'solana:' scheme followed immediately by the recipient address con no slashes."
                  },
                  {
                    "id": "solanapay-v2-l1-q2",
                    "prompt": "When should you use a transazione request instead of a transfer request?",
                    "options": [
                      "When the payment requires multiple istruzioni or program interactions beyond a simple transfer",
                      "When the amount exceeds 100 SOL",
                      "When paying con native SOL instead of SPL tokens"
                    ],
                    "answerIndex": 0,
                    "explanation": "Transazione requests allow the server to build arbitrarily complex transazioni. Transfer requests only support simple single-token transfers."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-transfer-anatomy": {
            "title": "Transfer request anatomy: recipient, amount, reference, e labels",
            "content": "# Transfer request anatomy: recipient, amount, reference, e labels\n\nA Solana Pay transfer request URL contains everything a wallet needs to construct e submit a payment transazione. Each component of the URL serves a specific purpose in the payment flow. Understanding the anatomy of these requests — e how each field maps to on-chain behavior — is essential per building reliable commerce integrations.\n\nThe recipient address is the most critical field. It appears immediately after the `solana:` scheme e must be a valid base58-encoded Solana public key. Per native SOL transfers, this is the wallet address that will receive the SOL. Per SPL token transfers, this is the wallet address whose associated token account (ATA) will receive the tokens. The wallet application is responsible per deriving the correct ATA from the recipient address e the SPL token mint. If the recipient's ATA does not exist, the wallet must create it as part of the transazione (using `createAssociatedTokenAccountIdempotent`). A malformed or invalid recipient address will cause the wallet to reject the payment request entirely.\n\nThe amount parameter specifies how much to transfer in human-readable decimal form. Per native SOL, `amount=2.5` means 2.5 SOL (2,500,000,000 lamports internally). Per USDC (6 decimals), `amount=10.50` means 10.50 USDC (10,500,000 raw units). The wallet handles the conversion from decimal to raw units based on the token's decimal configuration. This progettazione keeps the URL readable by humans e consistent across tokens con different decimal places. The amount must be a positive finite number — zero, negative, or infinite values are invalid.\n\nThe spl-token parameter distinguishes SOL transfers from SPL token transfers. When omitted, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token to transfer. Common examples include USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`), USDT (`Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx`), e any other SPL token. The wallet validates that the mint exists e that the sender has a sufficient balance before constructing the transazione.\n\nThe reference parameter is what makes Solana Pay viable per real-time commerce. A reference is a base58-encoded public key that gets added as a non-signer account in the transfer istruzione. After the transazione confirms, anyone can call `getSignaturesForAddress(reference)` to find the transazione containing this reference. The merchant generates a unique reference keypair per each payment request, encodes the public key in the URL, e then polls the Solana RPC to detect when a matching transazione appears. Multiple references can be included by repeating the parameter: `reference=<key1>&reference=<key2>`. This is useful when multiple parties need to independently track the same payment.\n\nThe label parameter identifies the merchant or payment recipient. It appears in the wallet's confirmation dialog so the user knows who they are paying. Per example, `label=Sunrise%20Coffee` tells the user they are paying \"Sunrise Coffee.\" The label must be URL-encoded — spaces become `%20`, ampersands become `%26`, e other special characters use standard percent-encoding. Keeping labels concise (under 50 characters) ensures they display properly across different wallet implementations.\n\nThe message parameter provides additional context about the payment. It might include an order number, item description, or other merchant-specific information. Like the label, it must be URL-encoded. Example: `message=Order%20%23157%20-%202x%20Espresso`. Some wallet display the message in a secondary line below the label, while others may truncate long messages. The memo parameter (not to be confused con message) adds an on-chain memo istruzione to the transazione, creating a permanent on-chain record. Use message per display purposes e memo per data that must be recorded on-chain.\n\nThe complete flow works as follows: (1) the merchant generates a unique reference keypair, (2) constructs the Solana Pay URL con all parameters, (3) encodes the URL into a QR code or deep link, (4) the customer scans/clicks e their wallet parses the URL, (5) the wallet constructs the transfer transazione including the reference as a non-signer account, (6) the customer approves e the wallet submits the transazione, (7) the merchant polls `getSignaturesForAddress(reference)` until it finds the confirmed transazione, (8) the merchant verifies the transazione details match the expected payment.\n\n## Checklist\n- Validate recipient is a proper base58 public key (32-44 characters)\n- Use human-readable decimal amounts matching the token's precision\n- Generate a fresh reference keypair per every payment request\n- URL-encode label e message con encodeURIComponent\n- Include spl-token only when transferring SPL tokens, not native SOL\n\n## Red flags\n- Reusing the same reference across multiple payment requests\n- Providing amounts in raw lamports or smallest token units\n- Forgetting URL encoding on label or message (breaks parsing)\n- Not validating the recipient address format before URL construction\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l2-q1",
                    "prompt": "How does the reference parameter enable payment tracking?",
                    "options": [
                      "It is added as a non-signer account, allowing getSignaturesForAddress to find the transazione",
                      "It creates a webhook that notifies the merchant",
                      "It stores the payment ID in the transazione memo"
                    ],
                    "answerIndex": 0,
                    "explanation": "The reference public key is included as a non-signer account in the transfer istruzione. The merchant polls getSignaturesForAddress(reference) to detect when the payment transazione confirms."
                  },
                  {
                    "id": "solanapay-v2-l2-q2",
                    "prompt": "What amount value represents 2.5 USDC in a Solana Pay URL?",
                    "options": [
                      "amount=2.5 (human-readable decimal)",
                      "amount=2500000 (raw units con 6 decimals)",
                      "amount=2500000000 (raw units con 9 decimals)"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana Pay URLs use human-readable decimal amounts. The wallet handles the conversion to raw units based on the token's decimal configuration."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-url-explorer": {
            "title": "URL builder: live preview of Solana Pay URLs",
            "content": "# URL builder: live preview of Solana Pay URLs\n\nBuilding Solana Pay URLs correctly requires understanding how each parameter contributes to the final encoded string. In this lezione, we walk through the construction process step by step, examining how different combinations of parameters produce different URLs e how encoding rules affect the output.\n\nThe base URL always starts con the `solana:` scheme followed by the recipient address. There are no slashes, no host, no path segments — just the scheme colon e the base58 address. Per example: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. This alone is a valid Solana Pay URL, though it lacks an amount e would prompt the wallet to request the amount from the user.\n\nAdding query parameters transforms the base URL into a complete payment request. The first parameter is separated from the recipient by `?`, e subsequent parameters are separated by `&`. Parameter order does not affect validity, but convention places amount first per readability. A SOL transfer per 1.5 SOL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5`.\n\nAdding an SPL token changes the transfer type. Including `spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` tells the wallet this is a USDC transfer, not a SOL transfer. The amount is still in human-readable form — `amount=10` means 10 USDC, not 10 raw units. The wallet reads the mint's decimal configuration from the chain e converts accordingly.\n\nThe reference parameter enables payment detection. Each payment should include a unique reference public key. In practice, you generate a Keypair, extract its public key as a base58 string, e include it: `reference=Ref1111111111111111111111111111111111111111`. After the customer pays, you poll `getSignaturesForAddress` con this reference to find the transazione. Multiple references can be included per multi-party tracking.\n\nURL encoding per labels e messages follows standard percent-encoding rules. The JavaScript function `encodeURIComponent` handles this correctly. Spaces become `%20`, the hash symbol becomes `%23`, ampersands become `%26`, e so on. Per example, a label \"Joe's Coffee & Tea\" encodes to `label=Joe's%20Coffee%20%26%20Tea`. Failing to encode these characters breaks the URL parser — an unencoded `&` in a label would be interpreted as a parameter separator, splitting the label e creating an invalid parameter.\n\nLet us trace through a complete example. A coffee shop wants to charge 4.25 USDC per order number 157. The shop's wallet address is `7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. They generate a reference key `Ref1111111111111111111111111111111111111111`. The resulting URL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=4.25&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111&label=Sunrise%20Coffee&message=Order%20%23157`.\n\nValidation before encoding catches errors early. Before building the URL, verify: the recipient is a valid base58 string of 32-44 characters, the amount is a positive finite number, the spl-token (if provided) is a valid base58 string, e the reference (if provided) is a valid base58 string. Emitting clear error messages per each validation failure helps developers debug integration issues quickly.\n\nEdge cases to handle: (1) amounts con many decimal places — truncate to the token's decimal precision, (2) empty or whitespace-only labels — omit the parameter entirely rather than including an empty value, (3) extremely long messages — some wallet truncate at 256 characters, (4) Unicode characters in labels — encodeURIComponent handles UTF-8 encoding correctly, but test con your target wallet.\n\n## Checklist\n- Start con `solana:` followed immediately by the recipient address\n- Use `?` before the first parameter e `&` between subsequent ones\n- Apply encodeURIComponent to label e message values\n- Validate all base58 fields before building the URL\n- Test generated URLs con multiple wallet implementations\n\n## Red flags\n- Including raw unencoded special characters in labels or messages\n- Building URLs con invalid or unvalidated recipient addresses\n- Using fixed reference keys instead of generating unique ones per payment\n- Omitting the spl-token parameter per SPL token transfers\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "solanapay-v2-l3-builder",
                "title": "URL Builder Examples",
                "steps": [
                  {
                    "cmd": "SOL transfer: 1.5 SOL to merchant",
                    "output": "solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5&label=Coffee%20Shop",
                    "note": "Native SOL transfer — no spl-token parameter"
                  },
                  {
                    "cmd": "USDC transfer: 10 USDC with reference",
                    "output": "solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=10&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref111...111&label=Coffee%20Shop",
                    "note": "SPL token transfer con tracking reference"
                  },
                  {
                    "cmd": "Full payment URL with message",
                    "output": "solana:7Y4f...T6aY?amount=4.25&spl-token=EPjF...Dt1v&reference=Ref1...1111&label=Sunrise%20Coffee&message=Order%20%23157",
                    "note": "Complete POS payment request con all fields"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-encode-transfer": {
            "title": "Challenge: Encode a Solana Pay transfer request URL",
            "content": "# Challenge: Encode a Solana Pay transfer request URL\n\nBuild a function that encodes a Solana Pay transfer request URL from input parameters:\n\n- Validate the recipient address (must be 32-44 characters of valid base58)\n- Validate the amount (must be a positive finite number)\n- Construct the URL con the `solana:` scheme e query parameters\n- Apply encodeURIComponent to label e message fields\n- Include spl-token e reference only when provided\n- Return validation errors when inputs are invalid\n\nYour encoder must be fully deterministic — same input always produces the same URL.",
            "duration": "50 min",
            "hints": [
              "Solana Pay URL format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>",
              "Validate recipient: must be 32-44 characters of valid base58.",
              "Amount must be a positive finite number.",
              "Use encodeURIComponent per label e message to handle special characters."
            ]
          }
        }
      },
      "solanapay-v2-implementation": {
        "title": "Tracking & Commerce",
        "description": "Reference tracking state machines, confirmation UX, failure handling, e deterministic POS receipt generation.",
        "lessons": {
          "solanapay-v2-reference-tracker": {
            "title": "Challenge: Track payment references through confirmation states",
            "content": "# Challenge: Track payment references through confirmation states\n\nBuild a reference tracking state machine that processes payment events:\n\n- States flow: pending -> found -> confirmed -> finalized (or pending -> expired)\n- The \"found\" event transitions from pending e records the transazione signature\n- The \"confirmation\" event increments the confirmation counter e transitions from found to confirmed\n- The \"finalized\" event transitions from confirmed to finalized\n- The \"timeout_check\" event expires the reference if still pending after expiryTimeout seconds\n- Record every state transition in a history array con from, to, e timestamp\n\nYour tracker must be fully deterministic — same event sequence always produces the same result.",
            "duration": "50 min",
            "hints": [
              "Track state transitions: pending -> found -> confirmed -> finalized.",
              "The 'found' event sets the signature. 'confirmation' increments the counter.",
              "Timeout check expires the reference if still pending after expiryTimeout seconds.",
              "Record each state change in the history array."
            ]
          },
          "solanapay-v2-confirmation-ux": {
            "title": "Confirmation UX: pending, confirmed, e expired states",
            "content": "# Confirmation UX: pending, confirmed, e expired states\n\nThe user experience during payment confirmation is the most critical moment in any Solana Pay integration. Between the customer scanning the QR code e the merchant acknowledging receipt, there is a window of uncertainty that must be managed con clear visual feedback, appropriate timeouts, e graceful error handling. Getting this right determines whether customers trust your payment system.\n\nThe confirmation lifecycle follows a well-defined state machine. After the QR code is displayed, the system enters the **pending** state — waiting per the customer to scan e submit the transazione. The merchant's system continuously polls `getSignaturesForAddress(reference)` looking per a matching transazione. When a signature appears, the system transitions to the **found** state. The transazione has been submitted but may not yet be confirmed. The system then calls `getTransaction(signature)` to verify the payment details (recipient, amount, token) match the expected values. Once the transazione reaches sufficient confirmations, the state moves to **confirmed**. After the transazione is finalized (maximum commitment level, irreversible), the state reaches **finalized** e the merchant can safely release goods or services.\n\nEach state requires distinct visual treatment. In the **pending** state, display the QR code prominently con a scanning animation or subtle pulse effect. Show a countdown timer indicating how long the payment request remains valid (typically 2-5 minutes). Include the amount, token, e merchant name so the customer can verify before scanning. A \"Waiting per payment...\" message con a spinner keeps the customer informed.\n\nThe **found** state is brief but important. When the transazione is detected, immediately replace the QR code con a checkmark or success animation. Display \"Payment detected — confirming...\" to signal progress. This instant visual feedback is critical — customers need to know their payment was received even before it confirms. Show the transazione signature (abbreviated, e.g., \"sig: abc1...xyz9\") per reference. If you have a Solana Explorer link, provide it.\n\nThe **confirmed** state means the transazione has at least one confirmation. Per low-value transazioni (coffee, small merchandise), this is sufficient to complete the sale. Display a prominent green checkmark, the confirmed amount, e the transazione reference. Print or display a receipt. Per high-value transazioni, you may want to wait per finalized status before releasing goods.\n\nThe **finalized** state is the strongest guarantee — the transazione is part of a rooted slot e cannot be reverted. This takes roughly 6-12 seconds after initial confirmation. Per most point-of-sale applications, waiting per finalized is unnecessary e adds friction. However, per digital goods delivery, API key provisioning, or any irreversible fulfillment, finalized is the safe threshold.\n\nThe **expired** state handles the timeout case. If no matching transazione appears within the expiry window (e.g., 120 seconds), the payment request expires. Display \"Payment request expired\" con an option to generate a new QR code. Never silently expire — the customer may have just scanned e needs to know the request is no longer valid. The expiry timeout should be generous enough per the customer to open their wallet, review the transazione, e approve it (60-120 seconds minimum).\n\nError states require careful messaging. \"Transazione not found after timeout\" suggests the customer did not complete the payment. \"Transazione found but details mismatch\" indicates a potential issue — the amount or recipient does not match expectations. \"Network error during polling\" should trigger automatic retries before displaying an error to the user. Always provide actionable next steps: \"Try again,\" \"Generate new QR,\" or \"Contact support.\"\n\nPolling strategy affects both UX responsiveness e RPC load. Start polling immediately after displaying the QR code. Use a 1-second interval per the first 30 seconds (fast detection), then slow to 2-3 seconds per the remainder of the window. After detecting the transazione, switch to polling `getTransaction` con increasing commitment levels: processed -> confirmed -> finalized. Use exponential backoff if the RPC returns errors.\n\nAccessibility considerations per payment confirmation: (1) Do not rely solely on color to indicate state — use icons, text labels, e animations. (2) Provide audio feedback (a subtle chime on confirmation) per environments where the screen may not be visible. (3) Ensure the QR code has sufficient contrast e size per scanning from a reasonable distance (at least 300x300 pixels). (4) Support both light e dark themes per the confirmation UI.\n\n## Checklist\n- Show distinct visual states: pending, found, confirmed, finalized, expired\n- Display a countdown timer during the pending state\n- Provide instant visual feedback when the transazione is detected\n- Implement appropriate expiry timeouts (60-120 seconds)\n- Offer actionable next steps on expiry or error\n\n## Red flags\n- No visual feedback between QR display e confirmation\n- Silent expiry without notifying the customer\n- Waiting per finalized on low-value point-of-sale transazioni\n- Polling too aggressively (every 100ms) e overloading the RPC\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l6-q1",
                    "prompt": "When is 'confirmed' commitment sufficient versus waiting per 'finalized'?",
                    "options": [
                      "Confirmed is sufficient per low-value POS transazioni; finalized is needed per irreversible digital fulfillment",
                      "Always wait per finalized regardless of transazione value",
                      "Confirmed is never sufficient — always use finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Per coffee-shop-scale payments, confirmed commitment provides a strong enough guarantee. Finalized adds 6-12 seconds of latency e is only necessary when fulfillment is irreversible."
                  },
                  {
                    "id": "solanapay-v2-l6-q2",
                    "prompt": "What should happen when the payment request expires?",
                    "options": [
                      "Display a clear expiry message con an option to generate a new QR code",
                      "Silently restart the polling loop",
                      "Redirect the customer to a different payment method"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired requests should be clearly communicated. The customer may have been in the middle of approving — they need to know the request expired e can try again."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-error-handling": {
            "title": "Error handling e edge cases in payment flows",
            "content": "# Error handling e edge cases in payment flows\n\nProduction payment systems encounter a wide range of failure modes that must be handled gracefully. Solana Pay integrations face challenges unique to blockchain payments: network congestion, RPC failures, partial transazione visibility, e edge cases around token account. Building robust error handling separates demo-quality code from production-grade commerce systems.\n\nRPC connectivity failures are the most common operational issue. The merchant's polling loop depends on a reliable connection to a Solana RPC endpoint. When the RPC is unreachable (network outage, rate limiting, endpoint downtime), the polling loop must not crash or silently stop. Implement retry logic con exponential backoff: first retry after 500ms, second after 1 second, third after 2 seconds, capping at 5 seconds between retries. After 5 consecutive failures, display a degraded-mode warning to the operator (\"Network connectivity issue — payment detection may be delayed\") while continuing to retry in the background. Never abandon polling due to transient RPC errors.\n\nRate limiting from RPC providers is a specific failure mode. Free-tier RPC endpoints (including the public Solana RPC) enforce request limits. A polling loop that fires every second generates 60+ requests per minute per active payment session. If you have 10 concurrent payment sessions, that is 600+ requests per minute. Solutions: use a dedicated RPC provider con higher limits, batch reference checks where possible, implement client-side request deduplication, e cache negative results (reference not found) per a short window before re-checking.\n\nTransazione mismatch errors occur when a transazione is found via the reference but its details do not match expectations. This can happen if: (1) someone accidentally or maliciously sent a transazione that includes the reference key but con wrong amounts, (2) the customer used a different wallet that interpreted the URL differently, or (3) there is a bug in the URL encoding that produced incorrect parameters. When a mismatch is detected, log the full transazione details per debugging, display a clear error to the merchant (\"Payment detected but amount does not match — expected 10 USDC, received 5 USDC\"), e do not mark the payment as complete.\n\nInsufficient balance errors are caught by the customer's wallet before submission, but the merchant has no visibility into this. From the merchant's perspective, it looks like the customer scanned the QR but never submitted the transazione. The timeout/expiry mechanism handles this case — after the expiry window passes, offer to regenerate the QR code. Consider displaying a message like \"If you are having trouble, please ensure you have sufficient balance.\"\n\nAssociated token account (ATA) creation failures can occur when the customer's wallet does not automatically create the recipient's ATA per the SPL token being transferred. This is primarily a concern per less common SPL tokens where the recipient may not have an existing ATA. Modern wallet handle this by including a `createAssociatedTokenAccountIdempotent` istruzione, but older wallet versions may not. The merchant can mitigate this by pre-creating ATAs per all tokens they accept.\n\nDouble-payment detection is essential. If the polling loop detects two transazioni con the same reference, this indicates either a wallet bug or a user submitting the payment twice. The system should only process the first valid transazione e flag any subsequent ones per manual review. Track processed references in a database to prevent duplicate fulfillment.\n\nNetwork congestion causes delayed transazione confirmation. During high-traffic periods, transazioni may take 10-30 seconds to confirm instead of the usual 400ms-2 seconds. The payment UI should handle this gracefully: extend the visual \"confirming\" state, show a message like \"Network is busy — confirmation may take longer than usual,\" e never time out a transazione that has been detected but not yet confirmed. The timeout should only apply to the initial pending state (waiting per any transazione to appear), not to the confirmation stage.\n\nPartial visibility is a subtle edge case. Due to RPC node propagation delays, one RPC node may see a transazione while another does not. If your system uses multiple RPC endpoints (per redundancy), you may detect a transazione on one endpoint e fail to fetch its details from another. Solution: when a signature is found, retry `getTransaction` against the same endpoint that returned the signature, con retries e backoff, before falling back to alternative endpoints.\n\nMemo e metadata validation should verify that any on-chain memo matches the expected payment metadata. If the merchant includes a `memo` parameter in the Solana Pay URL, the confirmed transazione should contain a corresponding memo istruzione. Mismatches may indicate URL tampering.\n\n## Checklist\n- Implement exponential backoff per RPC failures (500ms, 1s, 2s, 5s cap)\n- Verify transazione details match expected payment parameters\n- Handle double-payment detection con reference deduplication\n- Distinguish between pending timeout e confirmation timeout\n- Pre-create ATAs per all accepted SPL tokens\n\n## Red flags\n- Crashing the polling loop on a single RPC error\n- Marking payments complete without verifying amount e recipient\n- Not handling network congestion gracefully (premature timeout)\n- Ignoring double-payment scenarios\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "solanapay-v2-l7-errors",
                "title": "Error Handling Scenarios",
                "steps": [
                  {
                    "cmd": "RPC failure during polling",
                    "output": "Retry 1 (500ms): timeout | Retry 2 (1s): timeout | Retry 3 (2s): success — reference found",
                    "note": "Exponential backoff recovers from transient failures"
                  },
                  {
                    "cmd": "Transaction mismatch detected",
                    "output": "WARN: Expected 10 USDC, found 5 USDC in sig abc1...xyz9\nStatus: MISMATCH — manual review required",
                    "note": "Never auto-complete mismatched payments"
                  },
                  {
                    "cmd": "Double payment on same reference",
                    "output": "TX1: sig aaa...111 (processed) | TX2: sig bbb...222 (DUPLICATE — flagged)\nOnly first valid transazione fulfills the order",
                    "note": "Track processed references to prevent double fulfillment"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-pos-receipt": {
            "title": "Checkpoint: Generate a POS receipt",
            "content": "# Checkpoint: Generate a POS receipt\n\nBuild the final POS receipt generator that combines all corso concepts:\n\n- Reconstruct the Solana Pay URL from payment data (recipient, amount, spl-token, reference, label)\n- Generate a deterministic receipt ID from the reference suffix e timestamp\n- Determine currency type: \"SPL\" if splToken is present, otherwise \"SOL\"\n- Include merchant name from the payment label\n- Include the tracking status from the reference tracker\n- Output must be stable JSON con deterministic key ordering\n\nThis checkpoint validates your complete understanding of Solana Pay commerce integration.",
            "duration": "55 min",
            "hints": [
              "Generate receiptId from the last 8 chars of reference + timestamp.",
              "Reconstruct the Solana Pay URL from payment data.",
              "Currency is 'SPL' if splToken is present, otherwise 'SOL'."
            ]
          }
        }
      }
    }
  },
  "wallet-ux-engineering": {
    "title": "Wallet UX Engineering",
    "description": "Master production wallet UX engineering on Solana: deterministic connection state, network safety, RPC resilience, e measurable reliability patterns.",
    "duration": "12 hours",
    "tags": [
      "wallet",
      "ux",
      "connection",
      "rpc",
      "solana"
    ],
    "modules": {
      "walletux-v2-fundamentals": {
        "title": "Connection Fundamentals",
        "description": "Wallet connection progettazione, network gating, e deterministic state-machine architecture per predictable onboarding e reconnect paths.",
        "lessons": {
          "walletux-v2-connection-design": {
            "title": "Connection UX that doesn't suck: a progettazione checklist",
            "content": "# Connection UX that doesn't suck: a progettazione checklist\n\nWallet connection is the first interaction a user has con any Solana dApp. If this experience is slow, confusing, or error-prone, most users will leave before they ever reach your core product. Connection UX deserves the same engineering rigor as any critical user flow, yet most teams treat it as an afterthought. This lezione establishes the progettazione patterns, failure modes, e recovery strategies that separate professional wallet integration from broken prototypes.\n\n## The connection lifecycle\n\nA wallet connection progresses through a predictable sequence: idle (no wallet detected), detecting (scanning per installed adapters), ready (adapter found, user has not yet approved), connecting (approval dialog shown, waiting per user action), connected (public key received, session active), e disconnected (user or app terminated the session). Each state must have a distinct visual representation so users always know what is happening e what they need to do next.\n\nAuto-connect is the single most impactful UX optimization. When a user has previously connected a specific wallet, the dApp should attempt to reconnect silently on page load without showing a wallet selection modal. The Solana wallet adapter standard supports this via the `autoConnect` flag. However, auto-connect must be gated: only attempt it if the user previously granted permission (stored in localStorage), e set a timeout of 3-5 seconds. If auto-connect fails silently, fall back to showing the connect button without an error message. Users should never see an error per a background reconnection attempt they did not initiate.\n\n## Loading states e skeleton UI\n\nDuring the connecting phase, display a skeleton version of the wallet-dependent UI rather than a blank screen or spinner. If your app shows a token balance after connection, render a shimmer placeholder in that exact layout position. This technique, called \"optimistic layout reservation,\" prevents jarring content shifts when the connection resolves. The connect button itself should transition to a loading state (disabled, con a subtle animation) to prevent double-click issues.\n\nConnection timeouts need explicit handling. If the wallet adapter does not respond within 10 seconds, assume the user closed the approval dialog or the wallet extension is unresponsive. Transition to an error state con a clear message: \"Connection timed out. Please try again or check your wallet extension.\" Never leave the UI in an indefinite loading state. Implement a deterministic timeout using setTimeout e clear it if the connection resolves.\n\n## Error recovery patterns\n\nConnection errors fall into three categories: user-rejected (the user clicked \"Cancel\" in the wallet dialog), adapter errors (the wallet extension crashed or is not installed), e network errors (the RPC endpoint is unreachable after connection). Each category requires a different recovery path.\n\nUser-rejected connections should return to the idle state quietly. Do not show an error toast or modal per a deliberate user action. Simply reset the connect button to its default state. If you want to provide a nudge, a subtle inline message like \"Connect your wallet to continue\" is sufficient.\n\nAdapter errors require actionable guidance. If no wallet is detected, show a \"Get a Wallet\" link that opens the Phantom or Solflare installation page. If the adapter throws an unexpected error, display the error message con a \"Try Again\" button. Log the error details to your analytics system per debugging, but keep the user-facing message simple.\n\nNetwork errors after connection are particularly tricky because the wallet is technically connected (you have the public key) but the app cannot fetch on-chain data. Display a degraded state: show the connected wallet address con a warning badge, disable transazione buttons, e provide a \"Check Connection\" button that re-tests the RPC endpoint. Do not disconnect the wallet just because the RPC is temporarily unreachable.\n\n## Multi-wallet support\n\nModern Solana dApps must support multiple wallet adapters. The wallet selection modal should display installed wallet prominently (con a green \"Detected\" badge) e list popular uninstalled wallet below con \"Install\" links. Sort installed wallet by most recently used. Remember the user's last wallet choice e pre-select it on subsequent visits.\n\nWhen the user switches wallet (disconnects one, connects another), all cached data tied to the previous wallet address must be invalidated. Token balances, transazione history, e program-derived account states are all wallet-specific. Failing to clear this cache causes data leakage between account, which is both a UX bug e a potential sicurezza issue.\n\n## The checklist\n\n- Implement auto-connect con a 3-5 second timeout per returning users\n- Show skeleton UI during the connecting phase to prevent layout shift\n- Set a 10-second hard timeout on connection attempts\n- Handle user-rejected connections silently (no error state)\n- Provide \"Get a Wallet\" links when no adapter is detected\n- Display degraded UI (not disconnect) when RPC fails post-connection\n- Invalidate all wallet-specific caches on account switch\n- Remember the user's preferred wallet adapter between sessions\n- Disable transazione buttons during connecting e error states\n- Log connection errors to analytics per monitoring adapter reliability\n\n## Reliability principle\n\nWallet UX is reliability UX. Users judge trust by whether connect, reconnect, e recovery behave predictably under stress, not by visual polish alone.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "walletux-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "walletux-v2-l1-q1",
                    "prompt": "What should happen when auto-connect fails silently on page load?",
                    "options": [
                      "Show the connect button without an error message",
                      "Display an error toast telling the user to reconnect",
                      "Redirect the user to a wallet installation page"
                    ],
                    "answerIndex": 0,
                    "explanation": "Auto-connect is a background optimization. If it fails, the user never initiated the action, so showing an error would be confusing. Simply display the default connect button."
                  },
                  {
                    "id": "walletux-v2-l1-q2",
                    "prompt": "Why should you show skeleton UI during the connecting phase?",
                    "options": [
                      "It prevents layout shift e sets expectations per where content will appear",
                      "It makes the page load faster",
                      "It is required by the Solana wallet adapter standard"
                    ],
                    "answerIndex": 0,
                    "explanation": "Skeleton UI reserves the layout space per wallet-dependent content, preventing jarring shifts when the connection resolves e data loads."
                  }
                ]
              }
            ]
          },
          "walletux-v2-network-gating": {
            "title": "Network gating e wrong-network recovery",
            "content": "# Network gating e wrong-network recovery\n\nSolana has multiple clusters: mainnet-beta, devnet, testnet, e localnet. Unlike EVM chains where the wallet controls the network e emits chain-change events, Solana's network selection is typically controlled by the dApp, not the wallet. This architectural difference creates a unique set of UX challenges around network mismatch, gating, e recovery.\n\n## The network mismatch problem\n\nWhen a dApp targets mainnet-beta but a user's wallet or the app's RPC endpoint points to devnet, transazioni will fail silently or produce confusing results. Account addresses are the same across clusters, but account state differs entirely. A token account that holds 1000 USDC on mainnet might not exist on devnet. If your app fetches the balance from devnet while the user expects mainnet, they see zero balance e assume the app is broken or their funds are gone.\n\nNetwork mismatch is not always obvious. The wallet might report a successful signature, but the transazione was submitted to a different cluster than the one your app is reading from. This creates phantom transazioni: the user sees \"Transazione confirmed\" but no state change in the UI. Debugging this requires checking which cluster the transazione was submitted to versus which cluster the app is polling.\n\n## Detecting the current network\n\nThe primary detection method is to check your RPC endpoint's genesis hash. Each Solana cluster has a unique genesis hash. Call `getGenesisHash()` on your connection e compare it to known values: mainnet-beta's genesis hash is `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`, devnet is `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`, e testnet is `4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY`. If the genesis hash does not match your expected cluster, the RPC endpoint is misconfigured.\n\nPer wallet-side detection, some wallet adapters expose network information, but this is not standardized. The most reliable approach is to perform a lightweight RPC call (getGenesisHash or getEpochInfo) immediately after connection e compare the response against your expected cluster configuration.\n\n## Network gating patterns\n\nNetwork gating prevents users from performing actions on the wrong network. There are two levels of gating: soft gating e hard gating.\n\nSoft gating shows a warning banner but allows the user to continue. This is appropriate per development tools, block explorers, e apps that intentionally support multiple clusters. The banner should clearly state the current network, use color coding (green per mainnet, yellow per devnet, red per testnet/localnet), e be persistent (not dismissible) so the user always sees it.\n\nHard gating blocks all interactions until the network matches the expected cluster. This is appropriate per production DeFi applications where operating on the wrong network could cause real financial loss. Hard gating should display a full-screen overlay or modal con a clear message: \"This app requires Mainnet Beta. Your connection is currently pointing to Devnet.\" Include a button to switch the RPC endpoint if your app supports runtime endpoint switching.\n\n## Recovery strategies\n\nWhen a network mismatch is detected, the recovery flow depends on who controls the network selection. In most Solana dApps, the app controls the RPC endpoint, so recovery means updating the app's connection object to point to the correct cluster. This can be done automatically (if the correct endpoint is known) or manually (presenting the user con a network selector).\n\nIf recovery requires the user to change their wallet's network setting (less common on Solana but possible con some wallet), provide step-by-step istruzioni specific to the detected wallet adapter. Per Phantom: \"Open Phantom > Settings > Developer Settings > Change Network.\" Include screenshots or a link to the wallet's documentation.\n\nAfter network switching, all cached data must be invalidated. Account states, token balances, transazione history, e program-derived addresses may differ across clusters. Implement a `networkChanged` event handler that: clears all cached RPC responses, resets the connection state machine, re-fetches critical account data, e updates the UI to reflect the new network.\n\n## Multi-network development workflow\n\nPer developers building on Solana, supporting seamless network switching during development is essential. Store the selected network in localStorage so it persists across page reloads. Provide a developer-only network switcher (hidden behind a feature flag or only visible in non-production builds) that allows quick toggling between mainnet, devnet, e localnet.\n\nWhen switching networks programmatically, create a new Connection object rather than mutating the existing one. This prevents race conditions where in-flight requests on the old network collide con new requests on the new network. The connection switch should be atomic: update the connection reference, clear all caches, e trigger a full data refresh in a single synchronous operation.\n\n## Checklist\n- Check genesis hash immediately after RPC connection to verify the cluster\n- Use color-coded persistent banners to indicate the current network\n- Hard-gate production DeFi apps to the expected cluster\n- Invalidate all caches when the network changes\n- Create new Connection objects instead of mutating existing ones\n- Store network preference in localStorage per persistence\n- Provide wallet-specific istruzioni per network switching\n\n## Red flags\n- Allowing transazioni on the wrong network without any warning\n- Caching data across network switches (stale cross-network data)\n- Mutating the Connection object during network switch (race conditions)\n- Assuming wallet e dApp are always on the same cluster\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "walletux-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "walletux-v2-l2-q1",
                    "prompt": "How do you reliably detect which Solana cluster an RPC endpoint is connected to?",
                    "options": [
                      "Call getGenesisHash() e compare against known cluster genesis hashes",
                      "Check the URL string per 'mainnet' or 'devnet'",
                      "Ask the wallet adapter which network it is using"
                    ],
                    "answerIndex": 0,
                    "explanation": "Each Solana cluster has a unique genesis hash. Comparing the RPC's genesis hash against known values is the only reliable detection method, since URL strings can be misleading e wallet don't always expose network info."
                  },
                  {
                    "id": "walletux-v2-l2-q2",
                    "prompt": "What must happen to cached data when the network changes?",
                    "options": [
                      "All cached data must be invalidated because account states differ across clusters",
                      "Only token balances need to be refreshed",
                      "Cached data can be retained since addresses are the same across clusters"
                    ],
                    "answerIndex": 0,
                    "explanation": "While account addresses are identical across clusters, the account states (balances, data, existence) are completely different. All cached RPC data must be cleared on network switch."
                  }
                ]
              }
            ]
          },
          "walletux-v2-state-explorer": {
            "title": "Connection state machine: states, events, e transitions",
            "content": "# Connection state machine: states, events, e transitions\n\nWallet connection logic in most dApps is implemented as a tangle of boolean flags, useEffect hooks, e conditional renders. This approach leads to impossible states (loading E error simultaneously), missed transitions (forgetting to clear the error when retrying), e race conditions (two connection attempts running in parallel). A finite state machine (FSM) eliminates these problems by making every possible state e transition explicit.\n\n## Why state machines per wallet connections\n\nA state machine defines a finite set of states, a finite set of events, e a deterministic transition function that maps (currentState, event) to nextState. At any point in time, the system is in exactly one state. This guarantees that impossible combinations (connected E disconnected) cannot occur. Every event is either handled by the current state or explicitly rejected, eliminating silent failures.\n\nPer wallet connections, the core states are: `disconnected` (no active session), `connecting` (waiting per wallet approval or RPC confirmation), `connected` (session active, public key available), e `error` (something went wrong). Each state maps to a specific UI presentation, specific allowed user actions, e specific side effects.\n\n## Defining the transition table\n\nThe transition table is the heart of the state machine. It specifies which events are valid in which states e what the resulting state should be:\n\n```\ndisconnected + CONNECT       → connecting\nconnecting   + CONNECTED     → connected\nconnecting   + CONNECTION_ERROR → error\nconnecting   + TIMEOUT       → error\nconnected    + DISCONNECT    → disconnected\nconnected    + NETWORK_CHANGE → connected (with updated network)\nconnected    + ACCOUNT_CHANGE → connected (with updated address)\nconnected    + CONNECTION_LOST → error\nerror        + RETRY         → connecting\nerror        + DISCONNECT    → disconnected\n```\n\nAny event not listed per a given state is invalid. Invalid events should transition to the error state con a descriptive message rather than being silently ignored. This makes debugging straightforward: every unexpected event is captured e logged.\n\n## Side effects e context\n\nState transitions carry context (also called \"extended state\" or \"context\"). The connection state machine tracks: `walletAddress` (set on CONNECTED e ACCOUNT_CHANGE events), `network` (set on CONNECTED e NETWORK_CHANGE events), `errorMessage` (set when entering the error state), e `transitions` (a log of all state transitions per debugging).\n\nSide effects are actions triggered by transitions, not by states. Per example, the transition from `connecting` to `connected` should trigger: fetching the initial account balance, subscribing to account change notifications, e logging the connection event to analytics. The transition from `connected` to `disconnected` should trigger: clearing all cached data, unsubscribing from notifications, e resetting the UI to the idle layout.\n\n## Implementation patterns\n\nIn React applications, the state machine can be implemented using `useReducer` con the transition table as the reducer logic. The reducer receives the current state e an event (action), looks up the transition in the table, e returns the new state con updated context. This approach is testable (pure function), predictable (no side effects in the reducer), e composable (multiple components can read the state without duplicating logic).\n\nPer more complex scenarios, libraries like XState provide first-class support per statecharts (hierarchical state machines con guards, actions, e services). XState's visualizer can render the state machine as a diagram, making it easy to verify that all states e transitions are covered. However, per wallet connection logic, a simple transition table in a useReducer is usually sufficient.\n\nThe transition history array is invaluable per debugging. When a user reports a connection issue, the transition log shows exactly what happened: which events fired, in what order, e what states resulted. This is far more useful than a single boolean flag or an error message captured at an arbitrary point.\n\n## Test state machines\n\nState machines are inherently testable because they are pure functions. Given a starting state e a sequence of events, the output is completely deterministic. Test cases should cover: the happy path (disconnected → connecting → connected), error recovery (connecting → error → retry → connecting → connected), account switching (connected → ACCOUNT_CHANGE → connected con new address), e invalid events (connected + CONNECT should transition to error, not silently ignored).\n\nEdge cases to test: rapid event sequences (CONNECT followed immediately by DISCONNECT before the connection resolves), duplicate events (two CONNECTED events in a row), e state persistence (does the machine correctly restore state from localStorage on page reload?).\n\n## Checklist\n- Define all states explicitly: disconnected, connecting, connected, error\n- Map every valid (state, event) pair to a next state\n- Handle invalid events by transitioning to error con a descriptive message\n- Track transition history per debugging\n- Implement the state machine as a pure reducer function\n- Clear context data (wallet address, network) on disconnect\n- Clear error message on retry\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "walletux-v2-l3-states",
                "title": "State Machine Walkthrough",
                "steps": [
                  {
                    "cmd": "Event: CONNECT",
                    "output": "disconnected → connecting",
                    "note": "User clicks Connect, show loading state"
                  },
                  {
                    "cmd": "Event: CONNECTED { walletAddress: '7xKX...', network: 'mainnet-beta' }",
                    "output": "connecting → connected | address=7xKX... | network=mainnet-beta",
                    "note": "Wallet approved, session active"
                  },
                  {
                    "cmd": "Event: ACCOUNT_CHANGE { walletAddress: '9pQR...' }",
                    "output": "connected → connected | address=9pQR... | network=mainnet-beta",
                    "note": "User switched account, address updated, network retained"
                  },
                  {
                    "cmd": "Event: CONNECTION_LOST { message: 'WebSocket closed' }",
                    "output": "connected → error | errorMessage='WebSocket closed'",
                    "note": "Connection dropped, show error con retry option"
                  },
                  {
                    "cmd": "Event: RETRY",
                    "output": "error → connecting | errorMessage=null",
                    "note": "User clicks retry, clear error e reconnect"
                  }
                ]
              }
            ]
          },
          "walletux-v2-connection-state": {
            "title": "Challenge: Implement wallet connection state machine",
            "content": "# Challenge: Implement wallet connection state machine\n\nBuild a deterministic state machine per wallet connection management:\n\n- States: disconnected, connecting, connected, error\n- Process a sequence of events e track all state transitions\n- CONNECTED e ACCOUNT_CHANGE events carry a walletAddress; CONNECTED e NETWORK_CHANGE carry a network\n- Error state stores the error message; disconnected clears all session data\n- Invalid events force transition to error state con a descriptive message\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "50 min",
            "hints": [
              "Define a TRANSITIONS map: each state maps event types to next states.",
              "CONNECTED e ACCOUNT_CHANGE events carry walletAddress. CONNECTED e NETWORK_CHANGE carry network.",
              "Error state stores the error message. Disconnected clears all session data.",
              "Invalid events force transition to error state con descriptive message."
            ]
          }
        }
      },
      "walletux-v2-production": {
        "title": "Production Patterns",
        "description": "Cache invalidation, RPC resilience e health monitoring, e measurable wallet UX quality reporting per production operations.",
        "lessons": {
          "walletux-v2-cache-invalidation": {
            "title": "Challenge: Cache invalidation on wallet events",
            "content": "# Challenge: Cache invalidation on wallet events\n\nBuild a cache invalidation engine that processes wallet events e invalidates the correct cache entries:\n\n- Cache entries have tags: \"account\" (wallet-specific data), \"network\" (cluster-specific data), \"global\" (persists across everything)\n- ACCOUNT_CHANGE invalidates all entries tagged \"account\"\n- NETWORK_CHANGE invalidates entries tagged \"network\" E \"account\" (network change means all account data is stale)\n- DISCONNECT invalidates all non-\"global\" entries\n- Track per-event invalidation counts in an event log\n- Return the final cache state, total invalidated count, e retained count\n\nThe invalidation logic must be deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "ACCOUNT_CHANGE invalidates entries tagged 'account'.",
              "NETWORK_CHANGE invalidates both 'network' e 'account' tagged entries.",
              "DISCONNECT invalidates all non-'global' entries.",
              "Track invalidation counts per event in the event log."
            ]
          },
          "walletux-v2-rpc-caching": {
            "title": "RPC reads e caching strategy per wallet apps",
            "content": "# RPC reads e caching strategy per wallet apps\n\nEvery interaction in a Solana wallet application ultimately depends on RPC calls: fetching balances, loading token account, reading program state, e confirming transazioni. Without a caching strategy, your app hammers the RPC endpoint con redundant requests, drains rate limits, e delivers a sluggish user experience. A well-designed cache layer transforms wallet apps from painfully slow to instantly responsive while keeping data fresh enough per financial accuracy.\n\n## The RPC cost problem\n\nSolana RPC calls are not free. Public endpoints like those provided by Solana Foundation have aggressive rate limits (typically 40 requests per 10 seconds per free tiers). Premium providers (Helius, QuickNode, Triton) charge per request or by compute units consumed. A naive wallet app that re-fetches every piece of data on every render can easily exceed 100 requests per minute per a single user. Multiply by thousands of concurrent users e costs become significant.\n\nBeyond cost, latency kills UX. A `getTokenAccountsByOwner` call takes 200-800ms depending on the endpoint e account complexity. If the user switches tabs e returns, re-fetching everything from scratch creates a noticeable loading delay. Caching eliminates this delay per data that has not changed.\n\n## Cache taxonomy\n\nNot all RPC data has the same freshness requirements. Categorize cache entries by their volatility:\n\n**Immutable data** (cache indefinitely): mint metadata (name, symbol, decimals, logo URI), program account structures, e historical transazione details. Once fetched, this data never changes. Store it in an in-memory Map con no expiration.\n\n**Semi-stable data** (cache per 30-60 seconds): token balances, staking positions, governance votes, e NFT ownership. This data changes infrequently per most users. A 30-second TTL (time to live) provides a good balance between freshness e efficiency. Use a cache key that includes the wallet address e network to prevent cross-account contamination.\n\n**Volatile data** (cache per 5-10 seconds or not at all): recent transazione confirmations, real-time price feeds, e active swap quotes. This data changes constantly e becomes stale quickly. Short TTLs or no caching at all is appropriate. Per transazione confirmations, use WebSocket subscriptions instead of polling.\n\n## Cache key progettazione\n\nCache keys must uniquely identify the request parameters E the context. A good cache key per a balance query includes: the RPC method name, the account address, the commitment level, e the network cluster. Per example: `getBalance:7xKXp...abc:confirmed:mainnet-beta`. Including the network in the key prevents a critical bug: returning devnet data when the user has switched to mainnet.\n\nPer `getTokenAccountsByOwner`, the key should include the owner address e the program filter (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID). Different token programs return different account sets, e caching them under the same key returns incorrect results.\n\n## Invalidation triggers\n\nCache invalidation is triggered by three wallet events: account change, network change, e disconnect. These events were covered in the previous challenge, but the caching layer adds nuance.\n\nAccount change invalidates all entries keyed by the wallet address. Token balances, transazione history, e program-derived account states are all wallet-specific. Global data (mint metadata, program IDL) survives an account change.\n\nNetwork change invalidates everything except truly global, network-independent data (UI preferences, theme settings). Even mint metadata should be invalidated because a mint address might exist on mainnet but not on devnet, or have different state.\n\nUser-initiated refresh is the escape hatch. Provide a \"Refresh\" button that clears the entire cache e re-fetches all visible data. Users expect this when they know an external action (a transfer from another device) has changed their state but the cache has not expired yet.\n\n## Stale-while-revalidate pattern\n\nThe most effective caching strategy per wallet apps is stale-while-revalidate (SWR). When a cache entry is requested: if fresh (within TTL), return it immediately. If stale (past TTL but within a grace period, e.g., 2x TTL), return the stale value immediately E trigger a background re-fetch. When the re-fetch completes, update the cache e notify the UI. If expired (past grace period), block e re-fetch before returning.\n\nThis pattern ensures the UI always responds instantly con the best available data while keeping it fresh in the background. Libraries like SWR (per React) e TanStack Query implement this pattern out of the box con configurable TTL, grace periods, e background refetch intervals.\n\n## Checklist\n- Categorize RPC data by volatility: immutable, semi-stable, volatile\n- Include wallet address e network in all cache keys\n- Invalidate account-tagged caches on wallet switch\n- Invalidate all non-global caches on network switch\n- Implement stale-while-revalidate per semi-stable data\n- Provide a manual refresh button as an escape hatch\n- Monitor cache hit rates to validate your TTL configuration\n\n## Red flags\n- Caching without network in the key (cross-network data leakage)\n- Not invalidating on account switch (showing previous wallet's data)\n- Setting TTLs too long per financial data (stale balance display)\n- Re-fetching everything on every render (defeats the purpose of caching)\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "walletux-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "walletux-v2-l6-q1",
                    "prompt": "Why must cache keys include the network cluster?",
                    "options": [
                      "Account states differ across clusters, so cached devnet data would be wrong per mainnet",
                      "Cache keys must be globally unique per prestazioni",
                      "The Solana RPC protocol requires cluster identification"
                    ],
                    "answerIndex": 0,
                    "explanation": "The same account address can have completely different state on mainnet vs devnet. Without the network in the key, switching clusters would return stale data from the previous cluster."
                  },
                  {
                    "id": "walletux-v2-l6-q2",
                    "prompt": "What does the stale-while-revalidate pattern do when a cache entry is past its TTL?",
                    "options": [
                      "Returns the stale value immediately e triggers a background re-fetch",
                      "Blocks until fresh data is fetched from the RPC",
                      "Deletes the stale entry e returns null"
                    ],
                    "answerIndex": 0,
                    "explanation": "SWR prioritizes responsiveness by serving stale data instantly while refreshing in the background. This eliminates loading states per data that has only slightly exceeded its TTL."
                  }
                ]
              }
            ]
          },
          "walletux-v2-rpc-health": {
            "title": "RPC health monitoring e graceful degradation",
            "content": "# RPC health monitoring e graceful degradation\n\nRPC endpoints are the lifeline of every Solana wallet application. When they go down, become slow, or return stale data, your app becomes unusable. Production wallet apps must continuously monitor RPC health e degrade gracefully when issues are detected, rather than showing cryptic errors or silently displaying stale data. This lezione covers the engineering patterns per building resilient RPC connectivity.\n\n## Why RPC endpoints fail\n\nSolana RPC endpoints experience several failure modes. Rate limiting is the most common: free-tier endpoints enforce strict per-IP e per-second limits, e exceeding them results in HTTP 429 responses. Latency spikes occur during high network activity (NFT mints, token launches) when validatori are under heavy load e RPC nodes queue requests. Stale data happens when an RPC node falls behind the cluster's tip slot, returning account states that are several slots (or seconds) old. Complete outages, while rare per premium providers, do happen e can last minutes to hours.\n\nEach failure mode requires a different response. Rate limiting needs request throttling e backoff. Latency spikes need timeout management e user communication. Stale data needs detection e provider rotation. Complete outages need failover to a backup endpoint.\n\n## Health check implementation\n\nImplement a periodic health check that runs every 15-30 seconds while the app is active. The health check should measure three metrics: latency (round-trip time per a `getSlot` call), freshness (compare the returned slot against the expected tip slot from a secondary source or the previous check), e error rate (percentage of failed requests in the last N calls).\n\nA healthy endpoint has latency under 500ms, slot freshness within 5 slots of the expected tip, e an error rate below 5%. An unhealthy endpoint has latency over 2000ms, slot freshness more than 50 slots behind, or an error rate above 20%. The intermedio range (degraded) triggers warnings without failover.\n\nStore health check results in a rolling window (last 10-20 checks). A single slow response should not trigger failover, but 3 consecutive slow responses should. This smoothing prevents flapping between endpoints due to transient network issues.\n\n## Failover strategies\n\nPrimary-secondary failover is the simplest pattern. Configure a primary RPC endpoint (your preferred provider) e one or more secondaries (different providers per diversity). When the primary becomes unhealthy, route all requests to the secondary. Periodically re-check the primary (every 60 seconds) e switch back when it recovers. This prevents all your traffic from permanently migrating to the secondary.\n\nRound-robin con health weighting distributes requests across multiple endpoints based on their current health scores. A healthy endpoint gets a weight of 1.0, a degraded endpoint gets 0.3, e an unhealthy endpoint gets 0.0. This approach provides better throughput than single-endpoint strategies e automatically adapts to changing conditions.\n\nPer critical transazioni (swaps, transfers), always use the endpoint con the lowest latency E highest freshness. Transazione submission is latency-sensitive: a stale blockhash from a behind-the-tip node will cause the transazione to be rejected. Per read operations (balance queries), slightly stale data is acceptable if it means faster responses.\n\n## Graceful degradation in the UI\n\nWhen RPC health degrades, the UI should communicate the situation clearly without panic. Display a small status indicator (green dot, yellow dot, red dot) near the network name or in the status bar. Clicking it should show detailed health information: current latency, last successful request time, e the number of failed requests.\n\nDuring degraded mode, disable or add warnings to transazione buttons. A yellow warning like \"Network may be slow — transazioni might take longer than usual\" is better than letting users submit transazioni that will likely time out. During a full outage, disable all transazione features e show a clear message: \"Unable to reach the Solana network. Your funds are safe. We'll reconnect automatically.\"\n\nNever hide the degradation. Users who submit transazioni during an outage e see \"Transazione failed\" without explanation will assume their funds are at risk. Proactive communication (\"The network is experiencing delays\") builds trust even when the experience is suboptimal.\n\n## Request retry e throttling\n\nWhen an RPC request fails, classify the error before deciding whether to retry. HTTP 429 (rate limited): back off exponentially starting at 1 second, retry up to 3 times. HTTP 5xx (server error): retry once after 2 seconds, then failover to secondary endpoint. Network timeout: retry once con a shorter timeout (the request may have succeeded but the response was lost), then failover. HTTP 4xx (client error): do not retry, the request is malformed.\n\nImplement a request queue con concurrency limits. Most RPC providers allow 10-40 concurrent requests. If your app tries to fire 50 requests simultaneously (common during initial data loading), queue the excess e process them as earlier requests complete. This prevents self-inflicted rate limiting.\n\nDebounce user-triggered requests. If the user rapidly clicks \"Refresh\" or types in a search field that triggers RPC lookups, debounce the requests to at most one per 500ms. This is simple to implement e dramatically reduces unnecessary RPC traffic.\n\n## Monitoring e alerting\n\nLog all RPC metrics to your observability system: request count, error count, latency percentiles (p50, p95, p99), e cache hit rate. Set alerts per: error rate exceeding 10% over 5 minutes, p95 latency exceeding 3 seconds, e cache hit rate dropping below 50% (indicates a cache invalidation bug or a change in access patterns).\n\nTrack per-endpoint metrics separately. If your primary endpoint's error rate spikes while the secondary is healthy, the failover logic should handle it automatically. But if both endpoints degrade simultaneously, it likely indicates a Solana network-wide issue rather than a provider problem, e the alerting should reflect that distinction.\n\n## Checklist\n- Run health checks every 15-30 seconds measuring latency, freshness, e error rate\n- Implement primary-secondary failover con automatic recovery\n- Display RPC health status in the UI (green/yellow/red indicator)\n- Disable transazione features during outages con clear messaging\n- Classify errors before retrying (429 vs 5xx vs 4xx)\n- Implement request queue con concurrency limits\n- Debounce user-triggered RPC requests\n- Monitor e alert on error rate, latency, e cache hit rate\n\n## Red flags\n- No failover endpoints (single point of failure)\n- Retrying 4xx errors (wastes requests on malformed input)\n- Hiding RPC failures from the user (builds distrust)\n- No concurrency limits (self-inflicted rate limiting)\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "walletux-v2-l7-health",
                "title": "Health Check Flow",
                "steps": [
                  {
                    "cmd": "Health check: primary endpoint",
                    "output": "Latency: 180ms | Slot: 250,000,100 | Status: HEALTHY",
                    "note": "Primary endpoint responding normally"
                  },
                  {
                    "cmd": "Health check: primary endpoint (3 min later)",
                    "output": "Latency: 4200ms | Slot: 250,000,050 | Status: DEGRADED",
                    "note": "Latency spike detected, slot behind tip"
                  },
                  {
                    "cmd": "Failover triggered: switching to secondary",
                    "output": "Secondary: Latency: 220ms | Slot: 250,000,155 | Status: HEALTHY",
                    "note": "Automatic failover to healthy secondary"
                  },
                  {
                    "cmd": "Recovery check: primary endpoint (60s later)",
                    "output": "Latency: 150ms | Slot: 250,000,210 | Status: HEALTHY — switching back",
                    "note": "Primary recovered, restoring as default"
                  }
                ]
              }
            ]
          },
          "walletux-v2-ux-report": {
            "title": "Checkpoint: Generate a Wallet UX Report",
            "content": "# Checkpoint: Generate a Wallet UX Report\n\nBuild the final wallet UX quality report that combines all corso concepts:\n\n- Count connection attempts (CONNECT events) e successful connections (CONNECTED events)\n- Calculate success rate as a percentage con 2 decimal places\n- Compute average connection time from CONNECTED events' durationMs\n- Count ACCOUNT_CHANGE e NETWORK_CHANGE events\n- Calculate cache hit rate from cacheStats (hits / total * 100, 2 decimal places)\n- Calculate RPC health score from rpcChecks (healthy / total * 100, 2 decimal places)\n- Include the timestamp from input\n\nThis checkpoint validates your complete understanding of wallet UX engineering.",
            "duration": "55 min",
            "hints": [
              "Count CONNECT events per attempts, CONNECTED per successes.",
              "Average connect time = total durationMs from CONNECTED events / count.",
              "Cache hit rate = hits / (hits + misses) * 100.",
              "RPC health = healthy checks / total checks * 100."
            ]
          }
        }
      }
    }
  },
  "sign-in-with-solana": {
    "title": "Sign-In Con Solana",
    "description": "Master production SIWS authentication on Solana: standardized inputs, strict verification invariants, replay-resistant nonce lifecycle, e audit-ready reporting.",
    "duration": "12 hours",
    "tags": [
      "siws",
      "authentication",
      "wallet",
      "session",
      "solana"
    ],
    "modules": {
      "siws-v2-fundamentals": {
        "title": "SIWS Fundamentals",
        "description": "SIWS rationale, strict input-field semantics, wallet rendering behavior, e deterministic sign-in input construction.",
        "lessons": {
          "siws-v2-why-exists": {
            "title": "Why SIWS exists: replacing connect-e-signMessage",
            "content": "# Why SIWS exists: replacing connect-e-signMessage\n\nBefore Sign-In Con Solana (SIWS) became a standard, dApps authenticated wallet holders using a two-step pattern: connect the wallet, then call `signMessage` con an arbitrary string. The user would see a raw byte blob in their wallet's approval screen, sign it, e the server would verify the signature against the expected public key. This worked, but it was fragile, inconsistent, e dangerous.\n\n## The problems con raw signMessage\n\nThe fundamental issue con raw `signMessage` authentication is that wallet cannot distinguish between a benign sign-in request e a malicious payload. When a wallet displays \"Sign this message: 0x48656c6c6f\" or even a human-readable string like \"Please sign in to example.com at 2024-01-15T10:30:00Z,\" the wallet has no structured way to parse, validate, or warn about the content. The user must trust that the dApp is honest about what it is asking them to sign.\n\nThis creates several attack vectors. A malicious dApp could present a sign-in prompt that actually contains a serialized transazione. If the wallet treats `signMessage` payloads as opaque bytes (which most do), the user signs what they believe is a login but is actually an authorization per a token transfer. Even without outright fraud, the lack of structure means different dApps format their sign-in messages differently. Users see inconsistent approval screens across applications, eroding trust e making it harder to identify legitimate requests.\n\nReplay attacks are another critical weakness. If a dApp asks the user to sign \"Log in to example.com\" without a nonce or timestamp, the resulting signature is valid forever. An attacker who intercepts this signature (via a compromised server log, a man-in-the-middle proxy, or a leaked database) can replay it indefinitely to impersonate the user. Adding a nonce or timestamp to the message helps, but without a standard format, each dApp implements its own scheme — some correctly, many not.\n\n## What SIWS standardizes\n\nSign-In Con Solana defines a structured message format that wallet can parse, validate, e display in a human-readable, predictable way. The SIWS standard specifies exactly which fields a sign-in request must contain e how wallet should render them. This moves authentication from an opaque byte-signing operation to a semantically meaningful, wallet-aware protocol.\n\nThe core fields of a SIWS sign-in input are: **domain** (the requesting site's origin, displayed prominently by the wallet), **address** (the expected signer's public key), **nonce** (a unique, server-generated value that prevents replay attacks), **issuedAt** (ISO 8601 timestamp marking when the request was created), **expirationTime** (optional deadline after which the sign-in is invalid), **statement** (human-readable description of what the user is approving), **chainId** (the Solana cluster, e.g., mainnet-beta), e **resources** (optional URIs that the sign-in grants access to).\n\nWhen a wallet receives a SIWS request, it knows the structure. It can display the domain prominently so the user can verify they are signing in to the correct site. It can show the expiration time so the user knows the request is time-limited. It can warn if the domain in the request does not match the domain the wallet was connected from. This structured rendering is a massive UX improvement over displaying raw bytes.\n\n## UX improvements per end users\n\nCon SIWS, wallet approval screens become consistent e informative. Instead of seeing an arbitrary string, users see a formatted display: the requesting domain, the statement explaining the action, the nonce (often hidden from the user but validated by the wallet), e time bounds. This consistency across dApps builds user confidence — they impara to recognize what a legitimate sign-in request looks like.\n\nWallet can also implement automatic safety checks. If the domain in the SIWS input does not match the origin of the connecting dApp, the wallet can show a warning or block the request entirely. If the issuedAt timestamp is far in the past or the expirationTime has already passed, the wallet can reject the request before the user even sees it. These checks are impossible con raw `signMessage` because the wallet has no way to parse the content.\n\n## Server-side benefits\n\nPer backend developers, SIWS provides a predictable verification flow. The server generates a nonce, sends the SIWS input to the client, receives the signed output, e verifies: (1) the signature is valid per the claimed address, (2) the domain matches the server's domain, (3) the nonce matches the one the server issued, (4) the timestamps are within acceptable bounds, e (5) the address matches the expected signer. Each check is explicit e auditable, unlike ad-hoc string parsing.\n\nThe nonce mechanism is particularly important. The server stores issued nonces (in memory, Redis, or a database) e marks them as consumed after successful verification. Any attempt to reuse a nonce is rejected as a replay attack. This provides cryptographic proof of freshness that raw signMessage authentication lacks unless the developer explicitly implements it — e history shows most developers do not.\n\n## The path forward\n\nSIWS aligns Solana's authentication story con Ethereum's Sign-In Con Ethereum (SIWE / EIP-4361) e other chain-specific standards. Cross-chain dApps can implement a unified authentication flow con chain-specific signing backends. The wallet-side rendering, nonce management, e verification logic are consistent patterns regardless of the underlying blockchain.\n\n## Operator mindset\n\nTreat SIWS as a protocol contract, not a UI prompt. If nonce lifecycle, domain checks, e time bounds are not enforced as strict invariants, authentication becomes signature theater.\n\n## Checklist\n- Understand why raw signMessage is insufficient per authentication\n- Know the core SIWS fields: domain, address, nonce, issuedAt, expirationTime, statement\n- Recognize that SIWS enables wallet-side validation e consistent UX\n- Understand the server-side nonce flow: generate, issue, verify, consume\n\n## Red flags\n- Using raw signMessage per authentication without structured format\n- Omitting nonce from sign-in messages (enables replay attacks)\n- Not validating domain match between SIWS input e connecting origin\n- Allowing sign-in messages without expiration times\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l1-q1",
                    "prompt": "What is the primary sicurezza problem con using raw signMessage per authentication?",
                    "options": [
                      "Wallet cannot distinguish sign-in requests from malicious payloads",
                      "signMessage is too slow per production use",
                      "signMessage does not produce valid Ed25519 signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without structured format, wallet treat signMessage payloads as opaque bytes e cannot validate or warn about the content, making it easy per malicious dApps to disguise harmful payloads as sign-in requests."
                  },
                  {
                    "id": "siws-v2-l1-q2",
                    "prompt": "How does SIWS prevent replay attacks?",
                    "options": [
                      "By requiring a unique, server-generated nonce that is consumed after verification",
                      "By encrypting the signed message con AES-256",
                      "By requiring the user to sign twice con different keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "The server generates a unique nonce per each sign-in attempt. After successful verification, the nonce is marked as consumed. Any reuse of the same nonce is rejected as a replay attack."
                  }
                ]
              }
            ]
          },
          "siws-v2-input-fields": {
            "title": "SIWS input fields e sicurezza rules",
            "content": "# SIWS input fields e sicurezza rules\n\nThe Sign-In Con Solana input is a structured object that defines every parameter of an authentication request. Each field has specific validation rules, sicurezza implications, e rendering expectations. Understanding every field deeply is essential per building a correct e secure SIWS implementation.\n\n## domain\n\nThe `domain` field identifies the requesting application. It must be a valid domain name without protocol prefix — \"example.com\", not \"https://example.com\". The domain serves as the primary trust anchor: when the wallet displays the sign-in request, the domain is shown prominently so the user can verify they are interacting con the intended site.\n\nSicurezza rule: the server must verify that the domain in the signed output matches its own domain exactly. If a user signs a SIWS message per \"evil.com\" e submits it to \"example.com\", the server must reject it. The domain check prevents cross-site authentication relay attacks where an attacker presents their own domain to the user but submits the signed result to a different server. Domain validation should be case-insensitive (domains are case-insensitive per RFC 4343) e must reject domains containing protocol prefixes, paths, ports, or query strings.\n\n## address\n\nThe `address` field contains the Solana public key (base58-encoded) of the wallet that will sign the request. On Solana, public keys are 32 bytes encoded in base58, resulting in strings of 32-44 characters. The address must match the actual signer of the SIWS output — if the address in the input says \"Wallet111\" but \"Wallet222\" actually signs the message, verification must fail.\n\nSicurezza rule: always validate address format before sending the request to the wallet. A malformed address will cause downstream verification failures. Check that the address is 32-44 characters long e consists only of valid base58 characters (no 0, O, I, or l — these are excluded from base58 to avoid visual ambiguity). On the server side, verify that the address in the signed output matches the address you expected (typically the address of the connected wallet).\n\n## nonce\n\nThe `nonce` is the single most important sicurezza field in SIWS. It is a server-generated, unique, unpredictable string that ties the sign-in request to a specific authentication attempt. The nonce must be at least 8 characters long e should be alphanumeric. In production, nonces are typically 16-32 character random strings generated using a cryptographically secure random number generator.\n\nSicurezza rule: nonces must be generated server-side, never client-side. If the client generates its own nonce, an attacker can reuse a previously valid nonce-signature pair. The server must store the nonce (con a TTL matching the sign-in expiration window) e check it during verification. After successful verification, the nonce must be permanently invalidated (deleted or marked as consumed). The nonce storage must be atomic — a race condition where two requests verify the same nonce simultaneously would defeat the replay protection entirely.\n\nNonce storage options include: in-memory maps (suitable per single-server deployments), Redis con TTL (suitable per distributed systems), e database tables con unique constraints. Whatever storage is used, the invalidation must be atomic: check-e-delete in a single operation, not check-then-delete in two steps.\n\n## issuedAt\n\nThe `issuedAt` field is an ISO 8601 timestamp indicating when the sign-in request was created. It provides temporal context per the authentication attempt. The server sets this value when generating the sign-in input.\n\nSicurezza rule: during verification, the server must check that `issuedAt` is not in the future (allowing a small clock skew tolerance of 1-2 minutes). A sign-in request con a future issuedAt timestamp is suspicious — it may indicate clock manipulation or request fabrication. The server should also reject sign-in requests where issuedAt is too far in the past, even if the expirationTime has not passed. A reasonable maximum age per issuedAt is 10-15 minutes.\n\n## expirationTime\n\nThe `expirationTime` field is an optional ISO 8601 timestamp indicating when the sign-in request becomes invalid. If present, it must be strictly after `issuedAt`. If absent, the sign-in request has no explicit expiration (though the server should still enforce a maximum age based on issuedAt).\n\nSicurezza rule: if expirationTime is present, the server must verify that the current time is before the expiration. Expired sign-in requests must be rejected regardless of signature validity. Setting short expiration windows (5-15 minutes) reduces the window per replay attacks e limits the useful lifetime of intercepted sign-in requests. Production systems should always set expirationTime rather than relying solely on nonce expiration.\n\n## statement\n\nThe `statement` field is a human-readable string that the wallet displays to the user, describing what they are approving. If not provided by the dApp, a sensible default is \"Sign in to <domain>\". The statement should be concise, clear, e accurately describe the action.\n\nSicurezza rule: the statement is informational e should not contain sensitive data. It is included in the signed message, so it is visible to anyone who can see the signature. Do not include session tokens, API keys, or other secrets in the statement. The wallet renders the statement as-is, so avoid HTML, markdown, or other formatting that might be misinterpreted.\n\n## chainId e resources\n\nThe `chainId` field identifies the Solana cluster (e.g., \"mainnet-beta\", \"devnet\", \"testnet\"). This prevents cross-cluster authentication where a signature obtained on devnet is replayed on mainnet. The `resources` field is an optional array of URIs that the sign-in grants access to. These are informational e displayed by the wallet.\n\nSicurezza rule: if your dApp operates on a specific cluster, verify that the chainId in the signed output matches your expected cluster. Resources should be validated as well-formed URIs but their enforcement is application-specific.\n\n## Checklist\n- Domain must not include protocol, path, or port\n- Nonce must be >= 8 alphanumeric characters, generated server-side\n- issuedAt must not be in the future; reject stale requests\n- expirationTime (if present) must be after issuedAt e not yet passed\n- Address must be 32-44 characters of valid base58\n- Statement should default to \"Sign in to <domain>\" if not provided\n\n## Red flags\n- Accepting client-generated nonces\n- Not validating domain format (allowing protocol prefixes)\n- Missing atomic nonce invalidation (check-then-delete race condition)\n- No maximum age check on issuedAt\n- Storing secrets in the statement field\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l2-q1",
                    "prompt": "Why must nonces be generated server-side rather than client-side?",
                    "options": [
                      "Client-generated nonces allow attackers to reuse previously valid nonce-signature pairs",
                      "Client-side random number generators are too slow",
                      "Wallet cannot sign messages containing client-generated nonces"
                    ],
                    "answerIndex": 0,
                    "explanation": "If the client generates nonces, an attacker can replay a previously captured nonce-signature pair. Server-generated nonces ensure each authentication attempt is unique e controlled by the server."
                  },
                  {
                    "id": "siws-v2-l2-q2",
                    "prompt": "What format must the domain field use?",
                    "options": [
                      "Plain domain name without protocol prefix (e.g., example.com)",
                      "Full URL con protocol (e.g., https://example.com)",
                      "IP address con port number"
                    ],
                    "answerIndex": 0,
                    "explanation": "The domain field must be a plain domain name. Protocol prefixes, paths, ports, e query strings must be rejected to ensure consistent domain matching."
                  }
                ]
              }
            ]
          },
          "siws-v2-message-preview": {
            "title": "Message preview: how wallet render SIWS requests",
            "content": "# Message preview: how wallet render SIWS requests\n\nWhen a dApp sends a SIWS sign-in request to a wallet, the wallet transforms the structured input into a human-readable message that the user sees on the approval screen. Understanding exactly how this rendering works is critical per dApp developers — it determines what users see, what they trust, e what they sign.\n\n## The SIWS message format\n\nThe SIWS standard defines a specific text format per the message that gets signed. The wallet constructs this message from the structured input fields. The format follows a predictable template that wallet can both generate e parse. The message begins con the domain e address, followed by a statement, then a structured block of metadata fields.\n\nA complete SIWS message looks like this:\n\n```\nexample.com wants you to sign in with your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z\nChain ID: mainnet-beta\n```\n\nThe first line always follows the pattern: \"`<domain>` wants you to sign in con your Solana account:\". This phrasing is standardized so users impara to recognize it across all SIWS-compatible dApps. The second line is the full public key address. A blank line separates the header from the statement. Another blank line separates the statement from the metadata fields.\n\n## Wallet rendering expectations\n\nModern Solana wallet (Phantom, Solflare, Backpack) recognize SIWS-formatted messages e render them con enhanced UI. Instead of displaying raw text, they parse the structured fields e present them in a formatted approval screen con clear sections.\n\nThe domain is typically displayed prominently at the top of the approval screen, often con the dApp's favicon if available. This is the primary trust signal — users should check this domain matches the site they are interacting con. Some wallet cross-reference the domain against the connecting origin e display a warning if they do not match.\n\nThe statement is shown in a distinct section, often con larger or bolder text. This is the human-readable explanation of what the user is approving. Per sign-in requests, it typically says something like \"Sign in to example.com\" or a custom message the dApp provides.\n\nThe metadata fields (nonce, issuedAt, expirationTime, chainId, resources) are shown in a structured format, often collapsible or in a \"details\" section. Most users do not read these fields, but their presence signals that the request is well-formed e follows the standard. Sicurezza-conscious users can verify the nonce matches their expectation e the timestamps are reasonable.\n\n## What users actually see versus what gets signed\n\nIt is important to understand that what the wallet displays e what actually gets signed can differ. The wallet renders a formatted UI from the parsed fields, but the actual bytes that are signed are the serialized message text in the standard format. The wallet constructs the canonical message text, displays a parsed version to the user, e signs the canonical text.\n\nThis creates a trust model: the user trusts the wallet to accurately represent the message content. If a wallet has a rendering bug (e.g., it shows the wrong domain), the user might approve a message they would otherwise reject. This is why using well-audited, mainstream wallet is important per SIWS sicurezza.\n\nThe signed bytes include the full message text prefixed con a Solana-specific preamble. The Ed25519 signature covers the entire message, including all fields. Changing any field (even adding a space) produces a completely different signature. This ensures that the server can verify not just that the user signed something, but that they signed the exact message con the exact fields the server expected.\n\n## Building preview UIs in dApps\n\nBefore sending a SIWS request to the wallet, many dApps show a preview of the message in their own UI. This preview serves two purposes: it prepares the user per what they will see in the wallet (reducing confusion e approval time), e it provides a last checkpoint before triggering the wallet interaction.\n\nThe dApp preview should mirror the wallet's rendering as closely as possible. Show the domain, statement, e key metadata fields. Indicate that the user will be asked to approve this message in their wallet. If the dApp is using a custom statement, display it exactly as it will appear.\n\nDo not include fields in the preview that might confuse users. The nonce, per example, is a random string that has no meaning to the user. Showing it adds visual noise without value. The preview can omit the nonce while the actual signed message includes it. Similarly, the chainId is important per verification but rarely interesting to users unless the dApp operates across multiple clusters.\n\n## Edge cases in rendering\n\nSeveral edge cases affect how SIWS messages are rendered e signed. Long domains may be truncated in wallet UIs — ensure your domain is concise. Internationalized domain names (IDN) should be tested con your target wallet, as some wallet may not render Unicode characters correctly. The statement field has no maximum length in the standard, but extremely long statements will be truncated or require scrolling in the wallet, reducing the chance that users read them fully.\n\nEmpty optional fields are omitted from the message text. If no expirationTime is set, the \"Expiration Time:\" line does not appear. If no resources are specified, no resources section appears. The message format adjusts dynamically based on which fields are present.\n\n## Checklist\n- Know the canonical SIWS message format e field ordering\n- Understand that wallet parse e render structured UI from the message\n- Build dApp-side previews that mirror wallet rendering\n- Test your SIWS messages con target wallet to verify display\n- Keep statements concise e domains short\n\n## Red flags\n- Assuming all wallet render SIWS messages identically\n- Including sensitive data in the statement (it is visible in the signed message)\n- Using extremely long statements that wallet truncate\n- Not test con real wallet approval screens during development\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "siws-v2-l3-preview",
                "title": "SIWS Message Format",
                "steps": [
                  {
                    "cmd": "Construct SIWS message from input fields",
                    "output": "example.com wants you to sign in con your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z",
                    "note": "Canonical text format that gets signed by the wallet"
                  },
                  {
                    "cmd": "Wallet parses and displays structured approval screen",
                    "output": "Domain: example.com [verified]\nStatement: Sign in to example.com\nExpires: in 59 minutes\n[Approve] [Reject]",
                    "note": "Wallet renders structured UI from parsed fields"
                  },
                  {
                    "cmd": "User approves -> wallet signs canonical message bytes",
                    "output": "Signature: 3AuYNW... (Ed25519 over message bytes)\nPublic Key: 7Y4f3T...",
                    "note": "Signed output returned to the dApp per server verification"
                  }
                ]
              }
            ]
          },
          "siws-v2-sign-in-input": {
            "title": "Challenge: Build a validated SIWS sign-in input",
            "content": "# Challenge: Build a validated SIWS sign-in input\n\nImplement a function that creates a validated Sign-In Con Solana input:\n\n- Validate domain (non-empty, must not include protocol prefix)\n- Validate nonce (at least 8 characters, alphanumeric only)\n- Validate address format (32-44 characters per Solana base58)\n- Set issuedAt (required) e optional expirationTime con ordering check\n- Default statement to \"Sign in to <domain>\" if not provided\n- Return structured result con valid flag e collected errors\n\nYour implementation must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Domain should not include protocol (https://). Strip or reject it.",
              "Nonce must be >= 8 characters e alphanumeric only (/^[a-zA-Z0-9]+$/).",
              "Address must be 32-44 characters (Solana base58 public key).",
              "If no statement is provided, default to 'Sign in to <domain>'."
            ]
          }
        }
      },
      "siws-v2-verification": {
        "title": "Verification & Sicurezza",
        "description": "Server-side verification invariants, nonce replay defenses, session management, e deterministic auth audit reporting.",
        "lessons": {
          "siws-v2-verify-sign-in": {
            "title": "Challenge: Verify a SIWS sign-in response",
            "content": "# Challenge: Verify a SIWS sign-in response\n\nImplement server-side verification of a SIWS sign-in output:\n\n- Check domain matches expected domain\n- Check nonce matches expected nonce\n- Check issuedAt is not in the future relative to currentTime\n- Check expirationTime (if present) has not passed\n- Check address matches expected signer\n- Return verification result con individual check statuses e error list\n\nAll five checks must pass per the sign-in to be considered verified.",
            "duration": "50 min",
            "hints": [
              "Compare domain, nonce, e address between signInOutput e expected values.",
              "issuedAt must be <= currentTime (not in the future).",
              "expirationTime (if present) must be > currentTime.",
              "All five checks must pass per verified = true."
            ]
          },
          "siws-v2-sessions": {
            "title": "Sessions e logout: what to store e what not to store",
            "content": "# Sessions e logout: what to store e what not to store\n\nAfter a successful SIWS sign-in verification, the server must establish a session so the user does not need to re-authenticate on every request. Session management per wallet-based authentication has unique characteristics compared to traditional username-password systems. Understanding what to store, where to store it, e how to handle logout is essential per building secure dApps.\n\n## What a SIWS session contains\n\nA SIWS session represents a verified claim: \"Public key X proved ownership by signing a SIWS message per domain Y at time Z.\" The session should store exactly enough information to enforce authorization decisions without requiring re-verification. The minimum session payload includes: the wallet address (public key), the domain the sign-in was verified per, the session creation time, e the session expiration time.\n\nDo NOT store the SIWS signature, the signed message, or the nonce in the session. These are verification artifacts, not session data. The signature has no purpose after verification — it proved the user controlled the key at the time of signing, e that proof is now captured by the session itself. Storing signatures in sessions creates unnecessary data that, if leaked, provides no additional attack surface but adds complexity e storage cost.\n\nSession identifiers should be opaque, random tokens — not derived from the wallet address. Using the wallet address as a session ID is a common mistake because wallet addresses are public. Anyone who knows a user's address could forge requests. The session ID must be a cryptographically random string (e.g., 256-bit random value, base64-encoded) that maps to the session data on the server side.\n\n## Server-side vs client-side session storage\n\nServer-side sessions store session data in a backend store (Redis, database, in-memory map) e issue a session token (cookie or bearer token) to the client. The client presents the token on each request, e the server looks up the associated session data. This is the most secure pattern because the server controls all session state.\n\nClient-side sessions (JWTs) encode the session data directly in the token. The server signs the JWT e the client includes it in requests. The server verifies the JWT signature e reads the session data without a backend lookup. This is simpler to deploy but has significant drawbacks: JWTs cannot be individually revoked (you must wait per expiration or maintain a revocation list), the session data is visible to the client (encrypted JWTs mitigate this), e JWT size grows con payload data.\n\nPer SIWS authentication, server-side sessions are recommended because they support immediate revocation (critical per sicurezza incidents) e keep session data private. If using JWTs, keep the payload minimal (wallet address e expiration only), use short expiration times (15-60 minutes), e implement a refresh token flow per session extension.\n\n## Session expiration e refresh\n\nSession lifetimes per wallet-authenticated dApps should be shorter than traditional web sessions. Users can sign a new SIWS message quickly (a few seconds), so the cost of re-authentication is low. Recommended session lifetime is 1-4 hours per active sessions, con a sliding window that extends the expiration on each authenticated request.\n\nRefresh tokens can extend session lifetime without requiring re-authentication. The flow is: issue a short-lived access token (15-60 minutes) e a longer-lived refresh token (24-72 hours). When the access token expires, the client presents the refresh token to obtain a new access token. The refresh token is single-use (rotated on each refresh) e stored securely.\n\nAbsolute session lifetime should be enforced regardless of refresh activity. Even if a user keeps refreshing, the session should eventually require re-authentication. A reasonable absolute lifetime is 7-30 days. This limits the damage from a stolen refresh token.\n\n## Logout implementation\n\nLogout per wallet-based authentication is simpler than login but has important nuances. The server must invalidate the session on the backend (delete the session from the store or add the JWT to a revocation list). The client must clear all local session artifacts (cookies, localStorage tokens, in-memory state).\n\nWallet disconnection is not the same as logout. When a user disconnects their wallet from the dApp (using the wallet's disconnect feature), the dApp should treat this as a logout signal e invalidate the server session. However, some dApps maintain the session even after wallet disconnection, which can confuse users who expect disconnection to log them out.\n\nImplementing \"logout everywhere\" (invalidating all sessions per a wallet address) requires server-side session storage con an index by wallet address. When triggered, query all sessions per the address e invalidate them. This is useful per sicurezza incidents or when the user suspects their session was compromised.\n\n## What NOT to store in sessions\n\nNever store the user's private key (obviously). Never store the SIWS nonce (it has been consumed e should be deleted from the nonce store). Never store the raw SIWS signature (it is a verification artifact). Never store personally identifiable information (PII) unless your dApp explicitly collects it — wallet addresses are pseudonymous by default.\n\nAvoid storing wallet balances, token holdings, or other on-chain data in the session. This data changes constantly e becomes stale immediately. Fetch it fresh from the RPC when needed. Sessions should be lightweight: address, permissions, timestamps, e nothing more.\n\n## Checklist\n- Store wallet address, domain, creation time, e expiration in sessions\n- Use cryptographically random session IDs, not wallet addresses\n- Prefer server-side sessions per immediate revocation capability\n- Enforce absolute session lifetime even con refresh tokens\n- Invalidate sessions on both logout e wallet disconnect\n- Never store signatures, nonces, or PII in sessions\n\n## Red flags\n- Using wallet address as session ID\n- Storing SIWS signature or nonce in the session\n- No session expiration or unlimited lifetime\n- JWT sessions without revocation mechanism\n- Ignoring wallet disconnect events\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l6-q1",
                    "prompt": "Why should session IDs be random tokens rather than wallet addresses?",
                    "options": [
                      "Wallet addresses are public, so anyone could forge requests using a known address",
                      "Random tokens are shorter e save bandwidth",
                      "Wallet addresses change frequently e break sessions"
                    ],
                    "answerIndex": 0,
                    "explanation": "Wallet addresses are publicly known. Using them as session IDs would allow anyone who knows a user's address to impersonate their session. Random tokens ensure only the authenticated client can present a valid session."
                  },
                  {
                    "id": "siws-v2-l6-q2",
                    "prompt": "What should happen when a user disconnects their wallet from a dApp?",
                    "options": [
                      "The dApp should invalidate the server-side session (treat it as logout)",
                      "Nothing — the session should persist per convenience",
                      "The dApp should reconnect the wallet automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Wallet disconnection signals the user's intent to end the interaction. The dApp should respect this by invalidating the session, preventing confusion about authentication state."
                  }
                ]
              }
            ]
          },
          "siws-v2-replay-protection": {
            "title": "Replay protection e nonce registry progettazione",
            "content": "# Replay protection e nonce registry progettazione\n\nReplay attacks are the most critical threat to any signature-based authentication system. In a replay attack, an adversary captures a valid signed message e submits it again to the server, impersonating the original signer. SIWS addresses this con nonce-based replay protection, but the implementation details of the nonce registry determine whether the protection actually works.\n\n## How replay attacks work against SIWS\n\nConsider a SIWS sign-in flow without proper nonce management. The user signs a message: \"example.com wants you to sign in con your Solana account: Wallet111... Nonce: abc123 Issued At: 2024-01-01T00:00:00Z\". The server verifies the signature e creates a session. The signed message e signature are transmitted over HTTPS e should be safe in transit.\n\nHowever, the signed message could be captured through: a compromised server log that records request bodies, a malicious browser extension that intercepts WebSocket traffic, a man-in-the-middle proxy in a development or corporate environment, or a compromised CDN that logs request payloads. If the attacker obtains the signed SIWS output, they can submit it to the server as if they were the original signer.\n\nWithout nonce protection, the server would verify the signature (it is valid — the user really did sign it), check the domain (it matches), check the timestamps (they may still be within bounds), e accept the authentication. The attacker now has a valid session per the victim's wallet address.\n\n## Nonce lifecycle\n\nThe nonce lifecycle has four phases: generation, issuance, verification, e consumption. Each phase has specific requirements.\n\nGeneration: the server creates a cryptographically random nonce using a secure random number generator. The nonce must be unpredictable — an attacker should not be able to guess the next nonce by observing previous ones. Use at least 128 bits of entropy (16 bytes, 22 base64 characters or 32 hex characters). Store the nonce in the registry con a TTL e the expected wallet address.\n\nIssuance: the server includes the nonce in the SIWS input sent to the client. The nonce travels from server to client to wallet e back. During this transit, the nonce is not secret (it is included in the signed message), but it is unique. The important property is not secrecy but freshness — this specific nonce has never been used before.\n\nVerification: when the server receives the signed SIWS output, it extracts the nonce e checks the registry. The nonce must exist in the registry (rejecting fabricated nonces), must not be marked as consumed (rejecting replays), e must not have expired (rejecting stale requests). These checks must happen before signature verification to fail fast on obvious replays.\n\nConsumption: after successful verification, the nonce is atomically marked as consumed or deleted from the registry. This is the critical step — if consumption is not atomic, two concurrent requests con the same nonce could both pass the \"not consumed\" check before either marks it as consumed. This race condition completely defeats replay protection.\n\n## Nonce registry progettazione patterns\n\nThe nonce registry is the data structure that stores issued nonces e tracks their state. Several patterns are used in production.\n\nIn-memory map con TTL: a simple hash map where keys are nonce strings e values are metadata (creation time, expected address, consumed flag). A background timer periodically cleans expired entries. This works per single-server deployments but does not scale to multiple servers (each server has its own map e cannot validate nonces issued by other servers).\n\nRedis con atomic operations: Redis provides the ideal primitives per nonce management. Use SET con NX (set-if-not-exists) per atomic consumption: attempt to set a \"consumed\" key; if it already exists, the nonce was already used. Use TTL on nonce keys per automatic expiration. Redis is distributed, so all servers share the same nonce registry.\n\nThe Redis pattern per atomic nonce consumption:\n\n1. On issuance: `SET nonce:<value> \"issued\" EX 600` (10-minute TTL)\n2. On verification: `SET nonce:<value>:consumed \"1\" NX EX 600`\n   - If SET NX succeeds (returns OK): nonce is valid e now consumed\n   - If SET NX fails (returns nil): nonce was already consumed (replay attempt)\n\nDatabase con unique constraints: store nonces in a table con a unique constraint on the nonce value e a \"consumed_at\" column. Consumption is an UPDATE that sets consumed_at where consumed_at IS NULL. If the update affects 0 rows, the nonce was already consumed. Database transazioni ensure atomicity but add latency compared to Redis.\n\n## Handling edge cases\n\nClock skew between servers affects nonce TTL enforcement. If server A issues a nonce con a 10-minute TTL but server B's clock is 3 minutes ahead, server B may consider the nonce expired after only 7 minutes from the user's perspective. Use NTP synchronization across servers e add a grace period (30-60 seconds) to TTL checks.\n\nNonce reuse across different wallet addresses should be rejected. Even if wallet A's nonce was consumed, do not allow wallet B to use the same nonce value. This is automatically handled if the nonce registry indexes by nonce value regardless of address. However, some implementations associate nonces con specific addresses e might accidentally allow cross-address reuse.\n\nHigh-traffic systems may generate thousands of nonces per second. The registry must handle this volume without becoming a bottleneck. Redis handles this easily. In-memory maps work if garbage collection of expired nonces is efficient. Database-backed registries need proper indexing e periodic cleanup of consumed nonces.\n\n## Monitoring e alerting\n\nProduction nonce registries should emit metrics: nonces generated per minute, nonces consumed per minute, replay attempts blocked per minute, nonces expired unused per minute. A sudden spike in replay attempts indicates an active attack. A high ratio of expired-to-consumed nonces may indicate UX issues (users starting but not completing sign-in).\n\nLog every replay attempt con the nonce value, the submitting IP address, e the associated wallet address. This data feeds into sicurezza incident investigation. Alert on replay attempt rates exceeding a threshold (e.g., more than 10 per minute from the same IP).\n\n## Checklist\n- Use cryptographically random nonces con >= 128 bits of entropy\n- Implement atomic nonce consumption (check-e-invalidate in one operation)\n- Set nonce TTL matching the sign-in expiration window (5-15 minutes)\n- Use Redis or equivalent distributed store per multi-server deployments\n- Monitor e alert on replay attempt rates\n- Clean up expired nonces periodically\n\n## Red flags\n- Non-atomic nonce consumption (check-then-delete race condition)\n- In-memory nonce storage in a multi-server distribuzione\n- No nonce TTL (nonces accumulate forever)\n- Allowing nonce reuse across different wallet addresses\n- No monitoring of replay attempt rates\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "siws-v2-l7-nonce-flow",
                "title": "Nonce Lifecycle",
                "steps": [
                  {
                    "cmd": "Server: generate nonce",
                    "output": "nonce = 'k9Xm2pQr7vNw4cBh' (128-bit random, base62)",
                    "note": "Cryptographically random, stored in Redis con 10-min TTL"
                  },
                  {
                    "cmd": "Server: issue SIWS input to client",
                    "output": "{\"domain\":\"example.com\",\"nonce\":\"k9Xm2pQr7vNw4cBh\",\"issuedAt\":\"...\"}",
                    "note": "Nonce travels: server -> client -> wallet -> signed output"
                  },
                  {
                    "cmd": "Server: verify and consume nonce (atomic)",
                    "output": "SET nonce:k9Xm2pQr7vNw4cBh:consumed 1 NX -> OK (first use, valid)",
                    "note": "Atomic SET NX ensures only one request can consume the nonce"
                  },
                  {
                    "cmd": "Attacker: replay same signed output",
                    "output": "SET nonce:k9Xm2pQr7vNw4cBh:consumed 1 NX -> nil (already consumed!)",
                    "note": "Replay blocked: nonce was already consumed"
                  }
                ]
              }
            ]
          },
          "siws-v2-auth-report": {
            "title": "Checkpoint: Generate an auth audit report",
            "content": "# Checkpoint: Generate an auth audit report\n\nBuild the final auth audit report that combines all corso concepts:\n\n- Process an array of authentication attempts con address, nonce, e verified status\n- Track used nonces to detect e block replay attempts (duplicate nonce = replay)\n- Count successful sign-ins, failed sign-ins, e replay attempts blocked\n- Count unique wallet addresses across all attempts\n- Build a nonce registry con status per each attempt: \"consumed\", \"rejected\", or \"replay-blocked\"\n- Include the report timestamp\n\nThis checkpoint validates your complete understanding of SIWS authentication e nonce-based replay protection.",
            "duration": "55 min",
            "hints": [
              "Track used nonces in a map. If a nonce was already used, it's a replay attempt.",
              "Count successful (verified + new nonce), failed (not verified), e replay-blocked separately.",
              "Use an address set to count unique addresses.",
              "Build nonce registry con status: 'consumed', 'rejected', or 'replay-blocked'."
            ]
          }
        }
      }
    }
  },
  "priority-fees-compute-budget": {
    "title": "Priority Fees & Compute Budget",
    "description": "Defensive Solana fee engineering con deterministic compute planning, adaptive priority policy, e confirmation-aware UX reliability contracts.",
    "duration": "9 hours",
    "tags": [
      "solana",
      "fees",
      "compute-budget",
      "reliability"
    ],
    "modules": {
      "pfcb-v2-foundations": {
        "title": "Fee e Compute Foundations",
        "description": "Inclusion mechanics, compute/fee coupling, e explorer-driven policy progettazione con deterministic reliability framing.",
        "lessons": {
          "pfcb-v2-fee-market-reality": {
            "title": "Fee markets on Solana: what actually moves inclusion",
            "content": "# Fee markets on Solana: what actually moves inclusion\n\nPriority fees on Solana are often explained as a simple slider, but production systems need a more precise model. Inclusion is influenced by contention per compute, validatore scheduling pressure, local leader behavior, e the transazione's own resource request profile. Engineers who only look at a single median fee value usually misprice during bursty traffic e then overpay during recovery. This lezione gives a pratico, defensive framework per pricing inclusion without relying on superstition.\n\nA transazione does not compete only on total lamports paid. It competes on requested compute unit price e resource footprint under slot-level pressure. If you request very high compute units e low micro-lamports per compute unit, you may still lose to smaller requests paying a healthier rate. In practice, wallet should treat compute limit e compute price as coupled decisions. Choosing either one in isolation leads to unstable behavior. A route that usually lands con 250,000 units may occasionally need 350,000 because state branches differ. If your safety margin is too tight, you fail. If your safety margin is too loose e your price is high, you overpay.\n\nDefensive engineering starts con synthetic sample sets e deterministic policy simulation. Even if your production system eventually consumes live telemetry, your corso project e baseline tests should prove policy behavior under controlled volatility regimes: calm, elevated, e spike. A calm regime might show p50 e p90 close together, while a spike regime has p90 several multiples above p50. This spread is important because it tells you whether your percentile target alone is enough, or whether you need a volatility guard that adds a controlled premium.\n\nAnother misunderstood point is confirmation UX. Users often interpret \"submitted\" as \"done,\" but processed status is still vulnerable to rollback scenarios e reordering. Per high-value flows, the UI should explain exactly why it waits per confirmed or finalized. This is not academic: support burden spikes when users see optimistic success then reversal. Defensive products align language con protocol reality by attaching explicit state labels e expected next actions.\n\nA robust fee policy also defines failure classes. If a transazione misses inclusion windows repeatedly, the policy should identify whether to raise compute price, raise compute limit, refresh blockhash, or re-quote. Blindly retrying the same payload can amplify congestion e degrade user trust. Good systems cap retries e emit deterministic diagnostics that make support e analytics useful.\n\nYou should model inclusion strategy as policy outputs, not imperative side effects. A policy function should return chosen percentile, volatility adjustment, final micro-lamports target, confidence label, e warnings. By keeping this deterministic e serializable, teams can diff policy versions e verify behavior changes before deploying. This is the same discipline used in risk engines: reproducible decisions first, runtime integrations second.\n\nFinally, keep user education integrated into the product flow. A short explanation that \"network congestion increased your priority fee to improve inclusion probability\" reduces confusion e failed-signature churn. It also helps users compare urgency tiers in a way that feels fair. Defensive UX is not only about blocking risky actions; it is about exposing enough context to prevent panic e repeated mistakes.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Operator mindset\n\nFee policy is an inclusion-probability model, not a guarantee engine. Good systems expose confidence, assumptions, e fallback actions explicitly so operators can respond quickly when regimes shift.\n\n## Checklist\n- Couple compute limit e compute price decisions in one policy output.\n- Use percentile targeting plus volatility guard per unstable markets.\n- Treat confirmation states as distinct UX contracts.\n- Cap retries e classify misses before adjusting fees.\n- Emit deterministic policy reports per audits e regressions.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "pfcb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "pfcb-v2-l1-q1",
                    "prompt": "Why should compute unit limit e price be planned together?",
                    "options": [
                      "Because inclusion depends on both requested resources e bid intensity",
                      "Because compute unit limit is ignored by validatori",
                      "Because priority fee is fixed per transazione"
                    ],
                    "answerIndex": 0,
                    "explanation": "A large CU request con weak price can lose inclusion, while aggressive price on oversized CU can overpay."
                  },
                  {
                    "id": "pfcb-v2-l1-q2",
                    "prompt": "What does a wide p90 vs p50 spread usually indicate?",
                    "options": [
                      "A volatile fee regime where a guard premium may be needed",
                      "A bug in transazione serialization",
                      "Guaranteed finalized confirmation"
                    ],
                    "answerIndex": 0,
                    "explanation": "Spread growth signals unstable contention e lower reliability per naive median pricing."
                  }
                ]
              }
            ]
          },
          "pfcb-v2-compute-budget-failure-modes": {
            "title": "Compute budget fondamenti e common failure modes",
            "content": "# Compute budget fondamenti e common failure modes\n\nMost transazione failures blamed on \"network issues\" are actually planning errors in compute budget e payload sizing. A defensive client treats compute planning as a deterministic preflight policy: estimate required compute, apply bounded margin, decide whether heap allocation is warranted, e explain the result before signing. This lezione focuses on failure modes that recur in production wallet e DeFi frontends.\n\nThe first class is explicit compute exhaustion. When istruzione paths consume more than the transazione limit, execution aborts e users still pay base fees per work already attempted. Teams frequently set one global limit per all routes, which is convenient but unreliable. Route complexity differs by pool topology, account cache warmth, e account creation branches. Planning must operate on per-flow estimates, not app-wide constants.\n\nThe second class is excessive compute requests paired con aggressive bid pricing. This can cause overpayment e user distrust, especially in periods where lower limits would still succeed. A safe policy sets lower e upper bounds, applies a margin to synthetic or simulated expected compute, e clamps to protocol max. If a requested override is present, the system should still clamp e document why. Deterministic reasoning strings are useful because support e QA can inspect exactly why a plan was chosen.\n\nThe third class is transazione size pressure. Large account metas e istruzione data increase serialization footprint, e large payloads often correlate con higher compute paths. While compute planning does not directly solve size limit errors, the same planner can emit a hint when transazione size exceeds a threshold e recommend route simplification or decomposition. In this corso, we keep it deterministic: no RPC checks, only input-driven policy outputs.\n\nA related failure class is memory pressure in workloads that deserialize heavy account sets. Some clients include heap-frame recommendations based on route complexity or size threshold. If you include this in a deterministic planner, keep the conditions explicit e stable. Ambiguous heuristics create policy churn that is hard to test.\n\nGood confirmation UX is another defensive layer. Processed means accepted by a node, confirmed adds stronger network observation, finalized is strongest settlement confidence. Per low-value actions, processed plus pending indicator can be acceptable. Per high-risk value transfer, confirmed or finalized should gate \"success\" copy. Engineers should encode this as policy output rather than ad hoc component logic.\n\nA mature planner also returns warnings. Examples include \"override clamped to max,\" \"size indicates high serialization risk,\" or \"sample set too small per confident bid.\" Warnings should not be noisy; each one should map to an actionable path. Over-warning trains users to ignore alerts, while under-warning hides real risk.\n\nIn deterministic environments, each policy branch should be testable con small synthetic fixtures. You want stable outputs per JSON snapshots, markdown reports, e support triage docs. This discipline scales to production because the same decision shape can later consume live inputs without changing contract semantics.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Compute plans should be bounded, deterministic, e explainable.\n- Planner should expose warning signals, not only numeric outputs.\n- Confirmation messaging should reflect actual settlement guarantees.\n- Inputs must be validated; invalid estimates should fail fast.\n- Unit tests should cover clamp logic e edge thresholds.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "pfcb-v2-l2-terminal",
                "title": "Compute Planner Cases",
                "steps": [
                  {
                    "cmd": "Case A: CU [30000, 20000], size=700",
                    "output": "units=80000, heapBytes=0, reason=standard footprint",
                    "note": "Floor protects small estimates."
                  },
                  {
                    "cmd": "Case B: CU [260000, 250000], size=1200",
                    "output": "units=561000, heapBytes=262144, reason=large footprint",
                    "note": "Large payload triggers heap recommendation."
                  }
                ]
              }
            ]
          },
          "pfcb-v2-planner-explorer": {
            "title": "Explorer: compute budget planner inputs to plan",
            "content": "# Explorer: compute budget planner inputs to plan\n\nExplorers are useful only when they expose policy tradeoffs clearly. Per a fee e compute planner, that means visualizing how input estimates, percentile targets, e confirmation requirements produce a deterministic recommendation. This lezione frames an explorer as a decision table that can be replayed by engineers, support staff, e users.\n\nStart con the three input groups: workload profile, fee samples, e UX confirmation target. Workload profile includes synthetic istruzione CU estimates e payload size. Fee samples represent recent or scenario-based micro-lamport values. Confirmation target defines settlement strictness per the user action type. A deterministic planner should convert these into a stable tuple: compute plan, priority estimate, e warnings.\n\nThe key teaching point is that explorer values should not mutate silently. If a user changes percentile from 50 to 75, the output should change in an obvious e traceable way. If volatility spread exceeds policy guard, the explorer should display a clear badge: \"guard applied.\" This approach teaches policy causality e prevents magical thinking about fees.\n\nExplorer progettazione should also separate confidence from urgency. Confidence describes how trustworthy the current estimate is, often based on sample depth e spread stability. Urgency is a user choice: how quickly inclusion is desired. Confusing these concepts leads to poor defaults e frustrated users. A cautious user may still choose medium urgency if confidence is low e warnings are high.\n\nA defensive explorer includes side-by-side outputs per JSON e markdown summary. JSON provides machine-readable deterministic artifacts per snapshots e regression tests. Markdown provides human-readable communication per support e incident reviews. Both should derive from the same payload to avoid divergence.\n\nIn production teams, explorer traces can become a lightweight runbook. If a user reports repeated misses, support can replay the same inputs e inspect whether the policy selected reasonable values. If not, policy changes can be proposed con test fixtures before rollout. If yes, the issue may be external congestion or stale quote flow, not planner logic.\n\nFrom an engineering quality perspective, deterministic explorers reduce blame cycles. Instead of \"it felt wrong,\" teams can point to exact sample sets, percentile choice, spread guard status, e final plan fields. This clarity is a force multiplier per reliability work.\n\nThe last progettazione principle is explicit assumptions. If your explorer assumes synthetic samples, label them clearly. If it assumes no RPC feedback, state that. Honest boundaries improve trust e encourage users to interpret outputs correctly.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Show clear mapping from each input control to each output field.\n- Expose volatility guard activation as an explicit state.\n- Keep confidence e urgency as separate concepts.\n- Produce identical output per repeated identical inputs.\n- Export JSON e markdown from the same canonical payload.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "pfcb-v2-l3-explorer",
                "title": "Planner Snapshot Samples",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Scenario calm-market",
                      "address": "plan11111111111111111111111111111111111111",
                      "lamports": 1800,
                      "owner": "ComputeBudget111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Scenario volatile-market",
                      "address": "plan22222222222222222222222222222222222222",
                      "lamports": 5500,
                      "owner": "ComputeBudget111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 128
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "pfcb-v2-project-journey": {
        "title": "Fee Optimizer Project Journey",
        "description": "Implement deterministic planners, confirmation policy engines, e stable fee strategy artifacts per release review.",
        "lessons": {
          "pfcb-v2-plan-compute-budget": {
            "title": "Challenge: implement planComputeBudget()",
            "content": "Implement a deterministic compute budget planner. No RPC calls; operate only on provided input data.",
            "duration": "40 min",
            "hints": [
              "Compute units should be ceil(total CU * 1.1) con a floor of 80k e max of 1.4M.",
              "Enable heapBytes per very large tx payloads or high CU totals.",
              "Return a deterministic reason string per test stability."
            ]
          },
          "pfcb-v2-estimate-priority-fee": {
            "title": "Challenge: implement estimatePriorityFee()",
            "content": "Implement policy-based priority fee estimation using synthetic sample arrays e deterministic warnings.",
            "duration": "40 min",
            "hints": [
              "Use percentile targeting from sorted synthetic fee samples.",
              "Apply volatility guard if p90 vs p50 spread exceeds policy threshold.",
              "Clamp output between min e max micro-lamports."
            ]
          },
          "pfcb-v2-confirmation-ux-policy": {
            "title": "Challenge: confirmation level decision engine",
            "content": "Encode confirmation UX policy per processed, confirmed, e finalized states using deterministic risk bands.",
            "duration": "35 min",
            "hints": [
              "Map risk score bands to processed/confirmed/finalized UX levels.",
              "Keep output deterministic e string-stable."
            ]
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            "title": "Challenge: build feePlanSummary markdown",
            "content": "Build stable markdown output per a fee strategy summary that users e support teams can review quickly.",
            "duration": "35 min",
            "hints": [
              "Markdown output should be deterministic e human-readable.",
              "Avoid timestamps or random IDs in output."
            ]
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            "title": "Checkpoint: Fee Optimizer report",
            "content": "Produce a deterministic checkpoint report JSON per the Fee Optimizer final project artifact.",
            "duration": "45 min",
            "hints": [
              "Return stable JSON con sorted warning strings.",
              "Checkpoint report should avoid nondeterministic fields."
            ]
          }
        }
      }
    }
  },
  "bundles-atomicity": {
    "title": "Bundles & Transazione Atomicity",
    "description": "Progettazione defensive multi-transazione Solana flows con deterministic atomicity validation, compensation modeling, e audit-ready safety reporting.",
    "duration": "9 hours",
    "tags": [
      "atomicity",
      "bundles",
      "defensive-design",
      "solana"
    ],
    "modules": {
      "bundles-v2-atomicity-foundations": {
        "title": "Atomicity Foundations",
        "description": "User-intent expectations, flow decomposition, e deterministic risk-graph modeling per multi-step reliability.",
        "lessons": {
          "bundles-v2-atomicity-model": {
            "title": "Atomicity concepts e why users assume all-or-nothing",
            "content": "# Atomicity concepts e why users assume all-or-nothing\n\nUsers rarely think in transazione graphs. They think in intents: \"swap my token\" or \"close my position.\" When a workflow spans multiple transazioni, user expectation remains all-or-nothing unless your UI teaches otherwise. This mismatch between intent-level atomicity e protocol-level execution can produce severe trust failures even when each transazione is technically valid. Defensive engineering starts by mapping user intent boundaries e showing where partial execution can occur.\n\nIn Solana systems, multi-step flows are common. You may need token approval-like setup, associated token account creation, route execution, e cleanup. Each step has independent confirmation behavior e can fail per different reasons. If a flow halts after a preparatory step, the user can be left in a state they never intended: allowances enabled, rent paid per unused account, or funds moved into intermedio holding account.\n\nA rigorous model begins con explicit step typing. Every step should be tagged by function e risk: setup, value transfer, settlement, compensation, e cleanup. Then define dependencies between steps e mark whether each step is idempotent. Idempotency matters because retry logic can create duplicates if a step is not safely repeatable. This is not only a backend concern; frontend orchestration e wallet prompts must respect idempotency constraints.\n\nAnother key concept is compensating action coverage. If a value-transfer step fails midway, does a deterministic refund path exist? If not, your flow should be marked high risk e your UI should block or require additional confirmation. Teams often postpone compensation progettazione until incident response, but defensive corso progettazione should treat compensation as a first-class requirement.\n\nBundle thinking helps organize these concerns. Even without live relay APIs, you can compose a deterministic bundle structure representing intended ordering e invariants. This structure teaches engineers how to reason about all-or-nothing intent, retries, e fallback paths. It also enables stable unit tests that validate graph shape e risk reports.\n\nFrom a UX angle, the most important move is honest framing. If strict atomicity is not guaranteed, state it directly. Users tolerate complexity when language is clear: \"Step 2 may fail after Step 1 succeeds; automatic refund logic is applied if needed.\" Hiding this reality may reduce initial friction but increases long-term mistrust.\n\nSupport e incident teams benefit from deterministic flow reports. A report should list steps, dependencies, idempotency status, e detected issues such as missing refunds or broken dependencies. When users report failed swaps, this report enables quick triage: was the failure expected e safely compensated, or did the flow violate defined invariants?\n\nUltimately, atomicity is a contract between engineering e user expectations. Protocol constraints do not remove that responsibility. They make explicit modeling, test, e communication mandatory.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Operator mindset\n\nAtomicity is a user-trust contract. If strict all-or-nothing is unavailable, compensation guarantees e residual risks must be explicit, testable, e observable in reports.\n\n## Checklist\n- Model flows by intent, not only by transazione count.\n- Annotate each step con dependencies e idempotency.\n- Require explicit compensation paths per value-transfer failures.\n- Produce deterministic safety reports per each flow version.\n- Teach users where all-or-nothing is guaranteed e where it is not.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "bundles-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "bundles-v2-l1-q1",
                    "prompt": "Why do users still expect atomic behavior in multi-tx flows?",
                    "options": [
                      "Because intent-level modello mentales are all-or-nothing",
                      "Because protocols always guarantee it",
                      "Because wallet adapters hide all failures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Users think in outcomes, not internal transazione decomposition."
                  }
                ]
              }
            ]
          },
          "bundles-v2-flow-risk-points": {
            "title": "Multi-transazione flows: approvals, ATA creation, swaps, refunds",
            "content": "# Multi-transazione flows: approvals, ATA creation, swaps, refunds\n\nA reliable flow simulator must encode where partial execution risk lives. In practice, risk points cluster at boundaries: before value transfer, during value transfer, e after value transfer when cleanup or refund steps should run. This lezione maps common Solana flow stages e shows defensive controls that keep failure behavior predictable.\n\nThe first stage is prerequisite setup. Account initialization e ATA creation are often safe e idempotent if implemented correctly, but they still consume fees e may fail under congestion. If setup fails, users should see precise messaging e retry guidance. If setup succeeds e later steps fail, your state machine must remember setup completion to avoid duplicate account creation attempts.\n\nThe second stage is authorization-like setup. On Solana this may differ from EVM approvals, but the pattern remains: a step grants capability to later istruzioni. Non-idempotent or overly broad permissions here amplify downstream risk. Flow validatori should detect non-idempotent authorization steps e force explicit refund or revocation logic if subsequent steps fail.\n\nThe third stage is value transfer or swap execution. This is where market drift, stale quotes, e route failure can break expectations. A deterministic simulator should not fetch live prices; instead it should model success/failure branches e expected compensation behavior. This lets teams test policy without network noise.\n\nThe fourth stage is compensation. If swap execution fails after setup or partial settlement, compensation is the difference between recoverable error e user-facing loss. Compensation steps must be discoverable, ordered, e testable. Simulators should flag flows missing compensation when any non-idempotent or value-affecting step exists.\n\nThe fifth stage is cleanup. Cleanup can include revoking transient permissions, closing temporary account, or recording final status artifacts. Cleanup should be safe to retry e should not hide failures. Some teams skip cleanup during congestion, but then debt accumulates in user account e backend state.\n\nDefensive patterns include idempotency keys per orchestration, deterministic status transitions, e explicit issue codes per each risk category. Per example, the missing-refund issue code should always map to the same report semantics so monitoring dashboards remain stable.\n\nA flow graph explorer can teach these points effectively. By visualizing nodes e edges con risk annotations, teams quickly see where assumptions are weak. Edges should represent hard dependencies, not optional sequencing preferences. If a dependency references a missing step, the graph should fail validation immediately.\n\nDuring incident reviews, deterministic graph reports outperform log fragments. They provide compact, reproducible context: what was planned, what safety checks failed, e which invariants were violated. This reduces MTTR e avoids repeated misclassification.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Label setup, value, compensation, e cleanup steps explicitly.\n- Treat non-idempotent setup as high-risk without compensating actions.\n- Validate dependency graph integrity before execution planning.\n- Encode deterministic issue codes e severity mapping.\n- Keep simulator behavior offline e reproducible.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "bundles-v2-l2-terminal",
                "title": "Flow Graph Risk Walkthrough",
                "steps": [
                  {
                    "cmd": "Step set: approve -> swap",
                    "output": "Issue: missing-refund, non-idempotent risk",
                    "note": "No compensation path after swap failure."
                  },
                  {
                    "cmd": "Step set: approve -> swap -> refund",
                    "output": "Issue count decreases; compensation path available",
                    "note": "Still verify idempotency on each step."
                  }
                ]
              }
            ]
          },
          "bundles-v2-flow-explorer": {
            "title": "Explorer: flow graph steps e risk points",
            "content": "# Explorer: flow graph steps e risk points\n\nFlow graph explorers are most valuable when they highlight risk semantics, not just sequence order. A defensive explorer should display each step con dependency context, idempotency flag, e compensation coverage. Engineers should be able to answer three questions immediately: what can fail, what can be retried safely, e what protects users if a value step fails.\n\nStart by treating each node as a contract. A node contract defines preconditions, side effects, e postconditions. Preconditions include required upstream steps e expected inputs. Side effects include account state changes or transfer intents. Postconditions include observable status updates e possible compensation requirements. When node contracts are explicit, validation rules become straightforward e deterministic.\n\nEdges in the graph should represent hard causality. If step B depends on step A output, represent that as an edge e validate existence at build time. Optional order preferences should not be encoded as dependencies because they can produce false positives e brittle reports. Keep graph semantics strict e minimal.\n\nRisk annotations should be first-class fields. Instead of deducing risk later from prose, attach tags such as value-transfer, non-idempotent, requires-refund, e cleanup-only. Report generation can then aggregate these tags into issue summaries e recommended mitigations.\n\nA robust explorer also teaches \"atomic in user model\" versus \"atomic on chain.\" You can annotate the whole flow con intent boundary metadata that states whether strict atomic guarantee exists. If not, the explorer should list compensation guarantees e residual risk in plain language.\n\nDeterministic bundle composition is a useful next layer. Even without calling relay services, you can generate a bundle artifact that enumerates transazione groupings e invariants. This allows stable comparisons across policy revisions. If a future change removes a refund invariant, tests should fail immediately.\n\nEngineers should avoid dynamic output fields like timestamps inside core report payloads. Keep those in outer metadata if needed. Stable JSON e markdown outputs make review diffs reliable e reduce false positives in CI snapshots.\n\nFrom a teaching standpoint, explorer sessions should include both safe e unsafe examples. Seeing a missing dependency or missing refund issue in a concrete graph is more memorable than reading abstract warnings. The corso challenge sequence then asks learners to codify the same checks.\n\nFinally, remember that atomicity work is reliability work. It is not a special sicurezza-only track. The same graph discipline helps product, backend, e support teams share one truth source per multi-step behavior.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Represent node contracts e dependency edges explicitly.\n- Annotate risk tags directly in graph data.\n- Distinguish user-intent atomicity from protocol guarantees.\n- Generate deterministic bundle e report artifacts.\n- Include unsafe example graphs in test fixtures.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "bundles-v2-l3-explorer",
                "title": "Flow Risk Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Unsafe flow without refund",
                      "address": "flow11111111111111111111111111111111111111",
                      "lamports": 3,
                      "owner": "FlowValidator1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 84
                    },
                    {
                      "label": "Safe flow con compensation",
                      "address": "flow22222222222222222222222222222222222222",
                      "lamports": 1,
                      "owner": "FlowValidator1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "bundles-v2-project-journey": {
        "title": "Atomic Swap Flow Simulator",
        "description": "Build, validate, e report deterministic flow safety con compensation checks, idempotency handling, e bundle artifacts.",
        "lessons": {
          "bundles-v2-build-atomic-flow": {
            "title": "Challenge: implement buildAtomicFlow()",
            "content": "Build a normalized deterministic flow graph from steps e dependencies.",
            "duration": "40 min",
            "hints": [
              "Normalize order by step ID e dependency ID per deterministic flow graphs.",
              "Emit explicit edges from dependency relationships."
            ]
          },
          "bundles-v2-validate-atomicity": {
            "title": "Challenge: implement validateAtomicity()",
            "content": "Detect partial execution risk, missing refunds, e non-idempotent steps.",
            "duration": "40 min",
            "hints": [
              "Detect missing refund branch per swap flows.",
              "Flag non-idempotent steps because retries can break all-or-nothing guarantees."
            ]
          },
          "bundles-v2-failure-handling-patterns": {
            "title": "Challenge: failure handling con idempotency keys",
            "content": "Encode deterministic failure handling metadata, including compensation state.",
            "duration": "35 min",
            "hints": [
              "Generate deterministic idempotency keys from stable inputs.",
              "Always emit explicit refund-path state per observability."
            ]
          },
          "bundles-v2-bundle-composer": {
            "title": "Challenge: deterministic bundle composer",
            "content": "Compose a deterministic bundle structure per an atomic flow. No relay calls.",
            "duration": "35 min",
            "hints": [
              "No real Jito calls. Build deterministic data structures only.",
              "One step per transazione keeps test assertions simple e stable."
            ]
          },
          "bundles-v2-flow-safety-report": {
            "title": "Checkpoint: flow safety report",
            "content": "Generate a stable markdown flow safety report checkpoint artifact.",
            "duration": "45 min",
            "hints": [
              "Render a stable markdown report as the final checkpoint artifact.",
              "Keep the PASS/FAIL status deterministic from issue count."
            ]
          }
        }
      }
    }
  },
  "mempool-ux-defense": {
    "title": "Mempool Reality & Anti-Sandwich UX",
    "description": "Defensive swap UX engineering con deterministic risk grading, bounded slippage policies, e incident-ready safety communication.",
    "duration": "9 hours",
    "tags": [
      "mempool",
      "ux",
      "slippage",
      "risk-policy"
    ],
    "modules": {
      "mempoolux-v2-foundations": {
        "title": "Mempool Reality e UX Defense",
        "description": "Quote-to-execution risk modeling, slippage guardrails, e defensive user education per safer swap decisions.",
        "lessons": {
          "mempoolux-v2-quote-execution-gap": {
            "title": "What can go wrong between quote e execution",
            "content": "# What can go wrong between quote e execution\n\nA swap quote is a prediction, not a guarantee. Between quote generation e execution, liquidity changes, competing orders land, e network conditions shift. Users often assume that seeing a quote means they will receive that outcome, but production UX must teach e enforce the gap between quote time e execution time. This corso is defensive by progettazione: no exploit strategies, only protective policy e communication.\n\nThe first risk is quote staleness. Even in calm periods, a quote generated several seconds ago can diverge from current route quality. During high activity, divergence can happen in sub-second windows. A protective UI should track quote age continuously e degrade confidence as age increases. At defined thresholds, it should warn or block execution until a refresh occurs.\n\nThe second risk is slippage misconfiguration. Slippage tolerance exists to bound acceptable execution drift. If set too tight, legitimate transazioni fail frequently. If set too wide, users can receive unexpectedly poor execution. Defensive systems define policy bounds e recommend values based on route characteristics, not a single static default.\n\nThe third risk is impatto sul prezzo misunderstanding. Impatto sul prezzo measures how much your order moves market price due to route depth. Slippage tolerance measures allowed execution variance. They are related but not interchangeable. Teaching this difference prevents users from widening slippage to \"fix\" impact-heavy trades that should instead be resized or rerouted.\n\nThe fourth risk is route complexity. Multi-hop routes can improve nominal quote value but introduce more points of state dependency e timing drift. A risk engine should account per hop count as a reliability input. This does not mean all multi-hop routes are unsafe; it means risk should be surfaced proportionally.\n\nThe fifth risk is liquidity quality. Low-liquidity routes are more fragile under contention. Deterministic scoring can treat liquidity as one signal among many, producing grade outputs like low, medium, high, e critical. Grades should be accompanied by reasons, so warnings are explainable.\n\nProtective UX is not just warning banners. It includes defaults, disabled states, timed refresh prompts, e clear language about what each control does. If users do not understand controls, they either ignore them or misconfigure them. The best interfaces explain tradeoffs in one sentence e keep avanzato controls available without forcing novices into risky settings.\n\nPolicy engines should produce deterministic artifacts per testability. Given identical input tuples, risk grade e warnings should remain identical. This enables stable unit tests e predictable support behavior. It also allows teams to review policy changes as code diffs rather than subjective UI adjustments.\n\nThe goal is not zero failed swaps; the goal is informed, bounded risk con transparent behavior. Users accept tradeoffs when systems are honest e consistent.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Operator mindset\n\nProtected swap UX is policy UX. Defaults, warnings, e block states should be deterministic, explainable, e versioned so teams can defend decisions during incidents.\n\n## Checklist\n- Track quote age e apply graded stale-quote policies.\n- Separate impatto sul prezzo education from slippage controls.\n- Incorporate route hops e liquidity into risk scoring.\n- Emit deterministic risk reasons per UX copy.\n- Block execution only when policy thresholds are clearly crossed.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mempoolux-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mempoolux-v2-l1-q1",
                    "prompt": "What is the primary difference between slippage e impatto sul prezzo?",
                    "options": [
                      "Slippage is user tolerance; impact is market footprint",
                      "They are identical metrics",
                      "Impatto sul prezzo only applies on CEXs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Slippage is a user-configured bound, while impact reflects route liquidity response to trade size."
                  }
                ]
              }
            ]
          },
          "mempoolux-v2-slippage-guardrails": {
            "title": "Slippage controls e guardrails",
            "content": "# Slippage controls e guardrails\n\nSlippage settings are a policy surface, not a cosmetic preference. Defensive swap UX defines explicit bounds, context-aware defaults, e clear consequences when users attempt risky overrides. This lezione focuses on guardrail progettazione that reduces avoidable losses while preserving user agency.\n\nA strong policy starts con minimum e maximum bounds. The minimum protects against unusable settings that cause endless failures. The maximum protects against overly permissive settings that convert volatility into severe execution loss. Between bounds, choose a default aligned con typical route behavior. Per many flows this is moderate, then dynamically adjusted by quote freshness e impact context.\n\nGuardrails should respond to stale quotes. If quote age passes a threshold, a safe policy can lower recommended slippage e request refresh before signing. If quote age becomes severely stale, execution should be blocked con a deterministic message. Blocking should be rare but unambiguous. Users should know whether a refresh can unblock immediately.\n\nImpact-aware adjustment is another essential control. High projected impact may require either tighter trade sizing or broader tolerance depending on objective. Defensive UX should encourage reviewing trade size first, not instantly widening tolerance. If users choose high tolerance anyway, warnings should explain downside plainly.\n\nOverride behavior must be deterministic. When a user-selected value exceeds policy max, clamp it e emit a warning that can be exported in reports. Silent clamping is dangerous because users think they are running one setting while the engine uses another. Explicit feedback builds trust e prevents support confusion.\n\nCopy quality matters. Avoid technical jargon in warning body text. A good warning says what is wrong, why it matters, e what to do next. Per example: \"Quote is stale; refresh before signing to avoid outdated execution terms.\" This is better than \"staleness threshold exceeded.\" Engineers can keep technical details in debug exports.\n\nGuardrails should also integrate con route preview components. Showing risk grade beside slippage recommendation helps users interpret controls in context. If grade is high e slippage recommendation is near max, the UI should highlight additional caution e maybe suggest smaller size.\n\nFrom an implementation perspective, a pure deterministic function is ideal: input config plus quote context yields warnings, recommended bps, e blocked flag. This function can be unit tested across edge scenarios e reused in frontend e backend validation paths.\n\nFinally, policy reviews should be versioned. If teams change bounds or thresholds, they should compare old e new outputs across fixture sets before rollout. This prevents regressions where well-intended tweaks accidentally increase risk exposure.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Define min, default, e max slippage as explicit policy values.\n- Apply stale-quote logic before execution e adjust recommendations.\n- Clamp unsafe overrides con clear warning messages.\n- Surface blocked state only per clearly defined severe conditions.\n- Keep policy deterministic e version-reviewable.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mempoolux-v2-l2-terminal",
                "title": "Guardrail Decision Table",
                "steps": [
                  {
                    "cmd": "Quote age 13s, stale threshold 12s",
                    "output": "warning=refresh-before-signing, recommendedBps lowered",
                    "note": "Staleness triggers caution."
                  },
                  {
                    "cmd": "Quote age 22s and impact very high",
                    "output": "blocked=true, warning=trade blocked by safety policy",
                    "note": "Severe risk path."
                  }
                ]
              }
            ]
          },
          "mempoolux-v2-freshness-explorer": {
            "title": "Explorer: quote freshness timer e decision table",
            "content": "# Explorer: quote freshness timer e decision table\n\nA quote freshness explorer should make policy behavior obvious under time pressure. Users e engineers need to see when a quote transitions from safe to warning to blocked. This lezione defines a decision table approach that pairs timer state con slippage e impact context.\n\nThe timer should not be a decorative countdown. It is a state driver con explicit thresholds. Per example, 0-10 seconds may be low concern, 10-20 seconds warning, e above 20 seconds blocked per certain route classes. Thresholds can vary by asset class e liquidity quality, but the explorer must display the active policy version so users understand why behavior changed.\n\nDecision tables combine timer bands con additional signals: projected impact, hop count, e liquidity score. A single stale timer does not always imply severe risk; it depends on route fragility. Deterministic scoring helps aggregate these dimensions into one grade while preserving reason strings.\n\nAn effective explorer view presents both grade e recommendation fields. Grade communicates severity. Recommendation communicates next action: refresh quote, tighten slippage, reduce size, or proceed. Without recommendation, users see red flags but lack direction.\n\nEngineers should include edge fixtures where metrics conflict. Example: fresh quote but very high impact e low liquidity; or stale quote con low impact e high liquidity. These fixtures prevent simplistic heuristics from dominating policy e help teams calibrate thresholds intentionally.\n\nThe explorer also supports user education around anti-sandwich posture without teaching offensive behavior. You can explain that wider slippage e stale quotes increase adverse execution risk, e that refreshing quote plus tighter controls reduces exposure. Keep messaging defensive e pratico.\n\nPer reliability teams, deterministic explorer outputs become regression baselines. If a code change alters grade per a fixture unexpectedly, CI catches it before production. This is particularly important when tuning thresholds during volatile periods.\n\nOutput formatting should remain stable. Use canonical JSON order per exported config, e stable markdown per support docs. Avoid timestamps in core payloads to preserve snapshot equality. If timestamps are required, store them outside deterministic artifact fields.\n\nFinally, link explorer states to UI banners. If grade is critical, banner severity should be error con explicit action. If grade is medium, warning banner con optional guidance may suffice. This mapping is implemented in later challenges.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Treat freshness timer as policy input, not visual decoration.\n- Combine timer state con impact, hops, e liquidity signals.\n- Emit grade plus actionable recommendation.\n- Test conflicting-signal fixtures per policy balance.\n- Keep exported artifacts deterministic e stable.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "mempoolux-v2-l3-explorer",
                "title": "Freshness Snapshot Samples",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Fresh quote, strong liquidity",
                      "address": "risk11111111111111111111111111111111111111",
                      "lamports": 10,
                      "owner": "SwapPolicy111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 72
                    },
                    {
                      "label": "Stale quote, weak liquidity",
                      "address": "risk22222222222222222222222222222222222222",
                      "lamports": 90,
                      "owner": "SwapPolicy111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "mempoolux-v2-project-journey": {
        "title": "Protected Swap UI Project Journey",
        "description": "Implement deterministic policy engines, safety messaging, e stable protection-config artifacts per release governance.",
        "lessons": {
          "mempoolux-v2-evaluate-swap-risk": {
            "title": "Challenge: implement evaluateSwapRisk()",
            "content": "Implement deterministic swap risk grading from quote, slippage, impact, hops, e liquidity inputs.",
            "duration": "40 min",
            "hints": [
              "Use additive policy scoring from quote freshness, slippage, impact, route, e liquidity.",
              "Return both risk grade e concrete reasons per UX copy generation."
            ]
          },
          "mempoolux-v2-slippage-guard": {
            "title": "Challenge: implement slippageGuard()",
            "content": "Build bounded slippage recommendations con warnings e hard-block states.",
            "duration": "40 min",
            "hints": [
              "Clamp recommended BPS to policy bounds.",
              "Stale quotes should lower tolerance e may block if very stale."
            ]
          },
          "mempoolux-v2-impact-vs-slippage": {
            "title": "Challenge: model impatto sul prezzo vs slippage",
            "content": "Encode a deterministic interpretation of impact-to-tolerance ratio per user education.",
            "duration": "35 min",
            "hints": [
              "Teach difference: impact is market footprint, slippage is user tolerance.",
              "Return both ratio e interpretation per UI hints."
            ]
          },
          "mempoolux-v2-swap-safety-banner": {
            "title": "Challenge: build swapSafetyBanner()",
            "content": "Map deterministic risk grades to defensive banner copy e severity.",
            "duration": "35 min",
            "hints": [
              "Map risk grades to deterministic banner copy.",
              "Avoid exploit framing; keep copy defensive e user-focused."
            ]
          },
          "mempoolux-v2-protection-config-export": {
            "title": "Checkpoint: swap protection config export",
            "content": "Export a stable deterministic policy config artifact per the Protected Swap UI checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be deterministic JSON per copy/export behavior.",
              "Do not include timestamps or random IDs."
            ]
          }
        }
      }
    }
  },
  "indexing-webhooks-pipelines": {
    "title": "Indexers, Webhooks & Reorg-Safe Pipelines",
    "description": "Build production-grade deterministic indexing pipelines per duplicate-safe ingestion, reorg handling, e integrity-first reporting.",
    "duration": "9 hours",
    "tags": [
      "indexing",
      "webhooks",
      "reorgs",
      "reliability"
    ],
    "modules": {
      "indexpipe-v2-foundations": {
        "title": "Indexer Reliability Foundations",
        "description": "Event identity modeling, confirmation semantics, e deterministic ingest-to-apply pipeline behavior.",
        "lessons": {
          "indexpipe-v2-indexing-basics": {
            "title": "Indexing 101: logs, account, e transazione parsing",
            "content": "# Indexing 101: logs, account, e transazione parsing\n\nReliable indexers are not just fast parsers. They are consistency systems that decide what to trust, when to trust it, e how to recover from changing chain history. On Solana, event ingestion often starts from logs or parsed istruzioni, but production pipelines need deterministic keying, replay controls, e state application rules that survive retries e reorgs.\n\nA basic pipeline has four stages: ingest, dedupe, confirmation gating, e state apply. Ingest captures raw events con enough metadata to reconstruct ordering context: slot, signature, istruzione index, event type, e affected account. Dedupe ensures duplicate deliveries do not produce duplicate state transitions. Confirmation gating delays state application until depth conditions are met. Apply mutates snapshots in deterministic order.\n\nMany teams fail in the first stage by capturing incomplete event identity fields. If you omit istruzione index or event kind, collisions appear e dedupe becomes unsafe. Composite keys should be explicit e stable. They should also be derived purely from event payload so keys remain reproducible in tests e backfills.\n\nParsing strategy matters too. Logs are convenient but can drift across program versions. Parsed istruzione data can be more structured but may require custom decoders. Defensive indexing stores normalized events in one canonical schema regardless of source. This isolates downstream logic from parser changes.\n\nIdempotency is essential. Your ingestion path may receive duplicates from retries, webhook redelivery, or backfill overlap. If dedupe is weak, balances drift e downstream analytics become untrustworthy. Deterministic dedupe con composite keys is the first line of defense.\n\nThe apply stage should avoid hidden nondeterminism. If events are applied in arrival order without stable sort keys, two replays can produce different snapshots. Always sort by deterministic key before apply. If you need tie-breakers, define them explicitly.\n\nSnapshot progettazione should prioritize auditability. Keep applied event keys, pending keys, e finalized keys visible. These sets make it easy to reason about what the snapshot currently reflects e why. They also simplify integrity checks later.\n\nFinally, keep deterministic outputs central to your developer workflow. Pipeline reports e snapshots should be exportable in stable formats per test snapshots e incident analysis. Reliability work depends on reproducible evidence.\n\n\nTo keep this durable, teams should document fixture ownership e rotate review responsibilities so event taxonomy stays aligned con protocol upgrades. Without this operational ownership, pipelines drift into untested assumptions, e recovery playbooks age out. Deterministic explorers stay valuable only when fixtures evolve con production reality e every stage still reports clear, machine-verifiable state transitions under replay e stress.\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Operator mindset\n\nIndexing is a correctness pipeline before it is an analytics pipeline. Fast ingestion con weak dedupe, confirmation, or replay guarantees produces confidently wrong outputs.\n\n## Checklist\n- Capture complete event identity fields at ingest time.\n- Normalize events from logs e parsed istruzioni into one schema.\n- Use deterministic composite keys per dedupe.\n- Sort events stably before state application.\n- Track applied, pending, e finalized sets in snapshots.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexpipe-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexpipe-v2-l1-q1",
                    "prompt": "Why is istruzione index important in event keys?",
                    "options": [
                      "It helps prevent collisions when one transazione emits similar events",
                      "It reduces RPC cost directly",
                      "It replaces confirmation checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Istruzione index distinguishes same-signature events that would otherwise collide in dedupe."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            "title": "Reorgs e fork choice: why confirmed is not finalized",
            "content": "# Reorgs e fork choice: why confirmed is not finalized\n\nConfirmation labels are useful but often misunderstood in indexing pipelines. A confirmed event has stronger confidence than processed, but it is not equivalent to final settlement. Pipelines that apply confirmed events directly to user-visible balances without rollback strategy can show transient truth as permanent truth. Defensive progettazione acknowledges this e encodes reversible state transitions.\n\nReorg-aware indexing starts con depth thresholds. Per each event, compute depth as head slot minus event slot. If depth is below confirmed threshold, event remains pending. If depth passes confirmed threshold, event can be applied to provisional state. If depth passes finalized threshold, event is considered settled. These rules should be policy inputs, not hidden constants.\n\nWhy maintain provisional state at all? Because users e systems often need timely feedback before finalization. The solution is not to ignore confirmed events but to annotate confidence clearly. Dashboards can show provisional balances con settlement badges. Automated systems can choose whether to act on provisional or finalized data.\n\nFork choice changes can invalidate previously observed confirmed events. If your pipeline tracks applied keys e supports replay, you can recompute snapshot deterministically from deduped events e updated confirmation context. Pipelines that mutate opaque state without replay ability struggle during reorg recovery.\n\nDeterministic apply logic helps here. If the same deduped event set e same confirmation policy produce the same snapshot every run, recovery is straightforward. If apply order depends on arrival timing, recovery becomes guesswork.\n\nAnother reliability pattern is explicit pending queues. Instead of dropping low-depth events, keep them keyed e observable. This improves debugging: you can explain to users that an event exists but has not crossed confirmation threshold. It also avoids ingestion gaps when head advances.\n\nIntegrity checks should enforce structural assumptions: finalized keys must be a subset of applied keys, balances must be finite e non-negative under your business rules, e snapshot counts should align con event sets. Failing these checks should mark snapshot as invalid e block downstream export.\n\nCommunication matters as much as mechanics. Product teams should avoid copy that implies final settlement when data is only confirmed. Small text differences reduce major support incidents during volatile periods.\n\nThe overarching principle is to make uncertainty explicit e reversible. Reorg-safe pipelines are less about predicting forks e more about handling them cleanly when they happen.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Define confirmed e finalized depth thresholds explicitly.\n- Separate pending, applied, e finalized event sets.\n- Keep replayable deterministic apply logic.\n- Run integrity checks on every snapshot export.\n- Surface settlement confidence clearly in UI e APIs.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "indexpipe-v2-l2-terminal",
                "title": "Depth-Based Confirmation",
                "steps": [
                  {
                    "cmd": "headSlot=120, eventSlot=119, confirmedDepth=3",
                    "output": "depth=1 -> pending",
                    "note": "Not yet applied."
                  },
                  {
                    "cmd": "headSlot=120, eventSlot=115, confirmedDepth=3",
                    "output": "depth=5 -> applied",
                    "note": "Candidate per provisional state."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-pipeline-explorer": {
            "title": "Explorer: ingest to dedupe to confirm to apply",
            "content": "# Explorer: ingest to dedupe to confirm to apply\n\nA pipeline explorer should explain transformation stages clearly so engineers can inspect where correctness can break. Per indexing reliability, the core stages are ingest, dedupe, confirmation gating, e apply. Each stage must expose deterministic inputs e outputs.\n\nIngest stage receives raw events from simulated webhooks, log streams, or backfills. At this point, duplicates e out-of-order delivery are expected. The explorer should show raw count e normalized schema count so users can verify parser coverage.\n\nDedupe stage converts event arrays into a set based on composite keys. Good explorers display before/after counts e list dropped duplicates. This transparency helps debug webhook retries e backfill overlap behavior.\n\nConfirmation stage partitions deduped events into pending, applied, e finalized sets based on depth policy. The explorer should make head slot e policy thresholds visible. Hidden thresholds are a frequent source of confusion when teams compare environments.\n\nApply stage computes account balances or state snapshots deterministically from applied events only. Explorer outputs should include sorted balances e event key lists. Sorted output is crucial per snapshot equality test.\n\nIntegrity stage validates structural assumptions: no negative balances, no non-finite numbers, finalized subset relation, e stable event references. The explorer should display PASS/FAIL e issue list. This teaches engineers to treat integrity checks as mandatory gates, not optional diagnostics.\n\nPer backfills, explorer scenarios should include missing-slot windows e idempotency keys. This demonstrates how replay-safe job planning interacts con the same dedupe e apply rules. A reliable backfill system does not bypass core pipeline logic.\n\nDeterministic report generation closes the loop. Export markdown per human review e JSON per machine consumption. Both should be reproducible from the same snapshot object. Avoid embedding volatile metadata in core payload fields.\n\nA well-designed explorer becomes a teaching tool e an operational tool. During incidents, teams can replay problematic event sets e compare outputs across policy versions. During onboarding, new engineers impara stage responsibilities quickly without production access.\n\nOperational ownership keeps this useful over time. Teams should rotate fixture maintenance responsibilities e document why each scenario exists so updates remain intentional. As protocols evolve, parser assumptions e event fields can drift. A maintained explorer corpus catches drift early, forces policy review before releases, e preserves confidence that ingest, dedupe, confirmation gating, e apply stages still produce reproducible results under stress.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Show per-stage counts e transformations.\n- Make confirmation policy parameters explicit.\n- Render sorted deterministic snapshots.\n- Gate exports on integrity checks.\n- Keep report payloads stable per regression tests.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexpipe-v2-l3-explorer",
                "title": "Pipeline Stage Snapshots",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Deduped event set",
                      "address": "pipe11111111111111111111111111111111111111",
                      "lamports": 2,
                      "owner": "IndexerPipeline11111111111111111111111111111",
                      "executable": false,
                      "dataLen": 128
                    },
                    {
                      "label": "Finalized snapshot",
                      "address": "pipe22222222222222222222222222222222222222",
                      "lamports": 4,
                      "owner": "IndexerPipeline11111111111111111111111111111",
                      "executable": false,
                      "dataLen": 196
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "indexpipe-v2-project-journey": {
        "title": "Reorg-Safe Indexer Project Journey",
        "description": "Build dedupe, confirmation-aware apply logic, integrity gates, e stable reporting artifacts per operational triage.",
        "lessons": {
          "indexpipe-v2-dedupe-events": {
            "title": "Challenge: implement dedupeEvents()",
            "content": "Implement stable event deduplication con deterministic composite keys.",
            "duration": "40 min",
            "hints": [
              "Build stable composite keys per dedupe.",
              "Sort by key so output is deterministic across runs."
            ]
          },
          "indexpipe-v2-apply-confirmations": {
            "title": "Challenge: implement applyWithConfirmations()",
            "content": "Apply events deterministically con confirmation depth policy e pending/finalized sets.",
            "duration": "40 min",
            "hints": [
              "Apply only confirmed-depth events to state.",
              "Track pending e finalized sets separately per reorg safety."
            ]
          },
          "indexpipe-v2-backfill-idempotency": {
            "title": "Challenge: backfill e idempotency planning",
            "content": "Create deterministic backfill planning output con replay-safe idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Backfills should be resumable e idempotent.",
              "Emit a deterministic key per replay-safe job scheduling."
            ]
          },
          "indexpipe-v2-snapshot-integrity": {
            "title": "Challenge: snapshot integrity checks",
            "content": "Implement deterministic snapshotIntegrityCheck() outputs per negative e structural failures.",
            "duration": "35 min",
            "hints": [
              "Integrity checks must fail on negative balances.",
              "Finalized keys must always be a subset of applied keys."
            ]
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline report export",
            "content": "Generate a stable markdown report artifact per the Reorg-Safe Indexer checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be markdown e deterministic.",
              "Include applied/pending/finalized counts e integrity result."
            ]
          }
        }
      }
    }
  },
  "rpc-reliability-latency": {
    "title": "RPC Reliability & Latency Engineering",
    "description": "Engineer production multi-provider Solana RPC clients con deterministic retry, routing, caching, e observability policies.",
    "duration": "9 hours",
    "tags": [
      "rpc",
      "latency",
      "reliability",
      "observability"
    ],
    "modules": {
      "rpc-v2-foundations": {
        "title": "RPC Reliability Foundations",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, e deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
            "content": "# RPC failures in real life: timeouts, 429s, stale nodes\n\nReliable client infrastructure begins con realistic failure assumptions. RPC calls fail per many reasons: transient network timeouts, provider rate limits, stale nodes trailing cluster head, e occasional inconsistent responses under load. A defensive client does not treat these as edge cases; it treats them as normal operating conditions.\n\nTimeouts are the most common class. If timeout values are too short, healthy providers appear unreliable. If too long, user-facing latency becomes unacceptable e retries trigger too late. Good policy defines request timeout by operation type e sets bounded retry schedules.\n\nHTTP 429 rate limiting is another predictable behavior, not a surprise. Providers enforce quotas e burst controls. A resilient client observes 429 ratio per endpoint e adapts by reducing pressure on overloaded nodes while shifting traffic to healthier ones. Blind retry against the same endpoint amplifies throttling.\n\nStale node lag is particularly dangerous per state-sensitive applications. A node can respond quickly but serve outdated slot state, causing confusing balances or stale quote decisions. Endpoint health scoring should include slot lag, not only latency e success rate.\n\nMulti-provider strategy is the baseline per serious applications. Even when one provider is excellent, outages e regional issues happen. A client should maintain endpoint metadata, collect health samples, e choose endpoints by deterministic policy rather than random rotation.\n\nObservability is what makes reliability engineering actionable. Track total requests, success/error counts, latency quantiles, e histogram buckets. Without this telemetry, teams tune retry policies by anecdote. Con telemetry, teams can identify whether changes improve p95 latency or simply shift failures around.\n\nDeterministic policy modeling is valuable before production integration. You can simulate endpoint samples e verify that selection behavior is stable e explainable. If the chosen endpoint changes unexpectedly per identical input samples, your scoring function needs refinement.\n\nCaching adds complexity. Cache misses e stale reads are not just prestazioni details; they affect correctness. Invalidation policy should react to account changes e node lag. Aggressive invalidation may increase load; weak invalidation may serve stale state. Explicit policy e metrics help navigate this tradeoff.\n\nThe core message is pragmatic: assume RPC instability, progettazione per graceful degradation, e measure everything con deterministic reducers that can be unit tested.\n\n\nOperational readiness also requires owning fixture updates as providers change rate-limit behavior e latency profiles. If fixture sets stay static, policy tuning optimizes per old incidents e misses new failure signatures. Keep a cadence per reviewing percentile distributions, endpoint score drift, e retry outcomes so deterministic policies remain grounded in current provider behavior while preserving reproducibility.\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Operator mindset\n\nRPC policy is risk routing, not just request routing. Endpoint choice, retry cadence, e cache invalidation directly determine whether users see timely truth or stale confusion.\n\n## Checklist\n- Treat timeouts, 429s, e stale lag as default conditions.\n- Use multi-provider endpoint selection con health scoring.\n- Include slot lag in endpoint quality calculations.\n- Define retry schedules con bounded backoff.\n- Instrument latency e success metrics continuously.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpc-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpc-v2-l1-q1",
                    "prompt": "Why is slot lag important in endpoint scoring?",
                    "options": [
                      "Fast responses can still be wrong if the node is stale",
                      "Slot lag only affects validatore rewards",
                      "Slot lag is equivalent to timeout"
                    ],
                    "answerIndex": 0,
                    "explanation": "Latency alone cannot guarantee freshness of chain state."
                  }
                ]
              }
            ]
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests e fallbacks",
            "content": "# Multi-endpoint strategies: hedged requests e fallbacks\n\nMulti-endpoint progettazione is more than adding a backup URL. It is a scheduling problem where each request should be sent to the most suitable endpoint given recent health signals e operation urgency. This lezione focuses on deterministic strategy patterns you can validate offline.\n\nFallback strategy is the simplest pattern: try one endpoint, then another on failure. It reduces outage risk but may still produce high tail latency if initial endpoints are degraded. Hedged strategy improves tail latency by issuing a second request after a short delay if the first has not returned. Hedging increases load, so it must be controlled by policy e only used per high-value paths.\n\nEndpoint selection should rely on a composite score that includes success rate, p95 latency, rate-limit ratio, slot lag, e optional static weight per trusted providers. Scores should be computed deterministically from sampled inputs so decisions are reproducible. Tie-breaking should also be deterministic to avoid flapping.\n\nRate-limit-aware routing is critical. If one provider shows increasing 429 ratio, a resilient client should back off traffic there e prefer alternatives. This avoids retry storms e helps maintain aggregate throughput.\n\nRegional diversity adds resilience. If all endpoints are in one region, regional network incidents can affect all providers simultaneously. Tagging endpoints by region allows policy constraints such as preferring local region first but failing over cross-region when health degrades.\n\nCircuit-breaking patterns can protect users during severe incidents. If an endpoint crosses error thresholds, mark it temporarily degraded e avoid selecting it per a cooling period. Deterministic simulations can model this behavior without real network calls.\n\nObservability ties it together. Endpoint decisions should emit reasoning strings or structured fields so operators can inspect why a node was chosen. This is especially useful when users report intermittent failures.\n\nIn many systems, endpoint policy e retry policy are separate moduli. Keep interfaces clean: selection chooses target endpoint, retry schedule defines attempts e delays, metrics reducer evaluates outcomes. This separation improves testability e change safety.\n\nFinally, avoid hidden randomness in core selection logic. Randomized tie-breakers may seem harmless but they complicate reproducibility e debugging. Deterministic order supports reliable incident analysis.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Score endpoints using multiple reliability signals.\n- Use deterministic tie-breaking to avoid flapping.\n- Apply rate-limit-aware traffic shifting.\n- Keep fallback e retry policy responsibilities separate.\n- Emit endpoint reasoning per operational debugging.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "rpc-v2-l2-terminal",
                "title": "Endpoint Selection Simulation",
                "steps": [
                  {
                    "cmd": "Endpoint A: success=0.96 p95=140ms lag=1",
                    "output": "score=92.60",
                    "note": "Healthy candidate."
                  },
                  {
                    "cmd": "Endpoint B: success=0.90 p95=90ms lag=3 429=0.1",
                    "output": "score lower due to throttling e lag",
                    "note": "Fast but less reliable under pressure."
                  }
                ]
              }
            ]
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
            "content": "# Explorer: retry/backoff simulator\n\nRetry e backoff policies determine whether clients recover gracefully or amplify outages. A simulator should make schedule behavior explicit so teams can reason about user latency e provider pressure. This lezione builds a deterministic view of retry policy outputs e their tradeoffs.\n\nA retry schedule has three core dimensions: number of attempts, per-attempt timeout, e delay before each retry. Exponential backoff grows delay rapidly e reduces pressure in prolonged incidents. Linear backoff grows slower e can be useful per short-lived blips. Both need max-delay caps to avoid runaway wait times.\n\nThe first attempt should always be represented in the schedule con zero delay. This improves traceability e ensures telemetry can map attempt index to behavior consistently. Many teams model only retries e lose visibility into full request lifecycle.\n\nPolicy inputs should be validated. Negative retries or non-positive timeouts are configuration errors e should fail fast. Deterministic validation in a pure function prevents silent misconfiguration in production.\n\nThe simulator should also show expected user-facing latency envelope. Per example, timeout 900ms con two retries e exponential delays of 100ms e 200ms implies worst-case response around 2.9 seconds before failover completion. This helps product teams set realistic loading copy.\n\nRetry policy must integrate con endpoint selection. Retrying against the same degraded endpoint repeatedly is usually inferior to endpoint-aware retries. Even if your simulator keeps moduli separate, it should explain this interaction.\n\nJitter is often used in distributed systems to prevent synchronization spikes. In this deterministic corso we omit jitter from challenge outputs per snapshot stability, but teams should understand where jitter fits in production.\n\nMetrics reducers provide feedback loop per tuning. If p95 improves but error count rises, policy may be too aggressive. If errors drop but latency explodes, policy may be too conservative. Deterministic histogram e quantile outputs make this tradeoff visible.\n\nA final best practice is policy versioning. When retry settings change, compare outputs per fixture scenarios before distribuzione. This catches accidental behavior changes e enables confident rollbacks.\n\nOperational readiness also requires a habit of refreshing fixture sets as provider behavior evolves. Rate-limit patterns, slot lag profiles, e latency distributions change over time, e static fixtures can hide policy regressions. Reliability teams should schedule periodic fixture audits, compare score deltas across providers, e document threshold changes so retry e selection policies remain explainable e reproducible under current network conditions.\n\n\nThis material should be operationalized con deterministic fixtures e explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, e severe stress. Per each scenario, compare policy outputs before e after changes, e require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, e makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, e they keep fixture ownership explicit so updates remain intentional e auditable.\n\n## Checklist\n- Represent full schedule including initial attempt.\n- Validate retry configuration inputs strictly.\n- Bound delays con max caps.\n- Estimate user-facing worst-case latency from schedule.\n- Review policy changes against deterministic fixtures.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "rpc-v2-l3-explorer",
                "title": "Retry Policy Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Exponential schedule",
                      "address": "rpc11111111111111111111111111111111111111",
                      "lamports": 3,
                      "owner": "RpcPolicy1111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 80
                    },
                    {
                      "label": "Linear schedule",
                      "address": "rpc22222222222222222222222222222222222222",
                      "lamports": 4,
                      "owner": "RpcPolicy1111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 80
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "rpc-v2-project-journey": {
        "title": "RPC Multi-Provider Client Project Journey",
        "description": "Build deterministic policy engines per routing, retries, metrics reduction, e health report exports.",
        "lessons": {
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
            "content": "Build deterministic timeout e retry schedule outputs from policy input.",
            "duration": "40 min",
            "hints": [
              "Build a deterministic retry schedule including the first attempt.",
              "Cap delays at maxDelayMs."
            ]
          },
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
            "content": "Choose the best endpoint deterministically from health samples e endpoint metadata.",
            "duration": "40 min",
            "hints": [
              "Blend success rate, latency, 429 pressure, e slot lag into one score.",
              "Tie-break deterministically by endpoint ID."
            ]
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching e invalidation policy",
            "content": "Emit deterministic cache invalidation actions when account updates e lag signals arrive.",
            "duration": "35 min",
            "hints": [
              "Invalidate account-keyed cache entries deterministically.",
              "Use tighter TTL when node lag grows."
            ]
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer e histogram buckets",
            "content": "Reduce simulated RPC events into deterministic histogram e p50/p95 metrics.",
            "duration": "35 min",
            "hints": [
              "Reduce RPC telemetry into histogram buckets e quantiles.",
              "Keep bucket boundaries explicit per deterministic snapshots."
            ]
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
            "content": "Export deterministic JSON e markdown health report artifacts per multi-provider reliability review.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export both JSON e markdown.",
              "Ensure field order is stable in JSON output."
            ]
          }
        }
      }
    }
  },
  "rust-data-layout-borsh": {
    "title": "Rust Data Layout & Borsh Mastery",
    "description": "Rust-first Solana data layout engineering con deterministic byte-level tooling e compatibility-safe schema practices.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "borsh",
      "data-layout",
      "solana"
    ],
    "modules": {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, e pratico parsing safety per stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, e why Solana account care",
            "content": "# Memory layout: alignment, padding, e why Solana account care\n\nRust layout behavior is deterministic inside one compiled binary but can vary when assumptions are implicit. Per Solana account, this matters because raw bytes are persisted on-chain e parsed by multiple clients across versions. If you progettazione account structures without explicit layout strategy, subtle padding e alignment changes can break compatibility or produce incorrect parsing in downstream tools.\n\nRust default layout optimizes per compiler freedom. Field order in memory per plain structs is not a stable ABI contract unless you opt into representations such as repr(C). In low-level account work, repr(C) gives more predictable ordering e alignment behavior, but it does not remove all complexity. Padding still appears between fields when alignment requires it. Per example, a u8 followed by u64 introduces 7 bytes of padding before the u64 offset. If your parser ignores this, every field after that point is shifted e corrupted.\n\nOn Solana, account rent is proportional to byte size, so padding is not only a correctness issue; it is a cost issue. Poor field ordering can inflate account sizes across millions of account. A common optimization is grouping larger aligned fields first, then smaller fields. But this must be balanced against readability e migration safety. If you reorder fields in a live protocol, old data may no longer parse under new assumptions. Migration tooling should be explicit e versioned.\n\nBorsh serialization avoids some ABI ambiguity by defining field order in schema rather than raw struct memory. However, zero-copy patterns e manual slicing still depend on precise offsets. Teams should understand both worlds: in-memory layout rules per zero-copy e schema-based encoding rules per Borsh.\n\nIn production engineering, layout decisions should be documented con deterministic outputs: field offsets, per-field padding, struct alignment, e total size. These outputs can be compared in CI to catch accidental drift from refactors. The goal is not theoretical elegance; the goal is stable data contracts over time.\n\n## Operator mindset\n\nSchema bytes are production API surface. Treat offset changes, enum ordering, e parser semantics as compatibility events requiring explicit review.\n\nProduction teams should treat layout e serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, e require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, e parser error behavior per malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on account size, rent budget, e compatibility. Deterministic helpers make this pratico: you can produce a stable JSON report in CI e diff it like source code. In Solana e Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after distribuzione.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough per incident response. Good error payloads include field name, offset, e failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important per indexers e analytics pipelines that need to decide whether to quarantine an event or retry con a newer schema version. Teams that encode rich deterministic error reports reduce triage time e avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, e test every boundary condition before shipping.\n\nTeams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, e compatibility con archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, e which fixtures are mandatory before release. This level of process may feel heavy per small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the pratico mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, e difficult to misinterpret.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rdb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rdb-v2-l1-q1",
                    "prompt": "Why does a u8 before u64 often increase account size?",
                    "options": [
                      "Alignment inserts padding bytes",
                      "Borsh compresses zeros",
                      "RPC forces 8-byte packets"
                    ],
                    "answerIndex": 0,
                    "explanation": "u64 alignment usually forces padding after smaller fields."
                  }
                ]
              }
            ]
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct e enum layout pitfalls plus Borsh rules",
            "content": "# Struct e enum layout pitfalls plus Borsh rules\n\nBorsh is widely used because it gives deterministic serialization across languages, but teams still get tripped up by how enums, vectors, e strings map to bytes. Understanding these rules is essential per robust account parsing e client interoperability.\n\nPer structs, Borsh encodes fields in declaration order. There is no implicit alignment padding in the serialized stream. That is different from in-memory layout e one reason Borsh is popular per stable wire formats. Per enums, Borsh writes a one-byte variant index first, then the variant payload. Changing variant order in code changes the index mapping e is therefore a breaking format change. This is a common source of accidental incompatibility.\n\nVectors e strings are length-prefixed con little-endian u32 before data bytes. If parsing code trusts the length blindly without bounds checks, malformed or truncated data can cause out-of-bounds reads or allocation abuse. Safe parsers validate available bytes before allocating or slicing.\n\nAnother pitfall is conflating pubkey strings con pubkey bytes. Borsh encodes bytes, not base58 text. If a client serializes public keys as strings while another expects 32-byte arrays, decoding fails despite both sides using \"Borsh\" terminology. Teams should define schema types precisely.\n\nError progettazione is part of serialization safety. Distinguish malformed length prefix, unknown enum variant, unsupported dynamic type, e primitive decode out-of-bounds. Structured errors let callers decide whether to retry, drop, or quarantine payloads.\n\nFinally, encoding e decoding tests should run symmetrically con fixed fixtures. A deterministic fixture suite catches regressions early e gives confidence that Rust, TypeScript, e analytics parsers agree on the same bytes.\nProduction teams should treat layout e serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, e require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, e parser error behavior per malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on account size, rent budget, e compatibility. Deterministic helpers make this pratico: you can produce a stable JSON report in CI e diff it like source code. In Solana e Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after distribuzione.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough per incident response. Good error payloads include field name, offset, e failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important per indexers e analytics pipelines that need to decide whether to quarantine an event or retry con a newer schema version. Teams that encode rich deterministic error reports reduce triage time e avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, e test every boundary condition before shipping.\n\nTeams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, e compatibility con archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, e which fixtures are mandatory before release. This level of process may feel heavy per small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the pratico mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, e difficult to misinterpret.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "rdb-v2-l2-terminal",
                "title": "Borsh Encoding Notes",
                "steps": [
                  {
                    "cmd": "encode name='sol' level=7",
                    "output": "[3,0,0,0,115,111,108,7]",
                    "note": "u32 length + UTF-8 bytes + u8 field"
                  }
                ]
              }
            ]
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer per field offsets",
            "content": "# Explorer: layout visualizer per field offsets\n\nA layout visualizer turns abstract alignment rules into concrete numbers engineers can review. Instead of debating whether a struct is \"probably fine,\" teams can inspect exact offsets, padding, e total size.\n\nThe visualizer workflow is straightforward: provide ordered fields e types, compute alignments, insert required padding, e emit final layout metadata. This output should be deterministic e serializable so CI can compare snapshots.\n\nWhen using this in Solana development, combine visualizer output con account rent planning e migration docs. If a proposed field addition increases total size, quantify the impact e decide whether to append, split account state, or introduce versioned account. Do not rely on intuition per byte-level decisions.\n\nVisualizers are also useful per onboarding. New contributors can quickly see why u8/u64 ordering changes offsets e why safe parsers need explicit bounds checks. This reduces recurring parsing bugs e review churn.\n\nA high-quality visualizer report includes field name, offset, size, alignment, padding-before, trailing padding, e struct alignment. Keep key ordering stable so report diffs remain readable.\n\nEngineers should pair visualizer output con parse tests. If layout says a bool lives at offset 0 e u8 at offset 1, parser tests should assert exactly that. Deterministic systems connect progettazione artifacts e runtime checks.\nProduction teams should treat layout e serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, e require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, e parser error behavior per malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on account size, rent budget, e compatibility. Deterministic helpers make this pratico: you can produce a stable JSON report in CI e diff it like source code. In Solana e Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after distribuzione.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough per incident response. Good error payloads include field name, offset, e failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important per indexers e analytics pipelines that need to decide whether to quarantine an event or retry con a newer schema version. Teams that encode rich deterministic error reports reduce triage time e avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, e test every boundary condition before shipping.\n\nTeams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, e compatibility con archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, e which fixtures are mandatory before release. This level of process may feel heavy per small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the pratico mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, e difficult to misinterpret.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "rdb-v2-l3-explorer",
                "title": "Layout Explorer Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Small struct",
                      "address": "layout111111111111111111111111111111111111",
                      "lamports": 16,
                      "owner": "BorshLayout1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 16
                    },
                    {
                      "label": "Expanded struct",
                      "address": "layout222222222222222222222222222222222222",
                      "lamports": 40,
                      "owner": "BorshLayout1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 40
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "rdb-v2-project-journey": {
        "title": "Account Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, e compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
            "content": "Compute deterministic field offsets, alignment padding, e total struct size.",
            "duration": "40 min",
            "hints": [
              "Use alignment-aware offsets e include padding fields in the result.",
              "Struct total size should be aligned to max field alignment."
            ]
          },
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
            "content": "Implement deterministic Borsh encode/decode con structured error handling.",
            "duration": "40 min",
            "hints": [
              "Borsh strings are length-prefixed little-endian u32 + UTF-8 bytes.",
              "Keep encode/decode symmetric per deterministic tests."
            ]
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
            "content": "Model deterministic tradeoff scoring between zero-copy e Borsh approaches.",
            "duration": "35 min",
            "hints": [
              "Model tradeoffs deterministically: read speed vs schema flexibility.",
              "Recommendation should be pure function of inputs."
            ]
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
            "content": "Parse account bytes con deterministic bounds checks e structured errors.",
            "duration": "35 min",
            "hints": [
              "Validate byte length before field parsing.",
              "Return structured errors per invalid booleans e unsupported field types."
            ]
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
            "content": "Produce stable JSON e markdown layout artifacts per the final project.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export stable JSON + markdown.",
              "Avoid random IDs e timestamps in output."
            ]
          }
        }
      }
    }
  },
  "rust-errors-invariants": {
    "title": "Rust Error Progettazione & Invariants",
    "description": "Build typed invariant guard libraries con deterministic evidence artifacts, compatibility-safe error contracts, e audit-ready reporting.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "errors",
      "invariants",
      "reliability"
    ],
    "modules": {
      "rei-v2-foundations": {
        "title": "Rust Error e Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, e deterministic invariant progettazione fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
            "content": "# Error taxonomy: recoverable vs fatal\n\nRust encourages explicit error modeling, but teams still produce weak error contracts when they rely on ad hoc strings or inconsistent wrappers. In Solana e Anchor-adjacent systems, this becomes painful quickly because on-chain failures, off-chain pipelines, e frontend UX all need coherent semantics.\n\nA pratico taxonomy starts con recoverable versus fatal classes. Recoverable errors represent expected contract violations: stale data, missing signer, value out of range, or transient dependency mismatch. Fatal errors represent corrupted assumptions: impossible state, incompatible schema version, or invariant breach that requires operator intervention.\n\nTyped enums are the center of this progettazione. A code such as NEGATIVE_VALUE or MISSING_AUTHORITY is unambiguous e searchable. Attaching structured context fields gives downstream systems enough detail per logging e user-facing copy without string parsing.\n\nAvoid stringly error contracts where every caller invents custom messages. Those systems accumulate inconsistent wording e ambiguous categories. Instead, keep messages deterministic e derive user copy from code + context in one mapping layer.\n\nInvariants should be designed per testability. If an invariant cannot be expressed as a deterministic function over known inputs, it is hard to validate e easy to regress. Start con small ensure helpers that return typed results, then compose them into higher-level guards.\n\nIn production, error taxonomies should be reviewed like API changes. Renaming codes or changing severity mapping can break alert rules e client handling. Version these changes e validate con fixture suites.\n\n## Operator mindset\n\nInvariant errors are operational contracts. If code, severity, e context are not stable, monitoring e user recovery flows degrade even when logic is correct.\n\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, e explicit severity mapping so runtime incidents are diagnosable without guessing. Per invariants, each failed check should identify what contract was violated, where in the flow it happened, e whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent e alert tuning becomes fragile. A typed error library con deterministic reports solves this by making failure semantics machine-readable e human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain con injected timestamps e step IDs gives auditors e engineers a replayable explanation of what passed, what failed, e in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old e new evidence outputs e verify expected changes before distribuzione. Over time, these deterministic artifacts become part of release discipline e reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries e confirm that alerts, dashboards, e user-facing copy still map correctly. If mappings drift, update guides e fallback behavior should ship together con code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users e support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, e a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors e reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it con quarterly reviews where engineers evaluate false-positive rates, update context fields, e verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, e communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rei-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rei-v2-l1-q1",
                    "prompt": "Why are typed error codes preferred over free-form strings?",
                    "options": [
                      "They provide stable machine-readable semantics",
                      "They remove need per logs",
                      "They reduce compile time"
                    ],
                    "answerIndex": 0,
                    "explanation": "Typed codes make handling e monitoring deterministic."
                  }
                ]
              }
            ]
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, e context",
            "content": "# Result<T, E> patterns, ? operator, e context\n\nResult-based control flow is one of Rust's strongest tools per building robust services e on-chain-adjacent clients. The key is not merely using Result, but designing error types e propagation boundaries that preserve enough context per debugging e UX decisions.\n\nThe ? operator keeps code concise, but it can hide context unless error conversion layers are explicit. Invariant-centric systems should wrap lower-level failures con domain meaning before returning to upper layers. Per example, a parse failure in account metadata should map to a deterministic invariant code e include the field path.\n\nContext should be structured rather than baked into message text. A map of key/value fields like {label, value, limit} is easier to aggregate e filter than sentence fragments. It also supports localization e role-specific message rendering.\n\nAnother pattern is separating validation from side effects. If ensure helpers only evaluate conditions e construct typed errors, they are deterministic e unit-testable. Side effects such as logging or telemetry emission can happen at call boundaries.\n\nWhen building libraries, avoid exposing too many internal codes. Public codes should represent stable contracts, while internal details can remain nested context. This helps keep compatibility manageable.\n\nTest strategy should include positive cases, negative cases, e report formatting checks. Deterministic report output is valuable per code review because changes are visible as stable diffs, not only behavioral assertions.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, e explicit severity mapping so runtime incidents are diagnosable without guessing. Per invariants, each failed check should identify what contract was violated, where in the flow it happened, e whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent e alert tuning becomes fragile. A typed error library con deterministic reports solves this by making failure semantics machine-readable e human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain con injected timestamps e step IDs gives auditors e engineers a replayable explanation of what passed, what failed, e in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old e new evidence outputs e verify expected changes before distribuzione. Over time, these deterministic artifacts become part of release discipline e reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries e confirm that alerts, dashboards, e user-facing copy still map correctly. If mappings drift, update guides e fallback behavior should ship together con code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users e support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, e a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors e reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it con quarterly reviews where engineers evaluate false-positive rates, update context fields, e verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, e communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "rei-v2-l2-terminal",
                "title": "Ensure Pattern Examples",
                "steps": [
                  {
                    "cmd": "ensure(amount >= 0, NEGATIVE_VALUE, {amount})",
                    "output": "ok=false when amount<0",
                    "note": "Typed e deterministic"
                  }
                ]
              }
            ]
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
            "content": "# Explorer: invariant decision tree\n\nAn invariant decision tree helps teams reason about guard ordering e failure priority. Not every invariant should be checked in arbitrary order. Early checks should prevent expensive work e produce the clearest failure semantics.\n\nA common flow: structural preconditions first, authority checks second, value bounds third, relational checks fourth. This ordering minimizes noisy failures e improves auditability. If authority is missing, there is little value in evaluating downstream value checks.\n\nDecision trees also help map errors to UX behavior. A recoverable user input violation may show inline correction hints, while a fatal integrity breach should hard-stop con escalation messaging.\n\nIn deterministic systems, tree traversal should be explicit e testable. Given the same input, the same failing node should be reported every time. This allows stable evidence chains e reliable automation.\n\nExplorer tooling can visualize this by showing the path taken, checks skipped, e final outcome. Teams can then tune guard order intentionally e document rationale.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, e explicit severity mapping so runtime incidents are diagnosable without guessing. Per invariants, each failed check should identify what contract was violated, where in the flow it happened, e whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent e alert tuning becomes fragile. A typed error library con deterministic reports solves this by making failure semantics machine-readable e human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain con injected timestamps e step IDs gives auditors e engineers a replayable explanation of what passed, what failed, e in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old e new evidence outputs e verify expected changes before distribuzione. Over time, these deterministic artifacts become part of release discipline e reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries e confirm that alerts, dashboards, e user-facing copy still map correctly. If mappings drift, update guides e fallback behavior should ship together con code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users e support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, e a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors e reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it con quarterly reviews where engineers evaluate false-positive rates, update context fields, e verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, e communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "rei-v2-l3-explorer",
                "title": "Invariant Tree Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Pass path",
                      "address": "inv11111111111111111111111111111111111111",
                      "lamports": 1,
                      "owner": "InvariantGuard11111111111111111111111111111",
                      "executable": false,
                      "dataLen": 64
                    },
                    {
                      "label": "Fail path",
                      "address": "inv22222222222222222222222222222222222222",
                      "lamports": 2,
                      "owner": "InvariantGuard11111111111111111111111111111",
                      "executable": false,
                      "dataLen": 64
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "rei-v2-project-journey": {
        "title": "Invariant Guard Library Project Journey",
        "description": "Implement guard helpers, evidence-chain generation, e stable audit reporting per reliability e incident response.",
        "lessons": {
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
            "content": "Implement typed invariant errors e deterministic ensure helpers.",
            "duration": "40 min",
            "hints": [
              "Return typed error payloads, not raw strings.",
              "Keep ensure() deterministic e side-effect free."
            ]
          },
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
            "content": "Build a deterministic evidence chain con injected timestamps.",
            "duration": "40 min",
            "hints": [
              "Inject/mock timestamps per deterministic evidence chains.",
              "Step ordering must remain stable per snapshot tests."
            ]
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
            "content": "Run deterministic invariant case sets e return failed IDs.",
            "duration": "35 min",
            "hints": [
              "Property-ish deterministic tests can still run as fixed case sets.",
              "Return explicit failed IDs per debugability."
            ]
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
            "content": "Format a deterministic markdown evidence report.",
            "duration": "35 min",
            "hints": [
              "Markdown report should preserve stable step order e deterministic formatting.",
              "Include aggregate status e per-step evidence lines."
            ]
          },
          "rei-v2-invariant-audit-checkpoint": {
            "title": "Checkpoint: invariant audit report",
            "content": "Export deterministic invariant audit checkpoint artifacts.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should capture deterministic summary fields only.",
              "No wall-clock timestamps in exported artifact."
            ]
          }
        }
      }
    }
  },
  "rust-perf-onchain-thinking": {
    "title": "Rust Prestazioni per On-chain Thinking",
    "description": "Simulate e optimize compute-cost behavior con deterministic Rust-first tooling e budget-driven prestazioni governance.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "performance",
      "compute",
      "solana"
    ],
    "modules": {
      "rpot-v2-foundations": {
        "title": "Prestazioni Foundations",
        "description": "Rust prestazioni modello mentales, data-structure tradeoffs, e deterministic cost reasoning per reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Prestazioni modello mentale: allocations, clones, hashing",
            "content": "# Prestazioni modello mentale: allocations, clones, hashing\n\nRust prestazioni work in Solana ecosystems is mostly about data movement discipline. Teams often chase micro-optimizations while ignoring dominant costs such as repeated allocations, unnecessary cloning, e redundant hashing in loops.\n\nA useful modello mentale starts con cost buckets. Allocation cost includes heap growth, allocator metadata, e cache disruption. Clone cost depends on object size e ownership patterns. Hash cost depends on bytes hashed e hash invocation frequency. Loop cost depends on iteration count e per-iteration work. Map lookup cost depends on data structure choice e access pattern.\n\nThe point of this model is not exact runtime cycles. The point is relative pressure. If one path performs ten allocations e another performs one allocation, the former should trigger scrutiny even before microbenchmarking.\n\nOn-chain thinking reinforces this: compute budgets are finite, e predictable resource usage matters. Even off-chain indexers e simulators benefit from the same discipline because latency tails e CPU burn impact reliability.\n\nDeterministic models are ideal per CI. Given identical operation counts, output should be identical. Reviewers can reason about deltas directly e reject regressions early.\n\n## Operator mindset\n\nPrestazioni guidance should be versioned e budgeted. Without explicit budgets e stable cost categories, optimization work drifts toward anecdote instead of measurable outcomes.\n\nPrestazioni engineering per on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines e CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline per regression detection. The model does not replace real profiling; it complements it by making early progettazione tradeoffs explicit e reviewable.\n\nWhen you model costs, keep weights documented e intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient e track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports con before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers e client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined con suggestion outputs e checkpoint reports, these models become pratico guardrails per engineering quality.\n\nMature teams combine these deterministic models con periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients e rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation e keeps recommendations aligned con actual system behavior. The key is to treat model updates as versioned changes con explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why prestazioni guidance changed e how improvements were verified.\n\nTeams should also define prestazioni budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete e avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets e require explicit waivers when thresholds are exceeded. Keep waiver text deterministic e tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable prestazioni culture where improvements are intentional, measurable, e easy to audit.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpot-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpot-v2-l1-q1",
                    "prompt": "Why use deterministic cost models before microbenchmarks?",
                    "options": [
                      "They provide stable regression signals in CI",
                      "They replace all profiling",
                      "They remove need per tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic models make relative regressions easy to catch early."
                  }
                ]
              }
            ]
          },
          "rpot-v2-data-structure-tradeoffs": {
            "title": "Data structures: Vec, HashMap, BTreeMap tradeoffs",
            "content": "# Data structures: Vec, HashMap, BTreeMap tradeoffs\n\nData structure choice is one of the highest leverage prestazioni decisions in Rust systems. Vec offers compact contiguous storage e predictable iteration speed. HashMap offers average-case fast lookup but can have higher allocation e hashing overhead. BTreeMap provides ordered keys e stable traversal costs con different memory locality characteristics.\n\nIn on-chain-adjacent simulations e indexers, workloads vary. If you mostly append e iterate, Vec plus binary search or index maps can outperform heavier maps. If random key lookup dominates, HashMap may win despite hash overhead. If deterministic ordering is required per report output or canonical snapshots, BTreeMap can simplify stable behavior.\n\nThe wrong pattern is premature abstraction that hides access patterns. Engineers should instrument operation counts e use cost models to evaluate actual use cases. Deterministic benchmark fixtures make this reproducible.\n\nAnother pratico tradeoff is allocation strategy. Reusing buffers e reserving capacity can reduce churn substantially. This is often more impactful than iterator-vs-loop debates.\n\nKeep progettazione reviews concrete: expected reads, writes, key cardinality, ordering requirements, e mutation frequency. Then choose structures intentionally e document rationale.\nPrestazioni engineering per on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines e CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline per regression detection. The model does not replace real profiling; it complements it by making early progettazione tradeoffs explicit e reviewable.\n\nWhen you model costs, keep weights documented e intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient e track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports con before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers e client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined con suggestion outputs e checkpoint reports, these models become pratico guardrails per engineering quality.\n\nMature teams combine these deterministic models con periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients e rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation e keeps recommendations aligned con actual system behavior. The key is to treat model updates as versioned changes con explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why prestazioni guidance changed e how improvements were verified.\n\nTeams should also define prestazioni budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete e avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets e require explicit waivers when thresholds are exceeded. Keep waiver text deterministic e tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable prestazioni culture where improvements are intentional, measurable, e easy to audit.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "rpot-v2-l2-terminal",
                "title": "Structure Comparison",
                "steps": [
                  {
                    "cmd": "Vec append + scan",
                    "output": "low allocation, high scan cost",
                    "note": "Good per sequential work"
                  },
                  {
                    "cmd": "HashMap lookups",
                    "output": "fast random access, hash overhead",
                    "note": "Good per key-based fetch"
                  }
                ]
              }
            ]
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
            "content": "# Explorer: cost model sandbox\n\nA cost sandbox lets teams test optimization hypotheses without waiting per full benchmark infrastructure. Provide operation counts, compute weighted costs, e inspect which buckets dominate total pressure.\n\nThe sandbox should separate baseline e optimized inputs so diffs are explicit. If a change claims fewer allocations but increases map lookups sharply, the model should show the net effect. This prevents one-dimensional optimization that regresses other paths.\n\nSuggestion generation should be threshold-based e deterministic. Per example, if allocation cost exceeds a threshold, recommend pre-allocation e buffer reuse. If serialization cost dominates, recommend batching or avoiding repeated decode/encode loops.\n\nStable report outputs are critical per engineering workflows. JSON payloads feed CI checks, markdown summaries support code review e team communication. Keep key ordering stable so string equality tests remain meaningful.\n\nSandboxes are not production profilers, but they are excellent decision support tools when kept deterministic e aligned con known workload patterns.\nPrestazioni engineering per on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines e CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline per regression detection. The model does not replace real profiling; it complements it by making early progettazione tradeoffs explicit e reviewable.\n\nWhen you model costs, keep weights documented e intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient e track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports con before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers e client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined con suggestion outputs e checkpoint reports, these models become pratico guardrails per engineering quality.\n\nMature teams combine these deterministic models con periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients e rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation e keeps recommendations aligned con actual system behavior. The key is to treat model updates as versioned changes con explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why prestazioni guidance changed e how improvements were verified.\n\nTeams should also define prestazioni budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete e avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets e require explicit waivers when thresholds are exceeded. Keep waiver text deterministic e tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable prestazioni culture where improvements are intentional, measurable, e easy to audit.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "rpot-v2-l3-explorer",
                "title": "Cost Sandbox Snapshots",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Before optimization",
                      "address": "perf1111111111111111111111111111111111111",
                      "lamports": 220,
                      "owner": "PerfModel111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "After optimization",
                      "address": "perf2222222222222222222222222222222222222",
                      "lamports": 150,
                      "owner": "PerfModel111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "rpot-v2-project-journey": {
        "title": "Compute Budget Profiler (Sim)",
        "description": "Build deterministic profilers, recommendation engines, e report outputs aligned to explicit prestazioni budgets.",
        "lessons": {
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
            "content": "Estimate deterministic operation costs from fixed weighting rules.",
            "duration": "40 min",
            "hints": [
              "Use deterministic arithmetic weights per each operation category.",
              "Return component breakdown plus total per easier optimization diffs."
            ]
          },
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
            "content": "Apply deterministic before/after metric reductions e diff outputs.",
            "duration": "40 min",
            "hints": [
              "Treat optimization as deterministic metric diffs, not runtime benchmarking.",
              "Clamp reduced metrics at zero."
            ]
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
            "content": "Compute deterministic serialization overhead e byte savings.",
            "duration": "35 min",
            "hints": [
              "Show why repeated encode/decode loops are expensive.",
              "Keep the model deterministic by counting bytes instead of timing."
            ]
          },
          "rpot-v2-suggest-optimizations": {
            "title": "Challenge: implement suggestOptimizations()",
            "content": "Generate stable optimization suggestions from deterministic metrics.",
            "duration": "35 min",
            "hints": [
              "Output suggestions as a stable, sorted list.",
              "Use threshold-based recommendations to avoid noisy advice."
            ]
          },
          "rpot-v2-perf-report-checkpoint": {
            "title": "Checkpoint: stable perf report",
            "content": "Export deterministic JSON e markdown profiler reports.",
            "duration": "45 min",
            "hints": [
              "Checkpoint must include stable JSON e markdown outputs.",
              "Use deterministic percentage rounding."
            ]
          }
        }
      }
    }
  },
  "rust-async-indexer-pipeline": {
    "title": "Concurrency & Async per Indexers (Rust)",
    "description": "Rust-first async pipeline engineering con bounded concurrency, replay-safe reducers, e deterministic operational reporting.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "async",
      "indexer",
      "pipeline"
    ],
    "modules": {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, e deterministic execution modeling per indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
            "content": "# Async fundamentals: futures, tasks, channels\n\nRust async systems are built on explicit scheduling rather than implicit thread-per-task models. Futures represent pending work, executors poll futures, e channels coordinate data flow. Per indexers, this architecture supports high throughput but requires careful control of concurrency e backpressure.\n\nA common failure mode is unbounded task spawning. It may look fine in local tests, then collapse in production under burst traffic due to memory pressure e queue growth. Defensive progettazione uses bounded concurrency con explicit task budgets.\n\nChannels are powerful but can hide overload when used without capacity limits. Bounded channels make pressure visible: producers block or shed work when consumers lag. In deterministic simulations, this behavior can be modeled by explicit queues e tick-based progression.\n\nThe key mindset is reproducibility. If pipeline behavior cannot be replayed deterministically, debugging e regression test become guesswork. Simulated executors solve this by removing wall-clock dependence.\n\n## Operator mindset\n\nAsync pipelines are reliability systems, not just throughput systems. Concurrency limits, retry behavior, e reducer determinism must stay auditable under stress.\n\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers e threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler con deterministic tick advancement provides a clean environment per validating bounded concurrency, retry sequencing, e backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, e completion order is reproducible.\n\nBackpressure progettazione should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably e metrics should expose this. Deterministic tests can assert queue length, total ticks, e completion order per stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency e stable reducers. Duplicate deliveries should collapse by key, e snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy e incident triage slows down. Stable JSON e markdown reports prevent that by keeping artifacts comparable between runs e between code versions.\n\nOperational teams should maintain scenario catalogs per burst traffic, retry storms, e partial-stage failures. Each scenario should specify expected queue depth, retry schedule, e final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios e impara system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters per accepted work, deferred work, retries, e dropped events. Without these counters, backpressure incidents become anecdotal e tuning decisions become reactive. Con deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI con mocked scheduler runs, e regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, e explicit failure budgets. Per educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks per each failure mode e link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, e communication templates per fast coordination.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "raip-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "raip-v2-l1-q1",
                    "prompt": "Why prefer bounded concurrency per indexer tasks?",
                    "options": [
                      "It prevents runaway memory e queue growth",
                      "It guarantees zero failures",
                      "It eliminates retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "Bounded concurrency keeps load behavior controlled e observable."
                  }
                ]
              }
            ]
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits e backpressure",
            "content": "# Concurrency limits e backpressure\n\nBackpressure is not optional in high-volume pipelines. Without it, producer speed can overwhelm reducers, retries, or storage sinks. A resilient progettazione sets explicit concurrency caps e queue semantics that are easy to reason about.\n\nSemaphore-style limits are a common pattern: only N tasks can run at once. Additional tasks wait in queue. Deterministic simulation can model this con a running list e remaining tick counters.\n\nRetry behavior interacts con backpressure. If retries ignore queue pressure, they amplify congestion. Deterministic retry schedules should be bounded e inspectable.\n\nProgettazione reviews should ask: what is max concurrent work, what is queue policy, what happens on overload, e how is fairness maintained. Stable run reports provide concrete answers.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers e threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler con deterministic tick advancement provides a clean environment per validating bounded concurrency, retry sequencing, e backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, e completion order is reproducible.\n\nBackpressure progettazione should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably e metrics should expose this. Deterministic tests can assert queue length, total ticks, e completion order per stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency e stable reducers. Duplicate deliveries should collapse by key, e snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy e incident triage slows down. Stable JSON e markdown reports prevent that by keeping artifacts comparable between runs e between code versions.\n\nOperational teams should maintain scenario catalogs per burst traffic, retry storms, e partial-stage failures. Each scenario should specify expected queue depth, retry schedule, e final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios e impara system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters per accepted work, deferred work, retries, e dropped events. Without these counters, backpressure incidents become anecdotal e tuning decisions become reactive. Con deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI con mocked scheduler runs, e regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, e explicit failure budgets. Per educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks per each failure mode e link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, e communication templates per fast coordination.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "raip-v2-l2-terminal",
                "title": "Backpressure Examples",
                "steps": [
                  {
                    "cmd": "concurrency=2, tasks=5",
                    "output": "queue grows to 3 before draining",
                    "note": "bounded e predictable"
                  }
                ]
              }
            ]
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph e concurrency",
            "content": "# Explorer: pipeline graph e concurrency\n\nPipeline graphs help teams communicate stage boundaries, concurrency budgets, e retry behaviors. A graph that shows ingest, dedupe, retry, e snapshot stages con explicit capacities is far more actionable than prose descriptions.\n\nIn deterministic simulation, each stage can be represented as queue + worker budget. Events progress in ticks, e transitions are logged in timeline snapshots. This makes race conditions e starvation visible.\n\nA good explorer shows total ticks, completion order, e per-tick running/completed sets. These artifacts become checkpoints per regression tests.\n\nPair graph exploration con idempotency key tests. Duplicate events should not mutate state repeatedly. Stable reducers e sorted outputs make this easy to verify.\n\nThe final objective is operational confidence: when congestion or reorg scenarios occur, teams can replay deterministic fixtures e compare expected versus actual behavior quickly.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers e threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler con deterministic tick advancement provides a clean environment per validating bounded concurrency, retry sequencing, e backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, e completion order is reproducible.\n\nBackpressure progettazione should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably e metrics should expose this. Deterministic tests can assert queue length, total ticks, e completion order per stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency e stable reducers. Duplicate deliveries should collapse by key, e snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy e incident triage slows down. Stable JSON e markdown reports prevent that by keeping artifacts comparable between runs e between code versions.\n\nOperational teams should maintain scenario catalogs per burst traffic, retry storms, e partial-stage failures. Each scenario should specify expected queue depth, retry schedule, e final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios e impara system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters per accepted work, deferred work, retries, e dropped events. Without these counters, backpressure incidents become anecdotal e tuning decisions become reactive. Con deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI con mocked scheduler runs, e regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, e explicit failure budgets. Per educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks per each failure mode e link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, e communication templates per fast coordination.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "raip-v2-l3-explorer",
                "title": "Pipeline Graph Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Run baseline",
                      "address": "pipea111111111111111111111111111111111111",
                      "lamports": 6,
                      "owner": "AsyncPipe111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Run con retries",
                      "address": "pipea222222222222222222222222222222222222",
                      "lamports": 8,
                      "owner": "AsyncPipe111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 112
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, e report exports per reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
            "content": "Simulate bounded-concurrency execution con deterministic task ordering.",
            "duration": "40 min",
            "hints": [
              "Model bounded concurrency con a deterministic queue e tick loop.",
              "No real timers; simulate progression by decrementing remaining ticks."
            ]
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
            "content": "Generate deterministic retry delay schedules per linear e exponential policies.",
            "duration": "40 min",
            "hints": [
              "Retry schedule should be deterministic e bounded.",
              "Support linear e exponential backoff modes."
            ]
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
            "content": "Deduplicate replay events by deterministic idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Use idempotency keys to collapse duplicate replay events.",
              "Return stable sorted keys per deterministic snapshots."
            ]
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
            "content": "Build deterministic snapshot state from simulated event streams.",
            "duration": "35 min",
            "hints": [
              "Reducer should be deterministic e idempotent-friendly.",
              "Sort output keys per stable report generation."
            ]
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
            "content": "Export deterministic run report artifacts per the async pipeline simulation.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should mirror deterministic pipeline run artifacts.",
              "Include both machine e human-readable export fields."
            ]
          }
        }
      }
    }
  },
  "rust-proc-macros-codegen-safety": {
    "title": "Procedural Macros & Codegen per Safety",
    "description": "Rust macro/codegen safety taught through deterministic parser e check-generation tooling con audit-friendly outputs.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "macros",
      "codegen",
      "safety"
    ],
    "modules": {
      "rpmcs-v2-foundations": {
        "title": "Macro e Codegen Foundations",
        "description": "Macro modello mentales, constraint DSL progettazione, e safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro modello mentale: declarative vs procedural",
            "content": "# Macro modello mentale: declarative vs procedural\n\nRust macros come in two broad forms: declarative macros per pattern-based expansion e procedural macros per syntax-aware transformation. Anchor relies heavily on macro-driven ergonomics to generate account validation e istruzione plumbing.\n\nPer safety engineering, the value is consistency. Instead of hand-writing signer e owner checks in every handler, macro-style codegen can enforce these rules from concise attributes. This reduces copy-paste drift e makes review focus on policy intent.\n\nIn this corso, we simulate proc-macro behavior con deterministic TypeScript parser/generator helpers. The goal is conceptual transfer: attribute input -> AST -> generated checks -> runtime evaluation report.\n\nA macro modello mentale helps avoid two mistakes: trusting generated behavior blindly e over-generalizing DSL syntax. Good macro progettazione keeps syntax explicit, expansion predictable, e errors readable.\n\nTreat generated checks as code artifacts, not opaque internals. Store them in tests, compare them in diffs, e validate behavior on controlled fixtures.\n\n## Operator mindset\n\nCodegen safety depends on reviewable output. If generated checks are not deterministic e diff-friendly, teams lose trust e incidents take longer to diagnose.\n\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor e Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate e catch classes of validation bugs early. Per teaching in a browser environment, a deterministic parser e generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes e debugging becomes harder. Stable generated strings, golden file tests, e deterministic run reports solve this. Teams can diff generated code as plain text e confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL progettazione. Attribute syntax should be strict enough to reject ambiguous input e explicit enough to encode signer, owner, relation, e mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind e target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules e keep migration guides per older attribute forms. Unversioned grammar drift can silently break generated checks e create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired con golden output snapshots e runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, e testable, which is exactly the behavior needed per safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, e runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined e avoids turning safety tooling into a maintenance burden. Teams can further strengthen this con compatibility suites that replay historical DSL inputs against new parsers e compare outputs byte-per-byte. When differences appear, release notes should explain why behavior changed e how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent e lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, e runtime validation signoff in every checklist.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpmcs-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpmcs-v2-l1-q1",
                    "prompt": "Why is generated code review important per safety?",
                    "options": [
                      "It verifies expansion matches policy intent",
                      "It increases compile speed",
                      "It removes need per tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Generated checks must remain inspectable e auditable."
                  }
                ]
              }
            ]
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
            "content": "# Safety through codegen: constraint checks\n\nConstraint codegen converts compact declarations into explicit runtime guards. Typical constraints include signer presence, account ownership, has-one relations, e mutability requirements.\n\nA strong codegen pipeline validates input syntax strictly, produces deterministic output ordering, e emits meaningful errors per unsupported forms. Weak codegen pipelines accept ambiguous syntax e produce inconsistent expansion, which undermines trust.\n\nOwnership checks are high-value constraints because account substitution bugs are common in Solana systems. Generated owner guards reduce omission risk. Signer checks ensure privileged paths are gated by explicit authority.\n\nHas-one relation checks encode structural links between account e authorities. Generated relation checks reduce manual mistakes e keep behavior aligned across handlers.\n\nFinally, test generated output via golden strings catches accidental expansion drift. This is especially useful during parser refactors.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor e Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate e catch classes of validation bugs early. Per teaching in a browser environment, a deterministic parser e generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes e debugging becomes harder. Stable generated strings, golden file tests, e deterministic run reports solve this. Teams can diff generated code as plain text e confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL progettazione. Attribute syntax should be strict enough to reject ambiguous input e explicit enough to encode signer, owner, relation, e mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind e target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules e keep migration guides per older attribute forms. Unversioned grammar drift can silently break generated checks e create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired con golden output snapshots e runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, e testable, which is exactly the behavior needed per safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, e runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined e avoids turning safety tooling into a maintenance burden. Teams can further strengthen this con compatibility suites that replay historical DSL inputs against new parsers e compare outputs byte-per-byte. When differences appear, release notes should explain why behavior changed e how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent e lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, e runtime validation signoff in every checklist.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "rpmcs-v2-l2-terminal",
                "title": "Constraint Expansion Samples",
                "steps": [
                  {
                    "cmd": "signer(authority)",
                    "output": "require_signer(authority);",
                    "note": "auth guard"
                  },
                  {
                    "cmd": "owner(vault=VaultProgram)",
                    "output": "require_owner(vault, VaultProgram);",
                    "note": "owner guard"
                  }
                ]
              }
            ]
          },
          "rpmcs-v2-constraint-builder-explorer": {
            "title": "Explorer: constraint builder to generated checks",
            "content": "# Explorer: constraint builder to generated checks\n\nA constraint builder explorer helps engineers see how DSL choices affect generated code e runtime safety outcomes. Input one attribute line, observe parsed AST, generated pseudo-code, e pass/fail execution against sample inputs.\n\nThis tight loop is useful per both education e production review. Teams can prototype new constraint forms, verify deterministic output, e add golden tests before adoption.\n\nThe explorer should surface parse failures clearly. If syntax is invalid, report line e expected format. If constraint kind is unsupported, fail con deterministic error text.\n\nGenerated checks should preserve input order unless policy requires canonical sorting. Either way, behavior must be deterministic e documented.\n\nRuntime evaluation output should include failure list con kind, target, e reason. This allows developers to fix configuration quickly e keeps safety reporting actionable.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor e Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate e catch classes of validation bugs early. Per teaching in a browser environment, a deterministic parser e generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes e debugging becomes harder. Stable generated strings, golden file tests, e deterministic run reports solve this. Teams can diff generated code as plain text e confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL progettazione. Attribute syntax should be strict enough to reject ambiguous input e explicit enough to encode signer, owner, relation, e mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind e target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules e keep migration guides per older attribute forms. Unversioned grammar drift can silently break generated checks e create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired con golden output snapshots e runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, e testable, which is exactly the behavior needed per safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, e runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined e avoids turning safety tooling into a maintenance burden. Teams can further strengthen this con compatibility suites that replay historical DSL inputs against new parsers e compare outputs byte-per-byte. When differences appear, release notes should explain why behavior changed e how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent e lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, e runtime validation signoff in every checklist.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "rpmcs-v2-l3-explorer",
                "title": "Constraint Builder Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Valid constraints",
                      "address": "macro111111111111111111111111111111111111",
                      "lamports": 1,
                      "owner": "ConstraintGen1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 88
                    },
                    {
                      "label": "Owner mismatch case",
                      "address": "macro222222222222222222222222222222222222",
                      "lamports": 2,
                      "owner": "ConstraintGen1111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 88
                    }
                  ]
                }
              }
            ]
          }
        }
      },
      "rpmcs-v2-project-journey": {
        "title": "Account Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, e publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
            "content": "Parse mini-DSL constraints into deterministic AST nodes.",
            "duration": "40 min",
            "hints": [
              "Parse mini DSL lines into typed AST nodes.",
              "Support signer, mut, owner, e has_one forms."
            ]
          },
          "rpmcs-v2-generate-checks": {
            "title": "Challenge: implement generateChecks()",
            "content": "Generate stable pseudo-code from parsed constraint AST.",
            "duration": "40 min",
            "hints": [
              "Generate stable pseudo-code output from AST.",
              "One deterministic line per constraint node."
            ]
          },
          "rpmcs-v2-golden-tests": {
            "title": "Challenge: deterministic golden-file checks",
            "content": "Compare generated check output against deterministic golden strings.",
            "duration": "35 min",
            "hints": [
              "Golden tests compare generated output strings exactly.",
              "Keep check output deterministic to make golden tests meaningful."
            ]
          },
          "rpmcs-v2-run-generated-checks": {
            "title": "Challenge: runGeneratedChecks()",
            "content": "Execute generated constraints on deterministic sample input.",
            "duration": "35 min",
            "hints": [
              "Evaluate generated constraints against sample account state.",
              "Return deterministic failure reasons."
            ]
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
            "content": "Export deterministic markdown safety report from generated checks.",
            "duration": "45 min",
            "hints": [
              "Render a deterministic markdown report from generated check results.",
              "Include status e explicit failure details."
            ]
          }
        }
      }
    }
  },
  "anchor-upgrades-migrations": {
    "title": "Anchor Upgrades & Account Migrations",
    "description": "Progettazione production-safe Anchor release workflows con deterministic migration planning, upgrade gates, rollback playbooks, e readiness evidence.",
    "duration": "8 hours",
    "tags": [
      "anchor",
      "solana",
      "upgrades",
      "migrations",
      "program-management"
    ],
    "modules": {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, account versioning strategy, e deterministic upgrade risk modeling per Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
            "content": "# Upgrade authority lifecycle in Anchor programs\n\nAnchor makes istruzione development easier, but upgrade safety still depends on disciplined control of program authority. In production Solana systems, most upgrade incidents are not caused by syntax bugs. They come from process mistakes: wrong key management, unclear release ownership, e missing checks between build artifacts e deployed programdata. This lezione teaches a pratico lifecycle model that maps directly to how Anchor programs are deployed e governed.\n\nStart con a strict authority model. Define who can sign upgrades e under which conditions. A single hot wallet is not acceptable per mature systems. Typical setups use a multisig or governance path to approve artifacts, then a controlled signer to perform distribuzione. The important point is determinism: the same release decision should produce the same auditable evidence each time. That includes artifact hash, release tag, authority signers, e rollback policy. If your team cannot reconstruct those facts after a deploy, your process is too weak.\n\nNext, treat build reproducibility as a first-class requirement. You should compare the expected binary hash against programdata hash before e after distribuzione in your pipeline simulation. Even when this corso stays deterministic e does not hit RPC, the policy should model hash matching as a gate. If the hash mismatch flag is true, the release is blocked. This simple rule prevents one of the most expensive failure classes: thinking you shipped one artifact while another artifact is actually live.\n\nAuthority transition rules matter too. Some protocols intentionally revoke upgrade authority after a stabilization window. Others keep authority but require governance timelocks e emergency pause conditions. Neither is universally correct. The key is consistency con explicit trigger conditions. If you revoke authority too early, you lose the ability to patch critical bugs. If you never constrain authority, users cannot trust immutability promises. Anchor does not solve this governance tradeoff per you; it only provides the program framework.\n\nRelease communication is part of sicurezza. Users e integrators need predictable language about what changed e whether state migration is required. Per example, if you add new account fields but keep backward decoding compatibility, your report should say migration is optional per old account e mandatory per new writes after a certain slot range. If compatibility breaks, the report must include exact batch strategy e downtime expectations. Ambiguous language creates support load e increases operational risk.\n\nFinally, progettazione your release pipeline per deterministic dry runs. Simulate migration steps, validation checks, e report generation locally. The goal is to eliminate unforced errors before any transazione is signed. A deterministic runbook is not bureaucracy; it is what keeps urgent releases calm e reviewable.\n\n## Operator mindset\n\nAnchor upgrades are operations work con cryptographic consequences. Authority controls, migration sequencing, e rollback criteria should be treated as release contracts, not informal habits.\n\n\nThis lezione should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures per each upgrade class: schema-only changes, istruzione behavior changes, e authority changes. Per every class, capture expected artifacts e compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, e what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, e support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown e stable JSON, teams avoid panic changes during incidents e can audit exactly what happened after the fact. The same approach improves onboarding: new engineers impara from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define clear authority ownership e approval flow.\n- Require artifact hash match before rollout.\n- Document authority transition e rollback policy.\n- Publish migration impact in deterministic report fields.\n- Block releases when dry-run evidence is missing.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "aum-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "aum-v2-l1-q1",
                    "prompt": "What is the most defensible release gate before distribuzione?",
                    "options": [
                      "Compare approved build hash to expected programdata hash policy input",
                      "Ship quickly e validate hash later",
                      "Rely on signer memory without written report"
                    ],
                    "answerIndex": 0,
                    "explanation": "Hash matching is a deterministic control that prevents artifact drift during distribuzione."
                  },
                  {
                    "id": "aum-v2-l1-q2",
                    "prompt": "Why is release communication part of upgrade safety?",
                    "options": [
                      "Integrators need exact migration impact e timing to avoid operational errors",
                      "Because Anchor automatically writes support tickets",
                      "Because all upgrades are backward compatible"
                    ],
                    "answerIndex": 0,
                    "explanation": "Unclear upgrade messaging causes integration mistakes e user-facing incidents."
                  }
                ]
              }
            ]
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Account versioning e migration strategy",
            "content": "# Account versioning e migration strategy\n\nSolana account are long-lived state containers, so program upgrades must respect historical data. In Anchor, adding or changing account fields can be safe, risky, or catastrophic depending on how version markers, discriminators, e decode logic are handled. This lezione focuses on migration planning that is deterministic, testable, e production-oriented.\n\nThe first rule is explicit version markers. Do not infer schema version from account size alone because reallocations e optional fields can make that ambiguous. Include a version field e define what each version guarantees. Your migration planner can then segment account ranges by version e apply deterministic transforms. Without explicit markers, teams often guess state shape e ship brittle one-off scripts.\n\nSecond, separate compatibility mode from migration mode. Compatibility mode means new code can read old e new versions while writes may still target old shape per a transition period. Migration mode means writes are frozen or routed through upgrade-safe paths while account batches are rewritten. Both modes are valid, but mixing them without clear boundaries creates partial state e broken assumptions.\n\nBatching is a pratico necessity. Large protocols cannot migrate every account in one transazione or one slot. Your plan should define batch size, ordering, e integrity checks. Per example, process account indexes in deterministic ascending order e verify expected post-migration invariants after each batch. If a batch fails, rerun exactly that batch con idempotent logic. Deterministic batch identifiers make this auditable e easier to recover.\n\nPlan per dry-run e rollback before execution. A migration plan should include prepare, migrate, verify, e finalize steps con explicit criteria. Prepare can freeze new writes e snapshot baseline metrics. Verify can compare counts by version e check critical invariants. Finalize can re-enable writes e publish a signed report. Rollback should be defined as a separate branch, not improvised during incident pressure.\n\nAnchor adds value here through typed account contexts e constraints, but migrations still require careful data engineering. Per every changed account type, maintain deterministic test fixtures: old bytes, expected new bytes, e expected structured decode output. This catches layout regressions early e builds confidence when migrating real state.\n\nTreat migration metrics as product metrics too. Users care about downtime, failed actions, e consistency across clients. If migration affects read paths, expose status in UX so users understand what is happening. Reliable migrations are as much about communication e orchestration as they are about code.\n\n\nThis lezione should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures per each upgrade class: schema-only changes, istruzione behavior changes, e authority changes. Per every class, capture expected artifacts e compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, e what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, e support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown e stable JSON, teams avoid panic changes during incidents e can audit exactly what happened after the fact. The same approach improves onboarding: new engineers impara from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use explicit version markers in account data.\n- Define compatibility e migration modes separately.\n- Migrate in deterministic batches con idempotent retries.\n- Keep dry-run fixtures per byte-level e structured outputs.\n- Publish migration status e completion evidence.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "aum-v2-l2-terminal",
                "title": "Migration Batch Walkthrough",
                "steps": [
                  {
                    "cmd": "prepare --freeze-writes --snapshot-count=12000",
                    "output": "status=ok frozen=true snapshot=12000",
                    "note": "Freeze writes before touching account schema."
                  },
                  {
                    "cmd": "migrate --batch=3 --range=2000-2999 --target=v3",
                    "output": "status=ok migrated=1000 failed=0",
                    "note": "Batch IDs are deterministic e replayable."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
            "content": "# Explorer: upgrade risk matrix\n\nA useful upgrade explorer should show cause-e-effect between release inputs e safety outcomes. If a flag changes, engineers should immediately see how severity e readiness changes. This lezione teaches how to build e read a deterministic risk matrix per Anchor upgrades.\n\nThe matrix starts con five high-signal inputs: upgrade authority present, program hash match, IDL breaking changes count, migration backfill completion, e dry-run pass status. These cover governance, artifact integrity, compatibility risk, data readiness, e execution readiness. They are not exhaustive, but they are enough to prevent most avoidable mistakes.\n\nEach matrix row represents a release candidate state. Per every row, compute issue codes e severity levels in stable order. Stable ordering is not cosmetic; it allows exact output comparisons in CI e easy diff review in pull requests. If issue ordering changes between commits without policy changes, you know something in implementation drifted.\n\nSeverity calibration should be conservative. Missing upgrade authority, hash mismatch, e failed dry run are high severity because they directly block safe rollout. Incomplete backfill e IDL breaking changes are usually medium severity: sometimes resolvable con migration notes e staged release windows, but still risky if ignored.\n\nThe explorer should also teach false confidence patterns. Per example, a release con zero IDL changes can still be unsafe if program hash does not match approved artifact. Conversely, a release con breaking changes can still be safe if migration plan is complete, compatibility notes are clear, e rollout is staged con monitoring. Risk is contextual; deterministic policy helps avoid emotional decisions.\n\nFrom a workflow perspective, the matrix output should feed both engineering e support. Engineering uses JSON per machine checks e gating. Support uses markdown summary to communicate whether release is ready, delayed, or blocked e why. If these outputs disagree, your generation path is wrong. Use one canonical payload e derive both formats.\n\nFinally, integrate the explorer into code review. Require reviewers to reference matrix output per each release PR. This keeps decisions anchored in explicit evidence rather than implicit trust in distribuzione scripts.\n\n\nThis lezione should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures per each upgrade class: schema-only changes, istruzione behavior changes, e authority changes. Per every class, capture expected artifacts e compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, e what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, e support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown e stable JSON, teams avoid panic changes during incidents e can audit exactly what happened after the fact. The same approach improves onboarding: new engineers impara from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use a canonical risk payload con stable ordering.\n- Mark authority/hash/dry-run failures as blocking.\n- Keep JSON e markdown generated from one source.\n- Validate matrix behavior con deterministic fixtures.\n- Treat explorer output as part of PR review evidence.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "aum-v2-l3-explorer",
                "title": "Upgrade Risk Scenarios",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Release candidate A",
                      "address": "AUpg111111111111111111111111111111111111111",
                      "lamports": 3000,
                      "owner": "BPFLoaderUpgradeab1e11111111111111111111111",
                      "executable": false,
                      "dataLen": 128
                    },
                    {
                      "label": "Release candidate B",
                      "address": "AUpg222222222222222222222222222222222222222",
                      "lamports": 4500,
                      "owner": "BPFLoaderUpgradeab1e11111111111111111111111",
                      "executable": false,
                      "dataLen": 160
                    }
                  ]
                }
              }
            ]
          },
          "aum-v2-plan-migration-steps": {
            "title": "Challenge: implement migration step planner",
            "content": "Implement deterministic migration planning output: fromVersion, toVersion, totalBatches, e requiresMigration.",
            "duration": "40 min",
            "hints": [
              "Use Math.ceil(accountCount / batchSize) per deterministic batch count.",
              "requiresMigration should be true only when toVersion > fromVersion.",
              "Return only stable scalar fields per exact JSON comparisons."
            ]
          }
        }
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, e deterministic readiness artifacts per controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
            "content": "Implement deterministic blocking issue checks per authority, artifact hash, e dry-run status.",
            "duration": "40 min",
            "hints": [
              "Treat missing authority, hash mismatch, e failed dry run as blocking issues.",
              "Return issueCount plus ordered issue code array.",
              "Keep order stable to make report diffs deterministic."
            ]
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy e incident playbooks",
            "content": "# Rollback strategy e incident playbooks\n\nEven strong upgrade plans can encounter surprises: incompatible downstream clients, unexpected account edge cases, or release pipeline mistakes. Teams that recover quickly are the ones that predefine rollback e incident playbooks before any distribuzione begins. This lezione covers pragmatic rollback progettazione per Anchor-based systems.\n\nRollback starts con explicit trigger conditions. Do not wait per subjective debate during an incident. Define measurable triggers such as failure rate thresholds, migration error counts, or critical invariant violations. Once trigger conditions are met, the system should move into a known response mode: pause writes, stop new migration batches, e publish incident status.\n\nA common mistake is assuming rollback always means restoring old binary immediately. Sometimes that is correct; other times it can worsen state divergence if partial migrations already wrote new version markers. Your playbook should classify failure phase: pre-migration, mid-migration, or post-finalization. Each phase has different safest actions. Mid-migration incidents often require completing compensating transforms before binary rollback.\n\nAnchor account constraints help protect invariant boundaries, but they do not orchestrate recovery sequencing. You still need deterministic tooling per affected account identification, reprocessing queues, e reconciliation summaries. Keep these tools pure e replayable where possible. If logic cannot be replayed, incident analysis becomes guesswork.\n\nCommunication is part of rollback. Engineering, support, e partner teams should consume the same deterministic report fields: release tag, rollback trigger, impacted batch ranges, current mitigation status, e next checkpoint time. Avoid free-form updates that diverge across channels.\n\nPost-incident learning must be concrete. Per each incident, add one or more deterministic fixtures reproducing the decision path that failed. Update policy functions e confirm that the new fixtures prevent recurrence. This is how reliability improves release after release.\n\nFinally, distinguish between emergency stop controls e full rollback procedures. Emergency stop is per immediate blast radius reduction. Full rollback or forward-fix decisions can come after state assessment. Blending these concepts causes rushed mistakes.\n\n\nThis lezione should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures per each upgrade class: schema-only changes, istruzione behavior changes, e authority changes. Per every class, capture expected artifacts e compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, e what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, e support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown e stable JSON, teams avoid panic changes during incidents e can audit exactly what happened after the fact. The same approach improves onboarding: new engineers impara from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define measurable rollback triggers in advance.\n- Classify incident phase before selecting response path.\n- Keep recovery tooling replayable e deterministic.\n- Share one canonical incident report format.\n- Add regression fixtures after every rollback event.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "aum-v2-l6-quiz",
                "title": "Incident Response Check",
                "questions": [
                  {
                    "id": "aum-v2-l6-q1",
                    "prompt": "What should happen first when rollback trigger thresholds are hit?",
                    "options": [
                      "Enter defined response mode: pause risky actions e publish status",
                      "Continue migration batches to avoid confusion",
                      "Delete all historical reports"
                    ],
                    "answerIndex": 0,
                    "explanation": "Trigger conditions should map to immediate deterministic response actions."
                  },
                  {
                    "id": "aum-v2-l6-q2",
                    "prompt": "Why add deterministic fixtures after an incident?",
                    "options": [
                      "To prove policy changes prevent the same failure path",
                      "To increase deploy complexity without benefit",
                      "To replace all code reviews"
                    ],
                    "answerIndex": 0,
                    "explanation": "Incident fixtures turn lezioni into enforceable regression tests."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
            "content": "Generate deterministic markdown from releaseTag, totalBatches, e issueCount.",
            "duration": "35 min",
            "hints": [
              "Keep line ordering e punctuation stable.",
              "Use bullet list fields per releaseTag, totalBatches, e issueCount.",
              "Return plain markdown string without trailing spaces."
            ]
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
            "content": "Produce the final deterministic checkpoint artifact con release tag, readiness flag, e migration batch count.",
            "duration": "45 min",
            "hints": [
              "ready is true only when issueCount equals 0.",
              "Return stable keys in releaseTag, ready, migrationBatches order.",
              "Checkpoint output should be machine-readable deterministic JSON."
            ]
          }
        }
      }
    }
  },
  "solana-reliability": {
    "title": "Reliability Engineering per Solana",
    "description": "Production-focused reliability engineering per Solana systems: fault tolerance, retries, deadlines, circuit breakers, e graceful degradation con measurable operational outcomes.",
    "duration": "6 weeks",
    "tags": [
      "reliability",
      "fault-tolerance",
      "resilience",
      "production"
    ],
    "modules": {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks con clear failure classification, retry boundaries, e deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
            "content": "Fault tolerance in Solana systems is not just about catching errors. It is about deciding which failures are safe to retry, which should fail fast, e how to preserve user trust while doing both.\n\nA pratico reliability model starts con failure classes:\n1) transient failures (timeouts, temporary RPC unavailability),\n2) persistent external failures (rate limits, prolonged endpoint degradation),\n3) deterministic business failures (invalid input, invariant violations).\n\nTransient failures may justify bounded retries con backoff. Deterministic business failures should not be retried because retries only add latency e load. Persistent external failures often require fallback endpoints, degraded features, or temporary protection modes.\n\nIn Solana workflows, reliability is tightly coupled to freshness constraints. A request can be logically valid but still fail if supporting state has shifted (per example stale quote windows or expired blockhash contexts in client workflows). Reliable systems therefore combine retry logic con freshness checks e clear abort conditions.\n\nDefensive engineering means defining policies explicitly:\n- maximum retry count,\n- per-attempt timeout,\n- total deadline budget,\n- fallback behavior after budget exhaustion,\n- user-facing messaging per each failure class.\n\nWithout explicit budgets, systems drift into infinite retry loops or fail too early. Con explicit budgets, behavior is predictable e testable.\n\nPer production teams, observability is mandatory. Every failed operation should include a deterministic reason code e context fields (attempt number, endpoint, elapsed time, policy branch). This turns reliability from guesswork into measurable behavior.\n\nReliable systems do not promise zero failures. They promise controlled failure behavior: bounded latency, clear outcomes, e safe degradation under stress.",
            "duration": "45 min"
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
            "content": "Implement an exponential backoff retry mechanism per handling transient failures.",
            "duration": "45 min",
            "hints": [
              "Use match on the BackoffStrategy enum to handle each case",
              "Per exponential backoff, use 2_u64.pow(attempt) to calculate the multiplier",
              "should_retry simply checks if attempt is less than max_attempts"
            ]
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
            "content": "Implement a deadline management system to enforce time limits on operations.",
            "duration": "45 min",
            "hints": [
              "Store the absolute expiration timestamp in the Deadline struct",
              "Per time_remaining, subtract current_time from deadline timestamp if not expired",
              "Per extend_deadline, calculate the new timestamp e check against max allowed"
            ]
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
            "content": "Implement a fallback mechanism that provides alternative execution paths when primary operations fail.",
            "duration": "45 min",
            "hints": [
              "Call the primary function first e check if it returns Some",
              "Only call fallback if primary returns None",
              "Per retry, loop max_retries times trying primary before falling back"
            ]
          }
        }
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, e rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
            "content": "Resilience patterns are controls that prevent localized failures from becoming system-wide incidents. On Solana integrations, they are especially important because provider health can change quickly under bursty network conditions.\n\nCircuit breaker pattern:\n- closed: normal operation,\n- open: block requests after repeated failures,\n- half-open: probe recovery con controlled trial requests.\n\nA good breaker uses deterministic thresholds e cooldowns, not ad hoc toggles. It should expose state transitions per monitoring e post-incident review.\n\nBulkhead pattern isolates resource pools so one failing workflow (per example expensive quote refresh loops) cannot starve unrelated workflows (like portfolio reads).\n\nRate limiting controls outbound pressure to providers. Proper limits reduce 429 storms e improve overall success rate. Token-bucket strategies are useful because they allow short bursts while preserving long-term bounds.\n\nThese patterns should be coordinated, not layered blindly. Per example, aggressive retries plus weak rate limiting can bypass the intent of a circuit breaker. Policy composition must be reviewed end-to-end.\n\nA mature resilience stack includes:\n- deterministic policy config,\n- simulation fixtures per calm vs stressed traffic,\n- dashboard visibility per breaker states e reject reasons,\n- explicit user copy per degraded mode.\n\nResilience is successful when users experience predictable service quality under failure, not when systems appear perfect in ideal conditions.",
            "duration": "45 min"
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
            "content": "Implement a circuit breaker pattern that opens after consecutive failures e closes after a recovery period.",
            "duration": "45 min",
            "hints": [
              "In can_execute, check if recovery timeout has passed per Open state",
              "record_success should reset everything to Closed state",
              "record_failure increments count e opens circuit when threshold is reached"
            ]
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
            "content": "Implement a token bucket rate limiter per controlling request rates.",
            "duration": "45 min",
            "hints": [
              "Always refill before checking if consumption is possible",
              "Calculate elapsed time e multiply by refill rate to get tokens to add",
              "Use min() to ensure tokens don't exceed capacity"
            ]
          },
          "lesson-10-2-4": {
            "title": "Error Classifier Challenge",
            "content": "Implement an error classification system to determine if errors are retryable.",
            "duration": "45 min",
            "hints": [
              "Use match con range patterns (1000..=1999) to classify",
              "should_retry can use matches! macro or match on classify result",
              "batch_classify can use iter().map().collect() pattern"
            ]
          }
        }
      }
    }
  },
  "solana-testing-strategies": {
    "title": "Test Strategies per Solana",
    "description": "Comprehensive, production-oriented test strategy per Solana: deterministic unit tests, realistic integration tests, fuzz/property test, e release-confidence reporting.",
    "duration": "5 weeks",
    "tags": [
      "testing",
      "quality-assurance",
      "fuzzing",
      "property-testing"
    ],
    "modules": {
      "mod-11-1": {
        "title": "Unit e Integration Test",
        "description": "Build deterministic unit e integration test layers con clear ownership of invariants, fixtures, e failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Test Fundamentals",
            "content": "Test Solana systems effectively requires layered confidence, not one giant test suite.\n\nUnit tests validate pure logic: math, state transitions, e invariant checks. They should be fast, deterministic, e run on every change.\n\nIntegration tests validate component wiring: modello degli accounting, istruzione construction, e cross-modulo behavior under realistic inputs. They should catch schema drift e boundary errors that unit tests miss.\n\nA pratico test pyramid per Solana work:\n1) deterministic unit tests (broadest coverage),\n2) deterministic integration tests (targeted workflow coverage),\n3) environment-dependent checks (smaller set, higher cost).\n\nCommon failure in teams is over-reliance on environment-dependent tests while neglecting deterministic core checks. This creates flaky CI e weak debugging signals.\n\nGood test progettazione principles:\n- explicit fixture ownership,\n- stable expected outputs,\n- structured error assertions (not only success assertions),\n- regression fixtures per previously discovered bugs.\n\nPer production readiness, test outputs should be easy to audit. Summaries should include pass/fail counts by category, failing invariant IDs, e deterministic reproduction inputs.\n\nTest is not just correctness verification; it is an operational communication tool. Strong test artifacts make release decisions clearer e incident response faster.",
            "duration": "45 min"
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
            "content": "Implement a test assertion framework per verifying program state.",
            "duration": "45 min",
            "hints": [
              "Compare actual vs expected values e return appropriate Result",
              "Use format! to create descriptive error messages",
              "Return Ok(()) per success cases"
            ]
          },
          "lesson-11-1-3": {
            "title": "Mock Account Generator Challenge",
            "content": "Create a mock account generator per test con configurable parameters.",
            "duration": "45 min",
            "hints": [
              "Use vec![0; size] to create zero-filled data of specified size",
              "Per generate_with_lamports, use default values per other fields",
              "Signer account typically have is_writable set to true"
            ]
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
            "content": "Build a test scenario builder per setting up complex test environments.",
            "duration": "45 min",
            "hints": [
              "Use builder pattern con self return type per chaining",
              "Push strings into vectors (use to_string() to convert &str)",
              "build() consumes self e creates the final TestScenario"
            ]
          }
        }
      },
      "mod-11-2": {
        "title": "Avanzato Test Techniques",
        "description": "Use fuzzing, property-based tests, e mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing e Property Test",
            "content": "Avanzato test techniques uncover failures that example-based tests rarely find.\n\nFuzzing explores broad random input space to trigger parser edge cases, boundary overflows, e unexpected state combinations. It is especially useful per serialization, decoding, e input validation layers.\n\nProperty-based test defines invariants that must hold across many generated inputs. Instead of asserting one output, you assert a rule (per example: balances never become negative, or decoded-then-encoded payload remains stable).\n\nMutation-style thinking strengthens this further: intentionally alter assumptions e verify tests fail as expected. If tests still pass after a harmful change, coverage is weaker than it appears.\n\nTo keep avanzato test pratico:\n- use deterministic seeds in CI per reproducibility,\n- store failing cases as permanent regression fixtures,\n- separate heavy campaigns from per-commit fast checks.\n\nAvanzato tests are most valuable when tied to explicit risk categories. Map each category (serialization safety, invariant consistency, edge-case arithmetic) to at least one dedicated property or fuzz campaign.\n\nTeams that treat fuzz/property failures as first-class release blockers catch subtle defects earlier e reduce high-severity production incidents.",
            "duration": "45 min"
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
            "content": "Implement a fuzz input generator per test con random data.",
            "duration": "45 min",
            "hints": [
              "Use wrapping_mul e wrapping_add per LCG to avoid overflow panics",
              "Generate bytes by taking random % 256",
              "Per bounded generation, calculate range e add to min"
            ]
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
            "content": "Implement a property verifier that checks invariants hold across operations.",
            "duration": "45 min",
            "hints": [
              "Per commutative, call op both ways e compare",
              "Per associative, nest the calls differently e compare",
              "Per non_decreasing, iterate through pairs e check ordering"
            ]
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
            "content": "Implement a boundary value analyzer per identifying edge cases.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub e saturating_add to avoid overflow",
              "Typical value is the midpoint of the range",
              "Return all 7 boundary values as test cases"
            ]
          }
        }
      }
    }
  },
  "solana-program-optimization": {
    "title": "Solana Program Optimization",
    "description": "Engineer production-grade Solana prestazioni: compute budgeting, account layout efficiency, memory/rent tradeoffs, e deterministic optimization workflows.",
    "duration": "5 weeks",
    "tags": [
      "optimization",
      "performance",
      "compute-units",
      "profiling"
    ],
    "modules": {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths con explicit CU budgets, operation-level profiling, e predictable prestazioni tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
            "content": "Compute units are the hard resource budget that shapes what your Solana program can do in a single transazione. Prestazioni optimization starts by treating CU usage as a contract, not an afterthought.\n\nA reliable optimization loop is:\n1) measure baseline CU by operation type,\n2) identify dominant cost buckets (deserialization, hashing, loops, CPI fan-out),\n3) optimize one hotspot at a time,\n4) re-measure e keep only changes con clear gains.\n\nCommon anti-patterns include optimizing cold paths, adding complexity without measurement, e ignoring account-size side effects. In Solana systems, compute e account progettazione are coupled: a larger account can increase deserialization cost, which raises CU pressure.\n\nPer production teams, deterministic cost fixtures are crucial. They let you compare before/after behavior in CI e stop regressions early. Prestazioni work is most useful when every claim is backed by reproducible evidence, not intuition.",
            "duration": "45 min"
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
            "content": "Implement a compute unit counter to estimate operation costs.",
            "duration": "45 min",
            "hints": [
              "Loop cost is overhead plus iterations times per-iteration cost",
              "Account access is simply account multiplied by per-account CU",
              "Apply safety margin by multiplying budget by the percentage"
            ]
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
            "content": "Optimize data structures per minimal serialization overhead.",
            "duration": "45 min",
            "hints": [
              "Use copy_from_slice to write data efficiently",
              "Track the highest written position as 'used'",
              "Always check bounds before read/write operations"
            ]
          },
          "lesson-12-1-4": {
            "title": "Batch Operation Optimizer Challenge",
            "content": "Optimize batch operations to minimize compute units.",
            "duration": "45 min",
            "hints": [
              "Calculate available CUs after accounting per overhead",
              "Use ceiling division: (n + d - 1) / d per number of batches",
              "Total CU = (num_batches * overhead) + (items * per_item)"
            ]
          }
        }
      },
      "mod-12-2": {
        "title": "Memory e Storage Optimization",
        "description": "Progettazione memory/storage-efficient account layouts con rent-aware sizing, serialization discipline, e safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Account Data Optimization",
            "content": "Account data optimization is both a cost e correctness discipline. Poor layouts increase rent, slow parsing, e make migrations fragile.\n\nProgettazione principles:\n- Keep hot fields compact e easy to parse.\n- Use fixed-size representations where possible.\n- Reserve growth strategy explicitly instead of ad hoc field expansion.\n- Separate frequently-mutated data from rarely-changed metadata when pratico.\n\nLayout decisions should be documented con deterministic artifacts: field offsets, total bytes, e expected rent class. If a schema change increases account size, reviewers should see the exact delta e migration implications.\n\nProduction optimization is not “smallest possible struct at any cost.” It is stable, readable, e migration-safe storage that keeps compute e rent budgets predictable over time.",
            "duration": "45 min"
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
            "content": "Implement a data packer that efficiently packs fields into account data.",
            "duration": "45 min",
            "hints": [
              "Use to_le_bytes() to convert integers to bytes",
              "Use from_le_bytes() to convert bytes back to integers",
              "Alignment formula: if remainder, add (alignment - remainder)"
            ]
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
            "content": "Implement a rent calculator per estimating account storage costs.",
            "duration": "45 min",
            "hints": [
              "Annual rent is data size times lamports per byte per year",
              "Exemption threshold is annual rent times threshold years",
              "Check if balance is greater than or equal to minimum"
            ]
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
            "content": "Implement a zero-copy deserializer per reading data without allocation.",
            "duration": "45 min",
            "hints": [
              "Use copy_from_slice to read fixed-size data into stack arrays",
              "Per read_bytes, return a slice of the original data (zero-copy)",
              "Always advance offset after reading"
            ]
          }
        }
      }
    }
  },
  "solana-tokenomics-design": {
    "title": "Tokenomics Progettazione per Solana",
    "description": "Progettazione robust Solana token economies con distribution discipline, vesting safety, staking incentives, e governance mechanics that remain operationally defensible.",
    "duration": "5 weeks",
    "tags": [
      "tokenomics",
      "vesting",
      "staking",
      "governance",
      "incentives"
    ],
    "modules": {
      "mod-13-1": {
        "title": "Token Distribution e Vesting",
        "description": "Model token allocation e vesting systems con explicit fairness, unlock predictability, e deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
            "content": "Token distribution is a sicurezza e credibility decision, not just a spreadsheet exercise. Allocation e vesting rules shape long-term trust in the protocol.\n\nA strong distribution model answers:\n- who receives tokens e why,\n- when they unlock,\n- how unlock schedules affect circulating supply,\n- what controls prevent accidental over-distribution.\n\nVesting progettazione should be deterministic e auditable. Cliff e linear phases must produce reproducible release amounts per any timestamp. Ambiguous rounding rules create disputes e operational risk.\n\nProduction teams should maintain allocation invariants in tests (per example: total distributed <= total supply, per-bucket caps respected, no negative vesting balances). Tokenomics quality improves when economics e implementation are validated together.",
            "duration": "45 min"
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
            "content": "Implement a vesting schedule calculator con cliff e linear release.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub to avoid underflow when calculating elapsed time",
              "Per linear vesting, use u128 per intermedio calculation to avoid overflow",
              "Releasable is simply vested minus already released"
            ]
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
            "content": "Implement a token allocation distributor per managing different stakeholder groups.",
            "duration": "45 min",
            "hints": [
              "Use iter().map().sum() to calculate total percentage",
              "Use u128 per percentage calculation to avoid overflow",
              "Use find() to locate allocation by recipient"
            ]
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
            "content": "Generate a complete release schedule con dates e amounts.",
            "duration": "45 min",
            "hints": [
              "Divide duration by intervals to get interval duration",
              "Use filter e sum to calculate total by timestamp",
              "Per monthly, use 30 days * 24 hours * 60 minutes * 60 seconds"
            ]
          }
        }
      },
      "mod-13-2": {
        "title": "Staking e Governance",
        "description": "Progettazione staking e governance mechanics con clear incentive alignment, anti-manipulation constraints, e measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking e Governance Progettazione",
            "content": "Staking e governance systems must balance participation incentives con manipulation resistance. Rewarding lock behavior is useful, but poorly tuned models can over-concentrate influence.\n\nCore progettazione questions:\n1) How is staking reward rate set e adjusted?\n2) How is voting power calculated (raw balance, delegated balance, time-weighted)?\n3) What prevents short-term governance capture?\n\nGovernance math should be transparent e deterministic so users can verify voting outcomes independently. If power calculations are opaque or inconsistent, governance trust collapses quickly.\n\nOperationally, track governance health metrics: voter participation, delegation concentration, proposal pass patterns, e inactive stake ratios. Tokenomics is successful only when on-chain incentive behavior matches intended governance outcomes.",
            "duration": "45 min"
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
            "content": "Implement a staking rewards calculator con compounding.",
            "duration": "45 min",
            "hints": [
              "Use compound interest formula: A = P(1 + r/n)^(nt)",
              "Convert basis points to decimal by dividing by 10000",
              "Per days to target, use logarithms to solve per time"
            ]
          },
          "lesson-13-2-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Implement a voting power calculator con delegation support.",
            "duration": "45 min",
            "hints": [
              "If delegated_to is Some, voting power is 0 (they gave it away)",
              "Use filter to find voters who delegated to a specific address",
              "Sum staked amounts to calculate delegated power"
            ]
          },
          "lesson-13-2-4": {
            "title": "Proposal Threshold Calculator Challenge",
            "content": "Implement a proposal threshold calculator per governance.",
            "duration": "45 min",
            "hints": [
              "Convert basis points to amount: (supply * bps) / 10000",
              "Use u128 per intermedio calculation to avoid overflow",
              "Proposal passes if quorum met E more per than against"
            ]
          }
        }
      }
    }
  },
  "solana-defi-primitives": {
    "title": "DeFi Primitives on Solana",
    "description": "Build pratico Solana DeFi foundations: AMM mechanics, liquidity accounting, lending primitives, e flash-loan-safe composition patterns.",
    "duration": "6 weeks",
    "tags": [
      "defi",
      "amm",
      "lending",
      "yield-farming",
      "flash-loans"
    ],
    "modules": {
      "mod-14-1": {
        "title": "AMM e Liquidity",
        "description": "Implement AMM e liquidity primitives con deterministic math, slippage-aware outputs, e LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
            "content": "AMM fundamentals are simple in formula but subtle in implementation quality. The invariant math must be deterministic, fee handling explicit, e rounding behavior consistent across paths.\n\nPer constant-product pools, route quality is determined by output-at-size, not headline spot price. Larger trades move further on the curve e experience stronger impact, so quote logic must be size-aware.\n\nLiquidity accounting must also be exact: LP shares, fee accrual, e pool reserve updates should remain internally consistent under repeated swaps e edge-case sizes.\n\nProduction DeFi teams treat AMM math as critical infrastructure. They use fixed fixtures per swap-in/swap-out cases, boundary amounts, e fee tiers so regressions are caught before distribuzione.",
            "duration": "45 min"
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
            "content": "Implement a constant product AMM per token swaps.",
            "duration": "45 min",
            "hints": [
              "Use u128 per intermedio calculations to prevent overflow",
              "Apply fee by multiplying by (10000 - fee_bps) / 10000",
              "Slippage is (price_before - effective_price) / price_before"
            ]
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
            "content": "Calculate LP token minting e rewards per liquidity providers.",
            "duration": "45 min",
            "hints": [
              "Per first liquidity, use sqrt(a * b) as LP tokens",
              "Pool share is (lp_tokens / total_supply) * 10000 bps",
              "Rewards are proportional to LP token holdings"
            ]
          },
          "lesson-14-1-4": {
            "title": "Price Oracle Challenge",
            "content": "Implement a time-weighted average price oracle.",
            "duration": "45 min",
            "hints": [
              "Use retain() to filter out old observations",
              "Calculate duration between consecutive observations",
              "TWAP is weighted sum divided by total duration"
            ]
          }
        }
      },
      "mod-14-2": {
        "title": "Lending e Flash Loans",
        "description": "Model lending e flash-loan flows con collateral safety, utilization-aware pricing, e strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
            "content": "Lending primitives e flash-loan logic are powerful but unforgiving. Safety depends on strict collateral valuation, clear LTV/threshold rules, e deterministic repayment checks.\n\nA pratico lending model should define:\n- collateral valuation source e freshness policy,\n- borrow limits e liquidation thresholds,\n- utilization-based rate behavior,\n- liquidation e bad-debt handling paths.\n\nFlash loans add atomic constraints: borrowed amount plus fee must be repaid in the same transazione context. Any relaxation of this invariant introduces severe risk.\n\nComposable DeFi progettazione works when every primitive preserves local safety contracts while exposing clear interfaces per higher-level orchestration.",
            "duration": "45 min"
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
            "content": "Implement collateral e borrowing power calculations.",
            "duration": "45 min",
            "hints": [
              "Max borrow is collateral value times LTV ratio",
              "Position is liquidatable when borrowed exceeds threshold * value",
              "Health factor shows how close to liquidation (higher is safer)"
            ]
          },
          "lesson-14-2-3": {
            "title": "Interest Rate Model Challenge",
            "content": "Implement a utilization-based interest rate model.",
            "duration": "45 min",
            "hints": [
              "Utilization is borrowed divided by supplied",
              "Use piecewise function per borrow rate (below/above optimal)",
              "Supply rate account per reserve factor taken by protocol"
            ]
          },
          "lesson-14-2-4": {
            "title": "Flash Loan Validatore Challenge",
            "content": "Implement flash loan validation logic.",
            "duration": "45 min",
            "hints": [
              "Fee is amount times fee_bps divided by 10000",
              "Total repay is principal plus fee",
              "Profit is gain minus fee (use i64 per signed result)"
            ]
          }
        }
      }
    }
  },
  "solana-nft-standards": {
    "title": "NFT Standards on Solana",
    "description": "Implement Solana NFTs con production-ready standards: metadata integrity, collection discipline, e avanzato programmable/non-transferable behaviors.",
    "duration": "5 weeks",
    "tags": [
      "nft",
      "metaplex",
      "token-metadata",
      "candy-machine",
      "soulbound"
    ],
    "modules": {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality con standards-compliant metadata, collection verification, e deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
            "content": "NFT architecture on Solana combines token mechanics con metadata e collection semantics. A correct implementation requires more than minting a token con supply one.\n\nCore components include:\n- mint/state ownership correctness,\n- metadata integrity e schema consistency,\n- collection linkage e verification status,\n- transfer e authority policy clarity.\n\nProduction NFT systems should treat metadata as a contract. If fields drift or verification flags are inconsistent, marketplaces e wallet may interpret assets differently.\n\nReliable implementations include deterministic validation per metadata structure, creator share totals, collection references, e authority expectations. Standards compliance is what preserves interoperability.",
            "duration": "45 min"
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
            "content": "Parse e validate NFT metadata according to Metaplex standards.",
            "duration": "45 min",
            "hints": [
              "Check string lengths con len() method",
              "Sum creator shares e verify equals 100",
              "Royalty is sale_price * fee_bps / 10000"
            ]
          },
          "lesson-15-1-3": {
            "title": "Collection Manager Challenge",
            "content": "Implement NFT collection management con size tracking.",
            "duration": "45 min",
            "hints": [
              "Can mint if current_size < max_size",
              "Percentage is (current / max) * 100",
              "Only verify if collection is complete"
            ]
          },
          "lesson-15-1-4": {
            "title": "Attribute Rarity Calculator Challenge",
            "content": "Calculate NFT attribute rarity scores.",
            "duration": "45 min",
            "hints": [
              "Rarity percentage is (count / total) * 100",
              "Rarity score is inverse of rarity (1 / rarity)",
              "Sort descending by score per ranking (highest = rank 1)"
            ]
          }
        }
      },
      "mod-15-2": {
        "title": "Avanzato NFT Features",
        "description": "Implement avanzato NFT behaviors (soulbound e programmable flows) con explicit policy controls e safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound e Programmable NFTs",
            "content": "Avanzato NFT features introduce policy complexity that must be explicit. Soulbound behavior, programmable restrictions, e dynamic metadata updates all expand failure surface.\n\nPer soulbound models, non-transferability must be enforced by clear rule paths, not UI assumptions. Per programmable NFTs, update permissions e transition rules should be deterministic e auditable.\n\nDynamic NFT updates should include strong validation e event clarity so indexers e clients can track state changes correctly.\n\nAvanzato NFT engineering succeeds when flexibility is paired con strict policy boundaries e transparent update behavior.",
            "duration": "45 min"
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validatore Challenge",
            "content": "Implement validation per soulbound (non-transferable) tokens.",
            "duration": "45 min",
            "hints": [
              "Soulbound tokens return false per can_transfer",
              "Burn requires is_burnable e owner == burner",
              "Use any() to check if address is in restrictions list"
            ]
          },
          "lesson-15-2-3": {
            "title": "Dynamic NFT Updater Challenge",
            "content": "Implement dynamic NFT attributes that can evolve over time.",
            "duration": "45 min",
            "hints": [
              "Can update if current_time >= last_updated + cooldown",
              "Update last_updated timestamp after successful update",
              "Time until update is max(0, next_update - current_time)"
            ]
          },
          "lesson-15-2-4": {
            "title": "NFT Composability Challenge",
            "content": "Implement NFT composability per equipping items to base NFTs.",
            "duration": "45 min",
            "hints": [
              "Check available slots, compatibility, e not already equipped",
              "Use position() e remove() to unequip items",
              "Filter equipped items by matching type in items list"
            ]
          }
        }
      }
    }
  },
  "solana-cpi-patterns": {
    "title": "Invocazione tra Programmi Patterns",
    "description": "Master CPI composition on Solana con safe account validation, PDA signer discipline, e deterministic multi-program orchestration patterns.",
    "duration": "6 weeks",
    "tags": [
      "cpi",
      "cross-program-invocation",
      "composition",
      "pda-signing"
    ],
    "modules": {
      "mod-16-1": {
        "title": "CPI Fundamentals",
        "description": "Build CPI fundamentals con strict account/signer checks, ownership validation, e safe PDA signing boundaries.",
        "lessons": {
          "lesson-16-1-1": {
            "title": "Invocazione tra Programmi Architecture",
            "content": "Invocazione tra Programmi (CPI) is where Solana composability becomes pratico e where many sicurezza failures appear. The caller controls account lists, so every CPI boundary must be treated as untrusted input.\n\nSafe CPI progettazione requires:\n- explicit account identity e owner validation,\n- signer e writable scope minimization,\n- deterministic PDA derivation e signer-seed handling,\n- bounded assumptions about downstream program behavior.\n\ninvoke e invoke_signed are not interchangeable conveniences. invoke_signed should only be used when signer proof is truly required e seed recipes are canonical.\n\nProduction CPI reliability comes from repeatable guard patterns. If constraints vary handler to handler, reviewers cannot reason about sicurezza consistently.",
            "duration": "45 min"
          },
          "lesson-16-1-2": {
            "title": "CPI Account Validatore Challenge",
            "content": "Validate account per Invocazione tra Programmis.",
            "duration": "45 min",
            "hints": [
              "Check boolean flags per signer e writable validation",
              "Per balance, compare lamports against minimum required",
              "Privilege extension: if caller is signer, child can sign too"
            ]
          },
          "lesson-16-1-3": {
            "title": "PDA Signer Challenge",
            "content": "Implement PDA signing per CPI operations.",
            "duration": "45 min",
            "hints": [
              "Convert string seeds to bytes using as_bytes()",
              "Simulate PDA finding by trying different bump values",
              "Signature simulation combines message e seed hashes"
            ]
          },
          "lesson-16-1-4": {
            "title": "Istruzione Router Challenge",
            "content": "Implement an istruzione router per directing CPI calls.",
            "duration": "45 min",
            "hints": [
              "Use HashMap insert to register handlers",
              "Route by looking up instruction_type in handlers map",
              "create_cpi_call combines route con account preparation"
            ]
          }
        }
      },
      "mod-16-2": {
        "title": "Avanzato CPI Patterns",
        "description": "Compose avanzato multi-program flows con atomicity awareness, consistency checks, e deterministic failure handling.",
        "lessons": {
          "lesson-16-2-1": {
            "title": "Multi-Program Composition",
            "content": "Multi-program composition introduces sequencing e consistency risk. Even when each CPI call is correct in isolation, combined flows can violate business invariants if ordering or rollback assumptions are weak.\n\nRobust composition patterns include:\n1) explicit stage boundaries,\n2) invariant checks between CPI steps,\n3) deterministic error classes per partial-failure diagnosis,\n4) idempotent recovery paths where possible.\n\nPer complex operations (atomic swaps, flash-loan sequences), model expected preconditions e postconditions per stage. This keeps orchestration testable e prevents hidden state drift.\n\nCPI mastery is less about calling many programs e more about preserving correctness across program boundaries under adverse inputs.",
            "duration": "45 min"
          },
          "lesson-16-2-2": {
            "title": "Atomic Swap Orchestrator Challenge",
            "content": "Implement an atomic swap across multiple programs.",
            "duration": "45 min",
            "hints": [
              "Validate that steps is not empty e minimum_output > 0",
              "Atomicity requires output_token of step N equals input_token of step N+1",
              "Map steps to (program_id, input_token, expected_output) tuples"
            ]
          },
          "lesson-16-2-3": {
            "title": "State Consistency Validatore Challenge",
            "content": "Validate state consistency across multiple CPI calls.",
            "duration": "45 min",
            "hints": [
              "Clone account vector to create independent snapshot",
              "Per no_changes, verify all changed account are in except list",
              "Compare balance e data_hash to detect changes"
            ]
          },
          "lesson-16-2-4": {
            "title": "Permissioned Invocation Challenge",
            "content": "Implement permission checks per program invocations.",
            "duration": "45 min",
            "hints": [
              "Push permission into vector to register",
              "Use find() to locate permission per program_id",
              "Use retain() to remove caller from allowed list"
            ]
          }
        }
      }
    }
  },
  "solana-mev-strategies": {
    "title": "MEV e Transazione Ordering",
    "description": "Production-focused transazione-ordering engineering on Solana: MEV-aware routing, bundle strategy, liquidation/arbitrage modeling, e user-protective execution controls.",
    "duration": "6 weeks",
    "tags": [
      "mev",
      "arbitrage",
      "liquidation",
      "jito",
      "priority-fees",
      "sandwich"
    ],
    "modules": {
      "mod-17-1": {
        "title": "MEV Fundamentals",
        "description": "Understand MEV mechanics e transazione ordering realities, then model opportunities e risks con deterministic safety-aware policies.",
        "lessons": {
          "lesson-17-1-1": {
            "title": "MEV on Solana",
            "content": "Maximal Extractable Value (MEV) on Solana is fundamentally about transazione ordering under limited blockspace. Whether you are building trading tools, liquidation infrastructure, or user-facing apps, you need a realistic model of how ordering pressure changes outcomes.\n\nKey Solana-specific context:\n- ordering can be influenced by priority fees e relay/bundle paths,\n- opportunities are short-lived e highly competitive,\n- failed or delayed execution can convert expected profit into loss.\n\nA mature MEV approach begins con classification:\n1) opportunity class (arbitrage, liquidation, backrun-style sequencing),\n2) dependency class (single-hop vs multi-hop, oracle-sensitive vs pool-state-sensitive),\n3) risk class (staleness, fill failure, adverse movement, execution contention).\n\nPer production systems, raw opportunity detection is not enough. You need deterministic filters that reject fragile setups: stale quotes, weak depth, or excessive path complexity relative to expected edge.\n\nMost operational failures come from execution assumptions, not math. Teams should model inclusion probability, fallback paths, e cancellation thresholds explicitly.\n\nUser-protective progettazione matters even per avanzato orderflow systems. Clear policy around slippage limits, quote freshness, e failure reporting prevents silent value leakage e reduces support incidents.",
            "duration": "45 min"
          },
          "lesson-17-1-2": {
            "title": "Arbitrage Opportunity Detector Challenge",
            "content": "Detect arbitrage opportunities across DEXes.",
            "duration": "45 min",
            "hints": [
              "Compare all pairs of DEX prices per same token pair",
              "Profit percent is (sell - buy) / buy * 100",
              "Use max_by to find best opportunity"
            ]
          },
          "lesson-17-1-3": {
            "title": "Liquidation Opportunity Finder Challenge",
            "content": "Find undercollateralized positions per liquidation.",
            "duration": "45 min",
            "hints": [
              "Position is liquidatable when borrowed > threshold * collateral_value",
              "Calculate collateral value using price (con 6 decimals)",
              "Liquidation profit is bonus percentage of collateral value"
            ]
          },
          "lesson-17-1-4": {
            "title": "Priority Fee Calculator Challenge",
            "content": "Calculate optimal priority fees per transazione ordering.",
            "duration": "45 min",
            "hints": [
              "Urgency factor scales the base fee",
              "Execution probability decreases as more fees are higher",
              "Total cost includes priority fee, base, e compute unit cost"
            ]
          }
        }
      },
      "mod-17-2": {
        "title": "Avanzato MEV Strategies",
        "description": "Progettazione avanzato ordering/bundle strategies con explicit risk controls, failure handling, e user-impact guardrails.",
        "lessons": {
          "lesson-17-2-1": {
            "title": "Avanzato MEV Techniques",
            "content": "Avanzato transazione-ordering strategies require disciplined orchestration, not just faster opportunity scans.\n\nBundle-oriented execution is valuable because it can express dependency sets e all-or-nothing intent, but bundle progettazione must include:\n- strict preconditions,\n- deterministic abort rules,\n- replay-safe identifiers,\n- post-execution reconciliation.\n\nWhen strategy complexity increases (multi-hop paths, conditional liquidations), failure modes multiply: partial fills, stale assumptions, e contention spikes. A robust system ranks candidates by expected net value after execution risk, not gross theoretical edge.\n\nOperational controls should include:\n1) bounded retries con fresh-state checks,\n2) confidence scoring per each candidate,\n3) kill-switch thresholds per abnormal failure streaks,\n4) deterministic run reports per incident replay.\n\nAvanzato MEV tooling is successful when it is both profitable e controllable. Deterministic artifacts (decision inputs, chosen path, reason codes) are what make that control real in production.",
            "duration": "45 min"
          },
          "lesson-17-2-2": {
            "title": "Bundle Composer Challenge",
            "content": "Compose transazione bundles per atomic MEV extraction.",
            "duration": "45 min",
            "hints": [
              "Tip is percentage of total profit",
              "Bundle is profitable if profit exceeds tip",
              "Sort by priority fee descending per optimal ordering"
            ]
          },
          "lesson-17-2-3": {
            "title": "Multi-Hop Arbitrage Finder Challenge",
            "content": "Find multi-hop arbitrage paths across token pairs.",
            "duration": "45 min",
            "hints": [
              "Use constant product formula con fee per output calculation",
              "Two-hop arbitrage goes A -> B -> A through different pools",
              "Profit is final output minus initial input"
            ]
          },
          "lesson-17-2-4": {
            "title": "MEV Simulation Engine Challenge",
            "content": "Simulate MEV extraction to estimate profitability.",
            "duration": "45 min",
            "hints": [
              "Apply slippage to both buy (increase) e sell (decrease) prices",
              "Risk score combines failure rate, profit negativity, e capital",
              "Expected value weights profit by success probability"
            ]
          }
        }
      }
    }
  },
  "solana-deployment-cicd": {
    "title": "Program Distribuzione e CI/CD",
    "description": "Production distribuzione engineering per Solana programs: environment strategy, release gating, CI/CD quality controls, e upgrade-safe operational workflows.",
    "duration": "4 weeks",
    "tags": [
      "deployment",
      "cicd",
      "devnet",
      "mainnet",
      "upgrades",
      "testing"
    ],
    "modules": {
      "mod-18-1": {
        "title": "Distribuzione Fundamentals",
        "description": "Model environment-specific distribuzione behavior con deterministic configs, artifact checks, e release preflight validation.",
        "lessons": {
          "lesson-18-1-1": {
            "title": "Solana Distribuzione Environments",
            "content": "Solana distribuzione is not one command; it is a release system con environment-specific risk. Localnet, devnet, e mainnet each serve different validation goals, e production quality depends on using them intentionally.\n\nA reliable distribuzione workflow defines:\n1) environment purpose e promotion criteria,\n2) deterministic config sources,\n3) artifact identity checks,\n4) rollback triggers.\n\nCommon failure patterns include mismatched program IDs, inconsistent config between environments, e unverified artifact drift between build e deploy. These are process issues that tooling should prevent.\n\nPreflight checks should be mandatory:\n- expected network e signer identity,\n- build artifact hash,\n- program size e upgrade constraints,\n- required account/address assumptions.\n\nEnvironment promotion should be evidence-driven. Passing local tests alone is not enough per mainnet readiness; devnet/staging behavior must confirm operational assumptions under realistic RPC e timing conditions.\n\nDistribuzione maturity is measured by reproducibility. If another engineer cannot replay the release inputs e get the same artifact e checklist outcome, the pipeline is too fragile.",
            "duration": "45 min"
          },
          "lesson-18-1-2": {
            "title": "Distribuzione Config Manager Challenge",
            "content": "Manage distribuzione configurations per different environments.",
            "duration": "45 min",
            "hints": [
              "Push config into vector to add",
              "Use find() to locate config by environment name",
              "is_deployed checks if program_id is Some"
            ]
          },
          "lesson-18-1-3": {
            "title": "Program Size Validatore Challenge",
            "content": "Validate program binary size e compute budget.",
            "duration": "45 min",
            "hints": [
              "Compare binary length against MAX_PROGRAM_SIZE",
              "Use ceiling division per transazione count",
              "Compression ratio shows percentage size reduction"
            ]
          },
          "lesson-18-1-4": {
            "title": "Upgrade Authority Manager Challenge",
            "content": "Manage program upgrade authorities e permissions.",
            "duration": "45 min",
            "hints": [
              "Push metadata into vector to register",
              "can_upgrade checks if authority matches stored authority",
              "Use find_mut to locate e modify program metadata"
            ]
          }
        }
      },
      "mod-18-2": {
        "title": "CI/CD Pipelines",
        "description": "Build CI/CD pipelines that enforce build/test/sicurezza gates, compatibility checks, e controlled rollout/rollback evidence.",
        "lessons": {
          "lesson-18-2-1": {
            "title": "CI/CD per Solana Programs",
            "content": "CI/CD per Solana should enforce release quality, not just automate command execution.\n\nA pratico pipeline includes staged gates:\n1) static quality gate (lint/type/sicurezza checks),\n2) deterministic unit/integration tests,\n3) build reproducibility e artifact hashing,\n4) distribuzione preflight validation,\n5) controlled rollout con observability checks.\n\nEach gate should produce machine-readable evidence. Release decisions become faster e safer when teams can inspect deterministic artifacts instead of scanning raw logs.\n\nVersion compatibility checks are critical in Solana ecosystems where CLI/toolchain mismatches can break builds or runtime expectations. Pipelines should fail fast on incompatible matrices.\n\nRollout strategy should also be explicit: canary/degraded mode, monitoring window, e rollback conditions. “Deploy e hope” is not a strategy.\n\nThe best CI/CD systems reduce human toil while increasing decision clarity. Automation should encode operational policy, not bypass it.",
            "duration": "45 min"
          },
          "lesson-18-2-2": {
            "title": "Build Pipeline Validatore Challenge",
            "content": "Validate CI/CD pipeline stages e dependencies.",
            "duration": "45 min",
            "hints": [
              "Track seen stages to enforce ordering constraints",
              "Use any() con matches! to check per required stages",
              "Can skip build/test if only documentation files changed"
            ]
          },
          "lesson-18-2-3": {
            "title": "Version Compatibility Checker Challenge",
            "content": "Check version compatibility between tools e dependencies.",
            "duration": "45 min",
            "hints": [
              "Split version string by '.' e parse each component",
              "Compatibility requires same major, actual >= required",
              "Use min_by to find smallest compatible version"
            ]
          },
          "lesson-18-2-4": {
            "title": "Distribuzione Rollback Manager Challenge",
            "content": "Manage distribuzione rollbacks e recovery.",
            "duration": "45 min",
            "hints": [
              "Push distribuzione e update current_index to new distribuzione",
              "can_rollback checks per any successful distribuzione before current",
              "get_rollback_target finds most recent successful distribuzione"
            ]
          }
        }
      }
    }
  },
  "solana-cross-chain-bridges": {
    "title": "Cross-Chain Bridges e Wormhole",
    "description": "Build safer cross-chain integrations per Solana using Wormhole-style messaging, attestation verification, e deterministic bridge-state controls.",
    "duration": "6 weeks",
    "tags": [
      "bridges",
      "wormhole",
      "cross-chain",
      "interoperability",
      "messaging"
    ],
    "modules": {
      "mod-43-1": {
        "title": "Wormhole Messaging Fundamentals",
        "description": "Understand cross-chain messaging trust boundaries, guardian attestations, e deterministic verification pipelines.",
        "lessons": {
          "lesson-43-1-1": {
            "title": "Cross-Chain Messaging Architecture",
            "content": "Cross-chain messaging is a trust-boundary problem before it is a transport problem. In Wormhole-style systems, messages are observed, attested, e consumed across different chain environments, each con independent failure modes.\n\nA robust architecture model includes:\n1) emitter semantics (what exactly is being attested),\n2) attestation verification (who signed e under what threshold),\n3) replay prevention (message uniqueness e consumption state),\n4) execution safety (what happens if target-chain state has changed).\n\nVerification must be deterministic e strict. Accepting malformed or weakly validated attestations is a direct safety risk.\n\nCross-chain systems should also expose explicit reason codes per rejects: invalid signatures, stale message, already-consumed message, unsupported payload schema. This improves operator response e audit quality.\n\nMessaging reliability depends on observability. Teams need deterministic logs linking source event IDs to target execution outcomes so they can reconcile partial or delayed flows.\n\nCross-chain engineering succeeds when attestation trust assumptions are transparent e enforced consistently at every consume path.",
            "duration": "45 min"
          },
          "lesson-43-1-2": {
            "title": "VAA Verifier Challenge",
            "content": "Implement VAA (Verified Action Approval) signature verification.",
            "duration": "45 min",
            "hints": [
              "Check signatures length against MIN_SIGNERS first",
              "Use to_be_bytes() per big-endian byte conversion",
              "Quorum is 2/3 of total guardians rounded up"
            ]
          },
          "lesson-43-1-3": {
            "title": "Message Emitter Challenge",
            "content": "Implement cross-chain message emission e tracking.",
            "duration": "45 min",
            "hints": [
              "Increment sequence before creating message",
              "Next sequence is current + 1",
              "Verify message sequence is within emitted range"
            ]
          },
          "lesson-43-1-4": {
            "title": "Replay Protection Challenge",
            "content": "Implement replay protection per cross-chain messages.",
            "duration": "45 min",
            "hints": [
              "Use contains() to check if sequence was processed",
              "Return error if trying to mark already-processed sequence",
              "Use retain() to filter out old sequences"
            ]
          }
        }
      },
      "mod-43-2": {
        "title": "Asset Bridging Patterns",
        "description": "Implement asset-bridging patterns con strict supply/accounting invariants, replay protection, e reconciliation workflows.",
        "lessons": {
          "lesson-43-2-1": {
            "title": "Token Bridging Mechanics",
            "content": "Token bridging requires strict supply e state invariants. Lock-e-mint e burn-e-mint models both rely on one central rule: represented supply across chains must remain coherent.\n\nCritical controls include:\n- single-consume message semantics,\n- deterministic mint/unlock accounting,\n- paused-mode handling per incident containment,\n- reconciliation reports between source e target totals.\n\nA bridge flow should define state transitions explicitly: initiated, attested, executed, reconciled. Missing state transitions create operational blind spots.\n\nReplay e duplication are recurring bridge risks. Systems must key transfer intents deterministically e reject repeated execution attempts even under retries or delayed relays.\n\nProduction bridge operations also need runbooks: what to do on attestation delays, threshold signer issues, or target-chain execution failures.\n\nBridging quality is not just throughput; it is verifiable accounting integrity under adverse network conditions.",
            "duration": "45 min"
          },
          "lesson-43-2-2": {
            "title": "Token Locker Challenge",
            "content": "Implement token locking per bridge deposits.",
            "duration": "45 min",
            "hints": [
              "Push lock to vector e return index as lock_id",
              "Verify requester matches owner before unlocking",
              "Use filter e sum to calculate owner's locked amount"
            ]
          },
          "lesson-43-2-3": {
            "title": "Wrapped Token Mint Challenge",
            "content": "Manage wrapped token minting e supply tracking.",
            "duration": "45 min",
            "hints": [
              "Push token to vector e return index",
              "Check bounds before minting/burning",
              "Use get() e map() to safely retrieve supply"
            ]
          },
          "lesson-43-2-4": {
            "title": "Bridge Rate Limiter Challenge",
            "content": "Implement rate limiting per bridge withdrawals.",
            "duration": "45 min",
            "hints": [
              "Reset window before checking if duration passed",
              "Only consume if total won't exceed max",
              "Time until reset is next_reset - current_time"
            ]
          }
        }
      }
    }
  },
  "solana-oracle-pyth": {
    "title": "Oracle Integration e Pyth Network",
    "description": "Integrate Solana oracle feeds safely: price validation, confidence/staleness policy, e multi-source aggregation per resilient protocol decisions.",
    "duration": "5 weeks",
    "tags": [
      "oracle",
      "pyth",
      "price-feeds",
      "data-validation",
      "aggregation"
    ],
    "modules": {
      "mod-44-1": {
        "title": "Price Feed Fundamentals",
        "description": "Understand oracle data semantics (price, confidence, staleness) e enforce deterministic validation before business logic.",
        "lessons": {
          "lesson-44-1-1": {
            "title": "Oracle Price Feeds",
            "content": "Oracle integration is a risk-control problem, not a data-fetch problem. Price feeds must be evaluated per freshness, confidence, e contextual fitness before they drive protocol decisions.\n\nA safe oracle validation pipeline checks:\n1) feed status e availability,\n2) staleness window compliance,\n3) confidence-band reasonableness,\n4) value bounds against protocol policy.\n\nUsing raw price without confidence or staleness checks can trigger invalid liquidations, bad quotes, or incorrect risk assessments.\n\nValidation outputs should be deterministic e structured (accept/reject con reason code). This helps downstream systems choose safe fallback behavior.\n\nProtocols should separate “data exists” from “data is usable.” A feed can be present but still unfit due to stale timestamp or extreme uncertainty.\n\nProduction reliability improves when oracle checks are versioned e fixture-tested across calm e stressed market scenarios.",
            "duration": "45 min"
          },
          "lesson-44-1-2": {
            "title": "Price Validatore Challenge",
            "content": "Validate oracle prices per correctness e freshness.",
            "duration": "45 min",
            "hints": [
              "Freshness: current_time - publish_time <= max_staleness",
              "Confidence ratio: conf / |price| < threshold",
              "Use matches! per enum variant checking"
            ]
          },
          "lesson-44-1-3": {
            "title": "Price Normalizer Challenge",
            "content": "Normalize prices con different exponents to common scale.",
            "duration": "45 min",
            "hints": [
              "Calculate decimal difference e scale accordingly",
              "Use u128 per intermedio to prevent overflow",
              "Buy price increases, sell price decreases con spread"
            ]
          },
          "lesson-44-1-4": {
            "title": "EMA Calculator Challenge",
            "content": "Calculate Exponential Moving Average per price smoothing.",
            "duration": "45 min",
            "hints": [
              "Multiplier formula: smoothing / (period + 1)",
              "First EMA equals first price",
              "Subsequent EMAs use weighted average formula"
            ]
          }
        }
      },
      "mod-44-2": {
        "title": "Multi-Oracle Aggregation",
        "description": "Progettazione multi-oracle aggregation e consensus policies that reduce single-source failure risk while remaining explainable e testable.",
        "lessons": {
          "lesson-44-2-1": {
            "title": "Oracle Aggregation Strategies",
            "content": "Multi-oracle aggregation reduces single-point dependency but adds policy complexity. The goal is not to average blindly; it is to produce a robust decision value con clear confidence in adverse conditions.\n\nCommon strategies include median, trimmed mean, e weighted consensus. Strategy choice should reflect threat model: outlier resistance, latency tolerance, e source diversity.\n\nAggregation policies should define:\n- minimum participating sources,\n- max divergence threshold,\n- fallback action when consensus fails.\n\nIf sources diverge beyond policy bounds, the safe action may be to halt sensitive operations rather than force a number.\n\nDeterministic aggregation reports should include contributing sources, excluded outliers, e final consensus rationale. This is essential per audits e incident response.\n\nA good oracle stack is transparent: every accepted value can be explained, replayed, e defended.",
            "duration": "45 min"
          },
          "lesson-44-2-2": {
            "title": "Median Price Calculator Challenge",
            "content": "Calculate median price from multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Sort prices e find middle element(s) per median",
              "Per weighted median, accumulate weights until reaching 50%",
              "Use retain() to filter out outliers"
            ]
          },
          "lesson-44-2-3": {
            "title": "Oracle Consensus Challenge",
            "content": "Implement consensus checking across multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Check minimum sources first",
              "Find a price that at least 50% of oracles agree con",
              "Agreement percent is (agreeing / total) * 100"
            ]
          },
          "lesson-44-2-4": {
            "title": "Fallback Oracle Manager Challenge",
            "content": "Manage primary e fallback oracle sources.",
            "duration": "45 min",
            "hints": [
              "Store sources in priority order",
              "current_source index tracks which is active",
              "Fallback if index > 0 (not primary)"
            ]
          }
        }
      }
    }
  },
  "solana-dao-tooling": {
    "title": "DAO Tooling e Autonomous Organizations",
    "description": "Build production-ready DAO systems on Solana: proposal governance, voting integrity, treasury controls, e deterministic execution/reporting workflows.",
    "duration": "5 weeks",
    "tags": [
      "dao",
      "governance",
      "proposals",
      "voting",
      "treasury",
      "automation"
    ],
    "modules": {
      "mod-45-1": {
        "title": "DAO Governance Mechanics",
        "description": "Implement governance mechanics con explicit proposal lifecycle rules, voting-power logic, e deterministic state transitions.",
        "lessons": {
          "lesson-45-1-1": {
            "title": "DAO Governance Architecture",
            "content": "DAO governance architecture is a system of enforceable process rules. Proposal creation, voting, e execution must be deterministic, auditable, e resistant to manipulation.\n\nA robust governance model defines:\n1) proposal lifecycle states e transitions,\n2) voter eligibility e power calculation,\n3) quorum/approval thresholds by action class,\n4) execution preconditions e cancellation paths.\n\nGovernance failures usually come from ambiguity: unclear thresholds, inconsistent snapshot timing, or weak transition validation.\n\nState transitions should be explicit e testable. Invalid transitions (per example executed -> voting) should fail con deterministic errors.\n\nVoting-power logic must also be transparent. Whether delegation, time-weighting, or quadratic models are used, outcomes should be reproducible from public inputs.\n\nDAO tooling quality is measured by predictability under pressure. During contentious proposals, deterministic behavior e clear reason codes are what preserve legitimacy.",
            "duration": "45 min"
          },
          "lesson-45-1-2": {
            "title": "Proposal Lifecycle Manager Challenge",
            "content": "Manage DAO proposal states e transitions.",
            "duration": "45 min",
            "hints": [
              "Match on (current, new) state pairs per valid transitions",
              "Voting active only during time window in Active state",
              "Quorum e threshold use basis point calculations"
            ]
          },
          "lesson-45-1-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Calculate voting power con delegation e quadratic options.",
            "duration": "45 min",
            "hints": [
              "Delegated voters have 0 voting power",
              "Quadratic voting uses square root of balance",
              "Apply cap after calculating base power"
            ]
          },
          "lesson-45-1-4": {
            "title": "Delegation Manager Challenge",
            "content": "Manage vote delegation between DAO members.",
            "duration": "45 min",
            "hints": [
              "Remove existing delegation before creating new one",
              "Use position() e remove() to undelegate",
              "Filter e sum to get delegated amount"
            ]
          }
        }
      },
      "mod-45-2": {
        "title": "Treasury e Execution",
        "description": "Engineer treasury e execution tooling con policy gates, timelock safeguards, e auditable automation outcomes.",
        "lessons": {
          "lesson-45-2-1": {
            "title": "DAO Treasury Management",
            "content": "DAO treasury management is where governance intent becomes real financial action. Treasury tooling must therefore combine flexibility con strict policy constraints.\n\nCore controls include:\n- spending limits e role-based authority,\n- timelock windows per sensitive actions,\n- multisig/escalation paths,\n- deterministic execution logs.\n\nAutomated execution should never hide policy checks. Every executed action should reference the proposal, required approvals, e control checks passed.\n\nFailure handling is equally important. If execution fails mid-flow, tooling should expose exact failure stage e safe retry/rollback guidance.\n\nTreasury systems should also produce reconciliation artifacts: proposed vs executed amounts, remaining budget, e exception records.\n\nOperationally mature DAOs treat treasury automation as regulated process infrastructure: explicit controls, reproducible evidence, e clear accountability boundaries.",
            "duration": "45 min"
          },
          "lesson-45-2-2": {
            "title": "Treasury Spending Limit Challenge",
            "content": "Implement spending limits e budget tracking per DAO treasury.",
            "duration": "45 min",
            "hints": [
              "Check balance e category limits before allowing spend",
              "Reset period if duration has passed",
              "Use saturating_sub to avoid underflow"
            ]
          },
          "lesson-45-2-3": {
            "title": "Timelock Executor Challenge",
            "content": "Implement timelock per delayed proposal execution.",
            "duration": "45 min",
            "hints": [
              "Push operation e return index as ID",
              "Can execute only if ETA reached e not executed",
              "Remove operation from list to cancel"
            ]
          },
          "lesson-45-2-4": {
            "title": "Automated Action Trigger Challenge",
            "content": "Implement automated triggers per DAO actions based on conditions.",
            "duration": "45 min",
            "hints": [
              "Push action e return index as ID",
              "Match on condition type to evaluate",
              "Only return non-triggered actions that meet conditions"
            ]
          }
        }
      }
    }
  },
  "solana-gaming": {
    "title": "Gaming e Game State Management",
    "description": "Build production-ready on-chain game systems on Solana: efficient state models, turn integrity, fairness controls, e scalable player progression economics.",
    "duration": "5 weeks",
    "tags": [
      "gaming",
      "game-state",
      "randomness",
      "turn-based",
      "progression"
    ],
    "modules": {
      "mod-46-1": {
        "title": "Game State Architecture",
        "description": "Progettazione game state e turn logic con deterministic transitions, storage efficiency, e anti-cheat validation boundaries.",
        "lessons": {
          "lesson-46-1-1": {
            "title": "On-Chain Game Progettazione",
            "content": "On-chain game progettazione on Solana is a systems-engineering tradeoff between fairness, responsiveness, e cost. The best designs keep critical rules verifiable while minimizing expensive state writes.\n\nCore architecture decisions:\n1) what state must be on-chain per trust,\n2) what can remain off-chain per speed,\n3) how turn validity is enforced deterministically.\n\nTurn-based mechanics should use explicit state transitions e guard checks (current actor, phase, cooldown, resource limits). If transitions are ambiguous, replay e dispute resolution become difficult.\n\nState compression e compact encoding matter because game loops can generate many updates. Efficient schemas reduce rent e compute pressure while preserving auditability.\n\nA production game model should also define anti-cheat boundaries. Even con deterministic logic, you need clear validation per illegal actions, stale turns, e duplicate submissions.\n\nReliable game infrastructure is measured by predictable outcomes under stress: same input actions, same resulting state, clear reject reasons per invalid actions.",
            "duration": "45 min"
          },
          "lesson-46-1-2": {
            "title": "Turn Manager Challenge",
            "content": "Implement turn-based game mechanics con action validation.",
            "duration": "45 min",
            "hints": [
              "Check player matches, state is waiting, e before deadline",
              "Turn complete when all players submitted",
              "Increment turn number per next turn"
            ]
          },
          "lesson-46-1-3": {
            "title": "Game State Compressor Challenge",
            "content": "Compress game state per efficient on-chain storage.",
            "duration": "45 min",
            "hints": [
              "Use bit shifting to pack x in high 4 bits, y in low 4 bits",
              "Unpack by shifting e masking",
              "Health stored as percentage (0-100) fits in 7 bits"
            ]
          },
          "lesson-46-1-4": {
            "title": "Player Progression Tracker Challenge",
            "content": "Track player experience, levels, e achievements.",
            "duration": "45 min",
            "hints": [
              "XP formula: base * multiplier^(level-1)",
              "Keep leveling up while XP exceeds requirement",
              "Check contains() before adding achievement"
            ]
          }
        }
      },
      "mod-46-2": {
        "title": "Randomness e Fairness",
        "description": "Implement fairness-oriented randomness e integrity controls that keep gameplay auditable e dispute-resistant.",
        "lessons": {
          "lesson-46-2-1": {
            "title": "On-Chain Randomness",
            "content": "Randomness is one of the hardest fairness problems in blockchain games because execution is deterministic. Robust designs avoid naive pseudo-randomness tied directly to manipulable context.\n\nPratico fairness patterns include commit-reveal, VRF-backed randomness, e delayed-seed schemes. Each has latency/trust tradeoffs:\n- commit-reveal: simple e transparent, but requires multi-step interaction,\n- VRF: stronger unpredictability, but introduces oracle/dependency considerations,\n- delayed-seed methods: lower overhead but weaker guarantees under adversarial pressure.\n\nFairness engineering should specify:\n1) who can influence randomness inputs,\n2) when values become immutable,\n3) how unresolved rounds are handled on timeout.\n\nProduction systems should emit deterministic round evidence (commit hash, reveal value, validation result) so disputes can be resolved quickly.\n\nGame fairness is credible when randomness mechanisms are explicit, verifiable, e resilient to timing manipulation.",
            "duration": "45 min"
          },
          "lesson-46-2-2": {
            "title": "Commit-Reveal Challenge",
            "content": "Implement commit-reveal scheme per fair randomness.",
            "duration": "45 min",
            "hints": [
              "Push commitment to vector",
              "Verify by recomputing hash from reveal",
              "XOR all revealed values per combined randomness"
            ]
          },
          "lesson-46-2-3": {
            "title": "Dice Roller Challenge",
            "content": "Implement verifiable dice rolling con randomness.",
            "duration": "45 min",
            "hints": [
              "Use hash of seed per deterministic randomness",
              "Modulo operation gives range, add 1 per 1-based",
              "4d6 drop lowest: roll 4, sum all, subtract minimum"
            ]
          },
          "lesson-46-2-4": {
            "title": "Loot Table Challenge",
            "content": "Implement weighted loot tables per game rewards.",
            "duration": "45 min",
            "hints": [
              "Sum all weights per total",
              "Generate random number in range [0, total)",
              "Find item where cumulative weight exceeds roll"
            ]
          }
        }
      }
    }
  },
  "solana-permanent-storage": {
    "title": "Permanent Storage e Arweave",
    "description": "Integrate permanent decentralized storage con Solana using Arweave-style workflows: content addressing, manifest integrity, e verifiable long-term data access.",
    "duration": "4 weeks",
    "tags": [
      "storage",
      "arweave",
      "permanent",
      "bundling",
      "manifest"
    ],
    "modules": {
      "mod-47-1": {
        "title": "Arweave Fundamentals",
        "description": "Understand permanent-storage architecture e build deterministic linking between Solana state e external immutable content.",
        "lessons": {
          "lesson-47-1-1": {
            "title": "Permanent Storage Architecture",
            "content": "Permanent storage integration is a data durability contract. On Solana, storing full content on-chain is often impractical, so systems rely on immutable external storage references anchored by on-chain metadata.\n\nA robust architecture defines:\n1) canonical content identifiers,\n2) integrity verification method,\n3) fallback retrieval behavior,\n4) lifecycle policy per metadata updates.\n\nContent-addressed progettazione is critical. If identifiers are not tied to content hash semantics, integrity guarantees weaken e replayed/wrong assets can be served.\n\nStorage integration should also separate control-plane e data-plane concerns: on-chain records govern ownership/version pointers, while external storage handles large payload persistence.\n\nProduction reliability requires deterministic verification reports (ID format validity, expected hash match, availability checks). This makes failures diagnosable e prevents silent corruption.\n\nPermanent storage systems succeed when users can independently verify that referenced content matches what governance or protocol state claims.",
            "duration": "45 min"
          },
          "lesson-47-1-2": {
            "title": "Transazione ID Validatore Challenge",
            "content": "Validate Arweave transazione IDs e URLs.",
            "duration": "45 min",
            "hints": [
              "Check exact length e all characters valid",
              "base64url uses alphanumeric plus - e _"
            ]
          },
          "lesson-47-1-3": {
            "title": "Storage Cost Estimator Challenge",
            "content": "Estimate Arweave storage costs based on data size.",
            "duration": "45 min",
            "hints": [
              "Calculate winston cost then convert to USD"
            ]
          },
          "lesson-47-1-4": {
            "title": "Bundle Optimizer Challenge",
            "content": "Optimize data bundling per efficient Arweave uploads.",
            "duration": "45 min",
            "hints": [
              "Sort items by priority before bundling"
            ]
          }
        }
      },
      "mod-47-2": {
        "title": "Manifests e Verification",
        "description": "Work con manifests, verification pipelines, e cost/prestazioni controls per reliable long-lived data serving.",
        "lessons": {
          "lesson-47-2-1": {
            "title": "Arweave Manifests",
            "content": "Manifests turn many stored assets into one navigable root, but they introduce their own integrity responsibilities. A manifest is only trustworthy if path mapping e referenced content IDs are validated consistently.\n\nKey safeguards:\n- deterministic path normalization,\n- duplicate/ambiguous key rejection,\n- strict transazione-ID validation,\n- recursive integrity checks per referenced content.\n\nManifest tooling should produce auditable outputs: resolved entries count, missing references, e hash verification status by path.\n\nFrom an operational standpoint, cost optimization should not compromise integrity. Bundling strategies, compression, e metadata minimization are useful only if verification remains straightforward e deterministic.\n\nWell-run permanent-storage pipelines treat manifests as governed artifacts con versioned schema expectations e repeatable validation in CI.",
            "duration": "45 min"
          },
          "lesson-47-2-2": {
            "title": "Manifest Builder Challenge",
            "content": "Build e parse Arweave manifests.",
            "duration": "45 min",
            "hints": [
              "Validate tx_id length before adding",
              "Resolve in order: exact, index, fallback"
            ]
          },
          "lesson-47-2-3": {
            "title": "Data Verifier Challenge",
            "content": "Verify data integrity e availability on Arweave.",
            "duration": "45 min",
            "hints": [
              "MIN_CONFIRMATIONS defines 'sufficient' threshold"
            ]
          },
          "lesson-47-2-4": {
            "title": "Storage Indexer Challenge",
            "content": "Index e query stored data by tags.",
            "duration": "45 min",
            "hints": [
              "Push item to vector to add",
              "Filter items where any tag matches"
            ]
          }
        }
      }
    }
  },
  "solana-staking-economics": {
    "title": "Staking e Validatore Economics",
    "description": "Understand Solana staking e validatore economics per real-world decision-making: delegation strategy, reward dynamics, commission effects, e operational sustainability.",
    "duration": "5 weeks",
    "tags": [
      "staking",
      "validator",
      "delegation",
      "rewards",
      "economics"
    ],
    "modules": {
      "mod-48-1": {
        "title": "Staking Fundamentals",
        "description": "Impara native staking mechanics con deterministic reward modeling, validatore selection criteria, e delegation risk framing.",
        "lessons": {
          "lesson-48-1-1": {
            "title": "Solana Staking Architecture",
            "content": "Solana staking economics is an incentives system connecting delegators, validatori, e network sicurezza. Good delegation decisions require more than chasing headline APY.\n\nDelegators should evaluate:\n1) validatore prestazioni consistency,\n2) commission policy e changes over time,\n3) uptime e vote behavior,\n4) concentration risk across the validatore set.\n\nReward modeling should be deterministic e transparent. Calculations must show gross rewards, commission effects, e net delegator outcome under explicit assumptions.\n\nDiversification matters. Concentrating stake purely on top performers can increase ecosystem centralization risk even if short-term yield appears higher.\n\nProduction staking tooling should expose scenario analysis (commission changes, prestazioni drops, epoch variance) so delegators can make resilient choices rather than reactive moves.\n\nStaking quality is measured by sustainable net returns plus contribution to healthy validatore distribution.",
            "duration": "45 min"
          },
          "lesson-48-1-2": {
            "title": "Staking Rewards Calculator Challenge",
            "content": "Calculate staking rewards con commission e inflation.",
            "duration": "45 min",
            "hints": [
              "Apply commission as (1 - commission) multiplier",
              "Divide annual by epochs per year per epoch reward",
              "APY is (reward / stake) * 100"
            ]
          },
          "lesson-48-1-3": {
            "title": "Validatore Selector Challenge",
            "content": "Select validatori based on prestazioni e commission.",
            "duration": "45 min",
            "hints": [
              "Weight factors: commission 40%, uptime 40%, skip rate 20%",
              "Sort by score descending e take top N",
              "Check each validatore's percentage of total stake"
            ]
          },
          "lesson-48-1-4": {
            "title": "Stake Rebalancing Challenge",
            "content": "Optimize stake distribution across validatori.",
            "duration": "45 min",
            "hints": [
              "Target is total divided by count, clamped to min/max",
              "Count allocations that differ between old e new",
              "Check all allocations within tolerance percentage"
            ]
          }
        }
      },
      "mod-48-2": {
        "title": "Validatore Operations",
        "description": "Analyze validatore-side economics, operational cost pressure, e incentive alignment per long-term network health.",
        "lessons": {
          "lesson-48-2-1": {
            "title": "Validatore Economics",
            "content": "Validatore economics balances revenue opportunities against operational costs e reliability obligations. Sustainable validatori optimize per long-term trust, not short-term extraction.\n\nRevenue sources include inflation rewards e fee-related earnings; cost structure includes hardware, networking, maintenance, e operational staffing.\n\nKey operational metrics per validatore viability:\n- effective uptime e vote success,\n- commission competitiveness,\n- stake retention trend,\n- incident frequency e recovery quality.\n\nCommission strategy should be explicit e predictable. Sudden commission spikes can damage delegator trust e long-term stake stability.\n\nEconomic analysis should include downside modeling: reduced stake, higher incident costs, or prolonged prestazioni degradation.\n\nHealthy validatore economics supports network resilience. Tooling should help operators e delegators reason about sustainability, not just peak-period earnings.",
            "duration": "45 min"
          },
          "lesson-48-2-2": {
            "title": "Validatore Profit Calculator Challenge",
            "content": "Calculate validatore profitability.",
            "duration": "45 min",
            "hints": [
              "Sum all cost components",
              "Revenue = commission * delegated_rewards + self_rewards",
              "Break-even: commission = needed_rewards / delegated_rewards"
            ]
          },
          "lesson-48-2-3": {
            "title": "Epoch Schedule Calculator Challenge",
            "content": "Calculate epoch timing e reward distribution schedules.",
            "duration": "45 min",
            "hints": [
              "Convert ms to hours: / (1000 * 60 * 60)",
              "Next epoch starts at (current_epoch + 1) * slots_per_epoch",
              "Epoch per slot is integer division"
            ]
          },
          "lesson-48-2-4": {
            "title": "Stake Account Manager Challenge",
            "content": "Manage stake account lifecycle including activation e deactivation.",
            "duration": "45 min",
            "hints": [
              "Only inactive stakes can be activated",
              "Only active stakes can be deactivated",
              "Fully active after warmup_epochs from activation"
            ]
          }
        }
      }
    }
  },
  "solana-account-abstraction": {
    "title": "Account Abstraction e Smart Wallet",
    "description": "Implement smart-wallet/account-abstraction patterns on Solana con programmable authorization, recovery controls, e policy-driven transazione validation.",
    "duration": "6 weeks",
    "tags": [
      "account-abstraction",
      "smart-wallet",
      "multisig",
      "recovery",
      "session-keys"
    ],
    "modules": {
      "mod-49-1": {
        "title": "Smart Wallet Fundamentals",
        "description": "Build smart-wallet fundamentals including multisig e social-recovery designs con clear trust e failure boundaries.",
        "lessons": {
          "lesson-49-1-1": {
            "title": "Account Abstraction on Solana",
            "content": "Account abstraction on Solana shifts control from a single key to programmable policy. Smart wallet can enforce richer authorization logic, but policy complexity must be managed carefully.\n\nA robust smart-wallet progettazione defines:\n1) authority model (owners/guardians/delegates),\n2) policy scope (what can be approved automatically vs manually),\n3) recovery path (how access is restored safely).\n\nMultisig e social recovery are powerful, but both need deterministic state transitions e explicit quorum rules. Ambiguous transitions create lockout or unauthorized-access risk.\n\nSmart-wallet systems should emit structured authorization evidence per each action: which policy matched, which signers approved, e which constraints passed.\n\nProduction reliability depends on clear emergency controls: pause paths, guardian rotation, e recovery cooldowns.\n\nAccount abstraction is successful when flexibility increases safety e usability together, not when policy logic becomes opaque.",
            "duration": "45 min"
          },
          "lesson-49-1-2": {
            "title": "Multi-Signature Wallet Challenge",
            "content": "Implement M-of-N multi-signature wallet.",
            "duration": "45 min",
            "hints": [
              "Use contains() to check ownership",
              "Can sign if owner E not already signed E not executed",
              "Can execute if threshold reached e not executed"
            ]
          },
          "lesson-49-1-3": {
            "title": "Social Recovery Challenge",
            "content": "Implement social recovery con guardians.",
            "duration": "45 min",
            "hints": [
              "Track approvals in guardians_approved vector",
              "Check guardian status before approving",
              "Require threshold E delay per execution"
            ]
          },
          "lesson-49-1-4": {
            "title": "Session Key Manager Challenge",
            "content": "Manage temporary session keys con limited permissions.",
            "duration": "45 min",
            "hints": [
              "Valid if current time before expiration",
              "Can execute if valid, allowed operation, e within limit",
              "Remaining is max minus used"
            ]
          }
        }
      },
      "mod-49-2": {
        "title": "Programmable Validation",
        "description": "Implement programmable validation policies (limits, allowlists, time/risk rules) con deterministic enforcement e auditability.",
        "lessons": {
          "lesson-49-2-1": {
            "title": "Custom Validation Rules",
            "content": "Programmable validation is where smart wallet deliver real value, but it is also where subtle policy bugs appear.\n\nTypical controls include spending limits, destination allowlists, time windows, e risk-score gates. These controls should be deterministic e composable, con explicit precedence rules.\n\nProgettazione principles:\n- fail closed on ambiguous policy matches,\n- keep policy evaluation order stable,\n- attach machine-readable reason codes to approve/reject outcomes.\n\nValidation systems should also support policy explainability. Users e auditors need to understand why a transazione was blocked or approved.\n\nPer production deployments, policy changes should be versioned e test-fixtured. A new rule must be validated against prior known-good scenarios to avoid accidental lockouts or bypasses.\n\nProgrammable wallet are strongest when validation logic is transparent, testable, e operationally reversible.",
            "duration": "45 min"
          },
          "lesson-49-2-2": {
            "title": "Spending Limit Enforcer Challenge",
            "content": "Enforce daily e per-transazione spending limits.",
            "duration": "45 min",
            "hints": [
              "Reset counters before checking",
              "Check all three limits: per-tx, daily, weekly",
              "Reset daily if new day, weekly if 7+ days passed"
            ]
          },
          "lesson-49-2-3": {
            "title": "Whitelist Enforcer Challenge",
            "content": "Enforce destination whitelists per transazioni.",
            "duration": "45 min",
            "hints": [
              "allow_all bypasses whitelist check",
              "Check contains() before adding",
              "Validate all destinations in transazione"
            ]
          },
          "lesson-49-2-4": {
            "title": "Time Lock Enforcer Challenge",
            "content": "Enforce time-based restrictions on transazioni.",
            "duration": "45 min",
            "hints": [
              "Handle wrap-around per hours crossing midnight",
              "Check elapsed is between min e max delay",
              "Validate hours are 0-23 e min <= max"
            ]
          }
        }
      }
    }
  },
  "solana-pda-mastery": {
    "title": "Indirizzo Derivato dal Programma Mastery",
    "description": "Master avanzato PDA engineering on Solana: seed schema progettazione, bump handling discipline, e secure cross-program PDA usage at production scale.",
    "duration": "6 weeks",
    "tags": [
      "pda",
      "program-derived-address",
      "seeds",
      "bump",
      "deterministic"
    ],
    "modules": {
      "mod-50-1": {
        "title": "PDA Fundamentals",
        "description": "Build strong PDA foundations con deterministic derivation, canonical seed composition, e collision-resistant namespace strategy.",
        "lessons": {
          "lesson-50-1-1": {
            "title": "Indirizzi Derivati dal Programma",
            "content": "Indirizzi Derivati dal Programma (PDAs) are deterministic authority e state anchors on Solana. Their power comes from predictable derivation; their risk comes from inconsistent seed discipline.\n\nA strong PDA progettazione standard defines:\n1) canonical seed order,\n2) explicit namespace/domain tags,\n3) bump handling rules,\n4) versioning strategy per future evolution.\n\nSeed ambiguity is a common source of bugs. If different handlers derive the same concept con different seed ordering, identity checks become inconsistent e sicurezza assumptions break.\n\nPDA validation should always re-derive expected addresses on the trusted side e compare exact keys before mutating state.\n\nProduction teams should document seed recipes as API contracts. Changing recipes without migration planning can orphan state e break clients.\n\nPDA mastery is mostly discipline: deterministic derivation everywhere, no implicit conventions, no trust in client-provided derivation claims.",
            "duration": "45 min"
          },
          "lesson-50-1-2": {
            "title": "PDA Generator Challenge",
            "content": "Implement PDA generation con seed validation.",
            "duration": "45 min",
            "hints": [
              "Try bumps from 255 down to 0",
              "Combine seeds, program_id, e bump in hash",
              "Check if derived address matches expected"
            ]
          },
          "lesson-50-1-3": {
            "title": "Seed Composer Challenge",
            "content": "Compose complex seed patterns per different use cases.",
            "duration": "45 min",
            "hints": [
              "Use byte string literals b\"...\" per static prefixes",
              "Convert integers con to_le_bytes()",
              "Collect into Vec<Vec<u8>>"
            ]
          },
          "lesson-50-1-4": {
            "title": "Bump Manager Challenge",
            "content": "Manage bump seeds per PDA verification e signing.",
            "duration": "45 min",
            "hints": [
              "Compare stored seeds con expected seeds",
              "Signer seeds include all seeds plus bump",
              "Canonical bump is from find_pda con highest valid bump"
            ]
          }
        }
      },
      "mod-50-2": {
        "title": "Avanzato PDA Patterns",
        "description": "Implement avanzato PDA patterns (nested/counter/stateful) while preserving sicurezza invariants e migration safety.",
        "lessons": {
          "lesson-50-2-1": {
            "title": "PDA Progettazione Patterns",
            "content": "Avanzato PDA patterns solve real scaling e composability needs but increase progettazione complexity.\n\nNested PDAs, counter-based PDAs, e multi-tenant PDA namespaces each require explicit invariants around uniqueness, lifecycle, e authority boundaries.\n\nKey safeguards:\n- monotonic counters con replay protection,\n- collision checks in shared namespaces,\n- explicit ownership checks on all derived-state paths,\n- deterministic migration paths when schema/seed versions evolve.\n\nCross-program PDA interactions must minimize signer scope. invoke_signed should only grant exactly what downstream steps require.\n\nOperationally, avanzato PDA systems need deterministic audit artifacts: derivation inputs, expected outputs, e validation results by istruzione path.\n\nComplex PDA architecture is safe when derivation logic remains simple to reason about e impossible to interpret ambiguously.",
            "duration": "45 min"
          },
          "lesson-50-2-2": {
            "title": "Nested PDA Generator Challenge",
            "content": "Generate PDAs derived from other PDA addresses.",
            "duration": "45 min",
            "hints": [
              "Include parent address in child seeds",
              "Use index bytes per sibling derivation",
              "Verify by re-deriving e comparing"
            ]
          },
          "lesson-50-2-3": {
            "title": "Counter PDA Generator Challenge",
            "content": "Generate unique PDAs using incrementing counters.",
            "duration": "45 min",
            "hints": [
              "Increment counter after each generation",
              "Use counter in seeds per uniqueness",
              "Batch generation calls generate_next multiple times"
            ]
          },
          "lesson-50-2-4": {
            "title": "PDA Collision Detector Challenge",
            "content": "Detect e prevent PDA seed collisions.",
            "duration": "45 min",
            "hints": [
              "Check if seeds match any existing entry",
              "Return error if collision detected",
              "Collision risk if same structure e component sizes"
            ]
          }
        }
      }
    }
  },
  "solana-economics": {
    "title": "Solana Economics e Token Flows",
    "description": "Analyze Solana economic dynamics in production context: inflation/fee-burn interplay, staking flows, supply movement, e protocol sustainability tradeoffs.",
    "duration": "5 weeks",
    "tags": [
      "economics",
      "inflation",
      "fees",
      "rent",
      "token-flows",
      "sustainability"
    ],
    "modules": {
      "mod-51-1": {
        "title": "Solana Economic Model",
        "description": "Understand Solana macro token economics (inflation, burn, rewards, fees) con deterministic scenario modeling.",
        "lessons": {
          "lesson-51-1-1": {
            "title": "Solana Token Economics",
            "content": "Solana economics is the interaction of issuance, burn, staking rewards, e usage demand. Sustainable protocol decisions require understanding these flows as a system, not isolated metrics.\n\nCore mechanisms include:\n1) inflation schedule e long-term emission behavior,\n2) fee burn e validatore reward pathways,\n3) staking participation effects on circulating supply.\n\nEconomic analysis should be scenario-driven. Single-point estimates hide risk. Teams should model calm/high-usage/low-usage regimes e compare supply-pressure outcomes.\n\nDeterministic calculators are useful per governance e product planning because they make assumptions explicit: epoch cadence, fee volume, staking ratio, e unlock schedules.\n\nHealthy economic reasoning links network-level flows to protocol-level choices (treasury policy, incentive emissions, fee strategy).\n\nEconomic quality improves when teams publish assumption-driven reports instead of headline narratives.",
            "duration": "45 min"
          },
          "lesson-51-1-2": {
            "title": "Inflation Calculator Challenge",
            "content": "Calculate inflation rate e staking rewards over time.",
            "duration": "45 min",
            "hints": [
              "Use powi per disinflation calculation",
              "Compound inflation year over year",
              "APY is inflation divided by staked percentage"
            ]
          },
          "lesson-51-1-3": {
            "title": "Fee Burn Calculator Challenge",
            "content": "Calculate fee burns e their deflationary impact.",
            "duration": "45 min",
            "hints": [
              "Priority multiplier increases con priority level",
              "Burn is percentage of total fee",
              "Annual estimate is daily * 365"
            ]
          },
          "lesson-51-1-4": {
            "title": "Rent Economics Calculator Challenge",
            "content": "Calculate rent costs e exemption thresholds.",
            "duration": "45 min",
            "hints": [
              "Annual rent is bytes times rate",
              "Exemption is annual times threshold years",
              "Rent due is annual times period"
            ]
          }
        }
      },
      "mod-51-2": {
        "title": "Token Flow Analysis",
        "description": "Model token flow dynamics e sustainability signals using supply categories, unlock events, e behavior-driven liquidity effects.",
        "lessons": {
          "lesson-51-2-1": {
            "title": "Token Flow Dynamics",
            "content": "Token flow analysis turns abstract economics into operational insight. The key is to track where tokens are (staked, circulating, locked, treasury, pending unlock) e how they move over time.\n\nUseful flow metrics include:\n- net circulating change,\n- staking inflow/outflow trend,\n- unlock cliff concentration,\n- treasury spend velocity.\n\nUnlock events should be modeled per market-impact risk. Large clustered unlocks can create short-term supply shock even when long-term tokenomics is sound.\n\nFlow tooling should support deterministic category accounting e conservation checks (total categorized supply consistency).\n\nPer governance, flow analysis is most valuable when tied to policy actions: adjust emissions, change vesting cadence, alter incentive programs.\n\nSustainable token systems are not static designs; they are continuously monitored flow systems con explicit policy feedback loops.",
            "duration": "45 min"
          },
          "lesson-51-2-2": {
            "title": "Supply Flow Tracker Challenge",
            "content": "Track token supply categories e flows.",
            "duration": "45 min",
            "hints": [
              "Total excludes burned tokens",
              "Apply flow by subtracting from source, adding to destination",
              "Net flow is inflow minus outflow"
            ]
          },
          "lesson-51-2-3": {
            "title": "Vesting Schedule Impact Challenge",
            "content": "Calculate token unlock impact on supply.",
            "duration": "45 min",
            "hints": [
              "0 before cliff, linear after, full at end",
              "Monthly unlock is difference between consecutive months",
              "Check multiple months to find peak"
            ]
          },
          "lesson-51-2-4": {
            "title": "Protocol Sustainability Score Challenge",
            "content": "Calculate sustainability metrics per tokenomics.",
            "duration": "45 min",
            "hints": [
              "Net issuance is inflation minus burn",
              "Burn ratio is burn divided by inflation",
              "Score combines burn ratio e staking ratio"
            ]
          }
        }
      }
    }
  }
};
