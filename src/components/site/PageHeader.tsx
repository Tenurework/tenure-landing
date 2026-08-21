import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

/** Consistent, centered top-of-page header for every non-home route. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  art,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /**
   * The page's own artwork, sitting behind the headline.
   *
   * WHAT THIS REPLACED: one radial wash of 8% accent, identical on all five
   * routes. It was the same picture everywhere, which is the same as no picture —
   * a page that looks like every other page has not said anything about itself.
   *
   * Each artwork paints at the flanks and leaves the middle empty by composition,
   * so the headline never crosses pigment. `art` falls back to nothing rather
   * than to the old wash: a route without artwork should look deliberate rather
   * than half-decorated.
   */
  art?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {art}
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
