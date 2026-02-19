import type { CourseTranslationMap } from "./types";

const zhCnCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Solana 基础",
    description:
      "面向生产实践的入门课程，帮助初学者建立清晰的 Solana 心智模型、强化交易调试能力，并形成可复现的钱包管理工作流。",
  },
  "anchor-development": {
    title: "Anchor 开发",
    description:
      "项目制课程，带你从基础走向真实 Anchor 工程：确定性账户建模、指令构建、测试纪律与可靠的客户端体验。",
  },
  "solana-frontend": {
    title: "Solana 前端开发",
    description:
      "面向前端工程师的项目制课程，打造可用于生产的 Solana 仪表盘：确定性 reducer、可回放事件流水线与可信的交易体验。",
  },
  "defi-solana": {
    title: "Solana 上的 DeFi",
    description:
      "高级项目课程，聚焦交换系统构建：离线确定性 Jupiter 风格规划、路径排序、minOut 安全与可复现诊断。",
  },
  "solana-security": {
    title: "Solana 安全与审计",
    description:
      "面向 Solana 审计工程师的确定性漏洞实验课程，提供可重复利用的 exploit 证据、精确修复指引与高信噪比审计产物。",
  },
  "token-engineering": {
    title: "Solana 代币工程",
    description:
      "面向真实代币发行团队的项目课程：Token-2022 确定性规划、权限设计、供应模拟与上线运营纪律。",
  },
  "solana-mobile": {
    title: "Solana 移动开发",
    description:
      "使用 MWA 构建生产级 Solana 移动 dApp：稳健的钱包会话架构、清晰的签名交互与规范化分发运营流程。",
  },
  "solana-testing": {
    title: "Solana 程序测试",
    description:
      "在本地、模拟与网络环境中构建稳健的 Solana 测试体系，结合显式安全不变量与发布级信心闸门。",
  },
  "solana-indexing": {
    title: "Solana 索引与分析",
    description:
      "构建生产级 Solana 事件索引器：确定性解码、弹性数据摄取契约、检查点恢复与可信分析输出。",
  },
  "solana-payments": {
    title: "Solana 支付与结账流程",
    description:
      "构建生产级 Solana 支付流程：健壮校验、抗重放幂等、安全 webhook 与可对账的确定性回执。",
  },
  "solana-nft-compression": {
    title: "NFT 与压缩 NFT 基础",
    description:
      "掌握 Solana 压缩 NFT 工程：Merkle 承诺、证明系统、集合建模以及生产级安全检查。",
  },
  "solana-governance-multisig": {
    title: "治理与多签金库运营",
    description:
      "构建生产可用的 DAO 治理与多签金库系统：确定性投票记账、timelock 安全与可靠执行控制。",
  },
  "solana-performance": {
    title: "Solana 性能与 Compute 优化",
    description:
      "掌握 Solana 性能工程与可度量优化流程：compute budget、数据布局、编码效率与确定性成本建模。",
  },
  "defi-swap-aggregator": {
    title: "DeFi 交换聚合",
    description:
      "掌握生产级 Solana 交换聚合：确定性报价解析、路径优化权衡、滑点安全与可靠性感知执行。",
  },
  "defi-clmm-liquidity": {
    title: "CLMM 流动性工程",
    description:
      "掌握 Solana DEX 集中流动性工程：tick 数学、区间策略设计、手续费/无常损失动态与 LP 仓位确定性报告。",
  },
  "defi-lending-risk": {
    title: "借贷与清算风险",
    description:
      "掌握 Solana 借贷风险工程：利用率与利率机制、清算路径分析、预言机安全与确定性场景报告。",
  },
  "defi-perps-risk-console": {
    title: "永续风险控制台",
    description:
      "掌握 Solana 永续风险工程：精确 PnL/资金费率记账、保证金安全监控、清算模拟与确定性控制台报告。",
  },
  "defi-tx-optimizer": {
    title: "DeFi 交易优化器",
    description:
      "掌握 Solana DeFi 交易优化：compute/fee 调优、ALT 策略、可靠性模式与确定性发送策略规划。",
  },
  "solana-mobile-signing": {
    title: "Solana 移动签名",
    description:
      "掌握生产级移动钱包签名：Android MWA 会话、iOS 深链限制、弹性重试与确定性会话遥测。",
  },
  "solana-pay-commerce": {
    title: "Solana Pay 商业集成",
    description:
      "掌握 Solana Pay 商业集成：稳健 URL 编码、二维码/支付跟踪流程、确认交互体验与确定性 POS 对账产物。",
  },
  "wallet-ux-engineering": {
    title: "钱包 UX 工程",
    description:
      "掌握生产级 Solana 钱包 UX 工程：确定性连接状态、网络安全、RPC 弹性与可度量可靠性模式。",
  },
  "sign-in-with-solana": {
    title: "Sign-In with Solana",
    description:
      "掌握生产级 SIWS 认证：标准化输入、严格验证不变量、抗重放 nonce 生命周期与可审计报告。",
  },
  "priority-fees-compute-budget": {
    title: "Priority Fees 与 Compute Budget",
    description:
      "面向防御的 Solana 费用工程：确定性 compute 规划、自适应优先级策略与面向确认结果的 UX 可靠性约束。",
  },
  "bundles-atomicity": {
    title: "Bundles 与交易原子性",
    description:
      "设计防御型 Solana 多交易流程：确定性原子性校验、补偿建模与可审计安全报告。",
  },
  "mempool-ux-defense": {
    title: "Mempool 现实与反夹子 UX",
    description:
      "防御型交换 UX 工程：确定性风险分级、有界滑点策略与面向事故响应的安全沟通。",
  },
  "indexing-webhooks-pipelines": {
    title: "索引器、Webhook 与抗重组流水线",
    description:
      "构建生产级确定性索引流水线，实现防重复摄取、链重组处理与完整性优先报告。",
  },
  "rpc-reliability-latency": {
    title: "RPC 可靠性与延迟工程",
    description:
      "构建生产级多提供商 Solana RPC 客户端，采用确定性重试、路由、缓存与可观测性策略。",
  },
  "rust-data-layout-borsh": {
    title: "Rust 数据布局与 Borsh 精通",
    description:
      "Rust-first 的 Solana 数据布局工程：确定性字节级工具链与兼容性安全的 schema 实践。",
  },
  "rust-errors-invariants": {
    title: "Rust 错误设计与不变量",
    description:
      "构建类型化不变量守卫库，产出确定性证据工件，并建立兼容性安全的错误契约与审计级报告。",
  },
  "rust-perf-onchain-thinking": {
    title: "面向链上思维的 Rust 性能",
    description:
      "使用确定性 Rust-first 工具链模拟并优化 compute 成本行为，并以预算驱动性能治理。",
  },
  "rust-async-indexer-pipeline": {
    title: "面向索引器的并发与异步（Rust）",
    description:
      "Rust-first 异步流水线工程：有界并发、可抗重放 reducer 与确定性运维报告。",
  },
  "rust-proc-macros-codegen-safety": {
    title: "用于安全的过程宏与代码生成",
    description:
      "通过确定性解析器与检查生成工具学习 Rust 宏/代码生成安全，并输出审计友好的结果。",
  },
  "anchor-upgrades-migrations": {
    title: "Anchor 升级与账户迁移",
    description:
      "设计生产安全的 Anchor 发布流程：确定性迁移规划、升级闸门、回滚手册与就绪性证据。",
  },
  "solana-reliability": {
    title: "Solana 可靠性工程",
    description:
      "面向生产的 Solana 可靠性工程：容错、重试、截止时间、断路器与优雅降级，并具备可度量运维结果。",
  },
  "solana-testing-strategies": {
    title: "Solana 测试策略",
    description:
      "面向生产的完整 Solana 测试策略：确定性单元测试、真实集成测试、fuzz/property testing 与发布信心报告。",
  },
  "solana-program-optimization": {
    title: "Solana 程序优化",
    description:
      "构建生产级 Solana 性能：compute 预算、账户布局效率、内存/rent 权衡与确定性优化流程。",
  },
  "solana-tokenomics-design": {
    title: "Solana 代币经济设计",
    description:
      "设计稳健的 Solana 代币经济：分发纪律、vesting 安全、staking 激励与可运营辩护的治理机制。",
  },
  "solana-defi-primitives": {
    title: "Solana DeFi 原语",
    description:
      "构建实用的 Solana DeFi 基础：AMM 机制、流动性记账、借贷原语与抗闪电贷的安全组合模式。",
  },
  "solana-nft-standards": {
    title: "Solana NFT 标准",
    description:
      "以生产级标准实现 Solana NFT：元数据完整性、集合治理纪律以及高级可编程/不可转移行为。",
  },
  "solana-cpi-patterns": {
    title: "跨程序调用模式（CPI）",
    description:
      "掌握 Solana 上的 CPI 组合：安全账户校验、PDA signer 纪律与确定性的多程序编排模式。",
  },
  "solana-mev-strategies": {
    title: "MEV 与交易排序",
    description:
      "面向生产的 Solana 交易排序工程：MEV 感知路由、bundle 策略、清算/套利建模以及保护用户的执行控制。",
  },
  "solana-deployment-cicd": {
    title: "程序部署与 CI/CD",
    description:
      "面向 Solana 程序的生产部署工程：环境策略、发布闸门、CI/CD 质量控制与升级安全的运维流程。",
  },
  "solana-cross-chain-bridges": {
    title: "跨链桥与 Wormhole",
    description:
      "使用 Wormhole 风格消息机制构建更安全的 Solana 跨链集成：attestation 验证与桥状态确定性控制。",
  },
  "solana-oracle-pyth": {
    title: "预言机集成与 Pyth 网络",
    description:
      "安全集成 Solana 预言机数据源：价格校验、置信度/陈旧性策略与多源聚合，支持更稳健的协议决策。",
  },
  "solana-dao-tooling": {
    title: "DAO 工具链与自治组织",
    description:
      "构建生产级 Solana DAO 系统：提案治理、投票完整性、金库控制与确定性执行/报告流程。",
  },
  "solana-gaming": {
    title: "游戏与游戏状态管理",
    description:
      "构建生产级 Solana 链上游戏系统：高效状态模型、回合完整性、公平性控制与可扩展的玩家成长经济。",
  },
  "solana-permanent-storage": {
    title: "永久存储与 Arweave",
    description:
      "通过 Arweave 风格流程将永久去中心化存储与 Solana 集成：内容寻址、manifest 完整性与可验证的长期数据访问。",
  },
  "solana-staking-economics": {
    title: "质押与验证者经济学",
    description:
      "理解 Solana 质押与验证者经济学以支持真实决策：委托策略、奖励动态、佣金影响与运营可持续性。",
  },
  "solana-account-abstraction": {
    title: "账户抽象与智能钱包",
    description:
      "在 Solana 上实现智能钱包/账户抽象模式：可编程授权、恢复控制与策略驱动的交易验证。",
  },
  "solana-pda-mastery": {
    title: "Program Derived Address 高阶实践",
    description:
      "掌握 Solana 高阶 PDA 工程：seed schema 设计、bump 管理纪律与生产级安全跨程序 PDA 使用。",
  },
  "solana-economics": {
    title: "Solana 经济学与代币流动",
    description:
      "在生产语境下分析 Solana 经济动态：通胀与 fee-burn 作用关系、质押流动、供应变化与协议可持续性权衡。",
  },
};

export const zhCnCourseTranslations: CourseTranslationMap = zhCnCuratedCourseTranslations;
