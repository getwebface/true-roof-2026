import type { Config } from "@react-router/dev/config";

export default {
  // This tells React Router to build a Worker for Cloudflare Pages
  ssr: true,
} satisfies Config;
