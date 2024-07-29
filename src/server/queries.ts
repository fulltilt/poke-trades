"use server";

import { sql, count, like, and, eq } from "drizzle-orm";
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

export async function getUser(userId: string) {
  if (!userId) throw new Error("Invalid User");

  const res = await db
    .select()
    .from(user)
    .where(eq(user.authId, userId))
    .execute();

  return res[0];
}

export async function updateUsername(
  userId: string,
  username: string,
): Promise<{ success?: string; error?: string }> {
  if (!userId) throw new Error("Invalid User");

  try {
    const res = await db
      .update(user)
      .set({ username })
      .where(eq(user.authId, userId))
      .execute();
    console.log(res);
    return {
      success: "Updated username",
    };
  } catch (err) {
    console.log("err", err);
    return {
      error: "Username already exists",
    };
  }
}

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
  const res = await db.select().from(sets).where(eq(sets.id, id));
  return res[0];
}

export async function getAllCards(
  page: number,
  pageSize: number,
  search: string,
): Promise<{ totalCount: number; cards: Card[] }> {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }
  const countPrepared = db.select({ count: count() }).from(cards);
  const countData = await countPrepared.execute();

  const cardsPrepared = db
    .select()
    .from(cards)
    .where(sql`data->>'name' ILIKE ${sql.placeholder("search")}`)
    .orderBy(
      sql`data->'set'->>'releaseDate' DESC, CAST(DATA->>'number' AS INTEGER)`,
    )
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("offset"));

  const cardsData = await cardsPrepared.execute({
    search: `%${search}%`,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return Object.assign(
    {},
    {
      cards: cardsData.map((r) => r.data) as Card[],
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
    .orderBy(sql`CAST(DATA->>'number' AS INTEGER)`)
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("offset"));

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

export async function createList(user_id: string, name: string) {
  try {
    await db.insert(cardList).values({
      user_id,
      name,
      is_private: name === "Collection" ? true : false,
    });
    return {
      success: `Created list: ${name}`,
    };
  } catch (err) {
    console.log("err", err);
    return {
      error: "Error creating list",
    };
  }
}

export async function getCardList(
  user_id: string | null,
  listId: number,
  page: number,
  pageSize: number,
) {
  if (!user_id) return; // TODO: have message that user has to be signed in
  const countRes = await db
    .select({
      count: count(),
    })
    .from(cardList)
    .innerJoin(
      cardListItem,
      and(
        eq(cardList.user_id, user_id),
        eq(cardList.id, Number(listId)),
        eq(cardList.id, cardListItem.card_list_id),
      ),
    )
    .innerJoin(cards, eq(cardListItem.card_id, cards.id))
    .execute();
  // const countRes = await db
  //   .select({
  //     count: count(),
  //   })
  //   .from(cardListItem)
  //   .innerJoin(
  //     cards,
  //     and(
  //       eq(cardListItem.cardListId, Number(listId)),
  //       eq(cardListItem.cardId, cards.id),
  //     ),
  //   )
  // .innerJoin(cards, eq(cardListItem.cardId, cards.id))
  // .execute();

  const res = await db
    .select({
      userId: cardList.user_id,
      cardId: cardListItem.card_id,
      cardListId: cardList.id,
      name: cardList.name,
      quantity: cardListItem.quantity,
      data: cards.data,
    })
    .from(cardList)
    .innerJoin(
      cardListItem,
      and(
        eq(cardList.user_id, user_id),
        eq(cardList.id, Number(listId)),
        eq(cardList.id, cardListItem.card_list_id),
      ),
    )
    .innerJoin(cards, eq(cardListItem.card_id, cards.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .execute();

  return {
    totalCount: countRes[0]?.count ?? 0,
    data: res ?? [],
  };
}

export async function getUsersCardLists(userId: string) {
  const cardListRes = await db
    .select({
      cardListId: cardList.id,
      name: cardList.name,
      is_private: cardList.is_private,
    })
    .from(cardList)
    .where(and(eq(cardList.user_id, userId)))
    .execute();
  return cardListRes;
}

export async function updateCardList(
  userId: string,
  cardListId: number,
  cardId: string,
  difference: number,
) {
  if (!userId)
    return {
      error: "User not logged in",
    };
  // get CardListItems for User's particular CardList
  const cardListItemsRes = await db
    .select({
      cardListItemId: cardListItem.id,
      cardId: cardListItem.card_id,
      quantity: cardListItem.quantity,
    })
    .from(cardListItem)
    .where(eq(cardListItem.card_list_id, cardListId))
    .execute();

  // check if Card is in CardList
  const filteredList = cardListItemsRes.filter((el) => el.cardId === cardId);

  // if Card is not in CardList, add entry
  if (!filteredList.length) {
    try {
      await db
        .insert(cardListItem)
        .values({
          card_list_id: cardListId,
          card_id: cardId,
          quantity: 1,
        })
        .execute();
    } catch (err) {
      console.log("Error adding entry to CardListItem");
    }
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
}

export async function getCardQuantityByList(user_id: string, card_id: string) {
  // TODO: find a way to get all users lists that has a card id and if not, return it anyways with the default quantity of 0
  const res = await db.execute(sql`
    SELECT cl.id, cl.name, cli.card_id, cli.quantity
  FROM poketrades_card_list cl, poketrades_card_list_item cli
  WHERE cl.name != 'Wish List' AND
  cl.user_id = ${user_id} AND
  cl.id = cli.card_list_id AND
  cli.card_id = ${card_id}
    `);

  // const res2 = await db.execute(sql`
  // SELECT cl.id, cl.name, cli.card_id, coalesce(cli.quantity, 0) quantity
  // FROM poketrades_card_list cl
  // LEFT JOIN poketrades_card_list_item cli
  //   ON cl.id = cli.card_list_id
  // WHERE cl.name != 'Wish List' AND
  // cl.user_id = ${user_id} AND
  // (cli.card_id = ${card_id} OR cli.card_id IS NULL)`);
  // console.log(res2.rows);

  return res.rows;
}

export async function getTradeLists(userId: string) {
  const res = await db.execute(sql`
      SELECT DISTINCT cl.id 
      FROM poketrades_card_list cl, poketrades_card_list_item cli
      WHERE cl.is_private IS NOT TRUE AND 
      cl.name != 'Wish List' AND
      cl.user_id != ${userId} AND
      cli.card_id IN 
        (SELECT icli.card_id 
         FROM poketrades_card_list icl, poketrades_card_list_item icli
         WHERE icl.user_id = ${userId} AND 
         icl.name = 'Wish List' AND 
         icl.id = icli.card_list_id)
      `);
  console.log(res.rows);
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
