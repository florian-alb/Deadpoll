"use client";

import { Poll } from "@/app/types/polls";
import { createContext, useContext } from "react";

export const PollContext = createContext<Poll | null>(null);

export function PollContextProvider({
  children,
  poll,
}: {
  children: React.ReactNode;
  poll: Poll;
}) {
  return <PollContext.Provider value={poll}>{children}</PollContext.Provider>;
}

export function usePoll() {
  return useContext(PollContext);
}
