
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
  /*
    NOTHING GOES BEHIND A SECTION.

    Measured off cohere.com: the page is white. There is no wash, no grid, no
    grain — 2,312 of its rendered nodes sit on plain white or #FAFAFA, and every
    piece of colour on the page arrives inside a photograph or a dark product
    surface. That is the discipline this component used to work against.

    What was here was already the restrained version: one large radial at 7%
    accent, a cool counterweight, a 120px drafting grid under product sections,
    and a grain layer over everything. Individually defensible, and collectively
    a permanent tint over every pixel of the site — the faint grid was visible in
    every screenshot, which is exactly the "backdrop" quality the brief kept
    calling immature. A gradient behind a section is a decoration standing in for
    a composition.

    The variants stay in the signature because thirty-nine call sites name them
    and because `band` still tells a section to invert; they simply no longer
    paint anything. Contrast now comes from the sections themselves: full-bleed
    photography, a near-black band, and white.
  */
  void variant;
  void className;
  return null;
}
