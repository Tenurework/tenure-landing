/**
 * Applies the saved theme before the browser paints anything.
 *
 * This is a raw inline <script> rather than next/script on purpose. Next 16's
 * own guide for this (preventing-flash-before-hydration) documents exactly this
 * pattern, and `next/script` with `beforeInteractive` is the wrong tool: its
 * execution "does not block page hydration from occurring", so the first paint
 * would still use the wrong theme. useEffect/useLayoutEffect are later still —
 * both run after hydration, and the flash happens between the HTML arriving and
 * React booting.
 *
 * The script runs during HTML parsing, so `data-theme` is already on <html>
 * before the first pixel. `<html>` carries `suppressHydrationWarning` because
 * this script mutates an attribute React also controls — without it React
 * treats the difference as a hydration error and re-renders from the nearest
 * boundary, which both causes the flash and discards the correction.
 *
 * "system" deliberately removes the attribute rather than writing a value, so
 * the `prefers-color-scheme` media query in globals.css takes over and keeps
 * following the OS if the user changes it mid-session.
 */
export const THEME_STORAGE_KEY = "tenure-theme";

const script = `(function(){var d=document.documentElement;
d.classList.add("js");
try{
var k=${JSON.stringify(THEME_STORAGE_KEY)};
var t=localStorage.getItem(k);
if(t==="light"||t==="dark"){d.setAttribute("data-theme",t)}else{d.removeAttribute("data-theme")}
d.setAttribute("data-theme-choice",t==="light"||t==="dark"?t:"system");
}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
