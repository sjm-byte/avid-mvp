import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { MobilePublicHeader } from "@/components/layout/mobile/MobilePublicHeader";
import { MobilePublicFooter } from "@/components/layout/mobile/MobilePublicFooter";

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
      <main className="min-w-0 max-w-full flex-1">{children}</main>
      <div className="md:hidden">
        <MobilePublicFooter />
      </div>
      <div className="hidden md:block">
        <PublicFooter />
      </div>
    </div>
  );
}
