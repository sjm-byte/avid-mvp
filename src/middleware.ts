import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { LOCALE_HEADER, localeFromPathname } from "@/lib/i18n/locale";

export async function middleware(request: NextRequest) {
  // Tell the root layout which language/direction to render (<html lang dir>).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, localeFromPathname(request.nextUrl.pathname));
  return await updateSession(request, requestHeaders);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
