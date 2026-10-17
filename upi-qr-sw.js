'use strict';
const CACHE='upiqr-v4-startup';
const FILES=['./upi-qr.html','./upi-qr.webmanifest','./upi-qr-icon.svg','./upi-qr-icon-180.png','./upi-qr-icon-192.png','./upi-qr-icon-512.png','./upi-qr-icon-maskable-192.png','./upi-qr-icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('upiqr-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!FILES.some(f=>new URL(f,self.location.href).pathname===u.pathname))return;boundedStartup(e,fetch(e.request,{cache:'reload'}).then(r=>{if(r.ok){const clone=r.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});

// Fast launch: network first; fall back to this app's saved page only if the connection stalls past 1.2s.
function boundedStartup(e,pending){
 if(e.request.mode!=='navigate'){e.respondWith(pending);return}
 e.waitUntil(Promise.resolve(pending).then(()=>{},()=>{}));
 e.respondWith((async()=>{const c=await caches.open(CACHE),u=new URL(e.request.url),base=new URL('./upi-qr.html',self.location.href);let hit=await c.match(e.request,{ignoreSearch:true});if(!hit&&u.pathname===base.pathname)hit=await c.match(base.href);if(!hit)return pending;let timer;try{return await Promise.race([Promise.resolve(pending).catch(()=>hit),new Promise(r=>{timer=setTimeout(()=>r(hit),1200)})])}finally{clearTimeout(timer)}})());
}
