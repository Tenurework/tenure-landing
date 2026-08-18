"use client";

import { useCallback, useState } from "react";
import NumberFlow from "@number-flow/react";

import { Reveal } from "@/components/ui/Reveal";
import { Container, Eyebrow } from "@/components/ui/layout";
import { SectionContour } from "@/components/visuals/SectionContour";
import { site } from "@/lib/site";

type Metric = (typeof site.metrics)[number];

/**
 * THE NUMBER IS CONTENT. THE COUNT-UP IS DECORATION.
 *
 * This band used to compute `inView || reduce ? metric.value : 0` and hand that
 * to NumberFlow. `useInView` is false during server rendering and NumberFlow is
 * not inert on the server, so the prerendered HTML literally contained a `0` for
 * every tile — "0 organizations modelled", "0 end-to-end tests" — under a line
 * claiming every number here is counted. The client then only corrected it once
 * 40% of the section had crossed the viewport, a threshold an IntersectionObserver
 * can never reach when the section is taller than the window (a 320px-wide
 * viewport at 400% zoom stacks these four tiles ~1,450px tall against ~200px of
 * root: the ratio caps around 0.14). On those viewports the zeros were permanent.
 *
 * So the resting value is now the real value, always: on the server, on the first
 * client render, with JavaScript unavailable or slow, under reduced motion, and
 * when no observer ever fires. The count-up is an enhancement layered on top, and
 * it is only ever started while the band is still below the fold — see `attach`.
 *
 * The distinction that matters: a tile showing 0 because its value IS 0 (C-011,
 * "records deleted at offboarding") is a fact, and it renders at rest. A tile
 * showing 0 because an animation has not started is a lie, and it can no longer
 * happen.
 */

/**
 * Qualifiers that have to travel on the tile's own face, keyed by the claim the
 * number is drawn from. Both correct a reading the label alone invites:
 *
 *   C-014 — 26 organizations / 209 seats are seeded structural counts from a
 *           modelled roster. In a band of four big numbers they read as adoption,
 *           which is exactly what the register forbids: "Never present them as
 *           customers, users or adoption."
 *   C-011 — 0 records deleted is a design invariant, not an observation. Without
 *           this line it reads as "nobody has offboarded yet", which would make a
 *           property of the system look like a sample size.
 */
const TILE_NOTES: Record<string, string> = {
  "C-014": "Seeded model — not customers, not users",
  "C-011": "By design, not a tally",
};

/**
 * A count-up on a seeded structural count animates it into looking like growth.
 * The 26 never grew; it was modelled once from a roster. It renders as a still
 * number for the same reason the note above sits under it.
 */
const NEVER_COUNTS_UP = new Set(["C-014"]);

function Tile({ metric, zero }: { metric: Metric; zero: boolean }) {
  const note = TILE_NOTES[metric.claimId];
  const value = zero && !NEVER_COUNTS_UP.has(metric.claimId) ? 0 : metric.value;

  return (
    /*
      THE NOTE IS PINNED TO THE BOTTOM, and that is an alignment fix rather than a
      preference. It used to sit between the number and the label, and only two of
      the four tiles carry one — so in a row of four, two labels started directly
      under their number and two started ~34px lower. Four big numbers whose
      captions do not share a baseline read as a broken grid, which is the last
      impression a section headed "counted, not projected" should give.

      Putting it last also puts the qualifier after the thing it qualifies:
      "26 / organizations modelled / … / Seeded model — not customers, not users"
      reads in the order a sceptical reader asks the questions in.
    */
    <div className="flex h-full flex-col">
      <div className="flex items-baseline gap-1">
        <span className="font-display text-[2.7rem] font-semibold leading-none tracking-[-0.04em] tnum text-grove-bright sm:text-[3.2rem]">
          <NumberFlow
            value={value}
            transformTiming={{ duration: 1200, easing: "cubic-bezier(.22,1,.36,1)" }}
          />
        </span>
        {metric.suffix && (
          <span className="font-display text-2xl font-semibold text-grove-bright sm:text-3xl">
            {metric.suffix}
          </span>
        )}
      </div>

      <p className="mt-2.5 text-[1rem] font-medium text-inverse">{metric.label}</p>
      <p className="mt-1 text-[0.85rem] leading-relaxed text-inverse/75">{metric.sub}</p>

      {note && (
        <p className="mt-3 inline-flex w-fit rounded-md border border-line-dark bg-band-raised px-2 py-1 font-mono text-[0.64rem] leading-tight text-inverse/85">
          {note}
        </p>
      )}
    </div>
  );
}

export function MetricsBand() {
  /**
   * The single frame the count-up starts from. It is never true on the server,
   * never true on the first client render, and never a resting state — the frame
   * after it is set, it is unset again and NumberFlow animates 0 -> real value.
   */
  const [zero, setZero] = useState(false);

  const attach = useCallback((el: HTMLElement | null) => {
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Reduced motion keeps the real numbers and skips the count-up entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          // Only run the count-up on a band the reader is scrolling towards. If
          // the band is already on screen when the client takes over, the zero it
          // would start from is a zero somebody could read, so we leave the true
          // numbers alone. threshold defaults to 0, so nothing here depends on
          // the section fitting inside the viewport.
          if (entry.boundingClientRect.top <= window.innerHeight) return;
          // If React coalesces these two into one render the count-up simply
          // does not happen and the real numbers stay on screen, which is the
          // correct failure for a decoration.
          setZero(true);
          requestAnimationFrame(() => setZero(false));
          return;
        }
      },
      // Positive bottom margin: fire while the band is still roughly a third of a
      // viewport below the fold, so the zero frame is painted off screen.
      { rootMargin: "0px 0px 30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={attach}
      className="relative isolate overflow-hidden border-t border-line-dark bg-band py-14 text-inverse sm:py-18"
    >
      <SectionContour place="cr" seed={4} className="text-inverse/[0.06]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_25%_20%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%)]"
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <Eyebrow className="text-inverse/75">Counted, not projected</Eyebrow>
          <h2 className="font-display mt-5 text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] text-inverse sm:text-[2.4rem]">
            We can&rsquo;t show you outcomes yet. We can show you{" "}
            <span className="text-grove-bright">exactly how it&rsquo;s built</span>.
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-inverse/75">
            The pilot hasn&rsquo;t run, so there is nothing measured to report. Every number below
            is counted from the repository that deploys &mdash; not an estimate, not a projection,
            and not a count of anyone using Tenure.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-y-8 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Reveal rather than motion: these four tiles carry real copy, and
              a server-rendered opacity:0 hid all of it without JavaScript. */}
          {site.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} y={16} className="h-full border-l border-line-dark pl-5">
              <Tile metric={m} zero={zero} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
