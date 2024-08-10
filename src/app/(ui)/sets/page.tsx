import { getSets } from "~/server/queries";
import Link from "next/link";
import type { SSet } from "~/app/types";

const SetDisplay = ({ set }: { set: SSet | null }) => {
  return (
    <div className="relative flex h-32 w-56 cursor-pointer flex-col rounded border border-[#BFC1D7]">
      <Link href={`cardlist/${set?.id}?page=1&pageSize=30&orderBy=number`}>
        <div className="mt-4 flex h-[55px] justify-center">
          <img
            src={set?.images.logo}
            alt={set?.name}
            className="max-h-[55px] max-w-40 object-contain"
          />
        </div>
        <div className="mt-4 flex justify-center text-center">
          <span className="text-[12px]">{set?.name}</span>
        </div>
        <div className="absolute bottom-1 right-1">
          <img
            src={set?.images.symbol}
            alt={set?.name}
            className="max-h-[15px]"
          />
        </div>
      </Link>
    </div>
  );
};

export default async function Series() {
  // const session = await auth();
  // if (!session) redirect("/auth/signin");

  // const userId = session?.user?.id ?? "";
  // const loggedInUser = await getUser(userId);
  // if (!loggedInUser?.username) {
  //   redirect("/username");
  // }

  const sets = await getSets();

  return (
    <div className="flex flex-col">
      {Array.from(sets.keys())
        .reverse()
        .map((seriesName: string) => {
          const series = sets.get(seriesName);
          return (
            <div
              className="mt-12 flex flex-col items-center gap-4"
              key={seriesName}
            >
              <div className="text-lg font-bold">{seriesName}</div>
              <div className="grid max-w-[1000px] gap-4 md:grid-cols-3 lg:grid-cols-4">
                {series?.reverse().map((set: SSet | null) => (
                  <div key={set?.id}>
                    <SetDisplay set={set} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
