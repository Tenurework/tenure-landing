import { Container } from "@/components/ui/layout";

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
 * The marks are set in the site's own type rather than reproduced from each
 * vendor's brand assets. A page that reproduces trademarked lockups implies a
 * relationship none of these vendors has agreed to, and eighteen foreign logos at
 * eighteen different weights and colours is the fastest way to make a clean page
 * look like a link farm. One grid, one weight, one colour: it reads as a
 * capability strip, which is what it is.
 *
 * THE ANIMATION IS CSS AND THE TRACK IS DOUBLED. The list is rendered twice and
 * translated by exactly -50%, so the loop closes on itself with no seam and no
 * JavaScript — nothing measures, nothing re-renders, and it costs one compositor
 * layer. The duplicate is `aria-hidden`, or a screen reader would read every
 * format twice.
 */
const MARKS: { label: string; sub: string }[] = [
  { label: "Slack", sub: "collaboration" },
  { label: "Microsoft 365", sub: "Outlook, Excel, Teams" },
  { label: "Google Workspace", sub: "Drive, Calendar" },
  { label: "Box", sub: "content" },
  { label: "Dropbox", sub: "content" },
  { label: "Zoom", sub: "meetings" },
  { label: "Canvas LMS", sub: "Instructure" },
  { label: "DocuSign", sub: "eSignature" },
  { label: "Asana", sub: "work" },
  { label: "Jira", sub: "Atlassian" },
  { label: "GitHub", sub: "repositories" },
  { label: "Eventbrite", sub: "ticketing" },
  { label: "Qualtrics", sub: "surveys" },
  { label: "Okta", sub: "identity" },
  { label: "Stripe", sub: "payments" },
  { label: "Notion", sub: "docs" },
];

function Mark({ m, index }: { m: (typeof MARKS)[number]; index: number }) {
  return (
    <li className="flex shrink-0 items-center gap-3 px-8">
      <span className="whitespace-nowrap">
        <span className="block text-title-sm text-ink">{m.label}</span>
        <span className="block text-mark text-ink-faint">{m.sub}</span>
      </span>
      {index < MARKS.length - 1 && (
        <span aria-hidden className="ml-8 h-9 w-px bg-line" />
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
              <Mark key={m.label} m={m} index={i} />
            ))}
          </ul>
          {/* The seamless half. Hidden from assistive technology so the list is
              announced once, not twice. */}
          <ul aria-hidden className="flex items-center">
            {MARKS.map((m, i) => (
              <Mark key={`${m.label}-dup`} m={m} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
