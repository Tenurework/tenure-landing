import type { ReactNode } from "react";
import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Consistent, centered top-of-page header for every non-home route. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  photo,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /**
   * A full-bleed photograph behind the headline, one per route.
   *
   * WHAT THIS REPLACED, TWICE. First a radial wash of 8% accent that was
   * identical on all five routes — the same picture everywhere, which is the
   * same as no picture. Then four abstract SVG compositions, which were the
   * wrong answer to "go beyond generic": drawn shapes read as sloppy at this
   * scale next to real photography, and the site already had photography doing
   * the job properly in the industries rail and the closing band.
   *
   * Each route's image is chosen for what that page argues rather than for what
   * its title depicts, and no two pages share one — including the closing band,
   * which is why /product no longer repeats the home page's boardroom.
   *
   * WITH A PHOTOGRAPH THE HEADER INVERTS. White type on an image is a contrast
   * failure waiting for the wrong picture, so the scrim is opaque enough to
   * guarantee the ratio on its own and the photograph shows through it. The
   * contrast walker cannot measure an image; it climbs ancestors and would find
   * a transparent parent, so this cannot be left to a checker to catch.
   */
  photo?: { src: string; alt?: string };
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b",
        photo ? "border-transparent bg-band text-inverse" : "border-line",
      )}
    >
      {photo && (
        <>
          <Image
            src={photo.src}
            alt={photo.alt ?? ""}
            aria-hidden={photo.alt ? undefined : true}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Two layers, both load-bearing. The flat wash sets the floor so the
              ratio holds over any photograph; the vertical gradient keeps the
              image legible at top and bottom instead of flattening it into a
              grey rectangle. */}
          <div aria-hidden className="absolute inset-0 bg-ink-deep/78" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--inverse-deep)_62%,transparent),color-mix(in_oklab,var(--inverse-deep)_24%,transparent)_48%,color-mix(in_oklab,var(--inverse-deep)_70%,transparent))]"
          />
        </>
      )}
      <Container className="relative pb-14 pt-32 text-center sm:pb-16 sm:pt-40">
        {/*
          NOTHING IN THE FIRST VIEWPORT ANIMATES IN, the same rule Hero.tsx:12-35
          already states for the home page, finally applied here too.

          These three elements used to be wrapped in <Reveal>. globals.css:468 hides
          any [data-reveal] at opacity:0 as soon as the inline theme script adds the
          `.js` class, which happens before first paint; `is-revealed` only arrives
          after hydration plus an IntersectionObserver tick, plus the per-element
          transition-delay. Since the h1 here is the largest contentful element on
          every non-home route, that put LCP behind hydration on seven pages.

          Measured, first paint -> LCP, before this change:
            /product 1215 -> 2078    /pilot 1212 -> 2077
            /trust   1212 -> 2079    /story 1214 -> 2013
            /        1246 -> 1246    /contact 1196 -> 1196
          The four routes with a Reveal-gated heading were exactly the four with a
          gap; home and /contact, whose LCP elements are not wrapped, had none.

          The CTA row below keeps its Reveal: it is below the fold on mobile and is
          not a candidate for LCP.
        */}
        <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
        {/*
          72px, NOT 96px, and the measure is wide rather than narrow.

          Measured on cohere.com/research, /security and /blog: every sub-page h1
          is 72px at weight 400, centred, in a ~1,128px measure. 96px is reserved
          for the home page, a site that shouts identically on every route has
          no hierarchy between them.

          The old setting combined the largest step with `max-w-3xl`, which is
          768px, so /product's headline broke into four lines and filled the
          viewport on its own. Bigger type in a narrower box is not emphasis, it
          is a column of syllables.

          `leading-[1.05]` are gone with it: both now ride on
          the size token, which is the whole reason the token carries them.
        */}
        <h1 className="font-display mx-auto mt-6 max-w-[70rem] text-display-sm text-ink sm:text-display">
          {title}
        </h1>
        {intro && (
          <p className="mx-auto mt-6 max-w-3xl text-lead leading-relaxed text-ink-soft">
            {intro}
          </p>
        )}
        {children && (
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {children}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
