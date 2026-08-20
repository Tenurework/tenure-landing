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
  /**
   * Implemented but not reachable by a user. Two shapes qualify, and both must
   * be labelled: code that lives only in Tenure-Parent, and code that IS in the
   * deploying repo but that no product surface calls yet — the Slack connector
   * is the second kind. Never describable as available.
   */
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

// Re-pinned 2026-08-19 from 819aec0e, 78 commits back. Three claims below were
// stale rather than wrong-at-the-time: the AI provider moved to Bedrock, Cognito
// stopped being a decision and became the sign-in path, and a Slack connector
// landed under a row that says no connector exists. A register that is not
// re-pinned degrades into a record of what used to be true.
const TENURE = "84e61dcf";
// Parent commit retained for provenance; no claim currently sources evidence from it,
// because nothing on the site may cite Parent-only capability as live.
// const PARENT = "1c03db8f";
const VERIFIED = "2026-08-19";
const REVIEW = "2026-11-19";

export const claims: Claim[] = [
  /* ------------------------------------------------------------ product --- */
  {
    id: "C-001",
    claim:
      // Phrased so the SEAT is the subject of "keeps". Written the other way round —
      // "an outgoing one keeps the record" — the sentence says the departing student
      // retains the organization's record, which is what /privacy and /terms exist to
      // rule out.
      "Access attaches to the durable seat, not the person: an incoming officer gets read-only access before their term begins, and when a term ends the record stays on the seat while the outgoing officer’s access does not.",
    where: ["/", "/product", "/trust"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/rbac.ts:82-96 (canViewOrg allows SHADOW or ACTIVE)",
      "apps/web/src/lib/rbac.ts:133-140 (canContribute requires ACTIVE)",
      "apps/web/src/lib/memory.ts:19-22 (shadow holder sees the seat’s cards)",
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
      "Every approval decision permanently records who decided, the seat they held at that moment, what the request moved from and to, and whether someone acted on another seat’s behalf.",
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
      "Two GATES, seven TYPES — not six steps, and there is no Advisor gate. A president’s own request skips gate one.",
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
    claim: "Six of the office’s handbooks are transcribed as structured policies with their source document named.",
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
      "NEVER call this PostgreSQL row-level security — no CREATE POLICY exists. 22 of 41 models carry institutionId; the rest are registered either platform-global by design or not independently enforceable at the query layer. Spelled-out numerals are deliberate — a digit form would create a second fraction that the travel rule would then police on every route. RECOUNT ON EVERY RE-PIN. The previously published fraction was three models and two schema entries out of date, so the site understated its own isolation coverage. The authoritative source is the LENGTH OF THE TENANT_SCOPED array in apps/web/src/lib/tenancy/registry.ts, against the count of `^model ` in apps/web/prisma/schema.prisma. Count the array, never quote prose about it: that file's own header sentence was itself stale at the same commit. NOTE FOR ANYONE EDITING THIS TEXT — claims.spec.ts extracts every `N of M` in this field and requires it on every route in `where`, so a superseded figure must never be written here as a literal.",
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
      "apps/web/src/lib/admin/guard.ts:63-76 (requireCapability writes the row with outcome ALLOW or DENY before it throws; 19 of 21 admin actions route through it)",
      "apps/web/e2e/audit.spec.ts (OSE sees a filterable audit log)",
      "zero update/delete/upsert against the audit table in application code",
    ],
    availability: "ci-verified",
    // The "49 of 63 (78%)" figure did not survive a recount and has been removed
    // from here and from every public surface. Three methods over the deploying
    // repo at 819aec0e produced three different answers, and the exclusion list was
    // wrong on its own terms: resources/actions.ts routes both writes through an
    // audited helper in resources-data.ts, and the document-summary path writes a
    // Document.Summarized row. Publishing a precise fraction again requires a count
    // GENERATED in the deploying repo — the bible forbids a hardcoded metric with no
    // generated source, and this is exactly why.
    qualification:
      "Coverage is PARTIAL and no fraction may be published until a count is generated in the deploying repo. Verified action-by-action: administrative actions are audited through the capability guard, including denials; approvals, finance, documents, members, memory, delegation and resource writes append rows. Messaging, activity-feed and profile writes do not, and search queries are not recorded — of the AI paths only document summarization is. Never say 100%. There is no hash, prevHash, signature or checksum column — never say hash-chained, tamper-proof, cryptographically immutable or WORM.",
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
      // s3.tf:15 sets the bucket DEFAULT to aws:kms, but uploadDocument passes
      // ServerSideEncryption "AES256" on every PutObject, which overrides the bucket
      // default per object. Documents actually land under SSE-S3. The public claim
      // ("encrypted at rest, AWS-managed keys") holds either way, but the citation
      // misdescribed the mechanism it was offered as proof of.
      "infrastructure/terraform/s3.tf:15 (bucket default sse_algorithm = \"aws:kms\")",
      "apps/web/src/lib/s3.ts:31 (PutObject ServerSideEncryption \"AES256\" — overrides the bucket default; both are AWS-managed)",
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
    id: "C-033",
    claim: "All traffic is redirected to HTTPS at the edge, with a TLS 1.2 minimum.",
    where: ["/trust"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "infrastructure/terraform/cloudfront.tf:54,81,113 (viewer_protocol_policy = redirect-to-https)",
      "infrastructure/terraform/cloudfront.tf:124 (minimum_protocol_version = TLSv1.2_2021)",
    ],
    availability: "live",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-034",
    claim:
      "The database takes automated daily backups with deletion protection and a final snapshot on teardown; the document bucket has object versioning.",
    where: ["/trust"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "infrastructure/terraform/rds.tf:48-49 (backup_retention_period = 1, window 03:00-04:00)",
      "infrastructure/terraform/rds.tf:53-54 (deletion_protection = true, skip_final_snapshot = false)",
      "infrastructure/terraform/s3.tf:6-8 (aws_s3_bucket_versioning, status Enabled)",
    ],
    availability: "live",
    qualification:
      "Retention is ONE DAY. State that number wherever backups are mentioned — an issue found on Wednesday cannot be recovered from Monday. Never describe this as a backup strategy suitable for a system of record without the number attached.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-035",
    claim: "Restore testing, a documented recovery objective, or multi-region failover.",
    where: ["/trust (stated as NOT supported)"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "No restore rehearsal, RTO/RPO document or second region exists in infrastructure/terraform",
    ],
    availability: "unsupported",
    qualification:
      "Backups exist; the process for using them under pressure does not. Do not imply disaster recovery from the existence of backups.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-036",
    claim:
      "The subprocessors are AWS (hosting, database, documents, and Bedrock for model inference), Anthropic (model provider on the fallback path) and Vercel (this website only).",
    where: ["/privacy", "/trust"],
    category: "compliance",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "infrastructure/terraform (ECS, RDS, S3, CloudFront — AWS US regions)",
      "apps/web/src/lib/ai.ts:35 (Anthropic)",
      // Calendly was removed from the site entirely on 2026-08-20 — the embed
      // first, then the outbound anchor, then the CSP allowance that outlived
      // both — so it is no longer a subprocessor and must not be listed as one.
      "tenure-landing: Vercel response headers; no third-party origin is permitted by the CSP on any route",
    ],
    availability: "live",
    qualification:
      "This list must stay complete. Adding anything that touches organizational records requires updating /privacy and notifying active organizations before it starts processing.",
    owner: "Almamy Diaby",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /**
   * Registered 2026-08-03. The home page has always rendered "Force approve ·
   * Force reject · both gates bypassed" and an `approval.force_approved` audit
   * line, but neither /trust nor /pilot mentioned an override — the word appeared
   * zero times on both — while each listed the two LESSER approval bypasses. The
   * two pages that exist to tell a security reviewer what to worry about omitted
   * the highest-privilege action in the product. No claim row covered it, so no
   * ratchet could have noticed.
   */
  {
    id: "C-037",
    claim:
      "A Director-tier capability can force-approve or force-reject any request in the institution, bypassing both approval gates. Every use is audited.",
    where: ["/", "/trust", "/pilot"],
    category: "security",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/admin/capabilities.ts:118-123 (approval.override, minRole OSE_DIRECTOR)",
      "apps/web/src/lib/admin/guard.ts:63-76 (requireCapability writes an AuditEvent with outcome ALLOW or DENY before it throws)",
    ],
    availability: "live",
    qualification:
      "Nothing prevents the override and no second party is required — there is no four-eyes control on it. It must never be described as constrained, only as audited. Wherever the home page’s console mock shows it, /trust must carry the limit.",
    owner: "Satvik Adyanthaya",
    lastVerified: "2026-08-03",
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
      "infrastructure/terraform/variables.tf (okta_issuer default \"\" — the OAuth provider is still unconfigured)",
      "apps/web/src/lib/auth.ts (three providers: cognito, okta, dev-login — okta registers only with an issuer)",
      // Cognito stopped being a decision. It is the registered credentials
      // provider, and it is what makes the old "no per-user secret" line false.
      "apps/web/src/lib/auth/cognito.ts (ADMIN_USER_PASSWORD_AUTH against the pool, server-side)",
      "infrastructure/terraform/cognito.tf (password_policy minimum_length 12, all four classes; software_token_mfa_configuration; verified_email recovery)",
      "infrastructure/terraform/variables.tf (cognito_mfa_mode default OPTIONAL — available, not enforced)",
      "apps/web/src/lib/auth/identity-link.ts (links on the immutable subject, never on email)",
      "infrastructure/terraform/dev-login-gate.tf (the interim shared-passphrase path still provisioned alongside it)",
    ],
    availability: "roadmap",
    qualification:
      // WHAT CHANGED, AND WHAT DID NOT. Institutional SSO is still not deployed —
      // Okta registers only when an issuer is configured and none is. But the two
      // sentences this row used to force onto /trust are false at the pinned commit:
      // Cognito IS implemented, and TOTP MFA IS available. The site said "there is
      // no MFA" and "access is not gated on a secret held by one person", which
      // understates the product to an institution assessing it.
      //
      // MFA may be described as AVAILABLE, never as ENFORCED: cognito_mfa_mode
      // defaults to OPTIONAL, deliberately, and calling that "MFA protected" would
      // be the same overstatement in the other direction.
      //
      // C-023 still holds on ONE point: the interim shared-passphrase provider is
      // still provisioned beside Cognito, and its mechanism stays unpublished. The
      // site may say authentication is per-user and that an interim path exists
      // during the pilot; it may not say the shared path is gone, and it may not
      // describe how it works.
      "SSO/SAML/OIDC is NOT deployed and must stay 'roadmap'. Cognito IS deployed: per-user email and password against the pool, 12-character minimum with upper, lower, number and symbol, TOTP multi-factor AVAILABLE BUT NOT ENFORCED (cognito_mfa_mode defaults to OPTIONAL), recovery to a verified email only. Authentication is separate from membership — a Cognito account's existence is not access; the roster decides. Never say 'SSO', 'SSO-ready', 'MFA enforced', 'MFA required' or 'passwordless'. Do not publish the mechanism of the interim shared-passphrase provider, which is still provisioned; do not claim it has been removed.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /* ----------------------------------------------------------------- ai --- */
  {
    id: "C-007",
    claim:
      "Tenure AI answers only from records the person asking can already see, links its sources, and sends retrieved record text to Amazon Bedrock — running an Anthropic model — to compose the answer.",
    where: ["/", "/product", "/trust", "/privacy"],
    category: "ai",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/search-data.ts (loadSearchCorpus applies RBAC before ranking)",
      "apps/web/src/lib/ai/provider.ts (resolveAiProvider — Bedrock when a region is set, direct API as fallback)",
      "apps/web/src/lib/ai/bedrock.ts (completeViaBedrock)",
      "apps/web/src/lib/ai/provider.test.ts (precedence and model-id translation)",
      "apps/web/src/lib/ai/bedrock.test.ts",
      "infrastructure/terraform/bedrock.tf (bedrock_enabled defaults true; bedrock_model_id anthropic.claude-haiku-4-5)",
      "infrastructure/terraform/ecs.tf (AI_PROVIDER = bedrock when bedrock_enabled; ANTHROPIC_MODEL from bedrock_model_id)",
      "apps/web/src/lib/ai.ts (fetch https://api.anthropic.com/v1/messages — the fallback path)",
      // Three call sites reach the API, not one. The register previously cited only
      // the first, and /privacy disclosed only the first.
      "apps/web/src/lib/ai.ts:82-97 (draftText — sends the user’s Draft Assist instruction)",
      "apps/web/src/lib/ai.ts:99-112 (summarizeDocument — sends content.slice(0, 24_000) of the file body)",
      "apps/web/src/lib/search.ts:21-41 (tokenize + scoreDoc: terms.every, AND semantics)",
      "apps/web/src/lib/ai/quota.ts (DEFAULT_DAILY_REQUEST_LIMIT 40, DEFAULT_DAILY_TOKEN_LIMIT 120_000, per person per day)",
    ],
    availability: "live",
    qualification:
      "PROVIDER GATE, RELEASED 2026-08-19. The gate this row used to carry required three things before copy could say Bedrock — the deploying repo invoking it, infrastructure, and tests. All three were present from cba5e20e and remain so at the pinned commit, so the copy moved with them. Bedrock is preferred and the direct Anthropic API remains the fallback, so BOTH must stay disclosed: an environment with a region runs on Bedrock, one with only a key keeps calling api.anthropic.com, and one with neither degrades to sources-only. Never write that record text stays inside AWS — the fallback path leaves it. The model is an Anthropic model either way; do not describe Parent’s reviewed-model allowlist, which does not deploy. One platform-wide key serves all tenants; there is no per-tenant key, per-tenant quota or opt-out. There IS a PER-PERSON daily ceiling — 40 requests and 120,000 tokens, both overridable by environment — and it must be disclosed wherever the absence of a per-tenant quota is: saying only that no quota exists reads as unlimited. THREE outbound flows, all of which must be disclosed together: retrieved records at question time, full text-document contents on an explicit summary request, and the Draft Assist instruction. RETRIEVAL IS CONJUNCTIVE: every query token longer than one character must appear literally in a single record, with no stemming, synonyms or stopword removal — so full-sentence questions typically return nothing, and any rendered demo must use keyword-shaped queries against the five indexed kinds. Citation is prompt-instructed and unverified, and the route calls the model even with zero sources: never write 'every answer cites its sources'. Never say 'instant', 'never invents' or 'answers anything'.",
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
      // Was apps/web/src/components/TenureAIPanel.tsx — a path that does not exist.
      // The ratchet only regex-matched the SHAPE of a path and never resolved one,
      // so a dead citation passed green.
      "apps/web/src/components/ai/TenureAIPanel.tsx:73-85",
      // search/page.tsx gates its "answer generation was unavailable" notice behind
      // aiConfigured(), so with no API key set it cannot distinguish an unavailable
      // model from a query that matched nothing. Only the panel satisfies the claim.
      "apps/web/src/app/(app)/search/page.tsx:71-75 (partial — see qualification)",
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
      "The 'not by us' half is verifiable in code. The 'not by Anthropic' half is a statement about a third party’s contractual terms and has NOT been grounded in a reviewed agreement. Until it is, the site must attribute that half to Anthropic’s terms rather than asserting it as Tenure’s guarantee.",
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
      // The literal "..." segment resolved to nothing. Real path, brackets included:
      "apps/web/src/app/api/documents/[id]/save/route.ts (optimistic lock -> 409)",
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
      // "ci-verified" means a test asserts it on every build, and this row named no
      // test at all until 2026-08-03 — it passed only because the ratchet checked
      // that evidence LOOKED like a path, never that any of it was a test.
      "apps/web/e2e/finance.spec.ts",
      "apps/web/src/lib/finance.test.ts",
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
      // Was apps/web/e2e/deliverables.spec.ts, whose 5 tests are all about how
      // deadlines render on the calendar — none exercises the reminder job, the
      // bearer gate or the once-per-person guarantee this claim rests on. The spec
      // that actually covers it:
      "apps/web/e2e/policies.spec.ts:77-106",
    ],
    availability: "ci-verified",
    qualification:
      // "there is no SES ... anywhere" was false and would mislead the next reviewer
      // who greps and finds it: infrastructure/terraform/ses.tf provisions a domain
      // identity, DKIM, an email identity and a configuration set, and ecs.tf:151
      // injects SES_FROM_EMAIL into the task. The public conclusion is unchanged —
      // nothing invokes any of it.
      "Delivery is IN-APP ONLY. All three Delivery writes hardcode channel 'in_app', and no application code sends email or push. SES is provisioned in Terraform (ses.tf) and SES_FROM_EMAIL is injected into the task, but nothing invokes it. Never claim email or push delivery.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    // C-029 WAS ONE ROW SAYING NO CONNECTOR EXISTS. It was true when written and
    // is false now, and its own evidence line is what proves it: the repo-wide
    // grep it cites for `slack.com` returned zero hits at 819aec0e and returns
    // five files from cba5e20e onward. Splitting it into three is the only way to keep
    // the row honest, because the three groups now have three different answers.
    id: "C-029a",
    claim: "A Slack workspace connector: OAuth install, channel routing and posting.",
    where: ["/product", "/trust"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/integrations/slack/oauth.ts (exchanges the code at https://slack.com/api/oauth.v2.access)",
      "apps/web/src/lib/integrations/slack/install.ts (signed install state; builds the slack.com/oauth/v2/authorize URL)",
      "apps/web/src/lib/integrations/slack/routing.ts (audience routing and the per-event posting quota)",
      "apps/web/src/lib/integrations/slack/post.ts",
      "apps/web/src/lib/integrations/slack/poster.ts (chat.postMessage)",
      "apps/web/src/lib/integrations/slack/verify.ts",
      "apps/web/src/lib/integrations/slack/announce.ts (the seam between the policy layer and the application)",
      "apps/web/src/app/api/integrations/slack/install/route.ts",
      "apps/web/src/app/api/integrations/slack/callback/route.ts",
      "7 unit test files: oauth.test.ts, install.test.ts, routing.test.ts, post.test.ts, poster.test.ts, verify.test.ts, announce.test.ts",
    ],
    availability: "built-pending-cutover",
    qualification:
      // The distinction that keeps this row from overselling: the code is real
      // and tested, the API routes exist, and NOTHING IN THE APPLICATION CALLS
      // announce.ts — a grep for announceEvent under apps/web/src/app returns
      // nothing. So a pilot cannot switch this on from a console today.
      "BUILT, NOT REACHABLE. The connector and its two API routes are in the deploying repo, unit-tested throughout, but no product surface calls the announce seam, so there is no console switch and no user can turn it on. Say 'built' and 'not yet in the product'; never 'available', 'live', 'supported', 'integrates with Slack' or anything in the present tense that implies a customer can use it. No Slack mark or logo may appear — C-029c's logo rule applies to every row here.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-029b",
    claim:
      "An integration catalog of 18 products, each declaring the credentials it needs, with availability computed from whether those credentials are present.",
    where: ["/product", "/trust"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/src/lib/integrations/catalog.ts (PROVIDER_CATALOG — 18 products across 13 capabilities)",
      "apps/web/src/lib/integrations/catalog.ts (providerStatus returns available | awaiting-credentials from requiredSecrets)",
      "apps/web/src/lib/integrations/catalog.test.ts",
      "apps/web/src/lib/integrations/secret-store.ts",
      "apps/web/src/lib/integrations/secret-store.test.ts",
    ],
    availability: "roadmap",
    qualification:
      // A descriptor is not a connector. The catalog says which product COULD
      // serve a capability and what key it would need; for all but Slack there
      // is no code behind it at all.
      "A CATALOG ENTRY IS NOT A CONNECTOR. For every product except Slack the catalog holds a descriptor and a list of required secret NAMES, and no connector code exists. Describing these as integrations, or as 'one key away', would be false — the key is necessary, not sufficient. The 18 may be NAMED, with their status stated in the same breath. Never render them as a logo wall.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-029c",
    claim: "Two-way sync, a public API, webhooks, or a connector to any product outside the catalog.",
    where: ["/product (stated as NOT supported)", "/trust (stated as NOT supported)"],
    category: "integration",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "No public API and no webhook surface exists under apps/web/src/app/api outside the Slack install/callback pair",
      "Repo-wide grep for googleapis|api.notion|api.dropbox|discord.com|zoom.us|api.box.com|graph.microsoft returns ZERO hits",
      "apps/web/src/lib/integrations/slack/routing.ts (posting is outbound only; nothing reads a workspace back)",
    ],
    availability: "unsupported",
    qualification:
      "No vendor logo or mark may appear anywhere on the site: a logo reads as a connector whatever the sentence under it says. Importing a file a vendor produced is not an integration. Discord is in neither the catalog nor the code. Nothing anywhere is two-way.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-038",
    claim: "Membership dues, per-member payment tracking, or any incoming-money transaction type.",
    where: ["/ (not claimed)", "/product (not claimed)"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "apps/web/prisma/schema.prisma — enum TransactionType is ALLOCATION | SPEND | REIMBURSEMENT | ADJUSTMENT; there is no income or dues member",
      "apps/web/prisma/schema.prisma — enum LedgerKind is SPEND | REIMBURSEMENT | ADJUSTMENT",
      "Repo-wide grep for dues|Dues across apps/web/src returns ZERO hits",
      "Repo-wide grep for paid|payment across apps/web/prisma/schema.prisma returns ZERO hits — no per-member payment state exists",
    ],
    availability: "unsupported",
    qualification:
      // WHY THIS ROW EXISTS AT ALL. "Dues" was named in three module descriptions
      // and rendered in the hero's ledger as "Membership dues, 28 paid, +$840" —
      // an income line with a per-member paid count, in the most-viewed
      // illustration on the site, for a data model that can represent neither.
      // It read as a feature because it sat in a list beside two things that ARE
      // features (budgets, reimbursements).
      //
      // Money entering a budget is an ALLOCATION. That is the honest word and the
      // one the mocks use now.
      "Never name dues, membership fees, donations, an appeal, a sponsorship receipt or any other INCOMING payment as something Tenure records. Money entering a budget is an ALLOCATION; money recovered is a REIMBURSEMENT. Never render a ledger row with a per-member paid count. A transaction may be described only as one of the four types the schema declares.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },
  {
    id: "C-028",
    claim: "Self-service bulk export of an organization’s record.",
    where: ["/trust (roadmap)", "/privacy (manual, on request)"],
    category: "product",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: ["23 API routes, none an export; no exportAll or bulk CSV path — recount on every re-pin"],
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
    claim: "26 organizations and 209 seats modelled from the office’s own leadership roster.",
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
    claim: "163 end-to-end tests and more than 1,100 unit tests run on every build.",
    where: ["/", "site.ts metrics", "/pilot"],
    category: "metric",
    evidenceRepo: "Tenure",
    evidenceCommit: TENURE,
    evidence: [
      "e2e spec files containing 163 test() cases",
      // The *.itest.ts files are excluded from the unit run by
      // testPathIgnorePatterns because they need a live PostgreSQL, so "runs
      // against a real database" belongs to the e2e half of the sentence only.
      "apps/web/jest.config.js (testPathIgnorePatterns excludes *.itest.ts — those need a live PostgreSQL)",
      "90 unit test files containing 1,156 declared it()/test() cases — a FLOOR, see the qualification",
    ],
    availability: "live",
    qualification:
      // HOW THESE WERE COUNTED, AND WHY THE TWO HALVES DIFFER.
      //
      // The previous figures — 132 e2e and 320 unit — were published against a
      // product commit 80-odd commits back and had drifted badly: the suites had
      // roughly tripled while the site went on advertising the old numbers, so the
      // site was understating its own engineering by a factor of three.
      //
      // The e2e half is EXACT and counted the same way it always was: grepping
      // `^\s*test\(` across apps/web/e2e/**/*.spec.ts. That method reproduces the
      // previously published 132 exactly at the commit it was published against,
      // which is what makes it trustworthy at this one.
      //
      // The unit half could NOT be produced the same way it was before. The
      // register's rule is to count by RUNNING the suite, and apps/web has no
      // installed dependencies in this checkout; installing them into the product
      // repo to publish a marketing number is not a trade worth making. So it is a
      // static count of declared cases over the files JEST REALLY COLLECTS — which is
      // apps/web/**/*.{test,spec}.{ts,tsx,mjs} minus e2e/ and *.itest.ts, per
      // apps/web/jest.config.js (moduleFileExtensions, testMatch,
      // testPathIgnorePatterns). That glob is wider than apps/web/src: it also picks
      // up apps/web/scripts/db-bootstrap.test.mjs, 13 cases a src-only count misses.
      // Static counting is CALIBRATED AGAINST
      // THE OLD RUN: at the previous pin it gives 279 where jest reported 320, an
      // undercount of about 13% caused by `.each` blocks expanding at runtime.
      //
      // 961 declared cases is therefore a floor, and "more than 950" is the honest
      // way to publish a floor. Never state a precise unit figure until someone
      // runs `cd apps/web && npx jest --ci` and pastes the total.
      "The e2e figure is exact. The unit figure is a FLOOR from a static count of declared cases, not a suite run: 1,156 declared, and the same method undercounts by ~13% against the last real run, so publish it as 'more than 1,100' and never as a precise number. Neither figure counts *.itest.ts, which needs a live PostgreSQL. Recount both on every re-pin — these drifted 3x in eighty commits.",
    owner: "Satvik Adyanthaya",
    lastVerified: VERIFIED,
    reviewBy: REVIEW,
  },

  /* ------------------------------------------------------ customer/legal --- */
  {
    id: "C-021",
    claim: "A Fall 2026 pilot with Simon’s Office of Student Engagement.",
    where: ["/", "/pilot", "/story"],
    category: "customer",
    evidenceRepo: "external",
    evidenceCommit: "n/a",
    evidence: [
      "Agreed with the office and going ahead for Fall 2026; confirmed by the site owner 2026-08-20. It is UNPAID — no commercial terms are agreed and no money changes hands.",
      "No signed procurement document exists. The deployment is real; the contract is not.",
    ],
    availability: "blocked-external",
    qualification:
      // RELAXED 2026-08-20, on the site owner's direct statement that the pilot IS
      // going ahead and the only thing missing is payment.
      //
      // The old rule forced "planned or proposed" everywhere, which produced the
      // defensive strip the owner objected to — "proposed, not contracted" under
      // every mention. That rule conflated two different facts. Whether the office
      // will USE the product is settled. Whether anyone is PAYING is not. Only the
      // second needs guarding, and guarding the first understated a real
      // deployment into a maybe.
      //
      // So: the deployment may be stated in the definite. The commercial
      // relationship may not be implied at all, because there isn't one.
      "The Fall 2026 deployment with the office MAY be stated definitely — 'first deployment', 'goes live', 'deploying in Fall 2026'. It is UNPAID and unsigned, so never imply a commercial relationship or an endorsement: forbidden are 'customer', 'client', 'partner', 'sponsor', 'sponsored by', 'in partnership with', 'contract', 'paying', 'revenue', 'ARR', and any claim the university selected, procured, endorses or recommends Tenure. Never state a number of customers. The office is where Tenure deploys first, not a reference account. If a signed agreement later exists, cite it here and this row can carry commercial language.",
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

/**
 * The knowledge-card kinds a person may actually create, mirroring
 * CreatableCardTypeEnum in the deploying repo at `apps/web/src/lib/schemas/
 * knowledge-card.ts:38-46`.
 *
 * The home page advertised "Credential" here for months. The product retired that
 * type deliberately — MemoryRecord.content is an unencrypted Json column that any
 * ACTIVE seat can write and that is indexed for search, so a card kind called
 * "Login or access info" invited people to paste passwords into a shared database,
 * against a schema comment claiming an encryption control that was never written.
 * It also omitted THREAD and BUDGET, which are creatable.
 *
 * Nothing tests a marketing tag row against a product enum unless something like
 * this exists to test it against.
 */
export const creatableCardTypes = [
  "Contact",
  "Playbook",
  "Budget",
  "Vendor",
  "Lesson",
  "Thread",
  "Deadline",
] as const;

/** Phrases that may never appear in public copy, with the claim that forbids them. */
export const forbiddenPhrases: { phrase: RegExp; because: string; claimId: string }[] = [
  // C-038: no incoming-money transaction type exists. "Dues" sat in three module
  // descriptions and in the hero ledger as a per-member paid count, for a schema
  // whose TransactionType is ALLOCATION | SPEND | REIMBURSEMENT | ADJUSTMENT.
  { phrase: /\bdues\b/i, because: "No income/dues transaction type or per-member payment state exists", claimId: "C-038" },
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
  { phrase: /\b100% of actions\b/i, because: "Audit coverage is partial and not generated; messaging, feed and profile writes append nothing", claimId: "C-004" },
  // Added this pass, each from a defect that shipped past the existing rules:
  { phrase: /\bevery answer (cites|links)\b/i, because: "Citation is prompt-instructed and unverified; the route calls the model even with zero sources", claimId: "C-007" },
  { phrase: /\bversioned\b/i, because: "Document.version is an optimistic-lock counter; there is no DocumentVersion model, history or restore", claimId: "C-010" },
  // Deliberately NOT a blanket ban on the word "credential": /terms and /trust have
  // to be able to say that pilot access is not gated on an individual credential,
  // which is the honest disclosure. What must never return is CREDENTIAL offered as
  // a knowledge-card KIND — the product retired it because MemoryRecord.content is
  // an unencrypted Json column. That is held by the card-kind test in claims.spec.ts
  // against creatableCardTypes below, not by a phrase match.
  { phrase: /\bexport everything,? anytime\b/i, because: "There is no bulk export path", claimId: "C-028" },
  { phrase: /\bseparation of duties\b/i, because: "No SoD control exists", claimId: "C-024" },
  { phrase: /\bleast[- ]access\b/i, because: "Any institution member can read every organization", claimId: "C-025" },
  { phrase: /\btwo[- ]way (sync|calendar)\b/i, because: "The ICS feed is one-way", claimId: "C-009" },
  { phrase: /\bsummarized by AI\b/i, because: "Summarization excludes PDF and Office files", claimId: "C-010" },
  { phrase: /\bsingle sign-on\b(?!.{0,60}\b(roadmap|not deployed|planned)\b)/i, because: "SSO is not deployed", claimId: "C-023" },
];

/** Phrases that overstate the pilot relationship. Governed by C-021. */
export const forbiddenPilotPhrases: RegExp[] = [
  // The deployment itself is no longer forbidden language — see C-021. What stays
  // forbidden is anything asserting a COMMERCIAL relationship or an endorsement,
  // because neither exists: the Fall 2026 deployment is unpaid and unsigned.
  /\b(our|a) (university )?partner\b/i,
  /\bsponsored by\b/i,
  /\bin partnership with\b/i,
  /\b(our|first|founding) (customer|client)s?\b/i,
  /\bpaying (customer|client|institution)s?\b/i,
  /\b(selected|chose|chosen|procured|endorse[sd]?|recommends?) (us|Tenure)\b/i,
];
