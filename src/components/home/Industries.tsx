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
    <Section from="canvas" tone="subtle" backdrop="light">
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

        <Reveal delay={0.1} className="mt-9">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {site.industries.map((ind) => (
              <li key={ind.key}>
                <article className="group relative isolate flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-lg">
                  <Image
                    src={ind.photo}
                    alt={ind.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 88vw"
                    className="industry-photo object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  {/*
                    The scrim, in two stops rather than one flat wash: a full-tile
                    tint that unifies eight different exposures, and a stronger
                    bottom ramp under the type. Measured white-on-scrim at the
                    label baseline clears 4.5:1 on the brightest of the eight.
                  */}
                  {/*
                    THE TINT, which unifies eight exposures into one set. It is a
                    sibling, so the contrast walker in a11y.spec.ts cannot see it
                    — it resolves a text node's backdrop by climbing ANCESTORS.
                    That is fine here because this layer only ever darkens: it
                    makes the real contrast better than anything measured
                    without it.
                  */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--inverse-deep)_55%,transparent),color-mix(in_oklab,var(--inverse-deep)_22%,transparent))]"
                  />
                  {/*
                    THE CAPTION PANEL IS A SOLID TOKEN, and that is a
                    correctness decision rather than a stylistic one.

                    Two earlier attempts failed the contrast gate for the same
                    underlying reason. As an absolutely-positioned SIBLING the
                    scrim was invisible to the walker, which climbs ancestors —
                    it resolved white type against the section's cream and
                    reported 1.11:1 on a tile measuring 5.32:1 in reality. Moving
                    the gradient onto the ancestor did not help either, because
                    the walker cannot parse `color-mix()` — the same limitation
                    globals.css already records against check-contrast.mjs.

                    A checker that cannot see the thing protecting the text is
                    not a checker you can ship behind, and the honest fix is not
                    to exempt the tile: it is to give the type a backdrop that is
                    unambiguous to a machine AND unconditional in reality. An
                    opaque token is both. White on --inverse-deep is ~15:1, and
                    it holds whatever photograph is swapped in behind it — which
                    a gradient over an unknown image never truly does.

                    The photo fades into the panel through the sibling ramp
                    above, so the join reads as one surface rather than a card
                    with a caption bar stuck on it.
                  */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-[8.5rem] h-28 bg-[linear-gradient(to_top,var(--inverse-deep),transparent)]"
                  />
                  <div className="relative bg-band-deep p-5">
                    {/*
                      `text-title` (20.8px) rather than `text-title-sm`, and the
                      reason is measured rather than aesthetic. At 18.4px
                      semibold the label sits just under WCAG's large-text
                      threshold, so it owes 4.5:1 — and over the brightest four
                      photographs it measured 4.00-4.06:1. Above 18.66px bold it
                      is large text and owes 3:1, and the strengthened scrim
                      takes every tile past 4.5:1 regardless. It also simply
                      reads better at this scale.
                    */}
                    <h3 className="font-display text-title tracking-tight text-inverse">
                      {ind.label}
                    </h3>
                    <p className="mt-2 text-caption leading-relaxed text-inverse/80">
                      {ind.line}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
