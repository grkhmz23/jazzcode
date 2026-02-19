import type { CourseTranslationMap } from "./types";

export const esGeneratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    "title": "Solana Fundamentals",
    "description": "Production-grade introduction para beginners who want clear Solana modelo mentals, stronger transaccion debugging skills, y deterministic cartera-manager workflows.",
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
        "title": "Primeros pasos",
        "description": "Core execution model, cuenta semantics, y transaccion construction patterns you need before writing programs or complex clients.",
        "lessons": {
          "solana-mental-model": {
            "title": "Solana modelo mental",
            "content": "# Solana modelo mental\n\nSolana development gets much easier once you stop thinking in terms of \"contracts that own state\" y start thinking in terms of \"programs that operate on cuentas.\" On Solana, the durable state of your app does not live inside executable code. It lives in cuentas, y every instruccion explicitly says which cuentas it wants to read or write. Programs are stateless logic: they validate inputs, apply rules, y update cuenta data when authorized.\n\nA transaccion is a signed message containing one or more ordered instrucciones. Each instruccion names a target program, the cuentas it needs, y serialized data. The runtime processes those instrucciones in order, y the transaccion is atomic: either all instrucciones succeed, or none are committed. This matters para correctness. If your second instruccion depends on the first instruccion's output, transaccion atomicity guarantees you never end up in a half-applied state.\n\nPara execution validity, several fields matter together: a fee payer, a recent blockhash, instruccion payloads, y all required signatures. The fee payer funds transaccion fees. The recent blockhash gives the message a freshness window, preventing replay of old signed messages. Required signatures prove authorization from signers declared by instruccion cuenta metadata. Missing or invalid signatures cause rejection before instruccion logic runs.\n\nSolana's parallelism comes from cuenta access metadata. Because each instruccion lists read y write cuentas up front, the runtime can schedule non-conflicting transacciones simultaneously. If two transacciones only read the same cuenta, they can run in parallel. If they both write the same cuenta, one must wait. This read/write locking model is a core reason Solana can scale while preserving deterministic outcomes.\n\nWhen reading chain state, you'll also see commitment levels: processed, confirmed, y finalized. Conceptually, processed means observed quickly, confirmed means voted by the cluster, y finalized means rooted deeply enough that rollback risk is minimal. Treat commitment as a consistency/latency trade-off knob, not a fixed-time guarantee.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l1-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l1-q1",
                    "prompt": "What makes Solana state live “in cuentas” rather than “inside contracts”?",
                    "options": [
                      "Programs are stateless logic y cuenta data is passed explicitly to instrucciones",
                      "Programs persist mutable storage internally y only expose events",
                      "Validadores assign storage to whichever program has the most stake"
                    ],
                    "answerIndex": 0,
                    "explanation": "On Solana, mutable app state is cuenta data. Programs validate y mutate those cuentas but do not hold mutable state internally."
                  },
                  {
                    "id": "l1-q2",
                    "prompt": "Which fields make a transaccion valid to execute?",
                    "options": [
                      "Only program IDs y instruccion data",
                      "Fee payer, recent blockhash, signatures, y instrucciones",
                      "A cartera address y a memo string"
                    ],
                    "answerIndex": 1,
                    "explanation": "The runtime checks the message envelope y authorization: fee payer, freshness via blockhash, required signatures, y instruccion payloads."
                  },
                  {
                    "id": "l1-q3",
                    "prompt": "Why does Solana care about read/write cuenta sets?",
                    "options": [
                      "To calculate NFT metadata size",
                      "To schedule non-conflicting transacciones in parallel safely",
                      "To compress signatures on mobile carteras"
                    ],
                    "answerIndex": 1,
                    "explanation": "Read/write sets let the runtime detect conflicts y parallelize independent work deterministically."
                  }
                ]
              }
            ]
          },
          "accounts-model-deep-dive": {
            "title": "Cuentas model analisis profundo",
            "content": "# Cuentas model analisis profundo\n\nEvery on-chain object on Solana is an cuenta con a standard envelope. You can reason about any cuenta using a small set of fields: address, lamports, owner, executable flag, y data bytes length/content. Address (a public key) identifies the cuenta. Lamports represent native SOL balance in the smallest unit (1 SOL = 1,000,000,000 lamports). Owner is the program allowed to modify cuenta data y debit lamports according to runtime rules. Executable indicates whether the cuenta stores runnable program code. Data length tells you how many bytes are allocated para state.\n\nSystem cartera cuentas are usually owned by the System Program y often have `dataLen = 0`. Program cuentas are executable y typically owned by loader/runtime programs, not by your application directly. Token balances do not live directly in cartera cuentas. SPL tokens use dedicated token cuentas, each tied to a specific mint y owner, because token state has its own program-defined layout y rules.\n\nRent-exemption is the practico baseline para persistent storage. The more bytes an cuenta allocates, the higher the minimum lamports needed to keep it alive without rent collection risk. Even if you never inspect binary data manually, cuenta size still affects user costs y protocol economics. Good schema diseno means allocating only what you need y planning upgrades carefully.\n\nOwner semantics are seguridad-critical. If an cuenta claims to be token state but is not owned by the token program, your app should reject it. If an cuenta is executable, treat it as code, not mutable application data. If you understand owner + executable + data length, you can classify most cuenta types quickly y avoid many integration mistakes.\n\nThe fastest way to build confidence is to inspect concrete cuenta examples y explain what each field implies operationally.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "l2-account-explorer",
                "title": "Cuenta Explorer",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "System Cartera Cuenta",
                      "address": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                      "lamports": 2500000000,
                      "owner": "11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    },
                    {
                      "label": "Program Cuenta",
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
                    "prompt": "What does the `owner` field mean on an cuenta?",
                    "options": [
                      "It is the user who paid the creation fee forever",
                      "It is the program authorized to modify cuenta data",
                      "It is always the same as fee payer in the last transaccion"
                    ],
                    "answerIndex": 1,
                    "explanation": "Owner identifies the controlling program para state mutation y many lamport operations."
                  },
                  {
                    "id": "l2-q2",
                    "prompt": "What does `executable: true` indicate?",
                    "options": [
                      "The cuenta can be used as transaccion fee payer",
                      "The cuenta stores runnable program bytecode",
                      "The cuenta can hold any SPL token mint directly"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable cuentas are code containers; they are not ordinary mutable data cuentas."
                  },
                  {
                    "id": "l2-q3",
                    "prompt": "Why are token cuentas separate from cartera cuentas?",
                    "options": [
                      "Cartera cuentas are too small to hold decimals",
                      "Token balances are program-specific state managed by the token program",
                      "Only validadores can read cartera balances"
                    ],
                    "answerIndex": 1,
                    "explanation": "SPL token state uses dedicated cuenta layouts y authorization rules enforced by the token program."
                  }
                ]
              }
            ]
          },
          "transactions-and-instructions": {
            "title": "Transacciones & instrucciones",
            "content": "# Transacciones & instrucciones\n\nAn instruccion is the smallest executable unit on Solana: `programId + account metas + opaque data bytes`. A transaccion wraps one or more instrucciones plus signatures y message metadata. This diseno gives you composability y atomicity in one envelope.\n\nThink of instruccion cuentas as an explicit dependency graph. Each cuenta meta marks whether the cuenta is writable y whether a signature is required. During transaccion execution, the runtime uses those flags para access checks y lock scheduling. If your instruccion tries to mutate an cuenta not marked writable, it fails. If a required signer did not sign, it fails before your program logic runs.\n\nThe transaccion message also carries fee payer y recent blockhash. Fee payer is straightforward: who funds execution. Recent blockhash is subtler: it anchors freshness. Signed messages are replay-resistant because old blockhashes expire. This is why transaccion builders usually fetch a fresh blockhash close to send time.\n\nInstruccion ordering is deterministic y significant. If instruccion B depends on cuenta changes from instruccion A, place A first. If any instruccion fails, the whole transaccion is rolled back. You should diseno multi-step flows con this all-or-nothing behavior in mind.\n\nPara CLI workflow, a healthy baseline is: inspect config, target the right cluster, verify active cartera, y check balance before sending anything. That sequence reduces avoidable errors y improves team reproducibility. In local scripts, log your derived addresses y transaccion summaries so teammates can reason about intent y outcomes.\n\nYou do not need RPC calls to understand this model, but you do need rigor in message construction: explicit cuentas, explicit ordering, explicit signatures, y explicit freshness.\n\n## Why this matters in real apps\n\nWhen production incidents happen, teams usually debug transaccion construction first: wrong signer, wrong writable flag, stale blockhash, or wrong instruccion ordering. Engineers who model transacciones as explicit data structures can diagnose these failures quickly. Engineers who treat transacciones like opaque cartera blobs usually need trial-y-error.\n\n## What you should be able to do after this leccion\n\n- Explain the difference between instruccion-level validation y transaccion-level validation.\n- Predict when two transacciones can execute in parallel y when they will conflict.\n- Build a deterministic pre-send checklist para local scripts y frontend clients.\n",
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
                    "note": "Validate RPC URL y keypair path before sending transacciones."
                  },
                  {
                    "cmd": "solana config set --url devnet",
                    "output": "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com",
                    "note": "Use devnet while learning to avoid accidental mainnet transacciones."
                  },
                  {
                    "cmd": "solana address",
                    "output": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                    "note": "This is your active signer public key."
                  },
                  {
                    "cmd": "solana balance",
                    "output": "1.250000000 SOL",
                    "note": "Pattern only; actual value depends on cartera funding."
                  }
                ]
              }
            ]
          },
          "build-sol-transfer-transaction": {
            "title": "Build a SOL transfer transaccion",
            "content": "# Build a SOL transfer transaccion\n\nImplement a deterministic `buildTransferTx(params)` helper in the project file:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n- Use `@solana/web3.js`\n- Return a transaccion con exactly one `SystemProgram.transfer` instruccion\n- Set `feePayer` y `recentBlockhash` from params\n- No network calls\n\nThis in-page challenge validates your object-shape reasoning. The authoritative checks para Leccion 4 run in repository unit tests, so keep your project implementation aligned con those tests.\n",
            "duration": "35 min",
            "hints": [
              "Keep transaccion construction deterministic: no RPC or random values.",
              "Convert SOL to lamports using 1_000_000_000 multiplier.",
              "Mirror this logic in the real project helper in src/lib/cursos/solana-fundamentals/project/walletManager.ts."
            ]
          }
        }
      },
      "module-programs-and-pdas": {
        "title": "Programs & PDAs",
        "description": "Program behavior, deterministic PDA diseno, y SPL token modelo mentals con practico safety checks.",
        "lessons": {
          "programs-what-they-are": {
            "title": "Programs: what they are (y aren’t)",
            "content": "# Programs: what they are (y aren’t)\n\nA Solana program is executable cuenta code, not an object that secretly owns mutable storage. Your program receives cuentas from the transaccion, verifies constraints, y writes only to cuentas it is authorized to modify. This explicitness is a feature: it keeps data dependencies visible y helps the runtime parallelize safely.\n\nProgram cuentas are marked executable y deployed through loader programs. Upgrades are governed by upgrade authority (when configured), which is why production gobernanza around authority custody matters. If your protocol says it is immutable, users should be able to verify upgrade authority was revoked.\n\nWhat programs are not: they are not ambient state scanners. A program cannot discover arbitrary chain data by itself at runtime. If an cuenta is required, it must be passed in the instruccion cuenta list. This is a foundational seguridad y rendimiento constraint. It prevents hidden state dependencies y makes execution deterministic from the message alone.\n\nInvocacion entre Programas (CPI) is how one program composes con another. During CPI, your program calls into another program, passing cuenta metas y instruccion data. This enables rich composition: token transfers from your app logic, metadata updates, or protocol-to-protocol operations. But CPI also increases failure surface. You must validate assumptions before y after CPI, y you must track which signer y writable privileges are being forwarded.\n\nAt a high level, a robust Solana program follows a pattern: validate signer/owner/seed constraints, deserialize cuenta data, enforce business invariants, perform state transitions, y optionally perform CPI calls. Keeping this pipeline explicit makes audits easier y upgrades safer.\n\nThe practico takeaway: programs are deterministic policy engines over cuentas. If you keep cuenta boundaries clear, many seguridad y correctness questions become mechanical rather than mystical.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l5-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l5-q1",
                    "prompt": "What makes a program cuenta executable?",
                    "options": [
                      "It has a cartera signature on every slot",
                      "Its cuenta metadata marks it executable y stores program bytecode",
                      "It owns at least one token cuenta"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable cuentas are code containers con runtime-recognized executable metadata."
                  },
                  {
                    "id": "l5-q2",
                    "prompt": "Why can’t a program discover arbitrary cuentas without them being passed in?",
                    "options": [
                      "Because cuenta dependencies must be explicit para deterministic execution y lock scheduling",
                      "Because RPC nodes hide cuenta indexes from programs",
                      "Because only fee payers can list cuentas"
                    ],
                    "answerIndex": 0,
                    "explanation": "Cuenta lists are part of the instruccion contract; hidden discovery would break determinism y scheduling assumptions."
                  },
                  {
                    "id": "l5-q3",
                    "prompt": "What is CPI?",
                    "options": [
                      "A client-only simulation mode",
                      "Calling one on-chain program from another on-chain program",
                      "A validador-level rent optimization flag"
                    ],
                    "answerIndex": 1,
                    "explanation": "Invocacion entre Programas is core to Solana composability."
                  }
                ]
              }
            ]
          },
          "program-derived-addresses-pdas": {
            "title": "Direcciones Derivadas de Programa (PDAs)",
            "content": "# Direcciones Derivadas de Programa (PDAs)\n\nA Direccion Derivada de Programa (PDA) is a deterministic cuenta address derived from seeds plus a program ID, con one key property: it is intentionally off-curve, so no private key exists para it. This lets your program control addresses deterministically without requiring a human-held signer.\n\nDerivation starts con seed bytes. Seeds can encode user IDs, mint addresses, version tags, y other namespace components. The runtime appends a bump seed when needed y searches para an off-curve output. The bump is an integer that makes derivation succeed while preserving deterministic reproducibility.\n\nWhy PDAs matter: they make address calculation stable across clients y on-chain logic. If both sides derive the same PDA from the same seed recipe, they can verify identity without extra lookup tables. This powers patterns like per-user state cuentas, escrow vaults, y protocol configuration cuentas.\n\nVerification is straightforward y critical. Off-chain clients derive PDA y include it in instrucciones. On-chain programs derive the expected PDA again y compare against the supplied cuenta key. If mismatch, reject. This closes an entire class of cuenta-substitution attacks.\n\nWho signs para a PDA? Not a cartera. The program can authorize as PDA during CPI by using invoke_signed con the exact seed set y bump. Conceptually, runtime verifies the derivation proof y grants signer semantics to that PDA para the invoked instruccion.\n\nChanging any seed value changes the derived PDA. This is both feature y footgun: excellent para namespacing, dangerous if you accidentally alter seed encoding rules between versions. Keep seed schemas explicit, versioned, y documented.\n\nIn short: PDAs are deterministic, non-keypair addresses that let programs model authority y state structure cleanly.\n",
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
                      "They avoid all cuenta rent costs",
                      "They replace transaccion signatures entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "PDAs provide deterministic program-controlled addresses con no corresponding private key."
                  },
                  {
                    "id": "l6-q2",
                    "prompt": "Who signs para a PDA in CPI flows?",
                    "options": [
                      "Any cartera holding SOL",
                      "The runtime on behalf of the program when invoke_signed seeds match",
                      "Only the fee payer of the outer transaccion"
                    ],
                    "answerIndex": 1,
                    "explanation": "invoke_signed proves seed derivation to runtime, which grants PDA signer semantics para that invocation."
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
            "title": "SPL Tokens fundamentos",
            "content": "# SPL Tokens fundamentos\n\nSPL Token is Solana’s standard token program family para fungible assets. A token mint cuenta defines token-level configuration: decimals, total supply accounting, y authorities such as mint authority or freeze authority. A mint does not store each user’s balance directly. Balances live in token cuentas.\n\nAssociated Token Cuentas (ATAs) are the default token-cuenta convention: one canonical token cuenta per (owner, mint) pair. This convention simplifies UX y interoperability because carteras y protocols can derive the expected cuenta location without extra indexing.\n\nA common principiante mistake is treating cartera addresses as token balance containers. Native SOL lives on system cuentas, but SPL token balances live on token cuentas owned by the token program. That means transfers move balances between token cuentas, not directly from cartera pubkey to cartera pubkey.\n\nAuthority diseno matters. Mint authority controls token issuance. Freeze authority can halt movement in specific designs. Removing or gobernanza-wrapping authorities is a major trust signal in production deployments. If authority policies are unclear, integration risk rises quickly.\n\nThe token model also supports extension pathways. Token-2022 introduces optional features such as transfer fees y additional metadata/behavior controls. You do not need Token-2022 to understand fundamentals, but you should know it exists so you can avoid assuming every token mint behaves exactly like legacy SPL Token defaults.\n\nOperationally, safe token logic means: verify mint, verify owner program, verify ATA derivation where expected, y reason about authorities before trusting balances or transfer permissions.\n\nOnce you internalize mint vs token-cuenta separation y authority boundaries, most SPL token flows become predictable y debuggable.\n",
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
                      "A deterministic token cuenta para a specific owner + mint pair",
                      "A validador vote cuenta con token metadata",
                      "A compressed NFT ledger entry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Associated Token Cuentas standardize where fungible token balances are stored para each owner/mint."
                  },
                  {
                    "id": "l7-q2",
                    "prompt": "Why is cartera address != token cuenta?",
                    "options": [
                      "Carteras can only hold SOL while token balances are separate program-owned cuentas",
                      "Token cuentas are deprecated y optional",
                      "Cartera addresses are private keys, token cuentas are public keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL balances are state in token cuentas, not direct fields on cartera system cuentas."
                  },
                  {
                    "id": "l7-q3",
                    "prompt": "What authority controls minting?",
                    "options": [
                      "Recent blockhash authority",
                      "Mint authority configured on the mint cuenta",
                      "Any cuenta con enough lamports"
                    ],
                    "answerIndex": 1,
                    "explanation": "Mint authority is the explicit permission holder para issuing additional supply."
                  }
                ]
              }
            ]
          },
          "wallet-manager-cli-sim": {
            "title": "Cartera Manager CLI-sim",
            "content": "# Cartera Manager CLI-sim\n\nImplement a deterministic CLI parser + command executor in:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n\nRequired behavior:\n\n- `address` prints the active pubkey\n- `build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>` prints stable JSON:\n  `{ from, to, lamports, feePayer, recentBlockhash, instructionProgramId }`\n\nNo network calls. Keep key order stable in output JSON. Repository tests validate this leccion's deterministic behavior.\n",
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
    "description": "Project-journey curso para developers moving from fundamentos to real Anchor engineering: deterministic modelo de cuentasing, instruccion builders, pruebas discipline, y reliable client UX.",
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
        "title": "Anchor Fundamentos",
        "description": "Anchor architecture, cuenta constraints, y PDA foundations con explicit ownership of seguridad-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modelo mental",
            "content": "# Anchor modelo mental\n\nAnchor is best understood as a contract between three layers that must agree on shape: your Rust handlers, generated interface metadata (IDL), y client-side instruccion builders. In raw Solana programs you manually decode bytes, manually validate cuentas, y manually return compact error numbers. Anchor keeps the same runtime model but moves repetitive work into declarations. You still define seguridad-critical behavior, yet you do it through explicit cuenta structs, constraints, y typed instruccion arguments.\n\nThe `#[program]` modulo is where instruccion handlers live. Each function gets a typed `Context<T>` plus explicit arguments. The corresponding `#[derive(Accounts)]` struct tells Anchor exactly what cuentas must be provided y what checks happen before handler logic executes. This includes signer requirements, mutability, PDA seed verification, ownership checks, y relational checks like `has_one`. If validation fails, the transaccion aborts before touching your business logic.\n\nIDL is the bridge that makes the developer experience consistent across Rust y TypeScript. It describes instruccion names, args, cuentas, events, y custom errors. Clients can generate typed methods from that shape, reducing drift between frontend code y on-chain interfaces. When teams ship fast, drift is a common failure mode: wrong cuenta ordering, stale discriminators, or stale arg names. IDL-driven clients make those mistakes less likely.\n\nProvider y cartera concepts complete the flow. The provider wraps an RPC connection plus signer abstraction y commitment preferences. It does not replace cartera seguridad, but it centralizes transaccion send/confirm behavior y test setup. In practice, production reliability comes from understanding this boundary: Anchor helps con ergonomics y consistency, but you still own protocol invariants, cuenta diseno, y threat modeling.\n\nPara this curso, treat Anchor as a typed instruccion framework on top of Solana’s explicit cuenta runtime. That framing lets you reason clearly about what is generated, what remains your responsibility, y how to test deterministic pieces without needing devnet in CI.\n\n## What Anchor gives you vs what it does not\n\nAnchor gives you: typed cuenta contexts, standardized serialization, structured errors, y IDL-driven client ergonomics. Anchor does not give you: automatic business safety, correct authority diseno, or threat modeling. Those are still protocol engineering decisions.\n\n## By the end of this leccion\n\n- You can explain the Rust handler -> IDL -> client flow without hand-waving.\n- You can identify which checks belong in cuenta constraints versus handler logic.\n- You can debug IDL drift issues (wrong cuenta order, stale args, stale client bindings).\n",
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
                      "IDL metadata, cuenta validation glue, y client-facing interface structure",
                      "Validador hardware configuration y consensus votes",
                      "Automatic PDA funding from devnet faucets"
                    ],
                    "answerIndex": 0,
                    "explanation": "Anchor generates serialization/validation scaffolding y IDL contracts, not validador-level behavior."
                  },
                  {
                    "id": "anchor-l1-q2",
                    "prompt": "What is an IDL y who uses it?",
                    "options": [
                      "A JSON interface used by clients/tests/tooling to call your program correctly",
                      "A private key format used only by on-chain programs",
                      "A token mint extension required para CPI"
                    ],
                    "answerIndex": 0,
                    "explanation": "IDL is interface metadata consumed by clients y tools to reduce instruccion/cuenta drift."
                  }
                ]
              }
            ]
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Cuentas, constraints, y safety",
            "content": "# Cuentas, constraints, y safety\n\nMost serious Solana vulnerabilities come from cuenta validation mistakes, not from arithmetic. Anchor’s constraint system exists to turn those checks into declarative, auditable rules. You declare intent in the cuenta context, y the framework enforces it before instruccion logic runs. This means your handlers can focus on state transitions while constraints guard the perimeter.\n\nStart con core markers: `Signer<'info>` proves signature authority, y `#[account(mut)]` declares state can change. Forgetting `mut` produces runtime failures because Solana locks cuenta writability up front. This is not cosmetic metadata; it is part of execution scheduling y safety. Then ownership checks ensure an cuenta belongs to the expected program. If a malicious user passes an cuenta that has the same bytes but wrong owner, strong ownership constraints stop cuenta substitution attacks.\n\nPDA constraints con `seeds` y `bump` verify deterministic cuenta identity. Instead of trusting a user-provided address, you define the derivation recipe y compare runtime inputs against it. This pattern prevents attackers from redirecting logic to arbitrary writable cuentas. `has_one` links cuenta relationships, such as enforcing `counter.authority == authority.key()`. That relation check is simple but high leverage: it prevents privileged actions from being executed by unrelated signers.\n\nAnchor also supports custom `constraint = ...` expressions para protocol invariants, like minimum collateral or authority domain rules. Use these sparingly but deliberately: put invariant checks near cuenta definitions when they are structural, y keep business flow checks in handlers when they depend on instruccion arguments or prior state.\n\nA practico review checklist: verify every mutable cuenta has an explicit reason to be mutable; verify every signer is necessary; verify every PDA seed recipe is stable y versioned; verify ownership checks are present where parsing assumes specific layout; verify relational constraints (`has_one`) para privileged paths. Seguridad here is explicitness. Constraints do not remove responsibility, but they make responsibility visible y testable.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l2-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l2-q1",
                    "prompt": "What does `#[cuenta(mut)]` signal to the runtime y framework?",
                    "options": [
                      "The cuenta may be written during execution y must be requested writable",
                      "The cuenta is owned by the system program",
                      "The cuenta is always a signer"
                    ],
                    "answerIndex": 0,
                    "explanation": "Mutability is part of cuenta metadata y lock planning, not a cosmetic annotation."
                  },
                  {
                    "id": "anchor-l2-q2",
                    "prompt": "What is a seeds constraint verifying?",
                    "options": [
                      "That the provided cuenta key matches deterministic PDA derivation rules",
                      "That the cuenta has maximum rent",
                      "That a token mint has 9 decimals"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seeds + bump ensure deterministic cuenta identity y block cuenta-substitution vectors."
                  }
                ]
              }
            ]
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
            "content": "# PDAs in Anchor\n\nDirecciones Derivadas de Programa are the backbone of predictable cuenta topology in Anchor applications. A PDA is derived from seed bytes plus program ID y intentionally lives off the ed25519 curve, so no private key exists para it. This lets your program control authority para deterministic addresses through `invoke_signed` semantics while keeping user keypairs out of the trust path.\n\nIn Anchor, PDA derivation logic appears in cuenta constraints. Typical patterns look like `seeds = [b\"counter\", authority.key().as_ref()], bump`. This expresses three things at once: namespace (`counter`), ownership relation (authority), y uniqueness under your program ID. The `bump` value is the extra byte required to land off-curve. You can compute it on demand con Anchor, or store it in cuenta state para future CPI convenience.\n\nShould you store bump or always re-derive? Re-deriving keeps state smaller y avoids stale bump fields if derivation recipes ever evolve. Storing bump can simplify downstream instruccion construction y reduce repeated derivation cost. In practice, many production programs store bump when they expect frequent PDA signing calls y keep the seed recipe immutable. Whichever path you choose, document it y test it.\n\nSeed schema discipline matters. If you silently change seed ordering, text encoding, or domain tags, you derive different addresses y break cuenta continuity. Teams usually treat seeds as protocol versioned API: include explicit namespace tags, stable byte encoding rules, y migration plans when evolution is unavoidable.\n\nPara this project journey, we will derive a counter PDA from authority + static domain seed y use that address in both init y increment instruccion builders. The goal is to make cuenta identity deterministic, inspectable, y testable without network dependencies. You can then layer real transaccion sending later, confident that cuenta y data layouts are already correct.\n",
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
                      "It is signed directly by validadores"
                    ],
                    "answerIndex": 0,
                    "explanation": "Off-curve means no user-held private key exists; programs authorize via seed proofs."
                  },
                  {
                    "id": "anchor-l3-q2",
                    "prompt": "What breaks if you change one PDA seed value?",
                    "options": [
                      "You derive a different address y can orphan existing state",
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
            "content": "# Initialize Counter PDA (deterministic)\n\nImplement deterministic helper functions para a Counter project:\n\n- `deriveCounterPda(programId, authorityPubkey)`\n- `buildInitCounterIx(params)`\n\nThis leccion validates client-side reasoning without RPC calls. Your output must include stable PDA + bump shape, key signer/writable metadata, y deterministic init instruccion bytes.\n\nNotes:\n- Keep cuenta key ordering stable.\n- Use the fixed init discriminator bytes from the leccion hints.\n- Return deterministic JSON in `run(input)` so tests can compare exact output.\n",
            "duration": "35 min",
            "hints": [
              "Use a deterministic hash-like reducer over programId + authorityPubkey + static seed.",
              "The init instruccion must include four keys in fixed order: counter PDA, authority, payer, system program.",
              "Encode instruccion data as [73,78,73,84,95,67,84,82,bump] so tests can compare exactly."
            ]
          }
        }
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, Cuentas, y Pruebas",
        "description": "Deterministic instruccion builders, stable state emulation, y pruebas strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment instruccion builder + state layout",
            "content": "# Increment instruccion builder + state layout\n\nImplement deterministic increment behavior in pure TypeScript:\n\n- Build a reusable state representation para counter data.\n- Implement `applyIncrement` as a pure transition function.\n- Enforce explicit overflow behavior (`Counter overflow` error).\n\nThis challenge focuses on deterministic correctness of state transitions, not network execution.\n",
            "duration": "35 min",
            "hints": [
              "Represent state as a pure JS structure so increment can be deterministic in tests.",
              "Return a new state object from applyIncrement; avoid mutating the input object in-place.",
              "Para this challenge, overflow should throw \"Counter overflow\" when count is 4294967295."
            ]
          },
          "anchor-testing-without-flakiness": {
            "title": "Pruebas strategy without flakiness",
            "content": "# Pruebas strategy without flakiness\n\nA reliable Solana curriculum should teach deterministic engineering first, then optional network integration. Flaky tests are usually caused by external dependencies: RPC latency, faucet limits, cluster state drift, blockhash expiry, y cartera setup mismatch. These are real operational concerns, but they should not block learning core protocol logic.\n\nPara Anchor projects, split pruebas into layers. Unit tests validate data layout, discriminator bytes, PDA derivation, cuenta key ordering, y instruccion payload encoding. These tests are fast y deterministic. They can run in CI without validador or internet. If they fail, the error usually points to a real bug in serialization or cuenta metadata.\n\nIntegration tests add runtime behavior: transaccion simulation, cuenta creation, CPI paths, y event assertions. These are valuable but more fragile. Keep them focused y avoid making every PR depend on remote cluster health. Use local validador or controlled environment when possible, y treat external devnet tests as optional confidence checks rather than gatekeeping checks.\n\nWhen writing deterministic tests, prefer explicit expected values y fixed key ordering. Para example, assert exact JSON output con stable key order para summaries, assert exact byte arrays para instruccion discriminators, y assert exact signer/writable flags in cuenta metas. These checks catch regressions that broad snapshot tests can miss.\n\nAlso test failure paths intentionally: overflow behavior, invalid pubkeys, wrong argument shapes, y stale cuenta discriminators. Production incidents often happen on edge paths that had no tests.\n\nA practico rule: unit tests should prove your client y serialization logic are correct independent of chain conditions. Integration tests should prove network workflows behave when environment is healthy. Keeping this boundary clear gives you both speed y confidence.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l6-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l6-q1",
                    "prompt": "What belongs in deterministic unit tests para Anchor clients?",
                    "options": [
                      "PDA derivation, instruccion bytes, y cuenta key metadata",
                      "Devnet faucet reliability y slot timings",
                      "Validador gossip propagation speed"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic unit tests should validate pure logic y serialization boundaries."
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
            "content": "# Client composition & UX\n\nOnce instruccion layouts y PDA logic are deterministic, client integration becomes a composition exercise: cartera adapter para signing, provider/connection para transport, transaccion builder para instruccion packing, y UI state para pending/success/error handling. Anchor helps by keeping cuenta schemas y instruccion names aligned via IDL, but robust UX still depends on clear boundaries.\n\nA typical flow is: derive addresses, build instruccion, create transaccion, set fee payer y recent blockhash, request cartera signature, send raw transaccion, then confirm con chosen commitment. Each stage can fail para different reasons. If your UI collapses all failures into one generic message, users cannot recover y developers cannot debug quickly.\n\nSimulation failures usually mean cuenta metadata mismatch, invalid instruccion data, missing signer, wrong owner program, or constraint violations. Signature errors indicate cartera/user path issues. Blockhash errors are freshness issues. Insufficient funds often involve fee payer SOL balance, not just business cuenta balances. Mapping these classes to actionable errors improves trust y reduces support load.\n\nFee payer deserves explicit UX. The user may authorize a transaccion but still fail because payer lacks lamports para fees or rent. Surfacing fee payer y estimated cost before signing avoids confusion. Para multi-party flows, make fee policy explicit.\n\nPara this curso project, we keep deterministic logic in pure helpers y treat network send/confirm as optional outer layer. That architecture gives you stable local tests while still enabling production integration later. If a network call fails, you can quickly isolate whether the bug is in deterministic instruccion construction or in runtime environment state.\n\nIn short: robust Anchor UX is not one API call. It is a staged pipeline con clear error taxonomy, explicit payer semantics, y deterministic inner logic that can be tested without chain access.\n",
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
                      "Because cuenta constraints, owners, y instruccion bytes can be invalid",
                      "Because the cartera signature always expires immediately",
                      "Because fee payer is irrelevant"
                    ],
                    "answerIndex": 0,
                    "explanation": "Simulation catches cuenta y instruccion-level issues before final network commitment."
                  },
                  {
                    "id": "anchor-l7-q2",
                    "prompt": "What does fee payer mean in client transaccion UX?",
                    "options": [
                      "The cuenta funding transaccion fees/rent-sensitive operations",
                      "The cuenta that stores all token balances directly",
                      "The cuenta that sets RPC endpoint"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee payer funds execution costs y must have sufficient SOL."
                  }
                ]
              }
            ]
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
            "content": "# Counter project checkpoint\n\nCompose the full deterministic flow:\n\n1. Derive counter PDA from authority + program ID.\n2. Build init instruccion metadata.\n3. Build increment instruccion metadata.\n4. Emulate state transitions: `init -> increment -> increment`.\n5. Return stable JSON summary in exact key order:\n\n`{ authority, pda, initIxProgramId, initKeys, incrementKeys, finalCount }`\n\nNo network calls. All checks are strict string matches.\n",
            "duration": "45 min",
            "hints": [
              "Compose the checkpoint from deterministic helper functions to keep output stable.",
              "Use fixed key order y fixed JSON key order to satisfy strict expected output matching.",
              "The emulator sequence para this checkpoint is init -> increment -> increment, so finalCount should be 2."
            ]
          }
        }
      }
    }
  },
  "solana-frontend": {
    "title": "Solana Frontend Development",
    "description": "Project-journey curso para frontend engineers who want production-ready Solana dashboards: deterministic reducers, replayable event pipelines, y trustworthy transaccion UX.",
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
        "title": "Frontend Fundamentals para Solana",
        "description": "Model cartera/cuenta state correctly, diseno transaccion lifecycle UX, y enforce deterministic correctness rules para replayable debugging.",
        "lessons": {
          "frontend-v2-wallet-state-accounts-model": {
            "title": "Cartera state + cuentas modelo mental para UI devs",
            "content": "# Cartera state + cuentas modelo mental para UI devs\n\nMost Solana frontend bugs are not visual bugs. They are model bugs. A dashboard can look polished while silently computing balances from the wrong cuenta class, mixing lamports con token units, or treating temporary pending state as confirmed truth. The first production-grade skill is to build a strict modelo mental y enforce it in code. Cartera address, system cuenta balance, token cuenta balance, y position value are related but not interchangeable.\n\nA connected cartera gives your app identity y signature capability. It does not directly provide full portfolio state. Native SOL lives on the cartera system cuenta in lamports, while SPL balances live in token cuentas, often associated token cuentas (ATAs). If your state shape does not represent this distinction explicitly, downstream logic becomes fragile. Para example, transfer previews might show a cartera address as a token destination, but execution requires token cuenta addresses. Good frontends represent these as separate types y derive display labels from those types.\n\nPrecision is equally important. Lamports y token amounts should remain integer strings in your model layer. UI formatting can convert those values para display, but business logic should avoid float math to prevent drift y non-deterministic tests. This curso uses deterministic fixtures y fixed-scale arithmetic because reproducibility is essential para debugging. If one engineer sees \\\"5.000001\\\" y another sees \\\"5.000000\\\" para the same payload, your incident response becomes noise.\n\nState ownership is another common failure point. Portfolio views often merge data from event streams, cached fetches, y optimistic transaccion journals. Without clear precedence rules, you can double-count transfers or overwrite fresh data con stale cache entries. A robust model treats each input as an event y computes derived state through deterministic reducers. That approach gives you replayability: when a bug appears, you can replay the exact event sequence y inspect every transition.\n\nA production dashboard also needs explicit error classes para parsing y modeling. Invalid mint metadata, malformed amount strings, or missing ATA links should produce typed failures, not silent fallback behavior. Silent fallbacks feel user-friendly in the short term, but they hide corruption that later appears as impossible balances or broken transfers.\n\nFinally, cartera state should include confidence metadata. Is this balance from confirmed events? From optimistic local prediction? From replay snapshot N? Confidence-aware UX prevents overclaiming y helps users understand why values may shift.\n\n## Practico modelo mental map\n\nKeep four layers explicit:\n1. Identity layer (cartera, signer, session metadata).\n2. State layer (system cuentas, token cuentas, mint metadata).\n3. Event layer (journal entries, corrections, dedupe keys, confidence).\n4. View layer (formatted balances, sorted rows, UX status labels).\n\nWhen these layers blur together, bugs look random. When they stay separate, you can isolate failures quickly.\n\n## Pitfall: treating cartera pubkey as the universal balance location\n\nCartera pubkey identifies a user, but SPL balances live in token cuentas. If you collapse the two, transfer builders, explorers, y reconciliation logic diverge.\n\n## Production Checklist\n\n1. Keep lamports y token amounts as integer strings in core model.\n2. Represent cartera address, ATA address, y mint address as separate fields.\n3. Derive UI values from deterministic reducers, not ad-hoc component state.\n4. Attach confidence metadata to displayed balances.\n5. Emit typed parser/model errors instead of silent defaults.\n",
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
                      "In token cuentas (typically ATAs), not directly in the cartera system cuenta",
                      "In the cartera system cuenta lamports field",
                      "Inside the transaccion signature"
                    ],
                    "answerIndex": 0,
                    "explanation": "Cartera identity y token balance storage are different model layers in Solana."
                  },
                  {
                    "id": "frontend-v2-l1-q2",
                    "prompt": "Why keep raw amounts as integer strings in model code?",
                    "options": [
                      "To avoid non-deterministic floating-point drift in reducers y tests",
                      "Because carteras only accept strings",
                      "Because decimals are always 9"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic arithmetic y replay debugging depend on precise integer state."
                  }
                ]
              }
            ]
          },
          "frontend-v2-transaction-lifecycle-ui": {
            "title": "Transaccion lifecycle para UI: pending/confirmed/finalized, optimistic UI",
            "content": "# Transaccion lifecycle para UI: pending/confirmed/finalized, optimistic UI\n\nFrontend transaccion UX is a state machine problem. Users press one button, but your app traverses multiple phases: intent creation, transaccion construction, signature request, submission, y confirmation at one or more commitment levels. If these phases are collapsed into one boolean \\\"loading\\\" flag, you lose correctness y your recovery paths become guesswork.\n\nThe lifecycle starts con deterministic planning. Before any cartera popup, construct a serializable transaccion intent: cuentas, amounts, expected side effects, y idempotency key. This intent should be inspectable y testable without network access. In production, this split pays off because many failures happen before send: invalid cuenta metas, stale assumptions about ATAs, wrong decimals, or malformed instruccion payloads. A deterministic planner catches these early y produces actionable errors.\n\nAfter signing, submission moves the transaccion into a pending state. Pending means the network may or may not accept execution. Your UI can use optimistic overlays, but optimistic updates should be scoped y reversible. Para example, show \\\"pending transfer\\\" in activity feed immediately, but avoid mutating durable balance totals until at least confirmed commitment. If you mutate balances too early, user trust drops when signature rejection or simulation failure occurs.\n\nCommitment levels should be modeled explicitly. \\\"processed\\\" provides quick feedback, \\\"confirmed\\\" provides stronger confidence, y \\\"finalized\\\" is strongest. You do not need to promise exact timing. You do need to communicate confidence boundaries clearly. A common production bug is labeling processed as final y then rendering inconsistent data during cluster stress.\n\nOptimistic rollback is often neglected. Every optimistic action needs a rollback rule keyed by idempotency token. If confirmation fails, rollback should remove optimistic journal entries y restore derived state by replaying deterministic events. This is why event-driven state models are practico para frontend apps: they make rollback a replay operation instead of imperative patchwork.\n\nTelemetry should also be phase-specific. Log whether failures happen in build, sign, send, or confirm. Group by cartera type, program ID, y error class. This lets teams distinguish infrastructure incidents from modeling bugs.\n\n## Pitfall: over-writing confirmed state con stale optimistic assumptions\n\nOptimistic state should be additive y reversible. If optimistic patches directly replace canonical state, delayed confirmations or failures create confusing balance jumps.\n\n## Production Checklist\n\n1. Model transaccion lifecycle as explicit states, not one loading flag.\n2. Keep deterministic planner output separate from cartera/RPC adapter layer.\n3. Track optimistic entries con idempotency keys y rollback rules.\n4. Label commitment confidence in UI copy.\n5. Emit phase-specific telemetry para build/sign/send/confirm.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "frontend-v2-l2-account-explorer",
                "title": "Lifecycle Cuentas Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Fee Payer System Cuenta",
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
                    "prompt": "What is the safest use of optimistic UI para token transfers?",
                    "options": [
                      "Show pending overlays first, mutate durable balances only after stronger confirmation",
                      "Immediately mutate all balances y ignore rollback",
                      "Disable activity feed until finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Optimistic overlays are useful, but confirmed state must remain authoritative."
                  },
                  {
                    "id": "frontend-v2-l2-q2",
                    "prompt": "Why track transaccion phases separately in telemetry?",
                    "options": [
                      "To isolate modeling failures from cartera y network failures",
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
            "content": "# Data correctness: dedupe, ordering, idempotency, correction events\n\nFrontend teams frequently assume event streams are perfectly ordered y unique. Production systems rarely behave that way. You can receive duplicate events, out-of-order events, delayed price updates, y correction signals that invalidate earlier records. If your reducer assumes ideal sequencing, dashboard totals drift y support incidents become hard to reproduce.\n\nDeterministic ordering is the first control. In this curso we replay events by (ts, id). Timestamp alone is insufficient because equal timestamps are common in batched systems. A deterministic tie-breaker gives every engineer y CI runner the same final state.\n\nIdempotency is the second control. Each event id should be applied at most once. If the same id appears twice, state must not change after the first apply. This rule protects against retries, websocket reconnect bursts, y duplicate queue deliveries.\n\nCorrection handling is the third control. A correction event references an earlier event id y signals that its effect should be removed. You can implement this by replaying from journal con corrected ids excluded, or by inverse operations when your model supports exact inverses. Replay is slower but simpler y safer para educational deterministic engines.\n\nHistory modeling deserves attention too. Users need recent activity, but history should not become an unstructured debug dump. Each history row should include event id, timestamp, type, y concise summary. If corrected events remain visible, label them explicitly so users y support staff understand why balances changed.\n\nAnother correctness risk is cross-domain ordering. Token events y price events may arrive at different rates. Value calculations should depend on the latest known price per mint y should never use transient float conversions. Fixed-scale integer math avoids rounding divergence across environments.\n\nWhen reducers are deterministic y replayable, regression pruebas improves dramatically. You can compare snapshots after every N events, compute checksums, y verify that refactors preserve behavior. This style catches subtle bugs earlier than end-to-end tests.\n\nFinally, correctness is not only code. It is product communication. If corrections can alter history, UI should surface that possibility in copy y state labels. Hiding it creates the appearance of randomness.\n\n## Pitfall: applying out-of-order events directly to live state without replay\n\nApplying arrivals as-is can produce transiently wrong balances y non-reproducible bugs. Deterministic replay gives consistent outcomes y auditable transitions.\n\n## Production Checklist\n\n1. Sort replay by deterministic keys (ts, id).\n2. Deduplicate by event id before applying transitions.\n3. Support correction events that remove prior effects.\n4. Keep history rows explicit y correction-aware.\n5. Use fixed-scale arithmetic para value calculations.\n",
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
                      "It provides deterministic tie-breaking para equal timestamps",
                      "It removes the need para deduplication",
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
                      "Apply both y average balances",
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
            "content": "# Build core state model + reducer from events\n\nImplement a deterministic reducer para dashboard state:\n- apply event stream transitions para balances y mint metadata\n- enforce idempotency by event id\n- support correction markers para replaced events\n- emit stable history summaries\n",
            "duration": "35 min",
            "hints": [
              "Sort by (ts, id) before applying events.",
              "If event id already exists in eventsApplied, skip it para idempotency.",
              "Corrections should mark replaced event ids y remove their effects from state transitions."
            ]
          }
        }
      },
      "frontend-v2-module-token-dashboard": {
        "title": "Token Dashboard Project",
        "description": "Build reducer, replay snapshots, query metrics, y deterministic dashboard outputs that remain stable under partial or delayed data.",
        "lessons": {
          "frontend-v2-stream-replay-snapshots": {
            "title": "Implement event stream simulator + replay timeline + snapshots",
            "content": "# Implement event stream simulator + replay timeline + snapshots\n\nBuild deterministic replay tooling:\n- replay sorted events by (ts, id)\n- snapshot every N applied events\n- compute stable checksum para replay output\n- return { finalState, snapshots, checksum }\n",
            "duration": "35 min",
            "hints": [
              "Determinism starts con sorting by ts then id.",
              "Deduplicate by event id before snapshot interval checks.",
              "Build checksum from stable snapshot metadata, not random values."
            ]
          },
          "frontend-v2-query-layer-metrics": {
            "title": "Implement query layer + computed metrics",
            "content": "# Implement query layer + computed metrics\n\nImplement dashboard query/view logic:\n- search/filter/sort rows deterministically\n- compute total y row valueUsd con fixed-scale integer math\n- expose stable view model para UI rendering\n",
            "duration": "35 min",
            "hints": [
              "Use fixed-scale integers (micro USD) instead of floating point.",
              "Apply filter -> search -> sort in a deterministic order.",
              "Break sort ties by mint para stable output."
            ]
          },
          "frontend-v2-production-ux-hardening": {
            "title": "Production UX: caching, pagination, error banners, skeletons, rate limits",
            "content": "# Production UX: caching, pagination, error banners, skeletons, rate limits\n\nAfter model correctness, frontend quality is mostly about user trust under imperfect conditions. Users do not evaluate your dashboard by clean demo paths. They evaluate it when data is delayed, partial, duplicated, or rejected. Production UX hardening means making those states understandable y recoverable.\n\nCaching strategy should be explicit. Event snapshots, derived views, y summary cards should have clear freshness rules. A stale-but-marked cache is often better than blank loading screens, but stale data must never masquerade as confirmed current data. Include freshness timestamps y, when possible, source confidence labels (cached, replayed, confirmed).\n\nPagination y virtualized lists need deterministic sorting to avoid row jumps between pages. If sort keys are unstable, users see items move unexpectedly as new events arrive. Use primary y secondary stable keys, y preserve cursor semantics during live updates.\n\nError banners should be scoped by subsystem. Parser errors are not network errors. Replay checksum mismatches are not cartera signature errors. Distinct error classes reduce panic y help users choose next actions. A generic red toast that says \\\"something went wrong\\\" is operationally expensive.\n\nSkeleton states must communicate structure rather than fake certainty. Show placeholder rows y chart bounds, but avoid hardcoding values that look real. If users screen-record issues, misleading skeletons complicate incident investigation.\n\nRate limits are common in real dashboards, even con private APIs. Your UI should surface backoff state y avoid firehose re-requests from multiple components. Centralize data fetching y de-duplicate in-flight requests by key. This prevents self-inflicted throttling.\n\nLive mode y replay mode should share the same reducer y query pipeline. Live mode streams events progressively; replay mode applies fixture timelines deterministically. If these modes use different code paths, bugs hide in mode-specific branches y become hard to reproduce.\n\nA practico approach is to store event journal y snapshots, then render all UI from derived selectors. This architecture supports recoverability: you can reset to snapshot N, replay events, y inspect differences. It also supports support tooling: attach snapshot checksum y model version to error reports.\n\n### Devnet Bonus (optional)\n\nYou can add an RPC adapter behind a feature flag y map live cuenta updates into the same event format. Keep this optional y never required para core correctness.\n\n## Pitfall: shipping polished visuals con unscoped failure states\n\nIf users cannot tell whether an issue is stale cache, parse failure, or upstream throttle, confidence erodes even when core model logic is correct.\n\n## Production Checklist\n\n1. Expose freshness metadata para cached y live data.\n2. Keep list sorting deterministic across pagination.\n3. Classify errors by subsystem con actionable copy.\n4. De-duplicate in-flight fetches y respect rate limits.\n5. Render live y replay modes through shared reducer/selectors.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l7-q1",
                    "prompt": "Why should live mode y replay mode share the same reducer pipeline?",
                    "options": [
                      "To keep behavior reproducible y avoid mode-specific correctness drift",
                      "To reduce CSS size only",
                      "Because rate limits require it"
                    ],
                    "answerIndex": 0,
                    "explanation": "Shared deterministic logic makes incident replay y pruebas reliable."
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
                    "explanation": "Phase- y subsystem-specific failures require different user guidance."
                  }
                ]
              }
            ]
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            "title": "Emit stable DashboardSummary from fixtures",
            "content": "# Emit stable DashboardSummary from fixtures\n\nCompose deterministic checkpoint output:\n- owner, token count, totalValueUsd\n- top tokens sorted deterministically\n- recent activity rows\n- invariants y determinism metadata (fixture hash + model version)\n",
            "duration": "45 min",
            "hints": [
              "Emit JSON keys in a fixed order para stable snapshots.",
              "Sort top tokens deterministically con tie breakers.",
              "Include modelVersion y fixtureHash in determinism metadata."
            ]
          }
        }
      }
    }
  },
  "defi-solana": {
    "title": "DeFi on Solana",
    "description": "Avanzado project-journey curso para engineers building swap systems: deterministic offline Jupiter-style planning, route ranking, minOut safety, y reproducible diagnostics.",
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
        "description": "Understand CPMM math, quote anatomy, y deterministic routing tradeoffs con safety-first user protections.",
        "lessons": {
          "defi-v2-amm-basics-fees-slippage-impact": {
            "title": "AMM fundamentos on Solana: pools, fees, slippage, y impacto de precio",
            "content": "# AMM fundamentos on Solana: pools, fees, slippage, y impacto de precio\n\nWhen users click “Swap,” they usually assume there is one objective truth: the current price. In practice, frontend swap systems compute an estimate from pool reserves y route assumptions. The estimate can be excellent, but it is still a model. DeFi UI quality depends on how honestly y consistently that model is represented.\n\nIn a constant-product AMM, each pool maintains an invariant close to x * y = k. A swap changes reserves asymmetrically, y the output amount is non-linear relative to input size. Small trades can track spot estimates closely, while larger trades move further along the curve y experience more impact. That non-linearity is why frontend code must never compare routes using only “price per token” labels. You need route-aware output calculations at the target trade size.\n\nOn Solana, swaps also occur across varied pool designs y fee tiers. Some pools are deep y low fee; others are shallow but still attractive para small size due to path composition. Fee bps are often compared in isolation, but total execution quality comes from three interacting pieces: fee deduction, reserve depth, y route hop count. A route con slightly higher fee can still produce higher net output if reserves are materially deeper.\n\nSlippage y impacto de precio are often conflated in UI copy, but they answer different questions. Impacto de precio asks: what movement does this trade itself induce against current reserves? Slippage tolerance asks: what worst-case output should still be accepted at execution time? One is descriptive of current route mechanics, the other is a user safety bound. Production interfaces should surface both values clearly y compute minOut deterministically from outAmount y slippage bps.\n\nDeterministic arithmetic matters as much as financial logic. If planners use floating-point shortcuts, two environments can produce subtly different minOut values y route ranking. Those tiny differences create major operational pain in tests, incident response, y support reproductions. Integer arithmetic over u64-style amount strings should remain the primary model path; formatting para users should happen only at presentation boundaries.\n\nEven in an offline educational planner, safety invariants belong at the core. Outputs must never exceed reserveOut. Reserves must remain non-negative after virtual simulation. Missing pools should fail fast con typed errors, not fallback behavior. These checks mirror production expectations y train the same engineering discipline needed para real integrations.\n\nA robust frontend modelo mental is therefore: token universe + pool universe + deterministic quote math + route ranking policy + user safety constraints. If any layer is implicit, the system will still run, but behavior under volatility becomes hard to explain. If all layers are explicit y typed, the same planner can power UI previews, tests, y diagnostics con minimal drift.\n\n## Quick numeric intuition\n\nIf two routes have spot prices that look similar, a larger input can still produce materially different output because you travel further on each curve. That is why route comparison must happen at the exact user amount, not a tiny reference trade.\n\n## What you should internalize from this leccion\n\n- Execution quality is output-at-size, not headline spot price.\n- Slippage tolerance is a user protection bound, not a market forecast.\n- Deterministic integer math is a product feature, not only a technical preference.\n\n### Pitfalls\n\n1. Comparing routes by headline “price” instead of exact outAmount at the user’s size.\n2. Treating slippage tolerance as if it were the same metric as impacto de precio.\n3. Using floating point in route ranking or minOut logic.\n\n### Production Checklist\n\n1. Keep amount math in integer-safe paths.\n2. Surface outAmount, fee impact, y minOut separately.\n3. Enforce invariant checks para each hop simulation.\n4. Keep route ranking deterministic con explicit tie-breakers.\n5. Log enough context to reproduce route decisions.\n",
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
                    "explanation": "minOut is computed from quote outAmount y slippage bps."
                  }
                ]
              }
            ]
          },
          "defi-v2-quote-anatomy-and-risk": {
            "title": "Quote anatomy: in/out, fees, minOut, y worst-case execution",
            "content": "# Quote anatomy: in/out, fees, minOut, y worst-case execution\n\nA production quote is not one number. It is a structured object that must tell users what they send, what they likely receive, how much they pay in fees, y what minimum output protection applies. When frontend systems treat quote payloads as loose JSON blobs, users lose trust quickly because route changes y execution deviations look arbitrary.\n\nThe first mandatory fields are inAmount y outAmount in raw integer units. Without raw values, deterministic checks become fragile. UI formatting should be derived from token decimals, but core state should retain raw strings para exact comparisons y invariant logic. If an app compares rounded display numbers, route ties can break unpredictably.\n\nSecond, quote systems should expose fee breakdown per hop. Aggregate fee bps is useful, but it hides which pools drive cost. Para route explainability y debugging, users y engineers need pool-level fee contributions. This is particularly important para two-hop routes where one leg may be cheap y the other expensive.\n\nThird, minOut must be explicit, reproducible, y tied to user-configured slippage bps. The computation is deterministic: floor(outAmount * (10000 - slippageBps) / 10000). Showing this value is not optional para serious UX. It is the user’s principal safety guard against stale quotes y rapid market movement between quote y submission.\n\nFourth, quote freshness y worst-case framing should be visible. Even in offline training systems, the planner should model the idea that the route is valid para a moment, not forever. In production, stale quote handling y forced re-quote boundaries prevent accidental execution con outdated assumptions.\n\nA useful engineering pattern is to model quote objects as immutable snapshots. Each snapshot includes selected route, per-hop details, total fees, impact estimate, y minOut. If selection changes, produce a new snapshot instead of mutating fields in place. This gives deterministic audit trails y cleaner state transitions.\n\nPara this curso, leccion logic remains offline y deterministic, but the same diseno prepares teams para real Jupiter integrations later. By the time network adapters are introduced, your model y tests already guarantee stable route math y explainability.\n\nQuote anatomy also influences support burden. When a user asks why they received less than expected, the answer is much faster if the system preserves route path, slippage setting, y minOut from the exact planning state. Without that, teams rely on post-hoc guesses.\n\n### Pitfalls\n\n1. Displaying outAmount without minOut y route-level fees.\n2. Mutating selected quote objects in place instead of creating snapshots.\n3. Computing fee percentages from rounded UI values instead of raw amounts.\n\n### Production Checklist\n\n1. Keep quote payloads immutable y versioned.\n2. Store per-hop fee contributions y total fee amount.\n3. Compute y show minOut from explicit slippage bps.\n4. Preserve raw amounts y decimals separately.\n5. Expose route freshness metadata in UI state.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "defi-v2-l2-explorer",
                "title": "Quote Cuenta Snapshot",
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
                      "Para explainability y debugging route-level cost",
                      "Only para CSS rendering",
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
            "content": "# Routing: why two-hop can beat one-hop\n\nUsers often assume direct pair routes are always best because they are simpler. In fragmented liquidity systems, that assumption fails frequently. A direct SOL -> JUP pool might have shallow depth, while SOL -> USDC y USDC -> JUP pools together can produce better net output despite two fees y two curve traversals. A production router should evaluate both one-hop y two-hop candidates y rank them deterministically.\n\nThe engineering challenge is not just finding paths. It is comparing paths under consistent assumptions. Every candidate should be quoted con the same input amount, same deterministic arithmetic, y same fee/impact accounting. If one path uses rounded display math while another uses raw amounts, route ranking loses meaning.\n\nTwo-hop routing also requires stable tie-break policies. Suppose two candidates produce equal outAmount at integer precision. One has one hop; the other has two hops. A deterministic system should prefer fewer hops. If hop count also ties, lexicographic route ID ordering can resolve final rank. The exact policy can vary, but it must be explicit y stable.\n\nLiquidity fragmentation introduces another subtle point: intermedio mint risk. A two-hop path through a highly liquid stable pair can be excellent, but if the second pool is thin, the route can still degrade at larger sizes. This is why route scoring should be quote-size aware y not reused blindly across different trade amounts.\n\nPara offline curso logic, we model pools as a static universe y simulate reserves virtually per quote path. Even this simplified model teaches key production habits: avoid mutating source fixtures, isolate simulation state per candidate, y validate safety constraints at each hop.\n\nRouting quality is also a UX problem. If a selected route changes due to input edits or quote refresh, users should see why: outAmount delta, fee change, y path change. Silent route switching feels suspicious even when mathematically correct.\n\nIn larger systems, routers may consider split routes, gas/compute constraints, or venue reliability. This curso intentionally limits scope to one-hop y two-hop deterministic candidates so core reasoning remains clear y testable.\n\nFrom an implementation perspective, route objects should be treated as typed artifacts con stable IDs y explicit hop metadata. That discipline reduces accidental coupling between UI state y planner internals. When engineers can serialize a route candidate, replay it con the same input, y get the same result, incident response becomes straightforward.\n\n### Pitfalls\n\n1. Assuming direct pairs always outperform multi-hop routes.\n2. Reusing quotes computed para one trade size at another size.\n3. Non-deterministic tie-breaking that causes route flicker.\n\n### Production Checklist\n\n1. Enumerate one-hop y two-hop routes systematically.\n2. Quote every candidate con the same deterministic math path.\n3. Keep tie-break policy explicit y stable.\n4. Simulate virtual reserves without mutating source fixtures.\n5. Surface route-change reasons in UI.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l3-q1",
                    "prompt": "What is the primary ranking objective in this curso router?",
                    "options": [
                      "Maximize outAmount",
                      "Minimize hop count always",
                      "Choose first enumerated route"
                    ],
                    "answerIndex": 0,
                    "explanation": "outAmount is primary; hops y route ID are tie-breakers."
                  },
                  {
                    "id": "defi-v2-l3-q2",
                    "prompt": "Why simulate virtual reserves per candidate route?",
                    "options": [
                      "To keep route quotes deterministic y independent",
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
        "description": "Build deterministic quoting, route selection, y minOut safety checks, then package stable checkpoint artifacts para reproducible reviews.",
        "lessons": {
          "defi-v2-quote-cpmm": {
            "title": "Implement token/pool model + constant-product quote calc",
            "content": "# Implement token/pool model + constant-product quote calc\n\nImplement deterministic CPMM quoting:\n- out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee)\n- fee = floor(inAmount * feeBps / 10000)\n- impactBps from spot vs effective execution price\n- return outAmount, feeAmount, inAfterFee, impactBps\n",
            "duration": "35 min",
            "hints": [
              "Use inAfterFee = inAmount - floor(inAmount * feeBps / 10000).",
              "Use constant-product output formula con integer floor division.",
              "Estimate impact by comparing spot price y effective execution price in fixed scale."
            ]
          },
          "defi-v2-router-best": {
            "title": "Implement route enumeration y best-route selection",
            "content": "# Implement route enumeration y best-route selection\n\nImplement deterministic route planner:\n- enumerate one-hop y two-hop candidates\n- quote each candidate at exact input size\n- select best route using stable tie-breakers\n",
            "duration": "35 min",
            "hints": [
              "Enumerate 1-hop direct pools first, then 2-hop through intermedio tokens.",
              "Score bestOut by output, then tie-break by hops y route id.",
              "Keep sorting deterministic to avoid route flicker."
            ]
          },
          "defi-v2-safety-minout": {
            "title": "Implement slippage/minOut, fee breakdown, y safety invariants",
            "content": "# Implement slippage/minOut, fee breakdown, y safety invariants\n\nImplement deterministic safety layer:\n- apply slippage to compute minOut\n- simulate route con virtual reserve updates\n- return structured errors para invalid pools/routes\n- enforce non-negative reserve y bounded output invariants\n",
            "duration": "35 min",
            "hints": [
              "Use virtual pool copies so fixture reserves are not mutated.",
              "Compute minOut con floor(out * (10000 - slippageBps) / 10000).",
              "Return structured errors when pools or route links are invalid."
            ]
          },
          "defi-v2-production-swap-ux": {
            "title": "Production swap UX: stale quotes, protection, y simulation",
            "content": "# Production swap UX: stale quotes, protection, y simulation\n\nA deterministic route engine is necessary but not sufficient para production. Users experience DeFi through timing, messaging, y safety affordances. A mathematically correct planner can still feel broken if stale quote handling, retry behavior, y error communication are weak.\n\nStale quotes are the most common operational issue. In volatile markets, quote quality decays quickly. Interfaces should track quote age y invalidate plans beyond a strict threshold. When invalidation happens, route y minOut should be recomputed before submit. Reusing stale plans to “speed up” UX usually creates worse outcomes y support burden.\n\nUser protection should be layered. Slippage bounds protect against adverse movement, but they do not protect against malformed route payloads or mismatched cuenta assumptions. Safety validation should run before any cartera prompt y should return explicit, typed errors. “Something went wrong” is not enough in swap flows.\n\nSimulation messaging matters as much as simulation itself. If route simulation fails pre-send, users need actionable context: which hop failed, whether pool liquidity was insufficient, whether the route is missing required pools, y whether re-quoting could help. Generic error banners create user churn.\n\nRetry logic must be bounded y stateful. Blind retries con unchanged input are often just repeated failures. Good UX distinguishes retryable states (temporary network issue) from deterministic planner errors (invalid route topology). Para deterministic planner errors, force state change before retry.\n\nAnother production concern is observability. Record route ID, inAmount, outAmount, minOut, fee totals, y invariant results para each attempt. These logs make incident triage y postmortems dramatically faster. Without structured traces, teams often blame “market conditions” para planner bugs.\n\nPagination y list updates also affect trust. Swap history UIs should preserve deterministic ordering y avoid jitter when data refreshes. If past swaps reorder unpredictably, users perceive reliability issues even when transacciones are correct.\n\nOptional live integrations should be feature-flagged y isolated. The offline deterministic engine should remain the source of truth, while live adapters map external responses into the same internal types. That boundary keeps tests stable y protects core behavior from third-party schema changes.\n\nFinally, production swap UX should make deterministic planner outcomes explainable to non-expert users. If a route is rejected, the interface should provide a concrete reason y a clear next action such as reducing size or selecting a different output token. Clear messaging converts system correctness into user trust.\n\n### Pitfalls\n\n1. Allowing stale quotes to remain actionable without forced re-quote.\n2. Retrying deterministic planner errors without changing route or inputs.\n3. Hiding failure reason details behind generic notifications.\n\n### Production Checklist\n\n1. Track quote freshness y invalidate aggressively.\n2. Enforce pre-submit invariant validation.\n3. Separate retryable network failures from deterministic planner failures.\n4. Log route y safety metadata para every attempt.\n5. Keep offline engine as canonical model para optional live adapters.\n",
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
                      "Re-quote y recompute route/minOut before submit",
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
                      "Deterministic planner y invariant failures",
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
            "content": "# Produce stable SwapPlan + SwapSummary checkpoint\n\nCompose deterministic checkpoint artifacts:\n- build swap plan from selected route quote\n- include fixtureHash y modelVersion\n- emit stable summary con path, minOut, fee totals, impact, y invariants\n",
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
    "title": "Solana Seguridad & Auditing",
    "description": "Production-grade deterministic vuln lab para Solana auditors who need repeatable exploit evidence, precise remediation guidance, y high-signal audit artifacts.",
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
        "description": "Cuenta-centric threat modeling, deterministic exploit reproduction, y evidence discipline para credible audit findings.",
        "lessons": {
          "security-v2-threat-model": {
            "title": "Solana threat model para auditors: cuentas, owners, signers, writable, PDAs",
            "content": "# Solana threat model para auditors: cuentas, owners, signers, writable, PDAs\n\nSeguridad work on Solana starts con one non-negotiable fact: instruccion callers choose the cuenta list. Programs do not receive trusted implicit context. They receive exactly the cuenta metas y instruccion data encoded in a transaccion message. This diseno is powerful para composability y rendimiento, but it means almost every critical exploit is an cuenta validation exploit in disguise. If you internalize this early, your audits become more mechanical y less guess-based.\n\nA good modelo mental is to treat each instruccion as a contract boundary con five mandatory validations: identity, authority, ownership, mutability, y derivation. Identity asks whether the supplied cuenta is the cuenta the instruccion expects. Authority asks whether the actor that is allowed to mutate state actually signed. Ownership asks whether cuenta data should be interpreted under the current program or a different one. Mutability asks whether writable access is both requested y justified. Derivation asks whether PDA paths are deterministic y verified against canonical seeds plus bump. Missing any of those layers creates openings that attackers repeatedly use.\n\nSigner checks are not optional on privileged paths. If the instruccion changes authority, moves funds, or updates risk parameters, the authority cuenta must be a signer y must be the expected authority from state. One common bug is checking only that “some signer exists.” That is still broken. Audits should explicitly map each privileged transition to a concrete signer relationship y verify that relation is enforced before state mutation.\n\nOwner checks are equally critical. Programs often parse cuenta bytes into local structs. Without owner checks, an attacker can pass arbitrary bytes that deserialize into a shape that looks valid but is controlled by another program or by no program assumptions at all. This is cuenta substitution. It is the root cause of many catastrophic incidents y should be surfaced early in review notes.\n\nPDA checks are where many teams lose determinism. Seed recipes need to be explicit, stable, y versioned. If the runtime accepts user-provided bump values without recomputation, or if seed ordering differs between handlers, spoofed addresses can pass inconsistent checks. Auditors should insist on exact re-derivation y equality checks in all sensitive paths.\n\nWritable flags matter para two reasons: correctness y attack surface. Over-broad writable sets increase risk by allowing unnecessary state transitions in CPI-heavy flows. Under-declared mutability causes runtime failure, which is safer but still a reliability bug.\n\nFinally, threat modeling should include arithmetic constraints. Even if auth is correct, unchecked u64 math can corrupt balances through underflow or overflow y invalidate all higher-level assumptions.\n\n## Auditor workflow per instruccion\n\nPara each handler, run the same sequence: identify privileged outcome, list required cuentas, verify signer/owner/PDA relationships, verify writable scope, then test malformed cuenta lists. Repeating this fixed loop prevents “I think it looks safe” audits.\n\n## What you should be able to do after this leccion\n\n- Turn a vague concern into a concrete validation checklist.\n- Explain why cuenta substitution y PDA spoofing recur in Solana incidents.\n- Build deterministic negative-path scenarios before writing remediation notes.\n\n## Checklist\n- Map each instruccion to a clear privilege model.\n- Verify authority cuenta is required signer para privileged actions.\n- Verify authority key equality against stored state authority.\n- Verify every parsed cuenta has explicit owner validation.\n- Verify each PDA is re-derived from canonical seeds y bump.\n- Verify writable cuentas are minimal y justified.\n- Verify arithmetic uses checked operations para u64 transitions.\n- Verify negative-path tests exist para unauthorized y malformed cuentas.\n\n## Red flags\n- Privileged state updates without signer checks.\n- Parsing unchecked cuenta data from unknown owners.\n- PDA acceptance based on partial seed checks.\n- Handlers that trust client-provided bump blindly.\n- Arithmetic updates using plain + y - on balances.\n\n## How to verify (simulator)\n- Run vulnerable mode on signer-missing scenario y inspect trace.\n- Re-run fixed mode y confirm ERR_NOT_SIGNER.\n- Execute owner-missing scenario y compare vulnerable vs fixed outcomes.\n- Execute pda-spoof scenario y confirm fixed mode emits ERR_BAD_PDA.\n- Compare trace hashes to verify deterministic event ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l1-q1",
                    "prompt": "Why are cuenta owner checks mandatory before deserializing state?",
                    "options": [
                      "Because callers can pass arbitrary cuentas y forged byte layouts",
                      "Because owner checks improve rendering speed",
                      "Because owner checks replace signer checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without owner checks, cuenta substitution allows attacker-controlled bytes to be parsed as trusted state."
                  },
                  {
                    "id": "security-v2-l1-q2",
                    "prompt": "What should be verified para a privileged withdraw path?",
                    "options": [
                      "Expected authority key, signer requirement, owner check, y PDA derivation",
                      "Only that the vault cuenta is writable",
                      "Only that an amount field exists"
                    ],
                    "answerIndex": 0,
                    "explanation": "Privileged transitions need full identity y authority validation."
                  }
                ]
              }
            ]
          },
          "security-v2-evidence-chain": {
            "title": "Evidence chain: reproduce, trace, impact, fix, verify",
            "content": "# Evidence chain: reproduce, trace, impact, fix, verify\n\nStrong seguridad reports are built on evidence chains, not opinions. In the Solana context, that means moving from a claim such as “missing signer check exists” to a deterministic chain: reproduce exploit conditions, capture a stable execution trace, quantify impact, apply a patch, y verify that the same steps now fail con expected error codes while invariants hold. This chain is what turns audit work into an engineering artifact.\n\nReproduction should be deterministic y minimal. Every scenario should declare initial cuentas, authority/signer flags, vault ownership assumptions, y instruccion inputs. If reproductions depend on external RPC timing or changing liquidity conditions, confidence drops y triage slows down. In this curso lab, scenarios are fixture-driven y offline so every replay produces the same state transitions.\n\nTrace capture is the core of audit evidence. Instead of recording only final balances, log each relevant event in stable order: InstructionStart, AccountRead, CheckPassed/CheckFailed, BalanceChange, InstructionEnd. These events let reviewers verify exactly which assumptions passed y where validation was skipped. They also help map exploitability to code-level checks. Para example, if signer checks are absent in vulnerable mode, the trace should explicitly show that signer validation was skipped or never evaluated.\n\nImpact analysis should be quantitative. Para signer y owner bugs, compute drained lamports or unauthorized state changes. Para PDA bugs, show mismatch between expected derived address y accepted address. Para arithmetic bugs, show underflow or overflow conditions y resulting corruption. Impact details inform severity y prioritization.\n\nPatch validation should not just say “fixed.” It should prove exploit steps now fail para the right reason. If signer exploit now fails, error code should be ERR_NOT_SIGNER. If PDA spoof now fails, error code should be ERR_BAD_PDA. This specificity catches regressions where one bug is accidentally masked by unrelated behavior.\n\nVerification closes the chain con invariant checks. Examples: vault balance remains a valid u64 string, authority remains unchanged, y no unauthorized lamport delta occurs in fixed mode. These invariants convert patch confidence into measurable guarantees.\n\nWhen teams do this consistently, reports become executable documentation. New engineers can replay scenarios y understand why controls exist. Incident response becomes faster because prior failure signatures y remediation patterns are already captured.\n\n## Checklist\n- Define each scenario con explicit initial state y instruccion inputs.\n- Capture deterministic, ordered trace events para each run.\n- Hash traces con canonical JSON para reproducibility.\n- Quantify impact using before/after deltas.\n- Map each finding to explicit evidence references.\n- Re-run identical scenarios in fixed mode.\n- Verify fixed-mode failures use expected error codes.\n- Record post-fix invariant results con stable IDs.\n\n## Red flags\n- Reports con no reproduction steps.\n- Non-deterministic traces that change between runs.\n- Impact described qualitatively without deltas.\n- Patch claims without fixed-mode replay evidence.\n- Invariant lists omitted from verification section.\n\n## How to verify (simulator)\n- Run signer-missing in vulnerable mode, save trace hash.\n- Run same scenario in fixed mode, confirm ERR_NOT_SIGNER.\n- Run owner-missing y confirm ERR_BAD_OWNER in fixed mode.\n- Run pda-spoof y compare expected/accepted PDA fields.\n- Generate audit report JSON y markdown summary from checkpoint builder.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "security-v2-l2-account-explorer",
                "title": "Trace Cuenta Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Vault cuenta (vulnerable run)",
                      "address": "PDA_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                      "lamports": 300,
                      "owner": "VaultProgram111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Recipient cuenta (post exploit)",
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
                      "To prove deterministic replay y evidence integrity",
                      "To replace structured test assertions",
                      "To randomize scenario ordering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Canonical trace hashes make replay evidence comparable y tamper-evident."
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
                    "explanation": "This order ensures claims are demonstrated y patch effectiveness is validated."
                  }
                ]
              }
            ]
          },
          "security-v2-bug-classes": {
            "title": "Common Solana bug classes y mitigations",
            "content": "# Common Solana bug classes y mitigations\n\nAuditors on Solana repeatedly encounter the same core bug families. The implementation details differ across protocols, but exploit mechanics are surprisingly consistent: identity confusion, authority confusion, derivation drift, arithmetic corruption, y unsafe cross-program assumptions. A robust review process categorizes findings by class, applies known verification patterns, y tests negative paths intentionally.\n\n**Missing signer checks** are high-severity because they directly break authorization. The fix is conceptually simple: require signer y key relation. Yet teams miss it when refactoring cuenta structs or switching between typed y unchecked cuenta wrappers. Auditors should scan all state-mutating handlers y ask: who can call this y what proves authorization?\n\n**Missing owner checks** create cuenta substitution risk. Programs may deserialize cuenta bytes y trust semantic fields without proving the cuenta is owned by the expected program. In mixed CPI systems, this is especially dangerous because cuenta shapes can look valid while semantics differ. Mitigation is explicit owner validation before parsing y strict cuenta type usage.\n\n**PDA seed/bump mismatch** appears when seed ordering, domain tags, or bump handling drifts between instrucciones. One handler derives [\"vault\", authority], another derives [authority, \"vault\"], a third trusts client-provided bump. Attackers search those inconsistencies to route privileged logic through spoofed addresses. Mitigation is canonical seed schema, exact re-derivation on every sensitive path, y tests that intentionally pass malformed PDA candidates.\n\n**CPI authority confusion** happens when one program delegates authority assumptions to another without strict scope. If signer seeds or delegated permissions are broader than intended, downstream calls can perform unintended state transitions. Mitigation includes explicit CPI allowlists, minimal writable/signer metas, y scope-limited delegated authorities.\n\n**Integer overflow/underflow** remains a practico class in accounting-heavy systems. Rust release mode behavior makes unchecked arithmetic unacceptable para balances y fee logic. Mitigation is checked operations, u128 intermediates para multiply/divide paths, y boundary-focused tests.\n\nMitigation quality depends on verification quality. Unit tests should include adversarial cuenta substitutions, malformed seeds, missing signers, y boundary arithmetic. If tests only cover happy paths, high-severity bugs will survive code review.\n\nThe audit deliverable should translate classes into implementation guidance. Engineers need clear, actionable remediations y concrete reproduction conditions, not generic warnings. The best reports include checklists that can be wired into CI y release gates.\n\n## Checklist\n- Enumerate all privileged instrucciones y expected signers.\n- Verify owner checks before parsing external cuenta layouts.\n- Pin y document PDA seed schemas y bump usage.\n- Validate CPI target program IDs against allowlist.\n- Minimize writable y signer cuenta metas in CPI.\n- Enforce checked math para all u64 state transitions.\n- Add negative tests para each bug class.\n- Require deterministic traces para seguridad-critical tests.\n\n## Red flags\n- Any privileged mutation path without explicit signer requirement.\n- Any unchecked cuenta deserialization path.\n- Any instruccion that accepts bump without re-derivation.\n- Any CPI call to dynamic or user-selected program ID.\n- Any unchecked arithmetic on balances or supply values.\n\n## How to verify (simulator)\n- Use leccion 4 scenario to confirm unauthorized withdraw in vulnerable mode.\n- Use leccion 5 scenario to confirm spoofed PDA acceptance in vulnerable mode.\n- Use leccion 6 patch suite to verify fixed-mode errors by code.\n- Run checkpoint report y ensure all scenarios are marked reproduced.\n- Inspect invariant result array para all fixed-mode scenarios.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l3-q1",
                    "prompt": "What is the strongest mitigation para PDA spoof risks?",
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
                    "prompt": "Why are negative-path tests required para audit confidence?",
                    "options": [
                      "Because most exploitable bugs only appear under malformed or adversarial input",
                      "Because happy-path tests cover all seguridad cases",
                      "Because traces are optional without them"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seguridad failures are usually adversarial edge cases, so tests must target those edges directly."
                  }
                ]
              }
            ]
          }
        }
      },
      "security-v2-vuln-lab": {
        "title": "Vuln Lab Project Journey",
        "description": "Exploit, patch, verify, y produce audit-ready artifacts con deterministic traces y invariant-backed conclusions.",
        "lessons": {
          "security-v2-exploit-signer-owner": {
            "title": "Break it: exploit missing signer + owner checks",
            "content": "# Break it: exploit missing signer + owner checks\n\nImplement a deterministic exploit-proof formatter para signer/owner vulnerabilities.\n\nExpected output fields:\n- scenario\n- before/after vault balance\n- before/after recipient lamports\n- trace hash\n- explanation con drained lamports\n\nUse canonical key ordering so tests can assert exact JSON output.",
            "duration": "40 min",
            "hints": [
              "Compute drained lamports from recipient before/after.",
              "Include deterministic field ordering in the JSON output.",
              "The explanation should mention missing signer/owner validation."
            ]
          },
          "security-v2-exploit-pda-spoof": {
            "title": "Break it: exploit PDA spoof mismatch",
            "content": "# Break it: exploit PDA spoof mismatch\n\nImplement a deterministic PDA spoof proof output.\n\nYou must show:\n- expected PDA\n- accepted PDA\n- mismatch boolean\n- trace hash\n\nThis leccion validates evidence generation para derivation mismatches.",
            "duration": "40 min",
            "hints": [
              "Return whether expectedPda y acceptedPda differ.",
              "Use strict boolean output para mismatch.",
              "Keep output key order stable."
            ]
          },
          "security-v2-patch-validate": {
            "title": "Fix it: validations + invariant suite",
            "content": "# Fix it: validations + invariant suite\n\nImplement patch validation output that confirms:\n- signer check\n- owner check\n- PDA check\n- safe u64 arithmetic\n- exploit blocked state con error code\n\nKeep output deterministic para exact assertion.",
            "duration": "45 min",
            "hints": [
              "All four controls must be true para a complete patch.",
              "Use fixedBlockedExploit to set blocked status.",
              "Return error code only when blocked is true."
            ]
          },
          "security-v2-writing-reports": {
            "title": "Writing audit reports: severity, likelihood, blast radius, remediation",
            "content": "# Writing audit reports: severity, likelihood, blast radius, remediation\n\nA strong audit report is an engineering document, not a narrative essay. It should allow a reader to answer four questions quickly: what failed, how exploitable it is, how much damage it can cause, y what exact change prevents recurrence. Seguridad writing quality directly affects fix quality because implementation teams ship what they can interpret.\n\nSeverity should be tied to impact y exploit preconditions. A missing signer check in a withdraw path is typically critical if it allows unauthorized asset movement con low prerequisites. A PDA mismatch may be high or medium depending on reachable code paths y available controls. Severity labels without rationale are not useful. Include explicit exploit path assumptions y whether attacker capital or privileged positioning is required.\n\nLikelihood should capture practico exploitability, not theoretical possibility. Para example, if a bug requires impossible cuenta states under current architecture, likelihood may be low even if impact is high. Conversely, if a bug is reachable by submitting a standard instruccion con crafted cuenta metas, likelihood is high. Be specific.\n\nBlast radius should describe what can be drained or corrupted: one vault, one market, protocol-wide state, or gobernanza authority. This framing helps teams stage incident response y patch rollout.\n\nRecommendations must be precise y testable. “Add better validation” is too vague. “Require authority signer, verify authority key matches vault state, verify vault owner equals program id, y verify PDA from [\"vault\", authority] + bump” is actionable. Include expected error codes so QA can validate behavior reliably.\n\nEvidence references are also important. Each finding should point to deterministic traces, scenario IDs, y checkpoint artifacts so another engineer can replay without interpretation gaps.\n\nFinally, include verification results. A patch is not complete until exploit scenarios fail deterministically y invariants hold. Reports that end before verification force downstream teams to rediscover completion criteria.\n\nReport structure should also prioritize scanability. Teams reviewing multiple findings under incident pressure need consistent field ordering y concise language that maps directly to engineering actions. If one finding uses narrative prose while another uses structured reproduction steps, remediation speed drops because readers spend time normalizing format instead of executing fixes.\n\nA reliable pattern is one finding per vulnerability class con explicit evidence references grouped by scenario ID. That allows QA, auditors, y protocol engineers to coordinate on the same deterministic artifacts. The same approach also improves long-term maintenance: when code changes, teams can rerun scenario IDs y compare trace hashes to detect regressions in report assumptions.\n\n## Checklist\n- State explicit vulnerability class y affected instruccion path.\n- Include reproducible scenario ID y deterministic trace hash.\n- Quantify impact con concrete state/balance deltas.\n- Assign severity con rationale tied to exploit preconditions.\n- Assign likelihood based on realistic attacker capabilities.\n- Describe blast radius at cuenta/protocol boundary.\n- Provide exact remediation steps y expected error codes.\n- Include verification outcomes y invariant results.\n\n## Red flags\n- Severity labels without impact rationale.\n- Recommendations without concrete validation rules.\n- No reproduction steps or trace references.\n- No fixed-mode verification evidence.\n- No distinction between impact y likelihood.\n\n## How to verify (simulator)\n- Generate report JSON from checkpoint builder.\n- Confirm findings include evidenceRefs para each scenario.\n- Confirm remediation includes patch IDs.\n- Confirm verification results mark each scenario as blocked in fixed mode.\n- Generate markdown summary y compare to report content ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l7-q1",
                    "prompt": "What is the key difference between severity y likelihood?",
                    "options": [
                      "Severity measures impact; likelihood measures practico exploitability",
                      "They are interchangeable labels",
                      "Likelihood is only para low-severity bugs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Good reports separate damage potential from exploit feasibility."
                  },
                  {
                    "id": "security-v2-l7-q2",
                    "prompt": "Which recommendation is most actionable?",
                    "options": [
                      "Require signer + owner + PDA checks con explicit error codes",
                      "Improve seguridad in this function",
                      "Add more comments"
                    ],
                    "answerIndex": 0,
                    "explanation": "Actionable recommendations map directly to code changes y tests."
                  }
                ]
              }
            ]
          },
          "security-v2-audit-report-checkpoint": {
            "title": "Checkpoint: deterministic AuditReport JSON + markdown",
            "content": "# Checkpoint: deterministic AuditReport JSON + markdown\n\nCreate the final deterministic checkpoint payload:\n- curso + version\n- scenario IDs\n- finding count\n\nThis checkpoint mirrors the final curso artifact produced by the simulator report builder.",
            "duration": "45 min",
            "hints": [
              "Return stable, minimal checkpoint metadata.",
              "curso must be solana-seguridad y version must be v2.",
              "Preserve scenarioIds order as provided."
            ]
          }
        }
      }
    }
  },
  "token-engineering": {
    "title": "Token Engineering on Solana",
    "description": "Project-journey curso para teams launching real Solana tokens: deterministic Token-2022 planning, authority diseno, supply simulation, y operational launch discipline.",
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
        "description": "Understand token primitives, mint policy anatomy, y Token-2022 extension controls con explicit gobernanza y threat-model framing.",
        "lessons": {
          "token-v2-spl-vs-token-2022": {
            "title": "SPL tokens vs Token-2022: what extensions change",
            "content": "# SPL tokens vs Token-2022: what extensions change\n\nToken engineering starts con a clean boundary between base token semantics y configurable policy. Legacy SPL Token gives you a stable fungible primitive: mint metadata, token cuentas, mint authority, freeze authority, y transfer/mint/burn instrucciones. Token-2022 preserves that core interface but adds extension slots that let teams activate richer behavior without rewriting token logic from scratch. That compatibility is useful, but it also creates a new class of gobernanza y safety decisions that frontend y protocol engineers need to model explicitly.\n\nThe key modelo mental: Token-2022 is not a separate economic system; it is an extended cuenta layout y instruccion surface. Extensions are opt-in, y each extension adds bytes, authorities, y state transitions that must be considered during mint initialization y lifecycle management. If you treat extensions as cosmetic add-ons, you can ship a token that is technically valid but operationally fragile.\n\nPara production teams, the first decision is policy minimalism. Every enabled extension increases complexity in carteras, indexers, y downstream integrations. Transfer fees may fit treasury goals but can break assumptions in partner protocols. Default cuenta state can enforce safety posture but may confuse users if cuenta thaw flow is unclear. Permanent delegate can simplify managed flows but dramatically expands power if authority boundaries are weak. The right approach is to map each extension to a concrete requirement y document the explicit threat model it introduces.\n\nToken-2022 also changes launch sequencing. You must pre-size mint cuentas para chosen extensions, initialize extension data in deterministic order, y verify authority alignment before live distribution. This is where deterministic offline planning is valuable: you can generate a launch pack, inspect instruccion-like payloads, y validate invariants before touching network systems. That practice catches configuration drift early y gives reviewers a reproducible artifact.\n\nFinally, extension-aware diseno is an integration problem, not just a contract problem. Product y support teams need clear messaging para fee behavior, frozen cuenta states, y delegated capabilities. If users cannot predict token behavior from cartera prompts y docs, operational risk rises even when code is formally correct.\n\n## Decision framework para extension selection\n\nPara each extension, force three answers before enabling it:\n1. What concrete product requirement does this solve now?\n2. Which authority can abuse this if compromised?\n3. How will users y integrators observe this behavior in UX y docs?\n\nIf any answer is vague, extension scope is probably too broad.\n\n## Pitfall: Extension creep without threat modeling\n\nAdding multiple extensions \"para flexibility\" often creates overlapping authority powers y unpredictable UX. Enable only the extensions your product can govern, monitor, y explain end-to-end.\n\n## Sanity Checklist\n\n1. Define one explicit business reason per extension.\n2. Document extension authorities y revocation strategy.\n3. Verify partner compatibility assumptions before launch.\n4. Produce deterministic initialization artifacts para review.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l1-q1",
                    "prompt": "What is the safest default posture para Token-2022 extension selection?",
                    "options": [
                      "Enable only extensions con clear product y risk justification",
                      "Enable all extensions para future flexibility",
                      "Disable authorities entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "Every extension adds gobernanza y integration complexity, so scope should stay intentional."
                  },
                  {
                    "id": "token-v2-l1-q2",
                    "prompt": "Why generate an offline deterministic launch pack before devnet/mainnet actions?",
                    "options": [
                      "To review instruccion intent y invariants before execution",
                      "To avoid configuring decimals",
                      "To bypass authority checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic planning provides reproducible review artifacts y catches config drift early."
                  }
                ]
              }
            ]
          },
          "token-v2-mint-anatomy": {
            "title": "Mint anatomy: authorities, decimals, supply, freeze, mint",
            "content": "# Mint anatomy: authorities, decimals, supply, freeze, mint\n\nA production token launch succeeds or fails on parameter discipline. The mint cuenta is a compact policy object: it defines decimal precision, minting authority, optional freeze authority, y extension configuration. Token cuentas then represent balances para owners, usually through ATAs. If these pieces are configured inconsistently, downstream systems see contradictory behavior y user trust erodes quickly.\n\nDecimals are one of the most underestimated parameters. They influence UI formatting, fee interpretation, y business logic in integrations. While high precision can feel \"future-proof,\" excessive decimals often create rounding edge cases in analytics y partner systems. Constraining decimals to a documented operational range y validating it at config time is a practico defensive rule.\n\nAuthority layout should be explicit y minimal. Mint authority controls supply growth. Freeze authority controls cuenta-level transfer ability. Update authority (para metadata-linked policy) can affect user-facing trust y protocol assumptions. Teams often reuse one operational key para convenience, then struggle to separate powers later. A better pattern is to predefine authority roles y revocation milestones as part of launch gobernanza.\n\nSupply planning should distinguish issuance from distribution. Initial supply tells you what is minted; recipient allocations tell you what is distributed at launch. Those values should be validated con exact integer math, not float formatting. Invariant checks such as `recipientsTotal <= initialSupply` are simple but prevent serious release mistakes.\n\nToken-2022 extensions deepen this anatomy. Transfer fee config introduces fee basis points y caps; default cuenta state changes cuenta activation posture; permanent delegate creates a privileged transfer actor. Each extension implies additional authority y monitoring requirements. Your launch plan must encode these requirements as explicit steps y include human-readable labels so reviewers can confirm intent.\n\nFinally, deterministic address derivation in curso tooling is a useful engineering discipline. Even when pseudo-addresses are used para offline planning, stable derivation functions improve reproducibility y reduce reviewer ambiguity. The same mindset carries to real deployments where deterministic cuenta derivation is foundational.\n\nStrong teams also pair mint-anatomy reviews con explicit incident playbooks: what to do if an authority key is lost, rotated, or compromised, y how to communicate those events to integrators without causing panic.\n\n## Pitfall: One-key authority convenience\n\nUsing a single key para minting, freezing, y metadata updates simplifies setup but concentrates risk. Authority compromise then becomes a full-token compromise rather than a contained incident.\n\n## Sanity Checklist\n\n1. Validate decimals y supply fields before plan generation.\n2. Record mint/freeze/update authority roles y custody model.\n3. Confirm recipient allocation totals con integer math.\n4. Review extension authorities independently from mint authority.\n",
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
                      "Because token cuentas store floats"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply y distribution correctness depends on exact arithmetic over integer base units."
                  },
                  {
                    "id": "token-v2-l2-q2",
                    "prompt": "What is the primary role of freeze authority?",
                    "options": [
                      "Controlling whether specific token cuentas can transfer",
                      "Changing token symbol",
                      "Computing transfer fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freeze authority governs transfer state at cuenta level, not branding or fee math."
                  }
                ]
              }
            ]
          },
          "token-v2-extension-safety-pitfalls": {
            "title": "Extension safety pitfalls: fee configs, delegate abuse, default cuenta state",
            "content": "# Extension safety pitfalls: fee configs, delegate abuse, default cuenta state\n\nToken-2022 extensions let teams express policy in a standard token framework, but policy power is exactly where operational failures happen. Seguridad issues in token launches are rarely exotic cryptography failures. They are usually configuration mistakes: fee caps set too high, delegates granted too broadly, or frozen default states introduced without recovery controls. Production engineering must treat extension configuration as safety-critical logic.\n\nTransfer fee configuration is a good example. A basis-point fee looks simple, yet behavior depends on cap interaction y token decimals. If maxFee is undersized, large transfers saturate quickly y effective fee curve becomes nonlinear. If maxFee is oversized, treasury extraction can exceed expected user tolerance. Deterministic simulations across example transfer sizes are essential before launch, y those simulations should be reviewed by both protocol y product teams.\n\nPermanent delegate is another high-risk feature. It can enable managed flows, but it also creates a privileged actor that may transfer tokens without normal owner signatures depending on policy scope. If delegate authority is not governed by clear controls y revocation procedures, compromise risk rises sharply. In many incidents, teams enabled delegate-like authority para convenience, then discovered too late that gobernanza y monitoring were insufficient.\n\nDefault cuenta state introduces user-experience y compliance implications. A frozen default state can enforce controlled activation, but it also creates onboarding failure if thaw paths are unclear or unavailable in partner carteras. Teams should verify thaw strategy, authority custody, y fallback procedures before enabling frozen defaults in production.\n\nThe safest engineering workflow is deterministic y reviewable: validate config, normalize extension fields, generate initialization plan labels, simulate transfer outcomes, y produce invariant lists. That sequence creates a shared artifact para engineering, seguridad, legal, y support stakeholders. When questions arise, teams can inspect exact intended policy rather than infer from fragmented scripts.\n\nFinally, treat extension combinations as compounded risk. Each extension may be individually reasonable, yet combined authority interactions can create hidden escalation paths. Cross-extension threat modeling is therefore mandatory para serious launches.\n\n## Pitfall: Fee y delegate settings shipped without scenario simulation\n\nTeams often validate only \"happy path\" transfer examples. Without boundary simulations y authority abuse scenarios, dangerous configurations can pass review y surface only after users are affected.\n\n## Sanity Checklist\n\n1. Simulate fee behavior at low/medium/high transfer sizes.\n2. Document delegate authority scope y emergency revocation path.\n3. Verify frozen default cuentas have explicit thaw operations.\n4. Review combined extension authority interactions para escalation risk.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l3-q1",
                    "prompt": "Why does transfer-fee max cap need scenario pruebas?",
                    "options": [
                      "It can materially change effective fee behavior across transfer sizes",
                      "It only affects metadata",
                      "It is ignored once mint is initialized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee cap interacts con basis points y can distort economic behavior if misconfigured."
                  },
                  {
                    "id": "token-v2-l3-q2",
                    "prompt": "What is a core risk of permanent delegate configuration?",
                    "options": [
                      "Privilege concentration if authority gobernanza is weak",
                      "Loss of decimal precision",
                      "Automatic cartera incompatibility"
                    ],
                    "answerIndex": 0,
                    "explanation": "Delegate privileges must be constrained y governed like high-sensitivity access."
                  }
                ]
              }
            ]
          },
          "token-v2-validate-config-derive": {
            "title": "Validate token config + derive deterministic addresses offline",
            "content": "# Validate token config + derive deterministic addresses offline\n\nImplement strict config validation y deterministic pseudo-derivation:\n- validate decimals, u64 strings, recipient totals, extension fields\n- derive stable pseudo mint y ATA addresses from hash seeds\n- return normalized validated config + derivations\n",
            "duration": "35 min",
            "hints": [
              "Validate decimal bounds, u64-like numeric strings, y recipient totals before derivation.",
              "Use one deterministic seed format para mint y one para ATA derivation.",
              "Keep output key order stable so checkpoint tests are reproducible."
            ]
          }
        }
      },
      "token-v2-module-launch-pack": {
        "title": "Token Launch Pack Project",
        "description": "Build deterministic validation, planning, y simulation workflows that produce reviewable launch artifacts y clear go/no-go criteria.",
        "lessons": {
          "token-v2-build-init-plan": {
            "title": "Build Token-2022 initialization instruccion plan",
            "content": "# Build Token-2022 initialization instruccion plan\n\nCreate a deterministic offline initialization plan:\n- create mint cuenta step\n- init mint step con decimals\n- append selected extension steps in stable order\n- base64 encode step payloads con explicit encoding version\n",
            "duration": "35 min",
            "hints": [
              "Add base steps first: create mint cuenta, then initialize mint con decimals.",
              "Append extension steps in deterministic order so plan labels are stable.",
              "Encode each step payload con version + sorted params before base64 conversion."
            ]
          },
          "token-v2-simulate-fees-supply": {
            "title": "Build mint-to + transfer-fee math + simulation",
            "content": "# Build mint-to + transfer-fee math + simulation\n\nImplement pure simulation para transfer fees y launch distribution:\n- fee = min(maxFee, floor(amount * feeBps / 10000))\n- aggregate distribution totals deterministically\n- ensure no negative supply y no oversubscription\n",
            "duration": "35 min",
            "hints": [
              "Transfer fee formula: fee = min(maxFee, floor(amount * feeBps / 10000)).",
              "Aggregate distributed y fee totals using BigInt to keep math exact.",
              "Fail when distributed amount exceeds initial supply."
            ]
          },
          "token-v2-launch-checklist": {
            "title": "Launch checklist: params, upgrade/authority strategy, airdrop/pruebas plan",
            "content": "# Launch checklist: params, upgrade/authority strategy, airdrop/pruebas plan\n\nA successful token launch is an operations exercise as much as a programming task. By the time users see your token in carteras, dozens of choices have already constrained safety, gobernanza, y UX. Production token engineering therefore needs a launch checklist that turns abstract diseno intent into verifiable execution steps.\n\nStart con parameter closure. Name, symbol, decimals, initial supply, authority addresses, extension configuration, y recipient allocations must be finalized y reviewed as one immutable package before execution. Many launch incidents come from late parameter changes made in disconnected scripts. Deterministic launch pack generation prevents this by forcing a single source of truth.\n\nAuthority strategy is the second pillar. Decide which authorities remain active after launch, which are revoked, y which move to multisig custody. A common best practice is staged authority reduction: keep temporary controls through rollout validation, then revoke or transfer to gobernanza once monitoring baselines are stable. This must be planned explicitly, not improvised during launch day.\n\nPruebas strategy should include deterministic offline tests y limited online rehearsal. Offline checks validate config schemas, instruccion payload encoding, fee simulations, y supply invariants. Optional devnet rehearsal validates operational playbooks (funding, sequence execution, monitoring) but should not be your only validation layer. If offline checks fail, devnet success is not meaningful.\n\nAirdrop y distribution planning should include recipient reconciliation y rollback strategy. Teams often focus on minting y forget operational constraints around recipient list correctness, timing windows, y support escalation paths. Deterministic distribution plans con stable labels make reconciliation simpler y reduce accidental double execution.\n\nMonitoring y communication are equally important. Define launch metrics in advance: minted supply observed, distribution completion count, fee behavior sanity, y extension-specific health checks. Publish user-facing notices para any non-obvious behavior such as transfer fees or frozen default cuenta state. Clear communication lowers support load y improves trust.\n\nFinally, write down hard stop conditions. If invariants fail, if authority keys mismatch, or if distribution deltas diverge from expected totals, launch should pause immediately. Engineering discipline means refusing to proceed when safety checks are red.\n\n## Pitfall: Treating launch as a one-shot script run\n\nWithout an explicit checklist y rollback criteria, teams can execute technically valid instrucciones that violate business or gobernanza intent. Successful launches are controlled workflows, not single commands.\n\n## Sanity Checklist\n\n1. Freeze a canonical config payload before execution.\n2. Approve authority lifecycle y revocation milestones.\n3. Run deterministic offline simulation y invariant checks.\n4. Reconcile recipient totals y distribution labels.\n5. Define go/no-go criteria y escalation owners.\n",
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
                      "To prevent script/config drift between review y launch",
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
            "content": "# Emit stable LaunchPackSummary\n\nCompose full project output as stable JSON:\n- normalized authorities y extensions\n- supply totals y optional fee model examples\n- deterministic plan metadata y invariants\n- fixtures hash + encoding version metadata\n",
            "duration": "45 min",
            "hints": [
              "Keep checkpoint JSON key ordering fixed so output is stable.",
              "Compute recipientsTotal y remaining con exact integer math.",
              "Include determinism metadata (fixtures hash + encoding version) in the final object."
            ]
          }
        }
      }
    }
  },
  "solana-mobile": {
    "title": "Solana Mobile Development",
    "description": "Build production-ready mobile Solana dApps con MWA, robust cartera session architecture, explicit signing UX, y disciplined distribution operations.",
    "duration": "6 hours",
    "tags": [
      "mobile",
      "saga",
      "dapp-store",
      "react-native"
    ],
    "modules": {
      "module-mobile-wallet-adapter": {
        "title": "Mobile Cartera Adapter",
        "description": "Core MWA protocol, session lifecycle control, y resilient cartera handoff patterns para production mobile apps.",
        "lessons": {
          "mobile-wallet-overview": {
            "title": "Mobile Cartera Vision general",
            "content": "# Mobile Cartera Vision general\n\nSolana Mobile development is built around the Solana Mobile Stack (SMS), a set of standards y tooling designed para secure, high-quality crypto-native mobile experiences. SMS is more than a hardware initiative; it defines interoperable cartera communications, trusted execution patterns, y distribution infrastructure tailored to Web3 apps.\n\nA core piece is the Mobile Cartera Adapter (MWA) protocol. Instead of embedding private keys in dApps, MWA connects mobile dApps to external cartera apps para authorization, signing, y transaccion submission. This separation mirrors browser cartera seguridad on desktop y prevents dApps from directly handling secret keys.\n\nSaga introduced the first flagship reference device para Solana Mobile concepts, including Seed Vault-oriented workflows. Even when users are not on Saga, SMS standards remain useful because protocol-level interoperability is the target: any cartera implementing MWA can serve compatible apps.\n\nThe Solana dApp Store is another foundational element. It provides a distribution channel para crypto applications con policy considerations better aligned to on-chain apps than traditional app stores. Teams can ship cartera-native functionality, tokenized features, y on-chain social mechanics without the same constraints often imposed by conventional app marketplaces.\n\nKey architectural principles para mobile Solana apps:\n\n- Keep signing in cartera context, not app context.\n- Treat session authorization as revocable y short-lived.\n- Build graceful fallback if cartera app is missing.\n- Optimize para intermittent connectivity y mobile latency.\n\nTypical mobile flow:\n\n1. dApp requests authorization via MWA.\n2. Cartera prompts user to approve cuenta access.\n3. dApp builds transacciones y requests signatures.\n4. Cartera returns signed payload or submits transaccion.\n5. dApp observes confirmation y updates UI.\n\nMobile UX needs explicit state transitions (authorizing, awaiting cartera, signing, submitted, confirmed). Ambiguity causes user drop-off quickly on small screens.\n\nPara Solana teams, mobile is not a “mini web app”; it requires deliberate protocol y UX diseno choices. SMS y MWA provide a secure baseline so developers can ship on-chain experiences con production-grade signing y session models on handheld devices.\n\n## Practico architecture split\n\nTreat your mobile stack as three independent systems:\n1. UI app state y navigation.\n2. Cartera transport/session state (MWA lifecycle).\n3. On-chain transaccion intent y confirmation state.\n\nIf you couple these layers tightly, cartera switch interruptions y app backgrounding can corrupt flow state. If they stay separated, recovery is predictable.\n\n## What users should feel\n\nGood mobile crypto UX is not \"fewer steps at all costs.\" It is clear intent, explicit signing context, y safe recoverability when app switching or network instability happens.\n",
            "duration": "35 min"
          },
          "mwa-integration": {
            "title": "MWA Integration",
            "content": "# MWA Integration\n\nIntegrating Mobile Cartera Adapter typically starts con `@solana-mobile/mobile-wallet-adapter` APIs y an interaction pattern built around `transact()`. Within a transaccion session, the app can authorize, request capabilities, sign transacciones, y handle cartera responses in a structured way.\n\nA simplified integration flow:\n\n```typescript\nimport { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';\n\nawait transact(async (wallet) => {\n  const auth = await wallet.authorize({\n    cluster: 'devnet',\n    identity: { name: 'JazzCode Mobile', uri: 'https://jazzcode.vercel.app' },\n  });\n\n  const account = auth.accounts[0];\n  // build tx, request signing/submission\n});\n```\n\nAuthorization yields one or more cuentas plus auth tokens para session continuation. Persist these tokens carefully y invalidate them on sign-out. Do not assume tokens remain valid forever; cartera apps can revoke sessions.\n\nPara signing, you can request:\n\n- `signTransactions` (sign only)\n- `signAndSendTransactions` (cartera signs y submits)\n- `signMessages` (SIWS-like auth flows)\n\nDeep links are used under the hood to switch between your dApp y cartera. That means state restoration matters: your app should survive process backgrounding y resume pending operation state on return.\n\nPractico engineering tips:\n\n- Implement idempotent transaccion request handling.\n- Show a visible “Waiting para cartera approval” state.\n- Handle user cancellation explicitly, not as generic failure.\n- Retry network submission separately from signing when possible.\n\nSeguridad considerations:\n\n- Bind sessions to app identity metadata.\n- Use short-lived backend nonces para message-sign auth.\n- Never log full signed payloads con sensitive context.\n\nMWA is effectively your mobile signing transport layer. If its state machine is robust, your app feels professional y trustworthy. If state handling is weak, users experience “stuck” flows y may distrust the dApp even if on-chain logic is correct.",
            "duration": "35 min"
          },
          "mobile-transaction": {
            "title": "Build a Mobile Transaccion Function",
            "content": "# Build a Mobile Transaccion Function\n\nImplement a helper that formats a deterministic MWA transaccion request summary string.\n\nExpected output format:\n\n`<cluster>|<payer>|<instructionCount>`\n\nUse this exact order y delimiter.",
            "duration": "50 min",
            "hints": [
              "Add validation before returning the formatted string.",
              "instructionCount should be treated as a number but returned as text.",
              "Throw exact error message para missing payer."
            ]
          }
        }
      },
      "module-dapp-store-and-distribution": {
        "title": "dApp Store & Distribution",
        "description": "Publishing, operational readiness, y trust-centered mobile UX practices para Solana app distribution.",
        "lessons": {
          "dapp-store-submission": {
            "title": "dApp Store Submission",
            "content": "# dApp Store Submission\n\nPublishing to the Solana dApp Store requires more than packaging binaries. Teams should treat submission as a product, compliance, y seguridad review process. A strong submission demonstrates safe cartera interactions, clear user communication, y operational readiness.\n\nSubmission readiness checklist:\n\n- Stable release builds para target Android devices.\n- Clear app identity y support channels.\n- Cartera interaction flows tested para cancellation y failure recovery.\n- Privacy policy y terms aligned to on-chain behaviors.\n- Transparent handling of tokenized features y in-app value flows.\n\nOne distinguishing concept in Solana mobile distribution is token-aware product diseno. Apps may use NFT-gated access, on-chain subscriptions, or tokenized entitlements. These flows must be understandable to users y not hide financial consequences. Review teams typically evaluate whether permissions y cartera prompts are proportional to app behavior.\n\nNFT-based licensing models can be implemented by checking ownership of specific collection assets at runtime. If licensing depends on assets, build robust indexing y refresh behavior so users are not locked out due to temporary RPC/indexer mismatch.\n\nOperational mejores practicas para review success:\n\n- Provide reproducible test cuentas y walkthroughs.\n- Include a “safe mode” or demo path if cartera connection fails.\n- Avoid unexplained signature prompts.\n- Log non-sensitive diagnostics para support.\n\nPost-submission lifecycle matters too. Plan how you will handle urgent fixes, cartera SDK updates, y chain-level incidents. Mobile releases can take time to propagate, so feature flags y backend kill-switches para risky pathways are valuable.\n\nDistribution strategy should also include analytics around onboarding funnels, cartera connect success rates, y transaccion completion rates. These metrics identify mobile-specific friction that desktop-oriented teams often miss.\n\nA successful dApp Store submission reflects secure protocol integration y mature product operations. If your cartera interactions are explicit, fail-safe, y user-centered, your app is far more likely to pass review y retain users in production.",
            "duration": "35 min"
          },
          "mobile-best-practices": {
            "title": "Mobile Mejores practicas",
            "content": "# Mobile Mejores practicas\n\nMobile crypto UX requires balancing speed, safety, y trust. Users make high-stakes decisions on small screens, often on unstable networks. Solana mobile apps should therefore optimize para explicitness y recoverability, not just visual polish.\n\n**Biometric gating** is useful para sensitive local actions (revealing seed-dependent views, exporting cuenta data, approving high-risk actions), but cartera-level signing decisions should remain in cartera app context. Avoid building fake in-app “confirm” screens that look like signing prompts.\n\n**Session keys y scoped auth** improve UX by reducing repetitive approvals. However, scope must be tightly constrained (allowed methods, time window, limits). Session credentials should be revocable y auditable.\n\n**Offline y poor-network behavior** must be handled intentionally:\n\n- Queue non-critical reads.\n- Retry idempotent submissions con backoff.\n- Distinguish “signed but not submitted” from “submitted but unconfirmed.”\n\n**Push notifications** are valuable para transaccion outcomes, liquidation alerts, y gobernanza events. Notifications should include enough context para user safety but never leak sensitive data.\n\nUX patterns that consistently improve conversion:\n\n- Show transaccion simulation summaries before cartera handoff.\n- Display clear statuses: building, awaiting signature, submitted, confirmed.\n- Provide explorer links y retry actions.\n- Use plain-language error messages con suggested fixes.\n\nSeguridad hygiene:\n\n- Pin trusted RPC endpoints or use reputable providers con fallback.\n- Validate cuenta ownership y expected program IDs on all client-side decoded data.\n- Protect analytics pipelines from sensitive payload leakage.\n\nAccessibility y internationalization matter para global adoption. Ensure touch targets, contrast, y localization of risk messages are adequate. Para crypto workflows, misunderstanding can cause irreversible loss.\n\nFinally, measure reality: connect success rate, signature approval rate, drop-off after cartera switch, y average time-to-confirmation. Mobile teams that instrument these metrics can iteratively remove friction y increase trust.\n\nGreat Solana mobile apps feel predictable under stress. If users always understand what they are signing, what state they are in, y how to recover, your product is operating at production quality.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-testing": {
    "title": "Pruebas Solana Programs",
    "description": "Build robust Solana pruebas systems across local, simulated, y network environments con explicit seguridad invariants y release-quality confidence gates.",
    "duration": "6 hours",
    "tags": [
      "testing",
      "bankrun",
      "anchor",
      "devnet"
    ],
    "modules": {
      "module-testing-foundations": {
        "title": "Pruebas Foundations",
        "description": "Core test strategy across unit/integration layers con deterministic workflows y adversarial case coverage.",
        "lessons": {
          "testing-approaches": {
            "title": "Pruebas Approaches",
            "content": "# Pruebas Approaches\n\nPruebas Solana programs requires multiple layers because failures can occur in logic, cuenta validation, transaccion composition, or network behavior. A production pruebas strategy usually combines unit tests, integration tests, y end-to-end validation across local validadores y devnet.\n\n**Unit tests** validate isolated business logic con minimal runtime overhead. In Rust, pure helper functions (math, state transitions, invariant checks) should be unit-tested aggressively because they are easy to execute y fast in CI.\n\n**Integration tests** execute against realistic program invocation paths. Para Anchor projects, this often means `anchor test` con local validador setup, cuenta initialization flows, y instruccion-level assertions. Integration tests should cover both positive y adversarial inputs, including invalid cuentas, unauthorized signers, y boundary values.\n\n**End-to-end tests** include frontend/client composition plus cartera y RPC interactions. They catch issues that lower layers miss: incorrect cuenta ordering, wrong PDA derivations in client code, y serialization mismatches.\n\nCommon tools:\n\n- `solana-program-test` para Rust-side pruebas con in-process banks simulation.\n- `solana-bankrun` para deterministic TypeScript integration pruebas.\n- Anchor TypeScript client para instruccion building y assertions.\n- Playwright/Cypress para app-level transaccion flow tests.\n\nTest coverage priorities:\n\n1. Authorization y signer checks.\n2. Cuenta ownership y PDA seed constraints.\n3. Arithmetic boundaries y fee logic.\n4. CPI behavior y failure rollback.\n5. Upgrade compatibility y migration paths.\n\nA frequent anti-pattern is only pruebas happy paths con one cartera y static inputs. This misses most exploit classes. Robust suites include malicious cuenta substitution, stale or duplicated cuentas, y partial failure simulation.\n\nIn CI, separate fast deterministic suites from slower network-dependent suites. Run deterministic tests on every push, y run heavier devnet suites on merge or release.\n\nEffective Solana pruebas is about confidence under adversarial conditions, not just green checkmarks. If your tests model attacker behavior y cuenta-level edge cases, you will prevent the majority of production incidents before despliegue.\n\n## Practico suite diseno rule\n\nMap every critical instruccion to at least one test in each layer:\n- unit test para pure invariant/math logic\n- integration test para cuenta validation y state transitions\n- environment test para cartera/RPC orchestration\n\nIf one layer is missing, incidents usually appear in that blind spot first.",
            "duration": "35 min"
          },
          "bankrun-testing": {
            "title": "Bankrun Pruebas",
            "content": "# Bankrun Pruebas\n\nSolana Bankrun provides deterministic, high-speed test execution para Solana programs from TypeScript environments. It emulates a local bank-like runtime where transacciones can be processed predictably, cuentas can be inspected directly, y temporal state can be manipulated para pruebas scenarios like vesting unlocks or oracle staleness.\n\nCompared con relying on external devnet, Bankrun gives repeatability. This is crucial para CI pipelines where flaky network behavior can mask regressions.\n\nTypical Bankrun workflow:\n\n1. Start test context con target program loaded.\n2. Create keypairs y funded test cuentas.\n3. Build y process transacciones via BanksClient-like API.\n4. Assert post-transaccion cuenta state.\n5. Advance slots/time para time-dependent logic tests.\n\nConceptual setup:\n\n```typescript\n// pseudocode\nconst context = await startBankrun({ programs: [...] });\nconst client = context.banksClient;\n\n// process tx and inspect accounts deterministically\n```\n\nWhy Bankrun is powerful:\n\n- Fast iteration para protocol teams.\n- Deterministic block/slot control.\n- Rich cuenta inspection without explorer dependency.\n- Easy simulation of multi-step protocol flows.\n\nHigh-value Bankrun test scenarios:\n\n- Liquidation eligibility after oracle/time movement.\n- Vesting y cliff unlock schedule transitions.\n- Fee accumulator updates across many operations.\n- CPI behavior con mocked downstream cuenta states.\n\nCommon mistakes:\n\n- Asserting only transaccion success without state validation.\n- Ignoring rent y cuenta lamport changes.\n- Not pruebas replay/idempotency behaviors.\n\nUse helper factories para test cuentas y PDA derivations so tests remain concise. Keep transaccion builders in reusable utilities to avoid drift between test y production clients.\n\nBankrun is not a replacement para all environments, but it is one of the best layers para deterministic integration confidence on Solana. Teams that invest in comprehensive Bankrun suites tend to catch state-machine bugs significantly earlier than teams relying only on devnet smoke tests.",
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
        "title": "Avanzado Pruebas",
        "description": "Fuzzing, devnet validation, y CI/CD release controls para safer protocol changes.",
        "lessons": {
          "fuzzing-trident": {
            "title": "Fuzzing con Trident",
            "content": "# Fuzzing con Trident\n\nFuzzing explores large input spaces automatically to find bugs that handcrafted tests miss. Para Solana y Anchor programs, Trident-style fuzzing workflows generate randomized instruccion sequences y parameter values, then check invariants such as “total supply never decreases incorrectly” or “vault liabilities never exceed assets.”\n\nUnlike unit tests that validate expected examples, fuzzing asks: what if inputs are weird, extreme, or adversarial in combinations we did not think about?\n\nCore fuzzing components:\n\n- **Generators** para instruccion inputs y cuenta states.\n- **Harness** that executes generated transacciones.\n- **Invariants** that must always hold.\n- **Shrinking** to minimize failing inputs para debugging.\n\nUseful invariants in DeFi protocols:\n\n- Conservation of value across transfers y burns.\n- Non-negative balances y debt states.\n- Authority invariants (only valid signer modifies privileged state).\n- Price y collateral constraints under liquidation logic.\n\nFuzzing strategy tips:\n\n- Start con a small instruccion set y one invariant.\n- Add stateful multi-step scenarios (deposit->borrow->repay->withdraw).\n- Include random cuenta ordering y malicious cuenta substitution cases.\n- Track coverage to avoid blind spots.\n\nCoverage analysis matters: if fuzzing never reaches critical branches (error paths, CPI failure handlers, liquidation branches), it gives false confidence. Integrate branch coverage tools where possible.\n\nTrident y similar fuzzers are especially good at discovering arithmetic edge cases, stale state assumptions, y unexpected state transitions from unusual call sequences.\n\nCI integration approach:\n\n- Run short fuzz campaigns on every PR.\n- Run longer campaigns nightly.\n- Persist failing seeds as regression tests.\n\nFuzzing should complement, not replace, deterministic tests. Deterministic suites provide explicit behavior guarantees; fuzzing provides adversarial exploration at scale.\n\nPara serious Solana protocols handling user funds, fuzzing is no longer optional. It is one of the highest-leverage investments para preventing unknown-unknown bugs before mainnet exposure.",
            "duration": "35 min"
          },
          "devnet-testing": {
            "title": "Devnet Pruebas",
            "content": "# Devnet Pruebas\n\nDevnet pruebas bridges the gap between deterministic local tests y real-world network conditions. While local validadores y Bankrun are ideal para speed y reproducibility, devnet reveals behavior under real RPC latency, block production timing, fee markets, y cuenta history constraints.\n\nA robust devnet test strategy includes:\n\n- Automated program despliegue to a dedicated devnet keypair.\n- Deterministic fixture creation (airdrop, mint setup, PDAs).\n- Smoke tests para critical instruccion paths.\n- Monitoring of transaccion confirmation y log outputs.\n\nImportant devnet caveats:\n\n- State is shared y can be noisy.\n- Airdrop limits can throttle tests.\n- RPC providers may differ in reliability y rate limits.\n\nTo reduce flakiness:\n\n- Use dedicated namespaces/seeds per CI run.\n- Add retries para transient network failures.\n- Bound test runtime y fail con actionable logs.\n\nProgram upgrade pruebas is particularly important on devnet. Validate that new binaries preserve cuenta compatibility y migrations execute as expected. Incompatible changes can brick existing cuentas if not tested.\n\nChecklist para release-candidate validation:\n\n1. Deploy upgraded program binary.\n2. Run migration instrucciones.\n3. Execute backward-compatibility read paths.\n4. Execute all critical write instrucciones.\n5. Verify event/log schema expected by indexers.\n\nPara financial protocols, include oracle integration tests y liquidation path checks against live-like feeds if possible.\n\nDevnet should not be your only quality gate, but it is the best pre-mainnet signal para environment-related issues. Teams that ship without meaningful devnet validation often discover RPC edge cases y timing bugs in production.\n\nTreat devnet as a staging environment con disciplined test orchestration, clear observability, y explicit rollback plans.",
            "duration": "35 min"
          },
          "ci-cd-pipeline": {
            "title": "CI/CD Pipeline para Solana",
            "content": "# CI/CD Pipeline para Solana\n\nA mature Solana CI/CD pipeline enforces quality gates across code, tests, seguridad checks, y despliegue workflows. Para program teams, CI is not just linting Rust y TypeScript; it is about protecting on-chain invariants before irreversible releases.\n\nRecommended pipeline stages:\n\n1. **Static checks**: formatting, lint, type checks.\n2. **Unit/integration tests**: deterministic local execution.\n3. **Seguridad checks**: dependency scan, optional static analyzers.\n4. **Build artifacts**: reproducible program binaries.\n5. **Staging deploy**: optional devnet despliegue y smoke tests.\n6. **Manual approval** para production deploy.\n\nGitHub Actions is a common choice. A typical workflow matrix runs Rust y Node tasks in parallel to reduce cycle time. Cache Cargo y pnpm dependencies aggressively.\n\nExample conceptual workflow snippets:\n\n```yaml\n- run: cargo test --workspace\n- run: pnpm lint && pnpm typecheck && pnpm test\n- run: anchor build\n- run: anchor test --skip-local-validator\n```\n\nPara deployments:\n\n- Store deploy keypairs in secure secrets management.\n- Restrict deploy jobs to protected branches/tags.\n- Emit program IDs y transaccion signatures as artifacts.\n\nProgram verification is critical. Where possible, verify deployed binary matches source-controlled build output. This strengthens trust y simplifies audits.\n\nOperational safety practices:\n\n- Use feature flags para high-risk logic activation.\n- Keep rollback strategy documented.\n- Monitor post-deploy metrics (error rates, failed tx ratio, latency).\n\nInclude regression tests para previously discovered bugs. Every production incident should produce a permanent automated test.\n\nA strong CI/CD pipeline is an engineering control, not a convenience. It reduces release risk, accelerates safe iteration, y provides confidence that code changes preserve seguridad y protocol correctness under production conditions.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-indexing": {
    "title": "Solana Indexing & Analytics",
    "description": "Build a production-grade Solana event indexer con deterministic decoding, resilient ingestion contracts, checkpoint recovery, y analytics outputs teams can trust.",
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
        "description": "Events model, token decoding, y transaccion parsing fundamentals con schema discipline y deterministic normalization.",
        "lessons": {
          "indexing-v2-events-model": {
            "title": "Events model: transacciones, logs, y program instrucciones",
            "content": "# Events model: transacciones, logs, y program instrucciones\n\nIndexing Solana starts con understanding where data lives y how to extract structured events from raw chain data. Unlike EVM chains where events are explicit log topics, Solana encodes program state changes in cuenta updates y program logs. Your indexer must parse these sources y transform them into a queryable event stream.\n\nA transaccion on Solana contains one or more instrucciones. Each instruccion targets a program, includes cuenta metas, y carries opaque instruccion data. When executed, programs emit log entries via solana_program::msg or similar macros. These logs, combined con pre/post cuenta states, form the raw material para event indexing.\n\nThe indexer pipeline typically follows: fetch → parse → normalize → store. Fetch retrieves transaccion metadata via RPC or geyser plugins. Parse extracts program logs y cuenta diffs. Normalize converts raw data into domain-specific events con stable schemas. Store persists events con appropriate indexing para queries.\n\nKey concepts para normalization: instruccion program IDs identify which decoder to apply, cuenta ownership determines data layout, y log prefixes often indicate event types (e.g., \"Transfer\", \"Mint\", \"Burn\"). Your indexer must handle multiple program versions gracefully, maintaining backward compatibility as instruccion layouts evolve.\n\nIdempotency is critical. Block reorganizations are rare on Solana but possible during forks. Your indexing pipeline should handle replayed transacciones without duplicating events. This typically means using transaccion signatures as unique keys y implementing upsert semantics in the storage layer.\n\n## Operator modelo mental\n\nTreat your indexer as a data product con explicit contracts:\n1. ingest contract (what raw inputs are accepted),\n2. normalization contract (stable event schema),\n3. serving contract (what query consumers can rely on).\n\nWhen these contracts are versioned y documented, protocol upgrades become manageable instead of breaking downstream analytics unexpectedly.\n\n## Checklist\n- Understand transaccion → instrucciones → logs hierarchy\n- Identify program IDs y cuenta ownership para data layout selection\n- Normalize raw logs into domain events con stable schemas\n- Implement idempotent ingestion using transaccion signatures\n- Plan para program version evolution in decoders\n\n## Red flags\n- Parsing logs without validating program IDs\n- Assuming fixed cuenta ordering across program versions\n- Missing idempotency leading to duplicate events\n- Storing raw data without normalized event extraction\n",
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
                      "Program logs y cuenta state changes",
                      "Explicit event topics like EVM",
                      "Validador consensus messages"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana programs emit events via logs y state changes, not explicit event topics."
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
                    "explanation": "Idempotent ingestion ensures the same transaccion processed twice creates only one event."
                  }
                ]
              }
            ]
          },
          "indexing-v2-token-decoding": {
            "title": "Token cuenta decoding y SPL layout",
            "content": "# Token cuenta decoding y SPL layout\n\nSPL Token cuentas follow a standardized binary layout that indexers must parse to track balances y mint operations. Understanding this layout enables you to extract meaningful data from raw cuenta bytes without relying on external APIs.\n\nA token cuenta contains: mint address (32 bytes), owner address (32 bytes), amount (8 bytes u64), delegate (32 bytes, optional), state (1 byte), is_native (1 byte + 8 bytes if native), delegated_amount (8 bytes), y close_authority (36 bytes optional). The total size is typically 165 bytes para standard cuentas.\n\nCuenta discriminators help identify cuenta types. SPL Token cuentas are owned by the Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) or Token-2022. Your indexer should verify ownership before attempting to parse, as malicious cuentas could mimic data layouts.\n\nDecoding involves: read the 32-byte mint, verify it matches expected token, read the 64-bit amount (little-endian), convert to decimal representation using mint decimals, y track owner para balance aggregation. Always handle malformed data gracefully - truncated cuentas or unexpected sizes should not crash the indexer.\n\nPara balance diffs, compare pre-transaccion y post-transaccion states. A transfer emits no explicit event but changes two cuenta amounts. Your indexer must detect these changes by comparing states before y after instruccion execution.\n\n## Checklist\n- Verify token program ownership before parsing\n- Decode mint, owner, y amount fields correctly\n- Handle little-endian u64 conversion properly\n- Support both Token y Token-2022 programs\n- Implement graceful handling para malformed cuentas\n\n## Red flags\n- Parsing without ownership verification\n- Ignoring mint decimals in amount conversion\n- Assuming fixed cuenta sizes without bounds checking\n- Missing balance diff detection para transfers\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexing-v2-l2-token-explorer",
                "title": "Token Cuenta Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "SPL Token Cuenta",
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
                    "prompt": "What is the standard size of an SPL Token cuenta?",
                    "options": [
                      "165 bytes",
                      "64 bytes",
                      "256 bytes"
                    ],
                    "answerIndex": 0,
                    "explanation": "Standard SPL Token cuentas are 165 bytes, containing mint, owner, amount, y optional fields."
                  },
                  {
                    "id": "indexing-v2-l2-q2",
                    "prompt": "How should amount be interpreted from token cuenta data?",
                    "options": [
                      "As little-endian u64, then divided by 10^decimals",
                      "As big-endian u32 directly",
                      "As ASCII string"
                    ],
                    "answerIndex": 0,
                    "explanation": "Amounts are stored as little-endian u64 y must be converted using the mint's decimal places."
                  }
                ]
              }
            ]
          },
          "indexing-v2-decode-token-account": {
            "title": "Challenge: Decode token cuenta + diff token balances",
            "content": "# Challenge: Decode token cuenta + diff token balances\n\nImplement deterministic token cuenta decoding y balance diffing:\n\n- Parse a 165-byte SPL Token cuenta layout\n- Extract mint, owner, y amount fields\n- Compute balance differences between pre/post states\n- Return normalized event objects con stable ordering\n\nYour solution will be validated against multiple test cases con various token cuenta states.",
            "duration": "45 min",
            "hints": [
              "SPL Token cuenta layout: mint (32B), owner (32B), amount (8B LE u64)",
              "Use little-endian byte order para the amount field",
              "Convert bytes to base58 para Solana addresses"
            ]
          },
          "indexing-v2-transaction-meta": {
            "title": "Transaccion meta parsing: logs, errors, y inner instrucciones",
            "content": "# Transaccion meta parsing: logs, errors, y inner instrucciones\n\nTransaccion metadata provides the context needed to index complex operations. Understanding how to parse logs, handle errors, y traverse inner instrucciones enables comprehensive event extraction.\n\nProgram logs follow a hierarchical structure. The outermost logs show instruccion execution order, while inner logs reveal CPI calls. Each log line typically includes a prefix indicating severity or type: \"Program\", \"Invoke\", \"Success\", \"Fail\", or custom program messages. Your parser should handle nested invocation levels correctly.\n\nError handling distinguishes between transaccion-level failures y instruccion-level failures. A transaccion may succeed overall while individual instrucciones fail (y are rolled back). Conversely, a single failing instruccion can cause the entire transaccion to fail. Indexers should record these distinctions para accurate analytics.\n\nInner instrucciones reveal the complete execution trace. When a program makes CPI calls, these appear as inner instrucciones in transaccion metadata. Indexers must traverse both top-level y inner instrucciones to capture all state changes. This is especially important para protocols like Jupiter that route through multiple DEXs.\n\nLog filtering improves efficiency. Rather than parsing all logs, indexers can filter by program ID prefixes or known event signatures. However, be cautious - aggressive filtering might miss important events during protocol upgrades or edge cases.\n\n## Checklist\n- Parse program logs con proper nesting level tracking\n- Distinguish transaccion-level from instruccion-level errors\n- Traverse inner instrucciones para complete CPI traces\n- Implement efficient log filtering by program ID\n- Handle both success y failure scenarios\n\n## Red flags\n- Ignoring inner instrucciones y missing CPI events\n- Treating all log failures as transaccion failures\n- Parsing without log level/depth context\n- Missing error context in indexed events\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "indexing-v2-l4-logs",
                "title": "Log Structure Example",
                "steps": [
                  {
                    "cmd": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
                    "output": "Program log: Instruccion: Transfer",
                    "note": "Top-level instruccion at depth 1"
                  },
                  {
                    "cmd": "Program 11111111111111111111111111111111 invoke [2]",
                    "output": "Program log: Create cuenta",
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
        "description": "Build end-to-end indexer pipeline behavior: idempotent ingestion, checkpoint recovery, y analytics aggregation at production scale.",
        "lessons": {
          "indexing-v2-index-transactions": {
            "title": "Challenge: Index transacciones to normalized events",
            "content": "# Challenge: Index transacciones to normalized events\n\nImplement a transaccion indexer that produces normalized Event objects:\n\n- Parse instruccion logs y identify event types\n- Extract transfer events con from/to/amount/mint\n- Handle multiple events per transaccion\n- Return stable, canonical JSON con sorted keys\n- Support idempotency via transaccion signature deduplication",
            "duration": "50 min",
            "hints": [
              "Parse log entries to identify event types",
              "Extract fields using regex patterns",
              "Include transaccion signature para traceability",
              "Sort events by index para deterministic output"
            ]
          },
          "indexing-v2-pagination-caching": {
            "title": "Pagination, checkpointing, y caching semantics",
            "content": "# Pagination, checkpointing, y caching semantics\n\nProduction indexers must handle large datasets efficiently while maintaining consistency. Pagination, checkpointing, y caching form the backbone of scalable indexing infrastructure.\n\nPagination strategies depend on query patterns. Cursor-based pagination using transaccion signatures provides stable ordering even during concurrent writes. Offset-based pagination can miss or duplicate entries during high-write periods. Para time-series data, consider partitioning by slot or block time.\n\nCheckpointing enables recovery from failures. Indexers should periodically save their processing position (last processed slot/signature) to durable storage. On restart, resume from the checkpoint rather than re-indexing from genesis. This pattern is essential para long-running indexers handling months of chain history.\n\nCaching reduces redundant RPC calls. Cuenta metadata, program IDs, y decoded instruccion layouts can be cached con appropriate TTLs. However, cache invalidation is critical - stale cache entries can lead to incorrect decoding or missed events. Consider using slot-based versioning para cache entries.\n\nIdempotent writes prevent data corruption. Even con checkpointing, duplicate processing can occur during retries. Use transaccion signatures as unique identifiers y implement upsert semantics. Database constraints or unique indexes should enforce this at the storage layer.\n\n## Checklist\n- Implement cursor-based pagination para stable ordering\n- Save periodic checkpoints para failure recovery\n- Cache cuenta metadata con slot-based invalidation\n- Enforce idempotent writes via unique constraints\n- Handle backfills without duplicating events\n\n## Red flags\n- Using offset pagination para high-write datasets\n- Missing checkpointing requiring full re-index on restart\n- Caching without proper invalidation strategies\n- Allowing duplicate events from retry logic\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexing-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l6-q1",
                    "prompt": "Why is cursor-based pagination preferred para indexing?",
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
            "title": "Analytics aggregation: per cartera, per token metrics",
            "content": "# Analytics aggregation: per cartera, per token metrics\n\nRaw event data becomes valuable through aggregation. Building analytics pipelines enables insights into user behavior, token flows, y protocol usage patterns.\n\nPer-cartera analytics track individual user activity. Key metrics include: transaccion count, unique tokens held, total volume transferred, first/last activity timestamps, y interaction patterns con specific programs. These metrics power user segmentation y engagement analysis.\n\nPer-token analytics track asset-level metrics. Important aggregations include: total transfer volume, unique holders, holder distribution (whales vs retail), velocity (average time between transfers), y cross-program usage. These inform tokenomics analysis y market research.\n\nTime-windowed aggregations support trend analysis. Daily, weekly, y monthly rollups enable comparison across time periods. Consider using tumbling windows para fixed periods or sliding windows para moving averages. Materialized views can pre-compute common aggregations para query rendimiento.\n\nNormalization ensures consistent comparisons. Convert all amounts to human-readable decimals, normalize timestamps to UTC, y use consistent address formatting (base58). Deduplicate events from failed transacciones that may still appear in logs.\n\n## Checklist\n- Aggregate per-cartera metrics (volume, token count, activity)\n- Aggregate per-token metrics (holders, velocity, distribution)\n- Implement time-windowed rollups para trend analysis\n- Normalize amounts, timestamps, y addresses\n- Exclude failed transacciones from aggregates\n\n## Red flags\n- Mixing raw y decimal-adjusted amounts\n- Including failed transacciones in volume metrics\n- Missing time normalization across timezones\n- Storing unbounded raw data without aggregation\n",
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
                      "label": "Cartera Summary",
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
            "content": "# Checkpoint: Produce stable JSON analytics summary\n\nImplement the final analytics checkpoint that produces a deterministic summary:\n\n- Aggregate events into per-cartera y per-token metrics\n- Generate sorted, stable JSON output\n- Include timestamp y summary statistics\n- Handle edge cases (empty datasets, single events)\n\nThis checkpoint validates your complete indexing pipeline from raw data to analytics.",
            "duration": "50 min",
            "hints": [
              "Aggregate events by cartera address",
              "Sum transaccion counts y volumes",
              "Sort output arrays by address para determinism",
              "Include metadata like timestamps"
            ]
          }
        }
      }
    }
  },
  "solana-payments": {
    "title": "Solana Payments & Checkout Flows",
    "description": "Build production-grade Solana payment flows con robust validation, replay-safe idempotency, secure webhooks, y deterministic receipts para reconciliation.",
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
        "description": "Address validation, idempotency strategy, y payment intent diseno para reliable checkout behavior.",
        "lessons": {
          "payments-v2-address-validation": {
            "title": "Address validation y memo strategies",
            "content": "# Address validation y memo strategies\n\nPayment flows on Solana require robust address validation y thoughtful memo strategies. Unlike traditional payment systems con cuenta numbers, Solana uses base58-encoded public keys that must be validated before any value transfer.\n\nAddress validation involves three layers: format validation, derivation check, y ownership verification. Format validation ensures the string is valid base58 y decodes to 32 bytes. Derivation check optionally verifies the address is on the Ed25519 curve (para cartera addresses) or off-curve (para PDAs). Ownership verification confirms the cuenta exists y is owned by the expected program.\n\nMemos attach metadata to payments. The SPL Memo program enables attaching UTF-8 strings to transacciones. Common use cases include: order IDs, invoice references, customer identifiers, y compliance data. Memos are not encrypted y are visible on-chain, so never include sensitive information.\n\nMemo mejores practicas: keep under 256 bytes para efficiency, use structured formats (JSON) para machine parsing, include versioning para future compatibility, y hash sensitive identifiers rather than storing them plaintext. Consider using deterministic memo formats that can be regenerated from payment context para idempotency checks.\n\nAddress poisoning is an attack vector where attackers create addresses visually similar to legitimate ones. Countermeasures include: displaying addresses con checksums, using name services (Solana Name Service, Bonfida) where appropriate, y implementing confirmation steps para large transfers.\n\n## Merchant-safe memo template\n\nA practico memo format is:\n`v1|order:<id>|shop:<merchantId>|nonce:<shortHash>`\n\nThis keeps memos short, parseable, y versioned while avoiding direct storage of sensitive user details.\n\n## Checklist\n- Validate base58 encoding y 32-byte length\n- Distinguish between on-curve y off-curve addresses\n- Verify cuenta ownership para program-specific payments\n- Use SPL Memo program para structured metadata\n- Implement address poisoning protections\n\n## Red flags\n- Transferring to unvalidated addresses\n- Storing sensitive data in plaintext memos\n- Skipping ownership checks para token cuentas\n- Trusting visually similar addresses without verification\n",
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
                      "Attach metadata like order IDs to transacciones",
                      "Encrypt payment amounts",
                      "Replace transaccion signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL Memo allows attaching public metadata to transacciones para reference y tracking."
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
            "title": "Idempotency keys y replay protection",
            "content": "# Idempotency keys y replay protection\n\nPayment systems must handle network failures gracefully. Idempotency ensures that retrying a failed request produces the same outcome as the original, preventing duplicate charges y inconsistent state.\n\nIdempotency keys are unique identifiers generated by clients para each payment intent. The server stores processed keys y their outcomes, returning cached results para duplicate submissions. Keys should be: globally unique (UUID v4), client-generated, y persisted con sufficient TTL to handle extended retry windows.\n\nKey generation strategies include: UUID v4 con timestamp prefix, hash of payment parameters (amount, recipient, timestamp), or structured keys combining merchant ID y local sequence numbers. The key must be stable across retries but unique across distinct payments.\n\nReplay protection prevents malicious or accidental re-execution. Beyond idempotency, transacciones should include: recent blockhash freshness (prevents old transaccion replay), durable nonce para offline signing scenarios, y amount/time bounds where applicable.\n\nError classification affects retry behavior. Network errors warrant retries con exponential backoff. Validation errors (insufficient funds, invalid address) should fail fast without retry. Timeout errors require careful handling - the payment may have succeeded, so query status before retrying.\n\n## Checklist\n- Generate unique idempotency keys para each payment intent\n- Store processed keys con outcomes para deduplication\n- Implement appropriate TTL based on retry windows\n- Use recent blockhash para transaccion freshness\n- Classify errors para appropriate retry strategies\n\n## Red flags\n- Allowing duplicate payments from retries\n- Generating idempotency keys server-side only\n- Ignoring timeout ambiguity in status checking\n- Storing keys without expiration\n",
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
                    "note": "Confirm triggers transaccion building"
                  },
                  {
                    "cmd": "GET /v1/payment-intents/pi_123",
                    "output": "{\"id\":\"pi_123\",\"status\":\"succeeded\",\"signature\":\"abc123\"}",
                    "note": "Poll para final status"
                  }
                ]
              }
            ]
          },
          "payments-v2-payment-intent": {
            "title": "Challenge: Create payment intent con validation",
            "content": "# Challenge: Create payment intent con validation\n\nImplement a payment intent creator con full validation:\n\n- Validate recipient address format (base58, 32 bytes)\n- Validate amount (positive, within limits)\n- Generate deterministic idempotency key\n- Return structured payment intent object\n- Handle edge cases (zero amount, invalid address)\n\nYour implementation will be tested against various valid y invalid inputs.",
            "duration": "45 min",
            "hints": [
              "Use base58 alphabet to validate the recipient address format.",
              "Convert base58 to bytes y check the length equals 32.",
              "Generate an idempotency key if not provided in the input."
            ]
          },
          "payments-v2-tx-building": {
            "title": "Transaccion building y key metadata",
            "content": "# Transaccion building y key metadata\n\nBuilding payment transacciones requires careful attention to instruccion construction, cuenta metadata, y program interactions. The goal is creating valid, efficient transacciones that minimize fees while ensuring correctness.\n\nInstruccion construction follows a pattern: identify the program (System Program para SOL transfers, Token Program para SPL transfers), prepare cuenta metas con correct writable/signer flags, serialize instruccion data according to the program's layout, y compute the transaccion message con all required fields.\n\nCuenta metadata is critical. Para SOL transfers, you need: from (signer + writable), to (writable). Para SPL transfers: token cuenta from (signer + writable), token cuenta to (writable), owner (signer), y potentially a delegate if using delegated transfer. Missing or incorrect flags cause runtime failures.\n\nFee optimization strategies include: batching multiple payments into one transaccion (up to compute unit limits), using address lookup tables (ALTs) para cuentas referenced multiple times, y setting appropriate compute unit limits to avoid overpaying para simple operations.\n\nTransaccion validation before submission: verify all required signatures are present, check recent blockhash is fresh, estimate compute units if possible, y validate instruccion data encoding matches the expected layout.\n\n## Checklist\n- Set correct writable/signer flags on all cuentas\n- Use appropriate program para transfer type (SOL vs SPL)\n- Validate instruccion data encoding\n- Include recent blockhash para freshness\n- Consider batching para multiple payments\n\n## Red flags\n- Missing signer flags on fee payer\n- Incorrect writable flags on recipient cuentas\n- Using wrong program ID para token type\n- Stale blockhash causing transaccion rejection\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "payments-v2-l4-tx-structure",
                "title": "Transaccion Structure",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Transfer Instruccion",
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
        "description": "Transaccion building, webhook authenticity checks, y deterministic receipt generation con clear error-state handling.",
        "lessons": {
          "payments-v2-transfer-tx": {
            "title": "Challenge: Build transfer transaccion",
            "content": "# Challenge: Build transfer transaccion\n\nImplement a transfer transaccion builder:\n\n- Build SystemProgram.transfer para SOL transfers\n- Build TokenProgram.transfer para SPL transfers\n- Return instruccion bundle con correct key metadata\n- Include fee payer y blockhash\n- Support deterministic output para pruebas",
            "duration": "50 min",
            "hints": [
              "SystemProgram.transfer uses instruccion index 2 con u64 lamports (little-endian).",
              "TokenProgram.transferChecked uses instruccion index 12 con u64 amount + u8 decimals.",
              "Key order matters: SOL transfer needs [from, to], SPL transfer needs [source, mint, dest, owner]."
            ]
          },
          "payments-v2-webhooks": {
            "title": "Webhook signing y verification",
            "content": "# Webhook signing y verification\n\nWebhooks enable asynchronous payment notifications. Seguridad requires cryptographic signing so recipients can verify webhook authenticity y detect tampering.\n\nWebhook signing uses HMAC-SHA256 con a shared secret. The sender computes: signature = HMAC-SHA256(secret, payload). The signature is included in a header (e.g., X-Webhook-Signature). Recipients recompute the HMAC y compare, using constant-time comparison to prevent timing attacks.\n\nPayload canonicalization ensures consistent signing. JSON objects must be serialized con: sorted keys (alphabetical), no extra whitespace, consistent number formatting, y UTF-8 encoding. Without canonicalization, {\"a\":1,\"b\":2} y {\"b\":2,\"a\":1} produce different signatures.\n\nIdempotency in webhooks prevents duplicate processing. Webhook payloads should include an idempotency key or event ID. Recipients store processed IDs y ignore duplicates. This handles retries from the sender y network-level duplicates.\n\nSeguridad mejores practicas: rotate secrets periodically, use different secrets per environment (dev/staging/prod), include timestamps y reject old webhooks (e.g., >5 minutes), y verify IP allowlists where feasible. Never include sensitive data like private keys or full card numbers in webhooks.\n\n## Checklist\n- Sign webhooks con HMAC-SHA256 y shared secret\n- Canonicalize JSON payloads con sorted keys\n- Include event ID para idempotency\n- Verify signatures con constant-time comparison\n- Implement timestamp validation\n\n## Red flags\n- Unsigned webhooks trusting sender IP alone\n- Non-canonical JSON causing verification failures\n- Missing idempotency handling duplicate events\n- Including secrets or sensitive data in payload\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "payments-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "payments-v2-l6-q1",
                    "prompt": "Why is JSON canonicalization important para webhooks?",
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
                    "prompt": "What algorithm is standard para webhook signing?",
                    "options": [
                      "HMAC-SHA256",
                      "MD5",
                      "RSA-512"
                    ],
                    "answerIndex": 0,
                    "explanation": "HMAC-SHA256 provides strong seguridad y is widely supported across languages."
                  }
                ]
              }
            ]
          },
          "payments-v2-error-states": {
            "title": "Error state machine y receipt format",
            "content": "# Error state machine y receipt format\n\nPayment flows require well-defined state machines to handle the complexity of asynchronous confirmations, failures, y retries. Clear state transitions y receipt formats ensure reliable payment tracking.\n\nPayment states typically include: pending (intent created, not yet submitted), processing (transaccion submitted, awaiting confirmation), succeeded (transaccion confirmed, payment complete), failed (transaccion failed or rejected), y cancelled (intent explicitly cancelled before submission). Each state has valid transitions y terminal states.\n\nState transition rules: pending can transition to processing, cancelled, or failed; processing can transition to succeeded or failed; succeeded y failed are terminal. Invalid transitions (e.g., succeeded → failed) indicate bugs or data corruption.\n\nReceipt format standardization enables interoperability. A payment receipt should include: payment intent ID, transaccion signature (if submitted), amount y currency, recipient address, timestamp, status, y verification data (e.g., explorer link). Receipts should be JSON con canonical ordering para deterministic hashing.\n\nExplorer links provide transparency. Para Solana, construct explorer URLs using: https://explorer.solana.com/tx/{signature}?cluster={network}. Include these in receipts y webhook payloads so users can verify transacciones independently.\n\n## Checklist\n- Define clear payment states y valid transitions\n- Implement state machine validation\n- Generate standardized receipt JSON\n- Include explorer links para verification\n- Handle all terminal states appropriately\n\n## Red flags\n- Ambiguous states without clear definitions\n- Missing terminal state handling\n- Non-deterministic receipt formats\n- No explorer links para verification\n",
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
                    "note": "Transaccion submitted, awaiting confirmation"
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
            "title": "Challenge: Verify webhook y produce receipt",
            "content": "# Challenge: Verify webhook y produce receipt\n\nImplement the final payment flow checkpoint:\n\n- Verify signed webhook signature (HMAC-SHA256)\n- Extract payment details from payload\n- Generate standardized receipt JSON\n- Include explorer link y verification data\n- Ensure deterministic, sorted output\n\nThis validates the complete payment flow from intent to receipt.",
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
    "description": "Master compressed NFT engineering on Solana: Merkle commitments, proof systems, collection modeling, y production seguridad checks.",
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
        "description": "Tree construction, leaf hashing, insertion mechanics, y the on-chain/off-chain commitment model behind compressed assets.",
        "lessons": {
          "cnft-v2-merkle-trees": {
            "title": "Merkle trees para state compression",
            "content": "# Merkle trees para state compression\n\nCompressed NFTs (cNFTs) on Solana use Merkle trees to dramatically reduce storage costs. Understanding Merkle trees is essential para working con compressed NFTs y building compression-aware applications.\n\nA Merkle tree is a binary hash tree where each leaf node contains a hash of data, y each non-leaf node contains the hash of its children. The root hash commits to the entire tree structure y all leaf data. This structure enables efficient proofs of inclusion without revealing the entire dataset.\n\nTree construction follows a bottom-up approach: hash each data element to create leaves, pair adjacent leaves y hash their concatenation to create parents, y repeat until a single root remains. Para odd numbers of nodes, the last node is typically promoted to the next level or paired con a zero hash depending on the implementation.\n\nSolana's cNFT implementation uses concurrent Merkle trees con 16-bit depth (max 65,536 leaves). The tree state is stored on-chain as a small cuenta containing just the root hash y metadata. Actual leaf data (NFT metadata) is stored off-chain, typically via RPC providers or indexers.\n\nKey properties of Merkle trees: any leaf change affects the root, inclusion proofs require only log2(n) hashes, y the root serves as a cryptographic commitment to all data. These properties enable state compression while maintaining verifiability.\n\n## Practico cNFT architecture rule\n\nTreat compressed NFT systems as two synchronized layers:\n1. on-chain commitment layer (tree root + update rules),\n2. off-chain data layer (metadata + indexing + proof serving).\n\nIf either layer is weakly validated, ownership y metadata trust can diverge.\n\n## Checklist\n- Understand binary hash tree construction\n- Know how leaf changes propagate to the root\n- Calculate proof size: log2(n) hashes para n leaves\n- Recognize depth limits (16-bit = 65,536 max leaves)\n- Understand on-chain vs off-chain data split\n\n## Red flags\n- Treating Merkle roots as data storage (they're commitments)\n- Ignoring depth limits when planning collections\n- Storing sensitive data assuming it's \"hidden\" in the tree\n- Not validating proofs against the current root\n",
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
                      "The entire tree structure y all leaf data",
                      "Only the first y last leaf",
                      "The tree depth only"
                    ],
                    "answerIndex": 0,
                    "explanation": "The root is a cryptographic commitment to all leaves y their positions in the tree."
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
                    "explanation": "Proof size is log2(65536) = 16, making verification efficient even para large collections."
                  }
                ]
              }
            ]
          },
          "cnft-v2-leaf-hashing": {
            "title": "Leaf hashing conventions y metadata",
            "content": "# Leaf hashing conventions y metadata\n\nLeaf hashing determines how NFT metadata is committed to the Merkle tree. Understanding these conventions ensures compatibility con compression standards y proper proof generation.\n\nLeaf structure para cNFTs includes: asset ID (derived from tree address y leaf index), owner public key, delegate (optional), nonce para uniqueness, y metadata hash. The exact encoding follows the Metaplex Bubblegum specification, using deterministic serialization para consistent hashing.\n\nHashing algorithm uses Keccak-256 para Ethereum compatibility, con domain separation via prefixed constants. The leaf hash is computed as: hash(prefix || asset_data) where prefix prevents collision con other hash usages. Multiple prefix values exist para different operation types (mint, transfer, burn).\n\nMetadata handling stores the full NFT metadata (name, symbol, uri, creators, royalties) off-chain. Only a hash of the metadata is stored in the leaf. This enables large metadata without on-chain storage costs while maintaining integrity via the hash commitment.\n\nCreator verification uses a separate signing process. Creators sign the asset ID to verify authenticity. These signatures are stored alongside proofs but not in the Merkle tree itself, allowing flexible verification without tree updates.\n\n## Checklist\n- Understand leaf structure components\n- Use correct hashing algorithm (Keccak-256)\n- Include proper domain separation prefixes\n- Store metadata off-chain con hash commitment\n- Handle creator signatures separately from tree\n\n## Red flags\n- Using wrong hashing algorithm\n- Missing domain separation in leaf hashes\n- Storing full metadata on-chain in compressed NFTs\n- Ignoring creator verification requirements\n",
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
            "content": "# Challenge: Implement Merkle tree insert + root updates\n\nBuild a Merkle tree implementation con insertions:\n\n- Insert leaves y compute new root\n- Update parent hashes up the tree\n- Handle tree growth y depth limits\n- Return deterministic root updates\n\nTest cases will verify correct root evolution after multiple insertions.",
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
            "title": "Proof generation y path computation",
            "content": "# Proof generation y path computation\n\nMerkle proofs enable verification of leaf inclusion without accessing the entire tree. Understanding proof generation is essential para working con compressed NFTs y building verification systems.\n\nA Merkle proof consists of: the leaf data (or its hash), a list of sibling hashes (one per level), y the leaf index (determining the path). The verifier recomputes the root by hashing the leaf con siblings in the correct order, comparing against the expected root.\n\nProof generation requires traversing from leaf to root. At each level, record the sibling hash (the other child of the parent). The leaf index determines whether the current hash goes left or right in each concatenation. Para index i at level n, the position is determined by the nth bit of i.\n\nProof verification recomputes the root: start con the leaf hash, para each sibling in the proof list, concatenate current hash con sibling (order depends on leaf index bit), hash the result, y compare final result con expected root. Equality proves inclusion.\n\nProof size efficiency: para a tree con n leaves, proofs contain log2(n) hashes. This is dramatically smaller than the full tree (n hashes), enabling scalable verification. A 65,536 leaf tree requires only 16 hashes per proof.\n\n## Checklist\n- Collect sibling hashes at each tree level\n- Use leaf index bits to determine concatenation order\n- Verify proofs by recomputing root hash\n- Handle edge cases (empty tree, single leaf)\n- Optimize proof size para network transmission\n\n## Red flags\n- Incorrect concatenation order in verification\n- Using wrong sibling hash at any level\n- Not validating proof length matches tree depth\n- Trusting proofs without root comparison\n",
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
                    "prompt": "How many hashes are in a proof para a tree con 1,024 leaves?",
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
        "title": "Proof System & Seguridad",
        "description": "Proof generation, verification, collection integrity, y seguridad hardening against replay y metadata spoofing.",
        "lessons": {
          "cnft-v2-proof-verification": {
            "title": "Challenge: Implement proof generation + verifier",
            "content": "# Challenge: Implement proof generation + verifier\n\nBuild a complete proof system:\n\n- Generate proofs from a Merkle tree y leaf index\n- Verify proofs against a root hash\n- Handle invalid proofs (wrong siblings, wrong index)\n- Return deterministic boolean results\n\nTests will verify both successful proofs y rejection of invalid attempts.",
            "duration": "55 min",
            "hints": [
              "To generate a proof, collect the sibling hash at each level from leaf to root.",
              "The sibling is at index+1 if current is left, index-1 if current is right.",
              "To verify, start con the leaf hash y combine con each proof element.",
              "Use the same ordering (left || right) when combining hashes.",
              "The proof is valid if the recomputed root matches the stored root."
            ]
          },
          "cnft-v2-collection-minting": {
            "title": "Collection mints y metadata simulation",
            "content": "# Collection mints y metadata simulation\n\nCompressed NFT collections use a collection mint as the parent NFT, enabling grouping y verification of related assets. Understanding this hierarchy is essential para building collection-aware applications.\n\nCollection structure includes: a standard SPL NFT as the collection mint, cNFTs referencing the collection in their metadata, y the Merkle tree containing all cNFT leaves. The collection mint provides on-chain provenance while cNFTs provide scalable asset issuance.\n\nMetadata simulation para pruebas allows development without actual on-chain transacciones. Simulated metadata includes: name, symbol, uri (typically pointing to off-chain JSON), seller fee basis points (royalties), creators array con shares, y collection reference. This data structure matches on-chain format para seamless migration.\n\nRoyalty enforcement through Metaplex's token metadata standard specifies seller fees as basis points (e.g., 500 = 5%). Creators array defines fee distribution con verified flags. cNFTs inherit these settings from their metadata, enforced during transfers via the Bubblegum program.\n\nAttacks on compressed NFTs include: invalid proofs (claiming non-existent NFTs), index manipulation (using wrong leaf index), metadata spoofing (fake off-chain data), y collection impersonation (fake collection mints). Mitigations include proof verification, metadata hash validation, y collection mint verification.\n\n## Checklist\n- Understand collection mint hierarchy\n- Simulate metadata para pruebas\n- Implement royalty calculations\n- Verify collection membership\n- Handle metadata hash verification\n\n## Red flags\n- Accepting NFTs without collection verification\n- Ignoring royalty settings in transfers\n- Trusting off-chain metadata without hash validation\n- Not validating proofs para ownership claims\n",
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
                    "note": "Parent NFT para the collection"
                  },
                  {
                    "cmd": "Merkle Tree",
                    "output": "Contains cNFT leaf hashes",
                    "note": "Scalable storage para assets"
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
            "title": "Attack surface: invalid proofs y replay",
            "content": "# Attack surface: invalid proofs y replay\n\nCompressed NFTs introduce unique seguridad considerations. Understanding attack vectors y mitigations is critical para building secure compression-aware applications.\n\nInvalid proof attacks attempt to verify non-existent NFTs. An attacker provides a fabricated leaf hash y fake sibling hashes hoping to produce a valid-looking verification. Mitigation: always verify against the current root from a trusted source (RPC, on-chain cuenta), y validate proof structure (correct depth, valid hash lengths).\n\nIndex manipulation exploits use valid proofs but wrong indices. Since leaf indices determine proof path, changing the index produces a different root computation. Mitigation: bind asset IDs to specific indices y validate index-asset correspondence during verification.\n\nReplay attacks re-use old proofs after tree updates. When leaves are added or modified, the root changes y old proofs become invalid. However, if an application caches roots, it might accept stale proofs. Mitigation: always use current root, implement proof timestamps where applicable.\n\nMetadata attacks substitute fake off-chain data. Since metadata is stored off-chain con only a hash on-chain, attackers might serve altered metadata files. Mitigation: verify metadata hashes against leaf commitments, use content-addressed storage (IPFS), y validate creator signatures.\n\nCollection spoofing creates fake collections mimicking legitimate ones. Attackers mint similar-looking NFTs con fake collection references. Mitigation: verify collection mint addresses against known good lists, check collection verification status, y validate authority signatures.\n\n## Checklist\n- Verify proofs against current root\n- Validate leaf index matches asset ID\n- Implement replay protection para proofs\n- Hash-verify off-chain metadata\n- Verify collection mint authenticity\n\n## Red flags\n- Accepting cached/stale roots para verification\n- Ignoring leaf index validation\n- Trusting off-chain metadata without verification\n- Not checking collection verification status\n",
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
            "content": "# Checkpoint: Simulate mint + verify ownership proof\n\nComplete the compression lab checkpoint:\n\n- Simulate minting a cNFT (insert leaf, update root)\n- Generate ownership proof para the minted NFT\n- Verify the proof against current root\n- Output stable audit trace con sorted keys\n- Detect y report invalid proof attempts\n\nThis validates your complete Merkle tree implementation para compressed NFTs.",
            "duration": "60 min",
            "hints": [
              "Validate the mint request has all required fields (leafIndex, nftId, owner).",
              "Create a deterministic leaf hash by combining nftId y owner.",
              "Insert the leaf by computing hashes up to the root, collecting sibling hashes as proof.",
              "Build an audit trace that documents the operation, inputs, y verification steps.",
              "Include previous y new root hashes in the audit para transparency."
            ]
          }
        }
      }
    }
  },
  "solana-governance-multisig": {
    "title": "Gobernanza & Multisig Treasury Ops",
    "description": "Build production-ready DAO gobernanza y multisig treasury systems con deterministic vote accounting, timelock safety, y secure execution controls.",
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
        "title": "DAO Gobernanza",
        "description": "Proposal lifecycle, deterministic voting mechanics, quorum policy, y timelock safety para credible DAO gobernanza.",
        "lessons": {
          "governance-v2-dao-model": {
            "title": "DAO model: proposals, voting, y execution",
            "content": "# DAO model: proposals, voting, y execution\n\nDecentralized gobernanza on Solana follows a proposal-based model where token holders vote on changes y the DAO treasury executes approved decisions. Understanding this flow is essential para building y participating in on-chain organizations.\n\nThe gobernanza lifecycle has four stages: proposal creation (anyone con sufficient stake can propose), voting period (token holders vote para/against/abstain), queueing (successful proposals enter a timelock), y execution (the proposal's instrucciones are executed). Each stage has specific requirements y time constraints.\n\nProposal creation requires a minimum token deposit to prevent spam. The proposer submits: title, description link, y executable instrucciones (typically base64 serialized). Deposits are returned if the proposal passes, forfeited if it fails (depending on DAO configuration).\n\nVoting power is typically determined by token balance at a specific snapshot block. Some DAOs use vote escrow (veToken) models where locking tokens para longer periods multiplies voting power. Quorum requirements ensure sufficient participation - a proposal needs both majority approval y minimum participation to pass.\n\nExecution safety involves timelocks between approval y execution. This delay (often 1-7 days) allows users to exit if they disagree con the outcome. Emergency powers may exist para critical fixes but should require higher thresholds.\n\n## Gobernanza reliability rule\n\nA proposal system is only credible if outcomes are reproducible from public inputs. That means deterministic vote math, explicit snapshot rules, clear timelock transitions, y auditable execution traces para treasury effects.\n\n## Checklist\n- Understand the four-stage gobernanza lifecycle\n- Know proposal deposit y spam prevention mechanisms\n- Calculate voting power y quorum requirements\n- Implement timelock safety delays\n- Plan para emergency execution paths\n\n## Red flags\n- Allowing proposal creation without deposits\n- Missing quorum requirements para participation\n- Zero timelock on sensitive operations\n- Unclear vote counting methodologies\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "governance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "governance-v2-l1-q1",
                    "prompt": "What is the purpose of a timelock in gobernanza?",
                    "options": [
                      "Allow users time to exit if they disagree con outcomes",
                      "Speed up transaccion processing",
                      "Reduce gas costs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Timelocks provide a safety window para users to react before changes take effect."
                  },
                  {
                    "id": "governance-v2-l1-q2",
                    "prompt": "What determines voting power in most DAOs?",
                    "options": [
                      "Token balance at snapshot block",
                      "Number of transacciones submitted",
                      "Cuenta age"
                    ],
                    "answerIndex": 0,
                    "explanation": "Voting power is typically proportional to token holdings at a specific snapshot time."
                  }
                ]
              }
            ]
          },
          "governance-v2-quorum-math": {
            "title": "Quorum math y vote weight calculation",
            "content": "# Quorum math y vote weight calculation\n\nAccurate vote counting is critical para legitimate gobernanza outcomes. Understanding quorum requirements, vote weight calculation, y edge cases ensures fair decision-making.\n\nQuorum defines minimum participation para a valid vote. Common formulas include: absolute token amount (e.g., 4% of total supply must vote), relative to circulating supply, or dynamic based on recent participation. Quorum prevents small groups from making unilateral decisions.\n\nVote weight calculation considers: token balance at snapshot block, lockup duration multipliers (veToken model), delegation relationships, y abstention handling. Abstentions typically count toward quorum but not toward approval ratio.\n\nApproval thresholds vary by proposal type. Simple majority (>50%) is standard para routine matters. Supermajority (e.g., 2/3) may be required para constitutional changes. Some DAOs use quadratic voting to reduce whale influence, though this has sybil resistance challenges.\n\nEdge cases include: ties (usually fail), late vote changes (often blocked after deadline), vote delegation revocation timing, y quorum manipulation (e.g., flash loan attacks prevented by snapshot blocks).\n\n## Checklist\n- Define clear quorum formulas y minimums\n- Calculate vote weights con snapshot blocks\n- Handle abstentions appropriately\n- Set appropriate approval thresholds by proposal type\n- Protect against manipulation attacks\n\n## Red flags\n- No quorum requirements\n- Vote weight based on current balance (flash loan risk)\n- Unclear tie-breaking rules\n- Changing rules mid-proposal\n",
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
                      "label": "Voter Cuenta",
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
            "title": "Timelock states y execution scheduling",
            "content": "# Timelock states y execution scheduling\n\nTimelocks provide a critical safety layer between gobernanza approval y execution. Understanding timelock states y transitions ensures reliable proposal execution.\n\nTimelock states include: pending (proposal passed, waiting para delay), ready (delay elapsed, can be executed), executed (instrucciones processed), cancelled (withdrawn by proposer or guardian), y expired (execution window passed). Each state has valid transitions y authorized actors.\n\nDelay configuration balances seguridad con responsiveness. Too short (hours) allows insufficient reaction time. Too long (weeks) delays urgent fixes. Common ranges are 1-7 days, con shorter delays para routine matters y longer para significant changes.\n\nExecution windows prevent indefinite pending states. After the timelock delay, proposals typically have a limited window (e.g., 7-14 days) to be executed. Expired proposals must be re-proposed y re-voted.\n\nCancellations add flexibility. Proposers may withdraw proposals before voting ends. Guardians (if configured) may cancel malicious proposals. Cancellation typically returns deposits unless abuse is detected.\n\n## Checklist\n- Define clear timelock state machine\n- Set appropriate delays by proposal type\n- Implement execution window limits\n- Authorize cancellation actors\n- Handle state transitions atomically\n\n## Red flags\n- No execution window limits\n- Missing cancellation mechanisms\n- State transitions without authorization checks\n- Indefinite pending states\n",
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
                    "output": "Instrucciones processed",
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
              "Sum up weights para each vote choice (para, against, abstain).",
              "Check if totalVoteWeight >= quorumThreshold to determine quorumMet.",
              "Calculate support percentage as forWeight / (forWeight + againstWeight) when there are non-abstain votes.",
              "Proposal passes only if quorum is met Y support percentage >= supportThreshold."
            ]
          }
        }
      },
      "governance-v2-multisig": {
        "title": "Multisig Treasury",
        "description": "Multisig transaccion construction, approval controls, replay defenses, y secure treasury execution patterns.",
        "lessons": {
          "governance-v2-multisig": {
            "title": "Multisig transaccion building y approvals",
            "content": "# Multisig transaccion building y approvals\n\nMultisig carteras provide collective control over treasury funds. Understanding multisig construction, approval flows, y seguridad patterns is essential para treasury operations.\n\nMultisig structure defines: signers (public keys that can approve), threshold (minimum signatures required), y instrucciones (operations to execute). Common configurations include 2-of-3 (two approvals from three signers), 3-of-5, y custom arrangements.\n\nTransaccion lifecycle: propose (one signer creates transaccion con instrucciones), approve (other signers review y approve), y execute (once threshold is met, anyone can execute). Each stage is recorded on-chain para transparency.\n\nApproval tracking maintains state per signer per transaccion. Signers can approve, reject, or cancel their approval. Double-signing is prevented by tracking which signers have already approved. Rejections may block transacciones or simply be recorded.\n\nSeguridad considerations: signer key management (hardware carteras recommended), threshold selection (balance seguridad vs availability), timelocks para large transfers, y emergency recovery paths. Lost signer keys should not freeze treasury funds permanently.\n\n## Checklist\n- Define signer set y threshold\n- Track per-signer approval state\n- Enforce threshold before execution\n- Implement approval/revocation mechanics\n- Plan para lost key scenarios\n\n## Red flags\n- Single signer controlling treasury\n- No approval tracking on-chain\n- Threshold equal to signer count (no redundancy)\n- Missing rejection/cancellation mechanisms\n",
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
                    "explanation": "2-of-3 means any 2 of the 3 authorized signers must approve a transaccion."
                  },
                  {
                    "id": "governance-v2-l5-q2",
                    "prompt": "Why track approvals on-chain?",
                    "options": [
                      "Transparency y enforceability",
                      "Faster execution",
                      "Lower fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "On-chain tracking provides transparency y ensures threshold enforcement by the protocol."
                  }
                ]
              }
            ]
          },
          "governance-v2-multisig-builder": {
            "title": "Challenge: Implement multisig tx builder + approval rules",
            "content": "# Challenge: Implement multisig tx builder + approval rules\n\nBuild a multisig transaccion system:\n\n- Create transacciones con instrucciones\n- Record signer approvals\n- Enforce threshold requirements\n- Handle approval revocation\n- Generate deterministic transaccion state\n\nTests will verify threshold enforcement y approval tracking.",
            "duration": "55 min",
            "hints": [
              "Initialize signer statuses as 'pending' para all signers.",
              "Process actions in order - each action updates the signer's status.",
              "Track the cumulative approved weight to compare against threshold.",
              "A proposal is 'approved' when approvedWeight >= threshold.",
              "A proposal is 'rejected' when no pending signers remain but threshold is not met."
            ]
          },
          "governance-v2-safe-defaults": {
            "title": "Safe defaults: owner checks y replay guards",
            "content": "# Safe defaults: owner checks y replay guards\n\nGobernanza y multisig systems require robust seguridad defaults. Understanding common vulnerabilities y their mitigations protects treasury funds.\n\nOwner checks validate that transacciones only affect authorized cuentas. Para treasury operations, verify: the treasury cuenta is owned by the expected program, the signer set matches the multisig configuration, y instrucciones target allowed programs. Missing owner checks enable cuenta substitution attacks.\n\nReplay guards prevent the same approved transaccion from being executed multiple times. Without replay protection, an observer could resubmit an executed transaccion to drain funds. Guards include: unique transaccion nonces, executed flags in transaccion state, y signature uniqueness checks.\n\nUpgrade safety considers how gobernanza changes affect existing proposals. If the multisig configuration changes, pending proposals should use the old configuration while new proposals use the new one. Atomic configuration changes prevent partial updates.\n\nEmergency stops provide circuit breakers. Guardian roles can pause operations during suspected attacks. Time delays on critical changes allow review periods. These safety valves should be tested regularly.\n\n## Checklist\n- Validate cuenta ownership before operations\n- Implement replay protection (nonces or flags)\n- Handle configuration changes safely\n- Add emergency pause mechanisms\n- Test seguridad controls regularly\n\n## Red flags\n- No owner verification on treasury cuentas\n- Missing replay protection\n- Immediate execution of critical changes\n- No emergency stop capability\n",
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
                      "Re-executing an already-executed transaccion",
                      "Sending duplicate approval requests",
                      "Copying transaccion bytecode"
                    ],
                    "answerIndex": 0,
                    "explanation": "Replay attacks re-submit previously executed transacciones to drain funds."
                  },
                  {
                    "id": "governance-v2-l7-q2",
                    "prompt": "Why verify cuenta ownership?",
                    "options": [
                      "Prevent cuenta substitution attacks",
                      "Reduce transaccion size",
                      "Improve UI rendering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ownership checks ensure operations target legitimate cuentas, not attacker substitutes."
                  }
                ]
              }
            ]
          },
          "governance-v2-treasury-execution": {
            "title": "Challenge: Execute proposal y produce treasury diff",
            "content": "# Challenge: Execute proposal y produce treasury diff\n\nComplete the gobernanza simulator checkpoint:\n\n- Execute approved proposals con timelock validation\n- Apply treasury state changes atomically\n- Generate execution trace con before/after diffs\n- Handle edge cases (expired, cancelled, insufficient funds)\n- Output stable, deterministic audit log\n\nThis validates your complete gobernanza/multisig implementation.",
            "duration": "55 min",
            "hints": [
              "First validate the proposal status is 'approved'.",
              "Check if currentTimestamp - approvedAt >= timelockDuration para timelock validation.",
              "Sum all transfer amounts y compare against treasury balance.",
              "Return canExecute: false con appropriate error if any validation fails.",
              "Generate state changes y execution trace entries para each successful step."
            ]
          }
        }
      }
    }
  },
  "solana-performance": {
    "title": "Solana Rendimiento & Compute Optimization",
    "description": "Master Solana rendimiento engineering con measurable optimization workflows: compute budgets, data layouts, encoding efficiency, y deterministic cost modeling.",
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
        "title": "Rendimiento Foundations",
        "description": "Compute model, cuenta/data layout decisions, y deterministic cost estimation para transaccion-level rendimiento reasoning.",
        "lessons": {
          "performance-v2-compute-model": {
            "title": "Compute model: budgets, costs, y limits",
            "content": "# Compute model: budgets, costs, y limits\n\nSolana's compute model enforces deterministic execution limits through compute budgets. Understanding this model is essential para building efficient programs that stay within limits while maximizing utility.\n\nCompute units (CUs) measure execution cost. Every operation consumes CUs: instruccion execution, syscall usage, memory access, y logging. The default transaccion limit is 200,000 CUs (1.4 million con prioritization), y each cuenta has a 10MB max size limit.\n\nCompute budget instrucciones allow transacciones to request specific limits y set priority fees. The ComputeBudgetProgram provides: setComputeUnitLimit (override default), setComputeUnitPrice (set priority fee per CU in micro-lamports). Priority fees increase transaccion inclusion probability during congestion.\n\nCost categories include: fixed costs (signature verification, cuenta loading), variable costs (instruccion execution, CPI calls), y memory costs (cuenta data access size). Understanding these categories helps optimize the right areas.\n\nMetering happens during execution. If a transaccion exceeds its compute budget, execution halts y the transaccion fails con an error. Failed transacciones still pay fees para consumed CUs, making optimization economically important.\n\n## Practico optimization loop\n\nUse a repeatable loop:\n1. profile real CU usage,\n2. identify top cost drivers (data layout, CPI count, logging),\n3. optimize one hotspot,\n4. re-measure y keep only proven wins.\n\nThis avoids rendimiento folklore y keeps code quality intact.\n\n## Checklist\n- Understand compute unit consumption categories\n- Use ComputeBudgetProgram para specific limits\n- Set priority fees during congestion\n- Monitor CU usage during development\n- Handle compute limit failures gracefully\n\n## Red flags\n- Ignoring compute limits in program diseno\n- Using default limits unnecessarily high\n- Not pruebas con realistic data sizes\n- Missing priority fee strategies para important transacciones\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l1-q1",
                    "prompt": "What is the default compute unit limit per transaccion?",
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
                    "prompt": "What happens when a transaccion exceeds its compute budget?",
                    "options": [
                      "Execution halts y the transaccion fails",
                      "It continues con reduced priority",
                      "The network automatically extends the limit"
                    ],
                    "answerIndex": 0,
                    "explanation": "Exceeding the compute budget causes immediate transaccion failure."
                  }
                ]
              }
            ]
          },
          "performance-v2-account-layout": {
            "title": "Cuenta layout diseno y serialization cost",
            "content": "# Cuenta layout diseno y serialization cost\n\nCuenta data layout significantly impacts compute costs. Well-designed layouts minimize serialization overhead y reduce cuenta access costs.\n\nSerialization formats affect cost. Borsh is the standard para Solana, offering compact binary encoding. Manual serialization can be more efficient para simple structures but increases bug risk. Avoid JSON or other text formats on-chain due to size y parsing cost.\n\nCuenta size impacts costs linearly. Loading a 10KB cuenta costs more than loading 1KB. Rent exemption requires more lamports para larger cuentas. Diseno layouts to minimize size: use fixed-size arrays instead of Vecs where possible, pack booleans into bitflags, y use appropriate integer sizes (u8/u16/u32/u64).\n\nData structure alignment affects both size y access patterns. Group related fields together para cache efficiency. Place frequently accessed fields at the beginning of the struct. Consider zero-copy deserialization para read-heavy operations.\n\nVersioning enables layout upgrades. Include a version byte at the start of cuenta data. Migration logic can then handle different versions during deserialization. Plan para growth by reserving padding bytes in initial layouts.\n\n## Checklist\n- Use Borsh para standard serialization\n- Minimize cuenta data size\n- Use appropriate integer sizes\n- Plan para versioning y upgrades\n- Consider zero-copy para read-heavy paths\n\n## Red flags\n- Using JSON para on-chain data\n- Oversized Vec collections\n- No versioning para upgrade paths\n- Unnecessary large integer types\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "performance-v2-l2-layout",
                "title": "Cuenta Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Optimized Cuenta",
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
            "content": "# Challenge: Implement estimateCost(op) model\n\nBuild a compute cost estimation system:\n\n- Model costs para different operation types\n- Cuenta para instruccion complexity\n- Include memory access costs\n- Return baseline measurements\n- Handle edge cases (empty operations, large data)\n\nYour estimator will be validated against known operation costs.",
            "duration": "50 min",
            "hints": [
              "Use 5000 as the base compute unit cost per transaccion.",
              "Each cuenta accessed adds 500 compute units.",
              "Each byte of data adds 10 compute units.",
              "Total = base + (cuentas × 500) + (bytes × 10)."
            ]
          },
          "performance-v2-instruction-data": {
            "title": "Instruccion data size y encoding optimization",
            "content": "# Instruccion data size y encoding optimization\n\nInstruccion data size directly impacts transaccion cost y throughput. Optimizing encoding reduces fees y increases the operations possible within compute limits.\n\nCompact encoding uses minimal bytes to represent data. Use discriminants (u8) to identify instruccion types. Use variable-length encoding (ULEB128) para sizes. Pack multiple boolean flags into a single u8 using bit manipulation. Avoid unnecessary padding.\n\nCuenta deduplication reduces transaccion size. If an cuenta appears in multiple instrucciones, include it once in the cuenta list y reference by index. This is especially important para CPI-heavy transacciones.\n\nBatching combines multiple operations into one transaccion. Instead of N transacciones con 1 instruccion each, use 1 transaccion con N instrucciones. Batching amortizes signature verification y cuenta loading costs across operations.\n\nRight-sizing vectors prevents overallocation. Use Vec::with_capacity when the size is known. Avoid unnecessary clones that increase heap usage. Consider stack-allocated arrays para small, fixed-size data.\n\n## Checklist\n- Use compact discriminants para instruccion types\n- Pack boolean flags into bitfields\n- Deduplicate cuentas across instrucciones\n- Batch operations when possible\n- Right-size collections to avoid waste\n\n## Red flags\n- Using full u32 para small discriminants\n- Separate booleans instead of bitflags\n- Duplicate cuentas in transaccion lists\n- Unnecessary data cloning\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "performance-v2-l4-encoding",
                "title": "Encoding Example",
                "steps": [
                  {
                    "cmd": "Before optimization",
                    "output": "200 bytes, 5 cuentas",
                    "note": "Separate bools, duplicate cuentas"
                  },
                  {
                    "cmd": "After optimization",
                    "output": "120 bytes, 3 cuentas",
                    "note": "Bitflags, deduplicated cuentas"
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
        "description": "Layout optimization, compute budget tuning, y before/after rendimiento analysis con correctness safeguards.",
        "lessons": {
          "performance-v2-optimized-layout": {
            "title": "Challenge: Implement optimized layout/codec",
            "content": "# Challenge: Implement optimized layout/codec\n\nOptimize an cuenta data layout while preserving semantics:\n\n- Reduce data size through compact encoding\n- Maintain all original functionality\n- Preserve backward compatibility where possible\n- Pass regression tests\n- Measure y report size reduction\n\nYour optimized layout should be smaller but functionally equivalent.",
            "duration": "55 min",
            "hints": [
              "Sort fields by size (largest first) to minimize padding gaps.",
              "Consider if u64 fields can be reduced to u32 based on maxValue.",
              "Boolean flags can be packed into a single byte as bit flags.",
              "Calculate bytes saved as originalSize - optimizedSize."
            ]
          },
          "performance-v2-compute-budget": {
            "title": "Compute budget instruccion fundamentos",
            "content": "# Compute budget instruccion fundamentos\n\nCompute budget instrucciones give developers control over resource allocation y transaccion prioritization. Understanding these tools enables precise optimization.\n\nsetComputeUnitLimit requests a specific CU budget. The default is 200,000, but you can request up to 1,400,000. Requesting more than needed wastes fees since you pay para the limit, not actual usage. Requesting too little causes failures.\n\nsetComputeUnitPrice sets a priority fee in micro-lamports per CU. During congestion, transacciones con higher priority fees are more likely to be included. Priority fees are additional to base fees y go to validadores.\n\nRequesting compute units involves tradeoffs. Higher limits enable more complex operations but cost more. Priority fees increase inclusion probability but raise costs. Profile your transacciones to set appropriate limits.\n\nHeap size can also be configured. The default heap is 32KB, extendable to 256KB con compute budget instrucciones. Large heap enables complex data structures but increases CU consumption.\n\n## Checklist\n- Profile transacciones to determine actual CU usage\n- Set appropriate compute unit limits\n- Use priority fees during congestion\n- Consider heap size para data-heavy operations\n- Monitor cost vs inclusion probability tradeoffs\n\n## Red flags\n- Always using maximum compute unit limits\n- Not setting priority fees during congestion\n- Ignoring heap size constraints\n- Not profiling before optimization\n",
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
                      "Set priority fee para transaccion inclusion",
                      "Set the maximum transaccion size",
                      "Enable additional program features"
                    ],
                    "answerIndex": 0,
                    "explanation": "Priority fees increase the likelihood of transaccion inclusion during network congestion."
                  },
                  {
                    "id": "performance-v2-l6-q2",
                    "prompt": "Why request specific compute unit limits?",
                    "options": [
                      "Pay only para what you need y prevent waste",
                      "Increase transaccion speed",
                      "Enable more cuenta access"
                    ],
                    "answerIndex": 0,
                    "explanation": "Specific limits optimize costs - you pay para the limit requested, not actual usage."
                  }
                ]
              }
            ]
          },
          "performance-v2-micro-optimizations": {
            "title": "Micro-optimizations y tradeoffs",
            "content": "# Micro-optimizations y tradeoffs\n\nRendimiento optimization involves balancing competing concerns. Understanding tradeoffs helps make informed decisions about when y what to optimize.\n\nReadability vs rendimiento is a constant tension. Highly optimized code often sacrifices clarity. Optimize hot paths (frequently executed code) aggressively. Keep cold paths (rarely executed) readable y maintainable.\n\nSpace vs time tradeoffs appear frequently. Pre-computing values trades memory para speed. Compressing data trades CPU para storage. Choose based on which resource is more constrained para your use case.\n\nMaintainability vs optimization matters para long-term projects. Aggressive optimizations can introduce bugs y make updates difficult. Document why optimizations exist y measure their impact.\n\nPremature optimization is a common trap. Profile before optimizing to identify actual bottlenecks. Theoretical optimizations may not match real-world behavior. Focus on algorithmic improvements before micro-optimizations.\n\nSeguridad must never be sacrificed para rendimiento. Bounds checking, ownership validation, y arithmetic safety are non-negotiable. Optimize around seguridad, not through it.\n\n## Checklist\n- Profile before optimizing\n- Focus on hot paths\n- Document optimization decisions\n- Balance readability y rendimiento\n- Never sacrifice seguridad para speed\n\n## Red flags\n- Optimizing without profiling\n- Sacrificing seguridad para rendimiento\n- Unreadable code without documentation\n- Optimizing cold paths unnecessarily\n",
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
                      "Optimizing before despliegue",
                      "Small rendimiento improvements"
                    ],
                    "answerIndex": 0,
                    "explanation": "Premature optimization wastes effort on theoretical rather than measured bottlenecks."
                  },
                  {
                    "id": "performance-v2-l7-q2",
                    "prompt": "What should never be sacrificed para rendimiento?",
                    "options": [
                      "Seguridad",
                      "Code comments",
                      "Variable names"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seguridad validations must remain regardless of rendimiento optimizations."
                  }
                ]
              }
            ]
          },
          "performance-v2-perf-checkpoint": {
            "title": "Checkpoint: Compare before/after + output perf report",
            "content": "# Checkpoint: Compare before/after + output perf report\n\nComplete the optimization lab checkpoint:\n\n- Measure baseline rendimiento metrics\n- Apply optimization techniques\n- Verify correctness is preserved\n- Generate rendimiento comparison report\n- Output stable JSON con sorted keys\n\nThis validates your ability to optimize while maintaining correctness.",
            "duration": "55 min",
            "hints": [
              "Compute savings by subtracting 'after' from 'before' metrics.",
              "Use approximate conversion: 1 SOL = $20, 1 SOL = 1,000,000,000 lamports.",
              "Count only optimizations where improved=true para totalImprovements.",
              "Include curso name as 'solana-rendimiento' y version as 'v2'."
            ]
          }
        }
      }
    }
  },
  "defi-swap-aggregator": {
    "title": "DeFi Swap Aggregation",
    "description": "Master production swap aggregation on Solana: deterministic quote parsing, route optimization tradeoffs, slippage safety, y reliability-aware execution.",
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
        "description": "Token swap mechanics, slippage protection, route composition, y deterministic swap plan construction con transparent tradeoffs.",
        "lessons": {
          "swap-v2-mental-model": {
            "title": "Swap modelo mental: mints, ATAs, decimals, y routes",
            "content": "# Swap modelo mental: mints, ATAs, decimals, y routes\n\nToken swaps on Solana follow a fundamentally different model than centralized exchanges. Understanding the building blocks — mints, associated token cuentas (ATAs), decimal precision, y route composition — is essential before writing any swap code.\n\nEvery SPL token on Solana is defined by a mint cuenta. The mint specifies the token's total supply, decimals (0–9), y authority. When you swap \"SOL para USDC,\" you are actually swapping wrapped SOL (mint `So11111111111111111111111111111111111111112`) para USDC (mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`). Native SOL must be wrapped into an SPL token before any program can manipulate it as a standard token.\n\nAssociated Token Cuentas (ATAs) are deterministic addresses derived from a cartera y a mint using the Associated Token Cuenta program. Para every token a cartera holds, there must be an ATA. If the recipient does not have an ATA para the output mint, the swap transaccion must include a `createAssociatedTokenAccountIdempotent` instruccion — a common source of transaccion failures when omitted.\n\nDecimal handling is critical. SOL uses 9 decimals (1 SOL = 1,000,000,000 lamports). USDC uses 6 decimals. When displaying \"22.5 USDC,\" the on-chain amount is 22,500,000. Mixing decimals between mints causes catastrophic pricing errors. Always convert human-readable amounts to raw integer amounts early y keep all math in integer space until the final display step.\n\nRoutes are the paths a swap takes through liquidity pools. A direct swap (SOL → USDC in a single pool) is the simplest case. When direct liquidity is insufficient or the price is better through an intermediary, the aggregator splits the swap into multiple \"legs\" — para example, SOL → mSOL → USDC. Each leg passes through a different AMM (Automated Market Maker) program like Whirlpool, Raydium, or Orca. The aggregator's job is to find the combination of legs that produces the best output amount after fees.\n\nRoute optimization considers: pool liquidity depth, fee tiers, impacto de precio per leg, y the total compute cost of including multiple legs in one transaccion. More legs means more instrucciones, more cuentas, y higher compute unit consumption — there is a practico limit to route complexity within Solana's transaccion size y compute budget constraints.\n\n## Execution-quality triangle\n\nEvery route decision balances three competing goals:\n1. better output amount,\n2. lower failure risk (slippage + stale quote exposure),\n3. lower execution overhead (cuentas + compute + latency).\n\nStrong aggregators make this tradeoff explicit rather than optimizing only a single metric.\n\n## Checklist\n- Identify input y output mints by their full base58 addresses\n- Ensure ATAs exist para both input y output tokens before swapping\n- Convert all amounts to raw integer form using the correct decimal places\n- Understand that routes may have multiple legs through different AMM programs\n- Consider compute budget implications of complex routes\n\n## Red flags\n- Mixing decimal scales between different mints\n- Forgetting to create output ATA before the swap instruccion\n- Assuming all swaps are single-hop direct routes\n- Ignoring fees charged by intermedio pools in multi-hop routes\n",
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
                      "SPL token programs only operate on token cuentas, not native SOL",
                      "Wrapping encrypts the SOL para privacy",
                      "Native SOL cannot be transferred on Solana"
                    ],
                    "answerIndex": 0,
                    "explanation": "AMM programs interact con SPL token cuentas. Native SOL must be wrapped into the SPL token format so it can be processed by swap programs."
                  },
                  {
                    "id": "swap-v2-l1-q2",
                    "prompt": "What happens if the recipient has no ATA para the output token?",
                    "options": [
                      "The swap transaccion fails unless the ATA is created in the same transaccion",
                      "Solana automatically creates the ATA",
                      "The tokens are sent to the system program"
                    ],
                    "answerIndex": 0,
                    "explanation": "ATAs must be explicitly created. Including createAssociatedTokenAccountIdempotent in the transaccion handles this safely."
                  }
                ]
              }
            ]
          },
          "swap-v2-slippage": {
            "title": "Slippage y impacto de precio: protecting swap outcomes",
            "content": "# Slippage y impacto de precio: protecting swap outcomes\n\nSlippage is the difference between the expected output amount at quote time y the actual amount received at execution time. In volatile markets con active trading, pool reserves change between when you request a quote y when your transaccion lands on-chain. Slippage protection ensures you never receive less than an acceptable minimum.\n\nImpacto de precio measures how much your swap moves the pool's price. A small swap in a deep liquidity pool has near-zero impacto de precio. A large swap in a shallow pool can move the price significantly — you are effectively trading against yourself as each unit you buy makes the next unit more expensive. Impacto de precio is calculated at quote time y should be displayed to users before they confirm.\n\nThe slippage tolerance is expressed in basis points (bps). 1 bps = 0.01%. A slippage of 50 bps means you accept up to 0.5% less than the quoted output. The minimum output amount is calculated as: minOutAmount = outAmount - (outAmount × slippageBps / 10000). This calculation MUST use integer arithmetic to avoid floating-point rounding errors. Using BigInt in JavaScript ensures exact computation.\n\nSetting slippage too tight (e.g., 1 bps) causes frequent transaccion failures because even minor pool changes exceed the tolerance. Setting it too loose (e.g., 1000 bps = 10%) exposes users to sandwich attacks where a malicious actor front-runs the swap to move the price, then back-runs after execution to profit from the price movement. The optimal range para most swaps is 30–100 bps, con higher values para volatile or low-liquidity pairs.\n\nSandwich attacks exploit predictable slippage tolerances. An attacker observes your pending transaccion in the mempool, submits a transaccion to buy the output token (raising its price), lets your swap execute at the worse price, then sells the output token at profit. Tight slippage limits reduce the attacker's profit margin y may cause them to skip your transaccion entirely.\n\nDynamic slippage adjusts the tolerance based on: recent volatility, pool depth, swap size relative to pool reserves, y historical transaccion success rates. Avanzado aggregators compute recommended slippage per-route to balance execution reliability con protection. When building swap UIs, always show both the quoted output y the minimum guaranteed output so users understand their worst-case outcome.\n\n## Checklist\n- Calculate minOutAmount using integer arithmetic (BigInt)\n- Display both expected y minimum output amounts to users\n- Use 30–100 bps as default slippage para most pairs\n- Show impacto de precio percentage prominently para large swaps\n- Consider dynamic slippage based on pool conditions\n\n## Red flags\n- Using floating-point math para slippage calculations\n- Setting extremely loose slippage (>500 bps) without user warning\n- Not displaying impacto de precio para large swaps\n- Ignoring sandwich attack vectors in slippage diseno\n",
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
                      "Solana only accepts BigInt in transacciones"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts are integers. Floating-point math can produce off-by-one errors that cause transaccion failures or incorrect minimum amounts."
                  }
                ]
              }
            ]
          },
          "swap-v2-route-explorer": {
            "title": "Route visualization: understanding swap legs y fees",
            "content": "# Route visualization: understanding swap legs y fees\n\nSwap routes reveal the path your tokens take through DeFi liquidity. Visualizing routes helps users understand why a multi-hop path might yield more output than a direct swap, y where fees are deducted along the way.\n\nA route consists of one or more legs. Each leg represents a swap through a specific AMM pool. The leg includes: the AMM program label (e.g., \"Whirlpool,\" \"Raydium\"), the input y output mints para that leg, the fee charged by the pool (denominated in the output token), y the percentage of the total input allocated to this leg.\n\nSplit routes divide the input amount across multiple paths. Para example, 60% might go through Raydium SOL/USDC y 40% through Orca SOL/USDC. Splitting across pools reduces impacto de precio because each pool handles a smaller portion of the total swap. The aggregator optimizes the split percentages to maximize total output.\n\nFee accounting is per-leg. Each AMM charges a fee (typically 0.01%–1% depending on the pool's fee tier). In concentrated liquidity pools, fee tiers are explicit (e.g., Orca's 1 bps, 4 bps, 30 bps, 100 bps tiers). The total fee across all legs determines the true cost of the route. A route con lower per-leg fees might still be more expensive if it requires more hops.\n\nWhen rendering route information, show: the overall path (input mint → [intermedio mints] → output mint), per-leg details (AMM, fee, percentage), total fees in the output token denomination, impacto de precio as a percentage, y the final output amounts (quoted y minimum). Color-coding or progress indicators help users quickly understand whether a route is simple (green, single hop) or complex (yellow/orange, multi-hop).\n\nEffective price is calculated as: outputAmount / inputAmount, denominated in output-per-input units. Para SOL → USDC, this gives the effective USD price of SOL para this specific swap. Comparing the effective price against oracle or market price reveals the total cost of the swap including all fees y impacto de precio. This \"execution cost\" metric is the most honest summary of swap quality.\n\nRoute caching y expiration matter para UX. Quotes from aggregators have a limited validity window (typically 10–30 seconds). If the user takes too long to confirm, the quote expires y the route must be re-fetched. The UI should clearly indicate quote freshness y automatically re-quote when expired. Stale quotes that execute against current pool state will likely fail or produce worse outcomes.\n\n## Checklist\n- Show each leg con AMM label, mints, fee, y split percentage\n- Display total fees summed across all legs\n- Calculate y display effective price (output/input)\n- Indicate quote expiration time to users\n- Color-code routes by complexity (hops count)\n\n## Red flags\n- Hiding fees from the user display\n- Not showing impacto de precio para large swaps\n- Allowing execution of expired quotes\n- Displaying only the best-case output without minimum\n",
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
                    "note": "Split route reduces impacto de precio"
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
            "content": "# Challenge: Build a normalized SwapPlan from a quote\n\nParse a raw aggregator quote response y produce a normalized SwapPlan:\n\n- Extract input/output mints y amounts from the quote\n- Calculate minOutAmount using BigInt slippage arithmetic\n- Map each route leg to a normalized structure con AMM label, mints, fees, y percentage\n- Handle zero slippage correctly (minOut equals outAmount)\n- Ensure all amounts remain as string representations of integers\n\nYour SwapPlan must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Use BigInt arithmetic to avoid floating point errors when computing minOutAmount.",
              "Slippage in basis points: minOut = outAmount - (outAmount * slippageBps / 10000).",
              "Map each routePlan entry to a normalized leg con index, ammLabel, mints, y fees.",
              "The priceImpactPct comes directly from the quote response."
            ]
          }
        }
      },
      "swap-v2-execution": {
        "title": "Execution & Reliability",
        "description": "State-machine execution, transaccion anatomy, retry/staleness reliability patterns, y high-signal swap run reporting.",
        "lessons": {
          "swap-v2-state-machine": {
            "title": "Challenge: Implement swap UI state machine",
            "content": "# Challenge: Implement swap UI state machine\n\nBuild a deterministic state machine para the swap UI flow:\n\n- States: idle → quoting → ready → sending → confirming → success | error\n- Process a sequence of events y track all state transitions\n- Invalid transitions should move to the error state con a descriptive message\n- The error state supports RESET (back to idle) y RETRY (back to quoting)\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "45 min",
            "hints": [
              "Define a TRANSITIONS map: each key is a state, each value maps event names to next states.",
              "If an event is not valid para the current state, transition to 'error' con a descriptive message.",
              "Track each transition in a history array con {from, event, to} objects.",
              "The 'error' state supports RESET (back to idle) y RETRY (back to quoting)."
            ]
          },
          "swap-v2-tx-anatomy": {
            "title": "Swap transaccion anatomy: instrucciones, cuentas, y compute",
            "content": "# Swap transaccion anatomy: instrucciones, cuentas, y compute\n\nA swap transaccion on Solana is a carefully ordered sequence of instrucciones that together achieve an atomic token exchange. Understanding each instruccion's role, the cuenta list requirements, y compute budget considerations is essential para building reliable swap flows.\n\nThe typical swap transaccion contains these instrucciones in order: (1) Compute Budget: SetComputeUnitLimit y SetComputeUnitPrice to ensure the transaccion has enough compute y appropriate priority. (2) Create ATA (if needed): createAssociatedTokenAccountIdempotent para the output token if the user doesn't already have one. (3) Wrap SOL (if input is native SOL): transfer SOL to a temporary WSOL cuenta y sync its balance. (4) Swap instruccion(s): the actual AMM program calls that execute the swap, referencing all required pool cuentas. (5) Unwrap WSOL (if output is native SOL): close the temporary WSOL cuenta y recover SOL.\n\nCuenta requirements scale con route complexity. A single-hop swap through Whirlpool requires approximately 12–15 cuentas (user cartera, token cuentas, pool state, oracle, tick arrays, etc.). A multi-hop route through two different AMMs can require 25+ cuentas, pushing against the transaccion size limit. Address Lookup Tables (ALTs) mitigate this by compressing cuenta references from 32 bytes to 1 byte each, but require a separate setup transaccion.\n\nCompute budget estimation is critical. A simple SOL → USDC Whirlpool swap uses roughly 80,000–120,000 compute units. Multi-hop routes can use 200,000–400,000+. Setting the compute limit too low causes the transaccion to fail. Setting it too high wastes the user's priority fee budget (priority fee = CU price × CU limit). Aggregators typically provide a recommended compute unit limit per route.\n\nPriority fees determine transaccion ordering. During high-demand periods (popular mints, volatile markets), transacciones compete para block space. The priority fee (in micro-lamports per compute unit) determines where your transaccion lands in the leader's queue. Too low y the transaccion may not be included; too high y the user overpays. Dynamic priority fee estimation uses recent block data to suggest competitive rates.\n\nTransaccion simulation before submission catches many errors: insufficient balance, missing cuentas, compute budget exceeded, slippage exceeded. Simulating saves the user from paying transaccion fees on doomed transacciones. The simulation result includes compute units consumed, log messages, y any error codes — all useful para debugging.\n\nVersioned transacciones (v0) are required when using Address Lookup Tables. Legacy transacciones cannot reference ALTs. Most modern swap aggregators return versioned transaccion messages. Carteras must support versioned transaccion signing (most do, but some older cartera adapters may not).\n\n## Checklist\n- Include compute budget instrucciones at the start of the transaccion\n- Create output ATA if it doesn't exist\n- Handle SOL wrapping/unwrapping para native SOL swaps\n- Simulate transacciones before submission\n- Use versioned transacciones when ALTs are needed\n\n## Red flags\n- Omitting compute budget instrucciones (uses default 200k limit)\n- Not creating output ATA before the swap instruccion\n- Forgetting to unwrap WSOL after receiving native SOL output\n- Skipping simulation y sending potentially invalid transacciones\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l6-q1",
                    "prompt": "Why are compute budget instrucciones placed first in a swap transaccion?",
                    "options": [
                      "The runtime reads them before executing other instrucciones to set limits",
                      "They must be first para signature verification",
                      "Other instrucciones depend on their output"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compute budget instrucciones configure the transaccion's CU limit y price before any program execution begins."
                  },
                  {
                    "id": "swap-v2-l6-q2",
                    "prompt": "What is the primary benefit of Address Lookup Tables para swaps?",
                    "options": [
                      "They compress cuenta references from 32 bytes to 1 byte, fitting more cuentas in a transaccion",
                      "They make transacciones faster to execute",
                      "They reduce the number of required signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "ALTs allow transacciones to reference many cuentas without exceeding the 1232-byte transaccion size limit."
                  }
                ]
              }
            ]
          },
          "swap-v2-reliability": {
            "title": "Reliability patterns: retries, stale quotes, y latency",
            "content": "# Reliability patterns: retries, stale quotes, y latency\n\nProduction swap flows must handle the reality of network latency, expired quotes, y transaccion failures. Reliability engineering separates toy swap implementations from production-grade systems that users trust con real money.\n\nQuote staleness is the primary reliability challenge. An aggregator quote reflects pool state at a specific moment. By the time the user reviews the quote, signs the transaccion, y it lands on-chain, pool reserves may have changed significantly. A quote older than 10–15 seconds should be considered potentially stale. The UI should show a countdown timer y automatically re-quote when the timer expires. Never allow users to send transacciones based on quotes older than 30 seconds.\n\nRetry strategies must distinguish between retryable y non-retryable failures. Retryable: network timeout, RPC node temporarily unavailable, blockhash expired (re-fetch y re-sign), y rate limiting (429 responses, back off exponentially). Non-retryable: insufficient balance, invalid cuenta state, slippage exceeded (pool price moved too far, re-quote required), y program errors indicating invalid instruccion data.\n\nExponential backoff con jitter prevents retry storms. Base delay of 500ms, multiplied by 2 on each retry, con random jitter of ±25% to prevent synchronized retries from multiple clients. Cap retries at 3–5 attempts. If all retries fail, present a clear error message con actionable options: \"Quote expired — refresh y try again\" rather than generic \"Transaccion failed.\"\n\nBlockhash management affects reliability. A transaccion's blockhash must be recent (within ~60 seconds / 150 slots). If a transaccion fails y you retry, the blockhash may have expired. The retry flow must: get a fresh blockhash, rebuild the transaccion con the new blockhash, re-sign, y re-submit. This is why swap transaccion building should be a reusable function that accepts a blockhash parameter.\n\nLatency budgets help set user expectations. Typical Solana transaccion confirmation takes 400ms–2 seconds. However, during congestion, confirmation can take 5–30 seconds or fail entirely. The UI should show progressive states: \"Submitting...\" → \"Confirming...\" con block confirmations. After 30 seconds without confirmation, offer the user a choice: wait longer, retry, or cancel (note: you cannot cancel a submitted transaccion, but you can stop polling y let the blockhash expire).\n\nTransaccion status polling should use WebSocket subscriptions (signatureSubscribe) para real-time confirmation rather than polling getTransaction. Polling creates unnecessary RPC load y introduces latency. Subscribe immediately after sendTransaction returns a signature, y set a timeout para maximum wait time.\n\n## Checklist\n- Show quote freshness countdown y auto-refresh\n- Classify errors as retryable vs non-retryable\n- Use exponential backoff con jitter para retries\n- Get fresh blockhash on each retry attempt\n- Use WebSocket subscriptions para confirmation\n\n## Red flags\n- Retrying non-retryable errors (wastes time y fees)\n- No retry limit (infinite retry loops)\n- Sending transacciones con stale quotes (>30 seconds)\n- Polling getTransaction instead of subscribing\n",
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
                    "note": "Transaccion confirmed after retry"
                  }
                ]
              }
            ]
          },
          "swap-v2-swap-report": {
            "title": "Checkpoint: Generate a SwapRunReport",
            "content": "# Checkpoint: Generate a SwapRunReport\n\nBuild the final swap run report that combines all curso concepts:\n\n- Summarize the route con leg details y total fees (using BigInt summation)\n- Compute the effective price as outAmount / inAmount (9 decimal precision)\n- Include the state machine outcome (finalState from the UI flow)\n- Collect all errors from the state result y additional error sources\n- Output must be stable JSON con deterministic key ordering\n\nThis checkpoint validates your complete understanding of swap aggregation.",
            "duration": "55 min",
            "hints": [
              "Use BigInt to sum fee amounts across all route legs.",
              "Effective price = outAmount / inAmount, formatted to 9 decimal places.",
              "Collect errors from both the state machine result y any additional errors array.",
              "Route summary should include index, ammLabel, pct, y feeAmount per leg."
            ]
          }
        }
      }
    }
  },
  "defi-clmm-liquidity": {
    "title": "CLMM Liquidity Engineering",
    "description": "Master concentrated liquidity engineering on Solana DEXs: tick math, range strategy diseno, fee/IL dynamics, y deterministic LP position reporting.",
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
        "description": "Concentrated liquidity concepts, tick/price math, y range-position behavior needed to reason about CLMM execution.",
        "lessons": {
          "clmm-v2-vs-cpmm": {
            "title": "CLMM vs constant product: why ticks exist",
            "content": "# CLMM vs constant product: why ticks exist\n\nConcentrated Liquidity Market Makers (CLMMs) represent a fundamental evolution in automated market maker diseno. To understand why they exist, we must first understand the limitations of the constant product model y then examine how tick-based systems solve those problems on Solana.\n\n## The constant product model y its inefficiency\n\nThe original AMM diseno, popularized by Uniswap V2 y adopted by Raydium V1 on Solana, uses the constant product invariant: x * y = k, where x y y are the reserves of two tokens y k is a constant. When a trader swaps token A para token B, the product must remain unchanged. This creates a smooth price curve that spans the entire range from zero to infinity.\n\nThe problem con this approach is capital inefficiency. If a SOL/USDC pool holds $10 million in liquidity, y SOL trades between $20 y $30 para months, the vast majority of that capital sits idle. Liquidity allocated to price ranges below $1 or above $1000 never participates in trades, earns no fees, yet still dilutes the returns para liquidity providers (LPs). In practice, studies show that less than 5% of liquidity in constant product pools is actively used at any given time.\n\n## Concentrated liquidity: the core insight\n\nCLMMs, pioneered by Uniswap V3 y implemented on Solana by Orca Whirlpools, Raydium Concentrated Liquidity, y Meteora DLMM, allow LPs to allocate capital to specific price ranges. Instead of spreading liquidity across all possible prices, an LP can say: \"I want to provide liquidity only between $20 y $30 para SOL/USDC.\" This concentrates their capital where trades actually happen, dramatically increasing capital efficiency.\n\nThe capital efficiency gain is substantial. An LP providing concentrated liquidity in a narrow range can achieve the same depth as a constant product LP con 100x or even 4000x less capital, depending on how tight the range is. This means more fees earned per dollar deployed, which is the fundamental value proposition of CLMMs.\n\n## Why ticks exist\n\nTo implement concentrated liquidity, the price space must be discretized. CLMMs divide the continuous price curve into discrete points called ticks. Each tick represents a specific price, y the relationship between tick index y price follows the formula: price = 1.0001^tick. This means each tick represents a 0.01% (1 basis point) change in price from the adjacent tick.\n\nTicks serve several critical purposes. First, they provide the boundaries para liquidity positions. When an LP creates a position from tick -1000 to tick 1000, they are defining a price range. Second, ticks are where liquidity transitions happen. As the price crosses a tick boundary, the active liquidity changes because positions that start or end at that tick become active or inactive. Third, ticks enable efficient fee tracking, because the protocol only needs to track fee growth at tick boundaries rather than at every possible price.\n\nTick spacing is an important optimization. Not every tick is usable in every pool. Pools con higher fee tiers use wider tick spacing (e.g., 64 or 128 ticks apart) to reduce gas costs y state size. A pool con tick spacing of 64 means LPs can only place position boundaries at tick indices that are multiples of 64. This tradeoff reduces granularity but improves on-chain efficiency, which is especially important on Solana where cuenta sizes y compute units matter.\n\n## Solana-specific CLMM considerations\n\nOn Solana, CLMMs face unique architectural challenges. The modelo de cuentas requires pre-allocated tick arrays that store tick data in contiguous ranges. Orca Whirlpools, para example, uses tick array cuentas that each hold 88 ticks worth of data. The program must load the correct tick array cuentas as instrucciones, which means swaps that cross many ticks require more cuentas y more compute units.\n\nThe Solana runtime's 1232-byte transaccion size limit y 200,000 compute unit default also constrain CLMM operations. Large swaps that cross multiple tick boundaries may need to be split across multiple transacciones, y position management operations must be carefully optimized to fit within these constraints.\n\n## LP decision framework\n\nBefore opening any CLMM position, answer three questions:\n1. What price regime am I targeting (mean-reverting vs trending)?\n2. How actively can I rebalance when out-of-range?\n3. What failure budget can I tolerate para fees vs IL vs rebalance costs?\n\nCLMM returns come from strategy discipline, not just math formulas.\n\n## Checklist\n- Understand that x*y=k spreads liquidity across all prices, wasting capital\n- CLMMs let LPs concentrate capital in specific price ranges\n- Ticks discretize the price space at 1 basis point intervals\n- Tick spacing varies by pool fee tier para on-chain efficiency\n- Solana CLMMs use tick array cuentas para state management\n\n## Red flags\n- Assuming CLMM positions behave like constant product positions\n- Ignoring tick spacing when placing position boundaries\n- Underestimating compute costs para swaps crossing many ticks\n- Forgetting that out-of-range positions earn zero fees\n",
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
                      "Lower transaccion fees para traders",
                      "No need para oracle price feeds"
                    ],
                    "answerIndex": 0,
                    "explanation": "CLMMs allow LPs to allocate capital to specific price ranges, dramatically improving capital efficiency compared to spreading liquidity across all prices."
                  },
                  {
                    "id": "clmm-v2-l1-q2",
                    "prompt": "Why do CLMMs use ticks to discretize the price space?",
                    "options": [
                      "To define position boundaries y track liquidity transitions efficiently",
                      "To make prices easier para humans to read",
                      "To reduce the number of tokens in the pool"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ticks provide discrete price points para position boundaries, liquidity transitions, y efficient fee tracking at tick crossings."
                  }
                ]
              }
            ]
          },
          "clmm-v2-price-tick": {
            "title": "Price, tick, y sqrtPrice: core conversions",
            "content": "# Price, tick, y sqrtPrice: core conversions\n\nThe mathematical foundation of every CLMM rests on three interrelated representations of price: the human-readable price, the tick index, y the sqrtPriceX64. Understanding how to convert between these representations is essential para building any CLMM integration on Solana.\n\n## Tick to price conversion\n\nThe fundamental relationship between a tick index y price is: price = 1.0001^tick. This formula means that each consecutive tick represents a 0.01% (1 basis point) change in price. Tick 0 corresponds to a price of 1.0. Positive ticks yield prices greater than 1, y negative ticks yield prices less than 1.\n\nPara example, tick 23027 gives a price of approximately 10.0 (since 1.0001^23027 is roughly 10). Tick -23027 gives approximately 0.1. This logarithmic spacing means ticks provide consistent relative precision across all price levels. Whether the price is 0.001 or 1000, adjacent ticks always differ by 0.01%.\n\nThe inverse conversion from price to tick uses the natural logarithm: tick = ln(price) / ln(1.0001). Since tick indices must be integers, this value is typically rounded to the nearest integer. In practice, you also need to align the tick to the pool's tick spacing, which means rounding down to the nearest multiple of the tick spacing value.\n\n## The sqrtPrice representation\n\nCLMMs do not store price directly on-chain. Instead, they store the square root of the price in a fixed-point format called sqrtPriceX64. This representation has two important advantages.\n\nFirst, using the square root simplifies the core AMM math. The amount of token0 in a position is proportional to (1/sqrtPrice_lower - 1/sqrtPrice_upper), y the amount of token1 is proportional to (sqrtPrice_upper - sqrtPrice_lower). These linear relationships are much easier to compute on-chain than the original price-based formulas would be.\n\nSecond, the X64 fixed-point format (also called Q64.64) provides high precision without floating-point arithmetic. The sqrtPrice is multiplied by 2^64 y stored as a 128-bit unsigned integer. This means sqrtPriceX64 = sqrt(price) * 2^64. Para tick 0 (price = 1.0), the sqrtPriceX64 is exactly 2^64 = 18446744073709551616.\n\nOn Solana, Orca Whirlpools stores this value as a u128 in the Whirlpool cuenta state. Every swap operation updates this value as the price moves. The sqrt_price field is the canonical source of truth para the current pool price.\n\n## Decimal handling y token precision\n\nReal-world tokens have different decimal places. SOL has 9 decimals, USDC has 6 decimals. The tick-to-price formula gives a \"raw\" price that must be adjusted para decimals. If token0 is SOL (9 decimals) y token1 is USDC (6 decimals), the human-readable price is: display_price = raw_price * 10^(decimals0 - decimals1) = raw_price * 10^(9-6) = raw_price * 1000.\n\nThis decimal adjustment is critical y a common source of bugs. Always track which token is token0 y which is token1 in the pool, y apply the correct decimal scaling when converting between on-chain tick values y display prices.\n\n## Tick spacing y alignment\n\nNot every tick index is a valid position boundary. Each pool has a tick_spacing parameter that determines which ticks can be used. Common values are: 1 (para stable pairs con 0.01% fee), 8 (para 0.04% fee pools), 64 (para 0.30% fee pools), y 128 (para 1.00% fee pools).\n\nTo align a tick to the pool's tick spacing, use: aligned_tick = floor(tick / tick_spacing) * tick_spacing. This always rounds toward negative infinity, ensuring consistent behavior para both positive y negative ticks. Para example, con tick spacing 64: tick 100 aligns to 64, tick -100 aligns to -128.\n\n## Precision considerations\n\nFloating-point arithmetic introduces rounding errors in tick/price conversions. When converting price to tick y back, the result may differ by 1 tick due to floating-point precision limits. Para on-chain operations, always use the integer tick index as the source of truth y derive the price from it, never the reverse.\n\nThe sqrtPriceX64 computation using BigInt avoids floating-point issues para the final representation, but the intermedio sqrt y pow operations still use JavaScript's 64-bit floats. Para production systems processing large values, consider using dedicated decimal libraries or performing these computations con higher-precision arithmetic.\n\n## Checklist\n- price = 1.0001^tick para tick-to-price conversion\n- tick = round(ln(price) / ln(1.0001)) para price-to-tick conversion\n- sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64))\n- Align ticks to tick spacing: floor(tick / spacing) * spacing\n- Adjust para token decimals when displaying human-readable prices\n\n## Red flags\n- Ignoring decimal differences between token0 y token1\n- Using floating-point price as source of truth instead of tick index\n- Forgetting tick spacing alignment when creating positions\n- Overflow in sqrtPriceX64 computation para extreme tick values\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l2-q1",
                    "prompt": "What is the sqrtPriceX64 value para tick 0 (price = 1.0)?",
                    "options": [
                      "2^64 = 18446744073709551616",
                      "1",
                      "2^128"
                    ],
                    "answerIndex": 0,
                    "explanation": "At tick 0, price = 1.0, sqrt(1.0) = 1.0, y sqrtPriceX64 = 1.0 * 2^64 = 18446744073709551616."
                  },
                  {
                    "id": "clmm-v2-l2-q2",
                    "prompt": "Why do CLMMs store sqrtPrice instead of price directly?",
                    "options": [
                      "It simplifies the AMM math — token amounts become linear in sqrtPrice",
                      "It uses less storage space on-chain",
                      "It makes the price harder para MEV bots to read"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts in a CLMM position are linear functions of sqrtPrice, making on-chain computation simpler y more gas-efficient."
                  }
                ]
              }
            ]
          },
          "clmm-v2-range-explorer": {
            "title": "Range positions: in-range y out-of-range dynamics",
            "content": "# Range positions: in-range y out-of-range dynamics\n\nA CLMM position is defined by its lower tick y upper tick. These two boundaries determine the price range in which the position is active, earns fees, y holds a mix of both tokens. Understanding in-range y out-of-range behavior is fundamental to managing concentrated liquidity effectively on Solana.\n\n## Anatomy of a range position\n\nWhen an LP creates a position on Orca Whirlpools (or any Solana CLMM), they specify three parameters: the lower tick index, the upper tick index, y the amount of liquidity to provide. The protocol then calculates how much of each token the LP must deposit based on the current price relative to the position's range.\n\nIf the current price is within the range (lower_tick <= current_tick <= upper_tick), the LP deposits both tokens. The ratio depends on where the current price sits within the range. If the price is near the lower bound, the position holds mostly token0. If near the upper bound, it holds mostly token1. This is the direct analog of how a constant product pool holds different ratios at different prices, but concentrated into the LP's chosen range.\n\n## In-range behavior\n\nWhen the current pool price is within a position's range, the position is in-range y actively participates in swaps. Every swap that moves the price within this range uses the position's liquidity y generates fees para the LP.\n\nThe fee accrual mechanism works as follows: the pool tracks a global fee_growth value para each token. When a swap occurs, the fee (e.g., 0.30% of the swap amount) is distributed proportionally across all in-range liquidity. Each position tracks its own fee_growth snapshot, y uncollected fees are the difference between the current global growth y the position's snapshot, multiplied by the position's liquidity.\n\nIn-range positions experience impermanent loss (IL) as the price moves. When the price moves up, the position converts token0 into token1 (selling token0 at higher prices). When the price moves down, it converts token1 into token0. This rebalancing is the source of IL, y it is more pronounced in CLMMs than in constant product pools because the liquidity is concentrated in a narrower range.\n\n## Out-of-range behavior\n\nWhen the price moves outside a position's range, the position becomes out-of-range. This has critical implications. The position stops earning fees entirely because it no longer participates in swaps. The position holds 100% of one token: if the price moved above the upper tick, the position holds entirely token1 (all token0 was sold as the price rose). If the price moved below the lower tick, the position holds entirely token0 (all token1 was sold as the price fell).\n\nAn out-of-range position is effectively a limit order that has been filled. If you set a range above the current price y the price rises through it, your token0 is converted to token1 at prices within your range. This property makes CLMMs useful para implementing range orders y dollar-cost averaging strategies.\n\nOut-of-range positions still exist on-chain y can be closed or modified at any time. The LP can withdraw their single-sided holdings, or they can wait para the price to return to their range. If the price returns, the position automatically becomes active again y starts earning fees.\n\n## Position composition at boundaries\n\nAt the exact lower tick, the position holds 100% token0 y 0% token1. At the exact upper tick, it holds 0% token0 y 100% token1. At any price between, the composition is a function of where the current sqrtPrice sits relative to the range boundaries.\n\nThe token amounts are calculated as: amount0 = liquidity * (1/sqrtPrice_current - 1/sqrtPrice_upper) y amount1 = liquidity * (sqrtPrice_current - sqrtPrice_lower). These formulas only apply when the price is in-range. When out-of-range below, amount0 = liquidity * (1/sqrtPrice_lower - 1/sqrtPrice_upper) y amount1 = 0. When out-of-range above, amount0 = 0 y amount1 = liquidity * (sqrtPrice_upper - sqrtPrice_lower).\n\n## Active liquidity y the liquidity curve\n\nThe pool's active liquidity at any given price is the sum of all in-range positions at that price. This creates a liquidity distribution curve that can have complex shapes depending on where LPs have placed their positions. Deeper liquidity at the current price means less slippage para traders.\n\nOn Solana, this active liquidity is stored in the Whirlpool cuenta's liquidity field y is updated whenever the price crosses a tick boundary where positions start or end. The tick array cuentas store the net liquidity change at each initialized tick, allowing the program to efficiently update active liquidity during swaps.\n\n## Checklist\n- In-range positions earn fees y hold both tokens\n- Out-of-range positions earn zero fees y hold one token\n- Token composition varies continuously within the range\n- Active liquidity is the sum of all in-range positions\n- Fee growth tracking uses global vs position-level snapshots\n\n## Red flags\n- Expecting fees from out-of-range positions\n- Ignoring the single-sided nature of out-of-range holdings\n- Forgetting to cuenta para IL in concentrated positions\n- Assuming position composition is static within a range\n",
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
            "content": "# Challenge: Implement tick/price conversion helpers\n\nImplement the core tick math functions used in every CLMM integration:\n\n- Convert a tick index to a human-readable price using price = 1.0001^tick\n- Convert the price to sqrtPriceX64 using Q64.64 fixed-point encoding\n- Reverse-convert a price back to the nearest tick index\n- Align a tick index to the pool's tick spacing\n\nYour implementation will be tested against known tick values including tick 0, positive ticks, y negative ticks.",
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
        "description": "Fee accrual simulation, range strategy tradeoffs, precision pitfalls, y deterministic position risk reporting.",
        "lessons": {
          "clmm-v2-position-fees": {
            "title": "Challenge: Simulate position fee accrual",
            "content": "# Challenge: Simulate position fee accrual\n\nImplement a fee accrual simulator para a CLMM position over a price path:\n\n- Convert lower y upper tick boundaries to prices\n- Walk through each price in the path y determine in-range or out-of-range status\n- Accrue fees proportional to trade volume when in-range\n- Compute annualized fee APR\n- Track periods in-range vs out-of-range\n- Determine current status from the final price\n\nThis simulates the real-world behavior of concentrated liquidity positions as prices move.",
            "duration": "50 min",
            "hints": [
              "Convert ticks to prices: lowerPrice = 1.0001^lowerTick, upperPrice = 1.0001^upperTick.",
              "Para each price in the path, check if lowerPrice <= price <= upperPrice.",
              "Fees only accrue when the position is in range. fee = floor(volumePerPeriod * feeRate).",
              "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimal places.",
              "Current status is based on the last price in the path relative to the range."
            ]
          },
          "clmm-v2-range-strategy": {
            "title": "Range strategies: tight, wide, y rebalancing rules",
            "content": "# Range strategies: tight, wide, y rebalancing rules\n\nChoosing the right price range is the most important decision a CLMM liquidity provider makes. The range determines capital efficiency, fee income, impermanent loss exposure, y rebalancing frequency. This leccion covers the major strategies y the tradeoffs between them.\n\n## Tight ranges: maximum efficiency, maximum risk\n\nA tight range concentrates all liquidity into a narrow price band. Para example, providing liquidity para SOL/USDC within +/- 2% of the current price. The advantages are significant: capital efficiency can be 100x or more compared to a full-range position, y the LP earns a proportionally larger share of trading fees.\n\nHowever, tight ranges carry substantial risks. The position goes out-of-range frequently, requiring active monitoring y rebalancing. Each time the position goes out-of-range, the LP has fully converted to one token y stops earning fees. The LP also realizes impermanent loss on each range crossing, y the gas costs of frequent rebalancing can eat into profits.\n\nTight ranges work best para stable pairs (USDC/USDT) where the price rarely deviates significantly, para professional LPs who can automate rebalancing, y para short-term positions where the LP has a strong directional view.\n\n## Wide ranges: passive y resilient\n\nA wide range covers a larger price band, such as +/- 50% or even the full price range. Capital efficiency is lower, but the position stays in-range longer y requires less active management. Fee income per dollar is lower, but the position earns fees more consistently.\n\nWide ranges suit passive LPs who cannot actively monitor positions, volatile pairs where the price can swing dramatically, y LPs who want to minimize rebalancing costs y IL realization events.\n\nThe extreme case is a full-range position covering all ticks. This replicates constant product AMM behavior y never goes out-of-range. While capital-inefficient, it provides maximum resilience y is appropriate para very volatile or low-liquidity pairs.\n\n## Asymmetric ranges y directional bets\n\nLPs can create asymmetric ranges that express a directional view. If you believe SOL will appreciate against USDC, you might set a range from the current price up to 2x the current price. This means you are providing liquidity as SOL appreciates, selling SOL at progressively higher prices. If SOL drops, your position immediately goes out-of-range y you hold SOL, preserving your long exposure.\n\nConversely, a range set below the current price acts like a limit buy order. You deposit USDC, y if SOL's price drops into your range, your USDC is converted to SOL at your desired prices.\n\n## Rebalancing strategies\n\nRebalancing is the process of closing an out-of-range position y opening a new one centered on the current price. The key decisions are: when to rebalance, y how to set the new range.\n\nTime-based rebalancing checks the position at fixed intervals (hourly, daily) y rebalances if out-of-range. This is simple to implement but may miss optimal timing. Price-based rebalancing uses the current price relative to the range boundaries. A common trigger is rebalancing when the price exits the inner 50% of the range, before it actually goes out-of-range.\n\nThreshold-based rebalancing waits until the IL or missed-fee cost of remaining out-of-range exceeds the cost of rebalancing (gas fees, slippage on swaps needed to rebalance token composition). This is the most capital-efficient approach but requires sophisticated modeling.\n\nOn Solana, rebalancing a Whirlpool position involves three operations: collecting unclaimed fees, closing the old position (withdrawing liquidity y burning the position NFT), y opening a new position con updated range. These operations typically fit in two to three transacciones depending on the number of cuentas involved.\n\n## Automated vault strategies\n\nSeveral protocols on Solana automate CLMM range management. These vault protocols (such as Kamino Finance) accept LP deposits y automatically create, monitor, y rebalance concentrated liquidity positions. They use various strategies including mean-reversion, momentum-following, y volatility-adjusted range widths.\n\nWhen evaluating automated vaults, consider: the strategy's historical rendimiento, the management y rendimiento fees, the rebalancing frequency y associated costs, y the vault's transparency about its position management logic.\n\n## Checklist\n- Tight ranges maximize efficiency but require active management\n- Wide ranges provide resilience at the cost of efficiency\n- Asymmetric ranges can express directional views\n- Rebalancing triggers: time-based, price-based, or threshold-based\n- Consider automated vaults para passive management\n\n## Red flags\n- Using tight ranges without monitoring or automation\n- Rebalancing too frequently, losing fees to gas costs\n- Ignoring the realized IL at each rebalancing event\n- Assuming past APR will predict future returns\n",
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
                      "Higher capital efficiency but more frequent out-of-range events y rebalancing",
                      "Lower fees but less impermanent loss",
                      "More tokens required to open the position"
                    ],
                    "answerIndex": 0,
                    "explanation": "Tight ranges concentrate capital para higher efficiency y fee share, but the position goes out-of-range more often, requiring active management."
                  },
                  {
                    "id": "clmm-v2-l6-q2",
                    "prompt": "When should an LP consider a full-range (all ticks) position?",
                    "options": [
                      "Para very volatile pairs where the price may swing dramatically",
                      "Only para stablecoin pairs",
                      "Never — it is always suboptimal"
                    ],
                    "answerIndex": 0,
                    "explanation": "Full-range positions replicate constant product behavior y never go out-of-range, making them suitable para highly volatile or unpredictable pairs."
                  }
                ]
              }
            ]
          },
          "clmm-v2-risk-review": {
            "title": "CLMM risks: rounding, overflow, y tick spacing errors",
            "content": "# CLMM risks: rounding, overflow, y tick spacing errors\n\nBuilding reliable CLMM integrations requires awareness of precision risks that can cause incorrect calculations, failed transacciones, or lost funds. This leccion catalogs the most common pitfalls in tick math, fee computation, y position management on Solana.\n\n## Floating-point rounding in tick conversions\n\nThe tick-to-price formula price = 1.0001^tick y its inverse tick = ln(price) / ln(1.0001) both involve floating-point arithmetic. JavaScript's Number type uses IEEE 754 double-precision (64-bit) floats, which provide approximately 15-17 significant decimal digits. Para most tick ranges (roughly -443636 to +443636, the valid CLMM range), this precision is sufficient.\n\nHowever, rounding errors accumulate in compound operations. Converting a tick to a price y back may yield tick +/- 1 due to floating-point rounding in the logarithm. The safest practice is to always treat the integer tick index as the canonical value. If you need a price, derive it from the tick. If you need a tick from a user-entered price, compute the tick y then show the user the exact price that tick represents, so they see the actual boundary rather than an approximation.\n\nThe Math.round function in the priceToTick conversion introduces its own edge cases. When the true tick is exactly X.5, Math.round uses \"round half to even\" (banker's rounding) in some environments. Para CLMM math, always round toward the nearest valid tick y then align to tick spacing.\n\n## Overflow in sqrtPriceX64 computation\n\nThe sqrtPriceX64 value is stored as a u128 on-chain (128-bit unsigned integer). In JavaScript, this must be handled con BigInt. The intermedio computation sqrt(price) * 2^64 can overflow a 64-bit float para extreme tick values. At the maximum valid tick (443636), the price is approximately 1.34 * 10^19, y sqrt(price) * 2^64 is approximately 6.75 * 10^28, which fits in a u128 but exceeds the safe integer range of JavaScript Numbers.\n\nAlways use BigInt para the final sqrtPriceX64 value. Para intermedio computations at extreme ticks, consider using a high-precision library or performing the computation in Rust (where Solana programs actually run). Para client-side JavaScript, the practico risk is manageable para common token pairs but must be tested at boundary conditions.\n\n## Tick spacing alignment errors\n\nA frequent bug is creating positions con tick boundaries that are not aligned to the pool's tick spacing. The on-chain program will reject these positions, but the error message may be cryptic. Always align ticks before submitting transacciones: aligned = floor(tick / tickSpacing) * tickSpacing.\n\nBe careful con negative ticks: floor(-100 / 64) = floor(-1.5625) = -2, so -100 aligns to -128, not -64. This is correct behavior (rounding toward negative infinity), but developers who expect truncation toward zero will get wrong results. Test con negative ticks explicitly.\n\n## Fee computation precision\n\nFee growth values in CLMMs use 128-bit fixed-point arithmetic (Q64.64 or Q128.128 depending on the implementation). When computing uncollected fees, the formula is: uncollected_fees = (global_fee_growth - position_fee_growth_snapshot) * liquidity.\n\nBoth the subtraction y the multiplication can overflow if not handled carefully. On Solana, the program uses checked arithmetic y wrapping subtraction (since fee_growth is monotonically increasing y wraps around). Client-side code must replicate this wrapping behavior when reading on-chain state.\n\nA common mistake is computing fees con JavaScript Numbers, which lose precision para large BigInt values. Always use BigInt para fee calculations y only convert to Number at the final display step, after applying decimal adjustments.\n\n## Decimal mismatch between tokens\n\nDifferent tokens have different decimal places (SOL: 9, USDC: 6, BONK: 5). When computing position values, token amounts, or fee amounts, the decimal places must be consistently applied. A common bug is computing IL in raw amounts without normalizing to the same decimal base, leading to wildly incorrect results.\n\nAlways track the decimal places of both tokens in the pool y apply them when converting between raw amounts y display amounts. The on-chain CLMM program operates entirely in raw (lamport-level) amounts; all decimal formatting is a client-side responsibility.\n\n## Cuenta y compute unit limits\n\nSolana-specific risks include exceeding compute unit limits during swaps that cross many ticks, requiring too many tick array cuentas (each swap can reference at most a few tick arrays), y cuenta size limits para position management.\n\nWhen building swap transacciones, estimate the number of tick crossings y include sufficient tick array cuentas. If a swap would cross more ticks than can be accommodated, the transaccion will fail. Splitting large swaps across multiple transacciones or using a routing protocol helps mitigate this risk.\n\n## Checklist\n- Use integer tick index as canonical, derive price from it\n- Use BigInt para sqrtPriceX64 y all fee computations\n- Always align ticks to tick spacing con floor division\n- Test con negative ticks, zero ticks, y extreme ticks\n- Apply correct decimal places para each token in the pool\n\n## Red flags\n- Using JavaScript Number para sqrtPriceX64 or fee amounts\n- Forgetting wrapping subtraction para fee growth deltas\n- Truncating instead of flooring para negative tick alignment\n- Computing IL or fees without matching token decimals\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l7-q1",
                    "prompt": "Why should you always use BigInt para sqrtPriceX64 values?",
                    "options": [
                      "JavaScript Number cannot safely represent 128-bit integers",
                      "BigInt is faster than Number para CLMM math",
                      "Solana requires BigInt in transaccion instrucciones"
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
            "content": "# Checkpoint: Generate a Position Report\n\nImplement a comprehensive LP position report generator that combines all CLMM concepts:\n\n- Convert tick boundaries to human-readable prices\n- Determine in-range or out-of-range status from the current price\n- Aggregate fee history into total earned fees per token\n- Compute annualized fee APR\n- Calculate impermanent loss percentage\n- Return a complete, deterministic position report\n\nThis checkpoint validates your understanding of tick math, fee accrual, range dynamics, y position analysis.",
            "duration": "55 min",
            "hints": [
              "Convert ticks to prices: price = 1.0001^tick. Use toFixed(6) para display.",
              "Status is 'in-range' if lowerPrice <= currentPrice <= upperPrice.",
              "Sum feeHistory entries using BigInt para total fees per token.",
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
    "description": "Master Solana lending risk engineering: utilization y rate mechanics, liquidation path analysis, oracle safety, y deterministic scenario reporting.",
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
        "description": "Lending pool mechanics, utilization-driven rate models, y health-factor foundations required para defensible risk analysis.",
        "lessons": {
          "lending-v2-pool-model": {
            "title": "Lending pool model: supply, borrow, y utilization",
            "content": "# Lending pool model: supply, borrow, y utilization\n\nLending protocols are the backbone of decentralized finance. They enable users to earn yield on idle assets by supplying them to a shared pool, while borrowers draw from that pool by posting collateral. Understanding the mechanics of supply, borrow, y utilization is essential before diving into interest rate models or liquidation logic.\n\nA lending pool is a smart contract (or set of cuentas on Solana) that holds a reserve of a single token — para example, USDC. Suppliers deposit tokens into the pool y receive interest-bearing receipt tokens in return. On Solana-based protocols like Solend, MarginFi, or Kamino, these receipt tokens track each supplier's proportional share of the growing pool. When a supplier withdraws, they redeem receipt tokens para the underlying asset plus accrued interest.\n\nBorrowers interact con the same pool from the other side. To borrow from the USDC pool, a user must first deposit collateral into one or more other pools (para example, SOL). The protocol values the collateral in USD terms y allows the user to borrow up to a percentage of that value, determined by the loan-to-value (LTV) ratio. If SOL has an LTV of 75%, depositing $1,000 worth of SOL allows borrowing up to $750 in USDC. The borrowed amount accrues interest over time, increasing the user's debt.\n\nThe utilization ratio is the single most important metric in a lending pool. It is defined as:\n\nutilization = totalBorrowed / totalSupply\n\nwhere totalSupply is the sum of all deposits (including borrowed amounts that are still owed back to the pool). When utilization is 0%, no assets are borrowed — suppliers earn nothing. When utilization is 100%, every deposited asset is lent out — no supplier can withdraw because there is no liquidity available. Healthy protocols target utilization between 60% y 85%, balancing yield para suppliers against withdrawal liquidity.\n\nThe reserve factor is a protocol-level parameter that skims a percentage of the interest paid by borrowers before distributing the remainder to suppliers. If borrowers pay 10% annual interest y the reserve factor is 10%, the protocol retains 1% y suppliers receive the effective yield on the remaining 9%. Reserve funds are used para protocol insurance, development, y gobernanza treasury. Understanding the reserve factor is critical because it directly reduces the supply-side APY relative to the borrow-side APR.\n\nPool accounting must be exact. Solana lending protocols typically use a shares-based model: when you deposit 100 USDC into a pool con 1,000 USDC total y 1,000 shares outstanding, you receive 100 shares. As interest accrues, the total USDC in the pool grows (say to 1,100 USDC), but the share count remains 1,100. Your 100 shares are now worth 100 USDC — the value per share increased. This model avoids iterating over every depositor to distribute interest. The same pattern applies to borrow shares, tracking each borrower's proportional debt.\n\nOn Solana specifically, lending pools are represented as program-derived cuentas. The reserve cuenta holds the token balance, a reserve config cuenta stores parameters (LTV, liquidation threshold, reserve factor, interest rate model), y individual obligation cuentas track each user's deposits y borrows. Programs like Solend use the spl-token program para token custody y Pyth or Switchboard oracles para price feeds.\n\n## Risk-operator mindset\n\nTreat every pool as a control system, not just a yield product:\n1. utilization controls liquidity stress,\n2. rate model controls borrower behavior,\n3. oracle quality controls collateral truth,\n4. liquidation speed controls solvency recovery.\n\nWhen one control weakens, the others must compensate.\n\n## Checklist\n- Understand the relationship between supply, borrow, y utilization\n- Know that utilization = totalBorrowed / totalSupply\n- Recognize that the reserve factor reduces supplier yield\n- Understand share-based accounting para deposits y borrows\n- Identify the key on-chain cuentas in a Solana lending pool\n\n## Red flags\n- Utilization at or near 100% (withdrawal liquidity crisis)\n- Missing or zero reserve factor (no protocol safety buffer)\n- Share-price manipulation through donation attacks\n- Pools without oracle-backed price feeds para collateral valuation\n",
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
            "title": "Interest rate curves y the kink model",
            "content": "# Interest rate curves y the kink model\n\nInterest rates in lending protocols are not fixed. They adjust dynamically based on pool utilization to balance supply y demand para liquidity. The piecewise-linear \"kink\" model is the dominant interest rate diseno used across DeFi lending protocols, from Compound y Aave on Ethereum to Solend y MarginFi on Solana.\n\nThe core insight is simple: when utilization is low, borrowing should be cheap to encourage demand. When utilization is high, borrowing should be expensive to discourage further borrowing y incentivize new deposits. The kink model achieves this con two linear segments joined at a critical utilization point called the \"kink.\"\n\nThe kink model has four parameters: baseRate, slope1, slope2, y kink. The baseRate is the minimum borrow rate when utilization is zero. Slope1 is the rate of increase below the kink — a gentle incline that gradually raises borrow costs as utilization increases. The kink is the target utilization (typically 0.80 or 80%). Slope2 is the steep rate of increase above the kink — a sharp jump that penalizes borrowing when the pool approaches full utilization.\n\nBelow the kink, the borrow rate formula is:\n\nborrowRate = baseRate + (utilization / kink) * slope1\n\nThis creates a gentle linear increase. At 50% utilization con a kink at 80%, baseRate of 2%, y slope1 of 10%, the borrow rate would be: 0.02 + (0.50 / 0.80) * 0.10 = 0.02 + 0.0625 = 0.0825 or 8.25%.\n\nAbove the kink, the formula becomes:\n\nborrowRate = baseRate + slope1 + ((utilization - kink) / (1 - kink)) * slope2\n\nThe full slope1 is added (the rate at the kink point), plus a steep increase proportional to how far utilization exceeds the kink. Con slope2 = 1.00 (100%), at 90% utilization: 0.02 + 0.10 + ((0.90 - 0.80) / (1 - 0.80)) * 1.00 = 0.02 + 0.10 + 0.50 = 0.62 or 62%. This dramatic jump is intentional — it makes borrowing above 80% utilization extremely expensive, creating strong pressure to restore utilization below the kink.\n\nThe supply rate is derived from the borrow rate, utilization, y reserve factor:\n\nsupplyRate = borrowRate * utilization * (1 - reserveFactor)\n\nSuppliers only earn on the portion of the pool that is actively borrowed, y the reserve factor takes its cut. At 50% utilization, an 8.25% borrow rate, y 10% reserve factor: 0.0825 * 0.50 * 0.90 = 0.037125 or 3.71% supply APY.\n\nWhy the kink matters: without the steep slope2, high utilization would only moderately increase rates, potentially leading to a \"liquidity death spiral\" where all assets are borrowed y no supplier can withdraw. The kink creates an economic circuit breaker. Protocols tune these parameters through gobernanza — adjusting the kink point, slopes, y base rate to target different utilization profiles para different assets. Stablecoins typically have higher kinks (85-90%) because their prices are stable, while volatile assets have lower kinks (65-75%) to maintain larger liquidity buffers.\n\nReal-world Solana protocols often extend this model con additional features: rate smoothing (averaging over recent blocks to prevent rapid oscillations), multiple kink points para more granular control, y dynamic parameter adjustment based on market conditions. However, the fundamental two-slope kink model remains the foundation.\n\n## Checklist\n- Understand the four parameters: baseRate, slope1, slope2, kink\n- Calculate borrow rate below y above the kink\n- Derive supply rate from borrow rate, utilization, y reserve factor\n- Recognize why steep slope2 prevents liquidity crises\n- Know that different assets use different kink parameters\n\n## Red flags\n- Slope2 too low (insufficient deterrent para high utilization)\n- Kink set too high (leaves insufficient withdrawal buffer)\n- Base rate at zero (no minimum cost of borrowing)\n- Parameters unchanged despite market condition shifts\n",
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
                    "explanation": "Above the kink, slope2 (the jump multiplier) applies, causing borrow rates to spike sharply y discourage further borrowing."
                  },
                  {
                    "id": "lending-v2-l2-q2",
                    "prompt": "Why is the supply rate always lower than the borrow rate?",
                    "options": [
                      "Suppliers only earn on the borrowed portion, y the reserve factor takes a cut",
                      "The protocol subsidizes borrowers",
                      "Supply rates are fixed by gobernanza"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply rate = borrowRate * utilization * (1 - reserveFactor). Since utilization < 1 y reserveFactor > 0, the supply rate is always less than the borrow rate."
                  }
                ]
              }
            ]
          },
          "lending-v2-health-explorer": {
            "title": "Health factor monitoring y liquidation preview",
            "content": "# Health factor monitoring y liquidation preview\n\nThe health factor is the single number that determines whether a lending position is safe or subject to liquidation. Monitoring health factors in real time is essential para both borrowers (to avoid liquidation) y liquidators (to identify profitable liquidation opportunities). Understanding how to compute, interpret, y react to health factor changes is a core skill para DeFi risk management.\n\nThe health factor formula is:\n\nhealthFactor = (collateralValue * liquidationThreshold) / borrowValue\n\nwhere collateralValue is the total USD value of all deposited collateral, liquidationThreshold is the weighted average threshold across all collateral assets, y borrowValue is the total USD value of all outstanding borrows. When the health factor drops below 1.0, the position becomes eligible para liquidation.\n\nThe liquidation threshold is distinct from the loan-to-value (LTV) ratio. LTV determines the maximum amount you can borrow — para example, 75% LTV on SOL means you can borrow up to 75% of your SOL collateral value. The liquidation threshold is higher — say 80% — providing a buffer zone. You can borrow at 75% LTV, y you are only liquidated when your effective ratio exceeds 80%. This 5% gap gives borrowers time to add collateral or repay debt before liquidation.\n\nWhen a user has multiple collateral assets, the effective liquidation threshold is a weighted average. If you deposit $1,000 of SOL (threshold 0.80) y $500 of ETH (threshold 0.75), the weighted threshold is: (1000 * 0.80 + 500 * 0.75) / 1500 = (800 + 375) / 1500 = 0.7833. This weighted threshold is used in the health factor calculation.\n\nHealth factor interpretation: a value of 2.0 means the position can withstand a 50% decline in collateral value (or 50% increase in borrow value) before liquidation. A value of 1.5 provides a 33% buffer. A value of 1.1 is dangerously close — a 9% adverse price move triggers liquidation. Professional risk managers target health factors of 1.5 or above, con automated alerts below 1.3 y emergency actions below 1.2.\n\nMonitoring dashboards should display: current health factor con color coding (green above 1.5, yellow 1.2-1.5, red below 1.2), the price change percentage needed to trigger liquidation, estimated liquidation prices para each collateral asset, y historical health factor over time. On Solana, health factor data can be derived by reading obligation cuentas y combining con oracle price feeds from Pyth or Switchboard.\n\nLiquidation preview calculations help users understand their worst-case exposure. The maximum additional borrow is: max(0, collateralValue * effectiveThreshold - currentBorrow). The liquidation shortfall (when health factor < 1.0) is: currentBorrow - collateralValue * effectiveThreshold. This shortfall represents how much additional collateral or debt repayment is needed to restore the position to safety.\n\nPrice scenario analysis extends monitoring to \"what-if\" questions. What happens to the health factor if SOL drops 20%? If both SOL y ETH drop 30%? If interest accrues para another month? By computing health factors across a range of price scenarios, borrowers can proactively manage risk before adverse conditions materialize. This scenario-based approach forms the foundation of the risk report challenge later in this curso.\n\n## Checklist\n- Calculate health factor using weighted liquidation thresholds\n- Distinguish between LTV (borrowing limit) y liquidation threshold\n- Compute maximum additional borrow y liquidation shortfall\n- Set up monitoring con color-coded health factor alerts\n- Run price scenario analysis before major market events\n\n## Red flags\n- Health factor below 1.2 without active monitoring\n- No alerts configured para health factor changes\n- Ignoring weighted threshold calculations para multi-asset positions\n- Failing to cuenta para accruing interest in health factor projections\n",
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
                    "note": "Health factor below 1.0 — position is eligible para liquidation"
                  }
                ]
              }
            ]
          },
          "lending-v2-interest-rates": {
            "title": "Challenge: Compute utilization-based interest rates",
            "content": "# Challenge: Compute utilization-based interest rates\n\nImplement the kink-based interest rate model used by lending protocols:\n\n- Calculate the utilization ratio from total supply y total borrowed\n- Apply the piecewise-linear kink model con baseRate, slope1, slope2, y kink\n- Compute the borrow rate using the appropriate formula para below-kink y above-kink regions\n- Derive the supply rate from borrow rate, utilization, y reserve factor\n- Handle edge cases: zero supply, zero borrows, utilization at exactly the kink\n- Return all values formatted to 6 decimal places\n\nYour implementation must be deterministic — same input always produces same output.",
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
        "description": "Health-factor computation, liquidation mechanics, oracle failure handling, y multi-scenario risk reporting para stressed markets.",
        "lessons": {
          "lending-v2-health-factor": {
            "title": "Challenge: Compute health factor y liquidation status",
            "content": "# Challenge: Compute health factor y liquidation status\n\nImplement the health factor computation para a multi-asset lending position:\n\n- Sum collateral y borrow values from an array of position objects\n- Compute weighted average liquidation threshold across all collateral assets\n- Calculate the health factor using the standard formula\n- Determine liquidation eligibility (health factor below 1.0)\n- Calculate maximum additional borrow capacity y liquidation shortfall\n- Handle edge cases: no borrows (max health factor), no collateral, single asset\n\nReturn all USD values to 2 decimal places y health factor to 4 decimal places.",
            "duration": "50 min",
            "hints": [
              "Collateral value = sum of (amount * priceUsd) para all collateral positions.",
              "Effective threshold = weighted average of liquidationThreshold by collateral value.",
              "Health factor = (collateralValue * effectiveThreshold) / borrowValue.",
              "Max additional borrow = max(0, collateralValue * threshold - currentBorrow)."
            ]
          },
          "lending-v2-liquidation-mechanics": {
            "title": "Liquidation mechanics: bonus, close factor, y bad debt",
            "content": "# Liquidation mechanics: bonus, close factor, y bad debt\n\nLiquidation is the enforcement mechanism that keeps lending protocols solvent. When a borrower's health factor falls below 1.0, external actors called liquidators can repay a portion of the debt in exchange para the borrower's collateral at a discount. Understanding liquidation mechanics — the incentive structure, limits, y failure modes — is essential para anyone building on or using lending protocols.\n\nThe liquidation bonus (also called the liquidation incentive or discount) is the premium liquidators receive para performing liquidations. If the liquidation bonus is 5%, a liquidator who repays $100 of debt receives $105 worth of collateral. This bonus serves two purposes: it compensates liquidators para gas costs y execution risk, y it creates competitive pressure to liquidate positions quickly before other liquidators claim the opportunity. On Solana, where transaccion costs are low, liquidation bonuses tend to be smaller (3-8%) compared to Ethereum (5-15%).\n\nThe close factor limits how much of a position can be liquidated in a single transaccion. A close factor of 50% means a liquidator can repay at most 50% of the outstanding debt in one liquidation call. This prevents a single liquidator from seizing all collateral in one transaccion, giving the borrower a chance to respond. It also distributes liquidation opportunities across multiple liquidators, improving the health of the liquidation market. Some protocols use dynamic close factors — smaller percentages para mildly underwater positions, larger percentages (up to 100%) para deeply underwater positions.\n\nThe liquidation process on Solana follows these steps: (1) a liquidator identifies a position con health factor below 1.0 by scanning obligation cuentas, (2) the liquidator calls the liquidation instruccion specifying which debt to repay y which collateral to seize, (3) the protocol verifies the position is indeed liquidatable, (4) the debt tokens are transferred from the liquidator to the pool, reducing the borrower's debt, (5) the corresponding collateral (plus bonus) is transferred from the borrower's obligation to the liquidator. The entire process is atomic — it either completes fully or reverts.\n\nBad debt occurs when a position's collateral value (including the liquidation bonus) is insufficient to cover the outstanding debt. This happens during extreme market crashes where prices move faster than liquidators can act, or when the collateral asset experiences a sudden loss of liquidity. When bad debt materializes, the protocol must absorb the loss. Common approaches include: drawing from the reserve fund (accumulated from reserve factors), socializing the loss across all suppliers in the pool (reducing the share price), or using a protocol insurance fund or backstop mechanism.\n\nCascading liquidations are a systemic risk. When many positions use the same collateral (e.g., SOL), a price drop triggers liquidations. Liquidators selling the seized collateral on DEXes further depresses the price, triggering more liquidations. This cascade can drain pool liquidity rapidly. Protocols mitigate this through: conservative LTV ratios, higher liquidation thresholds para volatile assets, liquidation rate limits (maximum liquidation volume per time window), y integration con deep liquidity sources.\n\nSolana-specific considerations: liquidation bots on Solana benefit from low latency y low transaccion costs. However, they must compete para transaccion ordering during volatile periods. MEV (Maximal Extractable Value) on Solana through Jito tips allows liquidators to prioritize their transacciones. Protocols must also handle Solana's modelo de cuentas — each obligation cuenta must be refreshed con current oracle prices before liquidation can proceed, adding instrucciones y compute units to the liquidation transaccion.\n\n## Checklist\n- Understand the liquidation bonus incentive structure\n- Know how close factor limits single-transaccion liquidation\n- Track the flow of funds during a liquidation event\n- Identify bad debt scenarios y protocol mitigation strategies\n- Consider cascading liquidation risks in portfolio construction\n\n## Red flags\n- Liquidation bonus too low (liquidators are not incentivized to act quickly)\n- Close factor at 100% (full liquidation in one shot, no borrower recourse)\n- No reserve fund or insurance mechanism para bad debt\n- Ignoring cascading liquidation risks in concentrated collateral pools\n",
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
                      "It rewards borrowers para maintaining healthy positions",
                      "It increases the interest rate para all borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "The liquidation bonus compensates liquidators para gas costs y risk, ensuring positions are liquidated promptly to protect the protocol."
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
            "title": "Oracle risk y stale pricing in lending",
            "content": "# Oracle risk y stale pricing in lending\n\nLending protocols depend entirely on accurate, timely price feeds to compute collateral values, health factors, y liquidation eligibility. Oracles — the services that bring off-chain price data on-chain — are the single most critical external dependency. Oracle failures or manipulation can lead to catastrophic losses: incorrect liquidations of healthy positions, failure to liquidate underwater positions, or exploits that drain protocol reserves.\n\nOn Solana, the two dominant oracle providers are Pyth Network y Switchboard. Pyth provides high-frequency price feeds sourced directly from market makers, exchanges, y trading firms. Pyth publishes price, confidence interval, y exponential moving average (EMA) price para each asset. Switchboard is a more general-purpose oracle network that supports custom data feeds y verification mechanisms. Most Solana lending protocols integrate both y use the more conservative price (lower para collateral, higher para borrows).\n\nStale prices are the most common oracle risk. A price is \"stale\" when it has not been updated within a protocol-defined freshness window — typically 30-120 seconds on Solana. Staleness occurs when: oracle publishers experience downtime, network congestion delays update transacciones, or the asset's market enters a period of extreme volatility where publishers disagree on the price. Lending protocols must reject stale prices y either pause operations or use fallback pricing. Accepting a stale price during a market crash can mean using a price from minutes ago that is significantly higher than reality — blocking necessary liquidations y enabling under-collateralized borrowing.\n\nConfidence intervals quantify price uncertainty. Pyth provides a confidence band around each price — para example, SOL at $25.00 +/- $0.15. A narrow confidence interval indicates strong publisher agreement. A wide confidence interval signals disagreement, low liquidity, or unusual market conditions. Risk-aware protocols use confidence-adjusted prices: para collateral valuation, use (price - confidence) to be conservative; para borrow valuation, use (price + confidence) to cuenta para upside risk. This approach prevents protocols from accepting inflated collateral values during uncertain market conditions.\n\nPrice manipulation attacks target the oracle layer. In a classic oracle manipulation, an attacker temporarily moves the price on a low-liquidity market that the oracle reads from, borrows against the inflated collateral value, y then lets the price revert — leaving the protocol con under-collateralized debt. Mitigations include: using time-weighted average prices (TWAPs) instead of spot prices, requiring multiple independent sources to agree, capping single-block price changes, y implementing borrow/withdrawal delays during high-volatility periods.\n\nSolana-specific oracle considerations: Pyth on Solana uses a pull-based model where price updates are posted to on-chain cuentas that protocols read. Each Pyth price cuenta contains the latest price, confidence, EMA price, publish time, y status (Trading, Halted, Unknown). Protocols should check the status field — a \"Halted\" or \"Unknown\" status indicates the feed is unreliable. The publishTime must be compared against the current slot time to detect staleness. Switchboard cuentas have similar freshness y confidence metadata.\n\nMulti-oracle strategies improve resilience. A protocol might use Pyth as the primary oracle y Switchboard as a fallback. If Pyth's price is stale or has low confidence, the protocol switches to Switchboard. If both are unavailable, the protocol pauses new borrows y liquidations rather than operating on unknown prices. This layered approach prevents single points of failure in the oracle infrastructure.\n\nCircuit breakers add an additional safety layer. If an oracle reports a price change exceeding a threshold (e.g., >20% in one update), the protocol should flag this as potentially suspicious y either verify against a secondary source or temporarily pause operations. Flash crashes y recovery events can produce legitimate large price movements, but the protocol should err on the side of caution.\n\n## Checklist\n- Verify oracle freshness (publishTime within acceptable window)\n- Use confidence intervals para conservative pricing\n- Implement multi-oracle fallback strategies\n- Check oracle status fields (Trading, Halted, Unknown)\n- Set circuit breakers para extreme price movements\n\n## Red flags\n- Single oracle dependency con no fallback\n- No staleness checks on price data\n- Ignoring confidence intervals para collateral valuation\n- Using spot prices without TWAP or time-weighting\n- No circuit breakers para extreme price changes\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l7-q1",
                    "prompt": "Why should lending protocols use confidence-adjusted prices para collateral?",
                    "options": [
                      "To be conservative — using (price - confidence) prevents over-valuing collateral during uncertainty",
                      "Confidence intervals make prices more accurate",
                      "It increases the collateral value para borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "Using price minus confidence para collateral gives a conservative valuation, protecting the protocol when oracle publishers disagree or markets are volatile."
                  },
                  {
                    "id": "lending-v2-l7-q2",
                    "prompt": "What should a protocol do when all oracle feeds are stale?",
                    "options": [
                      "Pause new borrows y liquidations until fresh prices are available",
                      "Use the last known price regardless of age",
                      "Estimate the price from on-chain DEX data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Operating on stale prices is dangerous. Pausing operations prevents incorrect liquidations y under-collateralized borrows during oracle outages."
                  }
                ]
              }
            ]
          },
          "lending-v2-risk-report": {
            "title": "Checkpoint: Generate a multi-scenario risk report",
            "content": "# Checkpoint: Generate a multi-scenario risk report\n\nBuild the final risk report that combines all curso concepts:\n\n- Evaluate a base case using current position prices\n- Apply price overrides from multiple named scenarios (bull, crash, etc.)\n- Compute collateral value, borrow value, y health factor per scenario\n- Identify which scenarios trigger liquidation (health factor < 1.0)\n- Track the worst health factor across all scenarios\n- Count total liquidation scenarios\n- Output must be stable JSON con deterministic key ordering\n\nThis checkpoint validates your complete understanding of lending risk analysis.",
            "duration": "55 min",
            "hints": [
              "Create a reusable evalScenario function that takes price overrides y computes health factor.",
              "Para the base case, use the original position prices (empty overrides).",
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
    "description": "Master perps risk engineering on Solana: precise PnL/funding accounting, margin safety monitoring, liquidation simulation, y deterministic console reporting.",
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
        "description": "Perpetual futures mechanics, funding accrual logic, y PnL modeling foundations para accurate position diagnostics.",
        "lessons": {
          "perps-v2-mental-model": {
            "title": "Perpetual futures: base positions, entry price, y mark vs oracle",
            "content": "# Perpetual futures: base positions, entry price, y mark vs oracle\n\nPerpetual futures (perps) are synthetic derivatives that let traders gain exposure to an asset's price movement without holding the underlying token. Unlike traditional futures con expiry dates, perpetual contracts never settle. Instead, a funding rate mechanism keeps the contract price anchored to the spot price over time. Understanding how positions are represented, how entry prices work, y the distinction between mark y oracle prices is the foundation of every risk calculation that follows.\n\n## Position anatomy\n\nA perpetual futures position is defined by four core fields: side (long or short), size (the quantity of the base asset), entry price (the average cost basis), y margin (the collateral deposited). When you open a long position of 10 SOL-PERP at $22.50 con $225 margin, you are expressing a bet that SOL's price will rise. The notional value of this position is size multiplied by the current mark price. Notional value changes continuously as the mark price moves, even though your entry price remains fixed until you modify the position.\n\nEntry price is not simply the price at the moment you clicked \"buy.\" If you add to an existing position, the entry price updates to the weighted average of the old y new fills. Para example, if you hold 5 SOL-PERP at $20 y buy 5 more at $25, your new entry price becomes (5 * 20 + 5 * 25) / 10 = $22.50. Partial closes do not change the entry price — only additions do. Tracking entry price accurately is critical because every PnL calculation derives from the difference between entry y current price.\n\n## Mark price vs oracle price\n\nOn-chain perpetual protocols maintain two distinct prices: the mark price y the oracle price. The oracle price reflects the broader market's view of the asset's spot value. Solana protocols commonly use Pyth or Switchboard oracle feeds, which aggregate price data from multiple exchanges y publish updates on-chain every 400 milliseconds. The oracle price is the \"truth\" — the real-world value of the underlying asset.\n\nThe mark price is the protocol's internal valuation of the perpetual contract. It is typically derived from the oracle price plus a premium or discount that reflects supply y demand imbalance in the perp market itself. When there are more longs than shorts, the mark price trades above the oracle (positive premium). When shorts dominate, the mark trades below (negative premium). The formula varies by protocol but often follows: markPrice = oraclePrice + exponentialMovingAverage(premium).\n\nMark price is used para all PnL calculations y liquidation triggers. Using mark price instead of raw trade price prevents manipulation attacks where a single large trade could spike the last-traded price y trigger mass liquidations. The mark price moves more smoothly because it incorporates the oracle as a stability anchor.\n\n## Why this matters para risk\n\nEvery risk metric in a perps risk console depends on getting these fundamentals right. Unrealized PnL is computed against the mark price. Margin ratio is computed using notional value at mark price. Liquidation price is derived from the entry price y margin. If you confuse mark y oracle, or miscalculate entry price after position averaging, every downstream number is wrong.\n\nOn Solana specifically, oracle latency introduces an additional consideration. Pyth oracle updates propagate con slot-level granularity (~400ms). During volatile periods, the oracle price can lag behind actual market moves by several hundred milliseconds. Protocols handle this by including confidence intervals in their oracle reads y rejecting prices con excessively wide confidence bands. When building risk dashboards, always display the oracle confidence alongside the price y flag stale oracles (timestamps older than a few seconds).\n\n## Console diseno principle\n\nA useful risk console must separate:\n1. directional rendimiento (PnL),\n2. structural cost (funding + fees),\n3. survival risk (margin ratio + liquidation distance).\n\nBlending these into one number hides the decision signals traders actually need.\n\n## Checklist\n- Understand that perpetual futures never expire y use funding to track spot\n- Track entry price as a weighted average across all fills\n- Distinguish mark price (PnL, liquidation) from oracle price (funding, reference)\n- Monitor oracle staleness y confidence intervals\n- Compute notional value as size * markPrice\n\n## Red flags\n- Using last-traded price instead of mark price para PnL\n- Forgetting to update entry price on position additions\n- Ignoring oracle confidence intervals during volatile markets\n- Assuming mark price equals oracle price (the premium matters)\n",
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
                    "prompt": "If you hold 8 SOL-PERP at $20 y buy 2 more at $30, what is your new entry price?",
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
            "title": "Funding rates: why they exist y how they accrue",
            "content": "# Funding rates: why they exist y how they accrue\n\nFunding rates are the mechanism that tethers a perpetual contract's price to the underlying spot price. Without funding, the perp price could drift arbitrarily far from reality because the contract never expires. Funding creates a periodic cash flow between longs y shorts that incentivizes convergence: when the perp trades above spot, longs pay shorts; when it trades below, shorts pay longs.\n\n## The convergence mechanism\n\nConsider a scenario where heavy demand from leveraged long traders pushes the SOL-PERP mark price to $23 while the SOL oracle price is $22. The premium is $1, or about 4.5%. The funding rate will be positive, meaning long holders pay short holders every funding interval. This payment makes it expensive to hold longs y attractive to hold shorts, which naturally pushes the perp price back toward spot. When the perp trades below spot (negative premium), funding flips: shorts pay longs, discouraging shorts y encouraging longs.\n\nThe funding rate is typically calculated as: fundingRate = clamp(premium / 24, -maxRate, +maxRate), where the premium is the percentage difference between mark y oracle prices, divided by 24 to normalize to an hourly rate. Most protocols on Solana settle funding every hour, though some use shorter intervals (every 8 hours is common on centralized exchanges). The clamp function prevents extreme rates during flash crashes or squeezes.\n\n## How funding accrues\n\nFunding is not a continuous stream — it settles at discrete intervals. At each funding timestamp, the protocol snapshots every open position y calculates: fundingPayment = positionSize * entryPrice * fundingRate. Para a 10 SOL-PERP position at $25 entry con a funding rate of 0.01% (0.0001), the payment is 10 * 25 * 0.0001 = $0.025 per interval.\n\nThe direction of payment depends on the position side y the sign of the funding rate. When the funding rate is positive: longs pay (their margin decreases) y shorts receive (their margin increases). When negative: shorts pay y longs receive. This is a zero-sum transfer — the total paid by one side exactly equals the total received by the other side, minus any protocol fees.\n\nCumulative funding matters more than any single payment. A position held para 24 hours accumulates 24 hourly funding payments (or 3 eight-hour payments, depending on the protocol). During trending markets, cumulative funding can become a significant drag on PnL. A long position in a strongly bullish market might show +$100 unrealized PnL but have paid -$15 in cumulative funding, reducing the real return. Risk dashboards must display both unrealized PnL y cumulative funding separately so traders see the full picture.\n\n## Funding on Solana protocols\n\nSolana perps protocols like Drift, Mango Markets, y Jupiter Perps each implement funding slightly differently. Drift uses a time-weighted average premium over 1-hour windows. Jupiter Perps uses a simpler hourly mark-to-oracle premium. Mango uses an oracle-based funding model con configurable parameters per market. Despite these differences, the core principle is identical: positive premium means longs pay shorts.\n\nOn-chain funding settlement on Solana happens through cranked instrucciones. A keeper bot calls a \"settle funding\" instruccion at each interval, which iterates through positions y adjusts their realized PnL cuentas. Positions that are not explicitly settled may accumulate pending funding payments that are only applied when the position is next touched (opened, closed, or cranked). This lazy evaluation means your displayed margin may not reflect unsettled funding until you interact con the position.\n\n## Impact on risk monitoring\n\nPara risk console purposes, you must track: (1) the current funding rate y whether your position is paying or receiving, (2) cumulative funding paid or received since position open, (3) the net margin impact as a percentage of initial margin, y (4) projected funding cost if the current rate persists. A position that looks profitable on a PnL basis might be marginally unprofitable after accounting para funding drag. Always include funding in your total return calculations.\n\n## Checklist\n- Understand that positive funding rate means longs pay shorts\n- Calculate funding payment as size * price * rate per interval\n- Track cumulative funding over the position's lifetime\n- Cuenta para funding when computing real return (PnL + funding)\n- Monitor para extreme funding rates that signal market imbalance\n\n## Red flags\n- Ignoring funding costs in PnL reporting\n- Confusing funding direction (positive rate = longs pay)\n- Not accounting para lazy settlement on Solana protocols\n- Assuming funding is continuous rather than discrete-interval\n",
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
                      "Shorts pay longs — shorts are rewarded para being correct",
                      "Both sides pay the protocol a fee"
                    ],
                    "answerIndex": 0,
                    "explanation": "A positive premium (mark > oracle) produces a positive funding rate. Longs pay shorts, which discourages excessive long demand y pushes the perp price back toward spot."
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
            "content": "# PnL visualization: tracking profit over time\n\nProfit y loss (PnL) tracking in perpetual futures requires careful accounting across multiple dimensions: unrealized PnL from price movement, realized PnL from closed portions, funding payments, y trading fees. A well-built PnL visualization shows traders not just where they stand now, but how they arrived there — which is essential para risk management y strategy refinement.\n\n## Unrealized vs realized PnL\n\nUnrealized PnL represents the paper profit or loss on your open position. Para a long position: unrealizedPnL = size * (markPrice - entryPrice). Para a short: unrealizedPnL = size * (entryPrice - markPrice). This number changes con every price tick y represents what you would gain or lose if you closed the position right now at the mark price.\n\nRealized PnL is locked in when you close all or part of a position. If you opened 10 SOL-PERP long at $20 y close 5 contracts at $25, you realize 5 * (25 - 20) = $25 profit. The remaining 5 contracts continue to have unrealized PnL based on the current mark price versus your (unchanged) entry of $20. Realized PnL is permanent — it has already been credited to your margin cuenta. Unrealized PnL fluctuates y may increase or decrease.\n\nTotal PnL = realized + unrealized + cumulative funding. This is the true measure of position rendimiento. Displaying all three components separately gives traders insight into whether their profits come from directional moves (unrealized), successful trades (realized), or favorable funding conditions.\n\n## Return on equity (ROE)\n\nROE measures the percentage return relative to the initial margin deposited. ROE = (unrealizedPnL / initialMargin) * 100. A position con $25 unrealized PnL on $225 margin has an ROE of 11.11%. Because perpetual futures are leveraged instruments, ROE can be dramatically higher (or lower) than the percentage price change. Con 10x leverage, a 5% price move produces approximately 50% ROE.\n\nROE is the primary rendimiento metric para comparing positions across different sizes y leverage levels. A $10 profit on $100 margin (10% ROE) represents better capital efficiency than $10 profit on $1000 margin (1% ROE), even though the dollar PnL is identical. Risk consoles should display ROE prominently alongside raw PnL.\n\n## Time-series visualization\n\nPlotting PnL over time reveals patterns invisible in a single snapshot. Key elements of a PnL time series: (1) The unrealized PnL curve, moving con each mark price update. (2) Step changes when partial closes realize PnL. (3) Small periodic steps from funding payments. (4) The cumulative total line combining all components.\n\nPara Solana protocols, PnL snapshots can be captured at each slot (~400ms) or aggregated into minute/hour candles para longer timeframes. Real-time WebSocket feeds from RPC nodes provide mark price updates, y funding payments appear as on-chain events at each settlement interval. A production risk console typically polls mark prices every 1-5 seconds y updates the PnL display accordingly.\n\n## Break-even analysis\n\nThe break-even price cuentas para all costs: trading fees, funding payments, y slippage. Para a long position: breakEvenPrice = entryPrice + (totalFees + cumulativeFundingPaid) / size. If you entered at $22.50 con $0.50 in total costs on a 10-unit position, your break-even is $22.55. Displaying the break-even line on the PnL chart gives traders a clear target — the position is only truly profitable when the mark price exceeds this line.\n\n## Visualization mejores practicas\n\nEffective PnL dashboards use color coding consistently: green para positive PnL, red para negative. The zero line should be visually prominent. Hover tooltips should show the exact PnL at any point in time. Consider showing both absolute dollar PnL y percentage ROE on dual axes. Include funding annotations as small markers on the time axis so traders can see when funding events impacted their PnL curve.\n\n## Checklist\n- Separate unrealized, realized, y funding components in the display\n- Calculate ROE relative to initial margin, not current margin\n- Include break-even price accounting para all costs\n- Update PnL in near-real-time using mark price feeds\n- Annotate funding events on the PnL time series\n\n## Red flags\n- Showing only unrealized PnL without funding impact\n- Computing ROE against notional value instead of margin\n- Not distinguishing realized from unrealized PnL\n- Updating PnL using oracle price instead of mark price\n",
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
            "content": "# Challenge: Calculate perpetual futures PnL\n\nImplement a PnL calculator para perpetual futures positions:\n\n- Compute unrealized PnL based on entry price vs mark price\n- Handle both long y short positions correctly\n- Calculate notional value as size * markPrice\n- Compute ROE (return on equity) as a percentage of initial margin\n- Format all outputs con appropriate decimal precision\n\nYour calculator must be deterministic — same input always produces the same output.",
            "duration": "50 min",
            "hints": [
              "Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice).",
              "Notional value = size * markPrice — represents the total position value.",
              "ROE (return on equity) = unrealizedPnL / margin * 100.",
              "Use toFixed(2) para prices y PnL, toFixed(4) para size y ROE."
            ]
          },
          "perps-v2-funding-accrual": {
            "title": "Challenge: Simulate funding rate accrual",
            "content": "# Challenge: Simulate funding rate accrual\n\nBuild a funding accrual simulator that processes discrete funding intervals:\n\n- Iterate through an array of funding rates y compute the payment para each period\n- Longs pay (subtract from balance) when the funding rate is positive\n- Shorts receive (add to balance) when the funding rate is positive\n- Track cumulative funding, average rate, y net margin impact\n- Handle negative funding rates where the direction reverses\n\nThe simulator must be deterministic — same inputs always produce the same result.",
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
        "description": "Margin y liquidation monitoring, implementation bug traps, y deterministic risk-console outputs para production observability.",
        "lessons": {
          "perps-v2-margin-liquidation": {
            "title": "Margin ratio y liquidation thresholds",
            "content": "# Margin ratio y liquidation thresholds\n\nMargin is the collateral that backs a leveraged position. When the margin falls below a critical threshold relative to the position's notional value, the protocol forcibly closes the position to prevent the trader from owing more than they deposited. Understanding margin mechanics, the maintenance margin threshold, y how liquidation prices are calculated is essential para risk monitoring.\n\n## Initial margin y leverage\n\nInitial margin is the collateral deposited when opening a position. The leverage multiple is: leverage = notionalValue / initialMargin. A position con $250 notional value y $25 margin is 10x leveraged. Higher leverage amplifies both gains y losses. At 10x, a 10% adverse price move wipes out 100% of the margin. At 20x, only a 5% move is needed to reach zero.\n\nSolana perps protocols typically allow leverage up to 20x or even 50x on major pairs (SOL, BTC, ETH) y lower leverage (5x-10x) on altcoins con thinner liquidity. The maximum leverage is governed by the maintenance margin rate — a lower maintenance margin rate allows higher maximum leverage.\n\n## Maintenance margin\n\nThe maintenance margin rate (MMR) is the minimum margin ratio a position must maintain to avoid liquidation. If the MMR is 5% (0.05), the effective margin must be at least 5% of the notional value at all times. Effective margin cuentas para unrealized PnL y funding: effectiveMargin = initialMargin + unrealizedPnL + cumulativeFunding. The margin ratio is: marginRatio = effectiveMargin / notionalValue.\n\nWhen the margin ratio drops below the MMR, the position is eligible para liquidation. Protocols don't wait para the margin to reach exactly zero — the maintenance buffer ensures there is still some collateral left to cover liquidation fees, slippage, y potential bad debt. If a position's losses exceed its margin entirely, the deficit becomes \"bad debt\" that must be absorbed by an insurance fund or socialized across other traders.\n\n## Liquidation price calculation\n\nThe liquidation price is the mark price at which the margin ratio exactly equals the maintenance margin rate. Para a long position: liquidationPrice = entryPrice - (margin + cumulativeFunding - notional * MMR) / size. Para a short: liquidationPrice = entryPrice + (margin + cumulativeFunding - notional * MMR) / size.\n\nThis formula cuentas para the fact that as the mark price moves against you, both the unrealized PnL (reducing effective margin) y the notional value (the denominator of margin ratio) change simultaneously. The liquidation price is not simply \"entry price minus margin per unit\" — the maintenance margin requirement means liquidation triggers before your margin is fully depleted.\n\nPara example, consider a 10 SOL-PERP long at $22.50 con $225 margin y 5% MMR. The notional at entry is 10 * 22.50 = $225. Liquidation triggers when effectiveMargin / notional = 0.05, which solves to a mark price near $2.05 in this well-margined case. Con higher leverage (less margin), the liquidation price would be much closer to entry.\n\n## Cascading liquidations\n\nDuring sharp market moves, many positions hit their liquidation prices simultaneously. Liquidation engines close these positions by selling into the order book (or AMM pools), which pushes the price further in the adverse direction, triggering more liquidations. This cascade effect — also called a \"liquidation spiral\" — can cause prices to move far beyond what fundamentals justify.\n\nOn Solana, liquidation is performed by keeper bots that submit liquidation transacciones. These bots compete para liquidation opportunities because protocols offer a liquidation fee (typically 0.5-2% of the position's notional) as an incentive. During cascades, keeper bots may face congestion issues as many liquidation transacciones compete para block space. Partial liquidation — closing only enough of a position to restore the margin ratio above MMR — helps reduce cascade severity by keeping some of the position alive.\n\n## Risk monitoring thresholds\n\nA production risk console should alert at multiple thresholds: (1) WARNING when the margin ratio drops below 1.5x the MMR (e.g., 7.5% when MMR is 5%), (2) CRITICAL when below the MMR itself (liquidation imminent), y (3) INFO when unrealized PnL exceeds a significant percentage of margin (positive or negative). These alerts give traders time to add margin, reduce position size, or close entirely before forced liquidation.\n\n## Checklist\n- Calculate effective margin including unrealized PnL y funding\n- Compute margin ratio as effectiveMargin / notionalValue\n- Derive liquidation price from entry price, margin, y MMR\n- Set warning thresholds above the MMR to give early alerts\n- Cuenta para liquidation fees in worst-case scenarios\n\n## Red flags\n- Computing liquidation price without accounting para the maintenance buffer\n- Ignoring funding in effective margin calculations\n- Not alerting traders before they reach the liquidation threshold\n- Assuming the mark price at liquidation equals the execution price (slippage exists)\n",
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
                      "To ensure remaining collateral covers liquidation fees y slippage, preventing bad debt",
                      "To make it harder para traders to open positions",
                      "To generate more revenue para the protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "The maintenance buffer ensures that when a position is liquidated, there is still margin left to pay liquidation fees y absorb slippage during the close. Without it, positions could go underwater, creating bad debt."
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
            "title": "Common bugs: sign errors, units, y funding direction",
            "content": "# Common bugs: sign errors, units, y funding direction\n\nPerpetual futures implementations are mathematically straightforward — the formulas are basic arithmetic. Yet sign errors, unit mismatches, y funding direction bugs are among the most frequent y costly mistakes in DeFi development. A single flipped sign can turn profits into losses, liquidate healthy positions, or drain insurance funds. This leccion catalogs the most common pitfalls y how to avoid them.\n\n## Sign errors in PnL calculations\n\nThe most fundamental bug: getting the sign wrong on PnL para short positions. Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice). Note that short PnL is NOT size * (markPrice - entryPrice) con a negated size. The size is always positive — it represents the quantity of contracts. The direction is captured in the formula itself. A common mistake is storing size as negative para shorts y using a single formula: pnl = size * (markPrice - entryPrice). While mathematically equivalent when size is negative, this representation causes bugs everywhere else: notional value calculations, funding payments, margin ratios, y liquidation prices all need absolute size.\n\nRule: Keep size always positive. Branch on the side field to select the correct formula. Never rely on sign conventions embedded in other fields.\n\n## Unit y decimal mismatches\n\nSolana token amounts are raw integers (lamports, token base units). Prices from oracles are typically fixed-point numbers con specific exponents. Mixing these without proper conversion produces catastrophically wrong values.\n\nExample: SOL has 9 decimals on-chain. If a position size is stored as 10_000_000_000 (10 SOL in lamports) y you multiply by a price of 22.50 (a floating-point dollar value), you get 225,000,000,000 — which might look like a notional value, but it is in lamports-times-dollars, a nonsensical unit. You must either convert size to human-readable units first (divide by 10^9), or keep everything in integer space con a consistent exponent.\n\nRule: Define a canonical unit convention at the start of your project. Either work entirely in human-readable floats (acceptable para display/simulation code) or entirely in integer base units con explicit scaling factors (required para on-chain code). Never mix the two.\n\n## Funding direction confusion\n\nThe funding direction rule is: \"positive funding rate means longs pay shorts.\" This is universal across all major protocols. Yet developers frequently implement it backwards, especially when reasoning about \"who benefits.\" When the rate is positive, the market is bullish (more longs than shorts). Longs pay to discourage the imbalance. Shorts receive as compensation para providing the other side.\n\nIn code, the mistake looks like this:\n- WRONG: if (side === \"long\") totalFunding += payment;\n- RIGHT: if (side === \"long\") totalFunding -= payment;\n\nWhen the funding rate is positive y the side is long, the payment reduces the trader's balance. When negative y long, the payment increases the balance (longs receive). Test every combination: positive rate + long, positive rate + short, negative rate + long, negative rate + short.\n\n## Liquidation price off-by-one\n\nThe liquidation price formula must cuenta para the maintenance margin requirement. A common bug is computing the price at which margin equals zero rather than the price at which margin equals the maintenance requirement. This results in a liquidation price that is too aggressive — the position would be liquidated later than expected, potentially accumulating bad debt.\n\nAnother variant: forgetting to include cumulative funding in the liquidation price calculation. If a long position has paid $5 in funding, its effective margin is $5 less than the initial deposit, y the liquidation price is correspondingly closer to the entry price.\n\n## Margin ratio denominator\n\nMargin ratio = effectiveMargin / notionalValue. The notional value must use the current mark price, not the entry price. Using entry price para notional gives an incorrect ratio because the actual exposure changes as the mark price moves. A position con $225 entry notional that has moved to $250 mark notional has a lower margin ratio than the entry-price calculation suggests — the position has grown while the margin remains fixed.\n\n## Integer overflow in funding accumulation\n\nWhen accumulating funding over hundreds or thousands of periods, floating-point precision errors can compound. Each period adds a small number (e.g., 0.025), y after thousands of additions, the accumulated error can become material. Using fixed-point arithmetic or rounding at each step (con a consistent rounding convention) prevents drift. In JavaScript, toFixed() at the final output step is sufficient para display, but intermedio calculations should preserve full precision.\n\n## Pruebas strategy\n\nEvery perps calculation should have test cases covering: (1) Long con profit, (2) Long con loss, (3) Short con profit, (4) Short con loss, (5) Positive funding rate para both sides, (6) Negative funding rate para both sides, (7) Zero funding rate, (8) Zero-margin edge case. If any single combination is missing from your test suite, the corresponding bug can ship undetected.\n\n## Checklist\n- Use separate formulas para long y short PnL, not sign-encoded size\n- Define y enforce a canonical unit convention (human-readable vs base units)\n- Test all four combinations of funding direction (2 sides x 2 rate signs)\n- Include maintenance margin in liquidation price calculations\n- Use mark price (not entry price) para notional value in margin ratio\n\n## Red flags\n- Negative position sizes used to encode short direction\n- Mixing lamport-scale y dollar-scale values in the same calculation\n- Funding payment that adds to long balances when the rate is positive\n- Liquidation price computed at zero margin instead of maintenance margin\n- Margin ratio using entry-price notional instead of mark-price notional\n",
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
                      "Negative size creates sign-convention bugs in notional, funding, margin, y liquidation calculations",
                      "Solana cuentas cannot store negative numbers",
                      "Positive numbers use less storage space"
                    ],
                    "answerIndex": 0,
                    "explanation": "When size carries the direction sign, every formula that uses size must cuenta para the sign — not just PnL, but also notional value, funding payments, y liquidation price. Keeping size positive y branching on a separate 'side' field is safer y more explicit."
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
            "content": "# Checkpoint: Generate a Risk Console Report\n\nBuild the comprehensive risk console report that integrates all curso concepts:\n\n- Calculate unrealized PnL y ROE para the position\n- Accumulate funding payments across all provided funding rate intervals\n- Compute effective margin (initial + PnL + funding) y margin ratio\n- Derive the liquidation price accounting para maintenance margin y funding\n- Generate severity-tiered alerts (CRITICAL, WARNING, INFO) based on thresholds\n- Output must be stable JSON con deterministic structure\n\nThis checkpoint validates your complete understanding of perpetual futures risk management.",
            "duration": "55 min",
            "hints": [
              "Effective margin = initial margin + unrealized PnL + funding payments.",
              "Margin ratio = effectiveMargin / notionalValue.",
              "Liquidation price para longs: entryPrice - (margin + funding - notional*mmRate) / size.",
              "Generate alerts based on margin ratio vs maintenance margin rate thresholds.",
              "Sort alerts by severity: CRITICAL > WARNING > INFO."
            ]
          }
        }
      }
    }
  },
  "defi-tx-optimizer": {
    "title": "DeFi Transaccion Optimizer",
    "description": "Master Solana DeFi transaccion optimization: compute/fee tuning, ALT strategy, reliability patterns, y deterministic send-strategy planning.",
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
        "title": "Transaccion Fundamentals",
        "description": "Transaccion failure diagnosis, compute budget mechanics, priority-fee strategy, y fee estimation foundations.",
        "lessons": {
          "txopt-v2-why-fail": {
            "title": "Why DeFi transacciones fail: CU limits, size, y blockhash expiry",
            "content": "# Why DeFi transacciones fail: CU limits, size, y blockhash expiry\n\nDeFi transacciones on Solana fail para three primary reasons: compute budget exhaustion, transaccion size overflow, y blockhash expiry. Understanding each failure mode is essential before attempting any optimization, because the fix para each is fundamentally different. Misdiagnosing the failure category leads to wasted effort y frustrated users.\n\n## Compute budget exhaustion\n\nEvery Solana transaccion executes within a compute budget measured in compute units (CUs). The default budget is 200,000 CUs per transaccion, which is sufficient para simple transfers but far too low para complex DeFi operations. A single AMM swap through a concentrated liquidity pool can consume 100,000-200,000 CUs. Multi-hop routes, flash loans, or transacciones that interact con multiple protocols easily exceed 400,000 CUs. When a transaccion exceeds its compute budget, the runtime aborts execution y returns a `ComputeBudgetExceeded` error. The transaccion fee is still charged because the validador performed work before the limit was hit.\n\nThe solution is the `SetComputeUnitLimit` instruccion from the Compute Budget Program. This instruccion must be the first instruccion in the transaccion (by convention) y tells the runtime exactly how many CUs to allocate. Setting the limit too low causes failures; setting it too high wastes priority fee budget because priority fees are calculated per CU requested (not consumed). The optimal approach is to simulate the transaccion first, observe the actual CU consumption, add a 10% safety margin, y use that as the limit.\n\n## Transaccion size limits\n\nSolana transacciones have a hard size limit of 1,232 bytes when serialized. This limit applies to the entire transaccion packet including signatures, message header, cuenta keys, recent blockhash, y instruccion data. Each cuenta key consumes 32 bytes. A transaccion referencing 30 unique cuentas uses 960 bytes para cuenta keys alone, leaving very little room para instruccion data y signatures.\n\nDeFi transacciones are particularly cuenta-heavy. A single Raydium CLMM swap requires the user cartera, input token cuenta, output token cuenta, pool state, AMM config, observation state, token vaults (x2), tick arrays (up to 3), oracle, y program IDs. Chaining multiple swaps in a single transaccion can easily push the cuenta count past 40, which exceeds the 1,232-byte limit con standard cuenta encoding. This is where Address Lookup Tables (ALTs) become essential, compressing each cuenta reference from 32 bytes to just 1 byte para cuentas stored in the lookup table.\n\n## Blockhash expiry\n\nEvery Solana transaccion includes a recent blockhash that serves as a replay protection mechanism y a timestamp. A blockhash is valid para approximately 60 seconds (roughly 150 slots at 400ms per slot). If a transaccion is not included in a block before the blockhash expires, it becomes permanently invalid y can never be processed. The transaccion simply disappears without any on-chain error record.\n\nBlockhash expiry is the most insidious failure mode because it produces no error message. The transaccion is silently dropped. This happens frequently during network congestion when transacciones queue para longer than expected, or when users take too long to review y approve a transaccion in their cartera. The correct handling is to monitor para confirmation con a timeout, y if the transaccion is not confirmed within 30 seconds, fetch a new blockhash, rebuild y re-sign the transaccion, y resubmit.\n\n## Interaction between failure modes\n\nThese three failure modes often interact. A developer might add more instrucciones to avoid multiple transacciones (reducing blockhash expiry risk), but this increases both CU consumption y transaccion size. Optimizing para one dimension can worsen another. The art of transaccion optimization is finding the right balance: enough CU budget to complete execution, compact enough to fit in 1,232 bytes, y fast enough submission to land before the blockhash expires.\n\n## Production triage rule\n\nDiagnose transaccion failures in strict order:\n1. did it fit y simulate,\n2. did it propagate y include,\n3. did it confirm before expiry.\n\nThis sequence prevents noisy fixes y reduces false assumptions during incidents.\n\n## Diagnostic checklist\n- Check transaccion logs para `ComputeBudgetExceeded` when CU is the issue\n- Check serialized transaccion size against the 1,232-byte limit\n- Monitor confirmation status to detect silent blockhash expiry\n- Simulate transacciones before sending to catch CU y cuenta issues early\n- Track failure rates by category to identify systemic problems\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l1-q1",
                    "prompt": "What is the default compute unit budget para a Solana transaccion?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "50,000 CUs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana allocates 200,000 CUs by default. DeFi transacciones almost always need more, requiring an explicit SetComputeUnitLimit instruccion."
                  },
                  {
                    "id": "txopt-v2-l1-q2",
                    "prompt": "What happens when a transaccion's blockhash expires before it is confirmed?",
                    "options": [
                      "The transaccion is silently dropped con no on-chain error",
                      "The transaccion fails con a BlockhashExpired error on-chain",
                      "The validador retries con a fresh blockhash automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired blockhash transacciones are never processed y produce no on-chain record. The client must detect the timeout y resubmit con a fresh blockhash."
                  }
                ]
              }
            ]
          },
          "txopt-v2-compute-budget": {
            "title": "Compute budget instrucciones y priority fee strategy",
            "content": "# Compute budget instrucciones y priority fee strategy\n\nThe Compute Budget Program provides two critical instrucciones that every serious DeFi transaccion should include: `SetComputeUnitLimit` y `SetComputeUnitPrice`. Together, they control how much computation your transaccion can perform y how much you are willing to pay para priority inclusion in a block.\n\n## SetComputeUnitLimit\n\nThis instruccion sets the maximum number of compute units the transaccion can consume. The value must be between 1 y 1,400,000 (the per-transaccion maximum on Solana). The instruccion takes a single u32 parameter representing the CU limit. When omitted, the runtime uses the default of 200,000 CUs.\n\nChoosing the right limit requires profiling. Use `simulateTransaction` on an RPC node to execute the transaccion without landing it on-chain. The simulation response includes `unitsConsumed`, which tells you exactly how many CUs the transaccion used. Add a 10% safety margin to this value: `Math.ceil(unitsConsumed * 1.1)`. This margin cuentas para minor variations in CU consumption between simulation y actual execution (e.g., different slot, slightly different cuenta state).\n\nSetting the limit exactly to the simulated value is risky because CU consumption can vary slightly between simulation y execution. Setting it 2x or 3x higher is wasteful because your priority fee is calculated against the requested limit, not the consumed amount. The 10% margin provides a good balance between safety y cost efficiency.\n\n## SetComputeUnitPrice\n\nThis instruccion sets the priority fee in micro-lamports per compute unit. A micro-lamport is one millionth of a lamport (1 lamport = 0.000000001 SOL). The priority fee is calculated as: `priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1,000,000)` lamports.\n\nPara example, con a CU limit of 200,000 y a CU price of 5,000 micro-lamports: `ceil(200,000 * 5,000 / 1,000,000) = ceil(1,000) = 1,000 lamports`. This is added on top of the base fee of 5,000 lamports per signature (typically one signature para user transacciones).\n\n## Priority fee market dynamics\n\nSolana validadores order transacciones within a block by priority fee (micro-lamports per CU). During low-congestion periods, even a CU price of 1 micro-lamport is sufficient. During high-demand events (popular NFT mints, volatile market moments, new token launches), competitive CU prices can reach 100,000+ micro-lamports.\n\nThe priority fee market is highly dynamic. Strategies para choosing the right price include: (1) Static pricing: set a fixed CU price based on the expected congestion level. Simple but often suboptimal. (2) Recent-fee sampling: query `getRecentPrioritizationFees` from the RPC to see what fees landed in recent blocks. Use the median or 75th percentile as your price. (3) Percentile targeting: decide what probability of inclusion you want (e.g., 90% chance of landing in the next block) y price accordingly.\n\n## Fee calculation formula\n\nThe total transaccion fee follows this formula:\n\n```\nbaseFee = 5000 lamports (per signature)\npriorityFee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) lamports\ntotalFee = baseFee + priorityFee\n```\n\nWhen building a transaccion planner, these calculations must use integer arithmetic to match on-chain behavior. Floating-point rounding differences can cause fee estimate mismatches that confuse users.\n\n## Instruccion ordering\n\nCompute budget instrucciones must appear before any other instrucciones in the transaccion. The runtime processes them during transaccion validation, before executing program instrucciones. Placing them after other instrucciones is technically allowed but violates convention y may cause issues con some tools y carteras.\n\n## Practico recommendations\n- Always include both SetComputeUnitLimit y SetComputeUnitPrice\n- Simulate first, then set CU limit to ceil(consumed * 1.1)\n- Sample recent fees y use the 75th percentile para reliable inclusion\n- Display the total fee estimate to users before they sign\n- Cap the CU limit at 1,400,000 (Solana maximum per transaccion)\n",
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
                      "CU consumption can vary slightly between simulation y execution due to state changes",
                      "The runtime does not accept exact values",
                      "Simulation always underreports CU usage by 50%"
                    ],
                    "answerIndex": 0,
                    "explanation": "Cuenta state may change between simulation y execution, causing minor CU variations. A 10% margin absorbs these differences."
                  }
                ]
              }
            ]
          },
          "txopt-v2-cost-explorer": {
            "title": "Transaccion cost estimation y fee planning",
            "content": "# Transaccion cost estimation y fee planning\n\nAccurate fee estimation is the foundation of a good DeFi user experience. Users need to know what a transaccion will cost before they sign it. Validadores need sufficient fees to prioritize your transaccion. Getting fee estimation right means understanding the components, profiling real transacciones, y adapting to market conditions.\n\n## Components of transaccion cost\n\nA Solana transaccion's cost has three components: (1) the base fee, which is 5,000 lamports per signature y is fixed by protocol; (2) the priority fee, which is variable y determined by the compute unit price you set; y (3) the rent cost para any new cuentas created by the transaccion (e.g., creating an Associated Token Cuenta costs approximately 2,039,280 lamports in rent-exempt minimum balance).\n\nPara DeFi transacciones that do not create new cuentas, the cost is simply base fee plus priority fee. Para transacciones that create ATAs or other cuentas, the rent deposits significantly increase the total cost y should be displayed separately in the UI since rent is recoverable when the cuenta is closed.\n\n## CU profiling\n\nProfiling compute unit consumption across different operation types builds an estimation model. Common DeFi operations y their typical CU ranges:\n\n- SOL transfer: 2,000-5,000 CUs\n- SPL token transfer: 4,000-8,000 CUs\n- Create ATA (idempotent): 25,000-35,000 CUs\n- Simple AMM swap (constant product): 60,000-120,000 CUs\n- CLMM swap (concentrated liquidity): 100,000-200,000 CUs\n- Multi-hop route (2 legs): 200,000-400,000 CUs\n- Flash loan + swap: 300,000-600,000 CUs\n\nThese ranges vary based on pool state, tick array crossings in CLMM pools, y program version. Profiling your specific use case con simulation produces much more accurate estimates than using generic ranges.\n\n## Fee market analysis\n\nThe priority fee market fluctuates based on network demand. During quiet periods (off-peak hours, low volatility), median priority fees hover around 1-100 micro-lamports per CU. During peak events, fees can spike to 10,000-1,000,000+ micro-lamports per CU.\n\nFetching recent fee data from `getRecentPrioritizationFees` returns fee levels from the last 150 slots. Computing percentiles (25th, 50th, 75th, 90th) from this data provides a fee distribution that informs pricing strategy:\n- 25th percentile: economy — may take multiple blocks to land\n- 50th percentile: standard — lands in 1-2 blocks under normal conditions\n- 75th percentile: fast — high probability of next-block inclusion\n- 90th percentile: urgent — nearly guaranteed next-block inclusion\n\n## Fee tiers para user selection\n\nPresent fee estimates at multiple priority levels so users can choose their urgency. A typical tier structure:\n\n- Low priority: 100 micro-lamports/CU — suitable para non-urgent operations\n- Medium priority: 1,000 micro-lamports/CU — standard DeFi operations\n- High priority: 10,000 micro-lamports/CU — time-sensitive trades\n\nEach tier produces a different total fee: `baseFee + ceil(cuLimit * tierPrice / 1,000,000)`. Display all three alongside estimated confirmation times to help users make informed decisions.\n\n## Dynamic fee adjustment\n\nProduction systems should adjust fee tiers based on real-time market data rather than using static values. Query recent fees every 10-30 seconds y update the tier prices to reflect current conditions. During congestion spikes, automatically increase the default tier to ensure transacciones land. During quiet periods, reduce fees to save users money.\n\n## Cost display mejores practicas\n- Show total fee in both lamports y SOL equivalent\n- Separate base fee, priority fee, y rent deposits\n- Indicate the priority level y expected confirmation time\n- Update fee estimates in real-time as market conditions change\n- Warn users when fees are unusually high compared to recent averages\n",
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
            "title": "Challenge: Build a transaccion plan con compute budgeting",
            "content": "# Challenge: Build a transaccion plan con compute budgeting\n\nBuild a transaccion planning function that analyzes a set of instrucciones y produces a complete transaccion plan:\n\n- Sum estimatedCU from all instrucciones y add a 10% safety margin (ceiling)\n- Cap the compute unit limit at 1,400,000 (Solana maximum)\n- Calculate priority fee: ceil(computeUnitLimit * computeUnitPrice / 1,000,000)\n- Calculate total fee: base fee (5,000 lamports) + priority fee\n- Count unique cuenta keys across all instrucciones\n- Add 2 to instruccion count para SetComputeUnitLimit y SetComputeUnitPrice\n- Flag needsVersionedTx when unique cuentas exceed 35\n\nYour plan must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Sum estimatedCU from all instrucciones, then add 10% margin: ceil(total * 1.1).",
              "Cap compute unit limit at 1,400,000 (Solana max).",
              "Priority fee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) in lamports.",
              "Total fee = base fee (5000 lamports) + priority fee.",
              "Versioned tx needed when unique cuenta keys exceed 35."
            ]
          }
        }
      },
      "txopt-v2-optimization": {
        "title": "Optimization & Strategy",
        "description": "Address Lookup Table planning, reliability/retry patterns, actionable error UX, y full send-strategy reporting.",
        "lessons": {
          "txopt-v2-lut-planner": {
            "title": "Challenge: Plan Address Lookup Table usage",
            "content": "# Challenge: Plan Address Lookup Table usage\n\nBuild a function that determines the optimal Address Lookup Table strategy para a transaccion:\n\n- Collect all unique cuenta keys across instrucciones\n- Check which keys exist in available LUTs\n- Calculate transaccion size: base overhead (200 bytes) + keys * 32 bytes each\n- Con LUT: non-LUT keys cost 32 bytes, LUT keys cost 1 byte each\n- Recommend \"legacy\" if the transaccion fits in 1,232 bytes without LUT\n- Recommend \"use-existing-lut\" if LUT keys make it fit\n- Recommend \"create-new-lut\" if it still does not fit even con available LUTs\n- Return byte savings from LUT usage\n\nYour planner must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Collect all unique cuenta keys across instrucciones into a set.",
              "Each key costs 32 bytes without LUT, 1 byte con LUT.",
              "Base transaccion overhead is ~200 bytes. Max legacy tx size is 1232 bytes.",
              "Recommend 'legacy' if fits without LUT, 'use-existing-lut' if LUT helps enough, 'create-new-lut' if still too large."
            ]
          },
          "txopt-v2-reliability": {
            "title": "Reliability patterns: retry, re-quote, resend vs rebuild",
            "content": "# Reliability patterns: retry, re-quote, resend vs rebuild\n\nProduction DeFi applications must handle transaccion failures gracefully. The difference between a frustrating y a reliable experience comes down to retry strategy: knowing when to resend the same transaccion, when to rebuild con fresh parameters, y when to abort y inform the user.\n\n## Failure classification\n\nTransaccion failures fall into two categories: retryable y non-retryable. Correct classification is the foundation of any retry strategy.\n\nRetryable failures include: (1) blockhash expired -- the transaccion was not included in time, re-fetch blockhash y resend; (2) network timeout -- the RPC node did not respond, try again or switch nodes; (3) rate limiting (HTTP 429) -- back off y retry after the specified delay; (4) node behind -- the RPC node's slot is behind the cluster, try a different node; y (5) transaccion not found after send -- may need to resend.\n\nNon-retryable failures include: (1) insufficient funds -- user does not have enough balance; (2) slippage exceeded -- pool price moved beyond tolerance, must re-quote; (3) cuenta does not exist -- expected cuenta is missing; (4) program error con specific error code -- the program logic rejected the transaccion; y (5) invalid instruccion data -- the transaccion was constructed incorrectly.\n\n## Resend vs rebuild\n\nResending means submitting the exact same signed transaccion bytes again. This is safe because Solana deduplicates transacciones by signature -- if the original transaccion was already processed, the resend is ignored. Resending is appropriate when: the transaccion was sent but confirmation timed out, the RPC node returned a transient error, or you suspect the transaccion was not propagated to the leader.\n\nRebuilding means constructing a new transaccion from scratch con fresh parameters: new blockhash, possibly updated cuenta state, re-simulated CU estimate, y new signature. Rebuilding is necessary when: the blockhash expired (cannot resend con stale blockhash), slippage was exceeded (pool state changed, need fresh quote), or cuenta state changed (e.g., ATA was created by another transaccion in the meantime).\n\nThe decision tree is: if the failure is a network/delivery issue, resend; if the failure indicates stale state, rebuild; if the failure indicates a permanent problem (insufficient balance, invalid instruccion), abort con a clear error.\n\n## Exponential backoff con jitter\n\nRetry timing must use exponential backoff to avoid overwhelming the network during congestion. The formula is:\n\n```\ndelay = baseDelay * (backoffMultiplier ^ attemptNumber) + random jitter\n```\n\nCon a base delay of 500ms y a 2x multiplier: attempt 1 waits ~500ms, attempt 2 waits ~1,000ms, attempt 3 waits ~2,000ms. Adding random jitter of +/-25% prevents synchronized retries from many clients hitting the same RPC endpoint simultaneously.\n\nCap retries at 3 attempts para user-initiated transacciones. More retries introduce unacceptable latency (users do not want to wait 10+ seconds). Para backend/automated transacciones, higher retry counts (5-10) may be acceptable.\n\n## Blockhash refresh on retry\n\nEvery retry that involves rebuilding must fetch a fresh blockhash. Using the same blockhash across retries is dangerous because the blockhash may have already expired or be close to expiry. The retry flow is: (1) fetch new blockhash, (2) rebuild transaccion message con new blockhash, (3) re-sign con user cartera (or programmatic keypair), (4) simulate the rebuilt transaccion, (5) send if simulation succeeds.\n\nPara cartera-connected applications, re-signing requires another user interaction (cartera popup). To minimize this friction, some applications use durable nonces instead of blockhashes. Durable nonces do not expire, eliminating the need to re-sign on retry. However, durable nonces have their own complexity y are not universally supported.\n\n## User-facing retry UX\n\nPresent retry progress clearly: show the attempt number, what went wrong, y what is happening next. Example states: \"Sending transaccion...\" -> \"Transaccion not confirmed, retrying (2/3)...\" -> \"Refreshing quote...\" -> \"Success!\" or \"Failed after 3 attempts. [Try Again] [Cancel]\". Never retry silently -- users should always know what is happening con their transaccion.\n\n## Checklist\n- Classify every failure as retryable or non-retryable\n- Use exponential backoff (500ms base, 2x multiplier) con jitter\n- Cap retries at 3 para user-initiated transacciones\n- Refresh blockhash on every rebuild attempt\n- Distinguish resend (same bytes) from rebuild (new transaccion)\n- Show retry progress in the UI con clear status messages\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l6-q1",
                    "prompt": "When should you rebuild a transaccion instead of resending it?",
                    "options": [
                      "When the blockhash has expired or pool state has changed",
                      "Whenever any error occurs",
                      "Only when the user manually clicks retry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Rebuilding is necessary when the transaccion's blockhash is stale or when on-chain state has changed (e.g., slippage exceeded). Simple network issues only require resending the same bytes."
                  },
                  {
                    "id": "txopt-v2-l6-q2",
                    "prompt": "Why add random jitter to retry delays?",
                    "options": [
                      "To prevent many clients from retrying at the exact same moment y overwhelming the network",
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
            "title": "UX: actionable error messages para transaccion failures",
            "content": "# UX: actionable error messages para transaccion failures\n\nRaw Solana error messages are cryptic. \"Transaccion simulation failed: Error processing Instruccion 2: custom program error: 0x1771\" tells a developer something but tells a user nothing. Mapping program errors to clear, actionable messages is essential para DeFi application quality.\n\n## Error taxonomy\n\nSolana transaccion errors fall into several categories, each requiring different user-facing treatment:\n\nCartera errors: insufficient SOL balance, insufficient token balance, cartera disconnected, user rejected signature request. These are the most common y simplest to handle. The message should state what is missing y how to fix it: \"Insufficient SOL balance. You need at least 0.05 SOL to cover transaccion fees. Current balance: 0.01 SOL.\"\n\nProgram errors: these are custom error codes from on-chain programs. Each program defines its own error codes. Para example, Jupiter aggregator might return error 6001 para \"slippage tolerance exceeded,\" while Raydium returns a different code para the same concept. Maintaining a mapping from program ID + error code to human-readable messages is necessary para each protocol you integrate con.\n\nNetwork errors: RPC node unavailable, connection timeout, rate limited. These are transient y should be presented con automatic retry: \"Network temporarily unavailable. Retrying in 3 seconds...\" The user should not need to take action unless all retries fail.\n\nCompute errors: compute budget exceeded, transaccion too large. These indicate the transaccion was constructed incorrectly (from the user's perspective). The message should explain the situation y offer a solution: \"Transaccion too complex para a single submission. Splitting into two transacciones...\"\n\n## Mapping program errors\n\nThe most important error mappings para DeFi applications:\n\nSlippage exceeded: \"Price moved beyond your tolerance of X%. The swap would give you less than your minimum output of Y tokens. Tap 'Refresh Quote' to get an updated price.\" This is actionable -- the user can refresh y try again.\n\nInsufficient liquidity: \"Not enough liquidity in the pool para this swap size. Try reducing the swap amount or using a different route.\" This tells the user what to do.\n\nStale oracle: \"Price oracle data is outdated. This can happen during high volatility. Please wait a moment y try again.\" This sets expectations.\n\nCuenta not initialized: \"Your token cuenta para [TOKEN] needs to be created first. This will cost approximately 0.002 SOL in rent.\" This explains the additional cost.\n\n## Error message principles\n\nGood error messages follow these principles: (1) State what happened in plain language. Not \"Error 0x1771\" but \"The swap price changed too much.\" (2) Explain why it happened. \"Prices move quickly during high volatility.\" (3) Tell the user what to do. \"Tap Refresh to get an updated quote, or increase your slippage tolerance.\" (4) Provide technical details in a collapsible section para power users: \"Program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4, Error: 6001 (SlippageToleranceExceeded).\"\n\n## Error recovery flows\n\nEach error category should have a defined recovery flow:\n\nBalance errors: show current balance, required balance, y a link to fund the cartera or swap para the needed token. Pre-calculate the exact shortfall.\n\nSlippage errors: automatically re-quote con the same parameters. If the new quote is acceptable, present it con a \"Swap at new price\" button. If the price moved significantly, warn the user before proceeding.\n\nTimeout errors: show a transaccion explorer link so the user can verify whether the transaccion actually succeeded. Include a \"Check Status\" button that polls the signature. Many apparent failures are actually successes where the confirmation was slow.\n\nSimulation errors: catch these before sending. If simulation fails, do not prompt the user to sign. Instead, show the mapped error y recovery action. This saves users from paying fees on doomed transacciones.\n\n## Logging y monitoring\n\nLog every error con full context: timestamp, cartera address (anonymized), transaccion signature (if available), program ID, error code, mapped message, y recovery action taken. This data drives improvements: if 80% of errors are slippage-related, you need better default slippage settings or dynamic adjustment. If compute errors spike, your CU estimation model needs tuning.\n\n## Checklist\n- Map all known program error codes to human-readable messages\n- Include actionable recovery steps in every error message\n- Provide technical details in a collapsible section\n- Automatically re-quote on slippage failures\n- Log all errors con full context para monitoring\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "txopt-v2-l7-errors",
                "title": "Error Mapping Examples",
                "steps": [
                  {
                    "cmd": "Raw: custom program error: 0x1771",
                    "output": "Mapped: \"Price moved beyond your 0.5% tolerance. Tap Refresh para updated quote.\"",
                    "note": "Slippage exceeded -> actionable message"
                  },
                  {
                    "cmd": "Raw: Attempt to debit an account but found no record of a prior credit",
                    "output": "Mapped: \"Insufficient SOL balance. Need 0.05 SOL, have 0.01 SOL. Fund cartera to continue.\"",
                    "note": "Balance error -> show exact shortfall"
                  },
                  {
                    "cmd": "Raw: Transaction was not confirmed in 30.00 seconds",
                    "output": "Mapped: \"Transaccion pending. Check status or retry con higher priority fee.\" [Check Status] [Retry]",
                    "note": "Timeout -> offer both check y retry options"
                  }
                ]
              }
            ]
          },
          "txopt-v2-send-strategy": {
            "title": "Checkpoint: Generate a send strategy report",
            "content": "# Checkpoint: Generate a send strategy report\n\nBuild the final send strategy report that combines all curso concepts into a comprehensive transaccion optimization plan:\n\n- Build a tx plan: sum CU estimates con 10% margin (capped at 1,400,000), calculate priority fee, count unique cuentas y total instrucciones (+2 para compute budget)\n- Plan LUT strategy: calculate sizes con y without LUT, recommend legacy / use-existing-lut / create-new-lut\n- Generate fee estimates at three priority tiers: low (100 uL/CU), medium (1,000 uL/CU), high (10,000 uL/CU)\n- Include a fixed retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash\n- Preserve the input timestamp in the output\n\nThis checkpoint validates your complete understanding of transaccion optimization.",
            "duration": "55 min",
            "hints": [
              "Combine tx plan building y LUT planning into one comprehensive report.",
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
    "description": "Master production mobile cartera signing on Solana: Android MWA sessions, iOS deep-link constraints, resilient retries, y deterministic session telemetry.",
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
        "description": "Platform constraints, connection UX patterns, signing timeline behavior, y typed request construction across Android/iOS.",
        "lessons": {
          "mobilesign-v2-reality-check": {
            "title": "Mobile signing reality check: Android vs iOS constraints",
            "content": "# Mobile signing reality check: Android vs iOS constraints\n\nMobile cartera signing on Solana is fundamentally different from browser-based cartera interactions. The constraints imposed by Android y iOS operating systems shape every diseno decision, from session management to error handling. Understanding these platform differences is essential before writing any signing code.\n\n## Android y Mobile Cartera Adapter (MWA)\n\nOn Android, the Solana Mobile Cartera Adapter (MWA) protocol provides a persistent communication channel between dApps y cartera applications. MWA leverages Android's ability to run foreground services, which means the cartera application can maintain an active session while the user interacts con the dApp. The protocol uses a WebSocket-like association mechanism: the dApp sends an association intent, the cartera responds con a session token, y subsequent sign requests flow over this persistent channel.\n\nThe key advantage of MWA on Android is session continuity. Once a user authorizes a dApp, the cartera maintains an active session that can handle multiple sign requests without requiring the user to switch applications. The foreground service keeps the communication channel alive even when the cartera is not in the foreground. This enables flows like batch signing, sequential transaccion approval, y real-time status updates.\n\nAndroid MWA sessions have a lifecycle tied to the association. The dApp initiates an association via an Android intent, receives a session object, y can then issue authorize, sign_transactions, sign_messages, y sign_and_send_transactions requests. Sessions persist until explicitly deauthorized, the cartera terminates them, or the session TTL expires. Typical TTL values range from 5 minutes to 24 hours depending on the cartera implementation.\n\nHowever, Android is not without constraints. The user must have a compatible MWA cartera installed (Phantom, Solflare, or other MWA-compatible carteras). The association intent may fail if no compatible cartera is found, requiring graceful fallback. Additionally, Android battery optimization y Doze mode can interrupt foreground services on some manufacturer-modified Android builds (Samsung, Xiaomi), requiring careful handling of session interruption.\n\n## iOS limitations y deep link patterns\n\niOS presents a fundamentally different challenge. Apple does not allow arbitrary background processes or persistent inter-app communication channels. There is no equivalent to Android's foreground service pattern. When a user switches from a dApp (typically a web view or native app) to a cartera app, the dApp's execution context is suspended. There is no way to maintain a WebSocket or persistent channel between the two applications.\n\nOn iOS, cartera interactions rely on deep links y universal links. The dApp constructs a signing request, encodes it into a URL, y opens the cartera via a deep link. The cartera processes the request, y returns the result via a callback deep link back to the dApp. Each sign request requires a full app switch: dApp to cartera, user approval, cartera back to dApp.\n\nThis round-trip app switching has significant UX implications. Each signature requires 2-4 seconds of visual context switching. Users see the iOS app transition animation, must locate the approve button in the cartera, y then return to the dApp. Batch signing is particularly painful because each transaccion in the batch requires a separate app switch (unless the cartera supports batch approval in a single deep link payload).\n\nSession persistence on iOS is effectively impossible in the traditional sense. The dApp cannot know if the cartera is still running, whether the user closed it, or if iOS terminated it para memory pressure. Every request must be treated as potentially the first request in a new session. This means encoding all necessary context (app identity, cluster, authorization state) into every deep link request.\n\n## What actually works in production\n\nProduction mobile dApps adopt a hybrid strategy. On Android, they detect MWA support y use the persistent session model. On iOS, they fall back to deep link patterns con aggressive local caching to minimize the data that must be re-transmitted on each request. Cross-platform frameworks like the Solana Mobile SDK abstract some of these differences, but developers must still handle platform-specific edge cases.\n\nFallback patterns include: QR code-based WalletConnect sessions (works on both platforms but adds latency), embedded browser carteras (avoid app switching but sacrifice seguridad), y progressive web app approaches con browser extension carteras. Each fallback has trade-offs in seguridad, UX, y feature completeness.\n\nThe most robust approach is capability detection at runtime: check para MWA support, fall back to deep links, y ultimately offer QR-based connection as a universal fallback. Each path should provide appropriate UX feedback so users understand why the experience differs across devices.\n\n## Shipping principle para mobile signing\n\nDiseno para interruption by default. Assume app switches, OS suspension, network drops, y cartera restarts are normal events. A resilient signing flow recovers state quickly y keeps users informed at each step.\n\n## Checklist\n- Detect MWA availability on Android before attempting association\n- Implement deep link fallback para iOS y non-MWA Android\n- Handle session interruption from OS-level process management\n- Cache session state locally para faster reconnection\n- Provide clear UX para each connection method\n\n## Red flags\n- Assuming MWA works identically on iOS y Android\n- Not handling foreground service termination on Android\n- Ignoring deep link callback failures on iOS\n- Hardcoding a single cartera without fallback detection\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l1-q1",
                    "prompt": "What enables persistent dApp-to-cartera communication on Android?",
                    "options": [
                      "Foreground services maintaining a session channel",
                      "Deep links passed between applications",
                      "Shared local storage between apps"
                    ],
                    "answerIndex": 0,
                    "explanation": "Android MWA uses foreground services to maintain a persistent communication channel between the dApp y cartera, enabling multi-request sessions without app switching."
                  },
                  {
                    "id": "mobilesign-v2-l1-q2",
                    "prompt": "Why can't iOS maintain persistent cartera sessions like Android?",
                    "options": [
                      "iOS suspends app execution on background transitions, preventing persistent channels",
                      "iOS carteras do not support Solana",
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
            "title": "Cartera connection UX patterns: connect, reconnect, y recovery",
            "content": "# Cartera connection UX patterns: connect, reconnect, y recovery\n\nCartera connection on mobile is the first interaction users have con your dApp. A smooth connection flow builds trust; a broken one drives users away. This leccion covers the connection lifecycle, automatic reconnection strategies, network mismatch handling, y user-friendly error states.\n\n## Initial connection flow\n\nThe connection flow begins con capability detection. Before presenting any cartera UI, your dApp should determine what connection methods are available. On Android, check para installed MWA-compatible carteras by attempting to resolve the MWA association intent. On iOS, check para registered deep link handlers. If neither is available, offer a QR code or WalletConnect fallback.\n\nOnce a connection method is selected, the authorization flow begins. Para MWA on Android, this involves sending an authorize request con your app identity (name, URI, icon). The cartera displays a consent screen showing your dApp's identity y requested permissions. Upon approval, the cartera returns an auth token y the user's public key. Store both: the public key para display y transaccion building, the auth token para session resumption.\n\nPara deep link connections on iOS, the flow is: construct an authorize deep link con your app identity y callback URI, open the cartera, wait para the callback deep link con the auth result, y parse the response. The response includes the public key y optionally a session token para subsequent requests.\n\nConnection state should be persisted locally. Store the cartera address, connection method, auth token, y timestamp. This enables automatic reconnection on app restart without requiring the user to re-authorize. Use secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) para auth tokens.\n\n## Automatic reconnection\n\nWhen the dApp restarts or returns from background, attempt silent reconnection before showing any cartera UI. The reconnection flow checks: is there a stored auth token? Is it still valid (not expired)? Can we re-establish the communication channel?\n\nOn Android con MWA, reconnection involves re-associating con the cartera using the stored auth token. If the cartera accepts the token, the session resumes transparently. If the token is expired or revoked, fall back to a fresh authorization flow. The key is making this check fast (under 500ms) so the user does not see a loading state.\n\nOn iOS, reconnection is simpler but less reliable. Check if the stored cartera address is still valid by verifying the cuenta exists on-chain. The auth token from the previous deep link session may or may not be accepted by the cartera on the next interaction. Optimistically display the stored cartera address y handle re-authorization lazily when the first sign request fails.\n\n## Network mismatch handling\n\nNetwork mismatches occur when the dApp expects one cluster (e.g., mainnet-beta) but the cartera is configured para another (e.g., devnet). This is a common source of confusing errors: transacciones build correctly but fail on submission because they reference cuentas that do not exist on the cartera's configured cluster.\n\nDetection strategies include: requesting the cartera's current cluster during authorization, comparing the cluster in sign responses against expectations, y catching specific RPC errors that indicate cluster mismatch (e.g., cuenta not found para well-known program addresses).\n\nWhen a mismatch is detected, present a clear error message: \"Your cartera is connected to devnet, but this dApp requires mainnet-beta. Please switch your cartera's network y reconnect.\" Avoid technical jargon. Some carteras support programmatic cluster switching via the MWA protocol; use this when available.\n\n## User-friendly error states\n\nError states must be actionable. Users should always know what happened y what to do next. Common error states y their UX patterns:\n\nCartera not found: \"No compatible cartera detected. Install Phantom or Solflare to continue.\" Include direct links to app stores.\n\nAuthorization denied: \"Cartera connection was declined. Tap Connect to try again.\" Do not repeatedly prompt; wait para user action.\n\nSession expired: \"Your cartera session has expired. Tap to reconnect.\" Attempt silent reconnection first; only show this if silent reconnection fails.\n\nNetwork error: \"Unable to reach the Solana network. Check your internet connection y try again.\" Distinguish between local network issues y RPC endpoint failures.\n\nCartera disconnected: \"Your cartera was disconnected. This can happen if the cartera app was closed. Tap to reconnect.\" On Android, this may indicate the foreground service was killed.\n\n## Recovery patterns\n\nRecovery should be automatic when possible y manual when necessary. Implement a connection state machine con states: disconnected, connecting, connected, reconnecting, y error. Transitions between states should be deterministic y logged para debugging.\n\nThe reconnecting state is critical. When a connected session fails (e.g., the cartera app crashes), transition to reconnecting y attempt up to 3 silent reconnection attempts con exponential backoff (1s, 2s, 4s). If all attempts fail, transition to error y present the manual reconnection UI.\n\n## Checklist\n- Detect available connection methods before showing cartera UI\n- Store auth tokens securely para automatic reconnection\n- Handle network mismatch con clear user messaging\n- Implement connection state machine con deterministic transitions\n- Provide actionable error states con recovery options\n\n## Red flags\n- Showing raw error codes to users\n- Repeatedly prompting para authorization after denial\n- Not persisting connection state across app restarts\n- Ignoring network mismatch silently\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l2-q1",
                    "prompt": "What should you do before showing any cartera connection UI?",
                    "options": [
                      "Detect available connection methods (MWA, deep links, QR)",
                      "Immediately open the default cartera",
                      "Display a loading spinner para 3 seconds"
                    ],
                    "answerIndex": 0,
                    "explanation": "Capability detection ensures you only present connection methods that are actually available on the user's device."
                  },
                  {
                    "id": "mobilesign-v2-l2-q2",
                    "prompt": "How should a dApp handle a network mismatch between itself y the cartera?",
                    "options": [
                      "Display a clear message asking the user to switch their cartera's network",
                      "Silently retry the transaccion on a different cluster",
                      "Ignore the mismatch y hope it resolves"
                    ],
                    "answerIndex": 0,
                    "explanation": "Network mismatches should be communicated clearly to the user con instrucciones on how to resolve them, avoiding confusing silent failures."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-timeline-explorer": {
            "title": "Signing session timeline: request, cartera, y response flow",
            "content": "# Signing session timeline: request, cartera, y response flow\n\nUnderstanding the complete lifecycle of a mobile signing request is essential para building reliable dApps. Every sign request passes through multiple stages, each con its own failure modes y timing constraints. This leccion traces a request from construction to final response.\n\n## Request construction phase\n\nThe signing flow begins in the dApp when user action triggers a transaccion. The dApp constructs the transaccion: fetching a recent blockhash, building instrucciones, setting the fee payer, y serializing the transaccion into a byte array. On mobile, this construction phase must be fast because the user is waiting para the cartera to appear.\n\nKey timing constraint: the recent blockhash has a limited validity window (typically 60-90 seconds on mainnet, determined by the slots-per-epoch configuration). If transaccion construction takes too long (e.g., due to slow RPC responses), the blockhash may expire before the cartera even sees the transaccion. Production dApps pre-fetch blockhashes y refresh them periodically.\n\nThe constructed transaccion is encoded (typically base64 para MWA, or URL-safe base64 para deep links) y wrapped in a sign request object. The sign request includes metadata: the app identity, requested cluster, y a unique request ID para tracking. On MWA, this is sent over the session channel. On iOS deep links, it is encoded into the URL.\n\n## Cartera-side processing\n\nOnce the cartera receives the sign request, it enters its own processing pipeline. The cartera decodes the transaccion, simulates it (if the cartera supports simulation), extracts human-readable information para the approval screen, y presents the transaccion details to the user.\n\nSimulation is a critical step. Carteras like Phantom simulate transacciones before showing them to users, detecting potential failures, extracting token transfer amounts, y identifying program interactions. Simulation adds 1-3 seconds to the cartera-side processing time but significantly improves the user experience by showing accurate fee estimates y transfer amounts.\n\nThe approval screen shows: the requesting dApp's identity (name, icon, URI), the transaccion type (transfer, swap, mint, etc.), amounts being transferred, estimated fees, y any warnings (e.g., interaction con unverified programs). The user can approve or reject. The time spent on this screen is unpredictable y depends entirely on the user.\n\n## Response handling\n\nAfter the user approves (or rejects), the cartera constructs y returns a response. Para approved transacciones, the response contains the signed transaccion bytes (the original transaccion con the cartera's signature appended). Para rejected transacciones, the response contains an error code y message.\n\nOn MWA, the response arrives over the same session channel. The dApp receives a callback con the signed transaccion or error. On iOS deep links, the cartera opens the dApp's callback URL con the response encoded in the URL parameters or fragment.\n\nResponse parsing must be defensive. Check that the response contains a valid signature, that the transaccion bytes match the original request (to detect tampering), y that the response corresponds to the correct request ID. Carteras may return responses out of order if multiple requests were queued.\n\n## Timeout scenarios\n\nTimeouts are the most challenging failure mode in mobile signing. A timeout can occur at multiple points: during request delivery (the cartera never received the request), during user decision (the user walked away), during response delivery (the cartera signed but the response was lost), or during submission (the signed transaccion was sent but confirmation timed out).\n\nEach timeout requires a different recovery strategy. Request delivery timeout: retry the request. User decision timeout: show a \"waiting para cartera\" UI con a cancel option. Response delivery timeout: check on-chain para the transaccion signature before retrying (to avoid double-signing). Submission timeout: poll para transaccion status before resubmitting.\n\nA reasonable timeout configuration para mobile: 30 seconds para the complete round-trip (request to response), con a 60-second grace period para user decision on the cartera side. If the MWA session itself times out, re-associate before retrying. If the deep link callback never arrives, present a manual \"I've approved in my cartera\" button that triggers a status check.\n\n## The complete timeline\n\nA typical successful signing flow takes 3-8 seconds on Android MWA y 6-15 seconds on iOS deep links. The breakdown: transaccion construction (0.5-2s), request delivery (0.1-0.5s on MWA, 1-3s on deep link), cartera simulation (1-3s), user approval (variable), response delivery (0.1-0.5s on MWA, 1-3s on deep link), y transaccion submission (0.5-2s).\n\n## Checklist\n- Pre-fetch blockhashes to minimize construction time\n- Include unique request IDs para response correlation\n- Handle all timeout scenarios con appropriate recovery\n- Parse responses defensively con signature validation\n- Provide real-time status feedback during the signing flow\n\n## Red flags\n- Using stale blockhashes that expire during signing\n- Not correlating responses con request IDs\n- Treating all timeouts identically\n- Missing the case where a transaccion was signed but the response was lost\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mobilesign-v2-l3-timeline",
                "title": "Signing Session Timeline",
                "steps": [
                  {
                    "cmd": "T+0.0s  dApp: build transaction",
                    "output": "Fetch blockhash, construct instrucciones, serialize to base64",
                    "note": "Transaccion construction phase"
                  },
                  {
                    "cmd": "T+0.5s  dApp -> wallet: sign_transactions request",
                    "output": "{\"type\":\"transaccion\",\"payload\":\"AQAAA...\",\"requestId\":\"req_001\"}",
                    "note": "Request sent via MWA session or deep link"
                  },
                  {
                    "cmd": "T+1.0s  wallet: simulate transaction",
                    "output": "{\"fee\":\"0.000005 SOL\",\"transfers\":[{\"to\":\"7Y4f...\",\"amount\":\"1.5 SOL\"}]}",
                    "note": "Cartera simulates y extracts display info"
                  },
                  {
                    "cmd": "T+1.5s  wallet: show approval screen",
                    "output": "User sees: Send 1.5 SOL to 7Y4f... | Fee: 0.000005 SOL | [Approve] [Reject]",
                    "note": "User decision - timing is unpredictable"
                  },
                  {
                    "cmd": "T+3.0s  wallet -> dApp: signed response",
                    "output": "{\"signedPayloads\":[\"AQAAA...signed...\"],\"requestId\":\"req_001\"}",
                    "note": "Signed transaccion returned to dApp"
                  },
                  {
                    "cmd": "T+3.5s  dApp: submit to RPC",
                    "output": "{\"signature\":\"5UzM...\",\"confirmationStatus\":\"confirmed\"}",
                    "note": "Transaccion submitted y confirmed on-chain"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-sign-request": {
            "title": "Challenge: Build a typed sign request",
            "content": "# Challenge: Build a typed sign request\n\nImplement a sign request builder para Mobile Cartera Adapter:\n\n- Validate the payload type (transaccion or message)\n- Validate payload data (base64 para transacciones, non-empty string para messages)\n- Set session metadata (app identity con name, URI, y icon)\n- Validate the cluster (mainnet-beta, devnet, or testnet)\n- Generate a request ID if not provided\n- Return a structured SignRequest con validation results\n\nYour implementation will be tested against valid requests, message signing requests, y invalid inputs con multiple errors.",
            "duration": "50 min",
            "hints": [
              "Validate type is either 'transaccion' or 'message' before checking payload format.",
              "Transaccion payloads must be valid base64 (A-Z, a-z, 0-9, +, /, optional = padding, length divisible by 4).",
              "App identity requires at least name y URI. Icon is optional but should default to empty string.",
              "Generate a requestId from type + payload prefix if not provided."
            ]
          }
        }
      },
      "mobilesign-v2-production": {
        "title": "Production Patterns",
        "description": "Session persistence, transaccion-review safety, retry state machines, y deterministic session reporting para production mobile apps.",
        "lessons": {
          "mobilesign-v2-session-persist": {
            "title": "Challenge: Session persistence y restoration",
            "content": "# Challenge: Session persistence y restoration\n\nImplement a session persistence manager para mobile cartera sessions:\n\n- Process a sequence of actions: save, restore, clear, y expire_check\n- Track cartera address y last sign request ID across actions\n- Handle session expiry based on TTL y timestamps\n- Return the final session state con a complete action log\n\nEach action modifies the session state. Save establishes a session, restore checks if it is still valid, clear removes it, y expire_check verifies TTL bounds.",
            "duration": "50 min",
            "hints": [
              "Process actions sequentially: each action modifies the session state.",
              "Save sets walletAddress, lastRequestId, sessionActive=true, y expiresAt = timestamp + TTL.",
              "Restore succeeds only if session is active Y current time < expiresAt.",
              "Expire check clears session if current time >= expiresAt."
            ]
          },
          "mobilesign-v2-review-screens": {
            "title": "Mobile transaccion review: what users need to see",
            "content": "# Mobile transaccion review: what users need to see\n\nTransaccion review screens are the last line of defense between a user y a potentially harmful transaccion. On mobile, screen real estate is limited y user attention is fragmented. Designing effective review screens requires understanding what information matters, how to present it, y what simulation results to surface.\n\n## Human-readable transaccion summaries\n\nRaw transaccion data is meaningless to most users. A transaccion containing a SystemProgram.transfer instruccion should display \"Send 1.5 SOL to 7Y4f...T6aY\" rather than showing serialized instruccion bytes. The translation from on-chain instrucciones to human-readable summaries is one of the most important UX challenges in mobile cartera development.\n\nSummary generation involves: identifying the program being called (System Program, Token Program, a known DeFi protocol), decoding the instruccion data according to the program's IDL or known layout, extracting the relevant parameters (amounts, addresses, token mints), y formatting them para display. Unknown programs should show a warning: \"Interaction con unverified program: Prog1111...\".\n\nAddress formatting on mobile requires truncation. Full Solana addresses (32-44 characters) do not fit on mobile screens. The standard pattern is showing the first 4 y last 4 characters con an ellipsis: \"7Y4f...T6aY\". Always provide a way to view the full address (tap to expand or copy). Para known addresses (well-known programs, token mints), show the human-readable name instead: \"USDC Token Program\" rather than \"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\".\n\nToken amounts must include decimals y symbols. A raw amount of 1500000 para a USDC transfer should display as \"1.50 USDC\", not \"1500000 lamports\". This requires knowing the token's decimal places y symbol, which can be fetched from the token mint's metadata or a local registry of known tokens.\n\n## Fee display y estimation\n\nTransaccion fees on Solana are low but not zero. Users should see the estimated fee before approving. The base fee (currently 5000 lamports or 0.000005 SOL) plus any priority fee should be displayed clearly. If the transaccion includes compute budget instrucciones that set a custom fee, extract y display the total.\n\nFee estimation can use simulation results. The Solana RPC simulateTransaction method returns the compute units consumed, which combined con the priority fee rate gives an accurate fee estimate. Display fees in both SOL y the user's preferred fiat currency if possible.\n\nPara transacciones that interact con DeFi protocols, additional costs may apply: swap fees, protocol fees, slippage impact. These should be itemized separately from the network transaccion fee. A swap review screen might show: \"Swap 10 USDC para ~0.05 SOL | Network fee: 0.000005 SOL | Protocol fee: 0.01 USDC | Impacto de precio: 0.1%\".\n\n## Simulation results\n\nTransaccion simulation is the most powerful tool para transaccion review. Before showing the approval screen, simulate the transaccion y extract: balance changes (SOL y token cuentas), new cuentas that will be created, cuentas that will be closed, y any errors or warnings.\n\nBalance change summaries are the most intuitive way to present transaccion effects. Show a list of changes: \"-1.5 SOL from your cartera\", \"+150 USDC to your cartera\", \"-0.000005 SOL (network fee)\". Color-code decreases (red) y increases (green) para quick visual scanning.\n\nSimulation can detect potential issues: insufficient balance, cuenta ownership conflicts, program errors, y excessive compute usage. Surface these as warnings before the user approves. A warning like \"This transaccion will fail: insufficient SOL balance\" saves the user from paying a fee para a failed transaccion.\n\n## Approval UX patterns\n\nThe approve y reject buttons must be unambiguous. Use distinct colors (green para approve, red/grey para reject), sufficient spacing to prevent accidental taps, y clear labels (\"Approve\" y \"Reject\", not \"OK\" y \"Cancel\"). Consider requiring a deliberate gesture (swipe to approve) para high-value transacciones.\n\nBiometric confirmation adds seguridad para high-value transacciones. After the user taps approve, prompt para fingerprint or face recognition before signing. This prevents unauthorized transacciones if the device is unlocked but unattended. Make biometric confirmation optional y configurable.\n\nLoading states during signing should show progress: \"Signing transaccion...\", \"Submitting to network...\", \"Waiting para confirmation...\". Never show a blank screen or spinner without context. If the process takes longer than expected, show a message: \"This is taking longer than usual. Your transaccion is still processing.\"\n\n## Checklist\n- Translate instrucciones to human-readable summaries\n- Truncate addresses con first 4 y last 4 characters\n- Show token amounts con correct decimals y symbols\n- Display simulation-based fee estimates\n- Surface balance changes con color coding\n- Require deliberate approval gestures para high-value transacciones\n\n## Red flags\n- Showing raw instruccion bytes to users\n- Displaying token amounts without decimal conversion\n- Missing fee information on approval screens\n- No simulation before transaccion approval\n- Approve y reject buttons too close together\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l6-q1",
                    "prompt": "How should token amounts be displayed on a mobile transaccion review screen?",
                    "options": [
                      "Con correct decimal places y token symbol (e.g., 1.50 USDC)",
                      "As raw lamports or smallest unit values",
                      "In scientific notation para precision"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts must be converted to human-readable format using the token's decimal configuration y include the symbol para clarity."
                  },
                  {
                    "id": "mobilesign-v2-l6-q2",
                    "prompt": "What is the most intuitive way to present transaccion simulation results?",
                    "options": [
                      "Balance change summaries con color-coded increases y decreases",
                      "Raw simulation logs from the RPC response",
                      "A list of all cuentas the transaccion touches"
                    ],
                    "answerIndex": 0,
                    "explanation": "Balance change summaries (e.g., -1.5 SOL, +150 USDC) are the most user-friendly way to communicate what a transaccion will do."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-retry-patterns": {
            "title": "One-tap retry: handling offline, rejected, y timeout states",
            "content": "# One-tap retry: handling offline, rejected, y timeout states\n\nMobile environments are inherently unreliable. Users move between WiFi y cellular, enter tunnels, close apps mid-transaccion, y carteras crash. A robust retry system is not optional; it is a core requirement para production mobile dApps. This leccion covers retry state machines, offline detection, user-initiated retry, y mobile-appropriate backoff strategies.\n\n## Retry state machine\n\nEvery sign request in a mobile dApp should be managed by a state machine con well-defined states y transitions. The core states are: idle, pending, signing, submitted, confirmed, failed, y retrying. Each state has specific allowed transitions y associated UI.\n\nIdle: no active request. Transition to pending when the user initiates an action.\n\nPending: the request is being constructed (fetching blockhash, building transaccion). Transition to signing when the request is sent to the cartera, or to failed if construction fails (e.g., RPC unreachable).\n\nSigning: waiting para cartera response. Transition to submitted if the cartera returns a signed transaccion, to failed if the cartera rejects, or to retrying if the signing times out.\n\nSubmitted: the signed transaccion has been sent to the network. Transition to confirmed when the transaccion is finalized, or to failed if submission fails or confirmation times out.\n\nConfirmed: terminal success state. Display success UI y clean up.\n\nFailed: non-terminal failure state. Analyze the failure reason y determine if retry is appropriate. Transition to retrying if the failure is retryable, or remain in failed if it is terminal (e.g., user explicitly rejected).\n\nRetrying: preparing to retry. Refresh stale data (new blockhash, updated balances), wait para backoff period, then transition back to pending.\n\n## Offline detection\n\nMobile offline detection is more nuanced than checking navigator.onLine. That property only indicates whether the device has a network interface active, not whether the Solana RPC endpoint is reachable. Implement a multi-layer detection strategy.\n\nLayer 1: Network interface status. Use the device's network state API to detect complete disconnection (airplane mode, no signal). This is instant y covers the most obvious case.\n\nLayer 2: RPC health check. Periodically ping the Solana RPC endpoint con a lightweight request (getHealth or getSlot). If this fails but the network interface is up, the issue is likely RPC-specific. Try a fallback RPC endpoint before declaring offline status.\n\nLayer 3: Transaccion-level detection. If a transaccion submission returns a network error, mark the request as failed-offline rather than failed-permanent. This distinction drives the retry logic: offline failures should be retried when connectivity returns, while permanent failures (insufficient funds, invalid transaccion) should not.\n\nWhen offline is detected, queue pending sign requests locally. Display an offline banner: \"You are offline. Your transaccion will be submitted when connectivity returns.\" When connectivity is restored, process the queue in order, refreshing blockhashes para any queued transacciones (they will have expired).\n\n## User-initiated retry\n\nNot all retries should be automatic. When a transaccion fails, present the user con context y a clear retry option. The retry button should be prominent (primary action), y the error context should be concise.\n\nPara cartera rejection: \"Transaccion was declined in your cartera. [Try Again]\". The retry re-opens the cartera con the same request. Do not automatically retry rejected transacciones; respect the user's decision y only retry on explicit user action.\n\nPara timeout: \"Cartera did not respond in time. This may happen if the cartera app was closed. [Retry] [Cancel]\". Before retrying, check if the transaccion was already signed y submitted (to avoid double-signing).\n\nPara network errors: \"Could not reach the Solana network. [Retry When Online]\". This button should be disabled while offline y automatically trigger when connectivity returns.\n\nPara submission failures: \"Transaccion could not be confirmed. [Retry con New Blockhash]\". This re-constructs the transaccion con a fresh blockhash y re-submits. Show the previous failure reason to build user confidence.\n\n## Exponential backoff on mobile\n\nMobile backoff must be more aggressive than server-side backoff because users are waiting y watching. Start con a 1-second delay, double on each retry, y cap at 8 seconds. After 3 failed retries, stop automatic retrying y present a manual retry option.\n\nThe backoff sequence para automatic retries: 1s, 2s, 4s, then stop. Para user-initiated retries, do not apply backoff (the user explicitly chose to retry, so execute immediately). Para offline queue processing, use a 2-second delay between queued items to avoid overwhelming the RPC endpoint when connectivity returns.\n\nJitter is important even on mobile. Add a random 0-500ms offset to each retry delay to prevent thundering herd problems when many users come back online simultaneously (e.g., after a widespread network outage).\n\nDisplay retry progress to the user: \"Retrying in 3... 2... 1...\" or \"Attempt 2 of 3\". Never retry silently; users should always know the dApp is working on their behalf.\n\n## Checklist\n- Implement a state machine para every sign request lifecycle\n- Detect offline state at network, RPC, y transaccion levels\n- Queue transacciones locally when offline\n- Refresh blockhashes before retrying queued transacciones\n- Use mobile-appropriate backoff: 1s, 2s, 4s, then manual\n- Show retry progress y attempt counts to users\n\n## Red flags\n- Automatically retrying user-rejected transacciones\n- Using server-side backoff timing (30s+) on mobile\n- Retrying con stale blockhashes\n- Silently retrying without user visibility\n- Not checking para already-submitted transacciones before retry\n",
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
                    "output": "Opening cartera para approval... requestId=req_001",
                    "note": "Request sent to cartera via MWA or deep link"
                  },
                  {
                    "cmd": "State: signing -> failed (timeout after 30s)",
                    "output": "Cartera did not respond. Failure: SIGNING_TIMEOUT",
                    "note": "Cartera app may have been closed or crashed"
                  },
                  {
                    "cmd": "State: failed -> retrying (attempt 1/3, delay 1s)",
                    "output": "Refreshing blockhash... Retrying in 1s...",
                    "note": "Automatic retry con fresh blockhash"
                  },
                  {
                    "cmd": "State: retrying -> signing",
                    "output": "Re-opening cartera para approval... requestId=req_001_r1",
                    "note": "New request sent con updated blockhash"
                  },
                  {
                    "cmd": "State: signing -> submitted",
                    "output": "Cartera approved. Submitting tx: 5UzM...",
                    "note": "Signed transaccion submitted to network"
                  },
                  {
                    "cmd": "State: submitted -> confirmed",
                    "output": "Transaccion confirmed in slot 234567890. Success!",
                    "note": "Terminal success state"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-session-report": {
            "title": "Checkpoint: Generate a session report",
            "content": "# Checkpoint: Generate a session report\n\nImplement a session report generator that summarizes a complete mobile signing session:\n\n- Count total requests, successful signs, y failed signs\n- Sum retry attempts across all requests\n- Calculate session duration from start y end timestamps\n- Break down requests by type (transaccion vs message)\n- Produce deterministic JSON output para consistent reporting\n\nThis checkpoint validates your understanding of session lifecycle, request tracking, y deterministic output generation.",
            "duration": "55 min",
            "hints": [
              "Count requests by status: 'signed' = success, 'rejected'/'timeout'/'error' = failure.",
              "Sum retries across all requests para total retry attempts.",
              "Session duration = sessionEnd - sessionStart in seconds.",
              "Request breakdown counts how many were 'transaccion' vs 'message' type."
            ]
          }
        }
      }
    }
  },
  "solana-pay-commerce": {
    "title": "Solana Pay Commerce",
    "description": "Master Solana Pay commerce integration: robust URL encoding, QR/payment tracking workflows, confirmation UX, y deterministic POS reconciliation artifacts.",
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
        "description": "Solana Pay specification, URL encoding rigor, transfer request anatomy, y deterministic builder/encoder patterns.",
        "lessons": {
          "solanapay-v2-mental-model": {
            "title": "Solana Pay modelo mental y URL encoding rules",
            "content": "# Solana Pay modelo mental y URL encoding rules\n\nSolana Pay is an open specification para encoding payment requests into URLs that carteras can parse y execute. Unlike traditional payment processors that rely on centralized intermediaries, Solana Pay enables direct peer-to-peer value transfer by embedding all the information a cartera needs into a single URI string. Understanding this specification deeply is the foundation para building any commerce integration on Solana.\n\nThe Solana Pay specification defines two distinct request types: transfer requests y transaccion requests. Transfer requests are the simpler of the two — they encode a recipient address, an amount, y optional metadata directly in the URL. The cartera parses the URL, constructs a standard SOL or SPL token transfer transaccion, y submits it to the network. Transaccion requests are more powerful — the URL points to an API endpoint that returns a serialized transaccion para the cartera to sign. This allows the merchant server to build arbitrarily complex transacciones (multi-instruccion, program interactions, etc.) while the cartera simply signs what it receives.\n\nThe URL format follows a strict schema. A transfer request URL takes the form: `solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>&memo=<memo>`. The scheme is always `solana:` (not `solana://`). The recipient is a base58-encoded Solana public key placed immediately after the colon con no slashes. Query parameters encode the payment details.\n\nEach parameter has specific encoding rules. The `amount` is a decimal string representing the number of tokens (not lamports or raw units). Para native SOL, `amount=1.5` means 1.5 SOL. Para SPL tokens, the amount is in the token's human-readable units respecting its decimals. The `spl-token` parameter is optional — when absent, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token. The `reference` parameter is one or more base58 public keys that are added as non-signer keys in the transfer instruccion, enabling transaccion discovery via `getSignaturesForAddress`. The `label` identifies the merchant or payment recipient in a human-readable format. The `message` provides a description of the payment purpose. Both `label` y `message` must be URL-encoded using percent-encoding (spaces become `%20`, special characters like `#` become `%23`).\n\nWhen should you use transfer requests versus transaccion requests? Transfer requests are ideal para simple point-of-sale payments where the merchant only needs to receive a fixed amount of a single token. They work entirely client-side — no server needed. Transaccion requests are necessary when the payment involves multiple instrucciones (e.g., creating an associated token cuenta, interacting con a program, splitting payments among multiple recipients, or including on-chain metadata). Transaccion requests require a server endpoint that the cartera calls to fetch the transaccion.\n\nURL encoding correctness is critical. A malformed URL will be rejected by compliant carteras. Common mistakes include: using `solana://` instead of `solana:`, encoding the recipient address incorrectly, omitting percent-encoding para special characters in labels, y providing amounts in raw token units instead of human-readable decimals. The specification requires that all base58 values are valid Solana public keys (32 bytes when decoded), y that amounts are non-negative finite decimal numbers.\n\nThe reference key mechanism is what makes Solana Pay practico para commerce. By generating a unique keypair per transaccion y including its public key as a reference, the merchant can poll `getSignaturesForAddress(reference)` to detect when the payment arrives. This eliminates the need para webhooks or push notifications — the merchant simply polls until the reference appears in a confirmed transaccion, then verifies the transfer details match the expected payment.\n\n## Commerce operator rule\n\nThink in terms of order-state guarantees, not just payment detection:\n1. request created,\n2. payment observed,\n3. payment validated,\n4. fulfillment released.\n\nEach step needs explicit checks so fulfillment never races ahead of verification.\n\n## Checklist\n- Use `solana:` scheme (no double slashes)\n- Place the recipient base58 address directly after the colon\n- Encode label y message con encodeURIComponent\n- Use human-readable decimal amounts, not raw lamport values\n- Generate a unique reference keypair per payment para tracking\n\n## Red flags\n- Using `solana://` instead of `solana:`\n- Sending raw lamport amounts in the amount field\n- Forgetting to URL-encode label y message parameters\n- Reusing reference keys across multiple payments\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l1-q1",
                    "prompt": "What is the correct URL scheme para Solana Pay transfer requests?",
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
                    "prompt": "When should you use a transaccion request instead of a transfer request?",
                    "options": [
                      "When the payment requires multiple instrucciones or program interactions beyond a simple transfer",
                      "When the amount exceeds 100 SOL",
                      "When paying con native SOL instead of SPL tokens"
                    ],
                    "answerIndex": 0,
                    "explanation": "Transaccion requests allow the server to build arbitrarily complex transacciones. Transfer requests only support simple single-token transfers."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-transfer-anatomy": {
            "title": "Transfer request anatomy: recipient, amount, reference, y labels",
            "content": "# Transfer request anatomy: recipient, amount, reference, y labels\n\nA Solana Pay transfer request URL contains everything a cartera needs to construct y submit a payment transaccion. Each component of the URL serves a specific purpose in the payment flow. Understanding the anatomy of these requests — y how each field maps to on-chain behavior — is essential para building reliable commerce integrations.\n\nThe recipient address is the most critical field. It appears immediately after the `solana:` scheme y must be a valid base58-encoded Solana public key. Para native SOL transfers, this is the cartera address that will receive the SOL. Para SPL token transfers, this is the cartera address whose associated token cuenta (ATA) will receive the tokens. The cartera application is responsible para deriving the correct ATA from the recipient address y the SPL token mint. If the recipient's ATA does not exist, the cartera must create it as part of the transaccion (using `createAssociatedTokenAccountIdempotent`). A malformed or invalid recipient address will cause the cartera to reject the payment request entirely.\n\nThe amount parameter specifies how much to transfer in human-readable decimal form. Para native SOL, `amount=2.5` means 2.5 SOL (2,500,000,000 lamports internally). Para USDC (6 decimals), `amount=10.50` means 10.50 USDC (10,500,000 raw units). The cartera handles the conversion from decimal to raw units based on the token's decimal configuration. This diseno keeps the URL readable by humans y consistent across tokens con different decimal places. The amount must be a positive finite number — zero, negative, or infinite values are invalid.\n\nThe spl-token parameter distinguishes SOL transfers from SPL token transfers. When omitted, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token to transfer. Common examples include USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`), USDT (`Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx`), y any other SPL token. The cartera validates that the mint exists y that the sender has a sufficient balance before constructing the transaccion.\n\nThe reference parameter is what makes Solana Pay viable para real-time commerce. A reference is a base58-encoded public key that gets added as a non-signer cuenta in the transfer instruccion. After the transaccion confirms, anyone can call `getSignaturesForAddress(reference)` to find the transaccion containing this reference. The merchant generates a unique reference keypair para each payment request, encodes the public key in the URL, y then polls the Solana RPC to detect when a matching transaccion appears. Multiple references can be included by repeating the parameter: `reference=<key1>&reference=<key2>`. This is useful when multiple parties need to independently track the same payment.\n\nThe label parameter identifies the merchant or payment recipient. It appears in the cartera's confirmation dialog so the user knows who they are paying. Para example, `label=Sunrise%20Coffee` tells the user they are paying \"Sunrise Coffee.\" The label must be URL-encoded — spaces become `%20`, ampersands become `%26`, y other special characters use standard percent-encoding. Keeping labels concise (under 50 characters) ensures they display properly across different cartera implementations.\n\nThe message parameter provides additional context about the payment. It might include an order number, item description, or other merchant-specific information. Like the label, it must be URL-encoded. Example: `message=Order%20%23157%20-%202x%20Espresso`. Some carteras display the message in a secondary line below the label, while others may truncate long messages. The memo parameter (not to be confused con message) adds an on-chain memo instruccion to the transaccion, creating a permanent on-chain record. Use message para display purposes y memo para data that must be recorded on-chain.\n\nThe complete flow works as follows: (1) the merchant generates a unique reference keypair, (2) constructs the Solana Pay URL con all parameters, (3) encodes the URL into a QR code or deep link, (4) the customer scans/clicks y their cartera parses the URL, (5) the cartera constructs the transfer transaccion including the reference as a non-signer cuenta, (6) the customer approves y the cartera submits the transaccion, (7) the merchant polls `getSignaturesForAddress(reference)` until it finds the confirmed transaccion, (8) the merchant verifies the transaccion details match the expected payment.\n\n## Checklist\n- Validate recipient is a proper base58 public key (32-44 characters)\n- Use human-readable decimal amounts matching the token's precision\n- Generate a fresh reference keypair para every payment request\n- URL-encode label y message con encodeURIComponent\n- Include spl-token only when transferring SPL tokens, not native SOL\n\n## Red flags\n- Reusing the same reference across multiple payment requests\n- Providing amounts in raw lamports or smallest token units\n- Forgetting URL encoding on label or message (breaks parsing)\n- Not validating the recipient address format before URL construction\n",
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
                      "It is added as a non-signer cuenta, allowing getSignaturesForAddress to find the transaccion",
                      "It creates a webhook that notifies the merchant",
                      "It stores the payment ID in the transaccion memo"
                    ],
                    "answerIndex": 0,
                    "explanation": "The reference public key is included as a non-signer cuenta in the transfer instruccion. The merchant polls getSignaturesForAddress(reference) to detect when the payment transaccion confirms."
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
                    "explanation": "Solana Pay URLs use human-readable decimal amounts. The cartera handles the conversion to raw units based on the token's decimal configuration."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-url-explorer": {
            "title": "URL builder: live preview of Solana Pay URLs",
            "content": "# URL builder: live preview of Solana Pay URLs\n\nBuilding Solana Pay URLs correctly requires understanding how each parameter contributes to the final encoded string. In this leccion, we walk through the construction process step by step, examining how different combinations of parameters produce different URLs y how encoding rules affect the output.\n\nThe base URL always starts con the `solana:` scheme followed by the recipient address. There are no slashes, no host, no path segments — just the scheme colon y the base58 address. Para example: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. This alone is a valid Solana Pay URL, though it lacks an amount y would prompt the cartera to request the amount from the user.\n\nAdding query parameters transforms the base URL into a complete payment request. The first parameter is separated from the recipient by `?`, y subsequent parameters are separated by `&`. Parameter order does not affect validity, but convention places amount first para readability. A SOL transfer para 1.5 SOL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5`.\n\nAdding an SPL token changes the transfer type. Including `spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` tells the cartera this is a USDC transfer, not a SOL transfer. The amount is still in human-readable form — `amount=10` means 10 USDC, not 10 raw units. The cartera reads the mint's decimal configuration from the chain y converts accordingly.\n\nThe reference parameter enables payment detection. Each payment should include a unique reference public key. In practice, you generate a Keypair, extract its public key as a base58 string, y include it: `reference=Ref1111111111111111111111111111111111111111`. After the customer pays, you poll `getSignaturesForAddress` con this reference to find the transaccion. Multiple references can be included para multi-party tracking.\n\nURL encoding para labels y messages follows standard percent-encoding rules. The JavaScript function `encodeURIComponent` handles this correctly. Spaces become `%20`, the hash symbol becomes `%23`, ampersands become `%26`, y so on. Para example, a label \"Joe's Coffee & Tea\" encodes to `label=Joe's%20Coffee%20%26%20Tea`. Failing to encode these characters breaks the URL parser — an unencoded `&` in a label would be interpreted as a parameter separator, splitting the label y creating an invalid parameter.\n\nLet us trace through a complete example. A coffee shop wants to charge 4.25 USDC para order number 157. The shop's cartera address is `7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. They generate a reference key `Ref1111111111111111111111111111111111111111`. The resulting URL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=4.25&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111&label=Sunrise%20Coffee&message=Order%20%23157`.\n\nValidation before encoding catches errors early. Before building the URL, verify: the recipient is a valid base58 string of 32-44 characters, the amount is a positive finite number, the spl-token (if provided) is a valid base58 string, y the reference (if provided) is a valid base58 string. Emitting clear error messages para each validation failure helps developers debug integration issues quickly.\n\nEdge cases to handle: (1) amounts con many decimal places — truncate to the token's decimal precision, (2) empty or whitespace-only labels — omit the parameter entirely rather than including an empty value, (3) extremely long messages — some carteras truncate at 256 characters, (4) Unicode characters in labels — encodeURIComponent handles UTF-8 encoding correctly, but test con your target carteras.\n\n## Checklist\n- Start con `solana:` followed immediately by the recipient address\n- Use `?` before the first parameter y `&` between subsequent ones\n- Apply encodeURIComponent to label y message values\n- Validate all base58 fields before building the URL\n- Test generated URLs con multiple cartera implementations\n\n## Red flags\n- Including raw unencoded special characters in labels or messages\n- Building URLs con invalid or unvalidated recipient addresses\n- Using fixed reference keys instead of generating unique ones per payment\n- Omitting the spl-token parameter para SPL token transfers\n",
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
            "content": "# Challenge: Encode a Solana Pay transfer request URL\n\nBuild a function that encodes a Solana Pay transfer request URL from input parameters:\n\n- Validate the recipient address (must be 32-44 characters of valid base58)\n- Validate the amount (must be a positive finite number)\n- Construct the URL con the `solana:` scheme y query parameters\n- Apply encodeURIComponent to label y message fields\n- Include spl-token y reference only when provided\n- Return validation errors when inputs are invalid\n\nYour encoder must be fully deterministic — same input always produces the same URL.",
            "duration": "50 min",
            "hints": [
              "Solana Pay URL format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>",
              "Validate recipient: must be 32-44 characters of valid base58.",
              "Amount must be a positive finite number.",
              "Use encodeURIComponent para label y message to handle special characters."
            ]
          }
        }
      },
      "solanapay-v2-implementation": {
        "title": "Tracking & Commerce",
        "description": "Reference tracking state machines, confirmation UX, failure handling, y deterministic POS receipt generation.",
        "lessons": {
          "solanapay-v2-reference-tracker": {
            "title": "Challenge: Track payment references through confirmation states",
            "content": "# Challenge: Track payment references through confirmation states\n\nBuild a reference tracking state machine that processes payment events:\n\n- States flow: pending -> found -> confirmed -> finalized (or pending -> expired)\n- The \"found\" event transitions from pending y records the transaccion signature\n- The \"confirmation\" event increments the confirmation counter y transitions from found to confirmed\n- The \"finalized\" event transitions from confirmed to finalized\n- The \"timeout_check\" event expires the reference if still pending after expiryTimeout seconds\n- Record every state transition in a history array con from, to, y timestamp\n\nYour tracker must be fully deterministic — same event sequence always produces the same result.",
            "duration": "50 min",
            "hints": [
              "Track state transitions: pending -> found -> confirmed -> finalized.",
              "The 'found' event sets the signature. 'confirmation' increments the counter.",
              "Timeout check expires the reference if still pending after expiryTimeout seconds.",
              "Record each state change in the history array."
            ]
          },
          "solanapay-v2-confirmation-ux": {
            "title": "Confirmation UX: pending, confirmed, y expired states",
            "content": "# Confirmation UX: pending, confirmed, y expired states\n\nThe user experience during payment confirmation is the most critical moment in any Solana Pay integration. Between the customer scanning the QR code y the merchant acknowledging receipt, there is a window of uncertainty that must be managed con clear visual feedback, appropriate timeouts, y graceful error handling. Getting this right determines whether customers trust your payment system.\n\nThe confirmation lifecycle follows a well-defined state machine. After the QR code is displayed, the system enters the **pending** state — waiting para the customer to scan y submit the transaccion. The merchant's system continuously polls `getSignaturesForAddress(reference)` looking para a matching transaccion. When a signature appears, the system transitions to the **found** state. The transaccion has been submitted but may not yet be confirmed. The system then calls `getTransaction(signature)` to verify the payment details (recipient, amount, token) match the expected values. Once the transaccion reaches sufficient confirmations, the state moves to **confirmed**. After the transaccion is finalized (maximum commitment level, irreversible), the state reaches **finalized** y the merchant can safely release goods or services.\n\nEach state requires distinct visual treatment. In the **pending** state, display the QR code prominently con a scanning animation or subtle pulse effect. Show a countdown timer indicating how long the payment request remains valid (typically 2-5 minutes). Include the amount, token, y merchant name so the customer can verify before scanning. A \"Waiting para payment...\" message con a spinner keeps the customer informed.\n\nThe **found** state is brief but important. When the transaccion is detected, immediately replace the QR code con a checkmark or success animation. Display \"Payment detected — confirming...\" to signal progress. This instant visual feedback is critical — customers need to know their payment was received even before it confirms. Show the transaccion signature (abbreviated, e.g., \"sig: abc1...xyz9\") para reference. If you have a Solana Explorer link, provide it.\n\nThe **confirmed** state means the transaccion has at least one confirmation. Para low-value transacciones (coffee, small merchandise), this is sufficient to complete the sale. Display a prominent green checkmark, the confirmed amount, y the transaccion reference. Print or display a receipt. Para high-value transacciones, you may want to wait para finalized status before releasing goods.\n\nThe **finalized** state is the strongest guarantee — the transaccion is part of a rooted slot y cannot be reverted. This takes roughly 6-12 seconds after initial confirmation. Para most point-of-sale applications, waiting para finalized is unnecessary y adds friction. However, para digital goods delivery, API key provisioning, or any irreversible fulfillment, finalized is the safe threshold.\n\nThe **expired** state handles the timeout case. If no matching transaccion appears within the expiry window (e.g., 120 seconds), the payment request expires. Display \"Payment request expired\" con an option to generate a new QR code. Never silently expire — the customer may have just scanned y needs to know the request is no longer valid. The expiry timeout should be generous enough para the customer to open their cartera, review the transaccion, y approve it (60-120 seconds minimum).\n\nError states require careful messaging. \"Transaccion not found after timeout\" suggests the customer did not complete the payment. \"Transaccion found but details mismatch\" indicates a potential issue — the amount or recipient does not match expectations. \"Network error during polling\" should trigger automatic retries before displaying an error to the user. Always provide actionable next steps: \"Try again,\" \"Generate new QR,\" or \"Contact support.\"\n\nPolling strategy affects both UX responsiveness y RPC load. Start polling immediately after displaying the QR code. Use a 1-second interval para the first 30 seconds (fast detection), then slow to 2-3 seconds para the remainder of the window. After detecting the transaccion, switch to polling `getTransaction` con increasing commitment levels: processed -> confirmed -> finalized. Use exponential backoff if the RPC returns errors.\n\nAccessibility considerations para payment confirmation: (1) Do not rely solely on color to indicate state — use icons, text labels, y animations. (2) Provide audio feedback (a subtle chime on confirmation) para environments where the screen may not be visible. (3) Ensure the QR code has sufficient contrast y size para scanning from a reasonable distance (at least 300x300 pixels). (4) Support both light y dark themes para the confirmation UI.\n\n## Checklist\n- Show distinct visual states: pending, found, confirmed, finalized, expired\n- Display a countdown timer during the pending state\n- Provide instant visual feedback when the transaccion is detected\n- Implement appropriate expiry timeouts (60-120 seconds)\n- Offer actionable next steps on expiry or error\n\n## Red flags\n- No visual feedback between QR display y confirmation\n- Silent expiry without notifying the customer\n- Waiting para finalized on low-value point-of-sale transacciones\n- Polling too aggressively (every 100ms) y overloading the RPC\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l6-q1",
                    "prompt": "When is 'confirmed' commitment sufficient versus waiting para 'finalized'?",
                    "options": [
                      "Confirmed is sufficient para low-value POS transacciones; finalized is needed para irreversible digital fulfillment",
                      "Always wait para finalized regardless of transaccion value",
                      "Confirmed is never sufficient — always use finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Para coffee-shop-scale payments, confirmed commitment provides a strong enough guarantee. Finalized adds 6-12 seconds of latency y is only necessary when fulfillment is irreversible."
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
                    "explanation": "Expired requests should be clearly communicated. The customer may have been in the middle of approving — they need to know the request expired y can try again."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-error-handling": {
            "title": "Error handling y edge cases in payment flows",
            "content": "# Error handling y edge cases in payment flows\n\nProduction payment systems encounter a wide range of failure modes that must be handled gracefully. Solana Pay integrations face challenges unique to blockchain payments: network congestion, RPC failures, partial transaccion visibility, y edge cases around token cuentas. Building robust error handling separates demo-quality code from production-grade commerce systems.\n\nRPC connectivity failures are the most common operational issue. The merchant's polling loop depends on a reliable connection to a Solana RPC endpoint. When the RPC is unreachable (network outage, rate limiting, endpoint downtime), the polling loop must not crash or silently stop. Implement retry logic con exponential backoff: first retry after 500ms, second after 1 second, third after 2 seconds, capping at 5 seconds between retries. After 5 consecutive failures, display a degraded-mode warning to the operator (\"Network connectivity issue — payment detection may be delayed\") while continuing to retry in the background. Never abandon polling due to transient RPC errors.\n\nRate limiting from RPC providers is a specific failure mode. Free-tier RPC endpoints (including the public Solana RPC) enforce request limits. A polling loop that fires every second generates 60+ requests per minute per active payment session. If you have 10 concurrent payment sessions, that is 600+ requests per minute. Solutions: use a dedicated RPC provider con higher limits, batch reference checks where possible, implement client-side request deduplication, y cache negative results (reference not found) para a short window before re-checking.\n\nTransaccion mismatch errors occur when a transaccion is found via the reference but its details do not match expectations. This can happen if: (1) someone accidentally or maliciously sent a transaccion that includes the reference key but con wrong amounts, (2) the customer used a different cartera that interpreted the URL differently, or (3) there is a bug in the URL encoding that produced incorrect parameters. When a mismatch is detected, log the full transaccion details para debugging, display a clear error to the merchant (\"Payment detected but amount does not match — expected 10 USDC, received 5 USDC\"), y do not mark the payment as complete.\n\nInsufficient balance errors are caught by the customer's cartera before submission, but the merchant has no visibility into this. From the merchant's perspective, it looks like the customer scanned the QR but never submitted the transaccion. The timeout/expiry mechanism handles this case — after the expiry window passes, offer to regenerate the QR code. Consider displaying a message like \"If you are having trouble, please ensure you have sufficient balance.\"\n\nAssociated token cuenta (ATA) creation failures can occur when the customer's cartera does not automatically create the recipient's ATA para the SPL token being transferred. This is primarily a concern para less common SPL tokens where the recipient may not have an existing ATA. Modern carteras handle this by including a `createAssociatedTokenAccountIdempotent` instruccion, but older cartera versions may not. The merchant can mitigate this by pre-creating ATAs para all tokens they accept.\n\nDouble-payment detection is essential. If the polling loop detects two transacciones con the same reference, this indicates either a cartera bug or a user submitting the payment twice. The system should only process the first valid transaccion y flag any subsequent ones para manual review. Track processed references in a database to prevent duplicate fulfillment.\n\nNetwork congestion causes delayed transaccion confirmation. During high-traffic periods, transacciones may take 10-30 seconds to confirm instead of the usual 400ms-2 seconds. The payment UI should handle this gracefully: extend the visual \"confirming\" state, show a message like \"Network is busy — confirmation may take longer than usual,\" y never time out a transaccion that has been detected but not yet confirmed. The timeout should only apply to the initial pending state (waiting para any transaccion to appear), not to the confirmation stage.\n\nPartial visibility is a subtle edge case. Due to RPC node propagation delays, one RPC node may see a transaccion while another does not. If your system uses multiple RPC endpoints (para redundancy), you may detect a transaccion on one endpoint y fail to fetch its details from another. Solution: when a signature is found, retry `getTransaction` against the same endpoint that returned the signature, con retries y backoff, before falling back to alternative endpoints.\n\nMemo y metadata validation should verify that any on-chain memo matches the expected payment metadata. If the merchant includes a `memo` parameter in the Solana Pay URL, the confirmed transaccion should contain a corresponding memo instruccion. Mismatches may indicate URL tampering.\n\n## Checklist\n- Implement exponential backoff para RPC failures (500ms, 1s, 2s, 5s cap)\n- Verify transaccion details match expected payment parameters\n- Handle double-payment detection con reference deduplication\n- Distinguish between pending timeout y confirmation timeout\n- Pre-create ATAs para all accepted SPL tokens\n\n## Red flags\n- Crashing the polling loop on a single RPC error\n- Marking payments complete without verifying amount y recipient\n- Not handling network congestion gracefully (premature timeout)\n- Ignoring double-payment scenarios\n",
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
                    "output": "TX1: sig aaa...111 (processed) | TX2: sig bbb...222 (DUPLICATE — flagged)\nOnly first valid transaccion fulfills the order",
                    "note": "Track processed references to prevent double fulfillment"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-pos-receipt": {
            "title": "Checkpoint: Generate a POS receipt",
            "content": "# Checkpoint: Generate a POS receipt\n\nBuild the final POS receipt generator that combines all curso concepts:\n\n- Reconstruct the Solana Pay URL from payment data (recipient, amount, spl-token, reference, label)\n- Generate a deterministic receipt ID from the reference suffix y timestamp\n- Determine currency type: \"SPL\" if splToken is present, otherwise \"SOL\"\n- Include merchant name from the payment label\n- Include the tracking status from the reference tracker\n- Output must be stable JSON con deterministic key ordering\n\nThis checkpoint validates your complete understanding of Solana Pay commerce integration.",
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
    "title": "Cartera UX Engineering",
    "description": "Master production cartera UX engineering on Solana: deterministic connection state, network safety, RPC resilience, y measurable reliability patterns.",
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
        "description": "Cartera connection diseno, network gating, y deterministic state-machine architecture para predictable onboarding y reconnect paths.",
        "lessons": {
          "walletux-v2-connection-design": {
            "title": "Connection UX that doesn't suck: a diseno checklist",
            "content": "# Connection UX that doesn't suck: a diseno checklist\n\nCartera connection is the first interaction a user has con any Solana dApp. If this experience is slow, confusing, or error-prone, most users will leave before they ever reach your core product. Connection UX deserves the same engineering rigor as any critical user flow, yet most teams treat it as an afterthought. This leccion establishes the diseno patterns, failure modes, y recovery strategies that separate professional cartera integration from broken prototypes.\n\n## The connection lifecycle\n\nA cartera connection progresses through a predictable sequence: idle (no cartera detected), detecting (scanning para installed adapters), ready (adapter found, user has not yet approved), connecting (approval dialog shown, waiting para user action), connected (public key received, session active), y disconnected (user or app terminated the session). Each state must have a distinct visual representation so users always know what is happening y what they need to do next.\n\nAuto-connect is the single most impactful UX optimization. When a user has previously connected a specific cartera, the dApp should attempt to reconnect silently on page load without showing a cartera selection modal. The Solana cartera adapter standard supports this via the `autoConnect` flag. However, auto-connect must be gated: only attempt it if the user previously granted permission (stored in localStorage), y set a timeout of 3-5 seconds. If auto-connect fails silently, fall back to showing the connect button without an error message. Users should never see an error para a background reconnection attempt they did not initiate.\n\n## Loading states y skeleton UI\n\nDuring the connecting phase, display a skeleton version of the cartera-dependent UI rather than a blank screen or spinner. If your app shows a token balance after connection, render a shimmer placeholder in that exact layout position. This technique, called \"optimistic layout reservation,\" prevents jarring content shifts when the connection resolves. The connect button itself should transition to a loading state (disabled, con a subtle animation) to prevent double-click issues.\n\nConnection timeouts need explicit handling. If the cartera adapter does not respond within 10 seconds, assume the user closed the approval dialog or the cartera extension is unresponsive. Transition to an error state con a clear message: \"Connection timed out. Please try again or check your cartera extension.\" Never leave the UI in an indefinite loading state. Implement a deterministic timeout using setTimeout y clear it if the connection resolves.\n\n## Error recovery patterns\n\nConnection errors fall into three categories: user-rejected (the user clicked \"Cancel\" in the cartera dialog), adapter errors (the cartera extension crashed or is not installed), y network errors (the RPC endpoint is unreachable after connection). Each category requires a different recovery path.\n\nUser-rejected connections should return to the idle state quietly. Do not show an error toast or modal para a deliberate user action. Simply reset the connect button to its default state. If you want to provide a nudge, a subtle inline message like \"Connect your cartera to continue\" is sufficient.\n\nAdapter errors require actionable guidance. If no cartera is detected, show a \"Get a Cartera\" link that opens the Phantom or Solflare installation page. If the adapter throws an unexpected error, display the error message con a \"Try Again\" button. Log the error details to your analytics system para debugging, but keep the user-facing message simple.\n\nNetwork errors after connection are particularly tricky because the cartera is technically connected (you have the public key) but the app cannot fetch on-chain data. Display a degraded state: show the connected cartera address con a warning badge, disable transaccion buttons, y provide a \"Check Connection\" button that re-tests the RPC endpoint. Do not disconnect the cartera just because the RPC is temporarily unreachable.\n\n## Multi-cartera support\n\nModern Solana dApps must support multiple cartera adapters. The cartera selection modal should display installed carteras prominently (con a green \"Detected\" badge) y list popular uninstalled carteras below con \"Install\" links. Sort installed carteras by most recently used. Remember the user's last cartera choice y pre-select it on subsequent visits.\n\nWhen the user switches carteras (disconnects one, connects another), all cached data tied to the previous cartera address must be invalidated. Token balances, transaccion history, y program-derived cuenta states are all cartera-specific. Failing to clear this cache causes data leakage between cuentas, which is both a UX bug y a potential seguridad issue.\n\n## The checklist\n\n- Implement auto-connect con a 3-5 second timeout para returning users\n- Show skeleton UI during the connecting phase to prevent layout shift\n- Set a 10-second hard timeout on connection attempts\n- Handle user-rejected connections silently (no error state)\n- Provide \"Get a Cartera\" links when no adapter is detected\n- Display degraded UI (not disconnect) when RPC fails post-connection\n- Invalidate all cartera-specific caches on cuenta switch\n- Remember the user's preferred cartera adapter between sessions\n- Disable transaccion buttons during connecting y error states\n- Log connection errors to analytics para monitoring adapter reliability\n\n## Reliability principle\n\nCartera UX is reliability UX. Users judge trust by whether connect, reconnect, y recovery behave predictably under stress, not by visual polish alone.\n",
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
                      "Redirect the user to a cartera installation page"
                    ],
                    "answerIndex": 0,
                    "explanation": "Auto-connect is a background optimization. If it fails, the user never initiated the action, so showing an error would be confusing. Simply display the default connect button."
                  },
                  {
                    "id": "walletux-v2-l1-q2",
                    "prompt": "Why should you show skeleton UI during the connecting phase?",
                    "options": [
                      "It prevents layout shift y sets expectations para where content will appear",
                      "It makes the page load faster",
                      "It is required by the Solana cartera adapter standard"
                    ],
                    "answerIndex": 0,
                    "explanation": "Skeleton UI reserves the layout space para cartera-dependent content, preventing jarring shifts when the connection resolves y data loads."
                  }
                ]
              }
            ]
          },
          "walletux-v2-network-gating": {
            "title": "Network gating y wrong-network recovery",
            "content": "# Network gating y wrong-network recovery\n\nSolana has multiple clusters: mainnet-beta, devnet, testnet, y localnet. Unlike EVM chains where the cartera controls the network y emits chain-change events, Solana's network selection is typically controlled by the dApp, not the cartera. This architectural difference creates a unique set of UX challenges around network mismatch, gating, y recovery.\n\n## The network mismatch problem\n\nWhen a dApp targets mainnet-beta but a user's cartera or the app's RPC endpoint points to devnet, transacciones will fail silently or produce confusing results. Cuenta addresses are the same across clusters, but cuenta state differs entirely. A token cuenta that holds 1000 USDC on mainnet might not exist on devnet. If your app fetches the balance from devnet while the user expects mainnet, they see zero balance y assume the app is broken or their funds are gone.\n\nNetwork mismatch is not always obvious. The cartera might report a successful signature, but the transaccion was submitted to a different cluster than the one your app is reading from. This creates phantom transacciones: the user sees \"Transaccion confirmed\" but no state change in the UI. Debugging this requires checking which cluster the transaccion was submitted to versus which cluster the app is polling.\n\n## Detecting the current network\n\nThe primary detection method is to check your RPC endpoint's genesis hash. Each Solana cluster has a unique genesis hash. Call `getGenesisHash()` on your connection y compare it to known values: mainnet-beta's genesis hash is `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`, devnet is `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`, y testnet is `4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY`. If the genesis hash does not match your expected cluster, the RPC endpoint is misconfigured.\n\nPara cartera-side detection, some cartera adapters expose network information, but this is not standardized. The most reliable approach is to perform a lightweight RPC call (getGenesisHash or getEpochInfo) immediately after connection y compare the response against your expected cluster configuration.\n\n## Network gating patterns\n\nNetwork gating prevents users from performing actions on the wrong network. There are two levels of gating: soft gating y hard gating.\n\nSoft gating shows a warning banner but allows the user to continue. This is appropriate para development tools, block explorers, y apps that intentionally support multiple clusters. The banner should clearly state the current network, use color coding (green para mainnet, yellow para devnet, red para testnet/localnet), y be persistent (not dismissible) so the user always sees it.\n\nHard gating blocks all interactions until the network matches the expected cluster. This is appropriate para production DeFi applications where operating on the wrong network could cause real financial loss. Hard gating should display a full-screen overlay or modal con a clear message: \"This app requires Mainnet Beta. Your connection is currently pointing to Devnet.\" Include a button to switch the RPC endpoint if your app supports runtime endpoint switching.\n\n## Recovery strategies\n\nWhen a network mismatch is detected, the recovery flow depends on who controls the network selection. In most Solana dApps, the app controls the RPC endpoint, so recovery means updating the app's connection object to point to the correct cluster. This can be done automatically (if the correct endpoint is known) or manually (presenting the user con a network selector).\n\nIf recovery requires the user to change their cartera's network setting (less common on Solana but possible con some carteras), provide step-by-step instrucciones specific to the detected cartera adapter. Para Phantom: \"Open Phantom > Settings > Developer Settings > Change Network.\" Include screenshots or a link to the cartera's documentation.\n\nAfter network switching, all cached data must be invalidated. Cuenta states, token balances, transaccion history, y program-derived addresses may differ across clusters. Implement a `networkChanged` event handler that: clears all cached RPC responses, resets the connection state machine, re-fetches critical cuenta data, y updates the UI to reflect the new network.\n\n## Multi-network development workflow\n\nPara developers building on Solana, supporting seamless network switching during development is essential. Store the selected network in localStorage so it persists across page reloads. Provide a developer-only network switcher (hidden behind a feature flag or only visible in non-production builds) that allows quick toggling between mainnet, devnet, y localnet.\n\nWhen switching networks programmatically, create a new Connection object rather than mutating the existing one. This prevents race conditions where in-flight requests on the old network collide con new requests on the new network. The connection switch should be atomic: update the connection reference, clear all caches, y trigger a full data refresh in a single synchronous operation.\n\n## Checklist\n- Check genesis hash immediately after RPC connection to verify the cluster\n- Use color-coded persistent banners to indicate the current network\n- Hard-gate production DeFi apps to the expected cluster\n- Invalidate all caches when the network changes\n- Create new Connection objects instead of mutating existing ones\n- Store network preference in localStorage para persistence\n- Provide cartera-specific instrucciones para network switching\n\n## Red flags\n- Allowing transacciones on the wrong network without any warning\n- Caching data across network switches (stale cross-network data)\n- Mutating the Connection object during network switch (race conditions)\n- Assuming cartera y dApp are always on the same cluster\n",
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
                      "Call getGenesisHash() y compare against known cluster genesis hashes",
                      "Check the URL string para 'mainnet' or 'devnet'",
                      "Ask the cartera adapter which network it is using"
                    ],
                    "answerIndex": 0,
                    "explanation": "Each Solana cluster has a unique genesis hash. Comparing the RPC's genesis hash against known values is the only reliable detection method, since URL strings can be misleading y carteras don't always expose network info."
                  },
                  {
                    "id": "walletux-v2-l2-q2",
                    "prompt": "What must happen to cached data when the network changes?",
                    "options": [
                      "All cached data must be invalidated because cuenta states differ across clusters",
                      "Only token balances need to be refreshed",
                      "Cached data can be retained since addresses are the same across clusters"
                    ],
                    "answerIndex": 0,
                    "explanation": "While cuenta addresses are identical across clusters, the cuenta states (balances, data, existence) are completely different. All cached RPC data must be cleared on network switch."
                  }
                ]
              }
            ]
          },
          "walletux-v2-state-explorer": {
            "title": "Connection state machine: states, events, y transitions",
            "content": "# Connection state machine: states, events, y transitions\n\nCartera connection logic in most dApps is implemented as a tangle of boolean flags, useEffect hooks, y conditional renders. This approach leads to impossible states (loading Y error simultaneously), missed transitions (forgetting to clear the error when retrying), y race conditions (two connection attempts running in parallel). A finite state machine (FSM) eliminates these problems by making every possible state y transition explicit.\n\n## Why state machines para cartera connections\n\nA state machine defines a finite set of states, a finite set of events, y a deterministic transition function that maps (currentState, event) to nextState. At any point in time, the system is in exactly one state. This guarantees that impossible combinations (connected Y disconnected) cannot occur. Every event is either handled by the current state or explicitly rejected, eliminating silent failures.\n\nPara cartera connections, the core states are: `disconnected` (no active session), `connecting` (waiting para cartera approval or RPC confirmation), `connected` (session active, public key available), y `error` (something went wrong). Each state maps to a specific UI presentation, specific allowed user actions, y specific side effects.\n\n## Defining the transition table\n\nThe transition table is the heart of the state machine. It specifies which events are valid in which states y what the resulting state should be:\n\n```\ndisconnected + CONNECT       → connecting\nconnecting   + CONNECTED     → connected\nconnecting   + CONNECTION_ERROR → error\nconnecting   + TIMEOUT       → error\nconnected    + DISCONNECT    → disconnected\nconnected    + NETWORK_CHANGE → connected (with updated network)\nconnected    + ACCOUNT_CHANGE → connected (with updated address)\nconnected    + CONNECTION_LOST → error\nerror        + RETRY         → connecting\nerror        + DISCONNECT    → disconnected\n```\n\nAny event not listed para a given state is invalid. Invalid events should transition to the error state con a descriptive message rather than being silently ignored. This makes debugging straightforward: every unexpected event is captured y logged.\n\n## Side effects y context\n\nState transitions carry context (also called \"extended state\" or \"context\"). The connection state machine tracks: `walletAddress` (set on CONNECTED y ACCOUNT_CHANGE events), `network` (set on CONNECTED y NETWORK_CHANGE events), `errorMessage` (set when entering the error state), y `transitions` (a log of all state transitions para debugging).\n\nSide effects are actions triggered by transitions, not by states. Para example, the transition from `connecting` to `connected` should trigger: fetching the initial cuenta balance, subscribing to cuenta change notifications, y logging the connection event to analytics. The transition from `connected` to `disconnected` should trigger: clearing all cached data, unsubscribing from notifications, y resetting the UI to the idle layout.\n\n## Implementation patterns\n\nIn React applications, the state machine can be implemented using `useReducer` con the transition table as the reducer logic. The reducer receives the current state y an event (action), looks up the transition in the table, y returns the new state con updated context. This approach is testable (pure function), predictable (no side effects in the reducer), y composable (multiple components can read the state without duplicating logic).\n\nPara more complex scenarios, libraries like XState provide first-class support para statecharts (hierarchical state machines con guards, actions, y services). XState's visualizer can render the state machine as a diagram, making it easy to verify that all states y transitions are covered. However, para cartera connection logic, a simple transition table in a useReducer is usually sufficient.\n\nThe transition history array is invaluable para debugging. When a user reports a connection issue, the transition log shows exactly what happened: which events fired, in what order, y what states resulted. This is far more useful than a single boolean flag or an error message captured at an arbitrary point.\n\n## Pruebas state machines\n\nState machines are inherently testable because they are pure functions. Given a starting state y a sequence of events, the output is completely deterministic. Test cases should cover: the happy path (disconnected → connecting → connected), error recovery (connecting → error → retry → connecting → connected), cuenta switching (connected → ACCOUNT_CHANGE → connected con new address), y invalid events (connected + CONNECT should transition to error, not silently ignored).\n\nEdge cases to test: rapid event sequences (CONNECT followed immediately by DISCONNECT before the connection resolves), duplicate events (two CONNECTED events in a row), y state persistence (does the machine correctly restore state from localStorage on page reload?).\n\n## Checklist\n- Define all states explicitly: disconnected, connecting, connected, error\n- Map every valid (state, event) pair to a next state\n- Handle invalid events by transitioning to error con a descriptive message\n- Track transition history para debugging\n- Implement the state machine as a pure reducer function\n- Clear context data (cartera address, network) on disconnect\n- Clear error message on retry\n",
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
                    "note": "Cartera approved, session active"
                  },
                  {
                    "cmd": "Event: ACCOUNT_CHANGE { walletAddress: '9pQR...' }",
                    "output": "connected → connected | address=9pQR... | network=mainnet-beta",
                    "note": "User switched cuentas, address updated, network retained"
                  },
                  {
                    "cmd": "Event: CONNECTION_LOST { message: 'WebSocket closed' }",
                    "output": "connected → error | errorMessage='WebSocket closed'",
                    "note": "Connection dropped, show error con retry option"
                  },
                  {
                    "cmd": "Event: RETRY",
                    "output": "error → connecting | errorMessage=null",
                    "note": "User clicks retry, clear error y reconnect"
                  }
                ]
              }
            ]
          },
          "walletux-v2-connection-state": {
            "title": "Challenge: Implement cartera connection state machine",
            "content": "# Challenge: Implement cartera connection state machine\n\nBuild a deterministic state machine para cartera connection management:\n\n- States: disconnected, connecting, connected, error\n- Process a sequence of events y track all state transitions\n- CONNECTED y ACCOUNT_CHANGE events carry a walletAddress; CONNECTED y NETWORK_CHANGE carry a network\n- Error state stores the error message; disconnected clears all session data\n- Invalid events force transition to error state con a descriptive message\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "50 min",
            "hints": [
              "Define a TRANSITIONS map: each state maps event types to next states.",
              "CONNECTED y ACCOUNT_CHANGE events carry walletAddress. CONNECTED y NETWORK_CHANGE carry network.",
              "Error state stores the error message. Disconnected clears all session data.",
              "Invalid events force transition to error state con descriptive message."
            ]
          }
        }
      },
      "walletux-v2-production": {
        "title": "Production Patterns",
        "description": "Cache invalidation, RPC resilience y health monitoring, y measurable cartera UX quality reporting para production operations.",
        "lessons": {
          "walletux-v2-cache-invalidation": {
            "title": "Challenge: Cache invalidation on cartera events",
            "content": "# Challenge: Cache invalidation on cartera events\n\nBuild a cache invalidation engine that processes cartera events y invalidates the correct cache entries:\n\n- Cache entries have tags: \"cuenta\" (cartera-specific data), \"network\" (cluster-specific data), \"global\" (persists across everything)\n- ACCOUNT_CHANGE invalidates all entries tagged \"cuenta\"\n- NETWORK_CHANGE invalidates entries tagged \"network\" Y \"cuenta\" (network change means all cuenta data is stale)\n- DISCONNECT invalidates all non-\"global\" entries\n- Track per-event invalidation counts in an event log\n- Return the final cache state, total invalidated count, y retained count\n\nThe invalidation logic must be deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "ACCOUNT_CHANGE invalidates entries tagged 'cuenta'.",
              "NETWORK_CHANGE invalidates both 'network' y 'cuenta' tagged entries.",
              "DISCONNECT invalidates all non-'global' entries.",
              "Track invalidation counts per event in the event log."
            ]
          },
          "walletux-v2-rpc-caching": {
            "title": "RPC reads y caching strategy para cartera apps",
            "content": "# RPC reads y caching strategy para cartera apps\n\nEvery interaction in a Solana cartera application ultimately depends on RPC calls: fetching balances, loading token cuentas, reading program state, y confirming transacciones. Without a caching strategy, your app hammers the RPC endpoint con redundant requests, drains rate limits, y delivers a sluggish user experience. A well-designed cache layer transforms cartera apps from painfully slow to instantly responsive while keeping data fresh enough para financial accuracy.\n\n## The RPC cost problem\n\nSolana RPC calls are not free. Public endpoints like those provided by Solana Foundation have aggressive rate limits (typically 40 requests per 10 seconds para free tiers). Premium providers (Helius, QuickNode, Triton) charge per request or by compute units consumed. A naive cartera app that re-fetches every piece of data on every render can easily exceed 100 requests per minute para a single user. Multiply by thousands of concurrent users y costs become significant.\n\nBeyond cost, latency kills UX. A `getTokenAccountsByOwner` call takes 200-800ms depending on the endpoint y cuenta complexity. If the user switches tabs y returns, re-fetching everything from scratch creates a noticeable loading delay. Caching eliminates this delay para data that has not changed.\n\n## Cache taxonomy\n\nNot all RPC data has the same freshness requirements. Categorize cache entries by their volatility:\n\n**Immutable data** (cache indefinitely): mint metadata (name, symbol, decimals, logo URI), program cuenta structures, y historical transaccion details. Once fetched, this data never changes. Store it in an in-memory Map con no expiration.\n\n**Semi-stable data** (cache para 30-60 seconds): token balances, staking positions, gobernanza votes, y NFT ownership. This data changes infrequently para most users. A 30-second TTL (time to live) provides a good balance between freshness y efficiency. Use a cache key that includes the cartera address y network to prevent cross-cuenta contamination.\n\n**Volatile data** (cache para 5-10 seconds or not at all): recent transaccion confirmations, real-time price feeds, y active swap quotes. This data changes constantly y becomes stale quickly. Short TTLs or no caching at all is appropriate. Para transaccion confirmations, use WebSocket subscriptions instead of polling.\n\n## Cache key diseno\n\nCache keys must uniquely identify the request parameters Y the context. A good cache key para a balance query includes: the RPC method name, the cuenta address, the commitment level, y the network cluster. Para example: `getBalance:7xKXp...abc:confirmed:mainnet-beta`. Including the network in the key prevents a critical bug: returning devnet data when the user has switched to mainnet.\n\nPara `getTokenAccountsByOwner`, the key should include the owner address y the program filter (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID). Different token programs return different cuenta sets, y caching them under the same key returns incorrect results.\n\n## Invalidation triggers\n\nCache invalidation is triggered by three cartera events: cuenta change, network change, y disconnect. These events were covered in the previous challenge, but the caching layer adds nuance.\n\nCuenta change invalidates all entries keyed by the cartera address. Token balances, transaccion history, y program-derived cuenta states are all cartera-specific. Global data (mint metadata, program IDL) survives an cuenta change.\n\nNetwork change invalidates everything except truly global, network-independent data (UI preferences, theme settings). Even mint metadata should be invalidated because a mint address might exist on mainnet but not on devnet, or have different state.\n\nUser-initiated refresh is the escape hatch. Provide a \"Refresh\" button that clears the entire cache y re-fetches all visible data. Users expect this when they know an external action (a transfer from another device) has changed their state but the cache has not expired yet.\n\n## Stale-while-revalidate pattern\n\nThe most effective caching strategy para cartera apps is stale-while-revalidate (SWR). When a cache entry is requested: if fresh (within TTL), return it immediately. If stale (past TTL but within a grace period, e.g., 2x TTL), return the stale value immediately Y trigger a background re-fetch. When the re-fetch completes, update the cache y notify the UI. If expired (past grace period), block y re-fetch before returning.\n\nThis pattern ensures the UI always responds instantly con the best available data while keeping it fresh in the background. Libraries like SWR (para React) y TanStack Query implement this pattern out of the box con configurable TTL, grace periods, y background refetch intervals.\n\n## Checklist\n- Categorize RPC data by volatility: immutable, semi-stable, volatile\n- Include cartera address y network in all cache keys\n- Invalidate cuenta-tagged caches on cartera switch\n- Invalidate all non-global caches on network switch\n- Implement stale-while-revalidate para semi-stable data\n- Provide a manual refresh button as an escape hatch\n- Monitor cache hit rates to validate your TTL configuration\n\n## Red flags\n- Caching without network in the key (cross-network data leakage)\n- Not invalidating on cuenta switch (showing previous cartera's data)\n- Setting TTLs too long para financial data (stale balance display)\n- Re-fetching everything on every render (defeats the purpose of caching)\n",
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
                      "Cuenta states differ across clusters, so cached devnet data would be wrong para mainnet",
                      "Cache keys must be globally unique para rendimiento",
                      "The Solana RPC protocol requires cluster identification"
                    ],
                    "answerIndex": 0,
                    "explanation": "The same cuenta address can have completely different state on mainnet vs devnet. Without the network in the key, switching clusters would return stale data from the previous cluster."
                  },
                  {
                    "id": "walletux-v2-l6-q2",
                    "prompt": "What does the stale-while-revalidate pattern do when a cache entry is past its TTL?",
                    "options": [
                      "Returns the stale value immediately y triggers a background re-fetch",
                      "Blocks until fresh data is fetched from the RPC",
                      "Deletes the stale entry y returns null"
                    ],
                    "answerIndex": 0,
                    "explanation": "SWR prioritizes responsiveness by serving stale data instantly while refreshing in the background. This eliminates loading states para data that has only slightly exceeded its TTL."
                  }
                ]
              }
            ]
          },
          "walletux-v2-rpc-health": {
            "title": "RPC health monitoring y graceful degradation",
            "content": "# RPC health monitoring y graceful degradation\n\nRPC endpoints are the lifeline of every Solana cartera application. When they go down, become slow, or return stale data, your app becomes unusable. Production cartera apps must continuously monitor RPC health y degrade gracefully when issues are detected, rather than showing cryptic errors or silently displaying stale data. This leccion covers the engineering patterns para building resilient RPC connectivity.\n\n## Why RPC endpoints fail\n\nSolana RPC endpoints experience several failure modes. Rate limiting is the most common: free-tier endpoints enforce strict per-IP y per-second limits, y exceeding them results in HTTP 429 responses. Latency spikes occur during high network activity (NFT mints, token launches) when validadores are under heavy load y RPC nodes queue requests. Stale data happens when an RPC node falls behind the cluster's tip slot, returning cuenta states that are several slots (or seconds) old. Complete outages, while rare para premium providers, do happen y can last minutes to hours.\n\nEach failure mode requires a different response. Rate limiting needs request throttling y backoff. Latency spikes need timeout management y user communication. Stale data needs detection y provider rotation. Complete outages need failover to a backup endpoint.\n\n## Health check implementation\n\nImplement a periodic health check that runs every 15-30 seconds while the app is active. The health check should measure three metrics: latency (round-trip time para a `getSlot` call), freshness (compare the returned slot against the expected tip slot from a secondary source or the previous check), y error rate (percentage of failed requests in the last N calls).\n\nA healthy endpoint has latency under 500ms, slot freshness within 5 slots of the expected tip, y an error rate below 5%. An unhealthy endpoint has latency over 2000ms, slot freshness more than 50 slots behind, or an error rate above 20%. The intermedio range (degraded) triggers warnings without failover.\n\nStore health check results in a rolling window (last 10-20 checks). A single slow response should not trigger failover, but 3 consecutive slow responses should. This smoothing prevents flapping between endpoints due to transient network issues.\n\n## Failover strategies\n\nPrimary-secondary failover is the simplest pattern. Configure a primary RPC endpoint (your preferred provider) y one or more secondaries (different providers para diversity). When the primary becomes unhealthy, route all requests to the secondary. Periodically re-check the primary (every 60 seconds) y switch back when it recovers. This prevents all your traffic from permanently migrating to the secondary.\n\nRound-robin con health weighting distributes requests across multiple endpoints based on their current health scores. A healthy endpoint gets a weight of 1.0, a degraded endpoint gets 0.3, y an unhealthy endpoint gets 0.0. This approach provides better throughput than single-endpoint strategies y automatically adapts to changing conditions.\n\nPara critical transacciones (swaps, transfers), always use the endpoint con the lowest latency Y highest freshness. Transaccion submission is latency-sensitive: a stale blockhash from a behind-the-tip node will cause the transaccion to be rejected. Para read operations (balance queries), slightly stale data is acceptable if it means faster responses.\n\n## Graceful degradation in the UI\n\nWhen RPC health degrades, the UI should communicate the situation clearly without panic. Display a small status indicator (green dot, yellow dot, red dot) near the network name or in the status bar. Clicking it should show detailed health information: current latency, last successful request time, y the number of failed requests.\n\nDuring degraded mode, disable or add warnings to transaccion buttons. A yellow warning like \"Network may be slow — transacciones might take longer than usual\" is better than letting users submit transacciones that will likely time out. During a full outage, disable all transaccion features y show a clear message: \"Unable to reach the Solana network. Your funds are safe. We'll reconnect automatically.\"\n\nNever hide the degradation. Users who submit transacciones during an outage y see \"Transaccion failed\" without explanation will assume their funds are at risk. Proactive communication (\"The network is experiencing delays\") builds trust even when the experience is suboptimal.\n\n## Request retry y throttling\n\nWhen an RPC request fails, classify the error before deciding whether to retry. HTTP 429 (rate limited): back off exponentially starting at 1 second, retry up to 3 times. HTTP 5xx (server error): retry once after 2 seconds, then failover to secondary endpoint. Network timeout: retry once con a shorter timeout (the request may have succeeded but the response was lost), then failover. HTTP 4xx (client error): do not retry, the request is malformed.\n\nImplement a request queue con concurrency limits. Most RPC providers allow 10-40 concurrent requests. If your app tries to fire 50 requests simultaneously (common during initial data loading), queue the excess y process them as earlier requests complete. This prevents self-inflicted rate limiting.\n\nDebounce user-triggered requests. If the user rapidly clicks \"Refresh\" or types in a search field that triggers RPC lookups, debounce the requests to at most one per 500ms. This is simple to implement y dramatically reduces unnecessary RPC traffic.\n\n## Monitoring y alerting\n\nLog all RPC metrics to your observability system: request count, error count, latency percentiles (p50, p95, p99), y cache hit rate. Set alerts para: error rate exceeding 10% over 5 minutes, p95 latency exceeding 3 seconds, y cache hit rate dropping below 50% (indicates a cache invalidation bug or a change in access patterns).\n\nTrack per-endpoint metrics separately. If your primary endpoint's error rate spikes while the secondary is healthy, the failover logic should handle it automatically. But if both endpoints degrade simultaneously, it likely indicates a Solana network-wide issue rather than a provider problem, y the alerting should reflect that distinction.\n\n## Checklist\n- Run health checks every 15-30 seconds measuring latency, freshness, y error rate\n- Implement primary-secondary failover con automatic recovery\n- Display RPC health status in the UI (green/yellow/red indicator)\n- Disable transaccion features during outages con clear messaging\n- Classify errors before retrying (429 vs 5xx vs 4xx)\n- Implement request queue con concurrency limits\n- Debounce user-triggered RPC requests\n- Monitor y alert on error rate, latency, y cache hit rate\n\n## Red flags\n- No failover endpoints (single point of failure)\n- Retrying 4xx errors (wastes requests on malformed input)\n- Hiding RPC failures from the user (builds distrust)\n- No concurrency limits (self-inflicted rate limiting)\n",
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
            "title": "Checkpoint: Generate a Cartera UX Report",
            "content": "# Checkpoint: Generate a Cartera UX Report\n\nBuild the final cartera UX quality report that combines all curso concepts:\n\n- Count connection attempts (CONNECT events) y successful connections (CONNECTED events)\n- Calculate success rate as a percentage con 2 decimal places\n- Compute average connection time from CONNECTED events' durationMs\n- Count ACCOUNT_CHANGE y NETWORK_CHANGE events\n- Calculate cache hit rate from cacheStats (hits / total * 100, 2 decimal places)\n- Calculate RPC health score from rpcChecks (healthy / total * 100, 2 decimal places)\n- Include the timestamp from input\n\nThis checkpoint validates your complete understanding of cartera UX engineering.",
            "duration": "55 min",
            "hints": [
              "Count CONNECT events para attempts, CONNECTED para successes.",
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
    "description": "Master production SIWS authentication on Solana: standardized inputs, strict verification invariants, replay-resistant nonce lifecycle, y audit-ready reporting.",
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
        "description": "SIWS rationale, strict input-field semantics, cartera rendering behavior, y deterministic sign-in input construction.",
        "lessons": {
          "siws-v2-why-exists": {
            "title": "Why SIWS exists: replacing connect-y-signMessage",
            "content": "# Why SIWS exists: replacing connect-y-signMessage\n\nBefore Sign-In Con Solana (SIWS) became a standard, dApps authenticated cartera holders using a two-step pattern: connect the cartera, then call `signMessage` con an arbitrary string. The user would see a raw byte blob in their cartera's approval screen, sign it, y the server would verify the signature against the expected public key. This worked, but it was fragile, inconsistent, y dangerous.\n\n## The problems con raw signMessage\n\nThe fundamental issue con raw `signMessage` authentication is that carteras cannot distinguish between a benign sign-in request y a malicious payload. When a cartera displays \"Sign this message: 0x48656c6c6f\" or even a human-readable string like \"Please sign in to example.com at 2024-01-15T10:30:00Z,\" the cartera has no structured way to parse, validate, or warn about the content. The user must trust that the dApp is honest about what it is asking them to sign.\n\nThis creates several attack vectors. A malicious dApp could present a sign-in prompt that actually contains a serialized transaccion. If the cartera treats `signMessage` payloads as opaque bytes (which most do), the user signs what they believe is a login but is actually an authorization para a token transfer. Even without outright fraud, the lack of structure means different dApps format their sign-in messages differently. Users see inconsistent approval screens across applications, eroding trust y making it harder to identify legitimate requests.\n\nReplay attacks are another critical weakness. If a dApp asks the user to sign \"Log in to example.com\" without a nonce or timestamp, the resulting signature is valid forever. An attacker who intercepts this signature (via a compromised server log, a man-in-the-middle proxy, or a leaked database) can replay it indefinitely to impersonate the user. Adding a nonce or timestamp to the message helps, but without a standard format, each dApp implements its own scheme — some correctly, many not.\n\n## What SIWS standardizes\n\nSign-In Con Solana defines a structured message format that carteras can parse, validate, y display in a human-readable, predictable way. The SIWS standard specifies exactly which fields a sign-in request must contain y how carteras should render them. This moves authentication from an opaque byte-signing operation to a semantically meaningful, cartera-aware protocol.\n\nThe core fields of a SIWS sign-in input are: **domain** (the requesting site's origin, displayed prominently by the cartera), **address** (the expected signer's public key), **nonce** (a unique, server-generated value that prevents replay attacks), **issuedAt** (ISO 8601 timestamp marking when the request was created), **expirationTime** (optional deadline after which the sign-in is invalid), **statement** (human-readable description of what the user is approving), **chainId** (the Solana cluster, e.g., mainnet-beta), y **resources** (optional URIs that the sign-in grants access to).\n\nWhen a cartera receives a SIWS request, it knows the structure. It can display the domain prominently so the user can verify they are signing in to the correct site. It can show the expiration time so the user knows the request is time-limited. It can warn if the domain in the request does not match the domain the cartera was connected from. This structured rendering is a massive UX improvement over displaying raw bytes.\n\n## UX improvements para end users\n\nCon SIWS, cartera approval screens become consistent y informative. Instead of seeing an arbitrary string, users see a formatted display: the requesting domain, the statement explaining the action, the nonce (often hidden from the user but validated by the cartera), y time bounds. This consistency across dApps builds user confidence — they aprende to recognize what a legitimate sign-in request looks like.\n\nCarteras can also implement automatic safety checks. If the domain in the SIWS input does not match the origin of the connecting dApp, the cartera can show a warning or block the request entirely. If the issuedAt timestamp is far in the past or the expirationTime has already passed, the cartera can reject the request before the user even sees it. These checks are impossible con raw `signMessage` because the cartera has no way to parse the content.\n\n## Server-side benefits\n\nPara backend developers, SIWS provides a predictable verification flow. The server generates a nonce, sends the SIWS input to the client, receives the signed output, y verifies: (1) the signature is valid para the claimed address, (2) the domain matches the server's domain, (3) the nonce matches the one the server issued, (4) the timestamps are within acceptable bounds, y (5) the address matches the expected signer. Each check is explicit y auditable, unlike ad-hoc string parsing.\n\nThe nonce mechanism is particularly important. The server stores issued nonces (in memory, Redis, or a database) y marks them as consumed after successful verification. Any attempt to reuse a nonce is rejected as a replay attack. This provides cryptographic proof of freshness that raw signMessage authentication lacks unless the developer explicitly implements it — y history shows most developers do not.\n\n## The path forward\n\nSIWS aligns Solana's authentication story con Ethereum's Sign-In Con Ethereum (SIWE / EIP-4361) y other chain-specific standards. Cross-chain dApps can implement a unified authentication flow con chain-specific signing backends. The cartera-side rendering, nonce management, y verification logic are consistent patterns regardless of the underlying blockchain.\n\n## Operator mindset\n\nTreat SIWS as a protocol contract, not a UI prompt. If nonce lifecycle, domain checks, y time bounds are not enforced as strict invariants, authentication becomes signature theater.\n\n## Checklist\n- Understand why raw signMessage is insufficient para authentication\n- Know the core SIWS fields: domain, address, nonce, issuedAt, expirationTime, statement\n- Recognize that SIWS enables cartera-side validation y consistent UX\n- Understand the server-side nonce flow: generate, issue, verify, consume\n\n## Red flags\n- Using raw signMessage para authentication without structured format\n- Omitting nonce from sign-in messages (enables replay attacks)\n- Not validating domain match between SIWS input y connecting origin\n- Allowing sign-in messages without expiration times\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l1-q1",
                    "prompt": "What is the primary seguridad problem con using raw signMessage para authentication?",
                    "options": [
                      "Carteras cannot distinguish sign-in requests from malicious payloads",
                      "signMessage is too slow para production use",
                      "signMessage does not produce valid Ed25519 signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without structured format, carteras treat signMessage payloads as opaque bytes y cannot validate or warn about the content, making it easy para malicious dApps to disguise harmful payloads as sign-in requests."
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
                    "explanation": "The server generates a unique nonce para each sign-in attempt. After successful verification, the nonce is marked as consumed. Any reuse of the same nonce is rejected as a replay attack."
                  }
                ]
              }
            ]
          },
          "siws-v2-input-fields": {
            "title": "SIWS input fields y seguridad rules",
            "content": "# SIWS input fields y seguridad rules\n\nThe Sign-In Con Solana input is a structured object that defines every parameter of an authentication request. Each field has specific validation rules, seguridad implications, y rendering expectations. Understanding every field deeply is essential para building a correct y secure SIWS implementation.\n\n## domain\n\nThe `domain` field identifies the requesting application. It must be a valid domain name without protocol prefix — \"example.com\", not \"https://example.com\". The domain serves as the primary trust anchor: when the cartera displays the sign-in request, the domain is shown prominently so the user can verify they are interacting con the intended site.\n\nSeguridad rule: the server must verify that the domain in the signed output matches its own domain exactly. If a user signs a SIWS message para \"evil.com\" y submits it to \"example.com\", the server must reject it. The domain check prevents cross-site authentication relay attacks where an attacker presents their own domain to the user but submits the signed result to a different server. Domain validation should be case-insensitive (domains are case-insensitive per RFC 4343) y must reject domains containing protocol prefixes, paths, ports, or query strings.\n\n## address\n\nThe `address` field contains the Solana public key (base58-encoded) of the cartera that will sign the request. On Solana, public keys are 32 bytes encoded in base58, resulting in strings of 32-44 characters. The address must match the actual signer of the SIWS output — if the address in the input says \"Wallet111\" but \"Wallet222\" actually signs the message, verification must fail.\n\nSeguridad rule: always validate address format before sending the request to the cartera. A malformed address will cause downstream verification failures. Check that the address is 32-44 characters long y consists only of valid base58 characters (no 0, O, I, or l — these are excluded from base58 to avoid visual ambiguity). On the server side, verify that the address in the signed output matches the address you expected (typically the address of the connected cartera).\n\n## nonce\n\nThe `nonce` is the single most important seguridad field in SIWS. It is a server-generated, unique, unpredictable string that ties the sign-in request to a specific authentication attempt. The nonce must be at least 8 characters long y should be alphanumeric. In production, nonces are typically 16-32 character random strings generated using a cryptographically secure random number generator.\n\nSeguridad rule: nonces must be generated server-side, never client-side. If the client generates its own nonce, an attacker can reuse a previously valid nonce-signature pair. The server must store the nonce (con a TTL matching the sign-in expiration window) y check it during verification. After successful verification, the nonce must be permanently invalidated (deleted or marked as consumed). The nonce storage must be atomic — a race condition where two requests verify the same nonce simultaneously would defeat the replay protection entirely.\n\nNonce storage options include: in-memory maps (suitable para single-server deployments), Redis con TTL (suitable para distributed systems), y database tables con unique constraints. Whatever storage is used, the invalidation must be atomic: check-y-delete in a single operation, not check-then-delete in two steps.\n\n## issuedAt\n\nThe `issuedAt` field is an ISO 8601 timestamp indicating when the sign-in request was created. It provides temporal context para the authentication attempt. The server sets this value when generating the sign-in input.\n\nSeguridad rule: during verification, the server must check that `issuedAt` is not in the future (allowing a small clock skew tolerance of 1-2 minutes). A sign-in request con a future issuedAt timestamp is suspicious — it may indicate clock manipulation or request fabrication. The server should also reject sign-in requests where issuedAt is too far in the past, even if the expirationTime has not passed. A reasonable maximum age para issuedAt is 10-15 minutes.\n\n## expirationTime\n\nThe `expirationTime` field is an optional ISO 8601 timestamp indicating when the sign-in request becomes invalid. If present, it must be strictly after `issuedAt`. If absent, the sign-in request has no explicit expiration (though the server should still enforce a maximum age based on issuedAt).\n\nSeguridad rule: if expirationTime is present, the server must verify that the current time is before the expiration. Expired sign-in requests must be rejected regardless of signature validity. Setting short expiration windows (5-15 minutes) reduces the window para replay attacks y limits the useful lifetime of intercepted sign-in requests. Production systems should always set expirationTime rather than relying solely on nonce expiration.\n\n## statement\n\nThe `statement` field is a human-readable string that the cartera displays to the user, describing what they are approving. If not provided by the dApp, a sensible default is \"Sign in to <domain>\". The statement should be concise, clear, y accurately describe the action.\n\nSeguridad rule: the statement is informational y should not contain sensitive data. It is included in the signed message, so it is visible to anyone who can see the signature. Do not include session tokens, API keys, or other secrets in the statement. The cartera renders the statement as-is, so avoid HTML, markdown, or other formatting that might be misinterpreted.\n\n## chainId y resources\n\nThe `chainId` field identifies the Solana cluster (e.g., \"mainnet-beta\", \"devnet\", \"testnet\"). This prevents cross-cluster authentication where a signature obtained on devnet is replayed on mainnet. The `resources` field is an optional array of URIs that the sign-in grants access to. These are informational y displayed by the cartera.\n\nSeguridad rule: if your dApp operates on a specific cluster, verify that the chainId in the signed output matches your expected cluster. Resources should be validated as well-formed URIs but their enforcement is application-specific.\n\n## Checklist\n- Domain must not include protocol, path, or port\n- Nonce must be >= 8 alphanumeric characters, generated server-side\n- issuedAt must not be in the future; reject stale requests\n- expirationTime (if present) must be after issuedAt y not yet passed\n- Address must be 32-44 characters of valid base58\n- Statement should default to \"Sign in to <domain>\" if not provided\n\n## Red flags\n- Accepting client-generated nonces\n- Not validating domain format (allowing protocol prefixes)\n- Missing atomic nonce invalidation (check-then-delete race condition)\n- No maximum age check on issuedAt\n- Storing secrets in the statement field\n",
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
                      "Carteras cannot sign messages containing client-generated nonces"
                    ],
                    "answerIndex": 0,
                    "explanation": "If the client generates nonces, an attacker can replay a previously captured nonce-signature pair. Server-generated nonces ensure each authentication attempt is unique y controlled by the server."
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
                    "explanation": "The domain field must be a plain domain name. Protocol prefixes, paths, ports, y query strings must be rejected to ensure consistent domain matching."
                  }
                ]
              }
            ]
          },
          "siws-v2-message-preview": {
            "title": "Message preview: how carteras render SIWS requests",
            "content": "# Message preview: how carteras render SIWS requests\n\nWhen a dApp sends a SIWS sign-in request to a cartera, the cartera transforms the structured input into a human-readable message that the user sees on the approval screen. Understanding exactly how this rendering works is critical para dApp developers — it determines what users see, what they trust, y what they sign.\n\n## The SIWS message format\n\nThe SIWS standard defines a specific text format para the message that gets signed. The cartera constructs this message from the structured input fields. The format follows a predictable template that carteras can both generate y parse. The message begins con the domain y address, followed by a statement, then a structured block of metadata fields.\n\nA complete SIWS message looks like this:\n\n```\nexample.com wants you to sign in with your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z\nChain ID: mainnet-beta\n```\n\nThe first line always follows the pattern: \"`<domain>` wants you to sign in con your Solana cuenta:\". This phrasing is standardized so users aprende to recognize it across all SIWS-compatible dApps. The second line is the full public key address. A blank line separates the header from the statement. Another blank line separates the statement from the metadata fields.\n\n## Cartera rendering expectations\n\nModern Solana carteras (Phantom, Solflare, Backpack) recognize SIWS-formatted messages y render them con enhanced UI. Instead of displaying raw text, they parse the structured fields y present them in a formatted approval screen con clear sections.\n\nThe domain is typically displayed prominently at the top of the approval screen, often con the dApp's favicon if available. This is the primary trust signal — users should check this domain matches the site they are interacting con. Some carteras cross-reference the domain against the connecting origin y display a warning if they do not match.\n\nThe statement is shown in a distinct section, often con larger or bolder text. This is the human-readable explanation of what the user is approving. Para sign-in requests, it typically says something like \"Sign in to example.com\" or a custom message the dApp provides.\n\nThe metadata fields (nonce, issuedAt, expirationTime, chainId, resources) are shown in a structured format, often collapsible or in a \"details\" section. Most users do not read these fields, but their presence signals that the request is well-formed y follows the standard. Seguridad-conscious users can verify the nonce matches their expectation y the timestamps are reasonable.\n\n## What users actually see versus what gets signed\n\nIt is important to understand that what the cartera displays y what actually gets signed can differ. The cartera renders a formatted UI from the parsed fields, but the actual bytes that are signed are the serialized message text in the standard format. The cartera constructs the canonical message text, displays a parsed version to the user, y signs the canonical text.\n\nThis creates a trust model: the user trusts the cartera to accurately represent the message content. If a cartera has a rendering bug (e.g., it shows the wrong domain), the user might approve a message they would otherwise reject. This is why using well-audited, mainstream carteras is important para SIWS seguridad.\n\nThe signed bytes include the full message text prefixed con a Solana-specific preamble. The Ed25519 signature covers the entire message, including all fields. Changing any field (even adding a space) produces a completely different signature. This ensures that the server can verify not just that the user signed something, but that they signed the exact message con the exact fields the server expected.\n\n## Building preview UIs in dApps\n\nBefore sending a SIWS request to the cartera, many dApps show a preview of the message in their own UI. This preview serves two purposes: it prepares the user para what they will see in the cartera (reducing confusion y approval time), y it provides a last checkpoint before triggering the cartera interaction.\n\nThe dApp preview should mirror the cartera's rendering as closely as possible. Show the domain, statement, y key metadata fields. Indicate that the user will be asked to approve this message in their cartera. If the dApp is using a custom statement, display it exactly as it will appear.\n\nDo not include fields in the preview that might confuse users. The nonce, para example, is a random string that has no meaning to the user. Showing it adds visual noise without value. The preview can omit the nonce while the actual signed message includes it. Similarly, the chainId is important para verification but rarely interesting to users unless the dApp operates across multiple clusters.\n\n## Edge cases in rendering\n\nSeveral edge cases affect how SIWS messages are rendered y signed. Long domains may be truncated in cartera UIs — ensure your domain is concise. Internationalized domain names (IDN) should be tested con your target carteras, as some carteras may not render Unicode characters correctly. The statement field has no maximum length in the standard, but extremely long statements will be truncated or require scrolling in the cartera, reducing the chance that users read them fully.\n\nEmpty optional fields are omitted from the message text. If no expirationTime is set, the \"Expiration Time:\" line does not appear. If no resources are specified, no resources section appears. The message format adjusts dynamically based on which fields are present.\n\n## Checklist\n- Know the canonical SIWS message format y field ordering\n- Understand that carteras parse y render structured UI from the message\n- Build dApp-side previews that mirror cartera rendering\n- Test your SIWS messages con target carteras to verify display\n- Keep statements concise y domains short\n\n## Red flags\n- Assuming all carteras render SIWS messages identically\n- Including sensitive data in the statement (it is visible in the signed message)\n- Using extremely long statements that carteras truncate\n- Not pruebas con real cartera approval screens during development\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "siws-v2-l3-preview",
                "title": "SIWS Message Format",
                "steps": [
                  {
                    "cmd": "Construct SIWS message from input fields",
                    "output": "example.com wants you to sign in con your Solana cuenta:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z",
                    "note": "Canonical text format that gets signed by the cartera"
                  },
                  {
                    "cmd": "Wallet parses and displays structured approval screen",
                    "output": "Domain: example.com [verified]\nStatement: Sign in to example.com\nExpires: in 59 minutes\n[Approve] [Reject]",
                    "note": "Cartera renders structured UI from parsed fields"
                  },
                  {
                    "cmd": "User approves -> wallet signs canonical message bytes",
                    "output": "Signature: 3AuYNW... (Ed25519 over message bytes)\nPublic Key: 7Y4f3T...",
                    "note": "Signed output returned to the dApp para server verification"
                  }
                ]
              }
            ]
          },
          "siws-v2-sign-in-input": {
            "title": "Challenge: Build a validated SIWS sign-in input",
            "content": "# Challenge: Build a validated SIWS sign-in input\n\nImplement a function that creates a validated Sign-In Con Solana input:\n\n- Validate domain (non-empty, must not include protocol prefix)\n- Validate nonce (at least 8 characters, alphanumeric only)\n- Validate address format (32-44 characters para Solana base58)\n- Set issuedAt (required) y optional expirationTime con ordering check\n- Default statement to \"Sign in to <domain>\" if not provided\n- Return structured result con valid flag y collected errors\n\nYour implementation must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Domain should not include protocol (https://). Strip or reject it.",
              "Nonce must be >= 8 characters y alphanumeric only (/^[a-zA-Z0-9]+$/).",
              "Address must be 32-44 characters (Solana base58 public key).",
              "If no statement is provided, default to 'Sign in to <domain>'."
            ]
          }
        }
      },
      "siws-v2-verification": {
        "title": "Verification & Seguridad",
        "description": "Server-side verification invariants, nonce replay defenses, session management, y deterministic auth audit reporting.",
        "lessons": {
          "siws-v2-verify-sign-in": {
            "title": "Challenge: Verify a SIWS sign-in response",
            "content": "# Challenge: Verify a SIWS sign-in response\n\nImplement server-side verification of a SIWS sign-in output:\n\n- Check domain matches expected domain\n- Check nonce matches expected nonce\n- Check issuedAt is not in the future relative to currentTime\n- Check expirationTime (if present) has not passed\n- Check address matches expected signer\n- Return verification result con individual check statuses y error list\n\nAll five checks must pass para the sign-in to be considered verified.",
            "duration": "50 min",
            "hints": [
              "Compare domain, nonce, y address between signInOutput y expected values.",
              "issuedAt must be <= currentTime (not in the future).",
              "expirationTime (if present) must be > currentTime.",
              "All five checks must pass para verified = true."
            ]
          },
          "siws-v2-sessions": {
            "title": "Sessions y logout: what to store y what not to store",
            "content": "# Sessions y logout: what to store y what not to store\n\nAfter a successful SIWS sign-in verification, the server must establish a session so the user does not need to re-authenticate on every request. Session management para cartera-based authentication has unique characteristics compared to traditional username-password systems. Understanding what to store, where to store it, y how to handle logout is essential para building secure dApps.\n\n## What a SIWS session contains\n\nA SIWS session represents a verified claim: \"Public key X proved ownership by signing a SIWS message para domain Y at time Z.\" The session should store exactly enough information to enforce authorization decisions without requiring re-verification. The minimum session payload includes: the cartera address (public key), the domain the sign-in was verified para, the session creation time, y the session expiration time.\n\nDo NOT store the SIWS signature, the signed message, or the nonce in the session. These are verification artifacts, not session data. The signature has no purpose after verification — it proved the user controlled the key at the time of signing, y that proof is now captured by the session itself. Storing signatures in sessions creates unnecessary data that, if leaked, provides no additional attack surface but adds complexity y storage cost.\n\nSession identifiers should be opaque, random tokens — not derived from the cartera address. Using the cartera address as a session ID is a common mistake because cartera addresses are public. Anyone who knows a user's address could forge requests. The session ID must be a cryptographically random string (e.g., 256-bit random value, base64-encoded) that maps to the session data on the server side.\n\n## Server-side vs client-side session storage\n\nServer-side sessions store session data in a backend store (Redis, database, in-memory map) y issue a session token (cookie or bearer token) to the client. The client presents the token on each request, y the server looks up the associated session data. This is the most secure pattern because the server controls all session state.\n\nClient-side sessions (JWTs) encode the session data directly in the token. The server signs the JWT y the client includes it in requests. The server verifies the JWT signature y reads the session data without a backend lookup. This is simpler to deploy but has significant drawbacks: JWTs cannot be individually revoked (you must wait para expiration or maintain a revocation list), the session data is visible to the client (encrypted JWTs mitigate this), y JWT size grows con payload data.\n\nPara SIWS authentication, server-side sessions are recommended because they support immediate revocation (critical para seguridad incidents) y keep session data private. If using JWTs, keep the payload minimal (cartera address y expiration only), use short expiration times (15-60 minutes), y implement a refresh token flow para session extension.\n\n## Session expiration y refresh\n\nSession lifetimes para cartera-authenticated dApps should be shorter than traditional web sessions. Users can sign a new SIWS message quickly (a few seconds), so the cost of re-authentication is low. Recommended session lifetime is 1-4 hours para active sessions, con a sliding window that extends the expiration on each authenticated request.\n\nRefresh tokens can extend session lifetime without requiring re-authentication. The flow is: issue a short-lived access token (15-60 minutes) y a longer-lived refresh token (24-72 hours). When the access token expires, the client presents the refresh token to obtain a new access token. The refresh token is single-use (rotated on each refresh) y stored securely.\n\nAbsolute session lifetime should be enforced regardless of refresh activity. Even if a user keeps refreshing, the session should eventually require re-authentication. A reasonable absolute lifetime is 7-30 days. This limits the damage from a stolen refresh token.\n\n## Logout implementation\n\nLogout para cartera-based authentication is simpler than login but has important nuances. The server must invalidate the session on the backend (delete the session from the store or add the JWT to a revocation list). The client must clear all local session artifacts (cookies, localStorage tokens, in-memory state).\n\nCartera disconnection is not the same as logout. When a user disconnects their cartera from the dApp (using the cartera's disconnect feature), the dApp should treat this as a logout signal y invalidate the server session. However, some dApps maintain the session even after cartera disconnection, which can confuse users who expect disconnection to log them out.\n\nImplementing \"logout everywhere\" (invalidating all sessions para a cartera address) requires server-side session storage con an index by cartera address. When triggered, query all sessions para the address y invalidate them. This is useful para seguridad incidents or when the user suspects their session was compromised.\n\n## What NOT to store in sessions\n\nNever store the user's private key (obviously). Never store the SIWS nonce (it has been consumed y should be deleted from the nonce store). Never store the raw SIWS signature (it is a verification artifact). Never store personally identifiable information (PII) unless your dApp explicitly collects it — cartera addresses are pseudonymous by default.\n\nAvoid storing cartera balances, token holdings, or other on-chain data in the session. This data changes constantly y becomes stale immediately. Fetch it fresh from the RPC when needed. Sessions should be lightweight: address, permissions, timestamps, y nothing more.\n\n## Checklist\n- Store cartera address, domain, creation time, y expiration in sessions\n- Use cryptographically random session IDs, not cartera addresses\n- Prefer server-side sessions para immediate revocation capability\n- Enforce absolute session lifetime even con refresh tokens\n- Invalidate sessions on both logout y cartera disconnect\n- Never store signatures, nonces, or PII in sessions\n\n## Red flags\n- Using cartera address as session ID\n- Storing SIWS signature or nonce in the session\n- No session expiration or unlimited lifetime\n- JWT sessions without revocation mechanism\n- Ignoring cartera disconnect events\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l6-q1",
                    "prompt": "Why should session IDs be random tokens rather than cartera addresses?",
                    "options": [
                      "Cartera addresses are public, so anyone could forge requests using a known address",
                      "Random tokens are shorter y save bandwidth",
                      "Cartera addresses change frequently y break sessions"
                    ],
                    "answerIndex": 0,
                    "explanation": "Cartera addresses are publicly known. Using them as session IDs would allow anyone who knows a user's address to impersonate their session. Random tokens ensure only the authenticated client can present a valid session."
                  },
                  {
                    "id": "siws-v2-l6-q2",
                    "prompt": "What should happen when a user disconnects their cartera from a dApp?",
                    "options": [
                      "The dApp should invalidate the server-side session (treat it as logout)",
                      "Nothing — the session should persist para convenience",
                      "The dApp should reconnect the cartera automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Cartera disconnection signals the user's intent to end the interaction. The dApp should respect this by invalidating the session, preventing confusion about authentication state."
                  }
                ]
              }
            ]
          },
          "siws-v2-replay-protection": {
            "title": "Replay protection y nonce registry diseno",
            "content": "# Replay protection y nonce registry diseno\n\nReplay attacks are the most critical threat to any signature-based authentication system. In a replay attack, an adversary captures a valid signed message y submits it again to the server, impersonating the original signer. SIWS addresses this con nonce-based replay protection, but the implementation details of the nonce registry determine whether the protection actually works.\n\n## How replay attacks work against SIWS\n\nConsider a SIWS sign-in flow without proper nonce management. The user signs a message: \"example.com wants you to sign in con your Solana cuenta: Wallet111... Nonce: abc123 Issued At: 2024-01-01T00:00:00Z\". The server verifies the signature y creates a session. The signed message y signature are transmitted over HTTPS y should be safe in transit.\n\nHowever, the signed message could be captured through: a compromised server log that records request bodies, a malicious browser extension that intercepts WebSocket traffic, a man-in-the-middle proxy in a development or corporate environment, or a compromised CDN that logs request payloads. If the attacker obtains the signed SIWS output, they can submit it to the server as if they were the original signer.\n\nWithout nonce protection, the server would verify the signature (it is valid — the user really did sign it), check the domain (it matches), check the timestamps (they may still be within bounds), y accept the authentication. The attacker now has a valid session para the victim's cartera address.\n\n## Nonce lifecycle\n\nThe nonce lifecycle has four phases: generation, issuance, verification, y consumption. Each phase has specific requirements.\n\nGeneration: the server creates a cryptographically random nonce using a secure random number generator. The nonce must be unpredictable — an attacker should not be able to guess the next nonce by observing previous ones. Use at least 128 bits of entropy (16 bytes, 22 base64 characters or 32 hex characters). Store the nonce in the registry con a TTL y the expected cartera address.\n\nIssuance: the server includes the nonce in the SIWS input sent to the client. The nonce travels from server to client to cartera y back. During this transit, the nonce is not secret (it is included in the signed message), but it is unique. The important property is not secrecy but freshness — this specific nonce has never been used before.\n\nVerification: when the server receives the signed SIWS output, it extracts the nonce y checks the registry. The nonce must exist in the registry (rejecting fabricated nonces), must not be marked as consumed (rejecting replays), y must not have expired (rejecting stale requests). These checks must happen before signature verification to fail fast on obvious replays.\n\nConsumption: after successful verification, the nonce is atomically marked as consumed or deleted from the registry. This is the critical step — if consumption is not atomic, two concurrent requests con the same nonce could both pass the \"not consumed\" check before either marks it as consumed. This race condition completely defeats replay protection.\n\n## Nonce registry diseno patterns\n\nThe nonce registry is the data structure that stores issued nonces y tracks their state. Several patterns are used in production.\n\nIn-memory map con TTL: a simple hash map where keys are nonce strings y values are metadata (creation time, expected address, consumed flag). A background timer periodically cleans expired entries. This works para single-server deployments but does not scale to multiple servers (each server has its own map y cannot validate nonces issued by other servers).\n\nRedis con atomic operations: Redis provides the ideal primitives para nonce management. Use SET con NX (set-if-not-exists) para atomic consumption: attempt to set a \"consumed\" key; if it already exists, the nonce was already used. Use TTL on nonce keys para automatic expiration. Redis is distributed, so all servers share the same nonce registry.\n\nThe Redis pattern para atomic nonce consumption:\n\n1. On issuance: `SET nonce:<value> \"issued\" EX 600` (10-minute TTL)\n2. On verification: `SET nonce:<value>:consumed \"1\" NX EX 600`\n   - If SET NX succeeds (returns OK): nonce is valid y now consumed\n   - If SET NX fails (returns nil): nonce was already consumed (replay attempt)\n\nDatabase con unique constraints: store nonces in a table con a unique constraint on the nonce value y a \"consumed_at\" column. Consumption is an UPDATE that sets consumed_at where consumed_at IS NULL. If the update affects 0 rows, the nonce was already consumed. Database transacciones ensure atomicity but add latency compared to Redis.\n\n## Handling edge cases\n\nClock skew between servers affects nonce TTL enforcement. If server A issues a nonce con a 10-minute TTL but server B's clock is 3 minutes ahead, server B may consider the nonce expired after only 7 minutes from the user's perspective. Use NTP synchronization across servers y add a grace period (30-60 seconds) to TTL checks.\n\nNonce reuse across different cartera addresses should be rejected. Even if cartera A's nonce was consumed, do not allow cartera B to use the same nonce value. This is automatically handled if the nonce registry indexes by nonce value regardless of address. However, some implementations associate nonces con specific addresses y might accidentally allow cross-address reuse.\n\nHigh-traffic systems may generate thousands of nonces per second. The registry must handle this volume without becoming a bottleneck. Redis handles this easily. In-memory maps work if garbage collection of expired nonces is efficient. Database-backed registries need proper indexing y periodic cleanup of consumed nonces.\n\n## Monitoring y alerting\n\nProduction nonce registries should emit metrics: nonces generated per minute, nonces consumed per minute, replay attempts blocked per minute, nonces expired unused per minute. A sudden spike in replay attempts indicates an active attack. A high ratio of expired-to-consumed nonces may indicate UX issues (users starting but not completing sign-in).\n\nLog every replay attempt con the nonce value, the submitting IP address, y the associated cartera address. This data feeds into seguridad incident investigation. Alert on replay attempt rates exceeding a threshold (e.g., more than 10 per minute from the same IP).\n\n## Checklist\n- Use cryptographically random nonces con >= 128 bits of entropy\n- Implement atomic nonce consumption (check-y-invalidate in one operation)\n- Set nonce TTL matching the sign-in expiration window (5-15 minutes)\n- Use Redis or equivalent distributed store para multi-server deployments\n- Monitor y alert on replay attempt rates\n- Clean up expired nonces periodically\n\n## Red flags\n- Non-atomic nonce consumption (check-then-delete race condition)\n- In-memory nonce storage in a multi-server despliegue\n- No nonce TTL (nonces accumulate forever)\n- Allowing nonce reuse across different cartera addresses\n- No monitoring of replay attempt rates\n",
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
                    "note": "Nonce travels: server -> client -> cartera -> signed output"
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
            "content": "# Checkpoint: Generate an auth audit report\n\nBuild the final auth audit report that combines all curso concepts:\n\n- Process an array of authentication attempts con address, nonce, y verified status\n- Track used nonces to detect y block replay attempts (duplicate nonce = replay)\n- Count successful sign-ins, failed sign-ins, y replay attempts blocked\n- Count unique cartera addresses across all attempts\n- Build a nonce registry con status para each attempt: \"consumed\", \"rejected\", or \"replay-blocked\"\n- Include the report timestamp\n\nThis checkpoint validates your complete understanding of SIWS authentication y nonce-based replay protection.",
            "duration": "55 min",
            "hints": [
              "Track used nonces in a map. If a nonce was already used, it's a replay attempt.",
              "Count successful (verified + new nonce), failed (not verified), y replay-blocked separately.",
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
    "description": "Defensive Solana fee engineering con deterministic compute planning, adaptive priority policy, y confirmation-aware UX reliability contracts.",
    "duration": "9 hours",
    "tags": [
      "solana",
      "fees",
      "compute-budget",
      "reliability"
    ],
    "modules": {
      "pfcb-v2-foundations": {
        "title": "Fee y Compute Foundations",
        "description": "Inclusion mechanics, compute/fee coupling, y explorer-driven policy diseno con deterministic reliability framing.",
        "lessons": {
          "pfcb-v2-fee-market-reality": {
            "title": "Fee markets on Solana: what actually moves inclusion",
            "content": "# Fee markets on Solana: what actually moves inclusion\n\nPriority fees on Solana are often explained as a simple slider, but production systems need a more precise model. Inclusion is influenced by contention para compute, validador scheduling pressure, local leader behavior, y the transaccion's own resource request profile. Engineers who only look at a single median fee value usually misprice during bursty traffic y then overpay during recovery. This leccion gives a practico, defensive framework para pricing inclusion without relying on superstition.\n\nA transaccion does not compete only on total lamports paid. It competes on requested compute unit price y resource footprint under slot-level pressure. If you request very high compute units y low micro-lamports per compute unit, you may still lose to smaller requests paying a healthier rate. In practice, carteras should treat compute limit y compute price as coupled decisions. Choosing either one in isolation leads to unstable behavior. A route that usually lands con 250,000 units may occasionally need 350,000 because state branches differ. If your safety margin is too tight, you fail. If your safety margin is too loose y your price is high, you overpay.\n\nDefensive engineering starts con synthetic sample sets y deterministic policy simulation. Even if your production system eventually consumes live telemetry, your curso project y baseline tests should prove policy behavior under controlled volatility regimes: calm, elevated, y spike. A calm regime might show p50 y p90 close together, while a spike regime has p90 several multiples above p50. This spread is important because it tells you whether your percentile target alone is enough, or whether you need a volatility guard that adds a controlled premium.\n\nAnother misunderstood point is confirmation UX. Users often interpret \"submitted\" as \"done,\" but processed status is still vulnerable to rollback scenarios y reordering. Para high-value flows, the UI should explain exactly why it waits para confirmed or finalized. This is not academic: support burden spikes when users see optimistic success then reversal. Defensive products align language con protocol reality by attaching explicit state labels y expected next actions.\n\nA robust fee policy also defines failure classes. If a transaccion misses inclusion windows repeatedly, the policy should identify whether to raise compute price, raise compute limit, refresh blockhash, or re-quote. Blindly retrying the same payload can amplify congestion y degrade user trust. Good systems cap retries y emit deterministic diagnostics that make support y analytics useful.\n\nYou should model inclusion strategy as policy outputs, not imperative side effects. A policy function should return chosen percentile, volatility adjustment, final micro-lamports target, confidence label, y warnings. By keeping this deterministic y serializable, teams can diff policy versions y verify behavior changes before deploying. This is the same discipline used in risk engines: reproducible decisions first, runtime integrations second.\n\nFinally, keep user education integrated into the product flow. A short explanation that \"network congestion increased your priority fee to improve inclusion probability\" reduces confusion y failed-signature churn. It also helps users compare urgency tiers in a way that feels fair. Defensive UX is not only about blocking risky actions; it is about exposing enough context to prevent panic y repeated mistakes.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Operator mindset\n\nFee policy is an inclusion-probability model, not a guarantee engine. Good systems expose confidence, assumptions, y fallback actions explicitly so operators can respond quickly when regimes shift.\n\n## Checklist\n- Couple compute limit y compute price decisions in one policy output.\n- Use percentile targeting plus volatility guard para unstable markets.\n- Treat confirmation states as distinct UX contracts.\n- Cap retries y classify misses before adjusting fees.\n- Emit deterministic policy reports para audits y regressions.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "pfcb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "pfcb-v2-l1-q1",
                    "prompt": "Why should compute unit limit y price be planned together?",
                    "options": [
                      "Because inclusion depends on both requested resources y bid intensity",
                      "Because compute unit limit is ignored by validadores",
                      "Because priority fee is fixed per transaccion"
                    ],
                    "answerIndex": 0,
                    "explanation": "A large CU request con weak price can lose inclusion, while aggressive price on oversized CU can overpay."
                  },
                  {
                    "id": "pfcb-v2-l1-q2",
                    "prompt": "What does a wide p90 vs p50 spread usually indicate?",
                    "options": [
                      "A volatile fee regime where a guard premium may be needed",
                      "A bug in transaccion serialization",
                      "Guaranteed finalized confirmation"
                    ],
                    "answerIndex": 0,
                    "explanation": "Spread growth signals unstable contention y lower reliability para naive median pricing."
                  }
                ]
              }
            ]
          },
          "pfcb-v2-compute-budget-failure-modes": {
            "title": "Compute budget fundamentos y common failure modes",
            "content": "# Compute budget fundamentos y common failure modes\n\nMost transaccion failures blamed on \"network issues\" are actually planning errors in compute budget y payload sizing. A defensive client treats compute planning as a deterministic preflight policy: estimate required compute, apply bounded margin, decide whether heap allocation is warranted, y explain the result before signing. This leccion focuses on failure modes that recur in production carteras y DeFi frontends.\n\nThe first class is explicit compute exhaustion. When instruccion paths consume more than the transaccion limit, execution aborts y users still pay base fees para work already attempted. Teams frequently set one global limit para all routes, which is convenient but unreliable. Route complexity differs by pool topology, cuenta cache warmth, y cuenta creation branches. Planning must operate on per-flow estimates, not app-wide constants.\n\nThe second class is excessive compute requests paired con aggressive bid pricing. This can cause overpayment y user distrust, especially in periods where lower limits would still succeed. A safe policy sets lower y upper bounds, applies a margin to synthetic or simulated expected compute, y clamps to protocol max. If a requested override is present, the system should still clamp y document why. Deterministic reasoning strings are useful because support y QA can inspect exactly why a plan was chosen.\n\nThe third class is transaccion size pressure. Large cuenta metas y instruccion data increase serialization footprint, y large payloads often correlate con higher compute paths. While compute planning does not directly solve size limit errors, the same planner can emit a hint when transaccion size exceeds a threshold y recommend route simplification or decomposition. In this curso, we keep it deterministic: no RPC checks, only input-driven policy outputs.\n\nA related failure class is memory pressure in workloads that deserialize heavy cuenta sets. Some clients include heap-frame recommendations based on route complexity or size threshold. If you include this in a deterministic planner, keep the conditions explicit y stable. Ambiguous heuristics create policy churn that is hard to test.\n\nGood confirmation UX is another defensive layer. Processed means accepted by a node, confirmed adds stronger network observation, finalized is strongest settlement confidence. Para low-value actions, processed plus pending indicator can be acceptable. Para high-risk value transfer, confirmed or finalized should gate \"success\" copy. Engineers should encode this as policy output rather than ad hoc component logic.\n\nA mature planner also returns warnings. Examples include \"override clamped to max,\" \"size indicates high serialization risk,\" or \"sample set too small para confident bid.\" Warnings should not be noisy; each one should map to an actionable path. Over-warning trains users to ignore alerts, while under-warning hides real risk.\n\nIn deterministic environments, each policy branch should be testable con small synthetic fixtures. You want stable outputs para JSON snapshots, markdown reports, y support triage docs. This discipline scales to production because the same decision shape can later consume live inputs without changing contract semantics.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Compute plans should be bounded, deterministic, y explainable.\n- Planner should expose warning signals, not only numeric outputs.\n- Confirmation messaging should reflect actual settlement guarantees.\n- Inputs must be validated; invalid estimates should fail fast.\n- Unit tests should cover clamp logic y edge thresholds.\n",
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
            "content": "# Explorer: compute budget planner inputs to plan\n\nExplorers are useful only when they expose policy tradeoffs clearly. Para a fee y compute planner, that means visualizing how input estimates, percentile targets, y confirmation requirements produce a deterministic recommendation. This leccion frames an explorer as a decision table that can be replayed by engineers, support staff, y users.\n\nStart con the three input groups: workload profile, fee samples, y UX confirmation target. Workload profile includes synthetic instruccion CU estimates y payload size. Fee samples represent recent or scenario-based micro-lamport values. Confirmation target defines settlement strictness para the user action type. A deterministic planner should convert these into a stable tuple: compute plan, priority estimate, y warnings.\n\nThe key teaching point is that explorer values should not mutate silently. If a user changes percentile from 50 to 75, the output should change in an obvious y traceable way. If volatility spread exceeds policy guard, the explorer should display a clear badge: \"guard applied.\" This approach teaches policy causality y prevents magical thinking about fees.\n\nExplorer diseno should also separate confidence from urgency. Confidence describes how trustworthy the current estimate is, often based on sample depth y spread stability. Urgency is a user choice: how quickly inclusion is desired. Confusing these concepts leads to poor defaults y frustrated users. A cautious user may still choose medium urgency if confidence is low y warnings are high.\n\nA defensive explorer includes side-by-side outputs para JSON y markdown summary. JSON provides machine-readable deterministic artifacts para snapshots y regression tests. Markdown provides human-readable communication para support y incident reviews. Both should derive from the same payload to avoid divergence.\n\nIn production teams, explorer traces can become a lightweight runbook. If a user reports repeated misses, support can replay the same inputs y inspect whether the policy selected reasonable values. If not, policy changes can be proposed con test fixtures before rollout. If yes, the issue may be external congestion or stale quote flow, not planner logic.\n\nFrom an engineering quality perspective, deterministic explorers reduce blame cycles. Instead of \"it felt wrong,\" teams can point to exact sample sets, percentile choice, spread guard status, y final plan fields. This clarity is a force multiplier para reliability work.\n\nThe last diseno principle is explicit assumptions. If your explorer assumes synthetic samples, label them clearly. If it assumes no RPC feedback, state that. Honest boundaries improve trust y encourage users to interpret outputs correctly.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Show clear mapping from each input control to each output field.\n- Expose volatility guard activation as an explicit state.\n- Keep confidence y urgency as separate concepts.\n- Produce identical output para repeated identical inputs.\n- Export JSON y markdown from the same canonical payload.\n",
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
        "description": "Implement deterministic planners, confirmation policy engines, y stable fee strategy artifacts para release review.",
        "lessons": {
          "pfcb-v2-plan-compute-budget": {
            "title": "Challenge: implement planComputeBudget()",
            "content": "Implement a deterministic compute budget planner. No RPC calls; operate only on provided input data.",
            "duration": "40 min",
            "hints": [
              "Compute units should be ceil(total CU * 1.1) con a floor of 80k y max of 1.4M.",
              "Enable heapBytes para very large tx payloads or high CU totals.",
              "Return a deterministic reason string para test stability."
            ]
          },
          "pfcb-v2-estimate-priority-fee": {
            "title": "Challenge: implement estimatePriorityFee()",
            "content": "Implement policy-based priority fee estimation using synthetic sample arrays y deterministic warnings.",
            "duration": "40 min",
            "hints": [
              "Use percentile targeting from sorted synthetic fee samples.",
              "Apply volatility guard if p90 vs p50 spread exceeds policy threshold.",
              "Clamp output between min y max micro-lamports."
            ]
          },
          "pfcb-v2-confirmation-ux-policy": {
            "title": "Challenge: confirmation level decision engine",
            "content": "Encode confirmation UX policy para processed, confirmed, y finalized states using deterministic risk bands.",
            "duration": "35 min",
            "hints": [
              "Map risk score bands to processed/confirmed/finalized UX levels.",
              "Keep output deterministic y string-stable."
            ]
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            "title": "Challenge: build feePlanSummary markdown",
            "content": "Build stable markdown output para a fee strategy summary that users y support teams can review quickly.",
            "duration": "35 min",
            "hints": [
              "Markdown output should be deterministic y human-readable.",
              "Avoid timestamps or random IDs in output."
            ]
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            "title": "Checkpoint: Fee Optimizer report",
            "content": "Produce a deterministic checkpoint report JSON para the Fee Optimizer final project artifact.",
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
    "title": "Bundles & Transaccion Atomicity",
    "description": "Diseno defensive multi-transaccion Solana flows con deterministic atomicity validation, compensation modeling, y audit-ready safety reporting.",
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
        "description": "User-intent expectations, flow decomposition, y deterministic risk-graph modeling para multi-step reliability.",
        "lessons": {
          "bundles-v2-atomicity-model": {
            "title": "Atomicity concepts y why users assume all-or-nothing",
            "content": "# Atomicity concepts y why users assume all-or-nothing\n\nUsers rarely think in transaccion graphs. They think in intents: \"swap my token\" or \"close my position.\" When a workflow spans multiple transacciones, user expectation remains all-or-nothing unless your UI teaches otherwise. This mismatch between intent-level atomicity y protocol-level execution can produce severe trust failures even when each transaccion is technically valid. Defensive engineering starts by mapping user intent boundaries y showing where partial execution can occur.\n\nIn Solana systems, multi-step flows are common. You may need token approval-like setup, associated token cuenta creation, route execution, y cleanup. Each step has independent confirmation behavior y can fail para different reasons. If a flow halts after a preparatory step, the user can be left in a state they never intended: allowances enabled, rent paid para unused cuentas, or funds moved into intermedio holding cuentas.\n\nA rigorous model begins con explicit step typing. Every step should be tagged by function y risk: setup, value transfer, settlement, compensation, y cleanup. Then define dependencies between steps y mark whether each step is idempotent. Idempotency matters because retry logic can create duplicates if a step is not safely repeatable. This is not only a backend concern; frontend orchestration y cartera prompts must respect idempotency constraints.\n\nAnother key concept is compensating action coverage. If a value-transfer step fails midway, does a deterministic refund path exist? If not, your flow should be marked high risk y your UI should block or require additional confirmation. Teams often postpone compensation diseno until incident response, but defensive curso diseno should treat compensation as a first-class requirement.\n\nBundle thinking helps organize these concerns. Even without live relay APIs, you can compose a deterministic bundle structure representing intended ordering y invariants. This structure teaches engineers how to reason about all-or-nothing intent, retries, y fallback paths. It also enables stable unit tests that validate graph shape y risk reports.\n\nFrom a UX angle, the most important move is honest framing. If strict atomicity is not guaranteed, state it directly. Users tolerate complexity when language is clear: \"Step 2 may fail after Step 1 succeeds; automatic refund logic is applied if needed.\" Hiding this reality may reduce initial friction but increases long-term mistrust.\n\nSupport y incident teams benefit from deterministic flow reports. A report should list steps, dependencies, idempotency status, y detected issues such as missing refunds or broken dependencies. When users report failed swaps, this report enables quick triage: was the failure expected y safely compensated, or did the flow violate defined invariants?\n\nUltimately, atomicity is a contract between engineering y user expectations. Protocol constraints do not remove that responsibility. They make explicit modeling, pruebas, y communication mandatory.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Operator mindset\n\nAtomicity is a user-trust contract. If strict all-or-nothing is unavailable, compensation guarantees y residual risks must be explicit, testable, y observable in reports.\n\n## Checklist\n- Model flows by intent, not only by transaccion count.\n- Annotate each step con dependencies y idempotency.\n- Require explicit compensation paths para value-transfer failures.\n- Produce deterministic safety reports para each flow version.\n- Teach users where all-or-nothing is guaranteed y where it is not.\n",
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
                      "Because intent-level modelo mentals are all-or-nothing",
                      "Because protocols always guarantee it",
                      "Because cartera adapters hide all failures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Users think in outcomes, not internal transaccion decomposition."
                  }
                ]
              }
            ]
          },
          "bundles-v2-flow-risk-points": {
            "title": "Multi-transaccion flows: approvals, ATA creation, swaps, refunds",
            "content": "# Multi-transaccion flows: approvals, ATA creation, swaps, refunds\n\nA reliable flow simulator must encode where partial execution risk lives. In practice, risk points cluster at boundaries: before value transfer, during value transfer, y after value transfer when cleanup or refund steps should run. This leccion maps common Solana flow stages y shows defensive controls that keep failure behavior predictable.\n\nThe first stage is prerequisite setup. Cuenta initialization y ATA creation are often safe y idempotent if implemented correctly, but they still consume fees y may fail under congestion. If setup fails, users should see precise messaging y retry guidance. If setup succeeds y later steps fail, your state machine must remember setup completion to avoid duplicate cuenta creation attempts.\n\nThe second stage is authorization-like setup. On Solana this may differ from EVM approvals, but the pattern remains: a step grants capability to later instrucciones. Non-idempotent or overly broad permissions here amplify downstream risk. Flow validadores should detect non-idempotent authorization steps y force explicit refund or revocation logic if subsequent steps fail.\n\nThe third stage is value transfer or swap execution. This is where market drift, stale quotes, y route failure can break expectations. A deterministic simulator should not fetch live prices; instead it should model success/failure branches y expected compensation behavior. This lets teams test policy without network noise.\n\nThe fourth stage is compensation. If swap execution fails after setup or partial settlement, compensation is the difference between recoverable error y user-facing loss. Compensation steps must be discoverable, ordered, y testable. Simulators should flag flows missing compensation when any non-idempotent or value-affecting step exists.\n\nThe fifth stage is cleanup. Cleanup can include revoking transient permissions, closing temporary cuentas, or recording final status artifacts. Cleanup should be safe to retry y should not hide failures. Some teams skip cleanup during congestion, but then debt accumulates in user cuentas y backend state.\n\nDefensive patterns include idempotency keys para orchestration, deterministic status transitions, y explicit issue codes para each risk category. Para example, the missing-refund issue code should always map to the same report semantics so monitoring dashboards remain stable.\n\nA flow graph explorer can teach these points effectively. By visualizing nodes y edges con risk annotations, teams quickly see where assumptions are weak. Edges should represent hard dependencies, not optional sequencing preferences. If a dependency references a missing step, the graph should fail validation immediately.\n\nDuring incident reviews, deterministic graph reports outperform log fragments. They provide compact, reproducible context: what was planned, what safety checks failed, y which invariants were violated. This reduces MTTR y avoids repeated misclassification.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Label setup, value, compensation, y cleanup steps explicitly.\n- Treat non-idempotent setup as high-risk without compensating actions.\n- Validate dependency graph integrity before execution planning.\n- Encode deterministic issue codes y severity mapping.\n- Keep simulator behavior offline y reproducible.\n",
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
            "title": "Explorer: flow graph steps y risk points",
            "content": "# Explorer: flow graph steps y risk points\n\nFlow graph explorers are most valuable when they highlight risk semantics, not just sequence order. A defensive explorer should display each step con dependency context, idempotency flag, y compensation coverage. Engineers should be able to answer three questions immediately: what can fail, what can be retried safely, y what protects users if a value step fails.\n\nStart by treating each node as a contract. A node contract defines preconditions, side effects, y postconditions. Preconditions include required upstream steps y expected inputs. Side effects include cuenta state changes or transfer intents. Postconditions include observable status updates y possible compensation requirements. When node contracts are explicit, validation rules become straightforward y deterministic.\n\nEdges in the graph should represent hard causality. If step B depends on step A output, represent that as an edge y validate existence at build time. Optional order preferences should not be encoded as dependencies because they can produce false positives y brittle reports. Keep graph semantics strict y minimal.\n\nRisk annotations should be first-class fields. Instead of deducing risk later from prose, attach tags such as value-transfer, non-idempotent, requires-refund, y cleanup-only. Report generation can then aggregate these tags into issue summaries y recommended mitigations.\n\nA robust explorer also teaches \"atomic in user model\" versus \"atomic on chain.\" You can annotate the whole flow con intent boundary metadata that states whether strict atomic guarantee exists. If not, the explorer should list compensation guarantees y residual risk in plain language.\n\nDeterministic bundle composition is a useful next layer. Even without calling relay services, you can generate a bundle artifact that enumerates transaccion groupings y invariants. This allows stable comparisons across policy revisions. If a future change removes a refund invariant, tests should fail immediately.\n\nEngineers should avoid dynamic output fields like timestamps inside core report payloads. Keep those in outer metadata if needed. Stable JSON y markdown outputs make review diffs reliable y reduce false positives in CI snapshots.\n\nFrom a teaching standpoint, explorer sessions should include both safe y unsafe examples. Seeing a missing dependency or missing refund issue in a concrete graph is more memorable than reading abstract warnings. The curso challenge sequence then asks learners to codify the same checks.\n\nFinally, remember that atomicity work is reliability work. It is not a special seguridad-only track. The same graph discipline helps product, backend, y support teams share one truth source para multi-step behavior.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Represent node contracts y dependency edges explicitly.\n- Annotate risk tags directly in graph data.\n- Distinguish user-intent atomicity from protocol guarantees.\n- Generate deterministic bundle y report artifacts.\n- Include unsafe example graphs in test fixtures.\n",
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
        "description": "Build, validate, y report deterministic flow safety con compensation checks, idempotency handling, y bundle artifacts.",
        "lessons": {
          "bundles-v2-build-atomic-flow": {
            "title": "Challenge: implement buildAtomicFlow()",
            "content": "Build a normalized deterministic flow graph from steps y dependencies.",
            "duration": "40 min",
            "hints": [
              "Normalize order by step ID y dependency ID para deterministic flow graphs.",
              "Emit explicit edges from dependency relationships."
            ]
          },
          "bundles-v2-validate-atomicity": {
            "title": "Challenge: implement validateAtomicity()",
            "content": "Detect partial execution risk, missing refunds, y non-idempotent steps.",
            "duration": "40 min",
            "hints": [
              "Detect missing refund branch para swap flows.",
              "Flag non-idempotent steps because retries can break all-or-nothing guarantees."
            ]
          },
          "bundles-v2-failure-handling-patterns": {
            "title": "Challenge: failure handling con idempotency keys",
            "content": "Encode deterministic failure handling metadata, including compensation state.",
            "duration": "35 min",
            "hints": [
              "Generate deterministic idempotency keys from stable inputs.",
              "Always emit explicit refund-path state para observability."
            ]
          },
          "bundles-v2-bundle-composer": {
            "title": "Challenge: deterministic bundle composer",
            "content": "Compose a deterministic bundle structure para an atomic flow. No relay calls.",
            "duration": "35 min",
            "hints": [
              "No real Jito calls. Build deterministic data structures only.",
              "One step per transaccion keeps test assertions simple y stable."
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
    "description": "Defensive swap UX engineering con deterministic risk grading, bounded slippage policies, y incident-ready safety communication.",
    "duration": "9 hours",
    "tags": [
      "mempool",
      "ux",
      "slippage",
      "risk-policy"
    ],
    "modules": {
      "mempoolux-v2-foundations": {
        "title": "Mempool Reality y UX Defense",
        "description": "Quote-to-execution risk modeling, slippage guardrails, y defensive user education para safer swap decisions.",
        "lessons": {
          "mempoolux-v2-quote-execution-gap": {
            "title": "What can go wrong between quote y execution",
            "content": "# What can go wrong between quote y execution\n\nA swap quote is a prediction, not a guarantee. Between quote generation y execution, liquidity changes, competing orders land, y network conditions shift. Users often assume that seeing a quote means they will receive that outcome, but production UX must teach y enforce the gap between quote time y execution time. This curso is defensive by diseno: no exploit strategies, only protective policy y communication.\n\nThe first risk is quote staleness. Even in calm periods, a quote generated several seconds ago can diverge from current route quality. During high activity, divergence can happen in sub-second windows. A protective UI should track quote age continuously y degrade confidence as age increases. At defined thresholds, it should warn or block execution until a refresh occurs.\n\nThe second risk is slippage misconfiguration. Slippage tolerance exists to bound acceptable execution drift. If set too tight, legitimate transacciones fail frequently. If set too wide, users can receive unexpectedly poor execution. Defensive systems define policy bounds y recommend values based on route characteristics, not a single static default.\n\nThe third risk is impacto de precio misunderstanding. Impacto de precio measures how much your order moves market price due to route depth. Slippage tolerance measures allowed execution variance. They are related but not interchangeable. Teaching this difference prevents users from widening slippage to \"fix\" impact-heavy trades that should instead be resized or rerouted.\n\nThe fourth risk is route complexity. Multi-hop routes can improve nominal quote value but introduce more points of state dependency y timing drift. A risk engine should cuenta para hop count as a reliability input. This does not mean all multi-hop routes are unsafe; it means risk should be surfaced proportionally.\n\nThe fifth risk is liquidity quality. Low-liquidity routes are more fragile under contention. Deterministic scoring can treat liquidity as one signal among many, producing grade outputs like low, medium, high, y critical. Grades should be accompanied by reasons, so warnings are explainable.\n\nProtective UX is not just warning banners. It includes defaults, disabled states, timed refresh prompts, y clear language about what each control does. If users do not understand controls, they either ignore them or misconfigure them. The best interfaces explain tradeoffs in one sentence y keep avanzado controls available without forcing novices into risky settings.\n\nPolicy engines should produce deterministic artifacts para testability. Given identical input tuples, risk grade y warnings should remain identical. This enables stable unit tests y predictable support behavior. It also allows teams to review policy changes as code diffs rather than subjective UI adjustments.\n\nThe goal is not zero failed swaps; the goal is informed, bounded risk con transparent behavior. Users accept tradeoffs when systems are honest y consistent.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Operator mindset\n\nProtected swap UX is policy UX. Defaults, warnings, y block states should be deterministic, explainable, y versioned so teams can defend decisions during incidents.\n\n## Checklist\n- Track quote age y apply graded stale-quote policies.\n- Separate impacto de precio education from slippage controls.\n- Incorporate route hops y liquidity into risk scoring.\n- Emit deterministic risk reasons para UX copy.\n- Block execution only when policy thresholds are clearly crossed.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mempoolux-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mempoolux-v2-l1-q1",
                    "prompt": "What is the primary difference between slippage y impacto de precio?",
                    "options": [
                      "Slippage is user tolerance; impact is market footprint",
                      "They are identical metrics",
                      "Impacto de precio only applies on CEXs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Slippage is a user-configured bound, while impact reflects route liquidity response to trade size."
                  }
                ]
              }
            ]
          },
          "mempoolux-v2-slippage-guardrails": {
            "title": "Slippage controls y guardrails",
            "content": "# Slippage controls y guardrails\n\nSlippage settings are a policy surface, not a cosmetic preference. Defensive swap UX defines explicit bounds, context-aware defaults, y clear consequences when users attempt risky overrides. This leccion focuses on guardrail diseno that reduces avoidable losses while preserving user agency.\n\nA strong policy starts con minimum y maximum bounds. The minimum protects against unusable settings that cause endless failures. The maximum protects against overly permissive settings that convert volatility into severe execution loss. Between bounds, choose a default aligned con typical route behavior. Para many flows this is moderate, then dynamically adjusted by quote freshness y impact context.\n\nGuardrails should respond to stale quotes. If quote age passes a threshold, a safe policy can lower recommended slippage y request refresh before signing. If quote age becomes severely stale, execution should be blocked con a deterministic message. Blocking should be rare but unambiguous. Users should know whether a refresh can unblock immediately.\n\nImpact-aware adjustment is another essential control. High projected impact may require either tighter trade sizing or broader tolerance depending on objective. Defensive UX should encourage reviewing trade size first, not instantly widening tolerance. If users choose high tolerance anyway, warnings should explain downside plainly.\n\nOverride behavior must be deterministic. When a user-selected value exceeds policy max, clamp it y emit a warning that can be exported in reports. Silent clamping is dangerous because users think they are running one setting while the engine uses another. Explicit feedback builds trust y prevents support confusion.\n\nCopy quality matters. Avoid technical jargon in warning body text. A good warning says what is wrong, why it matters, y what to do next. Para example: \"Quote is stale; refresh before signing to avoid outdated execution terms.\" This is better than \"staleness threshold exceeded.\" Engineers can keep technical details in debug exports.\n\nGuardrails should also integrate con route preview components. Showing risk grade beside slippage recommendation helps users interpret controls in context. If grade is high y slippage recommendation is near max, the UI should highlight additional caution y maybe suggest smaller size.\n\nFrom an implementation perspective, a pure deterministic function is ideal: input config plus quote context yields warnings, recommended bps, y blocked flag. This function can be unit tested across edge scenarios y reused in frontend y backend validation paths.\n\nFinally, policy reviews should be versioned. If teams change bounds or thresholds, they should compare old y new outputs across fixture sets before rollout. This prevents regressions where well-intended tweaks accidentally increase risk exposure.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Define min, default, y max slippage as explicit policy values.\n- Apply stale-quote logic before execution y adjust recommendations.\n- Clamp unsafe overrides con clear warning messages.\n- Surface blocked state only para clearly defined severe conditions.\n- Keep policy deterministic y version-reviewable.\n",
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
            "title": "Explorer: quote freshness timer y decision table",
            "content": "# Explorer: quote freshness timer y decision table\n\nA quote freshness explorer should make policy behavior obvious under time pressure. Users y engineers need to see when a quote transitions from safe to warning to blocked. This leccion defines a decision table approach that pairs timer state con slippage y impact context.\n\nThe timer should not be a decorative countdown. It is a state driver con explicit thresholds. Para example, 0-10 seconds may be low concern, 10-20 seconds warning, y above 20 seconds blocked para certain route classes. Thresholds can vary by asset class y liquidity quality, but the explorer must display the active policy version so users understand why behavior changed.\n\nDecision tables combine timer bands con additional signals: projected impact, hop count, y liquidity score. A single stale timer does not always imply severe risk; it depends on route fragility. Deterministic scoring helps aggregate these dimensions into one grade while preserving reason strings.\n\nAn effective explorer view presents both grade y recommendation fields. Grade communicates severity. Recommendation communicates next action: refresh quote, tighten slippage, reduce size, or proceed. Without recommendation, users see red flags but lack direction.\n\nEngineers should include edge fixtures where metrics conflict. Example: fresh quote but very high impact y low liquidity; or stale quote con low impact y high liquidity. These fixtures prevent simplistic heuristics from dominating policy y help teams calibrate thresholds intentionally.\n\nThe explorer also supports user education around anti-sandwich posture without teaching offensive behavior. You can explain that wider slippage y stale quotes increase adverse execution risk, y that refreshing quote plus tighter controls reduces exposure. Keep messaging defensive y practico.\n\nPara reliability teams, deterministic explorer outputs become regression baselines. If a code change alters grade para a fixture unexpectedly, CI catches it before production. This is particularly important when tuning thresholds during volatile periods.\n\nOutput formatting should remain stable. Use canonical JSON order para exported config, y stable markdown para support docs. Avoid timestamps in core payloads to preserve snapshot equality. If timestamps are required, store them outside deterministic artifact fields.\n\nFinally, link explorer states to UI banners. If grade is critical, banner severity should be error con explicit action. If grade is medium, warning banner con optional guidance may suffice. This mapping is implemented in later challenges.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Treat freshness timer as policy input, not visual decoration.\n- Combine timer state con impact, hops, y liquidity signals.\n- Emit grade plus actionable recommendation.\n- Test conflicting-signal fixtures para policy balance.\n- Keep exported artifacts deterministic y stable.\n",
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
        "description": "Implement deterministic policy engines, safety messaging, y stable protection-config artifacts para release gobernanza.",
        "lessons": {
          "mempoolux-v2-evaluate-swap-risk": {
            "title": "Challenge: implement evaluateSwapRisk()",
            "content": "Implement deterministic swap risk grading from quote, slippage, impact, hops, y liquidity inputs.",
            "duration": "40 min",
            "hints": [
              "Use additive policy scoring from quote freshness, slippage, impact, route, y liquidity.",
              "Return both risk grade y concrete reasons para UX copy generation."
            ]
          },
          "mempoolux-v2-slippage-guard": {
            "title": "Challenge: implement slippageGuard()",
            "content": "Build bounded slippage recommendations con warnings y hard-block states.",
            "duration": "40 min",
            "hints": [
              "Clamp recommended BPS to policy bounds.",
              "Stale quotes should lower tolerance y may block if very stale."
            ]
          },
          "mempoolux-v2-impact-vs-slippage": {
            "title": "Challenge: model impacto de precio vs slippage",
            "content": "Encode a deterministic interpretation of impact-to-tolerance ratio para user education.",
            "duration": "35 min",
            "hints": [
              "Teach difference: impact is market footprint, slippage is user tolerance.",
              "Return both ratio y interpretation para UI hints."
            ]
          },
          "mempoolux-v2-swap-safety-banner": {
            "title": "Challenge: build swapSafetyBanner()",
            "content": "Map deterministic risk grades to defensive banner copy y severity.",
            "duration": "35 min",
            "hints": [
              "Map risk grades to deterministic banner copy.",
              "Avoid exploit framing; keep copy defensive y user-focused."
            ]
          },
          "mempoolux-v2-protection-config-export": {
            "title": "Checkpoint: swap protection config export",
            "content": "Export a stable deterministic policy config artifact para the Protected Swap UI checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be deterministic JSON para copy/export behavior.",
              "Do not include timestamps or random IDs."
            ]
          }
        }
      }
    }
  },
  "indexing-webhooks-pipelines": {
    "title": "Indexers, Webhooks & Reorg-Safe Pipelines",
    "description": "Build production-grade deterministic indexing pipelines para duplicate-safe ingestion, reorg handling, y integrity-first reporting.",
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
        "description": "Event identity modeling, confirmation semantics, y deterministic ingest-to-apply pipeline behavior.",
        "lessons": {
          "indexpipe-v2-indexing-basics": {
            "title": "Indexing 101: logs, cuentas, y transaccion parsing",
            "content": "# Indexing 101: logs, cuentas, y transaccion parsing\n\nReliable indexers are not just fast parsers. They are consistency systems that decide what to trust, when to trust it, y how to recover from changing chain history. On Solana, event ingestion often starts from logs or parsed instrucciones, but production pipelines need deterministic keying, replay controls, y state application rules that survive retries y reorgs.\n\nA basic pipeline has four stages: ingest, dedupe, confirmation gating, y state apply. Ingest captures raw events con enough metadata to reconstruct ordering context: slot, signature, instruccion index, event type, y affected cuenta. Dedupe ensures duplicate deliveries do not produce duplicate state transitions. Confirmation gating delays state application until depth conditions are met. Apply mutates snapshots in deterministic order.\n\nMany teams fail in the first stage by capturing incomplete event identity fields. If you omit instruccion index or event kind, collisions appear y dedupe becomes unsafe. Composite keys should be explicit y stable. They should also be derived purely from event payload so keys remain reproducible in tests y backfills.\n\nParsing strategy matters too. Logs are convenient but can drift across program versions. Parsed instruccion data can be more structured but may require custom decoders. Defensive indexing stores normalized events in one canonical schema regardless of source. This isolates downstream logic from parser changes.\n\nIdempotency is essential. Your ingestion path may receive duplicates from retries, webhook redelivery, or backfill overlap. If dedupe is weak, balances drift y downstream analytics become untrustworthy. Deterministic dedupe con composite keys is the first line of defense.\n\nThe apply stage should avoid hidden nondeterminism. If events are applied in arrival order without stable sort keys, two replays can produce different snapshots. Always sort by deterministic key before apply. If you need tie-breakers, define them explicitly.\n\nSnapshot diseno should prioritize auditability. Keep applied event keys, pending keys, y finalized keys visible. These sets make it easy to reason about what the snapshot currently reflects y why. They also simplify integrity checks later.\n\nFinally, keep deterministic outputs central to your developer workflow. Pipeline reports y snapshots should be exportable in stable formats para test snapshots y incident analysis. Reliability work depends on reproducible evidence.\n\n\nTo keep this durable, teams should document fixture ownership y rotate review responsibilities so event taxonomy stays aligned con protocol upgrades. Without this operational ownership, pipelines drift into untested assumptions, y recovery playbooks age out. Deterministic explorers stay valuable only when fixtures evolve con production reality y every stage still reports clear, machine-verifiable state transitions under replay y stress.\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Operator mindset\n\nIndexing is a correctness pipeline before it is an analytics pipeline. Fast ingestion con weak dedupe, confirmation, or replay guarantees produces confidently wrong outputs.\n\n## Checklist\n- Capture complete event identity fields at ingest time.\n- Normalize events from logs y parsed instrucciones into one schema.\n- Use deterministic composite keys para dedupe.\n- Sort events stably before state application.\n- Track applied, pending, y finalized sets in snapshots.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexpipe-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexpipe-v2-l1-q1",
                    "prompt": "Why is instruccion index important in event keys?",
                    "options": [
                      "It helps prevent collisions when one transaccion emits similar events",
                      "It reduces RPC cost directly",
                      "It replaces confirmation checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Instruccion index distinguishes same-signature events that would otherwise collide in dedupe."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            "title": "Reorgs y fork choice: why confirmed is not finalized",
            "content": "# Reorgs y fork choice: why confirmed is not finalized\n\nConfirmation labels are useful but often misunderstood in indexing pipelines. A confirmed event has stronger confidence than processed, but it is not equivalent to final settlement. Pipelines that apply confirmed events directly to user-visible balances without rollback strategy can show transient truth as permanent truth. Defensive diseno acknowledges this y encodes reversible state transitions.\n\nReorg-aware indexing starts con depth thresholds. Para each event, compute depth as head slot minus event slot. If depth is below confirmed threshold, event remains pending. If depth passes confirmed threshold, event can be applied to provisional state. If depth passes finalized threshold, event is considered settled. These rules should be policy inputs, not hidden constants.\n\nWhy maintain provisional state at all? Because users y systems often need timely feedback before finalization. The solution is not to ignore confirmed events but to annotate confidence clearly. Dashboards can show provisional balances con settlement badges. Automated systems can choose whether to act on provisional or finalized data.\n\nFork choice changes can invalidate previously observed confirmed events. If your pipeline tracks applied keys y supports replay, you can recompute snapshot deterministically from deduped events y updated confirmation context. Pipelines that mutate opaque state without replay ability struggle during reorg recovery.\n\nDeterministic apply logic helps here. If the same deduped event set y same confirmation policy produce the same snapshot every run, recovery is straightforward. If apply order depends on arrival timing, recovery becomes guesswork.\n\nAnother reliability pattern is explicit pending queues. Instead of dropping low-depth events, keep them keyed y observable. This improves debugging: you can explain to users that an event exists but has not crossed confirmation threshold. It also avoids ingestion gaps when head advances.\n\nIntegrity checks should enforce structural assumptions: finalized keys must be a subset of applied keys, balances must be finite y non-negative under your business rules, y snapshot counts should align con event sets. Failing these checks should mark snapshot as invalid y block downstream export.\n\nCommunication matters as much as mechanics. Product teams should avoid copy that implies final settlement when data is only confirmed. Small text differences reduce major support incidents during volatile periods.\n\nThe overarching principle is to make uncertainty explicit y reversible. Reorg-safe pipelines are less about predicting forks y more about handling them cleanly when they happen.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Define confirmed y finalized depth thresholds explicitly.\n- Separate pending, applied, y finalized event sets.\n- Keep replayable deterministic apply logic.\n- Run integrity checks on every snapshot export.\n- Surface settlement confidence clearly in UI y APIs.\n",
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
                    "note": "Candidate para provisional state."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-pipeline-explorer": {
            "title": "Explorer: ingest to dedupe to confirm to apply",
            "content": "# Explorer: ingest to dedupe to confirm to apply\n\nA pipeline explorer should explain transformation stages clearly so engineers can inspect where correctness can break. Para indexing reliability, the core stages are ingest, dedupe, confirmation gating, y apply. Each stage must expose deterministic inputs y outputs.\n\nIngest stage receives raw events from simulated webhooks, log streams, or backfills. At this point, duplicates y out-of-order delivery are expected. The explorer should show raw count y normalized schema count so users can verify parser coverage.\n\nDedupe stage converts event arrays into a set based on composite keys. Good explorers display before/after counts y list dropped duplicates. This transparency helps debug webhook retries y backfill overlap behavior.\n\nConfirmation stage partitions deduped events into pending, applied, y finalized sets based on depth policy. The explorer should make head slot y policy thresholds visible. Hidden thresholds are a frequent source of confusion when teams compare environments.\n\nApply stage computes cuenta balances or state snapshots deterministically from applied events only. Explorer outputs should include sorted balances y event key lists. Sorted output is crucial para snapshot equality pruebas.\n\nIntegrity stage validates structural assumptions: no negative balances, no non-finite numbers, finalized subset relation, y stable event references. The explorer should display PASS/FAIL y issue list. This teaches engineers to treat integrity checks as mandatory gates, not optional diagnostics.\n\nPara backfills, explorer scenarios should include missing-slot windows y idempotency keys. This demonstrates how replay-safe job planning interacts con the same dedupe y apply rules. A reliable backfill system does not bypass core pipeline logic.\n\nDeterministic report generation closes the loop. Export markdown para human review y JSON para machine consumption. Both should be reproducible from the same snapshot object. Avoid embedding volatile metadata in core payload fields.\n\nA well-designed explorer becomes a teaching tool y an operational tool. During incidents, teams can replay problematic event sets y compare outputs across policy versions. During onboarding, new engineers aprende stage responsibilities quickly without production access.\n\nOperational ownership keeps this useful over time. Teams should rotate fixture maintenance responsibilities y document why each scenario exists so updates remain intentional. As protocols evolve, parser assumptions y event fields can drift. A maintained explorer corpus catches drift early, forces policy review before releases, y preserves confidence that ingest, dedupe, confirmation gating, y apply stages still produce reproducible results under stress.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Show per-stage counts y transformations.\n- Make confirmation policy parameters explicit.\n- Render sorted deterministic snapshots.\n- Gate exports on integrity checks.\n- Keep report payloads stable para regression tests.\n",
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
        "description": "Build dedupe, confirmation-aware apply logic, integrity gates, y stable reporting artifacts para operational triage.",
        "lessons": {
          "indexpipe-v2-dedupe-events": {
            "title": "Challenge: implement dedupeEvents()",
            "content": "Implement stable event deduplication con deterministic composite keys.",
            "duration": "40 min",
            "hints": [
              "Build stable composite keys para dedupe.",
              "Sort by key so output is deterministic across runs."
            ]
          },
          "indexpipe-v2-apply-confirmations": {
            "title": "Challenge: implement applyWithConfirmations()",
            "content": "Apply events deterministically con confirmation depth policy y pending/finalized sets.",
            "duration": "40 min",
            "hints": [
              "Apply only confirmed-depth events to state.",
              "Track pending y finalized sets separately para reorg safety."
            ]
          },
          "indexpipe-v2-backfill-idempotency": {
            "title": "Challenge: backfill y idempotency planning",
            "content": "Create deterministic backfill planning output con replay-safe idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Backfills should be resumable y idempotent.",
              "Emit a deterministic key para replay-safe job scheduling."
            ]
          },
          "indexpipe-v2-snapshot-integrity": {
            "title": "Challenge: snapshot integrity checks",
            "content": "Implement deterministic snapshotIntegrityCheck() outputs para negative y structural failures.",
            "duration": "35 min",
            "hints": [
              "Integrity checks must fail on negative balances.",
              "Finalized keys must always be a subset of applied keys."
            ]
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline report export",
            "content": "Generate a stable markdown report artifact para the Reorg-Safe Indexer checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be markdown y deterministic.",
              "Include applied/pending/finalized counts y integrity result."
            ]
          }
        }
      }
    }
  },
  "rpc-reliability-latency": {
    "title": "RPC Reliability & Latency Engineering",
    "description": "Engineer production multi-provider Solana RPC clients con deterministic retry, routing, caching, y observability policies.",
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
        "description": "Real-world RPC failure behavior, endpoint selection strategy, y deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
            "content": "# RPC failures in real life: timeouts, 429s, stale nodes\n\nReliable client infrastructure begins con realistic failure assumptions. RPC calls fail para many reasons: transient network timeouts, provider rate limits, stale nodes trailing cluster head, y occasional inconsistent responses under load. A defensive client does not treat these as edge cases; it treats them as normal operating conditions.\n\nTimeouts are the most common class. If timeout values are too short, healthy providers appear unreliable. If too long, user-facing latency becomes unacceptable y retries trigger too late. Good policy defines request timeout by operation type y sets bounded retry schedules.\n\nHTTP 429 rate limiting is another predictable behavior, not a surprise. Providers enforce quotas y burst controls. A resilient client observes 429 ratio per endpoint y adapts by reducing pressure on overloaded nodes while shifting traffic to healthier ones. Blind retry against the same endpoint amplifies throttling.\n\nStale node lag is particularly dangerous para state-sensitive applications. A node can respond quickly but serve outdated slot state, causing confusing balances or stale quote decisions. Endpoint health scoring should include slot lag, not only latency y success rate.\n\nMulti-provider strategy is the baseline para serious applications. Even when one provider is excellent, outages y regional issues happen. A client should maintain endpoint metadata, collect health samples, y choose endpoints by deterministic policy rather than random rotation.\n\nObservability is what makes reliability engineering actionable. Track total requests, success/error counts, latency quantiles, y histogram buckets. Without this telemetry, teams tune retry policies by anecdote. Con telemetry, teams can identify whether changes improve p95 latency or simply shift failures around.\n\nDeterministic policy modeling is valuable before production integration. You can simulate endpoint samples y verify that selection behavior is stable y explainable. If the chosen endpoint changes unexpectedly para identical input samples, your scoring function needs refinement.\n\nCaching adds complexity. Cache misses y stale reads are not just rendimiento details; they affect correctness. Invalidation policy should react to cuenta changes y node lag. Aggressive invalidation may increase load; weak invalidation may serve stale state. Explicit policy y metrics help navigate this tradeoff.\n\nThe core message is pragmatic: assume RPC instability, diseno para graceful degradation, y measure everything con deterministic reducers that can be unit tested.\n\n\nOperational readiness also requires owning fixture updates as providers change rate-limit behavior y latency profiles. If fixture sets stay static, policy tuning optimizes para old incidents y misses new failure signatures. Keep a cadence para reviewing percentile distributions, endpoint score drift, y retry outcomes so deterministic policies remain grounded in current provider behavior while preserving reproducibility.\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Operator mindset\n\nRPC policy is risk routing, not just request routing. Endpoint choice, retry cadence, y cache invalidation directly determine whether users see timely truth or stale confusion.\n\n## Checklist\n- Treat timeouts, 429s, y stale lag as default conditions.\n- Use multi-provider endpoint selection con health scoring.\n- Include slot lag in endpoint quality calculations.\n- Define retry schedules con bounded backoff.\n- Instrument latency y success metrics continuously.\n",
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
                      "Slot lag only affects validador rewards",
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
            "title": "Multi-endpoint strategies: hedged requests y fallbacks",
            "content": "# Multi-endpoint strategies: hedged requests y fallbacks\n\nMulti-endpoint diseno is more than adding a backup URL. It is a scheduling problem where each request should be sent to the most suitable endpoint given recent health signals y operation urgency. This leccion focuses on deterministic strategy patterns you can validate offline.\n\nFallback strategy is the simplest pattern: try one endpoint, then another on failure. It reduces outage risk but may still produce high tail latency if initial endpoints are degraded. Hedged strategy improves tail latency by issuing a second request after a short delay if the first has not returned. Hedging increases load, so it must be controlled by policy y only used para high-value paths.\n\nEndpoint selection should rely on a composite score that includes success rate, p95 latency, rate-limit ratio, slot lag, y optional static weight para trusted providers. Scores should be computed deterministically from sampled inputs so decisions are reproducible. Tie-breaking should also be deterministic to avoid flapping.\n\nRate-limit-aware routing is critical. If one provider shows increasing 429 ratio, a resilient client should back off traffic there y prefer alternatives. This avoids retry storms y helps maintain aggregate throughput.\n\nRegional diversity adds resilience. If all endpoints are in one region, regional network incidents can affect all providers simultaneously. Tagging endpoints by region allows policy constraints such as preferring local region first but failing over cross-region when health degrades.\n\nCircuit-breaking patterns can protect users during severe incidents. If an endpoint crosses error thresholds, mark it temporarily degraded y avoid selecting it para a cooling period. Deterministic simulations can model this behavior without real network calls.\n\nObservability ties it together. Endpoint decisions should emit reasoning strings or structured fields so operators can inspect why a node was chosen. This is especially useful when users report intermittent failures.\n\nIn many systems, endpoint policy y retry policy are separate modulos. Keep interfaces clean: selection chooses target endpoint, retry schedule defines attempts y delays, metrics reducer evaluates outcomes. This separation improves testability y change safety.\n\nFinally, avoid hidden randomness in core selection logic. Randomized tie-breakers may seem harmless but they complicate reproducibility y debugging. Deterministic order supports reliable incident analysis.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Score endpoints using multiple reliability signals.\n- Use deterministic tie-breaking to avoid flapping.\n- Apply rate-limit-aware traffic shifting.\n- Keep fallback y retry policy responsibilities separate.\n- Emit endpoint reasoning para operational debugging.\n",
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
                    "output": "score lower due to throttling y lag",
                    "note": "Fast but less reliable under pressure."
                  }
                ]
              }
            ]
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
            "content": "# Explorer: retry/backoff simulator\n\nRetry y backoff policies determine whether clients recover gracefully or amplify outages. A simulator should make schedule behavior explicit so teams can reason about user latency y provider pressure. This leccion builds a deterministic view of retry policy outputs y their tradeoffs.\n\nA retry schedule has three core dimensions: number of attempts, per-attempt timeout, y delay before each retry. Exponential backoff grows delay rapidly y reduces pressure in prolonged incidents. Linear backoff grows slower y can be useful para short-lived blips. Both need max-delay caps to avoid runaway wait times.\n\nThe first attempt should always be represented in the schedule con zero delay. This improves traceability y ensures telemetry can map attempt index to behavior consistently. Many teams model only retries y lose visibility into full request lifecycle.\n\nPolicy inputs should be validated. Negative retries or non-positive timeouts are configuration errors y should fail fast. Deterministic validation in a pure function prevents silent misconfiguration in production.\n\nThe simulator should also show expected user-facing latency envelope. Para example, timeout 900ms con two retries y exponential delays of 100ms y 200ms implies worst-case response around 2.9 seconds before failover completion. This helps product teams set realistic loading copy.\n\nRetry policy must integrate con endpoint selection. Retrying against the same degraded endpoint repeatedly is usually inferior to endpoint-aware retries. Even if your simulator keeps modulos separate, it should explain this interaction.\n\nJitter is often used in distributed systems to prevent synchronization spikes. In this deterministic curso we omit jitter from challenge outputs para snapshot stability, but teams should understand where jitter fits in production.\n\nMetrics reducers provide feedback loop para tuning. If p95 improves but error count rises, policy may be too aggressive. If errors drop but latency explodes, policy may be too conservative. Deterministic histogram y quantile outputs make this tradeoff visible.\n\nA final best practice is policy versioning. When retry settings change, compare outputs para fixture scenarios before despliegue. This catches accidental behavior changes y enables confident rollbacks.\n\nOperational readiness also requires a habit of refreshing fixture sets as provider behavior evolves. Rate-limit patterns, slot lag profiles, y latency distributions change over time, y static fixtures can hide policy regressions. Reliability teams should schedule periodic fixture audits, compare score deltas across providers, y document threshold changes so retry y selection policies remain explainable y reproducible under current network conditions.\n\n\nThis material should be operationalized con deterministic fixtures y explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, y severe stress. Para each scenario, compare policy outputs before y after changes, y require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned con runtime behavior, y makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, y they keep fixture ownership explicit so updates remain intentional y auditable.\n\n## Checklist\n- Represent full schedule including initial attempt.\n- Validate retry configuration inputs strictly.\n- Bound delays con max caps.\n- Estimate user-facing worst-case latency from schedule.\n- Review policy changes against deterministic fixtures.\n",
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
        "description": "Build deterministic policy engines para routing, retries, metrics reduction, y health report exports.",
        "lessons": {
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
            "content": "Build deterministic timeout y retry schedule outputs from policy input.",
            "duration": "40 min",
            "hints": [
              "Build a deterministic retry schedule including the first attempt.",
              "Cap delays at maxDelayMs."
            ]
          },
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
            "content": "Choose the best endpoint deterministically from health samples y endpoint metadata.",
            "duration": "40 min",
            "hints": [
              "Blend success rate, latency, 429 pressure, y slot lag into one score.",
              "Tie-break deterministically by endpoint ID."
            ]
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching y invalidation policy",
            "content": "Emit deterministic cache invalidation actions when cuenta updates y lag signals arrive.",
            "duration": "35 min",
            "hints": [
              "Invalidate cuenta-keyed cache entries deterministically.",
              "Use tighter TTL when node lag grows."
            ]
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer y histogram buckets",
            "content": "Reduce simulated RPC events into deterministic histogram y p50/p95 metrics.",
            "duration": "35 min",
            "hints": [
              "Reduce RPC telemetry into histogram buckets y quantiles.",
              "Keep bucket boundaries explicit para deterministic snapshots."
            ]
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
            "content": "Export deterministic JSON y markdown health report artifacts para multi-provider reliability review.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export both JSON y markdown.",
              "Ensure field order is stable in JSON output."
            ]
          }
        }
      }
    }
  },
  "rust-data-layout-borsh": {
    "title": "Rust Data Layout & Borsh Mastery",
    "description": "Rust-first Solana data layout engineering con deterministic byte-level tooling y compatibility-safe schema practices.",
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
        "description": "Alignment behavior, Borsh encoding rules, y practico parsing safety para stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, y why Solana cuentas care",
            "content": "# Memory layout: alignment, padding, y why Solana cuentas care\n\nRust layout behavior is deterministic inside one compiled binary but can vary when assumptions are implicit. Para Solana cuentas, this matters because raw bytes are persisted on-chain y parsed by multiple clients across versions. If you diseno cuenta structures without explicit layout strategy, subtle padding y alignment changes can break compatibility or produce incorrect parsing in downstream tools.\n\nRust default layout optimizes para compiler freedom. Field order in memory para plain structs is not a stable ABI contract unless you opt into representations such as repr(C). In low-level cuenta work, repr(C) gives more predictable ordering y alignment behavior, but it does not remove all complexity. Padding still appears between fields when alignment requires it. Para example, a u8 followed by u64 introduces 7 bytes of padding before the u64 offset. If your parser ignores this, every field after that point is shifted y corrupted.\n\nOn Solana, cuenta rent is proportional to byte size, so padding is not only a correctness issue; it is a cost issue. Poor field ordering can inflate cuenta sizes across millions of cuentas. A common optimization is grouping larger aligned fields first, then smaller fields. But this must be balanced against readability y migration safety. If you reorder fields in a live protocol, old data may no longer parse under new assumptions. Migration tooling should be explicit y versioned.\n\nBorsh serialization avoids some ABI ambiguity by defining field order in schema rather than raw struct memory. However, zero-copy patterns y manual slicing still depend on precise offsets. Teams should understand both worlds: in-memory layout rules para zero-copy y schema-based encoding rules para Borsh.\n\nIn production engineering, layout decisions should be documented con deterministic outputs: field offsets, per-field padding, struct alignment, y total size. These outputs can be compared in CI to catch accidental drift from refactors. The goal is not theoretical elegance; the goal is stable data contracts over time.\n\n## Operator mindset\n\nSchema bytes are production API surface. Treat offset changes, enum ordering, y parser semantics as compatibility events requiring explicit review.\n\nProduction teams should treat layout y serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, y require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, y parser error behavior para malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on cuenta size, rent budget, y compatibility. Deterministic helpers make this practico: you can produce a stable JSON report in CI y diff it like source code. In Solana y Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after despliegue.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough para incident response. Good error payloads include field name, offset, y failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important para indexers y analytics pipelines that need to decide whether to quarantine an event or retry con a newer schema version. Teams that encode rich deterministic error reports reduce triage time y avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, y test every boundary condition before shipping.\n\nTeams should also document explicit schema gobernanza rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, y compatibility con archived reports. A healthy gobernanza checklist asks who owns schema evolution, how compatibility windows are communicated, y which fixtures are mandatory before release. This level of process may feel heavy para small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the practico mechanism that keeps this gobernanza lightweight enough to use: they are simple to diff, easy to discuss, y difficult to misinterpret.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rdb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rdb-v2-l1-q1",
                    "prompt": "Why does a u8 before u64 often increase cuenta size?",
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
            "title": "Struct y enum layout pitfalls plus Borsh rules",
            "content": "# Struct y enum layout pitfalls plus Borsh rules\n\nBorsh is widely used because it gives deterministic serialization across languages, but teams still get tripped up by how enums, vectors, y strings map to bytes. Understanding these rules is essential para robust cuenta parsing y client interoperability.\n\nPara structs, Borsh encodes fields in declaration order. There is no implicit alignment padding in the serialized stream. That is different from in-memory layout y one reason Borsh is popular para stable wire formats. Para enums, Borsh writes a one-byte variant index first, then the variant payload. Changing variant order in code changes the index mapping y is therefore a breaking format change. This is a common source of accidental incompatibility.\n\nVectors y strings are length-prefixed con little-endian u32 before data bytes. If parsing code trusts the length blindly without bounds checks, malformed or truncated data can cause out-of-bounds reads or allocation abuse. Safe parsers validate available bytes before allocating or slicing.\n\nAnother pitfall is conflating pubkey strings con pubkey bytes. Borsh encodes bytes, not base58 text. If a client serializes public keys as strings while another expects 32-byte arrays, decoding fails despite both sides using \"Borsh\" terminology. Teams should define schema types precisely.\n\nError diseno is part of serialization safety. Distinguish malformed length prefix, unknown enum variant, unsupported dynamic type, y primitive decode out-of-bounds. Structured errors let callers decide whether to retry, drop, or quarantine payloads.\n\nFinally, encoding y decoding tests should run symmetrically con fixed fixtures. A deterministic fixture suite catches regressions early y gives confidence that Rust, TypeScript, y analytics parsers agree on the same bytes.\nProduction teams should treat layout y serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, y require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, y parser error behavior para malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on cuenta size, rent budget, y compatibility. Deterministic helpers make this practico: you can produce a stable JSON report in CI y diff it like source code. In Solana y Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after despliegue.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough para incident response. Good error payloads include field name, offset, y failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important para indexers y analytics pipelines that need to decide whether to quarantine an event or retry con a newer schema version. Teams that encode rich deterministic error reports reduce triage time y avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, y test every boundary condition before shipping.\n\nTeams should also document explicit schema gobernanza rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, y compatibility con archived reports. A healthy gobernanza checklist asks who owns schema evolution, how compatibility windows are communicated, y which fixtures are mandatory before release. This level of process may feel heavy para small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the practico mechanism that keeps this gobernanza lightweight enough to use: they are simple to diff, easy to discuss, y difficult to misinterpret.\n",
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
            "title": "Explorer: layout visualizer para field offsets",
            "content": "# Explorer: layout visualizer para field offsets\n\nA layout visualizer turns abstract alignment rules into concrete numbers engineers can review. Instead of debating whether a struct is \"probably fine,\" teams can inspect exact offsets, padding, y total size.\n\nThe visualizer workflow is straightforward: provide ordered fields y types, compute alignments, insert required padding, y emit final layout metadata. This output should be deterministic y serializable so CI can compare snapshots.\n\nWhen using this in Solana development, combine visualizer output con cuenta rent planning y migration docs. If a proposed field addition increases total size, quantify the impact y decide whether to append, split cuenta state, or introduce versioned cuentas. Do not rely on intuition para byte-level decisions.\n\nVisualizers are also useful para onboarding. New contributors can quickly see why u8/u64 ordering changes offsets y why safe parsers need explicit bounds checks. This reduces recurring parsing bugs y review churn.\n\nA high-quality visualizer report includes field name, offset, size, alignment, padding-before, trailing padding, y struct alignment. Keep key ordering stable so report diffs remain readable.\n\nEngineers should pair visualizer output con parse tests. If layout says a bool lives at offset 0 y u8 at offset 1, parser tests should assert exactly that. Deterministic systems connect diseno artifacts y runtime checks.\nProduction teams should treat layout y serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, y require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, y parser error behavior para malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on cuenta size, rent budget, y compatibility. Deterministic helpers make this practico: you can produce a stable JSON report in CI y diff it like source code. In Solana y Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after despliegue.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough para incident response. Good error payloads include field name, offset, y failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important para indexers y analytics pipelines that need to decide whether to quarantine an event or retry con a newer schema version. Teams that encode rich deterministic error reports reduce triage time y avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, y test every boundary condition before shipping.\n\nTeams should also document explicit schema gobernanza rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, y compatibility con archived reports. A healthy gobernanza checklist asks who owns schema evolution, how compatibility windows are communicated, y which fixtures are mandatory before release. This level of process may feel heavy para small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the practico mechanism that keeps this gobernanza lightweight enough to use: they are simple to diff, easy to discuss, y difficult to misinterpret.\n",
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
        "title": "Cuenta Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, y compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
            "content": "Compute deterministic field offsets, alignment padding, y total struct size.",
            "duration": "40 min",
            "hints": [
              "Use alignment-aware offsets y include padding fields in the result.",
              "Struct total size should be aligned to max field alignment."
            ]
          },
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
            "content": "Implement deterministic Borsh encode/decode con structured error handling.",
            "duration": "40 min",
            "hints": [
              "Borsh strings are length-prefixed little-endian u32 + UTF-8 bytes.",
              "Keep encode/decode symmetric para deterministic tests."
            ]
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
            "content": "Model deterministic tradeoff scoring between zero-copy y Borsh approaches.",
            "duration": "35 min",
            "hints": [
              "Model tradeoffs deterministically: read speed vs schema flexibility.",
              "Recommendation should be pure function of inputs."
            ]
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
            "content": "Parse cuenta bytes con deterministic bounds checks y structured errors.",
            "duration": "35 min",
            "hints": [
              "Validate byte length before field parsing.",
              "Return structured errors para invalid booleans y unsupported field types."
            ]
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
            "content": "Produce stable JSON y markdown layout artifacts para the final project.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export stable JSON + markdown.",
              "Avoid random IDs y timestamps in output."
            ]
          }
        }
      }
    }
  },
  "rust-errors-invariants": {
    "title": "Rust Error Diseno & Invariants",
    "description": "Build typed invariant guard libraries con deterministic evidence artifacts, compatibility-safe error contracts, y audit-ready reporting.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "errors",
      "invariants",
      "reliability"
    ],
    "modules": {
      "rei-v2-foundations": {
        "title": "Rust Error y Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, y deterministic invariant diseno fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
            "content": "# Error taxonomy: recoverable vs fatal\n\nRust encourages explicit error modeling, but teams still produce weak error contracts when they rely on ad hoc strings or inconsistent wrappers. In Solana y Anchor-adjacent systems, this becomes painful quickly because on-chain failures, off-chain pipelines, y frontend UX all need coherent semantics.\n\nA practico taxonomy starts con recoverable versus fatal classes. Recoverable errors represent expected contract violations: stale data, missing signer, value out of range, or transient dependency mismatch. Fatal errors represent corrupted assumptions: impossible state, incompatible schema version, or invariant breach that requires operator intervention.\n\nTyped enums are the center of this diseno. A code such as NEGATIVE_VALUE or MISSING_AUTHORITY is unambiguous y searchable. Attaching structured context fields gives downstream systems enough detail para logging y user-facing copy without string parsing.\n\nAvoid stringly error contracts where every caller invents custom messages. Those systems accumulate inconsistent wording y ambiguous categories. Instead, keep messages deterministic y derive user copy from code + context in one mapping layer.\n\nInvariants should be designed para testability. If an invariant cannot be expressed as a deterministic function over known inputs, it is hard to validate y easy to regress. Start con small ensure helpers that return typed results, then compose them into higher-level guards.\n\nIn production, error taxonomies should be reviewed like API changes. Renaming codes or changing severity mapping can break alert rules y client handling. Version these changes y validate con fixture suites.\n\n## Operator mindset\n\nInvariant errors are operational contracts. If code, severity, y context are not stable, monitoring y user recovery flows degrade even when logic is correct.\n\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, y explicit severity mapping so runtime incidents are diagnosable without guessing. Para invariants, each failed check should identify what contract was violated, where in the flow it happened, y whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent y alert tuning becomes fragile. A typed error library con deterministic reports solves this by making failure semantics machine-readable y human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain con injected timestamps y step IDs gives auditors y engineers a replayable explanation of what passed, what failed, y in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old y new evidence outputs y verify expected changes before despliegue. Over time, these deterministic artifacts become part of release discipline y reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries y confirm that alerts, dashboards, y user-facing copy still map correctly. If mappings drift, update guides y fallback behavior should ship together con code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users y support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, y a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors y reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it con quarterly reviews where engineers evaluate false-positive rates, update context fields, y verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, y communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                      "They remove need para logs",
                      "They reduce compile time"
                    ],
                    "answerIndex": 0,
                    "explanation": "Typed codes make handling y monitoring deterministic."
                  }
                ]
              }
            ]
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, y context",
            "content": "# Result<T, E> patterns, ? operator, y context\n\nResult-based control flow is one of Rust's strongest tools para building robust services y on-chain-adjacent clients. The key is not merely using Result, but designing error types y propagation boundaries that preserve enough context para debugging y UX decisions.\n\nThe ? operator keeps code concise, but it can hide context unless error conversion layers are explicit. Invariant-centric systems should wrap lower-level failures con domain meaning before returning to upper layers. Para example, a parse failure in cuenta metadata should map to a deterministic invariant code y include the field path.\n\nContext should be structured rather than baked into message text. A map of key/value fields like {label, value, limit} is easier to aggregate y filter than sentence fragments. It also supports localization y role-specific message rendering.\n\nAnother pattern is separating validation from side effects. If ensure helpers only evaluate conditions y construct typed errors, they are deterministic y unit-testable. Side effects such as logging or telemetry emission can happen at call boundaries.\n\nWhen building libraries, avoid exposing too many internal codes. Public codes should represent stable contracts, while internal details can remain nested context. This helps keep compatibility manageable.\n\nTest strategy should include positive cases, negative cases, y report formatting checks. Deterministic report output is valuable para code review because changes are visible as stable diffs, not only behavioral assertions.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, y explicit severity mapping so runtime incidents are diagnosable without guessing. Para invariants, each failed check should identify what contract was violated, where in the flow it happened, y whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent y alert tuning becomes fragile. A typed error library con deterministic reports solves this by making failure semantics machine-readable y human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain con injected timestamps y step IDs gives auditors y engineers a replayable explanation of what passed, what failed, y in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old y new evidence outputs y verify expected changes before despliegue. Over time, these deterministic artifacts become part of release discipline y reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries y confirm that alerts, dashboards, y user-facing copy still map correctly. If mappings drift, update guides y fallback behavior should ship together con code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users y support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, y a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors y reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it con quarterly reviews where engineers evaluate false-positive rates, update context fields, y verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, y communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                    "note": "Typed y deterministic"
                  }
                ]
              }
            ]
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
            "content": "# Explorer: invariant decision tree\n\nAn invariant decision tree helps teams reason about guard ordering y failure priority. Not every invariant should be checked in arbitrary order. Early checks should prevent expensive work y produce the clearest failure semantics.\n\nA common flow: structural preconditions first, authority checks second, value bounds third, relational checks fourth. This ordering minimizes noisy failures y improves auditability. If authority is missing, there is little value in evaluating downstream value checks.\n\nDecision trees also help map errors to UX behavior. A recoverable user input violation may show inline correction hints, while a fatal integrity breach should hard-stop con escalation messaging.\n\nIn deterministic systems, tree traversal should be explicit y testable. Given the same input, the same failing node should be reported every time. This allows stable evidence chains y reliable automation.\n\nExplorer tooling can visualize this by showing the path taken, checks skipped, y final outcome. Teams can then tune guard order intentionally y document rationale.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, y explicit severity mapping so runtime incidents are diagnosable without guessing. Para invariants, each failed check should identify what contract was violated, where in the flow it happened, y whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent y alert tuning becomes fragile. A typed error library con deterministic reports solves this by making failure semantics machine-readable y human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain con injected timestamps y step IDs gives auditors y engineers a replayable explanation of what passed, what failed, y in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old y new evidence outputs y verify expected changes before despliegue. Over time, these deterministic artifacts become part of release discipline y reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries y confirm that alerts, dashboards, y user-facing copy still map correctly. If mappings drift, update guides y fallback behavior should ship together con code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users y support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, y a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors y reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it con quarterly reviews where engineers evaluate false-positive rates, update context fields, y verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, y communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
        "description": "Implement guard helpers, evidence-chain generation, y stable audit reporting para reliability y incident response.",
        "lessons": {
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
            "content": "Implement typed invariant errors y deterministic ensure helpers.",
            "duration": "40 min",
            "hints": [
              "Return typed error payloads, not raw strings.",
              "Keep ensure() deterministic y side-effect free."
            ]
          },
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
            "content": "Build a deterministic evidence chain con injected timestamps.",
            "duration": "40 min",
            "hints": [
              "Inject/mock timestamps para deterministic evidence chains.",
              "Step ordering must remain stable para snapshot tests."
            ]
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
            "content": "Run deterministic invariant case sets y return failed IDs.",
            "duration": "35 min",
            "hints": [
              "Property-ish deterministic tests can still run as fixed case sets.",
              "Return explicit failed IDs para debugability."
            ]
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
            "content": "Format a deterministic markdown evidence report.",
            "duration": "35 min",
            "hints": [
              "Markdown report should preserve stable step order y deterministic formatting.",
              "Include aggregate status y per-step evidence lines."
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
    "title": "Rust Rendimiento para On-chain Thinking",
    "description": "Simulate y optimize compute-cost behavior con deterministic Rust-first tooling y budget-driven rendimiento gobernanza.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "performance",
      "compute",
      "solana"
    ],
    "modules": {
      "rpot-v2-foundations": {
        "title": "Rendimiento Foundations",
        "description": "Rust rendimiento modelo mentals, data-structure tradeoffs, y deterministic cost reasoning para reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Rendimiento modelo mental: allocations, clones, hashing",
            "content": "# Rendimiento modelo mental: allocations, clones, hashing\n\nRust rendimiento work in Solana ecosystems is mostly about data movement discipline. Teams often chase micro-optimizations while ignoring dominant costs such as repeated allocations, unnecessary cloning, y redundant hashing in loops.\n\nA useful modelo mental starts con cost buckets. Allocation cost includes heap growth, allocator metadata, y cache disruption. Clone cost depends on object size y ownership patterns. Hash cost depends on bytes hashed y hash invocation frequency. Loop cost depends on iteration count y per-iteration work. Map lookup cost depends on data structure choice y access pattern.\n\nThe point of this model is not exact runtime cycles. The point is relative pressure. If one path performs ten allocations y another performs one allocation, the former should trigger scrutiny even before microbenchmarking.\n\nOn-chain thinking reinforces this: compute budgets are finite, y predictable resource usage matters. Even off-chain indexers y simulators benefit from the same discipline because latency tails y CPU burn impact reliability.\n\nDeterministic models are ideal para CI. Given identical operation counts, output should be identical. Reviewers can reason about deltas directly y reject regressions early.\n\n## Operator mindset\n\nRendimiento guidance should be versioned y budgeted. Without explicit budgets y stable cost categories, optimization work drifts toward anecdote instead of measurable outcomes.\n\nRendimiento engineering para on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines y CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline para regression detection. The model does not replace real profiling; it complements it by making early diseno tradeoffs explicit y reviewable.\n\nWhen you model costs, keep weights documented y intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient y track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports con before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers y client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined con suggestion outputs y checkpoint reports, these models become practico guardrails para engineering quality.\n\nMature teams combine these deterministic models con periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients y rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation y keeps recommendations aligned con actual system behavior. The key is to treat model updates as versioned changes con explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why rendimiento guidance changed y how improvements were verified.\n\nTeams should also define rendimiento budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete y avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets y require explicit waivers when thresholds are exceeded. Keep waiver text deterministic y tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable rendimiento culture where improvements are intentional, measurable, y easy to audit.\n",
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
                      "They remove need para tests"
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
            "content": "# Data structures: Vec, HashMap, BTreeMap tradeoffs\n\nData structure choice is one of the highest leverage rendimiento decisions in Rust systems. Vec offers compact contiguous storage y predictable iteration speed. HashMap offers average-case fast lookup but can have higher allocation y hashing overhead. BTreeMap provides ordered keys y stable traversal costs con different memory locality characteristics.\n\nIn on-chain-adjacent simulations y indexers, workloads vary. If you mostly append y iterate, Vec plus binary search or index maps can outperform heavier maps. If random key lookup dominates, HashMap may win despite hash overhead. If deterministic ordering is required para report output or canonical snapshots, BTreeMap can simplify stable behavior.\n\nThe wrong pattern is premature abstraction that hides access patterns. Engineers should instrument operation counts y use cost models to evaluate actual use cases. Deterministic benchmark fixtures make this reproducible.\n\nAnother practico tradeoff is allocation strategy. Reusing buffers y reserving capacity can reduce churn substantially. This is often more impactful than iterator-vs-loop debates.\n\nKeep diseno reviews concrete: expected reads, writes, key cardinality, ordering requirements, y mutation frequency. Then choose structures intentionally y document rationale.\nRendimiento engineering para on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines y CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline para regression detection. The model does not replace real profiling; it complements it by making early diseno tradeoffs explicit y reviewable.\n\nWhen you model costs, keep weights documented y intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient y track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports con before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers y client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined con suggestion outputs y checkpoint reports, these models become practico guardrails para engineering quality.\n\nMature teams combine these deterministic models con periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients y rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation y keeps recommendations aligned con actual system behavior. The key is to treat model updates as versioned changes con explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why rendimiento guidance changed y how improvements were verified.\n\nTeams should also define rendimiento budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete y avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets y require explicit waivers when thresholds are exceeded. Keep waiver text deterministic y tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable rendimiento culture where improvements are intentional, measurable, y easy to audit.\n",
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
                    "note": "Good para sequential work"
                  },
                  {
                    "cmd": "HashMap lookups",
                    "output": "fast random access, hash overhead",
                    "note": "Good para key-based fetch"
                  }
                ]
              }
            ]
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
            "content": "# Explorer: cost model sandbox\n\nA cost sandbox lets teams test optimization hypotheses without waiting para full benchmark infrastructure. Provide operation counts, compute weighted costs, y inspect which buckets dominate total pressure.\n\nThe sandbox should separate baseline y optimized inputs so diffs are explicit. If a change claims fewer allocations but increases map lookups sharply, the model should show the net effect. This prevents one-dimensional optimization that regresses other paths.\n\nSuggestion generation should be threshold-based y deterministic. Para example, if allocation cost exceeds a threshold, recommend pre-allocation y buffer reuse. If serialization cost dominates, recommend batching or avoiding repeated decode/encode loops.\n\nStable report outputs are critical para engineering workflows. JSON payloads feed CI checks, markdown summaries support code review y team communication. Keep key ordering stable so string equality tests remain meaningful.\n\nSandboxes are not production profilers, but they are excellent decision support tools when kept deterministic y aligned con known workload patterns.\nRendimiento engineering para on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines y CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline para regression detection. The model does not replace real profiling; it complements it by making early diseno tradeoffs explicit y reviewable.\n\nWhen you model costs, keep weights documented y intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient y track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports con before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers y client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined con suggestion outputs y checkpoint reports, these models become practico guardrails para engineering quality.\n\nMature teams combine these deterministic models con periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients y rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation y keeps recommendations aligned con actual system behavior. The key is to treat model updates as versioned changes con explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why rendimiento guidance changed y how improvements were verified.\n\nTeams should also define rendimiento budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete y avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets y require explicit waivers when thresholds are exceeded. Keep waiver text deterministic y tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable rendimiento culture where improvements are intentional, measurable, y easy to audit.\n",
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
        "description": "Build deterministic profilers, recommendation engines, y report outputs aligned to explicit rendimiento budgets.",
        "lessons": {
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
            "content": "Estimate deterministic operation costs from fixed weighting rules.",
            "duration": "40 min",
            "hints": [
              "Use deterministic arithmetic weights para each operation category.",
              "Return component breakdown plus total para easier optimization diffs."
            ]
          },
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
            "content": "Apply deterministic before/after metric reductions y diff outputs.",
            "duration": "40 min",
            "hints": [
              "Treat optimization as deterministic metric diffs, not runtime benchmarking.",
              "Clamp reduced metrics at zero."
            ]
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
            "content": "Compute deterministic serialization overhead y byte savings.",
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
            "content": "Export deterministic JSON y markdown profiler reports.",
            "duration": "45 min",
            "hints": [
              "Checkpoint must include stable JSON y markdown outputs.",
              "Use deterministic percentage rounding."
            ]
          }
        }
      }
    }
  },
  "rust-async-indexer-pipeline": {
    "title": "Concurrency & Async para Indexers (Rust)",
    "description": "Rust-first async pipeline engineering con bounded concurrency, replay-safe reducers, y deterministic operational reporting.",
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
        "description": "Async/concurrency fundamentals, backpressure behavior, y deterministic execution modeling para indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
            "content": "# Async fundamentals: futures, tasks, channels\n\nRust async systems are built on explicit scheduling rather than implicit thread-per-task models. Futures represent pending work, executors poll futures, y channels coordinate data flow. Para indexers, this architecture supports high throughput but requires careful control of concurrency y backpressure.\n\nA common failure mode is unbounded task spawning. It may look fine in local tests, then collapse in production under burst traffic due to memory pressure y queue growth. Defensive diseno uses bounded concurrency con explicit task budgets.\n\nChannels are powerful but can hide overload when used without capacity limits. Bounded channels make pressure visible: producers block or shed work when consumers lag. In deterministic simulations, this behavior can be modeled by explicit queues y tick-based progression.\n\nThe key mindset is reproducibility. If pipeline behavior cannot be replayed deterministically, debugging y regression pruebas become guesswork. Simulated executors solve this by removing wall-clock dependence.\n\n## Operator mindset\n\nAsync pipelines are reliability systems, not just throughput systems. Concurrency limits, retry behavior, y reducer determinism must stay auditable under stress.\n\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers y threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler con deterministic tick advancement provides a clean environment para validating bounded concurrency, retry sequencing, y backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, y completion order is reproducible.\n\nBackpressure diseno should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably y metrics should expose this. Deterministic tests can assert queue length, total ticks, y completion order para stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency y stable reducers. Duplicate deliveries should collapse by key, y snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy y incident triage slows down. Stable JSON y markdown reports prevent that by keeping artifacts comparable between runs y between code versions.\n\nOperational teams should maintain scenario catalogs para burst traffic, retry storms, y partial-stage failures. Each scenario should specify expected queue depth, retry schedule, y final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios y aprende system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters para accepted work, deferred work, retries, y dropped events. Without these counters, backpressure incidents become anecdotal y tuning decisions become reactive. Con deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI con mocked scheduler runs, y regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, y explicit failure budgets. Para educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks para each failure mode y link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, y communication templates para fast coordination.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "raip-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "raip-v2-l1-q1",
                    "prompt": "Why prefer bounded concurrency para indexer tasks?",
                    "options": [
                      "It prevents runaway memory y queue growth",
                      "It guarantees zero failures",
                      "It eliminates retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "Bounded concurrency keeps load behavior controlled y observable."
                  }
                ]
              }
            ]
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits y backpressure",
            "content": "# Concurrency limits y backpressure\n\nBackpressure is not optional in high-volume pipelines. Without it, producer speed can overwhelm reducers, retries, or storage sinks. A resilient diseno sets explicit concurrency caps y queue semantics that are easy to reason about.\n\nSemaphore-style limits are a common pattern: only N tasks can run at once. Additional tasks wait in queue. Deterministic simulation can model this con a running list y remaining tick counters.\n\nRetry behavior interacts con backpressure. If retries ignore queue pressure, they amplify congestion. Deterministic retry schedules should be bounded y inspectable.\n\nDiseno reviews should ask: what is max concurrent work, what is queue policy, what happens on overload, y how is fairness maintained. Stable run reports provide concrete answers.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers y threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler con deterministic tick advancement provides a clean environment para validating bounded concurrency, retry sequencing, y backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, y completion order is reproducible.\n\nBackpressure diseno should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably y metrics should expose this. Deterministic tests can assert queue length, total ticks, y completion order para stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency y stable reducers. Duplicate deliveries should collapse by key, y snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy y incident triage slows down. Stable JSON y markdown reports prevent that by keeping artifacts comparable between runs y between code versions.\n\nOperational teams should maintain scenario catalogs para burst traffic, retry storms, y partial-stage failures. Each scenario should specify expected queue depth, retry schedule, y final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios y aprende system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters para accepted work, deferred work, retries, y dropped events. Without these counters, backpressure incidents become anecdotal y tuning decisions become reactive. Con deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI con mocked scheduler runs, y regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, y explicit failure budgets. Para educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks para each failure mode y link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, y communication templates para fast coordination.\n",
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
                    "note": "bounded y predictable"
                  }
                ]
              }
            ]
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph y concurrency",
            "content": "# Explorer: pipeline graph y concurrency\n\nPipeline graphs help teams communicate stage boundaries, concurrency budgets, y retry behaviors. A graph that shows ingest, dedupe, retry, y snapshot stages con explicit capacities is far more actionable than prose descriptions.\n\nIn deterministic simulation, each stage can be represented as queue + worker budget. Events progress in ticks, y transitions are logged in timeline snapshots. This makes race conditions y starvation visible.\n\nA good explorer shows total ticks, completion order, y per-tick running/completed sets. These artifacts become checkpoints para regression tests.\n\nPair graph exploration con idempotency key tests. Duplicate events should not mutate state repeatedly. Stable reducers y sorted outputs make this easy to verify.\n\nThe final objective is operational confidence: when congestion or reorg scenarios occur, teams can replay deterministic fixtures y compare expected versus actual behavior quickly.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers y threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler con deterministic tick advancement provides a clean environment para validating bounded concurrency, retry sequencing, y backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, y completion order is reproducible.\n\nBackpressure diseno should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably y metrics should expose this. Deterministic tests can assert queue length, total ticks, y completion order para stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency y stable reducers. Duplicate deliveries should collapse by key, y snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy y incident triage slows down. Stable JSON y markdown reports prevent that by keeping artifacts comparable between runs y between code versions.\n\nOperational teams should maintain scenario catalogs para burst traffic, retry storms, y partial-stage failures. Each scenario should specify expected queue depth, retry schedule, y final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios y aprende system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters para accepted work, deferred work, retries, y dropped events. Without these counters, backpressure incidents become anecdotal y tuning decisions become reactive. Con deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI con mocked scheduler runs, y regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, y explicit failure budgets. Para educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks para each failure mode y link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, y communication templates para fast coordination.\n",
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
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, y report exports para reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
            "content": "Simulate bounded-concurrency execution con deterministic task ordering.",
            "duration": "40 min",
            "hints": [
              "Model bounded concurrency con a deterministic queue y tick loop.",
              "No real timers; simulate progression by decrementing remaining ticks."
            ]
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
            "content": "Generate deterministic retry delay schedules para linear y exponential policies.",
            "duration": "40 min",
            "hints": [
              "Retry schedule should be deterministic y bounded.",
              "Support linear y exponential backoff modes."
            ]
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
            "content": "Deduplicate replay events by deterministic idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Use idempotency keys to collapse duplicate replay events.",
              "Return stable sorted keys para deterministic snapshots."
            ]
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
            "content": "Build deterministic snapshot state from simulated event streams.",
            "duration": "35 min",
            "hints": [
              "Reducer should be deterministic y idempotent-friendly.",
              "Sort output keys para stable report generation."
            ]
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
            "content": "Export deterministic run report artifacts para the async pipeline simulation.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should mirror deterministic pipeline run artifacts.",
              "Include both machine y human-readable export fields."
            ]
          }
        }
      }
    }
  },
  "rust-proc-macros-codegen-safety": {
    "title": "Procedural Macros & Codegen para Safety",
    "description": "Rust macro/codegen safety taught through deterministic parser y check-generation tooling con audit-friendly outputs.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "macros",
      "codegen",
      "safety"
    ],
    "modules": {
      "rpmcs-v2-foundations": {
        "title": "Macro y Codegen Foundations",
        "description": "Macro modelo mentals, constraint DSL diseno, y safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro modelo mental: declarative vs procedural",
            "content": "# Macro modelo mental: declarative vs procedural\n\nRust macros come in two broad forms: declarative macros para pattern-based expansion y procedural macros para syntax-aware transformation. Anchor relies heavily on macro-driven ergonomics to generate cuenta validation y instruccion plumbing.\n\nPara safety engineering, the value is consistency. Instead of hand-writing signer y owner checks in every handler, macro-style codegen can enforce these rules from concise attributes. This reduces copy-paste drift y makes review focus on policy intent.\n\nIn this curso, we simulate proc-macro behavior con deterministic TypeScript parser/generator helpers. The goal is conceptual transfer: attribute input -> AST -> generated checks -> runtime evaluation report.\n\nA macro modelo mental helps avoid two mistakes: trusting generated behavior blindly y over-generalizing DSL syntax. Good macro diseno keeps syntax explicit, expansion predictable, y errors readable.\n\nTreat generated checks as code artifacts, not opaque internals. Store them in tests, compare them in diffs, y validate behavior on controlled fixtures.\n\n## Operator mindset\n\nCodegen safety depends on reviewable output. If generated checks are not deterministic y diff-friendly, teams lose trust y incidents take longer to diagnose.\n\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor y Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate y catch classes of validation bugs early. Para teaching in a browser environment, a deterministic parser y generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes y debugging becomes harder. Stable generated strings, golden file tests, y deterministic run reports solve this. Teams can diff generated code as plain text y confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL diseno. Attribute syntax should be strict enough to reject ambiguous input y explicit enough to encode signer, owner, relation, y mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind y target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules y keep migration guides para older attribute forms. Unversioned grammar drift can silently break generated checks y create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired con golden output snapshots y runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, y testable, which is exactly the behavior needed para safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, y runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined y avoids turning safety tooling into a maintenance burden. Teams can further strengthen this con compatibility suites that replay historical DSL inputs against new parsers y compare outputs byte-para-byte. When differences appear, release notes should explain why behavior changed y how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent y lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, y runtime validation signoff in every checklist.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpmcs-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpmcs-v2-l1-q1",
                    "prompt": "Why is generated code review important para safety?",
                    "options": [
                      "It verifies expansion matches policy intent",
                      "It increases compile speed",
                      "It removes need para tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Generated checks must remain inspectable y auditable."
                  }
                ]
              }
            ]
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
            "content": "# Safety through codegen: constraint checks\n\nConstraint codegen converts compact declarations into explicit runtime guards. Typical constraints include signer presence, cuenta ownership, has-one relations, y mutability requirements.\n\nA strong codegen pipeline validates input syntax strictly, produces deterministic output ordering, y emits meaningful errors para unsupported forms. Weak codegen pipelines accept ambiguous syntax y produce inconsistent expansion, which undermines trust.\n\nOwnership checks are high-value constraints because cuenta substitution bugs are common in Solana systems. Generated owner guards reduce omission risk. Signer checks ensure privileged paths are gated by explicit authority.\n\nHas-one relation checks encode structural links between cuentas y authorities. Generated relation checks reduce manual mistakes y keep behavior aligned across handlers.\n\nFinally, pruebas generated output via golden strings catches accidental expansion drift. This is especially useful during parser refactors.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor y Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate y catch classes of validation bugs early. Para teaching in a browser environment, a deterministic parser y generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes y debugging becomes harder. Stable generated strings, golden file tests, y deterministic run reports solve this. Teams can diff generated code as plain text y confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL diseno. Attribute syntax should be strict enough to reject ambiguous input y explicit enough to encode signer, owner, relation, y mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind y target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules y keep migration guides para older attribute forms. Unversioned grammar drift can silently break generated checks y create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired con golden output snapshots y runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, y testable, which is exactly the behavior needed para safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, y runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined y avoids turning safety tooling into a maintenance burden. Teams can further strengthen this con compatibility suites that replay historical DSL inputs against new parsers y compare outputs byte-para-byte. When differences appear, release notes should explain why behavior changed y how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent y lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, y runtime validation signoff in every checklist.\n",
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
            "content": "# Explorer: constraint builder to generated checks\n\nA constraint builder explorer helps engineers see how DSL choices affect generated code y runtime safety outcomes. Input one attribute line, observe parsed AST, generated pseudo-code, y pass/fail execution against sample inputs.\n\nThis tight loop is useful para both education y production review. Teams can prototype new constraint forms, verify deterministic output, y add golden tests before adoption.\n\nThe explorer should surface parse failures clearly. If syntax is invalid, report line y expected format. If constraint kind is unsupported, fail con deterministic error text.\n\nGenerated checks should preserve input order unless policy requires canonical sorting. Either way, behavior must be deterministic y documented.\n\nRuntime evaluation output should include failure list con kind, target, y reason. This allows developers to fix configuration quickly y keeps safety reporting actionable.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor y Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate y catch classes of validation bugs early. Para teaching in a browser environment, a deterministic parser y generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes y debugging becomes harder. Stable generated strings, golden file tests, y deterministic run reports solve this. Teams can diff generated code as plain text y confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL diseno. Attribute syntax should be strict enough to reject ambiguous input y explicit enough to encode signer, owner, relation, y mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind y target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules y keep migration guides para older attribute forms. Unversioned grammar drift can silently break generated checks y create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired con golden output snapshots y runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, y testable, which is exactly the behavior needed para safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, y runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined y avoids turning safety tooling into a maintenance burden. Teams can further strengthen this con compatibility suites that replay historical DSL inputs against new parsers y compare outputs byte-para-byte. When differences appear, release notes should explain why behavior changed y how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent y lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, y runtime validation signoff in every checklist.\n",
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
        "title": "Cuenta Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, y publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
            "content": "Parse mini-DSL constraints into deterministic AST nodes.",
            "duration": "40 min",
            "hints": [
              "Parse mini DSL lines into typed AST nodes.",
              "Support signer, mut, owner, y has_one forms."
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
              "Evaluate generated constraints against sample cuenta state.",
              "Return deterministic failure reasons."
            ]
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
            "content": "Export deterministic markdown safety report from generated checks.",
            "duration": "45 min",
            "hints": [
              "Render a deterministic markdown report from generated check results.",
              "Include status y explicit failure details."
            ]
          }
        }
      }
    }
  },
  "anchor-upgrades-migrations": {
    "title": "Anchor Upgrades & Cuenta Migrations",
    "description": "Diseno production-safe Anchor release workflows con deterministic migration planning, upgrade gates, rollback playbooks, y readiness evidence.",
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
        "description": "Authority lifecycle, cuenta versioning strategy, y deterministic upgrade risk modeling para Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
            "content": "# Upgrade authority lifecycle in Anchor programs\n\nAnchor makes instruccion development easier, but upgrade safety still depends on disciplined control of program authority. In production Solana systems, most upgrade incidents are not caused by syntax bugs. They come from process mistakes: wrong key management, unclear release ownership, y missing checks between build artifacts y deployed programdata. This leccion teaches a practico lifecycle model that maps directly to how Anchor programs are deployed y governed.\n\nStart con a strict authority model. Define who can sign upgrades y under which conditions. A single hot cartera is not acceptable para mature systems. Typical setups use a multisig or gobernanza path to approve artifacts, then a controlled signer to perform despliegue. The important point is determinism: the same release decision should produce the same auditable evidence each time. That includes artifact hash, release tag, authority signers, y rollback policy. If your team cannot reconstruct those facts after a deploy, your process is too weak.\n\nNext, treat build reproducibility as a first-class requirement. You should compare the expected binary hash against programdata hash before y after despliegue in your pipeline simulation. Even when this curso stays deterministic y does not hit RPC, the policy should model hash matching as a gate. If the hash mismatch flag is true, the release is blocked. This simple rule prevents one of the most expensive failure classes: thinking you shipped one artifact while another artifact is actually live.\n\nAuthority transition rules matter too. Some protocols intentionally revoke upgrade authority after a stabilization window. Others keep authority but require gobernanza timelocks y emergency pause conditions. Neither is universally correct. The key is consistency con explicit trigger conditions. If you revoke authority too early, you lose the ability to patch critical bugs. If you never constrain authority, users cannot trust immutability promises. Anchor does not solve this gobernanza tradeoff para you; it only provides the program framework.\n\nRelease communication is part of seguridad. Users y integrators need predictable language about what changed y whether state migration is required. Para example, if you add new cuenta fields but keep backward decoding compatibility, your report should say migration is optional para old cuentas y mandatory para new writes after a certain slot range. If compatibility breaks, the report must include exact batch strategy y downtime expectations. Ambiguous language creates support load y increases operational risk.\n\nFinally, diseno your release pipeline para deterministic dry runs. Simulate migration steps, validation checks, y report generation locally. The goal is to eliminate unforced errors before any transaccion is signed. A deterministic runbook is not bureaucracy; it is what keeps urgent releases calm y reviewable.\n\n## Operator mindset\n\nAnchor upgrades are operations work con cryptographic consequences. Authority controls, migration sequencing, y rollback criteria should be treated as release contracts, not informal habits.\n\n\nThis leccion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures para each upgrade class: schema-only changes, instruccion behavior changes, y authority changes. Para every class, capture expected artifacts y compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, y what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, y support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown y stable JSON, teams avoid panic changes during incidents y can audit exactly what happened after the fact. The same approach improves onboarding: new engineers aprende from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define clear authority ownership y approval flow.\n- Require artifact hash match before rollout.\n- Document authority transition y rollback policy.\n- Publish migration impact in deterministic report fields.\n- Block releases when dry-run evidence is missing.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "aum-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "aum-v2-l1-q1",
                    "prompt": "What is the most defensible release gate before despliegue?",
                    "options": [
                      "Compare approved build hash to expected programdata hash policy input",
                      "Ship quickly y validate hash later",
                      "Rely on signer memory without written report"
                    ],
                    "answerIndex": 0,
                    "explanation": "Hash matching is a deterministic control that prevents artifact drift during despliegue."
                  },
                  {
                    "id": "aum-v2-l1-q2",
                    "prompt": "Why is release communication part of upgrade safety?",
                    "options": [
                      "Integrators need exact migration impact y timing to avoid operational errors",
                      "Because Anchor automatically writes support tickets",
                      "Because all upgrades are backward compatible"
                    ],
                    "answerIndex": 0,
                    "explanation": "Unclear upgrade messaging causes integration mistakes y user-facing incidents."
                  }
                ]
              }
            ]
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Cuenta versioning y migration strategy",
            "content": "# Cuenta versioning y migration strategy\n\nSolana cuentas are long-lived state containers, so program upgrades must respect historical data. In Anchor, adding or changing cuenta fields can be safe, risky, or catastrophic depending on how version markers, discriminators, y decode logic are handled. This leccion focuses on migration planning that is deterministic, testable, y production-oriented.\n\nThe first rule is explicit version markers. Do not infer schema version from cuenta size alone because reallocations y optional fields can make that ambiguous. Include a version field y define what each version guarantees. Your migration planner can then segment cuenta ranges by version y apply deterministic transforms. Without explicit markers, teams often guess state shape y ship brittle one-off scripts.\n\nSecond, separate compatibility mode from migration mode. Compatibility mode means new code can read old y new versions while writes may still target old shape para a transition period. Migration mode means writes are frozen or routed through upgrade-safe paths while cuenta batches are rewritten. Both modes are valid, but mixing them without clear boundaries creates partial state y broken assumptions.\n\nBatching is a practico necessity. Large protocols cannot migrate every cuenta in one transaccion or one slot. Your plan should define batch size, ordering, y integrity checks. Para example, process cuenta indexes in deterministic ascending order y verify expected post-migration invariants after each batch. If a batch fails, rerun exactly that batch con idempotent logic. Deterministic batch identifiers make this auditable y easier to recover.\n\nPlan para dry-run y rollback before execution. A migration plan should include prepare, migrate, verify, y finalize steps con explicit criteria. Prepare can freeze new writes y snapshot baseline metrics. Verify can compare counts by version y check critical invariants. Finalize can re-enable writes y publish a signed report. Rollback should be defined as a separate branch, not improvised during incident pressure.\n\nAnchor adds value here through typed cuenta contexts y constraints, but migrations still require careful data engineering. Para every changed cuenta type, maintain deterministic test fixtures: old bytes, expected new bytes, y expected structured decode output. This catches layout regressions early y builds confidence when migrating real state.\n\nTreat migration metrics as product metrics too. Users care about downtime, failed actions, y consistency across clients. If migration affects read paths, expose status in UX so users understand what is happening. Reliable migrations are as much about communication y orchestration as they are about code.\n\n\nThis leccion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures para each upgrade class: schema-only changes, instruccion behavior changes, y authority changes. Para every class, capture expected artifacts y compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, y what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, y support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown y stable JSON, teams avoid panic changes during incidents y can audit exactly what happened after the fact. The same approach improves onboarding: new engineers aprende from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use explicit version markers in cuenta data.\n- Define compatibility y migration modes separately.\n- Migrate in deterministic batches con idempotent retries.\n- Keep dry-run fixtures para byte-level y structured outputs.\n- Publish migration status y completion evidence.\n",
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
                    "note": "Freeze writes before touching cuenta schema."
                  },
                  {
                    "cmd": "migrate --batch=3 --range=2000-2999 --target=v3",
                    "output": "status=ok migrated=1000 failed=0",
                    "note": "Batch IDs are deterministic y replayable."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
            "content": "# Explorer: upgrade risk matrix\n\nA useful upgrade explorer should show cause-y-effect between release inputs y safety outcomes. If a flag changes, engineers should immediately see how severity y readiness changes. This leccion teaches how to build y read a deterministic risk matrix para Anchor upgrades.\n\nThe matrix starts con five high-signal inputs: upgrade authority present, program hash match, IDL breaking changes count, migration backfill completion, y dry-run pass status. These cover gobernanza, artifact integrity, compatibility risk, data readiness, y execution readiness. They are not exhaustive, but they are enough to prevent most avoidable mistakes.\n\nEach matrix row represents a release candidate state. Para every row, compute issue codes y severity levels in stable order. Stable ordering is not cosmetic; it allows exact output comparisons in CI y easy diff review in pull requests. If issue ordering changes between commits without policy changes, you know something in implementation drifted.\n\nSeverity calibration should be conservative. Missing upgrade authority, hash mismatch, y failed dry run are high severity because they directly block safe rollout. Incomplete backfill y IDL breaking changes are usually medium severity: sometimes resolvable con migration notes y staged release windows, but still risky if ignored.\n\nThe explorer should also teach false confidence patterns. Para example, a release con zero IDL changes can still be unsafe if program hash does not match approved artifact. Conversely, a release con breaking changes can still be safe if migration plan is complete, compatibility notes are clear, y rollout is staged con monitoring. Risk is contextual; deterministic policy helps avoid emotional decisions.\n\nFrom a workflow perspective, the matrix output should feed both engineering y support. Engineering uses JSON para machine checks y gating. Support uses markdown summary to communicate whether release is ready, delayed, or blocked y why. If these outputs disagree, your generation path is wrong. Use one canonical payload y derive both formats.\n\nFinally, integrate the explorer into code review. Require reviewers to reference matrix output para each release PR. This keeps decisions anchored in explicit evidence rather than implicit trust in despliegue scripts.\n\n\nThis leccion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures para each upgrade class: schema-only changes, instruccion behavior changes, y authority changes. Para every class, capture expected artifacts y compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, y what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, y support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown y stable JSON, teams avoid panic changes during incidents y can audit exactly what happened after the fact. The same approach improves onboarding: new engineers aprende from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use a canonical risk payload con stable ordering.\n- Mark authority/hash/dry-run failures as blocking.\n- Keep JSON y markdown generated from one source.\n- Validate matrix behavior con deterministic fixtures.\n- Treat explorer output as part of PR review evidence.\n",
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
            "content": "Implement deterministic migration planning output: fromVersion, toVersion, totalBatches, y requiresMigration.",
            "duration": "40 min",
            "hints": [
              "Use Math.ceil(accountCount / batchSize) para deterministic batch count.",
              "requiresMigration should be true only when toVersion > fromVersion.",
              "Return only stable scalar fields para exact JSON comparisons."
            ]
          }
        }
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, y deterministic readiness artifacts para controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
            "content": "Implement deterministic blocking issue checks para authority, artifact hash, y dry-run status.",
            "duration": "40 min",
            "hints": [
              "Treat missing authority, hash mismatch, y failed dry run as blocking issues.",
              "Return issueCount plus ordered issue code array.",
              "Keep order stable to make report diffs deterministic."
            ]
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy y incident playbooks",
            "content": "# Rollback strategy y incident playbooks\n\nEven strong upgrade plans can encounter surprises: incompatible downstream clients, unexpected cuenta edge cases, or release pipeline mistakes. Teams that recover quickly are the ones that predefine rollback y incident playbooks before any despliegue begins. This leccion covers pragmatic rollback diseno para Anchor-based systems.\n\nRollback starts con explicit trigger conditions. Do not wait para subjective debate during an incident. Define measurable triggers such as failure rate thresholds, migration error counts, or critical invariant violations. Once trigger conditions are met, the system should move into a known response mode: pause writes, stop new migration batches, y publish incident status.\n\nA common mistake is assuming rollback always means restoring old binary immediately. Sometimes that is correct; other times it can worsen state divergence if partial migrations already wrote new version markers. Your playbook should classify failure phase: pre-migration, mid-migration, or post-finalization. Each phase has different safest actions. Mid-migration incidents often require completing compensating transforms before binary rollback.\n\nAnchor cuenta constraints help protect invariant boundaries, but they do not orchestrate recovery sequencing. You still need deterministic tooling para affected cuenta identification, reprocessing queues, y reconciliation summaries. Keep these tools pure y replayable where possible. If logic cannot be replayed, incident analysis becomes guesswork.\n\nCommunication is part of rollback. Engineering, support, y partner teams should consume the same deterministic report fields: release tag, rollback trigger, impacted batch ranges, current mitigation status, y next checkpoint time. Avoid free-form updates that diverge across channels.\n\nPost-incident learning must be concrete. Para each incident, add one or more deterministic fixtures reproducing the decision path that failed. Update policy functions y confirm that the new fixtures prevent recurrence. This is how reliability improves release after release.\n\nFinally, distinguish between emergency stop controls y full rollback procedures. Emergency stop is para immediate blast radius reduction. Full rollback or forward-fix decisions can come after state assessment. Blending these concepts causes rushed mistakes.\n\n\nThis leccion should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures para each upgrade class: schema-only changes, instruccion behavior changes, y authority changes. Para every class, capture expected artifacts y compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, y what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document con explicit slot windows, RPC provider failover plan, y support messaging templates. If a release is paused, the plan should already define whether to retry con the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown y stable JSON, teams avoid panic changes during incidents y can audit exactly what happened after the fact. The same approach improves onboarding: new engineers aprende from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define measurable rollback triggers in advance.\n- Classify incident phase before selecting response path.\n- Keep recovery tooling replayable y deterministic.\n- Share one canonical incident report format.\n- Add regression fixtures after every rollback event.\n",
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
                      "Enter defined response mode: pause risky actions y publish status",
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
                    "explanation": "Incident fixtures turn lecciones into enforceable regression tests."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
            "content": "Generate deterministic markdown from releaseTag, totalBatches, y issueCount.",
            "duration": "35 min",
            "hints": [
              "Keep line ordering y punctuation stable.",
              "Use bullet list fields para releaseTag, totalBatches, y issueCount.",
              "Return plain markdown string without trailing spaces."
            ]
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
            "content": "Produce the final deterministic checkpoint artifact con release tag, readiness flag, y migration batch count.",
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
    "title": "Reliability Engineering para Solana",
    "description": "Production-focused reliability engineering para Solana systems: fault tolerance, retries, deadlines, circuit breakers, y graceful degradation con measurable operational outcomes.",
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
        "description": "Implement fault-tolerance building blocks con clear failure classification, retry boundaries, y deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
            "content": "Fault tolerance in Solana systems is not just about catching errors. It is about deciding which failures are safe to retry, which should fail fast, y how to preserve user trust while doing both.\n\nA practico reliability model starts con failure classes:\n1) transient failures (timeouts, temporary RPC unavailability),\n2) persistent external failures (rate limits, prolonged endpoint degradation),\n3) deterministic business failures (invalid input, invariant violations).\n\nTransient failures may justify bounded retries con backoff. Deterministic business failures should not be retried because retries only add latency y load. Persistent external failures often require fallback endpoints, degraded features, or temporary protection modes.\n\nIn Solana workflows, reliability is tightly coupled to freshness constraints. A request can be logically valid but still fail if supporting state has shifted (para example stale quote windows or expired blockhash contexts in client workflows). Reliable systems therefore combine retry logic con freshness checks y clear abort conditions.\n\nDefensive engineering means defining policies explicitly:\n- maximum retry count,\n- per-attempt timeout,\n- total deadline budget,\n- fallback behavior after budget exhaustion,\n- user-facing messaging para each failure class.\n\nWithout explicit budgets, systems drift into infinite retry loops or fail too early. Con explicit budgets, behavior is predictable y testable.\n\nPara production teams, observability is mandatory. Every failed operation should include a deterministic reason code y context fields (attempt number, endpoint, elapsed time, policy branch). This turns reliability from guesswork into measurable behavior.\n\nReliable systems do not promise zero failures. They promise controlled failure behavior: bounded latency, clear outcomes, y safe degradation under stress.",
            "duration": "45 min"
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
            "content": "Implement an exponential backoff retry mechanism para handling transient failures.",
            "duration": "45 min",
            "hints": [
              "Use match on the BackoffStrategy enum to handle each case",
              "Para exponential backoff, use 2_u64.pow(attempt) to calculate the multiplier",
              "should_retry simply checks if attempt is less than max_attempts"
            ]
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
            "content": "Implement a deadline management system to enforce time limits on operations.",
            "duration": "45 min",
            "hints": [
              "Store the absolute expiration timestamp in the Deadline struct",
              "Para time_remaining, subtract current_time from deadline timestamp if not expired",
              "Para extend_deadline, calculate the new timestamp y check against max allowed"
            ]
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
            "content": "Implement a fallback mechanism that provides alternative execution paths when primary operations fail.",
            "duration": "45 min",
            "hints": [
              "Call the primary function first y check if it returns Some",
              "Only call fallback if primary returns None",
              "Para retry, loop max_retries times trying primary before falling back"
            ]
          }
        }
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, y rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
            "content": "Resilience patterns are controls that prevent localized failures from becoming system-wide incidents. On Solana integrations, they are especially important because provider health can change quickly under bursty network conditions.\n\nCircuit breaker pattern:\n- closed: normal operation,\n- open: block requests after repeated failures,\n- half-open: probe recovery con controlled trial requests.\n\nA good breaker uses deterministic thresholds y cooldowns, not ad hoc toggles. It should expose state transitions para monitoring y post-incident review.\n\nBulkhead pattern isolates resource pools so one failing workflow (para example expensive quote refresh loops) cannot starve unrelated workflows (like portfolio reads).\n\nRate limiting controls outbound pressure to providers. Proper limits reduce 429 storms y improve overall success rate. Token-bucket strategies are useful because they allow short bursts while preserving long-term bounds.\n\nThese patterns should be coordinated, not layered blindly. Para example, aggressive retries plus weak rate limiting can bypass the intent of a circuit breaker. Policy composition must be reviewed end-to-end.\n\nA mature resilience stack includes:\n- deterministic policy config,\n- simulation fixtures para calm vs stressed traffic,\n- dashboard visibility para breaker states y reject reasons,\n- explicit user copy para degraded mode.\n\nResilience is successful when users experience predictable service quality under failure, not when systems appear perfect in ideal conditions.",
            "duration": "45 min"
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
            "content": "Implement a circuit breaker pattern that opens after consecutive failures y closes after a recovery period.",
            "duration": "45 min",
            "hints": [
              "In can_execute, check if recovery timeout has passed para Open state",
              "record_success should reset everything to Closed state",
              "record_failure increments count y opens circuit when threshold is reached"
            ]
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
            "content": "Implement a token bucket rate limiter para controlling request rates.",
            "duration": "45 min",
            "hints": [
              "Always refill before checking if consumption is possible",
              "Calculate elapsed time y multiply by refill rate to get tokens to add",
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
    "title": "Pruebas Strategies para Solana",
    "description": "Comprehensive, production-oriented pruebas strategy para Solana: deterministic unit tests, realistic integration tests, fuzz/property pruebas, y release-confidence reporting.",
    "duration": "5 weeks",
    "tags": [
      "testing",
      "quality-assurance",
      "fuzzing",
      "property-testing"
    ],
    "modules": {
      "mod-11-1": {
        "title": "Unit y Integration Pruebas",
        "description": "Build deterministic unit y integration pruebas layers con clear ownership of invariants, fixtures, y failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Pruebas Fundamentals",
            "content": "Pruebas Solana systems effectively requires layered confidence, not one giant test suite.\n\nUnit tests validate pure logic: math, state transitions, y invariant checks. They should be fast, deterministic, y run on every change.\n\nIntegration tests validate component wiring: modelo de cuentasing, instruccion construction, y cross-modulo behavior under realistic inputs. They should catch schema drift y boundary errors that unit tests miss.\n\nA practico test pyramid para Solana work:\n1) deterministic unit tests (broadest coverage),\n2) deterministic integration tests (targeted workflow coverage),\n3) environment-dependent checks (smaller set, higher cost).\n\nCommon failure in teams is over-reliance on environment-dependent tests while neglecting deterministic core checks. This creates flaky CI y weak debugging signals.\n\nGood test diseno principles:\n- explicit fixture ownership,\n- stable expected outputs,\n- structured error assertions (not only success assertions),\n- regression fixtures para previously discovered bugs.\n\nPara production readiness, test outputs should be easy to audit. Summaries should include pass/fail counts by category, failing invariant IDs, y deterministic reproduction inputs.\n\nPruebas is not just correctness verification; it is an operational communication tool. Strong test artifacts make release decisions clearer y incident response faster.",
            "duration": "45 min"
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
            "content": "Implement a test assertion framework para verifying program state.",
            "duration": "45 min",
            "hints": [
              "Compare actual vs expected values y return appropriate Result",
              "Use format! to create descriptive error messages",
              "Return Ok(()) para success cases"
            ]
          },
          "lesson-11-1-3": {
            "title": "Mock Cuenta Generator Challenge",
            "content": "Create a mock cuenta generator para pruebas con configurable parameters.",
            "duration": "45 min",
            "hints": [
              "Use vec![0; size] to create zero-filled data of specified size",
              "Para generate_with_lamports, use default values para other fields",
              "Signer cuentas typically have is_writable set to true"
            ]
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
            "content": "Build a test scenario builder para setting up complex test environments.",
            "duration": "45 min",
            "hints": [
              "Use builder pattern con self return type para chaining",
              "Push strings into vectors (use to_string() to convert &str)",
              "build() consumes self y creates the final TestScenario"
            ]
          }
        }
      },
      "mod-11-2": {
        "title": "Avanzado Pruebas Techniques",
        "description": "Use fuzzing, property-based tests, y mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing y Property Pruebas",
            "content": "Avanzado pruebas techniques uncover failures that example-based tests rarely find.\n\nFuzzing explores broad random input space to trigger parser edge cases, boundary overflows, y unexpected state combinations. It is especially useful para serialization, decoding, y input validation layers.\n\nProperty-based pruebas defines invariants that must hold across many generated inputs. Instead of asserting one output, you assert a rule (para example: balances never become negative, or decoded-then-encoded payload remains stable).\n\nMutation-style thinking strengthens this further: intentionally alter assumptions y verify tests fail as expected. If tests still pass after a harmful change, coverage is weaker than it appears.\n\nTo keep avanzado pruebas practico:\n- use deterministic seeds in CI para reproducibility,\n- store failing cases as permanent regression fixtures,\n- separate heavy campaigns from per-commit fast checks.\n\nAvanzado tests are most valuable when tied to explicit risk categories. Map each category (serialization safety, invariant consistency, edge-case arithmetic) to at least one dedicated property or fuzz campaign.\n\nTeams that treat fuzz/property failures as first-class release blockers catch subtle defects earlier y reduce high-severity production incidents.",
            "duration": "45 min"
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
            "content": "Implement a fuzz input generator para pruebas con random data.",
            "duration": "45 min",
            "hints": [
              "Use wrapping_mul y wrapping_add para LCG to avoid overflow panics",
              "Generate bytes by taking random % 256",
              "Para bounded generation, calculate range y add to min"
            ]
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
            "content": "Implement a property verifier that checks invariants hold across operations.",
            "duration": "45 min",
            "hints": [
              "Para commutative, call op both ways y compare",
              "Para associative, nest the calls differently y compare",
              "Para non_decreasing, iterate through pairs y check ordering"
            ]
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
            "content": "Implement a boundary value analyzer para identifying edge cases.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub y saturating_add to avoid overflow",
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
    "description": "Engineer production-grade Solana rendimiento: compute budgeting, cuenta layout efficiency, memory/rent tradeoffs, y deterministic optimization workflows.",
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
        "description": "Optimize compute-heavy paths con explicit CU budgets, operation-level profiling, y predictable rendimiento tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
            "content": "Compute units are the hard resource budget that shapes what your Solana program can do in a single transaccion. Rendimiento optimization starts by treating CU usage as a contract, not an afterthought.\n\nA reliable optimization loop is:\n1) measure baseline CU by operation type,\n2) identify dominant cost buckets (deserialization, hashing, loops, CPI fan-out),\n3) optimize one hotspot at a time,\n4) re-measure y keep only changes con clear gains.\n\nCommon anti-patterns include optimizing cold paths, adding complexity without measurement, y ignoring cuenta-size side effects. In Solana systems, compute y cuenta diseno are coupled: a larger cuenta can increase deserialization cost, which raises CU pressure.\n\nPara production teams, deterministic cost fixtures are crucial. They let you compare before/after behavior in CI y stop regressions early. Rendimiento work is most useful when every claim is backed by reproducible evidence, not intuition.",
            "duration": "45 min"
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
            "content": "Implement a compute unit counter to estimate operation costs.",
            "duration": "45 min",
            "hints": [
              "Loop cost is overhead plus iterations times per-iteration cost",
              "Cuenta access is simply cuentas multiplied by per-cuenta CU",
              "Apply safety margin by multiplying budget by the percentage"
            ]
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
            "content": "Optimize data structures para minimal serialization overhead.",
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
              "Calculate available CUs after accounting para overhead",
              "Use ceiling division: (n + d - 1) / d para number of batches",
              "Total CU = (num_batches * overhead) + (items * per_item)"
            ]
          }
        }
      },
      "mod-12-2": {
        "title": "Memory y Storage Optimization",
        "description": "Diseno memory/storage-efficient cuenta layouts con rent-aware sizing, serialization discipline, y safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Cuenta Data Optimization",
            "content": "Cuenta data optimization is both a cost y correctness discipline. Poor layouts increase rent, slow parsing, y make migrations fragile.\n\nDiseno principles:\n- Keep hot fields compact y easy to parse.\n- Use fixed-size representations where possible.\n- Reserve growth strategy explicitly instead of ad hoc field expansion.\n- Separate frequently-mutated data from rarely-changed metadata when practico.\n\nLayout decisions should be documented con deterministic artifacts: field offsets, total bytes, y expected rent class. If a schema change increases cuenta size, reviewers should see the exact delta y migration implications.\n\nProduction optimization is not “smallest possible struct at any cost.” It is stable, readable, y migration-safe storage that keeps compute y rent budgets predictable over time.",
            "duration": "45 min"
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
            "content": "Implement a data packer that efficiently packs fields into cuenta data.",
            "duration": "45 min",
            "hints": [
              "Use to_le_bytes() to convert integers to bytes",
              "Use from_le_bytes() to convert bytes back to integers",
              "Alignment formula: if remainder, add (alignment - remainder)"
            ]
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
            "content": "Implement a rent calculator para estimating cuenta storage costs.",
            "duration": "45 min",
            "hints": [
              "Annual rent is data size times lamports per byte per year",
              "Exemption threshold is annual rent times threshold years",
              "Check if balance is greater than or equal to minimum"
            ]
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
            "content": "Implement a zero-copy deserializer para reading data without allocation.",
            "duration": "45 min",
            "hints": [
              "Use copy_from_slice to read fixed-size data into stack arrays",
              "Para read_bytes, return a slice of the original data (zero-copy)",
              "Always advance offset after reading"
            ]
          }
        }
      }
    }
  },
  "solana-tokenomics-design": {
    "title": "Tokenomics Diseno para Solana",
    "description": "Diseno robust Solana token economies con distribution discipline, vesting safety, staking incentives, y gobernanza mechanics that remain operationally defensible.",
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
        "title": "Token Distribution y Vesting",
        "description": "Model token allocation y vesting systems con explicit fairness, unlock predictability, y deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
            "content": "Token distribution is a seguridad y credibility decision, not just a spreadsheet exercise. Allocation y vesting rules shape long-term trust in the protocol.\n\nA strong distribution model answers:\n- who receives tokens y why,\n- when they unlock,\n- how unlock schedules affect circulating supply,\n- what controls prevent accidental over-distribution.\n\nVesting diseno should be deterministic y auditable. Cliff y linear phases must produce reproducible release amounts para any timestamp. Ambiguous rounding rules create disputes y operational risk.\n\nProduction teams should maintain allocation invariants in tests (para example: total distributed <= total supply, per-bucket caps respected, no negative vesting balances). Tokenomics quality improves when economics y implementation are validated together.",
            "duration": "45 min"
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
            "content": "Implement a vesting schedule calculator con cliff y linear release.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub to avoid underflow when calculating elapsed time",
              "Para linear vesting, use u128 para intermedio calculation to avoid overflow",
              "Releasable is simply vested minus already released"
            ]
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
            "content": "Implement a token allocation distributor para managing different stakeholder groups.",
            "duration": "45 min",
            "hints": [
              "Use iter().map().sum() to calculate total percentage",
              "Use u128 para percentage calculation to avoid overflow",
              "Use find() to locate allocation by recipient"
            ]
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
            "content": "Generate a complete release schedule con dates y amounts.",
            "duration": "45 min",
            "hints": [
              "Divide duration by intervals to get interval duration",
              "Use filter y sum to calculate total by timestamp",
              "Para monthly, use 30 days * 24 hours * 60 minutes * 60 seconds"
            ]
          }
        }
      },
      "mod-13-2": {
        "title": "Staking y Gobernanza",
        "description": "Diseno staking y gobernanza mechanics con clear incentive alignment, anti-manipulation constraints, y measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking y Gobernanza Diseno",
            "content": "Staking y gobernanza systems must balance participation incentives con manipulation resistance. Rewarding lock behavior is useful, but poorly tuned models can over-concentrate influence.\n\nCore diseno questions:\n1) How is staking reward rate set y adjusted?\n2) How is voting power calculated (raw balance, delegated balance, time-weighted)?\n3) What prevents short-term gobernanza capture?\n\nGobernanza math should be transparent y deterministic so users can verify voting outcomes independently. If power calculations are opaque or inconsistent, gobernanza trust collapses quickly.\n\nOperationally, track gobernanza health metrics: voter participation, delegation concentration, proposal pass patterns, y inactive stake ratios. Tokenomics is successful only when on-chain incentive behavior matches intended gobernanza outcomes.",
            "duration": "45 min"
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
            "content": "Implement a staking rewards calculator con compounding.",
            "duration": "45 min",
            "hints": [
              "Use compound interest formula: A = P(1 + r/n)^(nt)",
              "Convert basis points to decimal by dividing by 10000",
              "Para days to target, use logarithms to solve para time"
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
            "content": "Implement a proposal threshold calculator para gobernanza.",
            "duration": "45 min",
            "hints": [
              "Convert basis points to amount: (supply * bps) / 10000",
              "Use u128 para intermedio calculation to avoid overflow",
              "Proposal passes if quorum met Y more para than against"
            ]
          }
        }
      }
    }
  },
  "solana-defi-primitives": {
    "title": "DeFi Primitives on Solana",
    "description": "Build practico Solana DeFi foundations: AMM mechanics, liquidity accounting, lending primitives, y flash-loan-safe composition patterns.",
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
        "title": "AMM y Liquidity",
        "description": "Implement AMM y liquidity primitives con deterministic math, slippage-aware outputs, y LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
            "content": "AMM fundamentals are simple in formula but subtle in implementation quality. The invariant math must be deterministic, fee handling explicit, y rounding behavior consistent across paths.\n\nPara constant-product pools, route quality is determined by output-at-size, not headline spot price. Larger trades move further on the curve y experience stronger impact, so quote logic must be size-aware.\n\nLiquidity accounting must also be exact: LP shares, fee accrual, y pool reserve updates should remain internally consistent under repeated swaps y edge-case sizes.\n\nProduction DeFi teams treat AMM math as critical infrastructure. They use fixed fixtures para swap-in/swap-out cases, boundary amounts, y fee tiers so regressions are caught before despliegue.",
            "duration": "45 min"
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
            "content": "Implement a constant product AMM para token swaps.",
            "duration": "45 min",
            "hints": [
              "Use u128 para intermedio calculations to prevent overflow",
              "Apply fee by multiplying by (10000 - fee_bps) / 10000",
              "Slippage is (price_before - effective_price) / price_before"
            ]
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
            "content": "Calculate LP token minting y rewards para liquidity providers.",
            "duration": "45 min",
            "hints": [
              "Para first liquidity, use sqrt(a * b) as LP tokens",
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
        "title": "Lending y Flash Loans",
        "description": "Model lending y flash-loan flows con collateral safety, utilization-aware pricing, y strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
            "content": "Lending primitives y flash-loan logic are powerful but unforgiving. Safety depends on strict collateral valuation, clear LTV/threshold rules, y deterministic repayment checks.\n\nA practico lending model should define:\n- collateral valuation source y freshness policy,\n- borrow limits y liquidation thresholds,\n- utilization-based rate behavior,\n- liquidation y bad-debt handling paths.\n\nFlash loans add atomic constraints: borrowed amount plus fee must be repaid in the same transaccion context. Any relaxation of this invariant introduces severe risk.\n\nComposable DeFi diseno works when every primitive preserves local safety contracts while exposing clear interfaces para higher-level orchestration.",
            "duration": "45 min"
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
            "content": "Implement collateral y borrowing power calculations.",
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
              "Use piecewise function para borrow rate (below/above optimal)",
              "Supply rate cuentas para reserve factor taken by protocol"
            ]
          },
          "lesson-14-2-4": {
            "title": "Flash Loan Validador Challenge",
            "content": "Implement flash loan validation logic.",
            "duration": "45 min",
            "hints": [
              "Fee is amount times fee_bps divided by 10000",
              "Total repay is principal plus fee",
              "Profit is gain minus fee (use i64 para signed result)"
            ]
          }
        }
      }
    }
  },
  "solana-nft-standards": {
    "title": "NFT Standards on Solana",
    "description": "Implement Solana NFTs con production-ready standards: metadata integrity, collection discipline, y avanzado programmable/non-transferable behaviors.",
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
        "description": "Build core NFT functionality con standards-compliant metadata, collection verification, y deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
            "content": "NFT architecture on Solana combines token mechanics con metadata y collection semantics. A correct implementation requires more than minting a token con supply one.\n\nCore components include:\n- mint/state ownership correctness,\n- metadata integrity y schema consistency,\n- collection linkage y verification status,\n- transfer y authority policy clarity.\n\nProduction NFT systems should treat metadata as a contract. If fields drift or verification flags are inconsistent, marketplaces y carteras may interpret assets differently.\n\nReliable implementations include deterministic validation para metadata structure, creator share totals, collection references, y authority expectations. Standards compliance is what preserves interoperability.",
            "duration": "45 min"
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
            "content": "Parse y validate NFT metadata according to Metaplex standards.",
            "duration": "45 min",
            "hints": [
              "Check string lengths con len() method",
              "Sum creator shares y verify equals 100",
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
              "Sort descending by score para ranking (highest = rank 1)"
            ]
          }
        }
      },
      "mod-15-2": {
        "title": "Avanzado NFT Features",
        "description": "Implement avanzado NFT behaviors (soulbound y programmable flows) con explicit policy controls y safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound y Programmable NFTs",
            "content": "Avanzado NFT features introduce policy complexity that must be explicit. Soulbound behavior, programmable restrictions, y dynamic metadata updates all expand failure surface.\n\nPara soulbound models, non-transferability must be enforced by clear rule paths, not UI assumptions. Para programmable NFTs, update permissions y transition rules should be deterministic y auditable.\n\nDynamic NFT updates should include strong validation y event clarity so indexers y clients can track state changes correctly.\n\nAvanzado NFT engineering succeeds when flexibility is paired con strict policy boundaries y transparent update behavior.",
            "duration": "45 min"
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validador Challenge",
            "content": "Implement validation para soulbound (non-transferable) tokens.",
            "duration": "45 min",
            "hints": [
              "Soulbound tokens return false para can_transfer",
              "Burn requires is_burnable y owner == burner",
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
            "content": "Implement NFT composability para equipping items to base NFTs.",
            "duration": "45 min",
            "hints": [
              "Check available slots, compatibility, y not already equipped",
              "Use position() y remove() to unequip items",
              "Filter equipped items by matching type in items list"
            ]
          }
        }
      }
    }
  },
  "solana-cpi-patterns": {
    "title": "Invocacion entre Programas Patterns",
    "description": "Master CPI composition on Solana con safe cuenta validation, PDA signer discipline, y deterministic multi-program orchestration patterns.",
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
        "description": "Build CPI fundamentals con strict cuenta/signer checks, ownership validation, y safe PDA signing boundaries.",
        "lessons": {
          "lesson-16-1-1": {
            "title": "Invocacion entre Programas Architecture",
            "content": "Invocacion entre Programas (CPI) is where Solana composability becomes practico y where many seguridad failures appear. The caller controls cuenta lists, so every CPI boundary must be treated as untrusted input.\n\nSafe CPI diseno requires:\n- explicit cuenta identity y owner validation,\n- signer y writable scope minimization,\n- deterministic PDA derivation y signer-seed handling,\n- bounded assumptions about downstream program behavior.\n\ninvoke y invoke_signed are not interchangeable conveniences. invoke_signed should only be used when signer proof is truly required y seed recipes are canonical.\n\nProduction CPI reliability comes from repeatable guard patterns. If constraints vary handler to handler, reviewers cannot reason about seguridad consistently.",
            "duration": "45 min"
          },
          "lesson-16-1-2": {
            "title": "CPI Cuenta Validador Challenge",
            "content": "Validate cuentas para Invocacion entre Programass.",
            "duration": "45 min",
            "hints": [
              "Check boolean flags para signer y writable validation",
              "Para balance, compare lamports against minimum required",
              "Privilege extension: if caller is signer, child can sign too"
            ]
          },
          "lesson-16-1-3": {
            "title": "PDA Signer Challenge",
            "content": "Implement PDA signing para CPI operations.",
            "duration": "45 min",
            "hints": [
              "Convert string seeds to bytes using as_bytes()",
              "Simulate PDA finding by trying different bump values",
              "Signature simulation combines message y seed hashes"
            ]
          },
          "lesson-16-1-4": {
            "title": "Instruccion Router Challenge",
            "content": "Implement an instruccion router para directing CPI calls.",
            "duration": "45 min",
            "hints": [
              "Use HashMap insert to register handlers",
              "Route by looking up instruction_type in handlers map",
              "create_cpi_call combines route con cuenta preparation"
            ]
          }
        }
      },
      "mod-16-2": {
        "title": "Avanzado CPI Patterns",
        "description": "Compose avanzado multi-program flows con atomicity awareness, consistency checks, y deterministic failure handling.",
        "lessons": {
          "lesson-16-2-1": {
            "title": "Multi-Program Composition",
            "content": "Multi-program composition introduces sequencing y consistency risk. Even when each CPI call is correct in isolation, combined flows can violate business invariants if ordering or rollback assumptions are weak.\n\nRobust composition patterns include:\n1) explicit stage boundaries,\n2) invariant checks between CPI steps,\n3) deterministic error classes para partial-failure diagnosis,\n4) idempotent recovery paths where possible.\n\nPara complex operations (atomic swaps, flash-loan sequences), model expected preconditions y postconditions per stage. This keeps orchestration testable y prevents hidden state drift.\n\nCPI mastery is less about calling many programs y more about preserving correctness across program boundaries under adverse inputs.",
            "duration": "45 min"
          },
          "lesson-16-2-2": {
            "title": "Atomic Swap Orchestrator Challenge",
            "content": "Implement an atomic swap across multiple programs.",
            "duration": "45 min",
            "hints": [
              "Validate that steps is not empty y minimum_output > 0",
              "Atomicity requires output_token of step N equals input_token of step N+1",
              "Map steps to (program_id, input_token, expected_output) tuples"
            ]
          },
          "lesson-16-2-3": {
            "title": "State Consistency Validador Challenge",
            "content": "Validate state consistency across multiple CPI calls.",
            "duration": "45 min",
            "hints": [
              "Clone cuentas vector to create independent snapshot",
              "Para no_changes, verify all changed cuentas are in except list",
              "Compare balance y data_hash to detect changes"
            ]
          },
          "lesson-16-2-4": {
            "title": "Permissioned Invocation Challenge",
            "content": "Implement permission checks para program invocations.",
            "duration": "45 min",
            "hints": [
              "Push permission into vector to register",
              "Use find() to locate permission para program_id",
              "Use retain() to remove caller from allowed list"
            ]
          }
        }
      }
    }
  },
  "solana-mev-strategies": {
    "title": "MEV y Transaccion Ordering",
    "description": "Production-focused transaccion-ordering engineering on Solana: MEV-aware routing, bundle strategy, liquidation/arbitrage modeling, y user-protective execution controls.",
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
        "description": "Understand MEV mechanics y transaccion ordering realities, then model opportunities y risks con deterministic safety-aware policies.",
        "lessons": {
          "lesson-17-1-1": {
            "title": "MEV on Solana",
            "content": "Maximal Extractable Value (MEV) on Solana is fundamentally about transaccion ordering under limited blockspace. Whether you are building trading tools, liquidation infrastructure, or user-facing apps, you need a realistic model of how ordering pressure changes outcomes.\n\nKey Solana-specific context:\n- ordering can be influenced by priority fees y relay/bundle paths,\n- opportunities are short-lived y highly competitive,\n- failed or delayed execution can convert expected profit into loss.\n\nA mature MEV approach begins con classification:\n1) opportunity class (arbitrage, liquidation, backrun-style sequencing),\n2) dependency class (single-hop vs multi-hop, oracle-sensitive vs pool-state-sensitive),\n3) risk class (staleness, fill failure, adverse movement, execution contention).\n\nPara production systems, raw opportunity detection is not enough. You need deterministic filters that reject fragile setups: stale quotes, weak depth, or excessive path complexity relative to expected edge.\n\nMost operational failures come from execution assumptions, not math. Teams should model inclusion probability, fallback paths, y cancellation thresholds explicitly.\n\nUser-protective diseno matters even para avanzado orderflow systems. Clear policy around slippage limits, quote freshness, y failure reporting prevents silent value leakage y reduces support incidents.",
            "duration": "45 min"
          },
          "lesson-17-1-2": {
            "title": "Arbitrage Opportunity Detector Challenge",
            "content": "Detect arbitrage opportunities across DEXes.",
            "duration": "45 min",
            "hints": [
              "Compare all pairs of DEX prices para same token pair",
              "Profit percent is (sell - buy) / buy * 100",
              "Use max_by to find best opportunity"
            ]
          },
          "lesson-17-1-3": {
            "title": "Liquidation Opportunity Finder Challenge",
            "content": "Find undercollateralized positions para liquidation.",
            "duration": "45 min",
            "hints": [
              "Position is liquidatable when borrowed > threshold * collateral_value",
              "Calculate collateral value using price (con 6 decimals)",
              "Liquidation profit is bonus percentage of collateral value"
            ]
          },
          "lesson-17-1-4": {
            "title": "Priority Fee Calculator Challenge",
            "content": "Calculate optimal priority fees para transaccion ordering.",
            "duration": "45 min",
            "hints": [
              "Urgency factor scales the base fee",
              "Execution probability decreases as more fees are higher",
              "Total cost includes priority fee, base, y compute unit cost"
            ]
          }
        }
      },
      "mod-17-2": {
        "title": "Avanzado MEV Strategies",
        "description": "Diseno avanzado ordering/bundle strategies con explicit risk controls, failure handling, y user-impact guardrails.",
        "lessons": {
          "lesson-17-2-1": {
            "title": "Avanzado MEV Techniques",
            "content": "Avanzado transaccion-ordering strategies require disciplined orchestration, not just faster opportunity scans.\n\nBundle-oriented execution is valuable because it can express dependency sets y all-or-nothing intent, but bundle diseno must include:\n- strict preconditions,\n- deterministic abort rules,\n- replay-safe identifiers,\n- post-execution reconciliation.\n\nWhen strategy complexity increases (multi-hop paths, conditional liquidations), failure modes multiply: partial fills, stale assumptions, y contention spikes. A robust system ranks candidates by expected net value after execution risk, not gross theoretical edge.\n\nOperational controls should include:\n1) bounded retries con fresh-state checks,\n2) confidence scoring para each candidate,\n3) kill-switch thresholds para abnormal failure streaks,\n4) deterministic run reports para incident replay.\n\nAvanzado MEV tooling is successful when it is both profitable y controllable. Deterministic artifacts (decision inputs, chosen path, reason codes) are what make that control real in production.",
            "duration": "45 min"
          },
          "lesson-17-2-2": {
            "title": "Bundle Composer Challenge",
            "content": "Compose transaccion bundles para atomic MEV extraction.",
            "duration": "45 min",
            "hints": [
              "Tip is percentage of total profit",
              "Bundle is profitable if profit exceeds tip",
              "Sort by priority fee descending para optimal ordering"
            ]
          },
          "lesson-17-2-3": {
            "title": "Multi-Hop Arbitrage Finder Challenge",
            "content": "Find multi-hop arbitrage paths across token pairs.",
            "duration": "45 min",
            "hints": [
              "Use constant product formula con fee para output calculation",
              "Two-hop arbitrage goes A -> B -> A through different pools",
              "Profit is final output minus initial input"
            ]
          },
          "lesson-17-2-4": {
            "title": "MEV Simulation Engine Challenge",
            "content": "Simulate MEV extraction to estimate profitability.",
            "duration": "45 min",
            "hints": [
              "Apply slippage to both buy (increase) y sell (decrease) prices",
              "Risk score combines failure rate, profit negativity, y capital",
              "Expected value weights profit by success probability"
            ]
          }
        }
      }
    }
  },
  "solana-deployment-cicd": {
    "title": "Program Despliegue y CI/CD",
    "description": "Production despliegue engineering para Solana programs: environment strategy, release gating, CI/CD quality controls, y upgrade-safe operational workflows.",
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
        "title": "Despliegue Fundamentals",
        "description": "Model environment-specific despliegue behavior con deterministic configs, artifact checks, y release preflight validation.",
        "lessons": {
          "lesson-18-1-1": {
            "title": "Solana Despliegue Environments",
            "content": "Solana despliegue is not one command; it is a release system con environment-specific risk. Localnet, devnet, y mainnet each serve different validation goals, y production quality depends on using them intentionally.\n\nA reliable despliegue workflow defines:\n1) environment purpose y promotion criteria,\n2) deterministic config sources,\n3) artifact identity checks,\n4) rollback triggers.\n\nCommon failure patterns include mismatched program IDs, inconsistent config between environments, y unverified artifact drift between build y deploy. These are process issues that tooling should prevent.\n\nPreflight checks should be mandatory:\n- expected network y signer identity,\n- build artifact hash,\n- program size y upgrade constraints,\n- required cuenta/address assumptions.\n\nEnvironment promotion should be evidence-driven. Passing local tests alone is not enough para mainnet readiness; devnet/staging behavior must confirm operational assumptions under realistic RPC y timing conditions.\n\nDespliegue maturity is measured by reproducibility. If another engineer cannot replay the release inputs y get the same artifact y checklist outcome, the pipeline is too fragile.",
            "duration": "45 min"
          },
          "lesson-18-1-2": {
            "title": "Despliegue Config Manager Challenge",
            "content": "Manage despliegue configurations para different environments.",
            "duration": "45 min",
            "hints": [
              "Push config into vector to add",
              "Use find() to locate config by environment name",
              "is_deployed checks if program_id is Some"
            ]
          },
          "lesson-18-1-3": {
            "title": "Program Size Validador Challenge",
            "content": "Validate program binary size y compute budget.",
            "duration": "45 min",
            "hints": [
              "Compare binary length against MAX_PROGRAM_SIZE",
              "Use ceiling division para transaccion count",
              "Compression ratio shows percentage size reduction"
            ]
          },
          "lesson-18-1-4": {
            "title": "Upgrade Authority Manager Challenge",
            "content": "Manage program upgrade authorities y permissions.",
            "duration": "45 min",
            "hints": [
              "Push metadata into vector to register",
              "can_upgrade checks if authority matches stored authority",
              "Use find_mut to locate y modify program metadata"
            ]
          }
        }
      },
      "mod-18-2": {
        "title": "CI/CD Pipelines",
        "description": "Build CI/CD pipelines that enforce build/test/seguridad gates, compatibility checks, y controlled rollout/rollback evidence.",
        "lessons": {
          "lesson-18-2-1": {
            "title": "CI/CD para Solana Programs",
            "content": "CI/CD para Solana should enforce release quality, not just automate command execution.\n\nA practico pipeline includes staged gates:\n1) static quality gate (lint/type/seguridad checks),\n2) deterministic unit/integration tests,\n3) build reproducibility y artifact hashing,\n4) despliegue preflight validation,\n5) controlled rollout con observability checks.\n\nEach gate should produce machine-readable evidence. Release decisions become faster y safer when teams can inspect deterministic artifacts instead of scanning raw logs.\n\nVersion compatibility checks are critical in Solana ecosystems where CLI/toolchain mismatches can break builds or runtime expectations. Pipelines should fail fast on incompatible matrices.\n\nRollout strategy should also be explicit: canary/degraded mode, monitoring window, y rollback conditions. “Deploy y hope” is not a strategy.\n\nThe best CI/CD systems reduce human toil while increasing decision clarity. Automation should encode operational policy, not bypass it.",
            "duration": "45 min"
          },
          "lesson-18-2-2": {
            "title": "Build Pipeline Validador Challenge",
            "content": "Validate CI/CD pipeline stages y dependencies.",
            "duration": "45 min",
            "hints": [
              "Track seen stages to enforce ordering constraints",
              "Use any() con matches! to check para required stages",
              "Can skip build/test if only documentation files changed"
            ]
          },
          "lesson-18-2-3": {
            "title": "Version Compatibility Checker Challenge",
            "content": "Check version compatibility between tools y dependencies.",
            "duration": "45 min",
            "hints": [
              "Split version string by '.' y parse each component",
              "Compatibility requires same major, actual >= required",
              "Use min_by to find smallest compatible version"
            ]
          },
          "lesson-18-2-4": {
            "title": "Despliegue Rollback Manager Challenge",
            "content": "Manage despliegue rollbacks y recovery.",
            "duration": "45 min",
            "hints": [
              "Push despliegue y update current_index to new despliegue",
              "can_rollback checks para any successful despliegue before current",
              "get_rollback_target finds most recent successful despliegue"
            ]
          }
        }
      }
    }
  },
  "solana-cross-chain-bridges": {
    "title": "Cross-Chain Bridges y Wormhole",
    "description": "Build safer cross-chain integrations para Solana using Wormhole-style messaging, attestation verification, y deterministic bridge-state controls.",
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
        "description": "Understand cross-chain messaging trust boundaries, guardian attestations, y deterministic verification pipelines.",
        "lessons": {
          "lesson-43-1-1": {
            "title": "Cross-Chain Messaging Architecture",
            "content": "Cross-chain messaging is a trust-boundary problem before it is a transport problem. In Wormhole-style systems, messages are observed, attested, y consumed across different chain environments, each con independent failure modes.\n\nA robust architecture model includes:\n1) emitter semantics (what exactly is being attested),\n2) attestation verification (who signed y under what threshold),\n3) replay prevention (message uniqueness y consumption state),\n4) execution safety (what happens if target-chain state has changed).\n\nVerification must be deterministic y strict. Accepting malformed or weakly validated attestations is a direct safety risk.\n\nCross-chain systems should also expose explicit reason codes para rejects: invalid signatures, stale message, already-consumed message, unsupported payload schema. This improves operator response y audit quality.\n\nMessaging reliability depends on observability. Teams need deterministic logs linking source event IDs to target execution outcomes so they can reconcile partial or delayed flows.\n\nCross-chain engineering succeeds when attestation trust assumptions are transparent y enforced consistently at every consume path.",
            "duration": "45 min"
          },
          "lesson-43-1-2": {
            "title": "VAA Verifier Challenge",
            "content": "Implement VAA (Verified Action Approval) signature verification.",
            "duration": "45 min",
            "hints": [
              "Check signatures length against MIN_SIGNERS first",
              "Use to_be_bytes() para big-endian byte conversion",
              "Quorum is 2/3 of total guardians rounded up"
            ]
          },
          "lesson-43-1-3": {
            "title": "Message Emitter Challenge",
            "content": "Implement cross-chain message emission y tracking.",
            "duration": "45 min",
            "hints": [
              "Increment sequence before creating message",
              "Next sequence is current + 1",
              "Verify message sequence is within emitted range"
            ]
          },
          "lesson-43-1-4": {
            "title": "Replay Protection Challenge",
            "content": "Implement replay protection para cross-chain messages.",
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
        "description": "Implement asset-bridging patterns con strict supply/accounting invariants, replay protection, y reconciliation workflows.",
        "lessons": {
          "lesson-43-2-1": {
            "title": "Token Bridging Mechanics",
            "content": "Token bridging requires strict supply y state invariants. Lock-y-mint y burn-y-mint models both rely on one central rule: represented supply across chains must remain coherent.\n\nCritical controls include:\n- single-consume message semantics,\n- deterministic mint/unlock accounting,\n- paused-mode handling para incident containment,\n- reconciliation reports between source y target totals.\n\nA bridge flow should define state transitions explicitly: initiated, attested, executed, reconciled. Missing state transitions create operational blind spots.\n\nReplay y duplication are recurring bridge risks. Systems must key transfer intents deterministically y reject repeated execution attempts even under retries or delayed relays.\n\nProduction bridge operations also need runbooks: what to do on attestation delays, threshold signer issues, or target-chain execution failures.\n\nBridging quality is not just throughput; it is verifiable accounting integrity under adverse network conditions.",
            "duration": "45 min"
          },
          "lesson-43-2-2": {
            "title": "Token Locker Challenge",
            "content": "Implement token locking para bridge deposits.",
            "duration": "45 min",
            "hints": [
              "Push lock to vector y return index as lock_id",
              "Verify requester matches owner before unlocking",
              "Use filter y sum to calculate owner's locked amount"
            ]
          },
          "lesson-43-2-3": {
            "title": "Wrapped Token Mint Challenge",
            "content": "Manage wrapped token minting y supply tracking.",
            "duration": "45 min",
            "hints": [
              "Push token to vector y return index",
              "Check bounds before minting/burning",
              "Use get() y map() to safely retrieve supply"
            ]
          },
          "lesson-43-2-4": {
            "title": "Bridge Rate Limiter Challenge",
            "content": "Implement rate limiting para bridge withdrawals.",
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
    "title": "Oracle Integration y Pyth Network",
    "description": "Integrate Solana oracle feeds safely: price validation, confidence/staleness policy, y multi-source aggregation para resilient protocol decisions.",
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
        "description": "Understand oracle data semantics (price, confidence, staleness) y enforce deterministic validation before business logic.",
        "lessons": {
          "lesson-44-1-1": {
            "title": "Oracle Price Feeds",
            "content": "Oracle integration is a risk-control problem, not a data-fetch problem. Price feeds must be evaluated para freshness, confidence, y contextual fitness before they drive protocol decisions.\n\nA safe oracle validation pipeline checks:\n1) feed status y availability,\n2) staleness window compliance,\n3) confidence-band reasonableness,\n4) value bounds against protocol policy.\n\nUsing raw price without confidence or staleness checks can trigger invalid liquidations, bad quotes, or incorrect risk assessments.\n\nValidation outputs should be deterministic y structured (accept/reject con reason code). This helps downstream systems choose safe fallback behavior.\n\nProtocols should separate “data exists” from “data is usable.” A feed can be present but still unfit due to stale timestamp or extreme uncertainty.\n\nProduction reliability improves when oracle checks are versioned y fixture-tested across calm y stressed market scenarios.",
            "duration": "45 min"
          },
          "lesson-44-1-2": {
            "title": "Price Validador Challenge",
            "content": "Validate oracle prices para correctness y freshness.",
            "duration": "45 min",
            "hints": [
              "Freshness: current_time - publish_time <= max_staleness",
              "Confidence ratio: conf / |price| < threshold",
              "Use matches! para enum variant checking"
            ]
          },
          "lesson-44-1-3": {
            "title": "Price Normalizer Challenge",
            "content": "Normalize prices con different exponents to common scale.",
            "duration": "45 min",
            "hints": [
              "Calculate decimal difference y scale accordingly",
              "Use u128 para intermedio to prevent overflow",
              "Buy price increases, sell price decreases con spread"
            ]
          },
          "lesson-44-1-4": {
            "title": "EMA Calculator Challenge",
            "content": "Calculate Exponential Moving Average para price smoothing.",
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
        "description": "Diseno multi-oracle aggregation y consensus policies that reduce single-source failure risk while remaining explainable y testable.",
        "lessons": {
          "lesson-44-2-1": {
            "title": "Oracle Aggregation Strategies",
            "content": "Multi-oracle aggregation reduces single-point dependency but adds policy complexity. The goal is not to average blindly; it is to produce a robust decision value con clear confidence in adverse conditions.\n\nCommon strategies include median, trimmed mean, y weighted consensus. Strategy choice should reflect threat model: outlier resistance, latency tolerance, y source diversity.\n\nAggregation policies should define:\n- minimum participating sources,\n- max divergence threshold,\n- fallback action when consensus fails.\n\nIf sources diverge beyond policy bounds, the safe action may be to halt sensitive operations rather than force a number.\n\nDeterministic aggregation reports should include contributing sources, excluded outliers, y final consensus rationale. This is essential para audits y incident response.\n\nA good oracle stack is transparent: every accepted value can be explained, replayed, y defended.",
            "duration": "45 min"
          },
          "lesson-44-2-2": {
            "title": "Median Price Calculator Challenge",
            "content": "Calculate median price from multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Sort prices y find middle element(s) para median",
              "Para weighted median, accumulate weights until reaching 50%",
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
            "content": "Manage primary y fallback oracle sources.",
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
    "title": "DAO Tooling y Autonomous Organizations",
    "description": "Build production-ready DAO systems on Solana: proposal gobernanza, voting integrity, treasury controls, y deterministic execution/reporting workflows.",
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
        "title": "DAO Gobernanza Mechanics",
        "description": "Implement gobernanza mechanics con explicit proposal lifecycle rules, voting-power logic, y deterministic state transitions.",
        "lessons": {
          "lesson-45-1-1": {
            "title": "DAO Gobernanza Architecture",
            "content": "DAO gobernanza architecture is a system of enforceable process rules. Proposal creation, voting, y execution must be deterministic, auditable, y resistant to manipulation.\n\nA robust gobernanza model defines:\n1) proposal lifecycle states y transitions,\n2) voter eligibility y power calculation,\n3) quorum/approval thresholds by action class,\n4) execution preconditions y cancellation paths.\n\nGobernanza failures usually come from ambiguity: unclear thresholds, inconsistent snapshot timing, or weak transition validation.\n\nState transitions should be explicit y testable. Invalid transitions (para example executed -> voting) should fail con deterministic errors.\n\nVoting-power logic must also be transparent. Whether delegation, time-weighting, or quadratic models are used, outcomes should be reproducible from public inputs.\n\nDAO tooling quality is measured by predictability under pressure. During contentious proposals, deterministic behavior y clear reason codes are what preserve legitimacy.",
            "duration": "45 min"
          },
          "lesson-45-1-2": {
            "title": "Proposal Lifecycle Manager Challenge",
            "content": "Manage DAO proposal states y transitions.",
            "duration": "45 min",
            "hints": [
              "Match on (current, new) state pairs para valid transitions",
              "Voting active only during time window in Active state",
              "Quorum y threshold use basis point calculations"
            ]
          },
          "lesson-45-1-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Calculate voting power con delegation y quadratic options.",
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
              "Use position() y remove() to undelegate",
              "Filter y sum to get delegated amount"
            ]
          }
        }
      },
      "mod-45-2": {
        "title": "Treasury y Execution",
        "description": "Engineer treasury y execution tooling con policy gates, timelock safeguards, y auditable automation outcomes.",
        "lessons": {
          "lesson-45-2-1": {
            "title": "DAO Treasury Management",
            "content": "DAO treasury management is where gobernanza intent becomes real financial action. Treasury tooling must therefore combine flexibility con strict policy constraints.\n\nCore controls include:\n- spending limits y role-based authority,\n- timelock windows para sensitive actions,\n- multisig/escalation paths,\n- deterministic execution logs.\n\nAutomated execution should never hide policy checks. Every executed action should reference the proposal, required approvals, y control checks passed.\n\nFailure handling is equally important. If execution fails mid-flow, tooling should expose exact failure stage y safe retry/rollback guidance.\n\nTreasury systems should also produce reconciliation artifacts: proposed vs executed amounts, remaining budget, y exception records.\n\nOperationally mature DAOs treat treasury automation as regulated process infrastructure: explicit controls, reproducible evidence, y clear accountability boundaries.",
            "duration": "45 min"
          },
          "lesson-45-2-2": {
            "title": "Treasury Spending Limit Challenge",
            "content": "Implement spending limits y budget tracking para DAO treasury.",
            "duration": "45 min",
            "hints": [
              "Check balance y category limits before allowing spend",
              "Reset period if duration has passed",
              "Use saturating_sub to avoid underflow"
            ]
          },
          "lesson-45-2-3": {
            "title": "Timelock Executor Challenge",
            "content": "Implement timelock para delayed proposal execution.",
            "duration": "45 min",
            "hints": [
              "Push operation y return index as ID",
              "Can execute only if ETA reached y not executed",
              "Remove operation from list to cancel"
            ]
          },
          "lesson-45-2-4": {
            "title": "Automated Action Trigger Challenge",
            "content": "Implement automated triggers para DAO actions based on conditions.",
            "duration": "45 min",
            "hints": [
              "Push action y return index as ID",
              "Match on condition type to evaluate",
              "Only return non-triggered actions that meet conditions"
            ]
          }
        }
      }
    }
  },
  "solana-gaming": {
    "title": "Gaming y Game State Management",
    "description": "Build production-ready on-chain game systems on Solana: efficient state models, turn integrity, fairness controls, y scalable player progression economics.",
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
        "description": "Diseno game state y turn logic con deterministic transitions, storage efficiency, y anti-cheat validation boundaries.",
        "lessons": {
          "lesson-46-1-1": {
            "title": "On-Chain Game Diseno",
            "content": "On-chain game diseno on Solana is a systems-engineering tradeoff between fairness, responsiveness, y cost. The best designs keep critical rules verifiable while minimizing expensive state writes.\n\nCore architecture decisions:\n1) what state must be on-chain para trust,\n2) what can remain off-chain para speed,\n3) how turn validity is enforced deterministically.\n\nTurn-based mechanics should use explicit state transitions y guard checks (current actor, phase, cooldown, resource limits). If transitions are ambiguous, replay y dispute resolution become difficult.\n\nState compression y compact encoding matter because game loops can generate many updates. Efficient schemas reduce rent y compute pressure while preserving auditability.\n\nA production game model should also define anti-cheat boundaries. Even con deterministic logic, you need clear validation para illegal actions, stale turns, y duplicate submissions.\n\nReliable game infrastructure is measured by predictable outcomes under stress: same input actions, same resulting state, clear reject reasons para invalid actions.",
            "duration": "45 min"
          },
          "lesson-46-1-2": {
            "title": "Turn Manager Challenge",
            "content": "Implement turn-based game mechanics con action validation.",
            "duration": "45 min",
            "hints": [
              "Check player matches, state is waiting, y before deadline",
              "Turn complete when all players submitted",
              "Increment turn number para next turn"
            ]
          },
          "lesson-46-1-3": {
            "title": "Game State Compressor Challenge",
            "content": "Compress game state para efficient on-chain storage.",
            "duration": "45 min",
            "hints": [
              "Use bit shifting to pack x in high 4 bits, y in low 4 bits",
              "Unpack by shifting y masking",
              "Health stored as percentage (0-100) fits in 7 bits"
            ]
          },
          "lesson-46-1-4": {
            "title": "Player Progression Tracker Challenge",
            "content": "Track player experience, levels, y achievements.",
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
        "title": "Randomness y Fairness",
        "description": "Implement fairness-oriented randomness y integrity controls that keep gameplay auditable y dispute-resistant.",
        "lessons": {
          "lesson-46-2-1": {
            "title": "On-Chain Randomness",
            "content": "Randomness is one of the hardest fairness problems in blockchain games because execution is deterministic. Robust designs avoid naive pseudo-randomness tied directly to manipulable context.\n\nPractico fairness patterns include commit-reveal, VRF-backed randomness, y delayed-seed schemes. Each has latency/trust tradeoffs:\n- commit-reveal: simple y transparent, but requires multi-step interaction,\n- VRF: stronger unpredictability, but introduces oracle/dependency considerations,\n- delayed-seed methods: lower overhead but weaker guarantees under adversarial pressure.\n\nFairness engineering should specify:\n1) who can influence randomness inputs,\n2) when values become immutable,\n3) how unresolved rounds are handled on timeout.\n\nProduction systems should emit deterministic round evidence (commit hash, reveal value, validation result) so disputes can be resolved quickly.\n\nGame fairness is credible when randomness mechanisms are explicit, verifiable, y resilient to timing manipulation.",
            "duration": "45 min"
          },
          "lesson-46-2-2": {
            "title": "Commit-Reveal Challenge",
            "content": "Implement commit-reveal scheme para fair randomness.",
            "duration": "45 min",
            "hints": [
              "Push commitment to vector",
              "Verify by recomputing hash from reveal",
              "XOR all revealed values para combined randomness"
            ]
          },
          "lesson-46-2-3": {
            "title": "Dice Roller Challenge",
            "content": "Implement verifiable dice rolling con randomness.",
            "duration": "45 min",
            "hints": [
              "Use hash of seed para deterministic randomness",
              "Modulo operation gives range, add 1 para 1-based",
              "4d6 drop lowest: roll 4, sum all, subtract minimum"
            ]
          },
          "lesson-46-2-4": {
            "title": "Loot Table Challenge",
            "content": "Implement weighted loot tables para game rewards.",
            "duration": "45 min",
            "hints": [
              "Sum all weights para total",
              "Generate random number in range [0, total)",
              "Find item where cumulative weight exceeds roll"
            ]
          }
        }
      }
    }
  },
  "solana-permanent-storage": {
    "title": "Permanent Storage y Arweave",
    "description": "Integrate permanent decentralized storage con Solana using Arweave-style workflows: content addressing, manifest integrity, y verifiable long-term data access.",
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
        "description": "Understand permanent-storage architecture y build deterministic linking between Solana state y external immutable content.",
        "lessons": {
          "lesson-47-1-1": {
            "title": "Permanent Storage Architecture",
            "content": "Permanent storage integration is a data durability contract. On Solana, storing full content on-chain is often impractical, so systems rely on immutable external storage references anchored by on-chain metadata.\n\nA robust architecture defines:\n1) canonical content identifiers,\n2) integrity verification method,\n3) fallback retrieval behavior,\n4) lifecycle policy para metadata updates.\n\nContent-addressed diseno is critical. If identifiers are not tied to content hash semantics, integrity guarantees weaken y replayed/wrong assets can be served.\n\nStorage integration should also separate control-plane y data-plane concerns: on-chain records govern ownership/version pointers, while external storage handles large payload persistence.\n\nProduction reliability requires deterministic verification reports (ID format validity, expected hash match, availability checks). This makes failures diagnosable y prevents silent corruption.\n\nPermanent storage systems succeed when users can independently verify that referenced content matches what gobernanza or protocol state claims.",
            "duration": "45 min"
          },
          "lesson-47-1-2": {
            "title": "Transaccion ID Validador Challenge",
            "content": "Validate Arweave transaccion IDs y URLs.",
            "duration": "45 min",
            "hints": [
              "Check exact length y all characters valid",
              "base64url uses alphanumeric plus - y _"
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
            "content": "Optimize data bundling para efficient Arweave uploads.",
            "duration": "45 min",
            "hints": [
              "Sort items by priority before bundling"
            ]
          }
        }
      },
      "mod-47-2": {
        "title": "Manifests y Verification",
        "description": "Work con manifests, verification pipelines, y cost/rendimiento controls para reliable long-lived data serving.",
        "lessons": {
          "lesson-47-2-1": {
            "title": "Arweave Manifests",
            "content": "Manifests turn many stored assets into one navigable root, but they introduce their own integrity responsibilities. A manifest is only trustworthy if path mapping y referenced content IDs are validated consistently.\n\nKey safeguards:\n- deterministic path normalization,\n- duplicate/ambiguous key rejection,\n- strict transaccion-ID validation,\n- recursive integrity checks para referenced content.\n\nManifest tooling should produce auditable outputs: resolved entries count, missing references, y hash verification status by path.\n\nFrom an operational standpoint, cost optimization should not compromise integrity. Bundling strategies, compression, y metadata minimization are useful only if verification remains straightforward y deterministic.\n\nWell-run permanent-storage pipelines treat manifests as governed artifacts con versioned schema expectations y repeatable validation in CI.",
            "duration": "45 min"
          },
          "lesson-47-2-2": {
            "title": "Manifest Builder Challenge",
            "content": "Build y parse Arweave manifests.",
            "duration": "45 min",
            "hints": [
              "Validate tx_id length before adding",
              "Resolve in order: exact, index, fallback"
            ]
          },
          "lesson-47-2-3": {
            "title": "Data Verifier Challenge",
            "content": "Verify data integrity y availability on Arweave.",
            "duration": "45 min",
            "hints": [
              "MIN_CONFIRMATIONS defines 'sufficient' threshold"
            ]
          },
          "lesson-47-2-4": {
            "title": "Storage Indexer Challenge",
            "content": "Index y query stored data by tags.",
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
    "title": "Staking y Validador Economics",
    "description": "Understand Solana staking y validador economics para real-world decision-making: delegation strategy, reward dynamics, commission effects, y operational sustainability.",
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
        "description": "Aprende native staking mechanics con deterministic reward modeling, validador selection criteria, y delegation risk framing.",
        "lessons": {
          "lesson-48-1-1": {
            "title": "Solana Staking Architecture",
            "content": "Solana staking economics is an incentives system connecting delegators, validadores, y network seguridad. Good delegation decisions require more than chasing headline APY.\n\nDelegators should evaluate:\n1) validador rendimiento consistency,\n2) commission policy y changes over time,\n3) uptime y vote behavior,\n4) concentration risk across the validador set.\n\nReward modeling should be deterministic y transparent. Calculations must show gross rewards, commission effects, y net delegator outcome under explicit assumptions.\n\nDiversification matters. Concentrating stake purely on top performers can increase ecosystem centralization risk even if short-term yield appears higher.\n\nProduction staking tooling should expose scenario analysis (commission changes, rendimiento drops, epoch variance) so delegators can make resilient choices rather than reactive moves.\n\nStaking quality is measured by sustainable net returns plus contribution to healthy validador distribution.",
            "duration": "45 min"
          },
          "lesson-48-1-2": {
            "title": "Staking Rewards Calculator Challenge",
            "content": "Calculate staking rewards con commission y inflation.",
            "duration": "45 min",
            "hints": [
              "Apply commission as (1 - commission) multiplier",
              "Divide annual by epochs per year para epoch reward",
              "APY is (reward / stake) * 100"
            ]
          },
          "lesson-48-1-3": {
            "title": "Validador Selector Challenge",
            "content": "Select validadores based on rendimiento y commission.",
            "duration": "45 min",
            "hints": [
              "Weight factors: commission 40%, uptime 40%, skip rate 20%",
              "Sort by score descending y take top N",
              "Check each validador's percentage of total stake"
            ]
          },
          "lesson-48-1-4": {
            "title": "Stake Rebalancing Challenge",
            "content": "Optimize stake distribution across validadores.",
            "duration": "45 min",
            "hints": [
              "Target is total divided by count, clamped to min/max",
              "Count allocations that differ between old y new",
              "Check all allocations within tolerance percentage"
            ]
          }
        }
      },
      "mod-48-2": {
        "title": "Validador Operations",
        "description": "Analyze validador-side economics, operational cost pressure, y incentive alignment para long-term network health.",
        "lessons": {
          "lesson-48-2-1": {
            "title": "Validador Economics",
            "content": "Validador economics balances revenue opportunities against operational costs y reliability obligations. Sustainable validadores optimize para long-term trust, not short-term extraction.\n\nRevenue sources include inflation rewards y fee-related earnings; cost structure includes hardware, networking, maintenance, y operational staffing.\n\nKey operational metrics para validador viability:\n- effective uptime y vote success,\n- commission competitiveness,\n- stake retention trend,\n- incident frequency y recovery quality.\n\nCommission strategy should be explicit y predictable. Sudden commission spikes can damage delegator trust y long-term stake stability.\n\nEconomic analysis should include downside modeling: reduced stake, higher incident costs, or prolonged rendimiento degradation.\n\nHealthy validador economics supports network resilience. Tooling should help operators y delegators reason about sustainability, not just peak-period earnings.",
            "duration": "45 min"
          },
          "lesson-48-2-2": {
            "title": "Validador Profit Calculator Challenge",
            "content": "Calculate validador profitability.",
            "duration": "45 min",
            "hints": [
              "Sum all cost components",
              "Revenue = commission * delegated_rewards + self_rewards",
              "Break-even: commission = needed_rewards / delegated_rewards"
            ]
          },
          "lesson-48-2-3": {
            "title": "Epoch Schedule Calculator Challenge",
            "content": "Calculate epoch timing y reward distribution schedules.",
            "duration": "45 min",
            "hints": [
              "Convert ms to hours: / (1000 * 60 * 60)",
              "Next epoch starts at (current_epoch + 1) * slots_per_epoch",
              "Epoch para slot is integer division"
            ]
          },
          "lesson-48-2-4": {
            "title": "Stake Cuenta Manager Challenge",
            "content": "Manage stake cuenta lifecycle including activation y deactivation.",
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
    "title": "Cuenta Abstraction y Smart Carteras",
    "description": "Implement smart-cartera/cuenta-abstraction patterns on Solana con programmable authorization, recovery controls, y policy-driven transaccion validation.",
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
        "title": "Smart Cartera Fundamentals",
        "description": "Build smart-cartera fundamentals including multisig y social-recovery designs con clear trust y failure boundaries.",
        "lessons": {
          "lesson-49-1-1": {
            "title": "Cuenta Abstraction on Solana",
            "content": "Cuenta abstraction on Solana shifts control from a single key to programmable policy. Smart carteras can enforce richer authorization logic, but policy complexity must be managed carefully.\n\nA robust smart-cartera diseno defines:\n1) authority model (owners/guardians/delegates),\n2) policy scope (what can be approved automatically vs manually),\n3) recovery path (how access is restored safely).\n\nMultisig y social recovery are powerful, but both need deterministic state transitions y explicit quorum rules. Ambiguous transitions create lockout or unauthorized-access risk.\n\nSmart-cartera systems should emit structured authorization evidence para each action: which policy matched, which signers approved, y which constraints passed.\n\nProduction reliability depends on clear emergency controls: pause paths, guardian rotation, y recovery cooldowns.\n\nCuenta abstraction is successful when flexibility increases safety y usability together, not when policy logic becomes opaque.",
            "duration": "45 min"
          },
          "lesson-49-1-2": {
            "title": "Multi-Signature Cartera Challenge",
            "content": "Implement M-of-N multi-signature cartera.",
            "duration": "45 min",
            "hints": [
              "Use contains() to check ownership",
              "Can sign if owner Y not already signed Y not executed",
              "Can execute if threshold reached y not executed"
            ]
          },
          "lesson-49-1-3": {
            "title": "Social Recovery Challenge",
            "content": "Implement social recovery con guardians.",
            "duration": "45 min",
            "hints": [
              "Track approvals in guardians_approved vector",
              "Check guardian status before approving",
              "Require threshold Y delay para execution"
            ]
          },
          "lesson-49-1-4": {
            "title": "Session Key Manager Challenge",
            "content": "Manage temporary session keys con limited permissions.",
            "duration": "45 min",
            "hints": [
              "Valid if current time before expiration",
              "Can execute if valid, allowed operation, y within limit",
              "Remaining is max minus used"
            ]
          }
        }
      },
      "mod-49-2": {
        "title": "Programmable Validation",
        "description": "Implement programmable validation policies (limits, allowlists, time/risk rules) con deterministic enforcement y auditability.",
        "lessons": {
          "lesson-49-2-1": {
            "title": "Custom Validation Rules",
            "content": "Programmable validation is where smart carteras deliver real value, but it is also where subtle policy bugs appear.\n\nTypical controls include spending limits, destination allowlists, time windows, y risk-score gates. These controls should be deterministic y composable, con explicit precedence rules.\n\nDiseno principles:\n- fail closed on ambiguous policy matches,\n- keep policy evaluation order stable,\n- attach machine-readable reason codes to approve/reject outcomes.\n\nValidation systems should also support policy explainability. Users y auditors need to understand why a transaccion was blocked or approved.\n\nPara production deployments, policy changes should be versioned y test-fixtured. A new rule must be validated against prior known-good scenarios to avoid accidental lockouts or bypasses.\n\nProgrammable carteras are strongest when validation logic is transparent, testable, y operationally reversible.",
            "duration": "45 min"
          },
          "lesson-49-2-2": {
            "title": "Spending Limit Enforcer Challenge",
            "content": "Enforce daily y per-transaccion spending limits.",
            "duration": "45 min",
            "hints": [
              "Reset counters before checking",
              "Check all three limits: per-tx, daily, weekly",
              "Reset daily if new day, weekly if 7+ days passed"
            ]
          },
          "lesson-49-2-3": {
            "title": "Whitelist Enforcer Challenge",
            "content": "Enforce destination whitelists para transacciones.",
            "duration": "45 min",
            "hints": [
              "allow_all bypasses whitelist check",
              "Check contains() before adding",
              "Validate all destinations in transaccion"
            ]
          },
          "lesson-49-2-4": {
            "title": "Time Lock Enforcer Challenge",
            "content": "Enforce time-based restrictions on transacciones.",
            "duration": "45 min",
            "hints": [
              "Handle wrap-around para hours crossing midnight",
              "Check elapsed is between min y max delay",
              "Validate hours are 0-23 y min <= max"
            ]
          }
        }
      }
    }
  },
  "solana-pda-mastery": {
    "title": "Direccion Derivada de Programa Mastery",
    "description": "Master avanzado PDA engineering on Solana: seed schema diseno, bump handling discipline, y secure cross-program PDA usage at production scale.",
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
        "description": "Build strong PDA foundations con deterministic derivation, canonical seed composition, y collision-resistant namespace strategy.",
        "lessons": {
          "lesson-50-1-1": {
            "title": "Direcciones Derivadas de Programa",
            "content": "Direcciones Derivadas de Programa (PDAs) are deterministic authority y state anchors on Solana. Their power comes from predictable derivation; their risk comes from inconsistent seed discipline.\n\nA strong PDA diseno standard defines:\n1) canonical seed order,\n2) explicit namespace/domain tags,\n3) bump handling rules,\n4) versioning strategy para future evolution.\n\nSeed ambiguity is a common source of bugs. If different handlers derive the same concept con different seed ordering, identity checks become inconsistent y seguridad assumptions break.\n\nPDA validation should always re-derive expected addresses on the trusted side y compare exact keys before mutating state.\n\nProduction teams should document seed recipes as API contracts. Changing recipes without migration planning can orphan state y break clients.\n\nPDA mastery is mostly discipline: deterministic derivation everywhere, no implicit conventions, no trust in client-provided derivation claims.",
            "duration": "45 min"
          },
          "lesson-50-1-2": {
            "title": "PDA Generator Challenge",
            "content": "Implement PDA generation con seed validation.",
            "duration": "45 min",
            "hints": [
              "Try bumps from 255 down to 0",
              "Combine seeds, program_id, y bump in hash",
              "Check if derived address matches expected"
            ]
          },
          "lesson-50-1-3": {
            "title": "Seed Composer Challenge",
            "content": "Compose complex seed patterns para different use cases.",
            "duration": "45 min",
            "hints": [
              "Use byte string literals b\"...\" para static prefixes",
              "Convert integers con to_le_bytes()",
              "Collect into Vec<Vec<u8>>"
            ]
          },
          "lesson-50-1-4": {
            "title": "Bump Manager Challenge",
            "content": "Manage bump seeds para PDA verification y signing.",
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
        "title": "Avanzado PDA Patterns",
        "description": "Implement avanzado PDA patterns (nested/counter/stateful) while preserving seguridad invariants y migration safety.",
        "lessons": {
          "lesson-50-2-1": {
            "title": "PDA Diseno Patterns",
            "content": "Avanzado PDA patterns solve real scaling y composability needs but increase diseno complexity.\n\nNested PDAs, counter-based PDAs, y multi-tenant PDA namespaces each require explicit invariants around uniqueness, lifecycle, y authority boundaries.\n\nKey safeguards:\n- monotonic counters con replay protection,\n- collision checks in shared namespaces,\n- explicit ownership checks on all derived-state paths,\n- deterministic migration paths when schema/seed versions evolve.\n\nCross-program PDA interactions must minimize signer scope. invoke_signed should only grant exactly what downstream steps require.\n\nOperationally, avanzado PDA systems need deterministic audit artifacts: derivation inputs, expected outputs, y validation results by instruccion path.\n\nComplex PDA architecture is safe when derivation logic remains simple to reason about y impossible to interpret ambiguously.",
            "duration": "45 min"
          },
          "lesson-50-2-2": {
            "title": "Nested PDA Generator Challenge",
            "content": "Generate PDAs derived from other PDA addresses.",
            "duration": "45 min",
            "hints": [
              "Include parent address in child seeds",
              "Use index bytes para sibling derivation",
              "Verify by re-deriving y comparing"
            ]
          },
          "lesson-50-2-3": {
            "title": "Counter PDA Generator Challenge",
            "content": "Generate unique PDAs using incrementing counters.",
            "duration": "45 min",
            "hints": [
              "Increment counter after each generation",
              "Use counter in seeds para uniqueness",
              "Batch generation calls generate_next multiple times"
            ]
          },
          "lesson-50-2-4": {
            "title": "PDA Collision Detector Challenge",
            "content": "Detect y prevent PDA seed collisions.",
            "duration": "45 min",
            "hints": [
              "Check if seeds match any existing entry",
              "Return error if collision detected",
              "Collision risk if same structure y component sizes"
            ]
          }
        }
      }
    }
  },
  "solana-economics": {
    "title": "Solana Economics y Token Flows",
    "description": "Analyze Solana economic dynamics in production context: inflation/fee-burn interplay, staking flows, supply movement, y protocol sustainability tradeoffs.",
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
            "content": "Solana economics is the interaction of issuance, burn, staking rewards, y usage demand. Sustainable protocol decisions require understanding these flows as a system, not isolated metrics.\n\nCore mechanisms include:\n1) inflation schedule y long-term emission behavior,\n2) fee burn y validador reward pathways,\n3) staking participation effects on circulating supply.\n\nEconomic analysis should be scenario-driven. Single-point estimates hide risk. Teams should model calm/high-usage/low-usage regimes y compare supply-pressure outcomes.\n\nDeterministic calculators are useful para gobernanza y product planning because they make assumptions explicit: epoch cadence, fee volume, staking ratio, y unlock schedules.\n\nHealthy economic reasoning links network-level flows to protocol-level choices (treasury policy, incentive emissions, fee strategy).\n\nEconomic quality improves when teams publish assumption-driven reports instead of headline narratives.",
            "duration": "45 min"
          },
          "lesson-51-1-2": {
            "title": "Inflation Calculator Challenge",
            "content": "Calculate inflation rate y staking rewards over time.",
            "duration": "45 min",
            "hints": [
              "Use powi para disinflation calculation",
              "Compound inflation year over year",
              "APY is inflation divided by staked percentage"
            ]
          },
          "lesson-51-1-3": {
            "title": "Fee Burn Calculator Challenge",
            "content": "Calculate fee burns y their deflationary impact.",
            "duration": "45 min",
            "hints": [
              "Priority multiplier increases con priority level",
              "Burn is percentage of total fee",
              "Annual estimate is daily * 365"
            ]
          },
          "lesson-51-1-4": {
            "title": "Rent Economics Calculator Challenge",
            "content": "Calculate rent costs y exemption thresholds.",
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
        "description": "Model token flow dynamics y sustainability signals using supply categories, unlock events, y behavior-driven liquidity effects.",
        "lessons": {
          "lesson-51-2-1": {
            "title": "Token Flow Dynamics",
            "content": "Token flow analysis turns abstract economics into operational insight. The key is to track where tokens are (staked, circulating, locked, treasury, pending unlock) y how they move over time.\n\nUseful flow metrics include:\n- net circulating change,\n- staking inflow/outflow trend,\n- unlock cliff concentration,\n- treasury spend velocity.\n\nUnlock events should be modeled para market-impact risk. Large clustered unlocks can create short-term supply shock even when long-term tokenomics is sound.\n\nFlow tooling should support deterministic category accounting y conservation checks (total categorized supply consistency).\n\nPara gobernanza, flow analysis is most valuable when tied to policy actions: adjust emissions, change vesting cadence, alter incentive programs.\n\nSustainable token systems are not static designs; they are continuously monitored flow systems con explicit policy feedback loops.",
            "duration": "45 min"
          },
          "lesson-51-2-2": {
            "title": "Supply Flow Tracker Challenge",
            "content": "Track token supply categories y flows.",
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
            "content": "Calculate sustainability metrics para tokenomics.",
            "duration": "45 min",
            "hints": [
              "Net issuance is inflation minus burn",
              "Burn ratio is burn divided by inflation",
              "Score combines burn ratio y staking ratio"
            ]
          }
        }
      }
    }
  }
};
