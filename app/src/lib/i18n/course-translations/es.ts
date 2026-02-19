import type { CourseTranslationMap } from "./types";

const esCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fundamentos de Solana",
    description:
      "Introduccion practica para dominar los fundamentos de Solana con modelos mentales claros y flujo de trabajo reproducible.",
    modules: {
      "module-getting-started": {
        title: "Primeros pasos",
        description:
          "Modelo de ejecucion, semantica de cuentas y patrones de construccion de transacciones antes de crear programas complejos.",
        lessons: {
          "solana-mental-model": { title: "Modelo mental de Solana" },
          "accounts-model-deep-dive": { title: "Analisis profundo del modelo de cuentas" },
          "transactions-and-instructions": { title: "Transacciones e instrucciones" },
          "build-sol-transfer-transaction": { title: "Construye una transaccion de transferencia SOL" },
        },
      },
      "module-programs-and-pdas": {
        title: "Programas y PDAs",
        description:
          "Comportamiento de programas, diseno determinista de PDAs y modelo mental de SPL tokens con controles de seguridad.",
        lessons: {
          "programs-what-they-are": { title: "Programas: que son (y que no son)" },
          "program-derived-addresses-pdas": { title: "Direcciones derivadas de programa (PDAs)" },
          "spl-token-basics": { title: "Fundamentos de SPL Tokens" },
          "wallet-manager-cli-sim": { title: "Simulador CLI de Wallet Manager" },
        },
      },
    },
  },
  "anchor-development": {
    title: "Desarrollo con Anchor",
    description:
      "Curso orientado a proyectos para pasar de lo basico a ingenieria real con Anchor: modelado determinista de cuentas, construccion de instrucciones, disciplina de testing y UX de cliente confiable.",
  },
  "solana-frontend": {
    title: "Desarrollo Frontend en Solana",
    description:
      "Curso orientado a proyectos para crear dashboards de Solana listos para produccion: reducers deterministas, pipelines de eventos reproducibles y UX de transacciones confiable.",
  },
  "defi-solana": {
    title: "DeFi en Solana",
    description:
      "Curso avanzado orientado a proyectos para construir sistemas de swaps: planeacion determinista estilo Jupiter sin dependencia online, ranking de rutas, seguridad de minOut y diagnosticos reproducibles.",
  },
  "solana-security": {
    title: "Seguridad y Auditoria en Solana",
    description:
      "Laboratorio determinista de vulnerabilidades para auditores de Solana que necesitan evidencia de exploits repetible, guias de remediacion precisas y artefactos de auditoria de alta senal.",
  },
  "token-engineering": {
    title: "Ingenieria de Tokens en Solana",
    description:
      "Curso orientado a proyectos para equipos que lanzan tokens reales en Solana: planeacion determinista de Token-2022, diseno de autoridades, simulacion de supply y disciplina operativa de lanzamiento.",
  },
  "solana-mobile": {
    title: "Desarrollo Movil en Solana",
    description:
      "Construye dApps moviles de Solana listas para produccion con MWA, arquitectura robusta de sesiones de wallet, UX de firma explicita y operaciones de distribucion disciplinadas.",
  },
  "solana-testing": {
    title: "Testing de Programas en Solana",
    description:
      "Construye sistemas de testing robustos para Solana en entornos locales, simulados y de red con invariantes de seguridad explicitas y controles de confianza de calidad de release.",
  },
  "solana-indexing": {
    title: "Indexacion y Analitica en Solana",
    description:
      "Construye un indexador de eventos de Solana de nivel produccion con decodificacion determinista, contratos de ingesta resilientes, recuperacion por checkpoints y salidas analiticas confiables.",
  },
  "solana-payments": {
    title: "Pagos y Checkout en Solana",
    description:
      "Construye flujos de pago en Solana de nivel produccion con validaciones robustas, idempotencia segura ante reintentos, webhooks seguros y comprobantes deterministas para conciliacion.",
  },
  "solana-nft-compression": {
    title: "Fundamentos de NFTs y cNFTs",
    description:
      "Domina la ingenieria de NFTs comprimidos en Solana: compromisos Merkle, sistemas de pruebas, modelado de colecciones y controles de seguridad de nivel produccion.",
  },
  "solana-governance-multisig": {
    title: "Gobernanza y Operaciones de Tesoreria Multisig",
    description:
      "Construye sistemas DAO y tesoreria multisig listos para produccion con conteo de votos determinista, seguridad por timelock y controles de ejecucion seguros.",
  },
  "solana-performance": {
    title: "Rendimiento de Solana y Optimizacion de Compute",
    description:
      "Domina la ingenieria de rendimiento en Solana con flujos de optimizacion medibles: compute budget, layouts de datos, eficiencia de encoding y modelado de costos determinista.",
  },
  "defi-swap-aggregator": {
    title: "Agregacion DeFi de Swaps",
    description:
      "Domina la agregacion de swaps en Solana para produccion: parseo determinista de cotizaciones, tradeoffs de optimizacion de rutas, seguridad de slippage y ejecucion consciente de confiabilidad.",
  },
  "defi-clmm-liquidity": {
    title: "Ingenieria de Liquidez CLMM",
    description:
      "Domina la ingenieria de liquidez concentrada en DEX de Solana: matematicas de ticks, diseno de estrategias por rango, dinamicas de fees e impermanent loss y reportes deterministas de posiciones LP.",
  },
  "defi-lending-risk": {
    title: "Riesgo de Lending y Liquidaciones",
    description:
      "Domina el riesgo de lending en Solana: mecanicas de utilizacion y tasas, analisis de rutas de liquidacion, seguridad de oraculos y reportes deterministas de escenarios.",
  },
  "defi-perps-risk-console": {
    title: "Consola de Riesgo para Perpetuos",
    description:
      "Domina la ingenieria de riesgo de perps en Solana: contabilidad precisa de PnL y funding, monitoreo de margen, simulacion de liquidaciones y reportes deterministas en consola.",
  },
  "defi-tx-optimizer": {
    title: "Optimizador de Transacciones DeFi",
    description:
      "Domina la optimizacion de transacciones DeFi en Solana: ajuste de compute y fees, estrategia ALT, patrones de confiabilidad y planificacion determinista de estrategias de envio.",
  },
  "solana-mobile-signing": {
    title: "Firma Movil en Solana",
    description:
      "Domina la firma de wallets moviles en Solana para produccion: sesiones Android MWA, restricciones de deep links en iOS, reintentos resilientes y telemetria determinista de sesion.",
  },
  "solana-pay-commerce": {
    title: "Comercio con Solana Pay",
    description:
      "Domina la integracion comercial de Solana Pay: encoding robusto de URLs, flujos de tracking QR y pagos, UX de confirmacion y artefactos deterministas de conciliacion POS.",
  },
  "wallet-ux-engineering": {
    title: "Ingenieria UX de Wallet",
    description:
      "Domina la ingenieria UX de wallets en Solana para produccion: estado de conexion determinista, seguridad de red, resiliencia RPC y patrones de confiabilidad medibles.",
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description:
      "Domina la autenticacion SIWS en Solana para produccion: entradas estandarizadas, invariantes estrictas de verificacion, ciclo de vida de nonce resistente a replay y reportes listos para auditoria.",
  },
  "priority-fees-compute-budget": {
    title: "Priority Fees y Compute Budget",
    description:
      "Ingenieria defensiva de fees en Solana con planificacion determinista de compute, politica adaptativa de prioridad y contratos de confiabilidad UX orientados a confirmacion.",
  },
  "bundles-atomicity": {
    title: "Bundles y Atomicidad de Transacciones",
    description:
      "Disena flujos defensivos multi-transaccion en Solana con validacion determinista de atomicidad, modelado de compensaciones y reportes de seguridad listos para auditoria.",
  },
  "mempool-ux-defense": {
    title: "Realidad del Mempool y UX Anti-Sandwich",
    description:
      "Ingenieria defensiva de UX para swaps con gradacion de riesgo determinista, politicas de slippage acotadas y comunicacion de seguridad lista para incidentes.",
  },
  "indexing-webhooks-pipelines": {
    title: "Indexers, Webhooks y Pipelines Seguros ante Reorg",
    description:
      "Construye pipelines deterministas de indexacion en produccion con ingesta segura ante duplicados, manejo de reorg e informes centrados en integridad.",
  },
  "rpc-reliability-latency": {
    title: "Confiabilidad RPC e Ingenieria de Latencia",
    description:
      "Disena clientes RPC multi-proveedor en Solana para produccion con politicas deterministas de retry, routing, cache y observabilidad.",
  },
  "rust-data-layout-borsh": {
    title: "Rust Data Layout y Dominio de Borsh",
    description:
      "Ingenieria de layout de datos en Solana con enfoque Rust y tooling determinista a nivel de bytes, junto con practicas de esquema seguras para compatibilidad.",
  },
  "rust-errors-invariants": {
    title: "Diseno de Errores e Invariantes en Rust",
    description:
      "Construye librerias de guardas por invariantes tipadas con artefactos de evidencia determinista, contratos de error seguros para compatibilidad y reportes listos para auditoria.",
  },
  "rust-perf-onchain-thinking": {
    title: "Rendimiento Rust para Mentalidad On-chain",
    description:
      "Simula y optimiza comportamiento de costo de compute con tooling determinista Rust-first y gobernanza de rendimiento guiada por presupuesto.",
  },
  "rust-async-indexer-pipeline": {
    title: "Concurrencia y Async para Indexers (Rust)",
    description:
      "Ingenieria de pipelines async con enfoque Rust-first y concurrencia acotada, reducers seguros ante replay y reportes operativos deterministas.",
  },
  "rust-proc-macros-codegen-safety": {
    title: "Macros Procedurales y Codegen para Seguridad",
    description:
      "Seguridad de macros y codegen en Rust ensenada mediante parser determinista y tooling de generacion de chequeos con salidas amigables para auditoria.",
  },
  "anchor-upgrades-migrations": {
    title: "Upgrades de Anchor y Migraciones de Cuentas",
    description:
      "Disena flujos de release seguros para produccion en Anchor con planificacion determinista de migraciones, gates de upgrade, playbooks de rollback y evidencia de readiness.",
  },
  "solana-reliability": {
    title: "Ingenieria de Confiabilidad para Solana",
    description:
      "Ingenieria de confiabilidad enfocada en produccion para sistemas Solana: tolerancia a fallos, retries, deadlines, circuit breakers y degradacion gradual con resultados operativos medibles.",
  },
  "solana-testing-strategies": {
    title: "Estrategias de Testing para Solana",
    description:
      "Estrategia integral de testing para Solana orientada a produccion: pruebas unitarias deterministas, integraciones realistas, fuzz/property testing y reportes de confianza para release.",
  },
  "solana-program-optimization": {
    title: "Optimizacion de Programas Solana",
    description:
      "Disena rendimiento de nivel produccion en Solana: compute budgeting, eficiencia de layout de cuentas, tradeoffs de memoria/rent y workflows de optimizacion deterministas.",
  },
  "solana-tokenomics-design": {
    title: "Diseno de Tokenomics para Solana",
    description:
      "Disena economias de token robustas en Solana con disciplina de distribucion, seguridad de vesting, incentivos de staking y mecanicas de gobernanza defendibles operativamente.",
  },
  "solana-defi-primitives": {
    title: "Primitivas DeFi en Solana",
    description:
      "Construye fundamentos practicos de DeFi en Solana: mecanicas AMM, contabilidad de liquidez, primitivas de lending y patrones de composicion seguros ante flash loans.",
  },
  "solana-nft-standards": {
    title: "Estandares NFT en Solana",
    description:
      "Implementa NFTs de Solana con estandares listos para produccion: integridad de metadata, disciplina de colecciones y comportamientos avanzados programables/no transferibles.",
  },
  "solana-cpi-patterns": {
    title: "Patrones de Invocacion Cross-Program (CPI)",
    description:
      "Domina la composicion CPI en Solana con validacion segura de cuentas, disciplina de firmantes PDA y patrones deterministas de orquestacion multi-programa.",
  },
  "solana-mev-strategies": {
    title: "MEV y Ordenamiento de Transacciones",
    description:
      "Ingenieria enfocada en produccion para ordenamiento de transacciones en Solana: routing consciente de MEV, estrategia de bundles, modelado de liquidacion/arbitraje y controles de ejecucion que protegen al usuario.",
  },
  "solana-deployment-cicd": {
    title: "Despliegue de Programas y CI/CD",
    description:
      "Ingenieria de despliegue para produccion en programas Solana: estrategia de entornos, gates de release, controles de calidad CI/CD y flujos operativos seguros para upgrades.",
  },
  "solana-cross-chain-bridges": {
    title: "Bridges Cross-Chain y Wormhole",
    description:
      "Construye integraciones cross-chain mas seguras en Solana con mensajeria estilo Wormhole, verificacion de attestations y controles deterministas del estado del bridge.",
  },
  "solana-oracle-pyth": {
    title: "Integracion de Oraculos y Red Pyth",
    description:
      "Integra feeds de oraculos en Solana de forma segura: validacion de precios, politicas de confianza/staleness y agregacion multi-fuente para decisiones de protocolo resilientes.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO y Organizaciones Autonomas",
    description:
      "Construye sistemas DAO listos para produccion en Solana: gobernanza de propuestas, integridad de votacion, controles de tesoreria y flujos deterministas de ejecucion/reporting.",
  },
  "solana-gaming": {
    title: "Gaming y Gestion del Estado de Juego",
    description:
      "Construye sistemas de juego on-chain listos para produccion en Solana: modelos de estado eficientes, integridad de turnos, controles de equidad y economia escalable de progresion de jugadores.",
  },
  "solana-permanent-storage": {
    title: "Almacenamiento Permanente y Arweave",
    description:
      "Integra almacenamiento descentralizado permanente con Solana usando flujos estilo Arweave: content addressing, integridad de manifests y acceso verificable a datos de largo plazo.",
  },
  "solana-staking-economics": {
    title: "Staking y Economia de Validadores",
    description:
      "Comprende staking y economia de validadores en Solana para decisiones del mundo real: estrategia de delegacion, dinamica de recompensas, efectos de comision y sostenibilidad operativa.",
  },
  "solana-account-abstraction": {
    title: "Abstraccion de Cuentas y Smart Wallets",
    description:
      "Implementa patrones de smart-wallet/abstraccion de cuentas en Solana con autorizacion programable, controles de recuperacion y validacion de transacciones guiada por politicas.",
  },
  "solana-pda-mastery": {
    title: "Dominio de Program Derived Addresses",
    description:
      "Domina ingenieria avanzada de PDAs en Solana: diseno de esquemas de seeds, disciplina de bump y uso seguro de PDAs cross-program a escala de produccion.",
  },
  "solana-economics": {
    title: "Economia de Solana y Flujos de Token",
    description:
      "Analiza dinamicas economicas de Solana en contexto de produccion: interaccion inflacion/fee-burn, flujos de staking, movimiento de supply y tradeoffs de sostenibilidad de protocolos.",
  },
};

export const esCourseTranslations: CourseTranslationMap = esCuratedCourseTranslations;
