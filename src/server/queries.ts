import { sql, count, like } from "drizzle-orm";
import { db } from "./db";
import { sets, cards } from "./db/schema";

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
  cards: Card[];
  // page: number;
  // pageSize: number;
  // count: number;
  totalCount: number;
};

export async function getSets() {
  const res: { id: string; data: SSet | null }[] = await db.query.sets.findMany(
    {},
  );

  return res.reduce(
    (
      allSets: Map<string, (SSet | null)[]>,
      set: { id: string; data: SSet | null },
    ) => {
      const series = set?.data?.series || "";
      if (!allSets.has(series)) allSets.set(series, []);
      allSets.get(series)?.push(set?.data);
      return allSets;
    },
    new Map(),
  );
}

export async function getCardsFromSet(
  id: string,
  page: number,
  pageSize: number,
) {
  const ct: { count: number }[] = await db
    .select({ count: count() })
    .from(cards)
    .where(like(cards.id, `${id}-%`));

  const prepared = db.query.cards
    .findMany({
      limit: sql.placeholder("limit"),
      offset: sql.placeholder("offset"),
      // orderBy: (model, { asc }) => asc(model.data->),
      // orderBy: ["posts.metadata.score", 'DESC'],
      where: (model, { like }) => like(model.id, sql.placeholder("searchterm")),
    })
    .prepare("query_name");

  const data = await prepared.execute({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    searchterm: `${id}-%`,
  });

  return Object.assign(
    {},
    { cards: data.map((r) => r.data) },
    { totalCount: ct[0]?.count },
  );
}

export async function searchCards(
  term: string,
  id: string,
  page: number,
  pageSize: number,
) {
  const ct: { count: number }[] = await db
    .select({ count: count() })
    .from(cards)
    .where(like(cards.id, `${id}-%`));

  const prepared = db.query.cards
    .findMany({
      limit: sql.placeholder("limit"),
      offset: sql.placeholder("offset"),
      // orderBy: (model, { asc }) => asc(model.data->),
      // orderBy: ["posts.metadata.score", 'DESC'],
      where: (model, { like }) => like(model.id, sql.placeholder("searchterm")),
    })
    .prepare("query_name");

  const data = await prepared.execute({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    searchterm: `${id}-%`,
  });

  return Object.assign(
    {},
    { cards: data.map((r) => r.data) },
    { totalCount: ct[0]?.count },
  );
}

// export async function getSets(): Promise<Map<string, SSet[]>> {
//   const res = await fetch("https://api.pokemontcg.io/v2/sets", {
//     method: "GET",
//     headers: {
//       "X-Api-Key": process.env.XAPIKEY!,
//     },
//   });

//   const data = (await res.json()) as SSetData;

//   return data.data.reduce((allSets: Map<string, SSet[]>, set: SSet) => {
//     const series = set.series;
//     if (!allSets.has(series)) allSets.set(series, []);
//     allSets.get(series)?.push(set);
//     return allSets;
//   }, new Map());
// }

// export async function getCardsFromSet(query: string): Promise<CardData> {
//   console.log(query);
//   //   if (query.indexOf("pageSize") === -1) return;

//   const res = await fetch(`https://api.pokemontcg.io/v2/cards?${query}`, {
//     method: "GET",
//     headers: {
//       "X-Api-Key": process.env.XAPIKEY!,
//     },
//   });

//   const data = (await res.json()) as CardData;

//   return data;
// }

export async function seedData() {
  const dat = [
    {
      id: "base1",
      name: "Base",
      series: "Base",
      printedTotal: 102,
      total: 102,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "BS",
      releaseDate: "1999/01/09",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/base1/symbol.png",
        logo: "https://images.pokemontcg.io/base1/logo.png",
      },
    },
    {
      id: "base2",
      name: "Jungle",
      series: "Base",
      printedTotal: 64,
      total: 64,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "JU",
      releaseDate: "1999/06/16",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/base2/symbol.png",
        logo: "https://images.pokemontcg.io/base2/logo.png",
      },
    },
    {
      id: "basep",
      name: "Wizards Black Star Promos",
      series: "Base",
      printedTotal: 53,
      total: 53,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "PR",
      releaseDate: "1999/07/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/basep/symbol.png",
        logo: "https://images.pokemontcg.io/basep/logo.png",
      },
    },
    {
      id: "base3",
      name: "Fossil",
      series: "Base",
      printedTotal: 62,
      total: 62,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "FO",
      releaseDate: "1999/10/10",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/base3/symbol.png",
        logo: "https://images.pokemontcg.io/base3/logo.png",
      },
    },
    {
      id: "base4",
      name: "Base Set 2",
      series: "Base",
      printedTotal: 130,
      total: 130,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "B2",
      releaseDate: "2000/02/24",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/base4/symbol.png",
        logo: "https://images.pokemontcg.io/base4/logo.png",
      },
    },
    {
      id: "base5",
      name: "Team Rocket",
      series: "Base",
      printedTotal: 82,
      total: 83,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "TR",
      releaseDate: "2000/04/24",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/base5/symbol.png",
        logo: "https://images.pokemontcg.io/base5/logo.png",
      },
    },
    {
      id: "gym1",
      name: "Gym Heroes",
      series: "Gym",
      printedTotal: 132,
      total: 132,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "G1",
      releaseDate: "2000/08/14",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/gym1/symbol.png",
        logo: "https://images.pokemontcg.io/gym1/logo.png",
      },
    },
    {
      id: "gym2",
      name: "Gym Challenge",
      series: "Gym",
      printedTotal: 132,
      total: 132,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "G2",
      releaseDate: "2000/10/16",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/gym2/symbol.png",
        logo: "https://images.pokemontcg.io/gym2/logo.png",
      },
    },
    {
      id: "neo1",
      name: "Neo Genesis",
      series: "Neo",
      printedTotal: 111,
      total: 111,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "N1",
      releaseDate: "2000/12/16",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/neo1/symbol.png",
        logo: "https://images.pokemontcg.io/neo1/logo.png",
      },
    },
    {
      id: "neo2",
      name: "Neo Discovery",
      series: "Neo",
      printedTotal: 75,
      total: 75,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "N2",
      releaseDate: "2001/06/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/neo2/symbol.png",
        logo: "https://images.pokemontcg.io/neo2/logo.png",
      },
    },
    {
      id: "si1",
      name: "Southern Islands",
      series: "Other",
      printedTotal: 18,
      total: 18,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2001/07/31",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/si1/symbol.png",
        logo: "https://images.pokemontcg.io/si1/logo.png",
      },
    },
    {
      id: "neo3",
      name: "Neo Revelation",
      series: "Neo",
      printedTotal: 64,
      total: 66,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "N3",
      releaseDate: "2001/09/21",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/neo3/symbol.png",
        logo: "https://images.pokemontcg.io/neo3/logo.png",
      },
    },
    {
      id: "neo4",
      name: "Neo Destiny",
      series: "Neo",
      printedTotal: 105,
      total: 113,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "N4",
      releaseDate: "2002/02/28",
      updatedAt: "2020/09/25 10:09:00",
      images: {
        symbol: "https://images.pokemontcg.io/neo4/symbol.png",
        logo: "https://images.pokemontcg.io/neo4/logo.png",
      },
    },
    {
      id: "base6",
      name: "Legendary Collection",
      series: "Other",
      printedTotal: 110,
      total: 110,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "LC",
      releaseDate: "2002/05/24",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/base6/symbol.png",
        logo: "https://images.pokemontcg.io/base6/logo.png",
      },
    },
    {
      id: "ecard1",
      name: "Expedition Base Set",
      series: "E-Card",
      printedTotal: 165,
      total: 165,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "EX",
      releaseDate: "2002/09/15",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/ecard1/symbol.png",
        logo: "https://images.pokemontcg.io/ecard1/logo.png",
      },
    },
    {
      id: "bp",
      name: "Best of Game",
      series: "Other",
      printedTotal: 9,
      total: 9,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "BP",
      releaseDate: "2002/12/01",
      updatedAt: "2021/10/16 09:52:00",
      images: {
        symbol: "https://images.pokemontcg.io/bp/symbol.png",
        logo: "https://images.pokemontcg.io/bp/logo.png",
      },
    },
    {
      id: "ecard2",
      name: "Aquapolis",
      series: "E-Card",
      printedTotal: 147,
      total: 182,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "AQ",
      releaseDate: "2003/01/15",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ecard2/symbol.png",
        logo: "https://images.pokemontcg.io/ecard2/logo.png",
      },
    },
    {
      id: "ecard3",
      name: "Skyridge",
      series: "E-Card",
      printedTotal: 144,
      total: 182,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "SK",
      releaseDate: "2003/05/12",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ecard3/symbol.png",
        logo: "https://images.pokemontcg.io/ecard3/logo.png",
      },
    },
    {
      id: "ex1",
      name: "Ruby & Sapphire",
      series: "EX",
      printedTotal: 109,
      total: 109,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "RS",
      releaseDate: "2003/07/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex1/symbol.png",
        logo: "https://images.pokemontcg.io/ex1/logo.png",
      },
    },
    {
      id: "ex2",
      name: "Sandstorm",
      series: "EX",
      printedTotal: 100,
      total: 100,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "SS",
      releaseDate: "2003/09/18",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex2/symbol.png",
        logo: "https://images.pokemontcg.io/ex2/logo.png",
      },
    },
    {
      id: "ex3",
      name: "Dragon",
      series: "EX",
      printedTotal: 97,
      total: 100,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "DR",
      releaseDate: "2003/11/24",
      updatedAt: "2023/02/16 05:47:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex3/symbol.png",
        logo: "https://images.pokemontcg.io/ex3/logo.png",
      },
    },
    {
      id: "np",
      name: "Nintendo Black Star Promos",
      series: "NP",
      printedTotal: 40,
      total: 40,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "PR-NP",
      releaseDate: "2003/10/01",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/np/symbol.png",
        logo: "https://images.pokemontcg.io/np/logo.png",
      },
    },
    {
      id: "ex4",
      name: "Team Magma vs Team Aqua",
      series: "EX",
      printedTotal: 95,
      total: 97,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "MA",
      releaseDate: "2004/03/01",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex4/symbol.png",
        logo: "https://images.pokemontcg.io/ex4/logo.png",
      },
    },
    {
      id: "tk1a",
      name: "EX Trainer Kit Latias",
      series: "EX",
      printedTotal: 10,
      total: 10,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2004/06/01",
      updatedAt: "2022/01/13 20:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/tk1a/symbol.png",
        logo: "https://images.pokemontcg.io/tk1a/logo.png",
      },
    },
    {
      id: "tk1b",
      name: "EX Trainer Kit Latios",
      series: "EX",
      printedTotal: 10,
      total: 10,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2004/06/01",
      updatedAt: "2022/01/13 20:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/tk1b/symbol.png",
        logo: "https://images.pokemontcg.io/tk1b/logo.png",
      },
    },
    {
      id: "ex5",
      name: "Hidden Legends",
      series: "EX",
      printedTotal: 101,
      total: 102,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "HL",
      releaseDate: "2004/06/01",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex5/symbol.png",
        logo: "https://images.pokemontcg.io/ex5/logo.png",
      },
    },
    {
      id: "ex6",
      name: "FireRed & LeafGreen",
      series: "EX",
      printedTotal: 112,
      total: 116,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "RG",
      releaseDate: "2004/09/01",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex6/symbol.png",
        logo: "https://images.pokemontcg.io/ex6/logo.png",
      },
    },
    {
      id: "pop1",
      name: "POP Series 1",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2004/09/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop1/symbol.png",
        logo: "https://images.pokemontcg.io/pop1/logo.png",
      },
    },
    {
      id: "ex7",
      name: "Team Rocket Returns",
      series: "EX",
      printedTotal: 109,
      total: 111,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "TRR",
      releaseDate: "2004/11/01",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex7/symbol.png",
        logo: "https://images.pokemontcg.io/ex7/logo.png",
      },
    },
    {
      id: "ex8",
      name: "Deoxys",
      series: "EX",
      printedTotal: 107,
      total: 108,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "DX",
      releaseDate: "2005/02/01",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex8/symbol.png",
        logo: "https://images.pokemontcg.io/ex8/logo.png",
      },
    },
    {
      id: "ex9",
      name: "Emerald",
      series: "EX",
      printedTotal: 106,
      total: 107,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "EM",
      releaseDate: "2005/05/01",
      updatedAt: "2020/02/08 09:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex9/symbol.png",
        logo: "https://images.pokemontcg.io/ex9/logo.png",
      },
    },
    {
      id: "ex10",
      name: "Unseen Forces",
      series: "EX",
      printedTotal: 115,
      total: 145,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "UF",
      releaseDate: "2005/08/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex10/symbol.png",
        logo: "https://images.pokemontcg.io/ex10/logo.png",
      },
    },
    {
      id: "pop2",
      name: "POP Series 2",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2005/08/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop2/symbol.png",
        logo: "https://images.pokemontcg.io/pop2/logo.png",
      },
    },
    {
      id: "ex11",
      name: "Delta Species",
      series: "EX",
      printedTotal: 113,
      total: 114,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "DS",
      releaseDate: "2005/10/31",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex11/symbol.png",
        logo: "https://images.pokemontcg.io/ex11/logo.png",
      },
    },
    {
      id: "ex12",
      name: "Legend Maker",
      series: "EX",
      printedTotal: 92,
      total: 93,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "LM",
      releaseDate: "2006/02/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex12/symbol.png",
        logo: "https://images.pokemontcg.io/ex12/logo.png",
      },
    },
    {
      id: "tk2a",
      name: "EX Trainer Kit 2 Plusle",
      series: "EX",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2006/03/01",
      updatedAt: "2022/01/13 20:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/tk2a/symbol.png",
        logo: "https://images.pokemontcg.io/tk2a/logo.png",
      },
    },
    {
      id: "tk2b",
      name: "EX Trainer Kit 2 Minun",
      series: "EX",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2006/03/01",
      updatedAt: "2022/01/13 20:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/tk2b/symbol.png",
        logo: "https://images.pokemontcg.io/tk2b/logo.png",
      },
    },
    {
      id: "pop3",
      name: "POP Series 3",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2006/04/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop3/symbol.png",
        logo: "https://images.pokemontcg.io/pop3/logo.png",
      },
    },
    {
      id: "ex13",
      name: "Holon Phantoms",
      series: "EX",
      printedTotal: 110,
      total: 111,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "HP",
      releaseDate: "2006/05/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex13/symbol.png",
        logo: "https://images.pokemontcg.io/ex13/logo.png",
      },
    },
    {
      id: "ex14",
      name: "Crystal Guardians",
      series: "EX",
      printedTotal: 100,
      total: 100,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "CG",
      releaseDate: "2006/08/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex14/symbol.png",
        logo: "https://images.pokemontcg.io/ex14/logo.png",
      },
    },
    {
      id: "pop4",
      name: "POP Series 4",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2006/08/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop4/symbol.png",
        logo: "https://images.pokemontcg.io/pop4/logo.png",
      },
    },
    {
      id: "ex15",
      name: "Dragon Frontiers",
      series: "EX",
      printedTotal: 101,
      total: 101,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "DF",
      releaseDate: "2006/11/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex15/symbol.png",
        logo: "https://images.pokemontcg.io/ex15/logo.png",
      },
    },
    {
      id: "pop5",
      name: "POP Series 5",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2007/03/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop5/symbol.png",
        logo: "https://images.pokemontcg.io/pop5/logo.png",
      },
    },
    {
      id: "ex16",
      name: "Power Keepers",
      series: "EX",
      printedTotal: 108,
      total: 108,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "PK",
      releaseDate: "2007/02/02",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/ex16/symbol.png",
        logo: "https://images.pokemontcg.io/ex16/logo.png",
      },
    },
    {
      id: "dp1",
      name: "Diamond & Pearl",
      series: "Diamond & Pearl",
      printedTotal: 130,
      total: 130,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "DP",
      releaseDate: "2007/05/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp1/symbol.png",
        logo: "https://images.pokemontcg.io/dp1/logo.png",
      },
    },
    {
      id: "dpp",
      name: "DP Black Star Promos",
      series: "Diamond & Pearl",
      printedTotal: 56,
      total: 56,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "PR-DPP",
      releaseDate: "2007/05/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dpp/symbol.png",
        logo: "https://images.pokemontcg.io/dpp/logo.png",
      },
    },
    {
      id: "dp2",
      name: "Mysterious Treasures",
      series: "Diamond & Pearl",
      printedTotal: 123,
      total: 124,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "MT",
      releaseDate: "2007/08/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp2/symbol.png",
        logo: "https://images.pokemontcg.io/dp2/logo.png",
      },
    },
    {
      id: "pop6",
      name: "POP Series 6",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2007/09/01",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop6/symbol.png",
        logo: "https://images.pokemontcg.io/pop6/logo.png",
      },
    },
    {
      id: "dp3",
      name: "Secret Wonders",
      series: "Diamond & Pearl",
      printedTotal: 132,
      total: 132,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "SW",
      releaseDate: "2007/11/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp3/symbol.png",
        logo: "https://images.pokemontcg.io/dp3/logo.png",
      },
    },
    {
      id: "dp4",
      name: "Great Encounters",
      series: "Diamond & Pearl",
      printedTotal: 106,
      total: 106,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "GE",
      releaseDate: "2008/02/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp4/symbol.png",
        logo: "https://images.pokemontcg.io/dp4/logo.png",
      },
    },
    {
      id: "pop7",
      name: "POP Series 7",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2008/03/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop7/symbol.png",
        logo: "https://images.pokemontcg.io/pop7/logo.png",
      },
    },
    {
      id: "dp5",
      name: "Majestic Dawn",
      series: "Diamond & Pearl",
      printedTotal: 100,
      total: 100,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "MD",
      releaseDate: "2008/05/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp5/symbol.png",
        logo: "https://images.pokemontcg.io/dp5/logo.png",
      },
    },
    {
      id: "dp6",
      name: "Legends Awakened",
      series: "Diamond & Pearl",
      printedTotal: 146,
      total: 146,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "LA",
      releaseDate: "2008/08/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp6/symbol.png",
        logo: "https://images.pokemontcg.io/dp6/logo.png",
      },
    },
    {
      id: "pop8",
      name: "POP Series 8",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2008/09/01",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop8/symbol.png",
        logo: "https://images.pokemontcg.io/pop8/logo.png",
      },
    },
    {
      id: "dp7",
      name: "Stormfront",
      series: "Diamond & Pearl",
      printedTotal: 100,
      total: 106,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "SF",
      releaseDate: "2008/11/01",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/dp7/symbol.png",
        logo: "https://images.pokemontcg.io/dp7/logo.png",
      },
    },
    {
      id: "pl1",
      name: "Platinum",
      series: "Platinum",
      printedTotal: 127,
      total: 133,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "PL",
      releaseDate: "2009/02/11",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pl1/symbol.png",
        logo: "https://images.pokemontcg.io/pl1/logo.png",
      },
    },
    {
      id: "pop9",
      name: "POP Series 9",
      series: "POP",
      printedTotal: 17,
      total: 17,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2009/03/01",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/pop9/symbol.png",
        logo: "https://images.pokemontcg.io/pop9/logo.png",
      },
    },
    {
      id: "pl2",
      name: "Rising Rivals",
      series: "Platinum",
      printedTotal: 111,
      total: 120,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "RR",
      releaseDate: "2009/05/16",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/pl2/symbol.png",
        logo: "https://images.pokemontcg.io/pl2/logo.png",
      },
    },
    {
      id: "pl3",
      name: "Supreme Victors",
      series: "Platinum",
      printedTotal: 147,
      total: 153,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "SV",
      releaseDate: "2009/08/19",
      updatedAt: "2018/03/07 22:40:00",
      images: {
        symbol: "https://images.pokemontcg.io/pl3/symbol.png",
        logo: "https://images.pokemontcg.io/pl3/logo.png",
      },
    },
    {
      id: "pl4",
      name: "Arceus",
      series: "Platinum",
      printedTotal: 99,
      total: 111,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "AR",
      releaseDate: "2009/11/04",
      updatedAt: "2021/07/15 11:30:00",
      images: {
        symbol: "https://images.pokemontcg.io/pl4/symbol.png",
        logo: "https://images.pokemontcg.io/pl4/logo.png",
      },
    },
    {
      id: "ru1",
      name: "Pokémon Rumble",
      series: "Other",
      printedTotal: 16,
      total: 16,
      legalities: {
        unlimited: "Legal",
      },
      releaseDate: "2009/12/02",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/ru1/symbol.png",
        logo: "https://images.pokemontcg.io/ru1/logo.png",
      },
    },
    {
      id: "hgss1",
      name: "HeartGold & SoulSilver",
      series: "HeartGold & SoulSilver",
      printedTotal: 123,
      total: 124,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "HS",
      releaseDate: "2010/02/10",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/hgss1/symbol.png",
        logo: "https://images.pokemontcg.io/hgss1/logo.png",
      },
    },
    {
      id: "hsp",
      name: "HGSS Black Star Promos",
      series: "HeartGold & SoulSilver",
      printedTotal: 25,
      total: 25,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "PR-HS",
      releaseDate: "2010/02/10",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/hsp/symbol.png",
        logo: "https://images.pokemontcg.io/hsp/logo.png",
      },
    },
    {
      id: "hgss2",
      name: "HS—Unleashed",
      series: "HeartGold & SoulSilver",
      printedTotal: 95,
      total: 96,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "UL",
      releaseDate: "2010/05/12",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/hgss2/symbol.png",
        logo: "https://images.pokemontcg.io/hgss2/logo.png",
      },
    },
    {
      id: "hgss3",
      name: "HS—Undaunted",
      series: "HeartGold & SoulSilver",
      printedTotal: 90,
      total: 91,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "UD",
      releaseDate: "2010/08/18",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/hgss3/symbol.png",
        logo: "https://images.pokemontcg.io/hgss3/logo.png",
      },
    },
    {
      id: "hgss4",
      name: "HS—Triumphant",
      series: "HeartGold & SoulSilver",
      printedTotal: 102,
      total: 103,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "TM",
      releaseDate: "2010/11/03",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/hgss4/symbol.png",
        logo: "https://images.pokemontcg.io/hgss4/logo.png",
      },
    },
    {
      id: "col1",
      name: "Call of Legends",
      series: "HeartGold & SoulSilver",
      printedTotal: 95,
      total: 106,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "CL",
      releaseDate: "2011/02/09",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/col1/symbol.png",
        logo: "https://images.pokemontcg.io/col1/logo.png",
      },
    },
    {
      id: "bwp",
      name: "BW Black Star Promos",
      series: "Black & White",
      printedTotal: 101,
      total: 101,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PR-BLW",
      releaseDate: "2011/03/01",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bwp/symbol.png",
        logo: "https://images.pokemontcg.io/bwp/logo.png",
      },
    },
    {
      id: "bw1",
      name: "Black & White",
      series: "Black & White",
      printedTotal: 114,
      total: 115,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BLW",
      releaseDate: "2011/04/25",
      updatedAt: "2018/11/29 19:56:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw1/symbol.png",
        logo: "https://images.pokemontcg.io/bw1/logo.png",
      },
    },
    {
      id: "mcd11",
      name: "McDonald's Collection 2011",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2011/06/17",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd11/symbol.png",
        logo: "https://images.pokemontcg.io/mcd11/logo.png",
      },
    },
    {
      id: "bw2",
      name: "Emerging Powers",
      series: "Black & White",
      printedTotal: 98,
      total: 98,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "EPO",
      releaseDate: "2011/08/31",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw2/symbol.png",
        logo: "https://images.pokemontcg.io/bw2/logo.png",
      },
    },
    {
      id: "bw3",
      name: "Noble Victories",
      series: "Black & White",
      printedTotal: 101,
      total: 102,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "NVI",
      releaseDate: "2011/11/16",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw3/symbol.png",
        logo: "https://images.pokemontcg.io/bw3/logo.png",
      },
    },
    {
      id: "bw4",
      name: "Next Destinies",
      series: "Black & White",
      printedTotal: 99,
      total: 103,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "NXD",
      releaseDate: "2012/02/08",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw4/symbol.png",
        logo: "https://images.pokemontcg.io/bw4/logo.png",
      },
    },
    {
      id: "bw5",
      name: "Dark Explorers",
      series: "Black & White",
      printedTotal: 108,
      total: 111,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DEX",
      releaseDate: "2012/05/09",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw5/symbol.png",
        logo: "https://images.pokemontcg.io/bw5/logo.png",
      },
    },
    {
      id: "mcd12",
      name: "McDonald's Collection 2012",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2012/06/15",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd12/symbol.png",
        logo: "https://images.pokemontcg.io/mcd12/logo.png",
      },
    },
    {
      id: "bw6",
      name: "Dragons Exalted",
      series: "Black & White",
      printedTotal: 124,
      total: 128,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DRX",
      releaseDate: "2012/08/15",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw6/symbol.png",
        logo: "https://images.pokemontcg.io/bw6/logo.png",
      },
    },
    {
      id: "dv1",
      name: "Dragon Vault",
      series: "Black & White",
      printedTotal: 20,
      total: 21,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DRV",
      releaseDate: "2012/10/05",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/dv1/symbol.png",
        logo: "https://images.pokemontcg.io/dv1/logo.png",
      },
    },
    {
      id: "bw7",
      name: "Boundaries Crossed",
      series: "Black & White",
      printedTotal: 149,
      total: 153,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BCR",
      releaseDate: "2012/11/07",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw7/symbol.png",
        logo: "https://images.pokemontcg.io/bw7/logo.png",
      },
    },
    {
      id: "bw8",
      name: "Plasma Storm",
      series: "Black & White",
      printedTotal: 135,
      total: 138,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PLS",
      releaseDate: "2013/02/06",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw8/symbol.png",
        logo: "https://images.pokemontcg.io/bw8/logo.png",
      },
    },
    {
      id: "bw9",
      name: "Plasma Freeze",
      series: "Black & White",
      printedTotal: 116,
      total: 122,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PLF",
      releaseDate: "2013/05/08",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw9/symbol.png",
        logo: "https://images.pokemontcg.io/bw9/logo.png",
      },
    },
    {
      id: "bw10",
      name: "Plasma Blast",
      series: "Black & White",
      printedTotal: 101,
      total: 105,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PLB",
      releaseDate: "2013/08/14",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw10/symbol.png",
        logo: "https://images.pokemontcg.io/bw10/logo.png",
      },
    },
    {
      id: "xyp",
      name: "XY Black Star Promos",
      series: "XY",
      printedTotal: 211,
      total: 216,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PR-XY",
      releaseDate: "2013/10/12",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xyp/symbol.png",
        logo: "https://images.pokemontcg.io/xyp/logo.png",
      },
    },
    {
      id: "bw11",
      name: "Legendary Treasures",
      series: "Black & White",
      printedTotal: 113,
      total: 140,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "LTR",
      releaseDate: "2013/11/06",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/bw11/symbol.png",
        logo: "https://images.pokemontcg.io/bw11/logo.png",
      },
    },
    {
      id: "xy0",
      name: "Kalos Starter Set",
      series: "XY",
      printedTotal: 39,
      total: 39,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "KSS",
      releaseDate: "2013/11/08",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy0/symbol.png",
        logo: "https://images.pokemontcg.io/xy0/logo.png",
      },
    },
    {
      id: "xy1",
      name: "XY",
      series: "XY",
      printedTotal: 146,
      total: 146,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "XY",
      releaseDate: "2014/02/05",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy1/symbol.png",
        logo: "https://images.pokemontcg.io/xy1/logo.png",
      },
    },
    {
      id: "xy2",
      name: "Flashfire",
      series: "XY",
      printedTotal: 106,
      total: 110,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "FLF",
      releaseDate: "2014/05/07",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy2/symbol.png",
        logo: "https://images.pokemontcg.io/xy2/logo.png",
      },
    },
    {
      id: "mcd14",
      name: "McDonald's Collection 2014",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2014/05/23",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd14/symbol.png",
        logo: "https://images.pokemontcg.io/mcd14/logo.png",
      },
    },
    {
      id: "xy3",
      name: "Furious Fists",
      series: "XY",
      printedTotal: 111,
      total: 114,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "FFI",
      releaseDate: "2014/08/13",
      updatedAt: "2018/03/04 10:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy3/symbol.png",
        logo: "https://images.pokemontcg.io/xy3/logo.png",
      },
    },
    {
      id: "xy4",
      name: "Phantom Forces",
      series: "XY",
      printedTotal: 119,
      total: 124,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PHF",
      releaseDate: "2014/11/05",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy4/symbol.png",
        logo: "https://images.pokemontcg.io/xy4/logo.png",
      },
    },
    {
      id: "xy5",
      name: "Primal Clash",
      series: "XY",
      printedTotal: 160,
      total: 164,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PRC",
      releaseDate: "2015/02/04",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy5/symbol.png",
        logo: "https://images.pokemontcg.io/xy5/logo.png",
      },
    },
    {
      id: "dc1",
      name: "Double Crisis",
      series: "XY",
      printedTotal: 34,
      total: 34,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DCR",
      releaseDate: "2015/03/25",
      updatedAt: "2019/01/28 16:44:00",
      images: {
        symbol: "https://images.pokemontcg.io/dc1/symbol.png",
        logo: "https://images.pokemontcg.io/dc1/logo.png",
      },
    },
    {
      id: "xy6",
      name: "Roaring Skies",
      series: "XY",
      printedTotal: 108,
      total: 112,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "ROS",
      releaseDate: "2015/05/06",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy6/symbol.png",
        logo: "https://images.pokemontcg.io/xy6/logo.png",
      },
    },
    {
      id: "xy7",
      name: "Ancient Origins",
      series: "XY",
      printedTotal: 98,
      total: 100,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "AOR",
      releaseDate: "2015/08/12",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy7/symbol.png",
        logo: "https://images.pokemontcg.io/xy7/logo.png",
      },
    },
    {
      id: "xy8",
      name: "BREAKthrough",
      series: "XY",
      printedTotal: 162,
      total: 165,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BKT",
      releaseDate: "2015/11/04",
      updatedAt: "2019/04/10 19:59:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy8/symbol.png",
        logo: "https://images.pokemontcg.io/xy8/logo.png",
      },
    },
    {
      id: "mcd15",
      name: "McDonald's Collection 2015",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2015/11/27",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd15/symbol.png",
        logo: "https://images.pokemontcg.io/mcd15/logo.png",
      },
    },
    {
      id: "xy9",
      name: "BREAKpoint",
      series: "XY",
      printedTotal: 122,
      total: 126,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BKP",
      releaseDate: "2016/02/03",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy9/symbol.png",
        logo: "https://images.pokemontcg.io/xy9/logo.png",
      },
    },
    {
      id: "g1",
      name: "Generations",
      series: "XY",
      printedTotal: 83,
      total: 117,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "GEN",
      releaseDate: "2016/02/22",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/g1/symbol.png",
        logo: "https://images.pokemontcg.io/g1/logo.png",
      },
    },
    {
      id: "xy10",
      name: "Fates Collide",
      series: "XY",
      printedTotal: 124,
      total: 129,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "FCO",
      releaseDate: "2016/05/02",
      updatedAt: "2018/09/03 11:49:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy10/symbol.png",
        logo: "https://images.pokemontcg.io/xy10/logo.png",
      },
    },
    {
      id: "xy11",
      name: "Steam Siege",
      series: "XY",
      printedTotal: 114,
      total: 116,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "STS",
      releaseDate: "2016/08/03",
      updatedAt: "2019/04/10 19:59:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy11/symbol.png",
        logo: "https://images.pokemontcg.io/xy11/logo.png",
      },
    },
    {
      id: "mcd16",
      name: "McDonald's Collection 2016",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2016/08/19",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd16/symbol.png",
        logo: "https://images.pokemontcg.io/mcd16/logo.png",
      },
    },
    {
      id: "xy12",
      name: "Evolutions",
      series: "XY",
      printedTotal: 108,
      total: 113,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "EVO",
      releaseDate: "2016/11/02",
      updatedAt: "2020/09/25 10:09:00",
      images: {
        symbol: "https://images.pokemontcg.io/xy12/symbol.png",
        logo: "https://images.pokemontcg.io/xy12/logo.png",
      },
    },
    {
      id: "sm1",
      name: "Sun & Moon",
      series: "Sun & Moon",
      printedTotal: 149,
      total: 173,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SUM",
      releaseDate: "2017/02/03",
      updatedAt: "2019/04/10 19:59:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm1/symbol.png",
        logo: "https://images.pokemontcg.io/sm1/logo.png",
      },
    },
    {
      id: "smp",
      name: "SM Black Star Promos",
      series: "Sun & Moon",
      printedTotal: 248,
      total: 250,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PR-SM",
      releaseDate: "2017/02/03",
      updatedAt: "2020/05/01 16:06:00",
      images: {
        symbol: "https://images.pokemontcg.io/smp/symbol.png",
        logo: "https://images.pokemontcg.io/smp/logo.png",
      },
    },
    {
      id: "sm2",
      name: "Guardians Rising",
      series: "Sun & Moon",
      printedTotal: 145,
      total: 180,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "GRI",
      releaseDate: "2017/05/05",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm2/symbol.png",
        logo: "https://images.pokemontcg.io/sm2/logo.png",
      },
    },
    {
      id: "sm3",
      name: "Burning Shadows",
      series: "Sun & Moon",
      printedTotal: 147,
      total: 177,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BUS",
      releaseDate: "2017/08/05",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm3/symbol.png",
        logo: "https://images.pokemontcg.io/sm3/logo.png",
      },
    },
    {
      id: "sm35",
      name: "Shining Legends",
      series: "Sun & Moon",
      printedTotal: 73,
      total: 81,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SLG",
      releaseDate: "2017/10/06",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm35/symbol.png",
        logo: "https://images.pokemontcg.io/sm35/logo.png",
      },
    },
    {
      id: "sm4",
      name: "Crimson Invasion",
      series: "Sun & Moon",
      printedTotal: 111,
      total: 126,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CIN",
      releaseDate: "2017/11/03",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm4/symbol.png",
        logo: "https://images.pokemontcg.io/sm4/logo.png",
      },
    },
    {
      id: "mcd17",
      name: "McDonald's Collection 2017",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2017/11/07",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd17/symbol.png",
        logo: "https://images.pokemontcg.io/mcd17/logo.png",
      },
    },
    {
      id: "sm5",
      name: "Ultra Prism",
      series: "Sun & Moon",
      printedTotal: 156,
      total: 178,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "UPR",
      releaseDate: "2018/02/02",
      updatedAt: "2019/02/19 23:25:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm5/symbol.png",
        logo: "https://images.pokemontcg.io/sm5/logo.png",
      },
    },
    {
      id: "sm6",
      name: "Forbidden Light",
      series: "Sun & Moon",
      printedTotal: 131,
      total: 150,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "FLI",
      releaseDate: "2018/05/04",
      updatedAt: "2019/02/19 23:25:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm6/symbol.png",
        logo: "https://images.pokemontcg.io/sm6/logo.png",
      },
    },
    {
      id: "sm7",
      name: "Celestial Storm",
      series: "Sun & Moon",
      printedTotal: 168,
      total: 187,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CES",
      releaseDate: "2018/08/03",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm7/symbol.png",
        logo: "https://images.pokemontcg.io/sm7/logo.png",
      },
    },
    {
      id: "sm75",
      name: "Dragon Majesty",
      series: "Sun & Moon",
      printedTotal: 70,
      total: 80,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DRM",
      releaseDate: "2018/09/07",
      updatedAt: "2018/10/01 21:54:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm75/symbol.png",
        logo: "https://images.pokemontcg.io/sm75/logo.png",
      },
    },
    {
      id: "mcd18",
      name: "McDonald's Collection 2018",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2018/10/16",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd18/symbol.png",
        logo: "https://images.pokemontcg.io/mcd18/logo.png",
      },
    },
    {
      id: "sm8",
      name: "Lost Thunder",
      series: "Sun & Moon",
      printedTotal: 214,
      total: 240,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "LOT",
      releaseDate: "2018/11/02",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm8/symbol.png",
        logo: "https://images.pokemontcg.io/sm8/logo.png",
      },
    },
    {
      id: "sm9",
      name: "Team Up",
      series: "Sun & Moon",
      printedTotal: 181,
      total: 198,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "TEU",
      releaseDate: "2019/02/01",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm9/symbol.png",
        logo: "https://images.pokemontcg.io/sm9/logo.png",
      },
    },
    {
      id: "det1",
      name: "Detective Pikachu",
      series: "Sun & Moon",
      printedTotal: 18,
      total: 18,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DET",
      releaseDate: "2019/04/05",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/det1/symbol.png",
        logo: "https://images.pokemontcg.io/det1/logo.png",
      },
    },
    {
      id: "sm10",
      name: "Unbroken Bonds",
      series: "Sun & Moon",
      printedTotal: 214,
      total: 234,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "UNB",
      releaseDate: "2019/05/03",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm10/symbol.png",
        logo: "https://images.pokemontcg.io/sm10/logo.png",
      },
    },
    {
      id: "sm11",
      name: "Unified Minds",
      series: "Sun & Moon",
      printedTotal: 236,
      total: 260,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "UNM",
      releaseDate: "2019/08/02",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm11/symbol.png",
        logo: "https://images.pokemontcg.io/sm11/logo.png",
      },
    },
    {
      id: "sm115",
      name: "Hidden Fates",
      series: "Sun & Moon",
      printedTotal: 68,
      total: 69,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "HIF",
      releaseDate: "2019/08/23",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm115/symbol.png",
        logo: "https://images.pokemontcg.io/sm115/logo.png",
      },
    },
    {
      id: "sma",
      name: "Hidden Fates Shiny Vault",
      series: "Sun & Moon",
      printedTotal: 94,
      total: 94,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2019/08/23",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/sma/symbol.png",
        logo: "https://images.pokemontcg.io/sma/logo.png",
      },
    },
    {
      id: "mcd19",
      name: "McDonald's Collection 2019",
      series: "Other",
      printedTotal: 12,
      total: 12,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2019/10/15",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd19/symbol.png",
        logo: "https://images.pokemontcg.io/mcd19/logo.png",
      },
    },
    {
      id: "sm12",
      name: "Cosmic Eclipse",
      series: "Sun & Moon",
      printedTotal: 236,
      total: 272,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CEC",
      releaseDate: "2019/11/01",
      updatedAt: "2021/09/01 05:37:00",
      images: {
        symbol: "https://images.pokemontcg.io/sm12/symbol.png",
        logo: "https://images.pokemontcg.io/sm12/logo.png",
      },
    },
    {
      id: "swshp",
      name: "SWSH Black Star Promos",
      series: "Sword & Shield",
      printedTotal: 307,
      total: 304,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PR-SW",
      releaseDate: "2019/11/15",
      updatedAt: "2022/07/23 20:15:00",
      images: {
        symbol: "https://images.pokemontcg.io/swshp/symbol.png",
        logo: "https://images.pokemontcg.io/swshp/logo.png",
      },
    },
    {
      id: "swsh1",
      name: "Sword & Shield",
      series: "Sword & Shield",
      printedTotal: 202,
      total: 216,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SSH",
      releaseDate: "2020/02/07",
      updatedAt: "2020/08/14 09:35:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh1/symbol.png",
        logo: "https://images.pokemontcg.io/swsh1/logo.png",
      },
    },
    {
      id: "swsh2",
      name: "Rebel Clash",
      series: "Sword & Shield",
      printedTotal: 192,
      total: 209,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "RCL",
      releaseDate: "2020/05/01",
      updatedAt: "2020/09/25 10:09:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh2/symbol.png",
        logo: "https://images.pokemontcg.io/swsh2/logo.png",
      },
    },
    {
      id: "swsh3",
      name: "Darkness Ablaze",
      series: "Sword & Shield",
      printedTotal: 189,
      total: 201,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "DAA",
      releaseDate: "2020/08/14",
      updatedAt: "2020/10/25 13:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh3/symbol.png",
        logo: "https://images.pokemontcg.io/swsh3/logo.png",
      },
    },
    {
      id: "fut20",
      name: "Pokémon Futsal Collection",
      series: "Other",
      printedTotal: 5,
      total: 5,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "FUT20",
      releaseDate: "2020/09/11",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/fut20/symbol.png",
        logo: "https://images.pokemontcg.io/fut20/logo.png",
      },
    },
    {
      id: "swsh35",
      name: "Champion's Path",
      series: "Sword & Shield",
      printedTotal: 73,
      total: 80,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CPA",
      releaseDate: "2020/09/25",
      updatedAt: "2020/10/25 13:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh35/symbol.png",
        logo: "https://images.pokemontcg.io/swsh35/logo.png",
      },
    },
    {
      id: "swsh4",
      name: "Vivid Voltage",
      series: "Sword & Shield",
      printedTotal: 185,
      total: 203,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "VIV",
      releaseDate: "2020/11/13",
      updatedAt: "2020/11/13 16:20:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh4/symbol.png",
        logo: "https://images.pokemontcg.io/swsh4/logo.png",
      },
    },
    {
      id: "swsh45",
      name: "Shining Fates",
      series: "Sword & Shield",
      printedTotal: 72,
      total: 73,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SHF",
      releaseDate: "2021/02/19",
      updatedAt: "2021/02/24 16:17:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh45/symbol.png",
        logo: "https://images.pokemontcg.io/swsh45/logo.png",
      },
    },
    {
      id: "swsh45sv",
      name: "Shining Fates Shiny Vault",
      series: "Sword & Shield",
      printedTotal: 122,
      total: 122,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SHF",
      releaseDate: "2021/02/19",
      updatedAt: "2021/02/24 16:17:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh45sv/symbol.png",
        logo: "https://images.pokemontcg.io/swsh45sv/logo.png",
      },
    },
    {
      id: "swsh5",
      name: "Battle Styles",
      series: "Sword & Shield",
      printedTotal: 163,
      total: 183,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BST",
      releaseDate: "2021/03/19",
      updatedAt: "2021/03/19 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh5/symbol.png",
        logo: "https://images.pokemontcg.io/swsh5/logo.png",
      },
    },
    {
      id: "swsh6",
      name: "Chilling Reign",
      series: "Sword & Shield",
      printedTotal: 198,
      total: 233,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CRE",
      releaseDate: "2021/06/18",
      updatedAt: "2021/06/18 12:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh6/symbol.png",
        logo: "https://images.pokemontcg.io/swsh6/logo.png",
      },
    },
    {
      id: "swsh7",
      name: "Evolving Skies",
      series: "Sword & Shield",
      printedTotal: 203,
      total: 237,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "EVS",
      releaseDate: "2021/08/27",
      updatedAt: "2021/08/27 10:17:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh7/symbol.png",
        logo: "https://images.pokemontcg.io/swsh7/logo.png",
      },
    },
    {
      id: "mcd21",
      name: "McDonald's Collection 2021",
      series: "Other",
      printedTotal: 25,
      total: 25,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
      },
      releaseDate: "2021/02/09",
      updatedAt: "2022/10/10 15:12:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd21/symbol.png",
        logo: "https://images.pokemontcg.io/mcd21/logo.png",
      },
    },
    {
      id: "cel25",
      name: "Celebrations",
      series: "Sword & Shield",
      printedTotal: 25,
      total: 25,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CEL",
      releaseDate: "2021/10/08",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/cel25/symbol.png",
        logo: "https://images.pokemontcg.io/cel25/logo.png",
      },
    },
    {
      id: "cel25c",
      name: "Celebrations: Classic Collection",
      series: "Sword & Shield",
      printedTotal: 25,
      total: 25,
      legalities: {
        unlimited: "Legal",
      },
      ptcgoCode: "CEL",
      releaseDate: "2021/10/08",
      updatedAt: "2022/10/11 21:39:00",
      images: {
        symbol: "https://images.pokemontcg.io/cel25c/symbol.png",
        logo: "https://images.pokemontcg.io/cel25c/logo.png",
      },
    },
    {
      id: "swsh8",
      name: "Fusion Strike",
      series: "Sword & Shield",
      printedTotal: 264,
      total: 284,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "FST",
      releaseDate: "2021/11/12",
      updatedAt: "2021/11/12 07:32:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh8/symbol.png",
        logo: "https://images.pokemontcg.io/swsh8/logo.png",
      },
    },
    {
      id: "swsh9",
      name: "Brilliant Stars",
      series: "Sword & Shield",
      printedTotal: 172,
      total: 186,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BRS",
      releaseDate: "2022/02/25",
      updatedAt: "2022/02/23 09:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh9/symbol.png",
        logo: "https://images.pokemontcg.io/swsh9/logo.png",
      },
    },
    {
      id: "swsh9tg",
      name: "Brilliant Stars Trainer Gallery",
      series: "Sword & Shield",
      printedTotal: 30,
      total: 30,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "BRS",
      releaseDate: "2022/02/25",
      updatedAt: "2022/02/23 09:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh9tg/symbol.png",
        logo: "https://images.pokemontcg.io/swsh9tg/logo.png",
      },
    },
    {
      id: "swsh10",
      name: "Astral Radiance",
      series: "Sword & Shield",
      printedTotal: 189,
      total: 216,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "ASR",
      releaseDate: "2022/05/27",
      updatedAt: "2022/05/27 09:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh10/symbol.png",
        logo: "https://images.pokemontcg.io/swsh10/logo.png",
      },
    },
    {
      id: "swsh10tg",
      name: "Astral Radiance Trainer Gallery",
      series: "Sword & Shield",
      printedTotal: 30,
      total: 30,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "ASR",
      releaseDate: "2022/05/27",
      updatedAt: "2022/05/27 09:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh10tg/symbol.png",
        logo: "https://images.pokemontcg.io/swsh10tg/logo.png",
      },
    },
    {
      id: "pgo",
      name: "Pokémon GO",
      series: "Sword & Shield",
      printedTotal: 78,
      total: 88,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PGO",
      releaseDate: "2022/07/01",
      updatedAt: "2022/07/06 17:07:00",
      images: {
        symbol: "https://images.pokemontcg.io/pgo/symbol.png",
        logo: "https://images.pokemontcg.io/pgo/logo.png",
      },
    },
    {
      id: "mcd22",
      name: "McDonald's Collection 2022",
      series: "Other",
      printedTotal: 15,
      total: 15,
      legalities: {
        unlimited: "Legal",
        expanded: "Legal",
        standard: "Legal",
      },
      releaseDate: "2022/08/03",
      updatedAt: "2022/10/09 13:21:00",
      images: {
        symbol: "https://images.pokemontcg.io/mcd22/symbol.png",
        logo: "https://images.pokemontcg.io/mcd22/logo.png",
      },
    },
    {
      id: "swsh11",
      name: "Lost Origin",
      series: "Sword & Shield",
      printedTotal: 196,
      total: 217,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "LOR",
      releaseDate: "2022/09/09",
      updatedAt: "2022/09/09 13:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh11/symbol.png",
        logo: "https://images.pokemontcg.io/swsh11/logo.png",
      },
    },
    {
      id: "swsh11tg",
      name: "Lost Origin Trainer Gallery",
      series: "Sword & Shield",
      printedTotal: 30,
      total: 30,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "LOR",
      releaseDate: "2022/09/09",
      updatedAt: "2022/09/09 13:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh11tg/symbol.png",
        logo: "https://images.pokemontcg.io/swsh11tg/logo.png",
      },
    },
    {
      id: "swsh12",
      name: "Silver Tempest",
      series: "Sword & Shield",
      printedTotal: 195,
      total: 215,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SIT",
      releaseDate: "2022/11/11",
      updatedAt: "2022/09/09 11:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh12/symbol.png",
        logo: "https://images.pokemontcg.io/swsh12/logo.png",
      },
    },
    {
      id: "swsh12tg",
      name: "Silver Tempest Trainer Gallery",
      series: "Sword & Shield",
      printedTotal: 30,
      total: 30,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SIT",
      releaseDate: "2022/11/11",
      updatedAt: "2022/11/11 11:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh12tg/symbol.png",
        logo: "https://images.pokemontcg.io/swsh12tg/logo.png",
      },
    },
    {
      id: "swsh12pt5",
      name: "Crown Zenith",
      series: "Sword & Shield",
      printedTotal: 159,
      total: 160,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CRZ",
      releaseDate: "2023/01/20",
      updatedAt: "2023/01/19 15:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh12pt5/symbol.png",
        logo: "https://images.pokemontcg.io/swsh12pt5/logo.png",
      },
    },
    {
      id: "swsh12pt5gg",
      name: "Crown Zenith Galarian Gallery",
      series: "Sword & Shield",
      printedTotal: 70,
      total: 70,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "CRZ",
      releaseDate: "2023/01/20",
      updatedAt: "2023/01/19 15:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/swsh12pt5gg/symbol.png",
        logo: "https://images.pokemontcg.io/swsh12pt5gg/logo.png",
      },
    },
    {
      id: "svp",
      name: "Scarlet & Violet Black Star Promos",
      series: "Scarlet & Violet",
      printedTotal: 102,
      total: 75,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PR-SV",
      releaseDate: "2023/01/01",
      updatedAt: "2023/12/11 23:15:00",
      images: {
        symbol: "https://images.pokemontcg.io/svp/symbol.png",
        logo: "https://images.pokemontcg.io/svp/logo.png",
      },
    },
    {
      id: "sve",
      name: "Scarlet & Violet Energies",
      series: "Scarlet & Violet",
      printedTotal: 8,
      total: 8,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SVE",
      releaseDate: "2023/03/31",
      updatedAt: "2023/07/20 15:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/sve/symbol.png",
        logo: "https://images.pokemontcg.io/sve/logo.png",
      },
    },
    {
      id: "sv1",
      name: "Scarlet & Violet",
      series: "Scarlet & Violet",
      printedTotal: 198,
      total: 258,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "SVI",
      releaseDate: "2023/03/31",
      updatedAt: "2023/03/31 15:45:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv1/symbol.png",
        logo: "https://images.pokemontcg.io/sv1/logo.png",
      },
    },
    {
      id: "sv2",
      name: "Paldea Evolved",
      series: "Scarlet & Violet",
      printedTotal: 193,
      total: 279,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PAL",
      releaseDate: "2023/06/09",
      updatedAt: "2023/06/09 15:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv2/symbol.png",
        logo: "https://images.pokemontcg.io/sv2/logo.png",
      },
    },
    {
      id: "sv3",
      name: "Obsidian Flames",
      series: "Scarlet & Violet",
      printedTotal: 197,
      total: 230,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "OBF",
      releaseDate: "2023/08/11",
      updatedAt: "2023/08/11 15:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv3/symbol.png",
        logo: "https://images.pokemontcg.io/sv3/logo.png",
      },
    },
    {
      id: "sv3pt5",
      name: "151",
      series: "Scarlet & Violet",
      printedTotal: 165,
      total: 207,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "MEW",
      releaseDate: "2023/09/22",
      updatedAt: "2023/09/22 15:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv3pt5/symbol.png",
        logo: "https://images.pokemontcg.io/sv3pt5/logo.png",
      },
    },
    {
      id: "sv4",
      name: "Paradox Rift",
      series: "Scarlet & Violet",
      printedTotal: 182,
      total: 266,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PAR",
      releaseDate: "2023/11/03",
      updatedAt: "2023/11/03 15:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv4/symbol.png",
        logo: "https://images.pokemontcg.io/sv4/logo.png",
      },
    },
    {
      id: "sv4pt5",
      name: "Paldean Fates",
      series: "Scarlet & Violet",
      printedTotal: 91,
      total: 245,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "PAF",
      releaseDate: "2024/01/26",
      updatedAt: "2024/01/25 15:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv4pt5/symbol.png",
        logo: "https://images.pokemontcg.io/sv4pt5/logo.png",
      },
    },
    {
      id: "sv5",
      name: "Temporal Forces",
      series: "Scarlet & Violet",
      printedTotal: 162,
      total: 218,
      legalities: {
        unlimited: "Legal",
        standard: "Legal",
        expanded: "Legal",
      },
      ptcgoCode: "TEF",
      releaseDate: "2024/03/22",
      updatedAt: "2024/03/22 15:00:00",
      images: {
        symbol: "https://images.pokemontcg.io/sv5/symbol.png",
        logo: "https://images.pokemontcg.io/sv5/logo.png",
      },
    },
  ];
  await db.insert(sets).values(
    dat.map((d) => ({
      id: d.id,
      data: sql`${d}::jsonb`,
    })),
  );
  // await db.delete(sets);
}
