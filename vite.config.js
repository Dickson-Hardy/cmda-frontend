import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Users choose when to reload. This prevents an update from interrupting
      // a form, a checkout, or a payment in progress.
      registerType: "prompt",
      injectRegister: false,
      filename: "sw-v4.js",
      includeAssets: ["CMDALOGO_white.png", "icons/*.png"],
      manifest: {
        id: "/",
        name: "CMDA Nigeria - Christian Medical And Dental Association",
        short_name: "CMDA Nigeria",
        description:
          "The Christian Medical and Dental Association of Nigeria - A network of Christian Medical and Dental practitioners.",
        theme_color: "#994279",
        background_color: "#FDFBFC",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
        orientation: "any",
        start_url: "/",
        scope: "/",
        categories: ["health", "medical", "education", "lifestyle"],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          {
            name: "Events",
            short_name: "Events",
            description: "Browse upcoming CMDA events",
            url: "/conferences",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Support",
            short_name: "Support",
            description: "Contact CMDA support",
            url: "/support",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
        ],
        share_target: {
          action: "/support",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
          params: { title: "title", text: "text", url: "url" },
        },
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Only public pages are available offline. Auth, payments and support
        // embeds must always hit the network.
        navigateFallbackDenylist: [
          /^\/apk\//,
          /^\/dashboard(?:\/|$)/,
          /^\/login(?:\/|$)/,
          /^\/signup(?:\/|$)/,
          /^\/verify-email(?:\/|$)/,
          /^\/forgot-password(?:\/|$)/,
          /^\/reset-password(?:\/|$)/,
          /^\/change-password(?:\/|$)/,
          /^\/support\/embed(?:\/|$)/,
        ],
        cleanupOutdatedCaches: true,
        // Activate a newly installed worker immediately so a stale cached
        // bundle can never trap users on an old (possibly broken) build.
        // clientsClaim stays false so the current page is not yanked away
        // mid-form or mid-payment; the new assets apply on next navigation.
        skipWaiting: true,
        clientsClaim: false,
        importScripts: ["sw-sync.js", "sw-push.js"],
        runtimeCaching: [
          // Never cache authenticated or payment-related API responses in a
          // shared service-worker cache.
          {
            urlPattern: ({ url }) =>
              url.hostname === "cmdabackend-38258a63fa98.herokuapp.com" ||
              url.pathname.startsWith("/api/"),
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "public-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
