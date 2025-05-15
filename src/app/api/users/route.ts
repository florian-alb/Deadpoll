import { collections } from "@/app/utils/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const users = db.collection(collections.users);
}
