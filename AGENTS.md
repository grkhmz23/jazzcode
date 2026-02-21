## Skills

A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used.

### Available skills
- jazzcode-project: Default skill for all tasks in this repository (stack, architecture, workflows, tests). (file: /workspaces/jazzcode/.codex/skills/jazzcode-project/SKILL.md)
- jazzcode-localization: Use for i18n/l10n work (locale config, translation files, fallback, RTL, multilingual rollout). (file: /workspaces/jazzcode/.codex/skills/jazzcode-localization/SKILL.md)
- skill-creator: Guide for creating effective skills. (file: /home/codespace/.codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Install Codex skills from curated list or GitHub path. (file: /home/codespace/.codex/skills/.system/skill-installer/SKILL.md)

### How to use skills
- Trigger rules:
  - Always use `jazzcode-project` for any task under `/workspaces/jazzcode`.
  - Use `jazzcode-localization` for any multilingual/translation/locale/RTL request.
  - Use additional skills only when directly requested or clearly needed.
- Progressive disclosure:
  - Open `SKILL.md` first and only read extra files if needed.
- Fallback:
  - If a skill is missing/unreadable, continue with best-effort repo-safe workflow.
