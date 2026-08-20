"use client";

import { useId, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/components/site/ThemeScript";
import { cn } from "@/lib/cn";

type Choice = "system" | "light" | "dark";

const OPTIONS: { value: Choice; label: string; icon: React.ReactNode }[] = [
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 13.75h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M8 1.4v1.5M8 13.1v1.5M14.6 8h-1.5M2.9 8H1.4M12.67 3.33l-1.06 1.06M4.39 11.61l-1.06 1.06M12.67 12.67l-1.06-1.06M4.39 4.39L3.33 3.33"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <path
          d="M13.4 9.8A5.8 5.8 0 0 1 6.2 2.6a5.8 5.8 0 1 0 7.2 7.2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === "light" || choice === "dark") root.setAttribute("data-theme", choice);
  else root.removeAttribute("data-theme");
  root.setAttribute("data-theme-choice", choice);
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    /* private mode — the choice still applies for this page view */
  }
}

/**
 * The `<html data-theme-choice>` attribute is the single source of truth: the
 * inline head script writes it before paint, and `apply()` writes it on change.
 * Subscribing to it with useSyncExternalStore means there is no duplicated
 * React state to fall out of sync, and no setState-inside-an-effect to make the
 * server and client disagree — React renders the server snapshot during
 * hydration and swaps to the real value itself.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme-choice"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Choice {
  const attr = document.documentElement.getAttribute("data-theme-choice");
  return attr === "light" || attr === "dark" ? attr : "system";
}

const getServerSnapshot = (): Choice => "system";

/**
 * Three-way theme control: system, light, dark.
 *
 * Native radio inputs rather than buttons with aria-pressed, because these are
 * mutually exclusive options. That buys correct screen-reader semantics and
 * roving arrow-key navigation from the platform instead of re-implementing
 * them. The inputs are visually hidden but never `display:none`, so they stay
 * focusable and keyboard-operable.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const name = useId();
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <fieldset className={cn("inline-flex", className)}>
      <legend className="sr-only">Colour theme</legend>
      <div className="inline-flex items-center gap-0.5 rounded-xl border border-line bg-surface p-0.5">
        {OPTIONS.map((opt) => {
          const active = choice === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "relative inline-flex h-8 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] px-2.5",
                "text-caption font-medium transition-colors duration-150",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring",
                active
                  ? "bg-accent text-on-accent"
                  : "text-text-secondary hover:text-text",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={active}
                // apply() writes the attribute; the MutationObserver above
                // re-renders this control. No local state to keep in step.
                onChange={() => apply(opt.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span aria-hidden="true">{opt.icon}</span>
              <span className="sr-only">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
