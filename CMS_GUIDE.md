# CMS_GUIDE

## Overview

JazzCode uses a `CourseContentService` abstraction to decouple content storage from content consumption.

- Interface: `app/src/lib/services/content.ts`
- Factory: `app/src/lib/services/content-factory.ts`
- Default implementation: `ContentLocalService` (`app/src/lib/services/content-local.ts`)

This lets the app read course content the same way regardless of source (local files now, headless CMS later).

## Current Setup

Current content source is local TypeScript files in `app/src/lib/data/courses/`:

- `solana-fundamentals.ts`
- `anchor-development.ts`
- `solana-frontend.ts`
- `defi-solana.ts`
- `index.ts` (registry)

The registry enforces exactly 4 courses and exports one `courses: Course[]` array.

## Content Schema

Source types: `app/src/types/content.ts`

### Course

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable internal course identifier. |
| `slug` | `string` | URL slug used in routing (`/courses/[slug]`). |
| `title` | `string` | Display course title. |
| `description` | `string` | Summary used in cards and listings. |
| `difficulty` | `'beginner' \| 'intermediate' \| 'advanced'` | Course level. |
| `duration` | `string` | Human-readable estimated duration. |
| `totalXP` | `number` | Total XP available in the course. |
| `tags` | `string[]` | Search/filter tags. |
| `imageUrl` | `string` | Cover image path/URL. |
| `modules` | `Module[]` | Ordered set of modules. |

### Module

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable internal module identifier. |
| `title` | `string` | Module title shown in navigation. |
| `description` | `string` | Module summary text. |
| `lessons` | `Lesson[]` | Ordered module lessons. |

### Lesson

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable lesson identifier used for progress completion. |
| `slug` | `string` | Lesson URL slug segment. |
| `title` | `string` | Lesson title. |
| `type` | `'content' \| 'challenge'` | Lesson mode. |
| `content` | `string` | Markdown body shown to learner. |
| `xpReward` | `number` | XP reward for completion. |
| `duration` | `string` | Human-readable estimated completion time. |

### Challenge (extends Lesson)

| Field | Type | Description |
|---|---|---|
| `starterCode` | `string` | Initial code preloaded in editor. |
| `language` | `'typescript' \| 'rust'` | Challenge language mode. |
| `testCases` | `TestCase[]` | Evaluation cases used by challenge runner. |
| `hints` | `string[]` | Progressive hints, from broad to specific. |
| `solution` | `string` | Canonical reference implementation. |

### TestCase

| Field | Type | Description |
|---|---|---|
| `name` | `string` | User-facing test name. |
| `input` | `string` | Serialized test input consumed by runner. |
| `expectedOutput` | `string` | Exact expected output for pass condition. |

## Step-by-Step: Add a New Course

1. Create file: `app/src/lib/data/courses/<new-course>.ts`.
2. Export a typed `Course` object.
3. Add modules and lessons (keep deterministic lesson `id`s).
4. Register it in `app/src/lib/data/courses/index.ts` in `courses` array.
5. Recalculate `totalXP` and verify lessons render at `/[locale]/courses/[slug]`.
6. Run checks: `pnpm -C app lint && pnpm -C app typecheck && pnpm -C app test`.

## Step-by-Step: Add a Lesson

1. Pick course file and module.
2. Add a `Lesson` object with unique `id` and `slug`.
3. Ensure `content` includes technical context and practical examples.
4. Set `xpReward` and `duration` to match lesson scope.
5. Validate navigation: previous/next links and completion state in lesson page.

## Step-by-Step: Create a Challenge

1. Set `type: 'challenge'` and include challenge-only fields.
2. Write compile-safe `starterCode` that guides learner structure.
3. Add meaningful `testCases` that validate behavior, not only exact formatting.
4. Add 2-4 hints from conceptual to concrete.
5. Provide a full `solution` aligned with test expectations.
6. For Rust challenges, ensure solution includes structural patterns validated by `structural-checker.ts`.

## Content Guidelines

- Minimum 250 words per lesson.
- Use real Solana code examples (not pseudocode-only).
- Keep technical claims accurate and current for Solana Devnet workflows.
- Prefer explanatory sections followed by executable snippets.
- Keep naming consistent across lesson IDs, slugs, and challenge contexts.

## Challenge Guidelines

- `starterCode` should be runnable and intentionally incomplete.
- Tests should cover core requirements and one edge case.
- Hints should progress from general strategy to specific API usage.
- `solution` must pass all visible tests and match intended learning objective.

## Switching to Sanity / Strapi / Contentful

1. Implement `CourseContentService` for your CMS.
2. Add source selection in `getContentService()` factory.
3. Set environment variable `CONTENT_SOURCE` (for example: `sanity`, `strapi`, `contentful`).
4. Keep returned data mapped into existing `Course`/`Module`/`Lesson`/`Challenge` types.
5. Do not change consumer routes/components; they should remain interface-driven.

## Publishing Workflow

Recommended flow:

1. `Draft` - author content in branch or CMS draft model.
2. `Review` - technical review for correctness and testability.
3. `Publish` - merge/deploy and verify rendered lesson + challenge execution.

For local-file mode, map these states to PR lifecycle:

- Draft PR -> Review requested -> Merge to main.
