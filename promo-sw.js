/* cleanup: old in-repo promo app moved to /prime-edits/ - remove caches and unregister */
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try { const ks = await caches.keys(); for (const k of ks) { await caches.delete(k); } } catch (err) {}
    try { await self.registration.unregister(); } catch (err) {}
    try { const cs = await clients.matchAll({ type: 'window' }); for (const c of cs) { c.navigate('https://svofficials9999-collab.github.io/promo-edits/promo-studio.html'); } } catch (err) {}
  })());
});
self.addEventListener('fetch', e => {});
