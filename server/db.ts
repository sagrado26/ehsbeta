import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

// Lazy-initialize the database only when USE_DATABASE=true.
// This avoids loading the native better-sqlite3 bindings when running
// in environments that don't support them (e.g. serverless sandboxes).
let _db: BetterSQLite3Database<typeof schema> | null = null;

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (!_db) {
    // Dynamic require so the native module is only loaded on demand
    const { drizzle } = require("drizzle-orm/better-sqlite3") as typeof import("drizzle-orm/better-sqlite3");
    const Database = require("better-sqlite3") as typeof import("better-sqlite3").default;
    const dbPath = process.env.NODE_ENV === "production" ? "/tmp/database.db" : "./database.db";
    const sqlite = new Database(dbPath);
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

// For backwards-compat: export db as null — callers that truly need it
// should use getDb() (DatabaseStorage) or guard on USE_DATABASE.
export const db: BetterSQLite3Database<typeof schema> | null =
  process.env.USE_DATABASE === "true" ? getDb() : null;
