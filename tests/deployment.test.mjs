import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const script = new URL('../scripts/prepare-cloudflare.mjs', import.meta.url).href;
const id = '11111111-1111-1111-1111-111111111111';
async function run(mode, overrides = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'asca-deploy-'));
  try {
    await writeFile(join(dir, 'wrangler.jsonc'), await readFile(new URL('../wrangler.jsonc', import.meta.url)));
    const mock = `globalThis.fetch = async (url, options = {}) => {
      const path = new URL(url).pathname;
      if (${JSON.stringify(mode)} === 'denied') return {ok:false,status:403,json:async()=>({success:false})};
      let result;
      if (path.endsWith('/workers/subdomain')) result = {subdomain:'test-academy'};
      else if (options.method === 'POST') result = {uuid:${JSON.stringify(id)}};
      else result = ${JSON.stringify(mode)} === 'create' ? [] : [{name:'asca-learning',uuid:${JSON.stringify(id)}}];
      return {ok:true,status:200,json:async()=>({success:true,result})};
    }; await import(${JSON.stringify(script)});`;
    await writeFile(join(dir, 'mock.mjs'), mock);
    const env = {...process.env, CLOUDFLARE_ACCOUNT_ID:'a'.repeat(32), CLOUDFLARE_API_TOKEN:'synthetic-test-token', SITE_URL:'', CLOUDFLARE_D1_DATABASE_ID:'', GITHUB_ENV:join(dir,'github-env'), ...overrides};
    const result = spawnSync(process.execPath, [join(dir, 'mock.mjs')], {cwd:dir,env,encoding:'utf8'});
    if (result.status !== 0) return {status:result.status, error:result.stderr};
    return {status:0, config:JSON.parse(await readFile(join(dir,'.cloudflare-deploy.json'),'utf8')), env:await readFile(join(dir,'github-env'),'utf8')};
  } finally {await rm(dir,{recursive:true,force:true});}
}
test('deployment reuses or creates D1 and exports the real build origin', async () => {
  for (const mode of ['reuse','create']) {
    const result = await run(mode);
    assert.equal(result.status,0);
    assert.equal(result.config.d1_databases[0].database_id,id);
    assert.equal(result.config.vars.SITE_URL,'https://asca-learning.test-academy.workers.dev');
    assert.equal(result.env,'SITE_URL=https://asca-learning.test-academy.workers.dev\n');
    assert.ok(!JSON.stringify(result.config).includes('synthetic-test-token'));
  }
});
test('deployment supports explicit origins and rejects invalid configuration or denied API access', async () => {
  const custom = await run('reuse',{SITE_URL:'https://courses.example.com',CLOUDFLARE_D1_DATABASE_ID:id});
  assert.equal(custom.status,0);
  assert.equal(custom.config.vars.SITE_URL,'https://courses.example.com');
  for (const overrides of [{CLOUDFLARE_API_TOKEN:''},{SITE_URL:'https://user:password@example.com'},{CLOUDFLARE_D1_DATABASE_ID:'invalid'}]) {
    assert.notEqual((await run('reuse',overrides)).status,0);
  }
  const denied = await run('denied');
  assert.notEqual(denied.status,0);
  assert.ok(!denied.error.includes('synthetic-test-token'));
});
