import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@react-router/cloudflare";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflare(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
