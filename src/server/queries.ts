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

type SSetData = {
  data: SSet[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
};

export type Card = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp: string;
  types: string[];
  evolvesFrom: string;
  //   abilities: any[];
  //   attacks: any[];
  //   weaknesses: any[];
  retreatCost: string[];
  convertedRetreatCost: number;
  set: SSet;
  number: string;
  artist: string;
  rarity: string;
  flavorText: string;
  nationalPokedexNumbers: string[];
  legalities: {
    unlimited: string;
    standard: string;
    expanded: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer: {
    url: string;
    updatedAt: string;
    prices: {
      normal: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
    };
    reverseHolofoil: {
      low: number;
      mid: number;
      high: number;
      market: number;
      directLow: number;
    };
  };
};

type CardData = {
  data: Card[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
};

export async function getSets(): Promise<Map<string, SSet[]>> {
  const res = await fetch("https://api.pokemontcg.io/v2/sets", {
    method: "GET",
    headers: {
      "X-Api-Key": process.env.XAPIKEY!,
    },
  });

  const data = (await res.json()) as SSetData;

  return data.data.reduce((allSets: Map<string, SSet[]>, set: SSet) => {
    const series = set.series;
    if (!allSets.has(series)) allSets.set(series, []);
    allSets.get(series)?.push(set);
    return allSets;
  }, new Map());
}

export async function getCardsFromSet(query: string): Promise<CardData> {
  console.log(query);
  //   if (query.indexOf("pageSize") === -1) return;

  const res = await fetch(`https://api.pokemontcg.io/v2/cards?${query}`, {
    method: "GET",
    headers: {
      "X-Api-Key": process.env.XAPIKEY!,
    },
  });

  const data = (await res.json()) as CardData;

  return data;
}
