"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createList } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function NewListComponent({ user }: { user: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [listName, setListName] = useState("");

  return (
    <div>
      <Button onClick={() => setOpenDialog(!openDialog)}>
        Create Trade List
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild></DialogTrigger>
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
    </div>
  );
}
