/* Legacy app moved. Retire ONLY this registration; preserve every cache and sibling app. */
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.registration.unregister());});
