import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ContactSales } from "@/components/ui/ContactSales";
import { site } from "@/lib/site";


/**
 * SITE-WIDE CLOSING CALL TO ACTION — a full-bleed photograph, the way cohere.com
 * closes a section.
 *
 * WHAT THIS REPLACED. A flat near-black band with a radial accent wash behind
 * the type. The wash was the only thing distinguishing it from a coloured
 * rectangle, and a gradient behind a headline is decoration standing in for a
 * composition — the same habit that was behind every section on the site.
 *
 * Cohere's equivalent runs edge to edge: photograph at full bleed, no container,
 * no radius, white type sitting on it, product surface cropping off one edge.
 * The image is the section rather than an ornament inside it.
 *
 * THE SCRIM IS LOAD-BEARING, not styling. White type over a photograph is a
 * contrast failure waiting for the wrong picture, and the contrast checker
 * cannot measure an image — it climbs ancestors and sees a transparent parent.
 * So the overlay is opaque enough to guarantee the ratio on its own: the text
 * reads against the scrim, and the photograph is what shows through it.
 */

export function CtaBand({
  title,
  sub = "See Tenure on your organization’s real handoff. A short walkthrough: we’ll show you exactly what carries forward.",
}: {
  title?: ReactNode;
  sub?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-band py-28 sm:py-36">
      <Image
        src="/photos/admin-boardroom.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/*
        Two layers, and both are needed. The flat wash sets the floor so the
        ratio holds over any photograph; the vertical gradient keeps the image
        legible at the edges instead of flattening it into a grey rectangle.
      */}
      <div aria-hidden className="absolute inset-0 bg-ink-deep/82" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--inverse-deep)_55%,transparent),color-mix(in_oklab,var(--inverse-deep)_20%,transparent)_45%,color-mix(in_oklab,var(--inverse-deep)_65%,transparent))]"
      />

      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-3xl text-h2 text-inverse sm:text-h2-lg">
            {title ?? (
              <>
                Run the org. Hand it off. Lose nothing.
              </>
            )}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-lead text-inverse/80">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <ContactSales variant="light" size="lg" arrow />
            <a
              href={`mailto:${site.email.sales}`}
              className="text-body text-inverse/70 underline-offset-4 transition-colors hover:text-inverse hover:underline"
            >
              or email us
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
