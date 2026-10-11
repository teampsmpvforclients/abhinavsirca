# Contributing

Start with [INSTRUCTIONS.md](INSTRUCTIONS.md). Discuss substantial changes in an issue before implementation. Create a branch from current `main`, make a focused change, and open a pull request using the supplied template.

Follow the existing JavaScript/React style. Preserve existing course paths and unique IDs in `data/catalog.json`. Verify factual course claims with the academy. Include a meaningful regression test for changed API or data behavior; documentation-only changes need no new tests.

Before requesting review run `npm test`, `npm run build`, `npx wrangler deploy --dry-run`, `npm run db:local` and `node scripts/verify-worker.mjs` with disposable local state. Check keyboard navigation and narrow-screen behavior for UI changes. Explain behavior, validation and any database migration in the PR. Do not include credentials or learner data.

Create additive D1 migrations with `npx wrangler d1 migrations create DB descriptive_name`. Never edit an already applied migration. Coordinate destructive schema changes separately and take a database backup before production migration. Maintainers review and merge; merges to `main` trigger production deployment.
