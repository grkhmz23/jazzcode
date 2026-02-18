import { describe, it, expect } from "vitest";
import { getMission, listMissions } from "@/lib/playground/missions/registry";

describe("getMission", () => {
  it("returns the solana-fundamentals mission", () => {
    const mission = getMission("solana-fundamentals-cli-wallet-manager");
    expect(mission).not.toBeNull();
    expect(mission!.questId).toBe("solana-fundamentals-cli-wallet-manager");
    expect(mission!.quest.tasks.length).toBeGreaterThan(0);
    expect(mission!.template.files.length).toBeGreaterThan(0);
  });

  it("returns null for unknown quest ID", () => {
    expect(getMission("does-not-exist")).toBeNull();
    expect(getMission("")).toBeNull();
  });
});

describe("listMissions", () => {
  it("returns an array with at least one mission", () => {
    const missions = listMissions();
    expect(Array.isArray(missions)).toBe(true);
    expect(missions.length).toBeGreaterThanOrEqual(1);
  });

  it("each mission has required fields", () => {
    for (const mission of listMissions()) {
      expect(mission.questId).toBeTruthy();
      expect(mission.quest).toBeTruthy();
      expect(mission.quest.id).toBe(mission.questId);
      expect(mission.template).toBeTruthy();
    }
  });
});
