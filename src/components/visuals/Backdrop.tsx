import { cn } from "@/lib/cn";
import { ContourMask } from "@/components/visuals/SectionContour";
import { MemphisArt } from "@/components/visuals/MemphisArt";

/**
 * The section backdrop, as one composed layer instead of a flat fill.
 *
 * Every section used to be `bg-paper` or `bg-sand` with one faded contour in a
 * corner, which is why eleven of them read as the same section repeated. A
 * backdrop here is four stacked ingredients, and each variant picks a different
 * combination so consecutive sections cannot look alike:
 *
 *   mesh      two or three wide radial washes in brand hues
 *   structure a drafting grid, a dot field, or the contour topography
 *   ornament  a Memphis figure, bled off one edge
 *   grain     a 120px noise tile at 2-4%, which is what stops a large gradient
 *             from banding on an 8-bit display
 *
 * THE INVARIANT: this renders an `aria-hidden` layer that is a SIBLING of the
 * section's content, never an ancestor of it, and it is always `-z-10` inside an
 * `isolate`d section. globals.css records why at length — the short version is
 * that the contrast gate resolves a text node's backdrop by climbing its
 * ancestors, so a texture on a copy-bearing element either switches the check
 * off (`url()`) or fails it against a gradient stop nobody can see.
 *
 * Every layer is also masked. That is a performance requirement, not a taste
 * one: an unmasked full-bleed texture makes the compositor consider the whole
 * page, and the measurement behind that claim is in SectionContour.tsx.
 */

export type BackdropVariant =
  /** Hero: warm mesh, contour topography, arcs bleeding off the right. */
  | "aurora"
  /** Alternating light section: cool mesh over a drafting grid. */
  | "drafting"
  /** Quiet section: dot field with a single wash. Nothing ornamental. */
  | "quiet"
  /** Navy band: deep radial with terrazzo and a contour. */
  | "band"
  /** Closing surfaces: signal zigzag with a centred wash. */
  | "signal";

export function Backdrop({
  variant = "quiet",
  className,
}: {
  variant?: BackdropVariant;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {variant === "aurora" && (
        <>
          {/* Three washes, deliberately off-centre and different sizes: a single
              centred radial reads as a vignette, which is the look this replaces. */}
          <div className="absolute -top-[22%] left-[-10%] h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_13%,transparent),transparent_64%)]" />
          <div className="absolute right-[-8%] top-[-6%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--chart-3)_11%,transparent),transparent_66%)]" />
          <div className="absolute bottom-[-30%] left-[38%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--chart-5)_8%,transparent),transparent_68%)]" />
          <div className="absolute inset-x-0 top-0 h-[86%] text-grove/[0.11] [mask-image:radial-gradient(78%_72%_at_58%_16%,black,transparent_78%)]">
            <ContourMask seed={1} />
          </div>
          <div className="absolute inset-0 text-ink/[0.05] hairline-grid [--grid:88px] [mask-image:radial-gradient(62%_58%_at_20%_86%,black,transparent_74%)]" />
          <div className="absolute -right-16 top-[6%] hidden h-[26rem] w-[26rem] opacity-[0.14] lg:block [mask-image:linear-gradient(255deg,black,transparent_72%)]">
            <MemphisArt variant="arcs" />
          </div>
          <div className="absolute inset-0 grain opacity-[0.035] mix-blend-overlay" />
        </>
      )}

      {variant === "drafting" && (
        <>
          <div className="absolute inset-0 text-ink/[0.055] hairline-grid [--grid:56px] [mask-image:radial-gradient(70%_65%_at_78%_18%,black,transparent_76%)]" />
          <div className="absolute left-[-14%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--chart-2)_9%,transparent),transparent_66%)]" />
          <div className="absolute bottom-[-24%] right-[6%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_68%)]" />
          <div className="absolute -left-20 bottom-[-8%] hidden h-[22rem] w-[22rem] opacity-[0.13] lg:block [mask-image:linear-gradient(70deg,black,transparent_74%)]">
            <MemphisArt variant="terrazzo" />
          </div>
          <div className="absolute inset-0 grain opacity-[0.03] mix-blend-overlay" />
        </>
      )}

      {variant === "quiet" && (
        <>
          <div className="absolute inset-0 text-ink/[0.07] dot-grid [--grid:26px] [mask-image:radial-gradient(60%_60%_at_88%_10%,black,transparent_72%)]" />
          <div className="absolute left-[16%] top-[-18%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_70%)]" />
          <div className="absolute inset-0 grain opacity-[0.025] mix-blend-overlay" />
        </>
      )}

      {variant === "band" && (
        <>
          <div className="absolute inset-0 [background:radial-gradient(58%_62%_at_26%_18%,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_70%)]" />
          <div className="absolute inset-0 [background:radial-gradient(46%_50%_at_86%_88%,color-mix(in_oklab,var(--chart-5)_14%,transparent),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-[92%] w-[56%] text-inverse/[0.07] [mask-image:radial-gradient(72%_72%_at_86%_84%,black,transparent_74%)]">
            <ContourMask seed={11} />
          </div>
          <div className="absolute inset-0 text-inverse/[0.05] hairline-grid [--grid:72px] [mask-image:radial-gradient(58%_56%_at_14%_84%,black,transparent_72%)]" />
          <div className="absolute -left-14 top-[-4%] hidden h-[20rem] w-[20rem] opacity-[0.2] lg:block [mask-image:linear-gradient(120deg,black,transparent_76%)]">
            <MemphisArt variant="terrazzo" />
          </div>
          <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
        </>
      )}

      {variant === "signal" && (
        <>
          <div className="absolute inset-0 [background:radial-gradient(56%_64%_at_50%_44%,color-mix(in_oklab,var(--accent)_17%,transparent),transparent_72%)]" />
          <div className="absolute inset-0 text-inverse/[0.09] [mask-image:radial-gradient(76%_76%_at_50%_50%,black,transparent_80%)]">
            <ContourMask seed={3} />
          </div>
          <div className="absolute -left-12 bottom-[-12%] hidden h-[18rem] w-[18rem] opacity-[0.22] sm:block [mask-image:linear-gradient(60deg,black,transparent_78%)]">
            <MemphisArt variant="signal" />
          </div>
          <div className="absolute -right-12 top-[-14%] hidden h-[18rem] w-[18rem] opacity-[0.18] sm:block [mask-image:linear-gradient(240deg,black,transparent_78%)]">
            <MemphisArt variant="arcs" />
          </div>
          <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
        </>
      )}
    </div>
  );
}
