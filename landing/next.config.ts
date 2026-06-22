import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-8ea5c2fb30814a8ea5a4726bc8a453d3.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-0a313ba028f9423cba4b9803d081b5db.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
