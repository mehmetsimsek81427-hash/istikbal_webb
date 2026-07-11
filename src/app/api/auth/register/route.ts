import { registerUser } from "@/lib/auth";
import type { KayitVerisi } from "@/types/auth";

export async function POST(request: Request) {
    try {
        const body: KayitVerisi = await request.json();

        // Zorunlu alanları kontrol et
        if (!body.firstName || !body.lastName || !body.email || !body.password) {
            return Response.json(
                { basarili: false, mesaj: "Tüm alanlar zorunludur." },
                { status: 400 }
            );
        }

        const sonuc = await registerUser(body);

        const statusKodu = sonuc.basarili ? 201 : 400;
        return Response.json(sonuc, { status: statusKodu });
    } catch (hata) {
        console.error("[/api/auth/register] Hata:", hata);
        return Response.json(
            { basarili: false, mesaj: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}
