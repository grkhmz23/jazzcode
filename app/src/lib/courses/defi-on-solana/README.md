# DeFi on Solana V2 (Offline Jupiter-Style Planner)

This module implements a deterministic swap planner for course progression and tests.

## Scope

- token + pool universe model
- constant-product quote engine
- 1-hop and 2-hop route enumeration
- deterministic route ranking and tie-breaking
- slippage/minOut and safety invariants
- stable swap plan + swap summary checkpoint outputs

## Determinism

- no RPC/Jupiter/wallet adapter dependencies
- integer arithmetic only for core routing/quote math
- canonical JSON hashing for fixture fingerprints
- stable sorting at every ranking boundary
