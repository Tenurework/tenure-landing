import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { SeatMechanism } from "@/components/home/SeatMechanism";
import { Platform } from "@/components/home/Platform";
import { Handoff } from "@/components/home/Handoff";
import { AiOnboarding } from "@/components/home/AiOnboarding";
import { OfficeConsole } from "@/components/home/OfficeConsole";
import { Audiences } from "@/components/home/Audiences";
import { MetricsBand } from "@/components/home/MetricsBand";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/");

/**
 * Home: conviction and orientation, in that order.
 *
 * THE SHAPE OF THIS PAGE, AND WHAT THE COMPACTION PASS DID TO IT.
 *
 * The page ran twelve sections over 13.5 desktop viewports and 23.8 on a phone —
 * about four times the length of any other route. Length was the symptom; the
 * cause was that almost every section answered its heading with a GRID. Nine
 * platform cards, four audience cards, three console cards, two problem cards,
 * three integration lanes. A reader met three to nine arguments at once, read
 * none of them, and paid a full viewport for each set.
 *
 * Every section below is now one card with one thing in view at a time. Where a
 * section genuinely had many items (eleven platform modules, six console
 * sections, four sectors), they became a rail or a tab row inside a single panel:
 * the completeness is still visible — eleven names scan faster than nine cards —
 * but only one of them is being read.
 *
 * The sequence, once each:
 *   1. Hero          — the thesis, with the origin marks and scope chips folded
 *                      into its closing rail instead of a section of their own
 *   2. Problem       — the cost of turnover, as one ledger read across
 *   3. SeatMechanism — the durable seat. The differentiator, and the only
 *                      section protected from compaction on content
 *   4. Platform      — eleven modules, one open
 *   5. Handoff       — the packet, assembled rather than written
 *   6. AiOnboarding  — questions answered over permission-scoped sources,
 *                      and the AI subprocessor disclosure
 *   7. OfficeConsole — what the body above gets
 *   8. Audiences     — who the model serves, across four sectors
 *   9. MetricsBand   — evidence, counted from the deploying repository
 *  10. Faq / CtaBand — objections, then the ask
 *
 * REMOVED, AND WHY — each was a duplicate, not a cut:
 *
 *   TrustStrip      a whole bordered band for two logos and four chips. Now the
 *                   hero's closing rail. Same words, one less section boundary.
 *   MockDisclosure  a standalone strip whose single sentence now closes the
 *                   hero rail, next to the pilot hedge it belongs with.
 *   Integrations    three file-format lanes that duplicated ToolLogos on
 *                   /product almost verbatim, with ".xlsx" listed twice inside
 *                   each. Replaced by one ConnectorMatrix on /product that
 *                   answers the question buyers actually ask, including the
 *                   vendors the answer is "no" for.
 *   Shadow access   Handoff's sub-block and AiOnboarding's h2 were the SAME
 *                   SENTENCE — "They read the seat before they sit in it" —
 *                   and SeatMechanism was already showing the three states.
 *                   Stated once now, in the seat panel.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Audiences />
      <SeatMechanism />
      <Platform />
      <Handoff />
      <AiOnboarding />
      <OfficeConsole />
      <MetricsBand />
      <Faq />
      <CtaBand />
    </>
  );
}
