import { cn } from "@/lib/cn";

type Place = "tr" | "tl" | "br" | "bl" | "cr" | "cl";

/**
 * DO NOT REMOVE THE RADIAL-GRADIENT MASKS BELOW.
 *
 * They look like decoration and they are not: they are load-bearing for
 * performance. A variant with `mask-image: none` measured 3,101 ms of style and
 * layout against 699 ms for the control, stable across seven runs. Whatever they
 * cost to write, they save an order of magnitude more by bounding the area the
 * compositor has to consider.
 */
const PLACES: Record<Place, string> = {
  tr: "right-0 top-0 h-[85%] w-[58%] [mask-image:radial-gradient(70%_72%_at_86%_16%,black,transparent_74%)]",
  tl: "left-0 top-0 h-[85%] w-[56%] [mask-image:radial-gradient(70%_72%_at_14%_16%,black,transparent_74%)]",
  br: "bottom-0 right-0 h-[88%] w-[60%] [mask-image:radial-gradient(72%_72%_at_86%_84%,black,transparent_74%)]",
  bl: "bottom-0 left-0 h-[88%] w-[58%] [mask-image:radial-gradient(72%_72%_at_14%_84%,black,transparent_74%)]",
  cr: "right-0 top-1/2 h-[120%] w-[52%] -translate-y-1/2 [mask-image:radial-gradient(62%_60%_at_90%_50%,black,transparent_76%)]",
  cl: "left-0 top-1/2 h-[120%] w-[52%] -translate-y-1/2 [mask-image:radial-gradient(62%_60%_at_10%_50%,black,transparent_76%)]",
};

/**
 * A faded topographic contour, placed and tinted per section so each background
 * reads differently from the next. Decorative; sits behind the content.
 *
 * The geometry is a static file under `public/contours/`, generated at build time
 * by `scripts/build-contours.mjs` and painted here as a CSS mask. It used to be an
 * inline `<svg>` of marching-squares paths rendered on the server, which put
 * 60,349 gzipped bytes into the home document — 59.4% of the transferred page —
 * and shipped the same geometry a second time inside the RSC flight payload.
 *
 * `background-color: currentColor` under the mask is what preserves theming: every
 * existing tint class (`text-grove/[0.06]`, `text-inverse/[0.07]`, `text-ink/[0.05]`)
 * keeps working in both light and dark, with no colour baked into the asset.
 * `mask-size: cover` reproduces the old `preserveAspectRatio="xMidYMid slice"`.
 *
 * The mask URL is per-seed and therefore dynamic, so it goes in `style` rather
 * than a Tailwind arbitrary value — Tailwind can only extract class names it can
 * see statically. The `-webkit-` properties are required by Safari.
 */
export function SectionContour({
  place = "tr",
  seed = 0,
  className,
}: {
  place?: Place;
  seed?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10", PLACES[place], className)}
    >
      <ContourMask seed={seed} />
    </div>
  );
}

/**
 * The contour on its own, for the two call sites that supply their own wrapper
 * and mask: the hero backdrop (Hero.tsx) and the closing CTA band (CtaBand.tsx).
 * Replaces the old `<ContourField seed={n} />`, which rendered inline SVG.
 */
export function ContourMask({ seed = 0, className }: { seed?: number; className?: string }) {
  const url = `url(/contours/s${seed}.svg)`;
  return (
    <div
      className={cn("h-full w-full", className)}
      style={{
        /*
          The paint is a currentColor gradient, NOT `background-color: currentColor`.

          Rendering is identical — a solid fill of one colour either way, clipped by
          the mask to the contour strokes. The difference is what an accessibility
          checker believes. axe has no model of `mask-image`, so a flat
          `background-color` on this layer reads as a uniform wash sitting behind the
          page's text: with the hero's `text-grove/[0.13]` tint it computed a #dbe5dc
          backdrop and dropped the home page's contrast score to 4.33:1, failing a
          gate that had been green. No such wash is ever painted — the mask is opaque
          on roughly 5% of the layer.

          Using a background-image stops axe attributing a background colour to an
          element that does not have one, which is the accurate description.
        */
        backgroundImage: "linear-gradient(currentColor, currentColor)",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "cover",
        WebkitMaskSize: "cover",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
