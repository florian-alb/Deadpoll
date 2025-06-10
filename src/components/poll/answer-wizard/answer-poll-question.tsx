"use client";

import { Question, QuestionType } from "@/app/types/polls";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { RefObject } from "react";

interface AnswerPollQuestionProps {
  question: Question;
  answer: string | string[];
  onAnswerChange: (value: string) => void;
  isCurrentQuestion: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function AnswerPollQuestion({
  question,
  answer,
  onAnswerChange,
  isCurrentQuestion,
  inputRef,
}: AnswerPollQuestionProps) {
  return (
    <div
      className={cn(
        "space-y-4 p-6 rounded-lg border transition-all duration-300",
        isCurrentQuestion
          ? "border-primary shadow-lg scale-105"
          : "border-border opacity-50"
      )}
    >
      <div className="space-y-2">
        <Label className="text-lg font-medium">{question.title}</Label>
        {question.type === QuestionType.Open ? (
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Votre réponse..."
            disabled={!isCurrentQuestion}
          />
        ) : (
          <RadioGroup
            value={answer[0]}
            onValueChange={onAnswerChange}
            disabled={!isCurrentQuestion}
            className="space-y-2"
          >
            {question.possibleAnswers?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${question._id}-${index}`}
                />
                <Label htmlFor={`${question._id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
