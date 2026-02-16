import { Mission, MissionScore, MissionStats, Objective, Quest, VFSNode, ChainState } from "@/lib/devlab/types";
import { getFile } from "@/lib/devlab/vfs";

export function evaluateObjective(
  objective: Objective,
  lastCommand: string,
  chainState: ChainState,
  vfs: VFSNode
): boolean {
  const validation = objective.validation;

  if (validation.type === "command_match") {
    try {
      return new RegExp(validation.pattern).test(lastCommand.trim());
    } catch {
      return false;
    }
  }

  if (validation.type === "file_contains") {
    const content = getFile(vfs, validation.path);
    if (content === null) return false;
    try {
      return new RegExp(validation.pattern, "m").test(content);
    } catch {
      return false;
    }
  }

  if (validation.type === "state_predicate") {
    const wallet = chainState.defaultWallet ? chainState.wallets[chainState.defaultWallet] : null;
    const balance = wallet?.balance ?? 0;
    const programs = Object.keys(chainState.programs).length;
    if (validation.check === "balance > 0") return balance > 0;
    if (validation.check === "balance > 2") return balance > 2;
    if (validation.check === "programs.length > 0") return programs > 0;
    if (validation.check.includes("balance < 100")) return balance < 100;
    return false;
  }

  return false;
}

export function calculateScore(mission: Mission, stats: MissionStats): MissionScore {
  const timeSeconds = Math.floor((Date.now() - stats.startedAt) / 1000);
  const cleanRun = stats.hintsUsed === 0 && stats.errorsEncountered === 0;
  const speedBonus = timeSeconds <= 240 ? Math.floor(mission.xpReward * 0.2) : 0;
  const cleanBonus = cleanRun ? Math.floor(mission.xpReward * 0.15) : 0;
  const hintPenalty = stats.hintsUsed > 1 ? (stats.hintsUsed - 1) * 10 : 0;
  const bonusXP = Math.max(0, speedBonus + cleanBonus - hintPenalty);

  return {
    timeSeconds,
    commandsUsed: stats.commandsUsed,
    hintsUsed: stats.hintsUsed,
    errorsEncountered: stats.errorsEncountered,
    cleanRun,
    xpAwarded: mission.xpReward + bonusXP,
    bonusXP,
  };
}

export function evaluateMission(mission: Mission, progress: Record<string, boolean>, stats: MissionStats): { complete: boolean; score: MissionScore } {
  const complete = mission.objectives.every((objective) => progress[objective.id]);
  return {
    complete,
    score: calculateScore(mission, stats),
  };
}

export function getNextMission(quest: Quest, completedMissionIds: string[]): Mission | null {
  const next = quest.missions.find((mission) => !completedMissionIds.includes(mission.id));
  return next ?? null;
}
