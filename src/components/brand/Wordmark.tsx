import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

export function Wordmark({
  className,
  href = "/",
  tone = "ink",
}: {
  className?: string;
  href?: string;
  tone?: "ink" | "paper";
}) {
  return (
    // Plain anchor (not next/link) so clicking the logo does a full page refresh.
    <a
      href={href}
      aria-label="Tenure, home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <Logo className="h-[1.7rem] w-[1.7rem] text-grove transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90" />
      <span
        className={cn(
          "font-display text-[1.4rem] font-semibold leading-none tracking-[-0.03em]",
          tone === "paper" ? "text-paper" : "text-ink",
        )}
      >
        Tenure
      </span>
    </a>
  );
}
