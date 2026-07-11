import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const kullanici = await getCurrentUser();

        if (!kullanici) {
            return Response.json(
                { basarili: false, mesaj: "Oturum açılmamış." },
                { status: 401 }
            );
        }

        return Response.json({
            basarili: true,
            kullanici: {
                id: kullanici.id,
                email: kullanici.email,
                firstName: kullanici.firstName,
                lastName: kullanici.lastName,
            },
        });
    } catch (hata) {
        console.error("[/api/auth/me] Hata:", hata);
        return Response.json(
            { basarili: false, mesaj: "Sunucu hatası." },
            { status: 500 }
        );
    }
}
