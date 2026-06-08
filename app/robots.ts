import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/admin", "/api/"],
    },
    sitemap: "https://trendoptikmersin.com/sitemap.xml",
  };
}
