import Image from "next/image";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function SupporterStrip() {
  return (
    <section className="border-y border-line bg-cloud">
      <Container className="py-9 sm:py-11">
        <Reveal className="flex flex-col items-center gap-7 sm:flex-row sm:justify-center sm:gap-16">
          <p className="label-mono shrink-0">Supported by</p>
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
        </Reveal>
      </Container>
    </section>
  );
}
