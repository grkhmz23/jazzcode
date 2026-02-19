import { describe, expect, it } from "vitest";
import { Schemas } from "@/lib/api/validation";
import { locales } from "@/lib/i18n/routing";

describe("Schemas.locale", () => {
  it("stays in sync with i18n locales", () => {
    expect(Schemas.locale.options).toEqual(locales);
  });

  it("accepts every supported locale", () => {
    for (const locale of locales) {
      expect(Schemas.locale.safeParse(locale).success).toBe(true);
    }
  });

  it("rejects invalid locale values", () => {
    const invalidLocales = ["pt", "zh", "invalid", "en-US"];
    for (const locale of invalidLocales) {
      expect(Schemas.locale.safeParse(locale).success).toBe(false);
    }
  });
});
