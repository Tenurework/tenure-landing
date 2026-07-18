import { cn } from "@/lib/cn";

const ANGLES = [0, 60, 120, 180, 240, 300];
const PETAL = "M16 16 C 12.4 10.5, 12.4 5.4, 16 3.4 C 19.6 5.4, 19.6 10.5, 16 16 Z";

/**
 * Tenure logomark, a clean, flat six-petal bloom. Symmetric (not a pinwheel),
 * single color via `currentColor`, no tile and no circles. Set the color with a
 * text-* class on the element (e.g. text-grove on light, text-paper on dark).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("block", className)}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {ANGLES.map((a) => (
        <path key={a} d={PETAL} transform={`rotate(${a} 16 16)`} />
      ))}
    </svg>
  );
}
