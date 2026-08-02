import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { routes } from "@/lib/routes";

/**
 * Served at /robots.txt. Previously this route did not exist, so /robots.txt
 * returned the 404 page and nothing advertised the sitemap.
 *
 * The `sitemap` key is a top-level sibling of `rules` (not nested inside one)
 * and takes an absolute URL — it is not composed against `metadataBase`.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = routes.filter((r) => !r.indexable).map((r) => r.path);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      ...(disallow.length > 0 ? { disallow } : {}),
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
