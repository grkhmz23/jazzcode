"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLearnRuntime } from "@/components/learn/runtime-context";

type QuizOption = {
  id: string;
  label: string;
  correct: boolean;
};

const defaultOptions: QuizOption[] = [
  { id: "a", label: "Solana executes transactions strictly sequentially", correct: false },
  { id: "b", label: "Solana can execute non-conflicting transactions in parallel", correct: true },
  { id: "c", label: "A transaction can never include multiple instructions", correct: false },
];

export function Quiz({
  id,
  prompt,
  options,
}: {
  id: string;
  prompt?: string;
  options?: QuizOption[];
}) {
  const { submitQuizResult } = useLearnRuntime();
  const quizOptions = useMemo(() => options ?? defaultOptions, [options]);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectedOption = quizOptions.find((option) => option.id === selected);
  const passed = selectedOption?.correct === true;

  return (
    <div className="my-4 rounded-lg border bg-muted/30 p-4">
      <h3 className="mb-2 text-sm font-semibold">{prompt ?? "Select the correct statement"}</h3>
      <div className="space-y-2">
        {quizOptions.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-2 rounded border p-2 text-sm">
            <input
              type="radio"
              name={`quiz-${id}`}
              checked={selected === option.id}
              onChange={() => setSelected(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={!selected}
          onClick={() => {
            setSubmitted(true);
            submitQuizResult(id, passed);
          }}
        >
          Submit
        </Button>
        {submitted ? (
          <span className={`text-xs ${passed ? "text-green-600" : "text-red-600"}`}>
            {passed ? "Correct" : "Try again"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
