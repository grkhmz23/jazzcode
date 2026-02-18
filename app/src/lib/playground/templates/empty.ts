import { WorkspaceTemplate } from "@/lib/playground/types";

export const emptyWorkspaceTemplate: WorkspaceTemplate = {
  id: "empty",
  title: "Empty Workspace",
  description: "A blank workspace to start from scratch.",
  files: [
    {
      path: "main.ts",
      content: [
        "// Welcome to the JazzCode Playground!",
        "// Start coding here or import a project.",
        "",
        "console.log(\"Hello, playground!\");",
      ].join("\n"),
    },
  ],
};
