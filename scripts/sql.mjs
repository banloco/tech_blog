#!/usr/bin/env node
/**
 * Run SQL directly against the Supabase database (migrations, checks, admin fixes).
 *
 *   node scripts/sql.mjs supabase/some-file.sql     run a file (in one transaction if it has BEGIN/COMMIT)
 *   node scripts/sql.mjs -e "select count(*) from posts"
 *
 * Needs DATABASE_URL in the environment or in .env.local (never commit it): the "Session pooler"
 * connection string from Supabase (Connect button), or POSTGRES_URL from the Vercel project.
 * The pooler works over IPv4, unlike the direct connection (db.<ref>.supabase.co is IPv6 only).
 */
import { readFileSync, existsSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
}
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("DATABASE_URL missing (add it to .env.local)");
  process.exit(1);
}

const [flag, value] = process.argv.slice(2);
const sql = flag === "-e" ? value : flag ? readFileSync(flag, "utf8") : null;
if (!sql) {
  console.error('Usage: node scripts/sql.mjs file.sql | -e "SQL"');
  process.exit(1);
}

// Supabase's certificate chain isn't in Node's default store: encrypted, but not verified
const client = new pg.Client({ connectionString: connectionString.replace(/[?&]sslmode=[^&]*/, ""), ssl: { rejectUnauthorized: false } });
try {
  await client.connect();
  const results = [].concat(await client.query(sql));
  for (const r of results) {
    if (r.rows?.length) console.table(r.rows);
    else if (r.command) console.log(`${r.command}${r.rowCount != null ? ` ${r.rowCount}` : ""}`);
  }
} catch (e) {
  console.error("SQL error:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
