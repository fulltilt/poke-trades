import Link from "next/link";
import Logins from "./logins";

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
      <Logins />
    </nav>
  );
}
