import { redirect } from "next/navigation";
import {
  getCardsInList,
  getTrade,
  getTradeListCards,
  getUser,
} from "~/server/queries";
import TradeUpdate from "./tradeUpdate";
import { Suspense } from "react";
import TradeStatusUpdate from "./statusUpdate";
import { auth } from "~/app/api/auth/authConfig";

export default async function Trade({ params }: { params?: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session?.user?.id ?? "";
  const loggedInUser = await getUser(userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const tradeId = Number(params?.id) ?? 0;
  const trade = (await getTrade(tradeId))[0];

  const [currentUserListId, otherUserListId] =
    userId === trade?.user_id
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

  const userCards = await getCardsInList(userCardlistIds as string[]);
  const otherUserCards = await getCardsInList(otherUserCardListIds as string[]);

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
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
                trade?.user_id === userId ? "user_status" : "other_user_status"
              }
              userStatus={
                trade?.user_id === userId
                  ? trade?.user_status
                  : trade!.other_user_status
              }
              otherUserStatus={
                trade?.user_id === userId
                  ? trade.other_user_status
                  : trade?.user_status
              }
              user_id={
                trade?.user_id === userId
                  ? trade?.user_id
                  : trade!.other_user_id
              }
              other_user_id={
                trade?.user_id === userId
                  ? trade?.other_user_id
                  : trade!.user_id
              }
            />
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TradeUpdate
          userCards={userCards}
          user_id={trade!.user_id}
          other_user_id={trade!.other_user_id}
          otherUserCards={otherUserCards}
          otherUserName={trade!.other_user_name ?? ""}
          sub_card_list_id={trade!.user_sub_card_list_id ?? 0}
          other_sub_card_list_id={trade!.other_user_sub_card_list_id ?? 0}
          userStatus={
            trade?.user_id === userId
              ? trade?.user_status
              : trade!.other_user_status
          }
          userCardlistIds={userCardlistIds}
          otherUserCardListIds={otherUserCardListIds}
        />
      </Suspense>
    </div>
  );
}
