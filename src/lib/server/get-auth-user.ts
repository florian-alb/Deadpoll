import { auth } from "@/app/auth";
import clientPromise, { dbName } from "@/lib//mongodb";
import { collections } from "@/lib/collections";

export async function getAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db(dbName);

  const user = await db
    .collection(collections.users)
    .findOne({ email: session.user.email });

  if (!user) {
    return null;
  }

  return user;
}
