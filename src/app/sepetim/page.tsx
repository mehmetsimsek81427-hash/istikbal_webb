"use client";

import Link from "next/link";
import { useSepet } from "@/context/SepetContext";

export default function SepetimPage() {
    const { sepet, sepeteEkle, sepettenCikar, sepetiTemizle } = useSepet();

    // Fiyat metnini sayıya çeviren yardımcı fonksiyon
    const fiyatıSayiyaCevir = (fiyatStr: string): number => {
        const temiz = fiyatStr.replace("TL", "").replace(/\./g, "").trim();
        return parseFloat(temiz) || 0;
    };

    // Sepetteki tüm ürünlerin toplam tutarını hesaplama
    const toplamTutar = sepet.reduce((toplam, urun) => {
        const fiyat = fiyatıSayiyaCevir(urun.yeniFiyat);
        return toplam + fiyat * urun.adet;
    }, 0);

    // Sayıyı tekrar para formatına getirme
    const formatPara = (tutar: number) => {
        return tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " TL";
    };

    // Kargo ücreti mantığı
    const kargoUcreti = toplamTutar > 15000 || toplamTutar === 0 ? 0 : 750;

    // EĞER SEPET BOŞSA
    if (sepet.length === 0) {
        return (
            <div className="w-full bg-istikbal-gray-light py-16 px-6 min-h-[70vh] flex items-center justify-center">
                <div className="w-full max-w-3xl bg-white rounded-2xl border border-istikbal-gray-border p-8 md:p-12 shadow-sm text-center space-y-6">
                    <div className="w-24 h-24 bg-istikbal-gray-light rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">
                        🛒
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-istikbal-blue tracking-tight">
                            Alışveriş Sepetiniz Boş
                        </h2>
                        <p className="text-istikbal-gray-dark text-sm max-w-md mx-auto">
                            Görünüşe göre sepetinizde henüz bir mobilya bulunmuyor. İstikbal kalitesiyle evinizi yenilemek için hemen ürünlerimize göz atabilirsiniz.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-block bg-istikbal-blue hover:bg-opacity-95 text-white font-bold px-8 py-3 rounded-md shadow-md transition-all text-sm uppercase tracking-wide cursor-pointer"
                        >
                            Alışverişe Başla
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-istikbal-gray-light text-[11px] text-gray-500 font-medium">
                        <div>🛡️ 2 Yıl Garanti</div>
                        <div>🚚 Ücretsiz Montaj</div>
                        <div>🔒 Güvenli Ödeme</div>
                    </div>
                </div>
            </div>
        );
    }

    // EĞER SEPETTE ÜRÜN VARSA
    return (
        <div className="w-full bg-istikbal-gray-light py-12 px-4 md:px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-black text-istikbal-blue uppercase tracking-tight mb-8">
                    Alışveriş Sepetim ({sepet.reduce((acc, item) => acc + item.adet, 0)} Ürün)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* SOL TARAF: SEPETTEKİ ÜRÜNLERİN LİSTESİ */}
                    <div className="lg:col-span-2 space-y-4">
                        {sepet.map((urun) => (
                            <div
                                key={urun.id}
                                className="bg-white rounded-xl border border-istikbal-gray-border p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md"
                            >
                                {/* Ürün Görseli ve Bilgileri */}
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-20 h-20 bg-istikbal-gray-light rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                                        {urun.emoji}
                                    </div>
                                    <div>
                                        <span className="text-[10px] bg-istikbal-blue/5 text-istikbal-blue px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                            {urun.kategori}
                                        </span>
                                        <h3 className="font-bold text-istikbal-blue text-sm mt-1">
                                            {urun.isim}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Ücretsiz Teslimat & Montaj</p>
                                    </div>
                                </div>

                                {/* Adet Değiştirme Butonları ve Fiyat */}
                                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                                    {/* Adet Seçici */}
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                        <button
                                            onClick={() => sepettenCikar(urun.id)}
                                            className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 font-bold transition-colors cursor-pointer select-none"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 text-xs font-black text-istikbal-blue min-w-[24px] text-center">
                                            {urun.adet}
                                        </span>
                                        <button
                                            onClick={() => sepeteEkle({ id: urun.id, isim: urun.isim, yeniFiyat: urun.yeniFiyat, emoji: urun.emoji, kategori: urun.kategori })}
                                            className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 font-bold transition-colors cursor-pointer select-none"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Fiyat Alanı */}
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">Toplam</span>
                                        <span className="font-black text-istikbal-red text-base">
                                            {formatPara(fiyatıSayiyaCevir(urun.yeniFiyat) * urun.adet)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Sepeti Boşalt Butonu */}
                        <div className="text-right">
                            <button
                                onClick={sepetiTemizle}
                                className="text-xs font-semibold text-gray-400 hover:text-istikbal-red transition-colors cursor-pointer underline"
                            >
                                Sepeti Tamamen Temizle
                            </button>
                        </div>
                    </div>

                    {/* SAĞ TARAF: SİPARİŞ ÖZETİ */}
                    <div className="bg-white rounded-xl border border-istikbal-gray-border p-6 shadow-sm space-y-6 lg:sticky lg:top-6">
                        <h3 className="font-black text-istikbal-blue text-base border-b border-istikbal-gray-light pb-3 uppercase tracking-tight">
                            Sipariş Özeti
                        </h3>

                        <div className="space-y-3 text-sm font-medium text-istikbal-gray-dark">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ara Toplam</span>
                                <span>{formatPara(toplamTutar)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Teslimat & Montaj</span>
                                <span className="text-green-600 font-semibold">Ücretsiz</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Kargo Ücreti</span>
                                <span>{kargoUcreti === 0 ? "Ücretsiz" : formatPara(kargoUcreti)}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-baseline">
                            <span className="font-black text-istikbal-blue text-base">Genel Toplam</span>
                            <span className="font-black text-2xl text-istikbal-red tracking-tight">
                                {formatPara(toplamTutar + kargoUcreti)}
                            </span>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button className="w-full bg-istikbal-red hover:bg-opacity-95 text-white font-bold py-3.5 rounded-md text-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer text-center block">
                                Alışverişi Tamamla
                            </button>
                            <Link
                                href="/"
                                className="w-full bg-white border border-istikbal-blue hover:bg-istikbal-blue/5 text-istikbal-blue font-bold py-3 rounded-md text-sm uppercase tracking-wider transition-all text-center block cursor-pointer"
                            >
                                Alışverişe Devam Et
                            </Link>
                        </div>

                        {/* Güvenlik Rozeti */}
                        <div className="pt-2 text-center text-[11px] text-gray-400 font-medium flex items-center justify-center gap-1.5">
                            🔒 256-Bit SSL Sertifikası ile Güvenli Alışveriş
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}