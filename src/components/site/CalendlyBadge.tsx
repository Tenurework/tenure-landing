"use client";

import { useEffect } from "react";
import { loadCalendly } from "@/lib/calendly";
import { site } from "@/lib/site";

/**
 * Floating Calendly "Contact Sales" badge, mounted once, site-wide. Matches the
 * founder-provided snippet (grove #1c8c5a, white text, branding off), but loaded
 * defensively so it never double-mounts across client navigations / fast refresh.
 */
export function CalendlyBadge() {
  useEffect(() => {
    let cancelled = false;
    loadCalendly()
      .then(() => {
        if (cancelled) return;
        if (document.querySelector(".calendly-badge-widget")) return; // already placed
        window.Calendly?.initBadgeWidget({
          url: site.calendlyUrl,
          text: site.ctaLabel,
          color: "#1c8c5a",
          textColor: "#ffffff",
          branding: false,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
