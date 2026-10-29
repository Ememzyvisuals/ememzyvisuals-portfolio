import "server-only";
import { createClient, type Client } from "@libsql/client";

// Turso (libSQL). Configured only through env: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.
// Without them the site still works; blog posts come from content/blog and the admin shows setup steps.
let client: Client | null | undefined;
let migrated = false;

export function dbConfigured() {
  return !!process.env.TURSO_DATABASE_URL;
}

export async function db(): Promise<Client | null> {
  if (client === undefined) {
    client = dbConfigured()
      ? createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN })
      : null;
  }
  if (client && !migrated) {
    await client.batch(
      [
        `create table if not exists posts (
          slug text primary key, title text not null, excerpt text not null default '',
          body text not null, cover text, tags text not null default '[]',
          date text not null, published integer not null default 1,
          created_at text not null default (datetime('now')), updated_at text not null default (datetime('now')))`,
        `create table if not exists messages (
          id integer primary key autoincrement, name text not null, email text not null,
          message text not null, created_at text not null default (datetime('now')), read integer not null default 0)`,
        `create table if not exists login_attempts (ip text not null, at integer not null)`,
      ],
      "write",
    );
    migrated = true;
  }
  return client;
}
