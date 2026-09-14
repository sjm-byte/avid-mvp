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
          // Soft mist canvas on mobile; homepage paints its own dark root.
          "max-md:bg-[#F8F6FC] max-md:text-[#292334]",
          "max-md:[--background:270_28%_97%]",
          "max-md:[--foreground:255_18%_16%]",
          "max-md:[--card:270_22%_94%]",
          "max-md:[--card-foreground:255_18%_16%]",
          "max-md:[--popover:270_22%_96%]",
          "max-md:[--popover-foreground:255_18%_16%]",
          "max-md:[--primary:270_32%_48%]",
          "max-md:[--primary-foreground:0_0%_100%]",
          "max-md:[--secondary:270_18%_90%]",
          "max-md:[--secondary-foreground:255_18%_20%]",
          "max-md:[--muted:270_16%_90%]",
          "max-md:[--muted-foreground:255_12%_34%]",
          "max-md:[--accent:270_18%_90%]",
          "max-md:[--accent-foreground:255_18%_20%]",
          "max-md:[--border:270_12%_82%]",
          "max-md:[--input:270_12%_82%]",
          "max-md:[--ring:270_32%_48%]",
          "max-md:[--navy:270_28%_36%]",
          "max-md:[--navy-light:270_30%_46%]",
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
