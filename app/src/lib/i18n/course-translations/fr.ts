import type { CourseTranslationMap } from "./types";

const frCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fondamentaux de Solana",
    description:
      "Introduction orientee production pour les debutants qui veulent des modeles mentaux Solana clairs, un debugging de transactions plus solide et des workflows wallet-manager deterministes.",
  },
  "anchor-development": {
    title: "Developpement Anchor",
    description:
      "Cours oriente projet pour passer des bases a une ingenierie Anchor reelle: modelisation deterministe des comptes, construction des instructions, discipline de test et UX client fiable.",
  },
  "solana-frontend": {
    title: "Developpement Frontend Solana",
    description:
      "Cours oriente projet pour construire des dashboards Solana prets pour la production: reducers deterministes, pipelines d evenements rejouables et UX de transaction fiable.",
  },
  "defi-solana": {
    title: "DeFi sur Solana",
    description:
      "Cours avance oriente projet pour les ingenieurs qui construisent des systemes de swap: planification offline deterministe style Jupiter, classement des routes, securite minOut et diagnostics reproductibles.",
  },
  "solana-security": {
    title: "Securite et Audit Solana",
    description:
      "Laboratoire deterministe de vulnerabilites pour auditeurs Solana qui ont besoin de preuves d exploit repetables, de remediation precise et d artefacts d audit a fort signal.",
  },
  "token-engineering": {
    title: "Ingenierie de Tokens sur Solana",
    description:
      "Cours oriente projet pour les equipes qui lancent des tokens Solana reels: planification deterministe Token-2022, design des autorites, simulation de supply et discipline operationnelle de lancement.",
  },
  "solana-mobile": {
    title: "Developpement Mobile Solana",
    description:
      "Construisez des dApps Solana mobiles pretes pour la production avec MWA, architecture robuste de session wallet, UX de signature explicite et operations de distribution disciplinees.",
  },
  "solana-testing": {
    title: "Tests de Programmes Solana",
    description:
      "Construisez des systemes de test Solana robustes sur environnements local, simule et reseau avec des invariants de securite explicites et des garde-fous de confiance de niveau release.",
  },
  "solana-indexing": {
    title: "Indexation et Analytics Solana",
    description:
      "Construisez un indexeur d evenements Solana de niveau production avec decodage deterministe, contrats d ingestion resilients, reprise par checkpoints et sorties analytiques fiables.",
  },
  "solana-payments": {
    title: "Paiements et Checkout Solana",
    description:
      "Construisez des flux de paiement Solana de niveau production avec validations robustes, idempotence sure face aux retries, webhooks securises et recus deterministes pour la reconciliation.",
  },
  "solana-nft-compression": {
    title: "Fondamentaux NFTs et cNFTs",
    description:
      "Maitrisez l ingenierie des NFTs compresses sur Solana: engagements Merkle, systemes de preuve, modelisation de collection et controles de securite de niveau production.",
  },
  "solana-governance-multisig": {
    title: "Gouvernance et Operations de Tresorerie Multisig",
    description:
      "Construisez des systemes DAO et de tresorerie multisig prets pour la production avec comptabilisation de vote deterministe, securite timelock et controles d execution securises.",
  },
  "solana-performance": {
    title: "Performance Solana et Optimisation Compute",
    description:
      "Maitrisez l ingenierie de performance Solana avec des workflows d optimisation mesurables: budgets compute, layouts de donnees, efficacite d encodage et modelisation deterministe des couts.",
  },
  "defi-swap-aggregator": {
    title: "Agregation DeFi de Swaps",
    description:
      "Maitrisez l aggregation de swaps en production sur Solana: parsing deterministe des quotes, compromis d optimisation de route, securite slippage et execution orientee fiabilite.",
  },
  "defi-clmm-liquidity": {
    title: "Ingenierie de Liquidite CLMM",
    description:
      "Maitrisez l ingenierie de liquidite concentree sur les DEX Solana: mathematiques de tick, strategie de range, dynamique fees/IL et reporting deterministe des positions LP.",
  },
  "defi-lending-risk": {
    title: "Risque Lending et Liquidation",
    description:
      "Maitrisez l ingenierie du risque lending Solana: mecaniques de taux/utilisation, analyse des chemins de liquidation, securite oracle et reporting deterministe de scenarios.",
  },
  "defi-perps-risk-console": {
    title: "Console de Risque Perps",
    description:
      "Maitrisez l ingenierie du risque perps sur Solana: comptabilite precise PnL/funding, surveillance de marge, simulation de liquidation et reporting deterministe sur console.",
  },
  "defi-tx-optimizer": {
    title: "Optimiseur de Transactions DeFi",
    description:
      "Maitrisez l optimisation de transactions DeFi sur Solana: tuning compute/frais, strategie ALT, patterns de fiabilite et planification deterministe de strategie d envoi.",
  },
  "solana-mobile-signing": {
    title: "Signature Mobile Solana",
    description:
      "Maitrisez la signature wallet mobile en production sur Solana: sessions Android MWA, contraintes deep-link iOS, retries resilients et telemetrie de session deterministe.",
  },
  "solana-pay-commerce": {
    title: "Commerce Solana Pay",
    description:
      "Maitrisez l integration commerce Solana Pay: encodage URL robuste, workflows de suivi QR/paiement, UX de confirmation et artefacts deterministes de reconciliation POS.",
  },
  "wallet-ux-engineering": {
    title: "Ingenierie UX Wallet",
    description:
      "Maitrisez l ingenierie UX wallet en production sur Solana: etat de connexion deterministe, securite reseau, resilience RPC et patterns de fiabilite mesurables.",
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description:
      "Maitrisez l authentification SIWS en production sur Solana: entrees standardisees, invariants stricts de verification, cycle de vie nonce resistant au replay et reporting pret pour audit.",
  },
  "priority-fees-compute-budget": {
    title: "Priority Fees et Compute Budget",
    description:
      "Ingenierie defensive des frais Solana avec planification compute deterministe, politique de priorite adaptative et contrats UX de fiabilite axes confirmation.",
  },
  "bundles-atomicity": {
    title: "Bundles et Atomicite des Transactions",
    description:
      "Concevez des flux Solana defensifs multi-transactions avec validation deterministe de l atomicite, modelisation de compensation et reporting securite pret pour audit.",
  },
  "mempool-ux-defense": {
    title: "Realite Mempool et UX Anti-Sandwich",
    description:
      "Ingenierie defensive UX de swap avec notation de risque deterministe, politiques de slippage bornees et communication securite prete pour incident.",
  },
  "indexing-webhooks-pipelines": {
    title: "Indexeurs, Webhooks et Pipelines Reorg-Safe",
    description:
      "Construisez des pipelines d indexation deterministes de niveau production pour ingestion sure contre doublons, gestion de reorg et reporting centre integrite.",
  },
  "rpc-reliability-latency": {
    title: "Fiabilite RPC et Ingenierie Latence",
    description:
      "Concevez des clients RPC Solana multi-fournisseurs de niveau production avec politiques deterministes de retry, routage, cache et observabilite.",
  },
  "rust-data-layout-borsh": {
    title: "Layout de Donnees Rust et Maitrise Borsh",
    description:
      "Ingenierie de layout de donnees Solana orientee Rust avec outillage deterministe au niveau octet et pratiques de schema sures pour la compatibilite.",
  },
  "rust-errors-invariants": {
    title: "Conception d Erreurs et Invariants Rust",
    description:
      "Construisez des bibliotheques typees de garde d invariants avec artefacts de preuve deterministes, contrats d erreur compatibles et reporting pret pour audit.",
  },
  "rust-perf-onchain-thinking": {
    title: "Performance Rust pour la Pensee On-chain",
    description:
      "Simulez et optimisez le cout compute avec un outillage deterministe Rust-first et une gouvernance performance pilotee par budget.",
  },
  "rust-async-indexer-pipeline": {
    title: "Concurrence et Async pour Indexeurs (Rust)",
    description:
      "Ingenierie de pipeline async Rust-first avec concurrence bornee, reducers replay-safe et reporting operationnel deterministe.",
  },
  "rust-proc-macros-codegen-safety": {
    title: "Macros Procedurales et Codegen pour la Securite",
    description:
      "Securite macro/codegen en Rust enseignee via parser deterministe et outillage de generation de checks avec sorties audit-friendly.",
  },
  "anchor-upgrades-migrations": {
    title: "Upgrades Anchor et Migrations de Comptes",
    description:
      "Concevez des workflows de release Anchor surs pour la production avec planification de migration deterministe, gates d upgrade, playbooks de rollback et preuves de readiness.",
  },
  "solana-reliability": {
    title: "Ingenierie de Fiabilite pour Solana",
    description:
      "Ingenierie de fiabilite orientee production pour systemes Solana: tolerance aux pannes, retries, deadlines, circuit breakers et degradation progressive avec resultats mesurables.",
  },
  "solana-testing-strategies": {
    title: "Strategies de Test pour Solana",
    description:
      "Strategie de test complete et orientee production pour Solana: tests unitaires deterministes, tests d integration realistes, fuzz/property testing et reporting de confiance release.",
  },
  "solana-program-optimization": {
    title: "Optimisation de Programmes Solana",
    description:
      "Concevez des performances Solana de niveau production: compute budgeting, efficacite des layouts de comptes, compromis memoire/rent et workflows d optimisation deterministes.",
  },
  "solana-tokenomics-design": {
    title: "Conception Tokenomics pour Solana",
    description:
      "Concevez des economies de token Solana robustes avec discipline de distribution, securite de vesting, incentives de staking et mecaniques de gouvernance defendables operationnellement.",
  },
  "solana-defi-primitives": {
    title: "Primitives DeFi sur Solana",
    description:
      "Construisez des fondations DeFi pratiques sur Solana: mecaniques AMM, comptabilite de liquidite, primitives de lending et patterns de composition surs face aux flash loans.",
  },
  "solana-nft-standards": {
    title: "Standards NFT sur Solana",
    description:
      "Implementez des NFTs Solana avec standards prets production: integrite metadata, discipline de collection et comportements avances programmables/non transferables.",
  },
  "solana-cpi-patterns": {
    title: "Patterns d Invocation Cross-Program (CPI)",
    description:
      "Maitrisez la composition CPI sur Solana avec validation de comptes sure, discipline des signers PDA et patterns deterministes d orchestration multi-programmes.",
  },
  "solana-mev-strategies": {
    title: "MEV et Ordonnancement des Transactions",
    description:
      "Ingenierie d ordonnancement de transactions orientee production sur Solana: routage conscient du MEV, strategie de bundles, modelisation liquidation/arbitrage et controles d execution protecteurs pour l utilisateur.",
  },
  "solana-deployment-cicd": {
    title: "Deploiement de Programmes et CI/CD",
    description:
      "Ingenierie de deploiement production pour programmes Solana: strategie d environnements, release gating, controles qualite CI/CD et workflows operationnels safe pour les upgrades.",
  },
  "solana-cross-chain-bridges": {
    title: "Bridges Cross-Chain et Wormhole",
    description:
      "Construisez des integrations cross-chain plus sures pour Solana avec messagerie style Wormhole, verification d attestations et controles deterministes de l etat bridge.",
  },
  "solana-oracle-pyth": {
    title: "Integration Oracle et Reseau Pyth",
    description:
      "Integrez les feeds oracle Solana en securite: validation de prix, politique confiance/staleness et aggregation multi-source pour des decisions de protocole resilientes.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO et Organisations Autonomes",
    description:
      "Construisez des systemes DAO prets production sur Solana: gouvernance de propositions, integrite du vote, controles de tresorerie et workflows deterministes d execution/reporting.",
  },
  "solana-gaming": {
    title: "Gaming et Gestion de l Etat de Jeu",
    description:
      "Construisez des systemes de jeu on-chain prets production sur Solana: modeles d etat efficaces, integrite des tours, controles d equite et economie de progression joueurs scalable.",
  },
  "solana-permanent-storage": {
    title: "Stockage Permanent et Arweave",
    description:
      "Integrez un stockage decentralise permanent avec Solana via des workflows style Arweave: content addressing, integrite des manifests et acces long terme verifiable aux donnees.",
  },
  "solana-staking-economics": {
    title: "Staking et Economie des Validateurs",
    description:
      "Comprenez l economie du staking et des validateurs Solana pour la decision reelle: strategie de delegation, dynamique des rewards, effets de commission et soutenabilite operationnelle.",
  },
  "solana-account-abstraction": {
    title: "Abstraction de Compte et Smart Wallets",
    description:
      "Implementez des patterns de smart-wallet/abstraction de compte sur Solana avec autorisation programmable, controles de recuperation et validation de transaction orientee policy.",
  },
  "solana-pda-mastery": {
    title: "Maitrise des Program Derived Addresses",
    description:
      "Maitrisez l ingenierie avancee des PDAs sur Solana: design des schemas de seeds, discipline bump et usage securise des PDAs cross-program a l echelle production.",
  },
  "solana-economics": {
    title: "Economie Solana et Flux de Tokens",
    description:
      "Analysez les dynamiques economiques Solana en contexte production: interaction inflation/fee-burn, flux de staking, mouvements de supply et compromis de soutenabilite protocole.",
  },
};

export const frCourseTranslations: CourseTranslationMap = frCuratedCourseTranslations;
