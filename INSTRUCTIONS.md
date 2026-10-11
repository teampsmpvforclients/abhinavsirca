# Beginner developer instructions

## 1. Install tools and download the project

Install Git and Node.js 24 LTS (includes npm). Check `git --version`, `node --version` and `npm --version` in your terminal. Use VS Code or another editor.

```sh
git clone https://github.com/teampsmpvforclients/abhinavsirca.git
cd abhinavsirca
npm ci
npm run dev
```

Open the local URL printed in the terminal. Stop a running command with Ctrl+C. Run commands from the folder containing `package.json`. `npm ci` installs the exact lockfile dependencies; do not upload `node_modules`.

## 2. Understand the files

`src/main.jsx` contains React screens and shared contact copy; `src/style.css` contains styling. `data/catalog.json` contains course information and existing URL paths. `data/assets.json` and `data/faculty.json` describe images and faculty. Put approved images in `public/assets/`. `worker/index.js` implements the APIs. `migrations/` defines D1 tables. `scripts/seo.mjs` builds route HTML, canonicals and sitemap. `wrangler.jsonc` configures Cloudflare Workers with static assets, not Cloudflare Pages.

The Vite dev server uses preview enquiries that are not saved. Browser saved courses use localStorage, not a student account. `npm run preview` serves static files only.

## 3. Run the full application locally

```sh
npm run build
npm run db:local
npm run dev:worker -- --ip 127.0.0.1
```

Open Wrangler's printed URL. This runs real Worker APIs and saves synthetic enquiries to local D1 under ignored `.wrangler/`. Do not use real learner data for development.

## 4. Change and verify code

```sh
git switch -c feature/describe-your-change
```

Edit a small set of files and save. Preserve course IDs and existing paths. For catalogue changes, check JSON commas and quoting. Verify new content with the academy.

```sh
npm test
npm run build
npx wrangler deploy --dry-run
```

Stop any local Worker first, then run `npm run db:local` and `node scripts/verify-worker.mjs` to check routes, APIs, saved enquiries and rate limiting. Repeated integration checks in the same hour may hit the limiter; use a separate disposable checkout for a fresh local database. The verifier updates `docs/verification.json`; review that diff before committing. Test mobile widths, keyboard use, search and forms in your browser.

## 5. Commit and open a pull request

```sh
git status
git diff
git add src data public tests
# Stage other intentionally changed files individually as needed.
git diff --cached
git commit -m "Describe the change"
git push -u origin feature/describe-your-change
```

On GitHub open **Compare & pull request**, explain the change and checks, and request review. Never stage secrets or production data. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). `.gitignore` excludes `.openai`, credentials and generated output. It is not a substitute for reviewing staged changes.

## 6. Configure GitHub deployment once

Go to repository **Settings → Environments → production**. The existing environment must contain secrets named exactly `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. Secret values are never visible again after saving. Do not paste them into files or issues. Account ID is available in Cloudflare; use a token scoped to the intended account with Workers Scripts Edit, D1 Edit, and access to read the Workers subdomain. Confirm a workers.dev subdomain is registered in Cloudflare Workers & Pages.

Optional **environment variables**, not secrets:

| Variable | When to use |
| --- | --- |
| `SITE_URL` | Your real HTTPS custom-domain origin, e.g. `https://courses.your-domain.com`; configure that custom domain for this Worker separately in Cloudflare first. |
| `CLOUDFLARE_D1_DATABASE_ID` | Explicit existing database ID if the database has a different name or you want to select it directly. |

Without these variables, deployment discovers or creates the D1 database named `asca-learning` and uses `https://asca-learning.<your-subdomain>.workers.dev`. It writes an ignored temporary config and sets the build origin, so no database ID or token needs to be committed. An existing unrelated database should not be selected; migration `0001` creates new tables and fails if matching tables already exist without migration history.

The workflow uses the `production` GitHub environment to access environment secrets. A Wrangler `--env production` flag is not needed: the Worker uses the root configuration. If environment reviewers are configured, GitHub waits for their approval.

## 7. Deploy and inspect results

Merging to `main` automatically runs CI and the **Deploy to Cloudflare** workflow. Deployment independently runs tests and a dry run, applies D1 migrations, then publishes the Worker and static assets with the Cloudflare API token. CI also checks the full local runtime. You can rerun deployment from **Actions → Deploy to Cloudflare → Run workflow**, selecting `main`.

Open the Actions run and read the failed step if it is red. Common causes: missing secret names, token scope, account mismatch, missing Workers subdomain, or conflicting existing database tables. The preparation script intentionally does not print API response bodies or tokens. A custom SITE_URL controls SEO metadata; it does not create DNS or a custom-domain binding.

After deployment, inspect the actual URL printed by Wrangler. Verify the homepage, a nested course route, search and a consented synthetic enquiry. Confirm its row in D1, then delete the synthetic row through your authenticated dashboard. No automatic email delivery or admin portal is provided. Configure branch rulesets requiring CI and code-owner review to control future merges.

## 8. Manual deployment from your computer

```sh
npx wrangler login
npx wrangler d1 create asca-learning
```

If the database already exists, find it with `npx wrangler d1 list` instead of creating another. Replace the placeholder `database_id` in your local `wrangler.jsonc`, and set `vars.SITE_URL` to your actual origin. Apply `npm run db:remote`. Build with the same origin:

```sh
SITE_URL=https://your-real-domain.example npm run deploy
```

Replace the example URL. On PowerShell run `$env:SITE_URL="https://your-real-domain.example"` followed by `npm run deploy`. Never commit tokens. The GitHub workflow derives its own database config and does not require your local ID change.

## 9. Maintain and recover

Review weekly Dependabot pull requests and run `npm audit`. Update dependencies intentionally with npm and commit both `package.json` and `package-lock.json`. Add new additive migrations rather than rewriting applied ones. Back up production D1 before schema changes using Cloudflare's export/Time Travel facilities; keep exports private.

For a bad code release, revert the offending commit in a new PR and merge it, or redeploy a known working version through Cloudflare. A code rollback does not undo a database migration. Coordinate data recovery separately; do not delete the database or edit migration history to fix a failed deployment. If a token leaks, revoke and replace it immediately.
