import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // url: env.POSTGRES_URL,
    url: "postgres://postgres:postgres@localhost:5432/poketrades",
  },
  tablesFilter: ["poketrades_*"],
} satisfies Config;
