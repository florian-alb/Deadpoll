"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PollItem } from "@/components/poll/poll-item";
import { Loader2Icon, Plus } from "lucide-react";
import { Poll, Question, QuestionType } from "@/app/types/polls";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";
import { notFound, useRouter } from "next/navigation";
import { usePoll } from "./poll-context";

interface ValidationErrors {
  name?: string;
  questions: {
    [key: string]: {
      title?: string;
      possibleAnswers?: string;
    };
  };
}

interface EditPollWizardProps {
  pollProps: Poll;
}

export function EditPollWizard({ pollProps }: EditPollWizardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [poll, setPoll] = useState<Poll>(pollProps);

  const [errors, setErrors] = useState<ValidationErrors>({
    questions: {},
  });

  function validatePoll(): boolean {
    const newErrors: ValidationErrors = {
      questions: {},
    };

    if (!poll.name.trim()) {
      newErrors.name = "Le nom du sondage est requis";
    }

    poll.questions.forEach((question) => {
      const questionErrors: { title?: string; possibleAnswers?: string } = {};

      if (!question.title.trim()) {
        questionErrors.title = "La question est requise";
      }

      if (
        question.type === QuestionType.QCM &&
        (!question.possibleAnswers ||
          question.possibleAnswers.length < 2 ||
          question.possibleAnswers.some((answer) => !answer.trim()))
      ) {
        questionErrors.possibleAnswers =
          "Au moins deux options de réponse sont requises";
      }

      if (Object.keys(questionErrors).length > 0) {
        newErrors.questions[question.id!] = questionErrors;
      }
    });

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 1 &&
      Object.keys(newErrors.questions).length === 0
    );
  }

  function addQuestion() {
    const newQuestion: Question = {
      id: generateId(),
      title: "",
      type: QuestionType.Open,
      possibleAnswers: [],
    };

    setPoll((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  }

  function removeQuestion(questionId: string) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.questions[questionId];
      return newErrors;
    });
  }

  function updateQuestion(
    questionId: string,
    field: keyof Question,
    value: any
  ) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.questions[questionId]) {
        const questionErrors = newErrors.questions[questionId];
        if (field === "title") {
          delete questionErrors.title;
        } else if (field === "possibleAnswers") {
          delete questionErrors.possibleAnswers;
        }
        if (Object.keys(questionErrors).length === 0) {
          delete newErrors.questions[questionId];
        }
      }
      return newErrors;
    });
  }

  function addPossibleAnswer(questionId: string) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              possibleAnswers: [...(q.possibleAnswers || []), ""],
            }
          : q
      ),
    }));
  }

  function updatePossibleAnswer(
    questionId: string,
    responseIndex: number,
    value: string
  ) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              possibleAnswers: q.possibleAnswers?.map((r, i) =>
                i === responseIndex ? value : r
              ),
            }
          : q
      ),
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.questions[questionId]) {
        const questionErrors = newErrors.questions[questionId];
        if (questionErrors.possibleAnswers) {
          const question = poll.questions.find((q) => q.id === questionId);
          if (
            question?.possibleAnswers &&
            question.possibleAnswers.length >= 2 &&
            !question.possibleAnswers.some((answer) => !answer.trim())
          ) {
            delete questionErrors.possibleAnswers;
            if (Object.keys(questionErrors).length === 0) {
              delete newErrors.questions[questionId];
            }
          }
        }
      }
      return newErrors;
    });
  }

  function removePossibleAnswer(questionId: string, responseIndex: number) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              possibleAnswers: q.possibleAnswers?.filter(
                (_, i) => i !== responseIndex
              ),
            }
          : q
      ),
    }));
  }

  async function updatePoll() {
    if (validatePoll()) {
      try {
        setLoading(true);
        const res = await fetch(`/api/poll/${poll._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: poll.name,
            creator: pollProps.creator,
            questions: poll.questions,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(`Erreur: ${data.error || "Échec de la modification"}`);
          return;
        }

        toast.success("Formulaire modifié !");
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        toast.error(`Une erreur est survenue ${err}`);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nom du sondage</Label>
          <Input
            value={poll.name}
            onChange={(e) =>
              setPoll((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Entrez le nom du sondage"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-4">
          {poll.questions.map((question, index) => (
            <PollItem
              key={question.id}
              question={question}
              index={index}
              updateQuestion={updateQuestion}
              removeQuestion={removeQuestion}
              addPossibleAnswer={addPossibleAnswer}
              updatePossibleAnswer={updatePossibleAnswer}
              removePossibleAnswer={removePossibleAnswer}
              errors={errors.questions[question.id!]}
            />
          ))}

          <Button variant="outline" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une question
          </Button>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Annuler
          </Button>
          {loading ? (
            <Button disabled>
              <Loader2Icon className="animate-spin" />
              Modification
            </Button>
          ) : (
            <Button onClick={updatePoll}>Modifier le sondage</Button>
          )}
        </div>
      </div>
    </div>
  );
}
