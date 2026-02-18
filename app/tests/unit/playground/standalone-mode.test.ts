import { describe, it, expect } from "vitest";
import { emptyWorkspaceTemplate } from "@/lib/playground/templates/empty";
import { createWorkspaceFromTemplate } from "@/lib/playground/workspace";
import type { WorkspaceMode } from "@/lib/playground/mode";

describe("emptyWorkspaceTemplate", () => {
  it("has id 'empty'", () => {
    expect(emptyWorkspaceTemplate.id).toBe("empty");
  });

  it("has at least one file", () => {
    expect(emptyWorkspaceTemplate.files.length).toBeGreaterThanOrEqual(1);
  });

  it("creates a valid workspace", () => {
    const workspace = createWorkspaceFromTemplate(emptyWorkspaceTemplate);
    expect(workspace.templateId).toBe("empty");
    expect(Object.keys(workspace.files).length).toBeGreaterThanOrEqual(1);
    expect(workspace.openFiles.length).toBeGreaterThanOrEqual(1);
    expect(workspace.activeFile).toBeTruthy();
  });
});

describe("standalone mode", () => {
  it("standalone mode has no quest data", () => {
    const mode: WorkspaceMode = { type: "standalone" };
    expect(mode.type).toBe("standalone");
    expect("quest" in mode).toBe(false);
    expect("template" in mode).toBe(false);
  });
});
