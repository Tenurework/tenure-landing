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
 * THE RULE THIS IS BUILT AROUND. C-029: no vendor logo may appear unless
 * connector code and an end-to-end test exist, and importing a file a vendor
 * produced is not an integration. A repo-wide grep for googleapis, slack.com,
 * api.notion, api.dropbox, discord.com, zoom.us, api.box.com, graph.microsoft
 * and oauth2 returns ZERO hits. So there are no vendor MARKS here — only vendor
 * NAMES, each inside a row whose badge and body say what the relationship is.
 * `claims.spec.ts` enforces that, and it excuses a name by LINE PROXIMITY, which
 * is why the unsupported vendors are named in the sentence that denies them
 * rather than as a row of chips: eight chips are eight lines, the badge falls out
 * of range by the third name, and a chip row reads as a logo wall regardless.
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
    blurb:
      "The files you already keep, opened and edited in place — no migration, no accounts to connect.",
    rows: [
      {
        what: "Documents",
        via: [".pdf", ".docx", ".pptx"],
        status: "live",
        body: "Contracts, letters and decks open inside Tenure rather than downloading to somebody's laptop — PowerPoint with its speaker notes intact.",
      },
      {
        what: "Spreadsheets",
        via: [".xlsx", ".csv"],
        status: "ci",
        body: "They open and edit in place, with a save-conflict check that warns if someone else saved first. A budget spreadsheet also imports: Tenure works out which column is which however your treasurer named them, drops subtotal rows so nothing double-counts, and shows you what it read before anything is saved.",
      },
      {
        what: "Plain text and data files",
        via: [".txt", ".md", ".json", ".xml"],
        status: "live",
        body: "Edit in place like the spreadsheets. These are also the only file types the assistant will summarise on request, and only under 200KB.",
        limit:
          "AI summarisation is gated to text, JSON, CSV and XML. It does not summarise PDF or Office files, and file contents are never indexed for search — only titles and descriptions are.",
      },
    ],
  },
  {
    key: "out",
    title: "What goes out",
    blurb:
      "The three things Tenure sends outward, and the one it cannot yet do for you on demand.",
    rows: [
      {
        what: "Calendar subscription",
        via: ["Outlook", "Google Calendar", "Apple Calendar"],
        status: "ci",
        body: "One signed link per person, pasted into whichever calendar they already open. No account is connected and no password is shared, and the feed carries only what that seat is already allowed to see.",
        limit:
          "One-way. Tenure fills your calendar and never reads it back, so an event you create in Outlook does not appear in Tenure.",
      },
      {
        what: "Deadline reminders",
        via: ["in-app"],
        status: "live",
        body: "A deadline the overseeing body publishes once reaches every organization, and reminders fire from scheduled infrastructure without anyone opening the app — once per person, not once per visit.",
        limit:
          "Delivery is in-app only. Every delivery record hardcodes the in-app channel and no application code sends mail or push notifications, so nobody is emailed about anything.",
      },
      {
        what: "Bulk export of your record",
        via: ["on request"],
        status: "roadmap",
        body: "There is no self-service export path in the application today. Export and deletion requests are handled by us, by hand, when you ask.",
        limit:
          "That is a dependency on two people being reachable, and it matters most in exactly the scenario where you would least want it. Worth writing into an agreement rather than assuming.",
      },
    ],
  },
  {
    key: "no",
    title: "What does not exist",
    blurb:
      "Named here rather than discovered in week three. If your integration plan depends on any of it, it is not met today.",
    rows: [
      {
        what: "Third-party connectors",
        // The vendor names are in the SENTENCE, not in a chip row — see the note
        // at the top of this file. `claims.spec.ts` was right to fail the chip
        // version twice over: mechanically the badge fell out of the matcher's
        // window by the third name, and substantively eight vendor chips ARE a
        // logo wall, which is the shape C-029 exists to prevent.
        via: ["none"],
        status: "unsupported",
        body: "Tenure does not connect to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord. There is no integration framework, no OAuth client and no vendor SDK anywhere in the product — files, decisions and documents live in Tenure itself. We would rather list them here than let you find out in week three.",
      },
      {
        what: "Public API and webhooks",
        via: ["REST", "webhooks"],
        status: "unsupported",
        body: "There is no public API to build against and nothing Tenure will call when something changes.",
      },
      {
        what: "Institutional single sign-on",
        via: ["SAML", "OIDC"],
        status: "roadmap",
        body: "Not deployed. It is the gating item for taking Tenure past a pilot, and if it is a procurement precondition then that precondition is not met.",
        limit:
          "There is also no multi-factor authentication in any form today. Accounts are created by us in advance against a named person; the full access model, and its weaknesses, are set out on Security.",
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
  const roadmap = n("roadmap");
  const missing = n("unsupported");

  const out: { label: string; tone?: "quiet" | "good" | "warn" | "bad" }[] = [];
  if (shipped) out.push({ label: `${shipped} live`, tone: "good" });
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
                      <h3 className="font-display text-[1rem] font-semibold tracking-tight text-ink">
                        {r.what}
                      </h3>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.via.map((v) => (
                        <span
                          key={`${r.what}-${v}`}
                          className="rounded-md border border-line bg-paper/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-ink-soft"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[0.94rem] leading-relaxed text-ink-soft">{r.body}</p>
                    {r.limit && (
                      <p className="mt-2.5 border-l-2 border-border-strong pl-3.5 text-[0.87rem] leading-relaxed text-ink-faint">
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
          The status words above mean exactly what they mean on{" "}
          <Link
            href="/trust"
            className="font-medium text-accent-text underline underline-offset-4"
          >
            Security
          </Link>
          , where each is defined and every control is listed with its evidence. No
          vendor logo appears anywhere on this site, because a logo reads as a
          connector whatever the sentence under it says &mdash; and there is no
          connector code to back one.
        </PanelNote>
      }
    />
  );
}
