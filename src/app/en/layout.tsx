import type { Metadata } from "next";
import { EnHeader } from "@/components/en/EnHeader";
import { EnFooter } from "@/components/en/EnFooter";

export const metadata: Metadata = {
  title: {
    default: "Avid — Transparent participation in real projects",
    template: "%s — Avid",
  },
  description:
    "Avid is a project-participation management platform. Review each project on its own, see the risks, and follow your capital step by step.",
  alternates: {
    languages: { fa: "/", en: "/en" },
  },
  openGraph: {
    siteName: "Avid",
    locale: "en_US",
    type: "website",
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="en-site flex min-h-screen min-w-0 flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-navy"
      >
        Skip to content
      </a>
      <EnHeader />
      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
      <EnFooter />
    </div>
  );
}
