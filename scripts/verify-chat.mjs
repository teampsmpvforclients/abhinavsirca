// One public inference request verifies the deployed binding/model, not just HTML.
const origin = process.env.SITE_URL;
if (!origin) throw new Error('Set SITE_URL to the deployed origin.');
const response = await fetch(new URL('/api/chat', origin), {
  method:'POST',
  headers:{'Content-Type':'application/json', Origin:origin},
  body:JSON.stringify({messages:[{role:'user',content:'Hinglish mein 2 sentences mein batao: ASCA mein CA Foundation ke main subjects kya hain?'}]}),
  signal:AbortSignal.timeout(60000),
});
const body = await response.json();
if (!response.ok || typeof body.answer !== 'string' || !body.answer.trim()) throw new Error(`Deployed chatbot verification failed (${response.status}). Check the Worker AI binding, account access and Workers AI usage limits.`);
console.log('PASS: deployed Gemma chatbot returned an answer.');
