import { User } from "@/app/types/users";
import { collections } from "@/app/utils/collections";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const users = db.collection(collections.users);

    const testUser: User = {
      email: "test@email.com",
      fullname: "test",
    };

    const existingUser = await users.findOne({ email: testUser.email });

    if (existingUser) throw new Error("user allready exitst");

    const result = users.insertOne(testUser);

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message ?? "failed to create a new user",
        error,
      })
    );
  }
}
