"use client";

import { EditPollWizard } from "@/components/poll/edit-poll-wizard";
import { usePoll } from "@/app/context/poll-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPollPage() {
  const poll = usePoll();

  return (
    poll && (
      <div className="mx-auto">
        <div className="flex justify-between align-center">
          <h1 className="text-2xl font-bold mb-6">Modifier le Poll</h1>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>
        <EditPollWizard pollProps={poll} />
      </div>
    )
  );
}
