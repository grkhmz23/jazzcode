/**
 * Workbench library exports
 */

// Core types
export * from "./types";

// File system
export * from "./fs";

// Terminal
export * from "./terminal/engine";
export * from "./terminal/errors";
export * from "./terminal/commands/core";
export * from "./terminal/commands/git";
export * from "./terminal/commands/solana";
export * from "./terminal/commands/anchor";
export * from "./terminal/commands/spl-token";

// State management
export { createWorkspaceFromDefinition, deserializeWorkspace, serializeWorkspace, setActiveFile, closeFile, updateSimulationState, setCurrentDirectory, resetWorkspace, saveToStorage, loadFromStorage, clearStorage } from "./state";

// Task evaluators
export { evaluateQuest, getQuestById, solanaFundamentalsQuest } from "./evaluators";
