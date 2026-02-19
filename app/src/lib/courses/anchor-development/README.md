# Anchor Development V2 Course Assets

This folder contains deterministic assets for the `anchor-development` project-journey course.

## Goals

- Keep lesson challenge logic reproducible in CI without RPC access.
- Model a realistic Anchor counter workflow:
  - derive counter PDA
  - construct init and increment instruction payloads
  - serialize and mutate account state bytes deterministically
- Provide reusable helpers that unit tests can validate independently of UI challenge execution.

## Structure

- `project/idl.ts`
  - Typed instruction/account discriminator metadata used by helper logic.
- `project/counter.ts`
  - Deterministic PDA + instruction builders and pure state transition emulator.
- `challenges/lesson-4-counter-init/`
  - Browser challenge starter/solution/tests for init + PDA + instruction shape.
- `challenges/lesson-5-increment/`
  - Browser challenge starter/solution/tests for increment emulator behavior.
- `challenges/lesson-8-checkpoint/`
  - Browser challenge starter/solution/tests for combined checkpoint output.
- `local-state.ts`
  - Versioned local storage schema for optional per-user anchor course persistence.

## Determinism

All tests and challenge checks here are pure and do not call devnet, local validator, or external services.
