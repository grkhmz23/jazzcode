# Superteam Academy — JazzCode

[![Build Status](https://img.shields.io/github/actions/workflow/status/solanabr/jazzcode/ci.yml)](https://github.com/solanabr/jazzcode/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

**Interactive Solana Developer Education Platform**

> Learn Solana development through hands-on coding challenges, earn on-chain credentials, and join a global community of builders.

See live demo at [jazzcode.vercel.app](https://jazzcode.vercel.app)

---

## Features

- **4 Interactive Courses**: Solana Fundamentals, Anchor Development, Frontend Development, and DeFi
- **Monaco Code Editor**: Full-featured IDE with syntax highlighting, IntelliSense, and sandboxed TypeScript execution
- **Rust Structural Validation**: Specialized challenge runner for Anchor programs with AST-based checking
- **Multi-Wallet Authentication**: GitHub OAuth + Solana wallet adapter (Phantom, Solflare, Backpack, and more)
- **Gamification Engine**: XP system, levels, streaks, 18 unlockable achievements, and global leaderboard
- **On-Chain Integration**: Read XP token balances and cNFT credentials via Helius DAS API on devnet
- **Internationalization**: Full i18n support for English, Portuguese (BR), and Spanish
- **Theming**: Dark/light mode with next-themes, fully responsive design
- **Solana Playground**: Interactive code sandbox with runnable templates
- **Component Hub**: Showcase of production-ready Solana UI components (preview)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.6 (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Authentication | NextAuth.js v4 + Database sessions |
| Database | PostgreSQL + Prisma ORM |
| i18n | next-intl |
| Editor | Monaco Editor (@monaco-editor/react) |
| Solana | @solana/web3.js, @solana/wallet-adapter, @solana/spl-token |
| Indexing | Helius DAS API |
| Monitoring | Sentry (opt-in), Google Analytics 4 (opt-in) |
| Testing | Vitest + React Testing Library + Playwright |
| Logging | Pino (structured JSON logging) |

---

## Prerequisites

- Node.js 20+ (check with `node --version`)
- pnpm 9+ (install with `npm install -g pnpm`)
- PostgreSQL 15+ (local, Supabase, or Neon)

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/solanabr/jazzcode.git
cd jazzcode
pnpm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp app/.env.example app/.env.local
```

Fill in required values:

```bash
# Required: Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/superteam_academy

# Required: NextAuth secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-super-secret-nextauth-key-min-32-chars

# Required: Public URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm -C app db:generate

# Push schema to database
pnpm -C app db:push

# (Optional) Seed with sample data
pnpm -C app db:seed
```

### 4. Run Development Server

```bash
pnpm -C app dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | Min 32-character random string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public URL of your deployment | `https://app.example.com` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 tracking ID | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error reporting DSN | - |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_XP_MINT_ADDRESS` | XP token mint address | - |
| `HELIUS_API_KEY` | Helius API key for DAS queries | - |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `false` |
| `RATE_LIMIT_UPSTASH_REDIS_REST_URL` | Upstash Redis URL | - |
| `RATE_LIMIT_UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | - |
| `LOG_LEVEL` | Logging level | `info` |
| `CONTENT_SOURCE` | Content source (`local` or `sanity`) | `local` |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed database with sample data |

---

## Project Structure

```
jazzcode/
├── app/                          # Next.js 14 application
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── [locale]/         # Localized pages (i18n)
│   │   │   ├── api/              # API routes
│   │   │   ├── global-error.tsx  # Global error boundary
│   │   │   └── layout.tsx        # Root layout
│   │   ├── components/           # React components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── layout/           # Layout components
│   │   │   ├── lessons/          # Lesson-related components
│   │   │   ├── editor/           # Code editor components
│   │   │   ├── auth/             # Authentication components
│   │   │   └── achievements/     # Gamification components
│   │   ├── lib/                  # Utilities and services
│   │   │   ├── services/         # Business logic (content, progress, on-chain)
│   │   │   ├── data/             # Course data and achievements
│   │   │   ├── db/               # Prisma client
│   │   │   ├── auth/             # NextAuth configuration
│   │   │   ├── i18n/             # Internationalization config
│   │   │   └── logging/          # Pino logger setup
│   │   ├── types/                # TypeScript type definitions
│   │   └── styles/               # Global CSS and Tailwind
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── tests/                    # Test files
├── ROADMAP.md                    # Product roadmap
├── ARCHITECTURE.md               # System architecture
├── CMS_GUIDE.md                  # Content management guide
└── CUSTOMIZATION.md              # Customization guide
```

---

## Deployment

### Vercel (Recommended)

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy

**Important Vercel Settings:**
- Build Command: `cd app && pnpm build`
- Output Directory: `app/.next`
- Install Command: `pnpm install`

### Environment-Specific Notes

**Production:**
- Set `NODE_ENV=production`
- Enable rate limiting: `RATE_LIMIT_ENABLED=true`
- Configure Upstash Redis for rate limiting
- Set up Sentry and Google Analytics

**Development:**
- Use `pnpm dev` for hot reloading
- Use `pnpm db:studio` to inspect database

---

## Testing

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test -- --coverage

# Run E2E tests (requires dev server running)
pnpm test:e2e

# Run all quality checks (CI pipeline)
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass and follow our code style guidelines.

---

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — System design, data flows, and service architecture
- **[CMS_GUIDE.md](CMS_GUIDE.md)** — Content management, adding courses, and CMS integration
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** — Theming, i18n, and platform customization
- **[ROADMAP.md](ROADMAP.md)** — Product roadmap and upcoming features

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Superteam Brazil](https://superteam.com.br) for the global Solana community.
