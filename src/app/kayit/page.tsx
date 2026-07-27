"use client";

import Link from "next/link";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ─── Korumalı sayfa uyarısını query param'dan oku ─────────────────────────────
function KorumaUyarisi() {
    const searchParams = useSearchParams();
    const uyari = searchParams.get("uyari");
    if (!uyari) return null;
    return (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl">
            <span className="text-base mt-0.5">🔒</span>
            <span>{decodeURIComponent(uyari)}</span>
        </div>
    );
}

// ─── Şifre güç göstergesi ─────────────────────────────────────────────────────
function SifreGucGostergesi({ sifre }: { sifre: string }) {
    const guc = (() => {
        if (sifre.length === 0) return 0;
        let puan = 0;
        if (sifre.length >= 6) puan++;
        if (sifre.length >= 10) puan++;
        if (/[A-Z]/.test(sifre)) puan++;
        if (/[0-9]/.test(sifre)) puan++;
        if (/[^A-Za-z0-9]/.test(sifre)) puan++;
        return puan;
    })();

    const seviyeler = [
        { etiket: "Çok Zayıf", renk: "bg-red-400" },
        { etiket: "Zayıf", renk: "bg-orange-400" },
        { etiket: "Orta", renk: "bg-yellow-400" },
        { etiket: "Güçlü", renk: "bg-blue-500" },
        { etiket: "Çok Güçlü", renk: "bg-green-500" },
    ];

    if (sifre.length === 0) return null;

    const seviye = seviyeler[Math.min(guc - 1, 4)];

    return (
        <div className="space-y-1.5 mt-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= guc ? seviye.renk : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>
            <p className={`text-[10px] font-bold ${guc <= 1 ? "text-red-500" :
                    guc === 2 ? "text-orange-500" :
                        guc === 3 ? "text-yellow-600" :
                            guc === 4 ? "text-blue-600" : "text-green-600"
                }`}>
                Şifre gücü: {seviye.etiket}
            </p>
        </div>
    );
}

// ─── Kayıt Formu ──────────────────────────────────────────────────────────────
function KayitFormu() {
    const { kullanici, yukleniyorMu, kayitOl } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        ad: "",
        soyad: "",
        email: "",
        sifre: "",
        sifreTekrar: "",
        telefon: "",
        dogumTarihi: "",
        cinsiyet: "",
    });

    const [sifreGoster, setSifreGoster] = useState(false);
    const [sifreTekrarGoster, setSifreTekrarGoster] = useState(false);
    const [sozlesme, setSozlesme] = useState(false);
    const [hatalar, setHatalar] = useState<Record<string, string>>({});
    const [genelHata, setGenelHata] = useState("");
    const [yukleniyor, setYukleniyor] = useState(false);

    // Zaten giriş yapmış kullanıcıyı anasayfaya yönlendir
    useEffect(() => {
        if (!yukleniyorMu && kullanici) {
            router.replace("/");
        }
    }, [kullanici, yukleniyorMu, router]);

    const guncelle = (alan: string, deger: string) => {
        setForm((onceki) => ({ ...onceki, [alan]: deger }));
        // O alanın hatasını temizle
        setHatalar((onceki) => ({ ...onceki, [alan]: "" }));
        setGenelHata("");
    };

    // Alan bazlı validasyon
    const alanDogrula = (): boolean => {
        const yeniHatalar: Record<string, string> = {};

        if (!form.ad.trim())
            yeniHatalar.ad = "Ad zorunludur.";
        else if (form.ad.trim().length < 2)
            yeniHatalar.ad = "Ad en az 2 karakter olmalıdır.";

        if (!form.soyad.trim())
            yeniHatalar.soyad = "Soyad zorunludur.";
        else if (form.soyad.trim().length < 2)
            yeniHatalar.soyad = "Soyad en az 2 karakter olmalıdır.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim())
            yeniHatalar.email = "E-posta adresi zorunludur.";
        else if (!emailRegex.test(form.email))
            yeniHatalar.email = "Geçerli bir e-posta adresi giriniz.";

        if (!form.sifre)
            yeniHatalar.sifre = "Şifre zorunludur.";
        else if (form.sifre.length < 6)
            yeniHatalar.sifre = "Şifre en az 6 karakter olmalıdır.";

        if (!form.sifreTekrar)
            yeniHatalar.sifreTekrar = "Şifre tekrarı zorunludur.";
        else if (form.sifre !== form.sifreTekrar)
            yeniHatalar.sifreTekrar = "Şifreler eşleşmiyor.";

        if (!sozlesme)
            yeniHatalar.sozlesme = "Üyelik sözleşmesini kabul etmeniz zorunludur.";

        setHatalar(yeniHatalar);
        return Object.keys(yeniHatalar).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGenelHata("");

        if (!alanDogrula()) return;

        setYukleniyor(true);

        const sonuc = await kayitOl({
            firstName: form.ad.trim(),
            lastName: form.soyad.trim(),
            email: form.email.trim(),
            password: form.sifre,
            phone: form.telefon.trim() || undefined,
            dateOfBirth: form.dogumTarihi || undefined,
            gender: form.cinsiyet || undefined,
        });

        setYukleniyor(false);

        if (sonuc.basarili) {
            // Başarılı kayıt → giriş sayfasına yönlendir
            router.push(
                `/giris?mesaj=${encodeURIComponent("Kayıt başarılı! Lütfen giriş yapınız.")}`
            );
        } else {
            setGenelHata(sonuc.mesaj);
        }
    };

    if (yukleniyorMu) {
        return (
            <div className="w-full max-w-[580px] flex flex-col items-center gap-4 py-12">
                <div className="w-12 h-12 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[580px] space-y-5">

            {/* Korumalı sayfa uyarısı */}
            <Suspense fallback={null}>
                <KorumaUyarisi />
            </Suspense>

            {/* Genel Hata */}
            {genelHata && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                    <span className="text-base mt-0.5">⚠️</span>
                    <span>{genelHata}</span>
                </div>
            )}

            {/* Kart */}
            <div className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">

                {/* Kart Başlık Bandı */}
                <div className="bg-gradient-to-r from-[#00519E] to-[#0066C2] px-8 py-6 text-white text-center">
                    <h2 className="text-xl font-black tracking-tight">Yeni Üyelik Oluşturun</h2>
                    <p className="text-white/70 text-xs mt-1 font-medium">
                        Ücretsiz üye olun, ayrıcalıklardan yararlanın
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* Ad & Soyad */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">
                                    Ad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Adınız"
                                    value={form.ad}
                                    onChange={(e) => guncelle("ad", e.target.value)}
                                    autoComplete="given-name"
                                    className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 placeholder-gray-400 transition-all ${hatalar.ad
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:border-[#00519E] focus:ring-[#00519E]/10"
                                        }`}
                                />
                                {hatalar.ad && (
                                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                        <span>⚠</span> {hatalar.ad}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">
                                    Soyad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Soyadınız"
                                    value={form.soyad}
                                    onChange={(e) => guncelle("soyad", e.target.value)}
                                    autoComplete="family-name"
                                    className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 placeholder-gray-400 transition-all ${hatalar.soyad
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:border-[#00519E] focus:ring-[#00519E]/10"
                                        }`}
                                />
                                {hatalar.soyad && (
                                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                        <span>⚠</span> {hatalar.soyad}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* E-posta */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block">
                                E-posta Adresi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">✉️</span>
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={form.email}
                                    onChange={(e) => guncelle("email", e.target.value)}
                                    autoComplete="email"
                                    className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 placeholder-gray-400 transition-all ${hatalar.email
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:border-[#00519E] focus:ring-[#00519E]/10"
                                        }`}
                                />
                            </div>
                            {hatalar.email && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span>⚠</span> {hatalar.email}
                                </p>
                            )}
                        </div>

                        {/* Şifre */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block">
                                Şifre <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🔒</span>
                                <input
                                    type={sifreGoster ? "text" : "password"}
                                    placeholder="En az 6 karakter"
                                    value={form.sifre}
                                    onChange={(e) => guncelle("sifre", e.target.value)}
                                    autoComplete="new-password"
                                    className={`w-full pl-10 pr-12 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 placeholder-gray-400 transition-all ${hatalar.sifre
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:border-[#00519E] focus:ring-[#00519E]/10"
                                        }`}
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
                            {hatalar.sifre && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span>⚠</span> {hatalar.sifre}
                                </p>
                            )}
                            <SifreGucGostergesi sifre={form.sifre} />
                        </div>

                        {/* Şifre Tekrar */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 block">
                                Şifre Tekrar <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🔒</span>
                                <input
                                    type={sifreTekrarGoster ? "text" : "password"}
                                    placeholder="Şifrenizi tekrar giriniz"
                                    value={form.sifreTekrar}
                                    onChange={(e) => guncelle("sifreTekrar", e.target.value)}
                                    autoComplete="new-password"
                                    className={`w-full pl-10 pr-12 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 placeholder-gray-400 transition-all ${hatalar.sifreTekrar
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                            : form.sifreTekrar && form.sifre === form.sifreTekrar
                                                ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                                                : "border-gray-300 focus:border-[#00519E] focus:ring-[#00519E]/10"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setSifreTekrarGoster(!sifreTekrarGoster)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-sm"
                                    aria-label={sifreTekrarGoster ? "Şifreyi gizle" : "Şifreyi göster"}
                                >
                                    {sifreTekrarGoster ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {hatalar.sifreTekrar && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                    <span>⚠</span> {hatalar.sifreTekrar}
                                </p>
                            )}
                            {form.sifreTekrar && !hatalar.sifreTekrar && form.sifre === form.sifreTekrar && (
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span>✅</span> Şifreler eşleşiyor
                                </p>
                            )}
                        </div>

                        {/* Telefon & Doğum Tarihi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">
                                    Cep Telefonu
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">📱</span>
                                    <input
                                        type="tel"
                                        placeholder="5XX XXX XX XX"
                                        value={form.telefon}
                                        onChange={(e) => guncelle("telefon", e.target.value)}
                                        autoComplete="tel"
                                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#00519E]/10 placeholder-gray-400 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">
                                    Doğum Tarihi
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🎂</span>
                                    <input
                                        type="date"
                                        value={form.dogumTarihi}
                                        onChange={(e) => guncelle("dogumTarihi", e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-[#00519E] focus:ring-2 focus:ring-[#00519E]/10 text-gray-600 transition-all"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Cinsiyet */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 block">Cinsiyet</label>
                            <div className="flex flex-wrap gap-3">
                                {["Erkek", "Kadın", "Belirtmek istemiyorum"].map((secenek) => (
                                    <label
                                        key={secenek}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${form.cinsiyet === secenek
                                                ? "border-[#00519E] bg-[#00519E]/5 text-[#00519E]"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="cinsiyet"
                                            value={secenek}
                                            checked={form.cinsiyet === secenek}
                                            onChange={() => guncelle("cinsiyet", secenek)}
                                            className="sr-only"
                                        />
                                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${form.cinsiyet === secenek
                                                ? "border-[#00519E] bg-[#00519E]"
                                                : "border-gray-400"
                                            }`} />
                                        {secenek}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Onay Metinleri */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        onChange={(e) => {
                                            setHatalar((h) => ({ ...h, sozlesme: "" }));
                                            setSozlesme(e.target.checked);
                                        }}
                                        checked={sozlesme}
                                    />
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${sozlesme
                                            ? "bg-[#00519E] border-[#00519E]"
                                            : hatalar.sozlesme
                                                ? "border-red-400"
                                                : "border-gray-400 group-hover:border-[#00519E]"
                                        }`}>
                                        {sozlesme && <span className="text-white text-[10px] font-black">✓</span>}
                                    </div>
                                </div>
                                <span className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                    <Link href="/" className="text-[#00519E] underline hover:no-underline font-bold">
                                        Üyelik Sözleşmesi
                                    </Link>
                                    &apos;ni ve{" "}
                                    <Link href="/" className="text-[#00519E] underline hover:no-underline font-bold">
                                        Gizlilik Politikası
                                    </Link>
                                    &apos;nı okudum ve kabul ediyorum.{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                            </label>
                            {hatalar.sozlesme && (
                                <p className="text-xs text-red-500 font-medium flex items-center gap-1 pl-7">
                                    <span>⚠</span> {hatalar.sozlesme}
                                </p>
                            )}

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5">
                                    <input type="checkbox" className="sr-only" />
                                    <div className="w-4 h-4 rounded border-2 border-gray-400 group-hover:border-[#00519E] flex items-center justify-center transition-all" />
                                </div>
                                <span className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                    Kampanya, indirim ve yeni ürün bildirimlerini e-posta ile almak istiyorum.
                                </span>
                            </label>

                        </div>

                        {/* Butonlar */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Link
                                href="/giris"
                                className="flex items-center justify-center w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl text-sm hover:bg-gray-200 active:scale-[0.99] transition-all text-center"
                            >
                                İptal
                            </Link>
                            <button
                                type="submit"
                                disabled={yukleniyor}
                                className="flex items-center justify-center gap-2 w-full bg-[#00519E] text-white font-black py-3.5 rounded-xl text-sm hover:bg-[#003d7a] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {yukleniyor ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    "Üye Ol"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Zaten Üye misiniz */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-white text-center space-y-2">
                <p className="text-sm font-bold text-gray-800">Zaten üye misiniz?</p>
                <Link
                    href="/giris"
                    className="inline-block w-full border-2 border-[#00519E] text-[#00519E] font-black py-3 rounded-xl text-sm text-center hover:bg-[#00519E] hover:text-white active:scale-[0.99] transition-all"
                >
                    Giriş Yap
                </Link>
            </div>

        </div>
    );
}

// ─── Sayfa ────────────────────────────────────────────────────────────────────
export default function KayitPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-10 px-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 select-none mb-8">
                <span className="text-[#F2A900] text-2xl font-black italic">{'///'}</span>
                <span className="text-[#00519E] text-3xl font-black italic tracking-tighter">istikbal</span>
            </Link>

            {/* İçerik — searchParams için Suspense şart */}
            <Suspense fallback={
                <div className="w-full max-w-[580px] flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#00519E]/20 border-t-[#00519E] rounded-full animate-spin" />
                </div>
            }>
                <KayitFormu />
            </Suspense>

            {/* Alt Bilgi */}
            <p className="mt-8 text-xs text-gray-400 text-center pb-6">
                © 2025 İstikbal Mobilya. Tüm hakları saklıdır.
            </p>

        </div>
    );
}
