import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getSets } from "~/server/queries";
import type { SSet } from "~/server/queries";
import { Button, buttonVariants } from "~/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

const SetDisplay = ({ set }: { set: SSet | null }) => {
  return (
    <div className="relative flex h-32 w-56 cursor-pointer flex-col rounded border border-[#BFC1D7]">
      <Link href={`cardlist/${set?.id}?page=1&pageSize=30`}>
        <div className="mt-4 flex h-[55px] justify-center">
          <img
            src={set?.images.logo}
            alt={set?.name}
            className="max-h-[55px] max-w-40 object-contain"
          />
        </div>
        <div className="mt-4 flex justify-center text-center">
          <span className="text-[12px]">{set?.name}</span>
        </div>
        <div className="absolute bottom-1 right-1">
          <img
            src={set?.images.symbol}
            alt={set?.name}
            className="max-h-[15px]"
          />
        </div>
      </Link>
    </div>
  );
};

async function Series() {
  const sets = await getSets();

  return (
    <div className="ml-12 flex flex-col">
      {Array.from(sets.keys())
        .reverse()
        .map((seriesName: string) => {
          const series = sets.get(seriesName);
          return (
            <div className="mt-8 flex flex-col gap-4 p-4" key={seriesName}>
              <div className="text-lg font-bold">{seriesName}</div>
              <div className="grid max-w-[1000px] gap-4 md:grid-cols-3 lg:grid-cols-4">
                {series?.reverse().map((set: SSet | null) => (
                  <div key={set?.id}>
                    <SetDisplay set={set} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

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
              <Button variant="outline" className="w-28">
                <SignInButton />
              </Button>
              <Link
                href="/cardlist"
                className={buttonVariants({ variant: "outline" })}
              >
                Search Cards
              </Link>
            </div>
          </div>

          {/* <h2 className="mb-1 pt-40 text-center text-2xl font-semibold tracking-tighter text-gray-200 md:text-6xl lg:text-7xl">
            Clean and tidy code.
          </h2>
          <br></br>
          <p className="fs521 mx-auto text-center text-xl font-normal leading-relaxed text-gray-300 lg:w-2/3">
            Here is our collection of free to use templates made with Next.js &
            styled with Tailwind CSS.
          </p>
          <div className="fsac4 mx-auto max-w-4xl px-3 pb-24 pt-12 md:px-1">
            <div className="ktq4">
              <h3 className="pt-3 text-lg font-semibold text-white">
                Lorem ipsum dolor sit amet
              </h3>
              <p className="value-text text-md fkrr1 pt-2 text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas tincidunt a libero in finibus. Maecenas a nisl vitae
                ante rutrum porttitor.
              </p>
            </div>
            <div className="ktq4">
              <h3 className="pt-3 text-lg font-semibold text-white">
                Lorem ipsum dolor sit amet
              </h3>
              <p className="value-text text-md fkrr1 pt-2 text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas tincidunt a libero in finibus. Maecenas a nisl vitae
                ante rutrum porttitor.
              </p>
            </div>
            <div className="ktq4">
              <h3 className="pt-3 text-lg font-semibold text-white">
                Lorem ipsum dolor sit amet
              </h3>
              <p className="value-text text-md fkrr1 pt-2 text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas tincidunt a libero in finibus. Maecenas a nisl vitae
                ante rutrum porttitor.
              </p>
            </div>
            <div className="ktq4">
              <h3 className="pt-3 text-lg font-semibold text-white">
                Lorem ipsum dolor sit amet
              </h3>
              <p className="value-text text-md fkrr1 pt-2 text-gray-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas tincidunt a libero in finibus. Maecenas a nisl vitae
                ante rutrum porttitor.
              </p>
            </div>
          </div>
          <div className="fsac4 mx-auto max-w-6xl px-3 pb-32 pt-32 md:px-1">
            <div className="ktq4">
              <h3 className="pt-3 text-lg font-semibold text-white">
                Lorem ipsum dolor sit amet
              </h3>
              <p className="value-text text-md fkrr1 pt-2 text-gray-200">
                Fusce pharetra ligula mauris, quis faucibus lectus elementum
                vel. Nullam vehicula, libero at euismod tristique, neque ligula
                faucibus urna, quis ultricies massa enim in nunc. Vivamus
                ultricies, quam ut rutrum blandit, turpis massa ornare velit, in
                sodales tellus ex nec odio.
              </p>
            </div>
            <div className="ktq4">
              <h3 className="pt-3 text-lg font-semibold text-white">
                Lorem ipsum dolor sit amet
              </h3>
              <p className="value-text text-md fkrr1 pt-2 text-gray-200">
                Fusce pharetra ligula mauris, quis faucibus lectus elementum
                vel. Nullam vehicula, libero at euismod tristique, neque ligula
                faucibus urna, quis ultricies massa enim in nunc. Vivamus
                ultricies, quam ut rutrum blandit, turpis massa ornare velit, in
                sodales tellus ex nec odio.
              </p>
            </div>
          </div> */}
        </section>
      </div>
    );
  }

  return (
    <main>
      <Series />
    </main>
  );
}
