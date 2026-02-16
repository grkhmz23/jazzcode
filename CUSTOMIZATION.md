# CUSTOMIZATION

## Theme

### Tailwind Configuration

Primary theme tokens live in `app/tailwind.config.ts`:

- `darkMode: ["class"]`
- semantic colors mapped to CSS vars (`--primary`, `--background`, etc.)
- Solana palette (`solana.purple`, `solana.green`, `solana.blue`)
- custom animation tokens (`xp-pulse`, `slide-up`, `fade-in`)

Adjust these to rebrand spacing, typography, colors, and motion.

### CSS Variables

Global variables are in `app/src/styles/globals.css`.

- Light mode: `:root` tokens
- Dark mode: `.dark` token overrides
- shadcn/ui primitives consume these values automatically

### Dark/Light Mode (`next-themes`)

- Provider: `app/src/components/layout/theme-provider.tsx`
- Backed by `next-themes`
- Mode switching occurs by toggling class on root (`class` strategy)

## Languages

Current locales: `en`, `pt-BR`, `es`.

To add a new language:

1. Add translation file in `app/src/messages/<locale>.json`.
2. Add locale to:
   - `app/src/lib/i18n/request.ts`
   - `app/src/lib/i18n/routing.ts`
3. Update any locale switcher UI options in layout/navigation components.
4. Validate route generation and middleware behavior for the new locale.

## Gamification

### Add Achievements

- Definitions: `app/src/lib/data/achievements.ts`
- Engine: `app/src/lib/services/achievements.ts`

Add a new definition and ensure condition type is handled by engine evaluation logic.

### Change XP Values

- Per-lesson XP: each course file in `app/src/lib/data/courses/*.ts` (`xpReward`)
- Completion/bonus logic: `app/src/lib/services/progress-local.ts` (first-of-day bonus, totals)

### Change Level Formula

- Current formula is in `app/src/lib/services/progress-local.ts`:
  - `Math.floor(Math.sqrt(totalXP / 100))`

Update that helper and test leaderboard/profile XP displays.

## New Course Types and Challenge Languages

### New Course Types

- Extend `CourseDifficulty` or content metadata in `app/src/types/content.ts`.
- Update filters/search logic in `ContentLocalService.searchCourses`.
- Update UI chips/selectors that render difficulty/taxonomy.

### New Challenge Languages

- Extend `ChallengeLanguage` union in `app/src/types/content.ts`.
- Add runner support in challenge execution layer:
  - `app/src/lib/challenge-runner.ts`
  - editor components under `app/src/components/editor`
- Add language-specific validation and test execution strategy.

## Forking for Other Communities

For a community-specific fork:

1. Rebrand app identity (name, logo, metadata, colors).
2. Replace course content files in `app/src/lib/data/courses/`.
3. Update locale copy in `app/src/messages/*.json`.
4. Configure chain-specific env vars:
   - `NEXT_PUBLIC_SOLANA_RPC_URL`
   - `NEXT_PUBLIC_XP_MINT_ADDRESS`
   - `NEXT_PUBLIC_CREDENTIAL_COLLECTION_ADDRESS`
   - `HELIUS_API_KEY`
5. Re-tune achievement definitions and XP economy to your cohort model.
6. Validate end-to-end with `lint`, `typecheck`, `test`, and production build.
