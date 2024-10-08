"use client";

import { SignInButton } from "./signInButton";
import { useAppContext } from "./reducers";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { useEffect, useState } from "react";
import { getNotifications } from "~/server/queries";
import { useToast } from "~/components/ui/use-toast";
import { SignOutButton } from "./signOutButton";
import type { Session } from "next-auth";

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

export default function Logins({ session }: { session: Session | null }) {
  const userId = session?.user?.id ?? "";
  const { state } = useAppContext();
  const { toast } = useToast();

  const [count, setCount] = useState<number>(state.count);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = (await getNotifications(userId))?.data?.filter(
          (n) => n.viewed === false,
        );
        setCount(res?.length ?? 0);
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
    <div className="items-center gap-4 sm:flex sm:flex-row">
      <div className="hidden sm:block">
        <Link href={"/notifications"} className="relative">
          <NotificationBell />
          {count > 0 && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              {count}
            </Badge>
          )}
        </Link>
      </div>
      <div className="sm:hidden">
        <Link href={"/notifications"}>Notifications</Link>
      </div>
      <div className="mt-4 sm:mt-0">
        {userId ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
}
