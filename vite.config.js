import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      filename: "sw-v2.js",
      includeAssets: ["favicon.ico", "CMDALOGO_white.png"],
      manifest: {
        name: "CMDA Nigeria - Christian Medical And Dental Association",
        short_name: "CMDA Nigeria",
        description:
          "The Christian Medical and Dental Association of Nigeria - A network of Christian Medical and Dental practitioners.",
        theme_color: "#994279",
        background_color: "#FDFBFC",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "https://cmdanigeria.org/wp-content/uploads/2019/12/christian-medical-and-dental-association-nigeria.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "https://cmdanigeria.org/wp-content/uploads/2019/12/christian-medical-and-dental-association-nigeria.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "https://cmdanigeria.org/wp-content/uploads/2019/12/christian-medical-and-dental-association-nigeria.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallbackDenylist: [/^\/apk\//],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cmdabackend-38258a63fa98\.herokuapp\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
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
