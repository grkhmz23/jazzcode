import { describe, it, expect } from "vitest";
import { getMission } from "@/lib/playground/missions/registry";
import { createWorkspaceFromTemplate } from "@/lib/playground/workspace";
import { evaluateQuest } from "@/lib/playground/tasks/runner";
import { createInitialTerminalState } from "@/lib/playground/terminal/engine";

describe("mission mode", () => {
  const mission = getMission("solana-fundamentals-cli-wallet-manager");

  it("loads the correct quest", () => {
    expect(mission).not.toBeNull();
    expect(mission!.quest.id).toBe("solana-fundamentals-cli-wallet-manager");
    expect(mission!.quest.title).toContain("Solana Fundamentals");
  });

  it("loads the correct template", () => {
    expect(mission!.template.files.length).toBeGreaterThan(0);
    const workspace = createWorkspaceFromTemplate(mission!.template);
    expect(Object.keys(workspace.files).length).toBeGreaterThan(0);
  });

  it("evaluateQuest works against loaded mission", () => {
    const workspace = createWorkspaceFromTemplate(mission!.template);
    const terminal = createInitialTerminalState();

    const results = evaluateQuest(mission!.quest, {
      workspace,
      terminalState: terminal,
      checkpoints: [],
    });

    expect(results.length).toBe(mission!.quest.tasks.length);
    // First task should not be locked (no prerequisites)
    expect(results[0].locked).toBe(false);
    // First task should not be complete initially
    expect(results[0].complete).toBe(false);
  });
});
