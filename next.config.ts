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

/**
 * /contact is the only route allowed to reach Calendly, and only after the
 * visitor asks. Widening the policy for one route rather than site-wide means a
 * third-party script cannot be introduced anywhere else without this file
 * changing — which is a reviewable diff rather than an invisible regression.
 */
const contactCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://*.calendly.com",
  "font-src 'self' data: https://assets.calendly.com",
  "connect-src 'self' https://*.calendly.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src https://calendly.com https://*.calendly.com",
  "object-src 'none'",
  "base-uri 'self'",
  "upgrade-insecure-requests",
];

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
    // The strict site-wide policy is declared first so the wider /contact
    // policy can override it, not the other way round.
    return [
      {
        source: "/:path*",
        headers: [
          ...sharedSecurityHeaders,
          { key: "Content-Security-Policy", value: baseCsp.join("; ") },
        ],
      },
      {
        source: "/contact",
        headers: [
          ...sharedSecurityHeaders,
          { key: "Content-Security-Policy", value: contactCsp.join("; ") },
        ],
      },
    ];
  },
};

export default nextConfig;
