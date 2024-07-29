"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Minus, Plus } from "~/app/(ui)/cardlist/[id]/card";
import { fixedTwoDecimals } from "~/app/utils/helpers";
import { Card, updateCardList } from "~/server/queries";

export const columns: ColumnDef<{
  userId: string;
  cardId: string;
  cardListId: number;
  name: string;
  quantity: number;
  data: Card;
}>[] = [
  {
    cell: function Cell({ row }) {
      const [quantity, setQuantity] = useState(row?.original.quantity);
      return (
        <div className="flex">
          <div
            className="cursor-pointer font-bold"
            onClick={async () => {
              if (quantity === 0) return;
              const updateRes = await updateCardList(
                row?.original.userId ?? "",
                row?.original.cardListId ?? 0,
                row?.original.cardId ?? "",
                -1,
              );
              if (updateRes?.error) {
                // TODO: display error message
                return;
              }

              setQuantity(quantity - 1);
            }}
          >
            <Minus />
          </div>
          <div className="bold ml-4 mr-4">{quantity}</div>
          <div
            className="cursor-pointer font-bold"
            onClick={async () => {
              console.log();
              const updateRes = await updateCardList(
                row?.original.userId ?? "",
                row?.original.cardListId ?? 0,
                row?.original.cardId ?? "",
                1,
              );
              if (updateRes?.error) {
                // TODO: display error message
                return;
              }
              setQuantity(quantity + 1);
            }}
          >
            <Plus />
          </div>
        </div>
      );
    },
    header: "Quantity",
  },
  {
    accessorKey: "data.name",
    header: "Name",
  },
  {
    accessorFn: (row) => `${row?.data?.number}/${row?.data?.set?.printedTotal}`,
    header: "Number",
  },
  {
    accessorFn: (row) =>
      `$${
        fixedTwoDecimals(row?.data?.tcgplayer?.prices?.normal?.market) ??
        fixedTwoDecimals(row?.data?.tcgplayer?.prices?.holofoil?.market) ??
        fixedTwoDecimals(
          row?.data?.tcgplayer?.prices?.reverseHolofoil?.market,
        ) ??
        fixedTwoDecimals(
          row?.data?.tcgplayer?.prices?.unlimitedHolofoil?.market,
        ) ??
        fixedTwoDecimals(
          row?.data?.tcgplayer?.prices?.["1EditionHolofoil"]?.market,
        ) ??
        fixedTwoDecimals(row?.data?.tcgplayer?.prices?.unlimited?.market) ??
        fixedTwoDecimals(
          row?.data?.tcgplayer?.prices?.["1stEdition"]?.market,
        ) ??
        0
      }`,
    header: "Price",
  },
];
