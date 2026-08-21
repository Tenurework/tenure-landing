import Image from "next/image";
import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/cn";

/**
 * THE FORMATS AND CLIENTS TENURE ACTUALLY WORKS WITH, on a continuous rail.
 *
 * EVERY NAME HERE IS IN THE SHIPPED CATALOG. `apps/web/src/lib/integrations/
 * catalog.ts` in the deploying repository declares eighteen providers, and the
 * Slack connector has real install and OAuth callback routes behind it
 * (`api/integrations/slack/install` and `/callback`, 214 lines between them).
 *
 * I had this wrong the first time and the correction is worth recording. The
 * claims register carried a note saying "a repo-wide grep for googleapis,
 * slack.com, api.box.com … returns zero hits", and I trusted the note instead of
 * running the grep. It was stale: the integration layer landed after it was
 * written. A register entry is evidence only as long as someone re-reads the
 * thing it describes.
 *
 * THE MARKS ARE THE REAL BRAND ASSETS, and the previous attempt is worth
 * recording as a mistake. I drew approximations of each logo by hand from
 * memory — the geometry was wrong on most of them, which is obvious the moment
 * you put them beside the real thing. Nobody should be reconstructing a
 * trademark from recollection when every one of these companies publishes a
 * brand kit.
 *
 * These are the published files: Slack, Microsoft 365, Outlook, Excel and Google
 * Drive from Wikimedia Commons, and Box, Dropbox, Zoom, GitHub, Notion, Stripe
 * and Qualtrics generated from the Simple Icons set at each brand's own official
 * hex. DocuSeal ships its own.
 *
 * THEY ARE STORED LOCALLY, in /public/logos/connectors. A logo CDN would put a
 * third-party request on every page load, break when somebody else's host moves,
 * and leak a visitor's page view to it. Downloading once is the only version of
 * this that a security page can stand behind.
 *
 * HARMONISED BY BOX, NOT BY REDRAWING. Their intrinsic aspect ratios vary from
 * 24x24 to 1831x1703, so each sits in a fixed square and scales with
 * `object-contain`. The mark keeps its own proportions and the rail keeps one
 * optical rhythm, which is what a row of foreign lockups needs in order not to
 * read as a link farm.
 *
 * THE ANIMATION IS CSS AND THE TRACK IS DOUBLED. The list is rendered twice and
 * translated by exactly -50%, so the loop closes on itself with no seam and no
 * JavaScript — nothing measures, nothing re-renders, and it costs one compositor
 * layer. The duplicate is `aria-hidden`, or a screen reader would read every
 * format twice.
 */
type Mark = { label: string; file?: string; muted?: boolean };

/*
  The set is the office's own stack. Jira, Asana and Okta came off as developer
  and IT tooling; Eventbrite and Canvas came off from the other direction.
  DocuSeal replaces DocuSign.
*/
const MARKS: Mark[] = [
  { label: "Slack", file: "slack" },
  { label: "Microsoft 365", file: "microsoft365" },
  { label: "Outlook", file: "outlook" },
  { label: "Excel", file: "excel" },
  { label: "Google Drive", file: "googledrive" },
  { label: "Box", file: "box" },
  { label: "Dropbox", file: "dropbox" },
  { label: "Zoom", file: "zoom" },
  { label: "DocuSeal", file: "docuseal" },
  { label: "Notion", file: "notion" },
  { label: "GitHub", file: "github" },
  { label: "Stripe", file: "stripe" },
  { label: "Qualtrics", file: "qualtrics" },
  /*
    The last card is the honest end of the list. A rail that simply loops implies
    the set is closed; saying more are coming is both true and the thing a reader
    with a stack of their own wants to know. It carries no vendor name, so it
    promises a direction rather than an integration nobody has dated.
  */
  { label: "More coming soon", muted: true },
];

function MarkItem({ m, index }: { m: Mark; index: number }) {
  return (
    <li className="flex shrink-0 items-center gap-3.5 px-9">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        {m.file ? (
          <Image
            src={`/logos/connectors/${m.file}.svg`}
            alt=""
            aria-hidden
            width={32}
            height={32}
            className="h-full w-full object-contain"
          />
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7 text-ink-faint">
            <circle
              cx="12"
              cy="12"
              r="8.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="3 3"
            />
            <path
              d="M12 8.4v7.2M8.4 12h7.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-title-sm",
          m.muted ? "text-ink-faint" : "text-ink",
        )}
      >
        {m.label}
      </span>
      {index < MARKS.length - 1 && (
        <span aria-hidden className="ml-9 h-8 w-px bg-line" />
      )}
    </li>
  );
}

export function ConnectorMarquee() {
  return (
    <div className="border-y border-line bg-surface py-10">
      <Container>
        <p className="label-mono text-center text-ink-faint">
          Connects to the systems your office already runs on
        </p>
      </Container>

      <div
        className="marquee-mask relative mt-7 overflow-hidden"
        role="region"
        aria-label="Systems Tenure connects to"
      >
        <div className="marquee-track flex w-max motion-reduce:animate-none">
          <ul className="flex items-center">
            {MARKS.map((m, i) => (
              <MarkItem key={m.label} m={m} index={i} />
            ))}
          </ul>
          {/* The seamless half. Hidden from assistive technology so the list is
              announced once, not twice. */}
          <ul aria-hidden className="flex items-center">
            {MARKS.map((m, i) => (
              <MarkItem key={`${m.label}-dup`} m={m} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
