"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import CardTradeComponent from "./cardTrade";
import type { Card } from "~/app/types";
import { getCardsInCardList, updateCardList } from "~/server/queries";
import { Button } from "~/components/ui/button";
import { fixedTwoDecimals, getPrice } from "~/app/utils/helpers";
import { Skeleton } from "~/components/ui/skeleton";

export function XMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export default function TradeUpdate({
  userCards,
  otherUserCards,
  otherUserName,
  user_id,
  other_user_id,
  sub_card_list_id,
  other_sub_card_list_id,
  userStatus,
  userCardlistIds,
  otherUserCardListIds,
}: {
  userCards: { cards: (Card | null)[]; totalCount: number };
  otherUserCards: { cards: (Card | null)[]; totalCount: number };
  otherUserName: string;
  user_id: string;
  other_user_id: string;
  sub_card_list_id: number;
  other_sub_card_list_id: number;
  userStatus: number | null;
  userCardlistIds: (string | null)[];
  otherUserCardListIds: (string | null)[];
}) {
  const [userList, setUserList] = useState<Card[]>([]);
  const [otherUserList, setOtherUserList] = useState<Card[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentList, setCurrentList] = useState(0);
  const [userLoading, setUserLoading] = useState(true);
  const [otherUserLoading, setOtherUserLoading] = useState(true);

  useEffect(() => {
    getCardsInCardList(sub_card_list_id, 1, 30, "", "")
      .then((res) => {
        const cards = res.cards.map((card) =>
          Object.assign({}, card, { price: getPrice(card) }),
        );
        setUserList(cards as Card[]);
      })
      .catch((err) => console.log(err))
      .finally(() => setUserLoading(false));

    getCardsInCardList(other_sub_card_list_id, 1, 30, "", "")
      .then((res) => {
        const cards = res.cards.map((card) =>
          Object.assign({}, card, { price: getPrice(card) }),
        );
        setOtherUserList(cards as Card[]);
      })
      .catch((err) => console.log(err))
      .finally(() => setOtherUserLoading(false));
  }, [sub_card_list_id, other_sub_card_list_id]);

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="flex flex-col px-4 sm:w-1/2 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-8 border-b-[1px] pb-4 font-bold sm:justify-center">
          <p>You</p>
          <Button
            onClick={() => {
              setCurrentList(sub_card_list_id);
              setOpenDialog(true);
            }}
            disabled={(userStatus ?? 0) >= 3}
          >
            Open List
          </Button>
          <div className="text-[green]">
            $
            {fixedTwoDecimals(
              userList.reduce(
                (acc, curr) => acc + (Number(curr?.price) ?? 0),
                0,
              ),
            )}
          </div>
        </div>

        {userList.length ? (
          <div className="flex max-w-screen-xl border-b-[1px] px-4 sm:px-6 sm:py-4 lg:px-8">
            <table className="w-full">
              <thead></thead>
              <tbody>
                {userList.map((card) => {
                  return (
                    <tr
                      key={card.id}
                      className="flex items-center justify-between p-2"
                    >
                      <td
                        onClick={async () => {
                          await updateCardList(
                            user_id ?? "",
                            sub_card_list_id,
                            card?.id ?? "",
                            -1,
                          );

                          setUserList(userList.filter((c) => c.id !== card.id));
                        }}
                      >
                        <XMark />
                      </td>
                      <td className="text-center">
                        <p className="font-semibold">{card?.name}</p>
                        <p>
                          {card?.set?.name} - {card?.number}/
                          {card?.set?.printedTotal}
                        </p>
                      </td>
                      <td className="text-[green]">${getPrice(card)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        {userLoading && (
          <div className="flex items-center justify-around px-4 sm:px-6 sm:py-4 lg:px-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="w-[50%] space-y-2">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        )}
        {!userLoading && userList.length === 0 && (
          <p className="mt-4 text-center">List currently empty</p>
        )}
      </div>

      <div className="mt-12 flex flex-col px-4 sm:mt-0 sm:w-1/2 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-8 border-b-[1px] pb-4 font-bold sm:justify-center">
          <p>{otherUserName}</p>
          <Button
            onClick={() => {
              setCurrentList(other_sub_card_list_id);
              setOpenDialog(true);
            }}
            disabled={(userStatus ?? 0) >= 3}
          >
            Open List
          </Button>
          <div className="text-[green]">
            $
            {fixedTwoDecimals(
              otherUserList.reduce(
                (acc, curr) => acc + (Number(curr?.price) ?? 0),
                0,
              ),
            )}
          </div>
        </div>

        {otherUserList.length ? (
          <div className="flex max-w-screen-xl justify-between border-b-[1px] px-4 sm:px-6 sm:py-4 lg:px-8">
            <table className="m-auto w-full">
              <thead></thead>
              <tbody>
                {otherUserList.map((card) => (
                  <tr
                    key={card.id}
                    className="flex items-center justify-between p-2"
                  >
                    <td
                      onClick={async () => {
                        await updateCardList(
                          other_user_id ?? "",
                          other_sub_card_list_id,
                          card?.id ?? "",
                          -1,
                        );

                        setOtherUserList(
                          otherUserList.filter((c) => c.id !== card.id),
                        );
                      }}
                    >
                      <XMark />
                    </td>
                    <td className="text-center">
                      <p className="font-semibold">{card?.name}</p>
                      <p>
                        {card?.set?.name} - {card?.number}/
                        {card?.set?.printedTotal}
                      </p>
                    </td>
                    <td className="text-[green]">${getPrice(card)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {otherUserLoading && (
          <div className="flex items-center justify-around px-4 sm:px-6 sm:py-4 lg:px-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="w-[50%] space-y-2">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        )}
        {!otherUserLoading && otherUserList.length === 0 && (
          <p className="mt-4 text-center">List currently empty</p>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          onEscapeKeyDown={() => setOpenDialog(false)}
          onInteractOutside={() => setOpenDialog(false)}
          className="max-h-[90vh] min-w-[95%] overflow-y-scroll"
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-xl font-semibold">
                {currentList === sub_card_list_id
                  ? "Your Cards"
                  : `${otherUserName}'s Cards`}
              </h2>
              <p>Click on Heart icon to add to or remove from trade</p>
            </div>
            <CardTradeComponent
              cards={
                currentList === sub_card_list_id ? userCards : otherUserCards
              }
              user_id={
                currentList === sub_card_list_id ? user_id : other_user_id
              }
              list_id={currentList}
              tradeList={
                currentList === sub_card_list_id ? userList : otherUserList
              }
              updateList={
                currentList === sub_card_list_id
                  ? setUserList
                  : setOtherUserList
              }
              cardListIds={
                currentList === sub_card_list_id
                  ? userCardlistIds
                  : otherUserCardListIds
              }
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
