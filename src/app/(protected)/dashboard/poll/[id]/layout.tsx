import { PollContextProvider } from "@/components/poll/poll-context";
import { getPollById } from "@/lib/server/polls";
import { serializePoll } from "@/lib/utils";
import { notFound } from "next/navigation";

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

  const safePoll = serializePoll(poll);

  return <PollContextProvider poll={safePoll}>{children}</PollContextProvider>;
}
