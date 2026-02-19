# Solana Frontend V2 - Token Dashboard Journey

This module powers the deterministic "Solana Frontend" course project journey.

## Learning objective

Students build a frontend-ready state engine from onchain-like event fixtures, then compose replay, query, and checkpoint layers without RPC dependencies.

## Architecture

- `project/model/`: state shape, reducer, selectors.
- `project/stream/`: deterministic stream simulation + snapshot replay.
- `project/queries/`: search/filter/sort for dashboard views.
- `project/checkpoint/`: invariant checks + stable summary JSON output.
- `project/fixtures/`: deterministic event streams used by lessons/tests.
- `challenges/`: lesson runner starter/solution/hints/test cases.

## Determinism rules

- Event replay sorted by `(ts, id)`.
- Event IDs are idempotent.
- Corrections remove replaced-event effects.
- USD math uses fixed-scale integers (1e6 micro USD).
- Checkpoint output uses canonical fixture hashing and stable key order.
