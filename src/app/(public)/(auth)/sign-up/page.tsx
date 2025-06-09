import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GalleryVerticalEnd } from "lucide-react";
import { GithubSignIn } from "@/components/github-sign-in";
import SignUpForm from "./sign-up-form";

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          DeadPoll
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Sign up</CardTitle>
              <CardDescription>
                Register with your Github account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <GithubSignIn />
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <SignUpForm />
                <div className="text-center text-sm">
                  Déjà un compte ?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
