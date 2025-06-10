import { auth } from "@/app/auth";
import { User } from "@/app/types/users";
import clientPromise, { dbName } from "@/lib//mongodb";
import { collections } from "@/lib/collections";

export async function getAuthUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db(dbName);

  const user = await db
    .collection(collections.users)
    .findOne<User>({ email: session.user.email });

  if (!user) {
    return null;
  }

  return user;
}
