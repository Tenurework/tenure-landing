import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Display + body, General Sans (self-hosted, Fontshare FFL). A clean, slightly
 * warm geometric grotesk that carries both big headlines and running text.
 * Variable weight 200–700.
 */
export const generalSans = localFont({
  src: "../fonts/GeneralSans-Variable.woff2",
  display: "swap",
  variable: "--font-general",
  weight: "200 700",
});

/**
 * Utility / data, IBM Plex Mono. Eyebrows, labels, and the numbers in the
 * product UI ride on this, the "system of record" voice.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex",
  weight: ["400", "500", "600"],
});
