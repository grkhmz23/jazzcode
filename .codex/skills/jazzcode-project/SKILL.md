---
name: jazzcode-project
description: Use this skill for any task in the jazzcode repository. Covers repo architecture, TypeScript/Next.js/Solana workflow, test strategy, and safe edit/run commands.
---

# Jazzcode Project Skill

Use this skill for any work under `/workspaces/jazzcode`.

## Stack and Languages

- TypeScript (strict), Node.js 20+, React 18, Next.js 14 App Router
- Tailwind CSS, PostCSS
- Prisma ORM (schema + seed), SQL-backed persistence
- Solana JavaScript stack: `@solana/web3.js`, wallet adapters, SPL Token
- Testing: Vitest (unit), Playwright (e2e), Node test runner for `runner/`

## Repo Map

- `app/`: main product app (Next.js, APIs, UI, course/playground logic)
- `app/src/app/`: routes, layouts, API route handlers
- `app/src/lib/`: domain logic (playground, workspace, services, security, courses)
- `app/tests/unit/`: primary regression suite
- `app/tests/e2e/`: browser flows
- `app/prisma/`: database schema and seed
- `runner/`: isolated TS runner service with its own tests

## Default Workflow

1. Read only the files needed for the task (`rg`, `sed`).
2. Implement minimal changes with existing patterns.
3. Run targeted checks first, then broader checks if needed.
4. Report changed files, behavior impact, and any unrun checks.

## Commands

- Root:
  - `pnpm dev`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
- App package:
  - `pnpm -C app dev|lint|typecheck|test|test:e2e|build`
  - `pnpm -C app db:generate|db:push|db:seed`
- Runner package:
  - `pnpm -C runner dev|start|test`

## Engineering Rules

- Prefer TypeScript-first fixes with explicit types at boundaries.
- Keep API handlers small; move business logic into `app/src/lib/*`.
- Preserve i18n behavior and locale route structure (`[locale]` segments).
- For Solana changes, validate signer, PDA/authority, and input checks.
- Add or update tests with every behavior change.
- Avoid broad refactors unless explicitly requested.

## Testing Heuristics

- Playground/workspace/terminal changes:
  - run affected unit tests in `app/tests/unit/playground/*`
- Course content or schema logic:
  - run targeted `app/tests/unit/courses/*.test.ts`
- API/service/auth/progress changes:
  - run nearest unit tests plus `pnpm -C app test`
- Runner changes:
  - run `pnpm -C runner test`

## Done Criteria

- Relevant tests pass for changed behavior.
- No TypeScript regressions in touched areas.
- Changes are minimal, reversible, and documented in final summary.
