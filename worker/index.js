import {buildSchema, graphql} from 'graphql';
import pages from '../data/catalog.json' with {type:'json'};

const schema=buildSchema(`
 type Module {title:String!, topics:[String!]!}
 type Page {id:ID!,path:String!,title:String!,category:String!,description:String!,type:String!,level:String,image:String,skills:[String!],modules:[Module!]}
 type Query {courses(q:String,category:String):[Page!]!, page(path:String!):Page, categories:[String!]!}
`);
const courses=pages.filter(p=>p.type==='course');
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export function searchCourses(q='',category='') {
 const query=q.trim().toLowerCase().slice(0,120);
 return courses.filter(p=>(!category||p.category===category)&&(!query||[p.title,p.category,p.description,...p.skills].join(' ').toLowerCase().includes(query)));
}
export function validateInquiry(input) {
 if(!input||typeof input!=='object'||Array.isArray(input))return 'Invalid form.';
 if(typeof input.name!=='string'||input.name.trim().length<2||input.name.trim().length>100)return 'Enter your name (2–100 characters).';
 if(typeof input.email!=='string'||input.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))return 'Enter a valid email address.';
 if(typeof input.phone!=='string'||!/^\+?[\d\s()\-]{7,24}$/.test(input.phone)||input.phone.replace(/\D/g,'').length<7)return 'Enter a valid phone number.';
 if(typeof input.course!=='string'||!(input.course==='General guidance'||pages.some(p=>p.title===input.course)))return 'Choose a listed course.';
 if(typeof input.message!=='string'||input.message.length>2000)return 'Keep your message under 2,000 characters.';
 if(input.consent!==true)return 'Please agree to being contacted about your enquiry.';
 if(input.website)return 'Unable to submit this form.';
 return null;
}
function safeOrigin(req,env) {
 const origin=req.headers.get('Origin'); if(!origin)return true;
 return origin===new URL(req.url).origin|| (env.LOCAL_PREVIEW&&/^https?:\/\/(localhost|127\.0\.0\.1|terminal\.local|[^/]+\.terminal\.local)(:\d+)?$/.test(origin));
}
async function inquiry(req,env) {
 if(!safeOrigin(req,env))return json({error:'This request is not allowed.'},403);
 if(!req.headers.get('Content-Type')?.includes('application/json'))return json({error:'Use a JSON request.'},415);
 if(Number(req.headers.get('Content-Length'))>8192)return json({error:'Form too large.'},413);
 let input;try{const body=await req.text();if(body.length>8192)return json({error:'Form too large.'},413);input=JSON.parse(body);}catch{return json({error:'Invalid JSON.'},400);}
 const error=validateInquiry(input);if(error)return json({error},400);
 if(!env.DB&&!env.LOCAL_PREVIEW)return json({error:'Online enquiries are temporarily unavailable. Please call +91 9837622221.'},503);
 const id=crypto.randomUUID(); const now=new Date().toISOString();
 if(env.DB){
  const ip=req.headers.get('CF-Connecting-IP')||'local';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+now.slice(0,13)));
  const key=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
  const count=await env.DB.prepare('INSERT INTO rate_limits (key, count, expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,Date.now()+7200000).first();
  if(count.count>5)return json({error:'Too many enquiries. Please call us or try again in an hour.'},429);
  await env.DB.prepare('INSERT INTO enquiries (id,created_at,name,email,phone,course,message,consent) VALUES (?,?,?,?,?,?,?,1)').bind(id,now,input.name.trim(),input.email.trim().toLowerCase(),input.phone.trim(),input.course,input.message.trim()).run();
  await env.DB.prepare('DELETE FROM rate_limits WHERE expires < ?').bind(Date.now()).run();
 }
 return json({id,received:true,preview:!!env.LOCAL_PREVIEW},201);
}
export async function handleRequest(req,env={}) {
 const url=new URL(req.url);
 try{
  if(url.pathname==='/api/health')return json({ok:true,storage:env.DB?'d1':env.LOCAL_PREVIEW?'preview':'unconfigured'});
  if(url.pathname==='/api/inquiries')return req.method==='POST'?await inquiry(req,env):json({error:'Method not allowed.'},405);
  if(url.pathname==='/api/graphql'){
   if(req.method!=='POST')return json({error:'Use POST.'},405);
   if(!safeOrigin(req,env))return json({error:'This request is not allowed.'},403);
   const body=await req.text();if(body.length>12000)return json({error:'Query too large.'},413);
   let data;try{data=JSON.parse(body);}catch{return json({error:'Invalid JSON.'},400);}
   if(typeof data.query!=='string'||data.query.length>4000)return json({error:'Invalid query.'},400);
   // Bounded catalogue queries. Public queries expose no user or enquiry data.
   if((data.query.match(/\{/g)||[]).length>12||(data.query.match(/\bcourses\b/g)||[]).length>3)return json({error:'Query is too complex.'},400);
   return json(await graphql({schema,source:data.query,variableValues:data.variables,rootValue:{courses:({q,category})=>searchCourses(q,category),page:({path})=>pages.find(p=>p.path===path),categories:()=>[...new Set(courses.map(p=>p.category))]}}));
  }
  if(url.pathname.startsWith('/api/'))return json({error:'Not found.'},404);
  if(env.ASSETS)return env.ASSETS.fetch(req);
  return json({error:'Not found.'},404);
 }catch {return json({error:'The service is temporarily unavailable. Please try again.'},503);}
}
export default {fetch:handleRequest};
