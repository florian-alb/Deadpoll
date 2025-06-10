import { ObjectId } from "mongodb";

export type Poll = {
  _id?: string | ObjectId;
  name: string;
  creator: string | ObjectId;
  questions: Question[];
  created_at?: Date;
  modified_at?: Date;
};

export type Question = {
  _id: string | ObjectId;
  title: string;
  type: QuestionType;
  possibleAnswers: string[];
};

export enum QuestionType {
  QCM = "QCM",
  Open = "Open",
}
