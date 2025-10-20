import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: false },
});

export default pool;
