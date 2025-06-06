"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <Button onClick={() => signIn()}>
      <LogIn />
      Login
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button onClick={() => signOut()}>
      <LogOut />
      Logout
    </Button>
  );
};
