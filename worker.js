export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Kill-switch for the OLD service worker (/sw.js).
    // Browsers still registered to /sw.js will fetch this on update,
    // install it, wipe all caches, unregister, and hard-reload every tab.
    if (url.pathname === "/sw.js") {
      const killSw = `
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        try { client.navigate(client.url); } catch (_) {
          try { client.postMessage({ type: 'FORCE_RELOAD' }); } catch (__) {}
        }
      }
    } catch (_) {}
  })());
});
`;
      return new Response(killSw, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Service-Worker-Allowed": "/",
        },
      });
    }

    if (url.pathname.startsWith("/apk/")) {
      const key = url.pathname.replace(/^\/apk\//, "");

      if (request.method === "HEAD") {
        const head = await env.CMDA_STORAGE.head(key);
        if (!head) return new Response("Not found", { status: 404 });
        const headers = new Headers();
        headers.set("Content-Type", "application/vnd.android.package-archive");
        headers.set("Content-Length", String(head.size));
        headers.set("etag", head.httpEtag);
        return new Response(null, { status: 200, headers });
      }

      const object = await env.CMDA_STORAGE.get(key);
      if (!object) return new Response("Not found", { status: 404 });

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Content-Type", "application/vnd.android.package-archive");
      headers.set("Content-Disposition", `attachment; filename="${key}"`);
      headers.set("Cache-Control", "public, max-age=3600");
      return new Response(object.body, { headers });
    }

    // Never cache service worker files
    if (url.pathname === "/sw-v2.js" || url.pathname.startsWith("/workbox-") || url.pathname === "/registerSW.js") {
      const response = await env.ASSETS.fetch(request);
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.set("Expires", "0");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // HTML navigations: prevent CDN/browser caching + clear site data once SW is gone
    const accept = request.headers.get("Accept") || "";
    const isHtmlNav =
      request.method === "GET" &&
      (url.pathname === "/" || url.pathname.endsWith(".html") || accept.includes("text/html"));

    const response = await env.ASSETS.fetch(request);

    if (isHtmlNav && response.ok) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      // Inline kill-switch for any client that reaches network HTML
      let html = await response.text();
      if (!html.includes("CMDA_SW_KILL")) {
        const kill = `<script id="CMDA_SW_KILL">
(function(){
  if(!('serviceWorker' in navigator)) return;
  function isOldSW(url){ return !!url && /\\/sw\\.js(\\?|$)/.test(url); }
  function regIsOld(r){
    return isOldSW(r.active && r.active.scriptURL) ||
           isOldSW(r.waiting && r.waiting.scriptURL) ||
           isOldSW(r.installing && r.installing.scriptURL);
  }
  navigator.serviceWorker.getRegistrations().then(function(regs){
    var oldRegs = regs.filter(regIsOld);
    var ctrl = navigator.serviceWorker.controller;
    var ctrlOld = isOldSW(ctrl && ctrl.scriptURL);
    if(!oldRegs.length && !ctrlOld) return null;
    return Promise.all(oldRegs.map(function(r){ return r.unregister(); })).then(function(){
      if(!window.caches) return;
      return caches.keys().then(function(keys){
        return Promise.all(keys.map(function(k){ return caches.delete(k); }));
      });
    }).then(function(){ location.reload(); });
  }).catch(function(){});
})();
</script>`;
        html = html.replace("<head>", "<head>" + kill);
      }
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return response;
  },
};
