import { Suspense } from "react";
import PaginationComponent from "~/components/pagination";
import SearchInput from "~/components/searchInput";
import { SkeletonCard } from "~/components/skeletonCard";
import { getCardsFromSet, getSet } from "~/server/queries";
import type { Card } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";

function Favorite({ fill }: { fill: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      // stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

export default async function CardList({
  params,
  searchParams,
}: {
  params?: { id: string };
  searchParams?: { search?: string; page?: string; pageSize?: string };
}) {
  async function Cards() {
    const user = auth();

    const currentPage = Number(searchParams?.page) ?? 1;
    const pageSize = Number(searchParams?.pageSize) ?? 30;
    const search = searchParams?.search ?? "";

    const data = await getCardsFromSet(
      search,
      params?.id ?? "",
      currentPage,
      pageSize,
    );
    // await seedData();

    const cards = data.cards.sort(
      (a, b) => Number(a?.number) - Number(b?.number),
    );

    return (
      <div className="m-auto flex max-w-[1200px] flex-col">
        <div className="m-auto grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cards.map((card: Card | null) => {
            const holo = card?.tcgplayer?.prices?.holofoil?.market
              ? (
                  Math.round(card.tcgplayer.prices.holofoil.market * 100) / 100
                ).toFixed(2)
              : undefined;
            const reverse = card?.tcgplayer?.prices?.normal?.market
              ? (
                  Math.round(card.tcgplayer.prices.normal.market * 100) / 100
                ).toFixed(2)
              : undefined;
            const normal = card?.tcgplayer?.prices?.reverseHolofoil?.market
              ? (
                  Math.round(
                    card.tcgplayer.prices.reverseHolofoil.market * 100,
                  ) / 100
                ).toFixed(2)
              : undefined;

            return (
              <div key={card?.id} className="pb-8">
                <img
                  src={card?.images.small}
                  alt={`${card?.name}`}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                />
                <div className="flex justify-between p-2">
                  <div>
                    {card?.number}/{setInfo?.data?.total}
                  </div>
                  <div>${holo ?? reverse ?? normal ?? "-"}</div>
                  <div>
                    <Favorite fill={"#b6b6b6"} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <PaginationComponent totalCount={data?.totalCount ?? 0} />
        </div>
      </div>
    );
  }

  function SuspenseSkeleton() {
    return [...Array(36).keys()].map((x, i) => (
      <SkeletonCard key={`${x}${i}`} />
    ));
  }

  const setInfo = await getSet(params?.id || "");

  return (
    <div className="m-auto mt-6 flex max-w-[1200px] flex-col">
      <div className="text-4xl font-bold">{setInfo?.data?.name || ""}</div>
      <div className="mb-4 mt-6 max-w-[300px]">
        <SearchInput placeholder={"Search cards..."} />
      </div>
      <Suspense
        fallback={
          <div className="m-auto grid max-w-[1200px] gap-4 md:grid-cols-4 lg:grid-cols-6">
            <SuspenseSkeleton />
          </div>
        }
      >
        <Cards />
      </Suspense>
    </div>
  );
}
