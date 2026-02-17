# Solana Frontend Development V2 Assets

This directory contains deterministic project-journey assets for the `solana-frontend` course.

## Project Goal

Build a "Token Dashboard dApp (Read-only + Transaction Builder)" with a network-optional architecture:

- Parse mocked RPC responses for token account views.
- Build offline transaction plans for SOL and SPL token transfers.
- Compose a stable dashboard + transfer summary checkpoint.

## Why deterministic

Course challenges and unit tests in this folder run without RPC/wallet dependencies by default. This keeps CI reliable and focuses students on frontend correctness:

- input validation
- serialization
- instruction key ordering and flags
- explicit error handling

## Structure

- `project/types.ts`
  - Core shared types for parser and transaction builder outputs.
- `project/rpc-fixtures/`
  - Stable JSON fixtures used by parser logic and tests.
- `project/parsers/spl-token-accounts.ts`
  - Pure parser + validation for `getTokenAccountsByOwner` style payloads.
- `project/tx-builders/sol-transfer.ts`
  - Offline System Program transfer plan builder.
- `project/tx-builders/spl-transfer.ts`
  - Offline SPL transfer-checked plan builder.
- `project/ui/checkpoint.ts`
  - Composition helper for final dashboard + tx plan summary.
- `challenges/...`
  - Lesson challenge starter/solution/tests for browser runner.
