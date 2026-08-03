import { cn } from "@/lib/cn";

/**
 * Formats, not vendor marks.
 *
 * C-029 in the claims register is explicit: no vendor logo may appear unless
 * connector code and an end-to-end test exist, and importing a file a vendor
 * produced is not an integration. There is no Microsoft or Google connector in
 * the deploying repo — spreadsheets are parsed from bytes with JSZip, documents
 * with mammoth, and the calendar is a signed one-way ICS feed that requires no
 * vendor code at all. A vendor mark is the strongest connector signal on a page
 * regardless of how honest the sentence underneath it is, so the marks are gone
 * and the file formats say the same true thing.
 *
 * The vendor NAMES stay in the titles: "you can subscribe from Outlook" is
 * accurate and useful, and the body says plainly that no account is connected.
 */
type Lane = { title: string; tag: string; body: string; formats: string[] };

const LANES: Lane[] = [
  {
    title: "Excel, Word, PowerPoint, PDF",
    tag: "Open in Tenure",
    body: "Contracts, decks, and spreadsheets open in the app, PowerPoint with its speaker notes. Spreadsheets and text files edit in place, with a save-conflict check.",
    formats: [".xlsx", ".docx", ".pptx", ".pdf"],
  },
  {
    title: "Outlook, Google, Apple Calendar",
    tag: "Subscribe, one link",
    body: "One signed link, no account connection and no password shared. It carries only what your seat may see. One-way today, Tenure fills your calendar and does not read it back.",
    formats: ["iCalendar (.ics)"],
  },
  {
    title: "Your existing budget spreadsheet",
    tag: "Imported, columns matched",
    body: "Upload it as you keep it. Tenure works out which column is which, drops subtotal rows so nothing double-counts, and shows what it read before anything is saved.",
    formats: [".xlsx", ".csv"],
  },
];

export function ToolLogos({ className }: { className?: string }) {
  return (
    <div className={cn("grid w-full gap-3 sm:grid-cols-3", className)}>
      {LANES.map((l) => (
        <div
          key={l.title}
          className="lift flex h-full flex-col rounded-xl border border-line bg-cloud p-4 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
        >
          <div className="flex flex-wrap items-center gap-2">
            {l.formats.map((f) => (
              <span
                key={`${l.title}-${f}`}
                className="inline-flex items-center rounded-lg border border-line bg-paper/60 px-2.5 py-1.5"
              >
                <span className="whitespace-nowrap font-mono text-[0.78rem] font-medium text-ink-soft">
                  {f}
                </span>
              </span>
            ))}
          </div>
          <span className="label-mono mt-4 block">{l.tag}</span>
          <h3 className="mt-1.5 text-[0.98rem] font-medium leading-snug text-ink">{l.title}</h3>
          <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-soft">{l.body}</p>
        </div>
      ))}
    </div>
  );
}
