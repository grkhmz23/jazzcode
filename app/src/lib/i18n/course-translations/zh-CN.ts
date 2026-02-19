import type { CourseTranslationMap } from "./types";

const zhCnCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Solana 基础",
    description: "面向生产实践的入门课程，帮助初学者建立清晰的 Solana 心智模型、强化交易调试能力，并形成可复现的钱包管理工作流。",
  },
  "anchor-development": {
    title: "Anchor 开发",
    description: "项目制课程，带你从基础走向真实 Anchor 工程：确定性账户建模、指令构建、测试纪律与可靠的客户端体验。",
    modules: {
      "anchor-v2-module-basics": {
        "title": "Anchor 基础",
        "description": "Anchor architecture, 账户 constraints, 和 PDA foundations 使用 explicit ownership of 安全-critical decisions.",
        "lessons": {
          "anchor-mental-model": {
            "title": "Anchor 思维模型",
          },
          "anchor-accounts-constraints-and-safety": {
            "title": "账户, constraints, 和 safety",
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
        "title": "PDAs, 账户, 和 测试",
        "description": "Deterministic 指令 builders, stable state emulation, 和 测试 strategy that separates pure logic from network integration.",
        "lessons": {
          "anchor-increment-builder-and-emulator": {
            "title": "Increment 指令 builder + state layout",
          },
          "anchor-testing-without-flakiness": {
            "title": "测试 strategy without flakiness",
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
    title: "Solana 前端开发",
    description: "面向前端工程师的项目制课程，打造可用于生产的 Solana 仪表盘：确定性 reducer、可回放事件流水线与可信的交易体验。",
    modules: {
      "frontend-v2-module-fundamentals": {
        title: "Solana 前端基础",
        description: "正确建模钱包/账户状态，设计交易生命周期 UX，并落实确定性规则以支持可复现调试。",
        lessons: {
          "frontend-v2-wallet-state-accounts-model": {
            title: "面向 UI 开发者的钱包状态 + 账户心智模型",
          },
          "frontend-v2-transaction-lifecycle-ui": {
            title: "UI 交易生命周期：待处理/已确认/已最终确认 与乐观 UI",
          },
          "frontend-v2-data-correctness-idempotency": {
            title: "数据正确性：去重、顺序、幂等与修正事件",
          },
          "frontend-v2-core-reducer": {
            title: "基于事件构建核心状态模型 + reducer",
          },
        },
      },
      "frontend-v2-module-token-dashboard": {
        title: "Token 仪表盘项目",
        description: "构建 reducer、回放快照、查询指标与确定性仪表盘输出，在部分或延迟数据下保持稳定。",
        lessons: {
          "frontend-v2-stream-replay-snapshots": {
            title: "实现事件流模拟器 + 回放时间线 + 快照",
          },
          "frontend-v2-query-layer-metrics": {
            title: "实现查询层 + 计算指标",
          },
          "frontend-v2-production-ux-hardening": {
            title: "生产级 UX：缓存、分页、错误横幅、骨架屏与限流",
          },
          "frontend-v2-dashboard-summary-checkpoint": {
            title: "从 fixtures 产出稳定的 看板Summary",
          },
        },
      },
    },
  },
  "defi-solana": {
    title: "Solana 上的 DeFi",
    description: "高级项目课程，聚焦交换系统构建：离线确定性 Jupiter 风格规划、路径排序、minOut 安全与可复现诊断。",
    modules: {
      "defi-v2-module-swap-fundamentals": {
        title: "兑换 基础",
        description: "理解 CPMM 数学、报价结构与确定性路由权衡，并配合安全优先的用户保护机制。",
        lessons: {
          "defi-v2-amm-basics-fees-slippage-impact": {
            title: "Solana AMM 基础：池子、手续费、滑点与价格影响",
          },
          "defi-v2-quote-anatomy-and-risk": {
            title: "报价结构：in/out、手续费、minOut 与最坏情况执行",
          },
          "defi-v2-routing-fragmentation-two-hop": {
            title: "路由：为什么两跳可能优于一跳",
          },
        },
      },
      "defi-v2-module-offline-jupiter-planner": {
        title: "Jupiter 风格 兑换 规划器项目（离线）",
        description: "构建确定性报价、路径选择与 minOut 安全检查，并输出稳定 检查点 工件用于可复现评审。",
        lessons: {
          "defi-v2-quote-cpmm": {
            title: "实现 token/pool 模型 + 常数乘积报价计算",
          },
          "defi-v2-router-best": {
            title: "实现路径枚举与最优路径选择",
          },
          "defi-v2-safety-minout": {
            title: "实现 slippage/minOut、费用拆解与安全不变量",
          },
          "defi-v2-production-swap-ux": {
            title: "生产级 兑换 UX：陈旧报价、保护机制与模拟",
          },
          "defi-v2-checkpoint": {
            title: "产出稳定的 兑换Plan + 兑换Summary 检查点",
          },
        },
      },
    },
  },
  "solana-security": {
    title: "Solana 安全与审计",
    description: "面向 Solana 审计工程师的确定性漏洞实验课程，提供可重复利用的 exploit 证据、精确修复指引与高信噪比审计产物。",
    modules: {
      "security-v2-threat-model-and-method": {
        title: "威胁模型与审计方法",
        description: "以账户为中心的威胁建模、可复现的确定性 exploit 复现流程，以及支撑可信审计结论的证据纪律。",
        lessons: {
          "security-v2-threat-model": {
            title: "面向审计员的 Solana 威胁模型：accounts、所有者、签名者、可写、PDAs",
          },
          "security-v2-evidence-chain": {
            title: "证据链：复现、追踪、影响、修复、验证",
          },
          "security-v2-bug-classes": {
            title: "常见 Solana 漏洞类型与缓解措施",
          },
        },
      },
      "security-v2-vuln-lab": {
        title: "漏洞实验项目路径",
        description: "利用、修复、验证，并产出可审计工件，配合确定性 trace 与不变量驱动的结论。",
        lessons: {
          "security-v2-exploit-signer-owner": {
            title: "Break it: 利用缺失的 签名者 + 所有者 校验",
          },
          "security-v2-exploit-pda-spoof": {
            title: "Break it: 利用 PDA spoof 不匹配",
          },
          "security-v2-patch-validate": {
            title: "Fix it: 校验修复 + 不变量测试套件",
          },
          "security-v2-writing-reports": {
            title: "撰写审计报告：严重性、可能性、影响范围与修复建议",
          },
          "security-v2-audit-report-checkpoint": {
            title: "检查点：确定性 AuditReport JSON + markdown",
          },
        },
      },
    },
  },
  "token-engineering": {
    title: "Solana 代币工程",
    description: "面向真实代币发行团队的项目课程：Token-2022 确定性规划、权限设计、供应模拟与上线运营纪律。",
    modules: {
      "token-v2-module-fundamentals": {
        title: "代币基础 -> Token-2022",
        description: "理解代币原语、mint 策略结构与 Token-2022 扩展控制，并结合明确的治理与威胁模型视角。",
        lessons: {
          "token-v2-spl-vs-token-2022": {
            title: "SPL 代币 vs Token-2022：扩展带来的变化",
          },
          "token-v2-mint-anatomy": {
            title: "Mint 结构：权限、精度、供应、冻结与铸造",
          },
          "token-v2-extension-safety-pitfalls": {
            title: "扩展安全陷阱：费率配置、代理 滥用与默认账户状态",
          },
          "token-v2-validate-config-derive": {
            title: "校验代币配置 + 离线推导确定性地址",
          },
        },
      },
      "token-v2-module-launch-pack": {
        title: "代币上线包项目",
        description: "构建确定性的校验、规划与模拟流程，产出可评审的上线工件与清晰的 通过/不通过 标准。",
        lessons: {
          "token-v2-build-init-plan": {
            title: "构建 Token-2022 初始化指令计划",
          },
          "token-v2-simulate-fees-supply": {
            title: "构建 mint-to + transfer-fee 计算与模拟",
          },
          "token-v2-launch-checklist": {
            title: "上线检查清单：参数、升级/权限策略与 airdrop/测试 计划",
          },
          "token-v2-launch-pack-checkpoint": {
            title: "产出稳定的 LaunchPackSummary",
          },
        },
      },
    },
  },
  "solana-mobile": {
    title: "Solana 移动开发",
    description: "使用 MWA 构建生产级 Solana 移动 dApp：稳健的钱包会话架构、清晰的签名交互与规范化分发运营流程。",
    modules: {
      "module-mobile-wallet-adapter": {
        title: "移动 Wallet Adapter",
        description: "覆盖 MWA 核心协议、会话生命周期控制与弹性的钱包切换交接模式，面向生产级移动应用。",
        lessons: {
          "mobile-wallet-overview": {
            title: "移动钱包概览",
          },
          "mwa-integration": {
            title: "MWA 集成",
          },
          "mobile-transaction": {
            title: "构建移动端交易函数",
          },
        },
      },
      "module-dapp-store-and-distribution": {
        title: "dApp Store 与分发",
        description: "面向 Solana 应用分发的发布流程、运营就绪与以信任为中心的移动 UX 实践。",
        lessons: {
          "dapp-store-submission": {
            title: "dApp Store 提交",
          },
          "mobile-best-practices": {
            title: "移动端最佳实践",
          },
        },
      },
    },
  },
  "solana-testing": {
    title: "Solana 程序测试",
    description: "在本地、模拟与网络环境中构建稳健的 Solana 测试体系，结合显式安全不变量与发布级信心闸门。",
    modules: {
      "module-testing-foundations": {
        title: "测试基础",
        description: "核心测试策略覆盖 unit/integration 分层，采用确定性流程并覆盖对抗性场景。",
        lessons: {
          "testing-approaches": {
            title: "测试方法",
          },
          "bankrun-testing": {
            title: "Bankrun 测试",
          },
          "write-bankrun-test": {
            title: "编写 Counter Program 的 Bankrun 测试",
          },
        },
      },
      "module-advanced-testing": {
        title: "高级测试",
        description: "通过 fuzzing、devnet 验证与 CI/CD 发布控制，让协议变更更安全。",
        lessons: {
          "fuzzing-trident": {
            title: "使用 Trident 进行 Fuzzing",
          },
          "devnet-testing": {
            title: "Devnet 测试",
          },
          "ci-cd-pipeline": {
            title: "Solana 的 CI/CD 流水线",
          },
        },
      },
    },
  },
  "solana-indexing": {
    title: "Solana 索引与分析",
    description: "构建生产级 Solana 事件索引器：确定性解码、弹性数据摄取契约、检查点恢复与可信分析输出。",
    modules: {
      "indexing-v2-foundations": {
        title: "索引基础",
        description: "覆盖事件模型、token 账户解码与交易元数据解析，构建可靠索引流水线。",
        lessons: {
          "indexing-v2-events-model": {
            title: "事件模型：交易、日志与程序指令",
          },
          "indexing-v2-token-decoding": {
            title: "Token 账户解码与 SPL 布局",
          },
          "indexing-v2-decode-token-account": {
            title: "挑战：解码 token 账户 + 对比 token 余额变化",
          },
          "indexing-v2-transaction-meta": {
            title: "交易元数据解析：日志、错误与内部指令",
          },
        },
      },
      "indexing-v2-pipeline": {
        title: "索引流水线与分析",
        description: "交易归一化、分页/检查点、缓存语义与可复现分析聚合。",
        lessons: {
          "indexing-v2-index-transactions": {
            title: "挑战：将交易索引为规范化事件",
          },
          "indexing-v2-pagination-caching": {
            title: "分页、检查点 与缓存语义",
          },
          "indexing-v2-analytics": {
            title: "分析聚合：按钱包与按代币指标",
          },
          "indexing-v2-analytics-checkpoint": {
            title: "检查点：产出稳定 JSON 分析摘要",
          },
        },
      },
    },
  },
  "solana-payments": {
    title: "Solana 支付与结账流程",
    description: "构建生产级 Solana 支付流程：健壮校验、抗重放幂等、安全 webhook 与可对账的确定性回执。",
    modules: {
      "payments-v2-foundations": {
        title: "支付基础",
        description: "覆盖地址校验、幂等策略与 payment intent 设计，构建可靠的结账行为。",
        lessons: {
          "payments-v2-address-validation": {
            title: "地址校验与 memo 策略",
          },
          "payments-v2-idempotency": {
            title: "幂等键与重放保护",
          },
          "payments-v2-payment-intent": {
            title: "挑战：创建带校验的 payment intent",
          },
          "payments-v2-tx-building": {
            title: "交易构建与关键元数据",
          },
        },
      },
      "payments-v2-implementation": {
        title: "实现与验证",
        description: "交易构建、webhook 真实性校验，以及带清晰错误状态处理的确定性回执生成。",
        lessons: {
          "payments-v2-transfer-tx": {
            title: "挑战：构建转账交易",
          },
          "payments-v2-webhooks": {
            title: "Webhook 签名与验证",
          },
          "payments-v2-error-states": {
            title: "错误状态机与回执格式",
          },
          "payments-v2-webhook-receipt": {
            title: "挑战：验证 webhook 并生成回执",
          },
        },
      },
    },
  },
  "solana-nft-compression": {
    title: "NFT 与压缩 NFT 基础",
    description: "掌握 Solana 压缩 NFT 工程：Merkle 承诺、证明系统、集合建模以及生产级安全检查。",
    modules: {
      "cnft-v2-merkle-foundations": {
        title: "Merkle 基础",
        description: "覆盖树构建、叶子哈希、插入机制，以及压缩资产背后的链上/链下承诺模型。",
        lessons: {
          "cnft-v2-merkle-trees": {
            title: "用于状态压缩的 Merkle 树",
          },
          "cnft-v2-leaf-hashing": {
            title: "叶子哈希约定与元数据",
          },
          "cnft-v2-merkle-insert": {
            title: "挑战：实现 Merkle 插入 + 根更新",
          },
          "cnft-v2-proof-generation": {
            title: "证明生成与路径计算",
          },
        },
      },
      "cnft-v2-proof-system": {
        title: "证明系统与安全",
        description: "证明生成与校验、集合完整性，以及针对 replay 与 metadata spoof 的安全加固。",
        lessons: {
          "cnft-v2-proof-verification": {
            title: "挑战：实现证明生成 + 验证器",
          },
          "cnft-v2-collection-minting": {
            title: "集合铸造与元数据模拟",
          },
          "cnft-v2-attack-surface": {
            title: "攻击面：无效证明与重放",
          },
          "cnft-v2-compression-checkpoint": {
            title: "检查点：模拟铸造 + 验证所有权证明",
          },
        },
      },
    },
  },
  "solana-governance-multisig": {
    title: "治理与多签金库运营",
    description: "构建生产可用的 DAO 治理与多签金库系统：确定性投票记账、timelock 安全与可靠执行控制。",
    modules: {
      "governance-v2-governance": {
        title: "DAO 治理",
        description: "涵盖提案生命周期、确定性投票机制、quorum 策略与 timelock 安全，支撑可信 DAO 治理。",
        lessons: {
          "governance-v2-dao-model": {
            title: "DAO 模型：提案、投票与执行",
          },
          "governance-v2-quorum-math": {
            title: "Quorum 计算与投票权重计算",
          },
          "governance-v2-timelocks": {
            title: "Timelock 状态与执行调度",
          },
          "governance-v2-quorum-voting": {
            title: "挑战：实现 quorum/投票状态机",
          },
        },
      },
      "governance-v2-multisig": {
        title: "多签金库",
        description: "多签交易构建、审批控制、抗重放防护与安全金库执行模式。",
        lessons: {
          "governance-v2-multisig": {
            title: "多签交易构建与审批",
          },
          "governance-v2-multisig-builder": {
            title: "挑战：实现多签交易构建器 + 审批规则",
          },
          "governance-v2-safe-defaults": {
            title: "安全默认项：所有者 校验与重放防护",
          },
          "governance-v2-treasury-execution": {
            title: "挑战：执行提案并生成金库差异",
          },
        },
      },
    },
  },
  "solana-performance": {
    title: "Solana 性能与 Compute 优化",
    description: "掌握 Solana 性能工程与可度量优化流程：计算预算、数据布局、编码效率与确定性成本建模。",
    modules: {
      "performance-v2-foundations": {
        title: "性能基础",
        description: "覆盖 compute 模型、账户/数据布局决策与确定性成本估算，支持交易级性能分析。",
        lessons: {
          "performance-v2-compute-model": {
            title: "Compute 模型：预算、成本与限制",
          },
          "performance-v2-account-layout": {
            title: "账户布局设计与序列化成本",
          },
          "performance-v2-cost-model": {
            title: "挑战：实现 estimateCost(op) 模型",
          },
          "performance-v2-instruction-data": {
            title: "指令数据大小与编码优化",
          },
        },
      },
      "performance-v2-optimization": {
        title: "优化与分析",
        description: "布局优化、计算预算 调优，以及带正确性保障的 before/after 性能分析。",
        lessons: {
          "performance-v2-optimized-layout": {
            title: "挑战：实现优化布局/编解码器",
          },
          "performance-v2-compute-budget": {
            title: "Compute budget 指令基础",
          },
          "performance-v2-micro-optimizations": {
            title: "微优化与权衡",
          },
          "performance-v2-perf-checkpoint": {
            title: "检查点：对比 before/after + 输出性能报告",
          },
        },
      },
    },
  },
  "defi-swap-aggregator": {
    title: "DeFi 交换聚合",
    description: "掌握生产级 Solana 交换聚合：确定性报价解析、路径优化权衡、滑点安全与可靠性感知执行。",
    modules: {
      "swap-v2-fundamentals": {
        title: "交换基础",
        description: "代币交换机制、滑点保护、路径组合与确定性 兑换Plan 构建，并透明呈现关键权衡。",
        lessons: {
          "swap-v2-mental-model": {
            title: "交换心智模型：mints、ATAs、精度与路径",
          },
          "swap-v2-slippage": {
            title: "滑点与价格影响：保护交换结果",
          },
          "swap-v2-route-explorer": {
            title: "路径可视化：理解交换分段与手续费",
          },
          "swap-v2-swap-plan": {
            title: "挑战：从报价构建规范化 兑换Plan",
          },
        },
      },
      "swap-v2-execution": {
        title: "执行与可靠性",
        description: "状态机执行、交易结构、retry/staleness 可靠性模式与高信号交换运行报告。",
        lessons: {
          "swap-v2-state-machine": {
            title: "挑战：实现交换 UI 状态机",
          },
          "swap-v2-tx-anatomy": {
            title: "交换交易结构：指令、账户与 compute",
          },
          "swap-v2-reliability": {
            title: "可靠性模式：重试、陈旧报价与延迟",
          },
          "swap-v2-swap-report": {
            title: "检查点：生成 兑换Run报告",
          },
        },
      },
    },
  },
  "defi-clmm-liquidity": {
    title: "CLMM 流动性工程",
    description: "掌握 Solana DEX 集中流动性工程：tick 数学、区间策略设计、手续费/无常损失动态与 LP 仓位确定性报告。",
    modules: {
      "clmm-v2-fundamentals": {
        title: "CLMM 基础",
        description: "集中流动性概念、tick/价格数学与区间仓位行为，帮助你理解 CLMM 执行逻辑。",
        lessons: {
          "clmm-v2-vs-cpmm": {
            title: "CLMM vs 常数乘积：为什么需要 tick",
          },
          "clmm-v2-price-tick": {
            title: "价格、tick 与 sqrtPrice：核心转换",
          },
          "clmm-v2-range-explorer": {
            title: "区间仓位：in-range 与 out-of-range 动态",
          },
          "clmm-v2-tick-math": {
            title: "挑战：实现 tick/价格转换工具函数",
          },
        },
      },
      "clmm-v2-positions": {
        title: "仓位与风险",
        description: "手续费累积模拟、区间策略权衡、精度陷阱以及确定性仓位风险报告。",
        lessons: {
          "clmm-v2-position-fees": {
            title: "挑战：模拟仓位手续费累积",
          },
          "clmm-v2-range-strategy": {
            title: "区间策略：窄区间、宽区间与再平衡规则",
          },
          "clmm-v2-risk-review": {
            title: "CLMM 风险：舍入、溢出与 tick spacing 错误",
          },
          "clmm-v2-position-report": {
            title: "检查点：生成仓位报告",
          },
        },
      },
    },
  },
  "defi-lending-risk": {
    title: "借贷与清算风险",
    description: "掌握 Solana 借贷风险工程：利用率与利率机制、清算路径分析、预言机安全与确定性场景报告。",
    modules: {
      "lending-v2-fundamentals": {
        title: "借贷基础",
        description: "借贷池机制、由利用率驱动的利率模型，以及开展可辩护风险分析所需的 health factor 基础。",
        lessons: {
          "lending-v2-pool-model": {
            title: "借贷池模型：supply、borrow 与利用率",
          },
          "lending-v2-interest-curves": {
            title: "利率曲线与 kink 模型",
          },
          "lending-v2-health-explorer": {
            title: "health factor 监控与清算预览",
          },
          "lending-v2-interest-rates": {
            title: "挑战：计算基于利用率的利率",
          },
        },
      },
      "lending-v2-risk-management": {
        title: "风险管理",
        description: "health factor 计算、清算机制、预言机故障处理，以及面向压力市场的多场景风险报告。",
        lessons: {
          "lending-v2-health-factor": {
            title: "挑战：计算 health factor 与清算状态",
          },
          "lending-v2-liquidation-mechanics": {
            title: "清算机制：奖励、close factor 与坏账",
          },
          "lending-v2-oracle-risk": {
            title: "借贷中的预言机风险与陈旧价格",
          },
          "lending-v2-risk-report": {
            title: "检查点：生成多场景风险报告",
          },
        },
      },
    },
  },
  "defi-perps-risk-console": {
    title: "永续风险控制台",
    description: "掌握 Solana 永续风险工程：精确 PnL/资金费率记账、保证金安全监控、清算模拟与确定性控制台报告。",
    modules: {
      "perps-v2-fundamentals": {
        title: "永续 基础",
        description: "永续合约机制、资金费率累积逻辑与 PnL 建模基础，用于准确的仓位诊断。",
        lessons: {
          "perps-v2-mental-model": {
            title: "永续合约：基础仓位、开仓价格与标记价 vs 预言机价",
          },
          "perps-v2-funding": {
            title: "资金费率：为何存在以及如何累积",
          },
          "perps-v2-pnl-explorer": {
            title: "PnL 可视化：跟踪利润随时间变化",
          },
          "perps-v2-pnl-calc": {
            title: "挑战：计算永续合约 PnL",
          },
          "perps-v2-funding-accrual": {
            title: "挑战：模拟资金费率累积",
          },
        },
      },
      "perps-v2-risk": {
        title: "风险与监控",
        description: "保证金与清算监控、常见实现陷阱，以及面向生产可观测性的确定性风险控制台输出。",
        lessons: {
          "perps-v2-margin-liquidation": {
            title: "保证金率与清算阈值",
          },
          "perps-v2-common-bugs": {
            title: "常见错误：符号错误、单位与资金费率方向",
          },
          "perps-v2-risk-console-report": {
            title: "检查点：生成风险控制台报告",
          },
        },
      },
    },
  },
  "defi-tx-optimizer": {
    title: "DeFi 交易优化器",
    description: "掌握 Solana DeFi 交易优化：compute/fee 调优、ALT 策略、可靠性模式与确定性发送策略规划。",
    modules: {
      "txopt-v2-fundamentals": {
        title: "交易基础",
        description: "覆盖交易失败诊断、计算预算 机制、priority fee 策略与费用估算基础。",
        lessons: {
          "txopt-v2-why-fail": {
            title: "DeFi 交易为何失败：CU 限制、大小与 blockhash 过期",
          },
          "txopt-v2-compute-budget": {
            title: "Compute budget 指令与 priority fee 策略",
          },
          "txopt-v2-cost-explorer": {
            title: "交易成本估算与费用规划",
          },
          "txopt-v2-tx-plan": {
            title: "挑战：构建带 计算预算ing 的交易计划",
          },
        },
      },
      "txopt-v2-optimization": {
        title: "优化与策略",
        description: "Address Lookup Table 规划、可靠性/重试模式、可执行错误 UX 与完整发送策略报告。",
        lessons: {
          "txopt-v2-lut-planner": {
            title: "挑战：规划 Address Lookup Table 使用",
          },
          "txopt-v2-reliability": {
            title: "可靠性模式：retry、re-quote、resend vs re构建",
          },
          "txopt-v2-ux-errors": {
            title: "UX：面向交易失败的可执行错误信息",
          },
          "txopt-v2-send-strategy": {
            title: "检查点：生成发送策略报告",
          },
        },
      },
    },
  },
  "solana-mobile-signing": {
    title: "Solana 移动签名",
    description: "掌握生产级移动钱包签名：Android MWA 会话、iOS 深链限制、弹性重试与确定性会话遥测。",
    modules: {
      "mobilesign-v2-fundamentals": {
        title: "移动签名基础",
        description: "平台约束、连接 UX 模式、签名会话时间线行为，以及 Android/iOS 的类型化请求构建。",
        lessons: {
          "mobilesign-v2-reality-check": {
            title: "移动签名现实检查：Android 与 iOS 约束",
          },
          "mobilesign-v2-connection-ux": {
            title: "钱包连接 UX 模式：connect、reconnect 与恢复",
          },
          "mobilesign-v2-timeline-explorer": {
            title: "签名会话时间线：request、钱包 与 response 流程",
          },
          "mobilesign-v2-sign-request": {
            title: "挑战：构建类型化签名请求",
          },
        },
      },
      "mobilesign-v2-production": {
        title: "生产模式",
        description: "会话持久化、交易审阅安全、重试状态机与生产移动应用的确定性会话报告。",
        lessons: {
          "mobilesign-v2-session-persist": {
            title: "挑战：会话持久化与恢复",
          },
          "mobilesign-v2-review-screens": {
            title: "移动交易审阅：用户必须看到什么",
          },
          "mobilesign-v2-retry-patterns": {
            title: "一键重试：处理离线、rejected 与 timeout 状态",
          },
          "mobilesign-v2-session-report": {
            title: "检查点：生成会话报告",
          },
        },
      },
    },
  },
  "solana-pay-commerce": {
    title: "Solana Pay 商业集成",
    description: "掌握 Solana Pay 商业集成：稳健 URL 编码、二维码/支付跟踪流程、确认交互体验与确定性 POS 对账产物。",
    modules: {
      "solanapay-v2-foundations": {
        title: "Solana Pay 基础",
        description: "覆盖 Solana Pay 规范、URL 编码严谨性、转账请求结构，以及确定性的构建器/编码器模式。",
        lessons: {
          "solanapay-v2-mental-model": {
            title: "Solana Pay 心智模型与 URL 编码规则",
          },
          "solanapay-v2-transfer-anatomy": {
            title: "转账请求结构：recipient、amount、reference 与 labels",
          },
          "solanapay-v2-url-explorer": {
            title: "URL 构建器：Solana Pay URL 实时预览",
          },
          "solanapay-v2-encode-transfer": {
            title: "挑战：编码一个 Solana Pay 转账请求 URL",
          },
        },
      },
      "solanapay-v2-implementation": {
        title: "跟踪与商业实战",
        description: "reference 跟踪状态机、确认交互体验、故障处理，以及确定性的 POS 收据生成。",
        lessons: {
          "solanapay-v2-reference-tracker": {
            title: "挑战：按确认状态跟踪支付 reference",
          },
          "solanapay-v2-confirmation-ux": {
            title: "确认 UX：pending、confirmed 与 expired 状态",
          },
          "solanapay-v2-error-handling": {
            title: "支付流程中的错误处理与边界场景",
          },
          "solanapay-v2-pos-receipt": {
            title: "检查点：生成 POS 收据",
          },
        },
      },
    },
  },
  "wallet-ux-engineering": {
    title: "钱包 UX 工程",
    description: "掌握生产级 Solana 钱包 UX 工程：确定性连接状态、网络安全、RPC 弹性与可度量可靠性模式。",
    modules: {
      "walletux-v2-fundamentals": {
        title: "连接基础",
        description: "覆盖钱包连接设计、网络门控与确定性状态机架构，保障可预测的 onboarding 与重连路径。",
        lessons: {
          "walletux-v2-connection-design": {
            title: "不掉链子的连接 UX：设计检查清单",
          },
          "walletux-v2-network-gating": {
            title: "网络门控与错误网络恢复",
          },
          "walletux-v2-state-explorer": {
            title: "连接状态机：状态、事件与转换",
          },
          "walletux-v2-connection-state": {
            title: "挑战：实现钱包连接状态机",
          },
        },
      },
      "walletux-v2-production": {
        title: "生产模式",
        description: "缓存失效、RPC 弹性与健康监控，以及可度量的钱包 UX 质量报告，面向生产运维。",
        lessons: {
          "walletux-v2-cache-invalidation": {
            title: "挑战：钱包事件触发的缓存失效",
          },
          "walletux-v2-rpc-caching": {
            title: "钱包应用的 RPC 读取与缓存策略",
          },
          "walletux-v2-rpc-health": {
            title: "RPC 健康监控与优雅降级",
          },
          "walletux-v2-ux-report": {
            title: "检查点：生成 钱包 UX 报告",
          },
        },
      },
    },
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description: "掌握生产级 SIWS 认证：标准化输入、严格验证不变量、抗重放 nonce 生命周期与可审计报告。",
    modules: {
      "siws-v2-fundamentals": {
        title: "SIWS 基础",
        description: "讲清 SIWS 的必要性、输入字段严格语义、钱包渲染行为与确定性的登录输入构建。",
        lessons: {
          "siws-v2-why-exists": {
            title: "SIWS 为何存在：替代 connect-and-signMessage",
          },
          "siws-v2-input-fields": {
            title: "SIWS 输入字段与安全规则",
          },
          "siws-v2-message-preview": {
            title: "消息预览：钱包如何渲染 SIWS 请求",
          },
          "siws-v2-sign-in-input": {
            title: "挑战：构建带校验的 SIWS 登录输入",
          },
        },
      },
      "siws-v2-verification": {
        title: "验证与安全",
        description: "服务端验证不变量、nonce 抗重放防护、会话管理与确定性认证审计报告。",
        lessons: {
          "siws-v2-verify-sign-in": {
            title: "挑战：验证 SIWS 登录响应",
          },
          "siws-v2-sessions": {
            title: "会话与退出：该存什么与不该存什么",
          },
          "siws-v2-replay-protection": {
            title: "重放防护与 nonce 注册表设计",
          },
          "siws-v2-auth-report": {
            title: "检查点：生成认证审计报告",
          },
        },
      },
    },
  },
  "priority-fees-compute-budget": {
    title: "优先费用 与 计算预算",
    description: "面向防御的 Solana 费用工程：确定性 compute 规划、自适应优先级策略与面向确认结果的 UX 可靠性约束。",
    modules: {
      "pfcb-v2-foundations": {
        title: "Fee 与 Compute 基础",
        description: "覆盖纳入机制、compute/fee 耦合，以及基于 explorer 的策略设计与确定性可靠性框架。",
        lessons: {
          "pfcb-v2-fee-market-reality": {
            title: "Solana 费率市场现实：真正影响纳入的因素",
          },
          "pfcb-v2-compute-budget-failure-modes": {
            title: "Compute budget 基础与常见失败模式",
          },
          "pfcb-v2-planner-explorer": {
            title: "Explorer：从 计算预算 规划输入到执行计划",
          },
          "pfcb-v2-plan-compute-budget": {
            title: "挑战：实现 planComputeBudget()",
          },
        },
      },
      "pfcb-v2-project-journey": {
        title: "Fee 优化器 项目路径",
        description: "实现确定性规划器、确认策略引擎与稳定费率策略工件，支持发布评审。",
        lessons: {
          "pfcb-v2-estimate-priority-fee": {
            title: "挑战：实现 estimatePriorityFee()",
          },
          "pfcb-v2-confirmation-ux-policy": {
            title: "挑战：确认级别决策引擎",
          },
          "pfcb-v2-fee-plan-summary-markdown": {
            title: "挑战：构建 feePlan摘要 markdown",
          },
          "pfcb-v2-fee-optimizer-checkpoint": {
            title: "检查点：Fee 优化器 报告",
          },
        },
      },
    },
  },
  "bundles-atomicity": {
    title: "批次 与交易原子性",
    description: "设计防御型 Solana 多交易流程：确定性原子性校验、补偿建模与可审计安全报告。",
    modules: {
      "bundles-v2-atomicity-foundations": {
        title: "原子性基础",
        description: "覆盖原子性模型、多交易流程风险与防御性安全校验，保护用户对执行结果的预期。",
        lessons: {
          "bundles-v2-atomicity-model": {
            title: "原子性概念与用户为何默认全有或全无",
          },
          "bundles-v2-flow-risk-points": {
            title: "多交易流程：approvals、ATA 创建、swaps 与 refunds",
          },
          "bundles-v2-flow-explorer": {
            title: "Explorer：流程图步骤与风险点",
          },
          "bundles-v2-build-atomic-flow": {
            title: "挑战：实现 构建AtomicFlow()",
          },
        },
      },
      "bundles-v2-project-journey": {
        title: "原子交换流程模拟器项目",
        description: "实现确定性原子性校验器、失败处理模式与稳定 bundle 组合，用于发布评审。",
        lessons: {
          "bundles-v2-validate-atomicity": {
            title: "挑战：实现 validate原子性()",
          },
          "bundles-v2-failure-handling-patterns": {
            title: "挑战：使用幂等键处理失败",
          },
          "bundles-v2-bundle-composer": {
            title: "挑战：确定性 bundle 组合器",
          },
          "bundles-v2-flow-safety-report": {
            title: "检查点：流程安全报告",
          },
        },
      },
    },
  },
  "mempool-ux-defense": {
    title: "内存池 现实与反夹子 UX",
    description: "防御型交换 UX 工程：确定性风险分级、有界滑点策略与面向事故响应的安全沟通。",
    modules: {
      "mempoolux-v2-foundations": {
        title: "内存池 现实与 UX 防御",
        description: "覆盖报价到执行之间的风险、滑点护栏与报价新鲜度决策，构建更安全的生产级交换流程。",
        lessons: {
          "mempoolux-v2-quote-execution-gap": {
            title: "报价与执行之间可能出错的环节",
          },
          "mempoolux-v2-slippage-guardrails": {
            title: "滑点控制与护栏",
          },
          "mempoolux-v2-freshness-explorer": {
            title: "Explorer：报价新鲜度计时器与决策表",
          },
          "mempoolux-v2-evaluate-swap-risk": {
            title: "挑战：实现 evaluateSwapRisk()",
          },
        },
      },
      "mempoolux-v2-project-journey": {
        title: "受保护交换 UI 项目路径",
        description: "实现滑点保护、影响模型与可导出保护配置，并保证输出确定性。",
        lessons: {
          "mempoolux-v2-slippage-guard": {
            title: "挑战：实现 slippageGuard()",
          },
          "mempoolux-v2-impact-vs-slippage": {
            title: "挑战：建模价格影响与滑点",
          },
          "mempoolux-v2-swap-safety-banner": {
            title: "挑战：构建 swapSafetyBanner()",
          },
          "mempoolux-v2-protection-config-export": {
            title: "检查点：交换保护配置导出",
          },
        },
      },
    },
  },
  "indexing-webhooks-pipelines": {
    title: "索引器、Webhook 与抗重组流水线",
    description: "构建生产级确定性索引流水线，实现防重复摄取、链重组处理与完整性优先报告。",
    modules: {
      "indexpipe-v2-foundations": {
        title: "索引器可靠性基础",
        description: "讲解索引基础、重组/确认现实与流水线阶段，保障可追踪且安全的数据摄取。",
        lessons: {
          "indexpipe-v2-indexing-basics": {
            title: "索引 101：日志、账户与交易解析",
          },
          "indexpipe-v2-reorg-confirmation-reality": {
            title: "重组与分叉选择：为何 confirmed 不等于 finalized",
          },
          "indexpipe-v2-pipeline-explorer": {
            title: "Explorer：从 ingest 到 dedupe 到 confirm 到 apply",
          },
          "indexpipe-v2-dedupe-events": {
            title: "挑战：实现 dedupeEvents()",
          },
        },
      },
      "indexpipe-v2-project-journey": {
        title: "抗重组索引器项目路径",
        description: "实现确认逻辑、backfill/幂等规划与完整性检查，生成稳定流水线报告。",
        lessons: {
          "indexpipe-v2-apply-confirmations": {
            title: "挑战：实现 applyWithConfirmations()",
          },
          "indexpipe-v2-backfill-idempotency": {
            title: "挑战：backfill 与幂等规划",
          },
          "indexpipe-v2-snapshot-integrity": {
            title: "挑战：快照完整性检查",
          },
          "indexpipe-v2-pipeline-report-checkpoint": {
            title: "检查点：导出流水线报告",
          },
        },
      },
    },
  },
  "rpc-reliability-latency": {
    title: "RPC 可靠性与延迟工程",
    description: "构建生产级多提供商 Solana RPC 客户端，采用确定性重试、路由、缓存与可观测性策略。",
    modules: {
      "rpc-v2-foundations": {
        "title": "RPC Reliability Foundations",
        "description": "Real-world RPC failure behavior, endpoint selection strategy, 和 deterministic retry policy modeling.",
        "lessons": {
          "rpc-v2-failure-landscape": {
            "title": "RPC failures in real life: timeouts, 429s, stale nodes",
          },
          "rpc-v2-multi-endpoint-strategies": {
            "title": "Multi-endpoint strategies: hedged requests 和 fallbacks",
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
        "description": "Build deterministic policy engines 用于 routing, retries, metrics reduction, 和 health report exports.",
        "lessons": {
          "rpc-v2-select-endpoint": {
            "title": "Challenge: implement selectRpcEndpoint()",
          },
          "rpc-v2-cache-invalidation-policy": {
            "title": "Challenge: caching 和 invalidation policy",
          },
          "rpc-v2-metrics-reducer": {
            "title": "Challenge: metrics reducer 和 histogram buckets",
          },
          "rpc-v2-health-report-checkpoint": {
            "title": "Checkpoint: RPC health report export",
          },
        },
      },
    },
  },
  "rust-data-layout-borsh": {
    title: "Rust 数据布局与 Borsh 精通",
    description: "Rust-first 的 Solana 数据布局工程：确定性字节级工具链与兼容性安全的 schema 实践。",
    modules: {
      "rdb-v2-foundations": {
        "title": "Data Layout Foundations",
        "description": "Alignment behavior, Borsh encoding rules, 和 实战 parsing safety 用于 stable byte-level contracts.",
        "lessons": {
          "rdb-v2-layout-alignment-padding": {
            "title": "Memory layout: alignment, padding, 和 why Solana 账户 care",
          },
          "rdb-v2-borsh-enums-vectors-strings": {
            "title": "Struct 和 enum layout pitfalls plus Borsh rules",
          },
          "rdb-v2-layout-visualizer": {
            "title": "Explorer: layout visualizer 用于 field offsets",
          },
          "rdb-v2-compute-layout": {
            "title": "Challenge: implement computeLayout()",
          },
        },
      },
      "rdb-v2-project-journey": {
        "title": "账户 Layout Inspector Project Journey",
        "description": "Implement deterministic layout analysis, encoding/decoding, safe parsing, 和 compatibility-focused reporting helpers.",
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
    title: "Rust 错误设计与不变量",
    description: "构建类型化不变量守卫库，产出确定性证据工件，并建立兼容性安全的错误契约与审计级报告。",
    modules: {
      "rei-v2-foundations": {
        "title": "Rust Error 和 Invariant Foundations",
        "description": "Typed error taxonomy, Result/context propagation patterns, 和 deterministic invariant 设计 fundamentals.",
        "lessons": {
          "rei-v2-error-taxonomy": {
            "title": "Error taxonomy: recoverable vs fatal",
          },
          "rei-v2-result-context-patterns": {
            "title": "Result<T, E> patterns, ? operator, 和 context",
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
        "description": "Implement guard helpers, evidence-chain generation, 和 stable audit reporting 用于 reliability 和 incident response.",
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
    title: "面向链上思维的 Rust 性能",
    description: "使用确定性 Rust-first 工具链模拟并优化 compute 成本行为，并以预算驱动性能治理。",
    modules: {
      "rpot-v2-foundations": {
        "title": "性能 Foundations",
        "description": "Rust 性能 思维模型s, data-structure tradeoffs, 和 deterministic cost reasoning 用于 reliable optimization decisions.",
        "lessons": {
          "rpot-v2-perf-mental-model": {
            "title": "性能 思维模型: allocations, clones, hashing",
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
        "description": "Build deterministic profilers, recommendation engines, 和 report outputs aligned to explicit 性能 budgets.",
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
    title: "面向索引器的并发与异步（Rust）",
    description: "Rust-first 异步流水线工程：有界并发、可抗重放 reducer 与确定性运维报告。",
    modules: {
      "raip-v2-foundations": {
        "title": "Async Pipeline Foundations",
        "description": "Async/concurrency fundamentals, backpressure behavior, 和 deterministic execution modeling 用于 indexer reliability.",
        "lessons": {
          "raip-v2-async-fundamentals": {
            "title": "Async fundamentals: futures, tasks, channels",
          },
          "raip-v2-backpressure-concurrency": {
            "title": "Concurrency limits 和 backpressure",
          },
          "raip-v2-pipeline-graph-explorer": {
            "title": "Explorer: pipeline graph 和 concurrency",
          },
        },
      },
      "raip-v2-project-journey": {
        "title": "Reorg-safe Async Pipeline Project Journey",
        "description": "Implement deterministic scheduling, retries, dedupe/reducer stages, 和 report exports 用于 reorg-safe pipeline operations.",
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
    title: "用于安全的过程宏与代码生成",
    description: "通过确定性解析器与检查生成工具学习 Rust 宏/代码生成安全，并输出审计友好的结果。",
    modules: {
      "rpmcs-v2-foundations": {
        "title": "Macro 和 Codegen Foundations",
        "description": "Macro 思维模型s, constraint DSL 设计, 和 safety-driven code generation fundamentals.",
        "lessons": {
          "rpmcs-v2-macro-mental-model": {
            "title": "Macro 思维模型: declarative vs procedural",
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
        "title": "账户 Constraint Codegen (Sim)",
        "description": "Parse DSL constraints, generate checks, run deterministic evaluations, 和 publish stable safety reports.",
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
    title: "Anchor 升级与账户迁移",
    description: "设计生产安全的 Anchor 发布流程：确定性迁移规划、升级闸门、回滚手册与就绪性证据。",
    modules: {
      "aum-v2-module-1": {
        "title": "Upgrade Foundations",
        "description": "Authority lifecycle, 账户 versioning strategy, 和 deterministic upgrade risk modeling 用于 Anchor releases.",
        "lessons": {
          "aum-v2-upgrade-authority-lifecycle": {
            "title": "Upgrade authority lifecycle in Anchor programs",
          },
          "aum-v2-account-versioning-and-migrations": {
            "title": "账户 versioning 和 migration strategy",
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
        "description": "Safety validation gates, rollback planning, 和 deterministic readiness artifacts 用于 controlled migration execution.",
        "lessons": {
          "aum-v2-validate-upgrade-safety": {
            "title": "Challenge: implement upgrade safety gate checks",
          },
          "aum-v2-rollback-and-incident-playbooks": {
            "title": "Rollback strategy 和 incident playbooks",
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
    title: "Solana 可靠性工程",
    description: "面向生产的 Solana 可靠性工程：容错、重试、截止时间、断路器与优雅降级，并具备可度量运维结果。",
    modules: {
      "mod-10-1": {
        "title": "Fault Tolerance Patterns",
        "description": "Implement fault-tolerance building blocks 使用 clear failure classification, retry boundaries, 和 deterministic recovery behavior.",
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
        "description": "Build resilience mechanisms (circuit breakers, bulkheads, 和 rate controls) that protect core user flows during provider instability.",
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
    title: "Solana 测试策略",
    description: "面向生产的完整 Solana 测试策略：确定性单元测试、真实集成测试、fuzz/property 测试 与发布信心报告。",
    modules: {
      "mod-11-1": {
        "title": "Unit 和 Integration 测试",
        "description": "Build deterministic unit 和 integration 测试 layers 使用 clear ownership of invariants, fixtures, 和 failure diagnostics.",
        "lessons": {
          "lesson-11-1-1": {
            "title": "测试 Fundamentals",
          },
          "lesson-11-1-2": {
            "title": "Test Assertion Framework Challenge",
          },
          "lesson-11-1-3": {
            "title": "Mock 账户 Generator Challenge",
          },
          "lesson-11-1-4": {
            "title": "Test Scenario Builder Challenge",
          },
        },
      },
      "mod-11-2": {
        "title": "高级 测试 Techniques",
        "description": "Use fuzzing, property-based tests, 和 mutation-style checks to expose edge-case failures before release.",
        "lessons": {
          "lesson-11-2-1": {
            "title": "Fuzzing 和 Property 测试",
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
    title: "Solana 程序优化",
    description: "构建生产级 Solana 性能：compute 预算、账户布局效率、内存/rent 权衡与确定性优化流程。",
    modules: {
      "mod-12-1": {
        "title": "Compute Unit Optimization",
        "description": "Optimize compute-heavy paths 使用 explicit CU budgets, operation-level profiling, 和 predictable 性能 tradeoffs.",
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
        "title": "Memory 和 Storage Optimization",
        "description": "设计 memory/storage-efficient 账户 layouts 使用 rent-aware sizing, serialization discipline, 和 safe migration planning.",
        "lessons": {
          "lesson-12-2-1": {
            "title": "账户 Data Optimization",
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
    title: "Solana 代币经济设计",
    description: "设计稳健的 Solana 代币经济：分发纪律、vesting 安全、staking 激励与可运营辩护的治理机制。",
    modules: {
      "mod-13-1": {
        "title": "Token Distribution 和 Vesting",
        "description": "Model token allocation 和 vesting systems 使用 explicit fairness, unlock predictability, 和 deterministic accounting rules.",
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
        "title": "Staking 和 治理",
        "description": "设计 staking 和 治理 mechanics 使用 clear incentive alignment, anti-manipulation constraints, 和 measurable participation health.",
        "lessons": {
          "lesson-13-2-1": {
            "title": "Staking 和 治理 设计",
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
    title: "Solana DeFi 原语",
    description: "构建实用的 Solana DeFi 基础：AMM 机制、流动性记账、借贷原语与抗闪电贷的安全组合模式。",
    modules: {
      "mod-14-1": {
        "title": "AMM 和 Liquidity",
        "description": "Implement AMM 和 liquidity primitives 使用 deterministic math, slippage-aware outputs, 和 LP accounting correctness.",
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
        "title": "Lending 和 Flash Loans",
        "description": "Model lending 和 flash-loan flows 使用 collateral safety, utilization-aware pricing, 和 strict repayment invariants.",
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
            "title": "Flash Loan 验证者 Challenge",
          },
        },
      },
    },
  },
  "solana-nft-standards": {
    title: "Solana NFT 标准",
    description: "以生产级标准实现 Solana NFT：元数据完整性、集合治理纪律以及高级可编程/不可转移行为。",
    modules: {
      "mod-15-1": {
        "title": "NFT Fundamentals",
        "description": "Build core NFT functionality 使用 standards-compliant metadata, collection verification, 和 deterministic asset-state handling.",
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
        "title": "高级 NFT Features",
        "description": "Implement 高级 NFT behaviors (soulbound 和 programmable flows) 使用 explicit policy controls 和 safe update semantics.",
        "lessons": {
          "lesson-15-2-1": {
            "title": "Soulbound 和 Programmable NFTs",
          },
          "lesson-15-2-2": {
            "title": "Soulbound Token 验证者 Challenge",
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
    title: "跨程序调用模式（CPI）",
    description: "掌握 Solana 上的 CPI 组合：安全账户校验、PDA signer 纪律与确定性的多程序编排模式。",
  },
  "solana-mev-strategies": {
    title: "MEV 与交易排序",
    description: "面向生产的 Solana 交易排序工程：MEV 感知路由、bundle 策略、清算/套利建模以及保护用户的执行控制。",
  },
  "solana-deployment-cicd": {
    title: "程序部署与 CI/CD",
    description: "面向 Solana 程序的生产部署工程：环境策略、发布闸门、CI/CD 质量控制与升级安全的运维流程。",
  },
  "solana-cross-chain-bridges": {
    title: "跨链桥与 Wormhole",
    description: "使用 Wormhole 风格消息机制构建更安全的 Solana 跨链集成：attestation 验证与桥状态确定性控制。",
  },
  "solana-oracle-pyth": {
    title: "预言机集成与 Pyth 网络",
    description: "安全集成 Solana 预言机数据源：价格校验、置信度/陈旧性策略与多源聚合，支持更稳健的协议决策。",
  },
  "solana-dao-tooling": {
    title: "DAO 工具链与自治组织",
    description: "构建生产级 Solana DAO 系统：提案治理、投票完整性、金库控制与确定性执行/报告流程。",
  },
  "solana-gaming": {
    title: "游戏与游戏状态管理",
    description: "构建生产级 Solana 链上游戏系统：高效状态模型、回合完整性、公平性控制与可扩展的玩家成长经济。",
  },
  "solana-permanent-storage": {
    title: "永久存储与 Arweave",
    description: "通过 Arweave 风格流程将永久去中心化存储与 Solana 集成：内容寻址、manifest 完整性与可验证的长期数据访问。",
  },
  "solana-staking-economics": {
    title: "质押与验证者经济学",
    description: "理解 Solana 质押与验证者经济学以支持真实决策：委托策略、奖励动态、佣金影响与运营可持续性。",
  },
  "solana-account-abstraction": {
    title: "账户抽象与智能钱包",
    description: "在 Solana 上实现智能钱包/账户抽象模式：可编程授权、恢复控制与策略驱动的交易验证。",
  },
  "solana-pda-mastery": {
    title: "Program Derived Address 高阶实践",
    description: "掌握 Solana 高阶 PDA 工程：seed schema 设计、bump 管理纪律与生产级安全跨程序 PDA 使用。",
  },
  "solana-economics": {
    title: "Solana 经济学与代币流动",
    description: "在生产语境下分析 Solana 经济动态：通胀与 fee-burn 作用关系、质押流动、供应变化与协议可持续性权衡。",
  },
};

export const zhCnCourseTranslations: CourseTranslationMap = zhCnCuratedCourseTranslations;
