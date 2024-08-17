"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

import { useToast } from "~/components/ui/use-toast";
import { createNotification, updateTradeStatus } from "~/server/queries";

export function InfoCircle() {
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
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
  );
}

function getStatusText(status: number | null | undefined) {
  if (status === 2) return "In Progress";
  else if (status == 3) return "Pending";
  else if (status === 4) return "Complete";
  else if (status === 5) return "Declined";
  return "";
}

export default function TradeStatusUpdate({
  tradeId,
  tradeUserStatusField,
  userStatus,
  otherUserStatus,
  user_id,
  other_user_id,
}: {
  tradeId: number;
  tradeUserStatusField: string;
  userStatus: number | null;
  otherUserStatus: number | null | undefined;
  user_id: string;
  other_user_id: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [status, setStatus] = useState(String(userStatus));
  const [message, setMessage] = useState("");

  async function updateStatus() {
    const res = await updateTradeStatus(
      tradeId,
      tradeUserStatusField,
      Number(status),
    );
    if (res.success) {
      toast({
        title: "Success",
        description: res.success,
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: res.error,
      });
    }
  }

  return (
    <div className="flex gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <strong>In Progress</strong> - trade is open and cards
              haven&apos;t been sent
            </p>
            <p>
              <strong>Pending</strong> - cards are en route (buttons will be
              disabled)
            </p>
            <p>
              <strong>Compelete</strong> - you have confirmed that the other
              users trade has arrived (irreversible)
            </p>
            <p>
              <strong>Declined </strong> - you are not interested in proceeding
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex flex-col gap-2">
        <Select
          defaultValue={String(userStatus)}
          onValueChange={async (val) => setStatus(val)}
          value={status}
          disabled={userStatus === 4}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trade Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">In Progress</SelectItem>
            <SelectItem value="3">Pending</SelectItem>
            <SelectItem value="4">Complete</SelectItem>
            <SelectItem value="5">Decline</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm">
          Other Users Status: {getStatusText(otherUserStatus)}
        </p>
      </div>

      <Button
        onClick={async () => {
          if (status === "4") {
            setOpenDialog(true);
          } else {
            await updateStatus();
          }
        }}
        disabled={userStatus === 4}
      >
        Update Status
      </Button>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent onEscapeKeyDown={() => setOpenDialog(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          {status === "4" && (
            <p>
              This action cannot be undone. By confirming, you&apos;re
              acknowledging that you received the other users trade and you are
              fine with the conditions.
              <br />
              Note: on trade completion, Cards you traded for will still be in
              your Wish List.
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatus("3")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => updateStatus()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        onClick={async () => setOpenNotificationDialog(true)}
        disabled={userStatus === 4}
      >
        Send message
      </Button>
      <Dialog
        open={openNotificationDialog}
        onOpenChange={setOpenNotificationDialog}
      >
        <DialogContent
          onEscapeKeyDown={() => setOpenNotificationDialog(false)}
          onInteractOutside={() => setOpenNotificationDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Send Message to other User</DialogTitle>
            <DialogDescription>
              Messaging has not been implemented into the app yet so for now use
              messaging to share contact information
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Type your message here."
            value={message}
            onChange={(evt) => setMessage(evt.target.value)}
            minLength={10}
          />
          <Button
            onClick={async () => {
              console.log(user_id, other_user_id, message);
              try {
                await createNotification(user_id, other_user_id, message);

                toast({
                  title: "Success",
                  description: "Sent message to other user",
                });
                setOpenNotificationDialog(false);
                setMessage("");
                router.refresh();
              } catch {
                toast({
                  title: "Error",
                  description: "Error sending message",
                });
              }
            }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
