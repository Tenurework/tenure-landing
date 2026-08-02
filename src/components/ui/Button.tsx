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

const variants: Record<Variant, string> = {
  primary:
    "bg-grove text-on-accent hover:bg-grove-bright active:translate-y-px " +
    "shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--accent)_70%,transparent)] " +
    "hover:shadow-[0_18px_40px_-14px_color-mix(in_oklab,var(--accent-hover)_75%,transparent)]",
  secondary:
    "bg-cloud text-ink border border-line hover:border-ink/20 hover:bg-sand/60 " +
    "shadow-[var(--shadow-sm)]",
  outline:
    "border border-grove/30 text-grove-deep bg-grove-mist/40 hover:bg-grove-soft hover:border-grove/50",
  light:
    "bg-cloud/10 text-inverse border border-text-inverse/25 backdrop-blur-sm hover:bg-cloud/15 hover:border-text-inverse/40",
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
