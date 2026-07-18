"use client";

import type { ReactNode } from "react";
import { buttonClasses, Arrow, type Variant, type Size } from "@/components/ui/Button";
import { openCalendlyPopup } from "@/lib/calendly";
import { site } from "@/lib/site";

/**
 * The primary conversion CTA. Opens the Calendly scheduling popup for
 * satvikwithtenure, same visual as <Button variant="primary" /> so it drops in
 * anywhere the old "Book a demo" button lived.
 */
export function ContactSales({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
}: {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => openCalendlyPopup(site.calendlyUrl)}
      className={buttonClasses(variant, size, className)}
      aria-haspopup="dialog"
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children ?? site.ctaLabel}
        {arrow && <Arrow />}
      </span>
    </button>
  );
}

/** Inline text-link variant of the same action, for prose / footers. */
export function ContactSalesLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => openCalendlyPopup(site.calendlyUrl)}
      className={className}
      aria-haspopup="dialog"
    >
      {children ?? site.ctaLabel}
    </button>
  );
}
