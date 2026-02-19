import { esGeneratedCourseTranslations } from "./es.generated";
import type {
  CourseTranslation,
  CourseTranslationMap,
  LessonTranslation,
  ModuleTranslation,
} from "./types";

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
  "anchor-mental-model": {
    title: "Modelo mental de Anchor",
    description: "Comprende como Anchor abstrae Solana sin perder control sobre cuentas, restricciones y seguridad.",
  },
  "frontend-v2-wallet-state-accounts-model": {
    title: "Modelo mental de estado de wallet y cuentas para frontend",
    description: "Disena interfaces robustas entendiendo estado de wallet, cuentas y consistencia de datos en Solana.",
  },
  "defi-v2-amm-basics-fees-slippage-impact": {
    title: "Fundamentos AMM en Solana: pools, comisiones, slippage e impacto de precio",
    description: "Aprende como se cotizan swaps y por que comisiones, slippage e impacto afectan la ejecucion real.",
  },
  "security-v2-threat-model": {
    title: "Modelo de amenazas de Solana para auditoria",
    description: "Analiza vectores criticos de seguridad: owners, signers, writable, PDAs y validaciones de cuenta.",
  },
  "token-v2-spl-vs-token-2022": {
    title: "SPL Tokens vs Token-2022: impacto de las extensiones",
    description: "Compara modelos de token y evalua como las extensiones cambian reglas, riesgos y experiencia de producto.",
  },
  "mobile-wallet-overview": {
    title: "Panorama de wallets moviles",
    description: "Entiende flujos moviles, UX de firma y limitaciones de plataforma para apps Solana en produccion.",
  },
  "testing-approaches": {
    title: "Enfoques de testing",
    description: "Define una estrategia de pruebas por capas para minimizar regresiones en integraciones Solana.",
  },
  "indexing-v2-events-model": {
    title: "Modelo de eventos: transacciones, logs e instrucciones",
    description: "Construye intuicion para indexar eventos on-chain de forma consistente y auditable.",
  },
  "payments-v2-address-validation": {
    title: "Validacion de direcciones y estrategias de memo",
    description: "Fortalece pagos en Solana validando entradas y modelando referencias/memos de forma segura.",
  },
  "cnft-v2-merkle-trees": {
    title: "Arboles de Merkle para compresion de estado",
    description: "Aprende los fundamentos tecnicos de compression y como verificar pruebas de inclusion.",
  },
  "governance-v2-dao-model": {
    title: "Modelo DAO: propuestas, votacion y ejecucion",
    description: "Disena gobierno on-chain con reglas claras de quorum, ejecucion y control de tesoreria.",
  },
  "performance-v2-compute-model": {
    title: "Modelo de compute: presupuestos, costos y limites",
    description: "Optimiza rendimiento entendiendo CUs, limites de transaccion y patrones de costo.",
  },
  "swap-v2-mental-model": {
    title: "Modelo mental de swaps: mints, ATAs, decimales y rutas",
    description: "Modela swaps complejos con precision de tokens, rutas y restricciones de ejecucion.",
  },
  "clmm-v2-vs-cpmm": {
    title: "CLMM vs producto constante: por que existen los ticks",
    description: "Compara modelos de liquidez y entiende efectos de rango, concentracion y riesgo operativo.",
  },
  "lending-v2-pool-model": {
    title: "Modelo de pool de lending: supply, borrow y utilizacion",
    description: "Interpreta tasas, salud de posiciones y dinamica de riesgo en protocolos de prestamo.",
  },
  "perps-v2-mental-model": {
    title: "Perpetuos: posicion base, precio de entrada y mark vs oracle",
    description: "Comprende PnL, funding y liquidaciones en mercados perpetuos sobre Solana.",
  },
  "txopt-v2-why-fail": {
    title: "Por que fallan las transacciones DeFi",
    description: "Diagnostica fallas por CU, tamano de transaccion, blockhash y estado cambiante de mercado.",
  },
  "mobilesign-v2-reality-check": {
    title: "Realidad de firmas moviles: restricciones Android vs iOS",
    description: "Adapta arquitecturas de firma a limites reales de plataforma y wallets moviles.",
  },
  "solanapay-v2-mental-model": {
    title: "Modelo mental de Solana Pay y codificacion de URL",
    description: "Implementa pagos robustos con parametros correctos, encoding seguro y mejor experiencia de cobro.",
  },
  "walletux-v2-connection-design": {
    title: "Diseno UX de conexion de wallet",
    description: "Crea experiencias de conexion claras, seguras y confiables para usuarios nuevos y avanzados.",
  },
  "siws-v2-why-exists": {
    title: "Por que existe SIWS",
    description: "Entiende SIWS para autenticacion segura y consistente en productos Solana.",
  },
  "pfcb-v2-fee-market-reality": {
    title: "Mercados de comisiones en Solana: realidad de inclusion",
    description: "Ajusta fees y compute budget con criterios reales de inclusion bajo congestion.",
  },
  "bundles-v2-atomicity-model": {
    title: "Atomicidad: por que los usuarios esperan todo o nada",
    description: "Modela flujos atomicos, compensaciones y riesgos cuando la ejecucion no es totalmente atomica.",
  },
  "mempoolux-v2-quote-execution-gap": {
    title: "Brecha entre cotizacion y ejecucion",
    description: "Protege al usuario contra deterioro de precio y cambios de estado entre quote y envio.",
  },
  "indexpipe-v2-indexing-basics": {
    title: "Indexacion 101: logs, cuentas y parseo de transacciones",
    description: "Construye pipelines de indexacion confiables con deduplicacion e idempotencia.",
  },
  "rpc-v2-failure-landscape": {
    title: "Fallas RPC en produccion: timeouts, 429 y nodos desactualizados",
    description: "Disena resiliencia de cliente frente a latencia, rate limit y divergencia de nodos.",
  },
  "rdb-v2-layout-alignment-padding": {
    title: "Layout de memoria: alineacion y padding",
    description: "Evita errores de serializacion comprendiendo alineacion y representacion binaria.",
  },
  "rei-v2-error-taxonomy": {
    title: "Taxonomia de errores: recuperables vs fatales",
    description: "Estandariza diagnostico y tratamiento de errores para sistemas robustos.",
  },
  "rpot-v2-perf-mental-model": {
    title: "Modelo de rendimiento: asignaciones, clones y hashing",
    description: "Reduce costo computacional detectando patrones ineficientes en rutas criticas.",
  },
  "raip-v2-async-fundamentals": {
    title: "Fundamentos async: futures, tareas y canales",
    description: "Domina concurrencia en pipelines para indexacion y servicios de alto volumen.",
  },
  "rpmcs-v2-macro-mental-model": {
    title: "Modelo mental de macros: declarativas vs procedurales",
    description: "Usa macros con seguridad y mantenibilidad en bases de codigo Rust de larga vida.",
  },
  "aum-v2-upgrade-authority-lifecycle": {
    title: "Ciclo de vida de la autoridad de upgrade en Anchor",
    description: "Gestiona upgrades de programas con controles de seguridad, migraciones y gobernanza.",
  },
  "solana-reliability": {
    title: "Ingenieria de confiabilidad para Solana",
    description: "Estrategias de confiabilidad para mantener sistemas Solana estables bajo condiciones reales.",
  },
  "solana-testing-strategies": {
    title: "Estrategias de testing para Solana",
    description: "Disena suites de pruebas efectivas para programas, clientes e integraciones on-chain.",
  },
  "solana-program-optimization": {
    title: "Optimizacion de programas Solana",
    description: "Mejora rendimiento y costo en programas con tecnicas de optimizacion aplicadas.",
  },
  "solana-tokenomics-design": {
    title: "Diseno de tokenomics en Solana",
    description: "Construye modelos economicos sostenibles para tokens, incentivos y gobernanza.",
  },
  "solana-defi-primitives": {
    title: "Primitivas DeFi en Solana",
    description: "Comprende componentes base de DeFi para construir protocolos composables.",
  },
  "solana-nft-standards": {
    title: "Estandares NFT en Solana",
    description: "Explora estandares y patrones de metadata para experiencias NFT interoperables.",
  },
  "solana-cpi-patterns": {
    title: "Patrones de invocacion cross-program (CPI)",
    description: "Aprende patrones CPI seguros para composicion entre programas en Solana.",
  },
  "solana-mev-strategies": {
    title: "MEV y ordenamiento de transacciones",
    description: "Analiza impacto de MEV y diseña defensas de ejecucion para proteger usuarios.",
  },
  "solana-deployment-cicd": {
    title: "Despliegue de programas y CI/CD",
    description: "Automatiza pipelines de build, test y deploy para operaciones de programa confiables.",
  },
  "solana-cross-chain-bridges": {
    title: "Bridges cross-chain y Wormhole",
    description: "Comprende arquitectura de puentes y riesgos operativos al mover valor entre cadenas.",
  },
  "solana-oracle-pyth": {
    title: "Integracion de oraculos y red Pyth",
    description: "Consume precios on-chain con validaciones adecuadas para evitar errores de mercado.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO y organizaciones autonomas",
    description: "Evalua herramientas DAO para gobernanza, tesoreria y ejecucion automatizada.",
  },
  "solana-gaming": {
    title: "Gaming y gestion de estado de juego",
    description: "Disena sistemas de juego on-chain con estado consistente y experiencia fluida.",
  },
  "solana-permanent-storage": {
    title: "Almacenamiento permanente y Arweave",
    description: "Integra almacenamiento permanente para activos y metadata con buenas practicas de costo.",
  },
  "solana-staking-economics": {
    title: "Staking y economia de validadores",
    description: "Comprende incentivos de staking, seguridad de red y dinamicas economicas de validacion.",
  },
  "solana-account-abstraction": {
    title: "Abstraccion de cuentas y smart wallets",
    description: "Explora patrones de wallets programables para mejorar UX y seguridad de custodia.",
  },
  "solana-pda-mastery": {
    title: "Dominio de Program Derived Addresses (PDA)",
    description: "Profundiza en diseno, derivacion y validacion de PDAs en escenarios complejos.",
  },
  "solana-economics": {
    title: "Economia de Solana y flujos de token",
    description: "Analiza flujos economicos, incentivos y comportamiento de valor dentro del ecosistema.",
  },
};

function mergeLesson(
  baseLesson?: LessonTranslation,
  overrideLesson?: LessonTranslation
): LessonTranslation | undefined {
  if (!baseLesson && !overrideLesson) {
    return undefined;
  }
  return {
    ...(baseLesson ?? {}),
    ...(overrideLesson ?? {}),
  };
}

function mergeModule(
  baseModule?: ModuleTranslation,
  overrideModule?: ModuleTranslation
): ModuleTranslation | undefined {
  if (!baseModule && !overrideModule) {
    return undefined;
  }

  const lessonIds = new Set<string>([
    ...Object.keys(baseModule?.lessons ?? {}),
    ...Object.keys(overrideModule?.lessons ?? {}),
  ]);

  const lessons = Object.fromEntries(
    Array.from(lessonIds)
      .map((lessonId) => [
        lessonId,
        mergeLesson(baseModule?.lessons?.[lessonId], overrideModule?.lessons?.[lessonId]),
      ])
      .filter(([, lesson]) => lesson !== undefined)
  ) as Record<string, LessonTranslation>;

  return {
    ...(baseModule ?? {}),
    ...(overrideModule ?? {}),
    ...(Object.keys(lessons).length > 0 ? { lessons } : {}),
  };
}

function mergeCourse(
  baseCourse?: CourseTranslation,
  overrideCourse?: CourseTranslation
): CourseTranslation | undefined {
  if (!baseCourse && !overrideCourse) {
    return undefined;
  }

  const moduleIds = new Set<string>([
    ...Object.keys(baseCourse?.modules ?? {}),
    ...Object.keys(overrideCourse?.modules ?? {}),
  ]);

  const modules = Object.fromEntries(
    Array.from(moduleIds)
      .map((moduleId) => [
        moduleId,
        mergeModule(baseCourse?.modules?.[moduleId], overrideCourse?.modules?.[moduleId]),
      ])
      .filter(([, moduleValue]) => moduleValue !== undefined)
  ) as Record<string, ModuleTranslation>;

  return {
    ...(baseCourse ?? {}),
    ...(overrideCourse ?? {}),
    ...(Object.keys(modules).length > 0 ? { modules } : {}),
  };
}

export const esCourseTranslations: CourseTranslationMap = Object.fromEntries(
  Array.from(
    new Set<string>([
      ...Object.keys(esGeneratedCourseTranslations),
      ...Object.keys(esCuratedCourseTranslations),
    ])
  ).map((courseSlug) => [
    courseSlug,
    mergeCourse(
      esGeneratedCourseTranslations[courseSlug],
      esCuratedCourseTranslations[courseSlug]
    ) ?? {},
  ])
) as CourseTranslationMap;
