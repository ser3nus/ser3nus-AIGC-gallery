import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ser3nus-AIGC-gallery',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
