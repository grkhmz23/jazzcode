import type { CourseTranslationMap } from "./types";

const esCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fundamentos de Solana",
    description: "Introduccion practica para dominar los fundamentos de Solana con modelos mentales claros y flujo de trabajo reproducible.",
    modules: {
      "module-getting-started": {
        title: "Primeros pasos",
        description: "Modelo de ejecucion, semantica de cuentas y patrones de construccion de transacciones antes de crear programas complejos.",
        lessons: {
          "solana-mental-model": { title: "Modelo mental de Solana" },
          "accounts-model-deep-dive": { title: "Analisis profundo del modelo de cuentas" },
          "transactions-and-instructions": { title: "Transacciones e instrucciones" },
          "build-sol-transfer-transaction": { title: "Construye una transaccion de transferencia SOL" },
        },
      },
      "module-programs-and-pdas": {
        title: "Programas y PDAs",
        description: "Comportamiento de programas, diseno determinista de PDAs y modelo mental de SPL tokens con controles de seguridad.",
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
    description: "Curso orientado a proyectos para pasar de lo basico a ingenieria real con Anchor: modelado determinista de cuentas, construccion de instrucciones, disciplina de testing y UX de cliente confiable.",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor Fundamentos",
        "description": "Anchor architecture, cuenta constraints, y PDA foundations con explicit ownership of seguridad-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modelo mental",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Cuentas, constraints, y safety",
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
        "title": "PDAs, Cuentas, y Pruebas",
        "description": "Deterministic instruccion builders, stable state emulation, y pruebas strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment instruccion builder + state layout",
          },
          "anchor-testing-without-flakiness": {
            "title": "Pruebas strategy without flakiness",
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
    title: "Desarrollo Interfaz en Solana",
    description: "Curso orientado a proyectos para crear panels de Solana listos para produccion: reducers deterministas, pipelines de eventos reproducibles y UX de transacciones confiable.",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "Fundamentos Interfaz para Solana",
        description: "Modela correctamente estado de billetera/cuentas, disena UX del ciclo de vida de transacciones y aplica reglas deterministas para debugging reproducible.",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "Estado de billetera + modelo mental de cuentas para devs UI",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "Ciclo de vida de transaccion para UI: pendiente/confirmada/finalizada y UI optimista",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "Correccion de datos: eliminacion de duplicados, orden, idempotencia y eventos de correccion",
          },
          "frontend-v2-core-reducer": {
            title: "Construir modelo de estado base + reducer desde eventos",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "Proyecto de Panel de Tokens",
        description: "Construye reducer, snapshots de replay, metricas de consulta y salidas deterministas de panel estables bajo datos parciales o demorados.",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "Implementar simulador de flujo + linea temporal de replay + snapshots",
          },
          "frontend-v2-query-layer-metrics": {
            title: "Implementar capa de consultas + metricas calculadas",
          },
          "frontend-v2-production-ux-hardening": {
            title: "UX de produccion: cache, paginacion, errores, skeletons y limites de tasa",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "Emitir PanelSummary estable desde fixtures",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "DeFi en Solana",
    description: "Curso avanzado orientado a proyectos para construir sistemas de swaps: planeacion determinista estilo Jupiter sin dependencia online, ranking de rutas, seguridad de minOut y diagnosticos reproducibles.",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "Fundamentos de Intercambio",
        description: "Comprende matematica CPMM, anatomia de cotizacion y tradeoffs de enrutamiento determinista con protecciones de usuario enfocadas en seguridad.",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "Fundamentos AMM en Solana: pools, fees, slippage e impacto de precio",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "Anatomia de una cotizacion: in/out, fees, minOut y ejecucion worst-case",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "Enrutamiento: por que dos saltos puede superar uno",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "Proyecto de Planificador de Intercambios estilo Jupiter (Offline)",
        description: "Construye cotizacion determinista, seleccion de rutas y validaciones de seguridad minOut; luego empaqueta artefactos de punto de control estables para revisiones reproducibles.",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "Implementar modelo de token/pool + calculo de cotizacion de producto constante",
          },
          "defi-v2-router-best": {
            title: "Implementar enumeracion de rutas y seleccion de mejor ruta",
          },
          "defi-v2-safety-minout": {
            title: "Implementar slippage/minOut, desglose de fees e invariantes de seguridad",
          },
          "defi-v2-production-swap-ux": {
            title: "UX de swap en produccion: cotizaciones desactualizadas, proteccion y simulacion",
          },
          "defi-v2-checkpoint": {
            title: "Producir punto de control estable de IntercambioPlan + IntercambioSummary",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "Seguridad y Auditoria en Solana",
    description: "Laboratorio determinista de vulnerabilidades para auditores de Solana que necesitan evidencia de exploits repetible, guias de remediacion precisas y artefactos de auditoria de alta senal.",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "Modelo de Amenazas y Metodo de Auditoria",
        description: "Modelado de amenazas centrado en cuentas, reproduccion determinista de exploits y disciplina de evidencia para hallazgos de auditoria creibles.",
        lessons: {
          "security-v2-threat-model": {
            title: "Modelo de amenazas de Solana para auditores: cuentas, propietarios, firmantes, escribibles y PDAs",
          },
          "security-v2-evidence-chain": {
            title: "Cadena de evidencia: reproducir, trazar, impacto, corregir y verificar",
          },
          "security-v2-bug-classes": {
            title: "Clases comunes de errores en Solana y mitigaciones",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "Recorrido de Proyecto de Laboratorio de vulnerabilidades",
        description: "Explotar, corregir, verificar y producir artefactos listos para auditoria con trazas deterministas y conclusiones respaldadas por invariantes.",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Romper: explotar validaciones faltantes de firmante + propietario",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Romper: explotar mismatch de spoof de PDA",
          },
          "security-v2-patch-validate": {
            title: "Arreglar: validaciones + suite de invariantes",
          },
          "security-v2-writing-reports": {
            title: "Escritura de reportes de auditoria: severidad, probabilidad, alcance y remediacion",
          },
          "security-v2-audit-report-checkpoint": {
            title: "Punto de control: AuditReport JSON + markdown determinista",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "Ingenieria de Tokens en Solana",
    description: "Curso orientado a proyectos para equipos que lanzan tokens reales en Solana: planeacion determinista de Token-2022, diseno de autoridades, simulacion de oferta y disciplina operativa de lanzamiento.",
    modules: {
      "token-v2-module-fundamentals": {
        title: "Fundamentos de Token -> Token-2022",
        description: "Comprende primitivas de token, anatomia de politicas de mint y controles de extensiones Token-2022 con enfoque explicito de gobernanza y amenazas.",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "Tokens SPL vs Token-2022: que cambia con las extensiones",
          },
          "token-v2-mint-anatomy": {
            title: "Anatomia del mint: autoridades, decimales, oferta, freeze y mint",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "Riesgos de seguridad en extensiones: fee configs, abuso de delegado y estado por defecto de cuenta",
          },
          "token-v2-validate-config-derive": {
            title: "Validar configuracion de token + derivar direcciones deterministas offline",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "Proyecto Paquete de Lanzamiento de Tokens",
        description: "Construye flujos deterministas de validacion, planificacion y simulacion que produzcan artefactos de lanzamiento revisables y criterios claros de seguir/no seguir.",
        lessons: {
          "token-v2-build-init-plan": {
            title: "Construir plan de instrucciones para inicializacion de Token-2022",
          },
          "token-v2-simulate-fees-supply": {
            title: "Construir matematica de mint-to + transfer-fee + simulacion",
          },
          "token-v2-launch-checklist": {
            title: "Checklist de lanzamiento: parametros, estrategia de upgrade/authority y plan de airdrop/pruebas",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "Emitir LaunchPackSummary estable",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "Desarrollo Movil en Solana",
    description: "Construye dApps moviles de Solana listas para produccion con MWA, arquitectura robusta de sesiones de wallet, UX de firma explicita y operaciones de distribucion disciplinadas.",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "Movil Wallet Adapter",
        description: "Protocolo base de MWA, control del ciclo de vida de sesiones y patrones resilientes de handoff con wallet para apps moviles en produccion.",
        lessons: {
          "mobile-wallet-overview": {
            title: "Panorama de Wallet Movil",
          },
          "mwa-integration": {
            title: "Integracion de MWA",
          },
          "mobile-transaction": {
            title: "Construir una funcion de transaccion movil",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store y Distribucion",
        description: "Publicacion, readiness operativa y practicas de UX movil centradas en confianza para distribucion de apps Solana.",
        lessons: {
          "dapp-store-submission": {
            title: "Envio a dApp Store",
          },
          "mobile-best-practices": {
            title: "Mejores practicas moviles",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "Pruebas de Programas en Solana",
    description: "Construye sistemas de pruebas robustos para Solana en entornos locales, simulados y de red con invariantes de seguridad explicitas y controles de confianza de calidad de release.",
    modules: {
      "module-testing-foundations": {
        title: "Fundamentos de Pruebas",
        description: "Estrategia central de pruebas en capas unit/integration con flujos deterministas y cobertura de casos adversariales.",
        lessons: {
          "testing-approaches": {
            title: "Enfoques de pruebas",
          },
          "bankrun-testing": {
            title: "Pruebas con Bankrun",
          },
          "write-bankrun-test": {
            title: "Escribir una prueba Bankrun para Counter Program",
          },
        },
      },
      "module-advanced-testing": {
        title: "Pruebas Avanzado",
        description: "Fuzzing, validacion en devnet y controles de release en CI/CD para cambios de protocolo mas seguros.",
        lessons: {
          "fuzzing-trident": {
            title: "Fuzzing con Trident",
          },
          "devnet-testing": {
            title: "Pruebas en Devnet",
          },
          "ci-cd-pipeline": {
            title: "Pipeline de CI/CD para Solana",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "Indexacion y Analitica en Solana",
    description: "Construye un indexador de eventos de Solana de nivel produccion con decodificacion determinista, contratos de ingesta resilientes, recuperacion por punto de controls y salidas analiticas confiables.",
    modules: {
      "indexing-v2-foundations": {
        title: "Fundamentos de Indexacion",
        description: "Modelo de eventos, decodificacion de cuentas token y parseo de metadatos de transaccion para pipelines de indexacion confiables.",
        lessons: {
          "indexing-v2-events-model": {
            title: "Modelo de eventos: transacciones, logs e instrucciones de programa",
          },
          "indexing-v2-token-decoding": {
            title: "Decodificacion de cuentas token y layout SPL",
          },
          "indexing-v2-decode-token-account": {
            title: "Desafio: decodificar cuenta token + diff de balances token",
          },
          "indexing-v2-transaction-meta": {
            title: "Parseo de metadatos de transaccion: logs, errores e instrucciones internas",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "Pipeline de Indexacion y Analitica",
        description: "Normalizacion de transacciones, paginacion/punto de controls, estrategias de cache y agregacion analitica reproducible.",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "Desafio: indexar transacciones a eventos normalizados",
          },
          "indexing-v2-pagination-caching": {
            title: "Paginacion, punto de controling y semantica de cache",
          },
          "indexing-v2-analytics": {
            title: "Agregacion analitica: metricas por wallet y por token",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "Punto de control: producir resumen analitico JSON estable",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "Pagos y Checkout en Solana",
    description: "Construye flujos de pago en Solana de nivel produccion con validaciones robustas, idempotencia segura ante reintentos, webhooks seguros y comprobantes deterministas para conciliacion.",
    modules: {
      "payments-v2-foundations": {
        title: "Fundamentos de Pagos",
        description: "Validacion de direcciones, estrategia de idempotencia y diseno de payment intent para un checkout confiable.",
        lessons: {
          "payments-v2-address-validation": {
            title: "Validacion de direcciones y estrategias de memo",
          },
          "payments-v2-idempotency": {
            title: "Claves de idempotencia y proteccion contra replay",
          },
          "payments-v2-payment-intent": {
            title: "Desafio: crear payment intent con validacion",
          },
          "payments-v2-tx-building": {
            title: "Construccion de transacciones y metadatos clave",
          },
        },
      },
      "payments-v2-implementation": {
        title: "Implementaracion y Verificacion",
        description: "Construccion de transacciones, verificacion de autenticidad de webhook y generacion determinista de recibos con manejo claro de estados de error.",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "Desafio: construir transaccion de transferencia",
          },
          "payments-v2-webhooks": {
            title: "Firma y verificacion de webhooks",
          },
          "payments-v2-error-states": {
            title: "Maquina de estados de error y formato de recibo",
          },
          "payments-v2-webhook-receipt": {
            title: "Desafio: verificar webhook y producir recibo",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "Fundamentos de NFTs y cNFTs",
    description: "Domina la ingenieria de NFTs comprimidos en Solana: compromisos Merkle, sistemas de pruebas, modelado de colecciones y controles de seguridad de nivel produccion.",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "Fundamentos de Merkle",
        description: "Construccion de arboles, hashing de hojas, mecanica de insercion y modelo de compromiso on-chain/off-chain detras de activos comprimidos.",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "Arboles Merkle para compresion de estado",
          },
          "cnft-v2-leaf-hashing": {
            title: "Convenciones de hashing de hojas y metadata",
          },
          "cnft-v2-merkle-insert": {
            title: "Desafio: implementarar insercion en arbol Merkle + actualizacion de root",
          },
          "cnft-v2-proof-generation": {
            title: "Generacion de pruebas y calculo de rutas",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "Sistema de Pruebas y Seguridad",
        description: "Generacion y verificacion de pruebas, integridad de colecciones y endurecimiento de seguridad ante replay y spoof de metadata.",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "Desafio: implementarar generacion de pruebas + verificador",
          },
          "cnft-v2-collection-minting": {
            title: "Mints de coleccion y simulacion de metadata",
          },
          "cnft-v2-attack-surface": {
            title: "Superficie de ataque: pruebas invalidas y replay",
          },
          "cnft-v2-compression-checkpoint": {
            title: "Punto de control: simular mint + verificar prueba de ownership",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "Gobernanza y Operaciones de Tesoreria Multifirma",
    description: "Construye sistemas DAO y tesoreria multifirma listos para produccion con conteo de votos determinista, seguridad por timelock y controles de ejecucion seguros.",
    modules: {
      "governance-v2-governance": {
        title: "Gobernanza DAO",
        description: "Ciclo de vida de propuestas, mecanicas de voto deterministas, politica de quorum y seguridad de timelock para una gobernanza DAO creible.",
        lessons: {
          "governance-v2-dao-model": {
            title: "Modelo DAO: propuestas, votacion y ejecucion",
          },
          "governance-v2-quorum-math": {
            title: "Matematica de quorum y calculo de peso de voto",
          },
          "governance-v2-timelocks": {
            title: "Estados de timelock y programacion de ejecucion",
          },
          "governance-v2-quorum-voting": {
            title: "Desafio: implementar maquina de estado de quorum/votacion",
          },
        },
      },
      "governance-v2-multisig": {
        title: "Tesoreria Multifirma",
        description: "Construccion de transacciones multifirma, controles de aprobacion, defensas contra repeticion y patrones de ejecucion segura de tesoreria.",
        lessons: {
          "governance-v2-multisig": {
            title: "Construccion de transacciones multifirma y aprobaciones",
          },
          "governance-v2-multisig-builder": {
            title: "Desafio: implementar constructor de tx multifirma + reglas de aprobacion",
          },
          "governance-v2-safe-defaults": {
            title: "Valores por defecto seguros: checks de propietario y guardas contra repeticion",
          },
          "governance-v2-treasury-execution": {
            title: "Desafio: ejecutar propuesta y producir diff de tesoreria",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "Rendimiento de Solana y Optimizacion de Compute",
    description: "Domina la ingenieria de rendimiento en Solana con flujos de optimizacion medibles: presupuesto de computo, layouts de datos, eficiencia de encoding y modelado de costos determinista.",
    modules: {
      "performance-v2-foundations": {
        title: "Fundamentos de Rendimiento",
        description: "Modelo de compute, decisiones de layout de cuenta/datos y estimacion determinista de costos para razonar rendimiento a nivel transaccion.",
        lessons: {
          "performance-v2-compute-model": {
            title: "Modelo de compute: presupuestos, costos y limites",
          },
          "performance-v2-account-layout": {
            title: "Diseno de layout de cuentas y costo de serializacion",
          },
          "performance-v2-cost-model": {
            title: "Desafio: implementarar modelo estimateCost(op)",
          },
          "performance-v2-instruction-data": {
            title: "Tamano de datos de instruccion y optimizacion de encoding",
          },
        },
      },
      "performance-v2-optimization": {
        title: "Optimizacion y Analisis",
        description: "Optimizacion de layout, ajuste de presupuesto de computo y analisis before/after de rendimiento con salvaguardas de correccion.",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "Desafio: implementarar layout/codec optimizado",
          },
          "performance-v2-compute-budget": {
            title: "Fundamentos de instrucciones de presupuesto de computo",
          },
          "performance-v2-micro-optimizations": {
            title: "Micro-optimizaciones y tradeoffs",
          },
          "performance-v2-perf-checkpoint": {
            title: "Punto de control: comparar before/after + generar informee de rendimiento",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "Agregacion DeFi de Intercambios",
    description: "Domina la agregacion de intercambios en Solana para produccion: parseo determinista de cotizaciones, tradeoffs de optimizacion de rutas, seguridad de slippage y ejecucion consciente de confiabilidad.",
    modules: {
      "swap-v2-fundamentals": {
        title: "Fundamentos de Intercambio",
        description: "Mecanica de intercambio de tokens, proteccion de slippage, composicion de rutas y construccion determinista de IntercambioPlan con tradeoffs transparentes.",
        lessons: {
          "swap-v2-mental-model": {
            title: "Modelo mental de intercambio: mints, ATAs, decimales y rutas",
          },
          "swap-v2-slippage": {
            title: "Slippage e impacto de precio: proteger resultados del intercambio",
          },
          "swap-v2-route-explorer": {
            title: "Visualizacion de rutas: entender tramos y fees del intercambio",
          },
          "swap-v2-swap-plan": {
            title: "Desafio: construir un IntercambioPlan normalizado desde una cotizacion",
          },
        },
      },
      "swap-v2-execution": {
        title: "Ejecucion y Confiabilidad",
        description: "Ejecucion con maquina de estados, anatomia de transacciones, patrones de confiabilidad para retry/staleness y informees de ejecucion de alto valor.",
        lessons: {
          "swap-v2-state-machine": {
            title: "Desafio: implementarar maquina de estado de UI de intercambio",
          },
          "swap-v2-tx-anatomy": {
            title: "Anatomia de transaccion de intercambio: instrucciones, cuentas y compute",
          },
          "swap-v2-reliability": {
            title: "Patrones de confiabilidad: retries, cotizaciones stale y latencia",
          },
          "swap-v2-swap-report": {
            title: "Punto de control: generar un IntercambioRunInforme",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "Ingenieria de Liquidez CLMM",
    description: "Domina la ingenieria de liquidez concentrada en DEX de Solana: matematicas de ticks, diseno de estrategias por rango, dinamicas de fees e impermanent loss y informees deterministas de posiciones LP.",
    modules: {
      "clmm-v2-fundamentals": {
        title: "Fundamentos de CLMM",
        description: "Conceptos de liquidez concentrada, matematicas tick/precio y comportamiento de posiciones por rango para razonar sobre ejecucion CLMM.",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM vs producto constante: por que existen los ticks",
          },
          "clmm-v2-price-tick": {
            title: "Precio, tick y sqrtPrice: conversiones clave",
          },
          "clmm-v2-range-explorer": {
            title: "Posiciones por rango: dinamica in-range y out-of-range",
          },
          "clmm-v2-tick-math": {
            title: "Desafio: implementarar helpers de conversion tick/precio",
          },
        },
      },
      "clmm-v2-positions": {
        title: "Posiciones y Riesgo",
        description: "Simulacion de acumulacion de fees, tradeoffs de estrategias por rango, riesgos de precision y informees deterministas de riesgo de posicion.",
        lessons: {
          "clmm-v2-position-fees": {
            title: "Desafio: simular acumulacion de fees en posiciones",
          },
          "clmm-v2-range-strategy": {
            title: "Estrategias de rango: estrecho, amplio y reglas de rebalanceo",
          },
          "clmm-v2-risk-review": {
            title: "Riesgos de CLMM: redondeo, overflow y errores de tick spacing",
          },
          "clmm-v2-position-report": {
            title: "Punto de control: generar un informee de posicion",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "Riesgo de Prestamos y Liquidaciones",
    description: "Domina el riesgo de prestamos en Solana: mecanicas de utilizacion y tasas, analisis de rutas de liquidacion, seguridad de oraculos y informees deterministas de escenarios.",
    modules: {
      "lending-v2-fundamentals": {
        title: "Fundamentos de Prestamos",
        description: "Mecanica de pools de prestamos, modelos de tasa impulsados por utilizacion y bases de health factor necesarias para analisis de riesgo defendible.",
        lessons: {
          "lending-v2-pool-model": {
            title: "Modelo de pool de prestamos: supply, borrow y utilizacion",
          },
          "lending-v2-interest-curves": {
            title: "Curvas de tasas de interes y modelo de kink",
          },
          "lending-v2-health-explorer": {
            title: "Monitoreo de health factor y vista previa de liquidacion",
          },
          "lending-v2-interest-rates": {
            title: "Desafio: calcular tasas de interes basadas en utilizacion",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "Gestion de Riesgo",
        description: "Calculo de health factor, mecanicas de liquidacion, manejo de fallas de oraculos y informees de riesgo multi-escenario para mercados estresados.",
        lessons: {
          "lending-v2-health-factor": {
            title: "Desafio: calcular health factor y estado de liquidacion",
          },
          "lending-v2-liquidation-mechanics": {
            title: "Mecanicas de liquidacion: bonus, close factor y deuda mala",
          },
          "lending-v2-oracle-risk": {
            title: "Riesgo de oraculos y precios obsoletos en prestamos",
          },
          "lending-v2-risk-report": {
            title: "Punto de control: generar un informee de riesgo multi-escenario",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "Consola de Riesgo para Perpetuos",
    description: "Domina la ingenieria de riesgo de perpetuos en Solana: contabilidad precisa de PnL y funding, monitoreo de margen, simulacion de liquidaciones y informees deterministas en consola.",
    modules: {
      "perps-v2-fundamentals": {
        title: "Fundamentos de Perpetuos",
        description: "Mecanica de futuros perpetuos, logica de acumulacion de funding y bases de modelado de PnL para diagnosticos precisos de posiciones.",
        lessons: {
          "perps-v2-mental-model": {
            title: "Futuros perpetuos: posiciones base, precio de entrada y mark vs oracle",
          },
          "perps-v2-funding": {
            title: "Funding rates: por que existen y como se acumulan",
          },
          "perps-v2-pnl-explorer": {
            title: "Visualizacion de PnL: seguimiento de ganancias en el tiempo",
          },
          "perps-v2-pnl-calc": {
            title: "Desafio: calcular PnL de futuros perpetuos",
          },
          "perps-v2-funding-accrual": {
            title: "Desafio: simular acumulacion de funding rate",
          },
        },
      },
      "perps-v2-risk": {
        title: "Riesgo y Monitoreo",
        description: "Monitoreo de margen y liquidaciones, errores comunes de implementaracion y salidas deterministas de consola de riesgo para observabilidad en produccion.",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "Ratio de margen y umbrales de liquidacion",
          },
          "perps-v2-common-bugs": {
            title: "Errores comunes: signos, unidades y direccion del funding",
          },
          "perps-v2-risk-console-report": {
            title: "Punto de control: generar un informee de consola de riesgo",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "Optimizador de Transacciones DeFi",
    description: "Domina la optimizacion de transacciones DeFi en Solana: ajuste de compute y fees, estrategia ALT, patrones de confiabilidad y planificacion determinista de estrategias de envio.",
    modules: {
      "txopt-v2-fundamentals": {
        title: "Fundamentos de Transacciones",
        description: "Diagnostico de fallos, mecanica de presupuesto de computo, estrategia de priority fee y bases de estimacion de fees.",
        lessons: {
          "txopt-v2-why-fail": {
            title: "Por que fallan transacciones DeFi: limites de CU, tamano y expiracion de blockhash",
          },
          "txopt-v2-compute-budget": {
            title: "Instrucciones de presupuesto de computo y estrategia de priority fee",
          },
          "txopt-v2-cost-explorer": {
            title: "Estimacion de costo de transaccion y planificacion de fees",
          },
          "txopt-v2-tx-plan": {
            title: "Desafio: construir un plan de transaccion con presupuesto de computoing",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "Optimizacion y Estrategia",
        description: "Planificacion de Address Lookup Table, patrones de confiabilidad/retry, UX de errores accionables y informees completos de estrategia de envio.",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "Desafio: planificar uso de Address Lookup Table",
          },
          "txopt-v2-reliability": {
            title: "Patrones de confiabilidad: retry, re-quote, resend vs reconstruir",
          },
          "txopt-v2-ux-errors": {
            title: "UX: mensajes de error accionables para fallas de transaccion",
          },
          "txopt-v2-send-strategy": {
            title: "Punto de control: generar un informee de estrategia de envio",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "Firma Movil en Solana",
    description: "Domina la firma de billeteras moviles en Solana para produccion: sesiones Android MWA, restricciones de deep links en iOS, reintentos resilientes y telemetria determinista de sesion.",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "Fundamentos de Firma Movil",
        description: "Restricciones de plataforma, patrones UX de conexion, comportamiento de timeline de firma y construccion tipada de requests en Android/iOS.",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "Reality check de firma movil: restricciones Android vs iOS",
          },
          "mobilesign-v2-connection-ux": {
            title: "Patrones UX de conexion de billetera: connect, reconnect y recovery",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "Timeline de sesion de firma: flujo de request, billetera y respuesta",
          },
          "mobilesign-v2-sign-request": {
            title: "Desafio: construir un sign request tipado",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "Patrones de Produccion",
        description: "Persistencia de sesion, seguridad en pantallas de revision, maquinas de estado de retry y informees deterministas de sesion para apps moviles en produccion.",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "Desafio: persistencia y restauracion de sesion",
          },
          "mobilesign-v2-review-screens": {
            title: "Revision de transaccion en movil: que necesitan ver los usuarios",
          },
          "mobilesign-v2-retry-patterns": {
            title: "Retry en un toque: manejar estados offline, rejected y timeout",
          },
          "mobilesign-v2-session-report": {
            title: "Punto de control: generar un informee de sesion",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "Comercio con Solana Pay",
    description: "Domina la integracion comercial de Solana Pay: encoding robusto de URLs, flujos de tracking QR y pagos, UX de confirmacion y artefactos deterministas de conciliacion POS.",
    modules: {
      "solanapay-v2-foundations": {
        title: "Fundamentos de Solana Pay",
        description: "Especificacion de Solana Pay, rigor de encoding de URL, anatomia de transfer requests y patrones deterministas de construirer/encoder.",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "Modelo mental de Solana Pay y reglas de encoding de URL",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "Anatomia de transfer request: recipient, amount, reference y labels",
          },
          "solanapay-v2-url-explorer": {
            title: "Constructor de URL: vista previa en vivo de URLs de Solana Pay",
          },
          "solanapay-v2-encode-transfer": {
            title: "Desafio: codificar una URL de transfer request de Solana Pay",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "Tracking y Comercio",
        description: "Maquinas de estado de tracking por reference, UX de confirmacion, manejo de fallos y generacion determinista de recibos POS.",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "Desafio: rastrear referencias de pago por estados de confirmacion",
          },
          "solanapay-v2-confirmation-ux": {
            title: "UX de confirmacion: estados pending, confirmed y expired",
          },
          "solanapay-v2-error-handling": {
            title: "Manejo de errores y casos limite en flujos de pago",
          },
          "solanapay-v2-pos-receipt": {
            title: "Punto de control: generar un recibo POS",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "Ingenieria UX de Billetera",
    description: "Domina la ingenieria UX de __loc_billeteras__ en Solana para produccion: estado de conexion determinista, seguridad de red, resiliencia RPC y patrones de confiabilidad medibles.",
    modules: {
      "walletux-v2-fundamentals": {
        title: "Fundamentos de Conexion",
        description: "Diseno de conexion de billetera, red gating y arquitectura determinista de maquina de estados para onboarding y reconexion predecibles.",
        lessons: {
          "walletux-v2-connection-design": {
            title: "UX de conexion que no frustra: lista de verificacion de diseno",
          },
          "walletux-v2-network-gating": {
            title: "Red gating y recuperacion de red incorrecta",
          },
          "walletux-v2-state-explorer": {
            title: "Maquina de estados de conexion: estados, eventos y transiciones",
          },
          "walletux-v2-connection-state": {
            title: "Desafio: implementar maquina de estados de conexion de billetera",
          },
        },
      },
      "walletux-v2-production": {
        title: "Patrones de Produccion",
        description: "Invalidacion de cache, resiliencia y monitoreo de salud RPC, y informees medibles de calidad UX de billetera para operaciones en produccion.",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "Desafio: invalidacion de cache en eventos de billetera",
          },
          "walletux-v2-rpc-caching": {
            title: "Lecturas RPC y estrategia de cache para apps de billetera",
          },
          "walletux-v2-rpc-health": {
            title: "Monitoreo de salud RPC y degradacion gradual",
          },
          "walletux-v2-ux-report": {
            title: "Punto de control: generar un Billetera UX Informe",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "Domina la autenticacion SIWS en Solana para produccion: entradas estandarizadas, invariantes estrictas de verificacion, ciclo de vida de nonce resistente a replay y reportes listos para auditoria.",
    modules: {
      "siws-v2-fundamentals": {
        title: "Fundamentos de SIWS",
        description: "Razon de SIWS, semantica estricta de campos de entrada, comportamiento de render en billeteras y construccion determinista de sign-in input.",
        lessons: {
          "siws-v2-why-exists": {
            title: "Por que existe SIWS: reemplazar connect-and-signMessage",
          },
          "siws-v2-input-fields": {
            title: "Campos de entrada SIWS y reglas de seguridad",
          },
          "siws-v2-message-preview": {
            title: "Vista previa del mensaje: como renderizan billeteras las solicitudes SIWS",
          },
          "siws-v2-sign-in-input": {
            title: "Desafio: construir un sign-in input SIWS validado",
          },
        },
      },
      "siws-v2-verification": {
        title: "Verificacion y Seguridad",
        description: "Invariantes de verificacion server-side, defensas nonce contra replay, gestion de sesiones y reportes deterministas de auditoria de autenticacion.",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "Desafio: verificar una respuesta de sign-in SIWS",
          },
          "siws-v2-sessions": {
            title: "Sesiones y logout: que almacenar y que no almacenar",
          },
          "siws-v2-replay-protection": {
            title: "Proteccion contra replay y diseno de registro de nonce",
          },
          "siws-v2-auth-report": {
            title: "Punto de control: generar un reporte de auditoria de autenticacion",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "Tarifas Prioritarias y Presupuesto de Computo",
    description: "Ingenieria defensiva de fees en Solana con planificacion determinista de compute, politica adaptativa de prioridad y contratos de confiabilidad UX orientados a confirmacion.",
    modules: {
      "pfcb-v2-foundations": {
        title: "Fundamentos de Fees y Compute",
        description: "Mecanicas de inclusion, acoplamiento compute/fee y diseno de politicas guiado por explorer con enfoque determinista de confiabilidad.",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "Mercados de fees en Solana: que mueve realmente la inclusion",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "Fundamentos de presupuesto de computo y modos de falla comunes",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer: de entradas del planner de presupuesto de computo a plan",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "Desafio: implementarar planComputeBudget()",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "Proyecto Fee Optimizador",
        description: "Implementarar planners deterministas, motores de politica de confirmacion y artefactos estables de estrategia de fees para revision de release.",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "Desafio: implementarar estimatePriorityFee()",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "Desafio: motor de decision de nivel de confirmacion",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "Desafio: construir markdown feePlanResumen",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "Punto de control: informee de Fee Optimizador",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "Paquetes y Atomicidad de Transacciones",
    description: "Disena flujos defensivos multi-transaccion en Solana con validacion determinista de atomicidad, modelado de compensaciones y informees de seguridad listos para auditoria.",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "Fundamentos de Atomicidad",
        description: "Modelo de atomicidad, riesgos de flujos multi-transaccion y validacion defensiva de seguridad para proteger expectativas del usuario.",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "Conceptos de atomicidad y por que usuarios asumen todo-o-nada",
          },
          "bundles-v2-flow-risk-points": {
            title: "Flujos multi-transaccion: approvals, creacion ATA, swaps y refunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer: pasos del flow graph y puntos de riesgo",
          },
          "bundles-v2-build-atomic-flow": {
            title: "Desafio: implementarar construirAtomicFlow()",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "Proyecto Simulador de Flujo Atomic Swap",
        description: "Implementarar validadores deterministas de atomicidad, patrones de manejo de fallos y composicion estable de paquetes para revision de release.",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "Desafio: implementarar validateAtomicidad()",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "Desafio: manejo de fallos con claves de idempotencia",
          },
          "bundles-v2-bundle-composer": {
            title: "Desafio: composer determinista de paquetes",
          },
          "bundles-v2-flow-safety-report": {
            title: "Punto de control: informee de seguridad del flujo",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "Realidad del Mempool y UX Anti-Sandwich",
    description: "Ingenieria defensiva de UX para swaps con gradacion de riesgo determinista, politicas de slippage acotadas y comunicacion de seguridad lista para incidentes.",
    modules: {
      "mempoolux-v2-foundations": {
        title: "Realidad de Mempool y Defensa UX",
        description: "Riesgos entre quote y ejecucion, guardrails de slippage y decisiones de frescura para swaps mas seguros en produccion.",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "Que puede salir mal entre quote y ejecucion",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "Controles de slippage y guardrails",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer: temporizador de frescura de quote y tabla de decisiones",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "Desafio: implementarar evaluateSwapRisk()",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "Proyecto UI de Swap Protegido",
        description: "Implementarar guardias de slippage, modelos de impacto y configuraciones exportables de proteccion con salida determinista.",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "Desafio: implementarar slippageGuard()",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "Desafio: modelar impacto de precio vs slippage",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "Desafio: construir swapSafetyBanner()",
          },
          "mempoolux-v2-protection-config-export": {
            title: "Punto de control: export de configuracion de proteccion de swap",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "Indexers, Webhooks y Canalizacions Seguros ante Reorg",
    description: "Construye canalizacions deterministas de indexacion en produccion con ingesta segura ante duplicados, manejo de reorg e informes centrados en integridad.",
    modules: {
      "indexpipe-v2-foundations": {
        title: "Fundamentos de Confiabilidad de Indexer",
        description: "Bases de indexacion, realidad de reorg/confirmacion y etapas de canalizacion para ingestiones trazables y seguras.",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "Indexacion 101: logs, cuentas y parseo de transacciones",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "Reorgs y fork choice: por que confirmed no es finalized",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer: de ingest a dedupe a confirm a apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "Desafio: implementarar dedupeEvents()",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "Proyecto Indexer Reorg-Safe",
        description: "Implementarar logica de confirmaciones, planeacion de backfill/idempotencia y chequeos de integridad para informees de canalizacion estables.",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "Desafio: implementarar applyWithConfirmations()",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "Desafio: backfill y planificacion de idempotencia",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "Desafio: chequeos de integridad de snapshot",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "Punto de control: export de informee de canalizacion",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "Confiabilidad RPC e Ingenieria de Latencia",
    description: "Disena clientes RPC multi-proveedor en Solana para produccion con politicas deterministas de reintento, enrutamiento, cache y observabilidad.",
    modules: {
      "rpc-v2-foundations": {
        "title": "RPC Reliability Foundations",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, y deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests y fallbacks",
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
        "description": "Build deterministic policy engines para routing, retries, metrics reduction, y health report exports.",
        "lessons": {
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching y invalidation policy",
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer y histogram buckets",
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
          },
        },
      },
    },
  },
  "rust-data-layout-borsh": {
    title: "Rust Datos Estructura y Dominio de Borsh",
    description: "Ingenieria de estructura de datos en Solana con enfoque Rust y tooling determinista a nivel de bytes, junto con practicas de esquema seguras para compatibilidad.",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, y practico parsing safety para stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, y why Solana cuentas care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct y enum layout pitfalls plus Borsh rules",
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer para field offsets",
          },
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
          },
        },
      },
      "rdb-v2-project-journey": {
        "title": "Cuenta Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, y compatibility-focused reporting helpers.",
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
    title: "Diseno de Errores e Invariantees en Rust",
    description: "Construye librerias de guardas por invariantees tipadas con artefactos de evidencia determinista, contratos de error seguros para compatibilidad y informees listos para auditoria.",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error y Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, y deterministic invariant diseno fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, y context",
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
        "description": "Implement guard helpers, evidence-chain generation, y stable audit reporting para reliability y incident response.",
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
    title: "Rendimiento Rust para Mentalidad On-chain",
    description: "Simula y optimiza comportamiento de costo de compute con tooling determinista Rust-first y gobernanza de rendimiento guiada por presupuesto.",
    modules: {
      "rpot-v2-foundations": {
        "title": "Rendimiento Foundations",
        "description": "Rust rendimiento modelo mentals, data-structure tradeoffs, y deterministic cost reasoning para reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Rendimiento modelo mental: allocations, clones, hashing",
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
        "description": "Build deterministic profilers, recommendation engines, y report outputs aligned to explicit rendimiento budgets.",
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
    title: "Concurrencia y Asincrono para Indexers (Rust)",
    description: "Ingenieria de canalizacions asincrono con enfoque Rust-first y concurrencia acotada, reducers seguros ante replay y informees operativos deterministas.",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, y deterministic execution modeling para indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits y backpressure",
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph y concurrency",
          },
        },
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, y report exports para reorg-safe pipeline operations.",
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
    title: "Macros Procedurales y Generacion de codigo para Seguridad",
    description: "Seguridad de macros y generacion de codigo en Rust ensenada mediante parser determinista y tooling de generacion de chequeos con salidas amigables para auditoria.",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro y Codegen Foundations",
        "description": "Macro modelo mentals, constraint DSL diseno, y safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro modelo mental: declarative vs procedural",
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
        "title": "Cuenta Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, y publish stable safety reports.",
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
    title: "Actualizacions de Anchor y Migraciones de Cuentas",
    description: "Disena flujos de release seguros para produccion en Anchor con planificacion determinista de migraciones, gates de actualizacion, playbooks de rollback y evidencia de readiness.",
    modules: {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, cuenta versioning strategy, y deterministic upgrade risk modeling para Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Cuenta versioning y migration strategy",
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
        "description": "Safety validation gates, rollback planning, y deterministic readiness artifacts para controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy y incident playbooks",
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
    title: "Ingenieria de Confiabilidad para Solana",
    description: "Ingenieria de confiabilidad enfocada en produccion para sistemas Solana: tolerancia a fallos, retries, deadlines, circuit breakers y degradacion gradual con resultados operativos medibles.",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks con clear failure classification, retry boundaries, y deterministic recovery behavior.",
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
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, y rate controls) that protect core user flows during provider instability.",
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
    title: "Estrategias de Pruebas para Solana",
    description: "Estrategia integral de pruebas para Solana orientada a produccion: pruebas unitarias deterministas, integraciones realistas, fuzz/property pruebas y informees de confianza para release.",
    modules: {
      "mod-11-1": {
        "title": "Unit y Integration Pruebas",
        "description": "Build deterministic unit y integration pruebas layers con clear ownership of invariants, fixtures, y failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Pruebas Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock Cuenta Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "Avanzado Pruebas Techniques",
        "description": "Use fuzzing, property-based tests, y mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing y Property Pruebas",
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
    title: "Optimizacion de Programaas Solana",
    description: "Disena rendimiento de nivel produccion en Solana: compute budgeting, eficiencia de layout de cuentas, tradeoffs de memoria/rent y workflows de optimizacion deterministas.",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths con explicit CU budgets, operation-level profiling, y predictable rendimiento tradeoffs.",
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
        "title": "Memory y Storage Optimization",
        "description": "Diseno memory/storage-efficient cuenta layouts con rent-aware sizing, serialization discipline, y safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Cuenta Data Optimization",
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
    title: "Diseno de Tokenomics para Solana",
    description: "Disena economias de token robustas en Solana con disciplina de distribucion, seguridad de vesting, incentivos de staking y mecanicas de gobernanza defendibles operativamente.",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution y Vesting",
        "description": "Model token allocation y vesting systems con explicit fairness, unlock predictability, y deterministic accounting rules.",
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
        "title": "Staking y Gobernanza",
        "description": "Diseno staking y gobernanza mechanics con clear incentive alignment, anti-manipulation constraints, y measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking y Gobernanza Diseno",
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
    title: "Primitivas DeFi en Solana",
    description: "Construye fundamentos practicos de DeFi en Solana: mecanicas AMM, contabilidad de liquidez, primitivas de prestamos y patrones de composicion seguros ante flash loans.",
    modules: {
      "mod-14-1": {
        "title": "AMM y Liquidity",
        "description": "Implement AMM y liquidity primitives con deterministic math, slippage-aware outputs, y LP accounting correctness.",
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
        "title": "Lending y Flash Loans",
        "description": "Model lending y flash-loan flows con collateral safety, utilization-aware pricing, y strict repayment invariants.",
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
            "title": "Flash Loan Validador Challenge",
          },
        },
      },
    },
  },
  "solana-nft-standards": {
    title: "Estandares NFT en Solana",
    description: "Implementara NFTs de Solana con estandares listos para produccion: integridad de metadata, disciplina de colecciones y comportamientos avanzados programables/no transferibles.",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality con standards-compliant metadata, collection verification, y deterministic asset-state handling.",
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
        "title": "Avanzado NFT Features",
        "description": "Implement avanzado NFT behaviors (soulbound y programmable flows) con explicit policy controls y safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound y Programmable NFTs",
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token Validador Challenge",
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
    title: "Patrones de Invocacion Entre Programas (CPI)",
    description: "Domina la composicion CPI en Solana con validacion segura de cuentas, disciplina de firmantes PDA y patrones deterministas de orquestacion multi-programa.",
  },
  "solana-mev-strategies": {
    title: "MEV y Ordenamiento de Transacciones",
    description: "Ingenieria enfocada en produccion para ordenamiento de transacciones en Solana: routing consciente de MEV, estrategia de bundles, modelado de liquidacion/arbitraje y controles de ejecucion que protegen al usuario.",
  },
  "solana-deployment-cicd": {
    title: "Despliegue de Programaas y CI/CD",
    description: "Ingenieria de despliegue para produccion en programaas Solana: estrategia de entornos, gates de release, controles de calidad CI/CD y flujos operativos seguros para upgrades.",
  },
  "solana-cross-chain-bridges": {
    title: "Puentes Entre Cadenas y Wormhole",
    description: "Construye integraciones entre cadenas mas seguras en Solana con mensajeria estilo Wormhole, verificacion de attestations y controles deterministas del estado del puente.",
  },
  "solana-oracle-pyth": {
    title: "Integracion de Oraculos y Red Pyth",
    description: "Integra feeds de oraculos en Solana de forma segura: validacion de precios, politicas de confianza/staleness y agregacion multi-fuente para decisiones de protocolo resilientes.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO y Organizaciones Autonomas",
    description: "Construye sistemas DAO listos para produccion en Solana: gobernanza de propuestas, integridad de votacion, controles de tesoreria y flujos deterministas de ejecucion/informeing.",
  },
  "solana-gaming": {
    title: "Juegos y Gestion del Estado de Juego",
    description: "Construye sistemas de juego on-chain listos para produccion en Solana: modelos de estado eficientes, integridad de turnos, controles de equidad y economia escalable de progresion de jugadores.",
  },
  "solana-permanent-storage": {
    title: "Almacenamiento Permanente y Arweave",
    description: "Integra almacenamiento descentralizado permanente con Solana usando flujos estilo Arweave: content addressing, integridad de manifests y acceso verificable a datos de largo plazo.",
  },
  "solana-staking-economics": {
    title: "Staking y Economia de Validadores",
    description: "Comprende staking y economia de validadores en Solana para decisiones del mundo real: estrategia de delegacion, dinamica de recompensas, efectos de comision y sostenibilidad operativa.",
  },
  "solana-account-abstraction": {
    title: "Abstraccion de Cuentas y Smart Billeteras",
    description: "Implementara patrones de smart-billetera/abstraccion de cuentas en Solana con autorizacion programable, controles de recuperacion y validacion de transacciones guiada por politicas.",
  },
  "solana-pda-mastery": {
    title: "Dominio de Program Derived Addresses",
    description: "Domina ingenieria avanzada de PDAs en Solana: diseno de esquemas de seeds, disciplina de bump y uso seguro de PDAs cross-program a escala de produccion.",
  },
  "solana-economics": {
    title: "Economia de Solana y Flujos de Token",
    description: "Analiza dinamicas economicas de Solana en contexto de produccion: interaccion inflacion/fee-burn, flujos de staking, movimiento de supply y tradeoffs de sostenibilidad de protocolos.",
  },
};

export const esCourseTranslations: CourseTranslationMap = esCuratedCourseTranslations;
