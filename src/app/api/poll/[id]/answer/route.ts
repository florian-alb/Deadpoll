import {
  Answer,
  AnswerWithUserEmail,
  QuestionAnswer,
} from "@/app/types/answers";
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
    const user = getAuthUser();
    if (!user) throw new ApiError("Unauthorized", 401);

    const id = (await params).id;

    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const client = await clientPromise;
    const db = client.db(dbName);

    const answers: AnswerWithUserEmail[] = await db
      .collection(collections.answers)
      .aggregate<AnswerWithUserEmail>([
        { $match: { pollId: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            pollId: 1,
            userId: 1,
            createdAt: 1,
            answers: 1,
            userEmail: "$userInfo.email",
          },
        },
      ])
      .toArray();

    return new Response(JSON.stringify(answers), {
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
      createdAt: new Date(),
    };

    const result = await db
      .collection<Answer>(collections.answers)
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
