export type SSet = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimied: string;
    expanded: string;
  };
  ptcgoCode: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
};

export async function getSets(): Promise<Map<string, SSet[]>> {
  const res = await fetch("https://api.pokemontcg.io/v2/sets", {
    method: "GET",
    headers: {
      "X-Api-Key": "e5f992bc-7cb1-45ff-978c-8083c73a3fb8",
    },
  });

  let data = await res.json();

  return data.data.reduce((allSets: Map<string, SSet[]>, set: SSet) => {
    let series = set.series;
    if (!allSets.has(series)) allSets.set(series, []);
    allSets.get(series)?.push(set);
    return allSets;
  }, new Map());
}
