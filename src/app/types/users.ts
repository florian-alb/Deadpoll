import { ObjectId } from "mongodb";

export type User = {
  _id: string | ObjectId;
  email: string;
  name: string;
  image?: string;
};
