import { redirect } from "next/navigation";
import { getCardList, getUser } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "../../../../../components/data-table";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { sortByDateAndThenNumber } from "~/app/utils/helpers";
import { auth } from "~/app/api/auth/authConfig";

export default async function ListComponent({
  params,
  searchParams,
}: {
  params?: { id: string };
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
  const page = searchParams?.page ?? "1";
  const offset = searchParams?.pageSize ?? "30";

  const listId = params?.id ?? 0;
  const listRes = await getCardList(
    userId,
    Number(listId),
    Number(page),
    Number(offset),
  );

  const count = listRes?.totalCount ?? 0;
  const pageCount = Math.ceil(count / Number(offset));

  // sort List by dates descending then Card numbers ascending
  listRes?.data?.sort((a, b) => sortByDateAndThenNumber(a.data!, b.data!));
  const list = listRes?.data ?? [];

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
        <DataTable columns={columns} data={list} pageCount={pageCount} />
      </div>
    </div>
  );
}
