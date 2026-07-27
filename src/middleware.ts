import { NextResponse, type NextRequest } from "next/server";
import { BASE_PATH, withBasePath } from "@/lib/base-path";
import { updateSession } from "@/lib/supabase/middleware";

function stripBasePath(pathname: string): string {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || "/";
  }
  return pathname;
}

function requiresAuth(pathname: string): boolean {
  const path = stripBasePath(pathname);

  if (path === "/profil" || path === "/profil/") return true;
  if (path === "/kullanici-hakkinda" || path.startsWith("/kullanici-hakkinda/")) return true;
  if (path === "/profil/hakkimda" || path.startsWith("/profil/hakkimda/")) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!requiresAuth(pathname)) {
    return response;
  }

  if (!user) {
    const girisUrl = new URL(withBasePath("/giris"), request.url);
    girisUrl.searchParams.set("uyari", "Bu sayfaya erişmek için giriş yapmalısınız.");
    girisUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(girisUrl);
  }

  return response;
}

export const config = {
  matcher: ["/profil", "/profil/:path*", "/kullanici-hakkinda", "/profile/:path*"],
};
