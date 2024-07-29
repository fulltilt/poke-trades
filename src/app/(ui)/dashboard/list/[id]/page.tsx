import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCardList, getUser } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ListComponent({
  params,
  searchParams,
}: {
  params?: { id: string };
  searchParams?: { name: string };
}) {
  const user = auth();
  if (!user.userId) redirect("/");

  const currentUser = await getUser(user.userId);
  if (!currentUser?.username) redirect("/dashboard");

  const name = searchParams?.name ?? "";

  const listId = params?.id ?? 0;
  const listRes = await getCardList(user.userId, Number(listId), 1, 30);
  const list = listRes?.data;

  return (
    <div className="m-20 flex flex-col">
      <p className="text-3xl font-bold">List Name: {name}</p>
      <p>List size: {listRes?.totalCount}</p>
      {/* <ul className="mt-12 list-none">
        {list?.map((l) => (
          <li key={l.cardId}>
            <p>{l.data?.name}</p>
          </li>
        ))}
      </ul> */}

      <div className="container mx-auto py-10">
        {/* @ts-expect-error DataTable TypeScript errors */}
        <DataTable columns={columns} data={list} />
      </div>
    </div>
  );
}
