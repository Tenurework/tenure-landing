import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { Reveal } from "@/components/ui/Reveal";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { ContourMask } from "@/components/visuals/SectionContour";
import { HeroShapes } from "@/components/home/HeroShapes";
import { HeroFloatingCards } from "@/components/home/HeroFloatingCards";
import { site } from "@/lib/site";

/**
 * NOTHING IN THE FIRST VIEWPORT ANIMATES IN.
 *
 * The headline used to be a word-by-word blur-in built on `motion`, which meant
 * the largest text on the page — the LCP element — was server-rendered at
 * `opacity: 0` with a blur filter and only became legible after the bundle
 * booted and ran a per-word stagger. That delayed perceived load, cost a filter
 * repaint per word, and left the sentence invisible altogether if JavaScript
 * never arrived. It now paints with the document.
 *
 * The supporting paragraph and BOTH calls to action used to be wrapped in
 * `Reveal`, which has the same shape of problem one layer down: globals.css
 * hides `[data-reveal]` behind a `.js` class that ThemeScript sets before first
 * paint, so those elements stayed transparent until the `Reveal` client
 * component hydrated and its IntersectionObserver fired. `Reveal` handles
 * "JavaScript absent" correctly — the `.js` class never lands, so the content
 * is simply visible — but the common campus-network case is JavaScript SLOW,
 * and there the first paint was a headline with no explanation and no button
 * beneath it, behind the whole client bundle. They now paint with the document
 * too. Only the pilot footnote, which is below the conversion path and not the
 * reason anyone is here, still reveals.
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
          <ContourMask seed={1} />
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

            {/* Opens on the image, not the abstraction: the reader is the
                person staring at the empty folder, so the first clause is the
                thing they recognise. "System of record" and "attaches to the
                seat" are the same claims, said after the picture rather than
                before it. */}
            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ink-soft lg:mx-0">
              Every spring the treasurer graduates and the budget walks out with
              them. Tenure keeps the money, the events, the approvals and what
              the last officer learned attached to the seat rather than the
              person holding it &mdash; so the next leader opens a record
              instead of an empty folder.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ContactSales size="lg" arrow />
              <Button href="#platform" variant="secondary" size="lg">
                Explore the platform
              </Button>
            </div>

            {/* The site had one audience: someone evaluating Tenure. The person
                whose club already runs on it had nowhere to go — every control
                on every page booked a sales call. This is that path.

                It points at /contact rather than the application, because the
                app's public host is not recorded anywhere in this repository
                and inventing one would be worse than the omission. The wording
                stays inside what /trust already publishes (accounts are created
                in advance, there is no self-service signup) and names no
                sign-in mechanism, which C-023 forbids. */}
            <p className="mx-auto mt-4 max-w-md text-[0.82rem] leading-relaxed text-ink-faint lg:mx-0">
              Already using Tenure?{" "}
              <Link
                href="/contact"
                className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
              >
                Ask us for your sign-in
              </Link>{" "}
              &mdash; accounts are set up in advance for a named person, so
              there is no public signup to find.
            </p>

            <Reveal delay={0.12} y={8}>
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
