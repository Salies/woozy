import { createClient } from "@libsql/client";

if (!process.env.WOOZY_TURSO_DATABASE_URL || !process.env.WOOZY_TURSO_AUTH_TOKEN) {
  throw new Error("WOOZY_TURSO_DATABASE_URL and WOOZY_TURSO_AUTH_TOKEN are required");
}

export const turso = createClient({
  url: process.env.WOOZY_TURSO_DATABASE_URL,
  authToken: process.env.WOOZY_TURSO_AUTH_TOKEN,
});