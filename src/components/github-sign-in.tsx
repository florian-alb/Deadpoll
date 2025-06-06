import { Button } from "@/components/ui/button";
import Github from "@/components/icons/github";
import { signIn } from "@/app/auth";

const GithubSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { callbackUrl: "/dashboard" });
      }}
    >
      <Button className="w-full" variant="outline">
        <Github />
        Continue with GitHub
      </Button>
    </form>
  );
};

export { GithubSignIn };
