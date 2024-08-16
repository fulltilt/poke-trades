import { redirect } from "next/navigation";
import {
  getCompletedTrades,
  getUser,
  getUsersCardLists,
} from "~/server/queries";
import Link from "next/link";
import NewTradeComponent from "./newList";
import { auth } from "~/app/api/auth/authConfig";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session?.user?.id ?? "";
  const loggedInUser = await getUser(userId);
  if (!loggedInUser?.username) {
    redirect("/username");
  }

  const completedTrades = await getCompletedTrades(userId);
  const cardLists = await getUsersCardLists(userId);
  const publicLists = cardLists.filter((l) => !l.is_private && !l.is_sub_list);
  // const privateLists = cardLists.filter((l) => l.is_private && !l.is_sub_list);

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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="block rounded-lg p-4 shadow-md shadow-indigo-100">
            <p className="font-bold">Public Lists</p>
            <ul className="list-none">
              {publicLists.map((l) => (
                <li key={l.cardListId}>
                  <Link
                    className="text-[#106bc5]"
                    href={`/dashboard/list/${l.cardListId}?name=${l.name}`}
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="block rounded-lg p-4 shadow-md shadow-indigo-100">
            <p className="font-bold">Private Lists</p>
            <ul className="list-none">
              {privateLists.map((l) => (
                <li key={l.cardListId}>
                  <Link
                    className="text-[#106bc5]"
                    href={`/dashboard/list/${l.cardListId}?name=${l.name}`}
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
          {/* <div className="block rounded-lg p-4 shadow-md shadow-indigo-100">
            <p className="font-bold">Pending Trades</p>
          </div>
          <div className="block rounded-lg p-4 shadow-md shadow-indigo-100">
            <p className="font-bold">Completed Trades</p>
          </div> */}
        </div>
      </main>
    </div>
  );
}
