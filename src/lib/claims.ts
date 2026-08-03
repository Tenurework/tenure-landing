/**
 * PUBLIC CLAIMS REGISTER — structured source.
 *
 * Every material claim the public site makes about the product, the pilot, the
 * company or its security posture has a row here, with the commit it was
 * verified against and the file that proves it.
 *
 * This is the machine-readable source. `npm run claims:build` renders
 * docs/PUBLIC-CLAIMS-REGISTER.md from it, and `e2e/claims.spec.ts` fails the
 * build when:
 *   - a claim is `unsupported` but its phrasing appears on the site,
 *   - a claim has no evidence,
 *   - `lastVerified` is older than `reviewBy`,
 *   - a claim asserts `live` while its evidence lives only in Tenure-Parent.
 *
 * AUTHORITY ORDER (from the development bible), applied throughout:
 *   1. What the deploying repo `satvikOS/Tenure` actually runs  -> may be called live
 *   2. What `satvikOS/Tenure-Parent` runs                       -> "built, pending cutover" ONLY, and only if said explicitly
 *   3. Signed customer/pilot evidence                           -> may be called a pilot/partnership
 *   4. Architecture docs, roadmaps, ADRs, TODOs                 -> intent, never capability
 */

export type Availability =
  /** Running in the deployed application today. */
  | "live"
  /** Live, and a test asserts it on every build. */
  | "ci-verified"
  /** Implemented in Tenure-Parent but NOT in the deploying repo. Must be labelled. */
  | "built-pending-cutover"
  /** A target for the pilot, not a measured outcome. */
  | "pilot-target"
  /** Decided and specified. Not built. */
  | "roadmap"
  /** Does not exist. Listed so the site never implies it does. */
  | "unsupported"
  /** Cannot be resolved by engineering — needs a signature, counsel, or a third party. */
  | "blocked-external";

export type Category =
  | "product"
  | "customer"
  | "security"
  | "ai"
  | "integration"
  | "compliance"
  | "metric"
  | "roadmap";

export type Claim = {
  id: string;
  /** The claim in normalized form — what the site asserts, not the exact prose. */
  claim: string;
  /** Routes/components where it appears. */
  where: string[];
  category: Category;
  /** Which repository proves it. */
  evidenceRepo: "Tenure" | "Tenure-Parent" | "tenure-landing" | "external" | "none";
  /** Commit the evidence was verified at. */
  evidenceCommit: string;
  /** Exact implementation and test references. */
  evidence: string[];
  availability: Availability;
  /** Limits that MUST travel with the claim wherever it appears. */
  qualification?: string;
  owner: string;
  lastVerified: string;
  reviewBy: string;
};

const TENURE = "819aec0e";
// Parent commit retained for provenance; no claim currently sources evidence from it,
// because nothing on the site may cite Parent-only capability as live.
// const PARENT = "1c03db8f";
const VERIFIED = "2026-08-02";
const REVIEW = "2026-11-02";

export const claims: Claim[] = [
  /* ------------------------------------------------------------ product --- */
  {
    id: "C-001",
    claim:
      "Access attaches to the durable seat, not the person: an incoming officer gets read-only access before their term begins, and an outgoing one keeps the record but loses access.",
    where: ["/", "/product", "/trust"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/rbac.ts:82-96 (canViewOrg allows SHADOW or ACTIVE)",
      "apps/web/src/lib/rbac.ts:133-140 (canContribute requires ACTIVE)",
      "apps/web/src/lib/memory.ts:19-22 (shadow holder sees the seat's cards)",
      "apps/web/src/lib/rbac.test.ts:68-105, memory.test.ts:40-47",
    ],
    availability: "ci-verified",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-002",
    claim:
      "The handoff packet is assembled from the record itself — seats, current and previous holders, open approvals, deadlines and budget position — rather than written by the outgoing officer.",
    where: ["/", "/product", "/pilot"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/app/(app)/orgs/[slug]/handoff/page.tsx:44-95 (pure DB assembly)",
      "apps/web/e2e/handoff.spec.ts:7-31",
    ],
    availability: "ci-verified",
    qualification:
      "Contains no AI. Do not describe the handoff as AI-generated or AI-written; the page imports no model code.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-005",
    claim:
      "Every approval decision permanently records who decided, the seat they held at that moment, what the request moved from and to, and whether someone acted on another seat's behalf.",
    where: ["/", "/product", "/trust"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/app/(app)/approvals/actions.ts (actorRoleContext written per step)",
      "apps/web/src/app/(app)/approvals/[id]/page.tsx:336 (rendered to users)",
    ],
    availability: "live",
    qualification:
      "The stored policySnapshot is a thin flag object and is never read back. Do NOT claim the product can 'prove the rules in force' or reconstruct a policy version.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-006",
    claim: "A two-gate approval chain across seven request types.",
    where: ["/", "/product", "site.ts metrics"],
    category: "metric",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/approvals.ts:7-13,84-91 (PENDING_PRESIDENT, PENDING_OSE)",
      "apps/web/prisma/schema.prisma:359-377 (ApprovalType x7, ApprovalStatus x7)",
    ],
    availability: "live",
    qualification:
      "Two GATES, seven TYPES — not six steps, and there is no Advisor gate. A president's own request skips gate one.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-011",
    claim:
      "History cannot be deleted: a seat carrying assignments, holdings or knowledge refuses deletion and must be retired; an active assignment is revoked to alumni rather than removed.",
    where: ["/", "/trust", "site.ts metrics"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/app/(app)/admin/actions.ts:162-263 (adminRemoveAssignment revokes to ALUMNI)",
      "apps/web/src/app/(app)/admin/actions.ts:314-338 (adminDeleteSeat refuses when history exists)",
    ],
    availability: "live",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-013",
    claim:
      "Two-party administrative succession: the outgoing administrator keeps authority until the named successor accepts, then the grant and step-down happen together.",
    where: ["/trust", "/product"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/prisma/schema.prisma:894-928 (RoleTransfer)",
      "apps/web/src/app/(app)/admin/actions.ts:532-805",
      "apps/web/e2e/governance.spec.ts",
    ],
    availability: "ci-verified",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-017",
    claim:
      "An administration console with sixteen named capabilities across three strictly nested staff tiers, where navigation follows the capabilities the seat holds.",
    where: ["/", "/product", "/pilot", "/trust"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/admin/capabilities.ts (16 capabilities; Director 16 / Staff 5 / Advisor 1)",
      "apps/web/src/lib/admin/guard.ts:63 (requireCapability audits allow AND deny)",
      "apps/web/e2e/admin-console.spec.ts",
    ],
    availability: "ci-verified",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-019",
    claim:
      "Approvals show how long they have sat in a gate (flagged at three and six days), and an approver can name a backup whose decisions are recorded as made on their behalf.",
    where: ["/product", "/trust"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/approvals-sla.ts (3-day amber / 6-day red, calendar days)",
      "apps/web/src/lib/delegation.ts",
      "apps/web/e2e/delegation.spec.ts",
    ],
    availability: "ci-verified",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-020",
    claim: "Six of the office's handbooks are transcribed as structured policies with their source document named.",
    where: ["/product"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: ["apps/web/src/lib/policies.ts (6 policies)", "apps/web/e2e/policies.spec.ts"],
    availability: "live",
    qualification:
      "policyText() has zero callers and policies are NOT in the AI corpus. Do not imply Tenure AI can answer policy questions.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /* ----------------------------------------------------------- security --- */
  {
    id: "C-003",
    claim:
      "Multi-tenant isolation is enforced at the query layer by the database client itself, not by convention at each call site.",
    where: ["/", "/trust"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/tenancy/extension.ts:52 (Prisma client extension)",
      "infrastructure/terraform/ecs.tf:191 (TENANCY_ENFORCE=true in production)",
      ".github/workflows/ci.yml:224",
      "apps/web/src/lib/tenancy/isolation.itest.ts (real PostgreSQL, cross-tenant cases)",
    ],
    availability: "ci-verified",
    qualification:
      "NEVER call this PostgreSQL row-level security — no CREATE POLICY exists. 15 of 39 models carry institutionId; the other 24 are registered as not independently enforceable at the query layer.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-004",
    claim:
      "An append-only audit trail records both allows and denials; audit rows are only ever created, never updated or deleted.",
    where: ["/", "/trust"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/prisma/schema.prisma:872-891 (AuditEvent)",
      "apps/web/src/lib/admin/guard.ts:63 (audits both outcomes)",
      "37 auditEvent.create sites; zero update/delete/upsert in application code",
    ],
    availability: "ci-verified",
    qualification:
      "Coverage is 49 of 63 server actions (78%), NOT 100%. Messaging, feed, profile and resource writes are unaudited, and AI/search routes write no audit row. There is no hash, prevHash, signature or checksum column — never say hash-chained, tamper-proof, cryptographically immutable or WORM.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-016",
    claim:
      "The database and uploaded documents are encrypted at rest, and documents are served only through signed links that expire in ten minutes.",
    where: ["/trust", "/privacy"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "infrastructure/terraform/rds.tf:35 (storage_encrypted = true)",
      "infrastructure/terraform/s3.tf:15 (sse_algorithm = \"aws:kms\")",
      "apps/web/src/lib/s3.ts:47,61 (getSignedUrl, expiresIn 600)",
    ],
    availability: "live",
    qualification:
      "Keys are AWS-managed. There is no customer-managed KMS key and no BYOK. The exports bucket has no explicit encryption block.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-024",
    claim: "Separation of duties on approvals (a requester cannot approve their own request).",
    where: ["/trust (stated as NOT supported)"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "packages/ is empty in the deploying repo; notOwnRequest/notOwnReimbursement return zero hits",
      "apps/web/src/lib/approvals.ts:77 (isRequester computed, never used to exclude)",
      "apps/web/src/lib/rbac.ts:68-70 (isOse true for ANY institution membership)",
    ],
    availability: "unsupported",
    qualification:
      "A user holding both an institution membership and an active president seat can submit and approve the same request end to end. The site must never claim segregation of duties.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-025",
    claim: "Institution staff are scoped to their assigned organizations.",
    where: ["/trust (stated as NOT supported)"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/rbac.ts:68-70 (isOse grants on any institution membership)",
      "OrganizationAdvisor exists but does not scope reads",
    ],
    availability: "unsupported",
    qualification:
      "Any institution account can read every organization. Do not claim 'least access by default'.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-031",
    claim: "Cryptographic tamper-evidence on the audit trail.",
    where: ["/trust (stated as NOT supported)"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: ["apps/web/prisma/schema.prisma:872-891 — no hash/signature/checksum column"],
    availability: "unsupported",
    qualification:
      "Append-only is enforced by the application, not by cryptography or write-once storage. Never say hash-chained, tamper-proof, cryptographically immutable or WORM. The honest and still-strong claim is that rows are only ever created — no update, delete or upsert against the audit table exists anywhere in the application.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-023",
    claim: "Institutional single sign-on (SAML / OIDC).",
    where: ["/trust (stated as roadmap)"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "infrastructure/terraform/variables.tf:110-113 (okta_issuer default \"\")",
      "infrastructure/terraform/ecs.tf:167-168 (AUTH_DEV_LOGIN=true, ALLOW_DEV_LOGIN_IN_PRODUCTION=true)",
      "docs/decisions/PRODUCT-DECISIONS.md PD-004 (Cognito decided, nothing implemented)",
    ],
    availability: "roadmap",
    qualification:
      "SSO is NOT deployed. Okta is dead code and Cognito is a decision with no implementation. The site must not say SSO, SAML, OIDC, MFA or 'SSO-ready'. Do not publish the specifics of the pilot sign-in mechanism.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /* ----------------------------------------------------------------- ai --- */
  {
    id: "C-007",
    claim:
      "Tenure AI answers only from records the person asking can already see, links its sources, and sends retrieved record text to Anthropic's API to compose the answer.",
    where: ["/", "/product", "/trust", "/privacy"],
    category: "ai",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/search-data.ts (loadSearchCorpus applies RBAC before ranking)",
      "apps/web/src/lib/ai.ts:35 (fetch https://api.anthropic.com/v1/messages)",
      "apps/web/src/lib/ai.ts:21 (model claude-haiku-4-5-20251001)",
    ],
    availability: "live",
    qualification:
      "PROVIDER GATE: production calls Anthropic DIRECTLY. There is no Bedrock integration in either repository. Public and legal copy must say Anthropic until the deploying repo invokes Bedrock, infrastructure and tests land, and the cutover is confirmed. One platform-wide key serves all tenants; there is no per-tenant key, quota or opt-out. Retrieval is keyword matching over five record kinds — no embeddings, no vector search, document file contents not indexed. Never say 'instant', 'never invents' or 'answers anything'.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-008",
    claim:
      "If the model is unavailable, the ranked permission-scoped sources are still returned and the interface says which happened.",
    where: ["/product", "/trust"],
    category: "ai",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/components/TenureAIPanel.tsx:74-84",
      "apps/web/src/app/(app)/search/page.tsx:71-75",
    ],
    availability: "live",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-030",
    claim: "Customer records are never used to train any model.",
    where: ["/privacy", "/trust", "components/home/AiOnboarding.tsx"],
    category: "ai",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: ["No fine-tuning or training pipeline exists anywhere in either repository"],
    availability: "blocked-external",
    qualification:
      "The 'not by us' half is verifiable in code. The 'not by Anthropic' half is a statement about a third party's contractual terms and has NOT been grounded in a reviewed agreement. Until it is, the site must attribute that half to Anthropic's terms rather than asserting it as Tenure's guarantee.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: "2026-09-02",
  },

  /* -------------------------------------------------------- integration --- */
  {
    id: "C-009",
    claim:
      "A signed per-user calendar feed that Outlook, Google Calendar and Apple Calendar can subscribe to with one link.",
    where: ["/", "/product", "/trust"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/calendar-sync.ts (IcsFeedSync implements neither push nor pull)",
      "apps/web/src/app/api/calendar/ics/[token]/route.ts",
      "apps/web/e2e/calendar.spec.ts:281",
    ],
    availability: "ci-verified",
    qualification:
      "ONE-WAY ONLY. Tenure fills the calendar and does not read it back. Never imply two-way sync or an account connection.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-010",
    claim:
      "PDF, Word, Excel and PowerPoint files open inside Tenure; text files and spreadsheets can be edited in place with a save-conflict check.",
    where: ["/", "/product", "/trust"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/app/api/documents/_lib/content.ts (JSZip, xlsx, mammoth)",
      "apps/web/src/app/api/documents/.../save/route.ts (optimistic lock -> 409)",
    ],
    availability: "live",
    qualification:
      "AI summarization is gated to text/*, json, csv, xml under 200KB — it does NOT summarize PDF or Office files. Never claim documents are 'summarized by AI'.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-012",
    claim:
      "An existing budget spreadsheet can be uploaded and Tenure matches the columns however they were named, dropping subtotal rows, with a preview before anything is saved.",
    where: ["/", "/product"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/finance.ts:141-261 (scored fuzzy header matching, no-reuse allocation)",
      "apps/web/src/app/api/templates/budget/route.ts (template generated by the same code that parses it)",
    ],
    availability: "ci-verified",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-018",
    claim:
      "Deadlines published once by the office reach every organization, and reminders fire from infrastructure without anyone opening the app, once per person.",
    where: ["/product", "/pilot"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/app/api/jobs/reminders/route.ts",
      "DeliverableReminder @@unique([deliverableId,userId])",
      "infrastructure/terraform/scheduler.tf (EventBridge cron(0 13 * * ? *))",
      "apps/web/e2e/deliverables.spec.ts",
    ],
    availability: "ci-verified",
    qualification:
      "Delivery is IN-APP ONLY. All three Delivery writes hardcode channel 'in_app'; there is no SES, nodemailer or web-push anywhere. Never claim email or push delivery.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-029",
    claim: "Connectors to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord.",
    where: ["/trust (stated as NOT supported)"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "Repo-wide grep for googleapis|slack.com|api.notion|api.dropbox|discord.com|zoom.us|api.box.com|graph.microsoft|oauth2 returns ZERO hits",
      "No integration framework, no public API, no webhooks",
    ],
    availability: "unsupported",
    qualification:
      "No vendor logo may appear on the site unless connector code and an end-to-end test exist. Importing a file a vendor produced is not an integration.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-028",
    claim: "Self-service bulk export of an organization's record.",
    where: ["/trust (roadmap)", "/privacy (manual, on request)"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: ["20 API routes, none an export; no exportAll or bulk CSV path"],
    availability: "roadmap",
    qualification:
      "Never say 'export everything, anytime'. The privacy page may offer a manual, human-fulfilled export on request, which is accurate.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /* ------------------------------------------------------------- metric --- */
  {
    id: "C-014",
    claim: "26 organizations and 209 seats modelled from the office's own leadership roster.",
    where: ["/", "site.ts metrics", "/pilot"],
    category: "metric",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/scripts/roster-data.sample.mjs -> 26 clubs, 209 seats, 106 filled, 103 vacant, 19 advisors",
      "apps/web/scripts/roster-source.mjs:39-62",
    ],
    availability: "live",
    qualification:
      "These are structural counts from the seeded model, not a count of active users. Never present them as customers, users or adoption.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-015",
    claim: "132 end-to-end tests and 292 unit tests run on every build.",
    where: ["/", "site.ts metrics", "/pilot"],
    category: "metric",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "28 e2e spec files containing 132 test() cases",
      "23 .test.* + 2 .itest.ts containing 292 it()/test() cases",
    ],
    availability: "live",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /* ------------------------------------------------------ customer/legal --- */
  {
    id: "C-021",
    claim: "A Fall 2026 pilot with Simon's Office of Student Engagement.",
    where: ["/", "/pilot", "/story"],
    category: "customer",
    evidenceRepo: "external",
    evidenceCommit: "n/a",
    evidence: [
      "Verbal agreement only, confirmed by the site owner on 2026-08-02. NO written or signed commitment exists.",
    ],
    availability: "blocked-external",
    qualification:
      "MUST be described as planned or proposed. Forbidden: 'partner', 'customer', 'sponsor', 'is rolling out', 'will deploy', or any implication of completed procurement or university endorsement. Upgrade to 'live' only when a signed document exists and is referenced here.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: "2026-09-02",
  },
  {
    id: "C-022",
    claim:
      "Display of the Simon Business School / University of Rochester and Startup Wednesday marks.",
    where: ["components/site/SupporterStrip.tsx", "/", "/story"],
    category: "customer",
    evidenceRepo: "external",
    evidenceCommit: "n/a",
    evidence: [
      "Written permission for both marks confirmed by the site owner on 2026-08-02.",
    ],
    availability: "live",
    qualification:
      "Marks indicate origin and support only. They must never be captioned in a way that implies customership, sponsorship of the product, or endorsement.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-026",
    claim: "SOC 2.",
    where: ["/trust (roadmap)"],
    category: "compliance",
    evidenceRepo: "none",
    evidenceCommit: "n/a",
    evidence: [
      "No controls, evidence artifacts or policy documents exist in infrastructure/ or .github/",
    ],
    availability: "roadmap",
    qualification:
      "'Roadmap' only. Never 'compliant', 'certified', 'readiness', 'in progress', or 'controls operating'.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-027",
    claim: "FERPA-conscious handling of education records.",
    where: ["/privacy", "/trust"],
    category: "compliance",
    evidenceRepo: "none",
    evidenceCommit: "n/a",
    evidence: [
      "FERPA appears in zero lines of application code in either repository",
      "Record-level classification for education-record policy is not built",
    ],
    availability: "blocked-external",
    qualification:
      "Aspirational only, and NOT yet reviewed by counsel. Never 'FERPA compliant' or 'FERPA aligned'. Must always be accompanied by a statement that it is intent rather than a compliance answer.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: "2026-09-02",
  },
  {
    id: "C-032",
    claim: "The legal entity operating Tenure.",
    where: ["/privacy", "/terms"],
    category: "compliance",
    evidenceRepo: "external",
    evidenceCommit: "n/a",
    evidence: [
      "No entity has been formed as of 2026-08-02, confirmed by the site owner.",
    ],
    availability: "blocked-external",
    qualification:
      "Privacy and Terms must not name an Inc./LLC that does not exist. 'Tenure' is used as a trading name and both documents carry a notice that they are founder-drafted and not counsel-reviewed.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: "2026-09-02",
  },
];

/** Phrases that may never appear in public copy, with the claim that forbids them. */
export const forbiddenPhrases: { phrase: RegExp; because: string; claimId: string }[] = [
  { phrase: /\bFERPA[- ](compliant|aligned|certified)\b/i, because: "No FERPA controls exist", claimId: "C-027" },
  { phrase: /\bSOC ?2\b(?!.{0,40}\broadmap\b)/i, because: "SOC 2 is roadmap only", claimId: "C-026" },
  { phrase: /\brow[- ]level security\b/i, because: "Tenancy is query-layer, not Postgres RLS", claimId: "C-003" },
  { phrase: /\bhash[- ]chain(ed)?\b/i, because: "AuditEvent has no hash column", claimId: "C-004" },
  { phrase: /\btamper[- ]proof\b/i, because: "No cryptographic tamper-evidence", claimId: "C-031" },
  // Added after the adversarial review: four personas independently flagged the
  // home page calling the audit trail "immutable" while /trust warns buyers to
  // interrogate that exact word. The ratchet only blocked "tamper-proof" and
  // "hash-chained", so it walked straight past it.
  { phrase: /\bimmutab(le|ility)\b/i, because: "Append-only is application-enforced; there is no hash chain, signature or checksum", claimId: "C-031" },
  { phrase: /\bask(ing)? anything\b/i, because: "Retrieval covers five record kinds; finance, people and file contents are excluded", claimId: "C-007" },
  { phrase: /\bpolicy v[0-9]+\b/i, because: "policySnapshot has no version and is never read back", claimId: "C-005" },
  { phrase: /\bdays,? not a semester\b/i, because: "Nothing measures onboarding duration", claimId: "C-014" },
  { phrase: /\bnothing leaves your tenant\b/i, because: "Record text is sent to Anthropic", claimId: "C-007" },
  { phrase: /\banswers? anything\b/i, because: "Retrieval is keyword matching over five record kinds", claimId: "C-007" },
  { phrase: /\bnever (invents|hallucinates)\b/i, because: "Grounding is prompt-instructed, not verified", claimId: "C-007" },
  { phrase: /\b100% of actions\b/i, because: "Audit coverage is 49/63 server actions", claimId: "C-004" },
  { phrase: /\bexport everything,? anytime\b/i, because: "There is no bulk export path", claimId: "C-028" },
  { phrase: /\bseparation of duties\b/i, because: "No SoD control exists", claimId: "C-024" },
  { phrase: /\bleast[- ]access\b/i, because: "Any institution member can read every organization", claimId: "C-025" },
  { phrase: /\btwo[- ]way (sync|calendar)\b/i, because: "The ICS feed is one-way", claimId: "C-009" },
  { phrase: /\bsummarized by AI\b/i, because: "Summarization excludes PDF and Office files", claimId: "C-010" },
  { phrase: /\bBedrock\b/i, because: "Production calls Anthropic directly; no Bedrock exists", claimId: "C-007" },
  { phrase: /\bsingle sign-on\b(?!.{0,60}\b(roadmap|not deployed|planned)\b)/i, because: "SSO is not deployed", claimId: "C-023" },
];

/** Phrases that overstate the pilot relationship. Governed by C-021. */
export const forbiddenPilotPhrases: RegExp[] = [
  /Office of Student Engagement[^.]{0,40}\bis (rolling out|deploying|standing up)\b/i,
  /\b(our|a) (university )?partner\b/i,
  /\bsponsored by\b/i,
  /\bin partnership with\b/i,
];
