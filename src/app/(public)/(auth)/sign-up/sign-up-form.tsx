"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Erreur à l'inscription");
      return;
    }

    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInRes?.error) {
      toast.error(
        "Compte créé, mais connexion impossible. Essayez de vous connecter."
      );
      //router.push("/login");
      return;
    }

    toast.success("Bienvenue !");
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Création du compte..." : "Sign up"}
        </Button>
      </div>
    </form>
  );
}
