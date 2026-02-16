# Superteam Academy

Interactive Solana Developer Education Platform

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (or use Supabase/Neon)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo>
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

# Optional: OAuth providers (for auth to work)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm -C app db:generate

# Run migrations
pnpm -C app db:push

# (Optional) Seed database
pnpm -C app db:seed
```

### 4. Run Development Server

```bash
pnpm -C app dev
```

Visit http://localhost:3000

## Production Deployment

### Environment Variables (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string with pooler | `postgresql://...` |
| `NEXTAUTH_SECRET` | Min 32 character secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public URL of your app | `https://app.example.com` |

### Environment Variables (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `false` |
| `RATE_LIMIT_UPSTASH_REDIS_REST_URL` | Upstash Redis URL | - |
| `RATE_LIMIT_UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | - |
| `LOG_LEVEL` | Logging level | `info` |
| `ANALYTICS_ENABLED` | Enable analytics | `false` |

### Build

```bash
pnpm -C app build
```

### Database Migrations

For production, use proper migrations:

```bash
pnpm -C app db:generate
pnpm -C app db:push  # Or use migrations: pnpm -C app db:migrate
```

## Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js v4 + Database sessions
- **Database**: PostgreSQL + Prisma
- **i18n**: next-intl
- **Logging**: Pino (structured logging)

### Project Structure

```
app/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── [locale]/     # Localized pages
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   └── ...
│   ├── lib/              # Utilities
│   │   ├── api/          # API utilities (errors, validation)
│   │   ├── auth/         # Auth configuration
│   │   ├── db/           # Prisma client
│   │   ├── env.ts        # Environment validation
│   │   ├── i18n/         # i18n configuration
│   │   ├── logging/      # Pino logger
│   │   ├── rate-limit/   # Rate limiting
│   │   └── services/     # Business logic services
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── tests/                # Test files
├── prisma/               # Database schema
└── scripts/              # Utility scripts
```

### Key Features

1. **Environment Validation**: Strict env var validation with zod
2. **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
3. **Rate Limiting**: Configurable (disabled by default, uses in-memory or Upstash Redis)
4. **Structured Logging**: Request correlation IDs with Pino
5. **Database Health Checks**: `/api/health/db` endpoint
6. **Type Safety**: Strict TypeScript throughout

## API Routes

### Health Check

```bash
GET /api/health/db
```

Returns database connectivity status.

### On-chain Endpoints

```bash
GET /api/onchain/credentials?wallet=<address>
GET /api/onchain/leaderboard?timeframe=alltime&limit=50
GET /api/onchain/xp?wallet=<address>
```

All endpoints return `{ data, requestId }` or `{ error: { code, message, requestId } }`.

## Development

### Running Tests

```bash
# All tests
pnpm -C app test

# Watch mode
pnpm -C app test:watch

# With coverage
pnpm -C app test -- --coverage
```

### Code Quality

```bash
# Lint
pnpm -C app lint

# Type check
pnpm -C app typecheck

# All checks (run in CI)
pnpm -C app lint && pnpm -C app typecheck && pnpm -C app test && pnpm -C app build
```

### Adding shadcn Components

```bash
pnpm -C app shadcn add <component>
```

## Security Considerations

1. **Secrets**: Never commit `.env.local` or any file with real secrets
2. **Rate Limiting**: Enable `RATE_LIMIT_ENABLED=true` in production with Upstash Redis
3. **CSP**: Content Security Policy is configured in `next.config.mjs`
4. **Cookies**: Secure, httpOnly, sameSite cookies in production
5. **CORS**: API routes only allow same-origin requests by default

## License

MIT
