// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Card, SSet } from "../queries";

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

export const tradeItem = createTable("trade_item", {
  id: serial("id").primaryKey(),
  data: jsonb("data"),
});

export const trade = createTable("trade", {
  id: serial("id").primaryKey(),
  userId: integer("user")
    .references(() => user.id)
    .notNull(),
  cardListId: integer("cardListId").references(() => cardList.id),
  otherPartyCardListId: integer("otherPartyCardListId").references(
    () => cardList.id,
  ),
  status: integer("status")
    .references(() => statusType.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const statusType = createTable("status_type", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const user = createTable("user", {
  id: serial("id").primaryKey(),
  authId: varchar("authId").unique().notNull(),
  username: varchar("username").unique(),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cardList = createTable("card_list", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  userId: varchar("userId")
    .notNull()
    .references(() => user.authId),
  isPrivate: boolean("isPrivate").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cardListItem = createTable("card_list_item", {
  id: serial("id").primaryKey(),
  cardListId: integer("cardListId").references(() => cardList.id),
  cardId: varchar("cardId").references(() => cards.id),
  tradeItemId: integer("tradeItemId").references(() => tradeItem.id),
  entityType: integer("entityType")
    .default(1)
    .references(() => entityType.id),
  quantity: integer("quantity").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const entityType = createTable("entity_type", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
});
