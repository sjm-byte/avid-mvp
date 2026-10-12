import type { Metadata } from "next";
import { EnHeader } from "@/components/en/EnHeader";
import { EnFooter } from "@/components/en/EnFooter";
import { EnMobileHeader } from "@/components/en/mobile/EnMobileHeader";
import { EnMobileFooter } from "@/components/en/mobile/EnMobileFooter";
import { cn } from "@/lib/utils";

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
      <div className="md:hidden">
        <EnMobileHeader />
      </div>
      <div className="hidden md:block">
        <EnHeader />
      </div>
      <main
        id="main"
        className={cn(
          "min-w-0 flex-1",
          // Phones: same soft-mist purple palette as the Persian mobile site.
          "max-md:bg-[#F8F6FC] max-md:text-[#292334]",
          "max-md:[--background:270_28%_97%]",
          "max-md:[--foreground:255_18%_16%]",
          "max-md:[--card:270_22%_94%]",
          "max-md:[--card-foreground:255_18%_16%]",
          "max-md:[--primary:270_32%_48%]",
          "max-md:[--primary-foreground:0_0%_100%]",
          "max-md:[--muted:270_16%_90%]",
          "max-md:[--muted-foreground:255_12%_34%]",
          "max-md:[--border:270_12%_82%]",
          "max-md:[--input:270_12%_82%]",
          "max-md:[--navy:270_28%_36%]",
          "max-md:[--navy-light:270_30%_46%]",
        )}
      >
        {children}
      </main>
      <div className="md:hidden">
        <EnMobileFooter />
      </div>
      <div className="hidden md:block">
        <EnFooter />
      </div>
    </div>
  );
}
