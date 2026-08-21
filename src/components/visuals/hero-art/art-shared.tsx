import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * THE FRAME EVERY SUB-PAGE ARTWORK SITS IN.
 *
 * These four artworks are decoration behind a 72px near-black headline on
 * off-white, and every constraint here follows from that one fact.
 *
 * `aria-hidden` and `pointer-events-none`: it carries no meaning and must never
 * intercept a click meant for the CTA underneath.
 *
 * A SHARED KEEP-OUT. Each artwork paints at the flanks and leaves the middle of
 * the frame empty, so the headline never crosses pigment. That is enforced by
 * composition rather than by a mask — a mask would let a future edit drift a
 * shape into the text and hide the contrast failure instead of showing it.
 *
 * `slice` rather than `meet`: the frame is a 1440x460 window onto a larger
 * composition, so at narrow widths the flanks crop off-screen rather than the
 * whole picture shrinking into a stripe.
 *
 * IDS ARE PREFIXED PER ARTWORK. SVG gradient and filter ids share one document
 * namespace, so two components using `id="grain"` on the same page would have
 * the second silently take the first's definition. Nothing errors; the artwork
 * just renders wrong somewhere else on the page.
 */
export function ArtFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 460"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {children}
      </svg>
    </div>
  );
}

/**
 * The grain, as SVG filter primitives rather than a CSS background layer.
 *
 * It is the same recipe the `matte` utility uses — fractal turbulence,
 * desaturated, then transfer-shifted to a light mean so that multiplying by it
 * darkens a little and varies a lot. Mid-grey noise under `multiply` drags a
 * field toward cement; that was measured, not assumed.
 *
 * `id` is passed in because these ids are document-global.
 */
export function Grain({ id }: { id: string }) {
  return (
    /*
      THE FILTER REGION AND THE OCTAVE COUNT ARE BOTH COST, not styling.

      feTurbulence is evaluated per device pixel across the whole filter region.
      SecurityArt's rings span a bounding box far larger than the frame, and at
      four octaves over a -10%/120% region that was expensive enough to stall the
      page: the accessibility suite's 30-second budget for /trust ran out, and
      the same suite passed in four seconds with the artwork removed. It was not
      a test problem — a filter that costs that much is costing every visitor too.

      Two octaves instead of four halves the work per pixel, and clamping the
      region to the element's own box removes the 20% margin that was being
      computed and thrown away. Grain does not need four octaves; the second one
      is already below the size of a pixel at this frequency.
    */
    <filter
      id={id}
      x="0"
      y="0"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        stitchTiles="stitch"
        result="n"
      />
      <feColorMatrix type="saturate" values="0" in="n" result="g" />
      <feComponentTransfer in="g" result="lit">
        <feFuncR type="linear" slope="0.30" intercept="0.62" />
        <feFuncG type="linear" slope="0.30" intercept="0.62" />
        <feFuncB type="linear" slope="0.30" intercept="0.62" />
        <feFuncA type="linear" slope="0" intercept="1" />
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="lit" mode="multiply" result="blended" />
      {/*
        CLIP THE GRAIN TO THE ARTWORK'S OWN ALPHA. Without this the filter region
        — which is the whole frame — comes back filled with noise, because
        `feBlend` has no notion of "only where the source is opaque". The header
        turned grey end to end and the artwork looked like a fault rather than a
        picture. `operator="in"` keeps the blended result only where SourceGraphic
        already painted, which is what "grain on the shapes" means.
      */}
      <feComposite in="blended" in2="SourceGraphic" operator="in" />
    </filter>
  );
}
