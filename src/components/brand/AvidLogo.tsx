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
  className,
  imageClassName,
}: AvidLogoProps) {
  const src = variant === "mark" ? BRAND_ASSETS.logoMark : BRAND_ASSETS.logo;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="آوید"
      width={variant === "mark" ? 40 : 160}
      height={40}
      className={cn(
        "h-10 w-auto shrink-0 object-contain",
        variant === "mark" && "h-9 w-9",
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
      className={cn(
        "inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {image}
    </Link>
  );
}
