import { ObjectId } from "mongodb";
import { collections } from "@/lib/collections";
import clientPromise, { dbName } from "@/lib/mongodb";
import { Poll } from "@/app/types/polls";

export async function getPollById(id: string): Promise<Poll | null> {
  if (!ObjectId.isValid(id)) return null;

  const client = await clientPromise;
  const db = client.db(dbName);
  const poll = await db
    .collection(collections.polls)
    .findOne<Poll>({ _id: new ObjectId(id) });
  return poll;
}
