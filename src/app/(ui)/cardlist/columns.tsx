"use client";

import { useState } from "react";
import { Minus, Plus } from "~/app/(ui)/cardlist/[id]/card";
import { formatType, getPrice } from "~/app/utils/helpers";
import { getCardQuantityByList, updateCardList } from "~/server/queries";
import type { Card } from "~/app/types";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type List = {
  id: number;
  name: string;
  card_id: string | null;
  quantity: number;
};

export const columns: ColumnDef<{
  card: Card | null;
  userId: string | null;
  cardLists: {
    cardListId: number;
    name: string;
    is_private: boolean | null;
    is_sub_list: boolean | null;
  }[];
}>[] = [
  {
    cell: function Cell({ row }) {
      const [openDialog, setOpenDialog] = useState(false);
      const [lists, setLists] = useState<List[]>();

      const { userId, card, cardLists } = row.original;

      async function updateLists() {
        const res = await getCardQuantityByList(userId ?? "", card?.id ?? "");
        const resListIds = res.map((l) => l.id);
        // if result length doesn't match the users card lists length, fill in missing list entries with quantity set to 0
        if (res.length !== cardLists.length) {
          cardLists
            .filter((l) => l.name !== "Wish List" && !l.is_sub_list)
            .forEach((list) => {
              if (!resListIds.includes(list.cardListId)) {
                res.push({
                  id: list.cardListId,
                  name: list.name,
                  card_id: card?.id ?? "",
                  quantity: 0,
                  is_sub_list: false,
                });
              }
            });
        }
        setLists(res.sort((a, b) => a.id - b.id));
      }

      return (
        <div className="flex">
          <Button
            variant="outline"
            onClick={async () => {
              await updateLists();

              setOpenDialog(true);
            }}
          >
            +&nbsp;-
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onEscapeKeyDown={() => setOpenDialog(false)}
              onInteractOutside={() => setOpenDialog(false)}
            >
              <DialogHeader>
                <DialogTitle>Update Card list quantity</DialogTitle>
                <DialogDescription></DialogDescription>

                <div className="flex flex-col gap-4">
                  <p className="font-semibild text-lg">{`${card?.name} - ${card?.set.name} - ${card?.number}/${card?.set.printedTotal}`}</p>
                  <label htmlFor="lists">Update quantities:</label>
                  <div id="lists">
                    {card?.tcgplayer?.prices &&
                      Object.keys(card.tcgplayer.prices).map((key) => (
                        <div className="mb-6" key={key}>
                          <p>{formatType(key)}</p>
                          {lists
                            ?.filter((l) => l.name !== "Wish List")
                            .map((list) => {
                              return (
                                <div
                                  className="ml-2 flex justify-between"
                                  key={list.id}
                                >
                                  <p>{list.name}</p>
                                  <div className="flex">
                                    <div
                                      className="cursor-pointer font-bold"
                                      onClick={async () => {
                                        if (list.quantity === 0) return;
                                        const updateRes = await updateCardList(
                                          userId ?? "",
                                          list.id,
                                          card?.id ?? "",
                                          -1,
                                        );
                                        if (updateRes?.error) {
                                          // TODO: display error message
                                          return;
                                        }

                                        await updateLists();
                                      }}
                                    >
                                      <Minus />
                                    </div>
                                    <div className="bold ml-4 mr-4">
                                      {list.quantity}
                                    </div>
                                    <div
                                      className="cursor-pointer font-bold"
                                      onClick={async () => {
                                        const updateRes = await updateCardList(
                                          userId ?? "",
                                          list.id,
                                          card?.id ?? "",
                                          1,
                                        );
                                        if (updateRes?.error) {
                                          // TODO: display error message
                                          return;
                                        }

                                        await updateLists();
                                      }}
                                    >
                                      <Plus />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ))}
                  </div>
                </div>
              </DialogHeader>
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
    header: "Quantity",
  },
  {
    accessorFn: (row) => `${row?.card?.name}`,
    header: "Name",
  },
  {
    cell: function Cell({ row }) {
      return (
        <Link
          href={`/cardlist/${row?.original.card?.set.id}?page=1&pageSize=30`}
          className="text-[#106bc5]"
        >{`${row?.original.card?.set.name}`}</Link>
      );
    },
    // accessorFn: (row) => `${row?.card?.set.name}`,
    header: "Set",
  },
  {
    accessorFn: (row) => `${row?.card?.number}/${row?.card?.set?.printedTotal}`,
    header: "Number",
  },
  {
    cell: function Cell({ row }) {
      return (
        <p className="text-[#106bc5]">{`$${getPrice(row?.original?.card)}`}</p>
      );
    },
    header: "Price",
  },
];
