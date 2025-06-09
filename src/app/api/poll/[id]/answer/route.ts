import { Answer, QuestionAnswer } from "@/app/types/answers";
import { ApiError } from "@/lib/api-error";
import { collections } from "@/lib/collections";
import clientPromise, { dbName } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/server/get-auth-user";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const client = await clientPromise;
    const db = client.db(dbName);

    const allPolls = await db
      .collection(collections.answers)
      .find({ pollId: id })
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) throw new ApiError("Unauthorized", 401);

    const client = await clientPromise;
    const db = client.db(dbName);

    const { answers } = await req.json();

    const id = (await params).id;
    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const questionAnswers: QuestionAnswer[] = answers.map(
      (answer: QuestionAnswer) => {
        const questionId = ObjectId.isValid(answers.questionId)
          ? new ObjectId(answer.questionId)
          : new ObjectId();

        return {
          ...answer,
          questionId: questionId,
        };
      }
    );

    const pollAnswer: Answer = {
      pollId: new ObjectId(id),
      userId: new ObjectId(user._id),
      answers: questionAnswers,
    };

    const result = await db
      .collection(collections.answers)
      .insertOne(pollAnswer);

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to post answer", error: error }),
      {
        status: 500,
      }
    );
  }
}
