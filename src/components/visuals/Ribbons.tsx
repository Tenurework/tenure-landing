import { cn } from "@/lib/cn";

/**
 * Vibrant, flowing green ribbons on a transparent canvas, the organic accent
 * that bleeds into a section's body (no background block), à la Flank.
 */
export function Ribbons({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 460"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* The ramp is derived entirely from --accent (and its hover step) so it
            tracks the theme. "Lighter" is expressed as transparency rather than
            a paler literal: a pale mint tint reads as a highlight on the paper
            canvas but glows on the dark one, whereas a partly transparent
            accent settles onto whatever is behind it in either theme. */}
        <linearGradient id="rb-a" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="35%" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--accent) 55%, transparent)" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="rb-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-hover)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--accent) 40%, transparent)" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="rb-c" x1="1" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--accent) 50%, transparent)" stopOpacity="0" />
          <stop offset="50%" stopColor="color-mix(in oklab, var(--accent) 50%, transparent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--accent) 50%, transparent)" stopOpacity="0" />
        </linearGradient>
        <filter id="rb-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <g fill="none" strokeLinecap="round" filter="url(#rb-soft)">
        <path
          d="M700 -10 C 470 70, 360 30, 150 230 S -40 360, -120 470"
          stroke="url(#rb-a)"
          strokeWidth="64"
          opacity="0.85"
        />
        <path
          d="M720 60 C 500 120, 380 110, 200 300 S 20 430, -80 540"
          stroke="url(#rb-b)"
          strokeWidth="44"
          opacity="0.8"
        />
        <path
          d="M690 -30 C 520 30, 430 10, 280 170 S 110 300, 10 400"
          stroke="url(#rb-c)"
          strokeWidth="22"
          opacity="0.9"
        />
        <path
          d="M740 140 C 540 180, 430 200, 260 360 S 80 470, -40 560"
          stroke="url(#rb-c)"
          strokeWidth="14"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
