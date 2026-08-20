import { Container } from "@/components/ui/layout";
import { Dossier } from "@/components/ui/Dossier";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        intro={
          <>
            The terms for using Tenure during early access and the planned{" "}
            {site.pilot.season} pilot. Last updated 2 August 2026.
          </>
        }
      />

      <Container>
        {/*
          THE LEGAL TEXT IS A DOSSIER, NOT A WALL.

          This page was one unbroken run of 14 <h2> sections — 5.7 desktop
          viewports and nearly nine on a phone, for fewer words than /trust fits
          into 3.6. /trust and /pilot were compacted with `Dossier` and these two
          were not, which left the site’s two longest-per-word pages using the one
          pattern the compaction pass existed to replace.

          Not one word is cut. Native <details> keeps every sentence in the DOM,
          so Ctrl+F still finds a clause inside a collapsed section and
          claims.spec.ts can still audit the whole page — the two reasons
          Dossier.tsx is not a JavaScript rail.

          The founder-draft warning stays ABOVE the accordion and outside it. It
          is the one thing on this page that must never be behind a click.
        */}
        <div className="mx-auto max-w-3xl pb-16">
          <div className="mb-8 rounded-xl border border-line bg-warning-subtle px-5 py-4 text-body leading-relaxed text-warning">
            <strong className="font-semibold">Early access terms.</strong>{" "}
            Tenure is operated by its founders and is not yet incorporated. These
            terms cover early access and the Fall 2026 deployment; an
            institution&rsquo;s agreement is negotiated separately. Write to{" "}
            <a href={`mailto:${site.email.legal}`}>{site.email.legal}</a> for the
            version your review needs.
          </div>

          <p>
            These terms cover how you and your organization may use Tenure while
            the product is in early access. We&rsquo;ve kept them short and plain
            on purpose. If anything here is unclear, write to us and we&rsquo;ll
            explain it directly.
          </p>

          <Dossier
            name="terms"
            title="Terms of use"
            meta="early access and the planned pilot · open any section"
            items={[
              {
                key: "Acceptance of these terms",
                title: "Acceptance of these terms",
                blurb: "What agreeing to this means while Tenure is early access.",
                children: (
                  <div className="legal">
                    <p>
                    By creating an account or using Tenure, you agree to these terms on
                    behalf of yourself and the organization you represent. If you
                    don&rsquo;t agree, please don&rsquo;t use the service. If you&rsquo;re
                    accepting on behalf of an organization, you confirm you have the
                    authority to do so.
                    </p>
                  </div>
                ),
              },
              {
                key: "The service",
                title: "The service",
                blurb: "What Tenure provides today, and what it does not promise.",
                children: (
                  <div className="legal">
                    <p>
                    Tenure is the system of record for organizations where
                    leadership turns over faster than knowledge does &mdash; universities,
                    nonprofits and NGOs, small and mid-sized businesses, associations and
                    chapters &mdash; offered through a pilot and early access. It
                    keeps an organization&rsquo;s operations, finance, events,
                    members, documents, and institutional memory, in one place, so
                    the role persists even as the people in it rotate. Because the
                    product is still being built alongside the organizations who use it,
                    features may change, appear, or be removed as we learn what actually
                    serves each transition.
                    </p>
                  </div>
                ),
              },
              {
                key: "Your account and content",
                title: "Your account and content",
                blurb: "How pilot accounts are created, and what you are responsible for.",
                children: (
                  <div className="legal">
                    {/*
                    This paragraph used to read "You’re responsible for the activity that
                    happens under it." That is the sentence a procurement lawyer holds up,
                    and during the pilot it is not defensible: access is not gated on a
                    secret that belongs to one person and to nobody else, so activity under
                    a name is not evidence that the named person did it. Asserting the
                    liability anyway would have been both unfair and unenforceable.

                    The specifics of the pilot sign-in mechanism are deliberately not
                    published here — see C-023 — but the consequence of it belongs in the
                    operative document rather than only in a security page’s caveat.
                    */}
                    <p>
                    You are responsible for keeping your access to Tenure secure, and for
                    telling us promptly if you think someone else has it.
                    </p>
                    <p>
                    We do not hold you personally responsible for activity that happens
                    under your account during the pilot. The pilot access model is not
                    built on an individual credential that only you hold, so we will not
                    treat an action recorded under your name as proof that you took it.
                    Ask us for the current sign-in mechanism and we will walk you through
                    it; it is the first thing we intend to replace.
                    </p>
                    <p>
                    Your organization keeps ownership of the content it stores in Tenure.
                    We don&rsquo;t claim it as ours. We process it only to provide the
                    service to your organization, as described in our{" "}
                    <a href="/privacy">Privacy notice</a>. We do not use your content to
                    improve the product for anyone else, to build datasets, or to train
                    models, and we will not start doing so without your written
                    permission.
                    </p>
                    <p>
                    That wording is deliberate. An institution treating us as a school
                    official cannot have its records processed for our own product
                    development, and &ldquo;to improve the service&rdquo; is broad enough
                    to swallow that restriction.
                    </p>
                  </div>
                ),
              },
              {
                key: "Acceptable use",
                title: "Acceptable use",
                blurb: "The short list of things you may not do with the service.",
                children: (
                  <div className="legal">
                    <p>
                    Use Tenure for its purpose, running your organization and
                    passing on its record. Please don&rsquo;t:
                    </p>
                    <ul>
                    <li>Misuse, disrupt, or attempt to break the service or its security.</li>
                    <li>Breach the rights of others, including privacy and intellectual property.</li>
                    <li>Upload unlawful content, or content you don&rsquo;t have the right to share.</li>
                    <li>Use the service to harm, harass, or impersonate others, or to send spam.</li>
                    </ul>
                  </div>
                ),
              },
              {
                key: "Organizational data and ownership",
                title: "Organizational data and ownership",
                blurb: "Your organization keeps its record; our licence is limited to running it.",
                children: (
                  <div className="legal">
                    <p>
                    The record belongs to the organization, not to any one person who
                    held a seat. When leadership changes hands, access passes to the
                    inheriting board. Individuals who created entries don&rsquo;t take the
                    record with them when their term ends. Keeping the knowledge
                    with the seat is the whole point. We&rsquo;ll work with an
                    organization&rsquo;s current leadership to manage access and
                    transfers.
                    </p>
                  </div>
                ),
              },
              {
                key: "Availability and changes",
                title: "Availability and changes",
                blurb: "No uptime commitment, and how changes to the service are handled.",
                children: (
                  <div className="legal">
                    <p>
                    During the pilot, Tenure is provided as-is. We may modify, add, or
                    pause features as the product develops, and we may take the service
                    offline for maintenance or improvements. We don&rsquo;t guarantee
                    uninterrupted or error-free availability while we&rsquo;re still
                    building. We&rsquo;ll give organizations reasonable notice of
                    significant changes when we can.
                    </p>
                  </div>
                ),
              },
              {
                key: "Security incidents",
                title: "Security incidents",
                blurb: "What we do when something goes wrong, and how quickly you hear about it.",
                children: (
                  <div className="legal">
                    <p>
                    If we become aware of a security incident affecting your
                    organization&rsquo;s records, we will tell you without undue delay and
                    in any event within 72 hours of becoming aware of it. We will tell you
                    what we know, what we do not yet know, what we are doing about it, and
                    what we recommend you do. We will not wait until we have a complete
                    picture before telling you that something happened.
                    </p>
                  </div>
                ),
              },
              {
                key: "If we stop operating",
                title: "If we stop operating",
                blurb: "The wind-down commitment, written down rather than assumed.",
                children: (
                  <div className="legal">
                    <p>
                    You should plan for this, because Tenure is two people and a system of
                    record is the wrong place for optimism. If we decide to stop running
                    the service, we will give your organization at least 30 days&rsquo;
                    notice and provide a complete export of its record before access ends.
                    </p>
                    <p>
                    One limit you should know when you weigh that commitment: there is no
                    self-service bulk export in the product today. Export is something we
                    do by hand on request. That is a real dependency on us continuing to
                    be reachable, and it is on the roadmap precisely because it should not
                    be.
                    </p>
                  </div>
                ),
              },
              {
                key: "Limitation of liability, and what we cannot offer",
                title: "Limitation of liability, and what we cannot offer",
                blurb: "The limits a two-founder company can honestly stand behind.",
                children: (
                  <div className="legal">
                    <p>
                    To the extent the law allows, we are not liable for indirect or
                    consequential losses arising from use of the service during the pilot.
                    None of this limits rights you have that cannot be waived under
                    applicable law. Keep your own copies of anything truly critical.
                    </p>
                    <p>
                    For vendor due diligence: Tenure is not yet incorporated, and these
                    terms are not backed by a corporate liability shield, professional
                    indemnity or cyber insurance. Indemnities, insurance certificates and
                    liability caps are therefore out of scope until incorporation
                    completes. Where your procurement process requires them, raise it with
                    us at the start and we will tell you the current position.
                    </p>
                  </div>
                ),
              },
              {
                key: "Termination",
                title: "Termination",
                blurb: "How either side ends this, and what happens to the record afterwards.",
                children: (
                  <div className="legal">
                    <p>
                    You can stop using Tenure at any time, and an organization can ask us
                    to close its account and return or delete its record. We may suspend
                    or end access if these terms are seriously or repeatedly broken, or if
                    we need to for security or legal reasons. If we end your access,
                    we&rsquo;ll give your organization a fair chance to retrieve its record
                    where we reasonably can.
                    </p>
                  </div>
                ),
              },
              {
                key: "Fees",
                title: "Fees",
                blurb: "Free for the pilot term; anything beyond it is a separately signed agreement.",
                children: (
                  <div className="legal">
                    <p>
                    The pilot is free. No fees, subscription or usage charges are payable
                    for it, and there are no taxes to pass on because there is nothing to
                    invoice. If Tenure ever charges an organization, that will require a
                    separate written agreement signed in advance &mdash; it will not
                    appear by way of an update to this page.
                    </p>
                  </div>
                ),
              },
              {
                key: "Changes to these terms",
                title: "Changes to these terms",
                blurb: "How you find out when these change.",
                children: (
                  <div className="legal">
                    <p>
                    As Tenure grows beyond the pilot, these terms will evolve with it. We
                    will give at least 30 days&rsquo; notice by email before a material
                    change takes effect, and a change will never apply retroactively to
                    anything that happened before it. If you do not accept a change, you
                    may end your use of the service before it takes effect and we will
                    provide an export of your record.
                    </p>
                    <p>
                    What we will not do is treat your continued use as acceptance. An
                    earlier version of this page said exactly that, and a procurement
                    reviewer was right to refuse to sign under it: deemed acceptance means
                    an institution can be bound by terms it never read, by doing nothing.
                    </p>
                  </div>
                ),
              },
              {
                key: "The rest of the boilerplate, which was missing",
                title: "The rest of the boilerplate, which was missing",
                blurb: "Governing law, assignment, severability, notices and entire agreement.",
                children: (
                  <div className="legal">
                    <p>
                    These clauses were absent from an earlier version of this page. A
                    document that claims to form a contract and omits them is not one.
                    </p>
                    <ul>
                    <li>
                    <strong>Governing law and venue.</strong>{" "}
                    These terms are governed
                    by the laws of the State of New York, without regard to its
                    conflict-of-laws rules, and the state and federal courts located in
                    Monroe County, New York have exclusive jurisdiction. A pilot
                    agreement with an institution may specify otherwise, and the
                    institution&rsquo;s own requirements would take precedence in that
                    negotiation.
                    </li>
                    <li>
                    <strong>Confidentiality.</strong>{" "}
                    Each side will protect the
                    other&rsquo;s non-public information with at least reasonable care
                    and use it only for the purpose it was shared. This runs both ways.
                    </li>
                    <li>
                    <strong>Publicity.</strong>{" "}
                    Neither side may use the other&rsquo;s
                    name, marks or logo, or describe the relationship publicly, without
                    prior written permission. This is the clause that governs how we may
                    describe an institution on this website, and we hold ourselves to it.
                    </li>
                    <li>
                    <strong>Notices.</strong>{" "}
                    Notices to us go to{" "}
                    <a href={`mailto:${site.email.legal}`}>{site.email.legal}</a>. Notices to you go
                    to the address your organization gives us. Email is sufficient for
                    both, including for the notice periods above.
                    </li>
                    <li>
                    <strong>Assignment.</strong>{" "}
                    Neither side may assign these terms
                    without the other&rsquo;s written consent, except that we may assign
                    them to a legal entity we form to operate Tenure &mdash; which,
                    given that no such entity exists yet, is a foreseeable event rather
                    than a hypothetical.
                    </li>
                    <li>
                    <strong>Severability.</strong>{" "}
                    If any provision is held
                    unenforceable, the rest stays in force.
                    </li>
                    <li>
                    <strong>Entire agreement.</strong>{" "}
                    These terms and the Privacy
                    notice are the whole agreement about the website and early access.
                    They are not a pilot agreement, and they do not override one.
                    </li>
                    </ul>
                  </div>
                ),
              },
              {
                key: "Contact",
                title: "Contact",
                blurb: "Where to write, and who replies.",
                children: (
                  <div className="legal">
                    <p>
                    Questions about these terms? Write to us at{" "}
                    <a href={`mailto:${site.email.legal}`}>{site.email.legal}</a> and we will
                    reply.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
