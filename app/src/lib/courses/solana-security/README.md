# Solana Security V2 (Deterministic Vuln Lab)

This course package implements an offline, deterministic security lab for Solana program auditing.

## Scope

- Vault program model with `init_vault` and `withdraw` semantics for security reasoning.
- Vulnerable runtime and fixed runtime variants.
- Reproducible exploit scenarios:
  - missing signer check
  - missing owner check
  - PDA spoof via weak derivation validation
- Deterministic trace events and SHA-256 trace hashes.
- Deterministic audit artifacts:
  - structured `AuditReport` JSON
  - concise markdown summary

## Determinism design

- No RPC or devnet calls.
- No wallet adapter dependency.
- Stable scenario fixtures and ordered replay.
- Canonical JSON + hash for fixture and trace evidence.

## Course/challenge integration

Challenge modules export starter code, solution code, hints, and deterministic test cases for lessons 4, 5, 6, and 8.
