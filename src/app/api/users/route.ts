import { User } from "@/app/types/users";
import { collections } from "@/lib/collections";
import { ApiError } from "@/lib/api-error";
import clientPromise, { dbName } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const users = await db
      .collection(collections.users)
      .find<User>({})
      .toArray();

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

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !name || !password)
      throw new ApiError("Email, Password and/or Fullname are required", 400);

    const client = await clientPromise;
    const db = client.db(dbName);

    const existingUser = await db
      .collection(collections.users)
      .findOne({ email: email });

    if (existingUser) throw new ApiError("user allready exitst", 400);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      name,
      passwordHash,
      avatar: "",
      createdAt: new Date(),
    };

    const result = db.collection(collections.users).insertOne(newUser);

    return new Response(JSON.stringify(result), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to create users", error: error }),
      {
        status: 500,
      }
    );
  }
}
