import type { CourseTranslationMap } from "./types";

const deCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Solana Grundlagen",
    description:
      "Produktionsnahe Einfuehrung fuer Einsteiger, die klare Solana-Denkmodelle, staerkere Transaction-Debugging-Skills und deterministische Wallet-Manager-Workflows aufbauen wollen.",
  },
  "anchor-development": {
    title: "Anchor Entwicklung",
    description:
      "Projektorientierter Kurs fuer den Weg von den Grundlagen zur echten Anchor-Entwicklung: deterministisches Account-Modelling, Instruction-Builder, Testdisziplin und zuverlaessige Client-UX.",
  },
  "solana-frontend": {
    title: "Solana Frontend Entwicklung",
    description:
      "Projektorientierter Kurs fuer Frontend-Ingenieure, die produktionsreife Solana-Dashboards bauen wollen: deterministische Reducer, replaybare Event-Pipelines und vertrauenswuerdige Transaction-UX.",
  },
  "defi-solana": {
    title: "DeFi auf Solana",
    description:
      "Fortgeschrittener Projektkurs fuer Ingenieure, die Swap-Systeme bauen: deterministische Offline-Planung im Jupiter-Stil, Routen-Ranking, minOut-Sicherheit und reproduzierbare Diagnosen.",
  },
  "solana-security": {
    title: "Solana Sicherheit und Auditing",
    description:
      "Produktionsnahes deterministisches Vulnerability-Lab fuer Solana-Auditoren mit wiederholbarer Exploit-Evidenz, praeziser Remediation und aussagekraeftigen Audit-Artefakten.",
  },
  "token-engineering": {
    title: "Token Engineering auf Solana",
    description:
      "Projektkurs fuer Teams, die reale Solana-Token launchen: deterministische Token-2022-Planung, Authority-Design, Supply-Simulation und operative Launch-Disziplin.",
  },
  "solana-mobile": {
    title: "Solana Mobile Entwicklung",
    description:
      "Baue produktionsreife mobile Solana-dApps mit MWA, robuster Wallet-Session-Architektur, expliziter Signing-UX und disziplinierten Distributionsprozessen.",
  },
  "solana-testing": {
    title: "Testing von Solana Programmen",
    description:
      "Baue robuste Solana-Testsysteme ueber lokale, simulierte und Netzwerk-Umgebungen mit expliziten Sicherheitsinvarianten und release-tauglichen Confidence-Gates.",
  },
  "solana-indexing": {
    title: "Solana Indexing und Analytics",
    description:
      "Baue einen produktionsreifen Solana-Event-Indexer mit deterministischem Decoding, resilienten Ingestion-Vertraegen, Checkpoint-Recovery und verlaesslichen Analytics-Outputs.",
  },
  "solana-payments": {
    title: "Solana Payments und Checkout Flows",
    description:
      "Baue produktionsreife Solana-Zahlungsfluesse mit robuster Validierung, replay-sicherer Idempotenz, sicheren Webhooks und deterministischen Receipts fuer die Reconciliation.",
  },
  "solana-nft-compression": {
    title: "NFT- und cNFT-Grundlagen",
    description:
      "Beherrsche komprimierte NFT-Engineering-Patterns auf Solana: Merkle-Commitments, Proof-Systeme, Collection-Modellierung und Sicherheitschecks auf Produktionsniveau.",
  },
  "solana-governance-multisig": {
    title: "Governance und Multisig-Treasury Ops",
    description:
      "Baue produktionsreife DAO-Governance- und Multisig-Treasury-Systeme mit deterministischer Vote-Abrechnung, Timelock-Sicherheit und sicheren Ausfuehrungskontrollen.",
  },
  "solana-performance": {
    title: "Solana Performance und Compute-Optimierung",
    description:
      "Beherrsche Solana-Performance-Engineering mit messbaren Optimierungs-Workflows: Compute-Budgets, Datenlayouts, Encoding-Effizienz und deterministische Kostenmodellierung.",
  },
  "defi-swap-aggregator": {
    title: "DeFi Swap Aggregation",
    description:
      "Beherrsche produktionsreife Swap-Aggregation auf Solana: deterministisches Quote-Parsing, Route-Optimierungs-Tradeoffs, Slippage-Sicherheit und zuverlaessigkeitsorientierte Ausfuehrung.",
  },
  "defi-clmm-liquidity": {
    title: "CLMM-Liquiditaetsengineering",
    description:
      "Beherrsche konzentrierte Liquiditaet auf Solana-DEXs: Tick-Mathematik, Range-Strategie-Design, Fee/IL-Dynamik und deterministisches Reporting von LP-Positionen.",
  },
  "defi-lending-risk": {
    title: "Lending- und Liquidationsrisiko",
    description:
      "Beherrsche Solana-Lending-Risk-Engineering: Utilization- und Zinsmechanik, Analyse von Liquidationspfaden, Oracle-Sicherheit und deterministische Szenario-Reports.",
  },
  "defi-perps-risk-console": {
    title: "Perps Risk Console",
    description:
      "Beherrsche Perps-Risk-Engineering auf Solana: praezise PnL/Funding-Abrechnung, Margin-Monitoring, Liquidationssimulation und deterministisches Console-Reporting.",
  },
  "defi-tx-optimizer": {
    title: "DeFi Transaction Optimizer",
    description:
      "Beherrsche Solana-DeFi-Transaktionsoptimierung: Compute/Fee-Tuning, ALT-Strategie, Reliability-Patterns und deterministische Planung von Sendestrategien.",
  },
  "solana-mobile-signing": {
    title: "Solana Mobile Signing",
    description:
      "Beherrsche produktionsreifes mobiles Wallet-Signing auf Solana: Android-MWA-Sessions, iOS-Deep-Link-Constraints, resiliente Retries und deterministische Session-Telemetrie.",
  },
  "solana-pay-commerce": {
    title: "Solana Pay Commerce",
    description:
      "Beherrsche Solana-Pay-Commerce-Integration: robustes URL-Encoding, QR-/Payment-Tracking-Workflows, Confirmation-UX und deterministische POS-Reconciliation-Artefakte.",
  },
  "wallet-ux-engineering": {
    title: "Wallet UX Engineering",
    description:
      "Beherrsche produktionsreifes Wallet-UX-Engineering auf Solana: deterministischer Verbindungszustand, Netzwerksicherheit, RPC-Resilienz und messbare Reliability-Patterns.",
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description:
      "Beherrsche produktionsreife SIWS-Authentifizierung auf Solana: standardisierte Inputs, strikte Verifikationsinvarianten, replay-resistenter Nonce-Lifecycle und audit-faehiges Reporting.",
  },
  "priority-fees-compute-budget": {
    title: "Priority Fees und Compute Budget",
    description:
      "Defensive Solana-Fee-Engineering mit deterministischer Compute-Planung, adaptiver Priority-Policy und bestaetigungsorientierten UX-Reliability-Vertraegen.",
  },
  "bundles-atomicity": {
    title: "Bundles und Transaction Atomicity",
    description:
      "Entwirf defensive Multi-Transaction-Solana-Flows mit deterministischer Atomicity-Validierung, Kompensationsmodellierung und audit-faehigem Sicherheitsreporting.",
  },
  "mempool-ux-defense": {
    title: "Mempool-Realitaet und Anti-Sandwich-UX",
    description:
      "Defensives Swap-UX-Engineering mit deterministischer Risikoeinstufung, begrenzten Slippage-Policies und incident-ready Sicherheitskommunikation.",
  },
  "indexing-webhooks-pipelines": {
    title: "Indexer, Webhooks und Reorg-Safe Pipelines",
    description:
      "Baue produktionsreife deterministische Indexing-Pipelines fuer duplicate-sichere Ingestion, Reorg-Handling und integritaetsorientiertes Reporting.",
  },
  "rpc-reliability-latency": {
    title: "RPC-Reliability und Latency Engineering",
    description:
      "Entwickle produktionsreife Multi-Provider-Solana-RPC-Clients mit deterministischen Retry-, Routing-, Caching- und Observability-Policies.",
  },
  "rust-data-layout-borsh": {
    title: "Rust Data Layout und Borsh Mastery",
    description:
      "Rust-first Solana-Data-Layout-Engineering mit deterministischen Byte-Level-Tooling und kompatibilitaetssicheren Schema-Praktiken.",
  },
  "rust-errors-invariants": {
    title: "Rust Error Design und Invariants",
    description:
      "Baue typisierte Invariant-Guard-Libraries mit deterministischen Evidenz-Artefakten, kompatibilitaetssicheren Error-Vertraegen und audit-faehigem Reporting.",
  },
  "rust-perf-onchain-thinking": {
    title: "Rust Performance fuer On-chain Thinking",
    description:
      "Simuliere und optimiere Compute-Kostenverhalten mit deterministischem Rust-first-Tooling und budgetgetriebener Performance-Governance.",
  },
  "rust-async-indexer-pipeline": {
    title: "Concurrency und Async fuer Indexer (Rust)",
    description:
      "Rust-first Async-Pipeline-Engineering mit begrenzter Concurrency, replay-sicheren Reducern und deterministischem operativem Reporting.",
  },
  "rust-proc-macros-codegen-safety": {
    title: "Procedural Macros und Codegen fuer Sicherheit",
    description:
      "Rust Macro/Codegen-Sicherheit vermittelt durch deterministisches Parser- und Check-Generation-Tooling mit auditfreundlichen Outputs.",
  },
  "anchor-upgrades-migrations": {
    title: "Anchor Upgrades und Account Migrationen",
    description:
      "Entwirf produktionstaugliche Anchor-Release-Workflows mit deterministischer Migrationsplanung, Upgrade-Gates, Rollback-Playbooks und Readiness-Evidenz.",
  },
  "solana-reliability": {
    title: "Reliability Engineering fuer Solana",
    description:
      "Produktionsfokussiertes Reliability Engineering fuer Solana-Systeme: Fault Tolerance, Retries, Deadlines, Circuit Breakers und Graceful Degradation mit messbaren Ergebnissen.",
  },
  "solana-testing-strategies": {
    title: "Testing-Strategien fuer Solana",
    description:
      "Umfassende produktionsorientierte Testing-Strategie fuer Solana: deterministische Unit Tests, realistische Integration Tests, Fuzz/Property Testing und Release-Confidence-Reporting.",
  },
  "solana-program-optimization": {
    title: "Solana Program Optimization",
    description:
      "Entwickle produktionsreife Solana-Performance: Compute-Budgeting, effiziente Account-Layouts, Memory/Rent-Tradeoffs und deterministische Optimierungs-Workflows.",
  },
  "solana-tokenomics-design": {
    title: "Tokenomics Design fuer Solana",
    description:
      "Entwirf robuste Solana-Tokenoekonomien mit Disziplin bei Distribution, Vesting-Sicherheit, Staking-Incentives und operativ verteidigbaren Governance-Mechaniken.",
  },
  "solana-defi-primitives": {
    title: "DeFi Primitives auf Solana",
    description:
      "Baue praktische DeFi-Grundlagen auf Solana: AMM-Mechanik, Liquiditaetsabrechnung, Lending-Primitives und flash-loan-sichere Compositions-Patterns.",
  },
  "solana-nft-standards": {
    title: "NFT Standards auf Solana",
    description:
      "Implementiere Solana-NFTs mit produktionsreifen Standards: Metadata-Integritaet, Collection-Disziplin und fortgeschrittene programmierbare/nicht uebertragbare Verhaltensweisen.",
  },
  "solana-cpi-patterns": {
    title: "Cross-Program Invocation Patterns",
    description:
      "Beherrsche CPI-Komposition auf Solana mit sicherer Account-Validierung, PDA-Signer-Disziplin und deterministischen Multi-Programm-Orchestrierungs-Patterns.",
  },
  "solana-mev-strategies": {
    title: "MEV und Transaction Ordering",
    description:
      "Produktionsfokussiertes Transaction-Ordering-Engineering auf Solana: MEV-aware Routing, Bundle-Strategie, Liquidations/Arbitrage-Modellierung und nutzerschuetzende Ausfuehrungskontrollen.",
  },
  "solana-deployment-cicd": {
    title: "Program Deployment und CI/CD",
    description:
      "Produktions-Deployment-Engineering fuer Solana-Programme: Umgebungsstrategie, Release-Gating, CI/CD-Qualitaetskontrollen und upgrade-sichere operative Workflows.",
  },
  "solana-cross-chain-bridges": {
    title: "Cross-Chain Bridges und Wormhole",
    description:
      "Baue sicherere Cross-Chain-Integrationen fuer Solana mit Wormhole-aehnlicher Messaging-Logik, Attestation-Verifikation und deterministischen Bridge-State-Kontrollen.",
  },
  "solana-oracle-pyth": {
    title: "Oracle Integration und Pyth Network",
    description:
      "Integriere Solana-Oracle-Feeds sicher: Preisvalidierung, Confidence/Staleness-Policy und Multi-Source-Aggregation fuer resiliente Protokollentscheidungen.",
  },
  "solana-dao-tooling": {
    title: "DAO Tooling und Autonome Organisationen",
    description:
      "Baue produktionsreife DAO-Systeme auf Solana: Proposal-Governance, Voting-Integritaet, Treasury-Kontrollen und deterministische Ausfuehrungs/Reporting-Workflows.",
  },
  "solana-gaming": {
    title: "Gaming und Game-State-Management",
    description:
      "Baue produktionsreife On-Chain-Game-Systeme auf Solana: effiziente State-Modelle, Turn-Integritaet, Fairness-Kontrollen und skalierbare Progressionsoekonomie.",
  },
  "solana-permanent-storage": {
    title: "Permanent Storage und Arweave",
    description:
      "Integriere permanentes dezentrales Storage mit Solana ueber Arweave-aehnliche Workflows: Content Addressing, Manifest-Integritaet und verifizierbarer Langzeit-Datenzugriff.",
  },
  "solana-staking-economics": {
    title: "Staking und Validator-Oekonomie",
    description:
      "Verstehe Solana-Staking und Validator-Oekonomie fuer reale Entscheidungen: Delegationsstrategie, Reward-Dynamik, Kommissionswirkungen und operative Nachhaltigkeit.",
  },
  "solana-account-abstraction": {
    title: "Account Abstraction und Smart Wallets",
    description:
      "Implementiere Smart-Wallet/Account-Abstraction-Patterns auf Solana mit programmierbarer Autorisierung, Recovery-Kontrollen und policy-gesteuerter Transaction-Validierung.",
  },
  "solana-pda-mastery": {
    title: "Program Derived Address Mastery",
    description:
      "Beherrsche fortgeschrittenes PDA-Engineering auf Solana: Seed-Schema-Design, Bump-Disziplin und sichere Cross-Program-PDA-Nutzung auf Produktionsniveau.",
  },
  "solana-economics": {
    title: "Solana Economics und Token-Flows",
    description:
      "Analysiere Solana-Economics im Produktionskontext: Inflation/Fee-Burn-Wechselwirkung, Staking-Flows, Supply-Bewegung und Nachhaltigkeits-Tradeoffs von Protokollen.",
  },
};

export const deCourseTranslations: CourseTranslationMap = deCuratedCourseTranslations;
