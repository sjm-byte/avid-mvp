"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Pencil, UserRound, X } from "lucide-react";
import { AvidLogo } from "@/components/brand/AvidLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/user";

interface InvestorHeaderProps {
  user: UserProfile;
}

export function InvestorHeader({ user }: InvestorHeaderProps) {
  const router = useRouter();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  async function handleLogout() {
    document.cookie = "avid_demo_role=; path=/; max-age=0";
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured
    }
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="flex h-16 min-w-0 shrink-0 items-center justify-between gap-4 border-b bg-background pr-4 pl-5 sm:pr-6 sm:pl-7">
        <AvidLogo href="/dashboard" tone="default" />

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
              className={cn(
                "flex max-w-[12rem] items-center gap-2 rounded-md px-2 py-1.5 text-right transition-colors",
                "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-xs",
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-muted text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 truncate text-sm font-medium sm:inline">
                {user.fullName}
              </span>
              <ChevronDown
                className={cn(
                  "hidden size-4 shrink-0 text-muted-foreground transition-transform sm:inline",
                  menuOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {menuOpen && (
              <div
                id={menuId}
                role="menu"
                className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-md border bg-background py-1 text-sm shadow-md"
              >
                <Link
                  role="menuitem"
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2.5 hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserRound className="size-4 text-muted-foreground" />
                  مشاهده پروفایل
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-right hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditModalOpen(true);
                  }}
                >
                  <Pencil className="size-4 text-muted-foreground" />
                  ویرایش اطلاعات
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-right text-destructive hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false);
                    void handleLogout();
                  }}
                >
                  <LogOut className="size-4" />
                  خروج
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {editModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="investor-edit-title"
            className="w-full max-w-md rounded-lg border bg-background p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="investor-edit-title"
                className="text-base font-semibold leading-snug"
              >
                ویرایش اطلاعات سرمایه‌گذار
              </h2>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="بستن"
                onClick={() => setEditModalOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              اطلاعات مورد نیاز بعداً تکمیل می‌شود.
            </p>
            <div className="mt-5 flex justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditModalOpen(false)}
              >
                بستن
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
