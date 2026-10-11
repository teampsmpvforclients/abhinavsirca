import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import pages from '../data/catalog.json' with {type:'json'};
const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--ip','127.0.0.1','--port','8798','--inspector-port','9258'],{stdio:['ignore','pipe','pipe']});
let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);
const base='http://127.0.0.1:8798';
try{
 await new Promise((resolve,reject)=>{const deadline=Date.now()+25000;const timer=setInterval(async()=>{try{const r=await fetch(base+'/api/health');if(r.ok){clearInterval(timer);resolve();}}catch{}if(Date.now()>deadline){clearInterval(timer);reject(new Error('Worker readiness timed out: '+output.slice(-1200)));}},500);});
 const routes=await Promise.all(pages.map(async p=>{const r=await fetch(base+p.path);const html=await r.text();assert.equal(r.status,200);assert.ok(html.includes(p.title.replace(/&/g,'&amp;')+' | ASCA'));return {path:p.path,status:r.status};}));
 const post=async(body,path='/api/inquiries')=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const good={name:'Local QA Learner',email:'qa@example.com',phone:'+91 9999999999',course:'CA Foundation',message:'Synthetic local D1 verification',consent:true,website:''};
 const r=await post(good);assert.equal(r.status,201);const saved=await r.json();assert.ok(saved.received&&!saved.preview);
 const statuses=[r.status];for(let i=0;i<5;i++)statuses.push((await post(good)).status);assert.deepEqual(statuses,[201,201,201,201,201,429]);
 const gql=await (await post({query:'{courses(category:"CA"){title}}'},'/api/graphql')).json();assert.equal(gql.data.courses.length,3);
 const result={routes,worker_runtime:'workerd via Wrangler',storage:'local D1',enquiry_id:saved.id,rate_limit_statuses:statuses,graphql_ca_courses:3};
 await writeFile('docs/verification.json',JSON.stringify(result,null,2));console.log('PASS: 34 routes HTTP 200; local D1 submission and rate limit; GraphQL catalogue.');
}finally{child.kill('SIGTERM');}
