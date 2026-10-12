import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function updateSession(
  request: NextRequest,
  requestHeaders: Headers = request.headers,
) {
  const forward = { request: { headers: requestHeaders } };

  if (!isSupabaseConfigured()) {
    return NextResponse.next(forward);
  }

  let supabaseResponse = NextResponse.next(forward);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Keep the forwarded headers in sync with the refreshed cookies.
          const cookieHeader = request.headers.get("cookie");
          if (cookieHeader !== null && requestHeaders !== request.headers) {
            requestHeaders.set("cookie", cookieHeader);
          }
          supabaseResponse = NextResponse.next(forward);
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
