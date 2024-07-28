"use client";

import { useState } from "react";
import { Card, updateCardList } from "~/server/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { SignInButton } from "@clerk/nextjs";
import { fixedTwoDecimals } from "~/app/utils/helpers";

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
export default function CardComponent({
  card,
  userId,
  inWishList,
  wishListId,
  collectionListId,
  quantity,
}: {
  card: Card | null;
  userId: string | null;
  inWishList: boolean;
  wishListId: number;
  collectionListId: number;
  quantity: number;
}) {
  const [isInWishList, setIsInWishList] = useState(inWishList);
  const [cardQuantity, setCardQuantity] = useState(quantity);
  const [openDialog, setOpenDialog] = useState(false);

  // console.log("quantity", quantity);
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
  const holo = fixedTwoDecimals(card?.tcgplayer?.prices?.holofoil?.market);
  const reverse = fixedTwoDecimals(
    card?.tcgplayer?.prices?.reverseHolofoil?.market,
  );
  const normal = fixedTwoDecimals(card?.tcgplayer?.prices?.normal?.market);

  return (
    <div key={card?.id} className="pb-8">
      <img
        src={card?.images.small}
        alt={`${card?.name}`}
        className="cursor-pointer transition-all duration-200 hover:scale-105"
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
          <Favorite fill={isInWishList ? "red" : "#b6b6b6"} />
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className="cursor-pointer font-bold"
          onClick={async () => {
            if (!userId) {
              setOpenDialog(true);
              return;
            }
            if (cardQuantity === 0) return;
            const updateRes = await updateCardList(
              userId ?? "",
              collectionListId,
              card?.id ?? "",
              -1,
            );
            if (updateRes?.error) {
              // TODO: display error message
              return;
            }

            setCardQuantity(cardQuantity - 1);
          }}
        >
          <Minus />
        </div>
        <div className="bold ml-4 mr-4">{cardQuantity}</div>
        <div
          className="cursor-pointer font-bold"
          onClick={async () => {
            if (!userId) {
              setOpenDialog(true);
              return;
            }

            const updateRes = await updateCardList(
              userId ?? "",
              collectionListId,
              card?.id ?? "",
              1,
            );
            if (updateRes?.error) {
              // TODO: display error message
              return;
            }
            setCardQuantity(cardQuantity + 1);
          }}
        >
          <Plus />
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
            <DialogTitle>Please log in</DialogTitle>
            <DialogDescription>
              Please{" "}
              <SignInButton>
                <span className="cursor-pointer underline focus:outline-none">
                  Sign In
                </span>
              </SignInButton>{" "}
              or create an account to access functionality
            </DialogDescription>
          </DialogHeader>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
