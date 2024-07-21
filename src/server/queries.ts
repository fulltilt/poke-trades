import { sql, count, like, and, ilike, eq } from "drizzle-orm";
import { db } from "./db";
import { sets, cards, user, cardList } from "./db/schema";

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
      normal?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      holofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      reverseHolofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
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

export type TradeObject = {
  id: string;
  name: string;
  price: number;
};

export type Trade = {
  user: string;
  haves: TradeObject[];
  wants: TradeObject[];
  partner: string;
  completed: boolean;
};

export type List = {
  id: string;
  user: string;
  listName: string;
  cards: Card[];
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  cardLists: List[];
  trades: Trade[];
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
      const series = set?.data?.series ?? "";
      if (!allSets.has(series)) allSets.set(series, []);
      allSets.get(series)?.push(set?.data);
      return allSets;
    },
    new Map(),
  );
}

export async function getSet(id: string) {
  //: {id: string, data: SSet}[]
  const res = await db.select().from(sets).where(eq(sets.id, id));
  return res[0];
}

export async function getCardsFromSet(
  search: string,
  id: string,
  page: number,
  pageSize: number,
) {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }

  const countPrepared = db
    .select({ count: count() })
    .from(cards)
    .where(
      and(
        id.length ? like(cards.id, sql.placeholder("searchterm")) : undefined,
        search.length
          ? sql`DATA->>'name' ILIKE ${sql.placeholder("search")}`
          : undefined,
      ),
    );
  // .prepare("cardsCountStatement");

  const countData = await countPrepared.execute({
    searchterm: `${id}-%`,
    search: `%${search}%`,
  });

  // const prepared = db.query.cards
  //   .findMany({
  //     limit: sql.placeholder("limit"),
  //     offset: sql.placeholder("offset"),
  //     orderBy: sql`CAST(DATA->>'number' AS INTEGER)`,
  //     where: (model, { like }) => like(model.id, sql.placeholder("searchterm")),
  //   })
  //   .prepare("query_name");

  const cardsPrepared = db
    .select()
    .from(cards)
    .where(
      and(
        id.length ? like(cards.id, sql.placeholder("searchterm")) : undefined,
        search.length
          ? sql`DATA->>'name' ILIKE ${sql.placeholder("search")}`
          : undefined,
      ),
    )
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("offset"))
    .orderBy(sql`CAST(DATA->>'number' AS INTEGER)`);

  const cardsData = await cardsPrepared.execute({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    searchterm: id.length ? `${id}-%` : "",
    search: `%${search}%`,
  });

  return Object.assign(
    {},
    { cards: cardsData.map((r) => r.data) },
    { totalCount: countData[0]?.count },
  );
}

export async function getCardsFromSetAPI(query: string) {
  console.log(query);
  //   if (query.indexOf("pageSize") === -1) return;

  const res = await fetch(`https://api.pokemontcg.io/v2/cards?${query}`, {
    method: "GET",
    headers: {
      "X-Api-Key": process.env.XAPIKEY!,
    },
  });
  // for (let i = 0; i < 72; ++i) {

  // }

  // const data = await res.json();
  // console.log(data);
}

export async function createUser(authId: string, email: string) {
  await db.insert(user).values({ authId, email });
}

export async function createList(userId: string, name: string) {
  await db.insert(cardList).values({ userId, name });
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
  // const dat: any = [];
  // await db.insert(sets).values(
  //   dat.map((d: any) => ({
  //     id: sql`${d.id}::text`,
  //     info: sql`${d}::jsonb`,
  //   })),
  // );
  // await db.delete(sets);
}
