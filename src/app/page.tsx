import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Problem } from "@/components/home/Problem";
import { SeatMechanism } from "@/components/home/SeatMechanism";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Handoff } from "@/components/home/Handoff";
import { MetricsBand } from "@/components/home/MetricsBand";
import { Platform } from "@/components/home/Platform";
import { ProductAtWork } from "@/components/home/ProductAtWork";
import { AiOnboarding } from "@/components/home/AiOnboarding";
import { Governance } from "@/components/home/Governance";
import { OfficeConsole } from "@/components/home/OfficeConsole";
import { WhoFor } from "@/components/home/WhoFor";
import { Integrations } from "@/components/home/Integrations";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/site/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Problem />
      <SeatMechanism />
      <HowItWorks />
      <Handoff />
      <MetricsBand />
      <Platform />
      <ProductAtWork />
      <AiOnboarding />
      <Governance />
      <OfficeConsole />
      <WhoFor />
      <Integrations />
      <Faq />
      <CtaBand />
    </>
  );
}
