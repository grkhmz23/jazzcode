import { describe, expect, it } from "vitest";
import { computeObjectiveStatuses, evaluateObjective } from "@/lib/objectives";
import { createInitialTerminalState } from "@/lib/terminal-sim";

describe("objective engine", () => {
  it("evaluates terminal objective with state assertion", () => {
    const state = createInitialTerminalState();
    state.balances["wallet"] = BigInt(2_000_000_000);

    const result = evaluateObjective(
      {
        id: "o1",
        type: "TerminalCommandExecuted",
        commandPattern: /^solana\s+balance$/,
        stateAssertion: (simState) =>
          (simState.balances["wallet"] ?? BigInt(0)) > BigInt(0),
      },
      {
        lastCommand: "solana balance",
        terminalState: state,
        files: {},
        quizResults: {},
      }
    );

    expect(result).toBe(true);
  });

  it("evaluates file contains objective", () => {
    const result = evaluateObjective(
      {
        id: "o2",
        type: "FileContains",
        path: "src/main.ts",
        pattern: /initialize/,
      },
      {
        lastCommand: "",
        terminalState: createInitialTerminalState(),
        files: { "src/main.ts": "export function initialize() {}" },
        quizResults: {},
      }
    );

    expect(result).toBe(true);
  });

  it("evaluates quiz objective", () => {
    const result = evaluateObjective(
      { id: "o3", type: "QuizPassed", quizId: "quiz-1" },
      {
        lastCommand: "",
        terminalState: createInitialTerminalState(),
        files: {},
        quizResults: { "quiz-1": true },
      }
    );

    expect(result).toBe(true);
  });

  it("computes objective status list", () => {
    const statuses = computeObjectiveStatuses(
      [
        {
          id: "o1",
          type: "TerminalCommandExecuted",
          commandPattern: /^solana\s+config\s+get$/,
        },
        {
          id: "o2",
          type: "QuizPassed",
          quizId: "quiz-2",
        },
      ],
      {
        lastCommand: "solana config get",
        terminalState: createInitialTerminalState(),
        files: {},
        quizResults: { "quiz-2": false },
      }
    );

    expect(statuses).toEqual([
      { id: "o1", complete: true },
      { id: "o2", complete: false },
    ]);
  });

  it("evaluates runner and devnet objective types", () => {
    const statuses = computeObjectiveStatuses(
      [
        { id: "r1", type: "RunnerJobPassed", jobType: "anchor_build" },
        { id: "t1", type: "TxConfirmedOnDevnet", signature: "sig-123" },
        { id: "p1", type: "ProgramDeployed", programId: "prog-abc" },
      ],
      {
        lastCommand: "",
        terminalState: createInitialTerminalState(),
        files: {},
        quizResults: {},
        runnerJobResults: { anchor_build: true },
        confirmedSignatures: ["sig-123"],
        deployedProgramIds: ["prog-abc"],
      }
    );

    expect(statuses).toEqual([
      { id: "r1", complete: true },
      { id: "t1", complete: true },
      { id: "p1", complete: true },
    ]);
  });
});
