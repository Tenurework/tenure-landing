import Image from "next/image";
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * INDUSTRIES — photography, a scrim, and one specific sentence each.
 *
 * WHAT THIS REPLACED. `Audiences` was a tab strip: four sectors, one visible at
 * a time, behind a control the reader had to operate. It showed a quarter of the
 * argument at rest, and the four labels — Universities, NGOs, SMEs,
 * Associations — described the organizations the founders had talked to rather
 * than the market the mechanism serves. Someone in healthcare or energy scanned
 * that and correctly concluded the product was not aimed at them.
 *
 * A grid shows all eight at once, which is the whole point of the claim: the
 * seat model is not a university thing.
 *
 * IT IS NOW A SIDE-SCROLL, and that is measured rather than fashionable.
 * cohere.com carries exactly one horizontal scroller on its home page — a
 * snap-mandatory flex row 3,140px wide inside a 1,440px viewport, with the same
 * 40px page margin as everything else. It is the one device the page uses to
 * say "there is more of this than fits", and it earns the claim by letting the
 * next card sit half-visible at the right edge instead of announcing a count.
 *
 * A four-across grid of eight tiles said the opposite: two tidy rows, complete,
 * nothing beyond. Eight sectors in a row that runs off the edge reads as a list
 * that continues, which is the actual argument.
 *
 * THE SCROLLER IS A KEYBOARD REGION. A `tabIndex={0}` container with a name is
 * what makes an overflow area reachable without a pointer; without it the arrow
 * keys never reach the content and eight tiles become one.
 *
 * WHY PHOTOGRAPHY, AND WHY IT IS GRADED. The site had almost no imagery, and a
 * page of type and drawn UI cards is most of why it read as a template. But
 * eight photographs from eight shoots read as a stock library unless they are
 * treated as one set — so every tile takes the same duotone-ish grade
 * (desaturated, warmed toward the canvas) and the same navy scrim. The scrim is
 * not decoration: it is what guarantees white type clears contrast over a
 * photograph whose brightness this component cannot know.
 *
 * THE SENTENCE IS ALWAYS VISIBLE, never a hover reveal. A hover-only body is
 * unreachable on touch, and it would hide the only part of the tile that says
 * anything specific — the label alone is a category, the sentence is the
 * argument.
 *
 * NOTHING HERE CLAIMS A DEPLOYMENT. These are the sectors where roles outlast
 * the people in them, which is positioning, not traction. There is one
 * deployment and it is named on /pilot.
 */
export function Industries() {
  return (
    <Section from="canvas" tone="surface" backdrop="light">
      <Container>
        <SectionHead
          align="center"
          eyebrow="Industries"
          title={
            <>
              One model. Every sector where the role{" "}
              <span className="text-gradient">outlasts the person</span>.
            </>
          }
          lead="Turnover is scheduled in some industries and constant in others. The mechanism does not change: attach the record to the seat, and whoever holds it next starts from it."
        />
      </Container>

      {/*
        FULL-BLEED, not container-bound. The row starts at the page margin and
        runs off the right edge — the crop IS the message. Padding rather than a
        container is what lets the first card line up with the heading above it
        while the last one is free to leave.
      */}
      <Reveal delay={0.1} className="mt-12">
        {/*
          THE SCROLL REGION IS THE WRAPPER, NOT THE LIST.

          `role="region"` on the <ul> replaced its implicit `list` role, which
          orphaned all eight <li> children — axe reported eight serious
          "list item parent element has a role that is not role=list"
          violations, and a screen reader would have announced the group as an
          unstructured region with no item count. An ARIA role does not add to an
          element, it replaces what the element already was.

          So the div scrolls and carries the name; the list stays a list.
        */}
        <div
          role="region"
          aria-label="Industries Tenure is built for — scroll horizontally for more"
          tabIndex={0}
          className={
            // `scroll-p*` has to mirror the padding. Snap alignment measures from
            // the scrollport's content edge, so `snap-start` pulled the first card
            // flush to x=0 and left scrollLeft sitting at 40 — the page margin was
            // applied and then immediately scrolled away.
            "no-scrollbar snap-x snap-mandatory overflow-x-auto px-4 pb-2 " +
            "scroll-pl-4 sm:px-6 sm:scroll-pl-6 lg:px-10 lg:scroll-pl-10"
          }
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
                      className="industry-photo object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* The caption sits on a solid surface, never on the photograph.
                      White type over an image the component cannot measure is a
                      contrast failure waiting for the wrong photo; the walker that
                      checks it climbs ancestors and cannot see a sibling scrim. */}
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
    </Section>
  );
}
