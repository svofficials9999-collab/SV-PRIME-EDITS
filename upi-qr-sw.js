const C='upiqr-v3';
const A=['upi-qr.html','upi-qr.webmanifest','upi-qr-icon.svg','upi-qr-icon-180.png','upi-qr-icon-192.png','upi-qr-icon-512.png','upi-qr-icon-maskable-192.png','upi-qr-icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const cl=n.clone();caches.open(C).then(c=>c.put(e.request,cl));return n}).catch(()=>caches.match('upi-qr.html'))))});
