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
import { getCardsInCardList } from "~/server/queries";
import { Button } from "~/components/ui/button";
import { fixedTwoDecimals, getPrice } from "~/app/utils/helpers";

export default function TradeUpdate({
  userCards,
  otherUserCards,
  otherUserName,
  user_id,
  other_user_id,
  sub_card_list_id,
  other_sub_card_list_id,
  userStatus,
}: {
  userCards: Card[];
  otherUserCards: Card[];
  otherUserName: string;
  user_id: string;
  other_user_id: string;
  sub_card_list_id: number;
  other_sub_card_list_id: number;
  userStatus: number | null;
}) {
  const [userList, setUserList] = useState<Card[]>([]);
  const [otherUserList, setOtherUserList] = useState<Card[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentList, setCurrentList] = useState(0);

  useEffect(() => {
    getCardsInCardList(sub_card_list_id)
      .then((res) => {
        res = res.map((card) =>
          Object.assign({}, card, { price: getPrice(card!) }),
        );
        setUserList(res as Card[]);
      })
      .catch((err) => console.log(err));

    getCardsInCardList(other_sub_card_list_id)
      .then((res) => {
        res = res.map((card) =>
          Object.assign({}, card, { price: getPrice(card!) }),
        );
        setOtherUserList(res as Card[]);
      })
      .catch((err) => console.log(err));
  }, [sub_card_list_id, other_sub_card_list_id]);

  return (
    <div>
      <div className="flex max-w-screen-xl justify-between border-b-[1px] px-4 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex w-1/2 items-center justify-center gap-8 border-r-[1px] font-bold">
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

        <div className="flex w-1/2 items-center justify-center gap-8 font-bold">
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
      </div>

      <div className="flex max-w-screen-xl justify-between border-b-[1px] px-4 sm:px-6 sm:py-4 lg:px-8">
        {userList.length ? (
          <table className="m-auto w-1/2 border-r-[1px]">
            <thead></thead>
            <tbody>
              {userList.map((card) => {
                return (
                  <tr key={card.id} className="p-2">
                    <td className="text-center">
                      {card?.name} - {card?.set?.name} - {card?.number}/
                      {card?.set?.printedTotal}
                    </td>
                    <td className="text-[green]">${getPrice(card)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="w-1/2 text-center">List empty</p>
        )}

        {otherUserList.length ? (
          <table className="m-auto w-1/2">
            <thead></thead>
            <tbody>
              {otherUserList.map((card) => (
                <tr key={card.id}>
                  <td className="text-center">
                    {card?.name} - {card?.set?.name} - {card?.number}/
                    {card?.set?.printedTotal}
                  </td>
                  <td className="text-[green]">${getPrice(card)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="w-1/2 text-center">List empty</p>
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
            <h2 className="text-xl font-semibold">
              {currentList === sub_card_list_id
                ? "Your Cards"
                : `${otherUserName}'s Cards`}
            </h2>
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
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
