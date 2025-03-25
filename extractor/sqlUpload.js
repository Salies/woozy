import { createClient } from "@libsql/client";
import { config } from "./config.js";

const client = createClient({
    url: "file:local.db",
    syncUrl: config.turso.syncUrl,
    authToken: config.turso.authToken,
});

const result = await client.execute("INSERT INTO players VALUES (1, 'John', 'Doe', 1, 1)");

console.log(result);