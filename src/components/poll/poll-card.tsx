import { formatDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Edit, ChartPie, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Poll } from "@/app/types/polls";

interface CardPollProps {
  poll: Poll;
  editPoll: (pollId: string) => void;
}

export function PollCard({ poll, editPoll }: CardPollProps) {
  return (
    <Card>
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
              <Button
                className="bg-indigo-500 hover:bg-indigo-500/50"
                onClick={() => {
                  editPoll(poll._id as string);
                }}
              >
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
}
