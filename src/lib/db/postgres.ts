import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : null;

export async function query<T = unknown>(text: string, params?: unknown[]) {
  if (!pool) {
    throw new Error("Database connection is not configured.");
  }

  const result = await pool.query(text, params);
  return result.rows as T[];
}
