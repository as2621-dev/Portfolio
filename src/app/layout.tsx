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

export const metadata: Metadata = {
  title: `${site.owner_name} — ${site.role_line}`,
  description: site.hero_headline,
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
