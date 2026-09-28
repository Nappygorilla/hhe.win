import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(here, "../schema.sql");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for migrations.");
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

try {
  await client.connect();
  const schema = await fs.readFile(schemaPath, "utf8");
  await client.query(schema);
  console.log("Luna database schema is ready.");
} finally {
  await client.end().catch(() => {});
}
