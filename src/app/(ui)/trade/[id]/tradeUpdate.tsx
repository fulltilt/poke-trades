"use client";

import { useEffect, useState } from "react";
import CardTradeComponent from "./cardTrade";
import { Card } from "~/app/types";
import { getCardList } from "~/server/queries";

export default function CardUpdate({
  userCards,
  otherUserCards,
  otherUserName,
  sub_card_list_id,
  other_sub_card_list_id,
}: {
  userCards: Card[];
  otherUserCards: Card[];
  otherUserName: string;
  sub_card_list_id: number;
  other_sub_card_list_id: number;
}) {
  const [userList, setUserList] = useState();
  const [otherUserList, setOtherUserList] = useState();

  useEffect(() => {
    // getCardList()
  }, []);

  return (
    <div>
      <div className="flex max-w-screen-xl justify-between border-b-[1px] px-4 sm:px-6 sm:py-4 lg:px-8">
        <div className="w-1/2 border-x-[1px] text-center font-bold">You</div>
        <div className="w-1/2 text-center font-bold">{otherUserName}</div>
        {/* <table className="m-auto w-full">
          <thead>
            <tr>
              <th>You</th>
              <th>{trade?.other_user_name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">te</td>
              <td className="text-center">vsdds</td>
            </tr>
          </tbody>
        </table> */}
      </div>

      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="mt-16 text-xl font-semibold">Your Cards</h2>
        <CardTradeComponent cards={userCards} />
      </div>
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="mt-16 text-xl font-semibold">
          {otherUserName}&apos;s Cards
        </h2>
        <CardTradeComponent cards={otherUserCards} />
      </div>
    </div>
  );
}
