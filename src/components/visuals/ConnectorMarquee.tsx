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
 * THE MARKS ARE THE VENDORS' OWN, IN THEIR OWN COLOURS. Each is drawn to the
 * published geometry of the brand mark rather than pulled from a logo CDN, so the
 * rail carries no third-party requests and nothing breaks when someone else's
 * asset host moves.
 *
 * Colour is the point of them. A monochrome strip is more restrained and it is
 * also harder to scan: these marks are recognised by hue before they are read,
 * and a reader looking for whether their own stack is covered finds Slack's
 * pinwheel or the Microsoft squares faster than they find the words. Naming and
 * depicting a product to describe interoperability is ordinary nominative use;
 * the rail claims nothing about endorsement and says so nowhere.
 *
 * The lockups sit on one 24px grid at one optical weight, which is what stops a
 * row of eleven foreign palettes reading as a link farm.
 *
 * THE ANIMATION IS CSS AND THE TRACK IS DOUBLED. The list is rendered twice and
 * translated by exactly -50%, so the loop closes on itself with no seam and no
 * JavaScript — nothing measures, nothing re-renders, and it costs one compositor
 * layer. The duplicate is `aria-hidden`, or a screen reader would read every
 * format twice.
 */
type Mark = { label: string; icon: React.ReactNode; muted?: boolean };

/*
  The set is the office's own stack. Jira, Asana and Okta came off as developer
  and IT tooling; Eventbrite and Canvas came off from the other direction.
  DocuSeal replaces DocuSign.
*/
const MARKS: Mark[] = [
  {
    label: "Slack",
    icon: (
      <>
        <path d="M5.04 15.12a2.52 2.52 0 1 1-2.52-2.52h2.52z" fill="#E01E5A" />
        <path d="M6.31 15.12a2.52 2.52 0 0 1 5.04 0v6.31a2.52 2.52 0 0 1-5.04 0z" fill="#E01E5A" />
        <path d="M8.83 5.04a2.52 2.52 0 1 1 2.52-2.52v2.52z" fill="#36C5F0" />
        <path d="M8.83 6.31a2.52 2.52 0 0 1 0 5.04H2.52a2.52 2.52 0 0 1 0-5.04z" fill="#36C5F0" />
        <path d="M18.96 8.83a2.52 2.52 0 1 1 2.52 2.52h-2.52z" fill="#2EB67D" />
        <path d="M17.69 8.83a2.52 2.52 0 0 1-5.04 0V2.52a2.52 2.52 0 0 1 5.04 0z" fill="#2EB67D" />
        <path d="M15.17 18.96a2.52 2.52 0 1 1-2.52 2.52v-2.52z" fill="#ECB22E" />
        <path d="M15.17 17.69a2.52 2.52 0 0 1 0-5.04h6.31a2.52 2.52 0 0 1 0 5.04z" fill="#ECB22E" />
      </>
    ),
  },
  {
    label: "Microsoft 365",
    icon: (
      <>
        <rect x="2.6" y="2.6" width="8.6" height="8.6" fill="#F25022" />
        <rect x="12.8" y="2.6" width="8.6" height="8.6" fill="#7FBA00" />
        <rect x="2.6" y="12.8" width="8.6" height="8.6" fill="#00A4EF" />
        <rect x="12.8" y="12.8" width="8.6" height="8.6" fill="#FFB900" />
      </>
    ),
  },
  {
    label: "Google Workspace",
    icon: (
      <>
        <path d="M21.6 12.23c0-.68-.06-1.34-.18-1.96H12v3.7h5.38a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.88-1.73 2.99-4.29 2.99-7.26z" fill="#4285F4" />
        <path d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.22-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22z" fill="#34A853" />
        <path d="M6.4 13.9a6 6 0 0 1 0-3.83V7.49H3.07a10 10 0 0 0 0 9.02z" fill="#FBBC05" />
        <path d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.85-2.85C16.95 2.98 14.7 2 12 2A10 10 0 0 0 3.07 7.49L6.4 10.07C7.19 7.71 9.4 5.95 12 5.95z" fill="#EA4335" />
      </>
    ),
  },
  {
    label: "Box",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="4.6" fill="#0061D5" />
        <path d="M7.3 9.1a2.9 2.9 0 0 0-2.2 1V6.9a.85.85 0 0 0-1.7 0v5.3a2.95 2.95 0 1 0 3.9-3.1zm-.15 4.5a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zm6.3-4.5a2.95 2.95 0 1 0 0 5.9 2.95 2.95 0 0 0 0-5.9zm0 4.5a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zm7.2-1.55 1.5-1.95a.85.85 0 0 0-1.35-1.03l-1.2 1.58-1.2-1.58a.85.85 0 1 0-1.35 1.03l1.5 1.95-1.5 1.95a.85.85 0 0 0 1.35 1.04l1.2-1.59 1.2 1.59a.85.85 0 0 0 1.35-1.04z" fill="#fff" />
      </>
    ),
  },
  {
    label: "Dropbox",
    icon: (
      <>
        <path d="M7 3 1.8 6.35 7 9.7l5.2-3.35z" fill="#0061FF" />
        <path d="M17 3l-5.2 3.35L17 9.7l5.2-3.35z" fill="#0061FF" />
        <path d="M1.8 13.05 7 9.7l5.2 3.35L7 16.4z" fill="#0061FF" />
        <path d="M22.2 13.05 17 9.7l-5.2 3.35 5.2 3.35z" fill="#0061FF" />
        <path d="M7 17.5 12.2 14.15 17.4 17.5 12.2 20.85z" fill="#0061FF" />
      </>
    ),
  },
  {
    label: "Zoom",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="4.6" fill="#0B5CFF" />
        <path d="M5.8 9.1a1.3 1.3 0 0 1 1.3-1.3h5.5a2.4 2.4 0 0 1 2.4 2.4v4.7a1.3 1.3 0 0 1-1.3 1.3H8.2a2.4 2.4 0 0 1-2.4-2.4z" fill="#fff" />
        <path d="m15.7 11.6 2.9-2.1a.55.55 0 0 1 .88.45v4.1a.55.55 0 0 1-.88.45l-2.9-2.1z" fill="#fff" />
      </>
    ),
  },
  {
    label: "DocuSeal",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="4.6" fill="#1A1A2E" />
        <path d="M7.6 12.4 10.4 15.2 16.6 8.9" fill="none" stroke="#4ADE80" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "GitHub",
    icon: (
      <path
        d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.8c-2.7.6-3.3-1.2-3.3-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.3.3.7 1 .7 2v2.9c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z"
        fill="#181717"
      />
    ),
  },
  {
    label: "Notion",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="4.2" fill="#fff" stroke="#E5E5E5" strokeWidth="1" />
        <path d="M8.4 16.6V7.9l7 8.4V7.9" fill="none" stroke="#111" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "Stripe",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="4.6" fill="#635BFF" />
        <path d="M11.6 10.2c0-.5.42-.72 1.06-.72a6.9 6.9 0 0 1 3.06.83V7.42a8.1 8.1 0 0 0-3.06-.57c-2.5 0-4.17 1.32-4.17 3.5 0 3.42 4.66 2.87 4.66 4.34 0 .58-.5.77-1.2.77a7.7 7.7 0 0 1-3.36-.99v2.94a8.5 8.5 0 0 0 3.36.71c2.57 0 4.32-1.27 4.32-3.49 0-3.7-4.67-3.04-4.67-4.43z" fill="#fff" />
      </>
    ),
  },
  {
    label: "Qualtrics",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="#00B4EF" strokeWidth="2.4" />
        <path d="M13.6 13.8 19.4 19.6" fill="none" stroke="#00B4EF" strokeWidth="2.6" strokeLinecap="round" />
      </>
    ),
  },
  /*
    The last card is the honest end of the list. A rail that simply loops implies
    the set is closed; saying more are coming is both true and the thing a reader
    with a stack of their own wants to know. It carries no vendor name, so it
    promises a direction rather than an integration nobody has dated.
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
        className={cn("h-7 w-7 shrink-0", m.muted && "text-ink-faint")}
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
