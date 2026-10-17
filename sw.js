const C='pdft-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;
 e.respondWith(caches.open(C).then(async c=>{const m=await c.match(e.request),n=fetch(e.request).then(r=>{if(r.ok||r.type=='opaque')c.put(e.request,r.clone());return r}).catch(()=>m);return m||n}))});
