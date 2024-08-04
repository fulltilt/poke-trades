import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCardList, getUser } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "../../../../../components/data-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { sortByDateAndThenNumber } from "~/app/utils/helpers";

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

  // sort List by dates descending then Card numbers ascending
  listRes?.data?.sort((a, b) => sortByDateAndThenNumber(a.data!, b.data!));
  const list = listRes?.data;

  return (
    <div className="m-20 flex flex-col">
      <div className="flex gap-4">
        <p className="text-3xl font-bold">List Name: {name}</p>
        <Button>
          <Link href="/sets">Add to List</Link>
        </Button>
      </div>
      <p>List size: {listRes?.totalCount}</p>

      <div className="container mx-auto py-10">
        {/* @ts-expect-error DataTable TypeScript errors */}
        <DataTable columns={columns} data={list} />
      </div>
    </div>
  );
}
