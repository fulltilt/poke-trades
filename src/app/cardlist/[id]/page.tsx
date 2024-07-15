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
  searchParams?: { query?: string; page?: string; pageSize?: string };
}) {
  async function Cards() {
    const currentPage = Number(searchParams?.page) || 1;
    const pageSize = Number(searchParams?.pageSize) || 30;
    const query =
      searchParams?.query ??
      `q=set.id:${params?.id}&page=${currentPage}&pageSize=${pageSize}`;
    const data = await getCardsFromSet(query);
    const cards = data.data;
    const totalPages = Math.ceil(data.totalCount / pageSize);

    return (
      <div className="m-12 flex flex-col justify-center">
        <div className="max-w-[300px]">
          <SearchInput placeholder={"Search cards..."} />
        </div>
        {/* <div className="text-lg">{params.name}</div> */}
        <div className="m-auto grid max-w-[1200px] gap-4 md:grid-cols-4 lg:grid-cols-6">
          <Suspense key={query + currentPage} fallback={<SkeletonCard />}>
            {cards.map((card: Card) => (
              <div key={card.id}>
                <img
                  src={card.images.small}
                  alt={`${card.name}`}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                />
              </div>
            ))}
          </Suspense>
        </div>
        <div className="mt-6">
          <PaginationComponent totalPages={totalPages} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Cards />
    </div>
  );
}
