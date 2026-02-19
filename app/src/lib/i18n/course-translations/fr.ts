import type { CourseTranslationMap } from "./types";

const frCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fondamentaux de Solana",
    description: "Introduction orientee production pour les debutants qui veulent des modeles mentaux Solana clairs, un debugging de transactions plus solide et des workflows wallet-manager deterministes.",
  },
  "anchor-development": {
    title: "Developpement Anchor",
    description: "Cours oriente projet pour passer des bases a une ingenierie Anchor reelle: modelisation deterministe des comptes, construction des instructions, discipline de test et UX client fiable.",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor Bases",
        "description": "Anchor architecture, compte constraints, et PDA foundations avec explicit ownership of securite-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modele mental",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Comptes, constraints, et safety",
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
        "title": "PDAs, Comptes, et Tests",
        "description": "Deterministic instruction builders, stable state emulation, et tests strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment instruction builder + state layout",
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
    title: "Developpement Interface Solana",
    description: "Cours oriente projet pour construire des tableau de bords Solana prets pour la production: reducers deterministes, pipelines d evenements rejouables et UX de transaction fiable.",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "Fondamentaux Interface pour Solana",
        description: "Modelez correctement l etat portefeuille/comptes, concevez l UX du cycle de vie transactionnel et imposez des regles deterministes pour un debugging rejouable.",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "Etat portefeuille + modele mental des comptes pour devs UI",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "Cycle de vie transaction UI: en attente/confirmee/finalisee et UI optimiste",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "Correction des donnees: deduplication, ordre, idempotence et evenements de correction",
          },
          "frontend-v2-core-reducer": {
            title: "Construire le modele d etat central + reducer depuis les evenements",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "Projet Tableau de bord Token",
        description: "Construisez reducer, snapshots de replay, metriques de requete et sorties tableau de bord deterministes stables sous donnees partielles ou retardees.",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "Implementer simulateur de flux + chronologie de replay + snapshots",
          },
          "frontend-v2-query-layer-metrics": {
            title: "Implementer couche de requete + metriques calculees",
          },
          "frontend-v2-production-ux-hardening": {
            title: "UX production: cache, pagination, banners d erreur, skeletons, limites de debit",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "Emettre un Tableau de bordSummary stable depuis des fixtures",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "DeFi sur Solana",
    description: "Cours avance oriente projet pour les ingenieurs qui construisent des systemes de swap: planification offline deterministe style Jupiter, classement des routes, securite minOut et diagnostics reproductibles.",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "Fondamentaux du Echange",
        description: "Comprendre la math CPMM, l anatomie du quote et les tradeoffs du routage deterministe avec des protections utilisateur orientees securite.",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "Bases AMM sur Solana: pools, frais, slippage et impact de prix",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "Anatomie d un quote: in/out, frais, minOut et execution worst-case",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "Routage: pourquoi deux sauts peuvent battre un hop",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "Projet Planificateur d echange style Jupiter (Offline)",
        description: "Construire quoting deterministe, selection de route et verifications minOut, puis produire des artefacts de point de controle stables pour des revues reproductibles.",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "Implementer modele token/pool + calcul de quote en produit constant",
          },
          "defi-v2-router-best": {
            title: "Implementer enumeration de routes et selection de la meilleure route",
          },
          "defi-v2-safety-minout": {
            title: "Implementer slippage/minOut, detail des frais et invariants de securite",
          },
          "defi-v2-production-swap-ux": {
            title: "UX swap production: quotes obsoletes, protection et simulation",
          },
          "defi-v2-checkpoint": {
            title: "Produire un point de controle stable EchangePlan + EchangeSummary",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "Securite et Audit Solana",
    description: "Laboratoire deterministe de vulnerabilites pour auditeurs Solana qui ont besoin de preuves d exploit repetables, de remediation precise et d artefacts d audit a fort signal.",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "Modele de Menace et Methode d Audit",
        description: "Modelisation des menaces centree sur les comptes, reproduction deterministe d exploits et discipline de preuve pour des findings d audit credibles.",
        lessons: {
          "security-v2-threat-model": {
            title: "Modele de menace Solana pour auditeurs: accounts, proprietaires, signataires, inscriptibles, PDAs",
          },
          "security-v2-evidence-chain": {
            title: "Chaine de preuve: reproduire, tracer, impact, corriger, verifier",
          },
          "security-v2-bug-classes": {
            title: "Classes de defauts Solana courantes et mitigations",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "Parcours Projet Laboratoire de vulnerabilites",
        description: "Exploiter, corriger, verifier et produire des artefacts prets pour audit avec traces deterministes et conclusions basees sur des invariants.",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Break it: exploiter l absence de verifications signataire + proprietaire",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Break it: exploiter un mismatch de spoof PDA",
          },
          "security-v2-patch-validate": {
            title: "Fix it: validations + suite d invariants",
          },
          "security-v2-writing-reports": {
            title: "Redaction de rapports d audit: severite, probabilite, blast radius, remediation",
          },
          "security-v2-audit-report-checkpoint": {
            title: "Point de controle: AuditReport JSON + markdown deterministe",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "Ingenierie de Tokens sur Solana",
    description: "Cours oriente projet pour les equipes qui lancent des tokens Solana reels: planification deterministe Token-2022, design des autorites, simulation de offre et discipline operationnelle de lancement.",
    modules: {
      "token-v2-module-fundamentals": {
        title: "Fondamentaux Token -> Token-2022",
        description: "Comprendre les primitives token, l anatomie des politiques de mint et les controles d extension Token-2022 avec un cadrage explicite gouvernance et threat model.",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "Tokens SPL vs Token-2022: ce que changent les extensions",
          },
          "token-v2-mint-anatomy": {
            title: "Anatomie du mint: authorities, decimales, offre, freeze, mint",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "Pieges de securite des extensions: fee configs, abus de delegue, etat de compte par defaut",
          },
          "token-v2-validate-config-derive": {
            title: "Valider la config token + deriver des adresses deterministes offline",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "Projet Pack de Lancement de Token",
        description: "Construire des workflows deterministes de validation, planification et simulation qui produisent des artefacts de lancement revisables et des criteres go/no-go clairs.",
        lessons: {
          "token-v2-build-init-plan": {
            title: "Construire un plan d instructions d initialisation Token-2022",
          },
          "token-v2-simulate-fees-supply": {
            title: "Construire la math mint-to + transfer-fee + simulation",
          },
          "token-v2-launch-checklist": {
            title: "Checklist de lancement: params, strategie upgrade/authority et plan airdrop/tests",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "Emettre un LaunchPackSummary stable",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "Developpement Mobile Solana",
    description: "Construisez des dApps Solana mobiles pretes pour la production avec MWA, architecture robuste de session wallet, UX de signature explicite et operations de distribution disciplinees.",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "Mobile Wallet Adapter",
        description: "Protocole MWA central, controle du cycle de vie de session et patterns resilients de handoff wallet pour applications mobiles en production.",
        lessons: {
          "mobile-wallet-overview": {
            title: "Vue d ensemble du wallet mobile",
          },
          "mwa-integration": {
            title: "Integration MWA",
          },
          "mobile-transaction": {
            title: "Construire une fonction de transaction mobile",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store et Distribution",
        description: "Publication, readiness operationnelle et pratiques UX mobile centrees confiance pour la distribution d applications Solana.",
        lessons: {
          "dapp-store-submission": {
            title: "Soumission au dApp Store",
          },
          "mobile-best-practices": {
            title: "Bonnes pratiques mobile",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "Tests de Programmes Solana",
    description: "Construisez des systemes de test Solana robustes sur environnements local, simule et reseau avec des invariants de securite explicites et des garde-fous de confiance de niveau release.",
    modules: {
      "module-testing-foundations": {
        title: "Fondations du Tests",
        description: "Strategie de tests centrale sur couches unit/integration avec workflows deterministes et couverture de cas adversariaux.",
        lessons: {
          "testing-approaches": {
            title: "Approches de tests",
          },
          "bankrun-testing": {
            title: "Tests avec Bankrun",
          },
          "write-bankrun-test": {
            title: "Ecrire un test Bankrun pour un Counter Program",
          },
        },
      },
      "module-advanced-testing": {
        title: "Tests Avance",
        description: "Fuzzing, validation devnet et controles de release CI/CD pour des changements de protocole plus surs.",
        lessons: {
          "fuzzing-trident": {
            title: "Fuzzing avec Trident",
          },
          "devnet-testing": {
            title: "Tests sur Devnet",
          },
          "ci-cd-pipeline": {
            title: "Pipeline CI/CD pour Solana",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "Indexation et Analytics Solana",
    description: "Construisez un indexeur d evenements Solana de niveau production avec decodage deterministe, contrats d ingestion resilients, reprise par point de controles et sorties analytiques fiables.",
    modules: {
      "indexing-v2-foundations": {
        title: "Fondations de l Indexation",
        description: "Modele d evenements, decodage des comptes token et parsing de metadonnees de transaction pour des pipelines d indexation fiables.",
        lessons: {
          "indexing-v2-events-model": {
            title: "Modele d evenements: transactions, logs et instructions de programme",
          },
          "indexing-v2-token-decoding": {
            title: "Decodage des comptes token et layout SPL",
          },
          "indexing-v2-decode-token-account": {
            title: "Defi: decoder un compte token + diff des soldes token",
          },
          "indexing-v2-transaction-meta": {
            title: "Parsing des metadonnees de transaction: logs, erreurs et instructions internes",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "Pipeline d Indexation et Analytics",
        description: "Normalisation des transactions, pagination/point de controles, strategies de cache et aggregation analytique reproductible.",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "Defi: indexer des transactions en evenements normalises",
          },
          "indexing-v2-pagination-caching": {
            title: "Pagination, point de controleing et semantique de cache",
          },
          "indexing-v2-analytics": {
            title: "Aggregation analytique: metriques par wallet et par token",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "Point de controle: produire un resume analytique JSON stable",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "Paiements et Checkout Solana",
    description: "Construisez des flux de paiement Solana de niveau production avec validations robustes, idempotence sure face aux retries, webhooks securises et recus deterministes pour la reconciliation.",
    modules: {
      "payments-v2-foundations": {
        title: "Fondations du Paiement",
        description: "Validation d adresse, strategie d idempotence et conception de payment intent pour un comportement de checkout fiable.",
        lessons: {
          "payments-v2-address-validation": {
            title: "Validation d adresse et strategies de memo",
          },
          "payments-v2-idempotency": {
            title: "Cles d idempotence et protection contre le replay",
          },
          "payments-v2-payment-intent": {
            title: "Defi: creer un payment intent avec validation",
          },
          "payments-v2-tx-building": {
            title: "Construction de transaction et metadonnees cles",
          },
        },
      },
      "payments-v2-implementation": {
        title: "Implementeration et Verification",
        description: "Construction de transaction, verification d authenticite webhook et generation deterministe de recu avec gestion claire des etats d erreur.",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "Defi: construire une transaction de transfert",
          },
          "payments-v2-webhooks": {
            title: "Signature et verification de webhooks",
          },
          "payments-v2-error-states": {
            title: "Machine d etats d erreur et format de recu",
          },
          "payments-v2-webhook-receipt": {
            title: "Defi: verifier un webhook et produire un recu",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "Fondamentaux NFTs et cNFTs",
    description: "Maitrisez l ingenierie des NFTs compresses sur Solana: engagements Merkle, systemes de preuve, modelisation de collection et controles de securite de niveau production.",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "Fondations Merkle",
        description: "Construction d arbre, hashing des feuilles, mecanique d insertion et modele de commitment on-chain/off-chain derriere les actifs compresses.",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "Arbres Merkle pour la compression d etat",
          },
          "cnft-v2-leaf-hashing": {
            title: "Conventions de hashing des feuilles et metadata",
          },
          "cnft-v2-merkle-insert": {
            title: "Defi: implementerer insertion Merkle + mises a jour de root",
          },
          "cnft-v2-proof-generation": {
            title: "Generation de preuve et calcul de chemin",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "Systeme de Preuve et Securite",
        description: "Generation et verification de preuve, integrite de collection et durcissement securite contre replay et spoof de metadata.",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "Defi: implementerer generation de preuve + verificateur",
          },
          "cnft-v2-collection-minting": {
            title: "Mints de collection et simulation metadata",
          },
          "cnft-v2-attack-surface": {
            title: "Surface d attaque: preuves invalides et replay",
          },
          "cnft-v2-compression-checkpoint": {
            title: "Point de controle: simuler mint + verifier une preuve d ownership",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "Gouvernance et Operations de Tresorerie Multisignature",
    description: "Construisez des systemes DAO et de tresorerie multisignature prets pour la production avec comptabilisation de vote deterministe, securite timelock et controles d execution securises.",
    modules: {
      "governance-v2-governance": {
        title: "Gouvernance DAO",
        description: "Cycle de vie des propositions, mecaniques de vote deterministes, politique de quorum et securite timelock pour une gouvernance DAO credible.",
        lessons: {
          "governance-v2-dao-model": {
            title: "Modele DAO: propositions, vote et execution",
          },
          "governance-v2-quorum-math": {
            title: "Math de quorum et calcul du poids de vote",
          },
          "governance-v2-timelocks": {
            title: "Etats de timelock et planification d execution",
          },
          "governance-v2-quorum-voting": {
            title: "Defi: implementer une machine d etat quorum/vote",
          },
        },
      },
      "governance-v2-multisig": {
        title: "Tresorerie Multisignature",
        description: "Construction de transaction multisignature, controles d approbation, defenses anti-relecture et patterns d execution securisee de tresorerie.",
        lessons: {
          "governance-v2-multisig": {
            title: "Construction de transaction multisignature et approbations",
          },
          "governance-v2-multisig-builder": {
            title: "Defi: implementer un constructeur tx multisignature + regles d approbation",
          },
          "governance-v2-safe-defaults": {
            title: "Valeurs par defaut surs: checks proprietaire et gardes anti-relecture",
          },
          "governance-v2-treasury-execution": {
            title: "Defi: executer une proposition et produire un diff de tresorerie",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "Performance Solana et Optimisation Compute",
    description: "Maitrisez l ingenierie de performance Solana avec des workflows d optimisation mesurables: budgets compute, layouts de donnees, efficacite d encodage et modelisation deterministe des couts.",
    modules: {
      "performance-v2-foundations": {
        title: "Fondations de Performance",
        description: "Modele compute, decisions de layout compte/donnees et estimation de cout deterministe pour raisonner la performance au niveau transaction.",
        lessons: {
          "performance-v2-compute-model": {
            title: "Modele compute: budgets, couts et limites",
          },
          "performance-v2-account-layout": {
            title: "Design de layout de compte et cout de serialisation",
          },
          "performance-v2-cost-model": {
            title: "Defi: implementerer le modele estimateCost(op)",
          },
          "performance-v2-instruction-data": {
            title: "Taille des donnees d instruction et optimisation d encodage",
          },
        },
      },
      "performance-v2-optimization": {
        title: "Optimisation et Analyse",
        description: "Optimisation de layout, tuning du budget de calcul et analyse before/after de performance avec garde-fous de correction.",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "Defi: implementerer un layout/codec optimise",
          },
          "performance-v2-compute-budget": {
            title: "Bases des instructions budget de calcul",
          },
          "performance-v2-micro-optimizations": {
            title: "Micro-optimisations et compromis",
          },
          "performance-v2-perf-checkpoint": {
            title: "Point de controle: comparer before/after + sortir un rapport de performance",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "Agregation DeFi de Echanges",
    description: "Maitrisez l aggregation de echanges en production sur Solana: parsing deterministe des quotes, compromis d optimisation de route, securite slippage et execution orientee fiabilite.",
    modules: {
      "swap-v2-fundamentals": {
        title: "Fondamentaux du Echange",
        description: "Mecanique de echange token, protection slippage, composition de routes et construction deterministe de EchangePlan avec compromis transparents.",
        lessons: {
          "swap-v2-mental-model": {
            title: "Modele mental du echange: mints, ATAs, decimales et routes",
          },
          "swap-v2-slippage": {
            title: "Slippage et impact prix: proteger les resultats du echange",
          },
          "swap-v2-route-explorer": {
            title: "Visualisation de route: comprendre les legs et fees de echange",
          },
          "swap-v2-swap-plan": {
            title: "Defi: construire un EchangePlan normalise a partir d un quote",
          },
        },
      },
      "swap-v2-execution": {
        title: "Execution et Fiabilite",
        description: "Execution par machine d etat, anatomie transaction, patterns de fiabilite retry/staleness et rapporting d execution a fort signal.",
        lessons: {
          "swap-v2-state-machine": {
            title: "Defi: implementerer la machine d etat UI du echange",
          },
          "swap-v2-tx-anatomy": {
            title: "Anatomie de transaction echange: instructions, comptes et compute",
          },
          "swap-v2-reliability": {
            title: "Patterns de fiabilite: retries, quotes stale et latence",
          },
          "swap-v2-swap-report": {
            title: "Point de controle: generer un EchangeRunRapport",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "Ingenierie de Liquidite CLMM",
    description: "Maitrisez l ingenierie de liquidite concentree sur les DEX Solana: mathematiques de tick, strategie de range, dynamique fees/IL et rapporting deterministe des positions LP.",
    modules: {
      "clmm-v2-fundamentals": {
        title: "Fondamentaux CLMM",
        description: "Concepts de liquidite concentree, maths tick/prix et comportement des positions de range pour raisonner sur l execution CLMM.",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM vs produit constant: pourquoi les ticks existent",
          },
          "clmm-v2-price-tick": {
            title: "Prix, tick et sqrtPrice: conversions essentielles",
          },
          "clmm-v2-range-explorer": {
            title: "Positions de range: dynamiques in-range et out-of-range",
          },
          "clmm-v2-tick-math": {
            title: "Defi: implementerer des helpers de conversion tick/prix",
          },
        },
      },
      "clmm-v2-positions": {
        title: "Positions et Risque",
        description: "Simulation d accumulation des fees, compromis des strategies de range, risques de precision et rapporting deterministe du risque de position.",
        lessons: {
          "clmm-v2-position-fees": {
            title: "Defi: simuler l accumulation des fees de position",
          },
          "clmm-v2-range-strategy": {
            title: "Strategies de range: etroite, large et regles de reequilibrage",
          },
          "clmm-v2-risk-review": {
            title: "Risques CLMM: arrondi, overflow et erreurs de tick spacing",
          },
          "clmm-v2-position-report": {
            title: "Point de controle: generer un rapport de position",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "Risque Pret et Liquidation",
    description: "Maitrisez l ingenierie du risque pret Solana: mecaniques de taux/utilisation, analyse des chemins de liquidation, securite oracle et rapporting deterministe de scenarios.",
    modules: {
      "lending-v2-fundamentals": {
        title: "Fondamentaux du Pret",
        description: "Mecanique des pools de pret, modeles de taux pilotes par l utilisation et bases de health factor necessaires a une analyse de risque defendable.",
        lessons: {
          "lending-v2-pool-model": {
            title: "Modele de pool de pret: supply, borrow et utilisation",
          },
          "lending-v2-interest-curves": {
            title: "Courbes de taux d interet et modele de kink",
          },
          "lending-v2-health-explorer": {
            title: "Monitoring du health factor et apercu de liquidation",
          },
          "lending-v2-interest-rates": {
            title: "Defi: calculer des taux d interet bases sur l utilisation",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "Gestion du Risque",
        description: "Calcul du health factor, mecanique de liquidation, gestion des pannes oracle et rapporting de risque multi-scenarios pour des marches sous stress.",
        lessons: {
          "lending-v2-health-factor": {
            title: "Defi: calculer le health factor et le statut de liquidation",
          },
          "lending-v2-liquidation-mechanics": {
            title: "Mecanique de liquidation: bonus, close factor et bad debt",
          },
          "lending-v2-oracle-risk": {
            title: "Risque oracle et prix obsoletes dans le pret",
          },
          "lending-v2-risk-report": {
            title: "Point de controle: generer un rapport de risque multi-scenarios",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "Console de Risque Perpetuels",
    description: "Maitrisez l ingenierie du risque perpetuels sur Solana: comptabilite precise PnL/funding, surveillance de marge, simulation de liquidation et rapporting deterministe sur console.",
    modules: {
      "perps-v2-fundamentals": {
        title: "Fondamentaux des Perpetuels",
        description: "Mecanique des contrats perpetuels, logique d accumulation du funding et bases de modelisation PnL pour des diagnostics de position precis.",
        lessons: {
          "perps-v2-mental-model": {
            title: "Futures perpetuels: positions de base, prix d entree et mark vs oracle",
          },
          "perps-v2-funding": {
            title: "Funding rates: pourquoi ils existent et comment ils s accumulent",
          },
          "perps-v2-pnl-explorer": {
            title: "Visualisation du PnL: suivre la performance dans le temps",
          },
          "perps-v2-pnl-calc": {
            title: "Defi: calculer le PnL des futures perpetuels",
          },
          "perps-v2-funding-accrual": {
            title: "Defi: simuler l accumulation du funding rate",
          },
        },
      },
      "perps-v2-risk": {
        title: "Risque et Monitoring",
        description: "Suivi de marge et liquidation, pieges classiques d implementeration et sorties deterministes de console de risque pour l observabilite en production.",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "Ratio de marge et seuils de liquidation",
          },
          "perps-v2-common-bugs": {
            title: "Bugs frequents: erreurs de signe, unites et sens du funding",
          },
          "perps-v2-risk-console-report": {
            title: "Point de controle: generer un rapport de console de risque",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "Optimiseur de Transactions DeFi",
    description: "Maitrisez l optimisation de transactions DeFi sur Solana: tuning compute/frais, strategie ALT, patterns de fiabilite et planification deterministe de strategie d envoi.",
    modules: {
      "txopt-v2-fundamentals": {
        title: "Fondamentaux Transaction",
        description: "Diagnostic des echecs de transaction, mecanique budget de calcul, strategie de priority fee et bases d estimation des frais.",
        lessons: {
          "txopt-v2-why-fail": {
            title: "Pourquoi les transactions DeFi echouent: limites CU, taille et expiration blockhash",
          },
          "txopt-v2-compute-budget": {
            title: "Instructions budget de calcul et strategie de priority fee",
          },
          "txopt-v2-cost-explorer": {
            title: "Estimation du cout de transaction et planification des frais",
          },
          "txopt-v2-tx-plan": {
            title: "Defi: construire un plan de transaction avec budget de calculing",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "Optimisation et Strategie",
        description: "Planification Address Lookup Table, patterns de fiabilite/retry, UX d erreurs actionnables et rapporting complet de strategie d envoi.",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "Defi: planifier l usage d Address Lookup Table",
          },
          "txopt-v2-reliability": {
            title: "Patterns de fiabilite: retry, re-quote, resend vs reconstruire",
          },
          "txopt-v2-ux-errors": {
            title: "UX: messages d erreur actionnables pour echecs de transaction",
          },
          "txopt-v2-send-strategy": {
            title: "Point de controle: generer un rapport de strategie d envoi",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "Signature Mobile Solana",
    description: "Maitrisez la signature portefeuille mobile en production sur Solana: sessions Android MWA, contraintes deep-link iOS, retries resilients et telemetrie de session deterministe.",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "Fondamentaux de Signature Mobile",
        description: "Contraintes plateforme, patterns UX de connexion, comportement de timeline de signature et construction typee des requests sur Android/iOS.",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "Reality check de signature mobile: contraintes Android vs iOS",
          },
          "mobilesign-v2-connection-ux": {
            title: "Patterns UX de connexion portefeuille: connect, reconnect et recovery",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "Timeline de session de signature: flux request, portefeuille et reponse",
          },
          "mobilesign-v2-sign-request": {
            title: "Defi: construire une sign request typee",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "Patterns de Production",
        description: "Persistance de session, securite des ecrans de revue de transaction, machines d etat de retry et rapporting deterministe de session pour apps mobiles en production.",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "Defi: persistance et restauration de session",
          },
          "mobilesign-v2-review-screens": {
            title: "Revue de transaction mobile: ce que les utilisateurs doivent voir",
          },
          "mobilesign-v2-retry-patterns": {
            title: "Retry en un tap: gerer etats offline, rejected et timeout",
          },
          "mobilesign-v2-session-report": {
            title: "Point de controle: generer un rapport de session",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "Commerce Solana Pay",
    description: "Maitrisez l integration commerce Solana Pay: encodage URL robuste, workflows de suivi QR/paiement, UX de confirmation et artefacts deterministes de reconciliation POS.",
    modules: {
      "solanapay-v2-foundations": {
        title: "Fondations Solana Pay",
        description: "Specification Solana Pay, rigueur d encodage URL, anatomie des transfer requests et patterns deterministes de construireer/encoder.",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "Modele mental Solana Pay et regles d encodage URL",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "Anatomie de transfer request: recipient, amount, reference et labels",
          },
          "solanapay-v2-url-explorer": {
            title: "Constructeur d URL: apercu live des URLs Solana Pay",
          },
          "solanapay-v2-encode-transfer": {
            title: "Defi: encoder une URL de transfer request Solana Pay",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "Tracking et Commerce",
        description: "Machines d etat de tracking par reference, UX de confirmation, gestion des echecs et generation deterministe de recu POS.",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "Defi: suivre les references de paiement selon les etats de confirmation",
          },
          "solanapay-v2-confirmation-ux": {
            title: "UX de confirmation: etats pending, confirmed et expired",
          },
          "solanapay-v2-error-handling": {
            title: "Gestion des erreurs et cas limites dans les flux de paiement",
          },
          "solanapay-v2-pos-receipt": {
            title: "Point de controle: generer un recu POS",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "Ingenierie UX Portefeuille",
    description: "Maitrisez l ingenierie UX portefeuille en production sur Solana: etat de connexion deterministe, securite reseau, resilience RPC et patterns de fiabilite mesurables.",
    modules: {
      "walletux-v2-fundamentals": {
        title: "Fondamentaux de Connexion",
        description: "Design de connexion portefeuille, reseau gating et architecture deterministe de machine d etat pour onboarding et reconnexion previsibles.",
        lessons: {
          "walletux-v2-connection-design": {
            title: "UX de connexion qui tient la route: liste de verification de design",
          },
          "walletux-v2-network-gating": {
            title: "Reseau gating et recuperation en mauvais reseau",
          },
          "walletux-v2-state-explorer": {
            title: "Machine d etat de connexion: etats, evenements et transitions",
          },
          "walletux-v2-connection-state": {
            title: "Defi: implementer la machine d etat de connexion portefeuille",
          },
        },
      },
      "walletux-v2-production": {
        title: "Patterns de Production",
        description: "Invalidation de cache, resilience et monitoring de sante RPC, et rapporting mesurable de qualite UX portefeuille pour les operations production.",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "Defi: invalidation de cache sur evenements portefeuille",
          },
          "walletux-v2-rpc-caching": {
            title: "Lectures RPC et strategie de cache pour apps portefeuille",
          },
          "walletux-v2-rpc-health": {
            title: "Monitoring de sante RPC et degradation progressive",
          },
          "walletux-v2-ux-report": {
            title: "Point de controle: generer un Portefeuille UX Rapport",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "Maitrisez l authentification SIWS en production sur Solana: entrees standardisees, invariants stricts de verification, cycle de vie nonce resistant au replay et reporting pret pour audit.",
    modules: {
      "siws-v2-fundamentals": {
        title: "Fondamentaux SIWS",
        description: "Raison d etre de SIWS, semantique stricte des champs d entree, comportement de rendu portefeuille et construction deterministe d un sign-in input.",
        lessons: {
          "siws-v2-why-exists": {
            title: "Pourquoi SIWS existe: remplacer connect-and-signMessage",
          },
          "siws-v2-input-fields": {
            title: "Champs d entree SIWS et regles de securite",
          },
          "siws-v2-message-preview": {
            title: "Apercu de message: comment les portefeuilles rendent les requetes SIWS",
          },
          "siws-v2-sign-in-input": {
            title: "Defi: construire un sign-in input SIWS valide",
          },
        },
      },
      "siws-v2-verification": {
        title: "Verification et Securite",
        description: "Invariants de verification server-side, defenses nonce anti-replay, gestion de session et reporting deterministe d audit d authentification.",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "Defi: verifier une reponse de sign-in SIWS",
          },
          "siws-v2-sessions": {
            title: "Sessions et logout: quoi stocker et quoi ne pas stocker",
          },
          "siws-v2-replay-protection": {
            title: "Protection replay et design du registre de nonce",
          },
          "siws-v2-auth-report": {
            title: "Point de controle: generer un rapport d audit d authentification",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "Frais prioritaires et Budget de calcul",
    description: "Ingenierie defensive des frais Solana avec planification compute deterministe, politique de priorite adaptative et contrats UX de fiabilite axes confirmation.",
    modules: {
      "pfcb-v2-foundations": {
        title: "Fondations Fees et Compute",
        description: "Mecaniques d inclusion, couplage compute/frais et design de politique guide par explorer avec cadrage deterministe de fiabilite.",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "Marches de frais sur Solana: ce qui deplace vraiment l inclusion",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "Bases du budget de calcul et modes d echec frequents",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer: des inputs du planner budget de calcul au plan",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "Defi: implementerer planComputeBudget()",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "Parcours Projet Fee Optimiseur",
        description: "Implementerer des planners deterministes, des moteurs de politique de confirmation et des artefacts stables de strategie de frais pour revue release.",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "Defi: implementerer estimatePriorityFee()",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "Defi: moteur de decision de niveau de confirmation",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "Defi: construire le markdown feePlanResume",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "Point de controle: rapport Fee Optimiseur",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "Lots et Atomicite des Transactions",
    description: "Concevez des flux Solana defensifs multi-transactions avec validation deterministe de l atomicite, modelisation de compensation et rapporting securite pret pour audit.",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "Fondations de l Atomicite",
        description: "Modele d atomicite, risques des flux multi-transactions et validation defensive de securite pour proteger les attentes utilisateur.",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "Concepts d atomicite et pourquoi les utilisateurs supposent tout-ou-rien",
          },
          "bundles-v2-flow-risk-points": {
            title: "Flux multi-transactions: approvals, creation ATA, swaps et refunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer: etapes du flow graph et points de risque",
          },
          "bundles-v2-build-atomic-flow": {
            title: "Defi: implementerer construireAtomicFlow()",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "Projet Simulateur de Flux Atomic Swap",
        description: "Implementerer des validateurs d atomicite deterministes, des patterns de gestion d echec et une composition stable de lots pour revue de release.",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "Defi: implementerer validateAtomicite()",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "Defi: gestion d echec avec cles d idempotence",
          },
          "bundles-v2-bundle-composer": {
            title: "Defi: composeur de lots deterministe",
          },
          "bundles-v2-flow-safety-report": {
            title: "Point de controle: rapport de securite du flux",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "Realite Mempool et UX Anti-Sandwich",
    description: "Ingenierie defensive UX de swap avec notation de risque deterministe, politiques de slippage bornees et communication securite prete pour incident.",
    modules: {
      "mempoolux-v2-foundations": {
        title: "Realite Mempool et Defense UX",
        description: "Risques entre quote et execution, guardrails de slippage et decisions de fraicheur pour des swaps plus surs en production.",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "Ce qui peut mal tourner entre quote et execution",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "Controles de slippage et guardrails",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer: timer de fraicheur du quote et table de decision",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "Defi: implementerer evaluateSwapRisk()",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "Parcours Projet UI de Swap Protege",
        description: "Implementerer des gardes de slippage, des modeles d impact et des configurations de protection exportables avec sortie deterministe.",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "Defi: implementerer slippageGuard()",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "Defi: modeliser impact prix vs slippage",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "Defi: construire swapSafetyBanner()",
          },
          "mempoolux-v2-protection-config-export": {
            title: "Point de controle: export de config de protection de swap",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "Indexeurs, Webhooks et Pipelines Reorg-Safe",
    description: "Construisez des pipelines d indexation deterministes de niveau production pour ingestion sure contre doublons, gestion de reorg et rapporting centre integrite.",
    modules: {
      "indexpipe-v2-foundations": {
        title: "Fondations de Fiabilite d Indexer",
        description: "Bases d indexation, realite reorg/confirmation et etapes de pipeline pour des ingestions tracables et sures.",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "Indexation 101: logs, comptes et parsing de transaction",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "Reorgs et choix de fork: pourquoi confirmed n est pas finalized",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer: ingest vers dedupe vers confirm vers apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "Defi: implementerer dedupeEvents()",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "Parcours Projet Indexer Reorg-Safe",
        description: "Implementerer la logique de confirmations, la planification backfill/idempotence et les checks d integrite pour des rapports pipeline stables.",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "Defi: implementerer applyWithConfirmations()",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "Defi: planification backfill et idempotence",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "Defi: checks d integrite de snapshot",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "Point de controle: export du rapport pipeline",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "Fiabilite RPC et Ingenierie Latence",
    description: "Concevez des clients RPC Solana multi-fournisseurs de niveau production avec politiques deterministes de nouvelle tentative, routage, cache et observabilite.",
    modules: {
      "rpc-v2-foundations": {
        "title": "RPC Reliability Foundations",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, et deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests et fallbacks",
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
        "description": "Build deterministic policy engines pour routing, retries, metrics reduction, et health report exports.",
        "lessons": {
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching et invalidation policy",
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer et histogram buckets",
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
          },
        },
      },
    },
  },
  "rust-data-layout-borsh": {
    title: "Structure de Donnees Rust et Maitrise Borsh",
    description: "Ingenierie de structure de donnees Solana orientee Rust avec outillage deterministe au niveau octet et pratiques de schema sures pour la compatibilite.",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, et pratique parsing safety pour stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, et why Solana comptes care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct et enum layout pitfalls plus Borsh rules",
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer pour field offsets",
          },
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
          },
        },
      },
      "rdb-v2-project-journey": {
        "title": "Compte Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, et compatibility-focused reporting helpers.",
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
    title: "Conception d Erreurs et Invariants Rust",
    description: "Construisez des bibliotheques typees de garde d invariants avec artefacts de preuve deterministes, contrats d erreur compatibles et rapporting pret pour audit.",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error et Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, et deterministic invariant conception fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, et context",
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
        "description": "Implement guard helpers, evidence-chain generation, et stable audit reporting pour reliability et incident response.",
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
    title: "Performance Rust pour la Pensee On-chain",
    description: "Simulez et optimisez le cout compute avec un outillage deterministe Rust-first et une gouvernance performance pilotee par budget.",
    modules: {
      "rpot-v2-foundations": {
        "title": "Performance Foundations",
        "description": "Rust performance modele mentals, data-structure tradeoffs, et deterministic cost reasoning pour reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Performance modele mental: allocations, clones, hashing",
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
        "description": "Build deterministic profilers, recommendation engines, et report outputs aligned to explicit performance budgets.",
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
    title: "Concurrence et Asynchrone pour Indexeurs (Rust)",
    description: "Ingenierie de pipeline asynchrone Rust-first avec concurrence bornee, reducers replay-securise et rapporting operationnel deterministe.",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, et deterministic execution modeling pour indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits et backpressure",
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph et concurrency",
          },
        },
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, et report exports pour reorg-safe pipeline operations.",
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
    title: "Macros Procedurales et Generation de code pour la Securite",
    description: "Securite macro/generation de code en Rust enseignee via parser deterministe et outillage de generation de checks avec sorties audit-friendly.",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro et Codegen Foundations",
        "description": "Macro modele mentals, constraint DSL conception, et safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro modele mental: declarative vs procedural",
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
        "title": "Compte Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, et publish stable safety reports.",
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
    title: "Mise a jours Anchor et Migrations de Comptes",
    description: "Concevez des workflows de release Anchor surs pour la production avec planification de migration deterministe, gates d mise a jour, playbooks de rollback et preuves de readiness.",
    modules: {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, compte versioning strategy, et deterministic upgrade risk modeling pour Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Compte versioning et migration strategy",
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
        "description": "Safety validation gates, rollback planning, et deterministic readiness artifacts pour controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy et incident playbooks",
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
    title: "Ingenierie de Fiabilite pour Solana",
    description: "Ingenierie de fiabilite orientee production pour systemes Solana: tolerance aux pannes, retries, deadlines, circuit breakers et degradation progressive avec resultats mesurables.",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks avec clear failure classification, retry boundaries, et deterministic recovery behavior.",
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
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, et rate controls) that protect core user flows during provider instability.",
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
    title: "Strategies de Test pour Solana",
    description: "Strategie de test complete et orientee production pour Solana: tests unitaires deterministes, tests d integration realistes, fuzz/property tests et rapporting de confiance release.",
    modules: {
      "mod-11-1": {
        "title": "Unit et Integration Tests",
        "description": "Build deterministic unit et integration tests layers avec clear ownership of invariants, fixtures, et failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Tests Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock Compte Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "Avance Tests Techniques",
        "description": "Use fuzzing, property-based tests, et mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing et Property Tests",
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
    title: "Optimisation de Programmemes Solana",
    description: "Concevez des performances Solana de niveau production: compute budgeting, efficacite des layouts de comptes, compromis memoire/rent et workflows d optimisation deterministes.",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths avec explicit CU budgets, operation-level profiling, et predictable performance tradeoffs.",
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
        "title": "Memory et Storage Optimization",
        "description": "Conception memory/storage-efficient compte layouts avec rent-aware sizing, serialization discipline, et safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Compte Data Optimization",
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
    title: "Conception Tokenomics pour Solana",
    description: "Concevez des economies de token Solana robustes avec discipline de distribution, securite de vesting, incentives de staking et mecaniques de gouvernance defendables operationnellement.",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution et Vesting",
        "description": "Model token allocation et vesting systems avec explicit fairness, unlock predictability, et deterministic accounting rules.",
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
        "title": "Staking et Gouvernance",
        "description": "Conception staking et gouvernance mechanics avec clear incentive alignment, anti-manipulation constraints, et measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking et Gouvernance Conception",
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
    title: "Primitives DeFi sur Solana",
    description: "Construisez des fondations DeFi pratiques sur Solana: mecaniques AMM, comptabilite de liquidite, primitives de pret et patterns de composition surs face aux flash loans.",
    modules: {
      "mod-14-1": {
        "title": "AMM et Liquidity",
        "description": "Implement AMM et liquidity primitives avec deterministic math, slippage-aware outputs, et LP accounting correctness.",
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
        "title": "Lending et Flash Loans",
        "description": "Model lending et flash-loan flows avec collateral safety, utilization-aware pricing, et strict repayment invariants.",
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
            "title": "Flash Loan Validateur Challenge",
          },
        },
      },
    },
  },
  "solana-nft-standards": {
    title: "Normes NFT sur Solana",
    description: "Implementerez des NFTs Solana avec normes prets production: integrite metadata, discipline de collection et comportements avances programmables/non transferables.",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality avec standards-compliant metadata, collection verification, et deterministic asset-state handling.",
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
        "title": "Avance NFT Features",
        "description": "Implement avance NFT behaviors (soulbound et programmable flows) avec explicit policy controls et safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound et Programmable NFTs",
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validateur Challenge",
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
    title: "Patterns d Invocation Inter-programmes (CPI)",
    description: "Maitrisez la composition CPI sur Solana avec validation de comptes sure, discipline des signers PDA et patterns deterministes d orchestration multi-programmes.",
  },
  "solana-mev-strategies": {
    title: "MEV et Ordonnancement des Transactions",
    description: "Ingenierie d ordonnancement de transactions orientee production sur Solana: routage conscient du MEV, strategie de bundles, modelisation liquidation/arbitrage et controles d execution protecteurs pour l utilisateur.",
  },
  "solana-deployment-cicd": {
    title: "Deploiement de Programmemes et CI/CD",
    description: "Ingenierie de deploiement production pour programmemes Solana: strategie d environnements, release gating, controles qualite CI/CD et workflows operationnels safe pour les upgrades.",
  },
  "solana-cross-chain-bridges": {
    title: "Ponts Interchaines et Wormhole",
    description: "Construisez des integrations interchaines plus sures pour Solana avec messagerie style Wormhole, verification d attestations et controles deterministes de l etat pont.",
  },
  "solana-oracle-pyth": {
    title: "Integration Oracle et Reseau Pyth",
    description: "Integrez les feeds oracle Solana en securite: validation de prix, politique confiance/staleness et aggregation multi-source pour des decisions de protocole resilientes.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO et Organisations Autonomes",
    description: "Construisez des systemes DAO prets production sur Solana: gouvernance de propositions, integrite du vote, controles de tresorerie et workflows deterministes d execution/rapporting.",
  },
  "solana-gaming": {
    title: "Jeu et Gestion de l Etat de Jeu",
    description: "Construisez des systemes de jeu on-chain prets production sur Solana: modeles d etat efficaces, integrite des tours, controles d equite et economie de progression joueurs scalable.",
  },
  "solana-permanent-storage": {
    title: "Stockage Permanent et Arweave",
    description: "Integrez un stockage decentralise permanent avec Solana via des workflows style Arweave: content addressing, integrite des manifests et acces long terme verifiable aux donnees.",
  },
  "solana-staking-economics": {
    title: "Staking et Economie des Validateurs",
    description: "Comprenez l economie du staking et des validateurs Solana pour la decision reelle: strategie de delegation, dynamique des rewards, effets de commission et soutenabilite operationnelle.",
  },
  "solana-account-abstraction": {
    title: "Abstraction de Compte et Smart Portefeuilles",
    description: "Implementerez des patterns de smart-portefeuille/abstraction de compte sur Solana avec autorisation programmable, controles de recuperation et validation de transaction orientee policy.",
  },
  "solana-pda-mastery": {
    title: "Maitrise des Program Derived Addresses",
    description: "Maitrisez l ingenierie avancee des PDAs sur Solana: design des schemas de seeds, discipline bump et usage securise des PDAs cross-program a l echelle production.",
  },
  "solana-economics": {
    title: "Economie Solana et Flux de Tokens",
    description: "Analysez les dynamiques economiques Solana en contexte production: interaction inflation/fee-burn, flux de staking, mouvements de supply et compromis de soutenabilite protocole.",
  },
};

export const frCourseTranslations: CourseTranslationMap = frCuratedCourseTranslations;
