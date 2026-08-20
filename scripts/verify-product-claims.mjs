/**
 * Re-verify every claim this site makes that depends on the product repo's
 * CURRENT state, then report the commit it all holds at.
 *
 * The claims register pins an evidence commit, and `claims.spec.ts` fails when
 * the manifest was generated against a different one. During active development
 * on satvikOS/Tenure that drifts within hours — three times in one session — and
 * the temptation is to re-pin blindly to make the gate green. That is exactly
 * how a register stops meaning anything.
 *
 * So: pin only after this passes. It checks the facts, not the sha.
 *
 * Usage: node scripts/verify-product-claims.mjs [path-to-Tenure]
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repo = process.argv[2] ?? process.env.TENURE_PATH ?? join(process.cwd(), "..", "Tenure");
if (!existsSync(repo)) {
  console.error(`Tenure checkout not found at ${repo}`);
  process.exit(2);
}
const head = execFileSync("git", ["-C", repo, "rev-parse", "--short=8", "HEAD"], {
  encoding: "utf8",
}).trim();
const read = (p) => readFileSync(join(repo, p), "utf8");
const grepCount = (pattern, path) => {
  try {
    return execFileSync("git", ["-C", repo, "grep", "-c", "-i", "-E", pattern, "HEAD", "--", path], {
      encoding: "utf8",
    })
      .trim()
      .split("\n")
      .reduce((n, l) => n + Number(l.split(":").pop() || 0), 0);
  } catch {
    return 0; // git grep exits 1 on no match
  }
};

const checks = [];
const check = (id, label, fn) => {
  try {
    const r = fn();
    checks.push({ id, label, ok: r.ok, detail: r.detail });
  } catch (e) {
    checks.push({ id, label, ok: false, detail: `threw: ${e.message}` });
  }
};

const schema = read("apps/web/prisma/schema.prisma");
const registry = read("apps/web/src/lib/tenancy/registry.ts");

check("C-003", "18 of 41 models carry institutionId", () => {
  const models = schema.match(/^model \w+ \{/gm)?.length ?? 0;
  const scoped =
    registry.match(/export const TENANT_SCOPED = \[(.*?)\] as const/s)?.[1].match(/"[^"]+"/g)
      ?.length ?? 0;
  return {
    ok: models === 41 && scoped === 18,
    detail: `${scoped} of ${models} (site publishes 18 of 41)`,
  };
});

check("C-007", "AI synthesis runs on Bedrock, Anthropic API as fallback", () => {
  const provider = read("apps/web/src/lib/ai/provider.ts");
  const ecs = read("infrastructure/terraform/ecs.tf");
  return {
    ok:
      /kind:\s*"bedrock"/.test(provider) &&
      /api\.anthropic\.com/.test(read("apps/web/src/lib/ai.ts")) &&
      /AI_PROVIDER".*bedrock/s.test(ecs),
    detail: "provider.ts resolves bedrock; ai.ts keeps the direct fallback; ecs.tf sets AI_PROVIDER",
  };
});

check("C-023", "Cognito is the sign-in path, TOTP available not enforced", () => {
  const cog = read("infrastructure/terraform/cognito.tf");
  const vars = read("infrastructure/terraform/variables.tf");
  return {
    ok:
      /authenticateWithCognito/.test(read("apps/web/src/lib/auth.ts")) &&
      /minimum_length\s*=\s*12/.test(cog) &&
      /software_token_mfa_configuration/.test(cog) &&
      /default\s*=\s*"OPTIONAL"/.test(vars),
    detail: "auth.ts registers cognito; 12-char policy; TOTP block; mfa mode defaults OPTIONAL",
  };
});

check("C-029a", "Slack connector is built and NOT reachable", () => {
  const libs = execFileSync("git", ["-C", repo, "ls-tree", "-r", "--name-only", "HEAD", "--", "apps/web/src/lib/integrations/slack"], { encoding: "utf8" })
    .trim().split("\n").filter(Boolean);
  const tests = libs.filter((f) => f.endsWith(".test.ts")).length;
  const routes = execFileSync("git", ["-C", repo, "ls-tree", "-r", "--name-only", "HEAD", "--", "apps/web/src/app/api/integrations/slack"], { encoding: "utf8" })
    .trim().split("\n").filter((f) => f.endsWith("route.ts")).length;
  const callers = grepCount("announceEvent", "apps/web/src/app");
  // Assert the INVARIANT, not a headcount. The number of Slack test files is
  // guaranteed to drift — it went 6 -> 7 inside one working session — and a gate
  // that fails on healthy growth trains people to re-pin without reading. What
  // must not change is that the connector exists AND that nothing calls it: the
  // moment a caller appears, "built, not reachable" becomes false and the site
  // is understating a shipped feature.
  return {
    ok: tests >= 6 && routes === 2 && callers === 0,
    detail: `${tests} test files, ${routes} api routes, ${callers} callers of the announce seam (must be 0 — "built, not reachable")`,
  };
});

check("C-029b", "the integration catalog holds 18 products", () => {
  const cat = read("apps/web/src/lib/integrations/catalog.ts");
  const n = cat.slice(cat.indexOf("PROVIDER_CATALOG")).match(/\n {4}id: "/g)?.length ?? 0;
  return { ok: n === 18, detail: `${n} products` };
});

check("C-038", "no dues / income transaction type exists", () => {
  const dues = grepCount("\\bdues\\b", "apps/web/src");
  const types = schema.match(/enum TransactionType \{([^}]*)\}/)?.[1] ?? "";
  return {
    ok: dues === 0 && !/INCOME|DUES/i.test(types),
    detail: `${dues} "dues" hits; TransactionType = ${types.replace(/\/\/[^\n]*/g, "").split("\n").map((s) => s.trim()).filter(Boolean).join(" | ")}`,
  };
});

check("C-015", "published test counts are still a floor, not an overstatement", () => {
  /*
    Count over the files JEST REALLY COLLECTS, not over apps/web/src.
    apps/web/jest.config.js matches any file ending .spec/.test with a js, jsx,
    ts, tsx, mjs or cjs extension, anywhere under apps/web — `mjs` is in
    moduleFileExtensions — and testPathIgnorePatterns excludes only
    node_modules, .next, e2e/ and *.itest.ts. A src-only glob therefore misses
    apps/web/scripts/db-bootstrap.test.mjs — 13 cases — and the gate would then
    be proving a smaller number than the site publishes, which is the wrong way
    round for a floor.
  */
  const files = execFileSync("git", ["-C", repo, "ls-tree", "-r", "--name-only", "HEAD", "--", "apps/web"], { encoding: "utf8" }).trim().split("\n");
  const count = (sel, pat) =>
    files.filter(sel).reduce((n, f) => n + (execFileSync("git", ["-C", repo, "show", `HEAD:${f}`], { encoding: "utf8" }).match(pat)?.length ?? 0), 0);
  const collected = (f) =>
    /\.(spec|test)\.(m|c)?[jt]sx?$/.test(f) && !/^apps\/web\/e2e\//.test(f) && !/\.itest\.ts$/.test(f);
  const unit = count(collected, /^\s*(?:it|test)\s*\(/gm);
  const unitFiles = files.filter(collected).length;
  const e2e = count((f) => /^apps\/web\/e2e\/.*\.spec\.ts$/.test(f), /^\s*test\s*\(/gm);
  return {
    ok: unit > 950 && e2e === 161,
    detail: `${unit} declared unit cases across ${unitFiles} files (site: "more than 950"), ${e2e} e2e (site: 161)`,
  };
});

const failed = checks.filter((c) => !c.ok);
for (const c of checks) console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.id.padEnd(7)} ${c.label}\n        ${c.detail}`);
console.log(`\nTenure HEAD: ${head}`);
if (failed.length) {
  console.error(`\n${failed.length} claim(s) no longer hold. Fix the SITE before re-pinning.`);
  process.exit(1);
}
console.log(`All ${checks.length} product-dependent claims hold. Safe to set TENURE = "${head}".`);
