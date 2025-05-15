import { collections } from "@/app/utils/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection(collections.users);

    const users = await usersCollection.find({}).toArray();

    return new Response(JSON.stringify(users), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch users", error: error }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {}
