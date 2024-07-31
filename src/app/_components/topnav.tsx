"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

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

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-black p-4 text-xl font-semibold text-white">
      <div className="flex items-center gap-8">
        <Link href="/dashboard">PokeTrades</Link>
        <Link href="/dashboard" className="text-sm">
          Dashboard
        </Link>
        <Link href="/trade" className="text-sm">
          Trades
        </Link>
        <Link href="/sets" className="text-sm">
          Sets
        </Link>
        <Link href="/cardlist" className="text-sm">
          Cards
        </Link>
      </div>
      <div className="flex flex-row items-center gap-4">
        <NotificationBell />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
