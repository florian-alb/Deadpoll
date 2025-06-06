import { Poll, Question } from "@/app/types/polls";
import { collections } from "@/app/utils/collections";
import { ApiError } from "@/lib/api-error";
import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const client = await clientPromise;
  const db = client.db(dbName);

  const allPolls = await db.collection(collections.polls).find().toArray();

  return new Response(JSON.stringify(allPolls), {
    status: 200,
  });
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db(dbName);

  try {
    const { name, questions, creator } = await req.json();

    if (!name || !Array.isArray(questions) || !creator)
      throw new ApiError("Missing required fields", 400);

    const questionsWithId = questions.map((question: Question) => ({
      ...question,
      _id: new ObjectId(),
    }));

    const newPoll: Poll = {
      name: name,
      creator: ObjectId.createFromTime(creator),
      questions: questionsWithId,
    };

    const result = await db.collection(collections.polls).insertOne(newPoll);

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
