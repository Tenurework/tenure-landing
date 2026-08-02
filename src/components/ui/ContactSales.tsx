import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClasses, Arrow, type Variant, type Size } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * The primary conversion CTA.
 *
 * This used to be a <button> that called Calendly's popup API. That path had a
 * silent failure mode: `openCalendlyPopup` awaited the third-party script and
 * only then fell back to `window.open`, which is outside the user-gesture
 * window, so popup blockers dropped it. With calendly.com blocked — routine on
 * university networks and with any content blocker — every CTA on the site did
 * nothing at all. Verified against production before this change.
 *
 * It is now a plain link to a first-party route. It works with JavaScript
 * disabled, is middle-clickable, is announced correctly as a link, and cannot
 * be blocked. Scheduling loads on /contact, after intent — which also takes
 * Calendly's script, CSS and cookie banner off every other page.
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
    <Link href="/contact" className={buttonClasses(variant, size, className)}>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children ?? site.ctaLabel}
        {arrow && <Arrow />}
      </span>
    </Link>
  );
}

/** Inline text-link variant of the same action, for prose and footers. */
export function ContactSalesLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Link href="/contact" className={className}>
      {children ?? site.ctaLabel}
    </Link>
  );
}
