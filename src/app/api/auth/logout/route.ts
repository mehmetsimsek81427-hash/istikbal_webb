import { logoutUser } from "@/lib/auth";

export async function POST() {
    try {
        await logoutUser();
        return Response.json({ basarili: true, mesaj: "Çıkış başarılı." });
    } catch (hata) {
        console.error("[/api/auth/logout] Hata:", hata);
        return Response.json(
            { basarili: false, mesaj: "Sunucu hatası." },
            { status: 500 }
        );
    }
}
