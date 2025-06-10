import { ObjectId } from "mongodb";

export type Answer = {
  _id?: string | ObjectId;
  pollId?: string | ObjectId;
  userId?: string | ObjectId;
  createdAt: Date;
  answers: QuestionAnswer[];
};

export type QuestionAnswer = {
  questionId: string;
  answer: string | string[];
};

export type AnswerWithUserEmail = Answer & { userEmail: string };
