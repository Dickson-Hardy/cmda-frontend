export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Kill-switch for old service workers (/sw.js and /sw-v2.js).
    if (url.pathname === "/sw.js" || url.pathname === "/sw-v2.js") {
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
    if (url.pathname === "/sw-v3.js" || url.pathname.startsWith("/workbox-") || url.pathname === "/registerSW.js") {
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
      newHeaders.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-src 'self' https://www.youtube.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https:; upgrade-insecure-requests",
      );
      newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
      newHeaders.set("X-Content-Type-Options", "nosniff");
      // Inline kill-switch for any client that reaches network HTML
      let html = await response.text();
      if (!html.includes("CMDA_SW_KILL")) {
        const kill = `<script id="CMDA_SW_KILL">
(function(){
  if(!('serviceWorker' in navigator)) return;
  var DEPLOY_VERSION="2026-08-09-sw-v3";
  var STORED=localStorage.getItem("CMDA_SW_VER");
  if(STORED!==DEPLOY_VERSION){
    localStorage.setItem("CMDA_SW_VER",DEPLOY_VERSION);
    navigator.serviceWorker.getRegistrations().then(function(regs){
      return Promise.all(regs.map(function(r){return r.unregister();}));
    }).then(function(){
      if(window.caches) return caches.keys().then(function(ks){
        return Promise.all(ks.map(function(k){return caches.delete(k);}));
      });
    }).then(function(){location.reload();});
    return;
  }
  function isOldSW(u){return !!u&&/\\/sw\\.js(\\?|$)/.test(u);}
  function regIsOld(r){
    return isOldSW(r.active&&r.active.scriptURL)||
           isOldSW(r.waiting&&r.waiting.scriptURL)||
           isOldSW(r.installing&&r.installing.scriptURL);
  }
  navigator.serviceWorker.getRegistrations().then(function(regs){
    var old=regs.filter(regIsOld);
    var c=navigator.serviceWorker.controller;
    var cOld=isOldSW(c&&c.scriptURL);
    if(!old.length&&!cOld) return null;
    return Promise.all(old.map(function(r){return r.unregister();})).then(function(){
      if(!window.caches) return;
      return caches.keys().then(function(ks){
        return Promise.all(ks.map(function(k){return caches.delete(k);}));
      });
    }).then(function(){location.reload();});
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

    const securedHeaders = new Headers(response.headers);
    securedHeaders.set("X-Content-Type-Options", "nosniff");
    securedHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: securedHeaders,
    });
  },
};
