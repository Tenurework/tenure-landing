import type { Metadata, Viewport } from "next";
import { generalSans, plexMono } from "@/lib/fonts";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CalendlyBadge } from "@/components/site/CalendlyBadge";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: site.founders.map((f) => ({ name: f.name })),
  keywords: [
    "university ERP",
    "student organization software",
    "institutional memory",
    "leadership transition",
    "onboarding",
    "AI onboarding",
    "knowledge management",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name}, ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name}, ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.tagline}`,
    description: site.description,
    images: ["/og.png"],
  },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <SmoothScroll>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SmoothScroll>
        <CalendlyBadge />
      </body>
    </html>
  );
}
