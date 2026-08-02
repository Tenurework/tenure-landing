"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { SectionContour } from "@/components/visuals/SectionContour";
import { site } from "@/lib/site";


function Tile({
  metric,
  inView,
  reduce,
}: {
  metric: (typeof site.metrics)[number];
  inView: boolean;
  reduce: boolean | null;
}) {
  const value = inView || reduce ? metric.value : 0;
  return (
    <div className="relative">
      <div className="flex items-baseline gap-1">
        <span className="font-display text-[3rem] font-semibold leading-none tracking-[-0.04em] tnum text-grove-bright sm:text-[3.6rem]">
          {reduce ? (
            <>{metric.value}</>
          ) : (
            <NumberFlow value={value} transformTiming={{ duration: 1200, easing: "cubic-bezier(.22,1,.36,1)" }} />
          )}
        </span>
        {metric.suffix && (
          <span className="font-display text-2xl font-semibold text-grove-bright sm:text-3xl">
            {metric.suffix}
          </span>
        )}
      </div>

      {/* The struck-through "was: a semester" comparison that used to sit here
          was removed with the unmeasured metrics it belonged to. Nothing in
          either product repository measures onboarding duration, so there was
          no before to strike through. */}

      <p className="mt-3 text-[1.02rem] font-medium text-inverse">{metric.label}</p>
      <p className="mt-1 text-[0.86rem] leading-relaxed text-inverse/55">{metric.sub}</p>
    </div>
  );
}

export function MetricsBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-t border-line-dark bg-inverse py-24 text-inverse sm:py-28"
    >
      <SectionContour place="cr" seed={4} className="text-inverse/[0.06]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_25%_20%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_68%)]"
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <Eyebrow className="text-inverse/50">Continuity, measured</Eyebrow>
          <h2 className="font-display mt-5 text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] text-inverse sm:text-[2.4rem]">
            We don&rsquo;t measure engagement. We measure whether the{" "}
            <span className="text-grove-bright">knowledge survived</span>.
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-inverse/55">
            What the seat model is built to deliver, {site.pilot.season} pilot targets.
          </p>
        </div>

        <div className="mt-14 grid gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Reveal rather than motion: these four tiles carry real copy, and
              a server-rendered opacity:0 hid all of it without JavaScript. */}
          {site.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} y={16} className="border-l border-line-dark pl-5">
              <Tile metric={m} inView={inView} reduce={reduce} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
