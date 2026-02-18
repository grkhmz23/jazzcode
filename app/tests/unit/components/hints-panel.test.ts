import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HintsPanel, nextRevealCount, normalizeHints } from "@/components/lessons/HintsPanel";

describe("HintsPanel", () => {
  it("renders non-empty state when no hints are provided", () => {
    const html = renderToStaticMarkup(React.createElement(HintsPanel, { hints: [], defaultOpen: true }));

    expect(html).toContain("No hints were provided for this challenge yet.");
    expect(html).toContain("Report issue");
  });

  it("normalizes mixed hints and drops blank values", () => {
    const normalized = normalizeHints([
      "  first hint  ",
      "   ",
      { body: "second hint", title: "Tip" },
      { body: "   " },
    ]);

    expect(normalized).toEqual([
      { body: "first hint", kind: "text" },
      { body: "second hint", title: "Tip", kind: "text" },
    ]);
  });

  it("supports markdown content safely", () => {
    const html = renderToStaticMarkup(
      React.createElement(HintsPanel, {
        hints: ["Use code:\n```ts\nconst amount = 1;\n```"],
        defaultOpen: true,
      }),
    );

    expect(html).toContain("Use code:");
    expect(html).toContain("const amount = 1;");
    expect(html).toContain("<code");
  });

  it("reveals hints progressively", () => {
    expect(nextRevealCount(0, 3)).toBe(1);
    expect(nextRevealCount(1, 3)).toBe(2);
    expect(nextRevealCount(2, 3)).toBe(3);
    expect(nextRevealCount(3, 3)).toBe(3);
    expect(nextRevealCount(0, 0)).toBe(0);
  });
});
