"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Section } from "@/components/ui/layout";
import { Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * INDUSTRIES — a side-scroll with its own controls.
 *
 * WHAT THIS REPLACED. First a tab strip showing one sector at a time, then a
 * four-across grid showing all eight at once. The grid said the wrong thing: two
 * tidy rows, complete, nothing beyond. A row that runs off the right edge says
 * the list continues, which is the actual argument — the seat model is not a
 * university thing.
 *
 * WHY IT NEEDED ARROWS. A scroller with no visible control is a scroller most
 * people never scroll. The cropped card at the edge hints, but a hint is not an
 * affordance: on a trackpad horizontal scrolling is a gesture many users never
 * make deliberately, and with a mouse wheel it is not available at all. The
 * arrows are the only way the eight cards are reachable for a large share of
 * visitors, so they are buttons, not decoration.
 *
 * THE PROGRESS BAR is the second half of that. It answers "how much more is
 * there" without a count, and it is the one place the brand gradient appears at
 * full strength — a moving band of amber-green-indigo against a hairline track.
 *
 * DISABLED STATE IS REAL. Both arrows disable at their ends rather than wrapping.
 * A carousel that silently loops leaves the reader unable to tell whether they
 * have seen everything, which is the only question this control exists to answer.
 */
export function Industries() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // A rail that fits its content has no progress to report; guard the divide.
    const ratio = max > 1 ? el.scrollLeft / max : 1;
    setProgress(ratio);
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    // The rail's width changes with the viewport, and so does whether it can
    // scroll at all — without this the arrows keep a stale disabled state.
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const nudge = useCallback((dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    // Step by a whole card plus its gap, so a click always lands on a snap point.
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <Section from="canvas" tone="surface" backdrop="light">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <Eyebrow>Industries</Eyebrow>
              <h2 className="font-display mt-3 text-h2 text-ink sm:text-h2-lg">
                One model. Every sector where the role{" "}
                <span className="text-gradient">outlasts the person</span>.
              </h2>
              <p className="mt-4 text-lead leading-relaxed text-ink-soft measure">
                Turnover is scheduled in some industries and constant in others. The
                mechanism does not change: attach the record to the seat, and whoever
                holds it next starts from it.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <RailButton
                direction="left"
                disabled={atStart}
                onClick={() => nudge(-1)}
              />
              <RailButton direction="right" disabled={atEnd} onClick={() => nudge(1)} />
            </div>
          </div>
        </Reveal>
      </Container>

      {/*
        FULL-BLEED. The row starts on the page rail and runs off the right edge —
        `rail-pad` keeps its first card level with the heading at every viewport,
        including the wide ones where a centred container no longer touches the
        page margin.
      */}
      <Reveal delay={0.08} className="mt-10">
        <div
          ref={railRef}
          role="region"
          aria-label="Industries Tenure is built for — scroll horizontally for more"
          tabIndex={0}
          className="no-scrollbar rail-pad snap-x snap-mandatory overflow-x-auto pb-2"
        >
          <ul className="flex gap-4">
            {site.industries.map((ind) => (
              <li
                key={ind.key}
                className="w-[19rem] shrink-0 snap-start sm:w-[22rem] lg:w-[26rem]"
              >
                <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-band-deep">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={ind.photo}
                      alt={ind.alt}
                      fill
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22rem, 19rem"
                      className="industry-photo object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* The caption sits on a solid surface, never on the photograph.
                      White type over an image the component cannot measure is a
                      contrast failure waiting for the wrong photo. */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-title text-inverse">{ind.label}</h3>
                    <p className="mt-2 text-body-sm leading-relaxed text-inverse/75">
                      {ind.line}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Container className="mt-8">
        {/*
          The track is decorative — `aria-hidden` — because the scroll region it
          reports on is already announced, focusable and arrow-key operable. A
          second announced progressbar would be a duplicate control that cannot
          be operated.
        */}
        <div aria-hidden className="h-px w-full max-w-md bg-line">
          <div
            className="rule-brand h-px origin-left transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${Math.max(0.06, progress || 0.06)})` }}
          />
        </div>
      </Container>
    </Section>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous industries" : "Next industries"}
      className={
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line " +
        "text-ink transition-[background-color,border-color,opacity] duration-200 " +
        "hover:border-ink-soft hover:bg-cloud disabled:pointer-events-none disabled:opacity-30"
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? (
          <path d="M15 4 7 12l8 8" />
        ) : (
          <path d="M9 4l8 8-8 8" />
        )}
      </svg>
    </button>
  );
}
