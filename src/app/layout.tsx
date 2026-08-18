import type { Metadata, Viewport } from "next";
import { generalSans, plexMono } from "@/lib/fonts";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ThemeScript } from "@/components/site/ThemeScript";
import { StructuredData } from "@/components/site/StructuredData";
import "./globals.css";

/**
 * Root metadata. Only the pieces that are genuinely site-wide live here —
 * every route supplies its own title, description, canonical, OpenGraph and
 * Twitter block via `pageMetadata()`.
 *
 * `metadataBase` is what lets each route declare a *relative* canonical, so the
 * production host is configured in exactly one place. Note that Next merges
 * metadata shallowly: a route that sets `openGraph.title` alone would drop the
 * parent's `openGraph.description`, which is why no openGraph block is defined
 * here for pages to half-inherit.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: site.founders.map((f) => ({ name: f.name })),
  creator: site.name,
  publisher: site.name,
  // Broadened 2026-08-18. Two of the seven terms named a single vertical
  // ("student organization software", "university administration software") while
  // the product's own audience list covers universities, nonprofits and NGOs,
  // small businesses and associations. Keyword metadata carries little ranking
  // weight, but it is a statement of who the site is for, and this one said
  // "universities only" as clearly as the copy used to.
  keywords: [
    "institutional memory",
    "leadership transition",
    "succession planning",
    "handoff documentation",
    "governed system of record",
    "nonprofit board management",
    "association chapter management",
    "student organization software",
    "small business operations",
  ],
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1118" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // ThemeScript writes data-theme onto this element during HTML parsing,
      // before React hydrates. Without this, React would treat the attribute it
      // did not render as a hydration error and re-render — reintroducing the
      // very flash the script exists to prevent.
      suppressHydrationWarning
      className={`${generalSans.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col bg-canvas text-text">
        {/* First focusable element on every page. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <StructuredData />
        <SmoothScroll>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
