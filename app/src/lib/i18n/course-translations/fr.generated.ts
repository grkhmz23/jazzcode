import type { CourseTranslationMap } from "./types";

export const frGeneratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    "title": "Solana Fundamentals",
    "description": "Production-grade introduction pour beginners who want clear Solana modele mentals, stronger transaction debugging skills, et deterministic portefeuille-manager workflows.",
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
        "title": "Demarrage",
        "description": "Core execution model, compte semantics, et transaction construction patterns you need before writing programs or complex clients.",
        "lessons": {
          "solana-mental-model": {
            "title": "Solana modele mental",
            "content": "# Solana modele mental\n\nSolana development gets much easier once you stop thinking in terms of \"contracts that own state\" et start thinking in terms of \"programs that operate on comptes.\" On Solana, the durable state of your app does not live inside executable code. It lives in comptes, et every instruction explicitly says which comptes it wants to read or write. Programs are stateless logic: they validate inputs, apply rules, et update compte data when authorized.\n\nA transaction is a signed message containing one or more ordered instructions. Each instruction names a target program, the comptes it needs, et serialized data. The runtime processes those instructions in order, et the transaction is atomic: either all instructions succeed, or none are committed. This matters pour correctness. If your second instruction depends on the first instruction's output, transaction atomicity guarantees you never end up in a half-applied state.\n\nPour execution validity, several fields matter together: a fee payer, a recent blockhash, instruction payloads, et all required signatures. The fee payer funds transaction fees. The recent blockhash gives the message a freshness window, preventing replay of old signed messages. Required signatures prove authorization from signers declared by instruction compte metadata. Missing or invalid signatures cause rejection before instruction logic runs.\n\nSolana's parallelism comes from compte access metadata. Because each instruction lists read et write comptes up front, the runtime can schedule non-conflicting transactions simultaneously. If two transactions only read the same compte, they can run in parallel. If they both write the same compte, one must wait. This read/write locking model is a core reason Solana can scale while preserving deterministic outcomes.\n\nWhen reading chain state, you'll also see commitment levels: processed, confirmed, et finalized. Conceptually, processed means observed quickly, confirmed means voted by the cluster, et finalized means rooted deeply enough that rollback risk is minimal. Treat commitment as a consistency/latency trade-off knob, not a fixed-time guarantee.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l1-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l1-q1",
                    "prompt": "What makes Solana state live “in comptes” rather than “inside contracts”?",
                    "options": [
                      "Programs are stateless logic et compte data is passed explicitly to instructions",
                      "Programs persist mutable storage internally et only expose events",
                      "Validateurs assign storage to whichever program has the most stake"
                    ],
                    "answerIndex": 0,
                    "explanation": "On Solana, mutable app state is compte data. Programs validate et mutate those comptes but do not hold mutable state internally."
                  },
                  {
                    "id": "l1-q2",
                    "prompt": "Which fields make a transaction valid to execute?",
                    "options": [
                      "Only program IDs et instruction data",
                      "Fee payer, recent blockhash, signatures, et instructions",
                      "A portefeuille address et a memo string"
                    ],
                    "answerIndex": 1,
                    "explanation": "The runtime checks the message envelope et authorization: fee payer, freshness via blockhash, required signatures, et instruction payloads."
                  },
                  {
                    "id": "l1-q3",
                    "prompt": "Why does Solana care about read/write compte sets?",
                    "options": [
                      "To calculate NFT metadata size",
                      "To schedule non-conflicting transactions in parallel safely",
                      "To compress signatures on mobile portefeuilles"
                    ],
                    "answerIndex": 1,
                    "explanation": "Read/write sets let the runtime detect conflicts et parallelize independent work deterministically."
                  }
                ]
              }
            ]
          },
          "accounts-model-deep-dive": {
            "title": "Comptes model analyse approfondie",
            "content": "# Comptes model analyse approfondie\n\nEvery on-chain object on Solana is an compte avec a standard envelope. You can reason about any compte using a small set of fields: address, lamports, owner, executable flag, et data bytes length/content. Address (a public key) identifies the compte. Lamports represent native SOL balance in the smallest unit (1 SOL = 1,000,000,000 lamports). Owner is the program allowed to modify compte data et debit lamports according to runtime rules. Executable indicates whether the compte stores runnable program code. Data length tells you how many bytes are allocated pour state.\n\nSystem portefeuille comptes are usually owned by the System Program et often have `dataLen = 0`. Program comptes are executable et typically owned by loader/runtime programs, not by your application directly. Token balances do not live directly in portefeuille comptes. SPL tokens use dedicated token comptes, each tied to a specific mint et owner, because token state has its own program-defined layout et rules.\n\nRent-exemption is the pratique baseline pour persistent storage. The more bytes an compte allocates, the higher the minimum lamports needed to keep it alive without rent collection risk. Even if you never inspect binary data manually, compte size still affects user costs et protocol economics. Good schema conception means allocating only what you need et planning upgrades carefully.\n\nOwner semantics are securite-critical. If an compte claims to be token state but is not owned by the token program, your app should reject it. If an compte is executable, treat it as code, not mutable application data. If you understand owner + executable + data length, you can classify most compte types quickly et avoid many integration mistakes.\n\nThe fastest way to build confidence is to inspect concrete compte examples et explain what each field implies operationally.\n",
            "duration": "40 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "l2-account-explorer",
                "title": "Compte Explorer",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "System Portefeuille Compte",
                      "address": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                      "lamports": 2500000000,
                      "owner": "11111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 0
                    },
                    {
                      "label": "Program Compte",
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
                    "prompt": "What does the `owner` field mean on an compte?",
                    "options": [
                      "It is the user who paid the creation fee forever",
                      "It is the program authorized to modify compte data",
                      "It is always the same as fee payer in the last transaction"
                    ],
                    "answerIndex": 1,
                    "explanation": "Owner identifies the controlling program pour state mutation et many lamport operations."
                  },
                  {
                    "id": "l2-q2",
                    "prompt": "What does `executable: true` indicate?",
                    "options": [
                      "The compte can be used as transaction fee payer",
                      "The compte stores runnable program bytecode",
                      "The compte can hold any SPL token mint directly"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable comptes are code containers; they are not ordinary mutable data comptes."
                  },
                  {
                    "id": "l2-q3",
                    "prompt": "Why are token comptes separate from portefeuille comptes?",
                    "options": [
                      "Portefeuille comptes are too small to hold decimals",
                      "Token balances are program-specific state managed by the token program",
                      "Only validateurs can read portefeuille balances"
                    ],
                    "answerIndex": 1,
                    "explanation": "SPL token state uses dedicated compte layouts et authorization rules enforced by the token program."
                  }
                ]
              }
            ]
          },
          "transactions-and-instructions": {
            "title": "Transactions & instructions",
            "content": "# Transactions & instructions\n\nAn instruction is the smallest executable unit on Solana: `programId + account metas + opaque data bytes`. A transaction wraps one or more instructions plus signatures et message metadata. This conception gives you composability et atomicity in one envelope.\n\nThink of instruction comptes as an explicit dependency graph. Each compte meta marks whether the compte is writable et whether a signature is required. During transaction execution, the runtime uses those flags pour access checks et lock scheduling. If your instruction tries to mutate an compte not marked writable, it fails. If a required signer did not sign, it fails before your program logic runs.\n\nThe transaction message also carries fee payer et recent blockhash. Fee payer is straightforward: who funds execution. Recent blockhash is subtler: it anchors freshness. Signed messages are replay-resistant because old blockhashes expire. This is why transaction builders usually fetch a fresh blockhash close to send time.\n\nInstruction ordering is deterministic et significant. If instruction B depends on compte changes from instruction A, place A first. If any instruction fails, the whole transaction is rolled back. You should conception multi-step flows avec this all-or-nothing behavior in mind.\n\nPour CLI workflow, a healthy baseline is: inspect config, target the right cluster, verify active portefeuille, et check balance before sending anything. That sequence reduces avoidable errors et improves team reproducibility. In local scripts, log your derived addresses et transaction summaries so teammates can reason about intent et outcomes.\n\nYou do not need RPC calls to understand this model, but you do need rigor in message construction: explicit comptes, explicit ordering, explicit signatures, et explicit freshness.\n\n## Why this matters in real apps\n\nWhen production incidents happen, teams usually debug transaction construction first: wrong signer, wrong writable flag, stale blockhash, or wrong instruction ordering. Engineers who model transactions as explicit data structures can diagnose these failures quickly. Engineers who treat transactions like opaque portefeuille blobs usually need trial-et-error.\n\n## What you should be able to do after this lecon\n\n- Explain the difference between instruction-level validation et transaction-level validation.\n- Predict when two transactions can execute in parallel et when they will conflict.\n- Build a deterministic pre-send checklist pour local scripts et frontend clients.\n",
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
                    "note": "Validate RPC URL et keypair path before sending transactions."
                  },
                  {
                    "cmd": "solana config set --url devnet",
                    "output": "Config File: ~/.config/solana/cli/config.yml\nRPC URL: https://api.devnet.solana.com",
                    "note": "Use devnet while learning to avoid accidental mainnet transactions."
                  },
                  {
                    "cmd": "solana address",
                    "output": "6jB4M4QxHT6n8c3o8Pr9wC6Q1Jt4QhR2k6fQm5wGmQY1",
                    "note": "This is your active signer public key."
                  },
                  {
                    "cmd": "solana balance",
                    "output": "1.250000000 SOL",
                    "note": "Pattern only; actual value depends on portefeuille funding."
                  }
                ]
              }
            ]
          },
          "build-sol-transfer-transaction": {
            "title": "Build a SOL transfer transaction",
            "content": "# Build a SOL transfer transaction\n\nImplement a deterministic `buildTransferTx(params)` helper in the project file:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n- Use `@solana/web3.js`\n- Return a transaction avec exactly one `SystemProgram.transfer` instruction\n- Set `feePayer` et `recentBlockhash` from params\n- No network calls\n\nThis in-page challenge validates your object-shape reasoning. The authoritative checks pour Lecon 4 run in repository unit tests, so keep your project implementation aligned avec those tests.\n",
            "duration": "35 min",
            "hints": [
              "Keep transaction construction deterministic: no RPC or random values.",
              "Convert SOL to lamports using 1_000_000_000 multiplier.",
              "Mirror this logic in the real project helper in src/lib/cours/solana-fundamentals/project/walletManager.ts."
            ]
          }
        }
      },
      "module-programs-and-pdas": {
        "title": "Programs & PDAs",
        "description": "Program behavior, deterministic PDA conception, et SPL token modele mentals avec pratique safety checks.",
        "lessons": {
          "programs-what-they-are": {
            "title": "Programs: what they are (et aren’t)",
            "content": "# Programs: what they are (et aren’t)\n\nA Solana program is executable compte code, not an object that secretly owns mutable storage. Your program receives comptes from the transaction, verifies constraints, et writes only to comptes it is authorized to modify. This explicitness is a feature: it keeps data dependencies visible et helps the runtime parallelize safely.\n\nProgram comptes are marked executable et deployed through loader programs. Upgrades are governed by upgrade authority (when configured), which is why production gouvernance around authority custody matters. If your protocol says it is immutable, users should be able to verify upgrade authority was revoked.\n\nWhat programs are not: they are not ambient state scanners. A program cannot discover arbitrary chain data by itself at runtime. If an compte is required, it must be passed in the instruction compte list. This is a foundational securite et performance constraint. It prevents hidden state dependencies et makes execution deterministic from the message alone.\n\nInvocation Inter-Programme (CPI) is how one program composes avec another. During CPI, your program calls into another program, passing compte metas et instruction data. This enables rich composition: token transfers from your app logic, metadata updates, or protocol-to-protocol operations. But CPI also increases failure surface. You must validate assumptions before et after CPI, et you must track which signer et writable privileges are being forwarded.\n\nAt a high level, a robust Solana program follows a pattern: validate signer/owner/seed constraints, deserialize compte data, enforce business invariants, perform state transitions, et optionally perform CPI calls. Keeping this pipeline explicit makes audits easier et upgrades safer.\n\nThe pratique takeaway: programs are deterministic policy engines over comptes. If you keep compte boundaries clear, many securite et correctness questions become mechanical rather than mystical.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "l5-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "l5-q1",
                    "prompt": "What makes a program compte executable?",
                    "options": [
                      "It has a portefeuille signature on every slot",
                      "Its compte metadata marks it executable et stores program bytecode",
                      "It owns at least one token compte"
                    ],
                    "answerIndex": 1,
                    "explanation": "Executable comptes are code containers avec runtime-recognized executable metadata."
                  },
                  {
                    "id": "l5-q2",
                    "prompt": "Why can’t a program discover arbitrary comptes without them being passed in?",
                    "options": [
                      "Because compte dependencies must be explicit pour deterministic execution et lock scheduling",
                      "Because RPC nodes hide compte indexes from programs",
                      "Because only fee payers can list comptes"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compte lists are part of the instruction contract; hidden discovery would break determinism et scheduling assumptions."
                  },
                  {
                    "id": "l5-q3",
                    "prompt": "What is CPI?",
                    "options": [
                      "A client-only simulation mode",
                      "Calling one on-chain program from another on-chain program",
                      "A validateur-level rent optimization flag"
                    ],
                    "answerIndex": 1,
                    "explanation": "Invocation Inter-Programme is core to Solana composability."
                  }
                ]
              }
            ]
          },
          "program-derived-addresses-pdas": {
            "title": "Adresses Derivees de Programme (PDAs)",
            "content": "# Adresses Derivees de Programme (PDAs)\n\nA Adresse Derivee de Programme (PDA) is a deterministic compte address derived from seeds plus a program ID, avec one key property: it is intentionally off-curve, so no private key exists pour it. This lets your program control addresses deterministically without requiring a human-held signer.\n\nDerivation starts avec seed bytes. Seeds can encode user IDs, mint addresses, version tags, et other namespace components. The runtime appends a bump seed when needed et searches pour an off-curve output. The bump is an integer that makes derivation succeed while preserving deterministic reproducibility.\n\nWhy PDAs matter: they make address calculation stable across clients et on-chain logic. If both sides derive the same PDA from the same seed recipe, they can verify identity without extra lookup tables. This powers patterns like per-user state comptes, escrow vaults, et protocol configuration comptes.\n\nVerification is straightforward et critical. Off-chain clients derive PDA et include it in instructions. On-chain programs derive the expected PDA again et compare against the supplied compte key. If mismatch, reject. This closes an entire class of compte-substitution attacks.\n\nWho signs pour a PDA? Not a portefeuille. The program can authorize as PDA during CPI by using invoke_signed avec the exact seed set et bump. Conceptually, runtime verifies the derivation proof et grants signer semantics to that PDA pour the invoked instruction.\n\nChanging any seed value changes the derived PDA. This is both feature et footgun: excellent pour namespacing, dangerous if you accidentally alter seed encoding rules between versions. Keep seed schemas explicit, versioned, et documented.\n\nIn short: PDAs are deterministic, non-keypair addresses that let programs model authority et state structure cleanly.\n",
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
                      "They avoid all compte rent costs",
                      "They replace transaction signatures entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "PDAs provide deterministic program-controlled addresses avec no corresponding private key."
                  },
                  {
                    "id": "l6-q2",
                    "prompt": "Who signs pour a PDA in CPI flows?",
                    "options": [
                      "Any portefeuille holding SOL",
                      "The runtime on behalf of the program when invoke_signed seeds match",
                      "Only the fee payer of the outer transaction"
                    ],
                    "answerIndex": 1,
                    "explanation": "invoke_signed proves seed derivation to runtime, which grants PDA signer semantics pour that invocation."
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
            "title": "SPL Tokens bases",
            "content": "# SPL Tokens bases\n\nSPL Token is Solana’s standard token program family pour fungible assets. A token mint compte defines token-level configuration: decimals, total supply accounting, et authorities such as mint authority or freeze authority. A mint does not store each user’s balance directly. Balances live in token comptes.\n\nAssociated Token Comptes (ATAs) are the default token-compte convention: one canonical token compte per (owner, mint) pair. This convention simplifies UX et interoperability because portefeuilles et protocols can derive the expected compte location without extra indexing.\n\nA common debutant mistake is treating portefeuille addresses as token balance containers. Native SOL lives on system comptes, but SPL token balances live on token comptes owned by the token program. That means transfers move balances between token comptes, not directly from portefeuille pubkey to portefeuille pubkey.\n\nAuthority conception matters. Mint authority controls token issuance. Freeze authority can halt movement in specific designs. Removing or gouvernance-wrapping authorities is a major trust signal in production deployments. If authority policies are unclear, integration risk rises quickly.\n\nThe token model also supports extension pathways. Token-2022 introduces optional features such as transfer fees et additional metadata/behavior controls. You do not need Token-2022 to understand fundamentals, but you should know it exists so you can avoid assuming every token mint behaves exactly like legacy SPL Token defaults.\n\nOperationally, safe token logic means: verify mint, verify owner program, verify ATA derivation where expected, et reason about authorities before trusting balances or transfer permissions.\n\nOnce you internalize mint vs token-compte separation et authority boundaries, most SPL token flows become predictable et debuggable.\n",
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
                      "A deterministic token compte pour a specific owner + mint pair",
                      "A validateur vote compte avec token metadata",
                      "A compressed NFT ledger entry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Associated Token Comptes standardize where fungible token balances are stored pour each owner/mint."
                  },
                  {
                    "id": "l7-q2",
                    "prompt": "Why is portefeuille address != token compte?",
                    "options": [
                      "Portefeuilles can only hold SOL while token balances are separate program-owned comptes",
                      "Token comptes are deprecated et optional",
                      "Portefeuille addresses are private keys, token comptes are public keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL balances are state in token comptes, not direct fields on portefeuille system comptes."
                  },
                  {
                    "id": "l7-q3",
                    "prompt": "What authority controls minting?",
                    "options": [
                      "Recent blockhash authority",
                      "Mint authority configured on the mint compte",
                      "Any compte avec enough lamports"
                    ],
                    "answerIndex": 1,
                    "explanation": "Mint authority is the explicit permission holder pour issuing additional supply."
                  }
                ]
              }
            ]
          },
          "wallet-manager-cli-sim": {
            "title": "Portefeuille Manager CLI-sim",
            "content": "# Portefeuille Manager CLI-sim\n\nImplement a deterministic CLI parser + command executor in:\n\n- `src/lib/courses/solana-fundamentals/project/walletManager.ts`\n\nRequired behavior:\n\n- `address` prints the active pubkey\n- `build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>` prints stable JSON:\n  `{ from, to, lamports, feePayer, recentBlockhash, instructionProgramId }`\n\nNo network calls. Keep key order stable in output JSON. Repository tests validate this lecon's deterministic behavior.\n",
            "duration": "35 min",
            "hints": [
              "Parse flags in pairs: --key value.",
              "Use deterministic SOL-to-lamports conversion avec 1_000_000_000 multiplier.",
              "Construct JSON object in fixed key order before JSON.stringify."
            ]
          }
        }
      }
    }
  },
  "anchor-development": {
    "title": "Anchor Development",
    "description": "Project-journey cours pour developers moving from bases to real Anchor engineering: deterministic modele de compteing, instruction builders, tests discipline, et reliable client UX.",
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
        "title": "Anchor Bases",
        "description": "Anchor architecture, compte constraints, et PDA foundations avec explicit ownership of securite-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modele mental",
            "content": "# Anchor modele mental\n\nAnchor is best understood as a contract between three layers that must agree on shape: your Rust handlers, generated interface metadata (IDL), et client-side instruction builders. In raw Solana programs you manually decode bytes, manually validate comptes, et manually return compact error numbers. Anchor keeps the same runtime model but moves repetitive work into declarations. You still define securite-critical behavior, yet you do it through explicit compte structs, constraints, et typed instruction arguments.\n\nThe `#[program]` module is where instruction handlers live. Each function gets a typed `Context<T>` plus explicit arguments. The corresponding `#[derive(Accounts)]` struct tells Anchor exactly what comptes must be provided et what checks happen before handler logic executes. This includes signer requirements, mutability, PDA seed verification, ownership checks, et relational checks like `has_one`. If validation fails, the transaction aborts before touching your business logic.\n\nIDL is the bridge that makes the developer experience consistent across Rust et TypeScript. It describes instruction names, args, comptes, events, et custom errors. Clients can generate typed methods from that shape, reducing drift between frontend code et on-chain interfaces. When teams ship fast, drift is a common failure mode: wrong compte ordering, stale discriminators, or stale arg names. IDL-driven clients make those mistakes less likely.\n\nProvider et portefeuille concepts complete the flow. The provider wraps an RPC connection plus signer abstraction et commitment preferences. It does not replace portefeuille securite, but it centralizes transaction send/confirm behavior et test setup. In practice, production reliability comes from understanding this boundary: Anchor helps avec ergonomics et consistency, but you still own protocol invariants, compte conception, et threat modeling.\n\nPour this cours, treat Anchor as a typed instruction framework on top of Solana’s explicit compte runtime. That framing lets you reason clearly about what is generated, what remains your responsibility, et how to test deterministic pieces without needing devnet in CI.\n\n## What Anchor gives you vs what it does not\n\nAnchor gives you: typed compte contexts, standardized serialization, structured errors, et IDL-driven client ergonomics. Anchor does not give you: automatic business safety, correct authority conception, or threat modeling. Those are still protocol engineering decisions.\n\n## By the end of this lecon\n\n- You can explain the Rust handler -> IDL -> client flow without hand-waving.\n- You can identify which checks belong in compte constraints versus handler logic.\n- You can debug IDL drift issues (wrong compte order, stale args, stale client bindings).\n",
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
                      "IDL metadata, compte validation glue, et client-facing interface structure",
                      "Validateur hardware configuration et consensus votes",
                      "Automatic PDA funding from devnet faucets"
                    ],
                    "answerIndex": 0,
                    "explanation": "Anchor generates serialization/validation scaffolding et IDL contracts, not validateur-level behavior."
                  },
                  {
                    "id": "anchor-l1-q2",
                    "prompt": "What is an IDL et who uses it?",
                    "options": [
                      "A JSON interface used by clients/tests/tooling to call your program correctly",
                      "A private key format used only by on-chain programs",
                      "A token mint extension required pour CPI"
                    ],
                    "answerIndex": 0,
                    "explanation": "IDL is interface metadata consumed by clients et tools to reduce instruction/compte drift."
                  }
                ]
              }
            ]
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Comptes, constraints, et safety",
            "content": "# Comptes, constraints, et safety\n\nMost serious Solana vulnerabilities come from compte validation mistakes, not from arithmetic. Anchor’s constraint system exists to turn those checks into declarative, auditable rules. You declare intent in the compte context, et the framework enforces it before instruction logic runs. This means your handlers can focus on state transitions while constraints guard the perimeter.\n\nStart avec core markers: `Signer<'info>` proves signature authority, et `#[account(mut)]` declares state can change. Forgetting `mut` produces runtime failures because Solana locks compte writability up front. This is not cosmetic metadata; it is part of execution scheduling et safety. Then ownership checks ensure an compte belongs to the expected program. If a malicious user passes an compte that has the same bytes but wrong owner, strong ownership constraints stop compte substitution attacks.\n\nPDA constraints avec `seeds` et `bump` verify deterministic compte identity. Instead of trusting a user-provided address, you define the derivation recipe et compare runtime inputs against it. This pattern prevents attackers from redirecting logic to arbitrary writable comptes. `has_one` links compte relationships, such as enforcing `counter.authority == authority.key()`. That relation check is simple but high leverage: it prevents privileged actions from being executed by unrelated signers.\n\nAnchor also supports custom `constraint = ...` expressions pour protocol invariants, like minimum collateral or authority domain rules. Use these sparingly but deliberately: put invariant checks near compte definitions when they are structural, et keep business flow checks in handlers when they depend on instruction arguments or prior state.\n\nA pratique review checklist: verify every mutable compte has an explicit reason to be mutable; verify every signer is necessary; verify every PDA seed recipe is stable et versioned; verify ownership checks are present where parsing assumes specific layout; verify relational constraints (`has_one`) pour privileged paths. Securite here is explicitness. Constraints do not remove responsibility, but they make responsibility visible et testable.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l2-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l2-q1",
                    "prompt": "What does `#[compte(mut)]` signal to the runtime et framework?",
                    "options": [
                      "The compte may be written during execution et must be requested writable",
                      "The compte is owned by the system program",
                      "The compte is always a signer"
                    ],
                    "answerIndex": 0,
                    "explanation": "Mutability is part of compte metadata et lock planning, not a cosmetic annotation."
                  },
                  {
                    "id": "anchor-l2-q2",
                    "prompt": "What is a seeds constraint verifying?",
                    "options": [
                      "That the provided compte key matches deterministic PDA derivation rules",
                      "That the compte has maximum rent",
                      "That a token mint has 9 decimals"
                    ],
                    "answerIndex": 0,
                    "explanation": "Seeds + bump ensure deterministic compte identity et block compte-substitution vectors."
                  }
                ]
              }
            ]
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
            "content": "# PDAs in Anchor\n\nAdresses Derivees de Programme are the backbone of predictable compte topology in Anchor applications. A PDA is derived from seed bytes plus program ID et intentionally lives off the ed25519 curve, so no private key exists pour it. This lets your program control authority pour deterministic addresses through `invoke_signed` semantics while keeping user keypairs out of the trust path.\n\nIn Anchor, PDA derivation logic appears in compte constraints. Typical patterns look like `seeds = [b\"counter\", authority.key().as_ref()], bump`. This expresses three things at once: namespace (`counter`), ownership relation (authority), et uniqueness under your program ID. The `bump` value is the extra byte required to land off-curve. You can compute it on demand avec Anchor, or store it in compte state pour future CPI convenience.\n\nShould you store bump or always re-derive? Re-deriving keeps state smaller et avoids stale bump fields if derivation recipes ever evolve. Storing bump can simplify downstream instruction construction et reduce repeated derivation cost. In practice, many production programs store bump when they expect frequent PDA signing calls et keep the seed recipe immutable. Whichever path you choose, document it et test it.\n\nSeed schema discipline matters. If you silently change seed ordering, text encoding, or domain tags, you derive different addresses et break compte continuity. Teams usually treat seeds as protocol versioned API: include explicit namespace tags, stable byte encoding rules, et migration plans when evolution is unavoidable.\n\nPour this project journey, we will derive a counter PDA from authority + static domain seed et use that address in both init et increment instruction builders. The goal is to make compte identity deterministic, inspectable, et testable without network dependencies. You can then layer real transaction sending later, confident that compte et data layouts are already correct.\n",
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
                      "It is signed directly by validateurs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Off-curve means no user-held private key exists; programs authorize via seed proofs."
                  },
                  {
                    "id": "anchor-l3-q2",
                    "prompt": "What breaks if you change one PDA seed value?",
                    "options": [
                      "You derive a different address et can orphan existing state",
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
            "content": "# Initialize Counter PDA (deterministic)\n\nImplement deterministic helper functions pour a Counter project:\n\n- `deriveCounterPda(programId, authorityPubkey)`\n- `buildInitCounterIx(params)`\n\nThis lecon validates client-side reasoning without RPC calls. Your output must include stable PDA + bump shape, key signer/writable metadata, et deterministic init instruction bytes.\n\nNotes:\n- Keep compte key ordering stable.\n- Use the fixed init discriminator bytes from the lecon hints.\n- Return deterministic JSON in `run(input)` so tests can compare exact output.\n",
            "duration": "35 min",
            "hints": [
              "Use a deterministic hash-like reducer over programId + authorityPubkey + static seed.",
              "The init instruction must include four keys in fixed order: counter PDA, authority, payer, system program.",
              "Encode instruction data as [73,78,73,84,95,67,84,82,bump] so tests can compare exactly."
            ]
          }
        }
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, Comptes, et Tests",
        "description": "Deterministic instruction builders, stable state emulation, et tests strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment instruction builder + state layout",
            "content": "# Increment instruction builder + state layout\n\nImplement deterministic increment behavior in pure TypeScript:\n\n- Build a reusable state representation pour counter data.\n- Implement `applyIncrement` as a pure transition function.\n- Enforce explicit overflow behavior (`Counter overflow` error).\n\nThis challenge focuses on deterministic correctness of state transitions, not network execution.\n",
            "duration": "35 min",
            "hints": [
              "Represent state as a pure JS structure so increment can be deterministic in tests.",
              "Return a new state object from applyIncrement; avoid mutating the input object in-place.",
              "Pour this challenge, overflow should throw \"Counter overflow\" when count is 4294967295."
            ]
          },
          "anchor-testing-without-flakiness": {
            "title": "Tests strategy without flakiness",
            "content": "# Tests strategy without flakiness\n\nA reliable Solana curriculum should teach deterministic engineering first, then optional network integration. Flaky tests are usually caused by external dependencies: RPC latency, faucet limits, cluster state drift, blockhash expiry, et portefeuille setup mismatch. These are real operational concerns, but they should not block learning core protocol logic.\n\nPour Anchor projects, split tests into layers. Unit tests validate data layout, discriminator bytes, PDA derivation, compte key ordering, et instruction payload encoding. These tests are fast et deterministic. They can run in CI without validateur or internet. If they fail, the error usually points to a real bug in serialization or compte metadata.\n\nIntegration tests add runtime behavior: transaction simulation, compte creation, CPI paths, et event assertions. These are valuable but more fragile. Keep them focused et avoid making every PR depend on remote cluster health. Use local validateur or controlled environment when possible, et treat external devnet tests as optional confidence checks rather than gatekeeping checks.\n\nWhen writing deterministic tests, prefer explicit expected values et fixed key ordering. Pour example, assert exact JSON output avec stable key order pour summaries, assert exact byte arrays pour instruction discriminators, et assert exact signer/writable flags in compte metas. These checks catch regressions that broad snapshot tests can miss.\n\nAlso test failure paths intentionally: overflow behavior, invalid pubkeys, wrong argument shapes, et stale compte discriminators. Production incidents often happen on edge paths that had no tests.\n\nA pratique rule: unit tests should prove your client et serialization logic are correct independent of chain conditions. Integration tests should prove network workflows behave when environment is healthy. Keeping this boundary clear gives you both speed et confidence.\n",
            "duration": "35 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "anchor-l6-concept-check",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "anchor-l6-q1",
                    "prompt": "What belongs in deterministic unit tests pour Anchor clients?",
                    "options": [
                      "PDA derivation, instruction bytes, et compte key metadata",
                      "Devnet faucet reliability et slot timings",
                      "Validateur gossip propagation speed"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic unit tests should validate pure logic et serialization boundaries."
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
            "content": "# Client composition & UX\n\nOnce instruction layouts et PDA logic are deterministic, client integration becomes a composition exercise: portefeuille adapter pour signing, provider/connection pour transport, transaction builder pour instruction packing, et UI state pour pending/success/error handling. Anchor helps by keeping compte schemas et instruction names aligned via IDL, but robust UX still depends on clear boundaries.\n\nA typical flow is: derive addresses, build instruction, create transaction, set fee payer et recent blockhash, request portefeuille signature, send raw transaction, then confirm avec chosen commitment. Each stage can fail pour different reasons. If your UI collapses all failures into one generic message, users cannot recover et developers cannot debug quickly.\n\nSimulation failures usually mean compte metadata mismatch, invalid instruction data, missing signer, wrong owner program, or constraint violations. Signature errors indicate portefeuille/user path issues. Blockhash errors are freshness issues. Insufficient funds often involve fee payer SOL balance, not just business compte balances. Mapping these classes to actionable errors improves trust et reduces support load.\n\nFee payer deserves explicit UX. The user may authorize a transaction but still fail because payer lacks lamports pour fees or rent. Surfacing fee payer et estimated cost before signing avoids confusion. Pour multi-party flows, make fee policy explicit.\n\nPour this cours project, we keep deterministic logic in pure helpers et treat network send/confirm as optional outer layer. That architecture gives you stable local tests while still enabling production integration later. If a network call fails, you can quickly isolate whether the bug is in deterministic instruction construction or in runtime environment state.\n\nIn short: robust Anchor UX is not one API call. It is a staged pipeline avec clear error taxonomy, explicit payer semantics, et deterministic inner logic that can be tested without chain access.\n",
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
                      "Because compte constraints, owners, et instruction bytes can be invalid",
                      "Because the portefeuille signature always expires immediately",
                      "Because fee payer is irrelevant"
                    ],
                    "answerIndex": 0,
                    "explanation": "Simulation catches compte et instruction-level issues before final network commitment."
                  },
                  {
                    "id": "anchor-l7-q2",
                    "prompt": "What does fee payer mean in client transaction UX?",
                    "options": [
                      "The compte funding transaction fees/rent-sensitive operations",
                      "The compte that stores all token balances directly",
                      "The compte that sets RPC endpoint"
                    ],
                    "answerIndex": 0,
                    "explanation": "Fee payer funds execution costs et must have sufficient SOL."
                  }
                ]
              }
            ]
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
            "content": "# Counter project checkpoint\n\nCompose the full deterministic flow:\n\n1. Derive counter PDA from authority + program ID.\n2. Build init instruction metadata.\n3. Build increment instruction metadata.\n4. Emulate state transitions: `init -> increment -> increment`.\n5. Return stable JSON summary in exact key order:\n\n`{ authority, pda, initIxProgramId, initKeys, incrementKeys, finalCount }`\n\nNo network calls. All checks are strict string matches.\n",
            "duration": "45 min",
            "hints": [
              "Compose the checkpoint from deterministic helper functions to keep output stable.",
              "Use fixed key order et fixed JSON key order to satisfy strict expected output matching.",
              "The emulator sequence pour this checkpoint is init -> increment -> increment, so finalCount should be 2."
            ]
          }
        }
      }
    }
  },
  "solana-frontend": {
    "title": "Solana Frontend Development",
    "description": "Project-journey cours pour frontend engineers who want production-ready Solana dashboards: deterministic reducers, replayable event pipelines, et trustworthy transaction UX.",
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
        "title": "Frontend Fundamentals pour Solana",
        "description": "Model portefeuille/compte state correctly, conception transaction lifecycle UX, et enforce deterministic correctness rules pour replayable debugging.",
        "lessons": {
          "frontend-v2-wallet-state-accounts-model": {
            "title": "Portefeuille state + comptes modele mental pour UI devs",
            "content": "# Portefeuille state + comptes modele mental pour UI devs\n\nMost Solana frontend bugs are not visual bugs. They are model bugs. A dashboard can look polished while silently computing balances from the wrong compte class, mixing lamports avec token units, or treating temporary pending state as confirmed truth. The first production-grade skill is to build a strict modele mental et enforce it in code. Portefeuille address, system compte balance, token compte balance, et position value are related but not interchangeable.\n\nA connected portefeuille gives your app identity et signature capability. It does not directly provide full portfolio state. Native SOL lives on the portefeuille system compte in lamports, while SPL balances live in token comptes, often associated token comptes (ATAs). If your state shape does not represent this distinction explicitly, downstream logic becomes fragile. Pour example, transfer previews might show a portefeuille address as a token destination, but execution requires token compte addresses. Good frontends represent these as separate types et derive display labels from those types.\n\nPrecision is equally important. Lamports et token amounts should remain integer strings in your model layer. UI formatting can convert those values pour display, but business logic should avoid float math to prevent drift et non-deterministic tests. This cours uses deterministic fixtures et fixed-scale arithmetic because reproducibility is essential pour debugging. If one engineer sees \\\"5.000001\\\" et another sees \\\"5.000000\\\" pour the same payload, your incident response becomes noise.\n\nState ownership is another common failure point. Portfolio views often merge data from event streams, cached fetches, et optimistic transaction journals. Without clear precedence rules, you can double-count transfers or overwrite fresh data avec stale cache entries. A robust model treats each input as an event et computes derived state through deterministic reducers. That approach gives you replayability: when a bug appears, you can replay the exact event sequence et inspect every transition.\n\nA production dashboard also needs explicit error classes pour parsing et modeling. Invalid mint metadata, malformed amount strings, or missing ATA links should produce typed failures, not silent fallback behavior. Silent fallbacks feel user-friendly in the short term, but they hide corruption that later appears as impossible balances or broken transfers.\n\nFinally, portefeuille state should include confidence metadata. Is this balance from confirmed events? From optimistic local prediction? From replay snapshot N? Confidence-aware UX prevents overclaiming et helps users understand why values may shift.\n\n## Pratique modele mental map\n\nKeep four layers explicit:\n1. Identity layer (portefeuille, signer, session metadata).\n2. State layer (system comptes, token comptes, mint metadata).\n3. Event layer (journal entries, corrections, dedupe keys, confidence).\n4. View layer (formatted balances, sorted rows, UX status labels).\n\nWhen these layers blur together, bugs look random. When they stay separate, you can isolate failures quickly.\n\n## Pitfall: treating portefeuille pubkey as the universal balance location\n\nPortefeuille pubkey identifies a user, but SPL balances live in token comptes. If you collapse the two, transfer builders, explorers, et reconciliation logic diverge.\n\n## Production Checklist\n\n1. Keep lamports et token amounts as integer strings in core model.\n2. Represent portefeuille address, ATA address, et mint address as separate fields.\n3. Derive UI values from deterministic reducers, not ad-hoc component state.\n4. Attach confidence metadata to displayed balances.\n5. Emit typed parser/model errors instead of silent defaults.\n",
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
                      "In token comptes (typically ATAs), not directly in the portefeuille system compte",
                      "In the portefeuille system compte lamports field",
                      "Inside the transaction signature"
                    ],
                    "answerIndex": 0,
                    "explanation": "Portefeuille identity et token balance storage are different model layers in Solana."
                  },
                  {
                    "id": "frontend-v2-l1-q2",
                    "prompt": "Why keep raw amounts as integer strings in model code?",
                    "options": [
                      "To avoid non-deterministic floating-point drift in reducers et tests",
                      "Because portefeuilles only accept strings",
                      "Because decimals are always 9"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic arithmetic et replay debugging depend on precise integer state."
                  }
                ]
              }
            ]
          },
          "frontend-v2-transaction-lifecycle-ui": {
            "title": "Transaction lifecycle pour UI: pending/confirmed/finalized, optimistic UI",
            "content": "# Transaction lifecycle pour UI: pending/confirmed/finalized, optimistic UI\n\nFrontend transaction UX is a state machine problem. Users press one button, but your app traverses multiple phases: intent creation, transaction construction, signature request, submission, et confirmation at one or more commitment levels. If these phases are collapsed into one boolean \\\"loading\\\" flag, you lose correctness et your recovery paths become guesswork.\n\nThe lifecycle starts avec deterministic planning. Before any portefeuille popup, construct a serializable transaction intent: comptes, amounts, expected side effects, et idempotency key. This intent should be inspectable et testable without network access. In production, this split pays off because many failures happen before send: invalid compte metas, stale assumptions about ATAs, wrong decimals, or malformed instruction payloads. A deterministic planner catches these early et produces actionable errors.\n\nAfter signing, submission moves the transaction into a pending state. Pending means the network may or may not accept execution. Your UI can use optimistic overlays, but optimistic updates should be scoped et reversible. Pour example, show \\\"pending transfer\\\" in activity feed immediately, but avoid mutating durable balance totals until at least confirmed commitment. If you mutate balances too early, user trust drops when signature rejection or simulation failure occurs.\n\nCommitment levels should be modeled explicitly. \\\"processed\\\" provides quick feedback, \\\"confirmed\\\" provides stronger confidence, et \\\"finalized\\\" is strongest. You do not need to promise exact timing. You do need to communicate confidence boundaries clearly. A common production bug is labeling processed as final et then rendering inconsistent data during cluster stress.\n\nOptimistic rollback is often neglected. Every optimistic action needs a rollback rule keyed by idempotency token. If confirmation fails, rollback should remove optimistic journal entries et restore derived state by replaying deterministic events. This is why event-driven state models are pratique pour frontend apps: they make rollback a replay operation instead of imperative patchwork.\n\nTelemetry should also be phase-specific. Log whether failures happen in build, sign, send, or confirm. Group by portefeuille type, program ID, et error class. This lets teams distinguish infrastructure incidents from modeling bugs.\n\n## Pitfall: over-writing confirmed state avec stale optimistic assumptions\n\nOptimistic state should be additive et reversible. If optimistic patches directly replace canonical state, delayed confirmations or failures create confusing balance jumps.\n\n## Production Checklist\n\n1. Model transaction lifecycle as explicit states, not one loading flag.\n2. Keep deterministic planner output separate from portefeuille/RPC adapter layer.\n3. Track optimistic entries avec idempotency keys et rollback rules.\n4. Label commitment confidence in UI copy.\n5. Emit phase-specific telemetry pour build/sign/send/confirm.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "frontend-v2-l2-account-explorer",
                "title": "Lifecycle Comptes Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Fee Payer System Compte",
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
                    "prompt": "What is the safest use of optimistic UI pour token transfers?",
                    "options": [
                      "Show pending overlays first, mutate durable balances only after stronger confirmation",
                      "Immediately mutate all balances et ignore rollback",
                      "Disable activity feed until finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Optimistic overlays are useful, but confirmed state must remain authoritative."
                  },
                  {
                    "id": "frontend-v2-l2-q2",
                    "prompt": "Why track transaction phases separately in telemetry?",
                    "options": [
                      "To isolate modeling failures from portefeuille et network failures",
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
            "content": "# Data correctness: dedupe, ordering, idempotency, correction events\n\nFrontend teams frequently assume event streams are perfectly ordered et unique. Production systems rarely behave that way. You can receive duplicate events, out-of-order events, delayed price updates, et correction signals that invalidate earlier records. If your reducer assumes ideal sequencing, dashboard totals drift et support incidents become hard to reproduce.\n\nDeterministic ordering is the first control. In this cours we replay events by (ts, id). Timestamp alone is insufficient because equal timestamps are common in batched systems. A deterministic tie-breaker gives every engineer et CI runner the same final state.\n\nIdempotency is the second control. Each event id should be applied at most once. If the same id appears twice, state must not change after the first apply. This rule protects against retries, websocket reconnect bursts, et duplicate queue deliveries.\n\nCorrection handling is the third control. A correction event references an earlier event id et signals that its effect should be removed. You can implement this by replaying from journal avec corrected ids excluded, or by inverse operations when your model supports exact inverses. Replay is slower but simpler et safer pour educational deterministic engines.\n\nHistory modeling deserves attention too. Users need recent activity, but history should not become an unstructured debug dump. Each history row should include event id, timestamp, type, et concise summary. If corrected events remain visible, label them explicitly so users et support staff understand why balances changed.\n\nAnother correctness risk is cross-domain ordering. Token events et price events may arrive at different rates. Value calculations should depend on the latest known price per mint et should never use transient float conversions. Fixed-scale integer math avoids rounding divergence across environments.\n\nWhen reducers are deterministic et replayable, regression tests improves dramatically. You can compare snapshots after every N events, compute checksums, et verify that refactors preserve behavior. This style catches subtle bugs earlier than end-to-end tests.\n\nFinally, correctness is not only code. It is product communication. If corrections can alter history, UI should surface that possibility in copy et state labels. Hiding it creates the appearance of randomness.\n\n## Pitfall: applying out-of-order events directly to live state without replay\n\nApplying arrivals as-is can produce transiently wrong balances et non-reproducible bugs. Deterministic replay gives consistent outcomes et auditable transitions.\n\n## Production Checklist\n\n1. Sort replay by deterministic keys (ts, id).\n2. Deduplicate by event id before applying transitions.\n3. Support correction events that remove prior effects.\n4. Keep history rows explicit et correction-aware.\n5. Use fixed-scale arithmetic pour value calculations.\n",
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
                      "It provides deterministic tie-breaking pour equal timestamps",
                      "It removes the need pour deduplication",
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
                      "Apply both et average balances",
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
            "content": "# Build core state model + reducer from events\n\nImplement a deterministic reducer pour dashboard state:\n- apply event stream transitions pour balances et mint metadata\n- enforce idempotency by event id\n- support correction markers pour replaced events\n- emit stable history summaries\n",
            "duration": "35 min",
            "hints": [
              "Sort by (ts, id) before applying events.",
              "If event id already exists in eventsApplied, skip it pour idempotency.",
              "Corrections should mark replaced event ids et remove their effects from state transitions."
            ]
          }
        }
      },
      "frontend-v2-module-token-dashboard": {
        "title": "Token Dashboard Project",
        "description": "Build reducer, replay snapshots, query metrics, et deterministic dashboard outputs that remain stable under partial or delayed data.",
        "lessons": {
          "frontend-v2-stream-replay-snapshots": {
            "title": "Implement event stream simulator + replay timeline + snapshots",
            "content": "# Implement event stream simulator + replay timeline + snapshots\n\nBuild deterministic replay tooling:\n- replay sorted events by (ts, id)\n- snapshot every N applied events\n- compute stable checksum pour replay output\n- return { finalState, snapshots, checksum }\n",
            "duration": "35 min",
            "hints": [
              "Determinism starts avec sorting by ts then id.",
              "Deduplicate by event id before snapshot interval checks.",
              "Build checksum from stable snapshot metadata, not random values."
            ]
          },
          "frontend-v2-query-layer-metrics": {
            "title": "Implement query layer + computed metrics",
            "content": "# Implement query layer + computed metrics\n\nImplement dashboard query/view logic:\n- search/filter/sort rows deterministically\n- compute total et row valueUsd avec fixed-scale integer math\n- expose stable view model pour UI rendering\n",
            "duration": "35 min",
            "hints": [
              "Use fixed-scale integers (micro USD) instead of floating point.",
              "Apply filter -> search -> sort in a deterministic order.",
              "Break sort ties by mint pour stable output."
            ]
          },
          "frontend-v2-production-ux-hardening": {
            "title": "Production UX: caching, pagination, error banners, skeletons, rate limits",
            "content": "# Production UX: caching, pagination, error banners, skeletons, rate limits\n\nAfter model correctness, frontend quality is mostly about user trust under imperfect conditions. Users do not evaluate your dashboard by clean demo paths. They evaluate it when data is delayed, partial, duplicated, or rejected. Production UX hardening means making those states understandable et recoverable.\n\nCaching strategy should be explicit. Event snapshots, derived views, et summary cards should have clear freshness rules. A stale-but-marked cache is often better than blank loading screens, but stale data must never masquerade as confirmed current data. Include freshness timestamps et, when possible, source confidence labels (cached, replayed, confirmed).\n\nPagination et virtualized lists need deterministic sorting to avoid row jumps between pages. If sort keys are unstable, users see items move unexpectedly as new events arrive. Use primary et secondary stable keys, et preserve cursor semantics during live updates.\n\nError banners should be scoped by subsystem. Parser errors are not network errors. Replay checksum mismatches are not portefeuille signature errors. Distinct error classes reduce panic et help users choose next actions. A generic red toast that says \\\"something went wrong\\\" is operationally expensive.\n\nSkeleton states must communicate structure rather than fake certainty. Show placeholder rows et chart bounds, but avoid hardcoding values that look real. If users screen-record issues, misleading skeletons complicate incident investigation.\n\nRate limits are common in real dashboards, even avec private APIs. Your UI should surface backoff state et avoid firehose re-requests from multiple components. Centralize data fetching et de-duplicate in-flight requests by key. This prevents self-inflicted throttling.\n\nLive mode et replay mode should share the same reducer et query pipeline. Live mode streams events progressively; replay mode applies fixture timelines deterministically. If these modes use different code paths, bugs hide in mode-specific branches et become hard to reproduce.\n\nA pratique approach is to store event journal et snapshots, then render all UI from derived selectors. This architecture supports recoverability: you can reset to snapshot N, replay events, et inspect differences. It also supports support tooling: attach snapshot checksum et model version to error reports.\n\n### Devnet Bonus (optional)\n\nYou can add an RPC adapter behind a feature flag et map live compte updates into the same event format. Keep this optional et never required pour core correctness.\n\n## Pitfall: shipping polished visuals avec unscoped failure states\n\nIf users cannot tell whether an issue is stale cache, parse failure, or upstream throttle, confidence erodes even when core model logic is correct.\n\n## Production Checklist\n\n1. Expose freshness metadata pour cached et live data.\n2. Keep list sorting deterministic across pagination.\n3. Classify errors by subsystem avec actionable copy.\n4. De-duplicate in-flight fetches et respect rate limits.\n5. Render live et replay modes through shared reducer/selectors.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "frontend-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "frontend-v2-l7-q1",
                    "prompt": "Why should live mode et replay mode share the same reducer pipeline?",
                    "options": [
                      "To keep behavior reproducible et avoid mode-specific correctness drift",
                      "To reduce CSS size only",
                      "Because rate limits require it"
                    ],
                    "answerIndex": 0,
                    "explanation": "Shared deterministic logic makes incident replay et tests reliable."
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
                    "explanation": "Phase- et subsystem-specific failures require different user guidance."
                  }
                ]
              }
            ]
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            "title": "Emit stable DashboardSummary from fixtures",
            "content": "# Emit stable DashboardSummary from fixtures\n\nCompose deterministic checkpoint output:\n- owner, token count, totalValueUsd\n- top tokens sorted deterministically\n- recent activity rows\n- invariants et determinism metadata (fixture hash + model version)\n",
            "duration": "45 min",
            "hints": [
              "Emit JSON keys in a fixed order pour stable snapshots.",
              "Sort top tokens deterministically avec tie breakers.",
              "Include modelVersion et fixtureHash in determinism metadata."
            ]
          }
        }
      }
    }
  },
  "defi-solana": {
    "title": "DeFi on Solana",
    "description": "Avance project-journey cours pour engineers building swap systems: deterministic offline Jupiter-style planning, route ranking, minOut safety, et reproducible diagnostics.",
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
        "description": "Understand CPMM math, quote anatomy, et deterministic routing tradeoffs avec safety-first user protections.",
        "lessons": {
          "defi-v2-amm-basics-fees-slippage-impact": {
            "title": "AMM bases on Solana: pools, fees, slippage, et impact sur le prix",
            "content": "# AMM bases on Solana: pools, fees, slippage, et impact sur le prix\n\nWhen users click “Swap,” they usually assume there is one objective truth: the current price. In practice, frontend swap systems compute an estimate from pool reserves et route assumptions. The estimate can be excellent, but it is still a model. DeFi UI quality depends on how honestly et consistently that model is represented.\n\nIn a constant-product AMM, each pool maintains an invariant close to x * y = k. A swap changes reserves asymmetrically, et the output amount is non-linear relative to input size. Small trades can track spot estimates closely, while larger trades move further along the curve et experience more impact. That non-linearity is why frontend code must never compare routes using only “price per token” labels. You need route-aware output calculations at the target trade size.\n\nOn Solana, swaps also occur across varied pool designs et fee tiers. Some pools are deep et low fee; others are shallow but still attractive pour small size due to path composition. Fee bps are often compared in isolation, but total execution quality comes from three interacting pieces: fee deduction, reserve depth, et route hop count. A route avec slightly higher fee can still produce higher net output if reserves are materially deeper.\n\nSlippage et impact sur le prix are often conflated in UI copy, but they answer different questions. Impact sur le prix asks: what movement does this trade itself induce against current reserves? Slippage tolerance asks: what worst-case output should still be accepted at execution time? One is descriptive of current route mechanics, the other is a user safety bound. Production interfaces should surface both values clearly et compute minOut deterministically from outAmount et slippage bps.\n\nDeterministic arithmetic matters as much as financial logic. If planners use floating-point shortcuts, two environments can produce subtly different minOut values et route ranking. Those tiny differences create major operational pain in tests, incident response, et support reproductions. Integer arithmetic over u64-style amount strings should remain the primary model path; formatting pour users should happen only at presentation boundaries.\n\nEven in an offline educational planner, safety invariants belong at the core. Outputs must never exceed reserveOut. Reserves must remain non-negative after virtual simulation. Missing pools should fail fast avec typed errors, not fallback behavior. These checks mirror production expectations et train the same engineering discipline needed pour real integrations.\n\nA robust frontend modele mental is therefore: token universe + pool universe + deterministic quote math + route ranking policy + user safety constraints. If any layer is implicit, the system will still run, but behavior under volatility becomes hard to explain. If all layers are explicit et typed, the same planner can power UI previews, tests, et diagnostics avec minimal drift.\n\n## Quick numeric intuition\n\nIf two routes have spot prices that look similar, a larger input can still produce materially different output because you travel further on each curve. That is why route comparison must happen at the exact user amount, not a tiny reference trade.\n\n## What you should internalize from this lecon\n\n- Execution quality is output-at-size, not headline spot price.\n- Slippage tolerance is a user protection bound, not a market forecast.\n- Deterministic integer math is a product feature, not only a technical preference.\n\n### Pitfalls\n\n1. Comparing routes by headline “price” instead of exact outAmount at the user’s size.\n2. Treating slippage tolerance as if it were the same metric as impact sur le prix.\n3. Using floating point in route ranking or minOut logic.\n\n### Production Checklist\n\n1. Keep amount math in integer-safe paths.\n2. Surface outAmount, fee impact, et minOut separately.\n3. Enforce invariant checks pour each hop simulation.\n4. Keep route ranking deterministic avec explicit tie-breakers.\n5. Log enough context to reproduce route decisions.\n",
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
                    "explanation": "minOut is computed from quote outAmount et slippage bps."
                  }
                ]
              }
            ]
          },
          "defi-v2-quote-anatomy-and-risk": {
            "title": "Quote anatomy: in/out, fees, minOut, et worst-case execution",
            "content": "# Quote anatomy: in/out, fees, minOut, et worst-case execution\n\nA production quote is not one number. It is a structured object that must tell users what they send, what they likely receive, how much they pay in fees, et what minimum output protection applies. When frontend systems treat quote payloads as loose JSON blobs, users lose trust quickly because route changes et execution deviations look arbitrary.\n\nThe first mandatory fields are inAmount et outAmount in raw integer units. Without raw values, deterministic checks become fragile. UI formatting should be derived from token decimals, but core state should retain raw strings pour exact comparisons et invariant logic. If an app compares rounded display numbers, route ties can break unpredictably.\n\nSecond, quote systems should expose fee breakdown per hop. Aggregate fee bps is useful, but it hides which pools drive cost. Pour route explainability et debugging, users et engineers need pool-level fee contributions. This is particularly important pour two-hop routes where one leg may be cheap et the other expensive.\n\nThird, minOut must be explicit, reproducible, et tied to user-configured slippage bps. The computation is deterministic: floor(outAmount * (10000 - slippageBps) / 10000). Showing this value is not optional pour serious UX. It is the user’s principal safety guard against stale quotes et rapid market movement between quote et submission.\n\nFourth, quote freshness et worst-case framing should be visible. Even in offline training systems, the planner should model the idea that the route is valid pour a moment, not forever. In production, stale quote handling et forced re-quote boundaries prevent accidental execution avec outdated assumptions.\n\nA useful engineering pattern is to model quote objects as immutable snapshots. Each snapshot includes selected route, per-hop details, total fees, impact estimate, et minOut. If selection changes, produce a new snapshot instead of mutating fields in place. This gives deterministic audit trails et cleaner state transitions.\n\nPour this cours, lecon logic remains offline et deterministic, but the same conception prepares teams pour real Jupiter integrations later. By the time network adapters are introduced, your model et tests already guarantee stable route math et explainability.\n\nQuote anatomy also influences support burden. When a user asks why they received less than expected, the answer is much faster if the system preserves route path, slippage setting, et minOut from the exact planning state. Without that, teams rely on post-hoc guesses.\n\n### Pitfalls\n\n1. Displaying outAmount without minOut et route-level fees.\n2. Mutating selected quote objects in place instead of creating snapshots.\n3. Computing fee percentages from rounded UI values instead of raw amounts.\n\n### Production Checklist\n\n1. Keep quote payloads immutable et versioned.\n2. Store per-hop fee contributions et total fee amount.\n3. Compute et show minOut from explicit slippage bps.\n4. Preserve raw amounts et decimals separately.\n5. Expose route freshness metadata in UI state.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "defi-v2-l2-explorer",
                "title": "Quote Compte Snapshot",
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
                      "Pour explainability et debugging route-level cost",
                      "Only pour CSS rendering",
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
            "content": "# Routing: why two-hop can beat one-hop\n\nUsers often assume direct pair routes are always best because they are simpler. In fragmented liquidity systems, that assumption fails frequently. A direct SOL -> JUP pool might have shallow depth, while SOL -> USDC et USDC -> JUP pools together can produce better net output despite two fees et two curve traversals. A production router should evaluate both one-hop et two-hop candidates et rank them deterministically.\n\nThe engineering challenge is not just finding paths. It is comparing paths under consistent assumptions. Every candidate should be quoted avec the same input amount, same deterministic arithmetic, et same fee/impact accounting. If one path uses rounded display math while another uses raw amounts, route ranking loses meaning.\n\nTwo-hop routing also requires stable tie-break policies. Suppose two candidates produce equal outAmount at integer precision. One has one hop; the other has two hops. A deterministic system should prefer fewer hops. If hop count also ties, lexicographic route ID ordering can resolve final rank. The exact policy can vary, but it must be explicit et stable.\n\nLiquidity fragmentation introduces another subtle point: intermediaire mint risk. A two-hop path through a highly liquid stable pair can be excellent, but if the second pool is thin, the route can still degrade at larger sizes. This is why route scoring should be quote-size aware et not reused blindly across different trade amounts.\n\nPour offline cours logic, we model pools as a static universe et simulate reserves virtually per quote path. Even this simplified model teaches key production habits: avoid mutating source fixtures, isolate simulation state per candidate, et validate safety constraints at each hop.\n\nRouting quality is also a UX problem. If a selected route changes due to input edits or quote refresh, users should see why: outAmount delta, fee change, et path change. Silent route switching feels suspicious even when mathematically correct.\n\nIn larger systems, routers may consider split routes, gas/compute constraints, or venue reliability. This cours intentionally limits scope to one-hop et two-hop deterministic candidates so core reasoning remains clear et testable.\n\nFrom an implementation perspective, route objects should be treated as typed artifacts avec stable IDs et explicit hop metadata. That discipline reduces accidental coupling between UI state et planner internals. When engineers can serialize a route candidate, replay it avec the same input, et get the same result, incident response becomes straightforward.\n\n### Pitfalls\n\n1. Assuming direct pairs always outperform multi-hop routes.\n2. Reusing quotes computed pour one trade size at another size.\n3. Non-deterministic tie-breaking that causes route flicker.\n\n### Production Checklist\n\n1. Enumerate one-hop et two-hop routes systematically.\n2. Quote every candidate avec the same deterministic math path.\n3. Keep tie-break policy explicit et stable.\n4. Simulate virtual reserves without mutating source fixtures.\n5. Surface route-change reasons in UI.\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "defi-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "defi-v2-l3-q1",
                    "prompt": "What is the primary ranking objective in this cours router?",
                    "options": [
                      "Maximize outAmount",
                      "Minimize hop count always",
                      "Choose first enumerated route"
                    ],
                    "answerIndex": 0,
                    "explanation": "outAmount is primary; hops et route ID are tie-breakers."
                  },
                  {
                    "id": "defi-v2-l3-q2",
                    "prompt": "Why simulate virtual reserves per candidate route?",
                    "options": [
                      "To keep route quotes deterministic et independent",
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
        "description": "Build deterministic quoting, route selection, et minOut safety checks, then package stable checkpoint artifacts pour reproducible reviews.",
        "lessons": {
          "defi-v2-quote-cpmm": {
            "title": "Implement token/pool model + constant-product quote calc",
            "content": "# Implement token/pool model + constant-product quote calc\n\nImplement deterministic CPMM quoting:\n- out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee)\n- fee = floor(inAmount * feeBps / 10000)\n- impactBps from spot vs effective execution price\n- return outAmount, feeAmount, inAfterFee, impactBps\n",
            "duration": "35 min",
            "hints": [
              "Use inAfterFee = inAmount - floor(inAmount * feeBps / 10000).",
              "Use constant-product output formula avec integer floor division.",
              "Estimate impact by comparing spot price et effective execution price in fixed scale."
            ]
          },
          "defi-v2-router-best": {
            "title": "Implement route enumeration et best-route selection",
            "content": "# Implement route enumeration et best-route selection\n\nImplement deterministic route planner:\n- enumerate one-hop et two-hop candidates\n- quote each candidate at exact input size\n- select best route using stable tie-breakers\n",
            "duration": "35 min",
            "hints": [
              "Enumerate 1-hop direct pools first, then 2-hop through intermediaire tokens.",
              "Score bestOut by output, then tie-break by hops et route id.",
              "Keep sorting deterministic to avoid route flicker."
            ]
          },
          "defi-v2-safety-minout": {
            "title": "Implement slippage/minOut, fee breakdown, et safety invariants",
            "content": "# Implement slippage/minOut, fee breakdown, et safety invariants\n\nImplement deterministic safety layer:\n- apply slippage to compute minOut\n- simulate route avec virtual reserve updates\n- return structured errors pour invalid pools/routes\n- enforce non-negative reserve et bounded output invariants\n",
            "duration": "35 min",
            "hints": [
              "Use virtual pool copies so fixture reserves are not mutated.",
              "Compute minOut avec floor(out * (10000 - slippageBps) / 10000).",
              "Return structured errors when pools or route links are invalid."
            ]
          },
          "defi-v2-production-swap-ux": {
            "title": "Production swap UX: stale quotes, protection, et simulation",
            "content": "# Production swap UX: stale quotes, protection, et simulation\n\nA deterministic route engine is necessary but not sufficient pour production. Users experience DeFi through timing, messaging, et safety affordances. A mathematically correct planner can still feel broken if stale quote handling, retry behavior, et error communication are weak.\n\nStale quotes are the most common operational issue. In volatile markets, quote quality decays quickly. Interfaces should track quote age et invalidate plans beyond a strict threshold. When invalidation happens, route et minOut should be recomputed before submit. Reusing stale plans to “speed up” UX usually creates worse outcomes et support burden.\n\nUser protection should be layered. Slippage bounds protect against adverse movement, but they do not protect against malformed route payloads or mismatched compte assumptions. Safety validation should run before any portefeuille prompt et should return explicit, typed errors. “Something went wrong” is not enough in swap flows.\n\nSimulation messaging matters as much as simulation itself. If route simulation fails pre-send, users need actionable context: which hop failed, whether pool liquidity was insufficient, whether the route is missing required pools, et whether re-quoting could help. Generic error banners create user churn.\n\nRetry logic must be bounded et stateful. Blind retries avec unchanged input are often just repeated failures. Good UX distinguishes retryable states (temporary network issue) from deterministic planner errors (invalid route topology). Pour deterministic planner errors, force state change before retry.\n\nAnother production concern is observability. Record route ID, inAmount, outAmount, minOut, fee totals, et invariant results pour each attempt. These logs make incident triage et postmortems dramatically faster. Without structured traces, teams often blame “market conditions” pour planner bugs.\n\nPagination et list updates also affect trust. Swap history UIs should preserve deterministic ordering et avoid jitter when data refreshes. If past swaps reorder unpredictably, users perceive reliability issues even when transactions are correct.\n\nOptional live integrations should be feature-flagged et isolated. The offline deterministic engine should remain the source of truth, while live adapters map external responses into the same internal types. That boundary keeps tests stable et protects core behavior from third-party schema changes.\n\nFinally, production swap UX should make deterministic planner outcomes explainable to non-expert users. If a route is rejected, the interface should provide a concrete reason et a clear next action such as reducing size or selecting a different output token. Clear messaging converts system correctness into user trust.\n\n### Pitfalls\n\n1. Allowing stale quotes to remain actionable without forced re-quote.\n2. Retrying deterministic planner errors without changing route or inputs.\n3. Hiding failure reason details behind generic notifications.\n\n### Production Checklist\n\n1. Track quote freshness et invalidate aggressively.\n2. Enforce pre-submit invariant validation.\n3. Separate retryable network failures from deterministic planner failures.\n4. Log route et safety metadata pour every attempt.\n5. Keep offline engine as canonical model pour optional live adapters.\n",
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
                      "Re-quote et recompute route/minOut before submit",
                      "Submit avec stale plan",
                      "Increase slippage automatically without notifying user"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freshness boundaries should trigger deterministic recomputation."
                  },
                  {
                    "id": "defi-v2-l7-q2",
                    "prompt": "Which failures are not solved by blind retries?",
                    "options": [
                      "Deterministic planner et invariant failures",
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
            "content": "# Produce stable SwapPlan + SwapSummary checkpoint\n\nCompose deterministic checkpoint artifacts:\n- build swap plan from selected route quote\n- include fixtureHash et modelVersion\n- emit stable summary avec path, minOut, fee totals, impact, et invariants\n",
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
    "title": "Solana Securite & Auditing",
    "description": "Production-grade deterministic vuln lab pour Solana auditors who need repeatable exploit evidence, precise remediation guidance, et high-signal audit artifacts.",
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
        "description": "Compte-centric threat modeling, deterministic exploit reproduction, et evidence discipline pour credible audit findings.",
        "lessons": {
          "security-v2-threat-model": {
            "title": "Solana threat model pour auditors: comptes, owners, signers, writable, PDAs",
            "content": "# Solana threat model pour auditors: comptes, owners, signers, writable, PDAs\n\nSecurite work on Solana starts avec one non-negotiable fact: instruction callers choose the compte list. Programs do not receive trusted implicit context. They receive exactly the compte metas et instruction data encoded in a transaction message. This conception is powerful pour composability et performance, but it means almost every critical exploit is an compte validation exploit in disguise. If you internalize this early, your audits become more mechanical et less guess-based.\n\nA good modele mental is to treat each instruction as a contract boundary avec five mandatory validations: identity, authority, ownership, mutability, et derivation. Identity asks whether the supplied compte is the compte the instruction expects. Authority asks whether the actor that is allowed to mutate state actually signed. Ownership asks whether compte data should be interpreted under the current program or a different one. Mutability asks whether writable access is both requested et justified. Derivation asks whether PDA paths are deterministic et verified against canonical seeds plus bump. Missing any of those layers creates openings that attackers repeatedly use.\n\nSigner checks are not optional on privileged paths. If the instruction changes authority, moves funds, or updates risk parameters, the authority compte must be a signer et must be the expected authority from state. One common bug is checking only that “some signer exists.” That is still broken. Audits should explicitly map each privileged transition to a concrete signer relationship et verify that relation is enforced before state mutation.\n\nOwner checks are equally critical. Programs often parse compte bytes into local structs. Without owner checks, an attacker can pass arbitrary bytes that deserialize into a shape that looks valid but is controlled by another program or by no program assumptions at all. This is compte substitution. It is the root cause of many catastrophic incidents et should be surfaced early in review notes.\n\nPDA checks are where many teams lose determinism. Seed recipes need to be explicit, stable, et versioned. If the runtime accepts user-provided bump values without recomputation, or if seed ordering differs between handlers, spoofed addresses can pass inconsistent checks. Auditors should insist on exact re-derivation et equality checks in all sensitive paths.\n\nWritable flags matter pour two reasons: correctness et attack surface. Over-broad writable sets increase risk by allowing unnecessary state transitions in CPI-heavy flows. Under-declared mutability causes runtime failure, which is safer but still a reliability bug.\n\nFinally, threat modeling should include arithmetic constraints. Even if auth is correct, unchecked u64 math can corrupt balances through underflow or overflow et invalidate all higher-level assumptions.\n\n## Auditor workflow per instruction\n\nPour each handler, run the same sequence: identify privileged outcome, list required comptes, verify signer/owner/PDA relationships, verify writable scope, then test malformed compte lists. Repeating this fixed loop prevents “I think it looks safe” audits.\n\n## What you should be able to do after this lecon\n\n- Turn a vague concern into a concrete validation checklist.\n- Explain why compte substitution et PDA spoofing recur in Solana incidents.\n- Build deterministic negative-path scenarios before writing remediation notes.\n\n## Checklist\n- Map each instruction to a clear privilege model.\n- Verify authority compte is required signer pour privileged actions.\n- Verify authority key equality against stored state authority.\n- Verify every parsed compte has explicit owner validation.\n- Verify each PDA is re-derived from canonical seeds et bump.\n- Verify writable comptes are minimal et justified.\n- Verify arithmetic uses checked operations pour u64 transitions.\n- Verify negative-path tests exist pour unauthorized et malformed comptes.\n\n## Red flags\n- Privileged state updates without signer checks.\n- Parsing unchecked compte data from unknown owners.\n- PDA acceptance based on partial seed checks.\n- Handlers that trust client-provided bump blindly.\n- Arithmetic updates using plain + et - on balances.\n\n## How to verify (simulator)\n- Run vulnerable mode on signer-missing scenario et inspect trace.\n- Re-run fixed mode et confirm ERR_NOT_SIGNER.\n- Execute owner-missing scenario et compare vulnerable vs fixed outcomes.\n- Execute pda-spoof scenario et confirm fixed mode emits ERR_BAD_PDA.\n- Compare trace hashes to verify deterministic event ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l1-q1",
                    "prompt": "Why are compte owner checks mandatory before deserializing state?",
                    "options": [
                      "Because callers can pass arbitrary comptes et forged byte layouts",
                      "Because owner checks improve rendering speed",
                      "Because owner checks replace signer checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without owner checks, compte substitution allows attacker-controlled bytes to be parsed as trusted state."
                  },
                  {
                    "id": "security-v2-l1-q2",
                    "prompt": "What should be verified pour a privileged withdraw path?",
                    "options": [
                      "Expected authority key, signer requirement, owner check, et PDA derivation",
                      "Only that the vault compte is writable",
                      "Only that an amount field exists"
                    ],
                    "answerIndex": 0,
                    "explanation": "Privileged transitions need full identity et authority validation."
                  }
                ]
              }
            ]
          },
          "security-v2-evidence-chain": {
            "title": "Evidence chain: reproduce, trace, impact, fix, verify",
            "content": "# Evidence chain: reproduce, trace, impact, fix, verify\n\nStrong securite reports are built on evidence chains, not opinions. In the Solana context, that means moving from a claim such as “missing signer check exists” to a deterministic chain: reproduce exploit conditions, capture a stable execution trace, quantify impact, apply a patch, et verify that the same steps now fail avec expected error codes while invariants hold. This chain is what turns audit work into an engineering artifact.\n\nReproduction should be deterministic et minimal. Every scenario should declare initial comptes, authority/signer flags, vault ownership assumptions, et instruction inputs. If reproductions depend on external RPC timing or changing liquidity conditions, confidence drops et triage slows down. In this cours lab, scenarios are fixture-driven et offline so every replay produces the same state transitions.\n\nTrace capture is the core of audit evidence. Instead of recording only final balances, log each relevant event in stable order: InstructionStart, AccountRead, CheckPassed/CheckFailed, BalanceChange, InstructionEnd. These events let reviewers verify exactly which assumptions passed et where validation was skipped. They also help map exploitability to code-level checks. Pour example, if signer checks are absent in vulnerable mode, the trace should explicitly show that signer validation was skipped or never evaluated.\n\nImpact analysis should be quantitative. Pour signer et owner bugs, compute drained lamports or unauthorized state changes. Pour PDA bugs, show mismatch between expected derived address et accepted address. Pour arithmetic bugs, show underflow or overflow conditions et resulting corruption. Impact details inform severity et prioritization.\n\nPatch validation should not just say “fixed.” It should prove exploit steps now fail pour the right reason. If signer exploit now fails, error code should be ERR_NOT_SIGNER. If PDA spoof now fails, error code should be ERR_BAD_PDA. This specificity catches regressions where one bug is accidentally masked by unrelated behavior.\n\nVerification closes the chain avec invariant checks. Examples: vault balance remains a valid u64 string, authority remains unchanged, et no unauthorized lamport delta occurs in fixed mode. These invariants convert patch confidence into measurable guarantees.\n\nWhen teams do this consistently, reports become executable documentation. New engineers can replay scenarios et understand why controls exist. Incident response becomes faster because prior failure signatures et remediation patterns are already captured.\n\n## Checklist\n- Define each scenario avec explicit initial state et instruction inputs.\n- Capture deterministic, ordered trace events pour each run.\n- Hash traces avec canonical JSON pour reproducibility.\n- Quantify impact using before/after deltas.\n- Map each finding to explicit evidence references.\n- Re-run identical scenarios in fixed mode.\n- Verify fixed-mode failures use expected error codes.\n- Record post-fix invariant results avec stable IDs.\n\n## Red flags\n- Reports avec no reproduction steps.\n- Non-deterministic traces that change between runs.\n- Impact described qualitatively without deltas.\n- Patch claims without fixed-mode replay evidence.\n- Invariant lists omitted from verification section.\n\n## How to verify (simulator)\n- Run signer-missing in vulnerable mode, save trace hash.\n- Run same scenario in fixed mode, confirm ERR_NOT_SIGNER.\n- Run owner-missing et confirm ERR_BAD_OWNER in fixed mode.\n- Run pda-spoof et compare expected/accepted PDA fields.\n- Generate audit report JSON et markdown summary from checkpoint builder.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "security-v2-l2-account-explorer",
                "title": "Trace Compte Snapshot",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Vault compte (vulnerable run)",
                      "address": "PDA_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                      "lamports": 300,
                      "owner": "VaultProgram111111111111111111111111111111111",
                      "executable": false,
                      "dataLen": 96
                    },
                    {
                      "label": "Recipient compte (post exploit)",
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
                      "To prove deterministic replay et evidence integrity",
                      "To replace structured test assertions",
                      "To randomize scenario ordering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Canonical trace hashes make replay evidence comparable et tamper-evident."
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
                    "explanation": "This order ensures claims are demonstrated et patch effectiveness is validated."
                  }
                ]
              }
            ]
          },
          "security-v2-bug-classes": {
            "title": "Common Solana bug classes et mitigations",
            "content": "# Common Solana bug classes et mitigations\n\nAuditors on Solana repeatedly encounter the same core bug families. The implementation details differ across protocols, but exploit mechanics are surprisingly consistent: identity confusion, authority confusion, derivation drift, arithmetic corruption, et unsafe cross-program assumptions. A robust review process categorizes findings by class, applies known verification patterns, et tests negative paths intentionally.\n\n**Missing signer checks** are high-severity because they directly break authorization. The fix is conceptually simple: require signer et key relation. Yet teams miss it when refactoring compte structs or switching between typed et unchecked compte wrappers. Auditors should scan all state-mutating handlers et ask: who can call this et what proves authorization?\n\n**Missing owner checks** create compte substitution risk. Programs may deserialize compte bytes et trust semantic fields without proving the compte is owned by the expected program. In mixed CPI systems, this is especially dangerous because compte shapes can look valid while semantics differ. Mitigation is explicit owner validation before parsing et strict compte type usage.\n\n**PDA seed/bump mismatch** appears when seed ordering, domain tags, or bump handling drifts between instructions. One handler derives [\"vault\", authority], another derives [authority, \"vault\"], a third trusts client-provided bump. Attackers search those inconsistencies to route privileged logic through spoofed addresses. Mitigation is canonical seed schema, exact re-derivation on every sensitive path, et tests that intentionally pass malformed PDA candidates.\n\n**CPI authority confusion** happens when one program delegates authority assumptions to another without strict scope. If signer seeds or delegated permissions are broader than intended, downstream calls can perform unintended state transitions. Mitigation includes explicit CPI allowlists, minimal writable/signer metas, et scope-limited delegated authorities.\n\n**Integer overflow/underflow** remains a pratique class in accounting-heavy systems. Rust release mode behavior makes unchecked arithmetic unacceptable pour balances et fee logic. Mitigation is checked operations, u128 intermediates pour multiply/divide paths, et boundary-focused tests.\n\nMitigation quality depends on verification quality. Unit tests should include adversarial compte substitutions, malformed seeds, missing signers, et boundary arithmetic. If tests only cover happy paths, high-severity bugs will survive code review.\n\nThe audit deliverable should translate classes into implementation guidance. Engineers need clear, actionable remediations et concrete reproduction conditions, not generic warnings. The best reports include checklists that can be wired into CI et release gates.\n\n## Checklist\n- Enumerate all privileged instructions et expected signers.\n- Verify owner checks before parsing external compte layouts.\n- Pin et document PDA seed schemas et bump usage.\n- Validate CPI target program IDs against allowlist.\n- Minimize writable et signer compte metas in CPI.\n- Enforce checked math pour all u64 state transitions.\n- Add negative tests pour each bug class.\n- Require deterministic traces pour securite-critical tests.\n\n## Red flags\n- Any privileged mutation path without explicit signer requirement.\n- Any unchecked compte deserialization path.\n- Any instruction that accepts bump without re-derivation.\n- Any CPI call to dynamic or user-selected program ID.\n- Any unchecked arithmetic on balances or supply values.\n\n## How to verify (simulator)\n- Use lecon 4 scenario to confirm unauthorized withdraw in vulnerable mode.\n- Use lecon 5 scenario to confirm spoofed PDA acceptance in vulnerable mode.\n- Use lecon 6 patch suite to verify fixed-mode errors by code.\n- Run checkpoint report et ensure all scenarios are marked reproduced.\n- Inspect invariant result array pour all fixed-mode scenarios.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l3-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l3-q1",
                    "prompt": "What is the strongest mitigation pour PDA spoof risks?",
                    "options": [
                      "Canonical seed schema avec exact re-derivation + bump verification",
                      "Accepting any PDA-like prefix",
                      "Trusting client-provided bump values"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic re-derivation closes spoofable PDA substitution paths."
                  },
                  {
                    "id": "security-v2-l3-q2",
                    "prompt": "Why are negative-path tests required pour audit confidence?",
                    "options": [
                      "Because most exploitable bugs only appear under malformed or adversarial input",
                      "Because happy-path tests cover all securite cases",
                      "Because traces are optional without them"
                    ],
                    "answerIndex": 0,
                    "explanation": "Securite failures are usually adversarial edge cases, so tests must target those edges directly."
                  }
                ]
              }
            ]
          }
        }
      },
      "security-v2-vuln-lab": {
        "title": "Vuln Lab Project Journey",
        "description": "Exploit, patch, verify, et produce audit-ready artifacts avec deterministic traces et invariant-backed conclusions.",
        "lessons": {
          "security-v2-exploit-signer-owner": {
            "title": "Break it: exploit missing signer + owner checks",
            "content": "# Break it: exploit missing signer + owner checks\n\nImplement a deterministic exploit-proof formatter pour signer/owner vulnerabilities.\n\nExpected output fields:\n- scenario\n- before/after vault balance\n- before/after recipient lamports\n- trace hash\n- explanation avec drained lamports\n\nUse canonical key ordering so tests can assert exact JSON output.",
            "duration": "40 min",
            "hints": [
              "Compute drained lamports from recipient before/after.",
              "Include deterministic field ordering in the JSON output.",
              "The explanation should mention missing signer/owner validation."
            ]
          },
          "security-v2-exploit-pda-spoof": {
            "title": "Break it: exploit PDA spoof mismatch",
            "content": "# Break it: exploit PDA spoof mismatch\n\nImplement a deterministic PDA spoof proof output.\n\nYou must show:\n- expected PDA\n- accepted PDA\n- mismatch boolean\n- trace hash\n\nThis lecon validates evidence generation pour derivation mismatches.",
            "duration": "40 min",
            "hints": [
              "Return whether expectedPda et acceptedPda differ.",
              "Use strict boolean output pour mismatch.",
              "Keep output key order stable."
            ]
          },
          "security-v2-patch-validate": {
            "title": "Fix it: validations + invariant suite",
            "content": "# Fix it: validations + invariant suite\n\nImplement patch validation output that confirms:\n- signer check\n- owner check\n- PDA check\n- safe u64 arithmetic\n- exploit blocked state avec error code\n\nKeep output deterministic pour exact assertion.",
            "duration": "45 min",
            "hints": [
              "All four controls must be true pour a complete patch.",
              "Use fixedBlockedExploit to set blocked status.",
              "Return error code only when blocked is true."
            ]
          },
          "security-v2-writing-reports": {
            "title": "Writing audit reports: severity, likelihood, blast radius, remediation",
            "content": "# Writing audit reports: severity, likelihood, blast radius, remediation\n\nA strong audit report is an engineering document, not a narrative essay. It should allow a reader to answer four questions quickly: what failed, how exploitable it is, how much damage it can cause, et what exact change prevents recurrence. Securite writing quality directly affects fix quality because implementation teams ship what they can interpret.\n\nSeverity should be tied to impact et exploit preconditions. A missing signer check in a withdraw path is typically critical if it allows unauthorized asset movement avec low prerequisites. A PDA mismatch may be high or medium depending on reachable code paths et available controls. Severity labels without rationale are not useful. Include explicit exploit path assumptions et whether attacker capital or privileged positioning is required.\n\nLikelihood should capture pratique exploitability, not theoretical possibility. Pour example, if a bug requires impossible compte states under current architecture, likelihood may be low even if impact is high. Conversely, if a bug is reachable by submitting a standard instruction avec crafted compte metas, likelihood is high. Be specific.\n\nBlast radius should describe what can be drained or corrupted: one vault, one market, protocol-wide state, or gouvernance authority. This framing helps teams stage incident response et patch rollout.\n\nRecommendations must be precise et testable. “Add better validation” is too vague. “Require authority signer, verify authority key matches vault state, verify vault owner equals program id, et verify PDA from [\"vault\", authority] + bump” is actionable. Include expected error codes so QA can validate behavior reliably.\n\nEvidence references are also important. Each finding should point to deterministic traces, scenario IDs, et checkpoint artifacts so another engineer can replay without interpretation gaps.\n\nFinally, include verification results. A patch is not complete until exploit scenarios fail deterministically et invariants hold. Reports that end before verification force downstream teams to rediscover completion criteria.\n\nReport structure should also prioritize scanability. Teams reviewing multiple findings under incident pressure need consistent field ordering et concise language that maps directly to engineering actions. If one finding uses narrative prose while another uses structured reproduction steps, remediation speed drops because readers spend time normalizing format instead of executing fixes.\n\nA reliable pattern is one finding per vulnerability class avec explicit evidence references grouped by scenario ID. That allows QA, auditors, et protocol engineers to coordinate on the same deterministic artifacts. The same approach also improves long-term maintenance: when code changes, teams can rerun scenario IDs et compare trace hashes to detect regressions in report assumptions.\n\n## Checklist\n- State explicit vulnerability class et affected instruction path.\n- Include reproducible scenario ID et deterministic trace hash.\n- Quantify impact avec concrete state/balance deltas.\n- Assign severity avec rationale tied to exploit preconditions.\n- Assign likelihood based on realistic attacker capabilities.\n- Describe blast radius at compte/protocol boundary.\n- Provide exact remediation steps et expected error codes.\n- Include verification outcomes et invariant results.\n\n## Red flags\n- Severity labels without impact rationale.\n- Recommendations without concrete validation rules.\n- No reproduction steps or trace references.\n- No fixed-mode verification evidence.\n- No distinction between impact et likelihood.\n\n## How to verify (simulator)\n- Generate report JSON from checkpoint builder.\n- Confirm findings include evidenceRefs pour each scenario.\n- Confirm remediation includes patch IDs.\n- Confirm verification results mark each scenario as blocked in fixed mode.\n- Generate markdown summary et compare to report content ordering.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "security-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "security-v2-l7-q1",
                    "prompt": "What is the key difference between severity et likelihood?",
                    "options": [
                      "Severity measures impact; likelihood measures pratique exploitability",
                      "They are interchangeable labels",
                      "Likelihood is only pour low-severity bugs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Good reports separate damage potential from exploit feasibility."
                  },
                  {
                    "id": "security-v2-l7-q2",
                    "prompt": "Which recommendation is most actionable?",
                    "options": [
                      "Require signer + owner + PDA checks avec explicit error codes",
                      "Improve securite in this function",
                      "Add more comments"
                    ],
                    "answerIndex": 0,
                    "explanation": "Actionable recommendations map directly to code changes et tests."
                  }
                ]
              }
            ]
          },
          "security-v2-audit-report-checkpoint": {
            "title": "Checkpoint: deterministic AuditReport JSON + markdown",
            "content": "# Checkpoint: deterministic AuditReport JSON + markdown\n\nCreate the final deterministic checkpoint payload:\n- cours + version\n- scenario IDs\n- finding count\n\nThis checkpoint mirrors the final cours artifact produced by the simulator report builder.",
            "duration": "45 min",
            "hints": [
              "Return stable, minimal checkpoint metadata.",
              "cours must be solana-securite et version must be v2.",
              "Preserve scenarioIds order as provided."
            ]
          }
        }
      }
    }
  },
  "token-engineering": {
    "title": "Token Engineering on Solana",
    "description": "Project-journey cours pour teams launching real Solana tokens: deterministic Token-2022 planning, authority conception, supply simulation, et operational launch discipline.",
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
        "description": "Understand token primitives, mint policy anatomy, et Token-2022 extension controls avec explicit gouvernance et threat-model framing.",
        "lessons": {
          "token-v2-spl-vs-token-2022": {
            "title": "SPL tokens vs Token-2022: what extensions change",
            "content": "# SPL tokens vs Token-2022: what extensions change\n\nToken engineering starts avec a clean boundary between base token semantics et configurable policy. Legacy SPL Token gives you a stable fungible primitive: mint metadata, token comptes, mint authority, freeze authority, et transfer/mint/burn instructions. Token-2022 preserves that core interface but adds extension slots that let teams activate richer behavior without rewriting token logic from scratch. That compatibility is useful, but it also creates a new class of gouvernance et safety decisions that frontend et protocol engineers need to model explicitly.\n\nThe key modele mental: Token-2022 is not a separate economic system; it is an extended compte layout et instruction surface. Extensions are opt-in, et each extension adds bytes, authorities, et state transitions that must be considered during mint initialization et lifecycle management. If you treat extensions as cosmetic add-ons, you can ship a token that is technically valid but operationally fragile.\n\nPour production teams, the first decision is policy minimalism. Every enabled extension increases complexity in portefeuilles, indexers, et downstream integrations. Transfer fees may fit treasury goals but can break assumptions in partner protocols. Default compte state can enforce safety posture but may confuse users if compte thaw flow is unclear. Permanent delegate can simplify managed flows but dramatically expands power if authority boundaries are weak. The right approach is to map each extension to a concrete requirement et document the explicit threat model it introduces.\n\nToken-2022 also changes launch sequencing. You must pre-size mint comptes pour chosen extensions, initialize extension data in deterministic order, et verify authority alignment before live distribution. This is where deterministic offline planning is valuable: you can generate a launch pack, inspect instruction-like payloads, et validate invariants before touching network systems. That practice catches configuration drift early et gives reviewers a reproducible artifact.\n\nFinally, extension-aware conception is an integration problem, not just a contract problem. Product et support teams need clear messaging pour fee behavior, frozen compte states, et delegated capabilities. If users cannot predict token behavior from portefeuille prompts et docs, operational risk rises even when code is formally correct.\n\n## Decision framework pour extension selection\n\nPour each extension, force three answers before enabling it:\n1. What concrete product requirement does this solve now?\n2. Which authority can abuse this if compromised?\n3. How will users et integrators observe this behavior in UX et docs?\n\nIf any answer is vague, extension scope is probably too broad.\n\n## Pitfall: Extension creep without threat modeling\n\nAdding multiple extensions \"pour flexibility\" often creates overlapping authority powers et unpredictable UX. Enable only the extensions your product can govern, monitor, et explain end-to-end.\n\n## Sanity Checklist\n\n1. Define one explicit business reason per extension.\n2. Document extension authorities et revocation strategy.\n3. Verify partner compatibility assumptions before launch.\n4. Produce deterministic initialization artifacts pour review.\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "token-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "token-v2-l1-q1",
                    "prompt": "What is the safest default posture pour Token-2022 extension selection?",
                    "options": [
                      "Enable only extensions avec clear product et risk justification",
                      "Enable all extensions pour future flexibility",
                      "Disable authorities entirely"
                    ],
                    "answerIndex": 0,
                    "explanation": "Every extension adds gouvernance et integration complexity, so scope should stay intentional."
                  },
                  {
                    "id": "token-v2-l1-q2",
                    "prompt": "Why generate an offline deterministic launch pack before devnet/mainnet actions?",
                    "options": [
                      "To review instruction intent et invariants before execution",
                      "To avoid configuring decimals",
                      "To bypass authority checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Deterministic planning provides reproducible review artifacts et catches config drift early."
                  }
                ]
              }
            ]
          },
          "token-v2-mint-anatomy": {
            "title": "Mint anatomy: authorities, decimals, supply, freeze, mint",
            "content": "# Mint anatomy: authorities, decimals, supply, freeze, mint\n\nA production token launch succeeds or fails on parameter discipline. The mint compte is a compact policy object: it defines decimal precision, minting authority, optional freeze authority, et extension configuration. Token comptes then represent balances pour owners, usually through ATAs. If these pieces are configured inconsistently, downstream systems see contradictory behavior et user trust erodes quickly.\n\nDecimals are one of the most underestimated parameters. They influence UI formatting, fee interpretation, et business logic in integrations. While high precision can feel \"future-proof,\" excessive decimals often create rounding edge cases in analytics et partner systems. Constraining decimals to a documented operational range et validating it at config time is a pratique defensive rule.\n\nAuthority layout should be explicit et minimal. Mint authority controls supply growth. Freeze authority controls compte-level transfer ability. Update authority (pour metadata-linked policy) can affect user-facing trust et protocol assumptions. Teams often reuse one operational key pour convenience, then struggle to separate powers later. A better pattern is to predefine authority roles et revocation milestones as part of launch gouvernance.\n\nSupply planning should distinguish issuance from distribution. Initial supply tells you what is minted; recipient allocations tell you what is distributed at launch. Those values should be validated avec exact integer math, not float formatting. Invariant checks such as `recipientsTotal <= initialSupply` are simple but prevent serious release mistakes.\n\nToken-2022 extensions deepen this anatomy. Transfer fee config introduces fee basis points et caps; default compte state changes compte activation posture; permanent delegate creates a privileged transfer actor. Each extension implies additional authority et monitoring requirements. Your launch plan must encode these requirements as explicit steps et include human-readable labels so reviewers can confirm intent.\n\nFinally, deterministic address derivation in cours tooling is a useful engineering discipline. Even when pseudo-addresses are used pour offline planning, stable derivation functions improve reproducibility et reduce reviewer ambiguity. The same mindset carries to real deployments where deterministic compte derivation is foundational.\n\nStrong teams also pair mint-anatomy reviews avec explicit incident playbooks: what to do if an authority key is lost, rotated, or compromised, et how to communicate those events to integrators without causing panic.\n\n## Pitfall: One-key authority convenience\n\nUsing a single key pour minting, freezing, et metadata updates simplifies setup but concentrates risk. Authority compromise then becomes a full-token compromise rather than a contained incident.\n\n## Sanity Checklist\n\n1. Validate decimals et supply fields before plan generation.\n2. Record mint/freeze/update authority roles et custody model.\n3. Confirm recipient allocation totals avec integer math.\n4. Review extension authorities independently from mint authority.\n",
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
                      "Because token comptes store floats"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply et distribution correctness depends on exact arithmetic over integer base units."
                  },
                  {
                    "id": "token-v2-l2-q2",
                    "prompt": "What is the primary role of freeze authority?",
                    "options": [
                      "Controlling whether specific token comptes can transfer",
                      "Changing token symbol",
                      "Computing transfer fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "Freeze authority governs transfer state at compte level, not branding or fee math."
                  }
                ]
              }
            ]
          },
          "token-v2-extension-safety-pitfalls": {
            "title": "Extension safety pitfalls: fee configs, delegate abuse, default compte state",
            "content": "# Extension safety pitfalls: fee configs, delegate abuse, default compte state\n\nToken-2022 extensions let teams express policy in a standard token framework, but policy power is exactly where operational failures happen. Securite issues in token launches are rarely exotic cryptography failures. They are usually configuration mistakes: fee caps set too high, delegates granted too broadly, or frozen default states introduced without recovery controls. Production engineering must treat extension configuration as safety-critical logic.\n\nTransfer fee configuration is a good example. A basis-point fee looks simple, yet behavior depends on cap interaction et token decimals. If maxFee is undersized, large transfers saturate quickly et effective fee curve becomes nonlinear. If maxFee is oversized, treasury extraction can exceed expected user tolerance. Deterministic simulations across example transfer sizes are essential before launch, et those simulations should be reviewed by both protocol et product teams.\n\nPermanent delegate is another high-risk feature. It can enable managed flows, but it also creates a privileged actor that may transfer tokens without normal owner signatures depending on policy scope. If delegate authority is not governed by clear controls et revocation procedures, compromise risk rises sharply. In many incidents, teams enabled delegate-like authority pour convenience, then discovered too late that gouvernance et monitoring were insufficient.\n\nDefault compte state introduces user-experience et compliance implications. A frozen default state can enforce controlled activation, but it also creates onboarding failure if thaw paths are unclear or unavailable in partner portefeuilles. Teams should verify thaw strategy, authority custody, et fallback procedures before enabling frozen defaults in production.\n\nThe safest engineering workflow is deterministic et reviewable: validate config, normalize extension fields, generate initialization plan labels, simulate transfer outcomes, et produce invariant lists. That sequence creates a shared artifact pour engineering, securite, legal, et support stakeholders. When questions arise, teams can inspect exact intended policy rather than infer from fragmented scripts.\n\nFinally, treat extension combinations as compounded risk. Each extension may be individually reasonable, yet combined authority interactions can create hidden escalation paths. Cross-extension threat modeling is therefore mandatory pour serious launches.\n\n## Pitfall: Fee et delegate settings shipped without scenario simulation\n\nTeams often validate only \"happy path\" transfer examples. Without boundary simulations et authority abuse scenarios, dangerous configurations can pass review et surface only after users are affected.\n\n## Sanity Checklist\n\n1. Simulate fee behavior at low/medium/high transfer sizes.\n2. Document delegate authority scope et emergency revocation path.\n3. Verify frozen default comptes have explicit thaw operations.\n4. Review combined extension authority interactions pour escalation risk.\n",
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
                    "explanation": "Fee cap interacts avec basis points et can distort economic behavior if misconfigured."
                  },
                  {
                    "id": "token-v2-l3-q2",
                    "prompt": "What is a core risk of permanent delegate configuration?",
                    "options": [
                      "Privilege concentration if authority gouvernance is weak",
                      "Loss of decimal precision",
                      "Automatic portefeuille incompatibility"
                    ],
                    "answerIndex": 0,
                    "explanation": "Delegate privileges must be constrained et governed like high-sensitivity access."
                  }
                ]
              }
            ]
          },
          "token-v2-validate-config-derive": {
            "title": "Validate token config + derive deterministic addresses offline",
            "content": "# Validate token config + derive deterministic addresses offline\n\nImplement strict config validation et deterministic pseudo-derivation:\n- validate decimals, u64 strings, recipient totals, extension fields\n- derive stable pseudo mint et ATA addresses from hash seeds\n- return normalized validated config + derivations\n",
            "duration": "35 min",
            "hints": [
              "Validate decimal bounds, u64-like numeric strings, et recipient totals before derivation.",
              "Use one deterministic seed format pour mint et one pour ATA derivation.",
              "Keep output key order stable so checkpoint tests are reproducible."
            ]
          }
        }
      },
      "token-v2-module-launch-pack": {
        "title": "Token Launch Pack Project",
        "description": "Build deterministic validation, planning, et simulation workflows that produce reviewable launch artifacts et clear go/no-go criteria.",
        "lessons": {
          "token-v2-build-init-plan": {
            "title": "Build Token-2022 initialization instruction plan",
            "content": "# Build Token-2022 initialization instruction plan\n\nCreate a deterministic offline initialization plan:\n- create mint compte step\n- init mint step avec decimals\n- append selected extension steps in stable order\n- base64 encode step payloads avec explicit encoding version\n",
            "duration": "35 min",
            "hints": [
              "Add base steps first: create mint compte, then initialize mint avec decimals.",
              "Append extension steps in deterministic order so plan labels are stable.",
              "Encode each step payload avec version + sorted params before base64 conversion."
            ]
          },
          "token-v2-simulate-fees-supply": {
            "title": "Build mint-to + transfer-fee math + simulation",
            "content": "# Build mint-to + transfer-fee math + simulation\n\nImplement pure simulation pour transfer fees et launch distribution:\n- fee = min(maxFee, floor(amount * feeBps / 10000))\n- aggregate distribution totals deterministically\n- ensure no negative supply et no oversubscription\n",
            "duration": "35 min",
            "hints": [
              "Transfer fee formula: fee = min(maxFee, floor(amount * feeBps / 10000)).",
              "Aggregate distributed et fee totals using BigInt to keep math exact.",
              "Fail when distributed amount exceeds initial supply."
            ]
          },
          "token-v2-launch-checklist": {
            "title": "Launch checklist: params, upgrade/authority strategy, airdrop/tests plan",
            "content": "# Launch checklist: params, upgrade/authority strategy, airdrop/tests plan\n\nA successful token launch is an operations exercise as much as a programming task. By the time users see your token in portefeuilles, dozens of choices have already constrained safety, gouvernance, et UX. Production token engineering therefore needs a launch checklist that turns abstract conception intent into verifiable execution steps.\n\nStart avec parameter closure. Name, symbol, decimals, initial supply, authority addresses, extension configuration, et recipient allocations must be finalized et reviewed as one immutable package before execution. Many launch incidents come from late parameter changes made in disconnected scripts. Deterministic launch pack generation prevents this by forcing a single source of truth.\n\nAuthority strategy is the second pillar. Decide which authorities remain active after launch, which are revoked, et which move to multisig custody. A common best practice is staged authority reduction: keep temporary controls through rollout validation, then revoke or transfer to gouvernance once monitoring baselines are stable. This must be planned explicitly, not improvised during launch day.\n\nTests strategy should include deterministic offline tests et limited online rehearsal. Offline checks validate config schemas, instruction payload encoding, fee simulations, et supply invariants. Optional devnet rehearsal validates operational playbooks (funding, sequence execution, monitoring) but should not be your only validation layer. If offline checks fail, devnet success is not meaningful.\n\nAirdrop et distribution planning should include recipient reconciliation et rollback strategy. Teams often focus on minting et forget operational constraints around recipient list correctness, timing windows, et support escalation paths. Deterministic distribution plans avec stable labels make reconciliation simpler et reduce accidental double execution.\n\nMonitoring et communication are equally important. Define launch metrics in advance: minted supply observed, distribution completion count, fee behavior sanity, et extension-specific health checks. Publish user-facing notices pour any non-obvious behavior such as transfer fees or frozen default compte state. Clear communication lowers support load et improves trust.\n\nFinally, write down hard stop conditions. If invariants fail, if authority keys mismatch, or if distribution deltas diverge from expected totals, launch should pause immediately. Engineering discipline means refusing to proceed when safety checks are red.\n\n## Pitfall: Treating launch as a one-shot script run\n\nWithout an explicit checklist et rollback criteria, teams can execute technically valid instructions that violate business or gouvernance intent. Successful launches are controlled workflows, not single commands.\n\n## Sanity Checklist\n\n1. Freeze a canonical config payload before execution.\n2. Approve authority lifecycle et revocation milestones.\n3. Run deterministic offline simulation et invariant checks.\n4. Reconcile recipient totals et distribution labels.\n5. Define go/no-go criteria et escalation owners.\n",
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
                      "To prevent script/config drift between review et launch",
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
            "content": "# Emit stable LaunchPackSummary\n\nCompose full project output as stable JSON:\n- normalized authorities et extensions\n- supply totals et optional fee model examples\n- deterministic plan metadata et invariants\n- fixtures hash + encoding version metadata\n",
            "duration": "45 min",
            "hints": [
              "Keep checkpoint JSON key ordering fixed so output is stable.",
              "Compute recipientsTotal et remaining avec exact integer math.",
              "Include determinism metadata (fixtures hash + encoding version) in the final object."
            ]
          }
        }
      }
    }
  },
  "solana-mobile": {
    "title": "Solana Mobile Development",
    "description": "Build production-ready mobile Solana dApps avec MWA, robust portefeuille session architecture, explicit signing UX, et disciplined distribution operations.",
    "duration": "6 hours",
    "tags": [
      "mobile",
      "saga",
      "dapp-store",
      "react-native"
    ],
    "modules": {
      "module-mobile-wallet-adapter": {
        "title": "Mobile Portefeuille Adapter",
        "description": "Core MWA protocol, session lifecycle control, et resilient portefeuille handoff patterns pour production mobile apps.",
        "lessons": {
          "mobile-wallet-overview": {
            "title": "Mobile Portefeuille Vue d'ensemble",
            "content": "# Mobile Portefeuille Vue d'ensemble\n\nSolana Mobile development is built around the Solana Mobile Stack (SMS), a set of standards et tooling designed pour secure, high-quality crypto-native mobile experiences. SMS is more than a hardware initiative; it defines interoperable portefeuille communications, trusted execution patterns, et distribution infrastructure tailored to Web3 apps.\n\nA core piece is the Mobile Portefeuille Adapter (MWA) protocol. Instead of embedding private keys in dApps, MWA connects mobile dApps to external portefeuille apps pour authorization, signing, et transaction submission. This separation mirrors browser portefeuille securite on desktop et prevents dApps from directly handling secret keys.\n\nSaga introduced the first flagship reference device pour Solana Mobile concepts, including Seed Vault-oriented workflows. Even when users are not on Saga, SMS standards remain useful because protocol-level interoperability is the target: any portefeuille implementing MWA can serve compatible apps.\n\nThe Solana dApp Store is another foundational element. It provides a distribution channel pour crypto applications avec policy considerations better aligned to on-chain apps than traditional app stores. Teams can ship portefeuille-native functionality, tokenized features, et on-chain social mechanics without the same constraints often imposed by conventional app marketplaces.\n\nKey architectural principles pour mobile Solana apps:\n\n- Keep signing in portefeuille context, not app context.\n- Treat session authorization as revocable et short-lived.\n- Build graceful fallback if portefeuille app is missing.\n- Optimize pour intermittent connectivity et mobile latency.\n\nTypical mobile flow:\n\n1. dApp requests authorization via MWA.\n2. Portefeuille prompts user to approve compte access.\n3. dApp builds transactions et requests signatures.\n4. Portefeuille returns signed payload or submits transaction.\n5. dApp observes confirmation et updates UI.\n\nMobile UX needs explicit state transitions (authorizing, awaiting portefeuille, signing, submitted, confirmed). Ambiguity causes user drop-off quickly on small screens.\n\nPour Solana teams, mobile is not a “mini web app”; it requires deliberate protocol et UX conception choices. SMS et MWA provide a secure baseline so developers can ship on-chain experiences avec production-grade signing et session models on handheld devices.\n\n## Pratique architecture split\n\nTreat your mobile stack as three independent systems:\n1. UI app state et navigation.\n2. Portefeuille transport/session state (MWA lifecycle).\n3. On-chain transaction intent et confirmation state.\n\nIf you couple these layers tightly, portefeuille switch interruptions et app backgrounding can corrupt flow state. If they stay separated, recovery is predictable.\n\n## What users should feel\n\nGood mobile crypto UX is not \"fewer steps at all costs.\" It is clear intent, explicit signing context, et safe recoverability when app switching or network instability happens.\n",
            "duration": "35 min"
          },
          "mwa-integration": {
            "title": "MWA Integration",
            "content": "# MWA Integration\n\nIntegrating Mobile Portefeuille Adapter typically starts avec `@solana-mobile/mobile-wallet-adapter` APIs et an interaction pattern built around `transact()`. Within a transaction session, the app can authorize, request capabilities, sign transactions, et handle portefeuille responses in a structured way.\n\nA simplified integration flow:\n\n```typescript\nimport { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';\n\nawait transact(async (wallet) => {\n  const auth = await wallet.authorize({\n    cluster: 'devnet',\n    identity: { name: 'JazzCode Mobile', uri: 'https://jazzcode.vercel.app' },\n  });\n\n  const account = auth.accounts[0];\n  // build tx, request signing/submission\n});\n```\n\nAuthorization yields one or more comptes plus auth tokens pour session continuation. Persist these tokens carefully et invalidate them on sign-out. Do not assume tokens remain valid forever; portefeuille apps can revoke sessions.\n\nPour signing, you can request:\n\n- `signTransactions` (sign only)\n- `signAndSendTransactions` (portefeuille signs et submits)\n- `signMessages` (SIWS-like auth flows)\n\nDeep links are used under the hood to switch between your dApp et portefeuille. That means state restoration matters: your app should survive process backgrounding et resume pending operation state on return.\n\nPratique engineering tips:\n\n- Implement idempotent transaction request handling.\n- Show a visible “Waiting pour portefeuille approval” state.\n- Handle user cancellation explicitly, not as generic failure.\n- Retry network submission separately from signing when possible.\n\nSecurite considerations:\n\n- Bind sessions to app identity metadata.\n- Use short-lived backend nonces pour message-sign auth.\n- Never log full signed payloads avec sensitive context.\n\nMWA is effectively your mobile signing transport layer. If its state machine is robust, your app feels professional et trustworthy. If state handling is weak, users experience “stuck” flows et may distrust the dApp even if on-chain logic is correct.",
            "duration": "35 min"
          },
          "mobile-transaction": {
            "title": "Build a Mobile Transaction Function",
            "content": "# Build a Mobile Transaction Function\n\nImplement a helper that formats a deterministic MWA transaction request summary string.\n\nExpected output format:\n\n`<cluster>|<payer>|<instructionCount>`\n\nUse this exact order et delimiter.",
            "duration": "50 min",
            "hints": [
              "Add validation before returning the formatted string.",
              "instructionCount should be treated as a number but returned as text.",
              "Throw exact error message pour missing payer."
            ]
          }
        }
      },
      "module-dapp-store-and-distribution": {
        "title": "dApp Store & Distribution",
        "description": "Publishing, operational readiness, et trust-centered mobile UX practices pour Solana app distribution.",
        "lessons": {
          "dapp-store-submission": {
            "title": "dApp Store Submission",
            "content": "# dApp Store Submission\n\nPublishing to the Solana dApp Store requires more than packaging binaries. Teams should treat submission as a product, compliance, et securite review process. A strong submission demonstrates safe portefeuille interactions, clear user communication, et operational readiness.\n\nSubmission readiness checklist:\n\n- Stable release builds pour target Android devices.\n- Clear app identity et support channels.\n- Portefeuille interaction flows tested pour cancellation et failure recovery.\n- Privacy policy et terms aligned to on-chain behaviors.\n- Transparent handling of tokenized features et in-app value flows.\n\nOne distinguishing concept in Solana mobile distribution is token-aware product conception. Apps may use NFT-gated access, on-chain subscriptions, or tokenized entitlements. These flows must be understandable to users et not hide financial consequences. Review teams typically evaluate whether permissions et portefeuille prompts are proportional to app behavior.\n\nNFT-based licensing models can be implemented by checking ownership of specific collection assets at runtime. If licensing depends on assets, build robust indexing et refresh behavior so users are not locked out due to temporary RPC/indexer mismatch.\n\nOperational bonnes pratiques pour review success:\n\n- Provide reproducible test comptes et walkthroughs.\n- Include a “safe mode” or demo path if portefeuille connection fails.\n- Avoid unexplained signature prompts.\n- Log non-sensitive diagnostics pour support.\n\nPost-submission lifecycle matters too. Plan how you will handle urgent fixes, portefeuille SDK updates, et chain-level incidents. Mobile releases can take time to propagate, so feature flags et backend kill-switches pour risky pathways are valuable.\n\nDistribution strategy should also include analytics around onboarding funnels, portefeuille connect success rates, et transaction completion rates. These metrics identify mobile-specific friction that desktop-oriented teams often miss.\n\nA successful dApp Store submission reflects secure protocol integration et mature product operations. If your portefeuille interactions are explicit, fail-safe, et user-centered, your app is far more likely to pass review et retain users in production.",
            "duration": "35 min"
          },
          "mobile-best-practices": {
            "title": "Mobile Bonnes pratiques",
            "content": "# Mobile Bonnes pratiques\n\nMobile crypto UX requires balancing speed, safety, et trust. Users make high-stakes decisions on small screens, often on unstable networks. Solana mobile apps should therefore optimize pour explicitness et recoverability, not just visual polish.\n\n**Biometric gating** is useful pour sensitive local actions (revealing seed-dependent views, exporting compte data, approving high-risk actions), but portefeuille-level signing decisions should remain in portefeuille app context. Avoid building fake in-app “confirm” screens that look like signing prompts.\n\n**Session keys et scoped auth** improve UX by reducing repetitive approvals. However, scope must be tightly constrained (allowed methods, time window, limits). Session credentials should be revocable et auditable.\n\n**Offline et poor-network behavior** must be handled intentionally:\n\n- Queue non-critical reads.\n- Retry idempotent submissions avec backoff.\n- Distinguish “signed but not submitted” from “submitted but unconfirmed.”\n\n**Push notifications** are valuable pour transaction outcomes, liquidation alerts, et gouvernance events. Notifications should include enough context pour user safety but never leak sensitive data.\n\nUX patterns that consistently improve conversion:\n\n- Show transaction simulation summaries before portefeuille handoff.\n- Display clear statuses: building, awaiting signature, submitted, confirmed.\n- Provide explorer links et retry actions.\n- Use plain-language error messages avec suggested fixes.\n\nSecurite hygiene:\n\n- Pin trusted RPC endpoints or use reputable providers avec fallback.\n- Validate compte ownership et expected program IDs on all client-side decoded data.\n- Protect analytics pipelines from sensitive payload leakage.\n\nAccessibility et internationalization matter pour global adoption. Ensure touch targets, contrast, et localization of risk messages are adequate. Pour crypto workflows, misunderstanding can cause irreversible loss.\n\nFinally, measure reality: connect success rate, signature approval rate, drop-off after portefeuille switch, et average time-to-confirmation. Mobile teams that instrument these metrics can iteratively remove friction et increase trust.\n\nGreat Solana mobile apps feel predictable under stress. If users always understand what they are signing, what state they are in, et how to recover, your product is operating at production quality.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-testing": {
    "title": "Tests Solana Programs",
    "description": "Build robust Solana tests systems across local, simulated, et network environments avec explicit securite invariants et release-quality confidence gates.",
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
        "description": "Core test strategy across unit/integration layers avec deterministic workflows et adversarial case coverage.",
        "lessons": {
          "testing-approaches": {
            "title": "Tests Approaches",
            "content": "# Tests Approaches\n\nTests Solana programs requires multiple layers because failures can occur in logic, compte validation, transaction composition, or network behavior. A production tests strategy usually combines unit tests, integration tests, et end-to-end validation across local validateurs et devnet.\n\n**Unit tests** validate isolated business logic avec minimal runtime overhead. In Rust, pure helper functions (math, state transitions, invariant checks) should be unit-tested aggressively because they are easy to execute et fast in CI.\n\n**Integration tests** execute against realistic program invocation paths. Pour Anchor projects, this often means `anchor test` avec local validateur setup, compte initialization flows, et instruction-level assertions. Integration tests should cover both positive et adversarial inputs, including invalid comptes, unauthorized signers, et boundary values.\n\n**End-to-end tests** include frontend/client composition plus portefeuille et RPC interactions. They catch issues that lower layers miss: incorrect compte ordering, wrong PDA derivations in client code, et serialization mismatches.\n\nCommon tools:\n\n- `solana-program-test` pour Rust-side tests avec in-process banks simulation.\n- `solana-bankrun` pour deterministic TypeScript integration tests.\n- Anchor TypeScript client pour instruction building et assertions.\n- Playwright/Cypress pour app-level transaction flow tests.\n\nTest coverage priorities:\n\n1. Authorization et signer checks.\n2. Compte ownership et PDA seed constraints.\n3. Arithmetic boundaries et fee logic.\n4. CPI behavior et failure rollback.\n5. Upgrade compatibility et migration paths.\n\nA frequent anti-pattern is only tests happy paths avec one portefeuille et static inputs. This misses most exploit classes. Robust suites include malicious compte substitution, stale or duplicated comptes, et partial failure simulation.\n\nIn CI, separate fast deterministic suites from slower network-dependent suites. Run deterministic tests on every push, et run heavier devnet suites on merge or release.\n\nEffective Solana tests is about confidence under adversarial conditions, not just green checkmarks. If your tests model attacker behavior et compte-level edge cases, you will prevent the majority of production incidents before deploiement.\n\n## Pratique suite conception rule\n\nMap every critical instruction to at least one test in each layer:\n- unit test pour pure invariant/math logic\n- integration test pour compte validation et state transitions\n- environment test pour portefeuille/RPC orchestration\n\nIf one layer is missing, incidents usually appear in that blind spot first.",
            "duration": "35 min"
          },
          "bankrun-testing": {
            "title": "Bankrun Tests",
            "content": "# Bankrun Tests\n\nSolana Bankrun provides deterministic, high-speed test execution pour Solana programs from TypeScript environments. It emulates a local bank-like runtime where transactions can be processed predictably, comptes can be inspected directly, et temporal state can be manipulated pour tests scenarios like vesting unlocks or oracle staleness.\n\nCompared avec relying on external devnet, Bankrun gives repeatability. This is crucial pour CI pipelines where flaky network behavior can mask regressions.\n\nTypical Bankrun workflow:\n\n1. Start test context avec target program loaded.\n2. Create keypairs et funded test comptes.\n3. Build et process transactions via BanksClient-like API.\n4. Assert post-transaction compte state.\n5. Advance slots/time pour time-dependent logic tests.\n\nConceptual setup:\n\n```typescript\n// pseudocode\nconst context = await startBankrun({ programs: [...] });\nconst client = context.banksClient;\n\n// process tx and inspect accounts deterministically\n```\n\nWhy Bankrun is powerful:\n\n- Fast iteration pour protocol teams.\n- Deterministic block/slot control.\n- Rich compte inspection without explorer dependency.\n- Easy simulation of multi-step protocol flows.\n\nHigh-value Bankrun test scenarios:\n\n- Liquidation eligibility after oracle/time movement.\n- Vesting et cliff unlock schedule transitions.\n- Fee accumulator updates across many operations.\n- CPI behavior avec mocked downstream compte states.\n\nCommon mistakes:\n\n- Asserting only transaction success without state validation.\n- Ignoring rent et compte lamport changes.\n- Not tests replay/idempotency behaviors.\n\nUse helper factories pour test comptes et PDA derivations so tests remain concise. Keep transaction builders in reusable utilities to avoid drift between test et production clients.\n\nBankrun is not a replacement pour all environments, but it is one of the best layers pour deterministic integration confidence on Solana. Teams that invest in comprehensive Bankrun suites tend to catch state-machine bugs significantly earlier than teams relying only on devnet smoke tests.",
            "duration": "35 min"
          },
          "write-bankrun-test": {
            "title": "Write a Counter Program Bankrun Test",
            "content": "# Write a Counter Program Bankrun Test\n\nImplement a helper that returns the expected counter value after a sequence of increment operations. This mirrors a deterministic assertion you would use in a Bankrun test.\n\nReturn the final numeric value as a string.",
            "duration": "50 min",
            "hints": [
              "Use Array.reduce to sum increments.",
              "Start reduce avec the initial value.",
              "Convert final number to string before returning."
            ]
          }
        }
      },
      "module-advanced-testing": {
        "title": "Avance Tests",
        "description": "Fuzzing, devnet validation, et CI/CD release controls pour safer protocol changes.",
        "lessons": {
          "fuzzing-trident": {
            "title": "Fuzzing avec Trident",
            "content": "# Fuzzing avec Trident\n\nFuzzing explores large input spaces automatically to find bugs that handcrafted tests miss. Pour Solana et Anchor programs, Trident-style fuzzing workflows generate randomized instruction sequences et parameter values, then check invariants such as “total supply never decreases incorrectly” or “vault liabilities never exceed assets.”\n\nUnlike unit tests that validate expected examples, fuzzing asks: what if inputs are weird, extreme, or adversarial in combinations we did not think about?\n\nCore fuzzing components:\n\n- **Generators** pour instruction inputs et compte states.\n- **Harness** that executes generated transactions.\n- **Invariants** that must always hold.\n- **Shrinking** to minimize failing inputs pour debugging.\n\nUseful invariants in DeFi protocols:\n\n- Conservation of value across transfers et burns.\n- Non-negative balances et debt states.\n- Authority invariants (only valid signer modifies privileged state).\n- Price et collateral constraints under liquidation logic.\n\nFuzzing strategy tips:\n\n- Start avec a small instruction set et one invariant.\n- Add stateful multi-step scenarios (deposit->borrow->repay->withdraw).\n- Include random compte ordering et malicious compte substitution cases.\n- Track coverage to avoid blind spots.\n\nCoverage analysis matters: if fuzzing never reaches critical branches (error paths, CPI failure handlers, liquidation branches), it gives false confidence. Integrate branch coverage tools where possible.\n\nTrident et similar fuzzers are especially good at discovering arithmetic edge cases, stale state assumptions, et unexpected state transitions from unusual call sequences.\n\nCI integration approach:\n\n- Run short fuzz campaigns on every PR.\n- Run longer campaigns nightly.\n- Persist failing seeds as regression tests.\n\nFuzzing should complement, not replace, deterministic tests. Deterministic suites provide explicit behavior guarantees; fuzzing provides adversarial exploration at scale.\n\nPour serious Solana protocols handling user funds, fuzzing is no longer optional. It is one of the highest-leverage investments pour preventing unknown-unknown bugs before mainnet exposure.",
            "duration": "35 min"
          },
          "devnet-testing": {
            "title": "Devnet Tests",
            "content": "# Devnet Tests\n\nDevnet tests bridges the gap between deterministic local tests et real-world network conditions. While local validateurs et Bankrun are ideal pour speed et reproducibility, devnet reveals behavior under real RPC latency, block production timing, fee markets, et compte history constraints.\n\nA robust devnet test strategy includes:\n\n- Automated program deploiement to a dedicated devnet keypair.\n- Deterministic fixture creation (airdrop, mint setup, PDAs).\n- Smoke tests pour critical instruction paths.\n- Monitoring of transaction confirmation et log outputs.\n\nImportant devnet caveats:\n\n- State is shared et can be noisy.\n- Airdrop limits can throttle tests.\n- RPC providers may differ in reliability et rate limits.\n\nTo reduce flakiness:\n\n- Use dedicated namespaces/seeds per CI run.\n- Add retries pour transient network failures.\n- Bound test runtime et fail avec actionable logs.\n\nProgram upgrade tests is particularly important on devnet. Validate that new binaries preserve compte compatibility et migrations execute as expected. Incompatible changes can brick existing comptes if not tested.\n\nChecklist pour release-candidate validation:\n\n1. Deploy upgraded program binary.\n2. Run migration instructions.\n3. Execute backward-compatibility read paths.\n4. Execute all critical write instructions.\n5. Verify event/log schema expected by indexers.\n\nPour financial protocols, include oracle integration tests et liquidation path checks against live-like feeds if possible.\n\nDevnet should not be your only quality gate, but it is the best pre-mainnet signal pour environment-related issues. Teams that ship without meaningful devnet validation often discover RPC edge cases et timing bugs in production.\n\nTreat devnet as a staging environment avec disciplined test orchestration, clear observability, et explicit rollback plans.",
            "duration": "35 min"
          },
          "ci-cd-pipeline": {
            "title": "CI/CD Pipeline pour Solana",
            "content": "# CI/CD Pipeline pour Solana\n\nA mature Solana CI/CD pipeline enforces quality gates across code, tests, securite checks, et deploiement workflows. Pour program teams, CI is not just linting Rust et TypeScript; it is about protecting on-chain invariants before irreversible releases.\n\nRecommended pipeline stages:\n\n1. **Static checks**: formatting, lint, type checks.\n2. **Unit/integration tests**: deterministic local execution.\n3. **Securite checks**: dependency scan, optional static analyzers.\n4. **Build artifacts**: reproducible program binaries.\n5. **Staging deploy**: optional devnet deploiement et smoke tests.\n6. **Manual approval** pour production deploy.\n\nGitHub Actions is a common choice. A typical workflow matrix runs Rust et Node tasks in parallel to reduce cycle time. Cache Cargo et pnpm dependencies aggressively.\n\nExample conceptual workflow snippets:\n\n```yaml\n- run: cargo test --workspace\n- run: pnpm lint && pnpm typecheck && pnpm test\n- run: anchor build\n- run: anchor test --skip-local-validator\n```\n\nPour deployments:\n\n- Store deploy keypairs in secure secrets management.\n- Restrict deploy jobs to protected branches/tags.\n- Emit program IDs et transaction signatures as artifacts.\n\nProgram verification is critical. Where possible, verify deployed binary matches source-controlled build output. This strengthens trust et simplifies audits.\n\nOperational safety practices:\n\n- Use feature flags pour high-risk logic activation.\n- Keep rollback strategy documented.\n- Monitor post-deploy metrics (error rates, failed tx ratio, latency).\n\nInclude regression tests pour previously discovered bugs. Every production incident should produce a permanent automated test.\n\nA strong CI/CD pipeline is an engineering control, not a convenience. It reduces release risk, accelerates safe iteration, et provides confidence that code changes preserve securite et protocol correctness under production conditions.",
            "duration": "35 min"
          }
        }
      }
    }
  },
  "solana-indexing": {
    "title": "Solana Indexing & Analytics",
    "description": "Build a production-grade Solana event indexer avec deterministic decoding, resilient ingestion contracts, checkpoint recovery, et analytics outputs teams can trust.",
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
        "description": "Events model, token decoding, et transaction parsing fundamentals avec schema discipline et deterministic normalization.",
        "lessons": {
          "indexing-v2-events-model": {
            "title": "Events model: transactions, logs, et program instructions",
            "content": "# Events model: transactions, logs, et program instructions\n\nIndexing Solana starts avec understanding where data lives et how to extract structured events from raw chain data. Unlike EVM chains where events are explicit log topics, Solana encodes program state changes in compte updates et program logs. Your indexer must parse these sources et transform them into a queryable event stream.\n\nA transaction on Solana contains one or more instructions. Each instruction targets a program, includes compte metas, et carries opaque instruction data. When executed, programs emit log entries via solana_program::msg or similar macros. These logs, combined avec pre/post compte states, form the raw material pour event indexing.\n\nThe indexer pipeline typically follows: fetch → parse → normalize → store. Fetch retrieves transaction metadata via RPC or geyser plugins. Parse extracts program logs et compte diffs. Normalize converts raw data into domain-specific events avec stable schemas. Store persists events avec appropriate indexing pour queries.\n\nKey concepts pour normalization: instruction program IDs identify which decoder to apply, compte ownership determines data layout, et log prefixes often indicate event types (e.g., \"Transfer\", \"Mint\", \"Burn\"). Your indexer must handle multiple program versions gracefully, maintaining backward compatibility as instruction layouts evolve.\n\nIdempotency is critical. Block reorganizations are rare on Solana but possible during forks. Your indexing pipeline should handle replayed transactions without duplicating events. This typically means using transaction signatures as unique keys et implementing upsert semantics in the storage layer.\n\n## Operator modele mental\n\nTreat your indexer as a data product avec explicit contracts:\n1. ingest contract (what raw inputs are accepted),\n2. normalization contract (stable event schema),\n3. serving contract (what query consumers can rely on).\n\nWhen these contracts are versioned et documented, protocol upgrades become manageable instead of breaking downstream analytics unexpectedly.\n\n## Checklist\n- Understand transaction → instructions → logs hierarchy\n- Identify program IDs et compte ownership pour data layout selection\n- Normalize raw logs into domain events avec stable schemas\n- Implement idempotent ingestion using transaction signatures\n- Plan pour program version evolution in decoders\n\n## Red flags\n- Parsing logs without validating program IDs\n- Assuming fixed compte ordering across program versions\n- Missing idempotency leading to duplicate events\n- Storing raw data without normalized event extraction\n",
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
                      "Program logs et compte state changes",
                      "Explicit event topics like EVM",
                      "Validateur consensus messages"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana programs emit events via logs et state changes, not explicit event topics."
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
                    "explanation": "Idempotent ingestion ensures the same transaction processed twice creates only one event."
                  }
                ]
              }
            ]
          },
          "indexing-v2-token-decoding": {
            "title": "Token compte decoding et SPL layout",
            "content": "# Token compte decoding et SPL layout\n\nSPL Token comptes follow a standardized binary layout that indexers must parse to track balances et mint operations. Understanding this layout enables you to extract meaningful data from raw compte bytes without relying on external APIs.\n\nA token compte contains: mint address (32 bytes), owner address (32 bytes), amount (8 bytes u64), delegate (32 bytes, optional), state (1 byte), is_native (1 byte + 8 bytes if native), delegated_amount (8 bytes), et close_authority (36 bytes optional). The total size is typically 165 bytes pour standard comptes.\n\nCompte discriminators help identify compte types. SPL Token comptes are owned by the Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA) or Token-2022. Your indexer should verify ownership before attempting to parse, as malicious comptes could mimic data layouts.\n\nDecoding involves: read the 32-byte mint, verify it matches expected token, read the 64-bit amount (little-endian), convert to decimal representation using mint decimals, et track owner pour balance aggregation. Always handle malformed data gracefully - truncated comptes or unexpected sizes should not crash the indexer.\n\nPour balance diffs, compare pre-transaction et post-transaction states. A transfer emits no explicit event but changes two compte amounts. Your indexer must detect these changes by comparing states before et after instruction execution.\n\n## Checklist\n- Verify token program ownership before parsing\n- Decode mint, owner, et amount fields correctly\n- Handle little-endian u64 conversion properly\n- Support both Token et Token-2022 programs\n- Implement graceful handling pour malformed comptes\n\n## Red flags\n- Parsing without ownership verification\n- Ignoring mint decimals in amount conversion\n- Assuming fixed compte sizes without bounds checking\n- Missing balance diff detection pour transfers\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "indexing-v2-l2-token-explorer",
                "title": "Token Compte Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "SPL Token Compte",
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
                    "prompt": "What is the standard size of an SPL Token compte?",
                    "options": [
                      "165 bytes",
                      "64 bytes",
                      "256 bytes"
                    ],
                    "answerIndex": 0,
                    "explanation": "Standard SPL Token comptes are 165 bytes, containing mint, owner, amount, et optional fields."
                  },
                  {
                    "id": "indexing-v2-l2-q2",
                    "prompt": "How should amount be interpreted from token compte data?",
                    "options": [
                      "As little-endian u64, then divided by 10^decimals",
                      "As big-endian u32 directly",
                      "As ASCII string"
                    ],
                    "answerIndex": 0,
                    "explanation": "Amounts are stored as little-endian u64 et must be converted using the mint's decimal places."
                  }
                ]
              }
            ]
          },
          "indexing-v2-decode-token-account": {
            "title": "Challenge: Decode token compte + diff token balances",
            "content": "# Challenge: Decode token compte + diff token balances\n\nImplement deterministic token compte decoding et balance diffing:\n\n- Parse a 165-byte SPL Token compte layout\n- Extract mint, owner, et amount fields\n- Compute balance differences between pre/post states\n- Return normalized event objects avec stable ordering\n\nYour solution will be validated against multiple test cases avec various token compte states.",
            "duration": "45 min",
            "hints": [
              "SPL Token compte layout: mint (32B), owner (32B), amount (8B LE u64)",
              "Use little-endian byte order pour the amount field",
              "Convert bytes to base58 pour Solana addresses"
            ]
          },
          "indexing-v2-transaction-meta": {
            "title": "Transaction meta parsing: logs, errors, et inner instructions",
            "content": "# Transaction meta parsing: logs, errors, et inner instructions\n\nTransaction metadata provides the context needed to index complex operations. Understanding how to parse logs, handle errors, et traverse inner instructions enables comprehensive event extraction.\n\nProgram logs follow a hierarchical structure. The outermost logs show instruction execution order, while inner logs reveal CPI calls. Each log line typically includes a prefix indicating severity or type: \"Program\", \"Invoke\", \"Success\", \"Fail\", or custom program messages. Your parser should handle nested invocation levels correctly.\n\nError handling distinguishes between transaction-level failures et instruction-level failures. A transaction may succeed overall while individual instructions fail (et are rolled back). Conversely, a single failing instruction can cause the entire transaction to fail. Indexers should record these distinctions pour accurate analytics.\n\nInner instructions reveal the complete execution trace. When a program makes CPI calls, these appear as inner instructions in transaction metadata. Indexers must traverse both top-level et inner instructions to capture all state changes. This is especially important pour protocols like Jupiter that route through multiple DEXs.\n\nLog filtering improves efficiency. Rather than parsing all logs, indexers can filter by program ID prefixes or known event signatures. However, be cautious - aggressive filtering might miss important events during protocol upgrades or edge cases.\n\n## Checklist\n- Parse program logs avec proper nesting level tracking\n- Distinguish transaction-level from instruction-level errors\n- Traverse inner instructions pour complete CPI traces\n- Implement efficient log filtering by program ID\n- Handle both success et failure scenarios\n\n## Red flags\n- Ignoring inner instructions et missing CPI events\n- Treating all log failures as transaction failures\n- Parsing without log level/depth context\n- Missing error context in indexed events\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "indexing-v2-l4-logs",
                "title": "Log Structure Example",
                "steps": [
                  {
                    "cmd": "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
                    "output": "Program log: Instruction: Transfer",
                    "note": "Top-level instruction at depth 1"
                  },
                  {
                    "cmd": "Program 11111111111111111111111111111111 invoke [2]",
                    "output": "Program log: Create compte",
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
        "description": "Build end-to-end indexer pipeline behavior: idempotent ingestion, checkpoint recovery, et analytics aggregation at production scale.",
        "lessons": {
          "indexing-v2-index-transactions": {
            "title": "Challenge: Index transactions to normalized events",
            "content": "# Challenge: Index transactions to normalized events\n\nImplement a transaction indexer that produces normalized Event objects:\n\n- Parse instruction logs et identify event types\n- Extract transfer events avec from/to/amount/mint\n- Handle multiple events per transaction\n- Return stable, canonical JSON avec sorted keys\n- Support idempotency via transaction signature deduplication",
            "duration": "50 min",
            "hints": [
              "Parse log entries to identify event types",
              "Extract fields using regex patterns",
              "Include transaction signature pour traceability",
              "Sort events by index pour deterministic output"
            ]
          },
          "indexing-v2-pagination-caching": {
            "title": "Pagination, checkpointing, et caching semantics",
            "content": "# Pagination, checkpointing, et caching semantics\n\nProduction indexers must handle large datasets efficiently while maintaining consistency. Pagination, checkpointing, et caching form the backbone of scalable indexing infrastructure.\n\nPagination strategies depend on query patterns. Cursor-based pagination using transaction signatures provides stable ordering even during concurrent writes. Offset-based pagination can miss or duplicate entries during high-write periods. Pour time-series data, consider partitioning by slot or block time.\n\nCheckpointing enables recovery from failures. Indexers should periodically save their processing position (last processed slot/signature) to durable storage. On restart, resume from the checkpoint rather than re-indexing from genesis. This pattern is essential pour long-running indexers handling months of chain history.\n\nCaching reduces redundant RPC calls. Compte metadata, program IDs, et decoded instruction layouts can be cached avec appropriate TTLs. However, cache invalidation is critical - stale cache entries can lead to incorrect decoding or missed events. Consider using slot-based versioning pour cache entries.\n\nIdempotent writes prevent data corruption. Even avec checkpointing, duplicate processing can occur during retries. Use transaction signatures as unique identifiers et implement upsert semantics. Database constraints or unique indexes should enforce this at the storage layer.\n\n## Checklist\n- Implement cursor-based pagination pour stable ordering\n- Save periodic checkpoints pour failure recovery\n- Cache compte metadata avec slot-based invalidation\n- Enforce idempotent writes via unique constraints\n- Handle backfills without duplicating events\n\n## Red flags\n- Using offset pagination pour high-write datasets\n- Missing checkpointing requiring full re-index on restart\n- Caching without proper invalidation strategies\n- Allowing duplicate events from retry logic\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexing-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexing-v2-l6-q1",
                    "prompt": "Why is cursor-based pagination preferred pour indexing?",
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
            "title": "Analytics aggregation: per portefeuille, per token metrics",
            "content": "# Analytics aggregation: per portefeuille, per token metrics\n\nRaw event data becomes valuable through aggregation. Building analytics pipelines enables insights into user behavior, token flows, et protocol usage patterns.\n\nPer-portefeuille analytics track individual user activity. Key metrics include: transaction count, unique tokens held, total volume transferred, first/last activity timestamps, et interaction patterns avec specific programs. These metrics power user segmentation et engagement analysis.\n\nPer-token analytics track asset-level metrics. Important aggregations include: total transfer volume, unique holders, holder distribution (whales vs retail), velocity (average time between transfers), et cross-program usage. These inform tokenomics analysis et market research.\n\nTime-windowed aggregations support trend analysis. Daily, weekly, et monthly rollups enable comparison across time periods. Consider using tumbling windows pour fixed periods or sliding windows pour moving averages. Materialized views can pre-compute common aggregations pour query performance.\n\nNormalization ensures consistent comparisons. Convert all amounts to human-readable decimals, normalize timestamps to UTC, et use consistent address formatting (base58). Deduplicate events from failed transactions that may still appear in logs.\n\n## Checklist\n- Aggregate per-portefeuille metrics (volume, token count, activity)\n- Aggregate per-token metrics (holders, velocity, distribution)\n- Implement time-windowed rollups pour trend analysis\n- Normalize amounts, timestamps, et addresses\n- Exclude failed transactions from aggregates\n\n## Red flags\n- Mixing raw et decimal-adjusted amounts\n- Including failed transactions in volume metrics\n- Missing time normalization across timezones\n- Storing unbounded raw data without aggregation\n",
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
                      "label": "Portefeuille Summary",
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
            "content": "# Checkpoint: Produce stable JSON analytics summary\n\nImplement the final analytics checkpoint that produces a deterministic summary:\n\n- Aggregate events into per-portefeuille et per-token metrics\n- Generate sorted, stable JSON output\n- Include timestamp et summary statistics\n- Handle edge cases (empty datasets, single events)\n\nThis checkpoint validates your complete indexing pipeline from raw data to analytics.",
            "duration": "50 min",
            "hints": [
              "Aggregate events by portefeuille address",
              "Sum transaction counts et volumes",
              "Sort output arrays by address pour determinism",
              "Include metadata like timestamps"
            ]
          }
        }
      }
    }
  },
  "solana-payments": {
    "title": "Solana Payments & Checkout Flows",
    "description": "Build production-grade Solana payment flows avec robust validation, replay-safe idempotency, secure webhooks, et deterministic receipts pour reconciliation.",
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
        "description": "Address validation, idempotency strategy, et payment intent conception pour reliable checkout behavior.",
        "lessons": {
          "payments-v2-address-validation": {
            "title": "Address validation et memo strategies",
            "content": "# Address validation et memo strategies\n\nPayment flows on Solana require robust address validation et thoughtful memo strategies. Unlike traditional payment systems avec compte numbers, Solana uses base58-encoded public keys that must be validated before any value transfer.\n\nAddress validation involves three layers: format validation, derivation check, et ownership verification. Format validation ensures the string is valid base58 et decodes to 32 bytes. Derivation check optionally verifies the address is on the Ed25519 curve (pour portefeuille addresses) or off-curve (pour PDAs). Ownership verification confirms the compte exists et is owned by the expected program.\n\nMemos attach metadata to payments. The SPL Memo program enables attaching UTF-8 strings to transactions. Common use cases include: order IDs, invoice references, customer identifiers, et compliance data. Memos are not encrypted et are visible on-chain, so never include sensitive information.\n\nMemo bonnes pratiques: keep under 256 bytes pour efficiency, use structured formats (JSON) pour machine parsing, include versioning pour future compatibility, et hash sensitive identifiers rather than storing them plaintext. Consider using deterministic memo formats that can be regenerated from payment context pour idempotency checks.\n\nAddress poisoning is an attack vector where attackers create addresses visually similar to legitimate ones. Countermeasures include: displaying addresses avec checksums, using name services (Solana Name Service, Bonfida) where appropriate, et implementing confirmation steps pour large transfers.\n\n## Merchant-safe memo template\n\nA pratique memo format is:\n`v1|order:<id>|shop:<merchantId>|nonce:<shortHash>`\n\nThis keeps memos short, parseable, et versioned while avoiding direct storage of sensitive user details.\n\n## Checklist\n- Validate base58 encoding et 32-byte length\n- Distinguish between on-curve et off-curve addresses\n- Verify compte ownership pour program-specific payments\n- Use SPL Memo program pour structured metadata\n- Implement address poisoning protections\n\n## Red flags\n- Transferring to unvalidated addresses\n- Storing sensitive data in plaintext memos\n- Skipping ownership checks pour token comptes\n- Trusting visually similar addresses without verification\n",
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
                      "Attach metadata like order IDs to transactions",
                      "Encrypt payment amounts",
                      "Replace transaction signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "SPL Memo allows attaching public metadata to transactions pour reference et tracking."
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
            "title": "Idempotency keys et replay protection",
            "content": "# Idempotency keys et replay protection\n\nPayment systems must handle network failures gracefully. Idempotency ensures that retrying a failed request produces the same outcome as the original, preventing duplicate charges et inconsistent state.\n\nIdempotency keys are unique identifiers generated by clients pour each payment intent. The server stores processed keys et their outcomes, returning cached results pour duplicate submissions. Keys should be: globally unique (UUID v4), client-generated, et persisted avec sufficient TTL to handle extended retry windows.\n\nKey generation strategies include: UUID v4 avec timestamp prefix, hash of payment parameters (amount, recipient, timestamp), or structured keys combining merchant ID et local sequence numbers. The key must be stable across retries but unique across distinct payments.\n\nReplay protection prevents malicious or accidental re-execution. Beyond idempotency, transactions should include: recent blockhash freshness (prevents old transaction replay), durable nonce pour offline signing scenarios, et amount/time bounds where applicable.\n\nError classification affects retry behavior. Network errors warrant retries avec exponential backoff. Validation errors (insufficient funds, invalid address) should fail fast without retry. Timeout errors require careful handling - the payment may have succeeded, so query status before retrying.\n\n## Checklist\n- Generate unique idempotency keys pour each payment intent\n- Store processed keys avec outcomes pour deduplication\n- Implement appropriate TTL based on retry windows\n- Use recent blockhash pour transaction freshness\n- Classify errors pour appropriate retry strategies\n\n## Red flags\n- Allowing duplicate payments from retries\n- Generating idempotency keys server-side only\n- Ignoring timeout ambiguity in status checking\n- Storing keys without expiration\n",
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
                    "note": "Create payment intent avec idempotency key"
                  },
                  {
                    "cmd": "POST /v1/payment-intents/pi_123/confirm",
                    "output": "{\"id\":\"pi_123\",\"status\":\"processing\"}",
                    "note": "Confirm triggers transaction building"
                  },
                  {
                    "cmd": "GET /v1/payment-intents/pi_123",
                    "output": "{\"id\":\"pi_123\",\"status\":\"succeeded\",\"signature\":\"abc123\"}",
                    "note": "Poll pour final status"
                  }
                ]
              }
            ]
          },
          "payments-v2-payment-intent": {
            "title": "Challenge: Create payment intent avec validation",
            "content": "# Challenge: Create payment intent avec validation\n\nImplement a payment intent creator avec full validation:\n\n- Validate recipient address format (base58, 32 bytes)\n- Validate amount (positive, within limits)\n- Generate deterministic idempotency key\n- Return structured payment intent object\n- Handle edge cases (zero amount, invalid address)\n\nYour implementation will be tested against various valid et invalid inputs.",
            "duration": "45 min",
            "hints": [
              "Use base58 alphabet to validate the recipient address format.",
              "Convert base58 to bytes et check the length equals 32.",
              "Generate an idempotency key if not provided in the input."
            ]
          },
          "payments-v2-tx-building": {
            "title": "Transaction building et key metadata",
            "content": "# Transaction building et key metadata\n\nBuilding payment transactions requires careful attention to instruction construction, compte metadata, et program interactions. The goal is creating valid, efficient transactions that minimize fees while ensuring correctness.\n\nInstruction construction follows a pattern: identify the program (System Program pour SOL transfers, Token Program pour SPL transfers), prepare compte metas avec correct writable/signer flags, serialize instruction data according to the program's layout, et compute the transaction message avec all required fields.\n\nCompte metadata is critical. Pour SOL transfers, you need: from (signer + writable), to (writable). Pour SPL transfers: token compte from (signer + writable), token compte to (writable), owner (signer), et potentially a delegate if using delegated transfer. Missing or incorrect flags cause runtime failures.\n\nFee optimization strategies include: batching multiple payments into one transaction (up to compute unit limits), using address lookup tables (ALTs) pour comptes referenced multiple times, et setting appropriate compute unit limits to avoid overpaying pour simple operations.\n\nTransaction validation before submission: verify all required signatures are present, check recent blockhash is fresh, estimate compute units if possible, et validate instruction data encoding matches the expected layout.\n\n## Checklist\n- Set correct writable/signer flags on all comptes\n- Use appropriate program pour transfer type (SOL vs SPL)\n- Validate instruction data encoding\n- Include recent blockhash pour freshness\n- Consider batching pour multiple payments\n\n## Red flags\n- Missing signer flags on fee payer\n- Incorrect writable flags on recipient comptes\n- Using wrong program ID pour token type\n- Stale blockhash causing transaction rejection\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "payments-v2-l4-tx-structure",
                "title": "Transaction Structure",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Transfer Instruction",
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
        "description": "Transaction building, webhook authenticity checks, et deterministic receipt generation avec clear error-state handling.",
        "lessons": {
          "payments-v2-transfer-tx": {
            "title": "Challenge: Build transfer transaction",
            "content": "# Challenge: Build transfer transaction\n\nImplement a transfer transaction builder:\n\n- Build SystemProgram.transfer pour SOL transfers\n- Build TokenProgram.transfer pour SPL transfers\n- Return instruction bundle avec correct key metadata\n- Include fee payer et blockhash\n- Support deterministic output pour tests",
            "duration": "50 min",
            "hints": [
              "SystemProgram.transfer uses instruction index 2 avec u64 lamports (little-endian).",
              "TokenProgram.transferChecked uses instruction index 12 avec u64 amount + u8 decimals.",
              "Key order matters: SOL transfer needs [from, to], SPL transfer needs [source, mint, dest, owner]."
            ]
          },
          "payments-v2-webhooks": {
            "title": "Webhook signing et verification",
            "content": "# Webhook signing et verification\n\nWebhooks enable asynchronous payment notifications. Securite requires cryptographic signing so recipients can verify webhook authenticity et detect tampering.\n\nWebhook signing uses HMAC-SHA256 avec a shared secret. The sender computes: signature = HMAC-SHA256(secret, payload). The signature is included in a header (e.g., X-Webhook-Signature). Recipients recompute the HMAC et compare, using constant-time comparison to prevent timing attacks.\n\nPayload canonicalization ensures consistent signing. JSON objects must be serialized avec: sorted keys (alphabetical), no extra whitespace, consistent number formatting, et UTF-8 encoding. Without canonicalization, {\"a\":1,\"b\":2} et {\"b\":2,\"a\":1} produce different signatures.\n\nIdempotency in webhooks prevents duplicate processing. Webhook payloads should include an idempotency key or event ID. Recipients store processed IDs et ignore duplicates. This handles retries from the sender et network-level duplicates.\n\nSecurite bonnes pratiques: rotate secrets periodically, use different secrets per environment (dev/staging/prod), include timestamps et reject old webhooks (e.g., >5 minutes), et verify IP allowlists where feasible. Never include sensitive data like private keys or full card numbers in webhooks.\n\n## Checklist\n- Sign webhooks avec HMAC-SHA256 et shared secret\n- Canonicalize JSON payloads avec sorted keys\n- Include event ID pour idempotency\n- Verify signatures avec constant-time comparison\n- Implement timestamp validation\n\n## Red flags\n- Unsigned webhooks trusting sender IP alone\n- Non-canonical JSON causing verification failures\n- Missing idempotency handling duplicate events\n- Including secrets or sensitive data in payload\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "payments-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "payments-v2-l6-q1",
                    "prompt": "Why is JSON canonicalization important pour webhooks?",
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
                    "prompt": "What algorithm is standard pour webhook signing?",
                    "options": [
                      "HMAC-SHA256",
                      "MD5",
                      "RSA-512"
                    ],
                    "answerIndex": 0,
                    "explanation": "HMAC-SHA256 provides strong securite et is widely supported across languages."
                  }
                ]
              }
            ]
          },
          "payments-v2-error-states": {
            "title": "Error state machine et receipt format",
            "content": "# Error state machine et receipt format\n\nPayment flows require well-defined state machines to handle the complexity of asynchronous confirmations, failures, et retries. Clear state transitions et receipt formats ensure reliable payment tracking.\n\nPayment states typically include: pending (intent created, not yet submitted), processing (transaction submitted, awaiting confirmation), succeeded (transaction confirmed, payment complete), failed (transaction failed or rejected), et cancelled (intent explicitly cancelled before submission). Each state has valid transitions et terminal states.\n\nState transition rules: pending can transition to processing, cancelled, or failed; processing can transition to succeeded or failed; succeeded et failed are terminal. Invalid transitions (e.g., succeeded → failed) indicate bugs or data corruption.\n\nReceipt format standardization enables interoperability. A payment receipt should include: payment intent ID, transaction signature (if submitted), amount et currency, recipient address, timestamp, status, et verification data (e.g., explorer link). Receipts should be JSON avec canonical ordering pour deterministic hashing.\n\nExplorer links provide transparency. Pour Solana, construct explorer URLs using: https://explorer.solana.com/tx/{signature}?cluster={network}. Include these in receipts et webhook payloads so users can verify transactions independently.\n\n## Checklist\n- Define clear payment states et valid transitions\n- Implement state machine validation\n- Generate standardized receipt JSON\n- Include explorer links pour verification\n- Handle all terminal states appropriately\n\n## Red flags\n- Ambiguous states without clear definitions\n- Missing terminal state handling\n- Non-deterministic receipt formats\n- No explorer links pour verification\n",
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
                    "note": "Transaction submitted, awaiting confirmation"
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
            "title": "Challenge: Verify webhook et produce receipt",
            "content": "# Challenge: Verify webhook et produce receipt\n\nImplement the final payment flow checkpoint:\n\n- Verify signed webhook signature (HMAC-SHA256)\n- Extract payment details from payload\n- Generate standardized receipt JSON\n- Include explorer link et verification data\n- Ensure deterministic, sorted output\n\nThis validates the complete payment flow from intent to receipt.",
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
    "description": "Master compressed NFT engineering on Solana: Merkle commitments, proof systems, collection modeling, et production securite checks.",
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
        "description": "Tree construction, leaf hashing, insertion mechanics, et the on-chain/off-chain commitment model behind compressed assets.",
        "lessons": {
          "cnft-v2-merkle-trees": {
            "title": "Merkle trees pour state compression",
            "content": "# Merkle trees pour state compression\n\nCompressed NFTs (cNFTs) on Solana use Merkle trees to dramatically reduce storage costs. Understanding Merkle trees is essential pour working avec compressed NFTs et building compression-aware applications.\n\nA Merkle tree is a binary hash tree where each leaf node contains a hash of data, et each non-leaf node contains the hash of its children. The root hash commits to the entire tree structure et all leaf data. This structure enables efficient proofs of inclusion without revealing the entire dataset.\n\nTree construction follows a bottom-up approach: hash each data element to create leaves, pair adjacent leaves et hash their concatenation to create parents, et repeat until a single root remains. Pour odd numbers of nodes, the last node is typically promoted to the next level or paired avec a zero hash depending on the implementation.\n\nSolana's cNFT implementation uses concurrent Merkle trees avec 16-bit depth (max 65,536 leaves). The tree state is stored on-chain as a small compte containing just the root hash et metadata. Actual leaf data (NFT metadata) is stored off-chain, typically via RPC providers or indexers.\n\nKey properties of Merkle trees: any leaf change affects the root, inclusion proofs require only log2(n) hashes, et the root serves as a cryptographic commitment to all data. These properties enable state compression while maintaining verifiability.\n\n## Pratique cNFT architecture rule\n\nTreat compressed NFT systems as two synchronized layers:\n1. on-chain commitment layer (tree root + update rules),\n2. off-chain data layer (metadata + indexing + proof serving).\n\nIf either layer is weakly validated, ownership et metadata trust can diverge.\n\n## Checklist\n- Understand binary hash tree construction\n- Know how leaf changes propagate to the root\n- Calculate proof size: log2(n) hashes pour n leaves\n- Recognize depth limits (16-bit = 65,536 max leaves)\n- Understand on-chain vs off-chain data split\n\n## Red flags\n- Treating Merkle roots as data storage (they're commitments)\n- Ignoring depth limits when planning collections\n- Storing sensitive data assuming it's \"hidden\" in the tree\n- Not validating proofs against the current root\n",
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
                      "The entire tree structure et all leaf data",
                      "Only the first et last leaf",
                      "The tree depth only"
                    ],
                    "answerIndex": 0,
                    "explanation": "The root is a cryptographic commitment to all leaves et their positions in the tree."
                  },
                  {
                    "id": "cnft-v2-l1-q2",
                    "prompt": "How many hash siblings are needed to prove inclusion in a tree avec 65,536 leaves?",
                    "options": [
                      "16",
                      "256",
                      "65536"
                    ],
                    "answerIndex": 0,
                    "explanation": "Proof size is log2(65536) = 16, making verification efficient even pour large collections."
                  }
                ]
              }
            ]
          },
          "cnft-v2-leaf-hashing": {
            "title": "Leaf hashing conventions et metadata",
            "content": "# Leaf hashing conventions et metadata\n\nLeaf hashing determines how NFT metadata is committed to the Merkle tree. Understanding these conventions ensures compatibility avec compression standards et proper proof generation.\n\nLeaf structure pour cNFTs includes: asset ID (derived from tree address et leaf index), owner public key, delegate (optional), nonce pour uniqueness, et metadata hash. The exact encoding follows the Metaplex Bubblegum specification, using deterministic serialization pour consistent hashing.\n\nHashing algorithm uses Keccak-256 pour Ethereum compatibility, avec domain separation via prefixed constants. The leaf hash is computed as: hash(prefix || asset_data) where prefix prevents collision avec other hash usages. Multiple prefix values exist pour different operation types (mint, transfer, burn).\n\nMetadata handling stores the full NFT metadata (name, symbol, uri, creators, royalties) off-chain. Only a hash of the metadata is stored in the leaf. This enables large metadata without on-chain storage costs while maintaining integrity via the hash commitment.\n\nCreator verification uses a separate signing process. Creators sign the asset ID to verify authenticity. These signatures are stored alongside proofs but not in the Merkle tree itself, allowing flexible verification without tree updates.\n\n## Checklist\n- Understand leaf structure components\n- Use correct hashing algorithm (Keccak-256)\n- Include proper domain separation prefixes\n- Store metadata off-chain avec hash commitment\n- Handle creator signatures separately from tree\n\n## Red flags\n- Using wrong hashing algorithm\n- Missing domain separation in leaf hashes\n- Storing full metadata on-chain in compressed NFTs\n- Ignoring creator verification requirements\n",
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
            "content": "# Challenge: Implement Merkle tree insert + root updates\n\nBuild a Merkle tree implementation avec insertions:\n\n- Insert leaves et compute new root\n- Update parent hashes up the tree\n- Handle tree growth et depth limits\n- Return deterministic root updates\n\nTest cases will verify correct root evolution after multiple insertions.",
            "duration": "50 min",
            "hints": [
              "Start by validating the leaf index is within bounds.",
              "At each level, find the sibling node (left or right of current).",
              "Hash the current node avec its sibling to get the parent hash.",
              "Traverse up to the root, collecting all updated node hashes.",
              "Use deterministic ordering: left hash comes before right hash."
            ]
          },
          "cnft-v2-proof-generation": {
            "title": "Proof generation et path computation",
            "content": "# Proof generation et path computation\n\nMerkle proofs enable verification of leaf inclusion without accessing the entire tree. Understanding proof generation is essential pour working avec compressed NFTs et building verification systems.\n\nA Merkle proof consists of: the leaf data (or its hash), a list of sibling hashes (one per level), et the leaf index (determining the path). The verifier recomputes the root by hashing the leaf avec siblings in the correct order, comparing against the expected root.\n\nProof generation requires traversing from leaf to root. At each level, record the sibling hash (the other child of the parent). The leaf index determines whether the current hash goes left or right in each concatenation. Pour index i at level n, the position is determined by the nth bit of i.\n\nProof verification recomputes the root: start avec the leaf hash, pour each sibling in the proof list, concatenate current hash avec sibling (order depends on leaf index bit), hash the result, et compare final result avec expected root. Equality proves inclusion.\n\nProof size efficiency: pour a tree avec n leaves, proofs contain log2(n) hashes. This is dramatically smaller than the full tree (n hashes), enabling scalable verification. A 65,536 leaf tree requires only 16 hashes per proof.\n\n## Checklist\n- Collect sibling hashes at each tree level\n- Use leaf index bits to determine concatenation order\n- Verify proofs by recomputing root hash\n- Handle edge cases (empty tree, single leaf)\n- Optimize proof size pour network transmission\n\n## Red flags\n- Incorrect concatenation order in verification\n- Using wrong sibling hash at any level\n- Not validating proof length matches tree depth\n- Trusting proofs without root comparison\n",
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
                    "prompt": "How many hashes are in a proof pour a tree avec 1,024 leaves?",
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
        "title": "Proof System & Securite",
        "description": "Proof generation, verification, collection integrity, et securite hardening against replay et metadata spoofing.",
        "lessons": {
          "cnft-v2-proof-verification": {
            "title": "Challenge: Implement proof generation + verifier",
            "content": "# Challenge: Implement proof generation + verifier\n\nBuild a complete proof system:\n\n- Generate proofs from a Merkle tree et leaf index\n- Verify proofs against a root hash\n- Handle invalid proofs (wrong siblings, wrong index)\n- Return deterministic boolean results\n\nTests will verify both successful proofs et rejection of invalid attempts.",
            "duration": "55 min",
            "hints": [
              "To generate a proof, collect the sibling hash at each level from leaf to root.",
              "The sibling is at index+1 if current is left, index-1 if current is right.",
              "To verify, start avec the leaf hash et combine avec each proof element.",
              "Use the same ordering (left || right) when combining hashes.",
              "The proof is valid if the recomputed root matches the stored root."
            ]
          },
          "cnft-v2-collection-minting": {
            "title": "Collection mints et metadata simulation",
            "content": "# Collection mints et metadata simulation\n\nCompressed NFT collections use a collection mint as the parent NFT, enabling grouping et verification of related assets. Understanding this hierarchy is essential pour building collection-aware applications.\n\nCollection structure includes: a standard SPL NFT as the collection mint, cNFTs referencing the collection in their metadata, et the Merkle tree containing all cNFT leaves. The collection mint provides on-chain provenance while cNFTs provide scalable asset issuance.\n\nMetadata simulation pour tests allows development without actual on-chain transactions. Simulated metadata includes: name, symbol, uri (typically pointing to off-chain JSON), seller fee basis points (royalties), creators array avec shares, et collection reference. This data structure matches on-chain format pour seamless migration.\n\nRoyalty enforcement through Metaplex's token metadata standard specifies seller fees as basis points (e.g., 500 = 5%). Creators array defines fee distribution avec verified flags. cNFTs inherit these settings from their metadata, enforced during transfers via the Bubblegum program.\n\nAttacks on compressed NFTs include: invalid proofs (claiming non-existent NFTs), index manipulation (using wrong leaf index), metadata spoofing (fake off-chain data), et collection impersonation (fake collection mints). Mitigations include proof verification, metadata hash validation, et collection mint verification.\n\n## Checklist\n- Understand collection mint hierarchy\n- Simulate metadata pour tests\n- Implement royalty calculations\n- Verify collection membership\n- Handle metadata hash verification\n\n## Red flags\n- Accepting NFTs without collection verification\n- Ignoring royalty settings in transfers\n- Trusting off-chain metadata without hash validation\n- Not validating proofs pour ownership claims\n",
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
                    "note": "Parent NFT pour the collection"
                  },
                  {
                    "cmd": "Merkle Tree",
                    "output": "Contains cNFT leaf hashes",
                    "note": "Scalable storage pour assets"
                  },
                  {
                    "cmd": "Off-chain Metadata",
                    "output": "IPFS/Arweave JSON files",
                    "note": "Full metadata avec hash commitment"
                  }
                ]
              }
            ]
          },
          "cnft-v2-attack-surface": {
            "title": "Attack surface: invalid proofs et replay",
            "content": "# Attack surface: invalid proofs et replay\n\nCompressed NFTs introduce unique securite considerations. Understanding attack vectors et mitigations is critical pour building secure compression-aware applications.\n\nInvalid proof attacks attempt to verify non-existent NFTs. An attacker provides a fabricated leaf hash et fake sibling hashes hoping to produce a valid-looking verification. Mitigation: always verify against the current root from a trusted source (RPC, on-chain compte), et validate proof structure (correct depth, valid hash lengths).\n\nIndex manipulation exploits use valid proofs but wrong indices. Since leaf indices determine proof path, changing the index produces a different root computation. Mitigation: bind asset IDs to specific indices et validate index-asset correspondence during verification.\n\nReplay attacks re-use old proofs after tree updates. When leaves are added or modified, the root changes et old proofs become invalid. However, if an application caches roots, it might accept stale proofs. Mitigation: always use current root, implement proof timestamps where applicable.\n\nMetadata attacks substitute fake off-chain data. Since metadata is stored off-chain avec only a hash on-chain, attackers might serve altered metadata files. Mitigation: verify metadata hashes against leaf commitments, use content-addressed storage (IPFS), et validate creator signatures.\n\nCollection spoofing creates fake collections mimicking legitimate ones. Attackers mint similar-looking NFTs avec fake collection references. Mitigation: verify collection mint addresses against known good lists, check collection verification status, et validate authority signatures.\n\n## Checklist\n- Verify proofs against current root\n- Validate leaf index matches asset ID\n- Implement replay protection pour proofs\n- Hash-verify off-chain metadata\n- Verify collection mint authenticity\n\n## Red flags\n- Accepting cached/stale roots pour verification\n- Ignoring leaf index validation\n- Trusting off-chain metadata without verification\n- Not checking collection verification status\n",
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
            "content": "# Checkpoint: Simulate mint + verify ownership proof\n\nComplete the compression lab checkpoint:\n\n- Simulate minting a cNFT (insert leaf, update root)\n- Generate ownership proof pour the minted NFT\n- Verify the proof against current root\n- Output stable audit trace avec sorted keys\n- Detect et report invalid proof attempts\n\nThis validates your complete Merkle tree implementation pour compressed NFTs.",
            "duration": "60 min",
            "hints": [
              "Validate the mint request has all required fields (leafIndex, nftId, owner).",
              "Create a deterministic leaf hash by combining nftId et owner.",
              "Insert the leaf by computing hashes up to the root, collecting sibling hashes as proof.",
              "Build an audit trace that documents the operation, inputs, et verification steps.",
              "Include previous et new root hashes in the audit pour transparency."
            ]
          }
        }
      }
    }
  },
  "solana-governance-multisig": {
    "title": "Gouvernance & Multisig Treasury Ops",
    "description": "Build production-ready DAO gouvernance et multisig treasury systems avec deterministic vote accounting, timelock safety, et secure execution controls.",
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
        "title": "DAO Gouvernance",
        "description": "Proposal lifecycle, deterministic voting mechanics, quorum policy, et timelock safety pour credible DAO gouvernance.",
        "lessons": {
          "governance-v2-dao-model": {
            "title": "DAO model: proposals, voting, et execution",
            "content": "# DAO model: proposals, voting, et execution\n\nDecentralized gouvernance on Solana follows a proposal-based model where token holders vote on changes et the DAO treasury executes approved decisions. Understanding this flow is essential pour building et participating in on-chain organizations.\n\nThe gouvernance lifecycle has four stages: proposal creation (anyone avec sufficient stake can propose), voting period (token holders vote pour/against/abstain), queueing (successful proposals enter a timelock), et execution (the proposal's instructions are executed). Each stage has specific requirements et time constraints.\n\nProposal creation requires a minimum token deposit to prevent spam. The proposer submits: title, description link, et executable instructions (typically base64 serialized). Deposits are returned if the proposal passes, forfeited if it fails (depending on DAO configuration).\n\nVoting power is typically determined by token balance at a specific snapshot block. Some DAOs use vote escrow (veToken) models where locking tokens pour longer periods multiplies voting power. Quorum requirements ensure sufficient participation - a proposal needs both majority approval et minimum participation to pass.\n\nExecution safety involves timelocks between approval et execution. This delay (often 1-7 days) allows users to exit if they disagree avec the outcome. Emergency powers may exist pour critical fixes but should require higher thresholds.\n\n## Gouvernance reliability rule\n\nA proposal system is only credible if outcomes are reproducible from public inputs. That means deterministic vote math, explicit snapshot rules, clear timelock transitions, et auditable execution traces pour treasury effects.\n\n## Checklist\n- Understand the four-stage gouvernance lifecycle\n- Know proposal deposit et spam prevention mechanisms\n- Calculate voting power et quorum requirements\n- Implement timelock safety delays\n- Plan pour emergency execution paths\n\n## Red flags\n- Allowing proposal creation without deposits\n- Missing quorum requirements pour participation\n- Zero timelock on sensitive operations\n- Unclear vote counting methodologies\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "governance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "governance-v2-l1-q1",
                    "prompt": "What is the purpose of a timelock in gouvernance?",
                    "options": [
                      "Allow users time to exit if they disagree avec outcomes",
                      "Speed up transaction processing",
                      "Reduce gas costs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Timelocks provide a safety window pour users to react before changes take effect."
                  },
                  {
                    "id": "governance-v2-l1-q2",
                    "prompt": "What determines voting power in most DAOs?",
                    "options": [
                      "Token balance at snapshot block",
                      "Number of transactions submitted",
                      "Compte age"
                    ],
                    "answerIndex": 0,
                    "explanation": "Voting power is typically proportional to token holdings at a specific snapshot time."
                  }
                ]
              }
            ]
          },
          "governance-v2-quorum-math": {
            "title": "Quorum math et vote weight calculation",
            "content": "# Quorum math et vote weight calculation\n\nAccurate vote counting is critical pour legitimate gouvernance outcomes. Understanding quorum requirements, vote weight calculation, et edge cases ensures fair decision-making.\n\nQuorum defines minimum participation pour a valid vote. Common formulas include: absolute token amount (e.g., 4% of total supply must vote), relative to circulating supply, or dynamic based on recent participation. Quorum prevents small groups from making unilateral decisions.\n\nVote weight calculation considers: token balance at snapshot block, lockup duration multipliers (veToken model), delegation relationships, et abstention handling. Abstentions typically count toward quorum but not toward approval ratio.\n\nApproval thresholds vary by proposal type. Simple majority (>50%) is standard pour routine matters. Supermajority (e.g., 2/3) may be required pour constitutional changes. Some DAOs use quadratic voting to reduce whale influence, though this has sybil resistance challenges.\n\nEdge cases include: ties (usually fail), late vote changes (often blocked after deadline), vote delegation revocation timing, et quorum manipulation (e.g., flash loan attacks prevented by snapshot blocks).\n\n## Checklist\n- Define clear quorum formulas et minimums\n- Calculate vote weights avec snapshot blocks\n- Handle abstentions appropriately\n- Set appropriate approval thresholds by proposal type\n- Protect against manipulation attacks\n\n## Red flags\n- No quorum requirements\n- Vote weight based on current balance (flash loan risk)\n- Unclear tie-breaking rules\n- Changing rules mid-proposal\n",
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
                      "label": "Voter Compte",
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
            "title": "Timelock states et execution scheduling",
            "content": "# Timelock states et execution scheduling\n\nTimelocks provide a critical safety layer between gouvernance approval et execution. Understanding timelock states et transitions ensures reliable proposal execution.\n\nTimelock states include: pending (proposal passed, waiting pour delay), ready (delay elapsed, can be executed), executed (instructions processed), cancelled (withdrawn by proposer or guardian), et expired (execution window passed). Each state has valid transitions et authorized actors.\n\nDelay configuration balances securite avec responsiveness. Too short (hours) allows insufficient reaction time. Too long (weeks) delays urgent fixes. Common ranges are 1-7 days, avec shorter delays pour routine matters et longer pour significant changes.\n\nExecution windows prevent indefinite pending states. After the timelock delay, proposals typically have a limited window (e.g., 7-14 days) to be executed. Expired proposals must be re-proposed et re-voted.\n\nCancellations add flexibility. Proposers may withdraw proposals before voting ends. Guardians (if configured) may cancel malicious proposals. Cancellation typically returns deposits unless abuse is detected.\n\n## Checklist\n- Define clear timelock state machine\n- Set appropriate delays by proposal type\n- Implement execution window limits\n- Authorize cancellation actors\n- Handle state transitions atomically\n\n## Red flags\n- No execution window limits\n- Missing cancellation mechanisms\n- State transitions without authorization checks\n- Indefinite pending states\n",
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
                    "output": "Instructions processed",
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
              "Sum up weights pour each vote choice (pour, against, abstain).",
              "Check if totalVoteWeight >= quorumThreshold to determine quorumMet.",
              "Calculate support percentage as forWeight / (forWeight + againstWeight) when there are non-abstain votes.",
              "Proposal passes only if quorum is met ET support percentage >= supportThreshold."
            ]
          }
        }
      },
      "governance-v2-multisig": {
        "title": "Multisig Treasury",
        "description": "Multisig transaction construction, approval controls, replay defenses, et secure treasury execution patterns.",
        "lessons": {
          "governance-v2-multisig": {
            "title": "Multisig transaction building et approvals",
            "content": "# Multisig transaction building et approvals\n\nMultisig portefeuilles provide collective control over treasury funds. Understanding multisig construction, approval flows, et securite patterns is essential pour treasury operations.\n\nMultisig structure defines: signers (public keys that can approve), threshold (minimum signatures required), et instructions (operations to execute). Common configurations include 2-of-3 (two approvals from three signers), 3-of-5, et custom arrangements.\n\nTransaction lifecycle: propose (one signer creates transaction avec instructions), approve (other signers review et approve), et execute (once threshold is met, anyone can execute). Each stage is recorded on-chain pour transparency.\n\nApproval tracking maintains state per signer per transaction. Signers can approve, reject, or cancel their approval. Double-signing is prevented by tracking which signers have already approved. Rejections may block transactions or simply be recorded.\n\nSecurite considerations: signer key management (hardware portefeuilles recommended), threshold selection (balance securite vs availability), timelocks pour large transfers, et emergency recovery paths. Lost signer keys should not freeze treasury funds permanently.\n\n## Checklist\n- Define signer set et threshold\n- Track per-signer approval state\n- Enforce threshold before execution\n- Implement approval/revocation mechanics\n- Plan pour lost key scenarios\n\n## Red flags\n- Single signer controlling treasury\n- No approval tracking on-chain\n- Threshold equal to signer count (no redundancy)\n- Missing rejection/cancellation mechanisms\n",
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
                      "2 signers total avec 3 keys each",
                      "2 minute timeout avec 3 retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "2-of-3 means any 2 of the 3 authorized signers must approve a transaction."
                  },
                  {
                    "id": "governance-v2-l5-q2",
                    "prompt": "Why track approvals on-chain?",
                    "options": [
                      "Transparency et enforceability",
                      "Faster execution",
                      "Lower fees"
                    ],
                    "answerIndex": 0,
                    "explanation": "On-chain tracking provides transparency et ensures threshold enforcement by the protocol."
                  }
                ]
              }
            ]
          },
          "governance-v2-multisig-builder": {
            "title": "Challenge: Implement multisig tx builder + approval rules",
            "content": "# Challenge: Implement multisig tx builder + approval rules\n\nBuild a multisig transaction system:\n\n- Create transactions avec instructions\n- Record signer approvals\n- Enforce threshold requirements\n- Handle approval revocation\n- Generate deterministic transaction state\n\nTests will verify threshold enforcement et approval tracking.",
            "duration": "55 min",
            "hints": [
              "Initialize signer statuses as 'pending' pour all signers.",
              "Process actions in order - each action updates the signer's status.",
              "Track the cumulative approved weight to compare against threshold.",
              "A proposal is 'approved' when approvedWeight >= threshold.",
              "A proposal is 'rejected' when no pending signers remain but threshold is not met."
            ]
          },
          "governance-v2-safe-defaults": {
            "title": "Safe defaults: owner checks et replay guards",
            "content": "# Safe defaults: owner checks et replay guards\n\nGouvernance et multisig systems require robust securite defaults. Understanding common vulnerabilities et their mitigations protects treasury funds.\n\nOwner checks validate that transactions only affect authorized comptes. Pour treasury operations, verify: the treasury compte is owned by the expected program, the signer set matches the multisig configuration, et instructions target allowed programs. Missing owner checks enable compte substitution attacks.\n\nReplay guards prevent the same approved transaction from being executed multiple times. Without replay protection, an observer could resubmit an executed transaction to drain funds. Guards include: unique transaction nonces, executed flags in transaction state, et signature uniqueness checks.\n\nUpgrade safety considers how gouvernance changes affect existing proposals. If the multisig configuration changes, pending proposals should use the old configuration while new proposals use the new one. Atomic configuration changes prevent partial updates.\n\nEmergency stops provide circuit breakers. Guardian roles can pause operations during suspected attacks. Time delays on critical changes allow review periods. These safety valves should be tested regularly.\n\n## Checklist\n- Validate compte ownership before operations\n- Implement replay protection (nonces or flags)\n- Handle configuration changes safely\n- Add emergency pause mechanisms\n- Test securite controls regularly\n\n## Red flags\n- No owner verification on treasury comptes\n- Missing replay protection\n- Immediate execution of critical changes\n- No emergency stop capability\n",
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
                      "Re-executing an already-executed transaction",
                      "Sending duplicate approval requests",
                      "Copying transaction bytecode"
                    ],
                    "answerIndex": 0,
                    "explanation": "Replay attacks re-submit previously executed transactions to drain funds."
                  },
                  {
                    "id": "governance-v2-l7-q2",
                    "prompt": "Why verify compte ownership?",
                    "options": [
                      "Prevent compte substitution attacks",
                      "Reduce transaction size",
                      "Improve UI rendering"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ownership checks ensure operations target legitimate comptes, not attacker substitutes."
                  }
                ]
              }
            ]
          },
          "governance-v2-treasury-execution": {
            "title": "Challenge: Execute proposal et produce treasury diff",
            "content": "# Challenge: Execute proposal et produce treasury diff\n\nComplete the gouvernance simulator checkpoint:\n\n- Execute approved proposals avec timelock validation\n- Apply treasury state changes atomically\n- Generate execution trace avec before/after diffs\n- Handle edge cases (expired, cancelled, insufficient funds)\n- Output stable, deterministic audit log\n\nThis validates your complete gouvernance/multisig implementation.",
            "duration": "55 min",
            "hints": [
              "First validate the proposal status is 'approved'.",
              "Check if currentTimestamp - approvedAt >= timelockDuration pour timelock validation.",
              "Sum all transfer amounts et compare against treasury balance.",
              "Return canExecute: false avec appropriate error if any validation fails.",
              "Generate state changes et execution trace entries pour each successful step."
            ]
          }
        }
      }
    }
  },
  "solana-performance": {
    "title": "Solana Performance & Compute Optimization",
    "description": "Master Solana performance engineering avec measurable optimization workflows: compute budgets, data layouts, encoding efficiency, et deterministic cost modeling.",
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
        "title": "Performance Foundations",
        "description": "Compute model, compte/data layout decisions, et deterministic cost estimation pour transaction-level performance reasoning.",
        "lessons": {
          "performance-v2-compute-model": {
            "title": "Compute model: budgets, costs, et limits",
            "content": "# Compute model: budgets, costs, et limits\n\nSolana's compute model enforces deterministic execution limits through compute budgets. Understanding this model is essential pour building efficient programs that stay within limits while maximizing utility.\n\nCompute units (CUs) measure execution cost. Every operation consumes CUs: instruction execution, syscall usage, memory access, et logging. The default transaction limit is 200,000 CUs (1.4 million avec prioritization), et each compte has a 10MB max size limit.\n\nCompute budget instructions allow transactions to request specific limits et set priority fees. The ComputeBudgetProgram provides: setComputeUnitLimit (override default), setComputeUnitPrice (set priority fee per CU in micro-lamports). Priority fees increase transaction inclusion probability during congestion.\n\nCost categories include: fixed costs (signature verification, compte loading), variable costs (instruction execution, CPI calls), et memory costs (compte data access size). Understanding these categories helps optimize the right areas.\n\nMetering happens during execution. If a transaction exceeds its compute budget, execution halts et the transaction fails avec an error. Failed transactions still pay fees pour consumed CUs, making optimization economically important.\n\n## Pratique optimization loop\n\nUse a repeatable loop:\n1. profile real CU usage,\n2. identify top cost drivers (data layout, CPI count, logging),\n3. optimize one hotspot,\n4. re-measure et keep only proven wins.\n\nThis avoids performance folklore et keeps code quality intact.\n\n## Checklist\n- Understand compute unit consumption categories\n- Use ComputeBudgetProgram pour specific limits\n- Set priority fees during congestion\n- Monitor CU usage during development\n- Handle compute limit failures gracefully\n\n## Red flags\n- Ignoring compute limits in program conception\n- Using default limits unnecessarily high\n- Not tests avec realistic data sizes\n- Missing priority fee strategies pour important transactions\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "performance-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "performance-v2-l1-q1",
                    "prompt": "What is the default compute unit limit per transaction?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "Unlimited"
                    ],
                    "answerIndex": 0,
                    "explanation": "The default limit is 200,000 CUs, extendable to 1.4M avec ComputeBudgetProgram."
                  },
                  {
                    "id": "performance-v2-l1-q2",
                    "prompt": "What happens when a transaction exceeds its compute budget?",
                    "options": [
                      "Execution halts et the transaction fails",
                      "It continues avec reduced priority",
                      "The network automatically extends the limit"
                    ],
                    "answerIndex": 0,
                    "explanation": "Exceeding the compute budget causes immediate transaction failure."
                  }
                ]
              }
            ]
          },
          "performance-v2-account-layout": {
            "title": "Compte layout conception et serialization cost",
            "content": "# Compte layout conception et serialization cost\n\nCompte data layout significantly impacts compute costs. Well-designed layouts minimize serialization overhead et reduce compte access costs.\n\nSerialization formats affect cost. Borsh is the standard pour Solana, offering compact binary encoding. Manual serialization can be more efficient pour simple structures but increases bug risk. Avoid JSON or other text formats on-chain due to size et parsing cost.\n\nCompte size impacts costs linearly. Loading a 10KB compte costs more than loading 1KB. Rent exemption requires more lamports pour larger comptes. Conception layouts to minimize size: use fixed-size arrays instead of Vecs where possible, pack booleans into bitflags, et use appropriate integer sizes (u8/u16/u32/u64).\n\nData structure alignment affects both size et access patterns. Group related fields together pour cache efficiency. Place frequently accessed fields at the beginning of the struct. Consider zero-copy deserialization pour read-heavy operations.\n\nVersioning enables layout upgrades. Include a version byte at the start of compte data. Migration logic can then handle different versions during deserialization. Plan pour growth by reserving padding bytes in initial layouts.\n\n## Checklist\n- Use Borsh pour standard serialization\n- Minimize compte data size\n- Use appropriate integer sizes\n- Plan pour versioning et upgrades\n- Consider zero-copy pour read-heavy paths\n\n## Red flags\n- Using JSON pour on-chain data\n- Oversized Vec collections\n- No versioning pour upgrade paths\n- Unnecessary large integer types\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "explorer",
                "id": "performance-v2-l2-layout",
                "title": "Compte Layout",
                "explorer": "AccountExplorer",
                "props": {
                  "samples": [
                    {
                      "label": "Optimized Compte",
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
            "content": "# Challenge: Implement estimateCost(op) model\n\nBuild a compute cost estimation system:\n\n- Model costs pour different operation types\n- Compte pour instruction complexity\n- Include memory access costs\n- Return baseline measurements\n- Handle edge cases (empty operations, large data)\n\nYour estimator will be validated against known operation costs.",
            "duration": "50 min",
            "hints": [
              "Use 5000 as the base compute unit cost per transaction.",
              "Each compte accessed adds 500 compute units.",
              "Each byte of data adds 10 compute units.",
              "Total = base + (comptes × 500) + (bytes × 10)."
            ]
          },
          "performance-v2-instruction-data": {
            "title": "Instruction data size et encoding optimization",
            "content": "# Instruction data size et encoding optimization\n\nInstruction data size directly impacts transaction cost et throughput. Optimizing encoding reduces fees et increases the operations possible within compute limits.\n\nCompact encoding uses minimal bytes to represent data. Use discriminants (u8) to identify instruction types. Use variable-length encoding (ULEB128) pour sizes. Pack multiple boolean flags into a single u8 using bit manipulation. Avoid unnecessary padding.\n\nCompte deduplication reduces transaction size. If an compte appears in multiple instructions, include it once in the compte list et reference by index. This is especially important pour CPI-heavy transactions.\n\nBatching combines multiple operations into one transaction. Instead of N transactions avec 1 instruction each, use 1 transaction avec N instructions. Batching amortizes signature verification et compte loading costs across operations.\n\nRight-sizing vectors prevents overallocation. Use Vec::with_capacity when the size is known. Avoid unnecessary clones that increase heap usage. Consider stack-allocated arrays pour small, fixed-size data.\n\n## Checklist\n- Use compact discriminants pour instruction types\n- Pack boolean flags into bitfields\n- Deduplicate comptes across instructions\n- Batch operations when possible\n- Right-size collections to avoid waste\n\n## Red flags\n- Using full u32 pour small discriminants\n- Separate booleans instead of bitflags\n- Duplicate comptes in transaction lists\n- Unnecessary data cloning\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "performance-v2-l4-encoding",
                "title": "Encoding Example",
                "steps": [
                  {
                    "cmd": "Before optimization",
                    "output": "200 bytes, 5 comptes",
                    "note": "Separate bools, duplicate comptes"
                  },
                  {
                    "cmd": "After optimization",
                    "output": "120 bytes, 3 comptes",
                    "note": "Bitflags, deduplicated comptes"
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
        "description": "Layout optimization, compute budget tuning, et before/after performance analysis avec correctness safeguards.",
        "lessons": {
          "performance-v2-optimized-layout": {
            "title": "Challenge: Implement optimized layout/codec",
            "content": "# Challenge: Implement optimized layout/codec\n\nOptimize an compte data layout while preserving semantics:\n\n- Reduce data size through compact encoding\n- Maintain all original functionality\n- Preserve backward compatibility where possible\n- Pass regression tests\n- Measure et report size reduction\n\nYour optimized layout should be smaller but functionally equivalent.",
            "duration": "55 min",
            "hints": [
              "Sort fields by size (largest first) to minimize padding gaps.",
              "Consider if u64 fields can be reduced to u32 based on maxValue.",
              "Boolean flags can be packed into a single byte as bit flags.",
              "Calculate bytes saved as originalSize - optimizedSize."
            ]
          },
          "performance-v2-compute-budget": {
            "title": "Compute budget instruction bases",
            "content": "# Compute budget instruction bases\n\nCompute budget instructions give developers control over resource allocation et transaction prioritization. Understanding these tools enables precise optimization.\n\nsetComputeUnitLimit requests a specific CU budget. The default is 200,000, but you can request up to 1,400,000. Requesting more than needed wastes fees since you pay pour the limit, not actual usage. Requesting too little causes failures.\n\nsetComputeUnitPrice sets a priority fee in micro-lamports per CU. During congestion, transactions avec higher priority fees are more likely to be included. Priority fees are additional to base fees et go to validateurs.\n\nRequesting compute units involves tradeoffs. Higher limits enable more complex operations but cost more. Priority fees increase inclusion probability but raise costs. Profile your transactions to set appropriate limits.\n\nHeap size can also be configured. The default heap is 32KB, extendable to 256KB avec compute budget instructions. Large heap enables complex data structures but increases CU consumption.\n\n## Checklist\n- Profile transactions to determine actual CU usage\n- Set appropriate compute unit limits\n- Use priority fees during congestion\n- Consider heap size pour data-heavy operations\n- Monitor cost vs inclusion probability tradeoffs\n\n## Red flags\n- Always using maximum compute unit limits\n- Not setting priority fees during congestion\n- Ignoring heap size constraints\n- Not profiling before optimization\n",
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
                      "Set priority fee pour transaction inclusion",
                      "Set the maximum transaction size",
                      "Enable additional program features"
                    ],
                    "answerIndex": 0,
                    "explanation": "Priority fees increase the likelihood of transaction inclusion during network congestion."
                  },
                  {
                    "id": "performance-v2-l6-q2",
                    "prompt": "Why request specific compute unit limits?",
                    "options": [
                      "Pay only pour what you need et prevent waste",
                      "Increase transaction speed",
                      "Enable more compte access"
                    ],
                    "answerIndex": 0,
                    "explanation": "Specific limits optimize costs - you pay pour the limit requested, not actual usage."
                  }
                ]
              }
            ]
          },
          "performance-v2-micro-optimizations": {
            "title": "Micro-optimizations et tradeoffs",
            "content": "# Micro-optimizations et tradeoffs\n\nPerformance optimization involves balancing competing concerns. Understanding tradeoffs helps make informed decisions about when et what to optimize.\n\nReadability vs performance is a constant tension. Highly optimized code often sacrifices clarity. Optimize hot paths (frequently executed code) aggressively. Keep cold paths (rarely executed) readable et maintainable.\n\nSpace vs time tradeoffs appear frequently. Pre-computing values trades memory pour speed. Compressing data trades CPU pour storage. Choose based on which resource is more constrained pour your use case.\n\nMaintainability vs optimization matters pour long-term projects. Aggressive optimizations can introduce bugs et make updates difficult. Document why optimizations exist et measure their impact.\n\nPremature optimization is a common trap. Profile before optimizing to identify actual bottlenecks. Theoretical optimizations may not match real-world behavior. Focus on algorithmic improvements before micro-optimizations.\n\nSecurite must never be sacrificed pour performance. Bounds checking, ownership validation, et arithmetic safety are non-negotiable. Optimize around securite, not through it.\n\n## Checklist\n- Profile before optimizing\n- Focus on hot paths\n- Document optimization decisions\n- Balance readability et performance\n- Never sacrifice securite pour speed\n\n## Red flags\n- Optimizing without profiling\n- Sacrificing securite pour performance\n- Unreadable code without documentation\n- Optimizing cold paths unnecessarily\n",
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
                      "Optimizing before deploiement",
                      "Small performance improvements"
                    ],
                    "answerIndex": 0,
                    "explanation": "Premature optimization wastes effort on theoretical rather than measured bottlenecks."
                  },
                  {
                    "id": "performance-v2-l7-q2",
                    "prompt": "What should never be sacrificed pour performance?",
                    "options": [
                      "Securite",
                      "Code comments",
                      "Variable names"
                    ],
                    "answerIndex": 0,
                    "explanation": "Securite validations must remain regardless of performance optimizations."
                  }
                ]
              }
            ]
          },
          "performance-v2-perf-checkpoint": {
            "title": "Checkpoint: Compare before/after + output perf report",
            "content": "# Checkpoint: Compare before/after + output perf report\n\nComplete the optimization lab checkpoint:\n\n- Measure baseline performance metrics\n- Apply optimization techniques\n- Verify correctness is preserved\n- Generate performance comparison report\n- Output stable JSON avec sorted keys\n\nThis validates your ability to optimize while maintaining correctness.",
            "duration": "55 min",
            "hints": [
              "Compute savings by subtracting 'after' from 'before' metrics.",
              "Use approximate conversion: 1 SOL = $20, 1 SOL = 1,000,000,000 lamports.",
              "Count only optimizations where improved=true pour totalImprovements.",
              "Include cours name as 'solana-performance' et version as 'v2'."
            ]
          }
        }
      }
    }
  },
  "defi-swap-aggregator": {
    "title": "DeFi Swap Aggregation",
    "description": "Master production swap aggregation on Solana: deterministic quote parsing, route optimization tradeoffs, slippage safety, et reliability-aware execution.",
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
        "description": "Token swap mechanics, slippage protection, route composition, et deterministic swap plan construction avec transparent tradeoffs.",
        "lessons": {
          "swap-v2-mental-model": {
            "title": "Swap modele mental: mints, ATAs, decimals, et routes",
            "content": "# Swap modele mental: mints, ATAs, decimals, et routes\n\nToken swaps on Solana follow a fundamentally different model than centralized exchanges. Understanding the building blocks — mints, associated token comptes (ATAs), decimal precision, et route composition — is essential before writing any swap code.\n\nEvery SPL token on Solana is defined by a mint compte. The mint specifies the token's total supply, decimals (0–9), et authority. When you swap \"SOL pour USDC,\" you are actually swapping wrapped SOL (mint `So11111111111111111111111111111111111111112`) pour USDC (mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`). Native SOL must be wrapped into an SPL token before any program can manipulate it as a standard token.\n\nAssociated Token Comptes (ATAs) are deterministic addresses derived from a portefeuille et a mint using the Associated Token Compte program. Pour every token a portefeuille holds, there must be an ATA. If the recipient does not have an ATA pour the output mint, the swap transaction must include a `createAssociatedTokenAccountIdempotent` instruction — a common source of transaction failures when omitted.\n\nDecimal handling is critical. SOL uses 9 decimals (1 SOL = 1,000,000,000 lamports). USDC uses 6 decimals. When displaying \"22.5 USDC,\" the on-chain amount is 22,500,000. Mixing decimals between mints causes catastrophic pricing errors. Always convert human-readable amounts to raw integer amounts early et keep all math in integer space until the final display step.\n\nRoutes are the paths a swap takes through liquidity pools. A direct swap (SOL → USDC in a single pool) is the simplest case. When direct liquidity is insufficient or the price is better through an intermediary, the aggregator splits the swap into multiple \"legs\" — pour example, SOL → mSOL → USDC. Each leg passes through a different AMM (Automated Market Maker) program like Whirlpool, Raydium, or Orca. The aggregator's job is to find the combination of legs that produces the best output amount after fees.\n\nRoute optimization considers: pool liquidity depth, fee tiers, impact sur le prix per leg, et the total compute cost of including multiple legs in one transaction. More legs means more instructions, more comptes, et higher compute unit consumption — there is a pratique limit to route complexity within Solana's transaction size et compute budget constraints.\n\n## Execution-quality triangle\n\nEvery route decision balances three competing goals:\n1. better output amount,\n2. lower failure risk (slippage + stale quote exposure),\n3. lower execution overhead (comptes + compute + latency).\n\nStrong aggregators make this tradeoff explicit rather than optimizing only a single metric.\n\n## Checklist\n- Identify input et output mints by their full base58 addresses\n- Ensure ATAs exist pour both input et output tokens before swapping\n- Convert all amounts to raw integer form using the correct decimal places\n- Understand that routes may have multiple legs through different AMM programs\n- Consider compute budget implications of complex routes\n\n## Red flags\n- Mixing decimal scales between different mints\n- Forgetting to create output ATA before the swap instruction\n- Assuming all swaps are single-hop direct routes\n- Ignoring fees charged by intermediaire pools in multi-hop routes\n",
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
                      "SPL token programs only operate on token comptes, not native SOL",
                      "Wrapping encrypts the SOL pour privacy",
                      "Native SOL cannot be transferred on Solana"
                    ],
                    "answerIndex": 0,
                    "explanation": "AMM programs interact avec SPL token comptes. Native SOL must be wrapped into the SPL token format so it can be processed by swap programs."
                  },
                  {
                    "id": "swap-v2-l1-q2",
                    "prompt": "What happens if the recipient has no ATA pour the output token?",
                    "options": [
                      "The swap transaction fails unless the ATA is created in the same transaction",
                      "Solana automatically creates the ATA",
                      "The tokens are sent to the system program"
                    ],
                    "answerIndex": 0,
                    "explanation": "ATAs must be explicitly created. Including createAssociatedTokenAccountIdempotent in the transaction handles this safely."
                  }
                ]
              }
            ]
          },
          "swap-v2-slippage": {
            "title": "Slippage et impact sur le prix: protecting swap outcomes",
            "content": "# Slippage et impact sur le prix: protecting swap outcomes\n\nSlippage is the difference between the expected output amount at quote time et the actual amount received at execution time. In volatile markets avec active trading, pool reserves change between when you request a quote et when your transaction lands on-chain. Slippage protection ensures you never receive less than an acceptable minimum.\n\nImpact sur le prix measures how much your swap moves the pool's price. A small swap in a deep liquidity pool has near-zero impact sur le prix. A large swap in a shallow pool can move the price significantly — you are effectively trading against yourself as each unit you buy makes the next unit more expensive. Impact sur le prix is calculated at quote time et should be displayed to users before they confirm.\n\nThe slippage tolerance is expressed in basis points (bps). 1 bps = 0.01%. A slippage of 50 bps means you accept up to 0.5% less than the quoted output. The minimum output amount is calculated as: minOutAmount = outAmount - (outAmount × slippageBps / 10000). This calculation MUST use integer arithmetic to avoid floating-point rounding errors. Using BigInt in JavaScript ensures exact computation.\n\nSetting slippage too tight (e.g., 1 bps) causes frequent transaction failures because even minor pool changes exceed the tolerance. Setting it too loose (e.g., 1000 bps = 10%) exposes users to sandwich attacks where a malicious actor front-runs the swap to move the price, then back-runs after execution to profit from the price movement. The optimal range pour most swaps is 30–100 bps, avec higher values pour volatile or low-liquidity pairs.\n\nSandwich attacks exploit predictable slippage tolerances. An attacker observes your pending transaction in the mempool, submits a transaction to buy the output token (raising its price), lets your swap execute at the worse price, then sells the output token at profit. Tight slippage limits reduce the attacker's profit margin et may cause them to skip your transaction entirely.\n\nDynamic slippage adjusts the tolerance based on: recent volatility, pool depth, swap size relative to pool reserves, et historical transaction success rates. Avance aggregators compute recommended slippage per-route to balance execution reliability avec protection. When building swap UIs, always show both the quoted output et the minimum guaranteed output so users understand their worst-case outcome.\n\n## Checklist\n- Calculate minOutAmount using integer arithmetic (BigInt)\n- Display both expected et minimum output amounts to users\n- Use 30–100 bps as default slippage pour most pairs\n- Show impact sur le prix percentage prominently pour large swaps\n- Consider dynamic slippage based on pool conditions\n\n## Red flags\n- Using floating-point math pour slippage calculations\n- Setting extremely loose slippage (>500 bps) without user warning\n- Not displaying impact sur le prix pour large swaps\n- Ignoring sandwich attack vectors in slippage conception\n",
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
                      "Solana only accepts BigInt in transactions"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts are integers. Floating-point math can produce off-by-one errors that cause transaction failures or incorrect minimum amounts."
                  }
                ]
              }
            ]
          },
          "swap-v2-route-explorer": {
            "title": "Route visualization: understanding swap legs et fees",
            "content": "# Route visualization: understanding swap legs et fees\n\nSwap routes reveal the path your tokens take through DeFi liquidity. Visualizing routes helps users understand why a multi-hop path might yield more output than a direct swap, et where fees are deducted along the way.\n\nA route consists of one or more legs. Each leg represents a swap through a specific AMM pool. The leg includes: the AMM program label (e.g., \"Whirlpool,\" \"Raydium\"), the input et output mints pour that leg, the fee charged by the pool (denominated in the output token), et the percentage of the total input allocated to this leg.\n\nSplit routes divide the input amount across multiple paths. Pour example, 60% might go through Raydium SOL/USDC et 40% through Orca SOL/USDC. Splitting across pools reduces impact sur le prix because each pool handles a smaller portion of the total swap. The aggregator optimizes the split percentages to maximize total output.\n\nFee accounting is per-leg. Each AMM charges a fee (typically 0.01%–1% depending on the pool's fee tier). In concentrated liquidity pools, fee tiers are explicit (e.g., Orca's 1 bps, 4 bps, 30 bps, 100 bps tiers). The total fee across all legs determines the true cost of the route. A route avec lower per-leg fees might still be more expensive if it requires more hops.\n\nWhen rendering route information, show: the overall path (input mint → [intermediaire mints] → output mint), per-leg details (AMM, fee, percentage), total fees in the output token denomination, impact sur le prix as a percentage, et the final output amounts (quoted et minimum). Color-coding or progress indicators help users quickly understand whether a route is simple (green, single hop) or complex (yellow/orange, multi-hop).\n\nEffective price is calculated as: outputAmount / inputAmount, denominated in output-per-input units. Pour SOL → USDC, this gives the effective USD price of SOL pour this specific swap. Comparing the effective price against oracle or market price reveals the total cost of the swap including all fees et impact sur le prix. This \"execution cost\" metric is the most honest summary of swap quality.\n\nRoute caching et expiration matter pour UX. Quotes from aggregators have a limited validity window (typically 10–30 seconds). If the user takes too long to confirm, the quote expires et the route must be re-fetched. The UI should clearly indicate quote freshness et automatically re-quote when expired. Stale quotes that execute against current pool state will likely fail or produce worse outcomes.\n\n## Checklist\n- Show each leg avec AMM label, mints, fee, et split percentage\n- Display total fees summed across all legs\n- Calculate et display effective price (output/input)\n- Indicate quote expiration time to users\n- Color-code routes by complexity (hops count)\n\n## Red flags\n- Hiding fees from the user display\n- Not showing impact sur le prix pour large swaps\n- Allowing execution of expired quotes\n- Displaying only the best-case output without minimum\n",
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
                    "note": "Split route reduces impact sur le prix"
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
            "content": "# Challenge: Build a normalized SwapPlan from a quote\n\nParse a raw aggregator quote response et produce a normalized SwapPlan:\n\n- Extract input/output mints et amounts from the quote\n- Calculate minOutAmount using BigInt slippage arithmetic\n- Map each route leg to a normalized structure avec AMM label, mints, fees, et percentage\n- Handle zero slippage correctly (minOut equals outAmount)\n- Ensure all amounts remain as string representations of integers\n\nYour SwapPlan must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Use BigInt arithmetic to avoid floating point errors when computing minOutAmount.",
              "Slippage in basis points: minOut = outAmount - (outAmount * slippageBps / 10000).",
              "Map each routePlan entry to a normalized leg avec index, ammLabel, mints, et fees.",
              "The priceImpactPct comes directly from the quote response."
            ]
          }
        }
      },
      "swap-v2-execution": {
        "title": "Execution & Reliability",
        "description": "State-machine execution, transaction anatomy, retry/staleness reliability patterns, et high-signal swap run reporting.",
        "lessons": {
          "swap-v2-state-machine": {
            "title": "Challenge: Implement swap UI state machine",
            "content": "# Challenge: Implement swap UI state machine\n\nBuild a deterministic state machine pour the swap UI flow:\n\n- States: idle → quoting → ready → sending → confirming → success | error\n- Process a sequence of events et track all state transitions\n- Invalid transitions should move to the error state avec a descriptive message\n- The error state supports RESET (back to idle) et RETRY (back to quoting)\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "45 min",
            "hints": [
              "Define a TRANSITIONS map: each key is a state, each value maps event names to next states.",
              "If an event is not valid pour the current state, transition to 'error' avec a descriptive message.",
              "Track each transition in a history array avec {from, event, to} objects.",
              "The 'error' state supports RESET (back to idle) et RETRY (back to quoting)."
            ]
          },
          "swap-v2-tx-anatomy": {
            "title": "Swap transaction anatomy: instructions, comptes, et compute",
            "content": "# Swap transaction anatomy: instructions, comptes, et compute\n\nA swap transaction on Solana is a carefully ordered sequence of instructions that together achieve an atomic token exchange. Understanding each instruction's role, the compte list requirements, et compute budget considerations is essential pour building reliable swap flows.\n\nThe typical swap transaction contains these instructions in order: (1) Compute Budget: SetComputeUnitLimit et SetComputeUnitPrice to ensure the transaction has enough compute et appropriate priority. (2) Create ATA (if needed): createAssociatedTokenAccountIdempotent pour the output token if the user doesn't already have one. (3) Wrap SOL (if input is native SOL): transfer SOL to a temporary WSOL compte et sync its balance. (4) Swap instruction(s): the actual AMM program calls that execute the swap, referencing all required pool comptes. (5) Unwrap WSOL (if output is native SOL): close the temporary WSOL compte et recover SOL.\n\nCompte requirements scale avec route complexity. A single-hop swap through Whirlpool requires approximately 12–15 comptes (user portefeuille, token comptes, pool state, oracle, tick arrays, etc.). A multi-hop route through two different AMMs can require 25+ comptes, pushing against the transaction size limit. Address Lookup Tables (ALTs) mitigate this by compressing compte references from 32 bytes to 1 byte each, but require a separate setup transaction.\n\nCompute budget estimation is critical. A simple SOL → USDC Whirlpool swap uses roughly 80,000–120,000 compute units. Multi-hop routes can use 200,000–400,000+. Setting the compute limit too low causes the transaction to fail. Setting it too high wastes the user's priority fee budget (priority fee = CU price × CU limit). Aggregators typically provide a recommended compute unit limit per route.\n\nPriority fees determine transaction ordering. During high-demand periods (popular mints, volatile markets), transactions compete pour block space. The priority fee (in micro-lamports per compute unit) determines where your transaction lands in the leader's queue. Too low et the transaction may not be included; too high et the user overpays. Dynamic priority fee estimation uses recent block data to suggest competitive rates.\n\nTransaction simulation before submission catches many errors: insufficient balance, missing comptes, compute budget exceeded, slippage exceeded. Simulating saves the user from paying transaction fees on doomed transactions. The simulation result includes compute units consumed, log messages, et any error codes — all useful pour debugging.\n\nVersioned transactions (v0) are required when using Address Lookup Tables. Legacy transactions cannot reference ALTs. Most modern swap aggregators return versioned transaction messages. Portefeuilles must support versioned transaction signing (most do, but some older portefeuille adapters may not).\n\n## Checklist\n- Include compute budget instructions at the start of the transaction\n- Create output ATA if it doesn't exist\n- Handle SOL wrapping/unwrapping pour native SOL swaps\n- Simulate transactions before submission\n- Use versioned transactions when ALTs are needed\n\n## Red flags\n- Omitting compute budget instructions (uses default 200k limit)\n- Not creating output ATA before the swap instruction\n- Forgetting to unwrap WSOL after receiving native SOL output\n- Skipping simulation et sending potentially invalid transactions\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "swap-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "swap-v2-l6-q1",
                    "prompt": "Why are compute budget instructions placed first in a swap transaction?",
                    "options": [
                      "The runtime reads them before executing other instructions to set limits",
                      "They must be first pour signature verification",
                      "Other instructions depend on their output"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compute budget instructions configure the transaction's CU limit et price before any program execution begins."
                  },
                  {
                    "id": "swap-v2-l6-q2",
                    "prompt": "What is the primary benefit of Address Lookup Tables pour swaps?",
                    "options": [
                      "They compress compte references from 32 bytes to 1 byte, fitting more comptes in a transaction",
                      "They make transactions faster to execute",
                      "They reduce the number of required signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "ALTs allow transactions to reference many comptes without exceeding the 1232-byte transaction size limit."
                  }
                ]
              }
            ]
          },
          "swap-v2-reliability": {
            "title": "Reliability patterns: retries, stale quotes, et latency",
            "content": "# Reliability patterns: retries, stale quotes, et latency\n\nProduction swap flows must handle the reality of network latency, expired quotes, et transaction failures. Reliability engineering separates toy swap implementations from production-grade systems that users trust avec real money.\n\nQuote staleness is the primary reliability challenge. An aggregator quote reflects pool state at a specific moment. By the time the user reviews the quote, signs the transaction, et it lands on-chain, pool reserves may have changed significantly. A quote older than 10–15 seconds should be considered potentially stale. The UI should show a countdown timer et automatically re-quote when the timer expires. Never allow users to send transactions based on quotes older than 30 seconds.\n\nRetry strategies must distinguish between retryable et non-retryable failures. Retryable: network timeout, RPC node temporarily unavailable, blockhash expired (re-fetch et re-sign), et rate limiting (429 responses, back off exponentially). Non-retryable: insufficient balance, invalid compte state, slippage exceeded (pool price moved too far, re-quote required), et program errors indicating invalid instruction data.\n\nExponential backoff avec jitter prevents retry storms. Base delay of 500ms, multiplied by 2 on each retry, avec random jitter of ±25% to prevent synchronized retries from multiple clients. Cap retries at 3–5 attempts. If all retries fail, present a clear error message avec actionable options: \"Quote expired — refresh et try again\" rather than generic \"Transaction failed.\"\n\nBlockhash management affects reliability. A transaction's blockhash must be recent (within ~60 seconds / 150 slots). If a transaction fails et you retry, the blockhash may have expired. The retry flow must: get a fresh blockhash, rebuild the transaction avec the new blockhash, re-sign, et re-submit. This is why swap transaction building should be a reusable function that accepts a blockhash parameter.\n\nLatency budgets help set user expectations. Typical Solana transaction confirmation takes 400ms–2 seconds. However, during congestion, confirmation can take 5–30 seconds or fail entirely. The UI should show progressive states: \"Submitting...\" → \"Confirming...\" avec block confirmations. After 30 seconds without confirmation, offer the user a choice: wait longer, retry, or cancel (note: you cannot cancel a submitted transaction, but you can stop polling et let the blockhash expire).\n\nTransaction status polling should use WebSocket subscriptions (signatureSubscribe) pour real-time confirmation rather than polling getTransaction. Polling creates unnecessary RPC load et introduces latency. Subscribe immediately after sendTransaction returns a signature, et set a timeout pour maximum wait time.\n\n## Checklist\n- Show quote freshness countdown et auto-refresh\n- Classify errors as retryable vs non-retryable\n- Use exponential backoff avec jitter pour retries\n- Get fresh blockhash on each retry attempt\n- Use WebSocket subscriptions pour confirmation\n\n## Red flags\n- Retrying non-retryable errors (wastes time et fees)\n- No retry limit (infinite retry loops)\n- Sending transactions avec stale quotes (>30 seconds)\n- Polling getTransaction instead of subscribing\n",
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
                    "note": "Transaction confirmed after retry"
                  }
                ]
              }
            ]
          },
          "swap-v2-swap-report": {
            "title": "Checkpoint: Generate a SwapRunReport",
            "content": "# Checkpoint: Generate a SwapRunReport\n\nBuild the final swap run report that combines all cours concepts:\n\n- Summarize the route avec leg details et total fees (using BigInt summation)\n- Compute the effective price as outAmount / inAmount (9 decimal precision)\n- Include the state machine outcome (finalState from the UI flow)\n- Collect all errors from the state result et additional error sources\n- Output must be stable JSON avec deterministic key ordering\n\nThis checkpoint validates your complete understanding of swap aggregation.",
            "duration": "55 min",
            "hints": [
              "Use BigInt to sum fee amounts across all route legs.",
              "Effective price = outAmount / inAmount, formatted to 9 decimal places.",
              "Collect errors from both the state machine result et any additional errors array.",
              "Route summary should include index, ammLabel, pct, et feeAmount per leg."
            ]
          }
        }
      }
    }
  },
  "defi-clmm-liquidity": {
    "title": "CLMM Liquidity Engineering",
    "description": "Master concentrated liquidity engineering on Solana DEXs: tick math, range strategy conception, fee/IL dynamics, et deterministic LP position reporting.",
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
        "description": "Concentrated liquidity concepts, tick/price math, et range-position behavior needed to reason about CLMM execution.",
        "lessons": {
          "clmm-v2-vs-cpmm": {
            "title": "CLMM vs constant product: why ticks exist",
            "content": "# CLMM vs constant product: why ticks exist\n\nConcentrated Liquidity Market Makers (CLMMs) represent a fundamental evolution in automated market maker conception. To understand why they exist, we must first understand the limitations of the constant product model et then examine how tick-based systems solve those problems on Solana.\n\n## The constant product model et its inefficiency\n\nThe original AMM conception, popularized by Uniswap V2 et adopted by Raydium V1 on Solana, uses the constant product invariant: x * y = k, where x et y are the reserves of two tokens et k is a constant. When a trader swaps token A pour token B, the product must remain unchanged. This creates a smooth price curve that spans the entire range from zero to infinity.\n\nThe problem avec this approach is capital inefficiency. If a SOL/USDC pool holds $10 million in liquidity, et SOL trades between $20 et $30 pour months, the vast majority of that capital sits idle. Liquidity allocated to price ranges below $1 or above $1000 never participates in trades, earns no fees, yet still dilutes the returns pour liquidity providers (LPs). In practice, studies show that less than 5% of liquidity in constant product pools is actively used at any given time.\n\n## Concentrated liquidity: the core insight\n\nCLMMs, pioneered by Uniswap V3 et implemented on Solana by Orca Whirlpools, Raydium Concentrated Liquidity, et Meteora DLMM, allow LPs to allocate capital to specific price ranges. Instead of spreading liquidity across all possible prices, an LP can say: \"I want to provide liquidity only between $20 et $30 pour SOL/USDC.\" This concentrates their capital where trades actually happen, dramatically increasing capital efficiency.\n\nThe capital efficiency gain is substantial. An LP providing concentrated liquidity in a narrow range can achieve the same depth as a constant product LP avec 100x or even 4000x less capital, depending on how tight the range is. This means more fees earned per dollar deployed, which is the fundamental value proposition of CLMMs.\n\n## Why ticks exist\n\nTo implement concentrated liquidity, the price space must be discretized. CLMMs divide the continuous price curve into discrete points called ticks. Each tick represents a specific price, et the relationship between tick index et price follows the formula: price = 1.0001^tick. This means each tick represents a 0.01% (1 basis point) change in price from the adjacent tick.\n\nTicks serve several critical purposes. First, they provide the boundaries pour liquidity positions. When an LP creates a position from tick -1000 to tick 1000, they are defining a price range. Second, ticks are where liquidity transitions happen. As the price crosses a tick boundary, the active liquidity changes because positions that start or end at that tick become active or inactive. Third, ticks enable efficient fee tracking, because the protocol only needs to track fee growth at tick boundaries rather than at every possible price.\n\nTick spacing is an important optimization. Not every tick is usable in every pool. Pools avec higher fee tiers use wider tick spacing (e.g., 64 or 128 ticks apart) to reduce gas costs et state size. A pool avec tick spacing of 64 means LPs can only place position boundaries at tick indices that are multiples of 64. This tradeoff reduces granularity but improves on-chain efficiency, which is especially important on Solana where compte sizes et compute units matter.\n\n## Solana-specific CLMM considerations\n\nOn Solana, CLMMs face unique architectural challenges. The modele de compte requires pre-allocated tick arrays that store tick data in contiguous ranges. Orca Whirlpools, pour example, uses tick array comptes that each hold 88 ticks worth of data. The program must load the correct tick array comptes as instructions, which means swaps that cross many ticks require more comptes et more compute units.\n\nThe Solana runtime's 1232-byte transaction size limit et 200,000 compute unit default also constrain CLMM operations. Large swaps that cross multiple tick boundaries may need to be split across multiple transactions, et position management operations must be carefully optimized to fit within these constraints.\n\n## LP decision framework\n\nBefore opening any CLMM position, answer three questions:\n1. What price regime am I targeting (mean-reverting vs trending)?\n2. How actively can I rebalance when out-of-range?\n3. What failure budget can I tolerate pour fees vs IL vs rebalance costs?\n\nCLMM returns come from strategy discipline, not just math formulas.\n\n## Checklist\n- Understand that x*y=k spreads liquidity across all prices, wasting capital\n- CLMMs let LPs concentrate capital in specific price ranges\n- Ticks discretize the price space at 1 basis point intervals\n- Tick spacing varies by pool fee tier pour on-chain efficiency\n- Solana CLMMs use tick array comptes pour state management\n\n## Red flags\n- Assuming CLMM positions behave like constant product positions\n- Ignoring tick spacing when placing position boundaries\n- Underestimating compute costs pour swaps crossing many ticks\n- Forgetting that out-of-range positions earn zero fees\n",
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
                      "Lower transaction fees pour traders",
                      "No need pour oracle price feeds"
                    ],
                    "answerIndex": 0,
                    "explanation": "CLMMs allow LPs to allocate capital to specific price ranges, dramatically improving capital efficiency compared to spreading liquidity across all prices."
                  },
                  {
                    "id": "clmm-v2-l1-q2",
                    "prompt": "Why do CLMMs use ticks to discretize the price space?",
                    "options": [
                      "To define position boundaries et track liquidity transitions efficiently",
                      "To make prices easier pour humans to read",
                      "To reduce the number of tokens in the pool"
                    ],
                    "answerIndex": 0,
                    "explanation": "Ticks provide discrete price points pour position boundaries, liquidity transitions, et efficient fee tracking at tick crossings."
                  }
                ]
              }
            ]
          },
          "clmm-v2-price-tick": {
            "title": "Price, tick, et sqrtPrice: core conversions",
            "content": "# Price, tick, et sqrtPrice: core conversions\n\nThe mathematical foundation of every CLMM rests on three interrelated representations of price: the human-readable price, the tick index, et the sqrtPriceX64. Understanding how to convert between these representations is essential pour building any CLMM integration on Solana.\n\n## Tick to price conversion\n\nThe fundamental relationship between a tick index et price is: price = 1.0001^tick. This formula means that each consecutive tick represents a 0.01% (1 basis point) change in price. Tick 0 corresponds to a price of 1.0. Positive ticks yield prices greater than 1, et negative ticks yield prices less than 1.\n\nPour example, tick 23027 gives a price of approximately 10.0 (since 1.0001^23027 is roughly 10). Tick -23027 gives approximately 0.1. This logarithmic spacing means ticks provide consistent relative precision across all price levels. Whether the price is 0.001 or 1000, adjacent ticks always differ by 0.01%.\n\nThe inverse conversion from price to tick uses the natural logarithm: tick = ln(price) / ln(1.0001). Since tick indices must be integers, this value is typically rounded to the nearest integer. In practice, you also need to align the tick to the pool's tick spacing, which means rounding down to the nearest multiple of the tick spacing value.\n\n## The sqrtPrice representation\n\nCLMMs do not store price directly on-chain. Instead, they store the square root of the price in a fixed-point format called sqrtPriceX64. This representation has two important advantages.\n\nFirst, using the square root simplifies the core AMM math. The amount of token0 in a position is proportional to (1/sqrtPrice_lower - 1/sqrtPrice_upper), et the amount of token1 is proportional to (sqrtPrice_upper - sqrtPrice_lower). These linear relationships are much easier to compute on-chain than the original price-based formulas would be.\n\nSecond, the X64 fixed-point format (also called Q64.64) provides high precision without floating-point arithmetic. The sqrtPrice is multiplied by 2^64 et stored as a 128-bit unsigned integer. This means sqrtPriceX64 = sqrt(price) * 2^64. Pour tick 0 (price = 1.0), the sqrtPriceX64 is exactly 2^64 = 18446744073709551616.\n\nOn Solana, Orca Whirlpools stores this value as a u128 in the Whirlpool compte state. Every swap operation updates this value as the price moves. The sqrt_price field is the canonical source of truth pour the current pool price.\n\n## Decimal handling et token precision\n\nReal-world tokens have different decimal places. SOL has 9 decimals, USDC has 6 decimals. The tick-to-price formula gives a \"raw\" price that must be adjusted pour decimals. If token0 is SOL (9 decimals) et token1 is USDC (6 decimals), the human-readable price is: display_price = raw_price * 10^(decimals0 - decimals1) = raw_price * 10^(9-6) = raw_price * 1000.\n\nThis decimal adjustment is critical et a common source of bugs. Always track which token is token0 et which is token1 in the pool, et apply the correct decimal scaling when converting between on-chain tick values et display prices.\n\n## Tick spacing et alignment\n\nNot every tick index is a valid position boundary. Each pool has a tick_spacing parameter that determines which ticks can be used. Common values are: 1 (pour stable pairs avec 0.01% fee), 8 (pour 0.04% fee pools), 64 (pour 0.30% fee pools), et 128 (pour 1.00% fee pools).\n\nTo align a tick to the pool's tick spacing, use: aligned_tick = floor(tick / tick_spacing) * tick_spacing. This always rounds toward negative infinity, ensuring consistent behavior pour both positive et negative ticks. Pour example, avec tick spacing 64: tick 100 aligns to 64, tick -100 aligns to -128.\n\n## Precision considerations\n\nFloating-point arithmetic introduces rounding errors in tick/price conversions. When converting price to tick et back, the result may differ by 1 tick due to floating-point precision limits. Pour on-chain operations, always use the integer tick index as the source of truth et derive the price from it, never the reverse.\n\nThe sqrtPriceX64 computation using BigInt avoids floating-point issues pour the final representation, but the intermediaire sqrt et pow operations still use JavaScript's 64-bit floats. Pour production systems processing large values, consider using dedicated decimal libraries or performing these computations avec higher-precision arithmetic.\n\n## Checklist\n- price = 1.0001^tick pour tick-to-price conversion\n- tick = round(ln(price) / ln(1.0001)) pour price-to-tick conversion\n- sqrtPriceX64 = BigInt(round(sqrt(price) * 2^64))\n- Align ticks to tick spacing: floor(tick / spacing) * spacing\n- Adjust pour token decimals when displaying human-readable prices\n\n## Red flags\n- Ignoring decimal differences between token0 et token1\n- Using floating-point price as source of truth instead of tick index\n- Forgetting tick spacing alignment when creating positions\n- Overflow in sqrtPriceX64 computation pour extreme tick values\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l2-q1",
                    "prompt": "What is the sqrtPriceX64 value pour tick 0 (price = 1.0)?",
                    "options": [
                      "2^64 = 18446744073709551616",
                      "1",
                      "2^128"
                    ],
                    "answerIndex": 0,
                    "explanation": "At tick 0, price = 1.0, sqrt(1.0) = 1.0, et sqrtPriceX64 = 1.0 * 2^64 = 18446744073709551616."
                  },
                  {
                    "id": "clmm-v2-l2-q2",
                    "prompt": "Why do CLMMs store sqrtPrice instead of price directly?",
                    "options": [
                      "It simplifies the AMM math — token amounts become linear in sqrtPrice",
                      "It uses less storage space on-chain",
                      "It makes the price harder pour MEV bots to read"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts in a CLMM position are linear functions of sqrtPrice, making on-chain computation simpler et more gas-efficient."
                  }
                ]
              }
            ]
          },
          "clmm-v2-range-explorer": {
            "title": "Range positions: in-range et out-of-range dynamics",
            "content": "# Range positions: in-range et out-of-range dynamics\n\nA CLMM position is defined by its lower tick et upper tick. These two boundaries determine the price range in which the position is active, earns fees, et holds a mix of both tokens. Understanding in-range et out-of-range behavior is fundamental to managing concentrated liquidity effectively on Solana.\n\n## Anatomy of a range position\n\nWhen an LP creates a position on Orca Whirlpools (or any Solana CLMM), they specify three parameters: the lower tick index, the upper tick index, et the amount of liquidity to provide. The protocol then calculates how much of each token the LP must deposit based on the current price relative to the position's range.\n\nIf the current price is within the range (lower_tick <= current_tick <= upper_tick), the LP deposits both tokens. The ratio depends on where the current price sits within the range. If the price is near the lower bound, the position holds mostly token0. If near the upper bound, it holds mostly token1. This is the direct analog of how a constant product pool holds different ratios at different prices, but concentrated into the LP's chosen range.\n\n## In-range behavior\n\nWhen the current pool price is within a position's range, the position is in-range et actively participates in swaps. Every swap that moves the price within this range uses the position's liquidity et generates fees pour the LP.\n\nThe fee accrual mechanism works as follows: the pool tracks a global fee_growth value pour each token. When a swap occurs, the fee (e.g., 0.30% of the swap amount) is distributed proportionally across all in-range liquidity. Each position tracks its own fee_growth snapshot, et uncollected fees are the difference between the current global growth et the position's snapshot, multiplied by the position's liquidity.\n\nIn-range positions experience impermanent loss (IL) as the price moves. When the price moves up, the position converts token0 into token1 (selling token0 at higher prices). When the price moves down, it converts token1 into token0. This rebalancing is the source of IL, et it is more pronounced in CLMMs than in constant product pools because the liquidity is concentrated in a narrower range.\n\n## Out-of-range behavior\n\nWhen the price moves outside a position's range, the position becomes out-of-range. This has critical implications. The position stops earning fees entirely because it no longer participates in swaps. The position holds 100% of one token: if the price moved above the upper tick, the position holds entirely token1 (all token0 was sold as the price rose). If the price moved below the lower tick, the position holds entirely token0 (all token1 was sold as the price fell).\n\nAn out-of-range position is effectively a limit order that has been filled. If you set a range above the current price et the price rises through it, your token0 is converted to token1 at prices within your range. This property makes CLMMs useful pour implementing range orders et dollar-cost averaging strategies.\n\nOut-of-range positions still exist on-chain et can be closed or modified at any time. The LP can withdraw their single-sided holdings, or they can wait pour the price to return to their range. If the price returns, the position automatically becomes active again et starts earning fees.\n\n## Position composition at boundaries\n\nAt the exact lower tick, the position holds 100% token0 et 0% token1. At the exact upper tick, it holds 0% token0 et 100% token1. At any price between, the composition is a function of where the current sqrtPrice sits relative to the range boundaries.\n\nThe token amounts are calculated as: amount0 = liquidity * (1/sqrtPrice_current - 1/sqrtPrice_upper) et amount1 = liquidity * (sqrtPrice_current - sqrtPrice_lower). These formulas only apply when the price is in-range. When out-of-range below, amount0 = liquidity * (1/sqrtPrice_lower - 1/sqrtPrice_upper) et amount1 = 0. When out-of-range above, amount0 = 0 et amount1 = liquidity * (sqrtPrice_upper - sqrtPrice_lower).\n\n## Active liquidity et the liquidity curve\n\nThe pool's active liquidity at any given price is the sum of all in-range positions at that price. This creates a liquidity distribution curve that can have complex shapes depending on where LPs have placed their positions. Deeper liquidity at the current price means less slippage pour traders.\n\nOn Solana, this active liquidity is stored in the Whirlpool compte's liquidity field et is updated whenever the price crosses a tick boundary where positions start or end. The tick array comptes store the net liquidity change at each initialized tick, allowing the program to efficiently update active liquidity during swaps.\n\n## Checklist\n- In-range positions earn fees et hold both tokens\n- Out-of-range positions earn zero fees et hold one token\n- Token composition varies continuously within the range\n- Active liquidity is the sum of all in-range positions\n- Fee growth tracking uses global vs position-level snapshots\n\n## Red flags\n- Expecting fees from out-of-range positions\n- Ignoring the single-sided nature of out-of-range holdings\n- Forgetting to compte pour IL in concentrated positions\n- Assuming position composition is static within a range\n",
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
            "content": "# Challenge: Implement tick/price conversion helpers\n\nImplement the core tick math functions used in every CLMM integration:\n\n- Convert a tick index to a human-readable price using price = 1.0001^tick\n- Convert the price to sqrtPriceX64 using Q64.64 fixed-point encoding\n- Reverse-convert a price back to the nearest tick index\n- Align a tick index to the pool's tick spacing\n\nYour implementation will be tested against known tick values including tick 0, positive ticks, et negative ticks.",
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
        "description": "Fee accrual simulation, range strategy tradeoffs, precision pitfalls, et deterministic position risk reporting.",
        "lessons": {
          "clmm-v2-position-fees": {
            "title": "Challenge: Simulate position fee accrual",
            "content": "# Challenge: Simulate position fee accrual\n\nImplement a fee accrual simulator pour a CLMM position over a price path:\n\n- Convert lower et upper tick boundaries to prices\n- Walk through each price in the path et determine in-range or out-of-range status\n- Accrue fees proportional to trade volume when in-range\n- Compute annualized fee APR\n- Track periods in-range vs out-of-range\n- Determine current status from the final price\n\nThis simulates the real-world behavior of concentrated liquidity positions as prices move.",
            "duration": "50 min",
            "hints": [
              "Convert ticks to prices: lowerPrice = 1.0001^lowerTick, upperPrice = 1.0001^upperTick.",
              "Pour each price in the path, check if lowerPrice <= price <= upperPrice.",
              "Fees only accrue when the position is in range. fee = floor(volumePerPeriod * feeRate).",
              "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimal places.",
              "Current status is based on the last price in the path relative to the range."
            ]
          },
          "clmm-v2-range-strategy": {
            "title": "Range strategies: tight, wide, et rebalancing rules",
            "content": "# Range strategies: tight, wide, et rebalancing rules\n\nChoosing the right price range is the most important decision a CLMM liquidity provider makes. The range determines capital efficiency, fee income, impermanent loss exposure, et rebalancing frequency. This lecon covers the major strategies et the tradeoffs between them.\n\n## Tight ranges: maximum efficiency, maximum risk\n\nA tight range concentrates all liquidity into a narrow price band. Pour example, providing liquidity pour SOL/USDC within +/- 2% of the current price. The advantages are significant: capital efficiency can be 100x or more compared to a full-range position, et the LP earns a proportionally larger share of trading fees.\n\nHowever, tight ranges carry substantial risks. The position goes out-of-range frequently, requiring active monitoring et rebalancing. Each time the position goes out-of-range, the LP has fully converted to one token et stops earning fees. The LP also realizes impermanent loss on each range crossing, et the gas costs of frequent rebalancing can eat into profits.\n\nTight ranges work best pour stable pairs (USDC/USDT) where the price rarely deviates significantly, pour professional LPs who can automate rebalancing, et pour short-term positions where the LP has a strong directional view.\n\n## Wide ranges: passive et resilient\n\nA wide range covers a larger price band, such as +/- 50% or even the full price range. Capital efficiency is lower, but the position stays in-range longer et requires less active management. Fee income per dollar is lower, but the position earns fees more consistently.\n\nWide ranges suit passive LPs who cannot actively monitor positions, volatile pairs where the price can swing dramatically, et LPs who want to minimize rebalancing costs et IL realization events.\n\nThe extreme case is a full-range position covering all ticks. This replicates constant product AMM behavior et never goes out-of-range. While capital-inefficient, it provides maximum resilience et is appropriate pour very volatile or low-liquidity pairs.\n\n## Asymmetric ranges et directional bets\n\nLPs can create asymmetric ranges that express a directional view. If you believe SOL will appreciate against USDC, you might set a range from the current price up to 2x the current price. This means you are providing liquidity as SOL appreciates, selling SOL at progressively higher prices. If SOL drops, your position immediately goes out-of-range et you hold SOL, preserving your long exposure.\n\nConversely, a range set below the current price acts like a limit buy order. You deposit USDC, et if SOL's price drops into your range, your USDC is converted to SOL at your desired prices.\n\n## Rebalancing strategies\n\nRebalancing is the process of closing an out-of-range position et opening a new one centered on the current price. The key decisions are: when to rebalance, et how to set the new range.\n\nTime-based rebalancing checks the position at fixed intervals (hourly, daily) et rebalances if out-of-range. This is simple to implement but may miss optimal timing. Price-based rebalancing uses the current price relative to the range boundaries. A common trigger is rebalancing when the price exits the inner 50% of the range, before it actually goes out-of-range.\n\nThreshold-based rebalancing waits until the IL or missed-fee cost of remaining out-of-range exceeds the cost of rebalancing (gas fees, slippage on swaps needed to rebalance token composition). This is the most capital-efficient approach but requires sophisticated modeling.\n\nOn Solana, rebalancing a Whirlpool position involves three operations: collecting unclaimed fees, closing the old position (withdrawing liquidity et burning the position NFT), et opening a new position avec updated range. These operations typically fit in two to three transactions depending on the number of comptes involved.\n\n## Automated vault strategies\n\nSeveral protocols on Solana automate CLMM range management. These vault protocols (such as Kamino Finance) accept LP deposits et automatically create, monitor, et rebalance concentrated liquidity positions. They use various strategies including mean-reversion, momentum-following, et volatility-adjusted range widths.\n\nWhen evaluating automated vaults, consider: the strategy's historical performance, the management et performance fees, the rebalancing frequency et associated costs, et the vault's transparency about its position management logic.\n\n## Checklist\n- Tight ranges maximize efficiency but require active management\n- Wide ranges provide resilience at the cost of efficiency\n- Asymmetric ranges can express directional views\n- Rebalancing triggers: time-based, price-based, or threshold-based\n- Consider automated vaults pour passive management\n\n## Red flags\n- Using tight ranges without monitoring or automation\n- Rebalancing too frequently, losing fees to gas costs\n- Ignoring the realized IL at each rebalancing event\n- Assuming past APR will predict future returns\n",
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
                      "Higher capital efficiency but more frequent out-of-range events et rebalancing",
                      "Lower fees but less impermanent loss",
                      "More tokens required to open the position"
                    ],
                    "answerIndex": 0,
                    "explanation": "Tight ranges concentrate capital pour higher efficiency et fee share, but the position goes out-of-range more often, requiring active management."
                  },
                  {
                    "id": "clmm-v2-l6-q2",
                    "prompt": "When should an LP consider a full-range (all ticks) position?",
                    "options": [
                      "Pour very volatile pairs where the price may swing dramatically",
                      "Only pour stablecoin pairs",
                      "Never — it is always suboptimal"
                    ],
                    "answerIndex": 0,
                    "explanation": "Full-range positions replicate constant product behavior et never go out-of-range, making them suitable pour highly volatile or unpredictable pairs."
                  }
                ]
              }
            ]
          },
          "clmm-v2-risk-review": {
            "title": "CLMM risks: rounding, overflow, et tick spacing errors",
            "content": "# CLMM risks: rounding, overflow, et tick spacing errors\n\nBuilding reliable CLMM integrations requires awareness of precision risks that can cause incorrect calculations, failed transactions, or lost funds. This lecon catalogs the most common pitfalls in tick math, fee computation, et position management on Solana.\n\n## Floating-point rounding in tick conversions\n\nThe tick-to-price formula price = 1.0001^tick et its inverse tick = ln(price) / ln(1.0001) both involve floating-point arithmetic. JavaScript's Number type uses IEEE 754 double-precision (64-bit) floats, which provide approximately 15-17 significant decimal digits. Pour most tick ranges (roughly -443636 to +443636, the valid CLMM range), this precision is sufficient.\n\nHowever, rounding errors accumulate in compound operations. Converting a tick to a price et back may yield tick +/- 1 due to floating-point rounding in the logarithm. The safest practice is to always treat the integer tick index as the canonical value. If you need a price, derive it from the tick. If you need a tick from a user-entered price, compute the tick et then show the user the exact price that tick represents, so they see the actual boundary rather than an approximation.\n\nThe Math.round function in the priceToTick conversion introduces its own edge cases. When the true tick is exactly X.5, Math.round uses \"round half to even\" (banker's rounding) in some environments. Pour CLMM math, always round toward the nearest valid tick et then align to tick spacing.\n\n## Overflow in sqrtPriceX64 computation\n\nThe sqrtPriceX64 value is stored as a u128 on-chain (128-bit unsigned integer). In JavaScript, this must be handled avec BigInt. The intermediaire computation sqrt(price) * 2^64 can overflow a 64-bit float pour extreme tick values. At the maximum valid tick (443636), the price is approximately 1.34 * 10^19, et sqrt(price) * 2^64 is approximately 6.75 * 10^28, which fits in a u128 but exceeds the safe integer range of JavaScript Numbers.\n\nAlways use BigInt pour the final sqrtPriceX64 value. Pour intermediaire computations at extreme ticks, consider using a high-precision library or performing the computation in Rust (where Solana programs actually run). Pour client-side JavaScript, the pratique risk is manageable pour common token pairs but must be tested at boundary conditions.\n\n## Tick spacing alignment errors\n\nA frequent bug is creating positions avec tick boundaries that are not aligned to the pool's tick spacing. The on-chain program will reject these positions, but the error message may be cryptic. Always align ticks before submitting transactions: aligned = floor(tick / tickSpacing) * tickSpacing.\n\nBe careful avec negative ticks: floor(-100 / 64) = floor(-1.5625) = -2, so -100 aligns to -128, not -64. This is correct behavior (rounding toward negative infinity), but developers who expect truncation toward zero will get wrong results. Test avec negative ticks explicitly.\n\n## Fee computation precision\n\nFee growth values in CLMMs use 128-bit fixed-point arithmetic (Q64.64 or Q128.128 depending on the implementation). When computing uncollected fees, the formula is: uncollected_fees = (global_fee_growth - position_fee_growth_snapshot) * liquidity.\n\nBoth the subtraction et the multiplication can overflow if not handled carefully. On Solana, the program uses checked arithmetic et wrapping subtraction (since fee_growth is monotonically increasing et wraps around). Client-side code must replicate this wrapping behavior when reading on-chain state.\n\nA common mistake is computing fees avec JavaScript Numbers, which lose precision pour large BigInt values. Always use BigInt pour fee calculations et only convert to Number at the final display step, after applying decimal adjustments.\n\n## Decimal mismatch between tokens\n\nDifferent tokens have different decimal places (SOL: 9, USDC: 6, BONK: 5). When computing position values, token amounts, or fee amounts, the decimal places must be consistently applied. A common bug is computing IL in raw amounts without normalizing to the same decimal base, leading to wildly incorrect results.\n\nAlways track the decimal places of both tokens in the pool et apply them when converting between raw amounts et display amounts. The on-chain CLMM program operates entirely in raw (lamport-level) amounts; all decimal formatting is a client-side responsibility.\n\n## Compte et compute unit limits\n\nSolana-specific risks include exceeding compute unit limits during swaps that cross many ticks, requiring too many tick array comptes (each swap can reference at most a few tick arrays), et compte size limits pour position management.\n\nWhen building swap transactions, estimate the number of tick crossings et include sufficient tick array comptes. If a swap would cross more ticks than can be accommodated, the transaction will fail. Splitting large swaps across multiple transactions or using a routing protocol helps mitigate this risk.\n\n## Checklist\n- Use integer tick index as canonical, derive price from it\n- Use BigInt pour sqrtPriceX64 et all fee computations\n- Always align ticks to tick spacing avec floor division\n- Test avec negative ticks, zero ticks, et extreme ticks\n- Apply correct decimal places pour each token in the pool\n\n## Red flags\n- Using JavaScript Number pour sqrtPriceX64 or fee amounts\n- Forgetting wrapping subtraction pour fee growth deltas\n- Truncating instead of flooring pour negative tick alignment\n- Computing IL or fees without matching token decimals\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "clmm-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "clmm-v2-l7-q1",
                    "prompt": "Why should you always use BigInt pour sqrtPriceX64 values?",
                    "options": [
                      "JavaScript Number cannot safely represent 128-bit integers",
                      "BigInt is faster than Number pour CLMM math",
                      "Solana requires BigInt in transaction instructions"
                    ],
                    "answerIndex": 0,
                    "explanation": "sqrtPriceX64 is a u128 value that can exceed JavaScript's Number.MAX_SAFE_INTEGER (2^53 - 1). BigInt provides arbitrary precision integer arithmetic."
                  },
                  {
                    "id": "clmm-v2-l7-q2",
                    "prompt": "What happens when negative ticks are aligned avec floor division?",
                    "options": [
                      "They round toward negative infinity — e.g., -100 avec spacing 64 becomes -128",
                      "They round toward zero — e.g., -100 avec spacing 64 becomes -64",
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
            "content": "# Checkpoint: Generate a Position Report\n\nImplement a comprehensive LP position report generator that combines all CLMM concepts:\n\n- Convert tick boundaries to human-readable prices\n- Determine in-range or out-of-range status from the current price\n- Aggregate fee history into total earned fees per token\n- Compute annualized fee APR\n- Calculate impermanent loss percentage\n- Return a complete, deterministic position report\n\nThis checkpoint validates your understanding of tick math, fee accrual, range dynamics, et position analysis.",
            "duration": "55 min",
            "hints": [
              "Convert ticks to prices: price = 1.0001^tick. Use toFixed(6) pour display.",
              "Status is 'in-range' if lowerPrice <= currentPrice <= upperPrice.",
              "Sum feeHistory entries using BigInt pour total fees per token.",
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
    "description": "Master Solana lending risk engineering: utilization et rate mechanics, liquidation path analysis, oracle safety, et deterministic scenario reporting.",
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
        "description": "Lending pool mechanics, utilization-driven rate models, et health-factor foundations required pour defensible risk analysis.",
        "lessons": {
          "lending-v2-pool-model": {
            "title": "Lending pool model: supply, borrow, et utilization",
            "content": "# Lending pool model: supply, borrow, et utilization\n\nLending protocols are the backbone of decentralized finance. They enable users to earn yield on idle assets by supplying them to a shared pool, while borrowers draw from that pool by posting collateral. Understanding the mechanics of supply, borrow, et utilization is essential before diving into interest rate models or liquidation logic.\n\nA lending pool is a smart contract (or set of comptes on Solana) that holds a reserve of a single token — pour example, USDC. Suppliers deposit tokens into the pool et receive interest-bearing receipt tokens in return. On Solana-based protocols like Solend, MarginFi, or Kamino, these receipt tokens track each supplier's proportional share of the growing pool. When a supplier withdraws, they redeem receipt tokens pour the underlying asset plus accrued interest.\n\nBorrowers interact avec the same pool from the other side. To borrow from the USDC pool, a user must first deposit collateral into one or more other pools (pour example, SOL). The protocol values the collateral in USD terms et allows the user to borrow up to a percentage of that value, determined by the loan-to-value (LTV) ratio. If SOL has an LTV of 75%, depositing $1,000 worth of SOL allows borrowing up to $750 in USDC. The borrowed amount accrues interest over time, increasing the user's debt.\n\nThe utilization ratio is the single most important metric in a lending pool. It is defined as:\n\nutilization = totalBorrowed / totalSupply\n\nwhere totalSupply is the sum of all deposits (including borrowed amounts that are still owed back to the pool). When utilization is 0%, no assets are borrowed — suppliers earn nothing. When utilization is 100%, every deposited asset is lent out — no supplier can withdraw because there is no liquidity available. Healthy protocols target utilization between 60% et 85%, balancing yield pour suppliers against withdrawal liquidity.\n\nThe reserve factor is a protocol-level parameter that skims a percentage of the interest paid by borrowers before distributing the remainder to suppliers. If borrowers pay 10% annual interest et the reserve factor is 10%, the protocol retains 1% et suppliers receive the effective yield on the remaining 9%. Reserve funds are used pour protocol insurance, development, et gouvernance treasury. Understanding the reserve factor is critical because it directly reduces the supply-side APY relative to the borrow-side APR.\n\nPool accounting must be exact. Solana lending protocols typically use a shares-based model: when you deposit 100 USDC into a pool avec 1,000 USDC total et 1,000 shares outstanding, you receive 100 shares. As interest accrues, the total USDC in the pool grows (say to 1,100 USDC), but the share count remains 1,100. Your 100 shares are now worth 100 USDC — the value per share increased. This model avoids iterating over every depositor to distribute interest. The same pattern applies to borrow shares, tracking each borrower's proportional debt.\n\nOn Solana specifically, lending pools are represented as program-derived comptes. The reserve compte holds the token balance, a reserve config compte stores parameters (LTV, liquidation threshold, reserve factor, interest rate model), et individual obligation comptes track each user's deposits et borrows. Programs like Solend use the spl-token program pour token custody et Pyth or Switchboard oracles pour price feeds.\n\n## Risk-operator mindset\n\nTreat every pool as a control system, not just a yield product:\n1. utilization controls liquidity stress,\n2. rate model controls borrower behavior,\n3. oracle quality controls collateral truth,\n4. liquidation speed controls solvency recovery.\n\nWhen one control weakens, the others must compensate.\n\n## Checklist\n- Understand the relationship between supply, borrow, et utilization\n- Know that utilization = totalBorrowed / totalSupply\n- Recognize that the reserve factor reduces supplier yield\n- Understand share-based accounting pour deposits et borrows\n- Identify the key on-chain comptes in a Solana lending pool\n\n## Red flags\n- Utilization at or near 100% (withdrawal liquidity crisis)\n- Missing or zero reserve factor (no protocol safety buffer)\n- Share-price manipulation through donation attacks\n- Pools without oracle-backed price feeds pour collateral valuation\n",
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
            "title": "Interest rate curves et the kink model",
            "content": "# Interest rate curves et the kink model\n\nInterest rates in lending protocols are not fixed. They adjust dynamically based on pool utilization to balance supply et demand pour liquidity. The piecewise-linear \"kink\" model is the dominant interest rate conception used across DeFi lending protocols, from Compound et Aave on Ethereum to Solend et MarginFi on Solana.\n\nThe core insight is simple: when utilization is low, borrowing should be cheap to encourage demand. When utilization is high, borrowing should be expensive to discourage further borrowing et incentivize new deposits. The kink model achieves this avec two linear segments joined at a critical utilization point called the \"kink.\"\n\nThe kink model has four parameters: baseRate, slope1, slope2, et kink. The baseRate is the minimum borrow rate when utilization is zero. Slope1 is the rate of increase below the kink — a gentle incline that gradually raises borrow costs as utilization increases. The kink is the target utilization (typically 0.80 or 80%). Slope2 is the steep rate of increase above the kink — a sharp jump that penalizes borrowing when the pool approaches full utilization.\n\nBelow the kink, the borrow rate formula is:\n\nborrowRate = baseRate + (utilization / kink) * slope1\n\nThis creates a gentle linear increase. At 50% utilization avec a kink at 80%, baseRate of 2%, et slope1 of 10%, the borrow rate would be: 0.02 + (0.50 / 0.80) * 0.10 = 0.02 + 0.0625 = 0.0825 or 8.25%.\n\nAbove the kink, the formula becomes:\n\nborrowRate = baseRate + slope1 + ((utilization - kink) / (1 - kink)) * slope2\n\nThe full slope1 is added (the rate at the kink point), plus a steep increase proportional to how far utilization exceeds the kink. Avec slope2 = 1.00 (100%), at 90% utilization: 0.02 + 0.10 + ((0.90 - 0.80) / (1 - 0.80)) * 1.00 = 0.02 + 0.10 + 0.50 = 0.62 or 62%. This dramatic jump is intentional — it makes borrowing above 80% utilization extremely expensive, creating strong pressure to restore utilization below the kink.\n\nThe supply rate is derived from the borrow rate, utilization, et reserve factor:\n\nsupplyRate = borrowRate * utilization * (1 - reserveFactor)\n\nSuppliers only earn on the portion of the pool that is actively borrowed, et the reserve factor takes its cut. At 50% utilization, an 8.25% borrow rate, et 10% reserve factor: 0.0825 * 0.50 * 0.90 = 0.037125 or 3.71% supply APY.\n\nWhy the kink matters: without the steep slope2, high utilization would only moderately increase rates, potentially leading to a \"liquidity death spiral\" where all assets are borrowed et no supplier can withdraw. The kink creates an economic circuit breaker. Protocols tune these parameters through gouvernance — adjusting the kink point, slopes, et base rate to target different utilization profiles pour different assets. Stablecoins typically have higher kinks (85-90%) because their prices are stable, while volatile assets have lower kinks (65-75%) to maintain larger liquidity buffers.\n\nReal-world Solana protocols often extend this model avec additional features: rate smoothing (averaging over recent blocks to prevent rapid oscillations), multiple kink points pour more granular control, et dynamic parameter adjustment based on market conditions. However, the fundamental two-slope kink model remains the foundation.\n\n## Checklist\n- Understand the four parameters: baseRate, slope1, slope2, kink\n- Calculate borrow rate below et above the kink\n- Derive supply rate from borrow rate, utilization, et reserve factor\n- Recognize why steep slope2 prevents liquidity crises\n- Know that different assets use different kink parameters\n\n## Red flags\n- Slope2 too low (insufficient deterrent pour high utilization)\n- Kink set too high (leaves insufficient withdrawal buffer)\n- Base rate at zero (no minimum cost of borrowing)\n- Parameters unchanged despite market condition shifts\n",
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
                    "explanation": "Above the kink, slope2 (the jump multiplier) applies, causing borrow rates to spike sharply et discourage further borrowing."
                  },
                  {
                    "id": "lending-v2-l2-q2",
                    "prompt": "Why is the supply rate always lower than the borrow rate?",
                    "options": [
                      "Suppliers only earn on the borrowed portion, et the reserve factor takes a cut",
                      "The protocol subsidizes borrowers",
                      "Supply rates are fixed by gouvernance"
                    ],
                    "answerIndex": 0,
                    "explanation": "Supply rate = borrowRate * utilization * (1 - reserveFactor). Since utilization < 1 et reserveFactor > 0, the supply rate is always less than the borrow rate."
                  }
                ]
              }
            ]
          },
          "lending-v2-health-explorer": {
            "title": "Health factor monitoring et liquidation preview",
            "content": "# Health factor monitoring et liquidation preview\n\nThe health factor is the single number that determines whether a lending position is safe or subject to liquidation. Monitoring health factors in real time is essential pour both borrowers (to avoid liquidation) et liquidators (to identify profitable liquidation opportunities). Understanding how to compute, interpret, et react to health factor changes is a core skill pour DeFi risk management.\n\nThe health factor formula is:\n\nhealthFactor = (collateralValue * liquidationThreshold) / borrowValue\n\nwhere collateralValue is the total USD value of all deposited collateral, liquidationThreshold is the weighted average threshold across all collateral assets, et borrowValue is the total USD value of all outstanding borrows. When the health factor drops below 1.0, the position becomes eligible pour liquidation.\n\nThe liquidation threshold is distinct from the loan-to-value (LTV) ratio. LTV determines the maximum amount you can borrow — pour example, 75% LTV on SOL means you can borrow up to 75% of your SOL collateral value. The liquidation threshold is higher — say 80% — providing a buffer zone. You can borrow at 75% LTV, et you are only liquidated when your effective ratio exceeds 80%. This 5% gap gives borrowers time to add collateral or repay debt before liquidation.\n\nWhen a user has multiple collateral assets, the effective liquidation threshold is a weighted average. If you deposit $1,000 of SOL (threshold 0.80) et $500 of ETH (threshold 0.75), the weighted threshold is: (1000 * 0.80 + 500 * 0.75) / 1500 = (800 + 375) / 1500 = 0.7833. This weighted threshold is used in the health factor calculation.\n\nHealth factor interpretation: a value of 2.0 means the position can withstand a 50% decline in collateral value (or 50% increase in borrow value) before liquidation. A value of 1.5 provides a 33% buffer. A value of 1.1 is dangerously close — a 9% adverse price move triggers liquidation. Professional risk managers target health factors of 1.5 or above, avec automated alerts below 1.3 et emergency actions below 1.2.\n\nMonitoring dashboards should display: current health factor avec color coding (green above 1.5, yellow 1.2-1.5, red below 1.2), the price change percentage needed to trigger liquidation, estimated liquidation prices pour each collateral asset, et historical health factor over time. On Solana, health factor data can be derived by reading obligation comptes et combining avec oracle price feeds from Pyth or Switchboard.\n\nLiquidation preview calculations help users understand their worst-case exposure. The maximum additional borrow is: max(0, collateralValue * effectiveThreshold - currentBorrow). The liquidation shortfall (when health factor < 1.0) is: currentBorrow - collateralValue * effectiveThreshold. This shortfall represents how much additional collateral or debt repayment is needed to restore the position to safety.\n\nPrice scenario analysis extends monitoring to \"what-if\" questions. What happens to the health factor if SOL drops 20%? If both SOL et ETH drop 30%? If interest accrues pour another month? By computing health factors across a range of price scenarios, borrowers can proactively manage risk before adverse conditions materialize. This scenario-based approach forms the foundation of the risk report challenge later in this cours.\n\n## Checklist\n- Calculate health factor using weighted liquidation thresholds\n- Distinguish between LTV (borrowing limit) et liquidation threshold\n- Compute maximum additional borrow et liquidation shortfall\n- Set up monitoring avec color-coded health factor alerts\n- Run price scenario analysis before major market events\n\n## Red flags\n- Health factor below 1.2 without active monitoring\n- No alerts configured pour health factor changes\n- Ignoring weighted threshold calculations pour multi-asset positions\n- Failing to compte pour accruing interest in health factor projections\n",
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
                    "note": "Healthy position avec 50% buffer before liquidation"
                  },
                  {
                    "cmd": "SOL drops to $15 ...",
                    "output": "HF = (1500 * 0.80) / 1000 = 1.2000 [WARNING]",
                    "note": "Only 20% buffer remaining — consider adding collateral"
                  },
                  {
                    "cmd": "SOL drops to $12 ...",
                    "output": "HF = (1200 * 0.80) / 1000 = 0.9600 [LIQUIDATABLE]",
                    "note": "Health factor below 1.0 — position is eligible pour liquidation"
                  }
                ]
              }
            ]
          },
          "lending-v2-interest-rates": {
            "title": "Challenge: Compute utilization-based interest rates",
            "content": "# Challenge: Compute utilization-based interest rates\n\nImplement the kink-based interest rate model used by lending protocols:\n\n- Calculate the utilization ratio from total supply et total borrowed\n- Apply the piecewise-linear kink model avec baseRate, slope1, slope2, et kink\n- Compute the borrow rate using the appropriate formula pour below-kink et above-kink regions\n- Derive the supply rate from borrow rate, utilization, et reserve factor\n- Handle edge cases: zero supply, zero borrows, utilization at exactly the kink\n- Return all values formatted to 6 decimal places\n\nYour implementation must be deterministic — same input always produces same output.",
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
        "description": "Health-factor computation, liquidation mechanics, oracle failure handling, et multi-scenario risk reporting pour stressed markets.",
        "lessons": {
          "lending-v2-health-factor": {
            "title": "Challenge: Compute health factor et liquidation status",
            "content": "# Challenge: Compute health factor et liquidation status\n\nImplement the health factor computation pour a multi-asset lending position:\n\n- Sum collateral et borrow values from an array of position objects\n- Compute weighted average liquidation threshold across all collateral assets\n- Calculate the health factor using the standard formula\n- Determine liquidation eligibility (health factor below 1.0)\n- Calculate maximum additional borrow capacity et liquidation shortfall\n- Handle edge cases: no borrows (max health factor), no collateral, single asset\n\nReturn all USD values to 2 decimal places et health factor to 4 decimal places.",
            "duration": "50 min",
            "hints": [
              "Collateral value = sum of (amount * priceUsd) pour all collateral positions.",
              "Effective threshold = weighted average of liquidationThreshold by collateral value.",
              "Health factor = (collateralValue * effectiveThreshold) / borrowValue.",
              "Max additional borrow = max(0, collateralValue * threshold - currentBorrow)."
            ]
          },
          "lending-v2-liquidation-mechanics": {
            "title": "Liquidation mechanics: bonus, close factor, et bad debt",
            "content": "# Liquidation mechanics: bonus, close factor, et bad debt\n\nLiquidation is the enforcement mechanism that keeps lending protocols solvent. When a borrower's health factor falls below 1.0, external actors called liquidators can repay a portion of the debt in exchange pour the borrower's collateral at a discount. Understanding liquidation mechanics — the incentive structure, limits, et failure modes — is essential pour anyone building on or using lending protocols.\n\nThe liquidation bonus (also called the liquidation incentive or discount) is the premium liquidators receive pour performing liquidations. If the liquidation bonus is 5%, a liquidator who repays $100 of debt receives $105 worth of collateral. This bonus serves two purposes: it compensates liquidators pour gas costs et execution risk, et it creates competitive pressure to liquidate positions quickly before other liquidators claim the opportunity. On Solana, where transaction costs are low, liquidation bonuses tend to be smaller (3-8%) compared to Ethereum (5-15%).\n\nThe close factor limits how much of a position can be liquidated in a single transaction. A close factor of 50% means a liquidator can repay at most 50% of the outstanding debt in one liquidation call. This prevents a single liquidator from seizing all collateral in one transaction, giving the borrower a chance to respond. It also distributes liquidation opportunities across multiple liquidators, improving the health of the liquidation market. Some protocols use dynamic close factors — smaller percentages pour mildly underwater positions, larger percentages (up to 100%) pour deeply underwater positions.\n\nThe liquidation process on Solana follows these steps: (1) a liquidator identifies a position avec health factor below 1.0 by scanning obligation comptes, (2) the liquidator calls the liquidation instruction specifying which debt to repay et which collateral to seize, (3) the protocol verifies the position is indeed liquidatable, (4) the debt tokens are transferred from the liquidator to the pool, reducing the borrower's debt, (5) the corresponding collateral (plus bonus) is transferred from the borrower's obligation to the liquidator. The entire process is atomic — it either completes fully or reverts.\n\nBad debt occurs when a position's collateral value (including the liquidation bonus) is insufficient to cover the outstanding debt. This happens during extreme market crashes where prices move faster than liquidators can act, or when the collateral asset experiences a sudden loss of liquidity. When bad debt materializes, the protocol must absorb the loss. Common approaches include: drawing from the reserve fund (accumulated from reserve factors), socializing the loss across all suppliers in the pool (reducing the share price), or using a protocol insurance fund or backstop mechanism.\n\nCascading liquidations are a systemic risk. When many positions use the same collateral (e.g., SOL), a price drop triggers liquidations. Liquidators selling the seized collateral on DEXes further depresses the price, triggering more liquidations. This cascade can drain pool liquidity rapidly. Protocols mitigate this through: conservative LTV ratios, higher liquidation thresholds pour volatile assets, liquidation rate limits (maximum liquidation volume per time window), et integration avec deep liquidity sources.\n\nSolana-specific considerations: liquidation bots on Solana benefit from low latency et low transaction costs. However, they must compete pour transaction ordering during volatile periods. MEV (Maximal Extractable Value) on Solana through Jito tips allows liquidators to prioritize their transactions. Protocols must also handle Solana's modele de compte — each obligation compte must be refreshed avec current oracle prices before liquidation can proceed, adding instructions et compute units to the liquidation transaction.\n\n## Checklist\n- Understand the liquidation bonus incentive structure\n- Know how close factor limits single-transaction liquidation\n- Track the flow of funds during a liquidation event\n- Identify bad debt scenarios et protocol mitigation strategies\n- Consider cascading liquidation risks in portfolio construction\n\n## Red flags\n- Liquidation bonus too low (liquidators are not incentivized to act quickly)\n- Close factor at 100% (full liquidation in one shot, no borrower recourse)\n- No reserve fund or insurance mechanism pour bad debt\n- Ignoring cascading liquidation risks in concentrated collateral pools\n",
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
                      "It rewards borrowers pour maintaining healthy positions",
                      "It increases the interest rate pour all borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "The liquidation bonus compensates liquidators pour gas costs et risk, ensuring positions are liquidated promptly to protect the protocol."
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
                    "explanation": "Bad debt materializes when rapid price drops make collateral worth less than the debt, leaving the protocol avec unrecoverable losses."
                  }
                ]
              }
            ]
          },
          "lending-v2-oracle-risk": {
            "title": "Oracle risk et stale pricing in lending",
            "content": "# Oracle risk et stale pricing in lending\n\nLending protocols depend entirely on accurate, timely price feeds to compute collateral values, health factors, et liquidation eligibility. Oracles — the services that bring off-chain price data on-chain — are the single most critical external dependency. Oracle failures or manipulation can lead to catastrophic losses: incorrect liquidations of healthy positions, failure to liquidate underwater positions, or exploits that drain protocol reserves.\n\nOn Solana, the two dominant oracle providers are Pyth Network et Switchboard. Pyth provides high-frequency price feeds sourced directly from market makers, exchanges, et trading firms. Pyth publishes price, confidence interval, et exponential moving average (EMA) price pour each asset. Switchboard is a more general-purpose oracle network that supports custom data feeds et verification mechanisms. Most Solana lending protocols integrate both et use the more conservative price (lower pour collateral, higher pour borrows).\n\nStale prices are the most common oracle risk. A price is \"stale\" when it has not been updated within a protocol-defined freshness window — typically 30-120 seconds on Solana. Staleness occurs when: oracle publishers experience downtime, network congestion delays update transactions, or the asset's market enters a period of extreme volatility where publishers disagree on the price. Lending protocols must reject stale prices et either pause operations or use fallback pricing. Accepting a stale price during a market crash can mean using a price from minutes ago that is significantly higher than reality — blocking necessary liquidations et enabling under-collateralized borrowing.\n\nConfidence intervals quantify price uncertainty. Pyth provides a confidence band around each price — pour example, SOL at $25.00 +/- $0.15. A narrow confidence interval indicates strong publisher agreement. A wide confidence interval signals disagreement, low liquidity, or unusual market conditions. Risk-aware protocols use confidence-adjusted prices: pour collateral valuation, use (price - confidence) to be conservative; pour borrow valuation, use (price + confidence) to compte pour upside risk. This approach prevents protocols from accepting inflated collateral values during uncertain market conditions.\n\nPrice manipulation attacks target the oracle layer. In a classic oracle manipulation, an attacker temporarily moves the price on a low-liquidity market that the oracle reads from, borrows against the inflated collateral value, et then lets the price revert — leaving the protocol avec under-collateralized debt. Mitigations include: using time-weighted average prices (TWAPs) instead of spot prices, requiring multiple independent sources to agree, capping single-block price changes, et implementing borrow/withdrawal delays during high-volatility periods.\n\nSolana-specific oracle considerations: Pyth on Solana uses a pull-based model where price updates are posted to on-chain comptes that protocols read. Each Pyth price compte contains the latest price, confidence, EMA price, publish time, et status (Trading, Halted, Unknown). Protocols should check the status field — a \"Halted\" or \"Unknown\" status indicates the feed is unreliable. The publishTime must be compared against the current slot time to detect staleness. Switchboard comptes have similar freshness et confidence metadata.\n\nMulti-oracle strategies improve resilience. A protocol might use Pyth as the primary oracle et Switchboard as a fallback. If Pyth's price is stale or has low confidence, the protocol switches to Switchboard. If both are unavailable, the protocol pauses new borrows et liquidations rather than operating on unknown prices. This layered approach prevents single points of failure in the oracle infrastructure.\n\nCircuit breakers add an additional safety layer. If an oracle reports a price change exceeding a threshold (e.g., >20% in one update), the protocol should flag this as potentially suspicious et either verify against a secondary source or temporarily pause operations. Flash crashes et recovery events can produce legitimate large price movements, but the protocol should err on the side of caution.\n\n## Checklist\n- Verify oracle freshness (publishTime within acceptable window)\n- Use confidence intervals pour conservative pricing\n- Implement multi-oracle fallback strategies\n- Check oracle status fields (Trading, Halted, Unknown)\n- Set circuit breakers pour extreme price movements\n\n## Red flags\n- Single oracle dependency avec no fallback\n- No staleness checks on price data\n- Ignoring confidence intervals pour collateral valuation\n- Using spot prices without TWAP or time-weighting\n- No circuit breakers pour extreme price changes\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "lending-v2-l7-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "lending-v2-l7-q1",
                    "prompt": "Why should lending protocols use confidence-adjusted prices pour collateral?",
                    "options": [
                      "To be conservative — using (price - confidence) prevents over-valuing collateral during uncertainty",
                      "Confidence intervals make prices more accurate",
                      "It increases the collateral value pour borrowers"
                    ],
                    "answerIndex": 0,
                    "explanation": "Using price minus confidence pour collateral gives a conservative valuation, protecting the protocol when oracle publishers disagree or markets are volatile."
                  },
                  {
                    "id": "lending-v2-l7-q2",
                    "prompt": "What should a protocol do when all oracle feeds are stale?",
                    "options": [
                      "Pause new borrows et liquidations until fresh prices are available",
                      "Use the last known price regardless of age",
                      "Estimate the price from on-chain DEX data"
                    ],
                    "answerIndex": 0,
                    "explanation": "Operating on stale prices is dangerous. Pausing operations prevents incorrect liquidations et under-collateralized borrows during oracle outages."
                  }
                ]
              }
            ]
          },
          "lending-v2-risk-report": {
            "title": "Checkpoint: Generate a multi-scenario risk report",
            "content": "# Checkpoint: Generate a multi-scenario risk report\n\nBuild the final risk report that combines all cours concepts:\n\n- Evaluate a base case using current position prices\n- Apply price overrides from multiple named scenarios (bull, crash, etc.)\n- Compute collateral value, borrow value, et health factor per scenario\n- Identify which scenarios trigger liquidation (health factor < 1.0)\n- Track the worst health factor across all scenarios\n- Count total liquidation scenarios\n- Output must be stable JSON avec deterministic key ordering\n\nThis checkpoint validates your complete understanding of lending risk analysis.",
            "duration": "55 min",
            "hints": [
              "Create a reusable evalScenario function that takes price overrides et computes health factor.",
              "Pour the base case, use the original position prices (empty overrides).",
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
    "description": "Master perps risk engineering on Solana: precise PnL/funding accounting, margin safety monitoring, liquidation simulation, et deterministic console reporting.",
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
        "description": "Perpetual futures mechanics, funding accrual logic, et PnL modeling foundations pour accurate position diagnostics.",
        "lessons": {
          "perps-v2-mental-model": {
            "title": "Perpetual futures: base positions, entry price, et mark vs oracle",
            "content": "# Perpetual futures: base positions, entry price, et mark vs oracle\n\nPerpetual futures (perps) are synthetic derivatives that let traders gain exposure to an asset's price movement without holding the underlying token. Unlike traditional futures avec expiry dates, perpetual contracts never settle. Instead, a funding rate mechanism keeps the contract price anchored to the spot price over time. Understanding how positions are represented, how entry prices work, et the distinction between mark et oracle prices is the foundation of every risk calculation that follows.\n\n## Position anatomy\n\nA perpetual futures position is defined by four core fields: side (long or short), size (the quantity of the base asset), entry price (the average cost basis), et margin (the collateral deposited). When you open a long position of 10 SOL-PERP at $22.50 avec $225 margin, you are expressing a bet that SOL's price will rise. The notional value of this position is size multiplied by the current mark price. Notional value changes continuously as the mark price moves, even though your entry price remains fixed until you modify the position.\n\nEntry price is not simply the price at the moment you clicked \"buy.\" If you add to an existing position, the entry price updates to the weighted average of the old et new fills. Pour example, if you hold 5 SOL-PERP at $20 et buy 5 more at $25, your new entry price becomes (5 * 20 + 5 * 25) / 10 = $22.50. Partial closes do not change the entry price — only additions do. Tracking entry price accurately is critical because every PnL calculation derives from the difference between entry et current price.\n\n## Mark price vs oracle price\n\nOn-chain perpetual protocols maintain two distinct prices: the mark price et the oracle price. The oracle price reflects the broader market's view of the asset's spot value. Solana protocols commonly use Pyth or Switchboard oracle feeds, which aggregate price data from multiple exchanges et publish updates on-chain every 400 milliseconds. The oracle price is the \"truth\" — the real-world value of the underlying asset.\n\nThe mark price is the protocol's internal valuation of the perpetual contract. It is typically derived from the oracle price plus a premium or discount that reflects supply et demand imbalance in the perp market itself. When there are more longs than shorts, the mark price trades above the oracle (positive premium). When shorts dominate, the mark trades below (negative premium). The formula varies by protocol but often follows: markPrice = oraclePrice + exponentialMovingAverage(premium).\n\nMark price is used pour all PnL calculations et liquidation triggers. Using mark price instead of raw trade price prevents manipulation attacks where a single large trade could spike the last-traded price et trigger mass liquidations. The mark price moves more smoothly because it incorporates the oracle as a stability anchor.\n\n## Why this matters pour risk\n\nEvery risk metric in a perps risk console depends on getting these fundamentals right. Unrealized PnL is computed against the mark price. Margin ratio is computed using notional value at mark price. Liquidation price is derived from the entry price et margin. If you confuse mark et oracle, or miscalculate entry price after position averaging, every downstream number is wrong.\n\nOn Solana specifically, oracle latency introduces an additional consideration. Pyth oracle updates propagate avec slot-level granularity (~400ms). During volatile periods, the oracle price can lag behind actual market moves by several hundred milliseconds. Protocols handle this by including confidence intervals in their oracle reads et rejecting prices avec excessively wide confidence bands. When building risk dashboards, always display the oracle confidence alongside the price et flag stale oracles (timestamps older than a few seconds).\n\n## Console conception principle\n\nA useful risk console must separate:\n1. directional performance (PnL),\n2. structural cost (funding + fees),\n3. survival risk (margin ratio + liquidation distance).\n\nBlending these into one number hides the decision signals traders actually need.\n\n## Checklist\n- Understand that perpetual futures never expire et use funding to track spot\n- Track entry price as a weighted average across all fills\n- Distinguish mark price (PnL, liquidation) from oracle price (funding, reference)\n- Monitor oracle staleness et confidence intervals\n- Compute notional value as size * markPrice\n\n## Red flags\n- Using last-traded price instead of mark price pour PnL\n- Forgetting to update entry price on position additions\n- Ignoring oracle confidence intervals during volatile markets\n- Assuming mark price equals oracle price (the premium matters)\n",
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
                    "prompt": "If you hold 8 SOL-PERP at $20 et buy 2 more at $30, what is your new entry price?",
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
            "title": "Funding rates: why they exist et how they accrue",
            "content": "# Funding rates: why they exist et how they accrue\n\nFunding rates are the mechanism that tethers a perpetual contract's price to the underlying spot price. Without funding, the perp price could drift arbitrarily far from reality because the contract never expires. Funding creates a periodic cash flow between longs et shorts that incentivizes convergence: when the perp trades above spot, longs pay shorts; when it trades below, shorts pay longs.\n\n## The convergence mechanism\n\nConsider a scenario where heavy demand from leveraged long traders pushes the SOL-PERP mark price to $23 while the SOL oracle price is $22. The premium is $1, or about 4.5%. The funding rate will be positive, meaning long holders pay short holders every funding interval. This payment makes it expensive to hold longs et attractive to hold shorts, which naturally pushes the perp price back toward spot. When the perp trades below spot (negative premium), funding flips: shorts pay longs, discouraging shorts et encouraging longs.\n\nThe funding rate is typically calculated as: fundingRate = clamp(premium / 24, -maxRate, +maxRate), where the premium is the percentage difference between mark et oracle prices, divided by 24 to normalize to an hourly rate. Most protocols on Solana settle funding every hour, though some use shorter intervals (every 8 hours is common on centralized exchanges). The clamp function prevents extreme rates during flash crashes or squeezes.\n\n## How funding accrues\n\nFunding is not a continuous stream — it settles at discrete intervals. At each funding timestamp, the protocol snapshots every open position et calculates: fundingPayment = positionSize * entryPrice * fundingRate. Pour a 10 SOL-PERP position at $25 entry avec a funding rate of 0.01% (0.0001), the payment is 10 * 25 * 0.0001 = $0.025 per interval.\n\nThe direction of payment depends on the position side et the sign of the funding rate. When the funding rate is positive: longs pay (their margin decreases) et shorts receive (their margin increases). When negative: shorts pay et longs receive. This is a zero-sum transfer — the total paid by one side exactly equals the total received by the other side, minus any protocol fees.\n\nCumulative funding matters more than any single payment. A position held pour 24 hours accumulates 24 hourly funding payments (or 3 eight-hour payments, depending on the protocol). During trending markets, cumulative funding can become a significant drag on PnL. A long position in a strongly bullish market might show +$100 unrealized PnL but have paid -$15 in cumulative funding, reducing the real return. Risk dashboards must display both unrealized PnL et cumulative funding separately so traders see the full picture.\n\n## Funding on Solana protocols\n\nSolana perps protocols like Drift, Mango Markets, et Jupiter Perps each implement funding slightly differently. Drift uses a time-weighted average premium over 1-hour windows. Jupiter Perps uses a simpler hourly mark-to-oracle premium. Mango uses an oracle-based funding model avec configurable parameters per market. Despite these differences, the core principle is identical: positive premium means longs pay shorts.\n\nOn-chain funding settlement on Solana happens through cranked instructions. A keeper bot calls a \"settle funding\" instruction at each interval, which iterates through positions et adjusts their realized PnL comptes. Positions that are not explicitly settled may accumulate pending funding payments that are only applied when the position is next touched (opened, closed, or cranked). This lazy evaluation means your displayed margin may not reflect unsettled funding until you interact avec the position.\n\n## Impact on risk monitoring\n\nPour risk console purposes, you must track: (1) the current funding rate et whether your position is paying or receiving, (2) cumulative funding paid or received since position open, (3) the net margin impact as a percentage of initial margin, et (4) projected funding cost if the current rate persists. A position that looks profitable on a PnL basis might be marginally unprofitable after accounting pour funding drag. Always include funding in your total return calculations.\n\n## Checklist\n- Understand that positive funding rate means longs pay shorts\n- Calculate funding payment as size * price * rate per interval\n- Track cumulative funding over the position's lifetime\n- Compte pour funding when computing real return (PnL + funding)\n- Monitor pour extreme funding rates that signal market imbalance\n\n## Red flags\n- Ignoring funding costs in PnL reporting\n- Confusing funding direction (positive rate = longs pay)\n- Not accounting pour lazy settlement on Solana protocols\n- Assuming funding is continuous rather than discrete-interval\n",
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
                      "Shorts pay longs — shorts are rewarded pour being correct",
                      "Both sides pay the protocol a fee"
                    ],
                    "answerIndex": 0,
                    "explanation": "A positive premium (mark > oracle) produces a positive funding rate. Longs pay shorts, which discourages excessive long demand et pushes the perp price back toward spot."
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
            "content": "# PnL visualization: tracking profit over time\n\nProfit et loss (PnL) tracking in perpetual futures requires careful accounting across multiple dimensions: unrealized PnL from price movement, realized PnL from closed portions, funding payments, et trading fees. A well-built PnL visualization shows traders not just where they stand now, but how they arrived there — which is essential pour risk management et strategy refinement.\n\n## Unrealized vs realized PnL\n\nUnrealized PnL represents the paper profit or loss on your open position. Pour a long position: unrealizedPnL = size * (markPrice - entryPrice). Pour a short: unrealizedPnL = size * (entryPrice - markPrice). This number changes avec every price tick et represents what you would gain or lose if you closed the position right now at the mark price.\n\nRealized PnL is locked in when you close all or part of a position. If you opened 10 SOL-PERP long at $20 et close 5 contracts at $25, you realize 5 * (25 - 20) = $25 profit. The remaining 5 contracts continue to have unrealized PnL based on the current mark price versus your (unchanged) entry of $20. Realized PnL is permanent — it has already been credited to your margin compte. Unrealized PnL fluctuates et may increase or decrease.\n\nTotal PnL = realized + unrealized + cumulative funding. This is the true measure of position performance. Displaying all three components separately gives traders insight into whether their profits come from directional moves (unrealized), successful trades (realized), or favorable funding conditions.\n\n## Return on equity (ROE)\n\nROE measures the percentage return relative to the initial margin deposited. ROE = (unrealizedPnL / initialMargin) * 100. A position avec $25 unrealized PnL on $225 margin has an ROE of 11.11%. Because perpetual futures are leveraged instruments, ROE can be dramatically higher (or lower) than the percentage price change. Avec 10x leverage, a 5% price move produces approximately 50% ROE.\n\nROE is the primary performance metric pour comparing positions across different sizes et leverage levels. A $10 profit on $100 margin (10% ROE) represents better capital efficiency than $10 profit on $1000 margin (1% ROE), even though the dollar PnL is identical. Risk consoles should display ROE prominently alongside raw PnL.\n\n## Time-series visualization\n\nPlotting PnL over time reveals patterns invisible in a single snapshot. Key elements of a PnL time series: (1) The unrealized PnL curve, moving avec each mark price update. (2) Step changes when partial closes realize PnL. (3) Small periodic steps from funding payments. (4) The cumulative total line combining all components.\n\nPour Solana protocols, PnL snapshots can be captured at each slot (~400ms) or aggregated into minute/hour candles pour longer timeframes. Real-time WebSocket feeds from RPC nodes provide mark price updates, et funding payments appear as on-chain events at each settlement interval. A production risk console typically polls mark prices every 1-5 seconds et updates the PnL display accordingly.\n\n## Break-even analysis\n\nThe break-even price comptes pour all costs: trading fees, funding payments, et slippage. Pour a long position: breakEvenPrice = entryPrice + (totalFees + cumulativeFundingPaid) / size. If you entered at $22.50 avec $0.50 in total costs on a 10-unit position, your break-even is $22.55. Displaying the break-even line on the PnL chart gives traders a clear target — the position is only truly profitable when the mark price exceeds this line.\n\n## Visualization bonnes pratiques\n\nEffective PnL dashboards use color coding consistently: green pour positive PnL, red pour negative. The zero line should be visually prominent. Hover tooltips should show the exact PnL at any point in time. Consider showing both absolute dollar PnL et percentage ROE on dual axes. Include funding annotations as small markers on the time axis so traders can see when funding events impacted their PnL curve.\n\n## Checklist\n- Separate unrealized, realized, et funding components in the display\n- Calculate ROE relative to initial margin, not current margin\n- Include break-even price accounting pour all costs\n- Update PnL in near-real-time using mark price feeds\n- Annotate funding events on the PnL time series\n\n## Red flags\n- Showing only unrealized PnL without funding impact\n- Computing ROE against notional value instead of margin\n- Not distinguishing realized from unrealized PnL\n- Updating PnL using oracle price instead of mark price\n",
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
            "content": "# Challenge: Calculate perpetual futures PnL\n\nImplement a PnL calculator pour perpetual futures positions:\n\n- Compute unrealized PnL based on entry price vs mark price\n- Handle both long et short positions correctly\n- Calculate notional value as size * markPrice\n- Compute ROE (return on equity) as a percentage of initial margin\n- Format all outputs avec appropriate decimal precision\n\nYour calculator must be deterministic — same input always produces the same output.",
            "duration": "50 min",
            "hints": [
              "Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice).",
              "Notional value = size * markPrice — represents the total position value.",
              "ROE (return on equity) = unrealizedPnL / margin * 100.",
              "Use toFixed(2) pour prices et PnL, toFixed(4) pour size et ROE."
            ]
          },
          "perps-v2-funding-accrual": {
            "title": "Challenge: Simulate funding rate accrual",
            "content": "# Challenge: Simulate funding rate accrual\n\nBuild a funding accrual simulator that processes discrete funding intervals:\n\n- Iterate through an array of funding rates et compute the payment pour each period\n- Longs pay (subtract from balance) when the funding rate is positive\n- Shorts receive (add to balance) when the funding rate is positive\n- Track cumulative funding, average rate, et net margin impact\n- Handle negative funding rates where the direction reverses\n\nThe simulator must be deterministic — same inputs always produce the same result.",
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
        "description": "Margin et liquidation monitoring, implementation bug traps, et deterministic risk-console outputs pour production observability.",
        "lessons": {
          "perps-v2-margin-liquidation": {
            "title": "Margin ratio et liquidation thresholds",
            "content": "# Margin ratio et liquidation thresholds\n\nMargin is the collateral that backs a leveraged position. When the margin falls below a critical threshold relative to the position's notional value, the protocol forcibly closes the position to prevent the trader from owing more than they deposited. Understanding margin mechanics, the maintenance margin threshold, et how liquidation prices are calculated is essential pour risk monitoring.\n\n## Initial margin et leverage\n\nInitial margin is the collateral deposited when opening a position. The leverage multiple is: leverage = notionalValue / initialMargin. A position avec $250 notional value et $25 margin is 10x leveraged. Higher leverage amplifies both gains et losses. At 10x, a 10% adverse price move wipes out 100% of the margin. At 20x, only a 5% move is needed to reach zero.\n\nSolana perps protocols typically allow leverage up to 20x or even 50x on major pairs (SOL, BTC, ETH) et lower leverage (5x-10x) on altcoins avec thinner liquidity. The maximum leverage is governed by the maintenance margin rate — a lower maintenance margin rate allows higher maximum leverage.\n\n## Maintenance margin\n\nThe maintenance margin rate (MMR) is the minimum margin ratio a position must maintain to avoid liquidation. If the MMR is 5% (0.05), the effective margin must be at least 5% of the notional value at all times. Effective margin comptes pour unrealized PnL et funding: effectiveMargin = initialMargin + unrealizedPnL + cumulativeFunding. The margin ratio is: marginRatio = effectiveMargin / notionalValue.\n\nWhen the margin ratio drops below the MMR, the position is eligible pour liquidation. Protocols don't wait pour the margin to reach exactly zero — the maintenance buffer ensures there is still some collateral left to cover liquidation fees, slippage, et potential bad debt. If a position's losses exceed its margin entirely, the deficit becomes \"bad debt\" that must be absorbed by an insurance fund or socialized across other traders.\n\n## Liquidation price calculation\n\nThe liquidation price is the mark price at which the margin ratio exactly equals the maintenance margin rate. Pour a long position: liquidationPrice = entryPrice - (margin + cumulativeFunding - notional * MMR) / size. Pour a short: liquidationPrice = entryPrice + (margin + cumulativeFunding - notional * MMR) / size.\n\nThis formula comptes pour the fact that as the mark price moves against you, both the unrealized PnL (reducing effective margin) et the notional value (the denominator of margin ratio) change simultaneously. The liquidation price is not simply \"entry price minus margin per unit\" — the maintenance margin requirement means liquidation triggers before your margin is fully depleted.\n\nPour example, consider a 10 SOL-PERP long at $22.50 avec $225 margin et 5% MMR. The notional at entry is 10 * 22.50 = $225. Liquidation triggers when effectiveMargin / notional = 0.05, which solves to a mark price near $2.05 in this well-margined case. Avec higher leverage (less margin), the liquidation price would be much closer to entry.\n\n## Cascading liquidations\n\nDuring sharp market moves, many positions hit their liquidation prices simultaneously. Liquidation engines close these positions by selling into the order book (or AMM pools), which pushes the price further in the adverse direction, triggering more liquidations. This cascade effect — also called a \"liquidation spiral\" — can cause prices to move far beyond what fundamentals justify.\n\nOn Solana, liquidation is performed by keeper bots that submit liquidation transactions. These bots compete pour liquidation opportunities because protocols offer a liquidation fee (typically 0.5-2% of the position's notional) as an incentive. During cascades, keeper bots may face congestion issues as many liquidation transactions compete pour block space. Partial liquidation — closing only enough of a position to restore the margin ratio above MMR — helps reduce cascade severity by keeping some of the position alive.\n\n## Risk monitoring thresholds\n\nA production risk console should alert at multiple thresholds: (1) WARNING when the margin ratio drops below 1.5x the MMR (e.g., 7.5% when MMR is 5%), (2) CRITICAL when below the MMR itself (liquidation imminent), et (3) INFO when unrealized PnL exceeds a significant percentage of margin (positive or negative). These alerts give traders time to add margin, reduce position size, or close entirely before forced liquidation.\n\n## Checklist\n- Calculate effective margin including unrealized PnL et funding\n- Compute margin ratio as effectiveMargin / notionalValue\n- Derive liquidation price from entry price, margin, et MMR\n- Set warning thresholds above the MMR to give early alerts\n- Compte pour liquidation fees in worst-case scenarios\n\n## Red flags\n- Computing liquidation price without accounting pour the maintenance buffer\n- Ignoring funding in effective margin calculations\n- Not alerting traders before they reach the liquidation threshold\n- Assuming the mark price at liquidation equals the execution price (slippage exists)\n",
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
                      "To ensure remaining collateral covers liquidation fees et slippage, preventing bad debt",
                      "To make it harder pour traders to open positions",
                      "To generate more revenue pour the protocol"
                    ],
                    "answerIndex": 0,
                    "explanation": "The maintenance buffer ensures that when a position is liquidated, there is still margin left to pay liquidation fees et absorb slippage during the close. Without it, positions could go underwater, creating bad debt."
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
            "title": "Common bugs: sign errors, units, et funding direction",
            "content": "# Common bugs: sign errors, units, et funding direction\n\nPerpetual futures implementations are mathematically straightforward — the formulas are basic arithmetic. Yet sign errors, unit mismatches, et funding direction bugs are among the most frequent et costly mistakes in DeFi development. A single flipped sign can turn profits into losses, liquidate healthy positions, or drain insurance funds. This lecon catalogs the most common pitfalls et how to avoid them.\n\n## Sign errors in PnL calculations\n\nThe most fundamental bug: getting the sign wrong on PnL pour short positions. Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice). Note that short PnL is NOT size * (markPrice - entryPrice) avec a negated size. The size is always positive — it represents the quantity of contracts. The direction is captured in the formula itself. A common mistake is storing size as negative pour shorts et using a single formula: pnl = size * (markPrice - entryPrice). While mathematically equivalent when size is negative, this representation causes bugs everywhere else: notional value calculations, funding payments, margin ratios, et liquidation prices all need absolute size.\n\nRule: Keep size always positive. Branch on the side field to select the correct formula. Never rely on sign conventions embedded in other fields.\n\n## Unit et decimal mismatches\n\nSolana token amounts are raw integers (lamports, token base units). Prices from oracles are typically fixed-point numbers avec specific exponents. Mixing these without proper conversion produces catastrophically wrong values.\n\nExample: SOL has 9 decimals on-chain. If a position size is stored as 10_000_000_000 (10 SOL in lamports) et you multiply by a price of 22.50 (a floating-point dollar value), you get 225,000,000,000 — which might look like a notional value, but it is in lamports-times-dollars, a nonsensical unit. You must either convert size to human-readable units first (divide by 10^9), or keep everything in integer space avec a consistent exponent.\n\nRule: Define a canonical unit convention at the start of your project. Either work entirely in human-readable floats (acceptable pour display/simulation code) or entirely in integer base units avec explicit scaling factors (required pour on-chain code). Never mix the two.\n\n## Funding direction confusion\n\nThe funding direction rule is: \"positive funding rate means longs pay shorts.\" This is universal across all major protocols. Yet developers frequently implement it backwards, especially when reasoning about \"who benefits.\" When the rate is positive, the market is bullish (more longs than shorts). Longs pay to discourage the imbalance. Shorts receive as compensation pour providing the other side.\n\nIn code, the mistake looks like this:\n- WRONG: if (side === \"long\") totalFunding += payment;\n- RIGHT: if (side === \"long\") totalFunding -= payment;\n\nWhen the funding rate is positive et the side is long, the payment reduces the trader's balance. When negative et long, the payment increases the balance (longs receive). Test every combination: positive rate + long, positive rate + short, negative rate + long, negative rate + short.\n\n## Liquidation price off-by-one\n\nThe liquidation price formula must compte pour the maintenance margin requirement. A common bug is computing the price at which margin equals zero rather than the price at which margin equals the maintenance requirement. This results in a liquidation price that is too aggressive — the position would be liquidated later than expected, potentially accumulating bad debt.\n\nAnother variant: forgetting to include cumulative funding in the liquidation price calculation. If a long position has paid $5 in funding, its effective margin is $5 less than the initial deposit, et the liquidation price is correspondingly closer to the entry price.\n\n## Margin ratio denominator\n\nMargin ratio = effectiveMargin / notionalValue. The notional value must use the current mark price, not the entry price. Using entry price pour notional gives an incorrect ratio because the actual exposure changes as the mark price moves. A position avec $225 entry notional that has moved to $250 mark notional has a lower margin ratio than the entry-price calculation suggests — the position has grown while the margin remains fixed.\n\n## Integer overflow in funding accumulation\n\nWhen accumulating funding over hundreds or thousands of periods, floating-point precision errors can compound. Each period adds a small number (e.g., 0.025), et after thousands of additions, the accumulated error can become material. Using fixed-point arithmetic or rounding at each step (avec a consistent rounding convention) prevents drift. In JavaScript, toFixed() at the final output step is sufficient pour display, but intermediaire calculations should preserve full precision.\n\n## Tests strategy\n\nEvery perps calculation should have test cases covering: (1) Long avec profit, (2) Long avec loss, (3) Short avec profit, (4) Short avec loss, (5) Positive funding rate pour both sides, (6) Negative funding rate pour both sides, (7) Zero funding rate, (8) Zero-margin edge case. If any single combination is missing from your test suite, the corresponding bug can ship undetected.\n\n## Checklist\n- Use separate formulas pour long et short PnL, not sign-encoded size\n- Define et enforce a canonical unit convention (human-readable vs base units)\n- Test all four combinations of funding direction (2 sides x 2 rate signs)\n- Include maintenance margin in liquidation price calculations\n- Use mark price (not entry price) pour notional value in margin ratio\n\n## Red flags\n- Negative position sizes used to encode short direction\n- Mixing lamport-scale et dollar-scale values in the same calculation\n- Funding payment that adds to long balances when the rate is positive\n- Liquidation price computed at zero margin instead of maintenance margin\n- Margin ratio using entry-price notional instead of mark-price notional\n",
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
                      "Negative size creates sign-convention bugs in notional, funding, margin, et liquidation calculations",
                      "Solana comptes cannot store negative numbers",
                      "Positive numbers use less storage space"
                    ],
                    "answerIndex": 0,
                    "explanation": "When size carries the direction sign, every formula that uses size must compte pour the sign — not just PnL, but also notional value, funding payments, et liquidation price. Keeping size positive et branching on a separate 'side' field is safer et more explicit."
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
            "content": "# Checkpoint: Generate a Risk Console Report\n\nBuild the comprehensive risk console report that integrates all cours concepts:\n\n- Calculate unrealized PnL et ROE pour the position\n- Accumulate funding payments across all provided funding rate intervals\n- Compute effective margin (initial + PnL + funding) et margin ratio\n- Derive the liquidation price accounting pour maintenance margin et funding\n- Generate severity-tiered alerts (CRITICAL, WARNING, INFO) based on thresholds\n- Output must be stable JSON avec deterministic structure\n\nThis checkpoint validates your complete understanding of perpetual futures risk management.",
            "duration": "55 min",
            "hints": [
              "Effective margin = initial margin + unrealized PnL + funding payments.",
              "Margin ratio = effectiveMargin / notionalValue.",
              "Liquidation price pour longs: entryPrice - (margin + funding - notional*mmRate) / size.",
              "Generate alerts based on margin ratio vs maintenance margin rate thresholds.",
              "Sort alerts by severity: CRITICAL > WARNING > INFO."
            ]
          }
        }
      }
    }
  },
  "defi-tx-optimizer": {
    "title": "DeFi Transaction Optimizer",
    "description": "Master Solana DeFi transaction optimization: compute/fee tuning, ALT strategy, reliability patterns, et deterministic send-strategy planning.",
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
        "title": "Transaction Fundamentals",
        "description": "Transaction failure diagnosis, compute budget mechanics, priority-fee strategy, et fee estimation foundations.",
        "lessons": {
          "txopt-v2-why-fail": {
            "title": "Why DeFi transactions fail: CU limits, size, et blockhash expiry",
            "content": "# Why DeFi transactions fail: CU limits, size, et blockhash expiry\n\nDeFi transactions on Solana fail pour three primary reasons: compute budget exhaustion, transaction size overflow, et blockhash expiry. Understanding each failure mode is essential before attempting any optimization, because the fix pour each is fundamentally different. Misdiagnosing the failure category leads to wasted effort et frustrated users.\n\n## Compute budget exhaustion\n\nEvery Solana transaction executes within a compute budget measured in compute units (CUs). The default budget is 200,000 CUs per transaction, which is sufficient pour simple transfers but far too low pour complex DeFi operations. A single AMM swap through a concentrated liquidity pool can consume 100,000-200,000 CUs. Multi-hop routes, flash loans, or transactions that interact avec multiple protocols easily exceed 400,000 CUs. When a transaction exceeds its compute budget, the runtime aborts execution et returns a `ComputeBudgetExceeded` error. The transaction fee is still charged because the validateur performed work before the limit was hit.\n\nThe solution is the `SetComputeUnitLimit` instruction from the Compute Budget Program. This instruction must be the first instruction in the transaction (by convention) et tells the runtime exactly how many CUs to allocate. Setting the limit too low causes failures; setting it too high wastes priority fee budget because priority fees are calculated per CU requested (not consumed). The optimal approach is to simulate the transaction first, observe the actual CU consumption, add a 10% safety margin, et use that as the limit.\n\n## Transaction size limits\n\nSolana transactions have a hard size limit of 1,232 bytes when serialized. This limit applies to the entire transaction packet including signatures, message header, compte keys, recent blockhash, et instruction data. Each compte key consumes 32 bytes. A transaction referencing 30 unique comptes uses 960 bytes pour compte keys alone, leaving very little room pour instruction data et signatures.\n\nDeFi transactions are particularly compte-heavy. A single Raydium CLMM swap requires the user portefeuille, input token compte, output token compte, pool state, AMM config, observation state, token vaults (x2), tick arrays (up to 3), oracle, et program IDs. Chaining multiple swaps in a single transaction can easily push the compte count past 40, which exceeds the 1,232-byte limit avec standard compte encoding. This is where Address Lookup Tables (ALTs) become essential, compressing each compte reference from 32 bytes to just 1 byte pour comptes stored in the lookup table.\n\n## Blockhash expiry\n\nEvery Solana transaction includes a recent blockhash that serves as a replay protection mechanism et a timestamp. A blockhash is valid pour approximately 60 seconds (roughly 150 slots at 400ms per slot). If a transaction is not included in a block before the blockhash expires, it becomes permanently invalid et can never be processed. The transaction simply disappears without any on-chain error record.\n\nBlockhash expiry is the most insidious failure mode because it produces no error message. The transaction is silently dropped. This happens frequently during network congestion when transactions queue pour longer than expected, or when users take too long to review et approve a transaction in their portefeuille. The correct handling is to monitor pour confirmation avec a timeout, et if the transaction is not confirmed within 30 seconds, fetch a new blockhash, rebuild et re-sign the transaction, et resubmit.\n\n## Interaction between failure modes\n\nThese three failure modes often interact. A developer might add more instructions to avoid multiple transactions (reducing blockhash expiry risk), but this increases both CU consumption et transaction size. Optimizing pour one dimension can worsen another. The art of transaction optimization is finding the right balance: enough CU budget to complete execution, compact enough to fit in 1,232 bytes, et fast enough submission to land before the blockhash expires.\n\n## Production triage rule\n\nDiagnose transaction failures in strict order:\n1. did it fit et simulate,\n2. did it propagate et include,\n3. did it confirm before expiry.\n\nThis sequence prevents noisy fixes et reduces false assumptions during incidents.\n\n## Diagnostic checklist\n- Check transaction logs pour `ComputeBudgetExceeded` when CU is the issue\n- Check serialized transaction size against the 1,232-byte limit\n- Monitor confirmation status to detect silent blockhash expiry\n- Simulate transactions before sending to catch CU et compte issues early\n- Track failure rates by category to identify systemic problems\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l1-q1",
                    "prompt": "What is the default compute unit budget pour a Solana transaction?",
                    "options": [
                      "200,000 CUs",
                      "1,400,000 CUs",
                      "50,000 CUs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana allocates 200,000 CUs by default. DeFi transactions almost always need more, requiring an explicit SetComputeUnitLimit instruction."
                  },
                  {
                    "id": "txopt-v2-l1-q2",
                    "prompt": "What happens when a transaction's blockhash expires before it is confirmed?",
                    "options": [
                      "The transaction is silently dropped avec no on-chain error",
                      "The transaction fails avec a BlockhashExpired error on-chain",
                      "The validateur retries avec a fresh blockhash automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired blockhash transactions are never processed et produce no on-chain record. The client must detect the timeout et resubmit avec a fresh blockhash."
                  }
                ]
              }
            ]
          },
          "txopt-v2-compute-budget": {
            "title": "Compute budget instructions et priority fee strategy",
            "content": "# Compute budget instructions et priority fee strategy\n\nThe Compute Budget Program provides two critical instructions that every serious DeFi transaction should include: `SetComputeUnitLimit` et `SetComputeUnitPrice`. Together, they control how much computation your transaction can perform et how much you are willing to pay pour priority inclusion in a block.\n\n## SetComputeUnitLimit\n\nThis instruction sets the maximum number of compute units the transaction can consume. The value must be between 1 et 1,400,000 (the per-transaction maximum on Solana). The instruction takes a single u32 parameter representing the CU limit. When omitted, the runtime uses the default of 200,000 CUs.\n\nChoosing the right limit requires profiling. Use `simulateTransaction` on an RPC node to execute the transaction without landing it on-chain. The simulation response includes `unitsConsumed`, which tells you exactly how many CUs the transaction used. Add a 10% safety margin to this value: `Math.ceil(unitsConsumed * 1.1)`. This margin comptes pour minor variations in CU consumption between simulation et actual execution (e.g., different slot, slightly different compte state).\n\nSetting the limit exactly to the simulated value is risky because CU consumption can vary slightly between simulation et execution. Setting it 2x or 3x higher is wasteful because your priority fee is calculated against the requested limit, not the consumed amount. The 10% margin provides a good balance between safety et cost efficiency.\n\n## SetComputeUnitPrice\n\nThis instruction sets the priority fee in micro-lamports per compute unit. A micro-lamport is one millionth of a lamport (1 lamport = 0.000000001 SOL). The priority fee is calculated as: `priorityFee = ceil(computeUnitLimit * computeUnitPrice / 1,000,000)` lamports.\n\nPour example, avec a CU limit of 200,000 et a CU price of 5,000 micro-lamports: `ceil(200,000 * 5,000 / 1,000,000) = ceil(1,000) = 1,000 lamports`. This is added on top of the base fee of 5,000 lamports per signature (typically one signature pour user transactions).\n\n## Priority fee market dynamics\n\nSolana validateurs order transactions within a block by priority fee (micro-lamports per CU). During low-congestion periods, even a CU price of 1 micro-lamport is sufficient. During high-demand events (popular NFT mints, volatile market moments, new token launches), competitive CU prices can reach 100,000+ micro-lamports.\n\nThe priority fee market is highly dynamic. Strategies pour choosing the right price include: (1) Static pricing: set a fixed CU price based on the expected congestion level. Simple but often suboptimal. (2) Recent-fee sampling: query `getRecentPrioritizationFees` from the RPC to see what fees landed in recent blocks. Use the median or 75th percentile as your price. (3) Percentile targeting: decide what probability of inclusion you want (e.g., 90% chance of landing in the next block) et price accordingly.\n\n## Fee calculation formula\n\nThe total transaction fee follows this formula:\n\n```\nbaseFee = 5000 lamports (per signature)\npriorityFee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) lamports\ntotalFee = baseFee + priorityFee\n```\n\nWhen building a transaction planner, these calculations must use integer arithmetic to match on-chain behavior. Floating-point rounding differences can cause fee estimate mismatches that confuse users.\n\n## Instruction ordering\n\nCompute budget instructions must appear before any other instructions in the transaction. The runtime processes them during transaction validation, before executing program instructions. Placing them after other instructions is technically allowed but violates convention et may cause issues avec some tools et portefeuilles.\n\n## Pratique recommendations\n- Always include both SetComputeUnitLimit et SetComputeUnitPrice\n- Simulate first, then set CU limit to ceil(consumed * 1.1)\n- Sample recent fees et use the 75th percentile pour reliable inclusion\n- Display the total fee estimate to users before they sign\n- Cap the CU limit at 1,400,000 (Solana maximum per transaction)\n",
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
                      "CU consumption can vary slightly between simulation et execution due to state changes",
                      "The runtime does not accept exact values",
                      "Simulation always underreports CU usage by 50%"
                    ],
                    "answerIndex": 0,
                    "explanation": "Compte state may change between simulation et execution, causing minor CU variations. A 10% margin absorbs these differences."
                  }
                ]
              }
            ]
          },
          "txopt-v2-cost-explorer": {
            "title": "Transaction cost estimation et fee planning",
            "content": "# Transaction cost estimation et fee planning\n\nAccurate fee estimation is the foundation of a good DeFi user experience. Users need to know what a transaction will cost before they sign it. Validateurs need sufficient fees to prioritize your transaction. Getting fee estimation right means understanding the components, profiling real transactions, et adapting to market conditions.\n\n## Components of transaction cost\n\nA Solana transaction's cost has three components: (1) the base fee, which is 5,000 lamports per signature et is fixed by protocol; (2) the priority fee, which is variable et determined by the compute unit price you set; et (3) the rent cost pour any new comptes created by the transaction (e.g., creating an Associated Token Compte costs approximately 2,039,280 lamports in rent-exempt minimum balance).\n\nPour DeFi transactions that do not create new comptes, the cost is simply base fee plus priority fee. Pour transactions that create ATAs or other comptes, the rent deposits significantly increase the total cost et should be displayed separately in the UI since rent is recoverable when the compte is closed.\n\n## CU profiling\n\nProfiling compute unit consumption across different operation types builds an estimation model. Common DeFi operations et their typical CU ranges:\n\n- SOL transfer: 2,000-5,000 CUs\n- SPL token transfer: 4,000-8,000 CUs\n- Create ATA (idempotent): 25,000-35,000 CUs\n- Simple AMM swap (constant product): 60,000-120,000 CUs\n- CLMM swap (concentrated liquidity): 100,000-200,000 CUs\n- Multi-hop route (2 legs): 200,000-400,000 CUs\n- Flash loan + swap: 300,000-600,000 CUs\n\nThese ranges vary based on pool state, tick array crossings in CLMM pools, et program version. Profiling your specific use case avec simulation produces much more accurate estimates than using generic ranges.\n\n## Fee market analysis\n\nThe priority fee market fluctuates based on network demand. During quiet periods (off-peak hours, low volatility), median priority fees hover around 1-100 micro-lamports per CU. During peak events, fees can spike to 10,000-1,000,000+ micro-lamports per CU.\n\nFetching recent fee data from `getRecentPrioritizationFees` returns fee levels from the last 150 slots. Computing percentiles (25th, 50th, 75th, 90th) from this data provides a fee distribution that informs pricing strategy:\n- 25th percentile: economy — may take multiple blocks to land\n- 50th percentile: standard — lands in 1-2 blocks under normal conditions\n- 75th percentile: fast — high probability of next-block inclusion\n- 90th percentile: urgent — nearly guaranteed next-block inclusion\n\n## Fee tiers pour user selection\n\nPresent fee estimates at multiple priority levels so users can choose their urgency. A typical tier structure:\n\n- Low priority: 100 micro-lamports/CU — suitable pour non-urgent operations\n- Medium priority: 1,000 micro-lamports/CU — standard DeFi operations\n- High priority: 10,000 micro-lamports/CU — time-sensitive trades\n\nEach tier produces a different total fee: `baseFee + ceil(cuLimit * tierPrice / 1,000,000)`. Display all three alongside estimated confirmation times to help users make informed decisions.\n\n## Dynamic fee adjustment\n\nProduction systems should adjust fee tiers based on real-time market data rather than using static values. Query recent fees every 10-30 seconds et update the tier prices to reflect current conditions. During congestion spikes, automatically increase the default tier to ensure transactions land. During quiet periods, reduce fees to save users money.\n\n## Cost display bonnes pratiques\n- Show total fee in both lamports et SOL equivalent\n- Separate base fee, priority fee, et rent deposits\n- Indicate the priority level et expected confirmation time\n- Update fee estimates in real-time as market conditions change\n- Warn users when fees are unusually high compared to recent averages\n",
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
            "title": "Challenge: Build a transaction plan avec compute budgeting",
            "content": "# Challenge: Build a transaction plan avec compute budgeting\n\nBuild a transaction planning function that analyzes a set of instructions et produces a complete transaction plan:\n\n- Sum estimatedCU from all instructions et add a 10% safety margin (ceiling)\n- Cap the compute unit limit at 1,400,000 (Solana maximum)\n- Calculate priority fee: ceil(computeUnitLimit * computeUnitPrice / 1,000,000)\n- Calculate total fee: base fee (5,000 lamports) + priority fee\n- Count unique compte keys across all instructions\n- Add 2 to instruction count pour SetComputeUnitLimit et SetComputeUnitPrice\n- Flag needsVersionedTx when unique comptes exceed 35\n\nYour plan must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Sum estimatedCU from all instructions, then add 10% margin: ceil(total * 1.1).",
              "Cap compute unit limit at 1,400,000 (Solana max).",
              "Priority fee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) in lamports.",
              "Total fee = base fee (5000 lamports) + priority fee.",
              "Versioned tx needed when unique compte keys exceed 35."
            ]
          }
        }
      },
      "txopt-v2-optimization": {
        "title": "Optimization & Strategy",
        "description": "Address Lookup Table planning, reliability/retry patterns, actionable error UX, et full send-strategy reporting.",
        "lessons": {
          "txopt-v2-lut-planner": {
            "title": "Challenge: Plan Address Lookup Table usage",
            "content": "# Challenge: Plan Address Lookup Table usage\n\nBuild a function that determines the optimal Address Lookup Table strategy pour a transaction:\n\n- Collect all unique compte keys across instructions\n- Check which keys exist in available LUTs\n- Calculate transaction size: base overhead (200 bytes) + keys * 32 bytes each\n- Avec LUT: non-LUT keys cost 32 bytes, LUT keys cost 1 byte each\n- Recommend \"legacy\" if the transaction fits in 1,232 bytes without LUT\n- Recommend \"use-existing-lut\" if LUT keys make it fit\n- Recommend \"create-new-lut\" if it still does not fit even avec available LUTs\n- Return byte savings from LUT usage\n\nYour planner must be fully deterministic -- same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Collect all unique compte keys across instructions into a set.",
              "Each key costs 32 bytes without LUT, 1 byte avec LUT.",
              "Base transaction overhead is ~200 bytes. Max legacy tx size is 1232 bytes.",
              "Recommend 'legacy' if fits without LUT, 'use-existing-lut' if LUT helps enough, 'create-new-lut' if still too large."
            ]
          },
          "txopt-v2-reliability": {
            "title": "Reliability patterns: retry, re-quote, resend vs rebuild",
            "content": "# Reliability patterns: retry, re-quote, resend vs rebuild\n\nProduction DeFi applications must handle transaction failures gracefully. The difference between a frustrating et a reliable experience comes down to retry strategy: knowing when to resend the same transaction, when to rebuild avec fresh parameters, et when to abort et inform the user.\n\n## Failure classification\n\nTransaction failures fall into two categories: retryable et non-retryable. Correct classification is the foundation of any retry strategy.\n\nRetryable failures include: (1) blockhash expired -- the transaction was not included in time, re-fetch blockhash et resend; (2) network timeout -- the RPC node did not respond, try again or switch nodes; (3) rate limiting (HTTP 429) -- back off et retry after the specified delay; (4) node behind -- the RPC node's slot is behind the cluster, try a different node; et (5) transaction not found after send -- may need to resend.\n\nNon-retryable failures include: (1) insufficient funds -- user does not have enough balance; (2) slippage exceeded -- pool price moved beyond tolerance, must re-quote; (3) compte does not exist -- expected compte is missing; (4) program error avec specific error code -- the program logic rejected the transaction; et (5) invalid instruction data -- the transaction was constructed incorrectly.\n\n## Resend vs rebuild\n\nResending means submitting the exact same signed transaction bytes again. This is safe because Solana deduplicates transactions by signature -- if the original transaction was already processed, the resend is ignored. Resending is appropriate when: the transaction was sent but confirmation timed out, the RPC node returned a transient error, or you suspect the transaction was not propagated to the leader.\n\nRebuilding means constructing a new transaction from scratch avec fresh parameters: new blockhash, possibly updated compte state, re-simulated CU estimate, et new signature. Rebuilding is necessary when: the blockhash expired (cannot resend avec stale blockhash), slippage was exceeded (pool state changed, need fresh quote), or compte state changed (e.g., ATA was created by another transaction in the meantime).\n\nThe decision tree is: if the failure is a network/delivery issue, resend; if the failure indicates stale state, rebuild; if the failure indicates a permanent problem (insufficient balance, invalid instruction), abort avec a clear error.\n\n## Exponential backoff avec jitter\n\nRetry timing must use exponential backoff to avoid overwhelming the network during congestion. The formula is:\n\n```\ndelay = baseDelay * (backoffMultiplier ^ attemptNumber) + random jitter\n```\n\nAvec a base delay of 500ms et a 2x multiplier: attempt 1 waits ~500ms, attempt 2 waits ~1,000ms, attempt 3 waits ~2,000ms. Adding random jitter of +/-25% prevents synchronized retries from many clients hitting the same RPC endpoint simultaneously.\n\nCap retries at 3 attempts pour user-initiated transactions. More retries introduce unacceptable latency (users do not want to wait 10+ seconds). Pour backend/automated transactions, higher retry counts (5-10) may be acceptable.\n\n## Blockhash refresh on retry\n\nEvery retry that involves rebuilding must fetch a fresh blockhash. Using the same blockhash across retries is dangerous because the blockhash may have already expired or be close to expiry. The retry flow is: (1) fetch new blockhash, (2) rebuild transaction message avec new blockhash, (3) re-sign avec user portefeuille (or programmatic keypair), (4) simulate the rebuilt transaction, (5) send if simulation succeeds.\n\nPour portefeuille-connected applications, re-signing requires another user interaction (portefeuille popup). To minimize this friction, some applications use durable nonces instead of blockhashes. Durable nonces do not expire, eliminating the need to re-sign on retry. However, durable nonces have their own complexity et are not universally supported.\n\n## User-facing retry UX\n\nPresent retry progress clearly: show the attempt number, what went wrong, et what is happening next. Example states: \"Sending transaction...\" -> \"Transaction not confirmed, retrying (2/3)...\" -> \"Refreshing quote...\" -> \"Success!\" or \"Failed after 3 attempts. [Try Again] [Cancel]\". Never retry silently -- users should always know what is happening avec their transaction.\n\n## Checklist\n- Classify every failure as retryable or non-retryable\n- Use exponential backoff (500ms base, 2x multiplier) avec jitter\n- Cap retries at 3 pour user-initiated transactions\n- Refresh blockhash on every rebuild attempt\n- Distinguish resend (same bytes) from rebuild (new transaction)\n- Show retry progress in the UI avec clear status messages\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "txopt-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "txopt-v2-l6-q1",
                    "prompt": "When should you rebuild a transaction instead of resending it?",
                    "options": [
                      "When the blockhash has expired or pool state has changed",
                      "Whenever any error occurs",
                      "Only when the user manually clicks retry"
                    ],
                    "answerIndex": 0,
                    "explanation": "Rebuilding is necessary when the transaction's blockhash is stale or when on-chain state has changed (e.g., slippage exceeded). Simple network issues only require resending the same bytes."
                  },
                  {
                    "id": "txopt-v2-l6-q2",
                    "prompt": "Why add random jitter to retry delays?",
                    "options": [
                      "To prevent many clients from retrying at the exact same moment et overwhelming the network",
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
            "title": "UX: actionable error messages pour transaction failures",
            "content": "# UX: actionable error messages pour transaction failures\n\nRaw Solana error messages are cryptic. \"Transaction simulation failed: Error processing Instruction 2: custom program error: 0x1771\" tells a developer something but tells a user nothing. Mapping program errors to clear, actionable messages is essential pour DeFi application quality.\n\n## Error taxonomy\n\nSolana transaction errors fall into several categories, each requiring different user-facing treatment:\n\nPortefeuille errors: insufficient SOL balance, insufficient token balance, portefeuille disconnected, user rejected signature request. These are the most common et simplest to handle. The message should state what is missing et how to fix it: \"Insufficient SOL balance. You need at least 0.05 SOL to cover transaction fees. Current balance: 0.01 SOL.\"\n\nProgram errors: these are custom error codes from on-chain programs. Each program defines its own error codes. Pour example, Jupiter aggregator might return error 6001 pour \"slippage tolerance exceeded,\" while Raydium returns a different code pour the same concept. Maintaining a mapping from program ID + error code to human-readable messages is necessary pour each protocol you integrate avec.\n\nNetwork errors: RPC node unavailable, connection timeout, rate limited. These are transient et should be presented avec automatic retry: \"Network temporarily unavailable. Retrying in 3 seconds...\" The user should not need to take action unless all retries fail.\n\nCompute errors: compute budget exceeded, transaction too large. These indicate the transaction was constructed incorrectly (from the user's perspective). The message should explain the situation et offer a solution: \"Transaction too complex pour a single submission. Splitting into two transactions...\"\n\n## Mapping program errors\n\nThe most important error mappings pour DeFi applications:\n\nSlippage exceeded: \"Price moved beyond your tolerance of X%. The swap would give you less than your minimum output of Y tokens. Tap 'Refresh Quote' to get an updated price.\" This is actionable -- the user can refresh et try again.\n\nInsufficient liquidity: \"Not enough liquidity in the pool pour this swap size. Try reducing the swap amount or using a different route.\" This tells the user what to do.\n\nStale oracle: \"Price oracle data is outdated. This can happen during high volatility. Please wait a moment et try again.\" This sets expectations.\n\nCompte not initialized: \"Your token compte pour [TOKEN] needs to be created first. This will cost approximately 0.002 SOL in rent.\" This explains the additional cost.\n\n## Error message principles\n\nGood error messages follow these principles: (1) State what happened in plain language. Not \"Error 0x1771\" but \"The swap price changed too much.\" (2) Explain why it happened. \"Prices move quickly during high volatility.\" (3) Tell the user what to do. \"Tap Refresh to get an updated quote, or increase your slippage tolerance.\" (4) Provide technical details in a collapsible section pour power users: \"Program: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4, Error: 6001 (SlippageToleranceExceeded).\"\n\n## Error recovery flows\n\nEach error category should have a defined recovery flow:\n\nBalance errors: show current balance, required balance, et a link to fund the portefeuille or swap pour the needed token. Pre-calculate the exact shortfall.\n\nSlippage errors: automatically re-quote avec the same parameters. If the new quote is acceptable, present it avec a \"Swap at new price\" button. If the price moved significantly, warn the user before proceeding.\n\nTimeout errors: show a transaction explorer link so the user can verify whether the transaction actually succeeded. Include a \"Check Status\" button that polls the signature. Many apparent failures are actually successes where the confirmation was slow.\n\nSimulation errors: catch these before sending. If simulation fails, do not prompt the user to sign. Instead, show the mapped error et recovery action. This saves users from paying fees on doomed transactions.\n\n## Logging et monitoring\n\nLog every error avec full context: timestamp, portefeuille address (anonymized), transaction signature (if available), program ID, error code, mapped message, et recovery action taken. This data drives improvements: if 80% of errors are slippage-related, you need better default slippage settings or dynamic adjustment. If compute errors spike, your CU estimation model needs tuning.\n\n## Checklist\n- Map all known program error codes to human-readable messages\n- Include actionable recovery steps in every error message\n- Provide technical details in a collapsible section\n- Automatically re-quote on slippage failures\n- Log all errors avec full context pour monitoring\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "txopt-v2-l7-errors",
                "title": "Error Mapping Examples",
                "steps": [
                  {
                    "cmd": "Raw: custom program error: 0x1771",
                    "output": "Mapped: \"Price moved beyond your 0.5% tolerance. Tap Refresh pour updated quote.\"",
                    "note": "Slippage exceeded -> actionable message"
                  },
                  {
                    "cmd": "Raw: Attempt to debit an account but found no record of a prior credit",
                    "output": "Mapped: \"Insufficient SOL balance. Need 0.05 SOL, have 0.01 SOL. Fund portefeuille to continue.\"",
                    "note": "Balance error -> show exact shortfall"
                  },
                  {
                    "cmd": "Raw: Transaction was not confirmed in 30.00 seconds",
                    "output": "Mapped: \"Transaction pending. Check status or retry avec higher priority fee.\" [Check Status] [Retry]",
                    "note": "Timeout -> offer both check et retry options"
                  }
                ]
              }
            ]
          },
          "txopt-v2-send-strategy": {
            "title": "Checkpoint: Generate a send strategy report",
            "content": "# Checkpoint: Generate a send strategy report\n\nBuild the final send strategy report that combines all cours concepts into a comprehensive transaction optimization plan:\n\n- Build a tx plan: sum CU estimates avec 10% margin (capped at 1,400,000), calculate priority fee, count unique comptes et total instructions (+2 pour compute budget)\n- Plan LUT strategy: calculate sizes avec et without LUT, recommend legacy / use-existing-lut / create-new-lut\n- Generate fee estimates at three priority tiers: low (100 uL/CU), medium (1,000 uL/CU), high (10,000 uL/CU)\n- Include a fixed retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash\n- Preserve the input timestamp in the output\n\nThis checkpoint validates your complete understanding of transaction optimization.",
            "duration": "55 min",
            "hints": [
              "Combine tx plan building et LUT planning into one comprehensive report.",
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
    "description": "Master production mobile portefeuille signing on Solana: Android MWA sessions, iOS deep-link constraints, resilient retries, et deterministic session telemetry.",
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
        "description": "Platform constraints, connection UX patterns, signing timeline behavior, et typed request construction across Android/iOS.",
        "lessons": {
          "mobilesign-v2-reality-check": {
            "title": "Mobile signing reality check: Android vs iOS constraints",
            "content": "# Mobile signing reality check: Android vs iOS constraints\n\nMobile portefeuille signing on Solana is fundamentally different from browser-based portefeuille interactions. The constraints imposed by Android et iOS operating systems shape every conception decision, from session management to error handling. Understanding these platform differences is essential before writing any signing code.\n\n## Android et Mobile Portefeuille Adapter (MWA)\n\nOn Android, the Solana Mobile Portefeuille Adapter (MWA) protocol provides a persistent communication channel between dApps et portefeuille applications. MWA leverages Android's ability to run foreground services, which means the portefeuille application can maintain an active session while the user interacts avec the dApp. The protocol uses a WebSocket-like association mechanism: the dApp sends an association intent, the portefeuille responds avec a session token, et subsequent sign requests flow over this persistent channel.\n\nThe key advantage of MWA on Android is session continuity. Once a user authorizes a dApp, the portefeuille maintains an active session that can handle multiple sign requests without requiring the user to switch applications. The foreground service keeps the communication channel alive even when the portefeuille is not in the foreground. This enables flows like batch signing, sequential transaction approval, et real-time status updates.\n\nAndroid MWA sessions have a lifecycle tied to the association. The dApp initiates an association via an Android intent, receives a session object, et can then issue authorize, sign_transactions, sign_messages, et sign_and_send_transactions requests. Sessions persist until explicitly deauthorized, the portefeuille terminates them, or the session TTL expires. Typical TTL values range from 5 minutes to 24 hours depending on the portefeuille implementation.\n\nHowever, Android is not without constraints. The user must have a compatible MWA portefeuille installed (Phantom, Solflare, or other MWA-compatible portefeuilles). The association intent may fail if no compatible portefeuille is found, requiring graceful fallback. Additionally, Android battery optimization et Doze mode can interrupt foreground services on some manufacturer-modified Android builds (Samsung, Xiaomi), requiring careful handling of session interruption.\n\n## iOS limitations et deep link patterns\n\niOS presents a fundamentally different challenge. Apple does not allow arbitrary background processes or persistent inter-app communication channels. There is no equivalent to Android's foreground service pattern. When a user switches from a dApp (typically a web view or native app) to a portefeuille app, the dApp's execution context is suspended. There is no way to maintain a WebSocket or persistent channel between the two applications.\n\nOn iOS, portefeuille interactions rely on deep links et universal links. The dApp constructs a signing request, encodes it into a URL, et opens the portefeuille via a deep link. The portefeuille processes the request, et returns the result via a callback deep link back to the dApp. Each sign request requires a full app switch: dApp to portefeuille, user approval, portefeuille back to dApp.\n\nThis round-trip app switching has significant UX implications. Each signature requires 2-4 seconds of visual context switching. Users see the iOS app transition animation, must locate the approve button in the portefeuille, et then return to the dApp. Batch signing is particularly painful because each transaction in the batch requires a separate app switch (unless the portefeuille supports batch approval in a single deep link payload).\n\nSession persistence on iOS is effectively impossible in the traditional sense. The dApp cannot know if the portefeuille is still running, whether the user closed it, or if iOS terminated it pour memory pressure. Every request must be treated as potentially the first request in a new session. This means encoding all necessary context (app identity, cluster, authorization state) into every deep link request.\n\n## What actually works in production\n\nProduction mobile dApps adopt a hybrid strategy. On Android, they detect MWA support et use the persistent session model. On iOS, they fall back to deep link patterns avec aggressive local caching to minimize the data that must be re-transmitted on each request. Cross-platform frameworks like the Solana Mobile SDK abstract some of these differences, but developers must still handle platform-specific edge cases.\n\nFallback patterns include: QR code-based WalletConnect sessions (works on both platforms but adds latency), embedded browser portefeuilles (avoid app switching but sacrifice securite), et progressive web app approaches avec browser extension portefeuilles. Each fallback has trade-offs in securite, UX, et feature completeness.\n\nThe most robust approach is capability detection at runtime: check pour MWA support, fall back to deep links, et ultimately offer QR-based connection as a universal fallback. Each path should provide appropriate UX feedback so users understand why the experience differs across devices.\n\n## Shipping principle pour mobile signing\n\nConception pour interruption by default. Assume app switches, OS suspension, network drops, et portefeuille restarts are normal events. A resilient signing flow recovers state quickly et keeps users informed at each step.\n\n## Checklist\n- Detect MWA availability on Android before attempting association\n- Implement deep link fallback pour iOS et non-MWA Android\n- Handle session interruption from OS-level process management\n- Cache session state locally pour faster reconnection\n- Provide clear UX pour each connection method\n\n## Red flags\n- Assuming MWA works identically on iOS et Android\n- Not handling foreground service termination on Android\n- Ignoring deep link callback failures on iOS\n- Hardcoding a single portefeuille without fallback detection\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l1-q1",
                    "prompt": "What enables persistent dApp-to-portefeuille communication on Android?",
                    "options": [
                      "Foreground services maintaining a session channel",
                      "Deep links passed between applications",
                      "Shared local storage between apps"
                    ],
                    "answerIndex": 0,
                    "explanation": "Android MWA uses foreground services to maintain a persistent communication channel between the dApp et portefeuille, enabling multi-request sessions without app switching."
                  },
                  {
                    "id": "mobilesign-v2-l1-q2",
                    "prompt": "Why can't iOS maintain persistent portefeuille sessions like Android?",
                    "options": [
                      "iOS suspends app execution on background transitions, preventing persistent channels",
                      "iOS portefeuilles do not support Solana",
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
            "title": "Portefeuille connection UX patterns: connect, reconnect, et recovery",
            "content": "# Portefeuille connection UX patterns: connect, reconnect, et recovery\n\nPortefeuille connection on mobile is the first interaction users have avec your dApp. A smooth connection flow builds trust; a broken one drives users away. This lecon covers the connection lifecycle, automatic reconnection strategies, network mismatch handling, et user-friendly error states.\n\n## Initial connection flow\n\nThe connection flow begins avec capability detection. Before presenting any portefeuille UI, your dApp should determine what connection methods are available. On Android, check pour installed MWA-compatible portefeuilles by attempting to resolve the MWA association intent. On iOS, check pour registered deep link handlers. If neither is available, offer a QR code or WalletConnect fallback.\n\nOnce a connection method is selected, the authorization flow begins. Pour MWA on Android, this involves sending an authorize request avec your app identity (name, URI, icon). The portefeuille displays a consent screen showing your dApp's identity et requested permissions. Upon approval, the portefeuille returns an auth token et the user's public key. Store both: the public key pour display et transaction building, the auth token pour session resumption.\n\nPour deep link connections on iOS, the flow is: construct an authorize deep link avec your app identity et callback URI, open the portefeuille, wait pour the callback deep link avec the auth result, et parse the response. The response includes the public key et optionally a session token pour subsequent requests.\n\nConnection state should be persisted locally. Store the portefeuille address, connection method, auth token, et timestamp. This enables automatic reconnection on app restart without requiring the user to re-authorize. Use secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) pour auth tokens.\n\n## Automatic reconnection\n\nWhen the dApp restarts or returns from background, attempt silent reconnection before showing any portefeuille UI. The reconnection flow checks: is there a stored auth token? Is it still valid (not expired)? Can we re-establish the communication channel?\n\nOn Android avec MWA, reconnection involves re-associating avec the portefeuille using the stored auth token. If the portefeuille accepts the token, the session resumes transparently. If the token is expired or revoked, fall back to a fresh authorization flow. The key is making this check fast (under 500ms) so the user does not see a loading state.\n\nOn iOS, reconnection is simpler but less reliable. Check if the stored portefeuille address is still valid by verifying the compte exists on-chain. The auth token from the previous deep link session may or may not be accepted by the portefeuille on the next interaction. Optimistically display the stored portefeuille address et handle re-authorization lazily when the first sign request fails.\n\n## Network mismatch handling\n\nNetwork mismatches occur when the dApp expects one cluster (e.g., mainnet-beta) but the portefeuille is configured pour another (e.g., devnet). This is a common source of confusing errors: transactions build correctly but fail on submission because they reference comptes that do not exist on the portefeuille's configured cluster.\n\nDetection strategies include: requesting the portefeuille's current cluster during authorization, comparing the cluster in sign responses against expectations, et catching specific RPC errors that indicate cluster mismatch (e.g., compte not found pour well-known program addresses).\n\nWhen a mismatch is detected, present a clear error message: \"Your portefeuille is connected to devnet, but this dApp requires mainnet-beta. Please switch your portefeuille's network et reconnect.\" Avoid technical jargon. Some portefeuilles support programmatic cluster switching via the MWA protocol; use this when available.\n\n## User-friendly error states\n\nError states must be actionable. Users should always know what happened et what to do next. Common error states et their UX patterns:\n\nPortefeuille not found: \"No compatible portefeuille detected. Install Phantom or Solflare to continue.\" Include direct links to app stores.\n\nAuthorization denied: \"Portefeuille connection was declined. Tap Connect to try again.\" Do not repeatedly prompt; wait pour user action.\n\nSession expired: \"Your portefeuille session has expired. Tap to reconnect.\" Attempt silent reconnection first; only show this if silent reconnection fails.\n\nNetwork error: \"Unable to reach the Solana network. Check your internet connection et try again.\" Distinguish between local network issues et RPC endpoint failures.\n\nPortefeuille disconnected: \"Your portefeuille was disconnected. This can happen if the portefeuille app was closed. Tap to reconnect.\" On Android, this may indicate the foreground service was killed.\n\n## Recovery patterns\n\nRecovery should be automatic when possible et manual when necessary. Implement a connection state machine avec states: disconnected, connecting, connected, reconnecting, et error. Transitions between states should be deterministic et logged pour debugging.\n\nThe reconnecting state is critical. When a connected session fails (e.g., the portefeuille app crashes), transition to reconnecting et attempt up to 3 silent reconnection attempts avec exponential backoff (1s, 2s, 4s). If all attempts fail, transition to error et present the manual reconnection UI.\n\n## Checklist\n- Detect available connection methods before showing portefeuille UI\n- Store auth tokens securely pour automatic reconnection\n- Handle network mismatch avec clear user messaging\n- Implement connection state machine avec deterministic transitions\n- Provide actionable error states avec recovery options\n\n## Red flags\n- Showing raw error codes to users\n- Repeatedly prompting pour authorization after denial\n- Not persisting connection state across app restarts\n- Ignoring network mismatch silently\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l2-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l2-q1",
                    "prompt": "What should you do before showing any portefeuille connection UI?",
                    "options": [
                      "Detect available connection methods (MWA, deep links, QR)",
                      "Immediately open the default portefeuille",
                      "Display a loading spinner pour 3 seconds"
                    ],
                    "answerIndex": 0,
                    "explanation": "Capability detection ensures you only present connection methods that are actually available on the user's device."
                  },
                  {
                    "id": "mobilesign-v2-l2-q2",
                    "prompt": "How should a dApp handle a network mismatch between itself et the portefeuille?",
                    "options": [
                      "Display a clear message asking the user to switch their portefeuille's network",
                      "Silently retry the transaction on a different cluster",
                      "Ignore the mismatch et hope it resolves"
                    ],
                    "answerIndex": 0,
                    "explanation": "Network mismatches should be communicated clearly to the user avec instructions on how to resolve them, avoiding confusing silent failures."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-timeline-explorer": {
            "title": "Signing session timeline: request, portefeuille, et response flow",
            "content": "# Signing session timeline: request, portefeuille, et response flow\n\nUnderstanding the complete lifecycle of a mobile signing request is essential pour building reliable dApps. Every sign request passes through multiple stages, each avec its own failure modes et timing constraints. This lecon traces a request from construction to final response.\n\n## Request construction phase\n\nThe signing flow begins in the dApp when user action triggers a transaction. The dApp constructs the transaction: fetching a recent blockhash, building instructions, setting the fee payer, et serializing the transaction into a byte array. On mobile, this construction phase must be fast because the user is waiting pour the portefeuille to appear.\n\nKey timing constraint: the recent blockhash has a limited validity window (typically 60-90 seconds on mainnet, determined by the slots-per-epoch configuration). If transaction construction takes too long (e.g., due to slow RPC responses), the blockhash may expire before the portefeuille even sees the transaction. Production dApps pre-fetch blockhashes et refresh them periodically.\n\nThe constructed transaction is encoded (typically base64 pour MWA, or URL-safe base64 pour deep links) et wrapped in a sign request object. The sign request includes metadata: the app identity, requested cluster, et a unique request ID pour tracking. On MWA, this is sent over the session channel. On iOS deep links, it is encoded into the URL.\n\n## Portefeuille-side processing\n\nOnce the portefeuille receives the sign request, it enters its own processing pipeline. The portefeuille decodes the transaction, simulates it (if the portefeuille supports simulation), extracts human-readable information pour the approval screen, et presents the transaction details to the user.\n\nSimulation is a critical step. Portefeuilles like Phantom simulate transactions before showing them to users, detecting potential failures, extracting token transfer amounts, et identifying program interactions. Simulation adds 1-3 seconds to the portefeuille-side processing time but significantly improves the user experience by showing accurate fee estimates et transfer amounts.\n\nThe approval screen shows: the requesting dApp's identity (name, icon, URI), the transaction type (transfer, swap, mint, etc.), amounts being transferred, estimated fees, et any warnings (e.g., interaction avec unverified programs). The user can approve or reject. The time spent on this screen is unpredictable et depends entirely on the user.\n\n## Response handling\n\nAfter the user approves (or rejects), the portefeuille constructs et returns a response. Pour approved transactions, the response contains the signed transaction bytes (the original transaction avec the portefeuille's signature appended). Pour rejected transactions, the response contains an error code et message.\n\nOn MWA, the response arrives over the same session channel. The dApp receives a callback avec the signed transaction or error. On iOS deep links, the portefeuille opens the dApp's callback URL avec the response encoded in the URL parameters or fragment.\n\nResponse parsing must be defensive. Check that the response contains a valid signature, that the transaction bytes match the original request (to detect tampering), et that the response corresponds to the correct request ID. Portefeuilles may return responses out of order if multiple requests were queued.\n\n## Timeout scenarios\n\nTimeouts are the most challenging failure mode in mobile signing. A timeout can occur at multiple points: during request delivery (the portefeuille never received the request), during user decision (the user walked away), during response delivery (the portefeuille signed but the response was lost), or during submission (the signed transaction was sent but confirmation timed out).\n\nEach timeout requires a different recovery strategy. Request delivery timeout: retry the request. User decision timeout: show a \"waiting pour portefeuille\" UI avec a cancel option. Response delivery timeout: check on-chain pour the transaction signature before retrying (to avoid double-signing). Submission timeout: poll pour transaction status before resubmitting.\n\nA reasonable timeout configuration pour mobile: 30 seconds pour the complete round-trip (request to response), avec a 60-second grace period pour user decision on the portefeuille side. If the MWA session itself times out, re-associate before retrying. If the deep link callback never arrives, present a manual \"I've approved in my portefeuille\" button that triggers a status check.\n\n## The complete timeline\n\nA typical successful signing flow takes 3-8 seconds on Android MWA et 6-15 seconds on iOS deep links. The breakdown: transaction construction (0.5-2s), request delivery (0.1-0.5s on MWA, 1-3s on deep link), portefeuille simulation (1-3s), user approval (variable), response delivery (0.1-0.5s on MWA, 1-3s on deep link), et transaction submission (0.5-2s).\n\n## Checklist\n- Pre-fetch blockhashes to minimize construction time\n- Include unique request IDs pour response correlation\n- Handle all timeout scenarios avec appropriate recovery\n- Parse responses defensively avec signature validation\n- Provide real-time status feedback during the signing flow\n\n## Red flags\n- Using stale blockhashes that expire during signing\n- Not correlating responses avec request IDs\n- Treating all timeouts identically\n- Missing the case where a transaction was signed but the response was lost\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "mobilesign-v2-l3-timeline",
                "title": "Signing Session Timeline",
                "steps": [
                  {
                    "cmd": "T+0.0s  dApp: build transaction",
                    "output": "Fetch blockhash, construct instructions, serialize to base64",
                    "note": "Transaction construction phase"
                  },
                  {
                    "cmd": "T+0.5s  dApp -> wallet: sign_transactions request",
                    "output": "{\"type\":\"transaction\",\"payload\":\"AQAAA...\",\"requestId\":\"req_001\"}",
                    "note": "Request sent via MWA session or deep link"
                  },
                  {
                    "cmd": "T+1.0s  wallet: simulate transaction",
                    "output": "{\"fee\":\"0.000005 SOL\",\"transfers\":[{\"to\":\"7Y4f...\",\"amount\":\"1.5 SOL\"}]}",
                    "note": "Portefeuille simulates et extracts display info"
                  },
                  {
                    "cmd": "T+1.5s  wallet: show approval screen",
                    "output": "User sees: Send 1.5 SOL to 7Y4f... | Fee: 0.000005 SOL | [Approve] [Reject]",
                    "note": "User decision - timing is unpredictable"
                  },
                  {
                    "cmd": "T+3.0s  wallet -> dApp: signed response",
                    "output": "{\"signedPayloads\":[\"AQAAA...signed...\"],\"requestId\":\"req_001\"}",
                    "note": "Signed transaction returned to dApp"
                  },
                  {
                    "cmd": "T+3.5s  dApp: submit to RPC",
                    "output": "{\"signature\":\"5UzM...\",\"confirmationStatus\":\"confirmed\"}",
                    "note": "Transaction submitted et confirmed on-chain"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-sign-request": {
            "title": "Challenge: Build a typed sign request",
            "content": "# Challenge: Build a typed sign request\n\nImplement a sign request builder pour Mobile Portefeuille Adapter:\n\n- Validate the payload type (transaction or message)\n- Validate payload data (base64 pour transactions, non-empty string pour messages)\n- Set session metadata (app identity avec name, URI, et icon)\n- Validate the cluster (mainnet-beta, devnet, or testnet)\n- Generate a request ID if not provided\n- Return a structured SignRequest avec validation results\n\nYour implementation will be tested against valid requests, message signing requests, et invalid inputs avec multiple errors.",
            "duration": "50 min",
            "hints": [
              "Validate type is either 'transaction' or 'message' before checking payload format.",
              "Transaction payloads must be valid base64 (A-Z, a-z, 0-9, +, /, optional = padding, length divisible by 4).",
              "App identity requires at least name et URI. Icon is optional but should default to empty string.",
              "Generate a requestId from type + payload prefix if not provided."
            ]
          }
        }
      },
      "mobilesign-v2-production": {
        "title": "Production Patterns",
        "description": "Session persistence, transaction-review safety, retry state machines, et deterministic session reporting pour production mobile apps.",
        "lessons": {
          "mobilesign-v2-session-persist": {
            "title": "Challenge: Session persistence et restoration",
            "content": "# Challenge: Session persistence et restoration\n\nImplement a session persistence manager pour mobile portefeuille sessions:\n\n- Process a sequence of actions: save, restore, clear, et expire_check\n- Track portefeuille address et last sign request ID across actions\n- Handle session expiry based on TTL et timestamps\n- Return the final session state avec a complete action log\n\nEach action modifies the session state. Save establishes a session, restore checks if it is still valid, clear removes it, et expire_check verifies TTL bounds.",
            "duration": "50 min",
            "hints": [
              "Process actions sequentially: each action modifies the session state.",
              "Save sets walletAddress, lastRequestId, sessionActive=true, et expiresAt = timestamp + TTL.",
              "Restore succeeds only if session is active ET current time < expiresAt.",
              "Expire check clears session if current time >= expiresAt."
            ]
          },
          "mobilesign-v2-review-screens": {
            "title": "Mobile transaction review: what users need to see",
            "content": "# Mobile transaction review: what users need to see\n\nTransaction review screens are the last line of defense between a user et a potentially harmful transaction. On mobile, screen real estate is limited et user attention is fragmented. Designing effective review screens requires understanding what information matters, how to present it, et what simulation results to surface.\n\n## Human-readable transaction summaries\n\nRaw transaction data is meaningless to most users. A transaction containing a SystemProgram.transfer instruction should display \"Send 1.5 SOL to 7Y4f...T6aY\" rather than showing serialized instruction bytes. The translation from on-chain instructions to human-readable summaries is one of the most important UX challenges in mobile portefeuille development.\n\nSummary generation involves: identifying the program being called (System Program, Token Program, a known DeFi protocol), decoding the instruction data according to the program's IDL or known layout, extracting the relevant parameters (amounts, addresses, token mints), et formatting them pour display. Unknown programs should show a warning: \"Interaction avec unverified program: Prog1111...\".\n\nAddress formatting on mobile requires truncation. Full Solana addresses (32-44 characters) do not fit on mobile screens. The standard pattern is showing the first 4 et last 4 characters avec an ellipsis: \"7Y4f...T6aY\". Always provide a way to view the full address (tap to expand or copy). Pour known addresses (well-known programs, token mints), show the human-readable name instead: \"USDC Token Program\" rather than \"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\".\n\nToken amounts must include decimals et symbols. A raw amount of 1500000 pour a USDC transfer should display as \"1.50 USDC\", not \"1500000 lamports\". This requires knowing the token's decimal places et symbol, which can be fetched from the token mint's metadata or a local registry of known tokens.\n\n## Fee display et estimation\n\nTransaction fees on Solana are low but not zero. Users should see the estimated fee before approving. The base fee (currently 5000 lamports or 0.000005 SOL) plus any priority fee should be displayed clearly. If the transaction includes compute budget instructions that set a custom fee, extract et display the total.\n\nFee estimation can use simulation results. The Solana RPC simulateTransaction method returns the compute units consumed, which combined avec the priority fee rate gives an accurate fee estimate. Display fees in both SOL et the user's preferred fiat currency if possible.\n\nPour transactions that interact avec DeFi protocols, additional costs may apply: swap fees, protocol fees, slippage impact. These should be itemized separately from the network transaction fee. A swap review screen might show: \"Swap 10 USDC pour ~0.05 SOL | Network fee: 0.000005 SOL | Protocol fee: 0.01 USDC | Impact sur le prix: 0.1%\".\n\n## Simulation results\n\nTransaction simulation is the most powerful tool pour transaction review. Before showing the approval screen, simulate the transaction et extract: balance changes (SOL et token comptes), new comptes that will be created, comptes that will be closed, et any errors or warnings.\n\nBalance change summaries are the most intuitive way to present transaction effects. Show a list of changes: \"-1.5 SOL from your portefeuille\", \"+150 USDC to your portefeuille\", \"-0.000005 SOL (network fee)\". Color-code decreases (red) et increases (green) pour quick visual scanning.\n\nSimulation can detect potential issues: insufficient balance, compte ownership conflicts, program errors, et excessive compute usage. Surface these as warnings before the user approves. A warning like \"This transaction will fail: insufficient SOL balance\" saves the user from paying a fee pour a failed transaction.\n\n## Approval UX patterns\n\nThe approve et reject buttons must be unambiguous. Use distinct colors (green pour approve, red/grey pour reject), sufficient spacing to prevent accidental taps, et clear labels (\"Approve\" et \"Reject\", not \"OK\" et \"Cancel\"). Consider requiring a deliberate gesture (swipe to approve) pour high-value transactions.\n\nBiometric confirmation adds securite pour high-value transactions. After the user taps approve, prompt pour fingerprint or face recognition before signing. This prevents unauthorized transactions if the device is unlocked but unattended. Make biometric confirmation optional et configurable.\n\nLoading states during signing should show progress: \"Signing transaction...\", \"Submitting to network...\", \"Waiting pour confirmation...\". Never show a blank screen or spinner without context. If the process takes longer than expected, show a message: \"This is taking longer than usual. Your transaction is still processing.\"\n\n## Checklist\n- Translate instructions to human-readable summaries\n- Truncate addresses avec first 4 et last 4 characters\n- Show token amounts avec correct decimals et symbols\n- Display simulation-based fee estimates\n- Surface balance changes avec color coding\n- Require deliberate approval gestures pour high-value transactions\n\n## Red flags\n- Showing raw instruction bytes to users\n- Displaying token amounts without decimal conversion\n- Missing fee information on approval screens\n- No simulation before transaction approval\n- Approve et reject buttons too close together\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mobilesign-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mobilesign-v2-l6-q1",
                    "prompt": "How should token amounts be displayed on a mobile transaction review screen?",
                    "options": [
                      "Avec correct decimal places et token symbol (e.g., 1.50 USDC)",
                      "As raw lamports or smallest unit values",
                      "In scientific notation pour precision"
                    ],
                    "answerIndex": 0,
                    "explanation": "Token amounts must be converted to human-readable format using the token's decimal configuration et include the symbol pour clarity."
                  },
                  {
                    "id": "mobilesign-v2-l6-q2",
                    "prompt": "What is the most intuitive way to present transaction simulation results?",
                    "options": [
                      "Balance change summaries avec color-coded increases et decreases",
                      "Raw simulation logs from the RPC response",
                      "A list of all comptes the transaction touches"
                    ],
                    "answerIndex": 0,
                    "explanation": "Balance change summaries (e.g., -1.5 SOL, +150 USDC) are the most user-friendly way to communicate what a transaction will do."
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-retry-patterns": {
            "title": "One-tap retry: handling offline, rejected, et timeout states",
            "content": "# One-tap retry: handling offline, rejected, et timeout states\n\nMobile environments are inherently unreliable. Users move between WiFi et cellular, enter tunnels, close apps mid-transaction, et portefeuilles crash. A robust retry system is not optional; it is a core requirement pour production mobile dApps. This lecon covers retry state machines, offline detection, user-initiated retry, et mobile-appropriate backoff strategies.\n\n## Retry state machine\n\nEvery sign request in a mobile dApp should be managed by a state machine avec well-defined states et transitions. The core states are: idle, pending, signing, submitted, confirmed, failed, et retrying. Each state has specific allowed transitions et associated UI.\n\nIdle: no active request. Transition to pending when the user initiates an action.\n\nPending: the request is being constructed (fetching blockhash, building transaction). Transition to signing when the request is sent to the portefeuille, or to failed if construction fails (e.g., RPC unreachable).\n\nSigning: waiting pour portefeuille response. Transition to submitted if the portefeuille returns a signed transaction, to failed if the portefeuille rejects, or to retrying if the signing times out.\n\nSubmitted: the signed transaction has been sent to the network. Transition to confirmed when the transaction is finalized, or to failed if submission fails or confirmation times out.\n\nConfirmed: terminal success state. Display success UI et clean up.\n\nFailed: non-terminal failure state. Analyze the failure reason et determine if retry is appropriate. Transition to retrying if the failure is retryable, or remain in failed if it is terminal (e.g., user explicitly rejected).\n\nRetrying: preparing to retry. Refresh stale data (new blockhash, updated balances), wait pour backoff period, then transition back to pending.\n\n## Offline detection\n\nMobile offline detection is more nuanced than checking navigator.onLine. That property only indicates whether the device has a network interface active, not whether the Solana RPC endpoint is reachable. Implement a multi-layer detection strategy.\n\nLayer 1: Network interface status. Use the device's network state API to detect complete disconnection (airplane mode, no signal). This is instant et covers the most obvious case.\n\nLayer 2: RPC health check. Periodically ping the Solana RPC endpoint avec a lightweight request (getHealth or getSlot). If this fails but the network interface is up, the issue is likely RPC-specific. Try a fallback RPC endpoint before declaring offline status.\n\nLayer 3: Transaction-level detection. If a transaction submission returns a network error, mark the request as failed-offline rather than failed-permanent. This distinction drives the retry logic: offline failures should be retried when connectivity returns, while permanent failures (insufficient funds, invalid transaction) should not.\n\nWhen offline is detected, queue pending sign requests locally. Display an offline banner: \"You are offline. Your transaction will be submitted when connectivity returns.\" When connectivity is restored, process the queue in order, refreshing blockhashes pour any queued transactions (they will have expired).\n\n## User-initiated retry\n\nNot all retries should be automatic. When a transaction fails, present the user avec context et a clear retry option. The retry button should be prominent (primary action), et the error context should be concise.\n\nPour portefeuille rejection: \"Transaction was declined in your portefeuille. [Try Again]\". The retry re-opens the portefeuille avec the same request. Do not automatically retry rejected transactions; respect the user's decision et only retry on explicit user action.\n\nPour timeout: \"Portefeuille did not respond in time. This may happen if the portefeuille app was closed. [Retry] [Cancel]\". Before retrying, check if the transaction was already signed et submitted (to avoid double-signing).\n\nPour network errors: \"Could not reach the Solana network. [Retry When Online]\". This button should be disabled while offline et automatically trigger when connectivity returns.\n\nPour submission failures: \"Transaction could not be confirmed. [Retry avec New Blockhash]\". This re-constructs the transaction avec a fresh blockhash et re-submits. Show the previous failure reason to build user confidence.\n\n## Exponential backoff on mobile\n\nMobile backoff must be more aggressive than server-side backoff because users are waiting et watching. Start avec a 1-second delay, double on each retry, et cap at 8 seconds. After 3 failed retries, stop automatic retrying et present a manual retry option.\n\nThe backoff sequence pour automatic retries: 1s, 2s, 4s, then stop. Pour user-initiated retries, do not apply backoff (the user explicitly chose to retry, so execute immediately). Pour offline queue processing, use a 2-second delay between queued items to avoid overwhelming the RPC endpoint when connectivity returns.\n\nJitter is important even on mobile. Add a random 0-500ms offset to each retry delay to prevent thundering herd problems when many users come back online simultaneously (e.g., after a widespread network outage).\n\nDisplay retry progress to the user: \"Retrying in 3... 2... 1...\" or \"Attempt 2 of 3\". Never retry silently; users should always know the dApp is working on their behalf.\n\n## Checklist\n- Implement a state machine pour every sign request lifecycle\n- Detect offline state at network, RPC, et transaction levels\n- Queue transactions locally when offline\n- Refresh blockhashes before retrying queued transactions\n- Use mobile-appropriate backoff: 1s, 2s, 4s, then manual\n- Show retry progress et attempt counts to users\n\n## Red flags\n- Automatically retrying user-rejected transactions\n- Using server-side backoff timing (30s+) on mobile\n- Retrying avec stale blockhashes\n- Silently retrying without user visibility\n- Not checking pour already-submitted transactions before retry\n",
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
                    "output": "Opening portefeuille pour approval... requestId=req_001",
                    "note": "Request sent to portefeuille via MWA or deep link"
                  },
                  {
                    "cmd": "State: signing -> failed (timeout after 30s)",
                    "output": "Portefeuille did not respond. Failure: SIGNING_TIMEOUT",
                    "note": "Portefeuille app may have been closed or crashed"
                  },
                  {
                    "cmd": "State: failed -> retrying (attempt 1/3, delay 1s)",
                    "output": "Refreshing blockhash... Retrying in 1s...",
                    "note": "Automatic retry avec fresh blockhash"
                  },
                  {
                    "cmd": "State: retrying -> signing",
                    "output": "Re-opening portefeuille pour approval... requestId=req_001_r1",
                    "note": "New request sent avec updated blockhash"
                  },
                  {
                    "cmd": "State: signing -> submitted",
                    "output": "Portefeuille approved. Submitting tx: 5UzM...",
                    "note": "Signed transaction submitted to network"
                  },
                  {
                    "cmd": "State: submitted -> confirmed",
                    "output": "Transaction confirmed in slot 234567890. Success!",
                    "note": "Terminal success state"
                  }
                ]
              }
            ]
          },
          "mobilesign-v2-session-report": {
            "title": "Checkpoint: Generate a session report",
            "content": "# Checkpoint: Generate a session report\n\nImplement a session report generator that summarizes a complete mobile signing session:\n\n- Count total requests, successful signs, et failed signs\n- Sum retry attempts across all requests\n- Calculate session duration from start et end timestamps\n- Break down requests by type (transaction vs message)\n- Produce deterministic JSON output pour consistent reporting\n\nThis checkpoint validates your understanding of session lifecycle, request tracking, et deterministic output generation.",
            "duration": "55 min",
            "hints": [
              "Count requests by status: 'signed' = success, 'rejected'/'timeout'/'error' = failure.",
              "Sum retries across all requests pour total retry attempts.",
              "Session duration = sessionEnd - sessionStart in seconds.",
              "Request breakdown counts how many were 'transaction' vs 'message' type."
            ]
          }
        }
      }
    }
  },
  "solana-pay-commerce": {
    "title": "Solana Pay Commerce",
    "description": "Master Solana Pay commerce integration: robust URL encoding, QR/payment tracking workflows, confirmation UX, et deterministic POS reconciliation artifacts.",
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
        "description": "Solana Pay specification, URL encoding rigor, transfer request anatomy, et deterministic builder/encoder patterns.",
        "lessons": {
          "solanapay-v2-mental-model": {
            "title": "Solana Pay modele mental et URL encoding rules",
            "content": "# Solana Pay modele mental et URL encoding rules\n\nSolana Pay is an open specification pour encoding payment requests into URLs that portefeuilles can parse et execute. Unlike traditional payment processors that rely on centralized intermediaries, Solana Pay enables direct peer-to-peer value transfer by embedding all the information a portefeuille needs into a single URI string. Understanding this specification deeply is the foundation pour building any commerce integration on Solana.\n\nThe Solana Pay specification defines two distinct request types: transfer requests et transaction requests. Transfer requests are the simpler of the two — they encode a recipient address, an amount, et optional metadata directly in the URL. The portefeuille parses the URL, constructs a standard SOL or SPL token transfer transaction, et submits it to the network. Transaction requests are more powerful — the URL points to an API endpoint that returns a serialized transaction pour the portefeuille to sign. This allows the merchant server to build arbitrarily complex transactions (multi-instruction, program interactions, etc.) while the portefeuille simply signs what it receives.\n\nThe URL format follows a strict schema. A transfer request URL takes the form: `solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>&memo=<memo>`. The scheme is always `solana:` (not `solana://`). The recipient is a base58-encoded Solana public key placed immediately after the colon avec no slashes. Query parameters encode the payment details.\n\nEach parameter has specific encoding rules. The `amount` is a decimal string representing the number of tokens (not lamports or raw units). Pour native SOL, `amount=1.5` means 1.5 SOL. Pour SPL tokens, the amount is in the token's human-readable units respecting its decimals. The `spl-token` parameter is optional — when absent, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token. The `reference` parameter is one or more base58 public keys that are added as non-signer keys in the transfer instruction, enabling transaction discovery via `getSignaturesForAddress`. The `label` identifies the merchant or payment recipient in a human-readable format. The `message` provides a description of the payment purpose. Both `label` et `message` must be URL-encoded using percent-encoding (spaces become `%20`, special characters like `#` become `%23`).\n\nWhen should you use transfer requests versus transaction requests? Transfer requests are ideal pour simple point-of-sale payments where the merchant only needs to receive a fixed amount of a single token. They work entirely client-side — no server needed. Transaction requests are necessary when the payment involves multiple instructions (e.g., creating an associated token compte, interacting avec a program, splitting payments among multiple recipients, or including on-chain metadata). Transaction requests require a server endpoint that the portefeuille calls to fetch the transaction.\n\nURL encoding correctness is critical. A malformed URL will be rejected by compliant portefeuilles. Common mistakes include: using `solana://` instead of `solana:`, encoding the recipient address incorrectly, omitting percent-encoding pour special characters in labels, et providing amounts in raw token units instead of human-readable decimals. The specification requires that all base58 values are valid Solana public keys (32 bytes when decoded), et that amounts are non-negative finite decimal numbers.\n\nThe reference key mechanism is what makes Solana Pay pratique pour commerce. By generating a unique keypair per transaction et including its public key as a reference, the merchant can poll `getSignaturesForAddress(reference)` to detect when the payment arrives. This eliminates the need pour webhooks or push notifications — the merchant simply polls until the reference appears in a confirmed transaction, then verifies the transfer details match the expected payment.\n\n## Commerce operator rule\n\nThink in terms of order-state guarantees, not just payment detection:\n1. request created,\n2. payment observed,\n3. payment validated,\n4. fulfillment released.\n\nEach step needs explicit checks so fulfillment never races ahead of verification.\n\n## Checklist\n- Use `solana:` scheme (no double slashes)\n- Place the recipient base58 address directly after the colon\n- Encode label et message avec encodeURIComponent\n- Use human-readable decimal amounts, not raw lamport values\n- Generate a unique reference keypair per payment pour tracking\n\n## Red flags\n- Using `solana://` instead of `solana:`\n- Sending raw lamport amounts in the amount field\n- Forgetting to URL-encode label et message parameters\n- Reusing reference keys across multiple payments\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l1-q1",
                    "prompt": "What is the correct URL scheme pour Solana Pay transfer requests?",
                    "options": [
                      "solana:<recipient> (single colon, no slashes)",
                      "solana://<recipient> (double slashes like HTTP)",
                      "pay:<recipient> (custom pay scheme)"
                    ],
                    "answerIndex": 0,
                    "explanation": "The Solana Pay specification uses the 'solana:' scheme followed immediately by the recipient address avec no slashes."
                  },
                  {
                    "id": "solanapay-v2-l1-q2",
                    "prompt": "When should you use a transaction request instead of a transfer request?",
                    "options": [
                      "When the payment requires multiple instructions or program interactions beyond a simple transfer",
                      "When the amount exceeds 100 SOL",
                      "When paying avec native SOL instead of SPL tokens"
                    ],
                    "answerIndex": 0,
                    "explanation": "Transaction requests allow the server to build arbitrarily complex transactions. Transfer requests only support simple single-token transfers."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-transfer-anatomy": {
            "title": "Transfer request anatomy: recipient, amount, reference, et labels",
            "content": "# Transfer request anatomy: recipient, amount, reference, et labels\n\nA Solana Pay transfer request URL contains everything a portefeuille needs to construct et submit a payment transaction. Each component of the URL serves a specific purpose in the payment flow. Understanding the anatomy of these requests — et how each field maps to on-chain behavior — is essential pour building reliable commerce integrations.\n\nThe recipient address is the most critical field. It appears immediately after the `solana:` scheme et must be a valid base58-encoded Solana public key. Pour native SOL transfers, this is the portefeuille address that will receive the SOL. Pour SPL token transfers, this is the portefeuille address whose associated token compte (ATA) will receive the tokens. The portefeuille application is responsible pour deriving the correct ATA from the recipient address et the SPL token mint. If the recipient's ATA does not exist, the portefeuille must create it as part of the transaction (using `createAssociatedTokenAccountIdempotent`). A malformed or invalid recipient address will cause the portefeuille to reject the payment request entirely.\n\nThe amount parameter specifies how much to transfer in human-readable decimal form. Pour native SOL, `amount=2.5` means 2.5 SOL (2,500,000,000 lamports internally). Pour USDC (6 decimals), `amount=10.50` means 10.50 USDC (10,500,000 raw units). The portefeuille handles the conversion from decimal to raw units based on the token's decimal configuration. This conception keeps the URL readable by humans et consistent across tokens avec different decimal places. The amount must be a positive finite number — zero, negative, or infinite values are invalid.\n\nThe spl-token parameter distinguishes SOL transfers from SPL token transfers. When omitted, the transfer is native SOL. When present, it must be the base58-encoded mint address of the SPL token to transfer. Common examples include USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`), USDT (`Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx`), et any other SPL token. The portefeuille validates that the mint exists et that the sender has a sufficient balance before constructing the transaction.\n\nThe reference parameter is what makes Solana Pay viable pour real-time commerce. A reference is a base58-encoded public key that gets added as a non-signer compte in the transfer instruction. After the transaction confirms, anyone can call `getSignaturesForAddress(reference)` to find the transaction containing this reference. The merchant generates a unique reference keypair pour each payment request, encodes the public key in the URL, et then polls the Solana RPC to detect when a matching transaction appears. Multiple references can be included by repeating the parameter: `reference=<key1>&reference=<key2>`. This is useful when multiple parties need to independently track the same payment.\n\nThe label parameter identifies the merchant or payment recipient. It appears in the portefeuille's confirmation dialog so the user knows who they are paying. Pour example, `label=Sunrise%20Coffee` tells the user they are paying \"Sunrise Coffee.\" The label must be URL-encoded — spaces become `%20`, ampersands become `%26`, et other special characters use standard percent-encoding. Keeping labels concise (under 50 characters) ensures they display properly across different portefeuille implementations.\n\nThe message parameter provides additional context about the payment. It might include an order number, item description, or other merchant-specific information. Like the label, it must be URL-encoded. Example: `message=Order%20%23157%20-%202x%20Espresso`. Some portefeuilles display the message in a secondary line below the label, while others may truncate long messages. The memo parameter (not to be confused avec message) adds an on-chain memo instruction to the transaction, creating a permanent on-chain record. Use message pour display purposes et memo pour data that must be recorded on-chain.\n\nThe complete flow works as follows: (1) the merchant generates a unique reference keypair, (2) constructs the Solana Pay URL avec all parameters, (3) encodes the URL into a QR code or deep link, (4) the customer scans/clicks et their portefeuille parses the URL, (5) the portefeuille constructs the transfer transaction including the reference as a non-signer compte, (6) the customer approves et the portefeuille submits the transaction, (7) the merchant polls `getSignaturesForAddress(reference)` until it finds the confirmed transaction, (8) the merchant verifies the transaction details match the expected payment.\n\n## Checklist\n- Validate recipient is a proper base58 public key (32-44 characters)\n- Use human-readable decimal amounts matching the token's precision\n- Generate a fresh reference keypair pour every payment request\n- URL-encode label et message avec encodeURIComponent\n- Include spl-token only when transferring SPL tokens, not native SOL\n\n## Red flags\n- Reusing the same reference across multiple payment requests\n- Providing amounts in raw lamports or smallest token units\n- Forgetting URL encoding on label or message (breaks parsing)\n- Not validating the recipient address format before URL construction\n",
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
                      "It is added as a non-signer compte, allowing getSignaturesForAddress to find the transaction",
                      "It creates a webhook that notifies the merchant",
                      "It stores the payment ID in the transaction memo"
                    ],
                    "answerIndex": 0,
                    "explanation": "The reference public key is included as a non-signer compte in the transfer instruction. The merchant polls getSignaturesForAddress(reference) to detect when the payment transaction confirms."
                  },
                  {
                    "id": "solanapay-v2-l2-q2",
                    "prompt": "What amount value represents 2.5 USDC in a Solana Pay URL?",
                    "options": [
                      "amount=2.5 (human-readable decimal)",
                      "amount=2500000 (raw units avec 6 decimals)",
                      "amount=2500000000 (raw units avec 9 decimals)"
                    ],
                    "answerIndex": 0,
                    "explanation": "Solana Pay URLs use human-readable decimal amounts. The portefeuille handles the conversion to raw units based on the token's decimal configuration."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-url-explorer": {
            "title": "URL builder: live preview of Solana Pay URLs",
            "content": "# URL builder: live preview of Solana Pay URLs\n\nBuilding Solana Pay URLs correctly requires understanding how each parameter contributes to the final encoded string. In this lecon, we walk through the construction process step by step, examining how different combinations of parameters produce different URLs et how encoding rules affect the output.\n\nThe base URL always starts avec the `solana:` scheme followed by the recipient address. There are no slashes, no host, no path segments — just the scheme colon et the base58 address. Pour example: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. This alone is a valid Solana Pay URL, though it lacks an amount et would prompt the portefeuille to request the amount from the user.\n\nAdding query parameters transforms the base URL into a complete payment request. The first parameter is separated from the recipient by `?`, et subsequent parameters are separated by `&`. Parameter order does not affect validity, but convention places amount first pour readability. A SOL transfer pour 1.5 SOL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5`.\n\nAdding an SPL token changes the transfer type. Including `spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` tells the portefeuille this is a USDC transfer, not a SOL transfer. The amount is still in human-readable form — `amount=10` means 10 USDC, not 10 raw units. The portefeuille reads the mint's decimal configuration from the chain et converts accordingly.\n\nThe reference parameter enables payment detection. Each payment should include a unique reference public key. In practice, you generate a Keypair, extract its public key as a base58 string, et include it: `reference=Ref1111111111111111111111111111111111111111`. After the customer pays, you poll `getSignaturesForAddress` avec this reference to find the transaction. Multiple references can be included pour multi-party tracking.\n\nURL encoding pour labels et messages follows standard percent-encoding rules. The JavaScript function `encodeURIComponent` handles this correctly. Spaces become `%20`, the hash symbol becomes `%23`, ampersands become `%26`, et so on. Pour example, a label \"Joe's Coffee & Tea\" encodes to `label=Joe's%20Coffee%20%26%20Tea`. Failing to encode these characters breaks the URL parser — an unencoded `&` in a label would be interpreted as a parameter separator, splitting the label et creating an invalid parameter.\n\nLet us trace through a complete example. A coffee shop wants to charge 4.25 USDC pour order number 157. The shop's portefeuille address is `7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY`. They generate a reference key `Ref1111111111111111111111111111111111111111`. The resulting URL: `solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=4.25&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111&label=Sunrise%20Coffee&message=Order%20%23157`.\n\nValidation before encoding catches errors early. Before building the URL, verify: the recipient is a valid base58 string of 32-44 characters, the amount is a positive finite number, the spl-token (if provided) is a valid base58 string, et the reference (if provided) is a valid base58 string. Emitting clear error messages pour each validation failure helps developers debug integration issues quickly.\n\nEdge cases to handle: (1) amounts avec many decimal places — truncate to the token's decimal precision, (2) empty or whitespace-only labels — omit the parameter entirely rather than including an empty value, (3) extremely long messages — some portefeuilles truncate at 256 characters, (4) Unicode characters in labels — encodeURIComponent handles UTF-8 encoding correctly, but test avec your target portefeuilles.\n\n## Checklist\n- Start avec `solana:` followed immediately by the recipient address\n- Use `?` before the first parameter et `&` between subsequent ones\n- Apply encodeURIComponent to label et message values\n- Validate all base58 fields before building the URL\n- Test generated URLs avec multiple portefeuille implementations\n\n## Red flags\n- Including raw unencoded special characters in labels or messages\n- Building URLs avec invalid or unvalidated recipient addresses\n- Using fixed reference keys instead of generating unique ones per payment\n- Omitting the spl-token parameter pour SPL token transfers\n",
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
                    "note": "SPL token transfer avec tracking reference"
                  },
                  {
                    "cmd": "Full payment URL with message",
                    "output": "solana:7Y4f...T6aY?amount=4.25&spl-token=EPjF...Dt1v&reference=Ref1...1111&label=Sunrise%20Coffee&message=Order%20%23157",
                    "note": "Complete POS payment request avec all fields"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-encode-transfer": {
            "title": "Challenge: Encode a Solana Pay transfer request URL",
            "content": "# Challenge: Encode a Solana Pay transfer request URL\n\nBuild a function that encodes a Solana Pay transfer request URL from input parameters:\n\n- Validate the recipient address (must be 32-44 characters of valid base58)\n- Validate the amount (must be a positive finite number)\n- Construct the URL avec the `solana:` scheme et query parameters\n- Apply encodeURIComponent to label et message fields\n- Include spl-token et reference only when provided\n- Return validation errors when inputs are invalid\n\nYour encoder must be fully deterministic — same input always produces the same URL.",
            "duration": "50 min",
            "hints": [
              "Solana Pay URL format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>",
              "Validate recipient: must be 32-44 characters of valid base58.",
              "Amount must be a positive finite number.",
              "Use encodeURIComponent pour label et message to handle special characters."
            ]
          }
        }
      },
      "solanapay-v2-implementation": {
        "title": "Tracking & Commerce",
        "description": "Reference tracking state machines, confirmation UX, failure handling, et deterministic POS receipt generation.",
        "lessons": {
          "solanapay-v2-reference-tracker": {
            "title": "Challenge: Track payment references through confirmation states",
            "content": "# Challenge: Track payment references through confirmation states\n\nBuild a reference tracking state machine that processes payment events:\n\n- States flow: pending -> found -> confirmed -> finalized (or pending -> expired)\n- The \"found\" event transitions from pending et records the transaction signature\n- The \"confirmation\" event increments the confirmation counter et transitions from found to confirmed\n- The \"finalized\" event transitions from confirmed to finalized\n- The \"timeout_check\" event expires the reference if still pending after expiryTimeout seconds\n- Record every state transition in a history array avec from, to, et timestamp\n\nYour tracker must be fully deterministic — same event sequence always produces the same result.",
            "duration": "50 min",
            "hints": [
              "Track state transitions: pending -> found -> confirmed -> finalized.",
              "The 'found' event sets the signature. 'confirmation' increments the counter.",
              "Timeout check expires the reference if still pending after expiryTimeout seconds.",
              "Record each state change in the history array."
            ]
          },
          "solanapay-v2-confirmation-ux": {
            "title": "Confirmation UX: pending, confirmed, et expired states",
            "content": "# Confirmation UX: pending, confirmed, et expired states\n\nThe user experience during payment confirmation is the most critical moment in any Solana Pay integration. Between the customer scanning the QR code et the merchant acknowledging receipt, there is a window of uncertainty that must be managed avec clear visual feedback, appropriate timeouts, et graceful error handling. Getting this right determines whether customers trust your payment system.\n\nThe confirmation lifecycle follows a well-defined state machine. After the QR code is displayed, the system enters the **pending** state — waiting pour the customer to scan et submit the transaction. The merchant's system continuously polls `getSignaturesForAddress(reference)` looking pour a matching transaction. When a signature appears, the system transitions to the **found** state. The transaction has been submitted but may not yet be confirmed. The system then calls `getTransaction(signature)` to verify the payment details (recipient, amount, token) match the expected values. Once the transaction reaches sufficient confirmations, the state moves to **confirmed**. After the transaction is finalized (maximum commitment level, irreversible), the state reaches **finalized** et the merchant can safely release goods or services.\n\nEach state requires distinct visual treatment. In the **pending** state, display the QR code prominently avec a scanning animation or subtle pulse effect. Show a countdown timer indicating how long the payment request remains valid (typically 2-5 minutes). Include the amount, token, et merchant name so the customer can verify before scanning. A \"Waiting pour payment...\" message avec a spinner keeps the customer informed.\n\nThe **found** state is brief but important. When the transaction is detected, immediately replace the QR code avec a checkmark or success animation. Display \"Payment detected — confirming...\" to signal progress. This instant visual feedback is critical — customers need to know their payment was received even before it confirms. Show the transaction signature (abbreviated, e.g., \"sig: abc1...xyz9\") pour reference. If you have a Solana Explorer link, provide it.\n\nThe **confirmed** state means the transaction has at least one confirmation. Pour low-value transactions (coffee, small merchandise), this is sufficient to complete the sale. Display a prominent green checkmark, the confirmed amount, et the transaction reference. Print or display a receipt. Pour high-value transactions, you may want to wait pour finalized status before releasing goods.\n\nThe **finalized** state is the strongest guarantee — the transaction is part of a rooted slot et cannot be reverted. This takes roughly 6-12 seconds after initial confirmation. Pour most point-of-sale applications, waiting pour finalized is unnecessary et adds friction. However, pour digital goods delivery, API key provisioning, or any irreversible fulfillment, finalized is the safe threshold.\n\nThe **expired** state handles the timeout case. If no matching transaction appears within the expiry window (e.g., 120 seconds), the payment request expires. Display \"Payment request expired\" avec an option to generate a new QR code. Never silently expire — the customer may have just scanned et needs to know the request is no longer valid. The expiry timeout should be generous enough pour the customer to open their portefeuille, review the transaction, et approve it (60-120 seconds minimum).\n\nError states require careful messaging. \"Transaction not found after timeout\" suggests the customer did not complete the payment. \"Transaction found but details mismatch\" indicates a potential issue — the amount or recipient does not match expectations. \"Network error during polling\" should trigger automatic retries before displaying an error to the user. Always provide actionable next steps: \"Try again,\" \"Generate new QR,\" or \"Contact support.\"\n\nPolling strategy affects both UX responsiveness et RPC load. Start polling immediately after displaying the QR code. Use a 1-second interval pour the first 30 seconds (fast detection), then slow to 2-3 seconds pour the remainder of the window. After detecting the transaction, switch to polling `getTransaction` avec increasing commitment levels: processed -> confirmed -> finalized. Use exponential backoff if the RPC returns errors.\n\nAccessibility considerations pour payment confirmation: (1) Do not rely solely on color to indicate state — use icons, text labels, et animations. (2) Provide audio feedback (a subtle chime on confirmation) pour environments where the screen may not be visible. (3) Ensure the QR code has sufficient contrast et size pour scanning from a reasonable distance (at least 300x300 pixels). (4) Support both light et dark themes pour the confirmation UI.\n\n## Checklist\n- Show distinct visual states: pending, found, confirmed, finalized, expired\n- Display a countdown timer during the pending state\n- Provide instant visual feedback when the transaction is detected\n- Implement appropriate expiry timeouts (60-120 seconds)\n- Offer actionable next steps on expiry or error\n\n## Red flags\n- No visual feedback between QR display et confirmation\n- Silent expiry without notifying the customer\n- Waiting pour finalized on low-value point-of-sale transactions\n- Polling too aggressively (every 100ms) et overloading the RPC\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "solanapay-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "solanapay-v2-l6-q1",
                    "prompt": "When is 'confirmed' commitment sufficient versus waiting pour 'finalized'?",
                    "options": [
                      "Confirmed is sufficient pour low-value POS transactions; finalized is needed pour irreversible digital fulfillment",
                      "Always wait pour finalized regardless of transaction value",
                      "Confirmed is never sufficient — always use finalized"
                    ],
                    "answerIndex": 0,
                    "explanation": "Pour coffee-shop-scale payments, confirmed commitment provides a strong enough guarantee. Finalized adds 6-12 seconds of latency et is only necessary when fulfillment is irreversible."
                  },
                  {
                    "id": "solanapay-v2-l6-q2",
                    "prompt": "What should happen when the payment request expires?",
                    "options": [
                      "Display a clear expiry message avec an option to generate a new QR code",
                      "Silently restart the polling loop",
                      "Redirect the customer to a different payment method"
                    ],
                    "answerIndex": 0,
                    "explanation": "Expired requests should be clearly communicated. The customer may have been in the middle of approving — they need to know the request expired et can try again."
                  }
                ]
              }
            ]
          },
          "solanapay-v2-error-handling": {
            "title": "Error handling et edge cases in payment flows",
            "content": "# Error handling et edge cases in payment flows\n\nProduction payment systems encounter a wide range of failure modes that must be handled gracefully. Solana Pay integrations face challenges unique to blockchain payments: network congestion, RPC failures, partial transaction visibility, et edge cases around token comptes. Building robust error handling separates demo-quality code from production-grade commerce systems.\n\nRPC connectivity failures are the most common operational issue. The merchant's polling loop depends on a reliable connection to a Solana RPC endpoint. When the RPC is unreachable (network outage, rate limiting, endpoint downtime), the polling loop must not crash or silently stop. Implement retry logic avec exponential backoff: first retry after 500ms, second after 1 second, third after 2 seconds, capping at 5 seconds between retries. After 5 consecutive failures, display a degraded-mode warning to the operator (\"Network connectivity issue — payment detection may be delayed\") while continuing to retry in the background. Never abandon polling due to transient RPC errors.\n\nRate limiting from RPC providers is a specific failure mode. Free-tier RPC endpoints (including the public Solana RPC) enforce request limits. A polling loop that fires every second generates 60+ requests per minute per active payment session. If you have 10 concurrent payment sessions, that is 600+ requests per minute. Solutions: use a dedicated RPC provider avec higher limits, batch reference checks where possible, implement client-side request deduplication, et cache negative results (reference not found) pour a short window before re-checking.\n\nTransaction mismatch errors occur when a transaction is found via the reference but its details do not match expectations. This can happen if: (1) someone accidentally or maliciously sent a transaction that includes the reference key but avec wrong amounts, (2) the customer used a different portefeuille that interpreted the URL differently, or (3) there is a bug in the URL encoding that produced incorrect parameters. When a mismatch is detected, log the full transaction details pour debugging, display a clear error to the merchant (\"Payment detected but amount does not match — expected 10 USDC, received 5 USDC\"), et do not mark the payment as complete.\n\nInsufficient balance errors are caught by the customer's portefeuille before submission, but the merchant has no visibility into this. From the merchant's perspective, it looks like the customer scanned the QR but never submitted the transaction. The timeout/expiry mechanism handles this case — after the expiry window passes, offer to regenerate the QR code. Consider displaying a message like \"If you are having trouble, please ensure you have sufficient balance.\"\n\nAssociated token compte (ATA) creation failures can occur when the customer's portefeuille does not automatically create the recipient's ATA pour the SPL token being transferred. This is primarily a concern pour less common SPL tokens where the recipient may not have an existing ATA. Modern portefeuilles handle this by including a `createAssociatedTokenAccountIdempotent` instruction, but older portefeuille versions may not. The merchant can mitigate this by pre-creating ATAs pour all tokens they accept.\n\nDouble-payment detection is essential. If the polling loop detects two transactions avec the same reference, this indicates either a portefeuille bug or a user submitting the payment twice. The system should only process the first valid transaction et flag any subsequent ones pour manual review. Track processed references in a database to prevent duplicate fulfillment.\n\nNetwork congestion causes delayed transaction confirmation. During high-traffic periods, transactions may take 10-30 seconds to confirm instead of the usual 400ms-2 seconds. The payment UI should handle this gracefully: extend the visual \"confirming\" state, show a message like \"Network is busy — confirmation may take longer than usual,\" et never time out a transaction that has been detected but not yet confirmed. The timeout should only apply to the initial pending state (waiting pour any transaction to appear), not to the confirmation stage.\n\nPartial visibility is a subtle edge case. Due to RPC node propagation delays, one RPC node may see a transaction while another does not. If your system uses multiple RPC endpoints (pour redundancy), you may detect a transaction on one endpoint et fail to fetch its details from another. Solution: when a signature is found, retry `getTransaction` against the same endpoint that returned the signature, avec retries et backoff, before falling back to alternative endpoints.\n\nMemo et metadata validation should verify that any on-chain memo matches the expected payment metadata. If the merchant includes a `memo` parameter in the Solana Pay URL, the confirmed transaction should contain a corresponding memo instruction. Mismatches may indicate URL tampering.\n\n## Checklist\n- Implement exponential backoff pour RPC failures (500ms, 1s, 2s, 5s cap)\n- Verify transaction details match expected payment parameters\n- Handle double-payment detection avec reference deduplication\n- Distinguish between pending timeout et confirmation timeout\n- Pre-create ATAs pour all accepted SPL tokens\n\n## Red flags\n- Crashing the polling loop on a single RPC error\n- Marking payments complete without verifying amount et recipient\n- Not handling network congestion gracefully (premature timeout)\n- Ignoring double-payment scenarios\n",
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
                    "output": "TX1: sig aaa...111 (processed) | TX2: sig bbb...222 (DUPLICATE — flagged)\nOnly first valid transaction fulfills the order",
                    "note": "Track processed references to prevent double fulfillment"
                  }
                ]
              }
            ]
          },
          "solanapay-v2-pos-receipt": {
            "title": "Checkpoint: Generate a POS receipt",
            "content": "# Checkpoint: Generate a POS receipt\n\nBuild the final POS receipt generator that combines all cours concepts:\n\n- Reconstruct the Solana Pay URL from payment data (recipient, amount, spl-token, reference, label)\n- Generate a deterministic receipt ID from the reference suffix et timestamp\n- Determine currency type: \"SPL\" if splToken is present, otherwise \"SOL\"\n- Include merchant name from the payment label\n- Include the tracking status from the reference tracker\n- Output must be stable JSON avec deterministic key ordering\n\nThis checkpoint validates your complete understanding of Solana Pay commerce integration.",
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
    "title": "Portefeuille UX Engineering",
    "description": "Master production portefeuille UX engineering on Solana: deterministic connection state, network safety, RPC resilience, et measurable reliability patterns.",
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
        "description": "Portefeuille connection conception, network gating, et deterministic state-machine architecture pour predictable onboarding et reconnect paths.",
        "lessons": {
          "walletux-v2-connection-design": {
            "title": "Connection UX that doesn't suck: a conception checklist",
            "content": "# Connection UX that doesn't suck: a conception checklist\n\nPortefeuille connection is the first interaction a user has avec any Solana dApp. If this experience is slow, confusing, or error-prone, most users will leave before they ever reach your core product. Connection UX deserves the same engineering rigor as any critical user flow, yet most teams treat it as an afterthought. This lecon establishes the conception patterns, failure modes, et recovery strategies that separate professional portefeuille integration from broken prototypes.\n\n## The connection lifecycle\n\nA portefeuille connection progresses through a predictable sequence: idle (no portefeuille detected), detecting (scanning pour installed adapters), ready (adapter found, user has not yet approved), connecting (approval dialog shown, waiting pour user action), connected (public key received, session active), et disconnected (user or app terminated the session). Each state must have a distinct visual representation so users always know what is happening et what they need to do next.\n\nAuto-connect is the single most impactful UX optimization. When a user has previously connected a specific portefeuille, the dApp should attempt to reconnect silently on page load without showing a portefeuille selection modal. The Solana portefeuille adapter standard supports this via the `autoConnect` flag. However, auto-connect must be gated: only attempt it if the user previously granted permission (stored in localStorage), et set a timeout of 3-5 seconds. If auto-connect fails silently, fall back to showing the connect button without an error message. Users should never see an error pour a background reconnection attempt they did not initiate.\n\n## Loading states et skeleton UI\n\nDuring the connecting phase, display a skeleton version of the portefeuille-dependent UI rather than a blank screen or spinner. If your app shows a token balance after connection, render a shimmer placeholder in that exact layout position. This technique, called \"optimistic layout reservation,\" prevents jarring content shifts when the connection resolves. The connect button itself should transition to a loading state (disabled, avec a subtle animation) to prevent double-click issues.\n\nConnection timeouts need explicit handling. If the portefeuille adapter does not respond within 10 seconds, assume the user closed the approval dialog or the portefeuille extension is unresponsive. Transition to an error state avec a clear message: \"Connection timed out. Please try again or check your portefeuille extension.\" Never leave the UI in an indefinite loading state. Implement a deterministic timeout using setTimeout et clear it if the connection resolves.\n\n## Error recovery patterns\n\nConnection errors fall into three categories: user-rejected (the user clicked \"Cancel\" in the portefeuille dialog), adapter errors (the portefeuille extension crashed or is not installed), et network errors (the RPC endpoint is unreachable after connection). Each category requires a different recovery path.\n\nUser-rejected connections should return to the idle state quietly. Do not show an error toast or modal pour a deliberate user action. Simply reset the connect button to its default state. If you want to provide a nudge, a subtle inline message like \"Connect your portefeuille to continue\" is sufficient.\n\nAdapter errors require actionable guidance. If no portefeuille is detected, show a \"Get a Portefeuille\" link that opens the Phantom or Solflare installation page. If the adapter throws an unexpected error, display the error message avec a \"Try Again\" button. Log the error details to your analytics system pour debugging, but keep the user-facing message simple.\n\nNetwork errors after connection are particularly tricky because the portefeuille is technically connected (you have the public key) but the app cannot fetch on-chain data. Display a degraded state: show the connected portefeuille address avec a warning badge, disable transaction buttons, et provide a \"Check Connection\" button that re-tests the RPC endpoint. Do not disconnect the portefeuille just because the RPC is temporarily unreachable.\n\n## Multi-portefeuille support\n\nModern Solana dApps must support multiple portefeuille adapters. The portefeuille selection modal should display installed portefeuilles prominently (avec a green \"Detected\" badge) et list popular uninstalled portefeuilles below avec \"Install\" links. Sort installed portefeuilles by most recently used. Remember the user's last portefeuille choice et pre-select it on subsequent visits.\n\nWhen the user switches portefeuilles (disconnects one, connects another), all cached data tied to the previous portefeuille address must be invalidated. Token balances, transaction history, et program-derived compte states are all portefeuille-specific. Failing to clear this cache causes data leakage between comptes, which is both a UX bug et a potential securite issue.\n\n## The checklist\n\n- Implement auto-connect avec a 3-5 second timeout pour returning users\n- Show skeleton UI during the connecting phase to prevent layout shift\n- Set a 10-second hard timeout on connection attempts\n- Handle user-rejected connections silently (no error state)\n- Provide \"Get a Portefeuille\" links when no adapter is detected\n- Display degraded UI (not disconnect) when RPC fails post-connection\n- Invalidate all portefeuille-specific caches on compte switch\n- Remember the user's preferred portefeuille adapter between sessions\n- Disable transaction buttons during connecting et error states\n- Log connection errors to analytics pour monitoring adapter reliability\n\n## Reliability principle\n\nPortefeuille UX is reliability UX. Users judge trust by whether connect, reconnect, et recovery behave predictably under stress, not by visual polish alone.\n",
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
                      "Redirect the user to a portefeuille installation page"
                    ],
                    "answerIndex": 0,
                    "explanation": "Auto-connect is a background optimization. If it fails, the user never initiated the action, so showing an error would be confusing. Simply display the default connect button."
                  },
                  {
                    "id": "walletux-v2-l1-q2",
                    "prompt": "Why should you show skeleton UI during the connecting phase?",
                    "options": [
                      "It prevents layout shift et sets expectations pour where content will appear",
                      "It makes the page load faster",
                      "It is required by the Solana portefeuille adapter standard"
                    ],
                    "answerIndex": 0,
                    "explanation": "Skeleton UI reserves the layout space pour portefeuille-dependent content, preventing jarring shifts when the connection resolves et data loads."
                  }
                ]
              }
            ]
          },
          "walletux-v2-network-gating": {
            "title": "Network gating et wrong-network recovery",
            "content": "# Network gating et wrong-network recovery\n\nSolana has multiple clusters: mainnet-beta, devnet, testnet, et localnet. Unlike EVM chains where the portefeuille controls the network et emits chain-change events, Solana's network selection is typically controlled by the dApp, not the portefeuille. This architectural difference creates a unique set of UX challenges around network mismatch, gating, et recovery.\n\n## The network mismatch problem\n\nWhen a dApp targets mainnet-beta but a user's portefeuille or the app's RPC endpoint points to devnet, transactions will fail silently or produce confusing results. Compte addresses are the same across clusters, but compte state differs entirely. A token compte that holds 1000 USDC on mainnet might not exist on devnet. If your app fetches the balance from devnet while the user expects mainnet, they see zero balance et assume the app is broken or their funds are gone.\n\nNetwork mismatch is not always obvious. The portefeuille might report a successful signature, but the transaction was submitted to a different cluster than the one your app is reading from. This creates phantom transactions: the user sees \"Transaction confirmed\" but no state change in the UI. Debugging this requires checking which cluster the transaction was submitted to versus which cluster the app is polling.\n\n## Detecting the current network\n\nThe primary detection method is to check your RPC endpoint's genesis hash. Each Solana cluster has a unique genesis hash. Call `getGenesisHash()` on your connection et compare it to known values: mainnet-beta's genesis hash is `5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d`, devnet is `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`, et testnet is `4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY`. If the genesis hash does not match your expected cluster, the RPC endpoint is misconfigured.\n\nPour portefeuille-side detection, some portefeuille adapters expose network information, but this is not standardized. The most reliable approach is to perform a lightweight RPC call (getGenesisHash or getEpochInfo) immediately after connection et compare the response against your expected cluster configuration.\n\n## Network gating patterns\n\nNetwork gating prevents users from performing actions on the wrong network. There are two levels of gating: soft gating et hard gating.\n\nSoft gating shows a warning banner but allows the user to continue. This is appropriate pour development tools, block explorers, et apps that intentionally support multiple clusters. The banner should clearly state the current network, use color coding (green pour mainnet, yellow pour devnet, red pour testnet/localnet), et be persistent (not dismissible) so the user always sees it.\n\nHard gating blocks all interactions until the network matches the expected cluster. This is appropriate pour production DeFi applications where operating on the wrong network could cause real financial loss. Hard gating should display a full-screen overlay or modal avec a clear message: \"This app requires Mainnet Beta. Your connection is currently pointing to Devnet.\" Include a button to switch the RPC endpoint if your app supports runtime endpoint switching.\n\n## Recovery strategies\n\nWhen a network mismatch is detected, the recovery flow depends on who controls the network selection. In most Solana dApps, the app controls the RPC endpoint, so recovery means updating the app's connection object to point to the correct cluster. This can be done automatically (if the correct endpoint is known) or manually (presenting the user avec a network selector).\n\nIf recovery requires the user to change their portefeuille's network setting (less common on Solana but possible avec some portefeuilles), provide step-by-step instructions specific to the detected portefeuille adapter. Pour Phantom: \"Open Phantom > Settings > Developer Settings > Change Network.\" Include screenshots or a link to the portefeuille's documentation.\n\nAfter network switching, all cached data must be invalidated. Compte states, token balances, transaction history, et program-derived addresses may differ across clusters. Implement a `networkChanged` event handler that: clears all cached RPC responses, resets the connection state machine, re-fetches critical compte data, et updates the UI to reflect the new network.\n\n## Multi-network development workflow\n\nPour developers building on Solana, supporting seamless network switching during development is essential. Store the selected network in localStorage so it persists across page reloads. Provide a developer-only network switcher (hidden behind a feature flag or only visible in non-production builds) that allows quick toggling between mainnet, devnet, et localnet.\n\nWhen switching networks programmatically, create a new Connection object rather than mutating the existing one. This prevents race conditions where in-flight requests on the old network collide avec new requests on the new network. The connection switch should be atomic: update the connection reference, clear all caches, et trigger a full data refresh in a single synchronous operation.\n\n## Checklist\n- Check genesis hash immediately after RPC connection to verify the cluster\n- Use color-coded persistent banners to indicate the current network\n- Hard-gate production DeFi apps to the expected cluster\n- Invalidate all caches when the network changes\n- Create new Connection objects instead of mutating existing ones\n- Store network preference in localStorage pour persistence\n- Provide portefeuille-specific instructions pour network switching\n\n## Red flags\n- Allowing transactions on the wrong network without any warning\n- Caching data across network switches (stale cross-network data)\n- Mutating the Connection object during network switch (race conditions)\n- Assuming portefeuille et dApp are always on the same cluster\n",
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
                      "Call getGenesisHash() et compare against known cluster genesis hashes",
                      "Check the URL string pour 'mainnet' or 'devnet'",
                      "Ask the portefeuille adapter which network it is using"
                    ],
                    "answerIndex": 0,
                    "explanation": "Each Solana cluster has a unique genesis hash. Comparing the RPC's genesis hash against known values is the only reliable detection method, since URL strings can be misleading et portefeuilles don't always expose network info."
                  },
                  {
                    "id": "walletux-v2-l2-q2",
                    "prompt": "What must happen to cached data when the network changes?",
                    "options": [
                      "All cached data must be invalidated because compte states differ across clusters",
                      "Only token balances need to be refreshed",
                      "Cached data can be retained since addresses are the same across clusters"
                    ],
                    "answerIndex": 0,
                    "explanation": "While compte addresses are identical across clusters, the compte states (balances, data, existence) are completely different. All cached RPC data must be cleared on network switch."
                  }
                ]
              }
            ]
          },
          "walletux-v2-state-explorer": {
            "title": "Connection state machine: states, events, et transitions",
            "content": "# Connection state machine: states, events, et transitions\n\nPortefeuille connection logic in most dApps is implemented as a tangle of boolean flags, useEffect hooks, et conditional renders. This approach leads to impossible states (loading ET error simultaneously), missed transitions (forgetting to clear the error when retrying), et race conditions (two connection attempts running in parallel). A finite state machine (FSM) eliminates these problems by making every possible state et transition explicit.\n\n## Why state machines pour portefeuille connections\n\nA state machine defines a finite set of states, a finite set of events, et a deterministic transition function that maps (currentState, event) to nextState. At any point in time, the system is in exactly one state. This guarantees that impossible combinations (connected ET disconnected) cannot occur. Every event is either handled by the current state or explicitly rejected, eliminating silent failures.\n\nPour portefeuille connections, the core states are: `disconnected` (no active session), `connecting` (waiting pour portefeuille approval or RPC confirmation), `connected` (session active, public key available), et `error` (something went wrong). Each state maps to a specific UI presentation, specific allowed user actions, et specific side effects.\n\n## Defining the transition table\n\nThe transition table is the heart of the state machine. It specifies which events are valid in which states et what the resulting state should be:\n\n```\ndisconnected + CONNECT       → connecting\nconnecting   + CONNECTED     → connected\nconnecting   + CONNECTION_ERROR → error\nconnecting   + TIMEOUT       → error\nconnected    + DISCONNECT    → disconnected\nconnected    + NETWORK_CHANGE → connected (with updated network)\nconnected    + ACCOUNT_CHANGE → connected (with updated address)\nconnected    + CONNECTION_LOST → error\nerror        + RETRY         → connecting\nerror        + DISCONNECT    → disconnected\n```\n\nAny event not listed pour a given state is invalid. Invalid events should transition to the error state avec a descriptive message rather than being silently ignored. This makes debugging straightforward: every unexpected event is captured et logged.\n\n## Side effects et context\n\nState transitions carry context (also called \"extended state\" or \"context\"). The connection state machine tracks: `walletAddress` (set on CONNECTED et ACCOUNT_CHANGE events), `network` (set on CONNECTED et NETWORK_CHANGE events), `errorMessage` (set when entering the error state), et `transitions` (a log of all state transitions pour debugging).\n\nSide effects are actions triggered by transitions, not by states. Pour example, the transition from `connecting` to `connected` should trigger: fetching the initial compte balance, subscribing to compte change notifications, et logging the connection event to analytics. The transition from `connected` to `disconnected` should trigger: clearing all cached data, unsubscribing from notifications, et resetting the UI to the idle layout.\n\n## Implementation patterns\n\nIn React applications, the state machine can be implemented using `useReducer` avec the transition table as the reducer logic. The reducer receives the current state et an event (action), looks up the transition in the table, et returns the new state avec updated context. This approach is testable (pure function), predictable (no side effects in the reducer), et composable (multiple components can read the state without duplicating logic).\n\nPour more complex scenarios, libraries like XState provide first-class support pour statecharts (hierarchical state machines avec guards, actions, et services). XState's visualizer can render the state machine as a diagram, making it easy to verify that all states et transitions are covered. However, pour portefeuille connection logic, a simple transition table in a useReducer is usually sufficient.\n\nThe transition history array is invaluable pour debugging. When a user reports a connection issue, the transition log shows exactly what happened: which events fired, in what order, et what states resulted. This is far more useful than a single boolean flag or an error message captured at an arbitrary point.\n\n## Tests state machines\n\nState machines are inherently testable because they are pure functions. Given a starting state et a sequence of events, the output is completely deterministic. Test cases should cover: the happy path (disconnected → connecting → connected), error recovery (connecting → error → retry → connecting → connected), compte switching (connected → ACCOUNT_CHANGE → connected avec new address), et invalid events (connected + CONNECT should transition to error, not silently ignored).\n\nEdge cases to test: rapid event sequences (CONNECT followed immediately by DISCONNECT before the connection resolves), duplicate events (two CONNECTED events in a row), et state persistence (does the machine correctly restore state from localStorage on page reload?).\n\n## Checklist\n- Define all states explicitly: disconnected, connecting, connected, error\n- Map every valid (state, event) pair to a next state\n- Handle invalid events by transitioning to error avec a descriptive message\n- Track transition history pour debugging\n- Implement the state machine as a pure reducer function\n- Clear context data (portefeuille address, network) on disconnect\n- Clear error message on retry\n",
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
                    "note": "Portefeuille approved, session active"
                  },
                  {
                    "cmd": "Event: ACCOUNT_CHANGE { walletAddress: '9pQR...' }",
                    "output": "connected → connected | address=9pQR... | network=mainnet-beta",
                    "note": "User switched comptes, address updated, network retained"
                  },
                  {
                    "cmd": "Event: CONNECTION_LOST { message: 'WebSocket closed' }",
                    "output": "connected → error | errorMessage='WebSocket closed'",
                    "note": "Connection dropped, show error avec retry option"
                  },
                  {
                    "cmd": "Event: RETRY",
                    "output": "error → connecting | errorMessage=null",
                    "note": "User clicks retry, clear error et reconnect"
                  }
                ]
              }
            ]
          },
          "walletux-v2-connection-state": {
            "title": "Challenge: Implement portefeuille connection state machine",
            "content": "# Challenge: Implement portefeuille connection state machine\n\nBuild a deterministic state machine pour portefeuille connection management:\n\n- States: disconnected, connecting, connected, error\n- Process a sequence of events et track all state transitions\n- CONNECTED et ACCOUNT_CHANGE events carry a walletAddress; CONNECTED et NETWORK_CHANGE carry a network\n- Error state stores the error message; disconnected clears all session data\n- Invalid events force transition to error state avec a descriptive message\n- Track transition history as an array of {from, event, to} objects\n\nThe state machine must be fully deterministic — same event sequence always produces same result.",
            "duration": "50 min",
            "hints": [
              "Define a TRANSITIONS map: each state maps event types to next states.",
              "CONNECTED et ACCOUNT_CHANGE events carry walletAddress. CONNECTED et NETWORK_CHANGE carry network.",
              "Error state stores the error message. Disconnected clears all session data.",
              "Invalid events force transition to error state avec descriptive message."
            ]
          }
        }
      },
      "walletux-v2-production": {
        "title": "Production Patterns",
        "description": "Cache invalidation, RPC resilience et health monitoring, et measurable portefeuille UX quality reporting pour production operations.",
        "lessons": {
          "walletux-v2-cache-invalidation": {
            "title": "Challenge: Cache invalidation on portefeuille events",
            "content": "# Challenge: Cache invalidation on portefeuille events\n\nBuild a cache invalidation engine that processes portefeuille events et invalidates the correct cache entries:\n\n- Cache entries have tags: \"compte\" (portefeuille-specific data), \"network\" (cluster-specific data), \"global\" (persists across everything)\n- ACCOUNT_CHANGE invalidates all entries tagged \"compte\"\n- NETWORK_CHANGE invalidates entries tagged \"network\" ET \"compte\" (network change means all compte data is stale)\n- DISCONNECT invalidates all non-\"global\" entries\n- Track per-event invalidation counts in an event log\n- Return the final cache state, total invalidated count, et retained count\n\nThe invalidation logic must be deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "ACCOUNT_CHANGE invalidates entries tagged 'compte'.",
              "NETWORK_CHANGE invalidates both 'network' et 'compte' tagged entries.",
              "DISCONNECT invalidates all non-'global' entries.",
              "Track invalidation counts per event in the event log."
            ]
          },
          "walletux-v2-rpc-caching": {
            "title": "RPC reads et caching strategy pour portefeuille apps",
            "content": "# RPC reads et caching strategy pour portefeuille apps\n\nEvery interaction in a Solana portefeuille application ultimately depends on RPC calls: fetching balances, loading token comptes, reading program state, et confirming transactions. Without a caching strategy, your app hammers the RPC endpoint avec redundant requests, drains rate limits, et delivers a sluggish user experience. A well-designed cache layer transforms portefeuille apps from painfully slow to instantly responsive while keeping data fresh enough pour financial accuracy.\n\n## The RPC cost problem\n\nSolana RPC calls are not free. Public endpoints like those provided by Solana Foundation have aggressive rate limits (typically 40 requests per 10 seconds pour free tiers). Premium providers (Helius, QuickNode, Triton) charge per request or by compute units consumed. A naive portefeuille app that re-fetches every piece of data on every render can easily exceed 100 requests per minute pour a single user. Multiply by thousands of concurrent users et costs become significant.\n\nBeyond cost, latency kills UX. A `getTokenAccountsByOwner` call takes 200-800ms depending on the endpoint et compte complexity. If the user switches tabs et returns, re-fetching everything from scratch creates a noticeable loading delay. Caching eliminates this delay pour data that has not changed.\n\n## Cache taxonomy\n\nNot all RPC data has the same freshness requirements. Categorize cache entries by their volatility:\n\n**Immutable data** (cache indefinitely): mint metadata (name, symbol, decimals, logo URI), program compte structures, et historical transaction details. Once fetched, this data never changes. Store it in an in-memory Map avec no expiration.\n\n**Semi-stable data** (cache pour 30-60 seconds): token balances, staking positions, gouvernance votes, et NFT ownership. This data changes infrequently pour most users. A 30-second TTL (time to live) provides a good balance between freshness et efficiency. Use a cache key that includes the portefeuille address et network to prevent cross-compte contamination.\n\n**Volatile data** (cache pour 5-10 seconds or not at all): recent transaction confirmations, real-time price feeds, et active swap quotes. This data changes constantly et becomes stale quickly. Short TTLs or no caching at all is appropriate. Pour transaction confirmations, use WebSocket subscriptions instead of polling.\n\n## Cache key conception\n\nCache keys must uniquely identify the request parameters ET the context. A good cache key pour a balance query includes: the RPC method name, the compte address, the commitment level, et the network cluster. Pour example: `getBalance:7xKXp...abc:confirmed:mainnet-beta`. Including the network in the key prevents a critical bug: returning devnet data when the user has switched to mainnet.\n\nPour `getTokenAccountsByOwner`, the key should include the owner address et the program filter (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID). Different token programs return different compte sets, et caching them under the same key returns incorrect results.\n\n## Invalidation triggers\n\nCache invalidation is triggered by three portefeuille events: compte change, network change, et disconnect. These events were covered in the previous challenge, but the caching layer adds nuance.\n\nCompte change invalidates all entries keyed by the portefeuille address. Token balances, transaction history, et program-derived compte states are all portefeuille-specific. Global data (mint metadata, program IDL) survives an compte change.\n\nNetwork change invalidates everything except truly global, network-independent data (UI preferences, theme settings). Even mint metadata should be invalidated because a mint address might exist on mainnet but not on devnet, or have different state.\n\nUser-initiated refresh is the escape hatch. Provide a \"Refresh\" button that clears the entire cache et re-fetches all visible data. Users expect this when they know an external action (a transfer from another device) has changed their state but the cache has not expired yet.\n\n## Stale-while-revalidate pattern\n\nThe most effective caching strategy pour portefeuille apps is stale-while-revalidate (SWR). When a cache entry is requested: if fresh (within TTL), return it immediately. If stale (past TTL but within a grace period, e.g., 2x TTL), return the stale value immediately ET trigger a background re-fetch. When the re-fetch completes, update the cache et notify the UI. If expired (past grace period), block et re-fetch before returning.\n\nThis pattern ensures the UI always responds instantly avec the best available data while keeping it fresh in the background. Libraries like SWR (pour React) et TanStack Query implement this pattern out of the box avec configurable TTL, grace periods, et background refetch intervals.\n\n## Checklist\n- Categorize RPC data by volatility: immutable, semi-stable, volatile\n- Include portefeuille address et network in all cache keys\n- Invalidate compte-tagged caches on portefeuille switch\n- Invalidate all non-global caches on network switch\n- Implement stale-while-revalidate pour semi-stable data\n- Provide a manual refresh button as an escape hatch\n- Monitor cache hit rates to validate your TTL configuration\n\n## Red flags\n- Caching without network in the key (cross-network data leakage)\n- Not invalidating on compte switch (showing previous portefeuille's data)\n- Setting TTLs too long pour financial data (stale balance display)\n- Re-fetching everything on every render (defeats the purpose of caching)\n",
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
                      "Compte states differ across clusters, so cached devnet data would be wrong pour mainnet",
                      "Cache keys must be globally unique pour performance",
                      "The Solana RPC protocol requires cluster identification"
                    ],
                    "answerIndex": 0,
                    "explanation": "The same compte address can have completely different state on mainnet vs devnet. Without the network in the key, switching clusters would return stale data from the previous cluster."
                  },
                  {
                    "id": "walletux-v2-l6-q2",
                    "prompt": "What does the stale-while-revalidate pattern do when a cache entry is past its TTL?",
                    "options": [
                      "Returns the stale value immediately et triggers a background re-fetch",
                      "Blocks until fresh data is fetched from the RPC",
                      "Deletes the stale entry et returns null"
                    ],
                    "answerIndex": 0,
                    "explanation": "SWR prioritizes responsiveness by serving stale data instantly while refreshing in the background. This eliminates loading states pour data that has only slightly exceeded its TTL."
                  }
                ]
              }
            ]
          },
          "walletux-v2-rpc-health": {
            "title": "RPC health monitoring et graceful degradation",
            "content": "# RPC health monitoring et graceful degradation\n\nRPC endpoints are the lifeline of every Solana portefeuille application. When they go down, become slow, or return stale data, your app becomes unusable. Production portefeuille apps must continuously monitor RPC health et degrade gracefully when issues are detected, rather than showing cryptic errors or silently displaying stale data. This lecon covers the engineering patterns pour building resilient RPC connectivity.\n\n## Why RPC endpoints fail\n\nSolana RPC endpoints experience several failure modes. Rate limiting is the most common: free-tier endpoints enforce strict per-IP et per-second limits, et exceeding them results in HTTP 429 responses. Latency spikes occur during high network activity (NFT mints, token launches) when validateurs are under heavy load et RPC nodes queue requests. Stale data happens when an RPC node falls behind the cluster's tip slot, returning compte states that are several slots (or seconds) old. Complete outages, while rare pour premium providers, do happen et can last minutes to hours.\n\nEach failure mode requires a different response. Rate limiting needs request throttling et backoff. Latency spikes need timeout management et user communication. Stale data needs detection et provider rotation. Complete outages need failover to a backup endpoint.\n\n## Health check implementation\n\nImplement a periodic health check that runs every 15-30 seconds while the app is active. The health check should measure three metrics: latency (round-trip time pour a `getSlot` call), freshness (compare the returned slot against the expected tip slot from a secondary source or the previous check), et error rate (percentage of failed requests in the last N calls).\n\nA healthy endpoint has latency under 500ms, slot freshness within 5 slots of the expected tip, et an error rate below 5%. An unhealthy endpoint has latency over 2000ms, slot freshness more than 50 slots behind, or an error rate above 20%. The intermediaire range (degraded) triggers warnings without failover.\n\nStore health check results in a rolling window (last 10-20 checks). A single slow response should not trigger failover, but 3 consecutive slow responses should. This smoothing prevents flapping between endpoints due to transient network issues.\n\n## Failover strategies\n\nPrimary-secondary failover is the simplest pattern. Configure a primary RPC endpoint (your preferred provider) et one or more secondaries (different providers pour diversity). When the primary becomes unhealthy, route all requests to the secondary. Periodically re-check the primary (every 60 seconds) et switch back when it recovers. This prevents all your traffic from permanently migrating to the secondary.\n\nRound-robin avec health weighting distributes requests across multiple endpoints based on their current health scores. A healthy endpoint gets a weight of 1.0, a degraded endpoint gets 0.3, et an unhealthy endpoint gets 0.0. This approach provides better throughput than single-endpoint strategies et automatically adapts to changing conditions.\n\nPour critical transactions (swaps, transfers), always use the endpoint avec the lowest latency ET highest freshness. Transaction submission is latency-sensitive: a stale blockhash from a behind-the-tip node will cause the transaction to be rejected. Pour read operations (balance queries), slightly stale data is acceptable if it means faster responses.\n\n## Graceful degradation in the UI\n\nWhen RPC health degrades, the UI should communicate the situation clearly without panic. Display a small status indicator (green dot, yellow dot, red dot) near the network name or in the status bar. Clicking it should show detailed health information: current latency, last successful request time, et the number of failed requests.\n\nDuring degraded mode, disable or add warnings to transaction buttons. A yellow warning like \"Network may be slow — transactions might take longer than usual\" is better than letting users submit transactions that will likely time out. During a full outage, disable all transaction features et show a clear message: \"Unable to reach the Solana network. Your funds are safe. We'll reconnect automatically.\"\n\nNever hide the degradation. Users who submit transactions during an outage et see \"Transaction failed\" without explanation will assume their funds are at risk. Proactive communication (\"The network is experiencing delays\") builds trust even when the experience is suboptimal.\n\n## Request retry et throttling\n\nWhen an RPC request fails, classify the error before deciding whether to retry. HTTP 429 (rate limited): back off exponentially starting at 1 second, retry up to 3 times. HTTP 5xx (server error): retry once after 2 seconds, then failover to secondary endpoint. Network timeout: retry once avec a shorter timeout (the request may have succeeded but the response was lost), then failover. HTTP 4xx (client error): do not retry, the request is malformed.\n\nImplement a request queue avec concurrency limits. Most RPC providers allow 10-40 concurrent requests. If your app tries to fire 50 requests simultaneously (common during initial data loading), queue the excess et process them as earlier requests complete. This prevents self-inflicted rate limiting.\n\nDebounce user-triggered requests. If the user rapidly clicks \"Refresh\" or types in a search field that triggers RPC lookups, debounce the requests to at most one per 500ms. This is simple to implement et dramatically reduces unnecessary RPC traffic.\n\n## Monitoring et alerting\n\nLog all RPC metrics to your observability system: request count, error count, latency percentiles (p50, p95, p99), et cache hit rate. Set alerts pour: error rate exceeding 10% over 5 minutes, p95 latency exceeding 3 seconds, et cache hit rate dropping below 50% (indicates a cache invalidation bug or a change in access patterns).\n\nTrack per-endpoint metrics separately. If your primary endpoint's error rate spikes while the secondary is healthy, the failover logic should handle it automatically. But if both endpoints degrade simultaneously, it likely indicates a Solana network-wide issue rather than a provider problem, et the alerting should reflect that distinction.\n\n## Checklist\n- Run health checks every 15-30 seconds measuring latency, freshness, et error rate\n- Implement primary-secondary failover avec automatic recovery\n- Display RPC health status in the UI (green/yellow/red indicator)\n- Disable transaction features during outages avec clear messaging\n- Classify errors before retrying (429 vs 5xx vs 4xx)\n- Implement request queue avec concurrency limits\n- Debounce user-triggered RPC requests\n- Monitor et alert on error rate, latency, et cache hit rate\n\n## Red flags\n- No failover endpoints (single point of failure)\n- Retrying 4xx errors (wastes requests on malformed input)\n- Hiding RPC failures from the user (builds distrust)\n- No concurrency limits (self-inflicted rate limiting)\n",
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
            "title": "Checkpoint: Generate a Portefeuille UX Report",
            "content": "# Checkpoint: Generate a Portefeuille UX Report\n\nBuild the final portefeuille UX quality report that combines all cours concepts:\n\n- Count connection attempts (CONNECT events) et successful connections (CONNECTED events)\n- Calculate success rate as a percentage avec 2 decimal places\n- Compute average connection time from CONNECTED events' durationMs\n- Count ACCOUNT_CHANGE et NETWORK_CHANGE events\n- Calculate cache hit rate from cacheStats (hits / total * 100, 2 decimal places)\n- Calculate RPC health score from rpcChecks (healthy / total * 100, 2 decimal places)\n- Include the timestamp from input\n\nThis checkpoint validates your complete understanding of portefeuille UX engineering.",
            "duration": "55 min",
            "hints": [
              "Count CONNECT events pour attempts, CONNECTED pour successes.",
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
    "title": "Sign-In Avec Solana",
    "description": "Master production SIWS authentication on Solana: standardized inputs, strict verification invariants, replay-resistant nonce lifecycle, et audit-ready reporting.",
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
        "description": "SIWS rationale, strict input-field semantics, portefeuille rendering behavior, et deterministic sign-in input construction.",
        "lessons": {
          "siws-v2-why-exists": {
            "title": "Why SIWS exists: replacing connect-et-signMessage",
            "content": "# Why SIWS exists: replacing connect-et-signMessage\n\nBefore Sign-In Avec Solana (SIWS) became a standard, dApps authenticated portefeuille holders using a two-step pattern: connect the portefeuille, then call `signMessage` avec an arbitrary string. The user would see a raw byte blob in their portefeuille's approval screen, sign it, et the server would verify the signature against the expected public key. This worked, but it was fragile, inconsistent, et dangerous.\n\n## The problems avec raw signMessage\n\nThe fundamental issue avec raw `signMessage` authentication is that portefeuilles cannot distinguish between a benign sign-in request et a malicious payload. When a portefeuille displays \"Sign this message: 0x48656c6c6f\" or even a human-readable string like \"Please sign in to example.com at 2024-01-15T10:30:00Z,\" the portefeuille has no structured way to parse, validate, or warn about the content. The user must trust that the dApp is honest about what it is asking them to sign.\n\nThis creates several attack vectors. A malicious dApp could present a sign-in prompt that actually contains a serialized transaction. If the portefeuille treats `signMessage` payloads as opaque bytes (which most do), the user signs what they believe is a login but is actually an authorization pour a token transfer. Even without outright fraud, the lack of structure means different dApps format their sign-in messages differently. Users see inconsistent approval screens across applications, eroding trust et making it harder to identify legitimate requests.\n\nReplay attacks are another critical weakness. If a dApp asks the user to sign \"Log in to example.com\" without a nonce or timestamp, the resulting signature is valid forever. An attacker who intercepts this signature (via a compromised server log, a man-in-the-middle proxy, or a leaked database) can replay it indefinitely to impersonate the user. Adding a nonce or timestamp to the message helps, but without a standard format, each dApp implements its own scheme — some correctly, many not.\n\n## What SIWS standardizes\n\nSign-In Avec Solana defines a structured message format that portefeuilles can parse, validate, et display in a human-readable, predictable way. The SIWS standard specifies exactly which fields a sign-in request must contain et how portefeuilles should render them. This moves authentication from an opaque byte-signing operation to a semantically meaningful, portefeuille-aware protocol.\n\nThe core fields of a SIWS sign-in input are: **domain** (the requesting site's origin, displayed prominently by the portefeuille), **address** (the expected signer's public key), **nonce** (a unique, server-generated value that prevents replay attacks), **issuedAt** (ISO 8601 timestamp marking when the request was created), **expirationTime** (optional deadline after which the sign-in is invalid), **statement** (human-readable description of what the user is approving), **chainId** (the Solana cluster, e.g., mainnet-beta), et **resources** (optional URIs that the sign-in grants access to).\n\nWhen a portefeuille receives a SIWS request, it knows the structure. It can display the domain prominently so the user can verify they are signing in to the correct site. It can show the expiration time so the user knows the request is time-limited. It can warn if the domain in the request does not match the domain the portefeuille was connected from. This structured rendering is a massive UX improvement over displaying raw bytes.\n\n## UX improvements pour end users\n\nAvec SIWS, portefeuille approval screens become consistent et informative. Instead of seeing an arbitrary string, users see a formatted display: the requesting domain, the statement explaining the action, the nonce (often hidden from the user but validated by the portefeuille), et time bounds. This consistency across dApps builds user confidence — they apprenez to recognize what a legitimate sign-in request looks like.\n\nPortefeuilles can also implement automatic safety checks. If the domain in the SIWS input does not match the origin of the connecting dApp, the portefeuille can show a warning or block the request entirely. If the issuedAt timestamp is far in the past or the expirationTime has already passed, the portefeuille can reject the request before the user even sees it. These checks are impossible avec raw `signMessage` because the portefeuille has no way to parse the content.\n\n## Server-side benefits\n\nPour backend developers, SIWS provides a predictable verification flow. The server generates a nonce, sends the SIWS input to the client, receives the signed output, et verifies: (1) the signature is valid pour the claimed address, (2) the domain matches the server's domain, (3) the nonce matches the one the server issued, (4) the timestamps are within acceptable bounds, et (5) the address matches the expected signer. Each check is explicit et auditable, unlike ad-hoc string parsing.\n\nThe nonce mechanism is particularly important. The server stores issued nonces (in memory, Redis, or a database) et marks them as consumed after successful verification. Any attempt to reuse a nonce is rejected as a replay attack. This provides cryptographic proof of freshness that raw signMessage authentication lacks unless the developer explicitly implements it — et history shows most developers do not.\n\n## The path forward\n\nSIWS aligns Solana's authentication story avec Ethereum's Sign-In Avec Ethereum (SIWE / EIP-4361) et other chain-specific standards. Cross-chain dApps can implement a unified authentication flow avec chain-specific signing backends. The portefeuille-side rendering, nonce management, et verification logic are consistent patterns regardless of the underlying blockchain.\n\n## Operator mindset\n\nTreat SIWS as a protocol contract, not a UI prompt. If nonce lifecycle, domain checks, et time bounds are not enforced as strict invariants, authentication becomes signature theater.\n\n## Checklist\n- Understand why raw signMessage is insufficient pour authentication\n- Know the core SIWS fields: domain, address, nonce, issuedAt, expirationTime, statement\n- Recognize that SIWS enables portefeuille-side validation et consistent UX\n- Understand the server-side nonce flow: generate, issue, verify, consume\n\n## Red flags\n- Using raw signMessage pour authentication without structured format\n- Omitting nonce from sign-in messages (enables replay attacks)\n- Not validating domain match between SIWS input et connecting origin\n- Allowing sign-in messages without expiration times\n",
            "duration": "50 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l1-q1",
                    "prompt": "What is the primary securite problem avec using raw signMessage pour authentication?",
                    "options": [
                      "Portefeuilles cannot distinguish sign-in requests from malicious payloads",
                      "signMessage is too slow pour production use",
                      "signMessage does not produce valid Ed25519 signatures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Without structured format, portefeuilles treat signMessage payloads as opaque bytes et cannot validate or warn about the content, making it easy pour malicious dApps to disguise harmful payloads as sign-in requests."
                  },
                  {
                    "id": "siws-v2-l1-q2",
                    "prompt": "How does SIWS prevent replay attacks?",
                    "options": [
                      "By requiring a unique, server-generated nonce that is consumed after verification",
                      "By encrypting the signed message avec AES-256",
                      "By requiring the user to sign twice avec different keys"
                    ],
                    "answerIndex": 0,
                    "explanation": "The server generates a unique nonce pour each sign-in attempt. After successful verification, the nonce is marked as consumed. Any reuse of the same nonce is rejected as a replay attack."
                  }
                ]
              }
            ]
          },
          "siws-v2-input-fields": {
            "title": "SIWS input fields et securite rules",
            "content": "# SIWS input fields et securite rules\n\nThe Sign-In Avec Solana input is a structured object that defines every parameter of an authentication request. Each field has specific validation rules, securite implications, et rendering expectations. Understanding every field deeply is essential pour building a correct et secure SIWS implementation.\n\n## domain\n\nThe `domain` field identifies the requesting application. It must be a valid domain name without protocol prefix — \"example.com\", not \"https://example.com\". The domain serves as the primary trust anchor: when the portefeuille displays the sign-in request, the domain is shown prominently so the user can verify they are interacting avec the intended site.\n\nSecurite rule: the server must verify that the domain in the signed output matches its own domain exactly. If a user signs a SIWS message pour \"evil.com\" et submits it to \"example.com\", the server must reject it. The domain check prevents cross-site authentication relay attacks where an attacker presents their own domain to the user but submits the signed result to a different server. Domain validation should be case-insensitive (domains are case-insensitive per RFC 4343) et must reject domains containing protocol prefixes, paths, ports, or query strings.\n\n## address\n\nThe `address` field contains the Solana public key (base58-encoded) of the portefeuille that will sign the request. On Solana, public keys are 32 bytes encoded in base58, resulting in strings of 32-44 characters. The address must match the actual signer of the SIWS output — if the address in the input says \"Wallet111\" but \"Wallet222\" actually signs the message, verification must fail.\n\nSecurite rule: always validate address format before sending the request to the portefeuille. A malformed address will cause downstream verification failures. Check that the address is 32-44 characters long et consists only of valid base58 characters (no 0, O, I, or l — these are excluded from base58 to avoid visual ambiguity). On the server side, verify that the address in the signed output matches the address you expected (typically the address of the connected portefeuille).\n\n## nonce\n\nThe `nonce` is the single most important securite field in SIWS. It is a server-generated, unique, unpredictable string that ties the sign-in request to a specific authentication attempt. The nonce must be at least 8 characters long et should be alphanumeric. In production, nonces are typically 16-32 character random strings generated using a cryptographically secure random number generator.\n\nSecurite rule: nonces must be generated server-side, never client-side. If the client generates its own nonce, an attacker can reuse a previously valid nonce-signature pair. The server must store the nonce (avec a TTL matching the sign-in expiration window) et check it during verification. After successful verification, the nonce must be permanently invalidated (deleted or marked as consumed). The nonce storage must be atomic — a race condition where two requests verify the same nonce simultaneously would defeat the replay protection entirely.\n\nNonce storage options include: in-memory maps (suitable pour single-server deployments), Redis avec TTL (suitable pour distributed systems), et database tables avec unique constraints. Whatever storage is used, the invalidation must be atomic: check-et-delete in a single operation, not check-then-delete in two steps.\n\n## issuedAt\n\nThe `issuedAt` field is an ISO 8601 timestamp indicating when the sign-in request was created. It provides temporal context pour the authentication attempt. The server sets this value when generating the sign-in input.\n\nSecurite rule: during verification, the server must check that `issuedAt` is not in the future (allowing a small clock skew tolerance of 1-2 minutes). A sign-in request avec a future issuedAt timestamp is suspicious — it may indicate clock manipulation or request fabrication. The server should also reject sign-in requests where issuedAt is too far in the past, even if the expirationTime has not passed. A reasonable maximum age pour issuedAt is 10-15 minutes.\n\n## expirationTime\n\nThe `expirationTime` field is an optional ISO 8601 timestamp indicating when the sign-in request becomes invalid. If present, it must be strictly after `issuedAt`. If absent, the sign-in request has no explicit expiration (though the server should still enforce a maximum age based on issuedAt).\n\nSecurite rule: if expirationTime is present, the server must verify that the current time is before the expiration. Expired sign-in requests must be rejected regardless of signature validity. Setting short expiration windows (5-15 minutes) reduces the window pour replay attacks et limits the useful lifetime of intercepted sign-in requests. Production systems should always set expirationTime rather than relying solely on nonce expiration.\n\n## statement\n\nThe `statement` field is a human-readable string that the portefeuille displays to the user, describing what they are approving. If not provided by the dApp, a sensible default is \"Sign in to <domain>\". The statement should be concise, clear, et accurately describe the action.\n\nSecurite rule: the statement is informational et should not contain sensitive data. It is included in the signed message, so it is visible to anyone who can see the signature. Do not include session tokens, API keys, or other secrets in the statement. The portefeuille renders the statement as-is, so avoid HTML, markdown, or other formatting that might be misinterpreted.\n\n## chainId et resources\n\nThe `chainId` field identifies the Solana cluster (e.g., \"mainnet-beta\", \"devnet\", \"testnet\"). This prevents cross-cluster authentication where a signature obtained on devnet is replayed on mainnet. The `resources` field is an optional array of URIs that the sign-in grants access to. These are informational et displayed by the portefeuille.\n\nSecurite rule: if your dApp operates on a specific cluster, verify that the chainId in the signed output matches your expected cluster. Resources should be validated as well-formed URIs but their enforcement is application-specific.\n\n## Checklist\n- Domain must not include protocol, path, or port\n- Nonce must be >= 8 alphanumeric characters, generated server-side\n- issuedAt must not be in the future; reject stale requests\n- expirationTime (if present) must be after issuedAt et not yet passed\n- Address must be 32-44 characters of valid base58\n- Statement should default to \"Sign in to <domain>\" if not provided\n\n## Red flags\n- Accepting client-generated nonces\n- Not validating domain format (allowing protocol prefixes)\n- Missing atomic nonce invalidation (check-then-delete race condition)\n- No maximum age check on issuedAt\n- Storing secrets in the statement field\n",
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
                      "Portefeuilles cannot sign messages containing client-generated nonces"
                    ],
                    "answerIndex": 0,
                    "explanation": "If the client generates nonces, an attacker can replay a previously captured nonce-signature pair. Server-generated nonces ensure each authentication attempt is unique et controlled by the server."
                  },
                  {
                    "id": "siws-v2-l2-q2",
                    "prompt": "What format must the domain field use?",
                    "options": [
                      "Plain domain name without protocol prefix (e.g., example.com)",
                      "Full URL avec protocol (e.g., https://example.com)",
                      "IP address avec port number"
                    ],
                    "answerIndex": 0,
                    "explanation": "The domain field must be a plain domain name. Protocol prefixes, paths, ports, et query strings must be rejected to ensure consistent domain matching."
                  }
                ]
              }
            ]
          },
          "siws-v2-message-preview": {
            "title": "Message preview: how portefeuilles render SIWS requests",
            "content": "# Message preview: how portefeuilles render SIWS requests\n\nWhen a dApp sends a SIWS sign-in request to a portefeuille, the portefeuille transforms the structured input into a human-readable message that the user sees on the approval screen. Understanding exactly how this rendering works is critical pour dApp developers — it determines what users see, what they trust, et what they sign.\n\n## The SIWS message format\n\nThe SIWS standard defines a specific text format pour the message that gets signed. The portefeuille constructs this message from the structured input fields. The format follows a predictable template that portefeuilles can both generate et parse. The message begins avec the domain et address, followed by a statement, then a structured block of metadata fields.\n\nA complete SIWS message looks like this:\n\n```\nexample.com wants you to sign in with your Solana account:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z\nChain ID: mainnet-beta\n```\n\nThe first line always follows the pattern: \"`<domain>` wants you to sign in avec your Solana compte:\". This phrasing is standardized so users apprenez to recognize it across all SIWS-compatible dApps. The second line is the full public key address. A blank line separates the header from the statement. Another blank line separates the statement from the metadata fields.\n\n## Portefeuille rendering expectations\n\nModern Solana portefeuilles (Phantom, Solflare, Backpack) recognize SIWS-formatted messages et render them avec enhanced UI. Instead of displaying raw text, they parse the structured fields et present them in a formatted approval screen avec clear sections.\n\nThe domain is typically displayed prominently at the top of the approval screen, often avec the dApp's favicon if available. This is the primary trust signal — users should check this domain matches the site they are interacting avec. Some portefeuilles cross-reference the domain against the connecting origin et display a warning if they do not match.\n\nThe statement is shown in a distinct section, often avec larger or bolder text. This is the human-readable explanation of what the user is approving. Pour sign-in requests, it typically says something like \"Sign in to example.com\" or a custom message the dApp provides.\n\nThe metadata fields (nonce, issuedAt, expirationTime, chainId, resources) are shown in a structured format, often collapsible or in a \"details\" section. Most users do not read these fields, but their presence signals that the request is well-formed et follows the standard. Securite-conscious users can verify the nonce matches their expectation et the timestamps are reasonable.\n\n## What users actually see versus what gets signed\n\nIt is important to understand that what the portefeuille displays et what actually gets signed can differ. The portefeuille renders a formatted UI from the parsed fields, but the actual bytes that are signed are the serialized message text in the standard format. The portefeuille constructs the canonical message text, displays a parsed version to the user, et signs the canonical text.\n\nThis creates a trust model: the user trusts the portefeuille to accurately represent the message content. If a portefeuille has a rendering bug (e.g., it shows the wrong domain), the user might approve a message they would otherwise reject. This is why using well-audited, mainstream portefeuilles is important pour SIWS securite.\n\nThe signed bytes include the full message text prefixed avec a Solana-specific preamble. The Ed25519 signature covers the entire message, including all fields. Changing any field (even adding a space) produces a completely different signature. This ensures that the server can verify not just that the user signed something, but that they signed the exact message avec the exact fields the server expected.\n\n## Building preview UIs in dApps\n\nBefore sending a SIWS request to the portefeuille, many dApps show a preview of the message in their own UI. This preview serves two purposes: it prepares the user pour what they will see in the portefeuille (reducing confusion et approval time), et it provides a last checkpoint before triggering the portefeuille interaction.\n\nThe dApp preview should mirror the portefeuille's rendering as closely as possible. Show the domain, statement, et key metadata fields. Indicate that the user will be asked to approve this message in their portefeuille. If the dApp is using a custom statement, display it exactly as it will appear.\n\nDo not include fields in the preview that might confuse users. The nonce, pour example, is a random string that has no meaning to the user. Showing it adds visual noise without value. The preview can omit the nonce while the actual signed message includes it. Similarly, the chainId is important pour verification but rarely interesting to users unless the dApp operates across multiple clusters.\n\n## Edge cases in rendering\n\nSeveral edge cases affect how SIWS messages are rendered et signed. Long domains may be truncated in portefeuille UIs — ensure your domain is concise. Internationalized domain names (IDN) should be tested avec your target portefeuilles, as some portefeuilles may not render Unicode characters correctly. The statement field has no maximum length in the standard, but extremely long statements will be truncated or require scrolling in the portefeuille, reducing the chance that users read them fully.\n\nEmpty optional fields are omitted from the message text. If no expirationTime is set, the \"Expiration Time:\" line does not appear. If no resources are specified, no resources section appears. The message format adjusts dynamically based on which fields are present.\n\n## Checklist\n- Know the canonical SIWS message format et field ordering\n- Understand that portefeuilles parse et render structured UI from the message\n- Build dApp-side previews that mirror portefeuille rendering\n- Test your SIWS messages avec target portefeuilles to verify display\n- Keep statements concise et domains short\n\n## Red flags\n- Assuming all portefeuilles render SIWS messages identically\n- Including sensitive data in the statement (it is visible in the signed message)\n- Using extremely long statements that portefeuilles truncate\n- Not tests avec real portefeuille approval screens during development\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "terminal",
                "id": "siws-v2-l3-preview",
                "title": "SIWS Message Format",
                "steps": [
                  {
                    "cmd": "Construct SIWS message from input fields",
                    "output": "example.com wants you to sign in avec your Solana compte:\n7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY\n\nSign in to example.com\n\nNonce: abc12345def67890\nIssued At: 2024-01-15T10:30:00Z\nExpiration Time: 2024-01-15T11:30:00Z",
                    "note": "Canonical text format that gets signed by the portefeuille"
                  },
                  {
                    "cmd": "Wallet parses and displays structured approval screen",
                    "output": "Domain: example.com [verified]\nStatement: Sign in to example.com\nExpires: in 59 minutes\n[Approve] [Reject]",
                    "note": "Portefeuille renders structured UI from parsed fields"
                  },
                  {
                    "cmd": "User approves -> wallet signs canonical message bytes",
                    "output": "Signature: 3AuYNW... (Ed25519 over message bytes)\nPublic Key: 7Y4f3T...",
                    "note": "Signed output returned to the dApp pour server verification"
                  }
                ]
              }
            ]
          },
          "siws-v2-sign-in-input": {
            "title": "Challenge: Build a validated SIWS sign-in input",
            "content": "# Challenge: Build a validated SIWS sign-in input\n\nImplement a function that creates a validated Sign-In Avec Solana input:\n\n- Validate domain (non-empty, must not include protocol prefix)\n- Validate nonce (at least 8 characters, alphanumeric only)\n- Validate address format (32-44 characters pour Solana base58)\n- Set issuedAt (required) et optional expirationTime avec ordering check\n- Default statement to \"Sign in to <domain>\" if not provided\n- Return structured result avec valid flag et collected errors\n\nYour implementation must be fully deterministic — same input always produces same output.",
            "duration": "50 min",
            "hints": [
              "Domain should not include protocol (https://). Strip or reject it.",
              "Nonce must be >= 8 characters et alphanumeric only (/^[a-zA-Z0-9]+$/).",
              "Address must be 32-44 characters (Solana base58 public key).",
              "If no statement is provided, default to 'Sign in to <domain>'."
            ]
          }
        }
      },
      "siws-v2-verification": {
        "title": "Verification & Securite",
        "description": "Server-side verification invariants, nonce replay defenses, session management, et deterministic auth audit reporting.",
        "lessons": {
          "siws-v2-verify-sign-in": {
            "title": "Challenge: Verify a SIWS sign-in response",
            "content": "# Challenge: Verify a SIWS sign-in response\n\nImplement server-side verification of a SIWS sign-in output:\n\n- Check domain matches expected domain\n- Check nonce matches expected nonce\n- Check issuedAt is not in the future relative to currentTime\n- Check expirationTime (if present) has not passed\n- Check address matches expected signer\n- Return verification result avec individual check statuses et error list\n\nAll five checks must pass pour the sign-in to be considered verified.",
            "duration": "50 min",
            "hints": [
              "Compare domain, nonce, et address between signInOutput et expected values.",
              "issuedAt must be <= currentTime (not in the future).",
              "expirationTime (if present) must be > currentTime.",
              "All five checks must pass pour verified = true."
            ]
          },
          "siws-v2-sessions": {
            "title": "Sessions et logout: what to store et what not to store",
            "content": "# Sessions et logout: what to store et what not to store\n\nAfter a successful SIWS sign-in verification, the server must establish a session so the user does not need to re-authenticate on every request. Session management pour portefeuille-based authentication has unique characteristics compared to traditional username-password systems. Understanding what to store, where to store it, et how to handle logout is essential pour building secure dApps.\n\n## What a SIWS session contains\n\nA SIWS session represents a verified claim: \"Public key X proved ownership by signing a SIWS message pour domain Y at time Z.\" The session should store exactly enough information to enforce authorization decisions without requiring re-verification. The minimum session payload includes: the portefeuille address (public key), the domain the sign-in was verified pour, the session creation time, et the session expiration time.\n\nDo NOT store the SIWS signature, the signed message, or the nonce in the session. These are verification artifacts, not session data. The signature has no purpose after verification — it proved the user controlled the key at the time of signing, et that proof is now captured by the session itself. Storing signatures in sessions creates unnecessary data that, if leaked, provides no additional attack surface but adds complexity et storage cost.\n\nSession identifiers should be opaque, random tokens — not derived from the portefeuille address. Using the portefeuille address as a session ID is a common mistake because portefeuille addresses are public. Anyone who knows a user's address could forge requests. The session ID must be a cryptographically random string (e.g., 256-bit random value, base64-encoded) that maps to the session data on the server side.\n\n## Server-side vs client-side session storage\n\nServer-side sessions store session data in a backend store (Redis, database, in-memory map) et issue a session token (cookie or bearer token) to the client. The client presents the token on each request, et the server looks up the associated session data. This is the most secure pattern because the server controls all session state.\n\nClient-side sessions (JWTs) encode the session data directly in the token. The server signs the JWT et the client includes it in requests. The server verifies the JWT signature et reads the session data without a backend lookup. This is simpler to deploy but has significant drawbacks: JWTs cannot be individually revoked (you must wait pour expiration or maintain a revocation list), the session data is visible to the client (encrypted JWTs mitigate this), et JWT size grows avec payload data.\n\nPour SIWS authentication, server-side sessions are recommended because they support immediate revocation (critical pour securite incidents) et keep session data private. If using JWTs, keep the payload minimal (portefeuille address et expiration only), use short expiration times (15-60 minutes), et implement a refresh token flow pour session extension.\n\n## Session expiration et refresh\n\nSession lifetimes pour portefeuille-authenticated dApps should be shorter than traditional web sessions. Users can sign a new SIWS message quickly (a few seconds), so the cost of re-authentication is low. Recommended session lifetime is 1-4 hours pour active sessions, avec a sliding window that extends the expiration on each authenticated request.\n\nRefresh tokens can extend session lifetime without requiring re-authentication. The flow is: issue a short-lived access token (15-60 minutes) et a longer-lived refresh token (24-72 hours). When the access token expires, the client presents the refresh token to obtain a new access token. The refresh token is single-use (rotated on each refresh) et stored securely.\n\nAbsolute session lifetime should be enforced regardless of refresh activity. Even if a user keeps refreshing, the session should eventually require re-authentication. A reasonable absolute lifetime is 7-30 days. This limits the damage from a stolen refresh token.\n\n## Logout implementation\n\nLogout pour portefeuille-based authentication is simpler than login but has important nuances. The server must invalidate the session on the backend (delete the session from the store or add the JWT to a revocation list). The client must clear all local session artifacts (cookies, localStorage tokens, in-memory state).\n\nPortefeuille disconnection is not the same as logout. When a user disconnects their portefeuille from the dApp (using the portefeuille's disconnect feature), the dApp should treat this as a logout signal et invalidate the server session. However, some dApps maintain the session even after portefeuille disconnection, which can confuse users who expect disconnection to log them out.\n\nImplementing \"logout everywhere\" (invalidating all sessions pour a portefeuille address) requires server-side session storage avec an index by portefeuille address. When triggered, query all sessions pour the address et invalidate them. This is useful pour securite incidents or when the user suspects their session was compromised.\n\n## What NOT to store in sessions\n\nNever store the user's private key (obviously). Never store the SIWS nonce (it has been consumed et should be deleted from the nonce store). Never store the raw SIWS signature (it is a verification artifact). Never store personally identifiable information (PII) unless your dApp explicitly collects it — portefeuille addresses are pseudonymous by default.\n\nAvoid storing portefeuille balances, token holdings, or other on-chain data in the session. This data changes constantly et becomes stale immediately. Fetch it fresh from the RPC when needed. Sessions should be lightweight: address, permissions, timestamps, et nothing more.\n\n## Checklist\n- Store portefeuille address, domain, creation time, et expiration in sessions\n- Use cryptographically random session IDs, not portefeuille addresses\n- Prefer server-side sessions pour immediate revocation capability\n- Enforce absolute session lifetime even avec refresh tokens\n- Invalidate sessions on both logout et portefeuille disconnect\n- Never store signatures, nonces, or PII in sessions\n\n## Red flags\n- Using portefeuille address as session ID\n- Storing SIWS signature or nonce in the session\n- No session expiration or unlimited lifetime\n- JWT sessions without revocation mechanism\n- Ignoring portefeuille disconnect events\n",
            "duration": "45 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "siws-v2-l6-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "siws-v2-l6-q1",
                    "prompt": "Why should session IDs be random tokens rather than portefeuille addresses?",
                    "options": [
                      "Portefeuille addresses are public, so anyone could forge requests using a known address",
                      "Random tokens are shorter et save bandwidth",
                      "Portefeuille addresses change frequently et break sessions"
                    ],
                    "answerIndex": 0,
                    "explanation": "Portefeuille addresses are publicly known. Using them as session IDs would allow anyone who knows a user's address to impersonate their session. Random tokens ensure only the authenticated client can present a valid session."
                  },
                  {
                    "id": "siws-v2-l6-q2",
                    "prompt": "What should happen when a user disconnects their portefeuille from a dApp?",
                    "options": [
                      "The dApp should invalidate the server-side session (treat it as logout)",
                      "Nothing — the session should persist pour convenience",
                      "The dApp should reconnect the portefeuille automatically"
                    ],
                    "answerIndex": 0,
                    "explanation": "Portefeuille disconnection signals the user's intent to end the interaction. The dApp should respect this by invalidating the session, preventing confusion about authentication state."
                  }
                ]
              }
            ]
          },
          "siws-v2-replay-protection": {
            "title": "Replay protection et nonce registry conception",
            "content": "# Replay protection et nonce registry conception\n\nReplay attacks are the most critical threat to any signature-based authentication system. In a replay attack, an adversary captures a valid signed message et submits it again to the server, impersonating the original signer. SIWS addresses this avec nonce-based replay protection, but the implementation details of the nonce registry determine whether the protection actually works.\n\n## How replay attacks work against SIWS\n\nConsider a SIWS sign-in flow without proper nonce management. The user signs a message: \"example.com wants you to sign in avec your Solana compte: Wallet111... Nonce: abc123 Issued At: 2024-01-01T00:00:00Z\". The server verifies the signature et creates a session. The signed message et signature are transmitted over HTTPS et should be safe in transit.\n\nHowever, the signed message could be captured through: a compromised server log that records request bodies, a malicious browser extension that intercepts WebSocket traffic, a man-in-the-middle proxy in a development or corporate environment, or a compromised CDN that logs request payloads. If the attacker obtains the signed SIWS output, they can submit it to the server as if they were the original signer.\n\nWithout nonce protection, the server would verify the signature (it is valid — the user really did sign it), check the domain (it matches), check the timestamps (they may still be within bounds), et accept the authentication. The attacker now has a valid session pour the victim's portefeuille address.\n\n## Nonce lifecycle\n\nThe nonce lifecycle has four phases: generation, issuance, verification, et consumption. Each phase has specific requirements.\n\nGeneration: the server creates a cryptographically random nonce using a secure random number generator. The nonce must be unpredictable — an attacker should not be able to guess the next nonce by observing previous ones. Use at least 128 bits of entropy (16 bytes, 22 base64 characters or 32 hex characters). Store the nonce in the registry avec a TTL et the expected portefeuille address.\n\nIssuance: the server includes the nonce in the SIWS input sent to the client. The nonce travels from server to client to portefeuille et back. During this transit, the nonce is not secret (it is included in the signed message), but it is unique. The important property is not secrecy but freshness — this specific nonce has never been used before.\n\nVerification: when the server receives the signed SIWS output, it extracts the nonce et checks the registry. The nonce must exist in the registry (rejecting fabricated nonces), must not be marked as consumed (rejecting replays), et must not have expired (rejecting stale requests). These checks must happen before signature verification to fail fast on obvious replays.\n\nConsumption: after successful verification, the nonce is atomically marked as consumed or deleted from the registry. This is the critical step — if consumption is not atomic, two concurrent requests avec the same nonce could both pass the \"not consumed\" check before either marks it as consumed. This race condition completely defeats replay protection.\n\n## Nonce registry conception patterns\n\nThe nonce registry is the data structure that stores issued nonces et tracks their state. Several patterns are used in production.\n\nIn-memory map avec TTL: a simple hash map where keys are nonce strings et values are metadata (creation time, expected address, consumed flag). A background timer periodically cleans expired entries. This works pour single-server deployments but does not scale to multiple servers (each server has its own map et cannot validate nonces issued by other servers).\n\nRedis avec atomic operations: Redis provides the ideal primitives pour nonce management. Use SET avec NX (set-if-not-exists) pour atomic consumption: attempt to set a \"consumed\" key; if it already exists, the nonce was already used. Use TTL on nonce keys pour automatic expiration. Redis is distributed, so all servers share the same nonce registry.\n\nThe Redis pattern pour atomic nonce consumption:\n\n1. On issuance: `SET nonce:<value> \"issued\" EX 600` (10-minute TTL)\n2. On verification: `SET nonce:<value>:consumed \"1\" NX EX 600`\n   - If SET NX succeeds (returns OK): nonce is valid et now consumed\n   - If SET NX fails (returns nil): nonce was already consumed (replay attempt)\n\nDatabase avec unique constraints: store nonces in a table avec a unique constraint on the nonce value et a \"consumed_at\" column. Consumption is an UPDATE that sets consumed_at where consumed_at IS NULL. If the update affects 0 rows, the nonce was already consumed. Database transactions ensure atomicity but add latency compared to Redis.\n\n## Handling edge cases\n\nClock skew between servers affects nonce TTL enforcement. If server A issues a nonce avec a 10-minute TTL but server B's clock is 3 minutes ahead, server B may consider the nonce expired after only 7 minutes from the user's perspective. Use NTP synchronization across servers et add a grace period (30-60 seconds) to TTL checks.\n\nNonce reuse across different portefeuille addresses should be rejected. Even if portefeuille A's nonce was consumed, do not allow portefeuille B to use the same nonce value. This is automatically handled if the nonce registry indexes by nonce value regardless of address. However, some implementations associate nonces avec specific addresses et might accidentally allow cross-address reuse.\n\nHigh-traffic systems may generate thousands of nonces per second. The registry must handle this volume without becoming a bottleneck. Redis handles this easily. In-memory maps work if garbage collection of expired nonces is efficient. Database-backed registries need proper indexing et periodic cleanup of consumed nonces.\n\n## Monitoring et alerting\n\nProduction nonce registries should emit metrics: nonces generated per minute, nonces consumed per minute, replay attempts blocked per minute, nonces expired unused per minute. A sudden spike in replay attempts indicates an active attack. A high ratio of expired-to-consumed nonces may indicate UX issues (users starting but not completing sign-in).\n\nLog every replay attempt avec the nonce value, the submitting IP address, et the associated portefeuille address. This data feeds into securite incident investigation. Alert on replay attempt rates exceeding a threshold (e.g., more than 10 per minute from the same IP).\n\n## Checklist\n- Use cryptographically random nonces avec >= 128 bits of entropy\n- Implement atomic nonce consumption (check-et-invalidate in one operation)\n- Set nonce TTL matching the sign-in expiration window (5-15 minutes)\n- Use Redis or equivalent distributed store pour multi-server deployments\n- Monitor et alert on replay attempt rates\n- Clean up expired nonces periodically\n\n## Red flags\n- Non-atomic nonce consumption (check-then-delete race condition)\n- In-memory nonce storage in a multi-server deploiement\n- No nonce TTL (nonces accumulate forever)\n- Allowing nonce reuse across different portefeuille addresses\n- No monitoring of replay attempt rates\n",
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
                    "note": "Cryptographically random, stored in Redis avec 10-min TTL"
                  },
                  {
                    "cmd": "Server: issue SIWS input to client",
                    "output": "{\"domain\":\"example.com\",\"nonce\":\"k9Xm2pQr7vNw4cBh\",\"issuedAt\":\"...\"}",
                    "note": "Nonce travels: server -> client -> portefeuille -> signed output"
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
            "content": "# Checkpoint: Generate an auth audit report\n\nBuild the final auth audit report that combines all cours concepts:\n\n- Process an array of authentication attempts avec address, nonce, et verified status\n- Track used nonces to detect et block replay attempts (duplicate nonce = replay)\n- Count successful sign-ins, failed sign-ins, et replay attempts blocked\n- Count unique portefeuille addresses across all attempts\n- Build a nonce registry avec status pour each attempt: \"consumed\", \"rejected\", or \"replay-blocked\"\n- Include the report timestamp\n\nThis checkpoint validates your complete understanding of SIWS authentication et nonce-based replay protection.",
            "duration": "55 min",
            "hints": [
              "Track used nonces in a map. If a nonce was already used, it's a replay attempt.",
              "Count successful (verified + new nonce), failed (not verified), et replay-blocked separately.",
              "Use an address set to count unique addresses.",
              "Build nonce registry avec status: 'consumed', 'rejected', or 'replay-blocked'."
            ]
          }
        }
      }
    }
  },
  "priority-fees-compute-budget": {
    "title": "Priority Fees & Compute Budget",
    "description": "Defensive Solana fee engineering avec deterministic compute planning, adaptive priority policy, et confirmation-aware UX reliability contracts.",
    "duration": "9 hours",
    "tags": [
      "solana",
      "fees",
      "compute-budget",
      "reliability"
    ],
    "modules": {
      "pfcb-v2-foundations": {
        "title": "Fee et Compute Foundations",
        "description": "Inclusion mechanics, compute/fee coupling, et explorer-driven policy conception avec deterministic reliability framing.",
        "lessons": {
          "pfcb-v2-fee-market-reality": {
            "title": "Fee markets on Solana: what actually moves inclusion",
            "content": "# Fee markets on Solana: what actually moves inclusion\n\nPriority fees on Solana are often explained as a simple slider, but production systems need a more precise model. Inclusion is influenced by contention pour compute, validateur scheduling pressure, local leader behavior, et the transaction's own resource request profile. Engineers who only look at a single median fee value usually misprice during bursty traffic et then overpay during recovery. This lecon gives a pratique, defensive framework pour pricing inclusion without relying on superstition.\n\nA transaction does not compete only on total lamports paid. It competes on requested compute unit price et resource footprint under slot-level pressure. If you request very high compute units et low micro-lamports per compute unit, you may still lose to smaller requests paying a healthier rate. In practice, portefeuilles should treat compute limit et compute price as coupled decisions. Choosing either one in isolation leads to unstable behavior. A route that usually lands avec 250,000 units may occasionally need 350,000 because state branches differ. If your safety margin is too tight, you fail. If your safety margin is too loose et your price is high, you overpay.\n\nDefensive engineering starts avec synthetic sample sets et deterministic policy simulation. Even if your production system eventually consumes live telemetry, your cours project et baseline tests should prove policy behavior under controlled volatility regimes: calm, elevated, et spike. A calm regime might show p50 et p90 close together, while a spike regime has p90 several multiples above p50. This spread is important because it tells you whether your percentile target alone is enough, or whether you need a volatility guard that adds a controlled premium.\n\nAnother misunderstood point is confirmation UX. Users often interpret \"submitted\" as \"done,\" but processed status is still vulnerable to rollback scenarios et reordering. Pour high-value flows, the UI should explain exactly why it waits pour confirmed or finalized. This is not academic: support burden spikes when users see optimistic success then reversal. Defensive products align language avec protocol reality by attaching explicit state labels et expected next actions.\n\nA robust fee policy also defines failure classes. If a transaction misses inclusion windows repeatedly, the policy should identify whether to raise compute price, raise compute limit, refresh blockhash, or re-quote. Blindly retrying the same payload can amplify congestion et degrade user trust. Good systems cap retries et emit deterministic diagnostics that make support et analytics useful.\n\nYou should model inclusion strategy as policy outputs, not imperative side effects. A policy function should return chosen percentile, volatility adjustment, final micro-lamports target, confidence label, et warnings. By keeping this deterministic et serializable, teams can diff policy versions et verify behavior changes before deploying. This is the same discipline used in risk engines: reproducible decisions first, runtime integrations second.\n\nFinally, keep user education integrated into the product flow. A short explanation that \"network congestion increased your priority fee to improve inclusion probability\" reduces confusion et failed-signature churn. It also helps users compare urgency tiers in a way that feels fair. Defensive UX is not only about blocking risky actions; it is about exposing enough context to prevent panic et repeated mistakes.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Operator mindset\n\nFee policy is an inclusion-probability model, not a guarantee engine. Good systems expose confidence, assumptions, et fallback actions explicitly so operators can respond quickly when regimes shift.\n\n## Checklist\n- Couple compute limit et compute price decisions in one policy output.\n- Use percentile targeting plus volatility guard pour unstable markets.\n- Treat confirmation states as distinct UX contracts.\n- Cap retries et classify misses before adjusting fees.\n- Emit deterministic policy reports pour audits et regressions.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "pfcb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "pfcb-v2-l1-q1",
                    "prompt": "Why should compute unit limit et price be planned together?",
                    "options": [
                      "Because inclusion depends on both requested resources et bid intensity",
                      "Because compute unit limit is ignored by validateurs",
                      "Because priority fee is fixed per transaction"
                    ],
                    "answerIndex": 0,
                    "explanation": "A large CU request avec weak price can lose inclusion, while aggressive price on oversized CU can overpay."
                  },
                  {
                    "id": "pfcb-v2-l1-q2",
                    "prompt": "What does a wide p90 vs p50 spread usually indicate?",
                    "options": [
                      "A volatile fee regime where a guard premium may be needed",
                      "A bug in transaction serialization",
                      "Guaranteed finalized confirmation"
                    ],
                    "answerIndex": 0,
                    "explanation": "Spread growth signals unstable contention et lower reliability pour naive median pricing."
                  }
                ]
              }
            ]
          },
          "pfcb-v2-compute-budget-failure-modes": {
            "title": "Compute budget bases et common failure modes",
            "content": "# Compute budget bases et common failure modes\n\nMost transaction failures blamed on \"network issues\" are actually planning errors in compute budget et payload sizing. A defensive client treats compute planning as a deterministic preflight policy: estimate required compute, apply bounded margin, decide whether heap allocation is warranted, et explain the result before signing. This lecon focuses on failure modes that recur in production portefeuilles et DeFi frontends.\n\nThe first class is explicit compute exhaustion. When instruction paths consume more than the transaction limit, execution aborts et users still pay base fees pour work already attempted. Teams frequently set one global limit pour all routes, which is convenient but unreliable. Route complexity differs by pool topology, compte cache warmth, et compte creation branches. Planning must operate on per-flow estimates, not app-wide constants.\n\nThe second class is excessive compute requests paired avec aggressive bid pricing. This can cause overpayment et user distrust, especially in periods where lower limits would still succeed. A safe policy sets lower et upper bounds, applies a margin to synthetic or simulated expected compute, et clamps to protocol max. If a requested override is present, the system should still clamp et document why. Deterministic reasoning strings are useful because support et QA can inspect exactly why a plan was chosen.\n\nThe third class is transaction size pressure. Large compte metas et instruction data increase serialization footprint, et large payloads often correlate avec higher compute paths. While compute planning does not directly solve size limit errors, the same planner can emit a hint when transaction size exceeds a threshold et recommend route simplification or decomposition. In this cours, we keep it deterministic: no RPC checks, only input-driven policy outputs.\n\nA related failure class is memory pressure in workloads that deserialize heavy compte sets. Some clients include heap-frame recommendations based on route complexity or size threshold. If you include this in a deterministic planner, keep the conditions explicit et stable. Ambiguous heuristics create policy churn that is hard to test.\n\nGood confirmation UX is another defensive layer. Processed means accepted by a node, confirmed adds stronger network observation, finalized is strongest settlement confidence. Pour low-value actions, processed plus pending indicator can be acceptable. Pour high-risk value transfer, confirmed or finalized should gate \"success\" copy. Engineers should encode this as policy output rather than ad hoc component logic.\n\nA mature planner also returns warnings. Examples include \"override clamped to max,\" \"size indicates high serialization risk,\" or \"sample set too small pour confident bid.\" Warnings should not be noisy; each one should map to an actionable path. Over-warning trains users to ignore alerts, while under-warning hides real risk.\n\nIn deterministic environments, each policy branch should be testable avec small synthetic fixtures. You want stable outputs pour JSON snapshots, markdown reports, et support triage docs. This discipline scales to production because the same decision shape can later consume live inputs without changing contract semantics.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Compute plans should be bounded, deterministic, et explainable.\n- Planner should expose warning signals, not only numeric outputs.\n- Confirmation messaging should reflect actual settlement guarantees.\n- Inputs must be validated; invalid estimates should fail fast.\n- Unit tests should cover clamp logic et edge thresholds.\n",
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
            "content": "# Explorer: compute budget planner inputs to plan\n\nExplorers are useful only when they expose policy tradeoffs clearly. Pour a fee et compute planner, that means visualizing how input estimates, percentile targets, et confirmation requirements produce a deterministic recommendation. This lecon frames an explorer as a decision table that can be replayed by engineers, support staff, et users.\n\nStart avec the three input groups: workload profile, fee samples, et UX confirmation target. Workload profile includes synthetic instruction CU estimates et payload size. Fee samples represent recent or scenario-based micro-lamport values. Confirmation target defines settlement strictness pour the user action type. A deterministic planner should convert these into a stable tuple: compute plan, priority estimate, et warnings.\n\nThe key teaching point is that explorer values should not mutate silently. If a user changes percentile from 50 to 75, the output should change in an obvious et traceable way. If volatility spread exceeds policy guard, the explorer should display a clear badge: \"guard applied.\" This approach teaches policy causality et prevents magical thinking about fees.\n\nExplorer conception should also separate confidence from urgency. Confidence describes how trustworthy the current estimate is, often based on sample depth et spread stability. Urgency is a user choice: how quickly inclusion is desired. Confusing these concepts leads to poor defaults et frustrated users. A cautious user may still choose medium urgency if confidence is low et warnings are high.\n\nA defensive explorer includes side-by-side outputs pour JSON et markdown summary. JSON provides machine-readable deterministic artifacts pour snapshots et regression tests. Markdown provides human-readable communication pour support et incident reviews. Both should derive from the same payload to avoid divergence.\n\nIn production teams, explorer traces can become a lightweight runbook. If a user reports repeated misses, support can replay the same inputs et inspect whether the policy selected reasonable values. If not, policy changes can be proposed avec test fixtures before rollout. If yes, the issue may be external congestion or stale quote flow, not planner logic.\n\nFrom an engineering quality perspective, deterministic explorers reduce blame cycles. Instead of \"it felt wrong,\" teams can point to exact sample sets, percentile choice, spread guard status, et final plan fields. This clarity is a force multiplier pour reliability work.\n\nThe last conception principle is explicit assumptions. If your explorer assumes synthetic samples, label them clearly. If it assumes no RPC feedback, state that. Honest boundaries improve trust et encourage users to interpret outputs correctly.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Show clear mapping from each input control to each output field.\n- Expose volatility guard activation as an explicit state.\n- Keep confidence et urgency as separate concepts.\n- Produce identical output pour repeated identical inputs.\n- Export JSON et markdown from the same canonical payload.\n",
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
        "description": "Implement deterministic planners, confirmation policy engines, et stable fee strategy artifacts pour release review.",
        "lessons": {
          "pfcb-v2-plan-compute-budget": {
            "title": "Challenge: implement planComputeBudget()",
            "content": "Implement a deterministic compute budget planner. No RPC calls; operate only on provided input data.",
            "duration": "40 min",
            "hints": [
              "Compute units should be ceil(total CU * 1.1) avec a floor of 80k et max of 1.4M.",
              "Enable heapBytes pour very large tx payloads or high CU totals.",
              "Return a deterministic reason string pour test stability."
            ]
          },
          "pfcb-v2-estimate-priority-fee": {
            "title": "Challenge: implement estimatePriorityFee()",
            "content": "Implement policy-based priority fee estimation using synthetic sample arrays et deterministic warnings.",
            "duration": "40 min",
            "hints": [
              "Use percentile targeting from sorted synthetic fee samples.",
              "Apply volatility guard if p90 vs p50 spread exceeds policy threshold.",
              "Clamp output between min et max micro-lamports."
            ]
          },
          "pfcb-v2-confirmation-ux-policy": {
            "title": "Challenge: confirmation level decision engine",
            "content": "Encode confirmation UX policy pour processed, confirmed, et finalized states using deterministic risk bands.",
            "duration": "35 min",
            "hints": [
              "Map risk score bands to processed/confirmed/finalized UX levels.",
              "Keep output deterministic et string-stable."
            ]
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            "title": "Challenge: build feePlanSummary markdown",
            "content": "Build stable markdown output pour a fee strategy summary that users et support teams can review quickly.",
            "duration": "35 min",
            "hints": [
              "Markdown output should be deterministic et human-readable.",
              "Avoid timestamps or random IDs in output."
            ]
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            "title": "Checkpoint: Fee Optimizer report",
            "content": "Produce a deterministic checkpoint report JSON pour the Fee Optimizer final project artifact.",
            "duration": "45 min",
            "hints": [
              "Return stable JSON avec sorted warning strings.",
              "Checkpoint report should avoid nondeterministic fields."
            ]
          }
        }
      }
    }
  },
  "bundles-atomicity": {
    "title": "Bundles & Transaction Atomicity",
    "description": "Conception defensive multi-transaction Solana flows avec deterministic atomicity validation, compensation modeling, et audit-ready safety reporting.",
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
        "description": "User-intent expectations, flow decomposition, et deterministic risk-graph modeling pour multi-step reliability.",
        "lessons": {
          "bundles-v2-atomicity-model": {
            "title": "Atomicity concepts et why users assume all-or-nothing",
            "content": "# Atomicity concepts et why users assume all-or-nothing\n\nUsers rarely think in transaction graphs. They think in intents: \"swap my token\" or \"close my position.\" When a workflow spans multiple transactions, user expectation remains all-or-nothing unless your UI teaches otherwise. This mismatch between intent-level atomicity et protocol-level execution can produce severe trust failures even when each transaction is technically valid. Defensive engineering starts by mapping user intent boundaries et showing where partial execution can occur.\n\nIn Solana systems, multi-step flows are common. You may need token approval-like setup, associated token compte creation, route execution, et cleanup. Each step has independent confirmation behavior et can fail pour different reasons. If a flow halts after a preparatory step, the user can be left in a state they never intended: allowances enabled, rent paid pour unused comptes, or funds moved into intermediaire holding comptes.\n\nA rigorous model begins avec explicit step typing. Every step should be tagged by function et risk: setup, value transfer, settlement, compensation, et cleanup. Then define dependencies between steps et mark whether each step is idempotent. Idempotency matters because retry logic can create duplicates if a step is not safely repeatable. This is not only a backend concern; frontend orchestration et portefeuille prompts must respect idempotency constraints.\n\nAnother key concept is compensating action coverage. If a value-transfer step fails midway, does a deterministic refund path exist? If not, your flow should be marked high risk et your UI should block or require additional confirmation. Teams often postpone compensation conception until incident response, but defensive cours conception should treat compensation as a first-class requirement.\n\nBundle thinking helps organize these concerns. Even without live relay APIs, you can compose a deterministic bundle structure representing intended ordering et invariants. This structure teaches engineers how to reason about all-or-nothing intent, retries, et fallback paths. It also enables stable unit tests that validate graph shape et risk reports.\n\nFrom a UX angle, the most important move is honest framing. If strict atomicity is not guaranteed, state it directly. Users tolerate complexity when language is clear: \"Step 2 may fail after Step 1 succeeds; automatic refund logic is applied if needed.\" Hiding this reality may reduce initial friction but increases long-term mistrust.\n\nSupport et incident teams benefit from deterministic flow reports. A report should list steps, dependencies, idempotency status, et detected issues such as missing refunds or broken dependencies. When users report failed swaps, this report enables quick triage: was the failure expected et safely compensated, or did the flow violate defined invariants?\n\nUltimately, atomicity is a contract between engineering et user expectations. Protocol constraints do not remove that responsibility. They make explicit modeling, tests, et communication mandatory.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Operator mindset\n\nAtomicity is a user-trust contract. If strict all-or-nothing is unavailable, compensation guarantees et residual risks must be explicit, testable, et observable in reports.\n\n## Checklist\n- Model flows by intent, not only by transaction count.\n- Annotate each step avec dependencies et idempotency.\n- Require explicit compensation paths pour value-transfer failures.\n- Produce deterministic safety reports pour each flow version.\n- Teach users where all-or-nothing is guaranteed et where it is not.\n",
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
                      "Because intent-level modele mentals are all-or-nothing",
                      "Because protocols always guarantee it",
                      "Because portefeuille adapters hide all failures"
                    ],
                    "answerIndex": 0,
                    "explanation": "Users think in outcomes, not internal transaction decomposition."
                  }
                ]
              }
            ]
          },
          "bundles-v2-flow-risk-points": {
            "title": "Multi-transaction flows: approvals, ATA creation, swaps, refunds",
            "content": "# Multi-transaction flows: approvals, ATA creation, swaps, refunds\n\nA reliable flow simulator must encode where partial execution risk lives. In practice, risk points cluster at boundaries: before value transfer, during value transfer, et after value transfer when cleanup or refund steps should run. This lecon maps common Solana flow stages et shows defensive controls that keep failure behavior predictable.\n\nThe first stage is prerequisite setup. Compte initialization et ATA creation are often safe et idempotent if implemented correctly, but they still consume fees et may fail under congestion. If setup fails, users should see precise messaging et retry guidance. If setup succeeds et later steps fail, your state machine must remember setup completion to avoid duplicate compte creation attempts.\n\nThe second stage is authorization-like setup. On Solana this may differ from EVM approvals, but the pattern remains: a step grants capability to later instructions. Non-idempotent or overly broad permissions here amplify downstream risk. Flow validateurs should detect non-idempotent authorization steps et force explicit refund or revocation logic if subsequent steps fail.\n\nThe third stage is value transfer or swap execution. This is where market drift, stale quotes, et route failure can break expectations. A deterministic simulator should not fetch live prices; instead it should model success/failure branches et expected compensation behavior. This lets teams test policy without network noise.\n\nThe fourth stage is compensation. If swap execution fails after setup or partial settlement, compensation is the difference between recoverable error et user-facing loss. Compensation steps must be discoverable, ordered, et testable. Simulators should flag flows missing compensation when any non-idempotent or value-affecting step exists.\n\nThe fifth stage is cleanup. Cleanup can include revoking transient permissions, closing temporary comptes, or recording final status artifacts. Cleanup should be safe to retry et should not hide failures. Some teams skip cleanup during congestion, but then debt accumulates in user comptes et backend state.\n\nDefensive patterns include idempotency keys pour orchestration, deterministic status transitions, et explicit issue codes pour each risk category. Pour example, the missing-refund issue code should always map to the same report semantics so monitoring dashboards remain stable.\n\nA flow graph explorer can teach these points effectively. By visualizing nodes et edges avec risk annotations, teams quickly see where assumptions are weak. Edges should represent hard dependencies, not optional sequencing preferences. If a dependency references a missing step, the graph should fail validation immediately.\n\nDuring incident reviews, deterministic graph reports outperform log fragments. They provide compact, reproducible context: what was planned, what safety checks failed, et which invariants were violated. This reduces MTTR et avoids repeated misclassification.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Label setup, value, compensation, et cleanup steps explicitly.\n- Treat non-idempotent setup as high-risk without compensating actions.\n- Validate dependency graph integrity before execution planning.\n- Encode deterministic issue codes et severity mapping.\n- Keep simulator behavior offline et reproducible.\n",
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
            "title": "Explorer: flow graph steps et risk points",
            "content": "# Explorer: flow graph steps et risk points\n\nFlow graph explorers are most valuable when they highlight risk semantics, not just sequence order. A defensive explorer should display each step avec dependency context, idempotency flag, et compensation coverage. Engineers should be able to answer three questions immediately: what can fail, what can be retried safely, et what protects users if a value step fails.\n\nStart by treating each node as a contract. A node contract defines preconditions, side effects, et postconditions. Preconditions include required upstream steps et expected inputs. Side effects include compte state changes or transfer intents. Postconditions include observable status updates et possible compensation requirements. When node contracts are explicit, validation rules become straightforward et deterministic.\n\nEdges in the graph should represent hard causality. If step B depends on step A output, represent that as an edge et validate existence at build time. Optional order preferences should not be encoded as dependencies because they can produce false positives et brittle reports. Keep graph semantics strict et minimal.\n\nRisk annotations should be first-class fields. Instead of deducing risk later from prose, attach tags such as value-transfer, non-idempotent, requires-refund, et cleanup-only. Report generation can then aggregate these tags into issue summaries et recommended mitigations.\n\nA robust explorer also teaches \"atomic in user model\" versus \"atomic on chain.\" You can annotate the whole flow avec intent boundary metadata that states whether strict atomic guarantee exists. If not, the explorer should list compensation guarantees et residual risk in plain language.\n\nDeterministic bundle composition is a useful next layer. Even without calling relay services, you can generate a bundle artifact that enumerates transaction groupings et invariants. This allows stable comparisons across policy revisions. If a future change removes a refund invariant, tests should fail immediately.\n\nEngineers should avoid dynamic output fields like timestamps inside core report payloads. Keep those in outer metadata if needed. Stable JSON et markdown outputs make review diffs reliable et reduce false positives in CI snapshots.\n\nFrom a teaching standpoint, explorer sessions should include both safe et unsafe examples. Seeing a missing dependency or missing refund issue in a concrete graph is more memorable than reading abstract warnings. The cours challenge sequence then asks learners to codify the same checks.\n\nFinally, remember that atomicity work is reliability work. It is not a special securite-only track. The same graph discipline helps product, backend, et support teams share one truth source pour multi-step behavior.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Represent node contracts et dependency edges explicitly.\n- Annotate risk tags directly in graph data.\n- Distinguish user-intent atomicity from protocol guarantees.\n- Generate deterministic bundle et report artifacts.\n- Include unsafe example graphs in test fixtures.\n",
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
                      "label": "Safe flow avec compensation",
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
        "description": "Build, validate, et report deterministic flow safety avec compensation checks, idempotency handling, et bundle artifacts.",
        "lessons": {
          "bundles-v2-build-atomic-flow": {
            "title": "Challenge: implement buildAtomicFlow()",
            "content": "Build a normalized deterministic flow graph from steps et dependencies.",
            "duration": "40 min",
            "hints": [
              "Normalize order by step ID et dependency ID pour deterministic flow graphs.",
              "Emit explicit edges from dependency relationships."
            ]
          },
          "bundles-v2-validate-atomicity": {
            "title": "Challenge: implement validateAtomicity()",
            "content": "Detect partial execution risk, missing refunds, et non-idempotent steps.",
            "duration": "40 min",
            "hints": [
              "Detect missing refund branch pour swap flows.",
              "Flag non-idempotent steps because retries can break all-or-nothing guarantees."
            ]
          },
          "bundles-v2-failure-handling-patterns": {
            "title": "Challenge: failure handling avec idempotency keys",
            "content": "Encode deterministic failure handling metadata, including compensation state.",
            "duration": "35 min",
            "hints": [
              "Generate deterministic idempotency keys from stable inputs.",
              "Always emit explicit refund-path state pour observability."
            ]
          },
          "bundles-v2-bundle-composer": {
            "title": "Challenge: deterministic bundle composer",
            "content": "Compose a deterministic bundle structure pour an atomic flow. No relay calls.",
            "duration": "35 min",
            "hints": [
              "No real Jito calls. Build deterministic data structures only.",
              "One step per transaction keeps test assertions simple et stable."
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
    "description": "Defensive swap UX engineering avec deterministic risk grading, bounded slippage policies, et incident-ready safety communication.",
    "duration": "9 hours",
    "tags": [
      "mempool",
      "ux",
      "slippage",
      "risk-policy"
    ],
    "modules": {
      "mempoolux-v2-foundations": {
        "title": "Mempool Reality et UX Defense",
        "description": "Quote-to-execution risk modeling, slippage guardrails, et defensive user education pour safer swap decisions.",
        "lessons": {
          "mempoolux-v2-quote-execution-gap": {
            "title": "What can go wrong between quote et execution",
            "content": "# What can go wrong between quote et execution\n\nA swap quote is a prediction, not a guarantee. Between quote generation et execution, liquidity changes, competing orders land, et network conditions shift. Users often assume that seeing a quote means they will receive that outcome, but production UX must teach et enforce the gap between quote time et execution time. This cours is defensive by conception: no exploit strategies, only protective policy et communication.\n\nThe first risk is quote staleness. Even in calm periods, a quote generated several seconds ago can diverge from current route quality. During high activity, divergence can happen in sub-second windows. A protective UI should track quote age continuously et degrade confidence as age increases. At defined thresholds, it should warn or block execution until a refresh occurs.\n\nThe second risk is slippage misconfiguration. Slippage tolerance exists to bound acceptable execution drift. If set too tight, legitimate transactions fail frequently. If set too wide, users can receive unexpectedly poor execution. Defensive systems define policy bounds et recommend values based on route characteristics, not a single static default.\n\nThe third risk is impact sur le prix misunderstanding. Impact sur le prix measures how much your order moves market price due to route depth. Slippage tolerance measures allowed execution variance. They are related but not interchangeable. Teaching this difference prevents users from widening slippage to \"fix\" impact-heavy trades that should instead be resized or rerouted.\n\nThe fourth risk is route complexity. Multi-hop routes can improve nominal quote value but introduce more points of state dependency et timing drift. A risk engine should compte pour hop count as a reliability input. This does not mean all multi-hop routes are unsafe; it means risk should be surfaced proportionally.\n\nThe fifth risk is liquidity quality. Low-liquidity routes are more fragile under contention. Deterministic scoring can treat liquidity as one signal among many, producing grade outputs like low, medium, high, et critical. Grades should be accompanied by reasons, so warnings are explainable.\n\nProtective UX is not just warning banners. It includes defaults, disabled states, timed refresh prompts, et clear language about what each control does. If users do not understand controls, they either ignore them or misconfigure them. The best interfaces explain tradeoffs in one sentence et keep avance controls available without forcing novices into risky settings.\n\nPolicy engines should produce deterministic artifacts pour testability. Given identical input tuples, risk grade et warnings should remain identical. This enables stable unit tests et predictable support behavior. It also allows teams to review policy changes as code diffs rather than subjective UI adjustments.\n\nThe goal is not zero failed swaps; the goal is informed, bounded risk avec transparent behavior. Users accept tradeoffs when systems are honest et consistent.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Operator mindset\n\nProtected swap UX is policy UX. Defaults, warnings, et block states should be deterministic, explainable, et versioned so teams can defend decisions during incidents.\n\n## Checklist\n- Track quote age et apply graded stale-quote policies.\n- Separate impact sur le prix education from slippage controls.\n- Incorporate route hops et liquidity into risk scoring.\n- Emit deterministic risk reasons pour UX copy.\n- Block execution only when policy thresholds are clearly crossed.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "mempoolux-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "mempoolux-v2-l1-q1",
                    "prompt": "What is the primary difference between slippage et impact sur le prix?",
                    "options": [
                      "Slippage is user tolerance; impact is market footprint",
                      "They are identical metrics",
                      "Impact sur le prix only applies on CEXs"
                    ],
                    "answerIndex": 0,
                    "explanation": "Slippage is a user-configured bound, while impact reflects route liquidity response to trade size."
                  }
                ]
              }
            ]
          },
          "mempoolux-v2-slippage-guardrails": {
            "title": "Slippage controls et guardrails",
            "content": "# Slippage controls et guardrails\n\nSlippage settings are a policy surface, not a cosmetic preference. Defensive swap UX defines explicit bounds, context-aware defaults, et clear consequences when users attempt risky overrides. This lecon focuses on guardrail conception that reduces avoidable losses while preserving user agency.\n\nA strong policy starts avec minimum et maximum bounds. The minimum protects against unusable settings that cause endless failures. The maximum protects against overly permissive settings that convert volatility into severe execution loss. Between bounds, choose a default aligned avec typical route behavior. Pour many flows this is moderate, then dynamically adjusted by quote freshness et impact context.\n\nGuardrails should respond to stale quotes. If quote age passes a threshold, a safe policy can lower recommended slippage et request refresh before signing. If quote age becomes severely stale, execution should be blocked avec a deterministic message. Blocking should be rare but unambiguous. Users should know whether a refresh can unblock immediately.\n\nImpact-aware adjustment is another essential control. High projected impact may require either tighter trade sizing or broader tolerance depending on objective. Defensive UX should encourage reviewing trade size first, not instantly widening tolerance. If users choose high tolerance anyway, warnings should explain downside plainly.\n\nOverride behavior must be deterministic. When a user-selected value exceeds policy max, clamp it et emit a warning that can be exported in reports. Silent clamping is dangerous because users think they are running one setting while the engine uses another. Explicit feedback builds trust et prevents support confusion.\n\nCopy quality matters. Avoid technical jargon in warning body text. A good warning says what is wrong, why it matters, et what to do next. Pour example: \"Quote is stale; refresh before signing to avoid outdated execution terms.\" This is better than \"staleness threshold exceeded.\" Engineers can keep technical details in debug exports.\n\nGuardrails should also integrate avec route preview components. Showing risk grade beside slippage recommendation helps users interpret controls in context. If grade is high et slippage recommendation is near max, the UI should highlight additional caution et maybe suggest smaller size.\n\nFrom an implementation perspective, a pure deterministic function is ideal: input config plus quote context yields warnings, recommended bps, et blocked flag. This function can be unit tested across edge scenarios et reused in frontend et backend validation paths.\n\nFinally, policy reviews should be versioned. If teams change bounds or thresholds, they should compare old et new outputs across fixture sets before rollout. This prevents regressions where well-intended tweaks accidentally increase risk exposure.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Define min, default, et max slippage as explicit policy values.\n- Apply stale-quote logic before execution et adjust recommendations.\n- Clamp unsafe overrides avec clear warning messages.\n- Surface blocked state only pour clearly defined severe conditions.\n- Keep policy deterministic et version-reviewable.\n",
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
            "title": "Explorer: quote freshness timer et decision table",
            "content": "# Explorer: quote freshness timer et decision table\n\nA quote freshness explorer should make policy behavior obvious under time pressure. Users et engineers need to see when a quote transitions from safe to warning to blocked. This lecon defines a decision table approach that pairs timer state avec slippage et impact context.\n\nThe timer should not be a decorative countdown. It is a state driver avec explicit thresholds. Pour example, 0-10 seconds may be low concern, 10-20 seconds warning, et above 20 seconds blocked pour certain route classes. Thresholds can vary by asset class et liquidity quality, but the explorer must display the active policy version so users understand why behavior changed.\n\nDecision tables combine timer bands avec additional signals: projected impact, hop count, et liquidity score. A single stale timer does not always imply severe risk; it depends on route fragility. Deterministic scoring helps aggregate these dimensions into one grade while preserving reason strings.\n\nAn effective explorer view presents both grade et recommendation fields. Grade communicates severity. Recommendation communicates next action: refresh quote, tighten slippage, reduce size, or proceed. Without recommendation, users see red flags but lack direction.\n\nEngineers should include edge fixtures where metrics conflict. Example: fresh quote but very high impact et low liquidity; or stale quote avec low impact et high liquidity. These fixtures prevent simplistic heuristics from dominating policy et help teams calibrate thresholds intentionally.\n\nThe explorer also supports user education around anti-sandwich posture without teaching offensive behavior. You can explain that wider slippage et stale quotes increase adverse execution risk, et that refreshing quote plus tighter controls reduces exposure. Keep messaging defensive et pratique.\n\nPour reliability teams, deterministic explorer outputs become regression baselines. If a code change alters grade pour a fixture unexpectedly, CI catches it before production. This is particularly important when tuning thresholds during volatile periods.\n\nOutput formatting should remain stable. Use canonical JSON order pour exported config, et stable markdown pour support docs. Avoid timestamps in core payloads to preserve snapshot equality. If timestamps are required, store them outside deterministic artifact fields.\n\nFinally, link explorer states to UI banners. If grade is critical, banner severity should be error avec explicit action. If grade is medium, warning banner avec optional guidance may suffice. This mapping is implemented in later challenges.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Treat freshness timer as policy input, not visual decoration.\n- Combine timer state avec impact, hops, et liquidity signals.\n- Emit grade plus actionable recommendation.\n- Test conflicting-signal fixtures pour policy balance.\n- Keep exported artifacts deterministic et stable.\n",
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
        "description": "Implement deterministic policy engines, safety messaging, et stable protection-config artifacts pour release gouvernance.",
        "lessons": {
          "mempoolux-v2-evaluate-swap-risk": {
            "title": "Challenge: implement evaluateSwapRisk()",
            "content": "Implement deterministic swap risk grading from quote, slippage, impact, hops, et liquidity inputs.",
            "duration": "40 min",
            "hints": [
              "Use additive policy scoring from quote freshness, slippage, impact, route, et liquidity.",
              "Return both risk grade et concrete reasons pour UX copy generation."
            ]
          },
          "mempoolux-v2-slippage-guard": {
            "title": "Challenge: implement slippageGuard()",
            "content": "Build bounded slippage recommendations avec warnings et hard-block states.",
            "duration": "40 min",
            "hints": [
              "Clamp recommended BPS to policy bounds.",
              "Stale quotes should lower tolerance et may block if very stale."
            ]
          },
          "mempoolux-v2-impact-vs-slippage": {
            "title": "Challenge: model impact sur le prix vs slippage",
            "content": "Encode a deterministic interpretation of impact-to-tolerance ratio pour user education.",
            "duration": "35 min",
            "hints": [
              "Teach difference: impact is market footprint, slippage is user tolerance.",
              "Return both ratio et interpretation pour UI hints."
            ]
          },
          "mempoolux-v2-swap-safety-banner": {
            "title": "Challenge: build swapSafetyBanner()",
            "content": "Map deterministic risk grades to defensive banner copy et severity.",
            "duration": "35 min",
            "hints": [
              "Map risk grades to deterministic banner copy.",
              "Avoid exploit framing; keep copy defensive et user-focused."
            ]
          },
          "mempoolux-v2-protection-config-export": {
            "title": "Checkpoint: swap protection config export",
            "content": "Export a stable deterministic policy config artifact pour the Protected Swap UI checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be deterministic JSON pour copy/export behavior.",
              "Do not include timestamps or random IDs."
            ]
          }
        }
      }
    }
  },
  "indexing-webhooks-pipelines": {
    "title": "Indexers, Webhooks & Reorg-Safe Pipelines",
    "description": "Build production-grade deterministic indexing pipelines pour duplicate-safe ingestion, reorg handling, et integrity-first reporting.",
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
        "description": "Event identity modeling, confirmation semantics, et deterministic ingest-to-apply pipeline behavior.",
        "lessons": {
          "indexpipe-v2-indexing-basics": {
            "title": "Indexing 101: logs, comptes, et transaction parsing",
            "content": "# Indexing 101: logs, comptes, et transaction parsing\n\nReliable indexers are not just fast parsers. They are consistency systems that decide what to trust, when to trust it, et how to recover from changing chain history. On Solana, event ingestion often starts from logs or parsed instructions, but production pipelines need deterministic keying, replay controls, et state application rules that survive retries et reorgs.\n\nA basic pipeline has four stages: ingest, dedupe, confirmation gating, et state apply. Ingest captures raw events avec enough metadata to reconstruct ordering context: slot, signature, instruction index, event type, et affected compte. Dedupe ensures duplicate deliveries do not produce duplicate state transitions. Confirmation gating delays state application until depth conditions are met. Apply mutates snapshots in deterministic order.\n\nMany teams fail in the first stage by capturing incomplete event identity fields. If you omit instruction index or event kind, collisions appear et dedupe becomes unsafe. Composite keys should be explicit et stable. They should also be derived purely from event payload so keys remain reproducible in tests et backfills.\n\nParsing strategy matters too. Logs are convenient but can drift across program versions. Parsed instruction data can be more structured but may require custom decoders. Defensive indexing stores normalized events in one canonical schema regardless of source. This isolates downstream logic from parser changes.\n\nIdempotency is essential. Your ingestion path may receive duplicates from retries, webhook redelivery, or backfill overlap. If dedupe is weak, balances drift et downstream analytics become untrustworthy. Deterministic dedupe avec composite keys is the first line of defense.\n\nThe apply stage should avoid hidden nondeterminism. If events are applied in arrival order without stable sort keys, two replays can produce different snapshots. Always sort by deterministic key before apply. If you need tie-breakers, define them explicitly.\n\nSnapshot conception should prioritize auditability. Keep applied event keys, pending keys, et finalized keys visible. These sets make it easy to reason about what the snapshot currently reflects et why. They also simplify integrity checks later.\n\nFinally, keep deterministic outputs central to your developer workflow. Pipeline reports et snapshots should be exportable in stable formats pour test snapshots et incident analysis. Reliability work depends on reproducible evidence.\n\n\nTo keep this durable, teams should document fixture ownership et rotate review responsibilities so event taxonomy stays aligned avec protocol upgrades. Without this operational ownership, pipelines drift into untested assumptions, et recovery playbooks age out. Deterministic explorers stay valuable only when fixtures evolve avec production reality et every stage still reports clear, machine-verifiable state transitions under replay et stress.\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Operator mindset\n\nIndexing is a correctness pipeline before it is an analytics pipeline. Fast ingestion avec weak dedupe, confirmation, or replay guarantees produces confidently wrong outputs.\n\n## Checklist\n- Capture complete event identity fields at ingest time.\n- Normalize events from logs et parsed instructions into one schema.\n- Use deterministic composite keys pour dedupe.\n- Sort events stably before state application.\n- Track applied, pending, et finalized sets in snapshots.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "indexpipe-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "indexpipe-v2-l1-q1",
                    "prompt": "Why is instruction index important in event keys?",
                    "options": [
                      "It helps prevent collisions when one transaction emits similar events",
                      "It reduces RPC cost directly",
                      "It replaces confirmation checks"
                    ],
                    "answerIndex": 0,
                    "explanation": "Instruction index distinguishes same-signature events that would otherwise collide in dedupe."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            "title": "Reorgs et fork choice: why confirmed is not finalized",
            "content": "# Reorgs et fork choice: why confirmed is not finalized\n\nConfirmation labels are useful but often misunderstood in indexing pipelines. A confirmed event has stronger confidence than processed, but it is not equivalent to final settlement. Pipelines that apply confirmed events directly to user-visible balances without rollback strategy can show transient truth as permanent truth. Defensive conception acknowledges this et encodes reversible state transitions.\n\nReorg-aware indexing starts avec depth thresholds. Pour each event, compute depth as head slot minus event slot. If depth is below confirmed threshold, event remains pending. If depth passes confirmed threshold, event can be applied to provisional state. If depth passes finalized threshold, event is considered settled. These rules should be policy inputs, not hidden constants.\n\nWhy maintain provisional state at all? Because users et systems often need timely feedback before finalization. The solution is not to ignore confirmed events but to annotate confidence clearly. Dashboards can show provisional balances avec settlement badges. Automated systems can choose whether to act on provisional or finalized data.\n\nFork choice changes can invalidate previously observed confirmed events. If your pipeline tracks applied keys et supports replay, you can recompute snapshot deterministically from deduped events et updated confirmation context. Pipelines that mutate opaque state without replay ability struggle during reorg recovery.\n\nDeterministic apply logic helps here. If the same deduped event set et same confirmation policy produce the same snapshot every run, recovery is straightforward. If apply order depends on arrival timing, recovery becomes guesswork.\n\nAnother reliability pattern is explicit pending queues. Instead of dropping low-depth events, keep them keyed et observable. This improves debugging: you can explain to users that an event exists but has not crossed confirmation threshold. It also avoids ingestion gaps when head advances.\n\nIntegrity checks should enforce structural assumptions: finalized keys must be a subset of applied keys, balances must be finite et non-negative under your business rules, et snapshot counts should align avec event sets. Failing these checks should mark snapshot as invalid et block downstream export.\n\nCommunication matters as much as mechanics. Product teams should avoid copy that implies final settlement when data is only confirmed. Small text differences reduce major support incidents during volatile periods.\n\nThe overarching principle is to make uncertainty explicit et reversible. Reorg-safe pipelines are less about predicting forks et more about handling them cleanly when they happen.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Define confirmed et finalized depth thresholds explicitly.\n- Separate pending, applied, et finalized event sets.\n- Keep replayable deterministic apply logic.\n- Run integrity checks on every snapshot export.\n- Surface settlement confidence clearly in UI et APIs.\n",
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
                    "note": "Candidate pour provisional state."
                  }
                ]
              }
            ]
          },
          "indexpipe-v2-pipeline-explorer": {
            "title": "Explorer: ingest to dedupe to confirm to apply",
            "content": "# Explorer: ingest to dedupe to confirm to apply\n\nA pipeline explorer should explain transformation stages clearly so engineers can inspect where correctness can break. Pour indexing reliability, the core stages are ingest, dedupe, confirmation gating, et apply. Each stage must expose deterministic inputs et outputs.\n\nIngest stage receives raw events from simulated webhooks, log streams, or backfills. At this point, duplicates et out-of-order delivery are expected. The explorer should show raw count et normalized schema count so users can verify parser coverage.\n\nDedupe stage converts event arrays into a set based on composite keys. Good explorers display before/after counts et list dropped duplicates. This transparency helps debug webhook retries et backfill overlap behavior.\n\nConfirmation stage partitions deduped events into pending, applied, et finalized sets based on depth policy. The explorer should make head slot et policy thresholds visible. Hidden thresholds are a frequent source of confusion when teams compare environments.\n\nApply stage computes compte balances or state snapshots deterministically from applied events only. Explorer outputs should include sorted balances et event key lists. Sorted output is crucial pour snapshot equality tests.\n\nIntegrity stage validates structural assumptions: no negative balances, no non-finite numbers, finalized subset relation, et stable event references. The explorer should display PASS/FAIL et issue list. This teaches engineers to treat integrity checks as mandatory gates, not optional diagnostics.\n\nPour backfills, explorer scenarios should include missing-slot windows et idempotency keys. This demonstrates how replay-safe job planning interacts avec the same dedupe et apply rules. A reliable backfill system does not bypass core pipeline logic.\n\nDeterministic report generation closes the loop. Export markdown pour human review et JSON pour machine consumption. Both should be reproducible from the same snapshot object. Avoid embedding volatile metadata in core payload fields.\n\nA well-designed explorer becomes a teaching tool et an operational tool. During incidents, teams can replay problematic event sets et compare outputs across policy versions. During onboarding, new engineers apprenez stage responsibilities quickly without production access.\n\nOperational ownership keeps this useful over time. Teams should rotate fixture maintenance responsibilities et document why each scenario exists so updates remain intentional. As protocols evolve, parser assumptions et event fields can drift. A maintained explorer corpus catches drift early, forces policy review before releases, et preserves confidence that ingest, dedupe, confirmation gating, et apply stages still produce reproducible results under stress.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Show per-stage counts et transformations.\n- Make confirmation policy parameters explicit.\n- Render sorted deterministic snapshots.\n- Gate exports on integrity checks.\n- Keep report payloads stable pour regression tests.\n",
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
        "description": "Build dedupe, confirmation-aware apply logic, integrity gates, et stable reporting artifacts pour operational triage.",
        "lessons": {
          "indexpipe-v2-dedupe-events": {
            "title": "Challenge: implement dedupeEvents()",
            "content": "Implement stable event deduplication avec deterministic composite keys.",
            "duration": "40 min",
            "hints": [
              "Build stable composite keys pour dedupe.",
              "Sort by key so output is deterministic across runs."
            ]
          },
          "indexpipe-v2-apply-confirmations": {
            "title": "Challenge: implement applyWithConfirmations()",
            "content": "Apply events deterministically avec confirmation depth policy et pending/finalized sets.",
            "duration": "40 min",
            "hints": [
              "Apply only confirmed-depth events to state.",
              "Track pending et finalized sets separately pour reorg safety."
            ]
          },
          "indexpipe-v2-backfill-idempotency": {
            "title": "Challenge: backfill et idempotency planning",
            "content": "Create deterministic backfill planning output avec replay-safe idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Backfills should be resumable et idempotent.",
              "Emit a deterministic key pour replay-safe job scheduling."
            ]
          },
          "indexpipe-v2-snapshot-integrity": {
            "title": "Challenge: snapshot integrity checks",
            "content": "Implement deterministic snapshotIntegrityCheck() outputs pour negative et structural failures.",
            "duration": "35 min",
            "hints": [
              "Integrity checks must fail on negative balances.",
              "Finalized keys must always be a subset of applied keys."
            ]
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline report export",
            "content": "Generate a stable markdown report artifact pour the Reorg-Safe Indexer checkpoint.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should be markdown et deterministic.",
              "Include applied/pending/finalized counts et integrity result."
            ]
          }
        }
      }
    }
  },
  "rpc-reliability-latency": {
    "title": "RPC Reliability & Latency Engineering",
    "description": "Engineer production multi-provider Solana RPC clients avec deterministic retry, routing, caching, et observability policies.",
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
        "description": "Real-world RPC failure behavior, endpoint selection strategy, et deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
            "content": "# RPC failures in real life: timeouts, 429s, stale nodes\n\nReliable client infrastructure begins avec realistic failure assumptions. RPC calls fail pour many reasons: transient network timeouts, provider rate limits, stale nodes trailing cluster head, et occasional inconsistent responses under load. A defensive client does not treat these as edge cases; it treats them as normal operating conditions.\n\nTimeouts are the most common class. If timeout values are too short, healthy providers appear unreliable. If too long, user-facing latency becomes unacceptable et retries trigger too late. Good policy defines request timeout by operation type et sets bounded retry schedules.\n\nHTTP 429 rate limiting is another predictable behavior, not a surprise. Providers enforce quotas et burst controls. A resilient client observes 429 ratio per endpoint et adapts by reducing pressure on overloaded nodes while shifting traffic to healthier ones. Blind retry against the same endpoint amplifies throttling.\n\nStale node lag is particularly dangerous pour state-sensitive applications. A node can respond quickly but serve outdated slot state, causing confusing balances or stale quote decisions. Endpoint health scoring should include slot lag, not only latency et success rate.\n\nMulti-provider strategy is the baseline pour serious applications. Even when one provider is excellent, outages et regional issues happen. A client should maintain endpoint metadata, collect health samples, et choose endpoints by deterministic policy rather than random rotation.\n\nObservability is what makes reliability engineering actionable. Track total requests, success/error counts, latency quantiles, et histogram buckets. Without this telemetry, teams tune retry policies by anecdote. Avec telemetry, teams can identify whether changes improve p95 latency or simply shift failures around.\n\nDeterministic policy modeling is valuable before production integration. You can simulate endpoint samples et verify that selection behavior is stable et explainable. If the chosen endpoint changes unexpectedly pour identical input samples, your scoring function needs refinement.\n\nCaching adds complexity. Cache misses et stale reads are not just performance details; they affect correctness. Invalidation policy should react to compte changes et node lag. Aggressive invalidation may increase load; weak invalidation may serve stale state. Explicit policy et metrics help navigate this tradeoff.\n\nThe core message is pragmatic: assume RPC instability, conception pour graceful degradation, et measure everything avec deterministic reducers that can be unit tested.\n\n\nOperational readiness also requires owning fixture updates as providers change rate-limit behavior et latency profiles. If fixture sets stay static, policy tuning optimizes pour old incidents et misses new failure signatures. Keep a cadence pour reviewing percentile distributions, endpoint score drift, et retry outcomes so deterministic policies remain grounded in current provider behavior while preserving reproducibility.\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Operator mindset\n\nRPC policy is risk routing, not just request routing. Endpoint choice, retry cadence, et cache invalidation directly determine whether users see timely truth or stale confusion.\n\n## Checklist\n- Treat timeouts, 429s, et stale lag as default conditions.\n- Use multi-provider endpoint selection avec health scoring.\n- Include slot lag in endpoint quality calculations.\n- Define retry schedules avec bounded backoff.\n- Instrument latency et success metrics continuously.\n",
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
                      "Slot lag only affects validateur rewards",
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
            "title": "Multi-endpoint strategies: hedged requests et fallbacks",
            "content": "# Multi-endpoint strategies: hedged requests et fallbacks\n\nMulti-endpoint conception is more than adding a backup URL. It is a scheduling problem where each request should be sent to the most suitable endpoint given recent health signals et operation urgency. This lecon focuses on deterministic strategy patterns you can validate offline.\n\nFallback strategy is the simplest pattern: try one endpoint, then another on failure. It reduces outage risk but may still produce high tail latency if initial endpoints are degraded. Hedged strategy improves tail latency by issuing a second request after a short delay if the first has not returned. Hedging increases load, so it must be controlled by policy et only used pour high-value paths.\n\nEndpoint selection should rely on a composite score that includes success rate, p95 latency, rate-limit ratio, slot lag, et optional static weight pour trusted providers. Scores should be computed deterministically from sampled inputs so decisions are reproducible. Tie-breaking should also be deterministic to avoid flapping.\n\nRate-limit-aware routing is critical. If one provider shows increasing 429 ratio, a resilient client should back off traffic there et prefer alternatives. This avoids retry storms et helps maintain aggregate throughput.\n\nRegional diversity adds resilience. If all endpoints are in one region, regional network incidents can affect all providers simultaneously. Tagging endpoints by region allows policy constraints such as preferring local region first but failing over cross-region when health degrades.\n\nCircuit-breaking patterns can protect users during severe incidents. If an endpoint crosses error thresholds, mark it temporarily degraded et avoid selecting it pour a cooling period. Deterministic simulations can model this behavior without real network calls.\n\nObservability ties it together. Endpoint decisions should emit reasoning strings or structured fields so operators can inspect why a node was chosen. This is especially useful when users report intermittent failures.\n\nIn many systems, endpoint policy et retry policy are separate modules. Keep interfaces clean: selection chooses target endpoint, retry schedule defines attempts et delays, metrics reducer evaluates outcomes. This separation improves testability et change safety.\n\nFinally, avoid hidden randomness in core selection logic. Randomized tie-breakers may seem harmless but they complicate reproducibility et debugging. Deterministic order supports reliable incident analysis.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Score endpoints using multiple reliability signals.\n- Use deterministic tie-breaking to avoid flapping.\n- Apply rate-limit-aware traffic shifting.\n- Keep fallback et retry policy responsibilities separate.\n- Emit endpoint reasoning pour operational debugging.\n",
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
                    "output": "score lower due to throttling et lag",
                    "note": "Fast but less reliable under pressure."
                  }
                ]
              }
            ]
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
            "content": "# Explorer: retry/backoff simulator\n\nRetry et backoff policies determine whether clients recover gracefully or amplify outages. A simulator should make schedule behavior explicit so teams can reason about user latency et provider pressure. This lecon builds a deterministic view of retry policy outputs et their tradeoffs.\n\nA retry schedule has three core dimensions: number of attempts, per-attempt timeout, et delay before each retry. Exponential backoff grows delay rapidly et reduces pressure in prolonged incidents. Linear backoff grows slower et can be useful pour short-lived blips. Both need max-delay caps to avoid runaway wait times.\n\nThe first attempt should always be represented in the schedule avec zero delay. This improves traceability et ensures telemetry can map attempt index to behavior consistently. Many teams model only retries et lose visibility into full request lifecycle.\n\nPolicy inputs should be validated. Negative retries or non-positive timeouts are configuration errors et should fail fast. Deterministic validation in a pure function prevents silent misconfiguration in production.\n\nThe simulator should also show expected user-facing latency envelope. Pour example, timeout 900ms avec two retries et exponential delays of 100ms et 200ms implies worst-case response around 2.9 seconds before failover completion. This helps product teams set realistic loading copy.\n\nRetry policy must integrate avec endpoint selection. Retrying against the same degraded endpoint repeatedly is usually inferior to endpoint-aware retries. Even if your simulator keeps modules separate, it should explain this interaction.\n\nJitter is often used in distributed systems to prevent synchronization spikes. In this deterministic cours we omit jitter from challenge outputs pour snapshot stability, but teams should understand where jitter fits in production.\n\nMetrics reducers provide feedback loop pour tuning. If p95 improves but error count rises, policy may be too aggressive. If errors drop but latency explodes, policy may be too conservative. Deterministic histogram et quantile outputs make this tradeoff visible.\n\nA final best practice is policy versioning. When retry settings change, compare outputs pour fixture scenarios before deploiement. This catches accidental behavior changes et enables confident rollbacks.\n\nOperational readiness also requires a habit of refreshing fixture sets as provider behavior evolves. Rate-limit patterns, slot lag profiles, et latency distributions change over time, et static fixtures can hide policy regressions. Reliability teams should schedule periodic fixture audits, compare score deltas across providers, et document threshold changes so retry et selection policies remain explainable et reproducible under current network conditions.\n\n\nThis material should be operationalized avec deterministic fixtures et explicit release criteria. Teams should preserve a small set of baseline scenarios that represent normal traffic, moderate stress, et severe stress. Pour each scenario, compare policy outputs before et after changes, et require review notes when confidence labels, warnings, or recommendations move in a meaningful way. This discipline prevents accidental drift, keeps support playbooks aligned avec runtime behavior, et makes incident response faster because everyone shares the same deterministic artifact language. In practice, the strongest reliability teams treat these artifacts as release gates, not optional documentation, et they keep fixture ownership explicit so updates remain intentional et auditable.\n\n## Checklist\n- Represent full schedule including initial attempt.\n- Validate retry configuration inputs strictly.\n- Bound delays avec max caps.\n- Estimate user-facing worst-case latency from schedule.\n- Review policy changes against deterministic fixtures.\n",
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
        "description": "Build deterministic policy engines pour routing, retries, metrics reduction, et health report exports.",
        "lessons": {
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
            "content": "Build deterministic timeout et retry schedule outputs from policy input.",
            "duration": "40 min",
            "hints": [
              "Build a deterministic retry schedule including the first attempt.",
              "Cap delays at maxDelayMs."
            ]
          },
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
            "content": "Choose the best endpoint deterministically from health samples et endpoint metadata.",
            "duration": "40 min",
            "hints": [
              "Blend success rate, latency, 429 pressure, et slot lag into one score.",
              "Tie-break deterministically by endpoint ID."
            ]
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching et invalidation policy",
            "content": "Emit deterministic cache invalidation actions when compte updates et lag signals arrive.",
            "duration": "35 min",
            "hints": [
              "Invalidate compte-keyed cache entries deterministically.",
              "Use tighter TTL when node lag grows."
            ]
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer et histogram buckets",
            "content": "Reduce simulated RPC events into deterministic histogram et p50/p95 metrics.",
            "duration": "35 min",
            "hints": [
              "Reduce RPC telemetry into histogram buckets et quantiles.",
              "Keep bucket boundaries explicit pour deterministic snapshots."
            ]
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
            "content": "Export deterministic JSON et markdown health report artifacts pour multi-provider reliability review.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export both JSON et markdown.",
              "Ensure field order is stable in JSON output."
            ]
          }
        }
      }
    }
  },
  "rust-data-layout-borsh": {
    "title": "Rust Data Layout & Borsh Mastery",
    "description": "Rust-first Solana data layout engineering avec deterministic byte-level tooling et compatibility-safe schema practices.",
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
        "description": "Alignment behavior, Borsh encoding rules, et pratique parsing safety pour stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, et why Solana comptes care",
            "content": "# Memory layout: alignment, padding, et why Solana comptes care\n\nRust layout behavior is deterministic inside one compiled binary but can vary when assumptions are implicit. Pour Solana comptes, this matters because raw bytes are persisted on-chain et parsed by multiple clients across versions. If you conception compte structures without explicit layout strategy, subtle padding et alignment changes can break compatibility or produce incorrect parsing in downstream tools.\n\nRust default layout optimizes pour compiler freedom. Field order in memory pour plain structs is not a stable ABI contract unless you opt into representations such as repr(C). In low-level compte work, repr(C) gives more predictable ordering et alignment behavior, but it does not remove all complexity. Padding still appears between fields when alignment requires it. Pour example, a u8 followed by u64 introduces 7 bytes of padding before the u64 offset. If your parser ignores this, every field after that point is shifted et corrupted.\n\nOn Solana, compte rent is proportional to byte size, so padding is not only a correctness issue; it is a cost issue. Poor field ordering can inflate compte sizes across millions of comptes. A common optimization is grouping larger aligned fields first, then smaller fields. But this must be balanced against readability et migration safety. If you reorder fields in a live protocol, old data may no longer parse under new assumptions. Migration tooling should be explicit et versioned.\n\nBorsh serialization avoids some ABI ambiguity by defining field order in schema rather than raw struct memory. However, zero-copy patterns et manual slicing still depend on precise offsets. Teams should understand both worlds: in-memory layout rules pour zero-copy et schema-based encoding rules pour Borsh.\n\nIn production engineering, layout decisions should be documented avec deterministic outputs: field offsets, per-field padding, struct alignment, et total size. These outputs can be compared in CI to catch accidental drift from refactors. The goal is not theoretical elegance; the goal is stable data contracts over time.\n\n## Operator mindset\n\nSchema bytes are production API surface. Treat offset changes, enum ordering, et parser semantics as compatibility events requiring explicit review.\n\nProduction teams should treat layout et serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, et require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, et parser error behavior pour malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on compte size, rent budget, et compatibility. Deterministic helpers make this pratique: you can produce a stable JSON report in CI et diff it like source code. In Solana et Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after deploiement.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough pour incident response. Good error payloads include field name, offset, et failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important pour indexers et analytics pipelines that need to decide whether to quarantine an event or retry avec a newer schema version. Teams that encode rich deterministic error reports reduce triage time et avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, et test every boundary condition before shipping.\n\nTeams should also document explicit schema gouvernance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, et compatibility avec archived reports. A healthy gouvernance checklist asks who owns schema evolution, how compatibility windows are communicated, et which fixtures are mandatory before release. This level of process may feel heavy pour small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the pratique mechanism that keeps this gouvernance lightweight enough to use: they are simple to diff, easy to discuss, et difficult to misinterpret.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rdb-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rdb-v2-l1-q1",
                    "prompt": "Why does a u8 before u64 often increase compte size?",
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
            "title": "Struct et enum layout pitfalls plus Borsh rules",
            "content": "# Struct et enum layout pitfalls plus Borsh rules\n\nBorsh is widely used because it gives deterministic serialization across languages, but teams still get tripped up by how enums, vectors, et strings map to bytes. Understanding these rules is essential pour robust compte parsing et client interoperability.\n\nPour structs, Borsh encodes fields in declaration order. There is no implicit alignment padding in the serialized stream. That is different from in-memory layout et one reason Borsh is popular pour stable wire formats. Pour enums, Borsh writes a one-byte variant index first, then the variant payload. Changing variant order in code changes the index mapping et is therefore a breaking format change. This is a common source of accidental incompatibility.\n\nVectors et strings are length-prefixed avec little-endian u32 before data bytes. If parsing code trusts the length blindly without bounds checks, malformed or truncated data can cause out-of-bounds reads or allocation abuse. Safe parsers validate available bytes before allocating or slicing.\n\nAnother pitfall is conflating pubkey strings avec pubkey bytes. Borsh encodes bytes, not base58 text. If a client serializes public keys as strings while another expects 32-byte arrays, decoding fails despite both sides using \"Borsh\" terminology. Teams should define schema types precisely.\n\nError conception is part of serialization safety. Distinguish malformed length prefix, unknown enum variant, unsupported dynamic type, et primitive decode out-of-bounds. Structured errors let callers decide whether to retry, drop, or quarantine payloads.\n\nFinally, encoding et decoding tests should run symmetrically avec fixed fixtures. A deterministic fixture suite catches regressions early et gives confidence that Rust, TypeScript, et analytics parsers agree on the same bytes.\nProduction teams should treat layout et serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, et require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, et parser error behavior pour malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on compte size, rent budget, et compatibility. Deterministic helpers make this pratique: you can produce a stable JSON report in CI et diff it like source code. In Solana et Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after deploiement.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough pour incident response. Good error payloads include field name, offset, et failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important pour indexers et analytics pipelines that need to decide whether to quarantine an event or retry avec a newer schema version. Teams that encode rich deterministic error reports reduce triage time et avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, et test every boundary condition before shipping.\n\nTeams should also document explicit schema gouvernance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, et compatibility avec archived reports. A healthy gouvernance checklist asks who owns schema evolution, how compatibility windows are communicated, et which fixtures are mandatory before release. This level of process may feel heavy pour small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the pratique mechanism that keeps this gouvernance lightweight enough to use: they are simple to diff, easy to discuss, et difficult to misinterpret.\n",
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
            "title": "Explorer: layout visualizer pour field offsets",
            "content": "# Explorer: layout visualizer pour field offsets\n\nA layout visualizer turns abstract alignment rules into concrete numbers engineers can review. Instead of debating whether a struct is \"probably fine,\" teams can inspect exact offsets, padding, et total size.\n\nThe visualizer workflow is straightforward: provide ordered fields et types, compute alignments, insert required padding, et emit final layout metadata. This output should be deterministic et serializable so CI can compare snapshots.\n\nWhen using this in Solana development, combine visualizer output avec compte rent planning et migration docs. If a proposed field addition increases total size, quantify the impact et decide whether to append, split compte state, or introduce versioned comptes. Do not rely on intuition pour byte-level decisions.\n\nVisualizers are also useful pour onboarding. New contributors can quickly see why u8/u64 ordering changes offsets et why safe parsers need explicit bounds checks. This reduces recurring parsing bugs et review churn.\n\nA high-quality visualizer report includes field name, offset, size, alignment, padding-before, trailing padding, et struct alignment. Keep key ordering stable so report diffs remain readable.\n\nEngineers should pair visualizer output avec parse tests. If layout says a bool lives at offset 0 et u8 at offset 1, parser tests should assert exactly that. Deterministic systems connect conception artifacts et runtime checks.\nProduction teams should treat layout et serialization contracts as long-lived APIs. Any change to field order, enum variant index, or alignment assumptions can break deployed clients, indexers, or migration scripts. A safe process is to version schemas, ship fixture updates, et require deterministic regression outputs before release. Reviewers should compare expected byte offsets, expected encoded bytes, et parser error behavior pour malformed inputs. If one field widens from u32 to u64, the review should explicitly call out downstream effects on compte size, rent budget, et compatibility. Deterministic helpers make this pratique: you can produce a stable JSON report in CI et diff it like source code. In Solana et Anchor contexts, this discipline prevents subtle data corruption bugs that are expensive to diagnose after deploiement.\n\nAnother operational rule is to keep parser failures structured. A generic \"decode failed\" message is not enough pour incident response. Good error payloads include field name, offset, et failure category such as out-of-bounds, invalid bool byte, or unsupported dynamic shape. This is especially important pour indexers et analytics pipelines that need to decide whether to quarantine an event or retry avec a newer schema version. Teams that encode rich deterministic error reports reduce triage time et avoid accidental data loss. Over time, this becomes part of reliability culture: parse strict, report clearly, et test every boundary condition before shipping.\n\nTeams should also document explicit schema gouvernance rules. If a field type changes, reviewers should verify migration strategy, historical replay impact, et compatibility avec archived reports. A healthy gouvernance checklist asks who owns schema evolution, how compatibility windows are communicated, et which fixtures are mandatory before release. This level of process may feel heavy pour small projects, but it is exactly what prevents costly corruption incidents at scale. Deterministic byte-level artifacts are the pratique mechanism that keeps this gouvernance lightweight enough to use: they are simple to diff, easy to discuss, et difficult to misinterpret.\n",
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
        "title": "Compte Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, et compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
            "content": "Compute deterministic field offsets, alignment padding, et total struct size.",
            "duration": "40 min",
            "hints": [
              "Use alignment-aware offsets et include padding fields in the result.",
              "Struct total size should be aligned to max field alignment."
            ]
          },
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
            "content": "Implement deterministic Borsh encode/decode avec structured error handling.",
            "duration": "40 min",
            "hints": [
              "Borsh strings are length-prefixed little-endian u32 + UTF-8 bytes.",
              "Keep encode/decode symmetric pour deterministic tests."
            ]
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
            "content": "Model deterministic tradeoff scoring between zero-copy et Borsh approaches.",
            "duration": "35 min",
            "hints": [
              "Model tradeoffs deterministically: read speed vs schema flexibility.",
              "Recommendation should be pure function of inputs."
            ]
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
            "content": "Parse compte bytes avec deterministic bounds checks et structured errors.",
            "duration": "35 min",
            "hints": [
              "Validate byte length before field parsing.",
              "Return structured errors pour invalid booleans et unsupported field types."
            ]
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
            "content": "Produce stable JSON et markdown layout artifacts pour the final project.",
            "duration": "45 min",
            "hints": [
              "Checkpoint should export stable JSON + markdown.",
              "Avoid random IDs et timestamps in output."
            ]
          }
        }
      }
    }
  },
  "rust-errors-invariants": {
    "title": "Rust Error Conception & Invariants",
    "description": "Build typed invariant guard libraries avec deterministic evidence artifacts, compatibility-safe error contracts, et audit-ready reporting.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "errors",
      "invariants",
      "reliability"
    ],
    "modules": {
      "rei-v2-foundations": {
        "title": "Rust Error et Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, et deterministic invariant conception fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
            "content": "# Error taxonomy: recoverable vs fatal\n\nRust encourages explicit error modeling, but teams still produce weak error contracts when they rely on ad hoc strings or inconsistent wrappers. In Solana et Anchor-adjacent systems, this becomes painful quickly because on-chain failures, off-chain pipelines, et frontend UX all need coherent semantics.\n\nA pratique taxonomy starts avec recoverable versus fatal classes. Recoverable errors represent expected contract violations: stale data, missing signer, value out of range, or transient dependency mismatch. Fatal errors represent corrupted assumptions: impossible state, incompatible schema version, or invariant breach that requires operator intervention.\n\nTyped enums are the center of this conception. A code such as NEGATIVE_VALUE or MISSING_AUTHORITY is unambiguous et searchable. Attaching structured context fields gives downstream systems enough detail pour logging et user-facing copy without string parsing.\n\nAvoid stringly error contracts where every caller invents custom messages. Those systems accumulate inconsistent wording et ambiguous categories. Instead, keep messages deterministic et derive user copy from code + context in one mapping layer.\n\nInvariants should be designed pour testability. If an invariant cannot be expressed as a deterministic function over known inputs, it is hard to validate et easy to regress. Start avec small ensure helpers that return typed results, then compose them into higher-level guards.\n\nIn production, error taxonomies should be reviewed like API changes. Renaming codes or changing severity mapping can break alert rules et client handling. Version these changes et validate avec fixture suites.\n\n## Operator mindset\n\nInvariant errors are operational contracts. If code, severity, et context are not stable, monitoring et user recovery flows degrade even when logic is correct.\n\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, et explicit severity mapping so runtime incidents are diagnosable without guessing. Pour invariants, each failed check should identify what contract was violated, where in the flow it happened, et whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent et alert tuning becomes fragile. A typed error library avec deterministic reports solves this by making failure semantics machine-readable et human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain avec injected timestamps et step IDs gives auditors et engineers a replayable explanation of what passed, what failed, et in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old et new evidence outputs et verify expected changes before deploiement. Over time, these deterministic artifacts become part of release discipline et reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries et confirm that alerts, dashboards, et user-facing copy still map correctly. If mappings drift, update guides et fallback behavior should ship together avec code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users et support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, et a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors et reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it avec quarterly reviews where engineers evaluate false-positive rates, update context fields, et verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, et communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                      "They remove need pour logs",
                      "They reduce compile time"
                    ],
                    "answerIndex": 0,
                    "explanation": "Typed codes make handling et monitoring deterministic."
                  }
                ]
              }
            ]
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, et context",
            "content": "# Result<T, E> patterns, ? operator, et context\n\nResult-based control flow is one of Rust's strongest tools pour building robust services et on-chain-adjacent clients. The key is not merely using Result, but designing error types et propagation boundaries that preserve enough context pour debugging et UX decisions.\n\nThe ? operator keeps code concise, but it can hide context unless error conversion layers are explicit. Invariant-centric systems should wrap lower-level failures avec domain meaning before returning to upper layers. Pour example, a parse failure in compte metadata should map to a deterministic invariant code et include the field path.\n\nContext should be structured rather than baked into message text. A map of key/value fields like {label, value, limit} is easier to aggregate et filter than sentence fragments. It also supports localization et role-specific message rendering.\n\nAnother pattern is separating validation from side effects. If ensure helpers only evaluate conditions et construct typed errors, they are deterministic et unit-testable. Side effects such as logging or telemetry emission can happen at call boundaries.\n\nWhen building libraries, avoid exposing too many internal codes. Public codes should represent stable contracts, while internal details can remain nested context. This helps keep compatibility manageable.\n\nTest strategy should include positive cases, negative cases, et report formatting checks. Deterministic report output is valuable pour code review because changes are visible as stable diffs, not only behavioral assertions.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, et explicit severity mapping so runtime incidents are diagnosable without guessing. Pour invariants, each failed check should identify what contract was violated, where in the flow it happened, et whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent et alert tuning becomes fragile. A typed error library avec deterministic reports solves this by making failure semantics machine-readable et human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain avec injected timestamps et step IDs gives auditors et engineers a replayable explanation of what passed, what failed, et in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old et new evidence outputs et verify expected changes before deploiement. Over time, these deterministic artifacts become part of release discipline et reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries et confirm that alerts, dashboards, et user-facing copy still map correctly. If mappings drift, update guides et fallback behavior should ship together avec code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users et support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, et a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors et reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it avec quarterly reviews where engineers evaluate false-positive rates, update context fields, et verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, et communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
                    "note": "Typed et deterministic"
                  }
                ]
              }
            ]
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
            "content": "# Explorer: invariant decision tree\n\nAn invariant decision tree helps teams reason about guard ordering et failure priority. Not every invariant should be checked in arbitrary order. Early checks should prevent expensive work et produce the clearest failure semantics.\n\nA common flow: structural preconditions first, authority checks second, value bounds third, relational checks fourth. This ordering minimizes noisy failures et improves auditability. If authority is missing, there is little value in evaluating downstream value checks.\n\nDecision trees also help map errors to UX behavior. A recoverable user input violation may show inline correction hints, while a fatal integrity breach should hard-stop avec escalation messaging.\n\nIn deterministic systems, tree traversal should be explicit et testable. Given the same input, the same failing node should be reported every time. This allows stable evidence chains et reliable automation.\n\nExplorer tooling can visualize this by showing the path taken, checks skipped, et final outcome. Teams can then tune guard order intentionally et document rationale.\nProduction reliability work depends on deterministic error behavior. Teams should agree on typed error codes, stable context fields, et explicit severity mapping so runtime incidents are diagnosable without guessing. Pour invariants, each failed check should identify what contract was violated, where in the flow it happened, et whether the failure is recoverable. If one subsystem emits free-form strings while another emits numeric codes, dashboards become inconsistent et alert tuning becomes fragile. A typed error library avec deterministic reports solves this by making failure semantics machine-readable et human-readable at the same time.\n\nEvidence chains are equally important. A report that says \"failed\" without chronological context has limited value. A deterministic chain avec injected timestamps et step IDs gives auditors et engineers a replayable explanation of what passed, what failed, et in which order. This is especially useful when protocol upgrades adjust invariant rules: reviewers can diff old et new evidence outputs et verify expected changes before deploiement. Over time, these deterministic artifacts become part of release discipline et reduce regressions caused by informal error handling.\n\nWhen error contracts evolve, teams should run compatibility drills. These drills intentionally replay older fixture sets against newer error libraries et confirm that alerts, dashboards, et user-facing copy still map correctly. If mappings drift, update guides et fallback behavior should ship together avec code changes. This avoids the common failure mode where backend semantics change but frontend messaging lags behind, confusing users et support teams. Deterministic reports are a force multiplier here because they make drift visible immediately instead of after production incidents.\n\nSustained quality also requires explicit ownership of invariant catalogs. Every invariant should have a named owner, a rationale, et a linked test fixture. When teams cannot answer why an invariant exists, they often remove it during refactors et reintroduce old classes of failures. A lightweight ownership table prevents this. Pair it avec quarterly reviews where engineers evaluate false-positive rates, update context fields, et verify UX mappings remain actionable. During incidents, this preparation pays off: responders can identify which invariant tripped, understand expected remediation, et communicate clearly to users. Deterministic evidence artifacts make postmortems faster because the same chain can be replayed exactly across environments.\n",
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
        "description": "Implement guard helpers, evidence-chain generation, et stable audit reporting pour reliability et incident response.",
        "lessons": {
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
            "content": "Implement typed invariant errors et deterministic ensure helpers.",
            "duration": "40 min",
            "hints": [
              "Return typed error payloads, not raw strings.",
              "Keep ensure() deterministic et side-effect free."
            ]
          },
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
            "content": "Build a deterministic evidence chain avec injected timestamps.",
            "duration": "40 min",
            "hints": [
              "Inject/mock timestamps pour deterministic evidence chains.",
              "Step ordering must remain stable pour snapshot tests."
            ]
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
            "content": "Run deterministic invariant case sets et return failed IDs.",
            "duration": "35 min",
            "hints": [
              "Property-ish deterministic tests can still run as fixed case sets.",
              "Return explicit failed IDs pour debugability."
            ]
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
            "content": "Format a deterministic markdown evidence report.",
            "duration": "35 min",
            "hints": [
              "Markdown report should preserve stable step order et deterministic formatting.",
              "Include aggregate status et per-step evidence lines."
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
    "title": "Rust Performance pour On-chain Thinking",
    "description": "Simulate et optimize compute-cost behavior avec deterministic Rust-first tooling et budget-driven performance gouvernance.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "performance",
      "compute",
      "solana"
    ],
    "modules": {
      "rpot-v2-foundations": {
        "title": "Performance Foundations",
        "description": "Rust performance modele mentals, data-structure tradeoffs, et deterministic cost reasoning pour reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Performance modele mental: allocations, clones, hashing",
            "content": "# Performance modele mental: allocations, clones, hashing\n\nRust performance work in Solana ecosystems is mostly about data movement discipline. Teams often chase micro-optimizations while ignoring dominant costs such as repeated allocations, unnecessary cloning, et redundant hashing in loops.\n\nA useful modele mental starts avec cost buckets. Allocation cost includes heap growth, allocator metadata, et cache disruption. Clone cost depends on object size et ownership patterns. Hash cost depends on bytes hashed et hash invocation frequency. Loop cost depends on iteration count et per-iteration work. Map lookup cost depends on data structure choice et access pattern.\n\nThe point of this model is not exact runtime cycles. The point is relative pressure. If one path performs ten allocations et another performs one allocation, the former should trigger scrutiny even before microbenchmarking.\n\nOn-chain thinking reinforces this: compute budgets are finite, et predictable resource usage matters. Even off-chain indexers et simulators benefit from the same discipline because latency tails et CPU burn impact reliability.\n\nDeterministic models are ideal pour CI. Given identical operation counts, output should be identical. Reviewers can reason about deltas directly et reject regressions early.\n\n## Operator mindset\n\nPerformance guidance should be versioned et budgeted. Without explicit budgets et stable cost categories, optimization work drifts toward anecdote instead of measurable outcomes.\n\nPerformance engineering pour on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines et CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline pour regression detection. The model does not replace real profiling; it complements it by making early conception tradeoffs explicit et reviewable.\n\nWhen you model costs, keep weights documented et intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient et track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports avec before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers et client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined avec suggestion outputs et checkpoint reports, these models become pratique guardrails pour engineering quality.\n\nMature teams combine these deterministic models avec periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients et rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation et keeps recommendations aligned avec actual system behavior. The key is to treat model updates as versioned changes avec explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why performance guidance changed et how improvements were verified.\n\nTeams should also define performance budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete et avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets et require explicit waivers when thresholds are exceeded. Keep waiver text deterministic et tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable performance culture where improvements are intentional, measurable, et easy to audit.\n",
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
                      "They remove need pour tests"
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
            "content": "# Data structures: Vec, HashMap, BTreeMap tradeoffs\n\nData structure choice is one of the highest leverage performance decisions in Rust systems. Vec offers compact contiguous storage et predictable iteration speed. HashMap offers average-case fast lookup but can have higher allocation et hashing overhead. BTreeMap provides ordered keys et stable traversal costs avec different memory locality characteristics.\n\nIn on-chain-adjacent simulations et indexers, workloads vary. If you mostly append et iterate, Vec plus binary search or index maps can outperform heavier maps. If random key lookup dominates, HashMap may win despite hash overhead. If deterministic ordering is required pour report output or canonical snapshots, BTreeMap can simplify stable behavior.\n\nThe wrong pattern is premature abstraction that hides access patterns. Engineers should instrument operation counts et use cost models to evaluate actual use cases. Deterministic benchmark fixtures make this reproducible.\n\nAnother pratique tradeoff is allocation strategy. Reusing buffers et reserving capacity can reduce churn substantially. This is often more impactful than iterator-vs-loop debates.\n\nKeep conception reviews concrete: expected reads, writes, key cardinality, ordering requirements, et mutation frequency. Then choose structures intentionally et document rationale.\nPerformance engineering pour on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines et CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline pour regression detection. The model does not replace real profiling; it complements it by making early conception tradeoffs explicit et reviewable.\n\nWhen you model costs, keep weights documented et intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient et track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports avec before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers et client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined avec suggestion outputs et checkpoint reports, these models become pratique guardrails pour engineering quality.\n\nMature teams combine these deterministic models avec periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients et rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation et keeps recommendations aligned avec actual system behavior. The key is to treat model updates as versioned changes avec explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why performance guidance changed et how improvements were verified.\n\nTeams should also define performance budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete et avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets et require explicit waivers when thresholds are exceeded. Keep waiver text deterministic et tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable performance culture where improvements are intentional, measurable, et easy to audit.\n",
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
                    "note": "Good pour sequential work"
                  },
                  {
                    "cmd": "HashMap lookups",
                    "output": "fast random access, hash overhead",
                    "note": "Good pour key-based fetch"
                  }
                ]
              }
            ]
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
            "content": "# Explorer: cost model sandbox\n\nA cost sandbox lets teams test optimization hypotheses without waiting pour full benchmark infrastructure. Provide operation counts, compute weighted costs, et inspect which buckets dominate total pressure.\n\nThe sandbox should separate baseline et optimized inputs so diffs are explicit. If a change claims fewer allocations but increases map lookups sharply, the model should show the net effect. This prevents one-dimensional optimization that regresses other paths.\n\nSuggestion generation should be threshold-based et deterministic. Pour example, if allocation cost exceeds a threshold, recommend pre-allocation et buffer reuse. If serialization cost dominates, recommend batching or avoiding repeated decode/encode loops.\n\nStable report outputs are critical pour engineering workflows. JSON payloads feed CI checks, markdown summaries support code review et team communication. Keep key ordering stable so string equality tests remain meaningful.\n\nSandboxes are not production profilers, but they are excellent decision support tools when kept deterministic et aligned avec known workload patterns.\nPerformance engineering pour on-chain-adjacent Rust systems should be deterministic by default. Timing benchmarks are useful but noisy across machines et CI runners. A stable cost model that converts operation counts into weighted costs gives teams a consistent baseline pour regression detection. The model does not replace real profiling; it complements it by making early conception tradeoffs explicit et reviewable.\n\nWhen you model costs, keep weights documented et intentionally conservative. If allocations are expensive in your environment, give them a higher coefficient et track reductions across releases. If map lookups dominate hot loops, surface that as a recommendation category. Stable reports avec before/after breakdowns let reviewers validate that claimed optimizations actually reduce modeled cost instead of merely shifting work.\n\nSerialization churn is another hidden cost center. Repeated encode/decode cycles inside loops often produce avoidable overhead in indexers et client-side simulation tools. Deterministic byte-count models are an effective teaching tool because they make waste visible without requiring instrumentation overhead. Combined avec suggestion outputs et checkpoint reports, these models become pratique guardrails pour engineering quality.\n\nMature teams combine these deterministic models avec periodic empirical profiling to recalibrate weights. If production traces show map lookups dominating more than expected, adjust coefficients et rerun fixture suites so optimization priorities stay realistic. This prevents model stagnation et keeps recommendations aligned avec actual system behavior. The key is to treat model updates as versioned changes avec explicit reasoning, not ad hoc tweaks. Deterministic reports then provide historical continuity, letting teams explain why performance guidance changed et how improvements were verified.\n\nTeams should also define performance budgets per workflow rather than relying only on aggregate totals. A route-planning path may tolerate moderate hashing cost but strict allocation limits, while a reporting path may prioritize serialization efficiency. Budgeted categories make optimization goals concrete et avoid endless debates about which metric matters most. In release reviews, compare modeled costs against these budgets et require explicit waivers when thresholds are exceeded. Keep waiver text deterministic et tracked in artifacts so exceptions do not become silent defaults. Over time, this process builds a reliable performance culture where improvements are intentional, measurable, et easy to audit.\n",
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
        "description": "Build deterministic profilers, recommendation engines, et report outputs aligned to explicit performance budgets.",
        "lessons": {
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
            "content": "Estimate deterministic operation costs from fixed weighting rules.",
            "duration": "40 min",
            "hints": [
              "Use deterministic arithmetic weights pour each operation category.",
              "Return component breakdown plus total pour easier optimization diffs."
            ]
          },
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
            "content": "Apply deterministic before/after metric reductions et diff outputs.",
            "duration": "40 min",
            "hints": [
              "Treat optimization as deterministic metric diffs, not runtime benchmarking.",
              "Clamp reduced metrics at zero."
            ]
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
            "content": "Compute deterministic serialization overhead et byte savings.",
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
            "content": "Export deterministic JSON et markdown profiler reports.",
            "duration": "45 min",
            "hints": [
              "Checkpoint must include stable JSON et markdown outputs.",
              "Use deterministic percentage rounding."
            ]
          }
        }
      }
    }
  },
  "rust-async-indexer-pipeline": {
    "title": "Concurrency & Async pour Indexers (Rust)",
    "description": "Rust-first async pipeline engineering avec bounded concurrency, replay-safe reducers, et deterministic operational reporting.",
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
        "description": "Async/concurrency fundamentals, backpressure behavior, et deterministic execution modeling pour indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
            "content": "# Async fundamentals: futures, tasks, channels\n\nRust async systems are built on explicit scheduling rather than implicit thread-per-task models. Futures represent pending work, executors poll futures, et channels coordinate data flow. Pour indexers, this architecture supports high throughput but requires careful control of concurrency et backpressure.\n\nA common failure mode is unbounded task spawning. It may look fine in local tests, then collapse in production under burst traffic due to memory pressure et queue growth. Defensive conception uses bounded concurrency avec explicit task budgets.\n\nChannels are powerful but can hide overload when used without capacity limits. Bounded channels make pressure visible: producers block or shed work when consumers lag. In deterministic simulations, this behavior can be modeled by explicit queues et tick-based progression.\n\nThe key mindset is reproducibility. If pipeline behavior cannot be replayed deterministically, debugging et regression tests become guesswork. Simulated executors solve this by removing wall-clock dependence.\n\n## Operator mindset\n\nAsync pipelines are reliability systems, not just throughput systems. Concurrency limits, retry behavior, et reducer determinism must stay auditable under stress.\n\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers et threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler avec deterministic tick advancement provides a clean environment pour validating bounded concurrency, retry sequencing, et backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, et completion order is reproducible.\n\nBackpressure conception should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably et metrics should expose this. Deterministic tests can assert queue length, total ticks, et completion order pour stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency et stable reducers. Duplicate deliveries should collapse by key, et snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy et incident triage slows down. Stable JSON et markdown reports prevent that by keeping artifacts comparable between runs et between code versions.\n\nOperational teams should maintain scenario catalogs pour burst traffic, retry storms, et partial-stage failures. Each scenario should specify expected queue depth, retry schedule, et final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios et apprenez system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters pour accepted work, deferred work, retries, et dropped events. Without these counters, backpressure incidents become anecdotal et tuning decisions become reactive. Avec deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI avec mocked scheduler runs, et regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, et explicit failure budgets. Pour educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks pour each failure mode et link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, et communication templates pour fast coordination.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "raip-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "raip-v2-l1-q1",
                    "prompt": "Why prefer bounded concurrency pour indexer tasks?",
                    "options": [
                      "It prevents runaway memory et queue growth",
                      "It guarantees zero failures",
                      "It eliminates retries"
                    ],
                    "answerIndex": 0,
                    "explanation": "Bounded concurrency keeps load behavior controlled et observable."
                  }
                ]
              }
            ]
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits et backpressure",
            "content": "# Concurrency limits et backpressure\n\nBackpressure is not optional in high-volume pipelines. Without it, producer speed can overwhelm reducers, retries, or storage sinks. A resilient conception sets explicit concurrency caps et queue semantics that are easy to reason about.\n\nSemaphore-style limits are a common pattern: only N tasks can run at once. Additional tasks wait in queue. Deterministic simulation can model this avec a running list et remaining tick counters.\n\nRetry behavior interacts avec backpressure. If retries ignore queue pressure, they amplify congestion. Deterministic retry schedules should be bounded et inspectable.\n\nConception reviews should ask: what is max concurrent work, what is queue policy, what happens on overload, et how is fairness maintained. Stable run reports provide concrete answers.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers et threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler avec deterministic tick advancement provides a clean environment pour validating bounded concurrency, retry sequencing, et backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, et completion order is reproducible.\n\nBackpressure conception should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably et metrics should expose this. Deterministic tests can assert queue length, total ticks, et completion order pour stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency et stable reducers. Duplicate deliveries should collapse by key, et snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy et incident triage slows down. Stable JSON et markdown reports prevent that by keeping artifacts comparable between runs et between code versions.\n\nOperational teams should maintain scenario catalogs pour burst traffic, retry storms, et partial-stage failures. Each scenario should specify expected queue depth, retry schedule, et final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios et apprenez system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters pour accepted work, deferred work, retries, et dropped events. Without these counters, backpressure incidents become anecdotal et tuning decisions become reactive. Avec deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI avec mocked scheduler runs, et regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, et explicit failure budgets. Pour educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks pour each failure mode et link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, et communication templates pour fast coordination.\n",
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
                    "note": "bounded et predictable"
                  }
                ]
              }
            ]
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph et concurrency",
            "content": "# Explorer: pipeline graph et concurrency\n\nPipeline graphs help teams communicate stage boundaries, concurrency budgets, et retry behaviors. A graph that shows ingest, dedupe, retry, et snapshot stages avec explicit capacities is far more actionable than prose descriptions.\n\nIn deterministic simulation, each stage can be represented as queue + worker budget. Events progress in ticks, et transitions are logged in timeline snapshots. This makes race conditions et starvation visible.\n\nA good explorer shows total ticks, completion order, et per-tick running/completed sets. These artifacts become checkpoints pour regression tests.\n\nPair graph exploration avec idempotency key tests. Duplicate events should not mutate state repeatedly. Stable reducers et sorted outputs make this easy to verify.\n\nThe final objective is operational confidence: when congestion or reorg scenarios occur, teams can replay deterministic fixtures et compare expected versus actual behavior quickly.\nAsync reliability work is strongest when concurrency behavior is testable without wall-clock timing. Real timers et threads can introduce nondeterminism that obscures logic bugs. A simulated scheduler avec deterministic tick advancement provides a clean environment pour validating bounded concurrency, retry sequencing, et backpressure behavior. In this model, tasks consume fixed ticks, queues are explicit, et completion order is reproducible.\n\nBackpressure conception should also be visible in reports. If incoming work exceeds concurrency budget, queues should grow predictably et metrics should expose this. Deterministic tests can assert queue length, total ticks, et completion order pour stress scenarios. This creates confidence that production systems degrade gracefully under load rather than failing unpredictably.\n\nReorg-safe indexing pipelines require idempotency et stable reducers. Duplicate deliveries should collapse by key, et snapshot reducers should produce canonical state outputs. If reducer output order drifts across runs, diff-based monitoring becomes noisy et incident triage slows down. Stable JSON et markdown reports prevent that by keeping artifacts comparable between runs et between code versions.\n\nOperational teams should maintain scenario catalogs pour burst traffic, retry storms, et partial-stage failures. Each scenario should specify expected queue depth, retry schedule, et final snapshot state. Running these catalogs on every release gives confidence that changes to scheduler logic, retry tuning, or reducer semantics do not introduce hidden regressions. This practice also improves onboarding: new engineers can study concrete scenarios et apprenez system behavior quickly without touching production infrastructure. Deterministic simulation is the foundation that makes this sustainable.\n\nAnother important discipline is stage-level observability contracts. Each stage should emit deterministic counters pour accepted work, deferred work, retries, et dropped events. Without these counters, backpressure incidents become anecdotal et tuning decisions become reactive. Avec deterministic metrics, teams can set concrete objectives such as maximum queue depth under specified load fixtures. These objectives should be tested in CI avec mocked scheduler runs, et regressions should block release until reviewed. This mirrors how robust distributed systems are managed in production: clear contracts, repeatable experiments, et explicit failure budgets. Pour educational environments, it also reinforces that async correctness is not only about compiling futures but about predictable system behavior under stress.\n\nTeams should capture one-page runbooks pour each failure mode et link them directly from report outputs so responders can act immediately. These runbooks should include ownership, rollback criteria, et communication templates pour fast coordination.\n",
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
                      "label": "Run avec retries",
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
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, et report exports pour reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
            "content": "Simulate bounded-concurrency execution avec deterministic task ordering.",
            "duration": "40 min",
            "hints": [
              "Model bounded concurrency avec a deterministic queue et tick loop.",
              "No real timers; simulate progression by decrementing remaining ticks."
            ]
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
            "content": "Generate deterministic retry delay schedules pour linear et exponential policies.",
            "duration": "40 min",
            "hints": [
              "Retry schedule should be deterministic et bounded.",
              "Support linear et exponential backoff modes."
            ]
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
            "content": "Deduplicate replay events by deterministic idempotency keys.",
            "duration": "35 min",
            "hints": [
              "Use idempotency keys to collapse duplicate replay events.",
              "Return stable sorted keys pour deterministic snapshots."
            ]
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
            "content": "Build deterministic snapshot state from simulated event streams.",
            "duration": "35 min",
            "hints": [
              "Reducer should be deterministic et idempotent-friendly.",
              "Sort output keys pour stable report generation."
            ]
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
            "content": "Export deterministic run report artifacts pour the async pipeline simulation.",
            "duration": "45 min",
            "hints": [
              "Checkpoint output should mirror deterministic pipeline run artifacts.",
              "Include both machine et human-readable export fields."
            ]
          }
        }
      }
    }
  },
  "rust-proc-macros-codegen-safety": {
    "title": "Procedural Macros & Codegen pour Safety",
    "description": "Rust macro/codegen safety taught through deterministic parser et check-generation tooling avec audit-friendly outputs.",
    "duration": "10 hours",
    "tags": [
      "rust",
      "macros",
      "codegen",
      "safety"
    ],
    "modules": {
      "rpmcs-v2-foundations": {
        "title": "Macro et Codegen Foundations",
        "description": "Macro modele mentals, constraint DSL conception, et safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro modele mental: declarative vs procedural",
            "content": "# Macro modele mental: declarative vs procedural\n\nRust macros come in two broad forms: declarative macros pour pattern-based expansion et procedural macros pour syntax-aware transformation. Anchor relies heavily on macro-driven ergonomics to generate compte validation et instruction plumbing.\n\nPour safety engineering, the value is consistency. Instead of hand-writing signer et owner checks in every handler, macro-style codegen can enforce these rules from concise attributes. This reduces copy-paste drift et makes review focus on policy intent.\n\nIn this cours, we simulate proc-macro behavior avec deterministic TypeScript parser/generator helpers. The goal is conceptual transfer: attribute input -> AST -> generated checks -> runtime evaluation report.\n\nA macro modele mental helps avoid two mistakes: trusting generated behavior blindly et over-generalizing DSL syntax. Good macro conception keeps syntax explicit, expansion predictable, et errors readable.\n\nTreat generated checks as code artifacts, not opaque internals. Store them in tests, compare them in diffs, et validate behavior on controlled fixtures.\n\n## Operator mindset\n\nCodegen safety depends on reviewable output. If generated checks are not deterministic et diff-friendly, teams lose trust et incidents take longer to diagnose.\n\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor et Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate et catch classes of validation bugs early. Pour teaching in a browser environment, a deterministic parser et generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes et debugging becomes harder. Stable generated strings, golden file tests, et deterministic run reports solve this. Teams can diff generated code as plain text et confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL conception. Attribute syntax should be strict enough to reject ambiguous input et explicit enough to encode signer, owner, relation, et mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind et target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules et keep migration guides pour older attribute forms. Unversioned grammar drift can silently break generated checks et create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired avec golden output snapshots et runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, et testable, which is exactly the behavior needed pour safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, et runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined et avoids turning safety tooling into a maintenance burden. Teams can further strengthen this avec compatibility suites that replay historical DSL inputs against new parsers et compare outputs byte-pour-byte. When differences appear, release notes should explain why behavior changed et how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent et lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, et runtime validation signoff in every checklist.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "rpmcs-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "rpmcs-v2-l1-q1",
                    "prompt": "Why is generated code review important pour safety?",
                    "options": [
                      "It verifies expansion matches policy intent",
                      "It increases compile speed",
                      "It removes need pour tests"
                    ],
                    "answerIndex": 0,
                    "explanation": "Generated checks must remain inspectable et auditable."
                  }
                ]
              }
            ]
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
            "content": "# Safety through codegen: constraint checks\n\nConstraint codegen converts compact declarations into explicit runtime guards. Typical constraints include signer presence, compte ownership, has-one relations, et mutability requirements.\n\nA strong codegen pipeline validates input syntax strictly, produces deterministic output ordering, et emits meaningful errors pour unsupported forms. Weak codegen pipelines accept ambiguous syntax et produce inconsistent expansion, which undermines trust.\n\nOwnership checks are high-value constraints because compte substitution bugs are common in Solana systems. Generated owner guards reduce omission risk. Signer checks ensure privileged paths are gated by explicit authority.\n\nHas-one relation checks encode structural links between comptes et authorities. Generated relation checks reduce manual mistakes et keep behavior aligned across handlers.\n\nFinally, tests generated output via golden strings catches accidental expansion drift. This is especially useful during parser refactors.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor et Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate et catch classes of validation bugs early. Pour teaching in a browser environment, a deterministic parser et generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes et debugging becomes harder. Stable generated strings, golden file tests, et deterministic run reports solve this. Teams can diff generated code as plain text et confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL conception. Attribute syntax should be strict enough to reject ambiguous input et explicit enough to encode signer, owner, relation, et mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind et target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules et keep migration guides pour older attribute forms. Unversioned grammar drift can silently break generated checks et create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired avec golden output snapshots et runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, et testable, which is exactly the behavior needed pour safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, et runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined et avoids turning safety tooling into a maintenance burden. Teams can further strengthen this avec compatibility suites that replay historical DSL inputs against new parsers et compare outputs byte-pour-byte. When differences appear, release notes should explain why behavior changed et how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent et lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, et runtime validation signoff in every checklist.\n",
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
            "content": "# Explorer: constraint builder to generated checks\n\nA constraint builder explorer helps engineers see how DSL choices affect generated code et runtime safety outcomes. Input one attribute line, observe parsed AST, generated pseudo-code, et pass/fail execution against sample inputs.\n\nThis tight loop is useful pour both education et production review. Teams can prototype new constraint forms, verify deterministic output, et add golden tests before adoption.\n\nThe explorer should surface parse failures clearly. If syntax is invalid, report line et expected format. If constraint kind is unsupported, fail avec deterministic error text.\n\nGenerated checks should preserve input order unless policy requires canonical sorting. Either way, behavior must be deterministic et documented.\n\nRuntime evaluation output should include failure list avec kind, target, et reason. This allows developers to fix configuration quickly et keeps safety reporting actionable.\nMacro-inspired codegen is powerful because it can enforce safety contracts consistently across many handlers. In Anchor et Rust ecosystems, this is one reason attribute-based constraints reduce boilerplate et catch classes of validation bugs early. Pour teaching in a browser environment, a deterministic parser et generator provides the same conceptual value without requiring compiler plugins.\n\nThe important principle is that generated checks must be reviewable. If developers cannot inspect generated output, trust erodes et debugging becomes harder. Stable generated strings, golden file tests, et deterministic run reports solve this. Teams can diff generated code as plain text et confirm that constraint changes are intentional.\n\nAnother key rule is clear DSL conception. Attribute syntax should be strict enough to reject ambiguous input et explicit enough to encode signer, owner, relation, et mutability constraints. Parsing errors should include line-level hints where possible. Structured run results should identify failing constraints by kind et target, enabling direct remediation. This keeps codegen a safety tool rather than a hidden source of complexity.\n\nAs DSLs grow, teams should version grammar rules et keep migration guides pour older attribute forms. Unversioned grammar drift can silently break generated checks et create false confidence in safety coverage. Deterministic parsing fixtures catch these regressions early, especially when paired avec golden output snapshots et runtime validation cases. The result is a codegen workflow where changes are explicit, reviewable, et testable, which is exactly the behavior needed pour safety-critical constraint systems.\n\nHigh-quality codegen systems also include policy review gates. Before accepting a new attribute form, reviewers should verify that generated checks remain readable, failure messages remain actionable, et runtime evaluation remains deterministic. If a feature adds complexity without measurable safety benefit, it should be postponed. This keeps DSL scope disciplined et avoids turning safety tooling into a maintenance burden. Teams can further strengthen this avec compatibility suites that replay historical DSL inputs against new parsers et compare outputs byte-pour-byte. When differences appear, release notes should explain why behavior changed et how downstream users should adapt. This level of rigor is what allows macro-style tooling to scale safely in long-lived Rust ecosystems.\n\nA short policy checklist attached to pull requests keeps these reviews consistent et lowers the chance of accidental safety regressions. Include parser compatibility checks, generated diff review, et runtime validation signoff in every checklist.\n",
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
        "title": "Compte Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, et publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
            "content": "Parse mini-DSL constraints into deterministic AST nodes.",
            "duration": "40 min",
            "hints": [
              "Parse mini DSL lines into typed AST nodes.",
              "Support signer, mut, owner, et has_one forms."
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
              "Evaluate generated constraints against sample compte state.",
              "Return deterministic failure reasons."
            ]
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
            "content": "Export deterministic markdown safety report from generated checks.",
            "duration": "45 min",
            "hints": [
              "Render a deterministic markdown report from generated check results.",
              "Include status et explicit failure details."
            ]
          }
        }
      }
    }
  },
  "anchor-upgrades-migrations": {
    "title": "Anchor Upgrades & Compte Migrations",
    "description": "Conception production-safe Anchor release workflows avec deterministic migration planning, upgrade gates, rollback playbooks, et readiness evidence.",
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
        "description": "Authority lifecycle, compte versioning strategy, et deterministic upgrade risk modeling pour Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
            "content": "# Upgrade authority lifecycle in Anchor programs\n\nAnchor makes instruction development easier, but upgrade safety still depends on disciplined control of program authority. In production Solana systems, most upgrade incidents are not caused by syntax bugs. They come from process mistakes: wrong key management, unclear release ownership, et missing checks between build artifacts et deployed programdata. This lecon teaches a pratique lifecycle model that maps directly to how Anchor programs are deployed et governed.\n\nStart avec a strict authority model. Define who can sign upgrades et under which conditions. A single hot portefeuille is not acceptable pour mature systems. Typical setups use a multisig or gouvernance path to approve artifacts, then a controlled signer to perform deploiement. The important point is determinism: the same release decision should produce the same auditable evidence each time. That includes artifact hash, release tag, authority signers, et rollback policy. If your team cannot reconstruct those facts after a deploy, your process is too weak.\n\nNext, treat build reproducibility as a first-class requirement. You should compare the expected binary hash against programdata hash before et after deploiement in your pipeline simulation. Even when this cours stays deterministic et does not hit RPC, the policy should model hash matching as a gate. If the hash mismatch flag is true, the release is blocked. This simple rule prevents one of the most expensive failure classes: thinking you shipped one artifact while another artifact is actually live.\n\nAuthority transition rules matter too. Some protocols intentionally revoke upgrade authority after a stabilization window. Others keep authority but require gouvernance timelocks et emergency pause conditions. Neither is universally correct. The key is consistency avec explicit trigger conditions. If you revoke authority too early, you lose the ability to patch critical bugs. If you never constrain authority, users cannot trust immutability promises. Anchor does not solve this gouvernance tradeoff pour you; it only provides the program framework.\n\nRelease communication is part of securite. Users et integrators need predictable language about what changed et whether state migration is required. Pour example, if you add new compte fields but keep backward decoding compatibility, your report should say migration is optional pour old comptes et mandatory pour new writes after a certain slot range. If compatibility breaks, the report must include exact batch strategy et downtime expectations. Ambiguous language creates support load et increases operational risk.\n\nFinally, conception your release pipeline pour deterministic dry runs. Simulate migration steps, validation checks, et report generation locally. The goal is to eliminate unforced errors before any transaction is signed. A deterministic runbook is not bureaucracy; it is what keeps urgent releases calm et reviewable.\n\n## Operator mindset\n\nAnchor upgrades are operations work avec cryptographic consequences. Authority controls, migration sequencing, et rollback criteria should be treated as release contracts, not informal habits.\n\n\nThis lecon should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures pour each upgrade class: schema-only changes, instruction behavior changes, et authority changes. Pour every class, capture expected artifacts et compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, et what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document avec explicit slot windows, RPC provider failover plan, et support messaging templates. If a release is paused, the plan should already define whether to retry avec the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown et stable JSON, teams avoid panic changes during incidents et can audit exactly what happened after the fact. The same approach improves onboarding: new engineers apprenez from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define clear authority ownership et approval flow.\n- Require artifact hash match before rollout.\n- Document authority transition et rollback policy.\n- Publish migration impact in deterministic report fields.\n- Block releases when dry-run evidence is missing.\n",
            "duration": "55 min",
            "blocks": [
              {
                "type": "quiz",
                "id": "aum-v2-l1-quiz",
                "title": "Concept Check",
                "questions": [
                  {
                    "id": "aum-v2-l1-q1",
                    "prompt": "What is the most defensible release gate before deploiement?",
                    "options": [
                      "Compare approved build hash to expected programdata hash policy input",
                      "Ship quickly et validate hash later",
                      "Rely on signer memory without written report"
                    ],
                    "answerIndex": 0,
                    "explanation": "Hash matching is a deterministic control that prevents artifact drift during deploiement."
                  },
                  {
                    "id": "aum-v2-l1-q2",
                    "prompt": "Why is release communication part of upgrade safety?",
                    "options": [
                      "Integrators need exact migration impact et timing to avoid operational errors",
                      "Because Anchor automatically writes support tickets",
                      "Because all upgrades are backward compatible"
                    ],
                    "answerIndex": 0,
                    "explanation": "Unclear upgrade messaging causes integration mistakes et user-facing incidents."
                  }
                ]
              }
            ]
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Compte versioning et migration strategy",
            "content": "# Compte versioning et migration strategy\n\nSolana comptes are long-lived state containers, so program upgrades must respect historical data. In Anchor, adding or changing compte fields can be safe, risky, or catastrophic depending on how version markers, discriminators, et decode logic are handled. This lecon focuses on migration planning that is deterministic, testable, et production-oriented.\n\nThe first rule is explicit version markers. Do not infer schema version from compte size alone because reallocations et optional fields can make that ambiguous. Include a version field et define what each version guarantees. Your migration planner can then segment compte ranges by version et apply deterministic transforms. Without explicit markers, teams often guess state shape et ship brittle one-off scripts.\n\nSecond, separate compatibility mode from migration mode. Compatibility mode means new code can read old et new versions while writes may still target old shape pour a transition period. Migration mode means writes are frozen or routed through upgrade-safe paths while compte batches are rewritten. Both modes are valid, but mixing them without clear boundaries creates partial state et broken assumptions.\n\nBatching is a pratique necessity. Large protocols cannot migrate every compte in one transaction or one slot. Your plan should define batch size, ordering, et integrity checks. Pour example, process compte indexes in deterministic ascending order et verify expected post-migration invariants after each batch. If a batch fails, rerun exactly that batch avec idempotent logic. Deterministic batch identifiers make this auditable et easier to recover.\n\nPlan pour dry-run et rollback before execution. A migration plan should include prepare, migrate, verify, et finalize steps avec explicit criteria. Prepare can freeze new writes et snapshot baseline metrics. Verify can compare counts by version et check critical invariants. Finalize can re-enable writes et publish a signed report. Rollback should be defined as a separate branch, not improvised during incident pressure.\n\nAnchor adds value here through typed compte contexts et constraints, but migrations still require careful data engineering. Pour every changed compte type, maintain deterministic test fixtures: old bytes, expected new bytes, et expected structured decode output. This catches layout regressions early et builds confidence when migrating real state.\n\nTreat migration metrics as product metrics too. Users care about downtime, failed actions, et consistency across clients. If migration affects read paths, expose status in UX so users understand what is happening. Reliable migrations are as much about communication et orchestration as they are about code.\n\n\nThis lecon should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures pour each upgrade class: schema-only changes, instruction behavior changes, et authority changes. Pour every class, capture expected artifacts et compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, et what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document avec explicit slot windows, RPC provider failover plan, et support messaging templates. If a release is paused, the plan should already define whether to retry avec the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown et stable JSON, teams avoid panic changes during incidents et can audit exactly what happened after the fact. The same approach improves onboarding: new engineers apprenez from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use explicit version markers in compte data.\n- Define compatibility et migration modes separately.\n- Migrate in deterministic batches avec idempotent retries.\n- Keep dry-run fixtures pour byte-level et structured outputs.\n- Publish migration status et completion evidence.\n",
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
                    "note": "Freeze writes before touching compte schema."
                  },
                  {
                    "cmd": "migrate --batch=3 --range=2000-2999 --target=v3",
                    "output": "status=ok migrated=1000 failed=0",
                    "note": "Batch IDs are deterministic et replayable."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
            "content": "# Explorer: upgrade risk matrix\n\nA useful upgrade explorer should show cause-et-effect between release inputs et safety outcomes. If a flag changes, engineers should immediately see how severity et readiness changes. This lecon teaches how to build et read a deterministic risk matrix pour Anchor upgrades.\n\nThe matrix starts avec five high-signal inputs: upgrade authority present, program hash match, IDL breaking changes count, migration backfill completion, et dry-run pass status. These cover gouvernance, artifact integrity, compatibility risk, data readiness, et execution readiness. They are not exhaustive, but they are enough to prevent most avoidable mistakes.\n\nEach matrix row represents a release candidate state. Pour every row, compute issue codes et severity levels in stable order. Stable ordering is not cosmetic; it allows exact output comparisons in CI et easy diff review in pull requests. If issue ordering changes between commits without policy changes, you know something in implementation drifted.\n\nSeverity calibration should be conservative. Missing upgrade authority, hash mismatch, et failed dry run are high severity because they directly block safe rollout. Incomplete backfill et IDL breaking changes are usually medium severity: sometimes resolvable avec migration notes et staged release windows, but still risky if ignored.\n\nThe explorer should also teach false confidence patterns. Pour example, a release avec zero IDL changes can still be unsafe if program hash does not match approved artifact. Conversely, a release avec breaking changes can still be safe if migration plan is complete, compatibility notes are clear, et rollout is staged avec monitoring. Risk is contextual; deterministic policy helps avoid emotional decisions.\n\nFrom a workflow perspective, the matrix output should feed both engineering et support. Engineering uses JSON pour machine checks et gating. Support uses markdown summary to communicate whether release is ready, delayed, or blocked et why. If these outputs disagree, your generation path is wrong. Use one canonical payload et derive both formats.\n\nFinally, integrate the explorer into code review. Require reviewers to reference matrix output pour each release PR. This keeps decisions anchored in explicit evidence rather than implicit trust in deploiement scripts.\n\n\nThis lecon should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures pour each upgrade class: schema-only changes, instruction behavior changes, et authority changes. Pour every class, capture expected artifacts et compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, et what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document avec explicit slot windows, RPC provider failover plan, et support messaging templates. If a release is paused, the plan should already define whether to retry avec the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown et stable JSON, teams avoid panic changes during incidents et can audit exactly what happened after the fact. The same approach improves onboarding: new engineers apprenez from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Use a canonical risk payload avec stable ordering.\n- Mark authority/hash/dry-run failures as blocking.\n- Keep JSON et markdown generated from one source.\n- Validate matrix behavior avec deterministic fixtures.\n- Treat explorer output as part of PR review evidence.\n",
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
            "content": "Implement deterministic migration planning output: fromVersion, toVersion, totalBatches, et requiresMigration.",
            "duration": "40 min",
            "hints": [
              "Use Math.ceil(accountCount / batchSize) pour deterministic batch count.",
              "requiresMigration should be true only when toVersion > fromVersion.",
              "Return only stable scalar fields pour exact JSON comparisons."
            ]
          }
        }
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, et deterministic readiness artifacts pour controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
            "content": "Implement deterministic blocking issue checks pour authority, artifact hash, et dry-run status.",
            "duration": "40 min",
            "hints": [
              "Treat missing authority, hash mismatch, et failed dry run as blocking issues.",
              "Return issueCount plus ordered issue code array.",
              "Keep order stable to make report diffs deterministic."
            ]
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy et incident playbooks",
            "content": "# Rollback strategy et incident playbooks\n\nEven strong upgrade plans can encounter surprises: incompatible downstream clients, unexpected compte edge cases, or release pipeline mistakes. Teams that recover quickly are the ones that predefine rollback et incident playbooks before any deploiement begins. This lecon covers pragmatic rollback conception pour Anchor-based systems.\n\nRollback starts avec explicit trigger conditions. Do not wait pour subjective debate during an incident. Define measurable triggers such as failure rate thresholds, migration error counts, or critical invariant violations. Once trigger conditions are met, the system should move into a known response mode: pause writes, stop new migration batches, et publish incident status.\n\nA common mistake is assuming rollback always means restoring old binary immediately. Sometimes that is correct; other times it can worsen state divergence if partial migrations already wrote new version markers. Your playbook should classify failure phase: pre-migration, mid-migration, or post-finalization. Each phase has different safest actions. Mid-migration incidents often require completing compensating transforms before binary rollback.\n\nAnchor compte constraints help protect invariant boundaries, but they do not orchestrate recovery sequencing. You still need deterministic tooling pour affected compte identification, reprocessing queues, et reconciliation summaries. Keep these tools pure et replayable where possible. If logic cannot be replayed, incident analysis becomes guesswork.\n\nCommunication is part of rollback. Engineering, support, et partner teams should consume the same deterministic report fields: release tag, rollback trigger, impacted batch ranges, current mitigation status, et next checkpoint time. Avoid free-form updates that diverge across channels.\n\nPost-incident learning must be concrete. Pour each incident, add one or more deterministic fixtures reproducing the decision path that failed. Update policy functions et confirm that the new fixtures prevent recurrence. This is how reliability improves release after release.\n\nFinally, distinguish between emergency stop controls et full rollback procedures. Emergency stop is pour immediate blast radius reduction. Full rollback or forward-fix decisions can come after state assessment. Blending these concepts causes rushed mistakes.\n\n\nThis lecon should become part of a release gate, not informal knowledge. Teams should keep deterministic fixtures pour each upgrade class: schema-only changes, instruction behavior changes, et authority changes. Pour every class, capture expected artifacts et compare those exact artifacts on pull requests. Include who approved migration logic, which constraints changed, et what rollback trigger would stop rollout. Mature Solana teams also keep a release timeline document avec explicit slot windows, RPC provider failover plan, et support messaging templates. If a release is paused, the plan should already define whether to retry avec the same artifact, revert authority settings, or perform a compensating migration. By preserving this in deterministic markdown et stable JSON, teams avoid panic changes during incidents et can audit exactly what happened after the fact. The same approach improves onboarding: new engineers apprenez from concrete evidence trails instead of tribal memory.\n\n## Checklist\n- Define measurable rollback triggers in advance.\n- Classify incident phase before selecting response path.\n- Keep recovery tooling replayable et deterministic.\n- Share one canonical incident report format.\n- Add regression fixtures after every rollback event.\n",
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
                      "Enter defined response mode: pause risky actions et publish status",
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
                    "explanation": "Incident fixtures turn lecons into enforceable regression tests."
                  }
                ]
              }
            ]
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
            "content": "Generate deterministic markdown from releaseTag, totalBatches, et issueCount.",
            "duration": "35 min",
            "hints": [
              "Keep line ordering et punctuation stable.",
              "Use bullet list fields pour releaseTag, totalBatches, et issueCount.",
              "Return plain markdown string without trailing spaces."
            ]
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
            "content": "Produce the final deterministic checkpoint artifact avec release tag, readiness flag, et migration batch count.",
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
    "title": "Reliability Engineering pour Solana",
    "description": "Production-focused reliability engineering pour Solana systems: fault tolerance, retries, deadlines, circuit breakers, et graceful degradation avec measurable operational outcomes.",
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
        "description": "Implement fault-tolerance building blocks avec clear failure classification, retry boundaries, et deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
            "content": "Fault tolerance in Solana systems is not just about catching errors. It is about deciding which failures are safe to retry, which should fail fast, et how to preserve user trust while doing both.\n\nA pratique reliability model starts avec failure classes:\n1) transient failures (timeouts, temporary RPC unavailability),\n2) persistent external failures (rate limits, prolonged endpoint degradation),\n3) deterministic business failures (invalid input, invariant violations).\n\nTransient failures may justify bounded retries avec backoff. Deterministic business failures should not be retried because retries only add latency et load. Persistent external failures often require fallback endpoints, degraded features, or temporary protection modes.\n\nIn Solana workflows, reliability is tightly coupled to freshness constraints. A request can be logically valid but still fail if supporting state has shifted (pour example stale quote windows or expired blockhash contexts in client workflows). Reliable systems therefore combine retry logic avec freshness checks et clear abort conditions.\n\nDefensive engineering means defining policies explicitly:\n- maximum retry count,\n- per-attempt timeout,\n- total deadline budget,\n- fallback behavior after budget exhaustion,\n- user-facing messaging pour each failure class.\n\nWithout explicit budgets, systems drift into infinite retry loops or fail too early. Avec explicit budgets, behavior is predictable et testable.\n\nPour production teams, observability is mandatory. Every failed operation should include a deterministic reason code et context fields (attempt number, endpoint, elapsed time, policy branch). This turns reliability from guesswork into measurable behavior.\n\nReliable systems do not promise zero failures. They promise controlled failure behavior: bounded latency, clear outcomes, et safe degradation under stress.",
            "duration": "45 min"
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
            "content": "Implement an exponential backoff retry mechanism pour handling transient failures.",
            "duration": "45 min",
            "hints": [
              "Use match on the BackoffStrategy enum to handle each case",
              "Pour exponential backoff, use 2_u64.pow(attempt) to calculate the multiplier",
              "should_retry simply checks if attempt is less than max_attempts"
            ]
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
            "content": "Implement a deadline management system to enforce time limits on operations.",
            "duration": "45 min",
            "hints": [
              "Store the absolute expiration timestamp in the Deadline struct",
              "Pour time_remaining, subtract current_time from deadline timestamp if not expired",
              "Pour extend_deadline, calculate the new timestamp et check against max allowed"
            ]
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
            "content": "Implement a fallback mechanism that provides alternative execution paths when primary operations fail.",
            "duration": "45 min",
            "hints": [
              "Call the primary function first et check if it returns Some",
              "Only call fallback if primary returns None",
              "Pour retry, loop max_retries times trying primary before falling back"
            ]
          }
        }
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, et rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
            "content": "Resilience patterns are controls that prevent localized failures from becoming system-wide incidents. On Solana integrations, they are especially important because provider health can change quickly under bursty network conditions.\n\nCircuit breaker pattern:\n- closed: normal operation,\n- open: block requests after repeated failures,\n- half-open: probe recovery avec controlled trial requests.\n\nA good breaker uses deterministic thresholds et cooldowns, not ad hoc toggles. It should expose state transitions pour monitoring et post-incident review.\n\nBulkhead pattern isolates resource pools so one failing workflow (pour example expensive quote refresh loops) cannot starve unrelated workflows (like portfolio reads).\n\nRate limiting controls outbound pressure to providers. Proper limits reduce 429 storms et improve overall success rate. Token-bucket strategies are useful because they allow short bursts while preserving long-term bounds.\n\nThese patterns should be coordinated, not layered blindly. Pour example, aggressive retries plus weak rate limiting can bypass the intent of a circuit breaker. Policy composition must be reviewed end-to-end.\n\nA mature resilience stack includes:\n- deterministic policy config,\n- simulation fixtures pour calm vs stressed traffic,\n- dashboard visibility pour breaker states et reject reasons,\n- explicit user copy pour degraded mode.\n\nResilience is successful when users experience predictable service quality under failure, not when systems appear perfect in ideal conditions.",
            "duration": "45 min"
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
            "content": "Implement a circuit breaker pattern that opens after consecutive failures et closes after a recovery period.",
            "duration": "45 min",
            "hints": [
              "In can_execute, check if recovery timeout has passed pour Open state",
              "record_success should reset everything to Closed state",
              "record_failure increments count et opens circuit when threshold is reached"
            ]
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
            "content": "Implement a token bucket rate limiter pour controlling request rates.",
            "duration": "45 min",
            "hints": [
              "Always refill before checking if consumption is possible",
              "Calculate elapsed time et multiply by refill rate to get tokens to add",
              "Use min() to ensure tokens don't exceed capacity"
            ]
          },
          "lesson-10-2-4": {
            "title": "Error Classifier Challenge",
            "content": "Implement an error classification system to determine if errors are retryable.",
            "duration": "45 min",
            "hints": [
              "Use match avec range patterns (1000..=1999) to classify",
              "should_retry can use matches! macro or match on classify result",
              "batch_classify can use iter().map().collect() pattern"
            ]
          }
        }
      }
    }
  },
  "solana-testing-strategies": {
    "title": "Tests Strategies pour Solana",
    "description": "Comprehensive, production-oriented tests strategy pour Solana: deterministic unit tests, realistic integration tests, fuzz/property tests, et release-confidence reporting.",
    "duration": "5 weeks",
    "tags": [
      "testing",
      "quality-assurance",
      "fuzzing",
      "property-testing"
    ],
    "modules": {
      "mod-11-1": {
        "title": "Unit et Integration Tests",
        "description": "Build deterministic unit et integration tests layers avec clear ownership of invariants, fixtures, et failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Tests Fundamentals",
            "content": "Tests Solana systems effectively requires layered confidence, not one giant test suite.\n\nUnit tests validate pure logic: math, state transitions, et invariant checks. They should be fast, deterministic, et run on every change.\n\nIntegration tests validate component wiring: modele de compteing, instruction construction, et cross-module behavior under realistic inputs. They should catch schema drift et boundary errors that unit tests miss.\n\nA pratique test pyramid pour Solana work:\n1) deterministic unit tests (broadest coverage),\n2) deterministic integration tests (targeted workflow coverage),\n3) environment-dependent checks (smaller set, higher cost).\n\nCommon failure in teams is over-reliance on environment-dependent tests while neglecting deterministic core checks. This creates flaky CI et weak debugging signals.\n\nGood test conception principles:\n- explicit fixture ownership,\n- stable expected outputs,\n- structured error assertions (not only success assertions),\n- regression fixtures pour previously discovered bugs.\n\nPour production readiness, test outputs should be easy to audit. Summaries should include pass/fail counts by category, failing invariant IDs, et deterministic reproduction inputs.\n\nTests is not just correctness verification; it is an operational communication tool. Strong test artifacts make release decisions clearer et incident response faster.",
            "duration": "45 min"
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
            "content": "Implement a test assertion framework pour verifying program state.",
            "duration": "45 min",
            "hints": [
              "Compare actual vs expected values et return appropriate Result",
              "Use format! to create descriptive error messages",
              "Return Ok(()) pour success cases"
            ]
          },
          "lesson-11-1-3": {
            "title": "Mock Compte Generator Challenge",
            "content": "Create a mock compte generator pour tests avec configurable parameters.",
            "duration": "45 min",
            "hints": [
              "Use vec![0; size] to create zero-filled data of specified size",
              "Pour generate_with_lamports, use default values pour other fields",
              "Signer comptes typically have is_writable set to true"
            ]
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
            "content": "Build a test scenario builder pour setting up complex test environments.",
            "duration": "45 min",
            "hints": [
              "Use builder pattern avec self return type pour chaining",
              "Push strings into vectors (use to_string() to convert &str)",
              "build() consumes self et creates the final TestScenario"
            ]
          }
        }
      },
      "mod-11-2": {
        "title": "Avance Tests Techniques",
        "description": "Use fuzzing, property-based tests, et mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing et Property Tests",
            "content": "Avance tests techniques uncover failures that example-based tests rarely find.\n\nFuzzing explores broad random input space to trigger parser edge cases, boundary overflows, et unexpected state combinations. It is especially useful pour serialization, decoding, et input validation layers.\n\nProperty-based tests defines invariants that must hold across many generated inputs. Instead of asserting one output, you assert a rule (pour example: balances never become negative, or decoded-then-encoded payload remains stable).\n\nMutation-style thinking strengthens this further: intentionally alter assumptions et verify tests fail as expected. If tests still pass after a harmful change, coverage is weaker than it appears.\n\nTo keep avance tests pratique:\n- use deterministic seeds in CI pour reproducibility,\n- store failing cases as permanent regression fixtures,\n- separate heavy campaigns from per-commit fast checks.\n\nAvance tests are most valuable when tied to explicit risk categories. Map each category (serialization safety, invariant consistency, edge-case arithmetic) to at least one dedicated property or fuzz campaign.\n\nTeams that treat fuzz/property failures as first-class release blockers catch subtle defects earlier et reduce high-severity production incidents.",
            "duration": "45 min"
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
            "content": "Implement a fuzz input generator pour tests avec random data.",
            "duration": "45 min",
            "hints": [
              "Use wrapping_mul et wrapping_add pour LCG to avoid overflow panics",
              "Generate bytes by taking random % 256",
              "Pour bounded generation, calculate range et add to min"
            ]
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
            "content": "Implement a property verifier that checks invariants hold across operations.",
            "duration": "45 min",
            "hints": [
              "Pour commutative, call op both ways et compare",
              "Pour associative, nest the calls differently et compare",
              "Pour non_decreasing, iterate through pairs et check ordering"
            ]
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
            "content": "Implement a boundary value analyzer pour identifying edge cases.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub et saturating_add to avoid overflow",
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
    "description": "Engineer production-grade Solana performance: compute budgeting, compte layout efficiency, memory/rent tradeoffs, et deterministic optimization workflows.",
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
        "description": "Optimize compute-heavy paths avec explicit CU budgets, operation-level profiling, et predictable performance tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
            "content": "Compute units are the hard resource budget that shapes what your Solana program can do in a single transaction. Performance optimization starts by treating CU usage as a contract, not an afterthought.\n\nA reliable optimization loop is:\n1) measure baseline CU by operation type,\n2) identify dominant cost buckets (deserialization, hashing, loops, CPI fan-out),\n3) optimize one hotspot at a time,\n4) re-measure et keep only changes avec clear gains.\n\nCommon anti-patterns include optimizing cold paths, adding complexity without measurement, et ignoring compte-size side effects. In Solana systems, compute et compte conception are coupled: a larger compte can increase deserialization cost, which raises CU pressure.\n\nPour production teams, deterministic cost fixtures are crucial. They let you compare before/after behavior in CI et stop regressions early. Performance work is most useful when every claim is backed by reproducible evidence, not intuition.",
            "duration": "45 min"
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
            "content": "Implement a compute unit counter to estimate operation costs.",
            "duration": "45 min",
            "hints": [
              "Loop cost is overhead plus iterations times per-iteration cost",
              "Compte access is simply comptes multiplied by per-compte CU",
              "Apply safety margin by multiplying budget by the percentage"
            ]
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
            "content": "Optimize data structures pour minimal serialization overhead.",
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
              "Calculate available CUs after accounting pour overhead",
              "Use ceiling division: (n + d - 1) / d pour number of batches",
              "Total CU = (num_batches * overhead) + (items * per_item)"
            ]
          }
        }
      },
      "mod-12-2": {
        "title": "Memory et Storage Optimization",
        "description": "Conception memory/storage-efficient compte layouts avec rent-aware sizing, serialization discipline, et safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Compte Data Optimization",
            "content": "Compte data optimization is both a cost et correctness discipline. Poor layouts increase rent, slow parsing, et make migrations fragile.\n\nConception principles:\n- Keep hot fields compact et easy to parse.\n- Use fixed-size representations where possible.\n- Reserve growth strategy explicitly instead of ad hoc field expansion.\n- Separate frequently-mutated data from rarely-changed metadata when pratique.\n\nLayout decisions should be documented avec deterministic artifacts: field offsets, total bytes, et expected rent class. If a schema change increases compte size, reviewers should see the exact delta et migration implications.\n\nProduction optimization is not “smallest possible struct at any cost.” It is stable, readable, et migration-safe storage that keeps compute et rent budgets predictable over time.",
            "duration": "45 min"
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
            "content": "Implement a data packer that efficiently packs fields into compte data.",
            "duration": "45 min",
            "hints": [
              "Use to_le_bytes() to convert integers to bytes",
              "Use from_le_bytes() to convert bytes back to integers",
              "Alignment formula: if remainder, add (alignment - remainder)"
            ]
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
            "content": "Implement a rent calculator pour estimating compte storage costs.",
            "duration": "45 min",
            "hints": [
              "Annual rent is data size times lamports per byte per year",
              "Exemption threshold is annual rent times threshold years",
              "Check if balance is greater than or equal to minimum"
            ]
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
            "content": "Implement a zero-copy deserializer pour reading data without allocation.",
            "duration": "45 min",
            "hints": [
              "Use copy_from_slice to read fixed-size data into stack arrays",
              "Pour read_bytes, return a slice of the original data (zero-copy)",
              "Always advance offset after reading"
            ]
          }
        }
      }
    }
  },
  "solana-tokenomics-design": {
    "title": "Tokenomics Conception pour Solana",
    "description": "Conception robust Solana token economies avec distribution discipline, vesting safety, staking incentives, et gouvernance mechanics that remain operationally defensible.",
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
        "title": "Token Distribution et Vesting",
        "description": "Model token allocation et vesting systems avec explicit fairness, unlock predictability, et deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
            "content": "Token distribution is a securite et credibility decision, not just a spreadsheet exercise. Allocation et vesting rules shape long-term trust in the protocol.\n\nA strong distribution model answers:\n- who receives tokens et why,\n- when they unlock,\n- how unlock schedules affect circulating supply,\n- what controls prevent accidental over-distribution.\n\nVesting conception should be deterministic et auditable. Cliff et linear phases must produce reproducible release amounts pour any timestamp. Ambiguous rounding rules create disputes et operational risk.\n\nProduction teams should maintain allocation invariants in tests (pour example: total distributed <= total supply, per-bucket caps respected, no negative vesting balances). Tokenomics quality improves when economics et implementation are validated together.",
            "duration": "45 min"
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
            "content": "Implement a vesting schedule calculator avec cliff et linear release.",
            "duration": "45 min",
            "hints": [
              "Use saturating_sub to avoid underflow when calculating elapsed time",
              "Pour linear vesting, use u128 pour intermediaire calculation to avoid overflow",
              "Releasable is simply vested minus already released"
            ]
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
            "content": "Implement a token allocation distributor pour managing different stakeholder groups.",
            "duration": "45 min",
            "hints": [
              "Use iter().map().sum() to calculate total percentage",
              "Use u128 pour percentage calculation to avoid overflow",
              "Use find() to locate allocation by recipient"
            ]
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
            "content": "Generate a complete release schedule avec dates et amounts.",
            "duration": "45 min",
            "hints": [
              "Divide duration by intervals to get interval duration",
              "Use filter et sum to calculate total by timestamp",
              "Pour monthly, use 30 days * 24 hours * 60 minutes * 60 seconds"
            ]
          }
        }
      },
      "mod-13-2": {
        "title": "Staking et Gouvernance",
        "description": "Conception staking et gouvernance mechanics avec clear incentive alignment, anti-manipulation constraints, et measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking et Gouvernance Conception",
            "content": "Staking et gouvernance systems must balance participation incentives avec manipulation resistance. Rewarding lock behavior is useful, but poorly tuned models can over-concentrate influence.\n\nCore conception questions:\n1) How is staking reward rate set et adjusted?\n2) How is voting power calculated (raw balance, delegated balance, time-weighted)?\n3) What prevents short-term gouvernance capture?\n\nGouvernance math should be transparent et deterministic so users can verify voting outcomes independently. If power calculations are opaque or inconsistent, gouvernance trust collapses quickly.\n\nOperationally, track gouvernance health metrics: voter participation, delegation concentration, proposal pass patterns, et inactive stake ratios. Tokenomics is successful only when on-chain incentive behavior matches intended gouvernance outcomes.",
            "duration": "45 min"
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
            "content": "Implement a staking rewards calculator avec compounding.",
            "duration": "45 min",
            "hints": [
              "Use compound interest formula: A = P(1 + r/n)^(nt)",
              "Convert basis points to decimal by dividing by 10000",
              "Pour days to target, use logarithms to solve pour time"
            ]
          },
          "lesson-13-2-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Implement a voting power calculator avec delegation support.",
            "duration": "45 min",
            "hints": [
              "If delegated_to is Some, voting power is 0 (they gave it away)",
              "Use filter to find voters who delegated to a specific address",
              "Sum staked amounts to calculate delegated power"
            ]
          },
          "lesson-13-2-4": {
            "title": "Proposal Threshold Calculator Challenge",
            "content": "Implement a proposal threshold calculator pour gouvernance.",
            "duration": "45 min",
            "hints": [
              "Convert basis points to amount: (supply * bps) / 10000",
              "Use u128 pour intermediaire calculation to avoid overflow",
              "Proposal passes if quorum met ET more pour than against"
            ]
          }
        }
      }
    }
  },
  "solana-defi-primitives": {
    "title": "DeFi Primitives on Solana",
    "description": "Build pratique Solana DeFi foundations: AMM mechanics, liquidity accounting, lending primitives, et flash-loan-safe composition patterns.",
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
        "title": "AMM et Liquidity",
        "description": "Implement AMM et liquidity primitives avec deterministic math, slippage-aware outputs, et LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
            "content": "AMM fundamentals are simple in formula but subtle in implementation quality. The invariant math must be deterministic, fee handling explicit, et rounding behavior consistent across paths.\n\nPour constant-product pools, route quality is determined by output-at-size, not headline spot price. Larger trades move further on the curve et experience stronger impact, so quote logic must be size-aware.\n\nLiquidity accounting must also be exact: LP shares, fee accrual, et pool reserve updates should remain internally consistent under repeated swaps et edge-case sizes.\n\nProduction DeFi teams treat AMM math as critical infrastructure. They use fixed fixtures pour swap-in/swap-out cases, boundary amounts, et fee tiers so regressions are caught before deploiement.",
            "duration": "45 min"
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
            "content": "Implement a constant product AMM pour token swaps.",
            "duration": "45 min",
            "hints": [
              "Use u128 pour intermediaire calculations to prevent overflow",
              "Apply fee by multiplying by (10000 - fee_bps) / 10000",
              "Slippage is (price_before - effective_price) / price_before"
            ]
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
            "content": "Calculate LP token minting et rewards pour liquidity providers.",
            "duration": "45 min",
            "hints": [
              "Pour first liquidity, use sqrt(a * b) as LP tokens",
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
        "title": "Lending et Flash Loans",
        "description": "Model lending et flash-loan flows avec collateral safety, utilization-aware pricing, et strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
            "content": "Lending primitives et flash-loan logic are powerful but unforgiving. Safety depends on strict collateral valuation, clear LTV/threshold rules, et deterministic repayment checks.\n\nA pratique lending model should define:\n- collateral valuation source et freshness policy,\n- borrow limits et liquidation thresholds,\n- utilization-based rate behavior,\n- liquidation et bad-debt handling paths.\n\nFlash loans add atomic constraints: borrowed amount plus fee must be repaid in the same transaction context. Any relaxation of this invariant introduces severe risk.\n\nComposable DeFi conception works when every primitive preserves local safety contracts while exposing clear interfaces pour higher-level orchestration.",
            "duration": "45 min"
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
            "content": "Implement collateral et borrowing power calculations.",
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
              "Use piecewise function pour borrow rate (below/above optimal)",
              "Supply rate comptes pour reserve factor taken by protocol"
            ]
          },
          "lesson-14-2-4": {
            "title": "Flash Loan Validateur Challenge",
            "content": "Implement flash loan validation logic.",
            "duration": "45 min",
            "hints": [
              "Fee is amount times fee_bps divided by 10000",
              "Total repay is principal plus fee",
              "Profit is gain minus fee (use i64 pour signed result)"
            ]
          }
        }
      }
    }
  },
  "solana-nft-standards": {
    "title": "NFT Standards on Solana",
    "description": "Implement Solana NFTs avec production-ready standards: metadata integrity, collection discipline, et avance programmable/non-transferable behaviors.",
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
        "description": "Build core NFT functionality avec standards-compliant metadata, collection verification, et deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
            "content": "NFT architecture on Solana combines token mechanics avec metadata et collection semantics. A correct implementation requires more than minting a token avec supply one.\n\nCore components include:\n- mint/state ownership correctness,\n- metadata integrity et schema consistency,\n- collection linkage et verification status,\n- transfer et authority policy clarity.\n\nProduction NFT systems should treat metadata as a contract. If fields drift or verification flags are inconsistent, marketplaces et portefeuilles may interpret assets differently.\n\nReliable implementations include deterministic validation pour metadata structure, creator share totals, collection references, et authority expectations. Standards compliance is what preserves interoperability.",
            "duration": "45 min"
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
            "content": "Parse et validate NFT metadata according to Metaplex standards.",
            "duration": "45 min",
            "hints": [
              "Check string lengths avec len() method",
              "Sum creator shares et verify equals 100",
              "Royalty is sale_price * fee_bps / 10000"
            ]
          },
          "lesson-15-1-3": {
            "title": "Collection Manager Challenge",
            "content": "Implement NFT collection management avec size tracking.",
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
              "Sort descending by score pour ranking (highest = rank 1)"
            ]
          }
        }
      },
      "mod-15-2": {
        "title": "Avance NFT Features",
        "description": "Implement avance NFT behaviors (soulbound et programmable flows) avec explicit policy controls et safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound et Programmable NFTs",
            "content": "Avance NFT features introduce policy complexity that must be explicit. Soulbound behavior, programmable restrictions, et dynamic metadata updates all expand failure surface.\n\nPour soulbound models, non-transferability must be enforced by clear rule paths, not UI assumptions. Pour programmable NFTs, update permissions et transition rules should be deterministic et auditable.\n\nDynamic NFT updates should include strong validation et event clarity so indexers et clients can track state changes correctly.\n\nAvance NFT engineering succeeds when flexibility is paired avec strict policy boundaries et transparent update behavior.",
            "duration": "45 min"
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validateur Challenge",
            "content": "Implement validation pour soulbound (non-transferable) tokens.",
            "duration": "45 min",
            "hints": [
              "Soulbound tokens return false pour can_transfer",
              "Burn requires is_burnable et owner == burner",
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
            "content": "Implement NFT composability pour equipping items to base NFTs.",
            "duration": "45 min",
            "hints": [
              "Check available slots, compatibility, et not already equipped",
              "Use position() et remove() to unequip items",
              "Filter equipped items by matching type in items list"
            ]
          }
        }
      }
    }
  },
  "solana-cpi-patterns": {
    "title": "Invocation Inter-Programme Patterns",
    "description": "Master CPI composition on Solana avec safe compte validation, PDA signer discipline, et deterministic multi-program orchestration patterns.",
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
        "description": "Build CPI fundamentals avec strict compte/signer checks, ownership validation, et safe PDA signing boundaries.",
        "lessons": {
          "lesson-16-1-1": {
            "title": "Invocation Inter-Programme Architecture",
            "content": "Invocation Inter-Programme (CPI) is where Solana composability becomes pratique et where many securite failures appear. The caller controls compte lists, so every CPI boundary must be treated as untrusted input.\n\nSafe CPI conception requires:\n- explicit compte identity et owner validation,\n- signer et writable scope minimization,\n- deterministic PDA derivation et signer-seed handling,\n- bounded assumptions about downstream program behavior.\n\ninvoke et invoke_signed are not interchangeable conveniences. invoke_signed should only be used when signer proof is truly required et seed recipes are canonical.\n\nProduction CPI reliability comes from repeatable guard patterns. If constraints vary handler to handler, reviewers cannot reason about securite consistently.",
            "duration": "45 min"
          },
          "lesson-16-1-2": {
            "title": "CPI Compte Validateur Challenge",
            "content": "Validate comptes pour Invocation Inter-Programmes.",
            "duration": "45 min",
            "hints": [
              "Check boolean flags pour signer et writable validation",
              "Pour balance, compare lamports against minimum required",
              "Privilege extension: if caller is signer, child can sign too"
            ]
          },
          "lesson-16-1-3": {
            "title": "PDA Signer Challenge",
            "content": "Implement PDA signing pour CPI operations.",
            "duration": "45 min",
            "hints": [
              "Convert string seeds to bytes using as_bytes()",
              "Simulate PDA finding by trying different bump values",
              "Signature simulation combines message et seed hashes"
            ]
          },
          "lesson-16-1-4": {
            "title": "Instruction Router Challenge",
            "content": "Implement an instruction router pour directing CPI calls.",
            "duration": "45 min",
            "hints": [
              "Use HashMap insert to register handlers",
              "Route by looking up instruction_type in handlers map",
              "create_cpi_call combines route avec compte preparation"
            ]
          }
        }
      },
      "mod-16-2": {
        "title": "Avance CPI Patterns",
        "description": "Compose avance multi-program flows avec atomicity awareness, consistency checks, et deterministic failure handling.",
        "lessons": {
          "lesson-16-2-1": {
            "title": "Multi-Program Composition",
            "content": "Multi-program composition introduces sequencing et consistency risk. Even when each CPI call is correct in isolation, combined flows can violate business invariants if ordering or rollback assumptions are weak.\n\nRobust composition patterns include:\n1) explicit stage boundaries,\n2) invariant checks between CPI steps,\n3) deterministic error classes pour partial-failure diagnosis,\n4) idempotent recovery paths where possible.\n\nPour complex operations (atomic swaps, flash-loan sequences), model expected preconditions et postconditions per stage. This keeps orchestration testable et prevents hidden state drift.\n\nCPI mastery is less about calling many programs et more about preserving correctness across program boundaries under adverse inputs.",
            "duration": "45 min"
          },
          "lesson-16-2-2": {
            "title": "Atomic Swap Orchestrator Challenge",
            "content": "Implement an atomic swap across multiple programs.",
            "duration": "45 min",
            "hints": [
              "Validate that steps is not empty et minimum_output > 0",
              "Atomicity requires output_token of step N equals input_token of step N+1",
              "Map steps to (program_id, input_token, expected_output) tuples"
            ]
          },
          "lesson-16-2-3": {
            "title": "State Consistency Validateur Challenge",
            "content": "Validate state consistency across multiple CPI calls.",
            "duration": "45 min",
            "hints": [
              "Clone comptes vector to create independent snapshot",
              "Pour no_changes, verify all changed comptes are in except list",
              "Compare balance et data_hash to detect changes"
            ]
          },
          "lesson-16-2-4": {
            "title": "Permissioned Invocation Challenge",
            "content": "Implement permission checks pour program invocations.",
            "duration": "45 min",
            "hints": [
              "Push permission into vector to register",
              "Use find() to locate permission pour program_id",
              "Use retain() to remove caller from allowed list"
            ]
          }
        }
      }
    }
  },
  "solana-mev-strategies": {
    "title": "MEV et Transaction Ordering",
    "description": "Production-focused transaction-ordering engineering on Solana: MEV-aware routing, bundle strategy, liquidation/arbitrage modeling, et user-protective execution controls.",
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
        "description": "Understand MEV mechanics et transaction ordering realities, then model opportunities et risks avec deterministic safety-aware policies.",
        "lessons": {
          "lesson-17-1-1": {
            "title": "MEV on Solana",
            "content": "Maximal Extractable Value (MEV) on Solana is fundamentally about transaction ordering under limited blockspace. Whether you are building trading tools, liquidation infrastructure, or user-facing apps, you need a realistic model of how ordering pressure changes outcomes.\n\nKey Solana-specific context:\n- ordering can be influenced by priority fees et relay/bundle paths,\n- opportunities are short-lived et highly competitive,\n- failed or delayed execution can convert expected profit into loss.\n\nA mature MEV approach begins avec classification:\n1) opportunity class (arbitrage, liquidation, backrun-style sequencing),\n2) dependency class (single-hop vs multi-hop, oracle-sensitive vs pool-state-sensitive),\n3) risk class (staleness, fill failure, adverse movement, execution contention).\n\nPour production systems, raw opportunity detection is not enough. You need deterministic filters that reject fragile setups: stale quotes, weak depth, or excessive path complexity relative to expected edge.\n\nMost operational failures come from execution assumptions, not math. Teams should model inclusion probability, fallback paths, et cancellation thresholds explicitly.\n\nUser-protective conception matters even pour avance orderflow systems. Clear policy around slippage limits, quote freshness, et failure reporting prevents silent value leakage et reduces support incidents.",
            "duration": "45 min"
          },
          "lesson-17-1-2": {
            "title": "Arbitrage Opportunity Detector Challenge",
            "content": "Detect arbitrage opportunities across DEXes.",
            "duration": "45 min",
            "hints": [
              "Compare all pairs of DEX prices pour same token pair",
              "Profit percent is (sell - buy) / buy * 100",
              "Use max_by to find best opportunity"
            ]
          },
          "lesson-17-1-3": {
            "title": "Liquidation Opportunity Finder Challenge",
            "content": "Find undercollateralized positions pour liquidation.",
            "duration": "45 min",
            "hints": [
              "Position is liquidatable when borrowed > threshold * collateral_value",
              "Calculate collateral value using price (avec 6 decimals)",
              "Liquidation profit is bonus percentage of collateral value"
            ]
          },
          "lesson-17-1-4": {
            "title": "Priority Fee Calculator Challenge",
            "content": "Calculate optimal priority fees pour transaction ordering.",
            "duration": "45 min",
            "hints": [
              "Urgency factor scales the base fee",
              "Execution probability decreases as more fees are higher",
              "Total cost includes priority fee, base, et compute unit cost"
            ]
          }
        }
      },
      "mod-17-2": {
        "title": "Avance MEV Strategies",
        "description": "Conception avance ordering/bundle strategies avec explicit risk controls, failure handling, et user-impact guardrails.",
        "lessons": {
          "lesson-17-2-1": {
            "title": "Avance MEV Techniques",
            "content": "Avance transaction-ordering strategies require disciplined orchestration, not just faster opportunity scans.\n\nBundle-oriented execution is valuable because it can express dependency sets et all-or-nothing intent, but bundle conception must include:\n- strict preconditions,\n- deterministic abort rules,\n- replay-safe identifiers,\n- post-execution reconciliation.\n\nWhen strategy complexity increases (multi-hop paths, conditional liquidations), failure modes multiply: partial fills, stale assumptions, et contention spikes. A robust system ranks candidates by expected net value after execution risk, not gross theoretical edge.\n\nOperational controls should include:\n1) bounded retries avec fresh-state checks,\n2) confidence scoring pour each candidate,\n3) kill-switch thresholds pour abnormal failure streaks,\n4) deterministic run reports pour incident replay.\n\nAvance MEV tooling is successful when it is both profitable et controllable. Deterministic artifacts (decision inputs, chosen path, reason codes) are what make that control real in production.",
            "duration": "45 min"
          },
          "lesson-17-2-2": {
            "title": "Bundle Composer Challenge",
            "content": "Compose transaction bundles pour atomic MEV extraction.",
            "duration": "45 min",
            "hints": [
              "Tip is percentage of total profit",
              "Bundle is profitable if profit exceeds tip",
              "Sort by priority fee descending pour optimal ordering"
            ]
          },
          "lesson-17-2-3": {
            "title": "Multi-Hop Arbitrage Finder Challenge",
            "content": "Find multi-hop arbitrage paths across token pairs.",
            "duration": "45 min",
            "hints": [
              "Use constant product formula avec fee pour output calculation",
              "Two-hop arbitrage goes A -> B -> A through different pools",
              "Profit is final output minus initial input"
            ]
          },
          "lesson-17-2-4": {
            "title": "MEV Simulation Engine Challenge",
            "content": "Simulate MEV extraction to estimate profitability.",
            "duration": "45 min",
            "hints": [
              "Apply slippage to both buy (increase) et sell (decrease) prices",
              "Risk score combines failure rate, profit negativity, et capital",
              "Expected value weights profit by success probability"
            ]
          }
        }
      }
    }
  },
  "solana-deployment-cicd": {
    "title": "Program Deploiement et CI/CD",
    "description": "Production deploiement engineering pour Solana programs: environment strategy, release gating, CI/CD quality controls, et upgrade-safe operational workflows.",
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
        "title": "Deploiement Fundamentals",
        "description": "Model environment-specific deploiement behavior avec deterministic configs, artifact checks, et release preflight validation.",
        "lessons": {
          "lesson-18-1-1": {
            "title": "Solana Deploiement Environments",
            "content": "Solana deploiement is not one command; it is a release system avec environment-specific risk. Localnet, devnet, et mainnet each serve different validation goals, et production quality depends on using them intentionally.\n\nA reliable deploiement workflow defines:\n1) environment purpose et promotion criteria,\n2) deterministic config sources,\n3) artifact identity checks,\n4) rollback triggers.\n\nCommon failure patterns include mismatched program IDs, inconsistent config between environments, et unverified artifact drift between build et deploy. These are process issues that tooling should prevent.\n\nPreflight checks should be mandatory:\n- expected network et signer identity,\n- build artifact hash,\n- program size et upgrade constraints,\n- required compte/address assumptions.\n\nEnvironment promotion should be evidence-driven. Passing local tests alone is not enough pour mainnet readiness; devnet/staging behavior must confirm operational assumptions under realistic RPC et timing conditions.\n\nDeploiement maturity is measured by reproducibility. If another engineer cannot replay the release inputs et get the same artifact et checklist outcome, the pipeline is too fragile.",
            "duration": "45 min"
          },
          "lesson-18-1-2": {
            "title": "Deploiement Config Manager Challenge",
            "content": "Manage deploiement configurations pour different environments.",
            "duration": "45 min",
            "hints": [
              "Push config into vector to add",
              "Use find() to locate config by environment name",
              "is_deployed checks if program_id is Some"
            ]
          },
          "lesson-18-1-3": {
            "title": "Program Size Validateur Challenge",
            "content": "Validate program binary size et compute budget.",
            "duration": "45 min",
            "hints": [
              "Compare binary length against MAX_PROGRAM_SIZE",
              "Use ceiling division pour transaction count",
              "Compression ratio shows percentage size reduction"
            ]
          },
          "lesson-18-1-4": {
            "title": "Upgrade Authority Manager Challenge",
            "content": "Manage program upgrade authorities et permissions.",
            "duration": "45 min",
            "hints": [
              "Push metadata into vector to register",
              "can_upgrade checks if authority matches stored authority",
              "Use find_mut to locate et modify program metadata"
            ]
          }
        }
      },
      "mod-18-2": {
        "title": "CI/CD Pipelines",
        "description": "Build CI/CD pipelines that enforce build/test/securite gates, compatibility checks, et controlled rollout/rollback evidence.",
        "lessons": {
          "lesson-18-2-1": {
            "title": "CI/CD pour Solana Programs",
            "content": "CI/CD pour Solana should enforce release quality, not just automate command execution.\n\nA pratique pipeline includes staged gates:\n1) static quality gate (lint/type/securite checks),\n2) deterministic unit/integration tests,\n3) build reproducibility et artifact hashing,\n4) deploiement preflight validation,\n5) controlled rollout avec observability checks.\n\nEach gate should produce machine-readable evidence. Release decisions become faster et safer when teams can inspect deterministic artifacts instead of scanning raw logs.\n\nVersion compatibility checks are critical in Solana ecosystems where CLI/toolchain mismatches can break builds or runtime expectations. Pipelines should fail fast on incompatible matrices.\n\nRollout strategy should also be explicit: canary/degraded mode, monitoring window, et rollback conditions. “Deploy et hope” is not a strategy.\n\nThe best CI/CD systems reduce human toil while increasing decision clarity. Automation should encode operational policy, not bypass it.",
            "duration": "45 min"
          },
          "lesson-18-2-2": {
            "title": "Build Pipeline Validateur Challenge",
            "content": "Validate CI/CD pipeline stages et dependencies.",
            "duration": "45 min",
            "hints": [
              "Track seen stages to enforce ordering constraints",
              "Use any() avec matches! to check pour required stages",
              "Can skip build/test if only documentation files changed"
            ]
          },
          "lesson-18-2-3": {
            "title": "Version Compatibility Checker Challenge",
            "content": "Check version compatibility between tools et dependencies.",
            "duration": "45 min",
            "hints": [
              "Split version string by '.' et parse each component",
              "Compatibility requires same major, actual >= required",
              "Use min_by to find smallest compatible version"
            ]
          },
          "lesson-18-2-4": {
            "title": "Deploiement Rollback Manager Challenge",
            "content": "Manage deploiement rollbacks et recovery.",
            "duration": "45 min",
            "hints": [
              "Push deploiement et update current_index to new deploiement",
              "can_rollback checks pour any successful deploiement before current",
              "get_rollback_target finds most recent successful deploiement"
            ]
          }
        }
      }
    }
  },
  "solana-cross-chain-bridges": {
    "title": "Cross-Chain Bridges et Wormhole",
    "description": "Build safer cross-chain integrations pour Solana using Wormhole-style messaging, attestation verification, et deterministic bridge-state controls.",
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
        "description": "Understand cross-chain messaging trust boundaries, guardian attestations, et deterministic verification pipelines.",
        "lessons": {
          "lesson-43-1-1": {
            "title": "Cross-Chain Messaging Architecture",
            "content": "Cross-chain messaging is a trust-boundary problem before it is a transport problem. In Wormhole-style systems, messages are observed, attested, et consumed across different chain environments, each avec independent failure modes.\n\nA robust architecture model includes:\n1) emitter semantics (what exactly is being attested),\n2) attestation verification (who signed et under what threshold),\n3) replay prevention (message uniqueness et consumption state),\n4) execution safety (what happens if target-chain state has changed).\n\nVerification must be deterministic et strict. Accepting malformed or weakly validated attestations is a direct safety risk.\n\nCross-chain systems should also expose explicit reason codes pour rejects: invalid signatures, stale message, already-consumed message, unsupported payload schema. This improves operator response et audit quality.\n\nMessaging reliability depends on observability. Teams need deterministic logs linking source event IDs to target execution outcomes so they can reconcile partial or delayed flows.\n\nCross-chain engineering succeeds when attestation trust assumptions are transparent et enforced consistently at every consume path.",
            "duration": "45 min"
          },
          "lesson-43-1-2": {
            "title": "VAA Verifier Challenge",
            "content": "Implement VAA (Verified Action Approval) signature verification.",
            "duration": "45 min",
            "hints": [
              "Check signatures length against MIN_SIGNERS first",
              "Use to_be_bytes() pour big-endian byte conversion",
              "Quorum is 2/3 of total guardians rounded up"
            ]
          },
          "lesson-43-1-3": {
            "title": "Message Emitter Challenge",
            "content": "Implement cross-chain message emission et tracking.",
            "duration": "45 min",
            "hints": [
              "Increment sequence before creating message",
              "Next sequence is current + 1",
              "Verify message sequence is within emitted range"
            ]
          },
          "lesson-43-1-4": {
            "title": "Replay Protection Challenge",
            "content": "Implement replay protection pour cross-chain messages.",
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
        "description": "Implement asset-bridging patterns avec strict supply/accounting invariants, replay protection, et reconciliation workflows.",
        "lessons": {
          "lesson-43-2-1": {
            "title": "Token Bridging Mechanics",
            "content": "Token bridging requires strict supply et state invariants. Lock-et-mint et burn-et-mint models both rely on one central rule: represented supply across chains must remain coherent.\n\nCritical controls include:\n- single-consume message semantics,\n- deterministic mint/unlock accounting,\n- paused-mode handling pour incident containment,\n- reconciliation reports between source et target totals.\n\nA bridge flow should define state transitions explicitly: initiated, attested, executed, reconciled. Missing state transitions create operational blind spots.\n\nReplay et duplication are recurring bridge risks. Systems must key transfer intents deterministically et reject repeated execution attempts even under retries or delayed relays.\n\nProduction bridge operations also need runbooks: what to do on attestation delays, threshold signer issues, or target-chain execution failures.\n\nBridging quality is not just throughput; it is verifiable accounting integrity under adverse network conditions.",
            "duration": "45 min"
          },
          "lesson-43-2-2": {
            "title": "Token Locker Challenge",
            "content": "Implement token locking pour bridge deposits.",
            "duration": "45 min",
            "hints": [
              "Push lock to vector et return index as lock_id",
              "Verify requester matches owner before unlocking",
              "Use filter et sum to calculate owner's locked amount"
            ]
          },
          "lesson-43-2-3": {
            "title": "Wrapped Token Mint Challenge",
            "content": "Manage wrapped token minting et supply tracking.",
            "duration": "45 min",
            "hints": [
              "Push token to vector et return index",
              "Check bounds before minting/burning",
              "Use get() et map() to safely retrieve supply"
            ]
          },
          "lesson-43-2-4": {
            "title": "Bridge Rate Limiter Challenge",
            "content": "Implement rate limiting pour bridge withdrawals.",
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
    "title": "Oracle Integration et Pyth Network",
    "description": "Integrate Solana oracle feeds safely: price validation, confidence/staleness policy, et multi-source aggregation pour resilient protocol decisions.",
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
        "description": "Understand oracle data semantics (price, confidence, staleness) et enforce deterministic validation before business logic.",
        "lessons": {
          "lesson-44-1-1": {
            "title": "Oracle Price Feeds",
            "content": "Oracle integration is a risk-control problem, not a data-fetch problem. Price feeds must be evaluated pour freshness, confidence, et contextual fitness before they drive protocol decisions.\n\nA safe oracle validation pipeline checks:\n1) feed status et availability,\n2) staleness window compliance,\n3) confidence-band reasonableness,\n4) value bounds against protocol policy.\n\nUsing raw price without confidence or staleness checks can trigger invalid liquidations, bad quotes, or incorrect risk assessments.\n\nValidation outputs should be deterministic et structured (accept/reject avec reason code). This helps downstream systems choose safe fallback behavior.\n\nProtocols should separate “data exists” from “data is usable.” A feed can be present but still unfit due to stale timestamp or extreme uncertainty.\n\nProduction reliability improves when oracle checks are versioned et fixture-tested across calm et stressed market scenarios.",
            "duration": "45 min"
          },
          "lesson-44-1-2": {
            "title": "Price Validateur Challenge",
            "content": "Validate oracle prices pour correctness et freshness.",
            "duration": "45 min",
            "hints": [
              "Freshness: current_time - publish_time <= max_staleness",
              "Confidence ratio: conf / |price| < threshold",
              "Use matches! pour enum variant checking"
            ]
          },
          "lesson-44-1-3": {
            "title": "Price Normalizer Challenge",
            "content": "Normalize prices avec different exponents to common scale.",
            "duration": "45 min",
            "hints": [
              "Calculate decimal difference et scale accordingly",
              "Use u128 pour intermediaire to prevent overflow",
              "Buy price increases, sell price decreases avec spread"
            ]
          },
          "lesson-44-1-4": {
            "title": "EMA Calculator Challenge",
            "content": "Calculate Exponential Moving Average pour price smoothing.",
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
        "description": "Conception multi-oracle aggregation et consensus policies that reduce single-source failure risk while remaining explainable et testable.",
        "lessons": {
          "lesson-44-2-1": {
            "title": "Oracle Aggregation Strategies",
            "content": "Multi-oracle aggregation reduces single-point dependency but adds policy complexity. The goal is not to average blindly; it is to produce a robust decision value avec clear confidence in adverse conditions.\n\nCommon strategies include median, trimmed mean, et weighted consensus. Strategy choice should reflect threat model: outlier resistance, latency tolerance, et source diversity.\n\nAggregation policies should define:\n- minimum participating sources,\n- max divergence threshold,\n- fallback action when consensus fails.\n\nIf sources diverge beyond policy bounds, the safe action may be to halt sensitive operations rather than force a number.\n\nDeterministic aggregation reports should include contributing sources, excluded outliers, et final consensus rationale. This is essential pour audits et incident response.\n\nA good oracle stack is transparent: every accepted value can be explained, replayed, et defended.",
            "duration": "45 min"
          },
          "lesson-44-2-2": {
            "title": "Median Price Calculator Challenge",
            "content": "Calculate median price from multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Sort prices et find middle element(s) pour median",
              "Pour weighted median, accumulate weights until reaching 50%",
              "Use retain() to filter out outliers"
            ]
          },
          "lesson-44-2-3": {
            "title": "Oracle Consensus Challenge",
            "content": "Implement consensus checking across multiple oracle sources.",
            "duration": "45 min",
            "hints": [
              "Check minimum sources first",
              "Find a price that at least 50% of oracles agree avec",
              "Agreement percent is (agreeing / total) * 100"
            ]
          },
          "lesson-44-2-4": {
            "title": "Fallback Oracle Manager Challenge",
            "content": "Manage primary et fallback oracle sources.",
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
    "title": "DAO Tooling et Autonomous Organizations",
    "description": "Build production-ready DAO systems on Solana: proposal gouvernance, voting integrity, treasury controls, et deterministic execution/reporting workflows.",
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
        "title": "DAO Gouvernance Mechanics",
        "description": "Implement gouvernance mechanics avec explicit proposal lifecycle rules, voting-power logic, et deterministic state transitions.",
        "lessons": {
          "lesson-45-1-1": {
            "title": "DAO Gouvernance Architecture",
            "content": "DAO gouvernance architecture is a system of enforceable process rules. Proposal creation, voting, et execution must be deterministic, auditable, et resistant to manipulation.\n\nA robust gouvernance model defines:\n1) proposal lifecycle states et transitions,\n2) voter eligibility et power calculation,\n3) quorum/approval thresholds by action class,\n4) execution preconditions et cancellation paths.\n\nGouvernance failures usually come from ambiguity: unclear thresholds, inconsistent snapshot timing, or weak transition validation.\n\nState transitions should be explicit et testable. Invalid transitions (pour example executed -> voting) should fail avec deterministic errors.\n\nVoting-power logic must also be transparent. Whether delegation, time-weighting, or quadratic models are used, outcomes should be reproducible from public inputs.\n\nDAO tooling quality is measured by predictability under pressure. During contentious proposals, deterministic behavior et clear reason codes are what preserve legitimacy.",
            "duration": "45 min"
          },
          "lesson-45-1-2": {
            "title": "Proposal Lifecycle Manager Challenge",
            "content": "Manage DAO proposal states et transitions.",
            "duration": "45 min",
            "hints": [
              "Match on (current, new) state pairs pour valid transitions",
              "Voting active only during time window in Active state",
              "Quorum et threshold use basis point calculations"
            ]
          },
          "lesson-45-1-3": {
            "title": "Voting Power Calculator Challenge",
            "content": "Calculate voting power avec delegation et quadratic options.",
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
              "Use position() et remove() to undelegate",
              "Filter et sum to get delegated amount"
            ]
          }
        }
      },
      "mod-45-2": {
        "title": "Treasury et Execution",
        "description": "Engineer treasury et execution tooling avec policy gates, timelock safeguards, et auditable automation outcomes.",
        "lessons": {
          "lesson-45-2-1": {
            "title": "DAO Treasury Management",
            "content": "DAO treasury management is where gouvernance intent becomes real financial action. Treasury tooling must therefore combine flexibility avec strict policy constraints.\n\nCore controls include:\n- spending limits et role-based authority,\n- timelock windows pour sensitive actions,\n- multisig/escalation paths,\n- deterministic execution logs.\n\nAutomated execution should never hide policy checks. Every executed action should reference the proposal, required approvals, et control checks passed.\n\nFailure handling is equally important. If execution fails mid-flow, tooling should expose exact failure stage et safe retry/rollback guidance.\n\nTreasury systems should also produce reconciliation artifacts: proposed vs executed amounts, remaining budget, et exception records.\n\nOperationally mature DAOs treat treasury automation as regulated process infrastructure: explicit controls, reproducible evidence, et clear accountability boundaries.",
            "duration": "45 min"
          },
          "lesson-45-2-2": {
            "title": "Treasury Spending Limit Challenge",
            "content": "Implement spending limits et budget tracking pour DAO treasury.",
            "duration": "45 min",
            "hints": [
              "Check balance et category limits before allowing spend",
              "Reset period if duration has passed",
              "Use saturating_sub to avoid underflow"
            ]
          },
          "lesson-45-2-3": {
            "title": "Timelock Executor Challenge",
            "content": "Implement timelock pour delayed proposal execution.",
            "duration": "45 min",
            "hints": [
              "Push operation et return index as ID",
              "Can execute only if ETA reached et not executed",
              "Remove operation from list to cancel"
            ]
          },
          "lesson-45-2-4": {
            "title": "Automated Action Trigger Challenge",
            "content": "Implement automated triggers pour DAO actions based on conditions.",
            "duration": "45 min",
            "hints": [
              "Push action et return index as ID",
              "Match on condition type to evaluate",
              "Only return non-triggered actions that meet conditions"
            ]
          }
        }
      }
    }
  },
  "solana-gaming": {
    "title": "Gaming et Game State Management",
    "description": "Build production-ready on-chain game systems on Solana: efficient state models, turn integrity, fairness controls, et scalable player progression economics.",
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
        "description": "Conception game state et turn logic avec deterministic transitions, storage efficiency, et anti-cheat validation boundaries.",
        "lessons": {
          "lesson-46-1-1": {
            "title": "On-Chain Game Conception",
            "content": "On-chain game conception on Solana is a systems-engineering tradeoff between fairness, responsiveness, et cost. The best designs keep critical rules verifiable while minimizing expensive state writes.\n\nCore architecture decisions:\n1) what state must be on-chain pour trust,\n2) what can remain off-chain pour speed,\n3) how turn validity is enforced deterministically.\n\nTurn-based mechanics should use explicit state transitions et guard checks (current actor, phase, cooldown, resource limits). If transitions are ambiguous, replay et dispute resolution become difficult.\n\nState compression et compact encoding matter because game loops can generate many updates. Efficient schemas reduce rent et compute pressure while preserving auditability.\n\nA production game model should also define anti-cheat boundaries. Even avec deterministic logic, you need clear validation pour illegal actions, stale turns, et duplicate submissions.\n\nReliable game infrastructure is measured by predictable outcomes under stress: same input actions, same resulting state, clear reject reasons pour invalid actions.",
            "duration": "45 min"
          },
          "lesson-46-1-2": {
            "title": "Turn Manager Challenge",
            "content": "Implement turn-based game mechanics avec action validation.",
            "duration": "45 min",
            "hints": [
              "Check player matches, state is waiting, et before deadline",
              "Turn complete when all players submitted",
              "Increment turn number pour next turn"
            ]
          },
          "lesson-46-1-3": {
            "title": "Game State Compressor Challenge",
            "content": "Compress game state pour efficient on-chain storage.",
            "duration": "45 min",
            "hints": [
              "Use bit shifting to pack x in high 4 bits, y in low 4 bits",
              "Unpack by shifting et masking",
              "Health stored as percentage (0-100) fits in 7 bits"
            ]
          },
          "lesson-46-1-4": {
            "title": "Player Progression Tracker Challenge",
            "content": "Track player experience, levels, et achievements.",
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
        "title": "Randomness et Fairness",
        "description": "Implement fairness-oriented randomness et integrity controls that keep gameplay auditable et dispute-resistant.",
        "lessons": {
          "lesson-46-2-1": {
            "title": "On-Chain Randomness",
            "content": "Randomness is one of the hardest fairness problems in blockchain games because execution is deterministic. Robust designs avoid naive pseudo-randomness tied directly to manipulable context.\n\nPratique fairness patterns include commit-reveal, VRF-backed randomness, et delayed-seed schemes. Each has latency/trust tradeoffs:\n- commit-reveal: simple et transparent, but requires multi-step interaction,\n- VRF: stronger unpredictability, but introduces oracle/dependency considerations,\n- delayed-seed methods: lower overhead but weaker guarantees under adversarial pressure.\n\nFairness engineering should specify:\n1) who can influence randomness inputs,\n2) when values become immutable,\n3) how unresolved rounds are handled on timeout.\n\nProduction systems should emit deterministic round evidence (commit hash, reveal value, validation result) so disputes can be resolved quickly.\n\nGame fairness is credible when randomness mechanisms are explicit, verifiable, et resilient to timing manipulation.",
            "duration": "45 min"
          },
          "lesson-46-2-2": {
            "title": "Commit-Reveal Challenge",
            "content": "Implement commit-reveal scheme pour fair randomness.",
            "duration": "45 min",
            "hints": [
              "Push commitment to vector",
              "Verify by recomputing hash from reveal",
              "XOR all revealed values pour combined randomness"
            ]
          },
          "lesson-46-2-3": {
            "title": "Dice Roller Challenge",
            "content": "Implement verifiable dice rolling avec randomness.",
            "duration": "45 min",
            "hints": [
              "Use hash of seed pour deterministic randomness",
              "Modulo operation gives range, add 1 pour 1-based",
              "4d6 drop lowest: roll 4, sum all, subtract minimum"
            ]
          },
          "lesson-46-2-4": {
            "title": "Loot Table Challenge",
            "content": "Implement weighted loot tables pour game rewards.",
            "duration": "45 min",
            "hints": [
              "Sum all weights pour total",
              "Generate random number in range [0, total)",
              "Find item where cumulative weight exceeds roll"
            ]
          }
        }
      }
    }
  },
  "solana-permanent-storage": {
    "title": "Permanent Storage et Arweave",
    "description": "Integrate permanent decentralized storage avec Solana using Arweave-style workflows: content addressing, manifest integrity, et verifiable long-term data access.",
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
        "description": "Understand permanent-storage architecture et build deterministic linking between Solana state et external immutable content.",
        "lessons": {
          "lesson-47-1-1": {
            "title": "Permanent Storage Architecture",
            "content": "Permanent storage integration is a data durability contract. On Solana, storing full content on-chain is often impractical, so systems rely on immutable external storage references anchored by on-chain metadata.\n\nA robust architecture defines:\n1) canonical content identifiers,\n2) integrity verification method,\n3) fallback retrieval behavior,\n4) lifecycle policy pour metadata updates.\n\nContent-addressed conception is critical. If identifiers are not tied to content hash semantics, integrity guarantees weaken et replayed/wrong assets can be served.\n\nStorage integration should also separate control-plane et data-plane concerns: on-chain records govern ownership/version pointers, while external storage handles large payload persistence.\n\nProduction reliability requires deterministic verification reports (ID format validity, expected hash match, availability checks). This makes failures diagnosable et prevents silent corruption.\n\nPermanent storage systems succeed when users can independently verify that referenced content matches what gouvernance or protocol state claims.",
            "duration": "45 min"
          },
          "lesson-47-1-2": {
            "title": "Transaction ID Validateur Challenge",
            "content": "Validate Arweave transaction IDs et URLs.",
            "duration": "45 min",
            "hints": [
              "Check exact length et all characters valid",
              "base64url uses alphanumeric plus - et _"
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
            "content": "Optimize data bundling pour efficient Arweave uploads.",
            "duration": "45 min",
            "hints": [
              "Sort items by priority before bundling"
            ]
          }
        }
      },
      "mod-47-2": {
        "title": "Manifests et Verification",
        "description": "Work avec manifests, verification pipelines, et cost/performance controls pour reliable long-lived data serving.",
        "lessons": {
          "lesson-47-2-1": {
            "title": "Arweave Manifests",
            "content": "Manifests turn many stored assets into one navigable root, but they introduce their own integrity responsibilities. A manifest is only trustworthy if path mapping et referenced content IDs are validated consistently.\n\nKey safeguards:\n- deterministic path normalization,\n- duplicate/ambiguous key rejection,\n- strict transaction-ID validation,\n- recursive integrity checks pour referenced content.\n\nManifest tooling should produce auditable outputs: resolved entries count, missing references, et hash verification status by path.\n\nFrom an operational standpoint, cost optimization should not compromise integrity. Bundling strategies, compression, et metadata minimization are useful only if verification remains straightforward et deterministic.\n\nWell-run permanent-storage pipelines treat manifests as governed artifacts avec versioned schema expectations et repeatable validation in CI.",
            "duration": "45 min"
          },
          "lesson-47-2-2": {
            "title": "Manifest Builder Challenge",
            "content": "Build et parse Arweave manifests.",
            "duration": "45 min",
            "hints": [
              "Validate tx_id length before adding",
              "Resolve in order: exact, index, fallback"
            ]
          },
          "lesson-47-2-3": {
            "title": "Data Verifier Challenge",
            "content": "Verify data integrity et availability on Arweave.",
            "duration": "45 min",
            "hints": [
              "MIN_CONFIRMATIONS defines 'sufficient' threshold"
            ]
          },
          "lesson-47-2-4": {
            "title": "Storage Indexer Challenge",
            "content": "Index et query stored data by tags.",
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
    "title": "Staking et Validateur Economics",
    "description": "Understand Solana staking et validateur economics pour real-world decision-making: delegation strategy, reward dynamics, commission effects, et operational sustainability.",
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
        "description": "Apprenez native staking mechanics avec deterministic reward modeling, validateur selection criteria, et delegation risk framing.",
        "lessons": {
          "lesson-48-1-1": {
            "title": "Solana Staking Architecture",
            "content": "Solana staking economics is an incentives system connecting delegators, validateurs, et network securite. Good delegation decisions require more than chasing headline APY.\n\nDelegators should evaluate:\n1) validateur performance consistency,\n2) commission policy et changes over time,\n3) uptime et vote behavior,\n4) concentration risk across the validateur set.\n\nReward modeling should be deterministic et transparent. Calculations must show gross rewards, commission effects, et net delegator outcome under explicit assumptions.\n\nDiversification matters. Concentrating stake purely on top performers can increase ecosystem centralization risk even if short-term yield appears higher.\n\nProduction staking tooling should expose scenario analysis (commission changes, performance drops, epoch variance) so delegators can make resilient choices rather than reactive moves.\n\nStaking quality is measured by sustainable net returns plus contribution to healthy validateur distribution.",
            "duration": "45 min"
          },
          "lesson-48-1-2": {
            "title": "Staking Rewards Calculator Challenge",
            "content": "Calculate staking rewards avec commission et inflation.",
            "duration": "45 min",
            "hints": [
              "Apply commission as (1 - commission) multiplier",
              "Divide annual by epochs per year pour epoch reward",
              "APY is (reward / stake) * 100"
            ]
          },
          "lesson-48-1-3": {
            "title": "Validateur Selector Challenge",
            "content": "Select validateurs based on performance et commission.",
            "duration": "45 min",
            "hints": [
              "Weight factors: commission 40%, uptime 40%, skip rate 20%",
              "Sort by score descending et take top N",
              "Check each validateur's percentage of total stake"
            ]
          },
          "lesson-48-1-4": {
            "title": "Stake Rebalancing Challenge",
            "content": "Optimize stake distribution across validateurs.",
            "duration": "45 min",
            "hints": [
              "Target is total divided by count, clamped to min/max",
              "Count allocations that differ between old et new",
              "Check all allocations within tolerance percentage"
            ]
          }
        }
      },
      "mod-48-2": {
        "title": "Validateur Operations",
        "description": "Analyze validateur-side economics, operational cost pressure, et incentive alignment pour long-term network health.",
        "lessons": {
          "lesson-48-2-1": {
            "title": "Validateur Economics",
            "content": "Validateur economics balances revenue opportunities against operational costs et reliability obligations. Sustainable validateurs optimize pour long-term trust, not short-term extraction.\n\nRevenue sources include inflation rewards et fee-related earnings; cost structure includes hardware, networking, maintenance, et operational staffing.\n\nKey operational metrics pour validateur viability:\n- effective uptime et vote success,\n- commission competitiveness,\n- stake retention trend,\n- incident frequency et recovery quality.\n\nCommission strategy should be explicit et predictable. Sudden commission spikes can damage delegator trust et long-term stake stability.\n\nEconomic analysis should include downside modeling: reduced stake, higher incident costs, or prolonged performance degradation.\n\nHealthy validateur economics supports network resilience. Tooling should help operators et delegators reason about sustainability, not just peak-period earnings.",
            "duration": "45 min"
          },
          "lesson-48-2-2": {
            "title": "Validateur Profit Calculator Challenge",
            "content": "Calculate validateur profitability.",
            "duration": "45 min",
            "hints": [
              "Sum all cost components",
              "Revenue = commission * delegated_rewards + self_rewards",
              "Break-even: commission = needed_rewards / delegated_rewards"
            ]
          },
          "lesson-48-2-3": {
            "title": "Epoch Schedule Calculator Challenge",
            "content": "Calculate epoch timing et reward distribution schedules.",
            "duration": "45 min",
            "hints": [
              "Convert ms to hours: / (1000 * 60 * 60)",
              "Next epoch starts at (current_epoch + 1) * slots_per_epoch",
              "Epoch pour slot is integer division"
            ]
          },
          "lesson-48-2-4": {
            "title": "Stake Compte Manager Challenge",
            "content": "Manage stake compte lifecycle including activation et deactivation.",
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
    "title": "Compte Abstraction et Smart Portefeuilles",
    "description": "Implement smart-portefeuille/compte-abstraction patterns on Solana avec programmable authorization, recovery controls, et policy-driven transaction validation.",
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
        "title": "Smart Portefeuille Fundamentals",
        "description": "Build smart-portefeuille fundamentals including multisig et social-recovery designs avec clear trust et failure boundaries.",
        "lessons": {
          "lesson-49-1-1": {
            "title": "Compte Abstraction on Solana",
            "content": "Compte abstraction on Solana shifts control from a single key to programmable policy. Smart portefeuilles can enforce richer authorization logic, but policy complexity must be managed carefully.\n\nA robust smart-portefeuille conception defines:\n1) authority model (owners/guardians/delegates),\n2) policy scope (what can be approved automatically vs manually),\n3) recovery path (how access is restored safely).\n\nMultisig et social recovery are powerful, but both need deterministic state transitions et explicit quorum rules. Ambiguous transitions create lockout or unauthorized-access risk.\n\nSmart-portefeuille systems should emit structured authorization evidence pour each action: which policy matched, which signers approved, et which constraints passed.\n\nProduction reliability depends on clear emergency controls: pause paths, guardian rotation, et recovery cooldowns.\n\nCompte abstraction is successful when flexibility increases safety et usability together, not when policy logic becomes opaque.",
            "duration": "45 min"
          },
          "lesson-49-1-2": {
            "title": "Multi-Signature Portefeuille Challenge",
            "content": "Implement M-of-N multi-signature portefeuille.",
            "duration": "45 min",
            "hints": [
              "Use contains() to check ownership",
              "Can sign if owner ET not already signed ET not executed",
              "Can execute if threshold reached et not executed"
            ]
          },
          "lesson-49-1-3": {
            "title": "Social Recovery Challenge",
            "content": "Implement social recovery avec guardians.",
            "duration": "45 min",
            "hints": [
              "Track approvals in guardians_approved vector",
              "Check guardian status before approving",
              "Require threshold ET delay pour execution"
            ]
          },
          "lesson-49-1-4": {
            "title": "Session Key Manager Challenge",
            "content": "Manage temporary session keys avec limited permissions.",
            "duration": "45 min",
            "hints": [
              "Valid if current time before expiration",
              "Can execute if valid, allowed operation, et within limit",
              "Remaining is max minus used"
            ]
          }
        }
      },
      "mod-49-2": {
        "title": "Programmable Validation",
        "description": "Implement programmable validation policies (limits, allowlists, time/risk rules) avec deterministic enforcement et auditability.",
        "lessons": {
          "lesson-49-2-1": {
            "title": "Custom Validation Rules",
            "content": "Programmable validation is where smart portefeuilles deliver real value, but it is also where subtle policy bugs appear.\n\nTypical controls include spending limits, destination allowlists, time windows, et risk-score gates. These controls should be deterministic et composable, avec explicit precedence rules.\n\nConception principles:\n- fail closed on ambiguous policy matches,\n- keep policy evaluation order stable,\n- attach machine-readable reason codes to approve/reject outcomes.\n\nValidation systems should also support policy explainability. Users et auditors need to understand why a transaction was blocked or approved.\n\nPour production deployments, policy changes should be versioned et test-fixtured. A new rule must be validated against prior known-good scenarios to avoid accidental lockouts or bypasses.\n\nProgrammable portefeuilles are strongest when validation logic is transparent, testable, et operationally reversible.",
            "duration": "45 min"
          },
          "lesson-49-2-2": {
            "title": "Spending Limit Enforcer Challenge",
            "content": "Enforce daily et per-transaction spending limits.",
            "duration": "45 min",
            "hints": [
              "Reset counters before checking",
              "Check all three limits: per-tx, daily, weekly",
              "Reset daily if new day, weekly if 7+ days passed"
            ]
          },
          "lesson-49-2-3": {
            "title": "Whitelist Enforcer Challenge",
            "content": "Enforce destination whitelists pour transactions.",
            "duration": "45 min",
            "hints": [
              "allow_all bypasses whitelist check",
              "Check contains() before adding",
              "Validate all destinations in transaction"
            ]
          },
          "lesson-49-2-4": {
            "title": "Time Lock Enforcer Challenge",
            "content": "Enforce time-based restrictions on transactions.",
            "duration": "45 min",
            "hints": [
              "Handle wrap-around pour hours crossing midnight",
              "Check elapsed is between min et max delay",
              "Validate hours are 0-23 et min <= max"
            ]
          }
        }
      }
    }
  },
  "solana-pda-mastery": {
    "title": "Adresse Derivee de Programme Mastery",
    "description": "Master avance PDA engineering on Solana: seed schema conception, bump handling discipline, et secure cross-program PDA usage at production scale.",
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
        "description": "Build strong PDA foundations avec deterministic derivation, canonical seed composition, et collision-resistant namespace strategy.",
        "lessons": {
          "lesson-50-1-1": {
            "title": "Adresses Derivees de Programme",
            "content": "Adresses Derivees de Programme (PDAs) are deterministic authority et state anchors on Solana. Their power comes from predictable derivation; their risk comes from inconsistent seed discipline.\n\nA strong PDA conception standard defines:\n1) canonical seed order,\n2) explicit namespace/domain tags,\n3) bump handling rules,\n4) versioning strategy pour future evolution.\n\nSeed ambiguity is a common source of bugs. If different handlers derive the same concept avec different seed ordering, identity checks become inconsistent et securite assumptions break.\n\nPDA validation should always re-derive expected addresses on the trusted side et compare exact keys before mutating state.\n\nProduction teams should document seed recipes as API contracts. Changing recipes without migration planning can orphan state et break clients.\n\nPDA mastery is mostly discipline: deterministic derivation everywhere, no implicit conventions, no trust in client-provided derivation claims.",
            "duration": "45 min"
          },
          "lesson-50-1-2": {
            "title": "PDA Generator Challenge",
            "content": "Implement PDA generation avec seed validation.",
            "duration": "45 min",
            "hints": [
              "Try bumps from 255 down to 0",
              "Combine seeds, program_id, et bump in hash",
              "Check if derived address matches expected"
            ]
          },
          "lesson-50-1-3": {
            "title": "Seed Composer Challenge",
            "content": "Compose complex seed patterns pour different use cases.",
            "duration": "45 min",
            "hints": [
              "Use byte string literals b\"...\" pour static prefixes",
              "Convert integers avec to_le_bytes()",
              "Collect into Vec<Vec<u8>>"
            ]
          },
          "lesson-50-1-4": {
            "title": "Bump Manager Challenge",
            "content": "Manage bump seeds pour PDA verification et signing.",
            "duration": "45 min",
            "hints": [
              "Compare stored seeds avec expected seeds",
              "Signer seeds include all seeds plus bump",
              "Canonical bump is from find_pda avec highest valid bump"
            ]
          }
        }
      },
      "mod-50-2": {
        "title": "Avance PDA Patterns",
        "description": "Implement avance PDA patterns (nested/counter/stateful) while preserving securite invariants et migration safety.",
        "lessons": {
          "lesson-50-2-1": {
            "title": "PDA Conception Patterns",
            "content": "Avance PDA patterns solve real scaling et composability needs but increase conception complexity.\n\nNested PDAs, counter-based PDAs, et multi-tenant PDA namespaces each require explicit invariants around uniqueness, lifecycle, et authority boundaries.\n\nKey safeguards:\n- monotonic counters avec replay protection,\n- collision checks in shared namespaces,\n- explicit ownership checks on all derived-state paths,\n- deterministic migration paths when schema/seed versions evolve.\n\nCross-program PDA interactions must minimize signer scope. invoke_signed should only grant exactly what downstream steps require.\n\nOperationally, avance PDA systems need deterministic audit artifacts: derivation inputs, expected outputs, et validation results by instruction path.\n\nComplex PDA architecture is safe when derivation logic remains simple to reason about et impossible to interpret ambiguously.",
            "duration": "45 min"
          },
          "lesson-50-2-2": {
            "title": "Nested PDA Generator Challenge",
            "content": "Generate PDAs derived from other PDA addresses.",
            "duration": "45 min",
            "hints": [
              "Include parent address in child seeds",
              "Use index bytes pour sibling derivation",
              "Verify by re-deriving et comparing"
            ]
          },
          "lesson-50-2-3": {
            "title": "Counter PDA Generator Challenge",
            "content": "Generate unique PDAs using incrementing counters.",
            "duration": "45 min",
            "hints": [
              "Increment counter after each generation",
              "Use counter in seeds pour uniqueness",
              "Batch generation calls generate_next multiple times"
            ]
          },
          "lesson-50-2-4": {
            "title": "PDA Collision Detector Challenge",
            "content": "Detect et prevent PDA seed collisions.",
            "duration": "45 min",
            "hints": [
              "Check if seeds match any existing entry",
              "Return error if collision detected",
              "Collision risk if same structure et component sizes"
            ]
          }
        }
      }
    }
  },
  "solana-economics": {
    "title": "Solana Economics et Token Flows",
    "description": "Analyze Solana economic dynamics in production context: inflation/fee-burn interplay, staking flows, supply movement, et protocol sustainability tradeoffs.",
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
        "description": "Understand Solana macro token economics (inflation, burn, rewards, fees) avec deterministic scenario modeling.",
        "lessons": {
          "lesson-51-1-1": {
            "title": "Solana Token Economics",
            "content": "Solana economics is the interaction of issuance, burn, staking rewards, et usage demand. Sustainable protocol decisions require understanding these flows as a system, not isolated metrics.\n\nCore mechanisms include:\n1) inflation schedule et long-term emission behavior,\n2) fee burn et validateur reward pathways,\n3) staking participation effects on circulating supply.\n\nEconomic analysis should be scenario-driven. Single-point estimates hide risk. Teams should model calm/high-usage/low-usage regimes et compare supply-pressure outcomes.\n\nDeterministic calculators are useful pour gouvernance et product planning because they make assumptions explicit: epoch cadence, fee volume, staking ratio, et unlock schedules.\n\nHealthy economic reasoning links network-level flows to protocol-level choices (treasury policy, incentive emissions, fee strategy).\n\nEconomic quality improves when teams publish assumption-driven reports instead of headline narratives.",
            "duration": "45 min"
          },
          "lesson-51-1-2": {
            "title": "Inflation Calculator Challenge",
            "content": "Calculate inflation rate et staking rewards over time.",
            "duration": "45 min",
            "hints": [
              "Use powi pour disinflation calculation",
              "Compound inflation year over year",
              "APY is inflation divided by staked percentage"
            ]
          },
          "lesson-51-1-3": {
            "title": "Fee Burn Calculator Challenge",
            "content": "Calculate fee burns et their deflationary impact.",
            "duration": "45 min",
            "hints": [
              "Priority multiplier increases avec priority level",
              "Burn is percentage of total fee",
              "Annual estimate is daily * 365"
            ]
          },
          "lesson-51-1-4": {
            "title": "Rent Economics Calculator Challenge",
            "content": "Calculate rent costs et exemption thresholds.",
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
        "description": "Model token flow dynamics et sustainability signals using supply categories, unlock events, et behavior-driven liquidity effects.",
        "lessons": {
          "lesson-51-2-1": {
            "title": "Token Flow Dynamics",
            "content": "Token flow analysis turns abstract economics into operational insight. The key is to track where tokens are (staked, circulating, locked, treasury, pending unlock) et how they move over time.\n\nUseful flow metrics include:\n- net circulating change,\n- staking inflow/outflow trend,\n- unlock cliff concentration,\n- treasury spend velocity.\n\nUnlock events should be modeled pour market-impact risk. Large clustered unlocks can create short-term supply shock even when long-term tokenomics is sound.\n\nFlow tooling should support deterministic category accounting et conservation checks (total categorized supply consistency).\n\nPour gouvernance, flow analysis is most valuable when tied to policy actions: adjust emissions, change vesting cadence, alter incentive programs.\n\nSustainable token systems are not static designs; they are continuously monitored flow systems avec explicit policy feedback loops.",
            "duration": "45 min"
          },
          "lesson-51-2-2": {
            "title": "Supply Flow Tracker Challenge",
            "content": "Track token supply categories et flows.",
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
            "content": "Calculate sustainability metrics pour tokenomics.",
            "duration": "45 min",
            "hints": [
              "Net issuance is inflation minus burn",
              "Burn ratio is burn divided by inflation",
              "Score combines burn ratio et staking ratio"
            ]
          }
        }
      }
    }
  }
};
