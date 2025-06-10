import { PollContextProvider } from "@/app/context/poll-context";
import { UserContextProvider } from "@/app/context/poll-context copy";
import { getAuthUser } from "@/lib/server/get-auth-user";
import { getPollById } from "@/lib/server/polls";
import { serializePoll, serializeUser } from "@/lib/utils";
import { notFound, unauthorized } from "next/navigation";

export default async function PollLayout({
  children,
  params,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const poll = await getPollById(id);

  if (!poll) notFound();

  const user = await getAuthUser();

  if (!user) unauthorized();

  const safeUser = serializeUser(user);
  const safePoll = serializePoll(poll);

  return (
    <UserContextProvider user={safeUser}>
      <PollContextProvider poll={safePoll}>{children}</PollContextProvider>
    </UserContextProvider>
  );
}
