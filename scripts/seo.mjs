import {readFile,writeFile,mkdir} from 'node:fs/promises';
import pages from '../data/catalog.json' with {type:'json'};
const base=(process.env.SITE_URL||'https://asca.example').replace(/\/$/,'');
if(!/^https?:\/\//.test(base))throw new Error('SITE_URL must be an absolute HTTP(S) URL');
const template=await readFile('dist/index.html','utf8');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const p of [...pages,{path:'/search/',title:'Explore courses',description:'Explore ASCA coaching, professional qualifications, practical accounting and entrance preparation.'}]){
 const content=`<div class="container section"><h1>${escape(p.title)}</h1><p>${escape(p.description)}</p>${p.modules?p.modules.map(m=>`<h2>${escape(m.title)}</h2><ul>${m.topics.map(t=>`<li>${escape(t)}</li>`).join('')}</ul>`).join(''):''}<p><a href="/search/">Explore ASCA courses</a> · <a href="tel:+919837622221">Call +91 9837622221</a></p></div>`;
 const html=template.replace(/<title>.*?<\/title>/,`<title>${escape(p.title)} | ASCA</title>`).replace('</head>',`<meta name="description" content="${escape(p.description)}"><link rel="canonical" href="${escape(base+p.path)}"><meta property="og:title" content="${escape(p.title)} | ASCA"><meta property="og:description" content="${escape(p.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${escape(base+p.path)}"></head>`).replace('<div id="root"></div>',`<div id="root">${content}</div>`);
 const dir='dist'+p.path;await mkdir(dir,{recursive:true});await writeFile(dir+'index.html',html);
}
await writeFile('dist/404.html',template.replace('<div id="root"></div>','<div id="root"><h1>Page not found</h1><a href="/">ASCA home</a></div>'));
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${escape(base+p.path)}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Generated ${pages.length} source routes, search, 404 and sitemap for ${base}.`);
