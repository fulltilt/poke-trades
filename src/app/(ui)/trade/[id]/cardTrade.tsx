"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Card } from "~/app/types";
import { getPrice } from "~/app/utils/helpers";
import { Favorite } from "../../cardlist/[id]/card";
import { getCardsInList, updateCardList } from "~/server/queries";
import { useEffect, useState } from "react";
import ModalPaginationComponent from "~/components/modal-pagination";

export default function CardTradeComponent({
  cards,
  user_id,
  list_id,
  tradeList,
  updateList,
  cardListIds,
}: {
  cards: { cards: (Card | null)[]; totalCount: number };
  user_id: string;
  list_id: number;
  tradeList: Card[];
  updateList: (cards: Card[]) => void;
  cardListIds: (string | null)[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [cardPage, setCardPage] = useState(cards.cards);

  useEffect(() => {
    getCardsInList(cardListIds as string[], currentPage, pageSize)
      .then((res) => setCardPage(res.cards))
      .catch((err) => console.log(err));
  }, [currentPage, pageSize, cardListIds]);

  return (
    <div>
      <div className="m-auto flex max-w-[1200px] flex-col">
        <div className="m-auto grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cardPage.map((card) => {
            const isCardInTradeList = tradeList.some((c) => c.id === card?.id);
            const cardPrice = getPrice(card);

            return (
              <div key={card?.id} className="pb-8">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative">
                        <img
                          src={card?.images.small}
                          alt={`${card?.name}`}
                          className="cursor-pointer"
                        />
                        <p className="absolute bottom-0 left-0 rounded-sm bg-white p-1 text-[12px] font-semibold">
                          {card?.number}/{card?.set?.printedTotal}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {card?.name} - {card?.set?.name} - {card?.number}/
                        {card?.set?.printedTotal}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex justify-between p-2">
                  <div className="text-[#106bc5]">${cardPrice}</div>
                  <div
                    onClick={async () => {
                      const updateRes = await updateCardList(
                        user_id ?? "",
                        list_id,
                        card?.id ?? "",
                        isCardInTradeList ? -1 : 1,
                      );
                      if (updateRes?.error) {
                        return;
                      } else {
                        if (isCardInTradeList)
                          updateList(
                            tradeList.filter((c) => c.id !== card?.id),
                          );
                        else
                          updateList(
                            tradeList.concat(
                              Object.assign({}, card, { price: cardPrice }),
                            ),
                          );
                      }
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Favorite
                            fill={isCardInTradeList ? "red" : "#b6b6b6"}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add/Remove from Trade</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="m-auto mt-6">
          <ModalPaginationComponent
            totalCount={cards.totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
