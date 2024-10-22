import { VitePWAOptions } from "vite-plugin-pwa";

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Focus Timer",
    short_name: "Focus Timer",
    description:
      "A downloadable PWA timer app for intense, uninterrupted work sessions. Boost productivity and stay focused on your tasks.",
    theme_color: "#000000",
    background_color: "#000000",
    display: "fullscreen",
    orientation: "any",
    icons: [
      {
        src: "focustimer-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "focustimer-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "focustimer.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};
