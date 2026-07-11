import Link from "next/link";
import { BRAND_ASSETS } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface AvidLogoProps {
  href?: string;
  variant?: "full" | "mark";
  tone?: "default" | "light";
  className?: string;
  imageClassName?: string;
}

export function AvidLogo({
  href = "/",
  variant = "full",
  tone = "default",
  className,
  imageClassName,
}: AvidLogoProps) {
  const src =
    variant === "mark"
      ? BRAND_ASSETS.logoMark
      : tone === "light"
        ? BRAND_ASSETS.logoLight
        : BRAND_ASSETS.logo;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="آوید"
      width={variant === "mark" ? 32 : 120}
      height={32}
      className={cn(
        "h-8 w-auto shrink-0",
        variant === "mark" && "h-8 w-8",
        imageClassName
      )}
    />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{image}</span>;
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      {image}
    </Link>
  );
}
