import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { Reveal } from "@/components/ui/Reveal";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { ContourField } from "@/components/visuals/ContourField";
import { HeroShapes } from "@/components/home/HeroShapes";
import { HeroFloatingCards } from "@/components/home/HeroFloatingCards";
import { site } from "@/lib/site";

/**
 * The headline deliberately has NO entrance animation.
 *
 * It used to be a word-by-word blur-in built on `motion`, which meant the
 * largest text on the page — the LCP element — was server-rendered at
 * `opacity: 0` with a blur filter and only became legible after the bundle
 * booted and ran a per-word stagger. That delayed perceived load, cost a filter
 * repaint per word, and left the sentence invisible altogether if JavaScript
 * never arrived. It now paints with the document.
 *
 * The supporting copy still reveals, which is where the motion reads as
 * intentional rather than as a loading state. `Reveal` is CSS-driven and
 * degrades to plain visible content without JavaScript.
 *
 * This is also no longer a client component — nothing left in it needs one.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* aurora wash + faint contour grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12%] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_62%)] blur-2xl" />
        <div className="absolute right-[6%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--warning)_10%,transparent),transparent_65%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[80%] text-grove/[0.13] [mask-image:radial-gradient(75%_70%_at_60%_18%,black,transparent_76%)]">
          <ContourField seed={1} />
        </div>
      </div>

      <HeroShapes />

      <Container className="relative pb-16 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,46%)_1fr] lg:gap-8">
          {/* LEFT, editorial copy */}
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <p className="label-mono">
              The operating system for organizational memory
            </p>

            <h1 className="font-display mt-6 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[4.15rem]">
              <span className="block">People move on.</span>
              <span className="block">
                The know-how <span className="text-gradient">stays.</span>
              </span>
            </h1>

            <Reveal delay={0.08} y={12}>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ink-soft lg:mx-0">
                Tenure is the system of record for organizations where people
                rotate faster than knowledge transfers. Finance, events,
                approvals, members and memory attach to the seat, not the person
                holding it &mdash; so the next leader opens a record instead of
                an empty folder.
              </p>
            </Reveal>

            <Reveal delay={0.16} y={12}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <ContactSales size="lg" arrow />
                <Button href="#platform" variant="secondary" size="lg">
                  Explore the platform
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24} y={8}>
              <p className="mx-auto mt-5 max-w-md text-[0.82rem] leading-relaxed text-ink-faint lg:mx-0">
                Bring your spreadsheets in. Keep the calendar you already open.
                Planned {site.pilot.season} pilot with {site.origin.office}.
              </p>
            </Reveal>
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
