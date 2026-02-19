import type { CourseTranslationMap } from "./types";

const deCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Solana Grundlagen",
    description: "Produktionsnahe Einfuehrung fuer Einsteiger, die klare Solana-Denkmodelle, staerkere Transaction-Debugging-Skills und deterministische Wallet-Manager-Workflows aufbauen wollen.",
  },
  "anchor-development": {
    title: "Anchor Entwicklung",
    description: "Projektorientierter Kurs fuer den Weg von den Grundlagen zur echten Anchor-Entwicklung: deterministisches Account-Modelling, Instruction-Erstellener, Testdisziplin und zuverlaessige Client-UX.",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor Grundlagen",
        "description": "Anchor architecture, konto constraints, und PDA foundations mit explicit ownership of sicherheit-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor mentales modell",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Konten, constraints, und safety",
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
        "title": "PDAs, Konten, und Tests",
        "description": "Deterministic anweisung builders, stable state emulation, und tests strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment anweisung builder + state layout",
          },
          "anchor-testing-without-flakiness": {
            "title": "Tests strategy without flakiness",
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
    title: "Solana Benutzeroberflaeche Entwicklung",
    description: "Projektorientierter Kurs fuer Benutzeroberflaeche-Ingenieure, die produktionsreife Solana-Uebersichts bauen wollen: deterministische Reducer, replaybare Event-Pipelines und vertrauenswuerdige Transaction-UX.",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "Benutzeroberflaeche Grundlagen fuer Solana",
        description: "Brieftaschen-/Kontostand korrekt modellieren, Transaktionsablauf-UX gestalten und deterministische Regeln fuer nachvollziehbares Debugging durchsetzen.",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "Brieftaschenstatus + Konto-Mentalmodell fuer UI-Entwickler",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "Transaction-Lifecycle fuer UI: ausstehend/bestaetigt/finalisiert, optimistic UI",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "Datenkorrektheit: Dedupe, Reihenfolge, Idempotenz, Korrektur-Events",
          },
          "frontend-v2-core-reducer": {
            title: "Core-State-Modell + Reducer aus Events bauen",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "Token-Uebersicht Projekt",
        description: "Reducer, Replay-Snapshots, Query-Metriken und deterministische Uebersicht-Outputs bauen, die unter teilweisen oder verzoegerten Daten stabil bleiben.",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "Event-Stream-Simulator + Replay-Timeline + Snapshots implementieren",
          },
          "frontend-v2-query-layer-metrics": {
            title: "Query-Layer + berechnete Metriken implementieren",
          },
          "frontend-v2-production-ux-hardening": {
            title: "Production-UX: Caching, Pagination, Error-Banner, Skeletons, Rate Limits",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "Stabile UebersichtSummary aus Fixtures ausgeben",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "DeFi auf Solana",
    description: "Fortgeschrittener Projektkurs fuer Ingenieure, die Tausch-Systeme bauen: deterministische Offline-Planung im Jupiter-Stil, Routen-Ranking, minOut-Sicherheit und reproduzierbare Diagnosen.",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "Tausch Grundlagen",
        description: "CPMM-Mathematik, Quote-Anatomie und Tradeoffs beim deterministischen Routenplanung mit sicherheitsorientierten Nutzerschutzmechanismen verstehen.",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "AMM-Grundlagen auf Solana: Pools, Fees, Slippage und Price Impact",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "Quote-Anatomie: in/out, Fees, minOut und Worst-Case-Execution",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "Routenplanung: warum zwei Hops besser als ein Hop sein koennen",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "Jupiter-Style Tausch Planer Projekt (Offline)",
        description: "Deterministisches Quoting, Routenauswahl und minOut-SicherheitsPruefungen bauen und stabile Kontrollpunkt-Artefakte fuer reproduzierbare Reviews bereitstellen.",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "Token/Pool-Modell + Constant-Product-Quote-Berechnung implementieren",
          },
          "defi-v2-router-best": {
            title: "Routen-Enumeration und Best-Route-Auswahl implementieren",
          },
          "defi-v2-safety-minout": {
            title: "Slippage/minOut, Fee-Breakdown und Sicherheitsinvarianten implementieren",
          },
          "defi-v2-production-swap-ux": {
            title: "Production Tausch UX: veraltet Quotes, Schutzmechanismen und Simulation",
          },
          "defi-v2-checkpoint": {
            title: "Stabilen TauschPlan + TauschSummary Kontrollpunkt erzeugen",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "Solana Sicherheit und Auditing",
    description: "Produktionsnahes deterministisches Vulnerability-Lab fuer Solana-Auditoren mit wiederholbarer Exploit-Evidenz, praeziser Remediation und aussagekraeftigen Audit-Artefakten.",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "Bedrohungsmodell und Audit-Methode",
        description: "Kontozentrierte Bedrohungsmodellierung, deterministische Exploit-Reproduktion und Evidenzdisziplin fuer glaubwuerdige Audit-Befunde.",
        lessons: {
          "security-v2-threat-model": {
            title: "Solana-Bedrohungsmodell fuer Auditoren: Konten, Eigentuemer, Signierer, beschreibbare Konten, PDAs",
          },
          "security-v2-evidence-chain": {
            title: "Evidenzkette: reproduzieren, tracen, impact, fixen, verifizieren",
          },
          "security-v2-bug-classes": {
            title: "Hauefige Solana-Bugklassen und Mitigations",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "Vuln-Lab Projektpfad",
        description: "Exploiten, patchen, verifizieren und audit-reife Artefakte mit deterministischen Traces und invariantenbasierten Schlussfolgerungen liefern.",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Angreifen: fehlende Signierer- und Eigentuemer-Pruefungen ausnutzen",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Angreifen: PDA-Spoof-Unstimmigkeit ausnutzen",
          },
          "security-v2-patch-validate": {
            title: "Fix it: Validierungen + Invariant-Suite",
          },
          "security-v2-writing-reports": {
            title: "Auditberichte schreiben: Severity, Likelihood, Blast Radius, Remediation",
          },
          "security-v2-audit-report-checkpoint": {
            title: "Kontrollpunkt: deterministisches AuditReport JSON + Markdown",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "Token Engineering auf Solana",
    description: "Projektkurs fuer Teams, die reale Solana-Token starten: deterministische Token-2022-Planung, Autoritaetsdesign, Angebots-Simulation und operative Startdisziplin.",
    modules: {
      "token-v2-module-fundamentals": {
        title: "Token Grundlagen -> Token-2022",
        description: "Verstehe Token-Primitives, Mint-Policy-Anatomie und Token-2022-Extension-Kontrollen mit explizitem Governance- und Threat-Model-Rahmen.",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "SPL-Token vs Token-2022: was Extensions veraendern",
          },
          "token-v2-mint-anatomy": {
            title: "Mint-Anatomie: Authorities, Decimals, Supply, Freeze, Mint",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "Extension-Sicherheitsfallen: Fee-Configs, Delegate-Missbrauch, Default-Account-State",
          },
          "token-v2-validate-config-derive": {
            title: "Token-Config validieren + deterministische Adressen offline ableiten",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "Token-Startpaket Projekt",
        description: "Baue deterministische Validierungs-, Planungs- und Simulationsablaeufe, die ueberpruefbare Startartefakte und klare Go/No-Go-Kriterien liefern.",
        lessons: {
          "token-v2-build-init-plan": {
            title: "Token-2022-Initialisierungs-Instruktionsplan bauen",
          },
          "token-v2-simulate-fees-supply": {
            title: "Mint-to + Transfer-Fee-Mathematik + Simulation bauen",
          },
          "token-v2-launch-checklist": {
            title: "Start-Checkliste: Parameter, Upgrade-/Autoritaetsstrategie und Airdrop-/Testplan",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "Stabiles LaunchPackSummary ausgeben",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "Solana Mobil Entwicklung",
    description: "Baue produktionsreife mobil Solana-dApps mit MWA, robuster Wallet-Session-Architektur, expliziter Signing-UX und disziplinierten Distributionsprozessen.",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "Mobil Wallet Adapter",
        description: "Kern-MWA-Protokoll, Session-Lifecycle-Kontrolle und resiliente Wallet-Handoff-Patterns fuer produktionsreife Mobil-Apps.",
        lessons: {
          "mobile-wallet-overview": {
            title: "Mobil-Wallet-Ueberblick",
          },
          "mwa-integration": {
            title: "MWA-Integration",
          },
          "mobile-transaction": {
            title: "Eine Mobil-Transaktionsfunktion bauen",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store und Distribution",
        description: "Publikation, operative Readiness und vertrauenszentrierte Mobil-UX-Praktiken fuer die Verteilung von Solana-Apps.",
        lessons: {
          "dapp-store-submission": {
            title: "dApp-Store-Einreichung",
          },
          "mobile-best-practices": {
            title: "Mobil Best Practices",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "Tests von Solana Programmen",
    description: "Baue robuste Solana-Testsysteme ueber lokale, simulierte und Netzwerk-Umgebungen mit expliziten Sicherheitsinvarianten und release-tauglichen Confidence-Gates.",
    modules: {
      "module-testing-foundations": {
        title: "Tests Grundlagen",
        description: "Kern-Teststrategie ueber Unit/Integration-Ebenen mit deterministischen Workflows und Abdeckung adversarialer Faelle.",
        lessons: {
          "testing-approaches": {
            title: "Tests-Ansatze",
          },
          "bankrun-testing": {
            title: "Bankrun-Tests",
          },
          "write-bankrun-test": {
            title: "Einen Counter-Program-Bankrun-Test schreiben",
          },
        },
      },
      "module-advanced-testing": {
        title: "Advanced Tests",
        description: "Fuzzing, Devnet-Validierung und CI/CD-Release-Kontrollen fuer sicherere Protokollaenderungen.",
        lessons: {
          "fuzzing-trident": {
            title: "Fuzzing mit Trident",
          },
          "devnet-testing": {
            title: "Devnet-Tests",
          },
          "ci-cd-pipeline": {
            title: "CI/CD-Pipeline fuer Solana",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "Solana Indexierung und Analytics",
    description: "Baue einen produktionsreifen Solana-Event-Indexer mit deterministischem Decoding, resilienten Ingestion-Vertraegen, Kontrollpunkt-Recovery und verlaesslichen Analytics-Outputs.",
    modules: {
      "indexing-v2-foundations": {
        title: "Indexierung Grundlagen",
        description: "Event-Modell, Token-Account-Decoding und Transaction-Meta-Parsing fuer zuverlaessige Indexierung-Pipelines.",
        lessons: {
          "indexing-v2-events-model": {
            title: "Event-Modell: Transactions, Logs und Program Instructions",
          },
          "indexing-v2-token-decoding": {
            title: "Token-Account-Decoding und SPL-Layout",
          },
          "indexing-v2-decode-token-account": {
            title: "Aufgabe: Token-Account decodieren + Token-Balance-Diff bilden",
          },
          "indexing-v2-transaction-meta": {
            title: "Transaction-Meta-Parsing: Logs, Fehler und innere Instructions",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "Indexierung-Pipeline und Analytics",
        description: "Transaction-Normalisierung, Pagination/Kontrollpunkts, Caching-Strategien und reproduzierbare Analytics-Aggregation.",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "Aufgabe: Transactions zu normalisierten Events indexieren",
          },
          "indexing-v2-pagination-caching": {
            title: "Pagination, Kontrollpunkting und Caching-Semantik",
          },
          "indexing-v2-analytics": {
            title: "Analytics-Aggregation: Metriken pro Wallet und pro Token",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "Kontrollpunkt: stabile JSON-Analytics-Zusammenfassung erzeugen",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "Solana Zahlungen und Checkout Flows",
    description: "Baue produktionsreife Solana-Zahlungsfluesse mit robuster Validierung, replay-sicherer Idempotenz, sicheren Webhooks und deterministischen Receipts fuer die Reconciliation.",
    modules: {
      "payments-v2-foundations": {
        title: "Payment Grundlagen",
        description: "Adressvalidierung, Idempotenzstrategie und Payment-Intent-Design fuer zuverlaessiges Checkout-Verhalten.",
        lessons: {
          "payments-v2-address-validation": {
            title: "Adressvalidierung und Memo-Strategien",
          },
          "payments-v2-idempotency": {
            title: "Idempotenzschluessel und Replay-Schutz",
          },
          "payments-v2-payment-intent": {
            title: "Aufgabe: Payment Intent mit Validierung erstellen",
          },
          "payments-v2-tx-building": {
            title: "Transaction-Erstellening und Schluessel-Metadaten",
          },
        },
      },
      "payments-v2-implementation": {
        title: "Implementierenierung und Verifikation",
        description: "Transaction-Erstellening, Webhook-Authentizitaetspruefung und deterministische Receipt-Generierung mit klarem Error-State-Handling.",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "Aufgabe: Transfer-Transaktion bauen",
          },
          "payments-v2-webhooks": {
            title: "Webhook-Signierung und Verifikation",
          },
          "payments-v2-error-states": {
            title: "Error-State-Maschine und Receipt-Format",
          },
          "payments-v2-webhook-receipt": {
            title: "Aufgabe: Webhook verifizieren und Receipt erzeugen",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "NFT- und cNFT-Grundlagen",
    description: "Beherrsche komprimierte NFT-Engineering-Patterns auf Solana: Merkle-Commitments, Proof-Systeme, Collection-Modellierung und Sicherheitschecks auf Produktionsniveau.",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "Merkle Grundlagen",
        description: "Baumkonstruktion, Leaf-Hashing, Insert-Mechanik und das On-chain/Off-chain-Commitment-Modell hinter komprimierten Assets.",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "Merkle-Baeume fuer State-Komprimierung",
          },
          "cnft-v2-leaf-hashing": {
            title: "Leaf-Hashing-Konventionen und Metadata",
          },
          "cnft-v2-merkle-insert": {
            title: "Aufgabe: Merkle-Insert + Root-Updates implementierenieren",
          },
          "cnft-v2-proof-generation": {
            title: "Proof-Generierung und Pfadberechnung",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "Proof-System und Sicherheit",
        description: "Proof-Generierung, Verifikation, Collection-Integritaet und Security-Hardening gegen Replay und Metadata-Spoofing.",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "Aufgabe: Proof-Generierung + Verifier implementierenieren",
          },
          "cnft-v2-collection-minting": {
            title: "Collection-Mints und Metadata-Simulation",
          },
          "cnft-v2-attack-surface": {
            title: "Angriffsflaeche: ungueltige Proofs und Replay",
          },
          "cnft-v2-compression-checkpoint": {
            title: "Kontrollpunkt: Mint simulieren + Ownership-Proof verifizieren",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "Governance und Multisignatur-Tresor Ops",
    description: "Baue produktionsreife DAO-Governance- und Multisignatur-Tresor-Systeme mit deterministischer Vote-Abrechnung, Timelock-Sicherheit und sicheren Ausfuehrungskontrollen.",
    modules: {
      "governance-v2-governance": {
        title: "DAO Governance",
        description: "Vorschlag-Lifecycle, deterministische Abstimmung-Mechaniken, Quorum-Policy und Timelock-Sicherheit fuer glaubwuerdige DAO-Governance.",
        lessons: {
          "governance-v2-dao-model": {
            title: "DAO-Modell: Vorschlags, Abstimmung und Ausfuehrung",
          },
          "governance-v2-quorum-math": {
            title: "Quorum-Mathematik und Vote-Weight-Berechnung",
          },
          "governance-v2-timelocks": {
            title: "Timelock-States und Ausfuehrung-Scheduling",
          },
          "governance-v2-quorum-voting": {
            title: "Aufgabe: Quorum/Abstimmung-Statusmaschine implementieren",
          },
        },
      },
      "governance-v2-multisig": {
        title: "Multisignatur Tresor",
        description: "Multisignatur-Transaction-Aufbau, Approval-Kontrollen, Replay-Abwehr und sichere Tresor-Ausfuehrung-Patterns.",
        lessons: {
          "governance-v2-multisig": {
            title: "Multisignatur-Transaction-Building und Approvals",
          },
          "governance-v2-multisig-builder": {
            title: "Aufgabe: Multisignatur-Tx-Generator + Approval-Regeln implementieren",
          },
          "governance-v2-safe-defaults": {
            title: "Sichere Standardeinstellungen: Owner-Checks und Replay-Guards",
          },
          "governance-v2-treasury-execution": {
            title: "Aufgabe: Vorschlag ausfuehren und Tresor-Diff erzeugen",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "Solana Leistung und Compute-Optimierung",
    description: "Beherrsche Solana-Leistung-Engineering mit messbaren Optimierungs-Workflows: Compute-Budgets, Datenlayouts, Encoding-Effizienz und deterministische Kostenmodellierung.",
    modules: {
      "performance-v2-foundations": {
        title: "Leistung Grundlagen",
        description: "Compute-Modell, Account/Daten-Layout-Entscheidungen und deterministische Kostenschaetzung fuer Leistung-Reasoning auf Transaktionsebene.",
        lessons: {
          "performance-v2-compute-model": {
            title: "Compute-Modell: Budgets, Kosten und Limits",
          },
          "performance-v2-account-layout": {
            title: "Account-Layout-Design und Serialisierungskosten",
          },
          "performance-v2-cost-model": {
            title: "Aufgabe: estimateCost(op)-Modell implementierenieren",
          },
          "performance-v2-instruction-data": {
            title: "Instruction-Data-Groesse und Encoding-Optimierung",
          },
        },
      },
      "performance-v2-optimization": {
        title: "Optimierung und Analyse",
        description: "Layout-Optimierung, Compute-Budget-Tuning und Before/After-Leistung-Analyse mit Korrektheits-Schutzmechanismen.",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "Aufgabe: optimiertes Layout/Codec implementierenieren",
          },
          "performance-v2-compute-budget": {
            title: "Grundlagen von Compute-Budget-Instruktionen",
          },
          "performance-v2-micro-optimizations": {
            title: "Mikro-Optimierungen und Tradeoffs",
          },
          "performance-v2-perf-checkpoint": {
            title: "Kontrollpunkt: Before/After vergleichen + Leistung-Bericht ausgeben",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "DeFi Tausch Aggregation",
    description: "Beherrsche produktionsreife Tausch-Aggregation auf Solana: deterministisches Quote-Parsing, Route-Optimierungs-Tradeoffs, Slippage-Sicherheit und zuverlaessigkeitsorientierte Ausfuehrung.",
    modules: {
      "swap-v2-fundamentals": {
        title: "Tausch Grundlagen",
        description: "Token-Tausch-Mechanik, Slippage-Schutz, Route-Komposition und deterministische TauschPlan-Konstruktion mit transparenten Tradeoffs.",
        lessons: {
          "swap-v2-mental-model": {
            title: "Tausch-Mentalmodell: Mints, ATAs, Decimals und Routen",
          },
          "swap-v2-slippage": {
            title: "Slippage und Price Impact: Tausch-Ergebnisse schuetzen",
          },
          "swap-v2-route-explorer": {
            title: "Routen-Visualisierung: Tausch-Legs und Fees verstehen",
          },
          "swap-v2-swap-plan": {
            title: "Aufgabe: normalisierten TauschPlan aus einem Quote bauen",
          },
        },
      },
      "swap-v2-execution": {
        title: "Ausfuehrung und Reliability",
        description: "State-Machine-Ausfuehrung, Transaction-Anatomie, Retry/Staleness-Reliability-Patterns und aussagekraeftiges Tausch-Run-Berichting.",
        lessons: {
          "swap-v2-state-machine": {
            title: "Aufgabe: Tausch-UI-State-Machine implementierenieren",
          },
          "swap-v2-tx-anatomy": {
            title: "Tausch-Transaction-Anatomie: Instructions, Accounts und Compute",
          },
          "swap-v2-reliability": {
            title: "Reliability-Patterns: Retries, stale Quotes und Latenz",
          },
          "swap-v2-swap-report": {
            title: "Kontrollpunkt: einen TauschRunBericht generieren",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "CLMM-Liquiditaetsengineering",
    description: "Beherrsche konzentrierte Liquiditaet auf Solana-DEXs: Tick-Mathematik, Range-Strategie-Design, Fee/IL-Dynamik und deterministisches Berichting von LP-Positionen.",
    modules: {
      "clmm-v2-fundamentals": {
        title: "CLMM Grundlagen",
        description: "Konzepte konzentrierter Liquiditaet, Tick/Preis-Mathematik und Verhalten von Range-Positionen fuer belastbares Verstaendnis der CLMM-Ausfuehrung.",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM vs Constant Product: warum Ticks existieren",
          },
          "clmm-v2-price-tick": {
            title: "Preis, Tick und sqrtPrice: zentrale Konvertierungen",
          },
          "clmm-v2-range-explorer": {
            title: "Range-Positionen: In-Range- und Out-of-Range-Dynamik",
          },
          "clmm-v2-tick-math": {
            title: "Aufgabe: Tick/Preis-Konvertierungs-Helper implementierenieren",
          },
        },
      },
      "clmm-v2-positions": {
        title: "Positionen und Risiko",
        description: "Fee-Akkumulationssimulation, Tradeoffs von Range-Strategien, Praezisionsrisiken und deterministisches Positions-Risikoberichting.",
        lessons: {
          "clmm-v2-position-fees": {
            title: "Aufgabe: Fee-Akkumulation einer Position simulieren",
          },
          "clmm-v2-range-strategy": {
            title: "Range-Strategien: eng, breit und Rebalancing-Regeln",
          },
          "clmm-v2-risk-review": {
            title: "CLMM-Risiken: Rundung, Overflow und Tick-Spacing-Fehler",
          },
          "clmm-v2-position-report": {
            title: "Kontrollpunkt: Einen Positionsbericht erzeugen",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "Kredit- und Liquidationsrisiko",
    description: "Beherrsche Solana-Kredit-Risiko-Engineering: Utilization- und Zinsmechanik, Analyse von Liquidationspfaden, Oracle-Sicherheit und deterministische Szenario-Berichts.",
    modules: {
      "lending-v2-fundamentals": {
        title: "Kredit Grundlagen",
        description: "Mechanik von Kredit-Pools, nutzungsgetriebene Zinsmodelle und Health-Factor-Grundlagen fuer belastbare Risikoanalysen.",
        lessons: {
          "lending-v2-pool-model": {
            title: "Kredit-Pool-Modell: Supply, Borrow und Utilization",
          },
          "lending-v2-interest-curves": {
            title: "Zinskurven und das Kink-Modell",
          },
          "lending-v2-health-explorer": {
            title: "Health-Factor-Monitoring und Liquidationsvorschau",
          },
          "lending-v2-interest-rates": {
            title: "Aufgabe: Utilization-basierte Zinsen berechnen",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "Risikomanagement",
        description: "Health-Factor-Berechnung, Liquidationsmechanik, Umgang mit Oracle-Ausfaellen und Multi-Szenario-Risikoberichting fuer Stressmaerkte.",
        lessons: {
          "lending-v2-health-factor": {
            title: "Aufgabe: Health Factor und Liquidationsstatus berechnen",
          },
          "lending-v2-liquidation-mechanics": {
            title: "Liquidationsmechanik: Bonus, Close Factor und Bad Debt",
          },
          "lending-v2-oracle-risk": {
            title: "Oracle-Risiko und veraltete Preise im Kredit",
          },
          "lending-v2-risk-report": {
            title: "Kontrollpunkt: Einen Multi-Szenario-Risikobericht erzeugen",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "Perpetuals Risiko Konsole",
    description: "Beherrsche Perpetuals-Risiko-Engineering auf Solana: praezise PnL/Funding-Abrechnung, Margin-Monitoring, Liquidationssimulation und deterministisches Konsole-Berichting.",
    modules: {
      "perps-v2-fundamentals": {
        title: "Perpetuals Grundlagen",
        description: "Mechanik von Perpetual Futures, Funding-Akkumulationslogik und PnL-Modellierungsgrundlagen fuer praezise Positionsdiagnosen.",
        lessons: {
          "perps-v2-mental-model": {
            title: "Perpetual Futures: Basispositionen, Einstiegspreis und Mark vs Oracle",
          },
          "perps-v2-funding": {
            title: "Funding Rates: warum sie existieren und wie sie akkumulieren",
          },
          "perps-v2-pnl-explorer": {
            title: "PnL-Visualisierung: Gewinnentwicklung ueber die Zeit verfolgen",
          },
          "perps-v2-pnl-calc": {
            title: "Aufgabe: PnL fuer Perpetual Futures berechnen",
          },
          "perps-v2-funding-accrual": {
            title: "Aufgabe: Funding-Accrual simulieren",
          },
        },
      },
      "perps-v2-risk": {
        title: "Risiko und Monitoring",
        description: "Margin- und Liquidationsmonitoring, typische Implementierenierungsfehler und deterministische Risiko-Konsole-Ausgaben fuer Production-Observability.",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "Margin Ratio und Liquidationsschwellen",
          },
          "perps-v2-common-bugs": {
            title: "Haeufige Bugs: Vorzeichenfehler, Einheiten und Funding-Richtung",
          },
          "perps-v2-risk-console-report": {
            title: "Kontrollpunkt: Einen Risiko-Konsole-Bericht erzeugen",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "DeFi Transaction Optimierer",
    description: "Beherrsche Solana-DeFi-Transaktionsoptimierung: Compute/Fee-Tuning, ALT-Strategie, Reliability-Patterns und deterministische Planung von Sendestrategien.",
    modules: {
      "txopt-v2-fundamentals": {
        title: "Transaction Grundlagen",
        description: "Diagnose von Transaction-Fehlschlaegen, Compute-Budget-Mechanik, Priority-Fee-Strategie und Grundlagen der Fee-Schaetzung.",
        lessons: {
          "txopt-v2-why-fail": {
            title: "Warum DeFi-Transactions scheitern: CU-Limits, Groesse und Blockhash-Ablauf",
          },
          "txopt-v2-compute-budget": {
            title: "Compute-Budget-Instructions und Priority-Fee-Strategie",
          },
          "txopt-v2-cost-explorer": {
            title: "Transaction-Kostenschaetzung und Fee-Planung",
          },
          "txopt-v2-tx-plan": {
            title: "Aufgabe: einen Transaction-Plan mit Compute-Budgeting bauen",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "Optimierung und Strategie",
        description: "Address-Lookup-Table-Planung, Reliability/Retry-Patterns, actionable Error-UX und vollstaendiges Send-Strategy-Berichting.",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "Aufgabe: Einsatz von Address Lookup Tables planen",
          },
          "txopt-v2-reliability": {
            title: "Reliability-Patterns: retry, re-quote, resend vs reerstellen",
          },
          "txopt-v2-ux-errors": {
            title: "UX: actionable Fehlermeldungen bei Transaction-Fehlern",
          },
          "txopt-v2-send-strategy": {
            title: "Kontrollpunkt: einen Send-Strategy-Bericht erzeugen",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "Solana Mobile Signing",
    description: "Beherrsche produktionsreifes mobiles Brieftasche-Signing auf Solana: Android-MWA-Sessions, iOS-Deep-Link-Constraints, resiliente Retries und deterministische Session-Telemetrie.",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "Mobile-Signing Grundlagen",
        description: "Plattform-Constraints, Connection-UX-Patterns, Signing-Timeline-Verhalten und typisierte Request-Konstruktion ueber Android/iOS.",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "Mobile-Signing-Reality-Check: Android- vs iOS-Constraints",
          },
          "mobilesign-v2-connection-ux": {
            title: "Brieftasche-Connection-UX-Patterns: connect, reconnect und recovery",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "Signing-Session-Timeline: request-, brieftasche- und response-Flow",
          },
          "mobilesign-v2-sign-request": {
            title: "Aufgabe: eine typisierte Sign-Request bauen",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "Production Patterns",
        description: "Session-Persistenz, Sicherty bei Transaction-Review-Screens, Retry-Statusmaschinen und deterministisches Session-Berichting fuer produktive Mobile-Apps.",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "Aufgabe: Session-Persistenz und Wiederherstellung",
          },
          "mobilesign-v2-review-screens": {
            title: "Mobile-Transaction-Review: was Nutzer sehen muessen",
          },
          "mobilesign-v2-retry-patterns": {
            title: "One-Tap-Retry: offline-, rejected- und timeout-Statuss behandeln",
          },
          "mobilesign-v2-session-report": {
            title: "Kontrollpunkt: einen Session-Bericht erzeugen",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "Solana Pay Handel",
    description: "Beherrsche Solana-Pay-Handel-Integration: robustes URL-Encoding, QR-/Payment-Tracking-Workflows, Confirmation-UX und deterministische POS-Reconciliation-Artefakte.",
    modules: {
      "solanapay-v2-foundations": {
        title: "Solana Pay Grundlagen",
        description: "Solana-Pay-Spezifikation, striktes URL-Encoding, Anatomie von Transfer Requests und deterministische Erstellener/Encoder-Patterns.",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "Solana-Pay-Mentalmodell und URL-Encoding-Regeln",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "Transfer-Request-Anatomie: recipient, amount, reference und labels",
          },
          "solanapay-v2-url-explorer": {
            title: "URL-Erstellener: Live-Vorschau fuer Solana-Pay-URLs",
          },
          "solanapay-v2-encode-transfer": {
            title: "Aufgabe: eine Solana-Pay-Transfer-Request-URL encodieren",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "Tracking und Handel",
        description: "Reference-Tracking-Statusmaschinen, Confirmation-UX, Fehlerbehandlung und deterministische POS-Receipt-Generierung.",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "Aufgabe: Payment-References durch Confirmation-States verfolgen",
          },
          "solanapay-v2-confirmation-ux": {
            title: "Confirmation-UX: pending-, confirmed- und expired-States",
          },
          "solanapay-v2-error-handling": {
            title: "Fehlerbehandlung und Edge Cases in Payment-Flows",
          },
          "solanapay-v2-pos-receipt": {
            title: "Kontrollpunkt: eine POS-Receipt erzeugen",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "Brieftaschen-UX-Engineering",
    description: "Beherrsche produktionsreifes Brieftasche-UX-Engineering auf Solana: deterministischer Verbindungszustand, Netzwerksicherheit, RPC-Resilienz und messbare Zuverlaessigkeit-Patterns.",
    modules: {
      "walletux-v2-fundamentals": {
        title: "Verbindungsgrundlagen",
        description: "Brieftasche-Connection-Design, Netzwerk-Gating und deterministische Status-Machine-Architektur fuer vorhersehbares Onboarding und Reconnect-Pfade.",
        lessons: {
          "walletux-v2-connection-design": {
            title: "Verbindungs-UX, die funktioniert: eine Design-Pruefliste",
          },
          "walletux-v2-network-gating": {
            title: "Netzwerk-Gating und Recovery bei falschem Netzwerk",
          },
          "walletux-v2-state-explorer": {
            title: "Verbindungszustandsmaschine: Status, Events und Uebergaenge",
          },
          "walletux-v2-connection-state": {
            title: "Aufgabe: Brieftaschen-Verbindungszustandsmaschine implementieren",
          },
        },
      },
      "walletux-v2-production": {
        title: "Production Patterns",
        description: "Cache-Invalidierung, RPC-Resilienz und Health-Monitoring sowie messbare Brieftaschen-UX-Qualitaetsberichte fuer Produktionsbetrieb.",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "Aufgabe: Cache-Invalidierung bei Brieftasche-Events",
          },
          "walletux-v2-rpc-caching": {
            title: "RPC-Reads und Caching-Strategie fuer Brieftasche-Apps",
          },
          "walletux-v2-rpc-health": {
            title: "RPC-Health-Monitoring und Graceful Degradation",
          },
          "walletux-v2-ux-report": {
            title: "Kontrollpunkt: einen Brieftasche UX Bericht generieren",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "Beherrsche produktionsreife SIWS-Authentifizierung auf Solana: standardisierte Inputs, strikte Verifikationsinvarianten, replay-resistenter Nonce-Lifecycle und audit-faehiges Reporting.",
    modules: {
      "siws-v2-fundamentals": {
        title: "SIWS Grundlagen",
        description: "SIWS-Rationale, strikte Input-Feld-Semantik, Brieftaschen-Darstellungsverhalten und deterministische Konstruktion von Sign-in-Inputs.",
        lessons: {
          "siws-v2-why-exists": {
            title: "Warum SIWS existiert: connect-and-signMessage ersetzen",
          },
          "siws-v2-input-fields": {
            title: "SIWS-Input-Felder und Sicherheitsregeln",
          },
          "siws-v2-message-preview": {
            title: "Message-Preview: wie Wallets SIWS-Requests darstellen",
          },
          "siws-v2-sign-in-input": {
            title: "Challenge: validierten SIWS-Sign-in-Input bauen",
          },
        },
      },
      "siws-v2-verification": {
        title: "Verifikation und Sicherheit",
        description: "Server-seitige Verifikationsinvarianten, Nonce-Replay-Abwehr, Session-Management und deterministisches Auth-Audit-Reporting.",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "Challenge: eine SIWS-Sign-in-Response verifizieren",
          },
          "siws-v2-sessions": {
            title: "Sessions und Logout: was speichern und was nicht speichern",
          },
          "siws-v2-replay-protection": {
            title: "Replay-Schutz und Nonce-Registry-Design",
          },
          "siws-v2-auth-report": {
            title: "Kontrollpunkt: einen Auth-Audit-Report generieren",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "Prioritaetsgebuehren und Compute-Budget",
    description: "Defensive Solana-Fee-Engineering mit deterministischer Compute-Planung, adaptiver Priority-Policy und bestaetigungsorientierten UX-Reliability-Vertraegen.",
    modules: {
      "pfcb-v2-foundations": {
        title: "Fee- und Compute-Grundlagen",
        description: "Inclusion-Mechanik, Compute/Fee-Kopplung und explorer-getriebenes Policy-Design mit deterministischem Reliability-Fokus.",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "Fee-Maerkte auf Solana: was Inclusion wirklich bewegt",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "Compute-Budget-Grundlagen und haeufige Failure-Modes",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer: von Compute-Budget-Planer-Inputs zum Plan",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "Aufgabe: planComputeBudget() implementierenieren",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "Fee-Optimierer-Projektpfad",
        description: "Deterministische Planer, Confirmation-Policy-Engines und stabile Fee-Strategie-Artefakte fuer Release-Review implementierenieren.",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "Aufgabe: estimatePriorityFee() implementierenieren",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "Aufgabe: Decision-Engine fuer Confirmation-Level",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "Aufgabe: feePlanZusammenfassung-Markdown bauen",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "Kontrollpunkt: Fee-Optimierer-Bericht",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "Buendel und Transaction Atomaritaet",
    description: "Entwirf defensive Multi-Transaction-Solana-Flows mit deterministischer Atomaritaet-Validierung, Kompensationsmodellierung und audit-faehigem Sicherheitsberichting.",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "Atomaritaet Grundlagen",
        description: "Atomaritaet-Modell, Risiken in Multi-Transaction-Flows und defensive Sicherheitsvalidierung zum Schutz von Nutzererwartungen.",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "Atomaritaet-Konzepte und warum Nutzer All-or-Nothing erwarten",
          },
          "bundles-v2-flow-risk-points": {
            title: "Multi-Transaction-Flows: Approvals, ATA-Erstellung, Swaps und Refunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer: Flow-Graph-Schritte und Risikopunkte",
          },
          "bundles-v2-build-atomic-flow": {
            title: "Aufgabe: erstellenAtomicFlow() implementierenieren",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "Atomic-Swap-Flow-Simulator-Projekt",
        description: "Deterministische Atomaritaet-Validatoren, Failure-Handling-Patterns und stabile Bundle-Komposition fuer Release-Reviews implementierenieren.",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "Aufgabe: validateAtomaritaet() implementierenieren",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "Aufgabe: Failure-Handling mit Idempotency-Keys",
          },
          "bundles-v2-bundle-composer": {
            title: "Aufgabe: deterministischen Bundle-Composer bauen",
          },
          "bundles-v2-flow-safety-report": {
            title: "Kontrollpunkt: Flow-Safety-Bericht",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "Mempool-Realitaet und Anti-Sandwich-UX",
    description: "Defensives Swap-UX-Engineering mit deterministischer Risikoeinstufung, begrenzten Slippage-Policies und incident-ready Sicherheitskommunikation.",
    modules: {
      "mempoolux-v2-foundations": {
        title: "Mempool-Realitaet und UX-Defense",
        description: "Risiken zwischen Quote und Ausfuehrung, Slippage-Guardrails und Freshness-Entscheidungen fuer sicherere Produktions-Swaps.",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "Was zwischen Quote und Ausfuehrung schiefgehen kann",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "Slippage-Kontrollen und Guardrails",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer: Quote-Freshness-Timer und Entscheidungstabelle",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "Aufgabe: evaluateSwapRisk() implementierenieren",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "Protected-Swap-UI-Projektpfad",
        description: "Slippage-Guards, Impact-Modelle und exportierbare Schutzkonfigurationen mit deterministischem Output implementierenieren.",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "Aufgabe: slippageGuard() implementierenieren",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "Aufgabe: Price-Impact vs Slippage modellieren",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "Aufgabe: swapSafetyBanner() bauen",
          },
          "mempoolux-v2-protection-config-export": {
            title: "Kontrollpunkt: Export der Swap-Schutzkonfiguration",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "Indexer, Webhooks und Reorg-Safe Pipelines",
    description: "Baue produktionsreife deterministische Indexierung-Pipelines fuer duplicate-sichere Ingestion, Reorg-Handling und integritaetsorientiertes Berichting.",
    modules: {
      "indexpipe-v2-foundations": {
        title: "Indexer-Reliability-Grundlagen",
        description: "Indexierung-Basics, Reorg/Confirmation-Realitaet und Pipeline-Stufen fuer nachvollziehbare und sichere Ingestion.",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "Indexierung 101: Logs, Accounts und Transaction-Parsing",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "Reorgs und Fork-Choice: warum confirmed nicht finalized ist",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer: ingest zu dedupe zu confirm zu apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "Aufgabe: dedupeEvents() implementierenieren",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "Reorg-Safe-Indexer-Projektpfad",
        description: "Confirmation-Logik, Backfill/Idempotency-Planung und Integrity-Checks fuer stabile Pipeline-Berichts implementierenieren.",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "Aufgabe: applyWithConfirmations() implementierenieren",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "Aufgabe: Backfill- und Idempotency-Planung",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "Aufgabe: Snapshot-Integrity-Checks",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "Kontrollpunkt: Pipeline-Bericht-Export",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "RPC-Zuverlaessigkeit und Latenz Engineering",
    description: "Entwickle produktionsreife Multi-Provider-Solana-RPC-Clients mit deterministischen Wiederholung-, Routenplanung-, Caching- und Observability-Policies.",
    modules: {
      "rpc-v2-foundations": {
        "title": "RPC-Zuverlaessigkeitsgrundlagen",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, und deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests und fallbacks",
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
        "title": "Projektpfad fuer Multi-Provider-RPC-Clients",
        "description": "Build deterministic policy engines fuer routing, retries, metrics reduction, und health report exports.",
        "lessons": {
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching und invalidation policy",
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer und histogram buckets",
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
          },
        },
      },
    },
  },
  "rust-data-layout-borsh": {
    title: "Rust Daten Struktur und Borsh Mastery",
    description: "Rust-first Solana-Daten-Struktur-Engineering mit deterministischen Byte-Level-Tooling und kompatibilitaetssicheren Schema-Praktiken.",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, und praktisch parsing safety fuer stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, und why Solana konten care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct und enum layout pitfalls plus Borsh rules",
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer fuer field offsets",
          },
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
          },
        },
      },
      "rdb-v2-project-journey": {
        "title": "Konto Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, und compatibility-focused reporting helpers.",
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
    title: "Rust Fehler Design und Invariantes",
    description: "Baue typisierte Invariante-Guard-Libraries mit deterministischen Evidenz-Artefakten, kompatibilitaetssicheren Fehler-Vertraegen und audit-faehigem Berichting.",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error und Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, und deterministic invariant design fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, und context",
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
        "description": "Implement guard helpers, evidence-chain generation, und stable audit reporting fuer reliability und incident response.",
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
    title: "Rust Performance fuer On-chain Thinking",
    description: "Simuliere und optimiere Compute-Kostenverhalten mit deterministischem Rust-first-Tooling und budgetgetriebener Performance-Governance.",
    modules: {
      "rpot-v2-foundations": {
        "title": "Leistung Foundations",
        "description": "Rust leistung mentales modells, data-structure tradeoffs, und deterministic cost reasoning fuer reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Leistung mentales modell: allocations, clones, hashing",
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
        "description": "Build deterministic profilers, recommendation engines, und report outputs aligned to explicit leistung budgets.",
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
    title: "Concurrency und Asynchron fuer Indexer (Rust)",
    description: "Rust-first Asynchron-Pipeline-Engineering mit begrenzter Concurrency, replay-sicheren Reducern und deterministischem operativem Berichting.",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, und deterministic execution modeling fuer indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits und backpressure",
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph und concurrency",
          },
        },
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, und report exports fuer reorg-safe pipeline operations.",
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
    title: "Procedural Makros und Codegenerierung fuer Sicherheit",
    description: "Rust Makro/Codegenerierung-Sicherheit vermittelt durch deterministisches Parser- und Check-Generation-Tooling mit auditfreundlichen Outputs.",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro und Codegen Foundations",
        "description": "Macro mentales modells, constraint DSL design, und safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro mentales modell: declarative vs procedural",
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
        "title": "Konto Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, und publish stable safety reports.",
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
    title: "Anchor Aktualisierungs und Account Migrationen",
    description: "Entwirf produktionstaugliche Anchor-Release-Workflows mit deterministischer Migrationenplanung, Aktualisierung-Gates, Rollback-Playbooks und Readiness-Evidenz.",
    modules: {
      "aum-v2-module-1": {
        "title": "Aktualisierungsgrundlagen",
        "description": "Authority lifecycle, konto versioning strategy, und deterministic upgrade risk modeling fuer Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Konto versioning und migration strategy",
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
        "title": "Migrationsausfuehrung",
        "description": "Safety validation gates, rollback planning, und deterministic readiness artifacts fuer controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy und incident playbooks",
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
    title: "Zuverlaessigkeit Engineering fuer Solana",
    description: "Produktionsfokussiertes Zuverlaessigkeit Engineering fuer Solana-Systeme: Fault Tolerance, Retries, Deadlines, Circuit Breakers und Graceful Degradation mit messbaren Ergebnissen.",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks mit clear failure classification, retry boundaries, und deterministic recovery behavior.",
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
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, und rate controls) that protect core user flows during provider instability.",
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
    title: "Tests-Strategien fuer Solana",
    description: "Umfassende produktionsorientierte Tests-Strategie fuer Solana: deterministische Unit Tests, realistische Integration Tests, Fuzz/Property Tests und Release-Confidence-Berichting.",
    modules: {
      "mod-11-1": {
        "title": "Unit und Integration Tests",
        "description": "Build deterministic unit und integration tests layers mit clear ownership of invariants, fixtures, und failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Tests Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock Konto Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "Fortgeschritten Tests Techniques",
        "description": "Use fuzzing, property-based tests, und mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing und Property Tests",
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
    title: "Solana Programm Optimierung",
    description: "Entwickle produktionsreife Solana-Performance: Compute-Budgeting, effiziente Account-Layouts, Memory/Rent-Tradeoffs und deterministische Optimierungs-Workflows.",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths mit explicit CU budgets, operation-level profiling, und predictable leistung tradeoffs.",
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
        "title": "Memory und Storage Optimization",
        "description": "Design memory/storage-efficient konto layouts mit rent-aware sizing, serialization discipline, und safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Konto Data Optimization",
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
    title: "Tokenomics Design fuer Solana",
    description: "Entwirf robuste Solana-Tokenoekonomien mit Disziplin bei Distribution, Vesting-Sicherheit, Staking-Incentives und operativ verteidigbaren Governance-Mechaniken.",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution und Vesting",
        "description": "Model token allocation und vesting systems mit explicit fairness, unlock predictability, und deterministic accounting rules.",
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
        "title": "Staking und Governance",
        "description": "Design staking und governance mechanics mit clear incentive alignment, anti-manipulation constraints, und measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking und Governance Design",
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
    title: "DeFi Primitive auf Solana",
    description: "Baue praktische DeFi-Grundlagen auf Solana: AMM-Mechanik, Liquiditaetsabrechnung, Kredit-Primitive und flash-loan-sichere Compositions-Patterns.",
    modules: {
      "mod-14-1": {
        "title": "AMM und Liquidity",
        "description": "Implement AMM und liquidity primitives mit deterministic math, slippage-aware outputs, und LP accounting correctness.",
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
        "title": "Lending und Flash Loans",
        "description": "Model lending und flash-loan flows mit collateral safety, utilization-aware pricing, und strict repayment invariants.",
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
            "title": "Flash Loan Validator Challenge",
          },
        },
      },
    },
  },
  "solana-nft-standards": {
    title: "NFT Standards auf Solana",
    description: "Implementiereniere Solana-NFTs mit produktionsreifen Standards: Metadata-Integritaet, Collection-Disziplin und fortgeschrittene programmierbare/nicht uebertragbare Verhaltensweisen.",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality mit standards-compliant metadata, collection verification, und deterministic asset-state handling.",
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
        "title": "Fortgeschritten NFT Features",
        "description": "Implement fortgeschritten NFT behaviors (soulbound und programmable flows) mit explicit policy controls und safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound und Programmable NFTs",
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validator Challenge",
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
    title: "Programmuebergreifende Aufrufmuster",
    description: "Beherrsche CPI-Komposition auf Solana mit sicherer Account-Validierung, PDA-Signer-Disziplin und deterministischen Multi-Programm-Orchestrierungs-Patterns.",
  },
  "solana-mev-strategies": {
    title: "MEV und Transaction Ordering",
    description: "Produktionsfokussiertes Transaction-Ordering-Engineering auf Solana: MEV-aware Routing, Bundle-Strategie, Liquidations/Arbitrage-Modellierung und nutzerschuetzende Ausfuehrungskontrollen.",
  },
  "solana-deployment-cicd": {
    title: "Programm Bereitstellung und CI/CD",
    description: "Produktions-Bereitstellung-Engineering fuer Solana-Programmme: Umgebungsstrategie, Release-Gating, CI/CD-Qualitaetskontrollen und upgrade-sichere operative Workflows.",
  },
  "solana-cross-chain-bridges": {
    title: "Cross-Chain Brueckes und Wormhole",
    description: "Baue sicherere Cross-Chain-Integrationen fuer Solana mit Wormhole-aehnlicher Messaging-Logik, Attestation-Verifikation und deterministischen Bruecke-State-Kontrollen.",
  },
  "solana-oracle-pyth": {
    title: "Orakel Integration und Pyth Network",
    description: "Integriere Solana-Orakel-Feeds sicher: Preisvalidierung, Confidence/Staleness-Policy und Multi-Source-Aggregation fuer resiliente Protokollentscheidungen.",
  },
  "solana-dao-tooling": {
    title: "DAO Tooling und Autonome Organisationen",
    description: "Baue produktionsreife DAO-Systeme auf Solana: Proposal-Governance, Voting-Integritaet, Treasury-Kontrollen und deterministische Ausfuehrungs/Berichting-Workflows.",
  },
  "solana-gaming": {
    title: "Spiel und Game-State-Management",
    description: "Baue produktionsreife On-Chain-Game-Systeme auf Solana: effiziente State-Modelle, Turn-Integritaet, Fairness-Kontrollen und skalierbare Progressionsoekonomie.",
  },
  "solana-permanent-storage": {
    title: "Permanent Speicher und Arweave",
    description: "Integriere permanentes dezentrales Speicher mit Solana ueber Arweave-aehnliche Workflows: Content Addressing, Manifest-Integritaet und verifizierbarer Langzeit-Datenzugriff.",
  },
  "solana-staking-economics": {
    title: "Staking und Validator-Oekonomie",
    description: "Verstehe Solana-Staking und Validator-Oekonomie fuer reale Entscheidungen: Delegationsstrategie, Reward-Dynamik, Kommissionswirkungen und operative Nachhaltigkeit.",
  },
  "solana-account-abstraction": {
    title: "Konto Abstraktion und Smart Brieftasches",
    description: "Implementiereniere Smart-Brieftasche/Konto-Abstraktion-Patterns auf Solana mit programmierbarer Autorisierung, Recovery-Kontrollen und policy-gesteuerter Transaction-Validierung.",
  },
  "solana-pda-mastery": {
    title: "Program Derived Address Mastery",
    description: "Beherrsche fortgeschrittenes PDA-Engineering auf Solana: Seed-Schema-Design, Bump-Disziplin und sichere Cross-Program-PDA-Nutzung auf Produktionsniveau.",
  },
  "solana-economics": {
    title: "Solana Oekonomie und Token-Flows",
    description: "Analysiere Solana-Oekonomie im Produktionskontext: Inflation/Fee-Burn-Wechselwirkung, Staking-Flows, Supply-Bewegung und Nachhaltigkeits-Tradeoffs von Protokollen.",
  },
};

export const deCourseTranslations: CourseTranslationMap = deCuratedCourseTranslations;
