"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Panel, PanelBar, PanelNote } from "@/components/ui/Panel";
import { Segmented, type SegmentItem } from "@/components/ui/Segmented";
import { StatusBadge, type StatusKey } from "@/components/ui/StatusBadge";

/**
 * THE CONNECTOR MATRIX — the honest answer to "does it work with our stack?".
 *
 * WHAT THIS REPLACES, AND WHY IT WAS BROKEN.
 *
 * There were two components saying nearly the same thing on two routes:
 * `home/Integrations.tsx` and `visuals/ToolLogos.tsx`. Both rendered three lanes,
 * both led with "Excel, Word, PowerPoint, PDF", and both then added a third lane
 * called "Your existing budget spreadsheet" — so `.xlsx` was listed twice inside
 * each component, and the whole three-lane block was listed twice across the site.
 * Four copies of the same paragraph, two of them on the same page as each other's
 * page.
 *
 * It also answered a question nobody asked. Three file formats is not what a buyer
 * means by "does it integrate": they mean Slack, Drive, Teams, a public API. The
 * old sections dodged that by never naming any of them, which reads as evasion —
 * and the answer was already written, in full, in a "Not supported" row on
 * /trust, three routes away from where it gets asked.
 *
 * So: one component, one route (/product), and it names all of them. Every row
 * carries the same status vocabulary /trust uses, including the rows that say no.
 *
 * THE RULE THIS IS BUILT AROUND. C-029: no vendor logo may appear unless
 * connector code and an end-to-end test exist, and importing a file a vendor
 * produced is not an integration. A repo-wide grep for googleapis, slack.com,
 * api.notion, api.dropbox, discord.com, zoom.us, api.box.com, graph.microsoft and
 * oauth2 returns ZERO hits. So there are no vendor MARKS anywhere in here — only
 * vendor NAMES, each one inside a row whose badge and body say plainly what the
 * relationship is. `claims.spec.ts` enforces exactly that: a vendor name is
 * allowed only where a "Not supported"/"Roadmap" badge or an explicit "does not
 * connect" sentence sits beside it.
 *
 * `.xlsx` now appears in exactly one row. Opening a spreadsheet in place and
 * importing a budget out of one are two capabilities of the same format, so they
 * are one row with two sentences rather than two rows with one format.
 */

type Group = "in" | "out" | "no";

type Row = {
  group: Group;
  what: string;
  /** Formats or vendor names, whichever is the honest label. */
  via: string[];
  status: StatusKey;
  body: ReactNode;
  limit?: string;
};

const ROWS: Row[] = [
  /* ---------------------------------------------------------------- coming in */
  {
    group: "in",
    what: "Documents",
    via: [".pdf", ".docx", ".pptx"],
    status: "live",
    body: "Contracts, letters and decks open inside Tenure rather than downloading to somebody's laptop — PowerPoint with its speaker notes intact.",
  },
  {
    group: "in",
    what: "Spreadsheets",
    via: [".xlsx", ".csv"],
    status: "ci",
    body: "They open and edit in place, with a save-conflict check that warns if someone else saved first. A budget spreadsheet also imports: Tenure works out which column is which however your treasurer named them, drops subtotal rows so nothing double-counts, and shows you what it read before anything is saved.",
  },
  {
    group: "in",
    what: "Plain text and data files",
    via: [".txt", ".md", ".json", ".xml"],
    status: "live",
    body: "Edit in place like the spreadsheets. These are also the only file types the assistant will summarise on request, and only under 200KB.",
    limit:
      "AI summarisation is gated to text, JSON, CSV and XML. It does not summarise PDF or Office files, and file contents are never indexed for search — only titles and descriptions are.",
  },

  /* --------------------------------------------------------------- going out */
  {
    group: "out",
    what: "Calendar subscription",
    via: ["Outlook", "Google Calendar", "Apple Calendar"],
    status: "ci",
    body: "One signed link per person, pasted into whichever calendar they already open. No account is connected and no password is shared, and the feed carries only what that seat is already allowed to see.",
    limit:
      "One-way. Tenure fills your calendar and never reads it back, so an event you create in Outlook does not appear in Tenure.",
  },
  {
    group: "out",
    what: "Deadline reminders",
    via: ["in-app"],
    status: "live",
    body: "A deadline the overseeing body publishes once reaches every organization, and reminders fire from scheduled infrastructure without anyone opening the app — once per person, not once per visit.",
    limit:
      "Delivery is in-app only. Every delivery record hardcodes the in-app channel and no application code sends mail or push notifications, so nobody is emailed about anything.",
  },
  {
    group: "out",
    what: "Bulk export of your record",
    via: ["on request"],
    status: "roadmap",
    body: "There is no self-service export path in the application today. Export and deletion requests are handled by us, by hand, when you ask.",
    limit:
      "That is a dependency on two people being reachable, and it matters most in exactly the scenario where you would least want it. Worth writing into an agreement rather than assuming.",
  },

  /* ------------------------------------------------------- not there at all */
  {
    group: "no",
    what: "Third-party connectors",
    // The vendor names are in the SENTENCE, not in the chip row, and that is not a
    // layout preference — it is C-029 being enforced by claims.spec.ts, correctly.
    //
    // The first draft listed all eight as chips under a "Not supported" badge. The
    // ratchet failed it, and the failure was right twice over. Mechanically, the
    // matcher excuses a vendor only when a negative marker sits within a couple of
    // lines, and eight chips are eight lines of innerText — so the badge fell out of
    // range by the third name and "Notion", "Dropbox", "Teams" and "Box" read as
    // bare assertions. Substantively, a row of eight vendor chips IS a logo wall:
    // it has the shape of an integration list, and C-029's whole point is that the
    // shape wins over the caption. In prose, each name is inside the clause that
    // denies it.
    via: ["none"],
    status: "unsupported",
    body: "Tenure does not connect to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord. There is no integration framework, no OAuth client and no vendor SDK anywhere in the product — files, decisions and documents live in Tenure itself. We would rather list them here than let you find out in week three.",
  },
  {
    group: "no",
    what: "Public API and webhooks",
    via: ["REST", "webhooks"],
    status: "unsupported",
    body: "There is no public API to build against and nothing Tenure will call when something changes. If your integration plan depends on either, it is not met today.",
  },
  {
    group: "no",
    what: "Institutional single sign-on",
    via: ["SAML", "OIDC"],
    status: "roadmap",
    body: "Not deployed. It is the gating item for taking Tenure past a pilot, and if it is a procurement precondition then that precondition is not met.",
    limit:
      "There is also no multi-factor authentication in any form today. Accounts are created by us in advance against a named person; the full access model, and its weaknesses, are set out on Security.",
  },
];

const TABS: (SegmentItem & { group: Group | "all" })[] = [
  { key: "all", group: "all", label: "Everything", hint: String(ROWS.length) },
  {
    key: "in",
    group: "in",
    label: "What comes in",
    hint: String(ROWS.filter((r) => r.group === "in").length),
  },
  {
    key: "out",
    group: "out",
    label: "What goes out",
    hint: String(ROWS.filter((r) => r.group === "out").length),
  },
  {
    key: "no",
    group: "no",
    label: "What does not exist",
    hint: String(ROWS.filter((r) => r.group === "no").length),
  },
];

export function ConnectorMatrix() {
  const [tab, setTab] = useState("all");
  const rows = tab === "all" ? ROWS : ROWS.filter((r) => r.group === tab);

  return (
    <Panel>
      <PanelBar
        title="What Tenure connects to"
        meta="nine rows, including the ones that say no"
        aside={
          <Segmented
            label="Filter connectors"
            items={TABS}
            active={tab}
            onSelect={setTab}
            className="border-0 bg-transparent p-0"
          />
        }
      />

      <ul>
        {rows.map((r) => (
          <li
            key={r.what}
            className="grid gap-3 border-b border-line-soft px-5 py-4 last:border-b-0 sm:px-6 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-8"
          >
            <div>
              {/* The badge is rendered immediately after the name, which is also
                  what keeps a vendor name legal: claims.spec.ts excuses one only
                  when a "Not supported" / "Roadmap" marker — or an explicit
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

      <PanelNote>
        The status words above mean exactly what they mean on{" "}
        <Link href="/trust" className="font-medium text-accent-text underline underline-offset-4">
          Security
        </Link>
        , where each one is defined and every control is listed with its evidence.
        No vendor logo appears on this site, because a logo reads as a connector
        whatever the sentence under it says &mdash; and there is no connector code to
        back one.
      </PanelNote>
    </Panel>
  );
}
