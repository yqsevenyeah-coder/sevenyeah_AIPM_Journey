import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/sevenyeah_AIPM_Journey/",
  plugins: [react(), tailwindcss()],
});
