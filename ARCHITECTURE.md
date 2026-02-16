# Architecture

System architecture and design documentation for Superteam Academy (JazzCode).

---

## System Overview

Superteam Academy is a Next.js 14 application using the App Router. It follows a service-oriented architecture with clear separation between content management, learning progress tracking, gamification, and on-chain integration. The platform supports multiple authentication methods (OAuth + Solana wallets) and can switch between local data files and headless CMS for content management.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Next.js    │  │   Monaco    │  │   Wallet    │  │   Google Analytics  │ │
│  │  App Router │  │   Editor    │  │   Adapter   │  │   / Sentry          │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
└─────────┼────────────────┼────────────────┼──────────────────────────────────┘
          │                │                │
          │                │                └──────────────────┐
          │                │                                   │
          ▼                ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS SERVER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        API ROUTES (/app/src/app/api)                     ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐││
│  │  │   /auth/*   │ │ /progress/* │ │ /onchain/*  │ │    /courses/*       │││
│  │  │  (OAuth +   │ │ (enroll,    │ │ (XP, creds, │ │   (content API)     │││
│  │  │   wallet)   │ │  complete)  │ │ leaderboard)│ │                     │││
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘││
│  └─────────┼───────────────┼───────────────┼───────────────────┼───────────┘│
└────────────┼───────────────┼───────────────┼───────────────────┼────────────┘
             │               │               │                   │
             ▼               ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ ContentService  │  │ ProgressService │  │     OnChainService          │  │
│  │  (Factory)      │  │    (Factory)    │  │  (XP, Credentials, Leader)  │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘  │
│           │                    │                          │                 │
│           │                    │                          ▼                 │
│           │                    │            ┌─────────────────────────┐      │
│           │                    │            │  @solana/web3.js        │      │
│           │                    │            │  Helius DAS API         │      │
│           │                    │            │  (Solana Devnet)        │      │
│           │                    │            └─────────────────────────┘      │
│           │                    │                                             │
│           ▼                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      DATABASE (PostgreSQL + Prisma)                      ││
│  │  ┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐ ││
│  │  │  User   │ │ Enrollment  │ │LessonComp...│ │    UserAchievement     │ ││
│  │  │ Account │ │   UserXP    │ │  UserStreak │ │    LeaderboardCache    │ ││
│  │  └─────────┘ └─────────────┘ └─────────────┘ └────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
app/src/
├── app/                        # Next.js App Router
│   ├── [locale]/               # i18n routes (en, pt-BR, es)
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Locale layout with providers
│   │   ├── courses/            # Course catalog and detail
│   │   ├── dashboard/          # User dashboard
│   │   ├── profile/            # Profile pages
│   │   ├── leaderboard/        # Global leaderboard
│   │   ├── playground/         # Interactive code playground
│   │   ├── components/         # Component hub
│   │   ├── settings/           # User settings
│   │   └── auth/               # Sign in page
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth + wallet auth
│   │   ├── onchain/            # On-chain data endpoints
│   │   ├── progress/           # Learning progress endpoints
│   │   └── courses/            # Content API
│   ├── layout.tsx              # Root layout
│   └── global-error.tsx        # Global error boundary (Sentry)
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Header, Footer, Providers
│   ├── lessons/                # LessonChallenge, LessonNavigation
│   ├── editor/                 # CodeEditor, ChallengeRunner, RustChallenge
│   ├── auth/                   # AuthGuard, WalletButton
│   ├── achievements/           # AchievementToast, AchievementGrid
│   ├── credentials/            # CredentialCard
│   └── analytics/              # GoogleAnalytics component
├── lib/
│   ├── services/               # Business logic services
│   │   ├── content.ts          # ContentService interface
│   │   ├── content-local.ts    # Local file implementation
│   │   ├── content-factory.ts  # Factory for content service
│   │   ├── progress.ts         # ProgressService interface
│   │   ├── progress-local.ts   # Prisma implementation
│   │   ├── progress-factory.ts # Factory for progress service
│   │   ├── onchain.ts          # On-chain reads (XP, credentials)
│   │   └── achievements.ts     # Achievement definitions
│   ├── data/                   # Static data
│   │   ├── courses/            # Course content files
│   │   └── achievements.ts     # Achievement definitions
│   ├── db/                     # Prisma client
│   ├── auth/                   # NextAuth configuration
│   │   └── [...nextauth].ts    # Auth handlers
│   ├── i18n/                   # Internationalization
│   │   ├── request.ts          # next-intl configuration
│   │   └── navigation.ts       # Typed navigation helpers
│   ├── logging/                # Pino logger configuration
│   ├── challenge-runner.ts     # Web Worker sandbox for code execution
│   └── utils.ts                # Utility functions
├── types/                      # TypeScript type definitions
│   ├── index.ts                # Core types
│   ├── content.ts              # Content types
│   ├── progress.ts             # Progress types
│   └── achievements.ts         # Achievement types
└── styles/                     # Global CSS and Tailwind
```

---

## Data Flows

### Authentication Flow

```
1. GitHub OAuth Flow:
   User clicks "Sign in with GitHub" 
   → NextAuth redirects to GitHub
   → GitHub redirects back with code
   → NextAuth creates/updates User record
   → Session created with JWT

2. Solana Wallet Flow:
   User clicks "Connect Wallet"
   → Wallet Adapter opens modal
   → User selects wallet (Phantom, Solflare, etc.)
   → Wallet connects
   → For auth: Sign message with nonce
   → Server verifies signature (ed25519)
   → Account linked to User record

3. Account Linking:
   Authenticated user can link additional wallets
   → Sign linking message
   → Store in UserWallet table
   → Primary wallet used for on-chain reads
```

### Course Content Flow

```
1. Content Retrieval:
   Request: GET /api/courses
   → ContentFactory.getContentService()
   → If CONTENT_SOURCE=local: LocalContentService
   → Reads from src/lib/data/courses/*.ts
   → Returns Course[]

2. Single Course:
   Request: GET /api/courses/[slug]
   → ContentService.getCourse(slug)
   → Returns Course with modules and lessons

3. CMS Switching:
   Set CONTENT_SOURCE=sanity
   → Factory returns SanityContentService (Phase 7)
   → Fetches from Sanity CMS
   → Same interface, different source
```

### Lesson Completion Flow

```
1. User clicks "Complete Lesson":
   POST /api/progress/complete-lesson
   → Body: { courseSlug, lessonId }

2. Server processing:
   → Validate session
   → Check if already completed (idempotent)
   → Calculate XP (lesson reward + first-of-day bonus)
   → Create LessonCompletion record
   → Update UserXP totals
   → Check for new achievements
   → Update streak (if first completion today)
   → Check if course complete

3. Response:
   → xpAwarded, leveledUp, newLevel, newAchievements, isCourseComplete

4. Client updates:
   → Show XP toast
   → Update progress bar
   → Display achievement unlocks
```

### Challenge Execution Flow

```
1. User clicks "Run Tests":
   → trackEvent('run_challenge', 'editor')

2. Code execution:
   → ChallengeRunner calls runChallengeTests()
   → Creates Web Worker with sandbox
   → Injects mock Solana APIs (@solana/web3.js mocks)
   → Executes user code
   → Runs test cases against output
   → Terminates worker (timeout: 5000ms)

3. Results:
   → TestResult[] with pass/fail status
   → Console logs captured
   → Execution times recorded

4. All tests pass:
   → trackEvent('challenge_passed', 'editor')
   → Show confetti
   → Enable "Complete & Claim XP" button

5. Rust challenges:
   → RustChallenge component
   → AST-based structural validation
   → Checks for required patterns/structs
```

### On-Chain Read Flow

```
1. XP Balance Query:
   GET /api/onchain/xp?wallet=...
   → OnChainService.getOnChainXP()
   → If NEXT_PUBLIC_XP_MINT_ADDRESS set:
      → @solana/web3.js Connection
      → getAssociatedTokenAddress()
      → getAccount() for balance
   → Returns: { balance, mintAddress, tokenAccount }

2. Credentials Query:
   GET /api/onchain/credentials?wallet=...
   → OnChainService.getCredentials()
   → If HELIUS_API_KEY set:
      → Helius DAS API: searchAssets
      → Filter by collection (if set)
   → Returns: OnChainCredential[]

3. Leaderboard:
   GET /api/onchain/leaderboard
   → Merges local XP with on-chain XP
   → Returns enriched leaderboard

4. Ownership Verification:
   GET /api/onchain/verify?assetId=...&owner=...
   → Helius: getAsset
   → Compares ownership
   → Returns: { verified, currentOwner, heliusAvailable }
```

---

## Service Architecture

### CourseContentService

**Interface**: `src/lib/services/content.ts`

```typescript
interface CourseContentService {
  getAllCourses(): Promise<Course[]>;
  getCourse(slug: string): Promise<Course | null>;
  getCoursesByDifficulty(difficulty: Difficulty): Promise<Course[]>;
}
```

**Implementations**:
- `LocalContentService` (`src/lib/services/content-local.ts`): Reads from TypeScript files
- `SanityContentService` (Phase 7): Will fetch from Sanity CMS

**Factory**: `src/lib/services/content-factory.ts`

```typescript
const service = getContentService(); // Returns appropriate implementation
```

### LearningProgressService

**Interface**: `src/lib/services/progress.ts`

```typescript
interface LearningProgressService {
  enroll(userId: string, courseSlug: string): Promise<void>;
  completeLesson(userId: string, courseSlug: string, lessonId: string): Promise<CompletionResult>;
  getProgress(userId: string, courseSlug: string): Promise<UserProgress | null>;
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
}
```

**Implementations**:
- `LocalProgressService` (`src/lib/services/progress-local.ts`): Prisma + achievement checking

**Factory**: `src/lib/services/progress-factory.ts`

### AchievementEngine

**Definitions**: `src/lib/data/achievements.ts`

```typescript
interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'streaks' | 'skills';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: AchievementCondition;
}
```

**Checker**: Integrated in `progress-local.ts`

Evaluates conditions:
- `first_lesson`: First lesson completion
- `lessons_completed`: N lessons done
- `courses_completed`: N courses done
- `streak_reached`: N-day streak
- `xp_reached`: XP threshold
- `level_reached`: Level threshold
- `course_completed`: Specific course done
- `all_courses_completed`: All courses done

### OnChainService

**File**: `src/lib/services/onchain.ts`

Functions:
- `getOnChainXP(walletAddress)`: Fetch XP token balance
- `getCredentials(walletAddress)`: Fetch cNFT credentials via Helius
- `getOnChainLeaderboard()`: Get all XP token holders
- `verifyCredentialOwnership(assetId, expectedOwner)`: Verify NFT ownership

---

## Database Schema

### Auth & Identity

**User**
- `id` (CUID, PK)
- `username` (unique, optional)
- `displayName`, `email`, `emailVerified`
- `bio`, `avatarUrl`, `isPublic`
- `walletAddress` (unique, optional) — primary linked wallet
- Social links: `twitterHandle`, `githubHandle`, `discordHandle`, `websiteUrl`
- Preferences: `preferredLocale`, `theme`
- Relations: accounts[], sessions[], wallets[], courseProgress[], xpEvents[], achievements[], streakData, enrollments[], lessonCompletions[], userXP, userStreak, userAchievements[]

**Account** (NextAuth)
- `id`, `userId`, `type`, `provider`, `providerAccountId`
- OAuth tokens: `refresh_token`, `access_token`, `expires_at`

**Session** (NextAuth)
- `id`, `sessionToken` (unique), `userId`, `expires`

**VerificationToken** (NextAuth)
- `identifier`, `token` (unique), `expires`

### Wallet Linking

**UserWallet**
- `id`, `userId`, `address` (unique), `isPrimary`, `linkedAt`

**WalletNonce**
- `id`, `userId` (optional), `address`, `nonce`, `expiresAt`, `used`
- For wallet authentication message signing

### Learning Progress

**CourseProgress** (legacy)
- `id`, `userId`, `courseId`, `completedLessons` (Int[])
- `totalLessons`, `currentModuleIndex`, `currentLessonIndex`
- `startedAt`, `lastAccessedAt`, `completedAt`

**Enrollment** (Phase 5.2)
- `id`, `userId`, `courseSlug`, `enrolledAt`, `completedAt`

**LessonCompletion** (Phase 5.2)
- `id`, `userId`, `courseSlug`, `lessonId`, `xpAwarded`, `completedAt`

### XP & Gamification

**XPEvent** (legacy)
- `id`, `userId`, `amount`, `reason`, `courseId`, `lessonId`, `createdAt`

**UserXP** (Phase 5.2)
- `id`, `userId` (unique), `totalXP`, `weeklyXP`, `monthlyXP`
- `lastWeeklyReset`, `lastMonthlyReset`

**UserStreak** (Phase 5.2)
- `id`, `userId` (unique), `currentStreak`, `longestStreak`
- `lastActivityDate`, `streakHistory` (Json)

**UserAchievement** (legacy)
- `id`, `userId`, `achievementId`, `unlockedAt`

**UserAchievementNew** (Phase 5.2)
- `id`, `userId`, `achievementId` (String), `unlockedAt`

**StreakRecord** (legacy)
- `id`, `userId` (unique), `currentStreak`, `longestStreak`, `lastActivityDate`

### Leaderboard

**LeaderboardCache**
- `id`, `timeframe` (unique), `data` (Json), `cachedAt`, `expiresAt`

---

## API Routes

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/health/db` | No | Database connectivity check |
| POST | `/api/auth/nonce` | No | Get nonce for wallet signing |
| POST | `/api/auth/link-wallet` | Yes | Link wallet to account |
| DELETE | `/api/auth/link-wallet` | Yes | Unlink wallet |
| GET | `/api/courses` | No | List all courses |
| GET | `/api/courses/[slug]` | No | Get course details |
| GET | `/api/courses/[slug]/lessons/[id]` | No | Get lesson content |
| POST | `/api/progress/enroll` | Yes | Enroll in a course |
| POST | `/api/progress/complete-lesson` | Yes | Mark lesson complete |
| GET | `/api/progress/[courseSlug]` | Yes | Get user's course progress |
| GET | `/api/progress/streak` | Yes | Get user's streak info |
| GET | `/api/leaderboard` | No | Get leaderboard |
| GET | `/api/onchain/xp` | No | Get on-chain XP balance |
| GET | `/api/onchain/credentials` | No | Get cNFT credentials |
| GET | `/api/onchain/leaderboard` | No | Get on-chain leaderboard |
| GET | `/api/onchain/verify` | No | Verify credential ownership |
| GET | `/api/profile` | Yes | Get user profile |
| PATCH | `/api/profile` | Yes | Update profile |

---

## Security

### Content Security Policy

Configured in `next.config.mjs`:

```javascript
// Monaco Editor requirements:
script-src: 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com
worker-src: 'self' blob:
style-src: 'self' 'unsafe-inline'
connect-src: 'self' https://api.devnet.solana.com wss://...
img-src: 'self' blob: data: https://cdn.sanity.io ...
```

Monaco Editor requires:
- `unsafe-eval`: For syntax highlighting workers
- `blob:` workers: Dynamic worker creation

### Auth Guards

**Protected Routes** (require session):
- `/dashboard`
- `/profile`
- `/settings`
- `/api/progress/*` (except health check)
- `/api/profile`

**Public Routes**:
- `/`, `/courses`, `/courses/[slug]`
- `/leaderboard`
- `/playground`
- `/api/courses/*`
- `/api/health/*`

Implementation: `AuthGuard` component + middleware checks

### Wallet Signature Verification

```typescript
// Wallet authentication flow:
1. Server generates nonce + message
2. User signs message with private key
3. Server verifies signature using tweetnacl
4. Creates/updates user session
```

### Web Worker Sandboxing

```typescript
// Challenge execution sandbox:
1. Create Worker from blob URL
2. Inject mock Solana APIs (controlled environment)
3. Set 5000ms timeout
4. Terminate worker after execution
5. No access to DOM, localStorage, or fetch
```

### Rate Limiting

```typescript
// Configurable via env vars:
RATE_LIMIT_ENABLED=true
RATE_LIMIT_UPSTASH_REDIS_REST_URL=...
RATE_LIMIT_UPSTASH_REDIS_REST_TOKEN=...

// Applied to auth and progress endpoints
// In-memory fallback if Redis not configured
```

---

## On-Chain Integration Points

### Current Implementation (Read-Only)

1. **XP Token Balance**
   - Contract: SPL Token on devnet
   - Method: `getAccount()` via @solana/spl-token
   - Endpoint: `/api/onchain/xp`

2. **cNFT Credentials**
   - API: Helius DAS (Digital Asset Standard)
   - Method: `searchAssets` with owner filter
   - Endpoint: `/api/onchain/credentials`

3. **Leaderboard Indexing**
   - API: Helius token accounts
   - Method: Get all XP token holders
   - Merged with local XP data

4. **Ownership Verification**
   - API: Helius `getAsset`
   - Compares asset owner with expected wallet

### Future Implementation (Write)

Planned for when on-chain program deployed:

1. **Lesson Completion Rewards**
   - Backend signs transaction to mint XP tokens
   - User receives tokens automatically

2. **Enrollment NFTs**
   - Mint cNFT on course enrollment
   - Updates as progress is made

3. **Achievement Claims**
   - Users claim achievements on-chain
   - Verifiable credentials

### Program Repository

On-chain program (Anchor Rust): `github.com/solanabr/superteam-academy`

---

## Performance

### Static Generation Strategy

| Route | Strategy | Revalidate |
|-------|----------|------------|
| `/` (landing) | SSG | 3600s (1 hour) |
| `/courses` | SSG | 300s (5 min) |
| `/courses/[slug]` | SSG + ISR | On-demand |
| `/leaderboard` | SSR (real-time data) | - |
| `/playground` | SSG | - |

### Dynamic Imports

```typescript
// Monaco Editor loaded dynamically:
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  { ssr: false, loading: () => <EditorLoading /> }
);
```

### Caching Strategy

1. **API Responses**:
   - On-chain endpoints: 60s - 300s cache headers
   - Course content: Static at build time

2. **Static Pages**:
   - Landing: ISR 3600s
   - Course catalog: ISR 300s

3. **Leaderboard**:
   - Database cache table for expensive queries
   - 5-minute TTL

4. **Images**:
   - Next.js Image optimization
   - Remote patterns configured for Sanity, Google, GitHub avatars
