import { describe, it, expect } from "vitest";
import { locales, defaultLocale, localePrefix } from "@/lib/i18n/routing";
import { locales as requestLocales, defaultLocale as requestDefaultLocale } from "@/lib/i18n/request";

describe("i18n Configuration", () => {
  describe("Routing", () => {
    it("should have expected locales", () => {
      expect(locales).toContain("en");
      expect(locales).toContain("es");
      expect(locales).toContain("pt-BR");
      expect(locales).toContain("fr");
      expect(locales).toContain("it");
      expect(locales).toContain("de");
      expect(locales).toContain("zh-CN");
      expect(locales).toContain("ar");
      expect(locales).toHaveLength(8);
    });

    it("should have en as default locale", () => {
      expect(defaultLocale).toBe("en");
    });

    it("should use as-needed locale prefix", () => {
      expect(localePrefix).toBe("as-needed");
    });
  });

  describe("Request Config", () => {
    it("should have matching locales in request config", () => {
      expect(requestLocales).toEqual(locales);
    });

    it("should have matching default locale in request config", () => {
      expect(requestDefaultLocale).toBe(defaultLocale);
    });
  });

  describe("Locale Detection", () => {
    it("should accept valid locales", () => {
      const validLocales = ["en", "es", "pt-BR", "fr", "it", "de", "zh-CN", "ar"];
      
      for (const locale of validLocales) {
        expect(locales).toContain(locale);
      }
    });

    it("should not accept invalid locales", () => {
      const invalidLocales = ["pt", "zh", "invalid"];
      
      for (const locale of invalidLocales) {
        expect(locales).not.toContain(locale);
      }
    });
  });
});

describe("Middleware Configuration", () => {
  it("should have correct matcher pattern", async () => {
    // Import middleware to verify matcher config
    const middlewareModule = await import("@/middleware");
    
    expect(middlewareModule.config).toBeDefined();
    expect(middlewareModule.config.matcher).toBeDefined();
    
    const matcher = middlewareModule.config.matcher;
    expect(Array.isArray(matcher)).toBe(true);
    expect(matcher[0]).toContain("api");
    expect(matcher[0]).toContain("_next");
  });
});
