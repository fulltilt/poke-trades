import { redirect } from "next/navigation";
import UsernameForm from "./form";
import { getUser } from "~/server/queries";
import { auth } from "~/app/api/auth/authConfig";

export default async function Username() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session?.user?.id ?? "";
  const loggedInUser = await getUser(userId);
  if (loggedInUser?.username) {
    redirect("/dashboard");
  }

  return (
    <div className="m-20 flex flex-col items-center">
      <p className="text-[30px] font-bold">Welcome to Poke-Trades!</p>
      <p className="mt-20 text-[20px] font-bold">Create Username</p>
      <UsernameForm userId={userId} />
    </div>
  );
}
