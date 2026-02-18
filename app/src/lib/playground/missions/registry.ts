import { MissionDescriptor } from "@/lib/playground/mode";
import { solanaFundamentalsQuest } from "@/lib/playground/tasks/solana-fundamentals";
import { solanaFundamentalsTemplate } from "@/lib/playground/templates/solana-fundamentals";

const missions = new Map<string, MissionDescriptor>();

function registerMission(quest: MissionDescriptor["quest"], template: MissionDescriptor["template"]): void {
  missions.set(quest.id, { questId: quest.id, quest, template });
}

// --- Register missions ---
registerMission(solanaFundamentalsQuest, solanaFundamentalsTemplate);

// --- Public API ---

export function getMission(questId: string): MissionDescriptor | null {
  return missions.get(questId) ?? null;
}

export function listMissions(): MissionDescriptor[] {
  return Array.from(missions.values());
}
