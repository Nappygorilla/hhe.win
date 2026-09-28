import pg from "pg";

const { Pool } = pg;

let pool;

export function getPool() {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) {
    return null;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  });

  return pool;
}

export async function checkDatabase() {
  const client = getPool();
  if (!client) return { configured: false, connected: false };

  try {
    await client.query("SELECT 1");
    return { configured: true, connected: true };
  } catch {
    return { configured: true, connected: false };
  }
}
