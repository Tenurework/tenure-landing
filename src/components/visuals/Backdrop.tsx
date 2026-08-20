import { cn } from "@/lib/cn";

/**
 * THE SECTION BACKDROP: LIGHT, STRUCTURE, VOID. Three variants, no ornament.
 *
 * WHAT THIS REPLACED, AND WHY ALL OF IT WENT.
 *
 * The previous system was five variants driven by a five-table seed mechanism —
 * wash offsets, mask origins, grid pitches, contour assets and a table of
 * Memphis figures whose length had to be coprime with the others so the figures
 * would not repeat down a page. Sixty lines of this file reasoned about that.
 *
 * None of it was needed, because the thing it was arranging should not have been
 * on the page. Terrazzo chips, a zigzag, tilted rounded squares, a solid violet
 * triangle and concentric quarter-arcs are the Memphis Group's 1981 vocabulary.
 * Recolouring them into brand hues does not change what the FORMS say, and what
 * they say is playful, postmodern and consumer. On a system of record sold to
 * institutions they read as a craft fair. The topographic contour lines went
 * with them — iso-contours are a cartography motif with no relationship to a
 * registrar product; they were there because a marching-squares generator
 * existed. So did the blurred green ribbons behind the FAQ, which were six to
 * fourteen times louder than every other decoration on the site.
 *
 * WHAT PREMIUM ACTUALLY IS AT THIS TIER. Not more ornament — less, and better
 * light. What Stripe, Linear, Vanta, Ramp and Databricks put behind a section in
 * 2026 is: one large soft light source at very low chroma, an occasional
 * hairline structure at a wide pitch, real grain so a large gradient does not
 * band, and a great deal of void. The composition is carried by the CONTENT
 * card, and the backdrop's whole job is to make that card sit on something.
 *
 * TWO INVARIANTS, both load-bearing rather than stylistic:
 *
 * 1. Every layer is an `aria-hidden` SIBLING of the section's content, never an
 *    ancestor, and always `-z-10` inside an `isolate`d section. The contrast gate
 *    resolves a text node's backdrop by climbing its ancestors, so a texture on a
 *    copy-bearing element either switches the check off or fails it against a
 *    gradient stop nobody can see.
 * 2. Every layer is masked. An unmasked full-bleed texture makes the compositor
 *    consider the whole page.
 *
 * ORNAMENT MAY NOT REACH INTO THE DATA PALETTE. `--chart-*` belongs to charts,
 * where a hue carries meaning. Decoration draws on `--accent` and the neutrals
 * only. That rule is what let a violet triangle and a coral square exist at all.
 */

export type BackdropVariant =
  /** The default: one soft light, nothing else. Most sections. */
  | "light"
  /** Light over a wide drafting grid, for sections carrying a product surface. */
  | "grid"
  /** The inverted bands: deep light, fine grain. */
  | "band";

export function Backdrop({
  variant = "light",
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
      {variant !== "band" && (
        <>
          {/*
            ONE light source, large and off-centre. A single wide radial at very
            low chroma reads as illumination; the three overlapping washes this
            replaced read as three coloured blobs, because that is what they were.
          */}
          <div className="absolute -top-[38%] right-[-14%] h-[64rem] w-[64rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_7%,transparent),transparent_62%)]" />
          {/* A cool counterweight at the opposite corner, weaker still, so the
              field has direction instead of a hotspot. */}
          <div className="absolute bottom-[-32%] left-[-18%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--text)_4%,transparent),transparent_66%)]" />
        </>
      )}

      {variant === "grid" && (
        <div className="absolute inset-0 text-ink/[0.045] hairline-grid [--grid:120px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      )}

      {variant === "band" && (
        <>
          <div className="absolute inset-0 [background:radial-gradient(70%_68%_at_28%_8%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%)]" />
          <div className="absolute inset-0 text-inverse/[0.035] hairline-grid [--grid:120px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        </>
      )}

      {/* Grain last, over everything: what stops a large gradient banding on an
          8-bit display. It is the one texture that survives at this tier because
          it is felt rather than seen. */}
      <div
        className={cn("absolute inset-0 grain", variant === "band" ? "opacity-[0.09]" : "opacity-[0.055]")}
      />
    </div>
  );
}
