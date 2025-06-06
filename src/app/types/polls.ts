import { ObjectId } from "mongodb";

export type Poll = {
  id?: string;
  name: string;
  creator: string | ObjectId;
  questions: Question[];
};

export type Question = {
  id?: string;
  title: string;
  type: QuestionType;
  possibleAnswers: string[];
};

export enum QuestionType {
  QCM = "QCM",
  Open = "Open",
}
