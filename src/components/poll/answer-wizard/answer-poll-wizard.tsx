"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerPollQuestion } from "@/components/poll/answer-wizard/answer-poll-question";

import { Poll } from "@/app/types/polls";
import { useAnswerWizard } from "./use-answer-poll";

interface AnswerPollWizardProps {
  poll: Poll;
}

export function AnswerPollWizard({ poll }: AnswerPollWizardProps) {
  const router = useRouter();
  const wizard = useAnswerWizard(poll);

  const handleSend = () =>
    wizard.submit(
      () => {
        toast.success("Vos réponses ont été enregistrées !");
        router.push("/thank-you");
      },
      () => toast.error("Une erreur est survenue lors de l'envoi des réponses")
    );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium">
            Question {wizard.current + 1} sur {wizard.total}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(wizard.progress())}%
          </span>
        </div>
        <Progress value={wizard.progress()} />
      </div>
      <div className="space-y-6">
        {poll.questions.map((question, index) => (
          <AnswerPollQuestion
            key={question._id.toString()}
            question={question}
            answer={wizard.answers[question._id.toString()] || ""}
            onAnswerChange={wizard.answerQuestion}
            isCurrentQuestion={index === wizard.current}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={wizard.prev}
          disabled={wizard.current === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        {wizard.isLast() ? (
          <Button
            onClick={handleSend}
            disabled={!wizard.isAnswered() || wizard.isSubmitting}
          >
            {wizard.isSubmitting ? (
              "Envoi en cours..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </>
            )}
          </Button>
        ) : (
          <Button onClick={wizard.next} disabled={!wizard.isAnswered()}>
            Suivant
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
