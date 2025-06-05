import { ObjectId } from "mongodb";

export type Poll = {
  _id?: ObjectId;
  name: string;
  creator: ObjectId;
  questions: Question[];
};

export type Question = {
  _id?: ObjectId;
  title: string;
  type: QuestionType;
  possibleAnswers: string[] | string | null;
};

enum QuestionType {
  QCM = "QCM",
  Open = "Open",
}
