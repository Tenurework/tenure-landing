import Image from "next/image";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

// The scope chip reads from site.pilot, which is the governed source for pilot
// phrasing (C-021: verbally agreed, NOT contracted). "Every org OSE stewards"
// stated a settled scope; scopeShort states a proposed one.
const CHIPS = [
  site.pilot.scopeShort,
  "Hard + soft conflict detection",
  "2-gate approval chain, 7 request types",
  // NOT "immutable": /trust warns buyers to interrogate that word, and the
  // audit table has no hash, signature or checksum column. Append-only is
  // what is true, and it is still the strong claim.
  "Append-only audit trail",
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-cloud">
      <Container className="py-9 sm:py-10">
        <Reveal className="flex flex-col items-center gap-7 lg:flex-row lg:justify-between lg:gap-10">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
            <p className="label-mono shrink-0 text-center">
              Planned {site.pilot.season} pilot
            </p>
            <div className="flex items-center gap-9 sm:gap-12">
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
          </div>

          <span aria-hidden className="hidden h-8 w-px bg-line lg:block" />

          <ul className="flex flex-wrap items-center justify-center gap-2.5">
            {CHIPS.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/60 px-3 py-1.5 text-[0.8rem] font-medium text-ink-soft"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-sm bg-grove" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
