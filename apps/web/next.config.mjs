import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_NEXT_LINT === "true"
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_NEXT_TYPECHECK === "true"
  },
  transpilePackages: ["@envoysjobs/ui", "@envoysjobs/types", "@envoysjobs/utils"]
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || process.env.DISABLE_PWA === "true"
})(nextConfig);
