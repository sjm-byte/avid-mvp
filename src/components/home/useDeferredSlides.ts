"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Hero carousels render the first slide right away and hold back the rest
 * until the page has finished loading. Slides are only fetched when the
 * carousel is actually visible (the home page mounts both a mobile and a
 * desktop hero and hides one with CSS), so a phone never downloads the
 * desktop images and vice versa.
 */
export function useDeferredSlides(ref: RefObject<HTMLElement | null>) {
  const [loadRest, setLoadRest] = useState(false);

  useEffect(() => {
    const isVisible = () => {
      const el = ref.current;
      return !!el && el.getClientRects().length > 0;
    };

    let idle: number | undefined;
    const start = () => {
      if (!isVisible()) return;
      idle = window.setTimeout(() => setLoadRest(true), 1200);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (idle) window.clearTimeout(idle);
    };
  }, [ref]);

  return loadRest;
}
