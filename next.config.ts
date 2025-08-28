import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      eslint: {
    ignoreDuringBuilds: true, // Linting errors ko skip karega
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript errors ko skip karega
  },
//  output: 'export',
};

export default nextConfig;
