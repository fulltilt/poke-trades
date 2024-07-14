import { SSet, getSets } from "~/server/queries";

const SetDisplay = ({ set }: { set: SSet }) => {
  return (
    <div
      key={set.id}
      className="relative flex h-32 w-56 cursor-pointer flex-col rounded border border-[#BFC1D7]"
    >
      <div className="mt-4 flex h-[55px] justify-center">
        <img
          src={set.images.logo}
          alt={set.name}
          className="max-h-[55px] max-w-40 object-contain"
        />
      </div>
      <div className="mt-4 flex justify-center text-center">
        <span className="text-[12px]">{set.name}</span>
      </div>
      <div className="absolute bottom-1 right-1">
        <img src={set.images.symbol} alt={set.name} className="max-h-[15px]" />
      </div>
    </div>
  );
};

async function Series() {
  const sets = await getSets();

  return (
    <div className="flex flex-col">
      {Array.from(sets.keys())
        .reverse()
        .map((seriesName: string) => {
          const series = sets.get(seriesName);
          return (
            <div className="flex flex-col gap-4 p-4" key={seriesName}>
              <div className="text-lg font-bold">{seriesName}</div>

              <div className="grid max-w-[1000px] gap-4 md:grid-cols-3 lg:grid-cols-4">
                {series?.reverse().map((set: SSet) => <SetDisplay set={set} />)}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <Series />
    </main>
  );
}
