import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionContour } from "@/components/visuals/SectionContour";
import { site } from "@/lib/site";

const PHOTO: Record<string, { src: string; alt: string }> = {
  "University organizations": {
    src: "/photos/students-laptop.jpg",
    alt: "Student organization members gathered around a laptop on campus",
  },
  "University administrations": {
    src: "/photos/students-hall.jpg",
    alt: "Students walking through a university hall",
  },
  "SMEs & growing teams": {
    src: "/photos/team-meeting.jpg",
    alt: "A small team meeting around a table",
  },
  "Nonprofits, chapters & boards": {
    src: "/photos/team-charts.jpg",
    alt: "A board reviewing plans and charts together",
  },
};

export function WhoFor() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-sand py-24 sm:py-32">
      <SectionContour place="tl" seed={8} className="text-ink/[0.06]" />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">Who it&rsquo;s for</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              One model. Every kind of{" "}
              <span className="text-gradient">organization</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 text-lg leading-relaxed text-ink-soft">
              The people rotate. The seat stays. Wherever turnover outpaces knowledge
              transfer, the same durable-seat model keeps the operations and the
              memory with the role, not the person who happens to hold it this term.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {site.audiences.map((a, i) => {
            const photo = PHOTO[a.title];
            return (
              <Reveal key={a.title} delay={0.06 + (i % 2) * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-cloud shadow-[0_1px_2px_rgba(12,30,51,0.05)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(12,30,51,0.4)]">
                  <div className="relative aspect-[16/8] overflow-hidden">
                    {photo && (
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={1600}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    )}
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg border border-cloud/25 bg-ink/40 px-2.5 py-1 font-mono text-[0.62rem] text-paper backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-sm bg-grove-bright" />
                      {a.seat}
                    </span>
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="font-display text-xl font-semibold text-paper">{a.title}</h3>
                      <p className="mt-0.5 text-[0.78rem] text-paper/75">{a.cadence}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="leading-relaxed text-ink-soft">{a.body}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-[0.95rem] text-ink-soft">
            Committees, agencies, chapters, guilds, sports clubs, if the calendar
            changes the people but not the work,{" "}
            <span className="font-medium text-ink">Tenure is the seat that remembers.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
