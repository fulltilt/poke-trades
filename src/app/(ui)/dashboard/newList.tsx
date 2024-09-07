"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createList } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { CardList } from "~/app/types";

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
      />
    </svg>
  );
}

export default function NewListComponent({
  user,
  username,
  cardLists,
}: {
  user: string;
  username: string;
  cardLists: CardList[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [listName, setListName] = useState("");
  const [listToShare, setListToShare] = useState("");

  return (
    <div className="flex gap-4">
      {/* <Button onClick={() => setOpenDialog(!openDialog)}>
        Create Trade List
      </Button> */}
      <Button onClick={() => setOpenDialog2(!openDialog2)}>
        <ShareIcon />
        &nbsp;Share Lists
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="sm:max-w-[425px]"
          onEscapeKeyDown={() => setOpenDialog(false)}
          onInteractOutside={() => setOpenDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>New Trade List</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="mt-8 flex w-full max-w-sm items-center space-x-6">
            <Input
              value={listName}
              onChange={(evt) => setListName(evt.target.value)}
              minLength={6}
            />
            <Button
              onClick={async () => {
                const res = await createList(user, listName);
                if (!res.error) {
                  toast({
                    title: "Success",
                    description: res.success,
                  });
                  setOpenDialog(false);
                  router.refresh();
                } else {
                  toast({
                    title: "Error",
                    description: res.error,
                  });
                }
              }}
            >
              Submit
            </Button>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
        <DialogContent
          onEscapeKeyDown={() => setOpenDialog2(false)}
          onInteractOutside={() => setOpenDialog2(false)}
        >
          <DialogHeader>
            <DialogTitle>Share Lists</DialogTitle>
            <DialogDescription></DialogDescription>
            <div>
              <div className="mb-8">
                A select a List below to share your Trade Lists(s) or your Wish
                List
              </div>
              <div className="flex justify-center gap-4">
                <Select
                  name="order"
                  onValueChange={(val) => setListToShare(val)}
                  defaultValue={cardLists[0]?.name}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="List Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardLists.map((list) => (
                      <SelectItem value={list.name} key={list.name}>
                        {list.name.includes("Trade") ? "Trade List" : list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={async () => {
                    await window.navigator.clipboard.writeText(
                      `${window.location.hostname}/cardlist?source=${listToShare}&member=${username}`,
                    );

                    toast({
                      variant: "success",
                      title: "Success!",
                      description: "URL copied to your clipboard!",
                    });
                  }}
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
