"use client";

import type { Notification } from "~/app/types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { DataTable } from "~/components/data-table";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { deleteNotification, markNotificationAsRead } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";
import { ActionTypes, useAppContext } from "~/app/_components/reducers";

export default function NotificationTable({
  notifications,
}: {
  notifications: Notification[];
}) {
  const { toast } = useToast();
  const { dispatch } = useAppContext();

  const [notificationList, setNotificationList] = useState(notifications);

  function Trash({ id }: { id: number }) {
    return (
      <div
        onClick={async () => {
          const res = await deleteNotification(id);
          if (res.data) {
            toast({
              title: "Success",
              description: res.data,
            });

            setNotificationList(notificationList.filter((n) => n.id !== id));

            dispatch({ type: ActionTypes.DECREMENT, payload: -1 });
          } else {
            toast({
              title: "Error",
              description: res.error,
            });
          }
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hover:cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Notification</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  function Read({ isRead, id }: { isRead: boolean; id: number }) {
    return (
      <div
        onClick={async () => {
          const res = await markNotificationAsRead(id);
          if (res.data) {
            toast({
              title: "Success",
              description: res.data,
            });

            setNotificationList(
              notificationList.map((n) =>
                n.id === id ? Object.assign({}, n, { viewed: true }) : n,
              ),
            );

            dispatch({ type: ActionTypes.DECREMENT, payload: -1 });
          } else {
            toast({
              title: "Error",
              description: res.error,
            });
          }
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={cn(
                  "size-6",
                  isRead ? "opacity-50" : "hover:cursor-pointer",
                )}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                />
              </svg>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Read</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "created_at",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
      header: "Date",
    },
    {
      accessorKey: "message",
      cell: ({ row }) => (
        <p className={`${row.original.viewed ? "" : "font-semibold"}`}>
          {row.original.message}
        </p>
      ),
      header: "Notification",
    },

    {
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <Trash id={row.original.id} />
            <Read isRead={row.original.viewed!} id={row.original.id} />
          </div>
        );
      },
      header: "Action",
    },
  ];

  return (
    <div className="mt-16 rounded-lg border border-gray-100 py-3 shadow-sm">
      <DataTable columns={columns} data={notificationList} pageCount={1} />
    </div>
  );
}
