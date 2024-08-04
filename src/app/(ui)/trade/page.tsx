// import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCardList,
  getTradeLists,
  getTrades,
  getUser,
  getUsersCardLists,
} from "~/server/queries";
import TradeConfirmComponent from "./tradeConfirm";
import { Button } from "~/components/ui/button";
import Link from "next/link";

type List = {
  id: number;
  name: string;
  username: string;
  card_id: string;
  auth_id: string;
};

export default async function TradeComponent() {
  const user = auth();
  if (!user.userId) redirect("/");

  const loggedInUser = await getUser(user.userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  // aggregate Wish List
  const wishListId =
    (await getUsersCardLists(user.userId)).filter(
      (list) => list.name === "Wish List",
    )[0]?.cardListId ?? 0;
  const cardsInWishList = await getCardList(user.userId, wishListId, 1, 30);

  // aggregate other users trade lists that contain Cards in Wish List
  const otherUsersTradeLists = (await getTradeLists(user.userId)) as List[];
  const aggregatedListData = otherUsersTradeLists.reduce<
    Map<number, { username: string; listname: string; other_user_id: string }>
  >((acc, curr) => {
    acc.set(curr.id, {
      other_user_id: curr.auth_id,
      username: curr.username,
      listname: curr.name,
    });
    return acc;
  }, new Map());
  const tradeListsMap = otherUsersTradeLists.reduce<Map<number, string[]>>(
    (lists, current) => {
      if (!lists.has(current.id)) lists.set(current.id, []);
      lists.get(current.id)?.push(current.card_id);
      return lists;
    },
    new Map(),
  );

  const trades = await getTrades(user.userId);

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Trades
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              View potential trades and view current and past trades
            </p>
          </div>

          <div className="flex items-center gap-4"></div>
        </div>
      </div>

      <div className="max-w-screen-xl overflow-x-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="text-xl font-semibold">In Progress Trades</h2>
        <p className="mb-8 mt-1.5 text-sm text-gray-500">
          See other users public trade lists with cards in your Wish List
        </p>
        {trades.length ? (
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Requester
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Other User
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                    {trade.username}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                    {trade.other_user_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                    {new Date(trade.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                    <Button>
                      <Link href={`/trade/${trade.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No trades currently in progress</p>
        )}

        <h2 className="mt-16 text-xl font-semibold">Potential Trade Lists</h2>
        <p className="mb-8 mt-1.5 text-sm text-gray-500">
          See other users public trade lists with cards in your Wish List
        </p>
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                List Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                User
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Cards in Wish List
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {Array.from(tradeListsMap.entries()).map((list) => {
              const [id, cardList] = [list[0], list[1]];

              // omit row if the trade is in progress
              if (trades.map((t) => t.other_user_card_list_id).includes(id))
                return;

              const username = aggregatedListData.get(id)?.username ?? "";
              const listname = aggregatedListData.get(id)?.listname;
              const otherUserId =
                aggregatedListData.get(id)?.other_user_id ?? "";
              const cardData = cardList.map((cardId) => {
                const cardData = cardsInWishList?.data?.filter(
                  (c) => c.cardId === cardId,
                )[0]?.data;

                return {
                  id: cardId,
                  name: cardData?.name,
                  set: cardData?.set.name,
                  number: cardData?.number,
                  printedTotal: cardData?.set.printedTotal,
                };
              });
              return (
                <tr key={id}>
                  <td className="whitespace-nowrap px-4 py-2 text-center font-medium text-gray-900">
                    {listname}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                    {username}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                    <ul>
                      {cardData.map((card) => (
                        <li key={card.id}>
                          {card?.name} - {card?.set} - {card?.number}/
                          {card?.printedTotal}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">
                    <TradeConfirmComponent
                      userId={user.userId}
                      otherUserId={otherUserId}
                      wishListId={wishListId}
                      otherUserListId={id}
                      username={loggedInUser?.username ?? ""}
                      otherUsername={username}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
