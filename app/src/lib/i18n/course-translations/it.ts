import type { CourseTranslationMap } from "./types";

const itCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fondamenti di Solana",
    description: "Introduzione di livello production per principianti che vogliono modelli mentali Solana chiari, debugging delle transazioni piu solido e workflow wallet-manager deterministici.",
  },
  "anchor-development": {
    title: "Sviluppo con Anchor",
    description: "Corso orientato al progetto per passare dalle basi all ingegneria Anchor reale: modellazione deterministica degli account, instruction costruireer, disciplina nei test e UX client affidabile.",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor Fondamenti",
        "description": "Anchor architecture, account constraints, e PDA foundations con explicit ownership of sicurezza-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modello mentale",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Account, constraints, e safety",
          },
          "anchor-pdas-in-practice": {
            "title": "PDAs in Anchor",
          },
          "anchor-counter-init-deterministic": {
            "title": "Initialize Counter PDA (deterministic)",
          },
        },
      },
      "anchor-v2-module-pdas-accounts-testing": {
        "title": "PDAs, Account, e Test",
        "description": "Deterministic istruzione builders, stable state emulation, e test strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment istruzione builder + state layout",
          },
          "anchor-testing-without-flakiness": {
            "title": "Test strategy without flakiness",
          },
          "anchor-client-composition-and-ux": {
            "title": "Client composition & UX",
          },
          "anchor-counter-project-checkpoint": {
            "title": "Counter project checkpoint",
          },
        },
      },
    },
  },
  "solana-frontend": {
    title: "Sviluppo Interfaccia Solana",
    description: "Corso orientato al progetto per ingegneri di interfaccia che vogliono cruscotti Solana pronti per la produzione: reducer deterministici, pipeline eventi replayabili e UX transazioni affidabile.",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "Fondamentali Interfaccia per Solana",
        description: "Modella correttamente stato portafoglio/account, progetta UX del ciclo di vita transazione e applica regole deterministiche per debugging riproducibile.",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "Stato portafoglio + modello mentale account per dev UI",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "Ciclo di vita transazione per UI: in attesa/confermata/finalizzata e UI ottimistica",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "Correttezza dati: deduplicazione, ordinamento, idempotenza, eventi di correzione",
          },
          "frontend-v2-core-reducer": {
            title: "Costruire modello stato core + reducer da eventi",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "Progetto Cruscotto Token",
        description: "Costruisci reducer, snapshot di replay, metriche di query e output cruscotto deterministici stabili con dati parziali o ritardati.",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "Implementare simulatore flusso + sequenza temporale replay + snapshot",
          },
          "frontend-v2-query-layer-metrics": {
            title: "Implementare query layer + metriche calcolate",
          },
          "frontend-v2-production-ux-hardening": {
            title: "UX di produzione: cache, paginazione, error banner, skeleton, rate limit",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "Emettere CruscottoSummary stabile da fixture",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "DeFi su Solana",
    description: "Corso avanzato orientato al progetto per ingegneri che costruiscono sistemi di swap: pianificazione offline deterministica in stile Jupiter, ranking delle route, sicurezza minOut e diagnostica riproducibile.",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "Fondamenti di Scambio",
        description: "Comprendere matematica CPMM, anatomia del quote e tradeoff di instradamento deterministico con protezioni utente orientate alla sicurezza.",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "Fondamenti AMM su Solana: pool, fee, slippage e price impact",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "Anatomia del quote: in/out, fee, minOut ed esecuzione worst-case",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "Instradamento: perche due hop possono battere un hop",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "Progetto Pianificatore Scambio stile Jupiter (Offline)",
        description: "Costruire quoting deterministico, selezione route e controlli minOut, quindi produrre artefatti punto di controllo stabili per review riproducibili.",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "Implementare modello token/pool + calcolo quote a prodotto costante",
          },
          "defi-v2-router-best": {
            title: "Implementare enumerazione route e selezione della migliore route",
          },
          "defi-v2-safety-minout": {
            title: "Implementare slippage/minOut, dettaglio fee e invarianti di sicurezza",
          },
          "defi-v2-production-swap-ux": {
            title: "UX swap di produzione: quote obsolete, protezione e simulazione",
          },
          "defi-v2-checkpoint": {
            title: "Produrre punto di controllo stabile ScambioPlan + ScambioSummary",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "Sicurezza e Audit Solana",
    description: "Lab deterministico di vulnerabilita per auditor Solana che richiedono evidenza exploit ripetibile, remediation precisa e artefatti di audit ad alto segnale.",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "Modello di Minaccia e Metodo di Audit",
        description: "Threat modeling centrato sugli account, riproduzione deterministica degli exploit e disciplina dell evidenza per finding di audit credibili.",
        lessons: {
          "security-v2-threat-model": {
            title: "Modello di minaccia Solana per auditor: account, proprietari, firmatari, scrivibili, PDA",
          },
          "security-v2-evidence-chain": {
            title: "Catena di evidenza: riprodurre, tracciare, impatto, fix, verificare",
          },
          "security-v2-bug-classes": {
            title: "Classi comuni di bug Solana e mitigazioni",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "Percorso Progetto Laboratorio vulnerabilita",
        description: "Sfruttare, correggere, verificare e produrre artefatti audit-ready con trace deterministiche e conclusioni supportate da invarianti.",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Rompi: exploit di verifiche mancanti firmatario + proprietario",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Rompi: exploit di incongruenza spoof PDA",
          },
          "security-v2-patch-validate": {
            title: "Fix it: validazioni + suite di invarianti",
          },
          "security-v2-writing-reports": {
            title: "Scrivere report di audit: severita, probabilita, blast radius, remediation",
          },
          "security-v2-audit-report-checkpoint": {
            title: "Punto di controllo: AuditReport JSON + markdown deterministico",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "Token Engineering su Solana",
    description: "Corso orientato al progetto per team che lanciano token Solana reali: pianificazione deterministica Token-2022, design delle authority, simulazione della offerta e disciplina operativa di lancio.",
    modules: {
      "token-v2-module-fundamentals": {
        title: "Fondamenti Token -> Token-2022",
        description: "Comprendi primitive token, anatomia delle policy di mint e controlli delle estensioni Token-2022 con framing esplicito di governance e threat model.",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "Token SPL vs Token-2022: cosa cambia con le estensioni",
          },
          "token-v2-mint-anatomy": {
            title: "Anatomia del mint: authority, decimali, offerta, freeze, mint",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "Rischi di sicurezza delle estensioni: fee configs, abuso delegato, stato account predefinito",
          },
          "token-v2-validate-config-derive": {
            title: "Validare config token + derivare indirizzi deterministici offline",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "Progetto Pacchetto di Lancio Token",
        description: "Costruisci workflow deterministici di validazione, pianificazione e simulazione che producano artefatti di lancio revisionabili e criteri procedi/non procedere chiari.",
        lessons: {
          "token-v2-build-init-plan": {
            title: "Costruire piano istruzioni di inizializzazione Token-2022",
          },
          "token-v2-simulate-fees-supply": {
            title: "Costruire matematica mint-to + transfer-fee + simulazione",
          },
          "token-v2-launch-checklist": {
            title: "Checklist di lancio: parametri, strategia upgrade/authority e piano airdrop/test",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "Emettere LaunchPackSummary stabile",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "Sviluppo Mobile Solana",
    description: "Costruisci dApp Solana mobile pronte per la produzione con MWA, architettura robusta delle sessioni wallet, UX di firma esplicita e operazioni di distribuzione disciplinate.",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "Mobile Wallet Adapter",
        description: "Protocollo MWA centrale, controllo del ciclo di vita della sessione e pattern resilienti di handoff wallet per app mobile in produzione.",
        lessons: {
          "mobile-wallet-overview": {
            title: "Panoramica del wallet mobile",
          },
          "mwa-integration": {
            title: "Integrazione MWA",
          },
          "mobile-transaction": {
            title: "Costruire una funzione di transazione mobile",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store e Distribuzione",
        description: "Pubblicazione, readiness operativa e pratiche UX mobile orientate alla fiducia per la distribuzione di app Solana.",
        lessons: {
          "dapp-store-submission": {
            title: "Invio al dApp Store",
          },
          "mobile-best-practices": {
            title: "Best practice mobile",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "Test di Programmi Solana",
    description: "Costruisci sistemi di test Solana robusti su ambienti locali, simulati e di rete con invarianti di sicurezza esplicite e confidence gate di qualita release.",
    modules: {
      "module-testing-foundations": {
        title: "Fondamenti di Test",
        description: "Strategia di test centrale su livelli unit/integration con workflow deterministici e copertura di casi avversariali.",
        lessons: {
          "testing-approaches": {
            title: "Approcci di test",
          },
          "bankrun-testing": {
            title: "Test con Bankrun",
          },
          "write-bankrun-test": {
            title: "Scrivere un test Bankrun per un Counter Program",
          },
        },
      },
      "module-advanced-testing": {
        title: "Test Avanzato",
        description: "Fuzzing, validazione devnet e controlli di release CI/CD per cambiamenti di protocollo piu sicuri.",
        lessons: {
          "fuzzing-trident": {
            title: "Fuzzing con Trident",
          },
          "devnet-testing": {
            title: "Test su Devnet",
          },
          "ci-cd-pipeline": {
            title: "Pipeline CI/CD per Solana",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "Indicizzazione e Analytics Solana",
    description: "Costruisci un indexer eventi Solana di livello produzione con decoding deterministico, contratti di ingestion resilienti, recovery a punto di controllo e output analytics affidabili.",
    modules: {
      "indexing-v2-foundations": {
        title: "Fondamenti di Indicizzazione",
        description: "Modello eventi, decoding di account token e parsing dei metadati transazione per pipeline di indicizzazione affidabili.",
        lessons: {
          "indexing-v2-events-model": {
            title: "Modello eventi: transazioni, log e istruzioni di programma",
          },
          "indexing-v2-token-decoding": {
            title: "Decodifica account token e layout SPL",
          },
          "indexing-v2-decode-token-account": {
            title: "Sfida: decodificare account token + diff dei saldi token",
          },
          "indexing-v2-transaction-meta": {
            title: "Parsing metadati transazione: log, errori e istruzioni interne",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "Pipeline di Indicizzazione e Analytics",
        description: "Normalizzazione transazioni, paginazione/punto di controllo, strategie cache e aggregazione analytics riproducibile.",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "Sfida: indicizzare transazioni in eventi normalizzati",
          },
          "indexing-v2-pagination-caching": {
            title: "Paginazione, punto di controlloing e semantica di cache",
          },
          "indexing-v2-analytics": {
            title: "Aggregazione analytics: metriche per wallet e per token",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "Punto di controllo: produrre un riepilogo analytics JSON stabile",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "Pagamenti e Checkout Solana",
    description: "Costruisci flussi di pagamento Solana di livello produzione con validazione robusta, idempotenza sicura contro replay, webhook sicuri e ricevute deterministiche per la riconciliazione.",
    modules: {
      "payments-v2-foundations": {
        title: "Fondamenti dei Pagamenti",
        description: "Validazione indirizzo, strategia di idempotenza e design del payment intent per un checkout affidabile.",
        lessons: {
          "payments-v2-address-validation": {
            title: "Validazione indirizzo e strategie memo",
          },
          "payments-v2-idempotency": {
            title: "Chiavi di idempotenza e protezione dal replay",
          },
          "payments-v2-payment-intent": {
            title: "Sfida: creare un payment intent con validazione",
          },
          "payments-v2-tx-building": {
            title: "Costruzione transazione e metadati chiave",
          },
        },
      },
      "payments-v2-implementation": {
        title: "Implementareazione e Verifica",
        description: "Costruzione transazione, verifica autenticita webhook e generazione deterministica della ricevuta con gestione chiara degli stati di errore.",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "Sfida: costruire una transazione di trasferimento",
          },
          "payments-v2-webhooks": {
            title: "Firma e verifica dei webhook",
          },
          "payments-v2-error-states": {
            title: "Macchina degli stati di errore e formato ricevuta",
          },
          "payments-v2-webhook-receipt": {
            title: "Sfida: verificare webhook e produrre ricevuta",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "Fondamenti di NFT e cNFT",
    description: "Padroneggia l ingegneria degli NFT compressi su Solana: commitment Merkle, sistemi di proof, modellazione delle collection e controlli di sicurezza di livello produzione.",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "Fondamenti Merkle",
        description: "Costruzione dell albero, hashing foglia, meccanica di inserimento e modello di commitment on-chain/off-chain dietro gli asset compressi.",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "Alberi Merkle per la compressionee dello stato",
          },
          "cnft-v2-leaf-hashing": {
            title: "Convenzioni di hashing foglia e metadata",
          },
          "cnft-v2-merkle-insert": {
            title: "Sfida: implementareare inserimento Merkle + aggiornamenti root",
          },
          "cnft-v2-proof-generation": {
            title: "Generazione proof e calcolo del percorso",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "Sistema di Proof e Sicurezza",
        description: "Generazione e verifica proof, integrita collection e hardening di sicurezza contro replay e spoof dei metadata.",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "Sfida: implementareare generazione proof + verificatore",
          },
          "cnft-v2-collection-minting": {
            title: "Mint di collection e simulazione metadata",
          },
          "cnft-v2-attack-surface": {
            title: "Superficie di attacco: proof invalide e replay",
          },
          "cnft-v2-compression-checkpoint": {
            title: "Punto di controllo: simulare mint + verificare proof di ownership",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "Governance e Tesoreria Multifirma",
    description: "Costruisci sistemi DAO e tesoreria multifirma pronti per la produzione con conteggio voti deterministico, sicurezza timelock e controlli di esecuzione sicuri.",
    modules: {
      "governance-v2-governance": {
        title: "Governance DAO",
        description: "Ciclo di vita delle proposte, meccaniche di voto deterministiche, policy di quorum e sicurezza timelock per una governance DAO credibile.",
        lessons: {
          "governance-v2-dao-model": {
            title: "Modello DAO: proposte, voto ed esecuzione",
          },
          "governance-v2-quorum-math": {
            title: "Matematica del quorum e calcolo del peso di voto",
          },
          "governance-v2-timelocks": {
            title: "Stati del timelock e pianificazione dell esecuzione",
          },
          "governance-v2-quorum-voting": {
            title: "Sfida: implementare una macchina a stati quorum/voto",
          },
        },
      },
      "governance-v2-multisig": {
        title: "Tesoreria Multifirma",
        description: "Costruzione transazioni multifirma, controlli di approvazione, difese anti-ripetizione e pattern sicuri di esecuzione della tesoreria.",
        lessons: {
          "governance-v2-multisig": {
            title: "Costruzione transazioni multifirma e approvazioni",
          },
          "governance-v2-multisig-builder": {
            title: "Sfida: implementare costruttore tx multifirma + regole di approvazione",
          },
          "governance-v2-safe-defaults": {
            title: "Default sicuri: check proprietario e guardie anti-ripetizione",
          },
          "governance-v2-treasury-execution": {
            title: "Sfida: eseguire proposta e produrre diff di tesoreria",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "Prestazioni Solana e Ottimizzazione Compute",
    description: "Padroneggia l ingegneria delle prestazioni Solana con workflow misurabili di ottimizzazione: budget di calcolo, data layout, efficienza di encoding e modellazione deterministica dei costi.",
    modules: {
      "performance-v2-foundations": {
        title: "Fondamenti di Prestazioni",
        description: "Modello compute, decisioni di layout account/dati e stima costi deterministica per ragionare sulle prestazioni a livello transazione.",
        lessons: {
          "performance-v2-compute-model": {
            title: "Modello compute: budget, costi e limiti",
          },
          "performance-v2-account-layout": {
            title: "Design del layout account e costo di serializzazione",
          },
          "performance-v2-cost-model": {
            title: "Sfida: implementareare il modello estimateCost(op)",
          },
          "performance-v2-instruction-data": {
            title: "Dimensione dei dati istruzione e ottimizzazione encoding",
          },
        },
      },
      "performance-v2-optimization": {
        title: "Ottimizzazione e Analisi",
        description: "Ottimizzazione layout, tuning del budget di calcolo e analisi before/after delle prestazioni con salvaguardie di correttezza.",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "Sfida: implementareare layout/codec ottimizzato",
          },
          "performance-v2-compute-budget": {
            title: "Fondamenti delle istruzioni budget di calcolo",
          },
          "performance-v2-micro-optimizations": {
            title: "Micro-ottimizzazioni e tradeoff",
          },
          "performance-v2-perf-checkpoint": {
            title: "Punto di controllo: confrontare before/after + produrre rapporto prestazioni",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "Aggregazione DeFi di Scambio",
    description: "Padroneggia l aggregazione scambio in produzione su Solana: parsing deterministico dei quote, tradeoff di ottimizzazione route, sicurezza slippage ed esecuzione orientata all affidabilita.",
    modules: {
      "swap-v2-fundamentals": {
        title: "Fondamenti di Scambio",
        description: "Meccaniche di scambio token, protezione slippage, composizione route e costruzione deterministica di ScambioPlan con tradeoff trasparenti.",
        lessons: {
          "swap-v2-mental-model": {
            title: "Modello mentale dello scambio: mints, ATAs, decimali e route",
          },
          "swap-v2-slippage": {
            title: "Slippage e price impact: proteggere gli outcome dello scambio",
          },
          "swap-v2-route-explorer": {
            title: "Visualizzazione route: capire leg e fee dello scambio",
          },
          "swap-v2-swap-plan": {
            title: "Sfida: costruire uno ScambioPlan normalizzato da un quote",
          },
        },
      },
      "swap-v2-execution": {
        title: "Esecuzione e Affidabilita",
        description: "Esecuzione con macchina a stati, anatomia transazione, pattern di affidabilita retry/staleness e rapportoing di esecuzione ad alto segnale.",
        lessons: {
          "swap-v2-state-machine": {
            title: "Sfida: implementareare la macchina a stati della UI scambio",
          },
          "swap-v2-tx-anatomy": {
            title: "Anatomia transazione scambio: istruzioni, account e compute",
          },
          "swap-v2-reliability": {
            title: "Pattern di affidabilita: retry, quote stale e latenza",
          },
          "swap-v2-swap-report": {
            title: "Punto di controllo: generare uno ScambioRunRapporto",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "Ingegneria della Liquidita CLMM",
    description: "Padroneggia la liquidita concentrata sui DEX Solana: matematica dei tick, strategia di range, dinamiche fee/IL e rapportoing deterministico delle posizioni LP.",
    modules: {
      "clmm-v2-fundamentals": {
        title: "Fondamenti CLMM",
        description: "Concetti di liquidita concentrata, matematica tick/prezzo e comportamento delle posizioni di range per ragionare sull esecuzione CLMM.",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM vs prodotto costante: perche esistono i tick",
          },
          "clmm-v2-price-tick": {
            title: "Prezzo, tick e sqrtPrice: conversioni fondamentali",
          },
          "clmm-v2-range-explorer": {
            title: "Posizioni di range: dinamiche in-range e out-of-range",
          },
          "clmm-v2-tick-math": {
            title: "Sfida: implementareare helper di conversione tick/prezzo",
          },
        },
      },
      "clmm-v2-positions": {
        title: "Posizioni e Rischio",
        description: "Simulazione dell accumulo fee, tradeoff delle strategie di range, rischi di precisione e rapportoing deterministico del rischio di posizione.",
        lessons: {
          "clmm-v2-position-fees": {
            title: "Sfida: simulare l accumulo fee della posizione",
          },
          "clmm-v2-range-strategy": {
            title: "Strategie di range: stretto, ampio e regole di ribilanciamento",
          },
          "clmm-v2-risk-review": {
            title: "Rischi CLMM: arrotondamento, overflow ed errori di tick spacing",
          },
          "clmm-v2-position-report": {
            title: "Punto di controllo: genera un rapporto di posizione",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "Rischio Prestito e Liquidazione",
    description: "Padroneggia l ingegneria del rischio prestito su Solana: meccaniche di tasso/utilizzo, analisi dei percorsi di liquidazione, sicurezza oracle e rapportoing deterministico di scenario.",
    modules: {
      "lending-v2-fundamentals": {
        title: "Fondamenti del Prestito",
        description: "Meccaniche dei pool di prestito, modelli di tasso guidati dall utilizzo e basi di health factor necessarie per un analisi del rischio difendibile.",
        lessons: {
          "lending-v2-pool-model": {
            title: "Modello di pool prestito: supply, borrow e utilizzo",
          },
          "lending-v2-interest-curves": {
            title: "Curve dei tassi di interesse e modello a kink",
          },
          "lending-v2-health-explorer": {
            title: "Monitoraggio health factor e anteprima di liquidazione",
          },
          "lending-v2-interest-rates": {
            title: "Sfida: calcolare tassi di interesse basati su utilizzo",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "Gestione del Rischio",
        description: "Calcolo health factor, meccaniche di liquidazione, gestione guasti oracle e rapportoing di rischio multi-scenario per mercati sotto stress.",
        lessons: {
          "lending-v2-health-factor": {
            title: "Sfida: calcolare health factor e stato di liquidazione",
          },
          "lending-v2-liquidation-mechanics": {
            title: "Meccaniche di liquidazione: bonus, close factor e bad debt",
          },
          "lending-v2-oracle-risk": {
            title: "Rischio oracle e prezzi stale nel prestito",
          },
          "lending-v2-risk-report": {
            title: "Punto di controllo: genera un rapporto di rischio multi-scenario",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "Console di Rischio Perpetui",
    description: "Padroneggia il rischio perpetui su Solana: contabilita precisa di PnL/funding, monitoraggio del margine, simulazione di liquidazione e rapportoing deterministico su console.",
    modules: {
      "perps-v2-fundamentals": {
        title: "Fondamenti dei Perpetui",
        description: "Meccaniche dei futures perpetui, logica di accumulo del funding e basi di modellazione PnL per diagnosi di posizione accurate.",
        lessons: {
          "perps-v2-mental-model": {
            title: "Futures perpetui: posizioni base, prezzo di ingresso e mark vs oracle",
          },
          "perps-v2-funding": {
            title: "Funding rates: perche esistono e come si accumulano",
          },
          "perps-v2-pnl-explorer": {
            title: "Visualizzazione PnL: monitorare il profitto nel tempo",
          },
          "perps-v2-pnl-calc": {
            title: "Sfida: calcolare il PnL dei futures perpetui",
          },
          "perps-v2-funding-accrual": {
            title: "Sfida: simulare l accumulo del funding rate",
          },
        },
      },
      "perps-v2-risk": {
        title: "Rischio e Monitoraggio",
        description: "Monitoraggio di margine e liquidazione, bug comuni di implementareazione e output deterministici della console di rischio per osservabilita in produzione.",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "Rapporto di margine e soglie di liquidazione",
          },
          "perps-v2-common-bugs": {
            title: "Bug comuni: errori di segno, unita e direzione del funding",
          },
          "perps-v2-risk-console-report": {
            title: "Punto di controllo: genera un rapporto della console di rischio",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "Ottimizzatore di Transazioni DeFi",
    description: "Padroneggia l ottimizzazione delle transazioni DeFi su Solana: tuning compute/fee, strategia ALT, pattern di affidabilita e pianificazione deterministica della strategia di invio.",
    modules: {
      "txopt-v2-fundamentals": {
        title: "Fondamenti di Transazione",
        description: "Diagnosi dei fallimenti di transazione, meccaniche budget di calcolo, strategia priority fee e basi di stima fee.",
        lessons: {
          "txopt-v2-why-fail": {
            title: "Perche le transazioni DeFi falliscono: limiti CU, dimensione ed expirazione blockhash",
          },
          "txopt-v2-compute-budget": {
            title: "Istruzioni budget di calcolo e strategia priority fee",
          },
          "txopt-v2-cost-explorer": {
            title: "Stima del costo transazione e pianificazione fee",
          },
          "txopt-v2-tx-plan": {
            title: "Sfida: costruire un piano transazione con budget di calcoloing",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "Ottimizzazione e Strategia",
        description: "Pianificazione Address Lookup Table, pattern di affidabilita/retry, UX di errore azionabile e rapporto completo della strategia di invio.",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "Sfida: pianificare l uso di Address Lookup Table",
          },
          "txopt-v2-reliability": {
            title: "Pattern di affidabilita: retry, re-quote, resend vs recostruire",
          },
          "txopt-v2-ux-errors": {
            title: "UX: messaggi di errore azionabili per fallimenti transazione",
          },
          "txopt-v2-send-strategy": {
            title: "Punto di controllo: generare un rapporto della strategia di invio",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "Firma Mobile Solana",
    description: "Padroneggia la firma portafoglio mobile in produzione su Solana: sessioni Android MWA, vincoli deep-link iOS, retry resilienti e telemetria di sessione deterministica.",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "Fondamenti di Firma Mobile",
        description: "Vincoli di piattaforma, pattern UX di connessione, comportamento timeline della firma e costruzione tipizzata di request su Android/iOS.",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "Reality check della firma mobile: vincoli Android vs iOS",
          },
          "mobilesign-v2-connection-ux": {
            title: "Pattern UX di connessione portafoglio: connect, reconnect e recovery",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "Timeline sessione di firma: flusso request, portafoglio e risposta",
          },
          "mobilesign-v2-sign-request": {
            title: "Sfida: costruire una sign request tipizzata",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "Pattern di Produzione",
        description: "Persistenza sessione, sicurezza delle schermate di review transazione, macchine a stati di retry e rapporto deterministico di sessione per app mobile in produzione.",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "Sfida: persistenza e ripristino della sessione",
          },
          "mobilesign-v2-review-screens": {
            title: "Review transazione mobile: cosa devono vedere gli utenti",
          },
          "mobilesign-v2-retry-patterns": {
            title: "Retry one-tap: gestire stati offline, rejected e timeout",
          },
          "mobilesign-v2-session-report": {
            title: "Punto di controllo: generare un rapporto di sessione",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "Commercio con Solana Pay",
    description: "Padroneggia l integrazione commercio Solana Pay: encoding URL robusto, workflow di tracking QR/pagamento, UX di conferma e artefatti deterministici per la riconciliazione POS.",
    modules: {
      "solanapay-v2-foundations": {
        title: "Fondamenti di Solana Pay",
        description: "Specifica Solana Pay, rigore nell encoding URL, anatomia delle transfer request e pattern deterministici di costruireer/encoder.",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "Modello mentale Solana Pay e regole di encoding URL",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "Anatomia della transfer request: recipient, amount, reference e labels",
          },
          "solanapay-v2-url-explorer": {
            title: "Costruttore URL: anteprima live delle URL Solana Pay",
          },
          "solanapay-v2-encode-transfer": {
            title: "Sfida: codificare una URL di transfer request Solana Pay",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "Tracking e Commercio",
        description: "Macchine a stati di tracking per reference, UX di conferma, gestione dei guasti e generazione deterministica di ricevuta POS.",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "Sfida: tracciare i reference di pagamento negli stati di conferma",
          },
          "solanapay-v2-confirmation-ux": {
            title: "UX di conferma: stati pending, confirmed ed expired",
          },
          "solanapay-v2-error-handling": {
            title: "Gestione errori e casi limite nei flussi di pagamento",
          },
          "solanapay-v2-pos-receipt": {
            title: "Punto di controllo: genera una ricevuta POS",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "Ingegneria UX Portafoglio",
    description: "Padroneggia l ingegneria UX portafoglio in produzione su Solana: stato di connessione deterministico, sicurezza di rete, resilienza RPC e pattern di affidabilita misurabili.",
    modules: {
      "walletux-v2-fundamentals": {
        title: "Fondamenti di Connessione",
        description: "Design della connessione portafoglio, rete gating e architettura deterministica della macchina a stati per onboarding e riconnessione prevedibili.",
        lessons: {
          "walletux-v2-connection-design": {
            title: "UX di connessione che funziona: lista di verifica di design",
          },
          "walletux-v2-network-gating": {
            title: "Rete gating e recupero da rete errata",
          },
          "walletux-v2-state-explorer": {
            title: "Macchina a stati di connessione: stati, eventi e transizioni",
          },
          "walletux-v2-connection-state": {
            title: "Sfida: implementare la macchina a stati di connessione portafoglio",
          },
        },
      },
      "walletux-v2-production": {
        title: "Pattern di Produzione",
        description: "Invalidazione cache, resilienza e monitoraggio salute RPC, e rapportoing misurabile della qualita UX portafoglio per operazioni in produzione.",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "Sfida: invalidazione cache sugli eventi portafoglio",
          },
          "walletux-v2-rpc-caching": {
            title: "Letture RPC e strategia cache per app portafoglio",
          },
          "walletux-v2-rpc-health": {
            title: "Monitoraggio salute RPC e degradazione graduale",
          },
          "walletux-v2-ux-report": {
            title: "Punto di controllo: generare un Portafoglio UX Rapporto",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "Padroneggia l autenticazione SIWS in produzione su Solana: input standardizzati, invarianti rigorose di verifica, ciclo di vita nonce resistente al replay e reporting pronto per audit.",
    modules: {
      "siws-v2-fundamentals": {
        title: "Fondamenti SIWS",
        description: "Razionale SIWS, semantica rigorosa dei campi input, comportamento di rendering portafoglio e costruzione deterministica del sign-in input.",
        lessons: {
          "siws-v2-why-exists": {
            title: "Perche esiste SIWS: sostituire connect-and-signMessage",
          },
          "siws-v2-input-fields": {
            title: "Campi input SIWS e regole di sicurezza",
          },
          "siws-v2-message-preview": {
            title: "Anteprima messaggio: come i portafoglio mostrano richieste SIWS",
          },
          "siws-v2-sign-in-input": {
            title: "Sfida: costruire un sign-in input SIWS validato",
          },
        },
      },
      "siws-v2-verification": {
        title: "Verifica e Sicurezza",
        description: "Invarianti di verifica server-side, difese nonce anti-replay, gestione sessione e reporting deterministico di audit autenticazione.",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "Sfida: verificare una risposta di sign-in SIWS",
          },
          "siws-v2-sessions": {
            title: "Sessioni e logout: cosa salvare e cosa non salvare",
          },
          "siws-v2-replay-protection": {
            title: "Protezione replay e design del registro nonce",
          },
          "siws-v2-auth-report": {
            title: "Punto di controllo: generare un report di audit autenticazione",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "Commissioni prioritarie e Budget di calcolo",
    description: "Ingegneria difensiva delle fee Solana con pianificazione compute deterministica, politica adattiva di priorita e contratti UX di affidabilita orientati alla conferma.",
    modules: {
      "pfcb-v2-foundations": {
        title: "Fondamenti di Fee e Compute",
        description: "Meccaniche di inclusione, accoppiamento compute/fee e design policy guidato da explorer con framing deterministico di affidabilita.",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "Mercati fee su Solana: cosa muove davvero l inclusione",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "Basi budget di calcolo e modalita di errore comuni",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer: dagli input del planner budget di calcolo al piano",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "Sfida: implementareare planComputeBudget()",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "Percorso Progetto Fee Ottimizzatore",
        description: "Implementareare planner deterministici, motori di policy di conferma e artefatti stabili di strategia fee per review di release.",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "Sfida: implementareare estimatePriorityFee()",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "Sfida: motore decisionale del livello di conferma",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "Sfida: costruire markdown feePlanRiepilogo",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "Punto di controllo: rapporto Fee Ottimizzatore",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "Bundle e Atomicita delle Transazioni",
    description: "Progetta flussi Solana difensivi multi-transazione con validazione deterministica dell atomicita, modellazione della compensazione e rapportoing di sicurezza pronto per audit.",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "Fondamenti di Atomicita",
        description: "Modello di atomicita, rischi dei flussi multi-transazione e validazione difensiva di sicurezza per proteggere le aspettative utente.",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "Concetti di atomicita e perche gli utenti assumono tutto-o-niente",
          },
          "bundles-v2-flow-risk-points": {
            title: "Flussi multi-transazione: approvals, creazione ATA, swap e refunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer: passaggi del flow graph e punti di rischio",
          },
          "bundles-v2-build-atomic-flow": {
            title: "Sfida: implementareare costruireAtomicFlow()",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "Progetto Simulatore Flusso Atomic Swap",
        description: "Implementareare validatori deterministici di atomicita, pattern di gestione failure e composizione stabile dei bundle per review di release.",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "Sfida: implementareare validateAtomicita()",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "Sfida: gestione failure con chiavi di idempotenza",
          },
          "bundles-v2-bundle-composer": {
            title: "Sfida: composer deterministico di bundle",
          },
          "bundles-v2-flow-safety-report": {
            title: "Punto di controllo: rapporto di sicurezza del flusso",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "Realta del Mempool e UX Anti-Sandwich",
    description: "Ingegneria difensiva UX per swap con grading del rischio deterministico, policy di slippage limitate e comunicazione di sicurezza pronta per incidenti.",
    modules: {
      "mempoolux-v2-foundations": {
        title: "Realta del Mempool e Difesa UX",
        description: "Rischi tra quote ed esecuzione, guardrail di slippage e decisioni di freshness per swap piu sicuri in produzione.",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "Cosa puo andare storto tra quote ed esecuzione",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "Controlli di slippage e guardrail",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer: timer di freshness del quote e tabella decisionale",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "Sfida: implementareare evaluateSwapRisk()",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "Percorso Progetto UI Swap Protetta",
        description: "Implementareare guardie slippage, modelli di impatto e configurazioni di protezione esportabili con output deterministico.",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "Sfida: implementareare slippageGuard()",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "Sfida: modellare impatto prezzo vs slippage",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "Sfida: costruire swapSafetyBanner()",
          },
          "mempoolux-v2-protection-config-export": {
            title: "Punto di controllo: export configurazione protezione swap",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "Indexer, Webhook e Pipeline Reorg-Safe",
    description: "Costruisci pipeline di indicizzazione deterministiche di livello produzione per ingestion sicura ai duplicati, gestione reorg e rapportoing orientato all integrita.",
    modules: {
      "indexpipe-v2-foundations": {
        title: "Fondamenti di Affidabilita Indexer",
        description: "Basi di indicizzazione, realta reorg/confirmations e stadi della pipeline per ingestion tracciabili e sicure.",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "Indicizzazione 101: log, account e parsing transazioni",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "Reorg e fork choice: perche confirmed non e finalized",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer: da ingest a dedupe a confirm ad apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "Sfida: implementareare dedupeEvents()",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "Percorso Progetto Indexer Reorg-Safe",
        description: "Implementareare logica confirmations, pianificazione backfill/idempotenza e controlli di integrita per rapporto pipeline stabili.",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "Sfida: implementareare applyWithConfirmations()",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "Sfida: pianificazione backfill e idempotenza",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "Sfida: controlli di integrita snapshot",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "Punto di controllo: export rapporto pipeline",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "Affidabilita RPC e Ingegneria della Latenza",
    description: "Progetta client RPC Solana multi-provider di livello produzione con policy deterministiche di ritento, instradamento, caching e observability.",
    modules: {
      "rpc-v2-foundations": {
        "title": "RPC Reliability Foundations",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, e deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests e fallbacks",
          },
          "rpc-v2-retry-explorer": {
            "title": "Explorer: retry/backoff simulator",
          },
          "rpc-v2-rpc-policy": {
            "title": "Challenge: implement rpcPolicy()",
          },
        },
      },
      "rpc-v2-project-journey": {
        "title": "RPC Multi-Provider Client Project Journey",
        "description": "Build deterministic policy engines per routing, retries, metrics reduction, e health report exports.",
        "lessons": {
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching e invalidation policy",
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer e histogram buckets",
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
          },
        },
      },
    },
  },
  "rust-data-layout-borsh": {
    title: "Struttura Dati Rust e Padronanza Borsh",
    description: "Ingegneria del struttura dati Solana con approccio Rust-first e tooling deterministico byte-level, insieme a pratiche schema sicure per la compatibilita.",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, e pratico parsing safety per stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, e why Solana account care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct e enum layout pitfalls plus Borsh rules",
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer per field offsets",
          },
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
          },
        },
      },
      "rdb-v2-project-journey": {
        "title": "Account Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, e compatibility-focused reporting helpers.",
        "lessons": {
          "rdb-v2-borsh-encode-decode": {
            "title": "Challenge: implement borshEncode/borshDecode helpers",
          },
          "rdb-v2-zero-copy-tradeoffs": {
            "title": "Challenge: zero-copy vs Borsh tradeoff model",
          },
          "rdb-v2-safe-parse-account-data": {
            "title": "Challenge: implement safeParseAccountData()",
          },
          "rdb-v2-layout-report-checkpoint": {
            "title": "Checkpoint: stable layout report",
          },
        },
      },
    },
  },
  "rust-errors-invariants": {
    title: "Errore Design e Invariantei in Rust",
    description: "Costruisci librerie tipizzate di guardie per invariantei con artefatti di evidenza deterministici, contratti erroree compatibili e rapportoing pronto per audit.",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error e Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, e deterministic invariant progettazione fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, e context",
          },
          "rei-v2-invariant-decision-tree": {
            "title": "Explorer: invariant decision tree",
          },
          "rei-v2-invariant-error-helpers": {
            "title": "Challenge: implement InvariantError + ensure helpers",
          },
        },
      },
      "rei-v2-project-journey": {
        "title": "Invariant Guard Library Project Journey",
        "description": "Implement guard helpers, evidence-chain generation, e stable audit reporting per reliability e incident response.",
        "lessons": {
          "rei-v2-evidence-chain-builder": {
            "title": "Challenge: implement deterministic EvidenceChain",
          },
          "rei-v2-property-ish-invariant-tests": {
            "title": "Challenge: deterministic invariant case runner",
          },
          "rei-v2-format-report": {
            "title": "Challenge: implement formatReport() stable markdown",
          },
          "rei-v2-invariant-audit-checkpoint": {
            "title": "Checkpoint: invariant audit report",
          },
        },
      },
    },
  },
  "rust-perf-onchain-thinking": {
    title: "Performance Rust per Pensiero On-chain",
    description: "Simula e ottimizza il comportamento del costo compute con tooling deterministico Rust-first e governance delle performance guidata dal budget.",
    modules: {
      "rpot-v2-foundations": {
        "title": "Prestazioni Foundations",
        "description": "Rust prestazioni modello mentales, data-structure tradeoffs, e deterministic cost reasoning per reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Prestazioni modello mentale: allocations, clones, hashing",
          },
          "rpot-v2-data-structure-tradeoffs": {
            "title": "Data structures: Vec, HashMap, BTreeMap tradeoffs",
          },
          "rpot-v2-cost-sandbox": {
            "title": "Explorer: cost model sandbox",
          },
          "rpot-v2-cost-model-estimate": {
            "title": "Challenge: implement CostModel::estimate()",
          },
        },
      },
      "rpot-v2-project-journey": {
        "title": "Compute Budget Profiler (Sim)",
        "description": "Build deterministic profilers, recommendation engines, e report outputs aligned to explicit prestazioni budgets.",
        "lessons": {
          "rpot-v2-optimize-function-metrics": {
            "title": "Challenge: optimize function metrics",
          },
          "rpot-v2-serialization-costs": {
            "title": "Challenge: model serialization overhead",
          },
          "rpot-v2-suggest-optimizations": {
            "title": "Challenge: implement suggestOptimizations()",
          },
          "rpot-v2-perf-report-checkpoint": {
            "title": "Checkpoint: stable perf report",
          },
        },
      },
    },
  },
  "rust-async-indexer-pipeline": {
    title: "Concorrenza e Asincrono per Indexer (Rust)",
    description: "Ingegneria di pipeline asincrono Rust-first con concorrenza limitata, reducer replay-sicuro e rapportoing operativo deterministico.",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, e deterministic execution modeling per indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits e backpressure",
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph e concurrency",
          },
        },
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, e report exports per reorg-safe pipeline operations.",
        "lessons": {
          "raip-v2-pipeline-run": {
            "title": "Challenge: implement Pipeline::run()",
          },
          "raip-v2-retry-policy": {
            "title": "Challenge: implement RetryPolicy schedule",
          },
          "raip-v2-idempotency-dedupe": {
            "title": "Challenge: idempotency key dedupe",
          },
          "raip-v2-snapshot-reducer": {
            "title": "Challenge: implement SnapshotReducer",
          },
          "raip-v2-pipeline-report-checkpoint": {
            "title": "Checkpoint: pipeline run report",
          },
        },
      },
    },
  },
  "rust-proc-macros-codegen-safety": {
    title: "Macro Procedurali e Generazione codice per la Sicurezza",
    description: "Sicurezza macro/generazione codice in Rust insegnata con parser deterministico e tooling di generazione controlli con output audit-friendly.",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro e Codegen Foundations",
        "description": "Macro modello mentales, constraint DSL progettazione, e safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro modello mentale: declarative vs procedural",
          },
          "rpmcs-v2-codegen-safety-patterns": {
            "title": "Safety through codegen: constraint checks",
          },
          "rpmcs-v2-constraint-builder-explorer": {
            "title": "Explorer: constraint builder to generated checks",
          },
        },
      },
      "rpmcs-v2-project-journey": {
        "title": "Account Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, e publish stable safety reports.",
        "lessons": {
          "rpmcs-v2-parse-attributes": {
            "title": "Challenge: implement parseAttributes()",
          },
          "rpmcs-v2-generate-checks": {
            "title": "Challenge: implement generateChecks()",
          },
          "rpmcs-v2-golden-tests": {
            "title": "Challenge: deterministic golden-file checks",
          },
          "rpmcs-v2-run-generated-checks": {
            "title": "Challenge: runGeneratedChecks()",
          },
          "rpmcs-v2-generated-safety-report": {
            "title": "Checkpoint: generated safety report",
          },
        },
      },
    },
  },
  "anchor-upgrades-migrations": {
    title: "Aggiornamentos Anchor e Migrazioni Account",
    description: "Progetta workflow di release Anchor sicuri per la produzione con pianificazione migrazione deterministica, gate di aggiornamento, playbook rollback ed evidenze di readiness.",
    modules: {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, account versioning strategy, e deterministic upgrade risk modeling per Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Account versioning e migration strategy",
          },
          "aum-v2-upgrade-risk-explorer": {
            "title": "Explorer: upgrade risk matrix",
          },
          "aum-v2-plan-migration-steps": {
            "title": "Challenge: implement migration step planner",
          },
        },
      },
      "aum-v2-module-2": {
        "title": "Migration Execution",
        "description": "Safety validation gates, rollback planning, e deterministic readiness artifacts per controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy e incident playbooks",
          },
          "aum-v2-upgrade-report-markdown": {
            "title": "Challenge: build stable upgrade markdown summary",
          },
          "aum-v2-upgrade-readiness-checkpoint": {
            "title": "Checkpoint: upgrade readiness artifact",
          },
        },
      },
    },
  },
  "solana-reliability": {
    title: "Ingegneria di Affidabilita per Solana",
    description: "Ingegneria di affidabilita orientata alla produzione per sistemi Solana: fault tolerance, retry, deadline, circuit breaker e degradazione graduale con risultati operativi misurabili.",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks con clear failure classification, retry boundaries, e deterministic recovery behavior.",
        "lessons": {
          "lesson-10-1-1": {
            "title": "Understanding Fault Tolerance",
          },
          "lesson-10-1-2": {
            "title": "Retry Mechanism Challenge",
          },
          "lesson-10-1-3": {
            "title": "Deadline Manager Challenge",
          },
          "lesson-10-1-4": {
            "title": "Fallback Handler Challenge",
          },
        },
      },
      "mod-10-2": {
        "title": "Resilience Mechanisms",
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, e rate controls) that protect core user flows during provider instability.",
        "lessons": {
          "lesson-10-2-1": {
            "title": "Resilience Patterns",
          },
          "lesson-10-2-2": {
            "title": "Circuit Breaker Challenge",
          },
          "lesson-10-2-3": {
            "title": "Rate Limiter Challenge",
          },
          "lesson-10-2-4": {
            "title": "Error Classifier Challenge",
          },
        },
      },
    },
  },
  "solana-testing-strategies": {
    title: "Strategie di Test per Solana",
    description: "Strategia di test completa e orientata alla produzione per Solana: test unitari deterministici, integration test realistici, fuzz/property test e rapportoing di confidenza release.",
    modules: {
      "mod-11-1": {
        "title": "Unit e Integration Test",
        "description": "Build deterministic unit e integration test layers con clear ownership of invariants, fixtures, e failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Test Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock Account Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "Avanzato Test Techniques",
        "description": "Use fuzzing, property-based tests, e mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing e Property Test",
          },
          "lesson-11-2-2": {
            "title": "Fuzz Input Generator Challenge",
          },
          "lesson-11-2-3": {
            "title": "Property Verifier Challenge",
          },
          "lesson-11-2-4": {
            "title": "Boundary Value Analyzer Challenge",
          },
        },
      },
    },
  },
  "solana-program-optimization": {
    title: "Ottimizzazione Programmami Solana",
    description: "Progetta performance Solana di livello produzione: compute budgeting, efficienza del layout account, tradeoff memoria/rent e workflow di ottimizzazione deterministici.",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths con explicit CU budgets, operation-level profiling, e predictable prestazioni tradeoffs.",
        "lessons": {
          "lesson-12-1-1": {
            "title": "Understanding Compute Units",
          },
          "lesson-12-1-2": {
            "title": "CU Counter Challenge",
          },
          "lesson-12-1-3": {
            "title": "Data Structure Optimizer Challenge",
          },
          "lesson-12-1-4": {
            "title": "Batch Operation Optimizer Challenge",
          },
        },
      },
      "mod-12-2": {
        "title": "Memory e Storage Optimization",
        "description": "Progettazione memory/storage-efficient account layouts con rent-aware sizing, serialization discipline, e safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Account Data Optimization",
          },
          "lesson-12-2-2": {
            "title": "Data Packer Challenge",
          },
          "lesson-12-2-3": {
            "title": "Rent Calculator Challenge",
          },
          "lesson-12-2-4": {
            "title": "Zero-Copy Deserializer Challenge",
          },
        },
      },
    },
  },
  "solana-tokenomics-design": {
    title: "Design Tokenomics per Solana",
    description: "Progetta economie di token Solana robuste con disciplina di distribuzione, sicurezza vesting, incentivi staking e meccaniche di governance difendibili operativamente.",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution e Vesting",
        "description": "Model token allocation e vesting systems con explicit fairness, unlock predictability, e deterministic accounting rules.",
        "lessons": {
          "lesson-13-1-1": {
            "title": "Token Distribution Fundamentals",
          },
          "lesson-13-1-2": {
            "title": "Vesting Schedule Calculator Challenge",
          },
          "lesson-13-1-3": {
            "title": "Token Allocation Distributor Challenge",
          },
          "lesson-13-1-4": {
            "title": "Release Schedule Generator Challenge",
          },
        },
      },
      "mod-13-2": {
        "title": "Staking e Governance",
        "description": "Progettazione staking e governance mechanics con clear incentive alignment, anti-manipulation constraints, e measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking e Governance Progettazione",
          },
          "lesson-13-2-2": {
            "title": "Staking Calculator Challenge",
          },
          "lesson-13-2-3": {
            "title": "Voting Power Calculator Challenge",
          },
          "lesson-13-2-4": {
            "title": "Proposal Threshold Calculator Challenge",
          },
        },
      },
    },
  },
  "solana-defi-primitives": {
    title: "Primitive DeFi su Solana",
    description: "Costruisci fondamenta DeFi pratiche su Solana: meccaniche AMM, contabilita della liquidita, primitive prestito e pattern di composizione sicuri contro flash loan.",
    modules: {
      "mod-14-1": {
        "title": "AMM e Liquidity",
        "description": "Implement AMM e liquidity primitives con deterministic math, slippage-aware outputs, e LP accounting correctness.",
        "lessons": {
          "lesson-14-1-1": {
            "title": "AMM Fundamentals",
          },
          "lesson-14-1-2": {
            "title": "Constant Product AMM Challenge",
          },
          "lesson-14-1-3": {
            "title": "Liquidity Provider Calculator Challenge",
          },
          "lesson-14-1-4": {
            "title": "Price Oracle Challenge",
          },
        },
      },
      "mod-14-2": {
        "title": "Lending e Flash Loans",
        "description": "Model lending e flash-loan flows con collateral safety, utilization-aware pricing, e strict repayment invariants.",
        "lessons": {
          "lesson-14-2-1": {
            "title": "Lending Protocol Mechanics",
          },
          "lesson-14-2-2": {
            "title": "Collateral Calculator Challenge",
          },
          "lesson-14-2-3": {
            "title": "Interest Rate Model Challenge",
          },
          "lesson-14-2-4": {
            "title": "Flash Loan Validatore Challenge",
          },
        },
      },
    },
  },
  "solana-nft-standards": {
    title: "Standard NFT su Solana",
    description: "Implementarea NFT Solana con standard pronti per la produzione: integrita metadata, disciplina collection e comportamenti avanzati programmabili/non trasferibili.",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality con standards-compliant metadata, collection verification, e deterministic asset-state handling.",
        "lessons": {
          "lesson-15-1-1": {
            "title": "NFT Architecture on Solana",
          },
          "lesson-15-1-2": {
            "title": "NFT Metadata Parser Challenge",
          },
          "lesson-15-1-3": {
            "title": "Collection Manager Challenge",
          },
          "lesson-15-1-4": {
            "title": "Attribute Rarity Calculator Challenge",
          },
        },
      },
      "mod-15-2": {
        "title": "Avanzato NFT Features",
        "description": "Implement avanzato NFT behaviors (soulbound e programmable flows) con explicit policy controls e safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound e Programmable NFTs",
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validatore Challenge",
          },
          "lesson-15-2-3": {
            "title": "Dynamic NFT Updater Challenge",
          },
          "lesson-15-2-4": {
            "title": "NFT Composability Challenge",
          },
        },
      },
    },
  },
  "solana-cpi-patterns": {
    title: "Pattern di Invocazione Inter-programma (CPI)",
    description: "Padroneggia composizione CPI su Solana con validazione account sicura, disciplina signer PDA e pattern deterministici di orchestrazione multi-programma.",
  },
  "solana-mev-strategies": {
    title: "MEV e Ordinamento delle Transazioni",
    description: "Ingegneria di ordinamento transazioni orientata alla produzione su Solana: routing MEV-aware, strategia bundle, modellazione liquidazione/arbitraggio e controlli di esecuzione a tutela utente.",
  },
  "solana-deployment-cicd": {
    title: "Distribuzione Programmami e CI/CD",
    description: "Ingegneria di distribuzione produzione per programmami Solana: strategia ambienti, release gating, controlli qualita CI/CD e workflow operativi upgrade-safe.",
  },
  "solana-cross-chain-bridges": {
    title: "Ponte Cross-chain e Wormhole",
    description: "Costruisci integrazioni cross-chain piu sicure su Solana con messaggistica stile Wormhole, verifica attestations e controlli deterministici dello stato ponte.",
  },
  "solana-oracle-pyth": {
    title: "Integrazione Oracolo e Rete Pyth",
    description: "Integra feed oracolo Solana in sicurezza: validazione prezzo, policy confidence/staleness e aggregazione multi-source per decisioni di protocollo resilienti.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO e Organizzazioni Autonome",
    description: "Costruisci sistemi DAO production-ready su Solana: governance proposte, integrita del voto, controlli tesoreria e workflow deterministici di esecuzione/rapportoing.",
  },
  "solana-gaming": {
    title: "Gioco e Gestione dello Stato di Gioco",
    description: "Costruisci sistemi di gioco on-chain production-ready su Solana: modelli stato efficienti, integrita turno, controlli fairness ed economia scalabile della progressione giocatore.",
  },
  "solana-permanent-storage": {
    title: "Archiviazione Permanente e Arweave",
    description: "Integra archiviazione decentralizzato permanente con Solana tramite workflow stile Arweave: content addressing, integrita manifest e accesso dati verificabile a lungo termine.",
  },
  "solana-staking-economics": {
    title: "Staking ed Economia dei Validator",
    description: "Comprendi staking ed economia validator Solana per decisioni reali: strategia delega, dinamica reward, effetti commissione e sostenibilita operativa.",
  },
  "solana-account-abstraction": {
    title: "Conto Astrazione e Smart Portafoglio",
    description: "Implementarea pattern smart-portafoglio/conto astrazione su Solana con autorizzazione programmabile, controlli recupero e validazione transazioni policy-driven.",
  },
  "solana-pda-mastery": {
    title: "Padronanza Program Derived Address",
    description: "Padroneggia ingegneria avanzata PDA su Solana: design schema seed, disciplina bump e uso sicuro cross-program dei PDA su scala produzione.",
  },
  "solana-economics": {
    title: "Economia Solana e Flussi di Token",
    description: "Analizza dinamiche economiche Solana in contesto produzione: interazione inflation/fee-burn, flussi staking, movimento supply e tradeoff di sostenibilita protocollo.",
  },
};

export const itCourseTranslations: CourseTranslationMap = itCuratedCourseTranslations;
