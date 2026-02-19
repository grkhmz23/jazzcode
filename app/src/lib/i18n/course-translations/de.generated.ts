import type { CourseTranslationMap } from "./types";

export const deGeneratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    "title": "Solana Fundamentals",
    "description": "Production-grade introduction fuer beginners who want clear Solana mentales modells, stronger transaktion debugging skills, und deterministic wallet-manager workflows.",
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
        "title": "Erste schritte",
        "description": "Core execution model, konto semantics, und transaktion construction patterns you need before writing programs or complex clients.",
        "lessons": {
          "solana-mental-model": {
            "title": "Solana mentales modell",
            "content": "# Solana mentales modell\n\nSolana development gets much easier once you stop thinking in terms of \"contracts that own state\" und start thinking in terms of \"programs that operate on konten.\" On Solana, the durable state of your app does not live inside executable code. It lives in konten, und every anweisung explicitly says which konten it wants to read or write. Programs are stateless logic: they validate inputs, apply rules, und update konto data when authorized.\n\nA transaktion is a signed message containing one or more ordered anweisungen. Each anweisung names a target program, the konten it needs, und serialized data. The runtime processes those anweisungen in order, und the transaktion is atomic: either all anweisungen succeed, or none are committed. This matters fuer correctness. If your second anweisung depends on the first anweisung's output, transaktion atomicity guarantees you never end up in a half-applied state.\n\nFuer execution validity, several fields matter together: a fee payer, a recent blockhash, anweisung payloads, und all required signatures. The fee payer funds transaktion fees. The recent blockhash gives the message a freshness window, preventing replay of old signed messages. Required signatures prove authorization from signers declared by anweisung konto metadata. Missing or invalid signatures cause rejection before anweisung logic runs.\n\nSolana's parallelism comes from konto access metadata. Because each anweisung lists read und write konten up front, the runtime can schedule non-conflicting transaktionen simultaneously. If two transaktionen only read the same konto, they can run in parallel. If they both write the same konto, one must wait. This read/write locking model is a core reason Solana can scale while preserving deterministic outcomes.\n\nWhen reading chain state, you'll also see commitment levels: processed, confirmed, und finalized. Conceptually, processed means observed quickly, confirmed means voted by the cluster, und finalized means rooted deeply enough that rollback risk is minimal. Treat commitment as a consistency/latency trade-off knob, not a fixed-time guarantee.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l1-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l1-q1",
                    "prompt": "What makes Solana state live “in konten” rather than “inside contracts”?",
                    "options": [
                      "Programs are stateless logic und konto data is passed explicitly to anweisungen",
                      "Programs persist mutable storage internally und only expose events",
                      "Validatoren assign storage to whichever program has the most stake"
                    ],
                    "answerIndex": 0,
                    "explanation": "On Solana, mutable app state is konto data. Programs validate und mutate those konten but do not hold mutable state internally."
                  },
                  {
                    "id": "l1-q2",
                    "prompt": "Which fields make a transaktion valid to execute?",
                    "options": [
                      "Only program IDs und anweisung data",
                      "Fee payer, recent blockhash, signatures, und anweisungen",
                      "A wallet address und a memo string"
                    ],
                    "answerIndex": 1,
                    "explanation": "The runtime checks the message envelope und authorization: fee payer, freshness via blockhash, required signatures, und anweisung payloads."
                  },
                  {
                    "id": "l1-q3",
                    "prompt": "Why does Solana care about read/write konto sets?",
                    "options": [
                      "To calculate NFT metadata size",
                      "To schedule non-conflicting transaktionen in parallel safely",
                      "To compress signatures on mobile wallets"
                    ],
                    "answerIndex": 1,
                    "explanation": "Read/write sets let the runtime detect conflicts und parallelize independent work deterministically."
                  }
                ]
              }
            ]
          },
          "accounts-model-deep-dive": {
            "title": "Konten model tiefenanalyse",
            "content": "# Konten model tiefenanalyse\n\nEvery on-chain object on Solana is an konto mit a standard envelope. You can reason about any konto using a small set of fields: address, lamports, owner, executable flag, und data bytes length/content. Address (a public key) identifies the konto. Lamports represent native SOL balance in the smallest unit (1 SOL = 1,000,000,000 lamports). Owner is the program allowed to modify konto data und debit lamports according to runtime rules. Executable indicates whether the konto stores runnable program code. Data length tells you how many bytes are allocated fuer state.\n\nSystem wallet konten are usually owned by the System Program und often have `dataLen = 0`. Program konten are executable und typically owned by loader/runtime programs, not by your application directly. Token balances do not live directly in wallet konten. SPL tokens use dedicated token konten, each tied to a specific mint und owner, because token state has its own program-defined layout und rules.\n\nRent-exemption is the praktisch baseline fuer persistent storage. The more bytes an konto allocates, the higher the minimum lamports needed to keep it alive without rent collection risk. Even if you never inspect binary data manually, konto size still affects user costs und protocol economics. Good schema design means allocating only what you need und planning upgrades carefully.\n\nOwner semantics are sicherheit-critical. If an konto claims to be token state but is not owned by the token program, your app should reject it. If an konto is executable, treat it as code, not mutable application data. If you understand owner + executable + data length, you can classify most konto types quickly und avoid many integration mistakes.\n\nThe fastest way to build confidence is to inspect concrete konto examples und explain what each field implies operationally.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "l2-account-explorer",
                "title": "Konto Explorer",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "System Wallet Konto",
                      "address": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                      "lamports": 2500000000,
                      "owner": "11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    },
                    {
                      "label": "Program Konto",
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
                    "prompt": "What does the `owner` field mean on an konto?",
                    "options": [
                      "It is the user who paid the creation fee forever",
                      "It is the program authorized to modify konto data",
                      "It is always the same as fee payer in the last transaktion"
                    ],
                    "answerIndex": 1,
                    "explanation": "Owner identifies the controlling program fuer state mutation und many lamport operations."
                  },
                  {
                    "id": "l2-q2",
                    "prompt": "What does `executable: true` indicate?",
                    "options": [
                      "The konto can be used as transaktion fee payer",
                      "The konto stores runnable program bytecode",
                      "The konto can hold any SPL token mint directly"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable konten are code containers; they are not ordinary mutable data konten."
                  },
                  {
                    "id": "l2-q3",
                    "prompt": "Why are token konten separate from wallet konten?",
                    "options": [
                      "Wallet konten are too small to hold decimals",
                      "Token balances are program-specific state managed by the token program",
                      "Only validatoren can read wallet balances"
                    ],
                    "answerIndex": 1,
                    "explanation": "SPL token state uses dedicated konto layouts und authorization rules enforced by the token program."
                  }
                ]
              }
            ]
          },
          "transactions-and-instructions": {
            "title": "Transaktionen & anweisungen",
            "content": "# Transaktionen & anweisungen\n\nAn anweisung is the smallest executable unit on Solana: `programId + account metas + opaque data bytes`. A transaktion wraps one or more anweisungen plus signatures und message metadata. This design gives you composability und atomicity in one envelope.\n\nThink of anweisung konten as an explicit dependency graph. Each konto meta marks whether the konto is writable und whether a signature is required. During transaktion execution, the runtime uses those flags fuer access checks und lock scheduling. If your anweisung tries to mutate an konto not marked writable, it fails. If a required signer did not sign, it fails before your program logic runs.\n\nThe transaktion message also carries fee payer und recent blockhash. Fee payer is straightforward: who funds execution. Recent blockhash is subtler: it anchors freshness. Signed messages are replay-resistant because old blockhashes expire. This is why transaktion builders usually fetch a fresh blockhash close to send time.\n\nAnweisung ordering is deterministic und significant. If anweisung B depends on konto changes from anweisung A, place A first. If any anweisung fails, the whole transaktion is rolled back. You should design multi-step flows mit this all-or-nothing behavior in mind.\n\nFuer CLI workflow, a healthy baseline is: inspect config, target the right cluster, verify active wallet, und check balance before sending anything. That sequence reduces avoidable errors und improves team reproducibility. In local scripts, log your derived addresses und transaktion summaries so teammates can reason about intent und outcomes.\n\nYou do not need RPC calls to understand this model, but you do need rigor in message construction: explicit konten, explicit ordering, explicit signatures, und explicit freshness.\n\n## Why this matters in real apps\n\nWhen production incidents happen, teams usually debug transaktion construction first: wrong signer, wrong writable flag, stale blockhash, or wrong anweisung ordering. Engineers who model transaktionen as explicit data structures can diagnose these failures quickly. Engineers who treat transaktionen like opaque wallet blobs usually need trial-und-error.\n\n## What you should be able to do after this lektion\n\n- Explain the difference between anweisung-level validation und transaktion-level validation.\n- Predict when two transaktionen can execute in parallel und when they will conflict.\n- Build a deterministic pre-send checklist fuer local scripts und frontend clients.\n",
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
                    "note": "Validate RPC URL und keypair path before sending transaktionen."
                  },
                  {
                    "cmd": "solana config set --url devnet",
                    "output": "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com",
                    "note": "Use devnet while learning to avoid accidental mainnet transaktionen."
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
            "title": "Build a SOL transfer transaktion",
            "content": "# Build a SOL transfer transaktion\n\nImplement a deterministic `buildTransferTx(params)` helper in the project file:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n- Use `@solana/web3.js`\n- Return a transaktion mit exactly one `SystemProgram.transfer` anweisung\n- Set `feePayer` und `recentBlockhash` from params\n- No network calls\n\nThis in-page challenge validates your object-shape reasoning. The authoritative checks fuer Lektion 4 run in repository unit tests, so keep your project implementation aligned mit those tests.\n",
            "duration": "35 min",
            "hints": [
              "Keep transaktion construction deterministic: no RPC or random values.",
              "Convert SOL to lamports using 1_000_000_000 multiplier.",
              "Mirror this logic in the real project helper in src/lib/kurse/solana-fundamentals/project/walletManager.ts."
            ]
          }
        }
      },
      "module-programs-and-pdas": {
        "title": "Programs & PDAs",
        "description": "Program behavior, deterministic PDA design, und SPL token mentales modells mit praktisch safety checks.",
        "lessons": {
          "programs-what-they-are": {
            "title": "Programs: what they are (und aren’t)",
            "content": "# Programs: what they are (und aren’t)\n\nA Solana program is executable konto code, not an object that secretly owns mutable storage. Your program receives konten from the transaktion, verifies constraints, und writes only to konten it is authorized to modify. This explicitness is a feature: it keeps data dependencies visible und helps the runtime parallelize safely.\n\nProgram konten are marked executable und deployed through loader programs. Upgrades are governed by upgrade authority (when configured), which is why production governance around authority custody matters. If your protocol says it is immutable, users should be able to verify upgrade authority was revoked.\n\nWhat programs are not: they are not ambient state scanners. A program cannot discover arbitrary chain data by itself at runtime. If an konto is required, it must be passed in the anweisung konto list. This is a foundational sicherheit und leistung constraint. It prevents hidden state dependencies und makes execution deterministic from the message alone.\n\nProgrammuebergreifender Aufruf (CPI) is how one program composes mit another. During CPI, your program calls into another program, passing konto metas und anweisung data. This enables rich composition: token transfers from your app logic, metadata updates, or protocol-to-protocol operations. But CPI also increases failure surface. You must validate assumptions before und after CPI, und you must track which signer und writable privileges are being forwarded.\n\nAt a high level, a robust Solana program follows a pattern: validate signer/owner/seed constraints, deserialize konto data, enforce business invariants, perform state transitions, und optionally perform CPI calls. Keeping this pipeline explicit makes audits easier und upgrades safer.\n\nThe praktisch takeaway: programs are deterministic policy engines over konten. If you keep konto boundaries clear, many sicherheit und correctness questions become mechanical rather than mystical.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l5-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l5-q1",
                    "prompt": "What makes a program konto executable?",
                    "options": [
                      "It has a wallet signature on every slot",
                      "Its konto metadata marks it executable und stores program bytecode",
                      "It owns at least one token konto"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable konten are code containers mit runtime-recognized executable metadata."
                  },
                  {
                    "id": "l5-q2",
                    "prompt": "Why can’t a program discover arbitrary konten without them being passed in?",
                    "options": [
                      "Because konto dependencies must be explicit fuer deterministic execution und lock scheduling",
                      "Because RPC nodes hide konto indexes from programs",
                      "Because only fee payers can list konten"
                    ],
                    "answerIndex": 0,
                    "explanation": "Konto lists are part of the anweisung contract; hidden discovery would break determinism und scheduling assumptions."
                  },
                  {
                    "id": "l5-q3",
                    "prompt": "What is CPI?",
                    "options": [
                      "A client-only simulation mode",
                      "Calling one on-chain program from another on-chain program",
                      "A validator-level rent optimization flag"
                    ],
                    "answerIndex": 1,
                    "explanation": "Programmuebergreifender Aufruf is core to Solana composability."
                  }
                ]
              }
            ]
          },
          "program-derived-addresses-pdas": {
            "title": "Programmabgeleitete Adressen (PDAs)",
            "content": "# Programmabgeleitete Adressen (PDAs)\n\nA Programmabgeleitete Adresse (PDA) is a deterministic konto address derived from seeds plus a program ID, mit one key property: it is intentionally off-curve, so no private key exists fuer it. This lets your program control addresses deterministically without requiring a human-held signer.\n\nDerivation starts mit seed bytes. Seeds can encode user IDs, mint addresses, version tags, und other namespace components. The runtime appends a bump seed when needed und searches fuer an off-curve output. The bump is an integer that makes derivation succeed while preserving deterministic reproducibility.\n\nWhy PDAs matter: they make address calculation stable across clients und on-chain logic. If both sides derive the same PDA from the same seed recipe, they can verify identity without extra lookup tables. This powers patterns like per-user state konten, escrow vaults, und protocol configuration konten.\n\nVerification is straightforward und critical. Off-chain clients derive PDA und include it in anweisungen. On-chain programs derive the expected PDA again und compare against the supplied konto key. If mismatch, reject. This closes an entire class of konto-substitution attacks.\n\nWho signs fuer a PDA? Not a wallet. The program can authorize as PDA during CPI by using invoke_signed mit the exact seed set und bump. Conceptually, runtime verifies the derivation proof und grants signer semantics to that PDA fuer the invoked anweisung.\n\nChanging any seed value changes the derived PDA. This is both feature und footgun: excellent fuer namespacing, dangerous if you accidentally alter seed encoding rules between versions. Keep seed schemas explicit, versioned, und documented.\n\nIn short: PDAs are deterministic, non-keypair addresses that let programs model authority und state structure cleanly.\n",
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
                      "They avoid all konto rent costs",
                      "They replace transaktion signatures entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "PDAs provide deterministic program-controlled addresses mit no corresponding private key."
                  },
                  {
                    "id": "l6-q2",
                    "prompt": "Who signs fuer a PDA in CPI flows?",
                    "options": [
                      "Any wallet holding SOL",
                      "The runtime on behalf of the program when invoke_signed seeds match",
                      "Only the fee payer of the outer transaktion"
                    ],
                    "answerIndex": 1,
                    "explanation": "invoke_signed proves seed derivation to runtime, which grants PDA signer semantics fuer that invocation."
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
            "title": "SPL Tokens grundlagen",
            "content": "# SPL Tokens grundlagen\n\nSPL Token is Solana’s standard token program family fuer fungible assets. A token mint konto defines token-level configuration: decimals, total supply accounting, und authorities such as mint authority or freeze authority. A mint does not store each user’s balance directly. Balances live in token konten.\n\nAssociated Token Konten (ATAs) are the default token-konto convention: one canonical token konto per (owner, mint) pair. This convention simplifies UX und interoperability because wallets und protocols can derive the expected konto location without extra indexing.\n\nA common anfaenger mistake is treating wallet addresses as token balance containers. Native SOL lives on system konten, but SPL token balances live on token konten owned by the token program. That means transfers move balances between token konten, not directly from wallet pubkey to wallet pubkey.\n\nAuthority design matters. Mint authority controls token issuance. Freeze authority can halt movement in specific designs. Removing or governance-wrapping authorities is a major trust signal in production deployments. If authority policies are unclear, integration risk rises quickly.\n\nThe token model also supports extension pathways. Token-2022 introduces optional features such as transfer fees und additional metadata/behavior controls. You do not need Token-2022 to understand fundamentals, but you should know it exists so you can avoid assuming every token mint behaves exactly like legacy SPL Token defaults.\n\nOperationally, safe token logic means: verify mint, verify owner program, verify ATA derivation where expected, und reason about authorities before trusting balances or transfer permissions.\n\nOnce you internalize mint vs token-konto separation und authority boundaries, most SPL token flows become predictable und debuggable.\n",
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
                      "A deterministic token konto fuer a specific owner + mint pair",
                      "A validator vote konto mit token metadata",
                      "A compressed NFT ledger entry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Associated Token Konten standardize where fungible token balances are stored fuer each owner/mint."
                  },
                  {
                    "id": "l7-q2",
                    "prompt": "Why is wallet address != token konto?",
                    "options": [
                      "Wallets can only hold SOL while token balances are separate program-owned konten",
                      "Token konten are deprecated und optional",
                      "Wallet addresses are private keys, token konten are public keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL balances are state in token konten, not direct fields on wallet system konten."
                  },
                  {
                    "id": "l7-q3",
                    "prompt": "What authority controls minting?",
                    "options": [
                      "Recent blockhash authority",
                      "Mint authority configured on the mint konto",
                      "Any konto mit enough lamports"
                    ],
                    "answerIndex": 1,
                    "explanation": "Mint authority is the explicit permission holder fuer issuing additional supply."
                  }
                ]
              }
            ]
          },
          "wallet-manager-cli-sim": {
            "title": "Wallet Manager CLI-sim",
            "content": "# Wallet Manager CLI-sim\n\nImplement a deterministic CLI parser + command executor in:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n\nRequired behavior:\n\n- `address` prints the active pubkey\n- `build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>` prints stable JSON:\n  `{ from, to, lamports, feePayer, recentBlockhash, instructionProgramId }`\n\nNo network calls. Keep key order stable in output JSON. Repository tests validate this lektion's deterministic behavior.\n",
            "duration": "35 min",
            "hints": [
              "Parse flags in pairs: --key value.",
              "Use deterministic SOL-to-lamports conversion mit 1_000_000_000 multiplier.",
              "Construct JSON object in fixed key order before JSON.stringify."
            ]
          }
        }
      }
    }
  },
  "anchor-development": {
    "title": "Anchor Development",
    "description": "Project-journey kurs fuer developers moving from grundlagen to real Anchor engineering: deterministic kontenmodelling, anweisung builders, tests discipline, und reliable client UX.",
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
        "title": "Anchor Grundlagen",
        "description": "Anchor architecture, konto constraints, und PDA foundations mit explicit ownership of sicherheit-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor mentales modell",
            "content": "# Anchor mentales modell\n\nAnchor is best understood as a contract between three layers that must agree on shape: your Rust handlers, generated interface metadata (IDL), und client-side anweisung builders. In raw Solana programs you manually decode bytes, manually validate konten, und manually return compact error numbers. Anchor keeps the same runtime model but moves repetitive work into declarations. You still define sicherheit-critical behavior, yet you do it through explicit konto structs, constraints, und typed anweisung arguments.\n\nThe `#[program]` modul is where anweisung handlers live. Each function gets a typed `Context<T>` plus explicit arguments. The corresponding `#[derive(Accounts)]` struct tells Anchor exactly what konten must be provided und what checks happen before handler logic executes. This includes signer requirements, mutability, PDA seed verification, ownership checks, und relational checks like `has_one`. If validation fails, the transaktion aborts before touching your business logic.\n\nIDL is the bridge that makes the developer experience consistent across Rust und TypeScript. It describes anweisung names, args, konten, events, und custom errors. Clients can generate typed methods from that shape, reducing drift between frontend code und on-chain interfaces. When teams ship fast, drift is a common failure mode: wrong konto ordering, stale discriminators, or stale arg names. IDL-driven clients make those mistakes less likely.\n\nProvider und wallet concepts complete the flow. The provider wraps an RPC connection plus signer abstraction und commitment preferences. It does not replace wallet sicherheit, but it centralizes transaktion send/confirm behavior und test setup. In practice, production reliability comes from understanding this boundary: Anchor helps mit ergonomics und consistency, but you still own protocol invariants, konto design, und threat modeling.\n\nFuer this kurs, treat Anchor as a typed anweisung framework on top of Solana’s explicit konto runtime. That framing lets you reason clearly about what is generated, what remains your responsibility, und how to test deterministic pieces without needing devnet in CI.\n\n## What Anchor gives you vs what it does not\n\nAnchor gives you: typed konto contexts, standardized serialization, structured errors, und IDL-driven client ergonomics. Anchor does not give you: automatic business safety, correct authority design, or threat modeling. Those are still protocol engineering decisions.\n\n## By the end of this lektion\n\n- You can explain the Rust handler -> IDL -> client flow without hand-waving.\n- You can identify which checks belong in konto constraints versus handler logic.\n- You can debug IDL drift issues (wrong konto order, stale args, stale client bindings).\n",
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
                      "IDL metadata, konto validation glue, und client-facing interface structure",
                      "Validator hardware configuration und consensus votes",
                      "Automatic PDA funding from devnet faucets"
                    ],
                    "answerIndex": 0,
                    "explanation": "Anchor generates serialization/validation scaffolding und IDL contracts, not validator-level behavior."
                  },
                  {
                    "id": "anchor-l1-q2",
                    "prompt": "What is an IDL und who uses it?",
                    "options": [
                      "A JSON interface used by clients/tests/tooling to call your program correctly",
                      "A private key format used only by on-chain programs",
                      "A token mint extension required fuer CPI"
                    ],
                    "answerIndex": 0,
                    "explanation": "IDL is interface metadata consumed by clients und tools to reduce anweisung/konto drift."
                  }
                ]
              }
            ]
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Konten, constraints, und safety",
            "content": "# Konten, constraints, und safety\n\nMost serious Solana vulnerabilities come from konto validation mistakes, not from arithmetic. Anchor’s constraint system exists to turn those checks into declarative, auditable rules. You declare intent in the konto context, und the framework enforces it before anweisung logic runs. This means your handlers can focus on state transitions while constraints guard the perimeter.\n\nStart mit core markers: `Signer<'info>` proves signature authority, und `#[account(mut)]` declares state can change. Forgetting `mut` produces runtime failures because Solana locks konto writability up front. This is not cosmetic metadata; it is part of execution scheduling und safety. Then ownership checks ensure an konto belongs to the expected program. If a malicious user passes an konto that has the same bytes but wrong owner, strong ownership constraints stop konto substitution attacks.\n\nPDA constraints mit `seeds` und `bump` verify deterministic konto identity. Instead of trusting a user-provided address, you define the derivation recipe und compare runtime inputs against it. This pattern prevents attackers from redirecting logic to arbitrary writable konten. `has_one` links konto relationships, such as enforcing `counter.authority == authority.key()`. That relation check is simple but high leverage: it prevents privileged actions from being executed by unrelated signers.\n\nAnchor also supports custom `constraint = ...` expressions fuer protocol invariants, like minimum collateral or authority domain rules. Use these sparingly but deliberately: put invariant checks near konto definitions when they are structural, und keep business flow checks in handlers when they depend on anweisung arguments or prior state.\n\nA praktisch review checklist: verify every mutable konto has an explicit reason to be mutable; verify every signer is necessary; verify every PDA seed recipe is stable und versioned; verify ownership checks are present where parsing assumes specific layout; verify relational constraints (`has_one`) fuer privileged paths. Sicherheit here is explicitness. Constraints do not remove responsibility, but they make responsibility visible und testable.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l2-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l2-q1",
                    "prompt": "What does `#[konto(mut)]` signal to the runtime und framework?",
                    "options": [
                      "The konto may be written during execution und must be requested writable",
                      "The konto is owned by the system program",
                      "The konto is always a signer"
                    ],
                    "answerIndex": 0,
                    "explanation": "Mutability is part of konto metadata und lock planning, not a cosmetic annotation."
                  },
                  {
                    "id": "anchor-l2-q2",
                    "prompt": "What is a seeds constraint verifying?",
                    "options": [
                      "That the provided konto key matches deterministic PDA derivation rules",
                      "That the konto has maximum rent",
                      "That a token mint has 9 decimals"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seeds + bump ensure deterministic konto identity und block konto-substitution vectors."
                  }
                ]
              }
            ]
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
            "content": "# PDAs in Anchor\n\nProgrammabgeleitete Adressen are the backbone of predictable konto topology in Anchor applications. A PDA is derived from seed bytes plus program ID und intentionally lives off the ed25519 curve, so no private key exists fuer it. This lets your program control authority fuer deterministic addresses through `invoke_signed` semantics while keeping user keypairs out of the trust path.\n\nIn Anchor, PDA derivation logic appears in konto constraints. Typical patterns look like `seeds = [b\"counter\", authority.key().as_ref()], bump`. This expresses three things at once: namespace (`counter`), ownership relation (authority), und uniqueness under your program ID. The `bump` value is the extra byte required to land off-curve. You can compute it on demand mit Anchor, or store it in konto state fuer future CPI convenience.\n\nShould you store bump or always re-derive? Re-deriving keeps state smaller und avoids stale bump fields if derivation recipes ever evolve. Storing bump can simplify downstream anweisung construction und reduce repeated derivation cost. In practice, many production programs store bump when they expect frequent PDA signing calls und keep the seed recipe immutable. Whichever path you choose, document it und test it.\n\nSeed schema discipline matters. If you silently change seed ordering, text encoding, or domain tags, you derive different addresses und break konto continuity. Teams usually treat seeds as protocol versioned API: include explicit namespace tags, stable byte encoding rules, und migration plans when evolution is unavoidable.\n\nFuer this project journey, we will derive a counter PDA from authority + static domain seed und use that address in both init und increment anweisung builders. The goal is to make konto identity deterministic, inspectable, und testable without network dependencies. You can then layer real transaktion sending later, confident that konto und data layouts are already correct.\n",
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
                      "It is signed directly by validatoren"
                    ],
                    "answerIndex": 0,
                    "explanation": "Off-curve means no user-held private key exists; programs authorize via seed proofs."
                  },
                  {
                    "id": "anchor-l3-q2",
                    "prompt": "What breaks if you change one PDA seed value?",
                    "options": [
                      "You derive a different address und can orphan existing state",
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
            "content": "# Initialize Counter PDA (deterministic)\n\nImplement deterministic helper functions fuer a Counter project:\n\n- `deriveCounterPda(programId, authorityPubkey)`\n- `buildInitCounterIx(params)`\n\nThis lektion validates client-side reasoning without RPC calls. Your output must include stable PDA + bump shape, key signer/writable metadata, und deterministic init anweisung bytes.\n\nNotes:\n- Keep konto key ordering stable.\n- Use the fixed init discriminator bytes from the lektion hints.\n- Return deterministic JSON in `run(input)` so tests can compare exact output.\n",
            "duration": "35 min",
            "hints": [
              "Use a deterministic hash-like reducer over programId + authorityPubkey + static seed.",
              "The init anweisung must include four keys in fixed order: counter PDA, authority, payer, system program.",
              "Encode anweisung data as [73,78,73,84,95,67,84,82,bump] so tests can compare exactly."
            ]
          }
        }
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, Konten, und Tests",
        "description": "Deterministic anweisung builders, stable state emulation, und tests strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment anweisung builder + state layout",
            "content": "# Increment anweisung builder + state layout\n\nImplement deterministic increment behavior in pure TypeScript:\n\n- Build a reusable state representation fuer counter data.\n- Implement `applyIncrement` as a pure transition function.\n- Enforce explicit overflow behavior (`Counter overflow` error).\n\nThis challenge focuses on deterministic correctness of state transitions, not network execution.\n",
            "duration": "35 min",
            "hints": [
              "Represent state as a pure JS structure so increment can be deterministic in tests.",
              "Return a new state object from applyIncrement; avoid mutating the input object in-place.",
              "Fuer this challenge, overflow should throw \"Counter overflow\" when count is 4294967295."
            ]
          },
          "anchor-testing-without-flakiness": {
            "title": "Tests strategy without flakiness",
            "content": "# Tests strategy without flakiness\n\nA reliable Solana curriculum should teach deterministic engineering first, then optional network integration. Flaky tests are usually caused by external dependencies: RPC latency, faucet limits, cluster state drift, blockhash expiry, und wallet setup mismatch. These are real operational concerns, but they should not block learning core protocol logic.\n\nFuer Anchor projects, split tests into layers. Unit tests validate data layout, discriminator bytes, PDA derivation, konto key ordering, und anweisung payload encoding. These tests are fast und deterministic. They can run in CI without validator or internet. If they fail, the error usually points to a real bug in serialization or konto metadata.\n\nIntegration tests add runtime behavior: transaktion simulation, konto creation, CPI paths, und event assertions. These are valuable but more fragile. Keep them focused und avoid making every PR depend on remote cluster health. Use local validator or controlled environment when possible, und treat external devnet tests as optional confidence checks rather than gatekeeping checks.\n\nWhen writing deterministic tests, prefer explicit expected values und fixed key ordering. Fuer example, assert exact JSON output mit stable key order fuer summaries, assert exact byte arrays fuer anweisung discriminators, und assert exact signer/writable flags in konto metas. These checks catch regressions that broad snapshot tests can miss.\n\nAlso test failure paths intentionally: overflow behavior, invalid pubkeys, wrong argument shapes, und stale konto discriminators. Production incidents often happen on edge paths that had no tests.\n\nA praktisch rule: unit tests should prove your client und serialization logic are correct independent of chain conditions. Integration tests should prove network workflows behave when environment is healthy. Keeping this boundary clear gives you both speed und confidence.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l6-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l6-q1",
                    "prompt": "What belongs in deterministic unit tests fuer Anchor clients?",
                    "options": [
                      "PDA derivation, anweisung bytes, und konto key metadata",
                      "Devnet faucet reliability und slot timings",
                      "Validator gossip propagation speed"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic unit tests should validate pure logic und serialization boundaries."
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
            "content": "# Client composition & UX\n\nOnce anweisung layouts und PDA logic are deterministic, client integration becomes a composition exercise: wallet adapter fuer signing, provider/connection fuer transport, transaktion builder fuer anweisung packing, und UI state fuer pending/success/error handling. Anchor helps by keeping konto schemas und anweisung names aligned via IDL, but robust UX still depends on clear boundaries.\n\nA typical flow is: derive addresses, build anweisung, create transaktion, set fee payer und recent blockhash, request wallet signature, send raw transaktion, then confirm mit chosen commitment. Each stage can fail fuer different reasons. If your UI collapses all failures into one generic message, users cannot recover und developers cannot debug quickly.\n\nSimulation failures usually mean konto metadata mismatch, invalid anweisung data, missing signer, wrong owner program, or constraint violations. Signature errors indicate wallet/user path issues. Blockhash errors are freshness issues. Insufficient funds often involve fee payer SOL balance, not just business konto balances. Mapping these classes to actionable errors improves trust und reduces support load.\n\nFee payer deserves explicit UX. The user may authorize a transaktion but still fail because payer lacks lamports fuer fees or rent. Surfacing fee payer und estimated cost before signing avoids confusion. Fuer multi-party flows, make fee policy explicit.\n\nFuer this kurs project, we keep deterministic logic in pure helpers und treat network send/confirm as optional outer layer. That architecture gives you stable local tests while still enabling production integration later. If a network call fails, you can quickly isolate whether the bug is in deterministic anweisung construction or in runtime environment state.\n\nIn short: robust Anchor UX is not one API call. It is a staged pipeline mit clear error taxonomy, explicit payer semantics, und deterministic inner logic that can be tested without chain access.\n",
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
                      "Because konto constraints, owners, und anweisung bytes can be invalid",
                      "Because the wallet signature always expires immediately",
                      "Because fee payer is irrelevant"
                    ],
                    "answerIndex": 0,
                    "explanation": "Simulation catches konto und anweisung-level issues before final network commitment."
                  },
                  {
                    "id": "anchor-l7-q2",
                    "prompt": "What does fee payer mean in client transaktion UX?",
                    "options": [
                      "The konto funding transaktion fees/rent-sensitive operations",
                      "The konto that stores all token balances directly",
                      "The konto that sets RPC endpoint"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee payer funds execution costs und must have sufficient SOL."
                  }
                ]
              }
            ]
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
            "content": "# Counter project checkpoint\n\nCompose the full deterministic flow:\n\n1. Derive counter PDA from authority + program ID.\n2. Build init anweisung metadata.\n3. Build increment anweisung metadata.\n4. Emulate state transitions: `init -> increment -> increment`.\n5. Return stable JSON summary in exact key order:\n\n`{ authority, pda, initIxProgramId, initKeys, incrementKeys, finalCount }`\n\nNo network calls. All checks are strict string matches.\n",
            "duration": "45 min",
            "hints": [
              "Compose the checkpoint from deterministic helper functions to keep output stable.",
              "Use fixed key order und fixed JSON key order to satisfy strict expected output matching.",
              "The emulator sequence fuer this checkpoint is init -> increment -> increment, so finalCount should be 2."
            ]
          }
        }
      }
    }
  },
  "solana-frontend": {
    "title": "Solana Frontend Development",
    "description": "Project-journey kurs fuer frontend engineers who want production-ready Solana dashboards: deterministic reducers, replayable event pipelines, und trustworthy transaktion UX.",
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
        "title": "Frontend Fundamentals fuer Solana",
        "description": "Model wallet/konto state correctly, design transaktion lifecycle UX, und enforce deterministic correctness rules fuer replayable debugging.",
        "lessons": {
          "frontend-v2-wallet-state-accounts-model": {
            "title": "Wallet state + konten mentales modell fuer UI devs",
            "content": "# Wallet state + konten mentales modell fuer UI devs\n\nMost Solana frontend bugs are not visual bugs. They are model bugs. A dashboard can look polished while silently computing balances from the wrong konto class, mixing lamports mit token units, or treating temporary pending state as confirmed truth. The first production-grade skill is to build a strict mentales modell und enforce it in code. Wallet address, system konto balance, token konto balance, und position value are related but not interchangeable.\n\nA connected wallet gives your app identity und signature capability. It does not directly provide full portfolio state. Native SOL lives on the wallet system konto in lamports, while SPL balances live in token konten, often associated token konten (ATAs). If your state shape does not represent this distinction explicitly, downstream logic becomes fragile. Fuer example, transfer previews might show a wallet address as a token destination, but execution requires token konto addresses. Good frontends represent these as separate types und derive display labels from those types.\n\nPrecision is equally important. Lamports und token amounts should remain integer strings in your model layer. UI formatting can convert those values fuer display, but business logic should avoid float math to prevent drift und non-deterministic tests. This kurs uses deterministic fixtures und fixed-scale arithmetic because reproducibility is essential fuer debugging. If one engineer sees \\\"5.000001\\\" und another sees \\\"5.000000\\\" fuer the same payload, your incident response becomes noise.\n\nState ownership is another common failure point. Portfolio views often merge data from event streams, cached fetches, und optimistic transaktion journals. Without clear precedence rules, you can double-count transfers or overwrite fresh data mit stale cache entries. A robust model treats each input as an event und computes derived state through deterministic reducers. That approach gives you replayability: when a bug appears, you can replay the exact event sequence und inspect every transition.\n\nA production dashboard also needs explicit error classes fuer parsing und modeling. Invalid mint metadata, malformed amount strings, or missing ATA links should produce typed failures, not silent fallback behavior. Silent fallbacks feel user-friendly in the short term, but they hide corruption that later appears as impossible balances or broken transfers.\n\nFinally, wallet state should include confidence metadata. Is this balance from confirmed events? From optimistic local prediction? From replay snapshot N? Confidence-aware UX prevents overclaiming und helps users understand why values may shift.\n\n## Praktisch mentales modell map\n\nKeep four layers explicit:\n1. Identity layer (wallet, signer, session metadata).\n2. State layer (system konten, token konten, mint metadata).\n3. Event layer (journal entries, corrections, dedupe keys, confidence).\n4. View layer (formatted balances, sorted rows, UX status labels).\n\nWhen these layers blur together, bugs look random. When they stay separate, you can isolate failures quickly.\n\n## Pitfall: treating wallet pubkey as the universal balance location\n\nWallet pubkey identifies a user, but SPL balances live in token konten. If you collapse the two, transfer builders, explorers, und reconciliation logic diverge.\n\n## Production Checklist\n\n1. Keep lamports und token amounts as integer strings in core model.\n2. Represent wallet address, ATA address, und mint address as separate fields.\n3. Derive UI values from deterministic reducers, not ad-hoc component state.\n4. Attach confidence metadata to displayed balances.\n5. Emit typed parser/model errors instead of silent defaults.\n",
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
                      "In token konten (typically ATAs), not directly in the wallet system konto",
                      "In the wallet system konto lamports field",
                      "Inside the transaktion signature"
                    ],
                    "answerIndex": 0,
                    "explanation": "Wallet identity und token balance storage are different model layers in Solana."
                  },
                  {
                    "id": "frontend-v2-l1-q2",
                    "prompt": "Why keep raw amounts as integer strings in model code?",
                    "options": [
                      "To avoid non-deterministic floating-point drift in reducers und tests",
                      "Because wallets only accept strings",
                      "Because decimals are always 9"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic arithmetic und replay debugging depend on precise integer state."
                  }
                ]
              }
            ]
          },
          "frontend-v2-transaction-lifecycle-ui": {
            "title": "Transaktion lifecycle fuer UI: pending/confirmed/finalized, optimistic UI",
            "content": "# Transaktion lifecycle fuer UI: pending/confirmed/finalized, optimistic UI\n\nFrontend transaktion UX is a state machine problem. Users press one button, but your app traverses multiple phases: intent creation, transaktion construction, signature request, submission, und confirmation at one or more commitment levels. If these phases are collapsed into one boolean \\\"loading\\\" flag, you lose correctness und your recovery paths become guesswork.\n\nThe lifecycle starts mit deterministic planning. Before any wallet popup, construct a serializable transaktion intent: konten, amounts, expected side effects, und idempotency key. This intent should be inspectable und testable without network access. In production, this split pays off because many failures happen before send: invalid konto metas, stale assumptions about ATAs, wrong decimals, or malformed anweisung payloads. A deterministic planner catches these early und produces actionable errors.\n\nAfter signing, submission moves the transaktion into a pending state. Pending means the network may or may not accept execution. Your UI can use optimistic overlays, but optimistic updates should be scoped und reversible. Fuer example, show \\\"pending transfer\\\" in activity feed immediately, but avoid mutating durable balance totals until at least confirmed commitment. If you mutate balances too early, user trust drops when signature rejection or simulation failure occurs.\n\nCommitment levels should be modeled explicitly. \\\"processed\\\" provides quick feedback, \\\"confirmed\\\" provides stronger confidence, und \\\"finalized\\\" is strongest. You do not need to promise exact timing. You do need to communicate confidence boundaries clearly. A common production bug is labeling processed as final und then rendering inconsistent data during cluster stress.\n\nOptimistic rollback is often neglected. Every optimistic action needs a rollback rule keyed by idempotency token. If confirmation fails, rollback should remove optimistic journal entries und restore derived state by replaying deterministic events. This is why event-driven state models are praktisch fuer frontend apps: they make rollback a replay operation instead of imperative patchwork.\n\nTelemetry should also be phase-specific. Log whether failures happen in build, sign, send, or confirm. Group by wallet type, program ID, und error class. This lets teams distinguish infrastructure incidents from modeling bugs.\n\n## Pitfall: over-writing confirmed state mit stale optimistic assumptions\n\nOptimistic state should be additive und reversible. If optimistic patches directly replace canonical state, delayed confirmations or failures create confusing balance jumps.\n\n## Production Checklist\n\n1. Model transaktion lifecycle as explicit states, not one loading flag.\n2. Keep deterministic planner output separate from wallet/RPC adapter layer.\n3. Track optimistic entries mit idempotency keys und rollback rules.\n4. Label commitment confidence in UI copy.\n5. Emit phase-specific telemetry fuer build/sign/send/confirm.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "frontend-v2-l2-account-explorer",
                "title": "Lifecycle Konten Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Fee Payer System Konto",
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
                    "prompt": "What is the safest use of optimistic UI fuer token transfers?",
                    "options": [
                      "Show pending overlays first, mutate durable balances only after stronger confirmation",
                      "Immediately mutate all balances und ignore rollback",
                      "Disable activity feed until finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Optimistic overlays are useful, but confirmed state must remain authoritative."
                  },
                  {
                    "id": "frontend-v2-l2-q2",
                    "prompt": "Why track transaktion phases separately in telemetry?",
                    "options": [
                      "To isolate modeling failures from wallet und network failures",
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
            "content": "# Data correctness: dedupe, ordering, idempotency, correction events\n\nFrontend teams frequently assume event streams are perfectly ordered und unique. Production systems rarely behave that way. You can receive duplicate events, out-of-order events, delayed price updates, und correction signals that invalidate earlier records. If your reducer assumes ideal sequencing, dashboard totals drift und support incidents become hard to reproduce.\n\nDeterministic ordering is the first control. In this kurs we replay events by (ts, id). Timestamp alone is insufficient because equal timestamps are common in batched systems. A deterministic tie-breaker gives every engineer und CI runner the same final state.\n\nIdempotency is the second control. Each event id should be applied at most once. If the same id appears twice, state must not change after the first apply. This rule protects against retries, websocket reconnect bursts, und duplicate queue deliveries.\n\nCorrection handling is the third control. A correction event references an earlier event id und signals that its effect should be removed. You can implement this by replaying from journal mit corrected ids excluded, or by inverse operations when your model supports exact inverses. Replay is slower but simpler und safer fuer educational deterministic engines.\n\nHistory modeling deserves attention too. Users need recent activity, but history should not become an unstructured debug dump. Each history row should include event id, timestamp, type, und concise summary. If corrected events remain visible, label them explicitly so users und support staff understand why balances changed.\n\nAnother correctness risk is cross-domain ordering. Token events und price events may arrive at different rates. Value calculations should depend on the latest known price per mint und should never use transient float conversions. Fixed-scale integer math avoids rounding divergence across environments.\n\nWhen reducers are deterministic und replayable, regression tests improves dramatically. You can compare snapshots after every N events, compute checksums, und verify that refactors preserve behavior. This style catches subtle bugs earlier than end-to-end tests.\n\nFinally, correctness is not only code. It is product communication. If corrections can alter history, UI should surface that possibility in copy und state labels. Hiding it creates the appearance of randomness.\n\n## Pitfall: applying out-of-order events directly to live state without replay\n\nApplying arrivals as-is can produce transiently wrong balances und non-reproducible bugs. Deterministic replay gives consistent outcomes und auditable transitions.\n\n## Production Checklist\n\n1. Sort replay by deterministic keys (ts, id).\n2. Deduplicate by event id before applying transitions.\n3. Support correction events that remove prior effects.\n4. Keep history rows explicit und correction-aware.\n5. Use fixed-scale arithmetic fuer value calculations.\n",
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
                      "It provides deterministic tie-breaking fuer equal timestamps",
                      "It removes the need fuer deduplication",
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
                      "Apply both und average balances",
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
            "content": "# Build core state model + reducer from events\n\nImplement a deterministic reducer fuer dashboard state:\n- apply event stream transitions fuer balances und mint metadata\n- enforce idempotency by event id\n- support correction markers fuer replaced events\n- emit stable history summaries\n",
            "duration": "35 min",
            "hints": [
              "Sort by (ts, id) before applying events.",
              "If event id already exists in eventsApplied, skip it fuer idempotency.",
              "Corrections should mark replaced event ids und remove their effects from state transitions."
            ]
          }
        }
      },
      "frontend-v2-module-token-dashboard": {
        "title": "Token Dashboard Project",
        "description": "Build reducer, replay snapshots, query metrics, und deterministic dashboard outputs that remain stable under partial or delayed data.",
        "lessons": {
          "frontend-v2-stream-replay-snapshots": {
            "title": "Implement event stream simulator + replay timeline + snapshots",
            "content": "# Implement event stream simulator + replay timeline + snapshots\n\nBuild deterministic replay tooling:\n- replay sorted events by (ts, id)\n- snapshot every N applied events\n- compute stable checksum fuer replay output\n- return { finalState, snapshots, checksum }\n",
            "duration": "35 min",
            "hints": [
              "Determinism starts mit sorting by ts then id.",
              "Deduplicate by event id before snapshot interval checks.",
              "Build checksum from stable snapshot metadata, not random values."
            ]
          },
          "frontend-v2-query-layer-metrics": {
            "title": "Implement query layer + computed metrics",
            "content": "# Implement query layer + computed metrics\n\nImplement dashboard query/view logic:\n- search/filter/sort rows deterministically\n- compute total und row valueUsd mit fixed-scale integer math\n- expose stable view model fuer UI rendering\n",
            "duration": "35 min",
            "hints": [
              "Use fixed-scale integers (micro USD) instead of floating point.",
              "Apply filter -> search -> sort in a deterministic order.",
              "Break sort ties by mint fuer stable output."
            ]
          },
          "frontend-v2-production-ux-hardening": {
            "title": "Production UX: caching, pagination, error banners, skeletons, rate limits",
            "content": "# Production UX: caching, pagination, error banners, skeletons, rate limits\n\nAfter model correctness, frontend quality is mostly about user trust under imperfect conditions. Users do not evaluate your dashboard by clean demo paths. They evaluate it when data is delayed, partial, duplicated, or rejected. Production UX hardening means making those states understandable und recoverable.\n\nCaching strategy should be explicit. Event snapshots, derived views, und summary cards should have clear freshness rules. A stale-but-marked cache is often better than blank loading screens, but stale data must never masquerade as confirmed current data. Include freshness timestamps und, when possible, source confidence labels (cached, replayed, confirmed).\n\nPagination und virtualized lists need deterministic sorting to avoid row jumps between pages. If sort keys are unstable, users see items move unexpectedly as new events arrive. Use primary und secondary stable keys, und preserve cursor semantics during live updates.\n\nError banners should be scoped by subsystem. Parser errors are not network errors. Replay checksum mismatches are not wallet signature errors. Distinct error classes reduce panic und help users choose next actions. A generic red toast that says \\\"something went wrong\\\" is operationally expensive.\n\nSkeleton states must communicate structure rather than fake certainty. Show placeholder rows und chart bounds, but avoid hardcoding values that look real. If users screen-record issues, misleading skeletons complicate incident investigation.\n\nRate limits are common in real dashboards, even mit private APIs. Your UI should surface backoff state und avoid firehose re-requests from multiple components. Centralize data fetching und de-duplicate in-flight requests by key. This prevents self-inflicted throttling.\n\nLive mode und replay mode should share the same reducer und query pipeline. Live mode streams events progressively; replay mode applies fixture timelines deterministically. If these modes use different code paths, bugs hide in mode-specific branches und become hard to reproduce.\n\nA praktisch approach is to store event journal und snapshots, then render all UI from derived selectors. This architecture supports recoverability: you can reset to snapshot N, replay events, und inspect differences. It also supports support tooling: attach snapshot checksum und model version to error reports.\n\n### Devnet Bonus (optional)\n\nYou can add an RPC adapter behind a feature flag und map live konto updates into the same event format. Keep this optional und never required fuer core correctness.\n\n## Pitfall: shipping polished visuals mit unscoped failure states\n\nIf users cannot tell whether an issue is stale cache, parse failure, or upstream throttle, confidence erodes even when core model logic is correct.\n\n## Production Checklist\n\n1. Expose freshness metadata fuer cached und live data.\n2. Keep list sorting deterministic across pagination.\n3. Classify errors by subsystem mit actionable copy.\n4. De-duplicate in-flight fetches und respect rate limits.\n5. Render live und replay modes through shared reducer/selectors.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l7-q1",
                    "prompt": "Why should live mode und replay mode share the same reducer pipeline?",
                    "options": [
                      "To keep behavior reproducible und avoid mode-specific correctness drift",
                      "To reduce CSS size only",
                      "Because rate limits require it"
                    ],
                    "answerIndex": 0,
                    "explanation": "Shared deterministic logic makes incident replay und tests reliable."
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
                    "explanation": "Phase- und subsystem-specific failures require different user guidance."
                  }
                ]
              }
            ]
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            "title": "Emit stable DashboardSummary from fixtures",
            "content": "# Emit stable DashboardSummary from fixtures\n\nCompose deterministic checkpoint output:\n- owner, token count, totalValueUsd\n- top tokens sorted deterministically\n- recent activity rows\n- invariants und determinism metadata (fixture hash + model version)\n",
            "duration": "45 min",
            "hints": [
              "Emit JSON keys in a fixed order fuer stable snapshots.",
              "Sort top tokens deterministically mit tie breakers.",
              "Include modelVersion und fixtureHash in determinism metadata."
            ]
          }
        }
      }
    }
  },
  "defi-solana": {
    "title": "DeFi on Solana",
    "description": "Fortgeschritten project-journey kurs fuer engineers building swap systems: deterministic offline Jupiter-style planning, route ranking, minOut safety, und reproducible diagnostics.",
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
        "description": "Understand CPMM math, quote anatomy, und deterministic routing tradeoffs mit safety-first user protections.",
        "lessons": {
          "defi-v2-amm-basics-fees-slippage-impact": {
            "title": "AMM grundlagen on Solana: pools, fees, slippage, und preiseinfluss",
            "content": "# AMM grundlagen on Solana: pools, fees, slippage, und preiseinfluss\n\nWhen users click “Swap,” they usually assume there is one objective truth: the current price. In practice, frontend swap systems compute an estimate from pool reserves und route assumptions. The estimate can be excellent, but it is still a model. DeFi UI quality depends on how honestly und consistently that model is represented.\n\nIn a constant-product AMM, each pool maintains an invariant close to x * y = k. A swap changes reserves asymmetrically, und the output amount is non-linear relative to input size. Small trades can track spot estimates closely, while larger trades move further along the curve und experience more impact. That non-linearity is why frontend code must never compare routes using only “price per token” labels. You need route-aware output calculations at the target trade size.\n\nOn Solana, swaps also occur across varied pool designs und fee tiers. Some pools are deep und low fee; others are shallow but still attractive fuer small size due to path composition. Fee bps are often compared in isolation, but total execution quality comes from three interacting pieces: fee deduction, reserve depth, und route hop count. A route mit slightly higher fee can still produce higher net output if reserves are materially deeper.\n\nSlippage und preiseinfluss are often conflated in UI copy, but they answer different questions. Preiseinfluss asks: what movement does this trade itself induce against current reserves? Slippage tolerance asks: what worst-case output should still be accepted at execution time? One is descriptive of current route mechanics, the other is a user safety bound. Production interfaces should surface both values clearly und compute minOut deterministically from outAmount und slippage bps.\n\nDeterministic arithmetic matters as much as financial logic. If planners use floating-point shortcuts, two environments can produce subtly different minOut values und route ranking. Those tiny differences create major operational pain in tests, incident response, und support reproductions. Integer arithmetic over u64-style amount strings should remain the primary model path; formatting fuer users should happen only at presentation boundaries.\n\nEven in an offline educational planner, safety invariants belong at the core. Outputs must never exceed reserveOut. Reserves must remain non-negative after virtual simulation. Missing pools should fail fast mit typed errors, not fallback behavior. These checks mirror production expectations und train the same engineering discipline needed fuer real integrations.\n\nA robust frontend mentales modell is therefore: token universe + pool universe + deterministic quote math + route ranking policy + user safety constraints. If any layer is implicit, the system will still run, but behavior under volatility becomes hard to explain. If all layers are explicit und typed, the same planner can power UI previews, tests, und diagnostics mit minimal drift.\n\n## Quick numeric intuition\n\nIf two routes have spot prices that look similar, a larger input can still produce materially different output because you travel further on each curve. That is why route comparison must happen at the exact user amount, not a tiny reference trade.\n\n## What you should internalize from this lektion\n\n- Execution quality is output-at-size, not headline spot price.\n- Slippage tolerance is a user protection bound, not a market forecast.\n- Deterministic integer math is a product feature, not only a technical preference.\n\n### Pitfalls\n\n1. Comparing routes by headline “price” instead of exact outAmount at the user’s size.\n2. Treating slippage tolerance as if it were the same metric as preiseinfluss.\n3. Using floating point in route ranking or minOut logic.\n\n### Production Checklist\n\n1. Keep amount math in integer-safe paths.\n2. Surface outAmount, fee impact, und minOut separately.\n3. Enforce invariant checks fuer each hop simulation.\n4. Keep route ranking deterministic mit explicit tie-breakers.\n5. Log enough context to reproduce route decisions.\n",
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
                    "explanation": "minOut is computed from quote outAmount und slippage bps."
                  }
                ]
              }
            ]
          },
          "defi-v2-quote-anatomy-and-risk": {
            "title": "Quote anatomy: in/out, fees, minOut, und worst-case execution",
            "content": "# Quote anatomy: in/out, fees, minOut, und worst-case execution\n\nA production quote is not one number. It is a structured object that must tell users what they send, what they likely receive, how much they pay in fees, und what minimum output protection applies. When frontend systems treat quote payloads as loose JSON blobs, users lose trust quickly because route changes und execution deviations look arbitrary.\n\nThe first mandatory fields are inAmount und outAmount in raw integer units. Without raw values, deterministic checks become fragile. UI formatting should be derived from token decimals, but core state should retain raw strings fuer exact comparisons und invariant logic. If an app compares rounded display numbers, route ties can break unpredictably.\n\nSecond, quote systems should expose fee breakdown per hop. Aggregate fee bps is useful, but it hides which pools drive cost. Fuer route explainability und debugging, users und engineers need pool-level fee contributions. This is particularly important fuer two-hop routes where one leg may be cheap und the other expensive.\n\nThird, minOut must be explicit, reproducible, und tied to user-configured slippage bps. The computation is deterministic: floor(outAmount * (10000 - slippageBps) / 10000). Showing this value is not optional fuer serious UX. It is the user’s principal safety guard against stale quotes und rapid market movement between quote und submission.\n\nFourth, quote freshness und worst-case framing should be visible. Even in offline training systems, the planner should model the idea that the route is valid fuer a moment, not forever. In production, stale quote handling und forced re-quote boundaries prevent accidental execution mit outdated assumptions.\n\nA useful engineering pattern is to model quote objects as immutable snapshots. Each snapshot includes selected route, per-hop details, total fees, impact estimate, und minOut. If selection changes, produce a new snapshot instead of mutating fields in place. This gives deterministic audit trails und cleaner state transitions.\n\nFuer this kurs, lektion logic remains offline und deterministic, but the same design prepares teams fuer real Jupiter integrations later. By the time network adapters are introduced, your model und tests already guarantee stable route math und explainability.\n\nQuote anatomy also influences support burden. When a user asks why they received less than expected, the answer is much faster if the system preserves route path, slippage setting, und minOut from the exact planning state. Without that, teams rely on post-hoc guesses.\n\n### Pitfalls\n\n1. Displaying outAmount without minOut und route-level fees.\n2. Mutating selected quote objects in place instead of creating snapshots.\n3. Computing fee percentages from rounded UI values instead of raw amounts.\n\n### Production Checklist\n\n1. Keep quote payloads immutable und versioned.\n2. Store per-hop fee contributions und total fee amount.\n3. Compute und show minOut from explicit slippage bps.\n4. Preserve raw amounts und decimals separately.\n5. Expose route freshness metadata in UI state.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "defi-v2-l2-explorer",
                "title": "Quote Konto Snapshot",
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
                      "Fuer explainability und debugging route-level cost",
                      "Only fuer CSS rendering",
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
            "content": "# Routing: why two-hop can beat one-hop\n\nUsers often assume direct pair routes are always best because they are simpler. In fragmented liquidity systems, that assumption fails frequently. A direct SOL -> JUP pool might have shallow depth, while SOL -> USDC und USDC -> JUP pools together can produce better net output despite two fees und two curve traversals. A production router should evaluate both one-hop und two-hop candidates und rank them deterministically.\n\nThe engineering challenge is not just finding paths. It is comparing paths under consistent assumptions. Every candidate should be quoted mit the same input amount, same deterministic arithmetic, und same fee/impact accounting. If one path uses rounded display math while another uses raw amounts, route ranking loses meaning.\n\nTwo-hop routing also requires stable tie-break policies. Suppose two candidates produce equal outAmount at integer precision. One has one hop; the other has two hops. A deterministic system should prefer fewer hops. If hop count also ties, lexicographic route ID ordering can resolve final rank. The exact policy can vary, but it must be explicit und stable.\n\nLiquidity fragmentation introduces another subtle point: mittelstufe mint risk. A two-hop path through a highly liquid stable pair can be excellent, but if the second pool is thin, the route can still degrade at larger sizes. This is why route scoring should be quote-size aware und not reused blindly across different trade amounts.\n\nFuer offline kurs logic, we model pools as a static universe und simulate reserves virtually per quote path. Even this simplified model teaches key production habits: avoid mutating source fixtures, isolate simulation state per candidate, und validate safety constraints at each hop.\n\nRouting quality is also a UX problem. If a selected route changes due to input edits or quote refresh, users should see why: outAmount delta, fee change, und path change. Silent route switching feels suspicious even when mathematically correct.\n\nIn larger systems, routers may consider split routes, gas/compute constraints, or venue reliability. This kurs intentionally limits scope to one-hop und two-hop deterministic candidates so core reasoning remains clear und testable.\n\nFrom an implementation perspective, route objects should be treated as typed artifacts mit stable IDs und explicit hop metadata. That discipline reduces accidental coupling between UI state und planner internals. When engineers can serialize a route candidate, replay it mit the same input, und get the same result, incident response becomes straightforward.\n\n### Pitfalls\n\n1. Assuming direct pairs always outperform multi-hop routes.\n2. Reusing quotes computed fuer one trade size at another size.\n3. Non-deterministic tie-breaking that causes route flicker.\n\n### Production Checklist\n\n1. Enumerate one-hop und two-hop routes systematically.\n2. Quote every candidate mit the same deterministic math path.\n3. Keep tie-break policy explicit und stable.\n4. Simulate virtual reserves without mutating source fixtures.\n5. Surface route-change reasons in UI.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l3-q1",
                    "prompt": "What is the primary ranking objective in this kurs router?",
                    "options": [
                      "Maximize outAmount",
                      "Minimize hop count always",
                      "Choose first enumerated route"
                    ],
                    "answerIndex": 0,
                    "explanation": "outAmount is primary; hops und route ID are tie-breakers."
                  },
                  {
                    "id": "defi-v2-l3-q2",
                    "prompt": "Why simulate virtual reserves per candidate route?",
                    "options": [
                      "To keep route quotes deterministic und independent",
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
        "description": "Build deterministic quoting, route selection, und minOut safety checks, then package stable checkpoint artifacts fuer reproducible reviews.",
        "lessons": {
          "defi-v2-quote-cpmm": {
            "title": "Implement token/pool model + constant-product quote calc",
            "content": "# Implement token/pool model + constant-product quote calc\n\nImplement deterministic CPMM quoting:\n- out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee)\n- fee = floor(inAmount * feeBps / 10000)\n- impactBps from spot vs effective execution price\n- return outAmount, feeAmount, inAfterFee, impactBps\n",
            "duration": "35 min",
            "hints": [
              "Use inAfterFee = inAmount - floor(inAmount * feeBps / 10000).",
              "Use constant-product output formula mit integer floor division.",
              "Estimate impact by comparing spot price und effective execution price in fixed scale."
            ]
          },
          "defi-v2-router-best": {
            "title": "Implement route enumeration und best-route selection",
            "content": "# Implement route enumeration und best-route selection\n\nImplement deterministic route planner:\n- enumerate one-hop und two-hop candidates\n- quote each candidate at exact input size\n- select best route using stable tie-breakers\n",
            "duration": "35 min",
            "hints": [
              "Enumerate 1-hop direct pools first, then 2-hop through mittelstufe tokens.",
              "Score bestOut by output, then tie-break by hops und route id.",
              "Keep sorting deterministic to avoid route flicker."
            ]
          },
          "defi-v2-safety-minout": {
            "title": "Implement slippage/minOut, fee breakdown, und safety invariants",
            "content": "# Implement slippage/minOut, fee breakdown, und safety invariants\n\nImplement deterministic safety layer:\n- apply slippage to compute minOut\n- simulate route mit virtual reserve updates\n- return structured errors fuer invalid pools/routes\n- enforce non-negative reserve und bounded output invariants\n",
            "duration": "35 min",
            "hints": [
              "Use virtual pool copies so fixture reserves are not mutated.",
              "Compute minOut mit floor(out * (10000 - slippageBps) / 10000).",
              "Return structured errors when pools or route links are invalid."
            ]
          },
          "defi-v2-production-swap-ux": {
            "title": "Production swap UX: stale quotes, protection, und simulation",
            "content": "# Production swap UX: stale quotes, protection, und simulation\n\nA deterministic route engine is necessary but not sufficient fuer production. Users experience DeFi through timing, messaging, und safety affordances. A mathematically correct planner can still feel broken if stale quote handling, retry behavior, und error communication are weak.\n\nStale quotes are the most common operational issue. In volatile markets, quote quality decays quickly. Interfaces should track quote age und invalidate plans beyond a strict threshold. When invalidation happens, route und minOut should be recomputed before submit. Reusing stale plans to “speed up” UX usually creates worse outcomes und support burden.\n\nUser protection should be layered. Slippage bounds protect against adverse movement, but they do not protect against malformed route payloads or mismatched konto assumptions. Safety validation should run before any wallet prompt und should return explicit, typed errors. “Something went wrong” is not enough in swap flows.\n\nSimulation messaging matters as much as simulation itself. If route simulation fails pre-send, users need actionable context: which hop failed, whether pool liquidity was insufficient, whether the route is missing required pools, und whether re-quoting could help. Generic error banners create user churn.\n\nRetry logic must be bounded und stateful. Blind retries mit unchanged input are often just repeated failures. Good UX distinguishes retryable states (temporary network issue) from deterministic planner errors (invalid route topology). Fuer deterministic planner errors, force state change before retry.\n\nAnother production concern is observability. Record route ID, inAmount, outAmount, minOut, fee totals, und invariant results fuer each attempt. These logs make incident triage und postmortems dramatically faster. Without structured traces, teams often blame “market conditions” fuer planner bugs.\n\nPagination und list updates also affect trust. Swap history UIs should preserve deterministic ordering und avoid jitter when data refreshes. If past swaps reorder unpredictably, users perceive reliability issues even when transaktionen are correct.\n\nOptional live integrations should be feature-flagged und isolated. The offline deterministic engine should remain the source of truth, while live adapters map external responses into the same internal types. That boundary keeps tests stable und protects core behavior from third-party schema changes.\n\nFinally, production swap UX should make deterministic planner outcomes explainable to non-expert users. If a route is rejected, the interface should provide a concrete reason und a clear next action such as reducing size or selecting a different output token. Clear messaging converts system correctness into user trust.\n\n### Pitfalls\n\n1. Allowing stale quotes to remain actionable without forced re-quote.\n2. Retrying deterministic planner errors without changing route or inputs.\n3. Hiding failure reason details behind generic notifications.\n\n### Production Checklist\n\n1. Track quote freshness und invalidate aggressively.\n2. Enforce pre-submit invariant validation.\n3. Separate retryable network failures from deterministic planner failures.\n4. Log route und safety metadata fuer every attempt.\n5. Keep offline engine as canonical model fuer optional live adapters.\n",
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
                      "Re-quote und recompute route/minOut before submit",
                      "Submit mit stale plan",
                      "Increase slippage automatically without notifying user"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freshness boundaries should trigger deterministic recomputation."
                  },
                  {
                    "id": "defi-v2-l7-q2",
                    "prompt": "Which failures are not solved by blind retries?",
                    "options": [
                      "Deterministic planner und invariant failures",
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
            "content": "# Produce stable SwapPlan + SwapSummary checkpoint\n\nCompose deterministic checkpoint artifacts:\n- build swap plan from selected route quote\n- include fixtureHash und modelVersion\n- emit stable summary mit path, minOut, fee totals, impact, und invariants\n",
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
    "title": "Solana Sicherheit & Auditing",
    "description": "Production-grade deterministic vuln lab fuer Solana auditors who need repeatable exploit evidence, precise remediation guidance, und high-signal audit artifacts.",
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
        "description": "Konto-centric threat modeling, deterministic exploit reproduction, und evidence discipline fuer credible audit findings.",
        "lessons": {
          "security-v2-threat-model": {
            "title": "Solana threat model fuer auditors: konten, owners, signers, writable, PDAs",
            "content": "# Solana threat model fuer auditors: konten, owners, signers, writable, PDAs\n\nSicherheit work on Solana starts mit one non-negotiable fact: anweisung callers choose the konto list. Programs do not receive trusted implicit context. They receive exactly the konto metas und anweisung data encoded in a transaktion message. This design is powerful fuer composability und leistung, but it means almost every critical exploit is an konto validation exploit in disguise. If you internalize this early, your audits become more mechanical und less guess-based.\n\nA good mentales modell is to treat each anweisung as a contract boundary mit five mandatory validations: identity, authority, ownership, mutability, und derivation. Identity asks whether the supplied konto is the konto the anweisung expects. Authority asks whether the actor that is allowed to mutate state actually signed. Ownership asks whether konto data should be interpreted under the current program or a different one. Mutability asks whether writable access is both requested und justified. Derivation asks whether PDA paths are deterministic und verified against canonical seeds plus bump. Missing any of those layers creates openings that attackers repeatedly use.\n\nSigner checks are not optional on privileged paths. If the anweisung changes authority, moves funds, or updates risk parameters, the authority konto must be a signer und must be the expected authority from state. One common bug is checking only that “some signer exists.” That is still broken. Audits should explicitly map each privileged transition to a concrete signer relationship und verify that relation is enforced before state mutation.\n\nOwner checks are equally critical. Programs often parse konto bytes into local structs. Without owner checks, an attacker can pass arbitrary bytes that deserialize into a shape that looks valid but is controlled by another program or by no program assumptions at all. This is konto substitution. It is the root cause of many catastrophic incidents und should be surfaced early in review notes.\n\nPDA checks are where many teams lose determinism. Seed recipes need to be explicit, stable, und versioned. If the runtime accepts user-provided bump values without recomputation, or if seed ordering differs between handlers, spoofed addresses can pass inconsistent checks. Auditors should insist on exact re-derivation und equality checks in all sensitive paths.\n\nWritable flags matter fuer two reasons: correctness und attack surface. Over-broad writable sets increase risk by allowing unnecessary state transitions in CPI-heavy flows. Under-declared mutability causes runtime failure, which is safer but still a reliability bug.\n\nFinally, threat modeling should include arithmetic constraints. Even if auth is correct, unchecked u64 math can corrupt balances through underflow or overflow und invalidate all higher-level assumptions.\n\n## Auditor workflow per anweisung\n\nFuer each handler, run the same sequence: identify privileged outcome, list required konten, verify signer/owner/PDA relationships, verify writable scope, then test malformed konto lists. Repeating this fixed loop prevents “I think it looks safe” audits.\n\n## What you should be able to do after this lektion\n\n- Turn a vague concern into a concrete validation checklist.\n- Explain why konto substitution und PDA spoofing recur in Solana incidents.\n- Build deterministic negative-path scenarios before writing remediation notes.\n\n## Checklist\n- Map each anweisung to a clear privilege model.\n- Verify authority konto is required signer fuer privileged actions.\n- Verify authority key equality against stored state authority.\n- Verify every parsed konto has explicit owner validation.\n- Verify each PDA is re-derived from canonical seeds und bump.\n- Verify writable konten are minimal und justified.\n- Verify arithmetic uses checked operations fuer u64 transitions.\n- Verify negative-path tests exist fuer unauthorized und malformed konten.\n\n## Red flags\n- Privileged state updates without signer checks.\n- Parsing unchecked konto data from unknown owners.\n- PDA acceptance based on partial seed checks.\n- Handlers that trust client-provided bump blindly.\n- Arithmetic updates using plain + und - on balances.\n\n## How to verify (simulator)\n- Run vulnerable mode on signer-missing scenario und inspect trace.\n- Re-run fixed mode und confirm ERR_NOT_SIGNER.\n- Execute owner-missing scenario und compare vulnerable vs fixed outcomes.\n- Execute pda-spoof scenario und confirm fixed mode emits ERR_BAD_PDA.\n- Compare trace hashes to verify deterministic event ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l1-q1",
                    "prompt": "Why are konto owner checks mandatory before deserializing state?",
                    "options": [
                      "Because callers can pass arbitrary konten und forged byte layouts",
                      "Because owner checks improve rendering speed",
                      "Because owner checks replace signer checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without owner checks, konto substitution allows attacker-controlled bytes to be parsed as trusted state."
                  },
                  {
                    "id": "security-v2-l1-q2",
                    "prompt": "What should be verified fuer a privileged withdraw path?",
                    "options": [
                      "Expected authority key, signer requirement, owner check, und PDA derivation",
                      "Only that the vault konto is writable",
                      "Only that an amount field exists"
                    ],
                    "answerIndex": 0,
                    "explanation": "Privileged transitions need full identity und authority validation."
                  }
                ]
              }
            ]
          },
          "security-v2-evidence-chain": {
            "title": "Evidence chain: reproduce, trace, impact, fix, verify",
            "content": "# Evidence chain: reproduce, trace, impact, fix, verify\n\nStrong sicherheit reports are built on evidence chains, not opinions. In the Solana context, that means moving from a claim such as “missing signer check exists” to a deterministic chain: reproduce exploit conditions, capture a stable execution trace, quantify impact, apply a patch, und verify that the same steps now fail mit expected error codes while invariants hold. This chain is what turns audit work into an engineering artifact.\n\nReproduction should be deterministic und minimal. Every scenario should declare initial konten, authority/signer flags, vault ownership assumptions, und anweisung inputs. If reproductions depend on external RPC timing or changing liquidity conditions, confidence drops und triage slows down. In this kurs lab, scenarios are fixture-driven und offline so every replay produces the same state transitions.\n\nTrace capture is the core of audit evidence. Instead of recording only final balances, log each relevant event in stable order: InstructionStart, AccountRead, CheckPassed/CheckFailed, BalanceChange, InstructionEnd. These events let reviewers verify exactly which assumptions passed und where validation was skipped. They also help map exploitability to code-level checks. Fuer example, if signer checks are absent in vulnerable mode, the trace should explicitly show that signer validation was skipped or never evaluated.\n\nImpact analysis should be quantitative. Fuer signer und owner bugs, compute drained lamports or unauthorized state changes. Fuer PDA bugs, show mismatch between expected derived address und accepted address. Fuer arithmetic bugs, show underflow or overflow conditions und resulting corruption. Impact details inform severity und prioritization.\n\nPatch validation should not just say “fixed.” It should prove exploit steps now fail fuer the right reason. If signer exploit now fails, error code should be ERR_NOT_SIGNER. If PDA spoof now fails, error code should be ERR_BAD_PDA. This specificity catches regressions where one bug is accidentally masked by unrelated behavior.\n\nVerification closes the chain mit invariant checks. Examples: vault balance remains a valid u64 string, authority remains unchanged, und no unauthorized lamport delta occurs in fixed mode. These invariants convert patch confidence into measurable guarantees.\n\nWhen teams do this consistently, reports become executable documentation. New engineers can replay scenarios und understand why controls exist. Incident response becomes faster because prior failure signatures und remediation patterns are already captured.\n\n## Checklist\n- Define each scenario mit explicit initial state und anweisung inputs.\n- Capture deterministic, ordered trace events fuer each run.\n- Hash traces mit canonical JSON fuer reproducibility.\n- Quantify impact using before/after deltas.\n- Map each finding to explicit evidence references.\n- Re-run identical scenarios in fixed mode.\n- Verify fixed-mode failures use expected error codes.\n- Record post-fix invariant results mit stable IDs.\n\n## Red flags\n- Reports mit no reproduction steps.\n- Non-deterministic traces that change between runs.\n- Impact described qualitatively without deltas.\n- Patch claims without fixed-mode replay evidence.\n- Invariant lists omitted from verification section.\n\n## How to verify (simulator)\n- Run signer-missing in vulnerable mode, save trace hash.\n- Run same scenario in fixed mode, confirm ERR_NOT_SIGNER.\n- Run owner-missing und confirm ERR_BAD_OWNER in fixed mode.\n- Run pda-spoof und compare expected/accepted PDA fields.\n- Generate audit report JSON und markdown summary from checkpoint builder.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "security-v2-l2-account-explorer",
                "title": "Trace Konto Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Vault konto (vulnerable run)",
                      "address": "PDA_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                      "lamports": 300,
                      "owner": "VaultProgram111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Recipient konto (post exploit)",
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
                      "To prove deterministic replay und evidence integrity",
                      "To replace structured test assertions",
                      "To randomize scenario ordering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Canonical trace hashes make replay evidence comparable und tamper-evident."
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
                    "explanation": "This order ensures claims are demonstrated und patch effectiveness is validated."
                  }
                ]
              }
            ]
          },
          "security-v2-bug-classes": {
            "title": "Common Solana bug classes und mitigations",
            "content": "# Common Solana bug classes und mitigations\n\nAuditors on Solana repeatedly encounter the same core bug families. The implementation details differ across protocols, but exploit mechanics are surprisingly consistent: identity confusion, authority confusion, derivation drift, arithmetic corruption, und unsafe cross-program assumptions. A robust review process categorizes findings by class, applies known verification patterns, und tests negative paths intentionally.\n\n**Missing signer checks** are high-severity because they directly break authorization. The fix is conceptually simple: require signer und key relation. Yet teams miss it when refactoring konto structs or switching between typed und unchecked konto wrappers. Auditors should scan all state-mutating handlers und ask: who can call this und what proves authorization?\n\n**Missing owner checks** create konto substitution risk. Programs may deserialize konto bytes und trust semantic fields without proving the konto is owned by the expected program. In mixed CPI systems, this is especially dangerous because konto shapes can look valid while semantics differ. Mitigation is explicit owner validation before parsing und strict konto type usage.\n\n**PDA seed/bump mismatch** appears when seed ordering, domain tags, or bump handling drifts between anweisungen. One handler derives [\"vault\", authority], another derives [authority, \"vault\"], a third trusts client-provided bump. Attackers search those inconsistencies to route privileged logic through spoofed addresses. Mitigation is canonical seed schema, exact re-derivation on every sensitive path, und tests that intentionally pass malformed PDA candidates.\n\n**CPI authority confusion** happens when one program delegates authority assumptions to another without strict scope. If signer seeds or delegated permissions are broader than intended, downstream calls can perform unintended state transitions. Mitigation includes explicit CPI allowlists, minimal writable/signer metas, und scope-limited delegated authorities.\n\n**Integer overflow/underflow** remains a praktisch class in accounting-heavy systems. Rust release mode behavior makes unchecked arithmetic unacceptable fuer balances und fee logic. Mitigation is checked operations, u128 intermediates fuer multiply/divide paths, und boundary-focused tests.\n\nMitigation quality depends on verification quality. Unit tests should include adversarial konto substitutions, malformed seeds, missing signers, und boundary arithmetic. If tests only cover happy paths, high-severity bugs will survive code review.\n\nThe audit deliverable should translate classes into implementation guidance. Engineers need clear, actionable remediations und concrete reproduction conditions, not generic warnings. The best reports include checklists that can be wired into CI und release gates.\n\n## Checklist\n- Enumerate all privileged anweisungen und expected signers.\n- Verify owner checks before parsing external konto layouts.\n- Pin und document PDA seed schemas und bump usage.\n- Validate CPI target program IDs against allowlist.\n- Minimize writable und signer konto metas in CPI.\n- Enforce checked math fuer all u64 state transitions.\n- Add negative tests fuer each bug class.\n- Require deterministic traces fuer sicherheit-critical tests.\n\n## Red flags\n- Any privileged mutation path without explicit signer requirement.\n- Any unchecked konto deserialization path.\n- Any anweisung that accepts bump without re-derivation.\n- Any CPI call to dynamic or user-selected program ID.\n- Any unchecked arithmetic on balances or supply values.\n\n## How to verify (simulator)\n- Use lektion 4 scenario to confirm unauthorized withdraw in vulnerable mode.\n- Use lektion 5 scenario to confirm spoofed PDA acceptance in vulnerable mode.\n- Use lektion 6 patch suite to verify fixed-mode errors by code.\n- Run checkpoint report und ensure all scenarios are marked reproduced.\n- Inspect invariant result array fuer all fixed-mode scenarios.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l3-q1",
                    "prompt": "What is the strongest mitigation fuer PDA spoof risks?",
                    "options": [
                      "Canonical seed schema mit exact re-derivation + bump verification",
                      "Accepting any PDA-like prefix",
                      "Trusting client-provided bump values"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic re-derivation closes spoofable PDA substitution paths."
                  },
                  {
                    "id": "security-v2-l3-q2",
                    "prompt": "Why are negative-path tests required fuer audit confidence?",
                    "options": [
                      "Because most exploitable bugs only appear under malformed or adversarial input",
                      "Because happy-path tests cover all sicherheit cases",
                      "Because traces are optional without them"
                    ],
                    "answerIndex": 0,
                    "explanation": "Sicherheit failures are usually adversarial edge cases, so tests must target those edges directly."
                  }
                ]
              }
            ]
          }
        }
      },
      "security-v2-vuln-lab": {
        "title": "Vuln Lab Project Journey",
        "description": "Exploit, patch, verify, und produce audit-ready artifacts mit deterministic traces und invariant-backed conclusions.",
        "lessons": {
          "security-v2-exploit-signer-owner": {
            "title": "Break it: exploit missing signer + owner checks",
            "content": "# Break it: exploit missing signer + owner checks\n\nImplement a deterministic exploit-proof formatter fuer signer/owner vulnerabilities.\n\nExpected output fields:\n- scenario\n- before/after vault balance\n- before/after recipient lamports\n- trace hash\n- explanation mit drained lamports\n\nUse canonical key ordering so tests can assert exact JSON output.",
            "duration": "40 min",
            "hints": [
              "Compute drained lamports from recipient before/after.",
              "Include deterministic field ordering in the JSON output.",
              "The explanation should mention missing signer/owner validation."
            ]
          },
          "security-v2-exploit-pda-spoof": {
            "title": "Break it: exploit PDA spoof mismatch",
            "content": "# Break it: exploit PDA spoof mismatch\n\nImplement a deterministic PDA spoof proof output.\n\nYou must show:\n- expected PDA\n- accepted PDA\n- mismatch boolean\n- trace hash\n\nThis lektion validates evidence generation fuer derivation mismatches.",
            "duration": "40 min",
            "hints": [
              "Return whether expectedPda und acceptedPda differ.",
              "Use strict boolean output fuer mismatch.",
              "Keep output key order stable."
            ]
          },
          "security-v2-patch-validate": {
            "title": "Fix it: validations + invariant suite",
            "content": "# Fix it: validations + invariant suite\n\nImplement patch validation output that confirms:\n- signer check\n- owner check\n- PDA check\n- safe u64 arithmetic\n- exploit blocked state mit error code\n\nKeep output deterministic fuer exact assertion.",
            "duration": "45 min",
            "hints": [
              "All four controls must be true fuer a complete patch.",
              "Use fixedBlockedExploit to set blocked status.",
              "Return error code only when blocked is true."
            ]
          },
          "security-v2-writing-reports": {
            "title": "Writing audit reports: severity, likelihood, blast radius, remediation",
            "content": "# Writing audit reports: severity, likelihood, blast radius, remediation\n\nA strong audit report is an engineering document, not a narrative essay. It should allow a reader to answer four questions quickly: what failed, how exploitable it is, how much damage it can cause, und what exact change prevents recurrence. Sicherheit writing quality directly affects fix quality because implementation teams ship what they can interpret.\n\nSeverity should be tied to impact und exploit preconditions. A missing signer check in a withdraw path is typically critical if it allows unauthorized asset movement mit low prerequisites. A PDA mismatch may be high or medium depending on reachable code paths und available controls. Severity labels without rationale are not useful. Include explicit exploit path assumptions und whether attacker capital or privileged positioning is required.\n\nLikelihood should capture praktisch exploitability, not theoretical possibility. Fuer example, if a bug requires impossible konto states under current architecture, likelihood may be low even if impact is high. Conversely, if a bug is reachable by submitting a standard anweisung mit crafted konto metas, likelihood is high. Be specific.\n\nBlast radius should describe what can be drained or corrupted: one vault, one market, protocol-wide state, or governance authority. This framing helps teams stage incident response und patch rollout.\n\nRecommendations must be precise und testable. “Add better validation” is too vague. “Require authority signer, verify authority key matches vault state, verify vault owner equals program id, und verify PDA from [\"vault\", authority] + bump” is actionable. Include expected error codes so QA can validate behavior reliably.\n\nEvidence references are also important. Each finding should point to deterministic traces, scenario IDs, und checkpoint artifacts so another engineer can replay without interpretation gaps.\n\nFinally, include verification results. A patch is not complete until exploit scenarios fail deterministically und invariants hold. Reports that end before verification force downstream teams to rediscover completion criteria.\n\nReport structure should also prioritize scanability. Teams reviewing multiple findings under incident pressure need consistent field ordering und concise language that maps directly to engineering actions. If one finding uses narrative prose while another uses structured reproduction steps, remediation speed drops because readers spend time normalizing format instead of executing fixes.\n\nA reliable pattern is one finding per vulnerability class mit explicit evidence references grouped by scenario ID. That allows QA, auditors, und protocol engineers to coordinate on the same deterministic artifacts. The same approach also improves long-term maintenance: when code changes, teams can rerun scenario IDs und compare trace hashes to detect regressions in report assumptions.\n\n## Checklist\n- State explicit vulnerability class und affected anweisung path.\n- Include reproducible scenario ID und deterministic trace hash.\n- Quantify impact mit concrete state/balance deltas.\n- Assign severity mit rationale tied to exploit preconditions.\n- Assign likelihood based on realistic attacker capabilities.\n- Describe blast radius at konto/protocol boundary.\n- Provide exact remediation steps und expected error codes.\n- Include verification outcomes und invariant results.\n\n## Red flags\n- Severity labels without impact rationale.\n- Recommendations without concrete validation rules.\n- No reproduction steps or trace references.\n- No fixed-mode verification evidence.\n- No distinction between impact und likelihood.\n\n## How to verify (simulator)\n- Generate report JSON from checkpoint builder.\n- Confirm findings include evidenceRefs fuer each scenario.\n- Confirm remediation includes patch IDs.\n- Confirm verification results mark each scenario as blocked in fixed mode.\n- Generate markdown summary und compare to report content ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l7-q1",
                    "prompt": "What is the key difference between severity und likelihood?",
                    "options": [
                      "Severity measures impact; likelihood measures praktisch exploitability",
                      "They are interchangeable labels",
                      "Likelihood is only fuer low-severity bugs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Good reports separate damage potential from exploit feasibility."
                  },
                  {
                    "id": "security-v2-l7-q2",
                    "prompt": "Which recommendation is most actionable?",
                    "options": [
                      "Require signer + owner + PDA checks mit explicit error codes",
                      "Improve sicherheit in this function",
                      "Add more comments"
                    ],
                    "answerIndex": 0,
                    "explanation": "Actionable recommendations map directly to code changes und tests."
                  }
                ]
              }
            ]
          },
          "security-v2-audit-report-checkpoint": {
            "title": "Checkpoint: deterministic AuditReport JSON + markdown",
            "content": "# Checkpoint: deterministic AuditReport JSON + markdown\n\nCreate the final deterministic checkpoint payload:\n- kurs + version\n- scenario IDs\n- finding count\n\nThis checkpoint mirrors the final kurs artifact produced by the simulator report builder.",
            "duration": "45 min",
            "hints": [
              "Return stable, minimal checkpoint metadata.",
              "kurs must be solana-sicherheit und version must be v2.",
              "Preserve scenarioIds order as provided."
            ]
          }
        }
      }
    }
  },
  "token-engineering": {
    "title": "Token Engineering on Solana",
    "description": "Project-journey kurs fuer teams launching real Solana tokens: deterministic Token-2022 planning, authority design, supply simulation, und operational launch discipline.",
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
        "description": "Understand token primitives, mint policy anatomy, und Token-2022 extension controls mit explicit governance und threat-model framing.",
        "lessons": {
          "token-v2-spl-vs-token-2022": {
            "title": "SPL tokens vs Token-2022: what extensions change",
            "content": "# SPL tokens vs Token-2022: what extensions change\n\nToken engineering starts mit a clean boundary between base token semantics und configurable policy. Legacy SPL Token gives you a stable fungible primitive: mint metadata, token konten, mint authority, freeze authority, und transfer/mint/burn anweisungen. Token-2022 preserves that core interface but adds extension slots that let teams activate richer behavior without rewriting token logic from scratch. That compatibility is useful, but it also creates a new class of governance und safety decisions that frontend und protocol engineers need to model explicitly.\n\nThe key mentales modell: Token-2022 is not a separate economic system; it is an extended konto layout und anweisung surface. Extensions are opt-in, und each extension adds bytes, authorities, und state transitions that must be considered during mint initialization und lifecycle management. If you treat extensions as cosmetic add-ons, you can ship a token that is technically valid but operationally fragile.\n\nFuer production teams, the first decision is policy minimalism. Every enabled extension increases complexity in wallets, indexers, und downstream integrations. Transfer fees may fit treasury goals but can break assumptions in partner protocols. Default konto state can enforce safety posture but may confuse users if konto thaw flow is unclear. Permanent delegate can simplify managed flows but dramatically expands power if authority boundaries are weak. The right approach is to map each extension to a concrete requirement und document the explicit threat model it introduces.\n\nToken-2022 also changes launch sequencing. You must pre-size mint konten fuer chosen extensions, initialize extension data in deterministic order, und verify authority alignment before live distribution. This is where deterministic offline planning is valuable: you can generate a launch pack, inspect anweisung-like payloads, und validate invariants before touching network systems. That practice catches configuration drift early und gives reviewers a reproducible artifact.\n\nFinally, extension-aware design is an integration problem, not just a contract problem. Product und support teams need clear messaging fuer fee behavior, frozen konto states, und delegated capabilities. If users cannot predict token behavior from wallet prompts und docs, operational risk rises even when code is formally correct.\n\n## Decision framework fuer extension selection\n\nFuer each extension, force three answers before enabling it:\n1. What concrete product requirement does this solve now?\n2. Which authority can abuse this if compromised?\n3. How will users und integrators observe this behavior in UX und docs?\n\nIf any answer is vague, extension scope is probably too broad.\n\n## Pitfall: Extension creep without threat modeling\n\nAdding multiple extensions \"fuer flexibility\" often creates overlapping authority powers und unpredictable UX. Enable only the extensions your product can govern, monitor, und explain end-to-end.\n\n## Sanity Checklist\n\n1. Define one explicit business reason per extension.\n2. Document extension authorities und revocation strategy.\n3. Verify partner compatibility assumptions before launch.\n4. Produce deterministic initialization artifacts fuer review.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l1-q1",
                    "prompt": "What is the safest default posture fuer Token-2022 extension selection?",
                    "options": [
                      "Enable only extensions mit clear product und risk justification",
                      "Enable all extensions fuer future flexibility",
                      "Disable authorities entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "Every extension adds governance und integration complexity, so scope should stay intentional."
                  },
                  {
                    "id": "token-v2-l1-q2",
                    "prompt": "Why generate an offline deterministic launch pack before devnet/mainnet actions?",
                    "options": [
                      "To review anweisung intent und invariants before execution",
                      "To avoid configuring decimals",
                      "To bypass authority checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic planning provides reproducible review artifacts und catches config drift early."
                  }
                ]
              }
            ]
          },
          "token-v2-mint-anatomy": {
            "title": "Mint anatomy: authorities, decimals, supply, freeze, mint",
            "content": "# Mint anatomy: authorities, decimals, supply, freeze, mint\n\nA production token launch succeeds or fails on parameter discipline. The mint konto is a compact policy object: it defines decimal precision, minting authority, optional freeze authority, und extension configuration. Token konten then represent balances fuer owners, usually through ATAs. If these pieces are configured inconsistently, downstream systems see contradictory behavior und user trust erodes quickly.\n\nDecimals are one of the most underestimated parameters. They influence UI formatting, fee interpretation, und business logic in integrations. While high precision can feel \"future-proof,\" excessive decimals often create rounding edge cases in analytics und partner systems. Constraining decimals to a documented operational range und validating it at config time is a praktisch defensive rule.\n\nAuthority layout should be explicit und minimal. Mint authority controls supply growth. Freeze authority controls konto-level transfer ability. Update authority (fuer metadata-linked policy) can affect user-facing trust und protocol assumptions. Teams often reuse one operational key fuer convenience, then struggle to separate powers later. A better pattern is to predefine authority roles und revocation milestones as part of launch governance.\n\nSupply planning should distinguish issuance from distribution. Initial supply tells you what is minted; recipient allocations tell you what is distributed at launch. Those values should be validated mit exact integer math, not float formatting. Invariant checks such as `recipientsTotal <= initialSupply` are simple but prevent serious release mistakes.\n\nToken-2022 extensions deepen this anatomy. Transfer fee config introduces fee basis points und caps; default konto state changes konto activation posture; permanent delegate creates a privileged transfer actor. Each extension implies additional authority und monitoring requirements. Your launch plan must encode these requirements as explicit steps und include human-readable labels so reviewers can confirm intent.\n\nFinally, deterministic address derivation in kurs tooling is a useful engineering discipline. Even when pseudo-addresses are used fuer offline planning, stable derivation functions improve reproducibility und reduce reviewer ambiguity. The same mindset carries to real deployments where deterministic konto derivation is foundational.\n\nStrong teams also pair mint-anatomy reviews mit explicit incident playbooks: what to do if an authority key is lost, rotated, or compromised, und how to communicate those events to integrators without causing panic.\n\n## Pitfall: One-key authority convenience\n\nUsing a single key fuer minting, freezing, und metadata updates simplifies setup but concentrates risk. Authority compromise then becomes a full-token compromise rather than a contained incident.\n\n## Sanity Checklist\n\n1. Validate decimals und supply fields before plan generation.\n2. Record mint/freeze/update authority roles und custody model.\n3. Confirm recipient allocation totals mit integer math.\n4. Review extension authorities independently from mint authority.\n",
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
                      "Because token konten store floats"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply und distribution correctness depends on exact arithmetic over integer base units."
                  },
                  {
                    "id": "token-v2-l2-q2",
                    "prompt": "What is the primary role of freeze authority?",
                    "options": [
                      "Controlling whether specific token konten can transfer",
                      "Changing token symbol",
                      "Computing transfer fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freeze authority governs transfer state at konto level, not branding or fee math."
                  }
                ]
              }
            ]
          },
          "token-v2-extension-safety-pitfalls": {
            "title": "Extension safety pitfalls: fee configs, delegate abuse, default konto state",
            "content": "# Extension safety pitfalls: fee configs, delegate abuse, default konto state\n\nToken-2022 extensions let teams express policy in a standard token framework, but policy power is exactly where operational failures happen. Sicherheit issues in token launches are rarely exotic cryptography failures. They are usually configuration mistakes: fee caps set too high, delegates granted too broadly, or frozen default states introduced without recovery controls. Production engineering must treat extension configuration as safety-critical logic.\n\nTransfer fee configuration is a good example. A basis-point fee looks simple, yet behavior depends on cap interaction und token decimals. If maxFee is undersized, large transfers saturate quickly und effective fee curve becomes nonlinear. If maxFee is oversized, treasury extraction can exceed expected user tolerance. Deterministic simulations across example transfer sizes are essential before launch, und those simulations should be reviewed by both protocol und product teams.\n\nPermanent delegate is another high-risk feature. It can enable managed flows, but it also creates a privileged actor that may transfer tokens without normal owner signatures depending on policy scope. If delegate authority is not governed by clear controls und revocation procedures, compromise risk rises sharply. In many incidents, teams enabled delegate-like authority fuer convenience, then discovered too late that governance und monitoring were insufficient.\n\nDefault konto state introduces user-experience und compliance implications. A frozen default state can enforce controlled activation, but it also creates onboarding failure if thaw paths are unclear or unavailable in partner wallets. Teams should verify thaw strategy, authority custody, und fallback procedures before enabling frozen defaults in production.\n\nThe safest engineering workflow is deterministic und reviewable: validate config, normalize extension fields, generate initialization plan labels, simulate transfer outcomes, und produce invariant lists. That sequence creates a shared artifact fuer engineering, sicherheit, legal, und support stakeholders. When questions arise, teams can inspect exact intended policy rather than infer from fragmented scripts.\n\nFinally, treat extension combinations as compounded risk. Each extension may be individually reasonable, yet combined authority interactions can create hidden escalation paths. Cross-extension threat modeling is therefore mandatory fuer serious launches.\n\n## Pitfall: Fee und delegate settings shipped without scenario simulation\n\nTeams often validate only \"happy path\" transfer examples. Without boundary simulations und authority abuse scenarios, dangerous configurations can pass review und surface only after users are affected.\n\n## Sanity Checklist\n\n1. Simulate fee behavior at low/medium/high transfer sizes.\n2. Document delegate authority scope und emergency revocation path.\n3. Verify frozen default konten have explicit thaw operations.\n4. Review combined extension authority interactions fuer escalation risk.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l3-q1",
                    "prompt": "Why does transfer-fee max cap need scenario tests?",
                    "options": [
                      "It can materially change effective fee behavior across transfer sizes",
                      "It only affects metadata",
                      "It is ignored once mint is initialized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee cap interacts mit basis points und can distort economic behavior if misconfigured."
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
                    "explanation": "Delegate privileges must be constrained und governed like high-sensitivity access."
                  }
                ]
              }
            ]
          },
          "token-v2-validate-config-derive": {
            "title": "Validate token config + derive deterministic addresses offline",
            "content": "# Validate token config + derive deterministic addresses offline\n\nImplement strict config validation und deterministic pseudo-derivation:\n- validate decimals, u64 strings, recipient totals, extension fields\n- derive stable pseudo mint und ATA addresses from hash seeds\n- return normalized validated config + derivations\n",
            "duration": "35 min",
            "hints": [
              "Validate decimal bounds, u64-like numeric strings, und recipient totals before derivation.",
              "Use one deterministic seed format fuer mint und one fuer ATA derivation.",
              "Keep output key order stable so checkpoint tests are reproducible."
            ]
          }
        }
      },
      "token-v2-module-launch-pack": {
        "title": "Token Launch Pack Project",
        "description": "Build deterministic validation, planning, und simulation workflows that produce reviewable launch artifacts und clear go/no-go criteria.",
        "lessons": {
          "token-v2-build-init-plan": {
            "title": "Build Token-2022 initialization anweisung plan",
            "content": "# Build Token-2022 initialization anweisung plan\n\nCreate a deterministic offline initialization plan:\n- create mint konto step\n- init mint step mit decimals\n- append selected extension steps in stable order\n- base64 encode step payloads mit explicit encoding version\n",
            "duration": "35 min",
            "hints": [
              "Add base steps first: create mint konto, then initialize mint mit decimals.",
              "Append extension steps in deterministic order so plan labels are stable.",
              "Encode each step payload mit version + sorted params before base64 conversion."
            ]
          },
          "token-v2-simulate-fees-supply": {
            "title": "Build mint-to + transfer-fee math + simulation",
            "content": "# Build mint-to + transfer-fee math + simulation\n\nImplement pure simulation fuer transfer fees und launch distribution:\n- fee = min(maxFee, floor(amount * feeBps / 10000))\n- aggregate distribution totals deterministically\n- ensure no negative supply und no oversubscription\n",
            "duration": "35 min",
            "hints": [
              "Transfer fee formula: fee = min(maxFee, floor(amount * feeBps / 10000)).",
              "Aggregate distributed und fee totals using BigInt to keep math exact.",
              "Fail when distributed amount exceeds initial supply."
            ]
          },
          "token-v2-launch-checklist": {
            "title": "Launch checklist: params, upgrade/authority strategy, airdrop/tests plan",
            "content": "# Launch checklist: params, upgrade/authority strategy, airdrop/tests plan\n\nA successful token launch is an operations exercise as much as a programming task. By the time users see your token in wallets, dozens of choices have already constrained safety, governance, und UX. Production token engineering therefore needs a launch checklist that turns abstract design intent into verifiable execution steps.\n\nStart mit parameter closure. Name, symbol, decimals, initial supply, authority addresses, extension configuration, und recipient allocations must be finalized und reviewed as one immutable package before execution. Many launch incidents come from late parameter changes made in disconnected scripts. Deterministic launch pack generation prevents this by forcing a single source of truth.\n\nAuthority strategy is the second pillar. Decide which authorities remain active after launch, which are revoked, und which move to multisig custody. A common best practice is staged authority reduction: keep temporary controls through rollout validation, then revoke or transfer to governance once monitoring baselines are stable. This must be planned explicitly, not improvised during launch day.\n\nTests strategy should include deterministic offline tests und limited online rehearsal. Offline checks validate config schemas, anweisung payload encoding, fee simulations, und supply invariants. Optional devnet rehearsal validates operational playbooks (funding, sequence execution, monitoring) but should not be your only validation layer. If offline checks fail, devnet success is not meaningful.\n\nAirdrop und distribution planning should include recipient reconciliation und rollback strategy. Teams often focus on minting und forget operational constraints around recipient list correctness, timing windows, und support escalation paths. Deterministic distribution plans mit stable labels make reconciliation simpler und reduce accidental double execution.\n\nMonitoring und communication are equally important. Define launch metrics in advance: minted supply observed, distribution completion count, fee behavior sanity, und extension-specific health checks. Publish user-facing notices fuer any non-obvious behavior such as transfer fees or frozen default konto state. Clear communication lowers support load und improves trust.\n\nFinally, write down hard stop conditions. If invariants fail, if authority keys mismatch, or if distribution deltas diverge from expected totals, launch should pause immediately. Engineering discipline means refusing to proceed when safety checks are red.\n\n## Pitfall: Treating launch as a one-shot script run\n\nWithout an explicit checklist und rollback criteria, teams can execute technically valid anweisungen that violate business or governance intent. Successful launches are controlled workflows, not single commands.\n\n## Sanity Checklist\n\n1. Freeze a canonical config payload before execution.\n2. Approve authority lifecycle und revocation milestones.\n3. Run deterministic offline simulation und invariant checks.\n4. Reconcile recipient totals und distribution labels.\n5. Define go/no-go criteria und escalation owners.\n",
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
                      "To prevent script/config drift between review und launch",
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
            "content": "# Emit stable LaunchPackSummary\n\nCompose full project output as stable JSON:\n- normalized authorities und extensions\n- supply totals und optional fee model examples\n- deterministic plan metadata und invariants\n- fixtures hash + encoding version metadata\n",
            "duration": "45 min",
            "hints": [
              "Keep checkpoint JSON key ordering fixed so output is stable.",
              "Compute recipientsTotal und remaining mit exact integer math.",
              "Include determinism metadata (fixtures hash + encoding version) in the final object."
            ]
          }
        }
      }
    }
  },
  "solana-mobile": {
    "title": "Solana Mobile Development",
    "description": "Build production-ready mobile Solana dApps mit MWA, robust wallet session architecture, explicit signing UX, und disciplined distribution operations.",
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
        "description": "Core MWA protocol, session lifecycle control, und resilient wallet handoff patterns fuer production mobile apps.",
        "lessons": {
          "mobile-wallet-overview": {
            "title": "Mobile Wallet Ueberblick",
            "content": "# Mobile Wallet Ueberblick\n\nSolana Mobile development is built around the Solana Mobile Stack (SMS), a set of standards und tooling designed fuer secure, high-quality crypto-native mobile experiences. SMS is more than a hardware initiative; it defines interoperable wallet communications, trusted execution patterns, und distribution infrastructure tailored to Web3 apps.\n\nA core piece is the Mobile Wallet Adapter (MWA) protocol. Instead of embedding private keys in dApps, MWA connects mobile dApps to external wallet apps fuer authorization, signing, und transaktion submission. This separation mirrors browser wallet sicherheit on desktop und prevents dApps from directly handling secret keys.\n\nSaga introduced the first flagship reference device fuer Solana Mobile concepts, including Seed Vault-oriented workflows. Even when users are not on Saga, SMS standards remain useful because protocol-level interoperability is the target: any wallet implementing MWA can serve compatible apps.\n\nThe Solana dApp Store is another foundational element. It provides a distribution channel fuer crypto applications mit policy considerations better aligned to on-chain apps than traditional app stores. Teams can ship wallet-native functionality, tokenized features, und on-chain social mechanics without the same constraints often imposed by conventional app marketplaces.\n\nKey architectural principles fuer mobile Solana apps:\n\n- Keep signing in wallet context, not app context.\n- Treat session authorization as revocable und short-lived.\n- Build graceful fallback if wallet app is missing.\n- Optimize fuer intermittent connectivity und mobile latency.\n\nTypical mobile flow:\n\n1. dApp requests authorization via MWA.\n2. Wallet prompts user to approve konto access.\n3. dApp builds transaktionen und requests signatures.\n4. Wallet returns signed payload or submits transaktion.\n5. dApp observes confirmation und updates UI.\n\nMobile UX needs explicit state transitions (authorizing, awaiting wallet, signing, submitted, confirmed). Ambiguity causes user drop-off quickly on small screens.\n\nFuer Solana teams, mobile is not a “mini web app”; it requires deliberate protocol und UX design choices. SMS und MWA provide a secure baseline so developers can ship on-chain experiences mit production-grade signing und session models on handheld devices.\n\n## Praktisch architecture split\n\nTreat your mobile stack as three independent systems:\n1. UI app state und navigation.\n2. Wallet transport/session state (MWA lifecycle).\n3. On-chain transaktion intent und confirmation state.\n\nIf you couple these layers tightly, wallet switch interruptions und app backgrounding can corrupt flow state. If they stay separated, recovery is predictable.\n\n## What users should feel\n\nGood mobile crypto UX is not \"fewer steps at all costs.\" It is clear intent, explicit signing context, und safe recoverability when app switching or network instability happens.\n",
            "duration": "35 min"
          },
          "mwa-integration": {
            "title": "MWA Integration",
            "content": "# MWA Integration\n\nIntegrating Mobile Wallet Adapter typically starts mit `@solana-mobile/mobile-wallet-adapter` APIs und an interaction pattern built around `transact()`. Within a transaktion session, the app can authorize, request capabilities, sign transaktionen, und handle wallet responses in a structured way.\n\nA simplified integration flow:\n\n```typescript\nimport { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';\n\nawait transact(async (wallet) => {\n  const auth = await wallet.authorize({\n    cluster: 'devnet',\n    identity: { name: 'JazzCode Mobile', uri: 'https://jazzcode.vercel.app' },\n  });\n\n  const account = auth.accounts[0];\n  // build tx, request signing/submission\n});\n```\n\nAuthorization yields one or more konten plus auth tokens fuer session continuation. Persist these tokens carefully und invalidate them on sign-out. Do not assume tokens remain valid forever; wallet apps can revoke sessions.\n\nFuer signing, you can request:\n\n- `signTransactions` (sign only)\n- `signAndSendTransactions` (wallet signs und submits)\n- `signMessages` (SIWS-like auth flows)\n\nDeep links are used under the hood to switch between your dApp und wallet. That means state restoration matters: your app should survive process backgrounding und resume pending operation state on return.\n\nPraktisch engineering tips:\n\n- Implement idempotent transaktion request handling.\n- Show a visible “Waiting fuer wallet approval” state.\n- Handle user cancellation explicitly, not as generic failure.\n- Retry network submission separately from signing when possible.\n\nSicherheit considerations:\n\n- Bind sessions to app identity metadata.\n- Use short-lived backend nonces fuer message-sign auth.\n- Never log full signed payloads mit sensitive context.\n\nMWA is effectively your mobile signing transport layer. If its state machine is robust, your app feels professional und trustworthy. If state handling is weak, users experience “stuck” flows und may distrust the dApp even if on-chain logic is correct.",
            "duration": "35 min"
          },
          "mobile-transaction": {
            "title": "Build a Mobile Transaktion Function",
            "content": "# Build a Mobile Transaktion Function\n\nImplement a helper that formats a deterministic MWA transaktion request summary string.\n\nExpected output format:\n\n`<cluster>|<payer>|<instructionCount>`\n\nUse this exact order und delimiter.",
            "duration": "50 min",
            "hints": [
              "Add validation before returning the formatted string.",
              "instructionCount should be treated as a number but returned as text.",
              "Throw exact error message fuer missing payer."
            ]
          }
        }
      },
      "module-dapp-store-and-distribution": {
        "title": "dApp Store & Distribution",
        "description": "Publishing, operational readiness, und trust-centered mobile UX practices fuer Solana app distribution.",
        "lessons": {
          "dapp-store-submission": {
            "title": "dApp Store Submission",
            "content": "# dApp Store Submission\n\nPublishing to the Solana dApp Store requires more than packaging binaries. Teams should treat submission as a product, compliance, und sicherheit review process. A strong submission demonstrates safe wallet interactions, clear user communication, und operational readiness.\n\nSubmission readiness checklist:\n\n- Stable release builds fuer target Android devices.\n- Clear app identity und support channels.\n- Wallet interaction flows tested fuer cancellation und failure recovery.\n- Privacy policy und terms aligned to on-chain behaviors.\n- Transparent handling of tokenized features und in-app value flows.\n\nOne distinguishing concept in Solana mobile distribution is token-aware product design. Apps may use NFT-gated access, on-chain subscriptions, or tokenized entitlements. These flows must be understandable to users und not hide financial consequences. Review teams typically evaluate whether permissions und wallet prompts are proportional to app behavior.\n\nNFT-based licensing models can be implemented by checking ownership of specific collection assets at runtime. If licensing depends on assets, build robust indexing und refresh behavior so users are not locked out due to temporary RPC/indexer mismatch.\n\nOperational best practices fuer review success:\n\n- Provide reproducible test konten und walkthroughs.\n- Include a “safe mode” or demo path if wallet connection fails.\n- Avoid unexplained signature prompts.\n- Log non-sensitive diagnostics fuer support.\n\nPost-submission lifecycle matters too. Plan how you will handle urgent fixes, wallet SDK updates, und chain-level incidents. Mobile releases can take time to propagate, so feature flags und backend kill-switches fuer risky pathways are valuable.\n\nDistribution strategy should also include analytics around onboarding funnels, wallet connect success rates, und transaktion completion rates. These metrics identify mobile-specific friction that desktop-oriented teams often miss.\n\nA successful dApp Store submission reflects secure protocol integration und mature product operations. If your wallet interactions are explicit, fail-safe, und user-centered, your app is far more likely to pass review und retain users in production.",
            "duration": "35 min"
          },
          "mobile-best-practices": {
            "title": "Mobile Best practices",
            "content": "# Mobile Best practices\n\nMobile crypto UX requires balancing speed, safety, und trust. Users make high-stakes decisions on small screens, often on unstable networks. Solana mobile apps should therefore optimize fuer explicitness und recoverability, not just visual polish.\n\n**Biometric gating** is useful fuer sensitive local actions (revealing seed-dependent views, exporting konto data, approving high-risk actions), but wallet-level signing decisions should remain in wallet app context. Avoid building fake in-app “confirm” screens that look like signing prompts.\n\n**Session keys und scoped auth** improve UX by reducing repetitive approvals. However, scope must be tightly constrained (allowed methods, time window, limits). Session credentials should be revocable und auditable.\n\n**Offline und poor-network behavior** must be handled intentionally:\n\n- Queue non-critical reads.\n- Retry idempotent submissions mit backoff.\n- Distinguish “signed but not submitted” from “submitted but unconfirmed.”\n\n**Push notifications** are valuable fuer transaktion outcomes, liquidation alerts, und governance events. Notifications should include enough context fuer user safety but never leak sensitive data.\n\nUX patterns that consistently improve conversion:\n\n- Show transaktion simulation summaries before wallet handoff.\n- Display clear statuses: building, awaiting signature, submitted, confirmed.\n- Provide explorer links und retry actions.\n- Use plain-language error messages mit suggested fixes.\n\nSicherheit hygiene:\n\n- Pin trusted RPC endpoints or use reputable providers mit fallback.\n- Validate konto ownership und expected program IDs on all client-side decoded data.\n- Protect analytics pipelines from sensitive payload leakage.\n\nAccessibility und internationalization matter fuer global adoption. Ensure touch targets, contrast, und localization of risk messages are adequate. Fuer crypto workflows, misunderstanding can cause irreversible loss.\n\nFinally, measure reality: connect success rate, signature approval rate, drop-off after wallet switch, und average time-to-confirmation. Mobile teams that instrument these metrics can iteratively remove friction und increase trust.\n\nGreat Solana mobile apps feel predictable under stress. If users always understand what they are signing, what state they are in, und how to recover, your product is operating at production quality.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-testing": {
    "title": "Tests Solana Programs",
    "description": "Build robust Solana tests systems across local, simulated, und network environments mit explicit sicherheit invariants und release-quality confidence gates.",
    "duration": "6 hours",
    "tags": [
      "testing",
      "bankrun",
      "anchor",
      "devnet"
    ],
    "modules": {
      "module-testing-foundations": {
        "title": "Tests Foundations",
        "description": "Core test strategy across unit/integration layers mit deterministic workflows und adversarial case coverage.",
        "lessons": {
          "testing-approaches": {
            "title": "Tests Approaches",
            "content": "# Tests Approaches\n\nTests Solana programs requires multiple layers because failures can occur in logic, konto validation, transaktion composition, or network behavior. A production tests strategy usually combines unit tests, integration tests, und end-to-end validation across local validatoren und devnet.\n\n**Unit tests** validate isolated business logic mit minimal runtime overhead. In Rust, pure helper functions (math, state transitions, invariant checks) should be unit-tested aggressively because they are easy to execute und fast in CI.\n\n**Integration tests** execute against realistic program invocation paths. Fuer Anchor projects, this often means `anchor test` mit local validator setup, konto initialization flows, und anweisung-level assertions. Integration tests should cover both positive und adversarial inputs, including invalid konten, unauthorized signers, und boundary values.\n\n**End-to-end tests** include frontend/client composition plus wallet und RPC interactions. They catch issues that lower layers miss: incorrect konto ordering, wrong PDA derivations in client code, und serialization mismatches.\n\nCommon tools:\n\n- `solana-program-test` fuer Rust-side tests mit in-process banks simulation.\n- `solana-bankrun` fuer deterministic TypeScript integration tests.\n- Anchor TypeScript client fuer anweisung building und assertions.\n- Playwright/Cypress fuer app-level transaktion flow tests.\n\nTest coverage priorities:\n\n1. Authorization und signer checks.\n2. Konto ownership und PDA seed constraints.\n3. Arithmetic boundaries und fee logic.\n4. CPI behavior und failure rollback.\n5. Upgrade compatibility und migration paths.\n\nA frequent anti-pattern is only tests happy paths mit one wallet und static inputs. This misses most exploit classes. Robust suites include malicious konto substitution, stale or duplicated konten, und partial failure simulation.\n\nIn CI, separate fast deterministic suites from slower network-dependent suites. Run deterministic tests on every push, und run heavier devnet suites on merge or release.\n\nEffective Solana tests is about confidence under adversarial conditions, not just green checkmarks. If your tests model attacker behavior und konto-level edge cases, you will prevent the majority of production incidents before bereitstellung.\n\n## Praktisch suite design rule\n\nMap every critical anweisung to at least one test in each layer:\n- unit test fuer pure invariant/math logic\n- integration test fuer konto validation und state transitions\n- environment test fuer wallet/RPC orchestration\n\nIf one layer is missing, incidents usually appear in that blind spot first.",
            "duration": "35 min"
          },
          "bankrun-testing": {
            "title": "Bankrun Tests",
            "content": "# Bankrun Tests\n\nSolana Bankrun provides deterministic, high-speed test execution fuer Solana programs from TypeScript environments. It emulates a local bank-like runtime where transaktionen can be processed predictably, konten can be inspected directly, und temporal state can be manipulated fuer tests scenarios like vesting unlocks or oracle staleness.\n\nCompared mit relying on external devnet, Bankrun gives repeatability. This is crucial fuer CI pipelines where flaky network behavior can mask regressions.\n\nTypical Bankrun workflow:\n\n1. Start test context mit target program loaded.\n2. Create keypairs und funded test konten.\n3. Build und process transaktionen via BanksClient-like API.\n4. Assert post-transaktion konto state.\n5. Advance slots/time fuer time-dependent logic tests.\n\nConceptual setup:\n\n```typescript\n// pseudocode\nconst context = await startBankrun({ programs: [...] });\nconst client = context.banksClient;\n\n// process tx and inspect accounts deterministically\n```\n\nWhy Bankrun is powerful:\n\n- Fast iteration fuer protocol teams.\n- Deterministic block/slot control.\n- Rich konto inspection without explorer dependency.\n- Easy simulation of multi-step protocol flows.\n\nHigh-value Bankrun test scenarios:\n\n- Liquidation eligibility after oracle/time movement.\n- Vesting und cliff unlock schedule transitions.\n- Fee accumulator updates across many operations.\n- CPI behavior mit mocked downstream konto states.\n\nCommon mistakes:\n\n- Asserting only transaktion success without state validation.\n- Ignoring rent und konto lamport changes.\n- Not tests replay/idempotency behaviors.\n\nUse helper factories fuer test konten und PDA derivations so tests remain concise. Keep transaktion builders in reusable utilities to avoid drift between test und production clients.\n\nBankrun is not a replacement fuer all environments, but it is one of the best layers fuer deterministic integration confidence on Solana. Teams that invest in comprehensive Bankrun suites tend to catch state-machine bugs significantly earlier than teams relying only on devnet smoke tests.",
            "duration": "35 min"
          },
          "write-bankrun-test": {
            "title": "Write a Counter Program Bankrun Test",
            "content": "# Write a Counter Program Bankrun Test\n\nImplement a helper that returns the expected counter value after a sequence of increment operations. This mirrors a deterministic assertion you would use in a Bankrun test.\n\nReturn the final numeric value as a string.",
            "duration": "50 min",
            "hints": [
              "Use Array.reduce to sum increments.",
              "Start reduce mit the initial value.",
              "Convert final number to string before returning."
            ]
          }
        }
      },
      "module-advanced-testing": {
        "title": "Fortgeschritten Tests",
        "description": "Fuzzing, devnet validation, und CI/CD release controls fuer safer protocol changes.",
        "lessons": {
          "fuzzing-trident": {
            "title": "Fuzzing mit Trident",
            "content": "# Fuzzing mit Trident\n\nFuzzing explores large input spaces automatically to find bugs that handcrafted tests miss. Fuer Solana und Anchor programs, Trident-style fuzzing workflows generate randomized anweisung sequences und parameter values, then check invariants such as “total supply never decreases incorrectly” or “vault liabilities never exceed assets.”\n\nUnlike unit tests that validate expected examples, fuzzing asks: what if inputs are weird, extreme, or adversarial in combinations we did not think about?\n\nCore fuzzing components:\n\n- **Generators** fuer anweisung inputs und konto states.\n- **Harness** that executes generated transaktionen.\n- **Invariants** that must always hold.\n- **Shrinking** to minimize failing inputs fuer debugging.\n\nUseful invariants in DeFi protocols:\n\n- Conservation of value across transfers und burns.\n- Non-negative balances und debt states.\n- Authority invariants (only valid signer modifies privileged state).\n- Price und collateral constraints under liquidation logic.\n\nFuzzing strategy tips:\n\n- Start mit a small anweisung set und one invariant.\n- Add stateful multi-step scenarios (deposit->borrow->repay->withdraw).\n- Include random konto ordering und malicious konto substitution cases.\n- Track coverage to avoid blind spots.\n\nCoverage analysis matters: if fuzzing never reaches critical branches (error paths, CPI failure handlers, liquidation branches), it gives false confidence. Integrate branch coverage tools where possible.\n\nTrident und similar fuzzers are especially good at discovering arithmetic edge cases, stale state assumptions, und unexpected state transitions from unusual call sequences.\n\nCI integration approach:\n\n- Run short fuzz campaigns on every PR.\n- Run longer campaigns nightly.\n- Persist failing seeds as regression tests.\n\nFuzzing should complement, not replace, deterministic tests. Deterministic suites provide explicit behavior guarantees; fuzzing provides adversarial exploration at scale.\n\nFuer serious Solana protocols handling user funds, fuzzing is no longer optional. It is one of the highest-leverage investments fuer preventing unknown-unknown bugs before mainnet exposure.",
            "duration": "35 min"
          },
          "devnet-testing": {
            "title": "Devnet Tests",
            "content": "# Devnet Tests\n\nDevnet tests bridges the gap between deterministic local tests und real-world network conditions. While local validatoren und Bankrun are ideal fuer speed und reproducibility, devnet reveals behavior under real RPC latency, block production timing, fee markets, und konto history constraints.\n\nA robust devnet test strategy includes:\n\n- Automated program bereitstellung to a dedicated devnet keypair.\n- Deterministic fixture creation (airdrop, mint setup, PDAs).\n- Smoke tests fuer critical anweisung paths.\n- Monitoring of transaktion confirmation und log outputs.\n\nImportant devnet caveats:\n\n- State is shared und can be noisy.\n- Airdrop limits can throttle tests.\n- RPC providers may differ in reliability und rate limits.\n\nTo reduce flakiness:\n\n- Use dedicated namespaces/seeds per CI run.\n- Add retries fuer transient network failures.\n- Bound test runtime und fail mit actionable logs.\n\nProgram upgrade tests is particularly important on devnet. Validate that new binaries preserve konto compatibility und migrations execute as expected. Incompatible changes can brick existing konten if not tested.\n\nChecklist fuer release-candidate validation:\n\n1. Deploy upgraded program binary.\n2. Run migration anweisungen.\n3. Execute backward-compatibility read paths.\n4. Execute all critical write anweisungen.\n5. Verify event/log schema expected by indexers.\n\nFuer financial protocols, include oracle integration tests und liquidation path checks against live-like feeds if possible.\n\nDevnet should not be your only quality gate, but it is the best pre-mainnet signal fuer environment-related issues. Teams that ship without meaningful devnet validation often discover RPC edge cases und timing bugs in production.\n\nTreat devnet as a staging environment mit disciplined test orchestration, clear observability, und explicit rollback plans.",
            "duration": "35 min"
          },
          "ci-cd-pipeline": {
            "title": "CI/CD Pipeline fuer Solana",
            "content": "# CI/CD Pipeline fuer Solana\n\nA mature Solana CI/CD pipeline enforces quality gates across code, tests, sicherheit checks, und bereitstellung workflows. Fuer program teams, CI is not just linting Rust und TypeScript; it is about protecting on-chain invariants before irreversible releases.\n\nRecommended pipeline stages:\n\n1. **Static checks**: formatting, lint, type checks.\n2. **Unit/integration tests**: deterministic local execution.\n3. **Sicherheit checks**: dependency scan, optional static analyzers.\n4. **Build artifacts**: reproducible program binaries.\n5. **Staging deploy**: optional devnet bereitstellung und smoke tests.\n6. **Manual approval** fuer production deploy.\n\nGitHub Actions is a common choice. A typical workflow matrix runs Rust und Node tasks in parallel to reduce cycle time. Cache Cargo und pnpm dependencies aggressively.\n\nExample conceptual workflow snippets:\n\n```yaml\n- run: cargo test --workspace\n- run: pnpm lint && pnpm typecheck && pnpm test\n- run: anchor build\n- run: anchor test --skip-local-validator\n```\n\nFuer deployments:\n\n- Store deploy keypairs in secure secrets management.\n- Restrict deploy jobs to protected branches/tags.\n- Emit program IDs und transaktion signatures as artifacts.\n\nProgram verification is critical. Where possible, verify deployed binary matches source-controlled build output. This strengthens trust und simplifies audits.\n\nOperational safety practices:\n\n- Use feature flags fuer high-risk logic activation.\n- Keep rollback strategy documented.\n- Monitor post-deploy metrics (error rates, failed tx ratio, latency).\n\nInclude regression tests fuer previously discovered bugs. Every production incident should produce a permanent automated test.\n\nA strong CI/CD pipeline is an engineering control, not a convenience. It reduces release risk, accelerates safe iteration, und provides confidence that code changes preserve sicherheit und protocol correctness under production conditions.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-indexing": {
    "title": "Solana Indexing & Analytics",
    "description": "Build a production-grade Solana event indexer mit deterministic decoding, resilient ingestion contracts, checkpoint recovery, und analytics outputs teams can trust.",
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
        "description": "Events model, token decoding, und transaktion parsing fundamentals mit schema discipline und deterministic normalization.",
        "lessons": {
          "indexing-v2-events-model": {
            "title": "Events model: transaktionen, logs, und program anweisungen",
            "content": "# Events model: transaktionen, logs, und program anweisungen\n\nIndexing Solana starts mit understanding where data lives und how to extract structured events from raw chain data. Unlike EVM chains where events are explicit log topics, Solana encodes program state changes in konto updates und program logs. Your indexer must parse these sources und transform them into a queryable event stream.\n\nA transaktion on Solana contains one or more anweisungen. Each anweisung targets a program, includes konto metas, und carries opaque anweisung data. When executed, programs emit log entries via solana_program::msg or similar macros. These logs, combined mit pre/post konto states, form the raw material fuer event indexing.\n\nThe indexer pipeline typically follows: fetch → parse → normalize → store. Fetch retrieves transaktion metadata via RPC or geyser plugins. Parse extracts program logs und konto diffs. Normalize converts raw data into domain-specific events mit stable schemas. Store persists events mit appropriate indexing fuer queries.\n\nKey concepts fuer normalization: anweisung program IDs identify which decoder to apply, konto ownership determines data layout, und log prefixes often indicate event types (e.g., \"Transfer\", \"Mint\", \"Burn\"). Your indexer must handle multiple program versions gracefully, maintaining backward compatibility as anweisung layouts evolve.\n\nIdempotency is critical. Block reorganizations are rare on Solana but possible during forks. Your indexing pipeline should handle replayed transaktionen without duplicating events. This typically means using transaktion signatures as unique keys und implementing upsert semantics in the storage layer.\n\n## Operator mentales modell\n\nTreat your indexer as a data product mit explicit contracts:\n1. ingest contract (what raw inputs are accepted),\n2. normalization contract (stable event schema),\n3. serving contract (what query consumers can rely on).\n\nWhen these contracts are versioned und documented, protocol upgrades become manageable instead of breaking downstream analytics unexpectedly.\n\n## Checklist\n- Understand transaktion → anweisungen → logs hierarchy\n- Identify program IDs und konto ownership fuer data layout selection\n- Normalize raw logs into domain events mit stable schemas\n- Implement idempotent ingestion using transaktion signatures\n- Plan fuer program version evolution in decoders\n\n## Red flags\n- Parsing logs without validating program IDs\n- Assuming fixed konto ordering across program versions\n- Missing idempotency leading to duplicate events\n- Storing raw data without normalized event extraction\n",
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
                      "Program logs und konto state changes",
                      "Explicit event topics like EVM",
                      "Validator consensus messages"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana programs emit events via logs und state changes, not explicit event topics."
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
                    "explanation": "Idempotent ingestion ensures the same transaktion processed twice creates only one event."
                  }
                ]
              }
            ]
          },
          "indexing-v2-token-decoding": {
            "title": "Token konto decoding und SPL layout",
            "content": "# Token konto decoding und SPL layout\n\nSPL Token konten follow a standardized binary layout that indexers must parse to track balances und mint operations. Understanding this layout enables you to extract meaningful data from raw konto bytes without relying on external APIs.\n\nA token konto contains: mint address (32 bytes), owner address (32 bytes), amount (8 bytes u64), delegate (32 bytes, optional), state (1 byte), is_native (1 byte + 8 bytes if native), delegated_amount (8 bytes), und close_authority (36 bytes optional). The total size is typically 165 bytes fuer standard konten.\n\nKonto discriminators help identify konto types. SPL Token konten are owned by the Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) or Token-2022. Your indexer should verify ownership before attempting to parse, as malicious konten could mimic data layouts.\n\nDecoding involves: read the 32-byte mint, verify it matches expected token, read the 64-bit amount (little-endian), convert to decimal representation using mint decimals, und track owner fuer balance aggregation. Always handle malformed data gracefully - truncated konten or unexpected sizes should not crash the indexer.\n\nFuer balance diffs, compare pre-transaktion und post-transaktion states. A transfer emits no explicit event but changes two konto amounts. Your indexer must detect these changes by comparing states before und after anweisung execution.\n\n## Checklist\n- Verify token program ownership before parsing\n- Decode mint, owner, und amount fields correctly\n- Handle little-endian u64 conversion properly\n- Support both Token und Token-2022 programs\n- Implement graceful handling fuer malformed konten\n\n## Red flags\n- Parsing without ownership verification\n- Ignoring mint decimals in amount conversion\n- Assuming fixed konto sizes without bounds checking\n- Missing balance diff detection fuer transfers\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexing-v2-l2-token-explorer",
                "title": "Token Konto Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "SPL Token Konto",
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
                    "prompt": "What is the standard size of an SPL Token konto?",
                    "options": [
                      "165 bytes",
                      "64 bytes",
                      "256 bytes"
                    ],
                    "answerIndex": 0,
                    "explanation": "Standard SPL Token konten are 165 bytes, containing mint, owner, amount, und optional fields."
                  },
                  {
                    "id": "indexing-v2-l2-q2",
                    "prompt": "How should amount be interpreted from token konto data?",
                    "options": [
                      "As little-endian u64, then divided by 10^decimals",
                      "As big-endian u32 directly",
                      "As ASCII string"
                    ],
                    "answerIndex": 0,
                    "explanation": "Amounts are stored as little-endian u64 und must be converted using the mint's decimal places."
                  }
                ]
              }
            ]
          },
          "indexing-v2-decode-token-account": {
            "title": "Challenge: Decode token konto + diff token balances",
            "content": "# Challenge: Decode token konto + diff token balances\n\nImplement deterministic token konto decoding und balance diffing:\n\n- Parse a 165-byte SPL Token konto layout\n- Extract mint, owner, und amount fields\n- Compute balance differences between pre/post states\n- Return normalized event objects mit stable ordering\n\nYour solution will be validated against multiple test cases mit various token konto states.",
            "duration": "45 min",
            "hints": [
              "SPL Token konto layout: mint (32B), owner (32B), amount (8B LE u64)",
              "Use little-endian byte order fuer the amount field",
              "Convert bytes to base58 fuer Solana addresses"
            ]
          },
          "indexing-v2-transaction-meta": {
            "title": "Transaktion meta parsing: logs, errors, und inner anweisungen",
            "content": "# Transaktion meta parsing: logs, errors, und inner anweisungen\n\nTransaktion metadata provides the context needed to index complex operations. Understanding how to parse logs, handle errors, und traverse inner anweisungen enables comprehensive event extraction.\n\nProgram logs follow a hierarchical structure. The outermost logs show anweisung execution order, while inner logs reveal CPI calls. Each log line typically includes a prefix indicating severity or type: \"Program\", \"Invoke\", \"Success\", \"Fail\", or custom program messages. Your parser should handle nested invocation levels correctly.\n\nError handling distinguishes between transaktion-level failures und anweisung-level failures. A transaktion may succeed overall while individual anweisungen fail (und are rolled back). Conversely, a single failing anweisung can cause the entire transaktion to fail. Indexers should record these distinctions fuer accurate analytics.\n\nInner anweisungen reveal the complete execution trace. When a program makes CPI calls, these appear as inner anweisungen in transaktion metadata. Indexers must traverse both top-level und inner anweisungen to capture all state changes. This is especially important fuer protocols like Jupiter that route through multiple DEXs.\n\nLog filtering improves efficiency. Rather than parsing all logs, indexers can filter by program ID prefixes or known event signatures. However, be cautious - aggressive filtering might miss important events during protocol upgrades or edge cases.\n\n## Checklist\n- Parse program logs mit proper nesting level tracking\n- Distinguish transaktion-level from anweisung-level errors\n- Traverse inner anweisungen fuer complete CPI traces\n- Implement efficient log filtering by program ID\n- Handle both success und failure scenarios\n\n## Red flags\n- Ignoring inner anweisungen und missing CPI events\n- Treating all log failures as transaktion failures\n- Parsing without log level/depth context\n- Missing error context in indexed events\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "indexing-v2-l4-logs",
                "title": "Log Structure Example",
                "steps": [
                  {
                    "cmd": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
                    "output": "Program log: Anweisung: Transfer",
                    "note": "Top-level anweisung at depth 1"
                  },
                  {
                    "cmd": "Program 11111111111111111111111111111111 invoke [2]",
                    "output": "Program log: Create konto",
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
        "description": "Build end-to-end indexer pipeline behavior: idempotent ingestion, checkpoint recovery, und analytics aggregation at production scale.",
        "lessons": {
          "indexing-v2-index-transactions": {
            "title": "Challenge: Index transaktionen to normalized events",
            "content": "# Challenge: Index transaktionen to normalized events\n\nImplement a transaktion indexer that produces normalized Event objects:\n\n- Parse anweisung logs und identify event types\n- Extract transfer events mit from/to/amount/mint\n- Handle multiple events per transaktion\n- Return stable, canonical JSON mit sorted keys\n- Support idempotency via transaktion signature deduplication",
            "duration": "50 min",
            "hints": [
              "Parse log entries to identify event types",
              "Extract fields using regex patterns",
              "Include transaktion signature fuer traceability",
              "Sort events by index fuer deterministic output"
            ]
          },
          "indexing-v2-pagination-caching": {
            "title": "Pagination, checkpointing, und caching semantics",
            "content": "# Pagination, checkpointing, und caching semantics\n\nProduction indexers must handle large datasets efficiently while maintaining consistency. Pagination, checkpointing, und caching form the backbone of scalable indexing infrastructure.\n\nPagination strategies depend on query patterns. Cursor-based pagination using transaktion signatures provides stable ordering even during concurrent writes. Offset-based pagination can miss or duplicate entries during high-write periods. Fuer time-series data, consider partitioning by slot or block time.\n\nCheckpointing enables recovery from failures. Indexers should periodically save their processing position (last processed slot/signature) to durable storage. On restart, resume from the checkpoint rather than re-indexing from genesis. This pattern is essential fuer long-running indexers handling months of chain history.\n\nCaching reduces redundant RPC calls. Konto metadata, program IDs, und decoded anweisung layouts can be cached mit appropriate TTLs. However, cache invalidation is critical - stale cache entries can lead to incorrect decoding or missed events. Consider using slot-based versioning fuer cache entries.\n\nIdempotent writes prevent data corruption. Even mit checkpointing, duplicate processing can occur during retries. Use transaktion signatures as unique identifiers und implement upsert semantics. Database constraints or unique indexes should enforce this at the storage layer.\n\n## Checklist\n- Implement cursor-based pagination fuer stable ordering\n- Save periodic checkpoints fuer failure recovery\n- Cache konto metadata mit slot-based invalidation\n- Enforce idempotent writes via unique constraints\n- Handle backfills without duplicating events\n\n## Red flags\n- Using offset pagination fuer high-write datasets\n- Missing checkpointing requiring full re-index on restart\n- Caching without proper invalidation strategies\n- Allowing duplicate events from retry logic\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexing-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l6-q1",
                    "prompt": "Why is cursor-based pagination preferred fuer indexing?",
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
            "content": "# Analytics aggregation: per wallet, per token metrics\n\nRaw event data becomes valuable through aggregation. Building analytics pipelines enables insights into user behavior, token flows, und protocol usage patterns.\n\nPer-wallet analytics track individual user activity. Key metrics include: transaktion count, unique tokens held, total volume transferred, first/last activity timestamps, und interaction patterns mit specific programs. These metrics power user segmentation und engagement analysis.\n\nPer-token analytics track asset-level metrics. Important aggregations include: total transfer volume, unique holders, holder distribution (whales vs retail), velocity (average time between transfers), und cross-program usage. These inform tokenomics analysis und market research.\n\nTime-windowed aggregations support trend analysis. Daily, weekly, und monthly rollups enable comparison across time periods. Consider using tumbling windows fuer fixed periods or sliding windows fuer moving averages. Materialized views can pre-compute common aggregations fuer query leistung.\n\nNormalization ensures consistent comparisons. Convert all amounts to human-readable decimals, normalize timestamps to UTC, und use consistent address formatting (base58). Deduplicate events from failed transaktionen that may still appear in logs.\n\n## Checklist\n- Aggregate per-wallet metrics (volume, token count, activity)\n- Aggregate per-token metrics (holders, velocity, distribution)\n- Implement time-windowed rollups fuer trend analysis\n- Normalize amounts, timestamps, und addresses\n- Exclude failed transaktionen from aggregates\n\n## Red flags\n- Mixing raw und decimal-adjusted amounts\n- Including failed transaktionen in volume metrics\n- Missing time normalization across timezones\n- Storing unbounded raw data without aggregation\n",
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
            "content": "# Checkpoint: Produce stable JSON analytics summary\n\nImplement the final analytics checkpoint that produces a deterministic summary:\n\n- Aggregate events into per-wallet und per-token metrics\n- Generate sorted, stable JSON output\n- Include timestamp und summary statistics\n- Handle edge cases (empty datasets, single events)\n\nThis checkpoint validates your complete indexing pipeline from raw data to analytics.",
            "duration": "50 min",
            "hints": [
              "Aggregate events by wallet address",
              "Sum transaktion counts und volumes",
              "Sort output arrays by address fuer determinism",
              "Include metadata like timestamps"
            ]
          }
        }
      }
    }
  },
  "solana-payments": {
    "title": "Solana Payments & Checkout Flows",
    "description": "Build production-grade Solana payment flows mit robust validation, replay-safe idempotency, secure webhooks, und deterministic receipts fuer reconciliation.",
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
        "description": "Address validation, idempotency strategy, und payment intent design fuer reliable checkout behavior.",
        "lessons": {
          "payments-v2-address-validation": {
            "title": "Address validation und memo strategies",
            "content": "# Address validation und memo strategies\n\nPayment flows on Solana require robust address validation und thoughtful memo strategies. Unlike traditional payment systems mit konto numbers, Solana uses base58-encoded public keys that must be validated before any value transfer.\n\nAddress validation involves three layers: format validation, derivation check, und ownership verification. Format validation ensures the string is valid base58 und decodes to 32 bytes. Derivation check optionally verifies the address is on the Ed25519 curve (fuer wallet addresses) or off-curve (fuer PDAs). Ownership verification confirms the konto exists und is owned by the expected program.\n\nMemos attach metadata to payments. The SPL Memo program enables attaching UTF-8 strings to transaktionen. Common use cases include: order IDs, invoice references, customer identifiers, und compliance data. Memos are not encrypted und are visible on-chain, so never include sensitive information.\n\nMemo best practices: keep under 256 bytes fuer efficiency, use structured formats (JSON) fuer machine parsing, include versioning fuer future compatibility, und hash sensitive identifiers rather than storing them plaintext. Consider using deterministic memo formats that can be regenerated from payment context fuer idempotency checks.\n\nAddress poisoning is an attack vector where attackers create addresses visually similar to legitimate ones. Countermeasures include: displaying addresses mit checksums, using name services (Solana Name Service, Bonfida) where appropriate, und implementing confirmation steps fuer large transfers.\n\n## Merchant-safe memo template\n\nA praktisch memo format is:\n`v1|order:<id>|shop:<merchantId>|nonce:<shortHash>`\n\nThis keeps memos short, parseable, und versioned while avoiding direct storage of sensitive user details.\n\n## Checklist\n- Validate base58 encoding und 32-byte length\n- Distinguish between on-curve und off-curve addresses\n- Verify konto ownership fuer program-specific payments\n- Use SPL Memo program fuer structured metadata\n- Implement address poisoning protections\n\n## Red flags\n- Transferring to unvalidated addresses\n- Storing sensitive data in plaintext memos\n- Skipping ownership checks fuer token konten\n- Trusting visually similar addresses without verification\n",
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
                      "Attach metadata like order IDs to transaktionen",
                      "Encrypt payment amounts",
                      "Replace transaktion signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL Memo allows attaching public metadata to transaktionen fuer reference und tracking."
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
            "title": "Idempotency keys und replay protection",
            "content": "# Idempotency keys und replay protection\n\nPayment systems must handle network failures gracefully. Idempotency ensures that retrying a failed request produces the same outcome as the original, preventing duplicate charges und inconsistent state.\n\nIdempotency keys are unique identifiers generated by clients fuer each payment intent. The server stores processed keys und their outcomes, returning cached results fuer duplicate submissions. Keys should be: globally unique (UUID v4), client-generated, und persisted mit sufficient TTL to handle extended retry windows.\n\nKey generation strategies include: UUID v4 mit timestamp prefix, hash of payment parameters (amount, recipient, timestamp), or structured keys combining merchant ID und local sequence numbers. The key must be stable across retries but unique across distinct payments.\n\nReplay protection prevents malicious or accidental re-execution. Beyond idempotency, transaktionen should include: recent blockhash freshness (prevents old transaktion replay), durable nonce fuer offline signing scenarios, und amount/time bounds where applicable.\n\nError classification affects retry behavior. Network errors warrant retries mit exponential backoff. Validation errors (insufficient funds, invalid address) should fail fast without retry. Timeout errors require careful handling - the payment may have succeeded, so query status before retrying.\n\n## Checklist\n- Generate unique idempotency keys fuer each payment intent\n- Store processed keys mit outcomes fuer deduplication\n- Implement appropriate TTL based on retry windows\n- Use recent blockhash fuer transaktion freshness\n- Classify errors fuer appropriate retry strategies\n\n## Red flags\n- Allowing duplicate payments from retries\n- Generating idempotency keys server-side only\n- Ignoring timeout ambiguity in status checking\n- Storing keys without expiration\n",
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
                    "note": "Create payment intent mit idempotency key"
                  },
                  {
                    "cmd": "POST /v1/payment-intents/pi_123/confirm",
                    "output": "{\"id\":\"pi_123\",\"status\":\"processing\"}",
                    "note": "Confirm triggers transaktion building"
                  },
                  {
                    "cmd": "GET /v1/payment-intents/pi_123",
                    "output": "{\"id\":\"pi_123\",\"status\":\"succeeded\",\"signature\":\"abc123\"}",
                    "note": "Poll fuer final status"
                  }
                ]
              }
            ]
          },
          "payments-v2-payment-intent": {
            "title": "Challenge: Create payment intent mit validation",
            "content": "# Challenge: Create payment intent mit validation\n\nImplement a payment intent creator mit full validation:\n\n- Validate recipient address format (base58, 32 bytes)\n- Validate amount (positive, within limits)\n- Generate deterministic idempotency key\n- Return structured payment intent object\n- Handle edge cases (zero amount, invalid address)\n\nYour implementation will be tested against various valid und invalid inputs.",
            "duration": "45 min",
            "hints": [
              "Use base58 alphabet to validate the recipient address format.",
              "Convert base58 to bytes und check the length equals 32.",
              "Generate an idempotency key if not provided in the input."
            ]
          },
          "payments-v2-tx-building": {
            "title": "Transaktion building und key metadata",
            "content": "# Transaktion building und key metadata\n\nBuilding payment transaktionen requires careful attention to anweisung construction, konto metadata, und program interactions. The goal is creating valid, efficient transaktionen that minimize fees while ensuring correctness.\n\nAnweisung construction follows a pattern: identify the program (System Program fuer SOL transfers, Token Program fuer SPL transfers), prepare konto metas mit correct writable/signer flags, serialize anweisung data according to the program's layout, und compute the transaktion message mit all required fields.\n\nKonto metadata is critical. Fuer SOL transfers, you need: from (signer + writable), to (writable). Fuer SPL transfers: token konto from (signer + writable), token konto to (writable), owner (signer), und potentially a delegate if using delegated transfer. Missing or incorrect flags cause runtime failures.\n\nFee optimization strategies include: batching multiple payments into one transaktion (up to compute unit limits), using address lookup tables (ALTs) fuer konten referenced multiple times, und setting appropriate compute unit limits to avoid overpaying fuer simple operations.\n\nTransaktion validation before submission: verify all required signatures are present, check recent blockhash is fresh, estimate compute units if possible, und validate anweisung data encoding matches the expected layout.\n\n## Checklist\n- Set correct writable/signer flags on all konten\n- Use appropriate program fuer transfer type (SOL vs SPL)\n- Validate anweisung data encoding\n- Include recent blockhash fuer freshness\n- Consider batching fuer multiple payments\n\n## Red flags\n- Missing signer flags on fee payer\n- Incorrect writable flags on recipient konten\n- Using wrong program ID fuer token type\n- Stale blockhash causing transaktion rejection\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "payments-v2-l4-tx-structure",
                "title": "Transaktion Structure",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Transfer Anweisung",
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
        "description": "Transaktion building, webhook authenticity checks, und deterministic receipt generation mit clear error-state handling.",
        "lessons": {
          "payments-v2-transfer-tx": {
            "title": "Challenge: Build transfer transaktion",
            "content": "# Challenge: Build transfer transaktion\n\nImplement a transfer transaktion builder:\n\n- Build SystemProgram.transfer fuer SOL transfers\n- Build TokenProgram.transfer fuer SPL transfers\n- Return anweisung bundle mit correct key metadata\n- Include fee payer und blockhash\n- Support deterministic output fuer tests",
            "duration": "50 min",
            "hints": [
              "SystemProgram.transfer uses anweisung index 2 mit u64 lamports (little-endian).",
              "TokenProgram.transferChecked uses anweisung index 12 mit u64 amount + u8 decimals.",
              "Key order matters: SOL transfer needs [from, to], SPL transfer needs [source, mint, dest, owner]."
            ]
          },
          "payments-v2-webhooks": {
            "title": "Webhook signing und verification",
            "content": "# Webhook signing und verification\n\nWebhooks enable asynchronous payment notifications. Sicherheit requires cryptographic signing so recipients can verify webhook authenticity und detect tampering.\n\nWebhook signing uses HMAC-SHA256 mit a shared secret. The sender computes: signature = HMAC-SHA256(secret, payload). The signature is included in a header (e.g., X-Webhook-Signature). Recipients recompute the HMAC und compare, using constant-time comparison to prevent timing attacks.\n\nPayload canonicalization ensures consistent signing. JSON objects must be serialized mit: sorted keys (alphabetical), no extra whitespace, consistent number formatting, und UTF-8 encoding. Without canonicalization, {\"a\":1,\"b\":2} und {\"b\":2,\"a\":1} produce different signatures.\n\nIdempotency in webhooks prevents duplicate processing. Webhook payloads should include an idempotency key or event ID. Recipients store processed IDs und ignore duplicates. This handles retries from the sender und network-level duplicates.\n\nSicherheit best practices: rotate secrets periodically, use different secrets per environment (dev/staging/prod), include timestamps und reject old webhooks (e.g., >5 minutes), und verify IP allowlists where feasible. Never include sensitive data like private keys or full card numbers in webhooks.\n\n## Checklist\n- Sign webhooks mit HMAC-SHA256 und shared secret\n- Canonicalize JSON payloads mit sorted keys\n- Include event ID fuer idempotency\n- Verify signatures mit constant-time comparison\n- Implement timestamp validation\n\n## Red flags\n- Unsigned webhooks trusting sender IP alone\n- Non-canonical JSON causing verification failures\n- Missing idempotency handling duplicate events\n- Including secrets or sensitive data in payload\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "payments-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "payments-v2-l6-q1",
                    "prompt": "Why is JSON canonicalization important fuer webhooks?",
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
                    "prompt": "What algorithm is standard fuer webhook signing?",
                    "options": [
                      "HMAC-SHA256",
                      "MD5",
                      "RSA-512"
                    ],
                    "answerIndex": 0,
                    "explanation": "HMAC-SHA256 provides strong sicherheit und is widely supported across languages."
                  }
                ]
              }
            ]
          },
          "payments-v2-error-states": {
            "title": "Error state machine und receipt format",
            "content": "# Error state machine und receipt format\n\nPayment flows require well-defined state machines to handle the complexity of asynchronous confirmations, failures, und retries. Clear state transitions und receipt formats ensure reliable payment tracking.\n\nPayment states typically include: pending (intent created, not yet submitted), processing (transaktion submitted, awaiting confirmation), succeeded (transaktion confirmed, payment complete), failed (transaktion failed or rejected), und cancelled (intent explicitly cancelled before submission). Each state has valid transitions und terminal states.\n\nState transition rules: pending can transition to processing, cancelled, or failed; processing can transition to succeeded or failed; succeeded und failed are terminal. Invalid transitions (e.g., succeeded → failed) indicate bugs or data corruption.\n\nReceipt format standardization enables interoperability. A payment receipt should include: payment intent ID, transaktion signature (if submitted), amount und currency, recipient address, timestamp, status, und verification data (e.g., explorer link). Receipts should be JSON mit canonical ordering fuer deterministic hashing.\n\nExplorer links provide transparency. Fuer Solana, construct explorer URLs using: https://explorer.solana.com/tx/{signature}?cluster={network}. Include these in receipts und webhook payloads so users can verify transaktionen independently.\n\n## Checklist\n- Define clear payment states und valid transitions\n- Implement state machine validation\n- Generate standardized receipt JSON\n- Include explorer links fuer verification\n- Handle all terminal states appropriately\n\n## Red flags\n- Ambiguous states without clear definitions\n- Missing terminal state handling\n- Non-deterministic receipt formats\n- No explorer links fuer verification\n",
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
                    "note": "Transaktion submitted, awaiting confirmation"
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
            "title": "Challenge: Verify webhook und produce receipt",
            "content": "# Challenge: Verify webhook und produce receipt\n\nImplement the final payment flow checkpoint:\n\n- Verify signed webhook signature (HMAC-SHA256)\n- Extract payment details from payload\n- Generate standardized receipt JSON\n- Include explorer link und verification data\n- Ensure deterministic, sorted output\n\nThis validates the complete payment flow from intent to receipt.",
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
    "description": "Master compressed NFT engineering on Solana: Merkle commitments, proof systems, collection modeling, und production sicherheit checks.",
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
        "description": "Tree construction, leaf hashing, insertion mechanics, und the on-chain/off-chain commitment model behind compressed assets.",
        "lessons": {
          "cnft-v2-merkle-trees": {
            "title": "Merkle trees fuer state compression",
            "content": "# Merkle trees fuer state compression\n\nCompressed NFTs (cNFTs) on Solana use Merkle trees to dramatically reduce storage costs. Understanding Merkle trees is essential fuer working mit compressed NFTs und building compression-aware applications.\n\nA Merkle tree is a binary hash tree where each leaf node contains a hash of data, und each non-leaf node contains the hash of its children. The root hash commits to the entire tree structure und all leaf data. This structure enables efficient proofs of inclusion without revealing the entire dataset.\n\nTree construction follows a bottom-up approach: hash each data element to create leaves, pair adjacent leaves und hash their concatenation to create parents, und repeat until a single root remains. Fuer odd numbers of nodes, the last node is typically promoted to the next level or paired mit a zero hash depending on the implementation.\n\nSolana's cNFT implementation uses concurrent Merkle trees mit 16-bit depth (max 65,536 leaves). The tree state is stored on-chain as a small konto containing just the root hash und metadata. Actual leaf data (NFT metadata) is stored off-chain, typically via RPC providers or indexers.\n\nKey properties of Merkle trees: any leaf change affects the root, inclusion proofs require only log2(n) hashes, und the root serves as a cryptographic commitment to all data. These properties enable state compression while maintaining verifiability.\n\n## Praktisch cNFT architecture rule\n\nTreat compressed NFT systems as two synchronized layers:\n1. on-chain commitment layer (tree root + update rules),\n2. off-chain data layer (metadata + indexing + proof serving).\n\nIf either layer is weakly validated, ownership und metadata trust can diverge.\n\n## Checklist\n- Understand binary hash tree construction\n- Know how leaf changes propagate to the root\n- Calculate proof size: log2(n) hashes fuer n leaves\n- Recognize depth limits (16-bit = 65,536 max leaves)\n- Understand on-chain vs off-chain data split\n\n## Red flags\n- Treating Merkle roots as data storage (they're commitments)\n- Ignoring depth limits when planning collections\n- Storing sensitive data assuming it's \"hidden\" in the tree\n- Not validating proofs against the current root\n",
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
                      "The entire tree structure und all leaf data",
                      "Only the first und last leaf",
                      "The tree depth only"
                    ],
                    "answerIndex": 0,
                    "explanation": "The root is a cryptographic commitment to all leaves und their positions in the tree."
                  },
                  {
                    "id": "cnft-v2-l1-q2",
                    "prompt": "How many hash siblings are needed to prove inclusion in a tree mit 65,536 leaves?",
                    "options": [
                      "16",
                      "256",
                      "65536"
                    ],
                    "answerIndex": 0,
                    "explanation": "Proof size is log2(65536) = 16, making verification efficient even fuer large collections."
                  }
                ]
              }
            ]
          },
          "cnft-v2-leaf-hashing": {
            "title": "Leaf hashing conventions und metadata",
            "content": "# Leaf hashing conventions und metadata\n\nLeaf hashing determines how NFT metadata is committed to the Merkle tree. Understanding these conventions ensures compatibility mit compression standards und proper proof generation.\n\nLeaf structure fuer cNFTs includes: asset ID (derived from tree address und leaf index), owner public key, delegate (optional), nonce fuer uniqueness, und metadata hash. The exact encoding follows the Metaplex Bubblegum specification, using deterministic serialization fuer consistent hashing.\n\nHashing algorithm uses Keccak-256 fuer Ethereum compatibility, mit domain separation via prefixed constants. The leaf hash is computed as: hash(prefix || asset_data) where prefix prevents collision mit other hash usages. Multiple prefix values exist fuer different operation types (mint, transfer, burn).\n\nMetadata handling stores the full NFT metadata (name, symbol, uri, creators, royalties) off-chain. Only a hash of the metadata is stored in the leaf. This enables large metadata without on-chain storage costs while maintaining integrity via the hash commitment.\n\nCreator verification uses a separate signing process. Creators sign the asset ID to verify authenticity. These signatures are stored alongside proofs but not in the Merkle tree itself, allowing flexible verification without tree updates.\n\n## Checklist\n- Understand leaf structure components\n- Use correct hashing algorithm (Keccak-256)\n- Include proper domain separation prefixes\n- Store metadata off-chain mit hash commitment\n- Handle creator signatures separately from tree\n\n## Red flags\n- Using wrong hashing algorithm\n- Missing domain separation in leaf hashes\n- Storing full metadata on-chain in compressed NFTs\n- Ignoring creator verification requirements\n",
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
            "content": "# Challenge: Implement Merkle tree insert + root updates\n\nBuild a Merkle tree implementation mit insertions:\n\n- Insert leaves und compute new root\n- Update parent hashes up the tree\n- Handle tree growth und depth limits\n- Return deterministic root updates\n\nTest cases will verify correct root evolution after multiple insertions.",
            "duration": "50 min",
            "hints": [
              "Start by validating the leaf index is within bounds.",
              "At each level, find the sibling node (left or right of current).",
              "Hash the current node mit its sibling to get the parent hash.",
              "Traverse up to the root, collecting all updated node hashes.",
              "Use deterministic ordering: left hash comes before right hash."
            ]
          },
          "cnft-v2-proof-generation": {
            "title": "Proof generation und path computation",
            "content": "# Proof generation und path computation\n\nMerkle proofs enable verification of leaf inclusion without accessing the entire tree. Understanding proof generation is essential fuer working mit compressed NFTs und building verification systems.\n\nA Merkle proof consists of: the leaf data (or its hash), a list of sibling hashes (one per level), und the leaf index (determining the path). The verifier recomputes the root by hashing the leaf mit siblings in the correct order, comparing against the expected root.\n\nProof generation requires traversing from leaf to root. At each level, record the sibling hash (the other child of the parent). The leaf index determines whether the current hash goes left or right in each concatenation. Fuer index i at level n, the position is determined by the nth bit of i.\n\nProof verification recomputes the root: start mit the leaf hash, fuer each sibling in the proof list, concatenate current hash mit sibling (order depends on leaf index bit), hash the result, und compare final result mit expected root. Equality proves inclusion.\n\nProof size efficiency: fuer a tree mit n leaves, proofs contain log2(n) hashes. This is dramatically smaller than the full tree (n hashes), enabling scalable verification. A 65,536 leaf tree requires only 16 hashes per proof.\n\n## Checklist\n- Collect sibling hashes at each tree level\n- Use leaf index bits to determine concatenation order\n- Verify proofs by recomputing root hash\n- Handle edge cases (empty tree, single leaf)\n- Optimize proof size fuer network transmission\n\n## Red flags\n- Incorrect concatenation order in verification\n- Using wrong sibling hash at any level\n- Not validating proof length matches tree depth\n- Trusting proofs without root comparison\n",
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
                    "prompt": "How many hashes are in a proof fuer a tree mit 1,024 leaves?",
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
        "title": "Proof System & Sicherheit",
        "description": "Proof generation, verification, collection integrity, und sicherheit hardening against replay und metadata spoofing.",
        "lessons": {
          "cnft-v2-proof-verification": {
            "title": "Challenge: Implement proof generation + verifier",
            "content": "# Challenge: Implement proof generation + verifier\n\nBuild a complete proof system:\n\n- Generate proofs from a Merkle tree und leaf index\n- Verify proofs against a root hash\n- Handle invalid proofs (wrong siblings, wrong index)\n- Return deterministic boolean results\n\nTests will verify both successful proofs und rejection of invalid attempts.",
            "duration": "55 min",
            "hints": [
              "To generate a proof, collect the sibling hash at each level from leaf to root.",
              "The sibling is at index+1 if current is left, index-1 if current is right.",
              "To verify, start mit the leaf hash und combine mit each proof element.",
              "Use the same ordering (left || right) when combining hashes.",
              "The proof is valid if the recomputed root matches the stored root."
            ]
          },
          "cnft-v2-collection-minting": {
            "title": "Collection mints und metadata simulation",
            "content": "# Collection mints und metadata simulation\n\nCompressed NFT collections use a collection mint as the parent NFT, enabling grouping und verification of related assets. Understanding this hierarchy is essential fuer building collection-aware applications.\n\nCollection structure includes: a standard SPL NFT as the collection mint, cNFTs referencing the collection in their metadata, und the Merkle tree containing all cNFT leaves. The collection mint provides on-chain provenance while cNFTs provide scalable asset issuance.\n\nMetadata simulation fuer tests allows development without actual on-chain transaktionen. Simulated metadata includes: name, symbol, uri (typically pointing to off-chain JSON), seller fee basis points (royalties), creators array mit shares, und collection reference. This data structure matches on-chain format fuer seamless migration.\n\nRoyalty enforcement through Metaplex's token metadata standard specifies seller fees as basis points (e.g., 500 = 5%). Creators array defines fee distribution mit verified flags. cNFTs inherit these settings from their metadata, enforced during transfers via the Bubblegum program.\n\nAttacks on compressed NFTs include: invalid proofs (claiming non-existent NFTs), index manipulation (using wrong leaf index), metadata spoofing (fake off-chain data), und collection impersonation (fake collection mints). Mitigations include proof verification, metadata hash validation, und collection mint verification.\n\n## Checklist\n- Understand collection mint hierarchy\n- Simulate metadata fuer tests\n- Implement royalty calculations\n- Verify collection membership\n- Handle metadata hash verification\n\n## Red flags\n- Accepting NFTs without collection verification\n- Ignoring royalty settings in transfers\n- Trusting off-chain metadata without hash validation\n- Not validating proofs fuer ownership claims\n",
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
                    "note": "Parent NFT fuer the collection"
                  },
                  {
                    "cmd": "Merkle Tree",
                    "output": "Contains cNFT leaf hashes",
                    "note": "Scalable storage fuer assets"
                  },
                  {
                    "cmd": "Off-chain Metadata",
                    "output": "IPFS/Arweave JSON files",
                    "note": "Full metadata mit hash commitment"
                  }
                ]
              }
            ]
          },
          "cnft-v2-attack-surface": {
            "title": "Attack surface: invalid proofs und replay",
            "content": "# Attack surface: invalid proofs und replay\n\nCompressed NFTs introduce unique sicherheit considerations. Understanding attack vectors und mitigations is critical fuer building secure compression-aware applications.\n\nInvalid proof attacks attempt to verify non-existent NFTs. An attacker provides a fabricated leaf hash und fake sibling hashes hoping to produce a valid-looking verification. Mitigation: always verify against the current root from a trusted source (RPC, on-chain konto), und validate proof structure (correct depth, valid hash lengths).\n\nIndex manipulation exploits use valid proofs but wrong indices. Since leaf indices determine proof path, changing the index produces a different root computation. Mitigation: bind asset IDs to specific indices und validate index-asset correspondence during verification.\n\nReplay attacks re-use old proofs after tree updates. When leaves are added or modified, the root changes und old proofs become invalid. However, if an application caches roots, it might accept stale proofs. Mitigation: always use current root, implement proof timestamps where applicable.\n\nMetadata attacks substitute fake off-chain data. Since metadata is stored off-chain mit only a hash on-chain, attackers might serve altered metadata files. Mitigation: verify metadata hashes against leaf commitments, use content-addressed storage (IPFS), und validate creator signatures.\n\nCollection spoofing creates fake collections mimicking legitimate ones. Attackers mint similar-looking NFTs mit fake collection references. Mitigation: verify collection mint addresses against known good lists, check collection verification status, und validate authority signatures.\n\n## Checklist\n- Verify proofs against current root\n- Validate leaf index matches asset ID\n- Implement replay protection fuer proofs\n- Hash-verify off-chain metadata\n- Verify collection mint authenticity\n\n## Red flags\n- Accepting cached/stale roots fuer verification\n- Ignoring leaf index validation\n- Trusting off-chain metadata without verification\n- Not checking collection verification status\n",
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
            "content": "# Checkpoint: Simulate mint + verify ownership proof\n\nComplete the compression lab checkpoint:\n\n- Simulate minting a cNFT (insert leaf, update root)\n- Generate ownership proof fuer the minted NFT\n- Verify the proof against current root\n- Output stable audit trace mit sorted keys\n- Detect und report invalid proof attempts\n\nThis validates your complete Merkle tree implementation fuer compressed NFTs.",
            "duration": "60 min",
            "hints": [
              "Validate the mint request has all required fields (leafIndex, nftId, owner).",
              "Create a deterministic leaf hash by combining nftId und owner.",
              "Insert the leaf by computing hashes up to the root, collecting sibling hashes as proof.",
              "Build an audit trace that documents the operation, inputs, und verification steps.",
              "Include previous und new root hashes in the audit fuer transparency."
            ]
          }
        }
      }
    }
  },
  "solana-governance-multisig": {
    "title": "Governance & Multisig Treasury Ops",
    "description": "Build production-ready DAO governance und multisig treasury systems mit deterministic vote accounting, timelock safety, und secure execution controls.",
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
        "description": "Proposal lifecycle, deterministic voting mechanics, quorum policy, und timelock safety fuer credible DAO governance.",
        "lessons": {
          "governance-v2-dao-model": {
            "title": "DAO model: proposals, voting, und execution",
            "content": "# DAO model: proposals, voting, und execution\n\nDecentralized governance on Solana follows a proposal-based model where token holders vote on changes und the DAO treasury executes approved decisions. Understanding this flow is essential fuer building und participating in on-chain organizations.\n\nThe governance lifecycle has four stages: proposal creation (anyone mit sufficient stake can propose), voting period (token holders vote fuer/against/abstain), queueing (successful proposals enter a timelock), und execution (the proposal's anweisungen are executed). Each stage has specific requirements und time constraints.\n\nProposal creation requires a minimum token deposit to prevent spam. The proposer submits: title, description link, und executable anweisungen (typically base64 serialized). Deposits are returned if the proposal passes, forfeited if it fails (depending on DAO configuration).\n\nVoting power is typically determined by token balance at a specific snapshot block. Some DAOs use vote escrow (veToken) models where locking tokens fuer longer periods multiplies voting power. Quorum requirements ensure sufficient participation - a proposal needs both majority approval und minimum participation to pass.\n\nExecution safety involves timelocks between approval und execution. This delay (often 1-7 days) allows users to exit if they disagree mit the outcome. Emergency powers may exist fuer critical fixes but should require higher thresholds.\n\n## Governance reliability rule\n\nA proposal system is only credible if outcomes are reproducible from public inputs. That means deterministic vote math, explicit snapshot rules, clear timelock transitions, und auditable execution traces fuer treasury effects.\n\n## Checklist\n- Understand the four-stage governance lifecycle\n- Know proposal deposit und spam prevention mechanisms\n- Calculate voting power und quorum requirements\n- Implement timelock safety delays\n- Plan fuer emergency execution paths\n\n## Red flags\n- Allowing proposal creation without deposits\n- Missing quorum requirements fuer participation\n- Zero timelock on sensitive operations\n- Unclear vote counting methodologies\n",
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
                      "Allow users time to exit if they disagree mit outcomes",
                      "Speed up transaktion processing",
                      "Reduce gas costs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Timelocks provide a safety window fuer users to react before changes take effect."
                  },
                  {
                    "id": "governance-v2-l1-q2",
                    "prompt": "What determines voting power in most DAOs?",
                    "options": [
                      "Token balance at snapshot block",
                      "Number of transaktionen submitted",
                      "Konto age"
                    ],
                    "answerIndex": 0,
                    "explanation": "Voting power is typically proportional to token holdings at a specific snapshot time."
                  }
                ]
              }
            ]
          },
          "governance-v2-quorum-math": {
            "title": "Quorum math und vote weight calculation",
            "content": "# Quorum math und vote weight calculation\n\nAccurate vote counting is critical fuer legitimate governance outcomes. Understanding quorum requirements, vote weight calculation, und edge cases ensures fair decision-making.\n\nQuorum defines minimum participation fuer a valid vote. Common formulas include: absolute token amount (e.g., 4% of total supply must vote), relative to circulating supply, or dynamic based on recent participation. Quorum prevents small groups from making unilateral decisions.\n\nVote weight calculation considers: token balance at snapshot block, lockup duration multipliers (veToken model), delegation relationships, und abstention handling. Abstentions typically count toward quorum but not toward approval ratio.\n\nApproval thresholds vary by proposal type. Simple majority (>50%) is standard fuer routine matters. Supermajority (e.g., 2/3) may be required fuer constitutional changes. Some DAOs use quadratic voting to reduce whale influence, though this has sybil resistance challenges.\n\nEdge cases include: ties (usually fail), late vote changes (often blocked after deadline), vote delegation revocation timing, und quorum manipulation (e.g., flash loan attacks prevented by snapshot blocks).\n\n## Checklist\n- Define clear quorum formulas und minimums\n- Calculate vote weights mit snapshot blocks\n- Handle abstentions appropriately\n- Set appropriate approval thresholds by proposal type\n- Protect against manipulation attacks\n\n## Red flags\n- No quorum requirements\n- Vote weight based on current balance (flash loan risk)\n- Unclear tie-breaking rules\n- Changing rules mid-proposal\n",
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
                      "label": "Voter Konto",
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
            "title": "Timelock states und execution scheduling",
            "content": "# Timelock states und execution scheduling\n\nTimelocks provide a critical safety layer between governance approval und execution. Understanding timelock states und transitions ensures reliable proposal execution.\n\nTimelock states include: pending (proposal passed, waiting fuer delay), ready (delay elapsed, can be executed), executed (anweisungen processed), cancelled (withdrawn by proposer or guardian), und expired (execution window passed). Each state has valid transitions und authorized actors.\n\nDelay configuration balances sicherheit mit responsiveness. Too short (hours) allows insufficient reaction time. Too long (weeks) delays urgent fixes. Common ranges are 1-7 days, mit shorter delays fuer routine matters und longer fuer significant changes.\n\nExecution windows prevent indefinite pending states. After the timelock delay, proposals typically have a limited window (e.g., 7-14 days) to be executed. Expired proposals must be re-proposed und re-voted.\n\nCancellations add flexibility. Proposers may withdraw proposals before voting ends. Guardians (if configured) may cancel malicious proposals. Cancellation typically returns deposits unless abuse is detected.\n\n## Checklist\n- Define clear timelock state machine\n- Set appropriate delays by proposal type\n- Implement execution window limits\n- Authorize cancellation actors\n- Handle state transitions atomically\n\n## Red flags\n- No execution window limits\n- Missing cancellation mechanisms\n- State transitions without authorization checks\n- Indefinite pending states\n",
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
                    "output": "Anweisungen processed",
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
              "Sum up weights fuer each vote choice (fuer, against, abstain).",
              "Check if totalVoteWeight >= quorumThreshold to determine quorumMet.",
              "Calculate support percentage as forWeight / (forWeight + againstWeight) when there are non-abstain votes.",
              "Proposal passes only if quorum is met UND support percentage >= supportThreshold."
            ]
          }
        }
      },
      "governance-v2-multisig": {
        "title": "Multisig Treasury",
        "description": "Multisig transaktion construction, approval controls, replay defenses, und secure treasury execution patterns.",
        "lessons": {
          "governance-v2-multisig": {
            "title": "Multisig transaktion building und approvals",
            "content": "# Multisig transaktion building und approvals\n\nMultisig wallets provide collective control over treasury funds. Understanding multisig construction, approval flows, und sicherheit patterns is essential fuer treasury operations.\n\nMultisig structure defines: signers (public keys that can approve), threshold (minimum signatures required), und anweisungen (operations to execute). Common configurations include 2-of-3 (two approvals from three signers), 3-of-5, und custom arrangements.\n\nTransaktion lifecycle: propose (one signer creates transaktion mit anweisungen), approve (other signers review und approve), und execute (once threshold is met, anyone can execute). Each stage is recorded on-chain fuer transparency.\n\nApproval tracking maintains state per signer per transaktion. Signers can approve, reject, or cancel their approval. Double-signing is prevented by tracking which signers have already approved. Rejections may block transaktionen or simply be recorded.\n\nSicherheit considerations: signer key management (hardware wallets recommended), threshold selection (balance sicherheit vs availability), timelocks fuer large transfers, und emergency recovery paths. Lost signer keys should not freeze treasury funds permanently.\n\n## Checklist\n- Define signer set und threshold\n- Track per-signer approval state\n- Enforce threshold before execution\n- Implement approval/revocation mechanics\n- Plan fuer lost key scenarios\n\n## Red flags\n- Single signer controlling treasury\n- No approval tracking on-chain\n- Threshold equal to signer count (no redundancy)\n- Missing rejection/cancellation mechanisms\n",
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
                      "2 signers total mit 3 keys each",
                      "2 minute timeout mit 3 retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "2-of-3 means any 2 of the 3 authorized signers must approve a transaktion."
                  },
                  {
                    "id": "governance-v2-l5-q2",
                    "prompt": "Why track approvals on-chain?",
                    "options": [
                      "Transparency und enforceability",
                      "Faster execution",
                      "Lower fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "On-chain tracking provides transparency und ensures threshold enforcement by the protocol."
                  }
                ]
              }
            ]
          },
          "governance-v2-multisig-builder": {
            "title": "Challenge: Implement multisig tx builder + approval rules",
            "content": "# Challenge: Implement multisig tx builder + approval rules\n\nBuild a multisig transaktion system:\n\n- Create transaktionen mit anweisungen\n- Record signer approvals\n- Enforce threshold requirements\n- Handle approval revocation\n- Generate deterministic transaktion state\n\nTests will verify threshold enforcement und approval tracking.",
            "duration": "55 min",
            "hints": [
              "Initialize signer statuses as 'pending' fuer all signers.",
              "Process actions in order - each action updates the signer's status.",
              "Track the cumulative approved weight to compare against threshold.",
              "A proposal is 'approved' when approvedWeight >= threshold.",
              "A proposal is 'rejected' when no pending signers remain but threshold is not met."
            ]
          },
          "governance-v2-safe-defaults": {
            "title": "Safe defaults: owner checks und replay guards",
            "content": "# Safe defaults: owner checks und replay guards\n\nGovernance und multisig systems require robust sicherheit defaults. Understanding common vulnerabilities und their mitigations protects treasury funds.\n\nOwner checks validate that transaktionen only affect authorized konten. Fuer treasury operations, verify: the treasury konto is owned by the expected program, the signer set matches the multisig configuration, und anweisungen target allowed programs. Missing owner checks enable konto substitution attacks.\n\nReplay guards prevent the same approved transaktion from being executed multiple times. Without replay protection, an observer could resubmit an executed transaktion to drain funds. Guards include: unique transaktion nonces, executed flags in transaktion state, und signature uniqueness checks.\n\nUpgrade safety considers how governance changes affect existing proposals. If the multisig configuration changes, pending proposals should use the old configuration while new proposals use the new one. Atomic configuration changes prevent partial updates.\n\nEmergency stops provide circuit breakers. Guardian roles can pause operations during suspected attacks. Time delays on critical changes allow review periods. These safety valves should be tested regularly.\n\n## Checklist\n- Validate konto ownership before operations\n- Implement replay protection (nonces or flags)\n- Handle configuration changes safely\n- Add emergency pause mechanisms\n- Test sicherheit controls regularly\n\n## Red flags\n- No owner verification on treasury konten\n- Missing replay protection\n- Immediate execution of critical changes\n- No emergency stop capability\n",
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
                      "Re-executing an already-executed transaktion",
                      "Sending duplicate approval requests",
                      "Copying transaktion bytecode"
                    ],
                    "answerIndex": 0,
                    "explanation": "Replay attacks re-submit previously executed transaktionen to drain funds."
                  },
                  {
                    "id": "governance-v2-l7-q2",
                    "prompt": "Why verify konto ownership?",
                    "options": [
                      "Prevent konto substitution attacks",
                      "Reduce transaktion size",
                      "Improve UI rendering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ownership checks ensure operations target legitimate konten, not attacker substitutes."
                  }
                ]
              }
            ]
          },
          "governance-v2-treasury-execution": {
            "title": "Challenge: Execute proposal und produce treasury diff",
            "content": "# Challenge: Execute proposal und produce treasury diff\n\nComplete the governance simulator checkpoint:\n\n- Execute approved proposals mit timelock validation\n- Apply treasury state changes atomically\n- Generate execution trace mit before/after diffs\n- Handle edge cases (expired, cancelled, insufficient funds)\n- Output stable, deterministic audit log\n\nThis validates your complete governance/multisig implementation.",
            "duration": "55 min",
            "hints": [
              "First validate the proposal status is 'approved'.",
              "Check if currentTimestamp - approvedAt >= timelockDuration fuer timelock validation.",
              "Sum all transfer amounts und compare against treasury balance.",
              "Return canExecute: false mit appropriate error if any validation fails.",
              "Generate state changes und execution trace entries fuer each successful step."
            ]
          }
        }
      }
    }
  },
  "solana-performance": {
    "title": "Solana Leistung & Compute Optimization",
    "description": "Master Solana leistung engineering mit measurable optimization workflows: compute budgets, data layouts, encoding efficiency, und deterministic cost modeling.",
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
        "title": "Leistung Foundations",
        "description": "Compute model, konto/data layout decisions, und deterministic cost estimation fuer transaktion-level leistung reasoning.",
        "lessons": {
          "performance-v2-compute-model": {
            "title": "Compute model: budgets, costs, und limits",
            "content": "# Compute model: budgets, costs, und limits\n\nSolana's compute model enforces deterministic execution limits through compute budgets. Understanding this model is essential fuer building efficient programs that stay within limits while maximizing utility.\n\nCompute units (CUs) measure execution cost. Every operation consumes CUs: anweisung execution, syscall usage, memory access, und logging. The default transaktion limit is 200,000 CUs (1.4 million mit prioritization), und each konto has a 10MB max size limit.\n\nCompute budget anweisungen allow transaktionen to request specific limits und set priority fees. The ComputeBudgetProgram provides: setComputeUnitLimit (override default), setComputeUnitPrice (set priority fee per CU in micro-lamports). Priority fees increase transaktion inclusion probability during congestion.\n\nCost categories include: fixed costs (signature verification, konto loading), variable costs (anweisung execution, CPI calls), und memory costs (konto data access size). Understanding these categories helps optimize the right areas.\n\nMetering happens during execution. If a transaktion exceeds its compute budget, execution halts und the transaktion fails mit an error. Failed transaktionen still pay fees fuer consumed CUs, making optimization economically important.\n\n## Praktisch optimization loop\n\nUse a repeatable loop:\n1. profile real CU usage,\n2. identify top cost drivers (data layout, CPI count, logging),\n3. optimize one hotspot,\n4. re-measure und keep only proven wins.\n\nThis avoids leistung folklore und keeps code quality intact.\n\n## Checklist\n- Understand compute unit consumption categories\n- Use ComputeBudgetProgram fuer specific limits\n- Set priority fees during congestion\n- Monitor CU usage during development\n- Handle compute limit failures gracefully\n\n## Red flags\n- Ignoring compute limits in program design\n- Using default limits unnecessarily high\n- Not tests mit realistic data sizes\n- Missing priority fee strategies fuer important transaktionen\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l1-q1",
                    "prompt": "What is the default compute unit limit per transaktion?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "Unlimited"
                    ],
                    "answerIndex": 0,
                    "explanation": "The default limit is 200,000 CUs, extendable to 1.4M mit ComputeBudgetProgram."
                  },
                  {
                    "id": "performance-v2-l1-q2",
                    "prompt": "What happens when a transaktion exceeds its compute budget?",
                    "options": [
                      "Execution halts und the transaktion fails",
                      "It continues mit reduced priority",
                      "The network automatically extends the limit"
                    ],
                    "answerIndex": 0,
                    "explanation": "Exceeding the compute budget causes immediate transaktion failure."
                  }
                ]
              }
            ]
          },
          "performance-v2-account-layout": {
            "title": "Konto layout design und serialization cost",
            "content": "# Konto layout design und serialization cost\n\nKonto data layout significantly impacts compute costs. Well-designed layouts minimize serialization overhead und reduce konto access costs.\n\nSerialization formats affect cost. Borsh is the standard fuer Solana, offering compact binary encoding. Manual serialization can be more efficient fuer simple structures but increases bug risk. Avoid JSON or other text formats on-chain due to size und parsing cost.\n\nKonto size impacts costs linearly. Loading a 10KB konto costs more than loading 1KB. Rent exemption requires more lamports fuer larger konten. Design layouts to minimize size: use fixed-size arrays instead of Vecs where possible, pack booleans into bitflags, und use appropriate integer sizes (u8/u16/u32/u64).\n\nData structure alignment affects both size und access patterns. Group related fields together fuer cache efficiency. Place frequently accessed fields at the beginning of the struct. Consider zero-copy deserialization fuer read-heavy operations.\n\nVersioning enables layout upgrades. Include a version byte at the start of konto data. Migration logic can then handle different versions during deserialization. Plan fuer growth by reserving padding bytes in initial layouts.\n\n## Checklist\n- Use Borsh fuer standard serialization\n- Minimize konto data size\n- Use appropriate integer sizes\n- Plan fuer versioning und upgrades\n- Consider zero-copy fuer read-heavy paths\n\n## Red flags\n- Using JSON fuer on-chain data\n- Oversized Vec collections\n- No versioning fuer upgrade paths\n- Unnecessary large integer types\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "performance-v2-l2-layout",
                "title": "Konto Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Optimized Konto",
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
            "content": "# Challenge: Implement estimateCost(op) model\n\nBuild a compute cost estimation system:\n\n- Model costs fuer different operation types\n- Konto fuer anweisung complexity\n- Include memory access costs\n- Return baseline measurements\n- Handle edge cases (empty operations, large data)\n\nYour estimator will be validated against known operation costs.",
            "duration": "50 min",
            "hints": [
              "Use 5000 as the base compute unit cost per transaktion.",
              "Each konto accessed adds 500 compute units.",
              "Each byte of data adds 10 compute units.",
              "Total = base + (konten × 500) + (bytes × 10)."
            ]
          },
          "performance-v2-instruction-data": {
            "title": "Anweisung data size und encoding optimization",
            "content": "# Anweisung data size und encoding optimization\n\nAnweisung data size directly impacts transaktion cost und throughput. Optimizing encoding reduces fees und increases the operations possible within compute limits.\n\nCompact encoding uses minimal bytes to represent data. Use discriminants (u8) to identify anweisung types. Use variable-length encoding (ULEB128) fuer sizes. Pack multiple boolean flags into a single u8 using bit manipulation. Avoid unnecessary padding.\n\nKonto deduplication reduces transaktion size. If an konto appears in multiple anweisungen, include it once in the konto list und reference by index. This is especially important fuer CPI-heavy transaktionen.\n\nBatching combines multiple operations into one transaktion. Instead of N transaktionen mit 1 anweisung each, use 1 transaktion mit N anweisungen. Batching amortizes signature verification und konto loading costs across operations.\n\nRight-sizing vectors prevents overallocation. Use Vec::with_capacity when the size is known. Avoid unnecessary clones that increase heap usage. Consider stack-allocated arrays fuer small, fixed-size data.\n\n## Checklist\n- Use compact discriminants fuer anweisung types\n- Pack boolean flags into bitfields\n- Deduplicate konten across anweisungen\n- Batch operations when possible\n- Right-size collections to avoid waste\n\n## Red flags\n- Using full u32 fuer small discriminants\n- Separate booleans instead of bitflags\n- Duplicate konten in transaktion lists\n- Unnecessary data cloning\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "performance-v2-l4-encoding",
                "title": "Encoding Example",
                "steps": [
                  {
                    "cmd": "Before optimization",
                    "output": "200 bytes, 5 konten",
                    "note": "Separate bools, duplicate konten"
                  },
                  {
                    "cmd": "After optimization",
                    "output": "120 bytes, 3 konten",
                    "note": "Bitflags, deduplicated konten"
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
        "description": "Layout optimization, compute budget tuning, und before/after leistung analysis mit correctness safeguards.",
        "lessons": {
          "performance-v2-optimized-layout": {
            "title": "Challenge: Implement optimized layout/codec",
            "content": "# Challenge: Implement optimized layout/codec\n\nOptimize an konto data layout while preserving semantics:\n\n- Reduce data size through compact encoding\n- Maintain all original functionality\n- Preserve backward compatibility where possible\n- Pass regression tests\n- Measure und report size reduction\n\nYour optimized layout should be smaller but functionally equivalent.",
            "duration": "55 min",
            "hints": [
              "Sort fields by size (largest first) to minimize padding gaps.",
              "Consider if u64 fields can be reduced to u32 based on maxValue.",
              "Boolean flags can be packed into a single byte as bit flags.",
              "Calculate bytes saved as originalSize - optimizedSize."
            ]
          },
          "performance-v2-compute-budget": {
            "title": "Compute budget anweisung grundlagen",
            "content": "# Compute budget anweisung grundlagen\n\nCompute budget anweisungen give developers control over resource allocation und transaktion prioritization. Understanding these tools enables precise optimization.\n\nsetComputeUnitLimit requests a specific CU budget. The default is 200,000, but you can request up to 1,400,000. Requesting more than needed wastes fees since you pay fuer the limit, not actual usage. Requesting too little causes failures.\n\nsetComputeUnitPrice sets a priority fee in micro-lamports per CU. During congestion, transaktionen mit higher priority fees are more likely to be included. Priority fees are additional to base fees und go to validatoren.\n\nRequesting compute units involves tradeoffs. Higher limits enable more complex operations but cost more. Priority fees increase inclusion probability but raise costs. Profile your transaktionen to set appropriate limits.\n\nHeap size can also be configured. The default heap is 32KB, extendable to 256KB mit compute budget anweisungen. Large heap enables complex data structures but increases CU consumption.\n\n## Checklist\n- Profile transaktionen to determine actual CU usage\n- Set appropriate compute unit limits\n- Use priority fees during congestion\n- Consider heap size fuer data-heavy operations\n- Monitor cost vs inclusion probability tradeoffs\n\n## Red flags\n- Always using maximum compute unit limits\n- Not setting priority fees during congestion\n- Ignoring heap size constraints\n- Not profiling before optimization\n",
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
                      "Set priority fee fuer transaktion inclusion",
                      "Set the maximum transaktion size",
                      "Enable additional program features"
                    ],
                    "answerIndex": 0,
                    "explanation": "Priority fees increase the likelihood of transaktion inclusion during network congestion."
                  },
                  {
                    "id": "performance-v2-l6-q2",
                    "prompt": "Why request specific compute unit limits?",
                    "options": [
                      "Pay only fuer what you need und prevent waste",
                      "Increase transaktion speed",
                      "Enable more konto access"
                    ],
                    "answerIndex": 0,
                    "explanation": "Specific limits optimize costs - you pay fuer the limit requested, not actual usage."
                  }
                ]
              }
            ]
          },
          "performance-v2-micro-optimizations": {
            "title": "Micro-optimizations und tradeoffs",
            "content": "# Micro-optimizations und tradeoffs\n\nLeistung optimization involves balancing competing concerns. Understanding tradeoffs helps make informed decisions about when und what to optimize.\n\nReadability vs leistung is a constant tension. Highly optimized code often sacrifices clarity. Optimize hot paths (frequently executed code) aggressively. Keep cold paths (rarely executed) readable und maintainable.\n\nSpace vs time tradeoffs appear frequently. Pre-computing values trades memory fuer speed. Compressing data trades CPU fuer storage. Choose based on which resource is more constrained fuer your use case.\n\nMaintainability vs optimization matters fuer long-term projects. Aggressive optimizations can introduce bugs und make updates difficult. Document why optimizations exist und measure their impact.\n\nPremature optimization is a common trap. Profile before optimizing to identify actual bottlenecks. Theoretical optimizations may not match real-world behavior. Focus on algorithmic improvements before micro-optimizations.\n\nSicherheit must never be sacrificed fuer leistung. Bounds checking, ownership validation, und arithmetic safety are non-negotiable. Optimize around sicherheit, not through it.\n\n## Checklist\n- Profile before optimizing\n- Focus on hot paths\n- Document optimization decisions\n- Balance readability und leistung\n- Never sacrifice sicherheit fuer speed\n\n## Red flags\n- Optimizing without profiling\n- Sacrificing sicherheit fuer leistung\n- Unreadable code without documentation\n- Optimizing cold paths unnecessarily\n",
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
                      "Optimizing before bereitstellung",
                      "Small leistung improvements"
                    ],
                    "answerIndex": 0,
                    "explanation": "Premature optimization wastes effort on theoretical rather than measured bottlenecks."
                  },
                  {
                    "id": "performance-v2-l7-q2",
                    "prompt": "What should never be sacrificed fuer leistung?",
                    "options": [
                      "Sicherheit",
                      "Code comments",
                      "Variable names"
                    ],
                    "answerIndex": 0,
                    "explanation": "Sicherheit validations must remain regardless of leistung optimizations."
                  }
                ]
              }
            ]
          },
          "performance-v2-perf-checkpoint": {
            "title": "Checkpoint: Compare before/after + output perf report",
            "content": "# Checkpoint: Compare before/after + output perf report\n\nComplete the optimization lab checkpoint:\n\n- Measure baseline leistung metrics\n- Apply optimization techniques\n- Verify correctness is preserved\n- Generate leistung comparison report\n- Output stable JSON mit sorted keys\n\nThis validates your ability to optimize while maintaining correctness.",
            "duration": "55 min",
            "hints": [
              "Compute savings by subtracting 'after' from 'before' metrics.",
              "Use approximate conversion: 1 SOL = $20, 1 SOL = 1,000,000,000 lamports.",
              "Count only optimizations where improved=true fuer totalImprovements.",
              "Include kurs name as 'solana-leistung' und version as 'v2'."
            ]
          }
        }
      }
    }
  },
  "defi-swap-aggregator": {
    "title": "DeFi Swap Aggregation",
    "description": "Master production swap aggregation on Solana: deterministic quote parsing, route optimization tradeoffs, slippage safety, und reliability-aware execution.",
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
        "description": "Token swap mechanics, slippage protection, route composition, und deterministic swap plan construction mit transparent tradeoffs.",
        "lessons": {
          "swap-v2-mental-model": {
            "title": "Swap mentales modell: mints, ATAs, decimals, und routes",
            "content": "# Swap mentales modell: mints, ATAs, decimals, und routes\n\nToken swaps on Solana follow a fundamentally different model than centralized exchanges. Understanding the building blocks — mints, associated token konten (ATAs), decimal precision, und route composition — is essential before writing any swap code.\n\nEvery SPL token on Solana is defined by a mint konto. The mint specifies the token's total supply, decimals (0–9), und authority. When you swap \"SOL fuer USDC,\" you are actually swapping wrapped SOL (mint `So11111111111111111111111111111111111111112`) fuer USDC (mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`). Native SOL must be wrapped into an SPL token before any program can manipulate it as a standard token.\n\nAssociated Token Konten (ATAs) are deterministic addresses derived from a wallet und a mint using the Associated Token Konto program. Fuer every token a wallet holds, there must be an ATA. If the recipient does not have an ATA fuer the output mint, the swap transaktion must include a `createAssociatedTokenAccountIdempotent` anweisung — a common source of transaktion failures when omitted.\n\nDecimal handling is critical. SOL uses 9 decimals (1 SOL = 1,000,000,000 lamports). USDC uses 6 decimals. When displaying \"22.5 USDC,\" the on-chain amount is 22,500,000. Mixing decimals between mints causes catastrophic pricing errors. Always convert human-readable amounts to raw integer amounts early und keep all math in integer space until the final display step.\n\nRoutes are the paths a swap takes through liquidity pools. A direct swap (SOL → USDC in a single pool) is the simplest case. When direct liquidity is insufficient or the price is better through an intermediary, the aggregator splits the swap into multiple \"legs\" — fuer example, SOL → mSOL → USDC. Each leg passes through a different AMM (Automated Market Maker) program like Whirlpool, Raydium, or Orca. The aggregator's job is to find the combination of legs that produces the best output amount after fees.\n\nRoute optimization considers: pool liquidity depth, fee tiers, preiseinfluss per leg, und the total compute cost of including multiple legs in one transaktion. More legs means more anweisungen, more konten, und higher compute unit consumption — there is a praktisch limit to route complexity within Solana's transaktion size und compute budget constraints.\n\n## Execution-quality triangle\n\nEvery route decision balances three competing goals:\n1. better output amount,\n2. lower failure risk (slippage + stale quote exposure),\n3. lower execution overhead (konten + compute + latency).\n\nStrong aggregators make this tradeoff explicit rather than optimizing only a single metric.\n\n## Checklist\n- Identify input und output mints by their full base58 addresses\n- Ensure ATAs exist fuer both input und output tokens before swapping\n- Convert all amounts to raw integer form using the correct decimal places\n- Understand that routes may have multiple legs through different AMM programs\n- Consider compute budget implications of complex routes\n\n## Red flags\n- Mixing decimal scales between different mints\n- Forgetting to create output ATA before the swap anweisung\n- Assuming all swaps are single-hop direct routes\n- Ignoring fees charged by mittelstufe pools in multi-hop routes\n",
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
                      "SPL token programs only operate on token konten, not native SOL",
                      "Wrapping encrypts the SOL fuer privacy",
                      "Native SOL cannot be transferred on Solana"
                    ],
                    "answerIndex": 0,
                    "explanation": "AMM programs interact mit SPL token konten. Native SOL must be wrapped into the SPL token format so it can be processed by swap programs."
                  },
                  {
                    "id": "swap-v2-l1-q2",
                    "prompt": "What happens if the recipient has no ATA fuer the output token?",
                    "options": [
                      "The swap transaktion fails unless the ATA is created in the same transaktion",
                      "Solana automatically creates the ATA",
                      "The tokens are sent to the system program"
                    ],
                    "answerIndex": 0,
                    "explanation": "ATAs must be explicitly created. Including createAssociatedTokenAccountIdempotent in the transaktion handles this safely."
                  }
                ]
              }
            ]
          },
          "swap-v2-slippage": {
            "title": "Slippage und preiseinfluss: protecting swap outcomes",
            "content": "# Slippage und preiseinfluss: protecting swap outcomes\n\nSlippage is the difference between the expected output amount at quote time und the actual amount received at execution time. In volatile markets mit active trading, pool reserves change between when you request a quote und when your transaktion lands on-chain. Slippage protection ensures you never receive less than an acceptable minimum.\n\nPreiseinfluss measures how much your swap moves the pool's price. A small swap in a deep liquidity pool has near-zero preiseinfluss. A large swap in a shallow pool can move the price significantly — you are effectively trading against yourself as each unit you buy makes the next unit more expensive. Preiseinfluss is calculated at quote time und should be displayed to users before they confirm.\n\nThe slippage tolerance is expressed in basis points (bps). 1 bps = 0.01%. A slippage of 50 bps means you accept up to 0.5% less than the quoted output. The minimum output amount is calculated as: minOutAmount = outAmount - (outAmount × slippageBps / 10000). This calculation MUST use integer arithmetic to avoid floating-point rounding errors. Using BigInt in JavaScript ensures exact computation.\n\nSetting slippage too tight (e.g., 1 bps) causes frequent transaktion failures because even minor pool changes exceed the tolerance. Setting it too loose (e.g., 1000 bps = 10%) exposes users to sandwich attacks where a malicious actor front-runs the swap to move the price, then back-runs after execution to profit from the price movement. The optimal range fuer most swaps is 30–100 bps, mit higher values fuer volatile or low-liquidity pairs.\n\nSandwich attacks exploit predictable slippage tolerances. An attacker observes your pending transaktion in the mempool, submits a transaktion to buy the output token (raising its price), lets your swap execute at the worse price, then sells the output token at profit. Tight slippage limits reduce the attacker's profit margin und may cause them to skip your transaktion entirely.\n\nDynamic slippage adjusts the tolerance based on: recent volatility, pool depth, swap size relative to pool reserves, und historical transaktion success rates. Fortgeschritten aggregators compute recommended slippage per-route to balance execution reliability mit protection. When building swap UIs, always show both the quoted output und the minimum guaranteed output so users understand their worst-case outcome.\n\n## Checklist\n- Calculate minOutAmount using integer arithmetic (BigInt)\n- Display both expected und minimum output amounts to users\n- Use 30–100 bps as default slippage fuer most pairs\n- Show preiseinfluss percentage prominently fuer large swaps\n- Consider dynamic slippage based on pool conditions\n\n## Red flags\n- Using floating-point math fuer slippage calculations\n- Setting extremely loose slippage (>500 bps) without user warning\n- Not displaying preiseinfluss fuer large swaps\n- Ignoring sandwich attack vectors in slippage design\n",
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
                      "Solana only accepts BigInt in transaktionen"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts are integers. Floating-point math can produce off-by-one errors that cause transaktion failures or incorrect minimum amounts."
                  }
                ]
              }
            ]
          },
          "swap-v2-route-explorer": {
            "title": "Route visualization: understanding swap legs und fees",
            "content": "# Route visualization: understanding swap legs und fees\n\nSwap routes reveal the path your tokens take through DeFi liquidity. Visualizing routes helps users understand why a multi-hop path might yield more output than a direct swap, und where fees are deducted along the way.\n\nA route consists of one or more legs. Each leg represents a swap through a specific AMM pool. The leg includes: the AMM program label (e.g., \"Whirlpool,\" \"Raydium\"), the input und output mints fuer that leg, the fee charged by the pool (denominated in the output token), und the percentage of the total input allocated to this leg.\n\nSplit routes divide the input amount across multiple paths. Fuer example, 60% might go through Raydium SOL/USDC und 40% through Orca SOL/USDC. Splitting across pools reduces preiseinfluss because each pool handles a smaller portion of the total swap. The aggregator optimizes the split percentages to maximize total output.\n\nFee accounting is per-leg. Each AMM charges a fee (typically 0.01%–1% depending on the pool's fee tier). In concentrated liquidity pools, fee tiers are explicit (e.g., Orca's 1 bps, 4 bps, 30 bps, 100 bps tiers). The total fee across all legs determines the true cost of the route. A route mit lower per-leg fees might still be more expensive if it requires more hops.\n\nWhen rendering route information, show: the overall path (input mint → [mittelstufe mints] → output mint), per-leg details (AMM, fee, percentage), total fees in the output token denomination, preiseinfluss as a percentage, und the final output amounts (quoted und minimum). Color-coding or progress indicators help users quickly understand whether a route is simple (green, single hop) or complex (yellow/orange, multi-hop).\n\nEffective price is calculated as: outputAmount / inputAmount, denominated in output-per-input units. Fuer SOL → USDC, this gives the effective USD price of SOL fuer this specific swap. Comparing the effective price against oracle or market price reveals the total cost of the swap including all fees und preiseinfluss. This \"execution cost\" metric is the most honest summary of swap quality.\n\nRoute caching und expiration matter fuer UX. Quotes from aggregators have a limited validity window (typically 10–30 seconds). If the user takes too long to confirm, the quote expires und the route must be re-fetched. The UI should clearly indicate quote freshness und automatically re-quote when expired. Stale quotes that execute against current pool state will likely fail or produce worse outcomes.\n\n## Checklist\n- Show each leg mit AMM label, mints, fee, und split percentage\n- Display total fees summed across all legs\n- Calculate und display effective price (output/input)\n- Indicate quote expiration time to users\n- Color-code routes by complexity (hops count)\n\n## Red flags\n- Hiding fees from the user display\n- Not showing preiseinfluss fuer large swaps\n- Allowing execution of expired quotes\n- Displaying only the best-case output without minimum\n",
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
                    "note": "Split route reduces preiseinfluss"
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
            "content": "# Challenge: Build a normalized SwapPlan from a quote\n\nParse a raw aggregator quote response und produce a normalized SwapPlan:\n\n- Extract input/output mints und amounts from the quote\n- Calculate minOutAmount using BigInt slippage arithmetic\n- Map each route leg to a normalized structure mit AMM label, mints, fees, und percentage\n- Handle zero slippage correctly (minOut equals outAmount)\n- Ensure all amounts remain as string representations of integers\n\nYour SwapPlan must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Use BigInt arithmetic to avoid floating point errors when computing minOutAmount.",
              "Slippage in basis points: minOut = outAmount - (outAmount * slippageBps / 10000).",
              "Map each routePlan entry to a normalized leg mit index, ammLabel, mints, und fees.",
              "The priceImpactPct comes directly from the quote response."
            ]
          }
        }
      },
      "swap-v2-execution": {
        "title": "Execution & Reliability",
        "description": "State-machine execution, transaktion anatomy, retry/staleness reliability patterns, und high-signal swap run reporting.",
        "lessons": {
          "swap-v2-state-machine": {
            "title": "Challenge: Implement swap UI state machine",
            "content": "# Challenge: Implement swap UI state machine\n\nBuild a deterministic state machine fuer the swap UI flow:\n\n- States: idle → quoting → ready → sending → confirming → success | error\n- Process a sequence of events und track all state transitions\n- Invalid transitions should move to the error state mit a descriptive message\n- The error state supports RESET (back to idle) und RETRY (back to quoting)\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "45 min",
            "hints": [
              "Define a TRANSITIONS map: each key is a state, each value maps event names to next states.",
              "If an event is not valid fuer the current state, transition to 'error' mit a descriptive message.",
              "Track each transition in a history array mit {from, event, to} objects.",
              "The 'error' state supports RESET (back to idle) und RETRY (back to quoting)."
            ]
          },
          "swap-v2-tx-anatomy": {
            "title": "Swap transaktion anatomy: anweisungen, konten, und compute",
            "content": "# Swap transaktion anatomy: anweisungen, konten, und compute\n\nA swap transaktion on Solana is a carefully ordered sequence of anweisungen that together achieve an atomic token exchange. Understanding each anweisung's role, the konto list requirements, und compute budget considerations is essential fuer building reliable swap flows.\n\nThe typical swap transaktion contains these anweisungen in order: (1) Compute Budget: SetComputeUnitLimit und SetComputeUnitPrice to ensure the transaktion has enough compute und appropriate priority. (2) Create ATA (if needed): createAssociatedTokenAccountIdempotent fuer the output token if the user doesn't already have one. (3) Wrap SOL (if input is native SOL): transfer SOL to a temporary WSOL konto und sync its balance. (4) Swap anweisung(s): the actual AMM program calls that execute the swap, referencing all required pool konten. (5) Unwrap WSOL (if output is native SOL): close the temporary WSOL konto und recover SOL.\n\nKonto requirements scale mit route complexity. A single-hop swap through Whirlpool requires approximately 12–15 konten (user wallet, token konten, pool state, oracle, tick arrays, etc.). A multi-hop route through two different AMMs can require 25+ konten, pushing against the transaktion size limit. Address Lookup Tables (ALTs) mitigate this by compressing konto references from 32 bytes to 1 byte each, but require a separate setup transaktion.\n\nCompute budget estimation is critical. A simple SOL → USDC Whirlpool swap uses roughly 80,000–120,000 compute units. Multi-hop routes can use 200,000–400,000+. Setting the compute limit too low causes the transaktion to fail. Setting it too high wastes the user's priority fee budget (priority fee = CU price × CU limit). Aggregators typically provide a recommended compute unit limit per route.\n\nPriority fees determine transaktion ordering. During high-demand periods (popular mints, volatile markets), transaktionen compete fuer block space. The priority fee (in micro-lamports per compute unit) determines where your transaktion lands in the leader's queue. Too low und the transaktion may not be included; too high und the user overpays. Dynamic priority fee estimation uses recent block data to suggest competitive rates.\n\nTransaktion simulation before submission catches many errors: insufficient balance, missing konten, compute budget exceeded, slippage exceeded. Simulating saves the user from paying transaktion fees on doomed transaktionen. The simulation result includes compute units consumed, log messages, und any error codes — all useful fuer debugging.\n\nVersioned transaktionen (v0) are required when using Address Lookup Tables. Legacy transaktionen cannot reference ALTs. Most modern swap aggregators return versioned transaktion messages. Wallets must support versioned transaktion signing (most do, but some older wallet adapters may not).\n\n## Checklist\n- Include compute budget anweisungen at the start of the transaktion\n- Create output ATA if it doesn't exist\n- Handle SOL wrapping/unwrapping fuer native SOL swaps\n- Simulate transaktionen before submission\n- Use versioned transaktionen when ALTs are needed\n\n## Red flags\n- Omitting compute budget anweisungen (uses default 200k limit)\n- Not creating output ATA before the swap anweisung\n- Forgetting to unwrap WSOL after receiving native SOL output\n- Skipping simulation und sending potentially invalid transaktionen\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l6-q1",
                    "prompt": "Why are compute budget anweisungen placed first in a swap transaktion?",
                    "options": [
                      "The runtime reads them before executing other anweisungen to set limits",
                      "They must be first fuer signature verification",
                      "Other anweisungen depend on their output"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compute budget anweisungen configure the transaktion's CU limit und price before any program execution begins."
                  },
                  {
                    "id": "swap-v2-l6-q2",
                    "prompt": "What is the primary benefit of Address Lookup Tables fuer swaps?",
                    "options": [
                      "They compress konto references from 32 bytes to 1 byte, fitting more konten in a transaktion",
                      "They make transaktionen faster to execute",
                      "They reduce the number of required signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "ALTs allow transaktionen to reference many konten without exceeding the 1232-byte transaktion size limit."
                  }
                ]
              }
            ]
          },
          "swap-v2-reliability": {
            "title": "Reliability patterns: retries, stale quotes, und latency",
            "content": "# Reliability patterns: retries, stale quotes, und latency\n\nProduction swap flows must handle the reality of network latency, expired quotes, und transaktion failures. Reliability engineering separates toy swap implementations from production-grade systems that users trust mit real money.\n\nQuote staleness is the primary reliability challenge. An aggregator quote reflects pool state at a specific moment. By the time the user reviews the quote, signs the transaktion, und it lands on-chain, pool reserves may have changed significantly. A quote older than 10–15 seconds should be considered potentially stale. The UI should show a countdown timer und automatically re-quote when the timer expires. Never allow users to send transaktionen based on quotes older than 30 seconds.\n\nRetry strategies must distinguish between retryable und non-retryable failures. Retryable: network timeout, RPC node temporarily unavailable, blockhash expired (re-fetch und re-sign), und rate limiting (429 responses, back off exponentially). Non-retryable: insufficient balance, invalid konto state, slippage exceeded (pool price moved too far, re-quote required), und program errors indicating invalid anweisung data.\n\nExponential backoff mit jitter prevents retry storms. Base delay of 500ms, multiplied by 2 on each retry, mit random jitter of ±25% to prevent synchronized retries from multiple clients. Cap retries at 3–5 attempts. If all retries fail, present a clear error message mit actionable options: \"Quote expired — refresh und try again\" rather than generic \"Transaktion failed.\"\n\nBlockhash management affects reliability. A transaktion's blockhash must be recent (within ~60 seconds / 150 slots). If a transaktion fails und you retry, the blockhash may have expired. The retry flow must: get a fresh blockhash, rebuild the transaktion mit the new blockhash, re-sign, und re-submit. This is why swap transaktion building should be a reusable function that accepts a blockhash parameter.\n\nLatency budgets help set user expectations. Typical Solana transaktion confirmation takes 400ms–2 seconds. However, during congestion, confirmation can take 5–30 seconds or fail entirely. The UI should show progressive states: \"Submitting...\" → \"Confirming...\" mit block confirmations. After 30 seconds without confirmation, offer the user a choice: wait longer, retry, or cancel (note: you cannot cancel a submitted transaktion, but you can stop polling und let the blockhash expire).\n\nTransaktion status polling should use WebSocket subscriptions (signatureSubscribe) fuer real-time confirmation rather than polling getTransaction. Polling creates unnecessary RPC load und introduces latency. Subscribe immediately after sendTransaction returns a signature, und set a timeout fuer maximum wait time.\n\n## Checklist\n- Show quote freshness countdown und auto-refresh\n- Classify errors as retryable vs non-retryable\n- Use exponential backoff mit jitter fuer retries\n- Get fresh blockhash on each retry attempt\n- Use WebSocket subscriptions fuer confirmation\n\n## Red flags\n- Retrying non-retryable errors (wastes time und fees)\n- No retry limit (infinite retry loops)\n- Sending transaktionen mit stale quotes (>30 seconds)\n- Polling getTransaction instead of subscribing\n",
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
                    "note": "Transaktion confirmed after retry"
                  }
                ]
              }
            ]
          },
          "swap-v2-swap-report": {
            "title": "Checkpoint: Generate a SwapRunReport",
            "content": "# Checkpoint: Generate a SwapRunReport\n\nBuild the final swap run report that combines all kurs concepts:\n\n- Summarize the route mit leg details und total fees (using BigInt summation)\n- Compute the effective price as outAmount / inAmount (9 decimal precision)\n- Include the state machine outcome (finalState from the UI flow)\n- Collect all errors from the state result und additional error sources\n- Output must be stable JSON mit deterministic key ordering\n\nThis checkpoint validates your complete understanding of swap aggregation.",
            "duration": "55 min",
            "hints": [
              "Use BigInt to sum fee amounts across all route legs.",
              "Effective price = outAmount / inAmount, formatted to 9 decimal places.",
              "Collect errors from both the state machine result und any additional errors array.",
              "Route summary should include index, ammLabel, pct, und feeAmount per leg."
            ]
          }
        }
      }
    }
  },
  "defi-clmm-liquidity": {
    "title": "CLMM Liquidity Engineering",
    "description": "Master concentrated liquidity engineering on Solana DEXs: tick math, range strategy design, fee/IL dynamics, und deterministic LP position reporting.",
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
        "description": "Concentrated liquidity concepts, tick/price math, und range-position behavior needed to reason about CLMM execution.",
        "lessons": {
          "clmm-v2-vs-cpmm": {
            "title": "CLMM vs constant product: why ticks exist",
            "content": "# CLMM vs constant product: why ticks exist\n\nConcentrated Liquidity Market Makers (CLMMs) represent a fundamental evolution in automated market maker design. To understand why they exist, we must first understand the limitations of the constant product model und then examine how tick-based systems solve those problems on Solana.\n\n## The constant product model und its inefficiency\n\nThe original AMM design, popularized by Uniswap V2 und adopted by Raydium V1 on Solana, uses the constant product invariant: x * y = k, where x und y are the reserves of two tokens und k is a constant. When a trader swaps token A fuer token B, the product must remain unchanged. This creates a smooth price curve that spans the entire range from zero to infinity.\n\nThe problem mit this approach is capital inefficiency. If a SOL/USDC pool holds $10 million in liquidity, und SOL trades between $20 und $30 fuer months, the vast majority of that capital sits idle. Liquidity allocated to price ranges below $1 or above $1000 never participates in trades, earns no fees, yet still dilutes the returns fuer liquidity providers (LPs). In practice, studies show that less than 5% of liquidity in constant product pools is actively used at any given time.\n\n## Concentrated liquidity: the core insight\n\nCLMMs, pioneered by Uniswap V3 und implemented on Solana by Orca Whirlpools, Raydium Concentrated Liquidity, und Meteora DLMM, allow LPs to allocate capital to specific price ranges. Instead of spreading liquidity across all possible prices, an LP can say: \"I want to provide liquidity only between $20 und $30 fuer SOL/USDC.\" This concentrates their capital where trades actually happen, dramatically increasing capital efficiency.\n\nThe capital efficiency gain is substantial. An LP providing concentrated liquidity in a narrow range can achieve the same depth as a constant product LP mit 100x or even 4000x less capital, depending on how tight the range is. This means more fees earned per dollar deployed, which is the fundamental value proposition of CLMMs.\n\n## Why ticks exist\n\nTo implement concentrated liquidity, the price space must be discretized. CLMMs divide the continuous price curve into discrete points called ticks. Each tick represents a specific price, und the relationship between tick index und price follows the formula: price = 1.0001^tick. This means each tick represents a 0.01% (1 basis point) change in price from the adjacent tick.\n\nTicks serve several critical purposes. First, they provide the boundaries fuer liquidity positions. When an LP creates a position from tick -1000 to tick 1000, they are defining a price range. Second, ticks are where liquidity transitions happen. As the price crosses a tick boundary, the active liquidity changes because positions that start or end at that tick become active or inactive. Third, ticks enable efficient fee tracking, because the protocol only needs to track fee growth at tick boundaries rather than at every possible price.\n\nTick spacing is an important optimization. Not every tick is usable in every pool. Pools mit higher fee tiers use wider tick spacing (e.g., 64 or 128 ticks apart) to reduce gas costs und state size. A pool mit tick spacing of 64 means LPs can only place position boundaries at tick indices that are multiples of 64. This tradeoff reduces granularity but improves on-chain efficiency, which is especially important on Solana where konto sizes und compute units matter.\n\n## Solana-specific CLMM considerations\n\nOn Solana, CLMMs face unique architectural challenges. The kontenmodell requires pre-allocated tick arrays that store tick data in contiguous ranges. Orca Whirlpools, fuer example, uses tick array konten that each hold 88 ticks worth of data. The program must load the correct tick array konten as anweisungen, which means swaps that cross many ticks require more konten und more compute units.\n\nThe Solana runtime's 1232-byte transaktion size limit und 200,000 compute unit default also constrain CLMM operations. Large swaps that cross multiple tick boundaries may need to be split across multiple transaktionen, und position management operations must be carefully optimized to fit within these constraints.\n\n## LP decision framework\n\nBefore opening any CLMM position, answer three questions:\n1. What price regime am I targeting (mean-reverting vs trending)?\n2. How actively can I rebalance when out-of-range?\n3. What failure budget can I tolerate fuer fees vs IL vs rebalance costs?\n\nCLMM returns come from strategy discipline, not just math formulas.\n\n## Checklist\n- Understand that x*y=k spreads liquidity across all prices, wasting capital\n- CLMMs let LPs concentrate capital in specific price ranges\n- Ticks discretize the price space at 1 basis point intervals\n- Tick spacing varies by pool fee tier fuer on-chain efficiency\n- Solana CLMMs use tick array konten fuer state management\n\n## Red flags\n- Assuming CLMM positions behave like constant product positions\n- Ignoring tick spacing when placing position boundaries\n- Underestimating compute costs fuer swaps crossing many ticks\n- Forgetting that out-of-range positions earn zero fees\n",
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
                      "Lower transaktion fees fuer traders",
                      "No need fuer oracle price feeds"
                    ],
                    "answerIndex": 0,
                    "explanation": "CLMMs allow LPs to allocate capital to specific price ranges, dramatically improving capital efficiency compared to spreading liquidity across all prices."
                  },
                  {
                    "id": "clmm-v2-l1-q2",
                    "prompt": "Why do CLMMs use ticks to discretize the price space?",
                    "options": [
                      "To define position boundaries und track liquidity transitions efficiently",
                      "To make prices easier fuer humans to read",
                      "To reduce the number of tokens in the pool"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ticks provide discrete price points fuer position boundaries, liquidity transitions, und efficient fee tracking at tick crossings."
                  }
                ]
              }
            ]
          },
          "clmm-v2-price-tick": {
            "title": "Price, tick, und sqrtPrice: core conversions",
            "content": "# Price, tick, und sqrtPrice: core conversions\n\nThe mathematical foundation of every CLMM rests on three interrelated representations of price: the human-readable price, the tick index, und the sqrtPriceX64. Understanding how to convert between these representations is essential fuer building any CLMM integration on Solana.\n\n## Tick to price conversion\n\nThe fundamental relationship between a tick index und price is: price = 1.0001^tick. This formula means that each consecutive tick represents a 0.01% (1 basis point) change in price. Tick 0 corresponds to a price of 1.0. Positive ticks yield prices greater than 1, und negative ticks yield prices less than 1.\n\nFuer example, tick 23027 gives a price of approximately 10.0 (since 1.0001^23027 is roughly 10). Tick -23027 gives approximately 0.1. This logarithmic spacing means ticks provide consistent relative precision across all price levels. Whether the price is 0.001 or 1000, adjacent ticks always differ by 0.01%.\n\nThe inverse conversion from price to tick uses the natural logarithm: tick = ln(price) / ln(1.0001). Since tick indices must be integers, this value is typically rounded to the nearest integer. In practice, you also need to align the tick to the pool's tick spacing, which means rounding down to the nearest multiple of the tick spacing value.\n\n## The sqrtPrice representation\n\nCLMMs do not store price directly on-chain. Instead, they store the square root of the price in a fixed-point format called sqrtPriceX64. This representation has two important advantages.\n\nFirst, using the square root simplifies the core AMM math. The amount of token0 in a position is proportional to (1/sqrtPrice_lower - 1/sqrtPrice_upper), und the amount of token1 is proportional to (sqrtPrice_upper - sqrtPrice_lower). These linear relationships are much easier to compute on-chain than the original price-based formulas would be.\n\nSecond, the X64 fixed-point format (also called Q64.64) provides high precision without floating-point arithmetic. The sqrtPrice is multiplied by 2^64 und stored as a 128-bit unsigned integer. This means sqrtPriceX64 = sqrt(price) * 2^64. Fuer tick 0 (price = 1.0), the sqrtPriceX64 is exactly 2^64 = 18446744073709551616.\n\nOn Solana, Orca Whirlpools stores this value as a u128 in the Whirlpool konto state. Every swap operation updates this value as the price moves. The sqrt_price field is the canonical source of truth fuer the current pool price.\n\n## Decimal handling und token precision\n\nReal-world tokens have different decimal places. SOL has 9 decimals, USDC has 6 decimals. The tick-to-price formula gives a \"raw\" price that must be adjusted fuer decimals. If token0 is SOL (9 decimals) und token1 is USDC (6 decimals), the human-readable price is: display_price = raw_price * 10^(decimals0 - decimals1) = raw_price * 10^(9-6) = raw_price * 1000.\n\nThis decimal adjustment is critical und a common source of bugs. Always track which token is token0 und which is token1 in the pool, und apply the correct decimal scaling when converting between on-chain tick values und display prices.\n\n## Tick spacing und alignment\n\nNot every tick index is a valid position boundary. Each pool has a tick_spacing parameter that determines which ticks can be used. Common values are: 1 (fuer stable pairs mit 0.01% fee), 8 (fuer 0.04% fee pools), 64 (fuer 0.30% fee pools), und 128 (fuer 1.00% fee pools).\n\nTo align a tick to the pool's tick spacing, use: aligned_tick = floor(tick / tick_spacing) * tick_spacing. This always rounds toward negative infinity, ensuring consistent behavior fuer both positive und negative ticks. Fuer example, mit tick spacing 64: tick 100 aligns to 64, tick -100 aligns to -128.\n\n## Precision considerations\n\nFloating-point arithmetic introduces rounding errors in tick/price conversions. When converting price to tick und back, the result may differ by 1 tick due to floating-point precision limits. Fuer on-chain operations, always use the integer tick index as the source of truth und derive the price from it, never the reverse.\n\nThe sqrtPriceX64 computation using BigInt avoids floating-point issues fuer the final representation, but the mittelstufe sqrt und pow operations still use JavaScript's 64-bit floats. Fuer production systems processing large values, consider using dedicated decimal libraries or performing these computations mit higher-precision arithmetic.\n\n## Checklist\n- price = 1.0001^tick fuer tick-to-price conversion\n- tick = round(ln(price) / ln(1.0001)) fuer price-to-tick conversion\n- sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64))\n- Align ticks to tick spacing: floor(tick / spacing) * spacing\n- Adjust fuer token decimals when displaying human-readable prices\n\n## Red flags\n- Ignoring decimal differences between token0 und token1\n- Using floating-point price as source of truth instead of tick index\n- Forgetting tick spacing alignment when creating positions\n- Overflow in sqrtPriceX64 computation fuer extreme tick values\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l2-q1",
                    "prompt": "What is the sqrtPriceX64 value fuer tick 0 (price = 1.0)?",
                    "options": [
                      "2^64 = 18446744073709551616",
                      "1",
                      "2^128"
                    ],
                    "answerIndex": 0,
                    "explanation": "At tick 0, price = 1.0, sqrt(1.0) = 1.0, und sqrtPriceX64 = 1.0 * 2^64 = 18446744073709551616."
                  },
                  {
                    "id": "clmm-v2-l2-q2",
                    "prompt": "Why do CLMMs store sqrtPrice instead of price directly?",
                    "options": [
                      "It simplifies the AMM math — token amounts become linear in sqrtPrice",
                      "It uses less storage space on-chain",
                      "It makes the price harder fuer MEV bots to read"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts in a CLMM position are linear functions of sqrtPrice, making on-chain computation simpler und more gas-efficient."
                  }
                ]
              }
            ]
          },
          "clmm-v2-range-explorer": {
            "title": "Range positions: in-range und out-of-range dynamics",
            "content": "# Range positions: in-range und out-of-range dynamics\n\nA CLMM position is defined by its lower tick und upper tick. These two boundaries determine the price range in which the position is active, earns fees, und holds a mix of both tokens. Understanding in-range und out-of-range behavior is fundamental to managing concentrated liquidity effectively on Solana.\n\n## Anatomy of a range position\n\nWhen an LP creates a position on Orca Whirlpools (or any Solana CLMM), they specify three parameters: the lower tick index, the upper tick index, und the amount of liquidity to provide. The protocol then calculates how much of each token the LP must deposit based on the current price relative to the position's range.\n\nIf the current price is within the range (lower_tick <= current_tick <= upper_tick), the LP deposits both tokens. The ratio depends on where the current price sits within the range. If the price is near the lower bound, the position holds mostly token0. If near the upper bound, it holds mostly token1. This is the direct analog of how a constant product pool holds different ratios at different prices, but concentrated into the LP's chosen range.\n\n## In-range behavior\n\nWhen the current pool price is within a position's range, the position is in-range und actively participates in swaps. Every swap that moves the price within this range uses the position's liquidity und generates fees fuer the LP.\n\nThe fee accrual mechanism works as follows: the pool tracks a global fee_growth value fuer each token. When a swap occurs, the fee (e.g., 0.30% of the swap amount) is distributed proportionally across all in-range liquidity. Each position tracks its own fee_growth snapshot, und uncollected fees are the difference between the current global growth und the position's snapshot, multiplied by the position's liquidity.\n\nIn-range positions experience impermanent loss (IL) as the price moves. When the price moves up, the position converts token0 into token1 (selling token0 at higher prices). When the price moves down, it converts token1 into token0. This rebalancing is the source of IL, und it is more pronounced in CLMMs than in constant product pools because the liquidity is concentrated in a narrower range.\n\n## Out-of-range behavior\n\nWhen the price moves outside a position's range, the position becomes out-of-range. This has critical implications. The position stops earning fees entirely because it no longer participates in swaps. The position holds 100% of one token: if the price moved above the upper tick, the position holds entirely token1 (all token0 was sold as the price rose). If the price moved below the lower tick, the position holds entirely token0 (all token1 was sold as the price fell).\n\nAn out-of-range position is effectively a limit order that has been filled. If you set a range above the current price und the price rises through it, your token0 is converted to token1 at prices within your range. This property makes CLMMs useful fuer implementing range orders und dollar-cost averaging strategies.\n\nOut-of-range positions still exist on-chain und can be closed or modified at any time. The LP can withdraw their single-sided holdings, or they can wait fuer the price to return to their range. If the price returns, the position automatically becomes active again und starts earning fees.\n\n## Position composition at boundaries\n\nAt the exact lower tick, the position holds 100% token0 und 0% token1. At the exact upper tick, it holds 0% token0 und 100% token1. At any price between, the composition is a function of where the current sqrtPrice sits relative to the range boundaries.\n\nThe token amounts are calculated as: amount0 = liquidity * (1/sqrtPrice_current - 1/sqrtPrice_upper) und amount1 = liquidity * (sqrtPrice_current - sqrtPrice_lower). These formulas only apply when the price is in-range. When out-of-range below, amount0 = liquidity * (1/sqrtPrice_lower - 1/sqrtPrice_upper) und amount1 = 0. When out-of-range above, amount0 = 0 und amount1 = liquidity * (sqrtPrice_upper - sqrtPrice_lower).\n\n## Active liquidity und the liquidity curve\n\nThe pool's active liquidity at any given price is the sum of all in-range positions at that price. This creates a liquidity distribution curve that can have complex shapes depending on where LPs have placed their positions. Deeper liquidity at the current price means less slippage fuer traders.\n\nOn Solana, this active liquidity is stored in the Whirlpool konto's liquidity field und is updated whenever the price crosses a tick boundary where positions start or end. The tick array konten store the net liquidity change at each initialized tick, allowing the program to efficiently update active liquidity during swaps.\n\n## Checklist\n- In-range positions earn fees und hold both tokens\n- Out-of-range positions earn zero fees und hold one token\n- Token composition varies continuously within the range\n- Active liquidity is the sum of all in-range positions\n- Fee growth tracking uses global vs position-level snapshots\n\n## Red flags\n- Expecting fees from out-of-range positions\n- Ignoring the single-sided nature of out-of-range holdings\n- Forgetting to konto fuer IL in concentrated positions\n- Assuming position composition is static within a range\n",
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
            "content": "# Challenge: Implement tick/price conversion helpers\n\nImplement the core tick math functions used in every CLMM integration:\n\n- Convert a tick index to a human-readable price using price = 1.0001^tick\n- Convert the price to sqrtPriceX64 using Q64.64 fixed-point encoding\n- Reverse-convert a price back to the nearest tick index\n- Align a tick index to the pool's tick spacing\n\nYour implementation will be tested against known tick values including tick 0, positive ticks, und negative ticks.",
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
        "description": "Fee accrual simulation, range strategy tradeoffs, precision pitfalls, und deterministic position risk reporting.",
        "lessons": {
          "clmm-v2-position-fees": {
            "title": "Challenge: Simulate position fee accrual",
            "content": "# Challenge: Simulate position fee accrual\n\nImplement a fee accrual simulator fuer a CLMM position over a price path:\n\n- Convert lower und upper tick boundaries to prices\n- Walk through each price in the path und determine in-range or out-of-range status\n- Accrue fees proportional to trade volume when in-range\n- Compute annualized fee APR\n- Track periods in-range vs out-of-range\n- Determine current status from the final price\n\nThis simulates the real-world behavior of concentrated liquidity positions as prices move.",
            "duration": "50 min",
            "hints": [
              "Convert ticks to prices: lowerPrice = 1.0001^lowerTick, upperPrice = 1.0001^upperTick.",
              "Fuer each price in the path, check if lowerPrice <= price <= upperPrice.",
              "Fees only accrue when the position is in range. fee = floor(volumePerPeriod * feeRate).",
              "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimal places.",
              "Current status is based on the last price in the path relative to the range."
            ]
          },
          "clmm-v2-range-strategy": {
            "title": "Range strategies: tight, wide, und rebalancing rules",
            "content": "# Range strategies: tight, wide, und rebalancing rules\n\nChoosing the right price range is the most important decision a CLMM liquidity provider makes. The range determines capital efficiency, fee income, impermanent loss exposure, und rebalancing frequency. This lektion covers the major strategies und the tradeoffs between them.\n\n## Tight ranges: maximum efficiency, maximum risk\n\nA tight range concentrates all liquidity into a narrow price band. Fuer example, providing liquidity fuer SOL/USDC within +/- 2% of the current price. The advantages are significant: capital efficiency can be 100x or more compared to a full-range position, und the LP earns a proportionally larger share of trading fees.\n\nHowever, tight ranges carry substantial risks. The position goes out-of-range frequently, requiring active monitoring und rebalancing. Each time the position goes out-of-range, the LP has fully converted to one token und stops earning fees. The LP also realizes impermanent loss on each range crossing, und the gas costs of frequent rebalancing can eat into profits.\n\nTight ranges work best fuer stable pairs (USDC/USDT) where the price rarely deviates significantly, fuer professional LPs who can automate rebalancing, und fuer short-term positions where the LP has a strong directional view.\n\n## Wide ranges: passive und resilient\n\nA wide range covers a larger price band, such as +/- 50% or even the full price range. Capital efficiency is lower, but the position stays in-range longer und requires less active management. Fee income per dollar is lower, but the position earns fees more consistently.\n\nWide ranges suit passive LPs who cannot actively monitor positions, volatile pairs where the price can swing dramatically, und LPs who want to minimize rebalancing costs und IL realization events.\n\nThe extreme case is a full-range position covering all ticks. This replicates constant product AMM behavior und never goes out-of-range. While capital-inefficient, it provides maximum resilience und is appropriate fuer very volatile or low-liquidity pairs.\n\n## Asymmetric ranges und directional bets\n\nLPs can create asymmetric ranges that express a directional view. If you believe SOL will appreciate against USDC, you might set a range from the current price up to 2x the current price. This means you are providing liquidity as SOL appreciates, selling SOL at progressively higher prices. If SOL drops, your position immediately goes out-of-range und you hold SOL, preserving your long exposure.\n\nConversely, a range set below the current price acts like a limit buy order. You deposit USDC, und if SOL's price drops into your range, your USDC is converted to SOL at your desired prices.\n\n## Rebalancing strategies\n\nRebalancing is the process of closing an out-of-range position und opening a new one centered on the current price. The key decisions are: when to rebalance, und how to set the new range.\n\nTime-based rebalancing checks the position at fixed intervals (hourly, daily) und rebalances if out-of-range. This is simple to implement but may miss optimal timing. Price-based rebalancing uses the current price relative to the range boundaries. A common trigger is rebalancing when the price exits the inner 50% of the range, before it actually goes out-of-range.\n\nThreshold-based rebalancing waits until the IL or missed-fee cost of remaining out-of-range exceeds the cost of rebalancing (gas fees, slippage on swaps needed to rebalance token composition). This is the most capital-efficient approach but requires sophisticated modeling.\n\nOn Solana, rebalancing a Whirlpool position involves three operations: collecting unclaimed fees, closing the old position (withdrawing liquidity und burning the position NFT), und opening a new position mit updated range. These operations typically fit in two to three transaktionen depending on the number of konten involved.\n\n## Automated vault strategies\n\nSeveral protocols on Solana automate CLMM range management. These vault protocols (such as Kamino Finance) accept LP deposits und automatically create, monitor, und rebalance concentrated liquidity positions. They use various strategies including mean-reversion, momentum-following, und volatility-adjusted range widths.\n\nWhen evaluating automated vaults, consider: the strategy's historical leistung, the management und leistung fees, the rebalancing frequency und associated costs, und the vault's transparency about its position management logic.\n\n## Checklist\n- Tight ranges maximize efficiency but require active management\n- Wide ranges provide resilience at the cost of efficiency\n- Asymmetric ranges can express directional views\n- Rebalancing triggers: time-based, price-based, or threshold-based\n- Consider automated vaults fuer passive management\n\n## Red flags\n- Using tight ranges without monitoring or automation\n- Rebalancing too frequently, losing fees to gas costs\n- Ignoring the realized IL at each rebalancing event\n- Assuming past APR will predict future returns\n",
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
                      "Higher capital efficiency but more frequent out-of-range events und rebalancing",
                      "Lower fees but less impermanent loss",
                      "More tokens required to open the position"
                    ],
                    "answerIndex": 0,
                    "explanation": "Tight ranges concentrate capital fuer higher efficiency und fee share, but the position goes out-of-range more often, requiring active management."
                  },
                  {
                    "id": "clmm-v2-l6-q2",
                    "prompt": "When should an LP consider a full-range (all ticks) position?",
                    "options": [
                      "Fuer very volatile pairs where the price may swing dramatically",
                      "Only fuer stablecoin pairs",
                      "Never — it is always suboptimal"
                    ],
                    "answerIndex": 0,
                    "explanation": "Full-range positions replicate constant product behavior und never go out-of-range, making them suitable fuer highly volatile or unpredictable pairs."
                  }
                ]
              }
            ]
          },
          "clmm-v2-risk-review": {
            "title": "CLMM risks: rounding, overflow, und tick spacing errors",
            "content": "# CLMM risks: rounding, overflow, und tick spacing errors\n\nBuilding reliable CLMM integrations requires awareness of precision risks that can cause incorrect calculations, failed transaktionen, or lost funds. This lektion catalogs the most common pitfalls in tick math, fee computation, und position management on Solana.\n\n## Floating-point rounding in tick conversions\n\nThe tick-to-price formula price = 1.0001^tick und its inverse tick = ln(price) / ln(1.0001) both involve floating-point arithmetic. JavaScript's Number type uses IEEE 754 double-precision (64-bit) floats, which provide approximately 15-17 significant decimal digits. Fuer most tick ranges (roughly -443636 to +443636, the valid CLMM range), this precision is sufficient.\n\nHowever, rounding errors accumulate in compound operations. Converting a tick to a price und back may yield tick +/- 1 due to floating-point rounding in the logarithm. The safest practice is to always treat the integer tick index as the canonical value. If you need a price, derive it from the tick. If you need a tick from a user-entered price, compute the tick und then show the user the exact price that tick represents, so they see the actual boundary rather than an approximation.\n\nThe Math.round function in the priceToTick conversion introduces its own edge cases. When the true tick is exactly X.5, Math.round uses \"round half to even\" (banker's rounding) in some environments. Fuer CLMM math, always round toward the nearest valid tick und then align to tick spacing.\n\n## Overflow in sqrtPriceX64 computation\n\nThe sqrtPriceX64 value is stored as a u128 on-chain (128-bit unsigned integer). In JavaScript, this must be handled mit BigInt. The mittelstufe computation sqrt(price) * 2^64 can overflow a 64-bit float fuer extreme tick values. At the maximum valid tick (443636), the price is approximately 1.34 * 10^19, und sqrt(price) * 2^64 is approximately 6.75 * 10^28, which fits in a u128 but exceeds the safe integer range of JavaScript Numbers.\n\nAlways use BigInt fuer the final sqrtPriceX64 value. Fuer mittelstufe computations at extreme ticks, consider using a high-precision library or performing the computation in Rust (where Solana programs actually run). Fuer client-side JavaScript, the praktisch risk is manageable fuer common token pairs but must be tested at boundary conditions.\n\n## Tick spacing alignment errors\n\nA frequent bug is creating positions mit tick boundaries that are not aligned to the pool's tick spacing. The on-chain program will reject these positions, but the error message may be cryptic. Always align ticks before submitting transaktionen: aligned = floor(tick / tickSpacing) * tickSpacing.\n\nBe careful mit negative ticks: floor(-100 / 64) = floor(-1.5625) = -2, so -100 aligns to -128, not -64. This is correct behavior (rounding toward negative infinity), but developers who expect truncation toward zero will get wrong results. Test mit negative ticks explicitly.\n\n## Fee computation precision\n\nFee growth values in CLMMs use 128-bit fixed-point arithmetic (Q64.64 or Q128.128 depending on the implementation). When computing uncollected fees, the formula is: uncollected_fees = (global_fee_growth - position_fee_growth_snapshot) * liquidity.\n\nBoth the subtraction und the multiplication can overflow if not handled carefully. On Solana, the program uses checked arithmetic und wrapping subtraction (since fee_growth is monotonically increasing und wraps around). Client-side code must replicate this wrapping behavior when reading on-chain state.\n\nA common mistake is computing fees mit JavaScript Numbers, which lose precision fuer large BigInt values. Always use BigInt fuer fee calculations und only convert to Number at the final display step, after applying decimal adjustments.\n\n## Decimal mismatch between tokens\n\nDifferent tokens have different decimal places (SOL: 9, USDC: 6, BONK: 5). When computing position values, token amounts, or fee amounts, the decimal places must be consistently applied. A common bug is computing IL in raw amounts without normalizing to the same decimal base, leading to wildly incorrect results.\n\nAlways track the decimal places of both tokens in the pool und apply them when converting between raw amounts und display amounts. The on-chain CLMM program operates entirely in raw (lamport-level) amounts; all decimal formatting is a client-side responsibility.\n\n## Konto und compute unit limits\n\nSolana-specific risks include exceeding compute unit limits during swaps that cross many ticks, requiring too many tick array konten (each swap can reference at most a few tick arrays), und konto size limits fuer position management.\n\nWhen building swap transaktionen, estimate the number of tick crossings und include sufficient tick array konten. If a swap would cross more ticks than can be accommodated, the transaktion will fail. Splitting large swaps across multiple transaktionen or using a routing protocol helps mitigate this risk.\n\n## Checklist\n- Use integer tick index as canonical, derive price from it\n- Use BigInt fuer sqrtPriceX64 und all fee computations\n- Always align ticks to tick spacing mit floor division\n- Test mit negative ticks, zero ticks, und extreme ticks\n- Apply correct decimal places fuer each token in the pool\n\n## Red flags\n- Using JavaScript Number fuer sqrtPriceX64 or fee amounts\n- Forgetting wrapping subtraction fuer fee growth deltas\n- Truncating instead of flooring fuer negative tick alignment\n- Computing IL or fees without matching token decimals\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l7-q1",
                    "prompt": "Why should you always use BigInt fuer sqrtPriceX64 values?",
                    "options": [
                      "JavaScript Number cannot safely represent 128-bit integers",
                      "BigInt is faster than Number fuer CLMM math",
                      "Solana requires BigInt in transaktion anweisungen"
                    ],
                    "answerIndex": 0,
                    "explanation": "sqrtPriceX64 is a u128 value that can exceed JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1). BigInt provides arbitrary precision integer arithmetic."
                  },
                  {
                    "id": "clmm-v2-l7-q2",
                    "prompt": "What happens when negative ticks are aligned mit floor division?",
                    "options": [
                      "They round toward negative infinity — e.g., -100 mit spacing 64 becomes -128",
                      "They round toward zero — e.g., -100 mit spacing 64 becomes -64",
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
            "content": "# Checkpoint: Generate a Position Report\n\nImplement a comprehensive LP position report generator that combines all CLMM concepts:\n\n- Convert tick boundaries to human-readable prices\n- Determine in-range or out-of-range status from the current price\n- Aggregate fee history into total earned fees per token\n- Compute annualized fee APR\n- Calculate impermanent loss percentage\n- Return a complete, deterministic position report\n\nThis checkpoint validates your understanding of tick math, fee accrual, range dynamics, und position analysis.",
            "duration": "55 min",
            "hints": [
              "Convert ticks to prices: price = 1.0001^tick. Use toFixed(6) fuer display.",
              "Status is 'in-range' if lowerPrice <= currentPrice <= upperPrice.",
              "Sum feeHistory entries using BigInt fuer total fees per token.",
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
    "description": "Master Solana lending risk engineering: utilization und rate mechanics, liquidation path analysis, oracle safety, und deterministic scenario reporting.",
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
        "description": "Lending pool mechanics, utilization-driven rate models, und health-factor foundations required fuer defensible risk analysis.",
        "lessons": {
          "lending-v2-pool-model": {
            "title": "Lending pool model: supply, borrow, und utilization",
            "content": "# Lending pool model: supply, borrow, und utilization\n\nLending protocols are the backbone of decentralized finance. They enable users to earn yield on idle assets by supplying them to a shared pool, while borrowers draw from that pool by posting collateral. Understanding the mechanics of supply, borrow, und utilization is essential before diving into interest rate models or liquidation logic.\n\nA lending pool is a smart contract (or set of konten on Solana) that holds a reserve of a single token — fuer example, USDC. Suppliers deposit tokens into the pool und receive interest-bearing receipt tokens in return. On Solana-based protocols like Solend, MarginFi, or Kamino, these receipt tokens track each supplier's proportional share of the growing pool. When a supplier withdraws, they redeem receipt tokens fuer the underlying asset plus accrued interest.\n\nBorrowers interact mit the same pool from the other side. To borrow from the USDC pool, a user must first deposit collateral into one or more other pools (fuer example, SOL). The protocol values the collateral in USD terms und allows the user to borrow up to a percentage of that value, determined by the loan-to-value (LTV) ratio. If SOL has an LTV of 75%, depositing $1,000 worth of SOL allows borrowing up to $750 in USDC. The borrowed amount accrues interest over time, increasing the user's debt.\n\nThe utilization ratio is the single most important metric in a lending pool. It is defined as:\n\nutilization = totalBorrowed / totalSupply\n\nwhere totalSupply is the sum of all deposits (including borrowed amounts that are still owed back to the pool). When utilization is 0%, no assets are borrowed — suppliers earn nothing. When utilization is 100%, every deposited asset is lent out — no supplier can withdraw because there is no liquidity available. Healthy protocols target utilization between 60% und 85%, balancing yield fuer suppliers against withdrawal liquidity.\n\nThe reserve factor is a protocol-level parameter that skims a percentage of the interest paid by borrowers before distributing the remainder to suppliers. If borrowers pay 10% annual interest und the reserve factor is 10%, the protocol retains 1% und suppliers receive the effective yield on the remaining 9%. Reserve funds are used fuer protocol insurance, development, und governance treasury. Understanding the reserve factor is critical because it directly reduces the supply-side APY relative to the borrow-side APR.\n\nPool accounting must be exact. Solana lending protocols typically use a shares-based model: when you deposit 100 USDC into a pool mit 1,000 USDC total und 1,000 shares outstanding, you receive 100 shares. As interest accrues, the total USDC in the pool grows (say to 1,100 USDC), but the share count remains 1,100. Your 100 shares are now worth 100 USDC — the value per share increased. This model avoids iterating over every depositor to distribute interest. The same pattern applies to borrow shares, tracking each borrower's proportional debt.\n\nOn Solana specifically, lending pools are represented as program-derived konten. The reserve konto holds the token balance, a reserve config konto stores parameters (LTV, liquidation threshold, reserve factor, interest rate model), und individual obligation konten track each user's deposits und borrows. Programs like Solend use the spl-token program fuer token custody und Pyth or Switchboard oracles fuer price feeds.\n\n## Risk-operator mindset\n\nTreat every pool as a control system, not just a yield product:\n1. utilization controls liquidity stress,\n2. rate model controls borrower behavior,\n3. oracle quality controls collateral truth,\n4. liquidation speed controls solvency recovery.\n\nWhen one control weakens, the others must compensate.\n\n## Checklist\n- Understand the relationship between supply, borrow, und utilization\n- Know that utilization = totalBorrowed / totalSupply\n- Recognize that the reserve factor reduces supplier yield\n- Understand share-based accounting fuer deposits und borrows\n- Identify the key on-chain konten in a Solana lending pool\n\n## Red flags\n- Utilization at or near 100% (withdrawal liquidity crisis)\n- Missing or zero reserve factor (no protocol safety buffer)\n- Share-price manipulation through donation attacks\n- Pools without oracle-backed price feeds fuer collateral valuation\n",
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
            "title": "Interest rate curves und the kink model",
            "content": "# Interest rate curves und the kink model\n\nInterest rates in lending protocols are not fixed. They adjust dynamically based on pool utilization to balance supply und demand fuer liquidity. The piecewise-linear \"kink\" model is the dominant interest rate design used across DeFi lending protocols, from Compound und Aave on Ethereum to Solend und MarginFi on Solana.\n\nThe core insight is simple: when utilization is low, borrowing should be cheap to encourage demand. When utilization is high, borrowing should be expensive to discourage further borrowing und incentivize new deposits. The kink model achieves this mit two linear segments joined at a critical utilization point called the \"kink.\"\n\nThe kink model has four parameters: baseRate, slope1, slope2, und kink. The baseRate is the minimum borrow rate when utilization is zero. Slope1 is the rate of increase below the kink — a gentle incline that gradually raises borrow costs as utilization increases. The kink is the target utilization (typically 0.80 or 80%). Slope2 is the steep rate of increase above the kink — a sharp jump that penalizes borrowing when the pool approaches full utilization.\n\nBelow the kink, the borrow rate formula is:\n\nborrowRate = baseRate + (utilization / kink) * slope1\n\nThis creates a gentle linear increase. At 50% utilization mit a kink at 80%, baseRate of 2%, und slope1 of 10%, the borrow rate would be: 0.02 + (0.50 / 0.80) * 0.10 = 0.02 + 0.0625 = 0.0825 or 8.25%.\n\nAbove the kink, the formula becomes:\n\nborrowRate = baseRate + slope1 + ((utilization - kink) / (1 - kink)) * slope2\n\nThe full slope1 is added (the rate at the kink point), plus a steep increase proportional to how far utilization exceeds the kink. Mit slope2 = 1.00 (100%), at 90% utilization: 0.02 + 0.10 + ((0.90 - 0.80) / (1 - 0.80)) * 1.00 = 0.02 + 0.10 + 0.50 = 0.62 or 62%. This dramatic jump is intentional — it makes borrowing above 80% utilization extremely expensive, creating strong pressure to restore utilization below the kink.\n\nThe supply rate is derived from the borrow rate, utilization, und reserve factor:\n\nsupplyRate = borrowRate * utilization * (1 - reserveFactor)\n\nSuppliers only earn on the portion of the pool that is actively borrowed, und the reserve factor takes its cut. At 50% utilization, an 8.25% borrow rate, und 10% reserve factor: 0.0825 * 0.50 * 0.90 = 0.037125 or 3.71% supply APY.\n\nWhy the kink matters: without the steep slope2, high utilization would only moderately increase rates, potentially leading to a \"liquidity death spiral\" where all assets are borrowed und no supplier can withdraw. The kink creates an economic circuit breaker. Protocols tune these parameters through governance — adjusting the kink point, slopes, und base rate to target different utilization profiles fuer different assets. Stablecoins typically have higher kinks (85-90%) because their prices are stable, while volatile assets have lower kinks (65-75%) to maintain larger liquidity buffers.\n\nReal-world Solana protocols often extend this model mit additional features: rate smoothing (averaging over recent blocks to prevent rapid oscillations), multiple kink points fuer more granular control, und dynamic parameter adjustment based on market conditions. However, the fundamental two-slope kink model remains the foundation.\n\n## Checklist\n- Understand the four parameters: baseRate, slope1, slope2, kink\n- Calculate borrow rate below und above the kink\n- Derive supply rate from borrow rate, utilization, und reserve factor\n- Recognize why steep slope2 prevents liquidity crises\n- Know that different assets use different kink parameters\n\n## Red flags\n- Slope2 too low (insufficient deterrent fuer high utilization)\n- Kink set too high (leaves insufficient withdrawal buffer)\n- Base rate at zero (no minimum cost of borrowing)\n- Parameters unchanged despite market condition shifts\n",
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
                    "explanation": "Above the kink, slope2 (the jump multiplier) applies, causing borrow rates to spike sharply und discourage further borrowing."
                  },
                  {
                    "id": "lending-v2-l2-q2",
                    "prompt": "Why is the supply rate always lower than the borrow rate?",
                    "options": [
                      "Suppliers only earn on the borrowed portion, und the reserve factor takes a cut",
                      "The protocol subsidizes borrowers",
                      "Supply rates are fixed by governance"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply rate = borrowRate * utilization * (1 - reserveFactor). Since utilization < 1 und reserveFactor > 0, the supply rate is always less than the borrow rate."
                  }
                ]
              }
            ]
          },
          "lending-v2-health-explorer": {
            "title": "Health factor monitoring und liquidation preview",
            "content": "# Health factor monitoring und liquidation preview\n\nThe health factor is the single number that determines whether a lending position is safe or subject to liquidation. Monitoring health factors in real time is essential fuer both borrowers (to avoid liquidation) und liquidators (to identify profitable liquidation opportunities). Understanding how to compute, interpret, und react to health factor changes is a core skill fuer DeFi risk management.\n\nThe health factor formula is:\n\nhealthFactor = (collateralValue * liquidationThreshold) / borrowValue\n\nwhere collateralValue is the total USD value of all deposited collateral, liquidationThreshold is the weighted average threshold across all collateral assets, und borrowValue is the total USD value of all outstanding borrows. When the health factor drops below 1.0, the position becomes eligible fuer liquidation.\n\nThe liquidation threshold is distinct from the loan-to-value (LTV) ratio. LTV determines the maximum amount you can borrow — fuer example, 75% LTV on SOL means you can borrow up to 75% of your SOL collateral value. The liquidation threshold is higher — say 80% — providing a buffer zone. You can borrow at 75% LTV, und you are only liquidated when your effective ratio exceeds 80%. This 5% gap gives borrowers time to add collateral or repay debt before liquidation.\n\nWhen a user has multiple collateral assets, the effective liquidation threshold is a weighted average. If you deposit $1,000 of SOL (threshold 0.80) und $500 of ETH (threshold 0.75), the weighted threshold is: (1000 * 0.80 + 500 * 0.75) / 1500 = (800 + 375) / 1500 = 0.7833. This weighted threshold is used in the health factor calculation.\n\nHealth factor interpretation: a value of 2.0 means the position can withstand a 50% decline in collateral value (or 50% increase in borrow value) before liquidation. A value of 1.5 provides a 33% buffer. A value of 1.1 is dangerously close — a 9% adverse price move triggers liquidation. Professional risk managers target health factors of 1.5 or above, mit automated alerts below 1.3 und emergency actions below 1.2.\n\nMonitoring dashboards should display: current health factor mit color coding (green above 1.5, yellow 1.2-1.5, red below 1.2), the price change percentage needed to trigger liquidation, estimated liquidation prices fuer each collateral asset, und historical health factor over time. On Solana, health factor data can be derived by reading obligation konten und combining mit oracle price feeds from Pyth or Switchboard.\n\nLiquidation preview calculations help users understand their worst-case exposure. The maximum additional borrow is: max(0, collateralValue * effectiveThreshold - currentBorrow). The liquidation shortfall (when health factor < 1.0) is: currentBorrow - collateralValue * effectiveThreshold. This shortfall represents how much additional collateral or debt repayment is needed to restore the position to safety.\n\nPrice scenario analysis extends monitoring to \"what-if\" questions. What happens to the health factor if SOL drops 20%? If both SOL und ETH drop 30%? If interest accrues fuer another month? By computing health factors across a range of price scenarios, borrowers can proactively manage risk before adverse conditions materialize. This scenario-based approach forms the foundation of the risk report challenge later in this kurs.\n\n## Checklist\n- Calculate health factor using weighted liquidation thresholds\n- Distinguish between LTV (borrowing limit) und liquidation threshold\n- Compute maximum additional borrow und liquidation shortfall\n- Set up monitoring mit color-coded health factor alerts\n- Run price scenario analysis before major market events\n\n## Red flags\n- Health factor below 1.2 without active monitoring\n- No alerts configured fuer health factor changes\n- Ignoring weighted threshold calculations fuer multi-asset positions\n- Failing to konto fuer accruing interest in health factor projections\n",
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
                    "note": "Healthy position mit 50% buffer before liquidation"
                  },
                  {
                    "cmd": "SOL drops to $15 ...",
                    "output": "HF = (1500 * 0.80) / 1000 = 1.2000 [WARNING]",
                    "note": "Only 20% buffer remaining — consider adding collateral"
                  },
                  {
                    "cmd": "SOL drops to $12 ...",
                    "output": "HF = (1200 * 0.80) / 1000 = 0.9600 [LIQUIDATABLE]",
                    "note": "Health factor below 1.0 — position is eligible fuer liquidation"
                  }
                ]
              }
            ]
          },
          "lending-v2-interest-rates": {
            "title": "Challenge: Compute utilization-based interest rates",
            "content": "# Challenge: Compute utilization-based interest rates\n\nImplement the kink-based interest rate model used by lending protocols:\n\n- Calculate the utilization ratio from total supply und total borrowed\n- Apply the piecewise-linear kink model mit baseRate, slope1, slope2, und kink\n- Compute the borrow rate using the appropriate formula fuer below-kink und above-kink regions\n- Derive the supply rate from borrow rate, utilization, und reserve factor\n- Handle edge cases: zero supply, zero borrows, utilization at exactly the kink\n- Return all values formatted to 6 decimal places\n\nYour implementation must be deterministic — same input always produces same output.",
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
        "description": "Health-factor computation, liquidation mechanics, oracle failure handling, und multi-scenario risk reporting fuer stressed markets.",
        "lessons": {
          "lending-v2-health-factor": {
            "title": "Challenge: Compute health factor und liquidation status",
            "content": "# Challenge: Compute health factor und liquidation status\n\nImplement the health factor computation fuer a multi-asset lending position:\n\n- Sum collateral und borrow values from an array of position objects\n- Compute weighted average liquidation threshold across all collateral assets\n- Calculate the health factor using the standard formula\n- Determine liquidation eligibility (health factor below 1.0)\n- Calculate maximum additional borrow capacity und liquidation shortfall\n- Handle edge cases: no borrows (max health factor), no collateral, single asset\n\nReturn all USD values to 2 decimal places und health factor to 4 decimal places.",
            "duration": "50 min",
            "hints": [
              "Collateral value = sum of (amount * priceUsd) fuer all collateral positions.",
              "Effective threshold = weighted average of liquidationThreshold by collateral value.",
              "Health factor = (collateralValue * effectiveThreshold) / borrowValue.",
              "Max additional borrow = max(0, collateralValue * threshold - currentBorrow)."
            ]
          },
          "lending-v2-liquidation-mechanics": {
            "title": "Liquidation mechanics: bonus, close factor, und bad debt",
            "content": "# Liquidation mechanics: bonus, close factor, und bad debt\n\nLiquidation is the enforcement mechanism that keeps lending protocols solvent. When a borrower's health factor falls below 1.0, external actors called liquidators can repay a portion of the debt in exchange fuer the borrower's collateral at a discount. Understanding liquidation mechanics — the incentive structure, limits, und failure modes — is essential fuer anyone building on or using lending protocols.\n\nThe liquidation bonus (also called the liquidation incentive or discount) is the premium liquidators receive fuer performing liquidations. If the liquidation bonus is 5%, a liquidator who repays $100 of debt receives $105 worth of collateral. This bonus serves two purposes: it compensates liquidators fuer gas costs und execution risk, und it creates competitive pressure to liquidate positions quickly before other liquidators claim the opportunity. On Solana, where transaktion costs are low, liquidation bonuses tend to be smaller (3-8%) compared to Ethereum (5-15%).\n\nThe close factor limits how much of a position can be liquidated in a single transaktion. A close factor of 50% means a liquidator can repay at most 50% of the outstanding debt in one liquidation call. This prevents a single liquidator from seizing all collateral in one transaktion, giving the borrower a chance to respond. It also distributes liquidation opportunities across multiple liquidators, improving the health of the liquidation market. Some protocols use dynamic close factors — smaller percentages fuer mildly underwater positions, larger percentages (up to 100%) fuer deeply underwater positions.\n\nThe liquidation process on Solana follows these steps: (1) a liquidator identifies a position mit health factor below 1.0 by scanning obligation konten, (2) the liquidator calls the liquidation anweisung specifying which debt to repay und which collateral to seize, (3) the protocol verifies the position is indeed liquidatable, (4) the debt tokens are transferred from the liquidator to the pool, reducing the borrower's debt, (5) the corresponding collateral (plus bonus) is transferred from the borrower's obligation to the liquidator. The entire process is atomic — it either completes fully or reverts.\n\nBad debt occurs when a position's collateral value (including the liquidation bonus) is insufficient to cover the outstanding debt. This happens during extreme market crashes where prices move faster than liquidators can act, or when the collateral asset experiences a sudden loss of liquidity. When bad debt materializes, the protocol must absorb the loss. Common approaches include: drawing from the reserve fund (accumulated from reserve factors), socializing the loss across all suppliers in the pool (reducing the share price), or using a protocol insurance fund or backstop mechanism.\n\nCascading liquidations are a systemic risk. When many positions use the same collateral (e.g., SOL), a price drop triggers liquidations. Liquidators selling the seized collateral on DEXes further depresses the price, triggering more liquidations. This cascade can drain pool liquidity rapidly. Protocols mitigate this through: conservative LTV ratios, higher liquidation thresholds fuer volatile assets, liquidation rate limits (maximum liquidation volume per time window), und integration mit deep liquidity sources.\n\nSolana-specific considerations: liquidation bots on Solana benefit from low latency und low transaktion costs. However, they must compete fuer transaktion ordering during volatile periods. MEV (Maximal Extractable Value) on Solana through Jito tips allows liquidators to prioritize their transaktionen. Protocols must also handle Solana's kontenmodell — each obligation konto must be refreshed mit current oracle prices before liquidation can proceed, adding anweisungen und compute units to the liquidation transaktion.\n\n## Checklist\n- Understand the liquidation bonus incentive structure\n- Know how close factor limits single-transaktion liquidation\n- Track the flow of funds during a liquidation event\n- Identify bad debt scenarios und protocol mitigation strategies\n- Consider cascading liquidation risks in portfolio construction\n\n## Red flags\n- Liquidation bonus too low (liquidators are not incentivized to act quickly)\n- Close factor at 100% (full liquidation in one shot, no borrower recourse)\n- No reserve fund or insurance mechanism fuer bad debt\n- Ignoring cascading liquidation risks in concentrated collateral pools\n",
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
                      "It rewards borrowers fuer maintaining healthy positions",
                      "It increases the interest rate fuer all borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "The liquidation bonus compensates liquidators fuer gas costs und risk, ensuring positions are liquidated promptly to protect the protocol."
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
                    "explanation": "Bad debt materializes when rapid price drops make collateral worth less than the debt, leaving the protocol mit unrecoverable losses."
                  }
                ]
              }
            ]
          },
          "lending-v2-oracle-risk": {
            "title": "Oracle risk und stale pricing in lending",
            "content": "# Oracle risk und stale pricing in lending\n\nLending protocols depend entirely on accurate, timely price feeds to compute collateral values, health factors, und liquidation eligibility. Oracles — the services that bring off-chain price data on-chain — are the single most critical external dependency. Oracle failures or manipulation can lead to catastrophic losses: incorrect liquidations of healthy positions, failure to liquidate underwater positions, or exploits that drain protocol reserves.\n\nOn Solana, the two dominant oracle providers are Pyth Network und Switchboard. Pyth provides high-frequency price feeds sourced directly from market makers, exchanges, und trading firms. Pyth publishes price, confidence interval, und exponential moving average (EMA) price fuer each asset. Switchboard is a more general-purpose oracle network that supports custom data feeds und verification mechanisms. Most Solana lending protocols integrate both und use the more conservative price (lower fuer collateral, higher fuer borrows).\n\nStale prices are the most common oracle risk. A price is \"stale\" when it has not been updated within a protocol-defined freshness window — typically 30-120 seconds on Solana. Staleness occurs when: oracle publishers experience downtime, network congestion delays update transaktionen, or the asset's market enters a period of extreme volatility where publishers disagree on the price. Lending protocols must reject stale prices und either pause operations or use fallback pricing. Accepting a stale price during a market crash can mean using a price from minutes ago that is significantly higher than reality — blocking necessary liquidations und enabling under-collateralized borrowing.\n\nConfidence intervals quantify price uncertainty. Pyth provides a confidence band around each price — fuer example, SOL at $25.00 +/- $0.15. A narrow confidence interval indicates strong publisher agreement. A wide confidence interval signals disagreement, low liquidity, or unusual market conditions. Risk-aware protocols use confidence-adjusted prices: fuer collateral valuation, use (price - confidence) to be conservative; fuer borrow valuation, use (price + confidence) to konto fuer upside risk. This approach prevents protocols from accepting inflated collateral values during uncertain market conditions.\n\nPrice manipulation attacks target the oracle layer. In a classic oracle manipulation, an attacker temporarily moves the price on a low-liquidity market that the oracle reads from, borrows against the inflated collateral value, und then lets the price revert — leaving the protocol mit under-collateralized debt. Mitigations include: using time-weighted average prices (TWAPs) instead of spot prices, requiring multiple independent sources to agree, capping single-block price changes, und implementing borrow/withdrawal delays during high-volatility periods.\n\nSolana-specific oracle considerations: Pyth on Solana uses a pull-based model where price updates are posted to on-chain konten that protocols read. Each Pyth price konto contains the latest price, confidence, EMA price, publish time, und status (Trading, Halted, Unknown). Protocols should check the status field — a \"Halted\" or \"Unknown\" status indicates the feed is unreliable. The publishTime must be compared against the current slot time to detect staleness. Switchboard konten have similar freshness und confidence metadata.\n\nMulti-oracle strategies improve resilience. A protocol might use Pyth as the primary oracle und Switchboard as a fallback. If Pyth's price is stale or has low confidence, the protocol switches to Switchboard. If both are unavailable, the protocol pauses new borrows und liquidations rather than operating on unknown prices. This layered approach prevents single points of failure in the oracle infrastructure.\n\nCircuit breakers add an additional safety layer. If an oracle reports a price change exceeding a threshold (e.g., >20% in one update), the protocol should flag this as potentially suspicious und either verify against a secondary source or temporarily pause operations. Flash crashes und recovery events can produce legitimate large price movements, but the protocol should err on the side of caution.\n\n## Checklist\n- Verify oracle freshness (publishTime within acceptable window)\n- Use confidence intervals fuer conservative pricing\n- Implement multi-oracle fallback strategies\n- Check oracle status fields (Trading, Halted, Unknown)\n- Set circuit breakers fuer extreme price movements\n\n## Red flags\n- Single oracle dependency mit no fallback\n- No staleness checks on price data\n- Ignoring confidence intervals fuer collateral valuation\n- Using spot prices without TWAP or time-weighting\n- No circuit breakers fuer extreme price changes\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l7-q1",
                    "prompt": "Why should lending protocols use confidence-adjusted prices fuer collateral?",
                    "options": [
                      "To be conservative — using (price - confidence) prevents over-valuing collateral during uncertainty",
                      "Confidence intervals make prices more accurate",
                      "It increases the collateral value fuer borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "Using price minus confidence fuer collateral gives a conservative valuation, protecting the protocol when oracle publishers disagree or markets are volatile."
                  },
                  {
                    "id": "lending-v2-l7-q2",
                    "prompt": "What should a protocol do when all oracle feeds are stale?",
                    "options": [
                      "Pause new borrows und liquidations until fresh prices are available",
                      "Use the last known price regardless of age",
                      "Estimate the price from on-chain DEX data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Operating on stale prices is dangerous. Pausing operations prevents incorrect liquidations und under-collateralized borrows during oracle outages."
                  }
                ]
              }
            ]
          },
          "lending-v2-risk-report": {
            "title": "Checkpoint: Generate a multi-scenario risk report",
            "content": "# Checkpoint: Generate a multi-scenario risk report\n\nBuild the final risk report that combines all kurs concepts:\n\n- Evaluate a base case using current position prices\n- Apply price overrides from multiple named scenarios (bull, crash, etc.)\n- Compute collateral value, borrow value, und health factor per scenario\n- Identify which scenarios trigger liquidation (health factor < 1.0)\n- Track the worst health factor across all scenarios\n- Count total liquidation scenarios\n- Output must be stable JSON mit deterministic key ordering\n\nThis checkpoint validates your complete understanding of lending risk analysis.",
            "duration": "55 min",
            "hints": [
              "Create a reusable evalScenario function that takes price overrides und computes health factor.",
              "Fuer the base case, use the original position prices (empty overrides).",
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
    "description": "Master perps risk engineering on Solana: precise PnL/funding accounting, margin safety monitoring, liquidation simulation, und deterministic console reporting.",
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
        "description": "Perpetual futures mechanics, funding accrual logic, und PnL modeling foundations fuer accurate position diagnostics.",
        "lessons": {
          "perps-v2-mental-model": {
            "title": "Perpetual futures: base positions, entry price, und mark vs oracle",
            "content": "# Perpetual futures: base positions, entry price, und mark vs oracle\n\nPerpetual futures (perps) are synthetic derivatives that let traders gain exposure to an asset's price movement without holding the underlying token. Unlike traditional futures mit expiry dates, perpetual contracts never settle. Instead, a funding rate mechanism keeps the contract price anchored to the spot price over time. Understanding how positions are represented, how entry prices work, und the distinction between mark und oracle prices is the foundation of every risk calculation that follows.\n\n## Position anatomy\n\nA perpetual futures position is defined by four core fields: side (long or short), size (the quantity of the base asset), entry price (the average cost basis), und margin (the collateral deposited). When you open a long position of 10 SOL-PERP at $22.50 mit $225 margin, you are expressing a bet that SOL's price will rise. The notional value of this position is size multiplied by the current mark price. Notional value changes continuously as the mark price moves, even though your entry price remains fixed until you modify the position.\n\nEntry price is not simply the price at the moment you clicked \"buy.\" If you add to an existing position, the entry price updates to the weighted average of the old und new fills. Fuer example, if you hold 5 SOL-PERP at $20 und buy 5 more at $25, your new entry price becomes (5 * 20 + 5 * 25) / 10 = $22.50. Partial closes do not change the entry price — only additions do. Tracking entry price accurately is critical because every PnL calculation derives from the difference between entry und current price.\n\n## Mark price vs oracle price\n\nOn-chain perpetual protocols maintain two distinct prices: the mark price und the oracle price. The oracle price reflects the broader market's view of the asset's spot value. Solana protocols commonly use Pyth or Switchboard oracle feeds, which aggregate price data from multiple exchanges und publish updates on-chain every 400 milliseconds. The oracle price is the \"truth\" — the real-world value of the underlying asset.\n\nThe mark price is the protocol's internal valuation of the perpetual contract. It is typically derived from the oracle price plus a premium or discount that reflects supply und demand imbalance in the perp market itself. When there are more longs than shorts, the mark price trades above the oracle (positive premium). When shorts dominate, the mark trades below (negative premium). The formula varies by protocol but often follows: markPrice = oraclePrice + exponentialMovingAverage(premium).\n\nMark price is used fuer all PnL calculations und liquidation triggers. Using mark price instead of raw trade price prevents manipulation attacks where a single large trade could spike the last-traded price und trigger mass liquidations. The mark price moves more smoothly because it incorporates the oracle as a stability anchor.\n\n## Why this matters fuer risk\n\nEvery risk metric in a perps risk console depends on getting these fundamentals right. Unrealized PnL is computed against the mark price. Margin ratio is computed using notional value at mark price. Liquidation price is derived from the entry price und margin. If you confuse mark und oracle, or miscalculate entry price after position averaging, every downstream number is wrong.\n\nOn Solana specifically, oracle latency introduces an additional consideration. Pyth oracle updates propagate mit slot-level granularity (~400ms). During volatile periods, the oracle price can lag behind actual market moves by several hundred milliseconds. Protocols handle this by including confidence intervals in their oracle reads und rejecting prices mit excessively wide confidence bands. When building risk dashboards, always display the oracle confidence alongside the price und flag stale oracles (timestamps older than a few seconds).\n\n## Console design principle\n\nA useful risk console must separate:\n1. directional leistung (PnL),\n2. structural cost (funding + fees),\n3. survival risk (margin ratio + liquidation distance).\n\nBlending these into one number hides the decision signals traders actually need.\n\n## Checklist\n- Understand that perpetual futures never expire und use funding to track spot\n- Track entry price as a weighted average across all fills\n- Distinguish mark price (PnL, liquidation) from oracle price (funding, reference)\n- Monitor oracle staleness und confidence intervals\n- Compute notional value as size * markPrice\n\n## Red flags\n- Using last-traded price instead of mark price fuer PnL\n- Forgetting to update entry price on position additions\n- Ignoring oracle confidence intervals during volatile markets\n- Assuming mark price equals oracle price (the premium matters)\n",
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
                    "prompt": "If you hold 8 SOL-PERP at $20 und buy 2 more at $30, what is your new entry price?",
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
            "title": "Funding rates: why they exist und how they accrue",
            "content": "# Funding rates: why they exist und how they accrue\n\nFunding rates are the mechanism that tethers a perpetual contract's price to the underlying spot price. Without funding, the perp price could drift arbitrarily far from reality because the contract never expires. Funding creates a periodic cash flow between longs und shorts that incentivizes convergence: when the perp trades above spot, longs pay shorts; when it trades below, shorts pay longs.\n\n## The convergence mechanism\n\nConsider a scenario where heavy demand from leveraged long traders pushes the SOL-PERP mark price to $23 while the SOL oracle price is $22. The premium is $1, or about 4.5%. The funding rate will be positive, meaning long holders pay short holders every funding interval. This payment makes it expensive to hold longs und attractive to hold shorts, which naturally pushes the perp price back toward spot. When the perp trades below spot (negative premium), funding flips: shorts pay longs, discouraging shorts und encouraging longs.\n\nThe funding rate is typically calculated as: fundingRate = clamp(premium / 24, -maxRate, +maxRate), where the premium is the percentage difference between mark und oracle prices, divided by 24 to normalize to an hourly rate. Most protocols on Solana settle funding every hour, though some use shorter intervals (every 8 hours is common on centralized exchanges). The clamp function prevents extreme rates during flash crashes or squeezes.\n\n## How funding accrues\n\nFunding is not a continuous stream — it settles at discrete intervals. At each funding timestamp, the protocol snapshots every open position und calculates: fundingPayment = positionSize * entryPrice * fundingRate. Fuer a 10 SOL-PERP position at $25 entry mit a funding rate of 0.01% (0.0001), the payment is 10 * 25 * 0.0001 = $0.025 per interval.\n\nThe direction of payment depends on the position side und the sign of the funding rate. When the funding rate is positive: longs pay (their margin decreases) und shorts receive (their margin increases). When negative: shorts pay und longs receive. This is a zero-sum transfer — the total paid by one side exactly equals the total received by the other side, minus any protocol fees.\n\nCumulative funding matters more than any single payment. A position held fuer 24 hours accumulates 24 hourly funding payments (or 3 eight-hour payments, depending on the protocol). During trending markets, cumulative funding can become a significant drag on PnL. A long position in a strongly bullish market might show +$100 unrealized PnL but have paid -$15 in cumulative funding, reducing the real return. Risk dashboards must display both unrealized PnL und cumulative funding separately so traders see the full picture.\n\n## Funding on Solana protocols\n\nSolana perps protocols like Drift, Mango Markets, und Jupiter Perps each implement funding slightly differently. Drift uses a time-weighted average premium over 1-hour windows. Jupiter Perps uses a simpler hourly mark-to-oracle premium. Mango uses an oracle-based funding model mit configurable parameters per market. Despite these differences, the core principle is identical: positive premium means longs pay shorts.\n\nOn-chain funding settlement on Solana happens through cranked anweisungen. A keeper bot calls a \"settle funding\" anweisung at each interval, which iterates through positions und adjusts their realized PnL konten. Positions that are not explicitly settled may accumulate pending funding payments that are only applied when the position is next touched (opened, closed, or cranked). This lazy evaluation means your displayed margin may not reflect unsettled funding until you interact mit the position.\n\n## Impact on risk monitoring\n\nFuer risk console purposes, you must track: (1) the current funding rate und whether your position is paying or receiving, (2) cumulative funding paid or received since position open, (3) the net margin impact as a percentage of initial margin, und (4) projected funding cost if the current rate persists. A position that looks profitable on a PnL basis might be marginally unprofitable after accounting fuer funding drag. Always include funding in your total return calculations.\n\n## Checklist\n- Understand that positive funding rate means longs pay shorts\n- Calculate funding payment as size * price * rate per interval\n- Track cumulative funding over the position's lifetime\n- Konto fuer funding when computing real return (PnL + funding)\n- Monitor fuer extreme funding rates that signal market imbalance\n\n## Red flags\n- Ignoring funding costs in PnL reporting\n- Confusing funding direction (positive rate = longs pay)\n- Not accounting fuer lazy settlement on Solana protocols\n- Assuming funding is continuous rather than discrete-interval\n",
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
                      "Shorts pay longs — shorts are rewarded fuer being correct",
                      "Both sides pay the protocol a fee"
                    ],
                    "answerIndex": 0,
                    "explanation": "A positive premium (mark > oracle) produces a positive funding rate. Longs pay shorts, which discourages excessive long demand und pushes the perp price back toward spot."
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
            "content": "# PnL visualization: tracking profit over time\n\nProfit und loss (PnL) tracking in perpetual futures requires careful accounting across multiple dimensions: unrealized PnL from price movement, realized PnL from closed portions, funding payments, und trading fees. A well-built PnL visualization shows traders not just where they stand now, but how they arrived there — which is essential fuer risk management und strategy refinement.\n\n## Unrealized vs realized PnL\n\nUnrealized PnL represents the paper profit or loss on your open position. Fuer a long position: unrealizedPnL = size * (markPrice - entryPrice). Fuer a short: unrealizedPnL = size * (entryPrice - markPrice). This number changes mit every price tick und represents what you would gain or lose if you closed the position right now at the mark price.\n\nRealized PnL is locked in when you close all or part of a position. If you opened 10 SOL-PERP long at $20 und close 5 contracts at $25, you realize 5 * (25 - 20) = $25 profit. The remaining 5 contracts continue to have unrealized PnL based on the current mark price versus your (unchanged) entry of $20. Realized PnL is permanent — it has already been credited to your margin konto. Unrealized PnL fluctuates und may increase or decrease.\n\nTotal PnL = realized + unrealized + cumulative funding. This is the true measure of position leistung. Displaying all three components separately gives traders insight into whether their profits come from directional moves (unrealized), successful trades (realized), or favorable funding conditions.\n\n## Return on equity (ROE)\n\nROE measures the percentage return relative to the initial margin deposited. ROE = (unrealizedPnL / initialMargin) * 100. A position mit $25 unrealized PnL on $225 margin has an ROE of 11.11%. Because perpetual futures are leveraged instruments, ROE can be dramatically higher (or lower) than the percentage price change. Mit 10x leverage, a 5% price move produces approximately 50% ROE.\n\nROE is the primary leistung metric fuer comparing positions across different sizes und leverage levels. A $10 profit on $100 margin (10% ROE) represents better capital efficiency than $10 profit on $1000 margin (1% ROE), even though the dollar PnL is identical. Risk consoles should display ROE prominently alongside raw PnL.\n\n## Time-series visualization\n\nPlotting PnL over time reveals patterns invisible in a single snapshot. Key elements of a PnL time series: (1) The unrealized PnL curve, moving mit each mark price update. (2) Step changes when partial closes realize PnL. (3) Small periodic steps from funding payments. (4) The cumulative total line combining all components.\n\nFuer Solana protocols, PnL snapshots can be captured at each slot (~400ms) or aggregated into minute/hour candles fuer longer timeframes. Real-time WebSocket feeds from RPC nodes provide mark price updates, und funding payments appear as on-chain events at each settlement interval. A production risk console typically polls mark prices every 1-5 seconds und updates the PnL display accordingly.\n\n## Break-even analysis\n\nThe break-even price konten fuer all costs: trading fees, funding payments, und slippage. Fuer a long position: breakEvenPrice = entryPrice + (totalFees + cumulativeFundingPaid) / size. If you entered at $22.50 mit $0.50 in total costs on a 10-unit position, your break-even is $22.55. Displaying the break-even line on the PnL chart gives traders a clear target — the position is only truly profitable when the mark price exceeds this line.\n\n## Visualization best practices\n\nEffective PnL dashboards use color coding consistently: green fuer positive PnL, red fuer negative. The zero line should be visually prominent. Hover tooltips should show the exact PnL at any point in time. Consider showing both absolute dollar PnL und percentage ROE on dual axes. Include funding annotations as small markers on the time axis so traders can see when funding events impacted their PnL curve.\n\n## Checklist\n- Separate unrealized, realized, und funding components in the display\n- Calculate ROE relative to initial margin, not current margin\n- Include break-even price accounting fuer all costs\n- Update PnL in near-real-time using mark price feeds\n- Annotate funding events on the PnL time series\n\n## Red flags\n- Showing only unrealized PnL without funding impact\n- Computing ROE against notional value instead of margin\n- Not distinguishing realized from unrealized PnL\n- Updating PnL using oracle price instead of mark price\n",
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
            "content": "# Challenge: Calculate perpetual futures PnL\n\nImplement a PnL calculator fuer perpetual futures positions:\n\n- Compute unrealized PnL based on entry price vs mark price\n- Handle both long und short positions correctly\n- Calculate notional value as size * markPrice\n- Compute ROE (return on equity) as a percentage of initial margin\n- Format all outputs mit appropriate decimal precision\n\nYour calculator must be deterministic — same input always produces the same output.",
            "duration": "50 min",
            "hints": [
              "Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice).",
              "Notional value = size * markPrice — represents the total position value.",
              "ROE (return on equity) = unrealizedPnL / margin * 100.",
              "Use toFixed(2) fuer prices und PnL, toFixed(4) fuer size und ROE."
            ]
          },
          "perps-v2-funding-accrual": {
            "title": "Challenge: Simulate funding rate accrual",
            "content": "# Challenge: Simulate funding rate accrual\n\nBuild a funding accrual simulator that processes discrete funding intervals:\n\n- Iterate through an array of funding rates und compute the payment fuer each period\n- Longs pay (subtract from balance) when the funding rate is positive\n- Shorts receive (add to balance) when the funding rate is positive\n- Track cumulative funding, average rate, und net margin impact\n- Handle negative funding rates where the direction reverses\n\nThe simulator must be deterministic — same inputs always produce the same result.",
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
        "description": "Margin und liquidation monitoring, implementation bug traps, und deterministic risk-console outputs fuer production observability.",
        "lessons": {
          "perps-v2-margin-liquidation": {
            "title": "Margin ratio und liquidation thresholds",
            "content": "# Margin ratio und liquidation thresholds\n\nMargin is the collateral that backs a leveraged position. When the margin falls below a critical threshold relative to the position's notional value, the protocol forcibly closes the position to prevent the trader from owing more than they deposited. Understanding margin mechanics, the maintenance margin threshold, und how liquidation prices are calculated is essential fuer risk monitoring.\n\n## Initial margin und leverage\n\nInitial margin is the collateral deposited when opening a position. The leverage multiple is: leverage = notionalValue / initialMargin. A position mit $250 notional value und $25 margin is 10x leveraged. Higher leverage amplifies both gains und losses. At 10x, a 10% adverse price move wipes out 100% of the margin. At 20x, only a 5% move is needed to reach zero.\n\nSolana perps protocols typically allow leverage up to 20x or even 50x on major pairs (SOL, BTC, ETH) und lower leverage (5x-10x) on altcoins mit thinner liquidity. The maximum leverage is governed by the maintenance margin rate — a lower maintenance margin rate allows higher maximum leverage.\n\n## Maintenance margin\n\nThe maintenance margin rate (MMR) is the minimum margin ratio a position must maintain to avoid liquidation. If the MMR is 5% (0.05), the effective margin must be at least 5% of the notional value at all times. Effective margin konten fuer unrealized PnL und funding: effectiveMargin = initialMargin + unrealizedPnL + cumulativeFunding. The margin ratio is: marginRatio = effectiveMargin / notionalValue.\n\nWhen the margin ratio drops below the MMR, the position is eligible fuer liquidation. Protocols don't wait fuer the margin to reach exactly zero — the maintenance buffer ensures there is still some collateral left to cover liquidation fees, slippage, und potential bad debt. If a position's losses exceed its margin entirely, the deficit becomes \"bad debt\" that must be absorbed by an insurance fund or socialized across other traders.\n\n## Liquidation price calculation\n\nThe liquidation price is the mark price at which the margin ratio exactly equals the maintenance margin rate. Fuer a long position: liquidationPrice = entryPrice - (margin + cumulativeFunding - notional * MMR) / size. Fuer a short: liquidationPrice = entryPrice + (margin + cumulativeFunding - notional * MMR) / size.\n\nThis formula konten fuer the fact that as the mark price moves against you, both the unrealized PnL (reducing effective margin) und the notional value (the denominator of margin ratio) change simultaneously. The liquidation price is not simply \"entry price minus margin per unit\" — the maintenance margin requirement means liquidation triggers before your margin is fully depleted.\n\nFuer example, consider a 10 SOL-PERP long at $22.50 mit $225 margin und 5% MMR. The notional at entry is 10 * 22.50 = $225. Liquidation triggers when effectiveMargin / notional = 0.05, which solves to a mark price near $2.05 in this well-margined case. Mit higher leverage (less margin), the liquidation price would be much closer to entry.\n\n## Cascading liquidations\n\nDuring sharp market moves, many positions hit their liquidation prices simultaneously. Liquidation engines close these positions by selling into the order book (or AMM pools), which pushes the price further in the adverse direction, triggering more liquidations. This cascade effect — also called a \"liquidation spiral\" — can cause prices to move far beyond what fundamentals justify.\n\nOn Solana, liquidation is performed by keeper bots that submit liquidation transaktionen. These bots compete fuer liquidation opportunities because protocols offer a liquidation fee (typically 0.5-2% of the position's notional) as an incentive. During cascades, keeper bots may face congestion issues as many liquidation transaktionen compete fuer block space. Partial liquidation — closing only enough of a position to restore the margin ratio above MMR — helps reduce cascade severity by keeping some of the position alive.\n\n## Risk monitoring thresholds\n\nA production risk console should alert at multiple thresholds: (1) WARNING when the margin ratio drops below 1.5x the MMR (e.g., 7.5% when MMR is 5%), (2) CRITICAL when below the MMR itself (liquidation imminent), und (3) INFO when unrealized PnL exceeds a significant percentage of margin (positive or negative). These alerts give traders time to add margin, reduce position size, or close entirely before forced liquidation.\n\n## Checklist\n- Calculate effective margin including unrealized PnL und funding\n- Compute margin ratio as effectiveMargin / notionalValue\n- Derive liquidation price from entry price, margin, und MMR\n- Set warning thresholds above the MMR to give early alerts\n- Konto fuer liquidation fees in worst-case scenarios\n\n## Red flags\n- Computing liquidation price without accounting fuer the maintenance buffer\n- Ignoring funding in effective margin calculations\n- Not alerting traders before they reach the liquidation threshold\n- Assuming the mark price at liquidation equals the execution price (slippage exists)\n",
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
                      "To ensure remaining collateral covers liquidation fees und slippage, preventing bad debt",
                      "To make it harder fuer traders to open positions",
                      "To generate more revenue fuer the protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "The maintenance buffer ensures that when a position is liquidated, there is still margin left to pay liquidation fees und absorb slippage during the close. Without it, positions could go underwater, creating bad debt."
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
            "title": "Common bugs: sign errors, units, und funding direction",
            "content": "# Common bugs: sign errors, units, und funding direction\n\nPerpetual futures implementations are mathematically straightforward — the formulas are basic arithmetic. Yet sign errors, unit mismatches, und funding direction bugs are among the most frequent und costly mistakes in DeFi development. A single flipped sign can turn profits into losses, liquidate healthy positions, or drain insurance funds. This lektion catalogs the most common pitfalls und how to avoid them.\n\n## Sign errors in PnL calculations\n\nThe most fundamental bug: getting the sign wrong on PnL fuer short positions. Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice). Note that short PnL is NOT size * (markPrice - entryPrice) mit a negated size. The size is always positive — it represents the quantity of contracts. The direction is captured in the formula itself. A common mistake is storing size as negative fuer shorts und using a single formula: pnl = size * (markPrice - entryPrice). While mathematically equivalent when size is negative, this representation causes bugs everywhere else: notional value calculations, funding payments, margin ratios, und liquidation prices all need absolute size.\n\nRule: Keep size always positive. Branch on the side field to select the correct formula. Never rely on sign conventions embedded in other fields.\n\n## Unit und decimal mismatches\n\nSolana token amounts are raw integers (lamports, token base units). Prices from oracles are typically fixed-point numbers mit specific exponents. Mixing these without proper conversion produces catastrophically wrong values.\n\nExample: SOL has 9 decimals on-chain. If a position size is stored as 10_000_000_000 (10 SOL in lamports) und you multiply by a price of 22.50 (a floating-point dollar value), you get 225,000,000,000 — which might look like a notional value, but it is in lamports-times-dollars, a nonsensical unit. You must either convert size to human-readable units first (divide by 10^9), or keep everything in integer space mit a consistent exponent.\n\nRule: Define a canonical unit convention at the start of your project. Either work entirely in human-readable floats (acceptable fuer display/simulation code) or entirely in integer base units mit explicit scaling factors (required fuer on-chain code). Never mix the two.\n\n## Funding direction confusion\n\nThe funding direction rule is: \"positive funding rate means longs pay shorts.\" This is universal across all major protocols. Yet developers frequently implement it backwards, especially when reasoning about \"who benefits.\" When the rate is positive, the market is bullish (more longs than shorts). Longs pay to discourage the imbalance. Shorts receive as compensation fuer providing the other side.\n\nIn code, the mistake looks like this:\n- WRONG: if (side === \"long\") totalFunding += payment;\n- RIGHT: if (side === \"long\") totalFunding -= payment;\n\nWhen the funding rate is positive und the side is long, the payment reduces the trader's balance. When negative und long, the payment increases the balance (longs receive). Test every combination: positive rate + long, positive rate + short, negative rate + long, negative rate + short.\n\n## Liquidation price off-by-one\n\nThe liquidation price formula must konto fuer the maintenance margin requirement. A common bug is computing the price at which margin equals zero rather than the price at which margin equals the maintenance requirement. This results in a liquidation price that is too aggressive — the position would be liquidated later than expected, potentially accumulating bad debt.\n\nAnother variant: forgetting to include cumulative funding in the liquidation price calculation. If a long position has paid $5 in funding, its effective margin is $5 less than the initial deposit, und the liquidation price is correspondingly closer to the entry price.\n\n## Margin ratio denominator\n\nMargin ratio = effectiveMargin / notionalValue. The notional value must use the current mark price, not the entry price. Using entry price fuer notional gives an incorrect ratio because the actual exposure changes as the mark price moves. A position mit $225 entry notional that has moved to $250 mark notional has a lower margin ratio than the entry-price calculation suggests — the position has grown while the margin remains fixed.\n\n## Integer overflow in funding accumulation\n\nWhen accumulating funding over hundreds or thousands of periods, floating-point precision errors can compound. Each period adds a small number (e.g., 0.025), und after thousands of additions, the accumulated error can become material. Using fixed-point arithmetic or rounding at each step (mit a consistent rounding convention) prevents drift. In JavaScript, toFixed() at the final output step is sufficient fuer display, but mittelstufe calculations should preserve full precision.\n\n## Tests strategy\n\nEvery perps calculation should have test cases covering: (1) Long mit profit, (2) Long mit loss, (3) Short mit profit, (4) Short mit loss, (5) Positive funding rate fuer both sides, (6) Negative funding rate fuer both sides, (7) Zero funding rate, (8) Zero-margin edge case. If any single combination is missing from your test suite, the corresponding bug can ship undetected.\n\n## Checklist\n- Use separate formulas fuer long und short PnL, not sign-encoded size\n- Define und enforce a canonical unit convention (human-readable vs base units)\n- Test all four combinations of funding direction (2 sides x 2 rate signs)\n- Include maintenance margin in liquidation price calculations\n- Use mark price (not entry price) fuer notional value in margin ratio\n\n## Red flags\n- Negative position sizes used to encode short direction\n- Mixing lamport-scale und dollar-scale values in the same calculation\n- Funding payment that adds to long balances when the rate is positive\n- Liquidation price computed at zero margin instead of maintenance margin\n- Margin ratio using entry-price notional instead of mark-price notional\n",
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
                      "Negative size creates sign-convention bugs in notional, funding, margin, und liquidation calculations",
                      "Solana konten cannot store negative numbers",
                      "Positive numbers use less storage space"
                    ],
                    "answerIndex": 0,
                    "explanation": "When size carries the direction sign, every formula that uses size must konto fuer the sign — not just PnL, but also notional value, funding payments, und liquidation price. Keeping size positive und branching on a separate 'side' field is safer und more explicit."
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
            "content": "# Checkpoint: Generate a Risk Console Report\n\nBuild the comprehensive risk console report that integrates all kurs concepts:\n\n- Calculate unrealized PnL und ROE fuer the position\n- Accumulate funding payments across all provided funding rate intervals\n- Compute effective margin (initial + PnL + funding) und margin ratio\n- Derive the liquidation price accounting fuer maintenance margin und funding\n- Generate severity-tiered alerts (CRITICAL, WARNING, INFO) based on thresholds\n- Output must be stable JSON mit deterministic structure\n\nThis checkpoint validates your complete understanding of perpetual futures risk management.",
            "duration": "55 min",
            "hints": [
              "Effective margin = initial margin + unrealized PnL + funding payments.",
              "Margin ratio = effectiveMargin / notionalValue.",
              "Liquidation price fuer longs: entryPrice - (margin + funding - notional*mmRate) / size.",
              "Generate alerts based on margin ratio vs maintenance margin rate thresholds.",
              "Sort alerts by severity: CRITICAL > WARNING > INFO."
            ]
          }
        }
      }
    }
  },
  "defi-tx-optimizer": {
    "title": "DeFi Transaktion Optimizer",
    "description": "Master Solana DeFi transaktion optimization: compute/fee tuning, ALT strategy, reliability patterns, und deterministic send-strategy planning.",
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
        "title": "Transaktion Fundamentals",
        "description": "Transaktion failure diagnosis, compute budget mechanics, priority-fee strategy, und fee estimation foundations.",
        "lessons": {
          "txopt-v2-why-fail": {
            "title": "Why DeFi transaktionen fail: CU limits, size, und blockhash expiry",
            "content": "# Why DeFi transaktionen fail: CU limits, size, und blockhash expiry\n\nDeFi transaktionen on Solana fail fuer three primary reasons: compute budget exhaustion, transaktion size overflow, und blockhash expiry. Understanding each failure mode is essential before attempting any optimization, because the fix fuer each is fundamentally different. Misdiagnosing the failure category leads to wasted effort und frustrated users.\n\n## Compute budget exhaustion\n\nEvery Solana transaktion executes within a compute budget measured in compute units (CUs). The default budget is 200,000 CUs per transaktion, which is sufficient fuer simple transfers but far too low fuer complex DeFi operations. A single AMM swap through a concentrated liquidity pool can consume 100,000-200,000 CUs. Multi-hop routes, flash loans, or transaktionen that interact mit multiple protocols easily exceed 400,000 CUs. When a transaktion exceeds its compute budget, the runtime aborts execution und returns a `ComputeBudgetExceeded` error. The transaktion fee is still charged because the validator performed work before the limit was hit.\n\nThe solution is the `SetComputeUnitLimit` anweisung from the Compute Budget Program. This anweisung must be the first anweisung in the transaktion (by convention) und tells the runtime exactly how many CUs to allocate. Setting the limit too low causes failures; setting it too high wastes priority fee budget because priority fees are calculated per CU requested (not consumed). The optimal approach is to simulate the transaktion first, observe the actual CU consumption, add a 10% safety margin, und use that as the limit.\n\n## Transaktion size limits\n\nSolana transaktionen have a hard size limit of 1,232 bytes when serialized. This limit applies to the entire transaktion packet including signatures, message header, konto keys, recent blockhash, und anweisung data. Each konto key consumes 32 bytes. A transaktion referencing 30 unique konten uses 960 bytes fuer konto keys alone, leaving very little room fuer anweisung data und signatures.\n\nDeFi transaktionen are particularly konto-heavy. A single Raydium CLMM swap requires the user wallet, input token konto, output token konto, pool state, AMM config, observation state, token vaults (x2), tick arrays (up to 3), oracle, und program IDs. Chaining multiple swaps in a single transaktion can easily push the konto count past 40, which exceeds the 1,232-byte limit mit standard konto encoding. This is where Address Lookup Tables (ALTs) become essential, compressing each konto reference from 32 bytes to just 1 byte fuer konten stored in the lookup table.\n\n## Blockhash expiry\n\nEvery Solana transaktion includes a recent blockhash that serves as a replay protection mechanism und a timestamp. A blockhash is valid fuer approximately 60 seconds (roughly 150 slots at 400ms per slot). If a transaktion is not included in a block before the blockhash expires, it becomes permanently invalid und can never be processed. The transaktion simply disappears without any on-chain error record.\n\nBlockhash expiry is the most insidious failure mode because it produces no error message. The transaktion is silently dropped. This happens frequently during network congestion when transaktionen queue fuer longer than expected, or when users take too long to review und approve a transaktion in their wallet. The correct handling is to monitor fuer confirmation mit a timeout, und if the transaktion is not confirmed within 30 seconds, fetch a new blockhash, rebuild und re-sign the transaktion, und resubmit.\n\n## Interaction between failure modes\n\nThese three failure modes often interact. A developer might add more anweisungen to avoid multiple transaktionen (reducing blockhash expiry risk), but this increases both CU consumption und transaktion size. Optimizing fuer one dimension can worsen another. The art of transaktion optimization is finding the right balance: enough CU budget to complete execution, compact enough to fit in 1,232 bytes, und fast enough submission to land before the blockhash expires.\n\n## Production triage rule\n\nDiagnose transaktion failures in strict order:\n1. did it fit und simulate,\n2. did it propagate und include,\n3. did it confirm before expiry.\n\nThis sequence prevents noisy fixes und reduces false assumptions during incidents.\n\n## Diagnostic checklist\n- Check transaktion logs fuer `ComputeBudgetExceeded` when CU is the issue\n- Check serialized transaktion size against the 1,232-byte limit\n- Monitor confirmation status to detect silent blockhash expiry\n- Simulate transaktionen before sending to catch CU und konto issues early\n- Track failure rates by category to identify systemic problems\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l1-q1",
                    "prompt": "What is the default compute unit budget fuer a Solana transaktion?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "50,000 CUs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana allocates 200,000 CUs by default. DeFi transaktionen almost always need more, requiring an explicit SetComputeUnitLimit anweisung."
                  },
                  {
                    "id": "txopt-v2-l1-q2",
                    "prompt": "What happens when a transaktion's blockhash expires before it is confirmed?",
                    "options": [
                      "The transaktion is silently dropped mit no on-chain error",
                      "The transaktion fails mit a BlockhashExpired error on-chain",
                      "The validator retries mit a fresh blockhash automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired blockhash transaktionen are never processed und produce no on-chain record. The client must detect the timeout und resubmit mit a fresh blockhash."
                  }
                ]
              }
            ]
          },
          "txopt-v2-compute-budget": {
            "title": "Compute budget anweisungen und priority fee strategy",
            "content": "# Compute budget anweisungen und priority fee strategy\n\nThe Compute Budget Program provides two critical anweisungen that every serious DeFi transaktion should include: `SetComputeUnitLimit` und `SetComputeUnitPrice`. Together, they control how much computation your transaktion can perform und how much you are willing to pay fuer priority inclusion in a block.\n\n## SetComputeUnitLimit\n\nThis anweisung sets the maximum number of compute units the transaktion can consume. The value must be between 1 und 1,400,000 (the per-transaktion maximum on Solana). The anweisung takes a single u32 parameter representing the CU limit. When omitted, the runtime uses the default of 200,000 CUs.\n\nChoosing the right limit requires profiling. Use `simulateTransaction` on an RPC node to execute the transaktion without landing it on-chain. The simulation response includes `unitsConsumed`, which tells you exactly how many CUs the transaktion used. Add a 10% safety margin to this value: `Math.ceil(unitsConsumed * 1.1)`. This margin konten fuer minor variations in CU consumption between simulation und actual execution (e.g., different slot, slightly different konto state).\n\nSetting the limit exactly to the simulated value is risky because CU consumption can vary slightly between simulation und execution. Setting it 2x or 3x higher is wasteful because your priority fee is calculated against the requested limit, not the consumed amount. The 10% margin provides a good balance between safety und cost efficiency.\n\n## SetComputeUnitPrice\n\nThis anweisung sets the priority fee in micro-lamports per compute unit. A micro-lamport is one millionth of a lamport (1 lamport = 0.000000001 SOL). The priority fee is calculated as: `priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1,000,000)` lamports.\n\nFuer example, mit a CU limit of 200,000 und a CU price of 5,000 micro-lamports: `ceil(200,000 * 5,000 / 1,000,000) = ceil(1,000) = 1,000 lamports`. This is added on top of the base fee of 5,000 lamports per signature (typically one signature fuer user transaktionen).\n\n## Priority fee market dynamics\n\nSolana validatoren order transaktionen within a block by priority fee (micro-lamports per CU). During low-congestion periods, even a CU price of 1 micro-lamport is sufficient. During high-demand events (popular NFT mints, volatile market moments, new token launches), competitive CU prices can reach 100,000+ micro-lamports.\n\nThe priority fee market is highly dynamic. Strategies fuer choosing the right price include: (1) Static pricing: set a fixed CU price based on the expected congestion level. Simple but often suboptimal. (2) Recent-fee sampling: query `getRecentPrioritizationFees` from the RPC to see what fees landed in recent blocks. Use the median or 75th percentile as your price. (3) Percentile targeting: decide what probability of inclusion you want (e.g., 90% chance of landing in the next block) und price accordingly.\n\n## Fee calculation formula\n\nThe total transaktion fee follows this formula:\n\n```\nbaseFee = 5000 lamports (per signature)\npriorityFee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) lamports\ntotalFee = baseFee + priorityFee\n```\n\nWhen building a transaktion planner, these calculations must use integer arithmetic to match on-chain behavior. Floating-point rounding differences can cause fee estimate mismatches that confuse users.\n\n## Anweisung ordering\n\nCompute budget anweisungen must appear before any other anweisungen in the transaktion. The runtime processes them during transaktion validation, before executing program anweisungen. Placing them after other anweisungen is technically allowed but violates convention und may cause issues mit some tools und wallets.\n\n## Praktisch recommendations\n- Always include both SetComputeUnitLimit und SetComputeUnitPrice\n- Simulate first, then set CU limit to ceil(consumed * 1.1)\n- Sample recent fees und use the 75th percentile fuer reliable inclusion\n- Display the total fee estimate to users before they sign\n- Cap the CU limit at 1,400,000 (Solana maximum per transaktion)\n",
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
                      "CU consumption can vary slightly between simulation und execution due to state changes",
                      "The runtime does not accept exact values",
                      "Simulation always underreports CU usage by 50%"
                    ],
                    "answerIndex": 0,
                    "explanation": "Konto state may change between simulation und execution, causing minor CU variations. A 10% margin absorbs these differences."
                  }
                ]
              }
            ]
          },
          "txopt-v2-cost-explorer": {
            "title": "Transaktion cost estimation und fee planning",
            "content": "# Transaktion cost estimation und fee planning\n\nAccurate fee estimation is the foundation of a good DeFi user experience. Users need to know what a transaktion will cost before they sign it. Validatoren need sufficient fees to prioritize your transaktion. Getting fee estimation right means understanding the components, profiling real transaktionen, und adapting to market conditions.\n\n## Components of transaktion cost\n\nA Solana transaktion's cost has three components: (1) the base fee, which is 5,000 lamports per signature und is fixed by protocol; (2) the priority fee, which is variable und determined by the compute unit price you set; und (3) the rent cost fuer any new konten created by the transaktion (e.g., creating an Associated Token Konto costs approximately 2,039,280 lamports in rent-exempt minimum balance).\n\nFuer DeFi transaktionen that do not create new konten, the cost is simply base fee plus priority fee. Fuer transaktionen that create ATAs or other konten, the rent deposits significantly increase the total cost und should be displayed separately in the UI since rent is recoverable when the konto is closed.\n\n## CU profiling\n\nProfiling compute unit consumption across different operation types builds an estimation model. Common DeFi operations und their typical CU ranges:\n\n- SOL transfer: 2,000-5,000 CUs\n- SPL token transfer: 4,000-8,000 CUs\n- Create ATA (idempotent): 25,000-35,000 CUs\n- Simple AMM swap (constant product): 60,000-120,000 CUs\n- CLMM swap (concentrated liquidity): 100,000-200,000 CUs\n- Multi-hop route (2 legs): 200,000-400,000 CUs\n- Flash loan + swap: 300,000-600,000 CUs\n\nThese ranges vary based on pool state, tick array crossings in CLMM pools, und program version. Profiling your specific use case mit simulation produces much more accurate estimates than using generic ranges.\n\n## Fee market analysis\n\nThe priority fee market fluctuates based on network demand. During quiet periods (off-peak hours, low volatility), median priority fees hover around 1-100 micro-lamports per CU. During peak events, fees can spike to 10,000-1,000,000+ micro-lamports per CU.\n\nFetching recent fee data from `getRecentPrioritizationFees` returns fee levels from the last 150 slots. Computing percentiles (25th, 50th, 75th, 90th) from this data provides a fee distribution that informs pricing strategy:\n- 25th percentile: economy — may take multiple blocks to land\n- 50th percentile: standard — lands in 1-2 blocks under normal conditions\n- 75th percentile: fast — high probability of next-block inclusion\n- 90th percentile: urgent — nearly guaranteed next-block inclusion\n\n## Fee tiers fuer user selection\n\nPresent fee estimates at multiple priority levels so users can choose their urgency. A typical tier structure:\n\n- Low priority: 100 micro-lamports/CU — suitable fuer non-urgent operations\n- Medium priority: 1,000 micro-lamports/CU — standard DeFi operations\n- High priority: 10,000 micro-lamports/CU — time-sensitive trades\n\nEach tier produces a different total fee: `baseFee + ceil(cuLimit * tierPrice / 1,000,000)`. Display all three alongside estimated confirmation times to help users make informed decisions.\n\n## Dynamic fee adjustment\n\nProduction systems should adjust fee tiers based on real-time market data rather than using static values. Query recent fees every 10-30 seconds und update the tier prices to reflect current conditions. During congestion spikes, automatically increase the default tier to ensure transaktionen land. During quiet periods, reduce fees to save users money.\n\n## Cost display best practices\n- Show total fee in both lamports und SOL equivalent\n- Separate base fee, priority fee, und rent deposits\n- Indicate the priority level und expected confirmation time\n- Update fee estimates in real-time as market conditions change\n- Warn users when fees are unusually high compared to recent averages\n",
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
            "title": "Challenge: Build a transaktion plan mit compute budgeting",
            "content": "# Challenge: Build a transaktion plan mit compute budgeting\n\nBuild a transaktion planning function that analyzes a set of anweisungen und produces a complete transaktion plan:\n\n- Sum estimatedCU from all anweisungen und add a 10% safety margin (ceiling)\n- Cap the compute unit limit at 1,400,000 (Solana maximum)\n- Calculate priority fee: ceil(computeUnitLimit * computeUnitPrice / 1,000,000)\n- Calculate total fee: base fee (5,000 lamports) + priority fee\n- Count unique konto keys across all anweisungen\n- Add 2 to anweisung count fuer SetComputeUnitLimit und SetComputeUnitPrice\n- Flag needsVersionedTx when unique konten exceed 35\n\nYour plan must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Sum estimatedCU from all anweisungen, then add 10% margin: ceil(total * 1.1).",
              "Cap compute unit limit at 1,400,000 (Solana max).",
              "Priority fee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) in lamports.",
              "Total fee = base fee (5000 lamports) + priority fee.",
              "Versioned tx needed when unique konto keys exceed 35."
            ]
          }
        }
      },
      "txopt-v2-optimization": {
        "title": "Optimization & Strategy",
        "description": "Address Lookup Table planning, reliability/retry patterns, actionable error UX, und full send-strategy reporting.",
        "lessons": {
          "txopt-v2-lut-planner": {
            "title": "Challenge: Plan Address Lookup Table usage",
            "content": "# Challenge: Plan Address Lookup Table usage\n\nBuild a function that determines the optimal Address Lookup Table strategy fuer a transaktion:\n\n- Collect all unique konto keys across anweisungen\n- Check which keys exist in available LUTs\n- Calculate transaktion size: base overhead (200 bytes) + keys * 32 bytes each\n- Mit LUT: non-LUT keys cost 32 bytes, LUT keys cost 1 byte each\n- Recommend \"legacy\" if the transaktion fits in 1,232 bytes without LUT\n- Recommend \"use-existing-lut\" if LUT keys make it fit\n- Recommend \"create-new-lut\" if it still does not fit even mit available LUTs\n- Return byte savings from LUT usage\n\nYour planner must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Collect all unique konto keys across anweisungen into a set.",
              "Each key costs 32 bytes without LUT, 1 byte mit LUT.",
              "Base transaktion overhead is ~200 bytes. Max legacy tx size is 1232 bytes.",
              "Recommend 'legacy' if fits without LUT, 'use-existing-lut' if LUT helps enough, 'create-new-lut' if still too large."
            ]
          },
          "txopt-v2-reliability": {
            "title": "Reliability patterns: retry, re-quote, resend vs rebuild",
            "content": "# Reliability patterns: retry, re-quote, resend vs rebuild\n\nProduction DeFi applications must handle transaktion failures gracefully. The difference between a frustrating und a reliable experience comes down to retry strategy: knowing when to resend the same transaktion, when to rebuild mit fresh parameters, und when to abort und inform the user.\n\n## Failure classification\n\nTransaktion failures fall into two categories: retryable und non-retryable. Correct classification is the foundation of any retry strategy.\n\nRetryable failures include: (1) blockhash expired -- the transaktion was not included in time, re-fetch blockhash und resend; (2) network timeout -- the RPC node did not respond, try again or switch nodes; (3) rate limiting (HTTP 429) -- back off und retry after the specified delay; (4) node behind -- the RPC node's slot is behind the cluster, try a different node; und (5) transaktion not found after send -- may need to resend.\n\nNon-retryable failures include: (1) insufficient funds -- user does not have enough balance; (2) slippage exceeded -- pool price moved beyond tolerance, must re-quote; (3) konto does not exist -- expected konto is missing; (4) program error mit specific error code -- the program logic rejected the transaktion; und (5) invalid anweisung data -- the transaktion was constructed incorrectly.\n\n## Resend vs rebuild\n\nResending means submitting the exact same signed transaktion bytes again. This is safe because Solana deduplicates transaktionen by signature -- if the original transaktion was already processed, the resend is ignored. Resending is appropriate when: the transaktion was sent but confirmation timed out, the RPC node returned a transient error, or you suspect the transaktion was not propagated to the leader.\n\nRebuilding means constructing a new transaktion from scratch mit fresh parameters: new blockhash, possibly updated konto state, re-simulated CU estimate, und new signature. Rebuilding is necessary when: the blockhash expired (cannot resend mit stale blockhash), slippage was exceeded (pool state changed, need fresh quote), or konto state changed (e.g., ATA was created by another transaktion in the meantime).\n\nThe decision tree is: if the failure is a network/delivery issue, resend; if the failure indicates stale state, rebuild; if the failure indicates a permanent problem (insufficient balance, invalid anweisung), abort mit a clear error.\n\n## Exponential backoff mit jitter\n\nRetry timing must use exponential backoff to avoid overwhelming the network during congestion. The formula is:\n\n```\ndelay = baseDelay * (backoffMultiplier ^ attemptNumber) + random jitter\n```\n\nMit a base delay of 500ms und a 2x multiplier: attempt 1 waits ~500ms, attempt 2 waits ~1,000ms, attempt 3 waits ~2,000ms. Adding random jitter of +/-25% prevents synchronized retries from many clients hitting the same RPC endpoint simultaneously.\n\nCap retries at 3 attempts fuer user-initiated transaktionen. More retries introduce unacceptable latency (users do not want to wait 10+ seconds). Fuer backend/automated transaktionen, higher retry counts (5-10) may be acceptable.\n\n## Blockhash refresh on retry\n\nEvery retry that involves rebuilding must fetch a fresh blockhash. Using the same blockhash across retries is dangerous because the blockhash may have already expired or be close to expiry. The retry flow is: (1) fetch new blockhash, (2) rebuild transaktion message mit new blockhash, (3) re-sign mit user wallet (or programmatic keypair), (4) simulate the rebuilt transaktion, (5) send if simulation succeeds.\n\nFuer wallet-connected applications, re-signing requires another user interaction (wallet popup). To minimize this friction, some applications use durable nonces instead of blockhashes. Durable nonces do not expire, eliminating the need to re-sign on retry. However, durable nonces have their own complexity und are not universally supported.\n\n## User-facing retry UX\n\nPresent retry progress clearly: show the attempt number, what went wrong, und what is happening next. Example states: \"Sending transaktion...\" -> \"Transaktion not confirmed, retrying (2/3)...\" -> \"Refreshing quote...\" -> \"Success!\" or \"Failed after 3 attempts. [Try Again] [Cancel]\". Never retry silently -- users should always know what is happening mit their transaktion.\n\n## Checklist\n- Classify every failure as retryable or non-retryable\n- Use exponential backoff (500ms base, 2x multiplier) mit jitter\n- Cap retries at 3 fuer user-initiated transaktionen\n- Refresh blockhash on every rebuild attempt\n- Distinguish resend (same bytes) from rebuild (new transaktion)\n- Show retry progress in the UI mit clear status messages\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l6-q1",
                    "prompt": "When should you rebuild a transaktion instead of resending it?",
                    "options": [
                      "When the blockhash has expired or pool state has changed",
                      "Whenever any error occurs",
                      "Only when the user manually clicks retry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Rebuilding is necessary when the transaktion's blockhash is stale or when on-chain state has changed (e.g., slippage exceeded). Simple network issues only require resending the same bytes."
                  },
                  {
                    "id": "txopt-v2-l6-q2",
                    "prompt": "Why add random jitter to retry delays?",
                    "options": [
                      "To prevent many clients from retrying at the exact same moment und overwhelming the network",
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
            "title": "UX: actionable error messages fuer transaktion failures",
            "content": "# UX: actionable error messages fuer transaktion failures\n\nRaw Solana error messages are cryptic. \"Transaktion simulation failed: Error processing Anweisung 2: custom program error: 0x1771\" tells a developer something but tells a user nothing. Mapping program errors to clear, actionable messages is essential fuer DeFi application quality.\n\n## Error taxonomy\n\nSolana transaktion errors fall into several categories, each requiring different user-facing treatment:\n\nWallet errors: insufficient SOL balance, insufficient token balance, wallet disconnected, user rejected signature request. These are the most common und simplest to handle. The message should state what is missing und how to fix it: \"Insufficient SOL balance. You need at least 0.05 SOL to cover transaktion fees. Current balance: 0.01 SOL.\"\n\nProgram errors: these are custom error codes from on-chain programs. Each program defines its own error codes. Fuer example, Jupiter aggregator might return error 6001 fuer \"slippage tolerance exceeded,\" while Raydium returns a different code fuer the same concept. Maintaining a mapping from program ID + error code to human-readable messages is necessary fuer each protocol you integrate mit.\n\nNetwork errors: RPC node unavailable, connection timeout, rate limited. These are transient und should be presented mit automatic retry: \"Network temporarily unavailable. Retrying in 3 seconds...\" The user should not need to take action unless all retries fail.\n\nCompute errors: compute budget exceeded, transaktion too large. These indicate the transaktion was constructed incorrectly (from the user's perspective). The message should explain the situation und offer a solution: \"Transaktion too complex fuer a single submission. Splitting into two transaktionen...\"\n\n## Mapping program errors\n\nThe most important error mappings fuer DeFi applications:\n\nSlippage exceeded: \"Price moved beyond your tolerance of X%. The swap would give you less than your minimum output of Y tokens. Tap 'Refresh Quote' to get an updated price.\" This is actionable -- the user can refresh und try again.\n\nInsufficient liquidity: \"Not enough liquidity in the pool fuer this swap size. Try reducing the swap amount or using a different route.\" This tells the user what to do.\n\nStale oracle: \"Price oracle data is outdated. This can happen during high volatility. Please wait a moment und try again.\" This sets expectations.\n\nKonto not initialized: \"Your token konto fuer [TOKEN] needs to be created first. This will cost approximately 0.002 SOL in rent.\" This explains the additional cost.\n\n## Error message principles\n\nGood error messages follow these principles: (1) State what happened in plain language. Not \"Error 0x1771\" but \"The swap price changed too much.\" (2) Explain why it happened. \"Prices move quickly during high volatility.\" (3) Tell the user what to do. \"Tap Refresh to get an updated quote, or increase your slippage tolerance.\" (4) Provide technical details in a collapsible section fuer power users: \"Program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4, Error: 6001 (SlippageToleranceExceeded).\"\n\n## Error recovery flows\n\nEach error category should have a defined recovery flow:\n\nBalance errors: show current balance, required balance, und a link to fund the wallet or swap fuer the needed token. Pre-calculate the exact shortfall.\n\nSlippage errors: automatically re-quote mit the same parameters. If the new quote is acceptable, present it mit a \"Swap at new price\" button. If the price moved significantly, warn the user before proceeding.\n\nTimeout errors: show a transaktion explorer link so the user can verify whether the transaktion actually succeeded. Include a \"Check Status\" button that polls the signature. Many apparent failures are actually successes where the confirmation was slow.\n\nSimulation errors: catch these before sending. If simulation fails, do not prompt the user to sign. Instead, show the mapped error und recovery action. This saves users from paying fees on doomed transaktionen.\n\n## Logging und monitoring\n\nLog every error mit full context: timestamp, wallet address (anonymized), transaktion signature (if available), program ID, error code, mapped message, und recovery action taken. This data drives improvements: if 80% of errors are slippage-related, you need better default slippage settings or dynamic adjustment. If compute errors spike, your CU estimation model needs tuning.\n\n## Checklist\n- Map all known program error codes to human-readable messages\n- Include actionable recovery steps in every error message\n- Provide technical details in a collapsible section\n- Automatically re-quote on slippage failures\n- Log all errors mit full context fuer monitoring\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "txopt-v2-l7-errors",
                "title": "Error Mapping Examples",
                "steps": [
                  {
                    "cmd": "Raw: custom program error: 0x1771",
                    "output": "Mapped: \"Price moved beyond your 0.5% tolerance. Tap Refresh fuer updated quote.\"",
                    "note": "Slippage exceeded -> actionable message"
                  },
                  {
                    "cmd": "Raw: Attempt to debit an account but found no record of a prior credit",
                    "output": "Mapped: \"Insufficient SOL balance. Need 0.05 SOL, have 0.01 SOL. Fund wallet to continue.\"",
                    "note": "Balance error -> show exact shortfall"
                  },
                  {
                    "cmd": "Raw: Transaction was not confirmed in 30.00 seconds",
                    "output": "Mapped: \"Transaktion pending. Check status or retry mit higher priority fee.\" [Check Status] [Retry]",
                    "note": "Timeout -> offer both check und retry options"
                  }
                ]
              }
            ]
          },
          "txopt-v2-send-strategy": {
            "title": "Checkpoint: Generate a send strategy report",
            "content": "# Checkpoint: Generate a send strategy report\n\nBuild the final send strategy report that combines all kurs concepts into a comprehensive transaktion optimization plan:\n\n- Build a tx plan: sum CU estimates mit 10% margin (capped at 1,400,000), calculate priority fee, count unique konten und total anweisungen (+2 fuer compute budget)\n- Plan LUT strategy: calculate sizes mit und without LUT, recommend legacy / use-existing-lut / create-new-lut\n- Generate fee estimates at three priority tiers: low (100 uL/CU), medium (1,000 uL/CU), high (10,000 uL/CU)\n- Include a fixed retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash\n- Preserve the input timestamp in the output\n\nThis checkpoint validates your complete understanding of transaktion optimization.",
            "duration": "55 min",
            "hints": [
              "Combine tx plan building und LUT planning into one comprehensive report.",
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
    "description": "Master production mobile wallet signing on Solana: Android MWA sessions, iOS deep-link constraints, resilient retries, und deterministic session telemetry.",
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
        "description": "Platform constraints, connection UX patterns, signing timeline behavior, und typed request construction across Android/iOS.",
        "lessons": {
          "mobilesign-v2-reality-check": {
            "title": "Mobile signing reality check: Android vs iOS constraints",
            "content": "# Mobile signing reality check: Android vs iOS constraints\n\nMobile wallet signing on Solana is fundamentally different from browser-based wallet interactions. The constraints imposed by Android und iOS operating systems shape every design decision, from session management to error handling. Understanding these platform differences is essential before writing any signing code.\n\n## Android und Mobile Wallet Adapter (MWA)\n\nOn Android, the Solana Mobile Wallet Adapter (MWA) protocol provides a persistent communication channel between dApps und wallet applications. MWA leverages Android's ability to run foreground services, which means the wallet application can maintain an active session while the user interacts mit the dApp. The protocol uses a WebSocket-like association mechanism: the dApp sends an association intent, the wallet responds mit a session token, und subsequent sign requests flow over this persistent channel.\n\nThe key advantage of MWA on Android is session continuity. Once a user authorizes a dApp, the wallet maintains an active session that can handle multiple sign requests without requiring the user to switch applications. The foreground service keeps the communication channel alive even when the wallet is not in the foreground. This enables flows like batch signing, sequential transaktion approval, und real-time status updates.\n\nAndroid MWA sessions have a lifecycle tied to the association. The dApp initiates an association via an Android intent, receives a session object, und can then issue authorize, sign_transactions, sign_messages, und sign_and_send_transactions requests. Sessions persist until explicitly deauthorized, the wallet terminates them, or the session TTL expires. Typical TTL values range from 5 minutes to 24 hours depending on the wallet implementation.\n\nHowever, Android is not without constraints. The user must have a compatible MWA wallet installed (Phantom, Solflare, or other MWA-compatible wallets). The association intent may fail if no compatible wallet is found, requiring graceful fallback. Additionally, Android battery optimization und Doze mode can interrupt foreground services on some manufacturer-modified Android builds (Samsung, Xiaomi), requiring careful handling of session interruption.\n\n## iOS limitations und deep link patterns\n\niOS presents a fundamentally different challenge. Apple does not allow arbitrary background processes or persistent inter-app communication channels. There is no equivalent to Android's foreground service pattern. When a user switches from a dApp (typically a web view or native app) to a wallet app, the dApp's execution context is suspended. There is no way to maintain a WebSocket or persistent channel between the two applications.\n\nOn iOS, wallet interactions rely on deep links und universal links. The dApp constructs a signing request, encodes it into a URL, und opens the wallet via a deep link. The wallet processes the request, und returns the result via a callback deep link back to the dApp. Each sign request requires a full app switch: dApp to wallet, user approval, wallet back to dApp.\n\nThis round-trip app switching has significant UX implications. Each signature requires 2-4 seconds of visual context switching. Users see the iOS app transition animation, must locate the approve button in the wallet, und then return to the dApp. Batch signing is particularly painful because each transaktion in the batch requires a separate app switch (unless the wallet supports batch approval in a single deep link payload).\n\nSession persistence on iOS is effectively impossible in the traditional sense. The dApp cannot know if the wallet is still running, whether the user closed it, or if iOS terminated it fuer memory pressure. Every request must be treated as potentially the first request in a new session. This means encoding all necessary context (app identity, cluster, authorization state) into every deep link request.\n\n## What actually works in production\n\nProduction mobile dApps adopt a hybrid strategy. On Android, they detect MWA support und use the persistent session model. On iOS, they fall back to deep link patterns mit aggressive local caching to minimize the data that must be re-transmitted on each request. Cross-platform frameworks like the Solana Mobile SDK abstract some of these differences, but developers must still handle platform-specific edge cases.\n\nFallback patterns include: QR code-based WalletConnect sessions (works on both platforms but adds latency), embedded browser wallets (avoid app switching but sacrifice sicherheit), und progressive web app approaches mit browser extension wallets. Each fallback has trade-offs in sicherheit, UX, und feature completeness.\n\nThe most robust approach is capability detection at runtime: check fuer MWA support, fall back to deep links, und ultimately offer QR-based connection as a universal fallback. Each path should provide appropriate UX feedback so users understand why the experience differs across devices.\n\n## Shipping principle fuer mobile signing\n\nDesign fuer interruption by default. Assume app switches, OS suspension, network drops, und wallet restarts are normal events. A resilient signing flow recovers state quickly und keeps users informed at each step.\n\n## Checklist\n- Detect MWA availability on Android before attempting association\n- Implement deep link fallback fuer iOS und non-MWA Android\n- Handle session interruption from OS-level process management\n- Cache session state locally fuer faster reconnection\n- Provide clear UX fuer each connection method\n\n## Red flags\n- Assuming MWA works identically on iOS und Android\n- Not handling foreground service termination on Android\n- Ignoring deep link callback failures on iOS\n- Hardcoding a single wallet without fallback detection\n",
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
                    "explanation": "Android MWA uses foreground services to maintain a persistent communication channel between the dApp und wallet, enabling multi-request sessions without app switching."
                  },
                  {
                    "id": "mobilesign-v2-l1-q2",
                    "prompt": "Why can't iOS maintain persistent wallet sessions like Android?",
                    "options": [
                      "iOS suspends app execution on background transitions, preventing persistent channels",
                      "iOS wallets do not support Solana",
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
            "title": "Wallet connection UX patterns: connect, reconnect, und recovery",
            "content": "# Wallet connection UX patterns: connect, reconnect, und recovery\n\nWallet connection on mobile is the first interaction users have mit your dApp. A smooth connection flow builds trust; a broken one drives users away. This lektion covers the connection lifecycle, automatic reconnection strategies, network mismatch handling, und user-friendly error states.\n\n## Initial connection flow\n\nThe connection flow begins mit capability detection. Before presenting any wallet UI, your dApp should determine what connection methods are available. On Android, check fuer installed MWA-compatible wallets by attempting to resolve the MWA association intent. On iOS, check fuer registered deep link handlers. If neither is available, offer a QR code or WalletConnect fallback.\n\nOnce a connection method is selected, the authorization flow begins. Fuer MWA on Android, this involves sending an authorize request mit your app identity (name, URI, icon). The wallet displays a consent screen showing your dApp's identity und requested permissions. Upon approval, the wallet returns an auth token und the user's public key. Store both: the public key fuer display und transaktion building, the auth token fuer session resumption.\n\nFuer deep link connections on iOS, the flow is: construct an authorize deep link mit your app identity und callback URI, open the wallet, wait fuer the callback deep link mit the auth result, und parse the response. The response includes the public key und optionally a session token fuer subsequent requests.\n\nConnection state should be persisted locally. Store the wallet address, connection method, auth token, und timestamp. This enables automatic reconnection on app restart without requiring the user to re-authorize. Use secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) fuer auth tokens.\n\n## Automatic reconnection\n\nWhen the dApp restarts or returns from background, attempt silent reconnection before showing any wallet UI. The reconnection flow checks: is there a stored auth token? Is it still valid (not expired)? Can we re-establish the communication channel?\n\nOn Android mit MWA, reconnection involves re-associating mit the wallet using the stored auth token. If the wallet accepts the token, the session resumes transparently. If the token is expired or revoked, fall back to a fresh authorization flow. The key is making this check fast (under 500ms) so the user does not see a loading state.\n\nOn iOS, reconnection is simpler but less reliable. Check if the stored wallet address is still valid by verifying the konto exists on-chain. The auth token from the previous deep link session may or may not be accepted by the wallet on the next interaction. Optimistically display the stored wallet address und handle re-authorization lazily when the first sign request fails.\n\n## Network mismatch handling\n\nNetwork mismatches occur when the dApp expects one cluster (e.g., mainnet-beta) but the wallet is configured fuer another (e.g., devnet). This is a common source of confusing errors: transaktionen build correctly but fail on submission because they reference konten that do not exist on the wallet's configured cluster.\n\nDetection strategies include: requesting the wallet's current cluster during authorization, comparing the cluster in sign responses against expectations, und catching specific RPC errors that indicate cluster mismatch (e.g., konto not found fuer well-known program addresses).\n\nWhen a mismatch is detected, present a clear error message: \"Your wallet is connected to devnet, but this dApp requires mainnet-beta. Please switch your wallet's network und reconnect.\" Avoid technical jargon. Some wallets support programmatic cluster switching via the MWA protocol; use this when available.\n\n## User-friendly error states\n\nError states must be actionable. Users should always know what happened und what to do next. Common error states und their UX patterns:\n\nWallet not found: \"No compatible wallet detected. Install Phantom or Solflare to continue.\" Include direct links to app stores.\n\nAuthorization denied: \"Wallet connection was declined. Tap Connect to try again.\" Do not repeatedly prompt; wait fuer user action.\n\nSession expired: \"Your wallet session has expired. Tap to reconnect.\" Attempt silent reconnection first; only show this if silent reconnection fails.\n\nNetwork error: \"Unable to reach the Solana network. Check your internet connection und try again.\" Distinguish between local network issues und RPC endpoint failures.\n\nWallet disconnected: \"Your wallet was disconnected. This can happen if the wallet app was closed. Tap to reconnect.\" On Android, this may indicate the foreground service was killed.\n\n## Recovery patterns\n\nRecovery should be automatic when possible und manual when necessary. Implement a connection state machine mit states: disconnected, connecting, connected, reconnecting, und error. Transitions between states should be deterministic und logged fuer debugging.\n\nThe reconnecting state is critical. When a connected session fails (e.g., the wallet app crashes), transition to reconnecting und attempt up to 3 silent reconnection attempts mit exponential backoff (1s, 2s, 4s). If all attempts fail, transition to error und present the manual reconnection UI.\n\n## Checklist\n- Detect available connection methods before showing wallet UI\n- Store auth tokens securely fuer automatic reconnection\n- Handle network mismatch mit clear user messaging\n- Implement connection state machine mit deterministic transitions\n- Provide actionable error states mit recovery options\n\n## Red flags\n- Showing raw error codes to users\n- Repeatedly prompting fuer authorization after denial\n- Not persisting connection state across app restarts\n- Ignoring network mismatch silently\n",
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
                      "Display a loading spinner fuer 3 seconds"
                    ],
                    "answerIndex": 0,
                    "explanation": "Capability detection ensures you only present connection methods that are actually available on the user's device."
                  },
                  {
                    "id": "mobilesign-v2-l2-q2",
                    "prompt": "How should a dApp handle a network mismatch between itself und the wallet?",
                    "options": [
                      "Display a clear message asking the user to switch their wallet's network",
                      "Silently retry the transaktion on a different cluster",
                      "Ignore the mismatch und hope it resolves"
                    ],
                    "answerIndex": 0,
                    "explanation": "Network mismatches should be communicated clearly to the user mit anweisungen on how to resolve them, avoiding confusing silent failures."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-timeline-explorer": {
            "title": "Signing session timeline: request, wallet, und response flow",
            "content": "# Signing session timeline: request, wallet, und response flow\n\nUnderstanding the complete lifecycle of a mobile signing request is essential fuer building reliable dApps. Every sign request passes through multiple stages, each mit its own failure modes und timing constraints. This lektion traces a request from construction to final response.\n\n## Request construction phase\n\nThe signing flow begins in the dApp when user action triggers a transaktion. The dApp constructs the transaktion: fetching a recent blockhash, building anweisungen, setting the fee payer, und serializing the transaktion into a byte array. On mobile, this construction phase must be fast because the user is waiting fuer the wallet to appear.\n\nKey timing constraint: the recent blockhash has a limited validity window (typically 60-90 seconds on mainnet, determined by the slots-per-epoch configuration). If transaktion construction takes too long (e.g., due to slow RPC responses), the blockhash may expire before the wallet even sees the transaktion. Production dApps pre-fetch blockhashes und refresh them periodically.\n\nThe constructed transaktion is encoded (typically base64 fuer MWA, or URL-safe base64 fuer deep links) und wrapped in a sign request object. The sign request includes metadata: the app identity, requested cluster, und a unique request ID fuer tracking. On MWA, this is sent over the session channel. On iOS deep links, it is encoded into the URL.\n\n## Wallet-side processing\n\nOnce the wallet receives the sign request, it enters its own processing pipeline. The wallet decodes the transaktion, simulates it (if the wallet supports simulation), extracts human-readable information fuer the approval screen, und presents the transaktion details to the user.\n\nSimulation is a critical step. Wallets like Phantom simulate transaktionen before showing them to users, detecting potential failures, extracting token transfer amounts, und identifying program interactions. Simulation adds 1-3 seconds to the wallet-side processing time but significantly improves the user experience by showing accurate fee estimates und transfer amounts.\n\nThe approval screen shows: the requesting dApp's identity (name, icon, URI), the transaktion type (transfer, swap, mint, etc.), amounts being transferred, estimated fees, und any warnings (e.g., interaction mit unverified programs). The user can approve or reject. The time spent on this screen is unpredictable und depends entirely on the user.\n\n## Response handling\n\nAfter the user approves (or rejects), the wallet constructs und returns a response. Fuer approved transaktionen, the response contains the signed transaktion bytes (the original transaktion mit the wallet's signature appended). Fuer rejected transaktionen, the response contains an error code und message.\n\nOn MWA, the response arrives over the same session channel. The dApp receives a callback mit the signed transaktion or error. On iOS deep links, the wallet opens the dApp's callback URL mit the response encoded in the URL parameters or fragment.\n\nResponse parsing must be defensive. Check that the response contains a valid signature, that the transaktion bytes match the original request (to detect tampering), und that the response corresponds to the correct request ID. Wallets may return responses out of order if multiple requests were queued.\n\n## Timeout scenarios\n\nTimeouts are the most challenging failure mode in mobile signing. A timeout can occur at multiple points: during request delivery (the wallet never received the request), during user decision (the user walked away), during response delivery (the wallet signed but the response was lost), or during submission (the signed transaktion was sent but confirmation timed out).\n\nEach timeout requires a different recovery strategy. Request delivery timeout: retry the request. User decision timeout: show a \"waiting fuer wallet\" UI mit a cancel option. Response delivery timeout: check on-chain fuer the transaktion signature before retrying (to avoid double-signing). Submission timeout: poll fuer transaktion status before resubmitting.\n\nA reasonable timeout configuration fuer mobile: 30 seconds fuer the complete round-trip (request to response), mit a 60-second grace period fuer user decision on the wallet side. If the MWA session itself times out, re-associate before retrying. If the deep link callback never arrives, present a manual \"I've approved in my wallet\" button that triggers a status check.\n\n## The complete timeline\n\nA typical successful signing flow takes 3-8 seconds on Android MWA und 6-15 seconds on iOS deep links. The breakdown: transaktion construction (0.5-2s), request delivery (0.1-0.5s on MWA, 1-3s on deep link), wallet simulation (1-3s), user approval (variable), response delivery (0.1-0.5s on MWA, 1-3s on deep link), und transaktion submission (0.5-2s).\n\n## Checklist\n- Pre-fetch blockhashes to minimize construction time\n- Include unique request IDs fuer response correlation\n- Handle all timeout scenarios mit appropriate recovery\n- Parse responses defensively mit signature validation\n- Provide real-time status feedback during the signing flow\n\n## Red flags\n- Using stale blockhashes that expire during signing\n- Not correlating responses mit request IDs\n- Treating all timeouts identically\n- Missing the case where a transaktion was signed but the response was lost\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mobilesign-v2-l3-timeline",
                "title": "Signing Session Timeline",
                "steps": [
                  {
                    "cmd": "T+0.0s  dApp: build transaction",
                    "output": "Fetch blockhash, construct anweisungen, serialize to base64",
                    "note": "Transaktion construction phase"
                  },
                  {
                    "cmd": "T+0.5s  dApp -> wallet: sign_transactions request",
                    "output": "{\"type\":\"transaktion\",\"payload\":\"AQAAA...\",\"requestId\":\"req_001\"}",
                    "note": "Request sent via MWA session or deep link"
                  },
                  {
                    "cmd": "T+1.0s  wallet: simulate transaction",
                    "output": "{\"fee\":\"0.000005 SOL\",\"transfers\":[{\"to\":\"7Y4f...\",\"amount\":\"1.5 SOL\"}]}",
                    "note": "Wallet simulates und extracts display info"
                  },
                  {
                    "cmd": "T+1.5s  wallet: show approval screen",
                    "output": "User sees: Send 1.5 SOL to 7Y4f... | Fee: 0.000005 SOL | [Approve] [Reject]",
                    "note": "User decision - timing is unpredictable"
                  },
                  {
                    "cmd": "T+3.0s  wallet -> dApp: signed response",
                    "output": "{\"signedPayloads\":[\"AQAAA...signed...\"],\"requestId\":\"req_001\"}",
                    "note": "Signed transaktion returned to dApp"
                  },
                  {
                    "cmd": "T+3.5s  dApp: submit to RPC",
                    "output": "{\"signature\":\"5UzM...\",\"confirmationStatus\":\"confirmed\"}",
                    "note": "Transaktion submitted und confirmed on-chain"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-sign-request": {
            "title": "Challenge: Build a typed sign request",
            "content": "# Challenge: Build a typed sign request\n\nImplement a sign request builder fuer Mobile Wallet Adapter:\n\n- Validate the payload type (transaktion or message)\n- Validate payload data (base64 fuer transaktionen, non-empty string fuer messages)\n- Set session metadata (app identity mit name, URI, und icon)\n- Validate the cluster (mainnet-beta, devnet, or testnet)\n- Generate a request ID if not provided\n- Return a structured SignRequest mit validation results\n\nYour implementation will be tested against valid requests, message signing requests, und invalid inputs mit multiple errors.",
            "duration": "50 min",
            "hints": [
              "Validate type is either 'transaktion' or 'message' before checking payload format.",
              "Transaktion payloads must be valid base64 (A-Z, a-z, 0-9, +, /, optional = padding, length divisible by 4).",
              "App identity requires at least name und URI. Icon is optional but should default to empty string.",
              "Generate a requestId from type + payload prefix if not provided."
            ]
          }
        }
      },
      "mobilesign-v2-production": {
        "title": "Production Patterns",
        "description": "Session persistence, transaktion-review safety, retry state machines, und deterministic session reporting fuer production mobile apps.",
        "lessons": {
          "mobilesign-v2-session-persist": {
            "title": "Challenge: Session persistence und restoration",
            "content": "# Challenge: Session persistence und restoration\n\nImplement a session persistence manager fuer mobile wallet sessions:\n\n- Process a sequence of actions: save, restore, clear, und expire_check\n- Track wallet address und last sign request ID across actions\n- Handle session expiry based on TTL und timestamps\n- Return the final session state mit a complete action log\n\nEach action modifies the session state. Save establishes a session, restore checks if it is still valid, clear removes it, und expire_check verifies TTL bounds.",
            "duration": "50 min",
            "hints": [
              "Process actions sequentially: each action modifies the session state.",
              "Save sets walletAddress, lastRequestId, sessionActive=true, und expiresAt = timestamp + TTL.",
              "Restore succeeds only if session is active UND current time < expiresAt.",
              "Expire check clears session if current time >= expiresAt."
            ]
          },
          "mobilesign-v2-review-screens": {
            "title": "Mobile transaktion review: what users need to see",
            "content": "# Mobile transaktion review: what users need to see\n\nTransaktion review screens are the last line of defense between a user und a potentially harmful transaktion. On mobile, screen real estate is limited und user attention is fragmented. Designing effective review screens requires understanding what information matters, how to present it, und what simulation results to surface.\n\n## Human-readable transaktion summaries\n\nRaw transaktion data is meaningless to most users. A transaktion containing a SystemProgram.transfer anweisung should display \"Send 1.5 SOL to 7Y4f...T6aY\" rather than showing serialized anweisung bytes. The translation from on-chain anweisungen to human-readable summaries is one of the most important UX challenges in mobile wallet development.\n\nSummary generation involves: identifying the program being called (System Program, Token Program, a known DeFi protocol), decoding the anweisung data according to the program's IDL or known layout, extracting the relevant parameters (amounts, addresses, token mints), und formatting them fuer display. Unknown programs should show a warning: \"Interaction mit unverified program: Prog1111...\".\n\nAddress formatting on mobile requires truncation. Full Solana addresses (32-44 characters) do not fit on mobile screens. The standard pattern is showing the first 4 und last 4 characters mit an ellipsis: \"7Y4f...T6aY\". Always provide a way to view the full address (tap to expand or copy). Fuer known addresses (well-known programs, token mints), show the human-readable name instead: \"USDC Token Program\" rather than \"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\".\n\nToken amounts must include decimals und symbols. A raw amount of 1500000 fuer a USDC transfer should display as \"1.50 USDC\", not \"1500000 lamports\". This requires knowing the token's decimal places und symbol, which can be fetched from the token mint's metadata or a local registry of known tokens.\n\n## Fee display und estimation\n\nTransaktion fees on Solana are low but not zero. Users should see the estimated fee before approving. The base fee (currently 5000 lamports or 0.000005 SOL) plus any priority fee should be displayed clearly. If the transaktion includes compute budget anweisungen that set a custom fee, extract und display the total.\n\nFee estimation can use simulation results. The Solana RPC simulateTransaction method returns the compute units consumed, which combined mit the priority fee rate gives an accurate fee estimate. Display fees in both SOL und the user's preferred fiat currency if possible.\n\nFuer transaktionen that interact mit DeFi protocols, additional costs may apply: swap fees, protocol fees, slippage impact. These should be itemized separately from the network transaktion fee. A swap review screen might show: \"Swap 10 USDC fuer ~0.05 SOL | Network fee: 0.000005 SOL | Protocol fee: 0.01 USDC | Preiseinfluss: 0.1%\".\n\n## Simulation results\n\nTransaktion simulation is the most powerful tool fuer transaktion review. Before showing the approval screen, simulate the transaktion und extract: balance changes (SOL und token konten), new konten that will be created, konten that will be closed, und any errors or warnings.\n\nBalance change summaries are the most intuitive way to present transaktion effects. Show a list of changes: \"-1.5 SOL from your wallet\", \"+150 USDC to your wallet\", \"-0.000005 SOL (network fee)\". Color-code decreases (red) und increases (green) fuer quick visual scanning.\n\nSimulation can detect potential issues: insufficient balance, konto ownership conflicts, program errors, und excessive compute usage. Surface these as warnings before the user approves. A warning like \"This transaktion will fail: insufficient SOL balance\" saves the user from paying a fee fuer a failed transaktion.\n\n## Approval UX patterns\n\nThe approve und reject buttons must be unambiguous. Use distinct colors (green fuer approve, red/grey fuer reject), sufficient spacing to prevent accidental taps, und clear labels (\"Approve\" und \"Reject\", not \"OK\" und \"Cancel\"). Consider requiring a deliberate gesture (swipe to approve) fuer high-value transaktionen.\n\nBiometric confirmation adds sicherheit fuer high-value transaktionen. After the user taps approve, prompt fuer fingerprint or face recognition before signing. This prevents unauthorized transaktionen if the device is unlocked but unattended. Make biometric confirmation optional und configurable.\n\nLoading states during signing should show progress: \"Signing transaktion...\", \"Submitting to network...\", \"Waiting fuer confirmation...\". Never show a blank screen or spinner without context. If the process takes longer than expected, show a message: \"This is taking longer than usual. Your transaktion is still processing.\"\n\n## Checklist\n- Translate anweisungen to human-readable summaries\n- Truncate addresses mit first 4 und last 4 characters\n- Show token amounts mit correct decimals und symbols\n- Display simulation-based fee estimates\n- Surface balance changes mit color coding\n- Require deliberate approval gestures fuer high-value transaktionen\n\n## Red flags\n- Showing raw anweisung bytes to users\n- Displaying token amounts without decimal conversion\n- Missing fee information on approval screens\n- No simulation before transaktion approval\n- Approve und reject buttons too close together\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l6-q1",
                    "prompt": "How should token amounts be displayed on a mobile transaktion review screen?",
                    "options": [
                      "Mit correct decimal places und token symbol (e.g., 1.50 USDC)",
                      "As raw lamports or smallest unit values",
                      "In scientific notation fuer precision"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts must be converted to human-readable format using the token's decimal configuration und include the symbol fuer clarity."
                  },
                  {
                    "id": "mobilesign-v2-l6-q2",
                    "prompt": "What is the most intuitive way to present transaktion simulation results?",
                    "options": [
                      "Balance change summaries mit color-coded increases und decreases",
                      "Raw simulation logs from the RPC response",
                      "A list of all konten the transaktion touches"
                    ],
                    "answerIndex": 0,
                    "explanation": "Balance change summaries (e.g., -1.5 SOL, +150 USDC) are the most user-friendly way to communicate what a transaktion will do."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-retry-patterns": {
            "title": "One-tap retry: handling offline, rejected, und timeout states",
            "content": "# One-tap retry: handling offline, rejected, und timeout states\n\nMobile environments are inherently unreliable. Users move between WiFi und cellular, enter tunnels, close apps mid-transaktion, und wallets crash. A robust retry system is not optional; it is a core requirement fuer production mobile dApps. This lektion covers retry state machines, offline detection, user-initiated retry, und mobile-appropriate backoff strategies.\n\n## Retry state machine\n\nEvery sign request in a mobile dApp should be managed by a state machine mit well-defined states und transitions. The core states are: idle, pending, signing, submitted, confirmed, failed, und retrying. Each state has specific allowed transitions und associated UI.\n\nIdle: no active request. Transition to pending when the user initiates an action.\n\nPending: the request is being constructed (fetching blockhash, building transaktion). Transition to signing when the request is sent to the wallet, or to failed if construction fails (e.g., RPC unreachable).\n\nSigning: waiting fuer wallet response. Transition to submitted if the wallet returns a signed transaktion, to failed if the wallet rejects, or to retrying if the signing times out.\n\nSubmitted: the signed transaktion has been sent to the network. Transition to confirmed when the transaktion is finalized, or to failed if submission fails or confirmation times out.\n\nConfirmed: terminal success state. Display success UI und clean up.\n\nFailed: non-terminal failure state. Analyze the failure reason und determine if retry is appropriate. Transition to retrying if the failure is retryable, or remain in failed if it is terminal (e.g., user explicitly rejected).\n\nRetrying: preparing to retry. Refresh stale data (new blockhash, updated balances), wait fuer backoff period, then transition back to pending.\n\n## Offline detection\n\nMobile offline detection is more nuanced than checking navigator.onLine. That property only indicates whether the device has a network interface active, not whether the Solana RPC endpoint is reachable. Implement a multi-layer detection strategy.\n\nLayer 1: Network interface status. Use the device's network state API to detect complete disconnection (airplane mode, no signal). This is instant und covers the most obvious case.\n\nLayer 2: RPC health check. Periodically ping the Solana RPC endpoint mit a lightweight request (getHealth or getSlot). If this fails but the network interface is up, the issue is likely RPC-specific. Try a fallback RPC endpoint before declaring offline status.\n\nLayer 3: Transaktion-level detection. If a transaktion submission returns a network error, mark the request as failed-offline rather than failed-permanent. This distinction drives the retry logic: offline failures should be retried when connectivity returns, while permanent failures (insufficient funds, invalid transaktion) should not.\n\nWhen offline is detected, queue pending sign requests locally. Display an offline banner: \"You are offline. Your transaktion will be submitted when connectivity returns.\" When connectivity is restored, process the queue in order, refreshing blockhashes fuer any queued transaktionen (they will have expired).\n\n## User-initiated retry\n\nNot all retries should be automatic. When a transaktion fails, present the user mit context und a clear retry option. The retry button should be prominent (primary action), und the error context should be concise.\n\nFuer wallet rejection: \"Transaktion was declined in your wallet. [Try Again]\". The retry re-opens the wallet mit the same request. Do not automatically retry rejected transaktionen; respect the user's decision und only retry on explicit user action.\n\nFuer timeout: \"Wallet did not respond in time. This may happen if the wallet app was closed. [Retry] [Cancel]\". Before retrying, check if the transaktion was already signed und submitted (to avoid double-signing).\n\nFuer network errors: \"Could not reach the Solana network. [Retry When Online]\". This button should be disabled while offline und automatically trigger when connectivity returns.\n\nFuer submission failures: \"Transaktion could not be confirmed. [Retry mit New Blockhash]\". This re-constructs the transaktion mit a fresh blockhash und re-submits. Show the previous failure reason to build user confidence.\n\n## Exponential backoff on mobile\n\nMobile backoff must be more aggressive than server-side backoff because users are waiting und watching. Start mit a 1-second delay, double on each retry, und cap at 8 seconds. After 3 failed retries, stop automatic retrying und present a manual retry option.\n\nThe backoff sequence fuer automatic retries: 1s, 2s, 4s, then stop. Fuer user-initiated retries, do not apply backoff (the user explicitly chose to retry, so execute immediately). Fuer offline queue processing, use a 2-second delay between queued items to avoid overwhelming the RPC endpoint when connectivity returns.\n\nJitter is important even on mobile. Add a random 0-500ms offset to each retry delay to prevent thundering herd problems when many users come back online simultaneously (e.g., after a widespread network outage).\n\nDisplay retry progress to the user: \"Retrying in 3... 2... 1...\" or \"Attempt 2 of 3\". Never retry silently; users should always know the dApp is working on their behalf.\n\n## Checklist\n- Implement a state machine fuer every sign request lifecycle\n- Detect offline state at network, RPC, und transaktion levels\n- Queue transaktionen locally when offline\n- Refresh blockhashes before retrying queued transaktionen\n- Use mobile-appropriate backoff: 1s, 2s, 4s, then manual\n- Show retry progress und attempt counts to users\n\n## Red flags\n- Automatically retrying user-rejected transaktionen\n- Using server-side backoff timing (30s+) on mobile\n- Retrying mit stale blockhashes\n- Silently retrying without user visibility\n- Not checking fuer already-submitted transaktionen before retry\n",
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
                    "output": "Opening wallet fuer approval... requestId=req_001",
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
                    "note": "Automatic retry mit fresh blockhash"
                  },
                  {
                    "cmd": "State: retrying -> signing",
                    "output": "Re-opening wallet fuer approval... requestId=req_001_r1",
                    "note": "New request sent mit updated blockhash"
                  },
                  {
                    "cmd": "State: signing -> submitted",
                    "output": "Wallet approved. Submitting tx: 5UzM...",
                    "note": "Signed transaktion submitted to network"
                  },
                  {
                    "cmd": "State: submitted -> confirmed",
                    "output": "Transaktion confirmed in slot 234567890. Success!",
                    "note": "Terminal success state"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-session-report": {
            "title": "Checkpoint: Generate a session report",
            "content": "# Checkpoint: Generate a session report\n\nImplement a session report generator that summarizes a complete mobile signing session:\n\n- Count total requests, successful signs, und failed signs\n- Sum retry attempts across all requests\n- Calculate session duration from start und end timestamps\n- Break down requests by type (transaktion vs message)\n- Produce deterministic JSON output fuer consistent reporting\n\nThis checkpoint validates your understanding of session lifecycle, request tracking, und deterministic output generation.",
            "duration": "55 min",
            "hints": [
              "Count requests by status: 'signed' = success, 'rejected'/'timeout'/'error' = failure.",
              "Sum retries across all requests fuer total retry attempts.",
              "Session duration = sessionEnd - sessionStart in seconds.",
              "Request breakdown counts how many were 'transaktion' vs 'message' type."
            ]
          }
        }
      }
    }
  },
  "solana-pay-commerce": {
    "title": "Solana Pay Commerce",
    "description": "Master Solana Pay commerce integration: robust URL encoding, QR/payment tracking workflows, confirmation UX, und deterministic POS reconciliation artifacts.",
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
        "description": "Solana Pay specification, URL encoding rigor, transfer request anatomy, und deterministic builder/encoder patterns.",
        "lessons": {
          "solanapay-v2-mental-model": {
            "title": "Solana Pay mentales modell und URL encoding rules",
            "content": "# Solana Pay mentales modell und URL encoding rules\n\nSolana Pay is an open specification fuer encoding payment requests into URLs that wallets can parse und execute. Unlike traditional payment processors that rely on centralized intermediaries, Solana Pay enables direct peer-to-peer value transfer by embedding all the information a wallet needs into a single URI string. Understanding this specification deeply is the foundation fuer building any commerce integration on Solana.\n\nThe Solana Pay specification defines two distinct request types: transfer requests und transaktion requests. Transfer requests are the simpler of the two — they encode a recipient address, an amount, und optional metadata directly in the URL. The wallet parses the URL, constructs a standard SOL or SPL token transfer transaktion, und submits it to the network. Transaktion requests are more powerful — the URL points to an API endpoint that returns a serialized transaktion fuer the wallet to sign. This allows the merchant server to build arbitrarily complex transaktionen (multi-anweisung, program interactions, etc.) while the wallet simply signs what it receives.\n\nThe URL format follows a strict schema. A transfer request URL takes the form: `solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>&memo=<memo>`. The scheme is always `solana:` (not `solana://`). The recipient is a base58-encoded Solana public key placed immediately after the colon mit no slashes. Query parameters encode the payment details.\n\nEach parameter has specific encoding rules. The `amount` is a decimal string representing the number of tokens (not lamports or raw units). Fuer native SOL, `amount=1.5` means 1.5 SOL. Fuer SPL tokens, the amount is in the token's human-readable units respecting its decimals. The `spl-token` parameter is optional — when absent, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token. The `reference` parameter is one or more base58 public keys that are added as non-signer keys in the transfer anweisung, enabling transaktion discovery via `getSignaturesForAddress`. The `label` identifies the merchant or payment recipient in a human-readable format. The `message` provides a description of the payment purpose. Both `label` und `message` must be URL-encoded using percent-encoding (spaces become `%20`, special characters like `#` become `%23`).\n\nWhen should you use transfer requests versus transaktion requests? Transfer requests are ideal fuer simple point-of-sale payments where the merchant only needs to receive a fixed amount of a single token. They work entirely client-side — no server needed. Transaktion requests are necessary when the payment involves multiple anweisungen (e.g., creating an associated token konto, interacting mit a program, splitting payments among multiple recipients, or including on-chain metadata). Transaktion requests require a server endpoint that the wallet calls to fetch the transaktion.\n\nURL encoding correctness is critical. A malformed URL will be rejected by compliant wallets. Common mistakes include: using `solana://` instead of `solana:`, encoding the recipient address incorrectly, omitting percent-encoding fuer special characters in labels, und providing amounts in raw token units instead of human-readable decimals. The specification requires that all base58 values are valid Solana public keys (32 bytes when decoded), und that amounts are non-negative finite decimal numbers.\n\nThe reference key mechanism is what makes Solana Pay praktisch fuer commerce. By generating a unique keypair per transaktion und including its public key as a reference, the merchant can poll `getSignaturesForAddress(reference)` to detect when the payment arrives. This eliminates the need fuer webhooks or push notifications — the merchant simply polls until the reference appears in a confirmed transaktion, then verifies the transfer details match the expected payment.\n\n## Commerce operator rule\n\nThink in terms of order-state guarantees, not just payment detection:\n1. request created,\n2. payment observed,\n3. payment validated,\n4. fulfillment released.\n\nEach step needs explicit checks so fulfillment never races ahead of verification.\n\n## Checklist\n- Use `solana:` scheme (no double slashes)\n- Place the recipient base58 address directly after the colon\n- Encode label und message mit encodeURIComponent\n- Use human-readable decimal amounts, not raw lamport values\n- Generate a unique reference keypair per payment fuer tracking\n\n## Red flags\n- Using `solana://` instead of `solana:`\n- Sending raw lamport amounts in the amount field\n- Forgetting to URL-encode label und message parameters\n- Reusing reference keys across multiple payments\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l1-q1",
                    "prompt": "What is the correct URL scheme fuer Solana Pay transfer requests?",
                    "options": [
                      "solana:<recipient> (single colon, no slashes)",
                      "solana://<recipient> (double slashes like HTTP)",
                      "pay:<recipient> (custom pay scheme)"
                    ],
                    "answerIndex": 0,
                    "explanation": "The Solana Pay specification uses the 'solana:' scheme followed immediately by the recipient address mit no slashes."
                  },
                  {
                    "id": "solanapay-v2-l1-q2",
                    "prompt": "When should you use a transaktion request instead of a transfer request?",
                    "options": [
                      "When the payment requires multiple anweisungen or program interactions beyond a simple transfer",
                      "When the amount exceeds 100 SOL",
                      "When paying mit native SOL instead of SPL tokens"
                    ],
                    "answerIndex": 0,
                    "explanation": "Transaktion requests allow the server to build arbitrarily complex transaktionen. Transfer requests only support simple single-token transfers."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-transfer-anatomy": {
            "title": "Transfer request anatomy: recipient, amount, reference, und labels",
            "content": "# Transfer request anatomy: recipient, amount, reference, und labels\n\nA Solana Pay transfer request URL contains everything a wallet needs to construct und submit a payment transaktion. Each component of the URL serves a specific purpose in the payment flow. Understanding the anatomy of these requests — und how each field maps to on-chain behavior — is essential fuer building reliable commerce integrations.\n\nThe recipient address is the most critical field. It appears immediately after the `solana:` scheme und must be a valid base58-encoded Solana public key. Fuer native SOL transfers, this is the wallet address that will receive the SOL. Fuer SPL token transfers, this is the wallet address whose associated token konto (ATA) will receive the tokens. The wallet application is responsible fuer deriving the correct ATA from the recipient address und the SPL token mint. If the recipient's ATA does not exist, the wallet must create it as part of the transaktion (using `createAssociatedTokenAccountIdempotent`). A malformed or invalid recipient address will cause the wallet to reject the payment request entirely.\n\nThe amount parameter specifies how much to transfer in human-readable decimal form. Fuer native SOL, `amount=2.5` means 2.5 SOL (2,500,000,000 lamports internally). Fuer USDC (6 decimals), `amount=10.50` means 10.50 USDC (10,500,000 raw units). The wallet handles the conversion from decimal to raw units based on the token's decimal configuration. This design keeps the URL readable by humans und consistent across tokens mit different decimal places. The amount must be a positive finite number — zero, negative, or infinite values are invalid.\n\nThe spl-token parameter distinguishes SOL transfers from SPL token transfers. When omitted, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token to transfer. Common examples include USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`), USDT (`Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx`), und any other SPL token. The wallet validates that the mint exists und that the sender has a sufficient balance before constructing the transaktion.\n\nThe reference parameter is what makes Solana Pay viable fuer real-time commerce. A reference is a base58-encoded public key that gets added as a non-signer konto in the transfer anweisung. After the transaktion confirms, anyone can call `getSignaturesForAddress(reference)` to find the transaktion containing this reference. The merchant generates a unique reference keypair fuer each payment request, encodes the public key in the URL, und then polls the Solana RPC to detect when a matching transaktion appears. Multiple references can be included by repeating the parameter: `reference=<key1>&reference=<key2>`. This is useful when multiple parties need to independently track the same payment.\n\nThe label parameter identifies the merchant or payment recipient. It appears in the wallet's confirmation dialog so the user knows who they are paying. Fuer example, `label=Sunrise%20Coffee` tells the user they are paying \"Sunrise Coffee.\" The label must be URL-encoded — spaces become `%20`, ampersands become `%26`, und other special characters use standard percent-encoding. Keeping labels concise (under 50 characters) ensures they display properly across different wallet implementations.\n\nThe message parameter provides additional context about the payment. It might include an order number, item description, or other merchant-specific information. Like the label, it must be URL-encoded. Example: `message=Order%20%23157%20-%202x%20Espresso`. Some wallets display the message in a secondary line below the label, while others may truncate long messages. The memo parameter (not to be confused mit message) adds an on-chain memo anweisung to the transaktion, creating a permanent on-chain record. Use message fuer display purposes und memo fuer data that must be recorded on-chain.\n\nThe complete flow works as follows: (1) the merchant generates a unique reference keypair, (2) constructs the Solana Pay URL mit all parameters, (3) encodes the URL into a QR code or deep link, (4) the customer scans/clicks und their wallet parses the URL, (5) the wallet constructs the transfer transaktion including the reference as a non-signer konto, (6) the customer approves und the wallet submits the transaktion, (7) the merchant polls `getSignaturesForAddress(reference)` until it finds the confirmed transaktion, (8) the merchant verifies the transaktion details match the expected payment.\n\n## Checklist\n- Validate recipient is a proper base58 public key (32-44 characters)\n- Use human-readable decimal amounts matching the token's precision\n- Generate a fresh reference keypair fuer every payment request\n- URL-encode label und message mit encodeURIComponent\n- Include spl-token only when transferring SPL tokens, not native SOL\n\n## Red flags\n- Reusing the same reference across multiple payment requests\n- Providing amounts in raw lamports or smallest token units\n- Forgetting URL encoding on label or message (breaks parsing)\n- Not validating the recipient address format before URL construction\n",
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
                      "It is added as a non-signer konto, allowing getSignaturesForAddress to find the transaktion",
                      "It creates a webhook that notifies the merchant",
                      "It stores the payment ID in the transaktion memo"
                    ],
                    "answerIndex": 0,
                    "explanation": "The reference public key is included as a non-signer konto in the transfer anweisung. The merchant polls getSignaturesForAddress(reference) to detect when the payment transaktion confirms."
                  },
                  {
                    "id": "solanapay-v2-l2-q2",
                    "prompt": "What amount value represents 2.5 USDC in a Solana Pay URL?",
                    "options": [
                      "amount=2.5 (human-readable decimal)",
                      "amount=2500000 (raw units mit 6 decimals)",
                      "amount=2500000000 (raw units mit 9 decimals)"
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
            "content": "# URL builder: live preview of Solana Pay URLs\n\nBuilding Solana Pay URLs correctly requires understanding how each parameter contributes to the final encoded string. In this lektion, we walk through the construction process step by step, examining how different combinations of parameters produce different URLs und how encoding rules affect the output.\n\nThe base URL always starts mit the `solana:` scheme followed by the recipient address. There are no slashes, no host, no path segments — just the scheme colon und the base58 address. Fuer example: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. This alone is a valid Solana Pay URL, though it lacks an amount und would prompt the wallet to request the amount from the user.\n\nAdding query parameters transforms the base URL into a complete payment request. The first parameter is separated from the recipient by `?`, und subsequent parameters are separated by `&`. Parameter order does not affect validity, but convention places amount first fuer readability. A SOL transfer fuer 1.5 SOL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5`.\n\nAdding an SPL token changes the transfer type. Including `spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` tells the wallet this is a USDC transfer, not a SOL transfer. The amount is still in human-readable form — `amount=10` means 10 USDC, not 10 raw units. The wallet reads the mint's decimal configuration from the chain und converts accordingly.\n\nThe reference parameter enables payment detection. Each payment should include a unique reference public key. In practice, you generate a Keypair, extract its public key as a base58 string, und include it: `reference=Ref1111111111111111111111111111111111111111`. After the customer pays, you poll `getSignaturesForAddress` mit this reference to find the transaktion. Multiple references can be included fuer multi-party tracking.\n\nURL encoding fuer labels und messages follows standard percent-encoding rules. The JavaScript function `encodeURIComponent` handles this correctly. Spaces become `%20`, the hash symbol becomes `%23`, ampersands become `%26`, und so on. Fuer example, a label \"Joe's Coffee & Tea\" encodes to `label=Joe's%20Coffee%20%26%20Tea`. Failing to encode these characters breaks the URL parser — an unencoded `&` in a label would be interpreted as a parameter separator, splitting the label und creating an invalid parameter.\n\nLet us trace through a complete example. A coffee shop wants to charge 4.25 USDC fuer order number 157. The shop's wallet address is `7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. They generate a reference key `Ref1111111111111111111111111111111111111111`. The resulting URL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=4.25&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111&label=Sunrise%20Coffee&message=Order%20%23157`.\n\nValidation before encoding catches errors early. Before building the URL, verify: the recipient is a valid base58 string of 32-44 characters, the amount is a positive finite number, the spl-token (if provided) is a valid base58 string, und the reference (if provided) is a valid base58 string. Emitting clear error messages fuer each validation failure helps developers debug integration issues quickly.\n\nEdge cases to handle: (1) amounts mit many decimal places — truncate to the token's decimal precision, (2) empty or whitespace-only labels — omit the parameter entirely rather than including an empty value, (3) extremely long messages — some wallets truncate at 256 characters, (4) Unicode characters in labels — encodeURIComponent handles UTF-8 encoding correctly, but test mit your target wallets.\n\n## Checklist\n- Start mit `solana:` followed immediately by the recipient address\n- Use `?` before the first parameter und `&` between subsequent ones\n- Apply encodeURIComponent to label und message values\n- Validate all base58 fields before building the URL\n- Test generated URLs mit multiple wallet implementations\n\n## Red flags\n- Including raw unencoded special characters in labels or messages\n- Building URLs mit invalid or unvalidated recipient addresses\n- Using fixed reference keys instead of generating unique ones per payment\n- Omitting the spl-token parameter fuer SPL token transfers\n",
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
                    "note": "SPL token transfer mit tracking reference"
                  },
                  {
                    "cmd": "Full payment URL with message",
                    "output": "solana:7Y4f...T6aY?amount=4.25&spl-token=EPjF...Dt1v&reference=Ref1...1111&label=Sunrise%20Coffee&message=Order%20%23157",
                    "note": "Complete POS payment request mit all fields"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-encode-transfer": {
            "title": "Challenge: Encode a Solana Pay transfer request URL",
            "content": "# Challenge: Encode a Solana Pay transfer request URL\n\nBuild a function that encodes a Solana Pay transfer request URL from input parameters:\n\n- Validate the recipient address (must be 32-44 characters of valid base58)\n- Validate the amount (must be a positive finite number)\n- Construct the URL mit the `solana:` scheme und query parameters\n- Apply encodeURIComponent to label und message fields\n- Include spl-token und reference only when provided\n- Return validation errors when inputs are invalid\n\nYour encoder must be fully deterministic — same input always produces the same URL.",
            "duration": "50 min",
            "hints": [
              "Solana Pay URL format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>",
              "Validate recipient: must be 32-44 characters of valid base58.",
              "Amount must be a positive finite number.",
              "Use encodeURIComponent fuer label und message to handle special characters."
            ]
          }
        }
      },
      "solanapay-v2-implementation": {
        "title": "Tracking & Commerce",
        "description": "Reference tracking state machines, confirmation UX, failure handling, und deterministic POS receipt generation.",
        "lessons": {
          "solanapay-v2-reference-tracker": {
            "title": "Challenge: Track payment references through confirmation states",
            "content": "# Challenge: Track payment references through confirmation states\n\nBuild a reference tracking state machine that processes payment events:\n\n- States flow: pending -> found -> confirmed -> finalized (or pending -> expired)\n- The \"found\" event transitions from pending und records the transaktion signature\n- The \"confirmation\" event increments the confirmation counter und transitions from found to confirmed\n- The \"finalized\" event transitions from confirmed to finalized\n- The \"timeout_check\" event expires the reference if still pending after expiryTimeout seconds\n- Record every state transition in a history array mit from, to, und timestamp\n\nYour tracker must be fully deterministic — same event sequence always produces the same result.",
            "duration": "50 min",
            "hints": [
              "Track state transitions: pending -> found -> confirmed -> finalized.",
              "The 'found' event sets the signature. 'confirmation' increments the counter.",
              "Timeout check expires the reference if still pending after expiryTimeout seconds.",
              "Record each state change in the history array."
            ]
          },
          "solanapay-v2-confirmation-ux": {
            "title": "Confirmation UX: pending, confirmed, und expired states",
            "content": "# Confirmation UX: pending, confirmed, und expired states\n\nThe user experience during payment confirmation is the most critical moment in any Solana Pay integration. Between the customer scanning the QR code und the merchant acknowledging receipt, there is a window of uncertainty that must be managed mit clear visual feedback, appropriate timeouts, und graceful error handling. Getting this right determines whether customers trust your payment system.\n\nThe confirmation lifecycle follows a well-defined state machine. After the QR code is displayed, the system enters the **pending** state — waiting fuer the customer to scan und submit the transaktion. The merchant's system continuously polls `getSignaturesForAddress(reference)` looking fuer a matching transaktion. When a signature appears, the system transitions to the **found** state. The transaktion has been submitted but may not yet be confirmed. The system then calls `getTransaction(signature)` to verify the payment details (recipient, amount, token) match the expected values. Once the transaktion reaches sufficient confirmations, the state moves to **confirmed**. After the transaktion is finalized (maximum commitment level, irreversible), the state reaches **finalized** und the merchant can safely release goods or services.\n\nEach state requires distinct visual treatment. In the **pending** state, display the QR code prominently mit a scanning animation or subtle pulse effect. Show a countdown timer indicating how long the payment request remains valid (typically 2-5 minutes). Include the amount, token, und merchant name so the customer can verify before scanning. A \"Waiting fuer payment...\" message mit a spinner keeps the customer informed.\n\nThe **found** state is brief but important. When the transaktion is detected, immediately replace the QR code mit a checkmark or success animation. Display \"Payment detected — confirming...\" to signal progress. This instant visual feedback is critical — customers need to know their payment was received even before it confirms. Show the transaktion signature (abbreviated, e.g., \"sig: abc1...xyz9\") fuer reference. If you have a Solana Explorer link, provide it.\n\nThe **confirmed** state means the transaktion has at least one confirmation. Fuer low-value transaktionen (coffee, small merchandise), this is sufficient to complete the sale. Display a prominent green checkmark, the confirmed amount, und the transaktion reference. Print or display a receipt. Fuer high-value transaktionen, you may want to wait fuer finalized status before releasing goods.\n\nThe **finalized** state is the strongest guarantee — the transaktion is part of a rooted slot und cannot be reverted. This takes roughly 6-12 seconds after initial confirmation. Fuer most point-of-sale applications, waiting fuer finalized is unnecessary und adds friction. However, fuer digital goods delivery, API key provisioning, or any irreversible fulfillment, finalized is the safe threshold.\n\nThe **expired** state handles the timeout case. If no matching transaktion appears within the expiry window (e.g., 120 seconds), the payment request expires. Display \"Payment request expired\" mit an option to generate a new QR code. Never silently expire — the customer may have just scanned und needs to know the request is no longer valid. The expiry timeout should be generous enough fuer the customer to open their wallet, review the transaktion, und approve it (60-120 seconds minimum).\n\nError states require careful messaging. \"Transaktion not found after timeout\" suggests the customer did not complete the payment. \"Transaktion found but details mismatch\" indicates a potential issue — the amount or recipient does not match expectations. \"Network error during polling\" should trigger automatic retries before displaying an error to the user. Always provide actionable next steps: \"Try again,\" \"Generate new QR,\" or \"Contact support.\"\n\nPolling strategy affects both UX responsiveness und RPC load. Start polling immediately after displaying the QR code. Use a 1-second interval fuer the first 30 seconds (fast detection), then slow to 2-3 seconds fuer the remainder of the window. After detecting the transaktion, switch to polling `getTransaction` mit increasing commitment levels: processed -> confirmed -> finalized. Use exponential backoff if the RPC returns errors.\n\nAccessibility considerations fuer payment confirmation: (1) Do not rely solely on color to indicate state — use icons, text labels, und animations. (2) Provide audio feedback (a subtle chime on confirmation) fuer environments where the screen may not be visible. (3) Ensure the QR code has sufficient contrast und size fuer scanning from a reasonable distance (at least 300x300 pixels). (4) Support both light und dark themes fuer the confirmation UI.\n\n## Checklist\n- Show distinct visual states: pending, found, confirmed, finalized, expired\n- Display a countdown timer during the pending state\n- Provide instant visual feedback when the transaktion is detected\n- Implement appropriate expiry timeouts (60-120 seconds)\n- Offer actionable next steps on expiry or error\n\n## Red flags\n- No visual feedback between QR display und confirmation\n- Silent expiry without notifying the customer\n- Waiting fuer finalized on low-value point-of-sale transaktionen\n- Polling too aggressively (every 100ms) und overloading the RPC\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l6-q1",
                    "prompt": "When is 'confirmed' commitment sufficient versus waiting fuer 'finalized'?",
                    "options": [
                      "Confirmed is sufficient fuer low-value POS transaktionen; finalized is needed fuer irreversible digital fulfillment",
                      "Always wait fuer finalized regardless of transaktion value",
                      "Confirmed is never sufficient — always use finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fuer coffee-shop-scale payments, confirmed commitment provides a strong enough guarantee. Finalized adds 6-12 seconds of latency und is only necessary when fulfillment is irreversible."
                  },
                  {
                    "id": "solanapay-v2-l6-q2",
                    "prompt": "What should happen when the payment request expires?",
                    "options": [
                      "Display a clear expiry message mit an option to generate a new QR code",
                      "Silently restart the polling loop",
                      "Redirect the customer to a different payment method"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired requests should be clearly communicated. The customer may have been in the middle of approving — they need to know the request expired und can try again."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-error-handling": {
            "title": "Error handling und edge cases in payment flows",
            "content": "# Error handling und edge cases in payment flows\n\nProduction payment systems encounter a wide range of failure modes that must be handled gracefully. Solana Pay integrations face challenges unique to blockchain payments: network congestion, RPC failures, partial transaktion visibility, und edge cases around token konten. Building robust error handling separates demo-quality code from production-grade commerce systems.\n\nRPC connectivity failures are the most common operational issue. The merchant's polling loop depends on a reliable connection to a Solana RPC endpoint. When the RPC is unreachable (network outage, rate limiting, endpoint downtime), the polling loop must not crash or silently stop. Implement retry logic mit exponential backoff: first retry after 500ms, second after 1 second, third after 2 seconds, capping at 5 seconds between retries. After 5 consecutive failures, display a degraded-mode warning to the operator (\"Network connectivity issue — payment detection may be delayed\") while continuing to retry in the background. Never abandon polling due to transient RPC errors.\n\nRate limiting from RPC providers is a specific failure mode. Free-tier RPC endpoints (including the public Solana RPC) enforce request limits. A polling loop that fires every second generates 60+ requests per minute per active payment session. If you have 10 concurrent payment sessions, that is 600+ requests per minute. Solutions: use a dedicated RPC provider mit higher limits, batch reference checks where possible, implement client-side request deduplication, und cache negative results (reference not found) fuer a short window before re-checking.\n\nTransaktion mismatch errors occur when a transaktion is found via the reference but its details do not match expectations. This can happen if: (1) someone accidentally or maliciously sent a transaktion that includes the reference key but mit wrong amounts, (2) the customer used a different wallet that interpreted the URL differently, or (3) there is a bug in the URL encoding that produced incorrect parameters. When a mismatch is detected, log the full transaktion details fuer debugging, display a clear error to the merchant (\"Payment detected but amount does not match — expected 10 USDC, received 5 USDC\"), und do not mark the payment as complete.\n\nInsufficient balance errors are caught by the customer's wallet before submission, but the merchant has no visibility into this. From the merchant's perspective, it looks like the customer scanned the QR but never submitted the transaktion. The timeout/expiry mechanism handles this case — after the expiry window passes, offer to regenerate the QR code. Consider displaying a message like \"If you are having trouble, please ensure you have sufficient balance.\"\n\nAssociated token konto (ATA) creation failures can occur when the customer's wallet does not automatically create the recipient's ATA fuer the SPL token being transferred. This is primarily a concern fuer less common SPL tokens where the recipient may not have an existing ATA. Modern wallets handle this by including a `createAssociatedTokenAccountIdempotent` anweisung, but older wallet versions may not. The merchant can mitigate this by pre-creating ATAs fuer all tokens they accept.\n\nDouble-payment detection is essential. If the polling loop detects two transaktionen mit the same reference, this indicates either a wallet bug or a user submitting the payment twice. The system should only process the first valid transaktion und flag any subsequent ones fuer manual review. Track processed references in a database to prevent duplicate fulfillment.\n\nNetwork congestion causes delayed transaktion confirmation. During high-traffic periods, transaktionen may take 10-30 seconds to confirm instead of the usual 400ms-2 seconds. The payment UI should handle this gracefully: extend the visual \"confirming\" state, show a message like \"Network is busy — confirmation may take longer than usual,\" und never time out a transaktion that has been detected but not yet confirmed. The timeout should only apply to the initial pending state (waiting fuer any transaktion to appear), not to the confirmation stage.\n\nPartial visibility is a subtle edge case. Due to RPC node propagation delays, one RPC node may see a transaktion while another does not. If your system uses multiple RPC endpoints (fuer redundancy), you may detect a transaktion on one endpoint und fail to fetch its details from another. Solution: when a signature is found, retry `getTransaction` against the same endpoint that returned the signature, mit retries und backoff, before falling back to alternative endpoints.\n\nMemo und metadata validation should verify that any on-chain memo matches the expected payment metadata. If the merchant includes a `memo` parameter in the Solana Pay URL, the confirmed transaktion should contain a corresponding memo anweisung. Mismatches may indicate URL tampering.\n\n## Checklist\n- Implement exponential backoff fuer RPC failures (500ms, 1s, 2s, 5s cap)\n- Verify transaktion details match expected payment parameters\n- Handle double-payment detection mit reference deduplication\n- Distinguish between pending timeout und confirmation timeout\n- Pre-create ATAs fuer all accepted SPL tokens\n\n## Red flags\n- Crashing the polling loop on a single RPC error\n- Marking payments complete without verifying amount und recipient\n- Not handling network congestion gracefully (premature timeout)\n- Ignoring double-payment scenarios\n",
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
                    "output": "TX1: sig aaa...111 (processed) | TX2: sig bbb...222 (DUPLICATE — flagged)\nOnly first valid transaktion fulfills the order",
                    "note": "Track processed references to prevent double fulfillment"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-pos-receipt": {
            "title": "Checkpoint: Generate a POS receipt",
            "content": "# Checkpoint: Generate a POS receipt\n\nBuild the final POS receipt generator that combines all kurs concepts:\n\n- Reconstruct the Solana Pay URL from payment data (recipient, amount, spl-token, reference, label)\n- Generate a deterministic receipt ID from the reference suffix und timestamp\n- Determine currency type: \"SPL\" if splToken is present, otherwise \"SOL\"\n- Include merchant name from the payment label\n- Include the tracking status from the reference tracker\n- Output must be stable JSON mit deterministic key ordering\n\nThis checkpoint validates your complete understanding of Solana Pay commerce integration.",
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
    "description": "Master production wallet UX engineering on Solana: deterministic connection state, network safety, RPC resilience, und measurable reliability patterns.",
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
        "description": "Wallet connection design, network gating, und deterministic state-machine architecture fuer predictable onboarding und reconnect paths.",
        "lessons": {
          "walletux-v2-connection-design": {
            "title": "Connection UX that doesn't suck: a design checklist",
            "content": "# Connection UX that doesn't suck: a design checklist\n\nWallet connection is the first interaction a user has mit any Solana dApp. If this experience is slow, confusing, or error-prone, most users will leave before they ever reach your core product. Connection UX deserves the same engineering rigor as any critical user flow, yet most teams treat it as an afterthought. This lektion establishes the design patterns, failure modes, und recovery strategies that separate professional wallet integration from broken prototypes.\n\n## The connection lifecycle\n\nA wallet connection progresses through a predictable sequence: idle (no wallet detected), detecting (scanning fuer installed adapters), ready (adapter found, user has not yet approved), connecting (approval dialog shown, waiting fuer user action), connected (public key received, session active), und disconnected (user or app terminated the session). Each state must have a distinct visual representation so users always know what is happening und what they need to do next.\n\nAuto-connect is the single most impactful UX optimization. When a user has previously connected a specific wallet, the dApp should attempt to reconnect silently on page load without showing a wallet selection modal. The Solana wallet adapter standard supports this via the `autoConnect` flag. However, auto-connect must be gated: only attempt it if the user previously granted permission (stored in localStorage), und set a timeout of 3-5 seconds. If auto-connect fails silently, fall back to showing the connect button without an error message. Users should never see an error fuer a background reconnection attempt they did not initiate.\n\n## Loading states und skeleton UI\n\nDuring the connecting phase, display a skeleton version of the wallet-dependent UI rather than a blank screen or spinner. If your app shows a token balance after connection, render a shimmer placeholder in that exact layout position. This technique, called \"optimistic layout reservation,\" prevents jarring content shifts when the connection resolves. The connect button itself should transition to a loading state (disabled, mit a subtle animation) to prevent double-click issues.\n\nConnection timeouts need explicit handling. If the wallet adapter does not respond within 10 seconds, assume the user closed the approval dialog or the wallet extension is unresponsive. Transition to an error state mit a clear message: \"Connection timed out. Please try again or check your wallet extension.\" Never leave the UI in an indefinite loading state. Implement a deterministic timeout using setTimeout und clear it if the connection resolves.\n\n## Error recovery patterns\n\nConnection errors fall into three categories: user-rejected (the user clicked \"Cancel\" in the wallet dialog), adapter errors (the wallet extension crashed or is not installed), und network errors (the RPC endpoint is unreachable after connection). Each category requires a different recovery path.\n\nUser-rejected connections should return to the idle state quietly. Do not show an error toast or modal fuer a deliberate user action. Simply reset the connect button to its default state. If you want to provide a nudge, a subtle inline message like \"Connect your wallet to continue\" is sufficient.\n\nAdapter errors require actionable guidance. If no wallet is detected, show a \"Get a Wallet\" link that opens the Phantom or Solflare installation page. If the adapter throws an unexpected error, display the error message mit a \"Try Again\" button. Log the error details to your analytics system fuer debugging, but keep the user-facing message simple.\n\nNetwork errors after connection are particularly tricky because the wallet is technically connected (you have the public key) but the app cannot fetch on-chain data. Display a degraded state: show the connected wallet address mit a warning badge, disable transaktion buttons, und provide a \"Check Connection\" button that re-tests the RPC endpoint. Do not disconnect the wallet just because the RPC is temporarily unreachable.\n\n## Multi-wallet support\n\nModern Solana dApps must support multiple wallet adapters. The wallet selection modal should display installed wallets prominently (mit a green \"Detected\" badge) und list popular uninstalled wallets below mit \"Install\" links. Sort installed wallets by most recently used. Remember the user's last wallet choice und pre-select it on subsequent visits.\n\nWhen the user switches wallets (disconnects one, connects another), all cached data tied to the previous wallet address must be invalidated. Token balances, transaktion history, und program-derived konto states are all wallet-specific. Failing to clear this cache causes data leakage between konten, which is both a UX bug und a potential sicherheit issue.\n\n## The checklist\n\n- Implement auto-connect mit a 3-5 second timeout fuer returning users\n- Show skeleton UI during the connecting phase to prevent layout shift\n- Set a 10-second hard timeout on connection attempts\n- Handle user-rejected connections silently (no error state)\n- Provide \"Get a Wallet\" links when no adapter is detected\n- Display degraded UI (not disconnect) when RPC fails post-connection\n- Invalidate all wallet-specific caches on konto switch\n- Remember the user's preferred wallet adapter between sessions\n- Disable transaktion buttons during connecting und error states\n- Log connection errors to analytics fuer monitoring adapter reliability\n\n## Reliability principle\n\nWallet UX is reliability UX. Users judge trust by whether connect, reconnect, und recovery behave predictably under stress, not by visual polish alone.\n",
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
                      "It prevents layout shift und sets expectations fuer where content will appear",
                      "It makes the page load faster",
                      "It is required by the Solana wallet adapter standard"
                    ],
                    "answerIndex": 0,
                    "explanation": "Skeleton UI reserves the layout space fuer wallet-dependent content, preventing jarring shifts when the connection resolves und data loads."
                  }
                ]
              }
            ]
          },
          "walletux-v2-network-gating": {
            "title": "Network gating und wrong-network recovery",
            "content": "# Network gating und wrong-network recovery\n\nSolana has multiple clusters: mainnet-beta, devnet, testnet, und localnet. Unlike EVM chains where the wallet controls the network und emits chain-change events, Solana's network selection is typically controlled by the dApp, not the wallet. This architectural difference creates a unique set of UX challenges around network mismatch, gating, und recovery.\n\n## The network mismatch problem\n\nWhen a dApp targets mainnet-beta but a user's wallet or the app's RPC endpoint points to devnet, transaktionen will fail silently or produce confusing results. Konto addresses are the same across clusters, but konto state differs entirely. A token konto that holds 1000 USDC on mainnet might not exist on devnet. If your app fetches the balance from devnet while the user expects mainnet, they see zero balance und assume the app is broken or their funds are gone.\n\nNetwork mismatch is not always obvious. The wallet might report a successful signature, but the transaktion was submitted to a different cluster than the one your app is reading from. This creates phantom transaktionen: the user sees \"Transaktion confirmed\" but no state change in the UI. Debugging this requires checking which cluster the transaktion was submitted to versus which cluster the app is polling.\n\n## Detecting the current network\n\nThe primary detection method is to check your RPC endpoint's genesis hash. Each Solana cluster has a unique genesis hash. Call `getGenesisHash()` on your connection und compare it to known values: mainnet-beta's genesis hash is `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`, devnet is `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`, und testnet is `4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY`. If the genesis hash does not match your expected cluster, the RPC endpoint is misconfigured.\n\nFuer wallet-side detection, some wallet adapters expose network information, but this is not standardized. The most reliable approach is to perform a lightweight RPC call (getGenesisHash or getEpochInfo) immediately after connection und compare the response against your expected cluster configuration.\n\n## Network gating patterns\n\nNetwork gating prevents users from performing actions on the wrong network. There are two levels of gating: soft gating und hard gating.\n\nSoft gating shows a warning banner but allows the user to continue. This is appropriate fuer development tools, block explorers, und apps that intentionally support multiple clusters. The banner should clearly state the current network, use color coding (green fuer mainnet, yellow fuer devnet, red fuer testnet/localnet), und be persistent (not dismissible) so the user always sees it.\n\nHard gating blocks all interactions until the network matches the expected cluster. This is appropriate fuer production DeFi applications where operating on the wrong network could cause real financial loss. Hard gating should display a full-screen overlay or modal mit a clear message: \"This app requires Mainnet Beta. Your connection is currently pointing to Devnet.\" Include a button to switch the RPC endpoint if your app supports runtime endpoint switching.\n\n## Recovery strategies\n\nWhen a network mismatch is detected, the recovery flow depends on who controls the network selection. In most Solana dApps, the app controls the RPC endpoint, so recovery means updating the app's connection object to point to the correct cluster. This can be done automatically (if the correct endpoint is known) or manually (presenting the user mit a network selector).\n\nIf recovery requires the user to change their wallet's network setting (less common on Solana but possible mit some wallets), provide step-by-step anweisungen specific to the detected wallet adapter. Fuer Phantom: \"Open Phantom > Settings > Developer Settings > Change Network.\" Include screenshots or a link to the wallet's documentation.\n\nAfter network switching, all cached data must be invalidated. Konto states, token balances, transaktion history, und program-derived addresses may differ across clusters. Implement a `networkChanged` event handler that: clears all cached RPC responses, resets the connection state machine, re-fetches critical konto data, und updates the UI to reflect the new network.\n\n## Multi-network development workflow\n\nFuer developers building on Solana, supporting seamless network switching during development is essential. Store the selected network in localStorage so it persists across page reloads. Provide a developer-only network switcher (hidden behind a feature flag or only visible in non-production builds) that allows quick toggling between mainnet, devnet, und localnet.\n\nWhen switching networks programmatically, create a new Connection object rather than mutating the existing one. This prevents race conditions where in-flight requests on the old network collide mit new requests on the new network. The connection switch should be atomic: update the connection reference, clear all caches, und trigger a full data refresh in a single synchronous operation.\n\n## Checklist\n- Check genesis hash immediately after RPC connection to verify the cluster\n- Use color-coded persistent banners to indicate the current network\n- Hard-gate production DeFi apps to the expected cluster\n- Invalidate all caches when the network changes\n- Create new Connection objects instead of mutating existing ones\n- Store network preference in localStorage fuer persistence\n- Provide wallet-specific anweisungen fuer network switching\n\n## Red flags\n- Allowing transaktionen on the wrong network without any warning\n- Caching data across network switches (stale cross-network data)\n- Mutating the Connection object during network switch (race conditions)\n- Assuming wallet und dApp are always on the same cluster\n",
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
                      "Call getGenesisHash() und compare against known cluster genesis hashes",
                      "Check the URL string fuer 'mainnet' or 'devnet'",
                      "Ask the wallet adapter which network it is using"
                    ],
                    "answerIndex": 0,
                    "explanation": "Each Solana cluster has a unique genesis hash. Comparing the RPC's genesis hash against known values is the only reliable detection method, since URL strings can be misleading und wallets don't always expose network info."
                  },
                  {
                    "id": "walletux-v2-l2-q2",
                    "prompt": "What must happen to cached data when the network changes?",
                    "options": [
                      "All cached data must be invalidated because konto states differ across clusters",
                      "Only token balances need to be refreshed",
                      "Cached data can be retained since addresses are the same across clusters"
                    ],
                    "answerIndex": 0,
                    "explanation": "While konto addresses are identical across clusters, the konto states (balances, data, existence) are completely different. All cached RPC data must be cleared on network switch."
                  }
                ]
              }
            ]
          },
          "walletux-v2-state-explorer": {
            "title": "Connection state machine: states, events, und transitions",
            "content": "# Connection state machine: states, events, und transitions\n\nWallet connection logic in most dApps is implemented as a tangle of boolean flags, useEffect hooks, und conditional renders. This approach leads to impossible states (loading UND error simultaneously), missed transitions (forgetting to clear the error when retrying), und race conditions (two connection attempts running in parallel). A finite state machine (FSM) eliminates these problems by making every possible state und transition explicit.\n\n## Why state machines fuer wallet connections\n\nA state machine defines a finite set of states, a finite set of events, und a deterministic transition function that maps (currentState, event) to nextState. At any point in time, the system is in exactly one state. This guarantees that impossible combinations (connected UND disconnected) cannot occur. Every event is either handled by the current state or explicitly rejected, eliminating silent failures.\n\nFuer wallet connections, the core states are: `disconnected` (no active session), `connecting` (waiting fuer wallet approval or RPC confirmation), `connected` (session active, public key available), und `error` (something went wrong). Each state maps to a specific UI presentation, specific allowed user actions, und specific side effects.\n\n## Defining the transition table\n\nThe transition table is the heart of the state machine. It specifies which events are valid in which states und what the resulting state should be:\n\n```\ndisconnected + CONNECT       → connecting\nconnecting   + CONNECTED     → connected\nconnecting   + CONNECTION_ERROR → error\nconnecting   + TIMEOUT       → error\nconnected    + DISCONNECT    → disconnected\nconnected    + NETWORK_CHANGE → connected (with updated network)\nconnected    + ACCOUNT_CHANGE → connected (with updated address)\nconnected    + CONNECTION_LOST → error\nerror        + RETRY         → connecting\nerror        + DISCONNECT    → disconnected\n```\n\nAny event not listed fuer a given state is invalid. Invalid events should transition to the error state mit a descriptive message rather than being silently ignored. This makes debugging straightforward: every unexpected event is captured und logged.\n\n## Side effects und context\n\nState transitions carry context (also called \"extended state\" or \"context\"). The connection state machine tracks: `walletAddress` (set on CONNECTED und ACCOUNT_CHANGE events), `network` (set on CONNECTED und NETWORK_CHANGE events), `errorMessage` (set when entering the error state), und `transitions` (a log of all state transitions fuer debugging).\n\nSide effects are actions triggered by transitions, not by states. Fuer example, the transition from `connecting` to `connected` should trigger: fetching the initial konto balance, subscribing to konto change notifications, und logging the connection event to analytics. The transition from `connected` to `disconnected` should trigger: clearing all cached data, unsubscribing from notifications, und resetting the UI to the idle layout.\n\n## Implementation patterns\n\nIn React applications, the state machine can be implemented using `useReducer` mit the transition table as the reducer logic. The reducer receives the current state und an event (action), looks up the transition in the table, und returns the new state mit updated context. This approach is testable (pure function), predictable (no side effects in the reducer), und composable (multiple components can read the state without duplicating logic).\n\nFuer more complex scenarios, libraries like XState provide first-class support fuer statecharts (hierarchical state machines mit guards, actions, und services). XState's visualizer can render the state machine as a diagram, making it easy to verify that all states und transitions are covered. However, fuer wallet connection logic, a simple transition table in a useReducer is usually sufficient.\n\nThe transition history array is invaluable fuer debugging. When a user reports a connection issue, the transition log shows exactly what happened: which events fired, in what order, und what states resulted. This is far more useful than a single boolean flag or an error message captured at an arbitrary point.\n\n## Tests state machines\n\nState machines are inherently testable because they are pure functions. Given a starting state und a sequence of events, the output is completely deterministic. Test cases should cover: the happy path (disconnected → connecting → connected), error recovery (connecting → error → retry → connecting → connected), konto switching (connected → ACCOUNT_CHANGE → connected mit new address), und invalid events (connected + CONNECT should transition to error, not silently ignored).\n\nEdge cases to test: rapid event sequences (CONNECT followed immediately by DISCONNECT before the connection resolves), duplicate events (two CONNECTED events in a row), und state persistence (does the machine correctly restore state from localStorage on page reload?).\n\n## Checklist\n- Define all states explicitly: disconnected, connecting, connected, error\n- Map every valid (state, event) pair to a next state\n- Handle invalid events by transitioning to error mit a descriptive message\n- Track transition history fuer debugging\n- Implement the state machine as a pure reducer function\n- Clear context data (wallet address, network) on disconnect\n- Clear error message on retry\n",
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
                    "note": "User switched konten, address updated, network retained"
                  },
                  {
                    "cmd": "Event: CONNECTION_LOST { message: 'WebSocket closed' }",
                    "output": "connected → error | errorMessage='WebSocket closed'",
                    "note": "Connection dropped, show error mit retry option"
                  },
                  {
                    "cmd": "Event: RETRY",
                    "output": "error → connecting | errorMessage=null",
                    "note": "User clicks retry, clear error und reconnect"
                  }
                ]
              }
            ]
          },
          "walletux-v2-connection-state": {
            "title": "Challenge: Implement wallet connection state machine",
            "content": "# Challenge: Implement wallet connection state machine\n\nBuild a deterministic state machine fuer wallet connection management:\n\n- States: disconnected, connecting, connected, error\n- Process a sequence of events und track all state transitions\n- CONNECTED und ACCOUNT_CHANGE events carry a walletAddress; CONNECTED und NETWORK_CHANGE carry a network\n- Error state stores the error message; disconnected clears all session data\n- Invalid events force transition to error state mit a descriptive message\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "50 min",
            "hints": [
              "Define a TRANSITIONS map: each state maps event types to next states.",
              "CONNECTED und ACCOUNT_CHANGE events carry walletAddress. CONNECTED und NETWORK_CHANGE carry network.",
              "Error state stores the error message. Disconnected clears all session data.",
              "Invalid events force transition to error state mit descriptive message."
            ]
          }
        }
      },
      "walletux-v2-production": {
        "title": "Production Patterns",
        "description": "Cache invalidation, RPC resilience und health monitoring, und measurable wallet UX quality reporting fuer production operations.",
        "lessons": {
          "walletux-v2-cache-invalidation": {
            "title": "Challenge: Cache invalidation on wallet events",
            "content": "# Challenge: Cache invalidation on wallet events\n\nBuild a cache invalidation engine that processes wallet events und invalidates the correct cache entries:\n\n- Cache entries have tags: \"konto\" (wallet-specific data), \"network\" (cluster-specific data), \"global\" (persists across everything)\n- ACCOUNT_CHANGE invalidates all entries tagged \"konto\"\n- NETWORK_CHANGE invalidates entries tagged \"network\" UND \"konto\" (network change means all konto data is stale)\n- DISCONNECT invalidates all non-\"global\" entries\n- Track per-event invalidation counts in an event log\n- Return the final cache state, total invalidated count, und retained count\n\nThe invalidation logic must be deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "ACCOUNT_CHANGE invalidates entries tagged 'konto'.",
              "NETWORK_CHANGE invalidates both 'network' und 'konto' tagged entries.",
              "DISCONNECT invalidates all non-'global' entries.",
              "Track invalidation counts per event in the event log."
            ]
          },
          "walletux-v2-rpc-caching": {
            "title": "RPC reads und caching strategy fuer wallet apps",
            "content": "# RPC reads und caching strategy fuer wallet apps\n\nEvery interaction in a Solana wallet application ultimately depends on RPC calls: fetching balances, loading token konten, reading program state, und confirming transaktionen. Without a caching strategy, your app hammers the RPC endpoint mit redundant requests, drains rate limits, und delivers a sluggish user experience. A well-designed cache layer transforms wallet apps from painfully slow to instantly responsive while keeping data fresh enough fuer financial accuracy.\n\n## The RPC cost problem\n\nSolana RPC calls are not free. Public endpoints like those provided by Solana Foundation have aggressive rate limits (typically 40 requests per 10 seconds fuer free tiers). Premium providers (Helius, QuickNode, Triton) charge per request or by compute units consumed. A naive wallet app that re-fetches every piece of data on every render can easily exceed 100 requests per minute fuer a single user. Multiply by thousands of concurrent users und costs become significant.\n\nBeyond cost, latency kills UX. A `getTokenAccountsByOwner` call takes 200-800ms depending on the endpoint und konto complexity. If the user switches tabs und returns, re-fetching everything from scratch creates a noticeable loading delay. Caching eliminates this delay fuer data that has not changed.\n\n## Cache taxonomy\n\nNot all RPC data has the same freshness requirements. Categorize cache entries by their volatility:\n\n**Immutable data** (cache indefinitely): mint metadata (name, symbol, decimals, logo URI), program konto structures, und historical transaktion details. Once fetched, this data never changes. Store it in an in-memory Map mit no expiration.\n\n**Semi-stable data** (cache fuer 30-60 seconds): token balances, staking positions, governance votes, und NFT ownership. This data changes infrequently fuer most users. A 30-second TTL (time to live) provides a good balance between freshness und efficiency. Use a cache key that includes the wallet address und network to prevent cross-konto contamination.\n\n**Volatile data** (cache fuer 5-10 seconds or not at all): recent transaktion confirmations, real-time price feeds, und active swap quotes. This data changes constantly und becomes stale quickly. Short TTLs or no caching at all is appropriate. Fuer transaktion confirmations, use WebSocket subscriptions instead of polling.\n\n## Cache key design\n\nCache keys must uniquely identify the request parameters UND the context. A good cache key fuer a balance query includes: the RPC method name, the konto address, the commitment level, und the network cluster. Fuer example: `getBalance:7xKXp...abc:confirmed:mainnet-beta`. Including the network in the key prevents a critical bug: returning devnet data when the user has switched to mainnet.\n\nFuer `getTokenAccountsByOwner`, the key should include the owner address und the program filter (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID). Different token programs return different konto sets, und caching them under the same key returns incorrect results.\n\n## Invalidation triggers\n\nCache invalidation is triggered by three wallet events: konto change, network change, und disconnect. These events were covered in the previous challenge, but the caching layer adds nuance.\n\nKonto change invalidates all entries keyed by the wallet address. Token balances, transaktion history, und program-derived konto states are all wallet-specific. Global data (mint metadata, program IDL) survives an konto change.\n\nNetwork change invalidates everything except truly global, network-independent data (UI preferences, theme settings). Even mint metadata should be invalidated because a mint address might exist on mainnet but not on devnet, or have different state.\n\nUser-initiated refresh is the escape hatch. Provide a \"Refresh\" button that clears the entire cache und re-fetches all visible data. Users expect this when they know an external action (a transfer from another device) has changed their state but the cache has not expired yet.\n\n## Stale-while-revalidate pattern\n\nThe most effective caching strategy fuer wallet apps is stale-while-revalidate (SWR). When a cache entry is requested: if fresh (within TTL), return it immediately. If stale (past TTL but within a grace period, e.g., 2x TTL), return the stale value immediately UND trigger a background re-fetch. When the re-fetch completes, update the cache und notify the UI. If expired (past grace period), block und re-fetch before returning.\n\nThis pattern ensures the UI always responds instantly mit the best available data while keeping it fresh in the background. Libraries like SWR (fuer React) und TanStack Query implement this pattern out of the box mit configurable TTL, grace periods, und background refetch intervals.\n\n## Checklist\n- Categorize RPC data by volatility: immutable, semi-stable, volatile\n- Include wallet address und network in all cache keys\n- Invalidate konto-tagged caches on wallet switch\n- Invalidate all non-global caches on network switch\n- Implement stale-while-revalidate fuer semi-stable data\n- Provide a manual refresh button as an escape hatch\n- Monitor cache hit rates to validate your TTL configuration\n\n## Red flags\n- Caching without network in the key (cross-network data leakage)\n- Not invalidating on konto switch (showing previous wallet's data)\n- Setting TTLs too long fuer financial data (stale balance display)\n- Re-fetching everything on every render (defeats the purpose of caching)\n",
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
                      "Konto states differ across clusters, so cached devnet data would be wrong fuer mainnet",
                      "Cache keys must be globally unique fuer leistung",
                      "The Solana RPC protocol requires cluster identification"
                    ],
                    "answerIndex": 0,
                    "explanation": "The same konto address can have completely different state on mainnet vs devnet. Without the network in the key, switching clusters would return stale data from the previous cluster."
                  },
                  {
                    "id": "walletux-v2-l6-q2",
                    "prompt": "What does the stale-while-revalidate pattern do when a cache entry is past its TTL?",
                    "options": [
                      "Returns the stale value immediately und triggers a background re-fetch",
                      "Blocks until fresh data is fetched from the RPC",
                      "Deletes the stale entry und returns null"
                    ],
                    "answerIndex": 0,
                    "explanation": "SWR prioritizes responsiveness by serving stale data instantly while refreshing in the background. This eliminates loading states fuer data that has only slightly exceeded its TTL."
                  }
                ]
              }
            ]
          },
          "walletux-v2-rpc-health": {
            "title": "RPC health monitoring und graceful degradation",
            "content": "# RPC health monitoring und graceful degradation\n\nRPC endpoints are the lifeline of every Solana wallet application. When they go down, become slow, or return stale data, your app becomes unusable. Production wallet apps must continuously monitor RPC health und degrade gracefully when issues are detected, rather than showing cryptic errors or silently displaying stale data. This lektion covers the engineering patterns fuer building resilient RPC connectivity.\n\n## Why RPC endpoints fail\n\nSolana RPC endpoints experience several failure modes. Rate limiting is the most common: free-tier endpoints enforce strict per-IP und per-second limits, und exceeding them results in HTTP 429 responses. Latency spikes occur during high network activity (NFT mints, token launches) when validatoren are under heavy load und RPC nodes queue requests. Stale data happens when an RPC node falls behind the cluster's tip slot, returning konto states that are several slots (or seconds) old. Complete outages, while rare fuer premium providers, do happen und can last minutes to hours.\n\nEach failure mode requires a different response. Rate limiting needs request throttling und backoff. Latency spikes need timeout management und user communication. Stale data needs detection und provider rotation. Complete outages need failover to a backup endpoint.\n\n## Health check implementation\n\nImplement a periodic health check that runs every 15-30 seconds while the app is active. The health check should measure three metrics: latency (round-trip time fuer a `getSlot` call), freshness (compare the returned slot against the expected tip slot from a secondary source or the previous check), und error rate (percentage of failed requests in the last N calls).\n\nA healthy endpoint has latency under 500ms, slot freshness within 5 slots of the expected tip, und an error rate below 5%. An unhealthy endpoint has latency over 2000ms, slot freshness more than 50 slots behind, or an error rate above 20%. The mittelstufe range (degraded) triggers warnings without failover.\n\nStore health check results in a rolling window (last 10-20 checks). A single slow response should not trigger failover, but 3 consecutive slow responses should. This smoothing prevents flapping between endpoints due to transient network issues.\n\n## Failover strategies\n\nPrimary-secondary failover is the simplest pattern. Configure a primary RPC endpoint (your preferred provider) und one or more secondaries (different providers fuer diversity). When the primary becomes unhealthy, route all requests to the secondary. Periodically re-check the primary (every 60 seconds) und switch back when it recovers. This prevents all your traffic from permanently migrating to the secondary.\n\nRound-robin mit health weighting distributes requests across multiple endpoints based on their current health scores. A healthy endpoint gets a weight of 1.0, a degraded endpoint gets 0.3, und an unhealthy endpoint gets 0.0. This approach provides better throughput than single-endpoint strategies und automatically adapts to changing conditions.\n\nFuer critical transaktionen (swaps, transfers), always use the endpoint mit the lowest latency UND highest freshness. Transaktion submission is latency-sensitive: a stale blockhash from a behind-the-tip node will cause the transaktion to be rejected. Fuer read operations (balance queries), slightly stale data is acceptable if it means faster responses.\n\n## Graceful degradation in the UI\n\nWhen RPC health degrades, the UI should communicate the situation clearly without panic. Display a small status indicator (green dot, yellow dot, red dot) near the network name or in the status bar. Clicking it should show detailed health information: current latency, last successful request time, und the number of failed requests.\n\nDuring degraded mode, disable or add warnings to transaktion buttons. A yellow warning like \"Network may be slow — transaktionen might take longer than usual\" is better than letting users submit transaktionen that will likely time out. During a full outage, disable all transaktion features und show a clear message: \"Unable to reach the Solana network. Your funds are safe. We'll reconnect automatically.\"\n\nNever hide the degradation. Users who submit transaktionen during an outage und see \"Transaktion failed\" without explanation will assume their funds are at risk. Proactive communication (\"The network is experiencing delays\") builds trust even when the experience is suboptimal.\n\n## Request retry und throttling\n\nWhen an RPC request fails, classify the error before deciding whether to retry. HTTP 429 (rate limited): back off exponentially starting at 1 second, retry up to 3 times. HTTP 5xx (server error): retry once after 2 seconds, then failover to secondary endpoint. Network timeout: retry once mit a shorter timeout (the request may have succeeded but the response was lost), then failover. HTTP 4xx (client error): do not retry, the request is malformed.\n\nImplement a request queue mit concurrency limits. Most RPC providers allow 10-40 concurrent requests. If your app tries to fire 50 requests simultaneously (common during initial data loading), queue the excess und process them as earlier requests complete. This prevents self-inflicted rate limiting.\n\nDebounce user-triggered requests. If the user rapidly clicks \"Refresh\" or types in a search field that triggers RPC lookups, debounce the requests to at most one per 500ms. This is simple to implement und dramatically reduces unnecessary RPC traffic.\n\n## Monitoring und alerting\n\nLog all RPC metrics to your observability system: request count, error count, latency percentiles (p50, p95, p99), und cache hit rate. Set alerts fuer: error rate exceeding 10% over 5 minutes, p95 latency exceeding 3 seconds, und cache hit rate dropping below 50% (indicates a cache invalidation bug or a change in access patterns).\n\nTrack per-endpoint metrics separately. If your primary endpoint's error rate spikes while the secondary is healthy, the failover logic should handle it automatically. But if both endpoints degrade simultaneously, it likely indicates a Solana network-wide issue rather than a provider problem, und the alerting should reflect that distinction.\n\n## Checklist\n- Run health checks every 15-30 seconds measuring latency, freshness, und error rate\n- Implement primary-secondary failover mit automatic recovery\n- Display RPC health status in the UI (green/yellow/red indicator)\n- Disable transaktion features during outages mit clear messaging\n- Classify errors before retrying (429 vs 5xx vs 4xx)\n- Implement request queue mit concurrency limits\n- Debounce user-triggered RPC requests\n- Monitor und alert on error rate, latency, und cache hit rate\n\n## Red flags\n- No failover endpoints (single point of failure)\n- Retrying 4xx errors (wastes requests on malformed input)\n- Hiding RPC failures from the user (builds distrust)\n- No concurrency limits (self-inflicted rate limiting)\n",
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
            "content": "# Checkpoint: Generate a Wallet UX Report\n\nBuild the final wallet UX quality report that combines all kurs concepts:\n\n- Count connection attempts (CONNECT events) und successful connections (CONNECTED events)\n- Calculate success rate as a percentage mit 2 decimal places\n- Compute average connection time from CONNECTED events' durationMs\n- Count ACCOUNT_CHANGE und NETWORK_CHANGE events\n- Calculate cache hit rate from cacheStats (hits / total * 100, 2 decimal places)\n- Calculate RPC health score from rpcChecks (healthy / total * 100, 2 decimal places)\n- Include the timestamp from input\n\nThis checkpoint validates your complete understanding of wallet UX engineering.",
            "duration": "55 min",
            "hints": [
              "Count CONNECT events fuer attempts, CONNECTED fuer successes.",
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
    "title": "Sign-In Mit Solana",
    "description": "Master production SIWS authentication on Solana: standardized inputs, strict verification invariants, replay-resistant nonce lifecycle, und audit-ready reporting.",
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
        "description": "SIWS rationale, strict input-field semantics, wallet rendering behavior, und deterministic sign-in input construction.",
        "lessons": {
          "siws-v2-why-exists": {
            "title": "Why SIWS exists: replacing connect-und-signMessage",
            "content": "# Why SIWS exists: replacing connect-und-signMessage\n\nBefore Sign-In Mit Solana (SIWS) became a standard, dApps authenticated wallet holders using a two-step pattern: connect the wallet, then call `signMessage` mit an arbitrary string. The user would see a raw byte blob in their wallet's approval screen, sign it, und the server would verify the signature against the expected public key. This worked, but it was fragile, inconsistent, und dangerous.\n\n## The problems mit raw signMessage\n\nThe fundamental issue mit raw `signMessage` authentication is that wallets cannot distinguish between a benign sign-in request und a malicious payload. When a wallet displays \"Sign this message: 0x48656c6c6f\" or even a human-readable string like \"Please sign in to example.com at 2024-01-15T10:30:00Z,\" the wallet has no structured way to parse, validate, or warn about the content. The user must trust that the dApp is honest about what it is asking them to sign.\n\nThis creates several attack vectors. A malicious dApp could present a sign-in prompt that actually contains a serialized transaktion. If the wallet treats `signMessage` payloads as opaque bytes (which most do), the user signs what they believe is a login but is actually an authorization fuer a token transfer. Even without outright fraud, the lack of structure means different dApps format their sign-in messages differently. Users see inconsistent approval screens across applications, eroding trust und making it harder to identify legitimate requests.\n\nReplay attacks are another critical weakness. If a dApp asks the user to sign \"Log in to example.com\" without a nonce or timestamp, the resulting signature is valid forever. An attacker who intercepts this signature (via a compromised server log, a man-in-the-middle proxy, or a leaked database) can replay it indefinitely to impersonate the user. Adding a nonce or timestamp to the message helps, but without a standard format, each dApp implements its own scheme — some correctly, many not.\n\n## What SIWS standardizes\n\nSign-In Mit Solana defines a structured message format that wallets can parse, validate, und display in a human-readable, predictable way. The SIWS standard specifies exactly which fields a sign-in request must contain und how wallets should render them. This moves authentication from an opaque byte-signing operation to a semantically meaningful, wallet-aware protocol.\n\nThe core fields of a SIWS sign-in input are: **domain** (the requesting site's origin, displayed prominently by the wallet), **address** (the expected signer's public key), **nonce** (a unique, server-generated value that prevents replay attacks), **issuedAt** (ISO 8601 timestamp marking when the request was created), **expirationTime** (optional deadline after which the sign-in is invalid), **statement** (human-readable description of what the user is approving), **chainId** (the Solana cluster, e.g., mainnet-beta), und **resources** (optional URIs that the sign-in grants access to).\n\nWhen a wallet receives a SIWS request, it knows the structure. It can display the domain prominently so the user can verify they are signing in to the correct site. It can show the expiration time so the user knows the request is time-limited. It can warn if the domain in the request does not match the domain the wallet was connected from. This structured rendering is a massive UX improvement over displaying raw bytes.\n\n## UX improvements fuer end users\n\nMit SIWS, wallet approval screens become consistent und informative. Instead of seeing an arbitrary string, users see a formatted display: the requesting domain, the statement explaining the action, the nonce (often hidden from the user but validated by the wallet), und time bounds. This consistency across dApps builds user confidence — they lerne to recognize what a legitimate sign-in request looks like.\n\nWallets can also implement automatic safety checks. If the domain in the SIWS input does not match the origin of the connecting dApp, the wallet can show a warning or block the request entirely. If the issuedAt timestamp is far in the past or the expirationTime has already passed, the wallet can reject the request before the user even sees it. These checks are impossible mit raw `signMessage` because the wallet has no way to parse the content.\n\n## Server-side benefits\n\nFuer backend developers, SIWS provides a predictable verification flow. The server generates a nonce, sends the SIWS input to the client, receives the signed output, und verifies: (1) the signature is valid fuer the claimed address, (2) the domain matches the server's domain, (3) the nonce matches the one the server issued, (4) the timestamps are within acceptable bounds, und (5) the address matches the expected signer. Each check is explicit und auditable, unlike ad-hoc string parsing.\n\nThe nonce mechanism is particularly important. The server stores issued nonces (in memory, Redis, or a database) und marks them as consumed after successful verification. Any attempt to reuse a nonce is rejected as a replay attack. This provides cryptographic proof of freshness that raw signMessage authentication lacks unless the developer explicitly implements it — und history shows most developers do not.\n\n## The path forward\n\nSIWS aligns Solana's authentication story mit Ethereum's Sign-In Mit Ethereum (SIWE / EIP-4361) und other chain-specific standards. Cross-chain dApps can implement a unified authentication flow mit chain-specific signing backends. The wallet-side rendering, nonce management, und verification logic are consistent patterns regardless of the underlying blockchain.\n\n## Operator mindset\n\nTreat SIWS as a protocol contract, not a UI prompt. If nonce lifecycle, domain checks, und time bounds are not enforced as strict invariants, authentication becomes signature theater.\n\n## Checklist\n- Understand why raw signMessage is insufficient fuer authentication\n- Know the core SIWS fields: domain, address, nonce, issuedAt, expirationTime, statement\n- Recognize that SIWS enables wallet-side validation und consistent UX\n- Understand the server-side nonce flow: generate, issue, verify, consume\n\n## Red flags\n- Using raw signMessage fuer authentication without structured format\n- Omitting nonce from sign-in messages (enables replay attacks)\n- Not validating domain match between SIWS input und connecting origin\n- Allowing sign-in messages without expiration times\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l1-q1",
                    "prompt": "What is the primary sicherheit problem mit using raw signMessage fuer authentication?",
                    "options": [
                      "Wallets cannot distinguish sign-in requests from malicious payloads",
                      "signMessage is too slow fuer production use",
                      "signMessage does not produce valid Ed25519 signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without structured format, wallets treat signMessage payloads as opaque bytes und cannot validate or warn about the content, making it easy fuer malicious dApps to disguise harmful payloads as sign-in requests."
                  },
                  {
                    "id": "siws-v2-l1-q2",
                    "prompt": "How does SIWS prevent replay attacks?",
                    "options": [
                      "By requiring a unique, server-generated nonce that is consumed after verification",
                      "By encrypting the signed message mit AES-256",
                      "By requiring the user to sign twice mit different keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "The server generates a unique nonce fuer each sign-in attempt. After successful verification, the nonce is marked as consumed. Any reuse of the same nonce is rejected as a replay attack."
                  }
                ]
              }
            ]
          },
          "siws-v2-input-fields": {
            "title": "SIWS input fields und sicherheit rules",
            "content": "# SIWS input fields und sicherheit rules\n\nThe Sign-In Mit Solana input is a structured object that defines every parameter of an authentication request. Each field has specific validation rules, sicherheit implications, und rendering expectations. Understanding every field deeply is essential fuer building a correct und secure SIWS implementation.\n\n## domain\n\nThe `domain` field identifies the requesting application. It must be a valid domain name without protocol prefix — \"example.com\", not \"https://example.com\". The domain serves as the primary trust anchor: when the wallet displays the sign-in request, the domain is shown prominently so the user can verify they are interacting mit the intended site.\n\nSicherheit rule: the server must verify that the domain in the signed output matches its own domain exactly. If a user signs a SIWS message fuer \"evil.com\" und submits it to \"example.com\", the server must reject it. The domain check prevents cross-site authentication relay attacks where an attacker presents their own domain to the user but submits the signed result to a different server. Domain validation should be case-insensitive (domains are case-insensitive per RFC 4343) und must reject domains containing protocol prefixes, paths, ports, or query strings.\n\n## address\n\nThe `address` field contains the Solana public key (base58-encoded) of the wallet that will sign the request. On Solana, public keys are 32 bytes encoded in base58, resulting in strings of 32-44 characters. The address must match the actual signer of the SIWS output — if the address in the input says \"Wallet111\" but \"Wallet222\" actually signs the message, verification must fail.\n\nSicherheit rule: always validate address format before sending the request to the wallet. A malformed address will cause downstream verification failures. Check that the address is 32-44 characters long und consists only of valid base58 characters (no 0, O, I, or l — these are excluded from base58 to avoid visual ambiguity). On the server side, verify that the address in the signed output matches the address you expected (typically the address of the connected wallet).\n\n## nonce\n\nThe `nonce` is the single most important sicherheit field in SIWS. It is a server-generated, unique, unpredictable string that ties the sign-in request to a specific authentication attempt. The nonce must be at least 8 characters long und should be alphanumeric. In production, nonces are typically 16-32 character random strings generated using a cryptographically secure random number generator.\n\nSicherheit rule: nonces must be generated server-side, never client-side. If the client generates its own nonce, an attacker can reuse a previously valid nonce-signature pair. The server must store the nonce (mit a TTL matching the sign-in expiration window) und check it during verification. After successful verification, the nonce must be permanently invalidated (deleted or marked as consumed). The nonce storage must be atomic — a race condition where two requests verify the same nonce simultaneously would defeat the replay protection entirely.\n\nNonce storage options include: in-memory maps (suitable fuer single-server deployments), Redis mit TTL (suitable fuer distributed systems), und database tables mit unique constraints. Whatever storage is used, the invalidation must be atomic: check-und-delete in a single operation, not check-then-delete in two steps.\n\n## issuedAt\n\nThe `issuedAt` field is an ISO 8601 timestamp indicating when the sign-in request was created. It provides temporal context fuer the authentication attempt. The server sets this value when generating the sign-in input.\n\nSicherheit rule: during verification, the server must check that `issuedAt` is not in the future (allowing a small clock skew tolerance of 1-2 minutes). A sign-in request mit a future issuedAt timestamp is suspicious — it may indicate clock manipulation or request fabrication. The server should also reject sign-in requests where issuedAt is too far in the past, even if the expirationTime has not passed. A reasonable maximum age fuer issuedAt is 10-15 minutes.\n\n## expirationTime\n\nThe `expirationTime` field is an optional ISO 8601 timestamp indicating when the sign-in request becomes invalid. If present, it must be strictly after `issuedAt`. If absent, the sign-in request has no explicit expiration (though the server should still enforce a maximum age based on issuedAt).\n\nSicherheit rule: if expirationTime is present, the server must verify that the current time is before the expiration. Expired sign-in requests must be rejected regardless of signature validity. Setting short expiration windows (5-15 minutes) reduces the window fuer replay attacks und limits the useful lifetime of intercepted sign-in requests. Production systems should always set expirationTime rather than relying solely on nonce expiration.\n\n## statement\n\nThe `statement` field is a human-readable string that the wallet displays to the user, describing what they are approving. If not provided by the dApp, a sensible default is \"Sign in to <domain>\". The statement should be concise, clear, und accurately describe the action.\n\nSicherheit rule: the statement is informational und should not contain sensitive data. It is included in the signed message, so it is visible to anyone who can see the signature. Do not include session tokens, API keys, or other secrets in the statement. The wallet renders the statement as-is, so avoid HTML, markdown, or other formatting that might be misinterpreted.\n\n## chainId und resources\n\nThe `chainId` field identifies the Solana cluster (e.g., \"mainnet-beta\", \"devnet\", \"testnet\"). This prevents cross-cluster authentication where a signature obtained on devnet is replayed on mainnet. The `resources` field is an optional array of URIs that the sign-in grants access to. These are informational und displayed by the wallet.\n\nSicherheit rule: if your dApp operates on a specific cluster, verify that the chainId in the signed output matches your expected cluster. Resources should be validated as well-formed URIs but their enforcement is application-specific.\n\n## Checklist\n- Domain must not include protocol, path, or port\n- Nonce must be >= 8 alphanumeric characters, generated server-side\n- issuedAt must not be in the future; reject stale requests\n- expirationTime (if present) must be after issuedAt und not yet passed\n- Address must be 32-44 characters of valid base58\n- Statement should default to \"Sign in to <domain>\" if not provided\n\n## Red flags\n- Accepting client-generated nonces\n- Not validating domain format (allowing protocol prefixes)\n- Missing atomic nonce invalidation (check-then-delete race condition)\n- No maximum age check on issuedAt\n- Storing secrets in the statement field\n",
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
                      "Wallets cannot sign messages containing client-generated nonces"
                    ],
                    "answerIndex": 0,
                    "explanation": "If the client generates nonces, an attacker can replay a previously captured nonce-signature pair. Server-generated nonces ensure each authentication attempt is unique und controlled by the server."
                  },
                  {
                    "id": "siws-v2-l2-q2",
                    "prompt": "What format must the domain field use?",
                    "options": [
                      "Plain domain name without protocol prefix (e.g., example.com)",
                      "Full URL mit protocol (e.g., https://example.com)",
                      "IP address mit port number"
                    ],
                    "answerIndex": 0,
                    "explanation": "The domain field must be a plain domain name. Protocol prefixes, paths, ports, und query strings must be rejected to ensure consistent domain matching."
                  }
                ]
              }
            ]
          },
          "siws-v2-message-preview": {
            "title": "Message preview: how wallets render SIWS requests",
            "content": "# Message preview: how wallets render SIWS requests\n\nWhen a dApp sends a SIWS sign-in request to a wallet, the wallet transforms the structured input into a human-readable message that the user sees on the approval screen. Understanding exactly how this rendering works is critical fuer dApp developers — it determines what users see, what they trust, und what they sign.\n\n## The SIWS message format\n\nThe SIWS standard defines a specific text format fuer the message that gets signed. The wallet constructs this message from the structured input fields. The format follows a predictable template that wallets can both generate und parse. The message begins mit the domain und address, followed by a statement, then a structured block of metadata fields.\n\nA complete SIWS message looks like this:\n\n```\nexample.com wants you to sign in with your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z\nChain ID: mainnet-beta\n```\n\nThe first line always follows the pattern: \"`<domain>` wants you to sign in mit your Solana konto:\". This phrasing is standardized so users lerne to recognize it across all SIWS-compatible dApps. The second line is the full public key address. A blank line separates the header from the statement. Another blank line separates the statement from the metadata fields.\n\n## Wallet rendering expectations\n\nModern Solana wallets (Phantom, Solflare, Backpack) recognize SIWS-formatted messages und render them mit enhanced UI. Instead of displaying raw text, they parse the structured fields und present them in a formatted approval screen mit clear sections.\n\nThe domain is typically displayed prominently at the top of the approval screen, often mit the dApp's favicon if available. This is the primary trust signal — users should check this domain matches the site they are interacting mit. Some wallets cross-reference the domain against the connecting origin und display a warning if they do not match.\n\nThe statement is shown in a distinct section, often mit larger or bolder text. This is the human-readable explanation of what the user is approving. Fuer sign-in requests, it typically says something like \"Sign in to example.com\" or a custom message the dApp provides.\n\nThe metadata fields (nonce, issuedAt, expirationTime, chainId, resources) are shown in a structured format, often collapsible or in a \"details\" section. Most users do not read these fields, but their presence signals that the request is well-formed und follows the standard. Sicherheit-conscious users can verify the nonce matches their expectation und the timestamps are reasonable.\n\n## What users actually see versus what gets signed\n\nIt is important to understand that what the wallet displays und what actually gets signed can differ. The wallet renders a formatted UI from the parsed fields, but the actual bytes that are signed are the serialized message text in the standard format. The wallet constructs the canonical message text, displays a parsed version to the user, und signs the canonical text.\n\nThis creates a trust model: the user trusts the wallet to accurately represent the message content. If a wallet has a rendering bug (e.g., it shows the wrong domain), the user might approve a message they would otherwise reject. This is why using well-audited, mainstream wallets is important fuer SIWS sicherheit.\n\nThe signed bytes include the full message text prefixed mit a Solana-specific preamble. The Ed25519 signature covers the entire message, including all fields. Changing any field (even adding a space) produces a completely different signature. This ensures that the server can verify not just that the user signed something, but that they signed the exact message mit the exact fields the server expected.\n\n## Building preview UIs in dApps\n\nBefore sending a SIWS request to the wallet, many dApps show a preview of the message in their own UI. This preview serves two purposes: it prepares the user fuer what they will see in the wallet (reducing confusion und approval time), und it provides a last checkpoint before triggering the wallet interaction.\n\nThe dApp preview should mirror the wallet's rendering as closely as possible. Show the domain, statement, und key metadata fields. Indicate that the user will be asked to approve this message in their wallet. If the dApp is using a custom statement, display it exactly as it will appear.\n\nDo not include fields in the preview that might confuse users. The nonce, fuer example, is a random string that has no meaning to the user. Showing it adds visual noise without value. The preview can omit the nonce while the actual signed message includes it. Similarly, the chainId is important fuer verification but rarely interesting to users unless the dApp operates across multiple clusters.\n\n## Edge cases in rendering\n\nSeveral edge cases affect how SIWS messages are rendered und signed. Long domains may be truncated in wallet UIs — ensure your domain is concise. Internationalized domain names (IDN) should be tested mit your target wallets, as some wallets may not render Unicode characters correctly. The statement field has no maximum length in the standard, but extremely long statements will be truncated or require scrolling in the wallet, reducing the chance that users read them fully.\n\nEmpty optional fields are omitted from the message text. If no expirationTime is set, the \"Expiration Time:\" line does not appear. If no resources are specified, no resources section appears. The message format adjusts dynamically based on which fields are present.\n\n## Checklist\n- Know the canonical SIWS message format und field ordering\n- Understand that wallets parse und render structured UI from the message\n- Build dApp-side previews that mirror wallet rendering\n- Test your SIWS messages mit target wallets to verify display\n- Keep statements concise und domains short\n\n## Red flags\n- Assuming all wallets render SIWS messages identically\n- Including sensitive data in the statement (it is visible in the signed message)\n- Using extremely long statements that wallets truncate\n- Not tests mit real wallet approval screens during development\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "siws-v2-l3-preview",
                "title": "SIWS Message Format",
                "steps": [
                  {
                    "cmd": "Construct SIWS message from input fields",
                    "output": "example.com wants you to sign in mit your Solana konto:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z",
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
                    "note": "Signed output returned to the dApp fuer server verification"
                  }
                ]
              }
            ]
          },
          "siws-v2-sign-in-input": {
            "title": "Challenge: Build a validated SIWS sign-in input",
            "content": "# Challenge: Build a validated SIWS sign-in input\n\nImplement a function that creates a validated Sign-In Mit Solana input:\n\n- Validate domain (non-empty, must not include protocol prefix)\n- Validate nonce (at least 8 characters, alphanumeric only)\n- Validate address format (32-44 characters fuer Solana base58)\n- Set issuedAt (required) und optional expirationTime mit ordering check\n- Default statement to \"Sign in to <domain>\" if not provided\n- Return structured result mit valid flag und collected errors\n\nYour implementation must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Domain should not include protocol (https://). Strip or reject it.",
              "Nonce must be >= 8 characters und alphanumeric only (/^[a-zA-Z0-9]+$/).",
              "Address must be 32-44 characters (Solana base58 public key).",
              "If no statement is provided, default to 'Sign in to <domain>'."
            ]
          }
        }
      },
      "siws-v2-verification": {
        "title": "Verification & Sicherheit",
        "description": "Server-side verification invariants, nonce replay defenses, session management, und deterministic auth audit reporting.",
        "lessons": {
          "siws-v2-verify-sign-in": {
            "title": "Challenge: Verify a SIWS sign-in response",
            "content": "# Challenge: Verify a SIWS sign-in response\n\nImplement server-side verification of a SIWS sign-in output:\n\n- Check domain matches expected domain\n- Check nonce matches expected nonce\n- Check issuedAt is not in the future relative to currentTime\n- Check expirationTime (if present) has not passed\n- Check address matches expected signer\n- Return verification result mit individual check statuses und error list\n\nAll five checks must pass fuer the sign-in to be considered verified.",
            "duration": "50 min",
            "hints": [
              "Compare domain, nonce, und address between signInOutput und expected values.",
              "issuedAt must be <= currentTime (not in the future).",
              "expirationTime (if present) must be > currentTime.",
              "All five checks must pass fuer verified = true."
            ]
          },
          "siws-v2-sessions": {
            "title": "Sessions und logout: what to store und what not to store",
            "content": "# Sessions und logout: what to store und what not to store\n\nAfter a successful SIWS sign-in verification, the server must establish a session so the user does not need to re-authenticate on every request. Session management fuer wallet-based authentication has unique characteristics compared to traditional username-password systems. Understanding what to store, where to store it, und how to handle logout is essential fuer building secure dApps.\n\n## What a SIWS session contains\n\nA SIWS session represents a verified claim: \"Public key X proved ownership by signing a SIWS message fuer domain Y at time Z.\" The session should store exactly enough information to enforce authorization decisions without requiring re-verification. The minimum session payload includes: the wallet address (public key), the domain the sign-in was verified fuer, the session creation time, und the session expiration time.\n\nDo NOT store the SIWS signature, the signed message, or the nonce in the session. These are verification artifacts, not session data. The signature has no purpose after verification — it proved the user controlled the key at the time of signing, und that proof is now captured by the session itself. Storing signatures in sessions creates unnecessary data that, if leaked, provides no additional attack surface but adds complexity und storage cost.\n\nSession identifiers should be opaque, random tokens — not derived from the wallet address. Using the wallet address as a session ID is a common mistake because wallet addresses are public. Anyone who knows a user's address could forge requests. The session ID must be a cryptographically random string (e.g., 256-bit random value, base64-encoded) that maps to the session data on the server side.\n\n## Server-side vs client-side session storage\n\nServer-side sessions store session data in a backend store (Redis, database, in-memory map) und issue a session token (cookie or bearer token) to the client. The client presents the token on each request, und the server looks up the associated session data. This is the most secure pattern because the server controls all session state.\n\nClient-side sessions (JWTs) encode the session data directly in the token. The server signs the JWT und the client includes it in requests. The server verifies the JWT signature und reads the session data without a backend lookup. This is simpler to deploy but has significant drawbacks: JWTs cannot be individually revoked (you must wait fuer expiration or maintain a revocation list), the session data is visible to the client (encrypted JWTs mitigate this), und JWT size grows mit payload data.\n\nFuer SIWS authentication, server-side sessions are recommended because they support immediate revocation (critical fuer sicherheit incidents) und keep session data private. If using JWTs, keep the payload minimal (wallet address und expiration only), use short expiration times (15-60 minutes), und implement a refresh token flow fuer session extension.\n\n## Session expiration und refresh\n\nSession lifetimes fuer wallet-authenticated dApps should be shorter than traditional web sessions. Users can sign a new SIWS message quickly (a few seconds), so the cost of re-authentication is low. Recommended session lifetime is 1-4 hours fuer active sessions, mit a sliding window that extends the expiration on each authenticated request.\n\nRefresh tokens can extend session lifetime without requiring re-authentication. The flow is: issue a short-lived access token (15-60 minutes) und a longer-lived refresh token (24-72 hours). When the access token expires, the client presents the refresh token to obtain a new access token. The refresh token is single-use (rotated on each refresh) und stored securely.\n\nAbsolute session lifetime should be enforced regardless of refresh activity. Even if a user keeps refreshing, the session should eventually require re-authentication. A reasonable absolute lifetime is 7-30 days. This limits the damage from a stolen refresh token.\n\n## Logout implementation\n\nLogout fuer wallet-based authentication is simpler than login but has important nuances. The server must invalidate the session on the backend (delete the session from the store or add the JWT to a revocation list). The client must clear all local session artifacts (cookies, localStorage tokens, in-memory state).\n\nWallet disconnection is not the same as logout. When a user disconnects their wallet from the dApp (using the wallet's disconnect feature), the dApp should treat this as a logout signal und invalidate the server session. However, some dApps maintain the session even after wallet disconnection, which can confuse users who expect disconnection to log them out.\n\nImplementing \"logout everywhere\" (invalidating all sessions fuer a wallet address) requires server-side session storage mit an index by wallet address. When triggered, query all sessions fuer the address und invalidate them. This is useful fuer sicherheit incidents or when the user suspects their session was compromised.\n\n## What NOT to store in sessions\n\nNever store the user's private key (obviously). Never store the SIWS nonce (it has been consumed und should be deleted from the nonce store). Never store the raw SIWS signature (it is a verification artifact). Never store personally identifiable information (PII) unless your dApp explicitly collects it — wallet addresses are pseudonymous by default.\n\nAvoid storing wallet balances, token holdings, or other on-chain data in the session. This data changes constantly und becomes stale immediately. Fetch it fresh from the RPC when needed. Sessions should be lightweight: address, permissions, timestamps, und nothing more.\n\n## Checklist\n- Store wallet address, domain, creation time, und expiration in sessions\n- Use cryptographically random session IDs, not wallet addresses\n- Prefer server-side sessions fuer immediate revocation capability\n- Enforce absolute session lifetime even mit refresh tokens\n- Invalidate sessions on both logout und wallet disconnect\n- Never store signatures, nonces, or PII in sessions\n\n## Red flags\n- Using wallet address as session ID\n- Storing SIWS signature or nonce in the session\n- No session expiration or unlimited lifetime\n- JWT sessions without revocation mechanism\n- Ignoring wallet disconnect events\n",
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
                      "Random tokens are shorter und save bandwidth",
                      "Wallet addresses change frequently und break sessions"
                    ],
                    "answerIndex": 0,
                    "explanation": "Wallet addresses are publicly known. Using them as session IDs would allow anyone who knows a user's address to impersonate their session. Random tokens ensure only the authenticated client can present a valid session."
                  },
                  {
                    "id": "siws-v2-l6-q2",
                    "prompt": "What should happen when a user disconnects their wallet from a dApp?",
                    "options": [
                      "The dApp should invalidate the server-side session (treat it as logout)",
                      "Nothing — the session should persist fuer convenience",
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
            "title": "Replay protection und nonce registry design",
            "content": "# Replay protection und nonce registry design\n\nReplay attacks are the most critical threat to any signature-based authentication system. In a replay attack, an adversary captures a valid signed message und submits it again to the server, impersonating the original signer. SIWS addresses this mit nonce-based replay protection, but the implementation details of the nonce registry determine whether the protection actually works.\n\n## How replay attacks work against SIWS\n\nConsider a SIWS sign-in flow without proper nonce management. The user signs a message: \"example.com wants you to sign in mit your Solana konto: Wallet111... Nonce: abc123 Issued At: 2024-01-01T00:00:00Z\". The server verifies the signature und creates a session. The signed message und signature are transmitted over HTTPS und should be safe in transit.\n\nHowever, the signed message could be captured through: a compromised server log that records request bodies, a malicious browser extension that intercepts WebSocket traffic, a man-in-the-middle proxy in a development or corporate environment, or a compromised CDN that logs request payloads. If the attacker obtains the signed SIWS output, they can submit it to the server as if they were the original signer.\n\nWithout nonce protection, the server would verify the signature (it is valid — the user really did sign it), check the domain (it matches), check the timestamps (they may still be within bounds), und accept the authentication. The attacker now has a valid session fuer the victim's wallet address.\n\n## Nonce lifecycle\n\nThe nonce lifecycle has four phases: generation, issuance, verification, und consumption. Each phase has specific requirements.\n\nGeneration: the server creates a cryptographically random nonce using a secure random number generator. The nonce must be unpredictable — an attacker should not be able to guess the next nonce by observing previous ones. Use at least 128 bits of entropy (16 bytes, 22 base64 characters or 32 hex characters). Store the nonce in the registry mit a TTL und the expected wallet address.\n\nIssuance: the server includes the nonce in the SIWS input sent to the client. The nonce travels from server to client to wallet und back. During this transit, the nonce is not secret (it is included in the signed message), but it is unique. The important property is not secrecy but freshness — this specific nonce has never been used before.\n\nVerification: when the server receives the signed SIWS output, it extracts the nonce und checks the registry. The nonce must exist in the registry (rejecting fabricated nonces), must not be marked as consumed (rejecting replays), und must not have expired (rejecting stale requests). These checks must happen before signature verification to fail fast on obvious replays.\n\nConsumption: after successful verification, the nonce is atomically marked as consumed or deleted from the registry. This is the critical step — if consumption is not atomic, two concurrent requests mit the same nonce could both pass the \"not consumed\" check before either marks it as consumed. This race condition completely defeats replay protection.\n\n## Nonce registry design patterns\n\nThe nonce registry is the data structure that stores issued nonces und tracks their state. Several patterns are used in production.\n\nIn-memory map mit TTL: a simple hash map where keys are nonce strings und values are metadata (creation time, expected address, consumed flag). A background timer periodically cleans expired entries. This works fuer single-server deployments but does not scale to multiple servers (each server has its own map und cannot validate nonces issued by other servers).\n\nRedis mit atomic operations: Redis provides the ideal primitives fuer nonce management. Use SET mit NX (set-if-not-exists) fuer atomic consumption: attempt to set a \"consumed\" key; if it already exists, the nonce was already used. Use TTL on nonce keys fuer automatic expiration. Redis is distributed, so all servers share the same nonce registry.\n\nThe Redis pattern fuer atomic nonce consumption:\n\n1. On issuance: `SET nonce:<value> \"issued\" EX 600` (10-minute TTL)\n2. On verification: `SET nonce:<value>:consumed \"1\" NX EX 600`\n   - If SET NX succeeds (returns OK): nonce is valid und now consumed\n   - If SET NX fails (returns nil): nonce was already consumed (replay attempt)\n\nDatabase mit unique constraints: store nonces in a table mit a unique constraint on the nonce value und a \"consumed_at\" column. Consumption is an UPDATE that sets consumed_at where consumed_at IS NULL. If the update affects 0 rows, the nonce was already consumed. Database transaktionen ensure atomicity but add latency compared to Redis.\n\n## Handling edge cases\n\nClock skew between servers affects nonce TTL enforcement. If server A issues a nonce mit a 10-minute TTL but server B's clock is 3 minutes ahead, server B may consider the nonce expired after only 7 minutes from the user's perspective. Use NTP synchronization across servers und add a grace period (30-60 seconds) to TTL checks.\n\nNonce reuse across different wallet addresses should be rejected. Even if wallet A's nonce was consumed, do not allow wallet B to use the same nonce value. This is automatically handled if the nonce registry indexes by nonce value regardless of address. However, some implementations associate nonces mit specific addresses und might accidentally allow cross-address reuse.\n\nHigh-traffic systems may generate thousands of nonces per second. The registry must handle this volume without becoming a bottleneck. Redis handles this easily. In-memory maps work if garbage collection of expired nonces is efficient. Database-backed registries need proper indexing und periodic cleanup of consumed nonces.\n\n## Monitoring und alerting\n\nProduction nonce registries should emit metrics: nonces generated per minute, nonces consumed per minute, replay attempts blocked per minute, nonces expired unused per minute. A sudden spike in replay attempts indicates an active attack. A high ratio of expired-to-consumed nonces may indicate UX issues (users starting but not completing sign-in).\n\nLog every replay attempt mit the nonce value, the submitting IP address, und the associated wallet address. This data feeds into sicherheit incident investigation. Alert on replay attempt rates exceeding a threshold (e.g., more than 10 per minute from the same IP).\n\n## Checklist\n- Use cryptographically random nonces mit >= 128 bits of entropy\n- Implement atomic nonce consumption (check-und-invalidate in one operation)\n- Set nonce TTL matching the sign-in expiration window (5-15 minutes)\n- Use Redis or equivalent distributed store fuer multi-server deployments\n- Monitor und alert on replay attempt rates\n- Clean up expired nonces periodically\n\n## Red flags\n- Non-atomic nonce consumption (check-then-delete race condition)\n- In-memory nonce storage in a multi-server bereitstellung\n- No nonce TTL (nonces accumulate forever)\n- Allowing nonce reuse across different wallet addresses\n- No monitoring of replay attempt rates\n",
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
                    "note": "Cryptographically random, stored in Redis mit 10-min TTL"
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
            "content": "# Checkpoint: Generate an auth audit report\n\nBuild the final auth audit report that combines all kurs concepts:\n\n- Process an array of authentication attempts mit address, nonce, und verified status\n- Track used nonces to detect und block replay attempts (duplicate nonce = replay)\n- Count successful sign-ins, failed sign-ins, und replay attempts blocked\n- Count unique wallet addresses across all attempts\n- Build a nonce registry mit status fuer each attempt: \"consumed\", \"rejected\", or \"replay-blocked\"\n- Include the report timestamp\n\nThis checkpoint validates your complete understanding of SIWS authentication und nonce-based replay protection.",
            "duration": "55 min",
            "hints": [
              "Track used nonces in a map. If a nonce was already used, it's a replay attempt.",
              "Count successful (verified + new nonce), failed (not verified), und replay-blocked separately.",
              "Use an address set to count unique addresses.",
              "Build nonce registry mit status: 'consumed', 'rejected', or 'replay-blocked'."
            ]
          }
        }
      }
    }
  },
  "priority-fees-compute-budget": {
    "title": "Priority Fees & Compute Budget",
    "description": "Defensive Solana fee engineering mit deterministic compute planning, adaptive priority policy, und confirmation-aware UX reliability contracts.",
    "duration": "9 hours",
    "tags": [
      "solana",
      "fees",
      "compute-budget",
      "reliability"
    ],
    "modules": {
      "pfcb-v2-foundations": {
        "title": "Fee und Compute Foundations",
        "description": "Inclusion mechanics, compute/fee coupling, und explorer-driven policy design mit deterministic reliability framing.",
        "lessons": {
          "pfcb-v2-fee-market-reality": {
            "title": "Fee markets on Solana: what actually moves inclusion",
            "content": "# Fee markets on Solana: what actually moves inclusion\n\nPriority fees on Solana are often explained as a simple slider, but production systems need a more precise model. Inclusion is influenced by contention fuer compute, validator scheduling pressure, local leader behavior, und the transaktion's own resource request profile. Engineers who only look at a single median fee value usually misprice during bursty traffic und then overpay during recovery. This lektion gives a praktisch, defensive framework fuer pricing inclusion without relying on superstition.\n\nA transaktion does not compete only on total lamports paid. It competes on requested compute unit price und resource footprint under slot-level pressure. If you request very high compute units und low micro-lamports per compute unit, you may still lose to smaller requests paying a healthier rate. In practice, wallets should treat compute limit und compute price as coupled decisions. Choosing either one in isolation leads to unstable behavior. A route that usually lands mit 250,000 units may occasionally need 350,000 because state branches differ. If your safety margin is too tight, you fail. If your safety margin is too loose und your price is high, you overpay.\n\nDefensive engineering starts mit synthetic sample sets und deterministic policy simulation. Even if your production system eventually consumes live telemetry, your kurs project und baseline tests should prove policy behavior under controlled volatility regimes: calm, elevated, und spike. A calm regime might show p50 und p90 close together, while a spike regime has p90 several multiples above p50. This spread is important because it tells you whether your percentile target alone is enough, or whether you need a volatility guard that adds a controlled premium.\n\nAnother misunderstood point is confirmation UX. Users often interpret \"submitted\" as \"done,\" but processed status is still vulnerable to rollback scenarios und reordering. Fuer high-value flows, the UI should explain exactly why it waits fuer confirmed or finalized. This is not academic: support burden spikes when users see optimistic success then reversal. Defensive products align language mit protocol reality by attaching explicit state labels und expected next actions.\n\nA robust fee policy also defines failure classes. If a transaktion misses inclusion windows repeatedly, the policy should identify whether to raise compute price, raise compute limit, refresh blockhash, or re-quote. Blindly retrying the same payload can amplify congestion und degrade user trust. Good systems cap retries und emit deterministic diagnostics that make support und analytics useful.\n\nYou should model inclusion strategy as policy outputs, not imperative side effects. A policy function should return chosen percentile, volatility adjustment, final micro-lamports target, confidence label, und warnings. By keeping this deterministic und serializable, teams can diff policy versions und verify behavior changes before deploying. This is the same discipline used in risk engines: reproducible decisions first, runtime integrations second.\n\nFinally, keep user education integrated into the product flow. A short explanation that \"network congestion increased your priority fee to improve inclusion probability\" reduces confusion und failed-signature churn. It also helps users compare urgency tiers in a way that feels fair. Defensive UX is not only about blocking risky actions; it is about exposing enough context to prevent panic und repeated mistakes.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Operator mindset\n\nFee policy is an inclusion-probability model, not a guarantee engine. Good systems expose confidence, assumptions, und fallback actions explicitly so operators can respond quickly when regimes shift.\n\n## Checklist\n- Couple compute limit und compute price decisions in one policy output.\n- Use percentile targeting plus volatility guard fuer unstable markets.\n- Treat confirmation states as distinct UX contracts.\n- Cap retries und classify misses before adjusting fees.\n- Emit deterministic policy reports fuer audits und regressions.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "pfcb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "pfcb-v2-l1-q1",
                    "prompt": "Why should compute unit limit und price be planned together?",
                    "options": [
                      "Because inclusion depends on both requested resources und bid intensity",
                      "Because compute unit limit is ignored by validatoren",
                      "Because priority fee is fixed per transaktion"
                    ],
                    "answerIndex": 0,
                    "explanation": "A large CU request mit weak price can lose inclusion, while aggressive price on oversized CU can overpay."
                  },
                  {
                    "id": "pfcb-v2-l1-q2",
                    "prompt": "What does a wide p90 vs p50 spread usually indicate?",
                    "options": [
                      "A volatile fee regime where a guard premium may be needed",
                      "A bug in transaktion serialization",
                      "Guaranteed finalized confirmation"
                    ],
                    "answerIndex": 0,
                    "explanation": "Spread growth signals unstable contention und lower reliability fuer naive median pricing."
                  }
                ]
              }
            ]
          },
          "pfcb-v2-compute-budget-failure-modes": {
            "title": "Compute budget grundlagen und common failure modes",
            "content": "# Compute budget grundlagen und common failure modes\n\nMost transaktion failures blamed on \"network issues\" are actually planning errors in compute budget und payload sizing. A defensive client treats compute planning as a deterministic preflight policy: estimate required compute, apply bounded margin, decide whether heap allocation is warranted, und explain the result before signing. This lektion focuses on failure modes that recur in production wallets und DeFi frontends.\n\nThe first class is explicit compute exhaustion. When anweisung paths consume more than the transaktion limit, execution aborts und users still pay base fees fuer work already attempted. Teams frequently set one global limit fuer all routes, which is convenient but unreliable. Route complexity differs by pool topology, konto cache warmth, und konto creation branches. Planning must operate on per-flow estimates, not app-wide constants.\n\nThe second class is excessive compute requests paired mit aggressive bid pricing. This can cause overpayment und user distrust, especially in periods where lower limits would still succeed. A safe policy sets lower und upper bounds, applies a margin to synthetic or simulated expected compute, und clamps to protocol max. If a requested override is present, the system should still clamp und document why. Deterministic reasoning strings are useful because support und QA can inspect exactly why a plan was chosen.\n\nThe third class is transaktion size pressure. Large konto metas und anweisung data increase serialization footprint, und large payloads often correlate mit higher compute paths. While compute planning does not directly solve size limit errors, the same planner can emit a hint when transaktion size exceeds a threshold und recommend route simplification or decomposition. In this kurs, we keep it deterministic: no RPC checks, only input-driven policy outputs.\n\nA related failure class is memory pressure in workloads that deserialize heavy konto sets. Some clients include heap-frame recommendations based on route complexity or size threshold. If you include this in a deterministic planner, keep the conditions explicit und stable. Ambiguous heuristics create policy churn that is hard to test.\n\nGood confirmation UX is another defensive layer. Processed means accepted by a node, confirmed adds stronger network observation, finalized is strongest settlement confidence. Fuer low-value actions, processed plus pending indicator can be acceptable. Fuer high-risk value transfer, confirmed or finalized should gate \"success\" copy. Engineers should encode this as policy output rather than ad hoc component logic.\n\nA mature planner also returns warnings. Examples include \"override clamped to max,\" \"size indicates high serialization risk,\" or \"sample set too small fuer confident bid.\" Warnings should not be noisy; each one should map to an actionable path. Over-warning trains users to ignore alerts, while under-warning hides real risk.\n\nIn deterministic environments, each policy branch should be testable mit small synthetic fixtures. You want stable outputs fuer JSON snapshots, markdown reports, und support triage docs. This discipline scales to production because the same decision shape can later consume live inputs without changing contract semantics.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Compute plans should be bounded, deterministic, und explainable.\n- Planner should expose warning signals, not only numeric outputs.\n- Confirmation messaging should reflect actual settlement guarantees.\n- Inputs must be validated; invalid estimates should fail fast.\n- Unit tests should cover clamp logic und edge thresholds.\n",
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
            "content": "# Explorer: compute budget planner inputs to plan\n\nExplorers are useful only when they expose policy tradeoffs clearly. Fuer a fee und compute planner, that means visualizing how input estimates, percentile targets, und confirmation requirements produce a deterministic recommendation. This lektion frames an explorer as a decision table that can be replayed by engineers, support staff, und users.\n\nStart mit the three input groups: workload profile, fee samples, und UX confirmation target. Workload profile includes synthetic anweisung CU estimates und payload size. Fee samples represent recent or scenario-based micro-lamport values. Confirmation target defines settlement strictness fuer the user action type. A deterministic planner should convert these into a stable tuple: compute plan, priority estimate, und warnings.\n\nThe key teaching point is that explorer values should not mutate silently. If a user changes percentile from 50 to 75, the output should change in an obvious und traceable way. If volatility spread exceeds policy guard, the explorer should display a clear badge: \"guard applied.\" This approach teaches policy causality und prevents magical thinking about fees.\n\nExplorer design should also separate confidence from urgency. Confidence describes how trustworthy the current estimate is, often based on sample depth und spread stability. Urgency is a user choice: how quickly inclusion is desired. Confusing these concepts leads to poor defaults und frustrated users. A cautious user may still choose medium urgency if confidence is low und warnings are high.\n\nA defensive explorer includes side-by-side outputs fuer JSON und markdown summary. JSON provides machine-readable deterministic artifacts fuer snapshots und regression tests. Markdown provides human-readable communication fuer support und incident reviews. Both should derive from the same payload to avoid divergence.\n\nIn production teams, explorer traces can become a lightweight runbook. If a user reports repeated misses, support can replay the same inputs und inspect whether the policy selected reasonable values. If not, policy changes can be proposed mit test fixtures before rollout. If yes, the issue may be external congestion or stale quote flow, not planner logic.\n\nFrom an engineering quality perspective, deterministic explorers reduce blame cycles. Instead of \"it felt wrong,\" teams can point to exact sample sets, percentile choice, spread guard status, und final plan fields. This clarity is a force multiplier fuer reliability work.\n\nThe last design principle is explicit assumptions. If your explorer assumes synthetic samples, label them clearly. If it assumes no RPC feedback, state that. Honest boundaries improve trust und encourage users to interpret outputs correctly.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Show clear mapping from each input control to each output field.\n- Expose volatility guard activation as an explicit state.\n- Keep confidence und urgency as separate concepts.\n- Produce identical output fuer repeated identical inputs.\n- Export JSON und markdown from the same canonical payload.\n",
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
        "description": "Implement deterministic planners, confirmation policy engines, und stable fee strategy artifacts fuer release review.",
        "lessons": {
          "pfcb-v2-plan-compute-budget": {
            "title": "Challenge: implement planComputeBudget()",
            "content": "Implement a deterministic compute budget planner. No RPC calls; operate only on provided input data.",
            "duration": "40 min",
            "hints": [
              "Compute units should be ceil(total CU * 1.1) mit a floor of 80k und max of 1.4M.",
              "Enable heapBytes fuer very large tx payloads or high CU totals.",
              "Return a deterministic reason string fuer test stability."
            ]
          },
          "pfcb-v2-estimate-priority-fee": {
            "title": "Challenge: implement estimatePriorityFee()",
            "content": "Implement policy-based priority fee estimation using synthetic sample arrays und deterministic warnings.",
            "duration": "40 min",
            "hints": [
              "Use percentile targeting from sorted synthetic fee samples.",
              "Apply volatility guard if p90 vs p50 spread exceeds policy threshold.",
              "Clamp output between min und max micro-lamports."
            ]
          },
          "pfcb-v2-confirmation-ux-policy": {
            "title": "Challenge: confirmation level decision engine",
            "content": "Encode confirmation UX policy fuer processed, confirmed, und finalized states using deterministic risk bands.",
            "duration": "35 min",
            "hints": [
              "Map risk score bands to processed/confirmed/finalized UX levels.",
              "Keep output deterministic und string-stable."
            ]
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            "title": "Challenge: build feePlanSummary markdown",
            "content": "Build stable markdown output fuer a fee strategy summary that users und support teams can review quickly.",
            "duration": "35 min",
            "hints": [
              "Markdown output should be deterministic und human-readable.",
              "Avoid timestamps or random IDs in output."
            ]
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            "title": "Checkpoint: Fee Optimizer report",
            "content": "Produce a deterministic checkpoint report JSON fuer the Fee Optimizer final project artifact.",
            "duration": "45 min",
            "hints": [
              "Return stable JSON mit sorted warning strings.",
              "Checkpoint report should avoid nondeterministic fields."
            ]
          }
        }
      }
    }
  },
  "bundles-atomicity": {
    "title": "Bundles & Transaktion Atomicity",
    "description": "Design defensive multi-transaktion Solana flows mit deterministic atomicity validation, compensation modeling, und audit-ready safety reporting.",
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
        "description": "User-intent expectations, flow decomposition, und deterministic risk-graph modeling fuer multi-step reliability.",
        "lessons": {
          "bundles-v2-atomicity-model": {
            "title": "Atomicity concepts und why users assume all-or-nothing",
            "content": "# Atomicity concepts und why users assume all-or-nothing\n\nUsers rarely think in transaktion graphs. They think in intents: \"swap my token\" or \"close my position.\" When a workflow spans multiple transaktionen, user expectation remains all-or-nothing unless your UI teaches otherwise. This mismatch between intent-level atomicity und protocol-level execution can produce severe trust failures even when each transaktion is technically valid. Defensive engineering starts by mapping user intent boundaries und showing where partial execution can occur.\n\nIn Solana systems, multi-step flows are common. You may need token approval-like setup, associated token konto creation, route execution, und cleanup. Each step has independent confirmation behavior und can fail fuer different reasons. If a flow halts after a preparatory step, the user can be left in a state they never intended: allowances enabled, rent paid fuer unused konten, or funds moved into mittelstufe holding konten.\n\nA rigorous model begins mit explicit step typing. Every step should be tagged by function und risk: setup, value transfer, settlement, compensation, und cleanup. Then define dependencies between steps und mark whether each step is idempotent. Idempotency matters because retry logic can create duplicates if a step is not safely repeatable. This is not only a backend concern; frontend orchestration und wallet prompts must respect idempotency constraints.\n\nAnother key concept is compensating action coverage. If a value-transfer step fails midway, does a deterministic refund path exist? If not, your flow should be marked high risk und your UI should block or require additional confirmation. Teams often postpone compensation design until incident response, but defensive kurs design should treat compensation as a first-class requirement.\n\nBundle thinking helps organize these concerns. Even without live relay APIs, you can compose a deterministic bundle structure representing intended ordering und invariants. This structure teaches engineers how to reason about all-or-nothing intent, retries, und fallback paths. It also enables stable unit tests that validate graph shape und risk reports.\n\nFrom a UX angle, the most important move is honest framing. If strict atomicity is not guaranteed, state it directly. Users tolerate complexity when language is clear: \"Step 2 may fail after Step 1 succeeds; automatic refund logic is applied if needed.\" Hiding this reality may reduce initial friction but increases long-term mistrust.\n\nSupport und incident teams benefit from deterministic flow reports. A report should list steps, dependencies, idempotency status, und detected issues such as missing refunds or broken dependencies. When users report failed swaps, this report enables quick triage: was the failure expected und safely compensated, or did the flow violate defined invariants?\n\nUltimately, atomicity is a contract between engineering und user expectations. Protocol constraints do not remove that responsibility. They make explicit modeling, tests, und communication mandatory.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Operator mindset\n\nAtomicity is a user-trust contract. If strict all-or-nothing is unavailable, compensation guarantees und residual risks must be explicit, testable, und observable in reports.\n\n## Checklist\n- Model flows by intent, not only by transaktion count.\n- Annotate each step mit dependencies und idempotency.\n- Require explicit compensation paths fuer value-transfer failures.\n- Produce deterministic safety reports fuer each flow version.\n- Teach users where all-or-nothing is guaranteed und where it is not.\n",
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
                      "Because intent-level mentales modells are all-or-nothing",
                      "Because protocols always guarantee it",
                      "Because wallet adapters hide all failures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Users think in outcomes, not internal transaktion decomposition."
                  }
                ]
              }
            ]
          },
          "bundles-v2-flow-risk-points": {
            "title": "Multi-transaktion flows: approvals, ATA creation, swaps, refunds",
            "content": "# Multi-transaktion flows: approvals, ATA creation, swaps, refunds\n\nA reliable flow simulator must encode where partial execution risk lives. In practice, risk points cluster at boundaries: before value transfer, during value transfer, und after value transfer when cleanup or refund steps should run. This lektion maps common Solana flow stages und shows defensive controls that keep failure behavior predictable.\n\nThe first stage is prerequisite setup. Konto initialization und ATA creation are often safe und idempotent if implemented correctly, but they still consume fees und may fail under congestion. If setup fails, users should see precise messaging und retry guidance. If setup succeeds und later steps fail, your state machine must remember setup completion to avoid duplicate konto creation attempts.\n\nThe second stage is authorization-like setup. On Solana this may differ from EVM approvals, but the pattern remains: a step grants capability to later anweisungen. Non-idempotent or overly broad permissions here amplify downstream risk. Flow validatoren should detect non-idempotent authorization steps und force explicit refund or revocation logic if subsequent steps fail.\n\nThe third stage is value transfer or swap execution. This is where market drift, stale quotes, und route failure can break expectations. A deterministic simulator should not fetch live prices; instead it should model success/failure branches und expected compensation behavior. This lets teams test policy without network noise.\n\nThe fourth stage is compensation. If swap execution fails after setup or partial settlement, compensation is the difference between recoverable error und user-facing loss. Compensation steps must be discoverable, ordered, und testable. Simulators should flag flows missing compensation when any non-idempotent or value-affecting step exists.\n\nThe fifth stage is cleanup. Cleanup can include revoking transient permissions, closing temporary konten, or recording final status artifacts. Cleanup should be safe to retry und should not hide failures. Some teams skip cleanup during congestion, but then debt accumulates in user konten und backend state.\n\nDefensive patterns include idempotency keys fuer orchestration, deterministic status transitions, und explicit issue codes fuer each risk category. Fuer example, the missing-refund issue code should always map to the same report semantics so monitoring dashboards remain stable.\n\nA flow graph explorer can teach these points effectively. By visualizing nodes und edges mit risk annotations, teams quickly see where assumptions are weak. Edges should represent hard dependencies, not optional sequencing preferences. If a dependency references a missing step, the graph should fail validation immediately.\n\nDuring incident reviews, deterministic graph reports outperform log fragments. They provide compact, reproducible context: what was planned, what safety checks failed, und which invariants were violated. This reduces MTTR und avoids repeated misclassification.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Label setup, value, compensation, und cleanup steps explicitly.\n- Treat non-idempotent setup as high-risk without compensating actions.\n- Validate dependency graph integrity before execution planning.\n- Encode deterministic issue codes und severity mapping.\n- Keep simulator behavior offline und reproducible.\n",
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
            "title": "Explorer: flow graph steps und risk points",
            "content": "# Explorer: flow graph steps und risk points\n\nFlow graph explorers are most valuable when they highlight risk semantics, not just sequence order. A defensive explorer should display each step mit dependency context, idempotency flag, und compensation coverage. Engineers should be able to answer three questions immediately: what can fail, what can be retried safely, und what protects users if a value step fails.\n\nStart by treating each node as a contract. A node contract defines preconditions, side effects, und postconditions. Preconditions include required upstream steps und expected inputs. Side effects include konto state changes or transfer intents. Postconditions include observable status updates und possible compensation requirements. When node contracts are explicit, validation rules become straightforward und deterministic.\n\nEdges in the graph should represent hard causality. If step B depends on step A output, represent that as an edge und validate existence at build time. Optional order preferences should not be encoded as dependencies because they can produce false positives und brittle reports. Keep graph semantics strict und minimal.\n\nRisk annotations should be first-class fields. Instead of deducing risk later from prose, attach tags such as value-transfer, non-idempotent, requires-refund, und cleanup-only. Report generation can then aggregate these tags into issue summaries und recommended mitigations.\n\nA robust explorer also teaches \"atomic in user model\" versus \"atomic on chain.\" You can annotate the whole flow mit intent boundary metadata that states whether strict atomic guarantee exists. If not, the explorer should list compensation guarantees und residual risk in plain language.\n\nDeterministic bundle composition is a useful next layer. Even without calling relay services, you can generate a bundle artifact that enumerates transaktion groupings und invariants. This allows stable comparisons across policy revisions. If a future change removes a refund invariant, tests should fail immediately.\n\nEngineers should avoid dynamic output fields like timestamps inside core report payloads. Keep those in outer metadata if needed. Stable JSON und markdown outputs make review diffs reliable und reduce false positives in CI snapshots.\n\nFrom a teaching standpoint, explorer sessions should include both safe und unsafe examples. Seeing a missing dependency or missing refund issue in a concrete graph is more memorable than reading abstract warnings. The kurs challenge sequence then asks learners to codify the same checks.\n\nFinally, remember that atomicity work is reliability work. It is not a special sicherheit-only track. The same graph discipline helps product, backend, und support teams share one truth source fuer multi-step behavior.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Represent node contracts und dependency edges explicitly.\n- Annotate risk tags directly in graph data.\n- Distinguish user-intent atomicity from protocol guarantees.\n- Generate deterministic bundle und report artifacts.\n- Include unsafe example graphs in test fixtures.\n",
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
                      "label": "Safe flow mit compensation",
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
        "description": "Build, validate, und report deterministic flow safety mit compensation checks, idempotency handling, und bundle artifacts.",
        "lessons": {
          "bundles-v2-build-atomic-flow": {
            "title": "Challenge: implement buildAtomicFlow()",
            "content": "Build a normalized deterministic flow graph from steps und dependencies.",
            "duration": "40 min",
            "hints": [
              "Normalize order by step ID und dependency ID fuer deterministic flow graphs.",
              "Emit explicit edges from dependency relationships."
            ]
          },
          "bundles-v2-validate-atomicity": {
            "title": "Challenge: implement validateAtomicity()",
            "content": "Detect partial execution risk, missing refunds, und non-idempotent steps.",
            "duration": "40 min",
            "hints": [
              "Detect missing refund branch fuer swap flows.",
              "Flag non-idempotent steps because retries can break all-or-nothing guarantees."
            ]
          },
          "bundles-v2-failure-handling-patterns": {
            "title": "Challenge: failure handling mit idempotency keys",
            "content": "Encode deterministic failure handling metadata, including compensation state.",
            "duration": "35 min",
            "hints": [
              "Generate deterministic idempotency keys from stable inputs.",
              "Always emit explicit refund-path state fuer observability."
            ]
          },
          "bundles-v2-bundle-composer": {
            "title": "Challenge: deterministic bundle composer",
            "content": "Compose a deterministic bundle structure fuer an atomic flow. No relay calls.",
            "duration": "35 min",
            "hints": [
              "No real Jito calls. Build deterministic data structures only.",
              "One step per transaktion keeps test assertions simple und stable."
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
    "description": "Defensive swap UX engineering mit deterministic risk grading, bounded slippage policies, und incident-ready safety communication.",
    "duration": "9 hours",
    "tags": [
      "mempool",
      "ux",
      "slippage",
      "risk-policy"
    ],
    "modules": {
      "mempoolux-v2-foundations": {
        "title": "Mempool Reality und UX Defense",
        "description": "Quote-to-execution risk modeling, slippage guardrails, und defensive user education fuer safer swap decisions.",
        "lessons": {
          "mempoolux-v2-quote-execution-gap": {
            "title": "What can go wrong between quote und execution",
            "content": "# What can go wrong between quote und execution\n\nA swap quote is a prediction, not a guarantee. Between quote generation und execution, liquidity changes, competing orders land, und network conditions shift. Users often assume that seeing a quote means they will receive that outcome, but production UX must teach und enforce the gap between quote time und execution time. This kurs is defensive by design: no exploit strategies, only protective policy und communication.\n\nThe first risk is quote staleness. Even in calm periods, a quote generated several seconds ago can diverge from current route quality. During high activity, divergence can happen in sub-second windows. A protective UI should track quote age continuously und degrade confidence as age increases. At defined thresholds, it should warn or block execution until a refresh occurs.\n\nThe second risk is slippage misconfiguration. Slippage tolerance exists to bound acceptable execution drift. If set too tight, legitimate transaktionen fail frequently. If set too wide, users can receive unexpectedly poor execution. Defensive systems define policy bounds und recommend values based on route characteristics, not a single static default.\n\nThe third risk is preiseinfluss misunderstanding. Preiseinfluss measures how much your order moves market price due to route depth. Slippage tolerance measures allowed execution variance. They are related but not interchangeable. Teaching this difference prevents users from widening slippage to \"fix\" impact-heavy trades that should instead be resized or rerouted.\n\nThe fourth risk is route complexity. Multi-hop routes can improve nominal quote value but introduce more points of state dependency und timing drift. A risk engine should konto fuer hop count as a reliability input. This does not mean all multi-hop routes are unsafe; it means risk should be surfaced proportionally.\n\nThe fifth risk is liquidity quality. Low-liquidity routes are more fragile under contention. Deterministic scoring can treat liquidity as one signal among many, producing grade outputs like low, medium, high, und critical. Grades should be accompanied by reasons, so warnings are explainable.\n\nProtective UX is not just warning banners. It includes defaults, disabled states, timed refresh prompts, und clear language about what each control does. If users do not understand controls, they either ignore them or misconfigure them. The best interfaces explain tradeoffs in one sentence und keep fortgeschritten controls available without forcing novices into risky settings.\n\nPolicy engines should produce deterministic artifacts fuer testability. Given identical input tuples, risk grade und warnings should remain identical. This enables stable unit tests und predictable support behavior. It also allows teams to review policy changes as code diffs rather than subjective UI adjustments.\n\nThe goal is not zero failed swaps; the goal is informed, bounded risk mit transparent behavior. Users accept tradeoffs when systems are honest und consistent.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Operator mindset\n\nProtected swap UX is policy UX. Defaults, warnings, und block states should be deterministic, explainable, und versioned so teams can defend decisions during incidents.\n\n## Checklist\n- Track quote age und apply graded stale-quote policies.\n- Separate preiseinfluss education from slippage controls.\n- Incorporate route hops und liquidity into risk scoring.\n- Emit deterministic risk reasons fuer UX copy.\n- Block execution only when policy thresholds are clearly crossed.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mempoolux-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mempoolux-v2-l1-q1",
                    "prompt": "What is the primary difference between slippage und preiseinfluss?",
                    "options": [
                      "Slippage is user tolerance; impact is market footprint",
                      "They are identical metrics",
                      "Preiseinfluss only applies on CEXs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Slippage is a user-configured bound, while impact reflects route liquidity response to trade size."
                  }
                ]
              }
            ]
          },
          "mempoolux-v2-slippage-guardrails": {
            "title": "Slippage controls und guardrails",
            "content": "# Slippage controls und guardrails\n\nSlippage settings are a policy surface, not a cosmetic preference. Defensive swap UX defines explicit bounds, context-aware defaults, und clear consequences when users attempt risky overrides. This lektion focuses on guardrail design that reduces avoidable losses while preserving user agency.\n\nA strong policy starts mit minimum und maximum bounds. The minimum protects against unusable settings that cause endless failures. The maximum protects against overly permissive settings that convert volatility into severe execution loss. Between bounds, choose a default aligned mit typical route behavior. Fuer many flows this is moderate, then dynamically adjusted by quote freshness und impact context.\n\nGuardrails should respond to stale quotes. If quote age passes a threshold, a safe policy can lower recommended slippage und request refresh before signing. If quote age becomes severely stale, execution should be blocked mit a deterministic message. Blocking should be rare but unambiguous. Users should know whether a refresh can unblock immediately.\n\nImpact-aware adjustment is another essential control. High projected impact may require either tighter trade sizing or broader tolerance depending on objective. Defensive UX should encourage reviewing trade size first, not instantly widening tolerance. If users choose high tolerance anyway, warnings should explain downside plainly.\n\nOverride behavior must be deterministic. When a user-selected value exceeds policy max, clamp it und emit a warning that can be exported in reports. Silent clamping is dangerous because users think they are running one setting while the engine uses another. Explicit feedback builds trust und prevents support confusion.\n\nCopy quality matters. Avoid technical jargon in warning body text. A good warning says what is wrong, why it matters, und what to do next. Fuer example: \"Quote is stale; refresh before signing to avoid outdated execution terms.\" This is better than \"staleness threshold exceeded.\" Engineers can keep technical details in debug exports.\n\nGuardrails should also integrate mit route preview components. Showing risk grade beside slippage recommendation helps users interpret controls in context. If grade is high und slippage recommendation is near max, the UI should highlight additional caution und maybe suggest smaller size.\n\nFrom an implementation perspective, a pure deterministic function is ideal: input config plus quote context yields warnings, recommended bps, und blocked flag. This function can be unit tested across edge scenarios und reused in frontend und backend validation paths.\n\nFinally, policy reviews should be versioned. If teams change bounds or thresholds, they should compare old und new outputs across fixture sets before rollout. This prevents regressions where well-intended tweaks accidentally increase risk exposure.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Define min, default, und max slippage as explicit policy values.\n- Apply stale-quote logic before execution und adjust recommendations.\n- Clamp unsafe overrides mit clear warning messages.\n- Surface blocked state only fuer clearly defined severe conditions.\n- Keep policy deterministic und version-reviewable.\n",
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
            "title": "Explorer: quote freshness timer und decision table",
            "content": "# Explorer: quote freshness timer und decision table\n\nA quote freshness explorer should make policy behavior obvious under time pressure. Users und engineers need to see when a quote transitions from safe to warning to blocked. This lektion defines a decision table approach that pairs timer state mit slippage und impact context.\n\nThe timer should not be a decorative countdown. It is a state driver mit explicit thresholds. Fuer example, 0-10 seconds may be low concern, 10-20 seconds warning, und above 20 seconds blocked fuer certain route classes. Thresholds can vary by asset class und liquidity quality, but the explorer must display the active policy version so users understand why behavior changed.\n\nDecision tables combine timer bands mit additional signals: projected impact, hop count, und liquidity score. A single stale timer does not always imply severe risk; it depends on route fragility. Deterministic scoring helps aggregate these dimensions into one grade while preserving reason strings.\n\nAn effective explorer view presents both grade und recommendation fields. Grade communicates severity. Recommendation communicates next action: refresh quote, tighten slippage, reduce size, or proceed. Without recommendation, users see red flags but lack direction.\n\nEngineers should include edge fixtures where metrics conflict. Example: fresh quote but very high impact und low liquidity; or stale quote mit low impact und high liquidity. These fixtures prevent simplistic heuristics from dominating policy und help teams calibrate thresholds intentionally.\n\nThe explorer also supports user education around anti-sandwich posture without teaching offensive behavior. You can explain that wider slippage und stale quotes increase adverse execution risk, und that refreshing quote plus tighter controls reduces exposure. Keep messaging defensive und praktisch.\n\nFuer reliability teams, deterministic explorer outputs become regression baselines. If a code change alters grade fuer a fixture unexpectedly, CI catches it before production. This is particularly important when tuning thresholds during volatile periods.\n\nOutput formatting should remain stable. Use canonical JSON order fuer exported config, und stable markdown fuer support docs. Avoid timestamps in core payloads to preserve snapshot equality. If timestamps are required, store them outside deterministic artifact fields.\n\nFinally, link explorer states to UI banners. If grade is critical, banner severity should be error mit explicit action. If grade is medium, warning banner mit optional guidance may suffice. This mapping is implemented in later challenges.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Treat freshness timer as policy input, not visual decoration.\n- Combine timer state mit impact, hops, und liquidity signals.\n- Emit grade plus actionable recommendation.\n- Test conflicting-signal fixtures fuer policy balance.\n- Keep exported artifacts deterministic und stable.\n",
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
        "description": "Implement deterministic policy engines, safety messaging, und stable protection-config artifacts fuer release governance.",
        "lessons": {
          "mempoolux-v2-evaluate-swap-risk": {
            "title": "Challenge: implement evaluateSwapRisk()",
            "content": "Implement deterministic swap risk grading from quote, slippage, impact, hops, und liquidity inputs.",
            "duration": "40 min",
            "hints": [
              "Use additive policy scoring from quote freshness, slippage, impact, route, und liquidity.",
              "Return both risk grade und concrete reasons fuer UX copy generation."
            ]
          },
          "mempoolux-v2-slippage-guard": {
            "title": "Challenge: implement slippageGuard()",
            "content": "Build bounded slippage recommendations mit warnings und hard-block states.",
            "duration": "40 min",
            "hints": [
              "Clamp recommended BPS to policy bounds.",
              "Stale quotes should lower tolerance und may block if very stale."
            ]
          },
          "mempoolux-v2-impact-vs-slippage": {
            "title": "Challenge: model preiseinfluss vs slippage",
            "content": "Encode a deterministic interpretation of impact-to-tolerance ratio fuer user education.",
            "duration": "35 min",
            "hints": [
              "Teach difference: impact is market footprint, slippage is user tolerance.",
              "Return both ratio und interpretation fuer UI hints."
            ]
          },
          "mempoolux-v2-swap-safety-banner": {
            "title": "Challenge: build swapSafetyBanner()",
            "content": "Map deterministic risk grades to defensive banner copy und severity.",
            "duration": "35 min",
            "hints": [
              "Map risk grades to deterministic banner copy.",
              "Avoid exploit framing; keep copy defensive und user-focused."
            ]
          },
          "mempoolux-v2-protection-config-export": {
            "title": "Checkpoint: swap protection config export",
            "content": "Export a stable deterministic policy config artifact fuer the Protected Swap UI checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be deterministic JSON fuer copy/export behavior.",
              "Do not include timestamps or random IDs."
            ]
          }
        }
      }
    }
  },
  "indexing-webhooks-pipelines": {
    "title": "Indexers, Webhooks & Reorg-Safe Pipelines",
    "description": "Build production-grade deterministic indexing pipelines fuer duplicate-safe ingestion, reorg handling, und integrity-first reporting.",
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
        "description": "Event identity modeling, confirmation semantics, und deterministic ingest-to-apply pipeline behavior.",
        "lessons": {
          "indexpipe-v2-indexing-basics": {
            "title": "Indexing 101: logs, konten, und transaktion parsing",
            "content": "# Indexing 101: logs, konten, und transaktion parsing\n\nReliable indexers are not just fast parsers. They are consistency systems that decide what to trust, when to trust it, und how to recover from changing chain history. On Solana, event ingestion often starts from logs or parsed anweisungen, but production pipelines need deterministic keying, replay controls, und state application rules that survive retries und reorgs.\n\nA basic pipeline has four stages: ingest, dedupe, confirmation gating, und state apply. Ingest captures raw events mit enough metadata to reconstruct ordering context: slot, signature, anweisung index, event type, und affected konto. Dedupe ensures duplicate deliveries do not produce duplicate state transitions. Confirmation gating delays state application until depth conditions are met. Apply mutates snapshots in deterministic order.\n\nMany teams fail in the first stage by capturing incomplete event identity fields. If you omit anweisung index or event kind, collisions appear und dedupe becomes unsafe. Composite keys should be explicit und stable. They should also be derived purely from event payload so keys remain reproducible in tests und backfills.\n\nParsing strategy matters too. Logs are convenient but can drift across program versions. Parsed anweisung data can be more structured but may require custom decoders. Defensive indexing stores normalized events in one canonical schema regardless of source. This isolates downstream logic from parser changes.\n\nIdempotency is essential. Your ingestion path may receive duplicates from retries, webhook redelivery, or backfill overlap. If dedupe is weak, balances drift und downstream analytics become untrustworthy. Deterministic dedupe mit composite keys is the first line of defense.\n\nThe apply stage should avoid hidden nondeterminism. If events are applied in arrival order without stable sort keys, two replays can produce different snapshots. Always sort by deterministic key before apply. If you need tie-breakers, define them explicitly.\n\nSnapshot design should prioritize auditability. Keep applied event keys, pending keys, und finalized keys visible. These sets make it easy to reason about what the snapshot currently reflects und why. They also simplify integrity checks later.\n\nFinally, keep deterministic outputs central to your developer workflow. Pipeline reports und snapshots should be exportable in stable formats fuer test snapshots und incident analysis. Reliability work depends on reproducible evidence.\n\n\nTo keep this durable, teams should document fixture ownership und rotate review responsibilities so event taxonomy stays aligned mit protocol upgrades. Without this operational ownership, pipelines drift into untested assumptions, und recovery playbooks age out. Deterministic explorers stay valuable only when fixtures evolve mit production reality und every stage still reports clear, machine-verifiable state transitions under replay und stress.\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Operator mindset\n\nIndexing is a correctness pipeline before it is an analytics pipeline. Fast ingestion mit weak dedupe, confirmation, or replay guarantees produces confidently wrong outputs.\n\n## Checklist\n- Capture complete event identity fields at ingest time.\n- Normalize events from logs und parsed anweisungen into one schema.\n- Use deterministic composite keys fuer dedupe.\n- Sort events stably before state application.\n- Track applied, pending, und finalized sets in snapshots.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexpipe-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexpipe-v2-l1-q1",
                    "prompt": "Why is anweisung index important in event keys?",
                    "options": [
                      "It helps prevent collisions when one transaktion emits similar events",
                      "It reduces RPC cost directly",
                      "It replaces confirmation checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Anweisung index distinguishes same-signature events that would otherwise collide in dedupe."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            "title": "Reorgs und fork choice: why confirmed is not finalized",
            "content": "# Reorgs und fork choice: why confirmed is not finalized\n\nConfirmation labels are useful but often misunderstood in indexing pipelines. A confirmed event has stronger confidence than processed, but it is not equivalent to final settlement. Pipelines that apply confirmed events directly to user-visible balances without rollback strategy can show transient truth as permanent truth. Defensive design acknowledges this und encodes reversible state transitions.\n\nReorg-aware indexing starts mit depth thresholds. Fuer each event, compute depth as head slot minus event slot. If depth is below confirmed threshold, event remains pending. If depth passes confirmed threshold, event can be applied to provisional state. If depth passes finalized threshold, event is considered settled. These rules should be policy inputs, not hidden constants.\n\nWhy maintain provisional state at all? Because users und systems often need timely feedback before finalization. The solution is not to ignore confirmed events but to annotate confidence clearly. Dashboards can show provisional balances mit settlement badges. Automated systems can choose whether to act on provisional or finalized data.\n\nFork choice changes can invalidate previously observed confirmed events. If your pipeline tracks applied keys und supports replay, you can recompute snapshot deterministically from deduped events und updated confirmation context. Pipelines that mutate opaque state without replay ability struggle during reorg recovery.\n\nDeterministic apply logic helps here. If the same deduped event set und same confirmation policy produce the same snapshot every run, recovery is straightforward. If apply order depends on arrival timing, recovery becomes guesswork.\n\nAnother reliability pattern is explicit pending queues. Instead of dropping low-depth events, keep them keyed und observable. This improves debugging: you can explain to users that an event exists but has not crossed confirmation threshold. It also avoids ingestion gaps when head advances.\n\nIntegrity checks should enforce structural assumptions: finalized keys must be a subset of applied keys, balances must be finite und non-negative under your business rules, und snapshot counts should align mit event sets. Failing these checks should mark snapshot as invalid und block downstream export.\n\nCommunication matters as much as mechanics. Product teams should avoid copy that implies final settlement when data is only confirmed. Small text differences reduce major support incidents during volatile periods.\n\nThe overarching principle is to make uncertainty explicit und reversible. Reorg-safe pipelines are less about predicting forks und more about handling them cleanly when they happen.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Define confirmed und finalized depth thresholds explicitly.\n- Separate pending, applied, und finalized event sets.\n- Keep replayable deterministic apply logic.\n- Run integrity checks on every snapshot export.\n- Surface settlement confidence clearly in UI und APIs.\n",
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
                    "note": "Candidate fuer provisional state."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-pipeline-explorer": {
            "title": "Explorer: ingest to dedupe to confirm to apply",
            "content": "# Explorer: ingest to dedupe to confirm to apply\n\nA pipeline explorer should explain transformation stages clearly so engineers can inspect where correctness can break. Fuer indexing reliability, the core stages are ingest, dedupe, confirmation gating, und apply. Each stage must expose deterministic inputs und outputs.\n\nIngest stage receives raw events from simulated webhooks, log streams, or backfills. At this point, duplicates und out-of-order delivery are expected. The explorer should show raw count und normalized schema count so users can verify parser coverage.\n\nDedupe stage converts event arrays into a set based on composite keys. Good explorers display before/after counts und list dropped duplicates. This transparency helps debug webhook retries und backfill overlap behavior.\n\nConfirmation stage partitions deduped events into pending, applied, und finalized sets based on depth policy. The explorer should make head slot und policy thresholds visible. Hidden thresholds are a frequent source of confusion when teams compare environments.\n\nApply stage computes konto balances or state snapshots deterministically from applied events only. Explorer outputs should include sorted balances und event key lists. Sorted output is crucial fuer snapshot equality tests.\n\nIntegrity stage validates structural assumptions: no negative balances, no non-finite numbers, finalized subset relation, und stable event references. The explorer should display PASS/FAIL und issue list. This teaches engineers to treat integrity checks as mandatory gates, not optional diagnostics.\n\nFuer backfills, explorer scenarios should include missing-slot windows und idempotency keys. This demonstrates how replay-safe job planning interacts mit the same dedupe und apply rules. A reliable backfill system does not bypass core pipeline logic.\n\nDeterministic report generation closes the loop. Export markdown fuer human review und JSON fuer machine consumption. Both should be reproducible from the same snapshot object. Avoid embedding volatile metadata in core payload fields.\n\nA well-designed explorer becomes a teaching tool und an operational tool. During incidents, teams can replay problematic event sets und compare outputs across policy versions. During onboarding, new engineers lerne stage responsibilities quickly without production access.\n\nOperational ownership keeps this useful over time. Teams should rotate fixture maintenance responsibilities und document why each scenario exists so updates remain intentional. As protocols evolve, parser assumptions und event fields can drift. A maintained explorer corpus catches drift early, forces policy review before releases, und preserves confidence that ingest, dedupe, confirmation gating, und apply stages still produce reproducible results under stress.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Show per-stage counts und transformations.\n- Make confirmation policy parameters explicit.\n- Render sorted deterministic snapshots.\n- Gate exports on integrity checks.\n- Keep report payloads stable fuer regression tests.\n",
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
        "description": "Build dedupe, confirmation-aware apply logic, integrity gates, und stable reporting artifacts fuer operational triage.",
        "lessons": {
          "indexpipe-v2-dedupe-events": {
            "title": "Challenge: implement dedupeEvents()",
            "content": "Implement stable event deduplication mit deterministic composite keys.",
            "duration": "40 min",
            "hints": [
              "Build stable composite keys fuer dedupe.",
              "Sort by key so output is deterministic across runs."
            ]
          },
          "indexpipe-v2-apply-confirmations": {
            "title": "Challenge: implement applyWithConfirmations()",
            "content": "Apply events deterministically mit confirmation depth policy und pending/finalized sets.",
            "duration": "40 min",
            "hints": [
              "Apply only confirmed-depth events to state.",
              "Track pending und finalized sets separately fuer reorg safety."
            ]
          },
          "indexpipe-v2-backfill-idempotency": {
            "title": "Challenge: backfill und idempotency planning",
            "content": "Create deterministic backfill planning output mit replay-safe idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Backfills should be resumable und idempotent.",
              "Emit a deterministic key fuer replay-safe job scheduling."
            ]
          },
          "indexpipe-v2-snapshot-integrity": {
            "title": "Challenge: snapshot integrity checks",
            "content": "Implement deterministic snapshotIntegrityCheck() outputs fuer negative und structural failures.",
            "duration": "35 min",
            "hints": [
              "Integrity checks must fail on negative balances.",
              "Finalized keys must always be a subset of applied keys."
            ]
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline report export",
            "content": "Generate a stable markdown report artifact fuer the Reorg-Safe Indexer checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be markdown und deterministic.",
              "Include applied/pending/finalized counts und integrity result."
            ]
          }
        }
      }
    }
  },
  "rpc-reliability-latency": {
    "title": "RPC Reliability & Latency Engineering",
    "description": "Engineer production multi-provider Solana RPC clients mit deterministic retry, routing, caching, und observability policies.",
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
        "description": "Real-world RPC failure behavior, endpoint selection strategy, und deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
            "content": "# RPC failures in real life: timeouts, 429s, stale nodes\n\nReliable client infrastructure begins mit realistic failure assumptions. RPC calls fail fuer many reasons: transient network timeouts, provider rate limits, stale nodes trailing cluster head, und occasional inconsistent responses under load. A defensive client does not treat these as edge cases; it treats them as normal operating conditions.\n\nTimeouts are the most common class. If timeout values are too short, healthy providers appear unreliable. If too long, user-facing latency becomes unacceptable und retries trigger too late. Good policy defines request timeout by operation type und sets bounded retry schedules.\n\nHTTP 429 rate limiting is another predictable behavior, not a surprise. Providers enforce quotas und burst controls. A resilient client observes 429 ratio per endpoint und adapts by reducing pressure on overloaded nodes while shifting traffic to healthier ones. Blind retry against the same endpoint amplifies throttling.\n\nStale node lag is particularly dangerous fuer state-sensitive applications. A node can respond quickly but serve outdated slot state, causing confusing balances or stale quote decisions. Endpoint health scoring should include slot lag, not only latency und success rate.\n\nMulti-provider strategy is the baseline fuer serious applications. Even when one provider is excellent, outages und regional issues happen. A client should maintain endpoint metadata, collect health samples, und choose endpoints by deterministic policy rather than random rotation.\n\nObservability is what makes reliability engineering actionable. Track total requests, success/error counts, latency quantiles, und histogram buckets. Without this telemetry, teams tune retry policies by anecdote. Mit telemetry, teams can identify whether changes improve p95 latency or simply shift failures around.\n\nDeterministic policy modeling is valuable before production integration. You can simulate endpoint samples und verify that selection behavior is stable und explainable. If the chosen endpoint changes unexpectedly fuer identical input samples, your scoring function needs refinement.\n\nCaching adds complexity. Cache misses und stale reads are not just leistung details; they affect correctness. Invalidation policy should react to konto changes und node lag. Aggressive invalidation may increase load; weak invalidation may serve stale state. Explicit policy und metrics help navigate this tradeoff.\n\nThe core message is pragmatic: assume RPC instability, design fuer graceful degradation, und measure everything mit deterministic reducers that can be unit tested.\n\n\nOperational readiness also requires owning fixture updates as providers change rate-limit behavior und latency profiles. If fixture sets stay static, policy tuning optimizes fuer old incidents und misses new failure signatures. Keep a cadence fuer reviewing percentile distributions, endpoint score drift, und retry outcomes so deterministic policies remain grounded in current provider behavior while preserving reproducibility.\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Operator mindset\n\nRPC policy is risk routing, not just request routing. Endpoint choice, retry cadence, und cache invalidation directly determine whether users see timely truth or stale confusion.\n\n## Checklist\n- Treat timeouts, 429s, und stale lag as default conditions.\n- Use multi-provider endpoint selection mit health scoring.\n- Include slot lag in endpoint quality calculations.\n- Define retry schedules mit bounded backoff.\n- Instrument latency und success metrics continuously.\n",
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
                      "Slot lag only affects validator rewards",
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
            "title": "Multi-endpoint strategies: hedged requests und fallbacks",
            "content": "# Multi-endpoint strategies: hedged requests und fallbacks\n\nMulti-endpoint design is more than adding a backup URL. It is a scheduling problem where each request should be sent to the most suitable endpoint given recent health signals und operation urgency. This lektion focuses on deterministic strategy patterns you can validate offline.\n\nFallback strategy is the simplest pattern: try one endpoint, then another on failure. It reduces outage risk but may still produce high tail latency if initial endpoints are degraded. Hedged strategy improves tail latency by issuing a second request after a short delay if the first has not returned. Hedging increases load, so it must be controlled by policy und only used fuer high-value paths.\n\nEndpoint selection should rely on a composite score that includes success rate, p95 latency, rate-limit ratio, slot lag, und optional static weight fuer trusted providers. Scores should be computed deterministically from sampled inputs so decisions are reproducible. Tie-breaking should also be deterministic to avoid flapping.\n\nRate-limit-aware routing is critical. If one provider shows increasing 429 ratio, a resilient client should back off traffic there und prefer alternatives. This avoids retry storms und helps maintain aggregate throughput.\n\nRegional diversity adds resilience. If all endpoints are in one region, regional network incidents can affect all providers simultaneously. Tagging endpoints by region allows policy constraints such as preferring local region first but failing over cross-region when health degrades.\n\nCircuit-breaking patterns can protect users during severe incidents. If an endpoint crosses error thresholds, mark it temporarily degraded und avoid selecting it fuer a cooling period. Deterministic simulations can model this behavior without real network calls.\n\nObservability ties it together. Endpoint decisions should emit reasoning strings or structured fields so operators can inspect why a node was chosen. This is especially useful when users report intermittent failures.\n\nIn many systems, endpoint policy und retry policy are separate module. Keep interfaces clean: selection chooses target endpoint, retry schedule defines attempts und delays, metrics reducer evaluates outcomes. This separation improves testability und change safety.\n\nFinally, avoid hidden randomness in core selection logic. Randomized tie-breakers may seem harmless but they complicate reproducibility und debugging. Deterministic order supports reliable incident analysis.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Score endpoints using multiple reliability signals.\n- Use deterministic tie-breaking to avoid flapping.\n- Apply rate-limit-aware traffic shifting.\n- Keep fallback und retry policy responsibilities separate.\n- Emit endpoint reasoning fuer operational debugging.\n",
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
                    "output": "score lower due to throttling und lag",
                    "note": "Fast but less reliable under pressure."
                  }
                ]
              }
            ]
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
            "content": "# Explorer: retry/backoff simulator\n\nRetry und backoff policies determine whether clients recover gracefully or amplify outages. A simulator should make schedule behavior explicit so teams can reason about user latency und provider pressure. This lektion builds a deterministic view of retry policy outputs und their tradeoffs.\n\nA retry schedule has three core dimensions: number of attempts, per-attempt timeout, und delay before each retry. Exponential backoff grows delay rapidly und reduces pressure in prolonged incidents. Linear backoff grows slower und can be useful fuer short-lived blips. Both need max-delay caps to avoid runaway wait times.\n\nThe first attempt should always be represented in the schedule mit zero delay. This improves traceability und ensures telemetry can map attempt index to behavior consistently. Many teams model only retries und lose visibility into full request lifecycle.\n\nPolicy inputs should be validated. Negative retries or non-positive timeouts are configuration errors und should fail fast. Deterministic validation in a pure function prevents silent misconfiguration in production.\n\nThe simulator should also show expected user-facing latency envelope. Fuer example, timeout 900ms mit two retries und exponential delays of 100ms und 200ms implies worst-case response around 2.9 seconds before failover completion. This helps product teams set realistic loading copy.\n\nRetry policy must integrate mit endpoint selection. Retrying against the same degraded endpoint repeatedly is usually inferior to endpoint-aware retries. Even if your simulator keeps module separate, it should explain this interaction.\n\nJitter is often used in distributed systems to prevent synchronization spikes. In this deterministic kurs we omit jitter from challenge outputs fuer snapshot stability, but teams should understand where jitter fits in production.\n\nMetrics reducers provide feedback loop fuer tuning. If p95 improves but error count rises, policy may be too aggressive. If errors drop but latency explodes, policy may be too conservative. Deterministic histogram und quantile outputs make this tradeoff visible.\n\nA final best practice is policy versioning. When retry settings change, compare outputs fuer fixture scenarios before bereitstellung. This catches accidental behavior changes und enables confident rollbacks.\n\nOperational readiness also requires a habit of refreshing fixture sets as provider behavior evolves. Rate-limit patterns, slot lag profiles, und latency distributions change over time, und static fixtures can hide policy regressions. Reliability teams should schedule periodic fixture audits, compare score deltas across providers, und document threshold changes so retry und selection policies remain explainable und reproducible under current network conditions.\n\n\nThis material should be operationalized mit deterministic fixtures und explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, und severe stress. Fuer each scenario, compare policy outputs before und after changes, und require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned mit runtime behavior, und makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, und they keep fixture ownership explicit so updates remain intentional und auditable.\n\n## Checklist\n- Represent full schedule including initial attempt.\n- Validate retry configuration inputs strictly.\n- Bound delays mit max caps.\n- Estimate user-facing worst-case latency from schedule.\n- Review policy changes against deterministic fixtures.\n",
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
        "description": "Build deterministic policy engines fuer routing, retries, metrics reduction, und health report exports.",
        "lessons": {
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
            "content": "Build deterministic timeout und retry schedule outputs from policy input.",
            "duration": "40 min",
            "hints": [
              "Build a deterministic retry schedule including the first attempt.",
              "Cap delays at maxDelayMs."
            ]
          },
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
            "content": "Choose the best endpoint deterministically from health samples und endpoint metadata.",
            "duration": "40 min",
            "hints": [
              "Blend success rate, latency, 429 pressure, und slot lag into one score.",
              "Tie-break deterministically by endpoint ID."
            ]
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching und invalidation policy",
            "content": "Emit deterministic cache invalidation actions when konto updates und lag signals arrive.",
            "duration": "35 min",
            "hints": [
              "Invalidate konto-keyed cache entries deterministically.",
              "Use tighter TTL when node lag grows."
            ]
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer und histogram buckets",
            "content": "Reduce simulated RPC events into deterministic histogram und p50/p95 metrics.",
            "duration": "35 min",
            "hints": [
              "Reduce RPC telemetry into histogram buckets und quantiles.",
              "Keep bucket boundaries explicit fuer deterministic snapshots."
            ]
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
            "content": "Export deterministic JSON und markdown health report artifacts fuer multi-provider reliability review.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export both JSON und markdown.",
              "Ensure field order is stable in JSON output."
            ]
          }
        }
      }
    }
  },
  "rust-data-layout-borsh": {
    "title": "Rust Data Layout & Borsh Mastery",
    "description": "Rust-first Solana data layout engineering mit deterministic byte-level tooling und compatibility-safe schema practices.",
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
        "description": "Alignment behavior, Borsh encoding rules, und praktisch parsing safety fuer stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, und why Solana konten care",
            "content": "# Memory layout: alignment, padding, und why Solana konten care\n\nRust layout behavior is deterministic inside one compiled binary but can vary when assumptions are implicit. Fuer Solana konten, this matters because raw bytes are persisted on-chain und parsed by multiple clients across versions. If you design konto structures without explicit layout strategy, subtle padding und alignment changes can break compatibility or produce incorrect parsing in downstream tools.\n\nRust default layout optimizes fuer compiler freedom. Field order in memory fuer plain structs is not a stable ABI contract unless you opt into representations such as repr(C). In low-level konto work, repr(C) gives more predictable ordering und alignment behavior, but it does not remove all complexity. Padding still appears between fields when alignment requires it. Fuer example, a u8 followed by u64 introduces 7 bytes of padding before the u64 offset. If your parser ignores this, every field after that point is shifted und corrupted.\n\nOn Solana, konto rent is proportional to byte size, so padding is not only a correctness issue; it is a cost issue. Poor field ordering can inflate konto sizes across millions of konten. A common optimization is grouping larger aligned fields first, then smaller fields. But this must be balanced against readability und migration safety. If you reorder fields in a live protocol, old data may no longer parse under new assumptions. Migration tooling should be explicit und versioned.\n\nBorsh serialization avoids some ABI ambiguity by defining field order in schema rather than raw struct memory. However, zero-copy patterns und manual slicing still depend on precise offsets. Teams should understand both worlds: in-memory layout rules fuer zero-copy und schema-based encoding rules fuer Borsh.\n\nIn production engineering, layout decisions should be documented mit deterministic outputs: field offsets, per-field padding, struct alignment, und total size. These outputs can be compared in CI to catch accidental drift from refactors. The goal is not theoretical elegance; the goal is stable data contracts over time.\n\n## Operator mindset\n\nSchema bytes are production API surface. Treat offset changes, enum ordering, und parser semantics as compatibility events requiring explicit review.\n\nProduction teams should treat layout und serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, und require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, und parser error behavior fuer malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on konto size, rent budget, und compatibility. Deterministic helpers make this praktisch: you can produce a stable JSON report in CI und diff it like source code. In Solana und Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after bereitstellung.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough fuer incident response. Good error payloads include field name, offset, und failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important fuer indexers und analytics pipelines that need to decide whether to quarantine an event or retry mit a newer schema version. Teams that encode rich deterministic error reports reduce triage time und avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, und test every boundary condition before shipping.\n\nTeams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, und compatibility mit archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, und which fixtures are mandatory before release. This level of process may feel heavy fuer small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the praktisch mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, und difficult to misinterpret.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rdb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rdb-v2-l1-q1",
                    "prompt": "Why does a u8 before u64 often increase konto size?",
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
            "title": "Struct und enum layout pitfalls plus Borsh rules",
            "content": "# Struct und enum layout pitfalls plus Borsh rules\n\nBorsh is widely used because it gives deterministic serialization across languages, but teams still get tripped up by how enums, vectors, und strings map to bytes. Understanding these rules is essential fuer robust konto parsing und client interoperability.\n\nFuer structs, Borsh encodes fields in declaration order. There is no implicit alignment padding in the serialized stream. That is different from in-memory layout und one reason Borsh is popular fuer stable wire formats. Fuer enums, Borsh writes a one-byte variant index first, then the variant payload. Changing variant order in code changes the index mapping und is therefore a breaking format change. This is a common source of accidental incompatibility.\n\nVectors und strings are length-prefixed mit little-endian u32 before data bytes. If parsing code trusts the length blindly without bounds checks, malformed or truncated data can cause out-of-bounds reads or allocation abuse. Safe parsers validate available bytes before allocating or slicing.\n\nAnother pitfall is conflating pubkey strings mit pubkey bytes. Borsh encodes bytes, not base58 text. If a client serializes public keys as strings while another expects 32-byte arrays, decoding fails despite both sides using \"Borsh\" terminology. Teams should define schema types precisely.\n\nError design is part of serialization safety. Distinguish malformed length prefix, unknown enum variant, unsupported dynamic type, und primitive decode out-of-bounds. Structured errors let callers decide whether to retry, drop, or quarantine payloads.\n\nFinally, encoding und decoding tests should run symmetrically mit fixed fixtures. A deterministic fixture suite catches regressions early und gives confidence that Rust, TypeScript, und analytics parsers agree on the same bytes.\nProduction teams should treat layout und serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, und require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, und parser error behavior fuer malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on konto size, rent budget, und compatibility. Deterministic helpers make this praktisch: you can produce a stable JSON report in CI und diff it like source code. In Solana und Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after bereitstellung.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough fuer incident response. Good error payloads include field name, offset, und failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important fuer indexers und analytics pipelines that need to decide whether to quarantine an event or retry mit a newer schema version. Teams that encode rich deterministic error reports reduce triage time und avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, und test every boundary condition before shipping.\n\nTeams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, und compatibility mit archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, und which fixtures are mandatory before release. This level of process may feel heavy fuer small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the praktisch mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, und difficult to misinterpret.\n",
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
            "title": "Explorer: layout visualizer fuer field offsets",
            "content": "# Explorer: layout visualizer fuer field offsets\n\nA layout visualizer turns abstract alignment rules into concrete numbers engineers can review. Instead of debating whether a struct is \"probably fine,\" teams can inspect exact offsets, padding, und total size.\n\nThe visualizer workflow is straightforward: provide ordered fields und types, compute alignments, insert required padding, und emit final layout metadata. This output should be deterministic und serializable so CI can compare snapshots.\n\nWhen using this in Solana development, combine visualizer output mit konto rent planning und migration docs. If a proposed field addition increases total size, quantify the impact und decide whether to append, split konto state, or introduce versioned konten. Do not rely on intuition fuer byte-level decisions.\n\nVisualizers are also useful fuer onboarding. New contributors can quickly see why u8/u64 ordering changes offsets und why safe parsers need explicit bounds checks. This reduces recurring parsing bugs und review churn.\n\nA high-quality visualizer report includes field name, offset, size, alignment, padding-before, trailing padding, und struct alignment. Keep key ordering stable so report diffs remain readable.\n\nEngineers should pair visualizer output mit parse tests. If layout says a bool lives at offset 0 und u8 at offset 1, parser tests should assert exactly that. Deterministic systems connect design artifacts und runtime checks.\nProduction teams should treat layout und serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, und require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, und parser error behavior fuer malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on konto size, rent budget, und compatibility. Deterministic helpers make this praktisch: you can produce a stable JSON report in CI und diff it like source code. In Solana und Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after bereitstellung.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough fuer incident response. Good error payloads include field name, offset, und failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important fuer indexers und analytics pipelines that need to decide whether to quarantine an event or retry mit a newer schema version. Teams that encode rich deterministic error reports reduce triage time und avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, und test every boundary condition before shipping.\n\nTeams should also document explicit schema governance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, und compatibility mit archived reports. A healthy governance checklist asks who owns schema evolution, how compatibility windows are communicated, und which fixtures are mandatory before release. This level of process may feel heavy fuer small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the praktisch mechanism that keeps this governance lightweight enough to use: they are simple to diff, easy to discuss, und difficult to misinterpret.\n",
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
        "title": "Konto Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, und compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
            "content": "Compute deterministic field offsets, alignment padding, und total struct size.",
            "duration": "40 min",
            "hints": [
              "Use alignment-aware offsets und include padding fields in the result.",
              "Struct total size should be aligned to max field alignment."
            ]
          },
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
            "content": "Implement deterministic Borsh encode/decode mit structured error handling.",
            "duration": "40 min",
            "hints": [
              "Borsh strings are length-prefixed little-endian u32 + UTF-8 bytes.",
              "Keep encode/decode symmetric fuer deterministic tests."
            ]
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
            "content": "Model deterministic tradeoff scoring between zero-copy und Borsh approaches.",
            "duration": "35 min",
            "hints": [
              "Model tradeoffs deterministically: read speed vs schema flexibility.",
              "Recommendation should be pure function of inputs."
            ]
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
            "content": "Parse konto bytes mit deterministic bounds checks und structured errors.",
            "duration": "35 min",
            "hints": [
              "Validate byte length before field parsing.",
              "Return structured errors fuer invalid booleans und unsupported field types."
            ]
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
            "content": "Produce stable JSON und markdown layout artifacts fuer the final project.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export stable JSON + markdown.",
              "Avoid random IDs und timestamps in output."
            ]
          }
        }
      }
    }
  },
  "rust-errors-invariants": {
    "title": "Rust Error Design & Invariants",
    "description": "Build typed invariant guard libraries mit deterministic evidence artifacts, compatibility-safe error contracts, und audit-ready reporting.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "errors",
      "invariants",
      "reliability"
    ],
    "modules": {
      "rei-v2-foundations": {
        "title": "Rust Error und Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, und deterministic invariant design fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
            "content": "# Error taxonomy: recoverable vs fatal\n\nRust encourages explicit error modeling, but teams still produce weak error contracts when they rely on ad hoc strings or inconsistent wrappers. In Solana und Anchor-adjacent systems, this becomes painful quickly because on-chain failures, off-chain pipelines, und frontend UX all need coherent semantics.\n\nA praktisch taxonomy starts mit recoverable versus fatal classes. Recoverable errors represent expected contract violations: stale data, missing signer, value out of range, or transient dependency mismatch. Fatal errors represent corrupted assumptions: impossible state, incompatible schema version, or invariant breach that requires operator intervention.\n\nTyped enums are the center of this design. A code such as NEGATIVE_VALUE or MISSING_AUTHORITY is unambiguous und searchable. Attaching structured context fields gives downstream systems enough detail fuer logging und user-facing copy without string parsing.\n\nAvoid stringly error contracts where every caller invents custom messages. Those systems accumulate inconsistent wording und ambiguous categories. Instead, keep messages deterministic und derive user copy from code + context in one mapping layer.\n\nInvariants should be designed fuer testability. If an invariant cannot be expressed as a deterministic function over known inputs, it is hard to validate und easy to regress. Start mit small ensure helpers that return typed results, then compose them into higher-level guards.\n\nIn production, error taxonomies should be reviewed like API changes. Renaming codes or changing severity mapping can break alert rules und client handling. Version these changes und validate mit fixture suites.\n\n## Operator mindset\n\nInvariant errors are operational contracts. If code, severity, und context are not stable, monitoring und user recovery flows degrade even when logic is correct.\n\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, und explicit severity mapping so runtime incidents are diagnosable without guessing. Fuer invariants, each failed check should identify what contract was violated, where in the flow it happened, und whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent und alert tuning becomes fragile. A typed error library mit deterministic reports solves this by making failure semantics machine-readable und human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain mit injected timestamps und step IDs gives auditors und engineers a replayable explanation of what passed, what failed, und in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old und new evidence outputs und verify expected changes before bereitstellung. Over time, these deterministic artifacts become part of release discipline und reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries und confirm that alerts, dashboards, und user-facing copy still map correctly. If mappings drift, update guides und fallback behavior should ship together mit code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users und support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, und a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors und reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it mit quarterly reviews where engineers evaluate false-positive rates, update context fields, und verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, und communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                      "They remove need fuer logs",
                      "They reduce compile time"
                    ],
                    "answerIndex": 0,
                    "explanation": "Typed codes make handling und monitoring deterministic."
                  }
                ]
              }
            ]
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, und context",
            "content": "# Result<T, E> patterns, ? operator, und context\n\nResult-based control flow is one of Rust's strongest tools fuer building robust services und on-chain-adjacent clients. The key is not merely using Result, but designing error types und propagation boundaries that preserve enough context fuer debugging und UX decisions.\n\nThe ? operator keeps code concise, but it can hide context unless error conversion layers are explicit. Invariant-centric systems should wrap lower-level failures mit domain meaning before returning to upper layers. Fuer example, a parse failure in konto metadata should map to a deterministic invariant code und include the field path.\n\nContext should be structured rather than baked into message text. A map of key/value fields like {label, value, limit} is easier to aggregate und filter than sentence fragments. It also supports localization und role-specific message rendering.\n\nAnother pattern is separating validation from side effects. If ensure helpers only evaluate conditions und construct typed errors, they are deterministic und unit-testable. Side effects such as logging or telemetry emission can happen at call boundaries.\n\nWhen building libraries, avoid exposing too many internal codes. Public codes should represent stable contracts, while internal details can remain nested context. This helps keep compatibility manageable.\n\nTest strategy should include positive cases, negative cases, und report formatting checks. Deterministic report output is valuable fuer code review because changes are visible as stable diffs, not only behavioral assertions.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, und explicit severity mapping so runtime incidents are diagnosable without guessing. Fuer invariants, each failed check should identify what contract was violated, where in the flow it happened, und whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent und alert tuning becomes fragile. A typed error library mit deterministic reports solves this by making failure semantics machine-readable und human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain mit injected timestamps und step IDs gives auditors und engineers a replayable explanation of what passed, what failed, und in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old und new evidence outputs und verify expected changes before bereitstellung. Over time, these deterministic artifacts become part of release discipline und reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries und confirm that alerts, dashboards, und user-facing copy still map correctly. If mappings drift, update guides und fallback behavior should ship together mit code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users und support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, und a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors und reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it mit quarterly reviews where engineers evaluate false-positive rates, update context fields, und verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, und communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                    "note": "Typed und deterministic"
                  }
                ]
              }
            ]
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
            "content": "# Explorer: invariant decision tree\n\nAn invariant decision tree helps teams reason about guard ordering und failure priority. Not every invariant should be checked in arbitrary order. Early checks should prevent expensive work und produce the clearest failure semantics.\n\nA common flow: structural preconditions first, authority checks second, value bounds third, relational checks fourth. This ordering minimizes noisy failures und improves auditability. If authority is missing, there is little value in evaluating downstream value checks.\n\nDecision trees also help map errors to UX behavior. A recoverable user input violation may show inline correction hints, while a fatal integrity breach should hard-stop mit escalation messaging.\n\nIn deterministic systems, tree traversal should be explicit und testable. Given the same input, the same failing node should be reported every time. This allows stable evidence chains und reliable automation.\n\nExplorer tooling can visualize this by showing the path taken, checks skipped, und final outcome. Teams can then tune guard order intentionally und document rationale.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, und explicit severity mapping so runtime incidents are diagnosable without guessing. Fuer invariants, each failed check should identify what contract was violated, where in the flow it happened, und whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent und alert tuning becomes fragile. A typed error library mit deterministic reports solves this by making failure semantics machine-readable und human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain mit injected timestamps und step IDs gives auditors und engineers a replayable explanation of what passed, what failed, und in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old und new evidence outputs und verify expected changes before bereitstellung. Over time, these deterministic artifacts become part of release discipline und reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries und confirm that alerts, dashboards, und user-facing copy still map correctly. If mappings drift, update guides und fallback behavior should ship together mit code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users und support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, und a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors und reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it mit quarterly reviews where engineers evaluate false-positive rates, update context fields, und verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, und communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
        "description": "Implement guard helpers, evidence-chain generation, und stable audit reporting fuer reliability und incident response.",
        "lessons": {
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
            "content": "Implement typed invariant errors und deterministic ensure helpers.",
            "duration": "40 min",
            "hints": [
              "Return typed error payloads, not raw strings.",
              "Keep ensure() deterministic und side-effect free."
            ]
          },
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
            "content": "Build a deterministic evidence chain mit injected timestamps.",
            "duration": "40 min",
            "hints": [
              "Inject/mock timestamps fuer deterministic evidence chains.",
              "Step ordering must remain stable fuer snapshot tests."
            ]
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
            "content": "Run deterministic invariant case sets und return failed IDs.",
            "duration": "35 min",
            "hints": [
              "Property-ish deterministic tests can still run as fixed case sets.",
              "Return explicit failed IDs fuer debugability."
            ]
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
            "content": "Format a deterministic markdown evidence report.",
            "duration": "35 min",
            "hints": [
              "Markdown report should preserve stable step order und deterministic formatting.",
              "Include aggregate status und per-step evidence lines."
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
    "title": "Rust Leistung fuer On-chain Thinking",
    "description": "Simulate und optimize compute-cost behavior mit deterministic Rust-first tooling und budget-driven leistung governance.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "performance",
      "compute",
      "solana"
    ],
    "modules": {
      "rpot-v2-foundations": {
        "title": "Leistung Foundations",
        "description": "Rust leistung mentales modells, data-structure tradeoffs, und deterministic cost reasoning fuer reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Leistung mentales modell: allocations, clones, hashing",
            "content": "# Leistung mentales modell: allocations, clones, hashing\n\nRust leistung work in Solana ecosystems is mostly about data movement discipline. Teams often chase micro-optimizations while ignoring dominant costs such as repeated allocations, unnecessary cloning, und redundant hashing in loops.\n\nA useful mentales modell starts mit cost buckets. Allocation cost includes heap growth, allocator metadata, und cache disruption. Clone cost depends on object size und ownership patterns. Hash cost depends on bytes hashed und hash invocation frequency. Loop cost depends on iteration count und per-iteration work. Map lookup cost depends on data structure choice und access pattern.\n\nThe point of this model is not exact runtime cycles. The point is relative pressure. If one path performs ten allocations und another performs one allocation, the former should trigger scrutiny even before microbenchmarking.\n\nOn-chain thinking reinforces this: compute budgets are finite, und predictable resource usage matters. Even off-chain indexers und simulators benefit from the same discipline because latency tails und CPU burn impact reliability.\n\nDeterministic models are ideal fuer CI. Given identical operation counts, output should be identical. Reviewers can reason about deltas directly und reject regressions early.\n\n## Operator mindset\n\nLeistung guidance should be versioned und budgeted. Without explicit budgets und stable cost categories, optimization work drifts toward anecdote instead of measurable outcomes.\n\nLeistung engineering fuer on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines und CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline fuer regression detection. The model does not replace real profiling; it complements it by making early design tradeoffs explicit und reviewable.\n\nWhen you model costs, keep weights documented und intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient und track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports mit before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers und client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined mit suggestion outputs und checkpoint reports, these models become praktisch guardrails fuer engineering quality.\n\nMature teams combine these deterministic models mit periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients und rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation und keeps recommendations aligned mit actual system behavior. The key is to treat model updates as versioned changes mit explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why leistung guidance changed und how improvements were verified.\n\nTeams should also define leistung budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete und avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets und require explicit waivers when thresholds are exceeded. Keep waiver text deterministic und tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable leistung culture where improvements are intentional, measurable, und easy to audit.\n",
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
                      "They remove need fuer tests"
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
            "content": "# Data structures: Vec, HashMap, BTreeMap tradeoffs\n\nData structure choice is one of the highest leverage leistung decisions in Rust systems. Vec offers compact contiguous storage und predictable iteration speed. HashMap offers average-case fast lookup but can have higher allocation und hashing overhead. BTreeMap provides ordered keys und stable traversal costs mit different memory locality characteristics.\n\nIn on-chain-adjacent simulations und indexers, workloads vary. If you mostly append und iterate, Vec plus binary search or index maps can outperform heavier maps. If random key lookup dominates, HashMap may win despite hash overhead. If deterministic ordering is required fuer report output or canonical snapshots, BTreeMap can simplify stable behavior.\n\nThe wrong pattern is premature abstraction that hides access patterns. Engineers should instrument operation counts und use cost models to evaluate actual use cases. Deterministic benchmark fixtures make this reproducible.\n\nAnother praktisch tradeoff is allocation strategy. Reusing buffers und reserving capacity can reduce churn substantially. This is often more impactful than iterator-vs-loop debates.\n\nKeep design reviews concrete: expected reads, writes, key cardinality, ordering requirements, und mutation frequency. Then choose structures intentionally und document rationale.\nLeistung engineering fuer on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines und CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline fuer regression detection. The model does not replace real profiling; it complements it by making early design tradeoffs explicit und reviewable.\n\nWhen you model costs, keep weights documented und intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient und track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports mit before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers und client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined mit suggestion outputs und checkpoint reports, these models become praktisch guardrails fuer engineering quality.\n\nMature teams combine these deterministic models mit periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients und rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation und keeps recommendations aligned mit actual system behavior. The key is to treat model updates as versioned changes mit explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why leistung guidance changed und how improvements were verified.\n\nTeams should also define leistung budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete und avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets und require explicit waivers when thresholds are exceeded. Keep waiver text deterministic und tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable leistung culture where improvements are intentional, measurable, und easy to audit.\n",
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
                    "note": "Good fuer sequential work"
                  },
                  {
                    "cmd": "HashMap lookups",
                    "output": "fast random access, hash overhead",
                    "note": "Good fuer key-based fetch"
                  }
                ]
              }
            ]
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
            "content": "# Explorer: cost model sandbox\n\nA cost sandbox lets teams test optimization hypotheses without waiting fuer full benchmark infrastructure. Provide operation counts, compute weighted costs, und inspect which buckets dominate total pressure.\n\nThe sandbox should separate baseline und optimized inputs so diffs are explicit. If a change claims fewer allocations but increases map lookups sharply, the model should show the net effect. This prevents one-dimensional optimization that regresses other paths.\n\nSuggestion generation should be threshold-based und deterministic. Fuer example, if allocation cost exceeds a threshold, recommend pre-allocation und buffer reuse. If serialization cost dominates, recommend batching or avoiding repeated decode/encode loops.\n\nStable report outputs are critical fuer engineering workflows. JSON payloads feed CI checks, markdown summaries support code review und team communication. Keep key ordering stable so string equality tests remain meaningful.\n\nSandboxes are not production profilers, but they are excellent decision support tools when kept deterministic und aligned mit known workload patterns.\nLeistung engineering fuer on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines und CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline fuer regression detection. The model does not replace real profiling; it complements it by making early design tradeoffs explicit und reviewable.\n\nWhen you model costs, keep weights documented und intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient und track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports mit before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers und client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined mit suggestion outputs und checkpoint reports, these models become praktisch guardrails fuer engineering quality.\n\nMature teams combine these deterministic models mit periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients und rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation und keeps recommendations aligned mit actual system behavior. The key is to treat model updates as versioned changes mit explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why leistung guidance changed und how improvements were verified.\n\nTeams should also define leistung budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete und avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets und require explicit waivers when thresholds are exceeded. Keep waiver text deterministic und tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable leistung culture where improvements are intentional, measurable, und easy to audit.\n",
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
        "description": "Build deterministic profilers, recommendation engines, und report outputs aligned to explicit leistung budgets.",
        "lessons": {
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
            "content": "Estimate deterministic operation costs from fixed weighting rules.",
            "duration": "40 min",
            "hints": [
              "Use deterministic arithmetic weights fuer each operation category.",
              "Return component breakdown plus total fuer easier optimization diffs."
            ]
          },
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
            "content": "Apply deterministic before/after metric reductions und diff outputs.",
            "duration": "40 min",
            "hints": [
              "Treat optimization as deterministic metric diffs, not runtime benchmarking.",
              "Clamp reduced metrics at zero."
            ]
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
            "content": "Compute deterministic serialization overhead und byte savings.",
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
            "content": "Export deterministic JSON und markdown profiler reports.",
            "duration": "45 min",
            "hints": [
              "Checkpoint must include stable JSON und markdown outputs.",
              "Use deterministic percentage rounding."
            ]
          }
        }
      }
    }
  },
  "rust-async-indexer-pipeline": {
    "title": "Concurrency & Async fuer Indexers (Rust)",
    "description": "Rust-first async pipeline engineering mit bounded concurrency, replay-safe reducers, und deterministic operational reporting.",
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
        "description": "Async/concurrency fundamentals, backpressure behavior, und deterministic execution modeling fuer indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
            "content": "# Async fundamentals: futures, tasks, channels\n\nRust async systems are built on explicit scheduling rather than implicit thread-per-task models. Futures represent pending work, executors poll futures, und channels coordinate data flow. Fuer indexers, this architecture supports high throughput but requires careful control of concurrency und backpressure.\n\nA common failure mode is unbounded task spawning. It may look fine in local tests, then collapse in production under burst traffic due to memory pressure und queue growth. Defensive design uses bounded concurrency mit explicit task budgets.\n\nChannels are powerful but can hide overload when used without capacity limits. Bounded channels make pressure visible: producers block or shed work when consumers lag. In deterministic simulations, this behavior can be modeled by explicit queues und tick-based progression.\n\nThe key mindset is reproducibility. If pipeline behavior cannot be replayed deterministically, debugging und regression tests become guesswork. Simulated executors solve this by removing wall-clock dependence.\n\n## Operator mindset\n\nAsync pipelines are reliability systems, not just throughput systems. Concurrency limits, retry behavior, und reducer determinism must stay auditable under stress.\n\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers und threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler mit deterministic tick advancement provides a clean environment fuer validating bounded concurrency, retry sequencing, und backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, und completion order is reproducible.\n\nBackpressure design should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably und metrics should expose this. Deterministic tests can assert queue length, total ticks, und completion order fuer stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency und stable reducers. Duplicate deliveries should collapse by key, und snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy und incident triage slows down. Stable JSON und markdown reports prevent that by keeping artifacts comparable between runs und between code versions.\n\nOperational teams should maintain scenario catalogs fuer burst traffic, retry storms, und partial-stage failures. Each scenario should specify expected queue depth, retry schedule, und final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios und lerne system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters fuer accepted work, deferred work, retries, und dropped events. Without these counters, backpressure incidents become anecdotal und tuning decisions become reactive. Mit deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI mit mocked scheduler runs, und regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, und explicit failure budgets. Fuer educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks fuer each failure mode und link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, und communication templates fuer fast coordination.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "raip-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "raip-v2-l1-q1",
                    "prompt": "Why prefer bounded concurrency fuer indexer tasks?",
                    "options": [
                      "It prevents runaway memory und queue growth",
                      "It guarantees zero failures",
                      "It eliminates retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "Bounded concurrency keeps load behavior controlled und observable."
                  }
                ]
              }
            ]
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits und backpressure",
            "content": "# Concurrency limits und backpressure\n\nBackpressure is not optional in high-volume pipelines. Without it, producer speed can overwhelm reducers, retries, or storage sinks. A resilient design sets explicit concurrency caps und queue semantics that are easy to reason about.\n\nSemaphore-style limits are a common pattern: only N tasks can run at once. Additional tasks wait in queue. Deterministic simulation can model this mit a running list und remaining tick counters.\n\nRetry behavior interacts mit backpressure. If retries ignore queue pressure, they amplify congestion. Deterministic retry schedules should be bounded und inspectable.\n\nDesign reviews should ask: what is max concurrent work, what is queue policy, what happens on overload, und how is fairness maintained. Stable run reports provide concrete answers.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers und threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler mit deterministic tick advancement provides a clean environment fuer validating bounded concurrency, retry sequencing, und backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, und completion order is reproducible.\n\nBackpressure design should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably und metrics should expose this. Deterministic tests can assert queue length, total ticks, und completion order fuer stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency und stable reducers. Duplicate deliveries should collapse by key, und snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy und incident triage slows down. Stable JSON und markdown reports prevent that by keeping artifacts comparable between runs und between code versions.\n\nOperational teams should maintain scenario catalogs fuer burst traffic, retry storms, und partial-stage failures. Each scenario should specify expected queue depth, retry schedule, und final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios und lerne system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters fuer accepted work, deferred work, retries, und dropped events. Without these counters, backpressure incidents become anecdotal und tuning decisions become reactive. Mit deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI mit mocked scheduler runs, und regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, und explicit failure budgets. Fuer educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks fuer each failure mode und link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, und communication templates fuer fast coordination.\n",
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
                    "note": "bounded und predictable"
                  }
                ]
              }
            ]
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph und concurrency",
            "content": "# Explorer: pipeline graph und concurrency\n\nPipeline graphs help teams communicate stage boundaries, concurrency budgets, und retry behaviors. A graph that shows ingest, dedupe, retry, und snapshot stages mit explicit capacities is far more actionable than prose descriptions.\n\nIn deterministic simulation, each stage can be represented as queue + worker budget. Events progress in ticks, und transitions are logged in timeline snapshots. This makes race conditions und starvation visible.\n\nA good explorer shows total ticks, completion order, und per-tick running/completed sets. These artifacts become checkpoints fuer regression tests.\n\nPair graph exploration mit idempotency key tests. Duplicate events should not mutate state repeatedly. Stable reducers und sorted outputs make this easy to verify.\n\nThe final objective is operational confidence: when congestion or reorg scenarios occur, teams can replay deterministic fixtures und compare expected versus actual behavior quickly.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers und threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler mit deterministic tick advancement provides a clean environment fuer validating bounded concurrency, retry sequencing, und backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, und completion order is reproducible.\n\nBackpressure design should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably und metrics should expose this. Deterministic tests can assert queue length, total ticks, und completion order fuer stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency und stable reducers. Duplicate deliveries should collapse by key, und snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy und incident triage slows down. Stable JSON und markdown reports prevent that by keeping artifacts comparable between runs und between code versions.\n\nOperational teams should maintain scenario catalogs fuer burst traffic, retry storms, und partial-stage failures. Each scenario should specify expected queue depth, retry schedule, und final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios und lerne system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters fuer accepted work, deferred work, retries, und dropped events. Without these counters, backpressure incidents become anecdotal und tuning decisions become reactive. Mit deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI mit mocked scheduler runs, und regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, und explicit failure budgets. Fuer educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks fuer each failure mode und link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, und communication templates fuer fast coordination.\n",
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
                      "label": "Run mit retries",
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
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, und report exports fuer reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
            "content": "Simulate bounded-concurrency execution mit deterministic task ordering.",
            "duration": "40 min",
            "hints": [
              "Model bounded concurrency mit a deterministic queue und tick loop.",
              "No real timers; simulate progression by decrementing remaining ticks."
            ]
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
            "content": "Generate deterministic retry delay schedules fuer linear und exponential policies.",
            "duration": "40 min",
            "hints": [
              "Retry schedule should be deterministic und bounded.",
              "Support linear und exponential backoff modes."
            ]
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
            "content": "Deduplicate replay events by deterministic idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Use idempotency keys to collapse duplicate replay events.",
              "Return stable sorted keys fuer deterministic snapshots."
            ]
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
            "content": "Build deterministic snapshot state from simulated event streams.",
            "duration": "35 min",
            "hints": [
              "Reducer should be deterministic und idempotent-friendly.",
              "Sort output keys fuer stable report generation."
            ]
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
            "content": "Export deterministic run report artifacts fuer the async pipeline simulation.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should mirror deterministic pipeline run artifacts.",
              "Include both machine und human-readable export fields."
            ]
          }
        }
      }
    }
  },
  "rust-proc-macros-codegen-safety": {
    "title": "Procedural Macros & Codegen fuer Safety",
    "description": "Rust macro/codegen safety taught through deterministic parser und check-generation tooling mit audit-friendly outputs.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "macros",
      "codegen",
      "safety"
    ],
    "modules": {
      "rpmcs-v2-foundations": {
        "title": "Macro und Codegen Foundations",
        "description": "Macro mentales modells, constraint DSL design, und safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro mentales modell: declarative vs procedural",
            "content": "# Macro mentales modell: declarative vs procedural\n\nRust macros come in two broad forms: declarative macros fuer pattern-based expansion und procedural macros fuer syntax-aware transformation. Anchor relies heavily on macro-driven ergonomics to generate konto validation und anweisung plumbing.\n\nFuer safety engineering, the value is consistency. Instead of hand-writing signer und owner checks in every handler, macro-style codegen can enforce these rules from concise attributes. This reduces copy-paste drift und makes review focus on policy intent.\n\nIn this kurs, we simulate proc-macro behavior mit deterministic TypeScript parser/generator helpers. The goal is conceptual transfer: attribute input -> AST -> generated checks -> runtime evaluation report.\n\nA macro mentales modell helps avoid two mistakes: trusting generated behavior blindly und over-generalizing DSL syntax. Good macro design keeps syntax explicit, expansion predictable, und errors readable.\n\nTreat generated checks as code artifacts, not opaque internals. Store them in tests, compare them in diffs, und validate behavior on controlled fixtures.\n\n## Operator mindset\n\nCodegen safety depends on reviewable output. If generated checks are not deterministic und diff-friendly, teams lose trust und incidents take longer to diagnose.\n\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor und Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate und catch classes of validation bugs early. Fuer teaching in a browser environment, a deterministic parser und generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes und debugging becomes harder. Stable generated strings, golden file tests, und deterministic run reports solve this. Teams can diff generated code as plain text und confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL design. Attribute syntax should be strict enough to reject ambiguous input und explicit enough to encode signer, owner, relation, und mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind und target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules und keep migration guides fuer older attribute forms. Unversioned grammar drift can silently break generated checks und create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired mit golden output snapshots und runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, und testable, which is exactly the behavior needed fuer safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, und runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined und avoids turning safety tooling into a maintenance burden. Teams can further strengthen this mit compatibility suites that replay historical DSL inputs against new parsers und compare outputs byte-fuer-byte. When differences appear, release notes should explain why behavior changed und how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent und lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, und runtime validation signoff in every checklist.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpmcs-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpmcs-v2-l1-q1",
                    "prompt": "Why is generated code review important fuer safety?",
                    "options": [
                      "It verifies expansion matches policy intent",
                      "It increases compile speed",
                      "It removes need fuer tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Generated checks must remain inspectable und auditable."
                  }
                ]
              }
            ]
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
            "content": "# Safety through codegen: constraint checks\n\nConstraint codegen converts compact declarations into explicit runtime guards. Typical constraints include signer presence, konto ownership, has-one relations, und mutability requirements.\n\nA strong codegen pipeline validates input syntax strictly, produces deterministic output ordering, und emits meaningful errors fuer unsupported forms. Weak codegen pipelines accept ambiguous syntax und produce inconsistent expansion, which undermines trust.\n\nOwnership checks are high-value constraints because konto substitution bugs are common in Solana systems. Generated owner guards reduce omission risk. Signer checks ensure privileged paths are gated by explicit authority.\n\nHas-one relation checks encode structural links between konten und authorities. Generated relation checks reduce manual mistakes und keep behavior aligned across handlers.\n\nFinally, tests generated output via golden strings catches accidental expansion drift. This is especially useful during parser refactors.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor und Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate und catch classes of validation bugs early. Fuer teaching in a browser environment, a deterministic parser und generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes und debugging becomes harder. Stable generated strings, golden file tests, und deterministic run reports solve this. Teams can diff generated code as plain text und confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL design. Attribute syntax should be strict enough to reject ambiguous input und explicit enough to encode signer, owner, relation, und mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind und target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules und keep migration guides fuer older attribute forms. Unversioned grammar drift can silently break generated checks und create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired mit golden output snapshots und runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, und testable, which is exactly the behavior needed fuer safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, und runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined und avoids turning safety tooling into a maintenance burden. Teams can further strengthen this mit compatibility suites that replay historical DSL inputs against new parsers und compare outputs byte-fuer-byte. When differences appear, release notes should explain why behavior changed und how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent und lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, und runtime validation signoff in every checklist.\n",
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
            "content": "# Explorer: constraint builder to generated checks\n\nA constraint builder explorer helps engineers see how DSL choices affect generated code und runtime safety outcomes. Input one attribute line, observe parsed AST, generated pseudo-code, und pass/fail execution against sample inputs.\n\nThis tight loop is useful fuer both education und production review. Teams can prototype new constraint forms, verify deterministic output, und add golden tests before adoption.\n\nThe explorer should surface parse failures clearly. If syntax is invalid, report line und expected format. If constraint kind is unsupported, fail mit deterministic error text.\n\nGenerated checks should preserve input order unless policy requires canonical sorting. Either way, behavior must be deterministic und documented.\n\nRuntime evaluation output should include failure list mit kind, target, und reason. This allows developers to fix configuration quickly und keeps safety reporting actionable.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor und Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate und catch classes of validation bugs early. Fuer teaching in a browser environment, a deterministic parser und generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes und debugging becomes harder. Stable generated strings, golden file tests, und deterministic run reports solve this. Teams can diff generated code as plain text und confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL design. Attribute syntax should be strict enough to reject ambiguous input und explicit enough to encode signer, owner, relation, und mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind und target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules und keep migration guides fuer older attribute forms. Unversioned grammar drift can silently break generated checks und create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired mit golden output snapshots und runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, und testable, which is exactly the behavior needed fuer safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, und runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined und avoids turning safety tooling into a maintenance burden. Teams can further strengthen this mit compatibility suites that replay historical DSL inputs against new parsers und compare outputs byte-fuer-byte. When differences appear, release notes should explain why behavior changed und how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent und lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, und runtime validation signoff in every checklist.\n",
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
        "title": "Konto Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, und publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
            "content": "Parse mini-DSL constraints into deterministic AST nodes.",
            "duration": "40 min",
            "hints": [
              "Parse mini DSL lines into typed AST nodes.",
              "Support signer, mut, owner, und has_one forms."
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
              "Evaluate generated constraints against sample konto state.",
              "Return deterministic failure reasons."
            ]
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
            "content": "Export deterministic markdown safety report from generated checks.",
            "duration": "45 min",
            "hints": [
              "Render a deterministic markdown report from generated check results.",
              "Include status und explicit failure details."
            ]
          }
        }
      }
    }
  },
  "anchor-upgrades-migrations": {
    "title": "Anchor Upgrades & Konto Migrations",
    "description": "Design production-safe Anchor release workflows mit deterministic migration planning, upgrade gates, rollback playbooks, und readiness evidence.",
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
        "description": "Authority lifecycle, konto versioning strategy, und deterministic upgrade risk modeling fuer Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
            "content": "# Upgrade authority lifecycle in Anchor programs\n\nAnchor makes anweisung development easier, but upgrade safety still depends on disciplined control of program authority. In production Solana systems, most upgrade incidents are not caused by syntax bugs. They come from process mistakes: wrong key management, unclear release ownership, und missing checks between build artifacts und deployed programdata. This lektion teaches a praktisch lifecycle model that maps directly to how Anchor programs are deployed und governed.\n\nStart mit a strict authority model. Define who can sign upgrades und under which conditions. A single hot wallet is not acceptable fuer mature systems. Typical setups use a multisig or governance path to approve artifacts, then a controlled signer to perform bereitstellung. The important point is determinism: the same release decision should produce the same auditable evidence each time. That includes artifact hash, release tag, authority signers, und rollback policy. If your team cannot reconstruct those facts after a deploy, your process is too weak.\n\nNext, treat build reproducibility as a first-class requirement. You should compare the expected binary hash against programdata hash before und after bereitstellung in your pipeline simulation. Even when this kurs stays deterministic und does not hit RPC, the policy should model hash matching as a gate. If the hash mismatch flag is true, the release is blocked. This simple rule prevents one of the most expensive failure classes: thinking you shipped one artifact while another artifact is actually live.\n\nAuthority transition rules matter too. Some protocols intentionally revoke upgrade authority after a stabilization window. Others keep authority but require governance timelocks und emergency pause conditions. Neither is universally correct. The key is consistency mit explicit trigger conditions. If you revoke authority too early, you lose the ability to patch critical bugs. If you never constrain authority, users cannot trust immutability promises. Anchor does not solve this governance tradeoff fuer you; it only provides the program framework.\n\nRelease communication is part of sicherheit. Users und integrators need predictable language about what changed und whether state migration is required. Fuer example, if you add new konto fields but keep backward decoding compatibility, your report should say migration is optional fuer old konten und mandatory fuer new writes after a certain slot range. If compatibility breaks, the report must include exact batch strategy und downtime expectations. Ambiguous language creates support load und increases operational risk.\n\nFinally, design your release pipeline fuer deterministic dry runs. Simulate migration steps, validation checks, und report generation locally. The goal is to eliminate unforced errors before any transaktion is signed. A deterministic runbook is not bureaucracy; it is what keeps urgent releases calm und reviewable.\n\n## Operator mindset\n\nAnchor upgrades are operations work mit cryptographic consequences. Authority controls, migration sequencing, und rollback criteria should be treated as release contracts, not informal habits.\n\n\nThis lektion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures fuer each upgrade class: schema-only changes, anweisung behavior changes, und authority changes. Fuer every class, capture expected artifacts und compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, und what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document mit explicit slot windows, RPC provider failover plan, und support messaging templates. If a release is paused, the plan should already define whether to retry mit the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown und stable JSON, teams avoid panic changes during incidents und can audit exactly what happened after the fact. The same approach improves onboarding: new engineers lerne from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define clear authority ownership und approval flow.\n- Require artifact hash match before rollout.\n- Document authority transition und rollback policy.\n- Publish migration impact in deterministic report fields.\n- Block releases when dry-run evidence is missing.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "aum-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "aum-v2-l1-q1",
                    "prompt": "What is the most defensible release gate before bereitstellung?",
                    "options": [
                      "Compare approved build hash to expected programdata hash policy input",
                      "Ship quickly und validate hash later",
                      "Rely on signer memory without written report"
                    ],
                    "answerIndex": 0,
                    "explanation": "Hash matching is a deterministic control that prevents artifact drift during bereitstellung."
                  },
                  {
                    "id": "aum-v2-l1-q2",
                    "prompt": "Why is release communication part of upgrade safety?",
                    "options": [
                      "Integrators need exact migration impact und timing to avoid operational errors",
                      "Because Anchor automatically writes support tickets",
                      "Because all upgrades are backward compatible"
                    ],
                    "answerIndex": 0,
                    "explanation": "Unclear upgrade messaging causes integration mistakes und user-facing incidents."
                  }
                ]
              }
            ]
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Konto versioning und migration strategy",
            "content": "# Konto versioning und migration strategy\n\nSolana konten are long-lived state containers, so program upgrades must respect historical data. In Anchor, adding or changing konto fields can be safe, risky, or catastrophic depending on how version markers, discriminators, und decode logic are handled. This lektion focuses on migration planning that is deterministic, testable, und production-oriented.\n\nThe first rule is explicit version markers. Do not infer schema version from konto size alone because reallocations und optional fields can make that ambiguous. Include a version field und define what each version guarantees. Your migration planner can then segment konto ranges by version und apply deterministic transforms. Without explicit markers, teams often guess state shape und ship brittle one-off scripts.\n\nSecond, separate compatibility mode from migration mode. Compatibility mode means new code can read old und new versions while writes may still target old shape fuer a transition period. Migration mode means writes are frozen or routed through upgrade-safe paths while konto batches are rewritten. Both modes are valid, but mixing them without clear boundaries creates partial state und broken assumptions.\n\nBatching is a praktisch necessity. Large protocols cannot migrate every konto in one transaktion or one slot. Your plan should define batch size, ordering, und integrity checks. Fuer example, process konto indexes in deterministic ascending order und verify expected post-migration invariants after each batch. If a batch fails, rerun exactly that batch mit idempotent logic. Deterministic batch identifiers make this auditable und easier to recover.\n\nPlan fuer dry-run und rollback before execution. A migration plan should include prepare, migrate, verify, und finalize steps mit explicit criteria. Prepare can freeze new writes und snapshot baseline metrics. Verify can compare counts by version und check critical invariants. Finalize can re-enable writes und publish a signed report. Rollback should be defined as a separate branch, not improvised during incident pressure.\n\nAnchor adds value here through typed konto contexts und constraints, but migrations still require careful data engineering. Fuer every changed konto type, maintain deterministic test fixtures: old bytes, expected new bytes, und expected structured decode output. This catches layout regressions early und builds confidence when migrating real state.\n\nTreat migration metrics as product metrics too. Users care about downtime, failed actions, und consistency across clients. If migration affects read paths, expose status in UX so users understand what is happening. Reliable migrations are as much about communication und orchestration as they are about code.\n\n\nThis lektion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures fuer each upgrade class: schema-only changes, anweisung behavior changes, und authority changes. Fuer every class, capture expected artifacts und compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, und what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document mit explicit slot windows, RPC provider failover plan, und support messaging templates. If a release is paused, the plan should already define whether to retry mit the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown und stable JSON, teams avoid panic changes during incidents und can audit exactly what happened after the fact. The same approach improves onboarding: new engineers lerne from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use explicit version markers in konto data.\n- Define compatibility und migration modes separately.\n- Migrate in deterministic batches mit idempotent retries.\n- Keep dry-run fixtures fuer byte-level und structured outputs.\n- Publish migration status und completion evidence.\n",
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
                    "note": "Freeze writes before touching konto schema."
                  },
                  {
                    "cmd": "migrate --batch=3 --range=2000-2999 --target=v3",
                    "output": "status=ok migrated=1000 failed=0",
                    "note": "Batch IDs are deterministic und replayable."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
            "content": "# Explorer: upgrade risk matrix\n\nA useful upgrade explorer should show cause-und-effect between release inputs und safety outcomes. If a flag changes, engineers should immediately see how severity und readiness changes. This lektion teaches how to build und read a deterministic risk matrix fuer Anchor upgrades.\n\nThe matrix starts mit five high-signal inputs: upgrade authority present, program hash match, IDL breaking changes count, migration backfill completion, und dry-run pass status. These cover governance, artifact integrity, compatibility risk, data readiness, und execution readiness. They are not exhaustive, but they are enough to prevent most avoidable mistakes.\n\nEach matrix row represents a release candidate state. Fuer every row, compute issue codes und severity levels in stable order. Stable ordering is not cosmetic; it allows exact output comparisons in CI und easy diff review in pull requests. If issue ordering changes between commits without policy changes, you know something in implementation drifted.\n\nSeverity calibration should be conservative. Missing upgrade authority, hash mismatch, und failed dry run are high severity because they directly block safe rollout. Incomplete backfill und IDL breaking changes are usually medium severity: sometimes resolvable mit migration notes und staged release windows, but still risky if ignored.\n\nThe explorer should also teach false confidence patterns. Fuer example, a release mit zero IDL changes can still be unsafe if program hash does not match approved artifact. Conversely, a release mit breaking changes can still be safe if migration plan is complete, compatibility notes are clear, und rollout is staged mit monitoring. Risk is contextual; deterministic policy helps avoid emotional decisions.\n\nFrom a workflow perspective, the matrix output should feed both engineering und support. Engineering uses JSON fuer machine checks und gating. Support uses markdown summary to communicate whether release is ready, delayed, or blocked und why. If these outputs disagree, your generation path is wrong. Use one canonical payload und derive both formats.\n\nFinally, integrate the explorer into code review. Require reviewers to reference matrix output fuer each release PR. This keeps decisions anchored in explicit evidence rather than implicit trust in bereitstellung scripts.\n\n\nThis lektion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures fuer each upgrade class: schema-only changes, anweisung behavior changes, und authority changes. Fuer every class, capture expected artifacts und compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, und what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document mit explicit slot windows, RPC provider failover plan, und support messaging templates. If a release is paused, the plan should already define whether to retry mit the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown und stable JSON, teams avoid panic changes during incidents und can audit exactly what happened after the fact. The same approach improves onboarding: new engineers lerne from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use a canonical risk payload mit stable ordering.\n- Mark authority/hash/dry-run failures as blocking.\n- Keep JSON und markdown generated from one source.\n- Validate matrix behavior mit deterministic fixtures.\n- Treat explorer output as part of PR review evidence.\n",
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
            "content": "Implement deterministic migration planning output: fromVersion, toVersion, totalBatches, und requiresMigration.",
            "duration": "40 min",
            "hints": [
              "Use Math.ceil(accountCount / batchSize) fuer deterministic batch count.",
              "requiresMigration should be true only when toVersion > fromVersion.",
              "Return only stable scalar fields fuer exact JSON comparisons."
            ]
          }
        }
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, und deterministic readiness artifacts fuer controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
            "content": "Implement deterministic blocking issue checks fuer authority, artifact hash, und dry-run status.",
            "duration": "40 min",
            "hints": [
              "Treat missing authority, hash mismatch, und failed dry run as blocking issues.",
              "Return issueCount plus ordered issue code array.",
              "Keep order stable to make report diffs deterministic."
            ]
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy und incident playbooks",
            "content": "# Rollback strategy und incident playbooks\n\nEven strong upgrade plans can encounter surprises: incompatible downstream clients, unexpected konto edge cases, or release pipeline mistakes. Teams that recover quickly are the ones that predefine rollback und incident playbooks before any bereitstellung begins. This lektion covers pragmatic rollback design fuer Anchor-based systems.\n\nRollback starts mit explicit trigger conditions. Do not wait fuer subjective debate during an incident. Define measurable triggers such as failure rate thresholds, migration error counts, or critical invariant violations. Once trigger conditions are met, the system should move into a known response mode: pause writes, stop new migration batches, und publish incident status.\n\nA common mistake is assuming rollback always means restoring old binary immediately. Sometimes that is correct; other times it can worsen state divergence if partial migrations already wrote new version markers. Your playbook should classify failure phase: pre-migration, mid-migration, or post-finalization. Each phase has different safest actions. Mid-migration incidents often require completing compensating transforms before binary rollback.\n\nAnchor konto constraints help protect invariant boundaries, but they do not orchestrate recovery sequencing. You still need deterministic tooling fuer affected konto identification, reprocessing queues, und reconciliation summaries. Keep these tools pure und replayable where possible. If logic cannot be replayed, incident analysis becomes guesswork.\n\nCommunication is part of rollback. Engineering, support, und partner teams should consume the same deterministic report fields: release tag, rollback trigger, impacted batch ranges, current mitigation status, und next checkpoint time. Avoid free-form updates that diverge across channels.\n\nPost-incident learning must be concrete. Fuer each incident, add one or more deterministic fixtures reproducing the decision path that failed. Update policy functions und confirm that the new fixtures prevent recurrence. This is how reliability improves release after release.\n\nFinally, distinguish between emergency stop controls und full rollback procedures. Emergency stop is fuer immediate blast radius reduction. Full rollback or forward-fix decisions can come after state assessment. Blending these concepts causes rushed mistakes.\n\n\nThis lektion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures fuer each upgrade class: schema-only changes, anweisung behavior changes, und authority changes. Fuer every class, capture expected artifacts und compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, und what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document mit explicit slot windows, RPC provider failover plan, und support messaging templates. If a release is paused, the plan should already define whether to retry mit the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown und stable JSON, teams avoid panic changes during incidents und can audit exactly what happened after the fact. The same approach improves onboarding: new engineers lerne from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define measurable rollback triggers in advance.\n- Classify incident phase before selecting response path.\n- Keep recovery tooling replayable und deterministic.\n- Share one canonical incident report format.\n- Add regression fixtures after every rollback event.\n",
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
                      "Enter defined response mode: pause risky actions und publish status",
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
                    "explanation": "Incident fixtures turn lektionen into enforceable regression tests."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
            "content": "Generate deterministic markdown from releaseTag, totalBatches, und issueCount.",
            "duration": "35 min",
            "hints": [
              "Keep line ordering und punctuation stable.",
              "Use bullet list fields fuer releaseTag, totalBatches, und issueCount.",
              "Return plain markdown string without trailing spaces."
            ]
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
            "content": "Produce the final deterministic checkpoint artifact mit release tag, readiness flag, und migration batch count.",
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
    "title": "Reliability Engineering fuer Solana",
    "description": "Production-focused reliability engineering fuer Solana systems: fault tolerance, retries, deadlines, circuit breakers, und graceful degradation mit measurable operational outcomes.",
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
        "description": "Implement fault-tolerance building blocks mit clear failure classification, retry boundaries, und deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
            "content": "Fault tolerance in Solana systems is not just about catching errors. It is about deciding which failures are safe to retry, which should fail fast, und how to preserve user trust while doing both.\n\nA praktisch reliability model starts mit failure classes:\n1) transient failures (timeouts, temporary RPC unavailability),\n2) persistent external failures (rate limits, prolonged endpoint degradation),\n3) deterministic business failures (invalid input, invariant violations).\n\nTransient failures may justify bounded retries mit backoff. Deterministic business failures should not be retried because retries only add latency und load. Persistent external failures often require fallback endpoints, degraded features, or temporary protection modes.\n\nIn Solana workflows, reliability is tightly coupled to freshness constraints. A request can be logically valid but still fail if supporting state has shifted (fuer example stale quote windows or expired blockhash contexts in client workflows). Reliable systems therefore combine retry logic mit freshness checks und clear abort conditions.\n\nDefensive engineering means defining policies explicitly:\n- maximum retry count,\n- per-attempt timeout,\n- total deadline budget,\n- fallback behavior after budget exhaustion,\n- user-facing messaging fuer each failure class.\n\nWithout explicit budgets, systems drift into infinite retry loops or fail too early. Mit explicit budgets, behavior is predictable und testable.\n\nFuer production teams, observability is mandatory. Every failed operation should include a deterministic reason code und context fields (attempt number, endpoint, elapsed time, policy branch). This turns reliability from guesswork into measurable behavior.\n\nReliable systems do not promise zero failures. They promise controlled failure behavior: bounded latency, clear outcomes, und safe degradation under stress.",
            "duration": "45 min"
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
            "content": "Implement an exponential backoff retry mechanism fuer handling transient failures.",
            "duration": "45 min",
            "hints": [
              "Use match on the BackoffStrategy enum to handle each case",
              "Fuer exponential backoff, use 2_u64.pow(attempt) to calculate the multiplier",
              "should_retry simply checks if attempt is less than max_attempts"
            ]
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
            "content": "Implement a deadline management system to enforce time limits on operations.",
            "duration": "45 min",
            "hints": [
              "Store the absolute expiration timestamp in the Deadline struct",
              "Fuer time_remaining, subtract current_time from deadline timestamp if not expired",
              "Fuer extend_deadline, calculate the new timestamp und check against max allowed"
            ]
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
            "content": "Implement a fallback mechanism that provides alternative execution paths when primary operations fail.",
            "duration": "45 min",
            "hints": [
              "Call the primary function first und check if it returns Some",
              "Only call fallback if primary returns None",
              "Fuer retry, loop max_retries times trying primary before falling back"
            ]
          }
        }
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, und rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
            "content": "Resilience patterns are controls that prevent localized failures from becoming system-wide incidents. On Solana integrations, they are especially important because provider health can change quickly under bursty network conditions.\n\nCircuit breaker pattern:\n- closed: normal operation,\n- open: block requests after repeated failures,\n- half-open: probe recovery mit controlled trial requests.\n\nA good breaker uses deterministic thresholds und cooldowns, not ad hoc toggles. It should expose state transitions fuer monitoring und post-incident review.\n\nBulkhead pattern isolates resource pools so one failing workflow (fuer example expensive quote refresh loops) cannot starve unrelated workflows (like portfolio reads).\n\nRate limiting controls outbound pressure to providers. Proper limits reduce 429 storms und improve overall success rate. Token-bucket strategies are useful because they allow short bursts while preserving long-term bounds.\n\nThese patterns should be coordinated, not layered blindly. Fuer example, aggressive retries plus weak rate limiting can bypass the intent of a circuit breaker. Policy composition must be reviewed end-to-end.\n\nA mature resilience stack includes:\n- deterministic policy config,\n- simulation fixtures fuer calm vs stressed traffic,\n- dashboard visibility fuer breaker states und reject reasons,\n- explicit user copy fuer degraded mode.\n\nResilience is successful when users experience predictable service quality under failure, not when systems appear perfect in ideal conditions.",
            "duration": "45 min"
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
            "content": "Implement a circuit breaker pattern that opens after consecutive failures und closes after a recovery period.",
            "duration": "45 min",
            "hints": [
              "In can_execute, check if recovery timeout has passed fuer Open state",
              "record_success should reset everything to Closed state",
              "record_failure increments count und opens circuit when threshold is reached"
            ]
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
            "content": "Implement a token bucket rate limiter fuer controlling request rates.",
            "duration": "45 min",
            "hints": [
              "Always refill before checking if consumption is possible",
              "Calculate elapsed time und multiply by refill rate to get tokens to add",
              "Use min() to ensure tokens don't exceed capacity"
            ]
          },
          "lesson-10-2-4": {
            "title": "Error Classifier Challenge",
            "content": "Implement an error classification system to determine if errors are retryable.",
            "duration": "45 min",
            "hints": [
              "Use match mit range patterns (1000..=1999) to classify",
              "should_retry can use matches! macro or match on classify result",
              "batch_classify can use iter().map().collect() pattern"
            ]
          }
        }
      }
    }
  },
  "solana-testing-strategies": {
    "title": "Tests Strategies fuer Solana",
    "description": "Comprehensive, production-oriented tests strategy fuer Solana: deterministic unit tests, realistic integration tests, fuzz/property tests, und release-confidence reporting.",
    "duration": "5 weeks",
    "tags": [
      "testing",
      "quality-assurance",
      "fuzzing",
      "property-testing"
    ],
    "modules": {
      "mod-11-1": {
        "title": "Unit und Integration Tests",
        "description": "Build deterministic unit und integration tests layers mit clear ownership of invariants, fixtures, und failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Tests Fundamentals",
            "content": "Tests Solana systems effectively requires layered confidence, not one giant test suite.\n\nUnit tests validate pure logic: math, state transitions, und invariant checks. They should be fast, deterministic, und run on every change.\n\nIntegration tests validate component wiring: kontenmodelling, anweisung construction, und cross-modul behavior under realistic inputs. They should catch schema drift und boundary errors that unit tests miss.\n\nA praktisch test pyramid fuer Solana work:\n1) deterministic unit tests (broadest coverage),\n2) deterministic integration tests (targeted workflow coverage),\n3) environment-dependent checks (smaller set, higher cost).\n\nCommon failure in teams is over-reliance on environment-dependent tests while neglecting deterministic core checks. This creates flaky CI und weak debugging signals.\n\nGood test design principles:\n- explicit fixture ownership,\n- stable expected outputs,\n- structured error assertions (not only success assertions),\n- regression fixtures fuer previously discovered bugs.\n\nFuer production readiness, test outputs should be easy to audit. Summaries should include pass/fail counts by category, failing invariant IDs, und deterministic reproduction inputs.\n\nTests is not just correctness verification; it is an operational communication tool. Strong test artifacts make release decisions clearer und incident response faster.",
            "duration": "45 min"
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
            "content": "Implement a test assertion framework fuer verifying program state.",
            "duration": "45 min",
            "hints": [
              "Compare actual vs expected values und return appropriate Result",
              "Use format! to create descriptive error messages",
              "Return Ok(()) fuer success cases"
            ]
          },
          "lesson-11-1-3": {
            "title": "Mock Konto Generator Challenge",
            "content": "Create a mock konto generator fuer tests mit configurable parameters.",
            "duration": "45 min",
            "hints": [
              "Use vec![0; size] to create zero-filled data of specified size",
              "Fuer generate_with_lamports, use default values fuer other fields",
              "Signer konten typically have is_writable set to true"
            ]
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
            "content": "Build a test scenario builder fuer setting up complex test environments.",
            "duration": "45 min",
            "hints": [
              "Use builder pattern mit self return type fuer chaining",
              "Push strings into vectors (use to_string() to convert &str)",
              "build() consumes self und creates the final TestScenario"
            ]
          }
        }
      },
      "mod-11-2": {
        "title": "Fortgeschritten Tests Techniques",
        "description": "Use fuzzing, property-based tests, und mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing und Property Tests",
            "content": "Fortgeschritten tests techniques uncover failures that example-based tests rarely find.\n\nFuzzing explores broad random input space to trigger parser edge cases, boundary overflows, und unexpected state combinations. It is especially useful fuer serialization, decoding, und input validation layers.\n\nProperty-based tests defines invariants that must hold across many generated inputs. Instead of asserting one output, you assert a rule (fuer example: balances never become negative, or decoded-then-encoded payload remains stable).\n\nMutation-style thinking strengthens this further: intentionally alter assumptions und verify tests fail as expected. If tests still pass after a harmful change, coverage is weaker than it appears.\n\nTo keep fortgeschritten tests praktisch:\n- use deterministic seeds in CI fuer reproducibility,\n- store failing cases as permanent regression fixtures,\n- separate heavy campaigns from per-commit fast checks.\n\nFortgeschritten tests are most valuable when tied to explicit risk categories. Map each category (serialization safety, invariant consistency, edge-case arithmetic) to at least one dedicated property or fuzz campaign.\n\nTeams that treat fuzz/property failures as first-class release blockers catch subtle defects earlier und reduce high-severity production incidents.",
            "duration": "45 min"
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
            "content": "Implement a fuzz input generator fuer tests mit random data.",
            "duration": "45 min",
            "hints": [
              "Use wrapping_mul und wrapping_add fuer LCG to avoid overflow panics",
              "Generate bytes by taking random % 256",
              "Fuer bounded generation, calculate range und add to min"
            ]
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
            "content": "Implement a property verifier that checks invariants hold across operations.",
            "duration": "45 min",
            "hints": [
              "Fuer commutative, call op both ways und compare",
              "Fuer associative, nest the calls differently und compare",
              "Fuer non_decreasing, iterate through pairs und check ordering"
            ]
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
            "content": "Implement a boundary value analyzer fuer identifying edge cases.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub und saturating_add to avoid overflow",
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
    "description": "Engineer production-grade Solana leistung: compute budgeting, konto layout efficiency, memory/rent tradeoffs, und deterministic optimization workflows.",
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
        "description": "Optimize compute-heavy paths mit explicit CU budgets, operation-level profiling, und predictable leistung tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
            "content": "Compute units are the hard resource budget that shapes what your Solana program can do in a single transaktion. Leistung optimization starts by treating CU usage as a contract, not an afterthought.\n\nA reliable optimization loop is:\n1) measure baseline CU by operation type,\n2) identify dominant cost buckets (deserialization, hashing, loops, CPI fan-out),\n3) optimize one hotspot at a time,\n4) re-measure und keep only changes mit clear gains.\n\nCommon anti-patterns include optimizing cold paths, adding complexity without measurement, und ignoring konto-size side effects. In Solana systems, compute und konto design are coupled: a larger konto can increase deserialization cost, which raises CU pressure.\n\nFuer production teams, deterministic cost fixtures are crucial. They let you compare before/after behavior in CI und stop regressions early. Leistung work is most useful when every claim is backed by reproducible evidence, not intuition.",
            "duration": "45 min"
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
            "content": "Implement a compute unit counter to estimate operation costs.",
            "duration": "45 min",
            "hints": [
              "Loop cost is overhead plus iterations times per-iteration cost",
              "Konto access is simply konten multiplied by per-konto CU",
              "Apply safety margin by multiplying budget by the percentage"
            ]
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
            "content": "Optimize data structures fuer minimal serialization overhead.",
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
              "Calculate available CUs after accounting fuer overhead",
              "Use ceiling division: (n + d - 1) / d fuer number of batches",
              "Total CU = (num_batches * overhead) + (items * per_item)"
            ]
          }
        }
      },
      "mod-12-2": {
        "title": "Memory und Storage Optimization",
        "description": "Design memory/storage-efficient konto layouts mit rent-aware sizing, serialization discipline, und safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Konto Data Optimization",
            "content": "Konto data optimization is both a cost und correctness discipline. Poor layouts increase rent, slow parsing, und make migrations fragile.\n\nDesign principles:\n- Keep hot fields compact und easy to parse.\n- Use fixed-size representations where possible.\n- Reserve growth strategy explicitly instead of ad hoc field expansion.\n- Separate frequently-mutated data from rarely-changed metadata when praktisch.\n\nLayout decisions should be documented mit deterministic artifacts: field offsets, total bytes, und expected rent class. If a schema change increases konto size, reviewers should see the exact delta und migration implications.\n\nProduction optimization is not “smallest possible struct at any cost.” It is stable, readable, und migration-safe storage that keeps compute und rent budgets predictable over time.",
            "duration": "45 min"
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
            "content": "Implement a data packer that efficiently packs fields into konto data.",
            "duration": "45 min",
            "hints": [
              "Use to_le_bytes() to convert integers to bytes",
              "Use from_le_bytes() to convert bytes back to integers",
              "Alignment formula: if remainder, add (alignment - remainder)"
            ]
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
            "content": "Implement a rent calculator fuer estimating konto storage costs.",
            "duration": "45 min",
            "hints": [
              "Annual rent is data size times lamports per byte per year",
              "Exemption threshold is annual rent times threshold years",
              "Check if balance is greater than or equal to minimum"
            ]
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
            "content": "Implement a zero-copy deserializer fuer reading data without allocation.",
            "duration": "45 min",
            "hints": [
              "Use copy_from_slice to read fixed-size data into stack arrays",
              "Fuer read_bytes, return a slice of the original data (zero-copy)",
              "Always advance offset after reading"
            ]
          }
        }
      }
    }
  },
  "solana-tokenomics-design": {
    "title": "Tokenomics Design fuer Solana",
    "description": "Design robust Solana token economies mit distribution discipline, vesting safety, staking incentives, und governance mechanics that remain operationally defensible.",
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
        "title": "Token Distribution und Vesting",
        "description": "Model token allocation und vesting systems mit explicit fairness, unlock predictability, und deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
            "content": "Token distribution is a sicherheit und credibility decision, not just a spreadsheet exercise. Allocation und vesting rules shape long-term trust in the protocol.\n\nA strong distribution model answers:\n- who receives tokens und why,\n- when they unlock,\n- how unlock schedules affect circulating supply,\n- what controls prevent accidental over-distribution.\n\nVesting design should be deterministic und auditable. Cliff und linear phases must produce reproducible release amounts fuer any timestamp. Ambiguous rounding rules create disputes und operational risk.\n\nProduction teams should maintain allocation invariants in tests (fuer example: total distributed <= total supply, per-bucket caps respected, no negative vesting balances). Tokenomics quality improves when economics und implementation are validated together.",
            "duration": "45 min"
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
            "content": "Implement a vesting schedule calculator mit cliff und linear release.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub to avoid underflow when calculating elapsed time",
              "Fuer linear vesting, use u128 fuer mittelstufe calculation to avoid overflow",
              "Releasable is simply vested minus already released"
            ]
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
            "content": "Implement a token allocation distributor fuer managing different stakeholder groups.",
            "duration": "45 min",
            "hints": [
              "Use iter().map().sum() to calculate total percentage",
              "Use u128 fuer percentage calculation to avoid overflow",
              "Use find() to locate allocation by recipient"
            ]
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
            "content": "Generate a complete release schedule mit dates und amounts.",
            "duration": "45 min",
            "hints": [
              "Divide duration by intervals to get interval duration",
              "Use filter und sum to calculate total by timestamp",
              "Fuer monthly, use 30 days * 24 hours * 60 minutes * 60 seconds"
            ]
          }
        }
      },
      "mod-13-2": {
        "title": "Staking und Governance",
        "description": "Design staking und governance mechanics mit clear incentive alignment, anti-manipulation constraints, und measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking und Governance Design",
            "content": "Staking und governance systems must balance participation incentives mit manipulation resistance. Rewarding lock behavior is useful, but poorly tuned models can over-concentrate influence.\n\nCore design questions:\n1) How is staking reward rate set und adjusted?\n2) How is voting power calculated (raw balance, delegated balance, time-weighted)?\n3) What prevents short-term governance capture?\n\nGovernance math should be transparent und deterministic so users can verify voting outcomes independently. If power calculations are opaque or inconsistent, governance trust collapses quickly.\n\nOperationally, track governance health metrics: voter participation, delegation concentration, proposal pass patterns, und inactive stake ratios. Tokenomics is successful only when on-chain incentive behavior matches intended governance outcomes.",
            "duration": "45 min"
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
            "content": "Implement a staking rewards calculator mit compounding.",
            "duration": "45 min",
            "hints": [
              "Use compound interest formula: A = P(1 + r/n)^(nt)",
              "Convert basis points to decimal by dividing by 10000",
              "Fuer days to target, use logarithms to solve fuer time"
            ]
          },
          "lesson-13-2-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Implement a voting power calculator mit delegation support.",
            "duration": "45 min",
            "hints": [
              "If delegated_to is Some, voting power is 0 (they gave it away)",
              "Use filter to find voters who delegated to a specific address",
              "Sum staked amounts to calculate delegated power"
            ]
          },
          "lesson-13-2-4": {
            "title": "Proposal Threshold Calculator Challenge",
            "content": "Implement a proposal threshold calculator fuer governance.",
            "duration": "45 min",
            "hints": [
              "Convert basis points to amount: (supply * bps) / 10000",
              "Use u128 fuer mittelstufe calculation to avoid overflow",
              "Proposal passes if quorum met UND more fuer than against"
            ]
          }
        }
      }
    }
  },
  "solana-defi-primitives": {
    "title": "DeFi Primitives on Solana",
    "description": "Build praktisch Solana DeFi foundations: AMM mechanics, liquidity accounting, lending primitives, und flash-loan-safe composition patterns.",
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
        "title": "AMM und Liquidity",
        "description": "Implement AMM und liquidity primitives mit deterministic math, slippage-aware outputs, und LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
            "content": "AMM fundamentals are simple in formula but subtle in implementation quality. The invariant math must be deterministic, fee handling explicit, und rounding behavior consistent across paths.\n\nFuer constant-product pools, route quality is determined by output-at-size, not headline spot price. Larger trades move further on the curve und experience stronger impact, so quote logic must be size-aware.\n\nLiquidity accounting must also be exact: LP shares, fee accrual, und pool reserve updates should remain internally consistent under repeated swaps und edge-case sizes.\n\nProduction DeFi teams treat AMM math as critical infrastructure. They use fixed fixtures fuer swap-in/swap-out cases, boundary amounts, und fee tiers so regressions are caught before bereitstellung.",
            "duration": "45 min"
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
            "content": "Implement a constant product AMM fuer token swaps.",
            "duration": "45 min",
            "hints": [
              "Use u128 fuer mittelstufe calculations to prevent overflow",
              "Apply fee by multiplying by (10000 - fee_bps) / 10000",
              "Slippage is (price_before - effective_price) / price_before"
            ]
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
            "content": "Calculate LP token minting und rewards fuer liquidity providers.",
            "duration": "45 min",
            "hints": [
              "Fuer first liquidity, use sqrt(a * b) as LP tokens",
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
        "title": "Lending und Flash Loans",
        "description": "Model lending und flash-loan flows mit collateral safety, utilization-aware pricing, und strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
            "content": "Lending primitives und flash-loan logic are powerful but unforgiving. Safety depends on strict collateral valuation, clear LTV/threshold rules, und deterministic repayment checks.\n\nA praktisch lending model should define:\n- collateral valuation source und freshness policy,\n- borrow limits und liquidation thresholds,\n- utilization-based rate behavior,\n- liquidation und bad-debt handling paths.\n\nFlash loans add atomic constraints: borrowed amount plus fee must be repaid in the same transaktion context. Any relaxation of this invariant introduces severe risk.\n\nComposable DeFi design works when every primitive preserves local safety contracts while exposing clear interfaces fuer higher-level orchestration.",
            "duration": "45 min"
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
            "content": "Implement collateral und borrowing power calculations.",
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
              "Use piecewise function fuer borrow rate (below/above optimal)",
              "Supply rate konten fuer reserve factor taken by protocol"
            ]
          },
          "lesson-14-2-4": {
            "title": "Flash Loan Validator Challenge",
            "content": "Implement flash loan validation logic.",
            "duration": "45 min",
            "hints": [
              "Fee is amount times fee_bps divided by 10000",
              "Total repay is principal plus fee",
              "Profit is gain minus fee (use i64 fuer signed result)"
            ]
          }
        }
      }
    }
  },
  "solana-nft-standards": {
    "title": "NFT Standards on Solana",
    "description": "Implement Solana NFTs mit production-ready standards: metadata integrity, collection discipline, und fortgeschritten programmable/non-transferable behaviors.",
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
        "description": "Build core NFT functionality mit standards-compliant metadata, collection verification, und deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
            "content": "NFT architecture on Solana combines token mechanics mit metadata und collection semantics. A correct implementation requires more than minting a token mit supply one.\n\nCore components include:\n- mint/state ownership correctness,\n- metadata integrity und schema consistency,\n- collection linkage und verification status,\n- transfer und authority policy clarity.\n\nProduction NFT systems should treat metadata as a contract. If fields drift or verification flags are inconsistent, marketplaces und wallets may interpret assets differently.\n\nReliable implementations include deterministic validation fuer metadata structure, creator share totals, collection references, und authority expectations. Standards compliance is what preserves interoperability.",
            "duration": "45 min"
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
            "content": "Parse und validate NFT metadata according to Metaplex standards.",
            "duration": "45 min",
            "hints": [
              "Check string lengths mit len() method",
              "Sum creator shares und verify equals 100",
              "Royalty is sale_price * fee_bps / 10000"
            ]
          },
          "lesson-15-1-3": {
            "title": "Collection Manager Challenge",
            "content": "Implement NFT collection management mit size tracking.",
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
              "Sort descending by score fuer ranking (highest = rank 1)"
            ]
          }
        }
      },
      "mod-15-2": {
        "title": "Fortgeschritten NFT Features",
        "description": "Implement fortgeschritten NFT behaviors (soulbound und programmable flows) mit explicit policy controls und safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound und Programmable NFTs",
            "content": "Fortgeschritten NFT features introduce policy complexity that must be explicit. Soulbound behavior, programmable restrictions, und dynamic metadata updates all expand failure surface.\n\nFuer soulbound models, non-transferability must be enforced by clear rule paths, not UI assumptions. Fuer programmable NFTs, update permissions und transition rules should be deterministic und auditable.\n\nDynamic NFT updates should include strong validation und event clarity so indexers und clients can track state changes correctly.\n\nFortgeschritten NFT engineering succeeds when flexibility is paired mit strict policy boundaries und transparent update behavior.",
            "duration": "45 min"
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validator Challenge",
            "content": "Implement validation fuer soulbound (non-transferable) tokens.",
            "duration": "45 min",
            "hints": [
              "Soulbound tokens return false fuer can_transfer",
              "Burn requires is_burnable und owner == burner",
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
            "content": "Implement NFT composability fuer equipping items to base NFTs.",
            "duration": "45 min",
            "hints": [
              "Check available slots, compatibility, und not already equipped",
              "Use position() und remove() to unequip items",
              "Filter equipped items by matching type in items list"
            ]
          }
        }
      }
    }
  },
  "solana-cpi-patterns": {
    "title": "Programmuebergreifender Aufruf Patterns",
    "description": "Master CPI composition on Solana mit safe konto validation, PDA signer discipline, und deterministic multi-program orchestration patterns.",
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
        "description": "Build CPI fundamentals mit strict konto/signer checks, ownership validation, und safe PDA signing boundaries.",
        "lessons": {
          "lesson-16-1-1": {
            "title": "Programmuebergreifender Aufruf Architecture",
            "content": "Programmuebergreifender Aufruf (CPI) is where Solana composability becomes praktisch und where many sicherheit failures appear. The caller controls konto lists, so every CPI boundary must be treated as untrusted input.\n\nSafe CPI design requires:\n- explicit konto identity und owner validation,\n- signer und writable scope minimization,\n- deterministic PDA derivation und signer-seed handling,\n- bounded assumptions about downstream program behavior.\n\ninvoke und invoke_signed are not interchangeable conveniences. invoke_signed should only be used when signer proof is truly required und seed recipes are canonical.\n\nProduction CPI reliability comes from repeatable guard patterns. If constraints vary handler to handler, reviewers cannot reason about sicherheit consistently.",
            "duration": "45 min"
          },
          "lesson-16-1-2": {
            "title": "CPI Konto Validator Challenge",
            "content": "Validate konten fuer Programmuebergreifender Aufrufs.",
            "duration": "45 min",
            "hints": [
              "Check boolean flags fuer signer und writable validation",
              "Fuer balance, compare lamports against minimum required",
              "Privilege extension: if caller is signer, child can sign too"
            ]
          },
          "lesson-16-1-3": {
            "title": "PDA Signer Challenge",
            "content": "Implement PDA signing fuer CPI operations.",
            "duration": "45 min",
            "hints": [
              "Convert string seeds to bytes using as_bytes()",
              "Simulate PDA finding by trying different bump values",
              "Signature simulation combines message und seed hashes"
            ]
          },
          "lesson-16-1-4": {
            "title": "Anweisung Router Challenge",
            "content": "Implement an anweisung router fuer directing CPI calls.",
            "duration": "45 min",
            "hints": [
              "Use HashMap insert to register handlers",
              "Route by looking up instruction_type in handlers map",
              "create_cpi_call combines route mit konto preparation"
            ]
          }
        }
      },
      "mod-16-2": {
        "title": "Fortgeschritten CPI Patterns",
        "description": "Compose fortgeschritten multi-program flows mit atomicity awareness, consistency checks, und deterministic failure handling.",
        "lessons": {
          "lesson-16-2-1": {
            "title": "Multi-Program Composition",
            "content": "Multi-program composition introduces sequencing und consistency risk. Even when each CPI call is correct in isolation, combined flows can violate business invariants if ordering or rollback assumptions are weak.\n\nRobust composition patterns include:\n1) explicit stage boundaries,\n2) invariant checks between CPI steps,\n3) deterministic error classes fuer partial-failure diagnosis,\n4) idempotent recovery paths where possible.\n\nFuer complex operations (atomic swaps, flash-loan sequences), model expected preconditions und postconditions per stage. This keeps orchestration testable und prevents hidden state drift.\n\nCPI mastery is less about calling many programs und more about preserving correctness across program boundaries under adverse inputs.",
            "duration": "45 min"
          },
          "lesson-16-2-2": {
            "title": "Atomic Swap Orchestrator Challenge",
            "content": "Implement an atomic swap across multiple programs.",
            "duration": "45 min",
            "hints": [
              "Validate that steps is not empty und minimum_output > 0",
              "Atomicity requires output_token of step N equals input_token of step N+1",
              "Map steps to (program_id, input_token, expected_output) tuples"
            ]
          },
          "lesson-16-2-3": {
            "title": "State Consistency Validator Challenge",
            "content": "Validate state consistency across multiple CPI calls.",
            "duration": "45 min",
            "hints": [
              "Clone konten vector to create independent snapshot",
              "Fuer no_changes, verify all changed konten are in except list",
              "Compare balance und data_hash to detect changes"
            ]
          },
          "lesson-16-2-4": {
            "title": "Permissioned Invocation Challenge",
            "content": "Implement permission checks fuer program invocations.",
            "duration": "45 min",
            "hints": [
              "Push permission into vector to register",
              "Use find() to locate permission fuer program_id",
              "Use retain() to remove caller from allowed list"
            ]
          }
        }
      }
    }
  },
  "solana-mev-strategies": {
    "title": "MEV und Transaktion Ordering",
    "description": "Production-focused transaktion-ordering engineering on Solana: MEV-aware routing, bundle strategy, liquidation/arbitrage modeling, und user-protective execution controls.",
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
        "description": "Understand MEV mechanics und transaktion ordering realities, then model opportunities und risks mit deterministic safety-aware policies.",
        "lessons": {
          "lesson-17-1-1": {
            "title": "MEV on Solana",
            "content": "Maximal Extractable Value (MEV) on Solana is fundamentally about transaktion ordering under limited blockspace. Whether you are building trading tools, liquidation infrastructure, or user-facing apps, you need a realistic model of how ordering pressure changes outcomes.\n\nKey Solana-specific context:\n- ordering can be influenced by priority fees und relay/bundle paths,\n- opportunities are short-lived und highly competitive,\n- failed or delayed execution can convert expected profit into loss.\n\nA mature MEV approach begins mit classification:\n1) opportunity class (arbitrage, liquidation, backrun-style sequencing),\n2) dependency class (single-hop vs multi-hop, oracle-sensitive vs pool-state-sensitive),\n3) risk class (staleness, fill failure, adverse movement, execution contention).\n\nFuer production systems, raw opportunity detection is not enough. You need deterministic filters that reject fragile setups: stale quotes, weak depth, or excessive path complexity relative to expected edge.\n\nMost operational failures come from execution assumptions, not math. Teams should model inclusion probability, fallback paths, und cancellation thresholds explicitly.\n\nUser-protective design matters even fuer fortgeschritten orderflow systems. Clear policy around slippage limits, quote freshness, und failure reporting prevents silent value leakage und reduces support incidents.",
            "duration": "45 min"
          },
          "lesson-17-1-2": {
            "title": "Arbitrage Opportunity Detector Challenge",
            "content": "Detect arbitrage opportunities across DEXes.",
            "duration": "45 min",
            "hints": [
              "Compare all pairs of DEX prices fuer same token pair",
              "Profit percent is (sell - buy) / buy * 100",
              "Use max_by to find best opportunity"
            ]
          },
          "lesson-17-1-3": {
            "title": "Liquidation Opportunity Finder Challenge",
            "content": "Find undercollateralized positions fuer liquidation.",
            "duration": "45 min",
            "hints": [
              "Position is liquidatable when borrowed > threshold * collateral_value",
              "Calculate collateral value using price (mit 6 decimals)",
              "Liquidation profit is bonus percentage of collateral value"
            ]
          },
          "lesson-17-1-4": {
            "title": "Priority Fee Calculator Challenge",
            "content": "Calculate optimal priority fees fuer transaktion ordering.",
            "duration": "45 min",
            "hints": [
              "Urgency factor scales the base fee",
              "Execution probability decreases as more fees are higher",
              "Total cost includes priority fee, base, und compute unit cost"
            ]
          }
        }
      },
      "mod-17-2": {
        "title": "Fortgeschritten MEV Strategies",
        "description": "Design fortgeschritten ordering/bundle strategies mit explicit risk controls, failure handling, und user-impact guardrails.",
        "lessons": {
          "lesson-17-2-1": {
            "title": "Fortgeschritten MEV Techniques",
            "content": "Fortgeschritten transaktion-ordering strategies require disciplined orchestration, not just faster opportunity scans.\n\nBundle-oriented execution is valuable because it can express dependency sets und all-or-nothing intent, but bundle design must include:\n- strict preconditions,\n- deterministic abort rules,\n- replay-safe identifiers,\n- post-execution reconciliation.\n\nWhen strategy complexity increases (multi-hop paths, conditional liquidations), failure modes multiply: partial fills, stale assumptions, und contention spikes. A robust system ranks candidates by expected net value after execution risk, not gross theoretical edge.\n\nOperational controls should include:\n1) bounded retries mit fresh-state checks,\n2) confidence scoring fuer each candidate,\n3) kill-switch thresholds fuer abnormal failure streaks,\n4) deterministic run reports fuer incident replay.\n\nFortgeschritten MEV tooling is successful when it is both profitable und controllable. Deterministic artifacts (decision inputs, chosen path, reason codes) are what make that control real in production.",
            "duration": "45 min"
          },
          "lesson-17-2-2": {
            "title": "Bundle Composer Challenge",
            "content": "Compose transaktion bundles fuer atomic MEV extraction.",
            "duration": "45 min",
            "hints": [
              "Tip is percentage of total profit",
              "Bundle is profitable if profit exceeds tip",
              "Sort by priority fee descending fuer optimal ordering"
            ]
          },
          "lesson-17-2-3": {
            "title": "Multi-Hop Arbitrage Finder Challenge",
            "content": "Find multi-hop arbitrage paths across token pairs.",
            "duration": "45 min",
            "hints": [
              "Use constant product formula mit fee fuer output calculation",
              "Two-hop arbitrage goes A -> B -> A through different pools",
              "Profit is final output minus initial input"
            ]
          },
          "lesson-17-2-4": {
            "title": "MEV Simulation Engine Challenge",
            "content": "Simulate MEV extraction to estimate profitability.",
            "duration": "45 min",
            "hints": [
              "Apply slippage to both buy (increase) und sell (decrease) prices",
              "Risk score combines failure rate, profit negativity, und capital",
              "Expected value weights profit by success probability"
            ]
          }
        }
      }
    }
  },
  "solana-deployment-cicd": {
    "title": "Program Bereitstellung und CI/CD",
    "description": "Production bereitstellung engineering fuer Solana programs: environment strategy, release gating, CI/CD quality controls, und upgrade-safe operational workflows.",
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
        "title": "Bereitstellung Fundamentals",
        "description": "Model environment-specific bereitstellung behavior mit deterministic configs, artifact checks, und release preflight validation.",
        "lessons": {
          "lesson-18-1-1": {
            "title": "Solana Bereitstellung Environments",
            "content": "Solana bereitstellung is not one command; it is a release system mit environment-specific risk. Localnet, devnet, und mainnet each serve different validation goals, und production quality depends on using them intentionally.\n\nA reliable bereitstellung workflow defines:\n1) environment purpose und promotion criteria,\n2) deterministic config sources,\n3) artifact identity checks,\n4) rollback triggers.\n\nCommon failure patterns include mismatched program IDs, inconsistent config between environments, und unverified artifact drift between build und deploy. These are process issues that tooling should prevent.\n\nPreflight checks should be mandatory:\n- expected network und signer identity,\n- build artifact hash,\n- program size und upgrade constraints,\n- required konto/address assumptions.\n\nEnvironment promotion should be evidence-driven. Passing local tests alone is not enough fuer mainnet readiness; devnet/staging behavior must confirm operational assumptions under realistic RPC und timing conditions.\n\nBereitstellung maturity is measured by reproducibility. If another engineer cannot replay the release inputs und get the same artifact und checklist outcome, the pipeline is too fragile.",
            "duration": "45 min"
          },
          "lesson-18-1-2": {
            "title": "Bereitstellung Config Manager Challenge",
            "content": "Manage bereitstellung configurations fuer different environments.",
            "duration": "45 min",
            "hints": [
              "Push config into vector to add",
              "Use find() to locate config by environment name",
              "is_deployed checks if program_id is Some"
            ]
          },
          "lesson-18-1-3": {
            "title": "Program Size Validator Challenge",
            "content": "Validate program binary size und compute budget.",
            "duration": "45 min",
            "hints": [
              "Compare binary length against MAX_PROGRAM_SIZE",
              "Use ceiling division fuer transaktion count",
              "Compression ratio shows percentage size reduction"
            ]
          },
          "lesson-18-1-4": {
            "title": "Upgrade Authority Manager Challenge",
            "content": "Manage program upgrade authorities und permissions.",
            "duration": "45 min",
            "hints": [
              "Push metadata into vector to register",
              "can_upgrade checks if authority matches stored authority",
              "Use find_mut to locate und modify program metadata"
            ]
          }
        }
      },
      "mod-18-2": {
        "title": "CI/CD Pipelines",
        "description": "Build CI/CD pipelines that enforce build/test/sicherheit gates, compatibility checks, und controlled rollout/rollback evidence.",
        "lessons": {
          "lesson-18-2-1": {
            "title": "CI/CD fuer Solana Programs",
            "content": "CI/CD fuer Solana should enforce release quality, not just automate command execution.\n\nA praktisch pipeline includes staged gates:\n1) static quality gate (lint/type/sicherheit checks),\n2) deterministic unit/integration tests,\n3) build reproducibility und artifact hashing,\n4) bereitstellung preflight validation,\n5) controlled rollout mit observability checks.\n\nEach gate should produce machine-readable evidence. Release decisions become faster und safer when teams can inspect deterministic artifacts instead of scanning raw logs.\n\nVersion compatibility checks are critical in Solana ecosystems where CLI/toolchain mismatches can break builds or runtime expectations. Pipelines should fail fast on incompatible matrices.\n\nRollout strategy should also be explicit: canary/degraded mode, monitoring window, und rollback conditions. “Deploy und hope” is not a strategy.\n\nThe best CI/CD systems reduce human toil while increasing decision clarity. Automation should encode operational policy, not bypass it.",
            "duration": "45 min"
          },
          "lesson-18-2-2": {
            "title": "Build Pipeline Validator Challenge",
            "content": "Validate CI/CD pipeline stages und dependencies.",
            "duration": "45 min",
            "hints": [
              "Track seen stages to enforce ordering constraints",
              "Use any() mit matches! to check fuer required stages",
              "Can skip build/test if only documentation files changed"
            ]
          },
          "lesson-18-2-3": {
            "title": "Version Compatibility Checker Challenge",
            "content": "Check version compatibility between tools und dependencies.",
            "duration": "45 min",
            "hints": [
              "Split version string by '.' und parse each component",
              "Compatibility requires same major, actual >= required",
              "Use min_by to find smallest compatible version"
            ]
          },
          "lesson-18-2-4": {
            "title": "Bereitstellung Rollback Manager Challenge",
            "content": "Manage bereitstellung rollbacks und recovery.",
            "duration": "45 min",
            "hints": [
              "Push bereitstellung und update current_index to new bereitstellung",
              "can_rollback checks fuer any successful bereitstellung before current",
              "get_rollback_target finds most recent successful bereitstellung"
            ]
          }
        }
      }
    }
  },
  "solana-cross-chain-bridges": {
    "title": "Cross-Chain Bridges und Wormhole",
    "description": "Build safer cross-chain integrations fuer Solana using Wormhole-style messaging, attestation verification, und deterministic bridge-state controls.",
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
        "description": "Understand cross-chain messaging trust boundaries, guardian attestations, und deterministic verification pipelines.",
        "lessons": {
          "lesson-43-1-1": {
            "title": "Cross-Chain Messaging Architecture",
            "content": "Cross-chain messaging is a trust-boundary problem before it is a transport problem. In Wormhole-style systems, messages are observed, attested, und consumed across different chain environments, each mit independent failure modes.\n\nA robust architecture model includes:\n1) emitter semantics (what exactly is being attested),\n2) attestation verification (who signed und under what threshold),\n3) replay prevention (message uniqueness und consumption state),\n4) execution safety (what happens if target-chain state has changed).\n\nVerification must be deterministic und strict. Accepting malformed or weakly validated attestations is a direct safety risk.\n\nCross-chain systems should also expose explicit reason codes fuer rejects: invalid signatures, stale message, already-consumed message, unsupported payload schema. This improves operator response und audit quality.\n\nMessaging reliability depends on observability. Teams need deterministic logs linking source event IDs to target execution outcomes so they can reconcile partial or delayed flows.\n\nCross-chain engineering succeeds when attestation trust assumptions are transparent und enforced consistently at every consume path.",
            "duration": "45 min"
          },
          "lesson-43-1-2": {
            "title": "VAA Verifier Challenge",
            "content": "Implement VAA (Verified Action Approval) signature verification.",
            "duration": "45 min",
            "hints": [
              "Check signatures length against MIN_SIGNERS first",
              "Use to_be_bytes() fuer big-endian byte conversion",
              "Quorum is 2/3 of total guardians rounded up"
            ]
          },
          "lesson-43-1-3": {
            "title": "Message Emitter Challenge",
            "content": "Implement cross-chain message emission und tracking.",
            "duration": "45 min",
            "hints": [
              "Increment sequence before creating message",
              "Next sequence is current + 1",
              "Verify message sequence is within emitted range"
            ]
          },
          "lesson-43-1-4": {
            "title": "Replay Protection Challenge",
            "content": "Implement replay protection fuer cross-chain messages.",
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
        "description": "Implement asset-bridging patterns mit strict supply/accounting invariants, replay protection, und reconciliation workflows.",
        "lessons": {
          "lesson-43-2-1": {
            "title": "Token Bridging Mechanics",
            "content": "Token bridging requires strict supply und state invariants. Lock-und-mint und burn-und-mint models both rely on one central rule: represented supply across chains must remain coherent.\n\nCritical controls include:\n- single-consume message semantics,\n- deterministic mint/unlock accounting,\n- paused-mode handling fuer incident containment,\n- reconciliation reports between source und target totals.\n\nA bridge flow should define state transitions explicitly: initiated, attested, executed, reconciled. Missing state transitions create operational blind spots.\n\nReplay und duplication are recurring bridge risks. Systems must key transfer intents deterministically und reject repeated execution attempts even under retries or delayed relays.\n\nProduction bridge operations also need runbooks: what to do on attestation delays, threshold signer issues, or target-chain execution failures.\n\nBridging quality is not just throughput; it is verifiable accounting integrity under adverse network conditions.",
            "duration": "45 min"
          },
          "lesson-43-2-2": {
            "title": "Token Locker Challenge",
            "content": "Implement token locking fuer bridge deposits.",
            "duration": "45 min",
            "hints": [
              "Push lock to vector und return index as lock_id",
              "Verify requester matches owner before unlocking",
              "Use filter und sum to calculate owner's locked amount"
            ]
          },
          "lesson-43-2-3": {
            "title": "Wrapped Token Mint Challenge",
            "content": "Manage wrapped token minting und supply tracking.",
            "duration": "45 min",
            "hints": [
              "Push token to vector und return index",
              "Check bounds before minting/burning",
              "Use get() und map() to safely retrieve supply"
            ]
          },
          "lesson-43-2-4": {
            "title": "Bridge Rate Limiter Challenge",
            "content": "Implement rate limiting fuer bridge withdrawals.",
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
    "title": "Oracle Integration und Pyth Network",
    "description": "Integrate Solana oracle feeds safely: price validation, confidence/staleness policy, und multi-source aggregation fuer resilient protocol decisions.",
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
        "description": "Understand oracle data semantics (price, confidence, staleness) und enforce deterministic validation before business logic.",
        "lessons": {
          "lesson-44-1-1": {
            "title": "Oracle Price Feeds",
            "content": "Oracle integration is a risk-control problem, not a data-fetch problem. Price feeds must be evaluated fuer freshness, confidence, und contextual fitness before they drive protocol decisions.\n\nA safe oracle validation pipeline checks:\n1) feed status und availability,\n2) staleness window compliance,\n3) confidence-band reasonableness,\n4) value bounds against protocol policy.\n\nUsing raw price without confidence or staleness checks can trigger invalid liquidations, bad quotes, or incorrect risk assessments.\n\nValidation outputs should be deterministic und structured (accept/reject mit reason code). This helps downstream systems choose safe fallback behavior.\n\nProtocols should separate “data exists” from “data is usable.” A feed can be present but still unfit due to stale timestamp or extreme uncertainty.\n\nProduction reliability improves when oracle checks are versioned und fixture-tested across calm und stressed market scenarios.",
            "duration": "45 min"
          },
          "lesson-44-1-2": {
            "title": "Price Validator Challenge",
            "content": "Validate oracle prices fuer correctness und freshness.",
            "duration": "45 min",
            "hints": [
              "Freshness: current_time - publish_time <= max_staleness",
              "Confidence ratio: conf / |price| < threshold",
              "Use matches! fuer enum variant checking"
            ]
          },
          "lesson-44-1-3": {
            "title": "Price Normalizer Challenge",
            "content": "Normalize prices mit different exponents to common scale.",
            "duration": "45 min",
            "hints": [
              "Calculate decimal difference und scale accordingly",
              "Use u128 fuer mittelstufe to prevent overflow",
              "Buy price increases, sell price decreases mit spread"
            ]
          },
          "lesson-44-1-4": {
            "title": "EMA Calculator Challenge",
            "content": "Calculate Exponential Moving Average fuer price smoothing.",
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
        "description": "Design multi-oracle aggregation und consensus policies that reduce single-source failure risk while remaining explainable und testable.",
        "lessons": {
          "lesson-44-2-1": {
            "title": "Oracle Aggregation Strategies",
            "content": "Multi-oracle aggregation reduces single-point dependency but adds policy complexity. The goal is not to average blindly; it is to produce a robust decision value mit clear confidence in adverse conditions.\n\nCommon strategies include median, trimmed mean, und weighted consensus. Strategy choice should reflect threat model: outlier resistance, latency tolerance, und source diversity.\n\nAggregation policies should define:\n- minimum participating sources,\n- max divergence threshold,\n- fallback action when consensus fails.\n\nIf sources diverge beyond policy bounds, the safe action may be to halt sensitive operations rather than force a number.\n\nDeterministic aggregation reports should include contributing sources, excluded outliers, und final consensus rationale. This is essential fuer audits und incident response.\n\nA good oracle stack is transparent: every accepted value can be explained, replayed, und defended.",
            "duration": "45 min"
          },
          "lesson-44-2-2": {
            "title": "Median Price Calculator Challenge",
            "content": "Calculate median price from multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Sort prices und find middle element(s) fuer median",
              "Fuer weighted median, accumulate weights until reaching 50%",
              "Use retain() to filter out outliers"
            ]
          },
          "lesson-44-2-3": {
            "title": "Oracle Consensus Challenge",
            "content": "Implement consensus checking across multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Check minimum sources first",
              "Find a price that at least 50% of oracles agree mit",
              "Agreement percent is (agreeing / total) * 100"
            ]
          },
          "lesson-44-2-4": {
            "title": "Fallback Oracle Manager Challenge",
            "content": "Manage primary und fallback oracle sources.",
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
    "title": "DAO Tooling und Autonomous Organizations",
    "description": "Build production-ready DAO systems on Solana: proposal governance, voting integrity, treasury controls, und deterministic execution/reporting workflows.",
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
        "description": "Implement governance mechanics mit explicit proposal lifecycle rules, voting-power logic, und deterministic state transitions.",
        "lessons": {
          "lesson-45-1-1": {
            "title": "DAO Governance Architecture",
            "content": "DAO governance architecture is a system of enforceable process rules. Proposal creation, voting, und execution must be deterministic, auditable, und resistant to manipulation.\n\nA robust governance model defines:\n1) proposal lifecycle states und transitions,\n2) voter eligibility und power calculation,\n3) quorum/approval thresholds by action class,\n4) execution preconditions und cancellation paths.\n\nGovernance failures usually come from ambiguity: unclear thresholds, inconsistent snapshot timing, or weak transition validation.\n\nState transitions should be explicit und testable. Invalid transitions (fuer example executed -> voting) should fail mit deterministic errors.\n\nVoting-power logic must also be transparent. Whether delegation, time-weighting, or quadratic models are used, outcomes should be reproducible from public inputs.\n\nDAO tooling quality is measured by predictability under pressure. During contentious proposals, deterministic behavior und clear reason codes are what preserve legitimacy.",
            "duration": "45 min"
          },
          "lesson-45-1-2": {
            "title": "Proposal Lifecycle Manager Challenge",
            "content": "Manage DAO proposal states und transitions.",
            "duration": "45 min",
            "hints": [
              "Match on (current, new) state pairs fuer valid transitions",
              "Voting active only during time window in Active state",
              "Quorum und threshold use basis point calculations"
            ]
          },
          "lesson-45-1-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Calculate voting power mit delegation und quadratic options.",
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
              "Use position() und remove() to undelegate",
              "Filter und sum to get delegated amount"
            ]
          }
        }
      },
      "mod-45-2": {
        "title": "Treasury und Execution",
        "description": "Engineer treasury und execution tooling mit policy gates, timelock safeguards, und auditable automation outcomes.",
        "lessons": {
          "lesson-45-2-1": {
            "title": "DAO Treasury Management",
            "content": "DAO treasury management is where governance intent becomes real financial action. Treasury tooling must therefore combine flexibility mit strict policy constraints.\n\nCore controls include:\n- spending limits und role-based authority,\n- timelock windows fuer sensitive actions,\n- multisig/escalation paths,\n- deterministic execution logs.\n\nAutomated execution should never hide policy checks. Every executed action should reference the proposal, required approvals, und control checks passed.\n\nFailure handling is equally important. If execution fails mid-flow, tooling should expose exact failure stage und safe retry/rollback guidance.\n\nTreasury systems should also produce reconciliation artifacts: proposed vs executed amounts, remaining budget, und exception records.\n\nOperationally mature DAOs treat treasury automation as regulated process infrastructure: explicit controls, reproducible evidence, und clear accountability boundaries.",
            "duration": "45 min"
          },
          "lesson-45-2-2": {
            "title": "Treasury Spending Limit Challenge",
            "content": "Implement spending limits und budget tracking fuer DAO treasury.",
            "duration": "45 min",
            "hints": [
              "Check balance und category limits before allowing spend",
              "Reset period if duration has passed",
              "Use saturating_sub to avoid underflow"
            ]
          },
          "lesson-45-2-3": {
            "title": "Timelock Executor Challenge",
            "content": "Implement timelock fuer delayed proposal execution.",
            "duration": "45 min",
            "hints": [
              "Push operation und return index as ID",
              "Can execute only if ETA reached und not executed",
              "Remove operation from list to cancel"
            ]
          },
          "lesson-45-2-4": {
            "title": "Automated Action Trigger Challenge",
            "content": "Implement automated triggers fuer DAO actions based on conditions.",
            "duration": "45 min",
            "hints": [
              "Push action und return index as ID",
              "Match on condition type to evaluate",
              "Only return non-triggered actions that meet conditions"
            ]
          }
        }
      }
    }
  },
  "solana-gaming": {
    "title": "Gaming und Game State Management",
    "description": "Build production-ready on-chain game systems on Solana: efficient state models, turn integrity, fairness controls, und scalable player progression economics.",
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
        "description": "Design game state und turn logic mit deterministic transitions, storage efficiency, und anti-cheat validation boundaries.",
        "lessons": {
          "lesson-46-1-1": {
            "title": "On-Chain Game Design",
            "content": "On-chain game design on Solana is a systems-engineering tradeoff between fairness, responsiveness, und cost. The best designs keep critical rules verifiable while minimizing expensive state writes.\n\nCore architecture decisions:\n1) what state must be on-chain fuer trust,\n2) what can remain off-chain fuer speed,\n3) how turn validity is enforced deterministically.\n\nTurn-based mechanics should use explicit state transitions und guard checks (current actor, phase, cooldown, resource limits). If transitions are ambiguous, replay und dispute resolution become difficult.\n\nState compression und compact encoding matter because game loops can generate many updates. Efficient schemas reduce rent und compute pressure while preserving auditability.\n\nA production game model should also define anti-cheat boundaries. Even mit deterministic logic, you need clear validation fuer illegal actions, stale turns, und duplicate submissions.\n\nReliable game infrastructure is measured by predictable outcomes under stress: same input actions, same resulting state, clear reject reasons fuer invalid actions.",
            "duration": "45 min"
          },
          "lesson-46-1-2": {
            "title": "Turn Manager Challenge",
            "content": "Implement turn-based game mechanics mit action validation.",
            "duration": "45 min",
            "hints": [
              "Check player matches, state is waiting, und before deadline",
              "Turn complete when all players submitted",
              "Increment turn number fuer next turn"
            ]
          },
          "lesson-46-1-3": {
            "title": "Game State Compressor Challenge",
            "content": "Compress game state fuer efficient on-chain storage.",
            "duration": "45 min",
            "hints": [
              "Use bit shifting to pack x in high 4 bits, y in low 4 bits",
              "Unpack by shifting und masking",
              "Health stored as percentage (0-100) fits in 7 bits"
            ]
          },
          "lesson-46-1-4": {
            "title": "Player Progression Tracker Challenge",
            "content": "Track player experience, levels, und achievements.",
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
        "title": "Randomness und Fairness",
        "description": "Implement fairness-oriented randomness und integrity controls that keep gameplay auditable und dispute-resistant.",
        "lessons": {
          "lesson-46-2-1": {
            "title": "On-Chain Randomness",
            "content": "Randomness is one of the hardest fairness problems in blockchain games because execution is deterministic. Robust designs avoid naive pseudo-randomness tied directly to manipulable context.\n\nPraktisch fairness patterns include commit-reveal, VRF-backed randomness, und delayed-seed schemes. Each has latency/trust tradeoffs:\n- commit-reveal: simple und transparent, but requires multi-step interaction,\n- VRF: stronger unpredictability, but introduces oracle/dependency considerations,\n- delayed-seed methods: lower overhead but weaker guarantees under adversarial pressure.\n\nFairness engineering should specify:\n1) who can influence randomness inputs,\n2) when values become immutable,\n3) how unresolved rounds are handled on timeout.\n\nProduction systems should emit deterministic round evidence (commit hash, reveal value, validation result) so disputes can be resolved quickly.\n\nGame fairness is credible when randomness mechanisms are explicit, verifiable, und resilient to timing manipulation.",
            "duration": "45 min"
          },
          "lesson-46-2-2": {
            "title": "Commit-Reveal Challenge",
            "content": "Implement commit-reveal scheme fuer fair randomness.",
            "duration": "45 min",
            "hints": [
              "Push commitment to vector",
              "Verify by recomputing hash from reveal",
              "XOR all revealed values fuer combined randomness"
            ]
          },
          "lesson-46-2-3": {
            "title": "Dice Roller Challenge",
            "content": "Implement verifiable dice rolling mit randomness.",
            "duration": "45 min",
            "hints": [
              "Use hash of seed fuer deterministic randomness",
              "Modulo operation gives range, add 1 fuer 1-based",
              "4d6 drop lowest: roll 4, sum all, subtract minimum"
            ]
          },
          "lesson-46-2-4": {
            "title": "Loot Table Challenge",
            "content": "Implement weighted loot tables fuer game rewards.",
            "duration": "45 min",
            "hints": [
              "Sum all weights fuer total",
              "Generate random number in range [0, total)",
              "Find item where cumulative weight exceeds roll"
            ]
          }
        }
      }
    }
  },
  "solana-permanent-storage": {
    "title": "Permanent Storage und Arweave",
    "description": "Integrate permanent decentralized storage mit Solana using Arweave-style workflows: content addressing, manifest integrity, und verifiable long-term data access.",
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
        "description": "Understand permanent-storage architecture und build deterministic linking between Solana state und external immutable content.",
        "lessons": {
          "lesson-47-1-1": {
            "title": "Permanent Storage Architecture",
            "content": "Permanent storage integration is a data durability contract. On Solana, storing full content on-chain is often impractical, so systems rely on immutable external storage references anchored by on-chain metadata.\n\nA robust architecture defines:\n1) canonical content identifiers,\n2) integrity verification method,\n3) fallback retrieval behavior,\n4) lifecycle policy fuer metadata updates.\n\nContent-addressed design is critical. If identifiers are not tied to content hash semantics, integrity guarantees weaken und replayed/wrong assets can be served.\n\nStorage integration should also separate control-plane und data-plane concerns: on-chain records govern ownership/version pointers, while external storage handles large payload persistence.\n\nProduction reliability requires deterministic verification reports (ID format validity, expected hash match, availability checks). This makes failures diagnosable und prevents silent corruption.\n\nPermanent storage systems succeed when users can independently verify that referenced content matches what governance or protocol state claims.",
            "duration": "45 min"
          },
          "lesson-47-1-2": {
            "title": "Transaktion ID Validator Challenge",
            "content": "Validate Arweave transaktion IDs und URLs.",
            "duration": "45 min",
            "hints": [
              "Check exact length und all characters valid",
              "base64url uses alphanumeric plus - und _"
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
            "content": "Optimize data bundling fuer efficient Arweave uploads.",
            "duration": "45 min",
            "hints": [
              "Sort items by priority before bundling"
            ]
          }
        }
      },
      "mod-47-2": {
        "title": "Manifests und Verification",
        "description": "Work mit manifests, verification pipelines, und cost/leistung controls fuer reliable long-lived data serving.",
        "lessons": {
          "lesson-47-2-1": {
            "title": "Arweave Manifests",
            "content": "Manifests turn many stored assets into one navigable root, but they introduce their own integrity responsibilities. A manifest is only trustworthy if path mapping und referenced content IDs are validated consistently.\n\nKey safeguards:\n- deterministic path normalization,\n- duplicate/ambiguous key rejection,\n- strict transaktion-ID validation,\n- recursive integrity checks fuer referenced content.\n\nManifest tooling should produce auditable outputs: resolved entries count, missing references, und hash verification status by path.\n\nFrom an operational standpoint, cost optimization should not compromise integrity. Bundling strategies, compression, und metadata minimization are useful only if verification remains straightforward und deterministic.\n\nWell-run permanent-storage pipelines treat manifests as governed artifacts mit versioned schema expectations und repeatable validation in CI.",
            "duration": "45 min"
          },
          "lesson-47-2-2": {
            "title": "Manifest Builder Challenge",
            "content": "Build und parse Arweave manifests.",
            "duration": "45 min",
            "hints": [
              "Validate tx_id length before adding",
              "Resolve in order: exact, index, fallback"
            ]
          },
          "lesson-47-2-3": {
            "title": "Data Verifier Challenge",
            "content": "Verify data integrity und availability on Arweave.",
            "duration": "45 min",
            "hints": [
              "MIN_CONFIRMATIONS defines 'sufficient' threshold"
            ]
          },
          "lesson-47-2-4": {
            "title": "Storage Indexer Challenge",
            "content": "Index und query stored data by tags.",
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
    "title": "Staking und Validator Economics",
    "description": "Understand Solana staking und validator economics fuer real-world decision-making: delegation strategy, reward dynamics, commission effects, und operational sustainability.",
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
        "description": "Lerne native staking mechanics mit deterministic reward modeling, validator selection criteria, und delegation risk framing.",
        "lessons": {
          "lesson-48-1-1": {
            "title": "Solana Staking Architecture",
            "content": "Solana staking economics is an incentives system connecting delegators, validatoren, und network sicherheit. Good delegation decisions require more than chasing headline APY.\n\nDelegators should evaluate:\n1) validator leistung consistency,\n2) commission policy und changes over time,\n3) uptime und vote behavior,\n4) concentration risk across the validator set.\n\nReward modeling should be deterministic und transparent. Calculations must show gross rewards, commission effects, und net delegator outcome under explicit assumptions.\n\nDiversification matters. Concentrating stake purely on top performers can increase ecosystem centralization risk even if short-term yield appears higher.\n\nProduction staking tooling should expose scenario analysis (commission changes, leistung drops, epoch variance) so delegators can make resilient choices rather than reactive moves.\n\nStaking quality is measured by sustainable net returns plus contribution to healthy validator distribution.",
            "duration": "45 min"
          },
          "lesson-48-1-2": {
            "title": "Staking Rewards Calculator Challenge",
            "content": "Calculate staking rewards mit commission und inflation.",
            "duration": "45 min",
            "hints": [
              "Apply commission as (1 - commission) multiplier",
              "Divide annual by epochs per year fuer epoch reward",
              "APY is (reward / stake) * 100"
            ]
          },
          "lesson-48-1-3": {
            "title": "Validator Selector Challenge",
            "content": "Select validatoren based on leistung und commission.",
            "duration": "45 min",
            "hints": [
              "Weight factors: commission 40%, uptime 40%, skip rate 20%",
              "Sort by score descending und take top N",
              "Check each validator's percentage of total stake"
            ]
          },
          "lesson-48-1-4": {
            "title": "Stake Rebalancing Challenge",
            "content": "Optimize stake distribution across validatoren.",
            "duration": "45 min",
            "hints": [
              "Target is total divided by count, clamped to min/max",
              "Count allocations that differ between old und new",
              "Check all allocations within tolerance percentage"
            ]
          }
        }
      },
      "mod-48-2": {
        "title": "Validator Operations",
        "description": "Analyze validator-side economics, operational cost pressure, und incentive alignment fuer long-term network health.",
        "lessons": {
          "lesson-48-2-1": {
            "title": "Validator Economics",
            "content": "Validator economics balances revenue opportunities against operational costs und reliability obligations. Sustainable validatoren optimize fuer long-term trust, not short-term extraction.\n\nRevenue sources include inflation rewards und fee-related earnings; cost structure includes hardware, networking, maintenance, und operational staffing.\n\nKey operational metrics fuer validator viability:\n- effective uptime und vote success,\n- commission competitiveness,\n- stake retention trend,\n- incident frequency und recovery quality.\n\nCommission strategy should be explicit und predictable. Sudden commission spikes can damage delegator trust und long-term stake stability.\n\nEconomic analysis should include downside modeling: reduced stake, higher incident costs, or prolonged leistung degradation.\n\nHealthy validator economics supports network resilience. Tooling should help operators und delegators reason about sustainability, not just peak-period earnings.",
            "duration": "45 min"
          },
          "lesson-48-2-2": {
            "title": "Validator Profit Calculator Challenge",
            "content": "Calculate validator profitability.",
            "duration": "45 min",
            "hints": [
              "Sum all cost components",
              "Revenue = commission * delegated_rewards + self_rewards",
              "Break-even: commission = needed_rewards / delegated_rewards"
            ]
          },
          "lesson-48-2-3": {
            "title": "Epoch Schedule Calculator Challenge",
            "content": "Calculate epoch timing und reward distribution schedules.",
            "duration": "45 min",
            "hints": [
              "Convert ms to hours: / (1000 * 60 * 60)",
              "Next epoch starts at (current_epoch + 1) * slots_per_epoch",
              "Epoch fuer slot is integer division"
            ]
          },
          "lesson-48-2-4": {
            "title": "Stake Konto Manager Challenge",
            "content": "Manage stake konto lifecycle including activation und deactivation.",
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
    "title": "Konto Abstraction und Smart Wallets",
    "description": "Implement smart-wallet/konto-abstraction patterns on Solana mit programmable authorization, recovery controls, und policy-driven transaktion validation.",
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
        "description": "Build smart-wallet fundamentals including multisig und social-recovery designs mit clear trust und failure boundaries.",
        "lessons": {
          "lesson-49-1-1": {
            "title": "Konto Abstraction on Solana",
            "content": "Konto abstraction on Solana shifts control from a single key to programmable policy. Smart wallets can enforce richer authorization logic, but policy complexity must be managed carefully.\n\nA robust smart-wallet design defines:\n1) authority model (owners/guardians/delegates),\n2) policy scope (what can be approved automatically vs manually),\n3) recovery path (how access is restored safely).\n\nMultisig und social recovery are powerful, but both need deterministic state transitions und explicit quorum rules. Ambiguous transitions create lockout or unauthorized-access risk.\n\nSmart-wallet systems should emit structured authorization evidence fuer each action: which policy matched, which signers approved, und which constraints passed.\n\nProduction reliability depends on clear emergency controls: pause paths, guardian rotation, und recovery cooldowns.\n\nKonto abstraction is successful when flexibility increases safety und usability together, not when policy logic becomes opaque.",
            "duration": "45 min"
          },
          "lesson-49-1-2": {
            "title": "Multi-Signature Wallet Challenge",
            "content": "Implement M-of-N multi-signature wallet.",
            "duration": "45 min",
            "hints": [
              "Use contains() to check ownership",
              "Can sign if owner UND not already signed UND not executed",
              "Can execute if threshold reached und not executed"
            ]
          },
          "lesson-49-1-3": {
            "title": "Social Recovery Challenge",
            "content": "Implement social recovery mit guardians.",
            "duration": "45 min",
            "hints": [
              "Track approvals in guardians_approved vector",
              "Check guardian status before approving",
              "Require threshold UND delay fuer execution"
            ]
          },
          "lesson-49-1-4": {
            "title": "Session Key Manager Challenge",
            "content": "Manage temporary session keys mit limited permissions.",
            "duration": "45 min",
            "hints": [
              "Valid if current time before expiration",
              "Can execute if valid, allowed operation, und within limit",
              "Remaining is max minus used"
            ]
          }
        }
      },
      "mod-49-2": {
        "title": "Programmable Validation",
        "description": "Implement programmable validation policies (limits, allowlists, time/risk rules) mit deterministic enforcement und auditability.",
        "lessons": {
          "lesson-49-2-1": {
            "title": "Custom Validation Rules",
            "content": "Programmable validation is where smart wallets deliver real value, but it is also where subtle policy bugs appear.\n\nTypical controls include spending limits, destination allowlists, time windows, und risk-score gates. These controls should be deterministic und composable, mit explicit precedence rules.\n\nDesign principles:\n- fail closed on ambiguous policy matches,\n- keep policy evaluation order stable,\n- attach machine-readable reason codes to approve/reject outcomes.\n\nValidation systems should also support policy explainability. Users und auditors need to understand why a transaktion was blocked or approved.\n\nFuer production deployments, policy changes should be versioned und test-fixtured. A new rule must be validated against prior known-good scenarios to avoid accidental lockouts or bypasses.\n\nProgrammable wallets are strongest when validation logic is transparent, testable, und operationally reversible.",
            "duration": "45 min"
          },
          "lesson-49-2-2": {
            "title": "Spending Limit Enforcer Challenge",
            "content": "Enforce daily und per-transaktion spending limits.",
            "duration": "45 min",
            "hints": [
              "Reset counters before checking",
              "Check all three limits: per-tx, daily, weekly",
              "Reset daily if new day, weekly if 7+ days passed"
            ]
          },
          "lesson-49-2-3": {
            "title": "Whitelist Enforcer Challenge",
            "content": "Enforce destination whitelists fuer transaktionen.",
            "duration": "45 min",
            "hints": [
              "allow_all bypasses whitelist check",
              "Check contains() before adding",
              "Validate all destinations in transaktion"
            ]
          },
          "lesson-49-2-4": {
            "title": "Time Lock Enforcer Challenge",
            "content": "Enforce time-based restrictions on transaktionen.",
            "duration": "45 min",
            "hints": [
              "Handle wrap-around fuer hours crossing midnight",
              "Check elapsed is between min und max delay",
              "Validate hours are 0-23 und min <= max"
            ]
          }
        }
      }
    }
  },
  "solana-pda-mastery": {
    "title": "Programmabgeleitete Adresse Mastery",
    "description": "Master fortgeschritten PDA engineering on Solana: seed schema design, bump handling discipline, und secure cross-program PDA usage at production scale.",
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
        "description": "Build strong PDA foundations mit deterministic derivation, canonical seed composition, und collision-resistant namespace strategy.",
        "lessons": {
          "lesson-50-1-1": {
            "title": "Programmabgeleitete Adressen",
            "content": "Programmabgeleitete Adressen (PDAs) are deterministic authority und state anchors on Solana. Their power comes from predictable derivation; their risk comes from inconsistent seed discipline.\n\nA strong PDA design standard defines:\n1) canonical seed order,\n2) explicit namespace/domain tags,\n3) bump handling rules,\n4) versioning strategy fuer future evolution.\n\nSeed ambiguity is a common source of bugs. If different handlers derive the same concept mit different seed ordering, identity checks become inconsistent und sicherheit assumptions break.\n\nPDA validation should always re-derive expected addresses on the trusted side und compare exact keys before mutating state.\n\nProduction teams should document seed recipes as API contracts. Changing recipes without migration planning can orphan state und break clients.\n\nPDA mastery is mostly discipline: deterministic derivation everywhere, no implicit conventions, no trust in client-provided derivation claims.",
            "duration": "45 min"
          },
          "lesson-50-1-2": {
            "title": "PDA Generator Challenge",
            "content": "Implement PDA generation mit seed validation.",
            "duration": "45 min",
            "hints": [
              "Try bumps from 255 down to 0",
              "Combine seeds, program_id, und bump in hash",
              "Check if derived address matches expected"
            ]
          },
          "lesson-50-1-3": {
            "title": "Seed Composer Challenge",
            "content": "Compose complex seed patterns fuer different use cases.",
            "duration": "45 min",
            "hints": [
              "Use byte string literals b\"...\" fuer static prefixes",
              "Convert integers mit to_le_bytes()",
              "Collect into Vec<Vec<u8>>"
            ]
          },
          "lesson-50-1-4": {
            "title": "Bump Manager Challenge",
            "content": "Manage bump seeds fuer PDA verification und signing.",
            "duration": "45 min",
            "hints": [
              "Compare stored seeds mit expected seeds",
              "Signer seeds include all seeds plus bump",
              "Canonical bump is from find_pda mit highest valid bump"
            ]
          }
        }
      },
      "mod-50-2": {
        "title": "Fortgeschritten PDA Patterns",
        "description": "Implement fortgeschritten PDA patterns (nested/counter/stateful) while preserving sicherheit invariants und migration safety.",
        "lessons": {
          "lesson-50-2-1": {
            "title": "PDA Design Patterns",
            "content": "Fortgeschritten PDA patterns solve real scaling und composability needs but increase design complexity.\n\nNested PDAs, counter-based PDAs, und multi-tenant PDA namespaces each require explicit invariants around uniqueness, lifecycle, und authority boundaries.\n\nKey safeguards:\n- monotonic counters mit replay protection,\n- collision checks in shared namespaces,\n- explicit ownership checks on all derived-state paths,\n- deterministic migration paths when schema/seed versions evolve.\n\nCross-program PDA interactions must minimize signer scope. invoke_signed should only grant exactly what downstream steps require.\n\nOperationally, fortgeschritten PDA systems need deterministic audit artifacts: derivation inputs, expected outputs, und validation results by anweisung path.\n\nComplex PDA architecture is safe when derivation logic remains simple to reason about und impossible to interpret ambiguously.",
            "duration": "45 min"
          },
          "lesson-50-2-2": {
            "title": "Nested PDA Generator Challenge",
            "content": "Generate PDAs derived from other PDA addresses.",
            "duration": "45 min",
            "hints": [
              "Include parent address in child seeds",
              "Use index bytes fuer sibling derivation",
              "Verify by re-deriving und comparing"
            ]
          },
          "lesson-50-2-3": {
            "title": "Counter PDA Generator Challenge",
            "content": "Generate unique PDAs using incrementing counters.",
            "duration": "45 min",
            "hints": [
              "Increment counter after each generation",
              "Use counter in seeds fuer uniqueness",
              "Batch generation calls generate_next multiple times"
            ]
          },
          "lesson-50-2-4": {
            "title": "PDA Collision Detector Challenge",
            "content": "Detect und prevent PDA seed collisions.",
            "duration": "45 min",
            "hints": [
              "Check if seeds match any existing entry",
              "Return error if collision detected",
              "Collision risk if same structure und component sizes"
            ]
          }
        }
      }
    }
  },
  "solana-economics": {
    "title": "Solana Economics und Token Flows",
    "description": "Analyze Solana economic dynamics in production context: inflation/fee-burn interplay, staking flows, supply movement, und protocol sustainability tradeoffs.",
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
        "description": "Understand Solana macro token economics (inflation, burn, rewards, fees) mit deterministic scenario modeling.",
        "lessons": {
          "lesson-51-1-1": {
            "title": "Solana Token Economics",
            "content": "Solana economics is the interaction of issuance, burn, staking rewards, und usage demand. Sustainable protocol decisions require understanding these flows as a system, not isolated metrics.\n\nCore mechanisms include:\n1) inflation schedule und long-term emission behavior,\n2) fee burn und validator reward pathways,\n3) staking participation effects on circulating supply.\n\nEconomic analysis should be scenario-driven. Single-point estimates hide risk. Teams should model calm/high-usage/low-usage regimes und compare supply-pressure outcomes.\n\nDeterministic calculators are useful fuer governance und product planning because they make assumptions explicit: epoch cadence, fee volume, staking ratio, und unlock schedules.\n\nHealthy economic reasoning links network-level flows to protocol-level choices (treasury policy, incentive emissions, fee strategy).\n\nEconomic quality improves when teams publish assumption-driven reports instead of headline narratives.",
            "duration": "45 min"
          },
          "lesson-51-1-2": {
            "title": "Inflation Calculator Challenge",
            "content": "Calculate inflation rate und staking rewards over time.",
            "duration": "45 min",
            "hints": [
              "Use powi fuer disinflation calculation",
              "Compound inflation year over year",
              "APY is inflation divided by staked percentage"
            ]
          },
          "lesson-51-1-3": {
            "title": "Fee Burn Calculator Challenge",
            "content": "Calculate fee burns und their deflationary impact.",
            "duration": "45 min",
            "hints": [
              "Priority multiplier increases mit priority level",
              "Burn is percentage of total fee",
              "Annual estimate is daily * 365"
            ]
          },
          "lesson-51-1-4": {
            "title": "Rent Economics Calculator Challenge",
            "content": "Calculate rent costs und exemption thresholds.",
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
        "description": "Model token flow dynamics und sustainability signals using supply categories, unlock events, und behavior-driven liquidity effects.",
        "lessons": {
          "lesson-51-2-1": {
            "title": "Token Flow Dynamics",
            "content": "Token flow analysis turns abstract economics into operational insight. The key is to track where tokens are (staked, circulating, locked, treasury, pending unlock) und how they move over time.\n\nUseful flow metrics include:\n- net circulating change,\n- staking inflow/outflow trend,\n- unlock cliff concentration,\n- treasury spend velocity.\n\nUnlock events should be modeled fuer market-impact risk. Large clustered unlocks can create short-term supply shock even when long-term tokenomics is sound.\n\nFlow tooling should support deterministic category accounting und conservation checks (total categorized supply consistency).\n\nFuer governance, flow analysis is most valuable when tied to policy actions: adjust emissions, change vesting cadence, alter incentive programs.\n\nSustainable token systems are not static designs; they are continuously monitored flow systems mit explicit policy feedback loops.",
            "duration": "45 min"
          },
          "lesson-51-2-2": {
            "title": "Supply Flow Tracker Challenge",
            "content": "Track token supply categories und flows.",
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
            "content": "Calculate sustainability metrics fuer tokenomics.",
            "duration": "45 min",
            "hints": [
              "Net issuance is inflation minus burn",
              "Burn ratio is burn divided by inflation",
              "Score combines burn ratio und staking ratio"
            ]
          }
        }
      }
    }
  }
};
