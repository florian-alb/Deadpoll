import { auth } from "@/app/auth";
import { LogoutButton } from "@/components/auth-buttons";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  console.log("session:", session);

  return (
    <div>
      {session?.user ? (
        <LogoutButton />
      ) : (
        <Link href="./sign-in">
          <Button>
            <LogIn />
            Sign In
          </Button>
        </Link>
      )}
      <p>salut</p>
    </div>
  );
}
