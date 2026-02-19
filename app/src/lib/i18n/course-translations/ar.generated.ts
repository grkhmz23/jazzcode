import type { CourseTranslationMap } from "./types";

export const arGeneratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    "title": "Solana Fundamentals",
    "description": "Production-grade introduction ل beginners who want clear Solana النموذج الذهنيs, stronger معاملة debugging skills, و deterministic محفظة-manager workflows.",
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
        "title": "البدء",
        "description": "Core execution model, حساب semantics, و معاملة construction patterns you need before writing programs or complex clients.",
        "lessons": {
          "solana-mental-model": {
            "title": "Solana النموذج الذهني",
            "content": "# Solana النموذج الذهني\n\nSolana development gets much easier once you stop thinking in terms of \"contracts that own state\" و start thinking in terms of \"programs that operate on حسابات.\" On Solana, the durable state of your app does not live inside executable code. It lives in حسابات, و every تعليمة explicitly says which حسابات it wants to read or write. Programs are stateless logic: they validate inputs, apply rules, و update حساب data when authorized.\n\nA معاملة is a signed message containing one or more ordered تعليمات. Each تعليمة names a target program, the حسابات it needs, و serialized data. The runtime processes those تعليمات in order, و the معاملة is atomic: either all تعليمات succeed, or none are committed. This matters ل correctness. If your second تعليمة depends on the first تعليمة's output, معاملة atomicity guarantees you never end up in a half-applied state.\n\nل execution validity, several fields matter together: a fee payer, a recent blockhash, تعليمة payloads, و all required signatures. The fee payer funds معاملة fees. The recent blockhash gives the message a freshness window, preventing replay of old signed messages. Required signatures prove authorization from signers declared by تعليمة حساب metadata. Missing or invalid signatures cause rejection before تعليمة logic runs.\n\nSolana's parallelism comes from حساب access metadata. Because each تعليمة lists read و write حسابات up front, the runtime can schedule non-conflicting معاملات simultaneously. If two معاملات only read the same حساب, they can run in parallel. If they both write the same حساب, one must wait. This read/write locking model is a core reason Solana can scale while preserving deterministic outcomes.\n\nWhen reading chain state, you'll also see commitment levels: processed, confirmed, و finalized. Conceptually, processed means observed quickly, confirmed means voted by the cluster, و finalized means rooted deeply enough that rollback risk is minimal. Treat commitment as a consistency/latency trade-off knob, not a fixed-time guarantee.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l1-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l1-q1",
                    "prompt": "What makes Solana state live “in حسابات” rather than “inside contracts”?",
                    "options": [
                      "Programs are stateless logic و حساب data is passed explicitly to تعليمات",
                      "Programs persist mutable storage internally و only expose events",
                      "مدققون assign storage to whichever program has the most stake"
                    ],
                    "answerIndex": 0,
                    "explanation": "On Solana, mutable app state is حساب data. Programs validate و mutate those حسابات but do not hold mutable state internally."
                  },
                  {
                    "id": "l1-q2",
                    "prompt": "Which fields make a معاملة valid to execute?",
                    "options": [
                      "Only program IDs و تعليمة data",
                      "Fee payer, recent blockhash, signatures, و تعليمات",
                      "A محفظة address و a memo string"
                    ],
                    "answerIndex": 1,
                    "explanation": "The runtime checks the message envelope و authorization: fee payer, freshness via blockhash, required signatures, و تعليمة payloads."
                  },
                  {
                    "id": "l1-q3",
                    "prompt": "Why does Solana care about read/write حساب sets?",
                    "options": [
                      "To calculate NFT metadata size",
                      "To schedule non-conflicting معاملات in parallel safely",
                      "To compress signatures on mobile محافظ"
                    ],
                    "answerIndex": 1,
                    "explanation": "Read/write sets let the runtime detect conflicts و parallelize independent work deterministically."
                  }
                ]
              }
            ]
          },
          "accounts-model-deep-dive": {
            "title": "حسابات model تحليل معمق",
            "content": "# حسابات model تحليل معمق\n\nEvery on-chain object on Solana is an حساب مع a standard envelope. You can reason about any حساب using a small set of fields: address, lamports, owner, executable flag, و data bytes length/content. Address (a public key) identifies the حساب. Lamports represent native SOL balance in the smallest unit (1 SOL = 1,000,000,000 lamports). Owner is the program allowed to modify حساب data و debit lamports according to runtime rules. Executable indicates whether the حساب stores runnable program code. Data length tells you how many bytes are allocated ل state.\n\nSystem محفظة حسابات are usually owned by the System Program و often have `dataLen = 0`. Program حسابات are executable و typically owned by loader/runtime programs, not by your application directly. Token balances do not live directly in محفظة حسابات. SPL tokens use dedicated token حسابات, each tied to a specific mint و owner, because token state has its own program-defined layout و rules.\n\nRent-exemption is the عملي baseline ل persistent storage. The more bytes an حساب allocates, the higher the minimum lamports needed to keep it alive without rent collection risk. Even if you never inspect binary data manually, حساب size still affects user costs و protocol economics. Good schema التصميم means allocating only what you need و planning upgrades carefully.\n\nOwner semantics are الامان-critical. If an حساب claims to be token state but is not owned by the token program, your app should reject it. If an حساب is executable, treat it as code, not mutable application data. If you understand owner + executable + data length, you can classify most حساب types quickly و avoid many integration mistakes.\n\nThe fastest way to build confidence is to inspect concrete حساب examples و explain what each field implies operationally.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "l2-account-explorer",
                "title": "حساب Explorer",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "System محفظة حساب",
                      "address": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                      "lamports": 2500000000,
                      "owner": "11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    },
                    {
                      "label": "Program حساب",
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
                    "prompt": "What does the `owner` field mean on an حساب?",
                    "options": [
                      "It is the user who paid the creation fee forever",
                      "It is the program authorized to modify حساب data",
                      "It is always the same as fee payer in the last معاملة"
                    ],
                    "answerIndex": 1,
                    "explanation": "Owner identifies the controlling program ل state mutation و many lamport operations."
                  },
                  {
                    "id": "l2-q2",
                    "prompt": "What does `executable: true` indicate?",
                    "options": [
                      "The حساب can be used as معاملة fee payer",
                      "The حساب stores runnable program bytecode",
                      "The حساب can hold any SPL token mint directly"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable حسابات are code containers; they are not ordinary mutable data حسابات."
                  },
                  {
                    "id": "l2-q3",
                    "prompt": "Why are token حسابات separate from محفظة حسابات?",
                    "options": [
                      "محفظة حسابات are too small to hold decimals",
                      "Token balances are program-specific state managed by the token program",
                      "Only مدققون can read محفظة balances"
                    ],
                    "answerIndex": 1,
                    "explanation": "SPL token state uses dedicated حساب layouts و authorization rules enforced by the token program."
                  }
                ]
              }
            ]
          },
          "transactions-and-instructions": {
            "title": "معاملات & تعليمات",
            "content": "# معاملات & تعليمات\n\nAn تعليمة is the smallest executable unit on Solana: `programId + account metas + opaque data bytes`. A معاملة wraps one or more تعليمات plus signatures و message metadata. This التصميم gives you composability و atomicity in one envelope.\n\nThink of تعليمة حسابات as an explicit dependency graph. Each حساب meta marks whether the حساب is writable و whether a signature is required. During معاملة execution, the runtime uses those flags ل access checks و lock scheduling. If your تعليمة tries to mutate an حساب not marked writable, it fails. If a required signer did not sign, it fails before your program logic runs.\n\nThe معاملة message also carries fee payer و recent blockhash. Fee payer is straightforward: who funds execution. Recent blockhash is subtler: it anchors freshness. Signed messages are replay-resistant because old blockhashes expire. This is why معاملة builders usually fetch a fresh blockhash close to send time.\n\nتعليمة ordering is deterministic و significant. If تعليمة B depends on حساب changes from تعليمة A, place A first. If any تعليمة fails, the whole معاملة is rolled back. You should التصميم multi-step flows مع this all-or-nothing behavior in mind.\n\nل CLI workflow, a healthy baseline is: inspect config, target the right cluster, verify active محفظة, و check balance before sending anything. That sequence reduces avoidable errors و improves team reproducibility. In local scripts, log your derived addresses و معاملة summaries so teammates can reason about intent و outcomes.\n\nYou do not need RPC calls to understand this model, but you do need rigor in message construction: explicit حسابات, explicit ordering, explicit signatures, و explicit freshness.\n\n## Why this matters in real apps\n\nWhen production incidents happen, teams usually debug معاملة construction first: wrong signer, wrong writable flag, stale blockhash, or wrong تعليمة ordering. Engineers who model معاملات as explicit data structures can diagnose these failures quickly. Engineers who treat معاملات like opaque محفظة blobs usually need trial-و-error.\n\n## What you should be able to do after this درس\n\n- Explain the difference between تعليمة-level validation و معاملة-level validation.\n- Predict when two معاملات can execute in parallel و when they will conflict.\n- Build a deterministic pre-send checklist ل local scripts و frontend clients.\n",
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
                    "note": "Validate RPC URL و keypair path before sending معاملات."
                  },
                  {
                    "cmd": "solana config set --url devnet",
                    "output": "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com",
                    "note": "Use devnet while learning to avoid accidental mainnet معاملات."
                  },
                  {
                    "cmd": "solana address",
                    "output": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                    "note": "This is your active signer public key."
                  },
                  {
                    "cmd": "solana balance",
                    "output": "1.250000000 SOL",
                    "note": "Pattern only; actual value depends on محفظة funding."
                  }
                ]
              }
            ]
          },
          "build-sol-transfer-transaction": {
            "title": "Build a SOL transfer معاملة",
            "content": "# Build a SOL transfer معاملة\n\nImplement a deterministic `buildTransferTx(params)` helper in the project file:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n- Use `@solana/web3.js`\n- Return a معاملة مع exactly one `SystemProgram.transfer` تعليمة\n- Set `feePayer` و `recentBlockhash` from params\n- No network calls\n\nThis in-page challenge validates your object-shape reasoning. The authoritative checks ل درس 4 run in repository unit tests, so keep your project implementation aligned مع those tests.\n",
            "duration": "35 min",
            "hints": [
              "Keep معاملة construction deterministic: no RPC or random values.",
              "Convert SOL to lamports using 1_000_000_000 multiplier.",
              "Mirror this logic in the real project helper in src/lib/دورات/solana-fundamentals/project/walletManager.ts."
            ]
          }
        }
      },
      "module-programs-and-pdas": {
        "title": "Programs & PDAs",
        "description": "Program behavior, deterministic PDA التصميم, و SPL token النموذج الذهنيs مع عملي safety checks.",
        "lessons": {
          "programs-what-they-are": {
            "title": "Programs: what they are (و aren’t)",
            "content": "# Programs: what they are (و aren’t)\n\nA Solana program is executable حساب code, not an object that secretly owns mutable storage. Your program receives حسابات from the معاملة, verifies constraints, و writes only to حسابات it is authorized to modify. This explicitness is a feature: it keeps data dependencies visible و helps the runtime parallelize safely.\n\nProgram حسابات are marked executable و deployed through loader programs. Upgrades are governed by upgrade authority (when configured), which is why production الحوكمة around authority custody matters. If your protocol says it is immutable, users should be able to verify upgrade authority was revoked.\n\nWhat programs are not: they are not ambient state scanners. A program cannot discover arbitrary chain data by itself at runtime. If an حساب is required, it must be passed in the تعليمة حساب list. This is a foundational الامان و الاداء constraint. It prevents hidden state dependencies و makes execution deterministic from the message alone.\n\nاستدعاء بين البرامج (CPI) is how one program composes مع another. During CPI, your program calls into another program, passing حساب metas و تعليمة data. This enables rich composition: token transfers from your app logic, metadata updates, or protocol-to-protocol operations. But CPI also increases failure surface. You must validate assumptions before و after CPI, و you must track which signer و writable privileges are being forwarded.\n\nAt a high level, a robust Solana program follows a pattern: validate signer/owner/seed constraints, deserialize حساب data, enforce business invariants, perform state transitions, و optionally perform CPI calls. Keeping this pipeline explicit makes audits easier و upgrades safer.\n\nThe عملي takeaway: programs are deterministic policy engines over حسابات. If you keep حساب boundaries clear, many الامان و correctness questions become mechanical rather than mystical.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l5-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l5-q1",
                    "prompt": "What makes a program حساب executable?",
                    "options": [
                      "It has a محفظة signature on every slot",
                      "Its حساب metadata marks it executable و stores program bytecode",
                      "It owns at least one token حساب"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable حسابات are code containers مع runtime-recognized executable metadata."
                  },
                  {
                    "id": "l5-q2",
                    "prompt": "Why can’t a program discover arbitrary حسابات without them being passed in?",
                    "options": [
                      "Because حساب dependencies must be explicit ل deterministic execution و lock scheduling",
                      "Because RPC nodes hide حساب indexes from programs",
                      "Because only fee payers can list حسابات"
                    ],
                    "answerIndex": 0,
                    "explanation": "حساب lists are part of the تعليمة contract; hidden discovery would break determinism و scheduling assumptions."
                  },
                  {
                    "id": "l5-q3",
                    "prompt": "What is CPI?",
                    "options": [
                      "A client-only simulation mode",
                      "Calling one on-chain program from another on-chain program",
                      "A مدقق-level rent optimization flag"
                    ],
                    "answerIndex": 1,
                    "explanation": "استدعاء بين البرامج is core to Solana composability."
                  }
                ]
              }
            ]
          },
          "program-derived-addresses-pdas": {
            "title": "عناوين مشتقة من البرنامج (PDAs)",
            "content": "# عناوين مشتقة من البرنامج (PDAs)\n\nA عنوان مشتق من البرنامج (PDA) is a deterministic حساب address derived from seeds plus a program ID, مع one key property: it is intentionally off-curve, so no private key exists ل it. This lets your program control addresses deterministically without requiring a human-held signer.\n\nDerivation starts مع seed bytes. Seeds can encode user IDs, mint addresses, version tags, و other namespace components. The runtime appends a bump seed when needed و searches ل an off-curve output. The bump is an integer that makes derivation succeed while preserving deterministic reproducibility.\n\nWhy PDAs matter: they make address calculation stable across clients و on-chain logic. If both sides derive the same PDA from the same seed recipe, they can verify identity without extra lookup tables. This powers patterns like per-user state حسابات, escrow vaults, و protocol configuration حسابات.\n\nVerification is straightforward و critical. Off-chain clients derive PDA و include it in تعليمات. On-chain programs derive the expected PDA again و compare against the supplied حساب key. If mismatch, reject. This closes an entire class of حساب-substitution attacks.\n\nWho signs ل a PDA? Not a محفظة. The program can authorize as PDA during CPI by using invoke_signed مع the exact seed set و bump. Conceptually, runtime verifies the derivation proof و grants signer semantics to that PDA ل the invoked تعليمة.\n\nChanging any seed value changes the derived PDA. This is both feature و footgun: excellent ل namespacing, dangerous if you accidentally alter seed encoding rules between versions. Keep seed schemas explicit, versioned, و documented.\n\nIn short: PDAs are deterministic, non-keypair addresses that let programs model authority و state structure cleanly.\n",
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
                      "They avoid all حساب rent costs",
                      "They replace معاملة signatures entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "PDAs provide deterministic program-controlled addresses مع no corresponding private key."
                  },
                  {
                    "id": "l6-q2",
                    "prompt": "Who signs ل a PDA in CPI flows?",
                    "options": [
                      "Any محفظة holding SOL",
                      "The runtime on behalf of the program when invoke_signed seeds match",
                      "Only the fee payer of the outer معاملة"
                    ],
                    "answerIndex": 1,
                    "explanation": "invoke_signed proves seed derivation to runtime, which grants PDA signer semantics ل that invocation."
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
            "title": "SPL Tokens الاساسيات",
            "content": "# SPL Tokens الاساسيات\n\nSPL Token is Solana’s standard token program family ل fungible assets. A token mint حساب defines token-level configuration: decimals, total supply accounting, و authorities such as mint authority or freeze authority. A mint does not store each user’s balance directly. Balances live in token حسابات.\n\nAssociated Token حسابات (ATAs) are the default token-حساب convention: one canonical token حساب per (owner, mint) pair. This convention simplifies UX و interoperability because محافظ و protocols can derive the expected حساب location without extra indexing.\n\nA common مبتدئ mistake is treating محفظة addresses as token balance containers. Native SOL lives on system حسابات, but SPL token balances live on token حسابات owned by the token program. That means transfers move balances between token حسابات, not directly from محفظة pubkey to محفظة pubkey.\n\nAuthority التصميم matters. Mint authority controls token issuance. Freeze authority can halt movement in specific designs. Removing or الحوكمة-wrapping authorities is a major trust signal in production deployments. If authority policies are unclear, integration risk rises quickly.\n\nThe token model also supports extension pathways. Token-2022 introduces optional features such as transfer fees و additional metadata/behavior controls. You do not need Token-2022 to understand fundamentals, but you should know it exists so you can avoid assuming every token mint behaves exactly like legacy SPL Token defaults.\n\nOperationally, safe token logic means: verify mint, verify owner program, verify ATA derivation where expected, و reason about authorities before trusting balances or transfer permissions.\n\nOnce you internalize mint vs token-حساب separation و authority boundaries, most SPL token flows become predictable و debuggable.\n",
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
                      "A deterministic token حساب ل a specific owner + mint pair",
                      "A مدقق vote حساب مع token metadata",
                      "A compressed NFT ledger entry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Associated Token حسابات standardize where fungible token balances are stored ل each owner/mint."
                  },
                  {
                    "id": "l7-q2",
                    "prompt": "Why is محفظة address != token حساب?",
                    "options": [
                      "محافظ can only hold SOL while token balances are separate program-owned حسابات",
                      "Token حسابات are deprecated و optional",
                      "محفظة addresses are private keys, token حسابات are public keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL balances are state in token حسابات, not direct fields on محفظة system حسابات."
                  },
                  {
                    "id": "l7-q3",
                    "prompt": "What authority controls minting?",
                    "options": [
                      "Recent blockhash authority",
                      "Mint authority configured on the mint حساب",
                      "Any حساب مع enough lamports"
                    ],
                    "answerIndex": 1,
                    "explanation": "Mint authority is the explicit permission holder ل issuing additional supply."
                  }
                ]
              }
            ]
          },
          "wallet-manager-cli-sim": {
            "title": "محفظة Manager CLI-sim",
            "content": "# محفظة Manager CLI-sim\n\nImplement a deterministic CLI parser + command executor in:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n\nRequired behavior:\n\n- `address` prints the active pubkey\n- `build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>` prints stable JSON:\n  `{ from, to, lamports, feePayer, recentBlockhash, instructionProgramId }`\n\nNo network calls. Keep key order stable in output JSON. Repository tests validate this درس's deterministic behavior.\n",
            "duration": "35 min",
            "hints": [
              "Parse flags in pairs: --key value.",
              "Use deterministic SOL-to-lamports conversion مع 1_000_000_000 multiplier.",
              "Construct JSON object in fixed key order before JSON.stringify."
            ]
          }
        }
      }
    }
  },
  "anchor-development": {
    "title": "Anchor Development",
    "description": "Project-journey دورة ل developers moving from الاساسيات to real Anchor engineering: deterministic نموذج الحساباتing, تعليمة builders, الاختبار discipline, و reliable client UX.",
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
        "title": "Anchor الاساسيات",
        "description": "Anchor architecture, حساب constraints, و PDA foundations مع explicit ownership of الامان-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor النموذج الذهني",
            "content": "# Anchor النموذج الذهني\n\nAnchor is best understood as a contract between three layers that must agree on shape: your Rust handlers, generated interface metadata (IDL), و client-side تعليمة builders. In raw Solana programs you manually decode bytes, manually validate حسابات, و manually return compact error numbers. Anchor keeps the same runtime model but moves repetitive work into declarations. You still define الامان-critical behavior, yet you do it through explicit حساب structs, constraints, و typed تعليمة arguments.\n\nThe `#[program]` وحدة is where تعليمة handlers live. Each function gets a typed `Context<T>` plus explicit arguments. The corresponding `#[derive(Accounts)]` struct tells Anchor exactly what حسابات must be provided و what checks happen before handler logic executes. This includes signer requirements, mutability, PDA seed verification, ownership checks, و relational checks like `has_one`. If validation fails, the معاملة aborts before touching your business logic.\n\nIDL is the bridge that makes the developer experience consistent across Rust و TypeScript. It describes تعليمة names, args, حسابات, events, و custom errors. Clients can generate typed methods from that shape, reducing drift between frontend code و on-chain interfaces. When teams ship fast, drift is a common failure mode: wrong حساب ordering, stale discriminators, or stale arg names. IDL-driven clients make those mistakes less likely.\n\nProvider و محفظة concepts complete the flow. The provider wraps an RPC connection plus signer abstraction و commitment preferences. It does not replace محفظة الامان, but it centralizes معاملة send/confirm behavior و test setup. In practice, production reliability comes from understanding this boundary: Anchor helps مع ergonomics و consistency, but you still own protocol invariants, حساب التصميم, و threat modeling.\n\nل this دورة, treat Anchor as a typed تعليمة framework on top of Solana’s explicit حساب runtime. That framing lets you reason clearly about what is generated, what remains your responsibility, و how to test deterministic pieces without needing devnet in CI.\n\n## What Anchor gives you vs what it does not\n\nAnchor gives you: typed حساب contexts, standardized serialization, structured errors, و IDL-driven client ergonomics. Anchor does not give you: automatic business safety, correct authority التصميم, or threat modeling. Those are still protocol engineering decisions.\n\n## By the end of this درس\n\n- You can explain the Rust handler -> IDL -> client flow without hand-waving.\n- You can identify which checks belong in حساب constraints versus handler logic.\n- You can debug IDL drift issues (wrong حساب order, stale args, stale client bindings).\n",
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
                      "IDL metadata, حساب validation glue, و client-facing interface structure",
                      "مدقق hardware configuration و consensus votes",
                      "Automatic PDA funding from devnet faucets"
                    ],
                    "answerIndex": 0,
                    "explanation": "Anchor generates serialization/validation scaffolding و IDL contracts, not مدقق-level behavior."
                  },
                  {
                    "id": "anchor-l1-q2",
                    "prompt": "What is an IDL و who uses it?",
                    "options": [
                      "A JSON interface used by clients/tests/tooling to call your program correctly",
                      "A private key format used only by on-chain programs",
                      "A token mint extension required ل CPI"
                    ],
                    "answerIndex": 0,
                    "explanation": "IDL is interface metadata consumed by clients و tools to reduce تعليمة/حساب drift."
                  }
                ]
              }
            ]
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "حسابات, constraints, و safety",
            "content": "# حسابات, constraints, و safety\n\nMost serious Solana vulnerabilities come from حساب validation mistakes, not from arithmetic. Anchor’s constraint system exists to turn those checks into declarative, auditable rules. You declare intent in the حساب context, و the framework enforces it before تعليمة logic runs. This means your handlers can focus on state transitions while constraints guard the perimeter.\n\nStart مع core markers: `Signer<'info>` proves signature authority, و `#[account(mut)]` declares state can change. Forgetting `mut` produces runtime failures because Solana locks حساب writability up front. This is not cosmetic metadata; it is part of execution scheduling و safety. Then ownership checks ensure an حساب belongs to the expected program. If a malicious user passes an حساب that has the same bytes but wrong owner, strong ownership constraints stop حساب substitution attacks.\n\nPDA constraints مع `seeds` و `bump` verify deterministic حساب identity. Instead of trusting a user-provided address, you define the derivation recipe و compare runtime inputs against it. This pattern prevents attackers from redirecting logic to arbitrary writable حسابات. `has_one` links حساب relationships, such as enforcing `counter.authority == authority.key()`. That relation check is simple but high leverage: it prevents privileged actions from being executed by unrelated signers.\n\nAnchor also supports custom `constraint = ...` expressions ل protocol invariants, like minimum collateral or authority domain rules. Use these sparingly but deliberately: put invariant checks near حساب definitions when they are structural, و keep business flow checks in handlers when they depend on تعليمة arguments or prior state.\n\nA عملي review checklist: verify every mutable حساب has an explicit reason to be mutable; verify every signer is necessary; verify every PDA seed recipe is stable و versioned; verify ownership checks are present where parsing assumes specific layout; verify relational constraints (`has_one`) ل privileged paths. الامان here is explicitness. Constraints do not remove responsibility, but they make responsibility visible و testable.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l2-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l2-q1",
                    "prompt": "What does `#[حساب(mut)]` signal to the runtime و framework?",
                    "options": [
                      "The حساب may be written during execution و must be requested writable",
                      "The حساب is owned by the system program",
                      "The حساب is always a signer"
                    ],
                    "answerIndex": 0,
                    "explanation": "Mutability is part of حساب metadata و lock planning, not a cosmetic annotation."
                  },
                  {
                    "id": "anchor-l2-q2",
                    "prompt": "What is a seeds constraint verifying?",
                    "options": [
                      "That the provided حساب key matches deterministic PDA derivation rules",
                      "That the حساب has maximum rent",
                      "That a token mint has 9 decimals"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seeds + bump ensure deterministic حساب identity و block حساب-substitution vectors."
                  }
                ]
              }
            ]
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
            "content": "# PDAs in Anchor\n\nعناوين مشتقة من البرنامج are the backbone of predictable حساب topology in Anchor applications. A PDA is derived from seed bytes plus program ID و intentionally lives off the ed25519 curve, so no private key exists ل it. This lets your program control authority ل deterministic addresses through `invoke_signed` semantics while keeping user keypairs out of the trust path.\n\nIn Anchor, PDA derivation logic appears in حساب constraints. Typical patterns look like `seeds = [b\"counter\", authority.key().as_ref()], bump`. This expresses three things at once: namespace (`counter`), ownership relation (authority), و uniqueness under your program ID. The `bump` value is the extra byte required to land off-curve. You can compute it on demand مع Anchor, or store it in حساب state ل future CPI convenience.\n\nShould you store bump or always re-derive? Re-deriving keeps state smaller و avoids stale bump fields if derivation recipes ever evolve. Storing bump can simplify downstream تعليمة construction و reduce repeated derivation cost. In practice, many production programs store bump when they expect frequent PDA signing calls و keep the seed recipe immutable. Whichever path you choose, document it و test it.\n\nSeed schema discipline matters. If you silently change seed ordering, text encoding, or domain tags, you derive different addresses و break حساب continuity. Teams usually treat seeds as protocol versioned API: include explicit namespace tags, stable byte encoding rules, و migration plans when evolution is unavoidable.\n\nل this project journey, we will derive a counter PDA from authority + static domain seed و use that address in both init و increment تعليمة builders. The goal is to make حساب identity deterministic, inspectable, و testable without network dependencies. You can then layer real معاملة sending later, confident that حساب و data layouts are already correct.\n",
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
                      "It is signed directly by مدققون"
                    ],
                    "answerIndex": 0,
                    "explanation": "Off-curve means no user-held private key exists; programs authorize via seed proofs."
                  },
                  {
                    "id": "anchor-l3-q2",
                    "prompt": "What breaks if you change one PDA seed value?",
                    "options": [
                      "You derive a different address و can orphan existing state",
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
            "content": "# Initialize Counter PDA (deterministic)\n\nImplement deterministic helper functions ل a Counter project:\n\n- `deriveCounterPda(programId, authorityPubkey)`\n- `buildInitCounterIx(params)`\n\nThis درس validates client-side reasoning without RPC calls. Your output must include stable PDA + bump shape, key signer/writable metadata, و deterministic init تعليمة bytes.\n\nNotes:\n- Keep حساب key ordering stable.\n- Use the fixed init discriminator bytes from the درس hints.\n- Return deterministic JSON in `run(input)` so tests can compare exact output.\n",
            "duration": "35 min",
            "hints": [
              "Use a deterministic hash-like reducer over programId + authorityPubkey + static seed.",
              "The init تعليمة must include four keys in fixed order: counter PDA, authority, payer, system program.",
              "Encode تعليمة data as [73,78,73,84,95,67,84,82,bump] so tests can compare exactly."
            ]
          }
        }
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, حسابات, و الاختبار",
        "description": "Deterministic تعليمة builders, stable state emulation, و الاختبار strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment تعليمة builder + state layout",
            "content": "# Increment تعليمة builder + state layout\n\nImplement deterministic increment behavior in pure TypeScript:\n\n- Build a reusable state representation ل counter data.\n- Implement `applyIncrement` as a pure transition function.\n- Enforce explicit overflow behavior (`Counter overflow` error).\n\nThis challenge focuses on deterministic correctness of state transitions, not network execution.\n",
            "duration": "35 min",
            "hints": [
              "Represent state as a pure JS structure so increment can be deterministic in tests.",
              "Return a new state object from applyIncrement; avoid mutating the input object in-place.",
              "ل this challenge, overflow should throw \"Counter overflow\" when count is 4294967295."
            ]
          },
          "anchor-testing-without-flakiness": {
            "title": "الاختبار strategy without flakiness",
            "content": "# الاختبار strategy without flakiness\n\nA reliable Solana curriculum should teach deterministic engineering first, then optional network integration. Flaky tests are usually caused by external dependencies: RPC latency, faucet limits, cluster state drift, blockhash expiry, و محفظة setup mismatch. These are real operational concerns, but they should not block learning core protocol logic.\n\nل Anchor projects, split الاختبار into layers. Unit tests validate data layout, discriminator bytes, PDA derivation, حساب key ordering, و تعليمة payload encoding. These tests are fast و deterministic. They can run in CI without مدقق or internet. If they fail, the error usually points to a real bug in serialization or حساب metadata.\n\nIntegration tests add runtime behavior: معاملة simulation, حساب creation, CPI paths, و event assertions. These are valuable but more fragile. Keep them focused و avoid making every PR depend on remote cluster health. Use local مدقق or controlled environment when possible, و treat external devnet tests as optional confidence checks rather than gatekeeping checks.\n\nWhen writing deterministic tests, prefer explicit expected values و fixed key ordering. ل example, assert exact JSON output مع stable key order ل summaries, assert exact byte arrays ل تعليمة discriminators, و assert exact signer/writable flags in حساب metas. These checks catch regressions that broad snapshot tests can miss.\n\nAlso test failure paths intentionally: overflow behavior, invalid pubkeys, wrong argument shapes, و stale حساب discriminators. Production incidents often happen on edge paths that had no tests.\n\nA عملي rule: unit tests should prove your client و serialization logic are correct independent of chain conditions. Integration tests should prove network workflows behave when environment is healthy. Keeping this boundary clear gives you both speed و confidence.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l6-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l6-q1",
                    "prompt": "What belongs in deterministic unit tests ل Anchor clients?",
                    "options": [
                      "PDA derivation, تعليمة bytes, و حساب key metadata",
                      "Devnet faucet reliability و slot timings",
                      "مدقق gossip propagation speed"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic unit tests should validate pure logic و serialization boundaries."
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
            "content": "# Client composition & UX\n\nOnce تعليمة layouts و PDA logic are deterministic, client integration becomes a composition exercise: محفظة adapter ل signing, provider/connection ل transport, معاملة builder ل تعليمة packing, و UI state ل pending/success/error handling. Anchor helps by keeping حساب schemas و تعليمة names aligned via IDL, but robust UX still depends on clear boundaries.\n\nA typical flow is: derive addresses, build تعليمة, create معاملة, set fee payer و recent blockhash, request محفظة signature, send raw معاملة, then confirm مع chosen commitment. Each stage can fail ل different reasons. If your UI collapses all failures into one generic message, users cannot recover و developers cannot debug quickly.\n\nSimulation failures usually mean حساب metadata mismatch, invalid تعليمة data, missing signer, wrong owner program, or constraint violations. Signature errors indicate محفظة/user path issues. Blockhash errors are freshness issues. Insufficient funds often involve fee payer SOL balance, not just business حساب balances. Mapping these classes to actionable errors improves trust و reduces support load.\n\nFee payer deserves explicit UX. The user may authorize a معاملة but still fail because payer lacks lamports ل fees or rent. Surfacing fee payer و estimated cost before signing avoids confusion. ل multi-party flows, make fee policy explicit.\n\nل this دورة project, we keep deterministic logic in pure helpers و treat network send/confirm as optional outer layer. That architecture gives you stable local tests while still enabling production integration later. If a network call fails, you can quickly isolate whether the bug is in deterministic تعليمة construction or in runtime environment state.\n\nIn short: robust Anchor UX is not one API call. It is a staged pipeline مع clear error taxonomy, explicit payer semantics, و deterministic inner logic that can be tested without chain access.\n",
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
                      "Because حساب constraints, owners, و تعليمة bytes can be invalid",
                      "Because the محفظة signature always expires immediately",
                      "Because fee payer is irrelevant"
                    ],
                    "answerIndex": 0,
                    "explanation": "Simulation catches حساب و تعليمة-level issues before final network commitment."
                  },
                  {
                    "id": "anchor-l7-q2",
                    "prompt": "What does fee payer mean in client معاملة UX?",
                    "options": [
                      "The حساب funding معاملة fees/rent-sensitive operations",
                      "The حساب that stores all token balances directly",
                      "The حساب that sets RPC endpoint"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee payer funds execution costs و must have sufficient SOL."
                  }
                ]
              }
            ]
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
            "content": "# Counter project checkpoint\n\nCompose the full deterministic flow:\n\n1. Derive counter PDA from authority + program ID.\n2. Build init تعليمة metadata.\n3. Build increment تعليمة metadata.\n4. Emulate state transitions: `init -> increment -> increment`.\n5. Return stable JSON summary in exact key order:\n\n`{ authority, pda, initIxProgramId, initKeys, incrementKeys, finalCount }`\n\nNo network calls. All checks are strict string matches.\n",
            "duration": "45 min",
            "hints": [
              "Compose the checkpoint from deterministic helper functions to keep output stable.",
              "Use fixed key order و fixed JSON key order to satisfy strict expected output matching.",
              "The emulator sequence ل this checkpoint is init -> increment -> increment, so finalCount should be 2."
            ]
          }
        }
      }
    }
  },
  "solana-frontend": {
    "title": "Solana Frontend Development",
    "description": "Project-journey دورة ل frontend engineers who want production-ready Solana dashboards: deterministic reducers, replayable event pipelines, و trustworthy معاملة UX.",
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
        "title": "Frontend Fundamentals ل Solana",
        "description": "Model محفظة/حساب state correctly, التصميم معاملة lifecycle UX, و enforce deterministic correctness rules ل replayable debugging.",
        "lessons": {
          "frontend-v2-wallet-state-accounts-model": {
            "title": "محفظة state + حسابات النموذج الذهني ل UI devs",
            "content": "# محفظة state + حسابات النموذج الذهني ل UI devs\n\nMost Solana frontend bugs are not visual bugs. They are model bugs. A dashboard can look polished while silently computing balances from the wrong حساب class, mixing lamports مع token units, or treating temporary pending state as confirmed truth. The first production-grade skill is to build a strict النموذج الذهني و enforce it in code. محفظة address, system حساب balance, token حساب balance, و position value are related but not interchangeable.\n\nA connected محفظة gives your app identity و signature capability. It does not directly provide full portfolio state. Native SOL lives on the محفظة system حساب in lamports, while SPL balances live in token حسابات, often associated token حسابات (ATAs). If your state shape does not represent this distinction explicitly, downstream logic becomes fragile. ل example, transfer previews might show a محفظة address as a token destination, but execution requires token حساب addresses. Good frontends represent these as separate types و derive display labels from those types.\n\nPrecision is equally important. Lamports و token amounts should remain integer strings in your model layer. UI formatting can convert those values ل display, but business logic should avoid float math to prevent drift و non-deterministic tests. This دورة uses deterministic fixtures و fixed-scale arithmetic because reproducibility is essential ل debugging. If one engineer sees \\\"5.000001\\\" و another sees \\\"5.000000\\\" ل the same payload, your incident response becomes noise.\n\nState ownership is another common failure point. Portfolio views often merge data from event streams, cached fetches, و optimistic معاملة journals. Without clear precedence rules, you can double-count transfers or overwrite fresh data مع stale cache entries. A robust model treats each input as an event و computes derived state through deterministic reducers. That approach gives you replayability: when a bug appears, you can replay the exact event sequence و inspect every transition.\n\nA production dashboard also needs explicit error classes ل parsing و modeling. Invalid mint metadata, malformed amount strings, or missing ATA links should produce typed failures, not silent fallback behavior. Silent fallbacks feel user-friendly in the short term, but they hide corruption that later appears as impossible balances or broken transfers.\n\nFinally, محفظة state should include confidence metadata. Is this balance from confirmed events? From optimistic local prediction? From replay snapshot N? Confidence-aware UX prevents overclaiming و helps users understand why values may shift.\n\n## عملي النموذج الذهني map\n\nKeep four layers explicit:\n1. Identity layer (محفظة, signer, session metadata).\n2. State layer (system حسابات, token حسابات, mint metadata).\n3. Event layer (journal entries, corrections, dedupe keys, confidence).\n4. View layer (formatted balances, sorted rows, UX status labels).\n\nWhen these layers blur together, bugs look random. When they stay separate, you can isolate failures quickly.\n\n## Pitfall: treating محفظة pubkey as the universal balance location\n\nمحفظة pubkey identifies a user, but SPL balances live in token حسابات. If you collapse the two, transfer builders, explorers, و reconciliation logic diverge.\n\n## Production Checklist\n\n1. Keep lamports و token amounts as integer strings in core model.\n2. Represent محفظة address, ATA address, و mint address as separate fields.\n3. Derive UI values from deterministic reducers, not ad-hoc component state.\n4. Attach confidence metadata to displayed balances.\n5. Emit typed parser/model errors instead of silent defaults.\n",
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
                      "In token حسابات (typically ATAs), not directly in the محفظة system حساب",
                      "In the محفظة system حساب lamports field",
                      "Inside the معاملة signature"
                    ],
                    "answerIndex": 0,
                    "explanation": "محفظة identity و token balance storage are different model layers in Solana."
                  },
                  {
                    "id": "frontend-v2-l1-q2",
                    "prompt": "Why keep raw amounts as integer strings in model code?",
                    "options": [
                      "To avoid non-deterministic floating-point drift in reducers و tests",
                      "Because محافظ only accept strings",
                      "Because decimals are always 9"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic arithmetic و replay debugging depend on precise integer state."
                  }
                ]
              }
            ]
          },
          "frontend-v2-transaction-lifecycle-ui": {
            "title": "معاملة lifecycle ل UI: pending/confirmed/finalized, optimistic UI",
            "content": "# معاملة lifecycle ل UI: pending/confirmed/finalized, optimistic UI\n\nFrontend معاملة UX is a state machine problem. Users press one button, but your app traverses multiple phases: intent creation, معاملة construction, signature request, submission, و confirmation at one or more commitment levels. If these phases are collapsed into one boolean \\\"loading\\\" flag, you lose correctness و your recovery paths become guesswork.\n\nThe lifecycle starts مع deterministic planning. Before any محفظة popup, construct a serializable معاملة intent: حسابات, amounts, expected side effects, و idempotency key. This intent should be inspectable و testable without network access. In production, this split pays off because many failures happen before send: invalid حساب metas, stale assumptions about ATAs, wrong decimals, or malformed تعليمة payloads. A deterministic planner catches these early و produces actionable errors.\n\nAfter signing, submission moves the معاملة into a pending state. Pending means the network may or may not accept execution. Your UI can use optimistic overlays, but optimistic updates should be scoped و reversible. ل example, show \\\"pending transfer\\\" in activity feed immediately, but avoid mutating durable balance totals until at least confirmed commitment. If you mutate balances too early, user trust drops when signature rejection or simulation failure occurs.\n\nCommitment levels should be modeled explicitly. \\\"processed\\\" provides quick feedback, \\\"confirmed\\\" provides stronger confidence, و \\\"finalized\\\" is strongest. You do not need to promise exact timing. You do need to communicate confidence boundaries clearly. A common production bug is labeling processed as final و then rendering inconsistent data during cluster stress.\n\nOptimistic rollback is often neglected. Every optimistic action needs a rollback rule keyed by idempotency token. If confirmation fails, rollback should remove optimistic journal entries و restore derived state by replaying deterministic events. This is why event-driven state models are عملي ل frontend apps: they make rollback a replay operation instead of imperative patchwork.\n\nTelemetry should also be phase-specific. Log whether failures happen in build, sign, send, or confirm. Group by محفظة type, program ID, و error class. This lets teams distinguish infrastructure incidents from modeling bugs.\n\n## Pitfall: over-writing confirmed state مع stale optimistic assumptions\n\nOptimistic state should be additive و reversible. If optimistic patches directly replace canonical state, delayed confirmations or failures create confusing balance jumps.\n\n## Production Checklist\n\n1. Model معاملة lifecycle as explicit states, not one loading flag.\n2. Keep deterministic planner output separate from محفظة/RPC adapter layer.\n3. Track optimistic entries مع idempotency keys و rollback rules.\n4. Label commitment confidence in UI copy.\n5. Emit phase-specific telemetry ل build/sign/send/confirm.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "frontend-v2-l2-account-explorer",
                "title": "Lifecycle حسابات Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Fee Payer System حساب",
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
                    "prompt": "What is the safest use of optimistic UI ل token transfers?",
                    "options": [
                      "Show pending overlays first, mutate durable balances only after stronger confirmation",
                      "Immediately mutate all balances و ignore rollback",
                      "Disable activity feed until finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Optimistic overlays are useful, but confirmed state must remain authoritative."
                  },
                  {
                    "id": "frontend-v2-l2-q2",
                    "prompt": "Why track معاملة phases separately in telemetry?",
                    "options": [
                      "To isolate modeling failures from محفظة و network failures",
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
            "content": "# Data correctness: dedupe, ordering, idempotency, correction events\n\nFrontend teams frequently assume event streams are perfectly ordered و unique. Production systems rarely behave that way. You can receive duplicate events, out-of-order events, delayed price updates, و correction signals that invalidate earlier records. If your reducer assumes ideal sequencing, dashboard totals drift و support incidents become hard to reproduce.\n\nDeterministic ordering is the first control. In this دورة we replay events by (ts, id). Timestamp alone is insufficient because equal timestamps are common in batched systems. A deterministic tie-breaker gives every engineer و CI runner the same final state.\n\nIdempotency is the second control. Each event id should be applied at most once. If the same id appears twice, state must not change after the first apply. This rule protects against retries, websocket reconnect bursts, و duplicate queue deliveries.\n\nCorrection handling is the third control. A correction event references an earlier event id و signals that its effect should be removed. You can implement this by replaying from journal مع corrected ids excluded, or by inverse operations when your model supports exact inverses. Replay is slower but simpler و safer ل educational deterministic engines.\n\nHistory modeling deserves attention too. Users need recent activity, but history should not become an unstructured debug dump. Each history row should include event id, timestamp, type, و concise summary. If corrected events remain visible, label them explicitly so users و support staff understand why balances changed.\n\nAnother correctness risk is cross-domain ordering. Token events و price events may arrive at different rates. Value calculations should depend on the latest known price per mint و should never use transient float conversions. Fixed-scale integer math avoids rounding divergence across environments.\n\nWhen reducers are deterministic و replayable, regression الاختبار improves dramatically. You can compare snapshots after every N events, compute checksums, و verify that refactors preserve behavior. This style catches subtle bugs earlier than end-to-end tests.\n\nFinally, correctness is not only code. It is product communication. If corrections can alter history, UI should surface that possibility in copy و state labels. Hiding it creates the appearance of randomness.\n\n## Pitfall: applying out-of-order events directly to live state without replay\n\nApplying arrivals as-is can produce transiently wrong balances و non-reproducible bugs. Deterministic replay gives consistent outcomes و auditable transitions.\n\n## Production Checklist\n\n1. Sort replay by deterministic keys (ts, id).\n2. Deduplicate by event id before applying transitions.\n3. Support correction events that remove prior effects.\n4. Keep history rows explicit و correction-aware.\n5. Use fixed-scale arithmetic ل value calculations.\n",
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
                      "It provides deterministic tie-breaking ل equal timestamps",
                      "It removes the need ل deduplication",
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
                      "Apply both و average balances",
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
            "content": "# Build core state model + reducer from events\n\nImplement a deterministic reducer ل dashboard state:\n- apply event stream transitions ل balances و mint metadata\n- enforce idempotency by event id\n- support correction markers ل replaced events\n- emit stable history summaries\n",
            "duration": "35 min",
            "hints": [
              "Sort by (ts, id) before applying events.",
              "If event id already exists in eventsApplied, skip it ل idempotency.",
              "Corrections should mark replaced event ids و remove their effects from state transitions."
            ]
          }
        }
      },
      "frontend-v2-module-token-dashboard": {
        "title": "Token Dashboard Project",
        "description": "Build reducer, replay snapshots, query metrics, و deterministic dashboard outputs that remain stable under partial or delayed data.",
        "lessons": {
          "frontend-v2-stream-replay-snapshots": {
            "title": "Implement event stream simulator + replay timeline + snapshots",
            "content": "# Implement event stream simulator + replay timeline + snapshots\n\nBuild deterministic replay tooling:\n- replay sorted events by (ts, id)\n- snapshot every N applied events\n- compute stable checksum ل replay output\n- return { finalState, snapshots, checksum }\n",
            "duration": "35 min",
            "hints": [
              "Determinism starts مع sorting by ts then id.",
              "Deduplicate by event id before snapshot interval checks.",
              "Build checksum from stable snapshot metadata, not random values."
            ]
          },
          "frontend-v2-query-layer-metrics": {
            "title": "Implement query layer + computed metrics",
            "content": "# Implement query layer + computed metrics\n\nImplement dashboard query/view logic:\n- search/filter/sort rows deterministically\n- compute total و row valueUsd مع fixed-scale integer math\n- expose stable view model ل UI rendering\n",
            "duration": "35 min",
            "hints": [
              "Use fixed-scale integers (micro USD) instead of floating point.",
              "Apply filter -> search -> sort in a deterministic order.",
              "Break sort ties by mint ل stable output."
            ]
          },
          "frontend-v2-production-ux-hardening": {
            "title": "Production UX: caching, pagination, error banners, skeletons, rate limits",
            "content": "# Production UX: caching, pagination, error banners, skeletons, rate limits\n\nAfter model correctness, frontend quality is mostly about user trust under imperfect conditions. Users do not evaluate your dashboard by clean demo paths. They evaluate it when data is delayed, partial, duplicated, or rejected. Production UX hardening means making those states understandable و recoverable.\n\nCaching strategy should be explicit. Event snapshots, derived views, و summary cards should have clear freshness rules. A stale-but-marked cache is often better than blank loading screens, but stale data must never masquerade as confirmed current data. Include freshness timestamps و, when possible, source confidence labels (cached, replayed, confirmed).\n\nPagination و virtualized lists need deterministic sorting to avoid row jumps between pages. If sort keys are unstable, users see items move unexpectedly as new events arrive. Use primary و secondary stable keys, و preserve cursor semantics during live updates.\n\nError banners should be scoped by subsystem. Parser errors are not network errors. Replay checksum mismatches are not محفظة signature errors. Distinct error classes reduce panic و help users choose next actions. A generic red toast that says \\\"something went wrong\\\" is operationally expensive.\n\nSkeleton states must communicate structure rather than fake certainty. Show placeholder rows و chart bounds, but avoid hardcoding values that look real. If users screen-record issues, misleading skeletons complicate incident investigation.\n\nRate limits are common in real dashboards, even مع private APIs. Your UI should surface backoff state و avoid firehose re-requests from multiple components. Centralize data fetching و de-duplicate in-flight requests by key. This prevents self-inflicted throttling.\n\nLive mode و replay mode should share the same reducer و query pipeline. Live mode streams events progressively; replay mode applies fixture timelines deterministically. If these modes use different code paths, bugs hide in mode-specific branches و become hard to reproduce.\n\nA عملي approach is to store event journal و snapshots, then render all UI from derived selectors. This architecture supports recoverability: you can reset to snapshot N, replay events, و inspect differences. It also supports support tooling: attach snapshot checksum و model version to error reports.\n\n### Devnet Bonus (optional)\n\nYou can add an RPC adapter behind a feature flag و map live حساب updates into the same event format. Keep this optional و never required ل core correctness.\n\n## Pitfall: shipping polished visuals مع unscoped failure states\n\nIf users cannot tell whether an issue is stale cache, parse failure, or upstream throttle, confidence erodes even when core model logic is correct.\n\n## Production Checklist\n\n1. Expose freshness metadata ل cached و live data.\n2. Keep list sorting deterministic across pagination.\n3. Classify errors by subsystem مع actionable copy.\n4. De-duplicate in-flight fetches و respect rate limits.\n5. Render live و replay modes through shared reducer/selectors.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l7-q1",
                    "prompt": "Why should live mode و replay mode share the same reducer pipeline?",
                    "options": [
                      "To keep behavior reproducible و avoid mode-specific correctness drift",
                      "To reduce CSS size only",
                      "Because rate limits require it"
                    ],
                    "answerIndex": 0,
                    "explanation": "Shared deterministic logic makes incident replay و الاختبار reliable."
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
                    "explanation": "Phase- و subsystem-specific failures require different user guidance."
                  }
                ]
              }
            ]
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            "title": "Emit stable DashboardSummary from fixtures",
            "content": "# Emit stable DashboardSummary from fixtures\n\nCompose deterministic checkpoint output:\n- owner, token count, totalValueUsd\n- top tokens sorted deterministically\n- recent activity rows\n- invariants و determinism metadata (fixture hash + model version)\n",
            "duration": "45 min",
            "hints": [
              "Emit JSON keys in a fixed order ل stable snapshots.",
              "Sort top tokens deterministically مع tie breakers.",
              "Include modelVersion و fixtureHash in determinism metadata."
            ]
          }
        }
      }
    }
  },
  "defi-solana": {
    "title": "DeFi on Solana",
    "description": "متقدم project-journey دورة ل engineers building swap systems: deterministic offline Jupiter-style planning, route ranking, minOut safety, و reproducible diagnostics.",
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
        "description": "Understand CPMM math, quote anatomy, و deterministic routing tradeoffs مع safety-first user protections.",
        "lessons": {
          "defi-v2-amm-basics-fees-slippage-impact": {
            "title": "AMM الاساسيات on Solana: pools, fees, slippage, و تأثير السعر",
            "content": "# AMM الاساسيات on Solana: pools, fees, slippage, و تأثير السعر\n\nWhen users click “Swap,” they usually assume there is one objective truth: the current price. In practice, frontend swap systems compute an estimate from pool reserves و route assumptions. The estimate can be excellent, but it is still a model. DeFi UI quality depends on how honestly و consistently that model is represented.\n\nIn a constant-product AMM, each pool maintains an invariant close to x * y = k. A swap changes reserves asymmetrically, و the output amount is non-linear relative to input size. Small trades can track spot estimates closely, while larger trades move further along the curve و experience more impact. That non-linearity is why frontend code must never compare routes using only “price per token” labels. You need route-aware output calculations at the target trade size.\n\nOn Solana, swaps also occur across varied pool designs و fee tiers. Some pools are deep و low fee; others are shallow but still attractive ل small size due to path composition. Fee bps are often compared in isolation, but total execution quality comes from three interacting pieces: fee deduction, reserve depth, و route hop count. A route مع slightly higher fee can still produce higher net output if reserves are materially deeper.\n\nSlippage و تأثير السعر are often conflated in UI copy, but they answer different questions. تأثير السعر asks: what movement does this trade itself induce against current reserves? Slippage tolerance asks: what worst-case output should still be accepted at execution time? One is descriptive of current route mechanics, the other is a user safety bound. Production interfaces should surface both values clearly و compute minOut deterministically from outAmount و slippage bps.\n\nDeterministic arithmetic matters as much as financial logic. If planners use floating-point shortcuts, two environments can produce subtly different minOut values و route ranking. Those tiny differences create major operational pain in tests, incident response, و support reproductions. Integer arithmetic over u64-style amount strings should remain the primary model path; formatting ل users should happen only at presentation boundaries.\n\nEven in an offline educational planner, safety invariants belong at the core. Outputs must never exceed reserveOut. Reserves must remain non-negative after virtual simulation. Missing pools should fail fast مع typed errors, not fallback behavior. These checks mirror production expectations و train the same engineering discipline needed ل real integrations.\n\nA robust frontend النموذج الذهني is therefore: token universe + pool universe + deterministic quote math + route ranking policy + user safety constraints. If any layer is implicit, the system will still run, but behavior under volatility becomes hard to explain. If all layers are explicit و typed, the same planner can power UI previews, tests, و diagnostics مع minimal drift.\n\n## Quick numeric intuition\n\nIf two routes have spot prices that look similar, a larger input can still produce materially different output because you travel further on each curve. That is why route comparison must happen at the exact user amount, not a tiny reference trade.\n\n## What you should internalize from this درس\n\n- Execution quality is output-at-size, not headline spot price.\n- Slippage tolerance is a user protection bound, not a market forecast.\n- Deterministic integer math is a product feature, not only a technical preference.\n\n### Pitfalls\n\n1. Comparing routes by headline “price” instead of exact outAmount at the user’s size.\n2. Treating slippage tolerance as if it were the same metric as تأثير السعر.\n3. Using floating point in route ranking or minOut logic.\n\n### Production Checklist\n\n1. Keep amount math in integer-safe paths.\n2. Surface outAmount, fee impact, و minOut separately.\n3. Enforce invariant checks ل each hop simulation.\n4. Keep route ranking deterministic مع explicit tie-breakers.\n5. Log enough context to reproduce route decisions.\n",
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
                    "explanation": "minOut is computed from quote outAmount و slippage bps."
                  }
                ]
              }
            ]
          },
          "defi-v2-quote-anatomy-and-risk": {
            "title": "Quote anatomy: in/out, fees, minOut, و worst-case execution",
            "content": "# Quote anatomy: in/out, fees, minOut, و worst-case execution\n\nA production quote is not one number. It is a structured object that must tell users what they send, what they likely receive, how much they pay in fees, و what minimum output protection applies. When frontend systems treat quote payloads as loose JSON blobs, users lose trust quickly because route changes و execution deviations look arbitrary.\n\nThe first mandatory fields are inAmount و outAmount in raw integer units. Without raw values, deterministic checks become fragile. UI formatting should be derived from token decimals, but core state should retain raw strings ل exact comparisons و invariant logic. If an app compares rounded display numbers, route ties can break unpredictably.\n\nSecond, quote systems should expose fee breakdown per hop. Aggregate fee bps is useful, but it hides which pools drive cost. ل route explainability و debugging, users و engineers need pool-level fee contributions. This is particularly important ل two-hop routes where one leg may be cheap و the other expensive.\n\nThird, minOut must be explicit, reproducible, و tied to user-configured slippage bps. The computation is deterministic: floor(outAmount * (10000 - slippageBps) / 10000). Showing this value is not optional ل serious UX. It is the user’s principal safety guard against stale quotes و rapid market movement between quote و submission.\n\nFourth, quote freshness و worst-case framing should be visible. Even in offline training systems, the planner should model the idea that the route is valid ل a moment, not forever. In production, stale quote handling و forced re-quote boundaries prevent accidental execution مع outdated assumptions.\n\nA useful engineering pattern is to model quote objects as immutable snapshots. Each snapshot includes selected route, per-hop details, total fees, impact estimate, و minOut. If selection changes, produce a new snapshot instead of mutating fields in place. This gives deterministic audit trails و cleaner state transitions.\n\nل this دورة, درس logic remains offline و deterministic, but the same التصميم prepares teams ل real Jupiter integrations later. By the time network adapters are introduced, your model و tests already guarantee stable route math و explainability.\n\nQuote anatomy also influences support burden. When a user asks why they received less than expected, the answer is much faster if the system preserves route path, slippage setting, و minOut from the exact planning state. Without that, teams rely on post-hoc guesses.\n\n### Pitfalls\n\n1. Displaying outAmount without minOut و route-level fees.\n2. Mutating selected quote objects in place instead of creating snapshots.\n3. Computing fee percentages from rounded UI values instead of raw amounts.\n\n### Production Checklist\n\n1. Keep quote payloads immutable و versioned.\n2. Store per-hop fee contributions و total fee amount.\n3. Compute و show minOut from explicit slippage bps.\n4. Preserve raw amounts و decimals separately.\n5. Expose route freshness metadata in UI state.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "defi-v2-l2-explorer",
                "title": "Quote حساب Snapshot",
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
                      "ل explainability و debugging route-level cost",
                      "Only ل CSS rendering",
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
            "content": "# Routing: why two-hop can beat one-hop\n\nUsers often assume direct pair routes are always best because they are simpler. In fragmented liquidity systems, that assumption fails frequently. A direct SOL -> JUP pool might have shallow depth, while SOL -> USDC و USDC -> JUP pools together can produce better net output despite two fees و two curve traversals. A production router should evaluate both one-hop و two-hop candidates و rank them deterministically.\n\nThe engineering challenge is not just finding paths. It is comparing paths under consistent assumptions. Every candidate should be quoted مع the same input amount, same deterministic arithmetic, و same fee/impact accounting. If one path uses rounded display math while another uses raw amounts, route ranking loses meaning.\n\nTwo-hop routing also requires stable tie-break policies. Suppose two candidates produce equal outAmount at integer precision. One has one hop; the other has two hops. A deterministic system should prefer fewer hops. If hop count also ties, lexicographic route ID ordering can resolve final rank. The exact policy can vary, but it must be explicit و stable.\n\nLiquidity fragmentation introduces another subtle point: متوسط mint risk. A two-hop path through a highly liquid stable pair can be excellent, but if the second pool is thin, the route can still degrade at larger sizes. This is why route scoring should be quote-size aware و not reused blindly across different trade amounts.\n\nل offline دورة logic, we model pools as a static universe و simulate reserves virtually per quote path. Even this simplified model teaches key production habits: avoid mutating source fixtures, isolate simulation state per candidate, و validate safety constraints at each hop.\n\nRouting quality is also a UX problem. If a selected route changes due to input edits or quote refresh, users should see why: outAmount delta, fee change, و path change. Silent route switching feels suspicious even when mathematically correct.\n\nIn larger systems, routers may consider split routes, gas/compute constraints, or venue reliability. This دورة intentionally limits scope to one-hop و two-hop deterministic candidates so core reasoning remains clear و testable.\n\nFrom an implementation perspective, route objects should be treated as typed artifacts مع stable IDs و explicit hop metadata. That discipline reduces accidental coupling between UI state و planner internals. When engineers can serialize a route candidate, replay it مع the same input, و get the same result, incident response becomes straightforward.\n\n### Pitfalls\n\n1. Assuming direct pairs always outperform multi-hop routes.\n2. Reusing quotes computed ل one trade size at another size.\n3. Non-deterministic tie-breaking that causes route flicker.\n\n### Production Checklist\n\n1. Enumerate one-hop و two-hop routes systematically.\n2. Quote every candidate مع the same deterministic math path.\n3. Keep tie-break policy explicit و stable.\n4. Simulate virtual reserves without mutating source fixtures.\n5. Surface route-change reasons in UI.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l3-q1",
                    "prompt": "What is the primary ranking objective in this دورة router?",
                    "options": [
                      "Maximize outAmount",
                      "Minimize hop count always",
                      "Choose first enumerated route"
                    ],
                    "answerIndex": 0,
                    "explanation": "outAmount is primary; hops و route ID are tie-breakers."
                  },
                  {
                    "id": "defi-v2-l3-q2",
                    "prompt": "Why simulate virtual reserves per candidate route?",
                    "options": [
                      "To keep route quotes deterministic و independent",
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
        "description": "Build deterministic quoting, route selection, و minOut safety checks, then package stable checkpoint artifacts ل reproducible reviews.",
        "lessons": {
          "defi-v2-quote-cpmm": {
            "title": "Implement token/pool model + constant-product quote calc",
            "content": "# Implement token/pool model + constant-product quote calc\n\nImplement deterministic CPMM quoting:\n- out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee)\n- fee = floor(inAmount * feeBps / 10000)\n- impactBps from spot vs effective execution price\n- return outAmount, feeAmount, inAfterFee, impactBps\n",
            "duration": "35 min",
            "hints": [
              "Use inAfterFee = inAmount - floor(inAmount * feeBps / 10000).",
              "Use constant-product output formula مع integer floor division.",
              "Estimate impact by comparing spot price و effective execution price in fixed scale."
            ]
          },
          "defi-v2-router-best": {
            "title": "Implement route enumeration و best-route selection",
            "content": "# Implement route enumeration و best-route selection\n\nImplement deterministic route planner:\n- enumerate one-hop و two-hop candidates\n- quote each candidate at exact input size\n- select best route using stable tie-breakers\n",
            "duration": "35 min",
            "hints": [
              "Enumerate 1-hop direct pools first, then 2-hop through متوسط tokens.",
              "Score bestOut by output, then tie-break by hops و route id.",
              "Keep sorting deterministic to avoid route flicker."
            ]
          },
          "defi-v2-safety-minout": {
            "title": "Implement slippage/minOut, fee breakdown, و safety invariants",
            "content": "# Implement slippage/minOut, fee breakdown, و safety invariants\n\nImplement deterministic safety layer:\n- apply slippage to compute minOut\n- simulate route مع virtual reserve updates\n- return structured errors ل invalid pools/routes\n- enforce non-negative reserve و bounded output invariants\n",
            "duration": "35 min",
            "hints": [
              "Use virtual pool copies so fixture reserves are not mutated.",
              "Compute minOut مع floor(out * (10000 - slippageBps) / 10000).",
              "Return structured errors when pools or route links are invalid."
            ]
          },
          "defi-v2-production-swap-ux": {
            "title": "Production swap UX: stale quotes, protection, و simulation",
            "content": "# Production swap UX: stale quotes, protection, و simulation\n\nA deterministic route engine is necessary but not sufficient ل production. Users experience DeFi through timing, messaging, و safety affordances. A mathematically correct planner can still feel broken if stale quote handling, retry behavior, و error communication are weak.\n\nStale quotes are the most common operational issue. In volatile markets, quote quality decays quickly. Interfaces should track quote age و invalidate plans beyond a strict threshold. When invalidation happens, route و minOut should be recomputed before submit. Reusing stale plans to “speed up” UX usually creates worse outcomes و support burden.\n\nUser protection should be layered. Slippage bounds protect against adverse movement, but they do not protect against malformed route payloads or mismatched حساب assumptions. Safety validation should run before any محفظة prompt و should return explicit, typed errors. “Something went wrong” is not enough in swap flows.\n\nSimulation messaging matters as much as simulation itself. If route simulation fails pre-send, users need actionable context: which hop failed, whether pool liquidity was insufficient, whether the route is missing required pools, و whether re-quoting could help. Generic error banners create user churn.\n\nRetry logic must be bounded و stateful. Blind retries مع unchanged input are often just repeated failures. Good UX distinguishes retryable states (temporary network issue) from deterministic planner errors (invalid route topology). ل deterministic planner errors, force state change before retry.\n\nAnother production concern is observability. Record route ID, inAmount, outAmount, minOut, fee totals, و invariant results ل each attempt. These logs make incident triage و postmortems dramatically faster. Without structured traces, teams often blame “market conditions” ل planner bugs.\n\nPagination و list updates also affect trust. Swap history UIs should preserve deterministic ordering و avoid jitter when data refreshes. If past swaps reorder unpredictably, users perceive reliability issues even when معاملات are correct.\n\nOptional live integrations should be feature-flagged و isolated. The offline deterministic engine should remain the source of truth, while live adapters map external responses into the same internal types. That boundary keeps tests stable و protects core behavior from third-party schema changes.\n\nFinally, production swap UX should make deterministic planner outcomes explainable to non-expert users. If a route is rejected, the interface should provide a concrete reason و a clear next action such as reducing size or selecting a different output token. Clear messaging converts system correctness into user trust.\n\n### Pitfalls\n\n1. Allowing stale quotes to remain actionable without forced re-quote.\n2. Retrying deterministic planner errors without changing route or inputs.\n3. Hiding failure reason details behind generic notifications.\n\n### Production Checklist\n\n1. Track quote freshness و invalidate aggressively.\n2. Enforce pre-submit invariant validation.\n3. Separate retryable network failures from deterministic planner failures.\n4. Log route و safety metadata ل every attempt.\n5. Keep offline engine as canonical model ل optional live adapters.\n",
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
                      "Re-quote و recompute route/minOut before submit",
                      "Submit مع stale plan",
                      "Increase slippage automatically without notifying user"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freshness boundaries should trigger deterministic recomputation."
                  },
                  {
                    "id": "defi-v2-l7-q2",
                    "prompt": "Which failures are not solved by blind retries?",
                    "options": [
                      "Deterministic planner و invariant failures",
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
            "content": "# Produce stable SwapPlan + SwapSummary checkpoint\n\nCompose deterministic checkpoint artifacts:\n- build swap plan from selected route quote\n- include fixtureHash و modelVersion\n- emit stable summary مع path, minOut, fee totals, impact, و invariants\n",
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
    "title": "Solana الامان & Auditing",
    "description": "Production-grade deterministic vuln lab ل Solana auditors who need repeatable exploit evidence, precise remediation guidance, و high-signal audit artifacts.",
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
        "description": "حساب-centric threat modeling, deterministic exploit reproduction, و evidence discipline ل credible audit findings.",
        "lessons": {
          "security-v2-threat-model": {
            "title": "Solana threat model ل auditors: حسابات, owners, signers, writable, PDAs",
            "content": "# Solana threat model ل auditors: حسابات, owners, signers, writable, PDAs\n\nالامان work on Solana starts مع one non-negotiable fact: تعليمة callers choose the حساب list. Programs do not receive trusted implicit context. They receive exactly the حساب metas و تعليمة data encoded in a معاملة message. This التصميم is powerful ل composability و الاداء, but it means almost every critical exploit is an حساب validation exploit in disguise. If you internalize this early, your audits become more mechanical و less guess-based.\n\nA good النموذج الذهني is to treat each تعليمة as a contract boundary مع five mandatory validations: identity, authority, ownership, mutability, و derivation. Identity asks whether the supplied حساب is the حساب the تعليمة expects. Authority asks whether the actor that is allowed to mutate state actually signed. Ownership asks whether حساب data should be interpreted under the current program or a different one. Mutability asks whether writable access is both requested و justified. Derivation asks whether PDA paths are deterministic و verified against canonical seeds plus bump. Missing any of those layers creates openings that attackers repeatedly use.\n\nSigner checks are not optional on privileged paths. If the تعليمة changes authority, moves funds, or updates risk parameters, the authority حساب must be a signer و must be the expected authority from state. One common bug is checking only that “some signer exists.” That is still broken. Audits should explicitly map each privileged transition to a concrete signer relationship و verify that relation is enforced before state mutation.\n\nOwner checks are equally critical. Programs often parse حساب bytes into local structs. Without owner checks, an attacker can pass arbitrary bytes that deserialize into a shape that looks valid but is controlled by another program or by no program assumptions at all. This is حساب substitution. It is the root cause of many catastrophic incidents و should be surfaced early in review notes.\n\nPDA checks are where many teams lose determinism. Seed recipes need to be explicit, stable, و versioned. If the runtime accepts user-provided bump values without recomputation, or if seed ordering differs between handlers, spoofed addresses can pass inconsistent checks. Auditors should insist on exact re-derivation و equality checks in all sensitive paths.\n\nWritable flags matter ل two reasons: correctness و attack surface. Over-broad writable sets increase risk by allowing unnecessary state transitions in CPI-heavy flows. Under-declared mutability causes runtime failure, which is safer but still a reliability bug.\n\nFinally, threat modeling should include arithmetic constraints. Even if auth is correct, unchecked u64 math can corrupt balances through underflow or overflow و invalidate all higher-level assumptions.\n\n## Auditor workflow per تعليمة\n\nل each handler, run the same sequence: identify privileged outcome, list required حسابات, verify signer/owner/PDA relationships, verify writable scope, then test malformed حساب lists. Repeating this fixed loop prevents “I think it looks safe” audits.\n\n## What you should be able to do after this درس\n\n- Turn a vague concern into a concrete validation checklist.\n- Explain why حساب substitution و PDA spoofing recur in Solana incidents.\n- Build deterministic negative-path scenarios before writing remediation notes.\n\n## Checklist\n- Map each تعليمة to a clear privilege model.\n- Verify authority حساب is required signer ل privileged actions.\n- Verify authority key equality against stored state authority.\n- Verify every parsed حساب has explicit owner validation.\n- Verify each PDA is re-derived from canonical seeds و bump.\n- Verify writable حسابات are minimal و justified.\n- Verify arithmetic uses checked operations ل u64 transitions.\n- Verify negative-path tests exist ل unauthorized و malformed حسابات.\n\n## Red flags\n- Privileged state updates without signer checks.\n- Parsing unchecked حساب data from unknown owners.\n- PDA acceptance based on partial seed checks.\n- Handlers that trust client-provided bump blindly.\n- Arithmetic updates using plain + و - on balances.\n\n## How to verify (simulator)\n- Run vulnerable mode on signer-missing scenario و inspect trace.\n- Re-run fixed mode و confirm ERR_NOT_SIGNER.\n- Execute owner-missing scenario و compare vulnerable vs fixed outcomes.\n- Execute pda-spoof scenario و confirm fixed mode emits ERR_BAD_PDA.\n- Compare trace hashes to verify deterministic event ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l1-q1",
                    "prompt": "Why are حساب owner checks mandatory before deserializing state?",
                    "options": [
                      "Because callers can pass arbitrary حسابات و forged byte layouts",
                      "Because owner checks improve rendering speed",
                      "Because owner checks replace signer checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without owner checks, حساب substitution allows attacker-controlled bytes to be parsed as trusted state."
                  },
                  {
                    "id": "security-v2-l1-q2",
                    "prompt": "What should be verified ل a privileged withdraw path?",
                    "options": [
                      "Expected authority key, signer requirement, owner check, و PDA derivation",
                      "Only that the vault حساب is writable",
                      "Only that an amount field exists"
                    ],
                    "answerIndex": 0,
                    "explanation": "Privileged transitions need full identity و authority validation."
                  }
                ]
              }
            ]
          },
          "security-v2-evidence-chain": {
            "title": "Evidence chain: reproduce, trace, impact, fix, verify",
            "content": "# Evidence chain: reproduce, trace, impact, fix, verify\n\nStrong الامان reports are built on evidence chains, not opinions. In the Solana context, that means moving from a claim such as “missing signer check exists” to a deterministic chain: reproduce exploit conditions, capture a stable execution trace, quantify impact, apply a patch, و verify that the same steps now fail مع expected error codes while invariants hold. This chain is what turns audit work into an engineering artifact.\n\nReproduction should be deterministic و minimal. Every scenario should declare initial حسابات, authority/signer flags, vault ownership assumptions, و تعليمة inputs. If reproductions depend on external RPC timing or changing liquidity conditions, confidence drops و triage slows down. In this دورة lab, scenarios are fixture-driven و offline so every replay produces the same state transitions.\n\nTrace capture is the core of audit evidence. Instead of recording only final balances, log each relevant event in stable order: InstructionStart, AccountRead, CheckPassed/CheckFailed, BalanceChange, InstructionEnd. These events let reviewers verify exactly which assumptions passed و where validation was skipped. They also help map exploitability to code-level checks. ل example, if signer checks are absent in vulnerable mode, the trace should explicitly show that signer validation was skipped or never evaluated.\n\nImpact analysis should be quantitative. ل signer و owner bugs, compute drained lamports or unauthorized state changes. ل PDA bugs, show mismatch between expected derived address و accepted address. ل arithmetic bugs, show underflow or overflow conditions و resulting corruption. Impact details inform severity و prioritization.\n\nPatch validation should not just say “fixed.” It should prove exploit steps now fail ل the right reason. If signer exploit now fails, error code should be ERR_NOT_SIGNER. If PDA spoof now fails, error code should be ERR_BAD_PDA. This specificity catches regressions where one bug is accidentally masked by unrelated behavior.\n\nVerification closes the chain مع invariant checks. Examples: vault balance remains a valid u64 string, authority remains unchanged, و no unauthorized lamport delta occurs in fixed mode. These invariants convert patch confidence into measurable guarantees.\n\nWhen teams do this consistently, reports become executable documentation. New engineers can replay scenarios و understand why controls exist. Incident response becomes faster because prior failure signatures و remediation patterns are already captured.\n\n## Checklist\n- Define each scenario مع explicit initial state و تعليمة inputs.\n- Capture deterministic, ordered trace events ل each run.\n- Hash traces مع canonical JSON ل reproducibility.\n- Quantify impact using before/after deltas.\n- Map each finding to explicit evidence references.\n- Re-run identical scenarios in fixed mode.\n- Verify fixed-mode failures use expected error codes.\n- Record post-fix invariant results مع stable IDs.\n\n## Red flags\n- Reports مع no reproduction steps.\n- Non-deterministic traces that change between runs.\n- Impact described qualitatively without deltas.\n- Patch claims without fixed-mode replay evidence.\n- Invariant lists omitted from verification section.\n\n## How to verify (simulator)\n- Run signer-missing in vulnerable mode, save trace hash.\n- Run same scenario in fixed mode, confirm ERR_NOT_SIGNER.\n- Run owner-missing و confirm ERR_BAD_OWNER in fixed mode.\n- Run pda-spoof و compare expected/accepted PDA fields.\n- Generate audit report JSON و markdown summary from checkpoint builder.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "security-v2-l2-account-explorer",
                "title": "Trace حساب Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Vault حساب (vulnerable run)",
                      "address": "PDA_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                      "lamports": 300,
                      "owner": "VaultProgram111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Recipient حساب (post exploit)",
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
                      "To prove deterministic replay و evidence integrity",
                      "To replace structured test assertions",
                      "To randomize scenario ordering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Canonical trace hashes make replay evidence comparable و tamper-evident."
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
                    "explanation": "This order ensures claims are demonstrated و patch effectiveness is validated."
                  }
                ]
              }
            ]
          },
          "security-v2-bug-classes": {
            "title": "Common Solana bug classes و mitigations",
            "content": "# Common Solana bug classes و mitigations\n\nAuditors on Solana repeatedly encounter the same core bug families. The implementation details differ across protocols, but exploit mechanics are surprisingly consistent: identity confusion, authority confusion, derivation drift, arithmetic corruption, و unsafe cross-program assumptions. A robust review process categorizes findings by class, applies known verification patterns, و tests negative paths intentionally.\n\n**Missing signer checks** are high-severity because they directly break authorization. The fix is conceptually simple: require signer و key relation. Yet teams miss it when refactoring حساب structs or switching between typed و unchecked حساب wrappers. Auditors should scan all state-mutating handlers و ask: who can call this و what proves authorization?\n\n**Missing owner checks** create حساب substitution risk. Programs may deserialize حساب bytes و trust semantic fields without proving the حساب is owned by the expected program. In mixed CPI systems, this is especially dangerous because حساب shapes can look valid while semantics differ. Mitigation is explicit owner validation before parsing و strict حساب type usage.\n\n**PDA seed/bump mismatch** appears when seed ordering, domain tags, or bump handling drifts between تعليمات. One handler derives [\"vault\", authority], another derives [authority, \"vault\"], a third trusts client-provided bump. Attackers search those inconsistencies to route privileged logic through spoofed addresses. Mitigation is canonical seed schema, exact re-derivation on every sensitive path, و tests that intentionally pass malformed PDA candidates.\n\n**CPI authority confusion** happens when one program delegates authority assumptions to another without strict scope. If signer seeds or delegated permissions are broader than intended, downstream calls can perform unintended state transitions. Mitigation includes explicit CPI allowlists, minimal writable/signer metas, و scope-limited delegated authorities.\n\n**Integer overflow/underflow** remains a عملي class in accounting-heavy systems. Rust release mode behavior makes unchecked arithmetic unacceptable ل balances و fee logic. Mitigation is checked operations, u128 intermediates ل multiply/divide paths, و boundary-focused tests.\n\nMitigation quality depends on verification quality. Unit tests should include adversarial حساب substitutions, malformed seeds, missing signers, و boundary arithmetic. If tests only cover happy paths, high-severity bugs will survive code review.\n\nThe audit deliverable should translate classes into implementation guidance. Engineers need clear, actionable remediations و concrete reproduction conditions, not generic warnings. The best reports include checklists that can be wired into CI و release gates.\n\n## Checklist\n- Enumerate all privileged تعليمات و expected signers.\n- Verify owner checks before parsing external حساب layouts.\n- Pin و document PDA seed schemas و bump usage.\n- Validate CPI target program IDs against allowlist.\n- Minimize writable و signer حساب metas in CPI.\n- Enforce checked math ل all u64 state transitions.\n- Add negative tests ل each bug class.\n- Require deterministic traces ل الامان-critical tests.\n\n## Red flags\n- Any privileged mutation path without explicit signer requirement.\n- Any unchecked حساب deserialization path.\n- Any تعليمة that accepts bump without re-derivation.\n- Any CPI call to dynamic or user-selected program ID.\n- Any unchecked arithmetic on balances or supply values.\n\n## How to verify (simulator)\n- Use درس 4 scenario to confirm unauthorized withdraw in vulnerable mode.\n- Use درس 5 scenario to confirm spoofed PDA acceptance in vulnerable mode.\n- Use درس 6 patch suite to verify fixed-mode errors by code.\n- Run checkpoint report و ensure all scenarios are marked reproduced.\n- Inspect invariant result array ل all fixed-mode scenarios.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l3-q1",
                    "prompt": "What is the strongest mitigation ل PDA spoof risks?",
                    "options": [
                      "Canonical seed schema مع exact re-derivation + bump verification",
                      "Accepting any PDA-like prefix",
                      "Trusting client-provided bump values"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic re-derivation closes spoofable PDA substitution paths."
                  },
                  {
                    "id": "security-v2-l3-q2",
                    "prompt": "Why are negative-path tests required ل audit confidence?",
                    "options": [
                      "Because most exploitable bugs only appear under malformed or adversarial input",
                      "Because happy-path tests cover all الامان cases",
                      "Because traces are optional without them"
                    ],
                    "answerIndex": 0,
                    "explanation": "الامان failures are usually adversarial edge cases, so tests must target those edges directly."
                  }
                ]
              }
            ]
          }
        }
      },
      "security-v2-vuln-lab": {
        "title": "Vuln Lab Project Journey",
        "description": "Exploit, patch, verify, و produce audit-ready artifacts مع deterministic traces و invariant-backed conclusions.",
        "lessons": {
          "security-v2-exploit-signer-owner": {
            "title": "Break it: exploit missing signer + owner checks",
            "content": "# Break it: exploit missing signer + owner checks\n\nImplement a deterministic exploit-proof formatter ل signer/owner vulnerabilities.\n\nExpected output fields:\n- scenario\n- before/after vault balance\n- before/after recipient lamports\n- trace hash\n- explanation مع drained lamports\n\nUse canonical key ordering so tests can assert exact JSON output.",
            "duration": "40 min",
            "hints": [
              "Compute drained lamports from recipient before/after.",
              "Include deterministic field ordering in the JSON output.",
              "The explanation should mention missing signer/owner validation."
            ]
          },
          "security-v2-exploit-pda-spoof": {
            "title": "Break it: exploit PDA spoof mismatch",
            "content": "# Break it: exploit PDA spoof mismatch\n\nImplement a deterministic PDA spoof proof output.\n\nYou must show:\n- expected PDA\n- accepted PDA\n- mismatch boolean\n- trace hash\n\nThis درس validates evidence generation ل derivation mismatches.",
            "duration": "40 min",
            "hints": [
              "Return whether expectedPda و acceptedPda differ.",
              "Use strict boolean output ل mismatch.",
              "Keep output key order stable."
            ]
          },
          "security-v2-patch-validate": {
            "title": "Fix it: validations + invariant suite",
            "content": "# Fix it: validations + invariant suite\n\nImplement patch validation output that confirms:\n- signer check\n- owner check\n- PDA check\n- safe u64 arithmetic\n- exploit blocked state مع error code\n\nKeep output deterministic ل exact assertion.",
            "duration": "45 min",
            "hints": [
              "All four controls must be true ل a complete patch.",
              "Use fixedBlockedExploit to set blocked status.",
              "Return error code only when blocked is true."
            ]
          },
          "security-v2-writing-reports": {
            "title": "Writing audit reports: severity, likelihood, blast radius, remediation",
            "content": "# Writing audit reports: severity, likelihood, blast radius, remediation\n\nA strong audit report is an engineering document, not a narrative essay. It should allow a reader to answer four questions quickly: what failed, how exploitable it is, how much damage it can cause, و what exact change prevents recurrence. الامان writing quality directly affects fix quality because implementation teams ship what they can interpret.\n\nSeverity should be tied to impact و exploit preconditions. A missing signer check in a withdraw path is typically critical if it allows unauthorized asset movement مع low prerequisites. A PDA mismatch may be high or medium depending on reachable code paths و available controls. Severity labels without rationale are not useful. Include explicit exploit path assumptions و whether attacker capital or privileged positioning is required.\n\nLikelihood should capture عملي exploitability, not theoretical possibility. ل example, if a bug requires impossible حساب states under current architecture, likelihood may be low even if impact is high. Conversely, if a bug is reachable by submitting a standard تعليمة مع crafted حساب metas, likelihood is high. Be specific.\n\nBlast radius should describe what can be drained or corrupted: one vault, one market, protocol-wide state, or الحوكمة authority. This framing helps teams stage incident response و patch rollout.\n\nRecommendations must be precise و testable. “Add better validation” is too vague. “Require authority signer, verify authority key matches vault state, verify vault owner equals program id, و verify PDA from [\"vault\", authority] + bump” is actionable. Include expected error codes so QA can validate behavior reliably.\n\nEvidence references are also important. Each finding should point to deterministic traces, scenario IDs, و checkpoint artifacts so another engineer can replay without interpretation gaps.\n\nFinally, include verification results. A patch is not complete until exploit scenarios fail deterministically و invariants hold. Reports that end before verification force downstream teams to rediscover completion criteria.\n\nReport structure should also prioritize scanability. Teams reviewing multiple findings under incident pressure need consistent field ordering و concise language that maps directly to engineering actions. If one finding uses narrative prose while another uses structured reproduction steps, remediation speed drops because readers spend time normalizing format instead of executing fixes.\n\nA reliable pattern is one finding per vulnerability class مع explicit evidence references grouped by scenario ID. That allows QA, auditors, و protocol engineers to coordinate on the same deterministic artifacts. The same approach also improves long-term maintenance: when code changes, teams can rerun scenario IDs و compare trace hashes to detect regressions in report assumptions.\n\n## Checklist\n- State explicit vulnerability class و affected تعليمة path.\n- Include reproducible scenario ID و deterministic trace hash.\n- Quantify impact مع concrete state/balance deltas.\n- Assign severity مع rationale tied to exploit preconditions.\n- Assign likelihood based on realistic attacker capabilities.\n- Describe blast radius at حساب/protocol boundary.\n- Provide exact remediation steps و expected error codes.\n- Include verification outcomes و invariant results.\n\n## Red flags\n- Severity labels without impact rationale.\n- Recommendations without concrete validation rules.\n- No reproduction steps or trace references.\n- No fixed-mode verification evidence.\n- No distinction between impact و likelihood.\n\n## How to verify (simulator)\n- Generate report JSON from checkpoint builder.\n- Confirm findings include evidenceRefs ل each scenario.\n- Confirm remediation includes patch IDs.\n- Confirm verification results mark each scenario as blocked in fixed mode.\n- Generate markdown summary و compare to report content ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l7-q1",
                    "prompt": "What is the key difference between severity و likelihood?",
                    "options": [
                      "Severity measures impact; likelihood measures عملي exploitability",
                      "They are interchangeable labels",
                      "Likelihood is only ل low-severity bugs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Good reports separate damage potential from exploit feasibility."
                  },
                  {
                    "id": "security-v2-l7-q2",
                    "prompt": "Which recommendation is most actionable?",
                    "options": [
                      "Require signer + owner + PDA checks مع explicit error codes",
                      "Improve الامان in this function",
                      "Add more comments"
                    ],
                    "answerIndex": 0,
                    "explanation": "Actionable recommendations map directly to code changes و tests."
                  }
                ]
              }
            ]
          },
          "security-v2-audit-report-checkpoint": {
            "title": "Checkpoint: deterministic AuditReport JSON + markdown",
            "content": "# Checkpoint: deterministic AuditReport JSON + markdown\n\nCreate the final deterministic checkpoint payload:\n- دورة + version\n- scenario IDs\n- finding count\n\nThis checkpoint mirrors the final دورة artifact produced by the simulator report builder.",
            "duration": "45 min",
            "hints": [
              "Return stable, minimal checkpoint metadata.",
              "دورة must be solana-الامان و version must be v2.",
              "Preserve scenarioIds order as provided."
            ]
          }
        }
      }
    }
  },
  "token-engineering": {
    "title": "Token Engineering on Solana",
    "description": "Project-journey دورة ل teams launching real Solana tokens: deterministic Token-2022 planning, authority التصميم, supply simulation, و operational launch discipline.",
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
        "description": "Understand token primitives, mint policy anatomy, و Token-2022 extension controls مع explicit الحوكمة و threat-model framing.",
        "lessons": {
          "token-v2-spl-vs-token-2022": {
            "title": "SPL tokens vs Token-2022: what extensions change",
            "content": "# SPL tokens vs Token-2022: what extensions change\n\nToken engineering starts مع a clean boundary between base token semantics و configurable policy. Legacy SPL Token gives you a stable fungible primitive: mint metadata, token حسابات, mint authority, freeze authority, و transfer/mint/burn تعليمات. Token-2022 preserves that core interface but adds extension slots that let teams activate richer behavior without rewriting token logic from scratch. That compatibility is useful, but it also creates a new class of الحوكمة و safety decisions that frontend و protocol engineers need to model explicitly.\n\nThe key النموذج الذهني: Token-2022 is not a separate economic system; it is an extended حساب layout و تعليمة surface. Extensions are opt-in, و each extension adds bytes, authorities, و state transitions that must be considered during mint initialization و lifecycle management. If you treat extensions as cosmetic add-ons, you can ship a token that is technically valid but operationally fragile.\n\nل production teams, the first decision is policy minimalism. Every enabled extension increases complexity in محافظ, indexers, و downstream integrations. Transfer fees may fit treasury goals but can break assumptions in partner protocols. Default حساب state can enforce safety posture but may confuse users if حساب thaw flow is unclear. Permanent delegate can simplify managed flows but dramatically expands power if authority boundaries are weak. The right approach is to map each extension to a concrete requirement و document the explicit threat model it introduces.\n\nToken-2022 also changes launch sequencing. You must pre-size mint حسابات ل chosen extensions, initialize extension data in deterministic order, و verify authority alignment before live distribution. This is where deterministic offline planning is valuable: you can generate a launch pack, inspect تعليمة-like payloads, و validate invariants before touching network systems. That practice catches configuration drift early و gives reviewers a reproducible artifact.\n\nFinally, extension-aware التصميم is an integration problem, not just a contract problem. Product و support teams need clear messaging ل fee behavior, frozen حساب states, و delegated capabilities. If users cannot predict token behavior from محفظة prompts و docs, operational risk rises even when code is formally correct.\n\n## Decision framework ل extension selection\n\nل each extension, force three answers before enabling it:\n1. What concrete product requirement does this solve now?\n2. Which authority can abuse this if compromised?\n3. How will users و integrators observe this behavior in UX و docs?\n\nIf any answer is vague, extension scope is probably too broad.\n\n## Pitfall: Extension creep without threat modeling\n\nAdding multiple extensions \"ل flexibility\" often creates overlapping authority powers و unpredictable UX. Enable only the extensions your product can govern, monitor, و explain end-to-end.\n\n## Sanity Checklist\n\n1. Define one explicit business reason per extension.\n2. Document extension authorities و revocation strategy.\n3. Verify partner compatibility assumptions before launch.\n4. Produce deterministic initialization artifacts ل review.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l1-q1",
                    "prompt": "What is the safest default posture ل Token-2022 extension selection?",
                    "options": [
                      "Enable only extensions مع clear product و risk justification",
                      "Enable all extensions ل future flexibility",
                      "Disable authorities entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "Every extension adds الحوكمة و integration complexity, so scope should stay intentional."
                  },
                  {
                    "id": "token-v2-l1-q2",
                    "prompt": "Why generate an offline deterministic launch pack before devnet/mainnet actions?",
                    "options": [
                      "To review تعليمة intent و invariants before execution",
                      "To avoid configuring decimals",
                      "To bypass authority checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic planning provides reproducible review artifacts و catches config drift early."
                  }
                ]
              }
            ]
          },
          "token-v2-mint-anatomy": {
            "title": "Mint anatomy: authorities, decimals, supply, freeze, mint",
            "content": "# Mint anatomy: authorities, decimals, supply, freeze, mint\n\nA production token launch succeeds or fails on parameter discipline. The mint حساب is a compact policy object: it defines decimal precision, minting authority, optional freeze authority, و extension configuration. Token حسابات then represent balances ل owners, usually through ATAs. If these pieces are configured inconsistently, downstream systems see contradictory behavior و user trust erodes quickly.\n\nDecimals are one of the most underestimated parameters. They influence UI formatting, fee interpretation, و business logic in integrations. While high precision can feel \"future-proof,\" excessive decimals often create rounding edge cases in analytics و partner systems. Constraining decimals to a documented operational range و validating it at config time is a عملي defensive rule.\n\nAuthority layout should be explicit و minimal. Mint authority controls supply growth. Freeze authority controls حساب-level transfer ability. Update authority (ل metadata-linked policy) can affect user-facing trust و protocol assumptions. Teams often reuse one operational key ل convenience, then struggle to separate powers later. A better pattern is to predefine authority roles و revocation milestones as part of launch الحوكمة.\n\nSupply planning should distinguish issuance from distribution. Initial supply tells you what is minted; recipient allocations tell you what is distributed at launch. Those values should be validated مع exact integer math, not float formatting. Invariant checks such as `recipientsTotal <= initialSupply` are simple but prevent serious release mistakes.\n\nToken-2022 extensions deepen this anatomy. Transfer fee config introduces fee basis points و caps; default حساب state changes حساب activation posture; permanent delegate creates a privileged transfer actor. Each extension implies additional authority و monitoring requirements. Your launch plan must encode these requirements as explicit steps و include human-readable labels so reviewers can confirm intent.\n\nFinally, deterministic address derivation in دورة tooling is a useful engineering discipline. Even when pseudo-addresses are used ل offline planning, stable derivation functions improve reproducibility و reduce reviewer ambiguity. The same mindset carries to real deployments where deterministic حساب derivation is foundational.\n\nStrong teams also pair mint-anatomy reviews مع explicit incident playbooks: what to do if an authority key is lost, rotated, or compromised, و how to communicate those events to integrators without causing panic.\n\n## Pitfall: One-key authority convenience\n\nUsing a single key ل minting, freezing, و metadata updates simplifies setup but concentrates risk. Authority compromise then becomes a full-token compromise rather than a contained incident.\n\n## Sanity Checklist\n\n1. Validate decimals و supply fields before plan generation.\n2. Record mint/freeze/update authority roles و custody model.\n3. Confirm recipient allocation totals مع integer math.\n4. Review extension authorities independently from mint authority.\n",
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
                      "Because token حسابات store floats"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply و distribution correctness depends on exact arithmetic over integer base units."
                  },
                  {
                    "id": "token-v2-l2-q2",
                    "prompt": "What is the primary role of freeze authority?",
                    "options": [
                      "Controlling whether specific token حسابات can transfer",
                      "Changing token symbol",
                      "Computing transfer fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freeze authority governs transfer state at حساب level, not branding or fee math."
                  }
                ]
              }
            ]
          },
          "token-v2-extension-safety-pitfalls": {
            "title": "Extension safety pitfalls: fee configs, delegate abuse, default حساب state",
            "content": "# Extension safety pitfalls: fee configs, delegate abuse, default حساب state\n\nToken-2022 extensions let teams express policy in a standard token framework, but policy power is exactly where operational failures happen. الامان issues in token launches are rarely exotic cryptography failures. They are usually configuration mistakes: fee caps set too high, delegates granted too broadly, or frozen default states introduced without recovery controls. Production engineering must treat extension configuration as safety-critical logic.\n\nTransfer fee configuration is a good example. A basis-point fee looks simple, yet behavior depends on cap interaction و token decimals. If maxFee is undersized, large transfers saturate quickly و effective fee curve becomes nonlinear. If maxFee is oversized, treasury extraction can exceed expected user tolerance. Deterministic simulations across example transfer sizes are essential before launch, و those simulations should be reviewed by both protocol و product teams.\n\nPermanent delegate is another high-risk feature. It can enable managed flows, but it also creates a privileged actor that may transfer tokens without normal owner signatures depending on policy scope. If delegate authority is not governed by clear controls و revocation procedures, compromise risk rises sharply. In many incidents, teams enabled delegate-like authority ل convenience, then discovered too late that الحوكمة و monitoring were insufficient.\n\nDefault حساب state introduces user-experience و compliance implications. A frozen default state can enforce controlled activation, but it also creates onboarding failure if thaw paths are unclear or unavailable in partner محافظ. Teams should verify thaw strategy, authority custody, و fallback procedures before enabling frozen defaults in production.\n\nThe safest engineering workflow is deterministic و reviewable: validate config, normalize extension fields, generate initialization plan labels, simulate transfer outcomes, و produce invariant lists. That sequence creates a shared artifact ل engineering, الامان, legal, و support stakeholders. When questions arise, teams can inspect exact intended policy rather than infer from fragmented scripts.\n\nFinally, treat extension combinations as compounded risk. Each extension may be individually reasonable, yet combined authority interactions can create hidden escalation paths. Cross-extension threat modeling is therefore mandatory ل serious launches.\n\n## Pitfall: Fee و delegate settings shipped without scenario simulation\n\nTeams often validate only \"happy path\" transfer examples. Without boundary simulations و authority abuse scenarios, dangerous configurations can pass review و surface only after users are affected.\n\n## Sanity Checklist\n\n1. Simulate fee behavior at low/medium/high transfer sizes.\n2. Document delegate authority scope و emergency revocation path.\n3. Verify frozen default حسابات have explicit thaw operations.\n4. Review combined extension authority interactions ل escalation risk.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l3-q1",
                    "prompt": "Why does transfer-fee max cap need scenario الاختبار?",
                    "options": [
                      "It can materially change effective fee behavior across transfer sizes",
                      "It only affects metadata",
                      "It is ignored once mint is initialized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee cap interacts مع basis points و can distort economic behavior if misconfigured."
                  },
                  {
                    "id": "token-v2-l3-q2",
                    "prompt": "What is a core risk of permanent delegate configuration?",
                    "options": [
                      "Privilege concentration if authority الحوكمة is weak",
                      "Loss of decimal precision",
                      "Automatic محفظة incompatibility"
                    ],
                    "answerIndex": 0,
                    "explanation": "Delegate privileges must be constrained و governed like high-sensitivity access."
                  }
                ]
              }
            ]
          },
          "token-v2-validate-config-derive": {
            "title": "Validate token config + derive deterministic addresses offline",
            "content": "# Validate token config + derive deterministic addresses offline\n\nImplement strict config validation و deterministic pseudo-derivation:\n- validate decimals, u64 strings, recipient totals, extension fields\n- derive stable pseudo mint و ATA addresses from hash seeds\n- return normalized validated config + derivations\n",
            "duration": "35 min",
            "hints": [
              "Validate decimal bounds, u64-like numeric strings, و recipient totals before derivation.",
              "Use one deterministic seed format ل mint و one ل ATA derivation.",
              "Keep output key order stable so checkpoint tests are reproducible."
            ]
          }
        }
      },
      "token-v2-module-launch-pack": {
        "title": "Token Launch Pack Project",
        "description": "Build deterministic validation, planning, و simulation workflows that produce reviewable launch artifacts و clear go/no-go criteria.",
        "lessons": {
          "token-v2-build-init-plan": {
            "title": "Build Token-2022 initialization تعليمة plan",
            "content": "# Build Token-2022 initialization تعليمة plan\n\nCreate a deterministic offline initialization plan:\n- create mint حساب step\n- init mint step مع decimals\n- append selected extension steps in stable order\n- base64 encode step payloads مع explicit encoding version\n",
            "duration": "35 min",
            "hints": [
              "Add base steps first: create mint حساب, then initialize mint مع decimals.",
              "Append extension steps in deterministic order so plan labels are stable.",
              "Encode each step payload مع version + sorted params before base64 conversion."
            ]
          },
          "token-v2-simulate-fees-supply": {
            "title": "Build mint-to + transfer-fee math + simulation",
            "content": "# Build mint-to + transfer-fee math + simulation\n\nImplement pure simulation ل transfer fees و launch distribution:\n- fee = min(maxFee, floor(amount * feeBps / 10000))\n- aggregate distribution totals deterministically\n- ensure no negative supply و no oversubscription\n",
            "duration": "35 min",
            "hints": [
              "Transfer fee formula: fee = min(maxFee, floor(amount * feeBps / 10000)).",
              "Aggregate distributed و fee totals using BigInt to keep math exact.",
              "Fail when distributed amount exceeds initial supply."
            ]
          },
          "token-v2-launch-checklist": {
            "title": "Launch checklist: params, upgrade/authority strategy, airdrop/الاختبار plan",
            "content": "# Launch checklist: params, upgrade/authority strategy, airdrop/الاختبار plan\n\nA successful token launch is an operations exercise as much as a programming task. By the time users see your token in محافظ, dozens of choices have already constrained safety, الحوكمة, و UX. Production token engineering therefore needs a launch checklist that turns abstract التصميم intent into verifiable execution steps.\n\nStart مع parameter closure. Name, symbol, decimals, initial supply, authority addresses, extension configuration, و recipient allocations must be finalized و reviewed as one immutable package before execution. Many launch incidents come from late parameter changes made in disconnected scripts. Deterministic launch pack generation prevents this by forcing a single source of truth.\n\nAuthority strategy is the second pillar. Decide which authorities remain active after launch, which are revoked, و which move to multisig custody. A common best practice is staged authority reduction: keep temporary controls through rollout validation, then revoke or transfer to الحوكمة once monitoring baselines are stable. This must be planned explicitly, not improvised during launch day.\n\nالاختبار strategy should include deterministic offline tests و limited online rehearsal. Offline checks validate config schemas, تعليمة payload encoding, fee simulations, و supply invariants. Optional devnet rehearsal validates operational playbooks (funding, sequence execution, monitoring) but should not be your only validation layer. If offline checks fail, devnet success is not meaningful.\n\nAirdrop و distribution planning should include recipient reconciliation و rollback strategy. Teams often focus on minting و forget operational constraints around recipient list correctness, timing windows, و support escalation paths. Deterministic distribution plans مع stable labels make reconciliation simpler و reduce accidental double execution.\n\nMonitoring و communication are equally important. Define launch metrics in advance: minted supply observed, distribution completion count, fee behavior sanity, و extension-specific health checks. Publish user-facing notices ل any non-obvious behavior such as transfer fees or frozen default حساب state. Clear communication lowers support load و improves trust.\n\nFinally, write down hard stop conditions. If invariants fail, if authority keys mismatch, or if distribution deltas diverge from expected totals, launch should pause immediately. Engineering discipline means refusing to proceed when safety checks are red.\n\n## Pitfall: Treating launch as a one-shot script run\n\nWithout an explicit checklist و rollback criteria, teams can execute technically valid تعليمات that violate business or الحوكمة intent. Successful launches are controlled workflows, not single commands.\n\n## Sanity Checklist\n\n1. Freeze a canonical config payload before execution.\n2. Approve authority lifecycle و revocation milestones.\n3. Run deterministic offline simulation و invariant checks.\n4. Reconcile recipient totals و distribution labels.\n5. Define go/no-go criteria و escalation owners.\n",
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
                      "To prevent script/config drift between review و launch",
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
            "content": "# Emit stable LaunchPackSummary\n\nCompose full project output as stable JSON:\n- normalized authorities و extensions\n- supply totals و optional fee model examples\n- deterministic plan metadata و invariants\n- fixtures hash + encoding version metadata\n",
            "duration": "45 min",
            "hints": [
              "Keep checkpoint JSON key ordering fixed so output is stable.",
              "Compute recipientsTotal و remaining مع exact integer math.",
              "Include determinism metadata (fixtures hash + encoding version) in the final object."
            ]
          }
        }
      }
    }
  },
  "solana-mobile": {
    "title": "Solana Mobile Development",
    "description": "Build production-ready mobile Solana dApps مع MWA, robust محفظة session architecture, explicit signing UX, و disciplined distribution operations.",
    "duration": "6 hours",
    "tags": [
      "mobile",
      "saga",
      "dapp-store",
      "react-native"
    ],
    "modules": {
      "module-mobile-wallet-adapter": {
        "title": "Mobile محفظة Adapter",
        "description": "Core MWA protocol, session lifecycle control, و resilient محفظة handoff patterns ل production mobile apps.",
        "lessons": {
          "mobile-wallet-overview": {
            "title": "Mobile محفظة نظرة عامة",
            "content": "# Mobile محفظة نظرة عامة\n\nSolana Mobile development is built around the Solana Mobile Stack (SMS), a set of standards و tooling designed ل secure, high-quality crypto-native mobile experiences. SMS is more than a hardware initiative; it defines interoperable محفظة communications, trusted execution patterns, و distribution infrastructure tailored to Web3 apps.\n\nA core piece is the Mobile محفظة Adapter (MWA) protocol. Instead of embedding private keys in dApps, MWA connects mobile dApps to external محفظة apps ل authorization, signing, و معاملة submission. This separation mirrors browser محفظة الامان on desktop و prevents dApps from directly handling secret keys.\n\nSaga introduced the first flagship reference device ل Solana Mobile concepts, including Seed Vault-oriented workflows. Even when users are not on Saga, SMS standards remain useful because protocol-level interoperability is the target: any محفظة implementing MWA can serve compatible apps.\n\nThe Solana dApp Store is another foundational element. It provides a distribution channel ل crypto applications مع policy considerations better aligned to on-chain apps than traditional app stores. Teams can ship محفظة-native functionality, tokenized features, و on-chain social mechanics without the same constraints often imposed by conventional app marketplaces.\n\nKey architectural principles ل mobile Solana apps:\n\n- Keep signing in محفظة context, not app context.\n- Treat session authorization as revocable و short-lived.\n- Build graceful fallback if محفظة app is missing.\n- Optimize ل intermittent connectivity و mobile latency.\n\nTypical mobile flow:\n\n1. dApp requests authorization via MWA.\n2. محفظة prompts user to approve حساب access.\n3. dApp builds معاملات و requests signatures.\n4. محفظة returns signed payload or submits معاملة.\n5. dApp observes confirmation و updates UI.\n\nMobile UX needs explicit state transitions (authorizing, awaiting محفظة, signing, submitted, confirmed). Ambiguity causes user drop-off quickly on small screens.\n\nل Solana teams, mobile is not a “mini web app”; it requires deliberate protocol و UX التصميم choices. SMS و MWA provide a secure baseline so developers can ship on-chain experiences مع production-grade signing و session models on handheld devices.\n\n## عملي architecture split\n\nTreat your mobile stack as three independent systems:\n1. UI app state و navigation.\n2. محفظة transport/session state (MWA lifecycle).\n3. On-chain معاملة intent و confirmation state.\n\nIf you couple these layers tightly, محفظة switch interruptions و app backgrounding can corrupt flow state. If they stay separated, recovery is predictable.\n\n## What users should feel\n\nGood mobile crypto UX is not \"fewer steps at all costs.\" It is clear intent, explicit signing context, و safe recoverability when app switching or network instability happens.\n",
            "duration": "35 min"
          },
          "mwa-integration": {
            "title": "MWA Integration",
            "content": "# MWA Integration\n\nIntegrating Mobile محفظة Adapter typically starts مع `@solana-mobile/mobile-wallet-adapter` APIs و an interaction pattern built around `transact()`. Within a معاملة session, the app can authorize, request capabilities, sign معاملات, و handle محفظة responses in a structured way.\n\nA simplified integration flow:\n\n```typescript\nimport { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';\n\nawait transact(async (wallet) => {\n  const auth = await wallet.authorize({\n    cluster: 'devnet',\n    identity: { name: 'JazzCode Mobile', uri: 'https://jazzcode.vercel.app' },\n  });\n\n  const account = auth.accounts[0];\n  // build tx, request signing/submission\n});\n```\n\nAuthorization yields one or more حسابات plus auth tokens ل session continuation. Persist these tokens carefully و invalidate them on sign-out. Do not assume tokens remain valid forever; محفظة apps can revoke sessions.\n\nل signing, you can request:\n\n- `signTransactions` (sign only)\n- `signAndSendTransactions` (محفظة signs و submits)\n- `signMessages` (SIWS-like auth flows)\n\nDeep links are used under the hood to switch between your dApp و محفظة. That means state restoration matters: your app should survive process backgrounding و resume pending operation state on return.\n\nعملي engineering tips:\n\n- Implement idempotent معاملة request handling.\n- Show a visible “Waiting ل محفظة approval” state.\n- Handle user cancellation explicitly, not as generic failure.\n- Retry network submission separately from signing when possible.\n\nالامان considerations:\n\n- Bind sessions to app identity metadata.\n- Use short-lived backend nonces ل message-sign auth.\n- Never log full signed payloads مع sensitive context.\n\nMWA is effectively your mobile signing transport layer. If its state machine is robust, your app feels professional و trustworthy. If state handling is weak, users experience “stuck” flows و may distrust the dApp even if on-chain logic is correct.",
            "duration": "35 min"
          },
          "mobile-transaction": {
            "title": "Build a Mobile معاملة Function",
            "content": "# Build a Mobile معاملة Function\n\nImplement a helper that formats a deterministic MWA معاملة request summary string.\n\nExpected output format:\n\n`<cluster>|<payer>|<instructionCount>`\n\nUse this exact order و delimiter.",
            "duration": "50 min",
            "hints": [
              "Add validation before returning the formatted string.",
              "instructionCount should be treated as a number but returned as text.",
              "Throw exact error message ل missing payer."
            ]
          }
        }
      },
      "module-dapp-store-and-distribution": {
        "title": "dApp Store & Distribution",
        "description": "Publishing, operational readiness, و trust-centered mobile UX practices ل Solana app distribution.",
        "lessons": {
          "dapp-store-submission": {
            "title": "dApp Store Submission",
            "content": "# dApp Store Submission\n\nPublishing to the Solana dApp Store requires more than packaging binaries. Teams should treat submission as a product, compliance, و الامان review process. A strong submission demonstrates safe محفظة interactions, clear user communication, و operational readiness.\n\nSubmission readiness checklist:\n\n- Stable release builds ل target Android devices.\n- Clear app identity و support channels.\n- محفظة interaction flows tested ل cancellation و failure recovery.\n- Privacy policy و terms aligned to on-chain behaviors.\n- Transparent handling of tokenized features و in-app value flows.\n\nOne distinguishing concept in Solana mobile distribution is token-aware product التصميم. Apps may use NFT-gated access, on-chain subscriptions, or tokenized entitlements. These flows must be understandable to users و not hide financial consequences. Review teams typically evaluate whether permissions و محفظة prompts are proportional to app behavior.\n\nNFT-based licensing models can be implemented by checking ownership of specific collection assets at runtime. If licensing depends on assets, build robust indexing و refresh behavior so users are not locked out due to temporary RPC/indexer mismatch.\n\nOperational افضل الممارسات ل review success:\n\n- Provide reproducible test حسابات و walkthroughs.\n- Include a “safe mode” or demo path if محفظة connection fails.\n- Avoid unexplained signature prompts.\n- Log non-sensitive diagnostics ل support.\n\nPost-submission lifecycle matters too. Plan how you will handle urgent fixes, محفظة SDK updates, و chain-level incidents. Mobile releases can take time to propagate, so feature flags و backend kill-switches ل risky pathways are valuable.\n\nDistribution strategy should also include analytics around onboarding funnels, محفظة connect success rates, و معاملة completion rates. These metrics identify mobile-specific friction that desktop-oriented teams often miss.\n\nA successful dApp Store submission reflects secure protocol integration و mature product operations. If your محفظة interactions are explicit, fail-safe, و user-centered, your app is far more likely to pass review و retain users in production.",
            "duration": "35 min"
          },
          "mobile-best-practices": {
            "title": "Mobile افضل الممارسات",
            "content": "# Mobile افضل الممارسات\n\nMobile crypto UX requires balancing speed, safety, و trust. Users make high-stakes decisions on small screens, often on unstable networks. Solana mobile apps should therefore optimize ل explicitness و recoverability, not just visual polish.\n\n**Biometric gating** is useful ل sensitive local actions (revealing seed-dependent views, exporting حساب data, approving high-risk actions), but محفظة-level signing decisions should remain in محفظة app context. Avoid building fake in-app “confirm” screens that look like signing prompts.\n\n**Session keys و scoped auth** improve UX by reducing repetitive approvals. However, scope must be tightly constrained (allowed methods, time window, limits). Session credentials should be revocable و auditable.\n\n**Offline و poor-network behavior** must be handled intentionally:\n\n- Queue non-critical reads.\n- Retry idempotent submissions مع backoff.\n- Distinguish “signed but not submitted” from “submitted but unconfirmed.”\n\n**Push notifications** are valuable ل معاملة outcomes, liquidation alerts, و الحوكمة events. Notifications should include enough context ل user safety but never leak sensitive data.\n\nUX patterns that consistently improve conversion:\n\n- Show معاملة simulation summaries before محفظة handoff.\n- Display clear statuses: building, awaiting signature, submitted, confirmed.\n- Provide explorer links و retry actions.\n- Use plain-language error messages مع suggested fixes.\n\nالامان hygiene:\n\n- Pin trusted RPC endpoints or use reputable providers مع fallback.\n- Validate حساب ownership و expected program IDs on all client-side decoded data.\n- Protect analytics pipelines from sensitive payload leakage.\n\nAccessibility و internationalization matter ل global adoption. Ensure touch targets, contrast, و localization of risk messages are adequate. ل crypto workflows, misunderstanding can cause irreversible loss.\n\nFinally, measure reality: connect success rate, signature approval rate, drop-off after محفظة switch, و average time-to-confirmation. Mobile teams that instrument these metrics can iteratively remove friction و increase trust.\n\nGreat Solana mobile apps feel predictable under stress. If users always understand what they are signing, what state they are in, و how to recover, your product is operating at production quality.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-testing": {
    "title": "الاختبار Solana Programs",
    "description": "Build robust Solana الاختبار systems across local, simulated, و network environments مع explicit الامان invariants و release-quality confidence gates.",
    "duration": "6 hours",
    "tags": [
      "testing",
      "bankrun",
      "anchor",
      "devnet"
    ],
    "modules": {
      "module-testing-foundations": {
        "title": "الاختبار Foundations",
        "description": "Core test strategy across unit/integration layers مع deterministic workflows و adversarial case coverage.",
        "lessons": {
          "testing-approaches": {
            "title": "الاختبار Approaches",
            "content": "# الاختبار Approaches\n\nالاختبار Solana programs requires multiple layers because failures can occur in logic, حساب validation, معاملة composition, or network behavior. A production الاختبار strategy usually combines unit tests, integration tests, و end-to-end validation across local مدققون و devnet.\n\n**Unit tests** validate isolated business logic مع minimal runtime overhead. In Rust, pure helper functions (math, state transitions, invariant checks) should be unit-tested aggressively because they are easy to execute و fast in CI.\n\n**Integration tests** execute against realistic program invocation paths. ل Anchor projects, this often means `anchor test` مع local مدقق setup, حساب initialization flows, و تعليمة-level assertions. Integration tests should cover both positive و adversarial inputs, including invalid حسابات, unauthorized signers, و boundary values.\n\n**End-to-end tests** include frontend/client composition plus محفظة و RPC interactions. They catch issues that lower layers miss: incorrect حساب ordering, wrong PDA derivations in client code, و serialization mismatches.\n\nCommon tools:\n\n- `solana-program-test` ل Rust-side الاختبار مع in-process banks simulation.\n- `solana-bankrun` ل deterministic TypeScript integration الاختبار.\n- Anchor TypeScript client ل تعليمة building و assertions.\n- Playwright/Cypress ل app-level معاملة flow tests.\n\nTest coverage priorities:\n\n1. Authorization و signer checks.\n2. حساب ownership و PDA seed constraints.\n3. Arithmetic boundaries و fee logic.\n4. CPI behavior و failure rollback.\n5. Upgrade compatibility و migration paths.\n\nA frequent anti-pattern is only الاختبار happy paths مع one محفظة و static inputs. This misses most exploit classes. Robust suites include malicious حساب substitution, stale or duplicated حسابات, و partial failure simulation.\n\nIn CI, separate fast deterministic suites from slower network-dependent suites. Run deterministic tests on every push, و run heavier devnet suites on merge or release.\n\nEffective Solana الاختبار is about confidence under adversarial conditions, not just green checkmarks. If your tests model attacker behavior و حساب-level edge cases, you will prevent the majority of production incidents before النشر.\n\n## عملي suite التصميم rule\n\nMap every critical تعليمة to at least one test in each layer:\n- unit test ل pure invariant/math logic\n- integration test ل حساب validation و state transitions\n- environment test ل محفظة/RPC orchestration\n\nIf one layer is missing, incidents usually appear in that blind spot first.",
            "duration": "35 min"
          },
          "bankrun-testing": {
            "title": "Bankrun الاختبار",
            "content": "# Bankrun الاختبار\n\nSolana Bankrun provides deterministic, high-speed test execution ل Solana programs from TypeScript environments. It emulates a local bank-like runtime where معاملات can be processed predictably, حسابات can be inspected directly, و temporal state can be manipulated ل الاختبار scenarios like vesting unlocks or oracle staleness.\n\nCompared مع relying on external devnet, Bankrun gives repeatability. This is crucial ل CI pipelines where flaky network behavior can mask regressions.\n\nTypical Bankrun workflow:\n\n1. Start test context مع target program loaded.\n2. Create keypairs و funded test حسابات.\n3. Build و process معاملات via BanksClient-like API.\n4. Assert post-معاملة حساب state.\n5. Advance slots/time ل time-dependent logic tests.\n\nConceptual setup:\n\n```typescript\n// pseudocode\nconst context = await startBankrun({ programs: [...] });\nconst client = context.banksClient;\n\n// process tx and inspect accounts deterministically\n```\n\nWhy Bankrun is powerful:\n\n- Fast iteration ل protocol teams.\n- Deterministic block/slot control.\n- Rich حساب inspection without explorer dependency.\n- Easy simulation of multi-step protocol flows.\n\nHigh-value Bankrun test scenarios:\n\n- Liquidation eligibility after oracle/time movement.\n- Vesting و cliff unlock schedule transitions.\n- Fee accumulator updates across many operations.\n- CPI behavior مع mocked downstream حساب states.\n\nCommon mistakes:\n\n- Asserting only معاملة success without state validation.\n- Ignoring rent و حساب lamport changes.\n- Not الاختبار replay/idempotency behaviors.\n\nUse helper factories ل test حسابات و PDA derivations so tests remain concise. Keep معاملة builders in reusable utilities to avoid drift between test و production clients.\n\nBankrun is not a replacement ل all environments, but it is one of the best layers ل deterministic integration confidence on Solana. Teams that invest in comprehensive Bankrun suites tend to catch state-machine bugs significantly earlier than teams relying only on devnet smoke tests.",
            "duration": "35 min"
          },
          "write-bankrun-test": {
            "title": "Write a Counter Program Bankrun Test",
            "content": "# Write a Counter Program Bankrun Test\n\nImplement a helper that returns the expected counter value after a sequence of increment operations. This mirrors a deterministic assertion you would use in a Bankrun test.\n\nReturn the final numeric value as a string.",
            "duration": "50 min",
            "hints": [
              "Use Array.reduce to sum increments.",
              "Start reduce مع the initial value.",
              "Convert final number to string before returning."
            ]
          }
        }
      },
      "module-advanced-testing": {
        "title": "متقدم الاختبار",
        "description": "Fuzzing, devnet validation, و CI/CD release controls ل safer protocol changes.",
        "lessons": {
          "fuzzing-trident": {
            "title": "Fuzzing مع Trident",
            "content": "# Fuzzing مع Trident\n\nFuzzing explores large input spaces automatically to find bugs that handcrafted tests miss. ل Solana و Anchor programs, Trident-style fuzzing workflows generate randomized تعليمة sequences و parameter values, then check invariants such as “total supply never decreases incorrectly” or “vault liabilities never exceed assets.”\n\nUnlike unit tests that validate expected examples, fuzzing asks: what if inputs are weird, extreme, or adversarial in combinations we did not think about?\n\nCore fuzzing components:\n\n- **Generators** ل تعليمة inputs و حساب states.\n- **Harness** that executes generated معاملات.\n- **Invariants** that must always hold.\n- **Shrinking** to minimize failing inputs ل debugging.\n\nUseful invariants in DeFi protocols:\n\n- Conservation of value across transfers و burns.\n- Non-negative balances و debt states.\n- Authority invariants (only valid signer modifies privileged state).\n- Price و collateral constraints under liquidation logic.\n\nFuzzing strategy tips:\n\n- Start مع a small تعليمة set و one invariant.\n- Add stateful multi-step scenarios (deposit->borrow->repay->withdraw).\n- Include random حساب ordering و malicious حساب substitution cases.\n- Track coverage to avoid blind spots.\n\nCoverage analysis matters: if fuzzing never reaches critical branches (error paths, CPI failure handlers, liquidation branches), it gives false confidence. Integrate branch coverage tools where possible.\n\nTrident و similar fuzzers are especially good at discovering arithmetic edge cases, stale state assumptions, و unexpected state transitions from unusual call sequences.\n\nCI integration approach:\n\n- Run short fuzz campaigns on every PR.\n- Run longer campaigns nightly.\n- Persist failing seeds as regression tests.\n\nFuzzing should complement, not replace, deterministic tests. Deterministic suites provide explicit behavior guarantees; fuzzing provides adversarial exploration at scale.\n\nل serious Solana protocols handling user funds, fuzzing is no longer optional. It is one of the highest-leverage investments ل preventing unknown-unknown bugs before mainnet exposure.",
            "duration": "35 min"
          },
          "devnet-testing": {
            "title": "Devnet الاختبار",
            "content": "# Devnet الاختبار\n\nDevnet الاختبار bridges the gap between deterministic local tests و real-world network conditions. While local مدققون و Bankrun are ideal ل speed و reproducibility, devnet reveals behavior under real RPC latency, block production timing, fee markets, و حساب history constraints.\n\nA robust devnet test strategy includes:\n\n- Automated program النشر to a dedicated devnet keypair.\n- Deterministic fixture creation (airdrop, mint setup, PDAs).\n- Smoke tests ل critical تعليمة paths.\n- Monitoring of معاملة confirmation و log outputs.\n\nImportant devnet caveats:\n\n- State is shared و can be noisy.\n- Airdrop limits can throttle tests.\n- RPC providers may differ in reliability و rate limits.\n\nTo reduce flakiness:\n\n- Use dedicated namespaces/seeds per CI run.\n- Add retries ل transient network failures.\n- Bound test runtime و fail مع actionable logs.\n\nProgram upgrade الاختبار is particularly important on devnet. Validate that new binaries preserve حساب compatibility و migrations execute as expected. Incompatible changes can brick existing حسابات if not tested.\n\nChecklist ل release-candidate validation:\n\n1. Deploy upgraded program binary.\n2. Run migration تعليمات.\n3. Execute backward-compatibility read paths.\n4. Execute all critical write تعليمات.\n5. Verify event/log schema expected by indexers.\n\nل financial protocols, include oracle integration tests و liquidation path checks against live-like feeds if possible.\n\nDevnet should not be your only quality gate, but it is the best pre-mainnet signal ل environment-related issues. Teams that ship without meaningful devnet validation often discover RPC edge cases و timing bugs in production.\n\nTreat devnet as a staging environment مع disciplined test orchestration, clear observability, و explicit rollback plans.",
            "duration": "35 min"
          },
          "ci-cd-pipeline": {
            "title": "CI/CD Pipeline ل Solana",
            "content": "# CI/CD Pipeline ل Solana\n\nA mature Solana CI/CD pipeline enforces quality gates across code, tests, الامان checks, و النشر workflows. ل program teams, CI is not just linting Rust و TypeScript; it is about protecting on-chain invariants before irreversible releases.\n\nRecommended pipeline stages:\n\n1. **Static checks**: formatting, lint, type checks.\n2. **Unit/integration tests**: deterministic local execution.\n3. **الامان checks**: dependency scan, optional static analyzers.\n4. **Build artifacts**: reproducible program binaries.\n5. **Staging deploy**: optional devnet النشر و smoke tests.\n6. **Manual approval** ل production deploy.\n\nGitHub Actions is a common choice. A typical workflow matrix runs Rust و Node tasks in parallel to reduce cycle time. Cache Cargo و pnpm dependencies aggressively.\n\nExample conceptual workflow snippets:\n\n```yaml\n- run: cargo test --workspace\n- run: pnpm lint && pnpm typecheck && pnpm test\n- run: anchor build\n- run: anchor test --skip-local-validator\n```\n\nل deployments:\n\n- Store deploy keypairs in secure secrets management.\n- Restrict deploy jobs to protected branches/tags.\n- Emit program IDs و معاملة signatures as artifacts.\n\nProgram verification is critical. Where possible, verify deployed binary matches source-controlled build output. This strengthens trust و simplifies audits.\n\nOperational safety practices:\n\n- Use feature flags ل high-risk logic activation.\n- Keep rollback strategy documented.\n- Monitor post-deploy metrics (error rates, failed tx ratio, latency).\n\nInclude regression tests ل previously discovered bugs. Every production incident should produce a permanent automated test.\n\nA strong CI/CD pipeline is an engineering control, not a convenience. It reduces release risk, accelerates safe iteration, و provides confidence that code changes preserve الامان و protocol correctness under production conditions.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-indexing": {
    "title": "Solana Indexing & Analytics",
    "description": "Build a production-grade Solana event indexer مع deterministic decoding, resilient ingestion contracts, checkpoint recovery, و analytics outputs teams can trust.",
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
        "description": "Events model, token decoding, و معاملة parsing fundamentals مع schema discipline و deterministic normalization.",
        "lessons": {
          "indexing-v2-events-model": {
            "title": "Events model: معاملات, logs, و program تعليمات",
            "content": "# Events model: معاملات, logs, و program تعليمات\n\nIndexing Solana starts مع understanding where data lives و how to extract structured events from raw chain data. Unlike EVM chains where events are explicit log topics, Solana encodes program state changes in حساب updates و program logs. Your indexer must parse these sources و transform them into a queryable event stream.\n\nA معاملة on Solana contains one or more تعليمات. Each تعليمة targets a program, includes حساب metas, و carries opaque تعليمة data. When executed, programs emit log entries via solana_program::msg or similar macros. These logs, combined مع pre/post حساب states, form the raw material ل event indexing.\n\nThe indexer pipeline typically follows: fetch → parse → normalize → store. Fetch retrieves معاملة metadata via RPC or geyser plugins. Parse extracts program logs و حساب diffs. Normalize converts raw data into domain-specific events مع stable schemas. Store persists events مع appropriate indexing ل queries.\n\nKey concepts ل normalization: تعليمة program IDs identify which decoder to apply, حساب ownership determines data layout, و log prefixes often indicate event types (e.g., \"Transfer\", \"Mint\", \"Burn\"). Your indexer must handle multiple program versions gracefully, maintaining backward compatibility as تعليمة layouts evolve.\n\nIdempotency is critical. Block reorganizations are rare on Solana but possible during forks. Your indexing pipeline should handle replayed معاملات without duplicating events. This typically means using معاملة signatures as unique keys و implementing upsert semantics in the storage layer.\n\n## Operator النموذج الذهني\n\nTreat your indexer as a data product مع explicit contracts:\n1. ingest contract (what raw inputs are accepted),\n2. normalization contract (stable event schema),\n3. serving contract (what query consumers can rely on).\n\nWhen these contracts are versioned و documented, protocol upgrades become manageable instead of breaking downstream analytics unexpectedly.\n\n## Checklist\n- Understand معاملة → تعليمات → logs hierarchy\n- Identify program IDs و حساب ownership ل data layout selection\n- Normalize raw logs into domain events مع stable schemas\n- Implement idempotent ingestion using معاملة signatures\n- Plan ل program version evolution in decoders\n\n## Red flags\n- Parsing logs without validating program IDs\n- Assuming fixed حساب ordering across program versions\n- Missing idempotency leading to duplicate events\n- Storing raw data without normalized event extraction\n",
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
                      "Program logs و حساب state changes",
                      "Explicit event topics like EVM",
                      "مدقق consensus messages"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana programs emit events via logs و state changes, not explicit event topics."
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
                    "explanation": "Idempotent ingestion ensures the same معاملة processed twice creates only one event."
                  }
                ]
              }
            ]
          },
          "indexing-v2-token-decoding": {
            "title": "Token حساب decoding و SPL layout",
            "content": "# Token حساب decoding و SPL layout\n\nSPL Token حسابات follow a standardized binary layout that indexers must parse to track balances و mint operations. Understanding this layout enables you to extract meaningful data from raw حساب bytes without relying on external APIs.\n\nA token حساب contains: mint address (32 bytes), owner address (32 bytes), amount (8 bytes u64), delegate (32 bytes, optional), state (1 byte), is_native (1 byte + 8 bytes if native), delegated_amount (8 bytes), و close_authority (36 bytes optional). The total size is typically 165 bytes ل standard حسابات.\n\nحساب discriminators help identify حساب types. SPL Token حسابات are owned by the Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) or Token-2022. Your indexer should verify ownership before attempting to parse, as malicious حسابات could mimic data layouts.\n\nDecoding involves: read the 32-byte mint, verify it matches expected token, read the 64-bit amount (little-endian), convert to decimal representation using mint decimals, و track owner ل balance aggregation. Always handle malformed data gracefully - truncated حسابات or unexpected sizes should not crash the indexer.\n\nل balance diffs, compare pre-معاملة و post-معاملة states. A transfer emits no explicit event but changes two حساب amounts. Your indexer must detect these changes by comparing states before و after تعليمة execution.\n\n## Checklist\n- Verify token program ownership before parsing\n- Decode mint, owner, و amount fields correctly\n- Handle little-endian u64 conversion properly\n- Support both Token و Token-2022 programs\n- Implement graceful handling ل malformed حسابات\n\n## Red flags\n- Parsing without ownership verification\n- Ignoring mint decimals in amount conversion\n- Assuming fixed حساب sizes without bounds checking\n- Missing balance diff detection ل transfers\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexing-v2-l2-token-explorer",
                "title": "Token حساب Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "SPL Token حساب",
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
                    "prompt": "What is the standard size of an SPL Token حساب?",
                    "options": [
                      "165 bytes",
                      "64 bytes",
                      "256 bytes"
                    ],
                    "answerIndex": 0,
                    "explanation": "Standard SPL Token حسابات are 165 bytes, containing mint, owner, amount, و optional fields."
                  },
                  {
                    "id": "indexing-v2-l2-q2",
                    "prompt": "How should amount be interpreted from token حساب data?",
                    "options": [
                      "As little-endian u64, then divided by 10^decimals",
                      "As big-endian u32 directly",
                      "As ASCII string"
                    ],
                    "answerIndex": 0,
                    "explanation": "Amounts are stored as little-endian u64 و must be converted using the mint's decimal places."
                  }
                ]
              }
            ]
          },
          "indexing-v2-decode-token-account": {
            "title": "Challenge: Decode token حساب + diff token balances",
            "content": "# Challenge: Decode token حساب + diff token balances\n\nImplement deterministic token حساب decoding و balance diffing:\n\n- Parse a 165-byte SPL Token حساب layout\n- Extract mint, owner, و amount fields\n- Compute balance differences between pre/post states\n- Return normalized event objects مع stable ordering\n\nYour solution will be validated against multiple test cases مع various token حساب states.",
            "duration": "45 min",
            "hints": [
              "SPL Token حساب layout: mint (32B), owner (32B), amount (8B LE u64)",
              "Use little-endian byte order ل the amount field",
              "Convert bytes to base58 ل Solana addresses"
            ]
          },
          "indexing-v2-transaction-meta": {
            "title": "معاملة meta parsing: logs, errors, و inner تعليمات",
            "content": "# معاملة meta parsing: logs, errors, و inner تعليمات\n\nمعاملة metadata provides the context needed to index complex operations. Understanding how to parse logs, handle errors, و traverse inner تعليمات enables comprehensive event extraction.\n\nProgram logs follow a hierarchical structure. The outermost logs show تعليمة execution order, while inner logs reveal CPI calls. Each log line typically includes a prefix indicating severity or type: \"Program\", \"Invoke\", \"Success\", \"Fail\", or custom program messages. Your parser should handle nested invocation levels correctly.\n\nError handling distinguishes between معاملة-level failures و تعليمة-level failures. A معاملة may succeed overall while individual تعليمات fail (و are rolled back). Conversely, a single failing تعليمة can cause the entire معاملة to fail. Indexers should record these distinctions ل accurate analytics.\n\nInner تعليمات reveal the complete execution trace. When a program makes CPI calls, these appear as inner تعليمات in معاملة metadata. Indexers must traverse both top-level و inner تعليمات to capture all state changes. This is especially important ل protocols like Jupiter that route through multiple DEXs.\n\nLog filtering improves efficiency. Rather than parsing all logs, indexers can filter by program ID prefixes or known event signatures. However, be cautious - aggressive filtering might miss important events during protocol upgrades or edge cases.\n\n## Checklist\n- Parse program logs مع proper nesting level tracking\n- Distinguish معاملة-level from تعليمة-level errors\n- Traverse inner تعليمات ل complete CPI traces\n- Implement efficient log filtering by program ID\n- Handle both success و failure scenarios\n\n## Red flags\n- Ignoring inner تعليمات و missing CPI events\n- Treating all log failures as معاملة failures\n- Parsing without log level/depth context\n- Missing error context in indexed events\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "indexing-v2-l4-logs",
                "title": "Log Structure Example",
                "steps": [
                  {
                    "cmd": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
                    "output": "Program log: تعليمة: Transfer",
                    "note": "Top-level تعليمة at depth 1"
                  },
                  {
                    "cmd": "Program 11111111111111111111111111111111 invoke [2]",
                    "output": "Program log: Create حساب",
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
        "description": "Build end-to-end indexer pipeline behavior: idempotent ingestion, checkpoint recovery, و analytics aggregation at production scale.",
        "lessons": {
          "indexing-v2-index-transactions": {
            "title": "Challenge: Index معاملات to normalized events",
            "content": "# Challenge: Index معاملات to normalized events\n\nImplement a معاملة indexer that produces normalized Event objects:\n\n- Parse تعليمة logs و identify event types\n- Extract transfer events مع from/to/amount/mint\n- Handle multiple events per معاملة\n- Return stable, canonical JSON مع sorted keys\n- Support idempotency via معاملة signature deduplication",
            "duration": "50 min",
            "hints": [
              "Parse log entries to identify event types",
              "Extract fields using regex patterns",
              "Include معاملة signature ل traceability",
              "Sort events by index ل deterministic output"
            ]
          },
          "indexing-v2-pagination-caching": {
            "title": "Pagination, checkpointing, و caching semantics",
            "content": "# Pagination, checkpointing, و caching semantics\n\nProduction indexers must handle large datasets efficiently while maintaining consistency. Pagination, checkpointing, و caching form the backbone of scalable indexing infrastructure.\n\nPagination strategies depend on query patterns. Cursor-based pagination using معاملة signatures provides stable ordering even during concurrent writes. Offset-based pagination can miss or duplicate entries during high-write periods. ل time-series data, consider partitioning by slot or block time.\n\nCheckpointing enables recovery from failures. Indexers should periodically save their processing position (last processed slot/signature) to durable storage. On restart, resume from the checkpoint rather than re-indexing from genesis. This pattern is essential ل long-running indexers handling months of chain history.\n\nCaching reduces redundant RPC calls. حساب metadata, program IDs, و decoded تعليمة layouts can be cached مع appropriate TTLs. However, cache invalidation is critical - stale cache entries can lead to incorrect decoding or missed events. Consider using slot-based versioning ل cache entries.\n\nIdempotent writes prevent data corruption. Even مع checkpointing, duplicate processing can occur during retries. Use معاملة signatures as unique identifiers و implement upsert semantics. Database constraints or unique indexes should enforce this at the storage layer.\n\n## Checklist\n- Implement cursor-based pagination ل stable ordering\n- Save periodic checkpoints ل failure recovery\n- Cache حساب metadata مع slot-based invalidation\n- Enforce idempotent writes via unique constraints\n- Handle backfills without duplicating events\n\n## Red flags\n- Using offset pagination ل high-write datasets\n- Missing checkpointing requiring full re-index on restart\n- Caching without proper invalidation strategies\n- Allowing duplicate events from retry logic\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexing-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l6-q1",
                    "prompt": "Why is cursor-based pagination preferred ل indexing?",
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
            "title": "Analytics aggregation: per محفظة, per token metrics",
            "content": "# Analytics aggregation: per محفظة, per token metrics\n\nRaw event data becomes valuable through aggregation. Building analytics pipelines enables insights into user behavior, token flows, و protocol usage patterns.\n\nPer-محفظة analytics track individual user activity. Key metrics include: معاملة count, unique tokens held, total volume transferred, first/last activity timestamps, و interaction patterns مع specific programs. These metrics power user segmentation و engagement analysis.\n\nPer-token analytics track asset-level metrics. Important aggregations include: total transfer volume, unique holders, holder distribution (whales vs retail), velocity (average time between transfers), و cross-program usage. These inform tokenomics analysis و market research.\n\nTime-windowed aggregations support trend analysis. Daily, weekly, و monthly rollups enable comparison across time periods. Consider using tumbling windows ل fixed periods or sliding windows ل moving averages. Materialized views can pre-compute common aggregations ل query الاداء.\n\nNormalization ensures consistent comparisons. Convert all amounts to human-readable decimals, normalize timestamps to UTC, و use consistent address formatting (base58). Deduplicate events from failed معاملات that may still appear in logs.\n\n## Checklist\n- Aggregate per-محفظة metrics (volume, token count, activity)\n- Aggregate per-token metrics (holders, velocity, distribution)\n- Implement time-windowed rollups ل trend analysis\n- Normalize amounts, timestamps, و addresses\n- Exclude failed معاملات from aggregates\n\n## Red flags\n- Mixing raw و decimal-adjusted amounts\n- Including failed معاملات in volume metrics\n- Missing time normalization across timezones\n- Storing unbounded raw data without aggregation\n",
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
                      "label": "محفظة Summary",
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
            "content": "# Checkpoint: Produce stable JSON analytics summary\n\nImplement the final analytics checkpoint that produces a deterministic summary:\n\n- Aggregate events into per-محفظة و per-token metrics\n- Generate sorted, stable JSON output\n- Include timestamp و summary statistics\n- Handle edge cases (empty datasets, single events)\n\nThis checkpoint validates your complete indexing pipeline from raw data to analytics.",
            "duration": "50 min",
            "hints": [
              "Aggregate events by محفظة address",
              "Sum معاملة counts و volumes",
              "Sort output arrays by address ل determinism",
              "Include metadata like timestamps"
            ]
          }
        }
      }
    }
  },
  "solana-payments": {
    "title": "Solana Payments & Checkout Flows",
    "description": "Build production-grade Solana payment flows مع robust validation, replay-safe idempotency, secure webhooks, و deterministic receipts ل reconciliation.",
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
        "description": "Address validation, idempotency strategy, و payment intent التصميم ل reliable checkout behavior.",
        "lessons": {
          "payments-v2-address-validation": {
            "title": "Address validation و memo strategies",
            "content": "# Address validation و memo strategies\n\nPayment flows on Solana require robust address validation و thoughtful memo strategies. Unlike traditional payment systems مع حساب numbers, Solana uses base58-encoded public keys that must be validated before any value transfer.\n\nAddress validation involves three layers: format validation, derivation check, و ownership verification. Format validation ensures the string is valid base58 و decodes to 32 bytes. Derivation check optionally verifies the address is on the Ed25519 curve (ل محفظة addresses) or off-curve (ل PDAs). Ownership verification confirms the حساب exists و is owned by the expected program.\n\nMemos attach metadata to payments. The SPL Memo program enables attaching UTF-8 strings to معاملات. Common use cases include: order IDs, invoice references, customer identifiers, و compliance data. Memos are not encrypted و are visible on-chain, so never include sensitive information.\n\nMemo افضل الممارسات: keep under 256 bytes ل efficiency, use structured formats (JSON) ل machine parsing, include versioning ل future compatibility, و hash sensitive identifiers rather than storing them plaintext. Consider using deterministic memo formats that can be regenerated from payment context ل idempotency checks.\n\nAddress poisoning is an attack vector where attackers create addresses visually similar to legitimate ones. Countermeasures include: displaying addresses مع checksums, using name services (Solana Name Service, Bonfida) where appropriate, و implementing confirmation steps ل large transfers.\n\n## Merchant-safe memo template\n\nA عملي memo format is:\n`v1|order:<id>|shop:<merchantId>|nonce:<shortHash>`\n\nThis keeps memos short, parseable, و versioned while avoiding direct storage of sensitive user details.\n\n## Checklist\n- Validate base58 encoding و 32-byte length\n- Distinguish between on-curve و off-curve addresses\n- Verify حساب ownership ل program-specific payments\n- Use SPL Memo program ل structured metadata\n- Implement address poisoning protections\n\n## Red flags\n- Transferring to unvalidated addresses\n- Storing sensitive data in plaintext memos\n- Skipping ownership checks ل token حسابات\n- Trusting visually similar addresses without verification\n",
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
                      "Attach metadata like order IDs to معاملات",
                      "Encrypt payment amounts",
                      "Replace معاملة signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL Memo allows attaching public metadata to معاملات ل reference و tracking."
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
            "title": "Idempotency keys و replay protection",
            "content": "# Idempotency keys و replay protection\n\nPayment systems must handle network failures gracefully. Idempotency ensures that retrying a failed request produces the same outcome as the original, preventing duplicate charges و inconsistent state.\n\nIdempotency keys are unique identifiers generated by clients ل each payment intent. The server stores processed keys و their outcomes, returning cached results ل duplicate submissions. Keys should be: globally unique (UUID v4), client-generated, و persisted مع sufficient TTL to handle extended retry windows.\n\nKey generation strategies include: UUID v4 مع timestamp prefix, hash of payment parameters (amount, recipient, timestamp), or structured keys combining merchant ID و local sequence numbers. The key must be stable across retries but unique across distinct payments.\n\nReplay protection prevents malicious or accidental re-execution. Beyond idempotency, معاملات should include: recent blockhash freshness (prevents old معاملة replay), durable nonce ل offline signing scenarios, و amount/time bounds where applicable.\n\nError classification affects retry behavior. Network errors warrant retries مع exponential backoff. Validation errors (insufficient funds, invalid address) should fail fast without retry. Timeout errors require careful handling - the payment may have succeeded, so query status before retrying.\n\n## Checklist\n- Generate unique idempotency keys ل each payment intent\n- Store processed keys مع outcomes ل deduplication\n- Implement appropriate TTL based on retry windows\n- Use recent blockhash ل معاملة freshness\n- Classify errors ل appropriate retry strategies\n\n## Red flags\n- Allowing duplicate payments from retries\n- Generating idempotency keys server-side only\n- Ignoring timeout ambiguity in status checking\n- Storing keys without expiration\n",
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
                    "note": "Create payment intent مع idempotency key"
                  },
                  {
                    "cmd": "POST /v1/payment-intents/pi_123/confirm",
                    "output": "{\"id\":\"pi_123\",\"status\":\"processing\"}",
                    "note": "Confirm triggers معاملة building"
                  },
                  {
                    "cmd": "GET /v1/payment-intents/pi_123",
                    "output": "{\"id\":\"pi_123\",\"status\":\"succeeded\",\"signature\":\"abc123\"}",
                    "note": "Poll ل final status"
                  }
                ]
              }
            ]
          },
          "payments-v2-payment-intent": {
            "title": "Challenge: Create payment intent مع validation",
            "content": "# Challenge: Create payment intent مع validation\n\nImplement a payment intent creator مع full validation:\n\n- Validate recipient address format (base58, 32 bytes)\n- Validate amount (positive, within limits)\n- Generate deterministic idempotency key\n- Return structured payment intent object\n- Handle edge cases (zero amount, invalid address)\n\nYour implementation will be tested against various valid و invalid inputs.",
            "duration": "45 min",
            "hints": [
              "Use base58 alphabet to validate the recipient address format.",
              "Convert base58 to bytes و check the length equals 32.",
              "Generate an idempotency key if not provided in the input."
            ]
          },
          "payments-v2-tx-building": {
            "title": "معاملة building و key metadata",
            "content": "# معاملة building و key metadata\n\nBuilding payment معاملات requires careful attention to تعليمة construction, حساب metadata, و program interactions. The goal is creating valid, efficient معاملات that minimize fees while ensuring correctness.\n\nتعليمة construction follows a pattern: identify the program (System Program ل SOL transfers, Token Program ل SPL transfers), prepare حساب metas مع correct writable/signer flags, serialize تعليمة data according to the program's layout, و compute the معاملة message مع all required fields.\n\nحساب metadata is critical. ل SOL transfers, you need: from (signer + writable), to (writable). ل SPL transfers: token حساب from (signer + writable), token حساب to (writable), owner (signer), و potentially a delegate if using delegated transfer. Missing or incorrect flags cause runtime failures.\n\nFee optimization strategies include: batching multiple payments into one معاملة (up to compute unit limits), using address lookup tables (ALTs) ل حسابات referenced multiple times, و setting appropriate compute unit limits to avoid overpaying ل simple operations.\n\nمعاملة validation before submission: verify all required signatures are present, check recent blockhash is fresh, estimate compute units if possible, و validate تعليمة data encoding matches the expected layout.\n\n## Checklist\n- Set correct writable/signer flags on all حسابات\n- Use appropriate program ل transfer type (SOL vs SPL)\n- Validate تعليمة data encoding\n- Include recent blockhash ل freshness\n- Consider batching ل multiple payments\n\n## Red flags\n- Missing signer flags on fee payer\n- Incorrect writable flags on recipient حسابات\n- Using wrong program ID ل token type\n- Stale blockhash causing معاملة rejection\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "payments-v2-l4-tx-structure",
                "title": "معاملة Structure",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Transfer تعليمة",
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
        "description": "معاملة building, webhook authenticity checks, و deterministic receipt generation مع clear error-state handling.",
        "lessons": {
          "payments-v2-transfer-tx": {
            "title": "Challenge: Build transfer معاملة",
            "content": "# Challenge: Build transfer معاملة\n\nImplement a transfer معاملة builder:\n\n- Build SystemProgram.transfer ل SOL transfers\n- Build TokenProgram.transfer ل SPL transfers\n- Return تعليمة bundle مع correct key metadata\n- Include fee payer و blockhash\n- Support deterministic output ل الاختبار",
            "duration": "50 min",
            "hints": [
              "SystemProgram.transfer uses تعليمة index 2 مع u64 lamports (little-endian).",
              "TokenProgram.transferChecked uses تعليمة index 12 مع u64 amount + u8 decimals.",
              "Key order matters: SOL transfer needs [from, to], SPL transfer needs [source, mint, dest, owner]."
            ]
          },
          "payments-v2-webhooks": {
            "title": "Webhook signing و verification",
            "content": "# Webhook signing و verification\n\nWebhooks enable asynchronous payment notifications. الامان requires cryptographic signing so recipients can verify webhook authenticity و detect tampering.\n\nWebhook signing uses HMAC-SHA256 مع a shared secret. The sender computes: signature = HMAC-SHA256(secret, payload). The signature is included in a header (e.g., X-Webhook-Signature). Recipients recompute the HMAC و compare, using constant-time comparison to prevent timing attacks.\n\nPayload canonicalization ensures consistent signing. JSON objects must be serialized مع: sorted keys (alphabetical), no extra whitespace, consistent number formatting, و UTF-8 encoding. Without canonicalization, {\"a\":1,\"b\":2} و {\"b\":2,\"a\":1} produce different signatures.\n\nIdempotency in webhooks prevents duplicate processing. Webhook payloads should include an idempotency key or event ID. Recipients store processed IDs و ignore duplicates. This handles retries from the sender و network-level duplicates.\n\nالامان افضل الممارسات: rotate secrets periodically, use different secrets per environment (dev/staging/prod), include timestamps و reject old webhooks (e.g., >5 minutes), و verify IP allowlists where feasible. Never include sensitive data like private keys or full card numbers in webhooks.\n\n## Checklist\n- Sign webhooks مع HMAC-SHA256 و shared secret\n- Canonicalize JSON payloads مع sorted keys\n- Include event ID ل idempotency\n- Verify signatures مع constant-time comparison\n- Implement timestamp validation\n\n## Red flags\n- Unsigned webhooks trusting sender IP alone\n- Non-canonical JSON causing verification failures\n- Missing idempotency handling duplicate events\n- Including secrets or sensitive data in payload\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "payments-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "payments-v2-l6-q1",
                    "prompt": "Why is JSON canonicalization important ل webhooks?",
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
                    "prompt": "What algorithm is standard ل webhook signing?",
                    "options": [
                      "HMAC-SHA256",
                      "MD5",
                      "RSA-512"
                    ],
                    "answerIndex": 0,
                    "explanation": "HMAC-SHA256 provides strong الامان و is widely supported across languages."
                  }
                ]
              }
            ]
          },
          "payments-v2-error-states": {
            "title": "Error state machine و receipt format",
            "content": "# Error state machine و receipt format\n\nPayment flows require well-defined state machines to handle the complexity of asynchronous confirmations, failures, و retries. Clear state transitions و receipt formats ensure reliable payment tracking.\n\nPayment states typically include: pending (intent created, not yet submitted), processing (معاملة submitted, awaiting confirmation), succeeded (معاملة confirmed, payment complete), failed (معاملة failed or rejected), و cancelled (intent explicitly cancelled before submission). Each state has valid transitions و terminal states.\n\nState transition rules: pending can transition to processing, cancelled, or failed; processing can transition to succeeded or failed; succeeded و failed are terminal. Invalid transitions (e.g., succeeded → failed) indicate bugs or data corruption.\n\nReceipt format standardization enables interoperability. A payment receipt should include: payment intent ID, معاملة signature (if submitted), amount و currency, recipient address, timestamp, status, و verification data (e.g., explorer link). Receipts should be JSON مع canonical ordering ل deterministic hashing.\n\nExplorer links provide transparency. ل Solana, construct explorer URLs using: https://explorer.solana.com/tx/{signature}?cluster={network}. Include these in receipts و webhook payloads so users can verify معاملات independently.\n\n## Checklist\n- Define clear payment states و valid transitions\n- Implement state machine validation\n- Generate standardized receipt JSON\n- Include explorer links ل verification\n- Handle all terminal states appropriately\n\n## Red flags\n- Ambiguous states without clear definitions\n- Missing terminal state handling\n- Non-deterministic receipt formats\n- No explorer links ل verification\n",
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
                    "note": "معاملة submitted, awaiting confirmation"
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
            "title": "Challenge: Verify webhook و produce receipt",
            "content": "# Challenge: Verify webhook و produce receipt\n\nImplement the final payment flow checkpoint:\n\n- Verify signed webhook signature (HMAC-SHA256)\n- Extract payment details from payload\n- Generate standardized receipt JSON\n- Include explorer link و verification data\n- Ensure deterministic, sorted output\n\nThis validates the complete payment flow from intent to receipt.",
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
    "description": "Master compressed NFT engineering on Solana: Merkle commitments, proof systems, collection modeling, و production الامان checks.",
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
        "description": "Tree construction, leaf hashing, insertion mechanics, و the on-chain/off-chain commitment model behind compressed assets.",
        "lessons": {
          "cnft-v2-merkle-trees": {
            "title": "Merkle trees ل state compression",
            "content": "# Merkle trees ل state compression\n\nCompressed NFTs (cNFTs) on Solana use Merkle trees to dramatically reduce storage costs. Understanding Merkle trees is essential ل working مع compressed NFTs و building compression-aware applications.\n\nA Merkle tree is a binary hash tree where each leaf node contains a hash of data, و each non-leaf node contains the hash of its children. The root hash commits to the entire tree structure و all leaf data. This structure enables efficient proofs of inclusion without revealing the entire dataset.\n\nTree construction follows a bottom-up approach: hash each data element to create leaves, pair adjacent leaves و hash their concatenation to create parents, و repeat until a single root remains. ل odd numbers of nodes, the last node is typically promoted to the next level or paired مع a zero hash depending on the implementation.\n\nSolana's cNFT implementation uses concurrent Merkle trees مع 16-bit depth (max 65,536 leaves). The tree state is stored on-chain as a small حساب containing just the root hash و metadata. Actual leaf data (NFT metadata) is stored off-chain, typically via RPC providers or indexers.\n\nKey properties of Merkle trees: any leaf change affects the root, inclusion proofs require only log2(n) hashes, و the root serves as a cryptographic commitment to all data. These properties enable state compression while maintaining verifiability.\n\n## عملي cNFT architecture rule\n\nTreat compressed NFT systems as two synchronized layers:\n1. on-chain commitment layer (tree root + update rules),\n2. off-chain data layer (metadata + indexing + proof serving).\n\nIf either layer is weakly validated, ownership و metadata trust can diverge.\n\n## Checklist\n- Understand binary hash tree construction\n- Know how leaf changes propagate to the root\n- Calculate proof size: log2(n) hashes ل n leaves\n- Recognize depth limits (16-bit = 65,536 max leaves)\n- Understand on-chain vs off-chain data split\n\n## Red flags\n- Treating Merkle roots as data storage (they're commitments)\n- Ignoring depth limits when planning collections\n- Storing sensitive data assuming it's \"hidden\" in the tree\n- Not validating proofs against the current root\n",
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
                      "The entire tree structure و all leaf data",
                      "Only the first و last leaf",
                      "The tree depth only"
                    ],
                    "answerIndex": 0,
                    "explanation": "The root is a cryptographic commitment to all leaves و their positions in the tree."
                  },
                  {
                    "id": "cnft-v2-l1-q2",
                    "prompt": "How many hash siblings are needed to prove inclusion in a tree مع 65,536 leaves?",
                    "options": [
                      "16",
                      "256",
                      "65536"
                    ],
                    "answerIndex": 0,
                    "explanation": "Proof size is log2(65536) = 16, making verification efficient even ل large collections."
                  }
                ]
              }
            ]
          },
          "cnft-v2-leaf-hashing": {
            "title": "Leaf hashing conventions و metadata",
            "content": "# Leaf hashing conventions و metadata\n\nLeaf hashing determines how NFT metadata is committed to the Merkle tree. Understanding these conventions ensures compatibility مع compression standards و proper proof generation.\n\nLeaf structure ل cNFTs includes: asset ID (derived from tree address و leaf index), owner public key, delegate (optional), nonce ل uniqueness, و metadata hash. The exact encoding follows the Metaplex Bubblegum specification, using deterministic serialization ل consistent hashing.\n\nHashing algorithm uses Keccak-256 ل Ethereum compatibility, مع domain separation via prefixed constants. The leaf hash is computed as: hash(prefix || asset_data) where prefix prevents collision مع other hash usages. Multiple prefix values exist ل different operation types (mint, transfer, burn).\n\nMetadata handling stores the full NFT metadata (name, symbol, uri, creators, royalties) off-chain. Only a hash of the metadata is stored in the leaf. This enables large metadata without on-chain storage costs while maintaining integrity via the hash commitment.\n\nCreator verification uses a separate signing process. Creators sign the asset ID to verify authenticity. These signatures are stored alongside proofs but not in the Merkle tree itself, allowing flexible verification without tree updates.\n\n## Checklist\n- Understand leaf structure components\n- Use correct hashing algorithm (Keccak-256)\n- Include proper domain separation prefixes\n- Store metadata off-chain مع hash commitment\n- Handle creator signatures separately from tree\n\n## Red flags\n- Using wrong hashing algorithm\n- Missing domain separation in leaf hashes\n- Storing full metadata on-chain in compressed NFTs\n- Ignoring creator verification requirements\n",
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
            "content": "# Challenge: Implement Merkle tree insert + root updates\n\nBuild a Merkle tree implementation مع insertions:\n\n- Insert leaves و compute new root\n- Update parent hashes up the tree\n- Handle tree growth و depth limits\n- Return deterministic root updates\n\nTest cases will verify correct root evolution after multiple insertions.",
            "duration": "50 min",
            "hints": [
              "Start by validating the leaf index is within bounds.",
              "At each level, find the sibling node (left or right of current).",
              "Hash the current node مع its sibling to get the parent hash.",
              "Traverse up to the root, collecting all updated node hashes.",
              "Use deterministic ordering: left hash comes before right hash."
            ]
          },
          "cnft-v2-proof-generation": {
            "title": "Proof generation و path computation",
            "content": "# Proof generation و path computation\n\nMerkle proofs enable verification of leaf inclusion without accessing the entire tree. Understanding proof generation is essential ل working مع compressed NFTs و building verification systems.\n\nA Merkle proof consists of: the leaf data (or its hash), a list of sibling hashes (one per level), و the leaf index (determining the path). The verifier recomputes the root by hashing the leaf مع siblings in the correct order, comparing against the expected root.\n\nProof generation requires traversing from leaf to root. At each level, record the sibling hash (the other child of the parent). The leaf index determines whether the current hash goes left or right in each concatenation. ل index i at level n, the position is determined by the nth bit of i.\n\nProof verification recomputes the root: start مع the leaf hash, ل each sibling in the proof list, concatenate current hash مع sibling (order depends on leaf index bit), hash the result, و compare final result مع expected root. Equality proves inclusion.\n\nProof size efficiency: ل a tree مع n leaves, proofs contain log2(n) hashes. This is dramatically smaller than the full tree (n hashes), enabling scalable verification. A 65,536 leaf tree requires only 16 hashes per proof.\n\n## Checklist\n- Collect sibling hashes at each tree level\n- Use leaf index bits to determine concatenation order\n- Verify proofs by recomputing root hash\n- Handle edge cases (empty tree, single leaf)\n- Optimize proof size ل network transmission\n\n## Red flags\n- Incorrect concatenation order in verification\n- Using wrong sibling hash at any level\n- Not validating proof length matches tree depth\n- Trusting proofs without root comparison\n",
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
                    "prompt": "How many hashes are in a proof ل a tree مع 1,024 leaves?",
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
        "title": "Proof System & الامان",
        "description": "Proof generation, verification, collection integrity, و الامان hardening against replay و metadata spoofing.",
        "lessons": {
          "cnft-v2-proof-verification": {
            "title": "Challenge: Implement proof generation + verifier",
            "content": "# Challenge: Implement proof generation + verifier\n\nBuild a complete proof system:\n\n- Generate proofs from a Merkle tree و leaf index\n- Verify proofs against a root hash\n- Handle invalid proofs (wrong siblings, wrong index)\n- Return deterministic boolean results\n\nTests will verify both successful proofs و rejection of invalid attempts.",
            "duration": "55 min",
            "hints": [
              "To generate a proof, collect the sibling hash at each level from leaf to root.",
              "The sibling is at index+1 if current is left, index-1 if current is right.",
              "To verify, start مع the leaf hash و combine مع each proof element.",
              "Use the same ordering (left || right) when combining hashes.",
              "The proof is valid if the recomputed root matches the stored root."
            ]
          },
          "cnft-v2-collection-minting": {
            "title": "Collection mints و metadata simulation",
            "content": "# Collection mints و metadata simulation\n\nCompressed NFT collections use a collection mint as the parent NFT, enabling grouping و verification of related assets. Understanding this hierarchy is essential ل building collection-aware applications.\n\nCollection structure includes: a standard SPL NFT as the collection mint, cNFTs referencing the collection in their metadata, و the Merkle tree containing all cNFT leaves. The collection mint provides on-chain provenance while cNFTs provide scalable asset issuance.\n\nMetadata simulation ل الاختبار allows development without actual on-chain معاملات. Simulated metadata includes: name, symbol, uri (typically pointing to off-chain JSON), seller fee basis points (royalties), creators array مع shares, و collection reference. This data structure matches on-chain format ل seamless migration.\n\nRoyalty enforcement through Metaplex's token metadata standard specifies seller fees as basis points (e.g., 500 = 5%). Creators array defines fee distribution مع verified flags. cNFTs inherit these settings from their metadata, enforced during transfers via the Bubblegum program.\n\nAttacks on compressed NFTs include: invalid proofs (claiming non-existent NFTs), index manipulation (using wrong leaf index), metadata spoofing (fake off-chain data), و collection impersonation (fake collection mints). Mitigations include proof verification, metadata hash validation, و collection mint verification.\n\n## Checklist\n- Understand collection mint hierarchy\n- Simulate metadata ل الاختبار\n- Implement royalty calculations\n- Verify collection membership\n- Handle metadata hash verification\n\n## Red flags\n- Accepting NFTs without collection verification\n- Ignoring royalty settings in transfers\n- Trusting off-chain metadata without hash validation\n- Not validating proofs ل ownership claims\n",
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
                    "note": "Parent NFT ل the collection"
                  },
                  {
                    "cmd": "Merkle Tree",
                    "output": "Contains cNFT leaf hashes",
                    "note": "Scalable storage ل assets"
                  },
                  {
                    "cmd": "Off-chain Metadata",
                    "output": "IPFS/Arweave JSON files",
                    "note": "Full metadata مع hash commitment"
                  }
                ]
              }
            ]
          },
          "cnft-v2-attack-surface": {
            "title": "Attack surface: invalid proofs و replay",
            "content": "# Attack surface: invalid proofs و replay\n\nCompressed NFTs introduce unique الامان considerations. Understanding attack vectors و mitigations is critical ل building secure compression-aware applications.\n\nInvalid proof attacks attempt to verify non-existent NFTs. An attacker provides a fabricated leaf hash و fake sibling hashes hoping to produce a valid-looking verification. Mitigation: always verify against the current root from a trusted source (RPC, on-chain حساب), و validate proof structure (correct depth, valid hash lengths).\n\nIndex manipulation exploits use valid proofs but wrong indices. Since leaf indices determine proof path, changing the index produces a different root computation. Mitigation: bind asset IDs to specific indices و validate index-asset correspondence during verification.\n\nReplay attacks re-use old proofs after tree updates. When leaves are added or modified, the root changes و old proofs become invalid. However, if an application caches roots, it might accept stale proofs. Mitigation: always use current root, implement proof timestamps where applicable.\n\nMetadata attacks substitute fake off-chain data. Since metadata is stored off-chain مع only a hash on-chain, attackers might serve altered metadata files. Mitigation: verify metadata hashes against leaf commitments, use content-addressed storage (IPFS), و validate creator signatures.\n\nCollection spoofing creates fake collections mimicking legitimate ones. Attackers mint similar-looking NFTs مع fake collection references. Mitigation: verify collection mint addresses against known good lists, check collection verification status, و validate authority signatures.\n\n## Checklist\n- Verify proofs against current root\n- Validate leaf index matches asset ID\n- Implement replay protection ل proofs\n- Hash-verify off-chain metadata\n- Verify collection mint authenticity\n\n## Red flags\n- Accepting cached/stale roots ل verification\n- Ignoring leaf index validation\n- Trusting off-chain metadata without verification\n- Not checking collection verification status\n",
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
            "content": "# Checkpoint: Simulate mint + verify ownership proof\n\nComplete the compression lab checkpoint:\n\n- Simulate minting a cNFT (insert leaf, update root)\n- Generate ownership proof ل the minted NFT\n- Verify the proof against current root\n- Output stable audit trace مع sorted keys\n- Detect و report invalid proof attempts\n\nThis validates your complete Merkle tree implementation ل compressed NFTs.",
            "duration": "60 min",
            "hints": [
              "Validate the mint request has all required fields (leafIndex, nftId, owner).",
              "Create a deterministic leaf hash by combining nftId و owner.",
              "Insert the leaf by computing hashes up to the root, collecting sibling hashes as proof.",
              "Build an audit trace that documents the operation, inputs, و verification steps.",
              "Include previous و new root hashes in the audit ل transparency."
            ]
          }
        }
      }
    }
  },
  "solana-governance-multisig": {
    "title": "الحوكمة & Multisig Treasury Ops",
    "description": "Build production-ready DAO الحوكمة و multisig treasury systems مع deterministic vote accounting, timelock safety, و secure execution controls.",
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
        "title": "DAO الحوكمة",
        "description": "Proposal lifecycle, deterministic voting mechanics, quorum policy, و timelock safety ل credible DAO الحوكمة.",
        "lessons": {
          "governance-v2-dao-model": {
            "title": "DAO model: proposals, voting, و execution",
            "content": "# DAO model: proposals, voting, و execution\n\nDecentralized الحوكمة on Solana follows a proposal-based model where token holders vote on changes و the DAO treasury executes approved decisions. Understanding this flow is essential ل building و participating in on-chain organizations.\n\nThe الحوكمة lifecycle has four stages: proposal creation (anyone مع sufficient stake can propose), voting period (token holders vote ل/against/abstain), queueing (successful proposals enter a timelock), و execution (the proposal's تعليمات are executed). Each stage has specific requirements و time constraints.\n\nProposal creation requires a minimum token deposit to prevent spam. The proposer submits: title, description link, و executable تعليمات (typically base64 serialized). Deposits are returned if the proposal passes, forfeited if it fails (depending on DAO configuration).\n\nVoting power is typically determined by token balance at a specific snapshot block. Some DAOs use vote escrow (veToken) models where locking tokens ل longer periods multiplies voting power. Quorum requirements ensure sufficient participation - a proposal needs both majority approval و minimum participation to pass.\n\nExecution safety involves timelocks between approval و execution. This delay (often 1-7 days) allows users to exit if they disagree مع the outcome. Emergency powers may exist ل critical fixes but should require higher thresholds.\n\n## الحوكمة reliability rule\n\nA proposal system is only credible if outcomes are reproducible from public inputs. That means deterministic vote math, explicit snapshot rules, clear timelock transitions, و auditable execution traces ل treasury effects.\n\n## Checklist\n- Understand the four-stage الحوكمة lifecycle\n- Know proposal deposit و spam prevention mechanisms\n- Calculate voting power و quorum requirements\n- Implement timelock safety delays\n- Plan ل emergency execution paths\n\n## Red flags\n- Allowing proposal creation without deposits\n- Missing quorum requirements ل participation\n- Zero timelock on sensitive operations\n- Unclear vote counting methodologies\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "governance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "governance-v2-l1-q1",
                    "prompt": "What is the purpose of a timelock in الحوكمة?",
                    "options": [
                      "Allow users time to exit if they disagree مع outcomes",
                      "Speed up معاملة processing",
                      "Reduce gas costs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Timelocks provide a safety window ل users to react before changes take effect."
                  },
                  {
                    "id": "governance-v2-l1-q2",
                    "prompt": "What determines voting power in most DAOs?",
                    "options": [
                      "Token balance at snapshot block",
                      "Number of معاملات submitted",
                      "حساب age"
                    ],
                    "answerIndex": 0,
                    "explanation": "Voting power is typically proportional to token holdings at a specific snapshot time."
                  }
                ]
              }
            ]
          },
          "governance-v2-quorum-math": {
            "title": "Quorum math و vote weight calculation",
            "content": "# Quorum math و vote weight calculation\n\nAccurate vote counting is critical ل legitimate الحوكمة outcomes. Understanding quorum requirements, vote weight calculation, و edge cases ensures fair decision-making.\n\nQuorum defines minimum participation ل a valid vote. Common formulas include: absolute token amount (e.g., 4% of total supply must vote), relative to circulating supply, or dynamic based on recent participation. Quorum prevents small groups from making unilateral decisions.\n\nVote weight calculation considers: token balance at snapshot block, lockup duration multipliers (veToken model), delegation relationships, و abstention handling. Abstentions typically count toward quorum but not toward approval ratio.\n\nApproval thresholds vary by proposal type. Simple majority (>50%) is standard ل routine matters. Supermajority (e.g., 2/3) may be required ل constitutional changes. Some DAOs use quadratic voting to reduce whale influence, though this has sybil resistance challenges.\n\nEdge cases include: ties (usually fail), late vote changes (often blocked after deadline), vote delegation revocation timing, و quorum manipulation (e.g., flash loan attacks prevented by snapshot blocks).\n\n## Checklist\n- Define clear quorum formulas و minimums\n- Calculate vote weights مع snapshot blocks\n- Handle abstentions appropriately\n- Set appropriate approval thresholds by proposal type\n- Protect against manipulation attacks\n\n## Red flags\n- No quorum requirements\n- Vote weight based on current balance (flash loan risk)\n- Unclear tie-breaking rules\n- Changing rules mid-proposal\n",
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
                      "label": "Voter حساب",
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
            "title": "Timelock states و execution scheduling",
            "content": "# Timelock states و execution scheduling\n\nTimelocks provide a critical safety layer between الحوكمة approval و execution. Understanding timelock states و transitions ensures reliable proposal execution.\n\nTimelock states include: pending (proposal passed, waiting ل delay), ready (delay elapsed, can be executed), executed (تعليمات processed), cancelled (withdrawn by proposer or guardian), و expired (execution window passed). Each state has valid transitions و authorized actors.\n\nDelay configuration balances الامان مع responsiveness. Too short (hours) allows insufficient reaction time. Too long (weeks) delays urgent fixes. Common ranges are 1-7 days, مع shorter delays ل routine matters و longer ل significant changes.\n\nExecution windows prevent indefinite pending states. After the timelock delay, proposals typically have a limited window (e.g., 7-14 days) to be executed. Expired proposals must be re-proposed و re-voted.\n\nCancellations add flexibility. Proposers may withdraw proposals before voting ends. Guardians (if configured) may cancel malicious proposals. Cancellation typically returns deposits unless abuse is detected.\n\n## Checklist\n- Define clear timelock state machine\n- Set appropriate delays by proposal type\n- Implement execution window limits\n- Authorize cancellation actors\n- Handle state transitions atomically\n\n## Red flags\n- No execution window limits\n- Missing cancellation mechanisms\n- State transitions without authorization checks\n- Indefinite pending states\n",
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
                    "output": "تعليمات processed",
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
              "Sum up weights ل each vote choice (ل, against, abstain).",
              "Check if totalVoteWeight >= quorumThreshold to determine quorumMet.",
              "Calculate support percentage as forWeight / (forWeight + againstWeight) when there are non-abstain votes.",
              "Proposal passes only if quorum is met و support percentage >= supportThreshold."
            ]
          }
        }
      },
      "governance-v2-multisig": {
        "title": "Multisig Treasury",
        "description": "Multisig معاملة construction, approval controls, replay defenses, و secure treasury execution patterns.",
        "lessons": {
          "governance-v2-multisig": {
            "title": "Multisig معاملة building و approvals",
            "content": "# Multisig معاملة building و approvals\n\nMultisig محافظ provide collective control over treasury funds. Understanding multisig construction, approval flows, و الامان patterns is essential ل treasury operations.\n\nMultisig structure defines: signers (public keys that can approve), threshold (minimum signatures required), و تعليمات (operations to execute). Common configurations include 2-of-3 (two approvals from three signers), 3-of-5, و custom arrangements.\n\nمعاملة lifecycle: propose (one signer creates معاملة مع تعليمات), approve (other signers review و approve), و execute (once threshold is met, anyone can execute). Each stage is recorded on-chain ل transparency.\n\nApproval tracking maintains state per signer per معاملة. Signers can approve, reject, or cancel their approval. Double-signing is prevented by tracking which signers have already approved. Rejections may block معاملات or simply be recorded.\n\nالامان considerations: signer key management (hardware محافظ recommended), threshold selection (balance الامان vs availability), timelocks ل large transfers, و emergency recovery paths. Lost signer keys should not freeze treasury funds permanently.\n\n## Checklist\n- Define signer set و threshold\n- Track per-signer approval state\n- Enforce threshold before execution\n- Implement approval/revocation mechanics\n- Plan ل lost key scenarios\n\n## Red flags\n- Single signer controlling treasury\n- No approval tracking on-chain\n- Threshold equal to signer count (no redundancy)\n- Missing rejection/cancellation mechanisms\n",
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
                      "2 signers total مع 3 keys each",
                      "2 minute timeout مع 3 retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "2-of-3 means any 2 of the 3 authorized signers must approve a معاملة."
                  },
                  {
                    "id": "governance-v2-l5-q2",
                    "prompt": "Why track approvals on-chain?",
                    "options": [
                      "Transparency و enforceability",
                      "Faster execution",
                      "Lower fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "On-chain tracking provides transparency و ensures threshold enforcement by the protocol."
                  }
                ]
              }
            ]
          },
          "governance-v2-multisig-builder": {
            "title": "Challenge: Implement multisig tx builder + approval rules",
            "content": "# Challenge: Implement multisig tx builder + approval rules\n\nBuild a multisig معاملة system:\n\n- Create معاملات مع تعليمات\n- Record signer approvals\n- Enforce threshold requirements\n- Handle approval revocation\n- Generate deterministic معاملة state\n\nTests will verify threshold enforcement و approval tracking.",
            "duration": "55 min",
            "hints": [
              "Initialize signer statuses as 'pending' ل all signers.",
              "Process actions in order - each action updates the signer's status.",
              "Track the cumulative approved weight to compare against threshold.",
              "A proposal is 'approved' when approvedWeight >= threshold.",
              "A proposal is 'rejected' when no pending signers remain but threshold is not met."
            ]
          },
          "governance-v2-safe-defaults": {
            "title": "Safe defaults: owner checks و replay guards",
            "content": "# Safe defaults: owner checks و replay guards\n\nالحوكمة و multisig systems require robust الامان defaults. Understanding common vulnerabilities و their mitigations protects treasury funds.\n\nOwner checks validate that معاملات only affect authorized حسابات. ل treasury operations, verify: the treasury حساب is owned by the expected program, the signer set matches the multisig configuration, و تعليمات target allowed programs. Missing owner checks enable حساب substitution attacks.\n\nReplay guards prevent the same approved معاملة from being executed multiple times. Without replay protection, an observer could resubmit an executed معاملة to drain funds. Guards include: unique معاملة nonces, executed flags in معاملة state, و signature uniqueness checks.\n\nUpgrade safety considers how الحوكمة changes affect existing proposals. If the multisig configuration changes, pending proposals should use the old configuration while new proposals use the new one. Atomic configuration changes prevent partial updates.\n\nEmergency stops provide circuit breakers. Guardian roles can pause operations during suspected attacks. Time delays on critical changes allow review periods. These safety valves should be tested regularly.\n\n## Checklist\n- Validate حساب ownership before operations\n- Implement replay protection (nonces or flags)\n- Handle configuration changes safely\n- Add emergency pause mechanisms\n- Test الامان controls regularly\n\n## Red flags\n- No owner verification on treasury حسابات\n- Missing replay protection\n- Immediate execution of critical changes\n- No emergency stop capability\n",
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
                      "Re-executing an already-executed معاملة",
                      "Sending duplicate approval requests",
                      "Copying معاملة bytecode"
                    ],
                    "answerIndex": 0,
                    "explanation": "Replay attacks re-submit previously executed معاملات to drain funds."
                  },
                  {
                    "id": "governance-v2-l7-q2",
                    "prompt": "Why verify حساب ownership?",
                    "options": [
                      "Prevent حساب substitution attacks",
                      "Reduce معاملة size",
                      "Improve UI rendering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ownership checks ensure operations target legitimate حسابات, not attacker substitutes."
                  }
                ]
              }
            ]
          },
          "governance-v2-treasury-execution": {
            "title": "Challenge: Execute proposal و produce treasury diff",
            "content": "# Challenge: Execute proposal و produce treasury diff\n\nComplete the الحوكمة simulator checkpoint:\n\n- Execute approved proposals مع timelock validation\n- Apply treasury state changes atomically\n- Generate execution trace مع before/after diffs\n- Handle edge cases (expired, cancelled, insufficient funds)\n- Output stable, deterministic audit log\n\nThis validates your complete الحوكمة/multisig implementation.",
            "duration": "55 min",
            "hints": [
              "First validate the proposal status is 'approved'.",
              "Check if currentTimestamp - approvedAt >= timelockDuration ل timelock validation.",
              "Sum all transfer amounts و compare against treasury balance.",
              "Return canExecute: false مع appropriate error if any validation fails.",
              "Generate state changes و execution trace entries ل each successful step."
            ]
          }
        }
      }
    }
  },
  "solana-performance": {
    "title": "Solana الاداء & Compute Optimization",
    "description": "Master Solana الاداء engineering مع measurable optimization workflows: compute budgets, data layouts, encoding efficiency, و deterministic cost modeling.",
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
        "title": "الاداء Foundations",
        "description": "Compute model, حساب/data layout decisions, و deterministic cost estimation ل معاملة-level الاداء reasoning.",
        "lessons": {
          "performance-v2-compute-model": {
            "title": "Compute model: budgets, costs, و limits",
            "content": "# Compute model: budgets, costs, و limits\n\nSolana's compute model enforces deterministic execution limits through compute budgets. Understanding this model is essential ل building efficient programs that stay within limits while maximizing utility.\n\nCompute units (CUs) measure execution cost. Every operation consumes CUs: تعليمة execution, syscall usage, memory access, و logging. The default معاملة limit is 200,000 CUs (1.4 million مع prioritization), و each حساب has a 10MB max size limit.\n\nCompute budget تعليمات allow معاملات to request specific limits و set priority fees. The ComputeBudgetProgram provides: setComputeUnitLimit (override default), setComputeUnitPrice (set priority fee per CU in micro-lamports). Priority fees increase معاملة inclusion probability during congestion.\n\nCost categories include: fixed costs (signature verification, حساب loading), variable costs (تعليمة execution, CPI calls), و memory costs (حساب data access size). Understanding these categories helps optimize the right areas.\n\nMetering happens during execution. If a معاملة exceeds its compute budget, execution halts و the معاملة fails مع an error. Failed معاملات still pay fees ل consumed CUs, making optimization economically important.\n\n## عملي optimization loop\n\nUse a repeatable loop:\n1. profile real CU usage,\n2. identify top cost drivers (data layout, CPI count, logging),\n3. optimize one hotspot,\n4. re-measure و keep only proven wins.\n\nThis avoids الاداء folklore و keeps code quality intact.\n\n## Checklist\n- Understand compute unit consumption categories\n- Use ComputeBudgetProgram ل specific limits\n- Set priority fees during congestion\n- Monitor CU usage during development\n- Handle compute limit failures gracefully\n\n## Red flags\n- Ignoring compute limits in program التصميم\n- Using default limits unnecessarily high\n- Not الاختبار مع realistic data sizes\n- Missing priority fee strategies ل important معاملات\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l1-q1",
                    "prompt": "What is the default compute unit limit per معاملة?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "Unlimited"
                    ],
                    "answerIndex": 0,
                    "explanation": "The default limit is 200,000 CUs, extendable to 1.4M مع ComputeBudgetProgram."
                  },
                  {
                    "id": "performance-v2-l1-q2",
                    "prompt": "What happens when a معاملة exceeds its compute budget?",
                    "options": [
                      "Execution halts و the معاملة fails",
                      "It continues مع reduced priority",
                      "The network automatically extends the limit"
                    ],
                    "answerIndex": 0,
                    "explanation": "Exceeding the compute budget causes immediate معاملة failure."
                  }
                ]
              }
            ]
          },
          "performance-v2-account-layout": {
            "title": "حساب layout التصميم و serialization cost",
            "content": "# حساب layout التصميم و serialization cost\n\nحساب data layout significantly impacts compute costs. Well-designed layouts minimize serialization overhead و reduce حساب access costs.\n\nSerialization formats affect cost. Borsh is the standard ل Solana, offering compact binary encoding. Manual serialization can be more efficient ل simple structures but increases bug risk. Avoid JSON or other text formats on-chain due to size و parsing cost.\n\nحساب size impacts costs linearly. Loading a 10KB حساب costs more than loading 1KB. Rent exemption requires more lamports ل larger حسابات. التصميم layouts to minimize size: use fixed-size arrays instead of Vecs where possible, pack booleans into bitflags, و use appropriate integer sizes (u8/u16/u32/u64).\n\nData structure alignment affects both size و access patterns. Group related fields together ل cache efficiency. Place frequently accessed fields at the beginning of the struct. Consider zero-copy deserialization ل read-heavy operations.\n\nVersioning enables layout upgrades. Include a version byte at the start of حساب data. Migration logic can then handle different versions during deserialization. Plan ل growth by reserving padding bytes in initial layouts.\n\n## Checklist\n- Use Borsh ل standard serialization\n- Minimize حساب data size\n- Use appropriate integer sizes\n- Plan ل versioning و upgrades\n- Consider zero-copy ل read-heavy paths\n\n## Red flags\n- Using JSON ل on-chain data\n- Oversized Vec collections\n- No versioning ل upgrade paths\n- Unnecessary large integer types\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "performance-v2-l2-layout",
                "title": "حساب Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Optimized حساب",
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
            "content": "# Challenge: Implement estimateCost(op) model\n\nBuild a compute cost estimation system:\n\n- Model costs ل different operation types\n- حساب ل تعليمة complexity\n- Include memory access costs\n- Return baseline measurements\n- Handle edge cases (empty operations, large data)\n\nYour estimator will be validated against known operation costs.",
            "duration": "50 min",
            "hints": [
              "Use 5000 as the base compute unit cost per معاملة.",
              "Each حساب accessed adds 500 compute units.",
              "Each byte of data adds 10 compute units.",
              "Total = base + (حسابات × 500) + (bytes × 10)."
            ]
          },
          "performance-v2-instruction-data": {
            "title": "تعليمة data size و encoding optimization",
            "content": "# تعليمة data size و encoding optimization\n\nتعليمة data size directly impacts معاملة cost و throughput. Optimizing encoding reduces fees و increases the operations possible within compute limits.\n\nCompact encoding uses minimal bytes to represent data. Use discriminants (u8) to identify تعليمة types. Use variable-length encoding (ULEB128) ل sizes. Pack multiple boolean flags into a single u8 using bit manipulation. Avoid unnecessary padding.\n\nحساب deduplication reduces معاملة size. If an حساب appears in multiple تعليمات, include it once in the حساب list و reference by index. This is especially important ل CPI-heavy معاملات.\n\nBatching combines multiple operations into one معاملة. Instead of N معاملات مع 1 تعليمة each, use 1 معاملة مع N تعليمات. Batching amortizes signature verification و حساب loading costs across operations.\n\nRight-sizing vectors prevents overallocation. Use Vec::with_capacity when the size is known. Avoid unnecessary clones that increase heap usage. Consider stack-allocated arrays ل small, fixed-size data.\n\n## Checklist\n- Use compact discriminants ل تعليمة types\n- Pack boolean flags into bitfields\n- Deduplicate حسابات across تعليمات\n- Batch operations when possible\n- Right-size collections to avoid waste\n\n## Red flags\n- Using full u32 ل small discriminants\n- Separate booleans instead of bitflags\n- Duplicate حسابات in معاملة lists\n- Unnecessary data cloning\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "performance-v2-l4-encoding",
                "title": "Encoding Example",
                "steps": [
                  {
                    "cmd": "Before optimization",
                    "output": "200 bytes, 5 حسابات",
                    "note": "Separate bools, duplicate حسابات"
                  },
                  {
                    "cmd": "After optimization",
                    "output": "120 bytes, 3 حسابات",
                    "note": "Bitflags, deduplicated حسابات"
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
        "description": "Layout optimization, compute budget tuning, و before/after الاداء analysis مع correctness safeguards.",
        "lessons": {
          "performance-v2-optimized-layout": {
            "title": "Challenge: Implement optimized layout/codec",
            "content": "# Challenge: Implement optimized layout/codec\n\nOptimize an حساب data layout while preserving semantics:\n\n- Reduce data size through compact encoding\n- Maintain all original functionality\n- Preserve backward compatibility where possible\n- Pass regression tests\n- Measure و report size reduction\n\nYour optimized layout should be smaller but functionally equivalent.",
            "duration": "55 min",
            "hints": [
              "Sort fields by size (largest first) to minimize padding gaps.",
              "Consider if u64 fields can be reduced to u32 based on maxValue.",
              "Boolean flags can be packed into a single byte as bit flags.",
              "Calculate bytes saved as originalSize - optimizedSize."
            ]
          },
          "performance-v2-compute-budget": {
            "title": "Compute budget تعليمة الاساسيات",
            "content": "# Compute budget تعليمة الاساسيات\n\nCompute budget تعليمات give developers control over resource allocation و معاملة prioritization. Understanding these tools enables precise optimization.\n\nsetComputeUnitLimit requests a specific CU budget. The default is 200,000, but you can request up to 1,400,000. Requesting more than needed wastes fees since you pay ل the limit, not actual usage. Requesting too little causes failures.\n\nsetComputeUnitPrice sets a priority fee in micro-lamports per CU. During congestion, معاملات مع higher priority fees are more likely to be included. Priority fees are additional to base fees و go to مدققون.\n\nRequesting compute units involves tradeoffs. Higher limits enable more complex operations but cost more. Priority fees increase inclusion probability but raise costs. Profile your معاملات to set appropriate limits.\n\nHeap size can also be configured. The default heap is 32KB, extendable to 256KB مع compute budget تعليمات. Large heap enables complex data structures but increases CU consumption.\n\n## Checklist\n- Profile معاملات to determine actual CU usage\n- Set appropriate compute unit limits\n- Use priority fees during congestion\n- Consider heap size ل data-heavy operations\n- Monitor cost vs inclusion probability tradeoffs\n\n## Red flags\n- Always using maximum compute unit limits\n- Not setting priority fees during congestion\n- Ignoring heap size constraints\n- Not profiling before optimization\n",
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
                      "Set priority fee ل معاملة inclusion",
                      "Set the maximum معاملة size",
                      "Enable additional program features"
                    ],
                    "answerIndex": 0,
                    "explanation": "Priority fees increase the likelihood of معاملة inclusion during network congestion."
                  },
                  {
                    "id": "performance-v2-l6-q2",
                    "prompt": "Why request specific compute unit limits?",
                    "options": [
                      "Pay only ل what you need و prevent waste",
                      "Increase معاملة speed",
                      "Enable more حساب access"
                    ],
                    "answerIndex": 0,
                    "explanation": "Specific limits optimize costs - you pay ل the limit requested, not actual usage."
                  }
                ]
              }
            ]
          },
          "performance-v2-micro-optimizations": {
            "title": "Micro-optimizations و tradeoffs",
            "content": "# Micro-optimizations و tradeoffs\n\nالاداء optimization involves balancing competing concerns. Understanding tradeoffs helps make informed decisions about when و what to optimize.\n\nReadability vs الاداء is a constant tension. Highly optimized code often sacrifices clarity. Optimize hot paths (frequently executed code) aggressively. Keep cold paths (rarely executed) readable و maintainable.\n\nSpace vs time tradeoffs appear frequently. Pre-computing values trades memory ل speed. Compressing data trades CPU ل storage. Choose based on which resource is more constrained ل your use case.\n\nMaintainability vs optimization matters ل long-term projects. Aggressive optimizations can introduce bugs و make updates difficult. Document why optimizations exist و measure their impact.\n\nPremature optimization is a common trap. Profile before optimizing to identify actual bottlenecks. Theoretical optimizations may not match real-world behavior. Focus on algorithmic improvements before micro-optimizations.\n\nالامان must never be sacrificed ل الاداء. Bounds checking, ownership validation, و arithmetic safety are non-negotiable. Optimize around الامان, not through it.\n\n## Checklist\n- Profile before optimizing\n- Focus on hot paths\n- Document optimization decisions\n- Balance readability و الاداء\n- Never sacrifice الامان ل speed\n\n## Red flags\n- Optimizing without profiling\n- Sacrificing الامان ل الاداء\n- Unreadable code without documentation\n- Optimizing cold paths unnecessarily\n",
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
                      "Optimizing before النشر",
                      "Small الاداء improvements"
                    ],
                    "answerIndex": 0,
                    "explanation": "Premature optimization wastes effort on theoretical rather than measured bottlenecks."
                  },
                  {
                    "id": "performance-v2-l7-q2",
                    "prompt": "What should never be sacrificed ل الاداء?",
                    "options": [
                      "الامان",
                      "Code comments",
                      "Variable names"
                    ],
                    "answerIndex": 0,
                    "explanation": "الامان validations must remain regardless of الاداء optimizations."
                  }
                ]
              }
            ]
          },
          "performance-v2-perf-checkpoint": {
            "title": "Checkpoint: Compare before/after + output perf report",
            "content": "# Checkpoint: Compare before/after + output perf report\n\nComplete the optimization lab checkpoint:\n\n- Measure baseline الاداء metrics\n- Apply optimization techniques\n- Verify correctness is preserved\n- Generate الاداء comparison report\n- Output stable JSON مع sorted keys\n\nThis validates your ability to optimize while maintaining correctness.",
            "duration": "55 min",
            "hints": [
              "Compute savings by subtracting 'after' from 'before' metrics.",
              "Use approximate conversion: 1 SOL = $20, 1 SOL = 1,000,000,000 lamports.",
              "Count only optimizations where improved=true ل totalImprovements.",
              "Include دورة name as 'solana-الاداء' و version as 'v2'."
            ]
          }
        }
      }
    }
  },
  "defi-swap-aggregator": {
    "title": "DeFi Swap Aggregation",
    "description": "Master production swap aggregation on Solana: deterministic quote parsing, route optimization tradeoffs, slippage safety, و reliability-aware execution.",
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
        "description": "Token swap mechanics, slippage protection, route composition, و deterministic swap plan construction مع transparent tradeoffs.",
        "lessons": {
          "swap-v2-mental-model": {
            "title": "Swap النموذج الذهني: mints, ATAs, decimals, و routes",
            "content": "# Swap النموذج الذهني: mints, ATAs, decimals, و routes\n\nToken swaps on Solana follow a fundamentally different model than centralized exchanges. Understanding the building blocks — mints, associated token حسابات (ATAs), decimal precision, و route composition — is essential before writing any swap code.\n\nEvery SPL token on Solana is defined by a mint حساب. The mint specifies the token's total supply, decimals (0–9), و authority. When you swap \"SOL ل USDC,\" you are actually swapping wrapped SOL (mint `So11111111111111111111111111111111111111112`) ل USDC (mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`). Native SOL must be wrapped into an SPL token before any program can manipulate it as a standard token.\n\nAssociated Token حسابات (ATAs) are deterministic addresses derived from a محفظة و a mint using the Associated Token حساب program. ل every token a محفظة holds, there must be an ATA. If the recipient does not have an ATA ل the output mint, the swap معاملة must include a `createAssociatedTokenAccountIdempotent` تعليمة — a common source of معاملة failures when omitted.\n\nDecimal handling is critical. SOL uses 9 decimals (1 SOL = 1,000,000,000 lamports). USDC uses 6 decimals. When displaying \"22.5 USDC,\" the on-chain amount is 22,500,000. Mixing decimals between mints causes catastrophic pricing errors. Always convert human-readable amounts to raw integer amounts early و keep all math in integer space until the final display step.\n\nRoutes are the paths a swap takes through liquidity pools. A direct swap (SOL → USDC in a single pool) is the simplest case. When direct liquidity is insufficient or the price is better through an intermediary, the aggregator splits the swap into multiple \"legs\" — ل example, SOL → mSOL → USDC. Each leg passes through a different AMM (Automated Market Maker) program like Whirlpool, Raydium, or Orca. The aggregator's job is to find the combination of legs that produces the best output amount after fees.\n\nRoute optimization considers: pool liquidity depth, fee tiers, تأثير السعر per leg, و the total compute cost of including multiple legs in one معاملة. More legs means more تعليمات, more حسابات, و higher compute unit consumption — there is a عملي limit to route complexity within Solana's معاملة size و compute budget constraints.\n\n## Execution-quality triangle\n\nEvery route decision balances three competing goals:\n1. better output amount,\n2. lower failure risk (slippage + stale quote exposure),\n3. lower execution overhead (حسابات + compute + latency).\n\nStrong aggregators make this tradeoff explicit rather than optimizing only a single metric.\n\n## Checklist\n- Identify input و output mints by their full base58 addresses\n- Ensure ATAs exist ل both input و output tokens before swapping\n- Convert all amounts to raw integer form using the correct decimal places\n- Understand that routes may have multiple legs through different AMM programs\n- Consider compute budget implications of complex routes\n\n## Red flags\n- Mixing decimal scales between different mints\n- Forgetting to create output ATA before the swap تعليمة\n- Assuming all swaps are single-hop direct routes\n- Ignoring fees charged by متوسط pools in multi-hop routes\n",
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
                      "SPL token programs only operate on token حسابات, not native SOL",
                      "Wrapping encrypts the SOL ل privacy",
                      "Native SOL cannot be transferred on Solana"
                    ],
                    "answerIndex": 0,
                    "explanation": "AMM programs interact مع SPL token حسابات. Native SOL must be wrapped into the SPL token format so it can be processed by swap programs."
                  },
                  {
                    "id": "swap-v2-l1-q2",
                    "prompt": "What happens if the recipient has no ATA ل the output token?",
                    "options": [
                      "The swap معاملة fails unless the ATA is created in the same معاملة",
                      "Solana automatically creates the ATA",
                      "The tokens are sent to the system program"
                    ],
                    "answerIndex": 0,
                    "explanation": "ATAs must be explicitly created. Including createAssociatedTokenAccountIdempotent in the معاملة handles this safely."
                  }
                ]
              }
            ]
          },
          "swap-v2-slippage": {
            "title": "Slippage و تأثير السعر: protecting swap outcomes",
            "content": "# Slippage و تأثير السعر: protecting swap outcomes\n\nSlippage is the difference between the expected output amount at quote time و the actual amount received at execution time. In volatile markets مع active trading, pool reserves change between when you request a quote و when your معاملة lands on-chain. Slippage protection ensures you never receive less than an acceptable minimum.\n\nتأثير السعر measures how much your swap moves the pool's price. A small swap in a deep liquidity pool has near-zero تأثير السعر. A large swap in a shallow pool can move the price significantly — you are effectively trading against yourself as each unit you buy makes the next unit more expensive. تأثير السعر is calculated at quote time و should be displayed to users before they confirm.\n\nThe slippage tolerance is expressed in basis points (bps). 1 bps = 0.01%. A slippage of 50 bps means you accept up to 0.5% less than the quoted output. The minimum output amount is calculated as: minOutAmount = outAmount - (outAmount × slippageBps / 10000). This calculation MUST use integer arithmetic to avoid floating-point rounding errors. Using BigInt in JavaScript ensures exact computation.\n\nSetting slippage too tight (e.g., 1 bps) causes frequent معاملة failures because even minor pool changes exceed the tolerance. Setting it too loose (e.g., 1000 bps = 10%) exposes users to sandwich attacks where a malicious actor front-runs the swap to move the price, then back-runs after execution to profit from the price movement. The optimal range ل most swaps is 30–100 bps, مع higher values ل volatile or low-liquidity pairs.\n\nSandwich attacks exploit predictable slippage tolerances. An attacker observes your pending معاملة in the mempool, submits a معاملة to buy the output token (raising its price), lets your swap execute at the worse price, then sells the output token at profit. Tight slippage limits reduce the attacker's profit margin و may cause them to skip your معاملة entirely.\n\nDynamic slippage adjusts the tolerance based on: recent volatility, pool depth, swap size relative to pool reserves, و historical معاملة success rates. متقدم aggregators compute recommended slippage per-route to balance execution reliability مع protection. When building swap UIs, always show both the quoted output و the minimum guaranteed output so users understand their worst-case outcome.\n\n## Checklist\n- Calculate minOutAmount using integer arithmetic (BigInt)\n- Display both expected و minimum output amounts to users\n- Use 30–100 bps as default slippage ل most pairs\n- Show تأثير السعر percentage prominently ل large swaps\n- Consider dynamic slippage based on pool conditions\n\n## Red flags\n- Using floating-point math ل slippage calculations\n- Setting extremely loose slippage (>500 bps) without user warning\n- Not displaying تأثير السعر ل large swaps\n- Ignoring sandwich attack vectors in slippage التصميم\n",
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
                      "Solana only accepts BigInt in معاملات"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts are integers. Floating-point math can produce off-by-one errors that cause معاملة failures or incorrect minimum amounts."
                  }
                ]
              }
            ]
          },
          "swap-v2-route-explorer": {
            "title": "Route visualization: understanding swap legs و fees",
            "content": "# Route visualization: understanding swap legs و fees\n\nSwap routes reveal the path your tokens take through DeFi liquidity. Visualizing routes helps users understand why a multi-hop path might yield more output than a direct swap, و where fees are deducted along the way.\n\nA route consists of one or more legs. Each leg represents a swap through a specific AMM pool. The leg includes: the AMM program label (e.g., \"Whirlpool,\" \"Raydium\"), the input و output mints ل that leg, the fee charged by the pool (denominated in the output token), و the percentage of the total input allocated to this leg.\n\nSplit routes divide the input amount across multiple paths. ل example, 60% might go through Raydium SOL/USDC و 40% through Orca SOL/USDC. Splitting across pools reduces تأثير السعر because each pool handles a smaller portion of the total swap. The aggregator optimizes the split percentages to maximize total output.\n\nFee accounting is per-leg. Each AMM charges a fee (typically 0.01%–1% depending on the pool's fee tier). In concentrated liquidity pools, fee tiers are explicit (e.g., Orca's 1 bps, 4 bps, 30 bps, 100 bps tiers). The total fee across all legs determines the true cost of the route. A route مع lower per-leg fees might still be more expensive if it requires more hops.\n\nWhen rendering route information, show: the overall path (input mint → [متوسط mints] → output mint), per-leg details (AMM, fee, percentage), total fees in the output token denomination, تأثير السعر as a percentage, و the final output amounts (quoted و minimum). Color-coding or progress indicators help users quickly understand whether a route is simple (green, single hop) or complex (yellow/orange, multi-hop).\n\nEffective price is calculated as: outputAmount / inputAmount, denominated in output-per-input units. ل SOL → USDC, this gives the effective USD price of SOL ل this specific swap. Comparing the effective price against oracle or market price reveals the total cost of the swap including all fees و تأثير السعر. This \"execution cost\" metric is the most honest summary of swap quality.\n\nRoute caching و expiration matter ل UX. Quotes from aggregators have a limited validity window (typically 10–30 seconds). If the user takes too long to confirm, the quote expires و the route must be re-fetched. The UI should clearly indicate quote freshness و automatically re-quote when expired. Stale quotes that execute against current pool state will likely fail or produce worse outcomes.\n\n## Checklist\n- Show each leg مع AMM label, mints, fee, و split percentage\n- Display total fees summed across all legs\n- Calculate و display effective price (output/input)\n- Indicate quote expiration time to users\n- Color-code routes by complexity (hops count)\n\n## Red flags\n- Hiding fees from the user display\n- Not showing تأثير السعر ل large swaps\n- Allowing execution of expired quotes\n- Displaying only the best-case output without minimum\n",
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
                    "note": "Split route reduces تأثير السعر"
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
            "content": "# Challenge: Build a normalized SwapPlan from a quote\n\nParse a raw aggregator quote response و produce a normalized SwapPlan:\n\n- Extract input/output mints و amounts from the quote\n- Calculate minOutAmount using BigInt slippage arithmetic\n- Map each route leg to a normalized structure مع AMM label, mints, fees, و percentage\n- Handle zero slippage correctly (minOut equals outAmount)\n- Ensure all amounts remain as string representations of integers\n\nYour SwapPlan must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Use BigInt arithmetic to avoid floating point errors when computing minOutAmount.",
              "Slippage in basis points: minOut = outAmount - (outAmount * slippageBps / 10000).",
              "Map each routePlan entry to a normalized leg مع index, ammLabel, mints, و fees.",
              "The priceImpactPct comes directly from the quote response."
            ]
          }
        }
      },
      "swap-v2-execution": {
        "title": "Execution & Reliability",
        "description": "State-machine execution, معاملة anatomy, retry/staleness reliability patterns, و high-signal swap run reporting.",
        "lessons": {
          "swap-v2-state-machine": {
            "title": "Challenge: Implement swap UI state machine",
            "content": "# Challenge: Implement swap UI state machine\n\nBuild a deterministic state machine ل the swap UI flow:\n\n- States: idle → quoting → ready → sending → confirming → success | error\n- Process a sequence of events و track all state transitions\n- Invalid transitions should move to the error state مع a descriptive message\n- The error state supports RESET (back to idle) و RETRY (back to quoting)\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "45 min",
            "hints": [
              "Define a TRANSITIONS map: each key is a state, each value maps event names to next states.",
              "If an event is not valid ل the current state, transition to 'error' مع a descriptive message.",
              "Track each transition in a history array مع {from, event, to} objects.",
              "The 'error' state supports RESET (back to idle) و RETRY (back to quoting)."
            ]
          },
          "swap-v2-tx-anatomy": {
            "title": "Swap معاملة anatomy: تعليمات, حسابات, و compute",
            "content": "# Swap معاملة anatomy: تعليمات, حسابات, و compute\n\nA swap معاملة on Solana is a carefully ordered sequence of تعليمات that together achieve an atomic token exchange. Understanding each تعليمة's role, the حساب list requirements, و compute budget considerations is essential ل building reliable swap flows.\n\nThe typical swap معاملة contains these تعليمات in order: (1) Compute Budget: SetComputeUnitLimit و SetComputeUnitPrice to ensure the معاملة has enough compute و appropriate priority. (2) Create ATA (if needed): createAssociatedTokenAccountIdempotent ل the output token if the user doesn't already have one. (3) Wrap SOL (if input is native SOL): transfer SOL to a temporary WSOL حساب و sync its balance. (4) Swap تعليمة(s): the actual AMM program calls that execute the swap, referencing all required pool حسابات. (5) Unwrap WSOL (if output is native SOL): close the temporary WSOL حساب و recover SOL.\n\nحساب requirements scale مع route complexity. A single-hop swap through Whirlpool requires approximately 12–15 حسابات (user محفظة, token حسابات, pool state, oracle, tick arrays, etc.). A multi-hop route through two different AMMs can require 25+ حسابات, pushing against the معاملة size limit. Address Lookup Tables (ALTs) mitigate this by compressing حساب references from 32 bytes to 1 byte each, but require a separate setup معاملة.\n\nCompute budget estimation is critical. A simple SOL → USDC Whirlpool swap uses roughly 80,000–120,000 compute units. Multi-hop routes can use 200,000–400,000+. Setting the compute limit too low causes the معاملة to fail. Setting it too high wastes the user's priority fee budget (priority fee = CU price × CU limit). Aggregators typically provide a recommended compute unit limit per route.\n\nPriority fees determine معاملة ordering. During high-demand periods (popular mints, volatile markets), معاملات compete ل block space. The priority fee (in micro-lamports per compute unit) determines where your معاملة lands in the leader's queue. Too low و the معاملة may not be included; too high و the user overpays. Dynamic priority fee estimation uses recent block data to suggest competitive rates.\n\nمعاملة simulation before submission catches many errors: insufficient balance, missing حسابات, compute budget exceeded, slippage exceeded. Simulating saves the user from paying معاملة fees on doomed معاملات. The simulation result includes compute units consumed, log messages, و any error codes — all useful ل debugging.\n\nVersioned معاملات (v0) are required when using Address Lookup Tables. Legacy معاملات cannot reference ALTs. Most modern swap aggregators return versioned معاملة messages. محافظ must support versioned معاملة signing (most do, but some older محفظة adapters may not).\n\n## Checklist\n- Include compute budget تعليمات at the start of the معاملة\n- Create output ATA if it doesn't exist\n- Handle SOL wrapping/unwrapping ل native SOL swaps\n- Simulate معاملات before submission\n- Use versioned معاملات when ALTs are needed\n\n## Red flags\n- Omitting compute budget تعليمات (uses default 200k limit)\n- Not creating output ATA before the swap تعليمة\n- Forgetting to unwrap WSOL after receiving native SOL output\n- Skipping simulation و sending potentially invalid معاملات\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l6-q1",
                    "prompt": "Why are compute budget تعليمات placed first in a swap معاملة?",
                    "options": [
                      "The runtime reads them before executing other تعليمات to set limits",
                      "They must be first ل signature verification",
                      "Other تعليمات depend on their output"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compute budget تعليمات configure the معاملة's CU limit و price before any program execution begins."
                  },
                  {
                    "id": "swap-v2-l6-q2",
                    "prompt": "What is the primary benefit of Address Lookup Tables ل swaps?",
                    "options": [
                      "They compress حساب references from 32 bytes to 1 byte, fitting more حسابات in a معاملة",
                      "They make معاملات faster to execute",
                      "They reduce the number of required signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "ALTs allow معاملات to reference many حسابات without exceeding the 1232-byte معاملة size limit."
                  }
                ]
              }
            ]
          },
          "swap-v2-reliability": {
            "title": "Reliability patterns: retries, stale quotes, و latency",
            "content": "# Reliability patterns: retries, stale quotes, و latency\n\nProduction swap flows must handle the reality of network latency, expired quotes, و معاملة failures. Reliability engineering separates toy swap implementations from production-grade systems that users trust مع real money.\n\nQuote staleness is the primary reliability challenge. An aggregator quote reflects pool state at a specific moment. By the time the user reviews the quote, signs the معاملة, و it lands on-chain, pool reserves may have changed significantly. A quote older than 10–15 seconds should be considered potentially stale. The UI should show a countdown timer و automatically re-quote when the timer expires. Never allow users to send معاملات based on quotes older than 30 seconds.\n\nRetry strategies must distinguish between retryable و non-retryable failures. Retryable: network timeout, RPC node temporarily unavailable, blockhash expired (re-fetch و re-sign), و rate limiting (429 responses, back off exponentially). Non-retryable: insufficient balance, invalid حساب state, slippage exceeded (pool price moved too far, re-quote required), و program errors indicating invalid تعليمة data.\n\nExponential backoff مع jitter prevents retry storms. Base delay of 500ms, multiplied by 2 on each retry, مع random jitter of ±25% to prevent synchronized retries from multiple clients. Cap retries at 3–5 attempts. If all retries fail, present a clear error message مع actionable options: \"Quote expired — refresh و try again\" rather than generic \"معاملة failed.\"\n\nBlockhash management affects reliability. A معاملة's blockhash must be recent (within ~60 seconds / 150 slots). If a معاملة fails و you retry, the blockhash may have expired. The retry flow must: get a fresh blockhash, rebuild the معاملة مع the new blockhash, re-sign, و re-submit. This is why swap معاملة building should be a reusable function that accepts a blockhash parameter.\n\nLatency budgets help set user expectations. Typical Solana معاملة confirmation takes 400ms–2 seconds. However, during congestion, confirmation can take 5–30 seconds or fail entirely. The UI should show progressive states: \"Submitting...\" → \"Confirming...\" مع block confirmations. After 30 seconds without confirmation, offer the user a choice: wait longer, retry, or cancel (note: you cannot cancel a submitted معاملة, but you can stop polling و let the blockhash expire).\n\nمعاملة status polling should use WebSocket subscriptions (signatureSubscribe) ل real-time confirmation rather than polling getTransaction. Polling creates unnecessary RPC load و introduces latency. Subscribe immediately after sendTransaction returns a signature, و set a timeout ل maximum wait time.\n\n## Checklist\n- Show quote freshness countdown و auto-refresh\n- Classify errors as retryable vs non-retryable\n- Use exponential backoff مع jitter ل retries\n- Get fresh blockhash on each retry attempt\n- Use WebSocket subscriptions ل confirmation\n\n## Red flags\n- Retrying non-retryable errors (wastes time و fees)\n- No retry limit (infinite retry loops)\n- Sending معاملات مع stale quotes (>30 seconds)\n- Polling getTransaction instead of subscribing\n",
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
                    "note": "معاملة confirmed after retry"
                  }
                ]
              }
            ]
          },
          "swap-v2-swap-report": {
            "title": "Checkpoint: Generate a SwapRunReport",
            "content": "# Checkpoint: Generate a SwapRunReport\n\nBuild the final swap run report that combines all دورة concepts:\n\n- Summarize the route مع leg details و total fees (using BigInt summation)\n- Compute the effective price as outAmount / inAmount (9 decimal precision)\n- Include the state machine outcome (finalState from the UI flow)\n- Collect all errors from the state result و additional error sources\n- Output must be stable JSON مع deterministic key ordering\n\nThis checkpoint validates your complete understanding of swap aggregation.",
            "duration": "55 min",
            "hints": [
              "Use BigInt to sum fee amounts across all route legs.",
              "Effective price = outAmount / inAmount, formatted to 9 decimal places.",
              "Collect errors from both the state machine result و any additional errors array.",
              "Route summary should include index, ammLabel, pct, و feeAmount per leg."
            ]
          }
        }
      }
    }
  },
  "defi-clmm-liquidity": {
    "title": "CLMM Liquidity Engineering",
    "description": "Master concentrated liquidity engineering on Solana DEXs: tick math, range strategy التصميم, fee/IL dynamics, و deterministic LP position reporting.",
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
        "description": "Concentrated liquidity concepts, tick/price math, و range-position behavior needed to reason about CLMM execution.",
        "lessons": {
          "clmm-v2-vs-cpmm": {
            "title": "CLMM vs constant product: why ticks exist",
            "content": "# CLMM vs constant product: why ticks exist\n\nConcentrated Liquidity Market Makers (CLMMs) represent a fundamental evolution in automated market maker التصميم. To understand why they exist, we must first understand the limitations of the constant product model و then examine how tick-based systems solve those problems on Solana.\n\n## The constant product model و its inefficiency\n\nThe original AMM التصميم, popularized by Uniswap V2 و adopted by Raydium V1 on Solana, uses the constant product invariant: x * y = k, where x و y are the reserves of two tokens و k is a constant. When a trader swaps token A ل token B, the product must remain unchanged. This creates a smooth price curve that spans the entire range from zero to infinity.\n\nThe problem مع this approach is capital inefficiency. If a SOL/USDC pool holds $10 million in liquidity, و SOL trades between $20 و $30 ل months, the vast majority of that capital sits idle. Liquidity allocated to price ranges below $1 or above $1000 never participates in trades, earns no fees, yet still dilutes the returns ل liquidity providers (LPs). In practice, studies show that less than 5% of liquidity in constant product pools is actively used at any given time.\n\n## Concentrated liquidity: the core insight\n\nCLMMs, pioneered by Uniswap V3 و implemented on Solana by Orca Whirlpools, Raydium Concentrated Liquidity, و Meteora DLMM, allow LPs to allocate capital to specific price ranges. Instead of spreading liquidity across all possible prices, an LP can say: \"I want to provide liquidity only between $20 و $30 ل SOL/USDC.\" This concentrates their capital where trades actually happen, dramatically increasing capital efficiency.\n\nThe capital efficiency gain is substantial. An LP providing concentrated liquidity in a narrow range can achieve the same depth as a constant product LP مع 100x or even 4000x less capital, depending on how tight the range is. This means more fees earned per dollar deployed, which is the fundamental value proposition of CLMMs.\n\n## Why ticks exist\n\nTo implement concentrated liquidity, the price space must be discretized. CLMMs divide the continuous price curve into discrete points called ticks. Each tick represents a specific price, و the relationship between tick index و price follows the formula: price = 1.0001^tick. This means each tick represents a 0.01% (1 basis point) change in price from the adjacent tick.\n\nTicks serve several critical purposes. First, they provide the boundaries ل liquidity positions. When an LP creates a position from tick -1000 to tick 1000, they are defining a price range. Second, ticks are where liquidity transitions happen. As the price crosses a tick boundary, the active liquidity changes because positions that start or end at that tick become active or inactive. Third, ticks enable efficient fee tracking, because the protocol only needs to track fee growth at tick boundaries rather than at every possible price.\n\nTick spacing is an important optimization. Not every tick is usable in every pool. Pools مع higher fee tiers use wider tick spacing (e.g., 64 or 128 ticks apart) to reduce gas costs و state size. A pool مع tick spacing of 64 means LPs can only place position boundaries at tick indices that are multiples of 64. This tradeoff reduces granularity but improves on-chain efficiency, which is especially important on Solana where حساب sizes و compute units matter.\n\n## Solana-specific CLMM considerations\n\nOn Solana, CLMMs face unique architectural challenges. The نموذج الحسابات requires pre-allocated tick arrays that store tick data in contiguous ranges. Orca Whirlpools, ل example, uses tick array حسابات that each hold 88 ticks worth of data. The program must load the correct tick array حسابات as تعليمات, which means swaps that cross many ticks require more حسابات و more compute units.\n\nThe Solana runtime's 1232-byte معاملة size limit و 200,000 compute unit default also constrain CLMM operations. Large swaps that cross multiple tick boundaries may need to be split across multiple معاملات, و position management operations must be carefully optimized to fit within these constraints.\n\n## LP decision framework\n\nBefore opening any CLMM position, answer three questions:\n1. What price regime am I targeting (mean-reverting vs trending)?\n2. How actively can I rebalance when out-of-range?\n3. What failure budget can I tolerate ل fees vs IL vs rebalance costs?\n\nCLMM returns come from strategy discipline, not just math formulas.\n\n## Checklist\n- Understand that x*y=k spreads liquidity across all prices, wasting capital\n- CLMMs let LPs concentrate capital in specific price ranges\n- Ticks discretize the price space at 1 basis point intervals\n- Tick spacing varies by pool fee tier ل on-chain efficiency\n- Solana CLMMs use tick array حسابات ل state management\n\n## Red flags\n- Assuming CLMM positions behave like constant product positions\n- Ignoring tick spacing when placing position boundaries\n- Underestimating compute costs ل swaps crossing many ticks\n- Forgetting that out-of-range positions earn zero fees\n",
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
                      "Lower معاملة fees ل traders",
                      "No need ل oracle price feeds"
                    ],
                    "answerIndex": 0,
                    "explanation": "CLMMs allow LPs to allocate capital to specific price ranges, dramatically improving capital efficiency compared to spreading liquidity across all prices."
                  },
                  {
                    "id": "clmm-v2-l1-q2",
                    "prompt": "Why do CLMMs use ticks to discretize the price space?",
                    "options": [
                      "To define position boundaries و track liquidity transitions efficiently",
                      "To make prices easier ل humans to read",
                      "To reduce the number of tokens in the pool"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ticks provide discrete price points ل position boundaries, liquidity transitions, و efficient fee tracking at tick crossings."
                  }
                ]
              }
            ]
          },
          "clmm-v2-price-tick": {
            "title": "Price, tick, و sqrtPrice: core conversions",
            "content": "# Price, tick, و sqrtPrice: core conversions\n\nThe mathematical foundation of every CLMM rests on three interrelated representations of price: the human-readable price, the tick index, و the sqrtPriceX64. Understanding how to convert between these representations is essential ل building any CLMM integration on Solana.\n\n## Tick to price conversion\n\nThe fundamental relationship between a tick index و price is: price = 1.0001^tick. This formula means that each consecutive tick represents a 0.01% (1 basis point) change in price. Tick 0 corresponds to a price of 1.0. Positive ticks yield prices greater than 1, و negative ticks yield prices less than 1.\n\nل example, tick 23027 gives a price of approximately 10.0 (since 1.0001^23027 is roughly 10). Tick -23027 gives approximately 0.1. This logarithmic spacing means ticks provide consistent relative precision across all price levels. Whether the price is 0.001 or 1000, adjacent ticks always differ by 0.01%.\n\nThe inverse conversion from price to tick uses the natural logarithm: tick = ln(price) / ln(1.0001). Since tick indices must be integers, this value is typically rounded to the nearest integer. In practice, you also need to align the tick to the pool's tick spacing, which means rounding down to the nearest multiple of the tick spacing value.\n\n## The sqrtPrice representation\n\nCLMMs do not store price directly on-chain. Instead, they store the square root of the price in a fixed-point format called sqrtPriceX64. This representation has two important advantages.\n\nFirst, using the square root simplifies the core AMM math. The amount of token0 in a position is proportional to (1/sqrtPrice_lower - 1/sqrtPrice_upper), و the amount of token1 is proportional to (sqrtPrice_upper - sqrtPrice_lower). These linear relationships are much easier to compute on-chain than the original price-based formulas would be.\n\nSecond, the X64 fixed-point format (also called Q64.64) provides high precision without floating-point arithmetic. The sqrtPrice is multiplied by 2^64 و stored as a 128-bit unsigned integer. This means sqrtPriceX64 = sqrt(price) * 2^64. ل tick 0 (price = 1.0), the sqrtPriceX64 is exactly 2^64 = 18446744073709551616.\n\nOn Solana, Orca Whirlpools stores this value as a u128 in the Whirlpool حساب state. Every swap operation updates this value as the price moves. The sqrt_price field is the canonical source of truth ل the current pool price.\n\n## Decimal handling و token precision\n\nReal-world tokens have different decimal places. SOL has 9 decimals, USDC has 6 decimals. The tick-to-price formula gives a \"raw\" price that must be adjusted ل decimals. If token0 is SOL (9 decimals) و token1 is USDC (6 decimals), the human-readable price is: display_price = raw_price * 10^(decimals0 - decimals1) = raw_price * 10^(9-6) = raw_price * 1000.\n\nThis decimal adjustment is critical و a common source of bugs. Always track which token is token0 و which is token1 in the pool, و apply the correct decimal scaling when converting between on-chain tick values و display prices.\n\n## Tick spacing و alignment\n\nNot every tick index is a valid position boundary. Each pool has a tick_spacing parameter that determines which ticks can be used. Common values are: 1 (ل stable pairs مع 0.01% fee), 8 (ل 0.04% fee pools), 64 (ل 0.30% fee pools), و 128 (ل 1.00% fee pools).\n\nTo align a tick to the pool's tick spacing, use: aligned_tick = floor(tick / tick_spacing) * tick_spacing. This always rounds toward negative infinity, ensuring consistent behavior ل both positive و negative ticks. ل example, مع tick spacing 64: tick 100 aligns to 64, tick -100 aligns to -128.\n\n## Precision considerations\n\nFloating-point arithmetic introduces rounding errors in tick/price conversions. When converting price to tick و back, the result may differ by 1 tick due to floating-point precision limits. ل on-chain operations, always use the integer tick index as the source of truth و derive the price from it, never the reverse.\n\nThe sqrtPriceX64 computation using BigInt avoids floating-point issues ل the final representation, but the متوسط sqrt و pow operations still use JavaScript's 64-bit floats. ل production systems processing large values, consider using dedicated decimal libraries or performing these computations مع higher-precision arithmetic.\n\n## Checklist\n- price = 1.0001^tick ل tick-to-price conversion\n- tick = round(ln(price) / ln(1.0001)) ل price-to-tick conversion\n- sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64))\n- Align ticks to tick spacing: floor(tick / spacing) * spacing\n- Adjust ل token decimals when displaying human-readable prices\n\n## Red flags\n- Ignoring decimal differences between token0 و token1\n- Using floating-point price as source of truth instead of tick index\n- Forgetting tick spacing alignment when creating positions\n- Overflow in sqrtPriceX64 computation ل extreme tick values\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l2-q1",
                    "prompt": "What is the sqrtPriceX64 value ل tick 0 (price = 1.0)?",
                    "options": [
                      "2^64 = 18446744073709551616",
                      "1",
                      "2^128"
                    ],
                    "answerIndex": 0,
                    "explanation": "At tick 0, price = 1.0, sqrt(1.0) = 1.0, و sqrtPriceX64 = 1.0 * 2^64 = 18446744073709551616."
                  },
                  {
                    "id": "clmm-v2-l2-q2",
                    "prompt": "Why do CLMMs store sqrtPrice instead of price directly?",
                    "options": [
                      "It simplifies the AMM math — token amounts become linear in sqrtPrice",
                      "It uses less storage space on-chain",
                      "It makes the price harder ل MEV bots to read"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts in a CLMM position are linear functions of sqrtPrice, making on-chain computation simpler و more gas-efficient."
                  }
                ]
              }
            ]
          },
          "clmm-v2-range-explorer": {
            "title": "Range positions: in-range و out-of-range dynamics",
            "content": "# Range positions: in-range و out-of-range dynamics\n\nA CLMM position is defined by its lower tick و upper tick. These two boundaries determine the price range in which the position is active, earns fees, و holds a mix of both tokens. Understanding in-range و out-of-range behavior is fundamental to managing concentrated liquidity effectively on Solana.\n\n## Anatomy of a range position\n\nWhen an LP creates a position on Orca Whirlpools (or any Solana CLMM), they specify three parameters: the lower tick index, the upper tick index, و the amount of liquidity to provide. The protocol then calculates how much of each token the LP must deposit based on the current price relative to the position's range.\n\nIf the current price is within the range (lower_tick <= current_tick <= upper_tick), the LP deposits both tokens. The ratio depends on where the current price sits within the range. If the price is near the lower bound, the position holds mostly token0. If near the upper bound, it holds mostly token1. This is the direct analog of how a constant product pool holds different ratios at different prices, but concentrated into the LP's chosen range.\n\n## In-range behavior\n\nWhen the current pool price is within a position's range, the position is in-range و actively participates in swaps. Every swap that moves the price within this range uses the position's liquidity و generates fees ل the LP.\n\nThe fee accrual mechanism works as follows: the pool tracks a global fee_growth value ل each token. When a swap occurs, the fee (e.g., 0.30% of the swap amount) is distributed proportionally across all in-range liquidity. Each position tracks its own fee_growth snapshot, و uncollected fees are the difference between the current global growth و the position's snapshot, multiplied by the position's liquidity.\n\nIn-range positions experience impermanent loss (IL) as the price moves. When the price moves up, the position converts token0 into token1 (selling token0 at higher prices). When the price moves down, it converts token1 into token0. This rebalancing is the source of IL, و it is more pronounced in CLMMs than in constant product pools because the liquidity is concentrated in a narrower range.\n\n## Out-of-range behavior\n\nWhen the price moves outside a position's range, the position becomes out-of-range. This has critical implications. The position stops earning fees entirely because it no longer participates in swaps. The position holds 100% of one token: if the price moved above the upper tick, the position holds entirely token1 (all token0 was sold as the price rose). If the price moved below the lower tick, the position holds entirely token0 (all token1 was sold as the price fell).\n\nAn out-of-range position is effectively a limit order that has been filled. If you set a range above the current price و the price rises through it, your token0 is converted to token1 at prices within your range. This property makes CLMMs useful ل implementing range orders و dollar-cost averaging strategies.\n\nOut-of-range positions still exist on-chain و can be closed or modified at any time. The LP can withdraw their single-sided holdings, or they can wait ل the price to return to their range. If the price returns, the position automatically becomes active again و starts earning fees.\n\n## Position composition at boundaries\n\nAt the exact lower tick, the position holds 100% token0 و 0% token1. At the exact upper tick, it holds 0% token0 و 100% token1. At any price between, the composition is a function of where the current sqrtPrice sits relative to the range boundaries.\n\nThe token amounts are calculated as: amount0 = liquidity * (1/sqrtPrice_current - 1/sqrtPrice_upper) و amount1 = liquidity * (sqrtPrice_current - sqrtPrice_lower). These formulas only apply when the price is in-range. When out-of-range below, amount0 = liquidity * (1/sqrtPrice_lower - 1/sqrtPrice_upper) و amount1 = 0. When out-of-range above, amount0 = 0 و amount1 = liquidity * (sqrtPrice_upper - sqrtPrice_lower).\n\n## Active liquidity و the liquidity curve\n\nThe pool's active liquidity at any given price is the sum of all in-range positions at that price. This creates a liquidity distribution curve that can have complex shapes depending on where LPs have placed their positions. Deeper liquidity at the current price means less slippage ل traders.\n\nOn Solana, this active liquidity is stored in the Whirlpool حساب's liquidity field و is updated whenever the price crosses a tick boundary where positions start or end. The tick array حسابات store the net liquidity change at each initialized tick, allowing the program to efficiently update active liquidity during swaps.\n\n## Checklist\n- In-range positions earn fees و hold both tokens\n- Out-of-range positions earn zero fees و hold one token\n- Token composition varies continuously within the range\n- Active liquidity is the sum of all in-range positions\n- Fee growth tracking uses global vs position-level snapshots\n\n## Red flags\n- Expecting fees from out-of-range positions\n- Ignoring the single-sided nature of out-of-range holdings\n- Forgetting to حساب ل IL in concentrated positions\n- Assuming position composition is static within a range\n",
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
            "content": "# Challenge: Implement tick/price conversion helpers\n\nImplement the core tick math functions used in every CLMM integration:\n\n- Convert a tick index to a human-readable price using price = 1.0001^tick\n- Convert the price to sqrtPriceX64 using Q64.64 fixed-point encoding\n- Reverse-convert a price back to the nearest tick index\n- Align a tick index to the pool's tick spacing\n\nYour implementation will be tested against known tick values including tick 0, positive ticks, و negative ticks.",
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
        "description": "Fee accrual simulation, range strategy tradeoffs, precision pitfalls, و deterministic position risk reporting.",
        "lessons": {
          "clmm-v2-position-fees": {
            "title": "Challenge: Simulate position fee accrual",
            "content": "# Challenge: Simulate position fee accrual\n\nImplement a fee accrual simulator ل a CLMM position over a price path:\n\n- Convert lower و upper tick boundaries to prices\n- Walk through each price in the path و determine in-range or out-of-range status\n- Accrue fees proportional to trade volume when in-range\n- Compute annualized fee APR\n- Track periods in-range vs out-of-range\n- Determine current status from the final price\n\nThis simulates the real-world behavior of concentrated liquidity positions as prices move.",
            "duration": "50 min",
            "hints": [
              "Convert ticks to prices: lowerPrice = 1.0001^lowerTick, upperPrice = 1.0001^upperTick.",
              "ل each price in the path, check if lowerPrice <= price <= upperPrice.",
              "Fees only accrue when the position is in range. fee = floor(volumePerPeriod * feeRate).",
              "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimal places.",
              "Current status is based on the last price in the path relative to the range."
            ]
          },
          "clmm-v2-range-strategy": {
            "title": "Range strategies: tight, wide, و rebalancing rules",
            "content": "# Range strategies: tight, wide, و rebalancing rules\n\nChoosing the right price range is the most important decision a CLMM liquidity provider makes. The range determines capital efficiency, fee income, impermanent loss exposure, و rebalancing frequency. This درس covers the major strategies و the tradeoffs between them.\n\n## Tight ranges: maximum efficiency, maximum risk\n\nA tight range concentrates all liquidity into a narrow price band. ل example, providing liquidity ل SOL/USDC within +/- 2% of the current price. The advantages are significant: capital efficiency can be 100x or more compared to a full-range position, و the LP earns a proportionally larger share of trading fees.\n\nHowever, tight ranges carry substantial risks. The position goes out-of-range frequently, requiring active monitoring و rebalancing. Each time the position goes out-of-range, the LP has fully converted to one token و stops earning fees. The LP also realizes impermanent loss on each range crossing, و the gas costs of frequent rebalancing can eat into profits.\n\nTight ranges work best ل stable pairs (USDC/USDT) where the price rarely deviates significantly, ل professional LPs who can automate rebalancing, و ل short-term positions where the LP has a strong directional view.\n\n## Wide ranges: passive و resilient\n\nA wide range covers a larger price band, such as +/- 50% or even the full price range. Capital efficiency is lower, but the position stays in-range longer و requires less active management. Fee income per dollar is lower, but the position earns fees more consistently.\n\nWide ranges suit passive LPs who cannot actively monitor positions, volatile pairs where the price can swing dramatically, و LPs who want to minimize rebalancing costs و IL realization events.\n\nThe extreme case is a full-range position covering all ticks. This replicates constant product AMM behavior و never goes out-of-range. While capital-inefficient, it provides maximum resilience و is appropriate ل very volatile or low-liquidity pairs.\n\n## Asymmetric ranges و directional bets\n\nLPs can create asymmetric ranges that express a directional view. If you believe SOL will appreciate against USDC, you might set a range from the current price up to 2x the current price. This means you are providing liquidity as SOL appreciates, selling SOL at progressively higher prices. If SOL drops, your position immediately goes out-of-range و you hold SOL, preserving your long exposure.\n\nConversely, a range set below the current price acts like a limit buy order. You deposit USDC, و if SOL's price drops into your range, your USDC is converted to SOL at your desired prices.\n\n## Rebalancing strategies\n\nRebalancing is the process of closing an out-of-range position و opening a new one centered on the current price. The key decisions are: when to rebalance, و how to set the new range.\n\nTime-based rebalancing checks the position at fixed intervals (hourly, daily) و rebalances if out-of-range. This is simple to implement but may miss optimal timing. Price-based rebalancing uses the current price relative to the range boundaries. A common trigger is rebalancing when the price exits the inner 50% of the range, before it actually goes out-of-range.\n\nThreshold-based rebalancing waits until the IL or missed-fee cost of remaining out-of-range exceeds the cost of rebalancing (gas fees, slippage on swaps needed to rebalance token composition). This is the most capital-efficient approach but requires sophisticated modeling.\n\nOn Solana, rebalancing a Whirlpool position involves three operations: collecting unclaimed fees, closing the old position (withdrawing liquidity و burning the position NFT), و opening a new position مع updated range. These operations typically fit in two to three معاملات depending on the number of حسابات involved.\n\n## Automated vault strategies\n\nSeveral protocols on Solana automate CLMM range management. These vault protocols (such as Kamino Finance) accept LP deposits و automatically create, monitor, و rebalance concentrated liquidity positions. They use various strategies including mean-reversion, momentum-following, و volatility-adjusted range widths.\n\nWhen evaluating automated vaults, consider: the strategy's historical الاداء, the management و الاداء fees, the rebalancing frequency و associated costs, و the vault's transparency about its position management logic.\n\n## Checklist\n- Tight ranges maximize efficiency but require active management\n- Wide ranges provide resilience at the cost of efficiency\n- Asymmetric ranges can express directional views\n- Rebalancing triggers: time-based, price-based, or threshold-based\n- Consider automated vaults ل passive management\n\n## Red flags\n- Using tight ranges without monitoring or automation\n- Rebalancing too frequently, losing fees to gas costs\n- Ignoring the realized IL at each rebalancing event\n- Assuming past APR will predict future returns\n",
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
                      "Higher capital efficiency but more frequent out-of-range events و rebalancing",
                      "Lower fees but less impermanent loss",
                      "More tokens required to open the position"
                    ],
                    "answerIndex": 0,
                    "explanation": "Tight ranges concentrate capital ل higher efficiency و fee share, but the position goes out-of-range more often, requiring active management."
                  },
                  {
                    "id": "clmm-v2-l6-q2",
                    "prompt": "When should an LP consider a full-range (all ticks) position?",
                    "options": [
                      "ل very volatile pairs where the price may swing dramatically",
                      "Only ل stablecoin pairs",
                      "Never — it is always suboptimal"
                    ],
                    "answerIndex": 0,
                    "explanation": "Full-range positions replicate constant product behavior و never go out-of-range, making them suitable ل highly volatile or unpredictable pairs."
                  }
                ]
              }
            ]
          },
          "clmm-v2-risk-review": {
            "title": "CLMM risks: rounding, overflow, و tick spacing errors",
            "content": "# CLMM risks: rounding, overflow, و tick spacing errors\n\nBuilding reliable CLMM integrations requires awareness of precision risks that can cause incorrect calculations, failed معاملات, or lost funds. This درس catalogs the most common pitfalls in tick math, fee computation, و position management on Solana.\n\n## Floating-point rounding in tick conversions\n\nThe tick-to-price formula price = 1.0001^tick و its inverse tick = ln(price) / ln(1.0001) both involve floating-point arithmetic. JavaScript's Number type uses IEEE 754 double-precision (64-bit) floats, which provide approximately 15-17 significant decimal digits. ل most tick ranges (roughly -443636 to +443636, the valid CLMM range), this precision is sufficient.\n\nHowever, rounding errors accumulate in compound operations. Converting a tick to a price و back may yield tick +/- 1 due to floating-point rounding in the logarithm. The safest practice is to always treat the integer tick index as the canonical value. If you need a price, derive it from the tick. If you need a tick from a user-entered price, compute the tick و then show the user the exact price that tick represents, so they see the actual boundary rather than an approximation.\n\nThe Math.round function in the priceToTick conversion introduces its own edge cases. When the true tick is exactly X.5, Math.round uses \"round half to even\" (banker's rounding) in some environments. ل CLMM math, always round toward the nearest valid tick و then align to tick spacing.\n\n## Overflow in sqrtPriceX64 computation\n\nThe sqrtPriceX64 value is stored as a u128 on-chain (128-bit unsigned integer). In JavaScript, this must be handled مع BigInt. The متوسط computation sqrt(price) * 2^64 can overflow a 64-bit float ل extreme tick values. At the maximum valid tick (443636), the price is approximately 1.34 * 10^19, و sqrt(price) * 2^64 is approximately 6.75 * 10^28, which fits in a u128 but exceeds the safe integer range of JavaScript Numbers.\n\nAlways use BigInt ل the final sqrtPriceX64 value. ل متوسط computations at extreme ticks, consider using a high-precision library or performing the computation in Rust (where Solana programs actually run). ل client-side JavaScript, the عملي risk is manageable ل common token pairs but must be tested at boundary conditions.\n\n## Tick spacing alignment errors\n\nA frequent bug is creating positions مع tick boundaries that are not aligned to the pool's tick spacing. The on-chain program will reject these positions, but the error message may be cryptic. Always align ticks before submitting معاملات: aligned = floor(tick / tickSpacing) * tickSpacing.\n\nBe careful مع negative ticks: floor(-100 / 64) = floor(-1.5625) = -2, so -100 aligns to -128, not -64. This is correct behavior (rounding toward negative infinity), but developers who expect truncation toward zero will get wrong results. Test مع negative ticks explicitly.\n\n## Fee computation precision\n\nFee growth values in CLMMs use 128-bit fixed-point arithmetic (Q64.64 or Q128.128 depending on the implementation). When computing uncollected fees, the formula is: uncollected_fees = (global_fee_growth - position_fee_growth_snapshot) * liquidity.\n\nBoth the subtraction و the multiplication can overflow if not handled carefully. On Solana, the program uses checked arithmetic و wrapping subtraction (since fee_growth is monotonically increasing و wraps around). Client-side code must replicate this wrapping behavior when reading on-chain state.\n\nA common mistake is computing fees مع JavaScript Numbers, which lose precision ل large BigInt values. Always use BigInt ل fee calculations و only convert to Number at the final display step, after applying decimal adjustments.\n\n## Decimal mismatch between tokens\n\nDifferent tokens have different decimal places (SOL: 9, USDC: 6, BONK: 5). When computing position values, token amounts, or fee amounts, the decimal places must be consistently applied. A common bug is computing IL in raw amounts without normalizing to the same decimal base, leading to wildly incorrect results.\n\nAlways track the decimal places of both tokens in the pool و apply them when converting between raw amounts و display amounts. The on-chain CLMM program operates entirely in raw (lamport-level) amounts; all decimal formatting is a client-side responsibility.\n\n## حساب و compute unit limits\n\nSolana-specific risks include exceeding compute unit limits during swaps that cross many ticks, requiring too many tick array حسابات (each swap can reference at most a few tick arrays), و حساب size limits ل position management.\n\nWhen building swap معاملات, estimate the number of tick crossings و include sufficient tick array حسابات. If a swap would cross more ticks than can be accommodated, the معاملة will fail. Splitting large swaps across multiple معاملات or using a routing protocol helps mitigate this risk.\n\n## Checklist\n- Use integer tick index as canonical, derive price from it\n- Use BigInt ل sqrtPriceX64 و all fee computations\n- Always align ticks to tick spacing مع floor division\n- Test مع negative ticks, zero ticks, و extreme ticks\n- Apply correct decimal places ل each token in the pool\n\n## Red flags\n- Using JavaScript Number ل sqrtPriceX64 or fee amounts\n- Forgetting wrapping subtraction ل fee growth deltas\n- Truncating instead of flooring ل negative tick alignment\n- Computing IL or fees without matching token decimals\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l7-q1",
                    "prompt": "Why should you always use BigInt ل sqrtPriceX64 values?",
                    "options": [
                      "JavaScript Number cannot safely represent 128-bit integers",
                      "BigInt is faster than Number ل CLMM math",
                      "Solana requires BigInt in معاملة تعليمات"
                    ],
                    "answerIndex": 0,
                    "explanation": "sqrtPriceX64 is a u128 value that can exceed JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1). BigInt provides arbitrary precision integer arithmetic."
                  },
                  {
                    "id": "clmm-v2-l7-q2",
                    "prompt": "What happens when negative ticks are aligned مع floor division?",
                    "options": [
                      "They round toward negative infinity — e.g., -100 مع spacing 64 becomes -128",
                      "They round toward zero — e.g., -100 مع spacing 64 becomes -64",
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
            "content": "# Checkpoint: Generate a Position Report\n\nImplement a comprehensive LP position report generator that combines all CLMM concepts:\n\n- Convert tick boundaries to human-readable prices\n- Determine in-range or out-of-range status from the current price\n- Aggregate fee history into total earned fees per token\n- Compute annualized fee APR\n- Calculate impermanent loss percentage\n- Return a complete, deterministic position report\n\nThis checkpoint validates your understanding of tick math, fee accrual, range dynamics, و position analysis.",
            "duration": "55 min",
            "hints": [
              "Convert ticks to prices: price = 1.0001^tick. Use toFixed(6) ل display.",
              "Status is 'in-range' if lowerPrice <= currentPrice <= upperPrice.",
              "Sum feeHistory entries using BigInt ل total fees per token.",
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
    "description": "Master Solana lending risk engineering: utilization و rate mechanics, liquidation path analysis, oracle safety, و deterministic scenario reporting.",
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
        "description": "Lending pool mechanics, utilization-driven rate models, و health-factor foundations required ل defensible risk analysis.",
        "lessons": {
          "lending-v2-pool-model": {
            "title": "Lending pool model: supply, borrow, و utilization",
            "content": "# Lending pool model: supply, borrow, و utilization\n\nLending protocols are the backbone of decentralized finance. They enable users to earn yield on idle assets by supplying them to a shared pool, while borrowers draw from that pool by posting collateral. Understanding the mechanics of supply, borrow, و utilization is essential before diving into interest rate models or liquidation logic.\n\nA lending pool is a smart contract (or set of حسابات on Solana) that holds a reserve of a single token — ل example, USDC. Suppliers deposit tokens into the pool و receive interest-bearing receipt tokens in return. On Solana-based protocols like Solend, MarginFi, or Kamino, these receipt tokens track each supplier's proportional share of the growing pool. When a supplier withdraws, they redeem receipt tokens ل the underlying asset plus accrued interest.\n\nBorrowers interact مع the same pool from the other side. To borrow from the USDC pool, a user must first deposit collateral into one or more other pools (ل example, SOL). The protocol values the collateral in USD terms و allows the user to borrow up to a percentage of that value, determined by the loan-to-value (LTV) ratio. If SOL has an LTV of 75%, depositing $1,000 worth of SOL allows borrowing up to $750 in USDC. The borrowed amount accrues interest over time, increasing the user's debt.\n\nThe utilization ratio is the single most important metric in a lending pool. It is defined as:\n\nutilization = totalBorrowed / totalSupply\n\nwhere totalSupply is the sum of all deposits (including borrowed amounts that are still owed back to the pool). When utilization is 0%, no assets are borrowed — suppliers earn nothing. When utilization is 100%, every deposited asset is lent out — no supplier can withdraw because there is no liquidity available. Healthy protocols target utilization between 60% و 85%, balancing yield ل suppliers against withdrawal liquidity.\n\nThe reserve factor is a protocol-level parameter that skims a percentage of the interest paid by borrowers before distributing the remainder to suppliers. If borrowers pay 10% annual interest و the reserve factor is 10%, the protocol retains 1% و suppliers receive the effective yield on the remaining 9%. Reserve funds are used ل protocol insurance, development, و الحوكمة treasury. Understanding the reserve factor is critical because it directly reduces the supply-side APY relative to the borrow-side APR.\n\nPool accounting must be exact. Solana lending protocols typically use a shares-based model: when you deposit 100 USDC into a pool مع 1,000 USDC total و 1,000 shares outstanding, you receive 100 shares. As interest accrues, the total USDC in the pool grows (say to 1,100 USDC), but the share count remains 1,100. Your 100 shares are now worth 100 USDC — the value per share increased. This model avoids iterating over every depositor to distribute interest. The same pattern applies to borrow shares, tracking each borrower's proportional debt.\n\nOn Solana specifically, lending pools are represented as program-derived حسابات. The reserve حساب holds the token balance, a reserve config حساب stores parameters (LTV, liquidation threshold, reserve factor, interest rate model), و individual obligation حسابات track each user's deposits و borrows. Programs like Solend use the spl-token program ل token custody و Pyth or Switchboard oracles ل price feeds.\n\n## Risk-operator mindset\n\nTreat every pool as a control system, not just a yield product:\n1. utilization controls liquidity stress,\n2. rate model controls borrower behavior,\n3. oracle quality controls collateral truth,\n4. liquidation speed controls solvency recovery.\n\nWhen one control weakens, the others must compensate.\n\n## Checklist\n- Understand the relationship between supply, borrow, و utilization\n- Know that utilization = totalBorrowed / totalSupply\n- Recognize that the reserve factor reduces supplier yield\n- Understand share-based accounting ل deposits و borrows\n- Identify the key on-chain حسابات in a Solana lending pool\n\n## Red flags\n- Utilization at or near 100% (withdrawal liquidity crisis)\n- Missing or zero reserve factor (no protocol safety buffer)\n- Share-price manipulation through donation attacks\n- Pools without oracle-backed price feeds ل collateral valuation\n",
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
            "title": "Interest rate curves و the kink model",
            "content": "# Interest rate curves و the kink model\n\nInterest rates in lending protocols are not fixed. They adjust dynamically based on pool utilization to balance supply و demand ل liquidity. The piecewise-linear \"kink\" model is the dominant interest rate التصميم used across DeFi lending protocols, from Compound و Aave on Ethereum to Solend و MarginFi on Solana.\n\nThe core insight is simple: when utilization is low, borrowing should be cheap to encourage demand. When utilization is high, borrowing should be expensive to discourage further borrowing و incentivize new deposits. The kink model achieves this مع two linear segments joined at a critical utilization point called the \"kink.\"\n\nThe kink model has four parameters: baseRate, slope1, slope2, و kink. The baseRate is the minimum borrow rate when utilization is zero. Slope1 is the rate of increase below the kink — a gentle incline that gradually raises borrow costs as utilization increases. The kink is the target utilization (typically 0.80 or 80%). Slope2 is the steep rate of increase above the kink — a sharp jump that penalizes borrowing when the pool approaches full utilization.\n\nBelow the kink, the borrow rate formula is:\n\nborrowRate = baseRate + (utilization / kink) * slope1\n\nThis creates a gentle linear increase. At 50% utilization مع a kink at 80%, baseRate of 2%, و slope1 of 10%, the borrow rate would be: 0.02 + (0.50 / 0.80) * 0.10 = 0.02 + 0.0625 = 0.0825 or 8.25%.\n\nAbove the kink, the formula becomes:\n\nborrowRate = baseRate + slope1 + ((utilization - kink) / (1 - kink)) * slope2\n\nThe full slope1 is added (the rate at the kink point), plus a steep increase proportional to how far utilization exceeds the kink. مع slope2 = 1.00 (100%), at 90% utilization: 0.02 + 0.10 + ((0.90 - 0.80) / (1 - 0.80)) * 1.00 = 0.02 + 0.10 + 0.50 = 0.62 or 62%. This dramatic jump is intentional — it makes borrowing above 80% utilization extremely expensive, creating strong pressure to restore utilization below the kink.\n\nThe supply rate is derived from the borrow rate, utilization, و reserve factor:\n\nsupplyRate = borrowRate * utilization * (1 - reserveFactor)\n\nSuppliers only earn on the portion of the pool that is actively borrowed, و the reserve factor takes its cut. At 50% utilization, an 8.25% borrow rate, و 10% reserve factor: 0.0825 * 0.50 * 0.90 = 0.037125 or 3.71% supply APY.\n\nWhy the kink matters: without the steep slope2, high utilization would only moderately increase rates, potentially leading to a \"liquidity death spiral\" where all assets are borrowed و no supplier can withdraw. The kink creates an economic circuit breaker. Protocols tune these parameters through الحوكمة — adjusting the kink point, slopes, و base rate to target different utilization profiles ل different assets. Stablecoins typically have higher kinks (85-90%) because their prices are stable, while volatile assets have lower kinks (65-75%) to maintain larger liquidity buffers.\n\nReal-world Solana protocols often extend this model مع additional features: rate smoothing (averaging over recent blocks to prevent rapid oscillations), multiple kink points ل more granular control, و dynamic parameter adjustment based on market conditions. However, the fundamental two-slope kink model remains the foundation.\n\n## Checklist\n- Understand the four parameters: baseRate, slope1, slope2, kink\n- Calculate borrow rate below و above the kink\n- Derive supply rate from borrow rate, utilization, و reserve factor\n- Recognize why steep slope2 prevents liquidity crises\n- Know that different assets use different kink parameters\n\n## Red flags\n- Slope2 too low (insufficient deterrent ل high utilization)\n- Kink set too high (leaves insufficient withdrawal buffer)\n- Base rate at zero (no minimum cost of borrowing)\n- Parameters unchanged despite market condition shifts\n",
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
                    "explanation": "Above the kink, slope2 (the jump multiplier) applies, causing borrow rates to spike sharply و discourage further borrowing."
                  },
                  {
                    "id": "lending-v2-l2-q2",
                    "prompt": "Why is the supply rate always lower than the borrow rate?",
                    "options": [
                      "Suppliers only earn on the borrowed portion, و the reserve factor takes a cut",
                      "The protocol subsidizes borrowers",
                      "Supply rates are fixed by الحوكمة"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply rate = borrowRate * utilization * (1 - reserveFactor). Since utilization < 1 و reserveFactor > 0, the supply rate is always less than the borrow rate."
                  }
                ]
              }
            ]
          },
          "lending-v2-health-explorer": {
            "title": "Health factor monitoring و liquidation preview",
            "content": "# Health factor monitoring و liquidation preview\n\nThe health factor is the single number that determines whether a lending position is safe or subject to liquidation. Monitoring health factors in real time is essential ل both borrowers (to avoid liquidation) و liquidators (to identify profitable liquidation opportunities). Understanding how to compute, interpret, و react to health factor changes is a core skill ل DeFi risk management.\n\nThe health factor formula is:\n\nhealthFactor = (collateralValue * liquidationThreshold) / borrowValue\n\nwhere collateralValue is the total USD value of all deposited collateral, liquidationThreshold is the weighted average threshold across all collateral assets, و borrowValue is the total USD value of all outstanding borrows. When the health factor drops below 1.0, the position becomes eligible ل liquidation.\n\nThe liquidation threshold is distinct from the loan-to-value (LTV) ratio. LTV determines the maximum amount you can borrow — ل example, 75% LTV on SOL means you can borrow up to 75% of your SOL collateral value. The liquidation threshold is higher — say 80% — providing a buffer zone. You can borrow at 75% LTV, و you are only liquidated when your effective ratio exceeds 80%. This 5% gap gives borrowers time to add collateral or repay debt before liquidation.\n\nWhen a user has multiple collateral assets, the effective liquidation threshold is a weighted average. If you deposit $1,000 of SOL (threshold 0.80) و $500 of ETH (threshold 0.75), the weighted threshold is: (1000 * 0.80 + 500 * 0.75) / 1500 = (800 + 375) / 1500 = 0.7833. This weighted threshold is used in the health factor calculation.\n\nHealth factor interpretation: a value of 2.0 means the position can withstand a 50% decline in collateral value (or 50% increase in borrow value) before liquidation. A value of 1.5 provides a 33% buffer. A value of 1.1 is dangerously close — a 9% adverse price move triggers liquidation. Professional risk managers target health factors of 1.5 or above, مع automated alerts below 1.3 و emergency actions below 1.2.\n\nMonitoring dashboards should display: current health factor مع color coding (green above 1.5, yellow 1.2-1.5, red below 1.2), the price change percentage needed to trigger liquidation, estimated liquidation prices ل each collateral asset, و historical health factor over time. On Solana, health factor data can be derived by reading obligation حسابات و combining مع oracle price feeds from Pyth or Switchboard.\n\nLiquidation preview calculations help users understand their worst-case exposure. The maximum additional borrow is: max(0, collateralValue * effectiveThreshold - currentBorrow). The liquidation shortfall (when health factor < 1.0) is: currentBorrow - collateralValue * effectiveThreshold. This shortfall represents how much additional collateral or debt repayment is needed to restore the position to safety.\n\nPrice scenario analysis extends monitoring to \"what-if\" questions. What happens to the health factor if SOL drops 20%? If both SOL و ETH drop 30%? If interest accrues ل another month? By computing health factors across a range of price scenarios, borrowers can proactively manage risk before adverse conditions materialize. This scenario-based approach forms the foundation of the risk report challenge later in this دورة.\n\n## Checklist\n- Calculate health factor using weighted liquidation thresholds\n- Distinguish between LTV (borrowing limit) و liquidation threshold\n- Compute maximum additional borrow و liquidation shortfall\n- Set up monitoring مع color-coded health factor alerts\n- Run price scenario analysis before major market events\n\n## Red flags\n- Health factor below 1.2 without active monitoring\n- No alerts configured ل health factor changes\n- Ignoring weighted threshold calculations ل multi-asset positions\n- Failing to حساب ل accruing interest in health factor projections\n",
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
                    "note": "Healthy position مع 50% buffer before liquidation"
                  },
                  {
                    "cmd": "SOL drops to $15 ...",
                    "output": "HF = (1500 * 0.80) / 1000 = 1.2000 [WARNING]",
                    "note": "Only 20% buffer remaining — consider adding collateral"
                  },
                  {
                    "cmd": "SOL drops to $12 ...",
                    "output": "HF = (1200 * 0.80) / 1000 = 0.9600 [LIQUIDATABLE]",
                    "note": "Health factor below 1.0 — position is eligible ل liquidation"
                  }
                ]
              }
            ]
          },
          "lending-v2-interest-rates": {
            "title": "Challenge: Compute utilization-based interest rates",
            "content": "# Challenge: Compute utilization-based interest rates\n\nImplement the kink-based interest rate model used by lending protocols:\n\n- Calculate the utilization ratio from total supply و total borrowed\n- Apply the piecewise-linear kink model مع baseRate, slope1, slope2, و kink\n- Compute the borrow rate using the appropriate formula ل below-kink و above-kink regions\n- Derive the supply rate from borrow rate, utilization, و reserve factor\n- Handle edge cases: zero supply, zero borrows, utilization at exactly the kink\n- Return all values formatted to 6 decimal places\n\nYour implementation must be deterministic — same input always produces same output.",
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
        "description": "Health-factor computation, liquidation mechanics, oracle failure handling, و multi-scenario risk reporting ل stressed markets.",
        "lessons": {
          "lending-v2-health-factor": {
            "title": "Challenge: Compute health factor و liquidation status",
            "content": "# Challenge: Compute health factor و liquidation status\n\nImplement the health factor computation ل a multi-asset lending position:\n\n- Sum collateral و borrow values from an array of position objects\n- Compute weighted average liquidation threshold across all collateral assets\n- Calculate the health factor using the standard formula\n- Determine liquidation eligibility (health factor below 1.0)\n- Calculate maximum additional borrow capacity و liquidation shortfall\n- Handle edge cases: no borrows (max health factor), no collateral, single asset\n\nReturn all USD values to 2 decimal places و health factor to 4 decimal places.",
            "duration": "50 min",
            "hints": [
              "Collateral value = sum of (amount * priceUsd) ل all collateral positions.",
              "Effective threshold = weighted average of liquidationThreshold by collateral value.",
              "Health factor = (collateralValue * effectiveThreshold) / borrowValue.",
              "Max additional borrow = max(0, collateralValue * threshold - currentBorrow)."
            ]
          },
          "lending-v2-liquidation-mechanics": {
            "title": "Liquidation mechanics: bonus, close factor, و bad debt",
            "content": "# Liquidation mechanics: bonus, close factor, و bad debt\n\nLiquidation is the enforcement mechanism that keeps lending protocols solvent. When a borrower's health factor falls below 1.0, external actors called liquidators can repay a portion of the debt in exchange ل the borrower's collateral at a discount. Understanding liquidation mechanics — the incentive structure, limits, و failure modes — is essential ل anyone building on or using lending protocols.\n\nThe liquidation bonus (also called the liquidation incentive or discount) is the premium liquidators receive ل performing liquidations. If the liquidation bonus is 5%, a liquidator who repays $100 of debt receives $105 worth of collateral. This bonus serves two purposes: it compensates liquidators ل gas costs و execution risk, و it creates competitive pressure to liquidate positions quickly before other liquidators claim the opportunity. On Solana, where معاملة costs are low, liquidation bonuses tend to be smaller (3-8%) compared to Ethereum (5-15%).\n\nThe close factor limits how much of a position can be liquidated in a single معاملة. A close factor of 50% means a liquidator can repay at most 50% of the outstanding debt in one liquidation call. This prevents a single liquidator from seizing all collateral in one معاملة, giving the borrower a chance to respond. It also distributes liquidation opportunities across multiple liquidators, improving the health of the liquidation market. Some protocols use dynamic close factors — smaller percentages ل mildly underwater positions, larger percentages (up to 100%) ل deeply underwater positions.\n\nThe liquidation process on Solana follows these steps: (1) a liquidator identifies a position مع health factor below 1.0 by scanning obligation حسابات, (2) the liquidator calls the liquidation تعليمة specifying which debt to repay و which collateral to seize, (3) the protocol verifies the position is indeed liquidatable, (4) the debt tokens are transferred from the liquidator to the pool, reducing the borrower's debt, (5) the corresponding collateral (plus bonus) is transferred from the borrower's obligation to the liquidator. The entire process is atomic — it either completes fully or reverts.\n\nBad debt occurs when a position's collateral value (including the liquidation bonus) is insufficient to cover the outstanding debt. This happens during extreme market crashes where prices move faster than liquidators can act, or when the collateral asset experiences a sudden loss of liquidity. When bad debt materializes, the protocol must absorb the loss. Common approaches include: drawing from the reserve fund (accumulated from reserve factors), socializing the loss across all suppliers in the pool (reducing the share price), or using a protocol insurance fund or backstop mechanism.\n\nCascading liquidations are a systemic risk. When many positions use the same collateral (e.g., SOL), a price drop triggers liquidations. Liquidators selling the seized collateral on DEXes further depresses the price, triggering more liquidations. This cascade can drain pool liquidity rapidly. Protocols mitigate this through: conservative LTV ratios, higher liquidation thresholds ل volatile assets, liquidation rate limits (maximum liquidation volume per time window), و integration مع deep liquidity sources.\n\nSolana-specific considerations: liquidation bots on Solana benefit from low latency و low معاملة costs. However, they must compete ل معاملة ordering during volatile periods. MEV (Maximal Extractable Value) on Solana through Jito tips allows liquidators to prioritize their معاملات. Protocols must also handle Solana's نموذج الحسابات — each obligation حساب must be refreshed مع current oracle prices before liquidation can proceed, adding تعليمات و compute units to the liquidation معاملة.\n\n## Checklist\n- Understand the liquidation bonus incentive structure\n- Know how close factor limits single-معاملة liquidation\n- Track the flow of funds during a liquidation event\n- Identify bad debt scenarios و protocol mitigation strategies\n- Consider cascading liquidation risks in portfolio construction\n\n## Red flags\n- Liquidation bonus too low (liquidators are not incentivized to act quickly)\n- Close factor at 100% (full liquidation in one shot, no borrower recourse)\n- No reserve fund or insurance mechanism ل bad debt\n- Ignoring cascading liquidation risks in concentrated collateral pools\n",
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
                      "It rewards borrowers ل maintaining healthy positions",
                      "It increases the interest rate ل all borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "The liquidation bonus compensates liquidators ل gas costs و risk, ensuring positions are liquidated promptly to protect the protocol."
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
                    "explanation": "Bad debt materializes when rapid price drops make collateral worth less than the debt, leaving the protocol مع unrecoverable losses."
                  }
                ]
              }
            ]
          },
          "lending-v2-oracle-risk": {
            "title": "Oracle risk و stale pricing in lending",
            "content": "# Oracle risk و stale pricing in lending\n\nLending protocols depend entirely on accurate, timely price feeds to compute collateral values, health factors, و liquidation eligibility. Oracles — the services that bring off-chain price data on-chain — are the single most critical external dependency. Oracle failures or manipulation can lead to catastrophic losses: incorrect liquidations of healthy positions, failure to liquidate underwater positions, or exploits that drain protocol reserves.\n\nOn Solana, the two dominant oracle providers are Pyth Network و Switchboard. Pyth provides high-frequency price feeds sourced directly from market makers, exchanges, و trading firms. Pyth publishes price, confidence interval, و exponential moving average (EMA) price ل each asset. Switchboard is a more general-purpose oracle network that supports custom data feeds و verification mechanisms. Most Solana lending protocols integrate both و use the more conservative price (lower ل collateral, higher ل borrows).\n\nStale prices are the most common oracle risk. A price is \"stale\" when it has not been updated within a protocol-defined freshness window — typically 30-120 seconds on Solana. Staleness occurs when: oracle publishers experience downtime, network congestion delays update معاملات, or the asset's market enters a period of extreme volatility where publishers disagree on the price. Lending protocols must reject stale prices و either pause operations or use fallback pricing. Accepting a stale price during a market crash can mean using a price from minutes ago that is significantly higher than reality — blocking necessary liquidations و enabling under-collateralized borrowing.\n\nConfidence intervals quantify price uncertainty. Pyth provides a confidence band around each price — ل example, SOL at $25.00 +/- $0.15. A narrow confidence interval indicates strong publisher agreement. A wide confidence interval signals disagreement, low liquidity, or unusual market conditions. Risk-aware protocols use confidence-adjusted prices: ل collateral valuation, use (price - confidence) to be conservative; ل borrow valuation, use (price + confidence) to حساب ل upside risk. This approach prevents protocols from accepting inflated collateral values during uncertain market conditions.\n\nPrice manipulation attacks target the oracle layer. In a classic oracle manipulation, an attacker temporarily moves the price on a low-liquidity market that the oracle reads from, borrows against the inflated collateral value, و then lets the price revert — leaving the protocol مع under-collateralized debt. Mitigations include: using time-weighted average prices (TWAPs) instead of spot prices, requiring multiple independent sources to agree, capping single-block price changes, و implementing borrow/withdrawal delays during high-volatility periods.\n\nSolana-specific oracle considerations: Pyth on Solana uses a pull-based model where price updates are posted to on-chain حسابات that protocols read. Each Pyth price حساب contains the latest price, confidence, EMA price, publish time, و status (Trading, Halted, Unknown). Protocols should check the status field — a \"Halted\" or \"Unknown\" status indicates the feed is unreliable. The publishTime must be compared against the current slot time to detect staleness. Switchboard حسابات have similar freshness و confidence metadata.\n\nMulti-oracle strategies improve resilience. A protocol might use Pyth as the primary oracle و Switchboard as a fallback. If Pyth's price is stale or has low confidence, the protocol switches to Switchboard. If both are unavailable, the protocol pauses new borrows و liquidations rather than operating on unknown prices. This layered approach prevents single points of failure in the oracle infrastructure.\n\nCircuit breakers add an additional safety layer. If an oracle reports a price change exceeding a threshold (e.g., >20% in one update), the protocol should flag this as potentially suspicious و either verify against a secondary source or temporarily pause operations. Flash crashes و recovery events can produce legitimate large price movements, but the protocol should err on the side of caution.\n\n## Checklist\n- Verify oracle freshness (publishTime within acceptable window)\n- Use confidence intervals ل conservative pricing\n- Implement multi-oracle fallback strategies\n- Check oracle status fields (Trading, Halted, Unknown)\n- Set circuit breakers ل extreme price movements\n\n## Red flags\n- Single oracle dependency مع no fallback\n- No staleness checks on price data\n- Ignoring confidence intervals ل collateral valuation\n- Using spot prices without TWAP or time-weighting\n- No circuit breakers ل extreme price changes\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l7-q1",
                    "prompt": "Why should lending protocols use confidence-adjusted prices ل collateral?",
                    "options": [
                      "To be conservative — using (price - confidence) prevents over-valuing collateral during uncertainty",
                      "Confidence intervals make prices more accurate",
                      "It increases the collateral value ل borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "Using price minus confidence ل collateral gives a conservative valuation, protecting the protocol when oracle publishers disagree or markets are volatile."
                  },
                  {
                    "id": "lending-v2-l7-q2",
                    "prompt": "What should a protocol do when all oracle feeds are stale?",
                    "options": [
                      "Pause new borrows و liquidations until fresh prices are available",
                      "Use the last known price regardless of age",
                      "Estimate the price from on-chain DEX data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Operating on stale prices is dangerous. Pausing operations prevents incorrect liquidations و under-collateralized borrows during oracle outages."
                  }
                ]
              }
            ]
          },
          "lending-v2-risk-report": {
            "title": "Checkpoint: Generate a multi-scenario risk report",
            "content": "# Checkpoint: Generate a multi-scenario risk report\n\nBuild the final risk report that combines all دورة concepts:\n\n- Evaluate a base case using current position prices\n- Apply price overrides from multiple named scenarios (bull, crash, etc.)\n- Compute collateral value, borrow value, و health factor per scenario\n- Identify which scenarios trigger liquidation (health factor < 1.0)\n- Track the worst health factor across all scenarios\n- Count total liquidation scenarios\n- Output must be stable JSON مع deterministic key ordering\n\nThis checkpoint validates your complete understanding of lending risk analysis.",
            "duration": "55 min",
            "hints": [
              "Create a reusable evalScenario function that takes price overrides و computes health factor.",
              "ل the base case, use the original position prices (empty overrides).",
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
    "description": "Master perps risk engineering on Solana: precise PnL/funding accounting, margin safety monitoring, liquidation simulation, و deterministic console reporting.",
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
        "description": "Perpetual futures mechanics, funding accrual logic, و PnL modeling foundations ل accurate position diagnostics.",
        "lessons": {
          "perps-v2-mental-model": {
            "title": "Perpetual futures: base positions, entry price, و mark vs oracle",
            "content": "# Perpetual futures: base positions, entry price, و mark vs oracle\n\nPerpetual futures (perps) are synthetic derivatives that let traders gain exposure to an asset's price movement without holding the underlying token. Unlike traditional futures مع expiry dates, perpetual contracts never settle. Instead, a funding rate mechanism keeps the contract price anchored to the spot price over time. Understanding how positions are represented, how entry prices work, و the distinction between mark و oracle prices is the foundation of every risk calculation that follows.\n\n## Position anatomy\n\nA perpetual futures position is defined by four core fields: side (long or short), size (the quantity of the base asset), entry price (the average cost basis), و margin (the collateral deposited). When you open a long position of 10 SOL-PERP at $22.50 مع $225 margin, you are expressing a bet that SOL's price will rise. The notional value of this position is size multiplied by the current mark price. Notional value changes continuously as the mark price moves, even though your entry price remains fixed until you modify the position.\n\nEntry price is not simply the price at the moment you clicked \"buy.\" If you add to an existing position, the entry price updates to the weighted average of the old و new fills. ل example, if you hold 5 SOL-PERP at $20 و buy 5 more at $25, your new entry price becomes (5 * 20 + 5 * 25) / 10 = $22.50. Partial closes do not change the entry price — only additions do. Tracking entry price accurately is critical because every PnL calculation derives from the difference between entry و current price.\n\n## Mark price vs oracle price\n\nOn-chain perpetual protocols maintain two distinct prices: the mark price و the oracle price. The oracle price reflects the broader market's view of the asset's spot value. Solana protocols commonly use Pyth or Switchboard oracle feeds, which aggregate price data from multiple exchanges و publish updates on-chain every 400 milliseconds. The oracle price is the \"truth\" — the real-world value of the underlying asset.\n\nThe mark price is the protocol's internal valuation of the perpetual contract. It is typically derived from the oracle price plus a premium or discount that reflects supply و demand imbalance in the perp market itself. When there are more longs than shorts, the mark price trades above the oracle (positive premium). When shorts dominate, the mark trades below (negative premium). The formula varies by protocol but often follows: markPrice = oraclePrice + exponentialMovingAverage(premium).\n\nMark price is used ل all PnL calculations و liquidation triggers. Using mark price instead of raw trade price prevents manipulation attacks where a single large trade could spike the last-traded price و trigger mass liquidations. The mark price moves more smoothly because it incorporates the oracle as a stability anchor.\n\n## Why this matters ل risk\n\nEvery risk metric in a perps risk console depends on getting these fundamentals right. Unrealized PnL is computed against the mark price. Margin ratio is computed using notional value at mark price. Liquidation price is derived from the entry price و margin. If you confuse mark و oracle, or miscalculate entry price after position averaging, every downstream number is wrong.\n\nOn Solana specifically, oracle latency introduces an additional consideration. Pyth oracle updates propagate مع slot-level granularity (~400ms). During volatile periods, the oracle price can lag behind actual market moves by several hundred milliseconds. Protocols handle this by including confidence intervals in their oracle reads و rejecting prices مع excessively wide confidence bands. When building risk dashboards, always display the oracle confidence alongside the price و flag stale oracles (timestamps older than a few seconds).\n\n## Console التصميم principle\n\nA useful risk console must separate:\n1. directional الاداء (PnL),\n2. structural cost (funding + fees),\n3. survival risk (margin ratio + liquidation distance).\n\nBlending these into one number hides the decision signals traders actually need.\n\n## Checklist\n- Understand that perpetual futures never expire و use funding to track spot\n- Track entry price as a weighted average across all fills\n- Distinguish mark price (PnL, liquidation) from oracle price (funding, reference)\n- Monitor oracle staleness و confidence intervals\n- Compute notional value as size * markPrice\n\n## Red flags\n- Using last-traded price instead of mark price ل PnL\n- Forgetting to update entry price on position additions\n- Ignoring oracle confidence intervals during volatile markets\n- Assuming mark price equals oracle price (the premium matters)\n",
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
                    "prompt": "If you hold 8 SOL-PERP at $20 و buy 2 more at $30, what is your new entry price?",
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
            "title": "Funding rates: why they exist و how they accrue",
            "content": "# Funding rates: why they exist و how they accrue\n\nFunding rates are the mechanism that tethers a perpetual contract's price to the underlying spot price. Without funding, the perp price could drift arbitrarily far from reality because the contract never expires. Funding creates a periodic cash flow between longs و shorts that incentivizes convergence: when the perp trades above spot, longs pay shorts; when it trades below, shorts pay longs.\n\n## The convergence mechanism\n\nConsider a scenario where heavy demand from leveraged long traders pushes the SOL-PERP mark price to $23 while the SOL oracle price is $22. The premium is $1, or about 4.5%. The funding rate will be positive, meaning long holders pay short holders every funding interval. This payment makes it expensive to hold longs و attractive to hold shorts, which naturally pushes the perp price back toward spot. When the perp trades below spot (negative premium), funding flips: shorts pay longs, discouraging shorts و encouraging longs.\n\nThe funding rate is typically calculated as: fundingRate = clamp(premium / 24, -maxRate, +maxRate), where the premium is the percentage difference between mark و oracle prices, divided by 24 to normalize to an hourly rate. Most protocols on Solana settle funding every hour, though some use shorter intervals (every 8 hours is common on centralized exchanges). The clamp function prevents extreme rates during flash crashes or squeezes.\n\n## How funding accrues\n\nFunding is not a continuous stream — it settles at discrete intervals. At each funding timestamp, the protocol snapshots every open position و calculates: fundingPayment = positionSize * entryPrice * fundingRate. ل a 10 SOL-PERP position at $25 entry مع a funding rate of 0.01% (0.0001), the payment is 10 * 25 * 0.0001 = $0.025 per interval.\n\nThe direction of payment depends on the position side و the sign of the funding rate. When the funding rate is positive: longs pay (their margin decreases) و shorts receive (their margin increases). When negative: shorts pay و longs receive. This is a zero-sum transfer — the total paid by one side exactly equals the total received by the other side, minus any protocol fees.\n\nCumulative funding matters more than any single payment. A position held ل 24 hours accumulates 24 hourly funding payments (or 3 eight-hour payments, depending on the protocol). During trending markets, cumulative funding can become a significant drag on PnL. A long position in a strongly bullish market might show +$100 unrealized PnL but have paid -$15 in cumulative funding, reducing the real return. Risk dashboards must display both unrealized PnL و cumulative funding separately so traders see the full picture.\n\n## Funding on Solana protocols\n\nSolana perps protocols like Drift, Mango Markets, و Jupiter Perps each implement funding slightly differently. Drift uses a time-weighted average premium over 1-hour windows. Jupiter Perps uses a simpler hourly mark-to-oracle premium. Mango uses an oracle-based funding model مع configurable parameters per market. Despite these differences, the core principle is identical: positive premium means longs pay shorts.\n\nOn-chain funding settlement on Solana happens through cranked تعليمات. A keeper bot calls a \"settle funding\" تعليمة at each interval, which iterates through positions و adjusts their realized PnL حسابات. Positions that are not explicitly settled may accumulate pending funding payments that are only applied when the position is next touched (opened, closed, or cranked). This lazy evaluation means your displayed margin may not reflect unsettled funding until you interact مع the position.\n\n## Impact on risk monitoring\n\nل risk console purposes, you must track: (1) the current funding rate و whether your position is paying or receiving, (2) cumulative funding paid or received since position open, (3) the net margin impact as a percentage of initial margin, و (4) projected funding cost if the current rate persists. A position that looks profitable on a PnL basis might be marginally unprofitable after accounting ل funding drag. Always include funding in your total return calculations.\n\n## Checklist\n- Understand that positive funding rate means longs pay shorts\n- Calculate funding payment as size * price * rate per interval\n- Track cumulative funding over the position's lifetime\n- حساب ل funding when computing real return (PnL + funding)\n- Monitor ل extreme funding rates that signal market imbalance\n\n## Red flags\n- Ignoring funding costs in PnL reporting\n- Confusing funding direction (positive rate = longs pay)\n- Not accounting ل lazy settlement on Solana protocols\n- Assuming funding is continuous rather than discrete-interval\n",
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
                      "Shorts pay longs — shorts are rewarded ل being correct",
                      "Both sides pay the protocol a fee"
                    ],
                    "answerIndex": 0,
                    "explanation": "A positive premium (mark > oracle) produces a positive funding rate. Longs pay shorts, which discourages excessive long demand و pushes the perp price back toward spot."
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
            "content": "# PnL visualization: tracking profit over time\n\nProfit و loss (PnL) tracking in perpetual futures requires careful accounting across multiple dimensions: unrealized PnL from price movement, realized PnL from closed portions, funding payments, و trading fees. A well-built PnL visualization shows traders not just where they stand now, but how they arrived there — which is essential ل risk management و strategy refinement.\n\n## Unrealized vs realized PnL\n\nUnrealized PnL represents the paper profit or loss on your open position. ل a long position: unrealizedPnL = size * (markPrice - entryPrice). ل a short: unrealizedPnL = size * (entryPrice - markPrice). This number changes مع every price tick و represents what you would gain or lose if you closed the position right now at the mark price.\n\nRealized PnL is locked in when you close all or part of a position. If you opened 10 SOL-PERP long at $20 و close 5 contracts at $25, you realize 5 * (25 - 20) = $25 profit. The remaining 5 contracts continue to have unrealized PnL based on the current mark price versus your (unchanged) entry of $20. Realized PnL is permanent — it has already been credited to your margin حساب. Unrealized PnL fluctuates و may increase or decrease.\n\nTotal PnL = realized + unrealized + cumulative funding. This is the true measure of position الاداء. Displaying all three components separately gives traders insight into whether their profits come from directional moves (unrealized), successful trades (realized), or favorable funding conditions.\n\n## Return on equity (ROE)\n\nROE measures the percentage return relative to the initial margin deposited. ROE = (unrealizedPnL / initialMargin) * 100. A position مع $25 unrealized PnL on $225 margin has an ROE of 11.11%. Because perpetual futures are leveraged instruments, ROE can be dramatically higher (or lower) than the percentage price change. مع 10x leverage, a 5% price move produces approximately 50% ROE.\n\nROE is the primary الاداء metric ل comparing positions across different sizes و leverage levels. A $10 profit on $100 margin (10% ROE) represents better capital efficiency than $10 profit on $1000 margin (1% ROE), even though the dollar PnL is identical. Risk consoles should display ROE prominently alongside raw PnL.\n\n## Time-series visualization\n\nPlotting PnL over time reveals patterns invisible in a single snapshot. Key elements of a PnL time series: (1) The unrealized PnL curve, moving مع each mark price update. (2) Step changes when partial closes realize PnL. (3) Small periodic steps from funding payments. (4) The cumulative total line combining all components.\n\nل Solana protocols, PnL snapshots can be captured at each slot (~400ms) or aggregated into minute/hour candles ل longer timeframes. Real-time WebSocket feeds from RPC nodes provide mark price updates, و funding payments appear as on-chain events at each settlement interval. A production risk console typically polls mark prices every 1-5 seconds و updates the PnL display accordingly.\n\n## Break-even analysis\n\nThe break-even price حسابات ل all costs: trading fees, funding payments, و slippage. ل a long position: breakEvenPrice = entryPrice + (totalFees + cumulativeFundingPaid) / size. If you entered at $22.50 مع $0.50 in total costs on a 10-unit position, your break-even is $22.55. Displaying the break-even line on the PnL chart gives traders a clear target — the position is only truly profitable when the mark price exceeds this line.\n\n## Visualization افضل الممارسات\n\nEffective PnL dashboards use color coding consistently: green ل positive PnL, red ل negative. The zero line should be visually prominent. Hover tooltips should show the exact PnL at any point in time. Consider showing both absolute dollar PnL و percentage ROE on dual axes. Include funding annotations as small markers on the time axis so traders can see when funding events impacted their PnL curve.\n\n## Checklist\n- Separate unrealized, realized, و funding components in the display\n- Calculate ROE relative to initial margin, not current margin\n- Include break-even price accounting ل all costs\n- Update PnL in near-real-time using mark price feeds\n- Annotate funding events on the PnL time series\n\n## Red flags\n- Showing only unrealized PnL without funding impact\n- Computing ROE against notional value instead of margin\n- Not distinguishing realized from unrealized PnL\n- Updating PnL using oracle price instead of mark price\n",
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
            "content": "# Challenge: Calculate perpetual futures PnL\n\nImplement a PnL calculator ل perpetual futures positions:\n\n- Compute unrealized PnL based on entry price vs mark price\n- Handle both long و short positions correctly\n- Calculate notional value as size * markPrice\n- Compute ROE (return on equity) as a percentage of initial margin\n- Format all outputs مع appropriate decimal precision\n\nYour calculator must be deterministic — same input always produces the same output.",
            "duration": "50 min",
            "hints": [
              "Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice).",
              "Notional value = size * markPrice — represents the total position value.",
              "ROE (return on equity) = unrealizedPnL / margin * 100.",
              "Use toFixed(2) ل prices و PnL, toFixed(4) ل size و ROE."
            ]
          },
          "perps-v2-funding-accrual": {
            "title": "Challenge: Simulate funding rate accrual",
            "content": "# Challenge: Simulate funding rate accrual\n\nBuild a funding accrual simulator that processes discrete funding intervals:\n\n- Iterate through an array of funding rates و compute the payment ل each period\n- Longs pay (subtract from balance) when the funding rate is positive\n- Shorts receive (add to balance) when the funding rate is positive\n- Track cumulative funding, average rate, و net margin impact\n- Handle negative funding rates where the direction reverses\n\nThe simulator must be deterministic — same inputs always produce the same result.",
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
        "description": "Margin و liquidation monitoring, implementation bug traps, و deterministic risk-console outputs ل production observability.",
        "lessons": {
          "perps-v2-margin-liquidation": {
            "title": "Margin ratio و liquidation thresholds",
            "content": "# Margin ratio و liquidation thresholds\n\nMargin is the collateral that backs a leveraged position. When the margin falls below a critical threshold relative to the position's notional value, the protocol forcibly closes the position to prevent the trader from owing more than they deposited. Understanding margin mechanics, the maintenance margin threshold, و how liquidation prices are calculated is essential ل risk monitoring.\n\n## Initial margin و leverage\n\nInitial margin is the collateral deposited when opening a position. The leverage multiple is: leverage = notionalValue / initialMargin. A position مع $250 notional value و $25 margin is 10x leveraged. Higher leverage amplifies both gains و losses. At 10x, a 10% adverse price move wipes out 100% of the margin. At 20x, only a 5% move is needed to reach zero.\n\nSolana perps protocols typically allow leverage up to 20x or even 50x on major pairs (SOL, BTC, ETH) و lower leverage (5x-10x) on altcoins مع thinner liquidity. The maximum leverage is governed by the maintenance margin rate — a lower maintenance margin rate allows higher maximum leverage.\n\n## Maintenance margin\n\nThe maintenance margin rate (MMR) is the minimum margin ratio a position must maintain to avoid liquidation. If the MMR is 5% (0.05), the effective margin must be at least 5% of the notional value at all times. Effective margin حسابات ل unrealized PnL و funding: effectiveMargin = initialMargin + unrealizedPnL + cumulativeFunding. The margin ratio is: marginRatio = effectiveMargin / notionalValue.\n\nWhen the margin ratio drops below the MMR, the position is eligible ل liquidation. Protocols don't wait ل the margin to reach exactly zero — the maintenance buffer ensures there is still some collateral left to cover liquidation fees, slippage, و potential bad debt. If a position's losses exceed its margin entirely, the deficit becomes \"bad debt\" that must be absorbed by an insurance fund or socialized across other traders.\n\n## Liquidation price calculation\n\nThe liquidation price is the mark price at which the margin ratio exactly equals the maintenance margin rate. ل a long position: liquidationPrice = entryPrice - (margin + cumulativeFunding - notional * MMR) / size. ل a short: liquidationPrice = entryPrice + (margin + cumulativeFunding - notional * MMR) / size.\n\nThis formula حسابات ل the fact that as the mark price moves against you, both the unrealized PnL (reducing effective margin) و the notional value (the denominator of margin ratio) change simultaneously. The liquidation price is not simply \"entry price minus margin per unit\" — the maintenance margin requirement means liquidation triggers before your margin is fully depleted.\n\nل example, consider a 10 SOL-PERP long at $22.50 مع $225 margin و 5% MMR. The notional at entry is 10 * 22.50 = $225. Liquidation triggers when effectiveMargin / notional = 0.05, which solves to a mark price near $2.05 in this well-margined case. مع higher leverage (less margin), the liquidation price would be much closer to entry.\n\n## Cascading liquidations\n\nDuring sharp market moves, many positions hit their liquidation prices simultaneously. Liquidation engines close these positions by selling into the order book (or AMM pools), which pushes the price further in the adverse direction, triggering more liquidations. This cascade effect — also called a \"liquidation spiral\" — can cause prices to move far beyond what fundamentals justify.\n\nOn Solana, liquidation is performed by keeper bots that submit liquidation معاملات. These bots compete ل liquidation opportunities because protocols offer a liquidation fee (typically 0.5-2% of the position's notional) as an incentive. During cascades, keeper bots may face congestion issues as many liquidation معاملات compete ل block space. Partial liquidation — closing only enough of a position to restore the margin ratio above MMR — helps reduce cascade severity by keeping some of the position alive.\n\n## Risk monitoring thresholds\n\nA production risk console should alert at multiple thresholds: (1) WARNING when the margin ratio drops below 1.5x the MMR (e.g., 7.5% when MMR is 5%), (2) CRITICAL when below the MMR itself (liquidation imminent), و (3) INFO when unrealized PnL exceeds a significant percentage of margin (positive or negative). These alerts give traders time to add margin, reduce position size, or close entirely before forced liquidation.\n\n## Checklist\n- Calculate effective margin including unrealized PnL و funding\n- Compute margin ratio as effectiveMargin / notionalValue\n- Derive liquidation price from entry price, margin, و MMR\n- Set warning thresholds above the MMR to give early alerts\n- حساب ل liquidation fees in worst-case scenarios\n\n## Red flags\n- Computing liquidation price without accounting ل the maintenance buffer\n- Ignoring funding in effective margin calculations\n- Not alerting traders before they reach the liquidation threshold\n- Assuming the mark price at liquidation equals the execution price (slippage exists)\n",
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
                      "To ensure remaining collateral covers liquidation fees و slippage, preventing bad debt",
                      "To make it harder ل traders to open positions",
                      "To generate more revenue ل the protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "The maintenance buffer ensures that when a position is liquidated, there is still margin left to pay liquidation fees و absorb slippage during the close. Without it, positions could go underwater, creating bad debt."
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
            "title": "Common bugs: sign errors, units, و funding direction",
            "content": "# Common bugs: sign errors, units, و funding direction\n\nPerpetual futures implementations are mathematically straightforward — the formulas are basic arithmetic. Yet sign errors, unit mismatches, و funding direction bugs are among the most frequent و costly mistakes in DeFi development. A single flipped sign can turn profits into losses, liquidate healthy positions, or drain insurance funds. This درس catalogs the most common pitfalls و how to avoid them.\n\n## Sign errors in PnL calculations\n\nThe most fundamental bug: getting the sign wrong on PnL ل short positions. Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice). Note that short PnL is NOT size * (markPrice - entryPrice) مع a negated size. The size is always positive — it represents the quantity of contracts. The direction is captured in the formula itself. A common mistake is storing size as negative ل shorts و using a single formula: pnl = size * (markPrice - entryPrice). While mathematically equivalent when size is negative, this representation causes bugs everywhere else: notional value calculations, funding payments, margin ratios, و liquidation prices all need absolute size.\n\nRule: Keep size always positive. Branch on the side field to select the correct formula. Never rely on sign conventions embedded in other fields.\n\n## Unit و decimal mismatches\n\nSolana token amounts are raw integers (lamports, token base units). Prices from oracles are typically fixed-point numbers مع specific exponents. Mixing these without proper conversion produces catastrophically wrong values.\n\nExample: SOL has 9 decimals on-chain. If a position size is stored as 10_000_000_000 (10 SOL in lamports) و you multiply by a price of 22.50 (a floating-point dollar value), you get 225,000,000,000 — which might look like a notional value, but it is in lamports-times-dollars, a nonsensical unit. You must either convert size to human-readable units first (divide by 10^9), or keep everything in integer space مع a consistent exponent.\n\nRule: Define a canonical unit convention at the start of your project. Either work entirely in human-readable floats (acceptable ل display/simulation code) or entirely in integer base units مع explicit scaling factors (required ل on-chain code). Never mix the two.\n\n## Funding direction confusion\n\nThe funding direction rule is: \"positive funding rate means longs pay shorts.\" This is universal across all major protocols. Yet developers frequently implement it backwards, especially when reasoning about \"who benefits.\" When the rate is positive, the market is bullish (more longs than shorts). Longs pay to discourage the imbalance. Shorts receive as compensation ل providing the other side.\n\nIn code, the mistake looks like this:\n- WRONG: if (side === \"long\") totalFunding += payment;\n- RIGHT: if (side === \"long\") totalFunding -= payment;\n\nWhen the funding rate is positive و the side is long, the payment reduces the trader's balance. When negative و long, the payment increases the balance (longs receive). Test every combination: positive rate + long, positive rate + short, negative rate + long, negative rate + short.\n\n## Liquidation price off-by-one\n\nThe liquidation price formula must حساب ل the maintenance margin requirement. A common bug is computing the price at which margin equals zero rather than the price at which margin equals the maintenance requirement. This results in a liquidation price that is too aggressive — the position would be liquidated later than expected, potentially accumulating bad debt.\n\nAnother variant: forgetting to include cumulative funding in the liquidation price calculation. If a long position has paid $5 in funding, its effective margin is $5 less than the initial deposit, و the liquidation price is correspondingly closer to the entry price.\n\n## Margin ratio denominator\n\nMargin ratio = effectiveMargin / notionalValue. The notional value must use the current mark price, not the entry price. Using entry price ل notional gives an incorrect ratio because the actual exposure changes as the mark price moves. A position مع $225 entry notional that has moved to $250 mark notional has a lower margin ratio than the entry-price calculation suggests — the position has grown while the margin remains fixed.\n\n## Integer overflow in funding accumulation\n\nWhen accumulating funding over hundreds or thousands of periods, floating-point precision errors can compound. Each period adds a small number (e.g., 0.025), و after thousands of additions, the accumulated error can become material. Using fixed-point arithmetic or rounding at each step (مع a consistent rounding convention) prevents drift. In JavaScript, toFixed() at the final output step is sufficient ل display, but متوسط calculations should preserve full precision.\n\n## الاختبار strategy\n\nEvery perps calculation should have test cases covering: (1) Long مع profit, (2) Long مع loss, (3) Short مع profit, (4) Short مع loss, (5) Positive funding rate ل both sides, (6) Negative funding rate ل both sides, (7) Zero funding rate, (8) Zero-margin edge case. If any single combination is missing from your test suite, the corresponding bug can ship undetected.\n\n## Checklist\n- Use separate formulas ل long و short PnL, not sign-encoded size\n- Define و enforce a canonical unit convention (human-readable vs base units)\n- Test all four combinations of funding direction (2 sides x 2 rate signs)\n- Include maintenance margin in liquidation price calculations\n- Use mark price (not entry price) ل notional value in margin ratio\n\n## Red flags\n- Negative position sizes used to encode short direction\n- Mixing lamport-scale و dollar-scale values in the same calculation\n- Funding payment that adds to long balances when the rate is positive\n- Liquidation price computed at zero margin instead of maintenance margin\n- Margin ratio using entry-price notional instead of mark-price notional\n",
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
                      "Negative size creates sign-convention bugs in notional, funding, margin, و liquidation calculations",
                      "Solana حسابات cannot store negative numbers",
                      "Positive numbers use less storage space"
                    ],
                    "answerIndex": 0,
                    "explanation": "When size carries the direction sign, every formula that uses size must حساب ل the sign — not just PnL, but also notional value, funding payments, و liquidation price. Keeping size positive و branching on a separate 'side' field is safer و more explicit."
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
            "content": "# Checkpoint: Generate a Risk Console Report\n\nBuild the comprehensive risk console report that integrates all دورة concepts:\n\n- Calculate unrealized PnL و ROE ل the position\n- Accumulate funding payments across all provided funding rate intervals\n- Compute effective margin (initial + PnL + funding) و margin ratio\n- Derive the liquidation price accounting ل maintenance margin و funding\n- Generate severity-tiered alerts (CRITICAL, WARNING, INFO) based on thresholds\n- Output must be stable JSON مع deterministic structure\n\nThis checkpoint validates your complete understanding of perpetual futures risk management.",
            "duration": "55 min",
            "hints": [
              "Effective margin = initial margin + unrealized PnL + funding payments.",
              "Margin ratio = effectiveMargin / notionalValue.",
              "Liquidation price ل longs: entryPrice - (margin + funding - notional*mmRate) / size.",
              "Generate alerts based on margin ratio vs maintenance margin rate thresholds.",
              "Sort alerts by severity: CRITICAL > WARNING > INFO."
            ]
          }
        }
      }
    }
  },
  "defi-tx-optimizer": {
    "title": "DeFi معاملة Optimizer",
    "description": "Master Solana DeFi معاملة optimization: compute/fee tuning, ALT strategy, reliability patterns, و deterministic send-strategy planning.",
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
        "title": "معاملة Fundamentals",
        "description": "معاملة failure diagnosis, compute budget mechanics, priority-fee strategy, و fee estimation foundations.",
        "lessons": {
          "txopt-v2-why-fail": {
            "title": "Why DeFi معاملات fail: CU limits, size, و blockhash expiry",
            "content": "# Why DeFi معاملات fail: CU limits, size, و blockhash expiry\n\nDeFi معاملات on Solana fail ل three primary reasons: compute budget exhaustion, معاملة size overflow, و blockhash expiry. Understanding each failure mode is essential before attempting any optimization, because the fix ل each is fundamentally different. Misdiagnosing the failure category leads to wasted effort و frustrated users.\n\n## Compute budget exhaustion\n\nEvery Solana معاملة executes within a compute budget measured in compute units (CUs). The default budget is 200,000 CUs per معاملة, which is sufficient ل simple transfers but far too low ل complex DeFi operations. A single AMM swap through a concentrated liquidity pool can consume 100,000-200,000 CUs. Multi-hop routes, flash loans, or معاملات that interact مع multiple protocols easily exceed 400,000 CUs. When a معاملة exceeds its compute budget, the runtime aborts execution و returns a `ComputeBudgetExceeded` error. The معاملة fee is still charged because the مدقق performed work before the limit was hit.\n\nThe solution is the `SetComputeUnitLimit` تعليمة from the Compute Budget Program. This تعليمة must be the first تعليمة in the معاملة (by convention) و tells the runtime exactly how many CUs to allocate. Setting the limit too low causes failures; setting it too high wastes priority fee budget because priority fees are calculated per CU requested (not consumed). The optimal approach is to simulate the معاملة first, observe the actual CU consumption, add a 10% safety margin, و use that as the limit.\n\n## معاملة size limits\n\nSolana معاملات have a hard size limit of 1,232 bytes when serialized. This limit applies to the entire معاملة packet including signatures, message header, حساب keys, recent blockhash, و تعليمة data. Each حساب key consumes 32 bytes. A معاملة referencing 30 unique حسابات uses 960 bytes ل حساب keys alone, leaving very little room ل تعليمة data و signatures.\n\nDeFi معاملات are particularly حساب-heavy. A single Raydium CLMM swap requires the user محفظة, input token حساب, output token حساب, pool state, AMM config, observation state, token vaults (x2), tick arrays (up to 3), oracle, و program IDs. Chaining multiple swaps in a single معاملة can easily push the حساب count past 40, which exceeds the 1,232-byte limit مع standard حساب encoding. This is where Address Lookup Tables (ALTs) become essential, compressing each حساب reference from 32 bytes to just 1 byte ل حسابات stored in the lookup table.\n\n## Blockhash expiry\n\nEvery Solana معاملة includes a recent blockhash that serves as a replay protection mechanism و a timestamp. A blockhash is valid ل approximately 60 seconds (roughly 150 slots at 400ms per slot). If a معاملة is not included in a block before the blockhash expires, it becomes permanently invalid و can never be processed. The معاملة simply disappears without any on-chain error record.\n\nBlockhash expiry is the most insidious failure mode because it produces no error message. The معاملة is silently dropped. This happens frequently during network congestion when معاملات queue ل longer than expected, or when users take too long to review و approve a معاملة in their محفظة. The correct handling is to monitor ل confirmation مع a timeout, و if the معاملة is not confirmed within 30 seconds, fetch a new blockhash, rebuild و re-sign the معاملة, و resubmit.\n\n## Interaction between failure modes\n\nThese three failure modes often interact. A developer might add more تعليمات to avoid multiple معاملات (reducing blockhash expiry risk), but this increases both CU consumption و معاملة size. Optimizing ل one dimension can worsen another. The art of معاملة optimization is finding the right balance: enough CU budget to complete execution, compact enough to fit in 1,232 bytes, و fast enough submission to land before the blockhash expires.\n\n## Production triage rule\n\nDiagnose معاملة failures in strict order:\n1. did it fit و simulate,\n2. did it propagate و include,\n3. did it confirm before expiry.\n\nThis sequence prevents noisy fixes و reduces false assumptions during incidents.\n\n## Diagnostic checklist\n- Check معاملة logs ل `ComputeBudgetExceeded` when CU is the issue\n- Check serialized معاملة size against the 1,232-byte limit\n- Monitor confirmation status to detect silent blockhash expiry\n- Simulate معاملات before sending to catch CU و حساب issues early\n- Track failure rates by category to identify systemic problems\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l1-q1",
                    "prompt": "What is the default compute unit budget ل a Solana معاملة?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "50,000 CUs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana allocates 200,000 CUs by default. DeFi معاملات almost always need more, requiring an explicit SetComputeUnitLimit تعليمة."
                  },
                  {
                    "id": "txopt-v2-l1-q2",
                    "prompt": "What happens when a معاملة's blockhash expires before it is confirmed?",
                    "options": [
                      "The معاملة is silently dropped مع no on-chain error",
                      "The معاملة fails مع a BlockhashExpired error on-chain",
                      "The مدقق retries مع a fresh blockhash automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired blockhash معاملات are never processed و produce no on-chain record. The client must detect the timeout و resubmit مع a fresh blockhash."
                  }
                ]
              }
            ]
          },
          "txopt-v2-compute-budget": {
            "title": "Compute budget تعليمات و priority fee strategy",
            "content": "# Compute budget تعليمات و priority fee strategy\n\nThe Compute Budget Program provides two critical تعليمات that every serious DeFi معاملة should include: `SetComputeUnitLimit` و `SetComputeUnitPrice`. Together, they control how much computation your معاملة can perform و how much you are willing to pay ل priority inclusion in a block.\n\n## SetComputeUnitLimit\n\nThis تعليمة sets the maximum number of compute units the معاملة can consume. The value must be between 1 و 1,400,000 (the per-معاملة maximum on Solana). The تعليمة takes a single u32 parameter representing the CU limit. When omitted, the runtime uses the default of 200,000 CUs.\n\nChoosing the right limit requires profiling. Use `simulateTransaction` on an RPC node to execute the معاملة without landing it on-chain. The simulation response includes `unitsConsumed`, which tells you exactly how many CUs the معاملة used. Add a 10% safety margin to this value: `Math.ceil(unitsConsumed * 1.1)`. This margin حسابات ل minor variations in CU consumption between simulation و actual execution (e.g., different slot, slightly different حساب state).\n\nSetting the limit exactly to the simulated value is risky because CU consumption can vary slightly between simulation و execution. Setting it 2x or 3x higher is wasteful because your priority fee is calculated against the requested limit, not the consumed amount. The 10% margin provides a good balance between safety و cost efficiency.\n\n## SetComputeUnitPrice\n\nThis تعليمة sets the priority fee in micro-lamports per compute unit. A micro-lamport is one millionth of a lamport (1 lamport = 0.000000001 SOL). The priority fee is calculated as: `priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1,000,000)` lamports.\n\nل example, مع a CU limit of 200,000 و a CU price of 5,000 micro-lamports: `ceil(200,000 * 5,000 / 1,000,000) = ceil(1,000) = 1,000 lamports`. This is added on top of the base fee of 5,000 lamports per signature (typically one signature ل user معاملات).\n\n## Priority fee market dynamics\n\nSolana مدققون order معاملات within a block by priority fee (micro-lamports per CU). During low-congestion periods, even a CU price of 1 micro-lamport is sufficient. During high-demand events (popular NFT mints, volatile market moments, new token launches), competitive CU prices can reach 100,000+ micro-lamports.\n\nThe priority fee market is highly dynamic. Strategies ل choosing the right price include: (1) Static pricing: set a fixed CU price based on the expected congestion level. Simple but often suboptimal. (2) Recent-fee sampling: query `getRecentPrioritizationFees` from the RPC to see what fees landed in recent blocks. Use the median or 75th percentile as your price. (3) Percentile targeting: decide what probability of inclusion you want (e.g., 90% chance of landing in the next block) و price accordingly.\n\n## Fee calculation formula\n\nThe total معاملة fee follows this formula:\n\n```\nbaseFee = 5000 lamports (per signature)\npriorityFee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) lamports\ntotalFee = baseFee + priorityFee\n```\n\nWhen building a معاملة planner, these calculations must use integer arithmetic to match on-chain behavior. Floating-point rounding differences can cause fee estimate mismatches that confuse users.\n\n## تعليمة ordering\n\nCompute budget تعليمات must appear before any other تعليمات in the معاملة. The runtime processes them during معاملة validation, before executing program تعليمات. Placing them after other تعليمات is technically allowed but violates convention و may cause issues مع some tools و محافظ.\n\n## عملي recommendations\n- Always include both SetComputeUnitLimit و SetComputeUnitPrice\n- Simulate first, then set CU limit to ceil(consumed * 1.1)\n- Sample recent fees و use the 75th percentile ل reliable inclusion\n- Display the total fee estimate to users before they sign\n- Cap the CU limit at 1,400,000 (Solana maximum per معاملة)\n",
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
                      "CU consumption can vary slightly between simulation و execution due to state changes",
                      "The runtime does not accept exact values",
                      "Simulation always underreports CU usage by 50%"
                    ],
                    "answerIndex": 0,
                    "explanation": "حساب state may change between simulation و execution, causing minor CU variations. A 10% margin absorbs these differences."
                  }
                ]
              }
            ]
          },
          "txopt-v2-cost-explorer": {
            "title": "معاملة cost estimation و fee planning",
            "content": "# معاملة cost estimation و fee planning\n\nAccurate fee estimation is the foundation of a good DeFi user experience. Users need to know what a معاملة will cost before they sign it. مدققون need sufficient fees to prioritize your معاملة. Getting fee estimation right means understanding the components, profiling real معاملات, و adapting to market conditions.\n\n## Components of معاملة cost\n\nA Solana معاملة's cost has three components: (1) the base fee, which is 5,000 lamports per signature و is fixed by protocol; (2) the priority fee, which is variable و determined by the compute unit price you set; و (3) the rent cost ل any new حسابات created by the معاملة (e.g., creating an Associated Token حساب costs approximately 2,039,280 lamports in rent-exempt minimum balance).\n\nل DeFi معاملات that do not create new حسابات, the cost is simply base fee plus priority fee. ل معاملات that create ATAs or other حسابات, the rent deposits significantly increase the total cost و should be displayed separately in the UI since rent is recoverable when the حساب is closed.\n\n## CU profiling\n\nProfiling compute unit consumption across different operation types builds an estimation model. Common DeFi operations و their typical CU ranges:\n\n- SOL transfer: 2,000-5,000 CUs\n- SPL token transfer: 4,000-8,000 CUs\n- Create ATA (idempotent): 25,000-35,000 CUs\n- Simple AMM swap (constant product): 60,000-120,000 CUs\n- CLMM swap (concentrated liquidity): 100,000-200,000 CUs\n- Multi-hop route (2 legs): 200,000-400,000 CUs\n- Flash loan + swap: 300,000-600,000 CUs\n\nThese ranges vary based on pool state, tick array crossings in CLMM pools, و program version. Profiling your specific use case مع simulation produces much more accurate estimates than using generic ranges.\n\n## Fee market analysis\n\nThe priority fee market fluctuates based on network demand. During quiet periods (off-peak hours, low volatility), median priority fees hover around 1-100 micro-lamports per CU. During peak events, fees can spike to 10,000-1,000,000+ micro-lamports per CU.\n\nFetching recent fee data from `getRecentPrioritizationFees` returns fee levels from the last 150 slots. Computing percentiles (25th, 50th, 75th, 90th) from this data provides a fee distribution that informs pricing strategy:\n- 25th percentile: economy — may take multiple blocks to land\n- 50th percentile: standard — lands in 1-2 blocks under normal conditions\n- 75th percentile: fast — high probability of next-block inclusion\n- 90th percentile: urgent — nearly guaranteed next-block inclusion\n\n## Fee tiers ل user selection\n\nPresent fee estimates at multiple priority levels so users can choose their urgency. A typical tier structure:\n\n- Low priority: 100 micro-lamports/CU — suitable ل non-urgent operations\n- Medium priority: 1,000 micro-lamports/CU — standard DeFi operations\n- High priority: 10,000 micro-lamports/CU — time-sensitive trades\n\nEach tier produces a different total fee: `baseFee + ceil(cuLimit * tierPrice / 1,000,000)`. Display all three alongside estimated confirmation times to help users make informed decisions.\n\n## Dynamic fee adjustment\n\nProduction systems should adjust fee tiers based on real-time market data rather than using static values. Query recent fees every 10-30 seconds و update the tier prices to reflect current conditions. During congestion spikes, automatically increase the default tier to ensure معاملات land. During quiet periods, reduce fees to save users money.\n\n## Cost display افضل الممارسات\n- Show total fee in both lamports و SOL equivalent\n- Separate base fee, priority fee, و rent deposits\n- Indicate the priority level و expected confirmation time\n- Update fee estimates in real-time as market conditions change\n- Warn users when fees are unusually high compared to recent averages\n",
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
            "title": "Challenge: Build a معاملة plan مع compute budgeting",
            "content": "# Challenge: Build a معاملة plan مع compute budgeting\n\nBuild a معاملة planning function that analyzes a set of تعليمات و produces a complete معاملة plan:\n\n- Sum estimatedCU from all تعليمات و add a 10% safety margin (ceiling)\n- Cap the compute unit limit at 1,400,000 (Solana maximum)\n- Calculate priority fee: ceil(computeUnitLimit * computeUnitPrice / 1,000,000)\n- Calculate total fee: base fee (5,000 lamports) + priority fee\n- Count unique حساب keys across all تعليمات\n- Add 2 to تعليمة count ل SetComputeUnitLimit و SetComputeUnitPrice\n- Flag needsVersionedTx when unique حسابات exceed 35\n\nYour plan must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Sum estimatedCU from all تعليمات, then add 10% margin: ceil(total * 1.1).",
              "Cap compute unit limit at 1,400,000 (Solana max).",
              "Priority fee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) in lamports.",
              "Total fee = base fee (5000 lamports) + priority fee.",
              "Versioned tx needed when unique حساب keys exceed 35."
            ]
          }
        }
      },
      "txopt-v2-optimization": {
        "title": "Optimization & Strategy",
        "description": "Address Lookup Table planning, reliability/retry patterns, actionable error UX, و full send-strategy reporting.",
        "lessons": {
          "txopt-v2-lut-planner": {
            "title": "Challenge: Plan Address Lookup Table usage",
            "content": "# Challenge: Plan Address Lookup Table usage\n\nBuild a function that determines the optimal Address Lookup Table strategy ل a معاملة:\n\n- Collect all unique حساب keys across تعليمات\n- Check which keys exist in available LUTs\n- Calculate معاملة size: base overhead (200 bytes) + keys * 32 bytes each\n- مع LUT: non-LUT keys cost 32 bytes, LUT keys cost 1 byte each\n- Recommend \"legacy\" if the معاملة fits in 1,232 bytes without LUT\n- Recommend \"use-existing-lut\" if LUT keys make it fit\n- Recommend \"create-new-lut\" if it still does not fit even مع available LUTs\n- Return byte savings from LUT usage\n\nYour planner must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Collect all unique حساب keys across تعليمات into a set.",
              "Each key costs 32 bytes without LUT, 1 byte مع LUT.",
              "Base معاملة overhead is ~200 bytes. Max legacy tx size is 1232 bytes.",
              "Recommend 'legacy' if fits without LUT, 'use-existing-lut' if LUT helps enough, 'create-new-lut' if still too large."
            ]
          },
          "txopt-v2-reliability": {
            "title": "Reliability patterns: retry, re-quote, resend vs rebuild",
            "content": "# Reliability patterns: retry, re-quote, resend vs rebuild\n\nProduction DeFi applications must handle معاملة failures gracefully. The difference between a frustrating و a reliable experience comes down to retry strategy: knowing when to resend the same معاملة, when to rebuild مع fresh parameters, و when to abort و inform the user.\n\n## Failure classification\n\nمعاملة failures fall into two categories: retryable و non-retryable. Correct classification is the foundation of any retry strategy.\n\nRetryable failures include: (1) blockhash expired -- the معاملة was not included in time, re-fetch blockhash و resend; (2) network timeout -- the RPC node did not respond, try again or switch nodes; (3) rate limiting (HTTP 429) -- back off و retry after the specified delay; (4) node behind -- the RPC node's slot is behind the cluster, try a different node; و (5) معاملة not found after send -- may need to resend.\n\nNon-retryable failures include: (1) insufficient funds -- user does not have enough balance; (2) slippage exceeded -- pool price moved beyond tolerance, must re-quote; (3) حساب does not exist -- expected حساب is missing; (4) program error مع specific error code -- the program logic rejected the معاملة; و (5) invalid تعليمة data -- the معاملة was constructed incorrectly.\n\n## Resend vs rebuild\n\nResending means submitting the exact same signed معاملة bytes again. This is safe because Solana deduplicates معاملات by signature -- if the original معاملة was already processed, the resend is ignored. Resending is appropriate when: the معاملة was sent but confirmation timed out, the RPC node returned a transient error, or you suspect the معاملة was not propagated to the leader.\n\nRebuilding means constructing a new معاملة from scratch مع fresh parameters: new blockhash, possibly updated حساب state, re-simulated CU estimate, و new signature. Rebuilding is necessary when: the blockhash expired (cannot resend مع stale blockhash), slippage was exceeded (pool state changed, need fresh quote), or حساب state changed (e.g., ATA was created by another معاملة in the meantime).\n\nThe decision tree is: if the failure is a network/delivery issue, resend; if the failure indicates stale state, rebuild; if the failure indicates a permanent problem (insufficient balance, invalid تعليمة), abort مع a clear error.\n\n## Exponential backoff مع jitter\n\nRetry timing must use exponential backoff to avoid overwhelming the network during congestion. The formula is:\n\n```\ndelay = baseDelay * (backoffMultiplier ^ attemptNumber) + random jitter\n```\n\nمع a base delay of 500ms و a 2x multiplier: attempt 1 waits ~500ms, attempt 2 waits ~1,000ms, attempt 3 waits ~2,000ms. Adding random jitter of +/-25% prevents synchronized retries from many clients hitting the same RPC endpoint simultaneously.\n\nCap retries at 3 attempts ل user-initiated معاملات. More retries introduce unacceptable latency (users do not want to wait 10+ seconds). ل backend/automated معاملات, higher retry counts (5-10) may be acceptable.\n\n## Blockhash refresh on retry\n\nEvery retry that involves rebuilding must fetch a fresh blockhash. Using the same blockhash across retries is dangerous because the blockhash may have already expired or be close to expiry. The retry flow is: (1) fetch new blockhash, (2) rebuild معاملة message مع new blockhash, (3) re-sign مع user محفظة (or programmatic keypair), (4) simulate the rebuilt معاملة, (5) send if simulation succeeds.\n\nل محفظة-connected applications, re-signing requires another user interaction (محفظة popup). To minimize this friction, some applications use durable nonces instead of blockhashes. Durable nonces do not expire, eliminating the need to re-sign on retry. However, durable nonces have their own complexity و are not universally supported.\n\n## User-facing retry UX\n\nPresent retry progress clearly: show the attempt number, what went wrong, و what is happening next. Example states: \"Sending معاملة...\" -> \"معاملة not confirmed, retrying (2/3)...\" -> \"Refreshing quote...\" -> \"Success!\" or \"Failed after 3 attempts. [Try Again] [Cancel]\". Never retry silently -- users should always know what is happening مع their معاملة.\n\n## Checklist\n- Classify every failure as retryable or non-retryable\n- Use exponential backoff (500ms base, 2x multiplier) مع jitter\n- Cap retries at 3 ل user-initiated معاملات\n- Refresh blockhash on every rebuild attempt\n- Distinguish resend (same bytes) from rebuild (new معاملة)\n- Show retry progress in the UI مع clear status messages\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l6-q1",
                    "prompt": "When should you rebuild a معاملة instead of resending it?",
                    "options": [
                      "When the blockhash has expired or pool state has changed",
                      "Whenever any error occurs",
                      "Only when the user manually clicks retry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Rebuilding is necessary when the معاملة's blockhash is stale or when on-chain state has changed (e.g., slippage exceeded). Simple network issues only require resending the same bytes."
                  },
                  {
                    "id": "txopt-v2-l6-q2",
                    "prompt": "Why add random jitter to retry delays?",
                    "options": [
                      "To prevent many clients from retrying at the exact same moment و overwhelming the network",
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
            "title": "UX: actionable error messages ل معاملة failures",
            "content": "# UX: actionable error messages ل معاملة failures\n\nRaw Solana error messages are cryptic. \"معاملة simulation failed: Error processing تعليمة 2: custom program error: 0x1771\" tells a developer something but tells a user nothing. Mapping program errors to clear, actionable messages is essential ل DeFi application quality.\n\n## Error taxonomy\n\nSolana معاملة errors fall into several categories, each requiring different user-facing treatment:\n\nمحفظة errors: insufficient SOL balance, insufficient token balance, محفظة disconnected, user rejected signature request. These are the most common و simplest to handle. The message should state what is missing و how to fix it: \"Insufficient SOL balance. You need at least 0.05 SOL to cover معاملة fees. Current balance: 0.01 SOL.\"\n\nProgram errors: these are custom error codes from on-chain programs. Each program defines its own error codes. ل example, Jupiter aggregator might return error 6001 ل \"slippage tolerance exceeded,\" while Raydium returns a different code ل the same concept. Maintaining a mapping from program ID + error code to human-readable messages is necessary ل each protocol you integrate مع.\n\nNetwork errors: RPC node unavailable, connection timeout, rate limited. These are transient و should be presented مع automatic retry: \"Network temporarily unavailable. Retrying in 3 seconds...\" The user should not need to take action unless all retries fail.\n\nCompute errors: compute budget exceeded, معاملة too large. These indicate the معاملة was constructed incorrectly (from the user's perspective). The message should explain the situation و offer a solution: \"معاملة too complex ل a single submission. Splitting into two معاملات...\"\n\n## Mapping program errors\n\nThe most important error mappings ل DeFi applications:\n\nSlippage exceeded: \"Price moved beyond your tolerance of X%. The swap would give you less than your minimum output of Y tokens. Tap 'Refresh Quote' to get an updated price.\" This is actionable -- the user can refresh و try again.\n\nInsufficient liquidity: \"Not enough liquidity in the pool ل this swap size. Try reducing the swap amount or using a different route.\" This tells the user what to do.\n\nStale oracle: \"Price oracle data is outdated. This can happen during high volatility. Please wait a moment و try again.\" This sets expectations.\n\nحساب not initialized: \"Your token حساب ل [TOKEN] needs to be created first. This will cost approximately 0.002 SOL in rent.\" This explains the additional cost.\n\n## Error message principles\n\nGood error messages follow these principles: (1) State what happened in plain language. Not \"Error 0x1771\" but \"The swap price changed too much.\" (2) Explain why it happened. \"Prices move quickly during high volatility.\" (3) Tell the user what to do. \"Tap Refresh to get an updated quote, or increase your slippage tolerance.\" (4) Provide technical details in a collapsible section ل power users: \"Program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4, Error: 6001 (SlippageToleranceExceeded).\"\n\n## Error recovery flows\n\nEach error category should have a defined recovery flow:\n\nBalance errors: show current balance, required balance, و a link to fund the محفظة or swap ل the needed token. Pre-calculate the exact shortfall.\n\nSlippage errors: automatically re-quote مع the same parameters. If the new quote is acceptable, present it مع a \"Swap at new price\" button. If the price moved significantly, warn the user before proceeding.\n\nTimeout errors: show a معاملة explorer link so the user can verify whether the معاملة actually succeeded. Include a \"Check Status\" button that polls the signature. Many apparent failures are actually successes where the confirmation was slow.\n\nSimulation errors: catch these before sending. If simulation fails, do not prompt the user to sign. Instead, show the mapped error و recovery action. This saves users from paying fees on doomed معاملات.\n\n## Logging و monitoring\n\nLog every error مع full context: timestamp, محفظة address (anonymized), معاملة signature (if available), program ID, error code, mapped message, و recovery action taken. This data drives improvements: if 80% of errors are slippage-related, you need better default slippage settings or dynamic adjustment. If compute errors spike, your CU estimation model needs tuning.\n\n## Checklist\n- Map all known program error codes to human-readable messages\n- Include actionable recovery steps in every error message\n- Provide technical details in a collapsible section\n- Automatically re-quote on slippage failures\n- Log all errors مع full context ل monitoring\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "txopt-v2-l7-errors",
                "title": "Error Mapping Examples",
                "steps": [
                  {
                    "cmd": "Raw: custom program error: 0x1771",
                    "output": "Mapped: \"Price moved beyond your 0.5% tolerance. Tap Refresh ل updated quote.\"",
                    "note": "Slippage exceeded -> actionable message"
                  },
                  {
                    "cmd": "Raw: Attempt to debit an account but found no record of a prior credit",
                    "output": "Mapped: \"Insufficient SOL balance. Need 0.05 SOL, have 0.01 SOL. Fund محفظة to continue.\"",
                    "note": "Balance error -> show exact shortfall"
                  },
                  {
                    "cmd": "Raw: Transaction was not confirmed in 30.00 seconds",
                    "output": "Mapped: \"معاملة pending. Check status or retry مع higher priority fee.\" [Check Status] [Retry]",
                    "note": "Timeout -> offer both check و retry options"
                  }
                ]
              }
            ]
          },
          "txopt-v2-send-strategy": {
            "title": "Checkpoint: Generate a send strategy report",
            "content": "# Checkpoint: Generate a send strategy report\n\nBuild the final send strategy report that combines all دورة concepts into a comprehensive معاملة optimization plan:\n\n- Build a tx plan: sum CU estimates مع 10% margin (capped at 1,400,000), calculate priority fee, count unique حسابات و total تعليمات (+2 ل compute budget)\n- Plan LUT strategy: calculate sizes مع و without LUT, recommend legacy / use-existing-lut / create-new-lut\n- Generate fee estimates at three priority tiers: low (100 uL/CU), medium (1,000 uL/CU), high (10,000 uL/CU)\n- Include a fixed retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash\n- Preserve the input timestamp in the output\n\nThis checkpoint validates your complete understanding of معاملة optimization.",
            "duration": "55 min",
            "hints": [
              "Combine tx plan building و LUT planning into one comprehensive report.",
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
    "description": "Master production mobile محفظة signing on Solana: Android MWA sessions, iOS deep-link constraints, resilient retries, و deterministic session telemetry.",
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
        "description": "Platform constraints, connection UX patterns, signing timeline behavior, و typed request construction across Android/iOS.",
        "lessons": {
          "mobilesign-v2-reality-check": {
            "title": "Mobile signing reality check: Android vs iOS constraints",
            "content": "# Mobile signing reality check: Android vs iOS constraints\n\nMobile محفظة signing on Solana is fundamentally different from browser-based محفظة interactions. The constraints imposed by Android و iOS operating systems shape every التصميم decision, from session management to error handling. Understanding these platform differences is essential before writing any signing code.\n\n## Android و Mobile محفظة Adapter (MWA)\n\nOn Android, the Solana Mobile محفظة Adapter (MWA) protocol provides a persistent communication channel between dApps و محفظة applications. MWA leverages Android's ability to run foreground services, which means the محفظة application can maintain an active session while the user interacts مع the dApp. The protocol uses a WebSocket-like association mechanism: the dApp sends an association intent, the محفظة responds مع a session token, و subsequent sign requests flow over this persistent channel.\n\nThe key advantage of MWA on Android is session continuity. Once a user authorizes a dApp, the محفظة maintains an active session that can handle multiple sign requests without requiring the user to switch applications. The foreground service keeps the communication channel alive even when the محفظة is not in the foreground. This enables flows like batch signing, sequential معاملة approval, و real-time status updates.\n\nAndroid MWA sessions have a lifecycle tied to the association. The dApp initiates an association via an Android intent, receives a session object, و can then issue authorize, sign_transactions, sign_messages, و sign_and_send_transactions requests. Sessions persist until explicitly deauthorized, the محفظة terminates them, or the session TTL expires. Typical TTL values range from 5 minutes to 24 hours depending on the محفظة implementation.\n\nHowever, Android is not without constraints. The user must have a compatible MWA محفظة installed (Phantom, Solflare, or other MWA-compatible محافظ). The association intent may fail if no compatible محفظة is found, requiring graceful fallback. Additionally, Android battery optimization و Doze mode can interrupt foreground services on some manufacturer-modified Android builds (Samsung, Xiaomi), requiring careful handling of session interruption.\n\n## iOS limitations و deep link patterns\n\niOS presents a fundamentally different challenge. Apple does not allow arbitrary background processes or persistent inter-app communication channels. There is no equivalent to Android's foreground service pattern. When a user switches from a dApp (typically a web view or native app) to a محفظة app, the dApp's execution context is suspended. There is no way to maintain a WebSocket or persistent channel between the two applications.\n\nOn iOS, محفظة interactions rely on deep links و universal links. The dApp constructs a signing request, encodes it into a URL, و opens the محفظة via a deep link. The محفظة processes the request, و returns the result via a callback deep link back to the dApp. Each sign request requires a full app switch: dApp to محفظة, user approval, محفظة back to dApp.\n\nThis round-trip app switching has significant UX implications. Each signature requires 2-4 seconds of visual context switching. Users see the iOS app transition animation, must locate the approve button in the محفظة, و then return to the dApp. Batch signing is particularly painful because each معاملة in the batch requires a separate app switch (unless the محفظة supports batch approval in a single deep link payload).\n\nSession persistence on iOS is effectively impossible in the traditional sense. The dApp cannot know if the محفظة is still running, whether the user closed it, or if iOS terminated it ل memory pressure. Every request must be treated as potentially the first request in a new session. This means encoding all necessary context (app identity, cluster, authorization state) into every deep link request.\n\n## What actually works in production\n\nProduction mobile dApps adopt a hybrid strategy. On Android, they detect MWA support و use the persistent session model. On iOS, they fall back to deep link patterns مع aggressive local caching to minimize the data that must be re-transmitted on each request. Cross-platform frameworks like the Solana Mobile SDK abstract some of these differences, but developers must still handle platform-specific edge cases.\n\nFallback patterns include: QR code-based WalletConnect sessions (works on both platforms but adds latency), embedded browser محافظ (avoid app switching but sacrifice الامان), و progressive web app approaches مع browser extension محافظ. Each fallback has trade-offs in الامان, UX, و feature completeness.\n\nThe most robust approach is capability detection at runtime: check ل MWA support, fall back to deep links, و ultimately offer QR-based connection as a universal fallback. Each path should provide appropriate UX feedback so users understand why the experience differs across devices.\n\n## Shipping principle ل mobile signing\n\nالتصميم ل interruption by default. Assume app switches, OS suspension, network drops, و محفظة restarts are normal events. A resilient signing flow recovers state quickly و keeps users informed at each step.\n\n## Checklist\n- Detect MWA availability on Android before attempting association\n- Implement deep link fallback ل iOS و non-MWA Android\n- Handle session interruption from OS-level process management\n- Cache session state locally ل faster reconnection\n- Provide clear UX ل each connection method\n\n## Red flags\n- Assuming MWA works identically on iOS و Android\n- Not handling foreground service termination on Android\n- Ignoring deep link callback failures on iOS\n- Hardcoding a single محفظة without fallback detection\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l1-q1",
                    "prompt": "What enables persistent dApp-to-محفظة communication on Android?",
                    "options": [
                      "Foreground services maintaining a session channel",
                      "Deep links passed between applications",
                      "Shared local storage between apps"
                    ],
                    "answerIndex": 0,
                    "explanation": "Android MWA uses foreground services to maintain a persistent communication channel between the dApp و محفظة, enabling multi-request sessions without app switching."
                  },
                  {
                    "id": "mobilesign-v2-l1-q2",
                    "prompt": "Why can't iOS maintain persistent محفظة sessions like Android?",
                    "options": [
                      "iOS suspends app execution on background transitions, preventing persistent channels",
                      "iOS محافظ do not support Solana",
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
            "title": "محفظة connection UX patterns: connect, reconnect, و recovery",
            "content": "# محفظة connection UX patterns: connect, reconnect, و recovery\n\nمحفظة connection on mobile is the first interaction users have مع your dApp. A smooth connection flow builds trust; a broken one drives users away. This درس covers the connection lifecycle, automatic reconnection strategies, network mismatch handling, و user-friendly error states.\n\n## Initial connection flow\n\nThe connection flow begins مع capability detection. Before presenting any محفظة UI, your dApp should determine what connection methods are available. On Android, check ل installed MWA-compatible محافظ by attempting to resolve the MWA association intent. On iOS, check ل registered deep link handlers. If neither is available, offer a QR code or WalletConnect fallback.\n\nOnce a connection method is selected, the authorization flow begins. ل MWA on Android, this involves sending an authorize request مع your app identity (name, URI, icon). The محفظة displays a consent screen showing your dApp's identity و requested permissions. Upon approval, the محفظة returns an auth token و the user's public key. Store both: the public key ل display و معاملة building, the auth token ل session resumption.\n\nل deep link connections on iOS, the flow is: construct an authorize deep link مع your app identity و callback URI, open the محفظة, wait ل the callback deep link مع the auth result, و parse the response. The response includes the public key و optionally a session token ل subsequent requests.\n\nConnection state should be persisted locally. Store the محفظة address, connection method, auth token, و timestamp. This enables automatic reconnection on app restart without requiring the user to re-authorize. Use secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) ل auth tokens.\n\n## Automatic reconnection\n\nWhen the dApp restarts or returns from background, attempt silent reconnection before showing any محفظة UI. The reconnection flow checks: is there a stored auth token? Is it still valid (not expired)? Can we re-establish the communication channel?\n\nOn Android مع MWA, reconnection involves re-associating مع the محفظة using the stored auth token. If the محفظة accepts the token, the session resumes transparently. If the token is expired or revoked, fall back to a fresh authorization flow. The key is making this check fast (under 500ms) so the user does not see a loading state.\n\nOn iOS, reconnection is simpler but less reliable. Check if the stored محفظة address is still valid by verifying the حساب exists on-chain. The auth token from the previous deep link session may or may not be accepted by the محفظة on the next interaction. Optimistically display the stored محفظة address و handle re-authorization lazily when the first sign request fails.\n\n## Network mismatch handling\n\nNetwork mismatches occur when the dApp expects one cluster (e.g., mainnet-beta) but the محفظة is configured ل another (e.g., devnet). This is a common source of confusing errors: معاملات build correctly but fail on submission because they reference حسابات that do not exist on the محفظة's configured cluster.\n\nDetection strategies include: requesting the محفظة's current cluster during authorization, comparing the cluster in sign responses against expectations, و catching specific RPC errors that indicate cluster mismatch (e.g., حساب not found ل well-known program addresses).\n\nWhen a mismatch is detected, present a clear error message: \"Your محفظة is connected to devnet, but this dApp requires mainnet-beta. Please switch your محفظة's network و reconnect.\" Avoid technical jargon. Some محافظ support programmatic cluster switching via the MWA protocol; use this when available.\n\n## User-friendly error states\n\nError states must be actionable. Users should always know what happened و what to do next. Common error states و their UX patterns:\n\nمحفظة not found: \"No compatible محفظة detected. Install Phantom or Solflare to continue.\" Include direct links to app stores.\n\nAuthorization denied: \"محفظة connection was declined. Tap Connect to try again.\" Do not repeatedly prompt; wait ل user action.\n\nSession expired: \"Your محفظة session has expired. Tap to reconnect.\" Attempt silent reconnection first; only show this if silent reconnection fails.\n\nNetwork error: \"Unable to reach the Solana network. Check your internet connection و try again.\" Distinguish between local network issues و RPC endpoint failures.\n\nمحفظة disconnected: \"Your محفظة was disconnected. This can happen if the محفظة app was closed. Tap to reconnect.\" On Android, this may indicate the foreground service was killed.\n\n## Recovery patterns\n\nRecovery should be automatic when possible و manual when necessary. Implement a connection state machine مع states: disconnected, connecting, connected, reconnecting, و error. Transitions between states should be deterministic و logged ل debugging.\n\nThe reconnecting state is critical. When a connected session fails (e.g., the محفظة app crashes), transition to reconnecting و attempt up to 3 silent reconnection attempts مع exponential backoff (1s, 2s, 4s). If all attempts fail, transition to error و present the manual reconnection UI.\n\n## Checklist\n- Detect available connection methods before showing محفظة UI\n- Store auth tokens securely ل automatic reconnection\n- Handle network mismatch مع clear user messaging\n- Implement connection state machine مع deterministic transitions\n- Provide actionable error states مع recovery options\n\n## Red flags\n- Showing raw error codes to users\n- Repeatedly prompting ل authorization after denial\n- Not persisting connection state across app restarts\n- Ignoring network mismatch silently\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l2-q1",
                    "prompt": "What should you do before showing any محفظة connection UI?",
                    "options": [
                      "Detect available connection methods (MWA, deep links, QR)",
                      "Immediately open the default محفظة",
                      "Display a loading spinner ل 3 seconds"
                    ],
                    "answerIndex": 0,
                    "explanation": "Capability detection ensures you only present connection methods that are actually available on the user's device."
                  },
                  {
                    "id": "mobilesign-v2-l2-q2",
                    "prompt": "How should a dApp handle a network mismatch between itself و the محفظة?",
                    "options": [
                      "Display a clear message asking the user to switch their محفظة's network",
                      "Silently retry the معاملة on a different cluster",
                      "Ignore the mismatch و hope it resolves"
                    ],
                    "answerIndex": 0,
                    "explanation": "Network mismatches should be communicated clearly to the user مع تعليمات on how to resolve them, avoiding confusing silent failures."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-timeline-explorer": {
            "title": "Signing session timeline: request, محفظة, و response flow",
            "content": "# Signing session timeline: request, محفظة, و response flow\n\nUnderstanding the complete lifecycle of a mobile signing request is essential ل building reliable dApps. Every sign request passes through multiple stages, each مع its own failure modes و timing constraints. This درس traces a request from construction to final response.\n\n## Request construction phase\n\nThe signing flow begins in the dApp when user action triggers a معاملة. The dApp constructs the معاملة: fetching a recent blockhash, building تعليمات, setting the fee payer, و serializing the معاملة into a byte array. On mobile, this construction phase must be fast because the user is waiting ل the محفظة to appear.\n\nKey timing constraint: the recent blockhash has a limited validity window (typically 60-90 seconds on mainnet, determined by the slots-per-epoch configuration). If معاملة construction takes too long (e.g., due to slow RPC responses), the blockhash may expire before the محفظة even sees the معاملة. Production dApps pre-fetch blockhashes و refresh them periodically.\n\nThe constructed معاملة is encoded (typically base64 ل MWA, or URL-safe base64 ل deep links) و wrapped in a sign request object. The sign request includes metadata: the app identity, requested cluster, و a unique request ID ل tracking. On MWA, this is sent over the session channel. On iOS deep links, it is encoded into the URL.\n\n## محفظة-side processing\n\nOnce the محفظة receives the sign request, it enters its own processing pipeline. The محفظة decodes the معاملة, simulates it (if the محفظة supports simulation), extracts human-readable information ل the approval screen, و presents the معاملة details to the user.\n\nSimulation is a critical step. محافظ like Phantom simulate معاملات before showing them to users, detecting potential failures, extracting token transfer amounts, و identifying program interactions. Simulation adds 1-3 seconds to the محفظة-side processing time but significantly improves the user experience by showing accurate fee estimates و transfer amounts.\n\nThe approval screen shows: the requesting dApp's identity (name, icon, URI), the معاملة type (transfer, swap, mint, etc.), amounts being transferred, estimated fees, و any warnings (e.g., interaction مع unverified programs). The user can approve or reject. The time spent on this screen is unpredictable و depends entirely on the user.\n\n## Response handling\n\nAfter the user approves (or rejects), the محفظة constructs و returns a response. ل approved معاملات, the response contains the signed معاملة bytes (the original معاملة مع the محفظة's signature appended). ل rejected معاملات, the response contains an error code و message.\n\nOn MWA, the response arrives over the same session channel. The dApp receives a callback مع the signed معاملة or error. On iOS deep links, the محفظة opens the dApp's callback URL مع the response encoded in the URL parameters or fragment.\n\nResponse parsing must be defensive. Check that the response contains a valid signature, that the معاملة bytes match the original request (to detect tampering), و that the response corresponds to the correct request ID. محافظ may return responses out of order if multiple requests were queued.\n\n## Timeout scenarios\n\nTimeouts are the most challenging failure mode in mobile signing. A timeout can occur at multiple points: during request delivery (the محفظة never received the request), during user decision (the user walked away), during response delivery (the محفظة signed but the response was lost), or during submission (the signed معاملة was sent but confirmation timed out).\n\nEach timeout requires a different recovery strategy. Request delivery timeout: retry the request. User decision timeout: show a \"waiting ل محفظة\" UI مع a cancel option. Response delivery timeout: check on-chain ل the معاملة signature before retrying (to avoid double-signing). Submission timeout: poll ل معاملة status before resubmitting.\n\nA reasonable timeout configuration ل mobile: 30 seconds ل the complete round-trip (request to response), مع a 60-second grace period ل user decision on the محفظة side. If the MWA session itself times out, re-associate before retrying. If the deep link callback never arrives, present a manual \"I've approved in my محفظة\" button that triggers a status check.\n\n## The complete timeline\n\nA typical successful signing flow takes 3-8 seconds on Android MWA و 6-15 seconds on iOS deep links. The breakdown: معاملة construction (0.5-2s), request delivery (0.1-0.5s on MWA, 1-3s on deep link), محفظة simulation (1-3s), user approval (variable), response delivery (0.1-0.5s on MWA, 1-3s on deep link), و معاملة submission (0.5-2s).\n\n## Checklist\n- Pre-fetch blockhashes to minimize construction time\n- Include unique request IDs ل response correlation\n- Handle all timeout scenarios مع appropriate recovery\n- Parse responses defensively مع signature validation\n- Provide real-time status feedback during the signing flow\n\n## Red flags\n- Using stale blockhashes that expire during signing\n- Not correlating responses مع request IDs\n- Treating all timeouts identically\n- Missing the case where a معاملة was signed but the response was lost\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mobilesign-v2-l3-timeline",
                "title": "Signing Session Timeline",
                "steps": [
                  {
                    "cmd": "T+0.0s  dApp: build transaction",
                    "output": "Fetch blockhash, construct تعليمات, serialize to base64",
                    "note": "معاملة construction phase"
                  },
                  {
                    "cmd": "T+0.5s  dApp -> wallet: sign_transactions request",
                    "output": "{\"type\":\"معاملة\",\"payload\":\"AQAAA...\",\"requestId\":\"req_001\"}",
                    "note": "Request sent via MWA session or deep link"
                  },
                  {
                    "cmd": "T+1.0s  wallet: simulate transaction",
                    "output": "{\"fee\":\"0.000005 SOL\",\"transfers\":[{\"to\":\"7Y4f...\",\"amount\":\"1.5 SOL\"}]}",
                    "note": "محفظة simulates و extracts display info"
                  },
                  {
                    "cmd": "T+1.5s  wallet: show approval screen",
                    "output": "User sees: Send 1.5 SOL to 7Y4f... | Fee: 0.000005 SOL | [Approve] [Reject]",
                    "note": "User decision - timing is unpredictable"
                  },
                  {
                    "cmd": "T+3.0s  wallet -> dApp: signed response",
                    "output": "{\"signedPayloads\":[\"AQAAA...signed...\"],\"requestId\":\"req_001\"}",
                    "note": "Signed معاملة returned to dApp"
                  },
                  {
                    "cmd": "T+3.5s  dApp: submit to RPC",
                    "output": "{\"signature\":\"5UzM...\",\"confirmationStatus\":\"confirmed\"}",
                    "note": "معاملة submitted و confirmed on-chain"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-sign-request": {
            "title": "Challenge: Build a typed sign request",
            "content": "# Challenge: Build a typed sign request\n\nImplement a sign request builder ل Mobile محفظة Adapter:\n\n- Validate the payload type (معاملة or message)\n- Validate payload data (base64 ل معاملات, non-empty string ل messages)\n- Set session metadata (app identity مع name, URI, و icon)\n- Validate the cluster (mainnet-beta, devnet, or testnet)\n- Generate a request ID if not provided\n- Return a structured SignRequest مع validation results\n\nYour implementation will be tested against valid requests, message signing requests, و invalid inputs مع multiple errors.",
            "duration": "50 min",
            "hints": [
              "Validate type is either 'معاملة' or 'message' before checking payload format.",
              "معاملة payloads must be valid base64 (A-Z, a-z, 0-9, +, /, optional = padding, length divisible by 4).",
              "App identity requires at least name و URI. Icon is optional but should default to empty string.",
              "Generate a requestId from type + payload prefix if not provided."
            ]
          }
        }
      },
      "mobilesign-v2-production": {
        "title": "Production Patterns",
        "description": "Session persistence, معاملة-review safety, retry state machines, و deterministic session reporting ل production mobile apps.",
        "lessons": {
          "mobilesign-v2-session-persist": {
            "title": "Challenge: Session persistence و restoration",
            "content": "# Challenge: Session persistence و restoration\n\nImplement a session persistence manager ل mobile محفظة sessions:\n\n- Process a sequence of actions: save, restore, clear, و expire_check\n- Track محفظة address و last sign request ID across actions\n- Handle session expiry based on TTL و timestamps\n- Return the final session state مع a complete action log\n\nEach action modifies the session state. Save establishes a session, restore checks if it is still valid, clear removes it, و expire_check verifies TTL bounds.",
            "duration": "50 min",
            "hints": [
              "Process actions sequentially: each action modifies the session state.",
              "Save sets walletAddress, lastRequestId, sessionActive=true, و expiresAt = timestamp + TTL.",
              "Restore succeeds only if session is active و current time < expiresAt.",
              "Expire check clears session if current time >= expiresAt."
            ]
          },
          "mobilesign-v2-review-screens": {
            "title": "Mobile معاملة review: what users need to see",
            "content": "# Mobile معاملة review: what users need to see\n\nمعاملة review screens are the last line of defense between a user و a potentially harmful معاملة. On mobile, screen real estate is limited و user attention is fragmented. Designing effective review screens requires understanding what information matters, how to present it, و what simulation results to surface.\n\n## Human-readable معاملة summaries\n\nRaw معاملة data is meaningless to most users. A معاملة containing a SystemProgram.transfer تعليمة should display \"Send 1.5 SOL to 7Y4f...T6aY\" rather than showing serialized تعليمة bytes. The translation from on-chain تعليمات to human-readable summaries is one of the most important UX challenges in mobile محفظة development.\n\nSummary generation involves: identifying the program being called (System Program, Token Program, a known DeFi protocol), decoding the تعليمة data according to the program's IDL or known layout, extracting the relevant parameters (amounts, addresses, token mints), و formatting them ل display. Unknown programs should show a warning: \"Interaction مع unverified program: Prog1111...\".\n\nAddress formatting on mobile requires truncation. Full Solana addresses (32-44 characters) do not fit on mobile screens. The standard pattern is showing the first 4 و last 4 characters مع an ellipsis: \"7Y4f...T6aY\". Always provide a way to view the full address (tap to expand or copy). ل known addresses (well-known programs, token mints), show the human-readable name instead: \"USDC Token Program\" rather than \"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\".\n\nToken amounts must include decimals و symbols. A raw amount of 1500000 ل a USDC transfer should display as \"1.50 USDC\", not \"1500000 lamports\". This requires knowing the token's decimal places و symbol, which can be fetched from the token mint's metadata or a local registry of known tokens.\n\n## Fee display و estimation\n\nمعاملة fees on Solana are low but not zero. Users should see the estimated fee before approving. The base fee (currently 5000 lamports or 0.000005 SOL) plus any priority fee should be displayed clearly. If the معاملة includes compute budget تعليمات that set a custom fee, extract و display the total.\n\nFee estimation can use simulation results. The Solana RPC simulateTransaction method returns the compute units consumed, which combined مع the priority fee rate gives an accurate fee estimate. Display fees in both SOL و the user's preferred fiat currency if possible.\n\nل معاملات that interact مع DeFi protocols, additional costs may apply: swap fees, protocol fees, slippage impact. These should be itemized separately from the network معاملة fee. A swap review screen might show: \"Swap 10 USDC ل ~0.05 SOL | Network fee: 0.000005 SOL | Protocol fee: 0.01 USDC | تأثير السعر: 0.1%\".\n\n## Simulation results\n\nمعاملة simulation is the most powerful tool ل معاملة review. Before showing the approval screen, simulate the معاملة و extract: balance changes (SOL و token حسابات), new حسابات that will be created, حسابات that will be closed, و any errors or warnings.\n\nBalance change summaries are the most intuitive way to present معاملة effects. Show a list of changes: \"-1.5 SOL from your محفظة\", \"+150 USDC to your محفظة\", \"-0.000005 SOL (network fee)\". Color-code decreases (red) و increases (green) ل quick visual scanning.\n\nSimulation can detect potential issues: insufficient balance, حساب ownership conflicts, program errors, و excessive compute usage. Surface these as warnings before the user approves. A warning like \"This معاملة will fail: insufficient SOL balance\" saves the user from paying a fee ل a failed معاملة.\n\n## Approval UX patterns\n\nThe approve و reject buttons must be unambiguous. Use distinct colors (green ل approve, red/grey ل reject), sufficient spacing to prevent accidental taps, و clear labels (\"Approve\" و \"Reject\", not \"OK\" و \"Cancel\"). Consider requiring a deliberate gesture (swipe to approve) ل high-value معاملات.\n\nBiometric confirmation adds الامان ل high-value معاملات. After the user taps approve, prompt ل fingerprint or face recognition before signing. This prevents unauthorized معاملات if the device is unlocked but unattended. Make biometric confirmation optional و configurable.\n\nLoading states during signing should show progress: \"Signing معاملة...\", \"Submitting to network...\", \"Waiting ل confirmation...\". Never show a blank screen or spinner without context. If the process takes longer than expected, show a message: \"This is taking longer than usual. Your معاملة is still processing.\"\n\n## Checklist\n- Translate تعليمات to human-readable summaries\n- Truncate addresses مع first 4 و last 4 characters\n- Show token amounts مع correct decimals و symbols\n- Display simulation-based fee estimates\n- Surface balance changes مع color coding\n- Require deliberate approval gestures ل high-value معاملات\n\n## Red flags\n- Showing raw تعليمة bytes to users\n- Displaying token amounts without decimal conversion\n- Missing fee information on approval screens\n- No simulation before معاملة approval\n- Approve و reject buttons too close together\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l6-q1",
                    "prompt": "How should token amounts be displayed on a mobile معاملة review screen?",
                    "options": [
                      "مع correct decimal places و token symbol (e.g., 1.50 USDC)",
                      "As raw lamports or smallest unit values",
                      "In scientific notation ل precision"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts must be converted to human-readable format using the token's decimal configuration و include the symbol ل clarity."
                  },
                  {
                    "id": "mobilesign-v2-l6-q2",
                    "prompt": "What is the most intuitive way to present معاملة simulation results?",
                    "options": [
                      "Balance change summaries مع color-coded increases و decreases",
                      "Raw simulation logs from the RPC response",
                      "A list of all حسابات the معاملة touches"
                    ],
                    "answerIndex": 0,
                    "explanation": "Balance change summaries (e.g., -1.5 SOL, +150 USDC) are the most user-friendly way to communicate what a معاملة will do."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-retry-patterns": {
            "title": "One-tap retry: handling offline, rejected, و timeout states",
            "content": "# One-tap retry: handling offline, rejected, و timeout states\n\nMobile environments are inherently unreliable. Users move between WiFi و cellular, enter tunnels, close apps mid-معاملة, و محافظ crash. A robust retry system is not optional; it is a core requirement ل production mobile dApps. This درس covers retry state machines, offline detection, user-initiated retry, و mobile-appropriate backoff strategies.\n\n## Retry state machine\n\nEvery sign request in a mobile dApp should be managed by a state machine مع well-defined states و transitions. The core states are: idle, pending, signing, submitted, confirmed, failed, و retrying. Each state has specific allowed transitions و associated UI.\n\nIdle: no active request. Transition to pending when the user initiates an action.\n\nPending: the request is being constructed (fetching blockhash, building معاملة). Transition to signing when the request is sent to the محفظة, or to failed if construction fails (e.g., RPC unreachable).\n\nSigning: waiting ل محفظة response. Transition to submitted if the محفظة returns a signed معاملة, to failed if the محفظة rejects, or to retrying if the signing times out.\n\nSubmitted: the signed معاملة has been sent to the network. Transition to confirmed when the معاملة is finalized, or to failed if submission fails or confirmation times out.\n\nConfirmed: terminal success state. Display success UI و clean up.\n\nFailed: non-terminal failure state. Analyze the failure reason و determine if retry is appropriate. Transition to retrying if the failure is retryable, or remain in failed if it is terminal (e.g., user explicitly rejected).\n\nRetrying: preparing to retry. Refresh stale data (new blockhash, updated balances), wait ل backoff period, then transition back to pending.\n\n## Offline detection\n\nMobile offline detection is more nuanced than checking navigator.onLine. That property only indicates whether the device has a network interface active, not whether the Solana RPC endpoint is reachable. Implement a multi-layer detection strategy.\n\nLayer 1: Network interface status. Use the device's network state API to detect complete disconnection (airplane mode, no signal). This is instant و covers the most obvious case.\n\nLayer 2: RPC health check. Periodically ping the Solana RPC endpoint مع a lightweight request (getHealth or getSlot). If this fails but the network interface is up, the issue is likely RPC-specific. Try a fallback RPC endpoint before declaring offline status.\n\nLayer 3: معاملة-level detection. If a معاملة submission returns a network error, mark the request as failed-offline rather than failed-permanent. This distinction drives the retry logic: offline failures should be retried when connectivity returns, while permanent failures (insufficient funds, invalid معاملة) should not.\n\nWhen offline is detected, queue pending sign requests locally. Display an offline banner: \"You are offline. Your معاملة will be submitted when connectivity returns.\" When connectivity is restored, process the queue in order, refreshing blockhashes ل any queued معاملات (they will have expired).\n\n## User-initiated retry\n\nNot all retries should be automatic. When a معاملة fails, present the user مع context و a clear retry option. The retry button should be prominent (primary action), و the error context should be concise.\n\nل محفظة rejection: \"معاملة was declined in your محفظة. [Try Again]\". The retry re-opens the محفظة مع the same request. Do not automatically retry rejected معاملات; respect the user's decision و only retry on explicit user action.\n\nل timeout: \"محفظة did not respond in time. This may happen if the محفظة app was closed. [Retry] [Cancel]\". Before retrying, check if the معاملة was already signed و submitted (to avoid double-signing).\n\nل network errors: \"Could not reach the Solana network. [Retry When Online]\". This button should be disabled while offline و automatically trigger when connectivity returns.\n\nل submission failures: \"معاملة could not be confirmed. [Retry مع New Blockhash]\". This re-constructs the معاملة مع a fresh blockhash و re-submits. Show the previous failure reason to build user confidence.\n\n## Exponential backoff on mobile\n\nMobile backoff must be more aggressive than server-side backoff because users are waiting و watching. Start مع a 1-second delay, double on each retry, و cap at 8 seconds. After 3 failed retries, stop automatic retrying و present a manual retry option.\n\nThe backoff sequence ل automatic retries: 1s, 2s, 4s, then stop. ل user-initiated retries, do not apply backoff (the user explicitly chose to retry, so execute immediately). ل offline queue processing, use a 2-second delay between queued items to avoid overwhelming the RPC endpoint when connectivity returns.\n\nJitter is important even on mobile. Add a random 0-500ms offset to each retry delay to prevent thundering herd problems when many users come back online simultaneously (e.g., after a widespread network outage).\n\nDisplay retry progress to the user: \"Retrying in 3... 2... 1...\" or \"Attempt 2 of 3\". Never retry silently; users should always know the dApp is working on their behalf.\n\n## Checklist\n- Implement a state machine ل every sign request lifecycle\n- Detect offline state at network, RPC, و معاملة levels\n- Queue معاملات locally when offline\n- Refresh blockhashes before retrying queued معاملات\n- Use mobile-appropriate backoff: 1s, 2s, 4s, then manual\n- Show retry progress و attempt counts to users\n\n## Red flags\n- Automatically retrying user-rejected معاملات\n- Using server-side backoff timing (30s+) on mobile\n- Retrying مع stale blockhashes\n- Silently retrying without user visibility\n- Not checking ل already-submitted معاملات before retry\n",
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
                    "output": "Opening محفظة ل approval... requestId=req_001",
                    "note": "Request sent to محفظة via MWA or deep link"
                  },
                  {
                    "cmd": "State: signing -> failed (timeout after 30s)",
                    "output": "محفظة did not respond. Failure: SIGNING_TIMEOUT",
                    "note": "محفظة app may have been closed or crashed"
                  },
                  {
                    "cmd": "State: failed -> retrying (attempt 1/3, delay 1s)",
                    "output": "Refreshing blockhash... Retrying in 1s...",
                    "note": "Automatic retry مع fresh blockhash"
                  },
                  {
                    "cmd": "State: retrying -> signing",
                    "output": "Re-opening محفظة ل approval... requestId=req_001_r1",
                    "note": "New request sent مع updated blockhash"
                  },
                  {
                    "cmd": "State: signing -> submitted",
                    "output": "محفظة approved. Submitting tx: 5UzM...",
                    "note": "Signed معاملة submitted to network"
                  },
                  {
                    "cmd": "State: submitted -> confirmed",
                    "output": "معاملة confirmed in slot 234567890. Success!",
                    "note": "Terminal success state"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-session-report": {
            "title": "Checkpoint: Generate a session report",
            "content": "# Checkpoint: Generate a session report\n\nImplement a session report generator that summarizes a complete mobile signing session:\n\n- Count total requests, successful signs, و failed signs\n- Sum retry attempts across all requests\n- Calculate session duration from start و end timestamps\n- Break down requests by type (معاملة vs message)\n- Produce deterministic JSON output ل consistent reporting\n\nThis checkpoint validates your understanding of session lifecycle, request tracking, و deterministic output generation.",
            "duration": "55 min",
            "hints": [
              "Count requests by status: 'signed' = success, 'rejected'/'timeout'/'error' = failure.",
              "Sum retries across all requests ل total retry attempts.",
              "Session duration = sessionEnd - sessionStart in seconds.",
              "Request breakdown counts how many were 'معاملة' vs 'message' type."
            ]
          }
        }
      }
    }
  },
  "solana-pay-commerce": {
    "title": "Solana Pay Commerce",
    "description": "Master Solana Pay commerce integration: robust URL encoding, QR/payment tracking workflows, confirmation UX, و deterministic POS reconciliation artifacts.",
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
        "description": "Solana Pay specification, URL encoding rigor, transfer request anatomy, و deterministic builder/encoder patterns.",
        "lessons": {
          "solanapay-v2-mental-model": {
            "title": "Solana Pay النموذج الذهني و URL encoding rules",
            "content": "# Solana Pay النموذج الذهني و URL encoding rules\n\nSolana Pay is an open specification ل encoding payment requests into URLs that محافظ can parse و execute. Unlike traditional payment processors that rely on centralized intermediaries, Solana Pay enables direct peer-to-peer value transfer by embedding all the information a محفظة needs into a single URI string. Understanding this specification deeply is the foundation ل building any commerce integration on Solana.\n\nThe Solana Pay specification defines two distinct request types: transfer requests و معاملة requests. Transfer requests are the simpler of the two — they encode a recipient address, an amount, و optional metadata directly in the URL. The محفظة parses the URL, constructs a standard SOL or SPL token transfer معاملة, و submits it to the network. معاملة requests are more powerful — the URL points to an API endpoint that returns a serialized معاملة ل the محفظة to sign. This allows the merchant server to build arbitrarily complex معاملات (multi-تعليمة, program interactions, etc.) while the محفظة simply signs what it receives.\n\nThe URL format follows a strict schema. A transfer request URL takes the form: `solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>&memo=<memo>`. The scheme is always `solana:` (not `solana://`). The recipient is a base58-encoded Solana public key placed immediately after the colon مع no slashes. Query parameters encode the payment details.\n\nEach parameter has specific encoding rules. The `amount` is a decimal string representing the number of tokens (not lamports or raw units). ل native SOL, `amount=1.5` means 1.5 SOL. ل SPL tokens, the amount is in the token's human-readable units respecting its decimals. The `spl-token` parameter is optional — when absent, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token. The `reference` parameter is one or more base58 public keys that are added as non-signer keys in the transfer تعليمة, enabling معاملة discovery via `getSignaturesForAddress`. The `label` identifies the merchant or payment recipient in a human-readable format. The `message` provides a description of the payment purpose. Both `label` و `message` must be URL-encoded using percent-encoding (spaces become `%20`, special characters like `#` become `%23`).\n\nWhen should you use transfer requests versus معاملة requests? Transfer requests are ideal ل simple point-of-sale payments where the merchant only needs to receive a fixed amount of a single token. They work entirely client-side — no server needed. معاملة requests are necessary when the payment involves multiple تعليمات (e.g., creating an associated token حساب, interacting مع a program, splitting payments among multiple recipients, or including on-chain metadata). معاملة requests require a server endpoint that the محفظة calls to fetch the معاملة.\n\nURL encoding correctness is critical. A malformed URL will be rejected by compliant محافظ. Common mistakes include: using `solana://` instead of `solana:`, encoding the recipient address incorrectly, omitting percent-encoding ل special characters in labels, و providing amounts in raw token units instead of human-readable decimals. The specification requires that all base58 values are valid Solana public keys (32 bytes when decoded), و that amounts are non-negative finite decimal numbers.\n\nThe reference key mechanism is what makes Solana Pay عملي ل commerce. By generating a unique keypair per معاملة و including its public key as a reference, the merchant can poll `getSignaturesForAddress(reference)` to detect when the payment arrives. This eliminates the need ل webhooks or push notifications — the merchant simply polls until the reference appears in a confirmed معاملة, then verifies the transfer details match the expected payment.\n\n## Commerce operator rule\n\nThink in terms of order-state guarantees, not just payment detection:\n1. request created,\n2. payment observed,\n3. payment validated,\n4. fulfillment released.\n\nEach step needs explicit checks so fulfillment never races ahead of verification.\n\n## Checklist\n- Use `solana:` scheme (no double slashes)\n- Place the recipient base58 address directly after the colon\n- Encode label و message مع encodeURIComponent\n- Use human-readable decimal amounts, not raw lamport values\n- Generate a unique reference keypair per payment ل tracking\n\n## Red flags\n- Using `solana://` instead of `solana:`\n- Sending raw lamport amounts in the amount field\n- Forgetting to URL-encode label و message parameters\n- Reusing reference keys across multiple payments\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l1-q1",
                    "prompt": "What is the correct URL scheme ل Solana Pay transfer requests?",
                    "options": [
                      "solana:<recipient> (single colon, no slashes)",
                      "solana://<recipient> (double slashes like HTTP)",
                      "pay:<recipient> (custom pay scheme)"
                    ],
                    "answerIndex": 0,
                    "explanation": "The Solana Pay specification uses the 'solana:' scheme followed immediately by the recipient address مع no slashes."
                  },
                  {
                    "id": "solanapay-v2-l1-q2",
                    "prompt": "When should you use a معاملة request instead of a transfer request?",
                    "options": [
                      "When the payment requires multiple تعليمات or program interactions beyond a simple transfer",
                      "When the amount exceeds 100 SOL",
                      "When paying مع native SOL instead of SPL tokens"
                    ],
                    "answerIndex": 0,
                    "explanation": "معاملة requests allow the server to build arbitrarily complex معاملات. Transfer requests only support simple single-token transfers."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-transfer-anatomy": {
            "title": "Transfer request anatomy: recipient, amount, reference, و labels",
            "content": "# Transfer request anatomy: recipient, amount, reference, و labels\n\nA Solana Pay transfer request URL contains everything a محفظة needs to construct و submit a payment معاملة. Each component of the URL serves a specific purpose in the payment flow. Understanding the anatomy of these requests — و how each field maps to on-chain behavior — is essential ل building reliable commerce integrations.\n\nThe recipient address is the most critical field. It appears immediately after the `solana:` scheme و must be a valid base58-encoded Solana public key. ل native SOL transfers, this is the محفظة address that will receive the SOL. ل SPL token transfers, this is the محفظة address whose associated token حساب (ATA) will receive the tokens. The محفظة application is responsible ل deriving the correct ATA from the recipient address و the SPL token mint. If the recipient's ATA does not exist, the محفظة must create it as part of the معاملة (using `createAssociatedTokenAccountIdempotent`). A malformed or invalid recipient address will cause the محفظة to reject the payment request entirely.\n\nThe amount parameter specifies how much to transfer in human-readable decimal form. ل native SOL, `amount=2.5` means 2.5 SOL (2,500,000,000 lamports internally). ل USDC (6 decimals), `amount=10.50` means 10.50 USDC (10,500,000 raw units). The محفظة handles the conversion from decimal to raw units based on the token's decimal configuration. This التصميم keeps the URL readable by humans و consistent across tokens مع different decimal places. The amount must be a positive finite number — zero, negative, or infinite values are invalid.\n\nThe spl-token parameter distinguishes SOL transfers from SPL token transfers. When omitted, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token to transfer. Common examples include USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`), USDT (`Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx`), و any other SPL token. The محفظة validates that the mint exists و that the sender has a sufficient balance before constructing the معاملة.\n\nThe reference parameter is what makes Solana Pay viable ل real-time commerce. A reference is a base58-encoded public key that gets added as a non-signer حساب in the transfer تعليمة. After the معاملة confirms, anyone can call `getSignaturesForAddress(reference)` to find the معاملة containing this reference. The merchant generates a unique reference keypair ل each payment request, encodes the public key in the URL, و then polls the Solana RPC to detect when a matching معاملة appears. Multiple references can be included by repeating the parameter: `reference=<key1>&reference=<key2>`. This is useful when multiple parties need to independently track the same payment.\n\nThe label parameter identifies the merchant or payment recipient. It appears in the محفظة's confirmation dialog so the user knows who they are paying. ل example, `label=Sunrise%20Coffee` tells the user they are paying \"Sunrise Coffee.\" The label must be URL-encoded — spaces become `%20`, ampersands become `%26`, و other special characters use standard percent-encoding. Keeping labels concise (under 50 characters) ensures they display properly across different محفظة implementations.\n\nThe message parameter provides additional context about the payment. It might include an order number, item description, or other merchant-specific information. Like the label, it must be URL-encoded. Example: `message=Order%20%23157%20-%202x%20Espresso`. Some محافظ display the message in a secondary line below the label, while others may truncate long messages. The memo parameter (not to be confused مع message) adds an on-chain memo تعليمة to the معاملة, creating a permanent on-chain record. Use message ل display purposes و memo ل data that must be recorded on-chain.\n\nThe complete flow works as follows: (1) the merchant generates a unique reference keypair, (2) constructs the Solana Pay URL مع all parameters, (3) encodes the URL into a QR code or deep link, (4) the customer scans/clicks و their محفظة parses the URL, (5) the محفظة constructs the transfer معاملة including the reference as a non-signer حساب, (6) the customer approves و the محفظة submits the معاملة, (7) the merchant polls `getSignaturesForAddress(reference)` until it finds the confirmed معاملة, (8) the merchant verifies the معاملة details match the expected payment.\n\n## Checklist\n- Validate recipient is a proper base58 public key (32-44 characters)\n- Use human-readable decimal amounts matching the token's precision\n- Generate a fresh reference keypair ل every payment request\n- URL-encode label و message مع encodeURIComponent\n- Include spl-token only when transferring SPL tokens, not native SOL\n\n## Red flags\n- Reusing the same reference across multiple payment requests\n- Providing amounts in raw lamports or smallest token units\n- Forgetting URL encoding on label or message (breaks parsing)\n- Not validating the recipient address format before URL construction\n",
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
                      "It is added as a non-signer حساب, allowing getSignaturesForAddress to find the معاملة",
                      "It creates a webhook that notifies the merchant",
                      "It stores the payment ID in the معاملة memo"
                    ],
                    "answerIndex": 0,
                    "explanation": "The reference public key is included as a non-signer حساب in the transfer تعليمة. The merchant polls getSignaturesForAddress(reference) to detect when the payment معاملة confirms."
                  },
                  {
                    "id": "solanapay-v2-l2-q2",
                    "prompt": "What amount value represents 2.5 USDC in a Solana Pay URL?",
                    "options": [
                      "amount=2.5 (human-readable decimal)",
                      "amount=2500000 (raw units مع 6 decimals)",
                      "amount=2500000000 (raw units مع 9 decimals)"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana Pay URLs use human-readable decimal amounts. The محفظة handles the conversion to raw units based on the token's decimal configuration."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-url-explorer": {
            "title": "URL builder: live preview of Solana Pay URLs",
            "content": "# URL builder: live preview of Solana Pay URLs\n\nBuilding Solana Pay URLs correctly requires understanding how each parameter contributes to the final encoded string. In this درس, we walk through the construction process step by step, examining how different combinations of parameters produce different URLs و how encoding rules affect the output.\n\nThe base URL always starts مع the `solana:` scheme followed by the recipient address. There are no slashes, no host, no path segments — just the scheme colon و the base58 address. ل example: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. This alone is a valid Solana Pay URL, though it lacks an amount و would prompt the محفظة to request the amount from the user.\n\nAdding query parameters transforms the base URL into a complete payment request. The first parameter is separated from the recipient by `?`, و subsequent parameters are separated by `&`. Parameter order does not affect validity, but convention places amount first ل readability. A SOL transfer ل 1.5 SOL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5`.\n\nAdding an SPL token changes the transfer type. Including `spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` tells the محفظة this is a USDC transfer, not a SOL transfer. The amount is still in human-readable form — `amount=10` means 10 USDC, not 10 raw units. The محفظة reads the mint's decimal configuration from the chain و converts accordingly.\n\nThe reference parameter enables payment detection. Each payment should include a unique reference public key. In practice, you generate a Keypair, extract its public key as a base58 string, و include it: `reference=Ref1111111111111111111111111111111111111111`. After the customer pays, you poll `getSignaturesForAddress` مع this reference to find the معاملة. Multiple references can be included ل multi-party tracking.\n\nURL encoding ل labels و messages follows standard percent-encoding rules. The JavaScript function `encodeURIComponent` handles this correctly. Spaces become `%20`, the hash symbol becomes `%23`, ampersands become `%26`, و so on. ل example, a label \"Joe's Coffee & Tea\" encodes to `label=Joe's%20Coffee%20%26%20Tea`. Failing to encode these characters breaks the URL parser — an unencoded `&` in a label would be interpreted as a parameter separator, splitting the label و creating an invalid parameter.\n\nLet us trace through a complete example. A coffee shop wants to charge 4.25 USDC ل order number 157. The shop's محفظة address is `7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. They generate a reference key `Ref1111111111111111111111111111111111111111`. The resulting URL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=4.25&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111&label=Sunrise%20Coffee&message=Order%20%23157`.\n\nValidation before encoding catches errors early. Before building the URL, verify: the recipient is a valid base58 string of 32-44 characters, the amount is a positive finite number, the spl-token (if provided) is a valid base58 string, و the reference (if provided) is a valid base58 string. Emitting clear error messages ل each validation failure helps developers debug integration issues quickly.\n\nEdge cases to handle: (1) amounts مع many decimal places — truncate to the token's decimal precision, (2) empty or whitespace-only labels — omit the parameter entirely rather than including an empty value, (3) extremely long messages — some محافظ truncate at 256 characters, (4) Unicode characters in labels — encodeURIComponent handles UTF-8 encoding correctly, but test مع your target محافظ.\n\n## Checklist\n- Start مع `solana:` followed immediately by the recipient address\n- Use `?` before the first parameter و `&` between subsequent ones\n- Apply encodeURIComponent to label و message values\n- Validate all base58 fields before building the URL\n- Test generated URLs مع multiple محفظة implementations\n\n## Red flags\n- Including raw unencoded special characters in labels or messages\n- Building URLs مع invalid or unvalidated recipient addresses\n- Using fixed reference keys instead of generating unique ones per payment\n- Omitting the spl-token parameter ل SPL token transfers\n",
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
                    "note": "SPL token transfer مع tracking reference"
                  },
                  {
                    "cmd": "Full payment URL with message",
                    "output": "solana:7Y4f...T6aY?amount=4.25&spl-token=EPjF...Dt1v&reference=Ref1...1111&label=Sunrise%20Coffee&message=Order%20%23157",
                    "note": "Complete POS payment request مع all fields"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-encode-transfer": {
            "title": "Challenge: Encode a Solana Pay transfer request URL",
            "content": "# Challenge: Encode a Solana Pay transfer request URL\n\nBuild a function that encodes a Solana Pay transfer request URL from input parameters:\n\n- Validate the recipient address (must be 32-44 characters of valid base58)\n- Validate the amount (must be a positive finite number)\n- Construct the URL مع the `solana:` scheme و query parameters\n- Apply encodeURIComponent to label و message fields\n- Include spl-token و reference only when provided\n- Return validation errors when inputs are invalid\n\nYour encoder must be fully deterministic — same input always produces the same URL.",
            "duration": "50 min",
            "hints": [
              "Solana Pay URL format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>",
              "Validate recipient: must be 32-44 characters of valid base58.",
              "Amount must be a positive finite number.",
              "Use encodeURIComponent ل label و message to handle special characters."
            ]
          }
        }
      },
      "solanapay-v2-implementation": {
        "title": "Tracking & Commerce",
        "description": "Reference tracking state machines, confirmation UX, failure handling, و deterministic POS receipt generation.",
        "lessons": {
          "solanapay-v2-reference-tracker": {
            "title": "Challenge: Track payment references through confirmation states",
            "content": "# Challenge: Track payment references through confirmation states\n\nBuild a reference tracking state machine that processes payment events:\n\n- States flow: pending -> found -> confirmed -> finalized (or pending -> expired)\n- The \"found\" event transitions from pending و records the معاملة signature\n- The \"confirmation\" event increments the confirmation counter و transitions from found to confirmed\n- The \"finalized\" event transitions from confirmed to finalized\n- The \"timeout_check\" event expires the reference if still pending after expiryTimeout seconds\n- Record every state transition in a history array مع from, to, و timestamp\n\nYour tracker must be fully deterministic — same event sequence always produces the same result.",
            "duration": "50 min",
            "hints": [
              "Track state transitions: pending -> found -> confirmed -> finalized.",
              "The 'found' event sets the signature. 'confirmation' increments the counter.",
              "Timeout check expires the reference if still pending after expiryTimeout seconds.",
              "Record each state change in the history array."
            ]
          },
          "solanapay-v2-confirmation-ux": {
            "title": "Confirmation UX: pending, confirmed, و expired states",
            "content": "# Confirmation UX: pending, confirmed, و expired states\n\nThe user experience during payment confirmation is the most critical moment in any Solana Pay integration. Between the customer scanning the QR code و the merchant acknowledging receipt, there is a window of uncertainty that must be managed مع clear visual feedback, appropriate timeouts, و graceful error handling. Getting this right determines whether customers trust your payment system.\n\nThe confirmation lifecycle follows a well-defined state machine. After the QR code is displayed, the system enters the **pending** state — waiting ل the customer to scan و submit the معاملة. The merchant's system continuously polls `getSignaturesForAddress(reference)` looking ل a matching معاملة. When a signature appears, the system transitions to the **found** state. The معاملة has been submitted but may not yet be confirmed. The system then calls `getTransaction(signature)` to verify the payment details (recipient, amount, token) match the expected values. Once the معاملة reaches sufficient confirmations, the state moves to **confirmed**. After the معاملة is finalized (maximum commitment level, irreversible), the state reaches **finalized** و the merchant can safely release goods or services.\n\nEach state requires distinct visual treatment. In the **pending** state, display the QR code prominently مع a scanning animation or subtle pulse effect. Show a countdown timer indicating how long the payment request remains valid (typically 2-5 minutes). Include the amount, token, و merchant name so the customer can verify before scanning. A \"Waiting ل payment...\" message مع a spinner keeps the customer informed.\n\nThe **found** state is brief but important. When the معاملة is detected, immediately replace the QR code مع a checkmark or success animation. Display \"Payment detected — confirming...\" to signal progress. This instant visual feedback is critical — customers need to know their payment was received even before it confirms. Show the معاملة signature (abbreviated, e.g., \"sig: abc1...xyz9\") ل reference. If you have a Solana Explorer link, provide it.\n\nThe **confirmed** state means the معاملة has at least one confirmation. ل low-value معاملات (coffee, small merchandise), this is sufficient to complete the sale. Display a prominent green checkmark, the confirmed amount, و the معاملة reference. Print or display a receipt. ل high-value معاملات, you may want to wait ل finalized status before releasing goods.\n\nThe **finalized** state is the strongest guarantee — the معاملة is part of a rooted slot و cannot be reverted. This takes roughly 6-12 seconds after initial confirmation. ل most point-of-sale applications, waiting ل finalized is unnecessary و adds friction. However, ل digital goods delivery, API key provisioning, or any irreversible fulfillment, finalized is the safe threshold.\n\nThe **expired** state handles the timeout case. If no matching معاملة appears within the expiry window (e.g., 120 seconds), the payment request expires. Display \"Payment request expired\" مع an option to generate a new QR code. Never silently expire — the customer may have just scanned و needs to know the request is no longer valid. The expiry timeout should be generous enough ل the customer to open their محفظة, review the معاملة, و approve it (60-120 seconds minimum).\n\nError states require careful messaging. \"معاملة not found after timeout\" suggests the customer did not complete the payment. \"معاملة found but details mismatch\" indicates a potential issue — the amount or recipient does not match expectations. \"Network error during polling\" should trigger automatic retries before displaying an error to the user. Always provide actionable next steps: \"Try again,\" \"Generate new QR,\" or \"Contact support.\"\n\nPolling strategy affects both UX responsiveness و RPC load. Start polling immediately after displaying the QR code. Use a 1-second interval ل the first 30 seconds (fast detection), then slow to 2-3 seconds ل the remainder of the window. After detecting the معاملة, switch to polling `getTransaction` مع increasing commitment levels: processed -> confirmed -> finalized. Use exponential backoff if the RPC returns errors.\n\nAccessibility considerations ل payment confirmation: (1) Do not rely solely on color to indicate state — use icons, text labels, و animations. (2) Provide audio feedback (a subtle chime on confirmation) ل environments where the screen may not be visible. (3) Ensure the QR code has sufficient contrast و size ل scanning from a reasonable distance (at least 300x300 pixels). (4) Support both light و dark themes ل the confirmation UI.\n\n## Checklist\n- Show distinct visual states: pending, found, confirmed, finalized, expired\n- Display a countdown timer during the pending state\n- Provide instant visual feedback when the معاملة is detected\n- Implement appropriate expiry timeouts (60-120 seconds)\n- Offer actionable next steps on expiry or error\n\n## Red flags\n- No visual feedback between QR display و confirmation\n- Silent expiry without notifying the customer\n- Waiting ل finalized on low-value point-of-sale معاملات\n- Polling too aggressively (every 100ms) و overloading the RPC\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l6-q1",
                    "prompt": "When is 'confirmed' commitment sufficient versus waiting ل 'finalized'?",
                    "options": [
                      "Confirmed is sufficient ل low-value POS معاملات; finalized is needed ل irreversible digital fulfillment",
                      "Always wait ل finalized regardless of معاملة value",
                      "Confirmed is never sufficient — always use finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "ل coffee-shop-scale payments, confirmed commitment provides a strong enough guarantee. Finalized adds 6-12 seconds of latency و is only necessary when fulfillment is irreversible."
                  },
                  {
                    "id": "solanapay-v2-l6-q2",
                    "prompt": "What should happen when the payment request expires?",
                    "options": [
                      "Display a clear expiry message مع an option to generate a new QR code",
                      "Silently restart the polling loop",
                      "Redirect the customer to a different payment method"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired requests should be clearly communicated. The customer may have been in the middle of approving — they need to know the request expired و can try again."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-error-handling": {
            "title": "Error handling و edge cases in payment flows",
            "content": "# Error handling و edge cases in payment flows\n\nProduction payment systems encounter a wide range of failure modes that must be handled gracefully. Solana Pay integrations face challenges unique to blockchain payments: network congestion, RPC failures, partial معاملة visibility, و edge cases around token حسابات. Building robust error handling separates demo-quality code from production-grade commerce systems.\n\nRPC connectivity failures are the most common operational issue. The merchant's polling loop depends on a reliable connection to a Solana RPC endpoint. When the RPC is unreachable (network outage, rate limiting, endpoint downtime), the polling loop must not crash or silently stop. Implement retry logic مع exponential backoff: first retry after 500ms, second after 1 second, third after 2 seconds, capping at 5 seconds between retries. After 5 consecutive failures, display a degraded-mode warning to the operator (\"Network connectivity issue — payment detection may be delayed\") while continuing to retry in the background. Never abandon polling due to transient RPC errors.\n\nRate limiting from RPC providers is a specific failure mode. Free-tier RPC endpoints (including the public Solana RPC) enforce request limits. A polling loop that fires every second generates 60+ requests per minute per active payment session. If you have 10 concurrent payment sessions, that is 600+ requests per minute. Solutions: use a dedicated RPC provider مع higher limits, batch reference checks where possible, implement client-side request deduplication, و cache negative results (reference not found) ل a short window before re-checking.\n\nمعاملة mismatch errors occur when a معاملة is found via the reference but its details do not match expectations. This can happen if: (1) someone accidentally or maliciously sent a معاملة that includes the reference key but مع wrong amounts, (2) the customer used a different محفظة that interpreted the URL differently, or (3) there is a bug in the URL encoding that produced incorrect parameters. When a mismatch is detected, log the full معاملة details ل debugging, display a clear error to the merchant (\"Payment detected but amount does not match — expected 10 USDC, received 5 USDC\"), و do not mark the payment as complete.\n\nInsufficient balance errors are caught by the customer's محفظة before submission, but the merchant has no visibility into this. From the merchant's perspective, it looks like the customer scanned the QR but never submitted the معاملة. The timeout/expiry mechanism handles this case — after the expiry window passes, offer to regenerate the QR code. Consider displaying a message like \"If you are having trouble, please ensure you have sufficient balance.\"\n\nAssociated token حساب (ATA) creation failures can occur when the customer's محفظة does not automatically create the recipient's ATA ل the SPL token being transferred. This is primarily a concern ل less common SPL tokens where the recipient may not have an existing ATA. Modern محافظ handle this by including a `createAssociatedTokenAccountIdempotent` تعليمة, but older محفظة versions may not. The merchant can mitigate this by pre-creating ATAs ل all tokens they accept.\n\nDouble-payment detection is essential. If the polling loop detects two معاملات مع the same reference, this indicates either a محفظة bug or a user submitting the payment twice. The system should only process the first valid معاملة و flag any subsequent ones ل manual review. Track processed references in a database to prevent duplicate fulfillment.\n\nNetwork congestion causes delayed معاملة confirmation. During high-traffic periods, معاملات may take 10-30 seconds to confirm instead of the usual 400ms-2 seconds. The payment UI should handle this gracefully: extend the visual \"confirming\" state, show a message like \"Network is busy — confirmation may take longer than usual,\" و never time out a معاملة that has been detected but not yet confirmed. The timeout should only apply to the initial pending state (waiting ل any معاملة to appear), not to the confirmation stage.\n\nPartial visibility is a subtle edge case. Due to RPC node propagation delays, one RPC node may see a معاملة while another does not. If your system uses multiple RPC endpoints (ل redundancy), you may detect a معاملة on one endpoint و fail to fetch its details from another. Solution: when a signature is found, retry `getTransaction` against the same endpoint that returned the signature, مع retries و backoff, before falling back to alternative endpoints.\n\nMemo و metadata validation should verify that any on-chain memo matches the expected payment metadata. If the merchant includes a `memo` parameter in the Solana Pay URL, the confirmed معاملة should contain a corresponding memo تعليمة. Mismatches may indicate URL tampering.\n\n## Checklist\n- Implement exponential backoff ل RPC failures (500ms, 1s, 2s, 5s cap)\n- Verify معاملة details match expected payment parameters\n- Handle double-payment detection مع reference deduplication\n- Distinguish between pending timeout و confirmation timeout\n- Pre-create ATAs ل all accepted SPL tokens\n\n## Red flags\n- Crashing the polling loop on a single RPC error\n- Marking payments complete without verifying amount و recipient\n- Not handling network congestion gracefully (premature timeout)\n- Ignoring double-payment scenarios\n",
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
                    "output": "TX1: sig aaa...111 (processed) | TX2: sig bbb...222 (DUPLICATE — flagged)\nOnly first valid معاملة fulfills the order",
                    "note": "Track processed references to prevent double fulfillment"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-pos-receipt": {
            "title": "Checkpoint: Generate a POS receipt",
            "content": "# Checkpoint: Generate a POS receipt\n\nBuild the final POS receipt generator that combines all دورة concepts:\n\n- Reconstruct the Solana Pay URL from payment data (recipient, amount, spl-token, reference, label)\n- Generate a deterministic receipt ID from the reference suffix و timestamp\n- Determine currency type: \"SPL\" if splToken is present, otherwise \"SOL\"\n- Include merchant name from the payment label\n- Include the tracking status from the reference tracker\n- Output must be stable JSON مع deterministic key ordering\n\nThis checkpoint validates your complete understanding of Solana Pay commerce integration.",
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
    "title": "محفظة UX Engineering",
    "description": "Master production محفظة UX engineering on Solana: deterministic connection state, network safety, RPC resilience, و measurable reliability patterns.",
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
        "description": "محفظة connection التصميم, network gating, و deterministic state-machine architecture ل predictable onboarding و reconnect paths.",
        "lessons": {
          "walletux-v2-connection-design": {
            "title": "Connection UX that doesn't suck: a التصميم checklist",
            "content": "# Connection UX that doesn't suck: a التصميم checklist\n\nمحفظة connection is the first interaction a user has مع any Solana dApp. If this experience is slow, confusing, or error-prone, most users will leave before they ever reach your core product. Connection UX deserves the same engineering rigor as any critical user flow, yet most teams treat it as an afterthought. This درس establishes the التصميم patterns, failure modes, و recovery strategies that separate professional محفظة integration from broken prototypes.\n\n## The connection lifecycle\n\nA محفظة connection progresses through a predictable sequence: idle (no محفظة detected), detecting (scanning ل installed adapters), ready (adapter found, user has not yet approved), connecting (approval dialog shown, waiting ل user action), connected (public key received, session active), و disconnected (user or app terminated the session). Each state must have a distinct visual representation so users always know what is happening و what they need to do next.\n\nAuto-connect is the single most impactful UX optimization. When a user has previously connected a specific محفظة, the dApp should attempt to reconnect silently on page load without showing a محفظة selection modal. The Solana محفظة adapter standard supports this via the `autoConnect` flag. However, auto-connect must be gated: only attempt it if the user previously granted permission (stored in localStorage), و set a timeout of 3-5 seconds. If auto-connect fails silently, fall back to showing the connect button without an error message. Users should never see an error ل a background reconnection attempt they did not initiate.\n\n## Loading states و skeleton UI\n\nDuring the connecting phase, display a skeleton version of the محفظة-dependent UI rather than a blank screen or spinner. If your app shows a token balance after connection, render a shimmer placeholder in that exact layout position. This technique, called \"optimistic layout reservation,\" prevents jarring content shifts when the connection resolves. The connect button itself should transition to a loading state (disabled, مع a subtle animation) to prevent double-click issues.\n\nConnection timeouts need explicit handling. If the محفظة adapter does not respond within 10 seconds, assume the user closed the approval dialog or the محفظة extension is unresponsive. Transition to an error state مع a clear message: \"Connection timed out. Please try again or check your محفظة extension.\" Never leave the UI in an indefinite loading state. Implement a deterministic timeout using setTimeout و clear it if the connection resolves.\n\n## Error recovery patterns\n\nConnection errors fall into three categories: user-rejected (the user clicked \"Cancel\" in the محفظة dialog), adapter errors (the محفظة extension crashed or is not installed), و network errors (the RPC endpoint is unreachable after connection). Each category requires a different recovery path.\n\nUser-rejected connections should return to the idle state quietly. Do not show an error toast or modal ل a deliberate user action. Simply reset the connect button to its default state. If you want to provide a nudge, a subtle inline message like \"Connect your محفظة to continue\" is sufficient.\n\nAdapter errors require actionable guidance. If no محفظة is detected, show a \"Get a محفظة\" link that opens the Phantom or Solflare installation page. If the adapter throws an unexpected error, display the error message مع a \"Try Again\" button. Log the error details to your analytics system ل debugging, but keep the user-facing message simple.\n\nNetwork errors after connection are particularly tricky because the محفظة is technically connected (you have the public key) but the app cannot fetch on-chain data. Display a degraded state: show the connected محفظة address مع a warning badge, disable معاملة buttons, و provide a \"Check Connection\" button that re-tests the RPC endpoint. Do not disconnect the محفظة just because the RPC is temporarily unreachable.\n\n## Multi-محفظة support\n\nModern Solana dApps must support multiple محفظة adapters. The محفظة selection modal should display installed محافظ prominently (مع a green \"Detected\" badge) و list popular uninstalled محافظ below مع \"Install\" links. Sort installed محافظ by most recently used. Remember the user's last محفظة choice و pre-select it on subsequent visits.\n\nWhen the user switches محافظ (disconnects one, connects another), all cached data tied to the previous محفظة address must be invalidated. Token balances, معاملة history, و program-derived حساب states are all محفظة-specific. Failing to clear this cache causes data leakage between حسابات, which is both a UX bug و a potential الامان issue.\n\n## The checklist\n\n- Implement auto-connect مع a 3-5 second timeout ل returning users\n- Show skeleton UI during the connecting phase to prevent layout shift\n- Set a 10-second hard timeout on connection attempts\n- Handle user-rejected connections silently (no error state)\n- Provide \"Get a محفظة\" links when no adapter is detected\n- Display degraded UI (not disconnect) when RPC fails post-connection\n- Invalidate all محفظة-specific caches on حساب switch\n- Remember the user's preferred محفظة adapter between sessions\n- Disable معاملة buttons during connecting و error states\n- Log connection errors to analytics ل monitoring adapter reliability\n\n## Reliability principle\n\nمحفظة UX is reliability UX. Users judge trust by whether connect, reconnect, و recovery behave predictably under stress, not by visual polish alone.\n",
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
                      "Redirect the user to a محفظة installation page"
                    ],
                    "answerIndex": 0,
                    "explanation": "Auto-connect is a background optimization. If it fails, the user never initiated the action, so showing an error would be confusing. Simply display the default connect button."
                  },
                  {
                    "id": "walletux-v2-l1-q2",
                    "prompt": "Why should you show skeleton UI during the connecting phase?",
                    "options": [
                      "It prevents layout shift و sets expectations ل where content will appear",
                      "It makes the page load faster",
                      "It is required by the Solana محفظة adapter standard"
                    ],
                    "answerIndex": 0,
                    "explanation": "Skeleton UI reserves the layout space ل محفظة-dependent content, preventing jarring shifts when the connection resolves و data loads."
                  }
                ]
              }
            ]
          },
          "walletux-v2-network-gating": {
            "title": "Network gating و wrong-network recovery",
            "content": "# Network gating و wrong-network recovery\n\nSolana has multiple clusters: mainnet-beta, devnet, testnet, و localnet. Unlike EVM chains where the محفظة controls the network و emits chain-change events, Solana's network selection is typically controlled by the dApp, not the محفظة. This architectural difference creates a unique set of UX challenges around network mismatch, gating, و recovery.\n\n## The network mismatch problem\n\nWhen a dApp targets mainnet-beta but a user's محفظة or the app's RPC endpoint points to devnet, معاملات will fail silently or produce confusing results. حساب addresses are the same across clusters, but حساب state differs entirely. A token حساب that holds 1000 USDC on mainnet might not exist on devnet. If your app fetches the balance from devnet while the user expects mainnet, they see zero balance و assume the app is broken or their funds are gone.\n\nNetwork mismatch is not always obvious. The محفظة might report a successful signature, but the معاملة was submitted to a different cluster than the one your app is reading from. This creates phantom معاملات: the user sees \"معاملة confirmed\" but no state change in the UI. Debugging this requires checking which cluster the معاملة was submitted to versus which cluster the app is polling.\n\n## Detecting the current network\n\nThe primary detection method is to check your RPC endpoint's genesis hash. Each Solana cluster has a unique genesis hash. Call `getGenesisHash()` on your connection و compare it to known values: mainnet-beta's genesis hash is `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`, devnet is `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`, و testnet is `4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY`. If the genesis hash does not match your expected cluster, the RPC endpoint is misconfigured.\n\nل محفظة-side detection, some محفظة adapters expose network information, but this is not standardized. The most reliable approach is to perform a lightweight RPC call (getGenesisHash or getEpochInfo) immediately after connection و compare the response against your expected cluster configuration.\n\n## Network gating patterns\n\nNetwork gating prevents users from performing actions on the wrong network. There are two levels of gating: soft gating و hard gating.\n\nSoft gating shows a warning banner but allows the user to continue. This is appropriate ل development tools, block explorers, و apps that intentionally support multiple clusters. The banner should clearly state the current network, use color coding (green ل mainnet, yellow ل devnet, red ل testnet/localnet), و be persistent (not dismissible) so the user always sees it.\n\nHard gating blocks all interactions until the network matches the expected cluster. This is appropriate ل production DeFi applications where operating on the wrong network could cause real financial loss. Hard gating should display a full-screen overlay or modal مع a clear message: \"This app requires Mainnet Beta. Your connection is currently pointing to Devnet.\" Include a button to switch the RPC endpoint if your app supports runtime endpoint switching.\n\n## Recovery strategies\n\nWhen a network mismatch is detected, the recovery flow depends on who controls the network selection. In most Solana dApps, the app controls the RPC endpoint, so recovery means updating the app's connection object to point to the correct cluster. This can be done automatically (if the correct endpoint is known) or manually (presenting the user مع a network selector).\n\nIf recovery requires the user to change their محفظة's network setting (less common on Solana but possible مع some محافظ), provide step-by-step تعليمات specific to the detected محفظة adapter. ل Phantom: \"Open Phantom > Settings > Developer Settings > Change Network.\" Include screenshots or a link to the محفظة's documentation.\n\nAfter network switching, all cached data must be invalidated. حساب states, token balances, معاملة history, و program-derived addresses may differ across clusters. Implement a `networkChanged` event handler that: clears all cached RPC responses, resets the connection state machine, re-fetches critical حساب data, و updates the UI to reflect the new network.\n\n## Multi-network development workflow\n\nل developers building on Solana, supporting seamless network switching during development is essential. Store the selected network in localStorage so it persists across page reloads. Provide a developer-only network switcher (hidden behind a feature flag or only visible in non-production builds) that allows quick toggling between mainnet, devnet, و localnet.\n\nWhen switching networks programmatically, create a new Connection object rather than mutating the existing one. This prevents race conditions where in-flight requests on the old network collide مع new requests on the new network. The connection switch should be atomic: update the connection reference, clear all caches, و trigger a full data refresh in a single synchronous operation.\n\n## Checklist\n- Check genesis hash immediately after RPC connection to verify the cluster\n- Use color-coded persistent banners to indicate the current network\n- Hard-gate production DeFi apps to the expected cluster\n- Invalidate all caches when the network changes\n- Create new Connection objects instead of mutating existing ones\n- Store network preference in localStorage ل persistence\n- Provide محفظة-specific تعليمات ل network switching\n\n## Red flags\n- Allowing معاملات on the wrong network without any warning\n- Caching data across network switches (stale cross-network data)\n- Mutating the Connection object during network switch (race conditions)\n- Assuming محفظة و dApp are always on the same cluster\n",
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
                      "Call getGenesisHash() و compare against known cluster genesis hashes",
                      "Check the URL string ل 'mainnet' or 'devnet'",
                      "Ask the محفظة adapter which network it is using"
                    ],
                    "answerIndex": 0,
                    "explanation": "Each Solana cluster has a unique genesis hash. Comparing the RPC's genesis hash against known values is the only reliable detection method, since URL strings can be misleading و محافظ don't always expose network info."
                  },
                  {
                    "id": "walletux-v2-l2-q2",
                    "prompt": "What must happen to cached data when the network changes?",
                    "options": [
                      "All cached data must be invalidated because حساب states differ across clusters",
                      "Only token balances need to be refreshed",
                      "Cached data can be retained since addresses are the same across clusters"
                    ],
                    "answerIndex": 0,
                    "explanation": "While حساب addresses are identical across clusters, the حساب states (balances, data, existence) are completely different. All cached RPC data must be cleared on network switch."
                  }
                ]
              }
            ]
          },
          "walletux-v2-state-explorer": {
            "title": "Connection state machine: states, events, و transitions",
            "content": "# Connection state machine: states, events, و transitions\n\nمحفظة connection logic in most dApps is implemented as a tangle of boolean flags, useEffect hooks, و conditional renders. This approach leads to impossible states (loading و error simultaneously), missed transitions (forgetting to clear the error when retrying), و race conditions (two connection attempts running in parallel). A finite state machine (FSM) eliminates these problems by making every possible state و transition explicit.\n\n## Why state machines ل محفظة connections\n\nA state machine defines a finite set of states, a finite set of events, و a deterministic transition function that maps (currentState, event) to nextState. At any point in time, the system is in exactly one state. This guarantees that impossible combinations (connected و disconnected) cannot occur. Every event is either handled by the current state or explicitly rejected, eliminating silent failures.\n\nل محفظة connections, the core states are: `disconnected` (no active session), `connecting` (waiting ل محفظة approval or RPC confirmation), `connected` (session active, public key available), و `error` (something went wrong). Each state maps to a specific UI presentation, specific allowed user actions, و specific side effects.\n\n## Defining the transition table\n\nThe transition table is the heart of the state machine. It specifies which events are valid in which states و what the resulting state should be:\n\n```\ndisconnected + CONNECT       → connecting\nconnecting   + CONNECTED     → connected\nconnecting   + CONNECTION_ERROR → error\nconnecting   + TIMEOUT       → error\nconnected    + DISCONNECT    → disconnected\nconnected    + NETWORK_CHANGE → connected (with updated network)\nconnected    + ACCOUNT_CHANGE → connected (with updated address)\nconnected    + CONNECTION_LOST → error\nerror        + RETRY         → connecting\nerror        + DISCONNECT    → disconnected\n```\n\nAny event not listed ل a given state is invalid. Invalid events should transition to the error state مع a descriptive message rather than being silently ignored. This makes debugging straightforward: every unexpected event is captured و logged.\n\n## Side effects و context\n\nState transitions carry context (also called \"extended state\" or \"context\"). The connection state machine tracks: `walletAddress` (set on CONNECTED و ACCOUNT_CHANGE events), `network` (set on CONNECTED و NETWORK_CHANGE events), `errorMessage` (set when entering the error state), و `transitions` (a log of all state transitions ل debugging).\n\nSide effects are actions triggered by transitions, not by states. ل example, the transition from `connecting` to `connected` should trigger: fetching the initial حساب balance, subscribing to حساب change notifications, و logging the connection event to analytics. The transition from `connected` to `disconnected` should trigger: clearing all cached data, unsubscribing from notifications, و resetting the UI to the idle layout.\n\n## Implementation patterns\n\nIn React applications, the state machine can be implemented using `useReducer` مع the transition table as the reducer logic. The reducer receives the current state و an event (action), looks up the transition in the table, و returns the new state مع updated context. This approach is testable (pure function), predictable (no side effects in the reducer), و composable (multiple components can read the state without duplicating logic).\n\nل more complex scenarios, libraries like XState provide first-class support ل statecharts (hierarchical state machines مع guards, actions, و services). XState's visualizer can render the state machine as a diagram, making it easy to verify that all states و transitions are covered. However, ل محفظة connection logic, a simple transition table in a useReducer is usually sufficient.\n\nThe transition history array is invaluable ل debugging. When a user reports a connection issue, the transition log shows exactly what happened: which events fired, in what order, و what states resulted. This is far more useful than a single boolean flag or an error message captured at an arbitrary point.\n\n## الاختبار state machines\n\nState machines are inherently testable because they are pure functions. Given a starting state و a sequence of events, the output is completely deterministic. Test cases should cover: the happy path (disconnected → connecting → connected), error recovery (connecting → error → retry → connecting → connected), حساب switching (connected → ACCOUNT_CHANGE → connected مع new address), و invalid events (connected + CONNECT should transition to error, not silently ignored).\n\nEdge cases to test: rapid event sequences (CONNECT followed immediately by DISCONNECT before the connection resolves), duplicate events (two CONNECTED events in a row), و state persistence (does the machine correctly restore state from localStorage on page reload?).\n\n## Checklist\n- Define all states explicitly: disconnected, connecting, connected, error\n- Map every valid (state, event) pair to a next state\n- Handle invalid events by transitioning to error مع a descriptive message\n- Track transition history ل debugging\n- Implement the state machine as a pure reducer function\n- Clear context data (محفظة address, network) on disconnect\n- Clear error message on retry\n",
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
                    "note": "محفظة approved, session active"
                  },
                  {
                    "cmd": "Event: ACCOUNT_CHANGE { walletAddress: '9pQR...' }",
                    "output": "connected → connected | address=9pQR... | network=mainnet-beta",
                    "note": "User switched حسابات, address updated, network retained"
                  },
                  {
                    "cmd": "Event: CONNECTION_LOST { message: 'WebSocket closed' }",
                    "output": "connected → error | errorMessage='WebSocket closed'",
                    "note": "Connection dropped, show error مع retry option"
                  },
                  {
                    "cmd": "Event: RETRY",
                    "output": "error → connecting | errorMessage=null",
                    "note": "User clicks retry, clear error و reconnect"
                  }
                ]
              }
            ]
          },
          "walletux-v2-connection-state": {
            "title": "Challenge: Implement محفظة connection state machine",
            "content": "# Challenge: Implement محفظة connection state machine\n\nBuild a deterministic state machine ل محفظة connection management:\n\n- States: disconnected, connecting, connected, error\n- Process a sequence of events و track all state transitions\n- CONNECTED و ACCOUNT_CHANGE events carry a walletAddress; CONNECTED و NETWORK_CHANGE carry a network\n- Error state stores the error message; disconnected clears all session data\n- Invalid events force transition to error state مع a descriptive message\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "50 min",
            "hints": [
              "Define a TRANSITIONS map: each state maps event types to next states.",
              "CONNECTED و ACCOUNT_CHANGE events carry walletAddress. CONNECTED و NETWORK_CHANGE carry network.",
              "Error state stores the error message. Disconnected clears all session data.",
              "Invalid events force transition to error state مع descriptive message."
            ]
          }
        }
      },
      "walletux-v2-production": {
        "title": "Production Patterns",
        "description": "Cache invalidation, RPC resilience و health monitoring, و measurable محفظة UX quality reporting ل production operations.",
        "lessons": {
          "walletux-v2-cache-invalidation": {
            "title": "Challenge: Cache invalidation on محفظة events",
            "content": "# Challenge: Cache invalidation on محفظة events\n\nBuild a cache invalidation engine that processes محفظة events و invalidates the correct cache entries:\n\n- Cache entries have tags: \"حساب\" (محفظة-specific data), \"network\" (cluster-specific data), \"global\" (persists across everything)\n- ACCOUNT_CHANGE invalidates all entries tagged \"حساب\"\n- NETWORK_CHANGE invalidates entries tagged \"network\" و \"حساب\" (network change means all حساب data is stale)\n- DISCONNECT invalidates all non-\"global\" entries\n- Track per-event invalidation counts in an event log\n- Return the final cache state, total invalidated count, و retained count\n\nThe invalidation logic must be deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "ACCOUNT_CHANGE invalidates entries tagged 'حساب'.",
              "NETWORK_CHANGE invalidates both 'network' و 'حساب' tagged entries.",
              "DISCONNECT invalidates all non-'global' entries.",
              "Track invalidation counts per event in the event log."
            ]
          },
          "walletux-v2-rpc-caching": {
            "title": "RPC reads و caching strategy ل محفظة apps",
            "content": "# RPC reads و caching strategy ل محفظة apps\n\nEvery interaction in a Solana محفظة application ultimately depends on RPC calls: fetching balances, loading token حسابات, reading program state, و confirming معاملات. Without a caching strategy, your app hammers the RPC endpoint مع redundant requests, drains rate limits, و delivers a sluggish user experience. A well-designed cache layer transforms محفظة apps from painfully slow to instantly responsive while keeping data fresh enough ل financial accuracy.\n\n## The RPC cost problem\n\nSolana RPC calls are not free. Public endpoints like those provided by Solana Foundation have aggressive rate limits (typically 40 requests per 10 seconds ل free tiers). Premium providers (Helius, QuickNode, Triton) charge per request or by compute units consumed. A naive محفظة app that re-fetches every piece of data on every render can easily exceed 100 requests per minute ل a single user. Multiply by thousands of concurrent users و costs become significant.\n\nBeyond cost, latency kills UX. A `getTokenAccountsByOwner` call takes 200-800ms depending on the endpoint و حساب complexity. If the user switches tabs و returns, re-fetching everything from scratch creates a noticeable loading delay. Caching eliminates this delay ل data that has not changed.\n\n## Cache taxonomy\n\nNot all RPC data has the same freshness requirements. Categorize cache entries by their volatility:\n\n**Immutable data** (cache indefinitely): mint metadata (name, symbol, decimals, logo URI), program حساب structures, و historical معاملة details. Once fetched, this data never changes. Store it in an in-memory Map مع no expiration.\n\n**Semi-stable data** (cache ل 30-60 seconds): token balances, staking positions, الحوكمة votes, و NFT ownership. This data changes infrequently ل most users. A 30-second TTL (time to live) provides a good balance between freshness و efficiency. Use a cache key that includes the محفظة address و network to prevent cross-حساب contamination.\n\n**Volatile data** (cache ل 5-10 seconds or not at all): recent معاملة confirmations, real-time price feeds, و active swap quotes. This data changes constantly و becomes stale quickly. Short TTLs or no caching at all is appropriate. ل معاملة confirmations, use WebSocket subscriptions instead of polling.\n\n## Cache key التصميم\n\nCache keys must uniquely identify the request parameters و the context. A good cache key ل a balance query includes: the RPC method name, the حساب address, the commitment level, و the network cluster. ل example: `getBalance:7xKXp...abc:confirmed:mainnet-beta`. Including the network in the key prevents a critical bug: returning devnet data when the user has switched to mainnet.\n\nل `getTokenAccountsByOwner`, the key should include the owner address و the program filter (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID). Different token programs return different حساب sets, و caching them under the same key returns incorrect results.\n\n## Invalidation triggers\n\nCache invalidation is triggered by three محفظة events: حساب change, network change, و disconnect. These events were covered in the previous challenge, but the caching layer adds nuance.\n\nحساب change invalidates all entries keyed by the محفظة address. Token balances, معاملة history, و program-derived حساب states are all محفظة-specific. Global data (mint metadata, program IDL) survives an حساب change.\n\nNetwork change invalidates everything except truly global, network-independent data (UI preferences, theme settings). Even mint metadata should be invalidated because a mint address might exist on mainnet but not on devnet, or have different state.\n\nUser-initiated refresh is the escape hatch. Provide a \"Refresh\" button that clears the entire cache و re-fetches all visible data. Users expect this when they know an external action (a transfer from another device) has changed their state but the cache has not expired yet.\n\n## Stale-while-revalidate pattern\n\nThe most effective caching strategy ل محفظة apps is stale-while-revalidate (SWR). When a cache entry is requested: if fresh (within TTL), return it immediately. If stale (past TTL but within a grace period, e.g., 2x TTL), return the stale value immediately و trigger a background re-fetch. When the re-fetch completes, update the cache و notify the UI. If expired (past grace period), block و re-fetch before returning.\n\nThis pattern ensures the UI always responds instantly مع the best available data while keeping it fresh in the background. Libraries like SWR (ل React) و TanStack Query implement this pattern out of the box مع configurable TTL, grace periods, و background refetch intervals.\n\n## Checklist\n- Categorize RPC data by volatility: immutable, semi-stable, volatile\n- Include محفظة address و network in all cache keys\n- Invalidate حساب-tagged caches on محفظة switch\n- Invalidate all non-global caches on network switch\n- Implement stale-while-revalidate ل semi-stable data\n- Provide a manual refresh button as an escape hatch\n- Monitor cache hit rates to validate your TTL configuration\n\n## Red flags\n- Caching without network in the key (cross-network data leakage)\n- Not invalidating on حساب switch (showing previous محفظة's data)\n- Setting TTLs too long ل financial data (stale balance display)\n- Re-fetching everything on every render (defeats the purpose of caching)\n",
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
                      "حساب states differ across clusters, so cached devnet data would be wrong ل mainnet",
                      "Cache keys must be globally unique ل الاداء",
                      "The Solana RPC protocol requires cluster identification"
                    ],
                    "answerIndex": 0,
                    "explanation": "The same حساب address can have completely different state on mainnet vs devnet. Without the network in the key, switching clusters would return stale data from the previous cluster."
                  },
                  {
                    "id": "walletux-v2-l6-q2",
                    "prompt": "What does the stale-while-revalidate pattern do when a cache entry is past its TTL?",
                    "options": [
                      "Returns the stale value immediately و triggers a background re-fetch",
                      "Blocks until fresh data is fetched from the RPC",
                      "Deletes the stale entry و returns null"
                    ],
                    "answerIndex": 0,
                    "explanation": "SWR prioritizes responsiveness by serving stale data instantly while refreshing in the background. This eliminates loading states ل data that has only slightly exceeded its TTL."
                  }
                ]
              }
            ]
          },
          "walletux-v2-rpc-health": {
            "title": "RPC health monitoring و graceful degradation",
            "content": "# RPC health monitoring و graceful degradation\n\nRPC endpoints are the lifeline of every Solana محفظة application. When they go down, become slow, or return stale data, your app becomes unusable. Production محفظة apps must continuously monitor RPC health و degrade gracefully when issues are detected, rather than showing cryptic errors or silently displaying stale data. This درس covers the engineering patterns ل building resilient RPC connectivity.\n\n## Why RPC endpoints fail\n\nSolana RPC endpoints experience several failure modes. Rate limiting is the most common: free-tier endpoints enforce strict per-IP و per-second limits, و exceeding them results in HTTP 429 responses. Latency spikes occur during high network activity (NFT mints, token launches) when مدققون are under heavy load و RPC nodes queue requests. Stale data happens when an RPC node falls behind the cluster's tip slot, returning حساب states that are several slots (or seconds) old. Complete outages, while rare ل premium providers, do happen و can last minutes to hours.\n\nEach failure mode requires a different response. Rate limiting needs request throttling و backoff. Latency spikes need timeout management و user communication. Stale data needs detection و provider rotation. Complete outages need failover to a backup endpoint.\n\n## Health check implementation\n\nImplement a periodic health check that runs every 15-30 seconds while the app is active. The health check should measure three metrics: latency (round-trip time ل a `getSlot` call), freshness (compare the returned slot against the expected tip slot from a secondary source or the previous check), و error rate (percentage of failed requests in the last N calls).\n\nA healthy endpoint has latency under 500ms, slot freshness within 5 slots of the expected tip, و an error rate below 5%. An unhealthy endpoint has latency over 2000ms, slot freshness more than 50 slots behind, or an error rate above 20%. The متوسط range (degraded) triggers warnings without failover.\n\nStore health check results in a rolling window (last 10-20 checks). A single slow response should not trigger failover, but 3 consecutive slow responses should. This smoothing prevents flapping between endpoints due to transient network issues.\n\n## Failover strategies\n\nPrimary-secondary failover is the simplest pattern. Configure a primary RPC endpoint (your preferred provider) و one or more secondaries (different providers ل diversity). When the primary becomes unhealthy, route all requests to the secondary. Periodically re-check the primary (every 60 seconds) و switch back when it recovers. This prevents all your traffic from permanently migrating to the secondary.\n\nRound-robin مع health weighting distributes requests across multiple endpoints based on their current health scores. A healthy endpoint gets a weight of 1.0, a degraded endpoint gets 0.3, و an unhealthy endpoint gets 0.0. This approach provides better throughput than single-endpoint strategies و automatically adapts to changing conditions.\n\nل critical معاملات (swaps, transfers), always use the endpoint مع the lowest latency و highest freshness. معاملة submission is latency-sensitive: a stale blockhash from a behind-the-tip node will cause the معاملة to be rejected. ل read operations (balance queries), slightly stale data is acceptable if it means faster responses.\n\n## Graceful degradation in the UI\n\nWhen RPC health degrades, the UI should communicate the situation clearly without panic. Display a small status indicator (green dot, yellow dot, red dot) near the network name or in the status bar. Clicking it should show detailed health information: current latency, last successful request time, و the number of failed requests.\n\nDuring degraded mode, disable or add warnings to معاملة buttons. A yellow warning like \"Network may be slow — معاملات might take longer than usual\" is better than letting users submit معاملات that will likely time out. During a full outage, disable all معاملة features و show a clear message: \"Unable to reach the Solana network. Your funds are safe. We'll reconnect automatically.\"\n\nNever hide the degradation. Users who submit معاملات during an outage و see \"معاملة failed\" without explanation will assume their funds are at risk. Proactive communication (\"The network is experiencing delays\") builds trust even when the experience is suboptimal.\n\n## Request retry و throttling\n\nWhen an RPC request fails, classify the error before deciding whether to retry. HTTP 429 (rate limited): back off exponentially starting at 1 second, retry up to 3 times. HTTP 5xx (server error): retry once after 2 seconds, then failover to secondary endpoint. Network timeout: retry once مع a shorter timeout (the request may have succeeded but the response was lost), then failover. HTTP 4xx (client error): do not retry, the request is malformed.\n\nImplement a request queue مع concurrency limits. Most RPC providers allow 10-40 concurrent requests. If your app tries to fire 50 requests simultaneously (common during initial data loading), queue the excess و process them as earlier requests complete. This prevents self-inflicted rate limiting.\n\nDebounce user-triggered requests. If the user rapidly clicks \"Refresh\" or types in a search field that triggers RPC lookups, debounce the requests to at most one per 500ms. This is simple to implement و dramatically reduces unnecessary RPC traffic.\n\n## Monitoring و alerting\n\nLog all RPC metrics to your observability system: request count, error count, latency percentiles (p50, p95, p99), و cache hit rate. Set alerts ل: error rate exceeding 10% over 5 minutes, p95 latency exceeding 3 seconds, و cache hit rate dropping below 50% (indicates a cache invalidation bug or a change in access patterns).\n\nTrack per-endpoint metrics separately. If your primary endpoint's error rate spikes while the secondary is healthy, the failover logic should handle it automatically. But if both endpoints degrade simultaneously, it likely indicates a Solana network-wide issue rather than a provider problem, و the alerting should reflect that distinction.\n\n## Checklist\n- Run health checks every 15-30 seconds measuring latency, freshness, و error rate\n- Implement primary-secondary failover مع automatic recovery\n- Display RPC health status in the UI (green/yellow/red indicator)\n- Disable معاملة features during outages مع clear messaging\n- Classify errors before retrying (429 vs 5xx vs 4xx)\n- Implement request queue مع concurrency limits\n- Debounce user-triggered RPC requests\n- Monitor و alert on error rate, latency, و cache hit rate\n\n## Red flags\n- No failover endpoints (single point of failure)\n- Retrying 4xx errors (wastes requests on malformed input)\n- Hiding RPC failures from the user (builds distrust)\n- No concurrency limits (self-inflicted rate limiting)\n",
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
            "title": "Checkpoint: Generate a محفظة UX Report",
            "content": "# Checkpoint: Generate a محفظة UX Report\n\nBuild the final محفظة UX quality report that combines all دورة concepts:\n\n- Count connection attempts (CONNECT events) و successful connections (CONNECTED events)\n- Calculate success rate as a percentage مع 2 decimal places\n- Compute average connection time from CONNECTED events' durationMs\n- Count ACCOUNT_CHANGE و NETWORK_CHANGE events\n- Calculate cache hit rate from cacheStats (hits / total * 100, 2 decimal places)\n- Calculate RPC health score from rpcChecks (healthy / total * 100, 2 decimal places)\n- Include the timestamp from input\n\nThis checkpoint validates your complete understanding of محفظة UX engineering.",
            "duration": "55 min",
            "hints": [
              "Count CONNECT events ل attempts, CONNECTED ل successes.",
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
    "title": "Sign-In مع Solana",
    "description": "Master production SIWS authentication on Solana: standardized inputs, strict verification invariants, replay-resistant nonce lifecycle, و audit-ready reporting.",
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
        "description": "SIWS rationale, strict input-field semantics, محفظة rendering behavior, و deterministic sign-in input construction.",
        "lessons": {
          "siws-v2-why-exists": {
            "title": "Why SIWS exists: replacing connect-و-signMessage",
            "content": "# Why SIWS exists: replacing connect-و-signMessage\n\nBefore Sign-In مع Solana (SIWS) became a standard, dApps authenticated محفظة holders using a two-step pattern: connect the محفظة, then call `signMessage` مع an arbitrary string. The user would see a raw byte blob in their محفظة's approval screen, sign it, و the server would verify the signature against the expected public key. This worked, but it was fragile, inconsistent, و dangerous.\n\n## The problems مع raw signMessage\n\nThe fundamental issue مع raw `signMessage` authentication is that محافظ cannot distinguish between a benign sign-in request و a malicious payload. When a محفظة displays \"Sign this message: 0x48656c6c6f\" or even a human-readable string like \"Please sign in to example.com at 2024-01-15T10:30:00Z,\" the محفظة has no structured way to parse, validate, or warn about the content. The user must trust that the dApp is honest about what it is asking them to sign.\n\nThis creates several attack vectors. A malicious dApp could present a sign-in prompt that actually contains a serialized معاملة. If the محفظة treats `signMessage` payloads as opaque bytes (which most do), the user signs what they believe is a login but is actually an authorization ل a token transfer. Even without outright fraud, the lack of structure means different dApps format their sign-in messages differently. Users see inconsistent approval screens across applications, eroding trust و making it harder to identify legitimate requests.\n\nReplay attacks are another critical weakness. If a dApp asks the user to sign \"Log in to example.com\" without a nonce or timestamp, the resulting signature is valid forever. An attacker who intercepts this signature (via a compromised server log, a man-in-the-middle proxy, or a leaked database) can replay it indefinitely to impersonate the user. Adding a nonce or timestamp to the message helps, but without a standard format, each dApp implements its own scheme — some correctly, many not.\n\n## What SIWS standardizes\n\nSign-In مع Solana defines a structured message format that محافظ can parse, validate, و display in a human-readable, predictable way. The SIWS standard specifies exactly which fields a sign-in request must contain و how محافظ should render them. This moves authentication from an opaque byte-signing operation to a semantically meaningful, محفظة-aware protocol.\n\nThe core fields of a SIWS sign-in input are: **domain** (the requesting site's origin, displayed prominently by the محفظة), **address** (the expected signer's public key), **nonce** (a unique, server-generated value that prevents replay attacks), **issuedAt** (ISO 8601 timestamp marking when the request was created), **expirationTime** (optional deadline after which the sign-in is invalid), **statement** (human-readable description of what the user is approving), **chainId** (the Solana cluster, e.g., mainnet-beta), و **resources** (optional URIs that the sign-in grants access to).\n\nWhen a محفظة receives a SIWS request, it knows the structure. It can display the domain prominently so the user can verify they are signing in to the correct site. It can show the expiration time so the user knows the request is time-limited. It can warn if the domain in the request does not match the domain the محفظة was connected from. This structured rendering is a massive UX improvement over displaying raw bytes.\n\n## UX improvements ل end users\n\nمع SIWS, محفظة approval screens become consistent و informative. Instead of seeing an arbitrary string, users see a formatted display: the requesting domain, the statement explaining the action, the nonce (often hidden from the user but validated by the محفظة), و time bounds. This consistency across dApps builds user confidence — they تعلم to recognize what a legitimate sign-in request looks like.\n\nمحافظ can also implement automatic safety checks. If the domain in the SIWS input does not match the origin of the connecting dApp, the محفظة can show a warning or block the request entirely. If the issuedAt timestamp is far in the past or the expirationTime has already passed, the محفظة can reject the request before the user even sees it. These checks are impossible مع raw `signMessage` because the محفظة has no way to parse the content.\n\n## Server-side benefits\n\nل backend developers, SIWS provides a predictable verification flow. The server generates a nonce, sends the SIWS input to the client, receives the signed output, و verifies: (1) the signature is valid ل the claimed address, (2) the domain matches the server's domain, (3) the nonce matches the one the server issued, (4) the timestamps are within acceptable bounds, و (5) the address matches the expected signer. Each check is explicit و auditable, unlike ad-hoc string parsing.\n\nThe nonce mechanism is particularly important. The server stores issued nonces (in memory, Redis, or a database) و marks them as consumed after successful verification. Any attempt to reuse a nonce is rejected as a replay attack. This provides cryptographic proof of freshness that raw signMessage authentication lacks unless the developer explicitly implements it — و history shows most developers do not.\n\n## The path forward\n\nSIWS aligns Solana's authentication story مع Ethereum's Sign-In مع Ethereum (SIWE / EIP-4361) و other chain-specific standards. Cross-chain dApps can implement a unified authentication flow مع chain-specific signing backends. The محفظة-side rendering, nonce management, و verification logic are consistent patterns regardless of the underlying blockchain.\n\n## Operator mindset\n\nTreat SIWS as a protocol contract, not a UI prompt. If nonce lifecycle, domain checks, و time bounds are not enforced as strict invariants, authentication becomes signature theater.\n\n## Checklist\n- Understand why raw signMessage is insufficient ل authentication\n- Know the core SIWS fields: domain, address, nonce, issuedAt, expirationTime, statement\n- Recognize that SIWS enables محفظة-side validation و consistent UX\n- Understand the server-side nonce flow: generate, issue, verify, consume\n\n## Red flags\n- Using raw signMessage ل authentication without structured format\n- Omitting nonce from sign-in messages (enables replay attacks)\n- Not validating domain match between SIWS input و connecting origin\n- Allowing sign-in messages without expiration times\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l1-q1",
                    "prompt": "What is the primary الامان problem مع using raw signMessage ل authentication?",
                    "options": [
                      "محافظ cannot distinguish sign-in requests from malicious payloads",
                      "signMessage is too slow ل production use",
                      "signMessage does not produce valid Ed25519 signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without structured format, محافظ treat signMessage payloads as opaque bytes و cannot validate or warn about the content, making it easy ل malicious dApps to disguise harmful payloads as sign-in requests."
                  },
                  {
                    "id": "siws-v2-l1-q2",
                    "prompt": "How does SIWS prevent replay attacks?",
                    "options": [
                      "By requiring a unique, server-generated nonce that is consumed after verification",
                      "By encrypting the signed message مع AES-256",
                      "By requiring the user to sign twice مع different keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "The server generates a unique nonce ل each sign-in attempt. After successful verification, the nonce is marked as consumed. Any reuse of the same nonce is rejected as a replay attack."
                  }
                ]
              }
            ]
          },
          "siws-v2-input-fields": {
            "title": "SIWS input fields و الامان rules",
            "content": "# SIWS input fields و الامان rules\n\nThe Sign-In مع Solana input is a structured object that defines every parameter of an authentication request. Each field has specific validation rules, الامان implications, و rendering expectations. Understanding every field deeply is essential ل building a correct و secure SIWS implementation.\n\n## domain\n\nThe `domain` field identifies the requesting application. It must be a valid domain name without protocol prefix — \"example.com\", not \"https://example.com\". The domain serves as the primary trust anchor: when the محفظة displays the sign-in request, the domain is shown prominently so the user can verify they are interacting مع the intended site.\n\nالامان rule: the server must verify that the domain in the signed output matches its own domain exactly. If a user signs a SIWS message ل \"evil.com\" و submits it to \"example.com\", the server must reject it. The domain check prevents cross-site authentication relay attacks where an attacker presents their own domain to the user but submits the signed result to a different server. Domain validation should be case-insensitive (domains are case-insensitive per RFC 4343) و must reject domains containing protocol prefixes, paths, ports, or query strings.\n\n## address\n\nThe `address` field contains the Solana public key (base58-encoded) of the محفظة that will sign the request. On Solana, public keys are 32 bytes encoded in base58, resulting in strings of 32-44 characters. The address must match the actual signer of the SIWS output — if the address in the input says \"Wallet111\" but \"Wallet222\" actually signs the message, verification must fail.\n\nالامان rule: always validate address format before sending the request to the محفظة. A malformed address will cause downstream verification failures. Check that the address is 32-44 characters long و consists only of valid base58 characters (no 0, O, I, or l — these are excluded from base58 to avoid visual ambiguity). On the server side, verify that the address in the signed output matches the address you expected (typically the address of the connected محفظة).\n\n## nonce\n\nThe `nonce` is the single most important الامان field in SIWS. It is a server-generated, unique, unpredictable string that ties the sign-in request to a specific authentication attempt. The nonce must be at least 8 characters long و should be alphanumeric. In production, nonces are typically 16-32 character random strings generated using a cryptographically secure random number generator.\n\nالامان rule: nonces must be generated server-side, never client-side. If the client generates its own nonce, an attacker can reuse a previously valid nonce-signature pair. The server must store the nonce (مع a TTL matching the sign-in expiration window) و check it during verification. After successful verification, the nonce must be permanently invalidated (deleted or marked as consumed). The nonce storage must be atomic — a race condition where two requests verify the same nonce simultaneously would defeat the replay protection entirely.\n\nNonce storage options include: in-memory maps (suitable ل single-server deployments), Redis مع TTL (suitable ل distributed systems), و database tables مع unique constraints. Whatever storage is used, the invalidation must be atomic: check-و-delete in a single operation, not check-then-delete in two steps.\n\n## issuedAt\n\nThe `issuedAt` field is an ISO 8601 timestamp indicating when the sign-in request was created. It provides temporal context ل the authentication attempt. The server sets this value when generating the sign-in input.\n\nالامان rule: during verification, the server must check that `issuedAt` is not in the future (allowing a small clock skew tolerance of 1-2 minutes). A sign-in request مع a future issuedAt timestamp is suspicious — it may indicate clock manipulation or request fabrication. The server should also reject sign-in requests where issuedAt is too far in the past, even if the expirationTime has not passed. A reasonable maximum age ل issuedAt is 10-15 minutes.\n\n## expirationTime\n\nThe `expirationTime` field is an optional ISO 8601 timestamp indicating when the sign-in request becomes invalid. If present, it must be strictly after `issuedAt`. If absent, the sign-in request has no explicit expiration (though the server should still enforce a maximum age based on issuedAt).\n\nالامان rule: if expirationTime is present, the server must verify that the current time is before the expiration. Expired sign-in requests must be rejected regardless of signature validity. Setting short expiration windows (5-15 minutes) reduces the window ل replay attacks و limits the useful lifetime of intercepted sign-in requests. Production systems should always set expirationTime rather than relying solely on nonce expiration.\n\n## statement\n\nThe `statement` field is a human-readable string that the محفظة displays to the user, describing what they are approving. If not provided by the dApp, a sensible default is \"Sign in to <domain>\". The statement should be concise, clear, و accurately describe the action.\n\nالامان rule: the statement is informational و should not contain sensitive data. It is included in the signed message, so it is visible to anyone who can see the signature. Do not include session tokens, API keys, or other secrets in the statement. The محفظة renders the statement as-is, so avoid HTML, markdown, or other formatting that might be misinterpreted.\n\n## chainId و resources\n\nThe `chainId` field identifies the Solana cluster (e.g., \"mainnet-beta\", \"devnet\", \"testnet\"). This prevents cross-cluster authentication where a signature obtained on devnet is replayed on mainnet. The `resources` field is an optional array of URIs that the sign-in grants access to. These are informational و displayed by the محفظة.\n\nالامان rule: if your dApp operates on a specific cluster, verify that the chainId in the signed output matches your expected cluster. Resources should be validated as well-formed URIs but their enforcement is application-specific.\n\n## Checklist\n- Domain must not include protocol, path, or port\n- Nonce must be >= 8 alphanumeric characters, generated server-side\n- issuedAt must not be in the future; reject stale requests\n- expirationTime (if present) must be after issuedAt و not yet passed\n- Address must be 32-44 characters of valid base58\n- Statement should default to \"Sign in to <domain>\" if not provided\n\n## Red flags\n- Accepting client-generated nonces\n- Not validating domain format (allowing protocol prefixes)\n- Missing atomic nonce invalidation (check-then-delete race condition)\n- No maximum age check on issuedAt\n- Storing secrets in the statement field\n",
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
                      "محافظ cannot sign messages containing client-generated nonces"
                    ],
                    "answerIndex": 0,
                    "explanation": "If the client generates nonces, an attacker can replay a previously captured nonce-signature pair. Server-generated nonces ensure each authentication attempt is unique و controlled by the server."
                  },
                  {
                    "id": "siws-v2-l2-q2",
                    "prompt": "What format must the domain field use?",
                    "options": [
                      "Plain domain name without protocol prefix (e.g., example.com)",
                      "Full URL مع protocol (e.g., https://example.com)",
                      "IP address مع port number"
                    ],
                    "answerIndex": 0,
                    "explanation": "The domain field must be a plain domain name. Protocol prefixes, paths, ports, و query strings must be rejected to ensure consistent domain matching."
                  }
                ]
              }
            ]
          },
          "siws-v2-message-preview": {
            "title": "Message preview: how محافظ render SIWS requests",
            "content": "# Message preview: how محافظ render SIWS requests\n\nWhen a dApp sends a SIWS sign-in request to a محفظة, the محفظة transforms the structured input into a human-readable message that the user sees on the approval screen. Understanding exactly how this rendering works is critical ل dApp developers — it determines what users see, what they trust, و what they sign.\n\n## The SIWS message format\n\nThe SIWS standard defines a specific text format ل the message that gets signed. The محفظة constructs this message from the structured input fields. The format follows a predictable template that محافظ can both generate و parse. The message begins مع the domain و address, followed by a statement, then a structured block of metadata fields.\n\nA complete SIWS message looks like this:\n\n```\nexample.com wants you to sign in with your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z\nChain ID: mainnet-beta\n```\n\nThe first line always follows the pattern: \"`<domain>` wants you to sign in مع your Solana حساب:\". This phrasing is standardized so users تعلم to recognize it across all SIWS-compatible dApps. The second line is the full public key address. A blank line separates the header from the statement. Another blank line separates the statement from the metadata fields.\n\n## محفظة rendering expectations\n\nModern Solana محافظ (Phantom, Solflare, Backpack) recognize SIWS-formatted messages و render them مع enhanced UI. Instead of displaying raw text, they parse the structured fields و present them in a formatted approval screen مع clear sections.\n\nThe domain is typically displayed prominently at the top of the approval screen, often مع the dApp's favicon if available. This is the primary trust signal — users should check this domain matches the site they are interacting مع. Some محافظ cross-reference the domain against the connecting origin و display a warning if they do not match.\n\nThe statement is shown in a distinct section, often مع larger or bolder text. This is the human-readable explanation of what the user is approving. ل sign-in requests, it typically says something like \"Sign in to example.com\" or a custom message the dApp provides.\n\nThe metadata fields (nonce, issuedAt, expirationTime, chainId, resources) are shown in a structured format, often collapsible or in a \"details\" section. Most users do not read these fields, but their presence signals that the request is well-formed و follows the standard. الامان-conscious users can verify the nonce matches their expectation و the timestamps are reasonable.\n\n## What users actually see versus what gets signed\n\nIt is important to understand that what the محفظة displays و what actually gets signed can differ. The محفظة renders a formatted UI from the parsed fields, but the actual bytes that are signed are the serialized message text in the standard format. The محفظة constructs the canonical message text, displays a parsed version to the user, و signs the canonical text.\n\nThis creates a trust model: the user trusts the محفظة to accurately represent the message content. If a محفظة has a rendering bug (e.g., it shows the wrong domain), the user might approve a message they would otherwise reject. This is why using well-audited, mainstream محافظ is important ل SIWS الامان.\n\nThe signed bytes include the full message text prefixed مع a Solana-specific preamble. The Ed25519 signature covers the entire message, including all fields. Changing any field (even adding a space) produces a completely different signature. This ensures that the server can verify not just that the user signed something, but that they signed the exact message مع the exact fields the server expected.\n\n## Building preview UIs in dApps\n\nBefore sending a SIWS request to the محفظة, many dApps show a preview of the message in their own UI. This preview serves two purposes: it prepares the user ل what they will see in the محفظة (reducing confusion و approval time), و it provides a last checkpoint before triggering the محفظة interaction.\n\nThe dApp preview should mirror the محفظة's rendering as closely as possible. Show the domain, statement, و key metadata fields. Indicate that the user will be asked to approve this message in their محفظة. If the dApp is using a custom statement, display it exactly as it will appear.\n\nDo not include fields in the preview that might confuse users. The nonce, ل example, is a random string that has no meaning to the user. Showing it adds visual noise without value. The preview can omit the nonce while the actual signed message includes it. Similarly, the chainId is important ل verification but rarely interesting to users unless the dApp operates across multiple clusters.\n\n## Edge cases in rendering\n\nSeveral edge cases affect how SIWS messages are rendered و signed. Long domains may be truncated in محفظة UIs — ensure your domain is concise. Internationalized domain names (IDN) should be tested مع your target محافظ, as some محافظ may not render Unicode characters correctly. The statement field has no maximum length in the standard, but extremely long statements will be truncated or require scrolling in the محفظة, reducing the chance that users read them fully.\n\nEmpty optional fields are omitted from the message text. If no expirationTime is set, the \"Expiration Time:\" line does not appear. If no resources are specified, no resources section appears. The message format adjusts dynamically based on which fields are present.\n\n## Checklist\n- Know the canonical SIWS message format و field ordering\n- Understand that محافظ parse و render structured UI from the message\n- Build dApp-side previews that mirror محفظة rendering\n- Test your SIWS messages مع target محافظ to verify display\n- Keep statements concise و domains short\n\n## Red flags\n- Assuming all محافظ render SIWS messages identically\n- Including sensitive data in the statement (it is visible in the signed message)\n- Using extremely long statements that محافظ truncate\n- Not الاختبار مع real محفظة approval screens during development\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "siws-v2-l3-preview",
                "title": "SIWS Message Format",
                "steps": [
                  {
                    "cmd": "Construct SIWS message from input fields",
                    "output": "example.com wants you to sign in مع your Solana حساب:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z",
                    "note": "Canonical text format that gets signed by the محفظة"
                  },
                  {
                    "cmd": "Wallet parses and displays structured approval screen",
                    "output": "Domain: example.com [verified]\nStatement: Sign in to example.com\nExpires: in 59 minutes\n[Approve] [Reject]",
                    "note": "محفظة renders structured UI from parsed fields"
                  },
                  {
                    "cmd": "User approves -> wallet signs canonical message bytes",
                    "output": "Signature: 3AuYNW... (Ed25519 over message bytes)\nPublic Key: 7Y4f3T...",
                    "note": "Signed output returned to the dApp ل server verification"
                  }
                ]
              }
            ]
          },
          "siws-v2-sign-in-input": {
            "title": "Challenge: Build a validated SIWS sign-in input",
            "content": "# Challenge: Build a validated SIWS sign-in input\n\nImplement a function that creates a validated Sign-In مع Solana input:\n\n- Validate domain (non-empty, must not include protocol prefix)\n- Validate nonce (at least 8 characters, alphanumeric only)\n- Validate address format (32-44 characters ل Solana base58)\n- Set issuedAt (required) و optional expirationTime مع ordering check\n- Default statement to \"Sign in to <domain>\" if not provided\n- Return structured result مع valid flag و collected errors\n\nYour implementation must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Domain should not include protocol (https://). Strip or reject it.",
              "Nonce must be >= 8 characters و alphanumeric only (/^[a-zA-Z0-9]+$/).",
              "Address must be 32-44 characters (Solana base58 public key).",
              "If no statement is provided, default to 'Sign in to <domain>'."
            ]
          }
        }
      },
      "siws-v2-verification": {
        "title": "Verification & الامان",
        "description": "Server-side verification invariants, nonce replay defenses, session management, و deterministic auth audit reporting.",
        "lessons": {
          "siws-v2-verify-sign-in": {
            "title": "Challenge: Verify a SIWS sign-in response",
            "content": "# Challenge: Verify a SIWS sign-in response\n\nImplement server-side verification of a SIWS sign-in output:\n\n- Check domain matches expected domain\n- Check nonce matches expected nonce\n- Check issuedAt is not in the future relative to currentTime\n- Check expirationTime (if present) has not passed\n- Check address matches expected signer\n- Return verification result مع individual check statuses و error list\n\nAll five checks must pass ل the sign-in to be considered verified.",
            "duration": "50 min",
            "hints": [
              "Compare domain, nonce, و address between signInOutput و expected values.",
              "issuedAt must be <= currentTime (not in the future).",
              "expirationTime (if present) must be > currentTime.",
              "All five checks must pass ل verified = true."
            ]
          },
          "siws-v2-sessions": {
            "title": "Sessions و logout: what to store و what not to store",
            "content": "# Sessions و logout: what to store و what not to store\n\nAfter a successful SIWS sign-in verification, the server must establish a session so the user does not need to re-authenticate on every request. Session management ل محفظة-based authentication has unique characteristics compared to traditional username-password systems. Understanding what to store, where to store it, و how to handle logout is essential ل building secure dApps.\n\n## What a SIWS session contains\n\nA SIWS session represents a verified claim: \"Public key X proved ownership by signing a SIWS message ل domain Y at time Z.\" The session should store exactly enough information to enforce authorization decisions without requiring re-verification. The minimum session payload includes: the محفظة address (public key), the domain the sign-in was verified ل, the session creation time, و the session expiration time.\n\nDo NOT store the SIWS signature, the signed message, or the nonce in the session. These are verification artifacts, not session data. The signature has no purpose after verification — it proved the user controlled the key at the time of signing, و that proof is now captured by the session itself. Storing signatures in sessions creates unnecessary data that, if leaked, provides no additional attack surface but adds complexity و storage cost.\n\nSession identifiers should be opaque, random tokens — not derived from the محفظة address. Using the محفظة address as a session ID is a common mistake because محفظة addresses are public. Anyone who knows a user's address could forge requests. The session ID must be a cryptographically random string (e.g., 256-bit random value, base64-encoded) that maps to the session data on the server side.\n\n## Server-side vs client-side session storage\n\nServer-side sessions store session data in a backend store (Redis, database, in-memory map) و issue a session token (cookie or bearer token) to the client. The client presents the token on each request, و the server looks up the associated session data. This is the most secure pattern because the server controls all session state.\n\nClient-side sessions (JWTs) encode the session data directly in the token. The server signs the JWT و the client includes it in requests. The server verifies the JWT signature و reads the session data without a backend lookup. This is simpler to deploy but has significant drawbacks: JWTs cannot be individually revoked (you must wait ل expiration or maintain a revocation list), the session data is visible to the client (encrypted JWTs mitigate this), و JWT size grows مع payload data.\n\nل SIWS authentication, server-side sessions are recommended because they support immediate revocation (critical ل الامان incidents) و keep session data private. If using JWTs, keep the payload minimal (محفظة address و expiration only), use short expiration times (15-60 minutes), و implement a refresh token flow ل session extension.\n\n## Session expiration و refresh\n\nSession lifetimes ل محفظة-authenticated dApps should be shorter than traditional web sessions. Users can sign a new SIWS message quickly (a few seconds), so the cost of re-authentication is low. Recommended session lifetime is 1-4 hours ل active sessions, مع a sliding window that extends the expiration on each authenticated request.\n\nRefresh tokens can extend session lifetime without requiring re-authentication. The flow is: issue a short-lived access token (15-60 minutes) و a longer-lived refresh token (24-72 hours). When the access token expires, the client presents the refresh token to obtain a new access token. The refresh token is single-use (rotated on each refresh) و stored securely.\n\nAbsolute session lifetime should be enforced regardless of refresh activity. Even if a user keeps refreshing, the session should eventually require re-authentication. A reasonable absolute lifetime is 7-30 days. This limits the damage from a stolen refresh token.\n\n## Logout implementation\n\nLogout ل محفظة-based authentication is simpler than login but has important nuances. The server must invalidate the session on the backend (delete the session from the store or add the JWT to a revocation list). The client must clear all local session artifacts (cookies, localStorage tokens, in-memory state).\n\nمحفظة disconnection is not the same as logout. When a user disconnects their محفظة from the dApp (using the محفظة's disconnect feature), the dApp should treat this as a logout signal و invalidate the server session. However, some dApps maintain the session even after محفظة disconnection, which can confuse users who expect disconnection to log them out.\n\nImplementing \"logout everywhere\" (invalidating all sessions ل a محفظة address) requires server-side session storage مع an index by محفظة address. When triggered, query all sessions ل the address و invalidate them. This is useful ل الامان incidents or when the user suspects their session was compromised.\n\n## What NOT to store in sessions\n\nNever store the user's private key (obviously). Never store the SIWS nonce (it has been consumed و should be deleted from the nonce store). Never store the raw SIWS signature (it is a verification artifact). Never store personally identifiable information (PII) unless your dApp explicitly collects it — محفظة addresses are pseudonymous by default.\n\nAvoid storing محفظة balances, token holdings, or other on-chain data in the session. This data changes constantly و becomes stale immediately. Fetch it fresh from the RPC when needed. Sessions should be lightweight: address, permissions, timestamps, و nothing more.\n\n## Checklist\n- Store محفظة address, domain, creation time, و expiration in sessions\n- Use cryptographically random session IDs, not محفظة addresses\n- Prefer server-side sessions ل immediate revocation capability\n- Enforce absolute session lifetime even مع refresh tokens\n- Invalidate sessions on both logout و محفظة disconnect\n- Never store signatures, nonces, or PII in sessions\n\n## Red flags\n- Using محفظة address as session ID\n- Storing SIWS signature or nonce in the session\n- No session expiration or unlimited lifetime\n- JWT sessions without revocation mechanism\n- Ignoring محفظة disconnect events\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l6-q1",
                    "prompt": "Why should session IDs be random tokens rather than محفظة addresses?",
                    "options": [
                      "محفظة addresses are public, so anyone could forge requests using a known address",
                      "Random tokens are shorter و save bandwidth",
                      "محفظة addresses change frequently و break sessions"
                    ],
                    "answerIndex": 0,
                    "explanation": "محفظة addresses are publicly known. Using them as session IDs would allow anyone who knows a user's address to impersonate their session. Random tokens ensure only the authenticated client can present a valid session."
                  },
                  {
                    "id": "siws-v2-l6-q2",
                    "prompt": "What should happen when a user disconnects their محفظة from a dApp?",
                    "options": [
                      "The dApp should invalidate the server-side session (treat it as logout)",
                      "Nothing — the session should persist ل convenience",
                      "The dApp should reconnect the محفظة automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "محفظة disconnection signals the user's intent to end the interaction. The dApp should respect this by invalidating the session, preventing confusion about authentication state."
                  }
                ]
              }
            ]
          },
          "siws-v2-replay-protection": {
            "title": "Replay protection و nonce registry التصميم",
            "content": "# Replay protection و nonce registry التصميم\n\nReplay attacks are the most critical threat to any signature-based authentication system. In a replay attack, an adversary captures a valid signed message و submits it again to the server, impersonating the original signer. SIWS addresses this مع nonce-based replay protection, but the implementation details of the nonce registry determine whether the protection actually works.\n\n## How replay attacks work against SIWS\n\nConsider a SIWS sign-in flow without proper nonce management. The user signs a message: \"example.com wants you to sign in مع your Solana حساب: Wallet111... Nonce: abc123 Issued At: 2024-01-01T00:00:00Z\". The server verifies the signature و creates a session. The signed message و signature are transmitted over HTTPS و should be safe in transit.\n\nHowever, the signed message could be captured through: a compromised server log that records request bodies, a malicious browser extension that intercepts WebSocket traffic, a man-in-the-middle proxy in a development or corporate environment, or a compromised CDN that logs request payloads. If the attacker obtains the signed SIWS output, they can submit it to the server as if they were the original signer.\n\nWithout nonce protection, the server would verify the signature (it is valid — the user really did sign it), check the domain (it matches), check the timestamps (they may still be within bounds), و accept the authentication. The attacker now has a valid session ل the victim's محفظة address.\n\n## Nonce lifecycle\n\nThe nonce lifecycle has four phases: generation, issuance, verification, و consumption. Each phase has specific requirements.\n\nGeneration: the server creates a cryptographically random nonce using a secure random number generator. The nonce must be unpredictable — an attacker should not be able to guess the next nonce by observing previous ones. Use at least 128 bits of entropy (16 bytes, 22 base64 characters or 32 hex characters). Store the nonce in the registry مع a TTL و the expected محفظة address.\n\nIssuance: the server includes the nonce in the SIWS input sent to the client. The nonce travels from server to client to محفظة و back. During this transit, the nonce is not secret (it is included in the signed message), but it is unique. The important property is not secrecy but freshness — this specific nonce has never been used before.\n\nVerification: when the server receives the signed SIWS output, it extracts the nonce و checks the registry. The nonce must exist in the registry (rejecting fabricated nonces), must not be marked as consumed (rejecting replays), و must not have expired (rejecting stale requests). These checks must happen before signature verification to fail fast on obvious replays.\n\nConsumption: after successful verification, the nonce is atomically marked as consumed or deleted from the registry. This is the critical step — if consumption is not atomic, two concurrent requests مع the same nonce could both pass the \"not consumed\" check before either marks it as consumed. This race condition completely defeats replay protection.\n\n## Nonce registry التصميم patterns\n\nThe nonce registry is the data structure that stores issued nonces و tracks their state. Several patterns are used in production.\n\nIn-memory map مع TTL: a simple hash map where keys are nonce strings و values are metadata (creation time, expected address, consumed flag). A background timer periodically cleans expired entries. This works ل single-server deployments but does not scale to multiple servers (each server has its own map و cannot validate nonces issued by other servers).\n\nRedis مع atomic operations: Redis provides the ideal primitives ل nonce management. Use SET مع NX (set-if-not-exists) ل atomic consumption: attempt to set a \"consumed\" key; if it already exists, the nonce was already used. Use TTL on nonce keys ل automatic expiration. Redis is distributed, so all servers share the same nonce registry.\n\nThe Redis pattern ل atomic nonce consumption:\n\n1. On issuance: `SET nonce:<value> \"issued\" EX 600` (10-minute TTL)\n2. On verification: `SET nonce:<value>:consumed \"1\" NX EX 600`\n   - If SET NX succeeds (returns OK): nonce is valid و now consumed\n   - If SET NX fails (returns nil): nonce was already consumed (replay attempt)\n\nDatabase مع unique constraints: store nonces in a table مع a unique constraint on the nonce value و a \"consumed_at\" column. Consumption is an UPDATE that sets consumed_at where consumed_at IS NULL. If the update affects 0 rows, the nonce was already consumed. Database معاملات ensure atomicity but add latency compared to Redis.\n\n## Handling edge cases\n\nClock skew between servers affects nonce TTL enforcement. If server A issues a nonce مع a 10-minute TTL but server B's clock is 3 minutes ahead, server B may consider the nonce expired after only 7 minutes from the user's perspective. Use NTP synchronization across servers و add a grace period (30-60 seconds) to TTL checks.\n\nNonce reuse across different محفظة addresses should be rejected. Even if محفظة A's nonce was consumed, do not allow محفظة B to use the same nonce value. This is automatically handled if the nonce registry indexes by nonce value regardless of address. However, some implementations associate nonces مع specific addresses و might accidentally allow cross-address reuse.\n\nHigh-traffic systems may generate thousands of nonces per second. The registry must handle this volume without becoming a bottleneck. Redis handles this easily. In-memory maps work if garbage collection of expired nonces is efficient. Database-backed registries need proper indexing و periodic cleanup of consumed nonces.\n\n## Monitoring و alerting\n\nProduction nonce registries should emit metrics: nonces generated per minute, nonces consumed per minute, replay attempts blocked per minute, nonces expired unused per minute. A sudden spike in replay attempts indicates an active attack. A high ratio of expired-to-consumed nonces may indicate UX issues (users starting but not completing sign-in).\n\nLog every replay attempt مع the nonce value, the submitting IP address, و the associated محفظة address. This data feeds into الامان incident investigation. Alert on replay attempt rates exceeding a threshold (e.g., more than 10 per minute from the same IP).\n\n## Checklist\n- Use cryptographically random nonces مع >= 128 bits of entropy\n- Implement atomic nonce consumption (check-و-invalidate in one operation)\n- Set nonce TTL matching the sign-in expiration window (5-15 minutes)\n- Use Redis or equivalent distributed store ل multi-server deployments\n- Monitor و alert on replay attempt rates\n- Clean up expired nonces periodically\n\n## Red flags\n- Non-atomic nonce consumption (check-then-delete race condition)\n- In-memory nonce storage in a multi-server النشر\n- No nonce TTL (nonces accumulate forever)\n- Allowing nonce reuse across different محفظة addresses\n- No monitoring of replay attempt rates\n",
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
                    "note": "Cryptographically random, stored in Redis مع 10-min TTL"
                  },
                  {
                    "cmd": "Server: issue SIWS input to client",
                    "output": "{\"domain\":\"example.com\",\"nonce\":\"k9Xm2pQr7vNw4cBh\",\"issuedAt\":\"...\"}",
                    "note": "Nonce travels: server -> client -> محفظة -> signed output"
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
            "content": "# Checkpoint: Generate an auth audit report\n\nBuild the final auth audit report that combines all دورة concepts:\n\n- Process an array of authentication attempts مع address, nonce, و verified status\n- Track used nonces to detect و block replay attempts (duplicate nonce = replay)\n- Count successful sign-ins, failed sign-ins, و replay attempts blocked\n- Count unique محفظة addresses across all attempts\n- Build a nonce registry مع status ل each attempt: \"consumed\", \"rejected\", or \"replay-blocked\"\n- Include the report timestamp\n\nThis checkpoint validates your complete understanding of SIWS authentication و nonce-based replay protection.",
            "duration": "55 min",
            "hints": [
              "Track used nonces in a map. If a nonce was already used, it's a replay attempt.",
              "Count successful (verified + new nonce), failed (not verified), و replay-blocked separately.",
              "Use an address set to count unique addresses.",
              "Build nonce registry مع status: 'consumed', 'rejected', or 'replay-blocked'."
            ]
          }
        }
      }
    }
  },
  "priority-fees-compute-budget": {
    "title": "Priority Fees & Compute Budget",
    "description": "Defensive Solana fee engineering مع deterministic compute planning, adaptive priority policy, و confirmation-aware UX reliability contracts.",
    "duration": "9 hours",
    "tags": [
      "solana",
      "fees",
      "compute-budget",
      "reliability"
    ],
    "modules": {
      "pfcb-v2-foundations": {
        "title": "Fee و Compute Foundations",
        "description": "Inclusion mechanics, compute/fee coupling, و explorer-driven policy التصميم مع deterministic reliability framing.",
        "lessons": {
          "pfcb-v2-fee-market-reality": {
            "title": "Fee markets on Solana: what actually moves inclusion",
            "content": "# Fee markets on Solana: what actually moves inclusion\n\nPriority fees on Solana are often explained as a simple slider, but production systems need a more precise model. Inclusion is influenced by contention ل compute, مدقق scheduling pressure, local leader behavior, و the معاملة's own resource request profile. Engineers who only look at a single median fee value usually misprice during bursty traffic و then overpay during recovery. This درس gives a عملي, defensive framework ل pricing inclusion without relying on superstition.\n\nA معاملة does not compete only on total lamports paid. It competes on requested compute unit price و resource footprint under slot-level pressure. If you request very high compute units و low micro-lamports per compute unit, you may still lose to smaller requests paying a healthier rate. In practice, محافظ should treat compute limit و compute price as coupled decisions. Choosing either one in isolation leads to unstable behavior. A route that usually lands مع 250,000 units may occasionally need 350,000 because state branches differ. If your safety margin is too tight, you fail. If your safety margin is too loose و your price is high, you overpay.\n\nDefensive engineering starts مع synthetic sample sets و deterministic policy simulation. Even if your production system eventually consumes live telemetry, your دورة project و baseline tests should prove policy behavior under controlled volatility regimes: calm, elevated, و spike. A calm regime might show p50 و p90 close together, while a spike regime has p90 several multiples above p50. This spread is important because it tells you whether your percentile target alone is enough, or whether you need a volatility guard that adds a controlled premium.\n\nAnother misunderstood point is confirmation UX. Users often interpret \"submitted\" as \"done,\" but processed status is still vulnerable to rollback scenarios و reordering. ل high-value flows, the UI should explain exactly why it waits ل confirmed or finalized. This is not academic: support burden spikes when users see optimistic success then reversal. Defensive products align language مع protocol reality by attaching explicit state labels و expected next actions.\n\nA robust fee policy also defines failure classes. If a معاملة misses inclusion windows repeatedly, the policy should identify whether to raise compute price, raise compute limit, refresh blockhash, or re-quote. Blindly retrying the same payload can amplify congestion و degrade user trust. Good systems cap retries و emit deterministic diagnostics that make support و analytics useful.\n\nYou should model inclusion strategy as policy outputs, not imperative side effects. A policy function should return chosen percentile, volatility adjustment, final micro-lamports target, confidence label, و warnings. By keeping this deterministic و serializable, teams can diff policy versions و verify behavior changes before deploying. This is the same discipline used in risk engines: reproducible decisions first, runtime integrations second.\n\nFinally, keep user education integrated into the product flow. A short explanation that \"network congestion increased your priority fee to improve inclusion probability\" reduces confusion و failed-signature churn. It also helps users compare urgency tiers in a way that feels fair. Defensive UX is not only about blocking risky actions; it is about exposing enough context to prevent panic و repeated mistakes.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Operator mindset\n\nFee policy is an inclusion-probability model, not a guarantee engine. Good systems expose confidence, assumptions, و fallback actions explicitly so operators can respond quickly when regimes shift.\n\n## Checklist\n- Couple compute limit و compute price decisions in one policy output.\n- Use percentile targeting plus volatility guard ل unstable markets.\n- Treat confirmation states as distinct UX contracts.\n- Cap retries و classify misses before adjusting fees.\n- Emit deterministic policy reports ل audits و regressions.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "pfcb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "pfcb-v2-l1-q1",
                    "prompt": "Why should compute unit limit و price be planned together?",
                    "options": [
                      "Because inclusion depends on both requested resources و bid intensity",
                      "Because compute unit limit is ignored by مدققون",
                      "Because priority fee is fixed per معاملة"
                    ],
                    "answerIndex": 0,
                    "explanation": "A large CU request مع weak price can lose inclusion, while aggressive price on oversized CU can overpay."
                  },
                  {
                    "id": "pfcb-v2-l1-q2",
                    "prompt": "What does a wide p90 vs p50 spread usually indicate?",
                    "options": [
                      "A volatile fee regime where a guard premium may be needed",
                      "A bug in معاملة serialization",
                      "Guaranteed finalized confirmation"
                    ],
                    "answerIndex": 0,
                    "explanation": "Spread growth signals unstable contention و lower reliability ل naive median pricing."
                  }
                ]
              }
            ]
          },
          "pfcb-v2-compute-budget-failure-modes": {
            "title": "Compute budget الاساسيات و common failure modes",
            "content": "# Compute budget الاساسيات و common failure modes\n\nMost معاملة failures blamed on \"network issues\" are actually planning errors in compute budget و payload sizing. A defensive client treats compute planning as a deterministic preflight policy: estimate required compute, apply bounded margin, decide whether heap allocation is warranted, و explain the result before signing. This درس focuses on failure modes that recur in production محافظ و DeFi frontends.\n\nThe first class is explicit compute exhaustion. When تعليمة paths consume more than the معاملة limit, execution aborts و users still pay base fees ل work already attempted. Teams frequently set one global limit ل all routes, which is convenient but unreliable. Route complexity differs by pool topology, حساب cache warmth, و حساب creation branches. Planning must operate on per-flow estimates, not app-wide constants.\n\nThe second class is excessive compute requests paired مع aggressive bid pricing. This can cause overpayment و user distrust, especially in periods where lower limits would still succeed. A safe policy sets lower و upper bounds, applies a margin to synthetic or simulated expected compute, و clamps to protocol max. If a requested override is present, the system should still clamp و document why. Deterministic reasoning strings are useful because support و QA can inspect exactly why a plan was chosen.\n\nThe third class is معاملة size pressure. Large حساب metas و تعليمة data increase serialization footprint, و large payloads often correlate مع higher compute paths. While compute planning does not directly solve size limit errors, the same planner can emit a hint when معاملة size exceeds a threshold و recommend route simplification or decomposition. In this دورة, we keep it deterministic: no RPC checks, only input-driven policy outputs.\n\nA related failure class is memory pressure in workloads that deserialize heavy حساب sets. Some clients include heap-frame recommendations based on route complexity or size threshold. If you include this in a deterministic planner, keep the conditions explicit و stable. Ambiguous heuristics create policy churn that is hard to test.\n\nGood confirmation UX is another defensive layer. Processed means accepted by a node, confirmed adds stronger network observation, finalized is strongest settlement confidence. ل low-value actions, processed plus pending indicator can be acceptable. ل high-risk value transfer, confirmed or finalized should gate \"success\" copy. Engineers should encode this as policy output rather than ad hoc component logic.\n\nA mature planner also returns warnings. Examples include \"override clamped to max,\" \"size indicates high serialization risk,\" or \"sample set too small ل confident bid.\" Warnings should not be noisy; each one should map to an actionable path. Over-warning trains users to ignore alerts, while under-warning hides real risk.\n\nIn deterministic environments, each policy branch should be testable مع small synthetic fixtures. You want stable outputs ل JSON snapshots, markdown reports, و support triage docs. This discipline scales to production because the same decision shape can later consume live inputs without changing contract semantics.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Compute plans should be bounded, deterministic, و explainable.\n- Planner should expose warning signals, not only numeric outputs.\n- Confirmation messaging should reflect actual settlement guarantees.\n- Inputs must be validated; invalid estimates should fail fast.\n- Unit tests should cover clamp logic و edge thresholds.\n",
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
            "content": "# Explorer: compute budget planner inputs to plan\n\nExplorers are useful only when they expose policy tradeoffs clearly. ل a fee و compute planner, that means visualizing how input estimates, percentile targets, و confirmation requirements produce a deterministic recommendation. This درس frames an explorer as a decision table that can be replayed by engineers, support staff, و users.\n\nStart مع the three input groups: workload profile, fee samples, و UX confirmation target. Workload profile includes synthetic تعليمة CU estimates و payload size. Fee samples represent recent or scenario-based micro-lamport values. Confirmation target defines settlement strictness ل the user action type. A deterministic planner should convert these into a stable tuple: compute plan, priority estimate, و warnings.\n\nThe key teaching point is that explorer values should not mutate silently. If a user changes percentile from 50 to 75, the output should change in an obvious و traceable way. If volatility spread exceeds policy guard, the explorer should display a clear badge: \"guard applied.\" This approach teaches policy causality و prevents magical thinking about fees.\n\nExplorer التصميم should also separate confidence from urgency. Confidence describes how trustworthy the current estimate is, often based on sample depth و spread stability. Urgency is a user choice: how quickly inclusion is desired. Confusing these concepts leads to poor defaults و frustrated users. A cautious user may still choose medium urgency if confidence is low و warnings are high.\n\nA defensive explorer includes side-by-side outputs ل JSON و markdown summary. JSON provides machine-readable deterministic artifacts ل snapshots و regression tests. Markdown provides human-readable communication ل support و incident reviews. Both should derive from the same payload to avoid divergence.\n\nIn production teams, explorer traces can become a lightweight runbook. If a user reports repeated misses, support can replay the same inputs و inspect whether the policy selected reasonable values. If not, policy changes can be proposed مع test fixtures before rollout. If yes, the issue may be external congestion or stale quote flow, not planner logic.\n\nFrom an engineering quality perspective, deterministic explorers reduce blame cycles. Instead of \"it felt wrong,\" teams can point to exact sample sets, percentile choice, spread guard status, و final plan fields. This clarity is a force multiplier ل reliability work.\n\nThe last التصميم principle is explicit assumptions. If your explorer assumes synthetic samples, label them clearly. If it assumes no RPC feedback, state that. Honest boundaries improve trust و encourage users to interpret outputs correctly.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Show clear mapping from each input control to each output field.\n- Expose volatility guard activation as an explicit state.\n- Keep confidence و urgency as separate concepts.\n- Produce identical output ل repeated identical inputs.\n- Export JSON و markdown from the same canonical payload.\n",
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
        "description": "Implement deterministic planners, confirmation policy engines, و stable fee strategy artifacts ل release review.",
        "lessons": {
          "pfcb-v2-plan-compute-budget": {
            "title": "Challenge: implement planComputeBudget()",
            "content": "Implement a deterministic compute budget planner. No RPC calls; operate only on provided input data.",
            "duration": "40 min",
            "hints": [
              "Compute units should be ceil(total CU * 1.1) مع a floor of 80k و max of 1.4M.",
              "Enable heapBytes ل very large tx payloads or high CU totals.",
              "Return a deterministic reason string ل test stability."
            ]
          },
          "pfcb-v2-estimate-priority-fee": {
            "title": "Challenge: implement estimatePriorityFee()",
            "content": "Implement policy-based priority fee estimation using synthetic sample arrays و deterministic warnings.",
            "duration": "40 min",
            "hints": [
              "Use percentile targeting from sorted synthetic fee samples.",
              "Apply volatility guard if p90 vs p50 spread exceeds policy threshold.",
              "Clamp output between min و max micro-lamports."
            ]
          },
          "pfcb-v2-confirmation-ux-policy": {
            "title": "Challenge: confirmation level decision engine",
            "content": "Encode confirmation UX policy ل processed, confirmed, و finalized states using deterministic risk bands.",
            "duration": "35 min",
            "hints": [
              "Map risk score bands to processed/confirmed/finalized UX levels.",
              "Keep output deterministic و string-stable."
            ]
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            "title": "Challenge: build feePlanSummary markdown",
            "content": "Build stable markdown output ل a fee strategy summary that users و support teams can review quickly.",
            "duration": "35 min",
            "hints": [
              "Markdown output should be deterministic و human-readable.",
              "Avoid timestamps or random IDs in output."
            ]
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            "title": "Checkpoint: Fee Optimizer report",
            "content": "Produce a deterministic checkpoint report JSON ل the Fee Optimizer final project artifact.",
            "duration": "45 min",
            "hints": [
              "Return stable JSON مع sorted warning strings.",
              "Checkpoint report should avoid nondeterministic fields."
            ]
          }
        }
      }
    }
  },
  "bundles-atomicity": {
    "title": "Bundles & معاملة Atomicity",
    "description": "التصميم defensive multi-معاملة Solana flows مع deterministic atomicity validation, compensation modeling, و audit-ready safety reporting.",
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
        "description": "User-intent expectations, flow decomposition, و deterministic risk-graph modeling ل multi-step reliability.",
        "lessons": {
          "bundles-v2-atomicity-model": {
            "title": "Atomicity concepts و why users assume all-or-nothing",
            "content": "# Atomicity concepts و why users assume all-or-nothing\n\nUsers rarely think in معاملة graphs. They think in intents: \"swap my token\" or \"close my position.\" When a workflow spans multiple معاملات, user expectation remains all-or-nothing unless your UI teaches otherwise. This mismatch between intent-level atomicity و protocol-level execution can produce severe trust failures even when each معاملة is technically valid. Defensive engineering starts by mapping user intent boundaries و showing where partial execution can occur.\n\nIn Solana systems, multi-step flows are common. You may need token approval-like setup, associated token حساب creation, route execution, و cleanup. Each step has independent confirmation behavior و can fail ل different reasons. If a flow halts after a preparatory step, the user can be left in a state they never intended: allowances enabled, rent paid ل unused حسابات, or funds moved into متوسط holding حسابات.\n\nA rigorous model begins مع explicit step typing. Every step should be tagged by function و risk: setup, value transfer, settlement, compensation, و cleanup. Then define dependencies between steps و mark whether each step is idempotent. Idempotency matters because retry logic can create duplicates if a step is not safely repeatable. This is not only a backend concern; frontend orchestration و محفظة prompts must respect idempotency constraints.\n\nAnother key concept is compensating action coverage. If a value-transfer step fails midway, does a deterministic refund path exist? If not, your flow should be marked high risk و your UI should block or require additional confirmation. Teams often postpone compensation التصميم until incident response, but defensive دورة التصميم should treat compensation as a first-class requirement.\n\nBundle thinking helps organize these concerns. Even without live relay APIs, you can compose a deterministic bundle structure representing intended ordering و invariants. This structure teaches engineers how to reason about all-or-nothing intent, retries, و fallback paths. It also enables stable unit tests that validate graph shape و risk reports.\n\nFrom a UX angle, the most important move is honest framing. If strict atomicity is not guaranteed, state it directly. Users tolerate complexity when language is clear: \"Step 2 may fail after Step 1 succeeds; automatic refund logic is applied if needed.\" Hiding this reality may reduce initial friction but increases long-term mistrust.\n\nSupport و incident teams benefit from deterministic flow reports. A report should list steps, dependencies, idempotency status, و detected issues such as missing refunds or broken dependencies. When users report failed swaps, this report enables quick triage: was the failure expected و safely compensated, or did the flow violate defined invariants?\n\nUltimately, atomicity is a contract between engineering و user expectations. Protocol constraints do not remove that responsibility. They make explicit modeling, الاختبار, و communication mandatory.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Operator mindset\n\nAtomicity is a user-trust contract. If strict all-or-nothing is unavailable, compensation guarantees و residual risks must be explicit, testable, و observable in reports.\n\n## Checklist\n- Model flows by intent, not only by معاملة count.\n- Annotate each step مع dependencies و idempotency.\n- Require explicit compensation paths ل value-transfer failures.\n- Produce deterministic safety reports ل each flow version.\n- Teach users where all-or-nothing is guaranteed و where it is not.\n",
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
                      "Because intent-level النموذج الذهنيs are all-or-nothing",
                      "Because protocols always guarantee it",
                      "Because محفظة adapters hide all failures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Users think in outcomes, not internal معاملة decomposition."
                  }
                ]
              }
            ]
          },
          "bundles-v2-flow-risk-points": {
            "title": "Multi-معاملة flows: approvals, ATA creation, swaps, refunds",
            "content": "# Multi-معاملة flows: approvals, ATA creation, swaps, refunds\n\nA reliable flow simulator must encode where partial execution risk lives. In practice, risk points cluster at boundaries: before value transfer, during value transfer, و after value transfer when cleanup or refund steps should run. This درس maps common Solana flow stages و shows defensive controls that keep failure behavior predictable.\n\nThe first stage is prerequisite setup. حساب initialization و ATA creation are often safe و idempotent if implemented correctly, but they still consume fees و may fail under congestion. If setup fails, users should see precise messaging و retry guidance. If setup succeeds و later steps fail, your state machine must remember setup completion to avoid duplicate حساب creation attempts.\n\nThe second stage is authorization-like setup. On Solana this may differ from EVM approvals, but the pattern remains: a step grants capability to later تعليمات. Non-idempotent or overly broad permissions here amplify downstream risk. Flow مدققون should detect non-idempotent authorization steps و force explicit refund or revocation logic if subsequent steps fail.\n\nThe third stage is value transfer or swap execution. This is where market drift, stale quotes, و route failure can break expectations. A deterministic simulator should not fetch live prices; instead it should model success/failure branches و expected compensation behavior. This lets teams test policy without network noise.\n\nThe fourth stage is compensation. If swap execution fails after setup or partial settlement, compensation is the difference between recoverable error و user-facing loss. Compensation steps must be discoverable, ordered, و testable. Simulators should flag flows missing compensation when any non-idempotent or value-affecting step exists.\n\nThe fifth stage is cleanup. Cleanup can include revoking transient permissions, closing temporary حسابات, or recording final status artifacts. Cleanup should be safe to retry و should not hide failures. Some teams skip cleanup during congestion, but then debt accumulates in user حسابات و backend state.\n\nDefensive patterns include idempotency keys ل orchestration, deterministic status transitions, و explicit issue codes ل each risk category. ل example, the missing-refund issue code should always map to the same report semantics so monitoring dashboards remain stable.\n\nA flow graph explorer can teach these points effectively. By visualizing nodes و edges مع risk annotations, teams quickly see where assumptions are weak. Edges should represent hard dependencies, not optional sequencing preferences. If a dependency references a missing step, the graph should fail validation immediately.\n\nDuring incident reviews, deterministic graph reports outperform log fragments. They provide compact, reproducible context: what was planned, what safety checks failed, و which invariants were violated. This reduces MTTR و avoids repeated misclassification.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Label setup, value, compensation, و cleanup steps explicitly.\n- Treat non-idempotent setup as high-risk without compensating actions.\n- Validate dependency graph integrity before execution planning.\n- Encode deterministic issue codes و severity mapping.\n- Keep simulator behavior offline و reproducible.\n",
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
            "title": "Explorer: flow graph steps و risk points",
            "content": "# Explorer: flow graph steps و risk points\n\nFlow graph explorers are most valuable when they highlight risk semantics, not just sequence order. A defensive explorer should display each step مع dependency context, idempotency flag, و compensation coverage. Engineers should be able to answer three questions immediately: what can fail, what can be retried safely, و what protects users if a value step fails.\n\nStart by treating each node as a contract. A node contract defines preconditions, side effects, و postconditions. Preconditions include required upstream steps و expected inputs. Side effects include حساب state changes or transfer intents. Postconditions include observable status updates و possible compensation requirements. When node contracts are explicit, validation rules become straightforward و deterministic.\n\nEdges in the graph should represent hard causality. If step B depends on step A output, represent that as an edge و validate existence at build time. Optional order preferences should not be encoded as dependencies because they can produce false positives و brittle reports. Keep graph semantics strict و minimal.\n\nRisk annotations should be first-class fields. Instead of deducing risk later from prose, attach tags such as value-transfer, non-idempotent, requires-refund, و cleanup-only. Report generation can then aggregate these tags into issue summaries و recommended mitigations.\n\nA robust explorer also teaches \"atomic in user model\" versus \"atomic on chain.\" You can annotate the whole flow مع intent boundary metadata that states whether strict atomic guarantee exists. If not, the explorer should list compensation guarantees و residual risk in plain language.\n\nDeterministic bundle composition is a useful next layer. Even without calling relay services, you can generate a bundle artifact that enumerates معاملة groupings و invariants. This allows stable comparisons across policy revisions. If a future change removes a refund invariant, tests should fail immediately.\n\nEngineers should avoid dynamic output fields like timestamps inside core report payloads. Keep those in outer metadata if needed. Stable JSON و markdown outputs make review diffs reliable و reduce false positives in CI snapshots.\n\nFrom a teaching standpoint, explorer sessions should include both safe و unsafe examples. Seeing a missing dependency or missing refund issue in a concrete graph is more memorable than reading abstract warnings. The دورة challenge sequence then asks learners to codify the same checks.\n\nFinally, remember that atomicity work is reliability work. It is not a special الامان-only track. The same graph discipline helps product, backend, و support teams share one truth source ل multi-step behavior.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Represent node contracts و dependency edges explicitly.\n- Annotate risk tags directly in graph data.\n- Distinguish user-intent atomicity from protocol guarantees.\n- Generate deterministic bundle و report artifacts.\n- Include unsafe example graphs in test fixtures.\n",
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
                      "label": "Safe flow مع compensation",
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
        "description": "Build, validate, و report deterministic flow safety مع compensation checks, idempotency handling, و bundle artifacts.",
        "lessons": {
          "bundles-v2-build-atomic-flow": {
            "title": "Challenge: implement buildAtomicFlow()",
            "content": "Build a normalized deterministic flow graph from steps و dependencies.",
            "duration": "40 min",
            "hints": [
              "Normalize order by step ID و dependency ID ل deterministic flow graphs.",
              "Emit explicit edges from dependency relationships."
            ]
          },
          "bundles-v2-validate-atomicity": {
            "title": "Challenge: implement validateAtomicity()",
            "content": "Detect partial execution risk, missing refunds, و non-idempotent steps.",
            "duration": "40 min",
            "hints": [
              "Detect missing refund branch ل swap flows.",
              "Flag non-idempotent steps because retries can break all-or-nothing guarantees."
            ]
          },
          "bundles-v2-failure-handling-patterns": {
            "title": "Challenge: failure handling مع idempotency keys",
            "content": "Encode deterministic failure handling metadata, including compensation state.",
            "duration": "35 min",
            "hints": [
              "Generate deterministic idempotency keys from stable inputs.",
              "Always emit explicit refund-path state ل observability."
            ]
          },
          "bundles-v2-bundle-composer": {
            "title": "Challenge: deterministic bundle composer",
            "content": "Compose a deterministic bundle structure ل an atomic flow. No relay calls.",
            "duration": "35 min",
            "hints": [
              "No real Jito calls. Build deterministic data structures only.",
              "One step per معاملة keeps test assertions simple و stable."
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
    "description": "Defensive swap UX engineering مع deterministic risk grading, bounded slippage policies, و incident-ready safety communication.",
    "duration": "9 hours",
    "tags": [
      "mempool",
      "ux",
      "slippage",
      "risk-policy"
    ],
    "modules": {
      "mempoolux-v2-foundations": {
        "title": "Mempool Reality و UX Defense",
        "description": "Quote-to-execution risk modeling, slippage guardrails, و defensive user education ل safer swap decisions.",
        "lessons": {
          "mempoolux-v2-quote-execution-gap": {
            "title": "What can go wrong between quote و execution",
            "content": "# What can go wrong between quote و execution\n\nA swap quote is a prediction, not a guarantee. Between quote generation و execution, liquidity changes, competing orders land, و network conditions shift. Users often assume that seeing a quote means they will receive that outcome, but production UX must teach و enforce the gap between quote time و execution time. This دورة is defensive by التصميم: no exploit strategies, only protective policy و communication.\n\nThe first risk is quote staleness. Even in calm periods, a quote generated several seconds ago can diverge from current route quality. During high activity, divergence can happen in sub-second windows. A protective UI should track quote age continuously و degrade confidence as age increases. At defined thresholds, it should warn or block execution until a refresh occurs.\n\nThe second risk is slippage misconfiguration. Slippage tolerance exists to bound acceptable execution drift. If set too tight, legitimate معاملات fail frequently. If set too wide, users can receive unexpectedly poor execution. Defensive systems define policy bounds و recommend values based on route characteristics, not a single static default.\n\nThe third risk is تأثير السعر misunderstanding. تأثير السعر measures how much your order moves market price due to route depth. Slippage tolerance measures allowed execution variance. They are related but not interchangeable. Teaching this difference prevents users from widening slippage to \"fix\" impact-heavy trades that should instead be resized or rerouted.\n\nThe fourth risk is route complexity. Multi-hop routes can improve nominal quote value but introduce more points of state dependency و timing drift. A risk engine should حساب ل hop count as a reliability input. This does not mean all multi-hop routes are unsafe; it means risk should be surfaced proportionally.\n\nThe fifth risk is liquidity quality. Low-liquidity routes are more fragile under contention. Deterministic scoring can treat liquidity as one signal among many, producing grade outputs like low, medium, high, و critical. Grades should be accompanied by reasons, so warnings are explainable.\n\nProtective UX is not just warning banners. It includes defaults, disabled states, timed refresh prompts, و clear language about what each control does. If users do not understand controls, they either ignore them or misconfigure them. The best interfaces explain tradeoffs in one sentence و keep متقدم controls available without forcing novices into risky settings.\n\nPolicy engines should produce deterministic artifacts ل testability. Given identical input tuples, risk grade و warnings should remain identical. This enables stable unit tests و predictable support behavior. It also allows teams to review policy changes as code diffs rather than subjective UI adjustments.\n\nThe goal is not zero failed swaps; the goal is informed, bounded risk مع transparent behavior. Users accept tradeoffs when systems are honest و consistent.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Operator mindset\n\nProtected swap UX is policy UX. Defaults, warnings, و block states should be deterministic, explainable, و versioned so teams can defend decisions during incidents.\n\n## Checklist\n- Track quote age و apply graded stale-quote policies.\n- Separate تأثير السعر education from slippage controls.\n- Incorporate route hops و liquidity into risk scoring.\n- Emit deterministic risk reasons ل UX copy.\n- Block execution only when policy thresholds are clearly crossed.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mempoolux-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mempoolux-v2-l1-q1",
                    "prompt": "What is the primary difference between slippage و تأثير السعر?",
                    "options": [
                      "Slippage is user tolerance; impact is market footprint",
                      "They are identical metrics",
                      "تأثير السعر only applies on CEXs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Slippage is a user-configured bound, while impact reflects route liquidity response to trade size."
                  }
                ]
              }
            ]
          },
          "mempoolux-v2-slippage-guardrails": {
            "title": "Slippage controls و guardrails",
            "content": "# Slippage controls و guardrails\n\nSlippage settings are a policy surface, not a cosmetic preference. Defensive swap UX defines explicit bounds, context-aware defaults, و clear consequences when users attempt risky overrides. This درس focuses on guardrail التصميم that reduces avoidable losses while preserving user agency.\n\nA strong policy starts مع minimum و maximum bounds. The minimum protects against unusable settings that cause endless failures. The maximum protects against overly permissive settings that convert volatility into severe execution loss. Between bounds, choose a default aligned مع typical route behavior. ل many flows this is moderate, then dynamically adjusted by quote freshness و impact context.\n\nGuardrails should respond to stale quotes. If quote age passes a threshold, a safe policy can lower recommended slippage و request refresh before signing. If quote age becomes severely stale, execution should be blocked مع a deterministic message. Blocking should be rare but unambiguous. Users should know whether a refresh can unblock immediately.\n\nImpact-aware adjustment is another essential control. High projected impact may require either tighter trade sizing or broader tolerance depending on objective. Defensive UX should encourage reviewing trade size first, not instantly widening tolerance. If users choose high tolerance anyway, warnings should explain downside plainly.\n\nOverride behavior must be deterministic. When a user-selected value exceeds policy max, clamp it و emit a warning that can be exported in reports. Silent clamping is dangerous because users think they are running one setting while the engine uses another. Explicit feedback builds trust و prevents support confusion.\n\nCopy quality matters. Avoid technical jargon in warning body text. A good warning says what is wrong, why it matters, و what to do next. ل example: \"Quote is stale; refresh before signing to avoid outdated execution terms.\" This is better than \"staleness threshold exceeded.\" Engineers can keep technical details in debug exports.\n\nGuardrails should also integrate مع route preview components. Showing risk grade beside slippage recommendation helps users interpret controls in context. If grade is high و slippage recommendation is near max, the UI should highlight additional caution و maybe suggest smaller size.\n\nFrom an implementation perspective, a pure deterministic function is ideal: input config plus quote context yields warnings, recommended bps, و blocked flag. This function can be unit tested across edge scenarios و reused in frontend و backend validation paths.\n\nFinally, policy reviews should be versioned. If teams change bounds or thresholds, they should compare old و new outputs across fixture sets before rollout. This prevents regressions where well-intended tweaks accidentally increase risk exposure.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Define min, default, و max slippage as explicit policy values.\n- Apply stale-quote logic before execution و adjust recommendations.\n- Clamp unsafe overrides مع clear warning messages.\n- Surface blocked state only ل clearly defined severe conditions.\n- Keep policy deterministic و version-reviewable.\n",
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
            "title": "Explorer: quote freshness timer و decision table",
            "content": "# Explorer: quote freshness timer و decision table\n\nA quote freshness explorer should make policy behavior obvious under time pressure. Users و engineers need to see when a quote transitions from safe to warning to blocked. This درس defines a decision table approach that pairs timer state مع slippage و impact context.\n\nThe timer should not be a decorative countdown. It is a state driver مع explicit thresholds. ل example, 0-10 seconds may be low concern, 10-20 seconds warning, و above 20 seconds blocked ل certain route classes. Thresholds can vary by asset class و liquidity quality, but the explorer must display the active policy version so users understand why behavior changed.\n\nDecision tables combine timer bands مع additional signals: projected impact, hop count, و liquidity score. A single stale timer does not always imply severe risk; it depends on route fragility. Deterministic scoring helps aggregate these dimensions into one grade while preserving reason strings.\n\nAn effective explorer view presents both grade و recommendation fields. Grade communicates severity. Recommendation communicates next action: refresh quote, tighten slippage, reduce size, or proceed. Without recommendation, users see red flags but lack direction.\n\nEngineers should include edge fixtures where metrics conflict. Example: fresh quote but very high impact و low liquidity; or stale quote مع low impact و high liquidity. These fixtures prevent simplistic heuristics from dominating policy و help teams calibrate thresholds intentionally.\n\nThe explorer also supports user education around anti-sandwich posture without teaching offensive behavior. You can explain that wider slippage و stale quotes increase adverse execution risk, و that refreshing quote plus tighter controls reduces exposure. Keep messaging defensive و عملي.\n\nل reliability teams, deterministic explorer outputs become regression baselines. If a code change alters grade ل a fixture unexpectedly, CI catches it before production. This is particularly important when tuning thresholds during volatile periods.\n\nOutput formatting should remain stable. Use canonical JSON order ل exported config, و stable markdown ل support docs. Avoid timestamps in core payloads to preserve snapshot equality. If timestamps are required, store them outside deterministic artifact fields.\n\nFinally, link explorer states to UI banners. If grade is critical, banner severity should be error مع explicit action. If grade is medium, warning banner مع optional guidance may suffice. This mapping is implemented in later challenges.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Treat freshness timer as policy input, not visual decoration.\n- Combine timer state مع impact, hops, و liquidity signals.\n- Emit grade plus actionable recommendation.\n- Test conflicting-signal fixtures ل policy balance.\n- Keep exported artifacts deterministic و stable.\n",
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
        "description": "Implement deterministic policy engines, safety messaging, و stable protection-config artifacts ل release الحوكمة.",
        "lessons": {
          "mempoolux-v2-evaluate-swap-risk": {
            "title": "Challenge: implement evaluateSwapRisk()",
            "content": "Implement deterministic swap risk grading from quote, slippage, impact, hops, و liquidity inputs.",
            "duration": "40 min",
            "hints": [
              "Use additive policy scoring from quote freshness, slippage, impact, route, و liquidity.",
              "Return both risk grade و concrete reasons ل UX copy generation."
            ]
          },
          "mempoolux-v2-slippage-guard": {
            "title": "Challenge: implement slippageGuard()",
            "content": "Build bounded slippage recommendations مع warnings و hard-block states.",
            "duration": "40 min",
            "hints": [
              "Clamp recommended BPS to policy bounds.",
              "Stale quotes should lower tolerance و may block if very stale."
            ]
          },
          "mempoolux-v2-impact-vs-slippage": {
            "title": "Challenge: model تأثير السعر vs slippage",
            "content": "Encode a deterministic interpretation of impact-to-tolerance ratio ل user education.",
            "duration": "35 min",
            "hints": [
              "Teach difference: impact is market footprint, slippage is user tolerance.",
              "Return both ratio و interpretation ل UI hints."
            ]
          },
          "mempoolux-v2-swap-safety-banner": {
            "title": "Challenge: build swapSafetyBanner()",
            "content": "Map deterministic risk grades to defensive banner copy و severity.",
            "duration": "35 min",
            "hints": [
              "Map risk grades to deterministic banner copy.",
              "Avoid exploit framing; keep copy defensive و user-focused."
            ]
          },
          "mempoolux-v2-protection-config-export": {
            "title": "Checkpoint: swap protection config export",
            "content": "Export a stable deterministic policy config artifact ل the Protected Swap UI checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be deterministic JSON ل copy/export behavior.",
              "Do not include timestamps or random IDs."
            ]
          }
        }
      }
    }
  },
  "indexing-webhooks-pipelines": {
    "title": "Indexers, Webhooks & Reorg-Safe Pipelines",
    "description": "Build production-grade deterministic indexing pipelines ل duplicate-safe ingestion, reorg handling, و integrity-first reporting.",
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
        "description": "Event identity modeling, confirmation semantics, و deterministic ingest-to-apply pipeline behavior.",
        "lessons": {
          "indexpipe-v2-indexing-basics": {
            "title": "Indexing 101: logs, حسابات, و معاملة parsing",
            "content": "# Indexing 101: logs, حسابات, و معاملة parsing\n\nReliable indexers are not just fast parsers. They are consistency systems that decide what to trust, when to trust it, و how to recover from changing chain history. On Solana, event ingestion often starts from logs or parsed تعليمات, but production pipelines need deterministic keying, replay controls, و state application rules that survive retries و reorgs.\n\nA basic pipeline has four stages: ingest, dedupe, confirmation gating, و state apply. Ingest captures raw events مع enough metadata to reconstruct ordering context: slot, signature, تعليمة index, event type, و affected حساب. Dedupe ensures duplicate deliveries do not produce duplicate state transitions. Confirmation gating delays state application until depth conditions are met. Apply mutates snapshots in deterministic order.\n\nMany teams fail in the first stage by capturing incomplete event identity fields. If you omit تعليمة index or event kind, collisions appear و dedupe becomes unsafe. Composite keys should be explicit و stable. They should also be derived purely from event payload so keys remain reproducible in tests و backfills.\n\nParsing strategy matters too. Logs are convenient but can drift across program versions. Parsed تعليمة data can be more structured but may require custom decoders. Defensive indexing stores normalized events in one canonical schema regardless of source. This isolates downstream logic from parser changes.\n\nIdempotency is essential. Your ingestion path may receive duplicates from retries, webhook redelivery, or backfill overlap. If dedupe is weak, balances drift و downstream analytics become untrustworthy. Deterministic dedupe مع composite keys is the first line of defense.\n\nThe apply stage should avoid hidden nondeterminism. If events are applied in arrival order without stable sort keys, two replays can produce different snapshots. Always sort by deterministic key before apply. If you need tie-breakers, define them explicitly.\n\nSnapshot التصميم should prioritize auditability. Keep applied event keys, pending keys, و finalized keys visible. These sets make it easy to reason about what the snapshot currently reflects و why. They also simplify integrity checks later.\n\nFinally, keep deterministic outputs central to your developer workflow. Pipeline reports و snapshots should be exportable in stable formats ل test snapshots و incident analysis. Reliability work depends on reproducible evidence.\n\n\nTo keep this durable, teams should document fixture ownership و rotate review responsibilities so event taxonomy stays aligned مع protocol upgrades. Without this operational ownership, pipelines drift into untested assumptions, و recovery playbooks age out. Deterministic explorers stay valuable only when fixtures evolve مع production reality و every stage still reports clear, machine-verifiable state transitions under replay و stress.\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Operator mindset\n\nIndexing is a correctness pipeline before it is an analytics pipeline. Fast ingestion مع weak dedupe, confirmation, or replay guarantees produces confidently wrong outputs.\n\n## Checklist\n- Capture complete event identity fields at ingest time.\n- Normalize events from logs و parsed تعليمات into one schema.\n- Use deterministic composite keys ل dedupe.\n- Sort events stably before state application.\n- Track applied, pending, و finalized sets in snapshots.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexpipe-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexpipe-v2-l1-q1",
                    "prompt": "Why is تعليمة index important in event keys?",
                    "options": [
                      "It helps prevent collisions when one معاملة emits similar events",
                      "It reduces RPC cost directly",
                      "It replaces confirmation checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "تعليمة index distinguishes same-signature events that would otherwise collide in dedupe."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            "title": "Reorgs و fork choice: why confirmed is not finalized",
            "content": "# Reorgs و fork choice: why confirmed is not finalized\n\nConfirmation labels are useful but often misunderstood in indexing pipelines. A confirmed event has stronger confidence than processed, but it is not equivalent to final settlement. Pipelines that apply confirmed events directly to user-visible balances without rollback strategy can show transient truth as permanent truth. Defensive التصميم acknowledges this و encodes reversible state transitions.\n\nReorg-aware indexing starts مع depth thresholds. ل each event, compute depth as head slot minus event slot. If depth is below confirmed threshold, event remains pending. If depth passes confirmed threshold, event can be applied to provisional state. If depth passes finalized threshold, event is considered settled. These rules should be policy inputs, not hidden constants.\n\nWhy maintain provisional state at all? Because users و systems often need timely feedback before finalization. The solution is not to ignore confirmed events but to annotate confidence clearly. Dashboards can show provisional balances مع settlement badges. Automated systems can choose whether to act on provisional or finalized data.\n\nFork choice changes can invalidate previously observed confirmed events. If your pipeline tracks applied keys و supports replay, you can recompute snapshot deterministically from deduped events و updated confirmation context. Pipelines that mutate opaque state without replay ability struggle during reorg recovery.\n\nDeterministic apply logic helps here. If the same deduped event set و same confirmation policy produce the same snapshot every run, recovery is straightforward. If apply order depends on arrival timing, recovery becomes guesswork.\n\nAnother reliability pattern is explicit pending queues. Instead of dropping low-depth events, keep them keyed و observable. This improves debugging: you can explain to users that an event exists but has not crossed confirmation threshold. It also avoids ingestion gaps when head advances.\n\nIntegrity checks should enforce structural assumptions: finalized keys must be a subset of applied keys, balances must be finite و non-negative under your business rules, و snapshot counts should align مع event sets. Failing these checks should mark snapshot as invalid و block downstream export.\n\nCommunication matters as much as mechanics. Product teams should avoid copy that implies final settlement when data is only confirmed. Small text differences reduce major support incidents during volatile periods.\n\nThe overarching principle is to make uncertainty explicit و reversible. Reorg-safe pipelines are less about predicting forks و more about handling them cleanly when they happen.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Define confirmed و finalized depth thresholds explicitly.\n- Separate pending, applied, و finalized event sets.\n- Keep replayable deterministic apply logic.\n- Run integrity checks on every snapshot export.\n- Surface settlement confidence clearly in UI و APIs.\n",
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
                    "note": "Candidate ل provisional state."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-pipeline-explorer": {
            "title": "Explorer: ingest to dedupe to confirm to apply",
            "content": "# Explorer: ingest to dedupe to confirm to apply\n\nA pipeline explorer should explain transformation stages clearly so engineers can inspect where correctness can break. ل indexing reliability, the core stages are ingest, dedupe, confirmation gating, و apply. Each stage must expose deterministic inputs و outputs.\n\nIngest stage receives raw events from simulated webhooks, log streams, or backfills. At this point, duplicates و out-of-order delivery are expected. The explorer should show raw count و normalized schema count so users can verify parser coverage.\n\nDedupe stage converts event arrays into a set based on composite keys. Good explorers display before/after counts و list dropped duplicates. This transparency helps debug webhook retries و backfill overlap behavior.\n\nConfirmation stage partitions deduped events into pending, applied, و finalized sets based on depth policy. The explorer should make head slot و policy thresholds visible. Hidden thresholds are a frequent source of confusion when teams compare environments.\n\nApply stage computes حساب balances or state snapshots deterministically from applied events only. Explorer outputs should include sorted balances و event key lists. Sorted output is crucial ل snapshot equality الاختبار.\n\nIntegrity stage validates structural assumptions: no negative balances, no non-finite numbers, finalized subset relation, و stable event references. The explorer should display PASS/FAIL و issue list. This teaches engineers to treat integrity checks as mandatory gates, not optional diagnostics.\n\nل backfills, explorer scenarios should include missing-slot windows و idempotency keys. This demonstrates how replay-safe job planning interacts مع the same dedupe و apply rules. A reliable backfill system does not bypass core pipeline logic.\n\nDeterministic report generation closes the loop. Export markdown ل human review و JSON ل machine consumption. Both should be reproducible from the same snapshot object. Avoid embedding volatile metadata in core payload fields.\n\nA well-designed explorer becomes a teaching tool و an operational tool. During incidents, teams can replay problematic event sets و compare outputs across policy versions. During onboarding, new engineers تعلم stage responsibilities quickly without production access.\n\nOperational ownership keeps this useful over time. Teams should rotate fixture maintenance responsibilities و document why each scenario exists so updates remain intentional. As protocols evolve, parser assumptions و event fields can drift. A maintained explorer corpus catches drift early, forces policy review before releases, و preserves confidence that ingest, dedupe, confirmation gating, و apply stages still produce reproducible results under stress.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Show per-stage counts و transformations.\n- Make confirmation policy parameters explicit.\n- Render sorted deterministic snapshots.\n- Gate exports on integrity checks.\n- Keep report payloads stable ل regression tests.\n",
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
        "description": "Build dedupe, confirmation-aware apply logic, integrity gates, و stable reporting artifacts ل operational triage.",
        "lessons": {
          "indexpipe-v2-dedupe-events": {
            "title": "Challenge: implement dedupeEvents()",
            "content": "Implement stable event deduplication مع deterministic composite keys.",
            "duration": "40 min",
            "hints": [
              "Build stable composite keys ل dedupe.",
              "Sort by key so output is deterministic across runs."
            ]
          },
          "indexpipe-v2-apply-confirmations": {
            "title": "Challenge: implement applyWithConfirmations()",
            "content": "Apply events deterministically مع confirmation depth policy و pending/finalized sets.",
            "duration": "40 min",
            "hints": [
              "Apply only confirmed-depth events to state.",
              "Track pending و finalized sets separately ل reorg safety."
            ]
          },
          "indexpipe-v2-backfill-idempotency": {
            "title": "Challenge: backfill و idempotency planning",
            "content": "Create deterministic backfill planning output مع replay-safe idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Backfills should be resumable و idempotent.",
              "Emit a deterministic key ل replay-safe job scheduling."
            ]
          },
          "indexpipe-v2-snapshot-integrity": {
            "title": "Challenge: snapshot integrity checks",
            "content": "Implement deterministic snapshotIntegrityCheck() outputs ل negative و structural failures.",
            "duration": "35 min",
            "hints": [
              "Integrity checks must fail on negative balances.",
              "Finalized keys must always be a subset of applied keys."
            ]
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline report export",
            "content": "Generate a stable markdown report artifact ل the Reorg-Safe Indexer checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be markdown و deterministic.",
              "Include applied/pending/finalized counts و integrity result."
            ]
          }
        }
      }
    }
  },
  "rpc-reliability-latency": {
    "title": "RPC Reliability & Latency Engineering",
    "description": "Engineer production multi-provider Solana RPC clients مع deterministic retry, routing, caching, و observability policies.",
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
        "description": "Real-world RPC failure behavior, endpoint selection strategy, و deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
            "content": "# RPC failures in real life: timeouts, 429s, stale nodes\n\nReliable client infrastructure begins مع realistic failure assumptions. RPC calls fail ل many reasons: transient network timeouts, provider rate limits, stale nodes trailing cluster head, و occasional inconsistent responses under load. A defensive client does not treat these as edge cases; it treats them as normal operating conditions.\n\nTimeouts are the most common class. If timeout values are too short, healthy providers appear unreliable. If too long, user-facing latency becomes unacceptable و retries trigger too late. Good policy defines request timeout by operation type و sets bounded retry schedules.\n\nHTTP 429 rate limiting is another predictable behavior, not a surprise. Providers enforce quotas و burst controls. A resilient client observes 429 ratio per endpoint و adapts by reducing pressure on overloaded nodes while shifting traffic to healthier ones. Blind retry against the same endpoint amplifies throttling.\n\nStale node lag is particularly dangerous ل state-sensitive applications. A node can respond quickly but serve outdated slot state, causing confusing balances or stale quote decisions. Endpoint health scoring should include slot lag, not only latency و success rate.\n\nMulti-provider strategy is the baseline ل serious applications. Even when one provider is excellent, outages و regional issues happen. A client should maintain endpoint metadata, collect health samples, و choose endpoints by deterministic policy rather than random rotation.\n\nObservability is what makes reliability engineering actionable. Track total requests, success/error counts, latency quantiles, و histogram buckets. Without this telemetry, teams tune retry policies by anecdote. مع telemetry, teams can identify whether changes improve p95 latency or simply shift failures around.\n\nDeterministic policy modeling is valuable before production integration. You can simulate endpoint samples و verify that selection behavior is stable و explainable. If the chosen endpoint changes unexpectedly ل identical input samples, your scoring function needs refinement.\n\nCaching adds complexity. Cache misses و stale reads are not just الاداء details; they affect correctness. Invalidation policy should react to حساب changes و node lag. Aggressive invalidation may increase load; weak invalidation may serve stale state. Explicit policy و metrics help navigate this tradeoff.\n\nThe core message is pragmatic: assume RPC instability, التصميم ل graceful degradation, و measure everything مع deterministic reducers that can be unit tested.\n\n\nOperational readiness also requires owning fixture updates as providers change rate-limit behavior و latency profiles. If fixture sets stay static, policy tuning optimizes ل old incidents و misses new failure signatures. Keep a cadence ل reviewing percentile distributions, endpoint score drift, و retry outcomes so deterministic policies remain grounded in current provider behavior while preserving reproducibility.\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Operator mindset\n\nRPC policy is risk routing, not just request routing. Endpoint choice, retry cadence, و cache invalidation directly determine whether users see timely truth or stale confusion.\n\n## Checklist\n- Treat timeouts, 429s, و stale lag as default conditions.\n- Use multi-provider endpoint selection مع health scoring.\n- Include slot lag in endpoint quality calculations.\n- Define retry schedules مع bounded backoff.\n- Instrument latency و success metrics continuously.\n",
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
                      "Slot lag only affects مدقق rewards",
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
            "title": "Multi-endpoint strategies: hedged requests و fallbacks",
            "content": "# Multi-endpoint strategies: hedged requests و fallbacks\n\nMulti-endpoint التصميم is more than adding a backup URL. It is a scheduling problem where each request should be sent to the most suitable endpoint given recent health signals و operation urgency. This درس focuses on deterministic strategy patterns you can validate offline.\n\nFallback strategy is the simplest pattern: try one endpoint, then another on failure. It reduces outage risk but may still produce high tail latency if initial endpoints are degraded. Hedged strategy improves tail latency by issuing a second request after a short delay if the first has not returned. Hedging increases load, so it must be controlled by policy و only used ل high-value paths.\n\nEndpoint selection should rely on a composite score that includes success rate, p95 latency, rate-limit ratio, slot lag, و optional static weight ل trusted providers. Scores should be computed deterministically from sampled inputs so decisions are reproducible. Tie-breaking should also be deterministic to avoid flapping.\n\nRate-limit-aware routing is critical. If one provider shows increasing 429 ratio, a resilient client should back off traffic there و prefer alternatives. This avoids retry storms و helps maintain aggregate throughput.\n\nRegional diversity adds resilience. If all endpoints are in one region, regional network incidents can affect all providers simultaneously. Tagging endpoints by region allows policy constraints such as preferring local region first but failing over cross-region when health degrades.\n\nCircuit-breaking patterns can protect users during severe incidents. If an endpoint crosses error thresholds, mark it temporarily degraded و avoid selecting it ل a cooling period. Deterministic simulations can model this behavior without real network calls.\n\nObservability ties it together. Endpoint decisions should emit reasoning strings or structured fields so operators can inspect why a node was chosen. This is especially useful when users report intermittent failures.\n\nIn many systems, endpoint policy و retry policy are separate وحدات. Keep interfaces clean: selection chooses target endpoint, retry schedule defines attempts و delays, metrics reducer evaluates outcomes. This separation improves testability و change safety.\n\nFinally, avoid hidden randomness in core selection logic. Randomized tie-breakers may seem harmless but they complicate reproducibility و debugging. Deterministic order supports reliable incident analysis.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Score endpoints using multiple reliability signals.\n- Use deterministic tie-breaking to avoid flapping.\n- Apply rate-limit-aware traffic shifting.\n- Keep fallback و retry policy responsibilities separate.\n- Emit endpoint reasoning ل operational debugging.\n",
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
                    "output": "score lower due to throttling و lag",
                    "note": "Fast but less reliable under pressure."
                  }
                ]
              }
            ]
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
            "content": "# Explorer: retry/backoff simulator\n\nRetry و backoff policies determine whether clients recover gracefully or amplify outages. A simulator should make schedule behavior explicit so teams can reason about user latency و provider pressure. This درس builds a deterministic view of retry policy outputs و their tradeoffs.\n\nA retry schedule has three core dimensions: number of attempts, per-attempt timeout, و delay before each retry. Exponential backoff grows delay rapidly و reduces pressure in prolonged incidents. Linear backoff grows slower و can be useful ل short-lived blips. Both need max-delay caps to avoid runaway wait times.\n\nThe first attempt should always be represented in the schedule مع zero delay. This improves traceability و ensures telemetry can map attempt index to behavior consistently. Many teams model only retries و lose visibility into full request lifecycle.\n\nPolicy inputs should be validated. Negative retries or non-positive timeouts are configuration errors و should fail fast. Deterministic validation in a pure function prevents silent misconfiguration in production.\n\nThe simulator should also show expected user-facing latency envelope. ل example, timeout 900ms مع two retries و exponential delays of 100ms و 200ms implies worst-case response around 2.9 seconds before failover completion. This helps product teams set realistic loading copy.\n\nRetry policy must integrate مع endpoint selection. Retrying against the same degraded endpoint repeatedly is usually inferior to endpoint-aware retries. Even if your simulator keeps وحدات separate, it should explain this interaction.\n\nJitter is often used in distributed systems to prevent synchronization spikes. In this deterministic دورة we omit jitter from challenge outputs ل snapshot stability, but teams should understand where jitter fits in production.\n\nMetrics reducers provide feedback loop ل tuning. If p95 improves but error count rises, policy may be too aggressive. If errors drop but latency explodes, policy may be too conservative. Deterministic histogram و quantile outputs make this tradeoff visible.\n\nA final best practice is policy versioning. When retry settings change, compare outputs ل fixture scenarios before النشر. This catches accidental behavior changes و enables confident rollbacks.\n\nOperational readiness also requires a habit of refreshing fixture sets as provider behavior evolves. Rate-limit patterns, slot lag profiles, و latency distributions change over time, و static fixtures can hide policy regressions. Reliability teams should schedule periodic fixture audits, compare score deltas across providers, و document threshold changes so retry و selection policies remain explainable و reproducible under current network conditions.\n\n\nThis material should be operationalized مع deterministic fixtures و explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, و severe stress. ل each scenario, compare policy outputs before و after changes, و require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned مع runtime behavior, و makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, و they keep fixture ownership explicit so updates remain intentional و auditable.\n\n## Checklist\n- Represent full schedule including initial attempt.\n- Validate retry configuration inputs strictly.\n- Bound delays مع max caps.\n- Estimate user-facing worst-case latency from schedule.\n- Review policy changes against deterministic fixtures.\n",
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
        "description": "Build deterministic policy engines ل routing, retries, metrics reduction, و health report exports.",
        "lessons": {
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
            "content": "Build deterministic timeout و retry schedule outputs from policy input.",
            "duration": "40 min",
            "hints": [
              "Build a deterministic retry schedule including the first attempt.",
              "Cap delays at maxDelayMs."
            ]
          },
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
            "content": "Choose the best endpoint deterministically from health samples و endpoint metadata.",
            "duration": "40 min",
            "hints": [
              "Blend success rate, latency, 429 pressure, و slot lag into one score.",
              "Tie-break deterministically by endpoint ID."
            ]
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching و invalidation policy",
            "content": "Emit deterministic cache invalidation actions when حساب updates و lag signals arrive.",
            "duration": "35 min",
            "hints": [
              "Invalidate حساب-keyed cache entries deterministically.",
              "Use tighter TTL when node lag grows."
            ]
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer و histogram buckets",
            "content": "Reduce simulated RPC events into deterministic histogram و p50/p95 metrics.",
            "duration": "35 min",
            "hints": [
              "Reduce RPC telemetry into histogram buckets و quantiles.",
              "Keep bucket boundaries explicit ل deterministic snapshots."
            ]
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
            "content": "Export deterministic JSON و markdown health report artifacts ل multi-provider reliability review.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export both JSON و markdown.",
              "Ensure field order is stable in JSON output."
            ]
          }
        }
      }
    }
  },
  "rust-data-layout-borsh": {
    "title": "Rust Data Layout & Borsh Mastery",
    "description": "Rust-first Solana data layout engineering مع deterministic byte-level tooling و compatibility-safe schema practices.",
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
        "description": "Alignment behavior, Borsh encoding rules, و عملي parsing safety ل stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, و why Solana حسابات care",
            "content": "# Memory layout: alignment, padding, و why Solana حسابات care\n\nRust layout behavior is deterministic inside one compiled binary but can vary when assumptions are implicit. ل Solana حسابات, this matters because raw bytes are persisted on-chain و parsed by multiple clients across versions. If you التصميم حساب structures without explicit layout strategy, subtle padding و alignment changes can break compatibility or produce incorrect parsing in downstream tools.\n\nRust default layout optimizes ل compiler freedom. Field order in memory ل plain structs is not a stable ABI contract unless you opt into representations such as repr(C). In low-level حساب work, repr(C) gives more predictable ordering و alignment behavior, but it does not remove all complexity. Padding still appears between fields when alignment requires it. ل example, a u8 followed by u64 introduces 7 bytes of padding before the u64 offset. If your parser ignores this, every field after that point is shifted و corrupted.\n\nOn Solana, حساب rent is proportional to byte size, so padding is not only a correctness issue; it is a cost issue. Poor field ordering can inflate حساب sizes across millions of حسابات. A common optimization is grouping larger aligned fields first, then smaller fields. But this must be balanced against readability و migration safety. If you reorder fields in a live protocol, old data may no longer parse under new assumptions. Migration tooling should be explicit و versioned.\n\nBorsh serialization avoids some ABI ambiguity by defining field order in schema rather than raw struct memory. However, zero-copy patterns و manual slicing still depend on precise offsets. Teams should understand both worlds: in-memory layout rules ل zero-copy و schema-based encoding rules ل Borsh.\n\nIn production engineering, layout decisions should be documented مع deterministic outputs: field offsets, per-field padding, struct alignment, و total size. These outputs can be compared in CI to catch accidental drift from refactors. The goal is not theoretical elegance; the goal is stable data contracts over time.\n\n## Operator mindset\n\nSchema bytes are production API surface. Treat offset changes, enum ordering, و parser semantics as compatibility events requiring explicit review.\n\nProduction teams should treat layout و serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, و require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, و parser error behavior ل malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on حساب size, rent budget, و compatibility. Deterministic helpers make this عملي: you can produce a stable JSON report in CI و diff it like source code. In Solana و Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after النشر.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough ل incident response. Good error payloads include field name, offset, و failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important ل indexers و analytics pipelines that need to decide whether to quarantine an event or retry مع a newer schema version. Teams that encode rich deterministic error reports reduce triage time و avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, و test every boundary condition before shipping.\n\nTeams should also document explicit schema الحوكمة rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, و compatibility مع archived reports. A healthy الحوكمة checklist asks who owns schema evolution, how compatibility windows are communicated, و which fixtures are mandatory before release. This level of process may feel heavy ل small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the عملي mechanism that keeps this الحوكمة lightweight enough to use: they are simple to diff, easy to discuss, و difficult to misinterpret.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rdb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rdb-v2-l1-q1",
                    "prompt": "Why does a u8 before u64 often increase حساب size?",
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
            "title": "Struct و enum layout pitfalls plus Borsh rules",
            "content": "# Struct و enum layout pitfalls plus Borsh rules\n\nBorsh is widely used because it gives deterministic serialization across languages, but teams still get tripped up by how enums, vectors, و strings map to bytes. Understanding these rules is essential ل robust حساب parsing و client interoperability.\n\nل structs, Borsh encodes fields in declaration order. There is no implicit alignment padding in the serialized stream. That is different from in-memory layout و one reason Borsh is popular ل stable wire formats. ل enums, Borsh writes a one-byte variant index first, then the variant payload. Changing variant order in code changes the index mapping و is therefore a breaking format change. This is a common source of accidental incompatibility.\n\nVectors و strings are length-prefixed مع little-endian u32 before data bytes. If parsing code trusts the length blindly without bounds checks, malformed or truncated data can cause out-of-bounds reads or allocation abuse. Safe parsers validate available bytes before allocating or slicing.\n\nAnother pitfall is conflating pubkey strings مع pubkey bytes. Borsh encodes bytes, not base58 text. If a client serializes public keys as strings while another expects 32-byte arrays, decoding fails despite both sides using \"Borsh\" terminology. Teams should define schema types precisely.\n\nError التصميم is part of serialization safety. Distinguish malformed length prefix, unknown enum variant, unsupported dynamic type, و primitive decode out-of-bounds. Structured errors let callers decide whether to retry, drop, or quarantine payloads.\n\nFinally, encoding و decoding tests should run symmetrically مع fixed fixtures. A deterministic fixture suite catches regressions early و gives confidence that Rust, TypeScript, و analytics parsers agree on the same bytes.\nProduction teams should treat layout و serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, و require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, و parser error behavior ل malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on حساب size, rent budget, و compatibility. Deterministic helpers make this عملي: you can produce a stable JSON report in CI و diff it like source code. In Solana و Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after النشر.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough ل incident response. Good error payloads include field name, offset, و failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important ل indexers و analytics pipelines that need to decide whether to quarantine an event or retry مع a newer schema version. Teams that encode rich deterministic error reports reduce triage time و avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, و test every boundary condition before shipping.\n\nTeams should also document explicit schema الحوكمة rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, و compatibility مع archived reports. A healthy الحوكمة checklist asks who owns schema evolution, how compatibility windows are communicated, و which fixtures are mandatory before release. This level of process may feel heavy ل small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the عملي mechanism that keeps this الحوكمة lightweight enough to use: they are simple to diff, easy to discuss, و difficult to misinterpret.\n",
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
            "title": "Explorer: layout visualizer ل field offsets",
            "content": "# Explorer: layout visualizer ل field offsets\n\nA layout visualizer turns abstract alignment rules into concrete numbers engineers can review. Instead of debating whether a struct is \"probably fine,\" teams can inspect exact offsets, padding, و total size.\n\nThe visualizer workflow is straightforward: provide ordered fields و types, compute alignments, insert required padding, و emit final layout metadata. This output should be deterministic و serializable so CI can compare snapshots.\n\nWhen using this in Solana development, combine visualizer output مع حساب rent planning و migration docs. If a proposed field addition increases total size, quantify the impact و decide whether to append, split حساب state, or introduce versioned حسابات. Do not rely on intuition ل byte-level decisions.\n\nVisualizers are also useful ل onboarding. New contributors can quickly see why u8/u64 ordering changes offsets و why safe parsers need explicit bounds checks. This reduces recurring parsing bugs و review churn.\n\nA high-quality visualizer report includes field name, offset, size, alignment, padding-before, trailing padding, و struct alignment. Keep key ordering stable so report diffs remain readable.\n\nEngineers should pair visualizer output مع parse tests. If layout says a bool lives at offset 0 و u8 at offset 1, parser tests should assert exactly that. Deterministic systems connect التصميم artifacts و runtime checks.\nProduction teams should treat layout و serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, و require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, و parser error behavior ل malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on حساب size, rent budget, و compatibility. Deterministic helpers make this عملي: you can produce a stable JSON report in CI و diff it like source code. In Solana و Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after النشر.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough ل incident response. Good error payloads include field name, offset, و failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important ل indexers و analytics pipelines that need to decide whether to quarantine an event or retry مع a newer schema version. Teams that encode rich deterministic error reports reduce triage time و avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, و test every boundary condition before shipping.\n\nTeams should also document explicit schema الحوكمة rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, و compatibility مع archived reports. A healthy الحوكمة checklist asks who owns schema evolution, how compatibility windows are communicated, و which fixtures are mandatory before release. This level of process may feel heavy ل small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the عملي mechanism that keeps this الحوكمة lightweight enough to use: they are simple to diff, easy to discuss, و difficult to misinterpret.\n",
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
        "title": "حساب Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, و compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
            "content": "Compute deterministic field offsets, alignment padding, و total struct size.",
            "duration": "40 min",
            "hints": [
              "Use alignment-aware offsets و include padding fields in the result.",
              "Struct total size should be aligned to max field alignment."
            ]
          },
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
            "content": "Implement deterministic Borsh encode/decode مع structured error handling.",
            "duration": "40 min",
            "hints": [
              "Borsh strings are length-prefixed little-endian u32 + UTF-8 bytes.",
              "Keep encode/decode symmetric ل deterministic tests."
            ]
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
            "content": "Model deterministic tradeoff scoring between zero-copy و Borsh approaches.",
            "duration": "35 min",
            "hints": [
              "Model tradeoffs deterministically: read speed vs schema flexibility.",
              "Recommendation should be pure function of inputs."
            ]
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
            "content": "Parse حساب bytes مع deterministic bounds checks و structured errors.",
            "duration": "35 min",
            "hints": [
              "Validate byte length before field parsing.",
              "Return structured errors ل invalid booleans و unsupported field types."
            ]
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
            "content": "Produce stable JSON و markdown layout artifacts ل the final project.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export stable JSON + markdown.",
              "Avoid random IDs و timestamps in output."
            ]
          }
        }
      }
    }
  },
  "rust-errors-invariants": {
    "title": "Rust Error التصميم & Invariants",
    "description": "Build typed invariant guard libraries مع deterministic evidence artifacts, compatibility-safe error contracts, و audit-ready reporting.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "errors",
      "invariants",
      "reliability"
    ],
    "modules": {
      "rei-v2-foundations": {
        "title": "Rust Error و Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, و deterministic invariant التصميم fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
            "content": "# Error taxonomy: recoverable vs fatal\n\nRust encourages explicit error modeling, but teams still produce weak error contracts when they rely on ad hoc strings or inconsistent wrappers. In Solana و Anchor-adjacent systems, this becomes painful quickly because on-chain failures, off-chain pipelines, و frontend UX all need coherent semantics.\n\nA عملي taxonomy starts مع recoverable versus fatal classes. Recoverable errors represent expected contract violations: stale data, missing signer, value out of range, or transient dependency mismatch. Fatal errors represent corrupted assumptions: impossible state, incompatible schema version, or invariant breach that requires operator intervention.\n\nTyped enums are the center of this التصميم. A code such as NEGATIVE_VALUE or MISSING_AUTHORITY is unambiguous و searchable. Attaching structured context fields gives downstream systems enough detail ل logging و user-facing copy without string parsing.\n\nAvoid stringly error contracts where every caller invents custom messages. Those systems accumulate inconsistent wording و ambiguous categories. Instead, keep messages deterministic و derive user copy from code + context in one mapping layer.\n\nInvariants should be designed ل testability. If an invariant cannot be expressed as a deterministic function over known inputs, it is hard to validate و easy to regress. Start مع small ensure helpers that return typed results, then compose them into higher-level guards.\n\nIn production, error taxonomies should be reviewed like API changes. Renaming codes or changing severity mapping can break alert rules و client handling. Version these changes و validate مع fixture suites.\n\n## Operator mindset\n\nInvariant errors are operational contracts. If code, severity, و context are not stable, monitoring و user recovery flows degrade even when logic is correct.\n\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, و explicit severity mapping so runtime incidents are diagnosable without guessing. ل invariants, each failed check should identify what contract was violated, where in the flow it happened, و whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent و alert tuning becomes fragile. A typed error library مع deterministic reports solves this by making failure semantics machine-readable و human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain مع injected timestamps و step IDs gives auditors و engineers a replayable explanation of what passed, what failed, و in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old و new evidence outputs و verify expected changes before النشر. Over time, these deterministic artifacts become part of release discipline و reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries و confirm that alerts, dashboards, و user-facing copy still map correctly. If mappings drift, update guides و fallback behavior should ship together مع code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users و support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, و a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors و reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it مع quarterly reviews where engineers evaluate false-positive rates, update context fields, و verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, و communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                      "They remove need ل logs",
                      "They reduce compile time"
                    ],
                    "answerIndex": 0,
                    "explanation": "Typed codes make handling و monitoring deterministic."
                  }
                ]
              }
            ]
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, و context",
            "content": "# Result<T, E> patterns, ? operator, و context\n\nResult-based control flow is one of Rust's strongest tools ل building robust services و on-chain-adjacent clients. The key is not merely using Result, but designing error types و propagation boundaries that preserve enough context ل debugging و UX decisions.\n\nThe ? operator keeps code concise, but it can hide context unless error conversion layers are explicit. Invariant-centric systems should wrap lower-level failures مع domain meaning before returning to upper layers. ل example, a parse failure in حساب metadata should map to a deterministic invariant code و include the field path.\n\nContext should be structured rather than baked into message text. A map of key/value fields like {label, value, limit} is easier to aggregate و filter than sentence fragments. It also supports localization و role-specific message rendering.\n\nAnother pattern is separating validation from side effects. If ensure helpers only evaluate conditions و construct typed errors, they are deterministic و unit-testable. Side effects such as logging or telemetry emission can happen at call boundaries.\n\nWhen building libraries, avoid exposing too many internal codes. Public codes should represent stable contracts, while internal details can remain nested context. This helps keep compatibility manageable.\n\nTest strategy should include positive cases, negative cases, و report formatting checks. Deterministic report output is valuable ل code review because changes are visible as stable diffs, not only behavioral assertions.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, و explicit severity mapping so runtime incidents are diagnosable without guessing. ل invariants, each failed check should identify what contract was violated, where in the flow it happened, و whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent و alert tuning becomes fragile. A typed error library مع deterministic reports solves this by making failure semantics machine-readable و human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain مع injected timestamps و step IDs gives auditors و engineers a replayable explanation of what passed, what failed, و in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old و new evidence outputs و verify expected changes before النشر. Over time, these deterministic artifacts become part of release discipline و reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries و confirm that alerts, dashboards, و user-facing copy still map correctly. If mappings drift, update guides و fallback behavior should ship together مع code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users و support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, و a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors و reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it مع quarterly reviews where engineers evaluate false-positive rates, update context fields, و verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, و communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                    "note": "Typed و deterministic"
                  }
                ]
              }
            ]
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
            "content": "# Explorer: invariant decision tree\n\nAn invariant decision tree helps teams reason about guard ordering و failure priority. Not every invariant should be checked in arbitrary order. Early checks should prevent expensive work و produce the clearest failure semantics.\n\nA common flow: structural preconditions first, authority checks second, value bounds third, relational checks fourth. This ordering minimizes noisy failures و improves auditability. If authority is missing, there is little value in evaluating downstream value checks.\n\nDecision trees also help map errors to UX behavior. A recoverable user input violation may show inline correction hints, while a fatal integrity breach should hard-stop مع escalation messaging.\n\nIn deterministic systems, tree traversal should be explicit و testable. Given the same input, the same failing node should be reported every time. This allows stable evidence chains و reliable automation.\n\nExplorer tooling can visualize this by showing the path taken, checks skipped, و final outcome. Teams can then tune guard order intentionally و document rationale.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, و explicit severity mapping so runtime incidents are diagnosable without guessing. ل invariants, each failed check should identify what contract was violated, where in the flow it happened, و whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent و alert tuning becomes fragile. A typed error library مع deterministic reports solves this by making failure semantics machine-readable و human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain مع injected timestamps و step IDs gives auditors و engineers a replayable explanation of what passed, what failed, و in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old و new evidence outputs و verify expected changes before النشر. Over time, these deterministic artifacts become part of release discipline و reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries و confirm that alerts, dashboards, و user-facing copy still map correctly. If mappings drift, update guides و fallback behavior should ship together مع code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users و support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, و a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors و reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it مع quarterly reviews where engineers evaluate false-positive rates, update context fields, و verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, و communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
        "description": "Implement guard helpers, evidence-chain generation, و stable audit reporting ل reliability و incident response.",
        "lessons": {
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
            "content": "Implement typed invariant errors و deterministic ensure helpers.",
            "duration": "40 min",
            "hints": [
              "Return typed error payloads, not raw strings.",
              "Keep ensure() deterministic و side-effect free."
            ]
          },
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
            "content": "Build a deterministic evidence chain مع injected timestamps.",
            "duration": "40 min",
            "hints": [
              "Inject/mock timestamps ل deterministic evidence chains.",
              "Step ordering must remain stable ل snapshot tests."
            ]
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
            "content": "Run deterministic invariant case sets و return failed IDs.",
            "duration": "35 min",
            "hints": [
              "Property-ish deterministic tests can still run as fixed case sets.",
              "Return explicit failed IDs ل debugability."
            ]
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
            "content": "Format a deterministic markdown evidence report.",
            "duration": "35 min",
            "hints": [
              "Markdown report should preserve stable step order و deterministic formatting.",
              "Include aggregate status و per-step evidence lines."
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
    "title": "Rust الاداء ل On-chain Thinking",
    "description": "Simulate و optimize compute-cost behavior مع deterministic Rust-first tooling و budget-driven الاداء الحوكمة.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "performance",
      "compute",
      "solana"
    ],
    "modules": {
      "rpot-v2-foundations": {
        "title": "الاداء Foundations",
        "description": "Rust الاداء النموذج الذهنيs, data-structure tradeoffs, و deterministic cost reasoning ل reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "الاداء النموذج الذهني: allocations, clones, hashing",
            "content": "# الاداء النموذج الذهني: allocations, clones, hashing\n\nRust الاداء work in Solana ecosystems is mostly about data movement discipline. Teams often chase micro-optimizations while ignoring dominant costs such as repeated allocations, unnecessary cloning, و redundant hashing in loops.\n\nA useful النموذج الذهني starts مع cost buckets. Allocation cost includes heap growth, allocator metadata, و cache disruption. Clone cost depends on object size و ownership patterns. Hash cost depends on bytes hashed و hash invocation frequency. Loop cost depends on iteration count و per-iteration work. Map lookup cost depends on data structure choice و access pattern.\n\nThe point of this model is not exact runtime cycles. The point is relative pressure. If one path performs ten allocations و another performs one allocation, the former should trigger scrutiny even before microbenchmarking.\n\nOn-chain thinking reinforces this: compute budgets are finite, و predictable resource usage matters. Even off-chain indexers و simulators benefit from the same discipline because latency tails و CPU burn impact reliability.\n\nDeterministic models are ideal ل CI. Given identical operation counts, output should be identical. Reviewers can reason about deltas directly و reject regressions early.\n\n## Operator mindset\n\nالاداء guidance should be versioned و budgeted. Without explicit budgets و stable cost categories, optimization work drifts toward anecdote instead of measurable outcomes.\n\nالاداء engineering ل on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines و CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline ل regression detection. The model does not replace real profiling; it complements it by making early التصميم tradeoffs explicit و reviewable.\n\nWhen you model costs, keep weights documented و intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient و track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports مع before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers و client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined مع suggestion outputs و checkpoint reports, these models become عملي guardrails ل engineering quality.\n\nMature teams combine these deterministic models مع periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients و rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation و keeps recommendations aligned مع actual system behavior. The key is to treat model updates as versioned changes مع explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why الاداء guidance changed و how improvements were verified.\n\nTeams should also define الاداء budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete و avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets و require explicit waivers when thresholds are exceeded. Keep waiver text deterministic و tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable الاداء culture where improvements are intentional, measurable, و easy to audit.\n",
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
                      "They remove need ل tests"
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
            "content": "# Data structures: Vec, HashMap, BTreeMap tradeoffs\n\nData structure choice is one of the highest leverage الاداء decisions in Rust systems. Vec offers compact contiguous storage و predictable iteration speed. HashMap offers average-case fast lookup but can have higher allocation و hashing overhead. BTreeMap provides ordered keys و stable traversal costs مع different memory locality characteristics.\n\nIn on-chain-adjacent simulations و indexers, workloads vary. If you mostly append و iterate, Vec plus binary search or index maps can outperform heavier maps. If random key lookup dominates, HashMap may win despite hash overhead. If deterministic ordering is required ل report output or canonical snapshots, BTreeMap can simplify stable behavior.\n\nThe wrong pattern is premature abstraction that hides access patterns. Engineers should instrument operation counts و use cost models to evaluate actual use cases. Deterministic benchmark fixtures make this reproducible.\n\nAnother عملي tradeoff is allocation strategy. Reusing buffers و reserving capacity can reduce churn substantially. This is often more impactful than iterator-vs-loop debates.\n\nKeep التصميم reviews concrete: expected reads, writes, key cardinality, ordering requirements, و mutation frequency. Then choose structures intentionally و document rationale.\nالاداء engineering ل on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines و CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline ل regression detection. The model does not replace real profiling; it complements it by making early التصميم tradeoffs explicit و reviewable.\n\nWhen you model costs, keep weights documented و intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient و track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports مع before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers و client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined مع suggestion outputs و checkpoint reports, these models become عملي guardrails ل engineering quality.\n\nMature teams combine these deterministic models مع periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients و rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation و keeps recommendations aligned مع actual system behavior. The key is to treat model updates as versioned changes مع explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why الاداء guidance changed و how improvements were verified.\n\nTeams should also define الاداء budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete و avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets و require explicit waivers when thresholds are exceeded. Keep waiver text deterministic و tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable الاداء culture where improvements are intentional, measurable, و easy to audit.\n",
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
                    "note": "Good ل sequential work"
                  },
                  {
                    "cmd": "HashMap lookups",
                    "output": "fast random access, hash overhead",
                    "note": "Good ل key-based fetch"
                  }
                ]
              }
            ]
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
            "content": "# Explorer: cost model sandbox\n\nA cost sandbox lets teams test optimization hypotheses without waiting ل full benchmark infrastructure. Provide operation counts, compute weighted costs, و inspect which buckets dominate total pressure.\n\nThe sandbox should separate baseline و optimized inputs so diffs are explicit. If a change claims fewer allocations but increases map lookups sharply, the model should show the net effect. This prevents one-dimensional optimization that regresses other paths.\n\nSuggestion generation should be threshold-based و deterministic. ل example, if allocation cost exceeds a threshold, recommend pre-allocation و buffer reuse. If serialization cost dominates, recommend batching or avoiding repeated decode/encode loops.\n\nStable report outputs are critical ل engineering workflows. JSON payloads feed CI checks, markdown summaries support code review و team communication. Keep key ordering stable so string equality tests remain meaningful.\n\nSandboxes are not production profilers, but they are excellent decision support tools when kept deterministic و aligned مع known workload patterns.\nالاداء engineering ل on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines و CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline ل regression detection. The model does not replace real profiling; it complements it by making early التصميم tradeoffs explicit و reviewable.\n\nWhen you model costs, keep weights documented و intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient و track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports مع before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers و client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined مع suggestion outputs و checkpoint reports, these models become عملي guardrails ل engineering quality.\n\nMature teams combine these deterministic models مع periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients و rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation و keeps recommendations aligned مع actual system behavior. The key is to treat model updates as versioned changes مع explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why الاداء guidance changed و how improvements were verified.\n\nTeams should also define الاداء budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete و avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets و require explicit waivers when thresholds are exceeded. Keep waiver text deterministic و tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable الاداء culture where improvements are intentional, measurable, و easy to audit.\n",
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
        "description": "Build deterministic profilers, recommendation engines, و report outputs aligned to explicit الاداء budgets.",
        "lessons": {
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
            "content": "Estimate deterministic operation costs from fixed weighting rules.",
            "duration": "40 min",
            "hints": [
              "Use deterministic arithmetic weights ل each operation category.",
              "Return component breakdown plus total ل easier optimization diffs."
            ]
          },
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
            "content": "Apply deterministic before/after metric reductions و diff outputs.",
            "duration": "40 min",
            "hints": [
              "Treat optimization as deterministic metric diffs, not runtime benchmarking.",
              "Clamp reduced metrics at zero."
            ]
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
            "content": "Compute deterministic serialization overhead و byte savings.",
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
            "content": "Export deterministic JSON و markdown profiler reports.",
            "duration": "45 min",
            "hints": [
              "Checkpoint must include stable JSON و markdown outputs.",
              "Use deterministic percentage rounding."
            ]
          }
        }
      }
    }
  },
  "rust-async-indexer-pipeline": {
    "title": "Concurrency & Async ل Indexers (Rust)",
    "description": "Rust-first async pipeline engineering مع bounded concurrency, replay-safe reducers, و deterministic operational reporting.",
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
        "description": "Async/concurrency fundamentals, backpressure behavior, و deterministic execution modeling ل indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
            "content": "# Async fundamentals: futures, tasks, channels\n\nRust async systems are built on explicit scheduling rather than implicit thread-per-task models. Futures represent pending work, executors poll futures, و channels coordinate data flow. ل indexers, this architecture supports high throughput but requires careful control of concurrency و backpressure.\n\nA common failure mode is unbounded task spawning. It may look fine in local tests, then collapse in production under burst traffic due to memory pressure و queue growth. Defensive التصميم uses bounded concurrency مع explicit task budgets.\n\nChannels are powerful but can hide overload when used without capacity limits. Bounded channels make pressure visible: producers block or shed work when consumers lag. In deterministic simulations, this behavior can be modeled by explicit queues و tick-based progression.\n\nThe key mindset is reproducibility. If pipeline behavior cannot be replayed deterministically, debugging و regression الاختبار become guesswork. Simulated executors solve this by removing wall-clock dependence.\n\n## Operator mindset\n\nAsync pipelines are reliability systems, not just throughput systems. Concurrency limits, retry behavior, و reducer determinism must stay auditable under stress.\n\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers و threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler مع deterministic tick advancement provides a clean environment ل validating bounded concurrency, retry sequencing, و backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, و completion order is reproducible.\n\nBackpressure التصميم should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably و metrics should expose this. Deterministic tests can assert queue length, total ticks, و completion order ل stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency و stable reducers. Duplicate deliveries should collapse by key, و snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy و incident triage slows down. Stable JSON و markdown reports prevent that by keeping artifacts comparable between runs و between code versions.\n\nOperational teams should maintain scenario catalogs ل burst traffic, retry storms, و partial-stage failures. Each scenario should specify expected queue depth, retry schedule, و final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios و تعلم system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters ل accepted work, deferred work, retries, و dropped events. Without these counters, backpressure incidents become anecdotal و tuning decisions become reactive. مع deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI مع mocked scheduler runs, و regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, و explicit failure budgets. ل educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks ل each failure mode و link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, و communication templates ل fast coordination.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "raip-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "raip-v2-l1-q1",
                    "prompt": "Why prefer bounded concurrency ل indexer tasks?",
                    "options": [
                      "It prevents runaway memory و queue growth",
                      "It guarantees zero failures",
                      "It eliminates retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "Bounded concurrency keeps load behavior controlled و observable."
                  }
                ]
              }
            ]
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits و backpressure",
            "content": "# Concurrency limits و backpressure\n\nBackpressure is not optional in high-volume pipelines. Without it, producer speed can overwhelm reducers, retries, or storage sinks. A resilient التصميم sets explicit concurrency caps و queue semantics that are easy to reason about.\n\nSemaphore-style limits are a common pattern: only N tasks can run at once. Additional tasks wait in queue. Deterministic simulation can model this مع a running list و remaining tick counters.\n\nRetry behavior interacts مع backpressure. If retries ignore queue pressure, they amplify congestion. Deterministic retry schedules should be bounded و inspectable.\n\nالتصميم reviews should ask: what is max concurrent work, what is queue policy, what happens on overload, و how is fairness maintained. Stable run reports provide concrete answers.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers و threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler مع deterministic tick advancement provides a clean environment ل validating bounded concurrency, retry sequencing, و backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, و completion order is reproducible.\n\nBackpressure التصميم should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably و metrics should expose this. Deterministic tests can assert queue length, total ticks, و completion order ل stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency و stable reducers. Duplicate deliveries should collapse by key, و snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy و incident triage slows down. Stable JSON و markdown reports prevent that by keeping artifacts comparable between runs و between code versions.\n\nOperational teams should maintain scenario catalogs ل burst traffic, retry storms, و partial-stage failures. Each scenario should specify expected queue depth, retry schedule, و final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios و تعلم system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters ل accepted work, deferred work, retries, و dropped events. Without these counters, backpressure incidents become anecdotal و tuning decisions become reactive. مع deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI مع mocked scheduler runs, و regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, و explicit failure budgets. ل educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks ل each failure mode و link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, و communication templates ل fast coordination.\n",
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
                    "note": "bounded و predictable"
                  }
                ]
              }
            ]
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph و concurrency",
            "content": "# Explorer: pipeline graph و concurrency\n\nPipeline graphs help teams communicate stage boundaries, concurrency budgets, و retry behaviors. A graph that shows ingest, dedupe, retry, و snapshot stages مع explicit capacities is far more actionable than prose descriptions.\n\nIn deterministic simulation, each stage can be represented as queue + worker budget. Events progress in ticks, و transitions are logged in timeline snapshots. This makes race conditions و starvation visible.\n\nA good explorer shows total ticks, completion order, و per-tick running/completed sets. These artifacts become checkpoints ل regression tests.\n\nPair graph exploration مع idempotency key tests. Duplicate events should not mutate state repeatedly. Stable reducers و sorted outputs make this easy to verify.\n\nThe final objective is operational confidence: when congestion or reorg scenarios occur, teams can replay deterministic fixtures و compare expected versus actual behavior quickly.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers و threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler مع deterministic tick advancement provides a clean environment ل validating bounded concurrency, retry sequencing, و backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, و completion order is reproducible.\n\nBackpressure التصميم should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably و metrics should expose this. Deterministic tests can assert queue length, total ticks, و completion order ل stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency و stable reducers. Duplicate deliveries should collapse by key, و snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy و incident triage slows down. Stable JSON و markdown reports prevent that by keeping artifacts comparable between runs و between code versions.\n\nOperational teams should maintain scenario catalogs ل burst traffic, retry storms, و partial-stage failures. Each scenario should specify expected queue depth, retry schedule, و final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios و تعلم system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters ل accepted work, deferred work, retries, و dropped events. Without these counters, backpressure incidents become anecdotal و tuning decisions become reactive. مع deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI مع mocked scheduler runs, و regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, و explicit failure budgets. ل educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks ل each failure mode و link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, و communication templates ل fast coordination.\n",
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
                      "label": "Run مع retries",
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
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, و report exports ل reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
            "content": "Simulate bounded-concurrency execution مع deterministic task ordering.",
            "duration": "40 min",
            "hints": [
              "Model bounded concurrency مع a deterministic queue و tick loop.",
              "No real timers; simulate progression by decrementing remaining ticks."
            ]
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
            "content": "Generate deterministic retry delay schedules ل linear و exponential policies.",
            "duration": "40 min",
            "hints": [
              "Retry schedule should be deterministic و bounded.",
              "Support linear و exponential backoff modes."
            ]
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
            "content": "Deduplicate replay events by deterministic idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Use idempotency keys to collapse duplicate replay events.",
              "Return stable sorted keys ل deterministic snapshots."
            ]
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
            "content": "Build deterministic snapshot state from simulated event streams.",
            "duration": "35 min",
            "hints": [
              "Reducer should be deterministic و idempotent-friendly.",
              "Sort output keys ل stable report generation."
            ]
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
            "content": "Export deterministic run report artifacts ل the async pipeline simulation.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should mirror deterministic pipeline run artifacts.",
              "Include both machine و human-readable export fields."
            ]
          }
        }
      }
    }
  },
  "rust-proc-macros-codegen-safety": {
    "title": "Procedural Macros & Codegen ل Safety",
    "description": "Rust macro/codegen safety taught through deterministic parser و check-generation tooling مع audit-friendly outputs.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "macros",
      "codegen",
      "safety"
    ],
    "modules": {
      "rpmcs-v2-foundations": {
        "title": "Macro و Codegen Foundations",
        "description": "Macro النموذج الذهنيs, constraint DSL التصميم, و safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro النموذج الذهني: declarative vs procedural",
            "content": "# Macro النموذج الذهني: declarative vs procedural\n\nRust macros come in two broad forms: declarative macros ل pattern-based expansion و procedural macros ل syntax-aware transformation. Anchor relies heavily on macro-driven ergonomics to generate حساب validation و تعليمة plumbing.\n\nل safety engineering, the value is consistency. Instead of hand-writing signer و owner checks in every handler, macro-style codegen can enforce these rules from concise attributes. This reduces copy-paste drift و makes review focus on policy intent.\n\nIn this دورة, we simulate proc-macro behavior مع deterministic TypeScript parser/generator helpers. The goal is conceptual transfer: attribute input -> AST -> generated checks -> runtime evaluation report.\n\nA macro النموذج الذهني helps avoid two mistakes: trusting generated behavior blindly و over-generalizing DSL syntax. Good macro التصميم keeps syntax explicit, expansion predictable, و errors readable.\n\nTreat generated checks as code artifacts, not opaque internals. Store them in tests, compare them in diffs, و validate behavior on controlled fixtures.\n\n## Operator mindset\n\nCodegen safety depends on reviewable output. If generated checks are not deterministic و diff-friendly, teams lose trust و incidents take longer to diagnose.\n\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor و Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate و catch classes of validation bugs early. ل teaching in a browser environment, a deterministic parser و generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes و debugging becomes harder. Stable generated strings, golden file tests, و deterministic run reports solve this. Teams can diff generated code as plain text و confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL التصميم. Attribute syntax should be strict enough to reject ambiguous input و explicit enough to encode signer, owner, relation, و mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind و target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules و keep migration guides ل older attribute forms. Unversioned grammar drift can silently break generated checks و create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired مع golden output snapshots و runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, و testable, which is exactly the behavior needed ل safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, و runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined و avoids turning safety tooling into a maintenance burden. Teams can further strengthen this مع compatibility suites that replay historical DSL inputs against new parsers و compare outputs byte-ل-byte. When differences appear, release notes should explain why behavior changed و how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent و lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, و runtime validation signoff in every checklist.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpmcs-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpmcs-v2-l1-q1",
                    "prompt": "Why is generated code review important ل safety?",
                    "options": [
                      "It verifies expansion matches policy intent",
                      "It increases compile speed",
                      "It removes need ل tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Generated checks must remain inspectable و auditable."
                  }
                ]
              }
            ]
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
            "content": "# Safety through codegen: constraint checks\n\nConstraint codegen converts compact declarations into explicit runtime guards. Typical constraints include signer presence, حساب ownership, has-one relations, و mutability requirements.\n\nA strong codegen pipeline validates input syntax strictly, produces deterministic output ordering, و emits meaningful errors ل unsupported forms. Weak codegen pipelines accept ambiguous syntax و produce inconsistent expansion, which undermines trust.\n\nOwnership checks are high-value constraints because حساب substitution bugs are common in Solana systems. Generated owner guards reduce omission risk. Signer checks ensure privileged paths are gated by explicit authority.\n\nHas-one relation checks encode structural links between حسابات و authorities. Generated relation checks reduce manual mistakes و keep behavior aligned across handlers.\n\nFinally, الاختبار generated output via golden strings catches accidental expansion drift. This is especially useful during parser refactors.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor و Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate و catch classes of validation bugs early. ل teaching in a browser environment, a deterministic parser و generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes و debugging becomes harder. Stable generated strings, golden file tests, و deterministic run reports solve this. Teams can diff generated code as plain text و confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL التصميم. Attribute syntax should be strict enough to reject ambiguous input و explicit enough to encode signer, owner, relation, و mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind و target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules و keep migration guides ل older attribute forms. Unversioned grammar drift can silently break generated checks و create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired مع golden output snapshots و runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, و testable, which is exactly the behavior needed ل safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, و runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined و avoids turning safety tooling into a maintenance burden. Teams can further strengthen this مع compatibility suites that replay historical DSL inputs against new parsers و compare outputs byte-ل-byte. When differences appear, release notes should explain why behavior changed و how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent و lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, و runtime validation signoff in every checklist.\n",
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
            "content": "# Explorer: constraint builder to generated checks\n\nA constraint builder explorer helps engineers see how DSL choices affect generated code و runtime safety outcomes. Input one attribute line, observe parsed AST, generated pseudo-code, و pass/fail execution against sample inputs.\n\nThis tight loop is useful ل both education و production review. Teams can prototype new constraint forms, verify deterministic output, و add golden tests before adoption.\n\nThe explorer should surface parse failures clearly. If syntax is invalid, report line و expected format. If constraint kind is unsupported, fail مع deterministic error text.\n\nGenerated checks should preserve input order unless policy requires canonical sorting. Either way, behavior must be deterministic و documented.\n\nRuntime evaluation output should include failure list مع kind, target, و reason. This allows developers to fix configuration quickly و keeps safety reporting actionable.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor و Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate و catch classes of validation bugs early. ل teaching in a browser environment, a deterministic parser و generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes و debugging becomes harder. Stable generated strings, golden file tests, و deterministic run reports solve this. Teams can diff generated code as plain text و confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL التصميم. Attribute syntax should be strict enough to reject ambiguous input و explicit enough to encode signer, owner, relation, و mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind و target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules و keep migration guides ل older attribute forms. Unversioned grammar drift can silently break generated checks و create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired مع golden output snapshots و runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, و testable, which is exactly the behavior needed ل safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, و runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined و avoids turning safety tooling into a maintenance burden. Teams can further strengthen this مع compatibility suites that replay historical DSL inputs against new parsers و compare outputs byte-ل-byte. When differences appear, release notes should explain why behavior changed و how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent و lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, و runtime validation signoff in every checklist.\n",
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
        "title": "حساب Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, و publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
            "content": "Parse mini-DSL constraints into deterministic AST nodes.",
            "duration": "40 min",
            "hints": [
              "Parse mini DSL lines into typed AST nodes.",
              "Support signer, mut, owner, و has_one forms."
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
              "Evaluate generated constraints against sample حساب state.",
              "Return deterministic failure reasons."
            ]
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
            "content": "Export deterministic markdown safety report from generated checks.",
            "duration": "45 min",
            "hints": [
              "Render a deterministic markdown report from generated check results.",
              "Include status و explicit failure details."
            ]
          }
        }
      }
    }
  },
  "anchor-upgrades-migrations": {
    "title": "Anchor Upgrades & حساب Migrations",
    "description": "التصميم production-safe Anchor release workflows مع deterministic migration planning, upgrade gates, rollback playbooks, و readiness evidence.",
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
        "description": "Authority lifecycle, حساب versioning strategy, و deterministic upgrade risk modeling ل Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
            "content": "# Upgrade authority lifecycle in Anchor programs\n\nAnchor makes تعليمة development easier, but upgrade safety still depends on disciplined control of program authority. In production Solana systems, most upgrade incidents are not caused by syntax bugs. They come from process mistakes: wrong key management, unclear release ownership, و missing checks between build artifacts و deployed programdata. This درس teaches a عملي lifecycle model that maps directly to how Anchor programs are deployed و governed.\n\nStart مع a strict authority model. Define who can sign upgrades و under which conditions. A single hot محفظة is not acceptable ل mature systems. Typical setups use a multisig or الحوكمة path to approve artifacts, then a controlled signer to perform النشر. The important point is determinism: the same release decision should produce the same auditable evidence each time. That includes artifact hash, release tag, authority signers, و rollback policy. If your team cannot reconstruct those facts after a deploy, your process is too weak.\n\nNext, treat build reproducibility as a first-class requirement. You should compare the expected binary hash against programdata hash before و after النشر in your pipeline simulation. Even when this دورة stays deterministic و does not hit RPC, the policy should model hash matching as a gate. If the hash mismatch flag is true, the release is blocked. This simple rule prevents one of the most expensive failure classes: thinking you shipped one artifact while another artifact is actually live.\n\nAuthority transition rules matter too. Some protocols intentionally revoke upgrade authority after a stabilization window. Others keep authority but require الحوكمة timelocks و emergency pause conditions. Neither is universally correct. The key is consistency مع explicit trigger conditions. If you revoke authority too early, you lose the ability to patch critical bugs. If you never constrain authority, users cannot trust immutability promises. Anchor does not solve this الحوكمة tradeoff ل you; it only provides the program framework.\n\nRelease communication is part of الامان. Users و integrators need predictable language about what changed و whether state migration is required. ل example, if you add new حساب fields but keep backward decoding compatibility, your report should say migration is optional ل old حسابات و mandatory ل new writes after a certain slot range. If compatibility breaks, the report must include exact batch strategy و downtime expectations. Ambiguous language creates support load و increases operational risk.\n\nFinally, التصميم your release pipeline ل deterministic dry runs. Simulate migration steps, validation checks, و report generation locally. The goal is to eliminate unforced errors before any معاملة is signed. A deterministic runbook is not bureaucracy; it is what keeps urgent releases calm و reviewable.\n\n## Operator mindset\n\nAnchor upgrades are operations work مع cryptographic consequences. Authority controls, migration sequencing, و rollback criteria should be treated as release contracts, not informal habits.\n\n\nThis درس should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures ل each upgrade class: schema-only changes, تعليمة behavior changes, و authority changes. ل every class, capture expected artifacts و compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, و what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document مع explicit slot windows, RPC provider failover plan, و support messaging templates. If a release is paused, the plan should already define whether to retry مع the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown و stable JSON, teams avoid panic changes during incidents و can audit exactly what happened after the fact. The same approach improves onboarding: new engineers تعلم from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define clear authority ownership و approval flow.\n- Require artifact hash match before rollout.\n- Document authority transition و rollback policy.\n- Publish migration impact in deterministic report fields.\n- Block releases when dry-run evidence is missing.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "aum-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "aum-v2-l1-q1",
                    "prompt": "What is the most defensible release gate before النشر?",
                    "options": [
                      "Compare approved build hash to expected programdata hash policy input",
                      "Ship quickly و validate hash later",
                      "Rely on signer memory without written report"
                    ],
                    "answerIndex": 0,
                    "explanation": "Hash matching is a deterministic control that prevents artifact drift during النشر."
                  },
                  {
                    "id": "aum-v2-l1-q2",
                    "prompt": "Why is release communication part of upgrade safety?",
                    "options": [
                      "Integrators need exact migration impact و timing to avoid operational errors",
                      "Because Anchor automatically writes support tickets",
                      "Because all upgrades are backward compatible"
                    ],
                    "answerIndex": 0,
                    "explanation": "Unclear upgrade messaging causes integration mistakes و user-facing incidents."
                  }
                ]
              }
            ]
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "حساب versioning و migration strategy",
            "content": "# حساب versioning و migration strategy\n\nSolana حسابات are long-lived state containers, so program upgrades must respect historical data. In Anchor, adding or changing حساب fields can be safe, risky, or catastrophic depending on how version markers, discriminators, و decode logic are handled. This درس focuses on migration planning that is deterministic, testable, و production-oriented.\n\nThe first rule is explicit version markers. Do not infer schema version from حساب size alone because reallocations و optional fields can make that ambiguous. Include a version field و define what each version guarantees. Your migration planner can then segment حساب ranges by version و apply deterministic transforms. Without explicit markers, teams often guess state shape و ship brittle one-off scripts.\n\nSecond, separate compatibility mode from migration mode. Compatibility mode means new code can read old و new versions while writes may still target old shape ل a transition period. Migration mode means writes are frozen or routed through upgrade-safe paths while حساب batches are rewritten. Both modes are valid, but mixing them without clear boundaries creates partial state و broken assumptions.\n\nBatching is a عملي necessity. Large protocols cannot migrate every حساب in one معاملة or one slot. Your plan should define batch size, ordering, و integrity checks. ل example, process حساب indexes in deterministic ascending order و verify expected post-migration invariants after each batch. If a batch fails, rerun exactly that batch مع idempotent logic. Deterministic batch identifiers make this auditable و easier to recover.\n\nPlan ل dry-run و rollback before execution. A migration plan should include prepare, migrate, verify, و finalize steps مع explicit criteria. Prepare can freeze new writes و snapshot baseline metrics. Verify can compare counts by version و check critical invariants. Finalize can re-enable writes و publish a signed report. Rollback should be defined as a separate branch, not improvised during incident pressure.\n\nAnchor adds value here through typed حساب contexts و constraints, but migrations still require careful data engineering. ل every changed حساب type, maintain deterministic test fixtures: old bytes, expected new bytes, و expected structured decode output. This catches layout regressions early و builds confidence when migrating real state.\n\nTreat migration metrics as product metrics too. Users care about downtime, failed actions, و consistency across clients. If migration affects read paths, expose status in UX so users understand what is happening. Reliable migrations are as much about communication و orchestration as they are about code.\n\n\nThis درس should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures ل each upgrade class: schema-only changes, تعليمة behavior changes, و authority changes. ل every class, capture expected artifacts و compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, و what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document مع explicit slot windows, RPC provider failover plan, و support messaging templates. If a release is paused, the plan should already define whether to retry مع the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown و stable JSON, teams avoid panic changes during incidents و can audit exactly what happened after the fact. The same approach improves onboarding: new engineers تعلم from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use explicit version markers in حساب data.\n- Define compatibility و migration modes separately.\n- Migrate in deterministic batches مع idempotent retries.\n- Keep dry-run fixtures ل byte-level و structured outputs.\n- Publish migration status و completion evidence.\n",
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
                    "note": "Freeze writes before touching حساب schema."
                  },
                  {
                    "cmd": "migrate --batch=3 --range=2000-2999 --target=v3",
                    "output": "status=ok migrated=1000 failed=0",
                    "note": "Batch IDs are deterministic و replayable."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
            "content": "# Explorer: upgrade risk matrix\n\nA useful upgrade explorer should show cause-و-effect between release inputs و safety outcomes. If a flag changes, engineers should immediately see how severity و readiness changes. This درس teaches how to build و read a deterministic risk matrix ل Anchor upgrades.\n\nThe matrix starts مع five high-signal inputs: upgrade authority present, program hash match, IDL breaking changes count, migration backfill completion, و dry-run pass status. These cover الحوكمة, artifact integrity, compatibility risk, data readiness, و execution readiness. They are not exhaustive, but they are enough to prevent most avoidable mistakes.\n\nEach matrix row represents a release candidate state. ل every row, compute issue codes و severity levels in stable order. Stable ordering is not cosmetic; it allows exact output comparisons in CI و easy diff review in pull requests. If issue ordering changes between commits without policy changes, you know something in implementation drifted.\n\nSeverity calibration should be conservative. Missing upgrade authority, hash mismatch, و failed dry run are high severity because they directly block safe rollout. Incomplete backfill و IDL breaking changes are usually medium severity: sometimes resolvable مع migration notes و staged release windows, but still risky if ignored.\n\nThe explorer should also teach false confidence patterns. ل example, a release مع zero IDL changes can still be unsafe if program hash does not match approved artifact. Conversely, a release مع breaking changes can still be safe if migration plan is complete, compatibility notes are clear, و rollout is staged مع monitoring. Risk is contextual; deterministic policy helps avoid emotional decisions.\n\nFrom a workflow perspective, the matrix output should feed both engineering و support. Engineering uses JSON ل machine checks و gating. Support uses markdown summary to communicate whether release is ready, delayed, or blocked و why. If these outputs disagree, your generation path is wrong. Use one canonical payload و derive both formats.\n\nFinally, integrate the explorer into code review. Require reviewers to reference matrix output ل each release PR. This keeps decisions anchored in explicit evidence rather than implicit trust in النشر scripts.\n\n\nThis درس should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures ل each upgrade class: schema-only changes, تعليمة behavior changes, و authority changes. ل every class, capture expected artifacts و compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, و what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document مع explicit slot windows, RPC provider failover plan, و support messaging templates. If a release is paused, the plan should already define whether to retry مع the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown و stable JSON, teams avoid panic changes during incidents و can audit exactly what happened after the fact. The same approach improves onboarding: new engineers تعلم from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use a canonical risk payload مع stable ordering.\n- Mark authority/hash/dry-run failures as blocking.\n- Keep JSON و markdown generated from one source.\n- Validate matrix behavior مع deterministic fixtures.\n- Treat explorer output as part of PR review evidence.\n",
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
            "content": "Implement deterministic migration planning output: fromVersion, toVersion, totalBatches, و requiresMigration.",
            "duration": "40 min",
            "hints": [
              "Use Math.ceil(accountCount / batchSize) ل deterministic batch count.",
              "requiresMigration should be true only when toVersion > fromVersion.",
              "Return only stable scalar fields ل exact JSON comparisons."
            ]
          }
        }
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, و deterministic readiness artifacts ل controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
            "content": "Implement deterministic blocking issue checks ل authority, artifact hash, و dry-run status.",
            "duration": "40 min",
            "hints": [
              "Treat missing authority, hash mismatch, و failed dry run as blocking issues.",
              "Return issueCount plus ordered issue code array.",
              "Keep order stable to make report diffs deterministic."
            ]
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy و incident playbooks",
            "content": "# Rollback strategy و incident playbooks\n\nEven strong upgrade plans can encounter surprises: incompatible downstream clients, unexpected حساب edge cases, or release pipeline mistakes. Teams that recover quickly are the ones that predefine rollback و incident playbooks before any النشر begins. This درس covers pragmatic rollback التصميم ل Anchor-based systems.\n\nRollback starts مع explicit trigger conditions. Do not wait ل subjective debate during an incident. Define measurable triggers such as failure rate thresholds, migration error counts, or critical invariant violations. Once trigger conditions are met, the system should move into a known response mode: pause writes, stop new migration batches, و publish incident status.\n\nA common mistake is assuming rollback always means restoring old binary immediately. Sometimes that is correct; other times it can worsen state divergence if partial migrations already wrote new version markers. Your playbook should classify failure phase: pre-migration, mid-migration, or post-finalization. Each phase has different safest actions. Mid-migration incidents often require completing compensating transforms before binary rollback.\n\nAnchor حساب constraints help protect invariant boundaries, but they do not orchestrate recovery sequencing. You still need deterministic tooling ل affected حساب identification, reprocessing queues, و reconciliation summaries. Keep these tools pure و replayable where possible. If logic cannot be replayed, incident analysis becomes guesswork.\n\nCommunication is part of rollback. Engineering, support, و partner teams should consume the same deterministic report fields: release tag, rollback trigger, impacted batch ranges, current mitigation status, و next checkpoint time. Avoid free-form updates that diverge across channels.\n\nPost-incident learning must be concrete. ل each incident, add one or more deterministic fixtures reproducing the decision path that failed. Update policy functions و confirm that the new fixtures prevent recurrence. This is how reliability improves release after release.\n\nFinally, distinguish between emergency stop controls و full rollback procedures. Emergency stop is ل immediate blast radius reduction. Full rollback or forward-fix decisions can come after state assessment. Blending these concepts causes rushed mistakes.\n\n\nThis درس should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures ل each upgrade class: schema-only changes, تعليمة behavior changes, و authority changes. ل every class, capture expected artifacts و compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, و what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document مع explicit slot windows, RPC provider failover plan, و support messaging templates. If a release is paused, the plan should already define whether to retry مع the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown و stable JSON, teams avoid panic changes during incidents و can audit exactly what happened after the fact. The same approach improves onboarding: new engineers تعلم from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define measurable rollback triggers in advance.\n- Classify incident phase before selecting response path.\n- Keep recovery tooling replayable و deterministic.\n- Share one canonical incident report format.\n- Add regression fixtures after every rollback event.\n",
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
                      "Enter defined response mode: pause risky actions و publish status",
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
                    "explanation": "Incident fixtures turn دروس into enforceable regression tests."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
            "content": "Generate deterministic markdown from releaseTag, totalBatches, و issueCount.",
            "duration": "35 min",
            "hints": [
              "Keep line ordering و punctuation stable.",
              "Use bullet list fields ل releaseTag, totalBatches, و issueCount.",
              "Return plain markdown string without trailing spaces."
            ]
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
            "content": "Produce the final deterministic checkpoint artifact مع release tag, readiness flag, و migration batch count.",
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
    "title": "Reliability Engineering ل Solana",
    "description": "Production-focused reliability engineering ل Solana systems: fault tolerance, retries, deadlines, circuit breakers, و graceful degradation مع measurable operational outcomes.",
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
        "description": "Implement fault-tolerance building blocks مع clear failure classification, retry boundaries, و deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
            "content": "Fault tolerance in Solana systems is not just about catching errors. It is about deciding which failures are safe to retry, which should fail fast, و how to preserve user trust while doing both.\n\nA عملي reliability model starts مع failure classes:\n1) transient failures (timeouts, temporary RPC unavailability),\n2) persistent external failures (rate limits, prolonged endpoint degradation),\n3) deterministic business failures (invalid input, invariant violations).\n\nTransient failures may justify bounded retries مع backoff. Deterministic business failures should not be retried because retries only add latency و load. Persistent external failures often require fallback endpoints, degraded features, or temporary protection modes.\n\nIn Solana workflows, reliability is tightly coupled to freshness constraints. A request can be logically valid but still fail if supporting state has shifted (ل example stale quote windows or expired blockhash contexts in client workflows). Reliable systems therefore combine retry logic مع freshness checks و clear abort conditions.\n\nDefensive engineering means defining policies explicitly:\n- maximum retry count,\n- per-attempt timeout,\n- total deadline budget,\n- fallback behavior after budget exhaustion,\n- user-facing messaging ل each failure class.\n\nWithout explicit budgets, systems drift into infinite retry loops or fail too early. مع explicit budgets, behavior is predictable و testable.\n\nل production teams, observability is mandatory. Every failed operation should include a deterministic reason code و context fields (attempt number, endpoint, elapsed time, policy branch). This turns reliability from guesswork into measurable behavior.\n\nReliable systems do not promise zero failures. They promise controlled failure behavior: bounded latency, clear outcomes, و safe degradation under stress.",
            "duration": "45 min"
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
            "content": "Implement an exponential backoff retry mechanism ل handling transient failures.",
            "duration": "45 min",
            "hints": [
              "Use match on the BackoffStrategy enum to handle each case",
              "ل exponential backoff, use 2_u64.pow(attempt) to calculate the multiplier",
              "should_retry simply checks if attempt is less than max_attempts"
            ]
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
            "content": "Implement a deadline management system to enforce time limits on operations.",
            "duration": "45 min",
            "hints": [
              "Store the absolute expiration timestamp in the Deadline struct",
              "ل time_remaining, subtract current_time from deadline timestamp if not expired",
              "ل extend_deadline, calculate the new timestamp و check against max allowed"
            ]
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
            "content": "Implement a fallback mechanism that provides alternative execution paths when primary operations fail.",
            "duration": "45 min",
            "hints": [
              "Call the primary function first و check if it returns Some",
              "Only call fallback if primary returns None",
              "ل retry, loop max_retries times trying primary before falling back"
            ]
          }
        }
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, و rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
            "content": "Resilience patterns are controls that prevent localized failures from becoming system-wide incidents. On Solana integrations, they are especially important because provider health can change quickly under bursty network conditions.\n\nCircuit breaker pattern:\n- closed: normal operation,\n- open: block requests after repeated failures,\n- half-open: probe recovery مع controlled trial requests.\n\nA good breaker uses deterministic thresholds و cooldowns, not ad hoc toggles. It should expose state transitions ل monitoring و post-incident review.\n\nBulkhead pattern isolates resource pools so one failing workflow (ل example expensive quote refresh loops) cannot starve unrelated workflows (like portfolio reads).\n\nRate limiting controls outbound pressure to providers. Proper limits reduce 429 storms و improve overall success rate. Token-bucket strategies are useful because they allow short bursts while preserving long-term bounds.\n\nThese patterns should be coordinated, not layered blindly. ل example, aggressive retries plus weak rate limiting can bypass the intent of a circuit breaker. Policy composition must be reviewed end-to-end.\n\nA mature resilience stack includes:\n- deterministic policy config,\n- simulation fixtures ل calm vs stressed traffic,\n- dashboard visibility ل breaker states و reject reasons,\n- explicit user copy ل degraded mode.\n\nResilience is successful when users experience predictable service quality under failure, not when systems appear perfect in ideal conditions.",
            "duration": "45 min"
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
            "content": "Implement a circuit breaker pattern that opens after consecutive failures و closes after a recovery period.",
            "duration": "45 min",
            "hints": [
              "In can_execute, check if recovery timeout has passed ل Open state",
              "record_success should reset everything to Closed state",
              "record_failure increments count و opens circuit when threshold is reached"
            ]
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
            "content": "Implement a token bucket rate limiter ل controlling request rates.",
            "duration": "45 min",
            "hints": [
              "Always refill before checking if consumption is possible",
              "Calculate elapsed time و multiply by refill rate to get tokens to add",
              "Use min() to ensure tokens don't exceed capacity"
            ]
          },
          "lesson-10-2-4": {
            "title": "Error Classifier Challenge",
            "content": "Implement an error classification system to determine if errors are retryable.",
            "duration": "45 min",
            "hints": [
              "Use match مع range patterns (1000..=1999) to classify",
              "should_retry can use matches! macro or match on classify result",
              "batch_classify can use iter().map().collect() pattern"
            ]
          }
        }
      }
    }
  },
  "solana-testing-strategies": {
    "title": "الاختبار Strategies ل Solana",
    "description": "Comprehensive, production-oriented الاختبار strategy ل Solana: deterministic unit tests, realistic integration tests, fuzz/property الاختبار, و release-confidence reporting.",
    "duration": "5 weeks",
    "tags": [
      "testing",
      "quality-assurance",
      "fuzzing",
      "property-testing"
    ],
    "modules": {
      "mod-11-1": {
        "title": "Unit و Integration الاختبار",
        "description": "Build deterministic unit و integration الاختبار layers مع clear ownership of invariants, fixtures, و failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "الاختبار Fundamentals",
            "content": "الاختبار Solana systems effectively requires layered confidence, not one giant test suite.\n\nUnit tests validate pure logic: math, state transitions, و invariant checks. They should be fast, deterministic, و run on every change.\n\nIntegration tests validate component wiring: نموذج الحساباتing, تعليمة construction, و cross-وحدة behavior under realistic inputs. They should catch schema drift و boundary errors that unit tests miss.\n\nA عملي test pyramid ل Solana work:\n1) deterministic unit tests (broadest coverage),\n2) deterministic integration tests (targeted workflow coverage),\n3) environment-dependent checks (smaller set, higher cost).\n\nCommon failure in teams is over-reliance on environment-dependent tests while neglecting deterministic core checks. This creates flaky CI و weak debugging signals.\n\nGood test التصميم principles:\n- explicit fixture ownership,\n- stable expected outputs,\n- structured error assertions (not only success assertions),\n- regression fixtures ل previously discovered bugs.\n\nل production readiness, test outputs should be easy to audit. Summaries should include pass/fail counts by category, failing invariant IDs, و deterministic reproduction inputs.\n\nالاختبار is not just correctness verification; it is an operational communication tool. Strong test artifacts make release decisions clearer و incident response faster.",
            "duration": "45 min"
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
            "content": "Implement a test assertion framework ل verifying program state.",
            "duration": "45 min",
            "hints": [
              "Compare actual vs expected values و return appropriate Result",
              "Use format! to create descriptive error messages",
              "Return Ok(()) ل success cases"
            ]
          },
          "lesson-11-1-3": {
            "title": "Mock حساب Generator Challenge",
            "content": "Create a mock حساب generator ل الاختبار مع configurable parameters.",
            "duration": "45 min",
            "hints": [
              "Use vec![0; size] to create zero-filled data of specified size",
              "ل generate_with_lamports, use default values ل other fields",
              "Signer حسابات typically have is_writable set to true"
            ]
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
            "content": "Build a test scenario builder ل setting up complex test environments.",
            "duration": "45 min",
            "hints": [
              "Use builder pattern مع self return type ل chaining",
              "Push strings into vectors (use to_string() to convert &str)",
              "build() consumes self و creates the final TestScenario"
            ]
          }
        }
      },
      "mod-11-2": {
        "title": "متقدم الاختبار Techniques",
        "description": "Use fuzzing, property-based tests, و mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing و Property الاختبار",
            "content": "متقدم الاختبار techniques uncover failures that example-based tests rarely find.\n\nFuzzing explores broad random input space to trigger parser edge cases, boundary overflows, و unexpected state combinations. It is especially useful ل serialization, decoding, و input validation layers.\n\nProperty-based الاختبار defines invariants that must hold across many generated inputs. Instead of asserting one output, you assert a rule (ل example: balances never become negative, or decoded-then-encoded payload remains stable).\n\nMutation-style thinking strengthens this further: intentionally alter assumptions و verify tests fail as expected. If tests still pass after a harmful change, coverage is weaker than it appears.\n\nTo keep متقدم الاختبار عملي:\n- use deterministic seeds in CI ل reproducibility,\n- store failing cases as permanent regression fixtures,\n- separate heavy campaigns from per-commit fast checks.\n\nمتقدم tests are most valuable when tied to explicit risk categories. Map each category (serialization safety, invariant consistency, edge-case arithmetic) to at least one dedicated property or fuzz campaign.\n\nTeams that treat fuzz/property failures as first-class release blockers catch subtle defects earlier و reduce high-severity production incidents.",
            "duration": "45 min"
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
            "content": "Implement a fuzz input generator ل الاختبار مع random data.",
            "duration": "45 min",
            "hints": [
              "Use wrapping_mul و wrapping_add ل LCG to avoid overflow panics",
              "Generate bytes by taking random % 256",
              "ل bounded generation, calculate range و add to min"
            ]
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
            "content": "Implement a property verifier that checks invariants hold across operations.",
            "duration": "45 min",
            "hints": [
              "ل commutative, call op both ways و compare",
              "ل associative, nest the calls differently و compare",
              "ل non_decreasing, iterate through pairs و check ordering"
            ]
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
            "content": "Implement a boundary value analyzer ل identifying edge cases.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub و saturating_add to avoid overflow",
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
    "description": "Engineer production-grade Solana الاداء: compute budgeting, حساب layout efficiency, memory/rent tradeoffs, و deterministic optimization workflows.",
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
        "description": "Optimize compute-heavy paths مع explicit CU budgets, operation-level profiling, و predictable الاداء tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
            "content": "Compute units are the hard resource budget that shapes what your Solana program can do in a single معاملة. الاداء optimization starts by treating CU usage as a contract, not an afterthought.\n\nA reliable optimization loop is:\n1) measure baseline CU by operation type,\n2) identify dominant cost buckets (deserialization, hashing, loops, CPI fan-out),\n3) optimize one hotspot at a time,\n4) re-measure و keep only changes مع clear gains.\n\nCommon anti-patterns include optimizing cold paths, adding complexity without measurement, و ignoring حساب-size side effects. In Solana systems, compute و حساب التصميم are coupled: a larger حساب can increase deserialization cost, which raises CU pressure.\n\nل production teams, deterministic cost fixtures are crucial. They let you compare before/after behavior in CI و stop regressions early. الاداء work is most useful when every claim is backed by reproducible evidence, not intuition.",
            "duration": "45 min"
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
            "content": "Implement a compute unit counter to estimate operation costs.",
            "duration": "45 min",
            "hints": [
              "Loop cost is overhead plus iterations times per-iteration cost",
              "حساب access is simply حسابات multiplied by per-حساب CU",
              "Apply safety margin by multiplying budget by the percentage"
            ]
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
            "content": "Optimize data structures ل minimal serialization overhead.",
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
              "Calculate available CUs after accounting ل overhead",
              "Use ceiling division: (n + d - 1) / d ل number of batches",
              "Total CU = (num_batches * overhead) + (items * per_item)"
            ]
          }
        }
      },
      "mod-12-2": {
        "title": "Memory و Storage Optimization",
        "description": "التصميم memory/storage-efficient حساب layouts مع rent-aware sizing, serialization discipline, و safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "حساب Data Optimization",
            "content": "حساب data optimization is both a cost و correctness discipline. Poor layouts increase rent, slow parsing, و make migrations fragile.\n\nالتصميم principles:\n- Keep hot fields compact و easy to parse.\n- Use fixed-size representations where possible.\n- Reserve growth strategy explicitly instead of ad hoc field expansion.\n- Separate frequently-mutated data from rarely-changed metadata when عملي.\n\nLayout decisions should be documented مع deterministic artifacts: field offsets, total bytes, و expected rent class. If a schema change increases حساب size, reviewers should see the exact delta و migration implications.\n\nProduction optimization is not “smallest possible struct at any cost.” It is stable, readable, و migration-safe storage that keeps compute و rent budgets predictable over time.",
            "duration": "45 min"
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
            "content": "Implement a data packer that efficiently packs fields into حساب data.",
            "duration": "45 min",
            "hints": [
              "Use to_le_bytes() to convert integers to bytes",
              "Use from_le_bytes() to convert bytes back to integers",
              "Alignment formula: if remainder, add (alignment - remainder)"
            ]
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
            "content": "Implement a rent calculator ل estimating حساب storage costs.",
            "duration": "45 min",
            "hints": [
              "Annual rent is data size times lamports per byte per year",
              "Exemption threshold is annual rent times threshold years",
              "Check if balance is greater than or equal to minimum"
            ]
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
            "content": "Implement a zero-copy deserializer ل reading data without allocation.",
            "duration": "45 min",
            "hints": [
              "Use copy_from_slice to read fixed-size data into stack arrays",
              "ل read_bytes, return a slice of the original data (zero-copy)",
              "Always advance offset after reading"
            ]
          }
        }
      }
    }
  },
  "solana-tokenomics-design": {
    "title": "Tokenomics التصميم ل Solana",
    "description": "التصميم robust Solana token economies مع distribution discipline, vesting safety, staking incentives, و الحوكمة mechanics that remain operationally defensible.",
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
        "title": "Token Distribution و Vesting",
        "description": "Model token allocation و vesting systems مع explicit fairness, unlock predictability, و deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
            "content": "Token distribution is a الامان و credibility decision, not just a spreadsheet exercise. Allocation و vesting rules shape long-term trust in the protocol.\n\nA strong distribution model answers:\n- who receives tokens و why,\n- when they unlock,\n- how unlock schedules affect circulating supply,\n- what controls prevent accidental over-distribution.\n\nVesting التصميم should be deterministic و auditable. Cliff و linear phases must produce reproducible release amounts ل any timestamp. Ambiguous rounding rules create disputes و operational risk.\n\nProduction teams should maintain allocation invariants in tests (ل example: total distributed <= total supply, per-bucket caps respected, no negative vesting balances). Tokenomics quality improves when economics و implementation are validated together.",
            "duration": "45 min"
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
            "content": "Implement a vesting schedule calculator مع cliff و linear release.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub to avoid underflow when calculating elapsed time",
              "ل linear vesting, use u128 ل متوسط calculation to avoid overflow",
              "Releasable is simply vested minus already released"
            ]
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
            "content": "Implement a token allocation distributor ل managing different stakeholder groups.",
            "duration": "45 min",
            "hints": [
              "Use iter().map().sum() to calculate total percentage",
              "Use u128 ل percentage calculation to avoid overflow",
              "Use find() to locate allocation by recipient"
            ]
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
            "content": "Generate a complete release schedule مع dates و amounts.",
            "duration": "45 min",
            "hints": [
              "Divide duration by intervals to get interval duration",
              "Use filter و sum to calculate total by timestamp",
              "ل monthly, use 30 days * 24 hours * 60 minutes * 60 seconds"
            ]
          }
        }
      },
      "mod-13-2": {
        "title": "Staking و الحوكمة",
        "description": "التصميم staking و الحوكمة mechanics مع clear incentive alignment, anti-manipulation constraints, و measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking و الحوكمة التصميم",
            "content": "Staking و الحوكمة systems must balance participation incentives مع manipulation resistance. Rewarding lock behavior is useful, but poorly tuned models can over-concentrate influence.\n\nCore التصميم questions:\n1) How is staking reward rate set و adjusted?\n2) How is voting power calculated (raw balance, delegated balance, time-weighted)?\n3) What prevents short-term الحوكمة capture?\n\nالحوكمة math should be transparent و deterministic so users can verify voting outcomes independently. If power calculations are opaque or inconsistent, الحوكمة trust collapses quickly.\n\nOperationally, track الحوكمة health metrics: voter participation, delegation concentration, proposal pass patterns, و inactive stake ratios. Tokenomics is successful only when on-chain incentive behavior matches intended الحوكمة outcomes.",
            "duration": "45 min"
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
            "content": "Implement a staking rewards calculator مع compounding.",
            "duration": "45 min",
            "hints": [
              "Use compound interest formula: A = P(1 + r/n)^(nt)",
              "Convert basis points to decimal by dividing by 10000",
              "ل days to target, use logarithms to solve ل time"
            ]
          },
          "lesson-13-2-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Implement a voting power calculator مع delegation support.",
            "duration": "45 min",
            "hints": [
              "If delegated_to is Some, voting power is 0 (they gave it away)",
              "Use filter to find voters who delegated to a specific address",
              "Sum staked amounts to calculate delegated power"
            ]
          },
          "lesson-13-2-4": {
            "title": "Proposal Threshold Calculator Challenge",
            "content": "Implement a proposal threshold calculator ل الحوكمة.",
            "duration": "45 min",
            "hints": [
              "Convert basis points to amount: (supply * bps) / 10000",
              "Use u128 ل متوسط calculation to avoid overflow",
              "Proposal passes if quorum met و more ل than against"
            ]
          }
        }
      }
    }
  },
  "solana-defi-primitives": {
    "title": "DeFi Primitives on Solana",
    "description": "Build عملي Solana DeFi foundations: AMM mechanics, liquidity accounting, lending primitives, و flash-loan-safe composition patterns.",
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
        "title": "AMM و Liquidity",
        "description": "Implement AMM و liquidity primitives مع deterministic math, slippage-aware outputs, و LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
            "content": "AMM fundamentals are simple in formula but subtle in implementation quality. The invariant math must be deterministic, fee handling explicit, و rounding behavior consistent across paths.\n\nل constant-product pools, route quality is determined by output-at-size, not headline spot price. Larger trades move further on the curve و experience stronger impact, so quote logic must be size-aware.\n\nLiquidity accounting must also be exact: LP shares, fee accrual, و pool reserve updates should remain internally consistent under repeated swaps و edge-case sizes.\n\nProduction DeFi teams treat AMM math as critical infrastructure. They use fixed fixtures ل swap-in/swap-out cases, boundary amounts, و fee tiers so regressions are caught before النشر.",
            "duration": "45 min"
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
            "content": "Implement a constant product AMM ل token swaps.",
            "duration": "45 min",
            "hints": [
              "Use u128 ل متوسط calculations to prevent overflow",
              "Apply fee by multiplying by (10000 - fee_bps) / 10000",
              "Slippage is (price_before - effective_price) / price_before"
            ]
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
            "content": "Calculate LP token minting و rewards ل liquidity providers.",
            "duration": "45 min",
            "hints": [
              "ل first liquidity, use sqrt(a * b) as LP tokens",
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
        "title": "Lending و Flash Loans",
        "description": "Model lending و flash-loan flows مع collateral safety, utilization-aware pricing, و strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
            "content": "Lending primitives و flash-loan logic are powerful but unforgiving. Safety depends on strict collateral valuation, clear LTV/threshold rules, و deterministic repayment checks.\n\nA عملي lending model should define:\n- collateral valuation source و freshness policy,\n- borrow limits و liquidation thresholds,\n- utilization-based rate behavior,\n- liquidation و bad-debt handling paths.\n\nFlash loans add atomic constraints: borrowed amount plus fee must be repaid in the same معاملة context. Any relaxation of this invariant introduces severe risk.\n\nComposable DeFi التصميم works when every primitive preserves local safety contracts while exposing clear interfaces ل higher-level orchestration.",
            "duration": "45 min"
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
            "content": "Implement collateral و borrowing power calculations.",
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
              "Use piecewise function ل borrow rate (below/above optimal)",
              "Supply rate حسابات ل reserve factor taken by protocol"
            ]
          },
          "lesson-14-2-4": {
            "title": "Flash Loan مدقق Challenge",
            "content": "Implement flash loan validation logic.",
            "duration": "45 min",
            "hints": [
              "Fee is amount times fee_bps divided by 10000",
              "Total repay is principal plus fee",
              "Profit is gain minus fee (use i64 ل signed result)"
            ]
          }
        }
      }
    }
  },
  "solana-nft-standards": {
    "title": "NFT Standards on Solana",
    "description": "Implement Solana NFTs مع production-ready standards: metadata integrity, collection discipline, و متقدم programmable/non-transferable behaviors.",
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
        "description": "Build core NFT functionality مع standards-compliant metadata, collection verification, و deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
            "content": "NFT architecture on Solana combines token mechanics مع metadata و collection semantics. A correct implementation requires more than minting a token مع supply one.\n\nCore components include:\n- mint/state ownership correctness,\n- metadata integrity و schema consistency,\n- collection linkage و verification status,\n- transfer و authority policy clarity.\n\nProduction NFT systems should treat metadata as a contract. If fields drift or verification flags are inconsistent, marketplaces و محافظ may interpret assets differently.\n\nReliable implementations include deterministic validation ل metadata structure, creator share totals, collection references, و authority expectations. Standards compliance is what preserves interoperability.",
            "duration": "45 min"
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
            "content": "Parse و validate NFT metadata according to Metaplex standards.",
            "duration": "45 min",
            "hints": [
              "Check string lengths مع len() method",
              "Sum creator shares و verify equals 100",
              "Royalty is sale_price * fee_bps / 10000"
            ]
          },
          "lesson-15-1-3": {
            "title": "Collection Manager Challenge",
            "content": "Implement NFT collection management مع size tracking.",
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
              "Sort descending by score ل ranking (highest = rank 1)"
            ]
          }
        }
      },
      "mod-15-2": {
        "title": "متقدم NFT Features",
        "description": "Implement متقدم NFT behaviors (soulbound و programmable flows) مع explicit policy controls و safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound و Programmable NFTs",
            "content": "متقدم NFT features introduce policy complexity that must be explicit. Soulbound behavior, programmable restrictions, و dynamic metadata updates all expand failure surface.\n\nل soulbound models, non-transferability must be enforced by clear rule paths, not UI assumptions. ل programmable NFTs, update permissions و transition rules should be deterministic و auditable.\n\nDynamic NFT updates should include strong validation و event clarity so indexers و clients can track state changes correctly.\n\nمتقدم NFT engineering succeeds when flexibility is paired مع strict policy boundaries و transparent update behavior.",
            "duration": "45 min"
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token مدقق Challenge",
            "content": "Implement validation ل soulbound (non-transferable) tokens.",
            "duration": "45 min",
            "hints": [
              "Soulbound tokens return false ل can_transfer",
              "Burn requires is_burnable و owner == burner",
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
            "content": "Implement NFT composability ل equipping items to base NFTs.",
            "duration": "45 min",
            "hints": [
              "Check available slots, compatibility, و not already equipped",
              "Use position() و remove() to unequip items",
              "Filter equipped items by matching type in items list"
            ]
          }
        }
      }
    }
  },
  "solana-cpi-patterns": {
    "title": "استدعاء بين البرامج Patterns",
    "description": "Master CPI composition on Solana مع safe حساب validation, PDA signer discipline, و deterministic multi-program orchestration patterns.",
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
        "description": "Build CPI fundamentals مع strict حساب/signer checks, ownership validation, و safe PDA signing boundaries.",
        "lessons": {
          "lesson-16-1-1": {
            "title": "استدعاء بين البرامج Architecture",
            "content": "استدعاء بين البرامج (CPI) is where Solana composability becomes عملي و where many الامان failures appear. The caller controls حساب lists, so every CPI boundary must be treated as untrusted input.\n\nSafe CPI التصميم requires:\n- explicit حساب identity و owner validation,\n- signer و writable scope minimization,\n- deterministic PDA derivation و signer-seed handling,\n- bounded assumptions about downstream program behavior.\n\ninvoke و invoke_signed are not interchangeable conveniences. invoke_signed should only be used when signer proof is truly required و seed recipes are canonical.\n\nProduction CPI reliability comes from repeatable guard patterns. If constraints vary handler to handler, reviewers cannot reason about الامان consistently.",
            "duration": "45 min"
          },
          "lesson-16-1-2": {
            "title": "CPI حساب مدقق Challenge",
            "content": "Validate حسابات ل استدعاء بين البرامجs.",
            "duration": "45 min",
            "hints": [
              "Check boolean flags ل signer و writable validation",
              "ل balance, compare lamports against minimum required",
              "Privilege extension: if caller is signer, child can sign too"
            ]
          },
          "lesson-16-1-3": {
            "title": "PDA Signer Challenge",
            "content": "Implement PDA signing ل CPI operations.",
            "duration": "45 min",
            "hints": [
              "Convert string seeds to bytes using as_bytes()",
              "Simulate PDA finding by trying different bump values",
              "Signature simulation combines message و seed hashes"
            ]
          },
          "lesson-16-1-4": {
            "title": "تعليمة Router Challenge",
            "content": "Implement an تعليمة router ل directing CPI calls.",
            "duration": "45 min",
            "hints": [
              "Use HashMap insert to register handlers",
              "Route by looking up instruction_type in handlers map",
              "create_cpi_call combines route مع حساب preparation"
            ]
          }
        }
      },
      "mod-16-2": {
        "title": "متقدم CPI Patterns",
        "description": "Compose متقدم multi-program flows مع atomicity awareness, consistency checks, و deterministic failure handling.",
        "lessons": {
          "lesson-16-2-1": {
            "title": "Multi-Program Composition",
            "content": "Multi-program composition introduces sequencing و consistency risk. Even when each CPI call is correct in isolation, combined flows can violate business invariants if ordering or rollback assumptions are weak.\n\nRobust composition patterns include:\n1) explicit stage boundaries,\n2) invariant checks between CPI steps,\n3) deterministic error classes ل partial-failure diagnosis,\n4) idempotent recovery paths where possible.\n\nل complex operations (atomic swaps, flash-loan sequences), model expected preconditions و postconditions per stage. This keeps orchestration testable و prevents hidden state drift.\n\nCPI mastery is less about calling many programs و more about preserving correctness across program boundaries under adverse inputs.",
            "duration": "45 min"
          },
          "lesson-16-2-2": {
            "title": "Atomic Swap Orchestrator Challenge",
            "content": "Implement an atomic swap across multiple programs.",
            "duration": "45 min",
            "hints": [
              "Validate that steps is not empty و minimum_output > 0",
              "Atomicity requires output_token of step N equals input_token of step N+1",
              "Map steps to (program_id, input_token, expected_output) tuples"
            ]
          },
          "lesson-16-2-3": {
            "title": "State Consistency مدقق Challenge",
            "content": "Validate state consistency across multiple CPI calls.",
            "duration": "45 min",
            "hints": [
              "Clone حسابات vector to create independent snapshot",
              "ل no_changes, verify all changed حسابات are in except list",
              "Compare balance و data_hash to detect changes"
            ]
          },
          "lesson-16-2-4": {
            "title": "Permissioned Invocation Challenge",
            "content": "Implement permission checks ل program invocations.",
            "duration": "45 min",
            "hints": [
              "Push permission into vector to register",
              "Use find() to locate permission ل program_id",
              "Use retain() to remove caller from allowed list"
            ]
          }
        }
      }
    }
  },
  "solana-mev-strategies": {
    "title": "MEV و معاملة Ordering",
    "description": "Production-focused معاملة-ordering engineering on Solana: MEV-aware routing, bundle strategy, liquidation/arbitrage modeling, و user-protective execution controls.",
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
        "description": "Understand MEV mechanics و معاملة ordering realities, then model opportunities و risks مع deterministic safety-aware policies.",
        "lessons": {
          "lesson-17-1-1": {
            "title": "MEV on Solana",
            "content": "Maximal Extractable Value (MEV) on Solana is fundamentally about معاملة ordering under limited blockspace. Whether you are building trading tools, liquidation infrastructure, or user-facing apps, you need a realistic model of how ordering pressure changes outcomes.\n\nKey Solana-specific context:\n- ordering can be influenced by priority fees و relay/bundle paths,\n- opportunities are short-lived و highly competitive,\n- failed or delayed execution can convert expected profit into loss.\n\nA mature MEV approach begins مع classification:\n1) opportunity class (arbitrage, liquidation, backrun-style sequencing),\n2) dependency class (single-hop vs multi-hop, oracle-sensitive vs pool-state-sensitive),\n3) risk class (staleness, fill failure, adverse movement, execution contention).\n\nل production systems, raw opportunity detection is not enough. You need deterministic filters that reject fragile setups: stale quotes, weak depth, or excessive path complexity relative to expected edge.\n\nMost operational failures come from execution assumptions, not math. Teams should model inclusion probability, fallback paths, و cancellation thresholds explicitly.\n\nUser-protective التصميم matters even ل متقدم orderflow systems. Clear policy around slippage limits, quote freshness, و failure reporting prevents silent value leakage و reduces support incidents.",
            "duration": "45 min"
          },
          "lesson-17-1-2": {
            "title": "Arbitrage Opportunity Detector Challenge",
            "content": "Detect arbitrage opportunities across DEXes.",
            "duration": "45 min",
            "hints": [
              "Compare all pairs of DEX prices ل same token pair",
              "Profit percent is (sell - buy) / buy * 100",
              "Use max_by to find best opportunity"
            ]
          },
          "lesson-17-1-3": {
            "title": "Liquidation Opportunity Finder Challenge",
            "content": "Find undercollateralized positions ل liquidation.",
            "duration": "45 min",
            "hints": [
              "Position is liquidatable when borrowed > threshold * collateral_value",
              "Calculate collateral value using price (مع 6 decimals)",
              "Liquidation profit is bonus percentage of collateral value"
            ]
          },
          "lesson-17-1-4": {
            "title": "Priority Fee Calculator Challenge",
            "content": "Calculate optimal priority fees ل معاملة ordering.",
            "duration": "45 min",
            "hints": [
              "Urgency factor scales the base fee",
              "Execution probability decreases as more fees are higher",
              "Total cost includes priority fee, base, و compute unit cost"
            ]
          }
        }
      },
      "mod-17-2": {
        "title": "متقدم MEV Strategies",
        "description": "التصميم متقدم ordering/bundle strategies مع explicit risk controls, failure handling, و user-impact guardrails.",
        "lessons": {
          "lesson-17-2-1": {
            "title": "متقدم MEV Techniques",
            "content": "متقدم معاملة-ordering strategies require disciplined orchestration, not just faster opportunity scans.\n\nBundle-oriented execution is valuable because it can express dependency sets و all-or-nothing intent, but bundle التصميم must include:\n- strict preconditions,\n- deterministic abort rules,\n- replay-safe identifiers,\n- post-execution reconciliation.\n\nWhen strategy complexity increases (multi-hop paths, conditional liquidations), failure modes multiply: partial fills, stale assumptions, و contention spikes. A robust system ranks candidates by expected net value after execution risk, not gross theoretical edge.\n\nOperational controls should include:\n1) bounded retries مع fresh-state checks,\n2) confidence scoring ل each candidate,\n3) kill-switch thresholds ل abnormal failure streaks,\n4) deterministic run reports ل incident replay.\n\nمتقدم MEV tooling is successful when it is both profitable و controllable. Deterministic artifacts (decision inputs, chosen path, reason codes) are what make that control real in production.",
            "duration": "45 min"
          },
          "lesson-17-2-2": {
            "title": "Bundle Composer Challenge",
            "content": "Compose معاملة bundles ل atomic MEV extraction.",
            "duration": "45 min",
            "hints": [
              "Tip is percentage of total profit",
              "Bundle is profitable if profit exceeds tip",
              "Sort by priority fee descending ل optimal ordering"
            ]
          },
          "lesson-17-2-3": {
            "title": "Multi-Hop Arbitrage Finder Challenge",
            "content": "Find multi-hop arbitrage paths across token pairs.",
            "duration": "45 min",
            "hints": [
              "Use constant product formula مع fee ل output calculation",
              "Two-hop arbitrage goes A -> B -> A through different pools",
              "Profit is final output minus initial input"
            ]
          },
          "lesson-17-2-4": {
            "title": "MEV Simulation Engine Challenge",
            "content": "Simulate MEV extraction to estimate profitability.",
            "duration": "45 min",
            "hints": [
              "Apply slippage to both buy (increase) و sell (decrease) prices",
              "Risk score combines failure rate, profit negativity, و capital",
              "Expected value weights profit by success probability"
            ]
          }
        }
      }
    }
  },
  "solana-deployment-cicd": {
    "title": "Program النشر و CI/CD",
    "description": "Production النشر engineering ل Solana programs: environment strategy, release gating, CI/CD quality controls, و upgrade-safe operational workflows.",
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
        "title": "النشر Fundamentals",
        "description": "Model environment-specific النشر behavior مع deterministic configs, artifact checks, و release preflight validation.",
        "lessons": {
          "lesson-18-1-1": {
            "title": "Solana النشر Environments",
            "content": "Solana النشر is not one command; it is a release system مع environment-specific risk. Localnet, devnet, و mainnet each serve different validation goals, و production quality depends on using them intentionally.\n\nA reliable النشر workflow defines:\n1) environment purpose و promotion criteria,\n2) deterministic config sources,\n3) artifact identity checks,\n4) rollback triggers.\n\nCommon failure patterns include mismatched program IDs, inconsistent config between environments, و unverified artifact drift between build و deploy. These are process issues that tooling should prevent.\n\nPreflight checks should be mandatory:\n- expected network و signer identity,\n- build artifact hash,\n- program size و upgrade constraints,\n- required حساب/address assumptions.\n\nEnvironment promotion should be evidence-driven. Passing local tests alone is not enough ل mainnet readiness; devnet/staging behavior must confirm operational assumptions under realistic RPC و timing conditions.\n\nالنشر maturity is measured by reproducibility. If another engineer cannot replay the release inputs و get the same artifact و checklist outcome, the pipeline is too fragile.",
            "duration": "45 min"
          },
          "lesson-18-1-2": {
            "title": "النشر Config Manager Challenge",
            "content": "Manage النشر configurations ل different environments.",
            "duration": "45 min",
            "hints": [
              "Push config into vector to add",
              "Use find() to locate config by environment name",
              "is_deployed checks if program_id is Some"
            ]
          },
          "lesson-18-1-3": {
            "title": "Program Size مدقق Challenge",
            "content": "Validate program binary size و compute budget.",
            "duration": "45 min",
            "hints": [
              "Compare binary length against MAX_PROGRAM_SIZE",
              "Use ceiling division ل معاملة count",
              "Compression ratio shows percentage size reduction"
            ]
          },
          "lesson-18-1-4": {
            "title": "Upgrade Authority Manager Challenge",
            "content": "Manage program upgrade authorities و permissions.",
            "duration": "45 min",
            "hints": [
              "Push metadata into vector to register",
              "can_upgrade checks if authority matches stored authority",
              "Use find_mut to locate و modify program metadata"
            ]
          }
        }
      },
      "mod-18-2": {
        "title": "CI/CD Pipelines",
        "description": "Build CI/CD pipelines that enforce build/test/الامان gates, compatibility checks, و controlled rollout/rollback evidence.",
        "lessons": {
          "lesson-18-2-1": {
            "title": "CI/CD ل Solana Programs",
            "content": "CI/CD ل Solana should enforce release quality, not just automate command execution.\n\nA عملي pipeline includes staged gates:\n1) static quality gate (lint/type/الامان checks),\n2) deterministic unit/integration tests,\n3) build reproducibility و artifact hashing,\n4) النشر preflight validation,\n5) controlled rollout مع observability checks.\n\nEach gate should produce machine-readable evidence. Release decisions become faster و safer when teams can inspect deterministic artifacts instead of scanning raw logs.\n\nVersion compatibility checks are critical in Solana ecosystems where CLI/toolchain mismatches can break builds or runtime expectations. Pipelines should fail fast on incompatible matrices.\n\nRollout strategy should also be explicit: canary/degraded mode, monitoring window, و rollback conditions. “Deploy و hope” is not a strategy.\n\nThe best CI/CD systems reduce human toil while increasing decision clarity. Automation should encode operational policy, not bypass it.",
            "duration": "45 min"
          },
          "lesson-18-2-2": {
            "title": "Build Pipeline مدقق Challenge",
            "content": "Validate CI/CD pipeline stages و dependencies.",
            "duration": "45 min",
            "hints": [
              "Track seen stages to enforce ordering constraints",
              "Use any() مع matches! to check ل required stages",
              "Can skip build/test if only documentation files changed"
            ]
          },
          "lesson-18-2-3": {
            "title": "Version Compatibility Checker Challenge",
            "content": "Check version compatibility between tools و dependencies.",
            "duration": "45 min",
            "hints": [
              "Split version string by '.' و parse each component",
              "Compatibility requires same major, actual >= required",
              "Use min_by to find smallest compatible version"
            ]
          },
          "lesson-18-2-4": {
            "title": "النشر Rollback Manager Challenge",
            "content": "Manage النشر rollbacks و recovery.",
            "duration": "45 min",
            "hints": [
              "Push النشر و update current_index to new النشر",
              "can_rollback checks ل any successful النشر before current",
              "get_rollback_target finds most recent successful النشر"
            ]
          }
        }
      }
    }
  },
  "solana-cross-chain-bridges": {
    "title": "Cross-Chain Bridges و Wormhole",
    "description": "Build safer cross-chain integrations ل Solana using Wormhole-style messaging, attestation verification, و deterministic bridge-state controls.",
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
        "description": "Understand cross-chain messaging trust boundaries, guardian attestations, و deterministic verification pipelines.",
        "lessons": {
          "lesson-43-1-1": {
            "title": "Cross-Chain Messaging Architecture",
            "content": "Cross-chain messaging is a trust-boundary problem before it is a transport problem. In Wormhole-style systems, messages are observed, attested, و consumed across different chain environments, each مع independent failure modes.\n\nA robust architecture model includes:\n1) emitter semantics (what exactly is being attested),\n2) attestation verification (who signed و under what threshold),\n3) replay prevention (message uniqueness و consumption state),\n4) execution safety (what happens if target-chain state has changed).\n\nVerification must be deterministic و strict. Accepting malformed or weakly validated attestations is a direct safety risk.\n\nCross-chain systems should also expose explicit reason codes ل rejects: invalid signatures, stale message, already-consumed message, unsupported payload schema. This improves operator response و audit quality.\n\nMessaging reliability depends on observability. Teams need deterministic logs linking source event IDs to target execution outcomes so they can reconcile partial or delayed flows.\n\nCross-chain engineering succeeds when attestation trust assumptions are transparent و enforced consistently at every consume path.",
            "duration": "45 min"
          },
          "lesson-43-1-2": {
            "title": "VAA Verifier Challenge",
            "content": "Implement VAA (Verified Action Approval) signature verification.",
            "duration": "45 min",
            "hints": [
              "Check signatures length against MIN_SIGNERS first",
              "Use to_be_bytes() ل big-endian byte conversion",
              "Quorum is 2/3 of total guardians rounded up"
            ]
          },
          "lesson-43-1-3": {
            "title": "Message Emitter Challenge",
            "content": "Implement cross-chain message emission و tracking.",
            "duration": "45 min",
            "hints": [
              "Increment sequence before creating message",
              "Next sequence is current + 1",
              "Verify message sequence is within emitted range"
            ]
          },
          "lesson-43-1-4": {
            "title": "Replay Protection Challenge",
            "content": "Implement replay protection ل cross-chain messages.",
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
        "description": "Implement asset-bridging patterns مع strict supply/accounting invariants, replay protection, و reconciliation workflows.",
        "lessons": {
          "lesson-43-2-1": {
            "title": "Token Bridging Mechanics",
            "content": "Token bridging requires strict supply و state invariants. Lock-و-mint و burn-و-mint models both rely on one central rule: represented supply across chains must remain coherent.\n\nCritical controls include:\n- single-consume message semantics,\n- deterministic mint/unlock accounting,\n- paused-mode handling ل incident containment,\n- reconciliation reports between source و target totals.\n\nA bridge flow should define state transitions explicitly: initiated, attested, executed, reconciled. Missing state transitions create operational blind spots.\n\nReplay و duplication are recurring bridge risks. Systems must key transfer intents deterministically و reject repeated execution attempts even under retries or delayed relays.\n\nProduction bridge operations also need runbooks: what to do on attestation delays, threshold signer issues, or target-chain execution failures.\n\nBridging quality is not just throughput; it is verifiable accounting integrity under adverse network conditions.",
            "duration": "45 min"
          },
          "lesson-43-2-2": {
            "title": "Token Locker Challenge",
            "content": "Implement token locking ل bridge deposits.",
            "duration": "45 min",
            "hints": [
              "Push lock to vector و return index as lock_id",
              "Verify requester matches owner before unlocking",
              "Use filter و sum to calculate owner's locked amount"
            ]
          },
          "lesson-43-2-3": {
            "title": "Wrapped Token Mint Challenge",
            "content": "Manage wrapped token minting و supply tracking.",
            "duration": "45 min",
            "hints": [
              "Push token to vector و return index",
              "Check bounds before minting/burning",
              "Use get() و map() to safely retrieve supply"
            ]
          },
          "lesson-43-2-4": {
            "title": "Bridge Rate Limiter Challenge",
            "content": "Implement rate limiting ل bridge withdrawals.",
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
    "title": "Oracle Integration و Pyth Network",
    "description": "Integrate Solana oracle feeds safely: price validation, confidence/staleness policy, و multi-source aggregation ل resilient protocol decisions.",
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
        "description": "Understand oracle data semantics (price, confidence, staleness) و enforce deterministic validation before business logic.",
        "lessons": {
          "lesson-44-1-1": {
            "title": "Oracle Price Feeds",
            "content": "Oracle integration is a risk-control problem, not a data-fetch problem. Price feeds must be evaluated ل freshness, confidence, و contextual fitness before they drive protocol decisions.\n\nA safe oracle validation pipeline checks:\n1) feed status و availability,\n2) staleness window compliance,\n3) confidence-band reasonableness,\n4) value bounds against protocol policy.\n\nUsing raw price without confidence or staleness checks can trigger invalid liquidations, bad quotes, or incorrect risk assessments.\n\nValidation outputs should be deterministic و structured (accept/reject مع reason code). This helps downstream systems choose safe fallback behavior.\n\nProtocols should separate “data exists” from “data is usable.” A feed can be present but still unfit due to stale timestamp or extreme uncertainty.\n\nProduction reliability improves when oracle checks are versioned و fixture-tested across calm و stressed market scenarios.",
            "duration": "45 min"
          },
          "lesson-44-1-2": {
            "title": "Price مدقق Challenge",
            "content": "Validate oracle prices ل correctness و freshness.",
            "duration": "45 min",
            "hints": [
              "Freshness: current_time - publish_time <= max_staleness",
              "Confidence ratio: conf / |price| < threshold",
              "Use matches! ل enum variant checking"
            ]
          },
          "lesson-44-1-3": {
            "title": "Price Normalizer Challenge",
            "content": "Normalize prices مع different exponents to common scale.",
            "duration": "45 min",
            "hints": [
              "Calculate decimal difference و scale accordingly",
              "Use u128 ل متوسط to prevent overflow",
              "Buy price increases, sell price decreases مع spread"
            ]
          },
          "lesson-44-1-4": {
            "title": "EMA Calculator Challenge",
            "content": "Calculate Exponential Moving Average ل price smoothing.",
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
        "description": "التصميم multi-oracle aggregation و consensus policies that reduce single-source failure risk while remaining explainable و testable.",
        "lessons": {
          "lesson-44-2-1": {
            "title": "Oracle Aggregation Strategies",
            "content": "Multi-oracle aggregation reduces single-point dependency but adds policy complexity. The goal is not to average blindly; it is to produce a robust decision value مع clear confidence in adverse conditions.\n\nCommon strategies include median, trimmed mean, و weighted consensus. Strategy choice should reflect threat model: outlier resistance, latency tolerance, و source diversity.\n\nAggregation policies should define:\n- minimum participating sources,\n- max divergence threshold,\n- fallback action when consensus fails.\n\nIf sources diverge beyond policy bounds, the safe action may be to halt sensitive operations rather than force a number.\n\nDeterministic aggregation reports should include contributing sources, excluded outliers, و final consensus rationale. This is essential ل audits و incident response.\n\nA good oracle stack is transparent: every accepted value can be explained, replayed, و defended.",
            "duration": "45 min"
          },
          "lesson-44-2-2": {
            "title": "Median Price Calculator Challenge",
            "content": "Calculate median price from multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Sort prices و find middle element(s) ل median",
              "ل weighted median, accumulate weights until reaching 50%",
              "Use retain() to filter out outliers"
            ]
          },
          "lesson-44-2-3": {
            "title": "Oracle Consensus Challenge",
            "content": "Implement consensus checking across multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Check minimum sources first",
              "Find a price that at least 50% of oracles agree مع",
              "Agreement percent is (agreeing / total) * 100"
            ]
          },
          "lesson-44-2-4": {
            "title": "Fallback Oracle Manager Challenge",
            "content": "Manage primary و fallback oracle sources.",
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
    "title": "DAO Tooling و Autonomous Organizations",
    "description": "Build production-ready DAO systems on Solana: proposal الحوكمة, voting integrity, treasury controls, و deterministic execution/reporting workflows.",
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
        "title": "DAO الحوكمة Mechanics",
        "description": "Implement الحوكمة mechanics مع explicit proposal lifecycle rules, voting-power logic, و deterministic state transitions.",
        "lessons": {
          "lesson-45-1-1": {
            "title": "DAO الحوكمة Architecture",
            "content": "DAO الحوكمة architecture is a system of enforceable process rules. Proposal creation, voting, و execution must be deterministic, auditable, و resistant to manipulation.\n\nA robust الحوكمة model defines:\n1) proposal lifecycle states و transitions,\n2) voter eligibility و power calculation,\n3) quorum/approval thresholds by action class,\n4) execution preconditions و cancellation paths.\n\nالحوكمة failures usually come from ambiguity: unclear thresholds, inconsistent snapshot timing, or weak transition validation.\n\nState transitions should be explicit و testable. Invalid transitions (ل example executed -> voting) should fail مع deterministic errors.\n\nVoting-power logic must also be transparent. Whether delegation, time-weighting, or quadratic models are used, outcomes should be reproducible from public inputs.\n\nDAO tooling quality is measured by predictability under pressure. During contentious proposals, deterministic behavior و clear reason codes are what preserve legitimacy.",
            "duration": "45 min"
          },
          "lesson-45-1-2": {
            "title": "Proposal Lifecycle Manager Challenge",
            "content": "Manage DAO proposal states و transitions.",
            "duration": "45 min",
            "hints": [
              "Match on (current, new) state pairs ل valid transitions",
              "Voting active only during time window in Active state",
              "Quorum و threshold use basis point calculations"
            ]
          },
          "lesson-45-1-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Calculate voting power مع delegation و quadratic options.",
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
              "Use position() و remove() to undelegate",
              "Filter و sum to get delegated amount"
            ]
          }
        }
      },
      "mod-45-2": {
        "title": "Treasury و Execution",
        "description": "Engineer treasury و execution tooling مع policy gates, timelock safeguards, و auditable automation outcomes.",
        "lessons": {
          "lesson-45-2-1": {
            "title": "DAO Treasury Management",
            "content": "DAO treasury management is where الحوكمة intent becomes real financial action. Treasury tooling must therefore combine flexibility مع strict policy constraints.\n\nCore controls include:\n- spending limits و role-based authority,\n- timelock windows ل sensitive actions,\n- multisig/escalation paths,\n- deterministic execution logs.\n\nAutomated execution should never hide policy checks. Every executed action should reference the proposal, required approvals, و control checks passed.\n\nFailure handling is equally important. If execution fails mid-flow, tooling should expose exact failure stage و safe retry/rollback guidance.\n\nTreasury systems should also produce reconciliation artifacts: proposed vs executed amounts, remaining budget, و exception records.\n\nOperationally mature DAOs treat treasury automation as regulated process infrastructure: explicit controls, reproducible evidence, و clear accountability boundaries.",
            "duration": "45 min"
          },
          "lesson-45-2-2": {
            "title": "Treasury Spending Limit Challenge",
            "content": "Implement spending limits و budget tracking ل DAO treasury.",
            "duration": "45 min",
            "hints": [
              "Check balance و category limits before allowing spend",
              "Reset period if duration has passed",
              "Use saturating_sub to avoid underflow"
            ]
          },
          "lesson-45-2-3": {
            "title": "Timelock Executor Challenge",
            "content": "Implement timelock ل delayed proposal execution.",
            "duration": "45 min",
            "hints": [
              "Push operation و return index as ID",
              "Can execute only if ETA reached و not executed",
              "Remove operation from list to cancel"
            ]
          },
          "lesson-45-2-4": {
            "title": "Automated Action Trigger Challenge",
            "content": "Implement automated triggers ل DAO actions based on conditions.",
            "duration": "45 min",
            "hints": [
              "Push action و return index as ID",
              "Match on condition type to evaluate",
              "Only return non-triggered actions that meet conditions"
            ]
          }
        }
      }
    }
  },
  "solana-gaming": {
    "title": "Gaming و Game State Management",
    "description": "Build production-ready on-chain game systems on Solana: efficient state models, turn integrity, fairness controls, و scalable player progression economics.",
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
        "description": "التصميم game state و turn logic مع deterministic transitions, storage efficiency, و anti-cheat validation boundaries.",
        "lessons": {
          "lesson-46-1-1": {
            "title": "On-Chain Game التصميم",
            "content": "On-chain game التصميم on Solana is a systems-engineering tradeoff between fairness, responsiveness, و cost. The best designs keep critical rules verifiable while minimizing expensive state writes.\n\nCore architecture decisions:\n1) what state must be on-chain ل trust,\n2) what can remain off-chain ل speed,\n3) how turn validity is enforced deterministically.\n\nTurn-based mechanics should use explicit state transitions و guard checks (current actor, phase, cooldown, resource limits). If transitions are ambiguous, replay و dispute resolution become difficult.\n\nState compression و compact encoding matter because game loops can generate many updates. Efficient schemas reduce rent و compute pressure while preserving auditability.\n\nA production game model should also define anti-cheat boundaries. Even مع deterministic logic, you need clear validation ل illegal actions, stale turns, و duplicate submissions.\n\nReliable game infrastructure is measured by predictable outcomes under stress: same input actions, same resulting state, clear reject reasons ل invalid actions.",
            "duration": "45 min"
          },
          "lesson-46-1-2": {
            "title": "Turn Manager Challenge",
            "content": "Implement turn-based game mechanics مع action validation.",
            "duration": "45 min",
            "hints": [
              "Check player matches, state is waiting, و before deadline",
              "Turn complete when all players submitted",
              "Increment turn number ل next turn"
            ]
          },
          "lesson-46-1-3": {
            "title": "Game State Compressor Challenge",
            "content": "Compress game state ل efficient on-chain storage.",
            "duration": "45 min",
            "hints": [
              "Use bit shifting to pack x in high 4 bits, y in low 4 bits",
              "Unpack by shifting و masking",
              "Health stored as percentage (0-100) fits in 7 bits"
            ]
          },
          "lesson-46-1-4": {
            "title": "Player Progression Tracker Challenge",
            "content": "Track player experience, levels, و achievements.",
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
        "title": "Randomness و Fairness",
        "description": "Implement fairness-oriented randomness و integrity controls that keep gameplay auditable و dispute-resistant.",
        "lessons": {
          "lesson-46-2-1": {
            "title": "On-Chain Randomness",
            "content": "Randomness is one of the hardest fairness problems in blockchain games because execution is deterministic. Robust designs avoid naive pseudo-randomness tied directly to manipulable context.\n\nعملي fairness patterns include commit-reveal, VRF-backed randomness, و delayed-seed schemes. Each has latency/trust tradeoffs:\n- commit-reveal: simple و transparent, but requires multi-step interaction,\n- VRF: stronger unpredictability, but introduces oracle/dependency considerations,\n- delayed-seed methods: lower overhead but weaker guarantees under adversarial pressure.\n\nFairness engineering should specify:\n1) who can influence randomness inputs,\n2) when values become immutable,\n3) how unresolved rounds are handled on timeout.\n\nProduction systems should emit deterministic round evidence (commit hash, reveal value, validation result) so disputes can be resolved quickly.\n\nGame fairness is credible when randomness mechanisms are explicit, verifiable, و resilient to timing manipulation.",
            "duration": "45 min"
          },
          "lesson-46-2-2": {
            "title": "Commit-Reveal Challenge",
            "content": "Implement commit-reveal scheme ل fair randomness.",
            "duration": "45 min",
            "hints": [
              "Push commitment to vector",
              "Verify by recomputing hash from reveal",
              "XOR all revealed values ل combined randomness"
            ]
          },
          "lesson-46-2-3": {
            "title": "Dice Roller Challenge",
            "content": "Implement verifiable dice rolling مع randomness.",
            "duration": "45 min",
            "hints": [
              "Use hash of seed ل deterministic randomness",
              "Modulo operation gives range, add 1 ل 1-based",
              "4d6 drop lowest: roll 4, sum all, subtract minimum"
            ]
          },
          "lesson-46-2-4": {
            "title": "Loot Table Challenge",
            "content": "Implement weighted loot tables ل game rewards.",
            "duration": "45 min",
            "hints": [
              "Sum all weights ل total",
              "Generate random number in range [0, total)",
              "Find item where cumulative weight exceeds roll"
            ]
          }
        }
      }
    }
  },
  "solana-permanent-storage": {
    "title": "Permanent Storage و Arweave",
    "description": "Integrate permanent decentralized storage مع Solana using Arweave-style workflows: content addressing, manifest integrity, و verifiable long-term data access.",
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
        "description": "Understand permanent-storage architecture و build deterministic linking between Solana state و external immutable content.",
        "lessons": {
          "lesson-47-1-1": {
            "title": "Permanent Storage Architecture",
            "content": "Permanent storage integration is a data durability contract. On Solana, storing full content on-chain is often impractical, so systems rely on immutable external storage references anchored by on-chain metadata.\n\nA robust architecture defines:\n1) canonical content identifiers,\n2) integrity verification method,\n3) fallback retrieval behavior,\n4) lifecycle policy ل metadata updates.\n\nContent-addressed التصميم is critical. If identifiers are not tied to content hash semantics, integrity guarantees weaken و replayed/wrong assets can be served.\n\nStorage integration should also separate control-plane و data-plane concerns: on-chain records govern ownership/version pointers, while external storage handles large payload persistence.\n\nProduction reliability requires deterministic verification reports (ID format validity, expected hash match, availability checks). This makes failures diagnosable و prevents silent corruption.\n\nPermanent storage systems succeed when users can independently verify that referenced content matches what الحوكمة or protocol state claims.",
            "duration": "45 min"
          },
          "lesson-47-1-2": {
            "title": "معاملة ID مدقق Challenge",
            "content": "Validate Arweave معاملة IDs و URLs.",
            "duration": "45 min",
            "hints": [
              "Check exact length و all characters valid",
              "base64url uses alphanumeric plus - و _"
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
            "content": "Optimize data bundling ل efficient Arweave uploads.",
            "duration": "45 min",
            "hints": [
              "Sort items by priority before bundling"
            ]
          }
        }
      },
      "mod-47-2": {
        "title": "Manifests و Verification",
        "description": "Work مع manifests, verification pipelines, و cost/الاداء controls ل reliable long-lived data serving.",
        "lessons": {
          "lesson-47-2-1": {
            "title": "Arweave Manifests",
            "content": "Manifests turn many stored assets into one navigable root, but they introduce their own integrity responsibilities. A manifest is only trustworthy if path mapping و referenced content IDs are validated consistently.\n\nKey safeguards:\n- deterministic path normalization,\n- duplicate/ambiguous key rejection,\n- strict معاملة-ID validation,\n- recursive integrity checks ل referenced content.\n\nManifest tooling should produce auditable outputs: resolved entries count, missing references, و hash verification status by path.\n\nFrom an operational standpoint, cost optimization should not compromise integrity. Bundling strategies, compression, و metadata minimization are useful only if verification remains straightforward و deterministic.\n\nWell-run permanent-storage pipelines treat manifests as governed artifacts مع versioned schema expectations و repeatable validation in CI.",
            "duration": "45 min"
          },
          "lesson-47-2-2": {
            "title": "Manifest Builder Challenge",
            "content": "Build و parse Arweave manifests.",
            "duration": "45 min",
            "hints": [
              "Validate tx_id length before adding",
              "Resolve in order: exact, index, fallback"
            ]
          },
          "lesson-47-2-3": {
            "title": "Data Verifier Challenge",
            "content": "Verify data integrity و availability on Arweave.",
            "duration": "45 min",
            "hints": [
              "MIN_CONFIRMATIONS defines 'sufficient' threshold"
            ]
          },
          "lesson-47-2-4": {
            "title": "Storage Indexer Challenge",
            "content": "Index و query stored data by tags.",
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
    "title": "Staking و مدقق Economics",
    "description": "Understand Solana staking و مدقق economics ل real-world decision-making: delegation strategy, reward dynamics, commission effects, و operational sustainability.",
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
        "description": "تعلم native staking mechanics مع deterministic reward modeling, مدقق selection criteria, و delegation risk framing.",
        "lessons": {
          "lesson-48-1-1": {
            "title": "Solana Staking Architecture",
            "content": "Solana staking economics is an incentives system connecting delegators, مدققون, و network الامان. Good delegation decisions require more than chasing headline APY.\n\nDelegators should evaluate:\n1) مدقق الاداء consistency,\n2) commission policy و changes over time,\n3) uptime و vote behavior,\n4) concentration risk across the مدقق set.\n\nReward modeling should be deterministic و transparent. Calculations must show gross rewards, commission effects, و net delegator outcome under explicit assumptions.\n\nDiversification matters. Concentrating stake purely on top performers can increase ecosystem centralization risk even if short-term yield appears higher.\n\nProduction staking tooling should expose scenario analysis (commission changes, الاداء drops, epoch variance) so delegators can make resilient choices rather than reactive moves.\n\nStaking quality is measured by sustainable net returns plus contribution to healthy مدقق distribution.",
            "duration": "45 min"
          },
          "lesson-48-1-2": {
            "title": "Staking Rewards Calculator Challenge",
            "content": "Calculate staking rewards مع commission و inflation.",
            "duration": "45 min",
            "hints": [
              "Apply commission as (1 - commission) multiplier",
              "Divide annual by epochs per year ل epoch reward",
              "APY is (reward / stake) * 100"
            ]
          },
          "lesson-48-1-3": {
            "title": "مدقق Selector Challenge",
            "content": "Select مدققون based on الاداء و commission.",
            "duration": "45 min",
            "hints": [
              "Weight factors: commission 40%, uptime 40%, skip rate 20%",
              "Sort by score descending و take top N",
              "Check each مدقق's percentage of total stake"
            ]
          },
          "lesson-48-1-4": {
            "title": "Stake Rebalancing Challenge",
            "content": "Optimize stake distribution across مدققون.",
            "duration": "45 min",
            "hints": [
              "Target is total divided by count, clamped to min/max",
              "Count allocations that differ between old و new",
              "Check all allocations within tolerance percentage"
            ]
          }
        }
      },
      "mod-48-2": {
        "title": "مدقق Operations",
        "description": "Analyze مدقق-side economics, operational cost pressure, و incentive alignment ل long-term network health.",
        "lessons": {
          "lesson-48-2-1": {
            "title": "مدقق Economics",
            "content": "مدقق economics balances revenue opportunities against operational costs و reliability obligations. Sustainable مدققون optimize ل long-term trust, not short-term extraction.\n\nRevenue sources include inflation rewards و fee-related earnings; cost structure includes hardware, networking, maintenance, و operational staffing.\n\nKey operational metrics ل مدقق viability:\n- effective uptime و vote success,\n- commission competitiveness,\n- stake retention trend,\n- incident frequency و recovery quality.\n\nCommission strategy should be explicit و predictable. Sudden commission spikes can damage delegator trust و long-term stake stability.\n\nEconomic analysis should include downside modeling: reduced stake, higher incident costs, or prolonged الاداء degradation.\n\nHealthy مدقق economics supports network resilience. Tooling should help operators و delegators reason about sustainability, not just peak-period earnings.",
            "duration": "45 min"
          },
          "lesson-48-2-2": {
            "title": "مدقق Profit Calculator Challenge",
            "content": "Calculate مدقق profitability.",
            "duration": "45 min",
            "hints": [
              "Sum all cost components",
              "Revenue = commission * delegated_rewards + self_rewards",
              "Break-even: commission = needed_rewards / delegated_rewards"
            ]
          },
          "lesson-48-2-3": {
            "title": "Epoch Schedule Calculator Challenge",
            "content": "Calculate epoch timing و reward distribution schedules.",
            "duration": "45 min",
            "hints": [
              "Convert ms to hours: / (1000 * 60 * 60)",
              "Next epoch starts at (current_epoch + 1) * slots_per_epoch",
              "Epoch ل slot is integer division"
            ]
          },
          "lesson-48-2-4": {
            "title": "Stake حساب Manager Challenge",
            "content": "Manage stake حساب lifecycle including activation و deactivation.",
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
    "title": "حساب Abstraction و Smart محافظ",
    "description": "Implement smart-محفظة/حساب-abstraction patterns on Solana مع programmable authorization, recovery controls, و policy-driven معاملة validation.",
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
        "title": "Smart محفظة Fundamentals",
        "description": "Build smart-محفظة fundamentals including multisig و social-recovery designs مع clear trust و failure boundaries.",
        "lessons": {
          "lesson-49-1-1": {
            "title": "حساب Abstraction on Solana",
            "content": "حساب abstraction on Solana shifts control from a single key to programmable policy. Smart محافظ can enforce richer authorization logic, but policy complexity must be managed carefully.\n\nA robust smart-محفظة التصميم defines:\n1) authority model (owners/guardians/delegates),\n2) policy scope (what can be approved automatically vs manually),\n3) recovery path (how access is restored safely).\n\nMultisig و social recovery are powerful, but both need deterministic state transitions و explicit quorum rules. Ambiguous transitions create lockout or unauthorized-access risk.\n\nSmart-محفظة systems should emit structured authorization evidence ل each action: which policy matched, which signers approved, و which constraints passed.\n\nProduction reliability depends on clear emergency controls: pause paths, guardian rotation, و recovery cooldowns.\n\nحساب abstraction is successful when flexibility increases safety و usability together, not when policy logic becomes opaque.",
            "duration": "45 min"
          },
          "lesson-49-1-2": {
            "title": "Multi-Signature محفظة Challenge",
            "content": "Implement M-of-N multi-signature محفظة.",
            "duration": "45 min",
            "hints": [
              "Use contains() to check ownership",
              "Can sign if owner و not already signed و not executed",
              "Can execute if threshold reached و not executed"
            ]
          },
          "lesson-49-1-3": {
            "title": "Social Recovery Challenge",
            "content": "Implement social recovery مع guardians.",
            "duration": "45 min",
            "hints": [
              "Track approvals in guardians_approved vector",
              "Check guardian status before approving",
              "Require threshold و delay ل execution"
            ]
          },
          "lesson-49-1-4": {
            "title": "Session Key Manager Challenge",
            "content": "Manage temporary session keys مع limited permissions.",
            "duration": "45 min",
            "hints": [
              "Valid if current time before expiration",
              "Can execute if valid, allowed operation, و within limit",
              "Remaining is max minus used"
            ]
          }
        }
      },
      "mod-49-2": {
        "title": "Programmable Validation",
        "description": "Implement programmable validation policies (limits, allowlists, time/risk rules) مع deterministic enforcement و auditability.",
        "lessons": {
          "lesson-49-2-1": {
            "title": "Custom Validation Rules",
            "content": "Programmable validation is where smart محافظ deliver real value, but it is also where subtle policy bugs appear.\n\nTypical controls include spending limits, destination allowlists, time windows, و risk-score gates. These controls should be deterministic و composable, مع explicit precedence rules.\n\nالتصميم principles:\n- fail closed on ambiguous policy matches,\n- keep policy evaluation order stable,\n- attach machine-readable reason codes to approve/reject outcomes.\n\nValidation systems should also support policy explainability. Users و auditors need to understand why a معاملة was blocked or approved.\n\nل production deployments, policy changes should be versioned و test-fixtured. A new rule must be validated against prior known-good scenarios to avoid accidental lockouts or bypasses.\n\nProgrammable محافظ are strongest when validation logic is transparent, testable, و operationally reversible.",
            "duration": "45 min"
          },
          "lesson-49-2-2": {
            "title": "Spending Limit Enforcer Challenge",
            "content": "Enforce daily و per-معاملة spending limits.",
            "duration": "45 min",
            "hints": [
              "Reset counters before checking",
              "Check all three limits: per-tx, daily, weekly",
              "Reset daily if new day, weekly if 7+ days passed"
            ]
          },
          "lesson-49-2-3": {
            "title": "Whitelist Enforcer Challenge",
            "content": "Enforce destination whitelists ل معاملات.",
            "duration": "45 min",
            "hints": [
              "allow_all bypasses whitelist check",
              "Check contains() before adding",
              "Validate all destinations in معاملة"
            ]
          },
          "lesson-49-2-4": {
            "title": "Time Lock Enforcer Challenge",
            "content": "Enforce time-based restrictions on معاملات.",
            "duration": "45 min",
            "hints": [
              "Handle wrap-around ل hours crossing midnight",
              "Check elapsed is between min و max delay",
              "Validate hours are 0-23 و min <= max"
            ]
          }
        }
      }
    }
  },
  "solana-pda-mastery": {
    "title": "عنوان مشتق من البرنامج Mastery",
    "description": "Master متقدم PDA engineering on Solana: seed schema التصميم, bump handling discipline, و secure cross-program PDA usage at production scale.",
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
        "description": "Build strong PDA foundations مع deterministic derivation, canonical seed composition, و collision-resistant namespace strategy.",
        "lessons": {
          "lesson-50-1-1": {
            "title": "عناوين مشتقة من البرنامج",
            "content": "عناوين مشتقة من البرنامج (PDAs) are deterministic authority و state anchors on Solana. Their power comes from predictable derivation; their risk comes from inconsistent seed discipline.\n\nA strong PDA التصميم standard defines:\n1) canonical seed order,\n2) explicit namespace/domain tags,\n3) bump handling rules,\n4) versioning strategy ل future evolution.\n\nSeed ambiguity is a common source of bugs. If different handlers derive the same concept مع different seed ordering, identity checks become inconsistent و الامان assumptions break.\n\nPDA validation should always re-derive expected addresses on the trusted side و compare exact keys before mutating state.\n\nProduction teams should document seed recipes as API contracts. Changing recipes without migration planning can orphan state و break clients.\n\nPDA mastery is mostly discipline: deterministic derivation everywhere, no implicit conventions, no trust in client-provided derivation claims.",
            "duration": "45 min"
          },
          "lesson-50-1-2": {
            "title": "PDA Generator Challenge",
            "content": "Implement PDA generation مع seed validation.",
            "duration": "45 min",
            "hints": [
              "Try bumps from 255 down to 0",
              "Combine seeds, program_id, و bump in hash",
              "Check if derived address matches expected"
            ]
          },
          "lesson-50-1-3": {
            "title": "Seed Composer Challenge",
            "content": "Compose complex seed patterns ل different use cases.",
            "duration": "45 min",
            "hints": [
              "Use byte string literals b\"...\" ل static prefixes",
              "Convert integers مع to_le_bytes()",
              "Collect into Vec<Vec<u8>>"
            ]
          },
          "lesson-50-1-4": {
            "title": "Bump Manager Challenge",
            "content": "Manage bump seeds ل PDA verification و signing.",
            "duration": "45 min",
            "hints": [
              "Compare stored seeds مع expected seeds",
              "Signer seeds include all seeds plus bump",
              "Canonical bump is from find_pda مع highest valid bump"
            ]
          }
        }
      },
      "mod-50-2": {
        "title": "متقدم PDA Patterns",
        "description": "Implement متقدم PDA patterns (nested/counter/stateful) while preserving الامان invariants و migration safety.",
        "lessons": {
          "lesson-50-2-1": {
            "title": "PDA التصميم Patterns",
            "content": "متقدم PDA patterns solve real scaling و composability needs but increase التصميم complexity.\n\nNested PDAs, counter-based PDAs, و multi-tenant PDA namespaces each require explicit invariants around uniqueness, lifecycle, و authority boundaries.\n\nKey safeguards:\n- monotonic counters مع replay protection,\n- collision checks in shared namespaces,\n- explicit ownership checks on all derived-state paths,\n- deterministic migration paths when schema/seed versions evolve.\n\nCross-program PDA interactions must minimize signer scope. invoke_signed should only grant exactly what downstream steps require.\n\nOperationally, متقدم PDA systems need deterministic audit artifacts: derivation inputs, expected outputs, و validation results by تعليمة path.\n\nComplex PDA architecture is safe when derivation logic remains simple to reason about و impossible to interpret ambiguously.",
            "duration": "45 min"
          },
          "lesson-50-2-2": {
            "title": "Nested PDA Generator Challenge",
            "content": "Generate PDAs derived from other PDA addresses.",
            "duration": "45 min",
            "hints": [
              "Include parent address in child seeds",
              "Use index bytes ل sibling derivation",
              "Verify by re-deriving و comparing"
            ]
          },
          "lesson-50-2-3": {
            "title": "Counter PDA Generator Challenge",
            "content": "Generate unique PDAs using incrementing counters.",
            "duration": "45 min",
            "hints": [
              "Increment counter after each generation",
              "Use counter in seeds ل uniqueness",
              "Batch generation calls generate_next multiple times"
            ]
          },
          "lesson-50-2-4": {
            "title": "PDA Collision Detector Challenge",
            "content": "Detect و prevent PDA seed collisions.",
            "duration": "45 min",
            "hints": [
              "Check if seeds match any existing entry",
              "Return error if collision detected",
              "Collision risk if same structure و component sizes"
            ]
          }
        }
      }
    }
  },
  "solana-economics": {
    "title": "Solana Economics و Token Flows",
    "description": "Analyze Solana economic dynamics in production context: inflation/fee-burn interplay, staking flows, supply movement, و protocol sustainability tradeoffs.",
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
        "description": "Understand Solana macro token economics (inflation, burn, rewards, fees) مع deterministic scenario modeling.",
        "lessons": {
          "lesson-51-1-1": {
            "title": "Solana Token Economics",
            "content": "Solana economics is the interaction of issuance, burn, staking rewards, و usage demand. Sustainable protocol decisions require understanding these flows as a system, not isolated metrics.\n\nCore mechanisms include:\n1) inflation schedule و long-term emission behavior,\n2) fee burn و مدقق reward pathways,\n3) staking participation effects on circulating supply.\n\nEconomic analysis should be scenario-driven. Single-point estimates hide risk. Teams should model calm/high-usage/low-usage regimes و compare supply-pressure outcomes.\n\nDeterministic calculators are useful ل الحوكمة و product planning because they make assumptions explicit: epoch cadence, fee volume, staking ratio, و unlock schedules.\n\nHealthy economic reasoning links network-level flows to protocol-level choices (treasury policy, incentive emissions, fee strategy).\n\nEconomic quality improves when teams publish assumption-driven reports instead of headline narratives.",
            "duration": "45 min"
          },
          "lesson-51-1-2": {
            "title": "Inflation Calculator Challenge",
            "content": "Calculate inflation rate و staking rewards over time.",
            "duration": "45 min",
            "hints": [
              "Use powi ل disinflation calculation",
              "Compound inflation year over year",
              "APY is inflation divided by staked percentage"
            ]
          },
          "lesson-51-1-3": {
            "title": "Fee Burn Calculator Challenge",
            "content": "Calculate fee burns و their deflationary impact.",
            "duration": "45 min",
            "hints": [
              "Priority multiplier increases مع priority level",
              "Burn is percentage of total fee",
              "Annual estimate is daily * 365"
            ]
          },
          "lesson-51-1-4": {
            "title": "Rent Economics Calculator Challenge",
            "content": "Calculate rent costs و exemption thresholds.",
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
        "description": "Model token flow dynamics و sustainability signals using supply categories, unlock events, و behavior-driven liquidity effects.",
        "lessons": {
          "lesson-51-2-1": {
            "title": "Token Flow Dynamics",
            "content": "Token flow analysis turns abstract economics into operational insight. The key is to track where tokens are (staked, circulating, locked, treasury, pending unlock) و how they move over time.\n\nUseful flow metrics include:\n- net circulating change,\n- staking inflow/outflow trend,\n- unlock cliff concentration,\n- treasury spend velocity.\n\nUnlock events should be modeled ل market-impact risk. Large clustered unlocks can create short-term supply shock even when long-term tokenomics is sound.\n\nFlow tooling should support deterministic category accounting و conservation checks (total categorized supply consistency).\n\nل الحوكمة, flow analysis is most valuable when tied to policy actions: adjust emissions, change vesting cadence, alter incentive programs.\n\nSustainable token systems are not static designs; they are continuously monitored flow systems مع explicit policy feedback loops.",
            "duration": "45 min"
          },
          "lesson-51-2-2": {
            "title": "Supply Flow Tracker Challenge",
            "content": "Track token supply categories و flows.",
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
            "content": "Calculate sustainability metrics ل tokenomics.",
            "duration": "45 min",
            "hints": [
              "Net issuance is inflation minus burn",
              "Burn ratio is burn divided by inflation",
              "Score combines burn ratio و staking ratio"
            ]
          }
        }
      }
    }
  }
};
