import { Suspense } from "react";
import PaginationComponent from "~/components/pagination";
import SearchInput from "~/components/searchInput";
import { SkeletonCard } from "~/components/skeletonCard";
import { getCardList, getCardsFromSet, getSet } from "~/server/queries";
import type { Card } from "~/server/queries";
import { auth } from "@clerk/nextjs/server";
import CardComponent from "./card";

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

    const cardData = await getCardsFromSet(
      search,
      params?.id ?? "",
      currentPage,
      pageSize,
    );

    const wishList = (await getCardList(user?.userId, "Wish List", 1, 30))?.map(
      (a) => a.cardId,
    );
    const collection = await getCardList(user?.userId, "Collection", 1, 30);
    const collectionCardIds = collection?.map((a) => a.cardId);

    return (
      <div className="m-auto flex max-w-[1200px] flex-col">
        <div className="m-auto grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          {cardData.cards.map((card: Card | null) => {
            const isCardInCollection = collectionCardIds?.includes(
              card?.id ?? "",
            );
            const quantity =
              collection?.filter((c) => c.cardId === card?.id)[0]?.quantity ??
              0;
            return (
              <CardComponent
                card={card}
                userId={user.userId}
                key={card?.id}
                inWishList={wishList?.includes(card?.id ?? null) ?? false}
                quantity={isCardInCollection ? quantity : 0}
              />
            );
          })}
        </div>
        <div className="mt-6">
          <PaginationComponent totalCount={cardData?.totalCount ?? 0} />
        </div>
      </div>
    );
  }

  function SuspenseSkeleton() {
    return [...Array(36).keys()].map((x, i) => (
      <SkeletonCard key={`${x}${i}`} />
    ));
  }

  const setInfo = await getSet(params?.id ?? "");

  return (
    <div className="m-auto mt-6 flex max-w-[1200px] flex-col">
      <div className="text-4xl font-bold">{setInfo?.data?.name ?? ""}</div>
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
