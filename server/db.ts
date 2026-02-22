import * as schema from "@shared/schema";

// In the v0 sandbox, native modules like better-sqlite3 cannot be compiled.
// The application defaults to MemStorage (in-memory) which does not need a
// database handle at all.  We only attempt to load the native driver when
// USE_DATABASE is explicitly set to "true" — which should only happen in
// environments where better-sqlite3's native bindings are available.

let _db: any = null;

export function getDb() {
  if (!_db) {
    try {
      const { drizzle } = require("drizzle-orm/better-sqlite3");
      const Database = require("better-sqlite3");
      const dbPath =
        process.env.NODE_ENV === "production"
          ? "/tmp/database.db"
          : "./database.db";
      const sqlite = new Database(dbPath);
      _db = drizzle(sqlite, { schema });
    } catch (err) {
      console.error(
        "Failed to load better-sqlite3 native bindings. Falling back to in-memory storage.",
        (err as Error).message
      );
      _db = null;
    }
  }
  return _db;
}

// Only eagerly initialise when USE_DATABASE is true.
// When false / unset the app uses MemStorage so db is never touched.
export const db: any =
  process.env.USE_DATABASE === "true" ? getDb() : null;
