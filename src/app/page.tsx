import { LoginButton, LogoutButton } from "@/components/auth-buttons";
import { auth } from "@/app/auth";

export default async function Home() {
  const session = await auth();

  return <div>{session?.user ? <LoginButton /> : <LogoutButton />}</div>;
}
