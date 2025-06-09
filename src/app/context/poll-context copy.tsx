"use client";

import { User } from "@/app/types/users";
import { createContext, useContext } from "react";

export const UserContext = createContext<User | null>(null);

export function UserContextProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
