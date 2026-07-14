"use client";

import { useState } from "react";
import { PROJECT_IMAGE_ASSETS } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface SafeProjectCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
}

export function SafeProjectCoverImage({
  src,
  alt,
  className,
  aspectClassName = "aspect-[16/9]",
}: SafeProjectCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? PROJECT_IMAGE_ASSETS.placeholder : src;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/30",
        aspectClassName,
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={failed ? "" : alt}
        aria-hidden={failed}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
      {failed && (
        <p className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          تصویر پروژه
        </p>
      )}
    </div>
  );
}
