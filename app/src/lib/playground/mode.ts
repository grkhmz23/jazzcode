import { TaskQuest } from "@/lib/playground/tasks/types";
import { WorkspaceTemplate } from "@/lib/playground/types";

export interface MissionDescriptor {
  questId: string;
  quest: TaskQuest;
  template: WorkspaceTemplate;
}

export type WorkspaceMode =
  | { type: "standalone" }
  | { type: "mission"; questId: string; quest: TaskQuest; template: WorkspaceTemplate };
