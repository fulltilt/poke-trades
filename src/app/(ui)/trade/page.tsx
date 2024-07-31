// import { Suspense } from "react";

// import { SkeletonCard } from "~/components/skeletonCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  getCardList,
  getTradeLists,
  getUser,
  getUsersCardLists,
} from "~/server/queries";

type List = {
  id: number;
  name: string;
  username: string;
  card_id: string;
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
  // const wishListCardIds = cardsInWishList?.data.map((l) => l.cardId);
  console.log(cardsInWishList);

  // aggregate other users trade lists that contain Cards in Wish List
  const otherUsersTradeLists = (await getTradeLists(user.userId)) as List[];
  const aggregatedListData = otherUsersTradeLists.reduce<
    Map<number, { username: string; listname: string }>
  >((acc, curr) => {
    acc.set(curr.id, {
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
  // console.log(tradeListsMap);
  // tradeListsMap.forEach((value) => {
  //   console.log(value.filter((val) => wishListCardIds?.includes(val)));
  // });

  // Array.from(tradeListsMap.entries()).map((l) => console.log(l));

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
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          {Array.from(tradeListsMap.entries()).map((list) => {
            const [id, cardList] = [list[0], list[1]];
            const username = aggregatedListData.get(id)?.username;
            const listname = aggregatedListData.get(id)?.listname;
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
              <div
                key={id}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
              >
                <dt className="font-medium text-gray-900">{listname}</dt>
                <dd className="text-gray-700 sm:col-span-2">{username}</dd>
                <dd className="text-gray-700 sm:col-span-2">
                  <ul>
                    {cardData.map((card) => (
                      <li>
                        {card?.name} - {card?.set} - {card?.number}/
                        {card?.printedTotal}
                      </li>
                    ))}
                  </ul>
                </dd>
                <dd>
                  <Button>Request Trade</Button>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
