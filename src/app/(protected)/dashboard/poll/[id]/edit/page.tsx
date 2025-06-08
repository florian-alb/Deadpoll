"use client";

import { EditPollWizard } from "@/components/poll/edit-poll-wizard";
import { usePoll } from "@/components/poll/poll-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPollPage() {
  const poll = usePoll();

  // if (status === "loading" || initialLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <Loader2Icon className="w-8 h-8 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    poll && (
      <div>
        <div className="mx-auto py-8">
          <div className="flex justify-between align-center">
            <h1 className="text-2xl font-bold mb-6">Modifier le sondage</h1>
            <Link href={"/dashboard"}>
              <Button variant="link" className="text-foreground">
                <ArrowLeft /> Retour
              </Button>
            </Link>
          </div>
          <EditPollWizard pollProps={poll} />
        </div>
      </div>
    )
  );
}
