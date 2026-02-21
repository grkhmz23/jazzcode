#!/usr/bin/env tsx
/**
 * Generate SVG course cover images for all 51 courses
 * Usage: npx tsx scripts/generate-course-images.ts
 */

import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "app/public/images/courses");

// Category definitions with color schemes and icons
const categoryStyles: Record<string, { gradient: string; icon: string; accent: string }> = {
  fundamentals: {
    gradient: "#1a1a2e,#16213e",
    icon: "◎",
    accent: "#9945FF",
  },
  anchor: {
    gradient: "#0f0f23,#1a0e2e",
    icon: "⚓",
    accent: "#FF6B6B",
  },
  defi: {
    gradient: "#0d1f1c,#0a2e1f",
    icon: "💰",
    accent: "#14F195",
  },
  security: {
    gradient: "#1c0d0d,#2e0a0a",
    icon: "🛡️",
    accent: "#FF4444",
  },
  rust: {
    gradient: "#1a1510,#2e1f0a",
    icon: "🦀",
    accent: "#FF8C00",
  },
  infra: {
    gradient: "#0d1a2e,#0a1f2e",
    icon: "🔧",
    accent: "#00D1FF",
  },
  wallet: {
    gradient: "#1e1a2c,#1f0a2e",
    icon: "👛",
    accent: "#9D4EDD",
  },
  mobile: {
    gradient: "#151928,#0f172a",
    icon: "📱",
    accent: "#38BDF8",
  },
  payments: {
    gradient: "#1a2e1a,#0a2e0a",
    icon: "💳",
    accent: "#22C55E",
  },
  frontend: {
    gradient: "#1f1a2e,#1a0a2e",
    icon: "⚛️",
    accent: "#A855F7",
  },
  governance: {
    gradient: "#2e251a,#2e1f0a",
    icon: "🏛️",
    accent: "#D97706",
  },
  nft: {
    gradient: "#2e1a2e,#2e0a2e",
    icon: "🎨",
    accent: "#EC4899",
  },
  testing: {
    gradient: "#1a2e25,#0a2e1f",
    icon: "🧪",
    accent: "#10B981",
  },
  tokenomics: {
    gradient: "#2e2a1a,#2e240a",
    icon: "🪙",
    accent: "#F59E0B",
  },
  reliability: {
    gradient: "#1a1a2e,#0f172a",
    icon: "🔒",
    accent: "#6366F1",
  },
  bridges: {
    gradient: "#1a202c,#1a1a2e",
    icon: "🌉",
    accent: "#3B82F6",
  },
  oracle: {
    gradient: "#0f172a,#1e293b",
    icon: "🔮",
    accent: "#8B5CF6",
  },
  dao: {
    gradient: "#291c12,#3d2314",
    icon: "🗳️",
    accent: "#B45309",
  },
  gaming: {
    gradient: "#1a1a2e,#1e1b4b",
    icon: "🎮",
    accent: "#6366F1",
  },
  storage: {
    gradient: "#0c2e1a,#0a2e15",
    icon: "💾",
    accent: "#16A34A",
  },
  staking: {
    gradient: "#1e1a0d,#2e260a",
    icon: "🔐",
    accent: "#EAB308",
  },
  default: {
    gradient: "#1a1a2e,#16213e",
    icon: "◈",
    accent: "#9945FF",
  },
};

// All 51 courses with their metadata
const courses: Array<{ slug: string; title: string; category: keyof typeof categoryStyles }> = [
  // Individual courses (33)
  { slug: "solana-fundamentals", title: "Solana Fundamentals", category: "fundamentals" },
  { slug: "anchor-development", title: "Anchor Development", category: "anchor" },
  { slug: "solana-frontend", title: "Solana Frontend", category: "frontend" },
  { slug: "defi-solana", title: "DeFi on Solana", category: "defi" },
  { slug: "solana-security", title: "Solana Security", category: "security" },
  { slug: "token-engineering", title: "Token Engineering", category: "tokenomics" },
  { slug: "solana-mobile", title: "Solana Mobile", category: "mobile" },
  { slug: "solana-testing", title: "Solana Testing", category: "testing" },
  { slug: "solana-indexing", title: "Solana Indexing", category: "infra" },
  { slug: "solana-payments", title: "Solana Payments", category: "payments" },
  { slug: "solana-nft-compression", title: "NFT Compression", category: "nft" },
  { slug: "solana-governance-multisig", title: "Governance & Multisig", category: "governance" },
  { slug: "solana-performance", title: "Solana Performance", category: "infra" },
  { slug: "defi-swap-aggregator", title: "DeFi Swap Aggregator", category: "defi" },
  { slug: "defi-clmm-liquidity", title: "CLMM Liquidity", category: "defi" },
  { slug: "defi-lending-risk", title: "DeFi Lending Risk", category: "defi" },
  { slug: "defi-perps-risk-console", title: "Perps Risk Console", category: "defi" },
  { slug: "defi-tx-optimizer", title: "Transaction Optimizer", category: "infra" },
  { slug: "solana-mobile-signing", title: "Mobile Signing", category: "mobile" },
  { slug: "solana-pay-commerce", title: "Solana Pay Commerce", category: "payments" },
  { slug: "wallet-ux-engineering", title: "Wallet UX Engineering", category: "wallet" },
  { slug: "sign-in-with-solana", title: "Sign In With Solana", category: "wallet" },
  { slug: "priority-fees-compute-budget", title: "Priority Fees & Compute", category: "infra" },
  { slug: "bundles-atomicity", title: "Bundles & Atomicity", category: "infra" },
  { slug: "mempool-ux-defense", title: "Mempool UX Defense", category: "security" },
  { slug: "indexing-webhooks-pipelines", title: "Indexing Pipelines", category: "infra" },
  { slug: "rpc-reliability-latency", title: "RPC Reliability", category: "infra" },
  { slug: "rust-data-layout-borsh", title: "Rust Data Layout", category: "rust" },
  { slug: "rust-errors-invariants", title: "Rust Errors & Invariants", category: "rust" },
  { slug: "rust-perf-onchain-thinking", title: "Rust Performance", category: "rust" },
  { slug: "rust-async-indexer-pipeline", title: "Rust Async Indexer", category: "rust" },
  { slug: "rust-proc-macros-codegen-safety", title: "Rust Proc Macros", category: "rust" },
  { slug: "anchor-upgrades-migrations", title: "Anchor Upgrades", category: "anchor" },
  
  // Courses 10-18 (9 courses)
  { slug: "solana-reliability", title: "Reliability Engineering", category: "reliability" },
  { slug: "solana-testing-strategies", title: "Testing Strategies", category: "testing" },
  { slug: "solana-program-optimization", title: "Program Optimization", category: "infra" },
  { slug: "solana-tokenomics-design", title: "Tokenomics Design", category: "tokenomics" },
  { slug: "solana-defi-primitives", title: "DeFi Primitives", category: "defi" },
  { slug: "solana-nft-standards", title: "NFT Standards", category: "nft" },
  { slug: "solana-cpi-patterns", title: "CPI Patterns", category: "anchor" },
  { slug: "solana-mev-strategies", title: "MEV Strategies", category: "defi" },
  { slug: "solana-deployment-cicd", title: "Deployment & CI/CD", category: "infra" },
  
  // Courses 43-51 (9 courses)
  { slug: "solana-cross-chain-bridges", title: "Cross-Chain Bridges", category: "bridges" },
  { slug: "solana-oracle-pyth", title: "Oracle & Pyth", category: "oracle" },
  { slug: "solana-dao-tooling", title: "DAO Tooling", category: "dao" },
  { slug: "solana-gaming", title: "Gaming", category: "gaming" },
  { slug: "solana-permanent-storage", title: "Permanent Storage", category: "storage" },
  { slug: "solana-staking-economics", title: "Staking Economics", category: "staking" },
  { slug: "solana-account-abstraction", title: "Account Abstraction", category: "wallet" },
  { slug: "solana-pda-mastery", title: "PDA Mastery", category: "fundamentals" },
  { slug: "solana-economics", title: "Solana Economics", category: "tokenomics" },
];

function generateSVG(course: typeof courses[0]): string {
  const style = categoryStyles[course.category] || categoryStyles.default;
  const [bgFrom, bgTo] = style.gradient.split(",");
  
  // Truncate title if too long
  const displayTitle = course.title.length > 24 
    ? course.title.substring(0, 22) + "..." 
    : course.title;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
  <defs>
    <linearGradient id="bg-${course.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgFrom}"/>
      <stop offset="100%" stop-color="${bgTo}"/>
    </linearGradient>
    <linearGradient id="accent-${course.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${style.accent}"/>
      <stop offset="100%" stop-color="${style.accent}dd"/>
    </linearGradient>
    <filter id="glow-${course.slug}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="400" height="225" fill="url(#bg-${course.slug})"/>
  <circle cx="200" cy="95" r="55" fill="none" stroke="url(#accent-${course.slug})" stroke-width="2" opacity="0.3"/>
  <circle cx="200" cy="95" r="45" fill="none" stroke="url(#accent-${course.slug})" stroke-width="1.5" opacity="0.5"/>
  <text x="200" y="110" text-anchor="middle" fill="url(#accent-${course.slug})" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="bold" filter="url(#glow-${course.slug})">${style.icon}</text>
  <text x="200" y="185" text-anchor="middle" fill="#e0e0e0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600">${displayTitle}</text>
  <text x="200" y="205" text-anchor="middle" fill="#888" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-transform="uppercase" letter-spacing="1">${course.category}</text>
</svg>`;
}

function main() {
  console.log(`Generating ${courses.length} course images...`);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let generated = 0;
  let skipped = 0;

  for (const course of courses) {
    const outputPath = path.join(OUTPUT_DIR, `${course.slug}.svg`);
    
    // Skip if already exists (unless --force flag)
    if (fs.existsSync(outputPath) && !process.argv.includes("--force")) {
      console.log(`  ⏭️  ${course.slug}.svg (exists)`);
      skipped++;
      continue;
    }

    const svg = generateSVG(course);
    fs.writeFileSync(outputPath, svg);
    console.log(`  ✅ ${course.slug}.svg`);
    generated++;
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Total: ${courses.length}`);
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
}

main();
