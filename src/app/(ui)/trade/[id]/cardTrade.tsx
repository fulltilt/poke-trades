"use client";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "~/components/ui/tooltip";
import type { Card } from "~/app/types";
import { fixedTwoDecimals } from "~/app/utils/helpers";
// import { Favorite } from "../../cardlist/[id]/card";

export default function CardTradeComponent({
  cards,
  list_id,
}: {
  cards: Card[];
  list_id: number;
}) {
  return (
    <div>
      <div className="m-auto flex max-w-[1200px] flex-col">
        <div className="m-auto grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cards.map((card) => {
            const unlimitedHolo = fixedTwoDecimals(
              card?.tcgplayer?.prices?.unlimitedHolofoil?.market,
            );
            const firstEditionHolo = fixedTwoDecimals(
              card?.tcgplayer?.prices?.["1stEdition"]?.market,
            );
            const unlimited = fixedTwoDecimals(
              card?.tcgplayer?.prices?.unlimited?.market,
            );
            const firstEdition = fixedTwoDecimals(
              card?.tcgplayer?.prices?.["1stEdition"]?.market,
            );
            const holo = fixedTwoDecimals(
              card?.tcgplayer?.prices?.holofoil?.market,
            );
            const reverse = fixedTwoDecimals(
              card?.tcgplayer?.prices?.reverseHolofoil?.market,
            );
            const normal = fixedTwoDecimals(
              card?.tcgplayer?.prices?.normal?.market,
            );

            return (
              <div key={card?.id} className="pb-8">
                <img
                  src={card?.images.small}
                  alt={`${card?.name}`}
                  className="cursor-pointer opacity-50 transition-all duration-200 hover:opacity-100"
                />
                <div className="flex justify-between p-2">
                  <div>
                    {card?.number}/{card?.set?.printedTotal}
                  </div>
                  <div>
                    $
                    {firstEditionHolo ??
                      unlimitedHolo ??
                      firstEdition ??
                      unlimited ??
                      holo ??
                      reverse ??
                      normal ??
                      "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
