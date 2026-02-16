import { TerminalSimState } from "@/lib/terminal-sim";

export type TerminalCommandExecutedObjective = {
  id: string;
  type: "TerminalCommandExecuted";
  commandPattern: RegExp;
  stateAssertion?: (state: TerminalSimState) => boolean;
};

export type FileContainsObjective = {
  id: string;
  type: "FileContains";
  path: string;
  pattern: RegExp;
};

export type QuizPassedObjective = {
  id: string;
  type: "QuizPassed";
  quizId: string;
};

export type RunnerJobPassedObjective = {
  id: string;
  type: "RunnerJobPassed";
  jobType: string;
};

export type TxConfirmedOnDevnetObjective = {
  id: string;
  type: "TxConfirmedOnDevnet";
  signature: string;
};

export type ProgramDeployedObjective = {
  id: string;
  type: "ProgramDeployed";
  programId: string;
};

export type ObjectiveDefinition =
  | TerminalCommandExecutedObjective
  | FileContainsObjective
  | QuizPassedObjective
  | RunnerJobPassedObjective
  | TxConfirmedOnDevnetObjective
  | ProgramDeployedObjective;

export type ObjectiveContext = {
  lastCommand: string;
  terminalState: TerminalSimState;
  files: Record<string, string>;
  quizResults: Record<string, boolean>;
  runnerJobResults?: Record<string, boolean>;
  confirmedSignatures?: string[];
  deployedProgramIds?: string[];
};

export type ObjectiveStatus = {
  id: string;
  complete: boolean;
};
