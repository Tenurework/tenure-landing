import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { indexableRoutes } from "@/lib/routes";

/**
 * Served at /sitemap.xml. Previously this route did not exist, so /sitemap.xml
 * returned the 404 page.
 *
 * Every entry is derived from src/lib/routes.ts, so a route cannot be added to
 * the site and silently left out of the sitemap — `seo.spec.ts` asserts the two
 * lists agree.
 *
 * `lastModified` uses the build timestamp rather than a hand-maintained date,
 * because a stale hardcoded date is worse than none: it tells crawlers the page
 * has not changed when it has.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return indexableRoutes.map((route) => ({
    url: `${site.url}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
