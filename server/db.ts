// This module provides a database stub.
// The application uses MemStorage (in-memory) by default.
// No external database driver is loaded.
console.log("[v0] db.ts loaded — using in-memory storage, no SQLite driver");

export const db: any = null;

export function getDb(): any {
  return null;
}
