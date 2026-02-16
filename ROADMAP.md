# JazzCode Roadmap

## Shipped (v1.0 — Grant Submission)
- 10-page Solana developer LMS with interactive courses
- 4 courses (26 lessons) covering Solana fundamentals through DeFi
- Monaco code editor with TypeScript challenge runner (sandboxed Web Worker)
- Rust structural validation for Anchor challenges
- GitHub OAuth + Solana wallet adapter authentication with account linking
- Gamification: XP, levels, streaks, 18 achievements, leaderboard
- On-chain read paths: XP balance, cNFT credentials, leaderboard via Helius DAS
- i18n: English, Portuguese (BR), Spanish
- Dark/light themes, fully responsive
- Solana Playground (basic) with 4 runnable templates

## Phase 11 — Component Hub (v1.1)
**Goal: "npm for Solana UI components"**

- Component CRUD with metadata (framework, styling, deps, version)
- Live preview rendering via esbuild bundling in sandboxed iframe
- Props playground with auto-generated controls
- Code viewer with copy/install snippets
- Search and filtering by framework, category, tags
- "Verified" badge via CI pipeline (lint + typecheck + tests pass)
- Component versioning (v1, v2...)
- Upload flow: paste code or upload zip
- Dependency scanning and security audit

## Phase 12 — Demo Builder (v1.2)
**Goal: "Replit for Solana — build, run, share in the browser"**

### v1.2.0 — Client-side sandbox (MVP)
- File tree editor with Monaco (multi-file support)
- Templates: Token transfer, Anchor CPI, NFT mint, Wallet connect, Next.js dApp
- Client-side execution for JS/TS via Web Workers
- Console output + basic network inspector
- Share via permalink (code encoded in URL or stored in DB)
- Fork/remix any demo

### v1.2.1 — WebContainers integration
- In-browser Node.js via WebContainers for full Next.js/React demos
- Hot reload in preview panel
- Real npm install + dependency resolution
- Wallet adapter integration in previews

### v1.2.2 — Remote sandbox (full power)
- Server-side execution via isolated containers (Firecracker/Docker)
- Anchor build + deploy to devnet from the browser
- WebSocket streaming for logs + preview
- Per-user quotas (CPU, memory, runs/day)
- Secret management for RPC keys

## Phase 13 — Component ↔ Demo Integration (v1.3)
- "Add to Demo" button on every component card
- Auto-inject component code + dependencies into demo files
- Rebuild + hot preview on component add
- Pin component versions in demos
- Component usage analytics

## Phase 14 — Advanced Platform Features (v2.0)
- RPC inspector: view all Solana RPC calls with timing, request/response
- Transaction viewer: decode + visualize transaction instructions
- Wallet simulator: virtual devnet wallet with airdrop, no browser extension needed
- Performance profiling: compute unit tracking per instruction
- Offline mode / PWA
- Admin dashboard for course + component management
- Community features: comments, ratings, Q&A per component and lesson

## Architecture Decisions

### Code Execution Strategy
- **v1.0**: Web Worker sandbox (TypeScript only, simulated Solana APIs)
- **v1.1-1.2**: WebContainers for full JS/TS (in-browser Node.js)
- **v1.2.2+**: Remote sandboxes for Rust/Anchor builds

### Security Model
- All user code executes in sandboxed iframes or Web Workers
- Strict CSP: no top-level navigation, no same-origin access
- Network egress via proxy (allowlist: Solana RPC + known APIs)
- Per-user rate limits on execution
- Dependency scanning on component uploads
- Ephemeral filesystems for remote sandboxes

### Data Model Extensions
- Component: id, slug, title, code, css, deps, framework, styling, version, status, previewEntry
- Demo: id, slug, files (map), templateId, forkedFrom, buildStatus
- ComponentUsage: componentId, demoId, version (tracks which demos use which components)
