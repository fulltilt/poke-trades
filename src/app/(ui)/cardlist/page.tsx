import { Suspense } from "react";
import PaginationComponent from "~/components/pagination";
import SearchInput from "~/components/searchInput";
import { SkeletonCard } from "~/components/skeletonCard";

import {
  getAllCards,
  getCardList,
  getCardsInCardList,
  getSet,
  getUserId,
  // getUser,
  getUsersCardLists,
} from "~/server/queries";
import type { Card, SearchParams } from "~/app/types";
import { auth } from "@clerk/nextjs/server";
import CardComponent from "./[id]/card";
// import { redirect } from "next/navigation";
import CardListOptions from "./cardListOptions";
import { DataTable } from "~/components/data-table";
import { columns } from "./columns";

export default async function CardList({
  params,
  searchParams,
}: {
  params?: { id: string };
  searchParams?: SearchParams;
}) {
  async function Cards() {
    const user = auth();
    // const loggedInUser = await getUser(user.userId ?? "");
    // if (!loggedInUser?.username) {
    //   redirect("/username");
    // }

    const currentPage = Number(searchParams?.page) ?? 1;
    const pageSize = Number(searchParams?.pageSize) ?? 30;
    const displayAs = searchParams?.displayAs ?? "images";
    const orderBy = searchParams?.orderBy ?? "number";
    const source = searchParams?.source ?? "all";
    const search = searchParams?.search ?? "";
    const member = searchParams?.member ?? "";

    let userId = user.userId;

    // special logic to view a users collection without being logged in
    if (member) {
      userId = (await getUserId(member))?.id ?? "";
    }

    const cardLists = await getUsersCardLists(userId ?? "");
    const collectionId =
      cardLists.filter((l) => l.name === "Collection")[0]?.cardListId ?? 0;
    const wishListId =
      cardLists.filter((l) => l.name === "Wish List")[0]?.cardListId ?? 0;

    const cardData =
      source === "all"
        ? await getAllCards(currentPage, pageSize, search, orderBy)
        : await getCardsInCardList(
            source === "collection" ? collectionId : wishListId,
            currentPage,
            pageSize,
            search,
          );
    const pageCount = Math.ceil(cardData?.totalCount / Number(pageSize));

    const wishList = (
      await getCardList(user?.userId, wishListId, 1, 30)
    )?.data.map((a) => a.cardId);

    return (
      <div className="m-4 flex max-w-[1200px] flex-col items-center sm:items-start">
        <p className="font-semibold">
          {cardData.totalCount} card{cardData.totalCount === 1 ? "" : "s"} found
        </p>
        <CardListOptions />
        {displayAs === "images" ? (
          <div>
            <div className="grid w-full auto-cols-auto grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {cardData.cards.map((card: Card | null) => {
                return (
                  <CardComponent
                    card={card}
                    userId={user.userId}
                    key={card?.id}
                    inWishList={wishList?.includes(card?.id ?? null) ?? false}
                    cardLists={cardLists}
                  />
                );
              })}
            </div>
            <div className="mt-6">
              <PaginationComponent totalCount={cardData?.totalCount ?? 0} />
            </div>
          </div>
        ) : (
          <div className="py-10 lg:min-w-[1200px]">
            <DataTable
              columns={columns}
              data={cardData.cards.map((d) => ({
                card: d,
                userId: user.userId,
                cardLists,
              }))}
              pageCount={pageCount}
            />
          </div>
        )}
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
    <div className="m-auto mt-6 flex max-w-[1200px] flex-col items-center sm:items-start">
      <div className="text-4xl font-bold">{setInfo?.data?.name ?? ""}</div>
      <div className="mb-4 mt-6">
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
