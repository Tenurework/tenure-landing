/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/cn";

type Mark = { src: string; name: string };
type Lane = { title: string; tag: string; body: string; marks: Mark[] };

const LANES: Lane[] = [
  {
    title: "Excel, Word, PowerPoint, PDF",
    tag: "Open in Tenure",
    body: "Contracts, decks, and spreadsheets open in the app, PowerPoint with its speaker notes. Spreadsheets and text files edit in place, versioned.",
    marks: [{ src: "/logos/tools/excel.svg", name: "Excel" }],
  },
  {
    title: "Outlook, Google, Apple Calendar",
    tag: "Subscribe, one link",
    body: "One signed link, no account connection and no password shared. It carries only what your seat may see. One-way today, Tenure fills your calendar and does not read it back.",
    marks: [
      { src: "/logos/tools/outlook.svg", name: "Outlook" },
      { src: "/logos/tools/google-calendar.svg", name: "Google Calendar" },
    ],
  },
  {
    title: "Your existing budget spreadsheet",
    tag: "Imported, columns matched",
    body: "Upload it as you keep it. Tenure works out which column is which, drops subtotal rows so nothing double-counts, and shows what it read before anything is saved.",
    marks: [{ src: "/logos/tools/excel.svg", name: "Excel" }],
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
            {l.marks.map((m) => (
              <span
                key={`${l.title}-${m.name}`}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-paper/60 px-2.5 py-1.5"
              >
                <img
                  src={m.src}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] object-contain"
                  loading="lazy"
                />
                <span className="whitespace-nowrap text-[0.78rem] font-medium text-ink-soft">
                  {m.name}
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
