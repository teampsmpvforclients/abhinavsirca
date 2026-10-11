# ASCA chatbot maintenance

## Model and deployment

The implementation uses Cloudflare Workers AI `@cf/google/gemma-4-26b-a4b-it` via the server-side `AI` binding. Cloudflare's catalogue currently lists this Gemma 4 variant, rather than the smaller E2B variant. The model weights are hosted by Cloudflare; GitHub Actions deploys the Worker, assets and binding, not a copy of the model weights. See [model documentation](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/).

Existing `production` environment secrets deploy the app. No API credential is exposed to the browser and no additional inference API key is needed for the runtime binding. If inference fails, inspect Cloudflare Workers AI account access, usage limits and binding configuration. An AI usage charge is possible under the account's plan. The workflow's last step makes one public inference request and fails if no answer is returned; a failure there occurs after deployment and does not roll it back.

## Knowledge and languages

`worker/chat.js` combines every page/course in `data/catalog.json`, full module topics, `data/faculty.json` and `data/academy.json` in the system context. Course and faculty edits automatically update knowledge on the next deployment. Keep `data/academy.json` synchronized with homepage, About, footer and FAQ changes. Do not import historical source notes that contain outdated or contradictory claims.

Hinglish is the default. Visitors can request any language the model supports or use another script/language. The interface does not restrict the language list; quality varies by language. It can give related study plans and career comparisons using general model knowledge, but is instructed to distinguish these from ASCA-specific facts and to confirm unknown fees, schedules and changing official rules with the academy/official authority. It does not browse the internet or perform admissions/account actions. Model instructions reduce fabricated claims but are not a guarantee of factual accuracy; review real answers during maintenance.

## Interface and lifecycle

`src/Chatbot.jsx` uses a native modal dialog for keyboard focus management and a dimmed backdrop. The supplied SVG is `public/assets/chat-book.svg`. Clicking outside the panel, the close button or Escape unmounts the chat, clears its in-memory conversation and aborts browser requests. The header reset button clears chat while keeping the panel open. Browser cancellation cannot guarantee cancellation of inference already running on Cloudflare. Chat is never put in localStorage, sessionStorage or D1.

Replies render as React text, without raw model HTML. Only actual catalogue routes and `/search/` become clickable links. Inputs support Unicode; Enter submits, Shift+Enter inserts a newline, and composition input is respected. Messages are sent to Cloudflare Workers AI for processing; closing the panel clears browser memory, not the provider's processing. See [Cloudflare data usage](https://developers.cloudflare.com/workers-ai/platform/data-usage/).

## Limits and verification

The endpoint `/api/chat` accepts same-origin JSON POST requests with alternating user/assistant history ending in a user message. Bounds: 1,200 characters per question, 6,000 per reply, 11 messages, 12,000 total conversation characters, 32,000 request bytes and 1,200 output tokens. The browser retains recent turns to stay within these limits. D1 stores only hashed hourly abuse counters in `rate_limits`, with a separate `chat:` namespace, at 30 requests per IP/hour. No transcript or raw IP is stored by the app.

Run `npm test`, `npm run build` and `npx wrangler deploy --dry-run`. `npm run db:local` followed by `node scripts/verify-worker.mjs` verifies existing routes and enquiry APIs with AI disabled in a temporary config, avoiding remote inference during CI. For the live chatbot use `SITE_URL=https://your-deployed-origin node scripts/verify-chat.mjs`; this consumes one inference request. Verify a real Hinglish answer, another language, a course comparison and unknown fees manually. Browser checks should cover desktop/mobile, backdrop reset, Escape, focus return, reset during a pending request and error recovery.
