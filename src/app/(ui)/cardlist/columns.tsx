"use client";

import { useState } from "react";
import { Minus, Plus } from "~/app/(ui)/cardlist/[id]/card";
import { getPrice } from "~/app/utils/helpers";
import { updateCardList } from "~/server/queries";
import type { Card } from "~/app/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<{
  data: Card | null;
}>[] = [
  {
    cell: function Cell({ row }) {
      //   const [quantity, setQuantity] = useState(row?.original.quantity);
      return (
        <div className="flex">
          <div
            className="cursor-pointer font-bold"
            onClick={async () => {
              //   if (quantity === 0) return;
              //   const updateRes = await updateCardList(
              //     row?.original.userId ?? "",
              //     row?.original.cardListId ?? 0,
              //     row?.original.cardId ?? "",
              //     -1,
              //   );
              //   if (updateRes?.error) {
              //     // TODO: display error message
              //     return;
              //   }
              //   setQuantity(quantity - 1);
            }}
          >
            <Minus />
          </div>
          <div className="bold ml-4 mr-4">1</div>
          <div
            className="cursor-pointer font-bold"
            onClick={async () => {
              //   if (
              //     row?.original.name === "Wish List" &&
              //     row?.original.quantity === 1
              //   )
              //     return;
              //   const updateRes = await updateCardList(
              //     row?.original.userId ?? "",
              //     row?.original.cardListId ?? 0,
              //     row?.original.cardId ?? "",
              //     1,
              //   );
              //   if (updateRes?.error) {
              //     // TODO: display error message
              //     return;
              //   }
              //   setQuantity(quantity + 1);
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
    cell: function Cell({ row }) {
      return (
        <Link
          href={`/cardlist/${row?.original.data?.set.id}?page=1&pageSize=30`}
          className="text-[#106bc5]"
        >{`${row?.original.data?.set.name}`}</Link>
      );
    },
    accessorFn: (row) => `${row?.data?.set.name}`,
    header: "Set",
  },
  {
    accessorFn: (row) => `${row?.data?.number}/${row?.data?.set?.printedTotal}`,
    header: "Number",
  },
  {
    cell: function Cell({ row }) {
      return (
        <p className="text-[#106bc5]">{`$${getPrice(row?.original.data!)}`}</p>
      );
    },
    header: "Price",
  },
];
