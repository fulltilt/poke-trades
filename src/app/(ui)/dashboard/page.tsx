// import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser, getUsersCardLists } from "~/server/queries";
import Link from "next/link";
import NewTradeComponent from "./newList";

export default async function Dashboard() {
  const user = auth();
  if (!user.userId) redirect("/");

  const loggedInUser = await getUser(user.userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const cardLists = await getUsersCardLists(user.userId);
  const publicLists = cardLists.filter((l) => !l.is_private);
  const privateLists = cardLists.filter((l) => l.is_private);

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1.5 text-sm text-gray-500"></p>
          </div>

          <div className="flex items-center gap-4">
            <NewTradeComponent user={user.userId} />
          </div>
        </div>
      </div>

      <main className="max-w-screen-xl flex-1 pt-2">
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Public Lists</p>
            <ul className="list-none">
              {publicLists.map((l) => (
                <li key={l.cardListId}>
                  <Link href={`/dashboard/list/${l.cardListId}?name=${l.name}`}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Private Lists</p>
            <ul className="list-none">
              {privateLists.map((l) => (
                <li key={l.cardListId}>
                  <Link href={`/dashboard/list/${l.cardListId}?name=${l.name}`}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Pending Trades</p>
          </div>
          <div className="flex rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Completed Trades</p>
          </div>
        </div>
      </main>
    </div>
  );
}
