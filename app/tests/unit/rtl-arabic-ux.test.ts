import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getLocaleDirection, localeOptions } from "@/lib/i18n/locales";

describe("Arabic RTL UX QA", () => {
  it("keeps Arabic locale metadata configured as rtl", () => {
    const arabic = localeOptions.find((entry) => entry.code === "ar");
    expect(arabic).toBeDefined();
    expect(arabic?.dir).toBe("rtl");
    expect(getLocaleDirection("ar")).toBe("rtl");
  });

  it("avoids directional spacing classes in header layout", () => {
    const headerPath = join(process.cwd(), "src", "components", "layout", "header.tsx");
    const source = readFileSync(headerPath, "utf8");

    // Prefer direction-agnostic spacing (gap/flex) over left/right margins in shared nav layout.
    expect(source).not.toMatch(/\bspace-x-\d+/);
    expect(source).not.toMatch(/\bmr-\d+/);
  });

  it("uses bidi-safe handling for truncation and mixed LTR labels", () => {
    const headerPath = join(process.cwd(), "src", "components", "layout", "header.tsx");
    const cssPath = join(process.cwd(), "src", "styles", "globals.css");
    const headerSource = readFileSync(headerPath, "utf8");
    const cssSource = readFileSync(cssPath, "utf8");

    // Truncated user names should preserve visual order in RTL/LTR mixed text.
    expect(headerSource).toContain('dir="auto"');
    expect(headerSource).toContain("bidi-safe");

    // Product labels with Latin tokens inside RTL UI should remain stable.
    expect(headerSource).toContain("ltr-isolate");

    // Utility classes must exist globally to support broader UI rollout.
    expect(cssSource).toContain(".bidi-safe");
    expect(cssSource).toContain("unicode-bidi: plaintext");
    expect(cssSource).toContain(".ltr-isolate");
    expect(cssSource).toContain("unicode-bidi: isolate");
  });
});
