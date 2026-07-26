"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSepet } from "@/context/SepetContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Sofa, Armchair, Table, Monitor, 
  Tv, 
  Utensils, Archive, 
  Bed, DoorClosed, Layers, Zap, User, Baby, Leaf, Ruler, Star, 
  Scale, 
  BookOpen, 
  TreePine, Flower2, 
  Coffee, 
  Sprout, 
  Zap as Lightning 
} from "lucide-react";

// İkon eşleştirme fonksiyonu
const getIconForButton = (buttonName: string) => {
  const iconMap: { [key: string]: any } = {
    // OTURMA ODASI
    "Koltuk Takımları": Sofa,
    "Berjer": Armchair,
    "Sehpalar": Table,
    "Köşe Koltuk Takımı": Sofa,
    "TV Koltukları": Armchair,
    "Kanepe / Koltuk": Sofa,
    "TV Ünitesi": Tv,
    // YEMEK ODASI
    "Yemek Odası Takımı": Utensils,
    "Mutfak Masa Takımları": Table,
    "Konsol": Archive,
    "Konsol Aynası": Monitor,
    "Vitrin": Archive,
    "Gümüşlük": Archive,
    "Yemek Masası": Table,
    "Sandalye": Armchair,
    // YATAK ODASI
    "Yatak Odası Takımları": Bed,
    "Dolap": DoorClosed,
    "Şifonyer": Archive,
    "Komodin": Table,
    "Makyaj Masası": Table,
    "Makyaj Aynası": Monitor,
    "Karyola": Bed,
    "Karyola Başlıkları": Bed,
    // YATAK
    "Malzemeye göre yataklar": Layers,
    "Pedli Yataklar": Bed,
    "Sünger Yataklar": Layers,
    "Visco Yataklar": Zap,
    "Yaylı Yataklar": Zap,
    "Ölçüye göre yataklar": Ruler,
    "Tek Kişilik Yataklar": User,
    "Çift Kişilik Yataklar": User,
    "Bebek Yatağı": Baby,
    "Sertliğe göre yataklar": Scale,
    "Yumuşak Yataklar": Zap,
    "Orta - Sert Yataklar": Zap,
    "Sert Yataklar": Zap,
    "SL & Bonel Yaylı Yataklar": Zap,
    "17 - 22 cm": Ruler,
    "23 - 28 cm": Ruler,
    "29 - 33 cm": Ruler,
    "34 cm +": Ruler,
    "En Çok Satan Ürünler": Star,
    "Teknolojiye göre yataklar": Zap,
    "Hybrid Yataklar": Zap,
    "Lateks Yataklar": Leaf,
    "Pocket Yaylı Yataklar": Zap,
    "Yüksekliğe göre yataklar": Ruler,
    // BAZA VE BAŞLIK
    "Baza": Bed,
    "Başlık": Bed,
    "Baza altı düzeni nasıl olmalı": Archive,
    "Yatak odalarında baza mı karyola mı tercih edilmeli": Scale,
    // GENÇ VE ÇOCUK ODASI
    "Genç Odası Takımları": Bed,
    "Genç Odası Şifonyer": Archive,
    "Genç Odası Başlık": Bed,
    "Çalışma Masası": Table,
    "Oyuncu Koltuğu": Armchair,
    "Bebek Odası Takımları": Baby,
    "Kitaplık": BookOpen,
    "Genç Odası Karyola": Bed,
    "Çalışma Sandalyesi": Armchair,
    "Genç Odası Dolap": DoorClosed,
    "Genç Odası Komodin": Table,
    "Ranza": Bed,
    "Bebek Beşiği": Baby,
    "Pencere önü dekorasyonu": Monitor,
    // BAHÇE MOBİLYASI
    "Bahçe Masa Takımları": Table,
    "Bahçe Köşe Takımları": Sofa,
    "Salıncaklar": TreePine,
    "Bahçe Masaları": Table,
    "Bahçe Sehpaları": Table,
    "Bahçe Koltukları": Armchair,
    "Veranda Nedir? Veranda Dekorasyonu": TreePine,
    "Kış bahçesi tasarımı için dekorasyon ürünleri": Flower2,
    // TAMAMLAYICI ÜRÜNLER
    "Portmanto ve Vestiyer": DoorClosed,
    "Dresuar": Archive,
    "Puf": Table,
    "Orta Sehpa": Coffee,
    "Yan Sehpa": Coffee,
    "Zigon Sehpa": Table,
    "Tv Sehpası": Tv,
    "Markiz": Table,
    "Evinizi Canlandırın: Popüler Sukulent çeşitleri ve Bakım ürünleri": Sprout,
    // ONLINE ÖZEL
    "Köşe Koltuk Takımları": Sofa,
    "Yatak": Bed,
    "Baza Başlık": Bed,
    "Online Özel TV Sehpaları!": Tv,
  };
  
  return iconMap[buttonName] || null;
};

const MEGA_MENU_DATA = [
    {
        id: "oturma-odasi",
        isim: "OTURMA ODASI",
        sutunlar: [
            { isim: "Koltuk Takımları", url: "https://www.istikbal.com.tr/kategori/koltuk-takimlari" },
            { isim: "Berjer", url: "https://www.istikbal.com.tr/kategori/berjer" },
            { isim: "Sehpalar", url: "https://www.istikbal.com.tr/kategori/sehpalar" },
            { isim: "Köşe Koltuk Takımı", url: "https://www.istikbal.com.tr/kategori/kose-takimlari" },
            { isim: "TV Koltukları", url: "https://www.istikbal.com.tr/kategori/tv-koltugu-1" },
            { isim: "Kanepe / Koltuk", url: "https://www.istikbal.com.tr/kategori/kanepe-koltuk" },
            { isim: "TV Ünitesi", url: "https://www.istikbal.com.tr/kategori/tv-unitesi-1" }
        ],
        rehberYazi: "Temizlik ve Bakım Rehberi",
        rehberEmoji: "🧼",
        enCokSatan: { isim: "Freya Koltuk Takımı", fiyat: "39.365,00 TL", emoji: "🛋️" }
    },
    {
        id: "yemek-odasi",
        isim: "YEMEK ODASI",
        sutunlar: [
            { isim: "Yemek Odası Takımı", url: "https://www.istikbal.com.tr/kategori/yemek-odasi-takimi" },
            { isim: "Mutfak Masa Takımları", url: "https://www.istikbal.com.tr/kategori/mutfak-masa-takimi" },
            { isim: "Konsol", url: "https://www.istikbal.com.tr/kategori/konsol" },
            { isim: "Konsol Aynası", url: "https://www.istikbal.com.tr/kategori/konsol-aynasi" },
            { isim: "Vitrin", url: "https://www.istikbal.com.tr/kategori/vitrin" },
            { isim: "Gümüşlük", url: "https://www.istikbal.com.tr/kategori/gumusluk" },
            { isim: "Yemek Masası", url: "https://www.istikbal.com.tr/kategori/yemek-masasi" },
            { isim: "Sandalye", url: "https://www.istikbal.com.tr/kategori/sandalye" }
        ],
        rehberYazi: "Yeni Mobilya Kokusu Nasıl Giderilir?",
        rehberEmoji: "🪚",
        enCokSatan: { isim: "Legato Yemek Odası Takımı", fiyat: "55.415,00 TL", emoji: "🪑" }
    },
    {
        id: "yatak-odasi",
        isim: "YATAK ODASI",
        sutunlar: [
            { isim: "Yatak Odası Takımları", url: "https://www.istikbal.com.tr/kategori/yatak-odasi-takimi" },
            { isim: "Dolap", url: "https://www.istikbal.com.tr/kategori/dolap" },
            { isim: "Şifonyer", url: "https://www.istikbal.com.tr/kategori/sifonyer" },
            { isim: "Komodin", url: "https://www.istikbal.com.tr/kategori/komodin" },
            { isim: "Makyaj Masası", url: "https://www.istikbal.com.tr/kategori/makyaj-masasi" },
            { isim: "Makyaj Aynası", url: "https://www.istikbal.com.tr/kategori/makyaj-aynasi" },
            { isim: "Karyola", url: "https://www.istikbal.com.tr/kategori/karyola" },
            { isim: "Karyola Başlıkları", url: "https://www.istikbal.com.tr/kategori/karyola-basliklari" }
        ],
        rehberYazi: "Ergonomi Nedir?",
        rehberEmoji: "🛏️",
        enCokSatan: { isim: "Masif Ahşap Ne Demek?", fiyat: "Tavsiye Rehberi", emoji: "🪵" }
    },
    {
        id: "yatak",
        isim: "YATAK (GRUPLANDIRILMIŞ YAPI)",
        isYatakOzel: true,
        gruplar: [
            {
                baslik: "MALZEMEYE GÖRE YATAKLAR",
                ogeler: [
                    { isim: "Malzemeye göre yataklar", url: "https://www.istikbal.com.tr/kategori/malzemeye-gore-yataklar" },
                    { isim: "Pedli Yataklar", url: "https://www.istikbal.com.tr/kategori/pedli-yataklar" },
                    { isim: "Sünger Yataklar", url: "https://www.istikbal.com.tr/kategori/sunger-yataklar" },
                    { isim: "Visco Yataklar", url: "https://www.istikbal.com.tr/kategori/visco-yataklar" },
                    { isim: "Yaylı Yataklar", url: "https://www.istikbal.com.tr/kategori/yayli-yataklar" }
                ]
            },
            {
                baslik: "ÖLÇÜYE GÖRE YATAKLAR",
                ogeler: [
                    { isim: "Ölçüye göre yataklar", url: "https://www.istikbal.com.tr/kategori/olcuye-gore-yataklar" },
                    { isim: "Tek Kişilik Yataklar", url: "https://www.istikbal.com.tr/kategori/tek-kisilik-yataklar" },
                    { isim: "Çift Kişilik Yataklar", url: "https://www.istikbal.com.tr/kategori/cift-kisilik-yataklar" },
                    { isim: "Bebek Yatağı", url: "https://www.istikbal.com.tr/kategori/bebek-yatagi" }
                ]
            },
            {
                baslik: "SERTLİĞE GÖRE YATAKLAR",
                ogeler: [
                    { isim: "Sertliğe göre yataklar", url: "https://www.istikbal.com.tr/kategori/yatak-sertligi" },
                    { isim: "Yumuşak Yataklar", url: "https://www.istikbal.com.tr/kategori/yumusak-yataklar" },
                    { isim: "Orta - Sert Yataklar", url: "https://www.istikbal.com.tr/kategori/orta-sert-yataklar" },
                    { isim: "Sert Yataklar", url: "https://www.istikbal.com.tr/kategori/sert-yataklar" }
                ]
            },
            {
                baslik: "TEKNOLOJİYE GÖRE YATAKLAR",
                ogeler: [
                    { isim: "Teknolojiye göre yataklar", url: "https://www.istikbal.com.tr/kategori/teknolojiye-gore-yataklar" },
                    { isim: "Hybrid Yataklar", url: "https://www.istikbal.com.tr/kategori/hybrid-yataklar" },
                    { isim: "Lateks Yataklar", url: "https://www.istikbal.com.tr/kategori/lateks-ve-visco-yataklar" },
                    { isim: "Pocket Yaylı Yataklar", url: "https://www.istikbal.com.tr/kategori/pocket-yayli-yataklar" },
                    { isim: "SL & Bonel Yaylı Yataklar", url: "https://www.istikbal.com.tr/kategori/sl-bonel-yayli-yataklar" }
                ]
            },
            {
                baslik: "YÜKSEKLİĞE GÖRE YATAKLAR",
                ogeler: [
                    { isim: "Yüksekliğe göre yataklar", url: "https://www.istikbal.com.tr/kategori/yatak-yuksekligi" },
                    { isim: "17 - 22 cm", url: "https://www.istikbal.com.tr/kategori/17-22-cm" },
                    { isim: "23 - 28 cm", url: "https://www.istikbal.com.tr/kategori/23-28-cm" },
                    { isim: "29 - 33 cm", url: "https://www.istikbal.com.tr/kategori/29-33-cm" },
                    { isim: "34 cm +", url: "https://www.istikbal.com.tr/kategori/34-cm" }
                ]
            },
            {
                baslik: "BİLGİ İÇERİĞİ",
                ogeler: [
                    { isim: "En Çok Satan Ürünler", url: "https://www.istikbal.com.tr/blog/icerik/en-cok-tercih-edilen-istikbal-mobilyalari-hangileri?srsltid=AfmBOoo1TtGkSv0ODh6R8xGl9e_8Q_q3gWs-qGC-mlPSjb7aEkw9yN4N" }
                ]
            }
        ],
        rehberYazi: "Teknolojiye Göre Yataklar",
        rehberEmoji: "💤",
        enCokSatan: { isim: "Cooler Reborn Yatak", fiyat: "12.110,00 TL", emoji: "🛏️" }
    },
    {
        id: "baza-baslik",
        isim: "BAZA VE BAŞLIK",
        sutunlar: [
            { isim: "Baza", url: "https://www.istikbal.com.tr/kategori/baza" },
            { isim: "Başlık", url: "https://www.istikbal.com.tr/kategori/baslik" },
            { isim: "Baza altı düzeni nasıl olmalı", url: "https://www.istikbal.com.tr/blog/icerik/baza-alti-duzeni-nasil-olmali" },
            { isim: "Yatak odalarında baza mı karyola mı tercih edilmeli", url: "https://www.istikbal.com.tr/blog/icerik/karyola-ne-demek-yatak-odalarinda-baza-mi-karyola-mi-tercih-edilmeli" }
        ],
        rehberYazi: "Baza Altı Düzeni Nasıl Olmalı",
        rehberEmoji: "📦",
        enCokSatan: { isim: "Yatak Odalarında Baza mı Karyola mı?", fiyat: "İnceleme", emoji: "🛏️" }
    },
    {
        id: "genc-cocuk",
        isim: "GENÇ VE ÇOCUK ODASI",
        sutunlar: [
            { isim: "Genç Odası Takımları", url: "https://www.istikbal.com.tr/kategori/genc-odasi-takimlari" },
            { isim: "Genç Odası Şifonyer", url: "https://www.istikbal.com.tr/kategori/genc-odasi-sifonyer" },
            { isim: "Genç Odası Başlık", url: "https://www.istikbal.com.tr/kategori/genc-odasi-baslik" },
            { isim: "Çalışma Masası", url: "https://www.istikbal.com.tr/kategori/calisma-masasi" },
            { isim: "Oyuncu Koltuğu", url: "https://www.istikbal.com.tr/kategori/oyuncu-koltugu" },
            { isim: "Bebek Odası Takımları", url: "https://www.istikbal.com.tr/kategori/bebek-odasi-takimlari" },
            { isim: "Kitaplık", url: "https://www.istikbal.com.tr/kategori/kitaplik" },
            { isim: "Genç Odası Karyola", url: "https://www.istikbal.com.tr/kategori/genc-odasi-karyola" },
            { isim: "Çalışma Sandalyesi", url: "https://www.istikbal.com.tr/kategori/genc-odasi-sandalyesi" },
            { isim: "Genç Odası Dolap", url: "https://www.istikbal.com.tr/kategori/genc-odasi-dolap" },
            { isim: "Genç Odası Komodin", url: "https://www.istikbal.com.tr/kategori/genc-odasi-komodin" },
            { isim: "Ranza", url: "https://www.istikbal.com.tr/kategori/ranza" },
            { isim: "Bebek Beşiği", url: "https://www.istikbal.com.tr/kategori/besik" },
            { isim: "Pencere önü dekorasyonu", url: "https://www.istikbal.com.tr/blog/icerik/pencere-onu-dekorasyonu" }
        ],
        rehberYazi: "Pencere Önü Dekorasyonu",
        rehberEmoji: "🪟",
        enCokSatan: { isim: "Borneo Bohem Genç Odası Takımı", fiyat: "63.169,00 TL", emoji: "👦" },
        sagBolumuKaldir: true
    },
    {
        id: "bahce",
        isim: "BAHÇE MOBİLYASI",
        sutunlar: [
            { isim: "Bahçe Masa Takımları", url: "https://www.istikbal.com.tr/kategori/bahce-masa-takimlari" },
            { isim: "Bahçe Köşe Takımları", url: "https://www.istikbal.com.tr/kategori/bahce-kose-takimlari" },
            { isim: "Salıncaklar", url: "https://www.istikbal.com.tr/kategori/salincaklar" },
            { isim: "Bahçe Masaları", url: "https://www.istikbal.com.tr/kategori/bahce-masalari" },
            { isim: "Bahçe Sehpaları", url: "https://www.istikbal.com.tr/kategori/bahce-sehpalari" },
            { isim: "Bahçe Koltukları", url: "https://www.istikbal.com.tr/kategori/bahce-koltuklari" },
            { isim: "Veranda Nedir? Veranda Dekorasyonu", url: "https://www.istikbal.com.tr/blog/icerik/veranda-nedir-veranda-dekorasyonu-icin-en-iyi-mobilya-secimi" },
            { isim: "Kış bahçesi tasarımı için dekorasyon ürünleri", url: "https://www.istikbal.com.tr/blog/icerik/kis-bahcesi-tasarimi-icin-dekorasyon-onerileri" }
        ],
        rehberYazi: "Veranda Nedir? Veranda Dekorasyonu",
        rehberEmoji: "🏡",
        enCokSatan: { isim: "Kış Bahçesi Tasarımı Önerileri", fiyat: "Fikir Rehberi", emoji: "🌿" }
    },
    {
        id: "tamamlayici",
        isim: "TAMAMLAYICI ÜRÜNLER",
        sutunlar: [
            { isim: "Portmanto ve Vestiyer", url: "https://www.istikbal.com.tr/kategori/portmanto" },
            { isim: "Dresuar", url: "https://www.istikbal.com.tr/kategori/dresuar" },
            { isim: "Puf", url: "https://www.istikbal.com.tr/kategori/puf" },
            { isim: "Orta Sehpa", url: "https://www.istikbal.com.tr/kategori/orta-sehpa-2" },
            { isim: "Yan Sehpa", url: "https://www.istikbal.com.tr/kategori/yan-sehpa-2" },
            { isim: "Zigon Sehpa", url: "https://www.istikbal.com.tr/kategori/zigon-sehpa-1" },
            { isim: "Tv Sehpası", url: "https://www.istikbal.com.tr/kategori/tv-sehpasi" },
            { isim: "Markiz", url: "https://www.istikbal.com.tr/kategori/markiz" },
            { isim: "Evinizi Canlandırın: Popüler Sukulent çeşitleri ve Bakım ürünleri", url: "https://www.istikbal.com.tr/blog" }
        ],
        rehberYazi: "Evinizi Canlandırın: Sukulent Bakımı",
        rehberEmoji: "🪴",
        enCokSatan: { isim: "Resta Zigon Sehpa", fiyat: "6.443,00 TL", emoji: "🪵" },
        sagBolumuKaldir: true
    },
    {
        id: "online-ozel",
        isim: "⚡ ONLINE ÖZEL",
        sutunlar: [
            { isim: "Koltuk Takımları", url: "https://www.istikbal.com.tr/kategori/koltuk-takimlari-1" },
            { isim: "Çalışma Masası", url: "https://www.istikbal.com.tr/kategori/online-ozel-calisma-masasi" },
            { isim: "Köşe Koltuk Takımları", url: "https://www.istikbal.com.tr/kategori/kose-koltuk-takimlari" },
            { isim: "Yatak", url: "https://www.istikbal.com.tr/kategori/yatak-1" },
            { isim: "Kitaplık", url: "https://www.istikbal.com.tr/kategori/online-ozel-kitapliklar" },
            { isim: "Baza Başlık", url: "https://www.istikbal.com.tr/kategori/bahce-mobilyasi" },
            { isim: "Online Özel TV Sehpaları!", url: "https://www.istikbal.com.tr/kategori/tv-sehpasi-1" }
        ],
        rehberYazi: "Online Özel TV Sehpaları!",
        rehberEmoji: "📺",
        enCokSatan: { isim: "Siesta Rollpack Yatak", fiyat: "2.999,00 TL", emoji: "🛏️" },
        sagBolumuKaldir: true
    }
];

export default function Header() {
    const { sepetSayisi } = useSepet();
    const { kullanici, cikisYap } = useAuth();
    const [aktifMenu, setAktifMenu] = useState<string | null>(null);
    const [girisAcik, setGirisAcik] = useState(false);
    const [mobilMenuAcik, setMobilMenuAcik] = useState(false);

    const placeholderKelimeListesi = [
        "Yatak + Baza + Başlık Alımlarında Alez veya Yastık Hediye!",
        "Aradığınız koltuk veya yemek odası takımını yazın...",
        "İstikbal kalitesiyle evinizi yenileyecek fırsatlar..."
    ];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholderKelimeListesi.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="w-full bg-white relative z-50 font-sans border-b border-gray-200 antialiased">

            {/* 1. ÜST MAVİ BAR (Masaüstü genişliğinde açılır, mobilde gizlenir) */}
            <div className="w-full bg-[#00519E] text-white py-2 px-4 md:px-12 text-[11px] hidden md:flex justify-between items-center font-semibold tracking-tight">
                <div className="flex gap-6">
                    <span className="cursor-pointer hover:underline">Mağazalarımız</span>
                    <span className="cursor-pointer hover:underline">Kampanyalar</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 cursor-pointer hover:underline">🌐 TR - TL</div>
                    <div className="flex items-center gap-1 cursor-pointer hover:underline">📦 Sipariş Takibi</div>
                    <div className="flex items-center gap-1 text-white/90">📞 0850 222 33 44</div>
                </div>
            </div>

            {/* 2. ORTA BAR (Ekranı tam dolduracak şekilde esnetilmiş ana satır) */}
            <div className="w-full py-4 px-4 md:px-12 flex justify-between items-center gap-4 relative">

                {/* Yüksek Kaliteli Harici Logo Alanı */}
                <Link href="/" className="flex items-center select-none flex-shrink-0 h-[32px] w-[150px] md:h-[40px] md:w-[180px] relative">
                    <Image
                        src="/istikbal-logo.png"
                        alt="İstikbal Logosu"
                        fill
                        priority
                        className="object-contain object-left"
                    />
                </Link>

                {/* HAREKETLİ ARAMA BARO */}
                <div className="flex-1 max-w-2xl mx-2 md:mx-6 flex items-center gap-4">
                    <div className="relative cursor-pointer text-gray-400 hover:text-[#00519E] flex-shrink-0 group hidden md:block transition-colors duration-300 ease-out">
                        <span className="text-xl animate-bellRing inline-block">🔔</span>
                    </div>

                    <div className="flex-1 relative flex items-center">
                        <span className="absolute left-4 text-gray-400 text-sm">🔍</span>
                        <input
                            type="text"
                            placeholder={placeholderKelimeListesi[placeholderIndex]}
                            className="w-full pl-10 pr-4 md:pr-16 py-2 md:py-2.5 text-xs md:text-[13px] font-normal border border-gray-300 rounded-full focus:outline-none focus:border-[#00519E] placeholder-gray-500 bg-white shadow-sm transition-all duration-500"
                        />
                        <button className="absolute right-5 text-xs font-bold text-gray-700 hover:text-[#00519E] cursor-pointer hidden md:block">
                            ARA
                        </button>
                    </div>
                </div>

                {/* SAĞ AKSİYONLAR */}
                <div className="flex items-center gap-4 md:gap-6 text-[12px] md:text-[13px] font-semibold text-gray-700 flex-shrink-0">

                    {/* Giriş / Kullanıcı Popup */}
                    <div className="relative h-full flex items-center py-2">
                        <button
                            onClick={() => setGirisAcik(!girisAcik)}
                            className="flex items-center gap-1.5 hover:text-[#00519E] focus:outline-none cursor-pointer"
                        >
                            <span className="text-base">👤</span>
                            <span className="hidden sm:inline">
                                {kullanici ? kullanici.firstName : "Giriş Yap"}
                            </span>
                        </button>

                        {girisAcik && (
                            <div className="absolute top-[40px] right-0 w-[250px] bg-white border border-gray-200 shadow-2xl rounded-md p-4 z-50 text-left flex flex-col gap-2">
                                {kullanici ? (
                                    <>
                                        <p className="text-xs text-gray-500 font-semibold truncate">
                                            Merhaba, {kullanici.firstName} {kullanici.lastName}
                                        </p>
                                        <Link href="/profil" onClick={() => setGirisAcik(false)} className="w-full bg-gray-100 text-gray-800 text-center py-2 rounded text-[12px] font-bold hover:bg-gray-200 transition-all">Profilim</Link>
                                        <Link href="/siparislerim" onClick={() => setGirisAcik(false)} className="w-full bg-gray-100 text-gray-800 text-center py-2 rounded text-[12px] font-bold hover:bg-gray-200 transition-all">Siparişlerim</Link>
                                        <button
                                            onClick={() => { setGirisAcik(false); cikisYap(); }}
                                            className="w-full border border-red-300 text-red-600 text-center py-2 rounded text-[12px] font-bold hover:bg-red-50 transition-all cursor-pointer"
                                        >
                                            Çıkış Yap
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/giris" onClick={() => setGirisAcik(false)} className="w-full bg-[#00519E] text-white text-center py-2 rounded text-[12px] font-bold hover:bg-opacity-95 transition-all">GİRİŞ YAP</Link>
                                        <Link href="/kayit" onClick={() => setGirisAcik(false)} className="w-full border border-[#E30613] text-[#E30613] text-center py-2 rounded text-[12px] font-bold hover:bg-red-50/50 transition-all">Hemen Üye Ol</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sepetim Bağlantısı */}
                    <Link href="/sepetim" className="flex items-center gap-1.5 hover:text-[#00519E]">
                        <span className="text-base">🛒</span>
                        <span className="hidden sm:inline">Sepetim</span>
                        <span className="bg-[#00519E] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                            {sepetSayisi}
                        </span>
                    </Link>

                    {/* Mobil Cihazlar İçin Menü Tetikleyici Buton */}
                    <button onClick={() => setMobilMenuAcik(!mobilMenuAcik)} className="block lg:hidden text-xl focus:outline-none p-1">
                        {mobilMenuAcik ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* 3. KATEGORİ ÇUBUĞU (9 Bölümün Tümü Eksiksiz Korundu, Esnek ve Ekranı Kaplayan Yapıda) */}
            <div className={`w-full border-t border-gray-200 bg-white ${mobilMenuAcik ? "block" : "hidden lg:block"}`}>
                <div className="w-full px-4 md:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:h-11 text-[13px] font-bold text-gray-900 tracking-tight relative">

                    {MEGA_MENU_DATA.map((menu) => (
                        <div
                            key={menu.id}
                            className="w-full lg:w-auto py-2 lg:py-0 h-full flex flex-col lg:flex-row lg:items-center border-b-2 border-transparent hover:border-[#00519E] transition-all whitespace-nowrap"
                            onMouseEnter={() => setAktifMenu(menu.id)}
                            onMouseLeave={() => setAktifMenu(null)}
                        >
                            <span className={menu.id === "online-ozel" ? "text-[#F2A900] flex items-center gap-0.5 cursor-pointer py-1" : "text-gray-900 hover:text-[#00519E] cursor-pointer py-1"}>
                                {menu.id === "online-ozel" && "⚡ "}
                                {menu.isim}
                            </span>

                            {/* MEGA DROPDOWN PANEL (Premium E-Ticaret Tasarımı) */}
                            {aktifMenu === menu.id && (
                                <div className={`absolute top-11 w-full max-w-[1180px] bg-white border border-gray-200 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] p-6 grid gap-4 z-50 text-left animate-fadeIn ${
                                    menu.id === 'oturma-odasi' ? 'left-0' : 
                                    menu.id === 'online-ozel' ? 'right-0' : 
                                    'left-1/2 -translate-x-1/2'
                                }`} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>

                                    {/* KATEGORİ LİNKLERİ */}
                                    <div className={`col-span-4 grid gap-x-4 gap-y-3 ${
                                        menu.id === 'genc-cocuk' || menu.id === 'tamamlayici' 
                                            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                                            : menu.id === 'bahce' || menu.id === 'online-ozel'
                                                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                                                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                    }`}>
                                        {menu.isYatakOzel && menu.gruplar ? (
                                            // YATAK KATEGORİSİ İÇİN GRUPLANDIRILMIŞ YAPI (Kart Benzeri)
                                            menu.gruplar.map((grup, grupIndex) => (
                                                <div key={grupIndex} className="bg-gray-50 rounded-xl px-[14px] py-[16px] hover:bg-gray-100 transition-all duration-200">
                                                    <div className="font-semibold text-[#00519E] text-sm md:text-base mb-2 leading-tight">
                                                        {grup.baslik}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {grup.ogeler.map((oge, ogeIndex) => {
                                                            const Icon = getIconForButton(oge.isim);
                                                            return (
                                                                <a
                                                                    key={ogeIndex}
                                                                    href={oge.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2.5 text-xs md:text-sm text-gray-700 hover:text-[#00519E] hover:translate-x-1 transition-all duration-200 leading-[1.4]"
                                                                >
                                                                    {Icon && <Icon className="w-[22px] h-[22px] opacity-85 flex-shrink-0 text-[#1F2937]" />}
                                                                    <span className="whitespace-normal break-words">{oge.isim}</span>
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            // DİĞER KATEGORİLER İÇİN STANDART YAPI
                                            menu.sutunlar?.map((sutun, index) => {
                                                const Icon = getIconForButton(sutun.isim);
                                                const isLongText = sutun.isim === "Yatak odalarında baza mı karyola mı tercih edilmeli";
                                                return (
                                                    <a
                                                        key={index}
                                                        href={sutun.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2.5 text-xs md:text-sm text-gray-700 hover:text-[#00519E] hover:bg-gray-50 hover:translate-x-1 px-[14px] py-2 rounded-lg transition-all duration-200 leading-[1.4] ${
                                                            isLongText ? 'min-h-[96px] max-w-[220px]' : 'min-h-[2.5rem] md:min-h-[3rem]'
                                                        }`}
                                                    >
                                                        {Icon && <Icon className="w-[22px] h-[22px] opacity-85 flex-shrink-0 text-[#1F2937]" />}
                                                        <span className={`whitespace-normal break-words text-left ${isLongText ? 'max-w-[220px]' : ''}`}>{sutun.isim}</span>
                                                    </a>
                                                );
                                            })
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>

            {/* 4. SARI DUYURU BARO */}
            <div className="w-full bg-[#FFE600] text-[#00519E] text-center py-2 text-[11px] md:text-[12px] font-black tracking-wide border-t border-b border-yellow-400 select-none leading-[1.25]">
                <span className="block">Yatak + Baza + Başlık</span>
                <span className="block">Alımlarında</span>
                <span className="block">Sürpriz Hediyeler Sizleri Bekliyor</span>
            </div>

        </header>
    );
}