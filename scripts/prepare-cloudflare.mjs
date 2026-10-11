import {readFile, writeFile, appendFile} from 'node:fs/promises';

const {CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token} = process.env;
if (!account || !token) throw new Error('Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the GitHub production environment secrets.');
if (!/^[a-f0-9]{32}$/i.test(account)) throw new Error('Invalid Cloudflare account ID.');
const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
async function api(path, options = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${path}`, {
    ...options,
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    // Do not log response bodies or credentials.
    throw new Error(`Cloudflare API ${options.method || 'GET'} ${path} failed (${response.status}); check account and token permissions.`);
  }
  return body;
}
const binding = config.d1_databases[0];
let databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
if (!databaseId) {
  const matches = [];
  for (let page = 1; ; page++) {
    const body = await api(`/d1/database?per_page=100&page=${page}`);
    matches.push(...body.result.filter(db => db.name === binding.database_name));
    if (body.result.length < 100) break;
  }
  if (matches.length > 1) throw new Error('Multiple matching D1 databases; set CLOUDFLARE_D1_DATABASE_ID explicitly.');
  databaseId = matches[0]?.uuid;
  if (!databaseId) {
    const body = await api('/d1/database', {method: 'POST', body: JSON.stringify({name: binding.database_name})});
    databaseId = body.result.uuid;
    console.log('Created the ASCA D1 database.');
  } else console.log('Reusing the ASCA D1 database.');
}
if (!/^[a-f0-9-]{36}$/i.test(databaseId)) throw new Error('Invalid D1 database ID.');
binding.database_id = databaseId;
let origin = process.env.SITE_URL;
if (!origin) {
  const body = await api('/workers/subdomain');
  const subdomain = body.result.subdomain;
  if (!subdomain) throw new Error('Register a workers.dev subdomain in Cloudflare or set production SITE_URL to your configured custom domain.');
  origin = `https://${config.name}.${subdomain}.workers.dev`;
}
const url = new URL(origin);
if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
  throw new Error('SITE_URL must be an HTTPS origin without path, credentials, query or fragment.');
}
origin = url.origin;
config.vars.SITE_URL = origin;
config.workers_dev = true;
await writeFile('.cloudflare-deploy.json', JSON.stringify(config, null, 2) + '\n');
if (process.env.GITHUB_ENV) await appendFile(process.env.GITHUB_ENV, `SITE_URL=${origin}\n`);
console.log(`Prepared deployment for ${origin}. Custom domain routing must be configured separately in Cloudflare.`);
