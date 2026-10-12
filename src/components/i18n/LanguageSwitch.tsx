"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toEnglishPath, toPersianPath, type Locale } from "@/lib/i18n/locale";

/**
 * Link to the same page in the other language.
 * Always a full page load (plain <a>), so <html lang/dir> is rendered fresh.
 */
export function LanguageSwitch({
  current,
  className,
  variant = "pill",
}: {
  current: Locale;
  className?: string;
  /** "pill": compact chip for headers; "text": inline footer link. */
  variant?: "pill" | "text";
}) {
  const pathname = usePathname() || "/";
  const target = current === "fa" ? toEnglishPath(pathname) : toPersianPath(pathname);
  const label = current === "fa" ? "English" : "فارسی";
  const hrefLang = current === "fa" ? "en" : "fa";

  return (
    <a
      href={target}
      hrefLang={hrefLang}
      lang={hrefLang}
      onClick={(e) => {
        // Keep ?section=… etc. when switching language.
        if (window.location.search) {
          e.preventDefault();
          window.location.href = target + window.location.search;
        }
      }}
      className={cn(
        variant === "pill" &&
          "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 px-3 text-xs font-medium text-white/90 transition-colors hover:border-gold/60 hover:text-gold",
        variant === "text" && "hover:text-gold",
        className,
      )}
      aria-label={current === "fa" ? "View this page in English" : "نمایش این صفحه به فارسی"}
    >
      <GlobeIcon className="size-3.5" />
      <span className={hrefLang === "en" ? "font-en tracking-wide" : "font-sans"}>{label}</span>
    </a>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z" />
    </svg>
  );
}
