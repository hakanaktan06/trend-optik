import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/eski-urunler',
        destination: '/katalog',
        permanent: true,
      },
      // You can add more legacy redirects here
    ];
  },
};

export default nextConfig;
