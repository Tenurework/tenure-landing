"use client";

import { useEffect, useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * THE WALKTHROUGH REQUEST — a first-party Tenure surface, not a third party's.
 *
 * What this replaces: clicking the primary CTA landed on /contact, and the thing
 * that opened there was Calendly's inline widget — a third party's typography,
 * a third party's form controls, a third party's cookie banner, in the middle of
 * a page that had spent eight sections establishing that this product is careful
 * about where your data goes. The first interactive surface a prospect ever
 * touched was somebody else's software.
 *
 * THE HONEST CONSTRAINT, AND WHY THE DESIGN LOOKS LIKE THIS.
 *
 * This site is statically exported. There is no backend, no form endpoint and no
 * database behind it, so a form that appeared to "submit" would either be a lie
 * or would need a new subprocessor — and C-036 requires the subprocessor list to
 * stay complete and to be disclosed on /privacy before anything starts
 * processing. Adding one to save a click is a bad trade.
 *
 * So this composes the request LOCALLY and hands it to the visitor: their own
 * mail client, or their clipboard. Nothing is transmitted by this page, and the
 * dialog says so in as many words. That is the same posture as the rest of the
 * site — say what actually happens — and it has a real advantage over a form
 * that POSTs: the visitor keeps a copy in their own sent items, so a request
 * cannot be silently lost by a queue nobody is watching.
 *
 * ACCESSIBILITY, VIA THE PLATFORM RATHER THAN BY HAND.
 *
 * The native `<dialog>` element with `showModal()` supplies the focus trap, the
 * inert background, the Escape handler and the `aria-modal` semantics — all four
 * of which the previous mobile-menu implementation had to hand-roll and got
 * wrong on the first attempt (Escape worked, focus restoration did not). What is
 * NOT free and is therefore handled below: returning focus to the trigger on
 * close, and closing on a backdrop click without swallowing clicks inside the
 * form.
 *
 * PROGRESSIVE ENHANCEMENT. `<dialog>` needs JavaScript to open, so the page must
 * never depend on it: /contact renders the email address and the scheduler
 * anchor as plain markup, outside this component. With scripts blocked the
 * visitor loses the composer and keeps both ways of reaching us.
 */

/** What a visitor can ask to be shown. Each maps to a surface that really exists. */
const TOPICS = [
  "The handoff packet, assembled from a record",
  "Approvals and the two-gate chain",
  "Finance: budgets, dues, reimbursements",
  "Tenure AI answering from a seat’s record",
  "The administration console and its capabilities",
  "Importing our existing spreadsheets",
  "Security, tenancy and what is not built",
] as const;

const SECTORS = [...site.audiences.map((a) => a.sector), "Something else"] as const;

type Form = {
  name: string;
  org: string;
  sector: string;
  role: string;
  topics: string[];
  notes: string;
};

const EMPTY: Form = {
  name: "",
  org: "",
  sector: "",
  role: "",
  topics: [],
  notes: "",
};

/**
 * Renders the request as plain text.
 *
 * Deliberately readable rather than machine-parseable: it lands in a two-person
 * inbox, and a human reads it. Empty fields are dropped rather than emitted as
 * blank labels, so a visitor who fills in two boxes does not send a form with
 * five empty ones.
 */
function compose(form: Form) {
  const lines: string[] = ["I’d like a walkthrough of Tenure.", ""];

  const facts: [string, string][] = [
    ["Name", form.name],
    ["Organization", form.org],
    ["Kind of organization", form.sector],
    ["My role", form.role],
  ];
  for (const [label, value] of facts) {
    if (value.trim()) lines.push(`${label}: ${value.trim()}`);
  }

  if (form.topics.length) {
    lines.push("", "What I’d like to see:");
    for (const t of form.topics) lines.push(`  - ${t}`);
  }
  if (form.notes.trim()) {
    lines.push("", "Anything else:", form.notes.trim());
  }

  lines.push("", "— composed on tenurework.com/contact");
  return lines.join("\n");
}

function subjectFor(form: Form) {
  const who = form.org.trim() || form.name.trim();
  return who ? `Walkthrough request — ${who}` : "Walkthrough request";
}

/**
 * A labelled field.
 *
 * The label is associated by `htmlFor`/`id` and does NOT wrap the control, which
 * matters more than it looks. A `<label>` that wraps its control contributes its
 * entire subtree to the accessible name — including the control's own content —
 * so a wrapped `<select>` announced itself as "Kind of organization Choose one…",
 * dragging its current value into its name. Playwright caught it as an ambiguous
 * locator; a screen-reader user would have heard the name change every time they
 * changed the answer.
 *
 * The hint is wired through `aria-describedby` rather than left as loose text
 * beside the control, so it is announced as a description instead of being
 * either silent or glued onto the name.
 */
function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label htmlFor={id} className="label-mono block">
        {label}
      </label>
      {hint && (
        <span id={`${id}-hint`} className="mt-1 block text-[0.78rem] text-ink-faint">
          {hint}
        </span>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "block min-h-11 w-full rounded-xl border border-border-strong bg-canvas px-3.5 py-2.5 text-[0.95rem] text-ink " +
  "placeholder:text-ink-faint focus-visible:border-grove focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-grove";

export function WalkthroughRequest() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [copied, setCopied] = useState(false);
  const titleId = useId();
  const descId = useId();

  const body = compose(form);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    subjectFor(form),
  )}&body=${encodeURIComponent(body)}`;

  // showModal() is imperative: it cannot be expressed as a prop, so the element
  // is driven from state here rather than rendered conditionally. Rendering it
  // conditionally would also throw away everything typed into it on every
  // re-render of the parent.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // `close` fires for Escape as well as for our own close() call, so focus
  // restoration lives here and covers both paths. Without it an Escape press
  // drops the keyboard user back at the top of the document.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClose = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  function toggleTopic(topic: string) {
    setForm((f) => ({
      ...f,
      topics: f.topics.includes(topic)
        ? f.topics.filter((t) => t !== topic)
        : [...f.topics, topic],
    }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${subjectFor(form)}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be refused outright (permissions policy, an
      // insecure origin, Firefox without user activation). The textarea below is
      // always present and always selectable, so there is a manual path that
      // does not depend on this succeeding — no error state needed.
      setCopied(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClasses("primary", "lg")}
        aria-haspopup="dialog"
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          Request a walkthrough
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descId}
        // The backdrop is styled through ::backdrop in globals.css. `p-0` and
        // `bg-transparent` strip the UA's own chrome so the panel below is the
        // only thing that paints.
        className="tn-dialog m-auto w-[min(46rem,calc(100vw-2rem))] rounded-[26px] border-0 bg-transparent p-0"
        // A click on the dialog element itself — rather than on the panel inside
        // it — is a click on the backdrop, because the panel fills the dialog.
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        {/*
          A three-row grid — header, scrolling body, footer — rather than one
          scrolling box. In the one-box version the send controls were the last
          thing in the flow, so on a 1000px viewport they sat below the fold and
          the visitor had to scroll past their own composed request to find the
          button that sends it. The primary action of a dialog must never be the
          thing you have to go looking for.

          `max-h-[85svh]`, not `85vh`: on mobile Safari the large viewport unit
          measures the window with the URL bar retracted, so a dialog sized in vh
          is taller than the space it is actually given and the footer is pushed
          off-screen — exactly the bug being fixed here.
        */}
        <div className="panel grid max-h-[85svh] grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
            <div>
              <h2
                id={titleId}
                className="font-display text-[1.25rem] font-semibold tracking-tight text-ink"
              >
                Request a walkthrough
              </h2>
              <p id={descId} className="mt-1 text-[0.88rem] leading-relaxed text-ink-soft">
                Tell us what you want to see and we will open exactly that. Every
                field is optional.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="-mr-1 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-soft hover:bg-sand hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={`${titleId}-name`} label="Your name">
                <input
                  id={`${titleId}-name`}
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  placeholder="Alex Mercer"
                />
              </Field>
              {/* "Organization name", not "Organization": the latter is a
                  substring of "Kind of organization" below it, so the two fields
                  had overlapping accessible names — ambiguous to a screen reader
                  reading them in sequence, and to anything else matching by name. */}
              <Field id={`${titleId}-org`} label="Organization name">
                <input
                  id={`${titleId}-org`}
                  className={inputClass}
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  autoComplete="organization"
                  placeholder="Northside Community Trust"
                />
              </Field>
              <Field id={`${titleId}-sector`} label="Kind of organization">
                <select
                  id={`${titleId}-sector`}
                  className={cn(inputClass, "appearance-none")}
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                >
                  <option value="">Choose one…</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={`${titleId}-role`} label="Your role">
                <input
                  id={`${titleId}-role`}
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  autoComplete="organization-title"
                  placeholder="Director of Operations"
                />
              </Field>
            </div>

            {/* A fieldset, not a div with a heading: these are one multi-select
                question, and only a fieldset/legend pair tells a screen reader
                that the seven checkboxes belong to it. */}
            <fieldset className="border-0 p-0">
              <legend className="label-mono">What would you like to see?</legend>
              <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                {TOPICS.map((topic) => {
                  const on = form.topics.includes(topic);
                  return (
                    <label
                      key={topic}
                      className={cn(
                        "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-[0.88rem] transition-colors",
                        on
                          ? "border-grove/40 bg-grove-soft/60 text-ink"
                          : "border-line bg-canvas text-ink-soft hover:border-border-strong",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleTopic(topic)}
                        className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                      />
                      <span>{topic}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Field
              id={`${titleId}-notes`}
              label="Anything else"
              hint="Constraints, questions, a date that suits you."
            >
              <textarea
                id={`${titleId}-notes`}
                aria-describedby={`${titleId}-notes-hint`}
                className={cn(inputClass, "min-h-[5.5rem] resize-y")}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </Field>

            {/* The composed request, shown rather than hidden. It is what will be
                sent, so the visitor sees it before sending — and it doubles as the
                manual path when the clipboard API is refused. */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="label-mono">Your request, as it will send</span>
                <span className="font-mono text-[0.7rem] text-ink-faint">
                  to {site.email}
                </span>
              </div>
              <textarea
                readOnly
                value={body}
                rows={6}
                aria-label="The composed request"
                className="mt-2 block w-full resize-y rounded-xl border border-line bg-sand/60 p-3.5 font-mono text-[0.78rem] leading-relaxed text-ink-soft"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-line bg-paper/60 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
            <a href={mailto} className={buttonClasses("primary", "md")}>
              <span className="relative z-10">Open in your email app</span>
            </a>
            <button type="button" onClick={copy} className={buttonClasses("secondary", "md")}>
              {/* aria-live so the confirmation is announced, not just painted. */}
              <span className="relative z-10" aria-live="polite">
                {copied ? "Copied to clipboard" : "Copy the request"}
              </span>
            </button>
            <p className="text-[0.78rem] leading-relaxed text-ink-faint sm:ml-auto sm:max-w-[16rem]">
              This page sends nothing on its own. The request is written here in
              your browser and goes out from your own mail app.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
