import { ObjectId } from "mongodb";
import clientPromise, { dbName } from "@/lib/mongodb";
import { collections } from "@/app/utils/collections";
import { NextRequest } from "next/server";
import { Poll, Question } from "@/app/types/polls";
import { ApiError } from "@/lib/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const client = await clientPromise;
    const db = client.db(dbName);
    const poll = await db
      .collection(collections.polls)
      .findOne({ _id: new ObjectId(id) });

    if (!poll) throw new ApiError("Poll not found", 404);

    return new Response(JSON.stringify(poll), { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to fetch poll", error: error }),
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const id = (await params).id;

    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const { name, questions } = await req.json();

    const poll = await db
      .collection(collections.polls)
      .findOne({ _id: new ObjectId(id) });

    if (!poll) throw new ApiError("Poll not found", 404);

    const updatedPoll: Poll = {
      ...poll,
      name: name ?? poll.name,
      questions: questions
        ? questions.map((question: Question) => ({
            ...question,
            _id: question._id ?? new ObjectId(),
          }))
        : poll.questions,
      creator: poll.creator,
    };

    const result = await db
      .collection(collections.polls)
      .updateOne({ _id: updatedPoll._id }, { $set: updatedPoll });

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
      JSON.stringify({ message: "Failed to update poll", error: error }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const id = (await params).id;

    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const result = await db
      .collection(collections.polls)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) throw new ApiError("Poll not found", 404);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
      });
    }
    return new Response(
      JSON.stringify({ message: "Failed to delete poll", error: error }),
      {
        status: 500,
      }
    );
  }
}
