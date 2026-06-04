import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: ["@envoysjobs/ui", "@envoysjobs/types", "@envoysjobs/utils"],
  ...(process.env.NEXT_STANDALONE === "1" && {
    output: "standalone",
    outputFileTracingRoot: path.resolve(__dirname, "../..")
  })
};

const isPWA =
  process.env.DISABLE_PWA !== "true" && process.env.NODE_ENV !== "development";

let finalConfig = nextConfig;
if (isPWA) {
  const { default: withPWA } = await import("next-pwa");
  finalConfig = withPWA({ dest: "public" })(nextConfig);
}

export default finalConfig;
