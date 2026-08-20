import { expect, test, type Page } from "@playwright/test";
import {
  claims,
  creatableCardTypes,
  forbiddenPhrases,
  forbiddenPilotPhrases,
  type Claim,
} from "../src/lib/claims";
import { site } from "../src/lib/site";
import { ALL_ROUTES, settle } from "./support";
import evidenceManifestJson from "../docs/evidence-manifest.json";

type EvidenceManifest = {
  heads: Record<string, string | null>;
  entries: { claim: string; repo: string; path: string; exists: boolean | null; at: string | null }[];
};
const evidenceManifest = evidenceManifestJson as EvidenceManifest;

/**
 * THE CLAIM ACCURACY RATCHET
 * ==========================
 *
 * This suite exists for one reason: a sentence the product cannot support must
 * never reach production again. `src/lib/claims.ts` is the register of what
 * Tenure is allowed to say and why; this file is the enforcement.
 *
 * Every failure message here is written to teach. It names the route, the exact
 * text that matched, the sentence it sits in, the claim id and the reason the
 * register forbids it — so whoever broke it can fix the copy without reading
 * this file.
 *
 * The whole public surface is read once per worker (see `siteText`) and every
 * assertion runs against that snapshot, so adding a rule costs no page loads.
 */

// One worker, one snapshot. The route text is expensive to gather and identical
// for every assertion in this file, so the file runs sequentially and shares it.
// (`fullyParallel` in the config would otherwise re-read all nine routes per test.)
test.describe.configure({ mode: "default" });

/** An address with no route, which must render the branded 404 — audited like any other page. */
const UNMATCHED_ROUTE = "/this-address-has-no-route-claims-spec";
const SCANNED_ROUTES = [...ALL_ROUTES, UNMATCHED_ROUTE];

const claimById = new Map<string, Claim>(claims.map((c) => [c.id, c]));

/** Availabilities that assert a capability EXISTS today. */
const ASSERTS_EXISTENCE: Claim["availability"][] = [
  "live",
  "ci-verified",
  "built-pending-cutover",
];
/** Availabilities that say the capability is running in the deployed application. */
const DEPLOYED: Claim["availability"][] = ["live", "ci-verified"];
/** Availabilities that assert an ABSENCE — their evidence is a proof of nothing. */
const ASSERTS_ABSENCE: Claim["availability"][] = [
  "unsupported",
  "roadmap",
  "blocked-external",
];

/* -------------------------------------------------------------------------- */
/* Known, reported defects                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Real defects found while writing this suite. They live in files this suite
 * does not own, so each one is pinned to a `test.fixme` below rather than
 * silently deleted. Delete the entry and the fixme together when the source is
 * fixed — the live tests above them already cover everything else.
 */
const KNOWN_REGISTER_GAPS = {
  /**
   * Empty, and it should stay that way.
   *
   * This used to list C-031 as "unsupported but carries no qualification". C-031
   * has carried one all along (claims.ts:428 — "Append-only is enforced by the
   * application, not by cryptography..."), so the live test `continue`d past the
   * one claim it named, and the paired test.fixme that would have caught a REAL
   * missing qualification stayed switched off behind it.
   *
   * That is the failure mode worth naming: a stale exemption is indistinguishable
   * from a live one, and it silently excuses the next genuine defect. The live
   * test passes unexempted.
   */
  missingQualification: [] as string[],
  /**
   * C-028 / C-029c / C-030 are sourced to the deploying repo but cite no file:
   * their evidence is an absence proof ("grep returns zero hits"), and a file
   * that does not exist has no path. The live test therefore requires a path
   * only from claims that assert a capability EXISTS.
   */
  noEvidencePath: ["C-028", "C-029c", "C-030"],
};

/* -------------------------------------------------------------------------- */
/* Page text                                                                   */
/* -------------------------------------------------------------------------- */

type RouteText = {
  route: string;
  /** Visible text, one entry per rendered line, inner whitespace collapsed. */
  lines: string[];
  /** Every line joined by a single space. */
  flat: string;
  /** `flat`, split on sentence terminators. */
  sentences: string[];
  /** Served markup, for checks that must also see attributes and alt text. */
  html: string;
};

const snapshot = new Map<string, RouteText>();

/** Typographic quotes are normalised so the register's ASCII regexes match rendered copy. */
function normalise(input: string) {
  return input
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[  ]/g, " ");
}

async function readRoute(page: Page, route: string): Promise<RouteText> {
  const response = await page.goto(route);
  expect(response, `${route} returned no response`).not.toBeNull();
  await settle(page);

  const { text, html } = await page.evaluate(() => {
    // A collapsed FAQ answer is still published copy, so it is audited too.
    // The accordion is exclusive (`<details name="faq">`), which closes the
    // siblings whenever one opens — the grouping attribute has to go first.
    const details = Array.from(document.querySelectorAll("details"));
    for (const d of details) d.removeAttribute("name");
    for (const d of details) d.open = true;
    return {
      text: document.body.innerText,
      html: document.documentElement.outerHTML,
    };
  });

  const lines = normalise(text)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const flat = lines.join(" ");

  return {
    route,
    lines,
    flat,
    sentences: flat.split(/(?<=[.!?])\s+/).filter(Boolean),
    html: normalise(html),
  };
}

/** Reads every public route once per worker and caches the result. */
async function siteText(page: Page): Promise<RouteText[]> {
  if (snapshot.size < SCANNED_ROUTES.length) {
    // The first test in the worker pays for every page load.
    test.setTimeout(180_000);
    for (const route of SCANNED_ROUTES) {
      if (!snapshot.has(route)) snapshot.set(route, await readRoute(page, route));
    }
  }
  return SCANNED_ROUTES.map((route) => snapshot.get(route)!);
}

/* -------------------------------------------------------------------------- */
/* The matcher, and why it is shaped this way                                  */
/* -------------------------------------------------------------------------- */

/**
 * /trust is the page whose whole job is to say what Tenure CANNOT do, so it
 * necessarily contains the exact strings the register forbids: it says
 * separation of duties is Not supported, that the audit table has no hash
 * chain, that SSO and SOC 2 are Roadmap, and — under a `Limit:` rule — that
 * tenancy is *not* PostgreSQL row-level security. Failing on those would punish
 * the site for being honest, so the matcher has to tell a correct negative
 * statement apart from a bare marketing assertion.
 *
 * The trust page renders every control as four consecutive text blocks:
 *
 *     Separation of duties on approvals      <- title
 *     NOT SUPPORTED                          <- status badge
 *     There is no control preventing …       <- body
 *     Limit: If your finance policy …        <- limit rule
 *
 * The disclaimer is therefore never inside the same line as the phrase; it is
 * one or two LINES away. So the matcher works on lines, not on the document:
 *
 *   1. The regex is tested against the matched line PLUS the two lines after
 *      it. The register's own lookaheads need that: `/\bSOC ?2\b(?!.{0,40}\b
 *      roadmap\b)/` has to see the ROADMAP badge that follows the heading, and
 *      `.` never crosses a newline, so a naive innerText scan fires on the
 *      trust page's most careful sentence. A hit is attributed to a line only
 *      when it starts inside that line, so nothing is counted twice.
 *
 *   2. A hit is excused only when an explicit negative marker — a "Not
 *      supported" or "Roadmap" status badge, or a "Limit:" rule — sits within
 *      two lines before or three lines after it.
 *
 * Marketing copy has no status badge and no Limit: rule anywhere near it, so a
 * bare assertion still fails. `trust page keeps the disclaimers that excuse it`
 * below asserts the badges are really there, so the exemption cannot be widened
 * by quietly deleting them.
 */
const NEGATIVE_MARKERS = [
  { label: 'a "Not supported" status badge', re: /\bnot supported\b/i },
  { label: 'a "Roadmap" status badge', re: /\broadmap\b/i },
  { label: 'an explicit "Limit:" rule', re: /\bLimit:/ },
];

/** Extra excuses that apply only to vendor names (see the integration rule). */
const DISCLAIMED_VENDOR = [
  {
    label: "an explicit statement that Tenure does not connect to it",
    re: /\b(?:does not|doesn't|do not|don't|cannot|can't|no|never|without)\s+(?:\w+\s+){0,2}(?:connect|connects|integrat\w+|sync\w*|support)/i,
  },
  {
    label: 'a "replaces it" comparison rather than an integration claim',
    re: /\breplaces?\b/i,
  },
  /*
    ADDED 2026-08-19 WITH C-029a/b. Until then every vendor name on this site had
    to sit beside a denial, because the honest answer for all nine was the same
    denial. It is not any more: a Slack connector is built and unit-tested in the
    deploying repo but no product surface calls it, and seventeen further products
    are declared in the catalog awaiting credentials.

    "Do not name them" would now force the site to hide something true, and
    "name them freely" would let it imply they work. So a third excuse: a vendor
    may be named when its real, NOT-AVAILABLE status is stated within the same
    window. The phrases below are the register's own words for those two states,
    and none of them can be read as availability.
  */
  {
    label: 'the "built, not reachable from the product" status (C-029a)',
    re: /\bnot yet in the (?:product|console)\b|\bbuilt,? not (?:reachable|connected|wired)\b|\bno console switch\b/i,
  },
  {
    label: 'the "declared in the catalog, awaiting credentials" status (C-029b)',
    re: /\bawaiting credentials\b|\bdeclared in the catalog\b|\bcatalog entry\b/i,
  },
];

type Hit = {
  route: string;
  matched: string;
  line: string;
  sentence: string;
  excusedBy: string | null;
};

/** The sentence of `line` that contains the character at `index`. */
function sentenceAround(line: string, index: number) {
  const parts = line.split(/(?<=[.!?])\s+/);
  let offset = 0;
  for (const part of parts) {
    const end = offset + part.length;
    if (index <= end) return part.trim();
    offset = end + 1;
  }
  return line;
}

function findHits(
  text: RouteText,
  phrase: RegExp,
  excuses = NEGATIVE_MARKERS,
): Hit[] {
  const re = new RegExp(
    phrase.source,
    phrase.flags.includes("g") ? phrase.flags : `${phrase.flags}g`,
  );
  const hits: Hit[] = [];

  for (let i = 0; i < text.lines.length; i++) {
    const line = text.lines[i];
    const probe = text.lines.slice(i, i + 3).join(" ");
    re.lastIndex = 0;

    let m: RegExpExecArray | null;
    while ((m = re.exec(probe)) !== null) {
      if (m.index >= line.length) break; // belongs to a following line
      const window = text.lines.slice(Math.max(0, i - 2), i + 4).join(" | ");
      const excuse = excuses.find((e) => e.re.test(window));
      hits.push({
        route: text.route,
        matched: m[0],
        line,
        sentence: sentenceAround(line, m.index),
        excusedBy: excuse ? excuse.label : null,
      });
      if (m[0].length === 0) re.lastIndex += 1;
    }
  }
  return hits;
}

function report(lines: string[]) {
  return `\n\n${lines.join("\n")}\n`;
}

/** A synthetic page, for asserting on the matcher itself. */
function fakeRoute(lines: string[]): RouteText {
  const flat = lines.join(" ");
  return { route: "(fixture)", lines, flat, sentences: flat.split(/(?<=[.!?])\s+/), html: "" };
}

/**
 * The exemption above is the one thing in this file that can quietly turn every
 * other test green for the wrong reason: widen it far enough and a forbidden
 * phrase is always "disclaimed". So the matcher is tested directly, against the
 * shape of the trust page and against the shape of a marketing sentence.
 */
test.describe("the matcher itself", () => {
  test("a disclaimed limit is excused and a bare assertion is not", () => {
    const sod = /\bseparation of duties\b/i;

    const asTrustRendersIt = fakeRoute([
      "Separation of duties on approvals",
      "NOT SUPPORTED",
      "There is no control preventing a requester who also holds an approving seat from approving their own request.",
      "Limit: If your finance policy requires enforced segregation, Tenure does not satisfy it today.",
    ]);
    const asMarketingWouldWriteIt = fakeRoute([
      "Separation of duties, enforced on every approval.",
    ]);

    const disclaimed = findHits(asTrustRendersIt, sod);
    expect(disclaimed, "the phrase must still be found before it can be excused").toHaveLength(1);
    expect(disclaimed[0].excusedBy).not.toBeNull();

    const bare = findHits(asMarketingWouldWriteIt, sod);
    expect(bare).toHaveLength(1);
    expect(
      bare[0].excusedBy,
      "a bare marketing assertion must NOT be excused — the ratchet would be vacuous",
    ).toBeNull();
  });

  test("a status badge on the next line satisfies the register's own lookaheads", () => {
    const soc2 = forbiddenPhrases.find((f) => f.claimId === "C-026")!.phrase;

    // innerText puts the badge on its own line, and `.` never crosses a newline,
    // so a document-wide scan fires on the trust page's most careful heading.
    expect(findHits(fakeRoute(["SOC 2", "ROADMAP", "On the roadmap."]), soc2)).toHaveLength(0);
    expect(findHits(fakeRoute(["Tenure is SOC 2 compliant."]), soc2)).toHaveLength(1);
  });

  test("a vendor is excused only where the copy disclaims it", () => {
    const slack = /\bSlack\b/;
    const excuses = [...NEGATIVE_MARKERS, ...DISCLAIMED_VENDOR];

    const disclaimed = findHits(
      fakeRoute([
        "Connectors to third-party systems",
        "NOT SUPPORTED",
        "Tenure does not connect to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord.",
      ]),
      slack,
      excuses,
    );
    expect(disclaimed.every((h) => h.excusedBy !== null)).toBe(true);

    const claimed = findHits(fakeRoute(["Connect Tenure to Slack in one click."]), slack, excuses);
    expect(claimed).toHaveLength(1);
    expect(claimed[0].excusedBy, "a bare integration claim must NOT be excused").toBeNull();
  });
});

/* ========================================================================== */
/* 1. FORBIDDEN PHRASES                                                        */
/* ========================================================================== */

test.describe("forbidden phrases", () => {
  for (const { phrase, because, claimId } of forbiddenPhrases) {
    test(`${claimId}: no public copy matches ${phrase.source}`, async ({ page }) => {
      const pages = await siteText(page);
      const claim = claimById.get(claimId);
      const violations: string[] = [];

      for (const text of pages) {
        for (const hit of findHits(text, phrase)) {
          if (hit.excusedBy) continue;
          violations.push(
            [
              `FORBIDDEN CLAIM LANGUAGE on ${hit.route}`,
              `  matched   : "${hit.matched}"`,
              `  sentence  : "${hit.sentence}"`,
              `  because   : ${because}`,
              `  claim     : ${claimId} (${claim?.availability ?? "unknown"}) — ${claim?.claim ?? ""}`,
              claim?.qualification ? `  limit     : ${claim.qualification}` : "",
              `  fix       : say what the deploying repo actually does, or state the limit`,
              `              beside the phrase the way /trust does (a "Not supported" or`,
              `              "Roadmap" badge, or a "Limit:" rule).`,
            ]
              .filter(Boolean)
              .join("\n"),
          );
        }
      }

      expect(violations, report(violations)).toHaveLength(0);
    });
  }

  /**
   * The exemption above is only safe while /trust really does carry the
   * disclaimers. If a badge or a Limit: rule is deleted, the phrase silently
   * becomes a bare assertion — and the forbidden-phrase tests would still pass,
   * because they would just keep excusing it. This test closes that hole.
   */
  test("trust page keeps the disclaimers that excuse it", async ({ page }) => {
    const pages = await siteText(page);
    const trust = pages.find((p) => p.route === "/trust")!;

    const mustBeDisclaimed = [
      { phrase: /\bseparation of duties\b/i, claimId: "C-024" },
      { phrase: /\bhash chain\b/i, claimId: "C-004" },
      { phrase: /\brow[- ]level security\b/i, claimId: "C-003" },
      { phrase: /\bsingle sign-on\b/i, claimId: "C-023" },
      { phrase: /\bSOC ?2\b/i, claimId: "C-026" },
    ];

    const problems: string[] = [];
    for (const { phrase, claimId } of mustBeDisclaimed) {
      const hits = findHits(trust, phrase);
      if (hits.length === 0) {
        problems.push(
          `/trust no longer mentions ${phrase.source} at all (${claimId}). ` +
            `The register expects it to be listed as a limit — if it moved, move this test.`,
        );
        continue;
      }
      for (const hit of hits) {
        if (hit.excusedBy) continue;
        problems.push(
          `/trust states ${phrase.source} with no "Not supported"/"Roadmap" badge and no ` +
            `"Limit:" rule near it (${claimId}): "${hit.sentence}"`,
        );
      }
    }

    expect(problems, report(problems)).toHaveLength(0);
  });

  /**
   * KNOWN DEFECT — see `failures` in the report.
   * src/components/home/Governance.tsx:56 renders the chip "SOC 2 roadmap, in
   * progress". C-026's qualification is explicit: "'Roadmap' only. Never
   * 'compliant', 'certified', 'readiness', 'in progress', or 'controls
   * operating'." /trust says the opposite in as many words — "There is no audit
   * in progress" — so the home page contradicts the trust page. The word
   * "roadmap" sitting next to it satisfies the register's own lookahead, which
   * is why the test above does not catch it. Fixing it means editing a
   * component this suite does not own.
   */
  /**
   * The home page advertised "Credential" as a knowledge-card kind for months.
   *
   * The product retired that type on purpose: MemoryRecord.content is an
   * unencrypted Json column that any ACTIVE seat can write and that is indexed for
   * search, so a kind called "Login or access info" invited people to paste
   * passwords into a shared database against an encryption control that was never
   * written. The row also omitted THREAD and BUDGET, which are creatable.
   *
   * No phrase blocklist could catch this — "Credential" is a perfectly good word,
   * and /terms and /trust now have to use it to disclose that pilot access is not
   * gated on an individual credential. What is wrong is only the CONTEXT: the word
   * offered as a card kind. So the row is asserted against the register's mirror of
   * the product enum instead.
   */
  /**
   * THE REGISTER'S CENTRAL RULE, FINALLY ENFORCED.
   *
   * claims.ts defines `qualification` as "Limits that MUST travel with the claim
   * wherever it appears", and `where` as the routes it appears on. Nothing checked
   * that the limit made the trip. It had not: C-003 lists "/" and its qualification
   * carries "15 of 39", and the home page said "isolation is enforced at the query
   * layer" with no scope at all — the strongest possible reading of a claim whose
   * whole point is that it is partial.
   *
   * Scoped to figures of the form "N of M" deliberately. A qualification is prose
   * and cannot be matched wholesale, but a fraction is the part a reader would
   * quote back, it is unambiguous to search for, and it is precisely the shape that
   * went missing. If a future qualification states a scope this way, it will be
   * held to the same rule on every route the claim appears on.
   */
  test("a qualification that states a fraction states it on every route the claim appears on", async ({
    page,
  }) => {
    const routes = await siteText(page);
    const byRoute = new Map(routes.map((r) => [r.route, r]));
    const FRACTION = /\b\d+ of \d+\b/g;
    const problems: string[] = [];

    for (const c of claims) {
      const figures = [...new Set(c.qualification?.match(FRACTION) ?? [])];
      if (!figures.length) continue;

      for (const w of c.where) {
        const route = routeOf(w);
        if (!route) continue;
        const text = byRoute.get(route);
        if (!text) continue;
        const body = normalise(text.lines.join(" "));
        for (const figure of figures) {
          if (!body.includes(figure)) {
            problems.push(
              `${c.id}: the qualification says "${figure}" but ${route} does not.\n` +
                `    ${c.claim}\n` +
                `    A limit that does not travel with the claim is a limit nobody reads — ` +
                `either state the scope on ${route}, or drop ${route} from the claim's \`where\`.`,
            );
          }
        }
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("the memory card kinds match the types the product lets you create", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const row = page.getByTestId("memory-card-kinds");
    await expect(row).toBeVisible();
    const rendered = (await row.allInnerTexts())
      .join("\n")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    expect(
      rendered,
      `The home page's knowledge-card kinds must equal CreatableCardTypeEnum in the ` +
        `deploying repo (mirrored as creatableCardTypes in src/lib/claims.ts).\n` +
        `    rendered: ${rendered.join(", ")}\n` +
        `    expected: ${creatableCardTypes.join(", ")}\n` +
        `    "Credential" is retired and must never return without a vault behind it.`,
    ).toEqual([...creatableCardTypes]);
  });

  test("SOC 2 is never described as in progress", async ({ page }) => {
    const pages = await siteText(page);
    const violations = pages
      .flatMap((text) => findHits(text, /\bSOC ?2\b[^.]{0,60}\bin progress\b/i))
      .map((hit) => `${hit.route}: "${hit.sentence}" (C-026 forbids 'in progress')`);
    expect(violations, report(violations)).toHaveLength(0);
  });
});

/* ========================================================================== */
/* 2. PILOT LANGUAGE                                                           */
/* ========================================================================== */

/** The office, however its possessive is typeset. */
const OFFICE = /(?:Simon's\s+)?Office of Student Engagement/i;
const HEDGES = /\b(?:plan|plans|planned|planning|propose|proposed|proposal|proposing|target|targets|targeting|intend|intended)\b/i;

test.describe("pilot language", () => {
  test("no phrase from the register's pilot blocklist appears", async ({ page }) => {
    const pages = await siteText(page);
    const violations: string[] = [];

    for (const text of pages) {
      for (const phrase of forbiddenPilotPhrases) {
        for (const hit of findHits(text, phrase)) {
          violations.push(
            [
              `PILOT LANGUAGE OVERSTATED on ${hit.route}`,
              `  matched   : "${hit.matched}"`,
              `  sentence  : "${hit.sentence}"`,
              `  because   : C-021 — the ${site.pilot.season} pilot with ${site.origin.office} is`,
              `              verbally agreed and NOT contracted. No written commitment exists.`,
              `  fix       : "planned", "proposed" or "targeting ${site.pilot.season}".`,
            ].join("\n"),
          );
        }
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
  });

  test("the office is never described as deploying, partnering or sponsoring", async ({
    page,
  }) => {
    const pages = await siteText(page);

    // Applied to any sentence naming the office…
    const inOfficeSentence = [
      { label: "is rolling out", re: /\b(?:is|are|will be)\s+rolling out\b/i },
      { label: "is deploying", re: /\b(?:is|are|will be)\s+deploying\b/i },
      { label: "is standing up", re: /\b(?:is|are|will be)\s+standing up\b/i },
      { label: "has adopted / has signed", re: /\bhas\s+(?:adopted|signed|purchased|procured)\b/i },
    ];
    // …and to the whole site, because these only ever describe the office.
    const anywhere = [
      { label: "has partnered", re: /\bhas partnered\b/i },
      { label: "our partner", re: /\bour (?:university )?partners?\b/i },
      { label: "our customer", re: /\bour customers?\b/i },
      { label: "sponsored by", re: /\bsponsored by\b/i },
    ];

    const violations: string[] = [];
    for (const text of pages) {
      for (const sentence of text.sentences) {
        if (!OFFICE.test(sentence)) continue;
        for (const { label, re } of inOfficeSentence) {
          if (re.test(sentence)) {
            violations.push(
              `${text.route}: the office "${label}" — "${sentence.slice(0, 220)}"\n` +
                `  C-021: procurement is not complete; the pilot is verbally agreed only.`,
            );
          }
        }
      }
      for (const { label, re } of anywhere) {
        for (const hit of findHits(text, re)) {
          violations.push(
            `${hit.route}: "${label}" — "${hit.sentence}"\n` +
              `  C-021/C-022: marks indicate origin and support only. Never partnership,` +
              ` customership, sponsorship or endorsement.`,
          );
        }
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
  });

  test(`"${site.pilot.season}" beside the office name is always hedged`, async ({ page }) => {
    const pages = await siteText(page);
    const season = new RegExp(`\\b${site.pilot.season}\\b`, "i");

    const unhedged: string[] = [];
    let checked = 0;

    for (const text of pages) {
      for (const sentence of text.sentences) {
        if (!season.test(sentence) || !OFFICE.test(sentence)) continue;
        checked += 1;
        if (HEDGES.test(sentence)) continue;
        unhedged.push(
          [
            `UNHEDGED PILOT CLAIM on ${text.route}`,
            `  sentence  : "${sentence.slice(0, 300)}"`,
            `  because   : C-021 — verbal agreement only, confirmed 2026-08-02. No signed`,
            `              or written commitment exists, so ${site.pilot.season} with the office`,
            `              may only be stated as planned, proposed or targeted.`,
            `  fix       : add "planned" / "proposed" / "targeting" to THIS sentence.`,
          ].join("\n"),
        );
      }
    }

    // A silent zero would make this test unfalsifiable: the site does name the
    // office next to the season, and it must keep doing so hedged.
    expect(checked, "no sentence names the office beside the pilot season — has the copy moved?")
      .toBeGreaterThan(0);
    expect(unhedged, report(unhedged)).toHaveLength(0);
  });

  test("the register never calls a verbal pilot settled", () => {
    const pilot = claimById.get("C-021")!;
    const verbalOnly = pilot.evidence.some((e) =>
      /\bverbal\b|\bno (?:written|signed)\b|\bunsigned\b/i.test(e),
    );

    if (verbalOnly) {
      expect(
        ASSERTS_EXISTENCE,
        `C-021 is availability "${pilot.availability}" while its only evidence is verbal:\n` +
          pilot.evidence.map((e) => `    - ${e}`).join("\n"),
      ).not.toContain(pilot.availability);
      expect(
        site.pilot.status,
        "site.pilot.status must stay hedged while the pilot is verbal-only",
      ).toMatch(/^(?:planned|proposed|targeting)$/);
    } else {
      // The pilot was upgraded — the register must now cite the document.
      expect(
        pilot.evidence.join(" "),
        "C-021 no longer says the agreement is verbal, so it must cite the signed document",
      ).toMatch(/\bsigned\b|\bexecuted\b|\bcountersigned\b/i);
    }
  });
});

/* ========================================================================== */
/* 3. REGISTER INTEGRITY                                                       */
/* ========================================================================== */

/**
 * A `where` entry is a route only if it starts with one. The field also carries
 * non-route pointers — "site.ts metrics", "components/home/AiOnboarding.tsx" —
 * and routes annotated with their framing, like "/trust (stated as NOT supported)".
 */
function routeOf(where: string): string | null {
  const m = /^(\/[a-z0-9-]*)/i.exec(where.trim());
  return m ? m[1] : null;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** `dir/file.ext`, a bare `file.ext`, or a directory path — anything a reviewer can open. */
const CITES_A_PATH = /[\w.-]+\/[\w./[\]()-]+|\b[\w.-]+\.(?:ts|tsx|js|jsx|mjs|cjs|prisma|sql|ya?ml|json|md|tf)\b/;

function isoDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

test.describe("claims register integrity", () => {
  test("every claim is completely filled in", () => {
    const problems: string[] = [];
    for (const [index, c] of claims.entries()) {
      const label = c.id?.trim() || `claims[${index}]`;
      if (!c.id?.trim()) problems.push(`${label}: empty id`);
      if (!c.claim?.trim()) problems.push(`${label}: empty claim text`);
      if (!Array.isArray(c.evidence) || c.evidence.length === 0)
        problems.push(`${label}: no evidence — a claim with no evidence may not be published`);
      else if (c.evidence.some((e) => !e?.trim()))
        problems.push(`${label}: an evidence entry is blank`);
      if (!c.owner?.trim()) problems.push(`${label}: no owner — someone must be accountable`);
      if (!c.lastVerified?.trim()) problems.push(`${label}: no lastVerified`);
      if (!c.reviewBy?.trim()) problems.push(`${label}: no reviewBy`);
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("claim ids are unique", () => {
    const seen = new Map<string, number>();
    for (const c of claims) seen.set(c.id, (seen.get(c.id) ?? 0) + 1);
    const duplicates = [...seen].filter(([, n]) => n > 1).map(([id, n]) => `${id} appears ${n} times`);
    expect(duplicates, report(duplicates)).toHaveLength(0);
    expect(claims.length).toBeGreaterThan(0);
  });

  test("lastVerified is a real date and is not in the future", () => {
    const now = new Date();
    const problems: string[] = [];
    for (const c of claims) {
      if (!ISO_DATE.test(c.lastVerified)) {
        problems.push(`${c.id}: lastVerified "${c.lastVerified}" is not YYYY-MM-DD`);
        continue;
      }
      const verified = isoDate(c.lastVerified);
      if (Number.isNaN(verified.getTime())) {
        problems.push(`${c.id}: lastVerified "${c.lastVerified}" is not a real date`);
      } else if (verified.getTime() > now.getTime()) {
        problems.push(
          `${c.id}: lastVerified ${c.lastVerified} is in the future — a claim cannot be ` +
            `verified against a commit that has not happened`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("reviewBy is after lastVerified", () => {
    const problems: string[] = [];
    for (const c of claims) {
      if (!ISO_DATE.test(c.reviewBy)) {
        problems.push(`${c.id}: reviewBy "${c.reviewBy}" is not YYYY-MM-DD`);
        continue;
      }
      if (!ISO_DATE.test(c.lastVerified)) continue; // reported by the test above
      if (isoDate(c.reviewBy).getTime() <= isoDate(c.lastVerified).getTime()) {
        problems.push(
          `${c.id}: reviewBy ${c.reviewBy} is not after lastVerified ${c.lastVerified} — ` +
            `the claim is due for review before it was verified`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("nothing is called live on the strength of the non-deploying repo", () => {
    const problems: string[] = [];
    for (const c of claims) {
      if (!DEPLOYED.includes(c.availability)) continue;
      if (c.evidenceRepo === "Tenure-Parent" || c.evidenceRepo === "none") {
        problems.push(
          `${c.id} is "${c.availability}" but its evidence lives in "${c.evidenceRepo}": ` +
            `${c.claim}\n    Only satvikOS/Tenure deploys. Parent work is "built, pending ` +
            `cutover" at best, and "none" is not evidence of anything.`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("every unsupported, roadmap or blocked claim states its limit", () => {
    const problems: string[] = [];
    for (const c of claims) {
      if (!ASSERTS_ABSENCE.includes(c.availability)) continue;
      if (KNOWN_REGISTER_GAPS.missingQualification.includes(c.id)) continue;
      if (!c.qualification?.trim()) {
        problems.push(
          `${c.id} is "${c.availability}" with no qualification: ${c.claim}\n    ` +
            `A limit that does not travel with the claim is a limit nobody reads.`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  /*
    The test.fixme that used to sit here has been deleted rather than fixed,
    because there was nothing to fix. It pinned "C-031 carries no qualification",
    and C-031 has carried one all along. The stale entry in KNOWN_REGISTER_GAPS
    made the live test above skip the only id it named, and kept this disabled
    test standing in for a defect that did not exist. Both are gone; the live test
    now runs unexempted.
  */

  /**
   * An evidence path with a "..." in it is not a path.
   *
   * C-010 cited `apps/web/src/app/api/documents/.../save/route.ts` and passed for
   * months, because CITES_A_PATH only matches the SHAPE of a path and never
   * resolves one. The product repo is not checked out in CI, so this suite cannot
   * open the file — but it can refuse the two things that are wrong on their face:
   * an elided segment, and a bare directory where a file was promised.
   */
  /**
   * The register's citations are resolved against a real checkout by
   * `npm run claims:evidence`, which writes docs/evidence-manifest.json. This
   * asserts against that manifest, because CI has no checkout of the product
   * repositories and therefore cannot open the files itself.
   *
   * It is the difference between "this string is shaped like a path" — which is
   * all CITES_A_PATH could ever tell us, and which let a non-existent file, a
   * literal "..." and a spec testing something else all pass green — and "this
   * path existed in that repository at that commit".
   *
   * The manifest can drift; that is the honest limit. It records the commit it
   * was generated at, and the test below checks that against the register's own
   * evidenceCommit, so drift fails loudly instead of passing quietly.
   */
  test("every evidence path resolved against a real checkout", () => {
    const problems: string[] = [];

    for (const entry of evidenceManifest.entries) {
      if (entry.exists === true) continue;
      problems.push(
        entry.exists === false
          ? `${entry.claim} cites ${entry.repo}/${entry.path}, which does not exist.\n` +
              `    Resolved at ${entry.at}. Fix the path, or the claim.`
          : `${entry.claim} cites ${entry.repo}/${entry.path}, which was never resolved — ` +
              `the repository was not checked out when the manifest was generated.\n` +
              `    Re-run \`npm run claims:evidence\` somewhere it is.`,
      );
    }

    /*
      And the other half, without which the above is theatre: a path that is not
      IN the manifest is not checked by it. Someone adding a claim without
      regenerating would get a green run on an unverified citation — the same
      failure shape as the regex it replaces, one level up. So every file-shaped
      evidence entry in the register must appear in the manifest.
    */
    const resolved = new Set(
      evidenceManifest.entries.map((e) => `${e.claim}|${e.repo}|${e.path}`),
    );
    for (const c of claims) {
      for (const ev of c.evidence) {
        const token = ev.trim().split(/\s+/)[0].replace(/:[0-9]+(-[0-9]+)?$/, "").replace(/[,;]$/, "");
        const looksLikeFile = token.includes("/") && /\.[a-z0-9]+$/i.test(token) && !token.includes("...");
        if (!looksLikeFile) continue;
        if (!resolved.has(`${c.id}|${c.evidenceRepo}|${token}`)) {
          problems.push(
            `${c.id} cites ${token} but the evidence manifest has no entry for it.\n` +
              `    The citation has never been resolved against a checkout. Run ` +
              `\`npm run claims:evidence\` and commit docs/evidence-manifest.json.`,
          );
        }
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("the evidence manifest was generated at the commits the register cites", () => {
    const problems: string[] = [];
    const cited = new Map<string, string>();
    for (const c of claims) cited.set(c.evidenceRepo, c.evidenceCommit);

    for (const [repo, commit] of cited) {
      const head = evidenceManifest.heads[repo];
      if (head == null) continue; // recorded as unresolved by the test above
      if (!commit.startsWith(head) && !head.startsWith(commit)) {
        problems.push(
          `The register cites ${repo} at ${commit}, but the evidence manifest was ` +
            `generated against ${head}.\n    The citations were checked against a different ` +
            `commit than the one they claim. Re-run \`npm run claims:evidence\`, or correct ` +
            `evidenceCommit.`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("no evidence path contains an elided segment", () => {
    const problems: string[] = [];
    for (const c of claims) {
      for (const e of c.evidence) {
        if (/\.\.\./.test(e)) {
          problems.push(
            `${c.id} cites a path with "..." in it, which resolves to nothing:\n      ${e}\n` +
              `    Write the real path. Bracketed Next.js segments are fine: [id], [slug].`,
          );
        }
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  /**
   * "ci-verified" is defined in the register as "Live, and a test asserts it on
   * every build". A claim making that promise must name the test.
   *
   * C-012 and C-018 were both marked ci-verified while citing no spec at all —
   * C-018's evidence pointed at a spec that tests something else entirely.
   */
  /**
   * `where` records the routes a claim appears on, and until now nothing read it.
   * `grep -c "\.where" claims.spec.ts` returned 0, so the register could name a
   * route that had never carried the claim, or one that stopped carrying it, and
   * no test would notice. This is the cheap half of closing that: the routes have
   * to exist. The expensive half — that the limit actually travels — is below.
   */
  test("every route a claim claims to appear on is a real route", () => {
    const known = new Set<string>(ALL_ROUTES);
    const problems: string[] = [];
    for (const c of claims) {
      for (const w of c.where) {
        const route = routeOf(w);
        if (!route) continue; // "site.ts metrics", "components/…" — not routes
        if (!known.has(route)) {
          problems.push(
            `${c.id} lists "${w}" in \`where\`, but ${route} is not a route in routes.ts.\n` +
              `    Known routes: ${[...known].join(", ")}`,
          );
        }
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("every ci-verified claim names the test that verifies it", () => {
    const TEST_FILE = /\.(?:spec|test|itest)\.[tj]sx?\b/;
    const problems: string[] = [];
    for (const c of claims) {
      if (c.availability !== "ci-verified") continue;
      if (!c.evidence.some((e) => TEST_FILE.test(e))) {
        problems.push(
          `${c.id} is "ci-verified" but cites no test file:\n` +
            c.evidence.map((e) => `      - ${e}`).join("\n") +
            `\n    "ci-verified" means a test asserts it on every build. Name that test, ` +
            `or downgrade the claim to "live".`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  test("a capability sourced to the deploying repo cites a file", () => {
    const problems: string[] = [];
    for (const c of claims) {
      if (c.evidenceRepo !== "Tenure") continue;
      if (!ASSERTS_EXISTENCE.includes(c.availability)) continue;
      if (!c.evidence.some((e) => CITES_A_PATH.test(e))) {
        problems.push(
          `${c.id} is "${c.availability}" against satvikOS/Tenure but cites no file:\n` +
            c.evidence.map((e) => `      - ${e}`).join("\n") +
            `\n    A reviewer must be able to open the code that proves it.`,
        );
      }
    }
    expect(problems, report(problems)).toHaveLength(0);
  });

  /**
   * KNOWN DEFECT — see `failures` in the report.
   * C-028, C-029c and C-030 name satvikOS/Tenure as their evidence repository but
   * cite no path at all ("Repo-wide grep … returns ZERO hits", "20 API routes,
   * none an export"). All three are absence proofs, so there is no file to
   * point at — but the register still attributes them to a repository, which
   * makes them unverifiable at the stated source. The live test above therefore
   * demands a path only from claims that assert a capability exists.
   */
  test.fixme("every Tenure-sourced claim cites a file, including absence proofs", () => {
    const problems = claims
      .filter((c) => c.evidenceRepo === "Tenure" && !c.evidence.some((e) => CITES_A_PATH.test(e)))
      .map((c) => `${c.id} (${c.availability}): ${c.evidence.join(" / ")}`);
    expect(problems, report(problems)).toHaveLength(0);
  });
});

/* ========================================================================== */
/* 4. METRICS                                                                  */
/* ========================================================================== */

test.describe("metrics band", () => {
  test("every animated metric is backed by a live claim", () => {
    const problems: string[] = [];

    for (const metric of site.metrics) {
      const label = `${metric.value}${metric.suffix} ${metric.label}`;
      const claimId = (metric as { claimId?: string }).claimId;

      if (!claimId?.trim()) {
        problems.push(
          `metric "${label}" has no claimId. A number with no row in the register is a ` +
            `number nobody counted.`,
        );
        continue;
      }
      const claim = claimById.get(claimId);
      if (!claim) {
        problems.push(`metric "${label}" cites ${claimId}, which is not in the register.`);
        continue;
      }
      if (claim.availability !== "live" && claim.availability !== "ci-verified") {
        problems.push(
          `metric "${label}" cites ${claimId}, which is "${claim.availability}", not live.\n` +
            `    ${claim.claim}\n    Only a measured, deployed mechanism belongs in the ` +
            `metrics band — a target is not a metric.`,
        );
      }
    }

    expect(site.metrics.length, "the metrics band is empty").toBeGreaterThan(0);
    expect(problems, report(problems)).toHaveLength(0);
  });
});

/* ========================================================================== */
/* 5. SPACING REGRESSIONS                                                      */
/* ========================================================================== */

/**
 * Two of these shipped: "Student Engagementisn't" and "hello@tenurework.comand",
 * both caused by JSX dropping the space at an element boundary — the markup
 * looks fine, the rendered sentence does not. The patterns below are written for
 * the CLASS of defect, not for the two strings, so the next one is caught the
 * first time it renders.
 */
const CONTRACTION_STEMS =
  "isn|aren|wasn|weren|won|don|doesn|didn|hasn|haven|hadn|can|couldn|shouldn|wouldn|mustn|ain|shan";

const GLUE_PATTERNS = [
  {
    label: "a word glued to the front of a contraction (\"Engagementisn't\")",
    // A standalone contraction is always preceded by a space, so the 3+ letter
    // prefix can only mean a dropped boundary. No stem here is the tail of
    // another contraction, so "wouldn't"/"doesn't" cannot match themselves.
    re: new RegExp(`[A-Za-z]{3,}(?:${CONTRACTION_STEMS})'t\\b`, "g"),
  },
  {
    label: 'a domain glued to the next word ("hello@tenurework.comand")',
    re: /\.(?:com|org|net|edu|io|gov)(?=[A-Za-z])/g,
  },
  {
    label: "an email address glued to the next word",
    re: /[\w.+-]+@[\w-]+\.(?:com|org|net|edu|io|gov)(?=[A-Za-z])/g,
  },
];

test.describe("rendered spacing", () => {
  test("no word is glued to the next at an element boundary", async ({ page }) => {
    const pages = await siteText(page);
    const violations: string[] = [];

    for (const text of pages) {
      for (const line of text.lines) {
        for (const { label, re } of GLUE_PATTERNS) {
          re.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = re.exec(line)) !== null) {
            violations.push(
              [
                `MISSING SPACE on ${text.route}`,
                `  matched   : "${m[0]}"`,
                `  pattern   : ${label}`,
                `  context   : "…${line.slice(Math.max(0, m.index - 70), m.index + 70)}…"`,
                `  fix       : the JSX around this text dropped a space at an element`,
                `              boundary. Add {" "} between the elements.`,
              ].join("\n"),
            );
            if (m[0].length === 0) re.lastIndex += 1;
          }
        }
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
  });

  /**
   * THE GENERAL FORM OF THE DEFECT, CAUGHT AT THE TAG BOUNDARY.
   *
   * `GLUE_PATTERNS` above matches the two shapes that shipped — a contraction and
   * a domain — and it took a third occurrence to notice that it only ever
   * described those two. On 2026-08-18 a sweep of the rendered HTML found ELEVEN
   * dropped spaces across four routes, none of which any existing rule could see:
   *
   *     …to the <span>seat</span>rather than the person in it
   *     …Student Engagement<!-- -->— proposed, not contracted
   *     …<strong>Amazon Web Services</strong>— hosting, database and…
   *     …<a href="/trust">trust page</a>states the same limit…
   *
   * The cause is one rule, not four typos: SWC drops the leading space of a JSX
   * text node when that node spans multiple lines and follows an element or an
   * expression. So `</span> rather\n than…` compiles to `</span>rather than…`,
   * and it happens silently — the source looks correct, and only the rendered
   * output is wrong.
   *
   * This checks the SERVED MARKUP rather than innerText, because that is where
   * the evidence is: by the time it reaches innerText the two words are simply
   * one word, indistinguishable from a compound. A word character, then a closing
   * inline tag or React's `<!-- -->` text separator, then a letter or a dash, is
   * the signature — and the fix is always the same, an explicit {" "}.
   */
  test("no space is dropped at a JSX element boundary", async ({ page }) => {
    const pages = await siteText(page);
    const BOUNDARY = /(\w)(?:<\/(?:span|a|strong|em|b|i)>|<!-- -->)([A-Za-z—–])/g;
    const violations: string[] = [];

    for (const text of pages) {
      BOUNDARY.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = BOUNDARY.exec(text.html)) !== null) {
        const context = text.html
          .slice(Math.max(0, m.index - 70), m.index + 70)
          .replace(/\s+/g, " ");
        violations.push(
          [
            `DROPPED BOUNDARY SPACE on ${text.route}`,
            `  glued     : "${m[1]}…${m[2]}"`,
            `  context   : …${context}…`,
            `  because   : SWC removes the leading space of a multi-line JSX text`,
            `              node that follows an element or an expression, so`,
            `              \`</span> word\\n more\` compiles to \`</span>word more\`.`,
            `  fix       : put an explicit {" "} at that boundary.`,
          ].join("\n"),
        );
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
  });

  test("the two spacing defects that shipped stay fixed", async ({ page }) => {
    const pages = await siteText(page);
    const violations: string[] = [];

    for (const text of pages) {
      if (/Engagementisn/i.test(text.flat))
        violations.push(`${text.route}: "Student Engagementisn't" is back.`);
      if (/tenurework\.com[a-z]/i.test(text.flat))
        violations.push(`${text.route}: "hello@tenurework.comand" is back.`);
    }

    expect(violations, report(violations)).toHaveLength(0);
  });
});

/* ========================================================================== */
/* 6. AI PROVIDER GATE                                                         */
/* ========================================================================== */

/**
 * C-007's provider gate. Synthesis runs on Amazon Bedrock using an Anthropic
 * model, with the direct Anthropic API retained as the fallback, so those two
 * are the permitted names and every other model vendor is a violation.
 *
 * `Bedrock` was the first entry in this list until 2026-08-19, when the release
 * conditions the gate itself named were met in the deploying repo. It is not
 * simply deleted: the pair is now enforced together by the two tests below, so
 * a page cannot name one provider and leave a reader to assume the other path
 * does not exist.
 */
const OTHER_PROVIDERS = [
  /\bOpenAI\b/i,
  /\bChatGPT\b/i,
  /\bGPT-?[0-9]/i,
  /\bGemini\b/i,
  /\bVertex AI\b/i,
  /\bCohere\b/i,
  /\bMistral\b/i,
  /\bLlama\b/i,
  /\bAzure OpenAI\b/i,
  /\bHugging Face\b/i,
  /\bGrok\b/i,
];

test.describe("AI provider gate", () => {
  /*
    THIS TEST USED TO ASSERT THE OPPOSITE, AND IT WAS RIGHT TO.

    Until 2026-08-19 the register's C-007 gate read: "production calls Anthropic
    DIRECTLY. There is no Bedrock integration in either repository. Public and
    legal copy must say Anthropic until the deploying repo invokes Bedrock,
    infrastructure and tests land, and the cutover is confirmed." So the gate
    was a ban on the word, and this test enforced the ban.

    All three release conditions the gate named are met in the deploying repo —
    lib/ai/provider.ts resolves it, infrastructure/terraform/bedrock.tf
    provisions it with bedrock_enabled defaulting to true, ecs.tf sets
    AI_PROVIDER=bedrock, and provider.test.ts + bedrock.test.ts cover it. The
    ban is therefore released, and the ratchet turns to face the other way
    rather than being deleted: the risk now is a page that mentions ONE provider
    and lets a reader conclude their record text never leaves AWS (or never
    reaches it). Both paths ship, so both must be disclosed together.
  */
  test("wherever Bedrock is named, the direct-API fallback is disclosed too", async ({
    page,
  }) => {
    const pages = await siteText(page);
    const violations: string[] = [];

    for (const text of pages) {
      // Markup as well as visible text: an alt attribute or a title would be
      // just as wrong, and just as invisible to a reader of the page.
      if (!/\bBedrock\b/i.test(text.html)) continue;
      if (!/\bAnthropic\b/i.test(text.html)) {
        violations.push(
          `${text.route} names Bedrock without naming Anthropic.\n` +
            `    C-007: Bedrock runs an ANTHROPIC model, and the direct Anthropic API ` +
            `is the retained fallback. Naming only the platform hides which vendor ` +
            `actually processes the text.`,
        );
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
  });

  test("no model provider outside the register's two is named", async ({ page }) => {
    const pages = await siteText(page);
    const violations: string[] = [];
    let anthropicMentions = 0;

    for (const text of pages) {
      anthropicMentions += text.flat.match(/\bAnthropic\b/g)?.length ?? 0;
      for (const re of OTHER_PROVIDERS) {
        for (const hit of findHits(text, re)) {
          violations.push(
            `${hit.route} names "${hit.matched}" — "${hit.sentence}"\n` +
              `    C-007: the model subprocessors are Amazon Bedrock and Anthropic, ` +
              `and no other. Naming a third makes the privacy notice wrong.`,
          );
        }
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
    expect(
      anthropicMentions,
      "the site names no AI provider at all — the subprocessor disclosure has been lost",
    ).toBeGreaterThan(0);
  });

  test("/privacy and /trust disclose that record text leaves for the model provider", async ({
    page,
  }) => {
    const pages = await siteText(page);
    const problems: string[] = [];

    for (const route of ["/privacy", "/trust"]) {
      const text = pages.find((p) => p.route === route)!;

      if (!/\bAnthropic\b/.test(text.flat)) {
        problems.push(`${route} does not name Anthropic as the model provider (C-007).`);
      }
      // Bedrock is the path production actually takes, so a page that discloses
      // only the fallback understates where the text goes by a whole platform.
      if (!/\bBedrock\b/.test(text.flat)) {
        problems.push(
          `${route} does not name Amazon Bedrock (C-007). Synthesis runs there by ` +
            `default; disclosing only the Anthropic fallback describes the path ` +
            `production does not take.`,
        );
      }
      const disclosesTransfer =
        /record(?:s|ed)?[^.]{0,60}\b(?:is|are)\s+(?:sent|included|passed|transmitted)\b/i.test(
          text.flat,
        ) ||
        // "our own infrastructure" is the wording the pages use since the
        // Bedrock cutover, because "our infrastructure" was ambiguous once part
        // of the path became AWS-hosted. "leaves AWS" is the fallback's boundary.
        /\bleaves?\s+our\s+(?:own\s+)?infrastructure\b/i.test(text.flat) ||
        /\b(?:leaves?|leave)\s+AWS\b/i.test(text.flat) ||
        /\btext\s+is\s+sent\s+to\b/i.test(text.flat);
      if (!disclosesTransfer) {
        problems.push(
          `${route} does not say that record text is sent outside Tenure to a third-party ` +
            `model provider.\n    C-007: retrieved record text is included in the request to ` +
            `Anthropic. A security review will ask, so the page has to say it first.`,
        );
      }
    }

    expect(problems, report(problems)).toHaveLength(0);
  });
});

/* ========================================================================== */
/* 7. INTEGRATION LOGOS                                                        */
/* ========================================================================== */

/**
 * C-029: a repo-wide grep for googleapis, slack.com, api.notion, api.dropbox,
 * discord.com, zoom.us, api.box.com, graph.microsoft and oauth2 returns zero
 * hits. There is no integration framework, no public API and no webhooks, so no
 * vendor may be named as something Tenure connects to. Importing a file a vendor
 * produced is not an integration — which is why Excel, Word, PowerPoint, PDF,
 * Outlook, Google Calendar and Apple Calendar are fine: they are backed by real
 * file parsing and a real signed ICS feed.
 *
 * /trust lists all nine under a "Not supported" row and the home FAQ answers
 * "Does Tenure replace our Google Drive, Slack, or Notion?" with "No. Tenure
 * doesn't connect to them" — both are excused exactly the way rule 1 excuses a
 * disclaimed phrase, and only there.
 */
const UNSUPPORTED_VENDORS = [
  // Case-sensitive where the word is also an ordinary noun in this site's copy
  // ("search … in one box", "SMEs & growing teams"): a capitalised occurrence is
  // a vendor reference, a lowercase one is English.
  { name: "Slack", re: /\bSlack\b/ },
  { name: "Notion", re: /\bNotion\b/ },
  { name: "Google Drive", re: /\bGoogle Drive\b/ },
  { name: "Dropbox", re: /\bDropbox\b/ },
  { name: "Box", re: /\bBox\b/ },
  { name: "Zoom", re: /\bZoom\b/ },
  { name: "Discord", re: /\bDiscord\b/ },
  { name: "Teams", re: /\bTeams\b/ },
  { name: "Gmail", re: /\bGmail\b/i },
];

test.describe("integrations", () => {
  test("no unsupported vendor is named as something Tenure connects to", async ({ page }) => {
    const pages = await siteText(page);
    const excuses = [...NEGATIVE_MARKERS, ...DISCLAIMED_VENDOR];
    const violations: string[] = [];

    for (const text of pages) {
      for (const { name, re } of UNSUPPORTED_VENDORS) {
        for (const hit of findHits(text, re, excuses)) {
          if (hit.excusedBy) continue;
          violations.push(
            [
              `UNSUPPORTED INTEGRATION NAMED on ${hit.route}`,
              `  vendor    : ${name}`,
              `  sentence  : "${hit.sentence}"`,
              `  because   : C-029 — Tenure has no connector, no public API and no webhooks.`,
              `              A repo-wide grep for every one of these vendors returns zero hits.`,
              `  fix       : remove the name, or state it as unsupported the way /trust does.`,
              `              Excel, Word, PowerPoint, PDF, Outlook, Google Calendar and Apple`,
              `              Calendar are the only vendor names the register allows, because`,
              `              real file parsing and a real signed ICS feed back them.`,
            ].join("\n"),
          );
        }
      }
    }

    expect(violations, report(violations)).toHaveLength(0);
  });

  test("the calendar claim stays one-way wherever it appears", async ({ page }) => {
    const pages = await siteText(page);
    const violations: string[] = [];

    for (const text of pages) {
      for (const hit of findHits(text, /\b(?:two-way|2-way|bi-?directional)\b/i, [
        ...NEGATIVE_MARKERS,
        ...DISCLAIMED_VENDOR,
      ])) {
        if (!/calendar|sync|Outlook|Google|Apple/i.test(hit.sentence)) continue;
        /*
          Respect the excuse window, the way every other guard in this file does.

          This test pushed every hit unconditionally, so it fired on a sentence
          SAYING TWO-WAY SYNC DOES NOT EXIST — which is the thing C-009 wants the
          site to say. The connector matrix's "Two-way sync, and anything outside
          the catalog" row carries a NOT SUPPORTED badge on the next line; that is
          a denial, not a claim.

          The guard keeps all of its force: an unqualified "two-way calendar sync"
          has no badge, no `Limit:` and no denial near it, so it still fails.
        */
        if (hit.excusedBy) continue;
        violations.push(
          `${hit.route}: "${hit.sentence}"\n    C-009: the ICS feed is ONE-WAY. Tenure fills ` +
            `the calendar and never reads it back, and no account is connected.`,
        );
      }
    }

    // The site does make the calendar claim; it must keep saying it is one-way.
    const oneWay = pages.filter((p) => /\bone-way\b/i.test(p.flat));
    expect(
      oneWay.length,
      'no route says the calendar feed is "one-way" any more — C-009 requires the limit to travel with the claim',
    ).toBeGreaterThan(0);
    expect(violations, report(violations)).toHaveLength(0);
  });
});
