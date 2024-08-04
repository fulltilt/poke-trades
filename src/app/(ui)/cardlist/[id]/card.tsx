"use client";

import { useState } from "react";
import { getCardQuantityByList, updateCardList } from "~/server/queries";
import type { Card } from "~/app/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { getPrice } from "~/app/utils/helpers";

export function Favorite({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      className="size-6 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

export function Plus() {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

export function Minus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

type List = {
  id: number;
  name: string;
  card_id: string | null;
  quantity: number;
};

export default function CardComponent({
  card,
  userId,
  inWishList,
  cardLists,
}: {
  card: Card | null;
  userId: string | null;
  inWishList: boolean;
  cardLists: {
    cardListId: number;
    name: string;
    is_private: boolean | null;
    is_sub_list: boolean | null;
  }[];
}) {
  const [isInWishList, setIsInWishList] = useState(inWishList);
  const [openDialog, setOpenDialog] = useState(false);
  const [lists, setLists] = useState<List[]>();

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

  const wishListId =
    cardLists.filter((l) => l.name === "Wish List")[0]?.cardListId ?? 0;
  return (
    <div key={card?.id} className="pb-8">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="relative">
              <img
                src={card?.images.small}
                alt={`${card?.name}`}
                className="cursor-pointer opacity-50 transition-all duration-200 hover:opacity-100"
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
      <div className="flex items-center justify-between p-2">
        <div className="text-[#106bc5]">${getPrice(card!)}</div>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={async () => {
              if (!userId) {
                setOpenDialog(true);
                return;
              }
              await updateLists();

              setOpenDialog(true);
            }}
          >
            +&nbsp;-
          </Button>
        </div>
        <div
          onClick={async () => {
            const updateRes = await updateCardList(
              userId ?? "",
              wishListId,
              card?.id ?? "",
              isInWishList ? -1 : 1,
            );
            if (updateRes?.error) {
              setOpenDialog(true);
              return;
            }

            setIsInWishList(!isInWishList);
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Favorite fill={isInWishList ? "red" : "#b6b6b6"} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add/Remove from your Wish List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onEscapeKeyDown={() => setOpenDialog(false)}
          onInteractOutside={() => setOpenDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>
              {!userId ? "Please log in" : "Update Card list quantity"}
            </DialogTitle>
            <DialogDescription></DialogDescription>
            {!userId ? (
              <p>
                Please{" "}
                <SignInButton>
                  <span className="cursor-pointer underline focus:outline-none">
                    Sign In
                  </span>
                </SignInButton>{" "}
                or create an account to access functionality
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="font-semibild text-lg">{`${card?.name} - ${card?.set.name} - ${card?.number}/${card?.set.printedTotal}`}</p>
                <label htmlFor="lists">Update quantities:</label>
                <div id="lists">
                  {lists
                    ?.filter((l) => l.name !== "Wish List")
                    .map((list) => {
                      return (
                        <div className="flex justify-between" key={list.id}>
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
              </div>
            )}
          </DialogHeader>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
