/**
 * Single source of truth for every public route.
 *
 * `sitemap.ts`, the per-route metadata helper, the header/footer navigation and
 * the SEO test suite all read from this one list, so a route cannot exist
 * without a canonical URL, a description, and an indexing decision. Adding a
 * page here and nowhere else is enough to get it correctly indexed.
 *
 * `description` is written for the route's own intent — deliberately not the
 * site-wide paragraph. Search engines truncate around 155-160 characters, so
 * these are kept under that; `seo.spec.ts` enforces it.
 */

export type RouteDef = {
  /** Path, always with a leading slash. `/` is the home page. */
  path: string;
  /** Page title, without the " · Tenure" suffix the template adds. */
  title: string;
  /** Route-specific meta description. */
  description: string;
  /** Sitemap priority. Home is 1.0; conversion pages rank above legal. */
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** False keeps the route out of the sitemap and marks it noindex. */
  indexable: boolean;
};

export const routes = [
  {
    path: "/",
    title: "Tenure",
    description:
      "People move on, the know-how stays. Tenure attaches an organization's money, decisions, files and context to the durable seat, not the person in it.",
    priority: 1.0,
    changeFrequency: "monthly",
    indexable: true,
  },
  {
    path: "/product",
    title: "Product",
    description:
      "How the durable seat works: finance, events, approvals, members and memory in one governed record, plus the handoff packet the next officer inherits.",
    priority: 0.9,
    changeFrequency: "monthly",
    indexable: true,
  },
  {
    path: "/pilot",
    title: "Pilot",
    description:
      "A planned Fall 2026 pilot with Simon's Office of Student Engagement: scope, who does what, onboarding inputs, support model and how success is measured.",
    priority: 0.9,
    changeFrequency: "monthly",
    indexable: true,
  },
  {
    path: "/trust",
    title: "Trust & security",
    description:
      "Tenant isolation, seat-based access, audit behaviour, encryption, our AI subprocessor, and what is live versus planned. Written for security review.",
    priority: 0.8,
    changeFrequency: "monthly",
    indexable: true,
  },
  {
    path: "/story",
    title: "Story",
    description:
      "Why Tenure exists: what we watched happen to good organizations every spring at Simon Business School, and who is building the answer.",
    priority: 0.6,
    changeFrequency: "yearly",
    indexable: true,
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Book a walkthrough of Tenure or email the founders directly. No form required — scheduling opens only when you ask for it.",
    priority: 0.7,
    changeFrequency: "yearly",
    indexable: true,
  },
  {
    path: "/privacy",
    title: "Privacy",
    description:
      "What Tenure collects, how it is used, who can see it, and the AI subprocessor that processes record text — in plain language.",
    priority: 0.3,
    changeFrequency: "yearly",
    indexable: true,
  },
  {
    path: "/terms",
    title: "Terms",
    description:
      "The terms for using Tenure during early access and the planned Fall 2026 pilot.",
    priority: 0.3,
    changeFrequency: "yearly",
    indexable: true,
  },
] as const satisfies readonly RouteDef[];

export type RoutePath = (typeof routes)[number]["path"];

/** Routes that belong in sitemap.xml and may be indexed. */
export const indexableRoutes = routes.filter((r) => r.indexable);

export function getRoute(path: string): RouteDef | undefined {
  return routes.find((r) => r.path === path);
}
