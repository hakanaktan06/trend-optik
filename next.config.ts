import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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
