import {defineConfig} from 'vite';
import {handleRequest} from './worker/index.js';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:['terminal.local']},plugins:[{
  name:'asca-local-api',configureServer(server){server.middlewares.use(async(req,res,next)=>{
    if(!req.url.startsWith('/api/'))return next();
    let body='';for await(const chunk of req)body+=chunk;
    const request=new Request('http://'+(req.headers.host||'localhost')+req.url,{method:req.method,headers:req.headers,...(body?{body}:{})});
    const response=await handleRequest(request,{LOCAL_PREVIEW:true});
    res.statusCode=response.status;response.headers.forEach((v,k)=>res.setHeader(k,v));res.end(await response.text());
  });}
}]});
