import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { Backdrop } from "@/components/visuals/Backdrop";
import { MockCaption } from "@/components/ui/Panel";

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

      {/*
        THE HERO BREAKS OUT 64px PAST THE BODY CONTAINER, and the side-by-side
        split now starts at `xl` rather than `lg`. Both are consequences of one
        measurement.

        Inside `max-w-6xl` the mock's own min-content (695px, of which it bleeds
        6vw off the right edge) leaves the copy a 447px column. "The know-how" is
        held on one line and measures 7.8px wide for every 1px of font-size, so
        447px caps the headline at ~57px — under the `display` step, in the
        layout that is supposed to be the largest type on the site.

        At `lg` it is worse: a 1024px viewport leaves the copy 335px, which is
        narrower than a phone. That range now stacks, which is what a 335px
        column was always asking for.
      */}
      <Container className="relative xl:max-w-[80rem]">
        <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,49%)_1fr] xl:gap-8">
          {/* LEFT, editorial copy */}
          <div className="relative z-10 max-w-xl text-center xl:max-w-none xl:text-left">
            <p className="label-mono">The system of record for organizations that rotate</p>

            {/*
              Leading, tracking and weight now ride on the size token, so the
              hand-set `leading-[1.02] tracking-[-0.035em] font-semibold` that
              used to sit here are gone — at 96px they were tuned for a 42px
              headline and fought the step they were applied to.

              "The know-how" is held together with `whitespace-nowrap`, NOT with
              a non-breaking hyphen. At the new scale the browser broke the line
              at the ordinary hyphen and rendered "The know-" over "how stays." —
              a hyphenated stump is the most amateur thing a large headline can
              do, and it only appeared once the type was big enough to matter.
              U+2011 fixes it visually but changes the codepoint, so the headline
              would no longer match "know-how" for search, copy-paste or any test
              asserting the page's own words. A CSS break rule costs nothing and
              keeps the text ASCII.

              THE SIZE IS CAPPED AT `text-display`, and holding the line together
              is exactly why. An unbreakable phrase cannot be sized past the
              column that holds it: "The know-how" measures 7.8px wide for every
              1px of font-size, so at the 96px `text-hero` step it wanted 749px
              inside a 576px column. It did not wrap — it could not — so it spilled
              173px to the right, across the product mock, at every desktop width
              measured (1024/1280/1440/1600). The headline was sitting ON TOP of
              the interface it was introducing, and the only reason it was caught
              is that the overlapping text swallowed the pointer events meant for
              the mock's module rail.

              So the two-column hero gets the `display` step and the column gets
              4% more width. `text-hero` stays in the scale for a headline that
              owns the full measure; it is not a size this layout can hold.
            */}
            <h1 className="font-display mt-5 text-display-sm text-ink sm:text-display">
              <span className="block">People move on.</span>
              <span className="block">
                <span className="whitespace-nowrap">The know-how</span>{" "}
                <span className="text-gradient">stays.</span>
              </span>
            </h1>

            {/* Opens on the image, not the abstraction: the reader is the person
                staring at the empty folder. The image is now sector-neutral —
                a treasurer graduating is one instance of it, not the whole of it. */}
            {/*
              Cut from five lines to two. At 42px the old lead was a paragraph
              under a headline; at 96px it is a caption, and it has to behave like
              one. Everything removed is said properly by the sections below —
              a hero that explains the whole product has not decided what the
              product is.
            */}
            <p className="mx-auto mt-6 max-w-md text-lead text-ink-soft xl:mx-0">
              Budgets, vendors, approvals and the reasoning behind them attach to
              the <span className="font-medium text-ink">seat</span>, not to
              whoever is holding it this year.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
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
            <p className="mx-auto mt-4 max-w-md text-caption leading-relaxed text-ink-faint xl:mx-0">
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
          <div className="relative pt-2 xl:-mr-[6vw] xl:pt-0">
            <DashboardMock tilt auto className="relative z-0" />
            <MockCaption />
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
          nature of the product surfaces is carried by a caption on each drawn
          surface — `MockCaption`, in components/ui/Panel.tsx.

          An earlier version of this comment claimed that disclosure lived "once,
          on /trust". It did not. A rendered-text sweep of all eight routes found
          no such sentence anywhere, so for one commit the site shipped eight
          drawn application interfaces — a treasury balance, named people, vendor
          figures — with no label at all. Deleting the apology was right;
          deleting it without replacing it was not.
        */}
      </Container>
    </section>
  );
}
