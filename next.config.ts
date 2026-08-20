import path from "node:path";
import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Deliberately hash-free and nonce-free. Next 16 does document a nonce pattern,
 * but it comes with an explicit cost: "When you use nonces in your CSP, all
 * pages must be dynamically rendered" — static optimisation and CDN caching are
 * disabled. Every route on this site is static, and there is no user data to
 * protect, so trading the entire static build for a marginally stricter
 * script-src would be a bad deal.
 *
 * `'unsafe-inline'` is required for two inline scripts we control: the theme
 * script that runs before paint (removing it reintroduces a flash of the wrong
 * theme) and React's own hydration payload.
 *
 * `'unsafe-eval'` is NOT present: React needs it only in development, and this
 * header is applied to the production build.
 */
const baseCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
];

/*
 * THE /contact CSP WIDENING IS GONE, AND THAT IS THE POINT.
 *
 * This file used to carry a second policy for /contact alone, allowing
 * `script-src https://assets.calendly.com`, `frame-src https://calendly.com`,
 * a Calendly stylesheet, font and `connect-src` channel. It was written for an
 * inline Calendly embed.
 *
 * The embed was deleted on 2026-08-18 and replaced with a first-party composer;
 * the only Calendly surface left anywhere is a plain outbound `<a href>` on
 * /contact. AN ANCHOR NEEDS NO CSP ALLOWANCE — Content-Security-Policy governs
 * what a page may LOAD and EXECUTE, not where a link may navigate. So every
 * directive above was permission for something that no longer exists, and what
 * it permitted was precisely the thing the brief asked to be rid of: a
 * third-party script and an iframe, on the one route that collects a visitor's
 * name, organization and email.
 *
 * /contact now inherits `baseCsp` like every other route. If a Calendly embed is
 * ever wanted again, it cannot be reintroduced quietly — it needs a visible diff
 * to this file, which is what the original comment here wanted and what deleting
 * the widening actually achieves.
 */

const sharedSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "browsing-topics=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  // Superseded by frame-ancestors, kept for older browsers that ignore CSP3.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /**
   * There is an unrelated package-lock.json in the parent directory, so Next
   * inferred the user's home folder as the workspace root and warned on every
   * build. Pinning it removes the warning and the ambiguity.
   */
  turbopack: {
    root: path.join(__dirname),
  },

  async headers() {
    // Order matters: when two rules set the same header key, the LAST one wins.
    // One policy, every route. There is no longer a per-route override, which
    // means there is no longer a route where a third-party script is allowed.
    return [
      {
        source: "/:path*",
        headers: [
          ...sharedSecurityHeaders,
          { key: "Content-Security-Policy", value: baseCsp.join("; ") },
        ],
      },
    ];
  },
};

export default nextConfig;
