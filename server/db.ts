// Database handle placeholder.
// In this environment we use MemStorage (in-memory) which does not require
// any external database driver.  The db export is kept as null so that
// DatabaseStorage (which is only instantiated when USE_DATABASE=true) has a
// reference it can use — but in practice it is never called here.
export const db: any = null;
