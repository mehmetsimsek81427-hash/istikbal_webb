"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

// ─── Yönlendirme mesajını query param'dan oku ─────────────────────────────────
function YonlendirmeMesaji() {
    const searchParams = useSearchParams();
    const mesaj = searchParams.get("mesaj");
    if (!mesaj) return null;
    return (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-4 py-3 rounded-xl">
            <span className="text-base mt-0.5">✅</span>
            <span>{decodeURIComponent(mesaj)}</span>
        </div>
    );
}

// ─── Giriş Formu ──────────────────────────────────────────────────────────────
function GirisFormu() {
    const { kullanici, yukleniyorMu, girisYap } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [sifreGoster, setSifreGoster] = useState(false);
    const [hata, setHata] = useState("");
    const [yukleniyor, setYukleniyor] = useState(false);

    // Zaten giriş yapmış kullanıcıyı anasayfaya yönlendir
    useEffect(() => {
        if (!yukleniyorMu && kullanici) {
            router.replace("/");
        }
    }, [kullanici, yukleniyorMu, router]);

    // İstemci tarafı validasyon
    const validateForm = (): string | null => {
        if (!email.trim()) return "E-posta adresi zorunludur.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Geçerli bir e-posta adresi giriniz.";
        if (!sifre) return "Şifre zorunludur.";
        if (sifre.length < 6) return "Şifre en az 6 karakter olmalıdır.";
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setHata("");

        const validasyonHatasi = validateForm();
        if (validasyonHatasi) {
            setHata(validasyonHatasi);
            return;
        }

        setYukleniyor(true);
        const sonuc = await girisYap({ email: email.trim(), password: sifre });
        setYukleniyor(false);

        if (sonuc.basarili) {
            const from = searchParams.get("from") ?? "/";
            router.push(from);
            router.refresh();
        } else {
            setHata(sonuc.mesaj);
        }
    };

    // Auth yükleniyorken iskelet göster
    if (yukleniyorMu) {
        return (
            <div className="w-full max-w-[460px] flex flex-col items-center gap-4 py-12">
                <div className="w-12 h-12 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[460px] space-y-5">

            {/* Yönlendirme & Hata Mesajları */}
            <Suspense fallback={null}>
                <YonlendirmeMesaji />
            </Suspense>

            {hata && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                    <span className="text-base mt-0.5">⚠️</span>
                    <span>{hata}</span>
                </div>
            )}

            {/* Kart */}
            <div className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">

                {/* Kart Başlık Bandı */}
                <div className="bg-gradient-to-r from-[#00519E] to-[#0066C2] px-8 py-6 text-white text-center">
                    <h2 className="text-xl font-black tracking-tight">Hesabınıza Giriş Yapın</h2>
                    <p className="text-white/70 text-xs mt-1 font-medium">
                        Fırsatlar ve siparişleriniz için giriş yapın
                    </p>
                </div>

                <div className="p-8 space-y-5">

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">

                        {/* E-posta */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block">
                                E-posta Adresi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                                    ✉️
                                </span>
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setHata(""); }}
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#00519E]/10 placeholder-gray-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Şifre */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block">
                                Şifre <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                                    🔒
                                </span>
                                <input
                                    type={sifreGoster ? "text" : "password"}
                                    placeholder="Şifrenizi giriniz"
                                    value={sifre}
                                    onChange={(e) => { setSifre(e.target.value); setHata(""); }}
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-12 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#00519E]/10 placeholder-gray-400 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSifreGoster(!sifreGoster)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-sm"
                                    aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
                                >
                                    {sifreGoster ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Beni Hatırla & Şifremi Unuttum */}
                        <div className="flex justify-between items-center pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 accent-[#00519E] cursor-pointer"
                                />
                                <span className="text-xs font-semibold text-gray-600">Beni Hatırla</span>
                            </label>
                            <Link
                                href="/sifremi-unuttum"
                                className="text-xs font-semibold text-[#00519E] hover:underline"
                            >
                                Şifremi Unuttum
                            </Link>
                        </div>

                        {/* Giriş Butonu */}
                        <button
                            type="submit"
                            disabled={yukleniyor}
                            className="w-full bg-[#00519E] text-white font-black py-3.5 rounded-xl text-sm tracking-wide hover:bg-[#003d7a] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {yukleniyor ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                "Giriş Yap"
                            )}
                        </button>

                    </form>

                    {/* Ayraç */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-semibold">ya da</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Sosyal Giriş */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <span className="text-base">🌐</span>
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <span className="text-base">🔵</span>
                            <span>Facebook</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Üye Ol Yönlendirmesi */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-white text-center space-y-3">
                <p className="text-sm font-bold text-gray-800">Henüz üye değil misiniz?</p>
                <p className="text-xs text-gray-500">
                    Üye olarak kampanyalardan, özel tekliflerden ve kargo avantajlarından yararlanın.
                </p>
                <Link
                    href="/kayit"
                    className="inline-block w-full border-2 border-[#00519E] text-[#00519E] font-black py-3 rounded-xl text-sm text-center hover:bg-[#00519E] hover:text-white active:scale-[0.99] transition-all"
                >
                    Hemen Üye Ol
                </Link>
            </div>

        </div>
    );
}

// ─── Sayfa ────────────────────────────────────────────────────────────────────
export default function GirisPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-10 px-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 select-none mb-8">
                <span className="text-[#F2A900] text-2xl font-black italic">///</span>
                <span className="text-[#00519E] text-3xl font-black italic tracking-tighter">istikbal</span>
            </Link>

            {/* Form içeriği — searchParams için Suspense şart */}
            <Suspense fallback={
                <div className="w-full max-w-[460px] flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
                </div>
            }>
                <GirisFormu />
            </Suspense>

            {/* Alt Bilgi */}
            <p className="mt-8 text-xs text-gray-400 text-center">
                Giriş yaparak{" "}
                <Link href="/" className="text-[#00519E] hover:underline font-semibold">
                    Kullanım Koşulları
                </Link>
                {" "}ve{" "}
                <Link href="/" className="text-[#00519E] hover:underline font-semibold">
                    Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
            </p>

        </div>
    );
}
