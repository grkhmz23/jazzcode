import type { CourseTranslationMap } from "./types";

const ptBrCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fundamentos de Solana",
    description: "Introducao de nivel de producao para iniciantes que querem modelos mentais claros de Solana, debugging de transacoes mais forte e workflows deterministas de wallet manager.",
  },
  "anchor-development": {
    title: "Desenvolvimento com Anchor",
    description: "Curso orientado a projetos para evoluir do basico para engenharia real com Anchor: modelagem deterministica de contas, construirers de instrucoes, disciplina de testes e UX de cliente confiavel.",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor Fundamentos",
        "description": "Anchor architecture, conta constraints, e PDA foundations com explicit ownership of seguranca-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor modelo mental",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "Contas, constraints, e safety",
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
        "title": "PDAs, Contas, e Testes",
        "description": "Deterministic instrucao builders, stable state emulation, e testes strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment instrucao builder + state layout",
          },
          "anchor-testing-without-flakiness": {
            "title": "Testes strategy without flakiness",
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
    title: "Desenvolvimento Interface Solana",
    description: "Curso orientado a projetos para engenheiros de interface que querem paineis Solana prontos para producao: reducers deterministas, pipelines de eventos reproduziveis e UX de transacao confiavel.",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "Fundamentos de Interface para Solana",
        description: "Modele corretamente estado de carteira/contas, desenhe UX do ciclo de vida de transacoes e imponha regras deterministicas para debugging reproduzivel.",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "Estado da carteira + modelo mental de contas para devs de UI",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "Ciclo de vida da transacao para UI: pendente/confirmada/finalizada e UI otimista",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "Correcao de dados: remocao de duplicados, ordenacao, idempotencia e eventos de correcao",
          },
          "frontend-v2-core-reducer": {
            title: "Construir modelo de estado central + reducer a partir de eventos",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "Projeto de Painel de Tokens",
        description: "Construa reducer, snapshots de replay, metricas de consulta e outputs deterministicas de painel estaveis sob dados parciais ou atrasados.",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "Implementar simulador de fluxo + linha do tempo de replay + snapshots",
          },
          "frontend-v2-query-layer-metrics": {
            title: "Implementar camada de consulta + metricas calculadas",
          },
          "frontend-v2-production-ux-hardening": {
            title: "UX de producao: cache, paginacao, banners de erro, skeletons e limites de taxa",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "Emitir PainelSummary estavel a partir de fixtures",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "DeFi na Solana",
    description: "Curso avancado orientado a projetos para engenheiros que constroem sistemas de swap: planejamento offline deterministico no estilo Jupiter, ranking de rotas, seguranca de minOut e diagnosticos reproduziveis.",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "Fundamentos de Troca",
        description: "Entenda matematica CPMM, anatomia de cotacao e tradeoffs de roteamento deterministico com protecoes de usuario orientadas a seguranca.",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "Fundamentos de AMM na Solana: pools, taxas, slippage e impacto de preco",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "Anatomia da cotacao: in/out, taxas, minOut e execucao de pior caso",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "Roteamento: por que dois saltos podem superar um",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "Projeto de Planejador de Trocas estilo Jupiter (Offline)",
        description: "Construa cotacao deterministica, selecao de rota e validacoes de seguranca minOut; depois empacote artefatos de ponto de controle estaveis para revisoes reproduziveis.",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "Implementar modelo de token/pool + calculo de cotacao por produto constante",
          },
          "defi-v2-router-best": {
            title: "Implementar enumeracao de rotas e selecao da melhor rota",
          },
          "defi-v2-safety-minout": {
            title: "Implementar slippage/minOut, detalhamento de taxas e invariantes de seguranca",
          },
          "defi-v2-production-swap-ux": {
            title: "UX de swap em producao: cotacoes desatualizadas, protecao e simulacao",
          },
          "defi-v2-checkpoint": {
            title: "Produzir ponto de controle estavel de TrocaPlan + TrocaSummary",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "Seguranca e Auditoria em Solana",
    description: "Laboratorio deterministico de vulnerabilidades para auditores Solana que precisam de evidencia de exploit repetivel, orientacao precisa de remediacao e artefatos de auditoria de alto sinal.",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "Modelo de Ameaca e Metodo de Auditoria",
        description: "Modelagem de ameacas centrada em contas, reproducao deterministica de exploits e disciplina de evidencia para achados de auditoria confiaveis.",
        lessons: {
          "security-v2-threat-model": {
            title: "Modelo de ameaca Solana para auditores: contas, proprietarios, assinantes, gravaveis e PDAs",
          },
          "security-v2-evidence-chain": {
            title: "Cadeia de evidencia: reproduzir, rastrear, impacto, corrigir e verificar",
          },
          "security-v2-bug-classes": {
            title: "Classes comuns de erros em Solana e mitigacoes",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "Jornada de Projeto do Laboratorio de vulnerabilidades",
        description: "Explorar, corrigir, verificar e produzir artefatos prontos para auditoria com traces deterministicas e conclusoes baseadas em invariantes.",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Quebre: explore validacoes ausentes de assinante + proprietario",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Quebre: explore mismatch de spoof de PDA",
          },
          "security-v2-patch-validate": {
            title: "Corrija: validacoes + suite de invariantes",
          },
          "security-v2-writing-reports": {
            title: "Escrevendo relatorios de auditoria: severidade, probabilidade, alcance e remediacao",
          },
          "security-v2-audit-report-checkpoint": {
            title: "Ponto de controle: AuditReport JSON + markdown deterministico",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "Engenharia de Tokens na Solana",
    description: "Curso orientado a projetos para equipes que lancam tokens Solana reais: planejamento deterministico de Token-2022, design de autoridades, simulacao de oferta e disciplina operacional de lancamento.",
    modules: {
      "token-v2-module-fundamentals": {
        title: "Fundamentos de Token -> Token-2022",
        description: "Entenda primitivas de token, anatomia da politica de mint e controles de extensao do Token-2022 com enquadramento explicito de governanca e ameacas.",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "Tokens SPL vs Token-2022: o que as extensoes mudam",
          },
          "token-v2-mint-anatomy": {
            title: "Anatomia do mint: authorities, decimais, oferta, freeze e mint",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "Riscos de seguranca em extensoes: fee configs, abuso de delegado e estado padrao de conta",
          },
          "token-v2-validate-config-derive": {
            title: "Validar configuracao de token + derivar enderecos deterministicos offline",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "Projeto Pacote de Lancamento de Tokens",
        description: "Construa fluxos deterministicos de validacao, planejamento e simulacao que produzam artefatos de lancamento revisaveis e criterios claros de seguir/nao seguir.",
        lessons: {
          "token-v2-build-init-plan": {
            title: "Construir plano de instrucoes de inicializacao do Token-2022",
          },
          "token-v2-simulate-fees-supply": {
            title: "Construir matematica de mint-to + transfer-fee + simulacao",
          },
          "token-v2-launch-checklist": {
            title: "Checklist de lancamento: parametros, estrategia de upgrade/authority e plano de airdrop/testes",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "Emitir LaunchPackSummary estavel",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "Desenvolvimento Movel Solana",
    description: "Construa dApps Solana movel prontas para producao com MWA, arquitetura robusta de sessao de wallet, UX explicita de assinatura e operacoes disciplinadas de distribuicao.",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "Movel Wallet Adapter",
        description: "Protocolo base do MWA, controle do ciclo de vida de sessao e padroes resilientes de handoff de wallet para apps movel em producao.",
        lessons: {
          "mobile-wallet-overview": {
            title: "Visao geral de wallet movel",
          },
          "mwa-integration": {
            title: "Integracao de MWA",
          },
          "mobile-transaction": {
            title: "Construir uma funcao de transacao movel",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store e Distribuicao",
        description: "Publicacao, prontidao operacional e praticas de UX movel centradas em confianca para distribuicao de apps Solana.",
        lessons: {
          "dapp-store-submission": {
            title: "Submissao na dApp Store",
          },
          "mobile-best-practices": {
            title: "Boas praticas movel",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "Testes de Programas Solana",
    description: "Construa sistemas de teste Solana robustos em ambientes local, simulado e de rede com invariantes de seguranca explicitas e gates de confianca de qualidade de release.",
    modules: {
      "module-testing-foundations": {
        title: "Fundamentos de Testes",
        description: "Estrategia central de testes em camadas unit/integration com fluxos deterministicos e cobertura de casos adversariais.",
        lessons: {
          "testing-approaches": {
            title: "Abordagens de testes",
          },
          "bankrun-testing": {
            title: "Testes com Bankrun",
          },
          "write-bankrun-test": {
            title: "Escrever um teste Bankrun para Counter Program",
          },
        },
      },
      "module-advanced-testing": {
        title: "Testes Avancados",
        description: "Fuzzing, validacao em devnet e controles de release em CI/CD para mudancas de protocolo mais seguras.",
        lessons: {
          "fuzzing-trident": {
            title: "Fuzzing com Trident",
          },
          "devnet-testing": {
            title: "Testes em Devnet",
          },
          "ci-cd-pipeline": {
            title: "Pipeline de CI/CD para Solana",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "Indexacao e Analytics Solana",
    description: "Construa um indexador de eventos Solana de nivel de producao com decodificacao deterministica, contratos de ingestao resilientes, recuperacao por ponto de controles e outputs analiticos confiaveis.",
    modules: {
      "indexing-v2-foundations": {
        title: "Fundamentos de Indexacao",
        description: "Modelo de eventos, decodificacao de conta token e parsing de metadados de transacao para pipelines de indexacao confiaveis.",
        lessons: {
          "indexing-v2-events-model": {
            title: "Modelo de eventos: transacoes, logs e instrucoes de programa",
          },
          "indexing-v2-token-decoding": {
            title: "Decodificacao de conta token e layout SPL",
          },
          "indexing-v2-decode-token-account": {
            title: "Desafio: decodificar conta token + diff de saldos token",
          },
          "indexing-v2-transaction-meta": {
            title: "Parsing de metadados de transacao: logs, erros e instrucoes internas",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "Pipeline de Indexacao e Analytics",
        description: "Normalizacao de transacoes, paginacao/ponto de controles, estrategias de cache e agregacao analitica reproduzivel.",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "Desafio: indexar transacoes em eventos normalizados",
          },
          "indexing-v2-pagination-caching": {
            title: "Paginacao, ponto de controleing e semantica de cache",
          },
          "indexing-v2-analytics": {
            title: "Agregacao analitica: metricas por wallet e por token",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "Ponto de controle: produzir resumo analitico JSON estavel",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "Pagamentos e Checkout na Solana",
    description: "Construa fluxos de pagamento Solana de nivel de producao com validacao robusta, idempotencia segura contra replay, webhooks seguros e recibos deterministas para conciliacao.",
    modules: {
      "payments-v2-foundations": {
        title: "Fundamentos de Pagamentos",
        description: "Validacao de endereco, estrategia de idempotencia e design de payment intent para comportamento de checkout confiavel.",
        lessons: {
          "payments-v2-address-validation": {
            title: "Validacao de endereco e estrategias de memo",
          },
          "payments-v2-idempotency": {
            title: "Chaves de idempotencia e protecao contra replay",
          },
          "payments-v2-payment-intent": {
            title: "Desafio: criar payment intent com validacao",
          },
          "payments-v2-tx-building": {
            title: "Construcao de transacao e metadados-chave",
          },
        },
      },
      "payments-v2-implementation": {
        title: "Implementaracao e Verificacao",
        description: "Construcao de transacao, verificacao de autenticidade de webhook e geracao deterministica de recibo com tratamento claro de estados de erro.",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "Desafio: construir transacao de transferencia",
          },
          "payments-v2-webhooks": {
            title: "Assinatura e verificacao de webhooks",
          },
          "payments-v2-error-states": {
            title: "Maquina de estados de erro e formato de recibo",
          },
          "payments-v2-webhook-receipt": {
            title: "Desafio: verificar webhook e gerar recibo",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "Fundamentos de NFTs e cNFTs",
    description: "Domine a engenharia de NFTs comprimidos na Solana: compromissos Merkle, sistemas de prova, modelagem de colecoes e checagens de seguranca de nivel producao.",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "Fundamentos de Merkle",
        description: "Construcao de arvore, hashing de folha, mecanica de insercao e modelo de compromisso on-chain/off-chain por tras de ativos comprimidos.",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "Arvores Merkle para compressao de estado",
          },
          "cnft-v2-leaf-hashing": {
            title: "Convencoes de hashing de folha e metadados",
          },
          "cnft-v2-merkle-insert": {
            title: "Desafio: implementarar insercao em arvore Merkle + atualizacoes de root",
          },
          "cnft-v2-proof-generation": {
            title: "Geracao de prova e calculo de caminho",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "Sistema de Provas e Seguranca",
        description: "Geracao e verificacao de prova, integridade de colecao e endurecimento de seguranca contra replay e spoof de metadados.",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "Desafio: implementarar geracao de prova + verificador",
          },
          "cnft-v2-collection-minting": {
            title: "Mints de colecao e simulacao de metadados",
          },
          "cnft-v2-attack-surface": {
            title: "Superficie de ataque: provas invalidas e replay",
          },
          "cnft-v2-compression-checkpoint": {
            title: "Ponto de controle: simular mint + verificar prova de ownership",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "Governanca e Operacoes de Tesouraria Multassinatura",
    description: "Construa sistemas de governanca DAO e tesouraria multassinatura prontos para producao com contabilizacao deterministica de votos, seguranca de timelock e controles de execucao seguros.",
    modules: {
      "governance-v2-governance": {
        title: "Governanca DAO",
        description: "Ciclo de vida de propostas, mecanicas de votacao deterministicas, politica de quorum e seguranca de timelock para uma governanca DAO confiavel.",
        lessons: {
          "governance-v2-dao-model": {
            title: "Modelo DAO: propostas, votacao e execucao",
          },
          "governance-v2-quorum-math": {
            title: "Matematica de quorum e calculo de peso de voto",
          },
          "governance-v2-timelocks": {
            title: "Estados de timelock e agendamento de execucao",
          },
          "governance-v2-quorum-voting": {
            title: "Desafio: implementar maquina de estados de quorum/votacao",
          },
        },
      },
      "governance-v2-multisig": {
        title: "Tesouraria Multassinatura",
        description: "Construcao de transacao multassinatura, controles de aprovacao, defesas contra repeticao e padroes seguros de execucao de tesouraria.",
        lessons: {
          "governance-v2-multisig": {
            title: "Construcao de transacao multassinatura e aprovacoes",
          },
          "governance-v2-multisig-builder": {
            title: "Desafio: implementar construtor de tx multassinatura + regras de aprovacao",
          },
          "governance-v2-safe-defaults": {
            title: "Padroes seguros: checks de proprietario e guardas contra repeticao",
          },
          "governance-v2-treasury-execution": {
            title: "Desafio: executar proposta e gerar diff de tesouraria",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "Desempenho Solana e Otimizacao de Compute",
    description: "Domine a engenharia de desempenho na Solana com fluxos de otimizacao mensuraveis: orcamento de computos, layouts de dados, eficiencia de encoding e modelagem deterministica de custos.",
    modules: {
      "performance-v2-foundations": {
        title: "Fundamentos de Desempenho",
        description: "Modelo de compute, decisoes de layout de conta/dados e estimativa deterministica de custo para raciocinio de desempenho no nivel de transacao.",
        lessons: {
          "performance-v2-compute-model": {
            title: "Modelo de compute: orcamentos, custos e limites",
          },
          "performance-v2-account-layout": {
            title: "Design de layout de conta e custo de serializacao",
          },
          "performance-v2-cost-model": {
            title: "Desafio: implementarar modelo estimateCost(op)",
          },
          "performance-v2-instruction-data": {
            title: "Tamanho de dados de instrucao e otimizacao de encoding",
          },
        },
      },
      "performance-v2-optimization": {
        title: "Otimizacao e Analise",
        description: "Otimizacao de layout, tuning de orcamento de computo e analise before/after de desempenho com salvaguardas de corretude.",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "Desafio: implementarar layout/codec otimizado",
          },
          "performance-v2-compute-budget": {
            title: "Fundamentos das instrucoes de orcamento de computo",
          },
          "performance-v2-micro-optimizations": {
            title: "Micro-otimizacoes e tradeoffs",
          },
          "performance-v2-perf-checkpoint": {
            title: "Ponto de controle: comparar before/after + gerar relatorio de desempenho",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "Agregacao DeFi de Trocas",
    description: "Domine a agregacao de trocas em producao na Solana: parsing deterministico de cotacoes, tradeoffs de otimizacao de rotas, seguranca de slippage e execucao orientada a confiabilidade.",
    modules: {
      "swap-v2-fundamentals": {
        title: "Fundamentos de Troca",
        description: "Mecanica de troca de token, protecao de slippage, composicao de rotas e construcao deterministica de TrocaPlan com tradeoffs transparentes.",
        lessons: {
          "swap-v2-mental-model": {
            title: "Modelo mental de troca: mints, ATAs, decimais e rotas",
          },
          "swap-v2-slippage": {
            title: "Slippage e impacto de preco: proteger resultados do troca",
          },
          "swap-v2-route-explorer": {
            title: "Visualizacao de rota: entender pernas do troca e taxas",
          },
          "swap-v2-swap-plan": {
            title: "Desafio: construir um TrocaPlan normalizado a partir de uma cotacao",
          },
        },
      },
      "swap-v2-execution": {
        title: "Execucao e Confiabilidade",
        description: "Execucao por maquina de estados, anatomia da transacao, padroes de confiabilidade de retry/staleness e relatorios de execucao de alto sinal.",
        lessons: {
          "swap-v2-state-machine": {
            title: "Desafio: implementarar maquina de estados da UI de troca",
          },
          "swap-v2-tx-anatomy": {
            title: "Anatomia da transacao de troca: instrucoes, contas e compute",
          },
          "swap-v2-reliability": {
            title: "Padroes de confiabilidade: retries, cotacoes stale e latencia",
          },
          "swap-v2-swap-report": {
            title: "Ponto de controle: gerar um TrocaRunRelatorio",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "Engenharia de Liquidez CLMM",
    description: "Domine engenharia de liquidez concentrada em DEXs Solana: matematica de ticks, design de estrategia por faixa, dinamica de taxas/IL e relatorios deterministas de posicoes LP.",
    modules: {
      "clmm-v2-fundamentals": {
        title: "Fundamentos de CLMM",
        description: "Conceitos de liquidez concentrada, matematica de tick/preco e comportamento de posicoes por faixa para raciocinar sobre execucao CLMM.",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM vs produto constante: por que os ticks existem",
          },
          "clmm-v2-price-tick": {
            title: "Preco, tick e sqrtPrice: conversoes essenciais",
          },
          "clmm-v2-range-explorer": {
            title: "Posicoes por faixa: dinamica in-range e out-of-range",
          },
          "clmm-v2-tick-math": {
            title: "Desafio: implementarar helpers de conversao tick/preco",
          },
        },
      },
      "clmm-v2-positions": {
        title: "Posicoes e Risco",
        description: "Simulacao de acumulacao de taxas, tradeoffs de estrategias de faixa, riscos de precisao e relatorios deterministas de risco de posicao.",
        lessons: {
          "clmm-v2-position-fees": {
            title: "Desafio: simular acumulacao de taxas da posicao",
          },
          "clmm-v2-range-strategy": {
            title: "Estrategias de faixa: estreita, ampla e regras de rebalanceamento",
          },
          "clmm-v2-risk-review": {
            title: "Riscos de CLMM: arredondamento, overflow e erros de tick spacing",
          },
          "clmm-v2-position-report": {
            title: "Ponto de controle: gerar um relatorio de posicao",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "Risco de Emprestimos e Liquidacao",
    description: "Domine engenharia de risco em emprestimos Solana: mecanicas de utilizacao e juros, analise de caminhos de liquidacao, seguranca de oraculo e relatorios deterministas de cenarios.",
    modules: {
      "lending-v2-fundamentals": {
        title: "Fundamentos de Emprestimos",
        description: "Mecanicas de pool de emprestimos, modelos de taxa guiados por utilizacao e fundamentos de health factor necessarios para analise de risco defensavel.",
        lessons: {
          "lending-v2-pool-model": {
            title: "Modelo de pool de emprestimos: supply, borrow e utilizacao",
          },
          "lending-v2-interest-curves": {
            title: "Curvas de taxa de juros e modelo de kink",
          },
          "lending-v2-health-explorer": {
            title: "Monitoramento de health factor e previsao de liquidacao",
          },
          "lending-v2-interest-rates": {
            title: "Desafio: calcular taxas de juros baseadas em utilizacao",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "Gestao de Risco",
        description: "Calculo de health factor, mecanicas de liquidacao, tratamento de falhas de oraculo e relatorios de risco multi-cenario para mercados estressados.",
        lessons: {
          "lending-v2-health-factor": {
            title: "Desafio: calcular health factor e status de liquidacao",
          },
          "lending-v2-liquidation-mechanics": {
            title: "Mecanicas de liquidacao: bonus, close factor e bad debt",
          },
          "lending-v2-oracle-risk": {
            title: "Risco de oraculo e precos defasados em emprestimos",
          },
          "lending-v2-risk-report": {
            title: "Ponto de controle: gerar um relatorio de risco multi-cenario",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "Console de Risco para Perpetuos",
    description: "Domine engenharia de risco de perpetuos na Solana: contabilidade precisa de PnL/funding, monitoramento de margem, simulacao de liquidacao e relatorios deterministas no console.",
    modules: {
      "perps-v2-fundamentals": {
        title: "Fundamentos de Perpetuos",
        description: "Mecanica de futuros perpetuos, logica de acumulacao de funding e fundamentos de modelagem de PnL para diagnosticos precisos de posicao.",
        lessons: {
          "perps-v2-mental-model": {
            title: "Futuros perpetuos: posicoes base, preco de entrada e mark vs oracle",
          },
          "perps-v2-funding": {
            title: "Funding rates: por que existem e como acumulam",
          },
          "perps-v2-pnl-explorer": {
            title: "Visualizacao de PnL: acompanhando lucro ao longo do tempo",
          },
          "perps-v2-pnl-calc": {
            title: "Desafio: calcular PnL de futuros perpetuos",
          },
          "perps-v2-funding-accrual": {
            title: "Desafio: simular acumulacao de funding rate",
          },
        },
      },
      "perps-v2-risk": {
        title: "Risco e Monitoramento",
        description: "Monitoramento de margem e liquidacao, armadilhas comuns de implementaracao e saidas deterministicas de console de risco para observabilidade em producao.",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "Razao de margem e limites de liquidacao",
          },
          "perps-v2-common-bugs": {
            title: "Bugs comuns: erros de sinal, unidades e direcao do funding",
          },
          "perps-v2-risk-console-report": {
            title: "Ponto de controle: gerar um relatorio de console de risco",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "Otimizador de Transacoes DeFi",
    description: "Domine otimizacao de transacoes DeFi na Solana: ajuste de compute/taxas, estrategia ALT, padroes de confiabilidade e planejamento deterministico de estrategia de envio.",
    modules: {
      "txopt-v2-fundamentals": {
        title: "Fundamentos de Transacao",
        description: "Diagnostico de falha de transacao, mecanica de orcamento de computo, estrategia de priority fee e bases de estimativa de taxas.",
        lessons: {
          "txopt-v2-why-fail": {
            title: "Por que transacoes DeFi falham: limites de CU, tamanho e expiracao de blockhash",
          },
          "txopt-v2-compute-budget": {
            title: "Instrucoes de orcamento de computo e estrategia de priority fee",
          },
          "txopt-v2-cost-explorer": {
            title: "Estimativa de custo de transacao e planejamento de taxas",
          },
          "txopt-v2-tx-plan": {
            title: "Desafio: construir um plano de transacao com orcamento de computoing",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "Otimizacao e Estrategia",
        description: "Planejamento de Address Lookup Table, padroes de confiabilidade/retry, UX de erro acionavel e relatorio completo de estrategia de envio.",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "Desafio: planejar uso de Address Lookup Table",
          },
          "txopt-v2-reliability": {
            title: "Padroes de confiabilidade: retry, re-quote, resend vs reconstruir",
          },
          "txopt-v2-ux-errors": {
            title: "UX: mensagens de erro acionaveis para falhas de transacao",
          },
          "txopt-v2-send-strategy": {
            title: "Ponto de controle: gerar um relatorio de estrategia de envio",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "Assinatura Mobile na Solana",
    description: "Domine assinatura de carteira mobile em producao na Solana: sessoes Android MWA, restricoes de deep link no iOS, retries resilientes e telemetria deterministica de sessao.",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "Fundamentos de Assinatura Mobile",
        description: "Restricoes de plataforma, padroes de UX de conexao, comportamento de timeline de assinatura e construcao tipada de requests em Android/iOS.",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "Reality check da assinatura mobile: restricoes Android vs iOS",
          },
          "mobilesign-v2-connection-ux": {
            title: "Padroes de UX de conexao de carteira: connect, reconnect e recovery",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "Timeline da sessao de assinatura: fluxo de request, carteira e resposta",
          },
          "mobilesign-v2-sign-request": {
            title: "Desafio: construir um sign request tipado",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "Padroes de Producao",
        description: "Persistencia de sessao, seguranca na tela de revisao de transacao, maquinas de estado de retry e relatorio deterministico de sessao para apps mobile em producao.",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "Desafio: persistencia e restauracao de sessao",
          },
          "mobilesign-v2-review-screens": {
            title: "Revisao de transacao mobile: o que usuarios precisam ver",
          },
          "mobilesign-v2-retry-patterns": {
            title: "Retry de um toque: tratar estados offline, rejected e timeout",
          },
          "mobilesign-v2-session-report": {
            title: "Ponto de controle: gerar um relatorio de sessao",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "Comercio com Solana Pay",
    description: "Domine integracao comercial com Solana Pay: encoding robusto de URL, fluxos de rastreamento QR/pagamento, UX de confirmacao e artefatos deterministas de conciliacao POS.",
    modules: {
      "solanapay-v2-foundations": {
        title: "Fundamentos de Solana Pay",
        description: "Especificacao Solana Pay, rigor de encoding de URL, anatomia de transfer request e padroes deterministicos de construirer/encoder.",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "Modelo mental do Solana Pay e regras de encoding de URL",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "Anatomia de transfer request: recipient, amount, reference e labels",
          },
          "solanapay-v2-url-explorer": {
            title: "Construtor de URL: preview ao vivo de URLs Solana Pay",
          },
          "solanapay-v2-encode-transfer": {
            title: "Desafio: codificar uma URL de transfer request Solana Pay",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "Rastreamento e Comercio",
        description: "Maquinas de estado de rastreamento por reference, UX de confirmacao, tratamento de falhas e geracao deterministica de recibo POS.",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "Desafio: rastrear referencias de pagamento por estados de confirmacao",
          },
          "solanapay-v2-confirmation-ux": {
            title: "UX de confirmacao: estados pending, confirmed e expired",
          },
          "solanapay-v2-error-handling": {
            title: "Tratamento de erros e casos de borda em fluxos de pagamento",
          },
          "solanapay-v2-pos-receipt": {
            title: "Ponto de controle: gerar um recibo POS",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "Engenharia de UX de Carteira",
    description: "Domine engenharia de UX de carteira na Solana em producao: estado de conexao deterministico, seguranca de rede, resiliencia RPC e padroes de confiabilidade mensuraveis.",
    modules: {
      "walletux-v2-fundamentals": {
        title: "Fundamentos de Conexao",
        description: "Design de conexao de carteira, rede gating e arquitetura deterministica de maquina de estados para onboarding e reconexao previsiveis.",
        lessons: {
          "walletux-v2-connection-design": {
            title: "UX de conexao que funciona: lista de verificacao de design",
          },
          "walletux-v2-network-gating": {
            title: "Rede gating e recuperacao de rede incorreta",
          },
          "walletux-v2-state-explorer": {
            title: "Maquina de estados de conexao: estados, eventos e transicoes",
          },
          "walletux-v2-connection-state": {
            title: "Desafio: implementar maquina de estados de conexao da carteira",
          },
        },
      },
      "walletux-v2-production": {
        title: "Padroes de Producao",
        description: "Invalidacao de cache, resiliencia e monitoramento de saude RPC, e relatorios mensuraveis de qualidade UX de carteira para operacao em producao.",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "Desafio: invalidacao de cache em eventos da carteira",
          },
          "walletux-v2-rpc-caching": {
            title: "Leituras RPC e estrategia de cache para apps de carteira",
          },
          "walletux-v2-rpc-health": {
            title: "Monitoramento de saude RPC e degradacao graciosa",
          },
          "walletux-v2-ux-report": {
            title: "Ponto de controle: gerar um Carteira UX Relatorio",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "Domine autenticacao SIWS em producao na Solana: entradas padronizadas, invariantes estritas de verificacao, ciclo de vida de nonce resistente a replay e relatorios prontos para auditoria.",
    modules: {
      "siws-v2-fundamentals": {
        title: "Fundamentos de SIWS",
        description: "Racional do SIWS, semantica estrita dos campos de entrada, comportamento de renderizacao da carteira e construcao deterministica de sign-in input.",
        lessons: {
          "siws-v2-why-exists": {
            title: "Por que SIWS existe: substituir connect-and-signMessage",
          },
          "siws-v2-input-fields": {
            title: "Campos de entrada SIWS e regras de seguranca",
          },
          "siws-v2-message-preview": {
            title: "Preview da mensagem: como carteiras renderizam requests SIWS",
          },
          "siws-v2-sign-in-input": {
            title: "Desafio: construir um sign-in input SIWS validado",
          },
        },
      },
      "siws-v2-verification": {
        title: "Verificacao e Seguranca",
        description: "Invariantes de verificacao server-side, defesas de nonce contra replay, gerenciamento de sessao e relatorio deterministico de auditoria de autenticacao.",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "Desafio: verificar uma resposta de sign-in SIWS",
          },
          "siws-v2-sessions": {
            title: "Sessoes e logout: o que armazenar e o que nao armazenar",
          },
          "siws-v2-replay-protection": {
            title: "Protecao contra replay e design do registro de nonce",
          },
          "siws-v2-auth-report": {
            title: "Ponto de controle: gerar um relatorio de auditoria de autenticacao",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "Taxas Prioritarias e Orcamento de Computo",
    description: "Engenharia defensiva de taxas na Solana com planejamento deterministico de compute, politica adaptativa de prioridade e contratos de confiabilidade UX orientados por confirmacao.",
    modules: {
      "pfcb-v2-foundations": {
        title: "Fundamentos de Fees e Compute",
        description: "Mecanicas de inclusao, acoplamento compute/fee e design de politica orientado por explorer com framing deterministico de confiabilidade.",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "Mercados de fees na Solana: o que realmente move inclusao",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "Fundamentos de orcamento de computo e modos comuns de falha",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer: entradas do planner de orcamento de computo para plano",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "Desafio: implementarar planComputeBudget()",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "Jornada do Projeto Fee Otimizador",
        description: "Implementarar planners deterministicos, motores de politica de confirmacao e artefatos estaveis de estrategia de fee para revisao de release.",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "Desafio: implementarar estimatePriorityFee()",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "Desafio: engine de decisao de nivel de confirmacao",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "Desafio: construir markdown feePlanResumo",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "Ponto de controle: relatorio do Fee Otimizador",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "Pacotes e Atomicidade de Transacoes",
    description: "Projete fluxos defensivos multi-transacao na Solana com validacao deterministica de atomicidade, modelagem de compensacao e relatorios de seguranca prontos para auditoria.",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "Fundamentos de Atomicidade",
        description: "Modelo de atomicidade, riscos de fluxos multi-transacao e validacao defensiva de seguranca para proteger expectativas do usuario.",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "Conceitos de atomicidade e por que usuarios assumem tudo-ou-nada",
          },
          "bundles-v2-flow-risk-points": {
            title: "Fluxos multi-transacao: approvals, criacao de ATA, swaps e refunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer: passos do flow graph e pontos de risco",
          },
          "bundles-v2-build-atomic-flow": {
            title: "Desafio: implementarar construirAtomicFlow()",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "Projeto Simulador de Fluxo Atomic Swap",
        description: "Implementarar validadores deterministicos de atomicidade, padroes de tratamento de falha e composicao estavel de pacotes para revisao de release.",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "Desafio: implementarar validateAtomicidade()",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "Desafio: tratamento de falhas com chaves de idempotencia",
          },
          "bundles-v2-bundle-composer": {
            title: "Desafio: composer deterministico de pacotes",
          },
          "bundles-v2-flow-safety-report": {
            title: "Ponto de controle: relatorio de seguranca do fluxo",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "Realidade do Mempool e UX Anti-Sandwich",
    description: "Engenharia defensiva de UX para swaps com graduacao deterministica de risco, politicas de slippage limitadas e comunicacao de seguranca pronta para incidentes.",
    modules: {
      "mempoolux-v2-foundations": {
        title: "Realidade do Mempool e Defesa de UX",
        description: "Riscos entre quote e execucao, guardrails de slippage e decisoes de frescor para swaps mais seguros em producao.",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "O que pode dar errado entre quote e execucao",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "Controles de slippage e guardrails",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer: timer de frescor de quote e tabela de decisao",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "Desafio: implementarar evaluateSwapRisk()",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "Projeto de UI de Swap Protegida",
        description: "Implementarar guardas de slippage, modelos de impacto e configuracoes exportaveis de protecao com saida deterministica.",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "Desafio: implementarar slippageGuard()",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "Desafio: modelar impacto de preco vs slippage",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "Desafio: construir swapSafetyBanner()",
          },
          "mempoolux-v2-protection-config-export": {
            title: "Ponto de controle: exportacao de configuracao de protecao de swap",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "Indexadores, Webhooks e Pipelines Seguros para Reorg",
    description: "Construa pipelines deterministicas de indexacao em producao com ingestao segura contra duplicatas, tratamento de reorg e relatorios orientados por integridade.",
    modules: {
      "indexpipe-v2-foundations": {
        title: "Fundamentos de Confiabilidade do Indexador",
        description: "Bases de indexacao, realidade de reorg/confirmacao e estagios de pipeline para ingestoes rastreaveis e seguras.",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "Indexacao 101: logs, contas e parsing de transacoes",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "Reorgs e fork choice: por que confirmed nao e finalized",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer: de ingest para dedupe para confirm para apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "Desafio: implementarar dedupeEvents()",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "Projeto de Indexador Reorg-Safe",
        description: "Implementarar logica de confirmacao, planejamento de backfill/idempotencia e checagens de integridade para relatorios de pipeline estaveis.",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "Desafio: implementarar applyWithConfirmations()",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "Desafio: planejamento de backfill e idempotencia",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "Desafio: checagens de integridade de snapshot",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "Ponto de controle: exportacao de relatorio de pipeline",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "Confiabilidade RPC e Engenharia de Latencia",
    description: "Projete clientes RPC Solana multi-provedor em producao com politicas deterministicas de repeticao, roteamento, cache e observabilidade.",
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
        "description": "Build deterministic policy engines para routing, retries, metrics reduction, e health report exports.",
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
    title: "Layout de Dados Rust e Dominio de Borsh",
    description: "Engenharia de layout de dados Solana com foco Rust e tooling deterministico em nivel de bytes, com praticas de schema seguras para compatibilidade.",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, e pratico parsing safety para stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, e why Solana contas care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct e enum layout pitfalls plus Borsh rules",
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
        "title": "Conta Layout Inspector Project Journey",
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
    title: "Design de Erros e Invariantees em Rust",
    description: "Construa bibliotecas tipadas de guardas de invariantees com artefatos deterministas de evidencia, contratos de erro seguros para compatibilidade e relatorios prontos para auditoria.",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error e Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, e deterministic invariant design fundamentals.",
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
        "description": "Implement guard helpers, evidence-chain generation, e stable audit reporting para reliability e incident response.",
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
    title: "Performance Rust para Pensamento On-chain",
    description: "Simule e otimize comportamento de custo de compute com tooling deterministico Rust-first e governanca de performance guiada por budget.",
    modules: {
      "rpot-v2-foundations": {
        "title": "Desempenho Foundations",
        "description": "Rust desempenho modelo mentals, data-structure tradeoffs, e deterministic cost reasoning para reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "Desempenho modelo mental: allocations, clones, hashing",
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
        "description": "Build deterministic profilers, recommendation engines, e report outputs aligned to explicit desempenho budgets.",
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
    title: "Concorrencia e Assincrono para Indexadores (Rust)",
    description: "Engenharia de pipeline assincrono com foco Rust-first e concorrencia limitada, reducers seguros contra replay e relatorios operacionais deterministicos.",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, e deterministic execution modeling para indexer reliability.",
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
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, e report exports para reorg-safe pipeline operations.",
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
    title: "Macros Procedurais e Geracao de codigo para Seguranca",
    description: "Seguranca de macros/geracao de codigo em Rust ensinada com parser deterministico e tooling de geracao de checagens com saidas amigaveis para auditoria.",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro e Codegen Foundations",
        "description": "Macro modelo mentals, constraint DSL design, e safety-driven code generation fundamentals.",
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
        "title": "Conta Constraint Codegen (Sim)",
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
    title: "Atualizacaos de Anchor e Migracoes de Conta",
    description: "Desenhe fluxos de release seguros em producao para Anchor com planejamento deterministico de migracao, gates de atualizacao, playbooks de rollback e evidencia de prontidao.",
    modules: {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, conta versioning strategy, e deterministic upgrade risk modeling para Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "Conta versioning e migration strategy",
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
        "description": "Safety validation gates, rollback planning, e deterministic readiness artifacts para controlled migration execution.",
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
    title: "Engenharia de Confiabilidade para Solana",
    description: "Engenharia de confiabilidade focada em producao para sistemas Solana: tolerancia a falhas, retries, deadlines, circuit breakers e degradacao graciosa com resultados operacionais mensuraveis.",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks com clear failure classification, retry boundaries, e deterministic recovery behavior.",
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
    title: "Estrategias de Teste para Solana",
    description: "Estrategia abrangente de testes para Solana orientada a producao: testes unitarios deterministicos, integracoes realistas, fuzz/property testes e relatorios de confianca para release.",
    modules: {
      "mod-11-1": {
        "title": "Unit e Integration Testes",
        "description": "Build deterministic unit e integration testes layers com clear ownership of invariants, fixtures, e failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "Testes Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock Conta Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "Avancado Testes Techniques",
        "description": "Use fuzzing, property-based tests, e mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing e Property Testes",
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
    title: "Otimizacao de Programaas Solana",
    description: "Projete performance Solana de nivel producao: compute budgeting, eficiencia de layout de contas, tradeoffs de memoria/rent e workflows de otimizacao deterministicos.",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths com explicit CU budgets, operation-level profiling, e predictable desempenho tradeoffs.",
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
        "description": "Design memory/storage-efficient conta layouts com rent-aware sizing, serialization discipline, e safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "Conta Data Optimization",
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
    title: "Design de Tokenomics para Solana",
    description: "Desenhe economias de token robustas na Solana com disciplina de distribuicao, seguranca de vesting, incentivos de staking e mecanicas de governanca operacionalmente defensaveis.",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution e Vesting",
        "description": "Model token allocation e vesting systems com explicit fairness, unlock predictability, e deterministic accounting rules.",
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
        "title": "Staking e Governanca",
        "description": "Design staking e governanca mechanics com clear incentive alignment, anti-manipulation constraints, e measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking e Governanca Design",
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
    title: "Primitivas DeFi na Solana",
    description: "Construa fundamentos praticos de DeFi na Solana: mecanicas de AMM, contabilidade de liquidez, primitivas de emprestimos e padroes de composicao seguros contra flash loans.",
    modules: {
      "mod-14-1": {
        "title": "AMM e Liquidity",
        "description": "Implement AMM e liquidity primitives com deterministic math, slippage-aware outputs, e LP accounting correctness.",
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
        "description": "Model lending e flash-loan flows com collateral safety, utilization-aware pricing, e strict repayment invariants.",
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
    title: "Padroes NFT na Solana",
    description: "Implementare NFTs Solana com padroes prontos para producao: integridade de metadata, disciplina de colecao e comportamentos avancados programaveis/nao transferiveis.",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality com standards-compliant metadata, collection verification, e deterministic asset-state handling.",
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
        "title": "Avancado NFT Features",
        "description": "Implement avancado NFT behaviors (soulbound e programmable flows) com explicit policy controls e safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound e Programmable NFTs",
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
    title: "Padroes de Invocacao Entre Programas (CPI)",
    description: "Domine composicao CPI na Solana com validacao segura de contas, disciplina de assinante PDA e padroes deterministicos de orquestracao multi-programa.",
  },
  "solana-mev-strategies": {
    title: "MEV e Ordenacao de Transacoes",
    description: "Engenharia de ordenacao de transacoes focada em producao na Solana: roteamento consciente de MEV, estrategia de bundles, modelagem de liquidacao/arbitragem e controles de execucao protetivos ao usuario.",
  },
  "solana-deployment-cicd": {
    title: "Implantacao de Programaas e CI/CD",
    description: "Engenharia de implantacao em producao para programaas Solana: estrategia de ambientes, gates de release, controles de qualidade CI/CD e workflows operacionais seguros para upgrades.",
  },
  "solana-cross-chain-bridges": {
    title: "Pontes Entre Cadeias e Wormhole",
    description: "Construa integracoes entre cadeias mais seguras para Solana com mensageria estilo Wormhole, verificacao de attestations e controles deterministicos de estado da ponte.",
  },
  "solana-oracle-pyth": {
    title: "Integracao de Oraculo e Rede Pyth",
    description: "Integre feeds de oraculo na Solana com seguranca: validacao de preco, politica de confianca/staleness e agregacao multi-fonte para decisoes de protocolo resilientes.",
  },
  "solana-dao-tooling": {
    title: "Tooling DAO e Organizacoes Autonomas",
    description: "Construa sistemas DAO prontos para producao na Solana: governanca de propostas, integridade de voto, controles de tesouraria e workflows deterministicos de execucao/relatorioing.",
  },
  "solana-gaming": {
    title: "Jogos e Gestao de Estado de Jogo",
    description: "Construa sistemas de jogos on-chain prontos para producao na Solana: modelos eficientes de estado, integridade de turno, controles de fairness e economia escalavel de progressao de jogadores.",
  },
  "solana-permanent-storage": {
    title: "Armazenamento Permanente e Arweave",
    description: "Integre armazenamento descentralizado permanente com Solana usando workflows estilo Arweave: content addressing, integridade de manifest e acesso verificavel a dados de longo prazo.",
  },
  "solana-staking-economics": {
    title: "Staking e Economia de Validadores",
    description: "Entenda staking e economia de validadores Solana para decisao no mundo real: estrategia de delegacao, dinamica de recompensas, efeitos de comissao e sustentabilidade operacional.",
  },
  "solana-account-abstraction": {
    title: "Abstracao de Conta e Smart Carteiras",
    description: "Implementare padroes de smart-carteira/abstracao de conta na Solana com autorizacao programavel, controles de recuperacao e validacao de transacao orientada por politica.",
  },
  "solana-pda-mastery": {
    title: "Dominio de Program Derived Addresses",
    description: "Domine engenharia avancada de PDAs na Solana: design de schema de seeds, disciplina de bump e uso seguro de PDAs cross-program em escala de producao.",
  },
  "solana-economics": {
    title: "Economia da Solana e Fluxos de Token",
    description: "Analise dinamicas economicas da Solana em contexto de producao: interacao inflacao/fee-burn, fluxos de staking, movimento de supply e tradeoffs de sustentabilidade de protocolo.",
  },
};

export const ptBrCourseTranslations: CourseTranslationMap = ptBrCuratedCourseTranslations;
