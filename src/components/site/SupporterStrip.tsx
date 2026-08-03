import Image from "next/image";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function SupporterStrip() {
  return (
    <section className="border-y border-line bg-cloud">
      <Container className="py-9 sm:py-11">
        <Reveal className="flex flex-col items-center gap-7 sm:flex-row sm:justify-center sm:gap-16">
          {/*
            "Supported by" over both marks overstated one of them — Simon is where
            Tenure was founded, not a supporter — and this strip shipped without the
            non-endorsement note that TrustStrip carries on the home page, so /story
            was the one route displaying the university mark with nothing qualifying
            it. C-022 permits these marks for origin and support only.
          */}
          <p className="label-mono shrink-0">Origin &amp; support</p>
          <div className="flex items-center gap-10 sm:gap-16">
            {site.supporters.map((s) => (
              <Image
                key={s.name}
                src={s.src}
                alt={s.name}
                width={s.width}
                height={s.height}
                className="w-auto object-contain opacity-90 mix-blend-multiply"
                style={{ height: s.displayHeight }}
              />
            ))}
          </div>
          <p className="sr-only">
            Tenure was founded at Simon Business School, University of Rochester,
            and is supported by Startup Wednesday. Neither mark indicates that its
            organization is a customer of Tenure, sponsors the product, or endorses
            it.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
