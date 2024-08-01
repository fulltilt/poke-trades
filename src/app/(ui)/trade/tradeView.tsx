"use client";

import { useState } from "react";
import { useCounter } from "~/app/_components/reducers";
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
import { createTrade, searchTrades } from "~/server/queries";

export default function TradeViewComponent({
  userId,
  otherUserId,
  wishListId,
  otherUserListId,
}: {
  userId: string;
  otherUserId: string;
  wishListId: number;
  otherUserListId: number;
}) {
  //   const { dispatch } = useCounter();

  const [openDialog, setOpenDialog] = useState(false);
  const [tradeExists, setTradeExists] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          searchTrades(userId, otherUserId, wishListId, otherUserListId)
            .then((res) => {
              console.log(res);
              setTradeExists(res.length > 0);
            })
            .catch((err) => console.log(err))
            .finally(() => setOpenDialog(true));
        }}
      >
        View
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onEscapeKeyDown={() => setOpenDialog(false)}
          onInteractOutside={() => setOpenDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Initiate Trade?</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-center">
            {tradeExists ? (
              <p>Trade already exists</p>
            ) : (
              <div>
                <Button
                  onClick={() =>
                    createTrade(
                      userId,
                      otherUserId,
                      wishListId,
                      otherUserListId,
                    )
                      .then((res) => {
                        console.log(res);
                        setOpenDialog(false);
                      })
                      .catch((err) => console.log(err))
                  }
                >
                  Request Trade
                </Button>
                {/* <Button
                  onClick={() =>
                    dispatch((prev) => {
                      console.log(prev);
                      return prev;
                    })
                  }
                >
                  Here
                </Button> */}
              </div>
            )}
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
