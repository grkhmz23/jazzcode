"use client";

import { createContext, useContext } from "react";
import { TerminalSimState } from "@/lib/terminal-sim";

export type LearnRuntimeContextValue = {
  getFileContent: (path: string) => string;
  updateFileContent: (path: string, content: string) => void;
  runSnippet: (path: string, code: string) => void;
  submitQuizResult: (quizId: string, passed: boolean) => void;
  terminalState: TerminalSimState;
};

const LearnRuntimeContext = createContext<LearnRuntimeContextValue | null>(null);

export function LearnRuntimeProvider({
  value,
  children,
}: {
  value: LearnRuntimeContextValue;
  children: React.ReactNode;
}) {
  return (
    <LearnRuntimeContext.Provider value={value}>
      {children}
    </LearnRuntimeContext.Provider>
  );
}

export function useLearnRuntime(): LearnRuntimeContextValue {
  const context = useContext(LearnRuntimeContext);
  if (!context) {
    throw new Error("useLearnRuntime must be used within LearnRuntimeProvider");
  }
  return context;
}
