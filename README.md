# ASCA learning website — Cloudflare deployment

Live site: [ASCA learning website](https://asca-learning.teampsmpvforclients.workers.dev).

34 source-page routes, a searchable course catalogue, device-local saved courses, syllabus/FAQ disclosures and durable counselling enquiries. The design follows the observed Coursera public discovery interface with ASCA content and original academy assets.

Read `docs/Coursera-ASCA-UIUX-Analysis.md` for the detailed reference/implementation analysis and `docs/AbhinavSirCA-Website-Content-Inventory.md` for the original content inventory. The package is an independent implementation; it does not include Coursera private APIs, payments, AI assistant or learning-management backend.

## Repository guides and automatic deployment

Start with [INSTRUCTIONS.md](INSTRUCTIONS.md) for beginner setup, editing, Git, deployment and troubleshooting. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [CODEOWNERS.md](CODEOWNERS.md), [CHANGELOG.md](CHANGELOG.md), and [LICENSE.md](LICENSE.md).

Pushes to `main` deploy through `.github/workflows/deploy.yml` using the existing GitHub `production` environment secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. The workflow tests, resolves or creates D1, builds with the real origin, applies migrations and deploys Workers with static assets. Optional environment variables `SITE_URL` and `CLOUDFLARE_D1_DATABASE_ID` select a custom origin/database; otherwise it derives the workers.dev URL and discovers the `asca-learning` database. Custom domains require separate Cloudflare configuration. CI validates pull requests without deployment credentials.

## Requirements

- Node 22.12+ (tested with Node 24).
- npm.
- A Cloudflare account with Workers and D1 access for deployment.

## Install and preview

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Development search uses the same Worker catalogue handler. Development enquiry acknowledgements are explicitly marked as previews and are not stored or forwarded.

Build and run the actual local Cloudflare runtime:

```sh
npm run build
npm run db:local
npm run dev:worker -- --ip 127.0.0.1
```

The explicit IP avoids interface-enumeration problems in some containers. The Worker local runtime stores enquiries in local D1. `npm run preview` previews built static UI; it does **not** provide production APIs. Use the Worker command to verify the complete application.

## Deploy to Cloudflare Workers + Static Assets

1. Sign in from your own terminal:

   ```sh
   npx wrangler login
   ```

2. Create the production database:

   ```sh
   npx wrangler d1 create asca-learning
   ```

   Copy its `database_id` into `wrangler.jsonc`, replacing the all-zero placeholder. Keep `binding` as `DB`. Set `SITE_URL` in the same configuration to the actual Workers/custom-domain URL. Choose a unique Worker name if `asca-learning` is already used in your account.

3. Apply the database schema:

   ```sh
   npm run db:remote
   ```

4. Build and deploy using your real URL:

   ```sh
   SITE_URL=https://your-asca-domain.example npm run deploy
   ```

   Replace the example domain. `SITE_URL` is a build environment variable used for canonical metadata and the sitemap; setting only the Worker variable will not rewrite already built HTML. Windows PowerShell users can set `$env:SITE_URL` before running the command.

5. In Cloudflare, add your custom domain if desired. Confirm the deployed homepage, a nested course route, search, enquiry submission and D1 row creation. The repository workflow has deployed this project to `https://asca-learning.teampsmpvforclients.workers.dev`; follow these manual steps only when deploying to a different account.

Do not upload `dist` alone through a static drag-and-drop host: that would omit the Worker APIs. The supplied Cloudflare deployment path is Workers with Static Assets. A Pages conversion would require a Pages Worker/functions entry and equivalent D1 binding; it is not needed for this package.

## ASCA AI course guide

The sticky book/chat icon opens a multilingual AI guide backed by Cloudflare Workers AI Gemma 4 26B A4B (`@cf/google/gemma-4-26b-a4b-it`), the Gemma 4 model currently offered by Cloudflare. It defaults to Hinglish and follows requested languages. Answers use the entire published course catalogue and syllabus, faculty, FAQs, contacts and scholarship guidance; general study/career advice is distinguished from confirmed academy details.

Clicking the backdrop, closing the panel or pressing Escape clears chat history and cancels pending replies. The site keeps chat only in browser memory and sends messages to Cloudflare for inference; no transcripts are saved in D1. The API permits 30 requests per IP/hour using separate hashed hourly keys. Workers AI usage may be billed under the account plan.

The GitHub deployment workflow binds `AI`, deploys, then sends one inference request to verify the live chatbot. Local `npm run dev` displays a clear unavailable message because Vite has no AI binding. Wrangler AI development requires Cloudflare authentication and uses remote inference. Credential-free integration checks intentionally remove the AI binding from a temporary local configuration. See [chatbot maintenance](docs/CHATBOT.md).

## Working features

| Feature | Implementation |
|---|---|
| 34 original paths | Unique route records and generated nested HTML |
| Catalogue discovery | Explore menu, category links, related courses |
| Search | `POST /api/graphql`; query/category matching against catalogue |
| Saved courses | Browser localStorage; no student account implied |
| Carousel | Manual next/dot selection, no autoplay |
| Syllabus/FAQ | Native disclosure elements |
| Counselling | Validated `POST /api/inquiries`, consent and D1 storage |
| Abuse limit | Five submissions per IP/hour; hashed rate keys |
| External login | Link to existing `abhinavsirca.co.in` portal |
| SEO | Page titles, descriptions, canonical URLs, sitemap and initial readable content |
| Branding/assets | Original academy images self-hosted under `/assets/` |

## Data and editorial updates

Edit `data/catalog.json` to change descriptions, modules, skills or course imagery. Keep IDs unique and maintain legacy paths to preserve incoming links. Course families, footer links and public search are generated from this catalogue. `src/main.jsx` contains homepage copy and shared contact information. `data/assets.json` maps hero/mentor/rank assets.

The misleading source slugs are intentional: `ca-executive-coaching` is CS Executive, the online-internship URL without `-2` is Office Automation, and the `-2` URL is the actual internship. The misspelled university path is retained. The requested duplicate links are not additional pages.

The content inventory records dated/contradictory admission and exam claims. Public pages use curated topic summaries and institute links; verify current fees, eligibility, dates and claims before adding them. Original posters contain existing full-name branding and embedded promotional text. Confirm the academy's approval for public reuse of its images. Font licensing is in `public/assets/SOURCE-SANS-LICENSE.md`.

## Enquiry operations

Enquiries are stored privately in D1. There is no public record-list API, automatic email/SMS delivery, CRM integration or administrator UI. Open the database in your Cloudflare dashboard to review enquiries, or use an authenticated operator command:

```sh
npx wrangler d1 execute DB --remote --command "SELECT created_at,name,email,phone,course,message FROM enquiries ORDER BY created_at DESC LIMIT 100"
```

This command returns personal contact information to your authenticated terminal; store exports according to your academy's process. The production API fails with a phone fallback if the database is missing or unavailable. Never enable `LOCAL_PREVIEW` in production: it is supplied only by Vite during development.

## Validation

```sh
npm test
npm run build
npx wrangler deploy --dry-run
npm run db:local
node scripts/verify-worker.mjs
```

The last command starts a temporary local Worker on port 8798 and checks all 34 routes, catalogue queries, synthetic D1 submissions and the hourly limit. It assumes a fresh local test database/hour. Repeated execution after successful submissions can legitimately hit the limiter. Use a fresh disposable local state or wait for the next hourly bucket; do not delete real production records for testing.

Desktop visual QA is documented in `design-qa.md`. The available browser could not be resized for mobile verification. Responsive CSS is included; test narrow screens and real devices before launch. No claim of an identical Coursera private platform or exact production dependency versions is made.

## Package layout

- `src/`: React interface and CSS.
- `data/`: shared page/course/asset model.
- `worker/`: GraphQL and enquiry APIs.
- `migrations/`: D1 schema.
- `public/assets/`: extracted original academy assets and font.
- `dist/`: built 34-route site plus search, 404 and sitemap.
- `scripts/`: metadata generation and local integration verification.
- `tests/`: meaningful content/API regression checks.
- `docs/`: design report, previous inventory, asset provenance and verification evidence.

Production tokens, local enquiry databases, dependencies and build-check intermediates are excluded from the ZIP. Run `npm ci` using the included lockfile.
