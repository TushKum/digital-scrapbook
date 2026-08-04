// Post-build static prerender. NON-FATAL by design: any failure here logs and
// exits 0 so it can never break the Vercel build — a failed prerender just
// leaves those routes to the client-rendered SPA fallback.
//
// It uses Vite's SSR module loader to render the static public pages
// (src/prerender.tsx) to HTML and writes dist/<route>/index.html. Vercel's
// filesystem handler then serves that real HTML before the SPA rewrite.
import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DIST = 'dist';

let template;
try {
  template = await readFile(join(DIST, 'index.html'), 'utf-8');
} catch {
  console.warn('[prerender] dist/index.html not found — skipping prerender');
  process.exit(0);
}

let vite;
try {
  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'warn' });
  const mod = await vite.ssrLoadModule('/src/prerender.tsx');
  for (const route of mod.PRERENDER_ROUTES) {
    try {
      const html = mod.renderRoute(route);
      if (!html) continue;
      const doc = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
      const out = join(DIST, route, 'index.html');
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, doc, 'utf-8');
      console.log(`[prerender] ${route} -> ${out} (${html.length} bytes)`);
    } catch (err) {
      console.warn(`[prerender] skipped ${route}:`, err?.message ?? err);
    }
  }
} catch (err) {
  console.warn('[prerender] disabled:', err?.message ?? err);
} finally {
  if (vite) await vite.close();
}

process.exit(0);
