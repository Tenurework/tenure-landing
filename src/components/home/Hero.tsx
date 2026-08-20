import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { Backdrop } from "@/components/visuals/Backdrop";
import { site } from "@/lib/site";

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

/**
 * The scope chips, read from the governed source. `site.pilot.scopeShort` states
 * a PROPOSED scope; "Every org OSE stewards" stated a settled one (C-021:
 * verbally agreed, NOT contracted).
 *
 * "Append-only audit trail" and not "immutable": /trust warns buyers to
 * interrogate that exact word, the audit table has no hash, signature or
 * checksum column, and `forbiddenPhrases` blocks it.
 */
const CHIPS = [
  site.pilot.scopeShort,
  "2-gate approval chain, 7 request types",
  "Append-only audit trail",
  "Bring your own spreadsheets",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-24 sm:pt-28">
      <Backdrop variant="aurora" />

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

        {/* The closing rail: origin marks on the left, scope chips on the right.
            One row, one hairline, no section of its own. */}
        <div className="mt-12 border-t border-line pb-10 pt-6 sm:mt-14">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
              {/*
                Captioned "Origin & support", never "pilot". The University of
                Rochester’s mark beside the words "Fall 2026 pilot" reads as the
                university being in the pilot, or endorsing the product; C-022
                permits these marks for origin and support only.
              */}
              <p className="label-mono shrink-0">Origin &amp; support</p>
              {/* The plate is applied in dark mode only — see globals.css. Both
                  marks are dark-ink PNGs, so on the near-black canvas they were
                  invisible whatever the blend mode was, measured at 1.09:1
                  against their own background. A light plate preserves the
                  artwork exactly, which also matters under C-022: the marks are
                  permitted for origin and support only, and recolouring them is
                  the one thing that permission does not cover. */}
              {/* shrink-0 is load-bearing. As a flex item in the rail this box
                  shrank below its own content width when the scope chips
                  competed for space, and the two marks simply overflowed it.
                  Invisible while the box had no background — which is how it
                  went unnoticed — and obvious the moment the dark-mode plate
                  gave it one, with the plate ending mid-row. */}
              <div className="logo-plate flex shrink-0 items-center gap-8 sm:gap-10">
                {site.supporters.map((s) => (
                  <Image
                    key={s.name}
                    src={s.src}
                    alt={s.name}
                    width={s.width}
                    height={s.height}
                    className="logo-mark w-auto object-contain opacity-90"
                    style={{ height: s.displayHeight }}
                  />
                ))}
              </div>
              <p className="sr-only">
                Tenure was founded at Simon Business School, University of
                Rochester, and is supported by Startup Wednesday. Neither mark
                indicates that its organization is a customer of Tenure, sponsors
                the product, or endorses it.
              </p>
            </div>

            <span aria-hidden className="hidden h-8 w-px bg-line lg:block" />

            {/*
              A SCROLLING ROW ON A PHONE, A WRAPPING ONE ABOVE IT.

              These four chips are 28-38 characters each, so at 390px `flex-wrap`
              gave each one its own line: four lines, ~150px, to carry four scope
              facts nobody reads before the fold. The hero measured 1,750px on a
              phone — two full screens before the first section.

              Scrolling keeps all four reachable and costs one line. It matches
              `Segmented`, which made the same move for the same reason at the
              same width, and the `overflow-x` ancestor is what exempts the row
              from the 320px reflow check in a11y.spec.ts.
            */}
            <ul
              /*
                FOCUSABLE, BECAUSE IT SCROLLS AND NOTHING INSIDE IT DOES.

                axe flagged this as `scrollable-region-focusable` (serious), twice
                — a region a mouse can scroll and a keyboard cannot reach is
                unusable without a pointer. `Segmented` and `RailList` never hit
                this because their children are real buttons; these chips are
                inert text, so the container has to take the tab stop itself.

                It stays a <ul>. `role="group"` would have removed the list role
                and orphaned every <li>, which is the same defect this repo
                already fixed once in RailList — see the note there.
              */
              tabIndex={0}
              aria-label="What is in scope"
              className="-mx-5 flex max-w-full items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:px-0"
            >
              {CHIPS.map((c) => (
                <li
                  key={c}
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-paper/70 px-3 py-1.5 text-caption font-medium text-ink-soft"
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-sm bg-grove" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Two facts that used to be separate paragraphs of hero small print.
              The pilot hedge is load-bearing: C-021 requires "planned" or
              "proposed" in the same sentence as the season and the office. */}
          <p className="mt-5 text-center text-caption leading-relaxed text-ink-faint lg:text-left">
            Planned {site.pilot.season} pilot with {site.origin.office}{" "}
            &mdash; proposed, not contracted. The product surfaces on this page are illustrations,
            not screenshots: they draw behaviour the product really has, with
            representative names and figures.
          </p>
        </div>
      </Container>
    </section>
  );
}
