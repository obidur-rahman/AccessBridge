import type { Metadata } from "next";
import { Archivo, Hind_Siliguri, IBM_Plex_Mono } from "next/font/google";
import { LanguagePrompt } from "@/components/LanguagePrompt";
import { PageTransition } from "@/components/PageTransition";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getReviewer } from "@/lib/auth";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
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
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${t(lang, "app.name")}: ${t(lang, "home.title")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t(lang, "app.name")} — ${t(lang, "app.tagline")}`,
      description: t(lang, "home.intro"),
      images: ["/og.png"],
    },
    alternates: { canonical: "/" },
  };
}

function websiteJsonLd(lang: "en" | "bn") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AccessBridge",
    url: base,
    inLanguage: lang,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, reviewer] = await Promise.all([getLang(), getReviewer()]);

  return (
    <html lang={lang} className={`${archivo.variable} ${hindSiliguri.variable} ${plexMono.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(lang)) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-[300%] rounded-control bg-accent px-4 py-3 text-sm font-medium text-white shadow-lift transition-transform duration-200 focus:translate-y-0"
        >
          {t(lang, "app.skipToContent")}
        </a>
        <SiteHeader
          lang={lang}
          isReviewer={Boolean(reviewer)}
          isAdmin={reviewer?.role === "admin"}
        />
        <LanguagePrompt lang={lang} />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter
          lang={lang}
          isReviewer={Boolean(reviewer)}
          isAdmin={reviewer?.role === "admin"}
        />
      </body>
    </html>
  );
}
