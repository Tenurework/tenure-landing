import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Problem } from "@/components/home/Problem";
import { SeatMechanism } from "@/components/home/SeatMechanism";
import { Platform } from "@/components/home/Platform";
import { Handoff } from "@/components/home/Handoff";
import { AiOnboarding } from "@/components/home/AiOnboarding";
import { OfficeConsole } from "@/components/home/OfficeConsole";
import { Integrations } from "@/components/home/Integrations";
import { MetricsBand } from "@/components/home/MetricsBand";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/");

/**
 * Home: conviction and orientation, in that order.
 *
 * The page used to carry the entire sales deck, product manual, security review
 * and pilot page at once — 16 sections, ~3,200 words and 18 viewport-heights,
 * roughly five times the length of any other route. Four arguments were made
 * twice.
 *
 * The sequence below is the argument, once each:
 *   1. Hero            — the thesis
 *   2. TrustStrip      — orientation, one line
 *   3. Problem         — why handoffs fail today
 *   4. SeatMechanism   — the durable seat. This is the differentiator
 *   5. Platform        — what Tenure actually runs
 *   6. Handoff         — the proof: a packet assembled from the record
 *   7. AiOnboarding    — and questions answered over permission-scoped sources
 *   8. OfficeConsole   — what the office gets (absorbed the Governance section)
 *   9. Integrations    — how it fits, and what it deliberately does not connect to
 *  10. MetricsBand     — evidence, counted from the deploying repository
 *  11. Faq / CtaBand   — objections, then the ask
 *
 * Moved to /product, where they answer that page's job instead of repeating
 * this one: HowItWorks (a second telling of the seat mechanism), ProductAtWork
 * (product surfaces) and WhoFor (audience segments). Governance merged into
 * OfficeConsole — both addressed the office, and the security detail belongs on
 * /trust where a reviewer can find it.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Problem />
      <SeatMechanism />
      <Platform />
      <Handoff />
      <AiOnboarding />
      <OfficeConsole />
      <Integrations />
      <MetricsBand />
      <Faq />
      <CtaBand />
    </>
  );
}
