"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { KullaniciOzeti, KayitVerisi, GirisVerisi, AuthYanit } from "@/types/auth";

// ─── Context Tipi ────────────────────────────────────────────────────────────

interface AuthContextType {
    kullanici: KullaniciOzeti | null;
    yukleniyorMu: boolean;
    girisYap: (veri: GirisVerisi) => Promise<AuthYanit>;
    kayitOl: (veri: KayitVerisi) => Promise<AuthYanit>;
    cikisYap: () => Promise<void>;
}

// ─── Context Oluşturma ────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [kullanici, setKullanici] = useState<KullaniciOzeti | null>(null);
    const [yukleniyorMu, setYukleniyorMu] = useState(true);
    const router = useRouter();

    // Uygulama açıldığında mevcut oturumu kontrol et
    useEffect(() => {
        oturumKontrol();
    }, []);

    const oturumKontrol = async () => {
        try {
            const yanit = await fetch("/api/auth/me");
            if (yanit.ok) {
                const veri = await yanit.json();
                if (veri.basarili && veri.kullanici) {
                    setKullanici(veri.kullanici);
                }
            }
        } catch {
            // Sessizce geç — kullanıcı oturum açmamış demektir
        } finally {
            setYukleniyorMu(false);
        }
    };

    // ─── Giriş Yap ─────────────────────────────────────────────────────────────

    const girisYap = useCallback(async (veri: GirisVerisi): Promise<AuthYanit> => {
        try {
            const yanit = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(veri),
            });

            const sonuc: AuthYanit = await yanit.json();

            if (sonuc.basarili && sonuc.kullanici) {
                setKullanici(sonuc.kullanici);
            }

            return sonuc;
        } catch {
            return { basarili: false, mesaj: "Bağlantı hatası. Lütfen tekrar deneyin." };
        }
    }, []);

    // ─── Kayıt Ol ──────────────────────────────────────────────────────────────

    const kayitOl = useCallback(async (veri: KayitVerisi): Promise<AuthYanit> => {
        try {
            const yanit = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(veri),
            });

            const sonuc: AuthYanit = await yanit.json();

            if (sonuc.basarili && sonuc.kullanici) {
                setKullanici(sonuc.kullanici);
            }

            return sonuc;
        } catch {
            return { basarili: false, mesaj: "Bağlantı hatası. Lütfen tekrar deneyin." };
        }
    }, []);

    // ─── Çıkış Yap ─────────────────────────────────────────────────────────────

    const cikisYap = useCallback(async (): Promise<void> => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            setKullanici(null);
            router.push("/");
            router.refresh();
        }
    }, [router]);

    return (
        <AuthContext.Provider
            value={{ kullanici, yukleniyorMu, girisYap, kayitOl, cikisYap }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth bir AuthProvider içinde kullanılmalıdır!");
    }
    return context;
}
