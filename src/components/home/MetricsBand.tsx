"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { SectionContour } from "@/components/visuals/SectionContour";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

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

      <div className="mt-1 h-4 overflow-hidden">
        {"was" in metric && metric.was && (
          <AnimatePresence mode="wait">
            {inView && !reduce && (
              <motion.p
                key="was"
                className="font-mono text-[0.68rem] text-paper/40 line-through"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, times: [0, 0.2, 0.7, 1] }}
              >
                {metric.was}
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>

      <p className="mt-3 text-[1.02rem] font-medium text-paper">{metric.label}</p>
      <p className="mt-1 text-[0.86rem] leading-relaxed text-paper/55">{metric.sub}</p>
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
      className="relative isolate overflow-hidden border-t border-line-dark bg-ink py-24 text-paper sm:py-28"
    >
      <SectionContour place="cr" seed={4} className="text-paper/[0.06]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_25%_20%,rgba(37,169,109,0.16),transparent_68%)]"
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <Eyebrow className="text-paper/50">Continuity, measured</Eyebrow>
          <h2 className="font-display mt-5 text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] text-paper sm:text-[2.4rem]">
            We don&rsquo;t measure engagement. We measure whether the{" "}
            <span className="text-grove-bright">knowledge survived</span>.
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-paper/55">
            What the seat model is built to deliver, {site.pilot.season} pilot targets.
          </p>
        </div>

        <div className="mt-14 grid gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {site.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              className="border-l border-line-dark pl-5"
            >
              <Tile metric={m} inView={inView} reduce={reduce} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
