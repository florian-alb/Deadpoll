"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PollItem } from "@/components/poll/poll-item";
import { Loader2Icon, Plus } from "lucide-react";
import { Poll, Question, QuestionType } from "@/app/types/polls";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ValidationErrors {
  name?: string;
  questions: {
    [key: string]: {
      title?: string;
      possibleAnswers?: string;
    };
  };
}

export function CreatePollWizard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [poll, setPoll] = useState<Poll>({
    name: "",
    creator: session?.user?.id ?? "",
    questions: [],
  });
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
        questionErrors.title = "Le titre de la question est requis";
      }

      if (
        question.type === QuestionType.QCM &&
        question.possibleAnswers.length === 0
      ) {
        questionErrors.possibleAnswers =
          "Au moins une option de réponse est requise pour un QCM";
      }

      if (question.type === QuestionType.QCM) {
        const emptyAnswers = question.possibleAnswers.some(
          (answer) => !answer.trim()
        );
        if (emptyAnswers) {
          questionErrors.possibleAnswers =
            "Toutes les options de réponse doivent être remplies";
        }
      }

      if (Object.keys(questionErrors).length > 0) {
        newErrors.questions[question._id.toString()] = questionErrors;
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
      _id: generateId(),
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
      questions: prev.questions.filter((q) => q._id !== questionId),
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
        q._id === questionId ? { ...q, [field]: value } : q
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
        q._id === questionId
          ? { ...q, possibleAnswers: [...(q.possibleAnswers || []), ""] }
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
        q._id === questionId
          ? {
              ...q,
              possibleAnswers: q.possibleAnswers.map((r, i) =>
                i === responseIndex ? value : r
              ),
            }
          : q
      ),
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.questions[questionId]?.possibleAnswers) {
        delete newErrors.questions[questionId].possibleAnswers;
        if (Object.keys(newErrors.questions[questionId]).length === 0) {
          delete newErrors.questions[questionId];
        }
      }
      return newErrors;
    });
  }

  function removePossibleAnswer(questionId: string, responseIndex: number) {
    setPoll((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === questionId
          ? {
              ...q,
              possibleAnswers: q.possibleAnswers.filter(
                (_, i) => i !== responseIndex
              ),
            }
          : q
      ),
    }));
  }

  async function savePoll() {
    if (validatePoll()) {
      try {
        setLoading(true);
        const res = await fetch("/api/poll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: poll.name,
            creator: session?.user?.id,
            questions: poll.questions,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(`Erreur: ${data.error || "Échec de l'envoi"}`);
          return;
        }

        toast.success("Formulaire créé !");
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        toast.error(`Une erreur est survenue ${err}`);
      } finally {
        setLoading(false);
      }
    }
  }

  if (status === "loading") return <p>Chargement...</p>;
  if (status === "unauthenticated") return <p>Non connecté</p>;

  return (
    <div className="w-full h-full">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Créer un nouveau sondage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pollName">Nom du sondage</Label>
              <Input
                id="pollName"
                value={poll.name}
                onChange={(e) => {
                  setPoll({ ...poll, name: e.target.value });
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="Entrez le nom du sondage"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button onClick={addQuestion} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une question
                </Button>
              </div>

              {poll.questions.map((question, index) => (
                <PollItem
                  key={question._id.toString()}
                  question={question}
                  index={index}
                  updateQuestion={updateQuestion}
                  removeQuestion={removeQuestion}
                  addPossibleAnswer={addPossibleAnswer}
                  updatePossibleAnswer={updatePossibleAnswer}
                  removePossibleAnswer={removePossibleAnswer}
                  errors={errors.questions[question._id.toString()]}
                />
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Annuler</Button>
              {loading ? (
                <Button disabled>
                  <Loader2Icon className="animate-spin" />
                  Enregistrement
                </Button>
              ) : (
                <Button onClick={savePoll}>Créer le sondage</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
