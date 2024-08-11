"use server";

import { sql, count, like, and, eq, ne, or, inArray, lt } from "drizzle-orm";
import { db } from "./db";
import {
  sets,
  cards,
  user,
  cardList,
  cardListItem,
  trade,
  notification,
  verificationTokens,
} from "./db/schema";
import type { Card, SSet } from "~/app/types";

// Auth.js
export async function updateUsername(
  userId: string,
  username: string,
): Promise<{ success?: string; error?: string }> {
  if (!userId) throw new Error("Invalid User");

  try {
    // const usernamePrepared = db
    //   .update(user)
    //   .set({ username: sql.placeholder("username") })
    //   .where(eq(user.auth_id, userId));
    // await usernamePrepared.execute({ username: `${username}` });
    await db
      .update(user)
      .set({ username })
      .where(eq(user.id, userId))
      .execute();

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

export async function getUser(userId: string) {
  if (!userId) throw new Error("Invalid User");

  const res = await db.select().from(user).where(eq(user.id, userId)).execute();

  return res[0];
}

export async function getUserId(username: string) {
  const res = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, username))
    .execute();

  return res[0];
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
  const setPrepared = db
    .select()
    .from(sets)
    .where(eq(sets.id, sql.placeholder("id")));

  const res = await setPrepared.execute({ id });

  return res[0];
}
// /Auth.js

export async function getAllCards(
  page: number,
  pageSize: number,
  search: string,
  orderBy: string,
): Promise<{ totalCount: number; cards: Card[] }> {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }
  // const cardsPrepared = db
  //     .select({
  //       id: cards.id,
  //       data: cards.data,
  //       price: sql`jsonb_path_query(data, '$.tcgplayer.prices.*.market')`.as(
  //         "price",
  //       ),
  //     })
  //     .from(cards)
  //     .where(sql`data->>'name' ILIKE ${sql.placeholder("search")}`)
  //     .groupBy(cards.id)
  //     // .orderBy(sql`price ${sql.placeholder("order")}`)
  //     // .orderBy(({ price }) => price)
  //     .limit(sql.placeholder("limit"))
  //     .offset(sql.placeholder("offset"));

  //   cardsData = await cardsPrepared.execute({
  //     search: `%${search}%`,
  //     limit: pageSize,
  //     offset: (page - 1) * pageSize,
  //     order: orderBy.includes("DESC") ? "DESC" : "ASC",
  //   });

  const countPrepared = db
    .select({ count: count() })
    .from(cards)
    .where(
      search.length
        ? sql`data->>'name' ILIKE ${sql.placeholder("search")}`
        : undefined,
    );
  const countData = await countPrepared.execute({ search: `%${search}%` });

  let cardsData: {
    id: string;
    data: Card | null;
    price?: number;
  }[];
  if (orderBy.includes("price")) {
    // console.log(
    //   await db.execute(
    //     sql`SELECT * FROM poketrades_user WHERE username ILIKE '%' || ${search} || '%'`,
    //   ),
    // );
    // console.log(
    //   db.execute(sql`
    //   SELECT id, data, price
    //   FROM (
    //     SELECT distinct on (id) id, data, jsonb_path_query(data, '$.tcgplayer.prices.*.market') AS price
    //     FROM ${cards}
    //     WHERE DATA->>'name' ILIKE '%${search}%'
    //   )
    //   ORDER BY price ${orderBy.includes("DESC") ? "DESC" : "ASC"}
    //   LIMIT ${pageSize}
    //   OFFSET ${(page - 1) * pageSize}
    // `),
    // );
    const cardsRes = await db.execute(sql`
      SELECT id, data, price 
      FROM (
        SELECT distinct on (id) id, data, jsonb_path_query(data, '$.tcgplayer.prices.*.market') AS price
        FROM ${cards}
        WHERE DATA->>'name' ILIKE '%' || ${search} || '%'
      )
      ORDER BY price ${sql.raw(orderBy.includes("DESC") ? "DESC" : "ASC")} 
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `);

    cardsData = cardsRes.rows as {
      id: string;
      data: Card | null;
      price?: number;
    }[];
  } else {
    const cardsPrepared = db
      .select()
      .from(cards)
      .where(
        search.length
          ? sql`data->>'name' ILIKE ${sql.placeholder("search")}`
          : undefined,
      )
      .orderBy(
        sql`data->'set'->>'releaseDate' DESC, CAST(DATA->>'number' AS INTEGER)`,
      )
      .limit(sql.placeholder("limit"))
      .offset(sql.placeholder("offset"));

    cardsData = await cardsPrepared.execute({
      search: `%${search}%`,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  return Object.assign(
    {},
    {
      cards: cardsData.map((r) => r.data) as Card[],
    },
    { totalCount: countData[0]?.count ?? 0 },
  );
}

export async function getCardsInSet(
  id: string,
  page: number,
  pageSize: number,
  search: string,
  orderBy: string,
) {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }

  // The count should be the same for both queries
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

  let cardsData: {
    id: string;
    data: Card | null;
    price?: number;
  }[];
  if (orderBy.includes("price")) {
    // const subquery = db
    //   .select({
    //     id: cards.id,
    //     data: cards.data,
    //     price: sql`jsonb_path_query(data, '$.tcgplayer.prices.*.market') AS price`,
    //   })
    //   .from(cards)
    //   .where(
    //     and(
    //       id.length ? like(cards.id, sql.placeholder("searchterm")) : undefined,
    //       search.length
    //         ? sql`DATA->>'name' ILIKE ${sql.placeholder("search")}`
    //         : undefined,
    //     ),
    //   )
    //   .as("subquery");

    // Error: You tried to reference "price" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.
    // cardsData = await db
    //   .select({
    //     id: subquery.id,
    //     data: subquery.data,
    //     price: subquery.price,
    //   })
    //   .from(subquery)
    //   .orderBy(sql`price DESC`)
    //   .limit(sql.placeholder("limit"))
    //   .offset(sql.placeholder("offset"))
    //   .execute({
    //     search: `%${search}%`,
    //     searchterm: id.length ? `${id}-%` : "",
    //     limit: pageSize,
    //     offset: (page - 1) * pageSize,
    //   });

    const cards = await db.execute(sql`
      SELECT id, data, price 
      FROM (
        SELECT distinct on (id) id, data, jsonb_path_query(data, '$.tcgplayer.prices.*.market') AS price
        FROM poketrades_card
        WHERE poketrades_card.id ILIKE '%' || ${id} || '%' AND
              DATA->>'name' ILIKE '%' || ${search} || '%'
      )
      ORDER BY price ${sql.raw(orderBy.includes("DESC") ? "DESC" : "ASC")} 
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `);
    cardsData = cards.rows as {
      id: string;
      data: Card | null;
      price?: number;
    }[];
  } else {
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

    cardsData = await cardsPrepared.execute({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      searchterm: id.length ? `${id}-%` : "",
      search: `%${search}%`,
    });
  }

  return Object.assign(
    {},
    {
      cards: cardsData.map((r) => {
        if (r?.price) {
          return Object.assign({}, r.data, { price: r.price });
        }
        return r.data;
      }),
    },
    { totalCount: countData[0]?.count },
  );
}

export async function createUser(auth_id: string, email: string) {
  await db.insert(user).values({ id: auth_id, email });

  // const cardsData = await cardsPrepared.execute({
  //   search: `%${search}%`,
  //   limit: pageSize,
  //   offset: (page - 1) * pageSize,
  // });
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

  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }

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
    // .orderBy(
    //   sql`data->'set'->>'releaseDate' DESC, CAST(DATA->>'number' AS INTEGER)`,
    // )
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

// Get Card Lists that belong to a particular User
// Used in Dashboard
export async function getUsersCardLists(userId: string) {
  const cardListRes = await db
    .select({
      cardListId: cardList.id,
      name: cardList.name,
      is_private: cardList.is_private,
      is_sub_list: cardList.is_sub_list,
    })
    .from(cardList)
    .where(and(eq(cardList.user_id, userId)))
    .execute();
  return cardListRes;
}

// Get Card data given a list of Card ids
// Used in trade/[id] page
export async function getCardsInList(
  card_list: string[],
  page = 1,
  pageSize = 30,
) {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }

  const countData = await db
    .select({
      count: count(),
    })
    .from(cards)
    .where(inArray(cards.id, card_list))
    .execute();

  const res = await db
    .select()
    .from(cards)
    .where(inArray(cards.id, card_list))
    .orderBy(
      sql`data->'set'->>'releaseDate' DESC, CAST(DATA->>'number' AS INTEGER)`,
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .execute();

  return Object.assign(
    {},
    { cards: res.map((r) => r.data) },
    { totalCount: countData[0]?.count ?? 0 },
  );
}

// Given a Card List id, return all Card data associated with that list
// Used in Trade page to retrieve sub card lists for actual trade
export async function getCardsInCardList(
  card_list_id: number,
  page: number,
  pageSize: number,
  search: string,
  set_id?: string,
) {
  if (![30, 60, 90, 120].includes(Number(pageSize))) {
    pageSize = 30;
    page = 1;
  }

  const countPrepared = db
    .select({ count: count() })
    .from(cardListItem)
    .innerJoin(
      cards,
      and(
        eq(cardListItem.card_list_id, card_list_id),
        eq(cardListItem.card_id, cards.id),
        set_id ? like(cards.id, sql.placeholder("set_id")) : undefined,
        search !== ""
          ? sql`DATA->>'name' ILIKE ${sql.placeholder("search")}`
          : undefined,
      ),
    );
  const countData = await countPrepared.execute({
    set_id: `${set_id}-%`,
    search: `%${search}%,`,
  });

  const cardsPrepared = db
    .select({ data: cards.data })
    .from(cardListItem)
    .innerJoin(
      cards,
      and(
        eq(cardListItem.card_list_id, card_list_id),
        eq(cardListItem.card_id, cards.id),
        set_id ? like(cards.id, sql.placeholder("set_id")) : undefined,
        search !== ""
          ? sql`DATA->>'name' ILIKE ${sql.placeholder("search")}`
          : undefined,
      ),
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const res = await cardsPrepared.execute({
    set_id: `${set_id}-%`,
    search: `%${search}%`,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return Object.assign(
    {},
    { cards: res.map((r) => r.data) },
    { totalCount: countData[0]?.count ?? 0 },
  );
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

  // const res = await db.execute(sql`
  //   SELECT cl.id, cl.name, cli.card_id, cli.quantity
  // FROM poketrades_card_list cl, poketrades_card_list_item cli
  // WHERE cl.name != 'Wish List' AND
  // cl.user_id = ${user_id} AND
  // cl.id = cli.card_list_id AND
  // cli.card_id = ${card_id}
  //   `);

  const res = await db
    .select({
      id: cardList.id,
      card_id: cardListItem.card_id,
      quantity: cardListItem.quantity,
      name: cardList.name,
      is_sub_list: cardList.is_sub_list,
    })
    .from(cardList)
    .innerJoin(
      cardListItem,
      and(
        ne(cardList.name, "Wish List"),
        eq(cardList.user_id, user_id),
        eq(cardList.id, cardListItem.card_list_id),
        eq(cardListItem.card_id, card_id),
      ),
    )
    .execute();

  // const res2 = await db.execute(sql`
  // SELECT cl.id, cl.name, cli.card_id, coalesce(cli.quantity, 0) quantity
  // FROM poketrades_card_list cl
  // LEFT JOIN poketrades_card_list_item cli
  //   ON cl.id = cli.card_list_id
  // WHERE cl.name != 'Wish List' AND
  // cl.user_id = ${user_id} AND
  // (cli.card_id = ${card_id} OR cli.card_id IS NULL)`);
  // console.log(res2.rows);

  return res;
}

// Find all other Users Cards that are in their public Trade Lists that contain Cards in Users Wish List
export async function getTradeLists(user_id: string) {
  const res = await db.execute(sql`
  SELECT DISTINCT 
    cl.id as card_list_id, cl.name, cli.card_id, u.id as user_id, u.username
  FROM 
    poketrades_card_list cl, poketrades_card_list_item cli, poketrades_user u
  WHERE 
    u.id = cl.user_id AND
    cl.is_private IS NOT TRUE AND
    cl.name != 'Wish List' AND
    cl.user_id != ${user_id} AND
    cl.id = cli.card_list_id AND
    cl.is_sub_list IS NOT TRUE AND
    cli.card_id IN
      (SELECT 
        icli.card_id
       FROM 
        poketrades_card_list icl, poketrades_card_list_item icli
       WHERE 
        icl.user_id = ${user_id} AND
        icl.name = 'Wish List' AND
        icl.id = icli.card_list_id)
  `);
  return res.rows;

  // const subquery = db
  //   .select({ id: cardListItem.card_id })
  //   .from(cardList)
  //   .innerJoin(
  //     cardListItem,
  //     and(
  //       eq(cardList.user_id, user_id),
  //       eq(cardList.name, "Wish List"),
  //       eq(cardList.id, cardListItem.card_list_id),
  //     ),
  //   )
  //   .as("subquery");

  // const res = await db
  //   .selectDistinctOn([cardList.id], {
  //     id: cardList.id,
  //     name: cardList.name,
  //     username: user.username,
  //   })
  //   .from(cardList)
  //   .innerJoin(user, eq(user.auth_id, cardList.user_id))
  //   .innerJoin(
  //     cardListItem,
  //     and(
  //       ne(cardList.name, "Wish List"),
  //       eq(cardList.user_id, user_id),
  //       isNotNull(cardList.is_private),
  //       inArray(cardListItem.card_id, subquery),
  //     ),
  //   )
  //   .execute();
  // console.log(res);
}

export async function getPublicCardLists(user_id: string) {
  return await db
    .select()
    .from(cardList)
    .where(
      and(
        eq(cardList.user_id, user_id),
        eq(cardList.is_private, false),
        ne(cardList.name, "Wish List"),
        ne(cardList.is_sub_list, true),
      ),
    )
    .execute();
}

export async function getTradeListCards(
  card_list_id: number,
  other_user_card_list_id: number,
) {
  return await db
    .select({
      card_list_id: cardListItem.card_list_id,
      card_id: cardListItem.card_id,
    })
    .from(cardListItem)
    .where(
      inArray(cardListItem.card_list_id, [
        card_list_id,
        other_user_card_list_id,
      ]),
    )
    .execute();
}

export async function createTrade(
  user_id: string,
  other_user_id: string,
  card_list_id: number,
  other_user_card_list_id: number,
  username: string,
  other_user_name: string,
) {
  /*
    Transaction:
    Create new trade
    Create two new card lists and update trade with the card list ids
  */
  await db.transaction(async (tx) => {
    const [td] = await tx
      .insert(trade)
      .values({
        user_id,
        other_user_id,
        card_list_id,
        other_user_card_list_id,
        username,
        other_user_name,
      })
      .returning();

    const [l1] = await tx
      .insert(cardList)
      .values({
        user_id,
        name: `${username}-${td?.id}`,
        is_private: false,
        is_sub_list: true,
      })
      .returning();

    const [l2] = await tx
      .insert(cardList)
      .values({
        user_id: other_user_id,
        name: `${other_user_name}-${td?.id}`,
        is_private: false,
        is_sub_list: true,
      })
      .returning();

    const [td2] = await tx
      .update(trade)
      .set({
        user_sub_card_list_id: l1?.id,
        other_user_sub_card_list_id: l2?.id,
      })
      .where(eq(trade.id, td?.id ?? 0))
      .returning();

    return td2;
  });
}

export async function getTrade(trade_id: number) {
  const res = await db
    .select()
    .from(trade)
    .where(eq(trade.id, trade_id))
    .execute();
  return res;
}

// get trades involving a particular user
// NOTE: will probably have to add another WHERE condition for trades that aren't completed
export async function getTrades(user_id: string) {
  const res = await db
    .select()
    .from(trade)
    .where(or(eq(trade.user_id, user_id), eq(trade.other_user_id, user_id)))
    .execute();
  return res;
}

// get a more specific trade
export async function searchTrades(
  user_id: string,
  other_user_id: string,
  card_list_id: number,
  other_user_card_list_id: number,
) {
  const res = await db
    .select()
    .from(trade)
    .where(
      and(
        eq(trade.user_id, user_id),
        eq(trade.other_user_id, other_user_id),
        eq(trade.card_list_id, card_list_id),
        eq(trade.other_user_card_list_id, other_user_card_list_id),
      ),
    )
    .execute();
  return res;
}

export async function updateTradeStatus(
  trade_id: number,
  tableField: string,
  status: number,
) {
  try {
    const res = await db
      .update(trade)
      .set({
        [tableField]: status,
      })
      .where(eq(trade.id, trade_id))
      .returning()
      .execute();
    const newStatus = res[0]?.user_status;
    let message = "";
    if (newStatus === 3) {
      message =
        "Status is now Pending. You will be unable to change the lists unless you set status to In Progress";
    } else {
      message = "Status updated";
    }
    return { success: message };
  } catch (err) {
    console.log(err);
    return { error: "Error updating Trade status" };
  }
}

export async function getCompletedTrades(user_id: string) {
  try {
    const res = await db
      .select({ count: count() })
      .from(trade)
      .where(
        and(
          or(eq(trade.user_id, user_id), eq(trade.other_user_id, user_id)),
          eq(trade.user_status, 4),
          eq(trade.other_user_status, 4),
        ),
      )
      .execute();

    return { data: res[0]?.count };
  } catch {
    return { error: "Error retrieving number of completed trades" };
  }
}

export async function getNotifications(user_id: string) {
  try {
    const res = await db
      .select()
      .from(notification)
      .where(
        and(
          eq(notification.recipient_id, user_id),
          // eq(notification.viewed, false),
        ),
      )
      .execute();
    return { data: res };
  } catch (err) {
    return { error: "Error retrieving notifications" };
  }
}

export async function markNotificationAsRead(id: number) {
  try {
    await db
      .update(notification)
      .set({ viewed: true })
      .where(eq(notification.id, id))
      .execute();
    return { data: "Successfully updated notification" };
  } catch (err) {
    return { error: "Error updating notification" };
  }
}

export async function deleteNotification(id: number) {
  try {
    await db.delete(notification).where(eq(notification.id, id)).execute();
    return { data: "Successfully deleted notification" };
  } catch (err) {
    return { error: "Error deleting notification" };
  }
}

export async function clearStaleTokens() {
  try {
    await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, sql`CURRENT_TIMESTAMP`));
  } catch (error) {
    throw error;
  }
}

export async function checkForExistingGoogleAccount(uuid: string) {
  try {
    const res = await db.execute(
      sql`SELECT EXISTS (SELECT 1 FROM accounts WHERE provider = 'google' AND \"userId\" = ${uuid})`,
    );
    return res.rows;
  } catch (err) {
    throw err;
  }
}

export async function unlinkAccount(provider: string, uuid: string) {
  try {
    await db.execute(
      sql`DELETE FROM accounts WHERE provider = '${provider}' AND \"userId\" = ${uuid}`,
    );
  } catch (err) {
    console.error(`Failed to unlink ${provider} account:`, err);
  }
}

export async function seedData() {
  // const dat = [];
  // await db.insert(cards).values(
  //   dat.map((d: any) => ({
  //     id: sql`${d.id}::text`,
  //     data: sql`${d}::jsonb`,
  //   })),
  // );
}
