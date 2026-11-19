import type { MetadataRoute } from "next";

const SITE = process.env.SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
