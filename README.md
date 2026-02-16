# Superteam Academy — JazzCode

**Interactive Solana Developer Education Platform**

Live demo: https://jazzcode.vercel.app

## Features

- 4 interactive courses (26 lessons)
- Monaco code editor with sandboxed TypeScript execution
- Rust structural validation for Anchor-style challenges
- GitHub OAuth + Solana multi-wallet authentication
- Gamification: XP, levels, streaks, 18 achievements, leaderboard
- On-chain reads: XP balance + cNFT credentials (Helius DAS)
- Internationalization: English (`en`), Portuguese (`pt-BR`), Spanish (`es`)
- Dark/light themes via `next-themes`
- Solana Playground with runnable templates
- Component Hub showcase

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 |
| Language | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Auth | NextAuth v4 |
| i18n | next-intl |
| Code Editor | Monaco Editor |
| Solana Client | `@solana/web3.js` |
| Wallet Integration | `@solana/wallet-adapter` |
| On-chain Indexing | Helius DAS API |

## Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL (or Neon)

## Quick Start

```bash
git clone <your-fork-or-repo-url>
cd jazzcode/app
pnpm install
cp .env.example .env.local
# Fill values in .env.local
pnpm db:generate
pnpm db:push
pnpm dev
```

## Environment Variables

Defined in `app/.env.example`.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. |
| `NEXTAUTH_URL` | Yes | Public base URL used by NextAuth callbacks. |
| `NEXTAUTH_SECRET` | Yes | Signing/encryption secret for NextAuth sessions and JWTs. |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret. |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID. |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret. |
| `RATE_LIMIT_ENABLED` | No | Enables API rate limiting when `true`. |
| `RATE_LIMIT_UPSTASH_REDIS_REST_URL` | No | Upstash REST URL for distributed rate limit storage. |
| `RATE_LIMIT_UPSTASH_REDIS_REST_TOKEN` | No | Upstash REST token for rate limit store access. |
| `LOG_LEVEL` | No | Logging verbosity (`trace` to `fatal`). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Enables Google Analytics 4 tracking. |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Enables PostHog analytics. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog endpoint (default points to cloud host). |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Enables Sentry browser/server error reporting. |
| `ANALYTICS_ENABLED` | No | Legacy server-side analytics flag. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | No | Legacy client-side analytics flag. |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL for client-side links/config. |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Solana RPC endpoint (defaults to devnet RPC). |
| `NEXT_PUBLIC_XP_MINT_ADDRESS` | No | XP SPL token mint for on-chain XP reads. |
| `NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS` | No | cNFT collection filter for credential discovery. |
| `HELIUS_API_KEY` | No | API key for Helius DAS queries. |
| `NODE_ENV` | No | Runtime mode (`development`/`production`/`test`). |

## Scripts

Run from `app/`.

| Script | Purpose |
|---|---|
| `pnpm dev` | Start Next.js dev server. |
| `pnpm build` | Create production build (`next build`). |
| `pnpm start` | Start production server. |
| `pnpm lint` | Run ESLint checks. |
| `pnpm typecheck` | Run TypeScript checks (`tsc --noEmit`). |
| `pnpm test` | Run unit/integration tests (Vitest). |
| `pnpm db:generate` | Generate Prisma client. |
| `pnpm db:push` | Push Prisma schema to database. |
| `pnpm db:seed` | Seed database data. |
| `pnpm db:studio` | Open Prisma Studio. |

## Project Structure

Abbreviated structure for `app/src/`:

```text
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── [locale]/           # Localized UI routes (en, pt-BR, es)
│   └── api/                # Backend route handlers
├── components/             # Reusable React UI and feature components
├── lib/                    # Core business logic, services, auth, db, utils
│   ├── data/               # Static course/achievement/template data
│   ├── services/           # Content/progress/on-chain service layer
│   ├── api/                # API middleware, validation, error helpers
│   ├── auth/               # NextAuth config + wallet verification
│   ├── db/                 # Prisma client
│   ├── i18n/               # next-intl routing/request helpers
│   └── rate-limit/         # IP/user rate limiting logic
├── messages/               # Translation JSON files
├── styles/                 # Global CSS and tokens
├── types/                  # Shared TypeScript domain types
└── middleware.ts           # i18n + protected-route auth middleware
```

## Deployment (Vercel)

Recommended settings:

- Root Directory: `app`
- Build Command: `pnpm build`
- Install Command: `pnpm install`
- Output Directory: `.next` (default for Next.js)
- Node version: 20+

Required Vercel environment variables:

- `DATABASE_URL`
- `NEXTAUTH_URL` (use your production URL)
- `NEXTAUTH_SECRET`

Optional but commonly used:

- OAuth keys (`GITHUB_*`, `GOOGLE_*`)
- `HELIUS_API_KEY`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- Monitoring/analytics variables (`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_POSTHOG_*`)

## Testing

From `app/`:

```bash
pnpm lint
pnpm typecheck
pnpm test
SKIP_ENV_VALIDATION=1 pnpm build
```

## License

MIT
