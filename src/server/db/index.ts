import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema });

import { Pool } from "pg";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";

// export const db = drizzleNode(
//   new Pool({ connectionString: process.env.POSTGRES_URL }),
//   { schema },
// );
