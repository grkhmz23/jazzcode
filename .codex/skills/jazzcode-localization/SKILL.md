---
name: jazzcode-localization
description: Use this skill for multilingual and localization tasks in jazzcode, including next-intl locale routing, message files, fallback behavior, RTL handling, and translation rollouts for site and course content.
---

# Jazzcode Localization Skill

Use this skill when the task involves internationalization/localization.

## Scope

- Locale setup and routing under `app/src/lib/i18n/*`
- Message bundles under `app/src/messages/*.json`
- Locale-aware UI controls (language switchers, labels, metadata)
- RTL support for Arabic
- Translation fallback behavior
- Course-content localization rollout planning

## Supported Locales

- `en` (default)
- `es`
- `pt-BR`
- `fr`
- `it`
- `de`
- `zh-CN`
- `ar`

## Workflow

1. Update locale lists/types in i18n routing/request config.
2. Ensure message files exist for each locale.
3. Add safe fallback to English for missing bundles.
4. Update language selectors to derive options from central locale metadata.
5. Validate RTL (`dir="rtl"`) for Arabic.
6. Update/add tests for locale matrix and middleware behavior.

## Guardrails

- Never hardcode locale unions in UI components; import `Locale`.
- Keep locale options centralized (`label`, `flag`, `dir`).
- Prefer incremental translation rollout with complete key parity.
- If full course text translation is not yet available, keep runtime stable via English fallback while preparing content packs.
