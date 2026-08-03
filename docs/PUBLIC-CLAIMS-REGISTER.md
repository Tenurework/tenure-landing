# Tenure — Public Claims Register

> **Generated file.** Source of truth is `src/lib/claims.ts`; regenerate with `npm run claims:build`.
> Edits made here are lost on the next build and are not enforced by CI.

Every material claim the public site makes about the product, the pilot, the company or its security posture. Each row records the commit the claim was verified against and the file that proves it.

## Authority order

Applied whenever sources disagree. A capability may only be described as available today on the strength of the repository that actually deploys.

| # | Source | What it can justify |
|---|---|---|
| 1 | `satvikOS/Tenure` (deploying) | May be described as live |
| 2 | `satvikOS/Tenure-Parent` (canonical dev) | Only "built, pending cutover", and only if said explicitly |
| 3 | Signed customer / pilot evidence | May be called a pilot, partnership or deployment |
| 4 | Architecture docs, roadmaps, ADRs, TODOs | Intent. Never capability |

## Status of the register

- **32** material claims tracked.
- 11 × Live in production
- 10 × Live, verified in CI
- 4 × Not supported
- 4 × BLOCKED — external
- 3 × Roadmap

### Blocked on something engineering cannot resolve

These need a signature, counsel, or a third party. They are not defects and cannot be closed by writing code.

- **C-030** — Customer records are never used to train any model.
  - Owner: Almamy Diaby · review by 2026-09-02
  - The 'not by us' half is verifiable in code. The 'not by Anthropic' half is a statement about a third party's contractual terms and has NOT been grounded in a reviewed agreement. Until it is, the site must attribute that half to Anthropic's terms rather than asserting it as Tenure's guarantee.
- **C-021** — A Fall 2026 pilot with Simon's Office of Student Engagement.
  - Owner: Almamy Diaby · review by 2026-09-02
  - MUST be described as planned or proposed. Forbidden: 'partner', 'customer', 'sponsor', 'is rolling out', 'will deploy', or any implication of completed procurement or university endorsement. Upgrade to 'live' only when a signed document exists and is referenced here.
- **C-027** — FERPA-conscious handling of education records.
  - Owner: Almamy Diaby · review by 2026-09-02
  - Aspirational only, and NOT yet reviewed by counsel. Never 'FERPA compliant' or 'FERPA aligned'. Must always be accompanied by a statement that it is intent rather than a compliance answer.
- **C-032** — The legal entity operating Tenure.
  - Owner: Almamy Diaby · review by 2026-09-02
  - Privacy and Terms must not name an Inc./LLC that does not exist. 'Tenure' is used as a trading name and both documents carry a notice that they are founder-drafted and not counsel-reviewed.

## Claims

### Ai

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-007` | Tenure AI answers only from records the person asking can already see, links its sources, and sends retrieved record text to Anthropic's API to compose the answer. | `/` `/product` `/trust` `/privacy` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-008` | If the model is unavailable, the ranked permission-scoped sources are still returned and the interface says which happened. | `/product` `/trust` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-030` | Customer records are never used to train any model. | `/privacy` `/trust` `components/home/AiOnboarding.tsx` | **BLOCKED — external** | Tenure | `819aec0e` | Almamy Diaby | 2026-08-02 | 2026-09-02 |

<details><summary><code>C-007</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/search-data.ts (loadSearchCorpus applies RBAC before ranking)
- apps/web/src/lib/ai.ts:35 (fetch https://api.anthropic.com/v1/messages)
- apps/web/src/lib/ai.ts:21 (model claude-haiku-4-5-20251001)

**Qualification that must travel with this claim:** PROVIDER GATE: production calls Anthropic DIRECTLY. There is no Bedrock integration in either repository. Public and legal copy must say Anthropic until the deploying repo invokes Bedrock, infrastructure and tests land, and the cutover is confirmed. One platform-wide key serves all tenants; there is no per-tenant key, quota or opt-out. Retrieval is keyword matching over five record kinds — no embeddings, no vector search, document file contents not indexed. Never say 'instant', 'never invents' or 'answers anything'.

</details>

<details><summary><code>C-008</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/components/TenureAIPanel.tsx:74-84
- apps/web/src/app/(app)/search/page.tsx:71-75

</details>

<details><summary><code>C-030</code> — evidence and limits</summary>

**Evidence**

- No fine-tuning or training pipeline exists anywhere in either repository

**Qualification that must travel with this claim:** The 'not by us' half is verifiable in code. The 'not by Anthropic' half is a statement about a third party's contractual terms and has NOT been grounded in a reviewed agreement. Until it is, the site must attribute that half to Anthropic's terms rather than asserting it as Tenure's guarantee.

</details>

### Compliance

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-026` | SOC 2. | `/trust (roadmap)` | **Roadmap** | none | `n/a` | Almamy Diaby | 2026-08-02 | 2026-11-02 |
| `C-027` | FERPA-conscious handling of education records. | `/privacy` `/trust` | **BLOCKED — external** | none | `n/a` | Almamy Diaby | 2026-08-02 | 2026-09-02 |
| `C-032` | The legal entity operating Tenure. | `/privacy` `/terms` | **BLOCKED — external** | external | `n/a` | Almamy Diaby | 2026-08-02 | 2026-09-02 |

<details><summary><code>C-026</code> — evidence and limits</summary>

**Evidence**

- No controls, evidence artifacts or policy documents exist in infrastructure/ or .github/

**Qualification that must travel with this claim:** 'Roadmap' only. Never 'compliant', 'certified', 'readiness', 'in progress', or 'controls operating'.

</details>

<details><summary><code>C-027</code> — evidence and limits</summary>

**Evidence**

- FERPA appears in zero lines of application code in either repository
- Record-level classification for education-record policy is not built

**Qualification that must travel with this claim:** Aspirational only, and NOT yet reviewed by counsel. Never 'FERPA compliant' or 'FERPA aligned'. Must always be accompanied by a statement that it is intent rather than a compliance answer.

</details>

<details><summary><code>C-032</code> — evidence and limits</summary>

**Evidence**

- No entity has been formed as of 2026-08-02, confirmed by the site owner.

**Qualification that must travel with this claim:** Privacy and Terms must not name an Inc./LLC that does not exist. 'Tenure' is used as a trading name and both documents carry a notice that they are founder-drafted and not counsel-reviewed.

</details>

### Customer

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-021` | A Fall 2026 pilot with Simon's Office of Student Engagement. | `/` `/pilot` `/story` | **BLOCKED — external** | external | `n/a` | Almamy Diaby | 2026-08-02 | 2026-09-02 |
| `C-022` | Display of the Simon Business School / University of Rochester and Startup Wednesday marks. | `components/site/SupporterStrip.tsx` `/` `/story` | **Live in production** | external | `n/a` | Almamy Diaby | 2026-08-02 | 2026-11-02 |

<details><summary><code>C-021</code> — evidence and limits</summary>

**Evidence**

- Verbal agreement only, confirmed by the site owner on 2026-08-02. NO written or signed commitment exists.

**Qualification that must travel with this claim:** MUST be described as planned or proposed. Forbidden: 'partner', 'customer', 'sponsor', 'is rolling out', 'will deploy', or any implication of completed procurement or university endorsement. Upgrade to 'live' only when a signed document exists and is referenced here.

</details>

<details><summary><code>C-022</code> — evidence and limits</summary>

**Evidence**

- Written permission for both marks confirmed by the site owner on 2026-08-02.

**Qualification that must travel with this claim:** Marks indicate origin and support only. They must never be captioned in a way that implies customership, sponsorship of the product, or endorsement.

</details>

### Integration

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-009` | A signed per-user calendar feed that Outlook, Google Calendar and Apple Calendar can subscribe to with one link. | `/` `/product` `/trust` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-010` | PDF, Word, Excel and PowerPoint files open inside Tenure; text files and spreadsheets can be edited in place with a save-conflict check. | `/` `/product` `/trust` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-012` | An existing budget spreadsheet can be uploaded and Tenure matches the columns however they were named, dropping subtotal rows, with a preview before anything is saved. | `/` `/product` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-029` | Connectors to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord. | `/trust (stated as NOT supported)` | **Not supported** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |

<details><summary><code>C-009</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/calendar-sync.ts (IcsFeedSync implements neither push nor pull)
- apps/web/src/app/api/calendar/ics/[token]/route.ts
- apps/web/e2e/calendar.spec.ts:281

**Qualification that must travel with this claim:** ONE-WAY ONLY. Tenure fills the calendar and does not read it back. Never imply two-way sync or an account connection.

</details>

<details><summary><code>C-010</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/app/api/documents/_lib/content.ts (JSZip, xlsx, mammoth)
- apps/web/src/app/api/documents/.../save/route.ts (optimistic lock -> 409)

**Qualification that must travel with this claim:** AI summarization is gated to text/*, json, csv, xml under 200KB — it does NOT summarize PDF or Office files. Never claim documents are 'summarized by AI'.

</details>

<details><summary><code>C-012</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/finance.ts:141-261 (scored fuzzy header matching, no-reuse allocation)
- apps/web/src/app/api/templates/budget/route.ts (template generated by the same code that parses it)

</details>

<details><summary><code>C-029</code> — evidence and limits</summary>

**Evidence**

- Repo-wide grep for googleapis|slack.com|api.notion|api.dropbox|discord.com|zoom.us|api.box.com|graph.microsoft|oauth2 returns ZERO hits
- No integration framework, no public API, no webhooks

**Qualification that must travel with this claim:** No vendor logo may appear on the site unless connector code and an end-to-end test exist. Importing a file a vendor produced is not an integration.

</details>

### Metric

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-006` | A two-gate approval chain across seven request types. | `/` `/product` `site.ts metrics` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-014` | 26 organizations and 209 seats modelled from the office's own leadership roster. | `/` `site.ts metrics` `/pilot` | **Live in production** | Tenure | `819aec0e` | Almamy Diaby | 2026-08-02 | 2026-11-02 |
| `C-015` | 132 end-to-end tests and 292 unit tests run on every build. | `/` `site.ts metrics` `/pilot` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |

<details><summary><code>C-006</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/approvals.ts:7-13,84-91 (PENDING_PRESIDENT, PENDING_OSE)
- apps/web/prisma/schema.prisma:359-377 (ApprovalType x7, ApprovalStatus x7)

**Qualification that must travel with this claim:** Two GATES, seven TYPES — not six steps, and there is no Advisor gate. A president's own request skips gate one.

</details>

<details><summary><code>C-014</code> — evidence and limits</summary>

**Evidence**

- apps/web/scripts/roster-data.sample.mjs -> 26 clubs, 209 seats, 106 filled, 103 vacant, 19 advisors
- apps/web/scripts/roster-source.mjs:39-62

**Qualification that must travel with this claim:** These are structural counts from the seeded model, not a count of active users. Never present them as customers, users or adoption.

</details>

<details><summary><code>C-015</code> — evidence and limits</summary>

**Evidence**

- 28 e2e spec files containing 132 test() cases
- 23 .test.* + 2 .itest.ts containing 292 it()/test() cases

</details>

### Product

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-001` | Access attaches to the durable seat, not the person: an incoming officer gets read-only access before their term begins, and an outgoing one keeps the record but loses access. | `/` `/product` `/trust` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-002` | The handoff packet is assembled from the record itself — seats, current and previous holders, open approvals, deadlines and budget position — rather than written by the outgoing officer. | `/` `/product` `/pilot` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-005` | Every approval decision permanently records who decided, the seat they held at that moment, what the request moved from and to, and whether someone acted on another seat's behalf. | `/` `/product` `/trust` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-011` | History cannot be deleted: a seat carrying assignments, holdings or knowledge refuses deletion and must be retired; an active assignment is revoked to alumni rather than removed. | `/` `/trust` `site.ts metrics` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-013` | Two-party administrative succession: the outgoing administrator keeps authority until the named successor accepts, then the grant and step-down happen together. | `/trust` `/product` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-017` | An administration console with sixteen named capabilities across three strictly nested staff tiers, where navigation follows the capabilities the seat holds. | `/` `/product` `/pilot` `/trust` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-019` | Approvals show how long they have sat in a gate (flagged at three and six days), and an approver can name a backup whose decisions are recorded as made on their behalf. | `/product` `/trust` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-020` | Six of the office's handbooks are transcribed as structured policies with their source document named. | `/product` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-018` | Deadlines published once by the office reach every organization, and reminders fire from infrastructure without anyone opening the app, once per person. | `/product` `/pilot` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-028` | Self-service bulk export of an organization's record. | `/trust (roadmap)` `/privacy (manual, on request)` | **Roadmap** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |

<details><summary><code>C-001</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/rbac.ts:82-96 (canViewOrg allows SHADOW or ACTIVE)
- apps/web/src/lib/rbac.ts:133-140 (canContribute requires ACTIVE)
- apps/web/src/lib/memory.ts:19-22 (shadow holder sees the seat's cards)
- apps/web/src/lib/rbac.test.ts:68-105, memory.test.ts:40-47

</details>

<details><summary><code>C-002</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/app/(app)/orgs/[slug]/handoff/page.tsx:44-95 (pure DB assembly)
- apps/web/e2e/handoff.spec.ts:7-31

**Qualification that must travel with this claim:** Contains no AI. Do not describe the handoff as AI-generated or AI-written; the page imports no model code.

</details>

<details><summary><code>C-005</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/app/(app)/approvals/actions.ts (actorRoleContext written per step)
- apps/web/src/app/(app)/approvals/[id]/page.tsx:336 (rendered to users)

**Qualification that must travel with this claim:** The stored policySnapshot is a thin flag object and is never read back. Do NOT claim the product can 'prove the rules in force' or reconstruct a policy version.

</details>

<details><summary><code>C-011</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/app/(app)/admin/actions.ts:162-263 (adminRemoveAssignment revokes to ALUMNI)
- apps/web/src/app/(app)/admin/actions.ts:314-338 (adminDeleteSeat refuses when history exists)

</details>

<details><summary><code>C-013</code> — evidence and limits</summary>

**Evidence**

- apps/web/prisma/schema.prisma:894-928 (RoleTransfer)
- apps/web/src/app/(app)/admin/actions.ts:532-805
- apps/web/e2e/governance.spec.ts

</details>

<details><summary><code>C-017</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/admin/capabilities.ts (16 capabilities; Director 16 / Staff 5 / Advisor 1)
- apps/web/src/lib/admin/guard.ts:63 (requireCapability audits allow AND deny)
- apps/web/e2e/admin-console.spec.ts

</details>

<details><summary><code>C-019</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/approvals-sla.ts (3-day amber / 6-day red, calendar days)
- apps/web/src/lib/delegation.ts
- apps/web/e2e/delegation.spec.ts

</details>

<details><summary><code>C-020</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/policies.ts (6 policies)
- apps/web/e2e/policies.spec.ts

**Qualification that must travel with this claim:** policyText() has zero callers and policies are NOT in the AI corpus. Do not imply Tenure AI can answer policy questions.

</details>

<details><summary><code>C-018</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/app/api/jobs/reminders/route.ts
- DeliverableReminder @@unique([deliverableId,userId])
- infrastructure/terraform/scheduler.tf (EventBridge cron(0 13 * * ? *))
- apps/web/e2e/deliverables.spec.ts

**Qualification that must travel with this claim:** Delivery is IN-APP ONLY. All three Delivery writes hardcode channel 'in_app'; there is no SES, nodemailer or web-push anywhere. Never claim email or push delivery.

</details>

<details><summary><code>C-028</code> — evidence and limits</summary>

**Evidence**

- 20 API routes, none an export; no exportAll or bulk CSV path

**Qualification that must travel with this claim:** Never say 'export everything, anytime'. The privacy page may offer a manual, human-fulfilled export on request, which is accurate.

</details>

### Security

| ID | Claim | Where | Availability | Evidence repo | Commit | Owner | Verified | Review by |
|---|---|---|---|---|---|---|---|---|
| `C-003` | Multi-tenant isolation is enforced at the query layer by the database client itself, not by convention at each call site. | `/` `/trust` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-004` | An append-only audit trail records both allows and denials; audit rows are only ever created, never updated or deleted. | `/` `/trust` | **Live, verified in CI** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-016` | The database and uploaded documents are encrypted at rest, and documents are served only through signed links that expire in ten minutes. | `/trust` `/privacy` | **Live in production** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-024` | Separation of duties on approvals (a requester cannot approve their own request). | `/trust (stated as NOT supported)` | **Not supported** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-025` | Institution staff are scoped to their assigned organizations. | `/trust (stated as NOT supported)` | **Not supported** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-031` | Cryptographic tamper-evidence on the audit trail. | `/trust (stated as NOT supported)` | **Not supported** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |
| `C-023` | Institutional single sign-on (SAML / OIDC). | `/trust (stated as roadmap)` | **Roadmap** | Tenure | `819aec0e` | Satvik Adyanthaya | 2026-08-02 | 2026-11-02 |

<details><summary><code>C-003</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/tenancy/extension.ts:52 (Prisma client extension)
- infrastructure/terraform/ecs.tf:191 (TENANCY_ENFORCE=true in production)
- .github/workflows/ci.yml:224
- apps/web/src/lib/tenancy/isolation.itest.ts (real PostgreSQL, cross-tenant cases)

**Qualification that must travel with this claim:** NEVER call this PostgreSQL row-level security — no CREATE POLICY exists. 15 of 39 models carry institutionId; the other 24 are registered as not independently enforceable at the query layer.

</details>

<details><summary><code>C-004</code> — evidence and limits</summary>

**Evidence**

- apps/web/prisma/schema.prisma:872-891 (AuditEvent)
- apps/web/src/lib/admin/guard.ts:63 (audits both outcomes)
- 37 auditEvent.create sites; zero update/delete/upsert in application code

**Qualification that must travel with this claim:** Coverage is 49 of 63 server actions (78%), NOT 100%. Messaging, feed, profile and resource writes are unaudited, and AI/search routes write no audit row. There is no hash, prevHash, signature or checksum column — never say hash-chained, tamper-proof, cryptographically immutable or WORM.

</details>

<details><summary><code>C-016</code> — evidence and limits</summary>

**Evidence**

- infrastructure/terraform/rds.tf:35 (storage_encrypted = true)
- infrastructure/terraform/s3.tf:15 (sse_algorithm = "aws:kms")
- apps/web/src/lib/s3.ts:47,61 (getSignedUrl, expiresIn 600)

**Qualification that must travel with this claim:** Keys are AWS-managed. There is no customer-managed KMS key and no BYOK. The exports bucket has no explicit encryption block.

</details>

<details><summary><code>C-024</code> — evidence and limits</summary>

**Evidence**

- packages/ is empty in the deploying repo; notOwnRequest/notOwnReimbursement return zero hits
- apps/web/src/lib/approvals.ts:77 (isRequester computed, never used to exclude)
- apps/web/src/lib/rbac.ts:68-70 (isOse true for ANY institution membership)

**Qualification that must travel with this claim:** A user holding both an institution membership and an active president seat can submit and approve the same request end to end. The site must never claim segregation of duties.

</details>

<details><summary><code>C-025</code> — evidence and limits</summary>

**Evidence**

- apps/web/src/lib/rbac.ts:68-70 (isOse grants on any institution membership)
- OrganizationAdvisor exists but does not scope reads

**Qualification that must travel with this claim:** Any institution account can read every organization. Do not claim 'least access by default'.

</details>

<details><summary><code>C-031</code> — evidence and limits</summary>

**Evidence**

- apps/web/prisma/schema.prisma:872-891 — no hash/signature/checksum column

**Qualification that must travel with this claim:** Append-only is enforced by the application, not by cryptography or write-once storage. Never say hash-chained, tamper-proof, cryptographically immutable or WORM. The honest and still-strong claim is that rows are only ever created — no update, delete or upsert against the audit table exists anywhere in the application.

</details>

<details><summary><code>C-023</code> — evidence and limits</summary>

**Evidence**

- infrastructure/terraform/variables.tf:110-113 (okta_issuer default "")
- infrastructure/terraform/ecs.tf:167-168 (AUTH_DEV_LOGIN=true, ALLOW_DEV_LOGIN_IN_PRODUCTION=true)
- docs/decisions/PRODUCT-DECISIONS.md PD-004 (Cognito decided, nothing implemented)

**Qualification that must travel with this claim:** SSO is NOT deployed. Okta is dead code and Cognito is a decision with no implementation. The site must not say SSO, SAML, OIDC, MFA or 'SSO-ready'. Do not publish the specifics of the pilot sign-in mechanism.

</details>

## Phrases the site may never use

Enforced by `e2e/claims.spec.ts` against the rendered text of every route. A negative statement on the trust page ("separation of duties: not supported") is allowed; a bare marketing assertion is not.

| Pattern | Why it is forbidden | Claim |
|---|---|---|
| `\bFERPA[- ](compliant\|aligned\|certified)\b` | No FERPA controls exist | `C-027` |
| `\bSOC ?2\b(?!.{0,40}\broadmap\b)` | SOC 2 is roadmap only | `C-026` |
| `\brow[- ]level security\b` | Tenancy is query-layer, not Postgres RLS | `C-003` |
| `\bhash[- ]chain(ed)?\b` | AuditEvent has no hash column | `C-004` |
| `\btamper[- ]proof\b` | No cryptographic tamper-evidence | `C-031` |
| `\bimmutab(le\|ility)\b` | Append-only is application-enforced; there is no hash chain, signature or checksum | `C-031` |
| `\bask(ing)? anything\b` | Retrieval covers five record kinds; finance, people and file contents are excluded | `C-007` |
| `\bpolicy v[0-9]+\b` | policySnapshot has no version and is never read back | `C-005` |
| `\bdays,? not a semester\b` | Nothing measures onboarding duration | `C-014` |
| `\bnothing leaves your tenant\b` | Record text is sent to Anthropic | `C-007` |
| `\banswers? anything\b` | Retrieval is keyword matching over five record kinds | `C-007` |
| `\bnever (invents\|hallucinates)\b` | Grounding is prompt-instructed, not verified | `C-007` |
| `\b100% of actions\b` | Audit coverage is 49/63 server actions | `C-004` |
| `\bexport everything,? anytime\b` | There is no bulk export path | `C-028` |
| `\bseparation of duties\b` | No SoD control exists | `C-024` |
| `\bleast[- ]access\b` | Any institution member can read every organization | `C-025` |
| `\btwo[- ]way (sync\|calendar)\b` | The ICS feed is one-way | `C-009` |
| `\bsummarized by AI\b` | Summarization excludes PDF and Office files | `C-010` |
| `\bBedrock\b` | Production calls Anthropic directly; no Bedrock exists | `C-007` |
| `\bsingle sign-on\b(?!.{0,60}\b(roadmap\|not deployed\|planned)\b)` | SSO is not deployed | `C-023` |

### Pilot-relationship phrasings

The Fall 2026 pilot is verbally agreed and **not contracted**, so nothing may present it as settled or imply university endorsement. Governed by `C-021`.

- `Office of Student Engagement[^.]{0,40}\bis (rolling out\|deploying\|standing up)\b`
- `\b(our\|a) (university )?partner\b`
- `\bsponsored by\b`
- `\bin partnership with\b`

## Revalidating

1. Re-read the evidence path in the deploying repo at its current commit.
2. Update `evidenceCommit` and `lastVerified` in `src/lib/claims.ts`.
3. Run `npm run claims:build` and `npm run test:claims`.
4. If the capability changed, fix the site copy in the same change. A register that lags the site is worse than none, because it looks like diligence.
