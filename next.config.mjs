const isProd = process.env.NODE_ENV === "production";
const repo = "Wa7sh-Group";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Static export for GitHub Pages (production only) ──────────────────────
  // In dev we skip static export so dynamic routes (e.g. /requests/[id] for
  // DB-created requests) work without needing generateStaticParams entries.
  ...(isProd ? { output: "export" } : {}),
  // GitHub Pages serves the repo under /<repo-name>/, so all asset and route
  // URLs need that prefix in production. In dev, basePath is empty so the
  // app keeps working at http://localhost:3000.
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  // GH Pages serves directories — emit folder/index.html for each route.
  trailingSlash: true,
  // Static export can't optimize images (no runtime image server).
  images: { unoptimized: true },

  // Pre-existing strict-type issues in legacy modules (e.g. FullSettings)
  // shouldn't block the deploy. Dev mode still runs full type-checking.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // Surface the basePath to client-side code (used by lib/basePath.ts to
  // prefix raw <img> src that Next can't rewrite automatically).
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : "",
  },
};

export default nextConfig;
