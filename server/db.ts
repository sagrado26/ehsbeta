// Database handle placeholder.
// In this environment we use MemStorage (in-memory) which does not require
// any external database driver.
export const db: any = null;

// Kept for backward compatibility with imports that reference getDb.
export function getDb() {
  return null;
}
