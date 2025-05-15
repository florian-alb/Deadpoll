import { collections } from "@/app/utils/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const sondages = db.collection(collections.polls);

  const allSondages = await sondages.find().toArray();

  return new Response(JSON.stringify(allSondages), {
    status: 200,
  });
}
