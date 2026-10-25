import type { Metadata } from "next";
import { Hind_Siliguri, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getReviewer } from "@/lib/auth";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${t(lang, "app.name")} — ${t(lang, "app.tagline")}`,
      template: `%s — ${t(lang, "app.name")}`,
    },
    description: t(lang, "home.intro"),
    applicationName: "AccessBridge",
    openGraph: {
      title: `${t(lang, "app.name")} — ${t(lang, "app.tagline")}`,
      description: t(lang, "home.intro"),
      type: "website",
      locale: lang === "bn" ? "bn_BD" : "en_US",
      siteName: "AccessBridge",
    },
    alternates: { canonical: "/" },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, reviewer] = await Promise.all([getLang(), getReviewer()]);

  return (
    <html lang={lang} className={`${instrumentSans.variable} ${hindSiliguri.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          {t(lang, "app.skipToContent")}
        </a>
        <SiteHeader lang={lang} isReviewer={Boolean(reviewer)} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter lang={lang} isReviewer={Boolean(reviewer)} />
      </body>
    </html>
  );
}
