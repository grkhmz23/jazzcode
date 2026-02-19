# Token Engineering V2 Assets

This course folder powers the deterministic Token Engineering project journey.

## Project outcome

Students produce an offline "Token Launch Pack" that includes:

- deterministic token config validation
- pseudo-address derivation for mint and ATAs
- Token-2022-style initialization plan with selected extensions
- deterministic distribution + transfer fee simulation
- stable checkpoint summary for testing and audits

## Determinism policy

Core challenge paths in this folder never call RPC, wallet adapters, or external APIs.
All plan data is represented as serializable instruction-like objects so tests remain stable.

## Layout

- `project/constants.ts`:
  protocol constants and encoding version
- `project/types.ts`:
  canonical course data model
- `project/fixtures/`:
  sample token launch configs
- `project/address/derive.ts`:
  sha256-based pseudo mint/ATA derivation helpers
- `project/validation/validate.ts`:
  strict config + invariant validation
- `project/token2022/`:
  extension normalization and deterministic instruction encoding/planning
- `project/simulation/`:
  supply, transfer, and transfer-fee math (pure functions)
- `project/checkpoint/summary.ts`:
  stable `LaunchPackSummary` composer and fixture hash utility
- `challenges/`:
  browser challenge starter/solution/test data for lessons 4/5/6/8
