import { EditPollWizard } from "@/components/poll/edit-poll-wizard";
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Modifier le sondage</h1>
      <EditPollWizard pollId={id} />
    </div>
  );
}
