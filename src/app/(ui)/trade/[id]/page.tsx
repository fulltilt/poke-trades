import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCardsInList,
  getTrade,
  getTradeListCards,
  getUser,
} from "~/server/queries";
import type { Card } from "~/app/types";
import { sortByDateAndThenNumber } from "~/app/utils/helpers";
import TradeUpdate from "./tradeUpdate";
import { Suspense } from "react";
import TradeStatusUpdate from "./statusUpdate";

export default async function Trade({ params }: { params?: { id: string } }) {
  const user = auth();
  if (!user.userId) redirect("/");

  const loggedInUser = await getUser(user.userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const tradeId = Number(params?.id) ?? 0;
  const trade = (await getTrade(tradeId))[0];

  const [currentUserListId, otherUserListId] =
    user.userId === trade?.user_id
      ? [trade?.card_list_id, trade?.other_user_card_list_id]
      : [trade?.other_user_card_list_id, trade?.card_list_id];
  const card_list_id = trade?.card_list_id ?? 0;
  const other_user_card_list_id = trade?.other_user_card_list_id ?? 0;
  const tradeListCards = await getTradeListCards(
    card_list_id,
    other_user_card_list_id,
  );
  const userCardlistIds = tradeListCards
    ?.filter((card) => card.card_list_id === currentUserListId)
    .map((card) => card.card_id);
  const otherUserCardListIds = tradeListCards
    .filter((card) => card.card_list_id === otherUserListId)
    .map((card) => card.card_id);
  const userCards = (await getCardsInList(userCardlistIds as string[]))
    .map((obj) => obj.data)
    ?.sort((a, b) => sortByDateAndThenNumber(a!, b!));

  const otherUserCards = (
    await getCardsInList(otherUserCardListIds as string[])
  )
    .map((obj) => obj.data)
    ?.sort((a, b) => sortByDateAndThenNumber(a!, b!));

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Trade
            </h1>

            <p className="mt-1.5 text-sm text-gray-500"></p>
          </div>
          <div className="flex items-center gap-4">
            <TradeStatusUpdate
              tradeId={tradeId}
              tradeUserStatusField={
                trade?.user_id === user.userId
                  ? "user_status"
                  : "other_user_status"
              }
              userStatus={
                trade?.user_id === user.userId
                  ? trade?.user_status
                  : trade!.other_user_status
              }
            />
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TradeUpdate
          userCards={userCards as Card[]}
          user_id={trade!.user_id}
          other_user_id={trade!.other_user_id}
          otherUserCards={otherUserCards as Card[]}
          otherUserName={trade!.other_user_name ?? ""}
          sub_card_list_id={trade!.user_sub_card_list_id ?? 0}
          other_sub_card_list_id={trade!.other_user_sub_card_list_id ?? 0}
          userStatus={
            trade?.user_id === user.userId
              ? trade?.user_status
              : trade!.other_user_status
          }
        />
      </Suspense>
    </div>
  );
}
