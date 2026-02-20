import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { locales, defaultLocale } from "@/lib/i18n/routing";

function flattenKeys(value: unknown, parent = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return parent ? [parent] : [];
  }

  const out: string[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const path = parent ? `${parent}.${key}` : key;
    out.push(...flattenKeys(nested, path));
  }
  return out;
}

describe("messages locale parity", () => {
  const baseDir = join(process.cwd(), "src", "messages");
  const englishMessages = JSON.parse(
    readFileSync(join(baseDir, `${defaultLocale}.json`), "utf8")
  ) as Record<string, unknown>;
  const englishKeys = new Set(flattenKeys(englishMessages));

  it("keeps all non-default locales in sync with English message keys", () => {
    for (const locale of locales) {
      if (locale === defaultLocale) continue;

      const localeMessages = JSON.parse(
        readFileSync(join(baseDir, `${locale}.json`), "utf8")
      ) as Record<string, unknown>;
      const localeKeys = new Set(flattenKeys(localeMessages));

      const missing = [...englishKeys].filter((key) => !localeKeys.has(key));
      const extra = [...localeKeys].filter((key) => !englishKeys.has(key));

      expect(missing, `${locale} missing keys`).toEqual([]);
      expect(extra, `${locale} extra keys`).toEqual([]);
    }
  });
});
