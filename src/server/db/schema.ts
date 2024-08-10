// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { Card, SSet } from "~/app/types";
import type { AdapterAccountType } from "next-auth/adapters";

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

// export const user = createTable("user", {
//   id: serial("id").primaryKey(),
//   auth_id: varchar("auth_id").unique().notNull(),
//   username: varchar("username").unique(),
//   email: varchar("email").notNull(),
//   completed_trades: integer("completed_trades").default(0),
//   is_premium: boolean("is_premium").default(false),
//   createdAt: timestamp("created_at", { withTimezone: true })
//     .default(sql`CURRENT_TIMESTAMP`)
//     .notNull(),
// });

export const cardList = createTable("card_list", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => user.id),
  is_private: boolean("is_private").default(false),
  is_sub_list: boolean("is_sub_list").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const cardListItem = createTable("card_list_item", {
  id: serial("id").primaryKey(),
  card_list_id: integer("card_list_id").references(() => cardList.id),
  card_id: varchar("card_id").references(() => cards.id),
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

export const trade = createTable("trade", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id")
    .references(() => user.id)
    .notNull(),
  other_user_id: varchar("other_user_id")
    .references(() => user.id)
    .notNull(),
  card_list_id: integer("card_list_id").references(() => cardList.id),
  other_user_card_list_id: integer("other_user_card_list_id").references(
    () => cardList.id,
  ),
  user_sub_card_list_id: integer("user_sub_card_list_id").references(
    () => cardList.id,
  ),
  other_user_sub_card_list_id: integer(
    "other_user_sub_card_list_id",
  ).references(() => cardList.id),
  username: varchar("username").references(() => user.name),
  other_user_name: varchar("other_user_name").references(() => user.name),
  user_status: integer("user_status")
    .references(() => statusType.id)
    .default(2),
  other_user_status: integer("other_user_status")
    .references(() => statusType.id)
    .default(2),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const statusType = createTable("status_type", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const notification = createTable("notification", {
  id: serial("id").primaryKey(),
  sender_id: varchar("sender_id")
    .notNull()
    .references(() => user.id),
  recipient_id: varchar("recipient_id")
    .notNull()
    .references(() => user.id),
  message: varchar("message").notNull(),
  viewed: boolean("viewed").default(false),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const user = createTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"), // otiginal field I'm keeping in case Auth.js looks for it. Will use 'username' field instead
  username: text("username").unique(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  completed_trades: integer("completed_trades").default(0),
  is_premium: boolean("is_premium").default(false),
  image: text("image"),
});

export const accounts = createTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = createTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = createTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
