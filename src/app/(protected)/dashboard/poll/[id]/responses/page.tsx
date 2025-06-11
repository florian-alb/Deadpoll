"use client";

import { usePoll } from "@/app/context/poll-context";
import { AnswerWithUserEmail } from "@/app/types/answers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

function formatDate(date: Date) {
  if (!date) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PollResponsesPage() {
  const poll = usePoll();
  const [answers, setAnswers] = useState<AnswerWithUserEmail[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/poll/${poll?._id}/answer`);
      const answers = await res.json();
      setAnswers([...answers]);
    }
    fetchData();
  }, [poll?._id]);

  const downloadCSV = () => {
    if (!answers.length) return;
    const headers = [
      "Date",
      "Utilisateur",
      ...poll.questions.map((q) => q.title),
    ];
    const rows = answers.map((response) => {
      const date = formatDate(new Date(response.createdAt));
      const user =
        response.userEmail?.toString?.() && response.userEmail !== "unknown"
          ? response.userEmail
          : "Inconnu";

      const answerCells = poll.questions.map((q) => {
        const qa = response.answers.find(
          (ans) =>
            ans.questionId === q._id?.toString() ||
            ans.questionId === q._id ||
            ans.questionId === q._id ||
            ans.questionId === q._id?.toString()
        );
        if (!qa) return "";
        if (Array.isArray(qa.answer)) return `"${qa.answer.join("; ")}"`;
        return `"${qa.answer}"`;
      });
      return [date, user, ...answerCells].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reponses-${poll.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (poll === undefined) return <Spinner />;

  if (!poll) return notFound();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Réponses du Poll : {poll.name}</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={downloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exporter en CSV
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nombre total de réponses : {answers.length}</p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Détail des réponses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Utilisateur</th>
                    {poll.questions.map((question, index) => (
                      <th
                        key={question._id.toString() ?? index}
                        className="text-left p-4"
                      >
                        {question.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-4">{formatDate(answer.createdAt)}</td>
                      <td className="p-4">
                        {answer.userEmail?.toString() ?? "Inconnu"}
                      </td>
                      {poll.questions.map((question, index) => (
                        <td key={question._id.toString()} className="p-4">
                          {answer.answers[index].answer}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
