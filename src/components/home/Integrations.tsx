/* eslint-disable @next/next/no-img-element */
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

const TOOLS: { src: string; name: string }[] = [
  { src: "/logos/tools/google-drive.svg", name: "Google Drive" },
  { src: "/logos/tools/gmail.svg", name: "Gmail" },
  { src: "/logos/tools/google-calendar.svg", name: "Google Calendar" },
  { src: "/logos/tools/slack-icon.svg", name: "Slack" },
  { src: "/logos/tools/notion-icon.svg", name: "Notion" },
  { src: "/logos/tools/microsoft-teams.svg", name: "Teams" },
  { src: "/logos/tools/outlook.svg", name: "Outlook" },
  { src: "/logos/tools/excel.svg", name: "Excel" },
  { src: "/logos/tools/zoom-icon.svg", name: "Zoom" },
  { src: "/logos/tools/dropbox.svg", name: "Dropbox" },
  { src: "/logos/tools/discord-icon.svg", name: "Discord" },
  { src: "/logos/tools/box.svg", name: "Box" },
];

function Chip({ t }: { t: { src: string; name: string } }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-cloud px-4 py-2.5 shadow-[0_1px_2px_rgba(12,30,51,0.04)]">
      <img src={t.src} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" loading="lazy" />
      <span className="whitespace-nowrap text-[0.86rem] font-medium text-ink-soft">{t.name}</span>
    </span>
  );
}

export function Integrations() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-paper py-24 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">Fits your stack</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
              No rip-and-replace. Tenure sits{" "}
              <span className="text-gradient">on top of what you use</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Keep the drive, the inbox, and the group chat. Tenure pulls the files,
              threads, and decisions that define how the org runs into one governed
              record, and the AI reads across all of it.
            </p>
          </Reveal>
        </div>
      </Container>

      {/* full-bleed marquee */}
      <div className="marquee-mask relative mt-14 overflow-hidden">
        <div className="flex w-max animate-marquee gap-3 pr-3 hover:[animation-play-state:paused]">
          {TOOLS.map((t) => (
            <Chip key={`a-${t.name}`} t={t} />
          ))}
          {TOOLS.map((t) => (
            <Chip key={`b-${t.name}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
