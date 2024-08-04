"use client";

import { useRouter } from "next/navigation";
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
import { useToast } from "~/components/ui/use-toast";
import { updateTradeStatus } from "~/server/queries";

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

export default function TradeStatusUpdate({
  tradeId,
  tradeUserStatusField,
  userStatus,
}: {
  tradeId: number;
  tradeUserStatusField: string;
  userStatus: number | null;
}) {
  const router = useRouter();
  const { toast } = useToast();

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
              <strong>Compelete</strong> - cards have arrived and user is
              confirming
            </p>
            <p>
              <strong>Declined </strong>- at least one user is not interested in
              proceeding
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Select
        defaultValue={String(userStatus)}
        onValueChange={async (val) => {
          const res = await updateTradeStatus(
            tradeId,
            tradeUserStatusField,
            Number(val),
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
        }}
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
    </div>
  );
}
