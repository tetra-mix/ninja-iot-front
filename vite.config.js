import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import env from "vite-plugin-env-compatible";
import { VitePWA } from 'vite-plugin-pwa';
import { defaultConfig, getColorModeScript } from "@yamada-ui/react";

//プラグイン追加
function injectScript(){
  return {
    name: "vite-plugin-inject-scripts",
    transformIndexHtml(html) {
      const content = getColorModeScript({
        initialColorMode: defaultConfig.initialColorMode,
      });

      return html.replace("<body>", `<body><script>${content}</script>`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/ninja-iot-front',
  plugins: [
    react(),
    env({ prefix: "VITE", mountedPath: "process.env" }),
    injectScript(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      injectRegister: 'auto', //ここの記述
      manifest: {
        name: 'プレイヤー検知システム',
        short_name: 'NinjaIOT', 
        description: 'NinjaかくれんぼIOTの鬼側プレイヤー検知システム',
        theme_color: '#000000',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
});