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

/**
 * THE SEED, AND WHY A FIVE-VARIANT SYSTEM STILL LOOKED LIKE ONE SECTION REPEATED.
 *
 * `Backdrop` took only `variant`, and the site uses `quiet` twelve times and
 * `drafting` eight. Two calls with the same variant were therefore pixel
 * identical — same wash offsets, same mask origin, same grid pitch, same
 * contour, and the same Memphis figure bled off the same edge. The purple
 * triangle and green zigzag appear at least six times across the site, always
 * sliced mid-figure at a viewport edge, and on the home page `drafting` fires
 * three times. The variants existed; the variation did not.
 *
 * `seed` supplies the variation. Each table below is a different length — 4, 5,
 * 3, 9, 6 — so the combined cycle does not realign for far longer than any page
 * is sections long: two sections sharing a variant get a different composition
 * unless their seeds differ by the product of those lengths.
 *
 * The ornament table also carries the CORNER. The old layout bled every figure
 * off the left or right edge at a fixed offset, so a reader met the same sliced
 * triangle repeatedly; rotating the corner alongside the figure means a repeat
 * has to match on two axes before it reads as a repeat.
 */
const WASH: readonly { a: string; b: string }[] = [
  { a: "-top-[22%] left-[-10%]", b: "right-[-8%] top-[-6%]" },
  { a: "top-[-14%] right-[-12%]", b: "left-[-6%] bottom-[-18%]" },
  { a: "bottom-[-26%] left-[6%]", b: "right-[-14%] top-[18%]" },
  { a: "top-[6%] left-[-18%]", b: "right-[2%] bottom-[-22%]" },
];

/**
 * Where the masked texture is densest. Never the same place twice running.
 *
 * COMPLETE CLASS LITERALS, not fragments interpolated at render time. Tailwind
 * v4 finds class names by scanning source text, so `[mask-image:...${origin}...]`
 * built in a template literal emits no CSS at all — the layer would silently
 * render unmasked, which on a full-bleed texture is the performance defect
 * SectionContour.tsx measured. The end stop is normalised to 74% across the set
 * for the same reason: one literal per entry, no arithmetic.
 */
const ORIGIN: readonly string[] = [
  "[mask-image:radial-gradient(62%_58%_at_20%_86%,black,transparent_74%)]",
  "[mask-image:radial-gradient(58%_62%_at_82%_14%,black,transparent_74%)]",
  "[mask-image:radial-gradient(66%_54%_at_50%_8%,black,transparent_74%)]",
  "[mask-image:radial-gradient(54%_66%_at_12%_38%,black,transparent_74%)]",
  "[mask-image:radial-gradient(60%_60%_at_88%_74%,black,transparent_74%)]",
];

/** Drafting-grid pitch. A different rhythm reads as a different surface. */
const PITCH: readonly string[] = ["[--grid:56px]", "[--grid:72px]", "[--grid:88px]"];

/** The nine contour assets that already ship in public/contours/. */
const CONTOUR: readonly number[] = [1, 2, 3, 4, 5, 6, 8, 11, 0];

/**
 * Figure, corner, and the direction it fades out. Six entries, so the ornament
 * outruns every other table and two sections have to agree on five independent
 * choices before they read as the same picture.
 *
 * The corner travels WITH the figure. Every ornament used to bleed off the left
 * or right edge at a fixed offset, so the same purple triangle and green zigzag
 * met the reader six times down the site, always sliced at the same place.
 */
const ORNAMENT: readonly { v: "arcs" | "terrazzo" | "signal"; pos: string; fade: string }[] = [
  { v: "arcs", pos: "-right-20 top-[2%]", fade: "[mask-image:linear-gradient(250deg,black,black_34%,transparent_78%)]" },
  { v: "signal", pos: "-left-24 bottom-[-12%]", fade: "[mask-image:linear-gradient(65deg,black,black_34%,transparent_78%)]" },
  { v: "terrazzo", pos: "-right-16 bottom-[-10%]", fade: "[mask-image:linear-gradient(300deg,black,black_34%,transparent_78%)]" },
  { v: "signal", pos: "-right-24 top-[6%]", fade: "[mask-image:linear-gradient(215deg,black,black_34%,transparent_78%)]" },
  { v: "arcs", pos: "-left-20 bottom-[-14%]", fade: "[mask-image:linear-gradient(40deg,black,black_34%,transparent_78%)]" },
  { v: "terrazzo", pos: "-left-16 top-[-8%]", fade: "[mask-image:linear-gradient(115deg,black,black_34%,transparent_78%)]" },
  // SEVEN, and seven on purpose. With six entries the home page collided: the
  // Problem section (seed 1) and OfficeConsole (seed 7) are both `drafting` and
  // 1 % 6 === 7 % 6, so the identical zigzag bled off the identical corner twice
  // down one page — the exact defect the seed exists to remove. Seven is prime
  // and coprime with 4, 5, 3 and 9, so no two of the five tables can realign
  // within any page this site will ever have.
  { v: "arcs", pos: "-right-24 bottom-[-16%]", fade: "[mask-image:linear-gradient(325deg,black,black_34%,transparent_78%)]" },
];

const pick = <T,>(table: readonly T[], seed: number): T =>
  table[((seed % table.length) + table.length) % table.length];

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
  seed = 0,
  className,
}: {
  variant?: BackdropVariant;
  /**
   * Which composition of this variant to paint. Sections sharing a variant must
   * pass different seeds, or they render identically — which is the defect this
   * parameter exists to remove. See the note above the tables.
   */
  seed?: number;
  className?: string;
}) {
  const wash = pick(WASH, seed);
  const origin = pick(ORIGIN, seed);
  const pitch = pick(PITCH, seed);
  const contour = pick(CONTOUR, seed);
  const orn = pick(ORNAMENT, seed);
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {variant === "aurora" && (
        <>
          {/* Three washes, deliberately off-centre and different sizes: a single
              centred radial reads as a vignette, which is the look this replaces. */}
          <div className={cn("absolute h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_13%,transparent),transparent_64%)]", wash.a)} />
          <div className={cn("absolute h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--chart-3)_11%,transparent),transparent_66%)]", wash.b)} />
          <div className="absolute bottom-[-30%] left-[38%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--chart-5)_8%,transparent),transparent_68%)]" />
          <div className="absolute inset-x-0 top-0 h-[86%] text-grove/[0.11] [mask-image:radial-gradient(78%_72%_at_58%_16%,black,transparent_78%)]">
            <ContourMask seed={contour} />
          </div>
          <div className={cn("absolute inset-0 text-ink/[0.05] hairline-grid", pitch, origin)} />
          <div className={cn("absolute hidden h-[30rem] w-[30rem] opacity-[0.42] sm:block", orn.pos, orn.fade)}>
            <MemphisArt variant={orn.v} />
          </div>
          <div className="absolute inset-0 grain opacity-[0.035] mix-blend-overlay" />
        </>
      )}

      {variant === "drafting" && (
        <>
          <div className={cn("absolute inset-0 text-ink/[0.055] hairline-grid", pitch, origin)} />
          <div className={cn("absolute h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--chart-2)_9%,transparent),transparent_66%)]", wash.a)} />
          <div className={cn("absolute h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_68%)]", wash.b)} />
          <div className={cn("absolute hidden h-[26rem] w-[26rem] opacity-[0.38] sm:block", orn.pos, orn.fade)}>
            <MemphisArt variant={orn.v} />
          </div>
          <div className="absolute inset-0 grain opacity-[0.03] mix-blend-overlay" />
        </>
      )}

      {variant === "quiet" && (
        <>
          <div className={cn("absolute inset-0 text-ink/[0.07] dot-grid [--grid:26px]", origin)} />
          <div className={cn("absolute h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_70%)]", wash.a)} />
          <div className="absolute inset-0 grain opacity-[0.025] mix-blend-overlay" />
        </>
      )}

      {variant === "band" && (
        <>
          <div className="absolute inset-0 [background:radial-gradient(58%_62%_at_26%_18%,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_70%)]" />
          <div className="absolute inset-0 [background:radial-gradient(46%_50%_at_86%_88%,color-mix(in_oklab,var(--chart-5)_14%,transparent),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-[92%] w-[56%] text-inverse/[0.07] [mask-image:radial-gradient(72%_72%_at_86%_84%,black,transparent_74%)]">
            <ContourMask seed={contour} />
          </div>
          <div className={cn("absolute inset-0 text-inverse/[0.05] hairline-grid", pitch, origin)} />
          <div className={cn("absolute hidden h-[24rem] w-[24rem] opacity-[0.5] sm:block", orn.pos, orn.fade)}>
            <MemphisArt variant={orn.v} />
          </div>
          <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
        </>
      )}

      {variant === "signal" && (
        <>
          <div className="absolute inset-0 [background:radial-gradient(56%_64%_at_50%_44%,color-mix(in_oklab,var(--accent)_17%,transparent),transparent_72%)]" />
          <div className="absolute inset-0 text-inverse/[0.09] [mask-image:radial-gradient(76%_76%_at_50%_50%,black,transparent_80%)]">
            <ContourMask seed={contour} />
          </div>
          <div className={cn("absolute h-[20rem] w-[20rem] opacity-[0.55]", orn.pos, orn.fade)}>
            <MemphisArt variant={orn.v} />
          </div>
          <div className="absolute inset-0 grain opacity-[0.05] mix-blend-overlay" />
        </>
      )}
    </div>
  );
}
