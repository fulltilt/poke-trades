// import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCardList,
  getTradeLists,
  getUser,
  getUsersCardLists,
} from "~/server/queries";
import TradeViewComponent from "./tradeView";

type List = {
  id: number;
  name: string;
  username: string;
  card_id: string;
  auth_id: string;
};
// tradelist1(23 hotmail) 205,206,207,208.209.211
// wish list(20 gmail) 205,206 swsh12pt5-160

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

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Trades
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              See other users public trade lists with cards in your Wish List
            </p>
          </div>

          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
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
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {Array.from(tradeListsMap.entries()).map((list) => {
              const [id, cardList] = [list[0], list[1]];
              const username = aggregatedListData.get(id)?.username;
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
                    <TradeViewComponent
                      userId={user.userId}
                      otherUserId={otherUserId}
                      wishListId={wishListId}
                      otherUserListId={id}
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
