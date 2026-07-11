"use client";

import { useState, useEffect } from "react";
import { useSepet } from "@/context/SepetContext";

export default function Home() {
  const { sepeteEkle } = useSepet();
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderVerileri = [
    {
      id: 1,
      ustBaslik: "YENİ SEZON ESİNTİSİ",
      baslik: "Evinde İstikbal Konforuna Yer Aç!",
      aciklama: "Yenilikçi tasarımlar, kurumsal güvence ve %40'a varan evlilik/yenileme indirimleriyle hayalindeki evi tasarla.",
      bgGradient: "from-[#0F365C] to-[#00519E]"
    },
    {
      id: 2,
      ustBaslik: "YATAKLARDA BÜYÜK FIRSAT",
      baslik: "Kurban Bayramına Özel Uykular",
      aciklama: "Seçili yatak, baza ve başlıklarda net %20 indirim fırsatını kaçırmayın. Sağlıklı uyku her evin hakkı.",
      bgGradient: "from-[#9A1B1F] to-[#E30613]"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderVerileri.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderVerileri.length]);

  const urunler = [
    { id: 1, isim: "Lena Koltuk Takımı (3+3+B)", kategori: "Koltuk Takımı", eskiFiyat: "64.900 TL", yeniFiyat: "45.430 TL", indirim: "%30 İndirim", etiket: "Çok Satan", emoji: "🛋️" },
    { id: 2, isim: "Vera Yemek Odası Takımı", kategori: "Yemek Odası", eskiFiyat: "52.300 TL", yeniFiyat: "39.225 TL", indirim: "%25 İndirim", etiket: "Yeni", emoji: "🪑" },
    { id: 3, isim: "Optimal Prime Yatak Baza Başlık Seti", kategori: "Yatak & Baza", eskiFiyat: "28.400 TL", yeniFiyat: "19.880 TL", indirim: "%30 İndirim", etiket: "Fırsat Ürünü", emoji: "🛏️" },
    { id: 4, isim: "Diego Duvar Ünitesi", kategori: "Tv Ünitesi", eskiFiyat: "18.600 TL", yeniFiyat: "14.880 TL", indirim: "%20 İndirim", etiket: "Kargo Bedava", emoji: "📺" }
  ];

  return (
    <div className="w-full bg-[#F8F9FA] pb-24 font-sans antialiased">

      {/* KAHRAMAN SLIDER: w-full yapıldı, ekranı orijinali gibi tam doldurur */}
      <div className="w-full px-4 md:px-12 pt-6">
        <div className={`w-full bg-gradient-to-r ${sliderVerileri[currentSlide].bgGradient} rounded-2xl p-6 md:p-16 flex flex-col md:flex-row justify-between items-center text-white min-h-[350px] md:min-h-[450px] shadow-md relative overflow-hidden transition-all duration-700`}>

          <div className="max-w-xl z-10 space-y-4 md:space-y-6 text-center md:text-left">
            <span className="bg-[#F2A900] text-[#00519E] text-[10px] md:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {sliderVerileri[currentSlide].ustBaslik}
            </span>
            <h2 className="text-2xl md:text-5xl font-black tracking-tight leading-tight">
              {sliderVerileri[currentSlide].baslik}
            </h2>
            <p className="text-gray-200 text-xs md:text-lg font-light">
              {sliderVerileri[currentSlide].aciklama}
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              <button className="bg-[#E30613] text-white font-bold px-6 md:px-8 py-2.5 md:py-3.5 rounded-md text-xs md:text-sm uppercase tracking-wide cursor-pointer">
                Şimdi Keşfet
              </button>
            </div>
          </div>

          {/* Sağ Alan Temsili Görsel Kutusu: Mobilde yer kaplamasın diye gizlendi (hidden md:flex) */}
          <div className="w-[340px] h-[220px] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col justify-center items-center p-6 text-center z-10 hidden md:flex">
            <span className="text-4xl mb-2">🛋️</span>
            <h4 className="font-black text-base">Hızlı Teslimat Güvencesi</h4>
            <p className="text-xs text-gray-200 mt-1">30 günde kapında.</p>
          </div>
        </div>
      </div>

      {/* POPÜLER ÜRÜNLER VİTRİNİ */}
      <div className="w-full px-4 md:px-12 mt-16">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-lg md:text-2xl font-black text-[#00519E] tracking-tight uppercase">Sizin İçin Seçtiklerimiz</h3>
          </div>
        </div>

        {/* ÜRÜN KARTLARI GRID YAPISI: Mobilde 1, tablette 2, bilgisayarda 4 sütun (Tam Uyumlu) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {urunler.map((urun) => (
            <div key={urun.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded">{urun.indirim}</span>
                </div>
                <div className="w-full h-40 md:h-48 bg-[#F8F9FA] rounded-lg flex items-center justify-center text-4xl md:text-5xl shadow-inner">
                  {urun.emoji}
                </div>
                <div className="mt-4">
                  <span className="text-[10px] text-[#F2A900] font-black uppercase tracking-widest block">{urun.kategori}</span>
                  <h4 className="font-bold text-[#00519E] text-sm mt-1 line-clamp-2 h-10">{urun.isim}</h4>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 line-through">{urun.eskiFiyat}</span>
                  <span className="text-lg md:text-xl font-black text-[#E30613] mt-0.5">{urun.yeniFiyat}</span>
                </div>
                <button
                  onClick={() => sepeteEkle({ id: urun.id, isim: urun.isim, yeniFiyat: urun.yeniFiyat, emoji: urun.emoji, kategori: urun.kategori })}
                  className="w-full mt-4 bg-white border border-[#00519E] hover:bg-[#00519E] hover:text-white text-[#00519E] font-black py-2.5 rounded-md text-xs transition-colors shadow-sm cursor-pointer uppercase tracking-wide"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}