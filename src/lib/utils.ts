import { Poll, Question } from "@/app/types/polls";
import { User } from "@/app/types/users";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(
  isoDate: Date,
  options?: Intl.DateTimeFormatOptions
) {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(date);
}

export function serializePoll(poll: Poll) {
  return JSON.parse(
    JSON.stringify({
      ...poll,
      _id: poll._id?.toString(),
      creator: poll.creator?.toString?.() ?? null,
      questions: poll.questions.map((q: Question) => ({
        ...q,
        _id: q._id?.toString?.() ?? undefined,
      })),
      created_at: poll.created_at
        ? new Date(poll.created_at).toISOString()
        : undefined,
      modified_at: poll.modified_at
        ? new Date(poll.modified_at).toISOString()
        : undefined,
    })
  );
}

export function serializeUser(user: User) {
  return JSON.parse(
    JSON.stringify({
      ...user,
      _id: user._id?.toString(),
    })
  );
}
