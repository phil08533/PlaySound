const CACHE='playsound-v10';
const SHELL=['./','./index.html','./style.css','./fresh-manifest.js','./app.js','./car-ride-fix.js','./ui-polish.js','./manifest.json','./assets/icon.svg'];

self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(()=>self.skipWaiting())
));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE && k!=='playsound-playlist-downloads-v1').map(k=>caches.delete(k))
  )).then(()=>self.clients.claim())
));

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const isManifest=['tracks.json','featured.json','album-art.json'].some(name=>url.pathname.endsWith('/'+name));
  const isShell=['index.html','style.css','fresh-manifest.js','app.js','car-ride-fix.js','ui-polish.js','manifest.json','sw.js'].some(name=>url.pathname.endsWith('/'+name)||url.pathname.endsWith(name));

  if(isManifest){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
      if(r.ok) caches.open(CACHE).then(async c=>{
        await c.put(e.request,r.clone());
        const canonical=new URL(url.pathname,url.origin);
        await c.put(new Request(canonical.href),r.clone());
      });
      return r;
    }).catch(async()=>{
      const cached=await caches.match(new Request(url.origin+url.pathname));
      return cached||caches.match(e.request);
    }));
    return;
  }

  if(isShell){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
      caches.open(CACHE).then(c=>c.put(e.request,r.clone()));
      return r;
    }).catch(()=>caches.match(e.request)));
    return;
  }

  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    caches.open(CACHE).then(c=>c.put(e.request,r.clone()));
    return r;
  }).catch(()=>cached)));
});
