"use client";

import { Poll } from "@/app/types/polls";
import { PollCard } from "@/components/poll/poll-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/poll");
      const polls = await res.json();
      setPolls([...polls]);
    }
    fetchData();
  }, []);

  function editPoll(pollId: string) {
    router.push(`/dashboard/poll/${pollId}/edit`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      {polls &&
        polls.map((poll, index) => {
          return (
            <PollCard
              poll={poll}
              editPoll={editPoll}
              key={String(poll._id) ?? index}
            />
          );
        })}
    </div>
  );
}
