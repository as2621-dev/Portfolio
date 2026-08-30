import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Folio Pop typefaces, loaded via next/font and exposed as CSS variables.
 * The design tokens (globals.css @theme) reference these --ff-* variables,
 * so every component that reads var(--font-display|body|mono) resolves here.
 *
 * Bricolage Grotesque and Instrument Sans are variable fonts (weight omitted so
 * the full axis ships); IBM Plex Mono is static, so its weights are pinned.
 */
const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--ff-display",
  display: "swap",
});

const fontBody = Instrument_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--ff-body",
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ff-mono",
  display: "swap",
});

/**
 * OpenGraph/Twitter metadata drives the share-preview card on LinkedIn,
 * iMessage, Slack, etc. The card image itself is the file-convention
 * `src/app/opengraph-image.png` (Next.js emits og:image/twitter:image for it);
 * `metadataBase` makes that image URL absolute, which LinkedIn requires.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://ashsri.blog"),
  title: `${site.owner_name} — ${site.role_line}`,
  description: site.hero_headline,
  openGraph: {
    title: "Case studies: how I actually build products",
    description:
      "Seven AI products shipped end to end — documented with the numbers, the reversals, and the decision logs.",
    url: "https://ashsri.blog",
    siteName: "ashsri.blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body>
        {/* Without JS the reveal animation must not hide content */}
        <noscript>
          <style>{".fp-reveal{opacity:1 !important;transform:none !important}"}</style>
        </noscript>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
