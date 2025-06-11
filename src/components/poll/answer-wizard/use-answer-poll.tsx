import { useState } from "react";
import { Poll } from "@/app/types/polls";

export function useAnswerWizard(poll: Poll) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = poll.questions.length;
  const currentQuestion = poll.questions[current];

  function answerQuestion(answer: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id.toString()]: answer,
    }));
  }

  function next() {
    if (current < total - 1) setCurrent((i) => i + 1);
  }
  function prev() {
    if (current > 0) setCurrent((i) => i - 1);
  }

  function isAnswered() {
    return Boolean(answers[currentQuestion._id.toString()]);
  }
  function isLast() {
    return current === total - 1;
  }
  function progress() {
    return ((current + 1) / total) * 100;
  }

  async function submit(onSuccess: () => void, onError: (e: Error) => void) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/poll/${poll._id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId: poll._id,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      onSuccess();
    } catch (e) {
      onError(e as Error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    current,
    total,
    currentQuestion,
    answers,
    isSubmitting,
    answerQuestion,
    next,
    prev,
    isAnswered,
    isLast,
    progress,
    submit,
  };
}
