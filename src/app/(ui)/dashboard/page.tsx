import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  getCardList,
  getCardsInCardList,
  getCompletedTrades,
  getUser,
  getUsersCardLists,
} from "~/server/queries";
import Link from "next/link";
import NewTradeComponent from "./newList";
import { auth } from "~/app/api/auth/authConfig";
import CardListDisplayComponent from "./cardListDisplay";
import { sortByDateAndThenNumber } from "~/app/utils/helpers";
import { DataTable } from "~/components/data-table";
import { columns } from "./list/columns";

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { name: string; page: string; pageSize: string };
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session?.user?.id ?? "";
  const loggedInUser = await getUser(userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const name = searchParams?.name ?? "";
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const offSet = searchParams?.pageSize ? parseInt(searchParams.pageSize) : 30;

  const completedTrades = await getCompletedTrades(userId);
  const cardLists = await getUsersCardLists(userId);
  const publicLists = cardLists.filter((l) => !l.is_private && !l.is_sub_list);
  // const privateLists = cardLists.filter((l) => l.is_private && !l.is_sub_list);
  const wishListId = publicLists.filter((list) =>
    list.name.includes("Wish List"),
  )[0]?.cardListId;
  const tradeListId = publicLists.filter(
    (list) => !list.name.includes("Wish List"),
  )[0]?.cardListId;

  const tradeListCards = await getCardList(
    userId,
    tradeListId ?? 0,
    page,
    offSet,
  );
  const wishListCards = await getCardList(userId, wishListId ?? 0, 1, 30);

  const count = tradeListCards?.totalCount ?? 0;
  const pageCount = Math.ceil(count / Number(offSet));

  // sort List by dates descending then Card numbers ascending
  tradeListCards?.data.sort((a, b) =>
    sortByDateAndThenNumber(a.data!, b.data!),
  );
  const list = tradeListCards?.data ?? [];

  return (
    <div className="flex max-h-full flex-1 flex-col rounded-md pl-14 pr-14">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1.5 text-sm text-gray-500"></p>
          </div>

          <div className="flex items-center gap-4">
            <CardListDisplayComponent cards={wishListCards!} />
            <NewTradeComponent
              user={userId}
              username={loggedInUser?.username ?? ""}
              cardLists={publicLists}
            />
          </div>
        </div>
      </div>

      <main className="mb-12 max-w-screen-xl flex-1 px-4 py-8 pt-2 sm:px-6 sm:py-12 lg:px-8">
        <p className="text-lg font-semibold">
          Completed Trades: {completedTrades.data}
        </p>
        {/* <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="block rounded-lg p-4 shadow-md shadow-indigo-100"> */}
        <div>
          <div>
            <div className="mb-8 mt-8">
              <h2 className="mb-8 text-center text-xl font-bold">Trade List</h2>
              <DataTable columns={columns} data={list} pageCount={pageCount} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
