"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toEnglishPath } from "@/lib/i18n/locale";

const DISMISS_KEY = "avid-lang-suggestion-dismissed";

/**
 * Small, dismissible note on the Persian site for visitors whose browser
 * does not list Persian among its languages: offers the English version.
 */
export function EnglishSuggestion() {
  const pathname = usePathname() || "/";
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* storage unavailable: still fine to show */
    }
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    const prefersPersian = langs.some((l) => l?.toLowerCase().startsWith("fa"));
    if (!prefersPersian) setShow(true);
  }, []);

  if (!show) return null;

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      dir="ltr"
      lang="en"
      className="fixed bottom-4 left-4 z-[1100] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-gold/40 bg-navy py-2 pe-2 ps-4 font-en text-sm text-white shadow-lg"
      role="region"
      aria-label="Language"
    >
      <span>This site is also available in English.</span>
      <a
        href={toEnglishPath(pathname)}
        hrefLang="en"
        className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy hover:bg-gold-light"
      >
        View in English
      </a>
      <button
        type="button"
        onClick={dismiss}
        className="flex size-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
