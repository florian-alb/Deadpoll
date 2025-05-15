import { ObjectId } from "mongodb";

export type Answer = {
  _pollId?: ObjectId;
  _userId?: ObjectId;
  answers: QuestionAnswer[];
};

type QuestionAnswer = {
  _questionId?: ObjectId;
  answer: string | string[];
};
