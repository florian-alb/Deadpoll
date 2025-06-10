"use client";

import { AnswerPollWizard } from "@/components/poll/answer-wizard/answer-poll-wizard";
import { usePoll } from "@/app/context/poll-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/context/poll-context copy";
import { GithubSignIn } from "@/components/github-sign-in";
import { LoginButton } from "@/components/auth-buttons";

export default function AnswerPollPage() {
  const poll = usePoll();
  const user = useUser();

  if (!poll) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Poll non trouvé</h1>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vous n'etes pas connecté</h1>
          <p>Connectez vous pour répondre à ce Poll</p>
        </div>
        <LoginButton />
      </div>
    );
  }

  if (poll.creator === user._id) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Vous êtes le créateur de ce Poll
          </h1>
          <p className="text-sm mb-4">
            Vous ne pouvez pas répondre à votre propre Poll
          </p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{poll.name}</h1>
          <Link href="/dashboard">
            <Button variant="link" className="text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>
        <AnswerPollWizard poll={poll} />
      </div>
    </div>
  );
}
