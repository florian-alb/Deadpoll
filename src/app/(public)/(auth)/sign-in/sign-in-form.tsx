"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInForm() {
  const [loading, setLoading] = useState(false);

  async function credentialsAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        switch (res.error) {
          case "CredentialsSignin":
            toast.error("Email ou mot de passe incorrect.");
            break;
          case "CallbackRouteError":
            toast.error(
              "Une erreur de serveur s'est produite. Veuillez réessayer plus tard."
            );
            break;
          case "FetchError":
          case "NetworkError":
            toast.error("Erreur de réseau, veuillez vérifier votre connexion.");
            break;
          default:
            toast.error(
              "Une erreur inconnue s'est produite. Veuillez réessayer."
            );
        }
      } else if (res?.ok && res?.url) {
        window.location.replace(res.url);
      }
    } catch {
      toast.error(
        "Une erreur de réseau ou de client s'est produite. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
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
