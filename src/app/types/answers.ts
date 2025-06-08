export type Answer = {
  pollId?: string;
  userId?: string;
  answers: QuestionAnswer[];
};

type QuestionAnswer = {
  questionId?: string;
  answer: string | string[];
};
