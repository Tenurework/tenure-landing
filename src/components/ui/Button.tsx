import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Variant = "primary" | "secondary" | "ghost" | "light" | "outline";
export type Size = "sm" | "md" | "lg";

const base =
  "sheen group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium leading-none " +
  "transition-[background,border-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grove " +
  "disabled:pointer-events-none disabled:opacity-50";

/**
 * BORDERS ON THESE CONTROLS ARE LOAD-BEARING, so they use load-bearing tokens.
 *
 * `secondary` and `outline` have a near-canvas fill — white on warm paper is
 * 1.07:1 in the light theme, surface on canvas is 1.08:1 in the dark one — so
 * the border is the only thing that says "this is a control". Both used to draw
 * it with `border-line` (`--border`, the decorative hairline: 1.24:1 light,
 * 1.39:1 dark) or a 30%-alpha accent, which put "Explore the platform", "See
 * the product" and "Or pick a time here" below the 3:1 that WCAG 2.2 SC 1.4.11
 * requires of the visual information identifying a component. `--shadow-sm`
 * carries no rescue: it is a 6%-alpha 1px offset.
 *
 * They now use the tokens globals.css defines for exactly this and that
 * scripts/check-contrast.mjs holds to the 3:1 non-text threshold in BOTH themes:
 *   secondary -> `border-strong`  (3:1+ vs canvas and surface, checked in CI)
 *   outline   -> `grove-deep` = `--accent-text` (checked at 4.5:1 vs canvas,
 *                surface and the faint accent fill it sits on, so it clears the
 *                non-text bar with room and keeps the variant's accent identity
 *                instead of flattening it to grey)
 *
 * Both hovers strengthen the line rather than fading it (`ink-soft` /
 * `grove-bright`), so the boundary is never weaker in any state than it is at
 * rest — the previous `hover:border-ink/20` was itself under 3:1.
 *
 * `primary` is untouched: it is a solid accent fill whose label contrast is
 * already verified, and its boundary is the fill itself, not a line.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-grove text-on-accent hover:bg-grove-bright active:translate-y-px " +
    "shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)] " +
    "hover:shadow-[0_18px_40px_-14px_color-mix(in_oklab,var(--accent-hover)_75%,transparent)]",
  secondary:
    "bg-cloud text-ink border border-border-strong hover:border-ink-soft hover:bg-sand/60 " +
    "shadow-[var(--shadow-sm)]",
  outline:
    "border border-grove-deep text-grove-deep bg-grove-mist/40 hover:bg-grove-soft hover:border-grove-bright",
  light:
    "bg-cloud/10 text-inverse border border-inverse/25 backdrop-blur-sm hover:bg-cloud/15 hover:border-inverse/40",
  ghost: "text-ink-soft hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.85rem]",
  md: "h-11 px-5 text-[0.93rem]",
  lg: "h-[3.25rem] px-7 text-[1rem]",
};

/** Shared class builder so ContactSales / other custom triggers match Button 1:1. */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = {
  href?: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Arrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-[3px]"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = buttonClasses(variant, size, className);
  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
      {arrow && <Arrow />}
    </span>
  );

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
