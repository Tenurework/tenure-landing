"use client";

import { useState } from "react";
import Image from "next/image";
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelNote } from "@/components/ui/Panel";
import { Segmented, type SegmentItem } from "@/components/ui/Segmented";
import { site } from "@/lib/site";

/**
 * WHO THE SEAT MODEL SERVES — and the reason this is on the HOME page now.
 *
 * Tenure is for any organization where people rotate faster than knowledge
 * transfers: universities, nonprofits and NGOs, small and mid-sized businesses,
 * associations and chapters. The site did not read that way. The hero opened with
 * a treasurer graduating, the problem section priced the cost in semesters, the
 * FAQ quoted "per club" — and the one surface that said otherwise was three
 * routes deep on /product, as four photo cards with four long bodies, where an
 * NGO or an SME would never see it.
 *
 * So the audience list moved here, into the orientation the home page is for, and
 * it was REMOVED from /product rather than rendered in both places. Four cards
 * became one panel with four sector tabs: the tab row states the breadth in a
 * single glance, which is the whole job, and the pane below it shows one sector's
 * seat, cadence and argument at a time instead of four at once.
 *
 * The photo is a sibling of the copy, never behind it. A caption over an image
 * has whatever contrast the pixels underneath it happen to give — the previous
 * version measured 1.05:1 against the card, and would have been white-on-white
 * if the photo had failed to load.
 */

const TABS: SegmentItem[] = site.audiences.map((a) => ({
  key: a.sector,
  label: a.sector,
}));

export function Audiences() {
  const [active, setActive] = useState<string>(site.audiences[0].sector);
  const a = site.audiences.find((x) => x.sector === active) ?? site.audiences[0];

  return (
    <Section tone="canvas" backdrop="quiet">
      <Container>
        <SectionHead
          align="center"
          eyebrow="Who it's for"
          title={
            <>
              One model. Every kind of{" "}
              <span className="text-gradient">organization that rotates</span>.
            </>
          }
          lead="The people change, the seat stays. Wherever turnover outpaces knowledge transfer, the same durable-seat model keeps the operations and the memory with the role rather than with whoever holds it this cycle."
        />

        <Reveal delay={0.14} className="mt-9">
          <div className="flex justify-center">
            <Segmented
              label="Choose a sector"
              items={TABS}
              active={active}
              onSelect={setActive}
              className="w-full sm:w-auto"
            />
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mt-6">
          <Panel>
            {/* `min-h` holds the panel steady across sectors: the four bodies
                differ by about two lines, and without it the tab row jumps under
                the cursor that just used it. */}
            <div className="grid min-h-[17rem] md:grid-cols-[minmax(0,38%)_1fr]">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line md:aspect-auto md:border-b-0 md:border-r">
                <Image
                  key={a.photo}
                  src={a.photo}
                  alt={a.alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 38vw"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-7">
                <p className="label-mono">{a.cadence}</p>
                <h3 className="font-display mt-3 text-[1.3rem] font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                  {a.title}
                </h3>
                <p className="mt-3.5 max-w-xl leading-relaxed text-ink-soft">{a.body}</p>

                <div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-xl border border-line bg-paper/60 px-3 py-2">
                  <span className="label-mono text-[0.55rem]">Example seat</span>
                  <span className="font-mono text-[0.78rem] text-ink">{a.seat}</span>
                </div>
              </div>
            </div>

            <PanelNote>
              Committees, guilds, agencies, sports clubs, faith groups &mdash; if the
              calendar changes the people but not the work,{" "}
              <span className="font-medium text-ink-soft">
                Tenure is the seat that remembers
              </span>
              . The product surfaces elsewhere on this page are drawn from a student
              organization because that is where the first pilot is proposed; the
              model does not depend on it.
            </PanelNote>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
