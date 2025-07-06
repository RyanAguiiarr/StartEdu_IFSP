import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/StartEdu_IFSP/", // Configuração para GitHub Pages
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
    },
  },
  server: {
    host: true, // permite conexões externas
    allowedHosts: true, // permite qualquer domínio (ex: ngrok)
    port: 3000,
  },
});
