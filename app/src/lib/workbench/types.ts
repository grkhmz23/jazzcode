/**
 * Core types for the Workbench system
 * Strict TypeScript definitions for workspace, terminal, tasks, and events
 */

import type { DirectoryNode, FileLanguage } from "./fs";
export type { FileLanguage, FileNode, FSNode } from "./fs";

// ============================================================================
// Workspace Types
// ============================================================================

export interface WorkspaceFile {
  path: string;
  content: string;
  language: FileLanguage;
}

export interface WorkspaceDefinition {
  id: string;
  title: string;
  description: string;
  files: WorkspaceFile[];
  initialTerminalLines?: string[];
}

export interface WorkspaceState {
  definitionId: string;
  fs: DirectoryNode;
  openFiles: string[];
  activeFilePath: string | null;
  currentDirectory: string;
  simulation: SimulationState;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Terminal Types
// ============================================================================

export type TerminalEntryKind = "input" | "output" | "error" | "system";

export interface TerminalEntry {
  id: string;
  kind: TerminalEntryKind;
  text: string;
  timestamp: number;
}

export interface ParsedCommand {
  raw: string;
  command: string;
  argv: string[];
  positional: string[];
  flags: Record<string, string | boolean>;
}

export interface TerminalOutputLine {
  kind: Exclude<TerminalEntryKind, "input">;
  text: string;
}

export interface CommandMetadata {
  commandSucceeded?: string;
  realRpcUsed?: boolean;
}

export interface CommandExecutionResult {
  nextState: SimulationState;
  lines: TerminalOutputLine[];
  shouldClear?: boolean;
  metadata?: CommandMetadata;
}

export type CommandHandler = (
  parsed: ParsedCommand,
  state: SimulationState,
  fs: DirectoryNode
) => Promise<CommandExecutionResult> | CommandExecutionResult;

export interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  flags: string[];
  handler: CommandHandler;
}

// ============================================================================
// Simulation State
// ============================================================================

export interface TokenMintState {
  symbol: string;
  decimals: number;
  supply: number;
  balances: Record<string, number>;
}

export interface KeypairState {
  path: string;
  publicKey: string;
  secretKey: number[];
}

export interface PendingTransfer {
  recipient: string;
  amountSol: number;
  sender: string;
  real: boolean;
}

export interface SimulationState {
  // File system location
  currentDir: string;
  // Environment variables
  env: Record<string, string>;
  // Solana CLI config
  solanaUrl: "devnet" | "mainnet-beta" | "testnet" | "localhost";
  // Wallet state
  keypairs: Record<string, KeypairState>;
  activeKeypairPath: string | null;
  // Blockchain simulation
  balances: Record<string, number>;
  tokenMints: Record<string, TokenMintState>;
  knownAddresses: string[];
  recentTxSignatures: string[];
  pendingTransfer: PendingTransfer | null;
  // Terminal state
  commandHistory: string[];
  commandSuccesses: string[];
  errors: SimulationError[];
}

export interface SimulationError {
  code: string;
  message: string;
  hint: string;
  timestamp: number;
}

// ============================================================================
// Task Types
// ============================================================================

export type TaskAssertionType =
  | { type: "command_executed"; command: string }
  | { type: "file_contains"; path: string; content: string }
  | { type: "file_matches"; path: string; pattern: string }
  | { type: "json_output_matches"; path: string; key: string; value: unknown }
  | { type: "balance_at_least"; address: string; minSol: number }
  | { type: "token_minted"; mintAddress: string }
  | { type: "keypair_exists"; path: string }
  | { type: "simulation_state"; key: string; value: string | boolean | number };

export interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  prerequisites?: string[];
  assertions: TaskAssertionType[];
  hints: string[];
  checkpointId?: string;
}

export interface TaskQuest {
  id: string;
  title: string;
  description: string;
  tasks: TaskDefinition[];
}

export interface TaskResult {
  taskId: string;
  complete: boolean;
  locked: boolean;
}

export interface TaskEvaluationContext {
  workspace: WorkspaceState;
  simulation: SimulationState;
  fs: DirectoryNode;
  checkpoints: string[];
}

// ============================================================================
// Persistence Types
// ============================================================================

export const CURRENT_SCHEMA_VERSION = 1;

export interface PersistedWorkspace {
  schemaVersion: number;
  definitionId: string;
  files: Record<string, string>;
  openFiles: string[];
  activeFilePath: string | null;
  currentDirectory: string;
  simulation: SimulationState;
  taskCompletions: string[];
  revealedHints: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

export type MigrationFn = (data: unknown) => unknown;

export interface SchemaMigration {
  fromVersion: number;
  toVersion: number;
  migrate: MigrationFn;
}

// ============================================================================
// UI/Event Types
// ============================================================================

export type PanelCollapseState = {
  left: boolean;
  right: boolean;
  bottom: boolean;
};

export interface EditorTab {
  path: string;
  isDirty: boolean;
  language: import("./fs").FileLanguage;
}

export interface AutocompleteSuggestion {
  text: string;
  description?: string;
  type: "command" | "file" | "flag";
}

export interface AutocompleteResult {
  suggestions: AutocompleteSuggestion[];
  matchStart: number;
  matchEnd: number;
}

// ============================================================================
// Workbench Events
// ============================================================================

export type WorkbenchEvent =
  | { type: "file_created"; path: string }
  | { type: "file_renamed"; oldPath: string; newPath: string }
  | { type: "file_deleted"; path: string }
  | { type: "file_modified"; path: string }
  | { type: "file_saved"; path: string }
  | { type: "command_executed"; command: string; success: boolean }
  | { type: "task_completed"; taskId: string }
  | { type: "checkpoint_reached"; checkpointId: string }
  | { type: "error_occurred"; code: string; message: string };

export type WorkbenchEventHandler = (event: WorkbenchEvent) => void;
