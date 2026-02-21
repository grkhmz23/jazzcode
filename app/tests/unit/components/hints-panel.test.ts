import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { HintsPanel, nextRevealCount, normalizeHints } from "@/components/lessons/HintsPanel";

const lessonMessages = {
  hintsTitle: "Hints",
  revealNextHint: "Reveal next",
  revealAllHints: "Reveal all",
  noHintsYet: "No hints were provided for this challenge yet.",
  reportHintDataIssue: "If this looks wrong, report the challenge so we can fix the lesson data.",
  reportIssue: "Report issue",
  hintsAvailable: "Hints are available for this challenge.",
  useRevealNextHint: "Use \"Reveal next\" to see one hint at a time.",
};

function renderHintsPanel(props: React.ComponentProps<typeof HintsPanel>) {
  const Provider =
    NextIntlClientProvider as React.ComponentType<
      React.PropsWithChildren<{
        locale: string;
        timeZone: string;
        messages: { lesson: typeof lessonMessages };
      }>
    >;

  return renderToStaticMarkup(
    React.createElement(
      Provider,
      { locale: "en", timeZone: "UTC", messages: { lesson: lessonMessages } },
      React.createElement(HintsPanel, props)
    )
  );
}

describe("HintsPanel", () => {
  it("renders non-empty state when no hints are provided", () => {
    const html = renderHintsPanel({ hints: [], defaultOpen: true });

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
    const html = renderHintsPanel({
      hints: ["Use code:\n```ts\nconst amount = 1;\n```"],
      defaultOpen: true,
    });

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
