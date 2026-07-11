import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-0 max-w-full flex-col overflow-x-hidden">
      <PublicHeader />
      <main className="min-w-0 max-w-full flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
