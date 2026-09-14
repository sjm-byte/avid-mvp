import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MobilePublicHeader } from "@/components/layout/mobile/MobilePublicHeader";
import { MobilePublicFooter } from "@/components/layout/mobile/MobilePublicFooter";
import { cn } from "@/lib/utils";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-0 max-w-full flex-col overflow-x-hidden">
      <div className="md:hidden">
        <MobilePublicHeader />
      </div>
      <div className="hidden md:block">
        <PublicHeader />
      </div>
      <main
        className={cn(
          "min-w-0 max-w-full flex-1",
          "max-md:bg-[#18141f] max-md:text-white",
          // Mobile-only design tokens so shadcn surfaces match homepage chrome.
          "max-md:[--background:255_18%_10%]",
          "max-md:[--foreground:0_0%_97%]",
          "max-md:[--card:255_16%_14%]",
          "max-md:[--card-foreground:0_0%_97%]",
          "max-md:[--popover:255_16%_14%]",
          "max-md:[--popover-foreground:0_0%_97%]",
          "max-md:[--primary:270_32%_58%]",
          "max-md:[--primary-foreground:0_0%_100%]",
          "max-md:[--secondary:255_14%_18%]",
          "max-md:[--secondary-foreground:0_0%_96%]",
          "max-md:[--muted:255_12%_18%]",
          "max-md:[--muted-foreground:255_8%_72%]",
          "max-md:[--accent:255_14%_18%]",
          "max-md:[--accent-foreground:0_0%_96%]",
          "max-md:[--border:255_10%_24%]",
          "max-md:[--input:255_10%_24%]",
          "max-md:[--ring:270_32%_58%]",
          "max-md:[--navy:270_28%_42%]",
          "max-md:[--navy-light:270_30%_52%]",
        )}
      >
        {children}
      </main>
      <div className="md:hidden">
        <MobilePublicFooter />
      </div>
      <div className="hidden md:block">
        <PublicFooter />
      </div>
    </div>
  );
}
