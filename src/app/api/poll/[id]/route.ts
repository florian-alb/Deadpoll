import { ObjectId } from "mongodb";
import clientPromise, { dbName } from "@/lib/mongodb";
import { collections } from "@/lib/collections";
import { NextRequest } from "next/server";
import { Poll, Question } from "@/app/types/polls";
import { ApiError } from "@/lib/api-error";
import { getAuthUser } from "@/lib/get-auth-user";

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
    const user = await getAuthUser();
    if (!user) throw new ApiError("Unauthorized", 401);

    const client = await clientPromise;
    const db = client.db(dbName);

    const id = (await params).id;

    if (!ObjectId.isValid(id)) throw new ApiError("Invalid poll ID", 400);

    const { name, questions } = await req.json();

    const poll = await db
      .collection(collections.polls)
      .findOne<Poll>({ _id: new ObjectId(id) });

    if (!poll) throw new ApiError("Poll not found", 404);

    const updatedPollSet = {
      $set: {
        name: name ?? poll.name,
        questions: questions ?? poll.questions,
        modified_at: new Date(),
      },
    };

    const result = await db
      .collection(collections.polls)
      .updateOne({ _id: poll._id }, updatedPollSet);

    if (result.modifiedCount === 0)
      throw new ApiError("Failed to update poll", 500);

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
