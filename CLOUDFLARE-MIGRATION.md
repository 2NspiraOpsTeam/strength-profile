# Cloudflare migration — 2026-11-09

This assessment exports static HTML/JS/CSS with Next.js; Cloudflare Workers
Static Assets serves `out/` with no server functions or paid add-ons.
No database, personal answers or local-development env files are uploaded.

`npm ci`, `npm run build`, `npm audit --omit=dev`, then `npx wrangler deploy`
from the reviewed merged commit. No Git-triggered Cloudflare build is configured
by this change. The Next 14 build dependency was updated to patched Next 15;
compatible patched CSS/source-map dependencies are pinned via overrides.

The existing custom hostname is retained, so browser-local answers remain on
the same origin. Existing Vercel deployments stay available for rollback. Before
custom-domain attachment, record the existing DNS target; restoring it reverts
the hostname to Vercel without changing any assessment answers.

Source base is GitHub main, matching current Vercel content. Uncommitted local
SEO/security/copy changes are intentionally excluded from this hosting migration.
