import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { redirect } from "next/navigation";
import { auth } from "./api/auth/authConfig";
import { SignInButton } from "./_components/signInButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  if (!userId) {
    return (
      <div className="bg-slate-900">
        <section className="body-font text-gray-600">
          <div className="mx-auto max-w-5xl pb-24 pt-52">
            <h1 className="text-80 font-4 lh-6 ld-04 mb-6 text-center text-6xl font-bold text-white">
              We make the Pokemon trade process a lot easier
            </h1>
            <h2 className="font-4 lh-6 ld-04 pb-11 text-center text-2xl font-semibold text-white">
              PokeTrades lets users trade Pokemon cards that makes the trading
              process smoother and trackable
            </h2>
            <div className="ml-6 flex justify-center gap-8">
              <SignInButton className="bg-white text-black hover:bg-white" />
              <Link
                href="/cardlist"
                className={buttonVariants({ variant: "outline" })}
              >
                Search Cards
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  redirect("/dashboard");
}
