import { EditPollWizard } from "@/components/poll/edit-poll-wizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditPollPageProps {
  params: {
    id: string;
  };
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
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
        <EditPollWizard pollId={id} />
      </div>
    </div>
  );
}
