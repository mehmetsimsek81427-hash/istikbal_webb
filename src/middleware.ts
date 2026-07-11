import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tokenDogrula } from "@/lib/jwt";

// Oturum açılması zorunlu olan rotalar
const KORUNAN_ROTALAR = ["/sepetim", "/profil", "/siparislerim"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Korunan rota mı kontrol et
    const korunanRota = KORUNAN_ROTALAR.some((rota) =>
        pathname.startsWith(rota)
    );

    if (!korunanRota) {
        return NextResponse.next();
    }

    // Cookie'den token'ı oku
    const token = request.cookies.get("istikbal_token")?.value;

    if (!token) {
        // Kullanıcıyı kayıt sayfasına yönlendir
        const kayitUrl = new URL("/kayit", request.url);
        kayitUrl.searchParams.set(
            "uyari",
            "Lütfen öncelikle üye olunuz."
        );
        kayitUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(kayitUrl);
    }

    // Token'ı doğrula
    const payload = await tokenDogrula(token);

    if (!payload) {
        // Geçersiz veya süresi dolmuş token — cookie'yi temizle ve yönlendir
        const kayitUrl = new URL("/kayit", request.url);
        kayitUrl.searchParams.set(
            "uyari",
            "Lütfen öncelikle üye olunuz."
        );
        kayitUrl.searchParams.set("from", pathname);

        const yanit = NextResponse.redirect(kayitUrl);
        yanit.cookies.set("istikbal_token", "", { maxAge: 0, path: "/" });
        return yanit;
    }

    // Kimlik doğrulandı — isteği devam ettir
    return NextResponse.next();
}

export const config = {
    matcher: ["/sepetim/:path*", "/profil/:path*", "/siparislerim/:path*"],
};
