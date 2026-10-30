import type { Metadata } from "next";
import { Atkinson_Hyperlegible, DM_Mono, Hind_Siliguri, Newsreader } from "next/font/google";
import { AppTabBar } from "@/components/AppTabBar";
import { PageTransition } from "@/components/PageTransition";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WelcomePrompt } from "@/components/WelcomePrompt";
import { getReviewer } from "@/lib/auth";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
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

/**
 * Runs before paint so a stored dark choice never flashes light. Light is the
 * default, so this only opens the theme when the visitor asked for dark.
 */
const THEME_BOOTSTRAP =
  '(function(){try{if(localStorage.getItem("ab_theme")==="dark"){var root=document.documentElement;root.dataset.theme="dark";root.style.colorScheme="dark";}}catch(error){}})();';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, reviewer] = await Promise.all([getLang(), getReviewer()]);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${newsreader.variable} ${atkinson.variable} ${hindSiliguri.variable} ${dmMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(lang)) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-[300%] rounded-control border border-accent bg-surface px-4 py-3 text-sm font-bold text-accent-ink shadow-lift transition-transform duration-200 focus:translate-y-0"
        >
          {t(lang, "app.skipToContent")}
        </a>
        <SiteHeader
          lang={lang}
          isReviewer={Boolean(reviewer)}
          isAdmin={reviewer?.role === "admin"}
        />
        <WelcomePrompt lang={lang} />
        <main
          id="main"
          className="flex-1 pt-[4.5rem] pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pt-[5rem] lg:pb-0"
        >
          <PageTransition>{children}</PageTransition>
        </main>
        <AppTabBar lang={lang} isReviewer={Boolean(reviewer)} />
        <SiteFooter
          lang={lang}
          isReviewer={Boolean(reviewer)}
          isAdmin={reviewer?.role === "admin"}
        />
      </body>
    </html>
  );
}
