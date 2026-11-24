export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // One-time cleanup for legacy service workers only. Current versions are
    // updated in-app via the update prompt, so caches are never wiped blindly.
    if (url.pathname === "/sw.js" || url.pathname === "/sw-v2.js" || url.pathname === "/sw-v3.js") {
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
    if (
      url.pathname === "/sw-v4.js" ||
      url.pathname === "/sw-sync.js" ||
      url.pathname === "/sw-push.js" ||
      url.pathname.startsWith("/workbox-") ||
      url.pathname === "/registerSW.js"
    ) {
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

    // HTML navigations: prevent CDN/browser caching.
    const accept = request.headers.get("Accept") || "";
    const isHtmlNav =
      request.method === "GET" &&
      (url.pathname === "/" || url.pathname.endsWith(".html") || accept.includes("text/html"));

    const response = await env.ASSETS.fetch(request);

    if (isHtmlNav && response.ok) {
      const isSupportEmbed = url.pathname === "/support/embed";
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      newHeaders.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-src 'self' https://www.youtube.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' https:; upgrade-insecure-requests"
      );
      newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
      if (isSupportEmbed) {
        const policy = newHeaders.get("Content-Security-Policy");
        newHeaders.set(
          "Content-Security-Policy",
          policy.replace(
            "frame-ancestors 'none'",
            "frame-ancestors https://cmdanigeria.org https://www.cmdanigeria.org https://cmdanigeria.net https://www.cmdanigeria.net"
          )
        );
        newHeaders.delete("X-Frame-Options");
        newHeaders.set("Referrer-Policy", "no-referrer");
        newHeaders.set("X-Robots-Tag", "noindex");
      }
      newHeaders.set("X-Content-Type-Options", "nosniff");
      const html = await response.text();
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
