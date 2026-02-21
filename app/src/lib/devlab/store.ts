import { get, set as idbSet } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { interpretCommand } from "@/lib/devlab/command-interpreter";
import { createInitialState } from "@/lib/devlab/chain-state";
import { getQuestByTrack } from "@/lib/data/devlab-quests";
import {
  evaluateMission,
  evaluateObjective,
  getNextMission,
} from "@/lib/devlab/quest-engine";
import {
  createDefaultProject,
  createDir,
  createFile,
  deleteNode as deleteVfsNode,
  getFile,
  setFile,
} from "@/lib/devlab/vfs";
import {
  ChainState,
  CommandResult,
  Mission,
  MissionScore,
  MissionStats,
  Quest,
  VFSNode,
} from "@/lib/devlab/types";

type Track = Quest["track"];

type DevLabStore = {
  vfs: VFSNode;
  currentDir: string;
  openFiles: string[];
  activeFile: string | null;
  chainState: ChainState;
  trackSelected: boolean;
  currentTrack: Track;
  currentMissionIndex: number;
  completedMissions: Record<string, MissionScore>;
  objectiveStatus: Record<string, boolean>;
  commandHistory: string[];
  commandCount: number;
  errorCount: number;
  hintsUsed: number;
  sessionStartTime: number;
  missionStats: MissionStats;
  totalXP: number;
  badges: string[];
  terminalOutputInstant: boolean;
  loadProgress: () => void;
  executeCommand: (cmd: string) => CommandResult;
  openFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  createVfsFile: (path: string) => void;
  createVfsDir: (path: string) => void;
  deleteVfsNode: (path: string) => void;
  closeFile: (path: string) => void;
  selectTrack: (trackId: Track) => void;
  nextMission: () => void;
  useHint: () => string | null;
  resetProgress: () => void;
  setPanelSize: (key: "left" | "right" | "bottom", value: number) => void;
  panelSizes: { left: number; right: number; bottom: number };
};

const memoryStore = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: async (name) => {
    try {
      const value = await idbGet(name);
      if (value) return value;
      return memoryStore.get(name) ?? null;
    } catch {
      return memoryStore.get(name) ?? null;
    }
  },
  setItem: async (name, value) => {
    memoryStore.set(name, value);
    try {
      await idbSet(name, value);
    } catch {
      // no-op fallback keeps in memory
    }
  },
  removeItem: async (name) => {
    memoryStore.delete(name);
  },
};

async function idbGet(key: string): Promise<string | null> {
  const value = await get(key);
  return typeof value === "string" ? value : null;
}

function missionFor(state: DevLabStore): Mission {
  return getQuestByTrack(state.currentTrack).missions[state.currentMissionIndex];
}

function resolveEditorPath(path: string): string {
  return path.startsWith("my-solana-project/") ? path : `my-solana-project/${path.replace(/^\/+/, "")}`;
}

function initialMissionStats(): MissionStats {
  return {
    startedAt: Date.now(),
    commandsUsed: 0,
    hintsUsed: 0,
    errorsEncountered: 0,
  };
}

function initialState(): Omit<
  DevLabStore,
  | "loadProgress"
  | "executeCommand"
  | "openFile"
  | "updateFile"
  | "createVfsFile"
  | "createVfsDir"
  | "deleteVfsNode"
  | "closeFile"
  | "selectTrack"
  | "nextMission"
  | "useHint"
  | "resetProgress"
  | "setPanelSize"
> {
  const chain = createInitialState();
  return {
    vfs: createDefaultProject(),
    currentDir: chain.currentDir,
    openFiles: ["my-solana-project/programs/my_program/src/lib.rs"],
    activeFile: "my-solana-project/programs/my_program/src/lib.rs",
    chainState: chain,
    trackSelected: false,
    currentTrack: "foundation",
    currentMissionIndex: 0,
    completedMissions: {},
    objectiveStatus: {},
    commandHistory: [],
    commandCount: 0,
    errorCount: 0,
    hintsUsed: 0,
    sessionStartTime: Date.now(),
    missionStats: initialMissionStats(),
    totalXP: 0,
    badges: [],
    terminalOutputInstant: false,
    panelSizes: { left: 250, right: 320, bottom: 250 },
  };
}

export const useDevLabStore = create<DevLabStore>()(
  persist(
    (setState, getState) => ({
      ...initialState(),
      loadProgress: () => {
        // Persist middleware handles hydration. This allows explicit mount call.
      },
      setPanelSize: (key, value) => {
        setState((state) => ({
          panelSizes: {
            ...state.panelSizes,
            [key]: value,
          },
        }));
      },
      executeCommand: (cmd) => {
        const state = getState();
        const outcome = interpretCommand({
          command: cmd,
          chainState: state.chainState,
          vfs: state.vfs,
        });

        const mission = missionFor(state);
        const nextObjectiveStatus = { ...state.objectiveStatus };
        const updatedMissionStats = {
          ...state.missionStats,
          commandsUsed: state.missionStats.commandsUsed + 1,
          errorsEncountered:
            state.missionStats.errorsEncountered + (outcome.result.exitCode !== 0 ? 1 : 0),
        };

        mission.objectives.forEach((objective) => {
          if (nextObjectiveStatus[objective.id]) return;
          const pass = evaluateObjective(
            objective,
            cmd,
            outcome.chainState,
            outcome.vfs
          );
          if (pass) {
            nextObjectiveStatus[objective.id] = true;
          }
        });

        const evalMission = evaluateMission(mission, nextObjectiveStatus, updatedMissionStats);
        let totalXP = state.totalXP;
        const completedMissions = { ...state.completedMissions };

        if (evalMission.complete && !completedMissions[mission.id]) {
          completedMissions[mission.id] = evalMission.score;
          totalXP += evalMission.score.xpAwarded;
        }

        setState({
          vfs: outcome.vfs,
          chainState: outcome.chainState,
          currentDir: outcome.chainState.currentDir,
          commandHistory: [...state.commandHistory, cmd],
          commandCount: state.commandCount + 1,
          errorCount: state.errorCount + (outcome.result.exitCode !== 0 ? 1 : 0),
          missionStats: updatedMissionStats,
          objectiveStatus: nextObjectiveStatus,
          completedMissions,
          totalXP,
        });

        return outcome.result;
      },
      openFile: (path) => {
        const state = getState();
        const normalized = resolveEditorPath(path);
        const openFiles = state.openFiles.includes(normalized)
          ? state.openFiles
          : [...state.openFiles, normalized];

        const mission = missionFor(state);
        const objectiveStatus = { ...state.objectiveStatus };
        for (const objective of mission.objectives) {
          if (objectiveStatus[objective.id]) continue;
          if (objective.validation.type !== "file_contains") continue;
          if (objective.validation.path === normalized) {
            objectiveStatus[objective.id] = true;
          }
        }

        setState({
          openFiles,
          activeFile: normalized,
          objectiveStatus,
        });
      },
      updateFile: (path, content) => {
        const state = getState();
        const normalized = resolveEditorPath(path);
        const vfs = setFile(state.vfs, normalized, content);
        const mission = missionFor(state);
        const objectiveStatus = { ...state.objectiveStatus };

        for (const objective of mission.objectives) {
          if (objectiveStatus[objective.id]) continue;
          const pass = evaluateObjective(objective, "", state.chainState, vfs);
          if (pass) objectiveStatus[objective.id] = true;
        }

        setState({ vfs, objectiveStatus });
      },
      createVfsFile: (path) => {
        const state = getState();
        const normalized = resolveEditorPath(path);
        setState({ vfs: createFile(state.vfs, normalized, "") });
      },
      createVfsDir: (path) => {
        const state = getState();
        const normalized = resolveEditorPath(path);
        setState({ vfs: createDir(state.vfs, normalized) });
      },
      deleteVfsNode: (path) => {
        const state = getState();
        const normalized = resolveEditorPath(path);
        setState({
          vfs: deleteVfsNode(state.vfs, normalized),
          openFiles: state.openFiles.filter((filePath) => filePath !== normalized),
          activeFile: state.activeFile === normalized ? null : state.activeFile,
        });
      },
      closeFile: (path) => {
        const state = getState();
        const openFiles = state.openFiles.filter((item) => item !== path);
        setState({
          openFiles,
          activeFile: state.activeFile === path ? (openFiles[openFiles.length - 1] ?? null) : state.activeFile,
        });
      },
      selectTrack: (trackId) => {
        const track = getQuestByTrack(trackId);
        setState({
          trackSelected: true,
          currentTrack: track.track,
          currentMissionIndex: 0,
          objectiveStatus: {},
          missionStats: initialMissionStats(),
        });
      },
      nextMission: () => {
        const state = getState();
        const quest = getQuestByTrack(state.currentTrack);
        const current = quest.missions[state.currentMissionIndex];
        if (!current) return;

        const completion = evaluateMission(current, state.objectiveStatus, state.missionStats);
        if (!completion.complete) return;

        const completedIds = Object.keys(state.completedMissions);
        const next = getNextMission(quest, completedIds);
        if (!next) return;

        const nextIndex = quest.missions.findIndex((mission) => mission.id === next.id);
        setState({
          currentMissionIndex: nextIndex,
          objectiveStatus: {},
          missionStats: initialMissionStats(),
        });
      },
      useHint: () => {
        const state = getState();
        const mission = missionFor(state);
        const alreadyUsed = state.missionStats.hintsUsed;
        if (alreadyUsed >= mission.hints.length) return null;

        const hint = mission.hints[alreadyUsed];
        const xpCost = alreadyUsed >= 1 ? 10 : 0;
        setState({
          hintsUsed: state.hintsUsed + 1,
          totalXP: Math.max(0, state.totalXP - xpCost),
          missionStats: {
            ...state.missionStats,
            hintsUsed: state.missionStats.hintsUsed + 1,
          },
        });
        return hint;
      },
      resetProgress: () => {
        setState(initialState());
      },
    }),
    {
      name: "devlab-progress",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        vfs: state.vfs,
        currentDir: state.currentDir,
        openFiles: state.openFiles,
        activeFile: state.activeFile,
        chainState: state.chainState,
        trackSelected: state.trackSelected,
        currentTrack: state.currentTrack,
        currentMissionIndex: state.currentMissionIndex,
        completedMissions: state.completedMissions,
        objectiveStatus: state.objectiveStatus,
        commandHistory: state.commandHistory,
        commandCount: state.commandCount,
        errorCount: state.errorCount,
        hintsUsed: state.hintsUsed,
        sessionStartTime: state.sessionStartTime,
        missionStats: state.missionStats,
        totalXP: state.totalXP,
        badges: state.badges,
        terminalOutputInstant: state.terminalOutputInstant,
        panelSizes: state.panelSizes,
      }),
    }
  )
);

export function getActiveMissionFromStore(state: DevLabStore): Mission {
  return getQuestByTrack(state.currentTrack).missions[state.currentMissionIndex];
}

export function readActiveFileContent(state: DevLabStore): string {
  if (!state.activeFile) return "";
  return getFile(state.vfs, state.activeFile) ?? "";
}
