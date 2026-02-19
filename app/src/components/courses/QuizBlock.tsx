"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QuizBlock as QuizBlockType } from "@/types/content";

interface QuizBlockProps {
  block: QuizBlockType;
}

export function QuizBlock({ block }: QuizBlockProps) {
  const t = useTranslations("lesson");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return block.questions.reduce((count, question) => {
      const selected = answers[question.id];
      return selected === question.answerIndex ? count + 1 : count;
    }, 0);
  }, [answers, block.questions]);

  const total = block.questions.length;

  return (
    <Card className="mt-8 border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle className="text-xl">{block.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {block.questions.map((question, questionIndex) => {
          const selected = answers[question.id];
          const isCorrect = submitted && selected === question.answerIndex;
          const isIncorrect = submitted && selected !== undefined && selected !== question.answerIndex;

          return (
            <fieldset key={question.id} className="space-y-2">
              <legend className="text-sm font-medium">
                {questionIndex + 1}. {question.prompt}
              </legend>
              <div className="space-y-2" role="radiogroup" aria-label={question.prompt}>
                {question.options.map((option, optionIndex) => {
                  const checked = selected === optionIndex;
                  return (
                    <button
                      type="button"
                      key={`${question.id}-${option}`}
                      className={`flex w-full items-center gap-2 rounded-md border p-2 text-left text-sm transition-colors ${
                        checked ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                      }`}
                      aria-pressed={checked}
                      onClick={() => {
                        setSubmitted(false);
                        setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }));
                      }}
                    >
                      {checked ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4" />}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              {submitted ? (
                <div className="rounded-md border bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 flex items-center gap-1 font-medium">
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : isIncorrect ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                    {isCorrect ? "Correct" : "Explanation"}
                  </p>
                  <p>{question.explanation}</p>
                </div>
              ) : null}
            </fieldset>
          );
        })}

        <div className="flex items-center justify-between border-t pt-4">
          <Button type="button" onClick={() => setSubmitted(true)}>
            {t("checkAnswers")}
          </Button>
          {submitted ? (
            <p className="text-sm font-medium" aria-live="polite">
              Score: {score}/{total}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
