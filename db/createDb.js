import { createClient } from "@libsql/client";
import { readFile } from "fs/promises";

const turso = createClient({
    url: "file:data/local.db",
});

// read db/schema.sql
const schema = await readFile("db/schema.sql", "utf8");

// split statements by semicolon and execute each one
const statements = schema
  .split(";")
  .map(s => s.trim())
  .filter(s => s.length > 0); // remove empty statements

for (const stmt of statements) {
  await turso.execute(stmt);
}

console.log("Tables created.");
