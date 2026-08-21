"use client";

import { useEffect, useRef, useState } from "react";
import { useOnScreen } from "@/lib/use-on-screen";

/**
 * A COMPOSER THAT TYPES ITSELF.
 *
 * The AI panel's input read as a dead placeholder — a grey sentence sitting in a
 * box, which is the one element in a product mock that most obviously is not a
 * product. Typing a real query into it, pausing, clearing and typing the next is
 * what the reference does, and it costs nothing but attention.
 *
 * THREE THINGS KEEP IT HONEST:
 *
 * 1. The phrases are KEYWORD queries, not sentences. Search requires every term
 *    to appear literally in a single record — no stemming, no stopword removal —
 *    so "who did we use for catering and why" returns nothing and would be a lie
 *    about how the product behaves. "catering vendor" is what actually works.
 *
 * 2. It only runs on screen. An unconditional interval re-renders this subtree
 *    for the life of the page, including while it is far below the fold, which is
 *    exactly the defect that was measured and removed from two other components
 *    on this page.
 *
 * 3. Reduced motion gets the finished string, not a frozen empty box. The
 *    animation is an embellishment on text that is always there.
 *
 * The animated span is `aria-hidden` and a stable label sits beside it for
 * assistive technology: a caret and a half-typed word are noise to a screen
 * reader, and a live-updating string here would be read out on every character.
 */
const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 1400;

export function TypingLine({
  phrases,
  className,
}: {
  phrases: readonly string[];
  className?: string;
}) {
  const { ref, onScreen } = useOnScreen<HTMLSpanElement>();
  const [text, setText] = useState("");
  const [reduce, setReduce] = useState<boolean | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    // The reduced-motion string is DERIVED at render, not written here. Setting
    // state synchronously inside an effect schedules a second render pass for a
    // value that was already knowable — `react-hooks/set-state-in-effect` is
    // right to call it, and the render-time branch below is both cheaper and
    // impossible to get out of sync with the animation.
    if (reduce === null || reduce) return;
    if (!onScreen) return;

    let phrase = 0;
    let chars = 0;
    let erasing = false;
    let live = true;

    const tick = () => {
      if (!live) return;
      const target = phrases[phrase];
      if (!erasing) {
        chars += 1;
        setText(target.slice(0, chars));
        if (chars >= target.length) {
          erasing = true;
          timer.current = setTimeout(tick, HOLD_MS);
          return;
        }
        timer.current = setTimeout(tick, TYPE_MS);
      } else {
        chars -= 1;
        setText(target.slice(0, Math.max(0, chars)));
        if (chars <= 0) {
          erasing = false;
          phrase = (phrase + 1) % phrases.length;
        }
        timer.current = setTimeout(tick, ERASE_MS);
      }
    };

    timer.current = setTimeout(tick, 400);
    return () => {
      live = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [onScreen, reduce, phrases]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {reduce ? phrases[0] : text}
        {/* The caret only blinks while there is motion to accompany. */}
        {!reduce && (
          <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-current align-baseline motion-safe:animate-[caret_1.1s_steps(1,end)_infinite]" />
        )}
      </span>
      <span className="sr-only">Ask about this seat&rsquo;s history</span>
    </span>
  );
}
