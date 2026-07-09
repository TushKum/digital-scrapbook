// Runs after every `npm install`.
//  - Always regenerate the Prisma client (needed by the app + the API bundle).
//  - On Vercel ONLY, build the serverless API bundle (api/index.js) from source
//    during the install phase — the earliest point, so it exists before Vercel's
//    builders resolve `api/index.js`. This is why api/index.js is gitignored: it
//    is a build artifact, always regenerated from source, never committed.
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('prisma generate');

if (process.env.VERCEL) {
  run('npm run build:api');
}
