import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: process.env.SQL_HOST,
  database: "fjbc_activity",
  password: "8ff-1K=jMTot7z",
  port: 5432
});

export default pool;
