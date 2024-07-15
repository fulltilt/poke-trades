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

export async function getSets(): Promise<Map<string, SSet[]>> {
  const res = await fetch("https://api.pokemontcg.io/v2/sets", {
    method: "GET",
    headers: {
      "X-Api-Key": process.env.XAPIKEY!,
    },
  });

  const data = await res.json();

  return data.data.reduce((allSets: Map<string, SSet[]>, set: SSet) => {
    const series = set.series;
    if (!allSets.has(series)) allSets.set(series, []);
    allSets.get(series)?.push(set);
    return allSets;
  }, new Map());
}

export async function getCardsFromSet(id: string) {
  const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${id}`, {
    method: "GET",
    headers: {
      "X-Api-Key": process.env.XAPIKEY!,
    },
  });

  const data = await res.json();

  return Object.assign({}, data);
}
