import { loginUser } from "@/lib/auth";
import type { GirisVerisi } from "@/types/auth";

export async function POST(request: Request) {
    try {
        const body: GirisVerisi = await request.json();

        // Zorunlu alanları kontrol et
        if (!body.email || !body.password) {
            return Response.json(
                { basarili: false, mesaj: "E-posta ve şifre zorunludur." },
                { status: 400 }
            );
        }

        const sonuc = await loginUser(body);

        const statusKodu = sonuc.basarili ? 200 : 401;
        return Response.json(sonuc, { status: statusKodu });
    } catch (hata) {
        console.error("[/api/auth/login] Hata:", hata);
        return Response.json(
            { basarili: false, mesaj: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}
