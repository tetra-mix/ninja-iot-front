import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import env from "vite-plugin-env-compatible";
import { defaultConfig, getColorModeScript } from "@yamada-ui/react";

//プラグイン追加
function injectScript(){
  return {
    name: "vite-plugin-inject-scripts",
    transformIndexHtml(html, ctx) {
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
  ],
});