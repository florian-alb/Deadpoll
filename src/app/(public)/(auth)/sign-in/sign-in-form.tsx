"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInForm() {
  const [loading, setLoading] = useState(false);

  async function credentialsAction(formData: FormData) {
    setLoading(true);

    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setLoading(false);

    if (res?.error) toast.error("Mauvais identifiant ou mot de passe");
  }

  return (
    <form action={credentialsAction}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="credentials-email">E-mail</Label>
          <Input type="email" id="credentials-email" name="email" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="credentials-password">Mot de passe</Label>
          <Input type="password" id="credentials-password" name="password" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connection..." : "Se Connecter"}
        </Button>
      </div>
    </form>
  );
}
