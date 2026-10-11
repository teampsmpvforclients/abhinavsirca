# Security policy

Security fixes target the latest version on `main`. Never disclose vulnerabilities, tokens or learner information in public issues. Use the repository Security tab's **Report a vulnerability** option if enabled; otherwise contact the repository owner privately through an established channel. Provide affected commit, reproduction steps, impact and a redacted example. No response SLA is currently promised.

## Credentials and data

Store deployment credentials in GitHub's `production` environment secrets as `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. Give the token Workers Scripts Edit and D1 Edit for the intended account; the preparation script also reads its Workers subdomain. Never commit secrets, `.openai`, `.env`, `.dev.vars`, `.wrangler`, enquiry exports or local databases. Ignore rules prevent accidental additions; they do not encrypt files or remove previously committed secrets. If a secret leaks, revoke it immediately, replace the environment secret and coordinate history cleanup.

Enquiries contain personal information in D1. Limit dashboard access, establish retention and deletion rules, and do not attach production records to tests or issues. Keep `LOCAL_PREVIEW` disabled in production. The hourly IP limiter is a basic abuse control; monitor abuse and evaluate additional controls if needed.

## Maintenance

Run `npm audit` and review dependency update pull requests. Test and build before merging. Use environment protection and branch rulesets where available. CI uses read-only repository permissions and deployment secrets are available only to the production deployment job, never pull-request validation.

## Chatbot

Chat requests run through the Worker; browsers receive no Cloudflare credentials. Model input/output and history are bounded, cross-origin browser requests are rejected, and D1 holds only hashed hourly chat counters. The app does not store transcripts; messages are processed by Cloudflare Workers AI. Do not ask visitors to enter passwords or private learner records. Model output is rendered as text, with links limited to actual catalogue routes.
