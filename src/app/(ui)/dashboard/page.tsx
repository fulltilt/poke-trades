import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser, getUsersCardLists } from "~/server/queries";
import Link from "next/link";
import { Button } from "~/components/ui/button";

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
    <div className="flex-colrounded-md flex max-h-full flex-1 pl-14 pr-14">
      <main className="flex-1 pt-2">
        <div className="mt-4">
          <p className="text-3xl font-bold">Dashboard</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Pending Trades</p>
          </div>
          <div className="flex rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Completed Trades</p>
          </div>
          <div className="rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Public Lists</p>
            <ul className="list-none">
              {publicLists.map((l) => (
                <li key={l.cardListId}>
                  <Link href={`/dashboard/list/${l.cardListId}`}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border-[1px] border-solid border-black p-6">
            <p className="font-bold">Private Lists</p>
            <ul className="list-none">
              {privateLists.map((l) => (
                <li key={l.cardListId}>
                  <Link href={`/dashboard/list/${l.cardListId}`}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
