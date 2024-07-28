import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTradeLists, getUser, getUsersCardLists } from "~/server/queries";
import NewTradeComponent from "./newTrade";

export default async function TradeComponent() {
  const user = auth();
  if (!user.userId) redirect("/");

  const loggedInUser = await getUser(user.userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const cardLists = await getTradeLists(user.userId);
  //   const publicLists = cardLists.filter((l) => !l.isPrivate);
  //   const privateLists = cardLists.filter((l) => l.isPrivate);

  return (
    <div className="flex-colrounded-md flex max-h-full flex-1 pl-14 pr-14">
      <main className="flex-1 pt-2">
        <div className="mt-4">
          <p className="text-3xl font-bold">Trades</p>
        </div>
        <NewTradeComponent />
      </main>
    </div>
  );
}
