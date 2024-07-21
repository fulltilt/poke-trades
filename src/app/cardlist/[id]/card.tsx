"use client";

import { Card, SSet } from "~/server/queries";

function Favorite({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      // stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

export default function CardComponent({
  card,
  setInfo,
  userId,
}: {
  card: Card | null;
  setInfo: any | null;
  userId: string | null;
}) {
  {
    const holo = card?.tcgplayer?.prices?.holofoil?.market
      ? (Math.round(card.tcgplayer.prices.holofoil.market * 100) / 100).toFixed(
          2,
        )
      : undefined;
    const reverse = card?.tcgplayer?.prices?.normal?.market
      ? (Math.round(card.tcgplayer.prices.normal.market * 100) / 100).toFixed(2)
      : undefined;
    const normal = card?.tcgplayer?.prices?.reverseHolofoil?.market
      ? (
          Math.round(card.tcgplayer.prices.reverseHolofoil.market * 100) / 100
        ).toFixed(2)
      : undefined;

    return (
      <div key={card?.id} className="pb-8">
        <img
          src={card?.images.small}
          alt={`${card?.name}`}
          className="cursor-pointer transition-all duration-200 hover:scale-105"
        />
        <div className="flex justify-between p-2">
          <div>
            {card?.number}/{setInfo?.total}
          </div>
          <div>${holo ?? reverse ?? normal ?? "-"}</div>
          <div onClick={() => console.log(userId, card?.id)}>
            <Favorite fill={"#b6b6b6"} />
          </div>
        </div>
      </div>
    );
  }
}
