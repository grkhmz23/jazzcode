import {
  ObjectiveContext,
  ObjectiveDefinition,
  ObjectiveStatus,
} from "@/lib/objectives/types";

export function evaluateObjective(
  objective: ObjectiveDefinition,
  context: ObjectiveContext
): boolean {
  if (objective.type === "TerminalCommandExecuted") {
    const commandMatches = objective.commandPattern.test(context.lastCommand);
    if (!commandMatches) return false;
    if (!objective.stateAssertion) return true;
    return objective.stateAssertion(context.terminalState);
  }

  if (objective.type === "FileContains") {
    const content = context.files[objective.path] ?? "";
    return objective.pattern.test(content);
  }

  if (objective.type === "QuizPassed") {
    return context.quizResults[objective.quizId] === true;
  }

  if (objective.type === "RunnerJobPassed") {
    return context.runnerJobResults?.[objective.jobType] === true;
  }

  if (objective.type === "TxConfirmedOnDevnet") {
    return (context.confirmedSignatures ?? []).includes(objective.signature);
  }

  if (objective.type === "ProgramDeployed") {
    return (context.deployedProgramIds ?? []).includes(objective.programId);
  }

  return false;
}

export function computeObjectiveStatuses(
  objectives: ObjectiveDefinition[],
  context: ObjectiveContext
): ObjectiveStatus[] {
  return objectives.map((objective) => ({
    id: objective.id,
    complete: evaluateObjective(objective, context),
  }));
}
