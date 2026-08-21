import type { ReactNode } from "react";
import Link from "next/link";
import { Dossier, type DossierItem } from "@/components/ui/Dossier";
import { PanelNote } from "@/components/ui/Panel";
import { StatusBadge, type StatusKey } from "@/components/ui/StatusBadge";

/**
 * THE CONNECTOR MATRIX — the honest answer to "does it work with our stack?".
 *
 * WHAT THIS REPLACED, AND WHY IT WAS BROKEN.
 *
 * There were two components saying nearly the same thing on two routes:
 * `home/Integrations.tsx` and `visuals/ToolLogos.tsx`. Both rendered three lanes,
 * both led with "Excel, Word, PowerPoint, PDF", and both then added a third lane
 * called "Your existing budget spreadsheet" — so `.xlsx` was listed twice inside
 * each component, and the whole three-lane block appeared twice across the site.
 *
 * It also answered a question nobody asked. Three file formats is not what a
 * buyer means by "does it integrate": they mean Slack, Drive, Teams, a public
 * API. The old sections dodged that by never naming any of them, which reads as
 * evasion — and the answer was already written, in full, in a "Not supported"
 * row on /trust, three routes from where the question gets asked.
 *
 * WHY IT IS NOW A DOSSIER RATHER THAN A FILTERED TABLE.
 *
 * The first version of this was one flat list of nine rows behind a tab filter
 * that defaulted to "Everything". That made it 1,698px — a quarter of /product,
 * and the single tallest section on the site — showing nine rows at once. Which
 * is precisely the pattern this whole pass exists to remove: it was the nine-card
 * platform grid again, wearing a table.
 *
 * Three collapsed groups instead, on the same `Dossier` the reference pages use.
 * The tallies on each summary row mean the SHAPE of the answer — what is live,
 * what is roadmap, what does not exist at all — is readable without opening
 * anything, which is what a buyer skimming for a dealbreaker actually wants.
 *
 * It is also a server component now. The tab filter needed client state; native
 * `<details>` needs none, so this section ships no JavaScript at all.
 *
 * WHAT CHANGED ON 2026-08-19, AND WHY THE VENDORS ARE VISIBLE NOW.
 *
 * This file used to answer the connector question with one denial: "Tenure does
 * not connect to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or
 * Discord." That was true when it was written, and the register's evidence for
 * it was a repo-wide grep returning zero hits.
 *
 * Re-run against the pinned commit, that same grep returns five files for `slack.com`.
 * The deploying repo now ships a Slack workspace connector — OAuth install,
 * channel routing, a posting quota, a unit test file per module and two API routes — and
 * an 18-product integration catalog whose availability is computed from whether
 * each product's credentials are present. A page still saying "no connectors"
 * understates the product to exactly the buyer who asked.
 *
 * So C-029 was split into three rows and this component follows them:
 *
 *   C-029a  Slack — BUILT, NOT REACHABLE. The code and its routes exist; nothing
 *           in the application calls the announce seam, so no user can switch it
 *           on. It is not "available", and it is not "no".
 *   C-029b  the other seventeen — a catalog descriptor and a list of required
 *           secret NAMES. A catalog entry is not a connector.
 *   C-029c  everything else — two-way sync, a public API, webhooks, Discord.
 *
 * STILL TRUE, AND STILL ENFORCED: no vendor MARK or LOGO appears here, only
 * vendor NAMES, because a logo reads as a connector whatever the sentence under
 * it says. `claims.spec.ts` excuses a vendor name by LINE PROXIMITY to its
 * status, so every name sits in a row whose badge and `limit` state what the
 * relationship actually is — which is also why the names are grouped four to a
 * row rather than listed as eighteen chips: a chip row reads as a logo wall, and
 * the badge falls out of the ratchet's window by the third name.
 *
 * `.xlsx` appears in exactly one row. Opening a spreadsheet in place and
 * importing a budget out of one are two capabilities of the same format, so they
 * are one row with two sentences rather than two rows with one format.
 */

type Row = {
  what: string;
  /** Formats or vendor names, whichever is the honest label. */
  via: string[];
  status: StatusKey;
  body: ReactNode;
  limit?: string;
};

type Group = {
  key: string;
  title: string;
  blurb: string;
  rows: Row[];
};

const GROUPS: Group[] = [
  {
    key: "in",
    title: "What comes in",
    blurb: "The files you already keep, opened and edited in place. Nothing to migrate.",
    rows: [
      {
        what: "Documents",
        via: [".pdf", ".docx", ".pptx"],
        status: "live",
        body: "Open them inside Tenure instead of downloading them to somebody’s laptop. Speaker notes come through with the deck.",
      },
      {
        what: "Spreadsheets",
        via: [".xlsx", ".csv"],
        status: "ci",
        body: "Edit in place, with a warning if someone else saved first. The budget you already keep imports as it is: Tenure works out which column is which whatever you named them, and shows you what it read before anything saves.",
      },
      {
        what: "Text and data files",
        via: [".txt", ".md", ".json", ".xml"],
        status: "live",
        body: "Edit in place like the spreadsheets. These four are also the only files the assistant will summarize — not PDF, not Office.",
      },
    ],
  },
  {
    key: "out",
    title: "What goes out",
    blurb: "Three things Tenure sends outward, and the one it cannot yet do on demand.",
    rows: [
      {
        what: "Your calendar",
        via: ["Outlook", "Google Calendar", "Apple Calendar"],
        status: "ci",
        body: "One signed link per person, pasted into whichever calendar they already open — no account connected, no password shared. One-way: Tenure fills your calendar and never reads it back.",
      },
      {
        what: "Deadline reminders",
        via: ["in-app"],
        status: "live",
        body: "Publish a deadline once and every organization sees it, with each person reminded once. In-app only — nobody is emailed.",
      },
      {
        what: "Your record, on request",
        via: ["by hand"],
        status: "roadmap",
        body: "Ask and we export or delete it. There is no button for it yet, which makes it a dependency on two people being reachable.",
      },
    ],
  },
  {
    key: "slack",
    title: "Built, not yet in the product",
    blurb: "One connector exists in code and is tested. No console switch turns it on yet.",
    rows: [
      {
        what: "Slack workspace",
        via: ["OAuth install", "channel routing", "outbound posts"],
        status: "validating",
        body: "A workspace connector is written and unit-tested in the repository that deploys: a signed install handshake, an OAuth exchange, routing that decides which channel an announcement belongs in, a per-event posting cap, and an audit row for every post that goes out. We would rather tell you it exists than let you find it in a changelog.",
        limit:
          // C-029a's exact words. "Built, not reachable" and "not yet in the
          // product" are also what excuse the vendor name to the claims ratchet.
          "It is built, not reachable: nothing in the application calls it, so there is no console switch and nobody can turn it on today. Treat it as not yet in the product when you plan. It is also outbound only — Tenure posts to a channel and never reads one back.",
      },
    ],
  },
  {
    key: "catalog",
    title: "Declared in the catalog, awaiting credentials",
    blurb: "Seventeen further products the platform knows about — and what that does and does not mean.",
    rows: [
      {
        what: "Files and content",
        via: ["Box", "Dropbox", "Google Workspace", "Notion"],
        status: "roadmap",
        body: "Each is a catalog entry naming the capability it would serve and the credentials it would need. Availability is computed from whether those credentials are present rather than stored in a flag somebody has to remember to flip.",
        limit:
          "A catalog entry is not a connector. For every product on this page except Slack there is no connector code at all, so the credentials are necessary and nowhere near sufficient. None of these can move a file today.",
      },
      {
        what: "Chat, mail and meetings",
        via: ["Teams", "Outlook Mail", "Outlook Calendar", "Zoom"],
        status: "roadmap",
        body: "Declared against the chat, email, calendar and video capabilities. The Microsoft products share one credential set, so they arrive together or not at all.",
        limit:
          "Catalog entry only — awaiting credentials, with no connector code behind any of them. Tenure's calendar output today is the signed subscription link above, which is a different mechanism and already works.",
      },
      {
        what: "Work, code and signature",
        via: ["Asana", "Jira", "GitHub", "DocuSign"],
        status: "roadmap",
        body: "Declared against the task, repository and signature-request capabilities.",
        limit: "Catalog entry only — awaiting credentials, no connector code.",
      },
      {
        what: "Payments, identity, surveys, learning and ticketing",
        via: ["Stripe", "Okta", "Qualtrics", "Canvas", "Eventbrite"],
        status: "roadmap",
        body: "The remaining five capabilities the catalog covers: collecting payment, reading a directory, running a survey, an LMS, and selling a ticket.",
        limit:
          "Catalog entry only — awaiting credentials, no connector code. Okta in particular is declared here and is not deployed; institutional single sign-on remains the row below.",
      },
    ],
  },
  {
    key: "no",
    title: "What does not exist",
    blurb: "Named here, so nothing on this list is a surprise later.",
    rows: [
      {
        what: "Two-way sync, and anything outside the catalog",
        via: ["Discord", "two-way"],
        status: "unsupported",
        body: "Nothing on this page reads a third-party system back into Tenure — every path described above is one-way, outbound. Discord is in neither the catalog nor the code, and a product that is in neither does not connect.",
      },
      {
        what: "Public API and webhooks",
        via: ["REST", "webhooks"],
        status: "unsupported",
        body: "Nothing to build against, and nothing Tenure will call when something changes.",
      },
      {
        /*
          "single sign-on" belongs in the TITLE, next to the badge.

          The rewrite moved it into the body and the claims ratchet failed —
          correctly. C-023's rule is that the phrase may not appear without
          "roadmap"/"not deployed"/"planned" close to it, and the matcher excuses
          it by LINE PROXIMITY to a status badge. In the title the ROADMAP badge
          renders on the very next line; in the body it was five lines below the
          badge, past the window, so the page was asserting SSO with no
          qualification anywhere near it. The body no longer repeats the phrase.
        */
        what: "Institutional single sign-on",
        via: ["SAML", "OIDC", "MFA"],
        status: "roadmap",
        body: "Not deployed, in any form — multi-factor authentication included. If it is a procurement precondition, that precondition is not met today.",
      },
    ],
  },
];

/**
 * The tally shown on a collapsed summary row.
 *
 * Derived from the rows rather than typed beside them, so it cannot drift. It is
 * the whole reason the groups can stay closed: a buyer skimming for a dealbreaker
 * reads "2 not supported · 1 roadmap" without opening anything.
 */
function tallyFor(group: Group) {
  const n = (...keys: StatusKey[]) => group.rows.filter((r) => keys.includes(r.status)).length;
  const shipped = n("live", "ci");
  // "Built, not in the product" is its own answer and must not be tallied as
  // either shipped or roadmap — collapsing it into one of those is precisely the
  // overstatement (or understatement) C-029a exists to prevent.
  const built = n("validating");
  const roadmap = n("roadmap");
  const missing = n("unsupported");

  const out: { label: string; tone?: "quiet" | "good" | "warn" | "bad" }[] = [];
  if (shipped) out.push({ label: `${shipped} live`, tone: "good" });
  if (built) out.push({ label: `${built} built, not in the product`, tone: "quiet" });
  if (roadmap) out.push({ label: `${roadmap} roadmap`, tone: "warn" });
  if (missing) out.push({ label: `${missing} not supported`, tone: "bad" });
  return out;
}

export function ConnectorMatrix() {
  return (
    <Dossier
      name="connectors"
      title="What Tenure connects to"
      meta={`${GROUPS.reduce((n, g) => n + g.rows.length, 0)} rows, including the ones that say no`}
      items={GROUPS.map(
        (group): DossierItem => ({
          key: group.key,
          title: group.title,
          blurb: group.blurb,
          tally: tallyFor(group),
          children: (
            <ul className="space-y-6">
              {group.rows.map((r) => (
                <li key={r.what} className="grid gap-2 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-8">
                  <div>
                    {/* The badge renders immediately after the name, which is also
                        what keeps a vendor name legal: the ratchet excuses one only
                        when a "Not supported"/"Roadmap" marker — or an explicit
                        "does not connect" sentence — sits within a couple of lines. */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-body tracking-tight text-ink">
                        {r.what}
                      </h3>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.via.map((v) => (
                        <span
                          key={`${r.what}-${v}`}
                          className="rounded-md border border-line bg-paper/60 px-1.5 py-0.5 font-mono text-mark text-ink-soft"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-body leading-relaxed text-ink-soft measure">{r.body}</p>
                    {r.limit && (
                      <p className="mt-2.5 border-l-2 border-border-strong pl-3.5 text-body-sm leading-relaxed text-ink-faint measure">
                        <span className="font-medium text-ink-soft">Limit: </span>
                        {r.limit}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ),
        }),
      )}
      footer={
        <PanelNote>
          These are the short answers.{" "}
          <Link
            href="/trust"
            className="font-medium text-accent-text underline underline-offset-4"
          >
            Security
          </Link>{" "}
          covers the same ground as a reviewed control list &mdash; every status word
          defined, and the limit and evidence behind each row. No vendor logo appears
          anywhere on this site, including next to the one connector that is built: a
          logo reads as a working integration whatever the sentence under it says, and
          only a name can carry a status word beside it.
        </PanelNote>
      }
    />
  );
}
