"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-black p-4 text-xl font-semibold text-white">
      <div className="flex items-center gap-8">
        <Link href="/">PokeTrades</Link>
        <Link href="/dashboard" className="text-sm">
          Dashboard
        </Link>
      </div>
      <div className="flex flex-row items-center gap-4">
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
