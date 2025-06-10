"use client";

import { Poll } from "@/app/types/polls";
import { PollCard } from "@/components/poll/poll-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  function showPollStats(pollId: string) {
    router.push(`/dashboard/poll/${pollId}/responses`);
  }

  async function sharePoll(pollId: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/poll/${pollId}`
      );
      toast.info("Lien du Poll copié");
    } catch (err) {
      toast.error("Erreur lors de la copie du lien");
    }
  }

  return (
    <div className="flex flex-wrap gap-4">
      {polls &&
        polls.map((poll, index) => {
          return (
            <PollCard
              poll={poll}
              editPoll={editPoll}
              sharePoll={sharePoll}
              showPollStats={showPollStats}
              key={String(poll._id) ?? index}
            />
          );
        })}
    </div>
  );
}
