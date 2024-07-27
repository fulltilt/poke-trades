import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UsernameForm from "./form";
import { getUser } from "~/server/queries";

export default async function Username() {
  const user = auth();
  if (!user.userId) redirect("/");

  const currentUser = await getUser(user.userId);
  if (currentUser?.username) redirect("/dashboard");

  return (
    <div className="m-20 flex flex-col items-center">
      <p className="text-[30px] font-bold">Welcome to Poke-Trades!</p>
      <p className="mt-20 text-[20px] font-bold">Create Username</p>
      <UsernameForm userId={user.userId} />
    </div>
  );
}
