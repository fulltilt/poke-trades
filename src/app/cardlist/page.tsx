import { Suspense } from "react";
import PaginationComponent from "~/components/pagination";
import SearchInput from "~/components/searchInput";
import { SkeletonCard } from "~/components/skeletonCard";
import { getCardsFromSet } from "~/server/queries";
import type { Card } from "~/server/queries";

export default function CardList({
  params,
  searchParams,
}: {
  params?: { id: string };
  searchParams?: { search?: string; page?: string; pageSize?: string };
}) {
  async function Cards() {
    const currentPage = Number(searchParams?.page) ?? 1;
    const pageSize = Number(searchParams?.pageSize) ?? 30;
    const search = searchParams?.search ?? "";

    const data = await getCardsFromSet(search, "", currentPage, pageSize);

    const cards = data.cards.sort(
      (a, b) => Number(a?.number) - Number(b?.number),
    );

    return (
      <div className="m-12 flex flex-col">
        <div className="max-w-[300px]">
          <SearchInput placeholder={"Search cards..."} />
        </div>
        <div className="m-auto grid max-w-[1200px] gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cards.map((card: Card | null) => (
            <div key={card?.id}>
              <img
                src={card?.images.small}
                alt={`${card?.name}`}
                className="cursor-pointer transition-all duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <PaginationComponent totalCount={data?.totalCount ?? 0} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Suspense
        fallback={[...Array(3).keys()].map((x, i) => (
          <div key={`${x}${i}`}>
            {[...Array(6).keys()].map((x2, i2) => (
              <SkeletonCard key={`${i2}${x2}`} />
            ))}
          </div>
        ))}
      >
        <Cards />
      </Suspense>
    </div>
  );
}
