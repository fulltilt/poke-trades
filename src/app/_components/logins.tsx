"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useAppContext } from "./reducers";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getNotifications } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";

function NotificationBell() {
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
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

export default function Logins() {
  const { userId } = useAuth();
  const { state } = useAppContext();
  const { toast } = useToast();

  const [count, setCount] = useState<number>(state.count);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await getNotifications(userId!);
        setCount(res.notifications!.length);
      } catch {
        toast({
          title: "Error",
          description: "Error retrieving notifications",
        });
      }
    }

    fetchNotifications()
      .then((res) => res)
      .catch((err) => console.log(err));
  }, [userId, toast]);

  useEffect(() => setCount(state.count), [state]);

  return (
    <div className="flex flex-row items-center gap-4">
      <Link href={"/notifications"} className="relative">
        <NotificationBell />
        {count > 0 && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            {count}
          </Badge>
        )}
      </Link>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
