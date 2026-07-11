import { SignJWT, jwtVerify } from "jose";
import type { JwtPayload } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET ortam değişkeni tanımlanmamış!");
}

// TextEncoder ile secret'ı Uint8Array'e dönüştürüyoruz (jose kütüphanesi gereksinimi)
const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * Verilen payload ile yeni bir JWT token oluşturur (7 gün geçerli).
 */
export async function tokenOlustur(payload: JwtPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secretKey);
}

/**
 * Verilen token'ı doğrular ve payload'ı döndürür.
 * Geçersiz veya süresi dolmuş token için null döner.
 */
export async function tokenDogrula(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as unknown as JwtPayload;
    } catch {
        return null;
    }
}
