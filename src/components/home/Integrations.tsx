import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Formats, not vendor marks — see the note in visuals/ToolLogos.tsx, which is the
 * /product twin of this section and was changed with it.
 *
 * C-029 forbids a vendor logo without connector code and an end-to-end test, and
 * the deploying repo has neither: spreadsheets are parsed from bytes, and the
 * calendar is a signed one-way ICS feed no vendor participates in. The heading
 * over these three cards is "Fits your stack", which is exactly the context in
 * which an Excel mark reads as a Microsoft integration.
 */
type Lane = { title: string; tag: string; body: string; proof: string; formats: string[] };

const LANES: Lane[] = [
  {
    title: "Excel, Word, PowerPoint, PDF",
    tag: "Open in Tenure",
    body: "Contracts, decks and spreadsheets open in the app, PowerPoint with its speaker notes. Spreadsheets and text files edit in place.",
    proof: "warns if someone else saved first",
    formats: [".xlsx", ".docx", ".pptx", ".pdf"],
  },
  {
    title: "Outlook, Google, Apple Calendar",
    tag: "Subscribe, one link",
    body: "One link, signed to you, carrying only what your seat may see. One-way today: Tenure fills your calendar and never reads it back.",
    proof: "signed per-seat feed",
    formats: ["iCalendar (.ics)"],
  },
  {
    title: "Your existing budget spreadsheet",
    tag: "Imported, columns matched",
    body: "Upload the budget you already keep. Tenure matches your columns whatever you named them, and drops subtotal rows so nothing double-counts.",
    proof: "preview before anything saves",
    formats: [".xlsx", ".csv"],
  },
];

function Chip({ t }: { t: string }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-line bg-paper/60 px-2.5 py-1.5">
      <span className="whitespace-nowrap font-mono text-[0.78rem] font-medium text-ink-soft">{t}</span>
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
              Bring what you already have. Keep{" "}
              <span className="text-gradient">the calendar you already open</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Nothing to migrate, and no accounts to connect &mdash; Tenure reads the
              formats you already use.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANES.map((l, i) => (
            <Reveal as="div" key={l.title} delay={0.05 * i}>
              <div className="lift flex h-full flex-col rounded-2xl border border-line bg-cloud p-6 shadow-[var(--shadow-sm)] hover:-translate-y-1 hover:border-grove/25 hover:shadow-[var(--shadow-lg)]">
                <div className="flex flex-wrap items-center gap-2">
                  {l.formats.map((f) => (
                    <Chip key={`${l.title}-${f}`} t={f} />
                  ))}
                </div>
                <span className="label-mono mt-5 block">{l.tag}</span>
                <h3 className="mt-2 font-display text-[1.12rem] font-semibold leading-snug text-ink">
                  {l.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{l.body}</p>
                <p className="mt-auto pt-5 font-mono text-[0.62rem] text-ink-faint">{l.proof}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
