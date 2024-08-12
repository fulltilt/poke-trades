"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import {
  createTrade,
  getPublicCardLists,
  searchTrades,
} from "~/server/queries";

type List = {
  id: number;
  name: string;
  createdAt: Date;
  user_id: string;
  is_private: boolean | null;
}[];

export default function TradeRequest({
  userId,
  otherUserId,
  wishListId,
  otherUserListId,
  username,
  otherUsername,
}: {
  userId: string;
  otherUserId: string;
  wishListId: number;
  otherUserListId: number;
  username: string;
  otherUsername: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [tradeExists, setTradeExists] = useState(false);
  const [tradeLists, setTradeLists] = useState<List>();
  const [selectedList, setSelectedList] = useState<string>();

  return (
    <div>
      <Button
        onClick={() => {
          searchTrades(userId, otherUserId, wishListId, otherUserListId)
            .then((res) => setTradeExists(res.length > 0))
            .catch((err) => console.log(err))
            .finally(() => {
              getPublicCardLists(userId)
                .then((res) => {
                  console.log(res);
                  setTradeLists(res);
                  setOpenDialog(true);
                })
                .catch((err) => console.log(err));
            });
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
            ) : (tradeLists?.length ?? 0) === 0 ? (
              <p>
                Create a Trade List first. Go to{" "}
                <Link href="/dashboard" className="underline">
                  Dashboard
                </Link>
              </p>
            ) : (
              <div className="m-auto flex flex-col justify-center gap-4">
                <Select onValueChange={(val) => setSelectedList(val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Trade List" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tradeLists?.map((list) => (
                        <SelectItem key={list.id} value={String(list.id)}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  disabled={!selectedList}
                  onClick={() =>
                    createTrade(
                      userId,
                      otherUserId,
                      Number(selectedList),
                      otherUserListId,
                      username,
                      otherUsername,
                    )
                      .then(() => {
                        toast({
                          title: "Success",
                          description: `Requested trade with user ${otherUsername}`,
                        });
                        setOpenDialog(false);
                        router.refresh();
                      })
                      .catch((err) => {
                        console.log(err);
                        toast({
                          title: "Error",
                          description: "Error requesting trade",
                        });
                      })
                  }
                >
                  Request Trade
                </Button>
              </div>
            )}
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
