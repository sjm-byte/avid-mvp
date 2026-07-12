"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Users,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";

const adminNavItems = [
  { href: "/admin", label: "داشبورد مدیرعامل", icon: LayoutDashboard },
  { href: "/admin/projects", label: "پروژه‌ها", icon: List },
  { href: "/admin/investors", label: "سرمایه‌گذاران", icon: Users },
];

interface AdminSidebarProps {
  user: UserProfile;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2">
          <AvidLogo href="/admin" variant="mark" tone="light" />
          <span className="text-sm font-semibold text-sidebar-foreground">
            مدیریت
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent font-medium text-white"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-sidebar-accent text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              مدیرعامل
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
          asChild
        >
          <Link href="/dashboard">پنل سرمایه‌گذار</Link>
        </Button>
        <LogoutButton />
      </div>
    </aside>
  );
}
