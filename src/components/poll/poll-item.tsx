"use-client";

import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Trash2, Plus } from "lucide-react";
import { Question, QuestionType } from "@/app/types/polls";

interface QuestionErrors {
  title?: string;
  possibleAnswers?: string;
}

interface PollItemProps {
  question: Question;
  index: number;
  updateQuestion: (
    questionId: string,
    field: keyof Question,
    value: any
  ) => void;
  removeQuestion: (questionId: string) => void;
  addPossibleAnswer: (questionId: string) => void;
  updatePossibleAnswer: (
    questionId: string,
    responseIndex: number,
    value: string
  ) => void;
  removePossibleAnswer: (questionId: string, responseIndex: number) => void;
  errors?: QuestionErrors;
}

export function PollItem({
  question,
  index,
  updateQuestion,
  removeQuestion,
  addPossibleAnswer,
  updatePossibleAnswer,
  removePossibleAnswer,
  errors,
}: PollItemProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label>Question {index + 1}</Label>
              <Input
                value={question.title}
                onChange={(e) =>
                  updateQuestion(question.id!, "title", e.target.value)
                }
                placeholder="Entrez votre question"
                className={errors?.title ? "border-red-500" : ""}
              />
              {errors?.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Type de question</Label>
              <Select
                value={question.type}
                onValueChange={(value: QuestionType) =>
                  updateQuestion(question.id!, "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestionType.Open}>
                    Question ouverte
                  </SelectItem>
                  <SelectItem value={QuestionType.QCM}>QCM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {question.type === QuestionType.QCM && (
              <div className="space-y-2">
                <Label>Options de réponse</Label>
                {errors?.possibleAnswers && (
                  <p className="text-sm text-red-500">
                    {errors.possibleAnswers}
                  </p>
                )}
                {question.possibleAnswers?.map((response, responseIndex) => (
                  <div key={responseIndex} className="flex gap-2">
                    <Input
                      value={response}
                      onChange={(e) =>
                        updatePossibleAnswer(
                          question.id!,
                          responseIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Option ${responseIndex + 1}`}
                      className={
                        errors?.possibleAnswers ? "border-red-500" : ""
                      }
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        removePossibleAnswer(question.id!, responseIndex)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addPossibleAnswer(question.id!)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeQuestion(question.id!)}
            className="ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
