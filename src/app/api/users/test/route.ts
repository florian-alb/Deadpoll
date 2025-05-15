import { User } from "@/app/types/users";
import { collections } from "@/app/utils/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const users = db.collection(collections.users);

  console.log(db);

  const testUser: User = {
    email: "test@email.com",
    fullname: "test",
  };

  const result = users.insertOne(testUser);

  return new Response(JSON.stringify(result), {
    status: 200,
  });
}
