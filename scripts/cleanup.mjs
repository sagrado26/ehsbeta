import fs from 'fs';
import path from 'path';

// Remove stale better-sqlite3 from node_modules
const paths = [
  '/vercel/share/v0-project/node_modules/.pnpm/better-sqlite3@12.6.2',
  '/vercel/share/v0-project/node_modules/better-sqlite3',
  '/vercel/share/v0-project/node_modules/.pnpm/bindings@1.5.0',
];

for (const p of paths) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`Removed: ${p}`);
    } else {
      console.log(`Not found (already clean): ${p}`);
    }
  } catch (err) {
    console.log(`Could not remove ${p}: ${err.message}`);
  }
}

console.log('Cleanup complete');
