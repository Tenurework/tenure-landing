import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** The "registrar" label, a mono eyebrow with an optional record index. */
export function Eyebrow({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 label-mono", className)}>
      <span aria-hidden className="h-px w-6 bg-grove/60" />
      {index && <span className="text-grove">{index}</span>}
      <span>{children}</span>
    </span>
  );
}

/** A hairline rule with a faint brass bleed, a ledger line. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-line", className)} />;
}
