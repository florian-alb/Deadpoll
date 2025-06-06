import { User } from "@/app/types/users";
import { collections } from "@/app/utils/collections";
import { ApiError } from "@/lib/api-error";
import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!ObjectId.isValid(id)) throw new ApiError("Invalid user ID", 400);

    const client = await clientPromise;
    const db = client.db(dbName);

    const user = await db
      .collection(collections.users)
      .findOne<User>({ _id: new ObjectId(id) });

    if (!user) throw new ApiError("User not found", 404);

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to fetch users", error: error }),
      {
        status: 500,
      }
    );
  }
}
