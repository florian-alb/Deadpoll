import { LogoutButton } from "@/components/auth-buttons";
import { auth } from "@/app/auth";
import { GithubSignIn } from "@/components/github-sign-in";

import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return <div>{!session?.user ? <GithubSignIn /> : <LogoutButton />}</div>;
}
