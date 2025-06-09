import { Poll, Question } from "@/app/types/polls";
import { collections } from "@/lib/collections";
import { ApiError } from "@/lib/api-error";
import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAuthUser } from "@/lib/server/get-auth-user";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) throw new ApiError("Unauthorized", 401);

    const client = await clientPromise;
    const db = client.db(dbName);

    const allPolls = await db
      .collection(collections.polls)
      .find({ creator: user._id })
      .toArray();

    return new Response(JSON.stringify(allPolls), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to fetch polls", error: error }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) throw new ApiError("Unauthorized", 401);

    const client = await clientPromise;
    const db = client.db(dbName);

    const { name, questions, creator } = await req.json();

    if (!name || !Array.isArray(questions) || !creator)
      throw new ApiError("Missing required fields", 400);

    const questionsWithId = questions.map((question: Question) => ({
      ...question,
      _id: new ObjectId(),
    }));

    const newPoll: Poll = {
      name: name,
      creator: user._id,
      questions: questionsWithId,
      created_at: new Date(),
    };

    const result = await db
      .collection<Poll>(collections.polls)
      .insertOne(newPoll);

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
      JSON.stringify({ message: "Failed to create a new poll", error: error }),
      {
        status: 500,
      }
    );
  }
}
