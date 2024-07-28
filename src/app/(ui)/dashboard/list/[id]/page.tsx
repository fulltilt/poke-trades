import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, getCardList, getUser } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function ListComponent({
  params,
}: {
  params?: { id: string };
}) {
  const user = auth();
  if (!user.userId) redirect("/");

  const currentUser = await getUser(user.userId);
  if (!currentUser?.username) redirect("/dashboard");

  const listId = params?.id ?? 0;
  const listRes = await getCardList(user.userId, Number(listId), 1, 30);
  const list = listRes?.data;
  console.log(list);
  return (
    <div className="m-20 flex flex-col">
      <p className="text-3xl font-bold">
        List Name: {list?.length && list[0]?.name}
      </p>
      <p>List size: {listRes?.totalCount}</p>
      {/* <ul className="mt-12 list-none">
        {list?.map((l) => (
          <li key={l.cardId}>
            <p>{l.data?.name}</p>
          </li>
        ))}
      </ul> */}

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={list} />
      </div>
    </div>
  );
}
