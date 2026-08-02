@AGENTS.md

## Governing documents

Read in this order before changing anything public-facing:

1. `AGENTS.md` — this is Next.js 16, not the Next.js in your training data.
2. `docs/DEVELOPMENT-BIBLE-v1.0.md` — the authority model, truth gates, claim rules and
   completion criteria this site is held to.
3. `docs/PUBLIC-CLAIMS-REGISTER.md` — what the site is allowed to say, and why.
4. `docs/LANDING-REFINEMENT-LEDGER.md` — current state of every gate, and what is blocked.

## The one rule that matters most

A capability may only be described as available today on the strength of `satvikOS/Tenure`,
the repository that actually deploys. Work in `satvikOS/Tenure-Parent`, architecture documents,
ADRs and roadmaps express intent, never shipped capability.

If you change public copy, run `npm run test:claims`. If it fails, the failure message names
the claim and the evidence that contradicts you.
