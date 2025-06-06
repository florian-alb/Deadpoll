"use client";

import { Poll } from "@/app/types/polls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { ChartPie, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/poll");
      const polls = await res.json();
      setPolls([...polls]);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {polls &&
        polls.map((poll, index) => {
          return (
            <Card key={index}>
              <CardHeader>
                <h3 className="text-xl font-semibold">{poll.name}</h3>
              </CardHeader>
              <CardContent className="h-full">
                <div className="flex flex-col h-full gap-2 text-sm">
                  <span>Réponses: 1</span>
                  {poll.created_at && (
                    <span>Créé le: {formatDate(poll.created_at)}</span>
                  )}
                  {poll.modified_at && (
                    <span>Modifié le: {formatDate(poll.modified_at)}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-indigo-500 hover:bg-indigo-500/50">
                        <Edit />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Modifier</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-emerald-500 hover:bg-emerald-500/50">
                        <ChartPie />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Statistiques</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-500/50">
                        <Trash />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supprimer</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );
}
