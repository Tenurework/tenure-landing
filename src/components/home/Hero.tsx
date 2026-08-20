import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { Backdrop } from "@/components/visuals/Backdrop";

/**
 * NOTHING IN THE FIRST VIEWPORT ANIMATES IN.
 *
 * The headline used to be a word-by-word blur-in built on `motion`, which meant
 * the largest text on the page — the LCP element — was server-rendered at
 * `opacity: 0` behind a blur filter and only became legible after the bundle
 * booted. The supporting paragraph and both calls to action had the same problem
 * one layer down, through `Reveal`'s `.js`-scoped hidden state. Everything above
 * the fold paints with the document, and nothing in this file is wrapped in
 * `Reveal`. Keep it that way.
 *
 * WHAT CHANGED IN THE COMPACTION PASS
 *
 * 1. **The trust strip moved in.** It was its own bordered section directly
 *    below — a full band for two logos and four chips. It is now the hero's
 *    closing rail, which removes a section boundary and about 180px without
 *    losing a word.
 * 2. **Three stacked footnotes became one.** The hero carried a lead paragraph
 *    and then three separate small-print paragraphs (the existing-customer
 *    path, the import/calendar line, the pilot hedge) in three different
 *    positions. That is the "three things at once" problem in its purest form:
 *    a reader met four blocks of prose before the first section. The
 *    existing-customer path is now one line under the buttons, and the import
 *    and pilot facts are chips in the rail, next to the other scope chips they
 *    always belonged with.
 * 3. **HeroShapes is gone.** Four floating squares in a separate component,
 *    `hidden lg:block`. The Memphis figure in `Backdrop`'s aurora variant does
 *    the same job with real composition instead of four coloured rectangles.
 * 4. **The opening sentence is no longer about a university.** It said "Every
 *    spring the treasurer graduates" — an image that only lands for one of the
 *    four audiences this product serves, at the top of the page, before the
 *    reader has any other frame. The turnover it describes is now stated the way
 *    it happens everywhere, and the sector rail sits a screen below.
 */


export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-24 sm:pt-28">
      <Backdrop variant="grid" />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,45%)_1fr] lg:gap-8">
          {/* LEFT, editorial copy */}
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <p className="label-mono">The system of record for organizations that rotate</p>

            <h1 className="font-display mt-5 text-display-sm font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-display lg:text-hero">
              <span className="block">People move on.</span>
              <span className="block">
                The know-how <span className="text-gradient">stays.</span>
              </span>
            </h1>

            {/* Opens on the image, not the abstraction: the reader is the person
                staring at the empty folder. The image is now sector-neutral —
                a treasurer graduating is one instance of it, not the whole of it. */}
            <p className="mx-auto mt-5 max-w-lg text-lead leading-relaxed text-ink-soft sm:text-title-sm lg:mx-0">
              Someone leaves, and the budget, the vendors and the reasons leave
              with them. Tenure attaches the money, the events, the approvals and
              what the last holder learned to the{" "}
              <span className="font-medium text-ink">seat</span>{" "}
              rather than the person in it &mdash; so the next one opens a record instead
              of an empty folder.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <ContactSales size="lg" arrow />
              <Button href="#platform" variant="secondary" size="lg">
                See the platform
              </Button>
            </div>

            {/* The site had one audience: someone evaluating Tenure. The person
                whose organization already runs on it had nowhere to go — every
                control on every page booked a call. This is that path.

                It points at /contact rather than the application, because the
                app’s public host is recorded nowhere in this repository and
                inventing one would be worse than the omission. The wording stays
                inside what /trust already publishes (accounts are created in
                advance, there is no self-service signup) and names no sign-in
                mechanism, which C-023 forbids. */}
            <p className="mx-auto mt-4 max-w-md text-caption leading-relaxed text-ink-faint lg:mx-0">
              Already using Tenure?{" "}
              <Link
                href="/contact"
                className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
              >
                Ask us for your sign-in
              </Link>{" "}
              &mdash; accounts are set up in advance for a named person, so there
              is no public signup to find.
            </p>
          </div>

          {/* RIGHT, the product surface, bleeding off the right edge.

              HeroFloatingCards was removed here. Two "notification" cards floated
              over the dashboard’s left edge at xl and above, and at 1440px they
              sat directly on top of the ledger — "Membership dues, 28 paid" read
              as "mbership dues", "Halden Catering, fall sponsorship" as "ark, fall
              sponsorship". Four rows of the most concrete thing on the page were
              cut in half by decoration.

              Narrowing them would have been a fix for that screenshot rather than
              for the class: they are absolutely positioned over a surface whose
              internal layout is fluid, so any width that clears the ledger at one
              viewport collides at another. And they were duplicating the mock
              anyway — the conflict they announced is in its Calendar panel and the
              cleared approval is in its Approvals panel. Removing them takes out a
              component, a class of overlap bug, and one more piece of repetition. */}
          <div className="relative pt-2 lg:-mr-[10vw] lg:pt-0 xl:-mr-[6vw]">
            <DashboardMock tilt auto className="relative z-0" />
          </div>
        </div>

        {/*
          THE HERO ENDS ON THE PRODUCT.

          What used to close it was a rail carrying three unrelated things — two
          institutional marks under the caption "Origin & support", four scope
          chips, and a paragraph of small print reading "proposed, not
          contracted … illustrations, not screenshots".

          All three are gone from here. The marks moved to a "Supported by" band
          of their own further down, which is where every company this site is
          measured against puts them. The scope chips said in four fragments what
          the sections below say properly. And the small print was a paragraph
          apologising for the page directly underneath the strongest claim on the
          site — the single most damaging sentence in the whole design. The pilot
          is a real Fall 2026 deployment and is stated as one on /pilot; the
          nature of the product surfaces is stated once, on /trust, where somebody
          evaluating the product is actually reading.
        */}
      </Container>
    </section>
  );
}
