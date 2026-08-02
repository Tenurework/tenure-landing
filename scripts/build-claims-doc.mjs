/**
 * Renders docs/PUBLIC-CLAIMS-REGISTER.md from the structured source in
 * src/lib/claims.ts.
 *
 * The markdown is a generated VIEW, never the source of truth. Editing it by
 * hand is pointless: the next build overwrites it, and the CI ratchet
 * (e2e/claims.spec.ts) reads the TypeScript, not the document. That is
 * deliberate — a register nothing enforces is a document, not a control.
 *
 * Run: npm run claims:build
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { claims, forbiddenPhrases, forbiddenPilotPhrases } from "../src/lib/claims.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "docs");
mkdirSync(outDir, { recursive: true });

const AVAILABILITY_LABEL = {
  live: "Live in production",
  "ci-verified": "Live, verified in CI",
  "built-pending-cutover": "Built in Parent, pending cutover",
  "pilot-target": "Pilot target",
  roadmap: "Roadmap",
  unsupported: "Not supported",
  "blocked-external": "BLOCKED — external",
};

const esc = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");

const byCategory = new Map();
for (const c of claims) {
  if (!byCategory.has(c.category)) byCategory.set(c.category, []);
  byCategory.get(c.category).push(c);
}

const counts = claims.reduce((acc, c) => {
  acc[c.availability] = (acc[c.availability] ?? 0) + 1;
  return acc;
}, {});

const lines = [];

lines.push("# Tenure — Public Claims Register");
lines.push("");
lines.push(
  "> **Generated file.** Source of truth is `src/lib/claims.ts`; regenerate with `npm run claims:build`.",
);
lines.push("> Edits made here are lost on the next build and are not enforced by CI.");
lines.push("");
lines.push(
  "Every material claim the public site makes about the product, the pilot, the company or its " +
    "security posture. Each row records the commit the claim was verified against and the file " +
    "that proves it.",
);
lines.push("");
lines.push("## Authority order");
lines.push("");
lines.push(
  "Applied whenever sources disagree. A capability may only be described as available today on " +
    "the strength of the repository that actually deploys.",
);
lines.push("");
lines.push("| # | Source | What it can justify |");
lines.push("|---|---|---|");
lines.push("| 1 | `satvikOS/Tenure` (deploying) | May be described as live |");
lines.push("| 2 | `satvikOS/Tenure-Parent` (canonical dev) | Only \"built, pending cutover\", and only if said explicitly |");
lines.push("| 3 | Signed customer / pilot evidence | May be called a pilot, partnership or deployment |");
lines.push("| 4 | Architecture docs, roadmaps, ADRs, TODOs | Intent. Never capability |");
lines.push("");

lines.push("## Status of the register");
lines.push("");
lines.push(`- **${claims.length}** material claims tracked.`);
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  lines.push(`- ${v} × ${AVAILABILITY_LABEL[k] ?? k}`);
}
lines.push("");

const blocked = claims.filter((c) => c.availability === "blocked-external");
if (blocked.length) {
  lines.push("### Blocked on something engineering cannot resolve");
  lines.push("");
  lines.push(
    "These need a signature, counsel, or a third party. They are not defects and cannot be " +
      "closed by writing code.",
  );
  lines.push("");
  for (const c of blocked) {
    lines.push(`- **${c.id}** — ${c.claim}`);
    lines.push(`  - Owner: ${c.owner} · review by ${c.reviewBy}`);
    if (c.qualification) lines.push(`  - ${c.qualification}`);
  }
  lines.push("");
}

lines.push("## Claims");
lines.push("");

for (const [category, rows] of [...byCategory.entries()].sort()) {
  lines.push(`### ${category[0].toUpperCase()}${category.slice(1)}`);
  lines.push("");
  lines.push(
    "| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |",
  );
  lines.push("|---|---|---|---|---|---|---|---|---|");
  for (const c of rows) {
    lines.push(
      `| \`${c.id}\` | ${esc(c.claim)} | ${c.where.map((w) => `\`${w}\``).join(" ")} | ` +
        `**${AVAILABILITY_LABEL[c.availability]}** | ${c.evidenceRepo} | \`${c.evidenceCommit}\` | ` +
        `${c.owner} | ${c.lastVerified} | ${c.reviewBy} |`,
    );
  }
  lines.push("");
  for (const c of rows) {
    lines.push(`<details><summary><code>${c.id}</code> — evidence and limits</summary>`);
    lines.push("");
    lines.push("**Evidence**");
    lines.push("");
    for (const e of c.evidence) lines.push(`- ${e}`);
    if (c.qualification) {
      lines.push("");
      lines.push(`**Qualification that must travel with this claim:** ${c.qualification}`);
    }
    lines.push("");
    lines.push("</details>");
    lines.push("");
  }
}

lines.push("## Phrases the site may never use");
lines.push("");
lines.push(
  "Enforced by `e2e/claims.spec.ts` against the rendered text of every route. A negative " +
    "statement on the trust page (\"separation of duties: not supported\") is allowed; a bare " +
    "marketing assertion is not.",
);
lines.push("");
lines.push("| Pattern | Why it is forbidden | Claim |");
lines.push("|---|---|---|");
for (const f of forbiddenPhrases) {
  lines.push(`| \`${esc(f.phrase.source)}\` | ${esc(f.because)} | \`${f.claimId}\` |`);
}
lines.push("");
lines.push("### Pilot-relationship phrasings");
lines.push("");
lines.push(
  "The Fall 2026 pilot is verbally agreed and **not contracted**, so nothing may present it as " +
    "settled or imply university endorsement. Governed by `C-021`.",
);
lines.push("");
for (const p of forbiddenPilotPhrases) lines.push(`- \`${esc(p.source)}\``);
lines.push("");

lines.push("## Revalidating");
lines.push("");
lines.push("1. Re-read the evidence path in the deploying repo at its current commit.");
lines.push("2. Update `evidenceCommit` and `lastVerified` in `src/lib/claims.ts`.");
lines.push("3. Run `npm run claims:build` and `npm run test:claims`.");
lines.push(
  "4. If the capability changed, fix the site copy in the same change. A register that lags " +
    "the site is worse than none, because it looks like diligence.",
);
lines.push("");

const out = lines.join("\n");
writeFileSync(join(outDir, "PUBLIC-CLAIMS-REGISTER.md"), out);
console.log(
  `Wrote docs/PUBLIC-CLAIMS-REGISTER.md — ${claims.length} claims, ` +
    `${forbiddenPhrases.length} forbidden phrases, ${out.length} chars`,
);
