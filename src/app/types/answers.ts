import { ObjectId } from "mongodb";

export type Answer = {
  pollId?: string | ObjectId;
  userId?: string | ObjectId;
  answers: QuestionAnswer[];
};

export type QuestionAnswer = {
  questionId: string;
  answer: string | string[];
};
