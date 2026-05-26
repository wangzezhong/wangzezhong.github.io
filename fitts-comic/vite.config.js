import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT — set "base" to match your repo name on GitHub.
// Final URL will be: https://<USERNAME>.github.io/<base>/
// Default here is "/fitts-comic/" because the README assumes
// the repo is also called "fitts-comic".
// Rename: change BOTH this string AND the repo name on GitHub.
export default defineConfig({
  plugins: [react()],
  base: "/fitts-comic/",
});
