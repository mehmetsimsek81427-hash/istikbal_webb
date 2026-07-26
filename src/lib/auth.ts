import { cookies } from "next/headers";
import { tokenOlustur, tokenDogrula } from "./jwt";
import type { KayitVerisi, GirisVerisi, AuthYanit, KullaniciOzeti, JwtPayload } from "@/types/auth";
import { getCookiePath } from "@/lib/base-path";

const COOKIE_ADI = "istikbal_token";

// ─── Cookie Seçenekleri ──────────────────────────────────────────────────────

const cookieSecenekleri = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 gün (saniye cinsinden)
    path: getCookiePath(),
};

// ─── Kayıt Fonksiyonu ────────────────────────────────────────────────────────

/**
 * Yeni kullanıcı kaydeder.
 * Validasyon, hash'leme ve token oluşturma işlemlerini yönetir.
 *
 * NOT: Bu fonksiyon yalnızca Route Handler içinden çağrılmalıdır
 * çünkü prisma ve bcryptjs Node.js runtime gerektirir.
 */
export async function registerUser(veri: KayitVerisi): Promise<AuthYanit> {
    const { prisma } = await import("./prisma");
    const bcrypt = await import("bcryptjs");

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(veri.email)) {
        return { basarili: false, mesaj: "E-posta adresi geçersiz." };
    }

    // Şifre uzunluğu kontrolü
    if (veri.password.length < 6) {
        return { basarili: false, mesaj: "Şifre en az 6 karakter olmalıdır." };
    }

    // Ad ve soyad kontrolü
    if (!veri.firstName.trim() || !veri.lastName.trim()) {
        return { basarili: false, mesaj: "Ad ve soyad alanları zorunludur." };
    }

    // E-posta benzersizlik kontrolü
    const mevcutKullanici = await prisma.user.findUnique({
        where: { email: veri.email.toLowerCase().trim() },
    });

    if (mevcutKullanici) {
        return { basarili: false, mesaj: "Kullanıcı zaten kayıtlı." };
    }

    // Şifreyi hash'le
    const hashedSifre = await bcrypt.hash(veri.password, 12);

    // Kullanıcıyı veritabanına kaydet
    const yeniKullanici = await prisma.user.create({
        data: {
            firstName: veri.firstName.trim(),
            lastName: veri.lastName.trim(),
            email: veri.email.toLowerCase().trim(),
            password: hashedSifre,
        },
    });

    // JWT token oluştur
    const tokenPayload: JwtPayload = {
        id: yeniKullanici.id,
        email: yeniKullanici.email,
        firstName: yeniKullanici.firstName,
        lastName: yeniKullanici.lastName,
    };

    const token = await tokenOlustur(tokenPayload);

    // Secure cookie'ye kaydet
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_ADI, token, cookieSecenekleri);

    const kullanici: KullaniciOzeti = {
        id: yeniKullanici.id,
        firstName: yeniKullanici.firstName,
        lastName: yeniKullanici.lastName,
        email: yeniKullanici.email,
    };

    return { basarili: true, mesaj: "Kayıt başarılı.", kullanici };
}

// ─── Giriş Fonksiyonu ────────────────────────────────────────────────────────

/**
 * E-posta ve şifreyle kullanıcı girişi yapar.
 */
export async function loginUser(veri: GirisVerisi): Promise<AuthYanit> {
    const { prisma } = await import("./prisma");
    const bcrypt = await import("bcryptjs");

    // Kullanıcıyı bul
    const kullanici = await prisma.user.findUnique({
        where: { email: veri.email.toLowerCase().trim() },
    });

    if (!kullanici) {
        return {
            basarili: false,
            mesaj: "Kullanıcı bulunamadı. Lütfen önce üye olunuz.",
        };
    }

    // Şifreyi karşılaştır
    const sifreEslesiyor = await bcrypt.compare(veri.password, kullanici.password);

    if (!sifreEslesiyor) {
        return { basarili: false, mesaj: "E-posta veya şifre hatalı." };
    }

    // JWT token oluştur
    const tokenPayload: JwtPayload = {
        id: kullanici.id,
        email: kullanici.email,
        firstName: kullanici.firstName,
        lastName: kullanici.lastName,
    };

    const token = await tokenOlustur(tokenPayload);

    // Secure cookie'ye kaydet
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_ADI, token, cookieSecenekleri);

    const kullaniciOzeti: KullaniciOzeti = {
        id: kullanici.id,
        firstName: kullanici.firstName,
        lastName: kullanici.lastName,
        email: kullanici.email,
    };

    return { basarili: true, mesaj: "Giriş başarılı.", kullanici: kullaniciOzeti };
}

// ─── Çıkış Fonksiyonu ────────────────────────────────────────────────────────

/**
 * Kullanıcının oturumunu kapatır (cookie'yi siler).
 */
export async function logoutUser(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_ADI, "", { ...cookieSecenekleri, maxAge: 0 });
}

// ─── Mevcut Kullanıcı ────────────────────────────────────────────────────────

/**
 * Cookie'deki JWT token'ı okuyarak mevcut kullanıcı bilgilerini döndürür.
 * Oturum açılmamışsa null döner.
 */
export async function getCurrentUser(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_ADI)?.value;

    if (!token) return null;

    return tokenDogrula(token);
}
