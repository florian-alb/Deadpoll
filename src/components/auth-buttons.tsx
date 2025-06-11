"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <Button onClick={() => signIn()}>
      <LogIn />
      Connection
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button onClick={() => signOut()}>
      <LogOut />
      Déconnection
    </Button>
  );
};

export function LogoutLink({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex w-full gap-2 items-center", className)}
      onClick={() => signOut()}
      {...props}
    >
      <LogOut />
      Déconnection
    </div>
  );
}
