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
      <div className="mt-12 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">How this works</h2>
        <p>This app works off two lists: a Trade List and Wish List:</p>
        <ol className="list-decimal">
          <li>
            The Trade List are the list of cards you have that you wish to use
            for trades. This list will be used to match to other users Wish
            Lists
          </li>
          <li>
            The Wish List works in reverse where this list will be used to match
            to other users Trade Lists
          </li>
        </ol>
        <p>
          Once you&apos;re in the Dashboard, go ahead and populate both lists.
          The site is still in its infancy so there won&apos;t be a lot of
          matches at first but we will be looking to grow in time.
        </p>
      </div>
    </div>
  );
}
