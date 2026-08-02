import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getRoute } from "@/lib/routes";

/**
 * Builds a complete, route-specific metadata object.
 *
 * Next.js merges metadata from the root layout down **shallowly**, and
 * duplicate keys are replaced wholesale. That has two consequences this helper
 * exists to handle:
 *
 *  1. A page that omits `alternates` inherits the layout's canonical verbatim.
 *     That is how every sub-page came to declare the home page as its canonical
 *     URL, telling search engines the conversion pages were duplicates.
 *  2. A page that sets only `openGraph.title` would drop the parent's
 *     `openGraph.description`. So each route emits its **whole** openGraph and
 *     twitter block rather than patching the parent's.
 *
 * Canonical URLs are passed as relative paths on purpose: they compose against
 * `metadataBase` from the root layout, so the production host is configured in
 * exactly one place.
 */
export function pageMetadata(path: string): Metadata {
  const route = getRoute(path);
  if (!route) {
    throw new Error(
      `pageMetadata("${path}"): no route registered. Add it to src/lib/routes.ts.`,
    );
  }

  const isHome = route.path === "/";
  // The title template appends " · Tenure"; og:title carries the resolved form.
  const fullTitle = isHome
    ? `${site.name}, ${site.tagline}`
    : `${route.title} · ${site.name}`;

  return {
    // The home page inherits the root layout's `title.default`. The key is
    // omitted rather than set to undefined, because metadata is merged by
    // shallow spread — an explicit `title: undefined` would overwrite the
    // parent's title object instead of leaving it alone.
    ...(isHome ? {} : { title: route.title }),
    description: route.description,
    alternates: { canonical: route.path },
    robots: route.indexable
      ? undefined
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: route.path,
      siteName: site.name,
      title: fullTitle,
      description: route.description,
      images: [
        {
          // The real pixel dimensions of public/og.png. These were declared as
          // 1200x630 while the file is a 2x render at the same 1.91:1 ratio.
          // Crawlers lay the card out from the declared size before downloading
          // the image, so a mismatch produces a card sized for an image that
          // never arrives.
          url: "/og.png",
          width: 2400,
          height: 1260,
          alt: `${site.name}, ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: route.description,
      images: ["/og.png"],
    },
  };
}
