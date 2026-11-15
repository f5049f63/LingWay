import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base нужен для GitHub Pages: сайт открывается по адресу /LingWay/
export default defineConfig({
  base: "/LingWay/",
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
});
