import type { CourseTranslationMap } from "./types";

const itCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fondamenti di Solana",
    description:
      "Introduzione di livello production per principianti che vogliono modelli mentali Solana chiari, debugging delle transazioni piu solido e workflow wallet-manager deterministici.",
  },
  "anchor-development": {
    title: "Sviluppo con Anchor",
    description:
      "Corso orientato al progetto per passare dalle basi all ingegneria Anchor reale: modellazione deterministica degli account, instruction builder, disciplina nei test e UX client affidabile.",
  },
  "solana-frontend": {
    title: "Sviluppo Frontend Solana",
    description:
      "Corso orientato al progetto per ingegneri frontend che vogliono dashboard Solana pronte per la produzione: reducer deterministici, pipeline eventi replayabili e UX transazioni affidabile.",
  },
  "defi-solana": {
    title: "DeFi su Solana",
    description:
      "Corso avanzato orientato al progetto per ingegneri che costruiscono sistemi di swap: pianificazione offline deterministica in stile Jupiter, ranking delle route, sicurezza minOut e diagnostica riproducibile.",
  },
  "solana-security": {
    title: "Sicurezza e Audit Solana",
    description:
      "Lab deterministico di vulnerabilita per auditor Solana che richiedono evidenza exploit ripetibile, remediation precisa e artefatti di audit ad alto segnale.",
  },
  "token-engineering": {
    title: "Token Engineering su Solana",
    description:
      "Corso orientato al progetto per team che lanciano token Solana reali: pianificazione deterministica Token-2022, design delle authority, simulazione della supply e disciplina operativa di lancio.",
  },
  "solana-mobile": {
    title: "Sviluppo Mobile Solana",
    description:
      "Costruisci dApp Solana mobile pronte per la produzione con MWA, architettura robusta delle sessioni wallet, UX di firma esplicita e operazioni di distribuzione disciplinate.",
  },
  "solana-testing": {
    title: "Testing di Programmi Solana",
    description:
      "Costruisci sistemi di testing Solana robusti su ambienti locali, simulati e di rete con invarianti di sicurezza esplicite e confidence gate di qualita release.",
  },
  "solana-indexing": {
    title: "Indicizzazione e Analytics Solana",
    description:
      "Costruisci un indexer eventi Solana di livello produzione con decoding deterministico, contratti di ingestion resilienti, recovery a checkpoint e output analytics affidabili.",
  },
  "solana-payments": {
    title: "Pagamenti e Checkout Solana",
    description:
      "Costruisci flussi di pagamento Solana di livello produzione con validazione robusta, idempotenza sicura contro replay, webhook sicuri e ricevute deterministiche per la riconciliazione.",
  },
  "solana-nft-compression": {
    title: "Fondamenti di NFT e cNFT",
    description:
      "Padroneggia l ingegneria degli NFT compressi su Solana: commitment Merkle, sistemi di proof, modellazione delle collection e controlli di sicurezza di livello produzione.",
  },
  "solana-governance-multisig": {
    title: "Governance e Tesoreria Multisig",
    description:
      "Costruisci sistemi DAO e tesoreria multisig pronti per la produzione con conteggio voti deterministico, sicurezza timelock e controlli di esecuzione sicuri.",
  },
  "solana-performance": {
    title: "Performance Solana e Ottimizzazione Compute",
    description:
      "Padroneggia l ingegneria delle performance Solana con workflow misurabili di ottimizzazione: compute budget, data layout, efficienza di encoding e modellazione deterministica dei costi.",
  },
  "defi-swap-aggregator": {
    title: "Aggregazione DeFi di Swap",
    description:
      "Padroneggia l aggregazione swap in produzione su Solana: parsing deterministico dei quote, tradeoff di ottimizzazione route, sicurezza slippage ed esecuzione orientata all affidabilita.",
  },
  "defi-clmm-liquidity": {
    title: "Ingegneria della Liquidita CLMM",
    description:
      "Padroneggia la liquidita concentrata sui DEX Solana: matematica dei tick, strategia di range, dinamiche fee/IL e reporting deterministico delle posizioni LP.",
  },
  "defi-lending-risk": {
    title: "Rischio Lending e Liquidazione",
    description:
      "Padroneggia l ingegneria del rischio lending su Solana: meccaniche di tasso/utilizzo, analisi dei percorsi di liquidazione, sicurezza oracle e reporting deterministico di scenario.",
  },
  "defi-perps-risk-console": {
    title: "Console di Rischio Perps",
    description:
      "Padroneggia il rischio perps su Solana: contabilita precisa di PnL/funding, monitoraggio del margine, simulazione di liquidazione e reporting deterministico su console.",
  },
  "defi-tx-optimizer": {
    title: "Ottimizzatore di Transazioni DeFi",
    description:
      "Padroneggia l ottimizzazione delle transazioni DeFi su Solana: tuning compute/fee, strategia ALT, pattern di affidabilita e pianificazione deterministica della strategia di invio.",
  },
  "solana-mobile-signing": {
    title: "Firma Mobile Solana",
    description:
      "Padroneggia la firma wallet mobile in produzione su Solana: sessioni Android MWA, vincoli deep-link iOS, retry resilienti e telemetria di sessione deterministica.",
  },
  "solana-pay-commerce": {
    title: "Commerce con Solana Pay",
    description:
      "Padroneggia l integrazione commerce Solana Pay: encoding URL robusto, workflow di tracking QR/pagamento, UX di conferma e artefatti deterministici per la riconciliazione POS.",
  },
  "wallet-ux-engineering": {
    title: "Ingegneria UX Wallet",
    description:
      "Padroneggia l ingegneria UX wallet in produzione su Solana: stato di connessione deterministico, sicurezza di rete, resilienza RPC e pattern di affidabilita misurabili.",
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description:
      "Padroneggia l autenticazione SIWS in produzione su Solana: input standardizzati, invarianti rigorose di verifica, ciclo di vita nonce resistente al replay e reporting pronto per audit.",
  },
  "priority-fees-compute-budget": {
    title: "Priority Fees e Compute Budget",
    description:
      "Ingegneria difensiva delle fee Solana con pianificazione compute deterministica, politica adattiva di priorita e contratti UX di affidabilita orientati alla conferma.",
  },
  "bundles-atomicity": {
    title: "Bundle e Atomicita delle Transazioni",
    description:
      "Progetta flussi Solana difensivi multi-transazione con validazione deterministica dell atomicita, modellazione della compensazione e reporting di sicurezza pronto per audit.",
  },
  "mempool-ux-defense": {
    title: "Realta del Mempool e UX Anti-Sandwich",
    description:
      "Ingegneria difensiva UX per swap con grading del rischio deterministico, policy di slippage limitate e comunicazione di sicurezza pronta per incidenti.",
  },
  "indexing-webhooks-pipelines": {
    title: "Indexer, Webhook e Pipeline Reorg-Safe",
    description:
      "Costruisci pipeline di indicizzazione deterministiche di livello produzione per ingestion sicura ai duplicati, gestione reorg e reporting orientato all integrita.",
  },
  "rpc-reliability-latency": {
    title: "Affidabilita RPC e Ingegneria della Latenza",
    description:
      "Progetta client RPC Solana multi-provider di livello produzione con policy deterministiche di retry, routing, caching e observability.",
  },
  "rust-data-layout-borsh": {
    title: "Layout Dati Rust e Padronanza Borsh",
    description:
      "Ingegneria del layout dati Solana con approccio Rust-first e tooling deterministico byte-level, insieme a pratiche schema sicure per la compatibilita.",
  },
  "rust-errors-invariants": {
    title: "Error Design e Invarianti in Rust",
    description:
      "Costruisci librerie tipizzate di guardie per invarianti con artefatti di evidenza deterministici, contratti errore compatibili e reporting pronto per audit.",
  },
  "rust-perf-onchain-thinking": {
    title: "Performance Rust per Pensiero On-chain",
    description:
      "Simula e ottimizza il comportamento del costo compute con tooling deterministico Rust-first e governance delle performance guidata dal budget.",
  },
  "rust-async-indexer-pipeline": {
    title: "Concorrenza e Async per Indexer (Rust)",
    description:
      "Ingegneria di pipeline async Rust-first con concorrenza limitata, reducer replay-safe e reporting operativo deterministico.",
  },
  "rust-proc-macros-codegen-safety": {
    title: "Macro Procedurali e Codegen per la Sicurezza",
    description:
      "Sicurezza macro/codegen in Rust insegnata con parser deterministico e tooling di generazione controlli con output audit-friendly.",
  },
  "anchor-upgrades-migrations": {
    title: "Upgrades Anchor e Migrazioni Account",
    description:
      "Progetta workflow di release Anchor sicuri per la produzione con pianificazione migrazione deterministica, gate di upgrade, playbook rollback ed evidenze di readiness.",
  },
  "solana-reliability": {
    title: "Ingegneria di Affidabilita per Solana",
    description:
      "Ingegneria di affidabilita orientata alla produzione per sistemi Solana: fault tolerance, retry, deadline, circuit breaker e degradazione graduale con risultati operativi misurabili.",
  },
  "solana-testing-strategies": {
    title: "Strategie di Testing per Solana",
    description:
      "Strategia di testing completa e orientata alla produzione per Solana: test unitari deterministici, integration test realistici, fuzz/property testing e reporting di confidenza release.",
  },
  "solana-program-optimization": {
    title: "Ottimizzazione Programmi Solana",
    description:
      "Progetta performance Solana di livello produzione: compute budgeting, efficienza del layout account, tradeoff memoria/rent e workflow di ottimizzazione deterministici.",
  },
  "solana-tokenomics-design": {
    title: "Design Tokenomics per Solana",
    description:
      "Progetta economie di token Solana robuste con disciplina di distribuzione, sicurezza vesting, incentivi staking e meccaniche di governance difendibili operativamente.",
  },
  "solana-defi-primitives": {
    title: "Primitive DeFi su Solana",
    description:
      "Costruisci fondamenta DeFi pratiche su Solana: meccaniche AMM, contabilita della liquidita, primitive lending e pattern di composizione sicuri contro flash loan.",
  },
  "solana-nft-standards": {
    title: "Standard NFT su Solana",
    description:
      "Implementa NFT Solana con standard pronti per la produzione: integrita metadata, disciplina collection e comportamenti avanzati programmabili/non trasferibili.",
  },
  "solana-cpi-patterns": {
    title: "Pattern di Invocazione Cross-Program (CPI)",
    description:
      "Padroneggia composizione CPI su Solana con validazione account sicura, disciplina signer PDA e pattern deterministici di orchestrazione multi-programma.",
  },
  "solana-mev-strategies": {
    title: "MEV e Ordinamento delle Transazioni",
    description:
      "Ingegneria di ordinamento transazioni orientata alla produzione su Solana: routing MEV-aware, strategia bundle, modellazione liquidazione/arbitraggio e controlli di esecuzione a tutela utente.",
  },
  "solana-deployment-cicd": {
    title: "Deployment Programmi e CI/CD",
    description:
      "Ingegneria di deployment produzione per programmi Solana: strategia ambienti, release gating, controlli qualita CI/CD e workflow operativi upgrade-safe.",
  },
  "solana-cross-chain-bridges": {
    title: "Bridge Cross-Chain e Wormhole",
    description:
      "Costruisci integrazioni cross-chain piu sicure su Solana con messaggistica stile Wormhole, verifica attestations e controlli deterministici dello stato bridge.",
  },
  "solana-oracle-pyth": {
    title: "Integrazione Oracle e Rete Pyth",
    description:
      "Integra feed oracle Solana in sicurezza: validazione prezzo, policy confidence/staleness e aggregazione multi-source per decisioni di protocollo resilienti.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO e Organizzazioni Autonome",
    description:
      "Costruisci sistemi DAO production-ready su Solana: governance proposte, integrita del voto, controlli tesoreria e workflow deterministici di esecuzione/reporting.",
  },
  "solana-gaming": {
    title: "Gaming e Gestione dello Stato di Gioco",
    description:
      "Costruisci sistemi di gioco on-chain production-ready su Solana: modelli stato efficienti, integrita turno, controlli fairness ed economia scalabile della progressione giocatore.",
  },
  "solana-permanent-storage": {
    title: "Storage Permanente e Arweave",
    description:
      "Integra storage decentralizzato permanente con Solana tramite workflow stile Arweave: content addressing, integrita manifest e accesso dati verificabile a lungo termine.",
  },
  "solana-staking-economics": {
    title: "Staking ed Economia dei Validator",
    description:
      "Comprendi staking ed economia validator Solana per decisioni reali: strategia delega, dinamica reward, effetti commissione e sostenibilita operativa.",
  },
  "solana-account-abstraction": {
    title: "Account Abstraction e Smart Wallet",
    description:
      "Implementa pattern smart-wallet/account abstraction su Solana con autorizzazione programmabile, controlli recupero e validazione transazioni policy-driven.",
  },
  "solana-pda-mastery": {
    title: "Padronanza Program Derived Address",
    description:
      "Padroneggia ingegneria avanzata PDA su Solana: design schema seed, disciplina bump e uso sicuro cross-program dei PDA su scala produzione.",
  },
  "solana-economics": {
    title: "Economia Solana e Flussi di Token",
    description:
      "Analizza dinamiche economiche Solana in contesto produzione: interazione inflation/fee-burn, flussi staking, movimento supply e tradeoff di sostenibilita protocollo.",
  },
};

export const itCourseTranslations: CourseTranslationMap = itCuratedCourseTranslations;
