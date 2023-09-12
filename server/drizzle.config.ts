import { Config } from "drizzle-kit";

export default {
  schema: "./database/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./database/database.db",
  },
} satisfies Config;
