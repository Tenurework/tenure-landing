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
 * THE MARKS ARE DRAWN, MONOCHROME, ON ONE GRID. Each is a simplified rendering
 * of the vendor's own glyph rather than a copy of their brand asset: recognisable
 * at 24px, one weight, one colour, taking the page's ink like everything else.
 *
 * Full-colour vendor lockups were the alternative and they are the wrong call
 * here. Eleven foreign logos at eleven different weights and eleven different
 * palettes turn a restrained page into a link farm, and they read as partnership
 * badges rather than as a capability list. Monochrome says the same thing without
 * borrowing anyone's brand.
 *
 * THE ANIMATION IS CSS AND THE TRACK IS DOUBLED. The list is rendered twice and
 * translated by exactly -50%, so the loop closes on itself with no seam and no
 * JavaScript — nothing measures, nothing re-renders, and it costs one compositor
 * layer. The duplicate is `aria-hidden`, or a screen reader would read every
 * format twice.
 */
type Mark = { label: string; icon: React.ReactNode; muted?: boolean };

/*
  The set is the office's own stack. Jira, Asana and Okta came off because they
  are developer and IT tooling rather than anything a student-organization office
  touches; Eventbrite and Canvas came off for the same reason from the other
  direction. DocuSeal replaces DocuSign.
*/
const MARKS: Mark[] = [
  {
    label: "Slack",
    icon: (
      <>
        <rect x="3" y="9.6" width="4.4" height="2.6" rx="1.3" />
        <rect x="9.6" y="3" width="2.6" height="4.4" rx="1.3" />
        <rect x="16.6" y="11.8" width="4.4" height="2.6" rx="1.3" />
        <rect x="11.8" y="16.6" width="2.6" height="4.4" rx="1.3" />
        <rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1.6" />
      </>
    ),
  },
  {
    label: "Microsoft 365",
    icon: (
      <>
        <rect x="3" y="3" width="8.2" height="8.2" />
        <rect x="12.8" y="3" width="8.2" height="8.2" />
        <rect x="3" y="12.8" width="8.2" height="8.2" />
        <rect x="12.8" y="12.8" width="8.2" height="8.2" />
      </>
    ),
  },
  {
    label: "Google Workspace",
    icon: (
      <path d="M21 12.2a9 9 0 1 1-2.7-6.4l-3 3A4.8 4.8 0 1 0 16.8 14H12v-3.6h9z" />
    ),
  },
  {
    label: "Box",
    icon: (
      <>
        <path d="M12 2.6 21.4 7v10L12 21.4 2.6 17V7z" />
        <path d="M2.6 7 12 11.4 21.4 7M12 11.4v10" fill="none" stroke="var(--surface)" strokeWidth="1.4" />
      </>
    ),
  },
  {
    label: "Dropbox",
    icon: (
      <>
        <path d="M7 3 1.8 6.6 7 10.2l5.2-3.6z" />
        <path d="M17 3l-5.2 3.6L17 10.2l5.2-3.6z" />
        <path d="M1.8 13.8 7 10.2l5.2 3.6L7 17.4z" />
        <path d="M22.2 13.8 17 10.2l-5.2 3.6L17 17.4z" />
        <path d="M7 18.6 12 15.4l5 3.2L12 21.8z" />
      </>
    ),
  },
  {
    label: "Zoom",
    icon: (
      <>
        <rect x="2.4" y="6.4" width="12.8" height="11.2" rx="3" />
        <path d="M15.2 11.2 21.6 7.4v9.2l-6.4-3.8z" />
      </>
    ),
  },
  {
    label: "DocuSeal",
    icon: (
      <>
        <path d="M13.4 2.6H7A2.4 2.4 0 0 0 4.6 5v14A2.4 2.4 0 0 0 7 21.4h10a2.4 2.4 0 0 0 2.4-2.4V8.6z" />
        <path d="M13.4 2.6v6h6" fill="none" stroke="var(--surface)" strokeWidth="1.4" />
        <path d="m8.8 14.6 2.4 2.4 4.2-4.6" fill="none" stroke="var(--surface)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "GitHub",
    icon: (
      <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.8c-2.7.6-3.3-1.2-3.3-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.3.3.7 1 .7 2v2.9c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z" />
    ),
  },
  {
    label: "Notion",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3.4" />
        <path d="M8.6 16.4V7.6l6.8 8.2V7.6" fill="none" stroke="var(--surface)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "Stripe",
    icon: (
      <path d="M11.4 9.7c0-.7.6-1 1.5-1a9.9 9.9 0 0 1 4.4 1.2V6a11.6 11.6 0 0 0-4.4-.8c-3.6 0-6 1.9-6 5 0 4.9 6.7 4.1 6.7 6.2 0 .8-.7 1.1-1.7 1.1a11 11 0 0 1-4.8-1.4v4.1a12.2 12.2 0 0 0 4.8 1c3.7 0 6.2-1.8 6.2-5 0-5.3-6.7-4.3-6.7-6.5z" />
    ),
  },
  {
    label: "Qualtrics",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M13.4 13.6 19 19.2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  },
  /*
    The last card is the honest end of the list. A rail that simply loops implies
    the set is closed; saying more are coming is both true and the thing a reader
    with a stack of their own actually wants to know. It carries no vendor name,
    so it promises a direction rather than a specific integration nobody has
    committed to a date for.
  */
  {
    label: "More coming soon",
    muted: true,
    icon: (
      <>
        <circle cx="12" cy="12" r="8.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M12 8.4v7.2M8.4 12h7.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
];

function MarkItem({ m, index }: { m: Mark; index: number }) {
  return (
    <li className="flex shrink-0 items-center gap-3.5 px-9">
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("h-7 w-7 shrink-0", m.muted ? "text-ink-faint" : "text-ink-soft")}
        fill="currentColor"
      >
        {m.icon}
      </svg>
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
