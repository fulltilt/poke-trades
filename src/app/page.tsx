import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button, buttonVariants } from "~/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const user = auth();

  if (!user.userId) {
    return (
      <div className="bg-slate-900">
        <section className="body-font text-gray-600">
          <div className="mx-auto max-w-5xl pb-24 pt-52">
            <h1 className="text-80 font-4 lh-6 ld-04 mb-6 text-center text-6xl font-bold text-white">
              We make the Pokemon trade process a lot easier
            </h1>
            <h2 className="font-4 lh-6 ld-04 pb-11 text-center text-2xl font-semibold text-white">
              PokeTrades is a collection tracker that can be used to make the
              trading process smooth and trackable
            </h2>
            <div className="ml-6 flex justify-center gap-8">
              <SignInButton>
                <Button variant="outline" className="w-28">
                  Sign In
                </Button>
              </SignInButton>
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
