"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { ContourField } from "@/components/visuals/ContourField";
import { HeroShapes } from "@/components/home/HeroShapes";
import { HeroFloatingCards } from "@/components/home/HeroFloatingCards";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Kinetic word-by-word reveal, one blur-in moment, then still. */
function Kinetic({
  text,
  className,
  delay = 0,
  gradient = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  gradient?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={gradient ? "text-gradient inline-block" : "inline-block"}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: "0.5em", filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={reduce ? { duration: 0 } : { duration: 0.62, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* aurora wash + faint contour grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12%] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(28,140,90,0.10),transparent_62%)] blur-2xl" />
        <div className="absolute right-[6%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(232,176,75,0.10),transparent_65%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[80%] text-grove/[0.13] [mask-image:radial-gradient(75%_70%_at_60%_18%,black,transparent_76%)]">
          <ContourField seed={1} />
        </div>
      </div>

      <HeroShapes />

      <Container className="relative pb-16 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,46%)_1fr] lg:gap-8">
          {/* LEFT, editorial copy */}
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <motion.p
              className="label-mono"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              The operating system for organizational memory
            </motion.p>

            <h1 className="font-display mt-6 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[4.15rem]">
              <Kinetic text="People move on." className="block" />
              <span className="block">
                <Kinetic text="The know-how" delay={0.18} />{" "}
                <Kinetic text="stays." delay={0.34} gradient />
              </span>
            </h1>

            <motion.p
              className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ink-soft lg:mx-0"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            >
              Tenure is the system of record for any organization where people
              rotate faster than knowledge transfers: clubs, university offices,
              teams, and growing companies. It keeps finance, events, approvals,
              members, and memory in one governed place, and Tenure AI turns that
              record into instant answers, so each new leader is productive in
              days, not a semester.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
            >
              <ContactSales size="lg" arrow />
              <Button href="#platform" variant="secondary" size="lg">
                Explore the platform
              </Button>
            </motion.div>

            <motion.p
              className="mx-auto mt-5 max-w-md text-[0.82rem] leading-relaxed text-ink-faint lg:mx-0"
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              Runs alongside the tools you already use. No rip-and-replace.
              Founding {site.pilot.season} pilot with {site.origin.partner}.
            </motion.p>
          </div>

          {/* RIGHT, the product surface, bleeding off the right edge */}
          <div className="relative lg:-mr-[12vw] xl:-mr-[8vw]">
            <HeroFloatingCards />
            <DashboardMock tilt auto className="relative z-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
