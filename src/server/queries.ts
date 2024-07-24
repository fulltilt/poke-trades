"use server";

import { sql, count, like, and, ilike, eq } from "drizzle-orm";
import { db } from "./db";
import { sets, cards, user, cardList, cardListItem } from "./db/schema";

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
      unlimitedHolofoil?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      "1EditionHolofoil"?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      unlimited?: {
        low: number;
        mid: number;
        high: number;
        market: number;
        directLow: number;
      };
      "1stEdition"?: {
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

export async function getAllCards(
  page: number,
  pageSize: number,
): Promise<{ totalCount: number; cards: Card[] }> {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }
  const countPrepared = db.select({ count: count() }).from(cards);
  const countData = await countPrepared.execute();

  // const cardsPrepared = db
  //   .select()
  //   .from(cards)
  //   .orderBy(
  //     // sql`(DATA->'set'->>'releaseDate')::date DESC, CAST(DATA->>'number' AS INTEGER)`,
  //     sql`DATA->'set'->>'releaseDate' DESC`,
  //     // sql`CAST(DATA->>'number' AS INTEGER)`,
  //   )
  //   .limit(sql.placeholder("limit"))
  //   .offset(sql.placeholder("offset"));

  // const cardsData = await cardsPrepared.execute({
  //   limit: pageSize,
  //   offset: (page - 1) * pageSize,
  // });

  const cardsData = await db.execute(sql`
    SELECT *
    FROM poketrades_card
    ORDER BY data->'set'->>'releaseDate' DESC, CAST(DATA->>'number' AS INTEGER)
    LIMIT ${pageSize}
    OFFSET ${(page - 1) * pageSize}
  `);

  return Object.assign(
    {},
    {
      cards: cardsData.rows.map((r) => r.data) as Card[],
    },
    { totalCount: countData[0]?.count ?? 0 },
  );
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

export async function createUser(authId: string, email: string) {
  await db.insert(user).values({ authId, email });
}

export async function createList(userId: string, name: string) {
  await db.insert(cardList).values({ userId, name });
}

export async function getCardList(userId: string | null, listName: string) {
  if (!userId) return; // TODO: have message that user has to be signed in

  const res = await db
    .select({
      cardId: cardListItem.cardId,
    })
    .from(cardList)
    .innerJoin(
      cardListItem,
      and(
        eq(cardList.userId, userId),
        eq(cardList.name, listName),
        eq(cardList.id, cardListItem.cardListId),
      ),
    )
    .execute();

  return res;
}

export async function updateCardList(
  userId: string,
  listName: string,
  cardId: string,
  difference: number,
) {
  console.log(userId, listName, cardId);
  if (!userId)
    return {
      error: "User not logged in",
    };
  // get CardList id (need to do this step in case the next query results is empty)
  const cardListRes = await db
    .select({ cardListId: cardList.id })
    .from(cardList)
    .where(and(eq(cardList.userId, userId), eq(cardList.name, listName)))
    .execute();

  const cardListId = cardListRes[0]?.cardListId ?? null;

  if (cardListId) {
    // get CardListItems for User's particular CardList
    const cardListItemsRes = await db
      .select({
        cardListItemId: cardListItem.id,
        cardId: cardListItem.cardId,
        quantity: cardListItem.quantity,
      })
      .from(cardListItem)
      .where(eq(cardListItem.cardListId, cardListId))
      .execute();

    // check if Card is in CardList
    const filteredList = cardListItemsRes.filter((el) => el.cardId === cardId);
    console.log(filteredList);
    // if Card is not in CardList, add entry
    if (!filteredList.length) {
      const cardListItemRes = await db
        .insert(cardListItem)
        .values({
          cardListId,
          cardId,
          quantity: 1,
        })
        .execute();
      console.log("cardListItemRes", cardListItemRes);
    } else {
      const cardListItemId = filteredList[0]?.cardListItemId ?? 0;
      const quantity = filteredList[0]?.quantity ?? 0;
      const cardListItemRes = await db
        .update(cardListItem)
        .set({
          quantity: quantity + difference,
        })
        .where(eq(cardListItem.id, cardListItemId))
        .returning({
          cardListItemId: cardListItem.id,
          quantity: cardListItem.quantity,
        })
        .execute();

      // if resulting quantity is 0, delete row from CardListItem table
      const newQuantity = cardListItemRes[0]?.quantity;
      if (newQuantity === 0) {
        const id = cardListItemRes[0]?.cardListItemId ?? 0;
        await db.delete(cardListItem).where(eq(cardListItem.id, id));
      }
    }
  } else {
    // TODO: display error message that CardList cannot be found
  }
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
  // const dat = ;
  // await db.insert(cards).values(
  //   dat.map((d: any) => ({
  //     id: sql`${d.id}::text`,
  //     data: sql`${d}::jsonb`,
  //   })),
  // );
}
