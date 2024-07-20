// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Card, SSet, Trade, TradeObject } from "../queries";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `poketrades_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
// createdAt: timestamp("created_at", { withTimezone: true })
//   .default(sql`CURRENT_TIMESTAMP`)
//   .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date(),
//     ),
//   },
//   (example) => ({
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

export const sets = createTable("set", {
  id: varchar("id").primaryKey(),
  data: jsonb("data").$type<SSet>(),
});

export const cards = createTable("card", {
  id: varchar("id").primaryKey(),
  data: jsonb("data").$type<Card>(),
});

export const tradeObject = createTable("trade_object", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  price: numeric("price").notNull(),
});

export const tradeObjectList = createTable("trade_object_list", {
  id: serial("id").primaryKey(),
  tradeObjectId: integer("tradeObjectId").references(() => tradeObject.id),
});

export const trade = createTable("trade", {
  id: serial("id").primaryKey(),
  user: varchar("user").notNull(),
  partner: varchar("partner").notNull(),
  completed: boolean("completed").notNull(),
  haves: integer("haves").references(() => tradeObjectList.id),
  wants: integer("wants").references(() => tradeObjectList.id),
});

export const cardList = createTable("card_list", {
  id: serial("id").primaryKey(),
  user: varchar("user")
    .notNull()
    .references((): AnyPgColumn => user.id),
  listName: varchar("listName").notNull(),
  cards: varchar("cards").references(() => cards.id),
});

export const tradeList = createTable("trade_list", {
  id: serial("id").primaryKey(),
  user1List: integer("user1List").references(() => tradeObjectList.id),
  user2List: integer("user2List").references(() => tradeObjectList.id),
});

export const user = createTable("user", {
  id: serial("id").primaryKey(),
  authId: varchar("authId").notNull(),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  cardLists: integer("cardLists").references(() => cardList.id),
  trades: integer("trades").references(() => tradeList.id),
});
