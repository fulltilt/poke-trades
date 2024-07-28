import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser, getUsersCardLists } from "~/server/queries";
import Link from "next/link";

export default async function Dashboard() {
  const user = auth();
  if (!user.userId) redirect("/");

  const loggedInUser = await getUser(user.userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const cardLists = await getUsersCardLists(user.userId);
  const publicLists = cardLists.filter((l) => !l.isPrivate);
  const privateLists = cardLists.filter((l) => l.isPrivate);

  return (
    <div className="flex flex-col md:items-center">
      <div className="mt-20 flex w-full max-w-[1200px] flex-col gap-8 md:flex-row">
        <div className="flex w-1/2 rounded-sm border-[1px] border-solid border-black p-6">
          <p className="font-bold">Pending Trades</p>
        </div>
        <div className="flex w-1/2 rounded-sm border-[1px] border-solid border-black p-6">
          <p className="font-bold">Completed Trades</p>
        </div>
      </div>
      <div className="mt-20 flex w-full max-w-[1200px] flex-col gap-8 md:flex-row">
        <div className="w-1/2 rounded-sm border-[1px] border-solid border-black p-6">
          <p className="font-bold">Public Lists</p>
          <ul className="list-none">
            {publicLists.map((l) => (
              <li key={l.cardListId}>
                <Link href={`/dashboard/list/${l.cardListId}`}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 rounded-sm border-[1px] border-solid border-black p-6">
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
    </div>
  );
}
